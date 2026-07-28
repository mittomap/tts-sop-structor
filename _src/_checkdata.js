/* _checkdata.js - DU LIEU DEMO CO KHOP VOI BO MAY CHANG CUA APP KHONG
   Chay: ITTS_OUT=<out> node _checkdata.js   (can _APP.js da trich san)

   VI SAO CO FILE NAY (28/07, anh Luan bat loi):
   Mot lead dang o ga "Co KQ, cho tu van" ma o L/R/W/S trong tron. check_logic.py co 132 luat
   van khong bat duoc, vi BO MAY CHANG song trong JS (jStageOf) con BO KIEM DU LIEU song trong
   Python - Python khong biet ga "Co KQ" nghia la gi nen khong the hoi "vay diem dau".
   File nay nap CHINH _APP.js, chay CHINH jAll()/jInfo() cua app, roi hoi nguoc: nguoi nay app
   bao dang o ga nao, va ga do bat buoc phai co nhung gi. Nen no khong bao gio lech khoi app.

   CHOT CHAN QUAN TRONG - col():
   Chinh nguoi viet file nay da tung soi nham cot khong ton tai (wow_teacher_id trong khi DL14
   dung staff_id) va bao cao 69 loi ma khong loi nao co that. Nen MOI luat phai lay ten cot qua
   col(bang,ten): cot khong co that trong bang la bao loi NGAY, khong lang le tra ve rong roi
   dem thanh loi du lieu. */

