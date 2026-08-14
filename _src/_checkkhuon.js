/* _checkkhuon.js - MỘT TRANG NGHIỆP VỤ PHẢI TRÔNG THẾ NÀO.
 *
 * VÌ SAO CÓ FILE NÀY (anh Luân 07/08): *"Có hội đồng nào chuyên về nghiệp vụ và trải nghiệm ko
 * em, để họ biết nên thiết kế trang thế nào ấy"*.
 *
 * Dự án CÓ chuẩn thiết kế - `ITTs_UX_UI_ChuanThietKe.md` phần C khai chuẩn cho bảy loại màn:
 * Dashboard · Bảng danh sách · Trang chi tiết · Phễu · Form · Lịch · Cài đặt. Nhưng **không có
 * loại "trang nghiệp vụ"**, vì hồi viết chuẩn ấy loại màn đó chưa tồn tại - nghiệp vụ còn nằm
 * trong sáu cái hub. V2 đẻ ra 25 trang nghiệp vụ mà không có khuôn nào cho chúng.
 * Hậu quả đo được: 9/25 trang có dải thẻ riêng, 16 trang không. Mỗi trang một kiểu.
 *
 * KHUÔN NÀY KHÔNG PHẢI EM NGHĨ RA - nó ghép từ ba nguồn đã có, chỉ là chưa ai gom lại:
 *   · lời anh Luân tả V2: *"mỗi trang là nghiệp vụ riêng, và nó có THẺ, có CHIP LỌC, có CẢNH BÁO
 *     của riêng nó"* -> ba thành phần bắt buộc;
 *   · `ITTs_UX_UI_ChuanThietKe.md` phần C mục 1-2 (thẻ phải có CTA dẫn tới hành động; bảng phải
 *     lọc/sắp/chọn cột được) và phần D (trạng thái rỗng phải biết nói);
 *   · các luật đã có trong bộ kiểm: câu đầu trang ≤150 ký tự (M9), danh sách 0 dòng phải nói vì
 *     sao (TIỆN DỤNG), thẻ phải khai ở `THEDEF` kèm chú thích chỉ chỗ xem (`_checkux` nhóm 10).
 *
 * SÁU MẶT CỦA KHUÔN - đo trên chữ HIỆN RA (vẽ thật từng trang), không đo mã nguồn:
 *   K1  CÂU NGỮ CẢNH: trang nói được nó làm việc gì, và không dài quá 150 ký tự.
 *   K2  NÚT HÀNH ĐỘNG CHÍNH: việc người ta tới đây để LÀM phải có cửa ngay đầu trang. Trang chỉ
 *       để đọc thì khai lý do - nhưng phải khai, không được im.
 *   K3  DẢI THẺ RIÊNG: có `statStrip` và có khai ở `THEDEF`.
 *   K4  CHIP LỌC: có `filterBar` hoặc thanh lọc chuyên sâu - danh sách dài mà không lọc được thì
 *       người ta cuộn tay.
 *   K5  TRẠNG THÁI RỖNG BIẾT NÓI: có khối `.empty` (danh sách rỗng phải nói vì sao, không để
 *       một khoảng trắng).
 *   K6  KHÔNG CÒN DÍNH TỚI HUB: không trang nghiệp vụ nào còn vẽ thanh tab của hub cũ.
 *
 * BA MẶT ĐẦU LÀ TRẦN KÉO XUỐNG, không phải cổng chặn. Lý do: 16 trang đang thiếu thẻ - đặt luật
 * "mọi trang phải có thẻ" ngay hôm nay là bộ kiểm đỏ 16 chỗ và không ai chạy nó nữa. Nên: ghi
 * đúng số đang thiếu, và số ấy CHỈ ĐƯỢC GIẢM. Sửa được trang nào thì hạ trần xuống đúng số mới.
 *
 * Chạy: ITTS_OUT=<out> node _checkkhuon.js
 */
const FS = require("fs"), PATH = require("path");
const APP = process.env.ITTS_APP || PATH.join(__dirname, "_APP.js");

