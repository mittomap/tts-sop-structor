/* _bangquyen: BẢNG PHÂN QUYỀN CỦA 10 CHỨC DANH Ở CỔNG ĐĂNG NHẬP.
   Anh Luân chốt 03/08 danh sách chức danh cho cổng đăng nhập demo, và hỏi mỗi chức danh ĐƯỢC
   QUYỀN GÌ · CÓ TRANG NÀO · THẤY DỮ LIỆU NÀO. Ba câu ấy nằm ở ba chỗ khác nhau trong app
   (`canAct` theo bảng CH3 · `canSee` theo cây menu · `canRow`/`srows` theo phạm vi dữ liệu),
   nên trả lời bằng trí nhớ là chắc chắn sai một chỗ. Bộ này ĐÓNG VAI từng người rồi hỏi lại
   chính app, in ra bảng đọc được.

   Không phải bộ kiểm - nó không có tiêu chí đúng/sai, nó là cái THƯỚC ĐỌC. Nên nó không nằm
   trong `verify.sh`; chạy tay khi cần đối chiếu quyền.

   Chạy: node _bangquyen.js   (mặc định đọc ./_APP.js; đổi bằng ITTS_APP=<đường dẫn>) */

const APP = process.env.ITTS_APP || "./_APP.js";
const FS = require("fs");

/* Neo đồng hồ vào ngày sinh bộ dữ liệu - số hồ sơ "còn trong hạn" đổi theo giờ chạy. */
try {
  const meta = JSON.parse(FS.readFileSync("./demo_data_big.json", "utf8")).meta || {};
  const m = String(meta.anchor || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (m) {
    const moc = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0)).getTime(), D = Date;
    global.Date = function (...a) { return a.length ? new D(...a) : new D(moc); };
    global.Date.now = () => moc;
    global.Date.prototype = D.prototype; global.Date.parse = D.parse; global.Date.UTC = D.UTC;
  }
} catch (e) {}

function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:"",pathname:"/ITTs_WebApp_v5_demo.html"};
var LS={};global.localStorage={getItem:(k)=>(k in LS?LS[k]:null),setItem(k,v){LS[k]=String(v)},removeItem(k){delete LS[k]}};
var SS={};global.sessionStorage={getItem:(k)=>(k in SS?SS[k]:null),setItem(k,v){SS[k]=String(v)},removeItem(k){delete SS[k]}};
global.innerWidth=1400;global.innerHeight=900;
require("vm").runInThisContext(FS.readFileSync(APP, "utf8"));

/* ĐÚNG MƯỜI CHỨC DANH anh Luân chốt cho cổng đăng nhập, theo đúng thứ tự anh viết.
   Quản trị viên không phải một dòng trong DL01 - nó là chế độ vào bằng mật khẩu (`gateEnter("")`),
   nên khai riêng bằng mã rỗng. */
const CHON = [
  {ten: "Quản trị viên",                          ma: ""},
  {ten: "Giám đốc",                               ma: "ceo"},
  {ten: "Trưởng phòng Tư vấn",                    ma: "sales_manager"},
  {ten: "Leader Tư vấn (kiêm QL chi nhánh)",      ma: "sales_leader"},
  {ten: "Nhân viên chi nhánh (Tư vấn)",           ma: "sales_staff"},
  {ten: "Trưởng phòng Học vụ",                    ma: "academic_manager"},
  {ten: "Nhân viên Học vụ",                       ma: "academic_staff"},
  {ten: "Leader WOW",                             ma: "wow_leader"},
  {ten: "WOW Coach",                              ma: "wow_coach"},
  {ten: "Kế toán",                                ma: "accountant"},
];

/* Bảng dữ liệu đáng kể - hỏi số dòng NGƯỜI ẤY THẤY, không hỏi tổng số dòng có trong kho. */
const BANG = [["DL02","Lead / khách"],["DL09","Học viên"],["DL10","Lớp"],["DL06","Đơn đăng ký"],
  ["DL07","Khoản thu"],["DL14","Buổi WOW"],["DL17","Khiếu nại"],["DL03","Phiếu test"],
  ["DL01","Nhân sự"],["DL13","Bài tập"]];

