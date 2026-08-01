/* _checkdemo.js - MỞ APP VÀO BẢY THỨ TRONG TUẦN, NGÀY NÀO CŨNG PHẢI CÓ VIỆC
   Chạy: ITTS_OUT=<out> node _checkdemo.js   (cần _APP.js đã trích sẵn)

   ┌──────────────────────────────────────────────────────────────────────────────────────────┐
   │ Anh Luân 31/07: "nhớ cấu hình nút reset demo để luôn có 1 bộ demo chuẩn ngay sau khi     │
   │                  reset. Thực sự chuẩn."                                                  │
   └──────────────────────────────────────────────────────────────────────────────────────────┘

   "THỰC SỰ CHUẨN" NGHĨA LÀ GÌ - và vì sao 20 bộ kiểm cũ không bắt được:
   Mọi bộ kiểm cũ đều chạy vào ĐÚNG MỘT NGÀY: hôm nay, thứ của hôm nay. Chúng xanh, và chúng
   xanh THẬT. Nhưng người mở app ngày mai lại thấy màn hình khác, vì app kéo dữ liệu demo theo
   BỘI SỐ 7 NGÀY (giữ nguyên thứ trong tuần - chủ ý đúng, xem `tshDays`). Hệ quả: mỗi thứ trong
   tuần nhìn vào một lát cắt KHÁC của cùng một bộ dữ liệu, và chỗ trống ở lát cắt nào thì mãi
   mãi trống ở đúng thứ đó.
   Đo thật trước khi viết bộ kiểm này - số trên thẻ khi mở app từng ngày:
       Buổi WOW hôm nay   T2=1  T3=0  T4=3  T5=2  T6=3  T7=2  CN=2
   Thứ Ba: số 0. Bộ kiểm chạy vào thứ Tư sẽ không bao giờ biết chuyện đó.
   Đây đúng loại "xanh mà chưa chạy gì" - nguy hơn báo đỏ, vì nó cấp cho ta lòng tin sai.

   CÁCH LÀM: nạp lại _APP.js BẢY LẦN, mỗi lần giả `Date` lệch thêm một ngày, rồi làm ĐÚNG việc
   nút Reset làm (`tshApply(tshDays())`) và hỏi app bằng chính hàm của app. Không chép lại một
   dòng logic nào của app sang đây - chép là ngày mai hai bên lệch nhau mà không ai biết.

   LUẬT CỦA CHÍNH BỘ KIỂM NÀY:
   · Hỏi bằng hàm của app (`BANGVIEC`, `RENDER`), không tự viết lại phép đếm.
   · Ô nào được phép rỗng phải KHAI kèm lý do đọc được (`RONGDUOC`) - không có mục "bỏ qua trống".
   · Đọc không được thứ cần đọc thì ĐỎ, không lặng lẽ return.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

var FS=require('fs'), VM=require('vm');
var APPSRC=FS.readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8');
var THU=["CN","T2","T3","T4","T5","T6","T7"];

/* ── giả lập trình duyệt (giống _checkaudit) ─────────────────────────────────────────────── */
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

/* ── giả ngày: lệch N ngày so với thật, giữ nguyên mọi hành vi khác của Date ──────────────── */
var THAT=Date;
function datGia(lech){
 var L=lech*864e5;
 function D(){ if(!(this instanceof D))return new THAT(THAT.now()+L).toString();
  return arguments.length?new THAT(...arguments):new THAT(THAT.now()+L)}
 D.prototype=THAT.prototype;
 D.now=function(){return THAT.now()+L};D.parse=THAT.parse;D.UTC=THAT.UTC;
 global.Date=D}

var bad=[], n=0, DONG=[];
function t(ten,ok,chitiet){n++;if(!ok)bad.push(ten+(chitiet?(" - "+chitiet):""))}

/* ── KHAI BÁO: ô nào ĐƯỢC PHÉP rỗng, và vì sao ───────────────────────────────────────────────
   Đây là chỗ duy nhất được nói "ô này 0 cũng không sao". Mỗi dòng phải đọc ra được lý do -
   một trung tâm chạy bình thường thì ngày nào cũng có mấy việc này bằng 0 là CHUYỆN TỐT. */
