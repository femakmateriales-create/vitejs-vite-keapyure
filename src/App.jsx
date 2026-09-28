import { useState, useEffect } from "react";
import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword, signOut, onAuthStateChanged } from "firebase/auth";
import { getFirestore, doc, getDoc, collection, onSnapshot, addDoc, updateDoc, deleteDoc, writeBatch, query, orderBy, serverTimestamp } from "firebase/firestore";
//la key de firebase de mi amor 
const firebaseConfig = {
  apiKey: "AIzaSyAX4NPjL-mKbVOKaLyR-Rd_XImBk0j5hV4",
  authDomain: "empresaurios-41706.firebaseapp.com",
  projectId: "empresaurios-41706",
  storageBucket: "empresaurios-41706.firebasestorage.app",
  messagingSenderId: "539429696749",
  appId: "1:539429696749:web:174c8157ebc1ea8100c8e4",
  measurementId: "G-3FM123NP2Z"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const fmt = (n) => `$${Number(n).toLocaleString("es-MX", { minimumFractionDigits: 0 })}`;

const CSS = `
@import url('https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=JetBrains+Mono:wght@500;600&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0;}
:root{
  --p100:#f3eeff;--p200:#ddd0ff;--p300:#c4a8ff;--p400:#a87fff;
  --p500:#8b5cf6;--p600:#7c3aed;--p700:#6d28d9;--p800:#5b21b6;
  --pink:#f472b6;--pinkd:#db2777;--rose:#fda4af;
  --bg:#0f0a1a;--bg2:#160e28;--bg3:#1e1435;
  --sur:#231b3a;--sur2:#2d2450;--sur3:#382d60;
  --bdr:rgba(139,92,246,0.16);--bdr2:rgba(139,92,246,0.32);--bdrp:rgba(244,114,182,0.25);
  --tx:#f5f0ff;--tx2:#c4b8e0;--tx3:#7a6a9a;
  --ok:#34d399;--warn:#fbbf24;--err:#f87171;
  --glow:0 0 32px rgba(139,92,246,.22);--glowp:0 0 24px rgba(244,114,182,.2);
  --shad:0 12px 40px rgba(0,0,0,.55);
  --r:18px;--rsm:12px;--rlg:26px;
  --f:'Sora',sans-serif;--m:'JetBrains Mono',monospace;
  --tr:0.2s cubic-bezier(0.4,0,0.2,1);
  --nav:68px;
}
html,body,#root{height:100%;overflow:hidden;}
body{font-family:var(--f);background:var(--bg);color:var(--tx);-webkit-tap-highlight-color:transparent;}
::-webkit-scrollbar{display:none;}

@keyframes fadeUp{from{opacity:0;transform:translateY(16px);}to{opacity:1;transform:translateY(0);}}
@keyframes popIn{from{opacity:0;transform:scale(.9);}to{opacity:1;transform:scale(1);}}
@keyframes slideUp{from{transform:translateY(100%);}to{transform:translateY(0);}}
@keyframes spin{to{transform:rotate(360deg);}}
@keyframes orbF{0%,100%{transform:translateY(0) scale(1);}50%{transform:translateY(-18px) scale(1.04);}}
@keyframes ntfIn{from{opacity:0;transform:translateY(-16px) scale(.95);}to{opacity:1;transform:translateY(0) scale(1);}}
@keyframes shimmer{0%{background-position:-200% 0;}100%{background-position:200% 0;}}
@keyframes heartbeat{0%,100%{transform:scale(1);}50%{transform:scale(1.08);}}
.fu{animation:fadeUp .3s ease both;}
.pi{animation:popIn .28s cubic-bezier(.34,1.56,.64,1) both;}

/* ── SHELL ── */
.app{display:flex;flex-direction:column;height:100vh;height:100dvh;overflow:hidden;background:var(--bg);}
.screen{flex:1;overflow:hidden;display:flex;flex-direction:column;min-height:0;}

/* ── TOPBAR ── */
.topbar{
  padding:14px 18px 13px;
  background:linear-gradient(180deg,var(--bg2) 0%,rgba(22,14,40,.95) 100%);
  border-bottom:1px solid var(--bdr);
  display:flex;align-items:center;gap:12px;
  flex-shrink:0;
  backdrop-filter:blur(16px);
}
.topbar-brand{display:flex;align-items:center;gap:8px;flex:1;}
.topbar-logo{width:34px;height:34px;background:linear-gradient(135deg,var(--p500),var(--pink));border-radius:10px;display:flex;align-items:center;justify-content:center;font-size:17px;box-shadow:0 4px 14px rgba(139,92,246,.4);}
.topbar-name{font-size:16px;font-weight:800;background:linear-gradient(135deg,var(--p300),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.topbar-sub{font-size:10px;color:var(--tx3);margin-top:1px;}
.topbar-time{font-size:11px;color:var(--tx3);font-family:var(--m);}

/* ── BOTTOM NAV ── */
.botnav{
  height:var(--nav);background:var(--bg2);
  border-top:1px solid var(--bdr);
  display:flex;flex-shrink:0;
  padding-bottom:env(safe-area-inset-bottom);
  position:relative;
}
.botnav::before{content:'';position:absolute;top:0;left:0;right:0;height:1px;background:linear-gradient(90deg,transparent,var(--p500),var(--pink),transparent);opacity:.5;}
.bni{
  flex:1;display:flex;flex-direction:column;align-items:center;justify-content:center;
  gap:3px;border:none;background:transparent;color:var(--tx3);cursor:pointer;
  transition:var(--tr);padding:8px 2px;
  font-family:var(--f);font-size:9.5px;font-weight:600;
  position:relative;letter-spacing:.2px;
}
.bni.act{color:var(--p300);}
.bni.act .ni-ico{filter:drop-shadow(0 0 8px rgba(139,92,246,.7));}
.ni-ico{transition:var(--tr);font-size:22px;line-height:1;}
.ni-dot{position:absolute;top:10px;right:calc(50% - 16px);width:7px;height:7px;background:var(--warn);border-radius:50%;border:2px solid var(--bg2);}

/* ── SCROLL ── */
.scrollable{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:14px 14px 6px;}
.scrollable.nopad{padding:0;}

/* ── LOGIN ── */
.login-wrap{height:100vh;height:100dvh;display:flex;align-items:center;justify-content:center;background:var(--bg);position:relative;overflow:hidden;}
.orb{position:absolute;border-radius:50%;filter:blur(90px);animation:orbF 7s ease-in-out infinite;pointer-events:none;}
.o1{width:360px;height:360px;background:radial-gradient(circle,rgba(139,92,246,.38),transparent 70%);top:-100px;left:-80px;}
.o2{width:280px;height:280px;background:radial-gradient(circle,rgba(244,114,182,.28),transparent 70%);bottom:-60px;right:-60px;animation-delay:3s;}
.o3{width:180px;height:180px;background:radial-gradient(circle,rgba(91,33,182,.22),transparent 70%);top:60%;left:60%;animation-delay:1.5s;}
.login-card{
  position:relative;z-index:1;
  background:rgba(35,27,58,.93);backdrop-filter:blur(24px);
  border:1px solid var(--bdr2);border-radius:var(--rlg);
  padding:38px 28px;width:calc(100% - 28px);max-width:390px;
  box-shadow:var(--glow),var(--shad);
}
.brand{display:flex;align-items:center;gap:11px;margin-bottom:8px;}
.brand-ico{width:48px;height:48px;background:linear-gradient(135deg,var(--p500),var(--pink));border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:22px;box-shadow:0 6px 20px rgba(139,92,246,.45),0 0 0 1px rgba(244,114,182,.2);}
.brand-name{font-size:24px;font-weight:800;background:linear-gradient(135deg,var(--p300),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.brand-tag{font-size:11px;color:var(--tx3);margin-left:59px;margin-bottom:24px;letter-spacing:.3px;}
.login-h1{font-size:25px;font-weight:800;margin-bottom:4px;}
.login-sub{font-size:12.5px;color:var(--tx3);margin-bottom:22px;}

.fld{margin-bottom:15px;}
.fld label{display:block;font-size:10.5px;font-weight:700;color:var(--tx2);margin-bottom:6px;text-transform:uppercase;letter-spacing:.6px;}
.fi{width:100%;background:var(--sur2);border:1.5px solid var(--bdr);border-radius:var(--rsm);padding:13px 15px;color:var(--tx);font-family:var(--f);font-size:15px;outline:none;transition:var(--tr);}
.fi:focus{border-color:var(--p500);box-shadow:0 0 0 3px rgba(139,92,246,.14);}
.fi::placeholder{color:var(--tx3);}
select.fi{cursor:pointer;appearance:none;}

.btn{display:inline-flex;align-items:center;justify-content:center;gap:7px;padding:13px 20px;border-radius:var(--rsm);font-family:var(--f);font-size:14px;font-weight:700;cursor:pointer;border:none;transition:var(--tr);-webkit-tap-highlight-color:transparent;letter-spacing:.1px;}
.btn:active{transform:scale(.95);}
.bp{background:linear-gradient(135deg,var(--p500),var(--pinkd));color:#fff;box-shadow:0 6px 22px rgba(139,92,246,.42);}
.bp:hover{box-shadow:0 8px 28px rgba(139,92,246,.58);}
.bp:disabled{opacity:.38;cursor:not-allowed;}
.bg_{background:var(--sur2);color:var(--tx2);border:1.5px solid var(--bdr);}
.bg_:hover{color:var(--tx);border-color:var(--bdr2);}
.bdn{background:rgba(248,113,113,.1);color:var(--err);border:1.5px solid rgba(248,113,113,.24);}
.bfull{width:100%;padding:15px;}
.bsm{padding:9px 14px;font-size:13px;}

.ale{padding:11px 14px;border-radius:var(--rsm);font-size:13px;margin-bottom:15px;}
.ale-e{background:rgba(248,113,113,.08);color:#fca5a5;border:1px solid rgba(248,113,113,.2);}



/* ── POS ── */
.pos-wrap{display:flex;flex-direction:column;height:100%;overflow:hidden;}
.pos-sticky{padding:12px 14px 0;background:var(--bg);flex-shrink:0;}
.sbar{display:flex;align-items:center;gap:9px;background:var(--sur2);border:1.5px solid var(--bdr);border-radius:50px;padding:11px 16px;margin-bottom:11px;transition:var(--tr);}
.sbar:focus-within{border-color:var(--p500);box-shadow:0 0 0 3px rgba(139,92,246,.12);}
.sbar input{background:none;border:none;color:var(--tx);font-family:var(--f);font-size:14px;outline:none;flex:1;}
.sbar input::placeholder{color:var(--tx3);}
.cats{display:flex;gap:7px;overflow-x:auto;padding-bottom:11px;-webkit-overflow-scrolling:touch;}
.cats::-webkit-scrollbar{display:none;}
.cat-chip{padding:8px 16px;border-radius:50px;font-size:11.5px;font-weight:700;cursor:pointer;border:1.5px solid var(--bdr);background:var(--sur);color:var(--tx2);white-space:nowrap;flex-shrink:0;transition:var(--tr);}
.cat-chip.act{background:linear-gradient(135deg,var(--p500),var(--pink));border-color:transparent;color:#fff;box-shadow:0 3px 14px rgba(139,92,246,.4);}

/* ── PRODUCTS GRID ── */
.pos-products{flex:1;overflow-y:auto;-webkit-overflow-scrolling:touch;padding:4px 14px 8px;}
.pgrid{display:grid;grid-template-columns:repeat(3,1fr);gap:10px;padding-bottom:6px;}
.pcard{
  background:var(--sur);border:1.5px solid var(--bdr);border-radius:var(--r);
  padding:14px 8px 12px;cursor:pointer;transition:var(--tr);text-align:center;
  position:relative;-webkit-tap-highlight-color:transparent;
  display:flex;flex-direction:column;align-items:center;
}
.pcard:active{transform:scale(.93);background:var(--sur3);border-color:var(--p500);}
.pcard.os{opacity:.33;pointer-events:none;}
.pcard.hot{border-color:var(--bdrp);background:linear-gradient(160deg,var(--sur),rgba(244,114,182,.06));}
.p-emi{font-size:30px;display:block;margin-bottom:7px;line-height:1;}
.p-nm{font-size:10.5px;font-weight:600;line-height:1.3;margin-bottom:5px;color:var(--tx);width:100%;}
.p-pr{font-size:13px;font-weight:800;font-family:var(--m);color:var(--p300);}
.p-stk{font-size:9px;color:var(--tx3);margin-top:3px;}
.p-vdr{font-size:8px;color:var(--tx3);margin-top:2px;}
.p-low{position:absolute;top:6px;right:6px;width:7px;height:7px;background:var(--warn);border-radius:50%;box-shadow:0 0 6px var(--warn);}

/* ── CART BAR ── */
.cart-bar{
  margin:0 14px 10px;
  background:linear-gradient(135deg,var(--p600),var(--pinkd));
  border-radius:var(--r);padding:14px 18px;
  display:flex;align-items:center;gap:12px;cursor:pointer;
  box-shadow:0 6px 24px rgba(139,92,246,.45),0 0 0 1px rgba(244,114,182,.2);
  transition:var(--tr);flex-shrink:0;
}
.cart-bar:active{transform:scale(.97);}
.cart-count{width:30px;height:30px;background:rgba(255,255,255,.22);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:800;color:#fff;flex-shrink:0;}
.cart-label{font-size:14px;font-weight:700;color:#fff;flex:1;}
.cart-items-txt{font-size:10.5px;color:rgba(255,255,255,.7);margin-top:1px;}
.cart-total{font-size:17px;font-weight:800;font-family:var(--m);color:#fff;}
.cart-arrow{color:rgba(255,255,255,.7);font-size:18px;}

/* ── SHEET ── */
.sheet-overlay{position:fixed;inset:0;background:rgba(0,0,0,.7);backdrop-filter:blur(6px);z-index:100;display:flex;flex-direction:column;justify-content:flex-end;}
.sheet{background:var(--bg2);border-radius:26px 26px 0 0;border:1px solid var(--bdr2);border-bottom:none;max-height:92vh;display:flex;flex-direction:column;animation:slideUp .32s cubic-bezier(.32,1,.56,1);}
.sheet-handle{width:44px;height:5px;background:var(--sur3);border-radius:99px;margin:14px auto 0;}
.sheet-hdr{padding:16px 20px 14px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;justify-content:space-between;}
.sheet-title{font-size:17px;font-weight:800;display:flex;align-items:center;gap:8px;}
.sheet-close{background:var(--sur2);border:none;color:var(--tx2);width:30px;height:30px;border-radius:50%;font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;transition:var(--tr);}
.sheet-close:active{background:var(--sur3);}
.sheet-body{flex:1;overflow-y:auto;padding:10px 18px;}
.sheet-foot{padding:14px 18px;border-top:1px solid var(--bdr);padding-bottom:calc(14px + env(safe-area-inset-bottom));}

.citem{display:flex;align-items:center;gap:12px;padding:13px 0;border-bottom:1px solid var(--bdr);}
.citem:last-child{border-bottom:none;}
.c-emi{font-size:28px;flex-shrink:0;width:40px;text-align:center;}
.c-info{flex:1;}
.c-nm{font-size:13px;font-weight:700;}
.c-pr{font-size:12px;color:var(--p300);font-family:var(--m);margin-top:2px;}
.cqty{display:flex;align-items:center;gap:9px;}
.qb{width:32px;height:32px;border-radius:10px;background:var(--sur2);border:1.5px solid var(--bdr);color:var(--tx);display:flex;align-items:center;justify-content:center;font-size:17px;font-weight:700;cursor:pointer;transition:var(--tr);}
.qb:active{background:var(--p600);border-color:var(--p500);}
.qn{font-size:15px;font-weight:800;min-width:24px;text-align:center;font-family:var(--m);}
.rb{background:none;border:none;color:var(--tx3);cursor:pointer;padding:6px;font-size:20px;transition:var(--tr);}
.rb:active{color:var(--err);}

.totals{margin-bottom:14px;}
.trow{display:flex;justify-content:space-between;padding:5px 0;font-size:13px;color:var(--tx2);}
.trow.grand{font-size:18px;font-weight:800;color:var(--tx);padding-top:10px;border-top:1px solid var(--bdr);}
.tval{font-family:var(--m);}
.pay-grid{display:grid;grid-template-columns:1fr 1fr;gap:8px;margin-bottom:14px;}
.pchip{padding:12px;border-radius:var(--rsm);font-size:12.5px;font-weight:700;cursor:pointer;border:1.5px solid var(--bdr);background:var(--sur2);color:var(--tx2);transition:var(--tr);font-family:var(--f);text-align:center;}
.pchip.sel{background:rgba(139,92,246,.15);border-color:var(--p500);color:var(--p300);}
.pchip:active{transform:scale(.95);}
.cobrar{width:100%;padding:17px;border-radius:var(--r);background:linear-gradient(135deg,var(--p500),var(--pinkd));color:#fff;font-family:var(--f);font-size:16px;font-weight:800;cursor:pointer;border:none;box-shadow:0 6px 24px rgba(139,92,246,.45);transition:var(--tr);letter-spacing:.2px;}
.cobrar:active{transform:scale(.97);}
.cobrar:disabled{opacity:.35;cursor:not-allowed;transform:none;}

/* ── STAT CARDS ── */
.sg{display:grid;grid-template-columns:1fr 1fr;gap:11px;margin-bottom:14px;}
.stat-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--r);padding:16px 14px;position:relative;overflow:hidden;}
.stat-card::before{content:'';position:absolute;top:-20px;right:-20px;width:70px;height:70px;border-radius:50%;background:var(--grad,rgba(139,92,246,.08));filter:blur(20px);}
.stat-ico{font-size:26px;margin-bottom:8px;}
.stat-lbl{font-size:10px;font-weight:700;color:var(--tx3);text-transform:uppercase;letter-spacing:.5px;margin-bottom:5px;}
.stat-val{font-size:22px;font-weight:800;font-family:var(--m);}
.stat-sub{font-size:10.5px;color:var(--tx3);margin-top:4px;}

/* ── CHART ── */
.chart-wrap{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--r);padding:16px;margin-bottom:14px;}
.chart-title{font-size:13px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:7px;}
.bars{display:flex;align-items:flex-end;gap:5px;height:88px;}
.bar-col{display:flex;flex-direction:column;align-items:center;gap:4px;flex:1;}
.bar{width:100%;border-radius:7px 7px 0 0;background:linear-gradient(to top,var(--p700),var(--p400));min-height:4px;transition:height .6s cubic-bezier(.34,1.56,.64,1);}
.bar.today{background:linear-gradient(to top,var(--pinkd),var(--pink));}
.bar-lbl{font-size:8.5px;color:var(--tx3);}
.bar-val{font-size:8.5px;font-family:var(--m);color:var(--p300);}

/* ── TCARD ── */
.tcard{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--r);overflow:hidden;margin-bottom:14px;}
.tcard-head{padding:14px 16px;border-bottom:1px solid var(--bdr);font-size:14px;font-weight:700;display:flex;align-items:center;justify-content:space-between;}

.list-item{padding:13px 16px;border-bottom:1px solid var(--bdr);display:flex;align-items:center;gap:12px;transition:var(--tr);}
.list-item:last-child{border-bottom:none;}
.li-ico{font-size:26px;width:38px;text-align:center;flex-shrink:0;}
.li-info{flex:1;min-width:0;}
.li-name{font-size:13px;font-weight:700;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;}
.li-sub{font-size:11px;color:var(--tx3);margin-top:3px;display:flex;align-items:center;gap:6px;flex-wrap:wrap;}
.li-right{text-align:right;flex-shrink:0;}
.li-val{font-size:14px;font-weight:800;font-family:var(--m);color:var(--p300);}
.li-meta{font-size:10px;color:var(--tx3);margin-top:2px;}
.spill{padding:3px 9px;border-radius:99px;font-size:10px;font-weight:700;font-family:var(--m);}
.sok{background:rgba(52,211,153,.1);color:var(--ok);}
.slow{background:rgba(251,191,36,.1);color:var(--warn);}
.sout{background:rgba(248,113,113,.1);color:var(--err);}
.sale-bdg{padding:3px 9px;border-radius:99px;font-size:10px;font-weight:700;background:rgba(139,92,246,.12);color:var(--p300);}

/* ── INV ACTIONS ── */
.stk-inp{width:64px;padding:7px 8px;background:var(--sur2);border:1.5px solid var(--bdr);border-radius:var(--rsm);color:var(--tx);font-family:var(--m);font-size:13px;outline:none;text-align:center;}
.stk-inp:focus{border-color:var(--p500);}
.inv-actions{display:flex;gap:5px;margin-top:6px;justify-content:flex-end;}

/* ── MODAL ── */
.movl{position:fixed;inset:0;background:rgba(0,0,0,.75);backdrop-filter:blur(6px);z-index:200;display:flex;align-items:flex-end;justify-content:center;}
.modal{background:var(--bg2);border-radius:26px 26px 0 0;border:1px solid var(--bdr2);width:100%;max-width:520px;animation:slideUp .3s cubic-bezier(.32,1,.56,1);padding-bottom:env(safe-area-inset-bottom);}
.modal-inner{padding:20px 20px 22px;max-height:88vh;overflow-y:auto;}
.modal-h{width:44px;height:5px;background:var(--sur3);border-radius:99px;margin:14px auto 0;}
.modal-title{font-size:17px;font-weight:800;margin-bottom:18px;}
.modal-act{display:flex;gap:10px;margin-top:18px;}
.modal-act .btn{flex:1;}

/* ── RECEIPT ── */
.rec{background:var(--bg3);border:1px solid var(--bdr);border-radius:var(--r);padding:20px;font-family:var(--m);}
.r-head{text-align:center;margin-bottom:16px;border-bottom:1px dashed var(--bdr);padding-bottom:14px;}
.r-brand{font-size:18px;font-weight:800;background:linear-gradient(135deg,var(--p300),var(--pink));-webkit-background-clip:text;-webkit-text-fill-color:transparent;}
.r-tag{font-size:10px;color:var(--tx3);margin-top:3px;}
.r-date{font-size:9.5px;color:var(--tx3);margin-top:2px;}
.r-item{display:flex;justify-content:space-between;font-size:11.5px;padding:4px 0;color:var(--tx2);}
.r-div{border:none;border-top:1px dashed var(--bdr);margin:9px 0;}
.r-tot{display:flex;justify-content:space-between;font-size:15px;font-weight:800;color:var(--tx);padding-top:7px;}
.r-foot{text-align:center;font-size:9.5px;color:var(--tx3);margin-top:14px;border-top:1px dashed var(--bdr);padding-top:11px;line-height:1.6;}

/* ── PROFILE ── */
.profile-hero{background:linear-gradient(160deg,var(--sur),var(--sur2));border:1px solid var(--bdr);border-radius:var(--r);padding:24px;text-align:center;margin-bottom:14px;position:relative;overflow:hidden;}
.profile-hero::before{content:'✨🎀✨';position:absolute;top:10px;right:14px;font-size:14px;opacity:.4;}
.p-av{width:70px;height:70px;border-radius:50%;background:linear-gradient(135deg,var(--p500),var(--pink));display:flex;align-items:center;justify-content:center;font-size:28px;margin:0 auto 12px;box-shadow:0 6px 24px rgba(139,92,246,.45);}
.p-name{font-size:20px;font-weight:800;margin-bottom:3px;}
.p-email{font-size:11.5px;color:var(--tx3);}
.rbdg{display:inline-block;padding:4px 12px;border-radius:99px;font-size:10.5px;font-weight:700;margin-top:10px;}
.radm{background:rgba(139,92,246,.18);color:var(--p300);border:1px solid var(--bdr2);}
.rvnd{background:rgba(244,114,182,.12);color:var(--pink);border:1px solid var(--bdrp);}

/* ── TEAM ── */
.team-card{background:var(--sur);border:1px solid var(--bdr);border-radius:var(--r);padding:14px 16px;display:flex;align-items:center;gap:14px;margin-bottom:10px;}
.t-av{width:44px;height:44px;border-radius:50%;background:linear-gradient(135deg,var(--p500),var(--pink));display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0;}
.t-name{font-size:13.5px;font-weight:700;}
.t-email{font-size:10.5px;color:var(--tx3);margin-top:2px;}

/* ── EMPTY ── */
.empty{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:50px 20px;color:var(--tx3);gap:12px;}
.empty-ico{font-size:44px;opacity:.5;}
.empty-txt{font-size:13px;text-align:center;line-height:1.5;}

/* ── EMOJI GRID ── */
.emoji-grid{display:flex;gap:6px;flex-wrap:wrap;margin-top:7px;}
.emo-btn{padding:7px 9px;border-radius:10px;font-size:20px;cursor:pointer;border:1.5px solid var(--bdr);background:var(--sur2);transition:var(--tr);}
.emo-btn:active{transform:scale(.9);}
.emo-btn.sel{border-color:var(--p500);background:rgba(139,92,246,.18);}

/* ── NOTIF ── */
.nstack{position:fixed;top:16px;left:50%;transform:translateX(-50%);z-index:999;display:flex;flex-direction:column;align-items:center;gap:8px;pointer-events:none;width:calc(100% - 32px);max-width:360px;}
.ntf{background:rgba(35,27,58,.96);border:1px solid var(--bdr2);border-radius:50px;padding:11px 20px;font-size:13px;font-weight:600;box-shadow:0 8px 28px rgba(0,0,0,.45);animation:ntfIn .3s ease;display:flex;align-items:center;gap:9px;backdrop-filter:blur(12px);}
.ntf-ok{border-color:rgba(52,211,153,.4);}
.ntf-er{border-color:rgba(248,113,113,.4);}

.sp2{width:16px;height:16px;border:2.5px solid rgba(255,255,255,.25);border-top-color:#fff;border-radius:50%;animation:spin .65s linear infinite;display:inline-block;}
.divider{height:1px;background:var(--bdr);margin:12px 0;}
`;

// ── ICONS (emoji-based, liviano) ───────────────────────────────────────────
const Ico = {
  pos:   "🛍️",
  stats: "📊",
  inv:   "📦",
  me:    "🌸",
  src:   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" viewBox="0 0 24 24"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  del:   <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/></svg>,
  edi:   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  chk:   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="20 6 9 17 4 12"/></svg>,
  plus:  <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" viewBox="0 0 24 24"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>,
  prt:   <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="6 9 6 2 18 2 18 9"/><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>,
  chev:  <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><polyline points="9 18 15 12 9 6"/></svg>,
  out:   <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>,
};

function useNotifs() {
  const [ns, setNs] = useState([]);
  const push = (msg, type = "ok") => {
    const id = Date.now();
    setNs(p => [...p, { id, msg, type }]);
    setTimeout(() => setNs(p => p.filter(n => n.id !== id)), 2800);
  };
  return { ns, push };
}

// ═══════════════════════════════════════════════════════════════════════════
export default function ExpoPOS() {
  const [user,      setUser]      = useState(null);
  const [authListo, setAuthListo] = useState(false);
  const [view,      setView]      = useState("pos");
  const [prods,     setProds]     = useState([]);
  const [sales,     setSales]     = useState([]);
  const [cart,      setCart]      = useState([]);
  const [cat,       setCat]       = useState("Todos");
  const [srch,      setSrch]      = useState("");
  const [invSrch,   setInvSrch]   = useState("");
  const [pay,       setPay]       = useState("Efectivo");
  const [cartOpen,  setCartOpen]  = useState(false);
  const [receipt,   setReceipt]   = useState(null);
  const [addProd,   setAddProd]   = useState(false);
  const [editProd,  setEditProd]  = useState(null);
  const [users,     setUsers]     = useState([]);
  const { ns, push } = useNotifs();

  const cats  = ["Todos",...new Set(prods.map(p => p.category))];
  const fp    = prods.filter(p => (cat === "Todos" || p.category === cat) && (p.name.toLowerCase().includes(srch.toLowerCase()) || p.category.toLowerCase().includes(srch.toLowerCase())));
  const fi    = prods.filter(p => p.name.toLowerCase().includes(invSrch.toLowerCase()) || p.category.toLowerCase().includes(invSrch.toLowerCase()));
  const sub   = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const tot   = sub;
  const cartN = cart.reduce((s, i) => s + i.qty, 0);
  const low   = prods.filter(p => p.stock > 0 && p.stock <= p.minStock).length;
  const todS  = sales.filter(s => s.date === new Date().toISOString().slice(0,10));
  const todT  = todS.reduce((s, v) => s + v.total, 0);
  const isAdm = user?.role === "admin";

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        try {
          const snap = await getDoc(doc(db, "usuarios", firebaseUser.uid));
          if (snap.exists()) {
            setUser({ uid: firebaseUser.uid, email: firebaseUser.email, ...snap.data() });
          }
        } catch (e) {
          console.error("Error cargando perfil:", e);
        }
      } else {
        setUser(null);
      }
      setAuthListo(true);
    });
    return unsub;
  }, []);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "usuarios"), (snap) => {
      setUsers(snap.docs.map(d => ({ uid: d.id, ...d.data() })));
    });
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const unsub = onSnapshot(collection(db, "productos"), (snap) => {
      setProds(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error productos:", err));
    return unsub;
  }, [user]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, "ventas"), orderBy("createdAt", "desc"));
    const unsub = onSnapshot(q, (snap) => {
      setSales(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    }, (err) => console.error("Error ventas:", err));
    return unsub;
  }, [user]);

  const doLogin = async (email, pass) => {
    try {
      const cred = await signInWithEmailAndPassword(auth, email, pass);
      const snap = await getDoc(doc(db, "usuarios", cred.user.uid));
      if (snap.exists()) {
        setUser({ uid: cred.user.uid, email: cred.user.email, ...snap.data() });
        push(`¡Hola, ${snap.data().name}! 🎀`);
        return true;
      }
      return false;
    } catch (e) {
      return false;
    }
  };
  //esto trate de hacerlo con mucho amor mi vida hermosa

  const handleLogout = async () => {
    await signOut(auth);
    setUser(null);
    setCart([]);
    setView("pos");
  };

  const addToCart = (p) => {
    if (p.stock <= 0) return;
    setCart(prev => {
      const ex = prev.find(i => i.id === p.id);
      if (ex) {
        if (ex.qty >= p.stock) { push("¡Sin stock disponible! 😅", "er"); return prev; }
        return prev.map(i => i.id === p.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { ...p, qty: 1 }];
    });
  };
  const chgQty  = (id, d) => setCart(p => p.map(i => i.id === id ? { ...i, qty: Math.max(1, i.qty + d) } : i).filter(i => i.qty > 0));
  const remItem = (id)    => setCart(p => p.filter(i => i.id !== id));

  const checkout = async () => {
    if (!cart.length) return;
    try {
      const batch = writeBatch(db);
      const saleRef = doc(collection(db, "ventas"));
      batch.set(saleRef, {
        date: new Date().toISOString().slice(0,10), vendor: user.name, total: tot,
        items: cart.length, method: pay,
        snap: cart.map(i => ({ id: i.id, name: i.name, price: i.price, qty: i.qty, category: i.category, img: i.img })),
        createdAt: serverTimestamp()
      });
      cart.forEach(item => batch.update(doc(db, "productos", item.id), { stock: Math.max(0, item.stock - item.qty) }));
      await batch.commit();
      setCartOpen(false); setReceipt({ id: saleRef.id, date: new Date().toISOString().slice(0,10), vendor: user.name, total: tot, items: cart.length, method: pay, snap: [...cart] }); setCart([]);
      push(`¡Venta ${saleRef.id} lista! ✨`);
    } catch (e) { push("Error al cobrar 😅", "er"); }
  };

  const saveProd = async (p) => {
    try {
      if (p.id) {
        await updateDoc(doc(db, "productos", p.id), { name: p.name, category: p.category, price: Number(p.price), stock: Number(p.stock), minStock: Number(p.minStock), img: p.img });
        push("Producto actualizado ✓");
      } else {
        await addDoc(collection(db, "productos"), { name: p.name, category: p.category, price: Number(p.price), stock: Number(p.stock), minStock: Number(p.minStock), img: p.img, vendor: user.name, createdAt: serverTimestamp() });
        push("¡Producto agregado! 🎉");
      }
    } catch (e) { push("Error 😅", "er"); }
    setEditProd(null); setAddProd(false);
  };
  const delProd = async (id) => {
    try { await deleteDoc(doc(db, "productos", id)); push("Eliminado", "er"); }
    catch (e) { push("Error 😅", "er"); }
  };
  const handleStockUpdate = (id, val) => {
    const num = Number(val);
    setProds(p => p.map(x => x.id === id ? { ...x, stock: num } : x));
    updateDoc(doc(db, "productos", id), { stock: num }).catch(() => push("Error al guardar stock 😅", "er"));
  };

  if (!authListo) return <div style={{height:"100vh",display:"flex",alignItems:"center",justifyContent:"center",background:"var(--bg)",color:"var(--tx3)",fontSize:14}}>Cargando...</div>;
  if (!user) return <Login onLogin={doLogin} />;

  const TABS = [
    { id:"pos",   label:"Vender",     ico: Ico.pos  },
    ...(isAdm ? [
      { id:"stats", label:"Stats",      ico: Ico.stats },
      { id:"inv",   label:"Stock",      ico: Ico.inv, badge: low > 0 },
    ] : []),
    { id:"me",    label:"Yo",         ico: Ico.me   },
  ];

  return (
    <>
      <style>{CSS}</style>

      {/* NOTIFS */}
      <div className="nstack">
        {ns.map(n => <div key={n.id} className={`ntf ntf-${n.type}`}>{n.type==="ok"?"✅":"❌"} {n.msg}</div>)}
      </div>

      <div className="app">
        {/* TOPBAR */}
        <div className="topbar">
          <div className="topbar-brand">
            <div className="topbar-logo">🦕</div>
            <div>
              <div className="topbar-name"> Empresaurios</div>
              <div className="topbar-sub">Stand · {user.name}</div>
            </div>
          </div>
          {view === "inv" && isAdm && (
            <button className="btn bp bsm" style={{borderRadius:"50px",padding:"9px 16px"}} onClick={() => setAddProd(true)}>
              {Ico.plus} Nuevo
            </button>
          )}
          <div className="topbar-time">{new Date().toLocaleTimeString("es-MX",{hour:"2-digit",minute:"2-digit"})}</div>
        </div>

        {/* SCREEN */}
        <div className="screen">
          {view === "pos"   && <POSView fp={fp} cats={cats} cat={cat} setCat={setCat} srch={srch} setSrch={setSrch} cart={cart} cartN={cartN} addToCart={addToCart} tot={tot} onOpenCart={()=>setCartOpen(true)} />}
          {view === "stats" && <StatsView prods={prods} todT={todT} todS={todS} low={low} sales={sales} />}
          {view === "inv"   && <InvView fi={fi} invSrch={invSrch} setInvSrch={setInvSrch} onEdit={setEditProd} onDel={delProd} isAdm={isAdm} onStk={handleStockUpdate} />}
          {view === "me"    && <MeView user={user} isAdm={isAdm} sales={sales} users={users} onLogout={handleLogout} />}
        </div>

        {/* BOTTOM NAV */}
        <nav className="botnav">
          {TABS.map(t => (
            <button key={t.id} className={`bni${view===t.id?" act":""}`} onClick={()=>setView(t.id)}>
              <span className="ni-ico">{t.ico}</span>
              {t.label}
              {t.badge && <span className="ni-dot"/>}
            </button>
          ))}
        </nav>
      </div>

      {/* CART SHEET */}
      {cartOpen && (
        <div className="sheet-overlay" onClick={()=>setCartOpen(false)}>
          <div className="sheet" onClick={e=>e.stopPropagation()}>
            <div className="sheet-handle"/>
            <div className="sheet-hdr">
              <span className="sheet-title">🛒 Tu pedido {cartN>0&&<span style={{fontSize:13,fontWeight:700,background:"var(--p600)",color:"#fff",borderRadius:"99px",padding:"2px 8px"}}>{cartN}</span>}</span>
              <button className="sheet-close" onClick={()=>setCartOpen(false)}>✕</button>
            </div>
            <div className="sheet-body">
              {cart.length===0
                ? <div className="empty"><div className="empty-ico">🛒</div><div className="empty-txt">Agrega productos desde el catálogo</div></div>
                : cart.map(it=>(
                  <div key={it.id} className="citem">
                    <div className="c-emi">{it.img}</div>
                    <div className="c-info">
                      <div className="c-nm">{it.name}</div>
                      <div className="c-pr">{fmt(it.price)} c/u · Total {fmt(it.price*it.qty)}</div>
                    </div>
                    <div className="cqty">
                      <button className="qb" onClick={()=>chgQty(it.id,-1)}>−</button>
                      <span className="qn">{it.qty}</span>
                      <button className="qb" onClick={()=>chgQty(it.id,1)}>+</button>
                    </div>
                    <button className="rb" onClick={()=>remItem(it.id)}>{Ico.del}</button>
                  </div>
                ))
              }
            </div>
            <div className="sheet-foot">
              <div className="totals">
                <div className="trow grand"><span>Total</span><span className="tval" style={{color:"var(--p300)"}}>{fmt(tot)}</span></div>
              </div>
              <div className="pay-grid">
                {["Efectivo","Tarjeta","Transferencia"].map(m=>(
                  <button key={m} className={`pchip${pay===m?" sel":""}`} onClick={()=>setPay(m)}>{m}</button>
                ))}
              </div>
              <button className="cobrar" onClick={checkout} disabled={!cart.length}>
                {cart.length ? `💜 Cobrar ${fmt(tot)}` : "Agrega productos"}
              </button>
            </div>
          </div>
        </div>
      )}
      //te amo mamior

      {receipt  && <ReceiptModal sale={receipt} onClose={()=>setReceipt(null)} />}
      {addProd  && <ProdModal onSave={saveProd} onClose={()=>setAddProd(false)} />}
      {editProd && <ProdModal prod={editProd} onSave={saveProd} onClose={()=>setEditProd(null)} />}
    </>
  );
}

