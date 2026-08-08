/* ═══════════════════════════════════════════════════════════════════════════════════════════
   _checkv2.js - NĂM LUẬT RIÊNG CỦA BẢN V2

   Anh Luân 08/08: *"E nên sửa lại bộ kiểm, v2 ko phải v1, nó có đặc thù riêng của nó.
   E nhờ chuyên gia quyết định v2 sẽ như thế nào đi."*

   Bản chốt của hội đồng nằm ở `HOI_DONG_V2_CHOT.md`. Tệp này là bản THI HÀNH của nó.

   VÌ SAO PHẢI CÓ: suốt ngày 08/08, BẢY lần một bộ kiểm báo đỏ vì nó hỏi câu của V1, và bảy lần
   em vá riêng chỗ đó rồi đi tiếp. Vá bảy lần là chữa triệu chứng. Bệnh là bộ kiểm chưa bao giờ
   được viết cho V2 - nó là luật của V1 cộng vài bộ mới dựng dọc đường.
   Năm luật dưới đây HÔM NAY ĐỀU ĐANG ĐÚNG. Nhưng không thước nào giữ chúng, nên ngày mai đổi
   một trang đáp là hỏng trong im lặng. **Luật không có thước là lời hứa, không phải luật.**

     L1 · MỞ APP RA LÀ THẤY VIỆC HÔM NAY - mọi chức danh, trang đáp phải vẽ nhịp ngày.
     L2 · MENU LÀ BẢN ĐỒ, KHÔNG PHẢI KHO - không hub nào đứng trên menu.
     L3 · KHÔNG TRANG NÀO MỒ CÔI - có mục menu, hoặc có cha trên menu, hoặc khai lý do;
          và đứng ở trang con thì mục của cha phải SÁNG.
     L4 · SỐ NÓI RA PHẢI BẤM ĐƯỢC - mỗi ô cảnh báo trên Bàn làm việc phải bấm được, tới một
          trang CÓ THẬT, và trang ấy người đó ĐƯỢC XEM (không "mời rồi đuổi").
     L5 · MỖI TRANG NGHIỆP VỤ ĐỦ BỘ - ở đây canh vế THẺ SỐ; ba vế còn lại `_checkkhuon` canh.

   BẪY ĐÃ CẮN KHI DỰNG BỘ NÀY: đếm ô cảnh báo bằng chuỗi `class="cbo"` trong khi mã thật phát ra
   `class="cbo do"`, nên đọc ra 0 ô và suýt đi sửa một thứ không hỏng. Đo trên chuỗi HTML THẬT,
   và khi thước bắt mình thì ĐỌC LẠI PHÉP ĐO TRƯỚC KHI ĐỌC LẠI APP.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const FS=require("fs"),PATH=require("path");

/* Bản khai "trang nghiệp vụ V2" nằm ở `_v2def.js` - MỘT chỗ, hai thước cùng đọc (`_checkv2`
   và `_checkkhuon`). Hai bản chép tay của cùng một định nghĩa là thứ chắc chắn có ngày lệch. */
const V2 = require("./_v2def.js");
const KHONG_NGHIEP_VU = V2.KHONG_NGHIEP_VU;
const DUOC_MO_COI = V2.DUOC_MO_COI;

/* ── khung trình duyệt giả ── */
global.window=global;
const el=()=>({innerHTML:"",style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},textContent:"",value:"",scrollTop:0,dataset:{},appendChild(){},setAttribute(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},getBoundingClientRect(){return{x:0,y:0,width:0,height:0}}});
const kho={};
global.document={getElementById:id=>kho[id]||(kho[id]=el()),createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},body:el(),documentElement:el()};
const ss={},ls={};
global.sessionStorage={getItem:k=>(k in ss?ss[k]:null),setItem:(k,v)=>{ss[k]=String(v)},removeItem:k=>{delete ss[k]}};
global.localStorage={getItem:k=>(k in ls?ls[k]:null),setItem:(k,v)=>{ls[k]=String(v)},removeItem:k=>{delete ls[k]}};
global.location={search:"",hash:"",pathname:"/",reload(){}};global.history={replaceState(){},pushState(){}};
global.navigator={userAgent:"node"};global.getComputedStyle=()=>({display:"block",getPropertyValue:()=>""});
global.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});global.requestAnimationFrame=f=>setTimeout(f,0);
global.alert=()=>{};global.confirm=()=>true;
require("vm").runInThisContext(FS.readFileSync(PATH.join(__dirname,"_APP.js"),"utf8"));

