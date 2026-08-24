/* _checkbc.js - MỖI GHẾ MỘT BẢN BÁO CÁO, KHÔNG PHẢI MỘT KHUNG CHUNG RỒI ẨN BỚT.
 *
 * ═══ VÌ SAO CÓ BỘ NÀY ═══════════════════════════════════════════════════════════════════════
 * Anh Luân 24/08: *"trang tổng quan, báo cáo và KPI hình như mỗi chức danh lại là 1 cách thiết
 * kế khác nhau mới đúng em. Chứ em dùng khung chung, cái nào có thì hiện, ko có thì ẩn anh thấy
 * ko hợp lý, ko sát với nghiệp vụ đâu"*.
 *
 * ĐO LẠI THÌ ĐÚNG TỪNG CHỮ - đóng đủ 17 chức danh rồi đếm khối vẽ ra:
 *   · NĂM khối hiện cho CẢ 17 ghế, đúng một thứ tự (3 việc nên làm · Sắp diễn ra · KPI ·
 *     Chuyên cần & Học thuật · Việc đang nợ theo phòng ban);
 *   · Trưởng phòng Nhân sự và Marketing khai `hocvien:"none"` mà vẫn nhận biểu đồ Chuyên cần &
 *     Học thuật - vẽ ra toàn số 0;
 *   · MƯỜI HAI ghế nhận bảng "Học viên nguy cơ cần theo dõi (0)";
 *   · Giáo viên WOW nhận cả Phễu chuyển đổi lẫn Phân bố trạng thái Lead - phễu bán hàng.
 *
 * **45 bộ kiểm không bộ nào đỏ**, và đọc lại thì thấy vì sao: chúng hỏi *"trang có vẽ được
 * không"*, *"có rò dữ liệu miền khác không"*, *"chữ có bị cắt không"*. Không bộ nào hỏi
 * *"trang này có phải bản báo cáo CỦA NGƯỜI NÀY không"*. Một khung chung không rò dữ liệu, không
 * gãy, không cắt chữ - nó chỉ SAI NGƯỜI, và cái sai ấy không có hình dạng nào để bắt.
 *
 * ═══ SÁU CÂU HỎI ════════════════════════════════════════════════════════════════════════════
 *   B1  MỖI GHẾ CÓ DÀN BÀI RIÊNG KHÔNG - nhóm nào vào được trang Chỉ số mà `bcKey()` rơi về
 *       "dieuhanh" là chưa ai viết dàn bài cho ghế ấy, họ đang đọc bản của Giám đốc.
 *   B2  DÀN BÀI CÓ ĐỦ TÊN VÀ CÂU HỎI KHÔNG - `hoi` là phần quan trọng nhất: viết được câu
 *       "người ngồi ghế này mở trang ra để biết điều gì" thì thứ tự khối tự lộ ra.
 *   B3  KHỐI VẼ RA CÓ ĐÚNG THỨ TỰ ĐÃ KHAI KHÔNG - thứ tự mới là cái làm nên một bản báo cáo;
 *       khai một đằng vẽ một nẻo thì bảng khai chỉ là trang trí.
 *   B4  CÓ KHỐI NÀO CỦA MIỀN NGƯỜI TA KHÔNG ĐƯỢC XEM KHÔNG - `lead:"none"` mà thấy phễu,
 *       `hocvien:"none"` mà thấy biểu đồ chuyên cần.
 *   B5  CÓ BẢNG RỖNG VÌ KHÔNG CÓ GÌ ĐỂ ĐẾM KHÔNG - bảng "Học viên nguy cơ (0)" cho ghế không
 *       có học viên nào trong phạm vi. *Một bảng rỗng vì không có gì để đếm thì khác một bảng
 *       rỗng vì mọi thứ đều ổn.*
 *   B6  HAI GHẾ KHÁC NGHIỆP VỤ CÓ ĐỌC HAI BẢN KHÁC NHAU KHÔNG - nếu Nhân sự và Học vụ vẫn ra
 *       cùng một danh sách khối thì bảng khai có mà thiết kế vẫn là một.
 *
 * Chạy: ITTS_APP=./_APP.js node _checkbc.js
 */
