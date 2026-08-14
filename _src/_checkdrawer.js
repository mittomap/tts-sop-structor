/* _checkdrawer.js - HÌNH HỌC CỦA NGĂN KÉO, ĐO BẰNG TRÌNH DUYỆT THẬT.
 *
 * VÌ SAO CÓ FILE NÀY (anh Luân 05/08, kèm ảnh chụp màn hình): *"có vài lỗi css ở drawer em"*.
 * Ảnh cho thấy ô "Học viên (kèm quota WOW còn lại)" rồi một mảng trắng cao gần nửa màn hình,
 * mãi dưới mới tới "Kỹ năng".
 *
 * GỐC - MỘT BẢN VÁ CŨ ĐẺ RA LỖI MỚI. `.pk{flex:1 1 224px}` viết ra hồi V9.99f để nói CHIỀU RỘNG
 * tối thiểu (lúc đó anh Luân báo "mấy cái ô này hẹp quá"). Nhưng `flex-basis` đo theo TRỤC CHÍNH
 * CỦA CHA: ở thanh lọc, cha xếp ngang -> 224px là chiều rộng, đúng ý; trong ngăn kéo, `.fld` xếp
 * DỌC -> 224px thành CHIỀU CAO. Cùng một dòng CSS, hai nơi hiểu hai nghĩa. Nay bề rộng nói bằng
 * `min-width` (không phụ thuộc trục), `flex-basis` để `auto`.
 *
 * VÌ SAO 29 BỘ KIỂM CŨ KHÔNG THẤY: HTML hoàn toàn đúng, không lỗi JS, không tràn ngang, chữ
 * không bị cắt. `_checkux` soi NỘI DUNG form (có câu giải thích chưa, có nút Lưu chưa) chứ không
 * soi HÌNH. `_checkmat` soi hình nhưng đi theo TRANG, không mở ngăn kéo. Chỗ hở nằm đúng giữa
 * hai bộ - nên phải có bộ thứ ba đứng vào đó.
 *
 * BỐN PHÉP ĐO (mở thật 25 ngăn kéo trên 15 trang, đo bằng Chromium):
 *   D1  Ô MỘT DÒNG MÀ CAO      - `.pk`/input/select cao quá 64px thì nó đang chiếm chỗ không phải của nó
 *   D2  THÒ RA NGOÀI / CUỘN NGANG - mép phải vượt khỏi thân ngăn kéo
 *   D3  KHE TRỐNG GIỮA HAI MỤC - hai mục liền nhau cách nhau quá 40px: đúng cái mắt anh Luân thấy
 *   D4  Ô NHẬP DẸT             - ô nhập thấp dưới 30px (thường do CSS của form không chạm tới)
 *
 * TỰ THỬ LẠI CÁI THƯỚC - làm rồi, không bỏ qua: chạy bộ này trên bản CŨ (bản còn lỗi) thì nó
 * phải ĐỎ. Nó đỏ thật, bắt đúng 224px ở ngăn kéo "Giao việc mới". Một cái thước chỉ báo xanh mà
 * chưa từng báo đỏ là một cái thước chưa ai biết nó có đo được gì không - hôm nay đã cắn một lần
 * đúng kiểu đó (`_checkmoi` đo trên chuỗi thô).
 *
 * Chạy: ITTS_OUT=<out> node _checkdrawer.js
 */
const OUT=process.env.O||process.env.ITTS_OUT||".";
const PATHS=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome"];
/* 14/08 - THEM `viec`. Danh sach nay cam cung, va hom nay ba khoi mo duoc ngan keo ("Can chu y",
   nhip ngay, bang viec theo chuc danh) da DOI CHO tu `banlam` sang `viec` khi gop hai ban lam
   viec lam mot. Thuoc khong di theo thi so ngan keo mo duoc tut tu 40+ xuong 34 va bao do - mot
   bao dong dung ve con so nhung sai ve nguyen nhan: khong be mat nao mat, chi la thuoc thoi di
   qua cho chung dang dung. *Danh sach trang cam cung thi moi lan kien truc doi la mot lan bao
   dong gia - lan thu tu trong ngay mot ban do cam cung noi sai.* */
/* 14/08 - THUOC CHI MO TAB MAC DINH CUA MOI TRANG, nen mot be mat nam o tab thu hai thi no khong
   bao gio di qua. Lo ra khi gop "Hoc vien lien he" vao Giao viec: 8 the yeu cau hoc vien (moi the
   mo mot ngan keo) chuyen sang tab "Tu hoc vien" va bien mat khoi pham vi do, du app khong mat gi.
   Nay khai duoc dang `trang#tab`. Va them `socamket` - mot trang MOI dung 14/08, moi dong co nut
   "Xem ban da ky" mo ngan keo, chua bao gio duoc di qua.
   *Mot bo kiem chi soi mat tien thi cai gi lui vao trong deu an toan tuyet doi - va do khong phai
   la an toan, do la khong ai nhin.* */
