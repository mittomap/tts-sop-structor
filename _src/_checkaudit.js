/* ═══════════════════════════════════════════════════════════════════════════════════════════
   _checkaudit.js - BỘ KIỂM DỰNG THEO CÁCH ANH LUÂN TÌM RA LỖI
   ═══════════════════════════════════════════════════════════════════════════════════════════

   Anh Luân đặt (31/07): *"Em nhớ thiết kế lại quy trình audit. Phải toàn diện từ: độ phủ sop,
   giao diện, tiện dụng, đồng bộ, nghiệp vụ tốt, luồng tốt. Trên hết là người dùng sẽ không gặp
   khó khăn. E thử phân tích xem những gì a phát hiện, xem a phát hiện bằng cách nào thì e tạo ra
   cách audit tương tự."*

   Nên việc đầu tiên không phải viết bộ kiểm, mà là ĐỌC LẠI 43 phát hiện của anh Luân trong các
   phiên gần đây và hỏi: anh nhìn vào đâu để thấy?

   ┌─ TÁM PHƯƠNG PHÁP ĐO ĐƯỢC, xếp theo số lần anh Luân dùng ────────────────────────────────┐
   │ M1 ĐỐI XỨNG - "chỗ kia có mà chỗ này không"                             13/43 phát hiện │
   │    "cổng học viên em cũng nên làm navbar đi" · "có nhiều trang em không làm bộ lọc"      │
   │    · "sao ko dùng cổng học viên luôn" (12 chỗ gọi tên A, 5 chỗ gọi tên B)                │
   │ M2 LUỒNG HAI ĐẦU - "gửi ở đây thì ai nhận ở đâu"                          5/43          │
   │    "học viên gửi đi thì nhân viên nhận ở đâu nhỉ" · "bàn giao mà thiếu thời gian trả lại"│
   │ M3 ĐÓNG VAI - mở app bằng mắt đúng người rồi mới nói                      4/43          │
   │    "a đang ở admin đây em, ko thấy mấy cái em thay đổi ở đâu cả"                         │
   │ M4 DƯ THỪA & RỖNG - "cái này để làm gì / khác gì cái kia"                 5/43          │
   │    "cột thao tác ở các sổ ko thấy gì nhỉ" · "mà 2 cái này khác gì nhau ko em?"           │
   │ M5 THỨ BẬC THỊ GIÁC - nhìn ra cái bao và cái bị bao                       6/43          │
   │    "font chỗ này to lên tí, để phân biệt khi sổ ra danh sách bên trong"                  │
   │ M6 GIỌNG APP - đọc chữ như người ngoài                                    5/43          │
   │    "sao có thẻ html gì đây" · "em là app mà em gắn cảm thán vào sao được"                │
   │ M7 SỐ PHẢI SỬA ĐƯỢC - bấm vào một con số rồi hỏi "sửa ở đâu"              3/43          │
   │    "đổi lớp từ 2 lần, ko có trong cấu hình hay sao mà ko thấy răng cưa em"               │
   │ M8 CHỖ ĐỨNG - "thứ này nằm đây có hợp lý không"                           2/43          │
   │    "công giảng dạy tự nhiên lại nằm trong sổ thu học phí, vô lý"                         │
   └──────────────────────────────────────────────────────────────────────────────────────────┘

   Bộ kiểm này KHÔNG làm lại việc của 19 bộ kiểm cũ. Nó nhắm vào chỗ chưa ai canh:
   M1, M2, M4, M7, M8 - năm phương pháp chiếm 28/43 phát hiện mà không có một dòng máy nào canh.
   M3 đã có ở _check18 (hội đồng audit), M5 một phần ở _checkux (thang thiết kế), M6 một phần ở
   _checkux (giọng + chữ "em").

   LUẬT CỦA CHÍNH BỘ KIỂM NÀY (rút từ các bẫy đã cắn):
   · Chỗ nào app cố ý không làm thì khai kèm LÝ DO ĐỌC ĐƯỢC, không khai kiểu "bỏ qua".
   · Không đo cái đang chuyển động: đếm trên CẤU TRÚC (cột, tab, khai báo) chứ không trên số dòng
     dữ liệu hôm nay - hôm nay 0 dòng không có nghĩa là hỏng.
   · Đọc không được thứ cần đọc thì ĐỎ, không lặng lẽ return.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:"",pathname:"/ITTs_WebApp_v5_demo.html"};
var LS={};global.localStorage={getItem:(k)=>(k in LS?LS[k]:null),setItem(k,v){LS[k]=String(v)},removeItem(k){delete LS[k]}};
var SS={};global.sessionStorage={getItem:(k)=>(k in SS?SS[k]:null),setItem(k,v){SS[k]=String(v)},removeItem(k){delete SS[k]}};
global.innerWidth=1400;global.innerHeight=900;

var FS=require('fs');
var OUT=process.env.ITTS_OUT||'.';
require('vm').runInThisContext(FS.readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8'));
var SRC=FS.readFileSync('./gen_v5.py','utf8');

var bad=[], n=0;
function t(ten,ok,chitiet){n++;if(!ok)bad.push(ten+(chitiet?(" - "+chitiet):""))}
function veTrang(pg){
 try{CUR=pg;return (PBK[pg]&&PBK[pg].ty==="list")?renderList(pg):(RENDER[pg]?RENDER[pg]():"")}
 catch(e){return "__LOI__"+e.message}}
function chuTho(h){return String(h).replace(/<[^>]*>/g," ")
 .replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'")
 .replace(/&nbsp;/g," ").replace(/\s+/g," ")}
/* Bóc hết data-tip / title / aria-label ra trước khi tìm chữ TRÊN MÀN: nếu không thì một câu
   chú thích tự chứng minh được cho chính nó (bẫy đã cắn ở _checkux nhóm 10). */
