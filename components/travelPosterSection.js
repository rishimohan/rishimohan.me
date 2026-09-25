import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import TravelPoster, {
  FONT_CSS,
  FORMATS,
  YEARS,
} from "components/travelPoster";
import AnchorHeading from "components/anchorHeading";

const toDataUrl = (blob) =>
  new Promise((resolve) => {
    const r = new FileReader();
    r.onload = () => resolve(r.result);
    r.readAsDataURL(blob);
  });

// An SVG drawn to a canvas can't fetch web fonts, so inline them as data URLs
let fontCss;
async function embeddedFontCss() {
  if (!fontCss) {
    fontCss = (async () => {
      const css = await (await fetch(FONT_CSS)).text();
      const blocks = [
        ...css.matchAll(/\/\* (latin(?:-ext)?) \*\/\s*(@font-face\s*{[^}]*})/g),
      ].map((m) => m[2]);
      const inlined = await Promise.all(
        blocks.map(async (block) => {
          const url = block.match(/url\((https:[^)]+)\)/)[1];
          const data = await toDataUrl(await (await fetch(url)).blob());
          return block.replace(url, data);
        })
      );
      return inlined.join("\n");
    })();
  }
  return fontCss;
}

function Segmented({ options, value, onChange }) {
  return (
    <div className="inline-flex p-1 rounded-xl bg-gray-500/10 text-[13px] whitespace-nowrap">
      {options.map(([v, label]) => (
        <button
          key={String(v)}
          onClick={() => onChange(v)}
          className={clsx(
            "px-2 py-0.5 rounded-lg transition-colors tabular-nums",
            value === v
              ? "bg-white dark:bg-gray-800 shadow-sm font-medium"
              : "opacity-60 hover:opacity-100"
          )}
        >
          {label}
        </button>
      ))}
    </div>
  );
}

export default function PosterSection() {
  const [year, setYear] = useState(null);
  const [format, setFormat] = useState("portrait");
  const [busy, setBusy] = useState(null);
  const [copied, setCopied] = useState(false);
  const svgRef = useRef(null);
  const [fontFaces, setFontFaces] = useState(null);

  useEffect(() => {
    embeddedFontCss()
      .then(setFontFaces)
      .catch(() => {});
  }, []);

  // Rasterise the SVG at 2x so it stays crisp when posted
  const toPng = async () => {
    const { w, h } = FORMATS[format];
    const clone = svgRef.current.cloneNode(true);
    const style = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "style"
    );
    style.textContent = await embeddedFontCss();
    clone.insertBefore(style, clone.firstChild);
    const svg = new XMLSerializer().serializeToString(clone);
    const url = URL.createObjectURL(
      new Blob([svg], { type: "image/svg+xml;charset=utf-8" })
    );
    try {
      const img = new Image();
      await new Promise((resolve, reject) => {
        img.onload = resolve;
        img.onerror = reject;
        img.src = url;
      });
      const canvas = document.createElement("canvas");
      canvas.width = w * 2;
      canvas.height = h * 2;
      const ctx = canvas.getContext("2d");
      ctx.scale(2, 2);
      ctx.drawImage(img, 0, 0, w, h);
      return await new Promise((r) => canvas.toBlob(r, "image/png"));
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  const download = async () => {
    setBusy("download");
    try {
      const a = document.createElement("a");
      a.href = URL.createObjectURL(await toPng());
      a.download = `rishi-travel-${year || "all-time"}-${format}.png`;
      a.click();
      URL.revokeObjectURL(a.href);
    } finally {
      setBusy(null);
    }
  };

  // Safari needs the ClipboardItem created synchronously with a pending blob
  const copy = async () => {
    setBusy("copy");
    try {
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": toPng() }),
      ]);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {
      console.error("Copy failed", e);
    } finally {
      setBusy(null);
    }
  };

  return (
    <section className="w-full max-w-[620px] mx-auto px-5 mt-16">
      {fontFaces && <style>{fontFaces}</style>}
      <AnchorHeading as="h3" id="poster" className="mb-1 text-lg font-bold">
        Poster
      </AnchorHeading>
      <p className="opacity-60 mb-5 text-sm">
        A poster of my travels, all time or by year. Copy it or download it as a
        PNG.
      </p>

      <div className="-mx-5 px-5 mb-3 overflow-x-auto [scrollbar-width:none]">
        <Segmented
          value={year}
          onChange={setYear}
          options={[
            [null, "All time"],
            ...[...YEARS].reverse().map((y) => [y, y]),
          ]}
        />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6">
        <Segmented
          value={format}
          onChange={setFormat}
          options={Object.entries(FORMATS).map(([k, f]) => [k, f.short])}
        />
        <div className="flex gap-2">
          <button
            onClick={copy}
            disabled={!!busy}
            className="px-3 py-1 rounded-lg border border-gray-500/20 text-sm hover:bg-gray-500/10 disabled:opacity-50"
          >
            {copied ? "Copied!" : busy === "copy" ? "Copying…" : "Copy image"}
          </button>
          <button
            onClick={download}
            disabled={!!busy}
            className="px-3 py-1 rounded-lg bg-gray-900 text-white dark:bg-white dark:text-black text-sm disabled:opacity-50"
          >
            {busy === "download" ? "Saving…" : "Download PNG"}
          </button>
        </div>
      </div>

      <div className="rounded-xl overflow-hidden shadow-xl ring-1 ring-black/10">
        <TravelPoster ref={svgRef} year={year} format={format} />
      </div>
    </section>
  );
}
