/* _checkroi.js - MENU DÀI RA CÓ LÀM NGƯỜI TA RỐI KHÔNG.
 *
 * VÌ SAO CÓ FILE NÀY. V2 dỡ 6 hub thành 25 trang nghiệp vụ. Đó là điều anh Luân muốn - *"Mỗi
 * nghiệp vụ 1 trang... nó có thẻ, có chip lọc, có cảnh báo của riêng nó"* - nhưng anh đặt kèm
 * đúng một điều kiện: *"miễn là không rối"*.
 *
 * Cái giá phải trả của việc dỡ hub là THANH MENU DÀI RA. Sáu dòng thành hai mươi lăm dòng. Với
 * người có phạm vi rộng, một thanh menu 40 mục cuộn hai màn là một kiểu rối khác - không phải
 * "một nghiệp vụ làm được ở nhiều nơi" như V1, mà là "không biết nghiệp vụ của mình nằm dòng nào".
 * Đổi một kiểu rối lấy một kiểu rối khác thì không phải là tiến.
 *
 * Bốn phép đo, tất cả đóng vai NGƯỜI CÓ THẬT rồi dựng THẬT thanh menu của họ:
 *   R1  MENU DÀI BAO NHIÊU - đếm mục thật sự vẽ ra cho từng chức danh. Có trần, quá là đỏ.
 *   R2  MỤC MỞ RA TRỐNG - mục có trên menu mà mở ra không có gì. Mỗi mục như vậy là một lần
 *       bị lừa, và menu càng dài thì càng dễ đẻ ra loại này.
 *   R3  NHÓM CÓ QUÁ NHIỀU MỤC KHÔNG - một nhóm 15 mục thì mắt không quét được. Chia nhóm là
 *       cách duy nhất giữ cho một danh sách dài vẫn đọc được.
 *   R4  TÊN MỤC CÓ PHÂN BIỆT ĐƯỢC VỚI NHAU KHÔNG - hai mục cùng nhóm mà tên na ná nhau thì
 *       người ta phải bấm thử mới biết. Đo bằng tiền tố chung.
 *
 * ĐO BẰNG SỐ, KHÔNG BẰNG CẢM GIÁC. Mỗi trần dưới đây là một CÁI CHỐT KÉO XUỐNG (cùng lối
 * `_checkmien` đã dùng): quá số đang có là đỏ; cải thiện được thì hạ trần xuống đúng số mới,
 * không bao giờ nâng lên.
 *
 * Chạy: ITTS_OUT=<out> node _checkroi.js
 */
const FS = require("fs"), PATH = require("path");
const OUT = PATH.resolve(process.env.ITTS_OUT || __dirname);
const APP = process.env.ITTS_APP || PATH.join(__dirname, "_APP.js");

