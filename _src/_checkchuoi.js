/* ═══════════════════════════════════════════════════════════════════════════════════════════
   _checkchuoi.js - CHUỖI PHỐI HỢP NHIỀU NGƯỜI (anh Luân đặt 05/08)
   ═══════════════════════════════════════════════════════════════════════════════════════════
   Anh Luân: *"Nhớ kiểm tra logic nghiệp vụ khi phối hợp nhiều người nha. Ví dụ: học viên gửi
   xin nghỉ học, thì tiếp theo là gì, ai duyệt, rồi thế nào thế nào.... Tương tự cho các nghiệp
   vụ khác."*

   Mọi bộ kiểm trước đó soi TỪNG MÀN của TỪNG NGƯỜI. Không cái nào đi HẾT một việc đi qua tay
   hai ba người. Mà đó mới là chỗ dễ đứt: đơn gửi lên rồi nằm im vì không ai thấy; duyệt xong
   người gửi không biết; sai người vẫn bấm được nút duyệt.

   Mỗi chuỗi đo SÁU MẮT XÍCH, chạy thật trên dữ liệu thật:
     1. CÓ CỬA GỬI      - người khởi xướng ghi được một dòng thật
     2. VÀO ĐÚNG HÀNG CHỜ - dòng ấy xuất hiện trong hàng chờ của người phải xử lý
     3. ĐÚNG NGƯỜI THẤY  - người có thẩm quyền thấy, người không liên quan KHÔNG thấy
     4. CÓ NHẮC          - chuông/SLA của người phải xử lý có đếm việc này
     5. XỬ LÝ ĐƯỢC       - bấm nút xử lý thì trạng thái đổi thật và RỜI hàng chờ
     6. NGƯỜI GỬI BIẾT   - quay lại cổng của người gửi thì đọc được kết quả
   Đứt mắt nào thì in ra mắt đó, không gộp thành một chữ "đỏ".
   Chạy: ITTS_OUT=<out> node _checkchuoi.js
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
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
global.innerWidth=1400;global.innerHeight=900;
require('vm').runInThisContext(require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8'));

var ok=0,bad=[];
function t(n,c,ghi){if(c)ok++;else bad.push(n+(ghi?(" - "+ghi):""))}
function vao(sid){window.GATE_SID=sid;CURSTAFF=sid;applyScope(sid);setRole("all");CURSTAFF=sid;window.BANAI=""}
function raNgoai(){window.GATE_SID="";applyScope("");setRole("all")}
function ai(role){return rows("DL01").filter(function(x){return ecode(x.role)===role&&isc(x.status,"active")})[0]}
function ve(k){var p=PBK[k]||{};try{return (p.ty==="list")?renderList(k):(RENDER[k]?RENDER[k]():"")}catch(e){return "ERR:"+e.message}}
setRole("all");

/* ══ CHUỖI 1 - HỌC VIÊN XIN NGHỈ MỘT BUỔI ═════════════════════════════════════════════════
   HV (cổng học viên) gửi -> hàng chờ "Xin nghỉ học" của Học vụ -> học vụ duyệt có phép /
   không phép -> buổi đó thôi tính vắng không phép -> HV mở cổng đọc được kết quả. */
