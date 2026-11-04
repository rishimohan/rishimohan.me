import { useEffect, useRef, useState } from "react";
import Head from "next/head";
import { NextSeo } from "next-seo";
import {
  Asterisk,
  AppleLogo,
  ArrowDown,
  Check,
  Copy,
  LockKey,
  Plus,
} from "@phosphor-icons/react";

// Bump these with each release. /upwards/download redirects to the DMG (next.config.js).
const VERSION = "0.1.0";
const SIZE = "6.9 MB";
const DOWNLOAD = "/upwards/download";
const IMG = "/images/work/upwards";
const UNQUARANTINE = "xattr -dr com.apple.quarantine /Applications/Upwards.app";
const utm = "utm_source=rishimohan.me&utm_medium=referral&utm_campaign=upwards";

const SCREENS = [
  { id: "dashboard", label: "Overview", caption: "Today's sales against yesterday, your MRR, and who just subscribed." },
  { id: "activity", label: "Activity", caption: "Every signup, upgrade and cancellation, written as a sentence." },
  { id: "mrr", label: "MRR", caption: "How your MRR adds up, counted the way Stripe counts it." },
  { id: "share", label: "Share", caption: "Your month as a card, ready for X and LinkedIn." },
];

const CARDS = [
  { id: "breakdown", label: "Breakdown", alt: "MRR card with chart and the month's new, expansion, contraction and churn" },
  { id: "chart", label: "Chart", alt: "MRR card with this month's chart against last month" },
  { id: "dark", label: "Dark", alt: "Dark MRR card with this month's chart" },
];

const FEATURES = [
  ["dashboard", "Sales at a glance", "Today, yesterday, 7 days, 30 days and 12 months. Today compares with yesterday up to the same time."],
  ["mrr", "MRR that matches Stripe", "Counted like Stripe's Billing overview, coupons and scheduled cancellations included."],
  ["movement", "Net new MRR", "New, expansion, contraction and churn for the period, with the customers behind each change."],
  ["activity", "Activity you can read", "“Marcus subscribed to Pro with Extra seats ×5”, not customer.subscription.updated."],
  ["dashboard-away", "Stripe notifications on your Mac", "New subscriptions, upgrades, cancellations, failed payments and refunds. Away for a while? A summary waits."],
  ["share", "Monthly MRR cards", "Turn your month into a card for X or LinkedIn. Copy it, save it, or export a video."],
  ["onboarding", "Private by design", "A read-only key in your Keychain. Your payments and customers go from Stripe to your Mac, no server in between."],
];
const NUMERALS = ["i", "ii", "iii", "iv", "v", "vi", "vii", "viii"];

const PERMISSIONS = [
  ["Balance", "sales, fees, refunds"],
  ["Balance transaction sources", "what the customer actually paid"],
  ["Events", "activity and notifications"],
  ["Subscriptions", "MRR and the customer view"],
  ["Customers", "customer names"],
  ["Products", "plan names, like “Pro”"],
];

const FAQ = [
  ["Is it really free?", "Yes, free to download and use. I built it for myself and I'm sharing it."],
  [
    "Does Stripe have a Mac app?",
    "Stripe's own Dashboard app is made for phones, so on a Mac you're left with a browser tab. Upwards is a free Stripe app for Mac that lives in the menu bar: one click shows today's sales, your MRR and the latest customer activity, without opening the Stripe Dashboard.",
  ],
  [
    "How do I get Stripe notifications on my Mac?",
    "Install Upwards and add a read-only Stripe key. It sends a macOS notification for new subscriptions, upgrades, cancellations, failed payments and refunds. If you were away, a summary of what you missed waits in the menu bar.",
  ],
  [
    "Does the MRR match Stripe?",
    "Yes. Upwards counts MRR the way Stripe's Billing overview does, with forever coupons subtracted. Two switches match Stripe's own settings: whether time-limited coupons are subtracted, and whether a scheduled cancellation counts as churn right away. Set them like your Stripe settings (Billing → Overview → Configure) and the numbers line up.",
  ],
  [
    "How is net new MRR calculated?",
    "Net new MRR is new MRR plus expansion, minus contraction and churn. Upwards shows each part for today, yesterday, 7 days, 30 days and longer periods, with the customers behind every change.",
  ],
  [
    "Is it safe to give Upwards my Stripe key?",
    "Upwards uses a restricted key with read-only permissions, so it can't charge, refund or change anything in your account. The key is stored in the macOS Keychain and only ever sent to Stripe. There's no Upwards server.",
  ],
  [
    "Can I share my MRR on X or LinkedIn?",
    "Yes. At the end of each month Upwards makes a card with your MRR and how it moved, in three designs and every social size. Copy it, save it as an image, or export a video.",
  ],
  [
    "Does my revenue data go anywhere?",
    "Your payments and customers only travel between Stripe and your Mac, and Upwards only reads. To see who uses it, Upwards sends usage stats with a random ID: which screens get opened, and once a day each account's name with its MRR and revenue totals. Never your customers, products, single payments or keys. You can turn this off in Settings. It also fetches public exchange rates, and customer photos from Gravatar, which you can turn off too. Share cards are drawn on your Mac.",
  ],
  ["Which Macs does it run on?", "macOS 14 Sonoma or later, on Apple silicon and Intel."],
  [
    "Why does macOS warn me the first time?",
    "Apple only skips that warning for apps signed through a paid developer account. Upwards stays free without one, so you approve it once and it opens normally after that.",
  ],
];

/* ───────────────────────── Styles ───────────────────────── */

