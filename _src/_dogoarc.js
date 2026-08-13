const P=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome"];
(async()=>{const fs=require("fs"),path=require("path");const{chromium}=require("playwright");
 const b=await chromium.launch({executablePath:P.find(p=>fs.existsSync(p))});
 const pg=await b.newPage({viewport:{width:1440,height:1000}});
 await pg.addInitScript(()=>{try{sessionStorage.setItem("ITTS_WHO","");localStorage.setItem("ITTS_HELLO_V1","1")}catch(e){}});
 await pg.goto("file://"+path.resolve(process.env.ITTS_OUT)+"/ITTs_WebApp_v5_demo.html",{waitUntil:"load"});
 await pg.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});
 await pg.waitForTimeout(4600);
 await pg.evaluate(()=>{try{asstDong()}catch(e){}; setRole("all"); go("changA")});
 await pg.waitForTimeout(400);
 const doc=()=>pg.evaluate(()=>({arc:window.ARC,
   tieude:(document.getElementById("pgTitle")||{}).textContent||"",
   menuSang:[...document.querySelectorAll("#nav .navi.on,#nav .navi.cur,#nav .on")].map(e=>(e.textContent||"").trim().slice(0,28)).slice(0,3)}));
 console.log("TRUOC:",JSON.stringify(await doc()));
 await pg.evaluate(()=>goArc("changB"));
 await pg.waitForTimeout(400);
 console.log("SAU :",JSON.stringify(await doc()));
 await b.close();})().catch(e=>{console.log("ERR",e.message);process.exit(1)});