const APP = process.env.ITTS_APP || "./_APP.js";
const FS = require("fs");
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
var FLD = {};
function El(id) {
  return {
    id: id || "", innerHTML: "", textContent: "",
    get value() { return FLD[id] || "" }, set value(v) { FLD[id] = v },
    checked: false, dataset: {},
    style: { display: "", setProperty() {}, removeProperty() {}, getPropertyValue() { return "" } },
    offsetHeight: 230,
    classList: { add() {}, remove() {}, contains() { return false }, toggle() { return false } },
    querySelector() { return El() }, querySelectorAll() { return [] },
    getAttribute() { return "" }, setAttribute() {}, appendChild() {}, remove() {}, focus() {},
    addEventListener() {},
    getBoundingClientRect() { return { left: 10, top: 10, width: 100, height: 30, bottom: 40, right: 110 } },
    files: []
  };
}
var STORE = {};
global.document = {
  getElementById: (id) => STORE[id] || (STORE[id] = El(id)),
  querySelector: () => El(), querySelectorAll: () => [], createElement: () => El(),
  body: El("body"), addEventListener() {}
};
global.window = global; global.location = { hash: "", pathname: "/ITTs_WebApp_v5_demo.html" };
var LS = {}; global.localStorage = { getItem: k => (k in LS ? LS[k] : null), setItem(k, v) { LS[k] = String(v) }, removeItem(k) { delete LS[k] } };
var SS = {}; global.sessionStorage = { getItem: k => (k in SS ? SS[k] : null), setItem(k, v) { SS[k] = String(v) }, removeItem(k) { delete SS[k] } };
global.innerWidth = 1400; global.innerHeight = 900;
require("vm").runInThisContext(FS.readFileSync(APP, "utf8"));
const TOAST = [];
try { const _t = global.toast; global.toast = m => TOAST.push(String(m)) } catch (e) {}
setRole("all");

const xau = [];
let ok = 0;
function t(n, c, m) { if (c) ok++; else xau.push(n + (m ? (" - " + m) : "")); }

/* ── DẤU NHẬN RA TỪNG KHỐI TRÊN CHUỖI HTML VẼ RA ────────────────────────────────────────────
   Đọc bằng chuỗi chứ không bằng biến trong `BCKHOI`: phải hỏi ở tầng NGƯỜI ĐỌC THẤY, vì cái
   bảng khai chính là thứ đang bị nghi. Hỏi lại chính nó thì bao giờ cũng khớp. */
const DAU = {
  tinhhinh:  /Tình hình chung|kpiTinhHinh|sức khoẻ|sức khỏe/i,
  top3:      /việc nên làm tuần này/,
  coso:      /So sánh theo cơ sở/,
  kinhdoanh: /Tình hình kinh doanh/,
  sapdien:   /Sắp diễn ra trong/,
  kpi:       /KPI theo SOP/,
  vh11:      /Khối lượng việc theo nhân viên/,
  pheu:      /Phễu chuyển đổi/,
  leadtt:    /Phân bố trạng thái Lead/,
  hvbieu:    /Chuyên cần &amp; Học thuật|Chuyên cần & Học thuật/,
  nguon:     /Hiệu quả theo NGUỒN lead/,
  doitv:     /Hiệu suất đội tư vấn/,
  phongban:  /Việc đang nợ theo phòng ban/,
  hvnguyco:  /Học viên nguy cơ cần theo dõi/
};
/* Khối của MIỀN nào - dùng cho B4. Thấy một khối ở đây mà miền tương ứng là "none" thì đó là rò
   nghiệp vụ: không rò một dòng dữ liệu, nhưng rò cả một câu hỏi không phải của họ. */
const MIEN = {
  pheu: "lead", leadtt: "lead", nguon: "lead", doitv: "lead",
  hvbieu: "hocvien", hvnguyco: "hocvien"
};

/* Một người thật cho mỗi chức danh, đóng vai rồi vẽ trang Chỉ số. */
const daRole = {};
(rows("DL01") || []).forEach(x => { if (!x.staff_id) return; const rc = ecode(x.role); if (!daRole[rc]) daRole[rc] = x; });
const GHE = Object.keys(daRole);
t("Có nhân viên để đóng vai", GHE.length >= 10, GHE.length + " chức danh");

