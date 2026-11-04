"""Grainy smeared-light backgrounds for the Upwards page: a honey ribbon that zigzags upwards over slate.

  python upwards-bg.py <out.jpg> <width> <height> <seed> [shift] [tip reach] [rise]
Needs numpy and Pillow. NO_GRAIN=1 leaves the grain out (the page adds it in CSS). The page's images:
  NO_GRAIN=1 python upwards-bg.py hero.jpg 1800 1260 7 -0.13 0.7 0.55    -> public/images/work/upwards/bg-hero.webp
  NO_GRAIN=1 python upwards-bg.py stage.jpg 1100 1400 11 -0.15 0.55 0.5  -> public/images/work/upwards/bg-stage.webp
(saved as WebP, quality 82)
"""
import sys
import numpy as np
from PIL import Image, ImageFilter

out, W, H, seed = sys.argv[1], int(sys.argv[2]), int(sys.argv[3]), int(sys.argv[4])
shift = float(sys.argv[5]) if len(sys.argv) > 5 else 0.0
amp_k = float(sys.argv[6]) if len(sys.argv) > 6 else 1.0  # how far the tips reach
rise_k = float(sys.argv[7]) if len(sys.argv) > 7 else 1.0  # how much it drifts right going up
rng = np.random.default_rng(seed)

u = np.linspace(0, 1, W)[None, :]
v = np.linspace(0, 1, H)[:, None]
aspect = W / H


def smooth_noise(gw, gh, scale=1.0):
    """Low-frequency noise: a small random grid scaled up smoothly. Values ~0..1."""
    g = (rng.random((gh, gw)) * 255).astype(np.uint8)
    img = Image.fromarray(g, "L").resize((W, H), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32) / 255.0 * scale


def row_noise(n):
    """Per-row noise, stretched across the width: gives the horizontal streaks."""
    g = (rng.random((n, 1)) * 255).astype(np.uint8)
    img = Image.fromarray(g, "L").resize((1, H), Image.BICUBIC)
    return np.asarray(img, dtype=np.float32)[:, :1] / 255.0


def ribbon(phase, freq, amp, rise, width, smear, soft):
    """A ribbon whose right edge zigzags with sharp tips pointing right, drifting right as it goes up."""
    s = np.abs(np.sin(np.pi * (freq * v + phase)))
    tip = (1 - s) ** 1.7  # cusps at s=0: sharp points
    xc = 0.16 + shift + rise * rise_k * (1 - v) + amp * amp_k * tip + 0.03 * np.sin(5.3 * v + phase * 3)
    d = xc - u  # > 0 left of the edge
    streak = row_noise(int(H / 16))
    sm = smear * (0.65 + 0.7 * streak)
    edge = 1 / (1 + np.exp(-d / soft))
    body = np.exp(-np.maximum(0, d - width) / sm)
    return edge * body * (0.78 + 0.32 * row_noise(int(H / 9)))


I = ribbon(phase=0.12, freq=2.15, amp=0.34, rise=0.36, width=0.05, smear=0.16, soft=0.016)
I += 0.42 * ribbon(phase=0.47, freq=2.15, amp=0.26, rise=0.36, width=0.02, smear=0.10, soft=0.02)
I = np.clip(I, 0, 1.25)

# Smear sideways a little more, so the light drags left like a long exposure.
k = max(8, W // 14)
c = np.cumsum(np.pad(I, ((0, 0), (k, 0)), mode="edge"), axis=1)
I = 0.55 * I + 0.45 * (c[:, k:] - c[:, :-k]) / k
I = np.clip(I, 0, 1.2)

# Soften like an out-of-focus photo: more blur up and down than sideways keeps the streaks but loses the scanlines.
def box(a, r, axis):
    """Box blur of radius r along one axis; three passes approximate a Gaussian."""
    if r < 1:
        return a
    pad = [(0, 0), (0, 0)]
    pad[axis] = (r + 1, r)
    c = np.cumsum(np.pad(a, pad, mode="edge"), axis=axis)
    hi = np.take(c, range(2 * r + 1, c.shape[axis]), axis=axis)
    lo = np.take(c, range(0, c.shape[axis] - 2 * r - 1), axis=axis)
    return (hi - lo) / (2 * r + 1)


for _ in range(3):
    I = box(I, max(1, H // 260), 0)
    I = box(I, max(1, W // 700), 1)

# Slate base with soft variation, cooler and darker to the top right, a warm haze bottom right.
base_lo = np.array([0.14, 0.165, 0.18])
base_hi = np.array([0.30, 0.335, 0.35])
mix = np.clip(0.55 * (1 - u) + 0.25 * v + 0.35 * (smooth_noise(5, 4) - 0.5), 0, 1)[..., None]
base = base_lo + (base_hi - base_lo) * mix
haze = np.exp(-(((u - 0.95) * aspect) ** 2 + (v - 0.92) ** 2) / 0.09)[..., None]
base = base + haze * np.array([0.32, 0.17, 0.11])

# Light ramp: dusty amber at the fringe, orange in the body, honey yellow at the hot core.
stops = [
    (0.0, np.array([0.33, 0.30, 0.29])),
    (0.35, np.array([0.80, 0.42, 0.27])),
    (0.7, np.array([0.98, 0.54, 0.28])),
    (1.0, np.array([1.0, 0.72, 0.42])),
    (1.2, np.array([1.0, 0.86, 0.52])),
]
col = np.zeros((H, W, 3), np.float32)
for (a, ca), (b, cb) in zip(stops, stops[1:]):
    t = np.clip((I - a) / (b - a), 0, 1)[..., None]
    inside = ((I >= a) & (I < b))[..., None] if b < stops[-1][0] else (I >= a)[..., None]
    col = np.where(inside, ca + (cb - ca) * t, col)
alpha = np.clip(I / 0.38, 0, 1)[..., None] ** 1.3
rgb = base * (1 - alpha) + col * alpha

# Vignette, then film grain.
vig = 1 - 0.18 * (((u - 0.5) * 1.6) ** 2 + ((v - 0.5) * 1.6) ** 2)[..., None]
rgb = rgb * vig
grain = rng.normal(0, 1, (H, W, 1)).astype(np.float32)
import os
g = 0.0 if os.environ.get("NO_GRAIN") else 1.0  # the page adds grain in CSS, so the image stays small
rgb = rgb + g * (grain * 0.04 + rng.normal(0, 0.012, (H, W, 3)))
rgb = np.clip(rgb, 0, 1)

Image.fromarray((rgb * 255).astype(np.uint8), "RGB").save(out, quality=84, optimize=True, progressive=True)
print(out)
