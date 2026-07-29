/* _checkui: KIEM THU THAT TREN TRINH DUYET.
   Ly do co bo kiem nay: ca 1930 tieu chi con lai deu kiem CHUOI HTML - khong co trinh duyet nao
   chay. Chuoi dung tuyet doi ma man hinh van vo: HTML hop le, CSS moi la thu be no. Chinh no bat
   duoc loi .notebar bi flex be vun cau van thanh nhieu cot (V9.31) - loi ton tai rat lau ma khong
   bo kiem nao thay, vi HTML khong sai mot dau nao.

   Kiem 6 dieu MAT NGUOI NHIN THAY ma chuoi khong noi duoc:
    1. trang cuon ngang (luat du an: khong bao gio duoc phep)
    2. chu bi cat AM THAM (overflow hidden ma khong co dau ...)
    3. phan tu tho ra ngoai khung nhin
    4. nut/o nhap qua nho de bam (<24px) - tru o tich/nut tron la control goc cua trinh duyet
    5. hai thanh noi che nhau (toast / thanh Hoan tac / bong bong)
    6. loi JS, va tai nguyen NGOAI MANG - demo phai chay duoc khi khong co mang

   Chay: npm i playwright (mot lan) roi  ITTS_OUT=<out> node _checkui.js
   Can trinh duyet Chromium; may nao khong co thi bo kiem tu bao BO QUA chu khong bao do bay. */
const PATHS = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
               "/opt/pw-browsers/chromium/chrome-linux/chrome"];
const OUT = process.env.ITTS_OUT || ".";
const VIEWS = [{n:"dienthoai",w:390,h:844},{n:"maytinhbang",w:834,h:1112},{n:"maytinh",w:1440,h:900}];
/* Tai nguyen ngoai duoc PHEP that bai: tinh nang Room la P2P nhieu may, ban chat phai co mang.
   App da xu ly dung (im lang, luot sau thu lai). Moi URL ngoai KHAC deu la loi. */
const NGOAI_OK = [/peerjs/];

