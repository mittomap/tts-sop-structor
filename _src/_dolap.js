/* Do TUNG TRANG: dai the va dai chip co dang noi cung mot thu khong, va co noi cung mot SO khong */
const PATHS=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome"];
const fs=require("fs");
function chuan(t){return String(t||"").toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g,"")
 .replace(/[^a-z0-9 ]/g," ").replace(/\s+/g," ").trim()}
(async()=>{
 const {chromium}=require("playwright");
 const exe=PATHS.find(p=>{try{return fs.existsSync(p)}catch(e){return false}});
 const b=await chromium.launch(exe?{executablePath:exe}:{});
 const pg=await b.newPage({viewport:{width:1440,height:1000}});
 await pg.addInitScript(()=>{try{sessionStorage.setItem("ITTS_WHO","");localStorage.setItem("ITTS_HELLO_V1","1")}catch(e){}});
 await pg.goto("file://"+require("path").resolve(process.env.ITTS_OUT||"..")+"/ITTs_WebApp_v5_demo.html",{waitUntil:"load"});
 await pg.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});
 await pg.evaluate(()=>{setRole("all")});
 const mans=await pg.evaluate(()=>Object.keys(window.RENDER));
 const ra=[];
 for(const m of mans){
  const ok=await pg.evaluate(k=>{try{go(k);return true}catch(e){return false}},m);
  if(!ok)continue;
  await pg.waitForTimeout(120);
  const d=await pg.evaluate(()=>{
   const the=[...document.querySelectorAll("#content .bstat")].map(e=>({
     so:(e.querySelector(".bsn")||{}).textContent||"",
     nhan:((e.querySelector(".bsl")||{}).textContent||"").split("·")[0].trim()}));
   const chip=[...document.querySelectorAll("#content .chipbar .chip, #content .segb, #content .chipb")].map(e=>{
     const t=(e.textContent||"").trim();
     const mm=t.match(/^(.*?)(\d+)$/);
     return mm?{nhan:mm[1].trim(),so:mm[2]}:{nhan:t,so:""}});
   return {the:the,chip:chip}});
  if(!d.the.length||!d.chip.length)continue;
  const trung=[];
  d.the.forEach(t=>{const a=chuan(t.nhan); if(!a)return;
   d.chip.forEach(c=>{const bq=chuan(c.nhan); if(!bq)return;
    if(a===bq)
     trung.push({nhan:t.nhan,theSo:String(t.so).trim(),chipSo:String(c.so).trim()})})});
  if(trung.length)ra.push({trang:m,nThe:d.the.length,nChip:d.chip.length,trung:trung});
 }
 console.log("TRANG CO THE VA CHIP TRUNG NHAN Y HET: "+ra.length);
 ra.sort((a,b)=>b.trung.length-a.trung.length).forEach(x=>{
  const lech=x.trung.filter(t=>t.theSo&&t.chipSo&&t.theSo!==t.chipSo);
  console.log("\n  "+x.trang+"  ("+x.nThe+" the / "+x.nChip+" chip, trung "+x.trung.length+" muc"+(lech.length?(", LECH SO "+lech.length):"")+")");
  x.trung.forEach(t=>console.log("     "+(t.theSo===t.chipSo?"   ":" ! ")+t.nhan.padEnd(34)+" the="+String(t.theSo).padStart(4)+"  chip="+String(t.chipSo).padStart(4)));
 });
 await b.close();
})().catch(e=>{console.log("ERR",e.message);process.exit(1)});
