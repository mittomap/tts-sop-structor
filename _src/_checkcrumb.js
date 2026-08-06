/* _checkcrumb.js - VET DUONG DI (breadcrumb) PHAI NAM TRON MOT HANG.
 *
 * Anh Luan 05/08, kem anh chup: *"em nen co phuong an cho breadcrumb nhe, no rot hang rat xau
 * neu dai"*. Trong chinh anh do con mot loi thu hai: moc "Hoc tap & Giang day · Theo doi nhan
 * xet buoi" dung LIEN NHAU HAI LAN.
 *
 * HAI CAI SAI, HAI GOC KHAC NHAU:
 *  1. `.crumb{flex-wrap:wrap}` - vet dai thi rot xuong dong hai, day ca than trang xuong.
 *     Nhung CAM rot hang khong thoi la vet bi cat cut o mep phai, mat luon moc CUOI - ma moc
 *     cuoi chinh la "toi dang dung o dau", thu quan trong nhat tren ca vet. Nen luat la: MOT
 *     HANG, chat thi cac moc GIUA teo truoc (moi moc tu cut bang dau ba cham), moc dang dung
 *     luon giu it nhat 140px.
 *  2. Lich su gan trung theo KHOA TRANG, ma hai khoa khac nhau (`buoihoc` va `hoctap`) lai ve ra
 *     DUNG MOT dong chu vi `go()` gop tab con ve trang cha. Gan theo khoa la gan cai MAY nhin
 *     thay; nguoi doc chi nhin thay CHU - nen gan theo chu.
 *
 * DO O BA KHO MAN (1440 / 1100 / 860). Quan trong: loi nay KHONG lo ra o 1440px - `_checkmat`
 * chi do mot kho man nen no khong the thay. Ban cu do lai: 22px o 1440, **41px o 1100, 60px o
 * 860** - tuc la hai va ba dong. Ban moi: 22px o ca ba.
 *
 * DA TU THU LAI CAI THUOC: chay tren ban CU thi no DO dung hai kho man hep. Mot cai thuoc chua
 * tung bao do la mot cai thuoc chua ai biet no do duoc gi.
 *
 * Chay: ITTS_OUT=<out> node _checkcrumb.js
 */
const OUT=process.env.O||process.env.ITTS_OUT||".", F=process.env.F||"/ITTs_WebApp_v5_demo.html";
const PATHS=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome"];
(async()=>{
 let chromium; try{chromium=require("playwright").chromium}catch(e){console.log("CHECKCRUMB BO QUA: chua cai playwright");process.exit(0)} const fs=require("fs"),path=require("path");
 const exe=PATHS.find(p=>{try{return fs.existsSync(p)}catch(e){return false}});
 const b=await chromium.launch(exe?{executablePath:exe}:{});
 const xau=[]; let do_=0;
 for(const W of [1440,1100,860]){
  const ctx=await b.newContext({viewport:{width:W,height:900}});
  const page=await ctx.newPage();
  await page.addInitScript(()=>{try{sessionStorage.setItem("ITTS_WHO","");localStorage.setItem("ITTS_HELLO_V1","1");localStorage.setItem("ITTS_ZOOM_V1","100")}catch(e){}});
  await page.goto("file://"+path.resolve(OUT)+F,{waitUntil:"load"});
  await page.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});
  await page.waitForTimeout(4600);
  await page.evaluate(()=>{try{if(typeof asstDong==="function")asstDong()}catch(e){}});
  /* di mot vet dai co chu y: hub -> tab -> ho so lop -> ho so hoc vien */
  const r=await page.evaluate(async()=>{
   const cho=ms=>new Promise(r=>setTimeout(r,ms));
   go("hoctap"); await cho(200); if(typeof htTabSet==="function"){htTabSet("buoihoc");await cho(200)}
   go("buoihoc"); await cho(200);
   go("banglop"); await cho(200);
   const c=document.getElementById("pgCrumb"); const rc=c.getBoundingClientRect();
   const items=[...c.querySelectorAll(".crbi")].map(e=>(e.textContent||"").replace(/^›/,"").trim());
   let lap=0; for(let i=1;i<items.length;i++) if(items[i]&&items[i]===items[i-1]) lap++;
   return {cao:Math.round(rc.height), soMoc:items.length, lap, tran:c.scrollWidth>c.clientWidth+1, items};
  });
  if(r.cao>26) xau.push("rong "+W+"px: vet duong di cao "+r.cao+"px - da rot xuong dong thu hai");
  if(r.lap)    xau.push("rong "+W+"px: "+r.lap+" moc lap lai y het moc lien truoc");
  if(r.tran)   xau.push("rong "+W+"px: vet bi cat cut o mep phai (tran ngang)");
  if(r.soMoc<2)xau.push("rong "+W+"px: vet chi con "+r.soMoc+" moc - khong con la mot vet duong di");
  do_+=4;
  await ctx.close();
 }
 await b.close();
 if(xau.length){console.log("CHECKCRUMB DO ("+xau.length+"/"+do_+"):");xau.forEach(x=>console.log("  - "+x));process.exit(1)}
 console.log("CHECKCRUMB OK: "+do_+" tieu chi tren 3 kho man - vet duong di nam tron mot hang, khong moc nao lap, khong bi cat cut");
})().catch(e=>{console.log("ERR",e.message);process.exit(1)});
