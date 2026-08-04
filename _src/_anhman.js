/* _anhman.js - CHỤP MÀN ĐỂ NGƯỜI NHÌN BẰNG MẮT.
 *
 * Giao thức audit (mảng 1) ghi: *"Phải nhìn bằng mắt, máy không thay được: chụp màn 4-5 trang
 * chính ở tỷ lệ 90% và 100%, xem nhịp đọc có hợp lý không - máy đo được 'không vỡ' chứ không
 * đo được 'đẹp'."* File này lo phần chụp; phần nhìn là của người.
 *
 * KHÔNG phải bộ kiểm - nó không có tiêu chí nào, không bao giờ đỏ, và KHÔNG nằm trong verify.sh.
 * Chạy tay khi cần nộp ảnh:  ITTS_OUT=<out> node _anhman.js [thu-muc-ra]
 *
 * Vì sao chụp ở HAI tỷ lệ: anh Luân dùng Chrome trên MacBook Air M2 ở mức thu nhỏ 90%, và đã có
 * một lỗi CHỈ hiện ra ở 90% (dải "footer bar" 90px do zoom co mất `vh`). Chụp một tỷ lệ là bỏ
 * sót đúng cái khổ màn người chủ dự án đang nhìn.
 */
const OUT = process.env.ITTS_OUT || ".";
const RA = process.argv[2] || "./_anh";
const PATHS = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
               "/opt/pw-browsers/chromium/chrome-linux/chrome"];

/* Cùng danh sách trang với _checkmat, cắt còn những trang anh Luân mở nhiều nhất. */
const TRANG = ["banlam", "tuyensinh", "hoctap", "banglop", "hocvien", "duyet", "baocao", "settings"];
const TYLE = [100, 90];

(async () => {
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch (e) { console.log("ANHMAN BO QUA: chua cai playwright"); process.exit(0); }
  const fs = require("fs"), path = require("path");
  const exe = PATHS.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  let browser;
  try { browser = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("ANHMAN BO QUA: khong mo duoc Chromium"); process.exit(0); }

  fs.mkdirSync(RA, {recursive: true});
  let so = 0;
  for (const ty of TYLE) {
    const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage();
    await page.addInitScript((t) => { try {
      sessionStorage.setItem("ITTS_WHO", "");
      localStorage.setItem("ITTS_HELLO_V1", "1");
      localStorage.setItem("ITTS_ZOOM_V1", String(t));
    } catch (e) {} }, ty);
    await page.goto("file://" + path.resolve(OUT) + "/ITTs_WebApp_v5_demo.html", {waitUntil: "load"});
    await page.waitForFunction(() => typeof window.go === "function", null, {timeout: 30000});
    /* Trợ lý tự hé mở 3,2 giây rồi thu lại - chụp trong lúc đó thì ảnh nào cũng có nó choán chỗ. */
    await page.waitForTimeout(4600);
    await page.evaluate(() => { try {
      if (typeof asstDong === "function") asstDong();
      const a = document.getElementById("asst");
      if (a && a.classList.contains("on") && typeof tthToggle === "function") tthToggle();
    } catch (e) {} });
    await page.waitForTimeout(500);
    for (const k of TRANG) {
      try { await page.evaluate((x) => go(x), k); } catch (e) { continue; }
      await page.waitForTimeout(500);
      const f = path.join(RA, k + "_" + ty + ".png");
      await page.screenshot({path: f});
      so++;
    }
    await ctx.close();
  }
  await browser.close();
  console.log("ANHMAN: da chup " + so + " anh vao " + RA + " (" + TRANG.length + " trang x " + TYLE.length + " ty le)");
})();
