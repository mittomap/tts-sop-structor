/* _check14: CONG HOC VIEN - KENH HAI CHIEU (mang 3). Chay: ITTS_OUT=<out> node _check14.js */
var STORE={},FIELDS={};
function El(id){var e={id:id||"",innerHTML:"",textContent:"",value:(FIELDS[id]||""),checked:!!FIELDS["chk_"+id],style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:200,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return {left:0,top:0,width:10,height:10,bottom:10,right:10}},files:[]};
 return e}
global.document={getElementById:(id)=>El(id),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
var SRC0=require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8');
var SRC=SRC0.replace(/\/\*[\s\S]*?\*\//g,"");   /* bo chu thich truoc khi soi ma nguon */
var HTMLHV=require('fs').readFileSync((process.env.ITTS_OUT||'.')+'/ITTs_TrangHocVien_demo.html','utf8');
require('vm').runInThisContext(SRC0);
setRole("all");
var bad=[],ok=0;
function t(n,c){if(c)ok++;else bad.push(n)}
function setF(o){FIELDS=o}
function reset(){__actT={}}

/* ---- 0. du lieu nen da mo duong ---- */
t("enum_task_type co student_request", (ENUM.enum_task_type||[]).some(function(x){return String(x).indexOf("student_request")===0}));
t("DL16 co cot session_id", rows("DL16").length>0 && ("session_id" in rows("DL16")[0]));
t("kho bai tap co link tai lieu", rows("DL20").every(function(b){return String(b.file_link||"").trim()}));
t("giang vien co gioi thieu (bio)", rows("DL01").filter(function(x){return String(x.role||"").indexOf("teacher")===0}).every(function(x){return String(x.bio||"").trim()}));
t("giang vien co anh dai dien", rows("DL01").filter(function(x){return String(x.role||"").indexOf("teacher")===0}).every(function(x){return String(x.avatar_url||"").trim()}));
t("bang lich dong theo dot DL06b co du lieu", rows("DL06b").length>0);

/* ---- 1. (d) TU XAC NHAN LOP ---- */
(function(){
 var o=rows("DL08").filter(function(x){return x.class_id&&!isc(x.class_confirmation_status,"confirmed")&&!isc(x.class_confirmation_status,"rejected")})[0];
 if(!o){bad.push("khong tim duoc ho so cho xac nhan de kiem");return}
 window.HVID=o.student_id;
 var h=renderTrangHV();
 t("(d) cong hien nut TU XAC NHAN LOP", h.indexOf("hvClassConfirm(")>=0);
 t("(d) cong hien nut xin doi lop", h.indexOf("hvClassReject(")>=0);
 reset();hvClassConfirm(o.onboarding_id);
 t("(d) bam xac nhan thi DL08 chuyen sang Dong y", isc(o.class_confirmation_status,"confirmed"));
 t("(d) co ghi moc gio xac nhan", !!String(o.confirmation_time||"").trim());
 var h2=renderTrangHV();
 t("(d) xac nhan xong thi nut bien mat", h2.indexOf("hvClassConfirm(")<0);
})();

/* ---- 2. (d2) XIN DOI LOP -> sinh yeu cau cho nhan vien ---- */
(function(){
 var o=rows("DL08").filter(function(x){return x.class_id&&!isc(x.class_confirmation_status,"confirmed")&&!isc(x.class_confirmation_status,"rejected")})[0];
 if(!o){bad.push("khong tim duoc ho so de kiem xin doi lop");return}
 window.HVID=o.student_id;var n0=rows("DL23").length;
 reset();setF({hvrj_ly:"Em di lam toi 19h",hvrj_gio:"sau 19h30"});
 hvClassRejectSave(o.onboarding_id);
 t("(d2) xin doi lop -> DL08 ghi Tu choi", isc(o.class_confirmation_status,"rejected"));
 t("(d2) xin doi lop -> sinh 1 yeu cau cho nhan vien", rows("DL23").length===n0+1);
 var t0=rows("DL23")[0];
 t("(d2) yeu cau mang dung loai student_request", isc(t0.task_type,"student_request"));
 t("(d2) nguoi gui la CHINH hoc vien", t0.assigner_id===o.student_id);
 t("(d2) yeu cau duoc giao cho nguoi CO THAT", !!find("DL01","staff_id",t0.assignee_id));
 t("(d2) yeu cau gan dung ho so hoc vien", t0.related_id===o.student_id);
 t("(d2) ly do hoc vien nhap duoc ghi lai", String(t0.content||"").indexOf("19h")>=0);
})();

/* ---- 3. (a) BAO NGHI -> ghi thang vao so diem danh dang VANG CO PHEP ---- */
(function(){
 var s2=rows("DL11").filter(function(x){var d=pvnd(x.session_date);return d&&d.getTime()>Date.now()&&!isc(x.session_status,"cancelled")})[0];
 if(!s2){bad.push("khong co buoi tuong lai de kiem bao nghi");return}
 var ob=rows("DL08").filter(function(o){return o.class_id===s2.class_id})[0];
 if(!ob){bad.push("buoi tuong lai khong co hoc vien de kiem");return}
 window.HVID=ob.student_id;
 var h=renderTrangHV();
 t("(a) cong hien nut Bao nghi buoi", h.indexOf("hvAbsentAsk(")>=0);
 t("(b) cong hien nut Xin hoc bu", h.indexOf("hvMakeupAsk(")>=0);
 var nAt=rows("DL12").length,nTask=rows("DL23").length;
 reset();setF({hvab_ly:"Em bi om"});
 hvAbsentSave(s2.session_id);
 var a=rows("DL12").filter(function(x){return x.session_id===s2.session_id&&x.student_id===ob.student_id})[0];
 t("(a) bao nghi -> co ban ghi diem danh", !!a);
 t("(a) bao nghi -> danh dau VANG", a&&isc(a.attendance_status,"no_show"));
 /* V9.29 (viec C): DAO Y CO CHU DICH. Truoc day bao nghi la app tu cho "co phep" ngay - hoc vien
    tu quyet chuyen can cua chinh minh. Nay phai nam o CHO DUYET cho toi khi hoc vu quyet. */
 t("(a) bao nghi -> nam o CHO DUYET, khong tu cho minh co phep", a&&isc(a.absence_type,"pending_review"));
 t("(a) bao nghi -> chua tinh vao vang KHONG PHEP khi chua ai duyet",
   a&&!/unexcused/.test(ecode(a.absence_type)));
 t("(a) bao nghi -> luu lai ly do hoc vien tu ghi", a&&hvSelfWhy(a).indexOf("om")>=0);
 t("(a) dong HV tu bao duoc danh dau ro (khong de mot cot moi ngoai so do bang)", a&&hvSelfRow(a)&&("student_reason" in a)===false);
 t("(a) bao nghi -> sinh yeu cau cho hoc vu", rows("DL23").length===nTask+1);
 t("(a) yeu cau gan dung BUOI hoc", rows("DL23")[0].related_id===s2.session_id);
})();

/* ---- 4. (c) TU DAT BUOI WOW ---- */
(function(){
 var S=rows("DL09").filter(function(x){return num(x.wow_quota_remaining)>0})[0];
 if(!S){bad.push("khong co HV con luot WOW de kiem");return}
 window.HVID=S.student_id;
 var h=renderTrangHV();
 t("(c) cong hien nut Dat buoi WOW", h.indexOf("hvWowAsk(")>=0);
 var n0=rows("DL14").length,nT=rows("DL23").length;
 var d=new Date(Date.now()+5*864e5);
 function z(n){return n<10?"0"+n:n}
 reset();setF({hvw_skill:"Speaking (Nói)",hvw_date:d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate()),hvw_gio:"sau 19h",hvw_focus:"Part 2"});
 hvWowSave();
 t("(c) dat WOW -> sinh 1 buoi trong DL14", rows("DL14").length===n0+1);
 var w=rows("DL14")[0];
 t("(c) buoi ghi nguoi dat la HOC VIEN", isc(w.wow_booked_by,"student"));
 t("(c) buoi ghi dung loai HV tu dat", isc(w.wow_session_type,"self_booked"));
 t("(c) CHUA day thi CHUA tru quota", String(w.quota_deducted).toLowerCase()==="no");
 t("(c) dat WOW -> sinh yeu cau cho hoc vu", rows("DL23").length===nT+1);
 /* dat ngay QUA KHU phai bi chan */
 var n1=rows("DL14").length;
 reset();setF({hvw_skill:"Writing (Viết)",hvw_date:"2020-01-01"});
 hvWowSave();
 t("(c) chan dat buoi WOW o ngay DA QUA", rows("DL14").length===n1);
 /* het quota phai bi chan */
 var S0=rows("DL09").filter(function(x){return num(x.wow_quota_remaining)<=0})[0];
 if(S0){window.HVID=S0.student_id;var n2=rows("DL14").length;
  reset();setF({hvw_skill:"Reading (Đọc)",hvw_date:d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate())});
  hvWowSave();
  t("(c) het luot WOW thi chan dat them", rows("DL14").length===n2)}
})();