const CSS = `
.uw {
  --ink: oklch(0.23 0.02 60);
  --ink-2: oklch(0.44 0.02 65);
  --ink-3: oklch(0.6 0.02 70);
  --paper: oklch(0.995 0.004 80);
  --cream: oklch(0.972 0.018 80);
  --rule: oklch(0.9 0.025 75);
  --amber: oklch(0.58 0.15 55);
  --amber-hi: oklch(0.8 0.16 75);
  --honey-1: oklch(0.86 0.16 85);
  --honey-2: oklch(0.73 0.17 62);
  --on-honey: oklch(0.3 0.06 60);
  --grid: oklch(0.58 0.15 55 / 0.085);
  --grid-hot: oklch(0.66 0.17 60 / 0.5);
  --dot: oklch(0.58 0.15 55 / 0.22);
  --ease: cubic-bezier(0.16, 1, 0.3, 1);
  --ease-q: cubic-bezier(0.25, 1, 0.5, 1);
  color: var(--ink-2);
}
.dark .uw {
  --ink: oklch(0.95 0.01 80);
  --ink-2: oklch(0.76 0.015 75);
  --ink-3: oklch(0.58 0.015 75);
  --paper: oklch(0.2 0.006 70);
  --cream: oklch(0.225 0.014 70);
  --rule: oklch(0.31 0.018 70);
  --amber: oklch(0.8 0.15 72);
  --grid: oklch(0.8 0.15 72 / 0.06);
  --grid-hot: oklch(0.8 0.15 72 / 0.35);
  --dot: oklch(0.8 0.15 72 / 0.15);
}
.uw h1, .uw h2, .uw h3 { color: var(--ink); font-family: 'Inter Tight', Inter, system-ui, sans-serif; }
.uw .serif { font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-weight: 400; letter-spacing: 0; color: var(--amber); }
.uw .amber { color: var(--amber); }
.uw .ink { color: var(--ink); }
.uw .ink3 { color: var(--ink-3); }
.uw .rule { border-color: var(--rule); }
.uw .display { font-size: clamp(2.5rem, 1.1rem + 5.4vw, 5.25rem); line-height: .98; letter-spacing: -0.045em; font-weight: 800; }
.uw .display .serif { font-size: 1.16em; }
.uw .h2 { font-size: clamp(2rem, 1.15rem + 2.8vw, 3.4rem); line-height: 1.02; letter-spacing: -0.04em; font-weight: 800; }
.uw .lede { font-size: 1.0625rem; line-height: 1.65; max-width: 34rem; }
.uw :focus-visible { outline: 2px solid var(--amber-hi); outline-offset: 3px; border-radius: 10px; }

/* Entrance */
@keyframes uw-rise { from { opacity: 0; transform: translateY(16px); filter: blur(6px); } to { opacity: 1; transform: none; filter: none; } }
.uw .rise { animation: uw-rise 1.1s var(--ease) both; animation-delay: calc(var(--i, 0) * 90ms + 60ms); }

/* Patterns */
.uw .grid-paper {
  background-image: linear-gradient(to right, var(--grid) 1px, transparent 1px), linear-gradient(to bottom, var(--grid) 1px, transparent 1px);
  background-size: 34px 34px; background-position: center top;
}
.uw .fade-mask { -webkit-mask-image: radial-gradient(ellipse 70% 62% at 50% 28%, #000 30%, transparent 100%); mask-image: radial-gradient(ellipse 70% 62% at 50% 28%, #000 30%, transparent 100%); }
/* Film grain over the smeared-light backgrounds, drawn by the browser so the images stay small */
.uw .grain::before {
  content: ""; position: absolute; inset: 0; pointer-events: none; border-radius: inherit;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='180' height='180'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='1.15' numOctaves='2' stitchTiles='stitch'/%3E%3CfeColorMatrix type='saturate' values='0'/%3E%3CfeComponentTransfer%3E%3CfeFuncR type='linear' slope='3' intercept='-1'/%3E%3CfeFuncG type='linear' slope='3' intercept='-1'/%3E%3CfeFuncB type='linear' slope='3' intercept='-1'/%3E%3CfeFuncA type='linear' slope='0' intercept='1'/%3E%3C/feComponentTransfer%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url%28%23n%29'/%3E%3C/svg%3E");
  background-size: 180px; opacity: .2; mix-blend-mode: overlay;
}
.uw .dots { background-image: radial-gradient(var(--dot) 1px, transparent 1.3px); background-size: 16px 16px; }

/* Links: a hairline that fills on hover */
.uw .link {
  color: var(--amber);
  background-image: linear-gradient(currentColor, currentColor), linear-gradient(color-mix(in oklch, currentColor 28%, transparent), color-mix(in oklch, currentColor 28%, transparent));
  background-size: 0% 1px, 100% 1px; background-position: 0 100%, 0 100%; background-repeat: no-repeat;
  padding-bottom: 1px; transition: background-size .55s var(--ease);
}
.uw .link:hover { background-size: 100% 1px, 100% 1px; }

/* Buttons */
.uw .btn-honey {
  position: relative; overflow: hidden; isolation: isolate;
  color: var(--on-honey);
  background: linear-gradient(180deg, var(--honey-1), var(--honey-2));
  box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.6), inset 0 -1px 0 oklch(0.5 0.12 50 / 0.25), 0 1px 2px oklch(0.4 0.1 50 / 0.3), 0 10px 24px -10px oklch(0.7 0.17 62 / 0.8);
  transition: transform .45s var(--ease), box-shadow .45s var(--ease), filter .2s;
}
.uw .btn-honey::before {
  content: ""; position: absolute; inset: 0; z-index: -1;
  background: linear-gradient(105deg, transparent 35%, oklch(1 0 0 / 0.6) 50%, transparent 65%);
  transform: translateX(-110%); transition: transform .9s var(--ease);
}
.uw .btn-honey:hover { transform: translateY(-2px); box-shadow: inset 0 1px 0 oklch(1 0 0 / 0.6), inset 0 -1px 0 oklch(0.5 0.12 50 / 0.25), 0 2px 4px oklch(0.4 0.1 50 / 0.25), 0 18px 34px -12px oklch(0.7 0.17 62 / 0.9); }
.uw .btn-honey:hover::before { transform: translateX(110%); }
.uw .btn-honey:active { transform: translateY(0) scale(.985); filter: brightness(.97); transition-duration: .12s; }
.uw .btn-honey .arrow { transition: transform .5s var(--ease); }
.uw .btn-honey:hover .arrow { transform: translateY(2px); }
@keyframes uw-drop { 0% { transform: translateY(-140%); } 100% { transform: translateY(0); } }
.uw .btn-honey:hover .arrow svg { animation: uw-drop .55s var(--ease); }

.uw .btn-ghost {
  color: var(--ink); border: 1px solid var(--rule); background: color-mix(in oklch, var(--paper) 80%, transparent);
  transition: border-color .3s, background-color .3s, transform .45s var(--ease);
}
.uw .btn-ghost:hover { border-color: color-mix(in oklch, var(--amber) 55%, var(--rule)); background: var(--cream); transform: translateY(-2px); }
.uw .btn-ghost:active { transform: scale(.985); transition-duration: .12s; }
.uw .btn-ghost .gh { transition: transform .6s var(--ease); }
.uw .btn-ghost:hover .gh { transform: rotate(-12deg) scale(1.08); }
.uw .btn-ghost .out { opacity: 0; transform: translate(-4px, 4px); transition: opacity .3s, transform .5s var(--ease); }
.uw .btn-ghost:hover .out { opacity: .7; transform: none; }

/* Segmented control, styled like the app's macOS segmented controls */
.uw .seg { position: relative; display: inline-flex; padding: 2px; border-radius: 8px; background: oklch(0.92 0.003 80); box-shadow: inset 0 0 0 0.5px oklch(0 0 0 / .06); }
.dark .uw .seg { background: oklch(0.3 0.003 80); box-shadow: inset 0 0 0 0.5px oklch(1 0 0 / .06); }
.uw .seg-thumb { position: absolute; top: 2px; bottom: 2px; left: 0; border-radius: 6px; background: oklch(1 0 0); box-shadow: 0 0 0 0.5px oklch(0 0 0 / .08), 0 1px 2px oklch(0 0 0 / .14), 0 2px 6px -2px oklch(0 0 0 / .12); transition: transform .45s var(--ease), width .45s var(--ease); }
.dark .uw .seg-thumb { background: oklch(0.47 0.003 80); box-shadow: 0 1px 2px oklch(0 0 0 / .35), inset 0 0.5px 0 oklch(1 0 0 / .12); }
.uw .seg button { position: relative; z-index: 1; padding: 4px 16px; border-radius: 6px; font-size: 13px; font-weight: 500; color: var(--ink-2); transition: color .25s var(--ease-q); }
.uw .seg button:hover { color: var(--ink); }
.uw .seg button[aria-selected="true"] { color: var(--ink); }
.uw .seg button + button::before { content: ""; position: absolute; left: 0; top: 25%; bottom: 25%; width: 1px; background: oklch(0 0 0 / .1); transition: opacity .25s; }
.dark .uw .seg button + button::before { background: oklch(1 0 0 / .12); }
.uw .seg button[aria-selected="true"]::before, .uw .seg button[aria-selected="true"] + button::before { opacity: 0; }

/* Tilt */
.uw .tilt { transform: perspective(1400px) rotateX(var(--rx, 0deg)) rotateY(var(--ry, 0deg)); transition: transform .9s var(--ease); will-change: transform; }

/* Menu bar */
.uw .mb-item { transition: background-color .25s; }
.uw .mb-item:hover { background: oklch(1 0 0 / .22); }
.uw .mb-item[aria-expanded="true"] { background: oklch(1 0 0 / .34); }
.uw .panel { transition: opacity .45s var(--ease), transform .55s var(--ease); transform-origin: 50% 0; }
.uw .panel[data-open="false"] { opacity: 0; transform: translateY(-8px) scale(.97); pointer-events: none; }
.uw .screen { transition: opacity .5s var(--ease-q), filter .5s var(--ease-q); }
.uw .screen[data-on="false"] { opacity: 0; filter: blur(3px); }

/* Clickable tab bar inside the screenshots */
.uw .hot { transition: background-color .25s var(--ease-q), box-shadow .25s; }
.uw .hot:hover:not([aria-selected="true"]) { background: oklch(0.2 0.01 60 / .06); }
.dark .uw .hot:hover:not([aria-selected="true"]) { background: oklch(1 0 0 / .08); }
.uw .hot:active { background: oklch(0.2 0.01 60 / .1); }
.uw .hot:focus-visible { outline: 2px solid var(--amber-hi); outline-offset: 1px; }
.uw .tab-note { transition: opacity .6s var(--ease-q), transform .8s var(--ease); text-shadow: 0 1px 12px oklch(0.25 0.05 220 / .45); }
.uw .tab-note[data-gone="true"] { opacity: 0; transform: translateX(-8px); }
.uw .tab-note svg { filter: drop-shadow(0 1px 6px oklch(0.25 0.05 220 / .4)); }

/* Features: a list of seven on the left, the panel on a stage on the right */
.uw .fstage { background: var(--paper); box-shadow: 0 40px 90px -60px oklch(0.35 0.08 60 / 0.5); }
.uw .fstage .stage { background: #2C3337 url(/images/work/upwards/bg-stage.webp) center / cover no-repeat; }
.uw .fi { position: relative; display: block; width: 100%; text-align: left; border-radius: 16px; padding: 14px 16px; transition: background-color .35s var(--ease-q), box-shadow .35s var(--ease-q); }
.uw .fi:hover { background: color-mix(in oklch, var(--cream) 60%, transparent); }
.uw .fi[aria-selected="true"] { background: var(--cream); box-shadow: inset 0 0 0 1px var(--rule); }
.uw .fi .num { display: inline-block; width: 1.75rem; font-family: 'Instrument Serif', Georgia, serif; font-style: italic; font-size: 1.15rem; line-height: 1; color: var(--ink-3); transition: color .35s; }
.uw .fi .t { color: var(--ink-2); transition: color .35s; }
.uw .fi:hover .t, .uw .fi[aria-selected="true"] .t { color: var(--ink); }
.uw .fi[aria-selected="true"] .num { color: var(--amber); }
.uw .fi-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .55s var(--ease); }
.uw .fi[aria-selected="true"] .fi-body { grid-template-rows: 1fr; }
.uw .fi-body > span { overflow: hidden; }
.uw .fi-body .d { opacity: 0; transition: opacity .3s; }
.uw .fi[aria-selected="true"] .fi-body .d { opacity: 1; transition: opacity .45s .12s; }
@keyframes uw-grow { from { transform: scaleX(0); } to { transform: scaleX(1); } }
.uw .fi-bar { position: absolute; left: 16px; right: 16px; bottom: 0; height: 2px; border-radius: 2px; overflow: hidden; }
.uw .fi-bar > span { display: block; height: 100%; background: var(--amber-hi); transform-origin: left; animation: uw-grow 6s linear forwards; }
.uw .fstage[data-paused="true"] .fi-bar > span { animation-play-state: paused; }
.uw .fshot { transition: opacity .55s var(--ease-q), transform .8s var(--ease), filter .55s var(--ease-q); }
.uw .fshot[data-on="false"] { opacity: 0; transform: translateY(14px) scale(.985); filter: blur(4px); }

/* Full-bleed desktop scene behind the hero panel, fading into the page at the bottom */
.uw .scene-bg { background: #2C3337 url(/images/work/upwards/bg-wide.webp) center / cover no-repeat;
  -webkit-mask-image: linear-gradient(#000 62%, transparent 97%); mask-image: linear-gradient(#000 62%, transparent 97%); }

/* Footer wordmark, cut off by the page's bottom edge */
.uw .wordmark { font-family: 'Inter Tight', Inter, sans-serif; font-weight: 800; letter-spacing: -0.06em; line-height: .78;
  font-size: clamp(5.5rem, 21vw, 17rem); color: var(--amber); opacity: .09; margin-bottom: -0.2em;
  -webkit-mask-image: linear-gradient(#000 35%, transparent 92%); mask-image: linear-gradient(#000 35%, transparent 92%); }
.dark .uw .wordmark { opacity: .07; }

/* Share cards: a quiet grey sheet with a fine grid, fading out toward the edges */
.uw .share-bg { background-color: oklch(0.965 0.003 80); }
.uw .share-bg::before { content: ""; position: absolute; inset: 0; pointer-events: none;
  background-image: linear-gradient(to right, oklch(0.45 0.01 70 / .075) 1px, transparent 1px), linear-gradient(to bottom, oklch(0.45 0.01 70 / .075) 1px, transparent 1px);
  background-size: 28px 28px; background-position: center;
  -webkit-mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, #000 40%, transparent 100%); mask-image: radial-gradient(ellipse 75% 70% at 50% 50%, #000 40%, transparent 100%); }
.dark .uw .share-bg { background-color: oklch(0.235 0.004 70); }
.dark .uw .share-bg::before { background-image: linear-gradient(to right, oklch(1 0 0 / .05) 1px, transparent 1px), linear-gradient(to bottom, oklch(1 0 0 / .05) 1px, transparent 1px); }

/* Dark smeared-light tiles */
.uw .tile-bg { background: #2C3337 url(/images/work/upwards/bg-tile.webp) center / cover no-repeat; }

/* Bento */
.uw .bento { border-radius: 24px; border: 1px solid var(--rule); background: var(--paper); overflow: hidden; position: relative;
  box-shadow: 0 30px 60px -48px oklch(0.35 0.08 60 / 0.45); }
.uw .bento h3 { font-size: 1.2rem; letter-spacing: -0.025em; font-weight: 750; }
/* Notification banners, styled after macOS: system font, frosted material, icon left, time top right */
.uw .note { display: flex; gap: 10px; align-items: center; padding: 10px 14px 10px 10px; border-radius: 22px;
  font-family: -apple-system, BlinkMacSystemFont, "SF Pro Text", "Helvetica Neue", system-ui, sans-serif; -webkit-font-smoothing: antialiased;
  background: rgba(246, 246, 246, 0.72); backdrop-filter: blur(30px) saturate(1.8); -webkit-backdrop-filter: blur(30px) saturate(1.8);
  box-shadow: inset 0 0 0 .5px rgba(255, 255, 255, .55), 0 0 0 .5px rgba(0, 0, 0, .12), 0 10px 28px -6px rgba(0, 0, 0, .35);
  color: #1d1d1f; transition: transform .7s var(--ease); }
.uw .note .ttl { font-size: 13px; font-weight: 600; letter-spacing: -0.008em; line-height: 16px; }
.uw .note .msg { font-size: 13px; font-weight: 400; letter-spacing: -0.008em; line-height: 16px; color: rgba(29, 29, 31, .86); }
.uw .note .when { font-size: 12px; line-height: 16px; color: rgba(29, 29, 31, .45); }
.dark .uw .note { background: rgba(48, 48, 50, 0.7); color: #f5f5f7;
  box-shadow: inset 0 0 0 .5px rgba(255, 255, 255, .12), 0 0 0 .5px rgba(0, 0, 0, .5), 0 10px 28px -6px rgba(0, 0, 0, .6); }
.dark .uw .note .msg { color: rgba(245, 245, 247, .82); }
.dark .uw .note .when { color: rgba(245, 245, 247, .45); }
.uw .notes:hover .note:nth-child(1) { transform: translateY(-3px); }
.uw .notes:hover .note:nth-child(3) { transform: translateY(3px); }
.uw .split { clip-path: polygon(58% 0, 100% 0, 100% 100%, 38% 100%); }

/* Share cards */
.uw .card-img { transition: opacity .6s var(--ease-q), transform .8s var(--ease), filter .6s var(--ease-q); }
.uw .card-img[data-on="false"] { opacity: 0; transform: scale(.985); filter: blur(4px); }

/* Permissions */
.uw .perm { transition: background-color .3s; }
.uw .perm:hover { background: var(--cream); }
.uw .pill { display: inline-flex; align-items: center; gap: 4px; padding: 2px 8px; border-radius: 999px; font-size: 11px; font-weight: 600; letter-spacing: .02em;
  color: oklch(0.45 0.11 150); background: oklch(0.95 0.04 150); transition: background-color .3s, color .3s; }
.dark .uw .pill { color: oklch(0.82 0.12 150); background: oklch(0.3 0.05 150); }
.uw .pill .tick { width: 0; opacity: 0; transform: scale(.4); transition: width .45s var(--ease), opacity .3s, transform .45s var(--ease); }
.uw .perm:hover .pill { color: oklch(0.98 0.02 150); background: oklch(0.55 0.13 150); }
.uw .perm:hover .pill .tick { width: 11px; opacity: 1; transform: none; }

/* Steps */
.uw .dmg img { filter: drop-shadow(0 1px 1px oklch(0.3 0.05 60 / .18)) drop-shadow(0 22px 34px oklch(0.35 0.08 60 / .28)); transition: transform .8s var(--ease); }
.uw .dmg:hover img { transform: translateY(-3px); }
.dark .uw .dmg img { filter: drop-shadow(0 0 0.5px oklch(1 0 0 / .35)) drop-shadow(0 22px 34px oklch(0 0 0 / .5)); }
.uw .step .n { transition: color .35s, transform .6s var(--ease); color: var(--ink-3); }
.uw .step:hover .n { color: var(--amber); transform: translateY(-2px) rotate(-4deg); }

/* Copy */
.uw .copy { transition: background-color .25s, color .25s, transform .3s var(--ease); }
.uw .copy:active { transform: scale(.95); }

/* Accordion */
.uw .qa-body { display: grid; grid-template-rows: 0fr; transition: grid-template-rows .55s var(--ease); }
.uw .qa[data-open="true"] .qa-body { grid-template-rows: 1fr; }
.uw .qa-body > div { overflow: hidden; }
.uw .qa-body p { opacity: 0; transform: translateY(-4px); transition: opacity .35s, transform .5s var(--ease); }
.uw .qa[data-open="true"] .qa-body p { opacity: 1; transform: none; transition-delay: .08s; }
.uw .qa .q { transition: color .3s; }
.uw .qa button:hover .q { color: var(--amber); }
.uw .qa .sign { transition: transform .55s var(--ease), background-color .3s, border-color .3s; border: 1px solid var(--rule); color: var(--amber); }
.uw .qa button:hover .sign { border-color: color-mix(in oklch, var(--amber) 50%, var(--rule)); }
.uw .qa[data-open="true"] .sign { transform: rotate(135deg); background: var(--cream); }

/* Icon */
.uw .app-icon { transition: transform .8s var(--ease), filter .6s; cursor: pointer; }
.uw .app-icon:hover { transform: rotate(-8deg) scale(1.05); }
@keyframes uw-spin { from { transform: rotate(0); } to { transform: rotate(360deg); } }
.uw .app-icon.spin { animation: uw-spin 1s var(--ease); }

/* Watermark */
@keyframes uw-turn { to { transform: translate(-50%, -50%) rotate(360deg); } }
.uw .watermark { transform: translate(-50%, -50%); animation: uw-turn 90s linear infinite; color: var(--amber); opacity: .045; }
.dark .uw .watermark { opacity: .035; }

@media (prefers-reduced-motion: reduce) {
  .uw *, .uw *::before, .uw *::after { animation: none !important; transition-duration: .01ms !important; }
  .uw .tilt { transform: none; }
}
`;

