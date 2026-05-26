import { useState, useRef, useEffect, useCallback } from "react";

const css = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:ital,opsz,wght@0,9..40,300;0,9..40,400;0,9..40,500;0,9..40,600;1,9..40,300&display=swap');

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --white: #FFFFFF;
  --bg: #FAFAF9;
  --bg2: #F4F3F0;
  --ink: #1A1916;
  --ink2: #4A4740;
  --muted: #9B9690;
  --border: rgba(26,25,22,0.08);
  --border2: rgba(26,25,22,0.14);
  --accent: #1A6B3C;
  --accent-light: rgba(26,107,60,0.07);
  --accent-mid: rgba(26,107,60,0.15);
  --serif: 'DM Serif Display', Georgia, serif;
  --sans: 'DM Sans', system-ui, sans-serif;
  --radius: 16px;
  --shadow: 0 1px 3px rgba(0,0,0,0.06), 0 4px 16px rgba(0,0,0,0.06);
  --shadow-lg: 0 8px 32px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.06);
}

html { scroll-behavior: smooth; }
body { background: var(--bg); color: var(--ink); font-family: var(--sans); min-height: 100vh; -webkit-font-smoothing: antialiased; }

/* ANIMATIONS */
@keyframes fadeUp { from { opacity:0; transform:translateY(20px); } to { opacity:1; transform:translateY(0); } }
@keyframes fadeIn { from { opacity:0; } to { opacity:1; } }
@keyframes scaleIn { from { opacity:0; transform:scale(0.97); } to { opacity:1; transform:scale(1); } }
@keyframes shimmer { 0%,100% { opacity:0.4; } 50% { opacity:0.8; } }
.fade-up { animation: fadeUp 0.5s ease both; }
.fade-up-1 { animation: fadeUp 0.5s 0.1s ease both; }
.fade-up-2 { animation: fadeUp 0.5s 0.2s ease both; }
.fade-up-3 { animation: fadeUp 0.5s 0.3s ease both; }

