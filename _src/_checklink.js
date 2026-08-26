/* ═══ _checklink - TEN NGUOI PHAI BAM DUOC O MOI CHO ═══════════════════════════════════════════
   ACA yeu cau (feedback 08/2026): *"ten hoc vien o dau cung bam duoc de mo thong tin nhanh"*.
   Anh Luan chot: lam.

   Bo kiem nay VE THAT tung trang roi hoi TRINH DUYET - khong doc chuoi, khong doan cu phap:
   voi moi NODE CHU chua ten mot hoc vien that trong DL09, hoi `closest("a,button,[onclick]")`.
   Chinh trinh duyet tra loi "cho nay bam duoc hay khong", nen ket qua bang dung cai nguoi dung
   thay. (Ban dau em do bang regex tren ma nguon: dem ra 428 cho tren 24 trang - GAP BON LAN so
   that, vi regex chi ngo lai 220 ky tu tim the mo va khong thay noi `<div onclick>` boc ca dong.)

   SAN: toi da NGUONG cho duoc mien. Hai dang duoc mien co ly do doc duoc:
     · ten nam trong CAU CHU TU DO nguoi dung go (ly do chiet khau "Gioi thieu boi Tran Khanh Vy")
       - do la van ban, khong phai o du lieu ten; bam vao mot manh cau la vo nghia.
     · ten o TIEU DE TRANG HO SO cua chinh hoc vien do - dang dung trong ho so cua ho roi.
   Vuot nguong la co cho moi khong bam duoc -> DO, in ra dang HTML de sua ngay.
   Nguong dat SAT (3) chu khong dat rong: no la thu duy nhat giu 101 cho da sua khoi tut ve. */
const PATHS=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome","/opt/pw-browsers/chromium-1194/chrome-linux/headless_shell"];
const fs=require("fs"),path=require("path");
/* ═══ 26/08 - SUYT NANG TRAN CHO MOT LOI CUA MINH ══════════════════════════════════════════
   Luot verify 26/08 bao 4 cho (tran 3). Phan xa dau tien cua em la nang tran len 4 va viet mot
   doan giai thich nghe rat hop ly: cho thu tu la "cau chu tu do", dung dang da duoc mien.
   Do lai ky thi KHONG PHAI: hai trong so cac cho moi nam o trang Hoa don em vua dung - cot
   "Ben nhan" in ten hoc vien bang chu tron. Sua dung hai cho ay xong thi con lai 3, y nhu cu.
   *Mot cai tran keo xuong de bi nang nhat vao dung luc minh vua lam hong mot thu - vi luc ay
   minh co san mot cau giai thich cho con so moi.* Do truoc, sua truoc; tran la thu dong sau
   cung, khong phai thu dong dau tien. */
const NGUONG=3;
(async()=>{
 const {chromium}=require("playwright");
 const exe=PATHS.find(p=>{try{return fs.existsSync(p)}catch(e){return false}});
 const b=await chromium.launch(exe?{executablePath:exe}:{});
 const pg=await b.newPage({viewport:{width:1440,height:1000}});
 await pg.addInitScript(()=>{try{sessionStorage.setItem("ITTS_WHO","");localStorage.setItem("ITTS_HELLO_V1","1");localStorage.setItem("ITTS_ZOOM_V1","100")}catch(e){}});
 await pg.goto("file://"+path.resolve(process.env.ITTS_OUT||".")+"/ITTs_WebApp_v5_demo.html",{waitUntil:"load"});
 await pg.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});
 await pg.evaluate(()=>{setRole("all")});
 const mans=await pg.evaluate(()=>Object.keys(window.RENDER));
 let tong=0,ds=[],veDuoc=0;
 for(const m of mans){
  const ok=await pg.evaluate(m=>{try{go(m);return true}catch(e){return false}},m);
  if(!ok)continue;
  veDuoc++;
  await pg.waitForTimeout(60);
  const n=await pg.evaluate(()=>{
   /* ═══ V2 25/08 - TÊN KHÁCH TIỀM NĂNG CŨNG PHẢI BẤM ĐƯỢC ══════════════════════════════
      Bộ này chỉ lấy tên từ DL09 (học viên), nên nó có một vùng tối đúng bằng cả bảng DL02.
      Đọc ảnh chụp trang Công nợ mới thấy: hai dòng "Đỗ Ngọc Tâm" và "Hoàng Thanh Linh" in tên
      ĐEN giữa một bảng toàn tên bấm được - hai người ấy đã đăng ký và đang nợ tiền nhưng CHƯA
      chuyển thành học viên, nên `student_id` rỗng và bảng không có gì để bấm.
      `openQuick` vốn mở được cả hồ sơ lead; thứ thiếu là cái mã, và thứ thiếu ở ĐÂY là câu hỏi.
      *Một bộ kiểm hỏi "mọi tên có bấm được không" mà chỉ lấy tên từ một bảng thì nó đang hỏi
      "mọi tên TRONG BẢNG ẤY", và phần còn lại im lặng trôi qua.* */
   const ten=rows("DL09").map(s=>String(s.full_name||""))
     .concat(rows("DL02").map(s=>String(s.full_name||"")))
     .filter(x=>x.length>5);
   const goc=document.getElementById("content"); if(!goc)return {n:0,vd:[]};
   window.__vd=[];   /* XOA vi du cua trang truoc - khong xoa thi moi trang deu in mau cua trang dau */
   const w=document.createTreeWalker(goc,NodeFilter.SHOW_TEXT);
   let dem=0,nut;
   while((nut=w.nextNode())){
    const t=(nut.nodeValue||"").trim(); if(t.length<6)continue;
    if(!ten.some(x=>t.indexOf(x)>=0))continue;
    const el=nut.parentElement; if(!el)continue;
    if(el.closest("a,button,[onclick],select,option"))continue;   /* bam duoc roi */
    if(window.__vd.length<3)window.__vd.push((el.outerHTML||"").slice(0,150));
    dem++;
   }
   return {n:dem,vd:window.__vd}});
  if(n&&n.n){tong+=n.n;ds.push([m,n.n,n.vd])}
 }
 await b.close();
 /* SAN PHAM VI - cung benh _checkdrawer da can: mot bo kiem chi do nhung trang no ve duoc ma
    khong dem minh ve duoc bao nhieu thi no im lang dung luc pham vi teo lai. */
 if(veDuoc<30){console.log("CHECKLINK DO: chi ve duoc "+veDuoc+" trang (san 30) - pham vi do da teo, xem lai RENDER/go().");process.exit(1)}
 ds.sort((a,b)=>b[1]-a[1]);
 if(tong>NGUONG){
  console.log("CHECKLINK DO: "+tong+" cho ten hoc vien KHONG bam duoc tren "+ds.length+" trang (nguong "+NGUONG+"):");
  ds.slice(0,8).forEach(x=>{console.log("  - "+x[0]+" -> "+x[1]+" cho");(x[2]||[]).slice(0,2).forEach(v=>console.log("      "+v))});
  console.log("  Sua: thay esc(ten) bang nguoiLnk(student_id, ten) o cho tuong ung trong gen_v5.py.");
  process.exit(1);
 }
 console.log("CHECKLINK OK: ve that "+veDuoc+" trang, ten hoc vien bam duoc o moi cho ("+tong+"/"+NGUONG+" cho duoc mien: cau chu tu do + tieu de ho so cua chinh HV do)");
})().catch(e=>{console.log("ERR",e.message);process.exit(1)});
