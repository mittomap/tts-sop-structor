/* _checknv: NHÂN VIÊN ẢO - máy ngồi làm việc thay người, trên trình duyệt thật.
   Anh Luân: *"e có máy học nào chạy thay nhân viên test luôn ko"*.

   Vì sao 21 bộ kiểm cũ chưa trả lời được câu này:
    - 20 bộ đầu kiểm CHUỖI HTML: chúng hỏi "màn này vẽ ra có đúng chữ không", không ai bấm.
    - `_checkui` có mở trình duyệt thật (1431 lượt) nhưng chỉ NHÌN: cuộn ngang, chữ bị cắt, nút
      quá nhỏ. Nó không bấm một nút nào.
   Nghĩa là cho tới nay chưa có bộ kiểm nào đi hết một VIỆC: mở hồ sơ -> bấm Làm -> điền form ->
   bấm Lưu -> xem việc có thật sự được ghi không. Đúng phần mà một nhân viên thật làm cả ngày.
   Bộ kiểm này làm đúng chuyện đó, bằng chuột thật trên DOM thật.

   MỘT LƯỢT LÀM VIỆC = 6 bước, mỗi bước là một chỗ có thể chết:
     1. vào app bằng danh tính một chức danh có thật trong DL01
     2. mở Bàn làm việc, chọn một trong bốn thực thể
     3. bấm một hồ sơ trong danh sách  (chuột thật)
     4. bấm nút "Làm" của một việc     (chuột thật)
     5. điền mọi ô còn trống trong ngăn kéo, rồi bấm Lưu (chuột thật)
     6. đối chiếu: sổ nhật ký DL25 có dài thêm không

   LUẬT CHẤM - viết ra đây để bộ kiểm không thể xanh bằng cách dễ dãi:
     Bấm Lưu xong chỉ có HAI kết cục được tính là đạt:
       (a) app GHI: nhật ký DL25 dài thêm ít nhất một dòng;
       (b) app TỪ CHỐI CÓ LỜI: hiện toast nói rõ thiếu gì.
     Mọi kết cục khác là đỏ, và cái nguy hiểm nhất nằm ở đây: bấm mà KHÔNG CÓ GÌ XẢY RA -
     không ghi, không báo, ngăn kéo vẫn mở. Người thật gặp cảnh đó sẽ bấm lại vài lần rồi
     bỏ đi, và không có bộ kiểm chuỗi nào nhìn thấy được.

   Chạy:  ITTS_OUT=<thu muc> node _checknv.js
   Biến:  ITTS_NVHS  - số hồ sơ thử mỗi (chức danh x thực thể), mặc định 2
          ITTS_NVFILE - chỉ chạy một bản build (mặc định chạy cả v5 lẫn v6) */

const PATHS = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
               "/opt/pw-browsers/chromium/chrome-linux/chrome"];
const OUT   = process.env.ITTS_OUT || ".";
const MAXHS = +(process.env.ITTS_NVHS || 2);
const FILES = process.env.ITTS_NVFILE ? [process.env.ITTS_NVFILE]
            : ["ITTs_WebApp_v5_demo.html", "ITTs_WebApp_v6_demo.html"];

/* ---- các đoạn chạy TRONG trang ---------------------------------------------------------- */

/* Chụp lại dữ liệu gốc để sau mỗi lượt làm việc trả app về đúng chỗ cũ.
   Không trả về thì lượt sau đo trên một thế giới đã bị lượt trước sửa - đúng cái bẫy "thước
   đang chạy" mà dự án đã cắn bốn lần trong một ngày. */
const SNAP = () => {
  window.__snap = JSON.stringify(DL);
  window.__snapCfg = JSON.stringify(DATA.config || {});
  return Object.keys(DL).length;
};
const RESTORE = () => {
  const s = JSON.parse(window.__snap);
  for (const k in DL) { if (!s[k]) delete DL[k]; }
  for (const k in s) {
    if (!DL[k]) DL[k] = [];
    DL[k].length = 0;
    s[k].forEach(r => DL[k].push(Object.assign({}, r)));
  }
  DATA.config = JSON.parse(window.__snapCfg);
  /* Xoá luôn bộ chống bấm-hai-lần: nó khoá theo THỜI GIAN THẬT (1200ms), mà máy chạy nhanh hơn
     người rất nhiều - hai lượt thử khác nhau rơi vào cùng một cửa sổ khoá thì lượt sau bị app
     từ chối oan, và bộ kiểm sẽ báo một lỗi KHÔNG CÓ THẬT. Bẫy "thước đang chạy", lần thứ năm. */
  try { for (const k in __actT) delete __actT[k]; } catch (e) {}
  try { deriveAll(); } catch (e) {}
};

