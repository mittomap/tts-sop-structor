/**
 * ITTs WEB APP v3
 * CAP NHAT: dan DE toan bo len file cu, roi Trien khai > Quan ly ban trien khai > (but chi) > Phien ban: MOI > Trien khai.
 * Header app se hien "demo v3" - neu chua thay chu v3 nghia la chua tao phien ban moi.
 */

var WA_VER = 'v3';

function doGet() {
  return HtmlService.createHtmlOutput(WA_HTML)
    .setTitle('ITTs - IELTS THE TUTORS')
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

// ================= TIEN ICH =================
function waSS(){ return SpreadsheetApp.getActive(); }
function waSheet(pfx){
  var shs = waSS().getSheets();
  for (var i=0;i<shs.length;i++) if (shs[i].getName().indexOf(pfx)===0) return shs[i];
  throw new Error('Không tìm thấy sheet ' + pfx);
}
function waHead(sh){
  var h = sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0], m={};
  for (var i=0;i<h.length;i++) if (h[i]) m[String(h[i])]=i;
  return m;
}
function waData(sh){ var n=sh.getLastRow()-3; return n>0? sh.getRange(4,1,n,sh.getLastColumn()).getValues():[]; }
function waDisp(sh){ var n=sh.getLastRow()-3; return n>0? sh.getRange(4,1,n,sh.getLastColumn()).getDisplayValues():[]; }
function waParam(name,fb){ try{var r=waSS().getRangeByName(name);return r?Number(r.getValue()):fb;}catch(e){return fb;} }
function waLink(sh,row){ return waSS().getUrl()+'#gid='+sh.getSheetId()+'&range=A'+row; }
function waCls(na){
  na=String(na||'');
  if (/ ngay| gấp|GỌI|NGUY/.test(na)) return 'red';
  if (/Không cần làm gì/.test(na)) return 'green';
  return na?'yel':'';
}

// ================= FORM LEAD: TU SINH TU CAU TRUC DL02 =================
var WA_SKIP = { lead_id:1, lead_created_time:1, lead_status:1, view_history:1 };
var WA_REQ  = { full_name:1, phone_number:1, lead_source:1 };

function waLeadFields(){
  var sh = waSheet('DL02.');
  var lastCol = sh.getLastColumn();
  var heads = sh.getRange(1,1,1,lastCol).getValues()[0];
  var labels = sh.getRange(2,1,1,lastCol).getValues()[0];
  var hints  = sh.getRange(3,1,1,lastCol).getValues()[0];
  var fmls   = sh.getRange(4,1,1,lastCol).getFormulas()[0];
  var fields = [];
  for (var c=0;c<lastCol;c++){
    var h = String(heads[c]||'');
    if (!h || WA_SKIP[h] || h==='assigned_to') continue;
    if (fmls[c]) continue; // cot tu dong -> khong nhap
    var f = { header:h, label:String(labels[c]||h), hint:String(hints[c]||''), req:!!WA_REQ[h], type:'text', options:null };
    try {
      var dv = sh.getRange(4,c+1).getDataValidation();
      if (dv){
        var crit = dv.getCriteriaType();
        if (crit == SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE){
          var vals = dv.getCriteriaValues()[0].getValues();
          var opts = [];
          for (var k=0;k<vals.length;k++) if (vals[k][0]!=='') opts.push(String(vals[k][0]));
          if (opts.length){ f.type='select'; f.options=opts; }
        } else if (crit == SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST){
          f.type='select'; f.options=dv.getCriteriaValues()[0].map(String);
        }
      }
    } catch(e){}
    if (f.type==='text'){
      if (/_time$|_date$/.test(h)) f.type='datetime';
      else if (/band|score|count|amount/.test(h)) f.type='number';
      else if (/note|schedule/.test(h)) f.type='textarea';
    }
    fields.push(f);
  }
  // NV phu trach: chi Tu van (sales) dang hoat dong
  var st = waSheet('DL01.'), hs = waHead(st), sv = waData(st), staff=[];
  for (var i=0;i<sv.length;i++){
    if (!sv[i][0]) continue;
    var role = String(sv[i][hs['role']]||'');
    var stt  = String(sv[i][hs['status']]||'');
    if (/sales/.test(role) && !/inactive|nghỉ/i.test(stt)){
      staff.push({ id:String(sv[i][0]), name:String(sv[i][hs['full_name']]||'') });
    }
  }
  if (!staff.length) for (i=0;i<sv.length;i++) if (sv[i][0]) staff.push({id:String(sv[i][0]),name:String(sv[i][hs['full_name']]||'')});
  return { ver:WA_VER, fields:fields, staff:staff };
}

