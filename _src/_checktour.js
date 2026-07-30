// harness kiem TOUR: bat moi loi nem ra khi mo menu huong dan va khi chay tung buoc
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],
 createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.innerWidth=1400;global.innerHeight=900;
require('vm').runInThisContext(require('fs').readFileSync('./_APP.js','utf8'));
setRole("all");
var bad=[];
// 1. mo menu cap do
try{ tourMenu(); var body=STORE["drawerBody"]?STORE["drawerBody"].innerHTML:"";
  if(!body||body.length<50) bad.push("tourMenu() khong sinh noi dung menu cap do");
  else{ var n=(body.match(/tourMenu\('/g)||[]).length; if(n<3) bad.push("menu chi co "+n+" cap do"); }
}catch(e){ bad.push("tourMenu() NEM LOI: "+e.message) }
// 2. mo tung cap do
try{ (typeof TOURLV!=="undefined"?TOURLV:[]).forEach(function(V){ tourMenu(V[0]); }); }
catch(e){ bad.push("tourMenu(capdo) NEM LOI: "+e.message) }
// 3. man xac nhan + chay het moi buoc cua MOI bai
var keys=Object.keys(typeof TOURS!=="undefined"?TOURS:{});
keys.forEach(function(k){
  try{ tourAsk(k) }catch(e){ bad.push("tourAsk("+k+") NEM LOI: "+e.message) }
  try{
    tourStart(k);
    var T=TOURS[k];
    for(var i=0;i<T.steps.length;i++){ TOUR.i=i; tourPaint(); }
    tourEnd();
  }catch(e){ bad.push("chay bai "+k+" NEM LOI: "+e.message) }
});
// ---- MA DIEM NEO: moi buoc goi sel:"@ma" thi ma do PHAI ton tai trong ma nguon ----
var SRCPY=require('fs').readFileSync('./gen_v5.py','utf8');
var have={};(SRCPY.match(/data-tour="[A-Za-z0-9_.\-]+"/g)||[]).forEach(function(m){have[m.slice(11,-1)]=1});
var want={};
keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sl=String(st.sel||"");
  if(sl.charAt(0)==="@"){var a=sl.slice(1);want[a]=1;
    if(!have[a])bad.push("bai "+k+" buoc "+(i+1)+": goi ma neo @"+a+" KHONG co trong ma nguon")}
})});
var orphan=Object.keys(have).filter(function(a){return !want[a]});
console.log("Ma diem neo: khai",Object.keys(have).length,"| bai huong dan dung",Object.keys(want).length,
            orphan.length?("| khai ma dung: "+orphan.join(",")):"");
console.log("So bai huong dan:",keys.length,"| tong buoc:",keys.reduce((a,k)=>a+TOURS[k].steps.length,0));

/* ---- V9.29x: NEO CUA BAI HUONG DAN ----
   55 buoc huong dan truoc day neo bang CSS SELECTOR (.phead, .bstats...). Doi mot ten lop CSS la
   bai huong dan chi vao khoang khong, MA KHONG BAO LOI - no chi lang le highlight nham cho.
   Nay 42/55 buoc neo bang @ma (data-tour) - ma la hop dong, khong phai chi tiet trinh bay.
   13 buoc con lai tro vao CAC KHOI KHUNG dung chung cua he thiet ke; giu nguyen nhung phai
   KHAI RO O DAY. Ai doi ten mot trong nhung lop nay se thay ngay minh dang lam gay cai gi. */
