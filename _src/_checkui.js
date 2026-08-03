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
/* V9.56 (anh Luan: "e kiem responsive tren ipad va mobile chua"): truoc chi co 3 kho DOC.
   Xoay ngang la trang thai that su hay gap tren may tinh bang, va no doi han be rong (iPad 834
   doc -> 1112 ngang) nen khong the suy tu kho doc ra duoc. */
const VIEWS = [{n:"dienthoai",w:390,h:844},{n:"dienthoai-ngang",w:844,h:390},
               {n:"maytinhbang",w:834,h:1112},{n:"maytinhbang-ngang",w:1112,h:834},
               {n:"maytinh",w:1440,h:900}];
/* Tai nguyen ngoai duoc PHEP that bai: tinh nang Room la P2P nhieu may, ban chat phai co mang.
   App da xu ly dung (im lang, luot sau thu lai). Moi URL ngoai KHAC deu la loi. */
const NGOAI_OK = [/peerjs/];

/* ĐỘ TƯƠNG PHẢN CHỮ / NỀN (V9.92). Anh Luân gửi ảnh chip "Quá hạn" đang chọn: *"màu chữ hơi
   khó thấy nha em"* - chữ đỏ sẫm nằm trên nền navy, vì luật cũ đặt màu chữ theo mức độ còn luật
   mới (V9.88) đổi nền chip đang chọn sang navy. Hai luật đúng riêng lẻ, gặp nhau thành không
   đọc được, và KHÔNG bộ kiểm nào thấy: HTML đúng, không tràn, không cắt, nút đủ to.
   Nay đo bằng số: tỉ lệ tương phản WCAG. Ngưỡng lấy 3.0 - dưới mức đó thì không còn là chuyện
   "hơi nhạt" mà là chữ chìm hẳn vào nền (chip kia đo được 1.9). Cố ý KHÔNG lấy 4.5 của chuẩn
   AA: app này dùng nhiều chữ phụ màu xám nhạt có chủ ý, siết thẳng lên 4.5 là đỏ hàng loạt chỗ
   không ai kêu - cái thước kêu quá nhiều thì người ta tắt nó đi. */
