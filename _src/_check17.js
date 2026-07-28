/* _check17: BỘ MÁY LỌC CHUYÊN SÂU (việc B). Chạy: ITTS_OUT=<out> node _check17.js
   Nguyên tắc: kiểm bằng CHẠY THẬT - bật điều kiện rồi đối chiếu từng dòng còn lại,
   chứ không soi chuỗi trong source (soi chuỗi thì đổi tên hàm là mù). */
var FIELDS={},ST={};
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:(FIELDS[id]||""),checked:!!FIELDS["chk_"+id],
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:200,offsetWidth:120,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},setSelectionRange(){},select(){},blur(){},
 getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
global.document={getElementById:(id)=>ST[id]||(ST[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],
 createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};
var _LS={};global.localStorage={getItem:k=>_LS[k]===undefined?null:_LS[k],setItem(k,v){_LS[k]=String(v)},removeItem(k){delete _LS[k]}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
require('vm').runInThisContext(require('fs').readFileSync('./_APP.js','utf8'));
setRole("all");
var bad=[],ok=0;
function t(n,c){if(c)ok++;else bad.push(n)}
function reset(pg){window.FLT2=window.FLT2||{};window.FLT2[pg]={}}

/* ---- 1. KHAI BAO: truc nao cung phai tro vao cot CO THAT ---- */
Object.keys(FLTDEF).forEach(function(pg){
 var code=fltCode(pg);
 t("trang "+pg+" co bang nguon", !!code);
 (FLTDEF[pg]||[]).forEach(function(a){
  t("["+pg+"] truc '"+a.t+"' phai co nhan", !!a.t);
  t("["+pg+"] truc '"+a.t+"' phai co kieu hop le", a.ty==="multi"||a.ty==="date");
  /* day la chot chan lop loi wow_teacher_id: truc tro vao cot khong co that thi phai lo ra */
  if(a.col)t("["+pg+"] truc '"+a.t+"' tro vao cot CO THAT ("+code+"."+a.col+")", fltColOk(code,a.col));
 })});
t("moi trang trong FLTDEF deu con truc sau khi loc cot khong co that",
  Object.keys(FLTDEF).every(function(pg){return fltAxes(pg).length>0}));
t("phu duoc nhieu trang (>=15)", Object.keys(FLTDEF).length>=15);
t("co trang ngoai LISTCFG cung dung duoc (giao viec)", fltCode("giaoviec")==="DL23"&&fltAxes("giaoviec").length>0);

/* ---- 2. LOC MOT TRUC: chay that roi doi chieu tung dong ---- */
(function(){
 var pg="nhaplead", code=fltCode(pg), all=rows(code);
 reset(pg);
 t("chua chon gi thi khong loc dong nao", fltApply(pg,all).length===all.length);
 t("chua chon gi thi dem dieu kien = 0", fltOn(pg)===0);
 var v=ecode(all[0].lead_status);
 fltPick(pg,"lead_status",v);
 var got=fltApply(pg,all);
 t("chon 1 gia tri: moi dong con lai deu dung gia tri do", got.every(function(r){return ecode(r.lead_status)===v}));
 t("chon 1 gia tri: khong bo sot dong nao dung dieu kien",
   got.length===all.filter(function(r){return ecode(r.lead_status)===v}).length);
 t("dem dieu kien = 1", fltOn(pg)===1);
 /* HOAC trong cung mot truc */
 var v2=null;for(var i=0;i<all.length;i++){var c=ecode(all[i].lead_status);if(c&&c!==v){v2=c;break}}
 if(v2){fltPick(pg,"lead_status",v2);
  var got2=fltApply(pg,all);
  t("cung mot truc chon 2 gia tri = HOAC (nhieu dong hon)", got2.length>got.length);
  t("HOAC: moi dong con lai thuoc mot trong hai gia tri",
    got2.every(function(r){var c=ecode(r.lead_status);return c===v||c===v2}));
  t("van chi tinh la 1 dieu kien", fltOn(pg)===1);
  fltPick(pg,"lead_status",v2);
  t("bam lai lan nua thi bo chon gia tri do", fltApply(pg,all).length===got.length)}
 /* VA giua hai truc */
 var own=null;for(var j=0;j<all.length;j++){if(String(all[j].assigned_to||"")){own=String(all[j].assigned_to);break}}
 if(own){fltPick(pg,"assigned_to",own);
  var got3=fltApply(pg,all);
  t("them truc thu hai = VA (hep lai hoac bang)", got3.length<=got.length);
  t("VA: moi dong phai thoa CA HAI dieu kien",
    got3.every(function(r){return ecode(r.lead_status)===v&&String(r.assigned_to)===own}));
  t("dem dieu kien = 2", fltOn(pg)===2);
  fltAxClear(pg,"assigned_to");
  t("bo mot truc thi ve dung ket qua truc con lai", fltApply(pg,all).length===got.length)}
 reset(pg);
})();

/* ---- 3. LOC THEO KHOANG THOI GIAN ---- */
(function(){
 var pg="nhaplead", all=rows(fltCode(pg));
 reset(pg);
 fltDateSet(pg,"lead_created_time","p","d30");
 var got=fltApply(pg,all);
 var lo=Date.now()-30*864e5;
 t("30 ngay qua: moi dong deu trong khoang", got.every(function(r){var d=pvnd(r.lead_created_time);return d&&d.getTime()>=lo-864e5}));
 t("30 ngay qua phai hep hon toan bo", got.length<all.length);
 t("dong khong co moc thoi gian thi bi loai", got.every(function(r){return !!pvnd(r.lead_created_time)}));
 fltDateSet(pg,"lead_created_time","p","today");
 t("hom nay hep hon 30 ngay qua", fltApply(pg,all).length<=got.length);
 /* tu chon khoang cu the */
 fltDateSet(pg,"lead_created_time","from","2026-01-01");
 fltDateSet(pg,"lead_created_time","to","2026-03-31");
 var got2=fltApply(pg,all);
 t("chon khoang tay thi bo preset", (fltSt(pg)["lead_created_time"].p||"")==="");
 t("khoang tay: moi dong nam trong dung khoang", got2.every(function(r){
   var d=pvnd(r.lead_created_time);return d&&d>=new Date("2026-01-01T00:00:00")&&d<=new Date("2026-03-31T23:59:59")}));
 /* 'da qua han' phai la moc trong QUA KHU */
 reset(pg);fltDateSet(pg,"next_followup_time","p","over");
 t("'da qua han': moi moc deu o qua khu",
   fltApply(pg,all).every(function(r){var d=pvnd(r.next_followup_time);return d&&d.getTime()<=Date.now()}));
 reset(pg);
})();

/* ---- 4. TRUC TINH TOAN (khong phai cot cua bang) ---- */
(function(){
 var pg="hocvien", all=rows("DL09");
 reset(pg);
 var cid=(rows("DL08").filter(function(o){return o.class_id})[0]||{}).class_id;
 if(!cid){t("co lop de kiem truc tinh toan",false);return}
 fltPick(pg,"_lop",cid);
 var got=fltApply(pg,all);
 t("loc theo LOP (du DL09 khong co cot class_id)", got.length>0);
 t("moi HV con lai deu thuoc dung lop do", got.every(function(r){
   return rows("DL08").some(function(o){return o.student_id===r.student_id&&o.class_id===cid})}));
 t("khong bo sot HV nao trong lop do",
   got.length===all.filter(function(r){return rows("DL08").some(function(o){return o.student_id===r.student_id&&o.class_id===cid})}).length);
 reset(pg);
})();

/* ---- 5. LUU BO LOC RIENG CHO TUNG NGUOI ---- */
(function(){
 var pg="nhaplead", all=rows(fltCode(pg));
 CURSTAFF="NV001";reset(pg);
 var v=ecode(all[0].lead_status);
 fltPick(pg,"lead_status",v);
 var n=fltApply(pg,all).length;
 FIELDS={flt_nm:"Lead cua toi"};ST={};
 fltSaveRun(pg);
 t("luu duoc bo loc", fltSaved(pg).length===1&&fltSaved(pg)[0].name==="Lead cua toi");
 reset(pg);
 t("xoa het dieu kien thi ve day du", fltApply(pg,all).length===all.length);
 fltUse(pg,"Lead cua toi");
 t("goi lai bo loc da luu thi ra dung so cu", fltApply(pg,all).length===n);
 CURSTAFF="NV007";
 t("NGUOI KHAC khong thay bo loc cua nguoi truoc", fltSaved(pg).length===0);
 t("khoa luu tach theo tung nguoi", fltKey().indexOf("NV007")>=0);
 CURSTAFF="NV001";
 t("quay lai dung nguoi thi bo loc con nguyen", fltSaved(pg).length===1);
 fltDrop(pg,"Lead cua toi");
 t("xoa duoc bo loc da luu", fltSaved(pg).length===0);
 t("bo loc luu tren may, khong ghi vao du lieu chung",
   JSON.stringify((DATA.config||{})).indexOf("Lead cua toi")<0);
 CURSTAFF="";reset(pg);
})();

/* ---- 6. NOI VAO MAN HINH: nut, chip, xoa loc ---- */
(function(){
 var pg="nhaplead", all=rows(fltCode(pg));
 reset(pg);
 t("chua loc thi thanh cong cu chi co nut, khong co chip", fltBarHTML(pg).indexOf("fltchip")<0);
 var v=ecode(all[0].lead_status);
 fltPick(pg,"lead_status",v);
 var bar=fltBarHTML(pg);
 t("dang loc thi nut sang len", /class="btn sm primary"[^>]*fltOpen/.test(bar));
 t("hien chip cho biet dang loc gi", bar.indexOf("fltchip")>=0&&bar.indexOf("Trạng thái lead")>=0);
 t("chip co nut gỡ rieng tung dieu kien", /fltAxClear\('nhaplead','lead_status'\)/.test(bar));
 CUR=pg;
 var pgHTML=renderList(pg);
 t("danh sach that da bi thu hep", (pgHTML.match(/<tr data-/g)||[]).length<=20);
 t("thanh cong cu bao 'da loc'", pgHTML.indexOf("(đã lọc)")>=0);
 t("co nut Xoa loc", pgHTML.indexOf("clearFilt(")>=0);
 clearFilt(pg);
 t("Xoa loc xoa CA bo loc chuyen sau", fltOn(pg)===0);
 reset(pg);
})();

/* ---- 7. KHONG DUNG GI TOI TAB ---- */
(function(){
 window.TKTAB="mine";window.TKF="all";CURSTAFF="";
 reset("giaoviec");
 var a=renderGiaoviec();
 t("trang Giao viec co nut bo loc", a.indexOf("fltOpen('giaoviec')")>=0);
 var tabTruoc=window.TKTAB;
 var all=rows("DL23");
 var pr=ecode(all.filter(function(x){return x.priority})[0].priority);
 fltPick("giaoviec","priority",pr);
 var b=renderGiaoviec();
 t("loc xong TAB van nguyen ven", window.TKTAB===tabTruoc);
 t("cac tab van con day du tren man hinh",
   b.indexOf("Việc của tôi")>=0&&b.indexOf("Tôi đã giao")>=0&&b.indexOf("Tổng hợp")>=0);
 t("man Giao viec bao so viec con lai sau khi loc", b.indexOf("việc (đã lọc)")>=0);
 reset("giaoviec");
})();

/* ---- 8. AN TOAN ---- */
(function(){
 t("trang chua khai truc thi khong ve gi (khong vo)", fltBarHTML("khongcotrangnay")==="");
 t("loc tren trang chua khai thi tra nguyen mang", fltApply("khongcotrangnay",[1,2,3]).length===3);
 reset("nhaplead");
 fltPick("nhaplead","lead_status","gia_tri_khong_ton_tai");
 t("chon gia tri khong co that thi ra 0 dong chu khong nem loi", fltApply("nhaplead",rows("DL02")).length===0);
 reset("nhaplead");
})();

console.log(bad.length?("CHECK17 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK17 OK: "+ok+" tieu chi");
process.exitCode=bad.length?1:0;