// ─── LOGIN ─────────────────────────────────────────────────────────────────
function Login({ onLogin }) {
  const [em,setEm]=useState(""); const [pw,setPw]=useState("");
  const [err,setErr]=useState(""); const [ld,setLd]=useState(false);
  const go = async () => {
    setErr(""); setLd(true);
    const ok = await onLogin(em, pw);
    if (!ok) setErr("Correo o contraseña incorrectos 🙈");
    setLd(false);
  };
  return (
    <>
      <style>{CSS}</style>
      <div className="login-wrap">
        <div className="orb o1"/><div className="orb o2"/><div className="orb o3"/>
        <div className="login-card pi">
          <div className="brand"><div className="brand-ico">🦕</div><span className="brand-name">Empresaurios</span></div>
          <div className="brand-tag"></div>
          <h1 className="login-h1"></h1>
          <p className="login-sub">Inicia sesión para empezar a vender</p>
          {err && <div className="ale ale-e">{err}</div>}
          <div className="fld"><label>Correo</label>
            <input className="fi" type="email" value={em} onChange={e=>setEm(e.target.value)} placeholder="tu@correo.com" onKeyDown={e=>e.key==="Enter"&&go()}/>
          </div>
          <div className="fld"><label>Contraseña</label>
            <input className="fi" type="password" value={pw} onChange={e=>setPw(e.target.value)} placeholder="••••••••" onKeyDown={e=>e.key==="Enter"&&go()}/>
          </div>
          <button className="btn bp bfull" onClick={go} disabled={ld}>
            {ld ? <span className="sp2"/> : "Entrar a Darle "}
          </button>
        </div>
      </div>
    </>
  );
}

