/**
 * ITTs - NHẮC VIỆC TỰ ĐỘNG THEO SLA  (chạy nền hằng ngày)
 * ------------------------------------------------------------------
 * Quét dữ liệu, tìm việc QUÁ HẠN theo ngưỡng CH2, gom theo NHÂN VIÊN PHỤ TRÁCH
 * rồi gửi email nhắc. Đây là "trụ tự động" của SOP.
 *
 * CÁCH DÙNG:
 *  1) Thêm file này vào Apps Script của sheet (cùng project với WebApp v4).
 *  2) Chạy hàm testReminders() một lần -> xem báo cáo (KHÔNG gửi email) để kiểm logic
 *     trên dữ liệu thật: có bao nhiêu việc quá hạn, của ai.
 *  3) Muốn gửi email thật: đặt REMIND_SEND = true (đầu file), rồi chạy setupReminderTrigger()
 *     một lần để đặt lịch chạy tự động mỗi sáng 7h.
 *  4) Gỡ lịch: chạy removeReminderTriggers().
 *
 * Yêu cầu: cột email ở DL01 điền đúng (để gửi cho đúng NV). Ngưỡng lấy từ named range CH2,
 * thiếu ngưỡng nào thì dùng mặc định an toàn.
 */

var REMIND_SEND = false;   // false = chỉ ghi log / báo cáo; true = gửi email thật
var REMIND_CC   = '';      // email nhận bản tổng hợp việc CHUNG (vd quản lý). Để trống nếu không cần.
var REMIND_TZ   = 'Asia/Ho_Chi_Minh';

