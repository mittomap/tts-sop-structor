/* _checknguoi: ĐĂNG NHẬP BẰNG TỪNG NGƯỜI MỘT - mọi người đang đi làm trong DL01, không phải
   mỗi chức danh một người đại diện.
   Anh Luân 03/08: *"nhớ check kỹ lại mỗi 1 bộ phận, 1 người đăng nhập thì tính năng, giao diện
   đã chuẩn chưa, nghiệp vụ đã đủ chưa, có bị dư thiếu hay sai lệch gì không"*.

   VÌ SAO PHẢI ĐO THEO NGƯỜI CHỨ KHÔNG THEO CHỨC DANH. Mọi bộ kiểm trước đây (`_checkngay`,
   `_bangquyen`, `check_sop` mặt CH3) đều lấy MỘT người làm đại diện cho mỗi chức danh. Nhưng
   phạm vi dữ liệu của app cắt theo CHI NHÁNH và theo NGƯỜI PHỤ TRÁCH, không cắt theo chức danh:
   7 nhân viên tư vấn ngồi ở 5 cơ sở khác nhau nhìn ra 7 màn hình khác nhau. Lấy một người làm
   đại diện là bỏ qua 6 màn còn lại - mà đúng 6 màn ấy mới là thứ 6 người kia mở ra mỗi sáng.

   TÁM CÂU HỎI CHO MỖI NGƯỜI:
    1. VÀO ĐƯỢC KHÔNG - phạm vi dựng ra có nhóm thật, trang đáp là trang có thật.
    2. THANH TRÊN CÓ ĐÚNG LÀ HỌ KHÔNG - tên và chức danh hiện trên thanh phải là của chính họ.
       (Sai chỗ này thì mọi thứ sau đó đúng cũng vô nghĩa: người ta đang xem màn của người khác.)
    3. TRANG ĐÁP CÓ NỘI DUNG KHÔNG - vẽ ra dưới 600 ký tự là một màn trắng.
    4. MENU CỦA HỌ CÓ MỤC NÀO MỞ RA TRỐNG KHÔNG (thừa) - ba điều kiện như `_checkngay`.
    5. CÓ VIỆC CỦA CHÍNH HỌ KHÔNG, hoặc ít nhất có được CHỈ ĐƯỜNG (thiếu).
    6. QUYỀN CÓ LỆCH GIỮA HAI NGƯỜI CÙNG CHỨC DANH KHÔNG (sai lệch) - hai nhân viên tư vấn phải
       làm được đúng một tập hành động CH3 như nhau; khác nhau là phân quyền đang rò theo người.
    7. PHẠM VI DỮ LIỆU CÓ THẬT SỰ CẮT THEO NGƯỜI KHÔNG - nếu app khai phạm vi là chi nhánh mà
       hai người khác chi nhánh vẫn nhìn thấy y hệt nhau thì phân quyền chỉ là trang trí.
    8. TRỢ LÝ CÓ NHỊP NGÀY CHO HỌ KHÔNG, VÀ CÓ BÀI HƯỚNG DẪN CHO NHÓM CỦA HỌ KHÔNG.

   Chạy: ITTS_APP=./_APP.js node _checknguoi.js   (hoặc _APP6.js cho bản v6) */

const APP = process.env.ITTS_APP || "./_APP.js";
const FS = require("fs");

/* Neo đồng hồ vào mốc bộ dữ liệu TRƯỚC khi nạp app - dữ liệu demo đứng yên, đồng hồ thật thì
   chạy; đo cái đứng yên bằng cái đang chạy là xanh buổi sáng đỏ buổi chiều. Bẫy đã cắn bảy lần. */
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

const V6BAN = (typeof V6 === "function") && V6();
const xau = [], canh = [];
let soNguoi = 0, soTrang = 0;

/* Ai đang đi làm. Người đã nghỉ không cần đăng nhập được - nhưng cũng không được biến mất khỏi
   sổ nhân sự, chuyện đó `_checkdata` canh. */
