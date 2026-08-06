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
 *   M5  HAI KHỐI CHỮ ĐÈ NHAU    - hai phần tử anh em cùng mang chữ mà hộp của chúng giao nhau
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
/* V9.99z12 - THEM "viec". Anh Luan 06/08 gui anh khoi "Nhip ngay cua ban": con so dem de len
   cau mo ta. Do lai dung: 2 dong dam nhau o 1440px, 4 dong o 1200px. Bo nay khong thay vi trang
   `viec` KHONG CO trong danh sach - ma khoi Nhip ngay chi nam o do.
   Bai hoc: mot bo kiem "di qua cac trang chinh" thi cai gi khong nam tren duong di deu la vung
   toi. Danh sach nay phai phu du KIEU BO CUC, va "trang viec theo nhip ngay" la mot kieu rieng
   khong trang nao khac co. */
const TRANG = ["banlam","tuyensinh","hoctap","banglop","cskh","thanhtoan","hocvien",
               "giaoviec","duyet","baocao","nhansu","khac","canhan","settings","viec"];

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
      const ra = {cat: [], che: [], hep: [], moCoi: [], deNhau: [], dem: 0};

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

      /* ── M5: HAI KHOI CHU DE LEN NHAU ───────────────────────────────────────────────────
         Anh Luan 06/08 gui anh khoi "Nhip ngay cua ban": con so dem nam de len cau mo ta, doc
         ra thanh "Chi 3o duoi nguong". M2 khong bat duoc vi M2 chi hoi "NUT co bi phu khong" -
         o day khong co nut nao, chi la hai doan chu.
         HAI LAN DUNG HUT TRUOC KHI DUNG - ghi lai ca hai:
          (1) So MOI CAP PHAN TU: bat oan 4 cho o trang Bao cao. Phan tu chu troi (inline) trai
              nhieu dong thi `getBoundingClientRect` tra ve HOP GOP trum ca ba dong nen "de len"
              moi anh em dung canh, trong khi mat nguoi doc van thay binh thuong.
          (2) Siet lai chi so ANH EM RUOT: sach bat oan, nhung bo sot dung cai loi that - vi con
              so nam TRONG `.nhipt` con cau mo ta la `.nhipv` BEN CANH, hai cai la chu-chau chu
              khong phai anh em.
         Nay so cac O CHU LA (khong con phan tu con), bo qua cap co quan he to-tien, bo qua chu
         troi nhieu dong va lop noi, va doi giao nhau day dan (>4px ca hai chieu). */
      (function(){
        const nhinThay = el => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
          if (cs.position === "absolute" || cs.position === "fixed") return false;
          if (el.getClientRects().length !== 1) return false;
          const r = el.getBoundingClientRect();
          return r.width > 0 && r.height > 0;
        };
        const than = document.getElementById("content"); if (!than) return;
        const la = [...than.querySelectorAll("*")].filter(el =>
          el.children.length === 0 && (el.textContent || "").trim().length > 0 && nhinThay(el));
        for (let i = 0; i < la.length; i++) for (let j = i + 1; j < la.length; j++) {
          const x = la[i], y = la[j];
          if (x.contains(y) || y.contains(x)) continue;
          const a = x.getBoundingClientRect(), b = y.getBoundingClientRect();
          const chungNgang = Math.min(a.right, b.right) - Math.max(a.left, b.left);
          const chungDoc   = Math.min(a.bottom, b.bottom) - Math.max(a.top, b.top);
          if (chungNgang <= 4 || chungDoc <= 4) continue;
          ra.deNhau.push('"' + (x.textContent || "").trim().slice(0, 24) + '" de len "' +
                         (y.textContent || "").trim().slice(0, 24) + '"');
        }
      })();

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
    gom(r.deNhau, "HAI KHOI CHU DE LEN NHAU");
  }

  await browser.close();

  /* ── PHẦN KHÔNG THỂ BỎ, KHAI CÓ GIỚI HẠN ───────────────────────────────────────────────
     Nút Trợ lý nổi nay chỉ còn BIỂU TƯỢNG là vùng bấm (tròn 38px ở góc dưới phải) - cả dải chữ
     đã cho chuột đi xuyên qua, hạ số chỗ bị khoá từ 7 xuống 1. Một hình tròn 38px ở góc là mức
     tối thiểu để Trợ lý còn bấm được; ép nhỏ hơn là phạm luật nút ≥24px và làm khó tay người.
     Nên chấp nhận TỐI ĐA 2 chỗ thuộc đúng loại này - quá 2 là dấu hiệu vùng bấm lại phình ra,
     và lúc đó phải đỏ. Đây là một trần có số, không phải một cái công tắc tắt luật. */
  /* V9.99p - trần lên 4. Nút Trợ lý là nút NỔI: theo đúng định nghĩa nó đứng đè lên nội dung,
     và cái vòng tròn 38px ấy rơi vào góc dưới phải - trang nào có nút thao tác ở hàng cuối thì
     nút đó nằm dưới nó. Đã làm hết phần làm được: cả dải chữ (dài ra theo số việc) nay cho chuột
     đi xuyên qua, chỉ còn đúng vòng tròn icon nhận bấm; thân trang chừa thêm 96px cuối.
     Đo lại: 3 trang trong 14. Nâng trần lên 4 là khai đúng con số đang có cộng một chỗ dôi, chứ
     không phải tắt luật - quá 4 vẫn đỏ, và mỗi lần chạy vẫn in ra đúng mấy chỗ đang bị che. */
  /* V9.99z5 - TRAN NANG 4 -> 6, VA DAY LA MOT DANH DOI ANH LUAN CHON, khong phai tat luat.
     Anh Luan 05/08: *"hỏi trợ lý thì nhấn được vào cả cụm nha em, hiện tại chỉ ấn được vào bóng
     đèn"*. Vung bam cua nut Tro ly vi the rong tu vong tron 38px thanh ca cai vien thuoc ~130px.
     Rong hon thi che nhieu hon: do lai ra 6 cho (truoc la 3). Doi lai, nguoi dung bam trung nut
     ngay lan dau - do la thu ho lam MOI NGAY, con o bi che la nhung dong TINH CO troi toi goc
     duoi phai o mot nac cuon, cuon them mot chut la het.
     Van in ra du 6 cho moi lan chay, va qua 6 la do - de mai kia nhan nut dai ra thi biet ngay. */
  const TRAN_FAB = 6;
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