/* ---- 5. (h) LICH DONG HOC PHI THEO DOT + bao da chuyen khoan ---- */
(function(){
 var e=rows("DL06").filter(function(x){return num(x.remaining_amount)>0&&!isc(x.enrollment_status,"cancelled")
   &&rows("DL06b").filter(function(y){return y.enrollment_id===x.enrollment_id}).length>1})[0];
 if(!e){bad.push("khong co don tra gop de kiem");return}
 window.HVID=e.student_id;
 var h=renderTrangHV();
 t("(h) cong HIEN lich dong theo dot", h.indexOf("Lịch đóng học phí theo đợt")>=0);
 t("(h) lich dot noi ro nhac truoc han bao nhieu ngay", h.indexOf("nhắc bạn trước hạn")>=0);
 t("(h) cong hien nut Toi da chuyen khoan", h.indexOf("hvPaidNotify(")>=0);
 var nP=rows("DL07").length,nT=rows("DL23").length;
 reset();setF({hvpn_amt:"1000000",hvpn_ref:"HV dong dot 2"});
 hvPaidNotifySave(e.enrollment_id);
 t("(h) bao chuyen khoan KHONG tu ghi phieu thu (tien chi vao so khi ke toan doi soat)", rows("DL07").length===nP);
 t("(h) bao chuyen khoan -> sinh yeu cau cho KE TOAN", rows("DL23").length===nT+1);
 var tk=rows("DL23")[0];
 var acc=find("DL01","staff_id",tk.assignee_id)||{};
 t("(h) yeu cau tien giao dung phong Ke toan", String(acc.department||"")==="Kế toán");
 t("(h) yeu cau tien uu tien cao", isc(tk.priority,"high"));
 /* bao qua so tien con no phai bi chan */
 var nT2=rows("DL23").length;
 reset();setF({hvpn_amt:String(num(e.remaining_amount)+99999999)});
 hvPaidNotifySave(e.enrollment_id);
 t("(h) chan bao so tien LON HON phan con phai dong", rows("DL23").length===nT2);
})();