const PROBE = () => {
  const out = {wide:0, clip:[], over:[], tiny:[], cover:[], vun:[]};
  const W = window.innerWidth;
  out.wide = Math.max(0, document.documentElement.scrollWidth - W);
  const dr = document.querySelector(".drawer");
  /* ngan keo dong thi no nam ngoai man theo THIET KE - do no la bao nham */
  const scope = (dr && dr.classList.contains("on")) ? "#content *, .drawer *, #hvBody *" : "#content *, #hvBody *";
  const seen = new Set();
  for (const el of document.querySelectorAll(scope)) {
    const cs = getComputedStyle(el);
    if (cs.display === "none" || cs.visibility === "hidden") continue;
    const r = el.getBoundingClientRect();
    if (!r.width && !r.height) continue;
    const tag = el.tagName.toLowerCase();
    const cls = (el.className || "").toString().slice(0, 40);
    const txt = (el.textContent || "").trim().slice(0, 44);
    const key = tag + "." + cls + "|" + txt;

    const coChu = [...el.childNodes].some(n => n.nodeType === 3 && n.textContent.trim());
    /* text-overflow:ellipsis = co y cat VA co dau ... bao cho nguoi doc biet -> khong tinh la loi */
    if (coChu && cs.textOverflow !== "ellipsis" && /hidden|clip/.test(cs.overflowX) &&
        el.clientWidth > 0 && el.scrollWidth > el.clientWidth + 2 && !seen.has("c"+key)) {
      seen.add("c"+key); out.clip.push({tag, cls, txt, thua: el.scrollWidth - el.clientWidth});
    }
    if (r.right > W + 1 && r.width > 4) {
      let p = el.parentElement, trongOCuon = false;
      while (p && p !== document.body) {
        if (/auto|scroll/.test(getComputedStyle(p).overflowX)) { trongOCuon = true; break; }
        p = p.parentElement;
      }
      if (!trongOCuon && !seen.has("o"+key)) { seen.add("o"+key); out.over.push({tag, cls, txt, thua: Math.round(r.right - W)}); }
    }
    /* Chi tinh NUT DUNG RIENG. Link chu trong cau cao 15px la binh thuong - bat no la bao nham
       hang loat. O tich / nut tron cung bo qua: do la control goc cua trinh duyet, ep to len 24px
       thi trong khong giong o tich nua. */
    const laNut = tag === "button" || tag === "select" ||
      (tag === "input" && !/^(checkbox|radio)$/.test(el.type)) ||
      /\b(btn|pill|tbtn|stab|chipbtn)\b/.test(cls) || el.getAttribute("role") === "button";
    if (laNut && r.width > 0 && r.height > 0 && (r.width < 24 || r.height < 24) && !seen.has("t"+key)) {
      seen.add("t"+key); out.tiny.push({tag, cls, txt, w: Math.round(r.width), h: Math.round(r.height)});
    }
  }
  /* 7. CAU VAN BI FLEX BE VUN - dung loi da sinh ra bo kiem nay.
     Trong CSS, moi doan chu tran nam trong mot o display:flex se thanh MOT O RIENG (anonymous flex
     item), roi gap day cac o ra xa nhau. Cau van dut thanh nhieu cot ma HTML khong sai mot dau nao,
     khong tran, khong bi cat, khong nut nho - nen sau phep do tren deu khong thay.
     Dau hieu chac chan: o flex vua co CHU TRAN vua co the con ben trong. */
  for (const el of document.querySelectorAll("#content *, #hvBody *")) {
    const cs = getComputedStyle(el);
    if (!/flex/.test(cs.display)) continue;
    if (cs.flexDirection.indexOf("column") === 0) continue;   /* xep doc thi xuong dong, khong be vun */
    const chuTran = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
    /* MOT doan chu thi khong sao - do la kieu nut chuan cua app: <button><i icon></i>Nhan viec</button>,
       khe ho 6px giua icon va chu la CO Y. Chi khi co TU HAI doan chu tro len thi moi la cau van bi
       cat khuc: "...chuong reo theo" | [4 gio] | "." - do la loi that. */
    if (chuTran.length < 2) continue;
    if (!el.querySelector(":scope > *")) continue;             /* chi co chu, khong co the -> khong sao */
    const cls = (el.className || "").toString().slice(0, 40);
    const key = "f" + el.tagName + "." + cls;
    if (seen.has(key)) continue; seen.add(key);
    out.vun.push({tag: el.tagName.toLowerCase(), cls,
      txt: chuTran.map(n => n.textContent.trim()).join(" / ").slice(0, 60), n: chuTran.length});
  }
  const noi = [...document.querySelectorAll(".toast,.undobar,.bub,.bubwrap,.tour")]
    .filter(e => { const c = getComputedStyle(e); return c.display !== "none" && c.opacity !== "0"; })
    .map(e => ({n: e.className, r: e.getBoundingClientRect()}));
  for (let i = 0; i < noi.length; i++) for (let j = i+1; j < noi.length; j++) {
    const a = noi[i].r, b = noi[j].r;
    if (a.left < b.right && b.left < a.right && a.top < b.bottom && b.top < a.bottom)
      out.cover.push(noi[i].n + " x " + noi[j].n);
  }
  return out;
};