// ─── POS VIEW ──────────────────────────────────────────────────────────────
function POSView({ fp, cats, cat, setCat, srch, setSrch, cart, cartN, addToCart, tot, onOpenCart }) {
  return (
    <div className="pos-wrap">
      <div className="pos-sticky">
        <div className="sbar">
          {Ico.src}
          <input value={srch} onChange={e=>setSrch(e.target.value)} placeholder="Buscar sticker, amigurumi…"/>
          {srch && <button onClick={()=>setSrch("")} style={{background:"none",border:"none",color:"var(--tx3)",cursor:"pointer",fontSize:20,lineHeight:1}}>×</button>}
        </div>
        <div className="cats">
          {cats.map(c=><button key={c} className={`cat-chip${cat===c?" act":""}`} onClick={()=>setCat(c)}>{c}</button>)}
        </div>
      </div>

      <div className="pos-products">
        {fp.length === 0
          ? <div className="empty"><div className="empty-ico">🔍</div><div className="empty-txt">No encontramos ese producto</div></div>
          : <div className="pgrid">
              {fp.map((p,i)=>(
                <div key={p.id} className={`pcard fu${p.stock===0?" os":""}${p.stock<=p.minStock&&p.stock>0?" hot":""}`} style={{animationDelay:`${i*.025}s`}} onClick={()=>addToCart(p)}>
                  {p.stock>0 && p.stock<=p.minStock && <span className="p-low"/>}
                  <span className="p-emi">{p.img}</span>
                  <div className="p-nm">{p.name}</div>
                  <div className="p-pr">{fmt(p.price)}</div>
                  <div className="p-stk">{p.stock===0?"Agotado 😢":`${p.stock} uds`}</div>
                  <div className="p-vdr">{p.category}</div>
                </div>
              ))}
            </div>
        }
      </div>

      {cartN > 0 && (
        <div className="cart-bar" onClick={onOpenCart}>
          <div className="cart-count">{cartN}</div>
          <div style={{flex:1}}>
            <div className="cart-label">Ver pedido</div>
            <div className="cart-items-txt">{cartN} {cartN===1?"producto":"productos"} seleccionados</div>
          </div>
          <div className="cart-total">{fmt(tot)}</div>
          <span className="cart-arrow">{Ico.chev}</span>
        </div>
      )}
    </div>
  );
}

