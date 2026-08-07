/* _checkneo.js - VÒNG SÁNG CỦA HƯỚNG DẪN CÓ KHOANH ĐÚNG THỨ CÂU NÓI ĐANG NÓI TỚI KHÔNG?
 *
 * VÌ SAO CÓ FILE NÀY (anh Luân 04/08, sau nhiều lần báo cùng một chuyện):
 *   "tour vẫn tệ quá em, nó trỏ sai hoài" ... "e kiểm kỹ từng bài, ở từng cổng đi, có cơ chế
 *    nào để nó chính xác ko em, chứ a thấy lỗi hoài"
 *
 * Trước file này đã có `_checktour` và một mặt đo trong `_checkui`. Cả hai đều XANH suốt trong
 * khi anh Luân vẫn thấy lỗi mỗi lần mở. Lý do: chúng chỉ hỏi được ba câu dễ -
 *   · bài có chạy hết bước không?      · neo có tìm ra không?      · neo có nằm trong màn không?
 * Không câu nào hỏi câu KHÓ và cũng là câu duy nhất người dùng quan tâm:
 *   **vòng sáng có khoanh đúng THỨ mà câu nói đang nói tới không?**
 *
 * Đo lần đầu (04/08, bản trước khi sửa) ra con số nói hết mọi chuyện: 91 bước × 2 bản build,
 * chỉ 2 bước không tìm ra neo - NHƯNG **46/86 bước (53%) trỏ vào neo dùng chung của vỏ trang**:
 *   @phead x24 · @tbarct x6 · @settabs x5 · @tbar x4 · @bstats x3 · ...
 * Nghĩa là NĂM bài khác nhau ("Đặt lịch test đầu vào", "Tư vấn lộ trình", "Chấm test đầu vào",
 * "Đêm qua lead về từ đâu", "Phễu và tỷ lệ chuyển đổi") cùng khoanh ĐÚNG MỘT dòng chữ - dòng mô
 * tả chung của trang hub. Vòng sáng có hiện, đúng trang, không lỗi - nên mọi bộ kiểm cũ đều xanh.
 * Người dùng thì thấy tour trỏ tầm bậy, và họ đúng.
 *
 * LUẬT CANH Ở ĐÂY (5 câu hỏi, mỗi câu là một cách bước hướng dẫn có thể sai):
 *   N1  neo phải TÌM RA ĐƯỢC          - bước mở đầu (st.mo) miễn
 *   N2  neo phải NẰM TRONG MÀN        - có kích thước và không nằm ngoài khung nhìn
 *   N3  MỘT MÃ NEO, MỘT BƯỚC          - mã neo dùng cho hai bước khác nhau phải KHAI KÈM LÝ DO
 *                                       trong NEO_CHUNG dưới đây. Đây là câu bắt được lỗi 04/08.
 *   N4  bước nói về NỘI DUNG TRANG thì neo phải nằm trong #content, không được rơi vào vỏ app
 *                                       (menu / thanh trên) - trừ bước cố ý dạy về vỏ (VO_OK)
 *   N5  VÒNG SÁNG phải trùng phần tử  - vẽ ra mà lệch chỗ thì cũng như trỏ sai
 *
 * Chạy:  ITTS_OUT=<out> node _checkneo.js
 * Máy không có Chromium thì BỎ QUA chứ không báo đỏ bậy (cùng lối với _checkui).
 */
const OUT = process.env.ITTS_OUT || ".";
const PATHS = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
               "/opt/pw-browsers/chromium/chrome-linux/chrome",
               "/opt/pw-browsers/chromium-1194/chrome-linux/headless_shell"];

/* ── NEO ĐƯỢC PHÉP DÙNG CHUNG (N3) ────────────────────────────────────────────────────────
   Mỗi dòng phải có LÝ DO ĐỌC ĐƯỢC, và lý do hợp lệ chỉ có một dạng: hai bước đang dạy ĐÚNG MỘT
   nút/ô đó cho hai chức danh khác nhau. "Cho tiện" không phải lý do - thêm dòng vào đây là một
   quyết định, không phải một cách làm im chỗ đỏ.
   Khai được bằng HAI KIỂU khoá:
     · mã neo  ("@txt:Nhận việc")  - cả mã đó được phép trùng ở mọi bài
     · mã bước ("tn_quanly 1/6")   - chỉ đúng bước đó được phép trùng, chặt hơn, nên ưu tiên */