const banDo = {};       /* role -> {key, khoi vẽ ra} */
GHE.forEach(rc => {
  const st = daRole[rc];
  let key = "", M = null, html = "";
  /* ── NGỒI VÀO GHẾ CHO ĐÚNG - BƯỚC `setRole` KHÔNG ĐƯỢC THIẾU ────────────────────────────
     Lượt dựng đầu bộ này chỉ gọi `applyScope(sid)`. `applyScope` đặt đúng NHÓM và MỨC miền,
     nên `bcKey()`, `dsLevel()` đều trả lời đúng và mọi thứ trông như đang chạy. Nhưng
     `CURSTAFF` thì do `setRole()` đặt (nó đọc `window.GATE_SID`) - thiếu bước ấy thì CURSTAFF
     vẫn là "ADMIN", và mọi phép so "của mình" trong `canRow` đem chủ sở hữu ra so với "ADMIN"
     nên trượt hết. Hậu quả: `srows("DL09")`, `srows("DL11")` đều trả về 0 cho MỌI chức danh,
     và em đã đọc con số 0 ấy thành "app không gán lớp cho giáo viên" - trong khi giáo viên
     NV005 dạy 70 buổi có thật.
     *Đo một thứ đang bị che thì mọi con số đều là 0, và số 0 trông y hệt một kết quả.*
     Vì thế ngay dưới đây có một phép tự kiểm: ngồi xuống rồi phải hỏi lại xem mình đã ngồi
     đúng ghế chưa. Một bộ kiểm không kiểm chính cái thước của nó thì nó đo bằng niềm tin. */
  try { window.GATE_SID = st.staff_id; applyScope(st.staff_id); setRole("all"); }
  catch (e) { xau.push("khong dong vai duoc " + rc + ": " + e.message); return; }
  t("B0 " + rc + " ngoi dung ghe", CURSTAFF === st.staff_id,
    "goi applyScope+setRole roi ma CURSTAFF van la \"" + CURSTAFF + "\" thay vi \"" + st.staff_id + "\"" +
    " - moi phep so \"cua minh\" sau day deu do bang nguoi khac");
  try { if (dsLevel("baocao") === "none") return; } catch (e) {}
  try { key = bcKey(); M = bcMau(); } catch (e) { xau.push("bcKey/bcMau loi o " + rc + ": " + e.message); return; }
  try { CUR = "baocao"; html = RENDER.baocao(); } catch (e) { xau.push("khong ve duoc trang Chi so cho " + rc + ": " + e.message); return; }

  /* B1 - dàn bài riêng. Nhóm nào không phải điều hành mà rơi về "dieuhanh" là chưa có bản của
     mình: họ đang đọc dàn bài của Giám đốc, đúng cái anh Luân nói là không sát nghiệp vụ. */
  const g = (SCOPE() || {}).group || "";
  if (g && g !== "dieuhanh" && g !== "quantri")
    t("B1 " + rc + " co dan bai rieng", key !== "dieuhanh",
      "nhom \"" + g + "\" roi ve dan bai dieu hanh - them mot dong vao BCMAU");

  /* B2 - dàn bài phải có TÊN và CÂU HỎI. */
  t("B2 " + key + " co ten trang", !!(M && M.ten), "BCMAU." + key + " thieu `ten`");
  t("B2 " + key + " co cau hoi mo dau", !!(M && M.hoi && M.hoi.length > 12),
    "BCMAU." + key + " thieu `hoi` - chua ai viet duoc nguoi ngoi ghe nay mo trang ra de biet dieu gi");

  /* Khối nào thật sự vẽ ra, theo THỨ TỰ xuất hiện trên chuỗi. */
  const vt = [];
  Object.keys(DAU).forEach(k => { const m = html.search(DAU[k]); if (m >= 0) vt.push([k, m]); });
  vt.sort((a, b) => a[1] - b[1]);
  const khoiVe = vt.map(x => x[0]);
  banDo[rc] = { key: key, ten: (elabel(st.role) || rc), khoi: khoiVe };

  /* ── B3: HAI CÂU HỎI, VÀ CẢ HAI PHẢI ĐỘC LẬP VỚI BỘ DỰNG ─────────────────────────────────
     Bản đầu của B3 hỏi "thứ tự vẽ ra có khớp thứ tự đã khai không" - và nó KHÔNG BAO GIỜ ĐỎ.
     Thử phá bằng cách đảo hẳn dàn bài Học vụ: vẫn xanh. Đúng thôi - bộ dựng đọc bản khai rồi vẽ
     theo đúng bản khai, nên đảo bản khai là đảo luôn thứ tự vẽ, hai vế lúc nào cũng bằng nhau.
     Đây đúng cái bẫy đã ghi trong app từ 14/08: *đo cái ống mình vừa nối thì bao giờ cũng thấy
     thông*. Một phép đo hỏi bộ dựng có đồng ý với chính nó không thì nó đo số 0.
     Nay hỏi hai câu mà bản khai KHÔNG tự trả lời được:
      B3a - khối nào vẽ ra cũng phải có tên trong dàn bài của ghế này. Bắt được cái sẽ tái diễn
            thật: ai đó thêm thẳng `h+=deptSection()` vào `baocaoThan`, đi vòng qua `BCMAU` -
            khung chung mọc lại từ chính chỗ nó vừa bị gỡ.
      B3b - khối ĐẦU TIÊN phải thuộc chủ đề của ghế. Một bản báo cáo mở ra bằng thứ không phải
            việc của mình thì nó chưa phải bản của mình, dù các khối bên dưới có đúng.
            *Thứ tự không phải là trang trí - thứ đứng đầu là thứ người ta đọc.* */
  const khai = (M && M.khoi || []);
  const len = khoiVe.filter(k => khai.indexOf(k) < 0);
  t("B3a " + rc + " khong co khoi la chen vao", len.length === 0,
    "khoi [" + len.join(" ") + "] ve ra ma khong co trong dan bai - co ai do noi thang vao baocaoThan?");
  const CHUDE = {
    tuvan: ["pheu", "leadtt", "nguon", "doitv"], tuvanql: ["pheu", "leadtt", "nguon", "doitv"],
    marketing: ["nguon", "pheu", "leadtt"], marketingql: ["nguon", "pheu", "leadtt"],
    aca: ["hvbieu", "hvnguyco"], acaql: ["hvbieu", "hvnguyco"], giaovien: ["hvbieu", "hvnguyco"],
    hocvu: ["hvnguyco", "hvbieu"], hocvuql: ["hvnguyco", "hvbieu"],
    wow: ["sapdien", "hvnguyco"], wowql: ["sapdien", "hvnguyco"],
    ketoan: ["kinhdoanh", "sapdien"], ketoanql: ["kinhdoanh", "sapdien"],
    nhansu: ["vh11", "phongban", "kpi"],
    dieuhanh: ["tinhhinh", "top3", "coso"], hotro: ["sapdien", "kpi"]
  };
  const cd = CHUDE[key];
  if (cd && khoiVe.length)
    t("B3b " + rc + " mo dau bang chu de cua ghe", cd.indexOf(khoiVe[0]) >= 0,
      "dan bai \"" + key + "\" mo dau bang \"" + khoiVe[0] + "\" - chu de cua ghe nay la [" + cd.join(" ") + "]");

  /* B4 - không khối nào thuộc miền người ta không được xem. */
  khoiVe.forEach(k => {
    const md = MIEN[k]; if (!md) return;
    let lv = "all"; try { lv = dsLevel(md) } catch (e) {}
    t("B4 " + rc + " khong doc khoi mien " + md, lv !== "none",
      "khoi \"" + k + "\" thuoc mien " + md + " ma chuc danh nay khai " + md + ":\"none\"");
  });

  /* B5 - không bảng nào rỗng vì không có gì để đếm. */
  if (khoiVe.indexOf("hvnguyco") >= 0) {
    let soHV = 0; try { soHV = srows("DL09").length } catch (e) {}
    t("B5 " + rc + " khong bay bang HV nguy co rong", soHV > 0,
      "pham vi khong co hoc vien nao ma van bay bang \"Hoc vien nguy co can theo doi (0)\"");
  }
  /* Bảng nào in ra đúng chữ "(0)" ngay trên tiêu đề thì đó là một bảng không ai hỏi. */
  const so0 = (html.match(/<b>[^<]*\(0\)<\/b>/g) || []);
  t("B5 " + rc + " khong co bang tieu de (0)", so0.length === 0, so0.slice(0, 2).join(" · "));
});
try { window.GATE_SID = ""; applyScope(""); setRole("all"); } catch (e) {}