function waSaveLead(p){
  var lock=LockService.getDocumentLock(); lock.waitLock(20000);
  try {
    var sh=waSheet('DL02.');
    var lastCol=sh.getLastColumn();
    var heads=sh.getRange(1,1,1,lastCol).getValues()[0].map(String);
    var colA=sh.getRange(4,1,sh.getMaxRows()-3,1).getValues();
    var row=4;
    for (var i=0;i<colA.length;i++){ if(String(colA[i][0])===''){ row=i+4; break; } }
    var year=new Date().getFullYear(), mx=0;
    for (i=0;i<colA.length;i++){
      var m=String(colA[i][0]||'').match(/^L-(\d{4})-(\d+)$/);
      if (m) mx=Math.max(mx,parseInt(m[2],10));
    }
    var id='L-'+year+'-'+('00000'+(mx+1)).slice(-5);
    var vals = p.values||{};
    // trang thai new lay dung tu CH1 (o dau khoi lead_status cua dropdown chinh cot nay)
    var newStatus='new';
    try {
      var dvS=sh.getRange(4,heads.indexOf('lead_status')+1).getDataValidation();
      var arr=dvS.getCriteriaValues()[0].getValues();
      for (i=0;i<arr.length;i++){ if(String(arr[i][0]).indexOf('new')===0){ newStatus=String(arr[i][0]); break; } }
    } catch(e){}
    // 1) keo cong thuc dong tren xuong (tru cot se ghi gia tri)
    var writing={lead_id:1,lead_created_time:1,lead_status:1,assigned_to:1};
    for (var k in vals) writing[k]=1;
    var prev=row-1;
    if (prev>=4){
      var fml=sh.getRange(prev,1,1,lastCol).getFormulas()[0];
      for (var c=0;c<lastCol;c++){
        if (fml[c] && !writing[heads[c]]) sh.getRange(prev,c+1).copyTo(sh.getRange(row,c+1));
      }
    }
    // 2) ghi gia tri
    function setH(h,v){ var ci=heads.indexOf(h); if(ci>-1 && v!=='' && v!=null) sh.getRange(row,ci+1).setValue(v); }
    setH('lead_id',id);
    setH('lead_created_time',new Date());
    setH('lead_status',newStatus);
    for (var h in vals){
      var v=vals[h];
      if (v==='' || v==null) continue;
      if (/_time$|_date$/.test(h) && typeof v==='string'){
        var d=new Date(v); if(!isNaN(d)) v=d;
      }
      if (/band|score|count|amount/.test(h) && typeof v==='string' && v!=='') v=Number(v);
      setH(h,v);
    }
    // 3) assigned_to: ghi dung dang cong thuc link nhu he thong
    if (p.staff){
      var ci=heads.indexOf('assigned_to');
      if (ci>-1){
        var f='=IFERROR(HYPERLINK("#\'DL01. Nhân viên\'!A"&MATCH("'+p.staff+'",\'DL01. Nhân viên\'!A:A,0),"'+p.staff+'"),"'+p.staff+'")';
        sh.getRange(row,ci+1).setFormula(f);
      }
    }
    return {ok:true,id:id,link:waLink(sh,row)};
  } catch(e){ return {ok:false,error:String(e && e.message || e)}; }
  finally { lock.releaseLock(); }
}

