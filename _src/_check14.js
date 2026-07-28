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
var SRC0=require('fs').readFileSync('./_APP.js','utf8');
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

console.log(bad.length?("CHECK14 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK14 OK: "+ok+" tieu chi");