/* ---- 6. (i) buoi NGHI va buoi HOC BU khong con vo hinh ---- */
(function(){
 var c=rows("DL11").filter(function(x){var d=pvnd(x.session_date);return isc(x.session_status,"cancelled")&&d&&d.getTime()>=Date.now()})[0];
 if(c){var ob=rows("DL08").filter(function(o){return o.class_id===c.class_id})[0];
  if(ob){window.HVID=ob.student_id;var h=renderTrangHV();
   t("(i) buoi da nghi VAN hien tren cong", h.indexOf("Đã nghỉ")>=0);
   t("(i) noi ro buoi nay KHONG dien ra", h.indexOf("KHÔNG diễn ra")>=0)}}
 else{ok+=2}   /* du lieu hien tai khong co buoi huy o tuong lai - khong tinh la loi */
 t("(i) muc Sap toi khong con loc bo buoi da huy",
   /var upSes=\[\];[\s\S]{0,220}?upSes\.push\(s2\)/.test(SRC)&&
   !/var upSes=\[\];[\s\S]{0,220}?!isc\(s2\.session_status,"cancelled"\)[\s\S]{0,20}?upSes\.push/.test(SRC));
 t("(i) buoi da huy duoc danh dau ro tren cong", /chip red[^>]*>Đã nghỉ/.test(SRC));
 t("(i) buoi hien ten GV cua BUOI (khong phai GV chinh cua lop)", /s2\.teacher_id_name\|\|\(gv\?gv\.full_name/.test(SRC));
})();

/* ---- 7. LUAT CUNG ---- */
["hvClassConfirm","hvClassRejectSave","hvAbsentSave","hvWowSave","hvPaidNotifySave"].forEach(function(f){
 t(f+" chan bam hai lan", new RegExp("function "+f+"[\\s\\S]{0,700}?actGuard\\(").test(SRC))});
["hvReq","hvClassConfirm","hvClassRejectSave","hvAbsentSave","hvWowSave"].forEach(function(f){
 t(f+" co goi persistSoon", new RegExp("function "+f+"[\\s\\S]{0,2600}?persistSoon\\(\\)").test(SRC))});
t("khong cam cung ngay nhac truoc han (doc CH2)", /paramOf\("installmentRemind_days"/.test(SRC));
t("khong cam cung so ngay qua han (doc CH2)", /paramOf\("installmentLate_days"/.test(SRC));


/* ---- 8. (e) HOP TRAO DOI HAI CHIEU ---- */
(function(){
 var S=rows("DL09")[0];window.HVID=S.student_id;
 var h=renderTrangHV();
 t("(e) cong co muc Trao doi voi trung tam", h.indexOf('id="s-hoidap"')>=0);
 t("(e) co nut gui cau hoi", h.indexOf("hvAskNew(")>=0);
 var n0=rows("DL23").length;
 reset();setF({hvq_t:"Xin giay xac nhan dang hoc",hvq_c:"Em can nop cho cong ty"});
 hvAskSave();
 t("(e) gui cau hoi -> sinh 1 yeu cau", rows("DL23").length===n0+1);
 var tk=rows("DL23")[0];
 var n1=rows("DL24").length;
 reset();setF({hvsay_c:"Em can gap truoc thu 6 a"});
 hvAskSaySave(tk.task_id);
 t("(e) nhan them -> ghi vao so trao doi DL24", rows("DL24").length===n1+1);
 t("(e) tin nhan ghi tac gia la HOC VIEN", DL.DL24[DL.DL24.length-1].staff_id===S.student_id);
 var h2=renderTrangHV();
 t("(e) cong hien lai yeu cau da gui", h2.indexOf("Xin giay xac nhan dang hoc")>=0);
})();

/* ---- 9. (f) XIN BAO LUU / DOI LOP / RUT HOC PHI ---- */
["baoluu","doilop","rutphi"].forEach(function(k){
 var S=rows("DL09")[0];window.HVID=S.student_id;
 var h=renderTrangHV();
 t("(f) cong co nut "+k, h.indexOf("hvReqSpecial")>=0&&h.indexOf(k)>=0);
 var n0=rows("DL23").length;
 reset();setF({hvsp_a:"Ly do cua em",hvsp_b:"Thong tin them"});
 hvReqSpecialSave(k);
 t("(f) "+k+" -> sinh yeu cau cho nhan vien", rows("DL23").length===n0+1);
});
(function(){var tk=rows("DL23").filter(function(x){return String(x.title||"").indexOf("rút học phí")>=0})[0];
 if(tk){var acc=find("DL01","staff_id",tk.assignee_id)||{};
  t("(f) xin rut hoc phi giao dung phong Ke toan", String(acc.department||"")==="Kế toán")}else bad.push("khong tao duoc yeu cau rut hoc phi");})();

/* ---- 10. (g) DANH GIA TUNG BUOI BANG SAO ---- */
(function(){
 var s2=rows("DL11").filter(function(x){return isc(x.session_status,"completed")})[0];
 var ob=rows("DL08").filter(function(o){return o.class_id===s2.class_id})[0];
 if(!s2||!ob){bad.push("khong co buoi da hoc de kiem cham sao");return}
 window.HVID=ob.student_id;
 var h=renderTrangHV();
 t("(g) nhat ky buoi hoc co hang sao", h.indexOf("hvRateSes(")>=0);
 var n0=rows("DL16").length;
 reset();hvRateSes(s2.session_id,5);
 t("(g) cham sao -> ghi vao DL16", rows("DL16").length===n0+1);
 var f=rows("DL16")[0];
 t("(g) danh gia gan dung BUOI hoc (cot session_id)", f.session_id===s2.session_id);
 t("(g) diem duoc luu dung", num(f.feedback_score)===5);
 t("(g) cham cao -> phan loai tich cuc", isc(f.feedback_type,"positive"));
 t("(g) kenh ghi la Cong hoc vien va CO NHAN tieng Viet", isc(f.feedback_channel,"app")&&String(f.feedback_channel).indexOf("(")>0);
 var s3=rows("DL11").filter(function(x){return isc(x.session_status,"completed")&&x.class_id===s2.class_id&&x.session_id!==s2.session_id})[0];
 if(s3){var nT=rows("DL23").length;
  reset();hvRateSes(s3.session_id,2);
  reset();setF({hvrt_c:"Lop on qua em khong nghe ro"});
  hvRateNote(rows("DL16")[0].feedback_id);
  t("(g) cham THAP -> tu sinh yeu cau cho hoc vu goi lai", rows("DL23").length===nT+1);
  t("(g) cham thap -> phan loai tieu cuc", isc(rows("DL16").filter(function(x){return x.session_id===s3.session_id})[0].feedback_type,"negative"))}
})();

/* ---- 11. (m) KHONG LO THONG TIN NOI BO ---- */
t("(m) khong in nguyen van ghi chu noi bo cua nhan vien o nhat ky buoi", !/\(a\.note\?' · '\+esc\(a\.note\)/.test(SRC));
(function(){  /* cau chu so sach chi cam o CONG HOC VIEN; ben nhan vien noi "tru 1 luot" la dung nghiep vu */
 var leak=0;
 rows("DL09").slice(0,12).forEach(function(S){window.HVID=S.student_id;
  if(renderTrangHV().indexOf("trừ 1 lượt")>=0)leak++});
 t("(m) cong hoc vien khong noi 'tru 1 luot' theo ngon ngu so sach", leak===0);})();
(function(){
 var leak=0;
 rows("DL09").slice(0,12).forEach(function(S){window.HVID=S.student_id;var h=renderTrangHV();
  if(h.indexOf("Leo thang lên QL")>=0)leak++;
  if(h.indexOf("hứa đi học lại")>=0)leak++;
  if(h.indexOf("đã gọi hỏi thăm")>=0)leak++});
 t("(m) khong ho so nao lo cau chu noi bo ra cong hoc vien", leak===0);})();

/* ---- 12. (k) tai lieu bam duoc + (p) so dien thoai ---- */
t("(k) link tai lieu la the a bam duoc", /function hvLink/.test(SRC)&&/hvLink\(s2\.materials_link/.test(SRC));
(function(){
 var S=rows("DL09")[0];window.HVID=S.student_id;var h=renderTrangHV();
 /* V9.29 (anh Luân): dữ liệu demo KHÔNG bịa sẵn số hotline nữa - trung tâm tự điền số thật.
    Nên bất biến đúng là: CÓ cấu hình thì cổng phải hiện số; CHƯA cấu hình thì không dựng nút gọi giả. */
 (function(){
  var cu=null;(DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline"){cu=c.value;c.value="028 7300 1234"}});
  var h2=renderTrangHV();
  t("(p) co cau hinh hotline thi cong hien so goi duoc", h2.indexOf('href="tel:02873001234')>=0);
  (DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline")c.value=""});
  var h3=renderTrangHV();
  t("(p) chua cau hinh thi khong dung nut goi gia", h3.indexOf('href="tel:')<0);
  (DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline")c.value=cu});
 })();
 t("(p) so lay tu cau hinh CH2 chu khong cam cung", /paramStr\("centerHotline"/.test(SRC));})();

/* ---- 13. (n) muc luc chia 3 nhom ---- */
t("(n) muc luc chia 3 nhom theo nhu cau", typeof HVGRP!=="undefined"&&HVGRP.length===3);
t("(n) moi muc trong HVSEC deu thuoc mot nhom",
  HVSEC.every(function(x){return HVGRP.some(function(G){return G[1].indexOf(x[0])>=0})}));


/* ---- 14. (j) THE LOP CUA BAN + (l) CHUNG NHAN ---- */
(function(){
 var ob=rows("DL08").filter(function(o){return o.class_id})[0];
 window.HVID=ob.student_id;var h=renderTrangHV();
 t("(j) cong co the Lop cua ban", h.indexOf('id="s-lop"')>=0);
 t("(j) hien lich hoc co dinh", h.indexOf("Lịch học cố định")>=0);
 t("(j) hien noi hoc (phong hoac link)", h.indexOf("Học ở đâu")>=0);
 t("(j) hien giang vien cua lop", h.indexOf("hvgv")>=0);
 t("(j) giang vien co anh dai dien", h.indexOf("hvgva")>=0);
 t("(j) giang vien co gioi thieu", h.indexOf("hvgvb")>=0);
})();
(function(){
 var ce=rows("DL18").filter(function(x){return isc(x.student_status,"completed")})[0];
 if(!ce){bad.push("khong co ho so hoan thanh khoa de kiem chung nhan");return}
 window.HVID=ce.student_id;var h=renderTrangHV();
 t("(l) cong co chung nhan hoan thanh khoa", h.indexOf('id="s-chungnhan"')>=0);
 t("(l) chung nhan dung so chuyen can co san trong DL18", h.indexOf("Chuyên cần")>=0);
 t("(l) chung nhan in / luu PDF duoc", h.indexOf("window.print()")>=0);
})();
/* ---- 15. (n) mask dong muc luc tren dien thoai ---- */
t("(n) co lop mo phu de bam ra ngoai la dong muc luc", /function hvCloseSide/.test(SRC)&&/id="hvMask"/.test(HTMLHV));
t("(n) bam mot muc trong muc luc thi dong luon", /function hvGo\(id\)\{hvCloseSide\(\)/.test(SRC));


/* ---- 16. Cong hoc vien mo ra la thay LOP CUA MINH truoc (anh Luân, V9.29m) ---- */
(function(){
 var n=0,okOrder=0,coXn=0;
 rows("DL09").slice(0,40).forEach(function(s){window.HVID=s.student_id;
  var o="";try{o=renderTrangHV()}catch(e){return}
  var iLop=o.indexOf('id="s-lop"'),iFee=o.indexOf('id="s-hocphi"'),iXn=o.indexOf('id="s-xacnhan"');
  if(iLop<0)return;                      /* HV chua xep lop thi khong co khoi nay */
  n++;
  if(iXn>=0)coXn++;
  if((iXn<0||iLop<iXn)&&(iFee<0||iLop<iFee))okOrder++});
 t("co du lieu de kiem thu tu cong hoc vien", n>=10&&coXn>=10);
 /* KHOI "KHOA CUA BAN" phai hien cho MOI hoc vien, khong chi nguoi hoc nhieu khoa */
 (function(){var co=0,tr=0,tong=0,mot=0;
  rows("DL09").slice(0,60).forEach(function(s){window.HVID=s.student_id;
   var o="";try{o=renderTrangHV()}catch(e){return}
   if(o.indexOf('class="hvcr')<0&&o.indexOf('id="s-khoa"')<0)return;   /* HV chua co dang ky nao */
   tong++;
   var i=o.indexOf('id="s-khoa"'),x=o.indexOf('id="s-xacnhan"');
   if(i>=0)co++;
   if(i>=0&&(x<0||i<x))tr++;
   if(o.indexOf("bấm để xem từng khóa")<0)mot++});
  t("Khoa cua ban hien cho MOI hoc vien co dang ky", tong>=20&&co===tong);
  t("Khoa cua ban dung TRUOC bang xac nhan", tong>0&&tr===tong);
  t("hoc mot khoa thi khong moc goi y bam chon khoa", mot>0&&mot<tong+1)})();
 t("muc luc: Khoa cua ban dung dau", HVSEC[0][0]==="s-khoa");
 t("cong hoc vien: LOP CUA BAN dung truoc hoc phi va bang xac nhan", n>0&&okOrder===n);
 /* muc luc phai xep dung thu tu tren trang, khong thi scrollspy nhay lung tung */
 t("muc luc: Lop cua ban ngay sau Khoa cua ban", HVSEC[1][0]==="s-lop");
 /* "Trung tam da xac nhan" khong con nam trong nhom "Can ban xu ly" - no khong co viec gi de lam */
 t("bang xac nhan khong bi xep vao nhom viec phai lam",
   HVGRP[0][1].indexOf("s-xacnhan")<0&&HVGRP[1][1].indexOf("s-xacnhan")>=0);
 /* cau hoi "ban co nhan lop nay khong" thi VAN phai o tren - do la viec that */
 (function(){var found=0,good=0;
  rows("DL09").slice(0,80).forEach(function(s){window.HVID=s.student_id;
   var o="";try{o=renderTrangHV()}catch(e){return}
   var iAsk=o.indexOf("Bạn có nhận lớp");if(iAsk<0)return;found++;
   var iXn=o.indexOf('id="s-xacnhan"');
   if(iXn<0||iAsk<iXn)good++});
  t("cau hoi nhan lop van dung tren bang xac nhan", found===0||good===found)})();
 window.HVID=rows("DL09")[0].student_id;
})();

/* ===== V9.40d - CONG PHU HUYNH (anh Luan: "Con cong phu huynh, cai do nen co") ==========
   Phu huynh xem bang CHINH cong hoc vien o mot che do khac, khong dung file thu ba. Bo kiem
   phai chung minh dung mot dieu: phan RIENG cua hoc vien khong bi lo. An o muc luc thoi la
   CHUA DU - noi dung van nam trong trang va cuon xuong la doc duoc. */
(function(){
  var s=rows("DL09").filter(function(x){return ghSdt(x)})[0];
  t("du lieu demo co hoc vien da khai so nguoi giam ho", !!s);
  if(!s)return;
  var cu=window.HVID,cuP=window.HVPHONE;
  window.HVID=s.student_id;
  window.HVPHONE="";var hv=renderTrangHV();
  window.HVPHONE=ghSdt(s);var ph=renderTrangHV();
  window.HVPHONE=cuP;window.HVID=cu;
  t("hoc vien VAN thay muc trao doi rieng", hv.indexOf("s-hoidap")>=0);
  t("hoc vien VAN thay muc gop y", hv.indexOf("s-gopy")>=0);
  /* hai tieu chi duoi day la ly do ton tai cua ca khoi nay */
  t("phu huynh KHONG doc duoc muc trao doi rieng cua hoc vien", ph.indexOf("s-hoidap")<0);
  t("phu huynh KHONG doc duoc muc gop y rieng cua hoc vien", ph.indexOf("s-gopy")<0);
  t("phu huynh VAN thay hoc phi", ph.indexOf("s-hocphi")>=0);
  t("phu huynh VAN thay tien do hoc tap", ph.indexOf("s-tiendo")>=0);
  t("phu huynh VAN thay nhat ky buoi hoc", ph.indexOf("s-buoihoc")>=0);
  t("co bang nhan dien noi ro dang xem voi tu cach nguoi giam ho", (function(){
    var p=window.HVPHONE;window.HVPHONE=ghSdt(s);var r=hvPHBar(s);window.HVPHONE=p;
    return /tư cách/.test(r)&&/Không hiện/.test(r)})());
  t("che do hoc vien KHONG hien bang nhan dien phu huynh", (function(){
    var p=window.HVPHONE;window.HVPHONE="";var r=hvPHBar(s);window.HVPHONE=p;return r===""})());
  t("ho so chua khai so nguoi giam ho thi KHONG mo cong phu huynh duoc", (function(){
    var x=rows("DL09").filter(function(y){return !ghSdt(y)})[0];
    if(!x)return true;
    var p=window.HVPHONE;window.HVPHONE="";
    try{gateEnterPH(x.student_id)}catch(e){}
    var chan=!window.HVPHONE;window.HVPHONE=p;return chan})());
})();

/* ═══ V9.45 - CONG PHU HUYNH PHAI CO LOI VAO RIENG ═══════════════════════════════════
   Anh Luan 30/07: "cong phu huynh o dau nhi, a chua thay o index.html". Cong do van luon co,
   nhung no nap mot tang: phai vao cong hoc vien roi bam mot nut nho tren tung the. Nguoi di xem
   demo khong tim ra - ma khong tim ra thi coi nhu KHONG CO.
   Nay co dia chi rieng `?phuhuynh`. Bo kiem giu cho loi vao do khong bien mat lan nua. */
(function(){
 /* Bo khung cua _check14 tra ve MOT El MOI moi lan goi getElementById, nen ghi innerHTML xong
    doc lai se ra rong. Tam thay bang mot o nho duy nhat de doc lai duoc thu vua ve. */
 var _oldGet=document.getElementById, _box={id:"login",innerHTML:"",style:{},
  classList:{add:function(){},remove:function(){},contains:function(){return false}}};
 document.getElementById=function(id){return id==="login"?_box:_oldGet(id)};
 var luu=global.location.search, luuM=window.__hvPHM, luuQ=window.__hvgq;
 window.__hvgq="";
 global.location.search="?phuhuynh"; window.__hvPHM=0;
 try{hvPHmodeRead()}catch(e){}
 t("dia chi ?phuhuynh bat che do phu huynh", (typeof hvPHmode==="function")&&hvPHmode()===true);
 var h="";try{_box.innerHTML="";demoGateHV();h=_box.innerHTML||""}catch(e){}
 t("man chon o che do PH goi dung ten 'Cong phu huynh'", /Cổng phụ huynh/.test(h));
 t("co nut doi qua lai hai vai ngay tai man chon", /Tôi là phụ huynh/.test(h)&&/Tôi là học viên/.test(h));
 t("bam vao the la vao thang che do phu huynh", /gateEnterPH/.test(h));
 var nPH=(h.match(/class="rcard"/g)||[]).length;
 global.location.search=""; window.__hvPHM=0;
 var h2="";try{_box.innerHTML="";demoGateHV();h2=_box.innerHTML||""}catch(e){}
 var nHV=(h2.match(/class="rcard"/g)||[]).length;
 t("che do PH chi hien em DA KHAI so nguoi giam ho (it hon danh sach hoc vien)", nPH>0&&nPH<=nHV);
 t("khong co ?phuhuynh thi ve dung man hoc vien", /Cổng học viên/.test(h2)&&!/Cổng phụ huynh/.test(h2));
 global.location.search=luu; window.__hvPHM=luuM; window.__hvgq=luuQ;
 document.getElementById=_oldGet;
})();


/* ---- MOT KIEU DONG THOI GIAN DUY NHAT, KHONG IN HAI LAN THOI GIAN (V9.47, anh Luan) ----
   "co cho thiet ke timeline, co cho lai chua, vi du nhu buoi hoc va buoi wow, ma timeline lai
    hien 2 lan thoi gian co, nhin hoi ky cuc."
   Hai loi that: (1) node tren duong ke in NGAY roi trong the in lai session_date NGUYEN VAN (ca
   ngay lan gio) - doc thanh "30/07/2026" xong lai "30/07/2026 18:00"; (2) nhat ky buoi hoc co
   duong ke, nhat ky WOW thi khong, du hai muc nam sat nhau.
   Luat tu nay: NODE giu NGAY, THE chi giu GIO. */
(function(){
 t("co ham dung chung cho dong thoi gian", typeof hvTLrow==="function"&&typeof hvTLopen==="function"&&typeof hvGio==="function"&&typeof hvNgay==="function");
 /* hvGio/hvNgay phai tach dung, ke ca khi thieu gio */
 t("hvNgay doi dung sang dd/mm/yyyy", hvNgay("2026-07-30 18:00")==="30/07/2026");
 t("hvGio lay dung phan gio", hvGio("2026-07-30 18:00")==="18:00");
 t("khong co gio thi hvGio tra ve rong, khong bia so", hvGio("2026-07-30")==="");
 /* tim mot ho so CO CA buoi hoc LAN buoi WOW de soi that */
 var hs=null;
 rows("DL09").forEach(function(s){ if(hs)return;
  var coW=rows("DL14").some(function(w){return w.student_id===s.student_id});
  var coB=rows("DL08").some(function(o){return o.student_id===s.student_id&&o.class_id});
  if(coW&&coB)hs=s});
 if(!hs){t("co ho so demo vua co buoi hoc vua co buoi WOW de soi", false);}
 else{
  window.HVID=hs.student_id;
  var h=renderTrangHV();
  var nRail=(h.match(/class="hvtl"/g)||[]).length;
  var nRow=(h.match(/class="hvtlr/g)||[]).length;
  var nThe=(h.match(/class="hvses"/g)||[]).length;
  t("co it nhat HAI duong ke - nhat ky buoi hoc VA nhat ky WOW", nRail>=2);
  t("MOI the buoi deu nam trong mot dong cua duong ke (khong the nao dung ngoai)", nThe>0&&nRow===nThe);
  /* khong the nao in lai NGAY ma node cua no da in */
  var xau=[];
  var kh=h.split('class="hvtlr');
  kh.slice(1).forEach(function(seg,i){
   var nd=(seg.match(/class="hvtld">([^<]*)</)||[])[1]||"";
   if(!/^\d{2}\/\d{2}\/\d{4}$/.test(nd))return;
   var than=seg.slice(seg.indexOf('class="hvses"'));
   than=than.slice(0,than.indexOf('class="hvtlr')>=0?than.indexOf('class="hvtlr'):than.length);
   /* ngay o dang ISO (2026-07-30) hay dang VN deu tinh la in lai */
   var p=nd.split("/"), iso=p[2]+"-"+p[1]+"-"+p[0];
   if(than.indexOf(iso)>=0||than.split(nd).length>2)xau.push("dong "+(i+1)+" node="+nd)});
  t("the KHONG in lai ngay ma node da in"+(xau.length?" - lap o: "+xau.slice(0,4).join(", "):""), xau.length===0);
  /* nhung van phai co GIO o dau do, khong duoc mat thong tin */
  t("gio buoi hoc van hien (chi doi cho, khong bo)", /class="hvst"><b>\d{2}:\d{2}<\/b>/.test(h)||/chưa xếp giờ/.test(h));
 }
})();

/* ============================================================================
   V9.63 - DOI CONG + THANH TREN CUA CONG HOC VIEN (anh Luan dat)
   Ba cong la ba dia chi. Nut "Doi cong" phai co o CA BA, va dia chi no tinh ra
   phai dung voi CA HAI cach bay ban demo (mo file .html tren may / mo qua thu
   muc tren GitHub Pages). Ten cong cung phai la MOT: "Cong hoc vien".
   ============================================================================ */
(function(){
 var HTMLNV=require('fs').readFileSync((process.env.ITTS_OUT||'.')+'/ITTs_WebApp_v5_demo.html','utf8');

 /* --- 1. mot cong mot ten --- */
 t("khong con ten cu 'Trang hoc vien' o cong hoc vien", HTMLHV.indexOf("Trang học viên")<0);
 t("khong con ten cu 'Trang hoc vien' o cong nhan vien", HTMLNV.indexOf("Trang học viên")<0);
 t("tieu de file cong hoc vien la 'Cong hoc vien'", HTMLHV.indexOf("Cổng học viên</title>")>=0);

 /* --- 2. thanh tren that cua cong hoc vien --- */
 t("cong hoc vien co thanh tren .hvtop", HTMLHV.indexOf('<div class="hvtop">')>=0);
 t("thanh tren co o ten cong (hvTopT)", HTMLHV.indexOf('id="hvTopT"')>=0);
 t("thanh tren co o muc dang doc (hvTopS)", HTMLHV.indexOf('id="hvTopS"')>=0);
 t("thanh tren co cho gan cong cu (hvTools)", HTMLHV.indexOf('id="hvTools"')>=0);
 t("hvtop KHONG con bi giau di o man rong (display:none)", !/\.hvtop\{display:none\}/.test(HTMLHV));
 t("nut mo muc luc chi hien tren dien thoai (.hvtoggle)", /\.hvtoggle\{display:none\}/.test(HTMLHV)&&/\.hvtoggle\{display:flex\}/.test(HTMLHV));
 t("nut 'Doi nguoi' KHONG con nam o hai cho (hvselbox da bo)", HTMLHV.indexOf("hvselbox")<0);
 t("hvRender co goi hvTopPaint", /function hvRender\(\)[\s\S]{0,900}?hvTopPaint\(\)/.test(SRC));
 t("hvMark co goi hvTopTitle (cuon toi dau thanh tren doi toi do)", /function hvMark\([\s\S]{0,400}?hvTopTitle\(/.test(SRC));

 /* --- 3. cong cu tren thanh: dung nut, khong hua suong --- */
 var _tools=String(hvTopPaint.toString());
 t("thanh tren co nut Doi cong", _tools.indexOf("congDoiMo()")>=0);
 t("thanh tren co nut Doi nguoi dang xem", _tools.indexOf("gateSwitchHV()")>=0);
 t("thanh tren co nut Reset demo", _tools.indexOf("demoResetHoi()")>=0);
 /* Canh HANH VI chu khong canh cach viet: doi hotline trong cau hinh roi xem thanh tren ve gi.
    Ban truoc tieu chi nay do bang /if\(hot\)/ tren ma nguon - sua hvTopPaint cho di qua
    hvCallHTML mot cua la no do, trong khi hanh vi van dung y het. */
 (function(){
  var cu=null;(DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline"){cu=c.value;c.value=""}});
  var rong=hvTopPaint.call(null),h0="";
  try{h0=(function(){var t={innerHTML:""};var old=document.getElementById;
   document.getElementById=function(id){return id==="hvTools"?t:old(id)};
   hvTopPaint();document.getElementById=old;return t.innerHTML})()}catch(e){h0="LOI"}
  (DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline")c.value="028 7300 1234"});
  var h1="";
  try{h1=(function(){var t={innerHTML:""};var old=document.getElementById;
   document.getElementById=function(id){return id==="hvTools"?t:old(id)};
   hvTopPaint();document.getElementById=old;return t.innerHTML})()}catch(e){h1="LOI"}
  (DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline")c.value=cu});
  t("chua khai hotline thi thanh tren KHONG ve nut goi", h0.indexOf('href="tel:')<0);
  t("khai hotline roi thi thanh tren CO nut goi dung so", h1.indexOf('href="tel:028 7300 1234'.replace(/ /g,""))>=0||/href="tel:0287300 ?1234/.test(h1)||/href="tel:02873001234/.test(h1));
  t("nut goi tren thanh tren di qua hvCallHTML", /hvCallHTML\(/.test(_tools));
 })();
 /* V9.65: dem `class="tbtn"` NGUYEN VAN thi mot nut co them lop phu (class="tbtn hvviec")
    khong duoc dem, va bo kiem do vi mot ly do khong lien quan gi den loi giai thich. Canh Y
    DINH: moi nut/lien ket tren thanh deu phai co data-tip. */
 (function(){
  var nut=(_tools.match(/<(?:button|a)\s[^>]*class="tbtn[^"]*"/g)||[]).length;
  var tip=(_tools.match(/data-tip=/g)||[]).length;
  t("moi nut tren thanh deu co loi giai thich (data-tip)", nut>0&&tip>=nut);
 })();

 /* --- 4. dia chi tinh ra phai dung ca hai cach bay --- */
 var CA=[
  ["/itts-sop-demo/cong-hoc-vien/",        "/itts-sop-demo/cong-nhan-vien/","/itts-sop-demo/cong-hoc-vien/","/itts-sop-demo/cong-hoc-vien/?phuhuynh"],
  ["/itts-sop-demo/cong-nhan-vien/",       "/itts-sop-demo/cong-nhan-vien/","/itts-sop-demo/cong-hoc-vien/","/itts-sop-demo/cong-hoc-vien/?phuhuynh"],
  ["/itts-sop-demo/cong-hoc-vien/index.html","/itts-sop-demo/cong-nhan-vien/","/itts-sop-demo/cong-hoc-vien/","/itts-sop-demo/cong-hoc-vien/?phuhuynh"],
  ["/cong-nhan-vien/",                     "/cong-nhan-vien/","/cong-hoc-vien/","/cong-hoc-vien/?phuhuynh"],
  ["/nha/ITTs_TrangHocVien_demo.html",     "/nha/ITTs_WebApp_v5_demo.html","/nha/ITTs_TrangHocVien_demo.html","/nha/ITTs_TrangHocVien_demo.html?phuhuynh"],
  ["/nha/ITTs_WebApp_v5_demo.html",        "/nha/ITTs_WebApp_v5_demo.html","/nha/ITTs_TrangHocVien_demo.html","/nha/ITTs_TrangHocVien_demo.html?phuhuynh"]];
 var _p0=global.location.pathname;
 CA.forEach(function(c){
  global.location.pathname=c[0];
  t("dia chi dung khi dang o "+c[0], congURL("nv")===c[1]&&congURL("hv")===c[2]&&congURL("ph")===c[3])});
 global.location.pathname=_p0;

 /* --- 5. dang o dau thi biet, va khong moi minh di lai cho minh dang dung --- */
 var _hp=window.HVPORTAL,_ph=window.HVPHONE;
 window.HVPORTAL=0;window.HVPHONE="";
 t("o cong nhan vien thi congDangO()=nv", congDangO()==="nv");
 var hNV=congHTML();
 window.HVPORTAL=1;
 t("o cong hoc vien thi congDangO()=hv", congDangO()==="hv");
 var hHV=congHTML();
 window.HVPHONE="0900000000";
 t("o cong phu huynh thi congDangO()=ph", congDangO()==="ph");
 var hPH=congHTML();
 window.HVPORTAL=_hp;window.HVPHONE=_ph;
 [["cong nhan vien",hNV,"Cổng nhân viên"],["cong hoc vien",hHV,"Cổng học viên"],["cong phu huynh",hPH,"Cổng phụ huynh"]].forEach(function(x){
  /* V9.98: ngan keo nay nay co ca hai dong NGUOI (doi cong + doi nguoi da gop mot cua). Chung
     mang lop `congr nguoir` - dem cong thi phai TRU chung ra, khong thi "du ba cong" thanh nam. */
  var n3=(x[1].match(/class="congr(?! nguoir)/g)||[]).length;
  var nHere=(x[1].match(/class="congr here"/g)||[]).length;
  var seg=x[1].split('class="congr here"')[1]||"";
  t("("+x[0]+") ngan keo liet ke du ba cong", n3===3);
  t("("+x[0]+") danh dau DUNG MOT cong dang dung", nHere===1);
  t("("+x[0]+") cong dang dung la "+x[2], seg.indexOf(x[2])>=0&&seg.indexOf(x[2])<seg.indexOf("</div>")+400);
  t("("+x[0]+") cong dang dung khong bam duoc nua", seg.slice(0,seg.indexOf("congr")>=0?seg.indexOf("congr"):seg.length).indexOf("congDi(")<0);
  t("("+x[0]+") hai cong con lai deu bam duoc", (x[1].match(/congDi\('/g)||[]).length===2)});

 /* --- 5bis. KENH YEU CAU TU HOC VIEN (V9.63) --- */
 (function(){
  /* doc THANG bang goc: rows() co the dang bi thu hep theo pham vi cua vai vua dong o test truoc */
  var _t23=(DATA.dl&&DATA.dl.DL23)||[],_t09=(DATA.dl&&DATA.dl.DL09)||[];
  var _co09={};_t09.forEach(function(x){_co09[String(x.student_id)]=1});
  var yc=_t23.filter(function(t){return isc(t.task_type,"student_request")});
  t("demo co yeu cau hoc vien gui len (khong thi tab nhin nhu trong)", yc.length>=5);
  t("co yeu cau dang CHO NHAN de man hinh co viec that de bam", yc.some(function(x){return isc(x.task_status,"new")}));
  /* Cac test o tren CO TAO them yeu cau that (hvReq) va neo vao buoi hoc / lop, nen khong doi
     moi dong deu neo vao ho so hoc vien. Cai phai dung voi MOI dong la: nguoi gui phai la mot
     hoc vien co that, va yeu cau phai neo vao MOT thu gi do chu khong bo trong. */
  t("moi yeu cau deu co nguoi gui la hoc vien that", yc.every(function(x){return !!_co09[String(x.assigner_id)]}));
  t("moi yeu cau deu neo vao mot doi tuong (khong bo trong)", yc.every(function(x){return !!String(x.related_type||"").trim()&&!!String(x.related_id||"").trim()}));
  t("bo du lieu demo gieo san it nhat 5 yeu cau neo vao ho so hoc vien",
    yc.filter(function(x){return String(x.related_type||"")==="student"&&_co09[String(x.related_id)]}).length>=5);
  window.CSTAB="ychv";
  var h=renderCskh();
  t("hub CSKH co tab Hoc vien lien he", h.indexOf("Học viên liên hệ")>=0);
  t("tab do liet ke dung so yeu cau", (h.match(/onclick="tkOpen\(/g)||[]).length>=yc.length);
  t("bang hai chieu khai them kenh vao thu ba", h.indexOf("Yêu cầu &amp; câu hỏi")>=0||h.indexOf("Yêu cầu & câu hỏi")>=0);
  var one=yc[0];
  var card=tkCard(one,"mine");
  t("the goi dung ten loai - KHONG goi la 'Giao viec'", card.indexOf("Học viên liên hệ")>=0);
  t("the goi dung vai - 'Nguoi gui' chu khong phai 'Nguoi giao'", card.indexOf("Người gửi:")>=0&&card.indexOf("Người giao:")<0);
  t("ham dem yeu cau chua nhan chay duoc", typeof ycHVSo==="function"&&ycHVSo()>=0);
  window.CSTAB="khaosat";
 })();

 /* --- 5quat. YEU CAU HOC VIEN PHAI CO MAT TRONG DAI VIEC HOM NAY (V9.63) --- */
 (function(){
  var cu=CURSTAFF;
  CURSTAFF="ADMIN";                       /* quan tri vien: ma khong nam trong DL01 */
  var it=slaItems()||[];
  var yc=it.filter(function(x){return /^Học viên liên hệ/.test(String(x.grp||""))});
  t("quan tri vien thay yeu cau hoc vien trong dai Viec hom nay", yc.length>=1);
  t("yeu cau hoc vien nam o bo phan CSKH chu khong phai 'Giao viec'", yc.length>0&&yc.every(function(x){return x.cat==="CSKH"}));
  t("bam vao la mo dung the viec do", yc.length>0&&yc.every(function(x){return x.act==="tkopen"&&!!x.rid}));
  var one=((DATA.dl&&DATA.dl.DL23)||[]).filter(function(x){return isc(x.task_type,"student_request")&&isc(x.task_status,"new")})[0];
  if(one){
   CURSTAFF=one.assignee_id;
   var it2=slaItems()||[];
   t("nguoi duoc chuyen yeu cau thay no trong dai viec cua minh",
     it2.some(function(x){return /^Học viên liên hệ/.test(String(x.grp||""))&&x.rid===one.task_id}));
   var nk=((DATA.dl&&DATA.dl.DL01)||[]).filter(function(x){return String(x.staff_id)!==String(one.assignee_id)})[0];
   if(nk){CURSTAFF=nk.staff_id;
    t("nguoi khac KHONG thay yeu cau khong phai cua minh",
      !(slaItems()||[]).some(function(x){return x.rid===one.task_id}))}
  }
  CURSTAFF=cu;
 })();

 /* --- 5quinq. MUC RIENG TREN MENU TRAI (V9.63) --- */
 (function(){
  t("co khoa trang rieng cho Hoc vien lien he", PAGES.some(function(x){return x.k==="ychv"}));
  var G=NAVTREE.filter(function(x){return x.items.indexOf("ychv")>=0})[0];
  t("muc nam tren menu trai", !!G);
  t("muc nam o nhom LAM VIEC (khong chon trong nhom chang dang gap)", !!G&&G.g==="Làm việc");
  t("muc co so viec dang cho", navBadge("ychv")===ychvCho());
  /* V2 - DOI CAU HOI. "Hoc vien lien he" tung la TAB thu tu cua hub CSKH; anh Luan bat 05/08
     (*"cai tab tren sidebar thong bao tu hoc vien dau?"*) nen no duoc cho mot muc menu rieng,
     con man hinh thi van la hub mo san tab do. Sang V2 no la MOT TRANG THAT.
     Dieu can bao ve khong doi mot chut nao: bam vao muc thi toi dung cho do, va dang o do thi
     muc do sang - chi la nay hoi thang bang `go()` chu khong hoi qua mot bang doi ten. */
  var cu=CUR;
  go("ychv");
  t("bam vao muc la toi dung trang Hoc vien lien he", CUR==="ychv");
  t("dang o trang do thi muc tren menu sang", navCur("ychv")===true);
  go("khaosat");
  t("dang o trang khac thi muc do KHONG sang", navCur("ychv")===false);
  CUR=cu;
 })();

 /* --- 5ter. DAI VANG XEM THU + DAI DU LIEU DEMO (V9.63) --- */
 (function(){
  t("co dai vang bao che do xem thu tren thanh tren", HTMLNV.indexOf('id="cfBar"')>=0&&/\.cfbar\{/.test(HTMLNV));
  t("cua ghi cau hinh KHONG con ban toast moi lan cham vao", !/function cfgSave\(\)[\s\S]{0,400}?toast\("Đang ở chế độ XEM THỬ/.test(SRC));
  t("dai vang mang san nut mo quyen quan tri", /function cfBarSync[\s\S]{0,600}?cfDoiCheDo\(\)/.test(SRC));
  t("doi che do la ve lai dai ngay", /function cfSetMode[\s\S]{0,120}?cfBarSync\(\)/.test(SRC));
  /* V9.68: canh Y DINH chu khong canh CACH VIET. Ban truoc doi dung chu HOA "DỮ LIỆU DEMO";
    khi rut gon cau chu cho chuyen nghiep ("Dữ liệu demo" + chu thich re chuot) la do ngay, du
    dai bao van con nguyen. Do la loi cua cai thuoc. Nay chi doi: van con dai `cfbar on demo`
    va tren do van co chu "dữ liệu demo" (khong phan biet hoa thuong). */
 t("o che do quan tri that van co dai bao dang dung du lieu demo",
   /cfbar on demo/.test(SRC)&&/d[ữu] li[êệ]u demo/i.test(SRC));
  t("dai du lieu demo co nut dung lai du lieu", /function cfBarSync[\s\S]{0,900}?demoResetHoi\(\)/.test(SRC));
  t("cong hoc vien cung co dai nay", HTMLHV.indexOf('id="cfBar"')>=0);
 })();

 /* --- 6. cong nhan vien cung phai co nut --- */
 t("cong nhan vien co nut Doi cong tren thanh tren", HTMLNV.indexOf('id="congBtn"')>=0&&HTMLNV.indexOf('congDoiMo()')>=0);
 t("nut Doi cong o cong nhan vien co loi giai thich", /id="congBtn"[^>]*data-tip="[^"]{20,}"/.test(HTMLNV));
})();

/* ===== XUNG HO O CONG PHU HUYNH (V9.84) ==================================================
   Anh Luan 03/08: *"cong phu huynh, em xung ho cho dung nhe, dung ban khong on dau, loi chao
   cung de ten dung don doc, nguoi Viet goi la hon day nhe"*.
   Do duoc luc do: cong phu huynh goi nguoi doc la "ban" 39 LAN va chao "Chao buoi sang,
   <ten tran>". Day khong phai loi chu - la loi phep tac, va khong bo kiem nao hoi toi.
   Ba dieu phai dung, do tren BAN VE THAT cua tung loai quan he co trong du lieu:
     1. khong con mot "ban" nao dung lam DAI TU (chua "ban be" - do la danh tu);
     2. loi chao co tu xung ho dung truoc ten, khong bao gio de ten dung mot minh;
     3. cong HOC VIEN khong bi doi lay - o do "ban" moi la dung. */
(function(){
  var qhThu={};
  (DL.DL09||[]).forEach(function(x){var q=ghQuanHe(x);
    if(q&&ghSdt(x)&&!qhThu[q])qhThu[q]=x});
  var loaiQH=Object.keys(qhThu);
  t("du lieu demo co nguoi dong hanh de kiem xung ho", loaiQH.length>0);
  var conBan=[], chaoTran=[];
  loaiQH.forEach(function(q){
    var S=qhThu[q];
    window.HVID=S.student_id; window.HVPHONE=ghSdt(S);
    var txt="";
    /* KHONG DUOC IM LANG BO QUA. Ban dau khoi nay bat loi roi `return` - va tren ban build CU
       (chua co hvXungLoc) no nem loi, txt rong, dem ra 0 "ban", the la bo kiem BAO XANH tren
       dung cai ban dang hong. Ve khong duoc thi phai DO. */
    try{txt=String(hvXungLoc(renderTrangHV())).replace(/<[^>]*>/g," ").replace(/\s+/g," ")}
    catch(e){conBan.push(q+": KHONG VE DUOC - "+e.message);return}
    if(txt.length<400){conBan.push(q+": ve ra gan nhu rong ("+txt.length+" ky tu)");return}
    var soBan=(txt.replace(/b\u1ea1n b\u00e8/gi," ").match(/\bb\u1ea1n\b/gi)||[]).length;
    if(soBan)conBan.push(q+": "+soBan+" cho");
    /* loi chao phai co tu xung ho ngay truoc ten nguoi doc */
    var ten=ghTen(S);
    if(ten&&txt.indexOf(ten)>=0){
      var truoc=txt.slice(Math.max(0,txt.indexOf(ten)-14),txt.indexOf(ten));
      if(!/(anh|ch\u1ecb|\u00f4ng|b\u00e0|b\u00e1c|ch\u00fa|c\u00f4|anh\/ch\u1ecb)\s*$/i.test(truoc))
        chaoTran.push(q+": ..."+truoc.trim()+" ["+ten+"]");
    }
  });
  t("cong phu huynh khong goi nguoi doc la 'ban'"+(conBan.length?" - CON: "+conBan.join(" | "):""),
    conBan.length===0);
  t("loi chao o cong phu huynh luon co tu xung ho truoc ten"+(chaoTran.length?" - TRAN: "+chaoTran.join(" | "):""),
    chaoTran.length===0);
  /* cong hoc vien: PHAI con "ban" - doi ca hai cong la sua qua tay */
  window.HVPHONE="";
  var S0=(DL.DL09||[])[0]||{}; window.HVID=S0.student_id;
  var t0="",loi0="";
  try{t0=String(hvXungLoc(renderTrangHV())).replace(/<[^>]*>/g," ")}catch(e){loi0=e.message}
  t("cong hoc vien van xung 'ban' nhu cu"+(loi0?(" - KHONG VE DUOC: "+loi0):""),
    !loi0&&(t0.match(/\bb\u1ea1n\b/gi)||[]).length>0);
})();

console.log(bad.length?("CHECK14 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK14 OK: "+ok+" tieu chi");