const NEO_CHUNG = {
  "@txt:Chờ ghi nhận xét":
    "Cùng một chip lọc, dạy cho hai người: học vụ (đi đốc thúc) và giáo viên (tự ghi).",
  "@txt:Ghi nhận khoản thu":
    "Cùng một nút thu tiền, dạy cho tư vấn viên (thu hộ) và kế toán (thu chính).",
  "@txt:Nhận việc":
    "Cùng một nút nhận việc được giao, dạy cho nhân viên hỗ trợ và cho khối nhân sự.",
  "tq_troly 4/4":
    "Cùng ô hỏi của Trợ lý với bước 2/4, nhưng dạy mặt khác: 2/4 dạy HỎI ĐƯỢC GÌ, 4/4 dạy app "
    + "trả lời sao khi KHÔNG hiểu. Ô hỏi là thứ duy nhất trên màn để trỏ, và cả hai bài đều "
    + "đang nói về chính nó.",
  /* ═══ V2 - BỐN CHỖ DÙNG CHUNG SINH RA TỪ VIỆC DỠ HUB ═════════════════════════════════════
     Trước V2, các bài hướng dẫn của những chức danh khác nhau đứng ở những TAB khác nhau của
     cùng một hub, nên neo `@man` (khối nội dung của màn đang mở) tự khác nhau. Nay mỗi nghiệp
     vụ là một trang riêng: hai bài dạy hai người khác nhau về CÙNG một trang thì cùng trỏ vào
     chính trang ấy - đó là đúng, không phải trỏ sai.
     Khai kèm lý do chứ không nới luật: luật N3 vẫn bắt mọi trường hợp trùng KHÔNG khai. */
  "tn_giaovien 5/5":
    "Trang Giao việc, trùng với tn_sale 8/8. Cùng một màn dạy cho hai người: sale nhận việc "
    + "từ quản lý, giáo viên nhận việc từ học vụ. Cả hai bước đều giới thiệu CẢ màn nên không "
    + "tách nhỏ được.",
  "tn_wow 2/5":
    "Trang Test đầu vào, trùng với tn_sale 4/8. Sale đặt lịch test cho khách; NV WOW là người "
    + "CHẤM bài test đó (bảng phân quyền CH3 của SOP giao vậy). Hai đầu của cùng một việc.",
  "tn_marketing 5/5":
    "Trang Lead, trùng với chính bước 1/5 của bài này. 1/5 dạy ĐỌC kho lead, 5/5 dạy đọc PHỄU "
    + "và tỷ lệ chuyển đổi trên cùng kho ấy - hai câu hỏi khác nhau trên cùng một màn.",
  "tn_quanly 4/6":
    "Hàng chờ phê duyệt, trùng với tn_ketoan 4/5. Kế toán đứng ở phía hoàn tiền, quản lý đứng "
    + "ở phía duyệt - cùng một hàng chờ, hai vai.",
  "tn_quanly 1/6":
    "Màn Báo cáo, trùng với tn_ketoan 5/5. Cùng một màn dạy cho hai chức danh: kế toán đọc "
    + "doanh thu, quản lý đọc toàn cảnh. Không tách nhỏ được vì cả hai bước đều giới thiệu CẢ màn.",
};

/* ── BƯỚC CỐ Ý DẠY VỀ VỎ APP (N4) ─────────────────────────────────────────────────────────
   Vỏ app (thanh trên, menu) cũng là thứ phải dạy - chuông, đổi cổng, nút tỷ lệ. Những mã neo
   này nằm ngoài #content một cách chính đáng. */
const VO_OK = ["@bell", "@me", "@doicong", "@help", "@tyle", "@gopy", "@brand", "@navarc", "@navlbl"];