function t2(n,c){if(!c)bad.push(n)}
var KHUNG=[".pbody",".jgrid",".dt",".notebar","#chaybody"];
(function(){
 var xau=[],neo=0,css=0;
 keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sel=String(st.sel||"");
  if(!sel)return;
  if(sel.charAt(0)==="@"||/^\[data-tour=/.test(sel)){neo++;return}
  css++;
  if(KHUNG.indexOf(sel)<0)xau.push(k+"["+i+"]="+sel)})});
 if(xau.length)bad.push("buoc huong dan neo bang CSS selector khong khai truoc: "+xau.join(", "));
 if(neo<40)bad.push("qua it buoc neo bang @ma (dang "+neo+", ky vong >=40)");
 console.log("Neo cua buoc huong dan: @ma",neo,"| khoi khung da khai",css,"| neo la",xau.length);
})();
/* Moi @ma dung trong bai huong dan phai co data-tour THAT trong file HTML da build */
(function(){
 var HTML="";
 try{HTML=require('fs').readFileSync((process.env.ITTS_OUT||'.')+'/ITTs_WebApp_v5_demo.html','utf8')}catch(e){}
 if(!HTML)return;
 var thieu=[];
 keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sel=String(st.sel||"");if(sel.charAt(0)!=="@")return;
  var ma=sel.slice(1);
  if(HTML.indexOf('data-tour="'+ma+'"')<0)thieu.push(ma)})});
 if(thieu.length)bad.push("neo @ma khong co that trong app: "+thieu.filter(function(v,i,a){return a.indexOf(v)===i}).join(", "));
})();


/* ---- V9.30: CAP "THAO TAC MAU" PHAI KIEM CHUNG DUOC ----
   Huong dan chi NOI thi nguoi hoc gat gu roi quen. Buoc nao co viec phai lam thi phai co chk()
   doc du lieu that. Khong co chk = quay lai lam mot chuyen tham quan lan hai. */
(function(){
 var lv=TOURLV.map(function(x){return x[0]});
 /* V9.34: them TANG THU TU "Don viec hom nay" - tro thu nhap vao guide (anh Luan: "cach lam cua
    guide rat hop de lam tro thu, e them tang tro thu vao guide la dinh"). Ba cap dau van la bai
    VIET SAN; cap thu tu KHONG viet san buoc nao - buoc sinh tu hang cho that. */
 t2("dung 4 cap do (3 bai viet san + 1 tang don viec)", lv.length===4);
 t2("ten cap do dung loi anh Luan",
   TOURLV[0][1]==="Tham quan"&&TOURLV[1][1]==="Thao tác mẫu"&&TOURLV[2][1]==="Cấu hình"&&TOURLV[3][1]==="Dọn việc hôm nay");
 t2("tang don viec KHONG co bai viet san (buoc phai sinh tu hang cho)",
   Object.keys(TOURS).filter(function(k){return TOURS[k].lv==="donviec"}).length===0);
 var tt=Object.keys(TOURS).filter(function(k){return TOURS[k].lv==="trainghiem"});
 t2("co bai thao tac mau cho tung vi tri", tt.length>=5);
 var nchk=0,ntot=0,thieu=[];
 tt.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  ntot++;
  if(typeof st.chk==="function")nchk++;
  })});
 t2("cap thao tac mau co it nhat 10 buoc kiem chung duoc (dang "+nchk+")", nchk>=10);
 /* chk phai CHAY DUOC, khong duoc nem loi */
 var vo=[];
 Object.keys(TOURS).forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  if(typeof st.chk!=="function")return;
  try{st.chk()}catch(e){vo.push(k+"["+i+"]: "+e.message)}})});
 t2("moi phep kiem deu chay duoc"+(vo.length?(" - "+vo.slice(0,3).join(" | ")):""), vo.length===0);
 /* chua lam gi thi phai tra FALSE - tra true san la loi kiem gia */
 try{tourBase()}catch(e){}
 var gia=[];
 Object.keys(TOURS).forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  if(typeof st.chk!=="function")return;
  var r=null;try{r=!!st.chk()}catch(e){return}
  if(r)gia.push(k+"["+i+"]")})});
 t2("chua lam gi thi moi phep kiem deu bao CHUA"+(gia.length?(" - "+gia.slice(0,3).join(", ")):""), gia.length===0);
 /* lam that mot viec -> phep kiem tuong ung phai doi sang DA LAM */
 (function(){
  var st=null,key="";
  Object.keys(TOURS).some(function(k){return TOURS[k].steps.some(function(x){
   if(typeof x.chk==="function"&&/tourMore\("lead"\)/.test(String(x.chk))){st=x;key=k;return true}
   return false})});
  if(!st){t2("tim duoc buoc kiem 'them lead moi'", false);return}
  t2("tim duoc buoc kiem 'them lead moi'", true);
  rows("DL02").unshift({lead_id:"L-TEST-TOUR",full_name:"Kiem thu"});
  t2("them lead that thi phep kiem doi sang DA LAM", st.chk()===true);
  rows("DL02").shift()})();
})();