var ST={};
function El(){return {innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:200,offsetWidth:120,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
global.document={getElementById:(id)=>ST[id]||(ST[id]=El()),querySelector:()=>El(),querySelectorAll:()=>[],
 createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
require('vm').runInThisContext(require('fs').readFileSync('./_APP.js','utf8'));
setRole("all");

/* ---------- bo khung ---------- */
var COLERR=[], HIT={}, TOT={}, EX={};
function col(tb,name){
 var rs=rows(tb);
 if(!rs.length){COLERR.push("bang "+tb+" rong");return name}
 for(var i=0;i<rs.length;i++)if(Object.prototype.hasOwnProperty.call(rs[i],name))return name;
 COLERR.push("LUAT SOI COT KHONG CO THAT: "+tb+"."+name);
 return name}
function chk(rule,cond,who){
 TOT[rule]=(TOT[rule]||0)+1;
 if(!cond){HIT[rule]=(HIT[rule]||0)+1;(EX[rule]=EX[rule]||[]).push(who)}}
function has(v){return String(v==null?"":v).trim()!==""}
function band(v){var s=String(v==null?"":v).trim();
 if(s==="")return false;var n=parseFloat(s);return !isNaN(n)&&n>=0&&n<=9}
function atOrAfter(k,mark){var a=JMAIN.indexOf(k),b=JMAIN.indexOf(mark);return a>=0&&b>=0&&a>=b}

/* Ga re nhanh cung tung di qua duong chinh: paused/alumni chac chan da hoc, cancelled da dang ky,
   lost/no_contact thi khong suy ra duoc gi nen bo qua. */
var REACHED={paused:"learning",alumni:"learning",cancelled:"enrolled"};
function reached(J,mark){
 if(atOrAfter(J.k,mark))return true;
 var r=REACHED[J.k];
 return r?atOrAfter(r,mark):false}

/* ten cot - lay qua col() de sai ten la bao ngay */
var C={
 tOverall:col("DL03","overall_score"), tL:col("DL03","skill_listening"), tR:col("DL03","skill_reading"),
 tW:col("DL03","skill_writing"),  tS:col("DL03","skill_speaking"), tStatus:col("DL03","test_status"),
 eFee:col("DL06","final_fee"), ePaid:col("DL06","paid_amount"), eCourse:col("DL06","course_id"),
 pAmt:col("DL07","amount"), pEnr:col("DL07","enrollment_id"),
 oClass:col("DL08","class_id"), cTeach:col("DL10","main_teacher_id"),
 sClass:col("DL11","class_id"), sStatus:col("DL11","session_status"),
 aSess:col("DL12","session_id"), aStu:col("DL12","student_id"),
 wStu:col("DL14","student_id"), wStaff:col("DL14","staff_id"), wSkill:col("DL14","wow_skill")};

/* ---------- 1. DUYET TUNG NGUOI THEO GA APP BAO ---------- */
jAll().forEach(function(J){
 var K=J.C||{}, pid=K.pid; if(!pid)return;
 var lid=(K.L&&K.L.lead_id)||"", sid=K.sid||"";
 var nm=pid+(K.name?(" ("+K.name+")"):"");
 var t3=lid?rows("DL03").filter(function(r){return r.lead_id===lid}):[];
 var t4=lid?rows("DL04").filter(function(r){return r.lead_id===lid}):[];
 var enr=rows("DL06").filter(function(r){return (lid&&r.lead_id===lid)||(sid&&r.student_id===sid)});
 var ob=sid?rows("DL08").filter(function(r){return r.student_id===sid}):[];

 /* A. Qua ga "Co KQ, cho tu van" thi PHAI co diem test - day la loi anh Luan bat duoc */
 if(reached(J,"test_done")){
  var T=t3.filter(function(r){return band(r[C.tOverall])})[0]||t3[0]||{};
  chk("A1 qua ga 'Co KQ' phai co phieu test", t3.length>0, nm);
  chk("A2 phai co diem Overall", band(T[C.tOverall]), nm);
  chk("A3 phai co du 4 ky nang L/R/W/S",
   band(T[C.tL])&&band(T[C.tR])&&band(T[C.tW])&&band(T[C.tS]), nm);
  if(band(T[C.tOverall])&&band(T[C.tL])&&band(T[C.tR])&&band(T[C.tW])&&band(T[C.tS])){
   var av=(parseFloat(T[C.tL])+parseFloat(T[C.tR])+parseFloat(T[C.tW])+parseFloat(T[C.tS]))/4;
   chk("A4 Overall khop trung binh 4 ky nang (lech <=0.5)",
    Math.abs(parseFloat(T[C.tOverall])-av)<=0.5, nm+" overall="+T[C.tOverall]+" tb="+av.toFixed(2));}
  chk("A5 phieu test phai o trang thai da cham", t3.some(function(r){return isc(r[C.tStatus],"graded")}), nm);
 }
 /* B. Qua ga "Dang tu van" thi phai co phieu tu van */
 if(reached(J,"consult")) chk("B1 qua ga 'Dang tu van' phai co phieu tu van DL04", t4.length>0, nm);

 /* C. Qua ga "Dang ky" thi phai co don, co hoc phi, co khoa */
 if(reached(J,"enrolled")){
  chk("C1 qua ga 'Dang ky' phai co don DL06", enr.length>0, nm);
  var E=enr[0]||{};
  chk("C2 don phai co hoc phi > 0", num(E[C.eFee])>0, nm);
  chk("C3 don phai gan khoa hoc co that", has(E[C.eCourse])&&!!find("DL05","course_id",E[C.eCourse]), nm);
 }
 /* D. Qua ga "Da thu" thi phai co phieu thu va tien phai khop */
 if(reached(J,"paid")){
  var E2=enr[0]||{};
  var pays=rows("DL07").filter(function(p){return String(p[C.pEnr])===String(E2.enrollment_id)&&num(p[C.pAmt])>0});
  chk("D1 qua ga 'Da thu' phai co phieu thu DL07", pays.length>0, nm);
  chk("D2 tong phieu thu = da dong ghi tren don",
   Math.abs(pays.reduce(function(a,p){return a+num(p[C.pAmt])},0)-num(E2[C.ePaid]))<=1, nm);
  chk("D3 da dong khong vuot hoc phi", num(E2[C.ePaid])<=num(E2[C.eFee])+1, nm);
 }
 /* E. Qua ga "Onboarding" thi phai co ho so xep lop; dang hoc thi phai co lop that */
 if(reached(J,"onboarding")) chk("E1 qua ga 'Onboarding' phai co ho so xep lop DL08", ob.length>0, nm);
 if(reached(J,"learning")){
  var O=ob[0]||{};
  chk("E2 dang hoc phai duoc xep vao mot lop cu the", has(O[C.oClass]), nm);
  if(has(O[C.oClass])){
   var CL=find("DL10","class_id",O[C.oClass]);
   chk("E3 lop do phai co that trong DL10", !!CL, nm+" -> "+O[C.oClass]);
   if(CL){
    chk("E4 lop phai co giao vien chinh co that",
     has(CL[C.cTeach])&&!!find("DL01","staff_id",CL[C.cTeach]), nm+" -> "+O[C.oClass]);
    var ses=rows("DL11").filter(function(s){return s[C.sClass]===O[C.oClass]});
    chk("E5 lop dang hoc phai co buoi hoc", ses.length>0, nm+" -> "+O[C.oClass]);
    var done=ses.filter(function(s){return isc(s[C.sStatus],"completed")});
    var att=rows("DL12").filter(function(a){return a[C.aStu]===sid&&ses.some(function(s){return s.session_id===a[C.aSess]})});
    chk("E6 so dong diem danh khong vuot so buoi da day",
     att.length<=done.length, nm+" ("+att.length+" diem danh / "+done.length+" buoi da day)");
   }}}
});

/* ---------- 2. CAC BANG TU MAU THUAN NHAU ---------- */
rows("DL12").forEach(function(a){
 var s=find("DL11","session_id",a[C.aSess]);
 chk("F1 dong diem danh phai tro toi mot buoi co that", !!s, a.attendance_id);
 if(s)chk("F2 hoc vien duoc diem danh phai thuoc lop cua buoi do",
  rows("DL08").some(function(o){return o.student_id===a[C.aStu]&&o[C.oClass]===s[C.sClass]}),
  a.attendance_id+" ("+a[C.aStu]+" / "+s[C.sClass]+")")});
rows("DL11").forEach(function(s){
 chk("F3 buoi hoc phai thuoc mot lop co that", !!find("DL10","class_id",s[C.sClass]), s.session_id);
 /* Buoi VUA day xong trong 24h duoc phep con trong: do la HANG CHO diem danh co y (GV chua kip
    diem danh), dung nhu §10b cua fixdata.py dung ra. Cu hon 24h ma van trong la du lieu hong. */
 var sd=pvnd(s.session_date), tuoi=sd?(Date.now()-sd.getTime())/36e5:1e9;
 if(isc(s[C.sStatus],"completed")&&tuoi>24)
  chk("F4 buoi day xong qua 24h phai co it nhat mot dong diem danh",
   rows("DL12").some(function(a){return a[C.aSess]===s.session_id}), s.session_id+" ("+tuoi.toFixed(0)+"h truoc)")});
rows("DL14").forEach(function(w){
 chk("G1 buoi WOW phai thuoc mot hoc vien co that", !!find("DL09","student_id",w[C.wStu]), w.wow_id);
 chk("G2 buoi WOW phai co giao vien co that",
  has(w[C.wStaff])&&!!find("DL01","staff_id",w[C.wStaff]), w.wow_id);
 chk("G3 buoi WOW phai ghi ky nang tap trung", has(w[C.wSkill]), w.wow_id)});
rows("DL07").forEach(function(p){
 chk("H1 phieu thu phai gan mot don co that",
  !!find("DL06","enrollment_id",p[C.pEnr]), p.payment_id||p[C.pEnr])});

/* ---------- BAO CAO ---------- */
var keys=Object.keys(HIT).sort(), sum=0;
if(COLERR.length){
 console.log("SAI TEN COT TRONG CHINH BO KIEM ("+COLERR.length+") - sua bo kiem truoc, dung tin so lieu duoi:");
 COLERR.forEach(function(m){console.log("   "+m)});
}
if(!keys.length&&!COLERR.length){
 console.log("CHECKDATA OK: "+Object.keys(TOT).length+" luat, "+
  Object.keys(TOT).reduce(function(a,k){return a+TOT[k]},0)+" luot kiem - 0 cho lech");
}else{
 console.log("CHECKDATA - CAC CHO DU LIEU KHONG KHOP VOI GA NGHIEP VU:");
 keys.forEach(function(k){sum+=HIT[k];
  console.log("  "+String(HIT[k]).padStart(4)+"/"+String(TOT[k]).padEnd(5)+" "+k+
   "\n        vd: "+EX[k].slice(0,3).join(" | "))});
 console.log("\nTONG CHO LECH: "+sum);
}
process.exitCode=(COLERR.length||keys.length)?1:0;