function ve(k){const cu=CUR;
 try{CUR=k;const p=PBK[k]||{};return (p.ty==="list")?renderList(k):(RENDER[k]?RENDER[k]():"")}
 catch(e){return "LOI_VE:"+e.message}finally{CUR=cu}}
function menuKeys(){const m={};navCay().forEach(G=>(G.items||[]).forEach(k=>{
 try{if(navVis(k))m[k]=G.g}catch(e){}}));return m}
function menuKeysAll(){const m={};navCay().forEach(G=>(G.items||[]).forEach(k=>m[k]=G.g));return m}
function chaCua(k){
 if(typeof NAVSUB!=="undefined"&&NAVSUB[k])return NAVSUB[k];
 if(typeof SOTRACUU!=="undefined"&&SOTRACUU.indexOf(k)>=0)return "tracuu";
 return "";
}

let loi=[],ghi=[],tieuChi=0;
function t(ten,ok,chiTiet){tieuChi++;if(!ok)loi.push(ten+(chiTiet?" - "+chiTiet:""))}

const nguoi=rows("DL01").filter(s=>staffActive(s));
const vais=[...new Set(nguoi.map(s=>String(s.role||"")))].filter(Boolean).sort();

/* ═══ L1 · MỞ APP RA LÀ THẤY VIỆC HÔM NAY ═══════════════════════════════════════════════════ */
(function(){
 const thieu=[];
 vais.forEach(v=>{
  const ai=nguoi.find(s=>String(s.role)===v);
  try{gateEnter(ai.staff_id)}catch(e){return}
  const land=(SCOPE()||{}).land||"";
  if(!land){thieu.push(v+" (khong co trang dap)");return}
  let nhip=[];try{nhip=nhipList()}catch(e){}
  if(!nhip.length)return;            /* nhóm chưa khai nhịp thì không đòi - khác chuyện với "có mà không hiện" */
  const h=ve(land);
  if(!/data-tour="nhipngay"/.test(h))thieu.push(v+" -> "+land);
 });
 try{gateEnter("")}catch(e){}
 t("L1 · moi chuc danh mo app ra deu thay nhip ngay cua minh", thieu.length===0,
   thieu.length+" chuc danh khong thay: "+thieu.join(" · "));
})();

/* ═══ L2 · MENU LÀ BẢN ĐỒ, KHÔNG PHẢI KHO ═══════════════════════════════════════════════════ */
(function(){
 try{gateEnter("")}catch(e){}
 const M=menuKeysAll();
 const hub=Object.keys(M).filter(k=>typeof HUBTAB!=="undefined"&&HUBTAB[k]);
 t("L2 · khong hub nao dung tren menu (V2 da bo hub)", hub.length===0,
   hub.map(k=>k+" o nhom \""+M[k]+"\"").join(" · "));
 /* Mục menu phải là trang CÓ THẬT - khai một tên chết là lối cụt im lặng.
    NGOẠI LỆ CÓ THẬT (thước này viết sai lần đầu, bắt nhầm cả bốn): `changA..changD` không phải
    bốn trang mà là BỐN GÓC NHÌN của cùng một trang `chang` - bấm mục nào thì `window.ARC` đổi
    góc nhìn. Đó chính là cách V2 muốn: chặng là CÁCH KỂ hành trình, không phải bốn nghiệp vụ. */
 const chet=Object.keys(M).filter(k=>!PBK[k]&&!/^chang[A-D]$/.test(k));
 const changOK=["changA","changB","changC","changD"].every(k=>!M[k]||!!PBK.chang);
 t("L2 · bon muc chang deu tro ve trang `chang` co that", changOK);
 t("L2 · moi muc menu deu tro toi mot trang co that", chet.length===0, chet.join(" · "));
 /* Và không trang ẩn nào lọt lên menu. */
 const an=Object.keys(M).filter(k=>PBK[k]&&PBK[k].hide);
 t("L2 · khong trang an nao lot len menu", an.length===0, an.join(" · "));
})();

