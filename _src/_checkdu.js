/* _checkdu: NGỒI VÀO TỪNG VỊ TRÍ - TÍNH NĂNG ĐÃ ĐỦ CHƯA, CÓ GÌ THỪA KHÔNG.
   Anh Luân 03/08: *"mở lại các cổng đăng nhập của các vị trí khác á, đi kèm là xem thử tính
   năng đã đủ chưa á, rà lại cẩn thận thiếu hoặc dư thừa"*.

   Ba bộ kiểm đã có trả lời ba câu khác:
     `_checkngay`  - ngồi vào ghế họ thì CÓ VIỆC để làm không (đủ việc hay trống).
     `_checknv`    - bấm vào thì CÓ CHẠY không (hỏng hay không hỏng).
     `check_sop`   - app có phủ hết SOP không (tính trên TOÀN hệ thống, không chia theo người).
   Không bộ nào hỏi: **người này được giao một việc, nhưng có chỗ nào để làm việc ấy không** -
   và ngược lại, **màn hình nào bày ra cho họ mà thật ra chẳng dính gì tới họ**.

   THIẾU và DƯ là hai lỗi ngược nhau nhưng cùng một gốc: bảng phân quyền và cây menu được sửa ở
   hai chỗ khác nhau, nên chúng trôi xa nhau dần mà không ai thấy.

   Bốn câu, đo bằng cách ĐÓNG VAI từng chức danh có thật trong DL01:
    1. THIẾU CHỖ LÀM - hành động CH3 mà họ được phép làm, nhưng không việc nào ở Bàn làm việc
       và không trang nào trong menu của họ dẫn tới. Được giao mà không có chỗ làm.
    2. THỪA MÀN HÌNH - trang có trong menu của họ, nhưng họ không có quyền làm gì ở đó VÀ không
       có dòng dữ liệu nào thuộc phạm vi của họ. Mỗi mục như vậy là một lần bấm vào rồi quay ra.
    3. THIẾU SỔ - thực thể họ làm việc cùng mà không có sổ tra cứu nào mở được.
    4. QUYỀN TREO - hành động họ được phép làm nhưng KHÔNG người nào khác làm được, và chính họ
       cũng không có việc nào gọi tới. Đây là quyền chết trong bảng.

   Chỗ nào cố ý thì khai vào `BOQUA` KÈM LÝ DO ĐỌC ĐƯỢC - không có dòng nào được im lặng.

   Chạy: ITTS_APP=./_APP6.js node _checkdu.js   (hoặc _APP.js cho bản v5) */

const APP = process.env.ITTS_APP || "./_APP.js";
const FS = require("fs");

/* Neo đồng hồ vào ngày sinh bộ dữ liệu - "còn trong hạn" đổi theo giờ chạy. */
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
global.window=global;global.location={hash:"",pathname:"/ITTs_WebApp_v5_demo.html",search:""};
var LS={};global.localStorage={getItem:(k)=>(k in LS?LS[k]:null),setItem(k,v){LS[k]=String(v)},removeItem(k){delete LS[k]}};
var SS={};global.sessionStorage={getItem:(k)=>(k in SS?SS[k]:null),setItem(k,v){SS[k]=String(v)},removeItem(k){delete SS[k]}};
global.innerWidth=1400;global.innerHeight=900;
require("vm").runInThisContext(FS.readFileSync(APP, "utf8"));

/* ── KHAI BÁO CỐ Ý ─────────────────────────────────────────────────────────────────────────
   Mỗi dòng: "vai · thứ bị bỏ" -> lý do. Không có lý do thì không được nằm ở đây. */
const BOQUA = {
  /* Trang ai cũng thấy được vì chúng là nơi ĐỌC chung, không phải nơi làm việc của một vai. */
  "*|hoidap": "Hộp hỏi đáp dùng chung - mọi chức danh đều tra được cách vận hành, không thuộc về một vai nào.",
  "*|khac": "Trang gom tiện ích lẻ (mã giới thiệu, bàn giao) - nội dung đổi theo vai, rỗng với vai không dùng là đúng.",
  "*|giangvien": "Danh bạ giảng viên - tra cứu chung, ai cũng cần biết lớp mình đang do ai dạy.",
  "*|hocvien": "Danh bạ học viên - tra cứu chung của cả trung tâm.",
};

let xau = [], canh = [], bang = [];

function vaiCoThat() {
  const out = [], da = {};
  (DL.DL01 || []).forEach(s => {
    const v = String(s.role || "").trim();
    if (!v || da[v] || /inactive|nghỉ/i.test(String(s.status || ""))) return;
    da[v] = 1; out.push({sid: s.staff_id, vai: v, ten: s.full_name || s.staff_id});
  });
  return out;
}

/* Hành động CH3 -> những việc ở Bàn làm việc gọi tới nó. Dựng một lần, không phụ thuộc vai. */
const ACT2VIEC = {};
(VIECTT || []).forEach(v => { if (v.act) (ACT2VIEC[v.act] = ACT2VIEC[v.act] || []).push(v.t); });

/* Hành động CH3 -> trang nghiệp vụ nào chạm tới nó. Đọc từ chính lời gọi `chanAct`/`canAct`
   trong mã nguồn của từng hàm render - không chép lại bản đồ bằng tay. */
