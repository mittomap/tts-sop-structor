/* _checkbam: BẤM THỬ MỌI THẺ VÀ MỌI DÒNG TRÊN MỌI TRANG, trên trình duyệt thật.

   Anh Luân 03/08, mở bản demo online rồi hỏi đúng câu phải hỏi:
     *"Sao ko gửi khảo sát, sao bấm vào lớp cũng ko thấy liệt kê lịch sử nhỉ"*
     *"ở tab khiếu nại cùng trang, bấm vào tên người khiếu nại cũng chẳng biết họ khiếu nại cái gì"*
     *"Vậy làm sao biết ở các trang khác có tồn tại lỗi gì ko?"*

   Câu cuối là câu quan trọng nhất, và câu trả lời thật lòng lúc đó là: KHÔNG BIẾT. Cả 22 bộ
   kiểm cũ không bộ nào bấm vào một cái thẻ. Chúng đo:
     - chuỗi HTML do hàm render sinh ra (20 bộ)   -> không chạy vào hàm mở ngăn kéo bao giờ
     - hình học trên trình duyệt (`_checkui`)      -> chỉ NHÌN, không bấm
     - một việc từ đầu tới cuối (`_checknv`)       -> chỉ bấm nút "Làm" ở Bàn làm việc
   Nên hai lỗi anh Luân bắt được nằm im rất lâu mà mọi bộ kiểm vẫn xanh:
     1. `SVTPL` được dùng ở 5 chỗ mà chưa bao giờ được khai -> mở form Gửi khảo sát là chết
        ngăn kéo, không một dòng báo lỗi nào cho người dùng. Cả luồng Khảo sát định kỳ của SOP
        đứng im vì một cái bảng thiếu.
     2. Thẻ khiếu nại / phản hồi và dòng lớp trong bảng khảo sát KHÔNG bấm được - người dùng bấm
        theo phản xạ, không có gì xảy ra, và họ kết luận app hỏng.

   BỘ NÀY BẤM THẬT. Với mỗi trang (và mỗi tab của hub): lấy tối đa MAXBAM thẻ `.obcard` / dòng
   bảng / dòng danh sách, bấm vào THÂN (không bấm nút bên trong), rồi hỏi:
     - có lỗi JS không;
     - có gì xảy ra không (ngăn kéo mở / đổi trang / hiện toast / hộp xác nhận);
     - ngăn kéo mở ra có nội dung không (mở ra rỗng cũng là ngõ cụt).
   "Không có gì xảy ra" là ĐỎ - đó chính là thứ anh Luân gặp.

   Chạy: ITTS_OUT=<thu muc> node _checkbam.js
   Biến: ITTS_BAMFILE - chỉ chạy một bản build; ITTS_BAMMAX - số phần tử mỗi trang (mặc định 3) */

const PATHS = ["/opt/pw-browsers/chromium-1194/chrome-linux/chrome",
               "/opt/pw-browsers/chromium/chrome-linux/chrome"];
const OUT    = process.env.ITTS_OUT || ".";
const MAXBAM = +(process.env.ITTS_BAMMAX || 3);
const FILES  = process.env.ITTS_BAMFILE ? [process.env.ITTS_BAMFILE]
             : ["ITTs_WebApp_v5_demo.html"];   /* V9.99: ban V6 da ngung phat hanh */

/* Trang nào KHÔNG có gì để bấm thì khai ở đây kèm lý do đọc được - im lặng bỏ qua thì lần sau
   không ai biết là cố ý hay quên. */
const BOQUA = {
  settings: "man cau hinh - the o day la o nhap, khong phai the ho so",
  hoidap:   "hop hoi dap - go cau hoi, khong co the",
  gopy:     "trang gop y - the do chinh nguoi dung ghi, co nut rieng",
  dashboard:"tong quan - o thong ke chi de xem, da co luat rieng o _checkaudit",
  baocao:   "bao cao - bang so, khong phai danh sach ho so",
  hoso:     "ho so 360 - bang trong do la diem ky nang, khong phai danh sach de mo tiep",
  hosogv:   "nhu tren", hosonv: "nhu tren", hosokhoa: "nhu tren",
};

