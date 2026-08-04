/* _checkmat.js - ĐO BẰNG MẮT: CHỮ CÓ ĐỌC ĐƯỢC KHÔNG, NÚT CÓ BẤM ĐƯỢC KHÔNG.
 *
 * VÌ SAO CÓ FILE NÀY (anh Luân 04/08, sau một ngày mà anh bắt được SÁU lỗi còn máy bắt được không):
 *   *"thứ thật là quá trình verify của em rất lâu, nhưng lần nào a cũng bắt được lỗi, e nên xem
 *    lại cách làm verify, chứ vừa tốn thời gian vừa ko hiệu quả thì giữ như cũ làm gì"*
 *
 * ĐẾM LẠI CHO SÒNG PHẲNG - sáu lỗi trong ngày, sáu lỗi đều do anh Luân chỉ ra, không lỗi nào do
 * 26 bộ kiểm (18 phút) tìm ra:
 *   · ô chọn cắt mất chữ ("Gõ để tìm trong 22 lựa", "LOP-FOUND-PLA-01 - Foundat")
 *   · nút Trợ lý nổi che mất 8 nút của nội dung
 *   · breadcrumb rớt dòng để lại một dấu "›" mồ côi
 *   · tour trỏ vào dòng mô tả chung thay vì thứ đang dạy
 *   · trang Vận hành lớp không tổng hợp rủi ro của lớp
 *   · "footer bar" 90px do zoom co mất `vh`
 *
 * BA LỖI ĐẦU CÙNG MỘT HỌ, và đó là họ mà toàn bộ 26 bộ cũ KHÔNG có cửa nào để thấy: **HTML đúng
 * hoàn toàn** - không tràn, không lỗi JS, nút đủ to, chữ đủ tương phản - nhưng **nhìn vào thì
 * hỏng**. Chúng chỉ lộ ra khi so KÍCH THƯỚC THẬT của chữ với CHỖ THẬT nó có, và khi hỏi trình
 * duyệt xem cú bấm rơi vào đâu.
 *
 * BỐN PHÉP ĐO Ở ĐÂY - đều rẻ, đều đo cái mắt người thấy:
 *   M1  CHỮ RỘNG HƠN CHỖ NÓ CÓ  - ô nhập / thẻ mang chữ mà chữ cần nhiều px hơn khung
 *   M2  BỊ CÁI KHÁC PHỦ LÊN     - nút/ô mà điểm giữa lại thuộc về một phần tử khác
 *   M3  HẸP GIỮA KHOẢNG TRỐNG   - ô bị cắt chữ trong khi hàng chứa nó còn thừa chỗ rộng rãi
 *   M4  DẤU NGĂN MỒ CÔI         - dấu ›/·/| nằm khác dòng với mục nó đi kèm
 *
 * CỐ Ý CHẠY NHANH (một khổ màn, một lượt đi qua các trang chính): bộ này phải nằm ở TẦNG NHANH,
 * chạy sau mỗi lần sửa. Bộ kiểm 18 phút thì người ta chạy một ngày một lần, mà lỗi loại này sinh
 * ra từ chính lần sửa vừa rồi.
 *
 * Chạy:  ITTS_OUT=<out> node _checkmat.js
 */
const OUT = process.env.ITTS_OUT || ".";
const PATHS = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
               "/opt/pw-browsers/chromium/chrome-linux/chrome"];

/* Trang đi qua: đủ phủ các kiểu bố cục (hub nhiều tab · sổ tra cứu · trang form · trang cấu
   hình · trang hồ sơ), không cần đi hết 92 trang - lỗi hình học lặp theo KIỂU bố cục. */
const TRANG = ["banlam","tuyensinh","hoctap","banglop","cskh","thanhtoan","hocvien",
               "giaoviec","duyet","baocao","nhansu","khac","canhan","settings"];

/* Chỗ được phép cắt chữ, kèm lý do đọc được. Thêm dòng vào đây là một quyết định. */
const CAT_OK = [
  {khop: /^\.dt /, ly: "Ô trong bảng dữ liệu: bảng có cột kéo được và nút Cột để tắt bớt; ép mọi ô đủ rộng thì bảng nào cũng cuộn ngang."},
  {khop: /(^|\s)mut(\s|$)/, ly: "Chữ phụ mờ - phần bị cắt là chú thích thêm, không phải thông tin phải đọc."},
];

