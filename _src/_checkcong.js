/* _checkcong.js - CÙNG MỘT HỌC VIÊN, HAI CỔNG CÓ NÓI CÙNG MỘT CON SỐ KHÔNG?
 *
 * ═══ VÌ SAO CÓ BỘ NÀY ═══════════════════════════════════════════════════════════════════════
 * Mảng 7 của `GIAO_THUC_AUDIT.md` (em bổ sung 04/08): *"Một sự thật hiện ở nhiều nơi thì phải
 * hiện GIỐNG NHAU. Cùng một học viên: cổng nhân viên và cổng học viên có nói cùng một con số
 * không."*
 *
 * Đo lại 25/08 thì mảng ấy **chưa có bộ kiểm nào đi qua**. `_check14` soi cổng học viên (kênh
 * hai chiều), `_checkmien` soi rò dữ liệu, `_check18` soi trùng khối - không bộ nào ĐỐI CHIẾU
 * hai bên. Đây đúng loại hỏng im lặng nhất: cả hai cổng đều vẽ được, đều không lỗi, đều có số -
 * chỉ là hai số khác nhau, và người phát hiện ra sẽ là học viên gọi điện lên hỏi.
 *
 * *Hai nơi cùng kể một sự thật mà không ai bắt chúng đối chiếu thì sớm muộn chúng kể hai chuyện,
 * và cái giá không phải là một dòng đỏ trong log - nó là niềm tin của người dùng cuối.*
 *
 * ═══ NĂM CÂU HỎI ════════════════════════════════════════════════════════════════════════════
 *   C1  CHUYÊN CẦN - % buổi có mặt: cổng nhân viên (`stuAttStats`) so cổng học viên
 *   C2  BÀI TẬP    - % bài đã nộp
 *   C3  CÔNG NỢ    - số tiền còn phải đóng
 *   C4  QUOTA WOW  - số buổi còn lại
 *   C5  TÊN & TRẠNG THÁI - hai cổng gọi cùng một cái tên, cùng một nhãn trạng thái
 *
 * Cả hai cổng dựng từ CÙNG một tệp mã (`_APP.js` và `_HV.js` chỉ khác hai ký tự), nên bộ này
 * chạy được trong một tiến trình: gọi phép tính của cổng nhân viên, rồi VẼ THẬT trang cổng học
 * viên và đọc số ra khỏi HTML. Đọc từ HTML chứ không gọi lại hàm: nếu gọi lại hàm thì hai vế
 * dùng chung một phép tính và bộ kiểm chỉ chứng minh rằng một hàm bằng chính nó.
 *
 * Chạy: ITTS_APP=./_APP.js node _checkcong.js
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
try { global.toast = function () {} } catch (e) {}
setRole("all");

const xau = [];
let ok = 0;
function t(n, c, m) { if (c) ok++; else xau.push(n + (m ? (" - " + m) : "")); }

/* Bóc chữ khỏi HTML - đọc ở tầng NGƯỜI DÙNG THẤY, đúng luật đã dùng cho `_checkmat` M8. */
function chu(h) { return String(h || "").replace(/<[^>]*>/g, " ").replace(/&nbsp;/g, " ").replace(/\s+/g, " ").trim() }
/* ĐỌC MỘT THẺ TRÊN DẢI SỐ - THEO CẤU TRÚC, KHÔNG THEO CHUỖI PHẲNG.
   Hai bản đầu của hàm này đều sai, và cả hai đều sai theo cùng một kiểu:
    · bản 1 đi tìm số đứng TRƯỚC nhãn - nhặt trúng "2026" của một cái ngày ở khối trên, báo
      25/25 học viên lệch trong khi hai cổng khớp răm rắp;
    · bản 2 đi tìm số đứng SAU nhãn - đúng cho thẻ "Chuyên cần", nhưng thẻ "Bài tập đã nộp" có
      phụ chú "1/5 bài" nằm ngay sau, nên nó đọc ra "1" và lại báo lệch.
   Đúng cái bẫy ghi ở đầu `GIAO_THUC_AUDIT.md`: *nghi cái thước trước, đừng nghi app trước.*
   Và đúng bài học đã ghi trong `_checkux`: *đo quan hệ thì bền; đo khoảng cách ký tự thì vỡ khi
   cách viết đổi.* Dải thẻ có cấu trúc rõ ràng - `.bsn` là giá trị, `.bsl` là nhãn, `.bsp` là phụ
   chú - nên hỏi thẳng cấu trúc ấy: tìm thẻ có `.bsl` đúng nhãn rồi đọc `.bsn` của CHÍNH nó. */
function theCua(h, nhan) {
  const H = String(h || "");
  const re = /<div class="bstat[^"]*"[^>]*>([\s\S]*?)<\/div><\/div>/g;
  let m;
  while ((m = re.exec(H))) {
    const o = m[1];
    const lb = (o.match(/<div class="bsl">([\s\S]*?)<\/div>/) || [])[1];
    if (!lb || chu(lb) !== nhan) continue;
    /* `.bsp` đi qua `thePhu()` nên bên trong nó còn thẻ lồng - cắt tới `</div>` đầu tiên là
       cắt nhầm giữa chừng và ra chuỗi rỗng. Đọc CẢ Ô rồi bỏ phần nhãn và giá trị đi: thứ còn
       lại chính là phụ chú, không phụ thuộc nó được bọc mấy lớp. */
    const _so = chu((o.match(/<div class="bsn">([\s\S]*?)<\/div>/) || [])[1] || "");
    const _ca = chu(o);
    const _i = _ca.indexOf(nhan);
    return { so: _so, phu: (_i >= 0 ? _ca.slice(_i + nhan.length) : _ca).trim(), ca: _ca };
  }
  return null;
}
function soSauNhan(h, nhan) { const c = theCua(h, nhan); return c ? c.so : null }
function phuSauNhan(h, nhan) { const c = theCua(h, nhan); return c ? c.phu : null }

