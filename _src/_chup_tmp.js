const OUT=process.env.ITTS_OUT||"..";
const PATHS=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome"];
const TRANG=(process.env.TR||"nhaplead,xeplop,hocvien,viec").split(",");
const RA=process.argv[2]||"/tmp/claude-0/-home-user-tts-sop-structor/83c95bb3-627a-5242-8073-c4a8e11eba9a/scratchpad/anh";
(async()=>{
 const fs=require("fs"),path=require("path");
 fs.mkdirSync(RA,{recursive:true});
 const {chromium}=require("playwright");
 const exe=PATHS.find(p=>fs.existsSync(p));
 const b=await chromium.launch(exe?{executablePath:exe}:{});
 const pg=await b.newPage({viewport:{width:1440,height:1000},deviceScaleFactor:2});
 await pg.addInitScript(()=>{try{sessionStorage.setItem("ITTS_WHO","");localStorage.setItem("ITTS_HELLO_V1","1");localStorage.setItem("ITTS_ZOOM_V1","100")}catch(e){}});
 await pg.goto("file://"+path.resolve(OUT)+"/ITTs_WebApp_v5_demo.html",{waitUntil:"load"});
 await pg.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});
 await pg.waitForTimeout(4600);
 await pg.evaluate(()=>{try{asstDong()}catch(e){}; setRole("all")});
 for(const t of TRANG){
  await pg.evaluate(k=>go(k),t);
  await pg.waitForTimeout(500);
  await pg.screenshot({path:RA+"/"+t+".png"});
  console.log("CHUP "+t);
 }
 await b.close();
})().catch(e=>{console.log("ERR",e.message);process.exit(1)});