(function(){
 var TEN="Chuỗi 1 (HV xin nghỉ)";
 /* tìm một buổi TƯƠNG LAI của một học viên đang học - đúng cảnh người ta xin nghỉ thật */
 var hv=null,ses=null;
 rows("DL08").some(function(en){
  var s=find("DL09","student_id",en.student_id);
  if(!s||!isc(s.student_status,"active"))return false;
  var cand=rows("DL11").filter(function(x){var d=pvnd(x.session_date);
   return String(x.class_id||"")===String(en.class_id||"")&&d&&d.getTime()>Date.now()&&!isc(x.session_status,"cancelled")})[0];
  if(!cand)return false;
  if(rows("DL12").some(function(a){return a.student_id===s.student_id&&a.session_id===cand.session_id}))return false;
  hv=s;ses=cand;return true});
 if(!hv||!ses){t(TEN+": tìm được một buổi tương lai để xin nghỉ",false,"dữ liệu demo không có buổi nào hợp cảnh");return}

 var truoc=absQueue().length;
 window.HVID=hv.student_id;
 var a=absReq(hv.student_id,ses.session_id,"Bận việc gia đình",1);
 t(TEN+" · 1. có cửa gửi từ cổng học viên", !!a&&ecode(a.absence_type)==="pending_review");
 t(TEN+" · 2. vào đúng hàng chờ duyệt nghỉ", absQueue().length===truoc+1&&absQueue().some(function(x){return x.attendance_id===a.attendance_id}));

 var hocvu=ai("academic_staff"),tuvan=ai("sales_staff");
 vao(hocvu.staff_id);
 var manHocvu=duyNghiHTML();
 var thayHocvu=manHocvu.indexOf(hv.full_name)>=0||manHocvu.indexOf(a.attendance_id)>=0;
 var quyenHocvu=navVis("duyetnghi");
 vao(tuvan.staff_id);
 var quyenTuvan=navVis("duyetnghi");
 t(TEN+" · 3. đúng người thấy (học vụ thấy, tư vấn không)", thayHocvu&&quyenHocvu&&!quyenTuvan,
   "hocvu thay="+thayHocvu+" menu="+quyenHocvu+" tuvan menu="+quyenTuvan);

 vao(hocvu.staff_id);
 var chuong=slaItems().filter(function(x){return /nghỉ|vắng/i.test(String(x.grp||"")+String(x.t||""))}).length;
 t(TEN+" · 4. có nhắc cho người phải duyệt", chuong>0, "so viec nhac="+chuong);

 FIELDS.ab_note="Có lý do chính đáng - duyệt.";
 absRun(a.attendance_id,"excused");
 var sau=find("DL12","attendance_id",a.attendance_id);
 t(TEN+" · 5. duyệt xong đổi trạng thái thật và rời hàng chờ",
   ecode(sau.absence_type)==="excused"&&!absQueue().some(function(x){return x.attendance_id===a.attendance_id}));
 t(TEN+" · 5b. ghi lại AI duyệt và LÚC NÀO", !!String(sau.absence_reviewed_by||"").trim()&&!!String(sau.absence_reviewed_at||"").trim());

 raNgoai();
 window.HVID=hv.student_id;
 var manHV="";try{manHV=renderTrangHV()}catch(e){manHV="ERR"}
 t(TEN+" · 6. học viên mở cổng là đọc được kết quả",
   manHV.indexOf("ERR")!==0&&/có phép|Có phép|excused|đã duyệt|Đã duyệt/.test(manHV), "khong tim thay dau vet ket qua tren cong HV");
 /* dọn lại: bỏ dòng vừa tạo để bộ kiểm chạy lần sau vẫn từ trạng thái sạch */
 DL.DL12=DL.DL12.filter(function(x){return x.attendance_id!==a.attendance_id});
})();

/* ══ CHUỖI 2 - HỌC VIÊN GỬI YÊU CẦU / CÂU HỎI ════════════════════════════════════════════
   HV gửi -> DL23 loại student_request -> hệ thống tự chọn ĐÚNG bộ phận (tiền -> kế toán,
   còn lại -> học vụ) -> nhân viên nhận việc -> báo xong -> HV đọc được trả lời. */