/* ---- trần: số đo được lúc dựng bộ này. Sửa được chỗ nào thì HẠ xuống, không nâng lên. ---- */
/* 58 = SỐ ĐO ĐƯỢC của chức danh rộng nhất (CEO / Quản trị viên) ngay sau khi dỡ hub. Ghi lại
   con số thật chứ không ghi con số mình mong muốn - một cái trần đặt thấp hơn thực tế thì lần
   chạy nào cũng đỏ, và một bộ kiểm đỏ mãi thì người ta tắt nó đi.
   ĐÂY LÀ MỘT CHỐT KÉO XUỐNG: nó đóng băng con số hiện tại để menu không dài thêm trong im lặng.
   VIỆC TỒN đã biết: nhóm "Tra cứu" đang chiếm 18/58 mục - mười tám cuốn sổ chỉ để xem. Gom
   chúng sau MỘT cửa "Tra cứu" (một trang liệt kê 18 sổ) sẽ hạ trần xuống khoảng 41 mà KHÔNG
   phạm RB1: luật "một nghiệp vụ một cửa ghi" nói về CỬA GHI, còn đây là sổ chỉ-đọc, không có
   thao tác ghi nào. Làm xong thì hạ TRAN_MUC xuống đúng số mới.

   ═══ 08/08: TRẦN NÀY BỊ NÂNG 58 -> 60. LẦN DUY NHẤT, VÀ ĐÂY LÀ LÝ DO ═══════════════════════
   Nâng một cái chốt kéo xuống là chuyện phải khai thẳng, không được sửa lặng lẽ. Hai mục thêm
   vào đều vá một lỗi "vào được mà không có đường tới / không có đường về":
     · `baitap` - trang "Giao & chấm Bài tập" có thật, đầy đủ, mà khai `hide:1` và không chức
       danh nào ngoài quản trị được xem; trong khi bảng cửa ghi khai nó thuộc giáo viên và ACA,
       và nhịp ngày của giáo viên nhắc họ "12 bài chờ chấm". **LUẬT CỨNG SỐ 0: SOP mô tả, app có
       trang, người phải làm không có lối vào - đó là SÓT, và sót thì không có quyền bỏ.**
     · `duyet` - "Chờ duyệt & quyết định", trang mà năm chức danh có dòng nhịp trỏ vào, chưa bao
       giờ đứng trên cây menu. Bấm vào được, nhưng cả sidebar tối thui và không có đường quay
       lại - đúng con bệnh anh Luân bắt ba lần: *"a tìm trên sidebar ko thấy"*.
   Luật "thêm thì được, bớt thì không" đứng CAO HƠN cái trần này; trần chỉ để menu không dài
   thêm trong IM LẶNG. Hai mục này không im lặng.
   ═══ VÀ NGAY TRONG NGÀY 08/08 PHẦN NỢ ẤY ĐÃ TRẢ: 60 -> 45 ════════════════════════════════
   Gom xong nhóm Tra cứu (16 cuốn sổ chỉ-đọc vào sau một cửa `tracuu`, xem ghi chú ở bảng PAGES
   của `gen_v5.py`), CEO còn **44 mục** - thấp hơn cả mốc 58 trước khi nâng. Không sổ nào bị xoá,
   và số cú bấm để tới một cuốn sổ KHÔNG tăng: nhóm "Tra cứu" vốn gập mặc định nên vẫn là hai cú.
   Nâng trần rồi trả lại trong cùng một ngày là cách duy nhất em thấy là lương thiện: nâng thì
   khai thẳng lý do, và trả thì trả bằng phép đo chứ không bằng lời hứa.
   Nợ còn lại: `academic_staff` và `academic_manager` đang 26 mục - nhóm chặng B của họ có 13 mục
   (lớp học, giáo án, bài tập, buổi hôm nay, lịch tuần, GV dự phòng, phòng học...). Đó là việc
   hằng ngày thật, không gom được như sổ tra cứu; muốn ngắn thì phải tách chặng, để dịp sau. */
/* ═══ 10/08: 44 -> 45, VÌ THÊM MỘT MÀN SOP ĐÃ MÔ TẢ MÀ APP BỎ SÓT ═══════════════════════
   Anh Luân đặt: *"mỗi người team wow có thể tự book lịch làm việc của mình... học viên có thể
   chọn dựa trên lịch này"*. Tra SOP thì đó không phải tính năng mới mà là một mảng SOP bỏ sót:
   SOP có sẵn màn "BẢNG TRỰC NV WOW - THEO THÁNG" và cả danh mục `enum_wow_slot_status`
   (nằm trong `ITTs_data.js` từ đầu, app dùng 0 lần). Thêm trang `lichwow` là TRẢ một món nợ
   SOP, không phải nhét thêm một mục cho vui.
   Đúng thủ tục mà chính đoạn trên đặt ra: trần chỉ để menu không dài thêm TRONG IM LẶNG - nâng
   thì phải khai thẳng lý do. Đây là lý do, và món nợ vẫn ghi: `academic_staff`/`academic_manager`
   còn 26 mục, muốn ngắn thì phải tách chặng. */
const TRAN_MUC   = 45;   /* mục menu của một chức danh */
const TRAN_NHOM  = 20;   /* mục trong MỘT nhóm */
const TRAN_TRONG = 2;    /* mục mở ra trống, trên toàn bộ chức danh */