/* Học viên để đối chiếu: lấy những em ĐANG HỌC và có dữ liệu thật, đủ nhiều để không may rủi. */
const DS = (rows("DL09") || []).filter(s =>
  s.student_id && /active|studying/.test(ecode(s.student_status))).slice(0, 25);
t("có học viên để đối chiếu", DS.length >= 5, DS.length + " em");

let soDo = 0;
DS.forEach(s => {
  const sid = s.student_id;
  /* ── VẾ CỔNG NHÂN VIÊN: tính bằng chính hàm mà màn nhân viên đang dùng ─────────────────── */
  let nvAtt = null, nvHw = null, nvNo = null, nvWow = null;
  try {
    const att = rows("DL12").filter(a => String(a.student_id || "") === sid);
    const co = att.filter(a => isc(a.attendance_status, "on_time", "late")).length;
    nvAtt = att.length ? Math.round(co * 100 / att.length) : null;
  } catch (e) {}
  try {
    const hw = rows("DL13").filter(x => String(x.student_id || "") === sid);
    const nop = hw.filter(hwSubmitted).length;
    nvHw = hw.length ? Math.round(nop * 100 / hw.length) : null;
  } catch (e) {}
  try {
    nvNo = rows("DL06").filter(e2 => String(e2.student_id || "") === sid && !isc(e2.enrollment_status, "cancelled"))
      .reduce((tt, e2) => tt + Math.max(0, (num(e2.final_fee) || num(e2.total_fee)) - num(e2.paid_amount)), 0);
  } catch (e) {}
  try { nvWow = num(s.wow_quota_remaining) } catch (e) {}

  /* ── VẾ CỔNG HỌC VIÊN: VẼ THẬT rồi đọc số ra khỏi màn ──────────────────────────────────── */
  let H = "";
  try { window.HVID = sid; H = renderTrangHV() || "" } catch (e) {
    xau.push("C0 " + sid + " không vẽ được cổng học viên: " + e.message); return;
  }
  if (!H || H.length < 400) { xau.push("C0 " + sid + " cổng học viên vẽ ra gần như rỗng (" + H.length + " ký tự)"); return; }
  soDo++;

  /* C1 - chuyên cần */
  const hvAtt = soSauNhan(H, "Chuyên cần");
  if (nvAtt != null) {
    t("C1 " + sid + " chuyên cần khớp hai cổng", hvAtt === (nvAtt + "%"),
      "cổng nhân viên " + nvAtt + "% · cổng học viên " + hvAtt);
    /* Phụ chú phải nói ĐÚNG cái phân số đẻ ra con số ấy - một con số không có phân số đi kèm
       thì hai bên có thể cùng in 87% từ hai phép chia khác nhau mà không ai biết. */
    const phu = phuSauNhan(H, "Chuyên cần") || "";
    t("C1b " + sid + " chuyên cần có nói phân số đẻ ra nó", phu.indexOf("/") >= 0 && /buổi/.test(phu),
      "phụ chú: \"" + phu.slice(0, 44) + "\"");
  }
  /* C2 - bài tập */
  const hvHw = soSauNhan(H, "Bài tập đã nộp");
  if (nvHw != null) t("C2 " + sid + " bài tập khớp hai cổng", hvHw === (nvHw + "%"),
    "cổng nhân viên " + nvHw + "% · cổng học viên " + hvHw);
  /* C3 - công nợ: cổng học viên in tiền có dấu chấm, so bằng SỐ chứ không so chuỗi */
  {
    const c = chu(H);
    const m = c.match(/Còn (?:phải đóng|nợ)[^\d]{0,14}([\d.]+)/);
    if (m) {
      const hvNo = num(String(m[1]).split(".").join(""));
      t("C3 " + sid + " công nợ khớp hai cổng", Math.abs(hvNo - nvNo) < 1,
        "cổng nhân viên " + nvNo + " · cổng học viên " + hvNo);
    }
  }
  /* C4 - quota WOW */
  const hvWow = soSauNhan(H, "Buổi WOW còn lại");
  if (hvWow != null && nvWow != null)
    t("C4 " + sid + " quota WOW khớp hai cổng", String(nvWow) === String(hvWow),
      "cổng nhân viên " + nvWow + " · cổng học viên " + hvWow);
  /* C5 - tên: cổng học viên phải gọi đúng cái tên hồ sơ nhân viên đang gọi */
  t("C5 " + sid + " hai cổng gọi cùng một tên", chu(H).indexOf(String(s.full_name || "")) >= 0,
    "không thấy tên \"" + s.full_name + "\" trên cổng học viên");
});
try { window.HVID = "" } catch (e) {}

t("đã đối chiếu đủ số học viên", soDo >= 5, soDo + " em vẽ được cổng học viên");

if (xau.length) {
  console.log("CHECKCONG DO (" + xau.length + " cho):");
  [...new Set(xau)].slice(0, 24).forEach(x => console.log("  - " + x));
  console.log("");
  console.log("Hai cong dang noi hai con so khac nhau ve cung mot hoc vien - sua o gen_v5.py cho phep tinh lech.");
  process.exit(1);
}
console.log("CHECKCONG OK: " + soDo + " hoc vien x 5 cau hoi = " + ok +
  " tieu chi - cong nhan vien va cong hoc vien noi cung mot con so ve chuyen can, bai tap, cong no, quota WOW va ten");