function nguoiCua(ma) {
  if (!ma) return {staff_id: "", full_name: "(Quản trị viên)", branch: "toàn hệ thống"};
  const a = (DL.DL01 || []).filter(s => String(s.role || "").indexOf(ma) === 0 &&
    !/inactive|nghỉ/i.test(String(s.status || "")));
  return a[0] || null;
}
function dsNguoi(ma) {
  if (!ma) return [];
  return (DL.DL01 || []).filter(s => String(s.role || "").indexOf(ma) === 0 &&
    !/inactive|nghỉ/i.test(String(s.status || "")));
}

const KQ = [];
CHON.forEach(C => {
  const ai = nguoiCua(C.ma);
  if (!ai) { KQ.push({ten: C.ten, loi: "KHONG CO NGUOI NAO trong DL01 mang vai " + C.ma}); return; }
  gateEnter(ai.staff_id || "");

  /* 1. QUYỀN - 31 hành động bảng CH3 */
  const lam = [], khong = [];
  Object.keys(CH3BY || {}).forEach(k => {
    let ok = false; try { ok = !!canAct(k); } catch (e) {}
    (ok ? lam : khong).push((CH3BY[k] || {}).t || k);
  });

  /* 2. TRANG - hỏi cây menu của chính bản build đang chạy */
  let muc = [];
  try { muc = navCay().reduce((a, g) => a.concat((g.items || []).map(k => ({g: g.g, k: k}))), []); }
  catch (e) {}
  const trang = muc.filter(x => { try { return canSee(x.k); } catch (e) { return false; } })
                   .map(x => ({nhom: x.g, k: x.k, t: (PBK[x.k] || {}).t || x.k}));

  /* 3. DỮ LIỆU - số dòng thấy / tổng, và mức phạm vi app tự khai */
  const dl = BANG.map(([code, ten]) => {
    let thay = 0, tong = 0;
    try { tong = rows(code).length; thay = srows(code).length; } catch (e) {}
    return {code, ten, thay, tong};
  });
  let mucPham = {};
  try { ["lead","hocvien","lop","tien","noidung","nhansu"].forEach(d => {
    try { mucPham[d] = dsLevel(d); } catch (e) {} }); } catch (e) {}

  /* 4. ĐỨNG Ở ĐÂU + BAO NHIÊU VIỆC */
  let dap = "", viec = 0;
  try { dap = SCOPE().land || ""; } catch (e) {}
  try { (TTHE || []).forEach(x => { viec += ttDanhSach(x.k).filter(z => z.viec.length).length }); } catch (e) {}

  KQ.push({ten: C.ten, ma: C.ma, ai: ai, songuoi: dsNguoi(C.ma).length,
           lam, khong, trang, dl, mucPham, dap, viec});
});

/* ---- in ra ------------------------------------------------------------------------------- */
console.log("BANG PHAN QUYEN - " + CHON.length + " chuc danh cong dang nhap\n");

KQ.forEach(r => {
  if (r.loi) { console.log("## " + r.ten + "\n   " + r.loi + "\n"); return; }
  console.log("## " + r.ten + "   [" + (r.ma || "admin") + "]");
  console.log("   nguoi mau: " + (r.ai.full_name || "-") + (r.ai.branch ? (" · " + r.ai.branch) : "") +
    "   | so nguoi chon duoc: " + (r.songuoi || 1));
  console.log("   dap xuong: " + (r.dap || "-") + "   | ho so co viec cua ho: " + r.viec);
  console.log("   QUYEN (CH3): lam duoc " + r.lam.length + "/" + (r.lam.length + r.khong.length));
  console.log("      + " + (r.lam.join(" · ") || "(khong co)"));
  if (r.khong.length) console.log("      - KHONG: " + r.khong.join(" · "));
  const theoNhom = {};
  r.trang.forEach(t => { (theoNhom[t.nhom] = theoNhom[t.nhom] || []).push(t.t) });
  console.log("   TRANG: " + r.trang.length + " muc");
  Object.keys(theoNhom).forEach(g => console.log("      " + g + ": " + theoNhom[g].join(" · ")));
  console.log("   PHAM VI DU LIEU: " + Object.keys(r.mucPham).map(k => k + "=" + r.mucPham[k]).join(" | "));
  console.log("   DU LIEU THAY DUOC: " +
    r.dl.map(d => d.ten + " " + d.thay + "/" + d.tong).join("  ·  "));
  console.log("");
});