function dsNguoi() {
  /* DÙNG ĐÚNG ĐỊNH NGHĨA CỦA APP (`staffActive`), đừng viết lại luật bằng chữ của mình. Bản đầu
     bộ kiểm này lọc bằng /active|đang|working/ - mà chuỗi "inactive (Đã nghỉ việc)" CHỨA chữ
     "active", nên 4 người đã nghỉ vẫn lọt vào và được chấm như người đang đi làm. Đo bằng một
     cái đúng-gần-đúng thì kết quả cũng gần đúng, mà "gần đúng" trong một bản kiểm là sai. */
  return (DL.DL01 || []).filter(s => s.staff_id && staffActive(s));
}

/* Vào app đúng như người ấy bấm vào thẻ tên mình ở cổng: gateEnter -> applyScope -> enter.
   Ở đây không gọi `enter()` (nó đụng tới màn hình đăng nhập) mà gọi thẳng hai việc enter làm:
   đặt danh tính rồi dựng lại thanh trên + menu. */
function dangNhap(sid) {
  window.GATE_SID = sid;
  applyScope(sid);
  setRole("all");
}

function trangTrong(h) {
  if (!/class="empty"/.test(h)) return false;
  if (/<tbody|class="banrow"|class="lrow"/.test(h)) return false;
  const so = (String(h).replace(/<[^>]*>/g, " ").match(/\b\d+\b/g) || []).map(Number);
  return !so.some(n => n > 0);
}