// ================= DASHBOARD =================
function waDash(){
  var out=[], today=new Date(); today.setHours(0,0,0,0);
  function push(label,count,pfx,cls){
    var sh=waSheet(pfx);
    out.push({label:label,count:count,link:waSS().getUrl()+'#gid='+sh.getSheetId(),cls:cls||(count>0?'yel':'green')});
  }
  var d2=waSheet('DL02.'), h2=waHead(d2), v2=waData(d2), leadToday=0, leadRed=0;
  for (var i=0;i<v2.length;i++){
    if(!v2[i][0]) continue;
    var t=v2[i][h2['lead_created_time']];
    if (t instanceof Date && t>=today) leadToday++;
    if (waCls(v2[i][h2['next_action']])==='red') leadRed++;
  }
  push('Lead mới hôm nay',leadToday,'DL02.',leadToday>0?'blue':'green');
  push('Lead cần gọi GẤP',leadRed,'DL02.',leadRed>0?'red':'green');
  var d9=waSheet('DL09.'), h9=waHead(d9), v9=waData(d9), risk=0;
  for (i=0;i<v9.length;i++){
    if(!v9[i][0]) continue;
    var fl=String(v9[i][h9['attendance_progress_status']]||'')+String(v9[i][h9['academic_progress_status']]||'');
    if (/at_risk|off_track/.test(fl)) risk++;
  }
  push('Học viên nguy cơ',risk,'BC1.',risk>0?'red':'green');
  var d6=waSheet('DL06.'), h6=waHead(d6), v6=waData(d6), ck=0, no=0;
  var th=waParam('thresholdDiscount_approval',1000000);
  for (i=0;i<v6.length;i++){
    if(!v6[i][0]) continue;
    if (Number(v6[i][h6['discount_amount']]||0)>=th && !v6[i][h6['discount_approved_by']]) ck++;
    if (Number(v6[i][h6['remaining_amount']]||0)>0 && /confirmed/.test(String(v6[i][h6['enrollment_status']]||''))) no++;
  }
  push('Chiết khấu chờ duyệt',ck,'BC9.',ck>0?'yel':'green');
  push('Khoản phí còn nợ',no,'DL06.',no>0?'yel':'green');
  var d17=waSheet('DL17.'), h17=waHead(d17), v17=waData(d17), kn=0;
  for (i=0;i<v17.length;i++){
    if(!v17[i][0]) continue;
    if (!/resolved/.test(String(v17[i][h17['complaint_status']]||''))) kn++;
  }
  push('Khiếu nại đang mở',kn,'DL17.',kn>0?'red':'green');
  return out;
}

