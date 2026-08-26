/* _checkmuc.js - MỤC LỤC CỔNG HỌC VIÊN CÓ ĐI CÙNG MỘT NHỊP VỚI THÂN TRANG KHÔNG?
 *
 * VÌ SAO CÓ FILE NÀY (anh Luân 26/08, giữa lúc đang xem cổng học viên):
 *   *"e nên xem lại cả cách bố trí menu, a thấy nó cứ chạy lên chạy xuống"*
 *
 * Đo được lúc ấy - cuộn THẬT bằng con lăn chuột từ đầu tới cuối trang rồi ghi lại mục nào đang
 * sáng: **3 → 4 → 0 → 5 → 6 → 7 → 1 → 10 → 13 → 8 → 9 → 2**, tức LÙI NGƯỢC 4 lần. Người ta cuộn
 * xuống đều một mạch mà vệt sáng nhảy từ mục 13 ngược lên mục 8.
 *
 * Gốc KHÔNG nằm ở phép dò cuộn: mục lục xếp theo NHU CẦU (`HVGRP`), thân trang xếp theo THỨ TỰ
 * VIẾT MÃ. Hai thứ tự khác hẳn nhau, nên dù phép dò có đúng tuyệt đối thì vệt sáng vẫn nhảy.
 * Đã chữa bằng `hvSec`/`hvXep`: `HVGRP` thành thứ tự DUY NHẤT cho cả hai.
 *
 * NHƯNG MỘT LUẬT VỪA ĐẶT MÀ CHƯA CÓ BỘ KIỂM THÌ NÓ CHỈ SỐNG BẰNG TRÍ NHỚ CỦA NGƯỜI VỪA ĐẶT RA
 * NÓ. Hai đường trôi rất dễ xảy ra và cả hai đều IM LẶNG:
 *   · vẽ một khối mới mà quên cắm mốc `hvSec` -> khối ấy dính vào khối phía trên nó, không bao
 *     giờ được xếp lại, và mục lục trỏ vào một chỗ nằm sai vị trí;
 *   · khai một mục vào `HVSEC` mà quên khai vào `HVGRP` -> `hvXep` đẩy nó xuống cuối trang
 *     (đúng theo luật "thiếu lời khai thì mất chỗ trên mục lục, không được mất luôn nội dung"),
 *     nhưng mục lục thì không có nó, nên người dùng không có đường tới.
 *
 * BỐN CÂU HỎI:
 *   M1 - thứ tự mục trên MỤC LỤC có bằng thứ tự khối trên THÂN TRANG không (đo trên DOM thật)
 *   M2 - cuộn từ đầu tới cuối, vệt sáng có LÙI NGƯỢC lần nào không (cuộn thật bằng con lăn)
 *   M3 - mỗi mục trên mục lục có trỏ tới một khối CÓ THẬT trên trang không
 *   M4 - mỗi khối đang hiện trên trang có một mục trên mục lục không (không khối mồ côi)
 *
 * Đo trên NHIỀU hồ sơ, vì mỗi hồ sơ ẩn/hiện một tập khối khác nhau (chưa có WOW thì không có
 * mục WOW; chưa xong khóa thì không có chứng nhận) - một thứ tự đúng với hồ sơ này có thể sai
 * với hồ sơ kia. Và đo cả CHẾ ĐỘ PHỤ HUYNH: nó ẩn hai mục riêng tư, nên có thể để lại một nhóm
 * rỗng hoặc một mục trỏ vào chỗ trống.
 *
 * Chạy: ITTS_OUT=<out> node _checkmuc.js
 */
const PATHS = [
  "/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
  "/opt/pw-browsers/chromium/chrome-linux/chrome",
];
const OUT = process.env.ITTS_OUT || ".";

/* Hồ sơ để soi: ba em có dữ liệu dày nhất (cùng bộ `RICH` mà màn chọn của cổng đang dùng) cộng
   một em bất kỳ - em "thường" mới là người để lộ khối nào không hiện. */
const AI = (process.env.AI || "HV061,HV065,HV002").split(",").filter(Boolean);