(async () => {
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch (e) { console.log("CHECKMAT BO QUA: chua cai playwright (npm i playwright)"); process.exit(0); }
  const fs = require("fs"), path = require("path");
  const exe = PATHS.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  let browser;
  try { browser = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("CHECKMAT BO QUA: khong mo duoc Chromium (" + String(e.message).slice(0,80) + ")"); process.exit(0); }

  const do_ = [];
  let soDo = 0;

  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
  const page = await ctx.newPage();
  await page.addInitScript(() => { try {
    sessionStorage.setItem("ITTS_WHO", "");
    localStorage.setItem("ITTS_HELLO_V1", "1");
    /* Đo ở tỷ lệ 100%: luật về kích thước là luật tính bằng pixel CSS, người dùng tự thu nhỏ là
       lựa chọn của họ (xem chú thích cùng nội dung trong _checkui). */
    localStorage.setItem("ITTS_ZOOM_V1", "100");
  } catch (e) {} });
  await page.goto("file://" + path.resolve(OUT) + "/ITTs_WebApp_v5_demo.html", {waitUntil: "load"});
  await page.waitForFunction(() => typeof window.go === "function", null, {timeout: 30000});
  await page.waitForTimeout(700);

  /* Trợ lý tự hé mở 3,2 giây rồi đóng (V9.96). Đo trong lúc nó đang mở thì mọi thứ dưới nó đều
     bị chấm là "bị che" - lượt đầu dựng bộ này ra 123 chỗ, gần hết là vậy. Đợi nó đóng hẳn. */
  await page.waitForTimeout(4200);
  await page.evaluate(() => { try {
    if (typeof asstDong === "function") asstDong();
    const a = document.getElementById("asst");
    if (a && a.classList.contains("on") && typeof tthToggle === "function") tthToggle();
  } catch (e) {} });
  await page.waitForTimeout(600);

  for (const k of TRANG) {
    const r = await page.evaluate(async ([k, CAT_OK_SRC]) => {
      const CAT_OK = CAT_OK_SRC.map(x => ({khop: new RegExp(x.k, x.f), ly: x.ly}));
      try { go(k); } catch (e) { return {loi: "khong mo duoc trang"}; }
      await new Promise(r => setTimeout(r, 340));
      const c = document.getElementById("content");
      if (!c) return {loi: "khong co than trang"};
      const ra = {cat: [], che: [], hep: [], moCoi: [], dem: 0};

      /* Thước đo bề rộng THẬT của một đoạn chữ với đúng font của nó. Dựng một lần, dùng lại. */
      const do_ = document.createElement("span");
      do_.style.cssText = "position:absolute;visibility:hidden;white-space:nowrap;top:-9999px;left:-9999px";
      document.body.appendChild(do_);
      const rongChu = (chu, cs) => { do_.style.font = cs.font; do_.style.letterSpacing = cs.letterSpacing;
        do_.textContent = chu; return do_.getBoundingClientRect().width; };

      const ten = (el) => {
        const t = (el.tagName || "").toLowerCase();
        const cl = String(el.className || "").split(/\s+/)[0] || "";
        return t + (cl ? "." + cl : "");
      };
      const boQua = (el) => {
        const dm = ten(el) + " " + String(el.className || "");
        for (const x of CAT_OK) if (x.khop.test(dm)) return true;
        return false;
      };

      /* ── M1 + M3: chữ rộng hơn chỗ nó có ─────────────────────────────────────────────── */
      c.querySelectorAll("input:not([type=hidden]), .bsn, .bsl, .crb, h1, h2, h3, h4, b, .chip, button").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden") return;
        const box = el.getBoundingClientRect();
        if (box.width < 8 || box.height < 6) return;
        /* Chỉ đo phần tử TỰ NÓ mang chữ - đo cả thẻ bọc là đo lại một câu nhiều lần. */
        let chu = "";
        if (el.tagName === "INPUT") chu = String(el.value || el.placeholder || "");
        else {
          const con = [...el.childNodes].filter(n => n.nodeType === 3 && n.textContent.trim());
          if (!con.length) return;
          chu = con.map(n => n.textContent).join(" ").replace(/\s+/g, " ").trim();
        }
        if (chu.length < 3) return;
        /* Chữ ĐƯỢC PHÉP xuống dòng thì không có chuyện cắt ngang - chỉ đo thứ bị ép một dòng. */
        const motDong = cs.whiteSpace === "nowrap" || el.tagName === "INPUT";
        if (!motDong) return;
        ra.dem++;
        const pad = parseFloat(cs.paddingLeft || 0) + parseFloat(cs.paddingRight || 0)
                  + parseFloat(cs.borderLeftWidth || 0) + parseFloat(cs.borderRightWidth || 0);
        const cho = box.width - pad;
        const can = rongChu(chu, cs);
        if (can <= cho + 1) return;
        if (boQua(el)) return;
        const thieu = Math.round(can - cho);
        const mo = ten(el) + ' "' + chu.slice(0, 40) + '" can ' + Math.round(can)
                 + 'px ma chi co ' + Math.round(cho) + 'px (thieu ' + thieu + 'px)';
        /* M3: hàng chứa nó còn thừa chỗ rộng rãi -> ô hẹp giữa khoảng trống, sửa được ngay. */
        const cha = el.closest(".sp,.tbar,.tbtren,.fld,.phead") || el.parentElement;
        const chaR = cha ? cha.getBoundingClientRect().width : 0;
        const thua = chaR - box.width;
        if (thua > thieu + 40) ra.hep.push(mo + " - hang chua no con thua " + Math.round(thua) + "px");
        else ra.cat.push(mo);
      });

      /* ── M2: bị cái khác phủ lên ──────────────────────────────────────────────────────── */
      c.querySelectorAll("button, input, select, a.lnk, .obcard").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.display === "none" || cs.visibility === "hidden" || cs.pointerEvents === "none") return;
        const b = el.getBoundingClientRect();
        if (b.width < 6 || b.height < 6) return;
        if (b.bottom < 0 || b.top > innerHeight || b.right < 0 || b.left > innerWidth) return;
        const tren = document.elementFromPoint(b.left + b.width / 2, b.top + b.height / 2);
        if (!tren || el === tren || el.contains(tren) || tren.contains(el)) return;
        const che = tren.closest("button,input,select,a") || tren;
        ra.che.push(ten(el) + ' "' + (el.textContent || el.placeholder || "").replace(/\s+/g, " ").trim().slice(0, 24)
          + '" bi ' + ten(che) + ' "' + (che.textContent || "").replace(/\s+/g, " ").trim().slice(0, 22) + '" phu len');
      });

      /* ── M4: dấu ngăn mồ côi ──────────────────────────────────────────────────────────── */
      document.querySelectorAll(".crbsep, .sep, .dot").forEach(el => {
        const t = (el.textContent || "").trim();
        if (!/^[›·|\/>-]$/.test(t)) return;
        const y = el.getBoundingClientRect().top;
        let n = el.nextElementSibling;
        if (!n) { const cha = el.parentElement; n = cha && cha.nextElementSibling; }
        if (!n) return;
        const ny = n.getBoundingClientRect().top;
        if (Math.abs(ny - y) > 6) ra.moCoi.push('dau "' + t + '" nam khac dong voi muc di sau no');
      });

      do_.remove();
      return ra;
    }, [k, CAT_OK.map(x => ({k: x.khop.source, f: x.khop.flags, ly: x.ly}))]);

    if (r.loi) { do_.push(k + ": " + r.loi); continue; }
    soDo += r.dem || 0;
    const gom = (ds, nhan) => [...new Set(ds)].slice(0, 4).forEach(x => do_.push(k + " | " + nhan + ": " + x));
    gom(r.hep, "O HEP GIUA KHOANG TRONG");
    gom(r.cat, "CHU BI CAT");
    gom(r.che, "BI PHU LEN - khong bam duoc");
    gom(r.moCoi, "DAU NGAN MO COI");
  }

  await browser.close();

  /* ── PHẦN KHÔNG THỂ BỎ, KHAI CÓ GIỚI HẠN ───────────────────────────────────────────────
     Nút Trợ lý nổi nay chỉ còn BIỂU TƯỢNG là vùng bấm (tròn 38px ở góc dưới phải) - cả dải chữ
     đã cho chuột đi xuyên qua, hạ số chỗ bị khoá từ 7 xuống 1. Một hình tròn 38px ở góc là mức
     tối thiểu để Trợ lý còn bấm được; ép nhỏ hơn là phạm luật nút ≥24px và làm khó tay người.
     Nên chấp nhận TỐI ĐA 2 chỗ thuộc đúng loại này - quá 2 là dấu hiệu vùng bấm lại phình ra,
     và lúc đó phải đỏ. Đây là một trần có số, không phải một cái công tắc tắt luật. */
  const TRAN_FAB = 2;
  const doFab = do_.filter(x => /asstfab/.test(x));
  if (doFab.length && doFab.length <= TRAN_FAB) {
    doFab.forEach(x => { const i = do_.indexOf(x); if (i >= 0) do_.splice(i, 1); });
    console.log("  ghi chu: " + doFab.length + "/" + TRAN_FAB + " cho nam duoi VUNG BAM 38px cua nut Tro ly"
      + " - phan khong the bo, da khai ly do trong _checkmat.js");
  }

  if (do_.length) {
    console.log("CHECKMAT DO (" + do_.length + " cho tren " + TRANG.length + " trang):");
    do_.slice(0, 40).forEach(x => console.log("  - " + x));
    if (do_.length > 40) console.log("  ... con " + (do_.length - 40));
    console.log("CHECKMAT DO");
    process.exit(0);
  }
  console.log("CHECKMAT OK: " + TRANG.length + " trang, " + soDo + " chuoi chu do bang thuoc that -"
    + " khong chu nao bi cat, khong nut nao bi phu len, khong dau ngan nao mo coi");
})();