/* ═══ V9.44 - MOI CHUC DANH PHAI CO DU BA THU: NHIP NGAY, BAI HUONG DAN, BANG VIEC ═══
   Anh Luan 30/07: "Moi 1 chuc danh deu co 1 huong dan va tro ly rieng phu hop voi ho, cho nen
   em phai build that chac tay."
   Do lan dau: 8 nhom vai, nhung chi 6 nhom co nhip ngay (Marketing va nhom ho tro khong co dong
   nao - Marketing con doc nham nhip cua QUAN LY), va chi 5 nhom co bai huong dan (thieu NV WOW,
   Marketing, nhom ho tro). Nang hon nua: NHIP co khoa `wow` voi 4 dong nhung o chon trong Cai dat
   khong liet ke no - nhip cua NV WOW TON TAI ma khong ai voi toi de sua.
   Bo kiem nay giu cho chuyen do khong tai dien: them mot nhom vai moi vao ROLESCOPE ma quen mot
   trong ba thu la DO. */
(function(){
 var nhom=Object.keys(ROLESCOPE);
 var coBai={};Object.keys(TOURS).forEach(function(k){if(TOURS[k].lv==="trainghiem")coBai[k.replace(/^tn_/,"")]=1});
 /* mot so nhom dung chung bai/nhip voi nhom khac - khai ro o day, khong de im lang */
 var DUNGCHUNG={quantri:"quanly",dieuhanh:"quanly",tuvan:"sale"};
 function bai(g){return coBai[DUNGCHUNG[g]||g]||coBai[g]}
 nhom.forEach(function(g){
  t2("nhom vai '"+g+"' co BAI HUONG DAN rieng", !!bai(g));
 });
 /* nhip ngay: hoi that nhipKey() bang cach dong vai mot nguoi cua nhom do */
 var nvTheoNhom={};
 DATA.dl.DL01.forEach(function(x){
  if(!/active|working/.test(String(x.status||"")))return;
  try{applyScope(x.staff_id)}catch(e){return}
  var rs=SCOPE();if(!nvTheoNhom[rs.group])nvTheoNhom[rs.group]=x.staff_id});
 nhom.forEach(function(g){
  var sid=nvTheoNhom[g];
  if(!sid){t2("nhom vai '"+g+"' co nhan vien de thu nhip ngay (bo qua neu khong co)", true);return}
  window.GATE_SID=sid;setRole("all");applyScope(sid);
  var L=[];try{L=nhipList()}catch(e){}
  t2("nhom vai '"+g+"' co NHIP NGAY (>=3 dong)", L.length>=3);
  var B="";try{CUR=(BVLAND[g]||[])[0]||"";
   var tab=(BVLAND[g]||[])[1];
   if(tab){if(CUR==="tuyensinh")window.TSTAB=tab;if(CUR==="hoctap")window.HTTAB=tab}
   B=bangViecHTML()}catch(e){}
  t2("nhom vai '"+g+"' co BANG VIEC o trang dap", (B||"").indexOf("bsn")>=0);
 });
 window.GATE_SID="";setRole("all");applyScope("");
 /* o chon chuc danh trong Cai dat phai liet ke DU moi nhip co that - khong de nhip mo coi */
 var oChon={};nhipRoles().forEach(function(r){oChon[r[0]]=1});
 var mocoi=Object.keys(NHIP).filter(function(k){return k!=="order"&&Array.isArray(NHIP[k])&&!oChon[k]});
 t2("moi nhip ngay deu sua duoc trong Cai dat"+(mocoi.length?(" - mo coi: "+mocoi.join(",")):""), mocoi.length===0);
})();

console.log(bad.length?("TOUR FAIL:\n  "+bad.join("\n  ")):"TOUR OK: menu cap do + moi bai chay het buoc, 0 loi");