const TRANG=["viec","socamket","giaoviec#hv","banlam","tuyensinh","hoctap","banglop","cskh","thanhtoan","hocvien","giaoviec","duyet","baocao","nhansu","khac","canhan","xeplop","giangvien"];
(async()=>{
 let chromium; try{chromium=require("playwright").chromium}catch(e){console.log("CHECKDRAWER BO QUA: chua cai playwright");process.exit(0)} const fs=require("fs"),path=require("path");
 const exe=PATHS.find(p=>{try{return fs.existsSync(p)}catch(e){return false}});
 const b=await chromium.launch(exe?{executablePath:exe}:{});
 const ctx=await b.newContext({viewport:{width:1440,height:900}});
 const page=await ctx.newPage();
 await page.addInitScript(()=>{try{sessionStorage.setItem("ITTS_WHO","");localStorage.setItem("ITTS_HELLO_V1","1");localStorage.setItem("ITTS_ZOOM_V1","100")}catch(e){}});
 await page.goto("file://"+path.resolve(OUT)+(process.env.F||"/ITTs_WebApp_v5_demo.html"),{waitUntil:"load"});
 await page.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});
 await page.waitForTimeout(4600);
 await page.evaluate(()=>{try{if(typeof asstDong==="function")asstDong()}catch(e){}});
 const loi=[]; let soDrawer=0;
 for(const tr of TRANG){
  await page.evaluate(k=>{try{
    var i=String(k).indexOf("#");
    if(i>0){var t2=String(k).slice(0,i),tb=String(k).slice(i+1);
     if(t2==="giaoviec"){window.TKTAB=tb;window.TKF="all"}
     go(t2); try{reRender(t2)}catch(e2){} return}
    try{window.TKTAB="mine";window.TKF="live"}catch(e3){}
    go(k)}catch(e){}},tr);
  await page.waitForTimeout(350);
  const n=await page.evaluate(()=>document.querySelectorAll("#content button").length);
  for(let i=0;i<Math.min(n,26);i++){
   const mo=await page.evaluate(i=>{
    const bs=document.querySelectorAll("#content button");
    const el=bs[i]; if(!el)return null;
    const t=(el.textContent||"").trim().slice(0,30);
    try{el.click()}catch(e){return null}
    return t;
   },i);
   await page.waitForTimeout(260);
   const kq=await page.evaluate(()=>{
    const d=document.getElementById("drawer");
    if(!d||!d.classList.contains("on"))return null;
    const db=d.getBoundingClientRect(); const ra=[];
    d.querySelectorAll(".pk,input,select,textarea,.fld").forEach(el=>{
     const r=el.getBoundingClientRect(); const cs=getComputedStyle(el);
     if(cs.display==="none"||r.width===0)return;
     const motDong = el.classList.contains("pk")||el.tagName==="INPUT"||el.tagName==="SELECT";
     if(motDong && r.height>64) ra.push({l:"O MOT DONG MA CAO "+Math.round(r.height)+"px",c:el.className||el.tagName});
     if(r.right>db.right+1) ra.push({l:"THO RA NGOAI drawer "+Math.round(r.right-db.right)+"px",c:el.className||el.tagName});
    });
    /* KHE HO DOC giua hai muc lien tiep - dung cai mat anh Luan nhin thay */
    const flds=[...d.querySelectorAll(".fld")].filter(e=>getComputedStyle(e).display!=="none"&&e.getBoundingClientRect().width>0);
    for(let j=1;j<flds.length;j++){
     const tren=flds[j-1].getBoundingClientRect(), duoi=flds[j].getBoundingClientRect();
     if(duoi.top-tren.bottom>40 && Math.abs(duoi.left-tren.left)<4)
      ra.push({l:"KHE TRONG "+Math.round(duoi.top-tren.bottom)+"px giua hai muc",
        c:(flds[j-1].textContent||"").trim().slice(0,26)+" -> "+(flds[j].textContent||"").trim().slice(0,26)});
    }
    /* NHAN va O NHAP le nhau, hoac o nhap thap hon 30px (o det) */
    d.querySelectorAll("input,select,textarea").forEach(el=>{
     const r=el.getBoundingClientRect(); const cs=getComputedStyle(el);
     if(cs.display==="none"||r.width===0)return;
     if(el.type!=="checkbox"&&el.type!=="radio"&&r.height<30)
      ra.push({l:"O NHAP DET "+Math.round(r.height)+"px",c:el.className||el.name||el.tagName});
    });
    const body=d.querySelector(".dbody")||d;
    if(body.scrollWidth>body.clientWidth+1) ra.push({l:"DRAWER CUON NGANG "+(body.scrollWidth-body.clientWidth)+"px",c:"dbody"});
    return ra;
   });
   if(kq){soDrawer++; kq.forEach(x=>loi.push(tr+" · nut \""+mo+"\" · "+x.l+" ["+x.c+"]"));}
   /* ═══ 12/08 - DON SACH HAN SAU MOI CU BAM ═══════════════════════════════════════════════
      Ban cu chi goi `closeDrawer()`. Nhung tren trang co nut mo HOP XAC NHAN (`confirmRun`),
      cai mat na `.cfmask.on` dinh lai VINH VIEN - moi cu bam sau do roi vao mat na, app nhay
      lung tung sang trang khac (do that: bam nut thu 9 o trang `duyet` xong thi CUR thanh
      `settings`), va toan bo phan con lai cua trang bi phi.
      Hau qua: so ngan keo mo duoc PHU THUOC VAO VI TRI ngau nhien cua mot cai nut - them hai
      tab moi la tut tu 27 xuong 17 ma khong co gi hong that. Mot bo kiem doc ket qua tu may
      rui cua chi so thi no bao dong sai, va lan sau ai cung phai di truy mot cai khong hong.
      Nay dong CA BA (ngan keo, hop xac nhan, mat na menu) va QUAY VE dung trang neu bi lac. */
   await page.evaluate(k=>{
    try{closeDrawer()}catch(e){try{document.getElementById("drawer").classList.remove("on")}catch(e2){}}
    try{closeConfirm()}catch(e){}
    document.querySelectorAll(".cfmask.on,.modal.on,.mask.on").forEach(x=>x.classList.remove("on"));
    try{var _i=String(k).indexOf("#");var _k=(_i>0?String(k).slice(0,_i):k);
      if(typeof CUR!=="undefined"&&CUR!==_k)go(_k)}catch(e){}
   },tr);
   await page.waitForTimeout(140);
  }
 }
 const gom={}; loi.forEach(x=>gom[x]=1);
 const ds=Object.keys(gom);
 await b.close();
 if(ds.length){console.log("CHECKDRAWER DO ("+ds.length+"):");ds.slice(0,40).forEach(x=>console.log("  - "+x));process.exit(1)}
 /* SAN PHAM VI - THEM 11/08. Bo kiem nay tung tut tu 27 ngan keo xuong 17 ma van in "OK":
    no chi bao LOI HINH HOC cua nhung ngan keo no mo duoc, khong ai hoi "lan nay mo duoc it hon
    han lan truoc thi sao". Mat 10 be mat do ma khong mot tieng dong.
    Goc lan ay khong phai loi ma: dong ho vat qua nua dem, du lieu demo con neo ngay hom truoc,
    nen "buoi hom nay" thanh buoi hom qua va 10 nut khong con duoc ve ra. Nhung do dung la thu
    phai KEU: du lieu demo cu di mot ngay la app rong di mot mang, va nguoi mo demo se thay.
    San dat 24 - duoi muc 27 do duoc khi du lieu tuoi, tren han muc 17 cua ban da cu mot ngay.
    Tut xuong duoi san thi DO, kem cau nhac dung viec phai lam. */
 /* 12/08 - SAN 24 -> 40. Sau khi vá chỗ mặt nạ dính, cùng một bản dựng mở được 49 ngăn kéo
    chứ không phải 17: bộ kiểm này bấy lâu chỉ soi được MỘT PHẦN BA số bề mặt nó tưởng đang soi.
    Sàn cũ 24 đặt theo con số 27 đo được lúc còn hỏng - giữ nguyên là để dành chỗ cho chính cái
    hỏng ấy quay lại. Sàn mới 40: dưới 49 một khoảng đủ cho dữ liệu trôi theo ngày, nhưng trên
    hẳn mức 17 của bản còn hỏng. */
 var SAN=40;
 if(soDrawer<SAN){
  console.log("CHECKDRAWER DO: chi mo duoc "+soDrawer+" ngan keo, duoi san "+SAN+".");
  console.log("  Thuong la du lieu demo da cu hon ngay chay - dung lai pipeline roi build lai:");
  console.log("  cd _src && python3 gen_demo.py && python3 seed_giaoan.py && python3 mkdemo.py && python3 fixdata.py && python3 seed_giaoviec.py");
  console.log("  Neu du lieu da tuoi ma van thieu thi la mot loat nut that su khong con duoc ve ra.");
  process.exit(1);
 }
 console.log("CHECKDRAWER OK: mo that "+soDrawer+" ngan keo tren "+TRANG.length+" trang (san "+SAN+") - khong o nao cao sai, khong cho nao tho ra, khong khe trong, khong o det");
})().catch(e=>{console.log("ERR",e.message);process.exit(1)});
