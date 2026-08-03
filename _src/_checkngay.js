/* _checkngay: MỘT NGÀY LÀM VIỆC CỦA TỪNG CHỨC DANH - đo chỗ KẸT, không đo chỗ hỏng.
   Anh Luân hỏi (02/08): *"Các nhân viên bảo v5 hoặc v6 đang thiếu gì, hoặc trải nghiệm không
   tốt chỗ nào?"* Sự thật là chưa ai dùng thử nên chưa ai nói gì. Nhưng có mấy dạng "kẹt" máy
   hỏi thay được, và chúng khác hẳn cái `_checknv` hỏi:
     `_checknv` hỏi "bấm vào có chạy không" - hỏng hay không hỏng.
     Bộ này hỏi "ngồi vào ghế người ta thì có làm được việc không" - đủ hay thiếu.

   Sáu câu, mỗi câu là một kiểu khổ có thật của người ngồi làm:
    1. MỞ APP RA CÓ VIỆC KHÔNG. Chức danh nào mở app ra thấy 0 việc thì hoặc dữ liệu demo bỏ
       quên họ, hoặc app không biết tìm việc cho họ - cả hai đều làm người thật mất tin ngay
       ngày đầu.
    2. VIỆC MỒ CÔI. Việc nổi lên trên hồ sơ mà KHÔNG chức danh nào được phép làm - nó sẽ nằm
       đó mãi mãi. Đây là lỗ thủng của quy trình, không phải lỗi giao diện, và không bộ kiểm
       nào khác hỏi tới.
    3. THẤY MÀ KHÔNG ĐƯỢC LÀM nhiều tới mức nào. Khối "bộ phận khác đang làm" là cố ý (quyền
       chặn tay, không che mắt), nhưng nếu một chức danh mở hồ sơ ra mà PHẦN LỚN là việc của
       người khác thì màn hình ấy đang làm phiền họ nhiều hơn giúp.
    4. BAO XA TỚI VIỆC ĐẦU TIÊN. Đếm số màn phải qua từ lúc vào app tới lúc chạm được việc đầu
       tiên. Người thật đo phần mềm bằng đúng con số này mỗi sáng.
    5. TRANG TRỐNG TRONG MENU CỦA CHÍNH MÌNH. Mục có trên menu mà mở ra không có gì - mỗi mục
       như vậy là một lần bị lừa.
    6. VIỆC KHÔNG AI SỜ TỚI ĐƯỢC TỪ BÀN LÀM VIỆC. Việc app biết (bảng việc / trigger) mà không
       nổi lên trên hồ sơ nào ở Bàn làm việc - biết mà không tới được cũng là ngõ cụt.

   Chạy: ITTS_APP=./_APP.js node _checkngay.js   (hoặc _APP6.js cho bản v6) */

const APP = process.env.ITTS_APP || "./_APP.js";

/* App được viết cho trình duyệt - dựng bộ khung DOM tối thiểu y như các bộ kiểm chuỗi khác.
   Neo đồng hồ vào mốc của bộ dữ liệu demo TRƯỚC khi nạp app: nạp xong mới neo thì app đã đọc
   giờ thật rồi. Bẫy "thước đang chạy" - dự án này đã cắn năm lần. */