function chuThay(h){return chuTho(String(h).replace(/\s(data-tip|data-tipfn|title|aria-label|placeholder)="[^"]*"/g,""))}

setRole("all");

/* ═════════ M1 · ĐỐI XỨNG - "chỗ kia có mà chỗ này không" ═════════════════════════════════
   Đây là phương pháp anh Luân dùng nhiều nhất, và cũng là loại lỗi tự sinh ra nhiều nhất:
   không ai cố ý làm lệch, chỉ là thêm tính năng cho trang đang sửa rồi quên 12 trang cùng loại.
   Cách canh: gom các trang THUỘC CÙNG MỘT HỌ, rồi đòi mọi thành viên trong họ có cùng bộ đồ. */

/* --- Họ 1: TRANG DANH SÁCH. Ai cũng phải tìm được, lọc được, xuất được, chọn cột được. --- */
(function(){
 var DOTHIEU={};   /* trang -> tính năng thiếu */
 var CAN=[
  ["ô tìm trong trang", function(h){return /class="(srch|pgq)"/.test(h)}],
  ["nút Xuất",          function(h){return /pgExport\(/.test(h)}],
  ["nút Bộ lọc",        function(h){return /fltOpen\(/.test(h)}],
  ["nút chọn Cột",      function(h){return /colMenuToggle\(/.test(h)}],
  ["số dòng đang hiện", function(h){return /class="tbcnt"/.test(h)}]];
 /* THUOC PHAI DUNG: 11/29 muc trong LISTCFG khong ve BANG khi vao trang do - chung la trang THE
    (obcard) vi cong viec o do la mo tung ho so ra lam, khong phai doc mot bang. Doi "nut chon Cot"
    o mot man khong co cot nao la doi mot thu vo nghia, va bo kiem doi thu vo nghia thi lan sau
    khong ai doc no. Chi soi nhung trang THUC SU ve bang. */
 Object.keys(LISTCFG).filter(function(pg){return PBK[pg]&&PBK[pg].ty==="list"}).forEach(function(pg){
  var h=veTrang(pg);
  if(h.indexOf("__LOI__")===0){DOTHIEU[pg]=["vẽ lỗi: "+h.slice(7,60)];return}
  var thieu=CAN.filter(function(c){return !c[1](h)}).map(function(c){return c[0]});
  if(thieu.length)DOTHIEU[pg]=thieu});
 var ds=Object.keys(DOTHIEU).map(function(p){return p+"["+DOTHIEU[p].join(", ")+"]"});
 t("MỌI trang danh sách đều tìm/lọc/xuất/chọn cột được ("+Object.keys(LISTCFG).filter(function(p){return PBK[p]&&PBK[p].ty==="list"}).length+" trang bảng)",
   ds.length===0, ds.slice(0,6).join(" · "));
})();

/* --- Họ 2: BA CỔNG. Cổng nào cũng phải có cùng bộ công cụ vỏ. ---
   Anh Luân: *"cổng học viên em cũng nên làm navbar đi, để chứa mấy công cụ phù hợp"* - lúc đó
   cổng nhân viên có thanh trên đủ công cụ còn cổng học viên thì không. */
(function(){
 var HV="";
 try{HV=FS.readFileSync('./_HV.js','utf8')}catch(e){}
 t("đọc được mã cổng học viên để đối chiếu", !!HV, "thiếu _HV.js - chạy extract_js.py trước");
 if(!HV)return;
 var NV=FS.readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8');
 var CHUNG=[
  ["nút Đổi cổng",        /congDoiMo\(/],
  ["đường sang cổng kia", /function congURL/],
  ["biết mình đang ở cổng nào", /function congDangO/]];
 var thieuNV=CHUNG.filter(function(c){return !c[1].test(NV)}).map(function(c){return c[0]});
 var thieuHV=CHUNG.filter(function(c){return !c[1].test(HV)}).map(function(c){return c[0]});
 t("cổng nhân viên có đủ bộ công cụ vỏ dùng chung", !thieuNV.length, thieuNV.join(", "));
 t("cổng học viên/phụ huynh có đủ bộ công cụ vỏ dùng chung", !thieuHV.length, thieuHV.join(", "));
})();

/* --- Họ 3: MỘT VIỆC MỘT TÊN. ---
   Anh Luân nhìn trang chủ demo là thấy ngay app tự gọi mình bằng hai tên khác nhau. Cách đo:
   với mỗi cặp tên đồng nghĩa đã biết, đếm số lần xuất hiện trong CHỮ HIỆN RA; phải nghiêng hẳn
   về một bên, không được cả hai cùng sống. Đếm trên MÃ NGUỒN vì đó là nơi tên được đặt. */
(function(){
 /* SO KHONG PHAN BIET HOA THUONG. Ban truoc chi tim "Nguoi giam ho" viet hoa chu N nen bo lot
    15 dong viet thuong ("goi nguoi giam ho", "chua co so nguoi giam ho") - dung loai chu nguoi
    dung doc nhieu nhat. Mot bo kiem bat chu hoa ma bo chu thuong thi no canh dung mot nua. */
 var CAP=[
  {dung:"Cổng học viên", sai:"trang học viên", tru:/trang H[oọ]c vi[eê]n nguy c[oơ]/gi},
  {dung:"Trợ lý",        sai:"trợ thủ",        tru:null},
  /* Cum "(phu huynh / nguoi giam ho)" la cau GIAI NGHIA - noi ro "nguoi dong hanh" la ai, nen
     giu lai co chu dich. Tru truoc khi dem. */
  {dung:"Người đồng hành",sai:"người giám hộ", tru:/ph[uụ] huynh \s*\/\s*ng[uư][oờ]i gi[aá]m h[oộ]/gi}];
 /* CHI DEM CHU HIEN RA, khong dem chu thich ma nguon. Do that: 18/18 cho con chu "Tro thu"
    deu nam trong khoi chu thich ke lai lich su vi sao doi ten - do la ho so cua quyet dinh, xoa
    di la mat tri nho cua du an. Bo kiem dem ca chu thich thi no bat mot cai khong phai loi, va
    ep nguoi ta xoa chu thich de lam xanh bo kiem - dung huong nguoc hoan toan. */
 function boChuThich(x){
  return x.replace(/\/\*[\s\S]*?\*\//g," ")
          .replace(/^\s*#.*$/gm," ")
          .replace(/^\s*"""[\s\S]*?"""/gm," ")}
 var SRCH=boChuThich(SRC);
 var lech=[];
 CAP.forEach(function(c){
  var s=SRCH;
  if(c.tru)s=s.replace(c.tru,"");
  var nSai=(s.match(new RegExp(c.sai,"gi"))||[]).length;
  if(nSai>0)lech.push('"'+c.sai+'" còn '+nSai+" chỗ hiện ra (phải là \""+c.dung+"\")")});
 t("một việc chỉ có MỘT tên - không còn tên cũ sống song song", !lech.length, lech.join(" · "));
})();

/* ═════════ M2 · LUỒNG HAI ĐẦU - "gửi ở đây thì ai nhận ở đâu" ════════════════════════════
   Anh Luân: *"cái chỗ học viên liên hệ với trung tâm, họ gửi đi thì nhân viên nhận ở đâu nhỉ"*.
   Một nửa luồng chạy được không có nghĩa là luồng chạy được. Cách canh: mọi LOẠI VIỆC mà app
   sinh ra phải có ít nhất một màn ở phía bên kia liệt kê đúng loại đó. */
(function(){
 var LOAI=(ENUM["enum_task_type"]||[]).map(ecode).filter(Boolean);
 t("danh mục loại việc (CH1) đọc được", LOAI.length>0);
 /* Màn nào ở cổng nhân viên có nhắc tới loại việc nào - đọc trên KHAI BÁO chứ không trên dữ liệu
    hôm nay (hôm nay chưa có dòng loại đó không có nghĩa là app không có chỗ nhận). */
 var conhan={};
 LOAI.forEach(function(k){
  var co=(new RegExp('"'+k+'"').test(SRC))||(new RegExp("'"+k+"'").test(SRC));
  conhan[k]=co});
 var khongNhan=LOAI.filter(function(k){return !conhan[k]});
 t("mọi loại việc trong CH1 đều có chỗ nhận trong app ("+LOAI.length+" loại)",
   !khongNhan.length, khongNhan.join(", "));
 /* Chặt hơn: yêu cầu học viên gửi từ cổng HV phải hiện ở CẢ BA nơi đã hứa trong README. */
 var HV="";try{HV=FS.readFileSync('./_HV.js','utf8')}catch(e){}
 t("cổng học viên có cửa gửi yêu cầu", /student_request/.test(HV));
 /* V9.99z5 - BAY: phep do nay bam vao "chu ychv phai nam trong 400 ky tu sau chu HUBTAB".
    Them mot hub moi (giangvien) vao dau bang la ychv troi ra ngoai khung, tieu chi do trong
    khi app khong he doi. Hoi THANG cai bang do luc chay - dung do khoang cach chu. */
 var oCskh=!!(typeof HUBTAB!=="undefined"&&HUBTAB.cskh&&HUBTAB.cskh.m&&HUBTAB.cskh.m.ychv==="ychv");
 t("cổng nhân viên có màn nhận yêu cầu học viên (hub CSKH)", oCskh);
 t("yêu cầu học viên có mục riêng trên menu trái", /items:\["banlam","viec","ychv"/.test(SRC));
})();

/* --- Nghiệp vụ có ĐỦ HAI CHIỀU chưa: giao đi thì lấy lại được không ---
   Anh Luân: *"chỗ này bàn giao mà thiếu tính năng thời gian trả lại nè"*. Cột đã có trong bảng
   từ đầu, hàm tự trả về cũng có - chỉ thiếu đường nối vào màn bàn giao hàng loạt. Loại lỗi này
   không phải "chưa làm" mà là "làm một nửa", nên phải canh THEO CẶP. */
(function(){
 var CAP=[
  ["bàn giao lead", /handover_until/, /bgUntilV\(\)|id="bgUntil"/, "màn bàn giao hàng loạt phải có ô trả lại ngày"],
  ["bảo lưu",       /pause_until/,    /pause_until/,               "có hạn bảo lưu thì phải có chỗ nhắc quay lại"],
  ["đổi lớp",       /placement_change_count/, /placementChange_free_times/, "đếm số lần đổi thì ngưỡng phải ở CH2"]];
 var thieu=[];
 CAP.forEach(function(c){
  if(c[1].test(SRC)&&!c[2].test(SRC))thieu.push(c[0]+": "+c[3])});
 t("nghiệp vụ hai chiều không bị làm một nửa", !thieu.length, thieu.join(" · "));
})();

/* ═════════ M4 · DƯ THỪA & RỖNG - "cái này để làm gì / khác gì cái kia" ═══════════════════
   Anh Luân: *"cột thao tác ở các sổ ko thấy gì nhỉ"* và *"mà 2 cái này khác gì nhau ko em?"*.
   Hai loại lỗi khác nhau nhưng cùng một câu hỏi: chỗ này có đáng chiếm chỗ không. */

/* --- Cột chết: khai trong bảng mà KHÔNG DÒNG NÀO có dữ liệu ---
   Đây là đo trên CẤU TRÚC dữ liệu (toàn bảng), không phải trên bộ lọc hôm nay. */
(function(){
 var COTCHET_BOQUA={
  /* Cột SOP mô tả mà dữ liệu demo chưa gieo - app vẫn phải có chỗ hiện, xoá đi là làm sót SOP. */
  "DL02.referrer_name":"cột SOP - lead do người khác giới thiệu; demo ít dòng có giá trị",
  "DL09.emergency_contact_relation":"cột SOP về người đồng hành - có màn nhập, demo gieo thưa"};
 var chet=[];
 Object.keys(LISTCFG).forEach(function(pg){
  var cfg=LISTCFG[pg];if(!cfg.cols||!cfg.code)return;
  var all=[];try{all=rows(cfg.code)}catch(e){return}
  if(all.length<5)return;                       /* bảng quá ít dòng thì không kết luận được */
  cfg.cols.forEach(function(c){
   var k=c[0];
   if(/^__/.test(k))return;                     /* cột TÍNH - không đọc ô nào của dòng */
   var kh=cfg.code+"."+k;
   if(COTCHET_BOQUA[kh])return;
   var coDl=all.some(function(r){return String(r[k]==null?"":r[k]).trim()!==""});
   if(!coDl)chet.push(kh+" (trang "+pg+")")})});
 var uniq=chet.filter(function(v,i,a){return a.indexOf(v)===i});
 t("không cột nào trong danh sách là cột chết (khai mà 0/N dòng có dữ liệu)",
   !uniq.length, uniq.slice(0,8).join(" · "));
})();

/* --- Tab chết: hub khai tab mà tab đó vẽ ra không có gì --- */
(function(){
 var chet=[];
 Object.keys(HUBTAB).forEach(function(hub){
  var H=HUBTAB[hub];
  Object.keys(H.m).forEach(function(tab){
   window[H.v]=tab;
   var h=veTrang(hub);
   if(h.indexOf("__LOI__")===0){chet.push(hub+"/"+tab+" NÉM LỖI: "+h.slice(7,50));return}
   if(chuThay(h).trim().length<120)chet.push(hub+"/"+tab+" (vẽ ra gần như rỗng)")});
  window[H.v]=H.d});
 t("không tab nào của hub vẽ ra rỗng hoặc ném lỗi", !chet.length, chet.slice(0,6).join(" · "));
})();

/* --- Hai khối nói cùng một điều ---
   Anh Luân: *"bản đồ chặng và nghiệp vụ trong chặng nếu ko có cấu trúc tốt rất dễ dư thừa"*.
   Cách đo: trên cùng một trang, hai tiêu đề khối không được trùng tên, và hai khối không được
   cùng đọc ra đúng một dãy con số. */
(function(){
 var trung=[];
 Object.keys(PBK).forEach(function(pg){
  var h=veTrang(pg);if(h.indexOf("__LOI__")===0||!h)return;
  var hd=(h.match(/class="sechd"[^>]*>([^<]{4,60})/g)||[]).map(function(x){
   return chuTho(x.replace(/.*>/,"")).trim().toLowerCase()});
  var seen={};
  hd.forEach(function(x){if(!x)return;
   if(seen[x]){trung.push(pg+': "'+x+'" x'+(seen[x]+1))}else{seen[x]=1}});
 });
 t("không trang nào có hai khối trùng tên", !trung.length, trung.slice(0,5).join(" · "));
})();

/* ═════════ M4b · MÃ MA - CÂU LỌC BẰNG MÃ KHÔNG CÓ TRONG DANH MỤC CH1 ════════════════════
   Loại lỗi ĐỘC NHẤT trong app này, vì nó không bao giờ báo gì: `isc(x.homework_status,"submitted")`
   chạy êm ru, không lỗi JS, không đỏ ở đâu - chỉ trả về false mãi mãi. Ô "Bài tập chờ chấm" của
   giảng viên đọc số 0 suốt nhiều bản trong khi dữ liệu có 188 bài đã nộp chưa chấm. Số 0 trông
   rất hợp lý ("hôm nay chấm hết rồi"), nên không ai nghi.
   Đợt quét đầu tiên (31/07) ra 8 chỗ như vậy, trong đó bốn chỗ sai THẬT:
     · enrollment_status "active"  -> chỉ số TCR của BC2 đọc 0% vĩnh viễn
     · re_enrollment_status "declined" (đúng là "rejected") -> giục mời lại người đã từ chối
     · class_status "completed"/"closed" (đúng là "finished") -> lớp đã xong vẫn ăn chip "Đang học"
     · homework_status "submitted" -> ô bài chờ chấm luôn bằng 0
   CÁCH ĐO: đọc ENUMMAP (cột -> danh mục) và DATA.enums (danh mục -> mã) của CHÍNH APP, rồi soi
   mọi lời gọi isc(<gì đó>.cột, "mã", ...) trong mã nguồn. Chỉ xét cột NÀO CÓ trong CH1 - cột
   không khai danh mục thì ta không có quyền phán, đoán bừa là bộ kiểm nói dối. */
(function(){
 var hople={},co=0;
 Object.keys(ENUMMAP||{}).forEach(function(col){
  var arr=(DATA.enums||{})[ENUMMAP[col]];if(!arr||!arr.length)return;
  co++;hople[col]={};arr.forEach(function(it){hople[col][String(it).split(" ")[0]]=1})});
 t("đọc được danh mục CH1 để soi mã ma",co>10,"chỉ dựng được "+co+" cột - không đủ để kết luận");
 var rx=/isc\(\s*[A-Za-z_$][\w.$]*\.(\w+)\s*,((?:\s*"[^"]*"\s*,?)+)\)/g,m,ma=[];
 while((m=rx.exec(SRC))){
  var col=m[1];if(!hople[col])continue;
  (m[2].match(/"[^"]*"/g)||[]).forEach(function(q){
   var c=q.slice(1,-1);
   if(!hople[col][c])ma.push(col+' = "'+c+'" (CH1 có: '+Object.keys(hople[col]).join("/")+")")})}
 var chua={};ma=ma.filter(function(x){if(chua[x])return false;chua[x]=1;return true});
 t("không câu lọc nào dùng mã không có trong CH1",!ma.length,ma.slice(0,4).join(" · "));
})();

/* ═════════ M10 · BÀN LÀM VIỆC THEO THỰC THỂ - KHÔNG CHỨC DANH NÀO NGỒI KHÔNG ═════════════
   Anh Luân 01/08: *"mỗi một giai đoạn đều có 1 thực thể là trung tâm... mỗi một cổng của từng
   team, lại gom tất cả nghiệp vụ riêng của họ cho từng thực thể và giai đoạn."*
   Ba luật canh cho trục tổ chức mới này:
   (1) MỌI hành động trong bảng CH3 của SOP phải được xếp vào một thực thể, hoặc khai lý do vì
       sao không - nếu không thì Bàn làm việc chỉ là một cái mục lục nữa, thiếu đúng những việc
       không ai nhớ. Đây là LUẬT SỐ 0 (phủ trọn SOP) áp cho màn này.
   (2) MỌI dòng việc phải khai AI LÀM: hoặc bằng mã CH3, hoặc bằng `vai`. Việc không khai ai làm
       là việc mọi người cùng thấy và không ai nhận.
   (3) MỌI chức danh, khi mở Bàn làm việc ở thực thể MẶC ĐỊNH của mình, phải thấy việc. Đã cắn
       ngay lần đo đầu: NV WOW thấy màn trống ở cả ba thực thể vì phạm vi dữ liệu của họ là "chỉ
       của tôi" mà họ không sở hữu lead nào - trong khi việc thật của họ là chấm phiếu test của
       chính những lead ấy. */
var CH3_NGOAIBAN={
 lead_new:"tạo hồ sơ mới - việc của nút Thêm ở danh sách, chưa có thực thể để mở ra",
 lead_giao:"bàn giao hàng loạt khi nhân viên nghỉ - làm ở hub Chờ duyệt, không phải việc với một khách",
 ck_nho:"chiết khấu ghi ngay trong form đăng ký, không phải một việc riêng đứng chờ",
 ck_lon:"như trên, cộng thêm một cửa duyệt ở hub Chờ duyệt",
 hoantien:"hàng chờ phê duyệt của quản lý - nằm ở hub Chờ duyệt",
 kn_duyet:"phê duyệt giải pháp khiếu nại - hàng chờ của quản lý ở hub Chờ duyệt",
 wow_them:"phê duyệt WOW bổ sung - hàng chờ của quản lý",
 doilop1:"đổi lớp làm ngay trong màn Xếp lớp, đi kèm hồ sơ nhập học",
 doilop2:"như trên, cộng cửa duyệt của quản lý",
 wow_auto:"máy tự tạo từ cảnh báo - không phải việc của người",
 wow_lms:"học viên tự đặt ở cổng học viên - không phải việc của nhân viên trung tâm",
 wow_day:"dạy buổi WOW - làm ở sổ buổi WOW theo LỊCH, không theo từng học viên",
 gia_khoa:"cập nhật bảng giá khóa - là cấu hình sản phẩm, nằm ở Cài đặt",
 fb_xau:"xử lý phản hồi tiêu cực - đã gộp vào việc 'Phản hồi chưa phân loại' của cùng thực thể"};
(function(){
 /* ═══ LUẬT TRỤC (anh Luân 01/08) ═══════════════════════════════════════════════════════
    *"Bất kể bộ phận nào, nghiệp vụ gì, miễn là phục vụ cho KHÁCH, cho HỌC VIÊN, cho PHỤ HUYNH,
    cho LỚP HỌC. Các luồng thiết kế để chạy cho các đối tượng này, đều phải tham gia, và tham
    gia cùng nhau, chứ ko rời rạc."*
    Hai vế, canh cả hai:
    (a) TRỤC LÀ NGƯỜI ĐƯỢC PHỤC VỤ - đúng bốn thực thể ấy, không thêm thực thể theo PHÒNG BAN.
        Đã cắn: em đề xuất thêm "đợt thu" cho kế toán và "chiến dịch" cho marketing - lấy phòng
        ban làm trung tâm là quay đúng về chỗ rời rạc cũ.
    (b) THAM GIA CÙNG NHAU - mở một hồ sơ ra phải thấy việc của MỌI bộ phận, không chỉ của mình.
        Đo trước khi sửa: 48% việc đang treo bị giấu khỏi người mở hồ sơ (marketing thấy 27%,
        nhân sự 0%). Quyền phải chặn TAY, không che MẮT. */
 (function(){
  var PHAI=["khach","hocvien","phuhuynh","lop"];
  var dang=(TTHE||[]).map(function(x){return x.k});
  t("trục đúng bốn thực thể anh Luân chốt: khách · học viên · phụ huynh · lớp",
    PHAI.length===dang.length&&PHAI.every(function(k){return dang.indexOf(k)>=0}),
    "đang khai: "+dang.join(", "));
  /* Không thực thể nào được đặt theo tên một phòng ban */
  var BOPHAN=["ketoan","marketing","nhansu","tuvan","hocvu","wow","giaovien","hotro","dieuhanh"];
  var pb=dang.filter(function(k){return BOPHAN.indexOf(k)>=0});
  t("không thực thể nào lấy PHÒNG BAN làm trung tâm", !pb.length, pb.join(", "));

  /* (b) mở hồ sơ ra là thấy việc của mọi bộ phận - đo bằng cách VẼ THẬT thẻ hồ sơ */
  var giau=[], tongMinh=0, tongKhac=0;
  rows("DL01").filter(function(x){return staffActive(x)}).forEach(function(nv){
   applyScope(nv.staff_id);CURSTAFF=nv.staff_id;
   var g=SCOPE().group; if(!g)return;
   TTHE.forEach(function(T){
    var d=[];try{d=ttDanhSach(T.k)}catch(e){d=[]}
    d.slice(0,6).forEach(function(z){
     var tat=[];try{tat=ttViecAll(T.k,z.r)}catch(e){return}
     if(!tat.length)return;
     var h="";try{h=banThe(T.k,z)}catch(e){giau.push(g+"/"+T.k+": không vẽ được thẻ");return}
     var hien=(h.match(/class="banjob/g)||[]).length;
     tongMinh+=z.viec.length; tongKhac+=(tat.length-z.viec.length);
     if(hien<tat.length)giau.push(g+" mở "+T.k+" "+z.ma+": treo "+tat.length+" việc mà chỉ hiện "+hien)})})});
  applyScope("");CURSTAFF="";
  t("mở một hồ sơ ra là thấy việc của MỌI bộ phận, không chỉ của mình",
    !giau.length, giau.slice(0,3).join(" · "));
  console.log("  Mot ho so, moi bo phan: "+tongMinh+" viec cua toi + "+tongKhac+
   " viec cua bo phan khac deu HIEN (truoc day "+tongKhac+" viec nay bi giau)");
  /* và việc của bộ phận khác phải nói RÕ đang chờ ai - thấy mà không biết chờ ai thì vô dụng */
  var thieuAi=[];
  rows("DL01").filter(function(x){return staffActive(x)}).slice(0,12).forEach(function(nv){
   applyScope(nv.staff_id);CURSTAFF=nv.staff_id;
   TTHE.forEach(function(T){
    var d=[];try{d=ttDanhSach(T.k)}catch(e){d=[]}
    d.slice(0,4).forEach(function(z){
     var k2=[];try{k2=ttViecKhac(T.k,z.r)}catch(e){return}
     if(!k2.length)return;
     var h="";try{h=banThe(T.k,z)}catch(e){return}
     var noi=(h.match(/đang chờ <b>/g)||[]).length;
     if(noi<k2.length)thieuAi.push(T.k+" "+z.ma+": "+k2.length+" việc mà chỉ "+noi+" chỗ ghi đang chờ ai")})})});
  applyScope("");CURSTAFF="";
  t("việc của bộ phận khác đều ghi rõ đang chờ bộ phận nào", !thieuAi.length, thieuAi.slice(0,3).join(" · "));

  /* (c) MỌI SỔ TRA CỨU THUỘC VỀ MỘT THỰC THỂ (anh Luân đặt từ V9.69).
     15 sổ nằm phẳng trong menu thì người dùng phải tự nhớ sổ nào nói về ai. Nay mỗi sổ khai
     thuộc đúng MỘT thực thể - hoặc khai lý do vì sao đứng ngoài. Canh cả ba mặt: phủ hết,
     không sổ nào thuộc hai chỗ, và bản khai ngoài không nhắc sổ đã biến mất. */
  (function(){
   /* V9.99z11 - truoc day doc nhom "Tra cuu" cua NAVTREE6; v6 da go 06/08 nen hoi cay cua V5.
      Y nghia phep do khong doi: moi so tra cuu phai thuoc ve mot thuc the, hoac khai ly do. */
   var traG=(navCayV5()||[]).filter(function(g){return g.g==="Tra cứu"})[0];
   if(!traG){t("có nhóm Tra cứu trong menu", false, "không thấy");return}
   /* V2 08/08 - DANH SÁCH SỔ KHÔNG CÒN NẰM TRỰC TIẾP TRÊN MENU. Mười sáu cuốn sổ chỉ-đọc vào
      sau cửa `tracuu` để menu CEO từ 60 mục xuống 44 (anh Luân giao quyết số trang 08/08).
      Ý nghĩa phép đo KHÔNG đổi - mọi sổ vẫn phải thuộc về một thực thể hoặc khai lý do - chỉ là
      hỏi đúng chỗ danh sách sổ đang nằm: bản khai `SOTRACUU`, cộng những sổ còn đứng trực tiếp
      trên menu (`hocvien`, `giangvien` - hai trang ở lại vì chúng nằm trong nhịp ngày). */
   var traSo=(typeof SOTRACUU!=="undefined"?SOTRACUU:[]).concat(
     traG.items.filter(function(k){return k!=="tracuu"}));
   traG={g:traG.g,items:traSo};
   var thuoc={},trung=[];
   TTHE.forEach(function(T){(T.so||[]).forEach(function(k){
    if(thuoc[k])trung.push(k+" (ở cả "+thuoc[k]+" và "+T.k+")");
    thuoc[k]=T.k})});
   var sot=traG.items.filter(function(k){return !thuoc[k]&&!TTSO_NGOAI[k]});
   t("mọi sổ Tra cứu thuộc về một thực thể, hoặc khai lý do ("+traG.items.length+" sổ)",
     !sot.length, sot.join(", ")+" => khai `so:` cho thực thể, hoặc TTSO_NGOAI kèm lý do");
   t("không sổ nào thuộc hai thực thể cùng lúc", !trung.length, trung.join(" · "));
   var thua=Object.keys(TTSO_NGOAI).filter(function(k){return traG.items.indexOf(k)<0});
   t("bản khai sổ-ngoài-thực-thể không nhắc sổ đã biến mất", !thua.length, thua.join(", "));
   /* sổ khai cho thực thể phải là sổ CÓ THẬT trong menu - khai tên chết là lối cụt im lặng */
   var ma=[];TTHE.forEach(function(T){(T.so||[]).forEach(function(k){
    if(!PBK[k])ma.push(T.k+"->"+k)})});
   t("sổ khai cho thực thể đều là trang có thật", !ma.length, ma.join(", "));
   /* và Bàn làm việc phải BÀY chúng ra - khai mà không hiện thì người dùng vẫn không thấy */
   var chuaBay=[];
   TTHE.forEach(function(T){
    if(!(T.so||[]).length)return;
    window.BANTT=T.k;window.BANMO="";
    var h="";try{h=veTrang("ban")}catch(e){chuaBay.push(T.k+": lỗi");return}
    (T.so||[]).forEach(function(k){
     if(h.indexOf("go('"+k+"')")<0)chuaBay.push(T.k+"->"+k)})});
   window.BANTT="";
   t("Bàn làm việc bày sổ của thực thể đang chọn", !chuaBay.length, chuaBay.slice(0,4).join(" · "));
   console.log("  So tra cuu theo thuc the: "+Object.keys(thuoc).length+"/"+traG.items.length+
    " da gan | khai ly do dung ngoai: "+Object.keys(TTSO_NGOAI).length);
  })();
 })();
 /* (2) mọi dòng phải khai ai làm */
 var mo=(VIECTT||[]).filter(function(v){return !v.act&&!(v.vai&&v.vai.length)});
 t("mọi dòng việc đều khai ai làm (mã CH3 hoặc vai)", !mo.length,
   mo.map(function(v){return v.t}).slice(0,4).join(" · "));
 /* mã CH3 khai trong bảng phải có thật */
 var ma=(VIECTT||[]).filter(function(v){return v.act&&!CH3BY[v.act]});
 t("mã CH3 dùng trong bảng việc đều có thật", !ma.length,
   ma.map(function(v){return v.act}).slice(0,4).join(" · "));
 /* (1) phủ trọn CH3 */
 var dung={};(VIECTT||[]).forEach(function(v){if(v.act)dung[v.act]=1});
 var sot=CH3.filter(function(a){return !dung[a.k]&&!CH3_NGOAIBAN[a.k]});
 t("mọi hành động CH3 hoặc lên Bàn làm việc, hoặc khai lý do đọc được ("+CH3.length+" hành động)",
   !sot.length, sot.map(function(a){return a.k+" ("+a.t+")"}).slice(0,5).join(" · "));
 var thuaKhai=Object.keys(CH3_NGOAIBAN).filter(function(k){return !CH3BY[k]});
 t("bản khai ngoài-Bàn-làm-việc không nhắc mã đã biến mất", !thuaKhai.length, thuaKhai.join(", "));
 /* (3) mọi chức danh mở Bàn làm việc ở thực thể mặc định phải thấy việc CỦA MÌNH - hoặc khai
    được lý do đọc được vì sao không.
    Anh Luân 01/08 chốt trục: bốn thực thể trung tâm là KHÁCH · HỌC VIÊN · PHỤ HUYNH · LỚP -
    những NGƯỜI ĐƯỢC PHỤC VỤ. Hệ quả trung thực: có chức danh mà công việc gần như không chạm
    tới bốn đối tượng ấy. Nhân sự là một - tuyển người, chấm công, hồ sơ lao động đều là việc
    nội bộ. Đo ra đúng thế: nhân sự có 0 hành động CH3 nào ngoài mấy việc máy tự làm.
    Bịa thêm việc cho ô khỏi trống là nói dối; giấu đi cũng là nói dối. Nên khai ra. */
 var BANTRONG={
  nhansu:"việc chính của Nhân sự (tuyển người, chấm công, hồ sơ lao động) là việc nội bộ, không "+
   "phục vụ trực tiếp khách/học viên/phụ huynh/lớp. Phần có chạm tới người học - lớp phải có "+
   "giáo viên chính - đã nằm trên Bàn làm việc ở thực thể Lớp, nhưng có ngày không lớp nào thiếu."};
 var doi=[], daXet={};
 rows("DL01").filter(function(x){return staffActive(x)}).forEach(function(nv){
  applyScope(nv.staff_id);CURSTAFF=nv.staff_id;
  var g=SCOPE().group||"?";
  if(daXet[g])return; daXet[g]=1;
  var k=ttMacDinh(), ds=[];
  try{ds=ttDanhSach(k)}catch(e){doi.push(g+": lỗi "+e.message);return}
  var cv=ds.filter(function(z){return z.viec.length});
  if(!cv.length&&!BANTRONG[g])doi.push(g+" mở Bàn làm việc ("+k+") ra trống mà không khai lý do");
 });
 var thuaKhaiBT=Object.keys(BANTRONG).filter(function(g){return !daXet[g]});
 t("bản khai chức danh-bàn-trống không nhắc chức danh đã biến mất", !thuaKhaiBT.length, thuaKhaiBT.join(", "));
 applyScope("");CURSTAFF="";
 t("mọi chức danh mở Bàn làm việc ở thực thể mặc định đều thấy việc", !doi.length, doi.slice(0,4).join(" · "));

 /* (4) TRANG ĐÁP CỦA BẢN V6 - đo qua applyScope, tức đúng con đường app dùng lúc mở ra.
    Đã cắn: luật trang đáp nằm trong buildScope, mà Quản trị viên KHÔNG đi qua buildScope
    (applyScope dựng thẳng một object cho nhánh không có staff_id). Bản v6 mở ra vẫn rơi vào
    Trang bắt đầu y hệt v5 - đúng cái thay đổi dễ thấy nhất thì người mở demo lại không thấy,
    vì demo mặc định mở bằng Quản trị viên. Bộ kiểm cũ đóng vai từng CHỨC DANH nên không thấy:
    Quản trị viên không phải một chức danh trong DL01.
    Luật rút ra: đo trên hàm con là đo một nhánh; phải đo trên CỬA VÀO THẬT mới đủ mọi nhánh. */
 /* V9.99z11 - khoi do "ban v6 dap xuong dau" da bo cung voi ban v6 (anh Luan 06/08:
    *"bo v6, ko duoc lam anh huong v5"*). Giu lai dung ve con y nghia: ban dang chay phai dap
    xuong Trang bat dau. */
 (function(){
  applyScope("");
  t("moi loi vao deu dap xuong Trang bat dau", SCOPE().land==="banlam", "dang dap xuong "+SCOPE().land);
  applyScope("");CURSTAFF="";
 })();

 /* (4b) MENU KHONG DUOC LAM MAT DUONG TOI TRANG NAO.
    Truoc 06/08 khoi nay do menu cua ban v6 (5 nhom thay vi 8) va tung bat duoc 6 trang mat
    duong - trong do bon hub van hanh that. v6 da go, nhung PHEP DO thi giu, chuyen sang do
    chinh cay menu cua V5: moi trang phai toi duoc tu menu (thang, hoac la tab cua mot hub co
    trong menu), hoac khai ly do doc duoc.
    Luat cu cua du an van dung: *them mot muc vao menu chua phai la lam cho nguoi ta thay no* -
    va bo khoi menu thi gan nhu la lam cho nguoi ta khong thay. */
 (function(){
  var NGOAIMENU={
   ban:"trang chi tiet mo ra tu So nguoi dong hanh (phMo) - cung ho voi hoso/hosogv/hosonv, "+
    "khong dung o menu vi no luon duoc mo kem mot ho so cu the.",
   hanhtrinh:"goc nhin bang chang cua Trang bat dau - cung mot trang, mo bang nut 'Xem theo chang'.",
   banglop:"V2 RB3 - Van hanh lop la TRANG CON cua Lop hoc, mo ra bang cach bam mot lop o trang "+
    "Lop hoc (anh Luan: 'trang van hanh lop, no la trang con cua lop hoc moi dung em nhi'). "+
    "V1 de nguoc: banglop dung tren menu con lop bi an, nen phai vao thang man van hanh roi chon "+
    "lop bang o xo. O xo do van giu trong trang con cho nguoi quen loi cu khoi hut."};
  function tap(t){var o={};t.forEach(function(g){(g.items||[]).forEach(function(k){o[k]=1})});return o}
  var M=tap(navCayV5());
  var HUB=[[TSMAP,"tuyensinh"],[HTMAP,"hoctap"],[CSMAP,"cskh"],[DUYMAP,"duyet"],[KMAP,"khac"],[ARCMAP,"chang"]];
  /* Cay menu V5 bay THANG cac tab (nhaplead, test, tuvan...) chu khong bay ten hub, nen hoi
     "hub `tuyensinh` co trong menu khong" la sai cau hoi - phai hoi "co tab nao cua no trong
     menu khong". Do sai cau hoi thi ra ba hub "mat duong" trong khi nguoi dung bam vao no
     moi ngay. */
  /* V2 - HOI `HUBTAB` CHU KHONG HOI CAC BANG DOI TEN. Sang V2, sau khoa hub chi con la BI DANH:
     `go()` dan tiep toi trang nghiep vu dau tien nguoi do xem duoc, nen `TSMAP`/`HTMAP`/`CSMAP`/
     `KMAP`/`DUYMAP` da rong. Hoi mot bang rong thi moi hub deu "mat duong toi" trong khi nguoi
     dung van bam vao no moi ngay - do sai cau hoi, ra mot phat hien gia.
     Su that "trang nao TUNG thuoc hub nao" nam o `HUBTAB` - hoi thang no.
     LUAT (da ghi o README_SRC): go mot tinh nang thi phai di tim moi cai thuoc dang do no, va
     voi moi cai hoi lai "nen xoa, hay nen DOI CAU HOI?". Day la mot ca doi cau hoi. */
  function hubToiDuoc(hubKey){
   if(M[hubKey])return true;
   var HB=(typeof HUBTAB!=="undefined"&&HUBTAB[hubKey]&&HUBTAB[hubKey].m)||null;
   if(HB){for(var t0 in HB)if(M[HB[t0]])return true}
   var found=false;
   HUB.forEach(function(H){ if(H[1]!==hubKey||!H[0])return;
    Object.keys(H[0]).forEach(function(tab){ if(M[tab])found=true }) });
   return found}
  var mat=[];
  PAGES.forEach(function(pg){
   var k=pg.k; if(pg.hide||M[k]||NGOAIMENU[k])return;
   /* V2 08/08 - sổ chỉ-đọc vào bằng cửa `tracuu`: có đường tới, chỉ là qua cửa cha. Cùng luật
      với `banglop` (vào từ một dòng ở trang Lớp học) - không phải trang mất đường. */
   if(typeof SOTRACUU!=="undefined"&&SOTRACUU.indexOf(k)>=0&&M["tracuu"])return;
   if(hubToiDuoc(k))return;                      /* chinh no la mot hub, tab cua no co tren menu */
   var ok=false;
   HUB.forEach(function(H){if(H[0]&&H[0][k]!==undefined&&hubToiDuoc(H[1]))ok=true});
   if(!ok)mat.push(k+" (\""+(pg.t||"?")+"\")")});
  t("menu khong lam mat duong toi trang nao - hoac khai duoc ly do",
    !mat.length, mat.slice(0,5).join(" · "));
  var thua=Object.keys(NGOAIMENU).filter(function(k){return !PBK[k]});
  t("ban khai trang-ngoai-menu khong nhac trang da bien mat", !thua.length, thua.join(", "));
  console.log("  Menu V5: "+Object.keys(M).length+" muc | trang khong toi duoc tu menu: "+
   mat.length+" | khai ly do: "+Object.keys(NGOAIMENU).length);
 })();

 /* (5) ĐỔI CỔNG phải trỏ đúng khi có BA thư mục cổng. Đã cắn: hàm cắt gốc đường dẫn chỉ biết
    hai tên cong-nhan-vien / cong-hoc-vien, nên đứng ở .../cong-nhan-vien-v6/ thì cắt không
    được, gốc tính ra chính thư mục đang đứng và nút "Cổng học viên" trỏ tới một chỗ 404.
    Đo bằng cách đặt chân vào từng địa chỉ thật rồi đọc hai đường ra. */
 (function(){
  var cuP=location.pathname, xau=[];
  function thu(p,mongNV,mongHV){
   location.pathname=p;
   var nv=congURL("nv"), hv=congURL("hv");
   if(nv!==mongNV)xau.push(p+" -> nv="+nv+" (mong "+mongNV+")");
   if(hv!==mongHV)xau.push(p+" -> hv="+hv+" (mong "+mongHV+")")}
  thu("/itts-sop-demo/cong-nhan-vien/","/itts-sop-demo/cong-nhan-vien/","/itts-sop-demo/cong-hoc-vien/");
  thu("/itts-sop-demo/cong-hoc-vien/","/itts-sop-demo/cong-nhan-vien/","/itts-sop-demo/cong-hoc-vien/");
  thu("/ITTs_WebApp_v5_demo.html","/ITTs_WebApp_v5_demo.html","/ITTs_TrangHocVien_demo.html");
  location.pathname=cuP;
  t("nút Đổi cổng trỏ đúng ở mọi thư mục cổng và cả khi mở thẳng file",
    !xau.length, xau.slice(0,3).join(" · "));

  /* Khoi "cong hoc vien nho khach dang xem ban nao" da bo 06/08: chi con MOT ban nen khong
     con gi de nho. Lich su trong git. */
 })();
 /* ĐỘ HOÀN THÀNH CỦA BẢN V6 - in ra mỗi lần chạy để nó không nằm im.
    Ba trạng thái, và phải tách bạch: có form trong ngăn kéo · là việc hàng loạt (khai lý do) ·
    CHƯA CHUYỂN. Gộp nhóm ba vào nhóm hai là giấu phần việc còn nợ - nhìn màn hình tưởng xong. */
 /* ĐỘ HOÀN THÀNH THẬT CỦA BẢN V6 - và bài học vì sao chỗ này phải CHẠY THỬ chứ không ĐẾM KHAI.
    Bản đếm cũ chỉ hỏi `typeof v.keo==="function"`. Nó nói 4/29 việc đã vào ngăn kéo - xanh, yên
    tâm. Nhưng hai trong bốn form ấy HỎNG: bảng DL03 khoá là `test_booking_id`, mã lại đọc
    `r.test_id`, nên nút Lưu sinh ra `bkLuuTest('')` và mã phiếu in ra rỗng. Khai một form không
    có nghĩa là có một form chạy được.
    Nay mỗi việc bị MỞ THẬT trên một hồ sơ thật, rồi soi: có ra HTML không · có nút bấm được
    không · nút có truyền khoá RỖNG không · hàm nó gọi có tồn tại không.
    Việc nào hôm nay không có hồ sơ thật thì MƯỢN một hồ sơ cùng bảng để vẫn chạy hết đường mã -
    bỏ qua nghĩa là chỗ dữ liệu mỏng thành chỗ không ai canh, mà đó là chỗ dễ gãy nhất. */
 (function(){
  var MO=0, TOASTED="", drawerCu=openDrawer, toastCu=toast;
  openDrawer=function(t,h){MO++;window.__bkH=String(h||"")};
  toast=function(m){TOASTED=String(m||"")};

  function hoSoThu(v){
   var T=TTBK[v.tt], ds=[];
   /* Thuc the co the duoc DUNG SAN tu du lieu khac (phu huynh dung tu ba cot nguoi giam ho
      cua DL09) - hoi T.nguon truoc, dung rows(T.bang) la ra bang rong. */
   try{ds=T.nguon?T.nguon():rows(T.bang)}catch(e){}
   var r=ds.filter(function(x){try{return v.khi(x)}catch(e){return false}})[0];
   return r?{r:r,that:true}:{r:ds[0],that:false}}

  function soiForm(h){
   h=String(h||"");
   var nut=h.match(/onclick="[^"]+"/g)||[];
   if(!nut.length)return "không có nút nào bấm được";
   var goi=[];
   nut.forEach(function(x){
    /* bỏ qua lời gọi PHƯƠNG THỨC (có dấu chấm đứng trước): event.stopPropagation() không phải
       hàm toàn cục, đòi nó tồn tại là chấm nhầm máy đo thành lỗi của app. */
    (x.match(/(\.?)\b([a-zA-Z_$][\w$]*)\(([^)]*)\)/g)||[]).forEach(function(g){
     if(g.charAt(0)===".")return;
     var m=g.match(/^([a-zA-Z_$][\w$]*)\(([^)]*)\)$/); if(!m)return;
     if(/^(closeModal|reRender|esc|event|return|if|for)$/.test(m[1]))return;
     goi.push(m)})});
   if(!goi.length)return "không nút nào gọi một hàm ghi";
   var rong=goi.filter(function(m){
    if(!m[2].trim())return false;
    return m[2].split(",").some(function(t){return /^\s*(''|"")\s*$/.test(t.trim())})});
   if(rong.length)return "nút truyền KHOÁ RỖNG: "+rong[0][0]+"("+rong[0][2]+")";
   var thieu=goi.filter(function(m){return typeof global[m[1]]!=="function"});
   if(thieu.length)return "gọi hàm không tồn tại: "+thieu[0][1];
   return ""}

  var xau=[], keo=0, mo=0, hl=0, chua=[], muon=0;
  VIECTT.forEach(function(v){
   var t=hoSoThu(v);
   if(!t.r){xau.push(v.t+": bảng "+TTBK[v.tt].bang+" không có dòng nào");return}
   if(!t.that)muon++;
   if(typeof v.keo==="function"){
    var h="";try{h=v.keo(t.r)}catch(e){xau.push(v.t+": keo() ném lỗi "+e.message);return}
    if(/class="empty"/.test(String(h))){
     if(t.that)xau.push(v.t+": mở ra màn rỗng dù hồ sơ đang có việc thật");
     else keo++; return}
    var l1=soiForm(h); if(l1){xau.push(v.t+": "+l1);return}
    keo++;
   }else if(typeof v.keoMo==="function"){
    MO=0;TOASTED="";window.__bkH="";
    try{v.keoMo(t.r)}catch(e){xau.push(v.t+": keoMo() ném lỗi "+e.message);return}
    if(!MO){
     if(t.that)xau.push(v.t+": keoMo() KHÔNG mở ngăn kéo nào"+(TOASTED?(" (toast: "+TOASTED+")"):""));
     else mo++; return}
    var hh=String(window.__bkH||"");
    if(hh.length<120){xau.push(v.t+": ngăn kéo mở ra gần như rỗng");return}
    var l2=soiForm(hh); if(l2){xau.push(v.t+": (ngăn kéo dùng lại) "+l2);return}
    mo++;
   }else if(v.vichung)hl++;
   else chua.push(v.tt+" · "+v.t)});

  openDrawer=drawerCu; toast=toastCu;
  console.log("  Viec lam TAI CHO: "+(keo+mo)+"/"+VIECTT.length+
   " (form rieng "+keo+" + ngan keo dung lai "+mo+") | hang loat da khai ly do: "+hl+
   " | CHUA CHUYEN: "+chua.length+" | muon ho so de thu: "+muon);
  if(chua.length)console.log("     con no: "+chua.join(" · "));
  t("mọi việc đã vào ngăn kéo đều MỞ THẬT được và không nút nào truyền khoá rỗng",
    !xau.length, xau.slice(0,4).join(" · "));
  t("mọi việc hoặc làm được tại chỗ, hoặc khai được vì sao phải sang trang",
    !chua.length, chua.slice(0,4).join(" · "));
 })();

 /* mọi việc phải có nút mở đúng chỗ làm - biết việc mà không tới được chỗ xử vẫn là ngõ cụt */
 var khongGo=(VIECTT||[]).filter(function(v){return typeof v.go!=="function"});
 t("mọi việc đều có nút mở chỗ xử lý", !khongGo.length, khongGo.map(function(v){return v.t}).join(" · "));
})();

/* ═════════ M9 · GIỌNG VĂN CHUYÊN NGHIỆP & CHỮ NGẮN GỌN ══════════════════════════════════
   Anh Luân 01/08: *"Việc cần cấp quản lý gật đầu? Ai lại dùng mấy từ như gật đầu trong app hả
   em? Chuyên nghiệp?"* và *"chỉ cần nói: Chế độ xem thử, rồi muốn giải thích thì dùng tooltip
   nó không gọn hơn à em."*
   Hai luật, cùng một gốc: CHỮ TRÊN MÀN LÀ CHỮ CỦA MỘT PHẦN MỀM VẬN HÀNH, không phải lời kể.
   (1) TỪ NGỮ - từ suồng sã ("gật đầu", "kẻo", "dắt tôi") nghe thân mật lúc viết, nhưng đọc trên
       màn của một trung tâm 5 chi nhánh thì thành thiếu nghiêm túc. Mỗi từ có bản thay thế đúng
       nghĩa và gọn hơn.
   (2) ĐỘ DÀI - đo được: 19/25 dải nhắc dài quá 110 ký tự, dài nhất 557, tức năm dòng chắn ngang
       đầu trang mà ngày nào cũng phải lướt qua. Chữ dài không phải chữ kỹ càng; nó là chữ chưa
       được biên tập. Phần giải thích chuyển vào chú thích rê chuột (dấu ngắt `||` của `goiyG`).
   Đo trên CHỮ HIỆN RA (vẽ thật mọi trang rồi bóc thẻ), không đo mã nguồn - chú thích mã nguồn
   viết cho người sửa app đọc, viết thoải mái thế nào cũng được. */
(function(){
 var TUXAU={
  "gật đầu":"phê duyệt", "kẻo":"tránh để", "dắt tôi":"xử lý từng bước", "dắt bạn":"hướng dẫn",
  "cho chắc":"cho chắc chắn", "đỡ mệt":"", "mỏi mắt":"", "tùm lum":"", "bạn nhé":"",
  "nhé bạn":"", "đó nha":"", "luôn nha":"", "khỏi phải":"không cần", "đỡ phải":"không cần",
  "chịu khó":"", "ai lại":"", "kỳ lắm":"", "ngon lành":"", "cứ thế":"", "toang":""};
 var pg=Object.keys(PBK).filter(function(k){return !PBK[k].hide});
 var CHU="";
 pg.forEach(function(k){CHU+=" "+chuThay(veTrang(k))});
 ["ch2","ch4","ch6","brand","menu","phanquyen","qa","demo"].forEach(function(tb){
  window.SETTAB=tb;CHU+=" "+chuThay(veTrang("settings"))});
 try{CHU+=" "+chuThay(JSON.stringify(TOURS))+" "+chuThay(JSON.stringify(THEDEF))}catch(e){}
 try{CHU+=" "+Object.keys(PBK).map(function(k){return (PBK[k].t||"")+" "+(PBK[k].c||"")}).join(" ")}catch(e){}
 var thay=[];
 Object.keys(TUXAU).forEach(function(w){
  if(CHU.toLowerCase().indexOf(w)>=0)thay.push('"'+w+'"'+(TUXAU[w]?(" -> nên dùng \""+TUXAU[w]+"\""):" -> bỏ hẳn"))});
 t("chữ trên màn không dùng từ suồng sã",!thay.length,thay.slice(0,5).join(" · "));

 /* Độ dài: đoạn nhắc trên đầu trang. Ngưỡng 150 ký tự - rộng hơn mức đã dọn (110) để chừa chỗ
    cho những đoạn có SỐ SỐNG chèn vào (tiền, ngày, tên khóa) vốn tự dài ra theo dữ liệu. */
 var HTMLALL="";
 pg.forEach(function(k){HTMLALL+="\n"+veTrang(k)});
 ["ch2","ch4","ch6","brand","menu","phanquyen","qa","demo"].forEach(function(tb){
  window.SETTAB=tb;HTMLALL+="\n"+veTrang("settings")});
 function bocDoan(cls){
  var re=new RegExp('<div class="'+cls+'[^"]*"[^>]*>([\\s\\S]*?)</div>',"g"),m,out=[];
  while((m=re.exec(HTMLALL))){var x=chuThay(m[1]);if(x.length>3)out.push(x)}
  var c={};return out.filter(function(x){if(c[x])return false;c[x]=1;return true})}
 var dai=[];
 ["notebar","fhint"].forEach(function(c){
  bocDoan(c).forEach(function(x){if(x.length>150)dai.push(c+" "+x.length+" ký tự: "+x.slice(0,70)+"...")})});
 t("đoạn nhắc đầu trang không quá 150 ký tự (phần dài đưa vào chú thích rê chuột)",
   !dai.length, dai.slice(0,4).join(" · "));
})();

/* ═════════ M7 · SỐ PHẢI SỬA ĐƯỢC - "cái này cấu hình ở đâu đấy?" ═════════════════════════
   Anh Luân bấm vào một con số trên màn rồi hỏi sửa ở đâu. Nếu không sửa được thì đó là hằng số
   của phần mềm chứ không phải thông số của trung tâm - trái LUẬT CỨNG.
   Cách đo: quét CHUỖI HIỂN THỊ trong mã nguồn tìm "số + đơn vị nghiệp vụ" nằm trần. */
(function(){
 /* Các số KHÔNG phải thông số nghiệp vụ. Mỗi dòng phải có LÝ DO ĐỌC ĐƯỢC - khai kiểu "bỏ qua"
    thì ba tháng sau không ai biết vì sao, và đó là lúc một cái sai thật lẻn vào cùng danh sách. */
 var SO_BOQUA=[
  {re:/theo SOP\)/,            vi:"trích nguyên văn SOP - sửa chữ là lệch khỏi tài liệu gốc"},
  {re:/\d+ b[uư][oơ]́?c/,       vi:"số bước của bài hướng dẫn - máy tự đếm, không ai đặt"},
  {re:/\d+ k[yý] t[uự]/,        vi:"ràng buộc kỹ thuật của ô nhập, không phải chính sách trung tâm"},
  {re:/0 t[oớ]i 9|0 [đd][eế]n 9/,vi:"thang điểm IELTS - hằng số của kỳ thi"},
  {re:/1-5|1 t[oớ]i 5/,         vi:"thang điểm khảo sát - đã khai ở CH1"},
  {re:/V[ií] d[uụ]:|\bvd[:.]? /i,vi:"câu VÍ DỤ / chữ mờ gợi ý cách gõ - không phải ngưỡng app chấp hành"},
  {re:/b[oộ]i s[oố] 7 ng[àa]y/, vi:"một tuần có 7 ngày - hằng số của lịch, không phải chính sách trung tâm"},
  {re:/trong \d+ ph[uú]t$|\d+ ph[uú]t\b/,vi:"ước lượng thời gian ĐỌC của bài hướng dẫn, app không đếm theo nó"},
  {re:/theo d[õo]i chuy[eê]n c[aầ]n \d+ tu[aầ]n/,vi:"lời khuyên nghiệp vụ cho người trực - app không dựng hàng chờ theo con số này"},
  {re:/v[ìi] sao SOP/,          vi:"câu hỏi mẫu trong hộp Trợ lý - là ví dụ để người dùng bắt chước gõ"},
  {re:/qu[áa] h[aạ]n 90 ng[àa]y/,vi:"mô tả TRIỆU CHỨNG của dữ liệu demo để lâu, không phải ngưỡng app chấp hành"},
  {re:/1-2 th[áa]ng sau/,       vi:"lời khuyên nghiệp vụ trong câu gợi ý, app không đếm theo nó"},
  {re:/Nh[aắ]c l[iị]ch test tr[uư][oớ]c/,vi:"câu KỊCH BẢN CHĂM SÓC ở RTOUCHDEF - trung tâm sửa cả câu trong Cài đặt, không chỉ con số"}];
 /* Lấy các chuỗi hiển thị: nằm trong dấu nháy, có dấu tiếng Việt, có số + đơn vị nghiệp vụ. */
 var DV="gi[oờ]|ng[aà]y|bu[oổ]i|l[aầ]n|ph[uú]t|tu[aầ]n|th[aá]ng|%";
 var re=new RegExp("['\"]([^'\"\\n]{8,150}?\\b\\d+\\s*(?:"+DV+")\\b[^'\"\\n]{0,80})['\"]","g");
 /* Quet tren ban DA BO CHU THICH: chu thich ma nguon ke lai loi cu ("quá hạn 90 ngày" trong
    mot doan ghi lai bay da can) khong phai chu hien ra man hinh. */
 var SRCX=SRC.replace(/\/\*[\s\S]*?\*\//g," ").replace(/^\s*#.*$/gm," ");
 var m,ngo=[];
 while((m=re.exec(SRCX))){
  var s=m[1];
  if(!/[àáạảãăằắâầấêềếôồốơờớưừứđ]/i.test(s))continue;      /* không phải câu tiếng Việt */
  if(/\{\d\}/.test(s))continue;                              /* câu mẫu CH4 - số thay lúc chạy */
  if(SO_BOQUA.some(function(x){return x.re.test(s)}))continue;
  /* Số đi kèm slaChip/kpiChip ngay cạnh thì đã sửa được - tìm trong 200 ký tự quanh đó. */
  var quanh=SRCX.slice(Math.max(0,m.index-200),m.index+m[0].length+200);
  if(/slaChip\(|kpiChip\(|paramOf\(|paramStr\(|msgText\(|kpiTh\(/.test(quanh))continue;
  ngo.push(s.slice(0,70))}
 var uniq=ngo.filter(function(v,i,a){return a.indexOf(v)===i});
 t("không câu hiển thị nào mang số nghiệp vụ cắm cứng (không có bánh răng trỏ tới)",
   uniq.length===0, uniq.slice(0,6).join(" | ")+
   " => dua so nay vao CH2 roi in bang slaChip(), hoac khai vao SO_BOQUA kem ly do doc duoc");
})();

/* ═════════ M8 · CHỖ ĐỨNG - "thứ này nằm đây có hợp lý không" ═════════════════════════════
   Anh Luân: *"công giảng dạy tự nhiên lại nằm trong sổ thu học phí, vô lý"*.
   Không máy nào tự biết chỗ nào hợp lý. Nhưng máy canh được HỢP ĐỒNG: mỗi màn khai mình thuộc
   về ai, và khai đó phải khớp với bảng dữ liệu nó đọc. Màn đọc bảng người (DL01) mà nằm trong
   nhóm tiền là đáng ngờ. */
(function(){
 var NHOMBANG={
  "DL01":"người",   "DL02":"khách","DL02b":"khách","DL03":"khách","DL04":"khách",
  "DL05":"sản phẩm","DL06":"tiền", "DL06b":"tiền", "DL07":"tiền",
  "DL08":"học","DL09":"học","DL10":"học","DL11":"học","DL12":"học","DL13":"học","DL14":"học",
  "DL15":"chăm sóc","DL16":"chăm sóc","DL17":"chăm sóc","DL18":"học","DL23":"việc"};
 var lech=[];
 Object.keys(LISTCFG).forEach(function(pg){
  var cfg=LISTCFG[pg],p=PBK[pg];if(!p||!cfg.code)return;
  var ho=NHOMBANG[cfg.code];if(!ho)return;
  /* Sổ tra cứu (ro:1) thì nhóm menu là "Tra cứu" - không nói gì về nghiệp vụ, bỏ qua. */
  if(cfg.ro)return;
  var g=String(p.g||"");
  if(ho==="người"&&/tiền|Tiền|thu|Thu/.test(g))lech.push(pg+" đọc bảng người mà xếp vào nhóm tiền ("+g+")")});
 t("màn nghiệp vụ không đứng nhầm họ (bảng người không nằm trong nhóm tiền)", !lech.length, lech.join(" · "));
 /* Hợp đồng cứng cho chỗ vừa dời (anh Luân đặt 31/07): bảng công ở trang Giảng viên. */
 window.GVTAB="cong";var hGv=veTrang("giangvien");
 window.STTAB="cong";var hSt=veTrang("dsthanhtoan");
 t("bảng công giảng dạy đứng ở trang Giảng viên", /Chia theo ca/.test(hGv));
 t("bảng công KHÔNG còn trong Sổ thu học phí", !/Chia theo ca/.test(hSt));
 window.GVTAB="ds";window.STTAB="da";
})();

/* ═════════ TIỆN DỤNG - "người dùng sẽ không gặp khó khăn" ════════════════════════════════
   Anh Luân đặt câu này lên trên hết. Ba thứ đo được, đều là ngõ cụt hay gặp: */

/* --- Ngõ cụt 1: màn hình không làm được việc gì và cũng không chỉ đi đâu ---
   Anh Luân: *"ở trong mấy cái sổ, ví dụ sổ khảo sát, chỉ xem được thôi hả, chứ ko có nghiệp vụ
   trong đó hả"*. Sổ chỉ-xem là hợp lý, nhưng phải có NÚT sang chỗ làm việc thật, không phải
   một câu chữ để người đọc tự đi tìm. */
(function(){
 var cut=[];
 Object.keys(LISTCFG).forEach(function(pg){
  var cfg=LISTCFG[pg];if(!cfg.ro)return;         /* trang làm việc thì tự nó có nút rồi */
  var h=veTrang(pg);if(h.indexOf("__LOI__")===0)return;
  /* "Duong ra" khong nhat thiet la nut o dau trang. Voi so ghi CON NGUOI (giang vien, nhan vien),
     cach lam viec dung la mo HO SO tung nguoi - link tren tung dong chinh la duong ra, va no con
     dung hon mot nut chung chung. Nen luat phai ke ca ba hinh thuc, khong thi bo kiem ep them mot
     cai nut thua vao mot man von da di duoc. */
  var coDuong=/onclick="go\(/.test(h)                              /* nut sang trang lam viec */
   ||/rowSlaBtn|class="rowact"/.test(h)                              /* nut thao tac tren dong */
   ||/openNSQuick\(|openHoso\(|openLopQuick\(|nguoiLnk/.test(h);    /* mo ho so tung dong */
  if(!coDuong)cut.push(pg)});
 t("sổ chỉ-xem nào cũng có ĐƯỜNG RA chỗ làm việc thật (nút đầu trang, nút trên dòng, hoặc mở hồ sơ)",
   !cut.length, cut.join(", ")+" - khai `lam:\"<trang>\"` trong LISTCFG hoặc cho cột đầu mở hồ sơ");
})();

/* --- Ngõ cụt 2: mở app lên mà không thấy việc ---
   Anh Luân: *"a đang ở admin đây em, ko thấy mấy cái em thay đổi ở đâu cả"*. Đóng vai từng
   chức danh, mở đúng trang đáp của họ, đòi trang đó nói được ít nhất một việc phải làm. */
(function(){
 var tay=[];
 var dai={};rows("DL01").forEach(function(x){var e;try{e=buildScope(ecode(x.role))}catch(err){return}
  if(e&&!dai[e.group])dai[e.group]={id:x.staff_id,land:e.land}});
 /* Đóng vai cho TRỌN: applyScope đặt phạm vi, CURSTAFF đặt danh tính. Thiếu vế sau thì mọi
    danh sách "của tôi" ra 0 dòng và bộ kiểm đổ oan cho app (bẫy đã cắn ở _checktour). */
 Object.keys(dai).forEach(function(g){
  applyScope(dai[g].id);CURSTAFF=dai[g].id;
  var h=veTrang(dai[g].land||"banlam");
  if(h.indexOf("__LOI__")===0){tay.push(g+" NÉM LỖI");return}
  /* Khớp TOKEN lớp CSS chứ không khớp cả chuỗi class: thẻ thật viết `class="bstat ro"` nên
    mẫu `class="bstat"` trượt. Bẫy này nằm im vì trang đáp của v5 tình cờ viết đúng một lớp. */
 var noi=/class="[^"]*\b(bstat|dstat|slarow|obcard|sechd|banrow|banjob)\b/.test(h);
  if(!noi)tay.push(g+" (trang đáp "+dai[g].land+" không nói được việc nào)")});
 applyScope("");CURSTAFF="";setRole("all");
 t("mọi chức danh mở app lên đều thấy việc ở trang đáp của mình ("+Object.keys(dai).length+" nhóm)",
   !tay.length, tay.join(" · "));
})();

/* --- Ngõ cụt 3: bảng rỗng mà không nói vì sao rỗng ---
   Danh sách ra 0 dòng phải có câu giải thích, không để màn trắng. */
(function(){
 var cam=[];
 Object.keys(LISTCFG).filter(function(pg){return PBK[pg]&&PBK[pg].ty==="list"}).forEach(function(pg){
  /* Ép rỗng bằng một từ khoá không thể có, rồi xem app nói gì. Chỉ trang BẢNG - trang thẻ có
     ô tìm riêng của nó, ép qua SEARCH[] không tới được. */
  SEARCH[pg]="zzzkhongcogizzz";
  var h=veTrang(pg);
  SEARCH[pg]="";
  if(h.indexOf("__LOI__")===0){cam.push(pg+" NÉM LỖI khi rỗng");return}
  if(!/class="empty"/.test(h))cam.push(pg)});
 t("danh sách ra 0 dòng thì nói rõ vì sao, không để màn trắng", !cam.length, cam.slice(0,6).join(", "));
})();

/* ═════════ M6b · TỪ VIẾT TẮT HIỆN RA MÀ KHÔNG TRA ĐƯỢC ══════════════════════════════════
   Anh Luân: *"trợ lý có đọc được định nghĩa mấy từ viết tắt mà ta, sao giờ a tra thử ko thấy"*.
   Đo bằng máy: vẽ THẬT mọi trang, đếm từ viết tắt hiện ra, rồi hỏi từ điển từng cái.
   Đo ra lần đầu: **118 từ hiện ra, từ điển định nghĩa 10**. Nay từ điển đọc thẳng CH6 + SHEETVN
   nên nó tự lớn theo app - thêm một chỉ số vào CH6 là có ngay mục từ điển, không phải nhớ. */
var TAT_BOQUA={
 HV:"viết tắt của Học viên - đã có mục 'lead' và 'at_risk' giải nghĩa ngữ cảnh xung quanh",
 NV:"viết tắt của Nhân viên - hiểu được ngay trong câu, không cần tra",
 GV:"viết tắt của Giáo viên - hiểu được ngay trong câu",
 CAO:"không phải từ viết tắt - là chữ 'cao' viết hoa để nhấn mức độ, trong 'Khiếu nại mức CAO'. "+
  "Lộ ra khi bảng việc của chức danh về đúng chỗ trên Bàn làm việc của bản v6.",
 ITTs:"tên trung tâm", IELTS:"tên kỳ thi", VND:"đơn vị tiền Việt Nam",
 OK:"từ thông dụng", ID:"từ thông dụng", CSV:"định dạng tệp, hiện trong câu 'mở được bằng Excel'",
 AI:"đã giải thích ngay tại khối cấu hình AI trong Cài đặt", API:"đi liền chữ 'API key' ở màn cấu hình",
 SMS:"kênh nhắn tin - hiểu được ngay trong câu", FB:"Facebook - hiện trong tên nguồn lead",
 TG:"cột Thời gian trong bảng - có tiêu đề cột đứng ngay trên",
 /* Ten khoa/lop trong DU LIEU demo da bi luat pham vi loc - khong can khai o day nua. */
 };
(function(){
 var chu="";
 setRole("all");
 Object.keys(PBK).forEach(function(pg){var h=veTrang(pg);if(h.indexOf("__LOI__")!==0)chu+=" "+h});
 var tho=chuThay(chu);
 /* THUOC PHAI DUNG - do lan dau bat 10 tu, 6 trong so do la em do sai:
    · QU / CH / NH la MANH cua "QUÁ HẠN", "CHẶNG", "VẬN HÀNH" - chu Viet viet hoa bi cat doi
      boi nguyen am co dau (Á, Ặ, À) vi chung khong nam trong [A-Z];
    · ENR / LOP / PAY la TIEN TO MA dong (ENR-2026-001), khong phai tu viet tat;
    · PLA nam trong TEN LOP cua du lieu demo ("Foundation PLA T7-CN"), khong phai tu vung cua app;
    · CN / T7 la thu trong tuan.
    Nen loc ba nhom do truoc khi ket luan. Doi dinh nghia cho mot manh chu la doi mot thu vo
    nghia, va bo kiem doi thu vo nghia thi lan sau khong ai doc no. */
 var THU={CN:1,T2:1,T3:1,T4:1,T5:1,T6:1,T7:1};
 var dem={};
 /* ĐỌC NGỮ CẢNH THEO VỊ TRÍ, KHÔNG BẮT BẰNG NHÓM. Bẫy vừa cắn: viết `(.?)\b(...)\b(.?)` thì
    nhóm đuôi ĂN MẤT ký tự đứng sau - khớp "CH" nuốt luôn "Ặ", nên lần khớp kế tiếp thấy "NG"
    với ngữ cảnh trước là RỖNG và bộ lọc "mảnh cụm viết hoa" không cắn được. Đo ra mới thấy:
    cả hai bộ lọc em vừa thêm đều im lặng không làm gì. */
 var HOAVN=/[A-Z\u00C0-\u00DD\u0102\u0110\u0128\u0168\u01A0\u01AF\u1EA0-\u1EF8]/;
 var reT=/\b(CH[1-9]|BC[1-9]|VH\d{1,2}|DL\d{2}[a-z]?|NA\d{3}|[A-Z]{2,6}\d{0,2})\b/g,mT;
 function tuKe(txt,i,lui){         /* từ liền kề (cách bởi đúng một khoảng trắng) */
  var m=lui?txt.slice(0,i).match(/(\S+)\s?$/):txt.slice(i).match(/^\s?(\S+)/);
  return m?m[1]:""}
 while((mT=reT.exec(tho))){
  var w=mT[1], i0=mT.index, i1=i0+w.length;
  var truoc=i0>0?tho.charAt(i0-1):"", sau=tho.charAt(i1);
  if(THU[w])continue;
  if(sau==="-"||truoc==="-")continue;                          /* tiền tố mã: KN-2026, T7-CN */
  if(HOAVN.test(truoc)||HOAVN.test(sau))continue;              /* mảnh của một cụm viết hoa */
  /* Chữ Việt VIẾT HOA để nhấn mạnh ("GỌI NGAY", "VẬN HÀNH LỚP") - từ liền kề cũng viết hoa thì
     đây là câu nhấn giọng chứ không phải từ viết tắt cần tra nghĩa. */
  var t1=tuKe(tho,i0,1), t2=tuKe(tho,i1,0);
  function laHoa(x){return x.length>=2&&x===x.toUpperCase()&&/[A-Z\u00C0-\u1EF9]/.test(x)}
  if(laHoa(t1)||laHoa(t2))continue;
  dem[w]=(dem[w]||0)+1}
 var tudien={};
 try{qaTuDien().forEach(function(m){tudien[String(m.t).toUpperCase()]=1})}catch(e){}
 /* Mã có tiền tố (DL09, BC7, NA050, VH3) tra được qua mục tiền tố - không đòi từng mã một. */
 function traDuoc(w){
  if(tudien[w])return true;
  var m=w.match(/^(DL|BC|VH|NA|CH)\d/);
  return !!(m&&tudien[m[1]])}
 /* PHAM VI DUNG: chi doi dinh nghia cho tu viet tat do CHINH APP viet ra. Chay lan dau moi
    thay minh dang duoi theo ca ten khoa hoc va ten lop trong DU LIEU demo (GOLD, PRIME, EVO,
    MASTER, ELITE, CN4...) - app khong chiu trach nhiem dinh nghia ten san pham cua trung tam,
    va neu doi thi danh sach mien tru se phinh mai khong het. Loc bang cach hoi: tu nay co xuat
    hien nhu MOT CHUOI trong ma nguon app khong. */
 var chuApp=SRC.replace(/\/\*[\s\S]*?\*\//g," ").replace(/^\s*#.*$/gm," ");
 function laCuaApp(w){
  var re=new RegExp("['\"][^'\"\\n]{0,120}\\b"+w+"\\b");
  try{return re.test(chuApp)}catch(e){return true}}
 var thieu=Object.keys(dem).filter(function(w){
  return dem[w]>=2&&!TAT_BOQUA[w]&&!traDuoc(w)&&laCuaApp(w)}).sort(function(a,b){return dem[b]-dem[a]});
 t("từ viết tắt hiện trên màn đều tra được ở từ điển ("+Object.keys(dem).length+" từ)",
   !thieu.length, thieu.slice(0,10).join(", ")+" => them vao CH6/QATUDIENDEF, hoac khai TAT_BOQUA kem ly do");
})();

/* ═════════ ĐỒNG BỘ - thứ phụ thuộc phải theo kịp ════════════════════════════════════════
   Anh Luân: *"a dặn là mỗi lần có thay đổi thì kiểm tra lại tour và trợ lý xem có cần sửa gì ko
   đó có nhớ ko"*. Ba thứ ăn theo app: hướng dẫn, Trợ lý, tài liệu. _checktour đã canh hướng dẫn;
   ở đây canh hai thứ còn lại. */
(function(){
 /* Trợ lý phải trả lời được về MỌI trang có thật - không thì người hỏi rơi vào khoảng không. */
 var khong=[];
 Object.keys(PBK).forEach(function(pg){
  if(PBK[pg].hide)return;
  var ten=String(PBK[pg].t||"");if(!ten)return;
  var r=null;try{r=qaTraLoi?qaTraLoi(ten):null}catch(e){}
  if(r===null)return;                            /* app chưa có hàm này thì bỏ qua, không đổ oan */
  if(!r||!String(r).trim())khong.push(pg)});
 t("Trợ lý trả lời được về mọi trang có thật", !khong.length, khong.slice(0,6).join(", "));
})();
(function(){
 /* Tài liệu bàn giao phải nhắc tới mọi bộ kiểm đang chạy - thêm bộ kiểm mà quên ghi thì người
    nhận bàn giao không biết nó canh gì, và đó là bước đầu của việc bỏ mặc nó. */
 var doc="";try{doc=FS.readFileSync('./README_SRC.md','utf8')}catch(e){}
 t("đọc được README_SRC.md", !!doc);
 if(!doc)return;
 var bo=FS.readdirSync('.').filter(function(f){return /^_check.*\.js$/.test(f)||/^check_.*\.py$/.test(f)});
 var thieu=bo.filter(function(f){return doc.indexOf(f)<0});
 t("README_SRC nhắc tới mọi bộ kiểm đang có ("+bo.length+" bộ)", !thieu.length, thieu.join(", "));
})();

/* ═════════ ĐỘ PHỦ SOP - LUẬT CỨNG SỐ 0 ══════════════════════════════════════════════════
   check_sop.py đã đối chiếu bốn mặt với file SOP gốc. Ở đây thêm một mặt nó không với tới:
   mỗi trang app khai mình phục vụ màn SOP nào, và khai đó phải trỏ vào màn có thật. */
(function(){
 var sop="";try{sop=FS.readFileSync('./check_sop.py','utf8')}catch(e){}
 t("đọc được bản khai đối chiếu SOP", !!sop);
 if(!sop)return;
 /* Mọi mục BOQUA trong check_sop phải có LÝ DO đọc được, không được để chuỗi rỗng. */
 var reB=/"([^"]+)"\s*:\s*"([^"]*)"/g,m,rong=[];
 var khoi=sop.split(/^[A-Z0-9_]+_BOQUA\s*=\s*\{/m);
 khoi.slice(1).forEach(function(k){
  var than=k.split(/^\}/m)[0];var mm;var re2=/"([^"]+)"\s*:\s*"([^"]*)"/g;
  while((mm=re2.exec(than))){if(String(mm[2]).trim().length<12)rong.push(mm[1])}});
 t("mọi chỗ SOP mô tả mà app bỏ qua đều có lý do đọc được", !rong.length, rong.slice(0,6).join(", "));
})();

/* ═════════ M9 - BA CÂU CÃI NHAU TRÊN MỘT MÀN (phương pháp thứ chín, đặt 09/08) ═══════════
   Tám phương pháp trên rút từ 43 phát hiện của anh Luân. Đợt audit 09/08 sinh ra phương pháp
   thứ chín, và nó bắt được lỗ LUẬT SỐ 0 to nhất của cả tuần: **đọc TRỌN một màn rồi hỏi các câu
   trên màn có nói ngược nhau không.**

   Chuyện đã xảy ra: mở ngăn kéo 360 của HV061 thì đầu ngăn kéo là chip "Nguy cơ" kèm câu *"vì
   sao: máy thấy vượt ngưỡng - thiếu 3 bài"*, còn cuối ngăn kéo lại ghi *"Việc cần làm theo SOP ·
   NA018: HV đang học đều và ổn định. Không cần làm gì thêm."* Hai câu ấy cách nhau đúng một màn
   hình, và chúng phủ định nhau. Gốc: `jNaCode` chọn câu việc THEO CHẶNG (`JNA.learning`), không
   hỏi hồ sơ có đang bị gắn cờ nguy cơ không - trong khi `naFor("DL09",S)` (hàm mà `check_sop.py`
   chạy thật trên 93 tình huống HD3) trả đúng NA015/NA016/NA017/NA064/NA065.
   Đo được lúc ấy: **13/13 học viên đang học mà có nguy cơ đều bị màn hình bảo "không cần làm gì
   thêm"** - app TÍNH ĐƯỢC việc phải làm mà màn hình lại trấn an ngược.

   VÌ SAO 40 BỘ KIỂM KHÔNG THẤY: `check_sop.py` canh **HÀM** `naFor` (đúng), `_checkbam` canh ngăn
   kéo **có nội dung và có nút** (đúng), `_checklap` canh **không nói hai lần** (đúng). Không bộ
   nào hỏi: *cái hàm tính đúng ấy có được in ra màn không.* Chỗ nối giữa hàm đúng và màn hình là
   một vùng trống - và một chỗ nối không ai canh thì hỏng trong im lặng.

   PHÉP HỎI: với MỌI hồ sơ học viên, mã việc SOP mà tầng hành trình đưa ra màn (`jInfo().na`) phải
   khớp mã mà `naFor("DL09", hồ sơ)` tính ra, MỖI KHI hồ sơ đang có cờ nguy cơ. Ngoài cờ nguy cơ
   thì câu theo chặng vẫn đúng - chặng là ngữ cảnh, không phải mâu thuẫn. */
(function(){
 if(typeof jIndex!=="function"||typeof jInfo!=="function"||typeof naFor!=="function"){
  t("đo được tầng hành trình", false, "thiếu jIndex/jInfo/naFor"); return}
 var ix; try{ix=jIndex()}catch(e){t("dựng được bảng tra hành trình",false,String(e.message).slice(0,60));return}
 var soHV=0, nguyCo=0, lech=[];
 (DL.DL09||[]).forEach(function(S){
  soHV++;
  var r=false; try{r=stuRisk(S)}catch(e){}
  if(!r)return;
  nguyCo++;
  var man="", that="";
  try{man=(jInfo(S.student_id,ix)||{}).na||""}catch(e){}
  try{that=naFor("DL09",S)||""}catch(e){}
  if(!that)return;                       /* không tính được thì không có gì để đối chiếu */
  if(man!==that)lech.push(S.student_id+": màn in "+(man||"(trống)")+" · app tính "+that);
 });
 t("đọc được hồ sơ học viên để đối chiếu", soHV>0, soHV+" hồ sơ");
 t("mọi hồ sơ có cờ nguy cơ đều được màn hình in ĐÚNG việc SOP mà app tính ra ("+nguyCo+" hồ sơ)",
   !lech.length, lech.slice(0,5).join(" | "));
})();

/* ═════════ M9b - CÂU RA LỆNH CÒN SỐNG TRÊN HỒ SƠ ĐÃ XONG ════════════════════════════════
   Cùng phương pháp M9 (đọc trọn một màn rồi hỏi các câu có cãi nhau không), bắt một dạng khác:
   không phải hai con số lệch, mà **một lời giục việc đã làm xong**.
   Tìm ra 09/08 trên trang Buổi WOW: thẻ mang chip "Xong" mà ngay dưới vẫn ghi *"cần xác nhận
   giảng viên và giờ chính thức rồi báo lại học viên đó"*. Đo được: **39/46 buổi học viên tự đặt**
   đã xác nhận / đã dạy / đã huỷ mà vẫn đeo câu giục. Gốc là trộn hai loại câu vào một chuỗi:
   "Học viên tự đặt qua cổng" là SỰ THẬT (đúng mọi lúc), "cần xác nhận rồi báo lại" là VIỆC (chỉ
   đúng ở nấc chờ). Tới lúc việc xong, câu ấy thành một lời nói dối nhỏ - và một màn hình nói dối
   vài chỗ nhỏ thì người dùng thôi tin cả những chỗ nó nói thật.

   HAI BẢN ĐẦU CỦA PHÉP HỎI NÀY ĐỀU SAI, ghi lại vì cùng một bài học:
   (1) soi chuỗi HTML của TRỌN TRANG -> đỏ cả khi app đã đúng, vì trang luôn có 13 buổi còn ở nấc
       chờ và chúng hiện câu giục là ĐÚNG. Hỏi cả trang thì không phân biệt "câu giục ở chỗ sai"
       với "câu giục ở chỗ đúng".
   (2) cắt theo thẻ rồi đọc NHÃN CHIP để đoán trạng thái -> vẫn sai, vì chip là chip TIẾN ĐỘ:
       `booked`, `confirmed` và `cancelled` cùng hiện "Đang xử lý". Đoán trạng thái từ một nhãn
       gộp ba trạng thái thì đoán kiểu gì cũng trượt.
   Bản này khớp từng thẻ về ĐÚNG BẢN GHI của nó (tên học viên + ngày giờ), rồi hỏi trạng thái
   thật trong DL14. Đối chiếu được 91/92 mảnh; mảnh không khớp là phần đầu trang, không phải thẻ.
   (Chính lượt đo này lộ thêm một lỗi thật: 3 buổi `cancelled` đeo chip "Đang xử lý" - đã vá.) */
(function(){
 var h="";
 try{CUR="wow";if(window.FILT)FILT.wow=[];h=String(RENDER.wow?RENDER.wow():"")}catch(e){}
 t("vẽ được trang Buổi WOW để soi từng thẻ", h.length>500);
 if(h.length<=500)return;
 /* bảng tra: "tên học viên|ngày giờ" -> trạng thái thật */
 var tra={};
 (DL.DL14||[]).forEach(function(w){
  var S=find("DL09","student_id",w.student_id)||{};
  tra[(S.full_name||"")+"|"+String(w.wow_session_date||"").slice(0,16)]=String(w.wow_status||"");
 });
 var giuc=[], soThe=0, khopDuoc=0;
 h.split('<div class="obcard').slice(1).forEach(function(x){
  soThe++;
  var tho=x.replace(/<[^>]*>/g," ").replace(/\s+/g," ");
  var m=tho.match(/^"?>?\s*([^·]{2,40}?)\s+(?:Nghe|Nói|Đọc|Viết|Ngữ pháp|Từ vựng)\s*·\s*(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})/);
  if(!m)return;
  var st=tra[m[1].trim()+"|"+m[2]]; if(!st)return;
  khopDuoc++;
  if(isc(st,"booked"))return;                    /* còn ở nấc chờ - câu giục là ĐÚNG */
  if(/cần xác nhận giảng viên/.test(x))giuc.push(m[1].trim()+" ("+st+")");
 });
 t("khớp được thẻ WOW về đúng bản ghi của nó ("+khopDuoc+"/"+soThe+" thẻ)", khopDuoc>60);
 t("thẻ WOW đã qua nấc chờ thì không còn câu giục 'cần xác nhận'", !giuc.length,
   giuc.slice(0,4).join(" | "));
 /* Và chip trên thẻ phải nói đúng buổi đã huỷ - lỗi tìm ra cùng lượt đo này. */
 var huy=[];
 h.split('<div class="obcard').slice(1).forEach(function(x){
  var tho=x.replace(/<[^>]*>/g," ").replace(/\s+/g," ");
  var m=tho.match(/^"?>?\s*([^·]{2,40}?)\s+(?:Nghe|Nói|Đọc|Viết|Ngữ pháp|Từ vựng)\s*·\s*(\d{2}\/\d{2}\/\d{4} \d{2}:\d{2})/);
  if(!m)return;
  var st=tra[m[1].trim()+"|"+m[2]]; if(!st||!isc(st,"cancelled"))return;
  if(/Đang xử lý|Xong|HV vắng|Quá hạn ghi chú/.test(x)&&!/Đã huỷ/.test(x))
   huy.push(m[1].trim());
 });
 t("buổi WOW đã huỷ hiện đúng là đã huỷ, không phải 'Đang xử lý'", !huy.length, huy.slice(0,4).join(", "));
})();

/* ═════════ M10 - Ô CHỌN MỞ CỬA (phương pháp thứ mười, đặt 09/08) ═════════════════════════
   Cùng đợt audit 09/08, hai lỗ rò rỉ phạm vi dữ liệu đều nằm ở một chỗ không ai ngờ: **một ô
   `<select>`**. Ô "Của giảng viên" cho giáo viên thường xem số của 14 giảng viên khác; ô "Từ NV"
   cho nhân viên tư vấn thường đọc trọn sổ lead của đồng nghiệp cả 5 cơ sở.
   `_checknguoi` nay canh chuyện đó bằng cách VẼ THẬT các trang trên menu của từng người. Bộ kiểm
   này canh vế còn lại: **đọc MÃ NGUỒN** để hỏi *"còn chỗ nào nữa không"* - vẽ trang chỉ thấy
   những trang mình nghĩ ra để vẽ, đọc mã thì thấy cả những chỗ mình quên mất là có.

   PHÉP HỎI: một hàm vừa dựng ô chọn ĐỔI MÀN NHÌN (`<select ... onchange=...>`) vừa lấy danh sách
   người từ `rows("DL01")`, thì trong chính hàm ấy phải có một câu hỏi phạm vi
   (`banQuanLy` / `myTeam` / `banToanQuyen` / `SCOPE` / `CURSTAFF`).

   BẢN ĐẦU CỦA PHÉP HỎI NÀY TỰ TỐ OAN HAI CHỖ - ghi lại vì đúng cái bẫy nó sinh ra để bắt:
   nó cắt "thân hàm" bằng cách tách chuỗi ở mỗi `function render[A-Z]`, nên "thân" của `renderWow`
   dài **33.691 ký tự** và ôm luôn cả chục hàm khác (`wowNote`, form đặt buổi...). Ô `<select
   id="wa_stu">` nằm trong FORM ĐẶT BUỔI - một ô nhập của cửa ghi - bị tính thành ô của
   `renderWow`. **Đo một khúc văn bản rồi gọi nó là thân hàm thì kết quả nào cũng có vẻ đúng.**
   Nay cắt thân hàm bằng ĐẾM NGOẶC, đúng như trình duyệt hiểu. */
(function(){
 var src=""; try{src=FS.readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8')}catch(e){}
 t("đọc được thân app để soi ô chọn người", !!src);
 if(!src)return;

 /* Cắt thân hàm bằng đếm ngoặc - bỏ qua ngoặc nằm trong chuỗi và trong chú thích. */
 function thanHam(s,tu){
  var i=s.indexOf("{",tu); if(i<0)return "";
  var sau=1,j=i+1,nhay=0,thoat=false;
  while(j<s.length&&sau>0){
   var c=s[j];
   if(nhay){
    if(thoat)thoat=false;
    else if(c==="\\")thoat=true;
    else if(c===nhay)nhay=0;
   }else if(c==='"'||c==="'"||c==="`"){nhay=c}
   else if(c==="/"&&s[j+1]==="*"){var k=s.indexOf("*/",j+2);j=(k<0?s.length:k+1)}
   else if(c==="/"&&s[j+1]==="/"){var k2=s.indexOf("\n",j+2);j=(k2<0?s.length:k2)}
   else if(c==="{")sau++;
   else if(c==="}")sau--;
   j++;
   if(j-i>400000)break;              /* chặn an toàn, không hàm nào dài thế */
  }
  return s.slice(i,j);
 }

 /* Ngoại lệ, phải nói được VÌ SAO. Chỉ khai khi CHÍNH TRANG chứa nó đã là cửa khoá - lúc ấy
    câu hỏi phạm vi nằm ở cửa vào, hỏi lại lần nữa trong hàm là thừa. Khai vì "chắc không sao"
    là sai, và là cách một lỗ rò biến mất khỏi phép canh. */
 var OCHON_BOQUA={
  giaGioHTML:"bang don gia gio day, nam trong tab Gia gio cua trang Cai dat - do duoc 09/08: "+
             "ca 5 chuc danh thu (giao vien, tu van, marketing, TP Hoc vu, TP Ke toan) deu bi "+
             "chan ngay o cua vao trang settings, chi Giam doc mo duoc. Cua khoa dat o TRANG, "+
             "khong dat trong ham"
 };
 var re=/function\s+([A-Za-z0-9_$]+)\s*\(/g, m, ngo=[], soHam=0, soCoOChon=0;
 while((m=re.exec(src))){
  var ten=m[1];
  var than=thanHam(src,m.index+m[0].length);
  if(!than)continue;
  soHam++;
  /* Ô CHỌN ĐỔI MÀN NHÌN, hỏi cho ĐÚNG: `onchange` của nó phải VẼ LẠI MÀN (`reRender` / `go(`)
     hoặc đặt một biến toàn cục quyết định màn hình xem gì (`window.X=`).
     Chỉ hỏi "có onchange không" là chưa đủ - đã tố oan `tkNew`: ô `<select id="tk_to"
     onchange="tkTypeAuto()">` là ô chọn NGƯỜI NHẬN VIỆC của form Giao việc mới; `tkTypeAuto`
     chỉ đoán lại loại việc theo quan hệ cấp trên - cấp dưới, nó không đổi một dòng dữ liệu nào
     trên màn. Giao việc ĐI cho ai thì không đọc được gì của người ấy.
     Hai thứ trông giống hệt nhau trong HTML mà khác hẳn về nghĩa: một bên là CỬA XEM, một bên
     là Ô NHẬP. Phân biệt bằng chỗ `onchange` dẫn tới, không bằng sự có mặt của nó. */
  var coONhin=/<select[^>]*\sonchange="[^"]*(?:reRender|go\(|window\.[A-Za-z0-9_]+\s*=)/.test(than);
  if(!coONhin)continue;
  /* danh sách người: lấy từ bảng nhân sự và in ra `staff_id` */
  if(!/rows\("DL01"\)/.test(than))continue;
  if(!/staff_id/.test(than))continue;
  soCoOChon++;
  if(OCHON_BOQUA[ten])continue;
  if(!/banQuanLy\(|myTeam\(|banToanQuyen\(|SCOPE\(|CURSTAFF/.test(than))ngo.push(ten);
 }
 t("cắt được thân hàm để soi ("+soHam+" hàm)", soHam>200, soHam+" hàm");
 t("mọi ô chọn NGƯỜI đổi màn nhìn đều đi qua một câu hỏi phạm vi ("+soCoOChon+" ô)",
   !ngo.length, ngo.slice(0,6).join(", "));
})();

/* ═════════ M11 - KIỂU Ô KHAI RA MÀ BỘ VẼ Ô KHÔNG BIẾT (đặt 09/08) ════════════════════════
   Bẫy vừa cắn, và nó sống gần một tuần mà không ai hay: bảng Học viên khai hai cột kiểu
   `calcso` (**Vắng (buổi)**, **Thiếu bài**), còn `cell()` - bộ vẽ ô dùng chung - chỉ hỏi
   `ty==="calc"||ty==="calcmoney"` ở cửa vào. Hai cột ấy không bao giờ đi vào nhánh tính; chúng
   rơi xuống nhánh chung, đọc `r["__vang"]` (một khoá không tồn tại) rồi in dấu "-".
   Đo được lúc tìm ra: **10/20 dòng đầu ghi "-" ở cột Thiếu bài trong khi máy đếm 1-3 bài thiếu
   cho chính những em đó** - trong đó có học viên mà hồ sơ 360 nói rõ "thiếu 3 bài (ngưỡng 3)".

   VÌ SAO KHÔNG BỘ KIỂM NÀO THẤY: bảng vẫn vẽ ra bình thường, không lỗi JS, không ô trống, không
   cuộn ngang - chỉ có một dấu gạch **trông rất hợp lệ** ở chỗ đáng lẽ là con số. `_checkdem` đối
   chiếu số trên THẺ với danh sách, không đối chiếu CỘT với hàm tính. `_checkmat` đo hình học.
   Cái chết lặng lẽ nhất của một tính năng là nó vẫn vẽ ra được.

   HAI PHÉP HỎI:
   (a) CẤU TRÚC - mọi kiểu ô khai trong `LISTCFG[*].cols` đều phải có tên trong thân `cell()`.
       Đây mới là phép hỏi bắt được CẢ HỌ: thêm một kiểu ô mới mà quên nối là đỏ ngay, không
       cần ai nghĩ ra trường hợp cụ thể.
   (b) THỰC TẾ - với bảng Học viên, không dòng nào được in "-" ở cột mà hàm tính trả về số > 0. */
(function(){
 var src=""; try{src=FS.readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8')}catch(e){}
 if(!src){t("đọc được thân app để soi kiểu ô", false); return}
 /* (a) mọi kiểu ô khai ra đều được `cell()` biết mặt */
 var i=src.indexOf("function cell(r,col,sheet)");
 var than=i<0?"":src.slice(i,i+6000);
 /* BÓC CHÚ THÍCH TRƯỚC KHI HỎI. Không bóc thì một cái tên chỉ được NHẮC TỚI trong ghi chú cũng
    làm phép hỏi này xanh - đúng loại "đèn xanh trên một phép đo đã mất" mà dự án này cấm. Chính
    ghi chú giải thích bản vá `calcso` có chứa chuỗi `ty==="calcmoney"`; để nguyên là bộ kiểm tự
    ru ngủ mình bằng lời mình vừa viết. */
 than=than.replace(/\/\*[\s\S]*?\*\//g," ").replace(/(^|[^:])\/\/[^\n]*/g,"$1 ");
 t("tìm được bộ vẽ ô dùng chung `cell()`", !!than);
 var kieu={}, soCot=0;
 try{Object.keys(LISTCFG||{}).forEach(function(pg){
   ((LISTCFG[pg]||{}).cols||[]).forEach(function(c){soCot++;if(c[2])kieu[c[2]]=(kieu[c[2]]||0)+1})})}catch(e){}
 var la=Object.keys(kieu);
 t("đọc được bản khai cột của các bảng ("+soCot+" cột, "+la.length+" kiểu ô)", la.length>3);
 var khongBiet=la.filter(function(k){return than.indexOf('"'+k+'"')<0});
 t("mọi kiểu ô khai trong bảng đều được `cell()` xử lý", !khongBiet.length,
   khongBiet.map(function(k){return k+" ("+kieu[k]+" cột)"}).join(", "));

 /* (b) cột tính ra số > 0 thì không được in dấu gạch */
 var lech=[];
 try{
  var cfg=LISTCFG["hocvien"]||{};
  var cotTinh=(cfg.cols||[]).filter(function(c){return /^calc/.test(String(c[2]||""))});
  (DL.DL09||[]).slice(0,60).forEach(function(r){
   cotTinh.forEach(function(c){
    var so=0; try{so=calcCol(c[0],r,"DL09")}catch(e){}
    if(!(so>0))return;
    var o=""; try{o=String(cell(r,c,"DL09")||"")}catch(e){o="LOI"}
    if(/>-<|>\s*-\s*</.test(o)||o.indexOf(String(so))<0)
     lech.push(r.student_id+" · "+c[1]+": ô vẽ ra \""+o.replace(/<[^>]*>/g,"").trim()+"\" mà hàm tính ra "+so);
   })})}catch(e){lech.push("khong do duoc: "+String(e.message).slice(0,60))}
 t("cột tính của bảng Học viên in đúng con số hàm tính ra", !lech.length, lech.slice(0,5).join(" | "));
})();

/* ═════════════════════════════════════════════════════════════════════════════════════════ */
if(bad.length){
 console.log("CHECKAUDIT DO ("+bad.length+"/"+n+"):");
 bad.forEach(function(b){console.log("  - "+b)});
 process.exit(1)}
console.log("CHECKAUDIT OK: "+n+" tieu chi | 11 phuong phap tim loi (8 cua anh Luan + M9 ba cau cai nhau tren mot man, M10 o chon mo cua, M11 kieu o khai ra ma bo ve o khong biet), nay may chay lai");