/* Bộ khung DOM tối thiểu - y các bộ kiểm chuỗi khác. Neo đồng hồ TRƯỚC khi nạp app. */
const meta = (() => { try { return JSON.parse(FS.readFileSync(PATH.join(__dirname, "demo_data_big.json"), "utf8")).meta || {}; } catch (e) { return {}; } })();
(function neoDongHo() {
  const m = String(meta.anchor || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (!m) return;
  const T = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 9), +(m[5] || 0)).getTime();
  const D = Date;
  global.Date = class extends D {
    constructor(...a) { if (!a.length) super(T); else super(...a); }
    static now() { return T; }
  };
})();

function el() {
  const e = {innerHTML: "", style: {}, classList: {add(){}, remove(){}, toggle(){}, contains(){return false}},
             textContent: "", value: "", scrollTop: 0, dataset: {}, children: [],
             appendChild(){}, removeChild(){}, setAttribute(){}, removeAttribute(){},
             getAttribute(){return null}, addEventListener(){}, querySelector(){return null},
             querySelectorAll(){return []}, closest(){return null}, focus(){}, click(){},
             getBoundingClientRect(){return {x:0,y:0,width:0,height:0,top:0,left:0,right:0,bottom:0}}};
  return e;
}
const kho = {};
global.document = {
  getElementById(id) { return kho[id] || (kho[id] = el()); },
  createElement() { return el(); },
  querySelector() { return null }, querySelectorAll() { return [] },
  addEventListener() {}, body: el(), documentElement: el(),
};
global.window = global;
const ss = {}; const ls = {};
global.sessionStorage = {getItem: k => (k in ss ? ss[k] : null), setItem: (k, v) => { ss[k] = String(v) }, removeItem: k => { delete ss[k] }};
global.localStorage    = {getItem: k => (k in ls ? ls[k] : null), setItem: (k, v) => { ls[k] = String(v) }, removeItem: k => { delete ls[k] }};
global.location = {search: "", hash: "", pathname: "/", reload() {}};
global.history = {replaceState() {}, pushState() {}};
global.navigator = {userAgent: "node", clipboard: {writeText(){ return Promise.resolve() }}};
global.getComputedStyle = () => ({display: "block", getPropertyValue: () => ""});
global.matchMedia = () => ({matches: false, addEventListener(){}, addListener(){}});
global.requestAnimationFrame = f => setTimeout(f, 0);
global.alert = () => {}; global.confirm = () => true; global.prompt = () => "";

/* Nạp bằng `vm.runInThisContext` chứ KHÔNG bằng `new Function(...)()`: hàm ẩn danh có scope
   riêng nên mọi `var` của app nằm lại trong đó, ra ngoài hỏi `rows` là "not defined" - đo ra
   một app rỗng rồi tưởng app hỏng. Các bộ kiểm chuỗi khác đều dùng `runInThisContext`. */
try { require("vm").runInThisContext(FS.readFileSync(APP, "utf8")); }
catch (e) { console.log("CHECKROI DO: khong nap duoc " + APP + " - " + String(e.message).slice(0, 120)); process.exit(1); }

const do_ = [], ghi = [];

/* Đóng vai bằng ĐÚNG CỬA VÀO của app. `applyScope` mới cắt phạm vi dữ liệu mà chưa đặt danh
   tính - dùng nó là đo ra 0 rồi đổ oan cho app (bẫy đã cắn ở `_checkreset` và `_checktour`). */
function dongVai(sid) { try { gateEnter(sid); } catch (e) {} }

let nguoi = [];
try {
  nguoi = rows("DL01").filter(s => staffActive(s));
} catch (e) { console.log("CHECKROI DO: khong doc duoc DL01"); process.exit(1); }

/* Mỗi CHỨC DANH một người đại diện - đo theo chức danh chứ không đo 36 người, vì phạm vi menu
   là của chức danh. */
const theoVai = {};
nguoi.forEach(s => { const v = String(s.role || ""); if (v && !theoVai[v]) theoVai[v] = s; });
const vais = Object.keys(theoVai);

let maxMuc = 0, maxNhom = 0, soTrong = 0;
const bangDai = [];