/* B6 - hai ghế khác nghiệp vụ phải đọc hai bản khác nhau. Đây là câu hỏi TỔNG: nếu mọi ghế vẫn
   ra cùng một danh sách khối thì bảng khai có mà thiết kế vẫn là một cái khung chung. */
const cap = [["academic_staff", "hr_staff"], ["teacher", "sales_staff"], ["accountant", "teacher"],
             ["marketing_staff", "academic_staff"], ["aca_manager", "hr_manager"]];
cap.forEach(([a, b]) => {
  const A = banDo[a], B = banDo[b];
  if (!A || !B) return;
  t("B6 " + a + " khac " + b, A.khoi.join(">") !== B.khoi.join(">"),
    "hai ghe khac nghiep vu ma doc y het mot ban: [" + A.khoi.join(" ") + "]");
});

/* Một con số đọc được cho người xem log: bao nhiêu dàn bài khác nhau thật sự vẽ ra. */
const rieng = {};
Object.keys(banDo).forEach(k => { rieng[banDo[k].khoi.join(">")] = 1 });
const soBan = Object.keys(rieng).length;
t("B6 co nhieu hon 5 ban bo cuc khac nhau", soBan >= 5,
  "chi co " + soBan + " ban khac nhau tren " + Object.keys(banDo).length + " ghe");

if (xau.length) {
  console.log("CHECKBC DO (" + xau.length + " cho):");
  [...new Set(xau)].slice(0, 30).forEach(x => console.log("  - " + x));
  console.log("");
  console.log("Sua o `BCMAU` / `BCKHOI` trong gen_v5.py (ngay tren `renderBaocao`).");
  process.exit(1);
}
console.log("CHECKBC OK: " + Object.keys(banDo).length + " ghe · " + soBan +
  " ban bo cuc khac nhau · " + ok + " tieu chi - moi ghe doc dung dan bai cua minh, khong khoi nao " +
  "thuoc mien la, khong bang nao rong vi khong co gi de dem");