function rSS(){ return SpreadsheetApp.getActive(); }
function rSheet(pfx){ var s=rSS().getSheets(); for(var i=0;i<s.length;i++){ if(s[i].getName().indexOf(pfx)===0) return s[i]; } return null; }
function rParam(name, fb){ try{ var r=rSS().getRangeByName(name); var v=r?r.getValue():null; return (v===''||v==null||isNaN(Number(v)))? fb : Number(v); }catch(e){ return fb; } }
function rEcode(s){ s=String(s==null?'':s); var m=s.match(/^([^(]+?)\s*\(/); return m? m[1].trim() : s.trim(); }
function rRows(pfx){ var sh=rSheet(pfx); if(!sh) return {hdr:{},data:[]}; var last=sh.getLastRow(); if(last<4) return {hdr:{},data:[]}; var lc=sh.getLastColumn(); var h=sh.getRange(1,1,1,lc).getValues()[0]; var hdr={}; for(var i=0;i<h.length;i++){ if(h[i]) hdr[String(h[i])]=i; } return {hdr:hdr, data:sh.getRange(4,1,last-3,lc).getValues()}; }
function rHoursAgo(d){ if(!(d instanceof Date)) return null; return (Date.now()-d.getTime())/3600000; }
function rDaysAgo(d){ var h=rHoursAgo(d); return h==null? null : h/24; }
function rFmt(d){ return (d instanceof Date)? Utilities.formatDate(d, REMIND_TZ, 'dd/MM/yyyy HH:mm') : ''; }
function rStaff(){ var o=rRows('DL01.'); var m={}; for(var i=0;i<o.data.length;i++){ var id=String(o.data[i][o.hdr['staff_id']]||''); if(id) m[id]={name:String(o.data[i][o.hdr['full_name']]||''), email:String(o.data[i][o.hdr['email']]||'')}; } return m; }

/** Quét mọi tình huống quá hạn -> {byStaff:{sid:[items]}, noStaff:[items]} */
function rScan(){
  var P = {
    followup: rParam('slaFollowup_grace_days', 2),
    ob:       rParam('slaOBT_hours', 48),
    pay:      rParam('slaPayment_grace_days', 7),
    hw:       rParam('slaHomeworkGrading_hours', 48),
    knH:      rParam('slaKN_high_hours', 24),
    knM:      rParam('slaKN_medium_hours', 48),
    knL:      rParam('slaKN_low_hours', 72),
    test:     rParam('slaGLA_hours', 48),
    classinfo:rParam('slaClassInfoZalo_hours', 24),
    wnote:    rParam('slaWowNote_hours', 24)
  };
  var byStaff={}, noStaff=[];
  function push(sid, item){ if(sid){ (byStaff[sid]=byStaff[sid]||[]).push(item); } else { noStaff.push(item); } }

  // 1) Lead quá hạn liên hệ
  var L=rRows('DL02.'), hL=L.hdr;
  L.data.forEach(function(r){ if(!r[0]) return; var st=rEcode(r[hL['lead_status']]); if(/converted|rejected|unreachable/.test(st)) return;
    var nf=r[hL['next_followup_time']]; if(nf instanceof Date && nf.getTime()<Date.now()){
      push(String(r[hL['assigned_to']]||''), {type:'Lead quá hạn liên hệ', id:String(r[0]), who:String(r[hL['full_name']]||''), detail:'hẹn '+rFmt(nf)}); } });

  // 2) Onboarding quá hạn (slaOBT_hours)
  var O=rRows('DL08.'), hO=O.hdr;
  O.data.forEach(function(r){ if(!r[0]) return; if(/completed/.test(rEcode(r[hO['onboarding_status']]))) return;
    var h=rHoursAgo(r[hO['assigned_at']]); if(h!=null && h>P.ob){
      push(String(r[hO['assigned_by']]||''), {type:'Onboarding quá hạn', id:String(r[0]), who:String(r[hO['student_id_name']]||r[hO['student_id']]||''), detail:Math.round(h)+'h > '+P.ob+'h'}); } });

  // 2b) Chưa gửi thông tin lớp (chỉ quét khi DL08 đã có cột class_info_sent_at)
  if('class_info_sent_at' in hO){ O.data.forEach(function(r){ if(!r[0]) return;
    if(String(r[hO['class_id']]||'')==='') return;
    if(/completed/.test(rEcode(r[hO['onboarding_status']]))) return;
    if(String(r[hO['class_info_sent_at']]||'')!=='') return;
    var h=rHoursAgo(r[hO['assigned_at']]); if(h!=null && h>P.classinfo){
      push(String(r[hO['assigned_by']]||''), {type:'Chưa gửi thông tin lớp', id:String(r[0]), who:String(r[hO['student_id_name']]||r[hO['student_id']]||''), detail:Math.round(h)+'h > '+P.classinfo+'h'}); } }); }

  // 3) Học phí còn nợ quá hạn (slaPayment_grace_days)
  var E=rRows('DL06.'), hE=E.hdr;
  E.data.forEach(function(r){ if(!r[0]) return; var rem=Number(r[hE['remaining_amount']]||0); if(rem<=0) return; if(/cancel/.test(rEcode(r[hE['enrollment_status']]))) return;
    var d=rDaysAgo(r[hE['enrollment_time']]); if(d!=null && d>P.pay){
      push('', {type:'Học phí quá hạn thu', id:String(r[0]), who:String(r[hE['student_id_name']]||''), detail:'còn nợ '+rem+'đ, '+Math.round(d)+' ngày'}); } });

  // 4) Bài tập chưa chấm quá 48h (slaHomeworkGrading_hours)
  var HW=rRows('DL13.'), hH=HW.hdr;
  HW.data.forEach(function(r){ if(!r[0]) return; if(!/submitted/.test(rEcode(r[hH['homework_status']]))) return; if(String(r[hH['graded_at']]||'')!=='') return;
    var h=rHoursAgo(r[hH['homework_submitted_time']]); if(h!=null && h>P.hw){
      push(String(r[hH['teacher_id']]||''), {type:'Bài tập chưa chấm 48h', id:String(r[0]), who:String(r[hH['student_name']]||''), detail:Math.round(h)+'h'}); } });

  // 5) Khiếu nại quá SLA theo mức độ
  var K=rRows('DL17.'), hK=K.hdr;
  K.data.forEach(function(r){ if(!r[0]) return; if(/resolved/.test(rEcode(r[hK['complaint_status']]))) return;
    var sev=rEcode(r[hK['complaint_severity']]); var lim=/high/.test(sev)?P.knH:(/medium/.test(sev)?P.knM:P.knL);
    var h=rHoursAgo(r[hK['complaint_time']]); if(h!=null && h>lim){
      push(String(r[hK['assigned_handler']]||''), {type:'Khiếu nại quá SLA ('+sev+')', id:String(r[0]), who:String(r[hK['student_id_name']]||''), detail:Math.round(h)+'h > '+lim+'h'}); } });

  // 6) Test chờ chấm quá hạn
  var T=rRows('DL03.'), hT=T.hdr;
  T.data.forEach(function(r){ if(!r[0]) return; if(!/pending/.test(rEcode(r[hT['test_status']]))) return;
    var h=rHoursAgo(r[hT['test_date']]); if(h!=null && h>P.test){
      push(String(r[hT['graded_by']]||''), {type:'Test chờ chấm', id:String(r[0]), who:String(r[hT['lead_id_name']]||''), detail:Math.round(h)+'h'}); } });

  // 7) Buổi WOW đã dạy nhưng chưa ghi nội dung (quá slaWowNote_hours)
  var W=rRows('DL14.'), hW=W.hdr;
  if('wow_content_note' in hW){ W.data.forEach(function(r){ if(!r[0]) return;
    if(!/completed/.test(rEcode(r[hW['wow_status']]))) return;
    if(String(r[hW['wow_content_note']]||'')!=='') return;
    var h=rHoursAgo(r[hW['wow_session_date']]); if(h!=null && h>P.wnote){
      push(String(r[hW['staff_id']]||''), {type:'WOW chưa ghi nội dung', id:String(r[0]), who:String(r[hW['student_name']]||''), detail:Math.round(h)+'h > '+P.wnote+'h'}); } }); }

  return {byStaff:byStaff, noStaff:noStaff};
}

function rEmailBody(name, items){
  var g={}; items.forEach(function(it){ (g[it.type]=g[it.type]||[]).push(it); });
  var h='<div style="font-family:Arial,sans-serif;font-size:14px"><p>Chào '+name+', bạn có <b>'+items.length+'</b> việc quá hạn theo SLA cần xử lý:</p>';
  for(var t in g){ h+='<p style="margin:10px 0 4px"><b>'+t+' ('+g[t].length+')</b></p><ul style="margin:0">';
    g[t].forEach(function(it){ h+='<li>'+it.id+' - '+it.who+' <span style="color:#888">('+it.detail+')</span></li>'; }); h+='</ul>'; }
  h+='<p style="color:#888;margin-top:12px">Mở app ITTs - SOP TEMP để xử lý. (Email tự động - không cần trả lời.)</p></div>';
  return h;
}

/** Chạy chính (đặt vào trigger hằng ngày). Chỉ gửi email khi REMIND_SEND=true. */
function dailyReminders(){
  var scan=rScan(), staff=rStaff(), total=0, lines=[];
  for(var sid in scan.byStaff){ var items=scan.byStaff[sid]; total+=items.length; var st=staff[sid]||{name:sid, email:''};
    lines.push('- '+sid+' ('+st.name+'): '+items.length+' việc'+(st.email?'':'  [THIẾU email ở DL01]'));
    if(REMIND_SEND && st.email){ try{ MailApp.sendEmail({to:st.email, subject:'[ITTs] '+items.length+' việc quá hạn cần xử lý', htmlBody:rEmailBody(st.name, items)}); }catch(e){ lines.push('   lỗi gửi: '+e.message); } }
  }
  if(scan.noStaff.length){ total+=scan.noStaff.length; lines.push('- (việc chung, không có NV phụ trách): '+scan.noStaff.length+' việc');
    if(REMIND_SEND && REMIND_CC){ try{ MailApp.sendEmail({to:REMIND_CC, subject:'[ITTs] '+scan.noStaff.length+' việc chung quá hạn', htmlBody:rEmailBody('Quản lý', scan.noStaff)}); }catch(e){} } }
  var summary='NHẮC VIỆC SLA - '+rFmt(new Date())+'\nTổng '+total+' việc quá hạn.\n'+lines.join('\n')+
    (REMIND_SEND ? '\n\n>> ĐÃ GỬI EMAIL cho các NV có email.' : '\n\n>> CHƯA gửi email (REMIND_SEND=false). Đặt true để gửi thật.');
  Logger.log(summary);
  try{ SpreadsheetApp.getUi().alert(summary); }catch(e){}
  return summary;
}

/** Chạy thử: luôn KHÔNG gửi email, chỉ báo cáo. */
function testReminders(){ var save=REMIND_SEND; REMIND_SEND=false; var s=dailyReminders(); REMIND_SEND=save; return s; }

/** Đặt lịch chạy tự động mỗi ngày 7h sáng. */
function setupReminderTrigger(){
  removeReminderTriggers();
  ScriptApp.newTrigger('dailyReminders').timeBased().everyDays(1).atHour(7).create();
  try{ SpreadsheetApp.getUi().alert('Đã đặt lịch nhắc việc mỗi ngày 7h sáng.\nNhớ đặt REMIND_SEND = true để email được gửi thật.'); }catch(e){}
}
function removeReminderTriggers(){
  var t=ScriptApp.getProjectTriggers();
  for(var i=0;i<t.length;i++){ if(t[i].getHandlerFunction()==='dailyReminders') ScriptApp.deleteTrigger(t[i]); }
}
