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
/* V2 24/08 - MỘT TRANG CÓ NHIỀU NẤC THÌ ĐI QUA MỘT NẤC LÀ ĐI QUA MỘT PHẦN.
   Anh Luân gửi ảnh màn Chấm bài: *"thiết kế nó bị co cụm lại thì phải"* - mọi tên học viên,
   chip trạng thái và giờ nộp đều cụt, ô điểm hiện "Banc" thay vì "Band 0-9", nửa phải màn hình
   bỏ trống (đo ra chỉ dùng 63% bề ngang ở khổ 1440px).
   Bộ này CÓ đi qua trang `baitap` và CÓ phép `batNat` hỏi thẳng trình duyệt "đang cắt chữ chỗ
   nào" - nhưng nó xanh, vì `go("baitap")` chỉ mở nấc mặc định "Giao bài". Ba nấc còn lại
   (Thu bài · Chấm bài · Chờ chấm) là BA BỐ CỤC KHÁC HẲN, và chưa nấc nào từng bị đo.
   Đây là lần thứ BA cùng một cái bẫy, chỉ đổi hình: 06/08 thiếu TRANG `viec` · 09/08 thiếu
   TRANG `bangcong` · nay thiếu NẤC bên trong một trang đã có tên trong danh sách. Hai lần trước
   em kết luận "danh sách phải phủ đủ kiểu bố cục" rồi vẫn đếm bố cục theo TÊN TRANG.
   *Một trang có tên trong danh sách không có nghĩa là mọi thứ trang ấy vẽ ra đều được nhìn.*
   Mục nào cần đứng ở một chỗ cụ thể thì khai `dat` - câu lệnh chạy ngay trước `go()`. */