// ─── STATS VIEW ────────────────────────────────────────────────────────────
function StatsView({ prods, todT, todS, low, sales }) {
  const week=[{d:"Lun",v:0},{d:"Mar",v:0},{d:"Mié",v:0},{d:"Jue",v:0},{d:"Vie",v:0},{d:"Sáb",v:0},{d:"Hoy",v:todT}];
  const mx=Math.max(...week.map(w=>w.v),1);
  const vendorTotals = {};
  const catTotals = {};
  sales.forEach(s=>(s.snap||[]).forEach(i=>{
    vendorTotals[i.vendor]=(vendorTotals[i.vendor]||0)+i.price*i.qty;
    catTotals[i.category]=(catTotals[i.category]||0)+i.price*i.qty;
  }));
  const topVendors=Object.entries(vendorTotals).sort((a,b)=>b[1]-a[1]).slice(0,4);
  const topCats=Object.entries(catTotals).sort((a,b)=>b[1]-a[1]);
  const vendorAvatar={"Administradora":"✨","Vale":"🎀","Sofi":"🌸"};
  const catEmoji={"SCAR":"🦝","MINI":"🦊","DORY":"🐠","XIME":"🐒"};
  //mini mi amor e mia

  const exportHTML = () => {
    const rows = sales.map(s => `
      <tr>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-weight:700;color:#1e293b">${s.id}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569">${s.date}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;color:#475569">${s.vendor}</td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0"><span style="background:${s.method==='Transferencia'?'#dbeafe':'#fef3c7'};color:${s.method==='Transferencia'?'#1d4ed8':'#92400e'};padding:3px 10px;border-radius:99px;font-size:11px;font-weight:700">${s.method}</span></td>
        <td style="padding:10px 12px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-weight:700;color:#059669;text-align:right">$${s.total.toLocaleString('es-MX')}</td>
      </tr>
      <tr style="background:#f8fafc">
        <td colspan="5" style="padding:4px 12px 10px;border-bottom:2px solid #e2e8f0;font-size:13px;color:#64748b">
          ${(s.snap||[]).map(it => `· ${it.qty}x ${it.name} <span style="background:#e0e7ff;color:#4338ca;padding:1px 8px;border-radius:99px;font-size:10px">${it.category}</span> — $${(it.price*it.qty).toLocaleString('es-MX')}`).join('<br>')}
        </td>
      </tr>
    `).join('');

    const catRows = topCats.map(([c,v]) => `
      <tr>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-weight:600">${catEmoji[c]||'📁'} ${c}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;font-family:monospace;font-weight:700;color:#059669;text-align:right">$${v.toLocaleString('es-MX')}</td>
        <td style="padding:8px 12px;border-bottom:1px solid #e2e8f0;color:#64748b;text-align:right">${((v/sales.reduce((a,s)=>a+s.total,0))*100).toFixed(1)}%</td>
      </tr>
    `).join('');

    const html = `<!DOCTYPE html>
<html lang="es">
<head><meta charset="UTF-8"><title>Reporte Empresaurios</title>
<style>
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;700;800&display=swap');
  *{margin:0;padding:0;box-sizing:border-box}
  body{font-family:'Inter',sans-serif;background:#f1f5f9;padding:30px;color:#0f172a}
  .container{max-width:900px;margin:0 auto}
  h1{font-size:28px;font-weight:800;margin-bottom:4px}
  .sub{color:#64748b;margin-bottom:24px;font-size:14px}
  .card{background:#fff;border-radius:16px;box-shadow:0 1px 3px rgba(0,0,0,.08);padding:24px;margin-bottom:20px}
  h2{font-size:18px;font-weight:700;margin-bottom:14px;display:flex;align-items:center;gap:8px}
  table{width:100%;border-collapse:collapse}
  th{text-align:left;padding:10px 12px;font-size:11px;text-transform:uppercase;letter-spacing:.5px;color:#64748b;border-bottom:2px solid #e2e8f0}
  .tot{display:flex;justify-content:space-between;padding:12px 0 0;margin-top:8px;border-top:2px solid #1e293b;font-size:18px;font-weight:800}
  .footer{text-align:center;color:#94a3b8;font-size:13px;margin-top:30px;padding-top:16px;border-top:1px solid #e2e8f0}
</style>
</head>
<body>
<div class="container">
  <h1>🦕 Empresaurios</h1>
  <div class="sub">Reporte de ventas · ${new Date().toLocaleDateString('es-MX',{dateStyle:'long'})} · ${sales.length} pedidos · Total $${sales.reduce((a,s)=>a+s.total,0).toLocaleString('es-MX')}</div>

  <div class="card">
    <h2>📋 Todas las ventas</h2>
    <table>
      <thead><tr><th>Folio</th><th>Fecha</th><th>Vendedor</th><th>Método</th><th style="text-align:right">Total</th></tr></thead>
      <tbody>${rows}</tbody>
    </table>
    <div class="tot"><span>TOTAL GENERAL</span><span>$${sales.reduce((a,s)=>a+s.total,0).toLocaleString('es-MX')}</span></div>
  </div>

  <div class="card">
    <h2>📊 Resumen por categoría</h2>
    <table>
      <thead><tr><th>Categoría</th><th style="text-align:right">Total</th><th style="text-align:right">%</th></tr></thead>
      <tbody>${catRows||'<tr><td colspan="3" style="text-align:center;padding:20px;color:#94a3b8">Sin ventas</td></tr>'}</tbody>
    </table>
  </div>

  <div class="card">
    <h2>💳 Métodos de pago</h2>
    ${['Efectivo','Tarjeta','Transferencia'].map(m => {
      const total = sales.filter(s=>s.method===m).reduce((a,s)=>a+s.total,0);
      const count = sales.filter(s=>s.method===m).length;
      const pct = sales.length ? ((total/sales.reduce((a,s)=>a+s.total,0))*100).toFixed(1) : 0;
      return total ? `<div style="display:flex;justify-content:space-between;padding:8px 0;border-bottom:1px solid #f1f5f9"><span style="font-weight:600">${m}</span><span><span style="font-family:monospace;font-weight:700;color:#059669">$${total.toLocaleString('es-MX')}</span> <span style="color:#94a3b8;font-size:13px">(${count} pedidos · ${pct}%)</span></span></div>` : '';
    }).join('')}
  </div>

  <div class="footer">🦕 Empresaurios · Reporte generado el ${new Date().toLocaleString('es-MX')}</div>
</div>
</body>
</html>`;

    const blob = new Blob([html], {type:'text/html'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `reporte-empresaurios-${new Date().toISOString().slice(0,10)}.html`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="scrollable fu">
      <div style={{display:'flex',gap:10,alignItems:'center',marginBottom:14}}>
        <button className="btn bp bsm" onClick={exportHTML} style={{borderRadius:'50px',padding:'9px 18px'}}>
          {Ico.prt} Exportar HTML
        </button>
      </div>
      <div className="sg">
        <div className="stat-card" style={{"--grad":"rgba(139,92,246,.15)"}}>
          <div className="stat-ico">💜</div><div className="stat-lbl">Ventas hoy</div>
          <div className="stat-val" style={{color:"var(--p300)"}}>{fmt(todT)}</div>
          <div className="stat-sub">{todS.length} pedidos</div>
        </div>
        <div className="stat-card" style={{"--grad":"rgba(244,114,182,.12)"}}>
          <div className="stat-ico">📦</div><div className="stat-lbl">Productos</div>
          <div className="stat-val" style={{color:"var(--pink)"}}>{prods.length}</div>
          <div className="stat-sub">{low} por reponer</div>
        </div>
        <div className="stat-card">
          <div className="stat-ico">⚠️</div><div className="stat-lbl">Stock bajo</div>
          <div className="stat-val" style={{color:"var(--warn)"}}>{low}</div>
          <div className="stat-sub">Revisar</div>
        </div>
        <div className="stat-card">
          <div className="stat-ico">📈</div><div className="stat-lbl">Esta semana</div>
          <div className="stat-val" style={{color:"var(--ok)",fontSize:18}}>{fmt(week.reduce((s,d)=>s+d.v,0))}</div>
          <div className="stat-sub">Total</div>
        </div>
      </div>

      <div className="chart-wrap">
        <div className="chart-title">📊 Ventas de la semana</div>
        <div className="bars">
          {week.map((d,i)=>(
            <div key={i} className="bar-col">
              <span className="bar-val">{d.v>=1000?(d.v/1000).toFixed(1)+"k":d.v}</span>
              <div className={`bar${d.d==="Hoy"?" today":""}`} style={{height:`${(d.v/mx)*76}px`,opacity:d.d==="Hoy"?1:.62}}/>
              <span className="bar-lbl">{d.d}</span>
            </div>
          ))}
        </div>
      </div>

      <div className="tcard">
        <div className="tcard-head">🏆 Ventas por vendedor</div>
        {topVendors.length>0 ? topVendors.map(([vendor,val],i)=>(
          <div key={i} className="list-item">
            <div className="li-ico">{vendorAvatar[vendor]||"🌸"}</div>
            <div className="li-info"><div className="li-name">{vendor}</div></div>
            <div className="li-right"><div className="li-val">{fmt(val)}</div></div>
          </div>
        )) : (
          <div className="empty" style={{padding:"24px"}}><div className="empty-txt">Aún no hay ventas registradas 🌟</div></div>
        )}
      </div>

      <div className="tcard">
        <div className="tcard-head">📋 Reporte por categoría</div>
        {topCats.length>0 ? topCats.map(([cat,val],i)=>(
          <div key={i} className="list-item">
            <div className="li-ico">{catEmoji[cat]||"📁"}</div>
            <div className="li-info"><div className="li-name">{cat}</div></div>
            <div className="li-right"><div className="li-val">{fmt(val)}</div><div className="li-meta">{((val/sales.reduce((s,v)=>s+v.total,0))*100).toFixed(1)}%</div></div>
          </div>
        )) : (
          <div className="empty" style={{padding:"24px"}}><div className="empty-txt">Aún no hay ventas registradas 🌟</div></div>
        )}
      </div>

      <div className="tcard">
        <div className="tcard-head">🧾 Pedidos de hoy</div>
        {todS.length===0
          ? <div className="empty" style={{padding:"24px"}}><div className="empty-txt">Aún sin ventas hoy 🌟</div></div>
          : todS.map(s=>(
            <div key={s.id} className="list-item">
              <div className="li-ico">🧾</div>
              <div className="li-info">
                <div className="li-name">{s.vendor}</div>
                <div className="li-sub"><span className="sale-bdg">{s.method}</span> · {s.items} items</div>
              </div>
              <div className="li-right"><div className="li-val">{fmt(s.total)}</div><div className="li-meta">{s.id}</div></div>
            </div>
          ))
        }
      </div>
    </div>
  );
}

// ─── INVENTORY VIEW ────────────────────────────────────────────────────────
function InvView({ fi, invSrch, setInvSrch, onEdit, onDel, isAdm, onStk }) {
  return (
    <div className="scrollable fu">
      <div className="sbar" style={{marginBottom:14}}>
        {Ico.src}
        <input value={invSrch} onChange={e=>setInvSrch(e.target.value)} placeholder="Buscar en inventario…"/>
        {invSrch && <button onClick={()=>setInvSrch("")} style={{background:"none",border:"none",color:"var(--tx3)",cursor:"pointer",fontSize:20}}>×</button>}
      </div>
      <div className="tcard">
        {fi.length === 0
          ? <div className="empty" style={{padding:"24px"}}><div className="empty-txt">No hay productos aún. Ve a vender y agrega productos nuevos.</div></div>
          : fi.map(p=>{
          const st=p.stock===0?"out":p.stock<=p.minStock?"low":"ok";
          return (
            <div key={p.id} className="list-item" style={{borderLeft:`3px solid ${st==="ok"?"transparent":st==="low"?"var(--warn)":"var(--err)"}`}}>
              <div className="li-ico">{p.img}</div>
              <div className="li-info">
                <div className="li-name">{p.name}</div>
                <div className="li-sub">
                  <span className={`spill ${st==="ok"?"sok":st==="low"?"slow":"sout"}`}>{st==="ok"?"OK":st==="low"?"Poco":"Agotado"}</span>
                  <span>{p.category}</span>
                  <span>· {p.vendor}</span>
                </div>
              </div>
              <div className="li-right">
                <div className="li-val">{fmt(p.price)}</div>
                {isAdm
                  ? <><input className="stk-inp" type="number" value={p.stock} min={0} onChange={e=>onStk(p.id,e.target.value)} style={{marginTop:5}}/>
                    <div className="inv-actions">
                      <button className="btn bg_ bsm" style={{padding:"5px 8px"}} onClick={()=>onEdit(p)}>{Ico.edi}</button>
                      <button className="btn bdn bsm" style={{padding:"5px 8px"}} onClick={()=>onDel(p.id)}>{Ico.del}</button>
                    </div></>
                  : <div className="li-meta" style={{marginTop:4}}>{p.stock} uds</div>
                }
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ─── ME VIEW ───────────────────────────────────────────────────────────────
function MeView({ user, isAdm, sales, users, onLogout }) {
  const mySales = sales.filter(s=>s.vendor===user.name);
  const myTotal = mySales.reduce((s,v)=>s+v.total,0);
  return (
    <div className="scrollable fu">
      <div className="profile-hero">
        <div className="p-av">{user.avatar}</div>
        <div className="p-name">{user.name}</div>
        <div className="p-email">{user.email}</div>
        <span className={`rbdg ${user.role==="admin"?"radm":"rvnd"}`}>
          {user.role==="admin"?"👑 Admin":"🎀 Vendedora"}
        </span>
      </div>

      <div className="sg" style={{marginBottom:16}}>
        <div className="stat-card"><div className="stat-ico">🧾</div><div className="stat-lbl">Mis ventas</div><div className="stat-val" style={{color:"var(--p300)"}}>{mySales.length}</div><div className="stat-sub">Total realizadas</div></div>
        <div className="stat-card"><div className="stat-ico">💜</div><div className="stat-lbl">Mis ingresos</div><div className="stat-val" style={{color:"var(--pink)",fontSize:18}}>{fmt(myTotal)}</div><div className="stat-sub">Acumulado</div></div>
      </div>

      {isAdm && (
        <div className="tcard" style={{marginBottom:14}}>
          <div className="tcard-head">🎀 Equipo del stand</div>
          {users.map((u,i)=>(
            <div key={u.uid} className="team-card" style={{margin:"8px 12px",borderRadius:"var(--rsm)"}}>
              <div className="t-av">{u.avatar||"🌸"}</div>
              <div>
                <div className="t-name">{u.name}</div>
                <div className="t-email">{u.email}</div>
                <span className={`rbdg ${u.role==="admin"?"radm":"rvnd"}`} style={{fontSize:9.5,padding:"2px 8px"}}>{u.role==="admin"?"👑 Admin":"🎀 Vendedora"}</span>
              </div>
            </div>
          ))}
        </div>
      )}

      <button className="btn bdn bfull" style={{borderRadius:"var(--r)",marginBottom:8}} onClick={onLogout}>
        {Ico.out} &nbsp;Cerrar sesión
      </button>
    </div>
  );
}

// ─── RECEIPT MODAL ─────────────────────────────────────────────────────────
function ReceiptModal({ sale, onClose }) {
  const now=new Date().toLocaleString("es-MX",{dateStyle:"short",timeStyle:"short"});
  const sub=(sale.snap||[]).reduce((s,i)=>s+i.price*i.qty,0);
  return (
    <div className="movl" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-h"/>
        <div className="modal-inner">
          <div className="modal-title">🧾 Comprobante · {sale.id}</div>
          <div className="rec">
            <div className="r-head">
              <div className="r-brand">🦕 Empresaurios</div>
              <div className="r-tag">Stickers · Amigurumis · Llaveros</div>
              <div className="r-date">{now} · {sale.vendor}</div>
            </div>
            {(sale.snap||[]).map((it,i)=><div key={i} className="r-item"><span>{it.qty}× {it.name}</span><span>{fmt(it.price*it.qty)}</span></div>)}
            <hr className="r-div"/>
            <div className="r-tot"><span>TOTAL</span><span>{fmt(sale.total)}</span></div>
            <div className="r-foot">Método: {sale.method}<br/>¡Gracias por tu compra! 💜✨<br/>Síguenos en redes 🌟</div>
          </div>
          <div className="modal-act">
            <button className="btn bg_" onClick={onClose}>Cerrar</button>
            <button className="btn bp" onClick={()=>{window.print();onClose();}}>{Ico.prt} Imprimir</button>
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PRODUCT MODAL ─────────────────────────────────────────────────────────
function ProdModal({ prod, onSave, onClose }) {
  const [f,setF]=useState(prod||{name:"",category:"SCAR",price:"",stock:"",minStock:"",img:"🌟"});
  const s=(k,v)=>setF(p=>({...p,[k]:v}));
  const emojis=["🌟","✨","🐱","💬","🧸","🐰","🐸","🦎","🔑","🪡","🌸","🎮","🦋","🌙","🌈","🎨","💌","🎁","🛍️","💜","🩷","⭐","🎀","🍄","🌺","🪄"];
  return (
    <div className="movl" onClick={onClose}>
      <div className="modal" onClick={e=>e.stopPropagation()}>
        <div className="modal-h"/>
        <div className="modal-inner">
          <div className="modal-title">{prod?"✏️ Editar":"✨ Nuevo"} Producto</div>
          <div className="fld"><label>Ícono</label>
            <div className="emoji-grid">{emojis.map(e=><button key={e} className={`emo-btn${f.img===e?" sel":""}`} onClick={()=>s("img",e)}>{e}</button>)}</div>
          </div>
          <div className="fld"><label>Nombre del producto</label><input className="fi" value={f.name} onChange={e=>s("name",e.target.value)} placeholder="Ej. Sticker Kawaii Pack x10"/></div>
          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:11}}>
            <div className="fld"><label>Categoría</label>
              <select className="fi" value={f.category} onChange={e=>s("category",e.target.value)}>
                {["SCAR","MINI","DORY","XIME"].map(c=><option key={c}>{c}</option>)}
                //aqui esta mi flaquita nuevamente
              </select>
            </div>
            <div className="fld"><label>Precio ($)</label><input className="fi" type="number" value={f.price} onChange={e=>s("price",e.target.value)} placeholder="0"/></div>
            <div className="fld"><label>Stock</label><input className="fi" type="number" value={f.stock} onChange={e=>s("stock",e.target.value)} placeholder="0"/></div>
            <div className="fld"><label>Stock mín.</label><input className="fi" type="number" value={f.minStock} onChange={e=>s("minStock",e.target.value)} placeholder="5"/></div>
          </div>
          <div className="modal-act">
            <button className="btn bg_" onClick={onClose}>Cancelar</button>
            <button className="btn bp" onClick={()=>onSave({...f,price:Number(f.price),stock:Number(f.stock),minStock:Number(f.minStock)})}>{Ico.chk} Guardar</button>
          </div>
        </div>
      </div>
    </div>
  );
}
//se que tal vez no son cartas pero igual no los veras hasta que te quieras meter en codigos