vais.forEach(v => {
  const s = theoVai[v];
  dongVai(s.staff_id);
  let cay = [];
  try { cay = navCay(); } catch (e) { do_.push(v + ": khong dung duoc cay menu"); return; }

  /* Hỏi ĐÚNG thứ app vẽ ra: mục nào `navVis` cho phép mới thật sự có trên màn. */
  const nhom = [];
  cay.forEach(g => {
    const co = (g.items || []).filter(k => { try { return navVis(k); } catch (e) { return false } });
    if (co.length) nhom.push({g: g.g, items: co});
  });
  const tong = nhom.reduce((a, x) => a + x.items.length, 0);
  const nhomTo = nhom.reduce((a, x) => Math.max(a, x.items.length), 0);
  maxMuc = Math.max(maxMuc, tong);
  maxNhom = Math.max(maxNhom, nhomTo);
  bangDai.push({v, tong, nhom: nhom.length, to: nhomTo});

  /* R2 - mục mở ra TRỐNG. Vẽ THẬT rồi hỏi ba điều (luật đã rút ở `_checkngay`: chỉ hỏi `.empty`
     thì tố oan trang có nhiều danh sách mà một cái rỗng). */
  nhom.forEach(G => G.items.forEach(k => {
    if (/^chang[A-D]$/.test(k)) return;
    let h = "";
    try { CUR = k; h = (PBK[k] && PBK[k].ty === "list") ? renderList(k) : (RENDER[k] ? RENDER[k]() : ""); }
    catch (e) { do_.push(v + " · " + k + ": mo ra thi LOI - " + String(e.message).slice(0, 60)); return; }
    if (!h) return;
    const coEmpty = /class="empty"/.test(h);
    const coBang  = /<tbody|class="obcard|class="jrow|class="nrow/.test(h);
    const soKhac0 = (h.match(/>(\d+)</g) || []).some(x => +x.slice(1, -1) > 0);
    if (coEmpty && !coBang && !soKhac0) { soTrong++; ghi.push(v + " · " + k + " (" + (PBK[k] || {}).t + ") mo ra TRONG"); }
  }));

  /* R4 - tên mục trong cùng một nhóm phải phân biệt được. Hai mục cùng 12 ký tự đầu thì mắt
     phải đọc hết mới tách được - đó là ma sát thật, nhất là khi menu dài. */
  nhom.forEach(G => {
    const ten = G.items.map(k => { try { return String(uiItemLabel(k) || "") } catch (e) { return "" } }).filter(Boolean);
    for (let i = 0; i < ten.length; i++) for (let j = i + 1; j < ten.length; j++) {
      const a = ten[i], b = ten[j];
      if (a.length >= 12 && b.length >= 12 && a.slice(0, 12).toLowerCase() === b.slice(0, 12).toLowerCase())
        do_.push(v + " · nhom \"" + G.g + "\": hai muc kho phan biet - \"" + a + "\" va \"" + b + "\"");
    }
  });
});
try { gateEnter(""); } catch (e) {}

bangDai.sort((a, b) => b.tong - a.tong);
console.log("  Menu dai nhat: " + bangDai.slice(0, 4).map(x => x.v + "=" + x.tong + " muc/" + x.nhom + " nhom (nhom to nhat " + x.to + ")").join(" · "));
if (ghi.length) ghi.slice(0, 6).forEach(x => console.log("  ghi chu: " + x));

if (maxMuc > TRAN_MUC)   do_.push("menu dai nhat " + maxMuc + " muc, qua tran " + TRAN_MUC + " - menu dai them thi phai chia nhom, khong duoc de troi");
if (maxNhom > TRAN_NHOM) do_.push("mot nhom co " + maxNhom + " muc, qua tran " + TRAN_NHOM + " - mat khong quet duoc mot khoi dai the");
if (soTrong > TRAN_TRONG) do_.push(soTrong + " muc menu mo ra TRONG, qua tran " + TRAN_TRONG + " - moi muc nhu vay la mot lan bi lua");

if (do_.length) {
  console.log("CHECKROI DO (" + do_.length + " cho tren " + vais.length + " chuc danh):");
  do_.slice(0, 10).forEach(x => console.log("  - " + x));
  console.log("CHECKROI DO");
  process.exit(1);
}
console.log("CHECKROI OK: " + vais.length + " chuc danh - menu dai nhat " + maxMuc + "/" + TRAN_MUC +
            " muc, nhom to nhat " + maxNhom + "/" + TRAN_NHOM + ", muc mo ra trong " + soTrong + "/" + TRAN_TRONG);
