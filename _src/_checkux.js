// Bo kiem TRAI NGHIEM & TIEN ICH (V9.49) - anh Luan dat viec bang mot cau:
//   "nhung cai nay no lien quan den trai nghiem va tien ich, chac em phai danh gia toan dien
//    day em, lam ko toi thi ko ra gi ca"
// Danh gia toan dien thi phai DO bang may tren TOAN BO form, khong duoc va tung cho roi bao xong.
// Ba tieu chi duoi day la ba cai "lam ko toi" de nhat, va deu do duoc:
//   1. O CHON NGAY DE TRONG. Mo form ra ma o ngay trang la bat nguoi ta go lai tu dau moi lan.
//      Moi <input type="date"> trong mot form ghi PHAI mo ra da co san gia tri hop ly.
//   2. FORM CAM. Form co o nhap ma khong mot dong nao noi luu xong thi chuyen gi, luat nao ap
//      dung -> nguoi dung doan. Doan sai la du lieu sai, khong phai chi kho chiu.
//   3. O DINH KEM CHET. Co cho tai anh len ma duong ghi khong doc lai -> file bay mat lang le.
//      Moi attachBox("x") PHAI co attachLine("x") hoac attachVal("x") o duong ghi.
// Do o CA HAI mat: hop dong nguon (gen_v5.py) va ket qua ve THAT (mo drawer, doc HTML).
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{_s:{},add:function(c){this._s[c]=1},remove:function(c){delete this._s[c]},
  contains:function(c){return !!this._s[c]},toggle:function(c,v){if(v===undefined)v=!this._s[c];
  if(v)this._s[c]=1;else delete this._s[c];return v}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var ST={};
global.document={getElementById:(id)=>ST[id]||(ST[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.innerWidth=1400;global.innerHeight=900;
require('vm').runInThisContext(require('fs').readFileSync('./_APP.js','utf8'));
var SRC=require('fs').readFileSync('./gen_v5.py','utf8');
var L=SRC.split("\n");
var ok=0,bad=[];
function t(n,c){if(c)ok++;else bad.push(n)}
setRole("all");cfEnsure();

/* Cat gen_v5.py thanh tung ham JS mot: dong bat dau bang "function ten(" o cot 0 la mo mot ham,
   ham ke tiep la het. Do tren NGUON chu khong tren _APP.js vi nguon moi la cho phai sua. */
var FN=[];
(function(){var idx=[];
 for(var i=0;i<L.length;i++)if(/^function [A-Za-z_$][\w$]*\(/.test(L[i]))idx.push(i);
 for(var k=0;k<idx.length;k++){var a=idx[k],b=(k+1<idx.length)?idx[k+1]:L.length;
  FN.push({ten:L[a].match(/^function ([A-Za-z_$][\w$]*)\(/)[1],dong:a+1,than:L.slice(a,b).join("\n")})}})();
t("cat duoc ham tu nguon (>800 ham)", FN.length>800);

/* KHONG HAM NAO DINH NGHIA HAI LAN. Da cAn: ghForm/ghSave ton tai hai ban (nguoi dong hanh vs
   ghi nhan phan hoi), ham sau de len ham truoc -> bam "Sua nguoi giam ho" mo nham form phan hoi,
   khong loi JS, khong ai hay. goRisk cung trung doi. Loai bug im lang nhat co the co. */
(function(){var dem={},trung=[];
 FN.forEach(function(f){dem[f.ten]=(dem[f.ten]||0)+1});
 Object.keys(dem).forEach(function(k){if(dem[k]>1)trung.push(k+" x"+dem[k])});
 t("khong ham nao dinh nghia hai lan"+(trung.length?" - TRUNG: "+trung.join(", "):""), trung.length===0)})();

/* Form ghi = ham co openDrawer( VA co o nhap. Loc bang chinh dinh nghia do, khong liet ke tay,
   de them form moi la bo kiem tu biet. */
var FORM=FN.filter(function(f){return /openDrawer\(/.test(f.than)&&/<(input|textarea|select) /.test(f.than)});
t("dem duoc form ghi (>=70 form)", FORM.length>=70);

/* ---- 1. KHONG O CHON NGAY NAO DE TRONG ----
   Bo qua thanh loc (fltrow) va o ngay trong bang: cho do la dieu kien xem, de trong la dung. */
(function(){var xau=[];
 FORM.forEach(function(f){
  var re=/<input[^>]*type="date"[^>]*>/g,m;
  while((m=re.exec(f.than))){var tag=m[0];
   if(/class="btdi"/.test(tag))return;                 /* han nop rieng tung HV - da co value */
   if(!/value="/.test(tag))xau.push(f.ten+" (dong "+f.dong+")")}});
 t("moi o chon ngay trong form deu co san gia tri"+(xau.length?" - THIEU: "+xau.join(", "):""), xau.length===0)})();

/* Ham dung san gia tri ngay phai co that va phai tra ve dang yyyy-mm-dd */
t("co isoDay/isoCong/isoHen", typeof isoDay==="function"&&typeof isoCong==="function"&&typeof isoHen==="function");
t("isoDay(0) ra yyyy-mm-dd", /^\d{4}-\d{2}-\d{2}$/.test(isoDay(0)));
t("isoDay(1) dung la ngay mai", (function(){var d=new Date();d.setDate(d.getDate()+1);
 function p(x){return x<10?"0"+x:""+x}return isoDay(1)===d.getFullYear()+"-"+p(d.getMonth()+1)+"-"+p(d.getDate())})());
t("isoCong luon tra ve ngay con o tuong lai", isoCong("01/01/2020",7)>isoDay(0));
t("isoCong cong dung so ngay khi moc con tuong lai", isoCong(fromISOdt(isoDay(100)),5)===isoDay(105));
t("isoHen giu nguyen moc con tuong lai", isoHen(fromISOdt(isoDay(20)),7)===isoDay(20));
t("isoHen bo moc da qua, lay hom nay + n", isoHen("01/01/2020",7)===isoDay(7));
t("isoHen/isoCong khong vo khi moc rong", isoHen("",3)===isoDay(3)&&isoCong(null,3)===isoDay(3));

/* ---- 2. KHONG FORM NAO CAM ----
   Co loi giai thich = notebar (dong nhac) hoac fhint (chu nho duoi o) hoac ctxRows/ctxContent
   (khoi boi canh cua chinh ho so do). Thieu ca ba tuc la nguoi dung mo ra chi thay o trong. */
(function(){var cam=[];
 FORM.forEach(function(f){if(!/notebar|fhint|ctxRows\(|ctxContent\(/.test(f.than))
  cam.push(f.ten+" (dong "+f.dong+")")});
 t("khong form nao mo ra ma khong mot chu giai thich"+(cam.length?" - CAM: "+cam.join(", "):""), cam.length===0)})();

/* ---- 3. O DINH KEM PHAI CO DUONG DOC LAI ---- */
(function(){var box={},doc={},thieu=[];
 (SRC.match(/attachBox\("([a-z0-9_]+)"/g)||[]).forEach(function(s){box[s.match(/"([a-z0-9_]+)"/)[1]]=1});
 (SRC.match(/attach(?:Line|Val)\("([a-z0-9_]+)"/g)||[]).forEach(function(s){doc[s.match(/"([a-z0-9_]+)"/)[1]]=1});
 Object.keys(box).forEach(function(k){if(!doc[k])thieu.push(k)});
 t("co it nhat 9 o dinh kem", Object.keys(box).length>=9);
 t("moi o dinh kem deu co duong ghi doc lai"+(thieu.length?" - CHET: "+thieu.join(", "):""), thieu.length===0)})();

/* Bon o dinh kem V9.49 them vao - chung dung o dau va duong ghi nao doc, ghi ro de sau nay
   ai xoa nham la do ngay, khong phai di doan. */
[["rfd","duyetRefund","duyetRefundRun"],["dpx","runDropout","runDropoutSave"],
 ["tsr","testResult","testResultSave"],["ktt","ktTestiForm","ktTestiSave"]].forEach(function(a){
 var ve=FN.filter(function(f){return f.ten===a[1]})[0],ghi=FN.filter(function(f){return f.ten===a[2]})[0];
 t("o dinh kem "+a[0]+" nam trong "+a[1], !!ve&&ve.than.indexOf('attachBox("'+a[0]+'"')>=0);
 t("o dinh kem "+a[0]+" duoc "+a[2]+" doc lai", !!ghi&&ghi.than.indexOf('attachLine("'+a[0]+'"')>=0)});

/* Khong duoc khai bien roi bo do (code chet - LUAT 2ter): moi var _xxK=attachLine(...) phai
   duoc dung o dau do trong chinh ham do. Da cAn mot lan voi _tsK. */
(function(){var chet=[];
 FN.forEach(function(f){var re=/var (_\w+)=attachLine\(/g,m;
  while((m=re.exec(f.than))){var v=m[1];
   var dem=(f.than.match(new RegExp("\\b"+v+"\\b","g"))||[]).length;
   if(dem<2)chet.push(f.ten+"."+v)}});
 t("khong bien attachLine nao khai roi bo do"+(chet.length?" - CHET: "+chet.join(", "):""), chet.length===0)})();

/* ---- 4. VE THAT: mo drawer len va doc HTML ----
   Hop dong nguon o tren chi doc chuoi. Doan nay bat app ve THAT roi soi ket qua - de phong
   truong hop bieu thuc dung nhung chay ra rong. */
function veDrawer(fn){var seen=null,od=global.openDrawer,tt=global.toast;
 global.openDrawer=function(a,b){seen=b};global.toast=function(){};
 try{fn()}catch(e){seen="LOI: "+e.message}
 global.openDrawer=od;global.toast=tt;return seen}
function moiDate(html){var out=[],re=/<input[^>]*type="date"[^>]*>/g,m;
 while((m=re.exec(html)))out.push(m[0]);return out}

(function(){
 var e=rows("DL06").filter(function(x){return num(x.remaining_amount)>0})[0]||rows("DL06")[0];
 var s=rows("DL09")[0];
 var c=rows("DL10").filter(function(x){return x.class_start_date})[0]||rows("DL10")[0];
 var canh=[
  ["insPlanForm - ngay dong dot dau", function(){insPlanForm(e.enrollment_id)}],
  ["payForm - hen thu phan con lai",  function(){payForm(e.enrollment_id)}],
  ["moLop - lui ngay khai giang",     function(){moLop(c.class_id)}]
 ];
 canh.forEach(function(a){
  var h=veDrawer(a[1]);
  t(a[0]+" ve duoc", typeof h==="string"&&h.length>200&&h.indexOf("LOI:")!==0);
  if(typeof h!=="string"||h.indexOf("LOI:")===0)return;
  var ds=moiDate(h);
  t(a[0]+" - co o chon ngay", ds.length>0);
  t(a[0]+" - moi o ngay deu co san yyyy-mm-dd", ds.every(function(tag){
   var v=(tag.match(/value="([^"]*)"/)||[])[1];
   /* payForm chi dien san khi con no - het no thi de trong la dung */
   if(v==="")return /pm_due/.test(tag);
   return /^\d{4}-\d{2}-\d{2}$/.test(v)}));
  t(a[0]+" - co dong giai thich", /notebar|fhint/.test(h))});

 /* Bon form vua gan o dinh kem: phai thay o tai file hien ra that */
 [["duyetRefund",function(){duyetRefund(e.enrollment_id)},"rfd"],
  ["testResult", function(){var r=rows("DL03")[0];testResult(r.test_booking_id)},"tsr"],
  ["ktTestiForm",function(){var r=rows("DL18")[0];ktTestiForm(r.course_end_id)},"ktt"]
 ].forEach(function(a){var h=veDrawer(a[1]);
  t(a[0]+" ve duoc", typeof h==="string"&&h.indexOf("LOI:")!==0);
  if(typeof h!=="string"||h.indexOf("LOI:")===0)return;
  t(a[0]+" - hien o dinh kem "+a[2], h.indexOf('att_'+a[2])>=0||h.indexOf(a[2]+'_file')>=0||/Chứng từ|Ảnh|Đơn xin|clip/.test(h))});

 /* Cong hoc vien: hai form ngay cua chinh hoc vien */
 var hs=rows("DL09").filter(function(x){return /active/.test(ecode(x.student_status))})[0]||rows("DL09")[0];
 window.HVID=hs.student_id;
 var hw=veDrawer(function(){hvWowAsk()});
 t("hvWowAsk ve duoc", typeof hw==="string"&&hw.indexOf("LOI:")!==0);
 if(typeof hw==="string"&&hw.indexOf("LOI:")!==0){
  var d1=moiDate(hw);
  t("hvWowAsk - ngay mong muon dien san ngay mai", d1.length===1&&(d1[0].match(/value="([^"]*)"/)||[])[1]===isoDay(1));
  t("hvWowAsk - chan chon ngay da qua", /min="/.test(d1[0]))}
 var hp=veDrawer(function(){hvPaidNotify((rows("DL06").filter(function(x){return x.student_id===hs.student_id})[0]||e).enrollment_id)});
 t("hvPaidNotify ve duoc", typeof hp==="string"&&hp.indexOf("LOI:")!==0);
 if(typeof hp==="string"&&hp.indexOf("LOI:")!==0){
  var d2=moiDate(hp);
  t("hvPaidNotify - ngay chuyen dien san hom nay", d2.length===1&&(d2[0].match(/value="([^"]*)"/)||[])[1]===isoDay(0));
  t("hvPaidNotify - chan chon ngay tuong lai", /max="/.test(d2[0]));
  t("hvPaidNotify - co o chon dot va o dinh kem", /hvpn_dot|chưa có bảng đợt/.test(hp)&&/hvpn/.test(hp))}
})();

/* ---- 5. DONG GIAI THICH PHAI NOI THAT, KHONG NOI SUONG ----
   Cam nhat la notebar cam so vao chuoi ("qua 5 ngay") thay vi hoi Cai dat - doi cau hinh la
   cau chu noi doi. Moi con so trong notebar cua form phai di qua slaChip/paramOf/kpiTh. */
(function(){var doi=[];
 FORM.forEach(function(f){
  var re=/notebar[^']*'([^']*)'/g;   /* chi soi phan chuoi thuan trong notebar */
  var nb=f.than.split("notebar");
  for(var i=1;i<nb.length;i++){
   var doan=nb[i].split(/<\/div>/)[0];
   /* chuoi thuan: bo het cac doan '+bieuthuc+' di roi moi soi so */
   var thuan=doan.replace(/'\s*\+[\s\S]*?\+\s*'/g,"|||");
   var so=thuan.match(/(?:^|[^\w-])(\d+)\s*(ngày|giờ|phút|người|buổi|%)/);
   if(so)doi.push(f.ten+": \""+so[0].trim()+"\"")}});
 t("khong notebar nao cam cung nguong vao chuoi"+(doi.length?" - CAM CUNG: "+doi.join(" | "):""), doi.length===0)})();

/* Nguoc lai: moi ten tham so goi trong notebar phai co that trong CH2, goi ten sai thi slaChip
   im lang tra ve so mac dinh - cau chu van doc xuoi ma sai. Da cAn mot lan voi slaSurveyReply_days. */
(function(){var ma={};(APPPARAMS||[]).forEach(function(p){ma[p[1]]=1});
 var sai=[];
 FORM.forEach(function(f){var re=/(?:slaChip|paramOf|paramStr|kpiTh)\("([A-Za-z_][\w]*)"/g,m;
  while((m=re.exec(f.than)))if(!ma[m[1]]&&!/^(kpi|BC)/.test(m[1]))sai.push(f.ten+" -> "+m[1])});
 t("moi tham so goi trong form deu co that trong CH2"+(sai.length?" - MA: "+sai.join(", "):""), sai.length===0)})();

/* ---- 6. KHONG CON DAI VIEN MAU TRANG TRI (V9.50 - anh Luan: "a ko thich may cai kieu bo vien
   nay, nhin no xau lam, ke ca vien doc, e nen chon thiet ke chuyen nghiep") ----
   Dai vien doc/vien tren day (>=3px) va border-left-color deu la ho mau bi cam. Con lai duy
   nhat vien 1-2px trung tinh (ke bang, truc dong thoi gian) - do la cau truc, khong phai
   trang tri. Ai them lai mot dai vien mau la do ngay tai day. */
(function(){
 var xau=[];
 (SRC.match(/border-left:\s*[3-9]px[^;"'\}]*/g)||[]).forEach(function(m){if(!/transparent/.test(m))xau.push(m)});
 (SRC.match(/border-top:\s*[3-9]px[^;"'\}]*/g)||[]).forEach(function(m){xau.push(m)});
 (SRC.match(/border-left-color:[^;"'\}]*/g)||[]).forEach(function(m){xau.push(m)});
 t("khong con dai vien mau >=3px hay border-left-color nao"+(xau.length?" - CON: "+xau.slice(0,5).join(" | "):""), xau.length===0);
 t("to vang cau hinh chi con nen, khong thanh doc", /tr\.cfhl\{background:#FFF6D8\}/.test(SRC));
 t("KPI card khong con vien tren, mau don vao vong so", /\.k3card\.red \.k3n\{background:#DC2626\}/.test(SRC));
 t("hover the WOW doi bong, khong doi mau vien", /\.obcards\.rows \.obcard:hover\{box-shadow/.test(SRC));
 t("hop chi tiet WOW chiem tron hang - moi hang cung mot bo cuc", /\.obcards\.rows \.wowinfo\{flex:1 1 100%/.test(SRC));
})();

/* ---- 6bis. HIEN TEN, KHONG HIEN MA THO (V9.50 - anh Luan: "hien ten chu, nguoi dung ma hien
   ID lam gi, ai hieu dau") ----
   Goc benh: noi goi dua sai truong (assignee_name thay vi assignee_id_name) -> nsLnk roi ve ID.
   Da va o TANG CHUNG: nsLnk/nguoiLnk tu tra ten theo ma. O day canh ca hai lop:
   (a) tang chung tu cuu duoc, (b) VE THAT moi trang roi soi - khong link nao chi con ma tran. */
(function(){
 var nv=rows("DL01").filter(function(x){return String(x.staff_id)!=="ADMIN"})[0];
 t("nsLnk chi co ma van ra TEN", nv&&nsLnk(nv.staff_id).indexOf(esc(nv.full_name))>=0);
 var hv=rows("DL09")[0];
 t("nguoiLnk chi co ma van ra TEN", hv&&nguoiLnk(hv.student_id).indexOf(esc(hv.full_name))>=0);
 /* ve THAT tung trang, soi link chi chua ma tran */
 var xau=[],daVe=0;
 Object.keys(RENDER).forEach(function(k){
  var html="";try{html=RENDER[k]()}catch(e){return}
  daVe++;
  var m=html.match(/>((?:NV|HV)\d{2,4})<\/a>/g)||[];
  m.forEach(function(hit){var ma=hit.slice(1,-4);
   var nguoi=find("DL01","staff_id",ma)||find("DL09","student_id",ma);
   if(nguoi&&nguoi.full_name)xau.push(k+": "+ma)});
 });
 t("da ve duoc >=25 trang de soi", daVe>=25);
 t("khong trang nao con link chi hien ma tran"+(xau.length?" - THO: "+xau.slice(0,8).join(", "):""), xau.length===0);
 /* tab Viec cho nhan - noi anh Luan chup - phai ra ten */
 window.DUYTAB="duyetgiao";var hduy="";try{hduy=RENDER.duyet()}catch(e){hduy="LOI"}
 t("tab Viec cho nhan hien ten nguoi giao / nguoi nhan", hduy.indexOf("LOI")!==0&&!/>(?:NV\d{2,4})<\/a>/.test(hduy));
 window.DUYTAB="";
})();

/* ---- 7. NGUOI DONG HANH (V9.50 - anh Luan chot): dong hien thi = quan he + SDT la du,
   quan he chon tu danh sach 7 muc: ong, ba, bo, me, anh, chi, nguoi giam ho ---- */
(function(){
 t("dong hien thi ten 'Nguoi dong hanh', khong con nhan 'Nguoi giam ho'",
   SRC.indexOf('<span class="ctxk">Người đồng hành</span>')>=0&&SRC.indexOf('<span class="ctxk">Người giám hộ</span>')<0);
 t("dong hien thi dan dau bang QUAN HE, khong bat dau bang ho ten",
   /ctxk">Người đồng hành<\/span><span class="ctxv"><b>'\+esc\(ghQuanHe\(s\)/.test(SRC));
 var mong=["grandfather (Ông)","grandmother (Bà)","father (Bố)","mother (Mẹ)","brother (Anh)","sister (Chị)","guardian (Người giám hộ)"];
 var co=(ENUM.enum_guardian_relation||[]);
 t("danh muc quan he dung 7 muc anh Luan chot", co.length===7&&mong.every(function(m){return co.indexOf(m)>=0}));
 var s9=rows("DL09")[0];
 var hGH=veDrawer(function(){dhForm(s9.student_id)});
 t("form Nguoi dong hanh ve duoc", typeof hGH==="string"&&hGH.indexOf("LOI:")!==0);
 if(typeof hGH==="string"&&hGH.indexOf("LOI:")!==0){
  t("o quan he la SELECT co du 7 lua chon", mong.every(function(m){return hGH.indexOf(esc(elabel(m)))>=0})&&/id="gh_qh"/.test(hGH));
  t("form van giu o ho ten (phieu thu can)", /id="gh_ten"/.test(hGH))}
})();

if(bad.length){console.log("CHECKUX DO ("+bad.length+"/"+(ok+bad.length)+"):");
 bad.forEach(function(b){console.log("  - "+b)});process.exit(1)}
console.log("CHECKUX OK: "+ok+" tieu chi | "+FORM.length+" form ghi deu co loi giai thich, khong o ngay nao de trong");