/* ---- trần: SỐ ĐO ĐƯỢC lúc dựng bộ này. Chỉ được HẠ, không bao giờ nâng. ---- */
/* 16 -> 10: Khúc 2b đã cho bốn hàng chờ phê duyệt dải thẻ riêng. Trần HẠ theo, đúng luật chốt
   kéo xuống - sửa được trang nào thì hạ xuống đúng số mới, không bao giờ nâng lên. */
const TRAN_THIEU_THE  = 0;   /* trang nghiệp vụ chưa có dải thẻ riêng (KHONGTHE khai riêng) */
/* 12 = SỐ ĐO ĐƯỢC. Bản đầu em đặt 8 - một con số ĐOÁN, và nó đỏ ngay. Trần phải là số đo được
   thật: đặt thấp hơn thực tế thì lần nào cũng đỏ, mà một bộ kiểm đỏ mãi thì người ta tắt nó đi.
   Danh sách 12 trang in ra ngay dưới bảng tổng kết - sửa được trang nào thì HẠ trần xuống. */
/* V2 09/08 - HẠ 11 -> 4. Bốn trang còn lại (`duyetck` `duyethoan` `duyetnghi` `duyetthu`) CHÍNH
   LÀ hàng chờ: vào là thấy đủ, không có gì để lọc thêm - cùng lý do đã khai ở `_checkcauhoi`.
   Năm trang vừa làm chip trong đợt này: ychv · phong · bangcong · magioithieu · gvdp. */
const TRAN_THIEU_LOC = 4;
/* V2 09/08 - HẠ 12 -> 0. Năm trang cuối cùng đã xong: `magioithieu` và `giaoan` được DỰNG CỬA
   GHI còn thiếu (trao thưởng, soạn giáo án mới - cả hai đều là lỗ hổng LUẬT SỐ 0 thật, app nhắc
   mà không ai làm được); `duyetck`/`duyetthu` đổi nút cho đồng bộ với hai anh em của nó;
   `bangcong` khai CHIDOC vì nó là bảng đối chiếu, sửa thì sửa ở chính buổi học.
   Từ nay MỌI trang nghiệp vụ hoặc có nút hành động, hoặc nói được vì sao không cần. */
const TRAN_THIEU_NUT = 0;  /* trang chưa có nút hành động chính */

/* Trang KHÔNG CẦN DẢI THẺ - phải khai kèm lý do đọc được, y như `CHIDOC`.
   Khai một chỗ này mạnh hơn để trần bằng 1: trần chỉ nói "còn một trang thiếu", còn bản khai nói
   RÕ trang nào và VÌ SAO. Trần bằng 0 cộng bản khai = từ nay mọi trang nghiệp vụ hoặc có thẻ,
   hoặc nói được vì sao không cần - không còn chỗ nào lọt qua trong im lặng. */
/* V2 08/08 - `lichtuan` roi khoi bang nay vi no khong con la TRANG NGHIEP VU: bang khai chung
   `_v2def.js` xep no vao dien "luoi thoi gian, khong phai danh sach ho so", kem dung ly do cu -
   luoi lich da la cach doc nhanh nhat, dat mot dai the so o tren no la noi lai bang chu cai ma
   mat vua doc bang hinh. Khai o MOT cho, khong khai hai noi. */
/* V2 13/08 - BẢY TRANG KHAI Ở ĐÂY, CÙNG MỘT LÝ DO. Anh Luân kèm ảnh màn Xếp lớp: *"thẻ và chip
   lọc có vẻ dễ bị trùng nhau đúng ko? nếu trùng thì bỏ thẻ, thiết kế chip lọc cho đẹp là ngon
   rồi, lại gọn gàng nữa"*. Bảy trang này có dải thẻ nói Y NGUYÊN dải chip ngay dưới nó - cùng
   nhãn, cùng con số, mà chip còn bấm lọc được. Bỏ thẻ, giữ chip.
   Ý của K3 KHÔNG mất: nó đòi *"người mở trang phải thấy ngay hình dạng của trang bằng con số"*,
   và dải chip có số làm đúng việc ấy - chỉ khác là con số ở đó BẤM ĐƯỢC. K3 chỉ biết hỏi
   `class="bstats"`, tức nó hỏi đúng một CÁCH làm chứ không hỏi cái ĐÍCH; nên bảy trang này khai
   miễn ở đây thay vì đi dựng lại thẻ cho vừa lòng thước đo.
   `_checklap` mục L5 canh chiều ngược lại: trang nào để thẻ nói trùng chip là đỏ. Hai bộ khoá
   nhau - không thể vừa bỏ thẻ vừa để trang trống số. */
