/* _checkf5.js - NHẤN F5 CÓ MẤT CHỖ ĐANG ĐỨNG KHÔNG.
 *
 * VÌ SAO CÓ FILE NÀY (anh Luân 07/08): *"e thiết kế sao mà để anh F5 lại trang nó vẫn ở nguyên
 * trang a đang đứng nhé"*.
 *
 * App ĐÃ hứa điều này từ V9.29c - `go()` ghi `?<slug-trang>` vào thanh địa chỉ, và lúc vào app
 * thì đọc lại. Nhưng lời hứa ấy chưa bao giờ được ai đo, và đo ra thì nó SAI TOÀN BỘ: mọi trang,
 * mọi tab, mọi hồ sơ - F5 xong đều rơi về Trang bắt đầu.
 *
 * Gốc lỗi nằm ở THỨ TỰ, không phải ở phép ghi địa chỉ:
 *      enter()  ->  setRole(k)      nhảy về trang đáp của chức danh, và cú nhảy ấy GỌI hashSet,
 *                                   ghi đè `?thanh-toan` thành `?trang-bat-dau`
 *               ->  hk = hashKey()  giờ mới đọc - đọc đúng cái mình vừa ghi đè
 *               ->  go(hk)          nên luôn về trang mặc định
 * Đo được: trước F5 địa chỉ `?thanh-toan`, sau F5 `?trang-bat-dau`, `ITTS_WHO` vẫn còn NV001.
 * Tức app vào đúng người, chỉ là tự tay xoá mất đích đến trước khi kịp đọc nó.
 *
 * LUẬT RÚT RA: đọc thanh địa chỉ TRƯỚC khi làm bất cứ việc gì có thể ghi vào nó. Đây là họ hàng
 * của bẫy đã cắn nhiều lần trong dự án - "đo một bản, sửa một bản khác": một giá trị bị thay đổi
 * giữa lúc ghi và lúc đọc, và không ai báo gì cả.
 *
 * VÌ SAO KHÔNG BỘ KIỂM NÀO KHÁC BẮT ĐƯỢC: cả 34 bộ đều nạp app MỘT LẦN rồi đo. Không bộ nào NẠP
 * LẠI. Mà đây đúng là loại lỗi chỉ hiện ra ở lần nạp thứ hai.
 *
 * ĐO TRÊN http:// CHỨ KHÔNG PHẢI file://: demo thật chạy trên https://mittomap.github.io. Hai
 * kiểu địa chỉ ứng xử khác nhau ở chỗ `history.pushState` đổi query - đo trên file:// mà kết
 * luận cho bản online là đoán. (Đã đối chứng 07/08: lần đó hai bên giống nhau, nhưng cái thước
 * không được dựa vào một sự trùng hợp.)
 *
 * Chạy: ITTS_OUT=<out> node _checkf5.js
 */
const FS = require("fs"), PATH = require("path"), HTTP = require("http");
const OUTDIR = PATH.resolve(process.env.ITTS_OUT || __dirname);
const PATHS = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
               "/opt/pw-browsers/chromium/chrome-linux/chrome"];

/* Mỗi ca: ĐI tới một chỗ, HỎI "tôi đang đứng đâu", F5, rồi hỏi LẠI ĐÚNG CÂU ẤY.
   Câu hỏi phải dùng TỪ VỰNG CỦA APP (`CUR`, `window.HOSO`, ...) - bịa tên trường thì đo ra rỗng
   rồi tưởng app hỏng (bẫy `_checkreset` đã cắn với `w.han`/`w.due`). */
const CA = [
  {ten:"trang thuong",              di:`go("tuyensinh")`,                                    hoi:`({t:CUR})`},
  {ten:"trang nghiep vu trong hub", di:`go("thanhtoan")`,                                    hoi:`({t:CUR,tab:window.TSTAB||""})`},
  {ten:"tab Nhan xet buoi",         di:`go("buoihoc")`,                                      hoi:`({t:CUR,tab:window.HTTAB||""})`},
  {ten:"tab Duyet hoan tien",       di:`go("duyethoan")`,                                    hoi:`({t:CUR,tab:window.DUYTAB||""})`},
  {ten:"tab Ma gioi thieu",         di:`go("magioithieu")`,                                  hoi:`({t:CUR,tab:window.KTAB||""})`},
  {ten:"ho so 360 cua MOT hoc vien",di:`window.HOSO=rows("DL09")[0].student_id;go("hoso")`,  hoi:`({t:CUR,ai:window.HOSO||""})`},
  {ten:"ho so MOT giang vien",      di:`window.GVID=rows("DL01").filter(function(x){return isc(x.role,"teacher")||/gi[aá]ng|gi[aá]o vi[eê]n/i.test(String(x.role_name||x.role||""))})[0].staff_id;go("hosogv")`,
                                                                                             hoi:`({t:CUR,ai:window.GVID||""})`},
  {ten:"ho so MOT khoa hoc",        di:`window.KHID=rows("DL05")[0].course_id;go("hosokhoa")`,hoi:`({t:CUR,ai:window.KHID||""})`},
  {ten:"van hanh MOT lop",          di:`window.BLCLASS=rows("DL10")[0].class_id;go("banglop")`,hoi:`({t:CUR,lop:window.BLCLASS||""})`},
  /* Cài đặt có CỬA CHẶN riêng: chưa chọn chế độ thì `go("settings")` chỉ mở hộp hỏi chứ KHÔNG
     đổi trang (`_check16` canh đúng chốt đó). Không gõ cửa trước thì ca này đo nhầm - nó đứng
     ở Trang bắt đầu suốt và báo đỏ một thứ không liên quan tới F5.
     Cùng bài học `_checkui` đã rút: "thêm một cửa chặn thì phải hỏi lại - bộ kiểm có biết gõ
     cửa không?" */
  {ten:"Cai dat - tab Nguong CH2",  di:`cfSetMode("that");window.SETTAB="ch2";go("settings")`, hoi:`({t:CUR,tab:window.SETTAB||""})`},
];

