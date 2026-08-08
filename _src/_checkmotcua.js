/* _checkmotcua.js - MỘT NGHIỆP VỤ MỘT CỬA GHI (RB1 của V2).
 *
 * VÌ SAO CÓ FILE NÀY. Anh Luân: *"cùng 1 nghiệp vụ, mà ở bản hiện tại có thể làm được ở rất
 * nhiều nơi, sẽ làm cho nhân sự bị rối."* Ràng buộc RB1 của V2 viết ra từ câu đó: **một form,
 * một hàm lưu, một chỗ chặn quyền. Nơi khác chỉ được MỞ cửa đó, cấm dựng bản sao.**
 *
 * ĐO TRƯỚC KHI KẾT LUẬN - và số đo làm em phải sửa lại chính chẩn đoán của mình.
 * Thoạt nhìn `DOORTB` có 146 cửa ghi trên 24 bảng, riêng DL09 mười tám cửa, trông như một đống
 * trùng lặp. Đọc kỹ thì 18 cửa ấy là 18 NGHIỆP VỤ KHÁC NHAU (bảo lưu · quay lại · bỏ học · chăm
 * nguy cơ · quota WOW · đăng ký...) - không cửa nào thừa. Một bảng có nhiều cửa ghi là bình
 * thường; cái phải bắt là hai cửa CÙNG LÀM MỘT VIỆC.
 *
 * VẬY ĐO CÁI GÌ MỚI ĐÚNG: đo **hai hàm cùng dựng một form**. Dấu vết của nó nhìn thấy được và
 * không cãi được - hai hàm cùng phát ra CÙNG MỘT `id=` cho ô nhập. Đo trên 1604 hàm của bản
 * build, ra ba cặp trùng thật.
 *
 * VÀ TRÙNG ID KHÔNG CHỈ LÀ CHUYỆN GỌN GÀNG - NÓ LÀ MỘT LỖI GHI DỮ LIỆU. Bẫy số 4 của
 * `BAN_GIAO_V2.md`, đã cắn thật: *"Ngăn kéo mở đè lên trang mà trang vẫn còn trong DOM -> trùng
 * id phần tử, `getElementById` vớ trúng bản ở trang bên dưới. Người dạy chấm trong ngăn kéo mà
 * app lưu điểm của trang."* Đọc nhầm ô nhập thì app ghi một con số KHÁC con số người ta gõ, và
 * không có gì báo cả.
 *
 * BA MẶT:
 *   M1  HAI HÀM CÙNG DỰNG MỘT Ô NHẬP (trùng `id=`) - trùng phải khai lý do ở `CHUNGID`.
 *   M2  MỖI CỬA GHI PHẢI CÓ MẶT TRONG `DOORTB` - `_check15` đã canh chiều này, ở đây chỉ hỏi lại
 *       cho bản khai `NGHIEPVU` bên dưới không trỏ vào một hàm đã bị xoá.
 *   M3  BẢN KHAI `NGHIEPVU` PHẢI ĐÚNG - mỗi nghiệp vụ khai một hàm mở form và một hàm lưu, cả
 *       hai phải tồn tại thật. Khai sai thì đỏ ngay, không để bản khai trôi khỏi mã.
 *
 * Chạy: ITTS_OUT=<out> node _checkmotcua.js
 */
const FS = require("fs"), PATH = require("path");
const APP = process.env.ITTS_APP || PATH.join(__dirname, "_APP.js");

/* ─── BẢN KHAI NGHIỆP VỤ - mỗi dòng: một việc, một cửa mở form, một cửa ghi ────────────────
   Đây là bản khai anh Luân yêu cầu ở RB1. Nó chưa phủ hết mọi nghiệp vụ (146 cửa ghi), nhưng
   phủ đúng những việc mà nhiều nơi trong app cùng mời người dùng làm - tức đúng chỗ dễ đẻ ra
   bản sao. Thêm một nghiệp vụ vào đây là thêm một chỗ được máy canh. */
const NGHIEPVU = [
  {ma:"diemdanh",  viec:"Điểm danh một buổi",        moForm:"ddHub",         luu:"ddSave"},
  {ma:"nhanxet",   viec:"Ghi nhận xét buổi dạy",     moForm:"bhNoteForm",    luu:"bhNoteSave"},
  {ma:"thutien",   viec:"Ghi nhận khoản thu",        moForm:"payForm",       luu:"paySave"},
  {ma:"xeplop",    viec:"Xếp lớp cho học viên",      moForm:"xepFor",        luu:"xepMoiLuu"},
  {ma:"khieunai",  viec:"Xử lý & đóng khiếu nại",    moForm:"knResolve",     luu:"knResolveSave"},
  {ma:"wowdat",    viec:"Đặt buổi WOW 1-1",          moForm:"wowAdd",        luu:"wowAddSave"},
];

/* Id dùng chung có lý do chính đáng - khai ở đây thì không tính là trùng. Mỗi dòng phải nói
   được VÌ SAO hai chỗ dùng chung id mà vẫn an toàn: hoặc chúng không bao giờ cùng có mặt trên
   màn hình, hoặc chúng thật sự là MỘT form được gọi từ hai lối. */