const _LYDO_TRUNGCHIP = "da bo dai the vi no trung nguyen nhan + con so voi dai chip ngay duoi; " +
  "dai chip mang so VA bam loc duoc (anh Luan 13/08: 'neu trung thi bo the')";
const KHONGTHE = {
  nhaplead: _LYDO_TRUNGCHIP,   /* 3 the = 3 chip: Lead moi chua cham · Toi hen lien he · Chua ai phu trach */
  test:     _LYDO_TRUNGCHIP,   /* 3 the = 3 chip: Cho dat lich · Cho cham · Cho tu van sau test */
  reup:     _LYDO_TRUNGCHIP,   /* 3 the = 3 chip: Chua gap duoc · Da mat/tu choi · Toi hen cham lai */
  buoihoc:  _LYDO_TRUNGCHIP,   /* 3 the = 3 chip: Cho ghi nhan xet · Qua han ghi · GV vao tre */
  baoluu:   _LYDO_TRUNGCHIP,   /* 3 the = 3 chip: Dang bao luu · Da bo hoc · Chua hen lien he lai */
  nhansu:   _LYDO_TRUNGCHIP,   /* 3 the = 3 chip: Dang lam viec · Ho so con thieu · Da nghi viec */
  hocvien:  _LYDO_TRUNGCHIP,   /* 3 the = 3 chip: Nguy co · Nguy co hoc thuat · Vang nhieu */
  xeplop:   _LYDO_TRUNGCHIP,   /* 2 the = 2 chip: Cho xep lop · Chua hoan tat (moc SLA da xuong hang ghi chu) */
  /* ═══ 13/08 dot 2 - anh Luan chot LUAT VE LOAI THE: *"the no phai mang tinh khac biet, chu no
     nhu cai chip thi giu lam gi, sao ko uu tien KPI, SLA hoac may cai nhom quan trong"*.
     Do ca app: 125 the, 110 cai (88%) chi la MOT SO DEM DONG. Luat + bang phan tich tung trang
     nam o `THE_NEN_LA_GI.md`; the chi duoc mang 5 loai: KPI/ty le · moc SLA · tien-gio cong don ·
     so do tren du lieu KHAC bang duoi · xep hang giua cac nhom.
     Muoi mot trang duoi day khong con the vi CA DAI cua chung chi dem dong. Trang nao co the
     thay bang mot chi so that (nhom B trong tai lieu) thi se lam sau va go khai o day. */
  ychv:     _LYDO_TRUNGCHIP,
  tuvan:    _LYDO_TRUNGCHIP,
  ghinhan:  _LYDO_TRUNGCHIP,
  khieunai: _LYDO_TRUNGCHIP,
  gvdp:     _LYDO_TRUNGCHIP,
  phong:    _LYDO_TRUNGCHIP,
  ketthuc:  _LYDO_TRUNGCHIP,
  magioithieu: _LYDO_TRUNGCHIP,
  duyetnghi:   _LYDO_TRUNGCHIP,
  duyetdot:    _LYDO_TRUNGCHIP,
  tinnhan:     _LYDO_TRUNGCHIP,
  lop:         _LYDO_TRUNGCHIP,   /* 3 the = 3 chip trang thai lop */
};

/* Trang CHỈ ĐỂ ĐỌC - không có nút hành động là đúng, nhưng phải khai kèm lý do đọc được. */
const CHIDOC = {
  bangcong: "bang DOI CHIEU truoc khi chot cong - no CHI RA cho lech (buoi thieu moc gio vao/ra), " +
            "con SUA thi sua o chinh buoi hoc do (moc gio ghi luc diem danh). Dat mot nut ghi o day " +
            "la de mot cua ghi thu hai cho cung mot viec, pham RB1. Chip \"Buoi thieu moc gio\" da " +
            "loc ra dung nhom can goi, va nut Xuat de mang bang di doi chieu voi ke toan.",
  phong:    "trang doi chieu phong va gio - no CHI RA cho dung, con sua thi sua o lich cua lop.",
  buoihnay: "lat cat theo ngay cua buoi hoc - moi viec tren buoi deu mo tu chinh dong buoi do.",
};