function motNguoi(S) {
  const ten = (S.full_name || S.staff_id) + " [" + (ecode(S.role) || S.role) + "]" +
              (S.branch ? (" · " + S.branch) : "");
  let R = {ten: ten, sid: S.staff_id, vai: ecode(S.role) || String(S.role || ""), loi: []};
  try { dangNhap(S.staff_id); }
  catch (e) { R.loi.push("dang nhap NEM LOI: " + String(e.message).slice(0, 70)); return R; }

  /* 1. phạm vi dựng ra có thật */
  const rs = SCOPE() || {};
  R.nhom = rs.group || "";
  R.dap = rs.land || "";
  if (!R.nhom || !ROLESCOPE[R.nhom]) R.loi.push("khong dung duoc pham vi (nhom='" + R.nhom + "')");
  if (!R.dap || !PBK[R.dap]) R.loi.push("trang dap khong co that: '" + R.dap + "'");

  /* 2. thanh trên phải là CHÍNH HỌ. `setRole` ghi thẳng vào #meName / #meRole, nên đọc lại
     đúng chỗ ấy - đây là câu duy nhất bắt được cảnh "đăng nhập một người, màn hình của người
     khác", mà đó lại là lỗi nguy hiểm nhất trong cả bảng phân quyền. */
  const meN = String((STORE.meName || {}).textContent || "");
  const meR = String((STORE.meRole || {}).textContent || "");
  if (meN.indexOf(S.staff_id) < 0) R.loi.push('thanh tren khong hien dung nguoi: "' + meN + '"');
  const nhanVai = elabel(S.role) || "";
  if (nhanVai && meR.indexOf(nhanVai) < 0 && meR.indexOf("Quản trị") < 0)
    R.loi.push('thanh tren ghi chuc danh khac: "' + meR + '" (ho la "' + nhanVai + '")');

  /* 3. trang đáp có nội dung */
  let hDap = "";
  try { CUR = R.dap; hDap = String(PBK[R.dap] && PBK[R.dap].ty === "list" ? renderList(R.dap) : (RENDER[R.dap] ? RENDER[R.dap]() : "")); }
  catch (e) { R.loi.push("trang dap NEM LOI: " + String(e.message).slice(0, 70)); }
  R.daiDap = hDap.length;
  if (hDap.length < 600) R.loi.push("trang dap '" + R.dap + "' gan nhu trang (" + hDap.length + " ky tu)");

  /* 4. mọi mục trên menu CỦA HỌ phải vẽ được và không mục nào mở ra trống.
     ĐỌC MENU ĐÃ VẼ RA, không đọc danh mục gốc. Bản đầu của bộ kiểm này duyệt `navCay()` rồi hỏi
     `canSee` từng mục - và tố oan cả 37 người là "menu bày ra 30 mấy mục không được xem", trong
     khi `navCay()` chỉ là CÂY ĐẦY ĐỦ còn `buildNav` mới lọc bằng `navVis` trước khi vẽ. Đo cái
     danh mục thay cho cái menu thì con số nào cũng to và cũng sai. */
  let muc = [];
  try {
    buildNav();
    const nav = String((STORE.nav || {}).innerHTML || "");
    const re = /data-k="([^"]+)"/g, m2 = [];
    let mm; while ((mm = re.exec(nav))) if (m2.indexOf(mm[1]) < 0) m2.push(mm[1]);
    muc = m2;
  } catch (e) {}
  R.soMuc = muc.length;
  if (!muc.length) R.loi.push("menu ve ra KHONG CO MUC NAO");
  const trong = [], duoi = [];
  muc.forEach(k => {
    /* BẤM THẬT VÀO MỤC ẤY. Không hỏi `canSee(k)` - nhiều mục trên menu là TAB CON của một hub
       (duyetgiao, duyetck...) hoặc là nhóm chặng, `go()` remap sang trang cha rồi mới xét quyền,
       nên hỏi thẳng canSee trên mã tab là tố oan (đã cắn ngay ở bản đầu bộ kiểm này).
       Hỏi đúng lời hứa của app (V9.51): *menu không được mời vào trang mà `go()` sẽ đóng sập*. */
    let h = "";
    try { go(k); h = String((STORE.content || {}).innerHTML || ""); }
    catch (e) { R.loi.push("bam muc '" + k + "' NEM LOI: " + String(e.message).slice(0, 60)); return; }
    soTrang++;
    if (/ngoài phạm vi chức danh của bạn/.test(h)) duoi.push(k);
    if (trangTrong(h)) trong.push(k);
  });
  R.trong = trong;
  if (duoi.length) R.loi.push("menu MOI ROI DUOI - bam vao chi nhan man tu choi: " + duoi.join(", "));

  /* 5. việc của chính họ, hoặc chỉ đường */
  let cuaToi = 0, hoSo = 0;
  try {
    (TTHE || []).forEach(x => {
      ttDanhSach(x.k).forEach(z => { hoSo++; cuaToi += z.viec.length; });
    });
  } catch (e) {}
  R.viec = cuaToi; R.hoSo = hoSo;
  let chiDuong = false, bangViec = 0;
  try { CUR = "ban"; window.BANMO = ""; chiDuong = /Việc của bạn ở/.test(String(renderBan() || "")); } catch (e) {}
  try { CUR = R.dap; bangViec = String(bangViecHTML() || "").length; } catch (e) {}
  R.bangViec = bangViec;
  if (!cuaToi && !bangViec && !chiDuong)
    R.loi.push("mo app ra KHONG co viec nao cua ho, khong bang viec, cung khong duoc chi duong");

  /* 6. quyền CH3 của người này */
  const quyen = [];
  Object.keys(CH3BY || {}).forEach(k => { let ok = false; try { ok = !!canAct(k); } catch (e) {} if (ok) quyen.push(k); });
  R.quyen = quyen.sort().join(",");
  R.soQuyen = quyen.length;

  /* 7. phạm vi dữ liệu người này nhìn thấy - lấy vân tay để so giữa những người cùng chức danh */
  const van = [];
  ["DL02", "DL09", "DL10", "DL06", "DL07"].forEach(code => {
    let n = -1; try { n = srows(code).length; } catch (e) {}
    van.push(code + ":" + n);
  });
  R.van = van.join(" ");
  /* NGƯỜI GẮN VỚI MỘT CƠ SỞ MÀ NHÌN THẤY TRỌN CẢ BẢNG thì cái khai "mine/team" chỉ là chữ.
     Đây là câu bắt được lỗi thật của V9.91: Leader Tư vấn Cơ sở 1 khai "team" mà thấy đủ 82
     học viên của cả 5 cơ sở - bằng đúng Trưởng phòng. Chỉ soi người CÓ cơ sở: trưởng phòng và
     giám đốc không gắn cơ sở nào, họ thấy hết là đúng phận sự.
     Và chỉ soi bảng thật sự trải trên nhiều cơ sở - bảng dồn hết vào một cơ sở thì thấy 100%
     là chuyện bình thường, tố vào đó là tố oan. */
  if (S.branch) {
    Object.keys(DSDOM || {}).forEach(code => {
      const dom = DSDOM[code];
      let lv = ""; try { lv = dsLevel(dom); } catch (e) {}
      if (lv !== "mine" && lv !== "team") return;
      let tong = [], thay = 0;
      try { tong = rows(code); thay = srows(code).length; } catch (e) { return; }
      if (tong.length < 5) return;
      const cs = {}; tong.forEach(r => { const b = r.branch || r.study_location || ""; if (b) cs[b] = 1; });
      if (Object.keys(cs).length < 2) return;
      if (thay >= tong.length)
        R.loi.push("khai pham vi '" + lv + "' cho " + code + " nhung nhin thay TRON BANG (" +
          thay + "/" + tong.length + " dong, trai tren " + Object.keys(cs).length + " co so)");
    });
  }
  R.muc = {}; try { ["lead", "hocvien", "lop", "tien"].forEach(d => { try { R.muc[d] = dsLevel(d); } catch (e) {} }); } catch (e) {}

  /* 8. Trợ lý + bài hướng dẫn của nhóm họ */
  let nhip = 0; try { nhip = (nhipList() || []).length; } catch (e) {}
  R.nhip = nhip;
  if (nhip < 3) R.loi.push("Tro ly chi co " + nhip + " dong nhip ngay cho ho (can >=3)");
  let coBai = false;
  try {
    coBai = Object.keys(TOURS || {}).some(k => {
      const T = TOURS[k] || {};
      return String(T.nhom || "") === R.nhom || String(T.role || "").length > 0 && tourNhom(k) === R.nhom;
    });
  } catch (e) { coBai = true; }        /* app không khai nhóm cho bài thì không tính là lỗi của người này */
  return R;
}

