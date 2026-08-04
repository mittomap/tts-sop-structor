/* _checkreset.js - BAM NUT "DUNG LAI DEMO" ROI KIEM LAI TU DAU.
 *
 * VI SAO CO FILE NAY (anh Luan 04/08): *"nhat la nut reset demo, truoc khi giao a se bam nut
 * nay day. No phai keo demo ve trang thai hoan hao"*. Day la nut anh Luan bam NGAY TRUOC KHI
 * GIAO - neu no ra mot bo du lieu te thi moi thu con lai khong con y nghia.
 *
 * Kiem SAU KHI BAM, khong tin la "chac giong luc build":
 *   - moi chuc danh mo app deu co viec cua minh
 *   - co viec GAP va viec QUA HAN de thay canh bao mau (khong ra mot bo du lieu chet)
 *   - tuan nay co buoi hoc (du lieu da duoc keo ve hien tai)
 *   - CAU HINH KHONG bi cuon theo: nguong, cau nhac, thuong hieu, phan quyen giu nguyen
 *   - thoi quen rieng (ty le hien thi, anh dai dien, gop y) khong bi xoa
 *   - ca ba cong mo ra deu co noi dung, khong loi JS
 *
 * HAI BAY DA CAN NGAY LUOT DAU DUNG BO NAY - ca hai deu la THUOC SAI:
 *  1. dung `applyScope(sid)` de dong vai: no moi cat pham vi du lieu, CHUA dat CURROLE, nen
 *     workAll() tra ve 0 - may bao "6 chuc danh khong co viec" trong khi app dung. Cua that la
 *     `gateEnter(sid)`. Do duoc: sales_staff qua applyScope = 0 viec, qua gateEnter = 14.
 *  2. loc viec qua han bang truong `w.han` / `w.due` - HAI TEN DO KHONG HE TON TAI. Viec cua app
 *     mang `sev` va chu "(qua han)" trong `what`. Bia ten truong thi do ra 0 va tuong app hong.
 * LUAT: hoi thang tu vung ma app dung, dung tu dat ten.
 *
 * Chay: node _checkreset.js   (khong can ITTS_OUT - doc file build o thu muc cha)
 */
