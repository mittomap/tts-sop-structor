/* _check15: MOT HANH DONG - MAY CUA VAO.
   Ly do co bo kiem nay: ca hai hoi dong tham dinh deu DOC TUNG DUONG, ma lop loi nguy hiem
   nhat lai nam o KHOANG GIUA hai duong (moi duong doc rieng deu hop ly, dat canh nhau moi sai).
   Vi du that: wowAddSave tru quota NGAY LUC DAT, hvWowSave chi tru khi DA DAY - khong ham nao
   sai mot minh. Bo kiem nay lam hai viec may lam duoc con nguoi doc thi khong:
   (1) KIEM KE moi ham ghi vao tung bang, bao do khi co cua ghi MOI chua khai;
   (2) kiem BAT BIEN nghiep vu - dung du duong nao ghi cung phai thoa.
   Chay: ITTS_OUT=<out> node _check15.js */
var FIELDS={};
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:(FIELDS[id]||""),checked:!!FIELDS["chk_"+id],style:{},offsetHeight:200,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
global.document={getElementById:(id)=>El(id),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
var SRC=require('fs').readFileSync('./_APP.js','utf8');
require('vm').runInThisContext(SRC);
setRole("all");
var bad=[],ok=0;
function t(n,c){if(c)ok++;else bad.push(n)}
function setF(o){FIELDS=o} function reset(){__actT={}}

/* ============ 1. KIEM KE CUA GHI ============ */
var funcs=[];var re=/\nfunction ([A-Za-z0-9_]+)\s*\(/g,m;
while((m=re.exec(SRC)))funcs.push([m.index,m[1]]);
funcs.push([SRC.length,"__END__"]);
var WRITE=/(?:jSaveRow|jUpdRow|markRow|apiSave|apiUpdate)\(\s*"(DL[0-9]+b?)"|DL\.(DL[0-9]+b?)\s*(?:=|\.push|\.unshift)|rows\(\s*"(DL[0-9]+b?)"\s*\)\.(?:push|unshift)/g;
var by={};
for(var i=0;i<funcs.length-1;i++){
 var body=SRC.slice(funcs[i][0],funcs[i+1][0]),w;WRITE.lastIndex=0;
 while((w=WRITE.exec(body))){var tb=w[1]||w[2]||w[3];(by[tb]=by[tb]||{})[funcs[i][1]]=1}}
/* Ban khai: cua ghi DA BIET cua tung bang. Them mot ham ghi moi ma quen khai -> BAO DO,
   buoc nguoi viet doi chieu lai voi cac cua san co xem co lech luat khong. */
var KHAI={
 DL01:["staffAdd","staffSave","gvBioSave"],
 DL02:["bgSplitOrphansRun","doHandoverRun","leadInboundSave","reassignSave","runGiveUpDo","runRejectSave","testQuickSave","touchLead","tvEnrollSave"],
 DL02b:["leadInboundSave","rfNeed","runRejectSave","runTouchSave","testQuickSave"],
 DL03:["rfNeed","testAttend","testBook","testConsult","testNoShowSave","testQuickSave","testRebookSave","testRefuse","testResultSave"],
 DL04:["rfNeed","runSkipTest","tvCloseSave","tvEnrollSave","tvQuickSave","tvSave"],
 DL06:["cancelEnrollRun","paySave","rfNeed","runCancelEnroll","tvEnrollSave"],
 DL07:["duyetRefundRun","paySave","payVerifyRun","rfNeed"],
 DL08:["hvClassConfirm","hvClassRejectSave","midSave","obMark","rfNeed","xepMoiLuu","obChangeSave","obFinish"],
 DL09:["blCallSave","blComeback","blDropout","ensureStudent","ktGenSave","runDropoutSave","runFlagRisk","runTouchSave","tvEnrollSave","wowCancelRun","wowUseQuota"],
 DL10:["xepMoiLuu","obChangeSave","clsSave","rfNeed"],
 DL11:["bhCancelRun","bhDone","bhMakeupSave","bhNoteSave","ddSave","sessEnd","sessStart"],
 DL12:["ddSave","hvAbsentSave"],
 DL13:["chamLuu","giaoBaiCaLop","giaoBaiRieng","sesAssignRun","thuLuu"],
 DL14:["hvWowSave","wowAddSave","wowCancelRun","wowConfirm","wowNoShow","wowNoteSave","wowRescheduleRun","wowTaught","wowUseQuota"],
 DL15:["rvSend","svFollowDone","svResultSave","svSendSave"],
 DL16:["fbClassifySave","fbResolveSave","fbToComplaintSave","ghSave","ghToKN","hvFeedbackSave","hvRateSes"],
 DL17:["fbToComplaintSave","ghToKN","knAddSave","knUpd"],
 DL18:["ktFollowSave","ktGenSave","ktInvite","ktMissSave","ktResultSave","ktTestiSave","rfNeed"],
 DL20:["hwbSave","sesSave"],
 DL21:["gaSave","gaAddSave"],
 DL23:["hvReq","tkNewSave"],
 DL24:["hvAskSaySave","tkSay"]
};
Object.keys(by).forEach(function(tb){
 var have=Object.keys(by[tb]).sort();
 var khai=KHAI[tb]||[];
 var moi=have.filter(function(f){return khai.indexOf(f)<0});
 t("bang "+tb+" khong co cua ghi MOI chua khai"+(moi.length?" ("+moi.join(", ")+")":""), moi.length===0);
});
console.log("KIEM KE: "+Object.keys(by).length+" bang | tong "+
 Object.keys(by).reduce(function(a,k){return a+Object.keys(by[k]).length},0)+" cua ghi | nhieu nhat: "+
 Object.keys(by).sort(function(a,b){return Object.keys(by[b]).length-Object.keys(by[a]).length}).slice(0,3)
  .map(function(k){return k+"("+Object.keys(by[k]).length+")"}).join(" "));

/* ============ 2. BAT BIEN NGHIEP VU - dung du duong nao ghi ============ */
function invQuota(){   /* da tru luot WOW <=> buoi DA DAY hoac HV KHONG DEN */
 return rows("DL14").filter(function(w){
  var ded=String(w.quota_deducted||"").toLowerCase()==="yes";
  var real=isc(w.wow_status,"completed","no_show");
  return ded!==real}).map(function(w){return w.wow_id+"("+ecode(w.wow_status)+"/"+w.quota_deducted+")"})}
t("BAT BIEN: da tru luot WOW <=> buoi da dien ra (tren du lieu dang co)", invQuota().length===0);

/* Lai TUNG CUA dat WOW roi kiem lai chinh bat bien do - day la cho hai hoi dong deu hut */
(function(){
 var S=rows("DL09").filter(function(x){return num(x.wow_quota_remaining)>1})[0];
 if(!S){bad.push("khong co HV con luot WOW de lai thu");return}
 var d=new Date(Date.now()+6*864e5);function z(n){return n<10?"0"+n:n}
 var iso=d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate());
 /* cua 1: hoc vien tu dat qua cong */
 window.HVID=S.student_id;
 var n0=rows("DL14").length;
 reset();setF({hvw_skill:"Speaking (Nói)",hvw_date:iso,hvw_focus:"Part 2"});
 hvWowSave();
 var w1=rows("DL14")[0];
 t("cua CONG HOC VIEN: dat xong CHUA tru luot", rows("DL14").length===n0+1&&String(w1.quota_deducted).toLowerCase()==="no");
 /* cua 2: nhan vien dat ho */
 var gvw=rows("DL01").filter(function(x){return /wow/.test(ecode(x.role))&&isc(x.status,"active")})[0]||{};
 reset();setF({wa_stu:S.student_id,wa_skill:"Writing (Viết)",wa_type:"academic_support (Hỗ trợ học thuật)",
  wa_staff:gvw.staff_id||"",wa_date:iso+"T19:00",wa_focus:"Task 2",wa_by:"academic_hv (Học vụ)",wa_why:"Em nay Writing yeu nhat"});
 var n1=rows("DL14").length;
 wowAddSave(true);
 var w2=rows("DL14")[0];
 t("cua NHAN VIEN: dat xong CHUA tru luot (bang voi cua cong)", rows("DL14").length===n1+1&&String(w2.quota_deducted).toLowerCase()==="no");
 t("HAI CUA ghi giong nhau o cot quota_deducted", String(w1.quota_deducted)===String(w2.quota_deducted));
 t("cua NHAN VIEN bat ghi VI SAO can buoi nay", !!String(w2.notes||"").trim());
 t("cua NHAN VIEN bat ghi TRONG TAM buoi", !!String(w2.wow_content_focus||"").trim());
 t("ca hai cua deu ghi NGUOI DAT", !!String(w1.wow_booked_by||"").trim()&&!!String(w2.wow_booked_by||"").trim());
 /* danh dau da day -> luc nay moi duoc tru, va bam lai khong tru them */
 var used0=num(find("DL09","student_id",S.student_id).wow_quota_used);
 wowTaught(w2.wow_id);
 var used1=num(find("DL09","student_id",S.student_id).wow_quota_used);
 t("tru luot DUNG LUC danh dau da day", used1===used0+1&&String(find("DL14","wow_id",w2.wow_id).quota_deducted).toLowerCase()==="yes");
 wowTaught(w2.wow_id);
 t("bam lai KHONG tru them lan nua", num(find("DL09","student_id",S.student_id).wow_quota_used)===used1);
 /* HV khong den cung tru theo chinh sach */
 var used2=num(find("DL09","student_id",S.student_id).wow_quota_used);
 wowNoShow(w1.wow_id);
 t("HV khong den cung tru luot theo chinh sach", num(find("DL09","student_id",S.student_id).wow_quota_used)===used2+1);
 t("BAT BIEN van dung sau khi lai het cac cua", invQuota().length===0);
})();

/* ============ 3. BAT BIEN TIEN ============ */
t("BAT BIEN: con lai = hoc phi - da dong (moi don chua huy)",
  rows("DL06").filter(function(e){return !isc(e.enrollment_status,"cancelled")&&
   Math.abs(num(e.final_fee)-num(e.paid_amount)-num(e.remaining_amount))>1}).length===0);
t("BAT BIEN: don con no thi PHAI co hen thu",
  rows("DL06").filter(function(e){return isc(e.enrollment_status,"confirmed")&&num(e.remaining_amount)>0&&
   !String(e.next_payment_due||"").trim()}).length===0);
t("BAT BIEN: khong don nao dong THUA",
  rows("DL06").filter(function(e){return num(e.paid_amount)>num(e.final_fee)+1}).length===0);
t("BAT BIEN: cong hoc vien KHONG BAO GIO tu ghi phieu thu",
  !/function hvPaidNotifySave[\s\S]{0,1400}?(jSaveRow\("DL07"|DL\.DL07|rows\("DL07"\)\.)/.test(SRC));

console.log(bad.length?("CHECK15 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK15 OK: "+ok+" tieu chi");