(async () => {
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch (e) { console.log("CHECKNEO BO QUA: chua cai playwright (npm i playwright)"); process.exit(0); }
  const fs = require("fs"), path = require("path");
  const exe = PATHS.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  let browser;
  try { browser = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("CHECKNEO BO QUA: khong mo duoc Chromium (" + String(e.message).slice(0,80) + ")"); process.exit(0); }

  /* Hai bản build là hai cây menu, hai trang trục, hai bộ bài hợp lệ - phải đi cả hai.
     (Luật đã cắn 3 lần: bản đồ nào cắm cứng theo một bản build thì bản kia lặng lẽ mất tính năng.) */
  const CONG = [
    {f: "ITTs_WebApp_v5_demo.html", ten: "v5"},
  /* V9.99: ban V6 da NGUNG PHAT HANH (anh Luan 04/08) - khong con file de mo. */
  ];

  const do_ = [], bo = [];
  let luot = 0, soBai = 0;

  for (const C of CONG) {
    const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage();
    const loiJS = [];
    page.on("pageerror", e => loiJS.push(String(e.message).slice(0, 110)));
    /* VÀO ĐÚNG CỬA APP DÙNG. Bẫy đã cắn ngay khi dựng bộ này: bản đầu em tự đặt window.TOUR rồi
       gọi tourShow() mà KHÔNG đi qua cổng đăng nhập - app còn nguyên CURROLE mặc định "sales"
       trong khi RBK chỉ có khoá "all", nên navVis() ném lỗi, go() chết, và máy báo 62/91 bước
       hỏng. Con số đó là RÁC của cái thước, không phải của app. Luật: hỏi thẳng cửa vào mà app
       dùng (sessionStorage ITTS_WHO -> gateEnter -> enter("all")), đừng dựng lại trạng thái app
       bằng tay. */
    await page.addInitScript(() => { try {
      sessionStorage.setItem("ITTS_WHO", "");
      localStorage.setItem("ITTS_HELLO_V1", "1");
      localStorage.setItem("ITTS_ZOOM_V1", "100");
    } catch (e) {} });
    await page.goto("file://" + path.resolve(OUT) + "/" + C.f, {waitUntil: "load"});
    await page.waitForFunction(() => typeof window.tourShow === "function", null, {timeout: 30000});
    await page.waitForTimeout(700);

    const bai = await page.evaluate(() => Object.keys(window.TOURS || {}));
    if (!bai.length) { do_.push(C.ten + ": khong doc duoc danh sach bai huong dan"); await ctx.close(); continue; }

    /* Mã neo -> bước đầu tiên đã dùng nó (để bắt N3 trong phạm vi MỘT bản build). */
    const daDung = {};

    for (const k of bai) {
      /* Bài không hợp bản này thì người dùng bản này không bao giờ thấy - đo nó là đo bản kia. */
      const hop = await page.evaluate(k => { try { return typeof tourHopBan === "function" ? !!tourHopBan(k) : true; } catch (e) { return true; } }, k);
      if (!hop) continue;
      soBai++;
      const n = await page.evaluate(k => window.TOURS[k].steps.length, k);
      for (let i = 0; i < n; i++) {
        await page.evaluate(([k, i]) => {
          try { tourEnd(); } catch (e) {}
          window.TOUR = {key: k, i: i, on: true, min: false};
          try { tourBase(); } catch (e) {}
          tourShow();
        }, [k, i]);
        /* ĐỢI THEO TRẠNG THÁI, KHÔNG ĐỢI THEO ĐỒNG HỒ. Bẫy đã cắn ngay lượt chạy đầu của bộ này:
           ngủ cố định 480ms rồi đo thì bắt được 116 chỗ, trong đó một loạt "vòng sáng lệch" báo
           vòng đang ở [0,900,0,0] - tức app CHƯA vẽ xong. tourPaint còn phải cuộn tới phần tử
           (cuộn mượt ~300ms) rồi mới đặt toạ độ vòng; đo giữa chừng là đo cái chưa có.
           Nay đợi tới khi vòng sáng ĐỨNG YÊN qua hai lần đọc liên tiếp, tối đa 3 giây.
           (Cùng bài học `_checkui` đã rút ở V9.5x: "ngủ một khoảng cố định là ĐUA với hiệu ứng
            cuộn, không phải đợi nó".) */
        await page.waitForFunction(() => {
          const sp = document.getElementById("tourspot");
          if (!sp) return false;
          const r = sp.getBoundingClientRect();
          /* Vòng CHƯA CÓ KÍCH THƯỚC nghĩa là tourPaint còn đang chạy dở, chưa đặt toạ độ:
             nó cuộn tới phần tử (`scrollIntoView` mượt) rồi tự gọi lại sau 320ms, và còn một
             nhánh gọi lại sau 260ms nữa. Bản đầu của bộ này chỉ đợi "đứng yên" nên dừng ngay ở
             trạng thái [0,900,0,0] - vòng chưa vẽ mà máy đã chấm là "vòng sáng lệch", báo oan
             22 chỗ. Phải đợi vòng CÓ kích thước RỒI mới xét đứng yên.
             Bước bị app cố ý ẩn vòng (không tìm ra neo) thì display:none - vẫn thoát được vì
             có mốc thời gian chặn trên. */
          if (getComputedStyle(sp).display === "none") return true;
          if (r.width < 2 || r.height < 2) { window.__neoTruoc = ""; return false; }
          const k = [Math.round(r.x), Math.round(r.y), Math.round(r.width), Math.round(r.height)].join(",");
          const yen = (window.__neoTruoc === k);
          window.__neoTruoc = k;
          return yen;
        }, null, {timeout: 4000, polling: 160}).catch(() => {});
        /* `.tourspot` có `transition:all .22s` - vòng TRƯỢT tới chỗ mới chứ không nhảy. Đọc ngay
           sau khi nó "đứng yên" hai lần vẫn có thể rơi vào giữa quãng trượt. Đợi thêm quá 220ms
           cho hiệu ứng chạy hết rồi mới đo. */
        await page.waitForTimeout(420);
        /* BẪY 07/08 - CI BẮT ĐƯỢC CÁI MÀ MÁY NÀY KHÔNG THẤY. Trên máy chạy CI, hai bước của bài
           `cn_nguong` báo "VÒNG SÁNG LỆCH" với khoảng lệch tới 3195px - tức đúng bằng một quãng
           CUỘN, không phải một sai lệch vài chục pixel. Nghĩa là app chưa cuộn xong thì máy đã đo.
           Vì sao phép đợi ở trên vẫn lọt: nó chỉ hỏi "vòng đã ĐỨNG YÊN chưa". Trang Cài đặt rất
           dài, `scrollIntoView` mượt chạy lâu hơn trên máy CI, nên có một quãng vòng sáng nằm im
           Ở CHỖ CŨ - đứng yên thật, mà là đứng yên trước khi đi.
           Vá đúng chỗ: đợi tới khi vòng sáng THẬT SỰ TRÙNG phần tử, chứ không đợi nó hết động
           đậy. Vẫn có mốc chặn trên 3 giây, nên một bước trỏ SAI THẬT thì hết 3 giây vẫn lệch và
           vẫn bị bắt - phép đo không hề bị nới lỏng, chỉ thôi đua với hiệu ứng cuộn.
           (Đây là lần thứ tư dự án cắn "ngủ một khoảng cố định là ĐUA với hiệu ứng, không phải
            đợi nó" - ba lần trước ở `_checkui`, `_checknv` và chính bộ này.) */
        await page.waitForFunction(([k2, i2]) => {
          const T = window.TOURS[k2], st = T.steps[i2];
          const sp = document.getElementById("tourspot");
          if (!sp) return true;                                   /* không có vòng thì không có gì để đợi */
          if (getComputedStyle(sp).display === "none") return true; /* app cố ý ẩn vòng */
          const el = st.mo ? null : tourFind(st.sel);
          if (!el) return true;                                   /* không tìm ra neo - N1 lo việc đó */
          const a = el.getBoundingClientRect(), s = sp.getBoundingClientRect();
          return Math.abs(s.x - a.x) <= 24 && Math.abs(s.y - a.y) <= 24;
        }, [k, i], {timeout: 3000, polling: 120}).catch(() => {});
        luot++;

        const r = await page.evaluate(([k, i]) => {
          const T = window.TOURS[k], st = T.steps[i];
          const el = st.mo ? null : tourFind(st.sel);
          const sp = document.getElementById("tourspot");
          const hienSpot = sp && getComputedStyle(sp).display !== "none";
          const sr = hienSpot ? sp.getBoundingClientRect() : null;
          const trongContent = (x) => { const c = document.getElementById("content"); return !!(c && x && c.contains(x)); };
          /* CĂN CƯỚC CỦA CHỖ ĐƯỢC KHOANH - dùng cho N3.
             KHÔNG so bằng chuỗi selector: neo `@man` cố ý trả về khối nội dung của MÀN ĐANG MỞ,
             nên hai bước ở hai màn khác nhau cùng viết `@man` là ĐÚNG, không phải trùng. Thứ
             không được trùng là CHỖ THẬT trên màn hình. Nên căn cước = màn đang mở (kể cả tab
             con) + đường đi trong DOM tới phần tử. */
          const canCuoc = (x) => {
            if (!x) return "";
            const man = [window.CUR, window.TSTAB, window.CSTAB, window.HTTAB, window.KTAB,
                         window.DUYTAB, window.GVTAB, window.SETTAB, window.ARC, window.BANTT]
                        .filter(Boolean).join("/");
            const duong = [];
            for (let q = x; q && q.id !== "content" && q !== document.body; q = q.parentElement) {
              const cha = q.parentElement;
              const i = cha ? Array.prototype.indexOf.call(cha.children, q) : 0;
              duong.unshift(q.tagName + "." + String(q.className || "").split(/\s+/)[0] + "[" + i + "]");
              if (duong.length > 6) break;
            }
            return man + " > " + duong.join(" ");
          };
          const rr = el && el.getBoundingClientRect();
          return {
            sel: st.sel || "", mo: !!st.mo, t: st.t || "", p: st.p || "",
            co: !!el, trongContent: trongContent(el), cc: canCuoc(el),
            r: rr ? [Math.round(rr.x), Math.round(rr.y), Math.round(rr.width), Math.round(rr.height)] : null,
            spot: sr ? [Math.round(sr.x), Math.round(sr.y), Math.round(sr.width), Math.round(sr.height)] : null,
            W: innerWidth, H: innerHeight,
          };
        }, [k, i]);

        const nhan = C.ten + " · " + k + " " + (i + 1) + "/" + n + ' "' + r.t.slice(0, 34) + '"';
        if (r.mo) continue;

        /* N1 */
        if (!r.co) { do_.push(nhan + ": KHONG TIM RA NEO " + r.sel); continue; }

        /* N2 - nằm trong màn và có kích thước thật */
        const [x, y, w, h] = r.r;
        if (w < 4 && h < 4) do_.push(nhan + ": neo " + r.sel + " khong co kich thuoc (" + w + "x" + h + ")");
        else if (x + w < 0 || y + h < 0 || x > r.W || y > r.H)
          do_.push(nhan + ": neo " + r.sel + " nam NGOAI MAN (" + x + "," + y + ")");

        /* N3 - một CHỖ trên màn, một bước */
        const maBuoc = k + " " + (i + 1) + "/" + n;
        if (r.cc && daDung[r.cc] && !NEO_CHUNG[r.sel] && !NEO_CHUNG[maBuoc])
          do_.push(nhan + ": KHOANH TRUNG CHO voi " + daDung[r.cc] + " (cung " + r.cc.split(" > ")[0] +
                   ", neo " + r.sel + "). Hai buoc khac nhau khoanh cung mot cho thi it nhat mot buoc" +
                   " dang tro sai. Gan data-tour rieng cho dung thu dang noi toi, hoac khai ly do" +
                   " trong NEO_CHUNG cua _checkneo.js.");
        if (r.cc && !daDung[r.cc]) daDung[r.cc] = maBuoc;
        if (NEO_CHUNG[r.sel] && !bo.includes(r.sel)) bo.push(r.sel);
        if (NEO_CHUNG[maBuoc] && !bo.includes(maBuoc)) bo.push(maBuoc);

        /* N4 - bước nói về nội dung trang thì phải khoanh trong thân trang */
        if (r.p && !r.trongContent && !VO_OK.includes(r.sel) && !String(r.sel).startsWith("@txt:"))
          do_.push(nhan + ": buoc noi ve trang \"" + r.p + "\" ma neo " + r.sel + " roi RA NGOAI than trang (vo app)");

        /* N5 - vòng sáng phải trùng phần tử */
        if (r.spot) {
          const [sx, sy, sw, sh] = r.spot;
          const lech = Math.abs(sx - x) > 24 || Math.abs(sy - y) > 24 ||
                       Math.abs(sw - w) > 40 || Math.abs(sh - h) > 40;
          if (lech) do_.push(nhan + ": VONG SANG LECH khoi phan tu - neo o [" + r.r + "] ma vong ve o [" + r.spot + "]");
        }
      }
    }
    await page.evaluate(() => { try { tourEnd(); } catch (e) {} });
    if (loiJS.length) do_.push(C.ten + ": LOI JS khi chay huong dan - " + loiJS[0]);
    await ctx.close();
  }
  await browser.close();

  if (do_.length) {
    console.log("CHECKNEO DO (" + do_.length + " cho tren " + luot + " buoc / " + soBai + " bai):");
    do_.slice(0, 400).forEach(s => console.log("  - " + s));
    if (do_.length > 400) console.log("  ... con " + (do_.length - 400));
    console.log("CHECKNEO DO");
    process.exit(0);
  }
  console.log("CHECKNEO OK: " + luot + " buoc / " + soBai + " bai tren " + CONG.length + " ban build - moi buoc khoanh"
    + " dung mot cho rieng cua no, nam trong man, trong than trang, vong sang trung phan tu"
    + (bo.length ? " (" + bo.length + " neo dung chung da khai ly do)" : ""));
})();