// ================= VIEC HOM NAY =================
function waTasks(role){
  try {
    var items=[];
    if (role==='sales'){
      var sh=waSheet('DL02.'), h=waHead(sh), v=waData(sh), d=waDisp(sh);
      var lim=new Date(); lim.setDate(lim.getDate()+1);
      for (var i=0;i<v.length;i++){
        if(!v[i][0]) continue;
        var nf=v[i][h['next_followup_time']];
        if (nf instanceof Date && nf<=lim){
          items.push({id:d[i][0], title:d[i][h['full_name']],
            sub:'SĐT: '+d[i][h['phone_number']]+' · '+d[i][h['lead_status']]+' · hẹn '+d[i][h['next_followup_time']],
            na:d[i][h['next_action']], link:waLink(sh,i+4)});
        }
      }
    } else if (role==='risk'){
      sh=waSheet('DL09.'); h=waHead(sh); v=waData(sh); d=waDisp(sh);
      for (i=0;i<v.length;i++){
        if(!v[i][0]) continue;
        var fl=String(v[i][h['attendance_progress_status']]||'')+' '+String(v[i][h['academic_progress_status']]||'');
        if (/at_risk|off_track/.test(fl)){
          items.push({id:d[i][0], title:d[i][h['full_name']],
            sub:'CC: '+d[i][h['attendance_progress_status']]+' · HT: '+d[i][h['academic_progress_status']]+' · SĐT: '+d[i][h['phone_number']],
            na:d[i][h['next_action']], link:waLink(sh,i+4)});
        }
      }
    } else if (role==='test'){
      sh=waSheet('DL03.'); h=waHead(sh); v=waData(sh); d=waDisp(sh);
      for (i=0;i<v.length;i++){
        if(!v[i][0]) continue;
        if (/pending/.test(String(v[i][h['test_status']]||''))){
          items.push({id:d[i][0], title:'Lead '+d[i][h['lead_id']],
            sub:'Ngày test: '+d[i][h['test_date']]+' · '+d[i][h['test_format']],
            na:d[i][h['next_action']], link:waLink(sh,i+4)});
        }
      }
    } else if (role==='fee'){
      sh=waSheet('DL06.'); h=waHead(sh); v=waData(sh); d=waDisp(sh);
      for (i=0;i<v.length;i++){
        if(!v[i][0]) continue;
        if (Number(v[i][h['remaining_amount']]||0)>0 && /confirmed/.test(String(v[i][h['enrollment_status']]||''))){
          items.push({id:d[i][0], title:'HV '+d[i][h['student_id']],
            sub:'Còn nợ: '+d[i][h['remaining_amount']]+' đ · khóa '+d[i][h['course_id']],
            na:d[i][h['next_action']], link:waLink(sh,i+4)});
        }
      }
    } else if (role==='class'){
      sh=waSheet('DL10.'); h=waHead(sh); v=waData(sh); d=waDisp(sh);
      var win=waParam('thresholdClassStart_days',14);
      var now=new Date(); now.setHours(0,0,0,0);
      var end=new Date(now.getTime()+win*86400000);
      for (i=0;i<v.length;i++){
        if(!v[i][0]) continue;
        var st=v[i][h['class_start_date']];
        if (st instanceof Date && st>=now && st<=end){
          items.push({id:d[i][0], title:d[i][h['class_name']],
            sub:'Khai giảng: '+d[i][h['class_start_date']]+' · sĩ số '+d[i][h['current_enrollment']]+'/'+d[i][h['class_capacity']],
            na:'Chuẩn bị khai giảng: chốt sĩ số, gửi thông tin lớp cho HV.', link:waLink(sh,i+4)});
        }
      }
    } else if (role==='kn'){
      sh=waSheet('DL17.'); h=waHead(sh); v=waData(sh); d=waDisp(sh);
      for (i=0;i<v.length;i++){
        if(!v[i][0]) continue;
        if (!/resolved/.test(String(v[i][h['complaint_status']]||''))){
          items.push({id:d[i][0], title:'HV '+d[i][h['student_id']],
            sub:d[i][h['complaint_type']]+' · mức '+d[i][h['complaint_severity']]+' · '+d[i][h['complaint_status']],
            na:d[i][h['next_action']], link:waLink(sh,i+4)});
        }
      }
    } else {
      return {ok:false, error:'Vai trò không hợp lệ: '+role};
    }
    for (i=0;i<items.length;i++) items[i].cls=waCls(items[i].na);
    items.sort(function(a,b){ return (a.cls==='red'?0:1)-(b.cls==='red'?0:1); });
    return {ok:true, items:items.slice(0,50)};
  } catch(e){ return {ok:false, error:String(e && e.stack || e)}; }
}

// ================= TRA CUU =================
function waSearch(q){
  try {
    q=String(q||'').toLowerCase().trim();
    if (q.length<2) return {ok:true, items:[]};
    var items=[];
    var d9=waSheet('DL09.'), h9=waHead(d9), s9=waDisp(d9);
    for (var i=0;i<s9.length;i++){
      if(!s9[i][0]) continue;
      if ((s9[i][h9['full_name']]||'').toLowerCase().indexOf(q)>-1 || String(s9[i][h9['phone_number']]||'').indexOf(q)>-1){
        items.push({id:s9[i][0], title:s9[i][h9['full_name']], sub:'Học viên · '+s9[i][h9['student_status']]+' · '+s9[i][h9['phone_number']],
          na:s9[i][h9['next_action']], cls:waCls(s9[i][h9['next_action']]), link:waLink(d9,i+4)});
      }
    }
    var d2=waSheet('DL02.'), h2=waHead(d2), s2=waDisp(d2);
    for (i=0;i<s2.length;i++){
      if(!s2[i][0]) continue;
      if ((s2[i][h2['full_name']]||'').toLowerCase().indexOf(q)>-1 || String(s2[i][h2['phone_number']]||'').indexOf(q)>-1){
        items.push({id:s2[i][0], title:s2[i][h2['full_name']], sub:'Lead · '+s2[i][h2['lead_status']]+' · '+s2[i][h2['phone_number']],
          na:s2[i][h2['next_action']], cls:waCls(s2[i][h2['next_action']]), link:waLink(d2,i+4)});
      }
    }
    return {ok:true, items:items.slice(0,30)};
  } catch(e){ return {ok:false, error:String(e && e.message || e)}; }
}