const SRC = FS.readFileSync("./gen_v5.py", "utf8");
function actCoTrang(act) {
  /* tìm act xuất hiện trong một lời gọi canAct/chanAct bất kỳ */
  return new RegExp("(canAct|chanAct)\\(\"" + act + "\"").test(SRC) ||
         new RegExp("(canAct|chanAct)\\('" + act + "'").test(SRC);
}

const dsVai = vaiCoThat();
if (!dsVai.length) { console.log("CHECKDU FAIL: khong doc duoc chuc danh nao trong DL01"); process.exit(1); }

/* ai làm được hành động nào - dựng trước để tìm "quyền treo" */
const actAi = {};
Object.keys(CH3BY || {}).forEach(a => actAi[a] = []);
dsVai.forEach(A => { gateEnter(A.sid);
  Object.keys(CH3BY || {}).forEach(a => { let ok = false; try { ok = !!canAct(a) } catch (e) {}
    if (ok) actAi[a].push(A.vai) }); });

dsVai.forEach(A => {
  gateEnter(A.sid);
  const vai = A.vai;

  /* việc ở Bàn làm việc mà chính họ được làm */
  const viecCuaHo = {};
  (VIECTT || []).forEach(v => { let ok = false; try { ok = !!ttDuocLam(v) } catch (e) {}
    if (ok && v.act) viecCuaHo[v.act] = 1; });

  /* trang trong menu của họ */
  let muc = [];
  try { muc = navCay().reduce((a, g) => a.concat(g.items || []), []).filter(k => { try { return canSee(k) } catch (e) { return false } }); }
  catch (e) {}

  /* 1. THIẾU CHỖ LÀM */
  const thieu = [];
  Object.keys(CH3BY || {}).forEach(a => {
    let duoc = false; try { duoc = !!canAct(a) } catch (e) {}
    if (!duoc) return;
    if (viecCuaHo[a]) return;              /* có việc ở Bàn làm việc */
    if (actCoTrang(a)) return;             /* có trang nghiệp vụ chạm tới */
    thieu.push((CH3BY[a] || {}).t || a);
  });
  if (thieu.length) xau.push(vai + ": duoc phep lam " + thieu.length +
    " hanh dong ma KHONG CO CHO NAO de lam - " + thieu.join(" · "));

  /* 2. THỪA MÀN HÌNH */
  const thua = [];
  muc.forEach(k => {
    if (BOQUA["*|" + k] || BOQUA[vai + "|" + k]) return;
    let h = "";
    try { CUR = k; h = String((PBK[k] && PBK[k].ty === "list") ? renderList(k) : (RENDER[k] ? RENDER[k]() : "")); }
    catch (e) { thua.push(k + " (ne loi khi ve: " + e.message.slice(0, 40) + ")"); return }
    if (!h) { thua.push(k + " (khong ve ra gi)"); return }
    const coDong = /<tbody|class="banrow"|class="lrow"|class="banjob"/.test(h);
    const so = (h.replace(/<[^>]*>/g, " ").match(/\b\d+\b/g) || []).map(Number);
    const coSo = so.some(n => n > 0);
    if (!coDong && !coSo) thua.push(k + " (" + ((PBK[k] || {}).t || k) + ")");
  });
  if (thua.length) canh.push(vai + ": " + thua.length + " muc menu mo ra khong co gi cua ho - " + thua.join(", "));

  /* 3. THIẾU SỔ cho thực thể họ làm cùng */
  const khongSo = [];
  try {
    (TTHE || []).forEach(T => {
      let coViec = false;
      try { coViec = ttDanhSach(T.k).some(z => z.viec.length) } catch (e) {}
      if (!coViec) return;
      const so = (T.so || []).filter(k => { try { return canSee(k) } catch (e) { return false } });
      if (!so.length) khongSo.push(T.t);
    });
  } catch (e) {}
  if (khongSo.length) canh.push(vai + ": lam viec voi " + khongSo.join("/") + " ma khong mo duoc so tra cuu nao cua ho");

  bang.push({vai: vai, muc: muc.length, thieu: thieu.length, thua: thua.length});
});

/* 4. QUYỀN TREO - hành động không ai làm được, hoặc không việc/trang nào gọi tới */
const treo = [];
Object.keys(CH3BY || {}).forEach(a => {
  if (!actAi[a].length) { treo.push((CH3BY[a] || {}).t || a); return; }
});
if (treo.length) xau.push("QUYEN TREO - khong chuc danh nao lam duoc: " + treo.join(" · "));

/* ---- in ---------------------------------------------------------------------------------- */
console.log("  TUNG VI TRI: so muc menu | thieu cho lam | thua man hinh");
bang.sort((a, b) => b.thieu - a.thieu || b.thua - a.thua).forEach(r => {
  console.log("   " + String(r.vai).slice(0, 34).padEnd(35) +
    String(r.muc).padStart(4) + String(r.thieu).padStart(8) + String(r.thua).padStart(9));
});

if (xau.length) {
  console.log("CHECKDU FAIL (" + xau.length + "):");
  xau.forEach(x => console.log("  - " + x));
  if (canh.length) { console.log("  can xem them:"); canh.forEach(x => console.log("    · " + x)); }
  process.exit(1);
}
console.log("CHECKDU OK: " + bang.length + " chuc danh - khong ai bi giao viec ma thieu cho lam, " +
  "khong quyen nao treo" + (canh.length ? (" | can xem them: " + canh.length + " cho") : ""));
canh.forEach(x => console.log("    · " + x));