/* ───────────────────────── Hooks ───────────────────────── */

function useReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(m.matches);
    const on = () => setReduced(m.matches);
    m.addEventListener?.("change", on);
    return () => m.removeEventListener?.("change", on);
  }, []);
  return reduced;
}

/** Sets --rx/--ry on the element from the pointer, for a slight 3D tilt. */
function useTilt(max = 4) {
  const ref = useRef(null);
  const onMouseMove = (e) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.setProperty("--rx", `${(-py * max).toFixed(2)}deg`);
    el.style.setProperty("--ry", `${(px * max).toFixed(2)}deg`);
  };
  const onMouseLeave = () => {
    ref.current?.style.setProperty("--rx", "0deg");
    ref.current?.style.setProperty("--ry", "0deg");
  };
  return { ref, onMouseMove, onMouseLeave };
}

/* ───────────────────────── Pieces ───────────────────────── */

function Themed({ name, alt, className = "" }) {
  return (
    <>
      <img src={`${IMG}/${name}-light.png`} alt={alt} className={`block dark:hidden ${className}`} />
      <img src={`${IMG}/${name}-dark.png`} alt="" aria-hidden className={`hidden dark:block ${className}`} />
    </>
  );
}

function Eyebrow({ n, children, align = "center" }) {
  return (
    <div
      className={`amber flex items-center gap-3 text-[11px] font-semibold tracking-[0.22em] uppercase ${
        align === "center" ? "justify-center" : "justify-center md:justify-start"
      }`}
    >
      <span className="h-px w-8 bg-current opacity-40" />
      <span className="tabular-nums tracking-[0.08em] opacity-70">{n}</span>
      <span>{children}</span>
    </div>
  );
}