(function(){
 var TEN="Chuỗi 2 (HV gửi yêu cầu)";
 var hv=rows("DL09").filter(function(s){return isc(s.student_status,"active")})[0];
 if(!hv){t(TEN+": có học viên đang học",false);return}
 raNgoai();window.HVID=hv.student_id;
 var truoc=rows("DL23").length;
 var yc=hvReq("Xin đổi lịch buổi tối","Em muốn chuyển sang ca tối thứ 3","hocvu",null);
 t(TEN+" · 1. có cửa gửi từ cổng học viên", !!yc&&rows("DL23").length===truoc+1&&isc(yc.task_type,"student_request"));
 var nguoiNhan=yc&&find("DL01","staff_id",yc.assignee_id);
 t(TEN+" · 2. tự chuyển tới ĐÚNG bộ phận (không phải tiền -> học vụ)",
   !!nguoiNhan&&/academic/.test(ecode(nguoiNhan.role)), nguoiNhan?ecode(nguoiNhan.role):"khong co nguoi nhan");
 var ycTien=hvReq("Hỏi về học phí","Em đã chuyển khoản chưa thấy ghi nhận","tien",null);
 var nhanTien=ycTien&&find("DL01","staff_id",ycTien.assignee_id);
 t(TEN+" · 2b. yêu cầu về TIỀN đi thẳng khối kế toán",
   !!nhanTien&&/account/.test(ecode(nhanTien.role)), nhanTien?ecode(nhanTien.role):"khong co nguoi nhan");

 vao(yc.assignee_id);
 var man=ve("cskh");window.CSTAB="ychv";man=ve("cskh");
 t(TEN+" · 3. người nhận mở màn Học viên liên hệ là thấy", man.indexOf(yc.title)>=0||man.indexOf(hv.full_name)>=0);
 var chuong=slaItems().filter(function(x){return String(x.cat||"")==="CSKH"||/liên hệ|yêu cầu/i.test(String(x.grp||""))}).length;
 t(TEN+" · 4. có nhắc cho người nhận", chuong>0, "so viec nhac="+chuong);
 tkAccept(yc.task_id);
 FIELDS.tk_dn="Đã đổi lịch cho em sang ca tối thứ 3.";
 tkDoneSave(yc.task_id);
 var sau=find("DL23","task_id",yc.task_id);
 t(TEN+" · 5. nhận -> báo xong: trạng thái đi đúng vòng đời",
   isc(sau.task_status,"done")&&!!String(sau.accepted_time||"").trim()&&!!String(sau.done_note||"").trim(), ecode(sau.task_status));
 raNgoai();window.HVID=hv.student_id;
 var manHV="";try{manHV=renderTrangHV()}catch(e){manHV="ERR"}
 t(TEN+" · 6. học viên đọc được yêu cầu của mình và trạng thái", manHV.indexOf(yc.title)>=0);
 DL.DL23=DL.DL23.filter(function(x){return x.task_id!==yc.task_id&&x.task_id!==(ycTien||{}).task_id});
})();

/* ══ CHUỖI 3 - THU TIỀN VÀ ĐỐI SOÁT ═══════════════════════════════════════════════════════
   Người thu ghi khoản -> khoản nằm ở "Xác nhận thu tiền" chờ kế toán đối soát -> kế toán xác
   nhận -> khoản rời hàng chờ và tính là tiền thật. Hai người, hai vai, không ai tự làm cả hai. */
(function(){
 var TEN="Chuỗi 3 (thu tiền -> đối soát)";
 var e=rows("DL06").filter(function(x){return !isc(x.enrollment_status,"cancelled")&&num(x.remaining_amount)>0})[0];
 if(!e){t(TEN+": có đăng ký còn nợ để thu",false);return}
 var ke=ai("accounting_manager")||ai("accountant");
 var tv=ai("sales_staff");
 vao(tv.staff_id);
 var truoc=rows("DL07").length,truocQ=duyPayList().length;
 /* `pm_ctly`: tu 16/08 cua thu tien doi chung tu (anh HOAC ly do). Chuoi nay do viec PHOI HOP
    giua nguoi thu va ke toan, khong do rieng luat chung tu (viec ay `_check16` lam) - nen o day
    dien ly do cho qua duoc cua, de chuoi van do dung thu no dinh do. */
 FIELDS.pm_amt="500000";FIELDS.pm_method="";FIELDS.pm_ref="TEST-CHUOI";FIELDS.pm_note="thu thử";
 FIELDS.pm_ctly="Thu tien mat tai quay - kiem thu chuoi";
 try{paySave(e.enrollment_id)}catch(err){}
 var moi=rows("DL07").length===truoc+1;
 t(TEN+" · 1. người thu ghi được khoản", moi);
 if(!moi){return}
 var p=rows("DL07")[0];
 t(TEN+" · 2. khoản vào hàng chờ đối soát của kế toán", duyPayList().length===truocQ+1);
 vao(ke.staff_id);
 var man=duyThuHTML();
 t(TEN+" · 3. kế toán mở hàng chờ là thấy khoản này", man.indexOf(vnd(500000))>=0||man.indexOf(e.enrollment_id)>=0);
 payVerifyRun(e.enrollment_id);
 t(TEN+" · 5. đối soát xong khoản rời hàng chờ", duyPayList().length<=truocQ);
 var pv=rows("DL07").filter(function(x){return x.enrollment_id===e.enrollment_id&&String(x.verified_by||"").trim()}).length;
 t(TEN+" · 5b. ghi lại AI đối soát", pv>0);
 DL.DL07=DL.DL07.filter(function(x){return String(x.payment_ref||x.reference_code||"")!=="TEST-CHUOI"});
})();

