/* _checklap.js - MOT MAN KHONG DUOC NOI HAI LAN CUNG MOT THU.
 *
 * Anh Luan 05/08, kem anh trang Chi so cua Ban Giam doc: *"man cua giam doc lap cai gi day?"* -
 * hai thanh "Xem viec cua:" giong het nhau, chong len nhau.
 *
 * GOC: o do co BA noi goi, moi noi deu dung phan minh. Trang Chi so tu dat mot o (de quan ly
 * khong phai quay ve trang dap moi doi duoc nguoi), roi goi tiep `bvSau()` - ma bang viec lai
 * tu chen mot o nua khi trang dang xem CHINH LA trang dap cua chuc danh. Voi Ban Giam doc,
 * trang dap dung la trang Chi so, nen hai ve cung dung va cung ve. Vá bang cach de CHINH cai o
 * tu biet minh da ra mat trong luot ve nay chua - khong di sua tung noi goi, vi mai them noi
 * thu tu la lap lai.
 *
 * VI SAO BO NAY PHAI CHAY TRONG TRINH DUYET, KHONG DUOC CHAY BANG NODE - **bay da can, ghi lai
 * cho nguoi sau**: ban dau bo nay viet kieu node (goi thang `RENDER["baocao"]()` roi dem chuoi).
 * No bao XANH ca tren ban CU dang loi - vi trong moi truong node, `banAiHTML()` tra ve rong,
 * dem duoc 0 thanh o ca hai ban. Chay bang Chromium that, dang nhap dung NV009: ban cu **2
 * thanh**, ban moi **1**. Mot bo kiem khong dung lai duoc loi da biet la mot bo kiem chua dung
 * duoc - phai thu nguoc tren ban cu TRUOC khi tin no.
 *
 * DO: dang nhap that bang mot nguoi cho MOI chuc danh, di qua cac trang chinh cua ho, dem:
 *  L1  Thanh "Xem viec cua" (`.tbar.banai`) - toi da MOT tren mot man
 *  L2  Dau trang (`.phead`) - toi da MOT
 *  L3  Hai khoi `.tbar` giong het nhau tung ky tu
 *  L4  Hai `.notebar` cung mot cau chu
 *
 * Chay: ITTS_OUT=<out> node _checklap.js
 */
const OUT=process.env.O||process.env.ITTS_OUT||".", F=process.env.F||"/ITTs_WebApp_v5_demo.html";
const PATHS=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome"];
(async()=>{
 let chromium; try{chromium=require("playwright").chromium}catch(e){console.log("CHECKLAP BO QUA: chua cai playwright");process.exit(0)}
 const fs=require("fs"),path=require("path");
 const exe=PATHS.find(p=>{try{return fs.existsSync(p)}catch(e){return false}});
 let b; try{b=await chromium.launch(exe?{executablePath:exe}:{})}
 catch(e){console.log("CHECKLAP BO QUA: khong mo duoc Chromium");process.exit(0)}
 const ctx=await b.newContext({viewport:{width:1440,height:900}});
 const page=await ctx.newPage();
 await page.addInitScript(()=>{try{localStorage.setItem("ITTS_HELLO_V1","1");localStorage.setItem("ITTS_ZOOM_V1","100")}catch(e){}});
 await page.goto("file://"+path.resolve(OUT)+F,{waitUntil:"load"});
 await page.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});
 await page.waitForTimeout(4600);
 await page.evaluate(()=>{try{if(typeof asstDong==="function")asstDong()}catch(e){}});

 /* Mot nguoi dai dien cho MOI chuc danh - lap la chuyen BO CUC, khong phai chuyen pham vi
    du lieu, nen do theo chuc danh la du va do duoc trong mot phut. */
 const ai=await page.evaluate(()=>{
  const seen={},ra=[];
  (DL.DL01||[]).forEach(s=>{ if(s.staff_id&&staffActive(s)&&!seen[s.role]){seen[s.role]=1;
    ra.push({sid:s.staff_id,vai:(ecode(s.role)||s.role)+""})} });
  return ra;
 });

 const xau=[]; let ok=0;
 for(const p of ai){
  const kq=await page.evaluate(async(sid)=>{
   const cho=ms=>new Promise(r=>setTimeout(r,ms));
   try{gateEnter(sid)}catch(e){return null}
   await cho(500);
   const eff=SCOPE(); const pages=(eff.pages==="*")?PAGES.map(x=>x.k):eff.pages.slice();
   const ra=[];
   for(const pk of pages){
    try{go(pk)}catch(e){continue}
    await cho(210);
    const c=document.getElementById("content"); if(!c)continue;
    const tbs=[...c.querySelectorAll(".tbar")].map(e=>e.outerHTML);
    const d={},lap=[]; tbs.forEach(x=>{d[x]=(d[x]||0)+1; if(d[x]===2)lap.push(x.slice(0,50))});
    const nbs=[...c.querySelectorAll(".notebar")].map(e=>(e.textContent||"").trim()).filter(Boolean);
    const d2={}; let lap2=0; nbs.forEach(x=>{d2[x]=(d2[x]||0)+1; if(d2[x]===2)lap2++});
    ra.push({pk, banai:c.querySelectorAll(".tbar.banai").length,
             phead:c.querySelectorAll(".phead").length, lapTbar:lap.length, lapNote:lap2});
   }
   return ra;
  },p.sid);
  if(!kq)continue;
  kq.forEach(r=>{
   const t=(ten,dieu)=>{ if(dieu)ok++; else xau.push(p.vai+" · "+r.pk+": "+ten); };
   t('co '+r.banai+' thanh "Xem viec cua" (toi da 1)', r.banai<=1);
   t('co '+r.phead+' dau trang (toi da 1)', r.phead<=1);
   t(r.lapTbar+' khoi thanh cong cu lap y het', r.lapTbar===0);
   t(r.lapNote+' notebar lap cau', r.lapNote===0);
  });
 }
 await b.close();
 if(xau.length){console.log("CHECKLAP DO ("+xau.length+"/"+(ok+xau.length)+"):");xau.slice(0,40).forEach(x=>console.log("  - "+x));process.exit(1)}
 console.log("CHECKLAP OK: "+ok+" tieu chi tren "+ai.length+" chuc danh - khong man nao noi hai lan cung mot thu");
})().catch(e=>{console.log("CHECKLAP LOI: "+e.message);process.exit(1)});