(async () => {
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch (e) { console.log("CHECKF5 BO QUA: chua cai playwright (npm i playwright)"); process.exit(0); }
  const f = PATH.join(OUTDIR, "ITTs_WebApp_v5_demo.html");
  if (!FS.existsSync(f)) { console.log("CHECKF5 DO: khong thay " + f + " - chay `ITTS_OUT=<out> python3 gen_v5.py` truoc da"); process.exit(1); }

  /* máy chủ nhỏ chỉ để có một địa chỉ http:// thật - không phục vụ gì ngoài thư mục build */
  const may = HTTP.createServer((rq, rs) => {
    const p = PATH.join(OUTDIR, decodeURIComponent(String(rq.url).split("?")[0]));
    if (!p.startsWith(OUTDIR) || !FS.existsSync(p) || FS.statSync(p).isDirectory()) { rs.writeHead(404); return rs.end("x"); }
    rs.writeHead(200, {"Content-Type": p.endsWith(".js") ? "text/javascript" : "text/html"});
    FS.createReadStream(p).pipe(rs);
  });
  await new Promise(r => may.listen(0, "127.0.0.1", r));
  const GOC = "http://127.0.0.1:" + may.address().port + "/";

  const exe = PATHS.find(p => { try { return FS.existsSync(p); } catch (e) { return false; } });
  let b;
  try { b = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("CHECKF5 BO QUA: khong mo duoc Chromium (" + String(e.message).slice(0,80) + ")"); may.close(); process.exit(0); }

  const do_ = [], ok = [];
  const ctx = await b.newContext({viewport:{width:1440,height:900}});
  const p = await ctx.newPage();
  const loiJS = [];
  p.on("pageerror", e => loiJS.push(String(e.message).slice(0,110)));
  await p.addInitScript(() => { try { localStorage.setItem("ITTS_HELLO_V1","1"); } catch (e) {} });
  await p.goto(GOC + "ITTs_WebApp_v5_demo.html", {waitUntil:"load"});
  await p.waitForFunction(() => typeof window.go === "function");
  await p.waitForTimeout(600);

  /* Vào app bằng MỘT NGƯỜI CÓ THẬT. `gateEnter` là cửa vào thật của app - `applyScope` chỉ cắt
     phạm vi dữ liệu mà không đặt danh tính, dùng nó là đo sai (bẫy `_checkreset` đã cắn). */
  const ai = await p.evaluate(() => { const s = rows("DL01").filter(x => staffActive(x))[0]; gateEnter(s.staff_id); return s.staff_id; });
  await p.waitForTimeout(500);

  for (const c of CA) {
    let truoc, diachi;
    try {
      await p.evaluate(c.di);
      await p.waitForTimeout(420);
      truoc = await p.evaluate("(" + c.hoi + ")");
      diachi = await p.evaluate(() => location.search + location.hash);
    } catch (e) { do_.push(c.ten + ": khong di toi duoc (" + String(e.message).slice(0,70) + ")"); continue; }

    /* Địa chỉ phải NÓI ĐƯỢC chỗ đang đứng. Không nói được thì F5 có giữ đúng cũng là ăn may
       (nhớ nhờ sessionStorage), và link gửi cho người khác vẫn mở ra chỗ khác. */
    if (!diachi || /^\??$/.test(diachi)) do_.push(c.ten + ": thanh dia chi KHONG ghi gi - khong the F5 dung cho, cung khong gui link duoc");

    await p.reload({waitUntil:"load"});
    await p.waitForFunction(() => typeof window.go === "function");
    await p.waitForTimeout(1100);
    let sau;
    try { sau = await p.evaluate("(" + c.hoi + ")"); }
    catch (e) { do_.push(c.ten + ": sau F5 khong hoi duoc trang thai (" + String(e.message).slice(0,70) + ")"); continue; }

    const nhu = JSON.stringify(truoc), duoc = JSON.stringify(sau);
    if (nhu === duoc) ok.push(c.ten + " " + nhu);
    else do_.push(c.ten + ": F5 xong MAT cho dang dung - truoc " + nhu + " (dia chi " + diachi + ") -> sau " + duoc);
  }

  /* Cửa vào phải còn nhớ người: mất danh tính thì F5 rơi về cổng đăng nhập, cũng là mất chỗ. */
  const who = await p.evaluate(() => sessionStorage.getItem("ITTS_WHO") || "");
  if (who) ok.push("F5 van nho danh tinh (" + who + ")");
  else do_.push("F5 xong MAT danh tinh - roi ve cong dang nhap");

  if (loiJS.length) do_.push("loi JS trong luc nap lai: " + loiJS[0]);
  await ctx.close(); await b.close(); may.close();

  if (do_.length) {
    console.log("CHECKF5 DO (" + do_.length + " cho tren " + (CA.length + 1) + " ca):");
    do_.forEach(x => console.log("  - " + x));
    console.log("CHECKF5 DO");
    process.exit(1);
  }
  console.log("  nguoi dong vai: " + ai);
  ok.forEach(x => console.log("  v " + x));
  console.log("CHECKF5 OK: " + ok.length + " ca - F5 giu nguyen trang, tab, ho so dang mo va danh tinh");
})();