var RONGDUOC={
 "Buổi đã huỷ hôm nay":"huỷ buổi là việc bất thường - demo mà ngày nào cũng có buổi huỷ mới là sai",
 "Khiếu nại mức CAO":"khiếu nại nặng là hiếm theo đúng SOP; ép có mỗi ngày là bôi đen trung tâm",
 "Khiếu nại đã leo thang":"leo thang là ngoại lệ của ngoại lệ",
 "Hoàn tiền chờ duyệt":"hoàn tiền vài tháng một lần, không phải việc hàng ngày",
 "Nhập học chưa xong":"có ngày mọi hồ sơ nhập học đều xong - đó là đích, không phải lỗi",
 "Phản hồi chờ phân loại":"phản hồi tới theo đợt khảo sát, không rải đều từng ngày",
 "WOW có tiến bộ":"đếm buổi WOW đã ghi kết quả 'tiến bộ' - phụ thuộc buổi đã dạy, không phải việc phải làm",
 "Việc mới chờ nhận":"sổ giao việc do người dùng tạo; ngày không ai giao việc mới là bình thường",
 "Chờ người giao xác nhận":"phụ thuộc người khác bấm xong việc",
 "Quá hạn":"để trống được là tốt - đây là ô ta MUỐN bằng 0",
 "Hồ sơ nhân sự còn thiếu":"hồ sơ đủ hết là đích của Nhân sự",
 "Đổi lớp từ 2 lần":"đổi lớp nhiều lần là ngoại lệ cần duyệt, không phải việc hàng ngày",
 "Chiết khấu cần duyệt":"chiết khấu lớn là ngoại lệ cần duyệt",
 "Nguồn đang kém":"mọi nguồn lead đang trên ngưỡng CVR là TIN TỐT - bẻ một nguồn cho xấu đi chỉ để thẻ sáng là bịa dữ liệu",
 "Đơn còn nợ phí":"", "Phiếu thu chờ đối soát":""};

/* Chức danh có trong BVLAND mà demo không có người - khai kèm lý do, không im lặng bỏ qua. */
var KHONGCONGUOI={
 quantri:"Quản trị viên không phải một dòng trong DL01 - đó là tài khoản toàn quyền, đăng nhập bằng mật khẩu ở màn chọn cổng",
 hotro:"nhóm ĐỠ CUỐI: chức danh nào app chưa biết thì rơi vào đây. Demo khai đủ chức danh nên không ai rơi - đó là điều mong muốn"};

/* ── BỘ MẶT PHẢI CÓ SỐ MỌI NGÀY ──────────────────────────────────────────────────────────────
   Không liệt kê tay từng ô - lấy THẲNG từ `BANGVIEC()` của app, nên thêm ô mới vào bảng việc là
   bộ kiểm tự canh ô đó luôn. Chỉ liệt kê tay danh sách CHỨC DANH, mà cũng lấy từ BVLAND. */