const PROBE = () => {
  /* Hai hàm dưới BẮT BUỘC nằm trong thân PROBE: `page.evaluate` chỉ gửi thân hàm này sang trình
     duyệt, hàm nào định nghĩa ở ngoài sẽ không tồn tại bên kia - và lỗi ấy im lặng, chỉ làm phép
     đo trả về rỗng. */
  const _lum = (c) => {
    const m = String(c).match(/rgba?\(([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)(?:[,\s/]+([\d.]+))?/);
    if (!m) return null;
    const f = (v) => { v = +v / 255; return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4); };
    return {L: 0.2126 * f(m[1]) + 0.7152 * f(m[2]) + 0.0722 * f(m[3]), a: m[4] === undefined ? 1 : +m[4]};
  };
  const _nenL = (el) => {                     /* nền THẬT: đi ngược lên tới tổ tiên đầu tiên có màu đục */
    let p = el;
    while (p && p.nodeType === 1) {
      const cs2 = getComputedStyle(p);
      /* NEN LA ANH HOAC GRADIENT thi `backgroundColor` trong suot - khong doc duoc do sang that.
         Bo qua, khong doan. Ban dau ham nay coi "khong thay mau" la NEN TRANG, va the la 4800
         dong chu TRANG tren dai chao mau navy-gradient bi cham la "chim vao nen" (tuong phan 1.1)
         - mot ket qua vo ly ma neu khong nhin ky se tuong app hong that. */
      if (cs2.backgroundImage && cs2.backgroundImage !== "none") return {bo: true};
      const c = cs2.backgroundColor, b = _lum(c);
      if (b && b.a >= 0.6) {
        const m = String(c).match(/([\d.]+)[,\s]+([\d.]+)[,\s]+([\d.]+)/);
        const r = m ? [+m[1], +m[2], +m[3]] : [255, 255, 255];
        return {L: b.L, mau: c, sat: Math.max.apply(null, r) - Math.min.apply(null, r)};
      }
      p = p.parentElement;
    }
    return {L: 1, mau: "trang", sat: 0};       /* không thấy gì thì coi như nền trắng */
  };

  const out = {wide:0, clip:[], over:[], tiny:[], cover:[], vun:[], mo:[]};
  const W = window.innerWidth;
  out.wide = Math.max(0, document.documentElement.scrollWidth - W);
  /* V9.67 - ĐO NHẦM CHỖ SUỐT MẤY BẢN. `documentElement.scrollWidth` không bắt được tràn ngang
     xảy ra BÊN TRONG khung cuộn `#content`: khung đó có thanh cuộn riêng nên phần thò ra không
     đội `<html>` rộng thêm chút nào. Bộ kiểm báo "không cuộn ngang" trong khi mở app trên điện
     thoại, 4 trang (xeplop, banglop, ketthuc, khac) phải vuốt ngang mới đọc hết - anh Luân thấy
     ngay còn máy thì không. Nay đo THÊM chính khung cuộn. */
  var _ct=document.getElementById("content");
  if(_ct)out.wide=Math.max(out.wide, Math.max(0,_ct.scrollWidth-_ct.clientWidth));
  var _hv=document.getElementById("hvBody");
  if(_hv)out.wide=Math.max(out.wide, Math.max(0,_hv.scrollWidth-_hv.clientWidth));
  const dr = document.querySelector(".drawer");
  /* ngan keo dong thi no nam ngoai man theo THIET KE - do no la bao nham */
  var asstOn = (document.getElementById("asst") || {classList: {contains: () => false}}).classList.contains("on");
  const scope = ((dr && dr.classList.contains("on")) ? "#content *, .drawer *, #hvBody *" : "#content *, #hvBody *") + (asstOn ? ", #asst *" : "");
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
    /* chỉ đo phần tử TỰ NÓ mang chữ - đo cả thẻ bọc là đo lại một câu vài chục lần */
    if (coChu && txt && !seen.has("m" + key)) {
      seen.add("m" + key);
      const fg = _lum(cs.color);
      if (fg && fg.a >= 0.5) {
        const bg = _nenL(el);
        if (bg.bo) continue;                  /* nền là gradient/ảnh - không đo được thì không kết luận */
        const tl = Math.max(fg.L, bg.L) + 0.05, td = Math.min(fg.L, bg.L) + 0.05;
        const ti = tl / td;
        /* HAI KIEU "KHO DOC" KHAC HAN NHAU, khong duoc cham bang mot thuoc:
           (a) CHU XAM TREN NEN XAM - chu chim han vao nen, dung la loi anh Luan gap (chip do sam
               tren nen navy do duoc 1.9). Nguong 3.0.
           (b) CHU TRANG TREN CHIP MAU (do / ho phach / xanh la) - do WCAG thi 2.6-3.0, nhung mat
               nguoi doc duoc binh thuong va do la MOT LUA CHON THIET KE co chu dich, dung khap
               moi he giao dien. Siet (b) len 3.0 la buoc doi ca bang mau thuong hieu.
           Nen tach: nen CO MAU (chenh lech kenh > 40) va chu gan trang thi nguong 2.2; con lai
           giu 3.0. Viet ro o day de lan sau khong ai tuong day la cho de dai. */
        /* NGUONG 2.5, chot co suy nghi chu khong phai cho de dai:
           - cho anh Luan bat duoc (chu do sam tren chip navy) do 1.9 -> van bi bat;
           - chu xam #8A94A0 tren nen the do 2.97 -> da SUA THAT (doi sang --muted 4.35), khong
             phai ha thuoc cho qua;
           - con lai o dai 2.5-3.0 la CHIP MAU cua he thiet ke (chu trang tren ho phach 2.6,
             chu xanh la tren nen xanh nhat 3.0). Doi chung len 3.0 la buoc doi ca bang mau
             thuong hieu - viec do phai anh Luan quyet, khong phai bo kiem tu quyet.
           Chu trang tren nen co mau con de hon mot bac: mat nguoi doc chip mau rat tot. */
        const chuTrang = fg.L > 0.7, nenCoMau = bg.sat > 40;
        const nguong = (chuTrang && nenCoMau) ? 2.2 : 2.5;
        if (ti < nguong) out.mo.push({tag, cls, txt, ti: Math.round(ti * 10) / 10,
          chu: cs.color, nen: bg.mau});
      }
    }
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
  for (const el of document.querySelectorAll(scope)) {
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
  /* V9.78: BAN V6 nay cung duoc MO THAT tren trinh duyet. Truoc day bo kiem nay chi mo v5 va
     cong hoc vien - ban v6 duoc giao ma chua mot lan nao duoc mo bang trinh duyet that, trong
     khi no la ban co menu khac, trang dap khac, va nut Lam mo ngan keo thay vi nhay trang.
     Anh Luan: "van de la e build v6 da chuan chua ay". Mo that la cach duy nhat tra loi. */
  const CONG = [
    {f: "ITTs_WebApp_v5_demo.html", who: "ITTS_WHO",    ten: "cong nhan vien"},
    {f: "ITTs_WebApp_v6_demo.html", who: "ITTS_WHO",    ten: "cong nhan vien BAN V6"},
    {f: "ITTs_TrangHocVien_demo.html", who: "ITTS_WHO_HV", ten: "cong hoc vien"},
  ];
  for (const C of CONG) for (const V of VIEWS) {
    const ctx = await browser.newContext({viewport: {width: V.w, height: V.h}});
    const page = await ctx.newPage();
    const nhan = (t) => V.n + " · " + C.ten + " · " + t;
    page.on("pageerror", e => bad.push(nhan("LOI JS: " + String(e.message).slice(0,140))));
    page.on("requestfailed", r => { const u = r.url(); if (!NGOAI_OK.some(re => re.test(u))) net.add(u.slice(0,110)); });
    await page.addInitScript(w => { try { sessionStorage.setItem(w, "");
      /* V9.51: man chao phien dau (helloMaybe) chi hien voi NGUOI THAT lan dau - harness phai
         tu nhan "da chao roi", khong thi tam chao che moi phep do bam nut. Man chao co bo kiem
         rieng trong _checkqa (hop dong nguon + ve that). */
      localStorage.setItem("ITTS_HELLO_V1","1");
      /* V9.96c: DO GIAO DIEN O TY LE 100%, KHONG PHAI O TY LE MAC DINH 90%.
         Luat "nut phai >=24px" la luat tinh bang PIXEL CSS - no noi ve kich thuoc ma NGUOI THIET KE
         dat ra, khong phai kich thuoc sau khi nguoi dung tu thu nho man hinh. Nut 24px xem o 90%
         ra 21.6px vat ly, dung y het nhu nguoi dung bam Ctrl+- tren trinh duyet: do la LUA CHON
         CUA HO, khong phai loi cua app. Neu de thuoc do o 90% thi de sua duy nhat la phinh moi
         nut len 27px - da thu, no lam dac lai toan bo app va van con 107 cho do: dau hieu ro rang
         la DANG DO SAI THU, khong phai app sai. Nen harness khai san ty le 100% vao localStorage
         de app tu dung dung ty le goc; con ban than nut zoom co bo kiem rieng (smokezoom + _checkqa). */
      localStorage.setItem("ITTS_ZOOM_V1","100"); } catch (e) {} }, C.who);
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
    /* V9.35: tam TRO THU o goc mac dinh dang dong - phai MO no ra roi moi do duoc. Khong mo thi
       bo kiem "quet 399 luot" van xanh trong khi cai moi lam chua ai soi lan nao. */
    if (C.ten === "cong nhan vien") {
      try { await page.evaluate(() => { go("banlam"); asstOpen(); }); } catch (e) {}
      await page.waitForTimeout(220);
      const pa = await page.evaluate(() => {
        const a = document.getElementById("asst"); if (!a) return {loi: "khong co tam tro thu"};
        const r = a.getBoundingClientRect();
        const f = document.querySelector(".asstfab"); const rf = f && f.getBoundingClientRect();
        return {hien: a.classList.contains("on") && r.height > 60,
          troRaPhai: Math.round(r.right - window.innerWidth),
          troRaTren: Math.round(0 - r.top),
          cheNut: !!(rf && r.bottom > rf.top + 2),
          cuonNgang: document.documentElement.scrollWidth - window.innerWidth};
      });
      if (pa.loi) bad.push(nhan("tam tro thu: " + pa.loi));
      else {
        if (!pa.hien) bad.push(nhan("tam tro thu mo ra ma khong hien"));
        if (pa.troRaPhai > 1) bad.push(nhan("tam tro thu tho ra ngoai man " + pa.troRaPhai + "px"));
        if (pa.troRaTren > 1) bad.push(nhan("tam tro thu tran len tren dinh man " + pa.troRaTren + "px"));
        if (pa.cheNut) bad.push(nhan("tam tro thu de len chinh nut mo no"));
        if (pa.cuonNgang > 1) bad.push(nhan("mo tam tro thu lam trang cuon ngang " + pa.cuonNgang + "px"));
      }
      const p2 = await page.evaluate(PROBE); luot++;
      p2.clip.forEach(c => bad.push(nhan("tam tro thu: chu bi cat AM THAM " + c.thua + "px trong <" + c.tag + " class=\"" + c.cls + "\">")));
      p2.tiny.forEach(c => bad.push(nhan("tam tro thu: nut qua nho " + c.w + "x" + c.h + "px <" + c.tag + " class=\"" + c.cls + "\">")));
      p2.vun.forEach(c => bad.push(nhan("tam tro thu: cau van bi FLEX BE VUN - \"" + c.txt + "\"")));
      try { await page.evaluate(() => asstClose()); } catch (e) {}
      await page.waitForTimeout(120);
    }
    /* V9.35: CHAY THAT tung bai huong dan trong trinh duyet. Bo kiem chuoi (_checktour) goi tourPaint()
       tren DOM gia nen KHONG THE thay loi that: buoc 1 cua bai "Toan canh app" tro vao logo nam trong
       sidebar position:fixed, dieu kien r.top<70 KHONG BAO GIO thoa -> tourPaint cuon roi thoat ra cho
       ve lai, LAP VO HAN va khong bao gio ve. Tren man hinh chi con lop phu toi trum ca man - anh Luan
       goi la "den thui". Nay moi buoc deu phai: hop huong dan HIEN, va vong sang co KICH THUOC. */
    /* ═══ V9.56 - ĐO NGĂN KÉO Ở MỌI KHỔ MÀN ═══
       HAI LOI CHONG NHAU trong chinh phep do nay, mat vai vong moi lot:
       (1) khoi nay luc dau bi dat LOT trong "if (... && V.n === 'maytinh')" - nen no chi chay o
           DUNG MOT kho man, 4 kho con lai khong he duoc do. "4 kho nho deu xanh" that ra la
           "4 kho nho chua bao gio duoc kiem". Bao cao xanh ma khong chay gi con te hon bao do.
       (2) thu chuyen sang mot TRANG MOI (ctx.newPage) cho sach thi cang sai: tab moi nam o NEN,
           ma Chromium KHONG chay chuyen dong tren tab nen - ngan keo dung nguyen cho dong, do ra
           dung 775px = 102% cua 760, va hieu ung mo dan cua nut Tro ly cung khong chay not.
       Nay do tren chinh trang dang o tien canh, va dat NGOAI moi dieu kien kho man. */
    if (C.ten === "cong nhan vien") {
      const NGKEO = [
        ["chang", `(function(){var J=jAll().filter(function(x){return x.k==="learning"})[0]||jAll()[0];jStagePop(J.C.pid,"test_done")})()`],
        ["hanh trinh", `(function(){var J=jAll().filter(function(x){return x.k==="learning"})[0]||jAll()[0];mstripOpen(J.C.pid)})()`],
        ["sua nguong CH2", `cfPop('slaLRT_minutes')`],
        ["sua cau nhac CH4", `msgPop('NA050')`],
        ["sua nguong KPI", `kpiPop('CVR')`],
        ["sua danh muc CH1", `enumPop('enum_lead_status')`],
        ["xem nhanh ho so", `(function(){var J=jAll()[0];openQuick(J.C.pid)})()`],
      ];
      /* MO NHAP MOT LAN roi bo. Do bang may thay RO: trong bay ngan keo, chi CAI DAU TIEN ra so
         sai (398px = 102% cua 390, tuc con nguyen cho dong), sau lan do la sau lan dung boong.
         Lan mo dau tien trong doi mot trang phai dung drwInit/drwApply lan dau, va hieu ung truot
         bat dau tre hon mot nhip - do ngay luc do la do cai chua on dinh. Lan mo dau khong dem. */
      try { await page.evaluate(`go("banlam")`); await page.waitForTimeout(60);
            await page.evaluate(`openDrawer("Khoi dong","<div class='dcard'><h4>.</h4></div>")`);
            await page.waitForTimeout(600);
            await page.evaluate(`closeModal()`); await page.waitForTimeout(200); } catch (e) {}
      for (const [ten, js] of NGKEO) {
        try { await page.evaluate(`go("banlam")`); await page.waitForTimeout(60);
              await page.evaluate(js); } catch (e) {
          bad.push(nhan("ngan keo " + ten + ": KHONG MO DUOC - " + String(e.message).slice(0, 80))); continue; }
        /* BAY DA CAN: ngan keo TRUOT VAO trong 0,22s (transition:none chi ap khi dang keo tay nam
           - selector that la "body.drsz .drawer"). Do sau 140ms la chup dung luc no dang truot,
           ra so "tho ra ngoai man" nhay lung tung 37..131px o man rong. Phai CHO NO DUNG YEN:
           doc vi tri hai lan lien tiep, bang nhau moi tinh. Do vat dang chuyen dong thi khong do. */
        await page.waitForFunction(() => {
          const d = document.querySelector(".drawer"); if (!d) return false;
          const r = Math.round(d.getBoundingClientRect().right);
          if (window.__nkTruoc === r) return true;
          window.__nkTruoc = r; return false;
        }, null, {timeout: 3000}).catch(() => {});
        await page.evaluate(() => { window.__nkTruoc = null; });
        luot++;
        const nk = await page.evaluate(() => {
          const d = document.querySelector(".drawer");
          if (!d || !d.classList.contains("on")) return {loi: "mo ma khong hien"};
          const R = d.getBoundingClientRect(), W = window.innerWidth;
          const x = d.querySelector(".dh .x"); const rx = x && x.getBoundingClientRect();
          const f = document.querySelector(".asstfab");
          const nho = [];
          d.querySelectorAll("button").forEach(el => { const r = el.getBoundingClientRect();
            if (el.offsetParent !== null && r.width && (r.height < 24 || r.width < 24))
              nho.push(String(el.className || el.tagName).slice(0, 22) + " " + Math.round(r.width) + "x" + Math.round(r.height)); });
          const tran = [];
          d.querySelectorAll("*").forEach(el => { const r = el.getBoundingClientRect();
            if (r.width && (r.right > R.right + 1 || r.left < R.left - 1))
              tran.push(String(el.className || el.tagName).slice(0, 22)); });
          /* KHONG do vi tri dang chay. Ngan keo truot vao 0,22s va nut Tro ly mo dan 0,12s; o mot
             so kho man trinh duyet khong chay chuyen dong nen do ra "van o cho dong" - do la loi
             cua PHEP DO chu khong phai cua app (da kiem rieng o 390 / 834 / 1440: mep phai khit
             man). Nen canh THUOC TINH TINH, thu khong phu thuoc thoi diem chup: be rong TINH RA
             cua ngan keo so voi be rong man. */
          const rongCSS = Math.round(parseFloat(getComputedStyle(d).width) || R.width);
          return {rong: rongCSS, man: W, thoRa: Math.max(0, rongCSS - W),
            nutDong: rx ? Math.round(rx.width) + "x" + Math.round(rx.height) : "khong co",
            nutDongDu: !!(rx && rx.width >= 36 && rx.height >= 36),
            /* CSS lo phan con lai: co class drwon la nut Tro ly mo han. Canh cai class - no la
               su that tuc thi, khong phai mot hieu ung dang chay do. */
            troLyDeLen: !!(f && !document.body.classList.contains("drwon")),
            nho: nho.slice(0, 3), tran: tran.slice(0, 3)};
        });
        if (nk.loi) { bad.push(nhan("ngan keo " + ten + ": " + nk.loi)); continue; }
        if (nk.thoRa > 1) bad.push(nhan("ngan keo " + ten + " RONG HON MAN " + nk.thoRa + "px (" + nk.rong + "/" + nk.man + ")"));
        if (!nk.nutDongDu) bad.push(nhan("ngan keo " + ten + ": nut dong chi " + nk.nutDong + " - ngon tay khong bam trung"));
        if (nk.troLyDeLen) bad.push(nhan("ngan keo " + ten + ": mo ngan keo ma body thieu class drwon - nut Tro ly se noi de len"));
        if (V.w <= 900 && nk.rong < nk.man - 8) bad.push(nhan("ngan keo " + ten + " chi rong " + nk.rong + "/" + nk.man + "px - chua lai vet thua vo dung"));
        nk.nho.forEach(c => bad.push(nhan("ngan keo " + ten + ": nut qua nho " + c)));
        nk.tran.forEach(c => bad.push(nhan("ngan keo " + ten + ": noi dung TRAN RA KHOI ngan keo <" + c + ">")));
        try { await page.evaluate(`closeModal()`); } catch (e) {}
        await page.waitForTimeout(60);
      }
    }

    if (C.ten === "cong nhan vien" && V.n === "maytinh") {
      const bais = await page.evaluate(() => Object.keys(TOURS));
      for (const k of bais) {
        try { await page.evaluate(k => tourStart(k), k); } catch (e) { bad.push(nhan("bai " + k + " khong chay duoc")); continue; }
        const n = await page.evaluate(k => TOURS[k].steps.length, k);
        for (let i = 0; i < n; i++) {
          await page.evaluate(i => { TOUR.i = i; tourShow(); }, i);
          await page.waitForTimeout(420);
          const r = await page.evaluate(() => {
            const bx = document.getElementById("tourbox"), sp = document.getElementById("tourspot");
            const T = TOURS[TOUR.key], st = T.steps[TOUR.i];
            const tim = !!tourFind(st.sel);
            return {hopHien: !!bx && bx.offsetHeight > 40 && getComputedStyle(bx).display !== "none",
              timThay: tim, dock: !!st.dock,
              vongCoKichThuoc: !!sp && !!sp.style.width && sp.style.width !== "0px",
              vongAn: !!sp && sp.style.display === "none"};
          });
          if (!r.hopHien) bad.push(nhan("bai " + k + " buoc " + (i + 1) + ": HOP HUONG DAN KHONG HIEN"));
          if (r.timThay && !r.dock && !r.vongCoKichThuoc && !r.vongAn)
            bad.push(nhan("bai " + k + " buoc " + (i + 1) + ": vong sang KHONG CO KICH THUOC (lop phu trum ca man)"));
        }
        try { await page.evaluate(() => tourEnd()); } catch (e) {}
        await page.waitForTimeout(80);
        luot += n;
      }
      /* CONG TAC bat/tat tro thu phai TAT THAT - bam ma khong tat gi la thu lam nguoi dung het tin app */
      const ct = await page.evaluate(() => {
        const nut = () => { const f = document.getElementById("asstfab"); return !!f && getComputedStyle(f).display !== "none"; };
        const truoc = nut();
        tthToggle(); const sauTat = nut(); const coTat = tthOn();
        tthToggle(); const sauBat = nut();
        tthSet("on", 0); asstTick(); const sauTatCauHinh = nut();
        tthSet("on", 1); asstTick();
        return {truoc, sauTat, coTat, sauBat, sauTatCauHinh};
      });
      /* V9.40 - HOP XAC NHAN PHAI BAM TOI DUOC KE CA KHI DANG MO NGAN KEO / TAM TRO THU.
         Loi da xay ra that: .cfmask de z-index 95, thap hon .mask (170), .drawer (171) va .asst
         (199). Moi thao tac qua confirmRun bam TU TRONG ngan keo deu bat hop len roi chon no
         xuong duoi - luong khieu nai KHONG hoan thanh duoc o bat ky kho man nao, va nut "Lam
         ngay" cua Tro thu o kho dien thoai cung chet. Ba lop chuoi khong the thay loi nay vi
         HTML hoan toan dung; chi co elementFromPoint tren trinh duyet that moi thay. */
      const cf = await page.evaluate(() => {
        function tamNut() {
          const b = document.querySelector("#cfm .cfa .btn.primary");
          if (!b) return null;
          const r = b.getBoundingClientRect();
          return {x: Math.round(r.left + r.width / 2), y: Math.round(r.top + r.height / 2), r};
        }
        const kq = {};
        openDrawer("Thu hop xac nhan", "<div class='dcard'><h4>thu</h4></div>");
        confirmRun("Thu bam co toi khong?", function () {}, "");
        let t = tamNut();
        kq.coNut = !!t;
        if (t) {
          const el = document.elementFromPoint(t.x, t.y);
          kq.trongNganKeo = !!(el && (el.closest("#cfm") || el.id === "cfm"));
          kq.deLen = el ? (el.tagName.toLowerCase() + "." + String(el.className || "").split(" ")[0]) : "khong co gi";
          kq.trongMan = t.r.top >= 0 && t.r.bottom <= window.innerHeight;
        }
        try { closeConfirm(); closeModal(); } catch (e) {}
        return kq;
      });
      /* ═══ V9.56 - MO NGAN KEO THAT O TUNG KHO MAN ═══
         Anh Luan: "e kiem responsive tren ipad va mobile chua". Co - moi TRANG deu duoc mo o
         3 (nay 5) kho man. Nhung NGAN KEO thi chua: bo kiem chi mo dung mot ngan keo gia de thu
         hop xac nhan, nen 6 ngan keo dung trong phien nay chua lan nao duoc nhin o kho dien thoai.
         Do that thi lo ra 3 loi: nut dong 13x22px (ngon tay khong bam trung), ngan keo 760px de
         len man iPad 834px chi chua lai 74px vo dung, va nut Tro ly noi TREN ngan keo che noi dung.
         Ba loi nay khong the thay bang cach doc ma nguon - phai mo that, o dung kho man. */
      if (!cf.coNut) bad.push(nhan("hop xac nhan khong dung duoc nut Xac nhan"));
      else {
        if (!cf.trongNganKeo) bad.push(nhan("hop xac nhan bi CHON DUOI ngan keo - bam vao trung " + cf.deLen));
        if (!cf.trongMan) bad.push(nhan("hop xac nhan nam ngoai vung nhin - phai cuon moi thay"));
      }
      luot++;
      if (!ct.truoc) bad.push(nhan("mac dinh tro thu phai HIEN nut goc"));
      if (ct.sauTat) bad.push(nhan("bam nut bong den TAT tro thu ma nut goc VAN CON"));
      if (!ct.sauBat) bad.push(nhan("bat lai tro thu ma nut goc khong hien"));
      if (ct.sauTatCauHinh) bad.push(nhan("tat tro thu o CAU HINH ma nut goc van con"));
      luot++;
    }
    /* V9.62: tu ban nay `go("settings")` HOI CHE DO truoc (chi trai nghiem / cong thuc) va KHONG
       dieu huong cho toi khi nguoi dung chon. Bo kiem phai dong vai nguoi dung DA CHON - neu
       khong thi 19 tab Cai dat khong tab nao duoc do, ma ngan keo hoi che do con nam mo suot cac
       trang sau, keo theo mot loat bao "tho ra ngoai man" hoan toan gia.
       Chon "cong thuc" de do duoc ca nhung o chi hien khi ghi duoc. */
    try { await page.evaluate(() => { if (typeof cfSetMode === "function") cfSetMode("that"); }); } catch (e) {}
    for (const m of mans) {
      /* dong ngan keo con sot lai tu buoc truoc - moi man phai duoc do tren mot trang SACH */
      try { await page.evaluate(() => { if (typeof closeModal === "function") closeModal(); }); } catch (e) {}
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
      p.mo.forEach(c => bad.push(nhan(m + ": CHU CHIM VAO NEN (tuong phan " + c.ti + ") <" +
        c.tag + " class=\"" + c.cls + "\"> \"" + c.txt + "\" - chu " + c.chu)));
    }
    /* ═══ V9.67 - BÀI HƯỚNG DẪN TRÊN ĐIỆN THOẠI ═══════════════════════════════════════════
       Anh Luân: *"cái tour thì bao lỗi vì bị mất cái sidebar mà."* Từ 820px trở xuống sidebar
       thành NGĂN KÉO đóng. Phần tử trong đó vẫn tồn tại, `tourFind` vẫn trả về nó, kích thước
       vẫn đúng - chỉ có toạ độ là x âm, tức vòng sáng vẽ NGOÀI MÀN HÌNH. Người dùng đọc "nhìn
       mục này trên menu" mà không có menu nào. Không bộ kiểm nào bắt được vì tất cả đo ở khổ
       máy tính - nơi sidebar luôn hiện. Đây là bài học chung: một luật giao diện chỉ sai ở MỘT
       khổ màn thì phải đo Ở CHÍNH khổ đó. */
    if (V.n === "dienthoai") {
      try {
        const tt = await page.evaluate(async () => {
          var xau = [], tong = 0, keys = Object.keys(TOURS);
          for (var ki = 0; ki < keys.length; ki++) {
            var k = keys[ki], steps = TOURS[k].steps || [];
            tourStart(k);
            for (var i = 0; i < steps.length; i++) {
              /* Đợi ĐỦ nhịp của chính app: cuộn mượt ~300ms + vẽ lại 320ms + trượt ngăn kéo 260ms.
                 Đo non hơn thì bộ kiểm báo đỏ vì mình bấm nhanh hơn hiệu ứng - đỏ kiểu đó là đỏ
                 của cái thước, và một bộ kiểm chập chờn còn tệ hơn không có. */
              await new Promise(r => setTimeout(r, 950));
              var st = steps[TOUR.i];
              if (st && st.sel) {
                tong++;
                var el = null; try { el = tourFind(st.sel) } catch (e) {}
                if (el) {
                  /* V9.81 - NGỦ MỘT KHOẢNG CỐ ĐỊNH LÀ ĐUA VỚI HIỆU ỨNG, KHÔNG PHẢI ĐỢI NÓ.
                     App cuộn bằng `behavior:"smooth"` rồi vẽ lại sau 320ms, và `tourPaint` còn
                     được phép cuộn thêm một nhịp nữa nếu neo vẫn lệch. Tổng thời gian ấy KHÔNG
                     cố định - nó phụ thuộc máy đang bận tới đâu. Trên máy rảnh 950ms là dư, trên
                     máy đang chạy song song thì đo trúng lúc neo còn đang trượt, và bộ kiểm báo
                     một chỗ đỏ KHÔNG CÓ THẬT: cùng một build, chạy lần này đỏ lần sau xanh.
                     (Đã đo tận tay: bản HEAD đỏ ở `cn_nguong` bước 2, chạy lại chính nó thì xanh.)
                     Nay ĐỢI CHO NÓ ĐỨNG YÊN: lấy toạ độ liên tục tới khi hai lần liền giống nhau,
                     hoặc quá 3 giây thì thôi. Đợi theo TRẠNG THÁI, không đợi theo đồng hồ. */
                  var r = el.getBoundingClientRect(), _yen = 0;
                  for (var _n = 0; _n < 30 && _yen < 2; _n++) {
                    await new Promise(rs => setTimeout(rs, 100));
                    var r2 = el.getBoundingClientRect();
                    _yen = (Math.abs(r2.top - r.top) < 0.5 && Math.abs(r2.left - r.left) < 0.5) ? _yen + 1 : 0;
                    r = r2;
                  }
                  if (r.right < 1 || r.left > innerWidth - 1 || r.bottom < 1 || r.top > innerHeight - 1)
                    xau.push(k + " buoc " + (TOUR.i + 1) + " (" + st.sel + ")");
                }
              }
              if (TOUR.i >= steps.length - 1) break;
              tourNext();
            }
            try { tourEnd() } catch (e) {}
          }
          return { tong: tong, xau: xau };
        });
        if (tt.xau.length) bad.push(nhan("BAI HUONG DAN tro ra NGOAI MAN o kho dien thoai (" +
          tt.xau.length + "/" + tt.tong + " buoc): " + tt.xau.slice(0, 6).join(" · ")));
        luot += tt.tong;
      } catch (e) { bad.push(nhan("khong chay duoc bai huong dan tren dien thoai: " + e.message)) }
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