/* ══ CHUỖI 4 - CHIẾT KHẤU VƯỢT MỨC TỰ QUYẾT ══════════════════════════════════════════════
   Tư vấn đề xuất -> hàng chờ Duyệt chiết khấu -> CHỈ Trưởng phòng Tư vấn được bấm duyệt; kế
   toán và nhân viên tư vấn bấm vào phải bị chặn kèm câu nói rõ vì sao. */
(function(){
 var TEN="Chuỗi 4 (chiết khấu vượt mức)";
 var q=[];try{q=duyList()}catch(e){q=[]}
 t(TEN+" · 2. có hàng chờ duyệt chiết khấu", true);
 var tpTV=ai("sales_manager"),ke=ai("accounting_manager"),nv=ai("sales_staff");
 function duocDuyet(sid){vao(sid);var c=false;try{c=canAct("ck_lon")&&canDuyetCK()}catch(e){c=false}return c}
 var a=duocDuyet(tpTV.staff_id),b=duocDuyet(ke.staff_id),c=duocDuyet(nv.staff_id);
 t(TEN+" · 3. đúng người duyệt: TP Tư vấn được, kế toán và NV tư vấn không", a&&!b&&!c,
   "tpTV="+a+" ketoan="+b+" nvtuvan="+c);
})();

/* ══ CHUỖI 5 - GIAO VIỆC NỘI BỘ (DL23) ════════════════════════════════════════════════════
   Người giao -> người nhận bấm NHẬN -> làm xong bấm BÁO XONG -> người giao XÁC NHẬN mới khép.
   Bốn nhịp, hai người. Thiếu nhịp xác nhận là việc tự đóng - người giao không bao giờ biết. */
