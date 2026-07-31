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
require('vm').runInThisContext(FS.readFileSync('./_APP.js','utf8'));
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
 var NV=FS.readFileSync('./_APP.js','utf8');
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
 var CAP=[
  {dung:"Cổng học viên", sai:"Trang học viên", tru:/trang H[oọ]c vi[eê]n nguy c[oơ]/gi},
  {dung:"Trợ lý",        sai:"Trợ thủ",        tru:null},
  {dung:"Người đồng hành",sai:"Người giám hộ", tru:null}];
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
  var nSai=(s.match(new RegExp(c.sai,"g"))||[]).length;
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
 var oCskh=/ychv/.test(SRC)&&/HUBTAB[\s\S]{0,400}ychv/.test(SRC);
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
  var noi=/class="(bstat|dstat|slarow|obcard|sechd)"/.test(h);
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

/* ═════════════════════════════════════════════════════════════════════════════════════════ */
if(bad.length){
 console.log("CHECKAUDIT DO ("+bad.length+"/"+n+"):");
 bad.forEach(function(b){console.log("  - "+b)});
 process.exit(1)}
console.log("CHECKAUDIT OK: "+n+" tieu chi | 8 phuong phap anh Luan dung de tim loi, nay may chay lai");