/* ---- chạy ---------------------------------------------------------------------------------- */
(function () {
  const ds = dsNguoi();
  if (ds.length < 5) { console.log("CHECKNGUOI FAIL: doc duoc " + ds.length + " nguoi trong DL01"); process.exit(1); }

  const KQ = [];
  ds.forEach(S => { soNguoi++; const r = motNguoi(S); KQ.push(r);
    r.loi.forEach(x => xau.push(r.ten + ": " + x));
    /* Mục mở ra trống là chỗ KHÓ CHỊU chứ chưa chắc là hỏng (có người thật sự đang không có
       việc gì ở mảng đó hôm nay), nên ghi cảnh báo chứ không chấm đỏ - nhưng phải in ra, im
       lặng thì mãi mãi không ai dọn. */
    if (r.trong && r.trong.length)
      canh.push(r.ten + ": " + r.trong.length + " muc tren menu cua ho mo ra TRONG - " + r.trong.join(", "));
  });

  /* 6bis. QUYỀN PHẢI GIỐNG NHAU GIỮA NHỮNG NGƯỜI CÙNG MỘT CHỨC DANH.
     Quyền là thuộc tính của CHỨC DANH (bảng CH3), phạm vi mới là thuộc tính của NGƯỜI. Hai nhân
     viên tư vấn khác cơ sở phải làm được đúng một tập hành động; nếu lệch thì `canAct` đang đọc
     nhầm thứ gì đó của cá nhân - loại rò rỉ không ai nhìn thấy cho tới khi một người "không bấm
     được nút mà đồng nghiệp bấm được". */
  const theoVai = {};
  KQ.forEach(r => { (theoVai[r.vai] = theoVai[r.vai] || []).push(r); });
  Object.keys(theoVai).forEach(v => {
    const nhom = theoVai[v]; if (nhom.length < 2) return;
    const mau = nhom[0];
    nhom.slice(1).forEach(r => {
      if (r.quyen !== mau.quyen)
        xau.push("QUYEN LECH trong cung chuc danh '" + v + "': " + mau.ten + " lam duoc " + mau.soQuyen +
          " viec, con " + r.ten + " lam duoc " + r.soQuyen + " viec");
    });
  });

  /* 7bis. PHẠM VI PHẢI CẮT THẬT. Chức danh nào app tự khai phạm vi là "chi nhánh" mà mọi người
     trong chức danh ấy lại nhìn thấy y hệt nhau thì cái khai đó chỉ là chữ. Chỉ soi khi trong
     chức danh có người ở HAI cơ sở khác nhau trở lên - cùng một cơ sở thì giống nhau là đúng. */
  Object.keys(theoVai).forEach(v => {
    const nhom = theoVai[v]; if (nhom.length < 2) return;
    const mucLead = (nhom[0].muc || {}).lead, mucHV = (nhom[0].muc || {}).hocvien;
    const theoCS = /branch|cs|chi nhanh/i.test(String(mucLead)) || /branch|cs|chi nhanh/i.test(String(mucHV));
    if (!theoCS) return;
    const cs = {}; nhom.forEach(r => { const S = find("DL01", "staff_id", r.sid) || {}; cs[String(S.branch || "")] = 1; });
    if (Object.keys(cs).length < 2) return;
    const van = {}; nhom.forEach(r => { van[r.van] = 1; });
    if (Object.keys(van).length === 1)
      canh.push("chuc danh '" + v + "' khai pham vi theo co so (" + Object.keys(cs).length +
        " co so) nhung ca " + nhom.length + " nguoi nhin thay Y HET nhau: " + nhom[0].van);
  });

  /* ---- in ---- */
  const ban = V6BAN ? "V6" : "V5";
  /* Con số làm cho chữ "xanh" có nghĩa: 37 người mà chỉ có 3 vân tay dữ liệu thì phân quyền
     không cắt theo người, dù không câu nào đỏ. In ra để đọc được, đừng bắt tin suông. */
  const van = {}, quyen = {};
  KQ.forEach(r => { van[r.van] = 1; quyen[r.quyen] = 1; });
  const viec = KQ.map(r => r.viec), it = KQ.filter(r => !r.viec).length;
  const tomTat = soNguoi + " nguoi (" + Object.keys(theoVai).length + " chuc danh) · " + soTrang +
    " luot ve trang · " + Object.keys(van).length + " pham vi du lieu khac nhau · " +
    Object.keys(quyen).length + " bo quyen khac nhau · viec cua chinh ho " +
    Math.min.apply(null, viec) + "-" + Math.max.apply(null, viec) +
    (it ? (" (" + it + " nguoi khong co viec nao)") : "") + " · ban " + ban;
  if (xau.length) {
    console.log("CHECKNGUOI FAIL (" + xau.length + "): " + tomTat);
    xau.slice(0, 30).forEach(x => console.log("  - " + x));
    if (xau.length > 30) console.log("  ... con " + (xau.length - 30) + " cho nua");
    process.exit(1);
  }
  console.log("CHECKNGUOI OK: " + tomTat + " - ai dang nhap cung dung ten minh, dung pham vi minh, co viec de lam");
  if (canh.length) { console.log("  canh bao (khong tinh do):"); canh.forEach(x => console.log("    · " + x)); }
})();