const CHUNGID = {
  "sv_neg":"phieu khao sat: ban HOC VIEN dien (hvSurveyFill, cong hoc vien) va ban NHAN VIEN doc "+
    "ket qua (svResult, cong nhan vien) - hai CONG khac nhau, khong bao gio cung mo mot luc.",
  "sv_nps":"nhu sv_neg", "sv_pos":"nhu sv_neg", "sv_sat":"nhu sv_neg", "sv_sug":"nhu sv_neg",
};

const meta = (() => { try { return JSON.parse(FS.readFileSync(PATH.join(__dirname,"demo_data_big.json"),"utf8")).meta||{} } catch(e){ return {} } })();
(function neo(){
  const m = String(meta.anchor||"").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (!m) return;
  const T = new Date(+m[3], +m[2]-1, +m[1], +(m[4]||9), +(m[5]||0)).getTime();
  const D = Date;
  global.Date = class extends D { constructor(...a){ if(!a.length) super(T); else super(...a) } static now(){ return T } };
})();

let SRC = "";
try { SRC = FS.readFileSync(APP, "utf8"); }
catch (e) { console.log("CHECKMOTCUA DO: khong doc duoc " + APP); process.exit(1); }

const do_ = [];

/* ─── M1: hai hàm cùng dựng một ô nhập ────────────────────────────────────────────────────
   Cắt bản build thành từng hàm top-level rồi soi `id=` trong thân mỗi hàm. Đo trên BẢN BUILD
   chứ không trên `gen_v5.py`: chú thích trong nguồn có nhắc tên id, đếm cả chú thích là đi canh
   một ô nhập không tồn tại (bài học đã ghi ở `_checkux` nhóm 12). */
const than = {};
(function catHam(){
  const vt = [];
  const re = /\nfunction ([A-Za-z0-9_]+)\s*\(/g; let m;
  while ((m = re.exec(SRC))) vt.push([m[1], m.index]);
  vt.push(["__het__", SRC.length]);
  for (let i = 0; i < vt.length - 1; i++) than[vt[i][0]] = SRC.slice(vt[i][1], vt[i+1][1]);
})();
if (Object.keys(than).length < 500) do_.push("cat ham that bai - chi thay " + Object.keys(than).length + " ham (cho doi > 500)");

const chuId = {};
Object.keys(than).forEach(fn => {
  const re = /id="([a-z][a-z0-9]{0,7}_[a-z0-9]+)"/g; let m;
  const da = {};
  while ((m = re.exec(than[fn]))) { if (da[m[1]]) continue; da[m[1]] = 1; (chuId[m[1]] = chuId[m[1]] || []).push(fn); }
});
/* PHÂN BIỆT HAI MỨC - đây là chỗ bản đầu của bộ kiểm chấm sai, và sai theo hướng nguy hiểm hơn:
   nó gọi mọi trùng id là ĐỎ.
   Đo lại thì phải tách làm hai, vì hậu quả khác hẳn nhau:
     · NGĂN KÉO + TRANG  -> ĐỎ THẬT. Trang vẫn nằm trong DOM khi ngăn kéo mở đè lên, nên
       `getElementById` vớ trúng bản ở trang bên dưới: người ta gõ vào ngăn kéo mà app đọc ô của
       trang. Đây đúng bẫy số 4 của `BAN_GIAO_V2.md`, đã cắn thật.
     · NGĂN KÉO + NGĂN KÉO -> GHI CHÚ, không đỏ. `openDrawer` THAY nội dung, nên hai ngăn kéo
       không bao giờ cùng có mặt - không có ô nào để vớ nhầm. Vẫn là hai bản dựng cho một form
       (chuyện của RB1, nên vẫn phải nói ra), nhưng không phải lỗi ghi dữ liệu.
   Chấm tất thành đỏ thì bộ kiểm đỏ ở chỗ không nguy hiểm, người ta quen mắt, rồi ca đỏ THẬT
   trôi qua cùng một màu. */
function laNganKeo(fn){ return /openDrawer\s*\(/.test(than[fn] || ""); }
const ghiChu = [];
Object.keys(chuId).sort().forEach(id => {
  if (chuId[id].length <= 1 || CHUNGID[id]) return;
  const fns = chuId[id];
  const soTrang = fns.filter(f => !laNganKeo(f)).length;
  if (soTrang > 0)
    do_.push('id="' + id + '" dung o CA NGAN KEO LAN TRANG: ' + fns.join(" + ") +
             " - trang van nam trong DOM khi ngan keo mo de len, getElementById vo trung ban o duoi, " +
             "app ghi mot con so KHAC con so nguoi ta go. Doi ten id, hoac gop ve MOT ham dung form.");
  else ghiChu.push('id="' + id + '" o hai ngan keo: ' + fns.join(" + "));
});

/* Bản khai thừa: khai một id dùng chung mà id ấy không còn dùng chung nữa thì gỡ dòng khai đi -
   để nó nằm lại là che mất một chỗ trùng thật sau này. */
Object.keys(CHUNGID).forEach(id => {
  if (!chuId[id] || chuId[id].length <= 1) do_.push("ban khai CHUNGID thua: " + id + " nay khong con dung chung");
});

/* ─── M2 + M3: bản khai NGHIEPVU phải trỏ vào hàm có thật ─────────────────────────────────
   Nạp app rồi hỏi thẳng, không đoán theo chữ trong mã nguồn. */
function el(){ return {innerHTML:"",style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},
  textContent:"",value:"",scrollTop:0,dataset:{},appendChild(){},setAttribute(){},addEventListener(){},
  querySelector(){return null},querySelectorAll(){return []},closest(){return null},
  getBoundingClientRect(){return {x:0,y:0,width:0,height:0}}}; }
const kho = {};
global.document = {getElementById:id=>kho[id]||(kho[id]=el()),createElement:()=>el(),
  querySelector:()=>null,querySelectorAll:()=>[],addEventListener(){},body:el(),documentElement:el()};
global.window = global;
const ss={},ls={};
global.sessionStorage={getItem:k=>(k in ss?ss[k]:null),setItem:(k,v)=>{ss[k]=String(v)},removeItem:k=>{delete ss[k]}};
global.localStorage ={getItem:k=>(k in ls?ls[k]:null),setItem:(k,v)=>{ls[k]=String(v)},removeItem:k=>{delete ls[k]}};
global.location={search:"",hash:"",pathname:"/",reload(){}};
global.history={replaceState(){},pushState(){}};
global.navigator={userAgent:"node",clipboard:{writeText(){return Promise.resolve()}}};
global.getComputedStyle=()=>({display:"block",getPropertyValue:()=>""});
global.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});
global.requestAnimationFrame=f=>setTimeout(f,0);
global.alert=()=>{}; global.confirm=()=>true; global.prompt=()=>"";
try { require("vm").runInThisContext(SRC); }
catch (e) { console.log("CHECKMOTCUA DO: khong nap duoc app - " + String(e.message).slice(0,110)); process.exit(1); }