(async () => {
  let chromium;
  try { ({chromium} = require("playwright")); }
  catch (e) { console.log("CHECKBAM BO QUA: chua cai playwright"); process.exit(0); }
  const fs = require("fs"), path = require("path");
  const exe = PATHS.find(p => { try { return fs.existsSync(p); } catch (e) { return false; } });
  let browser;
  try { browser = await chromium.launch(exe ? {executablePath: exe} : {}); }
  catch (e) { console.log("CHECKBAM BO QUA: khong mo duoc Chromium"); process.exit(0); }

  const do_ = [], ghi = [];
  let dem = {trang: 0, bam: 0, keo: 0, nhay: 0, noi: 0, doi: 0, im: 0, loiJS: 0};

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
    await page.waitForFunction(() => typeof window.go === "function" && typeof window.PBK === "object",
      null, {timeout: 30000});
    await page.waitForTimeout(300);
    const ten = F.replace(/^ITTs_WebApp_|_demo\.html$/g, "");
    const nhan = t => ten + " · " + t;

    /* Vào bằng Quản trị viên: phạm vi rộng nhất, nên trang nào cũng có dữ liệu để bấm.
       Phân quyền theo người đã có `_checknguoi` lo. */
    await page.evaluate(() => { gateEnter(""); });
    await page.waitForTimeout(200);

    /* Danh sách MÀN: mọi trang vẽ được, cộng mọi tab của các hub. Lấy từ chính app, không
       liệt kê tay - thêm trang mới là bộ kiểm tự đi qua. */
    const MAN = await page.evaluate(() => {
      const out = [];
      Object.keys(PBK).forEach(k => { if (RENDER[k] || (PBK[k] && PBK[k].ty === "list")) out.push({k, tab: ""}); });
      const HUB = {duyet: "DUYMAP", tuyensinh: "TSMAP", hoctap: "HTMAP", cskh: "CSMAP", khac: "KMAP"};
      Object.keys(HUB).forEach(hub => {
        const M = window[HUB[hub]] || {};
        Object.keys(M).forEach(tabKey => out.push({k: hub, tab: String(M[tabKey] || tabKey), sub: tabKey}));
      });
      return out;
    });

    for (const M of MAN) {
      if (BOQUA[M.k] && !M.tab) continue;
      const nhanMan = M.k + (M.tab ? ("#" + M.tab) : "");
      loiJS = [];
      const mo = await page.evaluate(([k, tab]) => {
        try {
          closeModal();
          if (tab) {
            const HUB = {duyet: "DUYTAB", tuyensinh: "TSTAB", hoctap: "HTTAB", cskh: "CSTAB", khac: "KTAB"};
            if (HUB[k]) window[HUB[k]] = tab;
          }
          go(k);
          return {ok: true, cur: window.CUR, dai: (document.getElementById("content") || {}).innerHTML.length};
        } catch (e) { return {ok: false, loi: String(e.message).slice(0, 80)}; }
      }, [M.k, M.tab]);
      if (!mo.ok) { do_.push(nhan(nhanMan + ": mo trang NEM LOI - " + mo.loi)); continue; }
      if (loiJS.length) { dem.loiJS++; do_.push(nhan(nhanMan + ": LOI JS khi mo trang - " + loiJS[0])); continue; }
      dem.trang++;

      /* Phần tử "đáng lẽ bấm được": thẻ hồ sơ, dòng bảng dữ liệu, dòng danh sách. */
      const sels = ["#content .obcard", "#content table.dt tbody tr", "#content .lrow", "#content .banrow"];
      for (const sel of sels) {
        let n = 0;
        try { n = await page.locator(sel).count(); } catch (e) { continue; }
        if (!n) continue;
        const lay = Math.min(n, MAXBAM);
        for (let i = 0; i < lay; i++) {
          loiJS = [];
          /* về đúng màn cũ trước mỗi lượt bấm - lượt trước có thể đã nhảy đi nơi khác */
          await page.evaluate(([k, tab]) => {
            try { closeModal(); closeConfirm(); } catch (e) {}
            try {
              const HUB = {duyet: "DUYTAB", tuyensinh: "TSTAB", hoctap: "HTTAB", cskh: "CSTAB", khac: "KTAB"};
              if (tab && HUB[k]) window[HUB[k]] = tab;
              go(k);
            } catch (e) {}
          }, [M.k, M.tab]);
          await page.waitForTimeout(60);
          let el;
          try { el = page.locator(sel).nth(i); if (!(await el.count())) continue; } catch (e) { continue; }
          /* dòng rỗng ("không có dữ liệu") không phải chỗ bấm - bỏ qua, không tố oan */
          let txt = "";
          try { txt = String(await el.textContent() || "").trim(); } catch (e) {}
          if (!txt || txt.length < 4) continue;
          let coEmpty = false;
          try { coEmpty = (await el.locator(".empty").count()) > 0; } catch (e) {}
          if (coEmpty) continue;
          dem.bam++;
          const truoc = await page.evaluate(() => {
            const c = document.getElementById("content");
            return {cur: window.CUR, keo: document.getElementById("drawer").classList.contains("on"),
                    dom: c ? c.innerHTML.length : 0, dau: c ? c.innerHTML.slice(0, 400) : ""};
          });
          try { await el.click({timeout: 4000, position: {x: 8, y: 8}}); }
          catch (e) { do_.push(nhan(nhanMan + ": khong bam duoc " + sel + " thu " + (i + 1))); continue; }
          await page.waitForTimeout(280);
          const sau = await page.evaluate(() => {
            const dr = document.getElementById("drawer"), to = document.getElementById("toast"),
                  cf = document.getElementById("cfm");
            return {
              keo: dr.classList.contains("on"),
              keoDai: (document.getElementById("drawerBody") || {}).innerHTML.length || 0,
              keoTen: String((document.getElementById("drawerTitle") || {}).textContent || "").trim(),
              toast: (to && to.classList.contains("show")) ? String(to.textContent || "").trim() : "",
              hoi: !!(cf && cf.classList.contains("on")),
              cur: window.CUR,
              dom: (document.getElementById("content") || {}).innerHTML ? document.getElementById("content").innerHTML.length : 0,
              dau: (document.getElementById("content") || {}).innerHTML ? document.getElementById("content").innerHTML.slice(0, 400) : "",
            };
          });
          const nhanO = nhanMan + " · " + sel.replace("#content ", "") + " #" + (i + 1) +
                        ' "' + txt.replace(/\s+/g, " ").slice(0, 38) + '"';
          if (loiJS.length) { dem.loiJS++; do_.push(nhan(nhanO + ": LOI JS khi bam - " + loiJS[0])); continue; }
          if (sau.keo && !truoc.keo) {
            dem.keo++;
            if (sau.keoDai < 120) { do_.push(nhan(nhanO + ": ngan keo mo ra gan nhu TRONG (" + sau.keoDai + " ky tu)")); continue; }
            /* ANH LUAN 03/08: *"khong chi bam, ma phai xem tinh hop ly cua no va hanh dong, va
               trang mo ra, noi dung tuong tac"*. Ba cau do duoc, va deu la loi that neu sai: */
            const than = await page.evaluate(() => {
              const b = document.getElementById("drawerBody");
              return {chu: b ? String(b.textContent || "") : "", nut: b ? b.querySelectorAll("button").length : 0};
            });
            /* (a) MO DUNG HO SO VUA BAM - khong phai mo bua mot cai gi do.
               CHI hoi khi biet CHAC ma ho so cua dong: doc `data-mo-arg` cua chinh dong, hoac mot
               ma dang "XX-123" nam trong dong. Ban dau cau nay lay "tu dai nhat trong dong" lam
               moc - ma chu cac o trong bang dinh lien nhau khi doc textContent ("BaoDang hoc"),
               nen no tu oan 8 ngan keo dang mo DUNG. Khong biet chac thi dung hoi, con hon hoi
               bang mot cai moc bia ra. */
            /* Chi hoi khi dong TU KHAI ma ho so cua no (`data-mo-arg`). Rut ma tu textContent la
               sai: chu cac o trong bang dinh lien nhau, "LOP-FOUND-PLA-01" + o ke "10" + "100"
               thanh "LOP-FOUND-PLA-0110100" - roi bo kiem tu oan mot ngan keo dang mo dung. */
            let moc = "";
            try { const a = String(await el.getAttribute("data-mo-arg") || ""); if (a.indexOf("|") >= 0) moc = a.split("|")[1]; } catch (e) {}
            const dayDu = (sau.keoTen + " " + than.chu);
            if (moc && dayDu.indexOf(moc) < 0)
              do_.push(nhan(nhanO + ': ngan keo mo ra KHONG NHAC toi ho so vua bam ("' + moc + '" khong co trong "' +
                sau.keoTen + '")'));
            /* (b) KHONG LO CHU MAY ra man hinh */
            const may = (than.chu.match(/undefined|NaN|\[object Object\]|\bnull\b/) || [])[0];
            if (may) do_.push(nhan(nhanO + ": ngan keo lo chu may '" + may + "' ra man hinh"));
            /* (c) KHONG PHAI NGO CUT: hoac co viec de lam tiep, hoac du day la ban doc */
            if (!than.nut && than.chu.length < 400)
              ghi.push(nhan(nhanO + ": ngan keo khong co nut nao va cung it noi dung (" + than.chu.length + " ky tu)"));
            continue;
          }
          if (sau.cur !== truoc.cur) { dem.nhay++; continue; }
          if (sau.toast) { dem.noi++; continue; }
          if (sau.hoi) { dem.noi++; continue; }
          /* Nhieu dong mo ho so NGAY TAI CHO (Ban lam viec, bang lop): khong ngan keo, khong doi
             trang, nhung than trang ve lai khac han. Ban dau bo kiem nay khong biet tin hieu do
             va tu oan 8 dong dang chay dung. Do THAN TRANG chu dung do bang von tu cua minh. */
          if (Math.abs(sau.dom - truoc.dom) > 200 || sau.dau !== truoc.dau) { dem.doi++; continue; }
          dem.im++;
          do_.push(nhan(nhanO + ": BAM VAO KHONG CO GI XAY RA - khong mo ngan keo, khong doi trang, khong bao gi"));
        }
      }
    }
    await ctx.close();
  }
  await browser.close();

  const tom = "da bam THAT " + dem.bam + " the/dong tren " + dem.trang + " man (" + FILES.length +
    " ban build) - mo ngan keo " + dem.keo + " · nhay trang " + dem.nhay + " · mo tai cho " + dem.doi + " · bao co loi " + dem.noi +
    (dem.im ? (" · IM LANG " + dem.im) : "") + (dem.loiJS ? (" · loi JS " + dem.loiJS) : "");

  if (do_.length) {
    console.log("CHECKBAM FAIL (" + do_.length + "): " + tom);
    do_.slice(0, 30).forEach(x => console.log("  - " + x));
    if (do_.length > 30) console.log("  ... con " + (do_.length - 30) + " cho nua");
    process.exit(1);
  }
  console.log("CHECKBAM OK: " + tom);
  if (ghi.length) ghi.slice(0, 10).forEach(x => console.log("  ghi chu: " + x));
})();