/* NAV */
nav {
  position: sticky; top: 0; z-index: 100;
  background: rgba(250,250,249,0.88); backdrop-filter: blur(20px) saturate(180%);
  border-bottom: 1px solid var(--border);
  padding: 0 48px; height: 64px;
  display: flex; align-items: center; justify-content: space-between;
}
.logo { font-family: var(--serif); font-size: 22px; letter-spacing: -0.3px; cursor: pointer; display: flex; align-items: center; gap: 10px; color: var(--ink); text-decoration: none; }
.logo-mark { width: 32px; height: 32px; background: var(--accent); border-radius: 8px; display: flex; align-items: center; justify-content: center; color: white; font-family: var(--serif); font-size: 16px; font-style: italic; flex-shrink: 0; }
.nav-links { display: flex; gap: 2px; }
.nl { padding: 7px 14px; border-radius: 10px; font-size: 14px; font-weight: 450; cursor: pointer; color: var(--ink2); border: none; background: none; font-family: var(--sans); transition: all 0.15s; letter-spacing: -0.1px; }
.nl:hover { background: var(--bg2); color: var(--ink); }
.nl.on { background: var(--bg2); color: var(--ink); font-weight: 500; }
.nav-cta { display: flex; gap: 8px; align-items: center; }
.btn { padding: 9px 18px; border-radius: 10px; font-size: 14px; font-weight: 550; cursor: pointer; border: none; font-family: var(--sans); transition: all 0.18s; letter-spacing: -0.2px; }
.btn-ghost { background: transparent; color: var(--ink2); border: 1px solid var(--border2); }
.btn-ghost:hover { background: var(--bg2); color: var(--ink); border-color: var(--border2); }
.btn-primary { background: var(--accent); color: white; }
.btn-primary:hover { background: #155C32; transform: translateY(-1px); box-shadow: 0 4px 12px rgba(26,107,60,0.3); }
.btn-sm { padding: 7px 14px; font-size: 13px; }

/* HERO */
.hero { padding: 88px 48px 0; max-width: 1200px; margin: 0 auto; }
.hero-eyebrow { display: inline-flex; align-items: center; gap: 8px; background: var(--accent-light); border: 1px solid var(--accent-mid); padding: 6px 14px; border-radius: 100px; font-size: 12px; font-weight: 550; color: var(--accent); letter-spacing: 0.3px; margin-bottom: 28px; }
.hero-eyebrow-dot { width: 5px; height: 5px; border-radius: 50%; background: var(--accent); animation: shimmer 2s infinite; }
.hero-layout { display: grid; grid-template-columns: 1fr 480px; gap: 64px; align-items: start; }
h1 { font-family: var(--serif); font-size: clamp(48px, 5.5vw, 72px); font-weight: 400; line-height: 1.08; letter-spacing: -1.5px; color: var(--ink); margin-bottom: 20px; }
h1 em { font-style: italic; color: var(--accent); }
.hero-sub { font-size: 17px; color: var(--muted); line-height: 1.65; font-weight: 350; max-width: 420px; margin-bottom: 36px; letter-spacing: -0.1px; }
.hero-actions { display: flex; gap: 10px; align-items: center; margin-bottom: 48px; }
.btn-lg { padding: 14px 28px; font-size: 15px; border-radius: 12px; }
.hero-trust { display: flex; gap: 20px; flex-wrap: wrap; }
.htrust { display: flex; align-items: center; gap: 6px; font-size: 12px; color: var(--muted); font-weight: 450; }
.htrust-icon { font-size: 13px; }

/* HERO STATS CARD */
.hero-card { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 24px; box-shadow: var(--shadow-lg); }
.hcard-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
.hcard-title { font-size: 13px; font-weight: 550; color: var(--ink2); }
.hcard-live { display: flex; align-items: center; gap: 5px; font-size: 11px; color: var(--accent); font-weight: 550; }
.live-pulse { width: 6px; height: 6px; border-radius: 50%; background: var(--accent); animation: shimmer 1.5s infinite; }
.hcard-stats { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 20px; }
.hstat { background: var(--bg); border-radius: 12px; padding: 14px; text-align: center; }
.hstat-n { font-family: var(--serif); font-size: 26px; color: var(--ink); letter-spacing: -0.5px; }
.hstat-l { font-size: 11px; color: var(--muted); margin-top: 2px; font-weight: 450; }
.mini-listing { display: flex; align-items: center; gap: 10px; padding: 10px 12px; background: var(--bg); border-radius: 10px; margin-bottom: 6px; cursor: pointer; transition: background 0.15s; }
.mini-listing:hover { background: var(--bg2); }
.mini-img { width: 44px; height: 36px; border-radius: 7px; overflow: hidden; background: var(--bg2); flex-shrink: 0; }
.mini-img img { width: 100%; height: 100%; object-fit: cover; }
.mini-info { flex: 1; min-width: 0; }
.mini-title { font-size: 13px; font-weight: 550; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; letter-spacing: -0.2px; }
.mini-sub { font-size: 11px; color: var(--muted); margin-top: 1px; }
.mini-price { font-family: var(--serif); font-size: 15px; font-weight: 400; color: var(--ink); flex-shrink: 0; }
.mini-score { font-size: 10px; padding: 2px 6px; border-radius: 5px; font-weight: 600; }
.score-g { background: rgba(26,107,60,0.08); color: var(--accent); }
.score-o { background: rgba(234,179,8,0.1); color: #A16207; }

/* SEARCH */
.search-section { max-width: 1200px; margin: 0 auto; padding: 0 48px; padding-bottom: 0; }
.search-box { background: var(--white); border: 1px solid var(--border2); border-radius: 20px; padding: 6px; box-shadow: var(--shadow); margin-bottom: 0; overflow: hidden; }
.search-tabs { display: flex; gap: 3px; padding: 6px 6px 0; margin-bottom: 12px; }
.stab { padding: 8px 16px; border-radius: 9px; font-size: 13px; font-weight: 500; cursor: pointer; color: var(--muted); border: none; background: none; font-family: var(--sans); transition: all 0.15s; }
.stab:hover { color: var(--ink); }
.stab.on { background: var(--accent); color: white; }
.search-row { display: grid; gap: 1px; background: var(--border); border-radius: 14px; overflow: hidden; margin-bottom: 6px; }
.search-row.r1 { grid-template-columns: 1.4fr 1fr 1fr 1fr 1fr auto; }
.search-row.r2 { grid-template-columns: repeat(4, 1fr); }
.sf { background: var(--white); padding: 12px 16px; display: flex; flex-direction: column; gap: 4px; transition: background 0.15s; }
.sf:hover { background: var(--bg); }
.sf-label { font-size: 10px; font-weight: 650; text-transform: uppercase; letter-spacing: 0.7px; color: var(--muted); }
.sf-sel, .sf-inp { border: none; background: transparent; font-size: 14px; font-family: var(--sans); color: var(--ink); outline: none; font-weight: 450; width: 100%; letter-spacing: -0.2px; }
.sf-inp::placeholder { color: var(--muted); }
.sf-go { background: var(--accent); padding: 12px 24px; border: none; cursor: pointer; display: flex; align-items: center; gap: 6px; font-size: 14px; font-weight: 600; color: white; font-family: var(--sans); transition: background 0.15s; white-space: nowrap; }
.sf-go:hover { background: #155C32; }
.adv-btn { display: flex; align-items: center; gap: 5px; padding: 8px 12px; font-size: 12px; color: var(--muted); cursor: pointer; border: none; background: none; font-family: var(--sans); transition: color 0.15s; margin-bottom: 6px; }
.adv-btn:hover { color: var(--ink2); }
.adv-row { border-top: 1px solid var(--border); padding-top: 6px; }

/* DIVIDER */
.section-divider { max-width: 1200px; margin: 0 auto; padding: 56px 48px 0; }
.sd-label { font-size: 11px; font-weight: 650; text-transform: uppercase; letter-spacing: 1px; color: var(--muted); margin-bottom: 8px; }
.sd-title { font-family: var(--serif); font-size: 36px; letter-spacing: -0.8px; color: var(--ink); margin-bottom: 4px; }
.sd-sub { font-size: 15px; color: var(--muted); font-weight: 350; }

/* MAIN GRID */
.main { max-width: 1200px; margin: 28px auto 0; padding: 0 48px 64px; display: grid; grid-template-columns: 240px 1fr; gap: 24px; }

/* SIDEBAR */
.sidebar { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); padding: 20px; height: fit-content; position: sticky; top: 80px; box-shadow: var(--shadow); }
.sb-head { display: flex; justify-content: space-between; align-items: center; margin-bottom: 18px; }
.sb-title { font-size: 12px; font-weight: 650; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); }
.sb-clear { font-size: 12px; color: var(--accent); cursor: pointer; font-weight: 550; }
.fg { margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid var(--border); }
.fg:last-child { border: none; margin: 0; padding: 0; }
.fg-label { font-size: 12px; font-weight: 600; margin-bottom: 10px; color: var(--ink2); letter-spacing: -0.1px; }
.chips { display: flex; flex-wrap: wrap; gap: 5px; }
.chip { padding: 5px 11px; border: 1px solid var(--border2); border-radius: 100px; font-size: 12px; cursor: pointer; background: transparent; font-family: var(--sans); color: var(--ink2); transition: all 0.15s; letter-spacing: -0.1px; }
.chip:hover { border-color: var(--accent); color: var(--accent); }
.chip.on { background: var(--accent-light); border-color: var(--accent); color: var(--accent); font-weight: 550; }
.rrow { display: grid; grid-template-columns: 1fr 1fr; gap: 6px; }
.ri { padding: 8px 10px; border: 1px solid var(--border); border-radius: 8px; font-size: 12px; font-family: var(--sans); color: var(--ink); background: var(--bg); outline: none; width: 100%; transition: border-color 0.15s; }
.ri:focus { border-color: var(--accent); }
.ri::placeholder { color: var(--muted); }

/* LISTINGS */
.listings-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
.lcount { font-size: 14px; color: var(--ink2); font-weight: 450; }
.lcount strong { color: var(--ink); font-weight: 600; }
.lsort { padding: 7px 12px; border: 1px solid var(--border); border-radius: 8px; font-size: 13px; font-family: var(--sans); background: var(--white); color: var(--ink2); outline: none; cursor: pointer; }

/* CAR CARD */
.ccard { background: var(--white); border: 1px solid var(--border); border-radius: var(--radius); overflow: hidden; cursor: pointer; transition: all 0.22s; margin-bottom: 12px; display: grid; grid-template-columns: 260px 1fr; box-shadow: var(--shadow); }
.ccard:hover { border-color: rgba(26,107,60,0.25); box-shadow: var(--shadow-lg); transform: translateY(-2px); }
.cimg { position: relative; overflow: hidden; background: var(--bg2); }
.cimg img { width: 100%; height: 100%; object-fit: cover; transition: transform 0.4s ease; display: block; }
.ccard:hover .cimg img { transform: scale(1.04); }
.cimg-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 52px; }
.cbadges { position: absolute; top: 10px; left: 10px; display: flex; flex-direction: column; gap: 4px; }
.cbadge { padding: 3px 8px; border-radius: 6px; font-size: 10px; font-weight: 650; letter-spacing: 0.3px; backdrop-filter: blur(8px); }
.cb-v { background: rgba(26,107,60,0.9); color: white; }
.cb-h { background: rgba(26,25,22,0.8); color: white; }
.cb-n { background: rgba(255,255,255,0.9); color: var(--ink); }
.cbody { padding: 18px 20px; display: flex; flex-direction: column; justify-content: space-between; }
.ctitle { font-family: var(--serif); font-size: 19px; letter-spacing: -0.3px; margin-bottom: 3px; line-height: 1.2; }
.csub { font-size: 12px; color: var(--muted); margin-bottom: 14px; font-weight: 450; }
.cspecs { display: flex; gap: 6px; flex-wrap: wrap; margin-bottom: 14px; }
.cspec { font-size: 11px; color: var(--ink2); background: var(--bg); padding: 4px 9px; border-radius: 6px; font-weight: 450; }
.cfooter { display: flex; justify-content: space-between; align-items: flex-end; }
.cprice { font-family: var(--serif); font-size: 26px; letter-spacing: -0.5px; color: var(--ink); }
.cprice-sub { font-size: 11px; color: var(--muted); margin-top: 1px; font-weight: 400; }
.cai { display: flex; align-items: center; gap: 5px; }
.cai-pill { padding: 5px 10px; border-radius: 8px; font-size: 11px; font-weight: 600; }
.ai-g { background: var(--accent-light); color: var(--accent); }
.ai-o { background: rgba(234,179,8,0.08); color: #A16207; }
.ai-r { background: rgba(239,68,68,0.08); color: #DC2626; }
.cseller { display: flex; align-items: center; gap: 8px; padding-top: 12px; border-top: 1px solid var(--border); margin-top: 12px; }
.cavatar { width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 11px; font-weight: 700; color: white; flex-shrink: 0; }
.cname { font-size: 12px; font-weight: 550; color: var(--ink2); }
.cmeta { font-size: 11px; color: var(--muted); }
.cver { font-size: 11px; color: var(--accent); font-weight: 600; margin-left: auto; display: flex; align-items: center; gap: 3px; }

/* GALLERY */
.gal { border-radius: 15px 15px 0 0; overflow: hidden; background: #0A0A0A; }
.gal-main { height: 340px; position: relative; cursor: grab; }
.gal-main:active { cursor: grabbing; }
.gal-main img { width: 100%; height: 100%; object-fit: cover; display: block; }
.gal-ph { position: absolute; inset: 0; display: flex; align-items: center; justify-content: center; font-size: 80px; }
.gal-close { position: absolute; top: 14px; right: 14px; width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.2); cursor: pointer; color: white; font-size: 15px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.gal-close:hover { background: rgba(255,255,255,0.25); }
.gal-modes { position: absolute; top: 14px; left: 14px; display: flex; gap: 6px; }
.gm { padding: 6px 14px; border-radius: 100px; font-size: 11px; font-weight: 650; cursor: pointer; border: none; font-family: var(--sans); backdrop-filter: blur(8px); transition: all 0.15s; }
.gm.on { background: white; color: var(--ink); }
.gm.off { background: rgba(0,0,0,0.4); color: white; border: 1px solid rgba(255,255,255,0.1); }
.gal-arr { position: absolute; top: 50%; transform: translateY(-50%); width: 36px; height: 36px; border-radius: 50%; background: rgba(255,255,255,0.15); backdrop-filter: blur(8px); border: 1px solid rgba(255,255,255,0.15); cursor: pointer; color: white; font-size: 18px; display: flex; align-items: center; justify-content: center; transition: background 0.15s; }
.gal-arr:hover { background: rgba(255,255,255,0.25); }
.gal-arr.l { left: 12px; }
.gal-arr.r { right: 12px; }
.gal-hint { position: absolute; bottom: 14px; left: 50%; transform: translateX(-50%); background: rgba(0,0,0,0.5); backdrop-filter: blur(8px); color: white; padding: 6px 16px; border-radius: 100px; font-size: 11px; pointer-events: none; white-space: nowrap; }
.gal-thumbs { display: flex; gap: 6px; padding: 10px 12px; background: #111; overflow-x: auto; }
.gal-thumb { flex-shrink: 0; border-radius: 7px; overflow: hidden; cursor: pointer; border: 2px solid transparent; transition: border-color 0.15s; }
.gal-thumb.on { border-color: var(--accent); }
.gal-thumb img { width: 72px; height: 50px; object-fit: cover; display: block; }
.gal-thumb-l { font-size: 9px; color: #666; text-align: center; padding: 3px 0; background: #111; }
.rot-bar { display: flex; align-items: center; gap: 10px; padding: 10px 14px; background: #111; }
.rot-track { flex: 1; height: 2px; background: #333; border-radius: 100px; overflow: hidden; }
.rot-fill { height: 100%; background: var(--accent); border-radius: 100px; }

/* MODAL */
.modal-bg { position: fixed; inset: 0; background: rgba(26,25,22,0.6); z-index: 200; display: flex; align-items: flex-start; justify-content: center; padding: 24px 20px; overflow-y: auto; backdrop-filter: blur(8px); animation: fadeIn 0.2s; }
.modal { background: var(--white); border-radius: 20px; max-width: 840px; width: 100%; animation: scaleIn 0.25s ease; margin: auto; box-shadow: 0 24px 80px rgba(0,0,0,0.2); }
.mbody { padding: 28px; }
.mhead { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 20px; }
.mtitle { font-family: var(--serif); font-size: 26px; letter-spacing: -0.5px; }
.mprice { font-family: var(--serif); font-size: 32px; letter-spacing: -1px; color: var(--accent); }
.mspecs { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 18px; }
.mspec { background: var(--bg); border-radius: 10px; padding: 12px 14px; }
.msl { font-size: 10px; color: var(--muted); font-weight: 600; text-transform: uppercase; letter-spacing: 0.5px; margin-bottom: 4px; }
.msv { font-size: 14px; font-weight: 550; letter-spacing: -0.2px; }
.ai-box { background: linear-gradient(135deg, rgba(26,107,60,0.06), rgba(26,107,60,0.03)); border: 1px solid rgba(26,107,60,0.12); border-radius: 12px; padding: 16px 18px; margin-bottom: 18px; }
.ai-box-title { font-size: 12px; font-weight: 650; color: var(--accent); margin-bottom: 6px; display: flex; align-items: center; gap: 6px; }
.ai-box-text { font-size: 13px; color: var(--ink2); line-height: 1.65; font-weight: 400; }
.hist { display: flex; gap: 10px; margin-bottom: 20px; }
.hi { flex: 1; background: var(--bg); border-radius: 10px; padding: 14px; text-align: center; }
.hi-icon { font-size: 20px; margin-bottom: 5px; }
.hi-l { font-size: 10px; color: var(--muted); font-weight: 500; }
.hi-v { font-size: 13px; font-weight: 600; margin-top: 3px; letter-spacing: -0.1px; }
.mactions { display: flex; gap: 8px; }
.mact { flex: 1; padding: 14px; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; border: none; font-family: var(--sans); transition: all 0.15s; letter-spacing: -0.2px; }
.mact.main { background: var(--accent); color: white; }
.mact.main:hover { background: #155C32; }
.mact.sec { background: var(--bg); color: var(--ink2); border: 1px solid var(--border2); }
.mact.sec:hover { background: var(--bg2); }

/* LOGIN */
.login-box { background: var(--white); border-radius: 20px; max-width: 420px; width: 100%; padding: 36px; animation: scaleIn 0.25s ease; margin: auto; box-shadow: 0 24px 80px rgba(0,0,0,0.15); }
.ltitle { font-family: var(--serif); font-size: 26px; letter-spacing: -0.5px; margin-bottom: 4px; }
.lsub { font-size: 14px; color: var(--muted); margin-bottom: 24px; font-weight: 350; }
.linput { width: 100%; padding: 12px 14px; border: 1px solid var(--border2); border-radius: 10px; font-size: 14px; font-family: var(--sans); color: var(--ink); background: var(--bg); outline: none; margin-bottom: 10px; transition: border-color 0.15s; }
.linput:focus { border-color: var(--accent); background: var(--white); }
.linput::placeholder { color: var(--muted); }
.lbtn { width: 100%; padding: 13px; background: var(--accent); color: white; border: none; border-radius: 10px; font-size: 14px; font-weight: 600; cursor: pointer; font-family: var(--sans); transition: all 0.15s; margin-bottom: 12px; letter-spacing: -0.2px; }
.lbtn:hover { background: #155C32; }
.lbtn-g { background: var(--bg); color: var(--ink); border: 1px solid var(--border2); }
.lbtn-g:hover { background: var(--bg2); }
.lsep { text-align: center; font-size: 12px; color: var(--muted); margin-bottom: 12px; }
.lswitch { text-align: center; font-size: 13px; color: var(--muted); margin-top: 18px; }
.lswitch span { color: var(--accent); cursor: pointer; font-weight: 600; }

/* POST */
.post-wrap { max-width: 720px; margin: 40px auto; padding: 0 40px 64px; }
.post-box { background: var(--white); border: 1px solid var(--border); border-radius: 20px; padding: 32px; box-shadow: var(--shadow); }
.ptitle { font-family: var(--serif); font-size: 28px; letter-spacing: -0.5px; margin-bottom: 4px; }
.psub { font-size: 14px; color: var(--muted); margin-bottom: 28px; font-weight: 350; }
.sec-label { font-size: 11px; font-weight: 650; text-transform: uppercase; letter-spacing: 0.8px; color: var(--muted); margin-bottom: 14px; padding-bottom: 10px; border-bottom: 1px solid var(--border); }
.fg2 { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.fg3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; margin-bottom: 12px; }
.fgroup { display: flex; flex-direction: column; gap: 5px; margin-bottom: 12px; }
.flabel { font-size: 11px; font-weight: 650; text-transform: uppercase; letter-spacing: 0.5px; color: var(--muted); }
.finput, .fselect, .ftarea { width: 100%; padding: 11px 13px; border: 1px solid var(--border); border-radius: 9px; font-size: 14px; font-family: var(--sans); color: var(--ink); background: var(--bg); outline: none; transition: border-color 0.15s; letter-spacing: -0.1px; }
.finput:focus, .fselect:focus, .ftarea:focus { border-color: var(--accent); background: var(--white); }
.finput::placeholder { color: var(--muted); }
.ftarea { min-height: 90px; resize: vertical; }
.photo-drop { border: 1.5px dashed var(--border2); border-radius: 12px; padding: 32px; text-align: center; cursor: pointer; background: var(--bg); margin-bottom: 16px; transition: border-color 0.15s; }
.photo-drop:hover { border-color: var(--accent); }
.plans { display: grid; grid-template-columns: repeat(3,1fr); gap: 10px; margin-bottom: 18px; }
.plan { border: 1.5px solid var(--border); border-radius: 12px; padding: 16px; cursor: pointer; text-align: center; transition: all 0.15s; }
.plan:hover { border-color: var(--border2); }
.plan.on { border-color: var(--accent); background: var(--accent-light); }
.plan-p { font-family: var(--serif); font-size: 24px; letter-spacing: -0.5px; }
.plan-l { font-size: 12px; color: var(--muted); margin-top: 2px; font-weight: 450; }
.plan-d { font-size: 11px; color: var(--ink2); margin-top: 5px; }
.ai-hint { background: var(--accent-light); border: 1px solid var(--accent-mid); border-radius: 10px; padding: 12px 14px; margin-bottom: 18px; font-size: 13px; color: var(--ink2); }
.post-btn { width: 100%; padding: 14px; background: var(--accent); color: white; border: none; border-radius: 10px; font-size: 15px; font-weight: 600; cursor: pointer; font-family: var(--sans); transition: all 0.15s; letter-spacing: -0.2px; }
.post-btn:hover { background: #155C32; }
.success-box { text-align: center; padding: 20px 0; }

@media(max-width:900px){
  nav { padding: 0 20px; }
  .hero { padding: 48px 20px 0; }
  .hero-layout { grid-template-columns: 1fr; }
  .hero-card { display: none; }
  .search-section { padding: 0 20px; }
  .main { grid-template-columns: 1fr; padding: 0 20px 48px; }
  .sidebar { display: none; }
  .ccard { grid-template-columns: 1fr; }
  .cimg { height: 180px; }
  .section-divider { padding: 40px 20px 0; }
  .post-wrap { padding: 20px 20px 48px; }
  .fg2, .fg3 { grid-template-columns: 1fr; }
  .search-row.r1 { grid-template-columns: 1fr 1fr; }
  .mspecs { grid-template-columns: 1fr 1fr; }
}
`;

const PHOTOS = {
  "BMW":        ["https://images.unsplash.com/photo-1555215695-3004980ad54e?w=900&q=80","https://images.unsplash.com/photo-1617469767053-d3b523a0b982?w=900&q=80","https://images.unsplash.com/photo-1580273916550-e323be2ae537?w=900&q=80","https://images.unsplash.com/photo-1556189250-72ba954cfc2b?w=900&q=80","https://images.unsplash.com/photo-1603584173870-7f23fdae1b7a?w=900&q=80"],
  "Mercedes":   ["https://images.unsplash.com/photo-1618843479313-40f8afb4b4d8?w=900&q=80","https://images.unsplash.com/photo-1553440569-bcc63803a83d?w=900&q=80","https://images.unsplash.com/photo-1606016159991-dfe4f2746ad5?w=900&q=80","https://images.unsplash.com/photo-1609521263047-f8f205293f24?w=900&q=80","https://images.unsplash.com/photo-1605559424843-9e4c228bf1c2?w=900&q=80"],
  "Audi":       ["https://images.unsplash.com/photo-1603386329225-868f9b1ee6c9?w=900&q=80","https://images.unsplash.com/photo-1542282088-fe8426682b8f?w=900&q=80","https://images.unsplash.com/photo-1493238792000-8113da705763?w=900&q=80","https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=900&q=80","https://images.unsplash.com/photo-1600712242805-5f78671b24da?w=900&q=80"],
  "Volkswagen": ["https://images.unsplash.com/photo-1622200295574-422cf2a6af1b?w=900&q=80","https://images.unsplash.com/photo-1541899481282-d53bffe3c35d?w=900&q=80","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&q=80","https://images.unsplash.com/photo-1471444928139-48c5bf5173f8?w=900&q=80","https://images.unsplash.com/photo-1590510296535-c12df1f9b00e?w=900&q=80"],
  "Toyota":     ["https://images.unsplash.com/photo-1621007947382-bb3c3994e3fb?w=900&q=80","https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=900&q=80","https://images.unsplash.com/photo-1569171186-e494f6bc2de7?w=900&q=80","https://images.unsplash.com/photo-1558981403-c5f9899a28bc?w=900&q=80","https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=900&q=80"],
};
const LABELS = ["Priekis","Salonas","Šonas","Galas","Variklis"];

function Gallery({ car, onClose }) {
  const [idx, setIdx] = useState(0);
  const [mode, setMode] = useState("gallery");
  const [angle, setAngle] = useState(0);
  const [drag, setDrag] = useState(false);
  const [startX, setStartX] = useState(0);
  const [startAngle, setStartAngle] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const photos = PHOTOS[car.make] || PHOTOS["BMW"];
  const rotPhotos = [...photos, ...photos];
  const rotIdx = Math.floor(((angle % 360) + 360) % 360 / (360 / rotPhotos.length)) % rotPhotos.length;
  const current = mode === "rotate" ? rotPhotos[rotIdx] : photos[idx];
  const onMD = useCallback((e) => { setDrag(true); setStartX(e.clientX || e.touches?.[0]?.clientX || 0); setStartAngle(angle); e.preventDefault(); }, [angle]);
  const onMM = useCallback((e) => { if (!drag) return; const x = e.clientX || e.touches?.[0]?.clientX || 0; setAngle(startAngle + (x - startX) * 0.5); }, [drag, startX, startAngle]);
  const onMU = useCallback(() => setDrag(false), []);
  useEffect(() => {
    window.addEventListener("mousemove", onMM); window.addEventListener("mouseup", onMU);
    window.addEventListener("touchmove", onMM); window.addEventListener("touchend", onMU);
    return () => { window.removeEventListener("mousemove", onMM); window.removeEventListener("mouseup", onMU); window.removeEventListener("touchmove", onMM); window.removeEventListener("touchend", onMU); };
  }, [onMM, onMU]);
  return (
    <div className="gal">
      <div className="gal-main" onMouseDown={mode === "rotate" ? onMD : undefined} onTouchStart={mode === "rotate" ? onMD : undefined}>
        {!loaded && <div className="gal-ph">{car.emoji}</div>}
        <img key={current} src={current} alt={car.make} onLoad={() => setLoaded(true)} onError={() => setLoaded(false)} style={{ opacity: loaded ? 1 : 0, transition: "opacity 0.3s" }} />
        <button className="gal-close" onClick={onClose}>✕</button>
        <div className="gal-modes">
          <button className={`gm ${mode === "gallery" ? "on" : "off"}`} onClick={() => { setMode("gallery"); setLoaded(false); }}>📷 Galerija</button>
          <button className={`gm ${mode === "rotate" ? "on" : "off"}`} onClick={() => { setMode("rotate"); setLoaded(false); }}>🔄 360°</button>
        </div>
        {mode === "gallery" && <>
          <button className="gal-arr l" onClick={() => { setIdx(i => (i - 1 + photos.length) % photos.length); setLoaded(false); }}>‹</button>
          <button className="gal-arr r" onClick={() => { setIdx(i => (i + 1) % photos.length); setLoaded(false); }}>›</button>
        </>}
        {mode === "rotate" && <div className="gal-hint">← Tempk pelę sukimui →</div>}
      </div>
      {mode === "gallery" ? (
        <div className="gal-thumbs">
          {photos.map((p, i) => (
            <div key={i} className={`gal-thumb ${idx === i ? "on" : ""}`} onClick={() => { setIdx(i); setLoaded(false); }}>
              <img src={p} alt={LABELS[i]} /><div className="gal-thumb-l">{LABELS[i]}</div>
            </div>
          ))}
        </div>
      ) : (
        <div className="rot-bar">
          <div style={{ fontSize: 11, color: "#666" }}>0°</div>
          <div className="rot-track"><div className="rot-fill" style={{ width: `${((angle % 360) + 360) % 360 / 360 * 100}%` }} /></div>
          <div style={{ fontSize: 11, color: "#666" }}>{Math.round(((angle % 360) + 360) % 360)}°</div>
        </div>
      )}
    </div>
  );
}

const CARS = [
  { id:1, emoji:"🚗", make:"BMW", model:"5 Series", year:2021, price:38500, km:42000, fuel:"Dyzelinas", trans:"Automatinė", power:"190 kW", color:"Juoda", city:"Vilnius", seller:"Tomas K.", sc:"#1A6B3C", score:"Gera kaina", st:"g", verified:true, badge:"v", doors:4, seats:5, body:"Sedanas", drive:"Galinė", condition:"Labai gera", history:{owners:1,service:"Pilna",accidents:"Nėra"}, ai:"Kaina €38,500 yra 8% žemiau rinkos vidurkio. Automobilis be avarijų, vienas savininkas — patikimas pasirinkimas." },
  { id:2, emoji:"🚙", make:"Mercedes", model:"C-Class", year:2020, price:32900, km:67000, fuel:"Dyzelinas", trans:"Automatinė", power:"170 kW", color:"Sidabrinė", city:"Kaunas", seller:"Lina M.", sc:"#4A4740", score:"Vidutinė", st:"o", verified:true, badge:"h", doors:4, seats:5, body:"Sedanas", drive:"Galinė", condition:"Gera", history:{owners:2,service:"Dalinė",accidents:"Nėra"}, ai:"Kaina atitinka rinkos vidurkį. Du savininkai — rekomenduojame patikrinti servisą." },
  { id:3, emoji:"🚘", make:"Audi", model:"A6", year:2022, price:45200, km:18000, fuel:"Hibridas", trans:"Automatinė", power:"215 kW", color:"Balta", city:"Klaipėda", seller:"Marius J.", sc:"#2D6A8A", score:"Gera kaina", st:"g", verified:false, badge:"n", doors:4, seats:5, body:"Universalas", drive:"Pilnas", condition:"Puiki", history:{owners:1,service:"Pilna",accidents:"Nėra"}, ai:"Naujas automobilis su pilna garantija. Hibridinė sistema ypač tinka miestui." },
  { id:4, emoji:"🏎️", make:"Volkswagen", model:"Passat", year:2019, price:18900, km:98000, fuel:"Dyzelinas", trans:"Mechaninė", power:"140 kW", color:"Pilka", city:"Šiauliai", seller:"Agnė V.", sc:"#8A6A2A", score:"Brangu", st:"r", verified:true, badge:"v", doors:4, seats:5, body:"Universalas", drive:"Priekinė", condition:"Gera", history:{owners:3,service:"Dalinė",accidents:"1 smulkus"}, ai:"Kaina šiek tiek aukštesnė nei rinkos vidurkis. Buvo smulkus įvykis — patikrinkite kėbulą." },
  { id:5, emoji:"🚐", make:"Toyota", model:"RAV4", year:2021, price:34700, km:31000, fuel:"Hibridas", trans:"Automatinė", power:"160 kW", color:"Mėlyna", city:"Vilnius", seller:"Kęstutis B.", sc:"#6B3A1A", score:"Gera kaina", st:"g", verified:true, badge:"h", doors:4, seats:5, body:"Visureigis", drive:"Pilnas", condition:"Labai gera", history:{owners:1,service:"Pilna",accidents:"Nėra"}, ai:"Toyota hibridai — ilgaamžiai. Kaina 11% žemiau rinkos." },
];

const MAKES=["Visi","BMW","Mercedes","Audi","Volkswagen","Toyota","Ford","Volvo","Skoda"];
const FUELS=["Visi","Dyzelinas","Benzinas","Hibridas","Elektra"];
const TRANS=["Visi","Automatinė","Mechaninė","Pusautomatė"];
const BODIES=["Visi","Sedanas","Universalas","Visureigis","Hečbekas","Kupė","Minivenas"];
const DRIVES=["Visi","Priekinė","Galinė","Pilnas"];
const COLORS=["Juoda","Balta","Pilka","Sidabrinė","Mėlyna","Raudona","Žalia","Ruda"];
const CITIES=["Vilnius","Kaunas","Klaipėda","Šiauliai","Panevėžys"];

export default function App() {
  const [view, setView] = useState("home");
  const [selected, setSelected] = useState(null);
  const [loginOpen, setLoginOpen] = useState(false);
  const [loginTab, setLoginTab] = useState("in");
  const [adv, setAdv] = useState(false);
  const [plan, setPlan] = useState("standard");
  const [postDone, setPostDone] = useState(false);
  const [fMake, setFMake] = useState("Visi");
  const [fFuel, setFFuel] = useState("Visi");
  const [fTrans, setFTrans] = useState("Visi");
  const [fBody, setFBody] = useState("Visi");

  const filtered = CARS.filter(c => {
    if (fMake !== "Visi" && c.make !== fMake) return false;
    if (fFuel !== "Visi" && c.fuel !== fFuel) return false;
    if (fTrans !== "Visi" && c.trans !== fTrans) return false;
    if (fBody !== "Visi" && c.body !== fBody) return false;
    return true;
  });

  const reset = () => { setView("home"); setPostDone(false); };

  return (
    <div>
      <style>{css}</style>

      <nav>
        <a className="logo" onClick={reset}>
          <div className="logo-mark">R</div>
          Rida.lt
        </a>
        <div className="nav-links">
          <button className={`nl ${view === "home" ? "on" : ""}`} onClick={reset}>Skelbimai</button>
          <button className="nl">Įvertinti</button>
          <button className="nl">Istorija</button>
          <button className="nl">Dileriai</button>
        </div>
        <div className="nav-cta">
          <button className="btn btn-ghost btn-sm" onClick={() => setLoginOpen(true)}>Prisijungti</button>
          <button className="btn btn-primary btn-sm" onClick={() => { setView("post"); setPostDone(false); }}>+ Skelbimas</button>
        </div>
      </nav>

      {view === "home" && (<>
        {/* HERO */}
        <div className="hero">
          <div className="hero-layout">
            <div>
              <div className="hero-eyebrow fade-up"><div className="hero-eyebrow-dot" />Lietuvos automobilių platforma</div>
              <h1 className="fade-up-1">Rask automobilį,<br />kuriuo <em>pasitikėsi</em></h1>
              <p className="hero-sub fade-up-2">Patikrinta istorija, AI kainos analizė ir verifikuoti pardavėjai. Jokie staigmenos po pirkimo.</p>
              <div className="hero-actions fade-up-3">
                <button className="btn btn-primary btn-lg" onClick={() => document.querySelector('.search-section')?.scrollIntoView({ behavior: 'smooth' })}>Ieškoti automobilio</button>
                <button className="btn btn-ghost btn-lg" onClick={() => { setView("post"); setPostDone(false); }}>Parduoti →</button>
              </div>
              <div className="hero-trust fade-up-3">
                {[["✓","Regitra istorija"],["✓","AI kainos analizė"],["✓","Verifikuoti pardavėjai"],["✓","Nemokami skelbimai"]].map(([i,t]) => (
                  <div key={t} className="htrust"><span className="htrust-icon" style={{ color: "var(--accent)", fontWeight: 700 }}>{i}</span>{t}</div>
                ))}
              </div>
            </div>

            {/* HERO CARD */}
            <div className="hero-card fade-up-2">
              <div className="hcard-top">
                <div className="hcard-title">Šiandien platformoje</div>
                <div className="hcard-live"><div className="live-pulse" />Gyva</div>
              </div>
              <div className="hcard-stats">
                {[["4,821","Skelbimai"],["98%","Verifikuoti"],["4.9★","Įvertinimas"]].map(([n,l]) => (
                  <div key={l} className="hstat"><div className="hstat-n">{n}</div><div className="hstat-l">{l}</div></div>
                ))}
              </div>
              {CARS.slice(0, 3).map(car => (
                <div key={car.id} className="mini-listing" onClick={() => setSelected(car)}>
                  <div className="mini-img">
                    <img src={(PHOTOS[car.make] || PHOTOS["BMW"])[0]} alt={car.make} onError={e => e.target.style.display = "none"} />
                  </div>
                  <div className="mini-info">
                    <div className="mini-title">{car.year} {car.make} {car.model}</div>
                    <div className="mini-sub">{car.km.toLocaleString()} km · {car.city}</div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div className="mini-price">€{car.price.toLocaleString()}</div>
                    <div className={`mini-score ${car.st === "g" ? "score-g" : "score-o"}`}>{car.score}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* SEARCH */}
        <div className="search-section" style={{ paddingTop: 40 }}>
          <div className="search-box">
            <div className="search-tabs">
              <button className="stab on">🚗 Pirkti</button>
              <button className="stab">📋 Parduoti</button>
              <button className="stab">🔍 Patikrinti istoriją</button>
            </div>
            <div className="search-row r1">
              {[["Markė", MAKES], ["Kuras", FUELS], ["Kėbulas", BODIES], ["Pavarų dėžė", TRANS], ["Miestas", ["Visi", ...CITIES]]].map(([label, opts]) => (
                <div key={label} className="sf">
                  <div className="sf-label">{label}</div>
                  <select className="sf-sel">{opts.map(o => <option key={o}>{o}</option>)}</select>
                </div>
              ))}
              <button className="sf-go">Ieškoti →</button>
            </div>
            {adv && (
              <div className="adv-row">
                <div className="search-row r2" style={{ marginBottom: 6 }}>
                  {[["Metai nuo","2015"],["Metai iki","2024"],["Kaina nuo €","5 000"],["Kaina iki €","50 000"],["Rida nuo km","0"],["Rida iki km","200 000"],["Galia kW","80"],["Variklis l","1.6"]].map(([l, p]) => (
                    <div key={l} className="sf">
                      <div className="sf-label">{l}</div>
                      <input className="sf-inp" placeholder={p} />
                    </div>
                  ))}
                </div>
                <div className="search-row r2">
                  {[["Pavara", DRIVES], ["Spalva", ["Visokia", ...COLORS]], ["Durų sk.", ["Visos", "2", "3", "4", "5"]], ["AI įvertinimas", ["Visi", "Gera kaina", "Vidutinė", "Brangu"]]].map(([label, opts]) => (
                    <div key={label} className="sf">
                      <div className="sf-label">{label}</div>
                      <select className="sf-sel">{opts.map(o => <option key={o}>{o}</option>)}</select>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <button className="adv-btn" onClick={() => setAdv(a => !a)}>
              {adv ? "▲ Mažiau filtrų" : "▼ Daugiau filtrų — galia, spalva, pavara, rida..."}
            </button>
          </div>
        </div>

        {/* LISTINGS */}
        <div className="section-divider">
          <div className="sd-label">Skelbimai</div>
          <div className="sd-title">Naujausi automobiliai</div>
        </div>

        <div className="main">
          <div className="sidebar">
            <div className="sb-head">
              <div className="sb-title">Filtrai</div>
              <span className="sb-clear" onClick={() => { setFMake("Visi"); setFFuel("Visi"); setFTrans("Visi"); setFBody("Visi"); }}>Išvalyti</span>
            </div>
            <div className="fg"><div className="fg-label">Markė</div><div className="chips">{MAKES.map(m => <button key={m} className={`chip ${fMake === m ? "on" : ""}`} onClick={() => setFMake(m)}>{m}</button>)}</div></div>
            <div className="fg"><div className="fg-label">Kuras</div><div className="chips">{FUELS.map(f => <button key={f} className={`chip ${fFuel === f ? "on" : ""}`} onClick={() => setFFuel(f)}>{f}</button>)}</div></div>
            <div className="fg"><div className="fg-label">Pavarų dėžė</div><div className="chips">{TRANS.map(t => <button key={t} className={`chip ${fTrans === t ? "on" : ""}`} onClick={() => setFTrans(t)}>{t}</button>)}</div></div>
            <div className="fg"><div className="fg-label">Kėbulo tipas</div><div className="chips">{BODIES.map(b => <button key={b} className={`chip ${fBody === b ? "on" : ""}`} onClick={() => setFBody(b)}>{b}</button>)}</div></div>
            <div className="fg"><div className="fg-label">Kaina (€)</div><div className="rrow"><input className="ri" placeholder="Nuo" /><input className="ri" placeholder="Iki" /></div></div>
            <div className="fg"><div className="fg-label">Rida (km)</div><div className="rrow"><input className="ri" placeholder="Nuo" /><input className="ri" placeholder="Iki" /></div></div>
            <div className="fg"><div className="fg-label">Metai</div><div className="rrow"><input className="ri" placeholder="Nuo" /><input className="ri" placeholder="Iki" /></div></div>
            <div className="fg"><div className="fg-label">AI įvertinimas</div><div className="chips">{["Visi","Gera kaina","Vidutinė","Brangu"].map(s => <button key={s} className="chip">{s}</button>)}</div></div>
          </div>

          <div>
            <div className="listings-top">
              <div className="lcount"><strong>{filtered.length}</strong> skelbimai iš {CARS.length}</div>
              <select className="lsort"><option>Naujausi</option><option>Pigiausi</option><option>Brangiausi</option><option>Mažiausia rida</option><option>AI įvertinimas</option></select>
            </div>
            {filtered.map((car, i) => (
              <div key={car.id} className="ccard" style={{ animationDelay: `${i * 0.06}s` }} onClick={() => setSelected(car)}>
                <div className="cimg">
                  <div className="cimg-ph">{car.emoji}</div>
                  <img src={(PHOTOS[car.make] || PHOTOS["BMW"])[0]} alt={car.make} onError={e => e.target.style.display = "none"} style={{ position: "relative", zIndex: 1 }} />
                  <div className="cbadges">
                    {car.badge === "v" && <span className="cbadge cb-v">✓ Patikrintas</span>}
                    {car.badge === "h" && <span className="cbadge cb-h">🔥 Populiarus</span>}
                    {car.badge === "n" && <span className="cbadge cb-n">Naujas</span>}
                  </div>
                </div>
                <div className="cbody">
                  <div>
                    <div className="ctitle">{car.year} {car.make} {car.model}</div>
                    <div className="csub">{car.city} · {car.body} · Įdėta šiandien</div>
                    <div className="cspecs">
                      <span className="cspec">⛽ {car.fuel}</span>
                      <span className="cspec">⚙️ {car.trans}</span>
                      <span className="cspec">⚡ {car.power}</span>
                      <span className="cspec">📍 {car.km.toLocaleString()} km</span>
                      <span className="cspec">🎨 {car.color}</span>
                      <span className="cspec">🚪 {car.doors}d</span>
                    </div>
                  </div>
                  <div>
                    <div className="cfooter">
                      <div>
                        <div className="cprice">€{car.price.toLocaleString()}</div>
                        <div className="cprice-sub">~€{Math.round(car.price / 60)}/mėn.</div>
                      </div>
                      <span className={`cai-pill ${car.st === "g" ? "ai-g" : car.st === "o" ? "ai-o" : "ai-r"}`}>{car.score}</span>
                    </div>
                    <div className="cseller">
                      <div className="cavatar" style={{ background: car.sc }}>{car.seller[0]}</div>
                      <div><div className="cname">{car.seller}</div><div className="cmeta">Privatus pardavėjas</div></div>
                      {car.verified && <div className="cver">✓ Verifikuotas</div>}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </>)}

      {/* POST */}
      {view === "post" && (
        <div className="post-wrap">
          {!postDone ? (
            <div className="post-box">
              <div className="ptitle">Įdėti skelbimą</div>
              <div className="psub">Užpildyk — tie patys laukai naudojami pirkėjų filtruose.</div>
              <div className="sec-label">Pagrindinė informacija</div>
              <div className="fg2">
                <div className="fgroup"><label className="flabel">Markė</label><select className="fselect">{MAKES.filter(m => m !== "Visi").map(m => <option key={m}>{m}</option>)}</select></div>
                <div className="fgroup"><label className="flabel">Modelis</label><input className="finput" placeholder="pvz. 5 Series" /></div>
              </div>
              <div className="fg3">
                <div className="fgroup"><label className="flabel">Metai</label><input className="finput" placeholder="2021" /></div>
                <div className="fgroup"><label className="flabel">Rida (km)</label><input className="finput" placeholder="45 000" /></div>
                <div className="fgroup"><label className="flabel">Kaina (€)</label><input className="finput" placeholder="25 000" /></div>
              </div>
              <div className="sec-label" style={{ marginTop: 8 }}>Techniniai duomenys</div>
              <div className="fg3">
                <div className="fgroup"><label className="flabel">Kuras</label><select className="fselect">{FUELS.filter(f => f !== "Visi").map(f => <option key={f}>{f}</option>)}</select></div>
                <div className="fgroup"><label className="flabel">Pavarų dėžė</label><select className="fselect">{TRANS.filter(t => t !== "Visi").map(t => <option key={t}>{t}</option>)}</select></div>
                <div className="fgroup"><label className="flabel">Kėbulas</label><select className="fselect">{BODIES.filter(b => b !== "Visi").map(b => <option key={b}>{b}</option>)}</select></div>
              </div>
              <div className="fg3">
                <div className="fgroup"><label className="flabel">Pavara</label><select className="fselect">{DRIVES.filter(d => d !== "Visi").map(d => <option key={d}>{d}</option>)}</select></div>
                <div className="fgroup"><label className="flabel">Galia (kW)</label><input className="finput" placeholder="140" /></div>
                <div className="fgroup"><label className="flabel">Variklis (l)</label><input className="finput" placeholder="2.0" /></div>
              </div>
              <div className="fg3">
                <div className="fgroup"><label className="flabel">Spalva</label><select className="fselect">{COLORS.map(c => <option key={c}>{c}</option>)}</select></div>
                <div className="fgroup"><label className="flabel">Durų sk.</label><select className="fselect">{["2","3","4","5"].map(d => <option key={d}>{d}</option>)}</select></div>
                <div className="fgroup"><label className="flabel">Miestas</label><select className="fselect">{CITIES.map(c => <option key={c}>{c}</option>)}</select></div>
              </div>
              <div className="sec-label" style={{ marginTop: 8 }}>Aprašymas ir nuotraukos</div>
              <div className="fgroup"><label className="flabel">Aprašymas</label><textarea className="ftarea" placeholder="Būklė, komplektacija, papildoma informacija..." /></div>
              <div className="photo-drop">
                <div style={{ fontSize: 28, marginBottom: 6 }}>📸</div>
                <div style={{ fontSize: 13, color: "var(--ink2)" }}>Tempk nuotraukas arba <span style={{ color: "var(--accent)", fontWeight: 600 }}>pasirink failus</span></div>
                <div style={{ fontSize: 11, color: "var(--muted)", marginTop: 4 }}>Iki 20 nuotraukų · JPG, PNG · Max 10MB</div>
              </div>
              <div className="sec-label" style={{ marginTop: 8 }}>Planas</div>
              <div className="plans">
                {[{ id: "basic", p: "€3", l: "Paprastas", d: "30 d." }, { id: "standard", p: "€9", l: "Standartinis", d: "60 d. · Iškeltas" }, { id: "premium", p: "€19", l: "Premium", d: "90 d. · TOP" }].map(pl => (
                  <div key={pl.id} className={`plan ${plan === pl.id ? "on" : ""}`} onClick={() => setPlan(pl.id)}>
                    <div className="plan-p">{pl.p}</div><div className="plan-l">{pl.l}</div><div className="plan-d">{pl.d}</div>
                  </div>
                ))}
              </div>
              <div className="ai-hint">🤖 <strong>AI automatiškai</strong> įvertins kainą ir palyginsus su rinkos vidurkiu.</div>
              <button className="post-btn" onClick={() => setPostDone(true)}>Apmokėti ir skelbti →</button>
            </div>
          ) : (
            <div className="post-box">
              <div className="success-box">
                <div style={{ fontSize: 52, marginBottom: 16 }}>🎉</div>
                <div style={{ fontFamily: "var(--serif)", fontSize: 26, letterSpacing: -0.5, marginBottom: 8 }}>Skelbimas įdėtas!</div>
                <p style={{ fontSize: 14, color: "var(--muted)", lineHeight: 1.65, marginBottom: 24 }}>AI analizuoja automobilį. Skelbimas jau matomas visiems.</p>
                <button className="btn btn-primary btn-lg" onClick={reset}>Žiūrėti skelbimus →</button>
              </div>
            </div>
          )}
        </div>
      )}

      {/* DETAIL MODAL */}
      {selected && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setSelected(null)}>
          <div className="modal">
            <Gallery car={selected} onClose={() => setSelected(null)} />
            <div className="mbody">
              <div className="mhead">
                <div>
                  <div className="mtitle">{selected.year} {selected.make} {selected.model}</div>
                  <div style={{ fontSize: 12, color: "var(--muted)", marginTop: 4 }}>{selected.city} · {selected.body} · Privatus pardavėjas</div>
                </div>
                <div style={{ textAlign: "right" }}>
                  <div className="mprice">€{selected.price.toLocaleString()}</div>
                  <div style={{ fontSize: 11, color: "var(--muted)" }}>~€{Math.round(selected.price / 60)}/mėn.</div>
                </div>
              </div>
              <div className="mspecs">
                {[["Kuras", selected.fuel], ["Pavarų dėžė", selected.trans], ["Galia", selected.power], ["Rida", `${selected.km.toLocaleString()} km`], ["Spalva", selected.color], ["Būklė", selected.condition]].map(([l, v]) => (
                  <div key={l} className="mspec"><div className="msl">{l}</div><div className="msv">{v}</div></div>
                ))}
              </div>
              <div className="ai-box">
                <div className="ai-box-title">🤖 AI analizė — <span className={`cai-pill ${selected.st === "g" ? "ai-g" : selected.st === "o" ? "ai-o" : "ai-r"}`} style={{ marginLeft: 4 }}>{selected.score}</span></div>
                <div className="ai-box-text">{selected.ai}</div>
              </div>
              <div className="hist">
                {[["📋", "Savininkai", selected.history.owners], ["🔧", "Priežiūra", selected.history.service], ["💥", "Avarijos", selected.history.accidents]].map(([icon, l, v]) => (
                  <div key={l} className="hi"><div className="hi-icon">{icon}</div><div className="hi-l">{l}</div><div className="hi-v">{v}</div></div>
                ))}
              </div>
              <div className="mactions">
                <button className="mact main">📞 Susisiekti</button>
                <button className="mact sec">💾 Išsaugoti</button>
                <button className="mact sec">📤 Dalintis</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* LOGIN MODAL */}
      {loginOpen && (
        <div className="modal-bg" onClick={e => e.target === e.currentTarget && setLoginOpen(false)}>
          <div className="login-box">
            <button onClick={() => setLoginOpen(false)} style={{ float: "right", background: "none", border: "none", cursor: "pointer", color: "var(--muted)", fontSize: 18 }}>✕</button>
            <div className="ltitle">{loginTab === "in" ? "Sveiki sugrįžę" : "Prisijunkite"}</div>
            <div className="lsub">{loginTab === "in" ? "Prisijunkite prie Rida.lt" : "Sukurkite nemokamą paskyrą"}</div>
            {loginTab === "reg" && <input className="linput" placeholder="Vardas ir pavardė" />}
            <input className="linput" type="email" placeholder="El. paštas" />
            <input className="linput" type="password" placeholder="Slaptažodis" />
            {loginTab === "reg" && <input className="linput" type="tel" placeholder="Telefono numeris" />}
            <button className="lbtn" onClick={() => setLoginOpen(false)}>{loginTab === "in" ? "Prisijungti →" : "Registruotis →"}</button>
            <div className="lsep">arba</div>
            <button className="lbtn lbtn-g" onClick={() => setLoginOpen(false)}>🔑 Tęsti su Google</button>
            <div className="lswitch">
              {loginTab === "in" ? <>Neturi paskyros? <span onClick={() => setLoginTab("reg")}>Registruotis</span></> : <>Jau turi paskyrą? <span onClick={() => setLoginTab("in")}>Prisijungti</span></>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