/* Danh sách chức danh có thật: mỗi vai lấy MỘT người trong DL01 đang làm việc.
   Không bịa vai - vai nào SOP không có người thì bộ kiểm không dựng ra một người giả. */
const AITHUC = () => {
  const out = [], da = {};
  (DL.DL01 || []).forEach(s => {
    const v = String(s.role || "").trim();
    const tt = String(s.status || "").toLowerCase();
    if (!v || da[v]) return;
    if (tt && !/active|đang|working/i.test(tt)) return;
    da[v] = 1;
    out.push({sid: s.staff_id, vai: v, ten: s.full_name || s.staff_id});
  });
  return out;
};

/* Điền mọi ô còn trống trong ngăn kéo. Điền GIÁ TRỊ HỢP LỆ, không điền bừa: ô ngày ra ngày,
   ô số ra số, ô chọn giữ nguyên mặc định của app (mặc định là do app tự chọn, sửa đi là đo
   một đường mà người thật đi một đường khác). */
const DIEN = () => {
  const box = document.getElementById("drawerBody");
  if (!box) return 0;
  const d = new Date(); const p = n => String(n).padStart(2, "0");
  const ngay = d.getFullYear() + "-" + p(d.getMonth() + 1) + "-" + p(d.getDate());
  const gio  = ngay + "T" + p(d.getHours()) + ":" + p(d.getMinutes());
  let n = 0;
  box.querySelectorAll("input, textarea, select").forEach(el => {
    if (el.type === "hidden" || el.type === "file" || el.disabled) return;
    if (el.tagName === "SELECT") {
      if (!el.value && el.options.length) { el.selectedIndex = 0; n++; }
      return;
    }
    if (el.type === "checkbox" || el.type === "radio") return;
    if (String(el.value || "").trim()) return;
    if (el.type === "date") el.value = ngay;
    else if (el.type === "datetime-local") el.value = gio;
    else if (el.type === "time") el.value = p(d.getHours()) + ":" + p(d.getMinutes());
    else if (el.type === "number") el.value = "1";
    else if (el.type === "email") el.value = "maythu@thetutors.edu.vn";
    else if (el.type === "tel") el.value = "0900000000";
    else el.value = "Máy thử tự điền";
    el.dispatchEvent(new Event("input", {bubbles: true}));
    el.dispatchEvent(new Event("change", {bubbles: true}));
    n++;
  });
  return n;
};

const TRANGTHAI = () => {
  const dr = document.getElementById("drawer");
  const to = document.getElementById("toast");
  const cf = document.getElementById("cfm");
  return {
    keoMo: !!(dr && dr.classList.contains("on")),
    keoDai: dr ? (document.getElementById("drawerBody") || {}).innerHTML.length || 0 : 0,
    keoTen: String((document.getElementById("drawerTitle") || {}).textContent || "").trim(),
    toast: (to && to.classList.contains("show")) ? String(to.textContent || "").trim() : "",
    hoi: !!(cf && cf.classList.contains("on")),
    log: (typeof logRows === "function") ? logRows().length : -1,
    cur: window.CUR || "",
  };
};

/* ---- vòng chạy -------------------------------------------------------------------------- */

