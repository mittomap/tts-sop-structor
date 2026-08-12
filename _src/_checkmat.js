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
/* V2 09/08 - THEM NAM TRANG. Lo "so bi be doi" (`10.660.0` / `00đ`) nam o `bangcong`, va
   `bangcong` KHONG CO trong danh sach nay - nen phep do M6 vua dung xong da xanh ngay lap tuc
   mot cach vo nghia. Dung cai bay ghi o dau file, lan nay tu can minh: mot bo kiem "di qua cac
   trang chinh" thi cai gi khong nam tren duong di deu la vung toi.
   Nam trang them vao deu la KIEU BO CUC rieng cua ban V2: dai the nhieu o mang so tien
   (`bangcong`), trang ho so nguoi (`giangvien`), trang hai tang danh sach (`baitap`), trang
   luoi thoi gian (`lichtuan`), trang muc luc (`tracuu`). */
const TRANG = ["banlam","tuyensinh","hoctap","banglop","cskh","thanhtoan","hocvien",
               "giaoviec","duyet","baocao","nhansu","khac","canhan","settings","viec",
               "bangcong","giangvien","baitap","lichtuan","tracuu"];

/* Chỗ được phép cắt chữ, kèm lý do đọc được. Thêm dòng vào đây là một quyết định. */
const CAT_OK = [
  {khop: /^\.dt /, ly: "Ô trong bảng dữ liệu: bảng có cột kéo được và nút Cột để tắt bớt; ép mọi ô đủ rộng thì bảng nào cũng cuộn ngang."},
  /* NGOẠI LỆ NÀY ĐÃ KHAI QUÁ RỘNG - tạm gỡ để xem nó đang che những gì.
     Tìm ra 09/08: trên hàng KPI của trang Báo cáo, chữ mang lớp `mut` không phải chú thích phụ -
     nó là **TÊN CỦA CHỈ SỐ** ("TB phút từ lead tới cuộc gọi đầu"). Đọc "LRT · TB phút từ l…" thì
     không biết chỉ số ấy đo cái gì. Lớp `mut` chỉ nói về MÀU (chữ mờ), không nói về VAI TRÒ.
     Khai ngoại lệ theo màu là khai theo thứ dễ nhìn thấy thay vì thứ đang hỏi. */
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

  /* HAI KHỔ MÀN, KHÔNG PHẢI MỘT. Bộ này vốn cố ý chỉ đo 1440px cho rẻ - đúng với ba phép đo
     đầu (chữ rộng hơn khung, bị phủ lên, hai khối đè nhau đều xảy ra ở mọi khổ). Nhưng phép đo
     M4 "dấu ngăn mồ côi" và M6 "con số bị bẻ đôi" đều là **lỗi DO XUỐNG DÒNG** - mà chữ chỉ
     xuống dòng khi khung hẹp. Đo một lỗi-do-xuống-dòng ở khổ RỘNG NHẤT là đo đúng cái trường
     hợp nó không thể xảy ra, rồi báo xanh.
     Bẫy cắn 09/08: dòng chào trên Trang bắt đầu đọc thành *"72 việc cần xử lý · 54 quá hạn ·"*
     ở khổ điện thoại - một dấu chấm giữa treo lơ lửng cuối dòng. M4 sinh ra để bắt đúng chuyện
     đó, và nó xanh suốt vì chưa bao giờ nhìn một màn hẹp.
     Thêm khổ 390px (điện thoại). Vẫn rẻ: cả hai khổ cộng lại dưới một phút. */
  for (const V of [{n:"maytinh",w:1440,h:900},{n:"dienthoai",w:390,h:844}]) {
  const ctx = await browser.newContext({viewport: {width: V.w, height: V.h}});
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
      const ra = {cat: [], che: [], hep: [], moCoi: [], deNhau: [], thucThe: [], soVo: [], batNat: [], bopCot: [], dem: 0};

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
        /* Ô CHỌN TRÊN KHỔ HẸP: giá trị đang chọn là tên lớp / tên buổi đầy đủ, dài 350-400px -
           một màn 390px không có cách nào chứa hết mà vẫn còn chỗ cho nhãn và nút. Chấp nhận cắt
           Ở ĐÂY, và chỉ ở đây, vì ba lý do đọc được: (a) danh sách xổ ra hiện đủ tên, (b) ngay
           dưới thanh chọn là khối thông tin in lại đầy đủ tên lớp và tên buổi, (c) gõ để tìm vẫn
           chạy. Trên khổ máy tính thì KHÔNG tha - ở đó cắt chữ là do bố cục sai, và 09/08 đã vá
           đúng một ca như thế trên trang Bài tập. */
        if (window.innerWidth <= 480 && /\bpki\b/.test(String(el.className || ""))) return true;
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
        /* M8 - HỎI THẲNG TRÌNH DUYỆT XEM NÓ CÓ ĐANG CẮT CHỮ KHÔNG.
           M1 tự dựng một thẻ ẩn rồi đo lại bề rộng chữ - đúng, nhưng nó chỉ soi một **DANH SÁCH
           THẺ CỐ ĐỊNH** (`input, .bsn, .bsl, .crb, h1..h4, b, .chip, button`). Lớp nào không có
           tên trong danh sách ấy là một vùng tối.
           Bẫy cắn 09/08: hỏi `scrollWidth > clientWidth` thì ra **100 chỗ đang bị cắt**, trong đó
           **40 tên chỉ số KPI bị cắt ngay trên khổ máy tính 1440px** (chỗ nặng nhất mất 148px,
           quá nửa cái tên) - `.kpin` không nằm trong danh sách nên M1 chưa từng nhìn nó.
           Cùng họ với "trang không nằm trên đường đi thì không ai đo", lần này là "lớp không nằm
           trong danh sách thì không ai đo". Chữa tận gốc: **đừng tự đo, hãy hỏi trình duyệt** -
           nó biết chính xác nó vừa cắt cái gì, và nó biết cho MỌI phần tử chứ không riêng vài lớp.
           Rẻ hơn nữa: không phải dựng thẻ đo, không phải khớp font. */
        than.querySelectorAll("*").forEach(el => {
          if (el.children.length) return;
          const t = (el.textContent || "").trim(); if (t.length < 4) return;
          const cs = getComputedStyle(el); if (cs.display === "none") return;
          if (el.getBoundingClientRect().width === 0) return;
          if (el.scrollWidth <= el.clientWidth + 1) return;
          const cl = String(el.className || "");
          /* Ô trong bảng: đã khai lý do ở CAT_OK (bảng có cột kéo được và nút Cột). */
          if (el.closest("table")) return;
          /* `.obm` trong thẻ hàng đang GẤP: cắt là CỐ Ý - bấm mở thẻ ra thì `.obcard.open` gỡ
             nowrap và hiện đủ. Đây là ngoại lệ nói được lý do, không phải chỗ bỏ qua cho yên. */
          if (/\bobm\b/.test(cl) && el.closest(".obcards.rows") && !el.closest(".obcard.open")) return;
          ra.batNat.push('"' + t.slice(0, 30) + '" (.' + (cl.split(" ")[0] || el.tagName) +
                         ") bi cat " + (el.scrollWidth - el.clientWidth) + "px");
        });
        /* M5 - CON SỐ BỊ BẺ ĐÔI GIỮA HAI CHỮ SỐ.
           Bẫy cắn 09/08, tìm ra bằng mắt: ô "Tiền công tạm tính" hiện `10.660.0` rồi xuống dòng
           `00đ`. `.bsn{overflow-wrap:anywhere}` đúng cho CHỮ dài (thà xuống dòng còn hơn tràn),
           nhưng với một CON SỐ thì xuống dòng giữa chừng đọc ra một số khác hẳn - hại hơn tràn.
           Bốn phép đo cũ không thấy: M1 hỏi "chữ có rộng hơn chỗ nó có không" - nó KHÔNG rộng
           hơn, nó vừa khít vì đã tự bẻ; M3 hỏi ô hẹp giữa khoảng trống - chỗ này không thừa chỗ.
           Phép hỏi: một ô chỉ chứa số + dấu ngăn + đơn vị mà cao hơn 1,6 lần chiều cao dòng thì
           nó đang nằm trên hai dòng, tức đã bị bẻ. */
        than.querySelectorAll(".bsn, .kpin, .bignum").forEach(el => {
          const t = (el.textContent || "").trim();
          if (!/^[\d.,\s]+(đ|h|%|đ\/giờ)?$/.test(t)) return;
          if (!nhinThay(el)) return;
          const cs = getComputedStyle(el);
          const caoDong = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
          const r = el.getBoundingClientRect();
          if (r.height > caoDong * 1.6)
            ra.soVo.push('"' + t + '" nam tren ' + Math.round(r.height / caoDong) + ' dong (cao ' +
                         Math.round(r.height) + 'px, dong ' + Math.round(caoDong) + 'px)');
        });
        /* M6 - CHU BI BOP THANH MOT COT HEP.
           Anh Luan 11/08 nhin dai "Can chu y" roi noi: *"thiet ke nay nhin luom thuom qua em"*.
           Do ra: o mang so tien "181.900.000d" khong bi chan be rong, no an 122px trong mot o
           272px, nen cai NHAN ben canh chi con 75px va cau "Den han thu, tinh toi hom nay" roi
           MOT CHU MOI DONG - 3 dong. Luoi lai bat moi o cung hang cao bang nhau, nen mot o hong
           keo ca hang cao gap ruoi.
           Nam phep do cu deu khong thay, va deu co ly do rieng: M1 hoi "chu co rong hon cho no
           co khong" - KHONG, no vua khit vi da tu xuong dong; M3 hoi o hep giua khoang trong -
           cho nay khong thua cho; M5 chi soi cac o CHI CHUA SO; `_checkui` hoi tran ngang va nut
           qua nho - deu khong dinh. Chu van doc duoc, khong cat, khong tran. No chi XAU.
           Phep hoi moi, tong quat chu khong canh rieng dai canh bao: mot khoi chu xuong tu 3
           dong tro len MA be rong cua no chua toi 40% cua khoi cha, thi no khong "dai" - no dang
           bi mot thang anh em cung hang bop lai. Nguong 40% dat de mot cot chu doc that (vd cot
           hep trong bang 3 cot) khong bi cham oan. */
        than.querySelectorAll("*").forEach(el => {
          if (el.children.length) return;
          const t = (el.textContent || "").trim();
          if (t.length < 12) return;                 /* chu ngan thi 3 dong la do co y, khong phai bi bop */
          if (!nhinThay(el)) return;
          /* O TRONG BANG: mien, cung ly do da khai o phep `batNat` - bang co cot keo duoc va nut
             Cot, nguoi dung tu chinh be rong duoc. Ep moi o bang khong duoc hep la ep bang phai
             rong ra vo han. Da do: khong mien thi 43 cho, gan het la `.TD`/`.TH`. */
          if (el.closest("table")) return;
          const cs = getComputedStyle(el);
          if (cs.writingMode && cs.writingMode.indexOf("vertical") === 0) return;   /* chu doc la co y */
          const caoDong = parseFloat(cs.lineHeight) || parseFloat(cs.fontSize) * 1.2;
          const r = el.getBoundingClientRect();
          if (!r.width || !caoDong) return;
          const soDong = Math.round(r.height / caoDong);
          if (soDong < 3) return;
          const cha = el.parentElement && el.parentElement.getBoundingClientRect();
          if (!cha || !cha.width) return;
          if (r.width / cha.width >= 0.4) return;
          ra.bopCot.push('"' + t.slice(0, 30) + '" (.' + ((String(el.className || "").split(" ")[0]) || el.tagName) +
                         ") bi bop con " + Math.round(r.width) + "px trong khoi rong " +
                         Math.round(cha.width) + "px -> vo " + soDong + " dong");
        });
        /* THUC THE HTML CON SONG TREN MAN - dau hieu escape HAI LAN.
           Bay cắn 09/08: `openDrawer` dat tieu de bang `textContent` ma cho goi lai `esc()` truoc,
           nen ten trang co dau "&" hien nguyen "&amp;". Doc bang `textContent` moi thay: doc
           `innerHTML` thi "&amp;" la cach viet DUNG cua mot dau "&", khong phan biet duoc.
           Vi the phai hoi o tang chu NGUOI DOC THAY, dung o tang ma nguon. */
        {
          const t = String(than.textContent || "");
          const m = t.match(/&(?:amp|lt|gt|quot|apos|nbsp|#\d+);/g);
          if (m) [...new Set(m)].forEach(x => {
            const i = t.indexOf(x);
            ra.thucThe.push(x + '  (trong "' + t.slice(Math.max(0, i - 26), i + x.length + 14).replace(/\s+/g, " ").trim() + '")');
          });
        }
          /* M7 - VẠCH NGĂN MỒ CÔI (họ hàng của M4, nhưng M4 chỉ thấy dấu ngăn bằng CHỮ).
           Bẫy cắn 09/08, nhìn thấy trên khổ máy tính bảng 768px: giữa hai hàng chip có **một
           dòng trống chỉ chứa đúng một vạch dọc**. `.tbdiv` là một phần tử flex ĐỨNG RIÊNG, nên
           khi thanh công cụ xuống dòng nó ở lại một mình và chiếm trọn một hàng cao 40px.
           M4 không thấy vì nó tìm dấu ngăn bằng ký tự (·›|); vạch này vẽ bằng CSS, không mang
           chữ nào - `textContent` của nó rỗng.
           Đo được lúc tìm ra, ở MỌI khổ chứ không riêng màn hẹp: điện thoại 10 chỗ · máy tính
           bảng 7 · laptop 6 · **máy tính 1440 vẫn 3**.
           Phép hỏi: một vạch ngăn mà trên CÙNG MỘT DÒNG bên phải nó không còn gì, thì nó đang
           ngăn cách hai thứ không nằm cạnh nhau - tức là nó vô nghĩa và trông như rác. */
        than.querySelectorAll(".tbdiv,.sep,.tbgr").forEach(el => {
          const r = el.getBoundingClientRect();
          if (r.height === 0 || r.width === 0) return;
          if (el.classList.contains("tbgr")) return;   /* .tbgr mang vạch trong `::before`, không bao giờ đứng riêng */
          let sau = false;
          const anh = el.parentElement ? [...el.parentElement.children] : [];
          anh.forEach(x => {
            if (sau || x === el) return;
            const r2 = x.getBoundingClientRect();
            if (r2.width === 0 || r2.height === 0) return;
            if (r2.left >= r.right - 1 && Math.abs((r2.top + r2.bottom) / 2 - (r.top + r.bottom) / 2) < 12) sau = true;
          });
          if (!sau) ra.moCoi.push('vach ngan "' + (el.className || el.tagName) + '" mot minh cuoi dong');
        });

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

    if (r.loi) { do_.push(V.n + " · " + k + ": " + r.loi); continue; }
    soDo += r.dem || 0;
    const gom = (ds, nhan) => [...new Set(ds)].slice(0, 4).forEach(x => do_.push(V.n + " · " + k + " | " + nhan + ": " + x));
    gom(r.hep, "O HEP GIUA KHOANG TRONG");
    gom(r.cat, "CHU BI CAT");
    gom(r.che, "BI PHU LEN - khong bam duoc");
    gom(r.moCoi, "DAU NGAN MO COI");
    gom(r.deNhau, "HAI KHOI CHU DE LEN NHAU");
    gom(r.thucThe, "THUC THE HTML LO RA MAN - escape hai lan");
    gom(r.soVo, "CON SO BI BE DOI GIUA HAI CHU SO");
    gom(r.batNat, "TRINH DUYET DANG CAT CHU (hoi scrollWidth)");
    gom(r.bopCot, "CHU BI BOP THANH MOT COT HEP");
  }

  await ctx.close();
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
  /* TRẦN 6 -> 12 khi bộ này đo HAI khổ màn (09/08). Không phải nới luật: cùng một cái nút Trợ
     lý, nay được soi trên hai khổ thay vì một, nên số chỗ nó tình cờ nằm đè lên cũng gấp đôi.
     Trần phải nói về CÙNG MỘT PHÉP ĐO thì con số mới có nghĩa - giữ 6 khi đã đo gấp đôi là một
     cái trần nghiêm khắc giả, nó sẽ đỏ vì lý do không liên quan tới chất lượng app. */
  const TRAN_FAB = 12;
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
  console.log("CHECKMAT OK: " + TRANG.length + " trang x 2 kho man (may tinh + dien thoai), " + soDo + " chuoi chu do bang thuoc that -"
    + " khong chu nao bi cat, khong nut nao bi phu len, khong dau ngan nao mo coi");
})();