const TRANG = ["banlam","tuyensinh","hoctap","banglop","cskh","thanhtoan","hocvien",
               "giaoviec","duyet","baocao","nhansu","khac","canhan","settings","viec",
               "bangcong","giangvien","baitap","lichtuan","tracuu",
  /* Màn Điểm danh: cùng dùng luật `.rost .rn{flex:0 0 300px}` với màn Chấm bài, nên hai màn phải
     đo CÙNG NHAU - luật ấy đúng cho màn này (tên + một chip ngắn) mà bóp chết màn kia. */
  {k: "diemdanh", ten: "diemdanh"},
  {k: "baitap", ten: "baitap/thu",     dat: "window.BTMODE='thu'"},
  {k: "baitap", ten: "baitap/cham",    dat: "try{var _c=(DL.DL13||[]).filter(function(x){return x.class_id})[0];if(_c)window.BTCLASS=_c.class_id}catch(e){} window.BTMODE='cham'"},
  {k: "baitap", ten: "baitap/chocham", dat: "window.BTMODE='chocham'"},
  /* ═══ V2 25/08 - 31 TRANG CHƯA TỪNG BỊ ĐO HÌNH HỌC ═══════════════════════════════════════════
     Audit trọn 9 mảng: đếm ra bộ này chỉ đi qua **19 trên 52 trang** trong `RENDER`. Ba lần trước
     bài học đều được ghi là "danh sách phải phủ đủ KIỂU BỐ CỤC" - nhưng "đủ kiểu bố cục" là một
     câu tự trấn an không kiểm chứng được, còn "33 trang chưa ai nhìn" là một con số.
     Chạy thử với danh sách mở rộng: **24 chỗ đỏ**, trong đó 21 chỗ thật đã vá trong lượt này
     (dải chặng tràn khỏi cột · nhãn chặng cắt chữ · tên trong thẻ chọn người · ô chọn tuần ·
     câu mời ở ô hỏi Trợ lý) và 3 chỗ là LỖI CỦA CHÍNH THƯỚC (ô tích bị đo bề rộng chữ · link
     trôi hai dòng bị chấm là "bị phủ lên").
     *Một danh sách "các trang chính" không có con số đi kèm thì nó là một lời hứa, không phải
     một phạm vi.*
     26/08 - HAI TRANG `hanhtrinh` VÀ `chang` NAY ĐÃ VÀO DANH SÁCH. Chúng bị rút ra hôm 25/08 vì
     `hanhtrinh` báo hai chữ đè nhau 18x14px mà em sửa BỐN lần theo chiều ngang đều không suy
     suyển - và vì chưa hiểu cơ chế nên không khai ngoại lệ (khai ngoại lệ cho một thứ mình chưa
     hiểu là tắt đèn chứ không phải dọn nhà).
     Hôm nay đo tới nơi thì ra **app không sai một chỗ nào**: đứa con `<i>5/7</i>` trôi ra ngoài
     khối cha `.msnh` 73px và rơi lên thẻ của cột bên cạnh, nhưng cha có `overflow:hidden` nên
     phần trôi ra ấy bị cắt sạch - mắt không thấy một pixel nào. Cái sai nằm ở phép đo: nó đọc
     `getBoundingClientRect()` mà không hỏi tổ tiên có cắt hay không. Đã dạy `nhinThay` hỏi câu
     đó (xem `biCatHet`), và hai trang này quay lại danh sách. */
  "ban","dsphuhuynh","socamket","hoidap","giaoan","hosogv","hosonv","hosokhoa","buoihoc","baoluu",
  "dashboard","review","ghinhan","chay","hoso","banwow","banggiao","xeplop","test",
  "tuvan","wow","dsthanhtoan","gvdp","phong","tinnhan","magioithieu","khieunai","ketqua",
  "lichwow","banglop","hanhtrinh","chang"];

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

  for (const M of TRANG.map(x => typeof x === "string" ? {k: x, ten: x} : x)) {
    const k = M.ten;
    const r = await page.evaluate(async ([k, CAT_OK_SRC, DAT]) => {
      const CAT_OK = CAT_OK_SRC.map(x => ({khop: new RegExp(x.k, x.f), ly: x.ly}));
      if (DAT && DAT.dat) { try { (0, eval)(DAT.dat); } catch (e) { return {loi: "khong dat duoc nac: " + e.message}; } }
      try { go(DAT ? DAT.k : k); } catch (e) { return {loi: "khong mo duoc trang"}; }
      await new Promise(r => setTimeout(r, 340));
      const c = document.getElementById("content");
      if (!c) return {loi: "khong co than trang"};
      const ra = {cat: [], che: [], hep: [], moCoi: [], deNhau: [], thucThe: [], soVo: [], batNat: [], bopCot: [], coCum: [], apSat: [], dem: 0};

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
        /* Ô TÍCH / Ô TRÒN: `value` của chúng là MÃ GỬI ĐI, không phải chữ hiện ra màn.
           Bẫy đo được 25/08 khi mở rộng danh sách trang: `<input type="checkbox" class="bgck"
           value="L-2026-00006">` bị chấm là "cắt chữ, thiếu 66px" - trong khi ô tích rộng 16px
           là đúng và không ai đọc cái mã trong nó. Bốn dòng đỏ trên trang Bàn giao lead, cả bốn
           đều oan.
           *Đo bề rộng chữ của một ô thì phải hỏi trước: ô này CÓ hiện chữ ra không.* */
        if (el.tagName === "INPUT" && /^(checkbox|radio|hidden|file|range|color)$/i.test(el.type || "")) return;
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
        /* ═══ 25/08 - LINK TRÔI NHIỀU DÒNG THÌ HỘP CỦA NÓ LÀ HỘP GỘP ══════════════════════════
           Một `<a>` inline trải hai dòng thì `getBoundingClientRect` trả về hộp TRÙM cả hai dòng,
           kể cả phần trống ở cuối dòng một. Điểm giữa của cái hộp ấy rơi vào khoảng giữa hai
           dòng - nơi phần tử ĐỨNG SAU nó đang nằm - nên `elementFromPoint` trả về phần tử kia và
           M2 kết luận "bị phủ lên, không bấm được", trong khi link bấm bình thường.
           Bẫy này đã được ghi ngay trong file này cho M5 (*"Số MỌI CẶP PHẦN TỬ: bắt oan 4 chỗ ở
           trang Báo cáo"*) và có sẵn cách chữa - `getClientRects().length !== 1` - nhưng chỉ gắn
           cho M5, không gắn cho M2. Đo được 25/08 trên trang GV dự phòng: link "Foundation PLA
           T7-CN sáng" bị chấm là bị `span.mut "buổi 9"` phủ lên.
           *Ghi lại một cái bẫy ở một chỗ không làm nó biến mất ở chỗ khác - phải đi gắn cho mọi
           phép đo đang đứng dưới cùng cái bẫy ấy.* */
        if (el.getClientRects().length !== 1) return;
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
        /* ═══ 26/08 - "CÓ TOẠ ĐỘ" KHÔNG CÓ NGHĨA LÀ "HIỆN RA" ═════════════════════════════════════
           Việc tồn treo từ 25/08: trên `hanhtrinh` có hai chữ đè nhau **18x14px** mà em sửa BỐN
           lần theo chiều ngang đều không suy suyển - và vì chưa hiểu cơ chế nên KHÔNG khai ngoại
           lệ, để nguyên đó cùng hai trang bị rút khỏi danh sách.
           Đo lại cho tới nơi thì ra: `<i>5/7</i>` nằm ở **x=1831**, trong khi khối cha `.msnh`
           của chính nó chỉ tới **x=1758**. Đứa con đã trôi ra ngoài cha 73px và rơi đúng lên thẻ
           của **cột kanban bên cạnh** (`cungStrip: false` - hai thẻ khác nhau, hai cột khác nhau).
           Mà `.msnh` có `overflow:hidden`, nên phần trôi ra ấy **bị cắt sạch, mắt không thấy một
           pixel nào**. `getBoundingClientRect()` vẫn trả về toạ độ chưa cắt - đó là hợp đồng của
           nó, không phải lỗi của nó.
           Nên **app không sai một chỗ nào**: bốn bản vá kia không ăn vì không có gì để vá.
           *Một phép đo hình học đọc toạ độ mà không hỏi tổ tiên có cắt hay không thì nó đang đo
           một thế giới rộng hơn cái màn hình - và mọi thứ trôi ra ngoài đều thành "đè nhau".*
           CHỈ tính `hidden` và `clip` - hai thứ cắt VĨNH VIỄN. `auto`/`scroll` thì cuộn một cái
           là thấy, chỗ hỏng ở đó vẫn là chỗ hỏng thật.
           Luật "chữ bị cắt" (`batNat`) KHÔNG đi qua cửa này, nên chỗ nào cắt chữ thật vẫn bị bắt
           như cũ - đây chỉ thôi coi phần đã bị cắt là "đang hiện". */
        /* DỪNG Ở KHỐI CUỘN ĐẦU TIÊN - bản đầu của phép này KHÔNG dừng, và nó suýt giết cả ba luật
           đang dùng `nhinThay` mà vẫn in ra màu xanh.
           Bẫy: vỏ app có một khối cao đúng bằng màn hình mang `overflow:hidden`, còn phần cuộn
           thật nằm ở `#content` (`overflow-y:auto`) BÊN TRONG nó. Cứ leo lên mà cắt thì mọi thứ
           nằm dưới nếp gấp - tức gần hết trang - đều bị chấm là "đã bị cắt, không nhìn thấy".
           Đo được lúc thử phá: số lá chữ trên `hanhtrinh` tụt từ **738 xuống 59**, mà bảng kết
           quả vẫn xanh.
           *Một phép đo bị nới lỏng thì nó không kêu lên - nó chỉ im lặng hơn trước, và im lặng
           thì trông y hệt như sạch.*
           Luật đúng: gặp khối CUỘN ĐƯỢC trên trục nào thì thôi cắt theo trục ấy - cuộn một cái
           là thấy, nên đó không phải "cắt vĩnh viễn". Chỉ `hidden`/`clip` trên một khối mà mình
           gặp TRƯỚC khối cuộn mới thật sự cắt mất. */
        const biCatHet = el => {
          const r = el.getBoundingClientRect();
          let x1 = r.left, y1 = r.top, x2 = r.right, y2 = r.bottom;
          let catX = true, catY = true;
          for (let p = el.parentElement; p && p !== document.body && (catX || catY); p = p.parentElement) {
            const pc = getComputedStyle(p);
            const pr = p.getBoundingClientRect();
            if (catX) {
              if (/auto|scroll/.test(pc.overflowX)) catX = false;
              else if (/hidden|clip/.test(pc.overflowX)) { x1 = Math.max(x1, pr.left); x2 = Math.min(x2, pr.right); }
            }
            if (catY) {
              if (/auto|scroll/.test(pc.overflowY)) catY = false;
              else if (/hidden|clip/.test(pc.overflowY)) { y1 = Math.max(y1, pr.top); y2 = Math.min(y2, pr.bottom); }
            }
            if (x2 - x1 <= 1 || y2 - y1 <= 1) return true;
          }
          return false;
        };
        const nhinThay = el => {
          const cs = getComputedStyle(el);
          if (cs.display === "none" || cs.visibility === "hidden" || +cs.opacity === 0) return false;
          if (cs.position === "absolute" || cs.position === "fixed") return false;
          if (el.getClientRects().length !== 1) return false;
          const r = el.getBoundingClientRect();
          if (r.width <= 0 || r.height <= 0) return false;
          return !biCatHet(el);
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
        /* ── M9: CO CỤM - CẮT CHỮ TRONG KHI CHÍNH HÀNG ẤY ĐANG BỎ TRỐNG CHỖ ────────────────
           Anh Luân 24/08, ảnh màn Chấm bài: *"thiết kế nó bị co cụm lại thì phải"*.
           Ba phép đo cũ đều không nói được cái sai này, và mỗi cái có lý do riêng:
            · `batNat` thấy CHỮ BỊ CẮT nhưng không biết bên cạnh còn thừa chỗ - nó báo y hệt một
              màn thật sự chật, nên đọc xong không biết nên nới hay nên rút gọn nội dung;
            · M3 CÓ hỏi "hàng chứa nó còn thừa chỗ không", nhưng nó chỉ ngước lên đúng một nấc
              `.sp,.tbar,.tbtren,.fld,.phead` - trong một dòng danh sách, cha của ô là chính
              cái dòng, không mang lớp nào trong số đó, nên vế "còn thừa" không bao giờ chạy;
            · M6 hỏi "chữ bị bóp thành cột hẹp" - ở đây chữ không xuống dòng, nó bị CẮT CỤT.
           Gốc của lỗi: một dòng flex mà tổng bề rộng các cột nhỏ hơn hẳn bề rộng dòng thì phần
           dôi ra không rơi vào cột nào - nó nằm trơ ở cuối dòng, trong khi từng cột vẫn cụt chữ.
           Đo được vì cả hai vế đều là số: hỏi trình duyệt xem có cột nào đang cắt chữ, rồi lấy
           bề rộng dòng trừ đi tổng bề rộng các cột và các khe.
           *Cắt chữ vì hết chỗ là một quyết định; cắt chữ trong khi còn chỗ là một chỗ hỏng.* */
        than.querySelectorAll(".rost, .lrow, .obrow").forEach(hang => {
          const con = [...hang.children].filter(x => {
            const r2 = x.getBoundingClientRect();
            return r2.width > 0 && r2.height > 0 && getComputedStyle(x).position === "static";
          });
          if (con.length < 2) return;
          /* Dòng đã XUỐNG HÀNG (khổ hẹp bật `flex-wrap:wrap`) thì cộng bề rộng theo hàng ngang
             là vô nghĩa - lúc ấy các cột nằm chồng lên nhau theo chiều dọc. */
          const dinh = con.map(x => x.getBoundingClientRect().top);
          if (Math.max(...dinh) - Math.min(...dinh) > 6) return;
          /* Có cột nào đang cắt chữ không - hỏi cả chính cột lẫn thứ nằm trong nó. */
          const cut = [];
          con.forEach(x => {
            [x, ...x.querySelectorAll("*")].forEach(el => {
              if (el.children.length) return;
              if ((el.textContent || "").trim().length < 4) return;
              const d = el.scrollWidth - el.clientWidth;
              if (d > 1) cut.push('"' + (el.textContent || "").trim().slice(0, 20) + '" thieu ' + d + "px");
            });
          });
          if (!cut.length) return;
          const cs = getComputedStyle(hang);
          const trong = hang.getBoundingClientRect().width
                      - parseFloat(cs.paddingLeft || 0) - parseFloat(cs.paddingRight || 0);
          const khe = (parseFloat(cs.columnGap) || parseFloat(cs.gap) || 0) * (con.length - 1);
          const dung = con.reduce((s, x) => s + x.getBoundingClientRect().width, 0);
          const thua = trong - dung - khe;
          /* 60px: đủ để không chạm oan một dòng chỉ dôi vài pixel làm tròn, mà vẫn bắt được ca
             đã cắn (dôi 415px trên bề ngang 1124px). */
          if (thua < 60) return;
          ra.coCum.push("dong ." + (String(hang.className || "").split(" ")[0]) + " bo trong " +
            Math.round(thua) + "px/" + Math.round(trong) + "px ma van cat chu: " +
            [...new Set(cut)].slice(0, 3).join(" · "));
        });
        /* ── M10: NỘI DUNG ÁP SÁT VIỀN PANEL ────────────────────────────────────────────────
           Anh Luân 25/08: *"Chỉ số của riêng bạn, và cái ô bên dưới bị tràn ra viền em ko thấy à"*.
           Đo ra: thẻ cuối của dải có mép phải ở 1416px, viền trong của panel ở 1417px - cách nhau
           đúng MỘT pixel, viền thẻ chồng lên viền panel. Nhìn ra đúng như tràn.
           **Em đã đo hai lần và cả hai lần đều báo XANH**, vì cả hai lần em hỏi *"có tràn RA
           NGOÀI panel không"* - và câu trả lời là không, thẻ dừng đúng ở mép. Câu phải hỏi là
           *"có ĐỦ CÁCH mép không"*.
           *Hỏi "có vượt qua không" thì cái gì dừng đúng ở vạch cũng đạt; mà dừng đúng ở vạch,
           với mắt người, là đã chạm vào rồi.*
           Gốc của ca ấy: dải thẻ được đặt làm con TRỰC TIẾP của `.panel`, bỏ qua `.pbody` - cái
           vỏ giữ đệm. Luật này canh HẬU QUẢ (áp sát viền) chứ không canh cách viết (thiếu
           `.pbody`), nên nó bắt được cả những cách bỏ đệm khác chưa ai nghĩ ra. */
        than.querySelectorAll(".panel").forEach(pan => {
          const pr = pan.getBoundingClientRect();
          if (pr.width < 40 || pr.height < 20) return;
          const cs0 = getComputedStyle(pan);
          /* Bảng cuộn ngang và ảnh nền cố ý chạm mép - hai thứ ấy không đi qua `.pbody`. */
          [...pan.children].forEach(con => {
            if (con.classList && (con.classList.contains("ph") || con.classList.contains("tbwrap"))) return;
            /* BẢNG thì áp mép là CỐ Ý - vạch kẻ của bảng chạy trọn bề ngang panel mới thành một
               khối liền, và `.tbwrap` (bảng cuộn ngang) đã được miễn ngay dòng trên vì đúng lý do
               ấy. Miễn theo LÝ DO - "khối này là một cái bảng" - chứ không theo TÊN LỚP: hai chỗ
               còn lại (`.giapn` ở Bảng công, khối nhóm việc ở Việc hôm nay) không mang lớp
               `tbwrap` nhưng bên trong vẫn là `<table>`.
               *Miễn theo tên lớp thì mỗi lần ai đó dựng cùng một thứ dưới một cái tên khác là
               phải khai lại; miễn theo lý do thì khai một lần.* */
            if (con.querySelector && con.querySelector("table")) return;
            const cr = con.getBoundingClientRect();
            if (cr.width < 40 || cr.height < 10) return;
            /* KHOẢNG THỞ = phần thụt vào CỘNG đệm của chính khối ấy.
               Bản đầu chỉ đo phần thụt vào và ra 96 chỗ đỏ - gần hết là `.pbody`, mà `.pbody`
               THEO THIẾT KẾ ôm trọn bề ngang panel và giữ đệm 6px Ở BÊN TRONG nó. Đo mép ngoài
               của nó thì bao giờ cũng ra 0.
               *Khoảng thở không nằm ở chỗ cái hộp bắt đầu - nó nằm ở chỗ CHỮ bắt đầu.* */
            const csc = getComputedStyle(con);
            const traiHo = (cr.left - pr.left - parseFloat(cs0.borderLeftWidth || 0)) + parseFloat(csc.paddingLeft || 0);
            const phaiHo = (pr.right - cr.right - parseFloat(cs0.borderRightWidth || 0)) + parseFloat(csc.paddingRight || 0);
            /* 3px: đủ để không chạm oan một khối cố ý sát mép vài pixel, mà vẫn bắt được ca
               đã cắn (1px). */
            if (traiHo >= 3 && phaiHo >= 3) return;
            const t0 = (con.textContent || "").replace(/\s+/g, " ").trim().slice(0, 26);
            ra.apSat.push('"' + t0 + '" (.' + (String(con.className || "").split(" ")[0] || con.tagName) +
              ") cach vien panel " + Math.round(traiHo) + "px trai / " + Math.round(phaiHo) + "px phai");
          });
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
    }, [k, CAT_OK.map(x => ({k: x.khop.source, f: x.khop.flags, ly: x.ly})), M]);

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
    gom(r.coCum, "CO CUM - cat chu trong khi hang con bo trong cho");
    gom(r.apSat, "AP SAT VIEN PANEL - noi dung khong co khoang tho");
  }

  /* ═══ M8 · CHA PHẢI NỔI HƠN CON TRÊN MENU (anh Luân 18/08, kèm ảnh: *"menu thiết kế xấu quá,
     theo nhóm mà nhóm lại thiếu nổi bật hơn bên trong"*) ══════════════════════════════════════
     Không bộ kiểm nào bắt được, vì đây không phải lỗi CẮT CHỮ hay CHE NHAU - nó là lỗi THỨ BẬC:
     hai cấp cùng viết hoa, cùng đậm 800, và cấp CON lại sáng hơn cấp CHA (đo ra 162 so với 145).
     Đo được bằng máy vì độ sáng là một con số: lấy `getComputedStyle` của nhãn nhóm và nhãn kệ
     rồi so luma. *Một thứ bậc mà mắt đọc ngược thì cái menu không còn là bản đồ nữa.*
     Đo trên khổ máy tính thôi - thứ bậc màu không đổi theo khổ màn. */
  if (V.n === "maytinh") {
    const tb = await page.evaluate(() => {
      function luma(c){const m=String(c).match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if(!m)return null;const a=m[4]===undefined?1:+m[4];
        return (0.2126*+m[1]+0.7152*+m[2]+0.0722*+m[3])*a;}
      /* Mở MỌI nhóm có kệ để cả hai cấp cùng nằm trên màn. */
      try{(NAVKE?Object.keys(NAVKE):[]).forEach(g=>{
        const el=[...document.querySelectorAll(".navlbl")].find(x=>(x.textContent||"").trim().toUpperCase().indexOf(g.toUpperCase())===0);
        if(el&&!el.classList.contains("open"))el.click();})}catch(e){}
      const lb=[...document.querySelectorAll(".navlbl")];
      const ke=[...document.querySelectorAll(".navke")];
      if(!lb.length||!ke.length)return null;
      function tb2(a){let s=0,n=0;a.forEach(x=>{const v=luma(getComputedStyle(x).color)*(+getComputedStyle(x).opacity||1);
        if(v!=null){s+=v;n++}});return n?Math.round(s/n):null}
      /* Thut le va khoang doc: do HOP CHU chu khong do hop phan tu - khoang trang ma MAT nhin
         thay nam giua chu voi chu, con rect cua phan tu da nuot ca padding vao trong. Thuoc do
         theo phan tu luc nao cung ra 0 va noi "khong co khoang cach" trong khi mat thay co. */
      function hopChu(el){
        if(!el)return null;
        const rg=document.createRange(),w=document.createTreeWalker(el,NodeFilter.SHOW_TEXT);
        let n,t=null,b2=null,x=null;
        while((n=w.nextNode())){ if(!String(n.nodeValue||"").trim())continue; rg.selectNode(n);
          const r=rg.getBoundingClientRect(); if(!r.width)continue;
          if(t===null||r.top<t)t=r.top; if(b2===null||r.bottom>b2)b2=r.bottom;
          if(x===null||r.left<x)x=r.left; }
        return t===null?null:{t:t,b:b2,x:x};
      }
      /* Ba cap tren mot nhom CO KE: ten nhom -> ten ke -> muc dau tien cua ke ay. */
      let thut=null,gan=null;
      for(const k1 of ke){
        const grp=k1.closest(".navgrp"); if(!grp)continue;
        const lb1=grp.previousElementSibling; if(!lb1||!lb1.classList.contains("navlbl"))continue;
        let m1=k1.nextElementSibling;
        while(m1&&!m1.classList.contains("navitem"))m1=m1.nextElementSibling;
        if(!m1)continue;
        const a1=hopChu(lb1),a2=hopChu(k1),a3=hopChu(m1);
        if(!a1||!a2||!a3)continue;
        /* MEP TRAI NOI DUNG, khong phai mep trai CHU: mat doc thut le theo thu NHIN THAY dau
           tien tren dong, ma dong cua mot muc menu bat dau bang cai ICON. Thuoc ban dau chi do
           chu nen bao "40/52/52 - da co bac" trong khi anh Luan nhin thay icon nam ngoai cung
           ben trai va noi "thut le van sai phai ko?".
           *Do thut le thi phai do tu thu dau tien mat cham toi, khong phai tu chu.*
           Giu CA HAI phep do: mot con so dung theo phep do nay ma sai theo phep do kia thi chua
           phai con so dung. */
        function xND(el){let x=null;
          el.querySelectorAll("*").forEach(c=>{const r=c.getBoundingClientRect();
            if(r.width<1||r.height<1)return; if(x===null||r.left<x)x=r.left});
          const h2=hopChu(el); if(h2&&(x===null||h2.x<x))x=h2.x;
          return x===null?null:Math.round(x)}
        if(thut===null)thut={nhomC:Math.round(a1.x),keC:Math.round(a2.x),mucC:Math.round(a3.x),
          nhom:xND(lb1),ke:xND(k1),muc:xND(m1)};
        const tr0=k1.previousElementSibling?(hopChu(k1.previousElementSibling)||{b:a1.b}).b:a1.b;
        const tren=Math.round(a2.t-tr0), duoi=Math.round(a3.t-a2.b);
        if(gan===null||tren-duoi<gan.chenh)gan={tren:tren,duoi:duoi,chenh:tren-duoi};
      }
      return {nhom:tb2(lb), ke:tb2(ke), soKe:ke.length, thut:thut, gan:gan};
    });
    if (tb && tb.nhom != null && tb.ke != null) {
      soDo += 2;
      if (tb.nhom <= tb.ke)
        do_.push("M8 THU BAC MENU NGUOC: ten NHOM sang " + tb.nhom + ", ten KE sang " + tb.ke
          + " - cap cha phai noi hon cap con (" + tb.soKe + " ke tren menu)");
      /* M8b - THUT LE PHAI CO BAC DOC RA DUOC. Do that truoc khi sua: nhom 40 / ke 44 / muc 52 -
         bac cha->ke chi 4px, mat khong doc ra mot bac 4px. Doi >= 8px, va ten ke khong duoc thut
         sau hon chinh muc no cai quan. */
      if (tb.thut) {
        soDo += 3;
        const bac = tb.thut.ke - tb.thut.nhom;
        if (bac < 8) do_.push("M8b THUT LE MENU KHONG CO BAC (do theo NOI DUNG): ten nhom o "
          + tb.thut.nhom + "px, ten ke o " + tb.thut.ke + "px - chenh " + bac
          + "px, mat khong doc ra (can >= 8px)");
        /* Ten ke phai THANG COT voi mep trai cua muc no cai quan - lech qua 4px la mot cot go ghe. */
        if (Math.abs(tb.thut.ke - tb.thut.muc) > 4)
          do_.push("M8b TEN KE KHONG THANG COT VOI MUC no cai quan: ke " + tb.thut.ke
            + "px, muc " + tb.thut.muc + "px");
        /* Va doc theo CHU cung khong duoc nguoc: chu ten ke nho ra trai hon chu ten nhom thi mat
           van doc ra "con khong thut hon cha", du mep noi dung da dung. */
        if (tb.thut.keC < tb.thut.nhomC)
          do_.push("M8b CHU TEN KE NHO RA TRAI HON CHU TEN NHOM: ke " + tb.thut.keC
            + "px < nhom " + tb.thut.nhomC + "px");
      }
      /* M8c - LUAT GAN-XA. Mot tieu de thuoc ve phan NAM DUOI no, nen khoang TREN phai lon hon
         khoang DUOI. Do ra 15/15 (bang nhau) thi mat khong biet no thuoc ve ai - dung cai anh
         Luan goi la "padding top, bottom chua hop ly".
         *Cai gi dung gan nhau thi mat doc la mot nhom - khoang trang chinh la dau ngoac.* */
      if (tb.gan) {
        soDo++;
        if (tb.gan.tren <= tb.gan.duoi)
          do_.push("M8c TEN KE DINH DEU HAI BEN: khoang TREN " + tb.gan.tren + "px, khoang DUOI "
            + tb.gan.duoi + "px - tieu de thuoc ve phan nam DUOI no, khoang tren phai lon hon");
      }
    }
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