(async () => {
  let chromium;
  try { ({chromium} = require("playwright")); }
  catch (e) { console.log("CHECKNV BO QUA: chua cai playwright"); process.exit(0); }
  const fs = require("fs"), path = require("path");
  const exe = PATHS.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  let browser;
  try { browser = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("CHECKNV BO QUA: khong mo duoc Chromium (" + e.message.slice(0, 60) + ")"); process.exit(0); }

  const do_ = [];          /* chỗ đỏ */
  const ghi = [];          /* chỗ đáng ghi chú, không tính đỏ */
  let dem = {luot: 0, ghiDuoc: 0, tuChoi: 0, imLang: 0, khongKeo: 0, loiJS: 0, nhay: 0, tiep: 0};

  for (const F of FILES) {
    if (!fs.existsSync(path.resolve(OUT) + "/" + F)) { do_.push(F + ": khong co file build"); continue; }
    const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
    const page = await ctx.newPage();
    let loiJS = [];
    page.on("pageerror", e => loiJS.push(String(e.message).slice(0, 120)));
    await page.addInitScript(() => {
      try { sessionStorage.setItem("ITTS_WHO", ""); localStorage.setItem("ITTS_HELLO_V1", "1"); } catch (e) {}
    });
    await page.goto("file://" + path.resolve(OUT) + "/" + F, {waitUntil: "load"});
    await page.waitForFunction(() => typeof window.go === "function" && typeof window.ttDanhSach === "function",
      null, {timeout: 30000});
    await page.waitForTimeout(300);

    await page.evaluate("window.RESTORE_FN = " + RESTORE.toString());
    const laV6 = await page.evaluate(() => typeof V6 === "function" && V6());
    const ten = F.replace(/^ITTs_WebApp_|_demo\.html$/g, "");
    const nhan = t => ten + " · " + t;
    await page.evaluate(SNAP);

    const ai = await page.evaluate(AITHUC);
    if (!ai.length) { do_.push(nhan("khong tim thay chuc danh nao trong DL01")); continue; }
    const TTS = await page.evaluate(() => TTHE.map(x => ({k: x.k, t: x.t})));

    for (const A of ai) for (const TT of TTS) {
      /* mỗi (chức danh x thực thể): lấy tối đa MAXHS hồ sơ đang còn việc của chính người đó */
      const hs = await page.evaluate(([sid, k, n]) => {
        RESTORE_FN();
        gateEnter(sid);
        go("ban"); banChon(k);
        return ttDanhSach(k).filter(z => z.viec.length).slice(0, n)
          .map(z => ({ma: z.ma, ten: z.ten, viec: z.viec.map(v => v.t),
                      /* việc HÀNG LOẠT đã khai lý do: ở v6 nó đi thẳng tới màn chứ không mở
                         ngăn kéo - chấm bằng thước khác, không phải thước "phải làm tại chỗ" */
                      hl: z.viec.map(v => !!v.vichung)}));
      }, [A.sid, TT.k, MAXHS]);

      for (const H of hs) for (let i = 0; i < H.viec.length; i++) {
        dem.luot++;
        loiJS = [];
        /* dựng lại thế giới sạch rồi đi lại từ đầu - mỗi việc được thử trên dữ liệu gốc */
        const dat = await page.evaluate(([sid, k, ma]) => {
          RESTORE_FN();
          gateEnter(sid);
          go("ban"); banChon(k); banMo(ma);
          return {cur: window.CUR, log: logRows().length,
                  nut: document.querySelectorAll(".banjob button.btn.primary").length};
        }, [A.sid, TT.k, H.ma]);

        const cx = nhan(A.vai + " · " + TT.t + " · " + H.ten + " · viec \"" + H.viec[i] + "\"");
        if (dat.cur !== "ban") { do_.push(cx + ": mo Ban lam viec khong duoc (CUR=" + dat.cur + ")"); continue; }
        if (dat.nut <= i) { do_.push(cx + ": ho so ve ra " + dat.nut + " nut Lam, thieu nut cho viec nay"); continue; }

        /* BƯỚC 4 - bấm nút Làm bằng chuột thật */
        await page.locator(".banjob button.btn.primary").nth(i).click({timeout: 5000}).catch(e => {
          do_.push(cx + ": khong bam duoc nut Lam (" + String(e.message).split("\n")[0].slice(0, 70) + ")");
        });
        await page.waitForTimeout(220);
        let st = await page.evaluate(TRANGTHAI);

        if (!st.keoMo) {
          /* v5 cố ý nhảy trang - đó là thiết kế của bản 5, không phải lỗi. Nhưng nhảy sang một
             trang TRỐNG hay nhảy xong lỗi JS thì vẫn là lỗi, nên vẫn phải soi.
             Ở v6, 5 việc hàng loạt cũng cố ý nhảy trang (từ V9.81) - chấm y hệt vế v5. */
          if (!laV6 || H.hl[i]) {
            dem.nhay++;
            const dai = await page.evaluate(() => (document.getElementById("content") || {}).innerHTML.length || 0);
            if (st.cur === "ban") do_.push(cx + ": bam Lam ma khong di dau ca, cung khong mo ngan keo");
            else if (dai < 400) do_.push(cx + ": nhay sang trang " + st.cur + " nhung trang trong (" + dai + " ky tu)");
            if (loiJS.length) { dem.loiJS++; do_.push(cx + ": LOI JS khi nhay trang - " + loiJS[0]); }
            continue;
          }
          dem.khongKeo++;
          do_.push(cx + ": bam Lam ma ngan keo khong mo (v6 phai lam tai cho)");
          continue;
        }
        if (st.keoDai < 120) { do_.push(cx + ": ngan keo mo ra nhung gan nhu trong (" + st.keoDai + " ky tu)"); continue; }

        /* BƯỚC 5 - điền rồi Lưu. Nút Lưu là nút primary trong .dact, không phải nút Đóng. */
        await page.evaluate(DIEN);
        /* Nút GHI là nút chính có chữ nói tới việc ghi - không lấy bừa nút primary cuối cùng:
           trong ngăn kéo dùng lại của app còn có nút "Mở màn", "Xem", "Đóng" cũng là primary. */
        const luu = page.locator("#drawerBody button.btn.primary")
          .filter({hasText: /Lưu|Ghi|Xác nhận|Gửi|Chốt|Duyệt|Tạo|Đặt|Đánh dấu|Hoàn tất|Nhận|Bàn giao/i }).first();
        const coLuu = await luu.count();
        if (!coLuu) {
          /* Không có nút ghi: chấp nhận được NẾU ngăn kéo tự khai đây là việc hàng loạt và
             chìa ra một nút mở màn làm việc. Im lặng không nút thì là ngõ cụt. */
          const mo = await page.locator("#drawerBody .dact button").count();
          if (mo) ghi.push(cx + ": viec hang loat - ngan keo chi tro sang man lam viec");
          else do_.push(cx + ": ngan keo khong co nut nao de lam tiep - ngo cut");
          await page.evaluate(() => { try { closeModal(); } catch (e) {} });
          continue;
        }
        const truoc = st.log, tenTruoc = st.keoTen;
        /* Xoá toast CŨ trước khi bấm Lưu. Toast sống 1.9 giây thật, máy chạy nhanh hơn thế
           nhiều - không xoá thì câu nhắc của lượt TRƯỚC còn đang hiện sẽ bị tính là "app từ
           chối có lời" của lượt NÀY, và một nút Lưu chết sẽ được chấm là đạt. Đây là kiểu hỏng
           nguy hiểm nhất của một bộ kiểm: nó không báo sai, nó im lặng bỏ qua. */
        await page.evaluate(() => { const t = document.getElementById("toast");
          if (t) { t.classList.remove("show"); t.textContent = ""; } });
        await luu.click({timeout: 5000}).catch(e => {
          do_.push(cx + ": khong bam duoc nut Luu (" + String(e.message).split("\n")[0].slice(0, 70) + ")");
        });
        await page.waitForTimeout(200);
        st = await page.evaluate(TRANGTHAI);
        /* Có việc hỏi lại trước khi ghi - trả lời Đồng ý rồi mới tính kết quả. */
        if (st.hoi) {
          await page.locator("#cfm button.btn.primary").last().click({timeout: 4000}).catch(() => {});
          await page.waitForTimeout(200);
          st = await page.evaluate(TRANGTHAI);
        }

        if (loiJS.length) { dem.loiJS++; do_.push(cx + ": LOI JS khi Luu - " + loiJS[0]); continue; }
        if (st.log > truoc) {
          dem.ghiDuoc++;
          /* Ghi xong mà ngăn kéo vẫn mở thì phải phân biệt hai chuyện khác hẳn nhau:
             - MỞ TIẾP một ngăn kéo khác (biên lai sau khi thu tiền) - đúng thiết kế;
             - đứng nguyên CÁI FORM VỪA LƯU - người dùng không biết đã lưu hay chưa, và rất
               dễ bấm Lưu thêm lần nữa. Cái sau mới là lỗi. */
          if (st.keoMo && st.keoTen === tenTruoc)
            do_.push(cx + ": da ghi nhung FORM VUA LUU van dung nguyen (\"" + tenTruoc + "\") - de bam luu hai lan");
          else if (st.keoMo) dem.tiep++;
        } else if (st.toast) {
          dem.tuChoi++;
          ghi.push(cx + ": app tu choi co loi - \"" + st.toast.slice(0, 80) + "\"");
        } else {
          dem.imLang++;
          do_.push(cx + ": bam Luu ma KHONG GHI, KHONG BAO - nguoi that se bam lai roi bo di");
        }
        await page.evaluate(() => { try { closeModal(); closeConfirm(); } catch (e) {} });
      }
    }
    await ctx.close();
  }
  await browser.close();

  const tom = "da lam THAT " + dem.luot + " luot viec (bam chuot that tren " + FILES.length + " ban build)" +
    " - ghi duoc " + dem.ghiDuoc + " (trong do " + dem.tiep + " luot mo tiep man ke) · tu choi co loi " + dem.tuChoi +
    (dem.nhay ? " · nhay trang (ban 5) " + dem.nhay : "") +
    (dem.imLang ? " · IM LANG " + dem.imLang : "") +
    (dem.khongKeo ? " · khong mo ngan keo " + dem.khongKeo : "") +
    (dem.loiJS ? " · loi JS " + dem.loiJS : "");

  if (do_.length) {
    console.log("CHECKNV FAIL (" + do_.length + "/" + dem.luot + " luot): " + tom);
    do_.slice(0, 25).forEach(x => console.log("  - " + x));
    if (do_.length > 25) console.log("  ... con " + (do_.length - 25) + " cho nua");
    process.exit(1);
  }
  console.log("CHECKNV OK: " + tom);
  if (ghi.length) {
    console.log("  ghi chu: " + ghi.length + " luot (viec hang loat / app tu choi co loi)");
    if (process.env.ITTS_NVCHITIET) ghi.forEach(x => console.log("    · " + x));
  }
})();