(async () => {
  let chromium;
  try { chromium = require("playwright").chromium; }
  catch (e) { console.log("CHECKMUC BO QUA: chua cai playwright (npm i playwright)"); process.exit(0); }
  const fs = require("fs"), path = require("path");
  const exe = PATHS.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  let browser;
  try { browser = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("CHECKMUC BO QUA: khong mo duoc trinh duyet (" + e.message.slice(0, 60) + ")"); process.exit(0); }

  const do_ = [], ghi = [];
  let soCa = 0, soTieuChi = 0;
  const t = (ten, ok) => { soTieuChi++; if (!ok) do_.push(ten); };

  const ctx = await browser.newContext({viewport: {width: 1440, height: 900}});
  const page = await ctx.newPage();
  const loiJS = [];
  page.on("pageerror", e => loiJS.push(String(e.message).slice(0, 110)));
  await page.addInitScript(() => { try {
    sessionStorage.clear();
    localStorage.setItem("ITTS_HELLO_V1", "1");
    /* Đo ở 100%: luật về thứ tự không đổi theo tỷ lệ thu phóng, và để cùng thước với `_checkmat`. */
    localStorage.setItem("ITTS_ZOOM_V1", "100");
  } catch (e) {} });
  await page.goto("file://" + path.resolve(OUT) + "/ITTs_TrangHocVien_demo.html", {waitUntil: "load"});
  await page.waitForFunction(() => typeof window.bootHV === "function", null, {timeout: 30000});
  await page.waitForTimeout(600);

  /* ═══ 26/08 - CỬA CỔNG PHỤ HUYNH CÓ QUYỀN TỪ CHỐI, VÀ NÓ ĐÃ TỪ CHỐI SUỐT ═══════════════════
     Ca "cổng phụ huynh" trước đây luôn lấy `AI[0]` = HV061 - hồ sơ chưa khai số điện thoại người
     đồng hành. `gateEnterPH` gặp thế thì toast một câu rồi RETURN, không vào chế độ phụ huynh.
     Phép đo vẫn ghi `vao = true` (nó chỉ bắt exception), rồi đo tiếp - trên MÀN HÌNH CỦA HỒ SƠ
     LƯỢT TRƯỚC, đang cuộn ở đáy. Nên "cổng phụ huynh" chưa từng được đo một lần nào, mà lại đẻ
     ra một chỗ đỏ giả: vệt sáng "lùi ngược" từ mục cuối về mục đầu chính là màn cũ chưa kịp
     theo lệnh cuộn về đầu.
     *Một phép đo đi vào bằng một cửa CÓ QUYỀN TỪ CHỐI mà không hỏi lại xem mình đã vào chưa thì
     nó đang đo màn hình của lượt trước.*
     Hai chỗ sửa: chọn hồ sơ CÓ người đồng hành, và sau khi vào thì hỏi lại `hvPH()`. */
  const sidPH = await page.evaluate(([ds]) => {
    const co = s => { try { const S = find("DL09", "student_id", s); return !!(S && ghSdt(S)); } catch (e) { return false; } };
    for (const s of ds) if (co(s)) return s;
    try { const r = (rows("DL09") || []).filter(x => ghSdt(x))[0]; return r ? r.student_id : ""; } catch (e) { return ""; }
  }, [AI]);
  if (!sidPH) ghi.push("khong tim ra ho so nao co so dien thoai nguoi dong hanh - bo qua ca cong phu huynh");
  for (const CA of AI.map(x => ({sid: x, ph: 0})).concat(sidPH ? [{sid: sidPH, ph: 1}] : [])) {
    const nhan = CA.sid + (CA.ph ? " (cổng phụ huynh)" : "");
    /* ĐI ĐÚNG CỬA APP DÙNG - `gateEnterHV`/`gateEnterPH`, không tự đặt biến rồi gọi hàm vẽ.
       Luật này đã cắn ba lần trong dự án (xem GIAO_THUC_AUDIT mục 2). */
    const vao = await page.evaluate(([sid, ph]) => {
      /* XOA DIA CHI TRUOC KHI VAO. Bay da can ngay luot chay dau cua bo nay: `bootHV` co chu y
         doc `?<muc>` tren dia chi de F5 hay link nguoi khac gui thi ve dung cho dang doc - dung
         va can giu. Nhung bo kiem doi ho so MA KHONG TAI LAI TRANG, nen dia chi con mang muc
         cuoi cua ho so truoc, app khoi phuc dung theo no, va phep do ket luan "vet sang lui
         nguoc". App khong sai; cai sai la duong vao cua phep do.
         *Mot bo kiem di duong tat thi no do chinh duong tat ay, khong do duong nguoi dung di.* */
      try { if (window.history && history.replaceState) history.replaceState(null, "", location.pathname); } catch (e) {}
      try { if (ph) { gateEnterPH(sid); } else { gateEnterHV(sid); } return true; } catch (e) { return false; }
    }, [CA.sid, CA.ph]);
    if (!vao) { ghi.push(nhan + ": khong vao duoc cong (bo qua)"); continue; }
    await page.waitForTimeout(1100);
    /* Vao THAT chua? Cua phu huynh tu choi im lang thi moi phep do sau day deu do man cu. */
    if (CA.ph) {
      const daVao = await page.evaluate(() => { try { return !!hvPH(); } catch (e) { return false; } });
      if (!daVao) { do_.push(nhan + ": goi gateEnterPH xong ma app KHONG o che do phu huynh - cua da tu choi"); continue; }
    }
    soCa++;

    /* ---- M1 + M3 + M4: so hai thứ tự trên DOM thật ---- */
    const d = await page.evaluate(() => {
      const nav = [...document.querySelectorAll("#hvNav .hvni")].map(e => e.getAttribute("data-s"));
      /* Thứ tự khối trên trang = thứ tự theo `offsetTop`, không phải thứ tự khai trong HVSEC. */
      const tren = (window.HVSEC || []).map(x => x[0])
        .map(id => { const el = document.getElementById(id); return el ? {id, top: el.offsetTop} : null; })
        .filter(Boolean).sort((a, b) => a.top - b.top).map(x => x.id);
      const an = {};
      (window.HVSEC || []).forEach(x => { try { an[x[0]] = !!hvAn(x[0]); } catch (e) { an[x[0]] = false; } });
      return {nav, tren, an};
    });

    /* M3 - mục lục trỏ vào khối có thật */
    const maCo = {}; d.tren.forEach(x => maCo[x] = 1);
    const treo = d.nav.filter(k => !maCo[k]);
    t(nhan + " · M3 moi muc tren muc luc deu tro toi mot khoi co that", treo.length === 0);
    if (treo.length) do_.push("   muc tro vao cho trong: " + treo.join(" "));

    /* M4 - khối đang hiện đều có mục (trừ khối app CỐ Ý ẩn khỏi mục lục) */
    const coMuc = {}; d.nav.forEach(k => coMuc[k] = 1);
    const moCoi = d.tren.filter(k => !coMuc[k] && !d.an[k]);
    t(nhan + " · M4 moi khoi dang hien deu co muc tren muc luc", moCoi.length === 0);
    if (moCoi.length) do_.push("   khoi khong co duong toi: " + moCoi.join(" "));

    /* M1 - hai thứ tự phải BẰNG NHAU trên phần chung */
    const chung = d.nav.filter(k => maCo[k]);
    const theoTrang = d.tren.filter(k => coMuc[k]);
    const khop = JSON.stringify(chung) === JSON.stringify(theoTrang);
    t(nhan + " · M1 thu tu muc luc BANG thu tu than trang", khop);
    if (!khop) {
      do_.push("   muc luc: " + chung.join(" "));
      do_.push("   than trang: " + theoTrang.join(" "));
    }

    /* ---- M5: không còn CHỮ HOA trong thân trang ----
       Đợt 26/08 bỏ chữ hoa ở tiêu đề khối, nhãn tiền và tiêu đề cột - nhưng sửa theo DANH SÁCH
       TÊN LỚP, nên thẻ "Chứng nhận hoàn thành khóa" (lớp riêng, và chỉ hiện với hồ sơ đã học
       xong) lọt lưới và giữ nguyên "HỌC VIÊN · HOÀN THÀNH NGÀY · CHUYÊN CẦN".
       *Sửa theo danh sách tên thì mỗi cái tên không nằm trong danh sách là một vùng tối - và
       vùng tối ấy chỉ lộ ra khi có người mở đúng màn hình có nó.*
       Nay hỏi bằng CÂU HỎI thay vì bằng danh sách: trong thân trang cổng học viên, có phần tử
       nào đang `text-transform:uppercase` không.
       MỤC LỤC ĐƯỢC MIỄN có lý do: tên nhóm ở mục lục là nhãn phân cấp cỡ 10-11px, chữ hoa ở đó
       là để phân biệt với tên mục chứ không phải để nhấn mạnh - và nó nằm ngoài `#hvMain`. */
    const hoa = await page.evaluate(() => {
      const than = document.getElementById("hvMain");
      if (!than) return [];
      const ra = [];
      than.querySelectorAll("*").forEach(el => {
        const cs = getComputedStyle(el);
        if (cs.textTransform !== "uppercase") return;
        const t = (el.textContent || "").trim();
        if (!t) return;
        const r = el.getBoundingClientRect();
        if (r.width < 4 || r.height < 4) return;
        ra.push(t.slice(0, 26) + "  (." + (String(el.className || "").split(" ")[0] || el.tagName) + ")");
      });
      return [...new Set(ra)];
    });
    t(nhan + " · M5 than trang khong con nhan CHU HOA", hoa.length === 0);
    if (hoa.length) hoa.slice(0, 6).forEach(x => do_.push("   chu hoa: " + x));

    /* ---- M2: cuộn THẬT, vệt sáng không được lùi ---- */
    await page.evaluate(() => { const m = document.getElementById("hvMain"); if (m) m.scrollTop = 0; });
    await page.waitForTimeout(350);
    await page.mouse.move(900, 500);
    const duong = [];
    /* Cuộn từng nấc nhỏ cho tới khi chạm đáy; nấc nhỏ mới bắt được cú lùi một bậc, nấc to thì
       nó nhảy qua luôn. Trần 60 nấc để không treo nếu trang dài bất thường. */
    for (let i = 0; i < 60; i++) {
      await page.mouse.wheel(0, 240);
      await page.waitForTimeout(150);
      const r = await page.evaluate(() => {
        const on = document.querySelector("#hvNav .hvni.on");
        const nav = [...document.querySelectorAll("#hvNav .hvni")];
        const m = document.getElementById("hvMain");
        return {idx: on ? nav.indexOf(on) : -1,
                ten: on ? (on.textContent || "").replace(/\s+/g, " ").trim().slice(0, 26) : "",
                day: !!(m && m.scrollTop + m.clientHeight >= m.scrollHeight - 4)};
      });
      duong.push(r);
      if (r.day) break;
    }
    let lui = 0, viTri = [];
    for (let i = 1; i < duong.length; i++) {
      if (duong[i].idx >= 0 && duong[i - 1].idx >= 0 && duong[i].idx < duong[i - 1].idx) {
        lui++;
        if (viTri.length < 4) viTri.push('"' + duong[i - 1].ten + '" -> "' + duong[i].ten + '"');
      }
    }
    t(nhan + " · M2 cuon xuong deu thi vet sang khong LUI NGUOC", lui === 0);
    if (lui) {
      do_.push("   lui nguoc " + lui + " lan: " + viTri.join(" · "));
      do_.push("   duong di: " + duong.map(x => x.idx).join(" "));
    }
    /* Vệt sáng phải THẬT SỰ ĐI - đứng yên suốt cả trang nghĩa là phép dò cuộn đã chết, mà chết
       kiểu ấy thì M2 vẫn xanh (không lùi lần nào). Bẫy này đã cắn ngay lúc dựng bộ: bản đầu của
       phép đo đặt `scrollTop` bằng tay, gặp `scroll-behavior:smooth` nên đọc lại vẫn ra 0 và
       vệt sáng không nhúc nhích - suýt nữa kết luận "menu không nhảy". */
    const soMuc = new Set(duong.filter(x => x.idx >= 0).map(x => x.idx)).size;
    t(nhan + " · M2b vet sang co DI theo trang (khong dung mot cho)", soMuc >= 3);
    if (soMuc < 3) do_.push("   ca trang chi sang " + soMuc + " muc - phep do cuon co con song khong?");
  }

  await ctx.close();
  await browser.close();

  if (loiJS.length) do_.push("loi JS tren cong hoc vien: " + [...new Set(loiJS)].slice(0, 3).join(" | "));

  if (do_.length) {
    console.log("CHECKMUC DO (" + soCa + " ca / " + soTieuChi + " tieu chi):");
    do_.forEach(x => console.log("  " + (x.startsWith("   ") ? x : "- " + x)));
    console.log("CHECKMUC DO");
    process.exit(1);
  }
  ghi.forEach(x => console.log("  ghi chu: " + x));
  console.log("CHECKMUC OK: " + soCa + " ca (hoc vien + phu huynh) · " + soTieuChi +
    " tieu chi - muc luc va than trang di cung mot thu tu, cuon xuong deu thi vet sang khong lui nguoc");
})();