const meta = (() => { try { return JSON.parse(FS.readFileSync(PATH.join(__dirname, "demo_data_big.json"), "utf8")).meta || {} } catch (e) { return {} } })();
(function neo() {
  const m = String(meta.anchor || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (!m) return;
  const T = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 9), +(m[5] || 0)).getTime();
  const D = Date;
  global.Date = class extends D { constructor(...a) { if (!a.length) super(T); else super(...a) } static now() { return T } };
})();

function el() {
  return {innerHTML: "", style: {}, classList: {add(){},remove(){},toggle(){},contains(){return false}},
          textContent: "", value: "", scrollTop: 0, dataset: {}, children: [],
          appendChild(){}, removeChild(){}, setAttribute(){}, removeAttribute(){}, getAttribute(){return null},
          addEventListener(){}, querySelector(){return null}, querySelectorAll(){return []},
          closest(){return null}, focus(){}, click(){},
          getBoundingClientRect(){return {x:0,y:0,width:0,height:0,top:0,left:0,right:0,bottom:0}}};
}
const kho = {};
global.document = {getElementById: id => kho[id] || (kho[id] = el()), createElement: () => el(),
  querySelector: () => null, querySelectorAll: () => [], addEventListener(){}, body: el(), documentElement: el()};
global.window = global;
const ss = {}, ls = {};
global.sessionStorage = {getItem: k => (k in ss ? ss[k] : null), setItem: (k,v) => {ss[k]=String(v)}, removeItem: k => {delete ss[k]}};
global.localStorage  = {getItem: k => (k in ls ? ls[k] : null), setItem: (k,v) => {ls[k]=String(v)}, removeItem: k => {delete ls[k]}};
global.location = {search:"", hash:"", pathname:"/", reload(){}};
global.history = {replaceState(){}, pushState(){}};
global.navigator = {userAgent:"node", clipboard:{writeText(){return Promise.resolve()}}};
global.getComputedStyle = () => ({display:"block", getPropertyValue: () => ""});
global.matchMedia = () => ({matches:false, addEventListener(){}, addListener(){}});
global.requestAnimationFrame = f => setTimeout(f, 0);
global.alert = () => {}; global.confirm = () => true; global.prompt = () => "";

try { require("vm").runInThisContext(FS.readFileSync(APP, "utf8")); }
catch (e) { console.log("CHECKKHUON DO: khong nap duoc " + APP + " - " + String(e.message).slice(0,120)); process.exit(1); }

const do_ = [], thieu = {the: [], loc: [], nut: [], cau: [], rong: [], hub: []};

/* 25 trang nghiệp vụ - lấy từ chính bản khai `HUBTAB` (nó nay là bản khai "trang nào là một
   nghiệp vụ", không còn là bản khai hub). Không gõ tay danh sách: gõ tay là thêm một nghiệp vụ
   mới thì quên thêm vào đây, và bộ kiểm im lặng bỏ sót đúng trang mới nhất. */
/* ═══ V2 08/08 - PHAM VI CUA THUOC NAY TUNG LA HINH DANG V1 ════════════════════════════════
   Cau cu: `NV` dung tu `HUBTAB` - bang TAB CUA SAU HUB BAN V1. No bao "23 trang nghiep vu |
   thieu the 0/0" nghe rat yen tam, trong khi BON trang nghiep vu THAT dung tren menu V2 (Hoc
   vien, Giang vien, Bai tap, Nhan su) khong he bi soi - va ca bon deu thieu dai the.
   Thuoc bao xanh vi NO DEM SAI TAP TRANG, khong phai vi app dung.
   Anh Luan 08/08: *"v2 ko phai v1, no co dac thu rieng cua no."*
   Nay hoi ban khai chung `_v2def.js`: trang KHONG AN, DUNG TREN MENU, tru nhung trang da khai
   ro ly do khong thuoc dien. Them mot trang nghiep vu vao menu la no tu bi soi, khong phai nho
   sua thuoc - do la khac biet giua mot ban khai va mot danh sach chep tay. */