const FS = require("fs");
try {
  const meta = JSON.parse(FS.readFileSync("./demo_data_big.json", "utf8")).meta || {};
  const m = String(meta.anchor || "").match(/^(\d{2})\/(\d{2})\/(\d{4})\s+(\d{2}):(\d{2})$/);
  if (m) {
    const moc = new Date(+m[3], +m[2] - 1, +m[1], +m[4], +m[5]).getTime();
    const D = Date;
    global.Date = function (...a) { return a.length ? new D(...a) : new D(moc); };
    global.Date.now = () => moc;
    global.Date.prototype = D.prototype;
    global.Date.parse = D.parse; global.Date.UTC = D.UTC;
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

let xau = [], canh = [], soLieu = [];

function vaiCoThat() {
  const out = [], da = {};
  (DL.DL01 || []).forEach(s => {
    const v = String(s.role || "").trim();
    if (!v || da[v]) return;
    da[v] = 1;
    out.push({sid: s.staff_id, vai: v, ten: s.full_name || s.staff_id});
  });
  return out;
}

/* ---- 2. VIỆC MỒ CÔI: việc nào không chức danh nào được làm --------------------------------- */
function viecMoCoi(dsVai) {
  const moCoi = [];
  (VIECTT || []).forEach(v => {
    let aiLam = [];
    dsVai.forEach(A => {
      try {
        gateEnter(A.sid);
        if (ttDuocLam(v)) aiLam.push(A.vai);
      } catch (e) {}
    });
    if (!aiLam.length) moCoi.push(v.tt + " · " + v.t +
      (v.act ? (" (CH3: " + v.act + ")") : (" (vai khai: " + (v.vai || []).join(",") + ")")));
  });
  return moCoi;
}

/* ---- 1,3,4,5,6 · đóng vai từng người rồi hỏi ---------------------------------------------- */
function motNgay(A, dsTT) {
  gateEnter(A.sid);
  let coViec = 0, cuaToi = 0, cuaNguoiKhac = 0, hoSo = 0;
  dsTT.forEach(k => {
    let ds = [];
    try { ds = ttDanhSach(k); } catch (e) { return; }
    ds.forEach(z => {
      hoSo++;
      if (z.viec.length) { coViec++; cuaToi += z.viec.length; }
      cuaNguoiKhac += (z.khac || 0);
    });
  });

  /* BẢNG VIỆC CỦA CHỨC DANH - phải VẼ THẬT rồi đếm ô, không hỏi một biến toàn cục nào.
     Bản đầu của bộ kiểm này hỏi `BANGVIEC[vai]` - một biến KHÔNG TỒN TẠI - nên nó trả 0 cho cả
     18 chức danh và suýt tố oan ba người Nhân sự là "mở app ra trắng bảng". Đo bằng cái không
     có thì bao giờ cũng ra 0, mà số 0 trông y hệt một phát hiện. */
  let bangViec = 0;
  try {
    CUR = SCOPE().land || "ban";
    const h = String(bangViecHTML() || "");
    bangViec = (h.match(/class="(bvcell|bvo|stat)/g) || []).length || (h.length > 200 ? 1 : 0);
  } catch (e) {}

  /* 4. bao xa tới việc đầu tiên: vào app -> trang đáp -> (nếu trang đáp không phải Bàn làm
     việc thì phải đi thêm) -> chọn thực thể -> mở hồ sơ -> bấm Làm */
  let dap = "";
  try { dap = SCOPE().land || ""; } catch (e) {}
  const buoc = (dap === "ban") ? 2 : 3;   /* mở hồ sơ + bấm Làm; cộng 1 nếu phải đi tới Bàn làm việc */

  /* 5. trang trống trong menu của chính mình */
  const trong = [];
  let muc = [];
  try {
    muc = navCay().reduce((a, g) => a.concat(g.items || []), []);
  } catch (e) {}
  muc.forEach(k => {
    let thay = false;
    try { thay = canSee(k); } catch (e) {}
    if (!thay || !RENDER[k]) return;
    let h = "";
    try { h = String(RENDER[k]() || ""); } catch (e) { return; }
    /* "TRỐNG VỚI NGƯỜI NÀY" là một câu khó hơn nó tưởng. Bản đầu của bộ kiểm chỉ hỏi "có khối
       .empty không" - và nó tố oan cả CEO là trang Giao việc trống, trong khi CEO đang có 1 việc
       chờ xác nhận và 3 việc đang chạy: trang ấy có NHIỀU danh sách, một cái rỗng là đủ sinh ra
       .empty. Nay phải đủ ba điều mới gọi là trống: app tự khai .empty · không bảng, không dòng
       danh sách nào · và MỌI con số trên các ô đếm đều bằng 0. */
    if (!/class="empty"/.test(h)) return;
    if (/<tbody|class="banrow"|class="lrow"/.test(h)) return;
    const so = (String(h).replace(/<[^>]*>/g, " ").match(/\b\d+\b/g) || []).map(Number);
    if (so.some(n => n > 0)) return;
    trong.push(k);
  });

  /* có chỉ đường không - hỏi trên MÀN VẼ THẬT, không hỏi mã nguồn */
  let chiDuong = false;
  try { CUR = "ban"; window.BANMO = ""; chiDuong = /Việc của bạn ở/.test(String(renderBan() || "")); }
  catch (e) {}

  return {vai: A.vai, hoSo: hoSo, coViec: coViec, cuaToi: cuaToi, cuaNguoiKhac: cuaNguoiKhac,
          bangViec: bangViec, dap: dap, buoc: buoc, trong: trong, chiDuong: chiDuong};
}

(function () {
  const dsVai = vaiCoThat();
  const dsTT = (typeof TTHE !== "undefined") ? TTHE.map(x => x.k) : [];
  if (!dsVai.length || !dsTT.length) {
    console.log("CHECKNGAY FAIL: khong doc duoc danh sach chuc danh hoac thuc the");
    process.exit(1);
  }

  const moCoi = viecMoCoi(dsVai);
  if (moCoi.length) xau.push("VIEC MO COI - khong chuc danh nao duoc lam, se nam do mai mai: " +
    moCoi.join(" · "));

  dsVai.forEach(A => {
    const r = motNgay(A, dsTT);
    soLieu.push(r);
    /* 1. mở app ra không có việc nào */
    if (!r.cuaToi && !r.bangViec)
      xau.push(r.vai + ": mo app ra KHONG CO VIEC NAO - ca ban lam viec lan bang viec deu rong");
    /* 1bis. KHÔNG CÓ VIỆC TRÊN BỐN ĐỐI TƯỢNG THÌ PHẢI ĐƯỢC CHỈ ĐƯỜNG.
       Ba chức danh Nhân sự đáp xuống Bàn làm việc rồi thấy 344 hồ sơ mà 0 việc của mình - hơn
       90% màn hình là của bộ phận khác. Đứng trước một danh sách không phải của mình mà không
       ai nói việc mình ở đâu là một buổi sáng đầu tiên rất tệ. Không bắt app bịa ra việc cho
       họ; bắt app CHỈ ĐƯỜNG. */
    if (!r.cuaToi && !r.chiDuong)
      xau.push(r.vai + ": Ban lam viec khong co viec nao cua ho (" + r.hoSo +
        " ho so, " + r.cuaNguoiKhac + " viec cua bo phan khac) ma KHONG CHI DUONG viec cua ho o dau");
    /* 3. thấy mà không được làm nhiều hơn việc của mình */
    if (r.cuaToi && r.cuaNguoiKhac > r.cuaToi * 2)
      canh.push(r.vai + ": tren ho so cua ho, viec CUA NGUOI KHAC (" + r.cuaNguoiKhac +
        ") nhieu gap " + (r.cuaNguoiKhac / r.cuaToi).toFixed(1) + " lan viec cua chinh ho (" +
        r.cuaToi + ")");
    /* 5. trang trống trong menu của chính mình */
    if (r.trong.length)
      canh.push(r.vai + ": " + r.trong.length + " muc tren menu cua ho mo ra TRONG - " +
        r.trong.join(", "));
  });

  /* 7. BÀI HƯỚNG DẪN CÓ ĐANG TẢ ĐÚNG APP KHÔNG.
     `_checktour` canh các BƯỚC chạy được - neo tìm thấy, hộp vẽ ra. Nó không canh LỜI NÓI.
     Đã cắn thật: sau khi bỏ Giảng viên khỏi bốn thực thể và thêm Phụ huynh vào, bài "Bàn làm
     việc" vẫn dạy *"Khối Nhân sự thì làm việc với GIẢNG VIÊN"* và *"nhân sự thì Giảng viên"* -
     hai câu tả một app không còn tồn tại, mà mọi bộ kiểm đều xanh vì các bước vẫn chạy.
     Luật: **các bước chạy được không có nghĩa là lời nói còn đúng.** */
  const TTTEN = {}; try { (TTHE || []).forEach(x => TTTEN[String(x.t).toLowerCase()] = 1); } catch (e) {}
  const CUTHE = ["giảng viên", "giáo viên"];   /* từng là thực thể, nay không còn */
  const loiTour = [];
  try {
    Object.keys(TOURS || {}).forEach(k => {
      (TOURS[k].steps || []).forEach((st, i) => {
        if (st.p !== "ban") return;   /* chỉ soi bài nói về Bàn làm việc - nơi bốn thực thể sống */
        const txt = String((st.t || "") + " " + (st.d || "") + " " + (st.hint || "")).toLowerCase();
        /* Một từ có thể vừa là CHỨC DANH vừa từng là THỰC THỂ. "học vụ và giảng viên thì Lớp"
           là câu đúng - giảng viên ở đây là người, không phải thực thể. Bản đầu của luật này
           cấm cả hai, và nó bắt em phải bẻ câu chữ cho vừa cái thước thay vì ngược lại.
           Chỉ bắt đúng cái sai thật: từ ấy đứng ở VẾ TRẢ LỜI - ngay sau "thì", tức app đang
           gán nó làm thực thể mặc định của một nhóm. Đó chính là câu đã sai:
           *"nhân sự thì Giảng viên"*. */
        CUTHE.forEach(w => {
          if (TTTEN[w]) return;
          if (txt.indexOf("thì " + w) >= 0)
            loiTour.push(k + " buoc " + (i + 1) + ': gan "' + w + '" lam thuc the ("thi ' + w +
              '"), ma bon thuc the nay la ' + Object.keys(TTTEN).join("/"));
        });
      });
    });
  } catch (e) {}
  loiTour.forEach(x => xau.push("BAI HUONG DAN ta sai truc thuc the: " + x));

  /* ---- in bảng ---------------------------------------------------------------------------- */
  console.log("  MOT NGAY CUA TUNG CHUC DANH (ho so thay | ho so co viec | viec cua toi | " +
    "viec cua bo phan khac | bang viec | trang dap | so buoc toi viec dau tien)");
  soLieu.sort((a, b) => b.cuaToi - a.cuaToi).forEach(r => {
    console.log("   " + String(r.vai).slice(0, 34).padEnd(35) +
      String(r.hoSo).padStart(4) + String(r.coViec).padStart(5) + String(r.cuaToi).padStart(6) +
      String(r.cuaNguoiKhac).padStart(7) + String(r.bangViec).padStart(6) + "  " +
      String(r.dap || "-").padEnd(10) + r.buoc);
  });

  if (xau.length) {
    console.log("CHECKNGAY FAIL (" + xau.length + "):");
    xau.forEach(x => console.log("  - " + x));
    if (canh.length) { console.log("  can xem them:"); canh.forEach(x => console.log("    · " + x)); }
    process.exit(1);
  }
  console.log("CHECKNGAY OK: " + soLieu.length + " chuc danh - khong ai mo app ra thay bang trong, " +
    "khong viec nao mo coi" + (canh.length ? (" | can xem them: " + canh.length + " cho") : ""));
  canh.forEach(x => console.log("    · " + x));
})();