function soTrenThe(h,nhan){
 /* statStrip in ra: <div class="bsn">SỐ</div><div class="bsl">NHÃN · phụ chú</div> */
 var re=/<div class="bsn">([^<]*)<\/div><div class="bsl">([^<]*)</g,m;
 while((m=re.exec(h))){
  var lbl=m[2].replace(/&amp;/g,"&").replace(/&#39;/g,"'").split(" · ")[0].trim();
  if(lbl===nhan)return m[1].trim()}
 return null}

/* Mốc neo GỐC ghi trong bản build - đọc một lần từ mã nguồn, vì ngay lúc nạp app `demoBoot()`
   đã chạy và dời mốc neo đi rồi. Không có mốc gốc thì không nói được "đã kéo bao nhiêu ngày". */
var NEOGOC=(APPSRC.match(/anchor":\s*"(\d{2})\/(\d{2})\/(\d{4})/)||[]).slice(1);
function ngayGoc(){return NEOGOC.length===3?new THAT(+NEOGOC[2],+NEOGOC[1]-1,+NEOGOC[0]):null}

function motNgay(lech){
 datGia(lech);
 STORE={};LS={};SS={};
 /* Lá cờ nút Reset đặt trước khi nạp lại trang: boot thấy cờ thì KÉO BẰNG MỌI GIÁ, không đợi
    ngưỡng demoAutoShift_days. Đặt đúng lá cờ ấy chính là mô phỏng thật cái nút, chứ không phải
    tự gọi tay tshApply rồi tin rằng nút cũng làm y thế. */
 LS["ITTS_DEMO_FORCESHIFT"]="1";
 VM.runInThisContext(APPSRC);
 setRole("all");
 /* Nạp lại _APP.js KHÔNG xoá `window.SCOPEEFF` - nó là biến của window, mà window ở đây là
    global dùng chung cả 7 lượt. Đã cắn: lượt trước đóng vai một giảng viên, lượt sau đo bảng
    việc toàn trung tâm mà thực ra vẫn đang bị bó trong phạm vi người đó, ra 0 hết rồi báo đỏ
    6 chức danh. Bộ kiểm sai chứ app không sai - phải tự trả mình về toàn quyền trước mỗi lượt. */
 applyScope("");CURSTAFF="";
 /* demoBoot() đã chạy ngay lúc nạp và đã kéo (vì có lá cờ). Gọi thêm một lượt cho chắc - nếu
    boot đã kéo đủ thì tshDays() trả 0 và câu này không làm gì. */
 var d=tshDays();
 if(d)tshApply(d);
 try{deriveAll()}catch(e){}
 /* So NGÀY với NGÀY. Mốc neo có kèm giờ (18:01) mà mốc gốc dựng ở 00:00 - trừ thẳng rồi làm
    tròn ra 29 ngày trong khi phép kéo luôn là bội của 7. Số lạ thì nghi cái thước trước. */
 var g=ngayGoc(), moi=tshAnchor();
 var moi0=moi?new THAT(moi.getFullYear(),moi.getMonth(),moi.getDate()):null;
 var keo=(g&&moi0)?Math.round((moi0.getTime()-g.getTime())/864e5):0;
 var td=new Date();
 return {thu:THU[td.getDay()],ngay:td.getDate()+"/"+(td.getMonth()+1),lech:keo};
}

/* Bảy ngày liên tiếp để phủ đủ bảy THỨ, và cố tình đặt ở tuần thứ tư (28-34 ngày sau) để phép
   KÉO thật sự chạy. Chọn 0-6 thì `tshDays` trả 0 suốt (dữ liệu vừa gieo hôm nay), tức là bộ kiểm
   xanh mà chưa hề thử cái nó định thử - đúng loại xanh giả nguy hiểm nhất. 28 là bội của 7 nên
   thứ trong tuần vẫn phủ đủ. */
var CHUCDANH={}, THETRONG={}, BANGTRONG={};
for(var k=28;k<35;k++){
 var info=motNgay(k);
 /* 1+2. ĐÓNG VAI TỪNG NHÂN VIÊN CÓ THẬT rồi hỏi bảng việc của họ.
    Không đo bằng quyền "toàn quyền": nhiều ô trong bảng việc là ô CỦA RIÊNG TÔI ("Đang làm" =
    việc tôi đã nhận). Người toàn quyền không phải là ai cả, nên mấy ô đó luôn đọc 0 - đo kiểu đó
    thì bộ kiểm báo đỏ oan, mà đỏ oan vài lần là lần sau không ai tin nó nữa.
    Ô được tính là CÒN SỐNG nếu có ÍT NHẤT MỘT người của chức danh đó nhìn thấy số - đúng câu
    hỏi cần hỏi: "thứ này, ô này có sáng ở đâu trong trung tâm không?" */
 var CAO={}, TONG={};
 var NV=rows("DL01").filter(function(s){return !isc(s.status,"resigned","inactive")});
 var loi="";
 NV.forEach(function(s){
  try{
   applyScope(s.staff_id);CURSTAFF=s.staff_id;
   var g=SCOPE().group, T=BANGVIEC(), B=T[bvKhoi(g)];
   if(!B)return;
   var tong=0;
   B.o.forEach(function(x){
    var nhan=String(x[2]), so=parseInt(String(x[1]).replace(/\D/g,""),10)||0;
    tong+=so;
    var key=g+" · "+nhan;
    CAO[key]=Math.max(CAO[key]||0,so)});
   TONG[g]=Math.max(TONG[g]||0,tong);
  }catch(e){loi=loi||(s.staff_id+": "+e.message)}});
 applyScope("");CURSTAFF="";
 t("bảng việc chạy được cho mọi nhân viên ("+info.thu+")",!loi,loi);
 Object.keys(BVLAND).forEach(function(g){
  if(!(g in TONG))return;                       /* chức danh chưa có người trong demo - mục 4 lo */
  CHUCDANH[g]=1;
  if(!TONG[g])(BANGTRONG[g]=BANGTRONG[g]||[]).push(info.thu)});
 Object.keys(CAO).forEach(function(key){
  if(CAO[key])return;
  var nhan=key.split(" · ")[1];
  if(Object.prototype.hasOwnProperty.call(RONGDUOC,nhan))return;
  (THETRONG[key]=THETRONG[key]||[]).push(info.thu)});
 /* 4. Chức danh nào có trong BVLAND mà demo không có lấy một người - bảng việc của họ không ai
       nhìn thấy bao giờ. Chỉ báo một lần, không nhân bảy. */
 if(k===28)Object.keys(BVLAND).forEach(function(g){
  if(Object.prototype.hasOwnProperty.call(KHONGCONGUOI,g))return;
  t("demo có ít nhất một người thuộc chức danh "+g,(g in TONG),
    "không nhân viên nào rơi vào nhóm này - bảng việc của họ chưa ai từng thấy")});
 /* 3. MÀN "HÔM NAY" CỦA GIẢNG VIÊN - màn được mở nhiều nhất trong trung tâm thật.
       Ô ở đây là số của RIÊNG một người, nên "thầy A hôm nay không có buổi" là chuyện bình
       thường, không phải lỗi. Câu hỏi đúng phải hỏi cả đội: SÁNG THỨ NÀY, CÓ AI PHẢI LÊN LỚP
       KHÔNG? Đóng vai lần lượt từng giảng viên và đếm - hỏi qua chính màn hình họ nhìn, không
       qua phép đếm viết lại trong bộ kiểm. */
 var coSes=0,coWow=0,veLoi="",oThieu="";
 var GV=rows("DL01").filter(function(s){return /teacher/.test(ecode(s.role))});
 GV.forEach(function(gv){
  try{applyScope(gv.staff_id);CURSTAFF=gv.staff_id;window.HTTAB="today";CUR="hoctap";
   var a=soTrenThe(RENDER.hoctap(),"Buổi dạy hôm nay");
   if(a===null){oThieu=oThieu||("GV "+gv.staff_id+" · Buổi dạy hôm nay");return}
   if(parseInt(a,10)>0)coSes++;
  }catch(e){veLoi=veLoi||(gv.staff_id+": "+e.message)}});
 /* Buổi WOW 1-1 do ĐỘI WOW dạy, không phải giảng viên đứng lớp - hỏi giảng viên "hôm nay có
    buổi WOW nào không" thì ngày nào cũng ra 0, mà đó là đúng theo SOP chứ không phải lỗi.
    Đã cắn: bản đầu bộ kiểm này hỏi nhầm người rồi báo đỏ suốt bảy thứ. Hỏi đúng người: NV WOW,
    ở đúng tab của họ. */
 var WOW=rows("DL01").filter(function(s){return mapRoleCode(ecode(s.role))==="wow"});
 WOW.forEach(function(nv){
  try{applyScope(nv.staff_id);CURSTAFF=nv.staff_id;window.HTTAB="wow";CUR="hoctap";
   var b=soTrenThe(RENDER.hoctap(),"Buổi WOW hôm nay");
   if(b===null){oThieu=oThieu||("NV WOW "+nv.staff_id+" · Buổi WOW hôm nay");return}
   if(parseInt(b,10)>0)coWow++;
  }catch(e){veLoi=veLoi||(nv.staff_id+": "+e.message)}});
 applyScope("");CURSTAFF="";
 t("vẽ được màn Hôm nay của mọi giảng viên và NV WOW ("+info.thu+")",!veLoi,veLoi);
 t("hai ô buổi dạy / buổi WOW còn đúng nhãn ("+info.thu+")",!oThieu,
   "không đọc được ô ở "+oThieu+" - đổi nhãn ô thì sửa cả bộ kiểm");
 t("thứ "+info.thu+": có giảng viên phải lên lớp",coSes>0,
   "cả "+GV.length+" giảng viên đều rảnh - mở app đúng thứ này thì lịch dạy trống trơn");
 t("thứ "+info.thu+": có NV WOW phải dạy buổi 1-1",coWow>0,
   "cả "+WOW.length+" người của đội WOW đều không có buổi - thẻ 'Buổi WOW hôm nay' đọc số 0");
 DONG.push({thu:info.thu,ngay:info.ngay,lech:info.lech,ses:coSes,gv:GV.length,wow:coWow,nw:WOW.length});
 global.Date=THAT;
}

/* ── BÁO CÁO ────────────────────────────────────────────────────────────────────────────── */
console.log("Mở app 7 thứ trong tuần (đặt cờ Reset - boot kéo bằng mọi giá):");
t("phép kéo có thật sự chạy",DONG.some(function(r){return r.lech!==0}),
  "cả 7 lượt đều kéo 0 ngày - bộ kiểm chưa hề thử cái nó định thử");
DONG.forEach(function(r){
 console.log("  "+r.thu+" "+String(r.ngay).padEnd(6)+" kéo "+String(r.lech).padStart(3)+
  " ngày | GV có buổi dạy "+String(r.ses).padStart(2)+"/"+r.gv+
  " | NV WOW có buổi "+String(r.wow).padStart(2)+"/"+r.nw)});

Object.keys(BANGTRONG).forEach(function(g){
 t("bảng việc của "+g+" không rỗng ngày nào",false,"trống các thứ: "+BANGTRONG[g].join(","))});
Object.keys(THETRONG).forEach(function(key){
 t("ô '"+key+"' có số mọi ngày",false,"bằng 0 vào "+THETRONG[key].join(",")+
   " (nếu ĐÚNG là được phép rỗng thì khai vào RONGDUOC kèm lý do)")});

if(!bad.length){
 console.log("CHECKDEMO OK: "+n+" tiêu chí | 7 thứ x "+Object.keys(CHUCDANH).length+
  " chức danh - không thứ nào mở app ra thấy bảng trống");
}else{
 console.log("CHECKDEMO - BỘ DEMO CHƯA CHUẨN Ở MỌI NGÀY ("+bad.length+"/"+n+"):");
 bad.forEach(function(m){console.log("   X "+m)})}
process.exitCode=bad.length?1:0;