try { setRole("all"); applyScope(""); } catch (e) {}
const NV = require("./_v2def.js").trangNghiepVu(global);
if (!NV.length) { console.log("CHECKKHUON DO: khong doc duoc tap trang nghiep vu"); process.exit(1); }

/* Bóc chữ hiện ra khỏi HTML - đo trên thứ NGƯỜI DÙNG ĐỌC, không đo mã nguồn. */
function chu(h) { return String(h || "").replace(/<[^>]*>/g, " ").replace(/&[a-z]+;/g, " ").replace(/\s+/g, " ").trim(); }

NV.forEach(k => {
  if (!PBK[k]) return;
  let h = "";
  try { CUR = k; h = (PBK[k].ty === "list") ? renderList(k) : (RENDER[k] ? RENDER[k]() : ""); }
  catch (e) { do_.push(k + ": ve ra thi LOI - " + String(e.message).slice(0, 70)); return; }
  if (!h) { do_.push(k + ": khong ve ra gi ca"); return; }

  /* K1 - câu ngữ cảnh. Lấy đoạn nhắc đầu trang, đo trên chữ hiện ra.
     BẪY CỦA CHÍNH CÁI THƯỚC, cắn ngay lần chạy đầu: lớp CSS thật là `class="phead nohd"`, mà
     bản đầu dò `class="phead"` CÓ DẤU NGOẶC ĐÓNG - không khớp trang nào, và bộ kiểm chấm oan 20
     trang "không có câu ngữ cảnh" trong khi trang nào cũng có.
     Cùng họ với bẫy `_check11` đã cắn: bám vào chuỗi lớp CSS NGUYÊN VĂN thì thêm một lớp phụ là
     phép đo chết. Bám vào TỪ KHOÁ giữa các lớp, đừng bám cả chuỗi. */
  /* Lấy ĐÚNG khối câu (`<div class="s">...`), không lấy cả vùng đầu trang: `pageHead` gắn BẢNG
     VIỆC ngay sau đó, ăn lan sang đấy là đếm cả một cái bảng vào độ dài một câu - lại một phép
     đo phóng đại. Đo cái gì thì phải bám đúng cái đó. */
  /* V2 08/08 - HAI HÌNH DẠNG ĐẦU TRANG, CÙNG MỘT CÂU HỎI. Hầu hết trang dùng `pageHead` (khối
     `.phead` + dòng `.s`), riêng Bàn làm việc có ô CHÀO (`.bwhero`) - hình dạng khác vì nó là
     trang đáp, không phải trang danh sách. Câu hỏi không đổi: TRANG NÀY CÓ NÓI NÓ LÀ CÁI GÌ
     KHÔNG. Hỏi cả hai chỗ thì trang nào cũng phải trả lời, không trang nào lách được bằng cách
     dựng đầu trang kiểu riêng. */
  /* Cua so 80 ky tu giua `class="phead"` va `class="s"` la mot con so chon bua, va no vua cham
     oan `banglop`: tieu de trang ay co mot HUY HIEU LOP (`lopThe`) cong ten lop, rieng chung da
     hon 80 ky tu - cau ngu canh nam ngay duoi tieu de nhung thuoc do khong voi toi.
     Luat can canh MUC TIEU ("trang co noi no la cai gi khong"), khong canh CACH LAM ("cau do
     phai nam trong 80 byte dau"). Noi rong cua so len 400 - van du gan de khong bat nham cau
     cua mot khoi phead khac. */
  const mHead = h.match(/class="phead[^"]*"[\s\S]{0,400}?class="s"[^>]*>([\s\S]{0,1200}?)<\/div>/)
             || h.match(/class="bwctx"[^>]*>([\s\S]{0,1200}?)<\/div>/);
  const cau = mHead ? chu(mHead[1]) : "";
  if (!cau) thieu.cau.push(k + " (khong co cau ngu canh)");
  else if (cau.length > 150) thieu.cau.push(k + " (cau dau trang " + cau.length + " ky tu, tran 150)");

  /* K2 - nút hành động chính ở đầu trang */
  const coNut = /class="phead"[\s\S]{0,1500}?<button/.test(h) || /class="btn primary/.test(h);
  if (!coNut && !CHIDOC[k]) thieu.nut.push(k);

  /* K3 - DẢI THẺ RIÊNG. Chỉ hỏi "trang có vẽ ra dải thẻ không".
     Bản đầu đòi thêm `THEDEF[k]` tồn tại - tức đòi MÃ DẢI phải trùng MÃ TRANG. Đó là đòi hỏi vô
     cớ: `buoihnay` dùng dải `httoday`, `khaosat` dùng dải `review`, cả hai đều khai đàng hoàng và
     đều đúng. Hai trang bị chấm oan.
     Và nó còn LÀM TRÙNG VIỆC: luật "mọi lời gọi `statStrip` phải truyền mã dải, và mã ấy phải có
     trong `THEDEF`" đã là nhóm 10 của `_checkux`. Hai cái thước cùng đo một thứ thì sớm muộn hai
     cái nói hai đằng, và người sửa không biết tin cái nào. Trả luật ấy về cho `_checkux`. */
  if (!/class="bstats|class="stat/.test(h) && !KHONGTHE[k]) thieu.the.push(k);

  /* K4 - chip lọc */
  /* Ba cách app cho người ta lọc, phải hỏi đủ cả ba - hỏi thiếu một cách là chấm oan một trang
     đang lọc được thật. Đã cắn: trang Lead có chip lọc nhanh (`qfToggle`) chạy hẳn hoi - đo được
     bấm chip "Tới hẹn liên hệ" thì 20 dòng còn 2 - mà bộ kiểm vẫn ghi "chưa có lọc", vì bản đầu
     chỉ dò `fset(` và `class="fbar"`. */
  /* V2 08/08 - HOI THEO THU NGUOI DUNG NHIN THAY, KHONG HOI THEO TEN HAM.
     Cau tren van con thieu: no do BON dau hieu, ma app co it nhat SAU cach dat chip -
     `fset` (trang tac vu) · `qfToggle` (chip tuy bien) · `toggleFilt` (chip trang thai) ·
     `window.XLFILT` (Xep lop) · `viecOnly` (Viec hom nay) · `window.GATAB` (Giao an).
     Cham oan nam trang dang loc duoc that. Va do la lan CAN THU HAI cung mot kieu - ghi chu
     ngay tren da ke lan thu nhat roi.
     Cach hoi dung: dai chip la mot THANH PHAN co hinh dang rieng (`<button class="segb">` dung
     trong `<div class="seg">`) - hoi thang no thi them mot kieu chip moi cung tu duoc dem,
     khong phai nho sua thuoc. Do tren chuoi HTML that, dung hoi lai ten ham. */
  if (!/class="fbar|class="chipf|<button class="segb/.test(h)) thieu.loc.push(k);

  /* K5 - KHÔNG BAO GIỜ ĐỂ MỘT KHOẢNG TRẮNG. Hỏi đúng câu: trang có dòng dữ liệu nào không -
     nếu KHÔNG có thì phải có lời nói vì sao (`.empty`). Bản đầu hỏi ngược ("có khối rỗng không")
     nên chấm đỏ cả những trang đang đầy dữ liệu - hỏi sai câu thì con số ra vô nghĩa.
     Dữ liệu demo hầu hết đang đầy, nên mục này chủ yếu canh cho tương lai: lọc hết sạch, hoặc
     một chức danh không có dòng nào, thì trang vẫn phải nói được điều gì đó. */
  /* ĐỪNG ĐUỔI THEO TÊN LỚP CSS. Bản đầu hỏi "có `<tr>` hoặc khối tên `card`/`row` không" - và
     hụt hai lần liên tiếp: `appcard` ở Duyệt chiết khấu, rồi `rvq` ở Chăm lại. Mỗi màn một kiểu
     thẻ dòng, nên một danh sách tên đóng thì cứ thêm một kiểu là thước lại hụt, và mỗi lần hụt
     là một lần TỐ OAN app.
     Hỏi câu KHÔNG phụ thuộc tên lớp, và cũng đúng là câu người dùng hỏi: **sau đầu trang, còn
     chữ gì để đọc không?** Trang nào chỉ có đầu trang rồi hết mà không một lời giải thích thì
     đúng là một khoảng trắng - dù nó dựng bằng thẻ tên gì. */
  const than = chu(h.replace(/[\s\S]*?class="phead[^"]*"[\s\S]{0,3000}?class="sp"[\s\S]*?<\/div>/, ""));
  const coLoiRong = /class="empty"/.test(h);
  if (than.length < 120 && !coLoiRong) thieu.rong.push(k + " (than trang chi co " + than.length + " ky tu chu)");

  /* K6 - không còn dính tới hub: trang nghiệp vụ không được vẽ thanh tab của hub cũ */
  if (/TabSet\('|duyTabSet\(|tsTabSet\(|htTabSet\(|csTabSet\(/.test(h)) thieu.hub.push(k);
});

/* Trang khai CHỈ ĐỌC mà lại có nút hành động thì bản khai đã cũ - gỡ dòng khai đi. */
Object.keys(CHIDOC).forEach(k => { if (NV.indexOf(k) < 0) do_.push("ban khai CHIDOC nhac trang khong con la nghiep vu: " + k); });
Object.keys(KHONGTHE).forEach(k => { if (NV.indexOf(k) < 0) do_.push("ban khai KHONGTHE nhac trang khong con la nghiep vu: " + k); });
/* Khai "khong can the" ma trang lai CO the thi ban khai da cu - go dong khai di, dung de no nam
   lai vinh vien roi che mat mot trang that su thieu. */
Object.keys(KHONGTHE).forEach(k => { if (NV.indexOf(k) >= 0 && thieu.the.indexOf(k) < 0 && THEDEF[k]) do_.push("ban khai KHONGTHE thua: " + k + " nay da co dai the"); });

if (thieu.cau.length)  do_.push("K1 cau ngu canh: " + thieu.cau.length + " trang - " + thieu.cau.slice(0,4).join(", "));
if (thieu.rong.length) do_.push("K5 trang thai rong khong biet noi: " + thieu.rong.length + " trang - " + thieu.rong.slice(0,4).join(", "));
if (thieu.hub.length)  do_.push("K6 CON DINH TOI HUB - trang nghiep vu van ve thanh tab hub cu: " + thieu.hub.join(", "));

if (thieu.the.length > TRAN_THIEU_THE) do_.push("K3 thieu dai the: " + thieu.the.length + " trang, qua tran " + TRAN_THIEU_THE + " - " + thieu.the.slice(0,5).join(", "));
if (thieu.loc.length > TRAN_THIEU_LOC) do_.push("K4 thieu chip loc: " + thieu.loc.length + " trang, qua tran " + TRAN_THIEU_LOC + " - " + thieu.loc.join(", "));
if (thieu.nut.length > TRAN_THIEU_NUT) do_.push("K2 thieu nut hanh dong: " + thieu.nut.length + " trang, qua tran " + TRAN_THIEU_NUT + " - " + thieu.nut.join(" | "));

if(thieu.nut.length)console.log("  chua co nut hanh dong: " + thieu.nut.join(" "));
console.log("  " + NV.length + " trang nghiep vu | thieu the " + thieu.the.length + "/" + TRAN_THIEU_THE +
            " · thieu loc " + thieu.loc.length + "/" + TRAN_THIEU_LOC +
            " · thieu nut " + thieu.nut.length + "/" + TRAN_THIEU_NUT);
if (thieu.the.length) console.log("  chua co the: " + thieu.the.join(" "));
if (thieu.loc.length) console.log("  chua co loc: " + thieu.loc.join(" "));

if (do_.length) {
  console.log("CHECKKHUON DO (" + do_.length + " cho):");
  do_.forEach(x => console.log("  - " + x));
  console.log("CHECKKHUON DO");
  process.exit(1);
}
console.log("CHECKKHUON OK: " + NV.length + " trang nghiep vu deu theo khuon (cau ngu canh, trang thai rong, khong con dinh hub); ba tran keo xuong deu trong nguong");