// ================= HTML =================
var WA_HTML =
'<!DOCTYPE html><html><head><meta charset="utf-8">'+
'<link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;700;800&display=swap" rel="stylesheet">'+
'<style>'+
':root{--navy:#2E5A88;--dark:#1A5276;--bg:#F2F4F7;--line:#DFE3E8;--red:#E74C3C;--yel:#F1C40F;--grn:#2ECC71;--blue:#3498DB}'+
'*{box-sizing:border-box;font-family:Montserrat,sans-serif}'+
'body{margin:0;background:var(--bg);color:#17202A}'+
'header{background:linear-gradient(135deg,var(--dark),var(--navy));color:#fff;padding:16px 20px}'+
'header b{font-size:18px}header span{display:block;font-size:11px;opacity:.85;margin-top:2px}'+
'nav{display:flex;background:#fff;border-bottom:1px solid var(--line);position:sticky;top:0;z-index:5}'+
'nav button{flex:1;padding:12px 4px;border:0;background:none;color:#7f8c99;font-weight:700;font-size:12.5px;cursor:pointer;border-bottom:3px solid transparent}'+
'nav button.on{color:var(--dark);border-bottom-color:var(--navy)}'+
'main{max-width:900px;margin:0 auto;padding:14px}'+
'.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(160px,1fr));gap:10px}'+
'.kpi{background:#fff;border:1px solid var(--line);border-radius:14px;padding:14px;text-decoration:none;color:inherit;display:block}'+
'.kpi .n{font-size:28px;font-weight:800}.kpi .l{font-size:12px;color:#66707c;margin-top:2px}'+
'.kpi.red .n{color:var(--red)}.kpi.yel .n{color:#B7950B}.kpi.green .n{color:#1E8449}.kpi.blue .n{color:var(--blue)}'+
'.card{background:#fff;border:1px solid var(--line);border-radius:14px;padding:16px;margin:12px 0}'+
'.f2{display:grid;grid-template-columns:1fr 1fr;gap:0 14px}'+
'@media(max-width:560px){.f2{grid-template-columns:1fr}}'+
'label{display:block;font-size:12px;font-weight:700;color:#5d6a76;margin:10px 0 4px}'+
'label i{font-style:normal;color:var(--red)}'+
'small{display:block;color:#9aa4ae;font-size:10.5px;margin-top:2px}'+
'input,select,textarea{width:100%;padding:11px;border:1px solid var(--line);border-radius:9px;font-size:14px;background:#fff}'+
'button.pri{margin-top:16px;width:100%;padding:13px;border:0;border-radius:9px;background:var(--navy);color:#fff;font-weight:800;font-size:15px;cursor:pointer}'+
'button.pri:disabled{opacity:.5}'+
'.task{background:#fff;border:1px solid var(--line);border-left:6px solid var(--yel);border-radius:12px;padding:12px 14px;margin-bottom:10px}'+
'.task.red{border-left-color:var(--red)}.task.green{border-left-color:var(--grn)}'+
'.task .t{font-weight:700;font-size:14px}.task .s{font-size:12px;color:#66707c;margin-top:3px}'+
'.task .na{font-size:13px;margin-top:8px;background:#FBFCFD;border:1px dashed var(--line);border-radius:8px;padding:8px}'+
'.task a{font-size:12px;color:var(--navy);font-weight:700;text-decoration:none;display:inline-block;margin-top:8px}'+
'.pills{display:flex;gap:8px;flex-wrap:wrap;margin-bottom:12px}'+
'.pill{border:1px solid var(--line);background:#fff;border-radius:999px;padding:8px 14px;font-size:12.5px;font-weight:700;color:#5d6a76;cursor:pointer}'+
'.pill.on{background:var(--navy);border-color:var(--navy);color:#fff}'+
'.empty{color:#7f8c99;font-size:14px;padding:24px;text-align:center}'+
'.err{background:#FDECEA;color:#B03A2E;border:1px solid #F5B7B1;border-radius:10px;padding:12px;font-size:13px;margin:10px 0;display:none;white-space:pre-wrap}'+
'.ok{background:#E8F8F0;color:#1E8449;border:1px solid #A9DFBF;border-radius:10px;padding:12px;font-size:14px;margin-top:12px;display:none}'+
'h3{margin:6px 2px 10px;font-size:13px;letter-spacing:.4px;color:#5d6a76;text-transform:uppercase}'+
'</style></head><body>'+
'<header><b>ITTs - IELTS THE TUTORS</b><span>Hệ điều hành trung tâm · demo v3</span></header>'+
'<nav>'+
'<button id="t0" class="on" onclick="tab(0)">Tổng quan</button>'+
'<button id="t1" onclick="tab(1)">Việc hôm nay</button>'+
'<button id="t2" onclick="tab(2)">Nhập lead</button>'+
'<button id="t3" onclick="tab(3)">Tra cứu</button>'+
'</nav><main>'+
'<div class="err" id="err"></div>'+
'<div id="p0"><h3>Tình hình hôm nay</h3><div class="grid" id="dash"><div class="empty">Đang tải...</div></div></div>'+
'<div id="p1" style="display:none"><div class="pills" id="pills"></div><div id="taskList"></div></div>'+
'<div id="p2" style="display:none"><div class="card">'+
'<div id="leadForm"><div class="empty">Đang tải cấu trúc form từ DL02...</div></div>'+
'<button class="pri" id="btnSave" onclick="save()" style="display:none">Lưu lead</button>'+
'<div class="ok" id="okMsg"></div></div></div>'+
'<div id="p3" style="display:none"><div class="card">'+
'<label>Tìm theo tên hoặc SĐT (Học viên + Lead)</label>'+
'<input id="q" placeholder="vd: Minh Anh hoặc 0903..." oninput="qDelay()"></div>'+
'<div id="qList"></div></div>'+
'</main><script>'+
'var ROLES=[["sales","Chăm khách (Tư vấn)"],["risk","HV nguy cơ (Học vụ)"],["test","Test chờ chấm (WOW)"],'+
'["fee","Thu học phí (Kế toán)"],["class","Lớp sắp khai giảng"],["kn","Khiếu nại đang mở"]];'+
'var ROLE="sales", FIELDS=[], tasksLoaded=false;'+
'function E(id){return document.getElementById(id)}'+
'function showErr(m){var e=E("err");e.style.display="block";e.textContent="Lỗi: "+m}'+
'function clrErr(){E("err").style.display="none"}'+
'function fail(e){showErr(e && e.message ? e.message : e)}'+
'window.onerror=function(m){showErr(m);return false};'+
'function tab(n){for(var i=0;i<4;i++){E("p"+i).style.display=i==n?"":"none";E("t"+i).className=i==n?"on":"";}clrErr();'+
'if(n==0)loadDash(); if(n==1&&!tasksLoaded){tasksLoaded=true;loadTasks();}}'+
'function card(x){var d=document.createElement("div");d.className="task "+(x.cls||"");'+
'd.innerHTML="<div class=t>"+x.id+" · "+(x.title||"")+"</div><div class=s>"+(x.sub||"")+"</div>"+'+
'(x.na?"<div class=na>"+x.na+"</div>":"")+'+
'(x.link?"<a href=\'"+x.link+"\' target=_blank>Mở dòng trong Sheets ›</a>":"");return d}'+
'function loadDash(){google.script.run.withSuccessHandler(function(d){'+
'var g=E("dash");g.innerHTML="";d.forEach(function(k){var a=document.createElement("a");'+
'a.className="kpi "+k.cls;a.href=k.link;a.target="_blank";'+
'a.innerHTML="<div class=n>"+k.count+"</div><div class=l>"+k.label+"</div>";g.appendChild(a);});'+
'}).withFailureHandler(fail).waDash();}'+
'(function(){var p=E("pills");ROLES.forEach(function(r,idx){'+
'var b=document.createElement("button");b.className="pill"+(idx==0?" on":"");b.textContent=r[1];'+
'b.onclick=function(){ROLE=r[0];[].forEach.call(p.children,function(c){c.className="pill"});'+
'b.className="pill on";loadTasks();};p.appendChild(b);});})();'+
'function loadTasks(){clrErr();E("taskList").innerHTML="<div class=empty>Đang tải...</div>";'+
'google.script.run.withSuccessHandler(function(d){'+
'if(!d.ok){showErr(d.error);E("taskList").innerHTML="";return;}'+
'var el=E("taskList");el.innerHTML="";'+
'if(!d.items.length){el.innerHTML="<div class=empty>Không có việc nào - tốt!</div>";return;}'+
'd.items.forEach(function(x){el.appendChild(card(x))});'+
'}).withFailureHandler(fail).waTasks(ROLE);}'+
'google.script.run.withSuccessHandler(function(d){'+
'FIELDS=d.fields;var f=E("leadForm");f.innerHTML="";'+
'var wrap=document.createElement("div");wrap.className="f2";'+
'd.fields.forEach(function(x){var div=document.createElement("div");'+
'var big=(x.type=="textarea");if(big)div.style.gridColumn="1/-1";'+
'var inp;'+
'if(x.type=="select"){inp="<select id=\'F_"+x.header+"\'><option value=\'\'>-- chọn --</option>"+'+
'x.options.map(function(o){return "<option>"+o+"</option>"}).join("")+"</select>";}'+
'else if(x.type=="textarea"){inp="<textarea id=\'F_"+x.header+"\' rows=2></textarea>";}'+
'else if(x.type=="datetime"){inp="<input id=\'F_"+x.header+"\' type=\'datetime-local\'>";}'+
'else if(x.type=="number"){inp="<input id=\'F_"+x.header+"\' type=\'number\' step=\'0.5\'>";}'+
'else{inp="<input id=\'F_"+x.header+"\'>";}'+
'div.innerHTML="<label>"+x.label+(x.req?" <i>*</i>":"")+"</label>"+inp+'+
'(x.hint?"<small>"+x.hint+"</small>":"");wrap.appendChild(div);});'+
'var sdiv=document.createElement("div");'+
'sdiv.innerHTML="<label>NV Tư vấn phụ trách <i>*</i></label><select id=\'F__staff\'>"+'+
'd.staff.map(function(s){return "<option value=\'"+s.id+"\'>"+s.id+" - "+s.name+"</option>"}).join("")+"</select>";'+
'wrap.appendChild(sdiv);f.appendChild(wrap);E("btnSave").style.display="";'+
'}).withFailureHandler(fail).waLeadFields();'+
'function save(){clrErr();var vals={},missing=[];'+
'FIELDS.forEach(function(x){var el=E("F_"+x.header);var v=el?el.value.trim():"";'+
'if(x.req&&!v)missing.push(x.label);vals[x.header]=v;});'+
'if(missing.length){alert("Thiếu: "+missing.join(", "));return;}'+
'var b=E("btnSave");b.disabled=true;b.textContent="Đang lưu...";'+
'google.script.run.withSuccessHandler(function(r){b.disabled=false;b.textContent="Lưu lead";'+
'if(!r.ok){showErr(r.error);return;}'+
'var ok=E("okMsg");ok.style.display="block";'+
'ok.innerHTML="Đã lưu <b>"+r.id+"</b> - hệ thống sẽ tự nhắc theo SLA. <a href=\'"+r.link+"\' target=_blank>Xem dòng ›</a>";'+
'FIELDS.forEach(function(x){var el=E("F_"+x.header);if(el)el.value="";});'+
'}).withFailureHandler(function(e){b.disabled=false;b.textContent="Lưu lead";fail(e);})'+
'.waSaveLead({values:vals,staff:E("F__staff").value});}'+
'var qt=null;function qDelay(){clearTimeout(qt);qt=setTimeout(doQ,350)}'+
'function doQ(){var q=E("q").value;E("qList").innerHTML="<div class=empty>Đang tìm...</div>";'+
'google.script.run.withSuccessHandler(function(d){'+
'if(!d.ok){showErr(d.error);E("qList").innerHTML="";return;}'+
'var el=E("qList");el.innerHTML="";'+
'if(!d.items.length){el.innerHTML="<div class=empty>Không thấy kết quả.</div>";return;}'+
'd.items.forEach(function(x){el.appendChild(card(x))});'+
'}).withFailureHandler(fail).waSearch(q);}'+
'loadDash();'+
'</script></body></html>';