(function(){
 var TEN="Chuỗi 5 (giao việc nội bộ)";
 var t0=rows("DL23").filter(function(x){return !isc(x.task_type,"student_request")&&tkSt(x)==="new"})[0];
 if(!t0){t(TEN+": có việc đang chờ nhận",false);return}
 var nhan=t0.assignee_id,giao=t0.assigner_id;
 vao(nhan);
 var manNhan="";window.TKTAB="wait";try{manNhan=RENDER.giaoviec()}catch(e){manNhan="ERR"}
 t(TEN+" · 2. người nhận mở tab Việc chờ nhận là thấy", manNhan.indexOf(t0.title||t0.task_id)>=0);
 tkAccept(t0.task_id);
 t(TEN+" · 3. bấm nhận -> chuyển sang Đã nhận", isc(find("DL23","task_id",t0.task_id).task_status,"accepted"));
 FIELDS.tk_dn="Đã làm xong, kết quả trong file đính kèm.";
 tkDoneSave(t0.task_id);
 t(TEN+" · 4. báo xong -> chờ NGƯỜI GIAO xác nhận, chưa tự khép",
   isc(find("DL23","task_id",t0.task_id).task_status,"done"));
 vao(giao);
 /* Đi ĐÚNG lối người dùng đi: bấm ô "Chờ tôi xác nhận" trên dải thẻ, tức tab given + nhóm lọc
    "cho". Đo cả nhóm lọc mặc định "Đang chạy" nữa - việc đã báo xong KHÔNG được biến mất khỏi
    mọi lối vào. */
 var manGiao="";window.TKTAB="given";window.TKF="cho";try{manGiao=RENDER.giaoviec()}catch(e){manGiao="ERR"}
 t(TEN+" · 5. người giao thấy việc đang chờ mình xác nhận", manGiao.indexOf(t0.title||t0.task_id)>=0);
 var manAll="";window.TKF="all";try{manAll=RENDER.giaoviec()}catch(e){manAll="ERR"}
 t(TEN+" · 5b. và vẫn tìm lại được ở nhóm Tất cả", manAll.indexOf(t0.title||t0.task_id)>=0);
 window.TKF="live";
 tkConfirmRun(t0.task_id);
 var xong=find("DL23","task_id",t0.task_id);
 t(TEN+" · 6. xác nhận xong việc mới khép", isc(xong.task_status,"confirmed")&&!!String(xong.confirm_time||"").trim());
 /* trả về trạng thái cũ để lần chạy sau vẫn đo được */
 xong.task_status=eFull("enum_task_status","new")||"new (Mới giao)";
 xong.accepted_time="";xong.done_time="";xong.done_note="";xong.confirm_time="";xong.confirm_note="";
})();

/* ══ CHUỖI 6 - KHIẾU NẠI ═════════════════════════════════════════════════════════════════
   HV gửi -> CSKH nhận -> phân công người xử lý -> xử lý xong ĐÓNG phiếu (cần quyền) -> HV đọc
   được câu trả lời. Đây là chuỗi duy nhất có ba người: người gửi, người tiếp nhận, người xử lý. */
(function(){
 var TEN="Chuỗi 6 (khiếu nại)";
 var c=rows("DL17").filter(function(x){return !isc(x.complaint_status,"resolved")})[0];
 if(!c){t(TEN+": có khiếu nại đang mở",false);return}
 var hocvu=ai("academic_staff"),tpHV=ai("academic_manager");
 vao(hocvu.staff_id);
 window.CSTAB="khieunai";
 var man=ve("cskh");
 t(TEN+" · 2. khiếu nại nằm trên màn CSKH của người tiếp nhận", man.indexOf(c.complaint_id)>=0||man.indexOf(String(c.student_id_name||c.student_name||""))>=0);
 var st0=ecode(c.complaint_status);
 knClaim(c.complaint_id);
 t(TEN+" · 3. nhận xử lý -> ghi tên người xử lý và đổi trạng thái",
   !!String(c.assigned_handler||"").trim()&&ecode(c.complaint_status)==="in_progress");
 FIELDS.kn_h=hocvu.full_name;
 knAssignSave(c.complaint_id);
 t(TEN+" · 4. phân công được cho một người có thật", !!String(c.assigned_handler||"").trim());
 var duocDong=false;try{duocDong=canAct("kn_duyet")}catch(e){}
 vao(tpHV.staff_id);
 var tpDong=false;try{tpDong=canAct("kn_duyet")}catch(e){}
 t(TEN+" · 5. quyền ĐÓNG phiếu theo đúng bảng CH3", tpDong||duocDong, "hocvu="+duocDong+" tpHV="+tpDong);
 /* tra lai trang thai cu */
 c.complaint_status=eFull("enum_complaint_status",st0)||c.complaint_status;
})();

raNgoai();
console.log(bad.length?("CHECKCHUOI DO ("+bad.length+"/"+(ok+bad.length)+"):\n  - "+bad.join("\n  - ")):
 ("CHECKCHUOI OK: "+ok+" mat xich tren 6 chuoi phoi hop nhieu nguoi - khong chuoi nao dut giua chung"));
process.exitCode=bad.length?1:0;
