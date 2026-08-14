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
require('vm').runInThisContext(require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8'));
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
  /* DOI CAU HOI, KHONG XOA THUOC (10/08). Hai phep canh cu doi mot O NGAY dien san ngay mai va
     co `min` de chan ngay da qua. Anh Luan doi thiet ke: *"nguoi dung chi duoc chon book wow dua
     tren lich lam viec da dang ky cua team wow thoi"* - nen o ngay go tay da bi thay bang o CHON
     CA TRUC. Y DINH cu van dung (khong cho dat vao qua khu) nhung nay dung DO CAU TAO: danh sach
     chi liet ke ca con trong va chua qua gio. Thuoc moi hoi thang cai y dinh ay, va hoi chat hon:
     khong con o nao go duoc gio tu do, va khong ca nao chao ra da qua gio. */
  t("hvWowAsk - chon CA TRUC co that, khong go gio tu do",
    /id="hvw_slot"/.test(hw) && !/id="hvw_date"/.test(hw) && !/id="hvw_gio"/.test(hw));
  var _op=(hw.match(/<option value="SLOT-[^"]*"[^>]*>[^<]*<\/option>/g)||[]);
  t("hvWowAsk - co ca de chon ("+_op.length+" ca)", _op.length>0);
  var _qua=_op.filter(function(o){
    var m=o.match(/>(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})/);
    if(!m)return false;var p=m[1].split(/[\/ :]/);
    return new Date(+p[2],+p[1]-1,+p[0],+p[3],+p[4]).getTime()<=Date.now()});
  t("hvWowAsk - khong chao ra ca nao da qua gio", !_qua.length, _qua.slice(0,2).join(" | "))}
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
 /* ĐO CSS THẬT, KHÔNG ĐO CHÚ THÍCH. Bẫy đã cắn 07/08 khi làm dải cảnh báo: người sửa viết một
    khối chú thích GIẢI THÍCH VÌ SAO ĐÃ GỠ dải viền màu, trong đó có nhắc lại chuỗi bị cấm - và
    bộ kiểm bắt chính lời giải thích ấy, báo đỏ một thứ đã được sửa xong.
    Đây là bài học dự án đã rút ở nhóm M6b và ở `_checkux` nhóm 12: **chú thích mã nguồn viết cho
    người sửa app đọc, không phải cho máy đếm.** Thấy thước bắt một câu đúng thì siết thước, đừng
    bẻ câu chữ cho vừa nó - vì bẻ một lần là lần sau người ta không dám ghi lại bài học nữa. */
 var CSS=SRC.replace(/\/\*[\s\S]*?\*\//g," ");
 (CSS.match(/border-left:\s*[3-9]px[^;"'\}]*/g)||[]).forEach(function(m){if(!/transparent/.test(m))xau.push(m)});
 (CSS.match(/border-top:\s*[3-9]px[^;"'\}]*/g)||[]).forEach(function(m){xau.push(m)});
 (CSS.match(/border-left-color:[^;"'\}]*/g)||[]).forEach(function(m){xau.push(m)});
 t("khong con dai vien mau >=3px hay border-left-color nao"+(xau.length?" - CON: "+xau.slice(0,5).join(" | "):""), xau.length===0);
 t("to vang cau hinh chi con nen, khong thanh doc", /tr\.cfhl\{background:#FFF6D8\}/.test(SRC));
 t("KPI card khong con vien tren, mau don vao vong so", /\.k3card\.red \.k3n\{background:#DC2626\}/.test(SRC));
 t("hover the WOW doi bong, khong doi mau vien", /\.obcards\.rows \.obcard:hover\{box-shadow/.test(SRC));
 t("hop chi tiet WOW chiem tron hang - moi hang cung mot bo cuc", /\.obcards\.rows \.wowinfo\{flex:1 1 100%/.test(SRC));

 /* V9.63 - HAI LO HONG CUA CHINH BO KIEM NAY, anh Luan bat lai dung loi cu:
    (1) no chi soi MA APP, khong voi toi trang chu ban demo (file nam o repo kia) - nen em bay
        lai dai mau 4px o day ma khong co gi keu. Nay trang chu co BAN NGUON trong repo chinh
        (_src/trangchu_demo.html) va bi soi cung mot thuoc do.
    (2) no chi canh thuoc tinh `border` - dai mau dung bang ::before/::after (mot khoi content:""
        cao vai px, keo het chieu ngang, co background mau) thi lot het. Nay canh ca kieu do. */
 var DAI=/(::before|::after)\{content:"";[^}]*height:[1-6](\.\d+)?px[^}]*background[^}]*\}/g;
 (function(){
  var fs=require('fs');
  var TC="";try{TC=fs.readFileSync('./trangchu_demo.html','utf8')}catch(e){TC=""}
  t("co ban nguon trang chu ban demo de soi (_src/trangchu_demo.html)", TC.length>500);
  /* Cùng lý do như mục 6 ngay trên: BỎ CHÚ THÍCH TRƯỚC KHI ĐO. Chú thích mã nguồn viết cho
     người sửa app đọc - và người sửa app rất hay phải NHẮC LẠI chuỗi bị cấm để giải thích vì
     sao mình đã gỡ nó. Đếm cả chú thích thì càng ghi bài học cẩn thận càng bị báo đỏ, tức là
     cái thước đang phạt đúng thứ ta muốn khuyến khích. */
  [["ma app",SRC],["trang chu ban demo",TC]].forEach(function(x){
   var ten=x[0],ma=String(x[1]||"").replace(/\/\*[\s\S]*?\*\//g," ");if(!ma.trim())return;
   var b1=(ma.match(/border-left:\s*[3-9]px[^;"'\}]*/g)||[]).filter(function(m){return !/transparent/.test(m)});
   var b2=(ma.match(/border-top:\s*[3-9]px[^;"'\}]*/g)||[]);
   var b3=(ma.match(/border-left-color:[^;"'\}]*/g)||[]);
   var b4=(ma.match(DAI)||[]);
   var xau2=b1.concat(b2,b3,b4);
   t("("+ten+") khong co dai vien mau, ke ca dai dung bang ::before"+(xau2.length?" - CON: "+xau2.slice(0,3).join(" | ").slice(0,160):""), xau2.length===0)});
  t("(trang chu) the cong hover doi BONG chu khong doi mau vien",
    !TC||(/\.door:hover\{[^}]*box-shadow/.test(TC)&&!/\.door:hover\{[^}]*border-color/.test(TC)));
  t("(trang chu) mau don vao o icon chu khong thanh dai", !TC||/\.dic\{[^}]*background:var\(--accent/.test(TC));
  t("(trang chu) ba the deu tro dung ba cong",
    !TC||(/href="cong-nhan-vien\/"/.test(TC)&&/href="cong-hoc-vien\/"/.test(TC)&&/href="cong-hoc-vien\/\?phuhuynh"/.test(TC)));
  t("(trang chu) khong con ten cu 'Trang hoc vien'", !TC||TC.indexOf("Trang học viên")<0);

  /* V9.72 - TRANG CHU HAI BUOC (anh Luan: "cu chia ra em, chon v5 hoac v6, chon xong thi chon
     tiep 3 cong, thieu gi lam cho du di em").
     Canh CAU TRUC chu khong canh chu: moi buoc phai ton tai, moi nhanh phai co DU BA CONG, va
     phai co loi quay lai. Da cam mot luat o day: bo kiem cu chi doi "co ba href tro ba cong" -
     dieu do van dung khi ca hai nhanh deu chi co MOT cong, hoac khi khong co nhanh nao ca. */
  (function(){
   if(!TC)return;
   function khoi(id){
    var i=TC.indexOf('id="'+id+'"');if(i<0)return "";
    var j=TC.indexOf("</section>",i);return j<0?"":TC.slice(i,j)}
   /* V9.99 - BAN V6 DA NGUNG PHAT HANH (anh Luan 04/08). Trang chu tu HAI buoc (chon ban ->
      chon cong) rut con MOT buoc: ba cua hien thang. Bay phep kiem cu deu hoi ve nhanh ban 6 -
      "du ba buoc", "nhanh ban 6 tro dung ban 6", "moi buoc 2 co loi quay lai chon ban"... -
      gio khong con doi tuong de hoi. Thay bang bon phep hoi dung cai con lai.
      GIU LAI mot y quan trong cua bo cu, vi no van dung: "bo cuc can doi ma khong dung su that
      thi la noi doi bang bo cuc". */
   var b5=khoi("b5");
   t("(trang chu) vao thang mot buoc chon cong, khong bat bam thua",
     !!b5 && TC.indexOf('id="b1"')<0 && TC.indexOf('href="?ban5"')<0,
     "con dau vet cua buoc chon ban da go");
   t("(trang chu) co du ba cong",
     b5.indexOf('href="cong-nhan-vien/"')>=0 &&
     b5.indexOf('href="cong-hoc-vien/"')>=0 &&
     b5.indexOf('href="cong-hoc-vien/?phuhuynh"')>=0, "thieu cong");
   t("(trang chu) khong con cua nao tro sang ban V6 da go",
     TC.indexOf('href="cong-nhan-vien-v6/"')<0, "con cua v6 - bam vao se 404");
   t("(trang chu) tat JavaScript van vao duoc app",
     /<noscript>/.test(TC) && TC.indexOf('href="cong-nhan-vien/"')>0);
  })();
 })();
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

/* ---- 6ter. KHONG CAU NAO CHIA TEN THAM SO MAY RA MAN HINH (V9.51 - anh Luan: "a nho cho nay
   chi can them banh rang de co the nhay toi noi dieu chinh la duoc ma, tat ca cac cau dang nhu
   vay?") ----
   Cau "viec can lam" trong DU LIEU mang dau "(tenThamSo)". Tang hien thi (naDecor) phai doi no
   thanh banh rang nhay toi CH2 - nguoi dung khong bao gio thay ma may. */
(function(){
 t("co naDecor va cfGear", typeof naDecor==="function"&&typeof cfGear==="function");
 t("naDecor doi ten that thanh banh rang, chu tho bien mat", /cfedit/.test(naDecor("Goi trong 15 phut (slaLRT_minutes)"))&&naDecor("Goi trong 15 phut (slaLRT_minutes)").indexOf("(slaLRT_minutes)")<0);
 t("naDecor hieu ca ten cu qua bi danh", /cfedit/.test(naDecor("Goi ngay (slaLeadResponse)")));
 t("naDecor khong pha chu nguoi ta go tay", naDecor("hen gap (quan Cau Giay)").indexOf("(quan Cau Giay)")>=0);
 /* moi marker trong du lieu phai GIAI duoc ra mot tham so co that - marker mo coi la se lo ma may */
 var moCoi=[];
 Object.keys(DL).forEach(function(tb){(DL[tb]||[]).forEach(function(r){Object.keys(r).forEach(function(k){
  var v=r[k];if(typeof v!=="string")return;
  var re=/\((sla[A-Za-z0-9_]*|threshold[A-Za-z0-9_]*)\)/g,m;
  while((m=re.exec(v))){var w=m[1];
   if(!window.__PSET)naDecor("");
   if(!window.__PSET[w]&&!NAALIAS[w])moCoi.push(tb+"."+k+": "+w)}})})});
 t("moi marker tham so trong du lieu deu giai duoc"+(moCoi.length?" - MO COI: "+moCoi.slice(0,5).join(", "):""), moCoi.length===0);
 /* ve THAT: moi trang + drawer lead - khong dau vet "(sla...)" tho nao con hien ra */
 var tho=[];
 Object.keys(RENDER).forEach(function(k){var html="";try{html=RENDER[k]()}catch(e){return}
  if(/\((?:sla|threshold)[A-Za-z0-9_]+\)/.test(html))tho.push(k)});
 var ld=rows("DL02").filter(function(x){return /slaLeadResponse/.test(String(x.next_action||""))})[0];
 if(ld){var hLd=veDrawer(function(){leadOpen?leadOpen(ld.lead_id):openQuick(ld.lead_id)});
  if(typeof hLd==="string"&&/\((?:sla|threshold)[A-Za-z0-9_]+\)/.test(hLd))tho.push("drawer lead")}
 t("khong trang/drawer nao con chia '(slaXxx)' tho"+(tho.length?" - THO: "+tho.join(", "):""), tho.length===0);
})();

/* ---- 6quater. MOT MAN MOT BO DIEU KHIEN - O THONG KE KHONG DUOC LAP NUT LOC (V9.51) ----
   anh Luan chup hub Cho duyet: 5 o thong ke + 6 chip tab cung MOT bo so tren cung man. Do toan
   app: 13 trang / 48 o lap. Chuan da chot: o nao chi lap mot nut loc cung man thi bo - so don
   vao chinh chip loc; o mang thong tin khac (tong tien, ty le, gio kem) thi giu.
   Do THAT: dat CUR = trang roi ve (bangViec cua vai chi hien o trang dap - thieu buoc nay la
   harness tu bia ra trung lap gia). */
(function(){
 var truoc=CUR,tong=0,chi=[];
 function dich(oc){var x=String(oc||"").match(/(?:duyTabSet|goDuyet|tsTabSet|goTS|csTabSet|csGo|htTabSet|htGo|kcTabSet|fset)\('([^']+)'(?:,'([^']+)')?\)/);return x?(x[1]+(x[2]?("/"+x[2]):"")):null}
 Object.keys(RENDER).forEach(function(k){
  CUR=k;var h="";try{h=RENDER[k]()}catch(e){return}
  var bs=[],m,re=/<div class="bstat"[^>]*onclick="([^"]*)"[\s\S]*?<div class="bsn">/g;
  while((m=re.exec(h)))bs.push(m[1]);
  if(!bs.length)return;
  var tabDich={};re=/<button class="(?:segb|fbtn)[^"]*"[^>]*onclick="([^"]*)"/g;
  while((m=re.exec(h))){var d=dich(m[1]);if(d)tabDich[d]=1}
  bs.forEach(function(oc){var d=dich(oc);if(d&&tabDich[d]){tong++;if(chi.length<6)chi.push(k+":"+d)}});
 });
 CUR=truoc;
 t("khong o thong ke nao lap nut loc cung man"+(tong?" - LAP "+tong+": "+chi.join(", "):""), tong===0);
})();

/* ---- 6quinquies. MOT TRANG MOT O TIM (V9.52 - anh Luan: "trung tim kiem ne, voi lai em thiet
   ke khong dong bo o cac trang, nen that su nhin rat roi mat") ----
   renderList ve o tim cua chinh no roi con goi fltBarHTML - ham chung cung ve mot o tim nua.
   Hai o, hai bo may loc khac nhau, cach nhau ba dong tren cung mot thanh. Canh bang may. */
(function(){
 var truoc=CUR,hai=[],khac=[];
 Object.keys(RENDER).forEach(function(k){
  CUR=k;var h="";try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  var o=(h.match(/<input[^>]*placeholder="Tìm[^"]*"/g)||[]);
  if(o.length>1)hai.push(k+" ("+o.length+" o)");
  o.forEach(function(x){var m=x.match(/placeholder="([^"]*)"/);
   /* CHUAN: dung hai cach goi. "Tim trong trang nay..." cho o loc bang/trang;
      "Tim ten, SDT hoac ma..." cho o tim MOT CON NGUOI / mot ho so. Them cach thu ba la do. */
   if(m&&m[1]!=="Tìm trong trang này..."&&m[1]!=="Tìm tên, SĐT hoặc mã...")khac.push(k+": "+m[1])});
 });
 CUR=truoc;
 t("khong trang nao co hai o tim"+(hai.length?" - HAI O: "+hai.join(", "):""), hai.length===0);
 t("cach goi o tim thong nhat"+(khac.length?" - LAC: "+khac.slice(0,5).join(", "):""), khac.length===0);
})();

/* ---- 6decies. BANH RANG TRO CAU HINH - BAT/TAT DUOC, VA CHAY CA O CONG (V9.53) ----
   anh Luan: "may cai banh rang de dan toi toan bo cau hinh, e lam cho anh nhe, SLA nay no o may
   cong do, do dang demo ma, tao dieu kien de moi nguoi co the sua thong so theo thuc te. em co
   the lam them 1 cai trong cai dat de bat tat hien thi banh rang tro cau hinh."
   Ba dieu phai dung:
   1. MOT cong tac duy nhat (UI().gear) chi phoi MOI loai banh rang - CH2, CH6, CH4, CH1;
   2. Tat thi con so VAN CON, chi mat nut nhay (khong duoc nuot mat so);
   3. O CONG HOC VIEN khong co man Cai dat - banh rang phai mo tam giai thich, khong duoc goi
      cfGo roi chet cam. */
(function(){
 var u=UI();
 t("co cong tac gear trong UI, mac dinh BAT", typeof gearOn==="function"&&gearOn());
 var co=slaChip("slaLRT_minutes",15);
 t("bat thi co banh rang", /ti-settings/.test(co)&&/15/.test(co));
 /* V9.54: bat banh rang thi phai BAM DUOC - nhung bam la mo ngan keo sua tai cho, khong nhay trang. */
 t("bat thi bam duoc, mo ngan keo sua tai cho", /cfPop\('slaLRT_minutes'\)/.test(co));
 u.gear=0;
 var tat=slaChip("slaLRT_minutes",15);
 t("tat thi MAT banh rang", !/ti-settings/.test(tat));
 t("tat nhung CON SO van con", /15/.test(tat));
 t("tat thi kpiChip cung sach", !/ti-settings/.test(kpiChip(/^RER/,0.4,1)));
 t("tat thi nut sua cau nhac cung an", msgEditBtn("NA001")==="");
 t("tat thi cfGear cung an", cfGear("slaLRT_minutes")==="");
 u.gear=1;
 /* o CONG hoc vien: banh rang mo tam giai thich chu khong goi cfGo */
 window.HVPORTAL=1;
 var cong=slaChip("slaLRT_minutes",15);
 window.HVPORTAL=0;
 t("o cong hoc vien banh rang KHONG goi cfGo/cfPop", !/cfGo\(/.test(cong)&&!/cfPop\(/.test(cong));
 t("o cong hoc vien banh rang mo tam giai thich", /gearNoi\('slaLRT_minutes'\)/.test(cong));
 t("co ham gearNoi", typeof gearNoi==="function");
 var hg=veDrawer(function(){gearNoi("slaLRT_minutes")});
 t("tam giai thich noi ten thong so + gia tri + sua o dau",
   typeof hg==="string"&&/slaLRT_minutes/.test(hg)&&/Sửa ở đâu/.test(hg)&&/Ngưỡng &amp; SLA/.test(hg));
 t("cong tac nam trong man Cai dat", (function(){window.SETTAB="brand";var h="";
   try{h=renderSettings()}catch(e){}window.SETTAB="";return /Bánh răng trỏ cấu hình/.test(h)})());
})();

/* ---- 6novies. DEM BIEN THE - PHEP DO TAI HIEN DUOC CACH ANH LUAN TIM RA LOI (V9.52) ----
   anh Luan hoi thang: *"em co thay, du em audit va kiem rat nhieu, nhung anh luon tim ra 1 cai
   gi do bat hop ly khong, va khong he mat qua nhieu cong suc?"*
   Ly do do duoc: moi bo kiem truoc day hoi "CAI NAY co dung khong" - tuc la kiem tung thu MOT
   MINH NO. Anh Luan khong nhin nhu vay: anh nhin CA MAN HINH va so trang nay voi trang kia,
   nen anh thay thu ma phep kiem don le khong the thay - hai nut cung lam mot viec, 12 kieu
   thanh cong cu, 6 cach goi mot o tim, 20 cach ghi so dong. Tung cai deu "dung", ca bo thi sai.
   Phep do nay dao nguoc cau hoi: "app dang lam viec nay bang MAY CACH?" - qua nguong la do. */
(function(){
 var truoc=CUR,H={};
 Object.keys(RENDER).forEach(function(k){CUR=k;
  try{H[k]=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){}});
 CUR=truoc;
 function bienThe(re,loc){var m={};
  Object.keys(H).forEach(function(k){var x,r=new RegExp(re.source,"g");
   while((x=r.exec(H[k]))){var v=(x[1]||"").replace(/\s+/g," ").trim();
    if(!v||(loc&&!loc(v)))continue;m[v]=1}});
  return Object.keys(m)}
 /* don vi dem: chi duoc dung tu trong bang DVI (hoac "dòng"), khong duoc che them tu moi */
 var dv=bienThe(/class="tbcnt">\d+ ([^<]{1,24})</);
 var chuan={"dòng":1};Object.keys(DVI).forEach(function(k){chuan[DVI[k]]=1});
 var la=dv.filter(function(v){return !chuan[v]});
 t("don vi dem deu nam trong bang DVI"+(la.length?" - LA: "+la.slice(0,6).join(" | "):""), la.length===0);
 t("co bang DVI khai don vi tung trang", typeof DVI==="object"&&Object.keys(DVI).length>=15);
 /* nhan nut mo ho so: chi duoc mot cach goi */
 var hs=bienThe(/<button[^>]*class="btn sm"[^>]*><i[^>]*><\/i>(Hồ sơ[^<]{0,20})</);
 t("nhan nut mo ho so khong de ra nhieu cach goi ("+hs.length+")", hs.length<=2);
})();

/* ---- 6septies. THIET KE DONG BO GIUA CAC TRANG (V9.52 - anh Luan: "vi tri dat de, cach thiet
   ke bo loc, noi chung chua dong bo trong thiet ke do em" / "gio la luc toi uu chuyen do roi") ----
   Do duoc 12 KIEU thanh cong cu khac nhau tren 33 trang: o tim khi thi dung dau, khi thi tut
   xuong hang hai sau dai chip. Chuan da chot, doc trai sang phai:
      [o tim] [dai chip loc]  ······  [so dong] [Xuat] [Bo loc] [Cot]
   Canh bang may: trang nao co CA o tim va chip loc thi O TIM PHAI DUNG TRUOC. */
(function(){
 var truoc=CUR,nguoc=[],dem=0;
 Object.keys(RENDER).forEach(function(k){
  CUR=k;var h="";try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  var iT=h.search(/<input[^>]*placeholder="Tìm trong trang/);
  /* CHI so voi CHIP LOC. Dai tab cua HUB (Chờ duyệt, CSKH, Học tập...) la DIEU HUONG - no
     dung tren cung la dung, giong nhau o moi hub, khong phai "khong dong bo". */
  var iC=-1,reC=/<button class="(?:segb|fbtn)[^"]*"[^>]*onclick="([^"]*)"/g,mC;
  while((mC=reC.exec(h))){if(/fset\(|toggleFilt\(|qfToggle\(|XLFILT|HTLOPQ|STFILT/.test(mC[1])){iC=mC.index;break}}
  if(iT<0||iC<0)return;
  dem++;
  if(iT>iC)nguoc.push(k)});
 CUR=truoc;
 t("da do >=10 trang co ca o tim va chip loc", dem>=10);
 t("o tim luon dung TRUOC dai chip loc"+(nguoc.length?" - NGUOC: "+nguoc.join(", "):""), nguoc.length===0);
 t("co ham o tim dung chung timHTML", typeof timHTML==="function"&&/placeholder="Tìm trong trang này/.test(timHTML("test")));
})();

/* ---- 6octies. KHONG NUT NAO LAM DUNG VIEC MA BAM TEN DA LAM (V9.52 - anh Luan: "nut them
   nhanh thua nhi, bam vao ten cung ra ma") ----
   Do duoc 14 nut "Xem nhanh" mo DUNG ngan keo ma link ten trong cung hang da mo. Mot hang 5 nut
   thi nut thu 5 chi to mat. */
(function(){
 var thua=[];
 Object.keys(LISTCFG||{}).forEach(function(k){
  var cfg=LISTCFG[k];if(!cfg||!cfg.act)return;
  CUR=k;var h="";try{h=renderList(k)}catch(e){return}
  var m=h.match(/<a class="lnk" onclick="([a-zA-Z]+)\('/);
  if(!m)return;
  var dich={openQuick:1,openStuQuick:1,leadDetail:1,openNSQuick:1,openLopQuick:1};
  cfg.act.forEach(function(a){
   if(!dich[a.fn]||!dich[m[1]])return;
   /* cung ho ham mo ngan keo xem nhanh -> nut nay lam dung viec cua link ten */
   if(a.fn==="openQuick"||a.fn===m[1])thua.push(k+": nút '"+a.lb+"'")})});
 t("khong nut nao lam dung viec cua link ten"+(thua.length?" - THUA: "+thua.slice(0,6).join(", "):""), thua.length===0);
})();

/* ---- 6sexies. DOAN GOI Y PHAI BIET NO NAM O DAU (V9.52 - anh Luan: "dung no o dau con ko
   biet, lam sao biet sua gi cho dung") ---- */
(function(){
 t("co bang GOIYO (doan nao hien o man nao)", typeof GOIYO==="object"&&Object.keys(GOIYO).length>=15);
 t("co bang GOIYPG (nut Xem tai cho)", typeof GOIYPG==="object"&&Object.keys(GOIYPG).length>=10);
 var thieu=Object.keys(GOIYDEF).filter(function(k){return !GOIYO[k]});
 t("moi doan goi y deu khai duoc man hinh"+(thieu.length?" - THIEU: "+thieu.join(", "):""), thieu.length===0);
 window.SETTAB="goiy";var hg="";try{hg=renderSettings()}catch(e){hg="LOI"}
 t("tab Doan goi y dung CHINH CAU do lam nhan, khong dung ma may", hg.indexOf("gy_")<0||hg.indexOf(">gy_")<0);
 t("tab Doan goi y co nut Xem tai cho", /Xem tại chỗ/.test(hg));
 t("tab Doan goi y giai thich the in dam", /in đậm/.test(hg));
 window.SETTAB="";
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

/* ---- 8. MONITOR TUNG CHUC DANH (V9.51 - anh Luan: "chu dong them monitor cua tung chuc danh,
   la nguoi ma ngoi lam viec truc tiep truoc man hinh de kiem... 1 nguoi dung binh thuong se co
   cam nhan kieu: sao thieu nut nay, bam cai nay roi xem lai o dau") ----
   Dong vai TUNG MA CHUC DANH co that trong DL01, vao dung duong gateEnter:
   (a) menu khong duoc MOI vao trang ma mo ra chi nhan cau tu choi "ngoai pham vi" - moi roi
       duoi con te hon khong moi (da do duoc 4 chuc danh dinh: HR/IT manager, HR leader,
       WOW leader);
   (b) khong muc menu nao mo ra mot trang trong tron. */
(function(){
 var daiDien={};
 rows("DL01").forEach(function(st){if(String(st.staff_id)==="ADMIN")return;
  var ma=ecode(st.role)||String(st.role);if(!daiDien[ma])daiDien[ma]=st});
 var moiDuoi=[],trong=[],soVai=0;
 Object.keys(daiDien).forEach(function(ma){
  var st=daiDien[ma];
  window.BLCLASS=null;window.HOSO=null;window.GVID=null;window.NVID=null;window.DUYTAB="";
  try{window.GATE_SID=st.staff_id;applyScope(st.staff_id);setRole("all")}catch(e){return}
  soVai++;
  NAVTREE.forEach(function(G){G.items.forEach(function(k){
   if(!navVis(k)||goAlias(k))return;
   CUR=k;var h="";
   try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):(RENDER[k]?RENDER[k]():"")}catch(e){return}
   if(/ngoài phạm vi/.test(h))moiDuoi.push(ma+":"+k);
   if(h.replace(/<[^>]*>/g,"").trim().length<80)trong.push(ma+":"+k)})})});
 window.GATE_SID="";applyScope("");setRole("all");
 /* V9.60: cổng nhân viên gom về đúng bộ phận của SOP nên số mã chức danh còn 18 (bỏ IT x2,
    bảo vệ, tạp vụ). Ngưỡng hạ theo, nhưng vẫn phải đủ lớn để chắc là đã đóng vai KHẮP các
    bộ phận chứ không phải chạy vài vai cho có. */
 t("da dong vai >=16 ma chuc danh ("+soVai+")", soVai>=16);
 t("menu khong moi vao trang tu choi 'ngoai pham vi'"+(moiDuoi.length?" - MOI DUOI: "+moiDuoi.slice(0,6).join(", "):""), moiDuoi.length===0);
 t("khong muc menu nao mo ra trang trong tron"+(trong.length?" - TRONG: "+trong.slice(0,6).join(", "):""), trong.length===0);
})();

/* ═══════ V9.54 - MỌI CON SỐ DẪN XUẤT PHẢI TỰ KHAI CÁCH TÍNH ═══════
   Anh Luân: "mấy con số như kiểu 95% là tính như thế nào, e ghi chú cụ thể ở hover cho anh".
   Lúc đo lần đầu: 305 con số phần trăm hiện trên màn thì 293 con không nói mình ở đâu ra.
   Bộ kiểm này vẽ THẬT mọi trang, tìm mọi con số %, và đòi mỗi con phải có chú thích - hoặc trên
   chính nó, hoặc trên ô bao nó. Chú thích tính-lúc-rê (data-tipfn) thì GỌI THẬT hàm rồi đọc kết
   quả: đếm thuộc tính chỉ biết có, không biết nó nói gì. */
(function(){
 var thieu=[],tong=0;
 Object.keys(RENDER).forEach(function(k){CUR=k;var h="";
  try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  var re=/<([a-z]+)([^>]*)>([^<]{0,30}?\d{1,3}%)/g,m;
  while((m=re.exec(h))){
   /* <option> la MOT LUA CHON, khong phai mot con so do duoc. "90%" trong o Ty le hien thi la
      cai nguoi dung CHON, khong phai ket qua tinh tu du lieu - doi no khai "cach tinh" la doi
      mot thu khong ton tai. Luat nay sinh ra tu cau hoi cua anh Luan ve KPI ("95% la tinh the
      nao"), nen giu dung pham vi ay. */
   if(m[1]==="option")continue;
   var attr=m[2]||"",truoc=h.slice(Math.max(0,m.index-420),m.index+60);tong++;
   var co=/data-tip="[^"]{10,}|title="[^"]{10,}/.test(attr)||/data-tip="[^"]{10,}"/.test(truoc);
   if(!co){var fn=(attr.match(/data-tipfn="([^"]+)"/)||[])[1],ta=(attr.match(/data-tipa="([^"]*)"/)||[])[1]||"";
    if(fn&&TIPFNS[fn]){try{co=String(TIPFNS[fn](ta.replace(/&quot;/g,'"').replace(/&amp;/g,"&").split("|"))||"").length>=15}catch(e){}}}
   if(!co)thieu.push(k+": "+m[3].trim())}});
 t("co du con so % de kiem (>=200)", tong>=200);
 t("moi con so % deu noi duoc cach tinh"+(thieu.length?" - THIEU "+thieu.length+": "+thieu.slice(0,6).join(", "):" ("+tong+" con)"), thieu.length===0);
 /* ba ham chung phai co that va tra dung dang - khong co chung thi 300 cho lai moi cho mot kieu */
 t("co ham chung sinh cau giai thich ty le", typeof pctG==="function"&&/^84% = 42\/50 buổi$/.test(pctG(42,50,"buổi")));
 t("mau so bang 0 thi noi ro chua tinh duoc", /chưa tính được/.test(pctG(0,0,"buổi")));
 t("co ham giai thich chi so KPI", typeof kpiGiai==="function"&&/Cách tính|Đang là/.test(kpiGiai("CVR")||""));
 t("co ham noi ro day la NGUONG chu khong phai so do", typeof nguongGiai==="function"&&/NGƯỠNG PHẢI ĐẠT/.test(nguongGiai("SRR","x")));
})();
/* ═══════ V9.54 - BÁNH RĂNG SỬA TẠI CHỖ, KHÔNG QUĂNG NGƯỜI DÙNG ĐI ═══════
   Anh Luân: "nếu đang ở 1 nơi nào đó, vẫn còn phải ở đó để làm, mà bị điều hướng đi thì hơi mệt."
   Bốn loại bánh răng phải mở ngăn kéo sửa tại chỗ, và ngăn kéo phải có ô sửa thật + nút Lưu. */
(function(){
 t("banh rang nguong CH2 mo ngan keo tai cho", /cfPop\('/.test(cfGear("slaLRT_minutes")));
 t("banh rang cau nhac CH4 mo ngan keo tai cho", /msgPop\('/.test(msgEditBtn("NA050")));
 t("banh rang danh muc CH1 mo ngan keo tai cho", /enumPop\('/.test(enumEditBtn("enum_lead_status")));
 t("chip SLA mo ngan keo tai cho", /cfPop\('/.test(slaChip("slaLRT_minutes",15)));
 t("chip nguong KPI mo ngan keo tai cho", /kpiPop\('/.test(kpiChip(/^CVR/,0.4,1)));
 ["cfPop","msgPop","kpiPop","enumPop","cfPopSave","msgPopSave","kpiPopSave","enumPopSave"].forEach(function(f){
  t("co ham "+f, typeof global[f]==="function")});
 t("ngan keo CH2 van chua loi mo trang Cai dat cho ai muon xem ca nhom", /cfGo\(/.test(String(cfPop)));
 t("luu xong thi ve lai dung man dang dung", /reRender\(CUR\)/.test(String(cfPopXong)));
})();
/* ═══════ V9.54 - MỖI CHẶNG PHẢI KHAI SẢN PHẨM ĐẦU RA ═══════
   Anh Luân: "hover vào a thấy chặng đã qua, nhưng qua là qua cái gì?" Mọi chặng chính phải khai
   được sản phẩm; hồ sơ đi tới đâu thì chặng đó phải kể ra được cái gì đã ghi lại. */
(function(){
 var chuaKhai=[];
 JMAIN.concat(JBRANCH).forEach(function(k){
  var co=false;
  jAll().slice(0,400).forEach(function(J){if(co)return;
   try{if(jReviewRows(J.C,k).length)co=true}catch(e){}});
  if(!co)chuaKhai.push(k)});
 t("moi chang deu khai duoc san pham dau ra"+(chuaKhai.length?" - CHUA KHAI: "+chuaKhai.join(", "):""), chuaKhai.length===0);
 var J0=jAll().filter(function(J){return J.k==="learning"})[0]||jAll()[0];
 if(J0){
  var d=jStagePop?null:null;
  t("co ngan keo tung chang", typeof jStagePop==="function");
  t("co ham tom tat san pham cho chu thich", typeof jOutSum==="function"&&jOutSum(J0.C,J0.k,2).length>0);
  t("co ham tinh thoi gian nam o mot chang", typeof jStageSpan==="function");
  /* Banh rang tro vao tham so KHONG CO THAT la banh rang chet - bam vao khong sua duoc gi.
     Da cắn: 3 chang khai ten CU (co trong PKEY) chu khong phai ten that trong CH2. */
  var khai={};APPPARAMS.forEach(function(pp){khai[pp[1]]=1});
  var pnLoi=JSTAGE.filter(function(sx){return sx.pn&&!khai[sx.pn]}).map(function(sx){return sx.k+"->"+sx.pn});
  t("chang nao khai han SLA thi ten tham so phai co that trong CH2"+(pnLoi.length?" - LOI: "+pnLoi.join(", "):""), pnLoi.length===0);
  var soPn=JSTAGE.filter(function(sx){return !!sx.pn}).length;
  t("it nhat 12 chang khai duoc han SLA cua minh", soPn>=12);
  /* Chang da qua ma khong tim ra moc ke tiep thi im, khong duoc noi "(toi gio)" */
  t("khong noi lao '(toi gio)' cho chang da roi tu lau", !/\(tới giờ\)/.test(jStageSpan(J0.C,"new",J0.k)||"")||J0.k==="new");
  var hj=(function(){var g="";openDrawer=function(t2,h2){g=h2};try{mstripOpen(J0.C.pid)}catch(e){}return g})();
  t("drawer hanh trinh ke san pham tung chang", /hvjo/.test(hj));
  t("drawer hanh trinh bam duoc vao tung chang", /jStagePop\(/.test(hj));
 }
})();
/* ═══════ V9.54 - Ô BẤM PHẢI NÓI THẬT NÓ SẼ LÀM GÌ ═══════
   Anh Luân: "nhiều cái thẻ, bấm vào nhảy trang khác, a thấy cũng bất tiện dữ lắm". Nhảy trang
   không phải lúc nào cũng sai - có ô bấm vào đúng là để sang chỗ làm việc. Cái sai là NÓI DỐI:
   ô ghi "bấm để lọc danh sách bên dưới" rồi lại đổi trang. Đo: ô nào onclick có go( mà chú thích
   vẫn hứa lọc tại chỗ. Thêm: tên người trong bảng phải mở ngăn kéo, không đổi trang. */
(function(){
 var doi=[],tenDoiTrang=[];
 Object.keys(RENDER).forEach(function(k){CUR=k;var h="";
  try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  var re=/<div class="bstat[^>]*onclick="([^"]*)"[^>]*data-tip="([^"]*)"/g,m;
  while((m=re.exec(h)))if(/go\(/.test(m[1])&&/lọc danh sách bên dưới/.test(m[2]))doi.push(k+": "+m[1]);
  var re2=/<a class="lnk"[^>]*onclick="(?:event\.stopPropagation\(\);)?(openNV|openGV|openKhoa|openLop|openHoso|jOpen)\(/g,m2;
  while((m2=re2.exec(h)))tenDoiTrang.push(k+": "+m2[1])});
 t("khong o thong ke nao hua loc tai cho roi lai doi trang"+(doi.length?" - NOI DOI: "+doi.slice(0,4).join(", "):""), doi.length===0);
 t("bam TEN trong bang thi mo ngan keo, khong doi trang"+(tenDoiTrang.length?" - CON: "+tenDoiTrang.slice(0,4).join(", "):""), tenDoiTrang.length===0);
 t("co ham doc onclick de noi dung no dan di dau", typeof bamDiDau==="function"&&/mở trang/.test(bamDiDau("go('wow')")));
 t("ham do phan biet duoc mo ngan keo vs doi trang", /ngay tại đây/.test(bamDiDau("openNSQuick('NV001')")));
})();
/* ═══════ V9.54 - HẰNG SỐ NGHIỆP VỤ KHÔNG ĐƯỢC CẮM CỨNG ═══════
   Anh Luân: "mọi thứ trên app phải tuân thủ cấu hình phải ko em". Đúng - và ba chỗ từng tự đặt
   số riêng trong mã (cổng học viên 85/80, bảng khối lượng việc 90/70, bảng cơ sở 20%). */
(function(){
 ["tkOntimeGood_pct","tkOntimeWarn_pct","riskRateRed_pct"].forEach(function(n){
  var co=false;APPPARAMS.forEach(function(p){if(p[1]===n)co=true});
  t("tham so "+n+" da khai trong CH2", co)});
 var src=String(RENDER.tranghv||"")+String(global.hvTienDo||"");
 t("cong hoc vien lay nguong chuyen can tu CH6 chu khong cam 85", !/attP>=85\b/.test(SRC));
 t("cong hoc vien lay nguong nop bai tu CH6 chu khong cam 80", !/hwP>=80\b/.test(SRC));
 t("bang khoi luong viec lay nguong tu CH2", !/p\.ontime>=90\b/.test(SRC));
 t("bang so sanh co so lay nguong nguy co tu CH2", !/rr>=20\b/.test(SRC));
})();
/* ═══════ V9.55 - THANG THIET KE: MOT VIEC MOT CACH ═══════
   Anh Luan: "kiem qua tung trang, tung man hinh xem co the toi uu thiet ke khong".
   Do bang may thay app khong co THANG nao ca: 202 ma mau (118 ma chi dung DUNG MOT LAN,
   26 sac trang khac nhau cho cung mot viec), 28 co chu (11 / 11.5 / 12 / 12.5 / 13 - nam buoc
   trong vong 2px, mat khong phan biet duoc nhung tay phai nho ca nam), 17 bo goc.
   Do la ly do nhin app "hoi lon xon" ma khong chi ra duoc cho nao sai: khong cho nao sai han,
   ca tram cho lech nhe. Gom ve thang chuan roi CHOT LAI o day. */
(function(){
 var CSS_ALL=require("fs").readFileSync(process.env.ITTS_OUT+"/ITTs_WebApp_v5_demo.html","utf8");
 function tap(re){var m={};(CSS_ALL.match(re)||[]).forEach(function(x){m[x]=1});return Object.keys(m)}
 var mau=tap(/#[0-9A-Fa-f]{6}/g).map(function(x){return x.toUpperCase()});
 var uniq={};mau.forEach(function(x){uniq[x]=1});
 var soMau=Object.keys(uniq).length;
 var soChu=tap(/font-size:\s*[0-9.]+px/g).length;
 var soGoc=tap(/border-radius:\s*[0-9]+px/g).length;
 t("bang mau khong phinh tro lai (<=110 ma, truoc 202): "+soMau, soMau<=110);
 t("thang co chu giu gon (<=16 buoc, truoc 28): "+soChu, soChu<=16);
 /* ═══ SAN CO CHU 11px (anh Luan 09/08: *"Cứ chọn 1 size hợp lý"*) ═══════════════════════════
    Do truoc khi chon, tren kho dien thoai 390px: **1.470 luot chu duoi 11px** tren 26 kieu -
    9px, 9.5px, 10px, 10.5px. Nhung khi CHUP SAT vao xem thi 10px doc rat ro o mat do diem anh
    that; em da NOI "10px kho doc" truoc khi NHIN, va noi sai.
    Van chon nang san, vi mot ly do khac va that hon: **tieng Viet co dau**. Dau nga, dau hoi,
    dau mu chong len nhau theo chieu DOC - co chu cang nho thi phan dau cang mat net, trong khi
    tieng Anh cung co chu ay van du. Mot app tieng Viet phai rong rai hon o day.
    Chon 11px chu khong phai 10 hay 12:
      · no DA LA mot bac co san trong thang (128 khai bao truoc khi doi) - nang len khong de bac moi;
      · gop luon bon bac 9 / 9.5 / 10 / 10.5 vao mot, thang tu 20 bac con 16 - dung huong ma bo
        kiem nay sinh ra de giu;
      · khop muc toi thieu 11pt cua huong dan giao dien iOS.
    Doi 117 khai bao CSS + 4 khai bao SVG. Do lai sau khi doi: `_checkmat` xanh tren CA HAI kho
    man (khong cho nao bi cat them), bieu do 31 nhan chu **0 cap chong nhau**.
    Tu day KHONG duoc de mot co chu nao duoi 11px lot vao lai. */
 var duoiSan=tap(/font-size:\s*(?:[0-9]|10)(?:\.[0-9]+)?px/g)
   .filter(function(x){return parseFloat(x.replace(/[^0-9.]/g,""))<11});
 var svgNho=tap(/font-size="(?:[0-9]|10)(?:\.[0-9]+)?"/g)
   .filter(function(x){return parseFloat(x.replace(/[^0-9.]/g,""))<11});
 t("khong co chu nao duoi san 11px (tieng Viet co dau, co nho la mat net dau)",
   !duoiSan.length&&!svgNho.length, duoiSan.concat(svgNho).join(", "));
 t("thang bo goc giu gon (<=10 buoc, truoc 17): "+soGoc, soGoc<=10);
 /* hai thanh cong cu phai cung mot bo do - dat canh nhau moi khong so le */
 var f=(CSS_ALL.match(/\.fbar\{([^}]*)\}/)||[])[1]||"";
 var tb=(CSS_ALL.match(/\.tbar\{([^}]*)\}/)||[])[1]||"";
 function lay(css,k){var m=css.match(new RegExp(k+":([^;]+)"));return m?m[1].trim():""}
 ["border-radius","padding","margin-bottom","gap"].forEach(function(k){
  t("thanh cong cu .fbar va .tbar cung "+k, lay(f,k)===lay(tb,k)&&lay(f,k)!=="")});
 /* nhip doc: panel khong duoc tu dat khoang cach, de CSS lo - moi trang mot nhip la thay lech */
 var tuDat=[];
 Object.keys(RENDER).forEach(function(k){CUR=k;var h="";
  try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  if(/class="panel"[^>]*style="[^"]*margin-bottom/.test(h))tuDat.push(k)});
 t("khong trang nao tu dat khoang cach duoi panel"+(tuDat.length?" - CON: "+tuDat.slice(0,5).join(", "):""), tuDat.length===0);
 /* mot kieu viet class nut - hai thu tu khac nhau la hai bien the cho cung mot nut */
 var loanNut=0;
 Object.keys(RENDER).forEach(function(k){CUR=k;var h="";
  try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  loanNut+=(h.match(/class="btn sm (primary|danger|green)"/g)||[]).length});
 t("class nut viet mot thu tu duy nhat (btn <mau> sm)", loanNut===0);
 /* ═══ HAI LUAT THANH PHAN CHOT LAI 14/08 ═══════════════════════════════════════════════════
    Anh Luan: *"kich thuoc nut cung trang ma lai chenh lech kieu nay thi lam sao ma dep duoc"*
    va *"do no cung 1 bang, e nen lam cho no tuong dong it nhat la ve kich thuoc"*.
    (1) Nut trong MOT o hanh dong phai co mot be rong SAN chung - do duoc 40/64 o co hai nut ma
        nhan chenh nhau qua 4 ky tu, nen hai nut rong khac han va ca cot rang cua doc xuong.
    (2) Lop nut nao khai trong CSS thi phai co cho GOI no - khai mot lop roi khong ai dung la mot
        loi hua chet nam lai vinh vien.
    GHI LAI MOT SAI CUA CHINH PHEP DO (2): ban dau em dem lop `.btn.hvcall-dark` tren MOT file
    (ban nhan vien) roi ket luan "ma chet" - trong khi no duoc goi o CONG HOC VIEN, mot file khac.
    *Dem tren mot nua pham vi roi ket luan cho ca pham vi la cach chac chan nhat de xoa nham mot
    thu dang chay.* Nay hoi tren MA NGUON, noi ca hai ban deu sinh ra tu do. */
 var sanNut=/\.rowact \.btn\{[^}]*min-width:\s*\d+px/.test(CSS_ALL);
 t("nut trong mot o hanh dong co be rong san chung (.rowact .btn min-width)", sanNut);
 var GENSRC="";try{GENSRC=require('fs').readFileSync(require('path').join(__dirname,'gen_v5.py'),'utf8')}catch(e){}
 var lopChet=[];
 (CSS_ALL.match(/\.btn\.[a-zA-Z][\w-]*(?=[{,: ])/g)||[]).forEach(function(m){
  var ten=m.slice(5);
  if(lopChet.indexOf(ten)>=0)return;
  /* Hoi tren NGUON: lop co the duoc ghep bang bien ("btn "+cls) hoac truyen vao mot ham
     (`hvCallHTML(..., "hvcall-dark")`) - do tren HTML dung mot ban se bo sot. */
  var re=new RegExp('["\'\\s]'+ten.replace(/[-]/g,"\\-")+'["\'\\s]');
  if(GENSRC&&!re.test(GENSRC))lopChet.push(ten)});
 t("khong lop nut nao khai trong CSS ma khong cho nao goi"+(lopChet.length?" - CHET: "+lopChet.slice(0,6).join(", "):""),
   lopChet.length===0);
})();
/* ═══════ V9.57 - THẺ PHẢI LÀ MỘT VIỆC PHẢI QUYẾT HÔM NAY ═══════
   Anh Luân: "thẻ phải đại diện cho 1 vấn đề quan trọng, xem nhanh và NGÀY NÀO CŨNG PHẢI XEM,
   nội dung quan trọng". Ví dụ ông chỉ ra: "63 của Tuyển sinh, bộ phận đông việc nhất" - xếp hạng
   theo TỔNG việc thì tháng nào cũng ra Tuyển sinh (đội đông nhất), một con số không đổi thì
   không có gì để quyết, mà nó vẫn chiếm chỗ của một thẻ đáng xem.
   Đo lần đầu: 137 thẻ, dọn còn 84. Ba lớp hỏng, nay cấm vĩnh viễn: */
(function(){
 /* (1) SỐ TÍCH LUỸ TRỌN ĐỜI - chỉ tăng, không bao giờ đòi một quyết định */
 var CAM_TICHLUY=[/^Tổng đã /i,/đã dạy xong/i,/đã soạn giáo án/i,/^Đã xử lý xong/i,
   /^Đã tái ghi danh/i,/ưu đãi đã cấp/i,/^HV đã tạo mã/i,/^Buổi hoàn thành/i,/^Bài đã chấm/i,
   /^Test đã chấm/i,/giờ kèm đã ghi nhận/i];
 /* (2) NGƯỠNG CẤU HÌNH đem làm thẻ - số này chỉ đổi khi có người vào Cài đặt sửa nó */
 var CAM_NGUONG=[/^Ngưỡng /i];
 /* (3) XẾP HẠNG THEO TỔNG - "đông việc nhất" luôn ra cùng một đội, vô nghĩa
        (xếp hạng theo QUÁ HẠN thì được: nó đổi mỗi ngày) */
 var CAM_XEPHANG=[/đông .* nhất/i,/nhiều nhất/i];
 var xau=[],tong=0;
 Object.keys(RENDER).forEach(function(k){CUR=k;var h="";
  try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  var re=/<div class="bsn">([^<]*)<\/div><div class="bsl">([\s\S]*?)<\/div>/g,m;
  while((m=re.exec(h))){
   tong++;
   var nhan=String(m[2]||"").replace(/<[^>]*>/g,"").split("·")[0].trim();
   if(!nhan)continue;
   CAM_TICHLUY.forEach(function(r){if(r.test(nhan))xau.push(k+": SỐ TÍCH LUỸ \""+nhan+"\"")});
   CAM_NGUONG.forEach(function(r){if(r.test(nhan))xau.push(k+": NGƯỠNG CẤU HÌNH \""+nhan+"\"")});
   CAM_XEPHANG.forEach(function(r){if(r.test(nhan)&&!/quá hạn/i.test(nhan))xau.push(k+": XẾP HẠNG THEO TỔNG \""+nhan+"\"")});
  }});
 t("co du the de kiem (>=60)", tong>=60);
 t("khong the nao la so tich luy / nguong / xep hang vo nghia"+(xau.length?" - CON: "+xau.slice(0,5).join(" | "):" ("+tong+" the)"), xau.length===0);
 /* Ô việc theo phòng ban phải BẤM ĐƯỢC - thấy "10 HV nguy cơ" mà không tới được danh sách
    thì con số đó chỉ làm người ta lo, không giúp người ta làm. */
 CUR="dashboard";var hd="";try{hd=RENDER.dashboard()}catch(e){}
 var oPb=(hd.match(/<div class="dstat[^"]*"/g)||[]).length;
 var oPbBam=(hd.match(/<div class="dstat[^"]*" onclick=/g)||[]).length;
 t("o viec theo phong ban deu bam duoc ("+oPbBam+"/"+oPb+")", oPb>0&&oPbBam===oPb);
 t("khoi phong ban da doi ten thanh bang VIEC, khong con la bang thanh tich", /Việc đang nợ theo phòng ban/.test(hd));
 /* Hai tham so nguong moi phai nam trong CH2, khong cam cung */
 ["viecOldAlert_days","svNudge_days"].forEach(function(n){
  var co=false;APPPARAMS.forEach(function(p){if(p[1]===n)co=true});
  t("tham so "+n+" da khai trong CH2", co)});
})();
/* ═══ V9.59 - HỆ THẺ CƯ XỬ NHƯ CỘT (anh Luân 31/07) ═══════════════════════════════════════
   *"mấy cái thẻ kia tại sao lại cố định nhỉ, sao ko phải như các cột... nó đâu cần phải bấm
   nhỉ... em làm tooltip ghi chú đầy đủ... Đưa nó vào cấu hình... Còn ẩn hiện, thì vừa có ở cài
   đặt, vừa có ở trực tiếp trang nhé."*
   Bốn lời hứa, canh cả bốn - và canh bằng cách CHẠY THẬT chứ không đọc chữ trong nguồn:
   1. mọi dải thẻ có mã khai trong THEDEF, số thẻ khai khớp số thẻ vẽ ra;
   2. thẻ không còn onclick;
   3. mỗi thẻ có chú thích, sửa được, sửa xong đọc lại đúng bản đã sửa;
   4. tắt một thẻ thì nó BIẾN MẤT thật, và nút "Thẻ (n/N)" đếm lại đúng. */
(function(){
 /* (1) trong NGUỒN: mọi lần gọi statStrip phải truyền mã dải - trừ bvStrip (hàng chờ việc theo
    chức danh, mỗi ô là một danh sách phải mở ra làm, không có bộ lọc nào thay được). */
 var thieuMa=[],curFn=null,fnDong=[];
 for(var i=0;i<L.length;i++){var mf=/^function ([A-Za-z0-9_]+)/.exec(L[i]);if(mf)curFn=mf[1];fnDong[i]=curFn}
 (function(){var re=/statStrip\(/g,m;
  while((m=re.exec(SRC))){
   var i=m.index;
   if(SRC.slice(Math.max(0,i-9),i)==="function ")continue;
   var dong=SRC.slice(0,i).split("\n").length-1;
   if(fnDong[dong]==="bvStrip")continue;
   /* `renderList` là hàm vẽ DÙNG CHUNG của mọi sổ, nên mã dải của nó không thể là một chuỗi
      viết cứng - nó truyền `key`, tức chính khoá trang đang vẽ. Bản khai vẫn đầy đủ và vẫn sửa
      được ở Cài đặt: mỗi trang danh sách khai thẻ ở `LISTCFG[k].the` và khai mã ở `THEDEF[k]`.
      Luật "mọi dải đều có mã khai" KHÔNG bị nới - chỉ là ở đây mã đến từ tham số, mà phép dò
      theo chữ trong mã nguồn thì không nhìn xuyên được một biến. Miễn trừ đúng một chỗ này,
      cùng lối đã dùng cho `bvStrip`. */
   if(fnDong[dong]==="renderList")continue;
   /* dò tới ngoặc đóng CÂN BẰNG rồi soi đối số cuối - lời gọi trải nhiều dòng, không cắt theo dòng được */
   var j=SRC.indexOf("(",i),d=0,k=j;
   while(k<SRC.length){if(SRC[k]==="(")d++;else if(SRC[k]===")"){d--;if(!d)break}k++}
   var than=SRC.slice(j+1,k);
   if(!/,\s*"[a-z_0-9]+"\s*(,[\s\S]*)?$/.test(than.trim()))thieuMa.push(fnDong[dong]+" (dong "+(dong+1)+")")}})();
 t("moi lan goi statStrip deu truyen ma dai"+(thieuMa.length?" - THIEU: "+thieuMa.slice(0,4).join(", "):""), thieuMa.length===0);

 /* (2) bản khai: mã duy nhất, thẻ nào cũng có chú thích */
 var all=theAll(),seen={},dup=[],noTip=[];
 all.forEach(function(x){var id=x[1][0];if(seen[id])dup.push(id);seen[id]=1;
  if(!theTip(id))noTip.push(id)});
 t("ma the duy nhat toan app ("+all.length+" the)"+(dup.length?" - TRUNG: "+dup.join(","):""), dup.length===0);
 t("the nao cung co cau chu thich"+(noTip.length?" - THIEU: "+noTip.slice(0,4).join(","):""), noTip.length===0);
 t("moi the co ten doc duoc de bay o Cai dat", all.every(function(x){return String(x[1][1]||"").trim().length>2}));
 /* chú thích phải nói được CÁCH XEM DANH SÁCH - đó là cái thay cho việc bấm vào thẻ */
 /* V9.99z12 - THEM "Danh sách:" VAO DANH SACH DAU HIEU. Anh Luan 06/08 chot van phong: app
    chuyen nghiep khong ke duong di bang chu, va khong viet "Muon xem danh sach: mo trang X o
    menu trai". 134 cho da doi sang dang gon "Danh sách: X › Y". Luat CU van dung nguyen - the
    khong bam duoc thi chu thich PHAI noi duoc cach xem danh sach - chi la cach viet doi.
    Bay da can ngay hom do: doi chu xong chay verify, bo nay do 4 the, trong khi ca 4 deu CO chi
    duong. Thuoc bat theo mot cum tu cu the thi doi cum tu la thuoc mu - phai sua thuoc cung luc
    voi sua chu, khong thi lan sau ai do se go bo chi duong that ma van xanh. */
 var khongChiCho=all.filter(function(x){return !/(Danh sách\s*:|Muốn xem|Rê chuột|Muốn chi tiết)/i.test(theTip(x[1][0]))}).map(function(x){return x[1][0]});
 t("chu thich the co chi cho xem danh sach o dau"+(khongChiCho.length?" - THIEU: "+khongChiCho.slice(0,4).join(","):""), khongChiCho.length===0);

 /* (3) CHẠY THẬT: đếm thẻ vẽ ra so với thẻ khai, ở mọi chức danh + mọi màn chi tiết */
 var LECH={},SEEN={},VE={},_ss=statStrip;
 global.statStrip=function(items,key,ids){
  if(key){SEEN[key]=1;var D=THEDEF[key];
   if(!D)LECH[key]="khong khai trong THEDEF";
   else if(ids){/* dải cắt bớt thẻ theo chức danh: mọi mã vẽ ra phải nằm trong bản khai */
    var kh={};D.the.forEach(function(t){kh[t[0]]=1});
    var la=ids.filter(function(x){return !kh[x]});
    if(la.length)LECH[key]="ma la: "+la.join(",");
    ids.forEach(function(x){VE[x]=1})}
   else if(D.the.length!==items.length)LECH[key]=items.length+" ve ra / "+D.the.length+" khai";
   else D.the.forEach(function(t){VE[t[0]]=1})}
  return _ss(items,key,ids)};
 function ve(f){try{f()}catch(e){}}
 /* Đóng vai THẬT từng nhóm chức danh: `setRole("tuvan")` không đổi phạm vi (nó nhận mã vai của
    bộ chọn demo, không phải nhóm), nên vòng cũ chỉ chạy đi chạy lại với quyền quản trị và dải
    bảng việc của 7 nhóm kia CHƯA TỪNG được vẽ. Dựng phạm vi bằng chính hàm app dùng. */
 var daNhom={};
 rows("DL01").forEach(function(st){var eff;try{eff=buildScope(ecode(st.role))}catch(e){return}
  if(!eff||daNhom[eff.group])return;daNhom[eff.group]=1;
  window.SCOPEEFF=eff;CURSTAFF=st.staff_id;
  var Ld=BVLAND[eff.group];
  if(Ld&&Ld[1]){if(Ld[0]==="tuyensinh")window.TSTAB=Ld[1];if(Ld[0]==="hoctap")window.HTTAB=Ld[1]}
  Object.keys(RENDER).forEach(function(p){CUR=p;ve(function(){RENDER[p]()})})});
 /* Nhom DU PHONG: khong nhan su nao mang vai do (IT/bao ve/tap vu da bo khoi cong), nhung
    duong ma van song - mot trung tam them vai moi ngay mai la roi vao day. Dong vai no bang
    mot ma vai chua khai, de dai the cua no cung duoc ve THAT. */
 (function(){var eff=buildScope("vai_chua_khai_bao");window.SCOPEEFF=eff;
  CURSTAFF=(rows("DL01")[0]||{}).staff_id;
  Object.keys(RENDER).forEach(function(p){CUR=p;ve(function(){RENDER[p]()})})})();
 window.SCOPEEFF=null;
 /* V2 - PHAI VE CA TRANG DANH SACH. Vong nay chi duyet `RENDER`, ma trang kieu DANH SACH khong
    co mat trong `RENDER` - chung ve bang `renderList`. O V1 chuyen do vo hai vi khong chuc danh
    nao dap xuong mot trang danh sach. Sang V2 co: ACA dap xuong `lop`, marketing dap xuong
    `nhaplead` - va bang viec cua ho nam o do. Khong ve thi sau THE cua ho (bv_aca_*, bv_mk_*)
    bi cham la "khai ma khong bao gio ve ra", tuc thuoc bao do mot thu app dang lam dung.
    LUAT: mot vong lap "di qua moi trang" ma chi doc MOT bang dang ky thi moi trang nam ngoai
    bang do deu la vung toi - cung ho voi bai hoc `_checkmat` da rut ve trang `viec`. */
 var TRANGDS=PAGES.filter(function(x){return x.ty==="list"}).map(function(x){return x.k});
 function veTrang(p){CUR=p;
  if(TRANGDS.indexOf(p)>=0)ve(function(){renderList(p)});
  else if(RENDER[p])ve(function(){RENDER[p]()})}
 ["quantri","tuvan","hocvu","giaovien","wow","ketoan","marketing","hotro","dieuhanh"].forEach(function(r){
  try{setRole(r)}catch(e){}
  try{CURSTAFF=(rows("DL01")[0]||{}).staff_id}catch(e){}
  Object.keys(RENDER).concat(TRANGDS).forEach(veTrang)});
 try{setRole("all")}catch(e){}
 rows("DL01").forEach(function(s){CURSTAFF=s.staff_id;ve(function(){myKpiHTML()});
  window.GVID=s.staff_id;ve(function(){renderHosoGV()});
  window.NVID=s.staff_id;ve(function(){renderHosoNV()})});
 rows("DL05").forEach(function(c){window.KHID=c.course_id;ve(function(){renderHosoKhoa()})});
 /* các dải nằm trong TAB con, không gọi tới qua RENDER[trang] - phải gọi thẳng hàm vẽ tab */
 ["renderNhatky","renderReupTab","renderTrangHV","renderHtToday","tkReport","renderCong","renderDuthu"]
  .forEach(function(f){ve(function(){global[f]()})});
 Object.keys(RENDER).concat(TRANGDS).forEach(veTrang);
 var chuaChay=Object.keys(THEDEF).filter(function(k){return !SEEN[k]});
 t("so the khai khop so the ve ra o moi dai"+(Object.keys(LECH).length?" - LECH: "+JSON.stringify(LECH):" ("+Object.keys(SEEN).length+" dai)"), Object.keys(LECH).length===0);
 t("khong co dai the khai thua (dai nao cung chay that)"+(chuaChay.length?" - CHUA CHAY: "+chuaChay.join(","):""), chuaChay.length===0);
 /* V2 - DAI THE CUA BANG VIEC CHI VE O TRANG DAP CUA CHINH NGUOI DO. Muon thay no thi phai
    DONG VAI THAT roi mo dung trang ay. Hai vong tren dung `setRole` - no moi cat pham vi du
    lieu, CHUA DAT DANH TINH, nen `bangViecHTML` khong nhan ra "day la trang dap cua toi" va
    tra ve rong. Day la lan thu BA du an can dung cai bay nay (truoc do: `_checkreset` va
    `_checktour` deu dung `applyScope` roi do ra 0 va to oan app).
    Cua vao THAT cua app la `gateEnter(sid)` - hoi thang no. */
 Object.keys(ROLESCOPE).forEach(function(g){
  var rs0=ROLESCOPE[g];if(!rs0||!rs0.match)return;
  var ng=rows("DL01").filter(function(x){return staffActive(x)&&rs0.match.test(String(x.role||""))})[0];
  if(!ng)return;
  try{gateEnter(ng.staff_id)}catch(e){return}
  var lp="";try{lp=SCOPE().land||""}catch(e){}
  if(lp)veTrang(lp)});
 try{gateEnter("")}catch(e){}
 try{setRole("all")}catch(e){}
 var theChet=all.filter(function(x){return !VE[x[1][0]]}).map(function(x){return x[1][0]});
 t("khong co THE khai ma khong bao gio ve ra"+(theChet.length?" - CHET: "+theChet.slice(0,6).join(","):" ("+Object.keys(VE).length+" the)"), theChet.length===0);
 global.statStrip=_ss;

 /* (4) thẻ trên trang KHÔNG bấm được, và dải nào cũng có nút "Thẻ (n/N)" */
 var coOnclick=[],thieuNut=[],soDai=0;
 Object.keys(RENDER).forEach(function(k){CUR=k;var h="";
  try{h=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  var re=/<div class="bstatsw" data-thekey="([a-z_]+)">([\s\S]*?)<div class="bstats"/g,m;
  while((m=re.exec(h))){soDai++;
   if(!/Thẻ \(\d+\/\d+\)/.test(m[2]))thieuNut.push(k+"/"+m[1])}
  var re2=/<div class="bstat ro"[^>]*>/g,m2;
  while((m2=re2.exec(h)))if(/onclick/.test(m2[0]))coOnclick.push(k)});
 t("dai the tren trang deu co nut Thẻ (n/N) de an/hien ("+soDai+" dai)"+(thieuNut.length?" - THIEU: "+thieuNut.slice(0,4).join(","):""), soDai>0&&thieuNut.length===0);
 t("the tren trang khong con bam duoc"+(coOnclick.length?" - CON BAM: "+coOnclick.slice(0,4).join(","):""), coOnclick.length===0);
 /* CHÚ THÍCH KHÔNG ĐƯỢC CHỈ VÀO CHỖ KHÔNG CÓ. Câu chú thích thay hẳn cho việc bấm thẻ, nên nó
    phải gọi đúng tên cái chip / cái nhóm CÓ THẬT trên chính trang đó. Đã cắn ngay trong bản này:
    bỏ nút "Chỉ quá hạn" đi mà chú thích vẫn bảo người ta bấm nó. Chỉ người ta tới một cái nút
    không tồn tại còn tệ hơn không chú thích gì. */
 var chiBay=[];
 Object.keys(RENDER).forEach(function(k){var o="";
  try{o=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  /* Phải BÓC HẾT data-tip ra trước khi tìm: chính câu chú thích cũng nằm trong HTML của trang,
     nên tìm trên nguyên trang thì câu nào cũng tự chứng minh được cho mình. Thử phá lần đầu
     không nổ chính vì cái bẫy này - một bộ kiểm không bao giờ cắn thì không phải bộ kiểm. */
  var oSach=o.replace(/data-tip="[^"]*"/g,"");
  var re=/data-the="([a-z0-9_]+)"/g,m;
  while((m=re.exec(o))){var tip=theTip(m[1]);
   var q=/(?:bấm chip|bấm nút|nhóm) ['\u2018]([^'\u2019]{2,40})['\u2019]/g,mm;
   while((mm=q.exec(tip)))if(oSach.indexOf(mm[1])<0)chiBay.push(k+"/"+m[1]+': "'+mm[1]+'"')}});
 t("chu thich the khong chi vao chip/nhom KHONG CO tren trang"+(chiBay.length?" - CHI BAY: "+chiBay.slice(0,5).join(" | "):""), chiBay.length===0);

 /* (5) TẮT một thẻ thì nó biến mất THẬT và nút đếm lại đúng - không tin lời khai, đo trên HTML */
 (function(){
  var k="viec",id=THEDEF[k].the[0][0],tong=THEDEF[k].the.length;
  CUR=k;var truoc="";try{truoc=RENDER[k]()}catch(e){}
  var coTruoc=truoc.indexOf('data-the="'+id+'"')>=0;
  /* Hoi DUNG dai the cua trang nay (`data-thek`), khong lay chuoi "The (n/m)" dau tien: tu
     14/08 trang Viec hom nay mang HAI dai the (dai cua no + bang viec theo chuc danh), lay cai
     dau tien la do nham dai kia. */
  var reDem=new RegExp('data-thek="'+k+'"[^>]*>[\\s\\S]{0,400}?Thẻ \\((\\d+)\\/(\\d+)\\)');
  var demTruoc=reDem.exec(truoc);
  DATA.config=DATA.config||{};DATA.config.theHide=DATA.config.theHide||{};
  DATA.config.theHide[id]=1;
  var sau="";try{sau=RENDER[k]()}catch(e){}
  var coSau=sau.indexOf('data-the="'+id+'"')>=0;
  var demSau=reDem.exec(sau);
  delete DATA.config.theHide[id];
  t("truoc khi tat: the co mat va nut dem du "+tong, coTruoc&&demTruoc&&+demTruoc[1]===tong&&+demTruoc[2]===tong);
  t("tat mot the thi the do BIEN MAT khoi trang that", coTruoc&&!coSau);
  t("tat mot the thi nut dem lui mot ("+(demSau?demSau[1]+"/"+demSau[2]:"?")+")", !!demSau&&+demSau[1]===tong-1&&+demSau[2]===tong);
 })();

 /* (6) sửa chú thích ở Cài đặt là đọc lại đúng bản đã sửa, và trả về mặc định được */
 (function(){
  var id=THEDEF.viec.the[0][0],goc=theTip(id);
  theTipLuu(id,"CAU THU CUA ANH LUAN");
  t("sua chu thich the thi doc lai dung ban da sua", theTip(id)==="CAU THU CUA ANH LUAN");
  t("app biet the nay da bi sua chu thich", theTipSua(id)===true);
  theTipLuu(id,"");
  t("tra chu thich the ve mac dinh duoc", theTip(id)===goc&&theTipSua(id)===false);
 })();

 /* (7) hai nửa "vừa có ở cài đặt, vừa có ở trực tiếp trang" phải cùng tồn tại */
 var stTabs=setTabs().map(function(x){return x[0]});
 t("Cai dat co tab The", stTabs.indexOf("the")>=0);
 t("tab The co ban khai gioi thieu (SETMOTA)", !!SETMOTA.the);
 CUR="settings";window.SETTAB="the";var hs="";try{hs=RENDER.settings()}catch(e){}
 t("tab The trong Cai dat liet ke duoc the", (hs.match(/id="the_[a-z_]+"/g)||[]).length>=40);
 t("tab The trong Cai dat co o tich an/hien tung the", (hs.match(/onclick="theToggle\(/g)||[]).length>=40);
 t("tab The trong Cai dat co nut Luu chu thich", /theTipLuu\(/.test(hs));
 window.SETTAB="";
 /* (8) lựa chọn ẩn/hiện phải nằm trong CẤU HÌNH (đi theo CFKEY) chứ không nằm trong dữ liệu demo */
 t("an/hien the ghi vao DATA.config (khong mat khi reset du lieu demo)", /c\.theHide=c\.theHide\|\|\{\}/.test(String(theToggle)));
 t("chu thich the ghi vao DATA.config", /c\.theTip=c\.theTip\|\|\{\}/.test(String(theTipLuu)));
})();
/* ═══ V9.59 - CHỮ "ROOM" KHÔNG ĐƯỢC HIỆN RA NỮA ═══════════════════════════════════════════
   Anh Luân: *"lát e bỏ hết mấy cái thông tin liên quan đến room đi, mặc định thì vẫn có thể kết
   nối demo trên nhiều máy, e ko cần hiện ra làm gì nữa."*
   Hai vế, canh cả hai: KHÔNG hiện ra chữ "room" nào, nhưng cỗ máy đồng bộ phải CÒN SỐNG.
   Canh cả hai mới đúng - bỏ hiển thị mà tiện tay bỏ luôn cơ chế thì lần sau mở hai máy không
   thấy đồng bộ, và không ai biết vì sao.

   V9.99m ĐỔI MỘT VẾ, có lý do: vế cũ đòi "còn TỰ BẬT" (`roomOffFlag()===false`). Anh Luân đưa
   link demo cho cả công ty xem, mà tự bật nghĩa là hai chục người dùng CHUNG một bộ dữ liệu -
   một người điểm danh thì tất cả thấy đổi theo, một người bấm "Dựng lại demo" thì tất cả bị
   tải lại trang. Nay mặc định TẮT, và bù lại đúng cái mà bản cũ thiếu: một cửa bật/tắt NHÌN
   THẤY ĐƯỢC ở Cài đặt > Giao diện. Vế "còn sống" giữ nguyên - và thêm một vế mới: phải có cửa
   bật lại, nếu không thì đây là gỡ tính năng chứ không phải đổi mặc định. */
(function(){
 /* KHÔNG được nuốt lỗi vẽ. Đã cắn ngay trong bản này: bỏ `roomBtnHTML` mà sót một chỗ gọi ->
    màn Cài đặt ném lỗi -> `catch` nuốt -> HTML rỗng -> "không còn chữ room" BÁO XANH trong khi
    màn đó đang gãy. Trang vẽ lỗi phải tính là ĐỎ, không phải là sạch. */
 var bay=[];
 Object.keys(RENDER).forEach(function(k){var o="";
  try{o=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){bay.push(k+" VE LOI: "+e.message);return}
  if(/[Rr]oom/.test(o))bay.push(k)});
 ["demo","tongquan"].forEach(function(tb){window.SETTAB=tb;var o="";
  try{o=RENDER.settings()}catch(e){bay.push("settings/"+tb+" VE LOI: "+e.message)}
  if(/[Rr]oom/.test(o))bay.push("settings/"+tb)});
 window.SETTAB="";
 try{if(/[Rr]oom/.test(gateStatusHTML()))bay.push("man dang nhap")}catch(e){}
 t("khong man nao con hien chu 'room'"+(bay.length?" - CON: "+bay.slice(0,5).join(", "):""), bay.length===0);
 t("ham ve chip/nut room da xoa han, khong de lai code chet",
   typeof roomStatus==="undefined"&&typeof roomBtnHTML==="undefined");
 t("co che dong bo nhieu may VAN CON (khong ai tien tay go mat)",
   typeof roomAuto==="function"&&typeof roomCast==="function"&&typeof roomCastState==="function"&&typeof roomToggle==="function");
 t("dong bo nhieu may MAC DINH TAT - moi nguoi xem demo mot bo du lieu rieng",
   typeof dongBoOn==="function"&&dongBoOn()===false&&roomOffFlag()===true,
   "tu bat lai la ca cong ty dung chung mot bo du lieu");
 (function(){window.SETTAB="brand";var o="";   /* ma tab la "brand"; "giaodien" la ten NHOM tab */
  try{o=RENDER.settings()}catch(e){}
  window.SETTAB="";
  t("co cua BAT LAI dong bo nhieu may trong Cai dat > Giao dien",
    /roomToggle\(\)/.test(o)&&/Đồng bộ nhiều máy/.test(o),
    "doi mac dinh ma khong chua cua bat lai thi la go tinh nang");})();
})();
/* ═══ V9.60 - GIỌNG GHI CHÚ NỘI BỘ KHÔNG ĐƯỢC LỌT RA MÀN HÌNH ═════════════════════════════
   Anh Luân 31/07: *"e đừng có viết ghi chú riêng của em vào thẳng app: 'SOP chưa có bảng cho kế
   toán - đây là phần em bổ sung, giữ đúng tinh thần bốn con số đầu ca.' viết thế này lúc demo
   nó kỳ lắm."*
   Đúng. Chữ trên màn là để NGƯỜI DÙNG làm việc, không phải chỗ ghi lại người viết đã nghĩ gì.
   Bản khai vì sao làm thế thì để ở chú thích mã nguồn và ở nhật ký - hai chỗ đó không ai demo.
   Danh sách dưới đây bắt ĐÚNG giọng đó, không bắt từ đơn lẻ: "em" nằm trong "Xem", "bổ sung"
   nằm trong một câu hướng dẫn bình thường - bắt rộng quá thì bộ kiểm thành phiền nhiễu rồi bị
   tắt, mà một bộ kiểm bị tắt thì bằng không có. */
(function(){
 var GIONG=[/\bem\s+(?:bổ sung|thêm|làm|viết|để|dựng)/i, /phần em\b/i, /của em\b/i,
   /anh Lu[\u00e2a]n/i, /SOP ch[u\u01b0]a c[o\u00f3] b[a\u1ea3]ng/i, /SOP kh[o\u00f4]ng c[o\u00f3] b[a\u1ea3]ng/i,
   /b[o\u1ed9] ki[e\u1ec3]m/i, /\bV9\.\d/, /gen_v5/i, /_check\d/i, /demo_data_big/i,
   /* V9.63 (anh Luan: *"chua ban duoc la chua ban duoc, em la app ma em gan cam than vao sao
      duoc"*): app noi SU THAT, khong binh luan, khong dua. "chua ban duoc dong nao" / "Nhe
      nhang!" la giong nguoi ke chuyen chu khong phai giong mot he thong van hanh. */
   /* V9.63 (anh Luan: *"dung dung chu em, ma dung hoc vien"*): app khong goi hoc vien la "em" -
      goi dung danh xung nghiep vu. Chu "em" trong NOI DUNG do chinh hoc vien viet thi khong tinh,
      nen chi soi chu cua APP: nhan, cau nhac, loi giai thich. */

   /\u0111[o\u1ed3]ng n[a\u00e0]o/i, /Nh[e\u1eb9] nh[a\u00e0]ng!/i, /g[i\u00ec] c[a\u1ea3]!/i,
   /ngon l[a\u00e0]nh/i, /th[a\u1ea3]nh th[o\u01a1]i/i, /kh[o\u1ecf]e re/i, /s[a\u1ea1]ch bong/i];
 var bay=[];
 function soi(nhan,h){
  if(!h)return;
  var txt=String(h).replace(/<script[\s\S]*?<\/script>/g,"").replace(/<[^>]*>/g," ");
  var tip=(String(h).match(/data-tip="([^"]*)"/g)||[]).join(" ");
  [txt,tip].forEach(function(t){t.replace(/\s+/g," ").split(/(?<=[.!?])\s+/).forEach(function(c){
   c=c.trim(); if(c.length<10)return;
   GIONG.forEach(function(r){if(r.test(c)){var k=c.slice(0,90);if(bay.indexOf(nhan+": "+k)<0)bay.push(nhan+": "+k)}})})});
 }
 var xong={};
 rows("DL01").forEach(function(st){var eff;try{eff=buildScope(ecode(st.role))}catch(e){return}
  if(!eff||xong[eff.group])return;xong[eff.group]=1;
  window.SCOPEEFF=eff;CURSTAFF=st.staff_id;
  var vis=PAGES.filter(function(p){return !p.hide&&(eff.pages==="*"||eff.pages.indexOf(p.k)>=0)});
  vis.forEach(function(p){CUR=p.k;
   try{soi(eff.group+"/"+p.k,(PBK[p.k]&&PBK[p.k].ty==="list")?renderList(p.k):(RENDER[p.k]?RENDER[p.k]():""))}catch(e){}})});
 window.SCOPEEFF=null;
 t("khong cau ghi chu noi bo nao lot ra man hinh"+(bay.length?" - CON: "+bay.slice(0,4).join(" | "):""), bay.length===0);
})();
 /* V9.63 (anh Luan: *"dung dung chu em, ma dung hoc vien"*) - canh o MA NGUON chu khong tren
    man hinh: tren man hinh co ca chu do CHINH HOC VIEN viet (noi dung yeu cau ho gui len), bo
    kiem khong tach duoc hai thu do. Trong ma nguon thi tach duoc: chuoi nao la chu cua app.
    Tru 6 o goi y trong cong hoc vien - do la vi du ve loi CUA HOC VIEN, "em" o do la dung. */
 (function(){
  /* doc THANG gen_v5.py: _APP.js co ca DU LIEU demo nhung day (loi hoc vien tu viet, cam nhan
     hoc vien...) - quet o do thi khong tach duoc chu cua APP voi chu cua NGUOI DUNG. */
  var SRCV=require('fs').readFileSync('./gen_v5.py','utf8').replace(/\/\*[\s\S]*?\*\//g,"");
  SRCV=SRCV.split("\n").filter(function(l){return l.trim().charAt(0)!=="#"}).join("\n");
  var xau=[],re=/"([^"\\\n]{4,400})"/g,m;
  while((m=re.exec(SRCV))){var ch=m[1];
   if(/vd: em |vd: e/.test(ch))continue;   /* vi du ve LOI CUA HOC VIEN trong o nhap - "em" o day la dung */
   if(/(^|[\s(])em([\s.,;:)]|$)/.test(ch))xau.push(ch.slice(0,70))}
  t("app KHONG goi hoc vien la 'em' trong bat ky chuoi nao"+(xau.length?" - CON "+xau.length+": "+xau.slice(0,2).join(" | "):""), xau.length===0);
 })();

/* ---- 12. CUA NAO CUNG PHAI DAN TOI MOT TRANG CO CHO DUNG (V9.99m) --------------------------
   Vi sao co muc nay: go V6 xong, luat "den xanh tren mot phep do da mat" lap tuc co dat dien.
   Ba cua trong ban V5 van goi go('ban') - trang Ban lam viec cua V6. Khong bo kiem nao hoi
   "cua nay dan toi dau", nen neu mai kia trang do bi go THAT thi ba cua ay chet lang le:
   khong bao loi, chi la bam vao khong co gi xay ra (go() gap PBK[key] rong thi return im).
   Phep do: gom moi dich go('X') trong ma nguon, chay qua dung cac bang remap cua go(), roi
   hoi hai cau - trang co ton tai trong PBK khong, va no co CHO DUNG khong (co mat tren menu,
   hoac la trang chi tiet mo ra tu mot so - loai thu hai phai KHAI RO kem ly do doc duoc). */
(function(){
 var CO={};
 NAVTREE.forEach(function(g){(g.items||[]).forEach(function(k){CO[k]=1})});
 for(var k in NAVSUB)CO[k]=1;
 /* V2 08/08 - MƯỜI SÁU CUỐN SỔ CHỈ-ĐỌC VÀO SAU CỬA `tracuu`. Chúng không còn mục menu RIÊNG,
    nhưng vẫn có CHỖ ĐỨNG trên bản đồ: cửa `tracuu` đứng trên menu và trang ấy bày đủ cả mười
    sáu, có ô tìm. Anh Luân 08/08 giao quyết số trang; chốt: không bớt trang nào, bớt số trang
    MỘT NGƯỜI PHẢI NHÌN - menu CEO 60 xuống 44. Đây là "có cửa cha", không phải "ngõ cụt". */
 if(typeof SOTRACUU!=="undefined")SOTRACUU.forEach(function(k){CO[k]=1});
 [TSMAP,CSMAP,HTMAP,KMAP,DUYMAP,ARCMAP].forEach(function(M){for(var k in M)CO[k]=1});
 ["tuyensinh","cskh","hoctap","khac","duyet","chang","hanhtrinh","bangcong"].forEach(function(k){CO[k]=1});
 /* TRANG CHI TIET: khong co muc menu rieng, va dung nhu the. Mo ra tu mot dong trong so; go()
    giu muc menu cu sang mo (NAVFROM) nen nguoi dung khong mat dau minh dang o nhanh nao.
    Moi dong duoi day phai noi duoc MO RA TU DAU - khong khai duoc thi la ngo cut. */
 var CHITIET={
  hoso:"ho so mot hoc vien - mo tu So hoc vien va tu moi bang viec",
  hosogv:"ho so mot giang vien - mo tu so Giang vien",
  hosonv:"ho so mot nhan vien - mo tu so Nhan vien va man Nhan su",
  hosokhoa:"ho so mot khoa hoc - mo tu so Khoa hoc",
  baitap:"bai tap cua mot lop - mo tu Van hanh lop va tu so Bai tap",
  banglop:"van hanh MOT lop - mo tu mot dong o trang Lop hoc (V2 RB3: cha truoc con). Trong trang "+
   "van co o xo chon nhanh lop khac, nen vao roi khong bi ket o mot lop. "+
   "(14/08: nay CO ca muc menu rieng - no duoc khai la man lam viec cua chang 2 ma khong co loi "+
   "vao tren sidebar. Dong khai nay giu lai vi trang van con nhieu cua mo tu cho khac.)",
  ychv:"Hoc vien lien he - tu 14/08 la BI DANH, `go('ychv')` remap sang tab 'Tu hoc vien' cua "+
   "Giao viec. Giu khoa trang de moi loi cu (o canh bao, nhip ngay, bang viec, link da gui) khong chet.",
  diemdanh:"diem danh MOT buoi cua MOT lop - mo tu nut 'Diem danh lop nay' o Van hanh lop va tu "+
   "the buoi hoc. No luon di kem mot lop cu the (window.DDCLASS), khong co nghia khi dung mot minh, "+
   "nen khong dat muc menu rieng.",
  chay:"chay quy trinh cho mot ho so - mo tu Trang bat dau va tab Cham lai",
  nhansu:"man khoi luong nhan su - mo tu the va tu Tro ly",
  ban:"Ban lam viec theo thuc the - o ban V5 la trang chi tiet mo tu So phu huynh va tu Tro ly; "+
   "no la man CHINH cua ban V6 da ngung phat hanh, nen khong co muc menu rieng o V5"
 };
 /* Doc _APP.js chu khong doc gen_v5.py: chu thich trong nguon co nhac ten cua ("4 cho dang goi
    go('bangcong')") - dem ca chu thich thi bo kiem di canh mot cai cua khong ton tai. */
 var JS=require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8');
 var dem={},re=/go\(\s*(?:\\?['"])([a-zA-Z0-9_]+)(?:\\?['"])/g,m;
 while((m=re.exec(JS)))dem[m[1]]=(dem[m[1]]||0)+1;
 var chet=[],vodanh=[];
 Object.keys(dem).forEach(function(k){
  if(!PBK[k]){chet.push(k+" ("+dem[k]+" cua)");return}
  if(!CO[k]&&!CHITIET[k])vodanh.push(k+" ("+dem[k]+" cua)");
 });
 t("moi cua go() deu tro toi mot trang CO THAT"+(chet.length?" - CHET: "+chet.join(", "):""),
   chet.length===0, "bam vao khong co gi xay ra, khong mot cau bao");
 t("trang khong co muc menu deu duoc khai la trang chi tiet"+(vodanh.length?" - CHUA KHAI: "+vodanh.join(", "):""),
   vodanh.length===0, "trang khong co cho dung ma cung khong khai ly do");
 /* Khai thua cung la sai: khai mot trang la "chi tiet" roi go han trang do di thi ban khai
    nam lai vinh vien, va lan sau khong ai biet dong do da vo nghia. */
 var thua=Object.keys(CHITIET).filter(function(k){return !PBK[k]||!dem[k]});
 t("ban khai trang chi tiet khong con dong nao thua"+(thua.length?" - THUA: "+thua.join(", "):""),
   thua.length===0, "khai mot trang khong con cua nao tro toi, hoac khong con ton tai");
})();

/* ---- 13. NHOM NAO CUNG PHAI KHAI PHAM VI DU LIEU (V9.99m) ---------------------------------
   Bay da can that: nhom "nhansu" khong co dong nao trong DSDEF, `dsLevel` roi ve DSDEF.quantri,
   thanh ra Truong phong Nhan su nhin thay tron 82 hoc vien va 190 lead - bang dung Quan tri
   vien - trong khi menu cua ho khong co mot trang hoc vien nao. Go vao Tro ly ten mot hoc vien
   la ra ho so kem cong no. Khong bo kiem nao hoi cau "nhom nay da khai pham vi chua".
   Ba phep: moi nhom trong ROLESCOPE phai co dong DSDEF · luoi do phai la nhom HEP nhat, khong
   phai quan tri · va do THAT: nhom khong duoc dung du lieu ma menu cua ho khong cho mo. */
(function(){
 var thieu=Object.keys(ROLESCOPE||{}).filter(function(g){return !DSDEF[g]});
 t("moi nhom chuc danh deu co dong khai pham vi du lieu"+(thieu.length?" - THIEU: "+thieu.join(", "):""),
   thieu.length===0, "nhom quen khai se thua huong pham vi cua luoi do");
 t("luoi do cua dsLevel la nhom HEP nhat, khong phai quan tri",
   /DSDEF\[\(g\|\|""\)\.replace\(\/_mgr\$\/,""\)\]\|\|DSDEF\.hotro/.test(SRC),
   "roi ve quantri nghia la quen khai = duoc thay tat ca");
 /* Do THAT: nhom nao khong co trang hoc vien tren menu thi cung khong duoc thay dong DL09 nao. */
 var ro=[];
 Object.keys(ROLESCOPE||{}).forEach(function(g){
  var nv=(DL.DL01||[]).filter(function(x){return staffActive(x)&&ROLESCOPE[g].match&&ROLESCOPE[g].match.test(ecode(x.role)||"")})[0];
  if(!nv)return;
  window.GATE_SID=nv.staff_id;applyScope(nv.staff_id);setRole("all");
  /* CHI dem nhung trang BAY RA HO SO HOC VIEN. Ban dau ke ca "viec" va "duyet" - hai trang moi
     chuc danh deu co, nen phep do luon xanh va khong bao gio cắn duoc gi. */
  var coTrangHV=PAGES.filter(function(p){return !p.hide&&canSee(p.k)})
    .some(function(p){return /^(hocvien|hoso|dsphuhuynh|banlam|tuyensinh|hoctap|banglop|diemdanh|cskh|ketthuc|khac|ban|chang|hanhtrinh|dsthanhtoan|xeplop|wow|test|tuvan|thanhtoan|baitap|buoihoc|review|ghinhan|khieunai|baoluu|magioithieu)$/.test(p.k)});
  var soHV=0;try{soHV=srows("DL09").length}catch(e){}
  if(!coTrangHV&&soHV>0)ro.push(g+" ("+nv.full_name+"): thay "+soHV+" hoc vien ma khong co trang nao mo duoc");
 });
 window.GATE_SID="";applyScope("");setRole("all");
 t("khong nhom nao thay du lieu hoc vien ma menu khong cho mo"+(ro.length?" - RO: "+ro.join(" | "):""),
   ro.length===0, "Tro ly va tim kiem van doc duoc du lieu do");
})();

/* ═══ 14. CHU HUONG DAN KHONG DUOC CHI DUONG BANG TEN DA CHET (V9.99z) ══════════════════════
   Anh Luan 05/08: *"em kiem tra lai may cai tooltip huong dan nhe, coi co cai gi loi thoi ko"*.
   Do duoc ngay: bon tooltip cua bang viec van ghi *"mo trang Giao viec o menu trai, tab Viec
   cua toi"* - ma trang do da doi ten thanh "Quan ly viec giao & nhan" va viec chua nhan nay co
   TAB RIENG. Chi duong bang mot cai ten khong con tren man hinh la dua nguoi ta di lac.
   Luat nay la MOT CHOT KEO XUONG theo kieu khac: moi lan doi ten mot trang/tab/nhom, THEM ten
   cu vao bang duoi day. Bo kiem se doc moi chu hien ra man va bao neu ten chet con song. */
/* Dang xem thay nguoi khac thi phai co DIEM NHAN, khong duoc lan vao moi thanh cong cu khac
   (anh Luan: "neu ko la nguoi dung se quen la minh dang xem cua nguoi khac, kheo lai nham chi
   so day"). Canh ba thu: nhan canh bao, lop dinh dau man, va nut quay ve. */
(function(){
 var nv=(DL.DL01||[]).filter(function(x){return staffActive(x)})[0];
 window.GATE_SID=nv.staff_id;CURSTAFF=nv.staff_id;applyScope(nv.staff_id);setRole("all");
 window.BANAI=(DL.DL01||[]).filter(function(x){return staffActive(x)&&x.staff_id!==nv.staff_id})[0].staff_id;
 var h="";try{h=banAiHTML()}catch(e){}
 t("dang xem thay nguoi khac thi thanh bao co diem nhan va dinh dau man",
   /xemthay/.test(h)&&/Đang xem thay người khác/.test(h)&&/banVeMinh\(\)/.test(h));
 window.BANAI="";window.GATE_SID="";CURSTAFF="";applyScope("");setRole("all");
})();

(function(){
 var TENCHET=[
  ["trang Giao việc","trang nay ten la \"Quan ly viec giao & nhan\" tu V9.99u"],
  ["module Giao việc","nt"],
  ["C1 · ","ten nhom chang bo so tu V9.99y"],["C2 · ","nt"],["C3 · ","nt"],["C4 · ","nt"],
  ["Chặng 1 ·","nt"],["Chặng 2 ·","nt"],["Chặng 3 ·","nt"],["Chặng 4 ·","nt"],
  ["Trợ thủ","doi thanh \"Tro ly\" tu V9.62"],
  ["Ghi nhận góp ý","trang nay da go tu V9.98, nut loa mo thang Google Sheet"],
  ["bản V6","ban V6 ngung phat hanh tu V9.99"]
 ];
 var chu="";
 window.GATE_SID="";applyScope("");setRole("all");
 /* Doc chu tu BA nguon nguoi dung that su nhin thay: tooltip the (THEDEF), moi trang duoc ve,
    va moi buoc cua moi bai huong dan. */
 /* THEDEF la mot OBJECT (khoa theo nhom the), khong phai mang - goi .forEach tren no nem loi,
    ma loi ay bi try/catch nuot mat nen phep do im lang bo qua TOAN BO tooltip the. Da can dung
    kieu bay "do sot ma bao xanh" ma file nay von sinh ra de chong. */
 try{Object.keys(THEDEF||{}).forEach(function(k){(((THEDEF[k]||{}).the)||[]).forEach(function(x){chu+=" "+x[1]+" "+x[2]})})}catch(e){}
 PAGES.filter(function(p){return !p.hide}).forEach(function(p){CUR=p.k;
  try{chu+=" "+((PBK[p.k]&&PBK[p.k].ty==="list")?renderList(p.k):(RENDER[p.k]?RENDER[p.k]():""))}catch(e){}});
 try{for(var b in TOUR){(TOUR[b].steps||[]).forEach(function(st){chu+=" "+(st.t||"")+" "+(st.d||"")+" "+(st.hint||"")})}}catch(e){}
 chu=String(chu).replace(/<[^>]*>/g," ");
 if(process.env.SOI)console.log("DEBUG chu.length=",chu.length,"| co THEDEF:",typeof THEDEF,"| co 'Giao việc':",chu.indexOf("trang Giao việc"));
 var chet=TENCHET.filter(function(x){return chu.indexOf(x[0])>=0});
 t("chu huong dan khong chi duong bang ten da chet"+(chet.length?" ["+chet.map(function(x){return x[0]}).join(" ; ")+"]":""),
   chet.length===0);
})();

if(bad.length){console.log("CHECKUX DO ("+bad.length+"/"+(ok+bad.length)+"):");
 bad.forEach(function(b){console.log("  - "+b)});process.exit(1)}
console.log("CHECKUX OK: "+ok+" tieu chi | "+FORM.length+" form ghi deu co loi giai thich, khong o ngay nao de trong");