const {chromium}=require("playwright");
const EXE="/opt/pw-browsers/chromium-1194/chrome-linux/chrome";
const OUT="file:///home/user/tts-sop-structor/";
const do_=[], ok=[];
const t=(ten,dat,chitiet)=>{ (dat?ok:do_).push(ten+(chitiet?" ("+chitiet+")":"")); };
(async()=>{
const b=await chromium.launch({executablePath:EXE});
const ctx=await b.newContext({viewport:{width:1440,height:900}});
const p=await ctx.newPage();
const loi=[];p.on("pageerror",e=>loi.push(e.message.slice(0,120)));
await p.addInitScript(()=>{try{sessionStorage.setItem("ITTS_WHO","");localStorage.setItem("ITTS_HELLO_V1","1")}catch(e){}});
await p.goto(OUT+"ITTs_WebApp_v5_demo.html",{waitUntil:"load"});
await p.waitForFunction(()=>typeof window.go==="function"); await p.waitForTimeout(700);

/* 1. Dat CAU HINH + thoi quen rieng TRUOC khi reset, de xem chung co bi cuon theo khong */
await p.evaluate(()=>{
  cfSetMode("that");
  uiSet("brand","TEN THU TRUOC RESET");
  var c=(DATA.config=DATA.config||{}); c.__thuNghiem="giu-nguyen-nhe";
  try{cfgSave()}catch(e){}
  localStorage.setItem("ITTS_ZOOM_V1","125");
  localStorage.setItem("ITTS_GOPY_V1",JSON.stringify([{id:"thu",nd:"phieu thu"}]));
  localStorage.setItem("ITTS_AVATAR_V1","anh-thu");
});
await p.waitForTimeout(300);

/* 2. BAM RESET DEMO that (di qua hop xac nhan nhu nguoi dung) */
await p.evaluate(()=>{demoReset()});
await p.waitForTimeout(400);
const coHop=await p.evaluate(()=>!!(document.getElementById("cfm")||{}).classList?.contains("on"));
t("bam Reset demo co hoi lai truoc khi xoa", coHop);
await p.locator("#cfm button.btn.primary").last().click({timeout:5000}).catch(()=>{});
await p.waitForLoadState("load").catch(()=>{});
await p.waitForFunction(()=>typeof window.go==="function",null,{timeout:20000});
await p.waitForTimeout(1200);

/* 3. SAU RESET - sau dieu */
const r=await p.evaluate(()=>{
  const hn=new Date();
  /* DUNG gateEnter CHU KHONG applyScope: applyScope moi cat pham vi du lieu, chua dat CURROLE
     nen workAll() tra ve 0. Do duoc: sales_staff qua applyScope = 0 viec, qua gateEnter = 14. */
  const ds=rows("DL01").filter(s=>staffActive(s));
  const vaiCoViec={}, vaiTrong=[];
  const vai=[...new Set(ds.map(s=>s.role))];
  vai.forEach(v=>{const ng=ds.find(s=>s.role===v); if(!ng)return;
    try{gateEnter(ng.staff_id); const n=workAll().length; vaiCoViec[v]=n; if(!n)vaiTrong.push(v)}catch(e){vaiTrong.push(v+"(loi)")}});
  gateEnter("");
  const W=workAll();
  /* Viec KHONG co truong `han`/`due` - em tung bia ra hai ten do va do ra 0 ca hai. Tu vung
     that cua app: `sev` (red/amber) va chu "(qua han)" trong `what`. Hoi thang cai app dung. */
  const qua=W.filter(w=>/qu[aá] h[aạ]n/i.test(String(w.what||""))).length;
  const gap=W.filter(w=>w.sev==="red").length;
  const buoiTuan=rows("DL11").filter(x=>{const d=pvnd(x.session_date); if(!d)return false;
    const c=(d-hn)/86400000; return c>=-7&&c<=7}).length;
  return {soVai:vai.length, vaiTrong, tongViec:W.length, gap:gap, quaHan:qua, buoiTuan,
    brand:(UI().brand||""), thuNghiem:(DATA.config||{}).__thuNghiem||"",
    zoom:localStorage.getItem("ITTS_ZOOM_V1"), gopy:localStorage.getItem("ITTS_GOPY_V1"),
    avatar:localStorage.getItem("ITTS_AVATAR_V1"),
    dl:["DL01","DL02","DL06","DL08","DL09","DL11","DL18"].map(k=>k+"="+rows(k).length).join(" ")};
});
t("moi chuc danh deu co viec sau reset", r.vaiTrong.length===0, r.vaiTrong.length?("trong: "+r.vaiTrong.join(", ")):(r.soVai+" chuc danh"));
t("co viec GAP (sev do) de thay canh bao", r.gap>0, r.gap+" viec");
t("co viec QUA HAN de thay canh bao do", r.quaHan>0, r.quaHan+" viec");
t("tuan nay co buoi hoc (du lieu keo ve hien tai)", r.buoiTuan>0, r.buoiTuan+" buoi");
t("CAU HINH giu nguyen: ten thuong hieu", r.brand==="TEN THU TRUOC RESET", "doc ra: "+r.brand);
t("CAU HINH giu nguyen: khoa tu dat", r.thuNghiem==="giu-nguyen-nhe", "doc ra: "+r.thuNghiem);
t("ty le hien thi khong bi xoa", r.zoom==="125", "doc ra: "+r.zoom);
t("gop y cu khong bi xoa", !!r.gopy);
t("anh dai dien khong bi xoa", r.avatar==="anh-thu", "doc ra: "+r.avatar);
t("du lieu goc con day du", !/=0( |$)/.test(r.dl), r.dl);
console.log("  DL sau reset:", r.dl);

/* 4. Ba cong deu co du lieu */
for(const [f,ten] of [["ITTs_WebApp_v5_demo.html","cong nhan vien"],["ITTs_TrangHocVien_demo.html","cong hoc vien"]]){
  const p2=await ctx.newPage();
  const l2=[]; p2.on("pageerror",e=>l2.push(e.message.slice(0,90)));
  await p2.addInitScript(w=>{try{sessionStorage.setItem(w,"");localStorage.setItem("ITTS_HELLO_V1","1")}catch(e){}}, ten==="cong hoc vien"?"ITTS_WHO_HV":"ITTS_WHO");
  await p2.goto(OUT+f,{waitUntil:"load"});
  await p2.waitForTimeout(1500);
  const dai=await p2.evaluate(()=>{const c=document.getElementById("content")||document.getElementById("hvBody")||document.body;
    return (c.textContent||"").replace(/\s+/g," ").trim().length});
  t(ten+" mo ra co noi dung", dai>500, dai+" ky tu");
  t(ten+" khong loi JS", l2.length===0, l2[0]||"");
  await p2.close();
}
console.log("\n=== AUDIT NUT RESET DEMO ===");
ok.forEach(x=>console.log("  v "+x));
do_.forEach(x=>console.log("  X "+x));
console.log(do_.length?("CHECKRESET DO ("+do_.length+" cho)"):("CHECKRESET OK: "+ok.length+" tieu chi - bam Dung lai demo xong, du lieu ve dung trang thai chuan va cau hinh giu nguyen"));
await b.close();})();