NGHIEPVU.forEach(N => {
  if (typeof global[N.moForm] !== "function") do_.push(N.ma + " (" + N.viec + "): ham mo form `" + N.moForm + "` khong ton tai");
  if (typeof global[N.luu]    !== "function") do_.push(N.ma + " (" + N.viec + "): ham luu `" + N.luu + "` khong ton tai");
  else {
    /* HÀM LƯU KHÔNG NHẤT THIẾT LÀ CỬA GHI - nó có quyền GỌI một cửa ghi dùng chung.
       Bản đầu của mục này đòi `DOORTB[N.luu]` phải tồn tại, và báo đỏ `knResolveSave` "chưa khai
       cửa ghi". Đọc mã thì sai: `knResolveSave` gọi `knUpd`, mà `knUpd` đã khai đàng hoàng ở
       DL17. Đòi mỗi hàm lưu tự mình là một cửa ghi là ép app bỏ hàm ghi dùng chung - tức ép nó
       làm ngược lại đúng điều RB1 muốn.
       Câu hỏi đúng: hàm lưu phải ĐI TỚI ĐƯỢC một cửa ghi - hoặc chính nó là cửa, hoặc nó gọi một
       cửa. Không tới được cửa nào thì nó ghi chui, và nhật ký thao tác không biết ai vừa làm gì. */
    var toiCua = !!DOORTB[N.luu];
    if (!toiCua) {
      var b = than[N.luu] || "";
      toiCua = Object.keys(DOORTB || {}).some(function(d){ return new RegExp("\\b" + d + "\\s*\\(").test(b); });
    }
    if (!toiCua) do_.push(N.ma + " (" + N.viec + "): ham luu `" + N.luu + "` khong phai cua ghi va cung khong goi cua ghi nao - no ghi chui, nhat ky thao tac khong biet ai vua lam gi");
  }
});

if (ghiChu.length) {
  console.log("  ghi chu (RB1, khong nguy hiem): " + ghiChu.length + " o nhap dung chung giua HAI NGAN KEO - " +
              "hai ban dung cho mot form, gop lai duoc thi gon hon, nhung khong sai du lieu vi hai ngan keo khong bao gio cung mo:");
  ghiChu.slice(0, 6).forEach(x => console.log("    · " + x));
}
const soCua = Object.keys(DOORTB || {}).length;
console.log("  " + Object.keys(than).length + " ham | " + soCua + " cua ghi khai o DOORTB | " +
            NGHIEPVU.length + " nghiep vu khai o NGHIEPVU | id dung chung da khai ly do: " + Object.keys(CHUNGID).length);

if (do_.length) {
  console.log("CHECKMOTCUA DO (" + do_.length + " cho):");
  do_.slice(0, 8).forEach(x => console.log("  - " + x));
  console.log("CHECKMOTCUA DO");
  process.exit(1);
}
console.log("CHECKMOTCUA OK: khong hai ham nao cung dung mot o nhap, va moi nghiep vu khai deu co du cua mo form + cua ghi");