(async () => {
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch (e) { console.log("CHECKUI BO QUA: chua cai playwright (npm i playwright)"); process.exit(0); }
  const fs = require("fs");
  const exe = PATHS.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  let browser;
  try { browser = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("CHECKUI BO QUA: khong mo duoc Chromium (" + String(e.message).slice(0,80) + ")"); process.exit(0); }

  const bad = [], net = new Set();
  let luot = 0;
  const CONG = [
    {f: "ITTs_WebApp_v5_demo.html", who: "ITTS_WHO",    ten: "cong nhan vien"},
    {f: "ITTs_TrangHocVien_demo.html", who: "ITTS_WHO_HV", ten: "cong hoc vien"},
  ];
  for (const C of CONG) for (const V of VIEWS) {
    const ctx = await browser.newContext({viewport: {width: V.w, height: V.h}});
    const page = await ctx.newPage();
    const nhan = (t) => V.n + " · " + C.ten + " · " + t;
    page.on("pageerror", e => bad.push(nhan("LOI JS: " + String(e.message).slice(0,140))));
    page.on("requestfailed", r => { const u = r.url(); if (!NGOAI_OK.some(re => re.test(u))) net.add(u.slice(0,110)); });
    await page.addInitScript(w => { try { sessionStorage.setItem(w, ""); } catch (e) {} }, C.who);
    await page.goto("file://" + require("path").resolve(OUT) + "/" + C.f, {waitUntil: "load"});
    await page.waitForFunction(() => typeof window.go === "function" || typeof window.renderTrangHV === "function", null, {timeout: 30000});
    await page.waitForTimeout(400);

    /* Cong NV: moi trang la mot man -> di het RENDER + moi tab Cai dat.
       Cong HV: la MOT TRANG DAI cuon xuong, "man hinh" cua no khong phai muc menu ma la TUNG HO SO
       hoc vien - moi ho so mot bo du lieu khac nhau (co no / khong no, co lop / chua xep lop),
       do dung mot ho so la bo sot phan lon truong hop. */
    const mans = await page.evaluate(() => {
      if (window.HVPORTAL || !window.RENDER)
        return rows("DL09").map(s => "hv:" + s.student_id);
      return Object.keys(window.RENDER).concat(setTabs().map(t => "settings#" + t[0]));
    });
    for (const m of mans) {
      const ok = await page.evaluate(m => {
        try {
          if (m.indexOf("settings#") === 0) { window.SETTAB = m.slice(9); go("settings"); }
          else if (m.indexOf("hv:") === 0) { bootHV(m.slice(3)); }
          else go(m);
          return true;
        } catch (e) { return String(e.message); }
      }, m);
      if (ok !== true) { bad.push(nhan("mo " + m + " nem loi: " + ok)); continue; }
      await page.waitForTimeout(45);
      const p = await page.evaluate(PROBE); luot++;
      if (p.wide > 1) bad.push(nhan(m + ": TRANG CUON NGANG, thua " + p.wide + "px"));
      p.clip.forEach(c => bad.push(nhan(m + ": chu bi cat AM THAM " + c.thua + "px trong <" + c.tag + " class=\"" + c.cls + "\"> \"" + c.txt + "\"")));
      p.over.forEach(c => bad.push(nhan(m + ": <" + c.tag + " class=\"" + c.cls + "\"> tho ra ngoai man " + c.thua + "px")));
      p.tiny.forEach(c => bad.push(nhan(m + ": nut qua nho " + c.w + "x" + c.h + "px <" + c.tag + " class=\"" + c.cls + "\"> \"" + c.txt + "\"")));
      p.cover.forEach(c => bad.push(nhan(m + ": hai thanh noi che nhau - " + c)));
      p.vun.forEach(c => bad.push(nhan(m + ": cau van bi FLEX BE VUN thanh " + c.n + " cot trong <" + c.tag + " class=\"" + c.cls + "\"> - \"" + c.txt + "\"")));
    }
    await ctx.close();
  }
  await browser.close();
  net.forEach(u => bad.push("TAI TAI NGUYEN NGOAI khong duoc (mo demo khong mang la hong): " + u));

  const uniq = [...new Set(bad)];
  if (uniq.length) {
    console.log("CHECKUI FAIL (" + uniq.length + "):");
    uniq.slice(0, 40).forEach(x => console.log("  " + x));
    if (uniq.length > 40) console.log("  ... con " + (uniq.length - 40));
    process.exit(1);
  }
  console.log("CHECKUI OK: da mo THAT " + luot + " luot (man hinh x kho x cong) - khong cuon ngang, khong cat chu am tham, khong tho ra ngoai, nut du to, khong che nhau, khong loi JS, khong phu thuoc mang");
})();