/* ═══ L3 · KHÔNG TRANG NÀO MỒ CÔI ═══════════════════════════════════════════════════════════ */
(function(){
 try{gateEnter("")}catch(e){}
 const M=menuKeysAll();
 const moCoi=PAGES.filter(p=>!p.hide&&!M[p.k]&&!M[chaCua(p.k)]&&!DUOC_MO_COI[p.k]).map(p=>p.k);
 t("L3 · khong trang nao vua khong co muc menu vua khong co cha", moCoi.length===0,
   moCoi.join(" · ")+" => cho no mot muc menu, mot trang cha, hoac khai ly do o DUOC_MO_COI");
 /* Bản khai thừa cũng là sai: khai một trang rồi gỡ hẳn trang đó thì dòng khai nằm lại vĩnh viễn. */
 const thua=Object.keys(DUOC_MO_COI).filter(k=>!PBK[k]);
 t("L3 · ban khai mo-coi khong nhac trang da bien mat", thua.length===0, thua.join(" · "));
 /* Đứng ở trang CON thì mục của CHA phải sáng - nếu không cả sidebar tối thui. */
 const toi=[];
 PAGES.forEach(p=>{
  if(p.hide||M[p.k])return;
  const cha=chaCua(p.k); if(!cha||!M[cha])return;
  try{CUR=p.k;if(!navCurKey())toi.push(p.k+" (cha "+cha+")")}catch(e){toi.push(p.k+" (loi)")}
 });
 t("L3 · dung o trang con thi muc cua cha SANG tren sidebar", toi.length===0, toi.join(" · "));
})();

/* ═══ L4 · SỐ NÓI RA PHẢI BẤM ĐƯỢC ══════════════════════════════════════════════════════════ */
(function(){
 const xau=[],trong=[];
 let tongO=0;
 vais.forEach(v=>{
  const ai=nguoi.find(s=>String(s.role)===v);
  try{gateEnter(ai.staff_id)}catch(e){return}
  let L=[];try{L=canhBaoQuet()}catch(e){xau.push(v+": canhBaoQuet nem loi "+e.message);return}
  tongO+=L.length;
  if(!L.length){trong.push(v);return}
  L.forEach(x=>{
   if(!x.trang||!PBK[x.trang]){xau.push(v+": o \""+x.nhan+"\" tro toi trang khong co that ("+x.trang+")");return}
   let thay=false;try{thay=navVis(x.trang)}catch(e){}
   if(!thay)xau.push(v+": o \""+x.nhan+"\" tro toi \""+x.trang+"\" ma nguoi nay KHONG DUOC XEM (moi roi duoi)");
  });
  /* và HTML thật phải bấm được - đo trên chuỗi app phát ra, không tin bảng dữ liệu */
  let h="";try{h=canhBaoHTML()}catch(e){h=""}
  const soO=(h.match(/class="cbo /g)||[]).length;
  const soBam=(h.match(/class="cbo [^"]*" onclick=/g)||[]).length;
  if(soO!==soBam)xau.push(v+": "+soO+" o canh bao ma chi "+soBam+" o bam duoc");
 });
 try{gateEnter("")}catch(e){}
 t("L4 · moi o canh bao deu bam duoc, toi trang co that va nguoi do duoc xem", xau.length===0,
   xau.slice(0,6).join(" · "));
 ghi.push("dai canh bao: "+tongO+" o tren "+vais.length+" chuc danh"+
   (trong.length?(" | sach viec: "+trong.length+" chuc danh"):""));
})();

/* ═══ L5 · MỖI TRANG NGHIỆP VỤ CÓ DẢI THẺ ═══════════════════════════════════════════════════ */
(function(){
 try{gateEnter("")}catch(e){}
 const M=menuKeysAll();
 const nv=Object.keys(M).filter(k=>PBK[k]&&!PBK[k].hide&&!KHONG_NGHIEP_VU[k]);
 const thieu=nv.filter(k=>!/class="bstats/.test(ve(k)));
 t("L5 · moi trang nghiep vu tren menu deu co dai the so ("+nv.length+" trang)", thieu.length===0,
   thieu.join(" · ")+" => lam dai the, hoac khai ly do o KHONG_NGHIEP_VU");
 const thua=Object.keys(KHONG_NGHIEP_VU).filter(k=>!PBK[k]);
 t("L5 · ban khai khong-phai-nghiep-vu khong nhac trang da bien mat", thua.length===0, thua.join(" · "));
 ghi.push(nv.length+" trang nghiep vu tren menu | "+Object.keys(KHONG_NGHIEP_VU).length+" trang khai ro khong thuoc dien");
})();

/* ── in ── */
ghi.forEach(x=>console.log("  "+x));
if(loi.length){
 console.log("CHECKV2 DO ("+loi.length+"/"+tieuChi+"):");
 loi.forEach(x=>console.log("  - "+x));
 process.exit(1);
}
console.log("CHECKV2 OK: "+tieuChi+" tieu chi - nam luat rieng cua V2 deu con nguyen "+
 "(nhip ngay o trang dap · menu khong con hub · khong trang mo coi · so canh bao bam duoc · trang nghiep vu du dai the)");
