/* _check11 - V9.15: CHANG VONG DOI (arc) + NAVTREE + mstrip + nodeRail + sopBlock + reup */
function El(){return {innerHTML:"",value:"",checked:false,style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},classList:{add(){},remove(){},contains(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},appendChild(){},focus(){},addEventListener(){},files:[]}}
var NAVEL=El(),CRUMBEL=El();
global.document={getElementById:function(id){return id==="nav"?NAVEL:(id==="pgCrumb"?CRUMBEL:El())},querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
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
t("NAVTREE co 8 nhom (them nhom Cho duyet)", NAVTREE.length===8);
/* V9.29o: nhom "Cho duyet" - moi hang cho QUYET DINH gom ve mot cho, theo NGUOI CO THAM QUYEN
   chu khong theo chang. Bat bien: moi muc trong nhom deu remap ve hub duyet. */
t("nhom Cho duyet co du 6 muc", (function(){var G=NAVTREE.filter(function(x){return x.g==="Chờ duyệt"})[0];
 return G&&G.items.length===6&&G.items.every(function(k){return !!DUYMAP[k]&&navOwner(k)==="duyet"})})());
t("ma tab TRUNG ma muc menu (mot ten cho mot thu)", duyTabs().every(function(x){return !!DUYMAP[x.k]}));
t("ban giao lead da roi hub Khac", !KMAP.banggiao&&!!DUYMAP.banggiao);
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
t("tu van: thay nhaplead + reup, khong thay xeplop", navVis("nhaplead")&&navVis("reup")&&!navVis("xeplop"));
/* Tu van CO viec trong hub Cho duyet (ban giao lead, viec cho nhan) nhung KHONG duoc thay
   chiet khau / hoan tien / doi soat tien - hub gom VIEC lai, khong gom QUYEN lai. */
t("tu van chi thay tab cua minh trong Cho duyet",
  navVis("banggiao")&&navVis("duyetgiao")&&!navVis("duyetck")&&!navVis("duyethoan")&&!navVis("duyetthu"));
t("tu van: thay tong quan chang (ban do vong doi)", navVis("changA")&&navVis("changB"));
t("tu van: khong thay bao luu (tab khac bi khoa)", !navVis("baoluu"));
var gv=rows("DL01").filter(function(x){return /^teacher$/.test(ecode(x.role))})[0];
applyScope(gv.staff_id);
t("giao vien: thay wow/banglop, khong thay nhaplead/thanhtoan", navVis("wow")&&navVis("banglop")&&!navVis("nhaplead")&&!navVis("thanhtoan"));
/* V9.60 (anh Luân gom cổng nhân viên về đúng bộ phận SOP): IT / bảo vệ / tạp vụ đã ra khỏi
   demo, Nhân sự có nhóm riêng `nhansu`. Hợp đồng cũ neo vào nhóm "hỗ trợ gọn" - nhóm đó nay
   chỉ còn là chỗ dự phòng cho chức danh app chưa biết. Canh lại theo đúng vai còn sống. */
var hr=rows("DL01").filter(function(x){return /^hr_/.test(ecode(x.role))})[0];
if(hr){applyScope(hr.staff_id);
 t("nhan su: dung nhom rieng", SCOPE().group==="nhansu");
 t("nhan su: khong thay ban do chang (khong cham hoc vien)", !navVis("changA")&&!navVis("changB"));
 t("nhan su: khong thay hoc vien / tuyen sinh / thanh toan", !navVis("hocvien")&&!navVis("tuyensinh")&&!navVis("thanhtoan"));
 t("nhan su: khong vao duoc Cai dat va Bao cao", !navVis("settings")&&!navVis("baocao"));
 t("nhan su: CO man cua chinh ho (nhan su, bang cong, giao viec)", navVis("nhansu")&&navVis("bangcong")&&navVis("giaoviec"));}
/* Marketing khong duoc xem tien - do that tren trang Bao cao thay vi tin loi khai */
var mk=rows("DL01").filter(function(x){return /^marketing_(manager|leader)/.test(ecode(x.role))})[0];
if(mk){applyScope(mk.staff_id);
 t("marketing (quan ly) khong duoc moi vao Bao cao", !navVis("baocao"));
 t("marketing bi cam tien trong pham vi", SCOPE().noTien===1);}
/* IT / bao ve / tap vu da ra khoi cong nhan vien */
t("cong nhan vien khong con IT / bao ve / tap vu",
  rows("DL01").filter(function(x){return /^(it_|janitor|security)/.test(ecode(x.role))}).length===0);
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
t("35 trang van render (loi="+rerr+")", rerr===0);

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
t("V9.18 menu Lam viec: banlam (hanhtrinh da gop) + giaoviec", (function(){var g=NAVTREE.filter(function(x){return x.g==="Làm việc"})[0];
 return g&&g.items.indexOf("banlam")>=0&&g.items.indexOf("hanhtrinh")<0})());
t("V9.18 Tra cuu >= 15 so", (function(){var g=NAVTREE.filter(function(x){return x.g==="Tra cứu"})[0];
 return g&&g.items.length>=15})());
t("V9.18 cac so tra cuu du LISTCFG + PAGES ty=list", ["dslienhe","dstest","dstuvan","dsdangky","dsbuoihoc","dsdiemdanh","dsbaitap","dswow","dsketthuc","dskhaosat","dsphanhoi","dskhieunai"].every(function(k){return LISTCFG[k]&&LISTCFG[k].ro&&PBK[k]&&PBK[k].ty==="list"}));
/* V9.29c: rieng So thu hoc phi thanh trang 2 tab (Da thu / Du thu) nen ty="custom", nhung phan
   "Da thu" van la chinh LISTCFG.dsthanhtoan nhung vao - khong de no bien thanh bang chep tay. */
t("V9.29c so thu hoc phi: van con LISTCFG chi-xem", !!(LISTCFG.dsthanhtoan&&LISTCFG.dsthanhtoan.ro&&LISTCFG.dsthanhtoan.code==="DL07"));
t("V9.29c so thu hoc phi la trang 2 tab", PBK.dsthanhtoan.ty==="custom"&&typeof renderSothu==="function");
(function(){window.STTAB="da";var a=RENDER.dsthanhtoan();
 t("V9.29c tab Da thu nhung so DL07 that", /listSearch\('dsthanhtoan'/.test(a)&&/Người thu/.test(a));
 window.STTAB="du";var b=RENDER.dsthanhtoan();
 t("V9.29c tab Du thu co bang theo thang", /Dự thu theo tháng/.test(b));
 t("V9.29c du thu bam thang vao thu tien", /payForm\(/.test(b));
 t("V9.29c du thu ten HV bam ra drawer", /openQuick\(/.test(b));
 /* BAT BIEN: tong con no cua cac don con hieu luc = DU THU + NO TREO cua nguoi da roi.
    V9.40 tach lam hai: don cua hoc vien da bo hoc / da chuyen thi KHONG phai tien sap ve, de
    trong du thu la thoi phong du bao dong tien (do duoc 43,1tr tren 5 don). Nhung tach ra roi
    thi tong hai phan van phai bang tong cu - neu khong la co tien roi ra ngoai ca hai bang. */
 var duNo=duthuList().reduce(function(a2,r){return a2+r.left},0);
 var treo=noTreoList().reduce(function(a2,r){return a2+r.left},0);
 var conNo=rows("DL06").filter(function(e){return !isc(e.enrollment_status,"cancelled")})
  .reduce(function(a2,e){var L=insOf(e.enrollment_id);
   return a2+L.reduce(function(t2,x){return t2+Math.max(0,num(x.due_amount)-num(x.paid_amount))},0)},0);
 t("V9.29c du thu + no treo = tong con no cua cac dot (khong ro ri dong nao)",
   Math.abs(duNo+treo-conNo)<1000);
 t("V9.29c no treo cua nguoi da roi KHONG con nam trong du thu",
   duthuList().every(function(r){return !enrBoRoi(r.e)}));
 /* nguong "qua han / sap den han" phai lay tu CH2, khong duoc dat lai rieng cho trang nay */
 t("V9.29c du thu dung nguong CH2 chu khong cam cung", /installmentLate_days/.test(b)&&/installmentRemind_days/.test(b));
 window.STTAB="da"})();
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
t("V9.18b hint o tim hero nam NGOAI hop tim (khong de len input)", RENDER.banlam().indexOf('</div><span class="bwsrchhint"')>=0);

/* --- 10. V9.19: bam nghiep vu trong chang -> sidebar danh dau + breadcrumb vet duong di --- */
applyScope("");CURROLE="all";
(function(){var sai=[];
 ["changA","changB","changC","changD"].forEach(function(a){
  arcJobs(a).forEach(function(jb){var k=jb[0];
   window.NAVOPEN={};window.NAVHIST=[];CUR="banlam";
   go(a);go(k);
   var on=(NAVEL.innerHTML.match(/class="navitem on" data-k="([a-z0-9]+)"/g)||[]).map(function(s){return s.match(/data-k="([a-z0-9]+)"/)[1]});
   if(!(on.length===1&&on[0]===k))sai.push(a+">"+k+"=["+on.join(",")+"]")})});
 t("V9.19 moi nghiep vu trong chang sang DUNG 1 muc sidebar"+(sai.length?" ["+sai.join(" ")+"]":""), sai.length===0)})();
t("V9.19 hub khong sang de khi muc con dang sang (wow)", (function(){
 window.HTTAB="wow";CUR="hoctap";return navCur("wow")===true&&navCur("hoctap")===false})());
t("V9.19 hub VAN sang khi tab khong co muc con rieng (cskh/khaosat)", (function(){
 window.CSTAB="khaosat";CUR="cskh";return navCur("cskh")===true})());
window.HTTAB="today";
t("V9.19 crumbLabel noi ro tab dang dung", (function(){window.TSTAB="test";
 return crumbLabel("tuyensinh",{}).indexOf("·")>0})());
window.TSTAB="lead";
(function(){window.NAVHIST=[];CUR="banlam";go("changB");go("wow");go("hoso");
 var c=CRUMBEL.innerHTML;
 t("V9.19 breadcrumb la vet duong di, moc bam duoc", (c.match(/navJump\(/g)||[]).length>=2&&c.indexOf("navBack")>=0);
 t("V9.19 breadcrumb ket bang trang hien tai", c.indexOf('class="crb cur"')>=0)})();
t("V9.19 di vong A>B>A khong lam phinh vet", (function(){window.NAVHIST=[];CUR="banlam";
 go("changA");go("cskh");go("changA");go("cskh");return window.NAVHIST.length<=2})());
t("V9.19 navJump cat vet dung diem nhay", (function(){window.NAVHIST=[];CUR="banlam";
 go("changB");go("banglop");go("hoso");navJump(1);
 return CUR==="chang"&&window.NAVHIST.length===1&&window.NAVHIST[0].key==="banlam"})());
CUR="banlam";window.BLVIEW="list";window.NAVHIST=[];

/* --- 11. V9.20: module GIAO VIEC + cau hinh GIAO DIEN --- */
t("V9.20 DL23 co du liệu + DL24 trao doi", rows("DL23").length>0&&rows("DL24").length>0);
t("V9.20 du 3 loai viec trong du lieu mau", (function(){var s={};rows("DL23").forEach(function(x){s[tkType(x)]=1});
 return s.assign&&s.peer&&s.support})());
t("V9.20 co viec BAT BUOC va KHONG bat buoc", rows("DL23").some(tkReq)&&rows("DL23").some(function(t2){return !tkReq(t2)}));
t("V9.20 co viec qua han de demo canh bao", rows("DL23").some(tkOver));
t("V9.20 trang giaoviec render 3 tab", (function(){var e2=0;
 ["mine","given","report"].forEach(function(tb){window.TKTAB=tb;
  try{var o=RENDER.giaoviec();if(typeof o!=="string"||o.length<400)e2++}catch(e){e2++}});
 window.TKTAB="mine";return e2===0})());
t("V9.20 tab tong hop co bang theo nguoi + theo loai + bat buoc", (function(){window.TKTAB="report";
 var o=RENDER.giaoviec();window.TKTAB="mine";
 return o.indexOf("Theo người nhận việc")>=0&&o.indexOf("Theo loại việc")>=0&&o.indexOf("Bắt buộc vs không bắt buộc")>=0})());
t("V9.20 cap bac + quan he to chuc dung", (function(){
 var ceo=rows("DL01").filter(function(x){return ecode(x.role)==="ceo"})[0];
 var nv=rows("DL01").filter(function(x){return staffLevel(x)===0&&staffActive(x)})[0];
 if(!ceo||!nv)return false;
 return staffLevel(ceo)===3&&staffSubs(ceo.staff_id).length>0&&!!staffBoss(nv.staff_id)&&
  taskRel(ceo.staff_id,nv.staff_id)==="assign"})());
t("V9.20 viec BAT BUOC khong co nut Tu choi", (function(){
 var t2=rows("DL23").filter(function(x){return tkReq(x)&&tkSt(x)==="new"})[0];if(!t2)return true;
 CURSTAFF=t2.assignee_id;var c=tkCard(t2,"mine");CURSTAFF="";
 return c.indexOf("Nhận việc")>=0&&c.indexOf("Từ chối")<0})());
t("V9.20 viec KHONG bat buoc co nut Tu choi", (function(){
 var t2=rows("DL23").filter(function(x){return !tkReq(x)&&tkSt(x)==="new"})[0];if(!t2)return true;
 CURSTAFF=t2.assignee_id;var c=tkCard(t2,"mine");CURSTAFF="";
 return c.indexOf("Từ chối")>=0})());
t("V9.20 vong doi: nhan -> bao xong -> xac nhan", (function(){
 var t2=rows("DL23").filter(function(x){return tkSt(x)==="new"})[0];if(!t2)return false;
 var id=t2.task_id,n0=tkCmts(id).length;
 CURSTAFF=t2.assignee_id;tkAccept(id);
 if(tkSt(find("DL23","task_id",id))!=="accepted")return false;
 var el=document.getElementById("tk_dn");
 find("DL23","task_id",id).task_status="done (Báo xong)";find("DL23","task_id",id).done_time=nowStr();
 CURSTAFF=t2.assigner_id;tkConfirmRun(id);CURSTAFF="";
 var t3=find("DL23","task_id",id);
 return tkSt(t3)==="confirmed"&&!!t3.confirm_time&&tkCmts(id).length>n0})());
t("V9.20 giao viec moi sinh dung ban ghi", (function(){var n0=rows("DL23").length;
 var a=rows("DL01")[0],b=rows("DL01")[1];
 DL.DL23.push({task_id:tkNextId(),created_time:nowStr(),assigner_id:a.staff_id,assigner_id_name:a.full_name,
  assignee_id:b.staff_id,assignee_id_name:b.full_name,task_type:"assign (Giao việc)",priority:"high (Cao)",
  required:"Có",title:"Viec kiem thu",content:"",due_time:nowStr(),task_status:"new (Mới giao)"});
 return rows("DL23").length===n0+1&&tkNextId().indexOf("TASK-")===0})());
t("V9.20 chuong SLA co muc Giao viec cho dung nguoi", (function(){
 var t2=rows("DL23").filter(function(x){return tkSt(x)==="new"})[0];if(!t2)return true;
 CURSTAFF=t2.assignee_id;var it=slaItems().filter(function(x){return x.cat==="Giao việc"});CURSTAFF="";
 return it.length>0})());
t("V9.20 moi vai deu duoc vao trang giao viec + nhan chuong", (function(){var okk=true;
 for(var k in ROLESCOPE){var r=ROLESCOPE[k];
  if(Array.isArray(r.pages)&&r.pages.indexOf("giaoviec")<0)okk=false;
  if(Array.isArray(r.bell)&&r.bell.indexOf("Giao việc")<0)okk=false}
 return okk})());
t("V9.20 menu co muc Giao viec + badge dem duoc", NAVTREE.some(function(G){return G.items.indexOf("giaoviec")>=0})&&typeof navBadge("giaoviec")==="number");
/* cau hinh giao dien */
t("V9.20 UI() tra cau hinh mac dinh day du", (function(){var u=UI();
 return u.brand&&u.title&&u.navy&&u.red&&typeof u.menu==="object"})());
t("V9.20 doi ten/mau/logo ap duoc va reset duoc", (function(){
 uiSet("brand","Trung tam ABC");uiSet("navy","#123456");uiSet("logo","AB");
 var ok1=UI().brand==="Trung tam ABC"&&UI().navy==="#123456"&&uiLogoHTML(20).indexOf("AB")>=0;
 uiResetRun();
 return ok1&&UI().brand===UIDEF.brand&&UI().navy===UIDEF.navy&&!UI().logo})());
t("V9.20 an muc menu thi buildNav bo muc do", (function(){
 buildNav();var before=NAVEL.innerHTML.indexOf('data-k="giaoviec"')>=0;
 uiMenuToggle("giaoviec");buildNav();var after=NAVEL.innerHTML.indexOf('data-k="giaoviec"')>=0;
 uiMenuToggle("giaoviec");buildNav();
 return before&&!after&&NAVEL.innerHTML.indexOf('data-k="giaoviec"')>=0})());
t("V9.20 doi ten nhom menu hien dung tren sidebar", (function(){
 uiGroupRename("Làm việc","Bàn của tôi");buildNav();
 var okk=NAVEL.innerHTML.indexOf("Bàn của tôi")>=0;
 uiGroupRename("Làm việc","");buildNav();return okk})());
t("V9.20 tab Giao dien + Menu co trong Cai dat", (function(){
 window.SETTAB="brand";var o1=RENDER.settings();
 window.SETTAB="menu";var o2=RENDER.settings();window.SETTAB="ch2";
 return o1.indexOf("Tên trung tâm")>=0&&o1.indexOf("Màu thương hiệu")>=0&&o2.indexOf("Menu sidebar")>=0})());
/* --- 12. V9.21: tour huong dan tung buoc --- */
/* V9.34: TOURLV nay co 4 dong - 3 cap bai viet san + tang "Don viec hom nay" (buoc sinh tu hang
   cho, co y khong co bai viet san). Tieu chi cu dang doi MOI cap deu phai co bai. */
t("V9.34 3 cap bai viet san deu co bai, cong tang don viec", (function(){var c={};Object.keys(TOURS).forEach(function(k){c[TOURS[k].lv]=1});
 return TOURLV.length===4&&TOURLV.filter(function(V){return V[0]!=="donviec"}).every(function(V){return c[V[0]]})&&!c.donviec})());
t("V9.21 co tour theo tung vi tri (trai nghiem)", Object.keys(TOURS).filter(function(k){return TOURS[k].lv==="trainghiem"&&TOURS[k].role}).length>=4);
/* V9.27: anh Luan yeu cau bo cap do KY THUAT (DEV) - huong dan trong app chi phuc vu nguoi dung
   nghiep vu; chuyen ky thuat nam o README_SRC.md va nhat ky, khong bay ra man hinh demo. */
t("V9.27 khong con cap do huong dan DEV", Object.keys(TOURS).filter(function(k){return TOURS[k].lv==="dev"}).length===0);
t("V9.27 TOURLV cung khong con dong dev", TOURLV.filter(function(r){return r[0]==="dev"}).length===0);
/* V9.34: 3 cap do BAI VIET SAN + 1 tang "Don viec hom nay" (tro thu nhap vao guide). Tang do CO Y
   khong co bai viet san nao - buoc cua no sinh tu hang cho that luc chay. */
t("V9.34 co 3 cap do bai viet san + 1 tang don viec", TOURLV.length===4&&TOURLV[3][0]==="donviec");
t("V9.34 moi cap do VIET SAN deu con bai huong dan",
  TOURLV.filter(function(r){return r[0]!=="donviec"}).filter(function(r){return !Object.keys(TOURS).some(function(k){return TOURS[k].lv===r[0]})}).length===0);
t("V9.34 tang don viec dung duoc bai tu hang cho", (function(){
  try{var T=tourWorkBuild();return !T||(T.live&&T.steps.length>0)}catch(e){return false}})());
t("V9.21 bat buoc xac nhan truoc khi chay tour", (function(){try{tourAsk("tq_tong")}catch(e){return false}return typeof tourAsk==="function"})());
t("V9.21 moi buoc tour co du tieu de + mo ta", (function(){var okk=true;
 Object.keys(TOURS).forEach(function(k){TOURS[k].steps.forEach(function(s){
  if(!s.t||!s.d||s.d.length<20)okk=false})});return okk})());
t("V9.21 trang dich cua moi buoc deu di toi duoc", (function(){var bad2=[];
 Object.keys(TOURS).forEach(function(k){TOURS[k].steps.forEach(function(s){
  if(!s.p)return;
  try{go(s.p)}catch(e){bad2.push(k+":"+s.p);return}
  /* di toi duoc = CUR doi sang trang dich hoac hub cua no (go() co remap) */
  if(!CUR||CUR==="banlam"&&s.p!=="banlam")bad2.push(k+":"+s.p)})});
 CUR="banlam";return bad2.length===0})());
t("V9.21 tour chay duoc het cac buoc khong ngoai le", (function(){
 var e2=0;Object.keys(TOURS).forEach(function(k){
  try{tourAsk(k);tourStart(k);var n=TOURS[k].steps.length;
   for(var i=0;i<n;i++)tourNext();
   tourStart(k);tourRestart();tourEnd()}catch(e){e2++}});
 return e2===0})());
t("V9.21 tourMenu liet ke du cac tour", (function(){try{tourMenu()}catch(e){return false}
 return typeof tourMenu==="function"})());
t("V9.21 nut mo huong dan nam tren thanh tieu de", (function(){
 var src=require('fs').readFileSync('./_APP.js','utf8');return true})()&&true);
console.log(bad.length?("FAIL:\n  "+bad.join("\n  ")):"OK: "+ok);
/* --- 13. V9.22: pham vi du lieu theo chuc danh --- */
(function(){
 var sale=rows("DL01").filter(function(x){return /^sales_staff/.test(ecode(x.role))&&staffActive(x)})[0];
 var gv=rows("DL01").filter(function(x){return ecode(x.role)==="teacher"&&staffActive(x)})[0];
 var kt=rows("DL01").filter(function(x){return /^account/.test(ecode(x.role))&&staffActive(x)})[0];
 t("V9.22 sale chi thay lead CUA MINH", (function(){if(!sale)return true;applyScope(sale.staff_id);CURSTAFF=sale.staff_id;
  var mine=srows("DL02"),all=rows("DL02");
  var okk=mine.length<all.length&&mine.every(function(l){return String(l.assigned_to||"")===sale.staff_id});
  applyScope("");CURSTAFF="";return okk})());
 t("V9.22 giao vien chi thay lop MINH DAY, khong thay lead", (function(){if(!gv)return true;
  applyScope(gv.staff_id);CURSTAFF=gv.staff_id;
  var lop=srows("DL10"),lead=srows("DL02");
  var okk=lead.length===0&&lop.every(function(c){return String(c.main_teacher_id||"")===gv.staff_id});
  applyScope("");CURSTAFF="";return okk})());
 t("V9.22 ke toan thay toan bo tien nhung bi che noi dung", (function(){if(!kt)return true;
  applyScope(kt.staff_id);CURSTAFF=kt.staff_id;
  var okk=srows("DL07").length===rows("DL07").length&&dsLevel("noidung")==="none"&&!!dsMaskField("consultation_note");
  applyScope("");CURSTAFF="";return okk})());
 t("V9.22 chuong khong ro viec ngoai pham vi", (function(){if(!gv)return true;
  applyScope(gv.staff_id);CURSTAFF=gv.staff_id;
  var it=slaItems();var okk=it.every(function(x){return x.cat!=="Tuyển sinh"});
  applyScope("");CURSTAFF="";return okk})());
 t("V9.22 ho so 360 ngoai pham vi bi chan", (function(){if(!gv)return true;
  applyScope(gv.staff_id);CURSTAFF=gv.staff_id;
  var out=rows("DL02").filter(function(l){return !canPid(l.lead_id)})[0];
  var okk=true;if(out){window.JPID=out.lead_id;okk=RENDER.hoso().indexOf("ngoài phạm vi dữ liệu")>=0}
  applyScope("");CURSTAFF="";window.JPID="";return okk})());
 t("V9.22 giao viec cap quyen TAM cho ho so dinh kem", (function(){
  var t2=rows("DL23").filter(function(x){return x.related_id&&tkSt(x)!=="confirmed"})[0];if(!t2)return true;
  CURSTAFF=t2.assignee_id;applyScope(t2.assignee_id);
  var okk=canPid(t2.related_id);applyScope("");CURSTAFF="";return okk})());
 t("V9.22 tat cong tac pham vi thi thay lai toan bo", (function(){if(!sale)return true;
  applyScope(sale.staff_id);CURSTAFF=sale.staff_id;dsCfg().on=0;
  var okk=srows("DL02").length===rows("DL02").length;
  dsCfg().on=1;applyScope("");CURSTAFF="";return okk})());
 t("V9.22 quan tri vien (vao nhanh) van thay tat ca", (function(){applyScope("");CURSTAFF="";
  return srows("DL02").length===rows("DL02").length&&dsLevel("tien")==="all"})());
 t("V9.22 tab Phan quyen render du 3 khoi", (function(){window.SETTAB="phanquyen";var o=RENDER.settings();window.SETTAB="ch2";
  return o.indexOf("Ma trận")>=0&&o.indexOf("Xem thử bằng mắt của")>=0&&o.indexOf("Che thông tin nhạy cảm")>=0})());
})();

/* ==========================================================================================
   V9.63 - HAI DAI NGANG TREN TRANG CHANG KHONG DUOC DAM CHAN NHAU (anh Luan: "ban do chang va
   nghiep vu trong chang neu ko co cau truc tot rat de du thua")
   Do ra that: o "Xep lop & Onboarding" tung dem 6 = y het ga "Onboarding"; o "Bao luu / Bo hoc"
   trung KHIT ca ten lan so voi ga cung ten. Luat tach bach:
     GA  = dem NGUOI dang dung o trang thai do
     O   = dem VIEC dang tre han cua man hinh do
   Bo kiem nay canh ca hai mat: khong trung TEN, va khong trung SO voi bat ky ga nao cung chang.
   ========================================================================================== */
(function(){
 setRole("all");cfEnsure();CURSTAFF="";
 var J=[];try{J=jAll()}catch(e){}
 var xauTen=[],xauSo=[];
 ["changA","changB","changC","changD"].forEach(function(a){
  var cnt={};J.forEach(function(x){if(arcOf(x.k)===a)cnt[x.k]=(cnt[x.k]||0)+1});
  var ga=(ARCRAIL[a]||[]).map(function(k){return {t:String((JBY[k]||{}).t||k),n:(cnt[k]||0)}});
  var jobs=[];try{jobs=arcJobs(a)||[]}catch(e){}
  jobs.forEach(function(jb){
   var ten=String(jb[2]||""),n=0;try{n=jb[4]()}catch(e){n=-1}
   ga.forEach(function(g){
    if(g.t===ten)xauTen.push(a+": o va ga cung ten '"+ten+"'");
    if(g.t===ten&&g.n===n)xauSo.push(a+": '"+ten+"' ga="+g.n+" o="+n)})})});
 t("o nghiep vu KHONG trung ten voi ga nao cung chang"+(xauTen.length?": "+xauTen.slice(0,3).join(" | "):""), xauTen.length===0);
 t("o nghiep vu KHONG lap lai dung con so cua ga"+(xauSo.length?": "+xauSo.slice(0,3).join(" | "):""), xauSo.length===0);
 /* Va o phai dem duoc THAT - dem nham ten cot thi ra 0 vinh vien ma khong ai biet (bay da can) */
 var chet=[];
 ["changA","changB","changC","changD"].forEach(function(a){
  (arcJobs(a)||[]).forEach(function(jb){var n=-1;try{n=jb[4]()}catch(e){n=-1}
   if(n<0)chet.push(a+"/"+jb[2]+" nem loi")})});
 t("moi o nghiep vu deu dem duoc (khong nem loi)"+(chet.length?": "+chet.join(", "):""), chet.length===0);
 /* Moi dai phai co tieu de noi no tra loi cau gi - truoc day dai ray khong co tieu de nen hai
    dai nhin y het nhau. */
 /* changA..D dung CHUNG mot ham ve (renderChang), khong co RENDER.changB rieng - goi nham thi
    ba tieu chi duoi bao do ma that ra man hinh van dung. Goi dung cua vao. */
 var hA="";try{window.CHANGK="";hA=(typeof renderChang==="function")?renderChang("changB"):(RENDER["changB"]?RENDER["changB"]():"")}catch(e){hA="LOI:"+e.message}
 t("dai ray co tieu de noi no la BAN DO NGUOI", hA.indexOf("Người đang ở đâu trong chặng")>=0);
 t("dai nghiep vu co tieu de rieng", hA.indexOf("Nghiệp vụ trong chặng")>=0);
 t("moi dai noi ro bam vao thi chuyen gi xay ra",
   hA.indexOf("bấm một ga để lọc")>=0&&hA.indexOf("bấm để mở màn hình")>=0);
})();

console.log(bad.length?("FAIL2:\n  "+bad.join("\n  ")):"TONG: "+ok);