function Fleuron() {
  return (
    <div aria-hidden className="amber my-16 md:my-24 flex items-center justify-center gap-4">
      <span className="h-px w-20 bg-gradient-to-r from-transparent to-current opacity-40" />
      <Asterisk size={10} weight="bold" className="opacity-50" />
      <Asterisk size={15} weight="bold" />
      <Asterisk size={10} weight="bold" className="opacity-50" />
      <span className="h-px w-20 bg-gradient-to-l from-transparent to-current opacity-40" />
    </div>
  );
}

function DownloadButton() {
  return (
    <a
      href={DOWNLOAD}
      data-fast-goal="download_upwards"
      className="btn-honey inline-flex items-center justify-center gap-2.5 rounded-full pl-5 pr-2 py-2 text-[15px] font-semibold"
    >
      <AppleLogo weight="bold" size={17} />
      Download for Mac
      <span className="arrow grid place-items-center w-7 h-7 rounded-full bg-[oklch(0.3_0.06_60/0.1)] overflow-hidden">
        <ArrowDown size={13} weight="bold" />
      </span>
    </a>
  );
}

function Segmented({ items, value, onChange, label, progress, onProgressEnd }) {
  const refs = useRef({});
  const [thumb, setThumb] = useState(null);
  const placed = useRef(false);

  useEffect(() => {
    const measure = () => {
      const el = refs.current[value];
      if (el) setThumb({ x: el.offsetLeft, w: el.offsetWidth });
    };
    measure();
    document.fonts?.ready?.then(measure);
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [value]);

  useEffect(() => {
    if (thumb && !placed.current) requestAnimationFrame(() => (placed.current = true));
  }, [thumb]);

  return (
    <div role="tablist" aria-label={label} className="seg">
      <span
        aria-hidden
        className="seg-thumb"
        style={
          thumb
            ? { transform: `translateX(${thumb.x}px)`, width: thumb.w, transition: placed.current ? undefined : "none" }
            : { opacity: 0 }
        }
      />
      {items.map((it) => {
        const on = it.id === value;
        return (
          <button
            key={it.id}
            ref={(el) => (refs.current[it.id] = el)}
            role="tab"
            aria-selected={on}
            onClick={() => onChange(it.id)}
          >
            {it.label}
            {progress && on ? <span key={`${it.id}-p`} className="progress" onAnimationEnd={onProgressEnd} /> : null}
          </button>
        );
      })}
    </div>
  );
}

/* ───────────────────────── Interactive menu bar ───────────────────────── */

function Showcase() {
  const [screen, setScreen] = useState("dashboard");
  const [open, setOpen] = useState(true);
  const [touched, setTouched] = useState(false);
  const tilt = useTilt(3.5);
  const current = SCREENS.find((s) => s.id === screen);
  const pick = (id) => {
    setTouched(true);
    setScreen(id);
    setOpen(true);
  };

  return (
    <div className="show">
      <div
        ref={tilt.ref}
        onMouseMove={tilt.onMouseMove}
        onMouseLeave={tilt.onMouseLeave}
        className="relative overflow-hidden"
      >
        <div aria-hidden className="scene-bg grain absolute inset-0" />
        {/* Menu bar */}
        <div className="relative z-10 flex items-center justify-center px-3 sm:px-4 h-9 text-white text-[13px] font-medium bg-white/15 backdrop-blur-md">
          <button
            onClick={() => {
              setTouched(true);
              setOpen((o) => !o);
            }}
            aria-expanded={open}
            aria-label={open ? "Close Upwards" : "Open Upwards"}
            className="mb-item flex items-center gap-1 rounded-md px-2 py-0.5"
          >
            <Asterisk weight="bold" size={14} />
            <span className="tabular-nums">$505</span>
          </button>
        </div>

        {/* Desktop */}
        <div className="relative h-[560px] sm:h-[660px]" onClick={(e) => e.target === e.currentTarget && setOpen(false)}>
          <div data-open={open} className="panel absolute top-2 right-3 left-3 sm:right-auto sm:left-[calc(50%-165px)] sm:w-[330px]">
            {/* A note in the margin, pointing at the app's own tab bar */}
            <div
              aria-hidden
              data-gone={touched}
              className="tab-note hidden md:flex absolute right-full bottom-[2.5%] mr-3 items-end gap-1 text-white"
            >
              <span className="font-['Instrument_Serif',Georgia,serif] italic text-[22px] leading-none whitespace-nowrap pb-5">
                Click a tab
              </span>
              <svg width="54" height="40" viewBox="0 0 54 40" fill="none" className="shrink-0">
                <path d="M2 6 C 18 4, 34 10, 44 30" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                <path d="M36 27 L 44.5 31 L 47 22" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>

            <div className="tilt relative grid overflow-hidden rounded-[20px] bg-[#F6F6F6] dark:bg-[#1E1E1E] ring-1 ring-black/10 dark:ring-white/10 shadow-[0_30px_60px_-20px_rgba(0,0,0,0.45)]">
              {SCREENS.map((s) => (
                <div key={s.id} data-on={s.id === screen} aria-hidden={s.id !== screen} className="screen [grid-area:1/1]">
                  <Themed name={s.id} alt={`Upwards ${s.label} screen`} className="w-full h-auto" />
                </div>
              ))}

              {/* The tab bar in the screenshots, made clickable */}
              <div
                role="tablist"
                aria-label="Upwards screens"
                className="absolute left-[4%] right-[4%] top-[91.25%] h-[6.25%] grid grid-cols-4"
              >
                {SCREENS.map((s) => {
                  const on = s.id === screen;
                  return (
                    <button
                      key={s.id}
                      role="tab"
                      aria-selected={on}
                      aria-label={s.label}
                      title={s.label}
                      onClick={() => pick(s.id)}
                      className="hot relative rounded-full"
                    >
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div
            className={`pointer-events-none absolute inset-0 grid place-items-center text-white transition-opacity duration-500 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          >
            <div className="text-center">
              <Asterisk size={30} weight="bold" className="mx-auto mb-2 opacity-90" />
              <div className="text-sm font-medium opacity-90">Click ✱ in the menu bar</div>
            </div>
          </div>
        </div>
      </div>

      <p key={screen} className="rise ink3 mt-6 mx-auto min-h-[3em] sm:min-h-0 max-w-[460px] text-center text-[14.5px]">
        <span className="ink font-semibold">{current.label}.</span> {current.caption}
      </p>
    </div>
  );
}

/* ───────────────────────── Features ───────────────────────── */

function Features() {
  const [active, setActive] = useState(0);
  const [hover, setHover] = useState(false);
  const [seen, setSeen] = useState(false);
  const [touched, setTouched] = useState(false);
  const reduced = useReducedMotion();
  const box = useRef(null);
  const tilt = useTilt(3);

  // Steps through the features on its own while the section is on screen, until someone picks one.
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => setSeen(e.isIntersecting), { threshold: 0.35 });
    if (box.current) io.observe(box.current);
    return () => io.disconnect();
  }, []);
  const cycling = !reduced && !touched;
  const next = () => setActive((i) => (i + 1) % FEATURES.length);
  const pick = (i) => {
    setActive(i);
    setTouched(true);
  };

  return (
    <div
      ref={box}
      data-paused={hover || !seen}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      className="fstage grid grid-cols-1 md:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] rounded-[28px] border rule overflow-hidden"
    >
      <div className="stage grain relative order-first md:order-last grid place-items-center px-8 pt-10 pb-10 md:py-12 md:border-l rule">
        <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} className="relative w-full max-w-[250px] md:max-w-[300px]">
          <div className="tilt grid">
            {FEATURES.map(([img, title], i) => (
              <div
                key={img}
                data-on={i === active}
                aria-hidden={i !== active}
                className="fshot [grid-area:1/1] self-start overflow-hidden rounded-[18px] bg-[#F6F6F6] dark:bg-[#1E1E1E] ring-1 ring-black/10 dark:ring-white/10 shadow-[0_40px_70px_-24px_rgba(0,0,0,0.6)]"
              >
                <Themed name={img} alt={`Upwards: ${title}`} className="w-full h-auto" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <ul role="tablist" aria-label="Features" className="p-2.5 sm:p-3.5 flex flex-col gap-0.5 self-center">
        {FEATURES.map(([img, title, text], i) => {
          const on = i === active;
          return (
            <li key={title}>
              <button role="tab" aria-selected={on} onClick={() => pick(i)} className="fi">
                <span className="flex items-baseline">
                  <span className="num">{NUMERALS[i]}.</span>
                  <span className="t text-[15.5px] font-semibold tracking-tight">{title}</span>
                </span>
                <span className="fi-body">
                  <span className="min-h-0">
                    <span className="d block pl-7 pt-1.5 text-[14px] leading-relaxed">{text}</span>
                  </span>
                </span>
                {cycling && on ? (
                  <span className="fi-bar">
                    <span key={active} onAnimationEnd={next} />
                  </span>
                ) : null}
              </button>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/* ───────────────────────── The small things ───────────────────────── */

const NOTES = [
  ["New subscription · +$159/mo", "Marcus Lee subscribed to Pro with Extra seats.", "now"],
  ["Payment failed · $49.00", "Ben Carter's payment for Starter didn't go through.", "12m ago"],
  ["Upgrade · +$50/mo", "Priya Nair moved from Starter to Pro.", "1h ago"],
];

function Bento() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-4">
      {/* Notifications, on the smeared-light stage */}
      <div className="bento sm:col-span-2 lg:col-span-4 !border-0 text-[oklch(0.93_0.02_80)]">
        <div aria-hidden className="tile-bg grain absolute inset-0 -scale-x-100" />
        <div className="relative flex flex-col gap-6 p-6 sm:p-8 h-full">
          <div className="max-w-[340px]">
            <h3 className="!text-[oklch(0.98_0.01_80)]">Notified as it happens</h3>
            <p className="mt-2 text-[14.5px] leading-relaxed text-[oklch(0.86_0.02_80)]">
              New subscriptions, upgrades, cancellations, failed payments and refunds, as macOS notifications.
            </p>
          </div>
          <div className="notes mt-auto w-full max-w-[372px] self-end flex flex-col gap-2">
            {NOTES.map(([title, body, when]) => (
              <div key={title} className="note">
                <img src="/images/work/show/upwards-icon.png" alt="" className="w-[38px] h-[38px] shrink-0" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-2">
                    <span className="ttl truncate">{title}</span>
                    <span className="when ml-auto shrink-0">{when}</span>
                  </div>
                  <div className="msg">{body}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Away summary */}
      <div className="bento lg:col-span-2 p-6 sm:p-8 flex flex-col">
        <h3>Back from a break?</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed">A summary of what changed waits for you, so nothing slips by.</p>
        <div className="mt-auto pt-6">
          <div className="rounded-2xl bg-[var(--cream)] border rule p-4 text-[13px]">
            <div className="ink font-semibold">While you were away</div>
            <div className="mt-2 space-y-1.5 tabular-nums">
              <div className="flex justify-between"><span>New subscriptions</span><span className="ink font-medium">4</span></div>
              <div className="flex justify-between"><span>Net new MRR</span><span className="font-medium text-[oklch(0.55_0.15_150)]">+$316</span></div>
              <div className="flex justify-between"><span>Failed payments</span><span className="ink font-medium">1</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* Light and dark */}
      <div className="bento lg:col-span-2 flex flex-col">
        <div className="p-6 sm:p-8 pb-0">
          <h3>Light and dark</h3>
          <p className="mt-2 text-[14.5px] leading-relaxed">Follows your Mac's appearance.</p>
        </div>
        <div className="relative mt-6 mx-6 sm:mx-8 h-[170px] overflow-hidden rounded-t-[16px] ring-1 ring-black/10 dark:ring-white/10">
          <img src={`${IMG}/dashboard-light.png`} alt="Upwards in light mode" className="absolute inset-x-0 top-0 w-full" />
          <img src={`${IMG}/dashboard-dark.png`} alt="Upwards in dark mode" className="split absolute inset-x-0 top-0 w-full" />
        </div>
      </div>

      {/* Private */}
      <div className="bento lg:col-span-2 p-6 sm:p-8 flex flex-col">
        <span className="grid place-items-center w-12 h-12 rounded-2xl bg-[var(--cream)] border rule amber">
          <LockKey size={22} weight="duotone" />
        </span>
        <h3 className="mt-6">Read-only, no server</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed">
          A restricted key in your Keychain. Your payments and customers go from Stripe to your Mac, nowhere else.
        </p>
      </div>

      {/* Native */}
      <div className="bento lg:col-span-2 p-6 sm:p-8 flex flex-col">
        <div className="amber font-['Inter_Tight',Inter,sans-serif] font-extrabold tracking-[-0.05em] text-[3.4rem] leading-none tabular-nums">
          {SIZE}
        </div>
        <h3 className="mt-5">Native and light</h3>
        <p className="mt-2 text-[14.5px] leading-relaxed">Built in Swift for macOS 14 or later, on Apple silicon and Intel.</p>
      </div>
    </div>
  );
}

/* ───────────────────────── Share cards ───────────────────────── */

function ShareCards() {
  const [card, setCard] = useState("breakdown");
  const tilt = useTilt(3);
  return (
    <div className="share-bg relative rounded-[28px] overflow-hidden border rule p-4 sm:p-10">
      <div className="relative mb-6 sm:mb-8 flex justify-center">
        <Segmented label="Card design" items={CARDS} value={card} onChange={setCard} />
      </div>
      <div ref={tilt.ref} onMouseMove={tilt.onMouseMove} onMouseLeave={tilt.onMouseLeave} className="relative">
        <div className="tilt grid">
          {CARDS.map((c) => (
            <img
              key={c.id}
              src={`${IMG}/card-${c.id}.jpg`}
              alt={c.alt}
              data-on={c.id === card}
              aria-hidden={c.id !== card}
              className="card-img [grid-area:1/1] w-full rounded-xl sm:rounded-2xl shadow-[0_34px_70px_-34px_rgba(60,20,90,0.6)]"
            />
          ))}
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Install ───────────────────────── */

function CopyCommand() {
  const [copied, setCopied] = useState(false);
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(UNQUARANTINE);
      setCopied(true);
      setTimeout(() => setCopied(false), 1800);
    } catch (e) {}
  };
  return (
    <div className="mt-3 flex items-center gap-2 rounded-xl bg-[oklch(0.2_0.015_60)] text-[oklch(0.93_0.04_80)] pl-4 pr-1.5 py-1.5 font-mono text-[12.5px] ring-1 ring-black/10 dark:ring-white/10">
      <span className="select-none text-[oklch(0.8_0.15_72/0.7)]">$</span>
      <code className="flex-1 min-w-0 overflow-x-auto whitespace-nowrap py-1">{UNQUARANTINE}</code>
      <button
        onClick={copy}
        aria-label="Copy command"
        className={`copy shrink-0 inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 font-sans text-[12px] font-medium ${
          copied ? "bg-[oklch(0.55_0.13_150)] text-white" : "bg-white/10 hover:bg-white/20"
        }`}
      >
        {copied ? <Check size={13} weight="bold" /> : <Copy size={13} />}
        {copied ? "Copied" : "Copy"}
      </button>
    </div>
  );
}

function DmgWindow() {
  return (
    <figure className="dmg mt-5">
      <img
        src={`${IMG}/dmg-window.png`}
        width={660}
        height={432}
        loading="lazy"
        alt="The Upwards disk image window: the app icon on the left, an arrow, and the Applications folder on the right"
        className="w-full h-auto"
      />
    </figure>
  );
}

const STEPS = [
  [
    "Drag it into Applications",
    <>
      Open the DMG and drop Upwards on the Applications folder beside it.
      <DmgWindow />
    </>,
  ],
  [
    "Allow it once",
    <>
      The first time, macOS says it couldn't verify Upwards. Click <b className="ink">Done</b>, then open{" "}
      <b className="ink">System Settings → Privacy &amp; Security</b> and click <b className="ink">Open Anyway</b>. Or
      run this once in Terminal:
      <CopyCommand />
    </>,
  ],
  [
    "Add your Stripe key",
    <>
      Click <b className="ink">Open Stripe</b> in Upwards, then <b className="ink">Create key</b> on the page that
      opens, and paste it. Your numbers show up right away.
    </>,
  ],
];

function QA({ q, a }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="qa border-b rule" data-open={open}>
      <button onClick={() => setOpen((o) => !o)} aria-expanded={open} className="w-full flex items-center gap-4 py-5 text-left">
        <span className="q flex-1 text-[16.5px] font-bold tracking-tight ink font-['Inter_Tight',Inter,sans-serif]">{q}</span>
        <span className="sign shrink-0 grid place-items-center w-8 h-8 rounded-full">
          <Plus size={13} weight="bold" />
        </span>
      </button>
      <div className="qa-body">
        <div>
          <p className="pb-6 pr-12 text-[15px] leading-relaxed">{a}</p>
        </div>
      </div>
    </div>
  );
}

/* ───────────────────────── Structured data ───────────────────────── */

const PAGE_URL = "https://rishimohan.me/projects/upwards";
// Link preview image, rendered by Orshot from the "Upwards – OG image" template (rishimohan workspace, id 36504).
// Edit the template and the preview updates within an hour (the URL's cache), with no deploy.
const OG_IMAGE = "https://api.orshot.com/v1/studio/dynamic-url/upwards-og.jpg?templateId=36504&sign=61e8803d381472e1";
const plain = (node) => (typeof node === "string" ? node : "");

/** schema.org data for search engines and AI answer engines: the app itself, and the FAQ. */
function structuredData(description) {
  return [
    {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: "Upwards",
      url: PAGE_URL,
      description,
      applicationCategory: "BusinessApplication",
      applicationSubCategory: "Stripe revenue and MRR tracker",
      operatingSystem: "macOS 14 or later",
      softwareVersion: VERSION,
      fileSize: SIZE,
      downloadUrl: `https://rishimohan.me${DOWNLOAD}`,
      image: OG_IMAGE,
      screenshot: ["dashboard", "mrr", "movement", "activity"].map((n) => `https://rishimohan.me${IMG}/${n}-light.png`),
      featureList: FEATURES.map(([, title, text]) => `${title}: ${plain(text)}`),
      offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
      author: { "@type": "Person", name: "Rishi Mohan", url: "https://rishimohan.me" },
    },
    {
      "@context": "https://schema.org",
      "@type": "FAQPage",
      mainEntity: FAQ.map(([q, a]) => ({
        "@type": "Question",
        name: q,
        acceptedAnswer: { "@type": "Answer", text: plain(a) },
      })),
    },
  ];
}

/* ───────────────────────── Page ───────────────────────── */

export default function Upwards() {
  const [spin, setSpin] = useState(false);
  const description =
    "A free Stripe app for Mac. See today's sales, MRR that matches Stripe and net new MRR in your menu bar, and get notified of new subscriptions and failed payments.";
  const title = "Upwards – Free Stripe app for Mac: MRR, sales and notifications";

  return (
    <>
      <NextSeo
        title={title}
        description={description}
        canonical={PAGE_URL}
        openGraph={{
          site_name: "Rishi Mohan",
          title,
          description,
          images: [
            {
              url: OG_IMAGE,
              width: 1200,
              height: 630,
              alt: "Upwards: Stripe revenue, in your menu bar. A free Mac app for MRR, today's sales and Stripe notifications.",
            },
          ],
        }}
        twitter={{ handle: "@thelifeofrishi", site: "@thelifeofrishi", cardType: "summary_large_image" }}
      />
      <Head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData(description)) }}
        />
      </Head>
      <style dangerouslySetInnerHTML={{ __html: CSS }} />

      <div className="uw relative w-full overflow-x-clip pb-6">
        {/* ── Hero ── */}
        <section className="hero relative">
          <div
            aria-hidden
            className="pointer-events-none absolute left-1/2 -top-28 -translate-x-1/2 w-[680px] max-w-[100vw] h-[440px] rounded-full bg-[radial-gradient(closest-side,oklch(0.8_0.16_75/0.22),transparent)] dark:bg-[radial-gradient(closest-side,oklch(0.8_0.16_75/0.1),transparent)]"
          />

          <div className="relative max-w-[880px] mx-auto px-5 text-center md:pt-6">
            <div className="rise inline-flex items-center gap-2.5" style={{ "--i": 0 }}>
              <img
                src="/images/work/show/upwards-icon.png"
                alt="Upwards app icon"
                onClick={() => setSpin(true)}
                onAnimationEnd={() => setSpin(false)}
                className={`app-icon w-9 h-9 drop-shadow-[0_6px_12px_oklch(0.58_0.15_55/0.3)] ${spin ? "spin" : ""}`}
              />
              <span className="ink text-[15px] font-semibold tracking-tight">Free Stripe app for Mac</span>
            </div>
            <h1 className="rise display mt-6" style={{ "--i": 2 }}>
              Your Stripe revenue,
              <br />
              <span className="serif">live in the menu bar.</span>
            </h1>
            <p className="rise lede mx-auto mt-5" style={{ "--i": 3 }}>
              Today's sales, MRR that matches Stripe, and every new subscription, cancellation or failed payment, a
              click away all day.
            </p>
            <div className="rise mt-8 flex flex-col sm:flex-row items-center justify-center gap-3" style={{ "--i": 4 }}>
              <DownloadButton />
              <a href="#install" className="btn-ghost inline-flex items-center gap-2 rounded-full px-5 py-2.5 text-[15px] font-semibold">
                How to install
              </a>
            </div>
            <div className="rise ink3 mt-4 flex flex-wrap justify-center gap-x-2.5 gap-y-1 text-[12.5px]" style={{ "--i": 5 }}>
              {["Free", `v${VERSION}`, SIZE, "macOS 14+", "Apple silicon & Intel"].map((t, i) => (
                <span key={t} className="whitespace-nowrap">
                  {i ? <span className="opacity-40 mr-2.5">·</span> : null}
                  {t}
                </span>
              ))}
            </div>
          </div>

          <div className="rise relative mt-12" style={{ "--i": 6 }}>
            <Showcase />
          </div>
        </section>

        <div className="max-w-[900px] mx-auto px-5">
          <Fleuron />

          {/* ── 01 Features ── */}
          <section>
            <header className="text-center mb-11">
              <Eyebrow n="01">What it does</Eyebrow>
              <h2 className="h2 mt-5 mx-auto max-w-[620px]">
                Everything you open Stripe for, <span className="serif">without opening Stripe.</span>
              </h2>
              <p className="lede mt-5 mx-auto">
                An MRR tracker and sales dashboard a click away in your menu bar, plus a few numbers you wish Stripe
                showed.
              </p>
            </header>
            <Features />
          </section>

          <Fleuron />

          {/* ── 02 The small things ── */}
          <section>
            <header className="text-center mb-11">
              <Eyebrow n="02">The small things</Eyebrow>
              <h2 className="h2 mt-5">
                Quiet, until <span className="serif">it matters.</span>
              </h2>
            </header>
            <Bento />
          </section>

          <Fleuron />

          {/* ── 02 Share cards ── */}
          <section>
            <header className="text-center mb-11">
              <Eyebrow n="03">Build in public</Eyebrow>
              <h2 className="h2 mt-5">
                Post your MRR, <span className="serif">beautifully.</span>
              </h2>
              <p className="lede mt-5 mx-auto">
                At the end of each month Upwards reminds you to share how it went. Three designs, every social size,
                drawn on your Mac.
              </p>
            </header>
            <ShareCards />
          </section>

          <Fleuron />

          {/* ── 03 Privacy ── */}
          <section>
            <header className="text-center mb-11">
              <Eyebrow n="04">Your key stays yours</Eyebrow>
              <h2 className="h2 mt-5">
                Read-only, <span className="serif">on your Mac.</span>
              </h2>
              <p className="lede mt-5 mx-auto">
                Upwards opens Stripe's restricted key form with these permissions already picked, all set to Read. You
                click Create key and paste it in. It goes into your macOS Keychain.
              </p>
            </header>
            <ul className="grid grid-cols-1 sm:grid-cols-2 gap-px rounded-[20px] overflow-hidden border rule bg-[var(--rule)] shadow-[0_30px_60px_-40px_oklch(0.35_0.08_60/0.4)]">
              {PERMISSIONS.map(([name, use]) => (
                <li key={name} className="perm flex items-center gap-3 px-5 py-4 bg-[var(--paper)]">
                  <div className="min-w-0">
                    <div className="ink text-[14.5px] font-medium">{name}</div>
                    <div className="ink3 text-[13px]">{use}</div>
                  </div>
                  <span className="pill ml-auto shrink-0">
                    <Check size={11} weight="bold" className="tick" />
                    Read
                  </span>
                </li>
              ))}
            </ul>
          </section>

          <Fleuron />

          {/* ── 04 Install ── */}
          <section id="install" className="grid grid-cols-1 md:grid-cols-[minmax(0,0.85fr)_minmax(0,1.15fr)] gap-10 md:gap-16">
            <header className="text-center md:text-left md:sticky md:top-28 self-start">
              <Eyebrow n="05" align="start">Install</Eyebrow>
              <h2 className="h2 mt-5">
                Up and running <span className="serif">in a minute.</span>
              </h2>
              <div className="mt-8 flex flex-col items-center md:items-start gap-3">
                <DownloadButton />
                <p className="ink3 text-[13px] tabular-nums">
                  Version {VERSION} · {SIZE} · macOS 14 or later
                </p>
              </div>
            </header>
            <ol className="border-t rule">
              {STEPS.map(([title, body], i) => (
                <li key={title} className="step flex gap-5 py-6 border-b rule">
                  <span className="n shrink-0 w-8 text-[46px] leading-[0.85] font-['Instrument_Serif',Georgia,serif] italic">
                    {i + 1}
                  </span>
                  <div className="min-w-0">
                    <h3 className="text-[17px] font-bold tracking-tight">{title}</h3>
                    <div className="mt-1 text-[15px] leading-relaxed">{body}</div>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <Fleuron />

          {/* ── 05 FAQ ── */}
          <section>
            <header className="text-center mb-10">
              <Eyebrow n="06">Questions</Eyebrow>
              <h2 className="h2 mt-5">
                Good to <span className="serif">know.</span>
              </h2>
            </header>
            <div className="grid grid-cols-1 md:grid-cols-2 md:gap-x-10 items-start">
              {[FAQ.slice(0, Math.ceil(FAQ.length / 2)), FAQ.slice(Math.ceil(FAQ.length / 2))].map((col, c) => (
                <div key={c} className={`border-t rule ${c ? "max-md:border-t-0" : ""}`}>
                  {col.map(([q, a]) => (
                    <QA key={q} q={q} a={a} />
                  ))}
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* ── Closing ── */}
        <section className="relative mt-20 md:mt-28 pt-20 overflow-hidden">
          <div
            aria-hidden
            className="grid-paper pointer-events-none absolute inset-0 [mask-image:radial-gradient(ellipse_60%_70%_at_50%_45%,#000_20%,transparent_100%)] [-webkit-mask-image:radial-gradient(ellipse_60%_70%_at_50%_45%,#000_20%,transparent_100%)]"
          />
          <div className="relative max-w-[880px] mx-auto px-5 text-center">
            <img
              src="/images/work/show/upwards-icon.png"
              alt=""
              className="mx-auto w-16 h-16 drop-shadow-[0_12px_20px_oklch(0.58_0.15_55/0.28)]"
            />
            <h2 className="h2 mt-7 !text-[clamp(1.9rem,1.3rem+2.6vw,3rem)]">
              Free, <span className="serif">for self and everyone.</span>
            </h2>
            <div className="mt-9 flex justify-center">
              <DownloadButton />
            </div>
            <div className="mt-16 text-[14px] leading-7">
              <a href="https://rishimohan.me" aria-hidden tabIndex={-1} className="inline-block mb-4">
                <img
                  src={`${IMG}/rishi-avatar.jpg`}
                  alt=""
                  width={80}
                  height={80}
                  className="w-20 h-20 rounded-full object-cover ring-1 ring-[var(--rule)] shadow-[0_12px_28px_-12px_oklch(0.35_0.08_60/0.45)]"
                />
              </a>
              <div>
                By{" "}
                <a href="https://rishimohan.me" className="link !text-[var(--ink)] font-medium">
                  Rishi Mohan
                </a>
              </div>
              <div>
                Also made{" "}
                {[
                  ["Orshot", "https://orshot.com"],
                  ["Pika", "https://pika.style"],
                  ["Muzekit", "https://muzekit.com"],
                ].map(([name, url], i, all) => (
                  <span key={name}>
                    <a href={`${url}?${utm}`} target="_blank" rel="noreferrer" className="link">
                      {name}
                    </a>
                    {i < all.length - 1 ? ", " : ""}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div aria-hidden className="wordmark relative mt-14 select-none text-center">
            Upwards
          </div>
        </section>
      </div>
    </>
  );
}
