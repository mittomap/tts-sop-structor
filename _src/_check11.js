/* _check11 - V9.15: CHANG VONG DOI (arc) + NAVTREE + mstrip + nodeRail + sopBlock + reup */
function El(){return {innerHTML:"",value:"",checked:false,style:{},classList:{add(){},remove(){},contains(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},appendChild(){},focus(){},addEventListener(){},files:[]}}
var NAVEL=El();
global.document={getElementById:function(id){return id==="nav"?NAVEL:El()},querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};
var store={};global.localStorage={getItem:k=>store[k]===undefined?null:store[k],setItem(k,v){store[k]=String(v)},removeItem(k){delete store[k]}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
require('vm').runInThisContext(require('fs').readFileSync('./_APP.js','utf8'));
var ok=0,bad=[];function t(name,cond){if(cond)ok++;else bad.push(name)}
setRole("all");

/* --- 1. tang arc phu kin 17 chang --- */
t("ARCS co 4 chang", ARCS.length===4);
t("ARCOF phu kin JSTAGE", JSTAGE.every(function(S){return !!ARCOF[S.k]}));
t("arcOf hop le", arcOf("new")==="changA"&&arcOf("learning")==="changB"&&arcOf("paused")==="changC"&&arcOf("alumni")==="changD");
t("ARCRAIL+ARCBRANCH = 17 chang khong trung", (function(){var seen={};var n=0;
 ["changA","changB","changC","changD"].forEach(function(a){(ARCRAIL[a]||[]).concat(ARCBRANCH[a]||[]).forEach(function(k){if(seen[k])n=99;seen[k]=1;n++})});
 return n===17})());
t("moi ga thuoc dung arc cua no", (function(){var okk=true;
 ["changA","changB","changC","changD"].forEach(function(a){(ARCRAIL[a]||[]).concat(ARCBRANCH[a]||[]).forEach(function(k){if(arcOf(k)!==a)okk=false})});
 return okk})());

/* --- 2. trang chang: 4 arc deu render, co ray ga + nghiep vu + so truc --- */
["changA","changB","changC","changD"].forEach(function(a){
 window.ARC=a;window.CHANGK="";
 var o=RENDER.chang();
 t("chang "+a+" render chuoi", typeof o==="string"&&o.length>500);
 t("chang "+a+" can bang div", (o.match(/<div/g)||[]).length===(o.match(/<\/div>/g)||[]).length);
 t("chang "+a+" co ray ga nrail", o.indexOf('class="nrail"')>=0);
 t("chang "+a+" co nghiep vu trong chang", (o.match(/class="arcjob"/g)||[]).length>=2);
 t("chang "+a+" co so truc", o.indexOf("Sổ trực chặng")>=0);});
window.ARC="changA";
var oA=RENDER.chang();
t("changA co ga re nhanh (thoi)", (oA.match(/nst br/g)||[]).length===2);
t("changA co ga mo sang chang ke", (oA.match(/nst ghost/g)||[]).length>=1);
t("chang loc ga: bam ga -> danh sach thu hep", (function(){
 window.CHANGK="";var all=(RENDER.chang().match(/class="rvqi"/g)||[]).length;
 window.CHANGK="contacted";var sub=(RENDER.chang().match(/class="rvqi"/g)||[]).length;
 window.CHANGK="";return sub>0&&sub<=all})());
t("changList loc theo arc", changList().every(function(J){return arcOf(J.k)==="changA"}));

/* --- 3. go() remap arc + reup + lichtuan --- */
go("changB");t("go(changB) -> trang chang, ARC=changB", CUR==="chang"&&window.ARC==="changB");
go("reup");t("go(reup) -> hub tuyen sinh tab reup", CUR==="tuyensinh"&&window.TSTAB==="reup");
go("lichtuan");t("go(lichtuan) -> hub hoc tap tab lich tuan", CUR==="hoctap"&&window.HTTAB==="lichtuan");
t("VIEW_ALWAYS co chang", !!VIEW_ALWAYS.chang);

/* --- 4. tab reup trong tuyen sinh --- */
window.TSTAB="reup";
var oR=RENDER.tuyensinh();
t("tab reup render danh sach cham lai", (oR.match(/class="rvqi"/g)||[]).length>0);
t("tab reup chi chua khach da ngung", tsReupList().every(function(J){return J.k==="lost"||J.k==="no_contact"}));
t("phe tuyen sinh co buoc Cham lai", oR.indexOf("Chăm lại / Reup")>=0);
window.TSTAB="lead";

/* --- 5. mstrip tren cac dong danh sach --- */
t("mstrip: chuoi hop le co msarc + msd", (function(){var s=mstrip("contacted",false);
 return s.indexOf('class="mstrip"')>=0&&s.indexOf("msarc")>=0&&(s.match(/class="msd/g)||[]).length===7})());
t("mstrip: qua han co msd now over", mstrip("contacted",true).indexOf("now over")>=0);
t("mstrip: chang re nhanh ve hinh thoi", mstrip("lost",false).indexOf("msd br")>=0);
t("mstrip: chang khong ton tai -> rong", mstrip("xxx",false)==="");
["test","tuvan","thanhtoan","xeplop","wow","khieunai","ketthuc","baoluu"].forEach(function(p){
 var o=RENDER[p]();
 t("trang "+p+" co mstrip tren dong", (o.match(/class="mstrip/g)||[]).length>0)}); /* V9.18: mstrip co the kem class clk */

/* --- 6. NAVTREE menu theo chang --- */
t("NAVTREE co 7 nhom", NAVTREE.length===7);
t("nhom chang du 4", NAVTREE.filter(function(G){return G.arc}).length===4);
t("menu lo test/wow/baoluu tro lai (yeu cau Luan)", (function(){
 var all=[];NAVTREE.forEach(function(G){all=all.concat(G.items)});
 return all.indexOf("test")>=0&&all.indexOf("wow")>=0&&all.indexOf("baoluu")>=0&&all.indexOf("tuvan")>=0&&all.indexOf("reup")>=0})());
applyScope("");CURROLE="all";window.NAVOPEN={};NAVTREE.forEach(function(G){window.NAVOPEN[G.g]=true});
buildNav();
var nv=NAVEL.innerHTML;
t("quantri: menu co du 4 tong quan chang", (nv.match(/data-k="chang[A-D]"/g)||[]).length===4);
t("menu co cham mau arc", (nv.match(/class="navarc"/g)||[]).length===4);
/* navVis theo vai: tu van khong thay xep lop, giao vien khong thay lead */
var sales=rows("DL01").filter(function(x){return /^sales/.test(ecode(x.role))&&!/manager|leader/.test(ecode(x.role))})[0];
applyScope(sales.staff_id);
t("tu van: thay nhaplead + reup, khong thay xeplop/duyet", navVis("nhaplead")&&navVis("reup")&&!navVis("xeplop")&&!navVis("duyet"));
t("tu van: thay tong quan chang (ban do vong doi)", navVis("changA")&&navVis("changB"));
t("tu van: khong thay bao luu (tab khac bi khoa)", !navVis("baoluu"));
var gv=rows("DL01").filter(function(x){return /^teacher$/.test(ecode(x.role))})[0];
applyScope(gv.staff_id);
t("giao vien: thay wow/banglop, khong thay nhaplead/thanhtoan", navVis("wow")&&navVis("banglop")&&!navVis("nhaplead")&&!navVis("thanhtoan"));
var ht=rows("DL01").filter(function(x){return /^(hr_|it_|janitor|security)/.test(ecode(x.role))})[0];
if(ht){applyScope(ht.staff_id);
 t("ho tro gon: khong thay tong quan chang", !navVis("changA"));}
applyScope("");
/* navCur: highlight dung muc con theo tab */
window.TSTAB="test";CUR="tuyensinh";
t("navCur: dang o tab test -> muc test sang", navCur("test")===true&&navCur("nhaplead")===false);
window.ARC="changB";CUR="chang";
t("navCur: dang o changB -> muc changB sang", navCur("changB")===true&&navCur("changA")===false);
CUR="banlam";

/* --- 7. sopBlock --- */
var L0=rows("DL02")[0];var JL=jInfo(L0.lead_id);
var sb=sopBlock(JL);
t("sopBlock: du 4 dong chuan", ["Chặng","Việc kế","Thời hạn","Phụ trách"].every(function(k){return sb.indexOf(k)>=0}));
t("sopBlock: giu alias class jnext", sb.indexOf('class="jnext sopb')>=0);
t("sopBlock: co mstrip ben trong", sb.indexOf('class="mstrip"')>=0);
t("sopBlock(J,false): khong ve cot nut", sopBlock(JL,false).indexOf("jnr")<0);
window.JPID=L0.lead_id;
var oh=RENDER.hoso();
t("hoso dung sopBlock", oh.indexOf("jnext sopb")>=0);
t("hoso van du nut nghiep vu", oh.indexOf("Ghi liên hệ")>=0);
var S0=rows("DL09")[0];window.JPID=S0.student_id;
t("hoso HV dung sopBlock", RENDER.hoso().indexOf("jnext sopb")>=0);

/* --- 8. nen tang cu khong vo: 37 trang render --- */
var rerr=0;Object.keys(RENDER).forEach(function(k){try{var o=RENDER[k]();if(typeof o!=="string")rerr++}catch(e){rerr++}});
t("37 trang van render (loi="+rerr+")", rerr===0);

/* --- 9. V9.18: gop banlam+hanhtrinh, node bam duoc, Tra cuu mo rong, don cong HV --- */
t("V9.18 mstrip co pid -> bam duoc (clk + mstripOpen)", (function(){var s=mstrip("contacted",false,"LEAD-X");
 return s.indexOf("mstrip clk")>=0&&s.indexOf("mstripOpen")>=0})());
t("V9.18 mstrip khong pid -> khong clk (dung trong sopBlock)", mstrip("contacted",false).indexOf("clk")<0);
t("V9.18 mstripOpen mo drawer tung chang", (function(){var L1=rows("DL02")[0];
 try{mstripOpen(L1.lead_id)}catch(e){return false}return typeof mstripOpen==="function"})());
go("hanhtrinh");
t("V9.18 go(hanhtrinh) -> banlam goc nhin bang chang", CUR==="banlam"&&window.BLVIEW==="board");
t("V9.18 banlam view board co jboard + jflow", (function(){var o=RENDER.banlam();
 return o.indexOf("jboard")>=0&&o.indexOf("jflow")>=0})());
window.BLVIEW="list";
t("V9.18 banlam view list co Chay quy trinh", RENDER.banlam().indexOf("Chạy quy trình")>=0);
t("V9.18 menu Lam viec chi con banlam", (function(){var g=NAVTREE.filter(function(x){return x.g==="Làm việc"})[0];
 return g&&g.items.length===1&&g.items[0]==="banlam"})());
t("V9.18 Tra cuu >= 15 so", (function(){var g=NAVTREE.filter(function(x){return x.g==="Tra cứu"})[0];
 return g&&g.items.length>=15})());
t("V9.18 cac so tra cuu du LISTCFG + PAGES ty=list", ["dslienhe","dstest","dstuvan","dsdangky","dsthanhtoan","dsbuoihoc","dsdiemdanh","dsbaitap","dswow","dsketthuc","dskhaosat","dsphanhoi","dskhieunai"].every(function(k){return LISTCFG[k]&&LISTCFG[k].ro&&PBK[k]&&PBK[k].ty==="list"}));
t("V9.18 cac so tra cuu render duoc", (function(){var e2=0;
 ["dslienhe","dstest","dstuvan","dsdangky","dsthanhtoan","dsbuoihoc","dsdiemdanh","dsbaitap","dswow","dsketthuc","dskhaosat","dsphanhoi","dskhieunai"].forEach(function(k){
  try{var o=renderList(k);if(typeof o!=="string"||o.length<200)e2++}catch(e){e2++}});
 return e2===0})());
t("V9.18 HVSEC het Gui phu huynh", !HVSEC.some(function(x){return x[0]==="s-phuhuynh"}));
t("V9.18 trang HV: co timeline buoi hoc + khong con Gui phu huynh", (function(){
 window.HVID=(rows("DL09")[0]||{}).student_id;var o=renderTrangHV();
 return o.indexOf('class="hvtl"')>=0&&o.indexOf("Gửi phụ huynh")<0})());
t("V9.18 chip trang thai khoa dac mau (fill-)", (function(){
 window.HVID="HV061";var o=renderTrangHV();return o.indexOf("chip fill-")>=0})());
t("V9.18 tab demo gon: co Reset, het huong dan dai", (function(){window.SETTAB="demo";var o=RENDER.settings();window.SETTAB="ch2";
 return o.indexOf("Reset demo")>=0&&o.indexOf("Cách demo hai cổng")<0})());
CUR="banlam";window.BLVIEW="list";
console.log(bad.length?("FAIL:\n  "+bad.join("\n  ")):"OK: "+ok);
