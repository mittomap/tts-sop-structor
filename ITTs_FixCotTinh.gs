/**
 * ITTs - FIX CÁC CỘT TÍNH TOÁN
 * =====================================================================
 * Điền giá trị cho các cột dẫn xuất đang TRỐNG hoặc LỖI trên sheet:
 *   first_call_time, last_contact_time, contact_count,
 *   final_fee, paid_amount, remaining_amount,
 *   attendance_rate, completion_rate,
 *   first_enrollment_id/date, total_enrollments, last_learning_activity_time,
 *   wow_quota_default/used/remaining, current_enrollment,
 *   và mọi cột *_name (student_id_name, class_id_name, assigned_to_name...).
 *
 * CÁCH LÀM: script tự ĐỌC dữ liệu gốc rồi TỰ TÍNH bằng JavaScript
 * (không dùng COUNTIF/VLOOKUP nên không lệ thuộc cột mã là HYPERLINK hay không,
 *  cũng không cần nới vùng công thức).
 *
 * AN TOÀN:
 *   - CHỈ ghi vào ô đang TRỐNG hoặc đang lỗi (#REF!, #N/A, #VALUE!...).
 *     Ô nào công thức đang chạy đúng thì GIỮ NGUYÊN CÔNG THỨC, không đụng.
 *   - Ô không đổi được ghi lại đúng công thức cũ -> công thức không bị mất.
 *   - Tự SAO LƯU file trước khi ghi.
 *   - Không xóa dòng, không đổi lưới, không sửa cấu trúc.
 *
 * CÁCH DÙNG:
 *   1) Apps Script > file mới > dán toàn bộ file này > Lưu.
 *   2) Chạy  fixDerivedColumns  (đang DRY_RUN = true) -> BÁO CÁO sẽ điền bao nhiêu ô, chưa ghi.
 *   3) Ưng rồi -> đổi DRY_RUN = false -> chạy lại -> ghi thật.
 *   4) Xong có thể xóa file này.
 */

var DRY_RUN     = true;    // true = chỉ báo cáo, chưa ghi gì
var AUTO_BACKUP = true;    // tự sao lưu file trước khi ghi

var SHEET_CODES = ['DL01','DL02','DL02b','DL03','DL04','DL05','DL06','DL07','DL08','DL09','DL10','DL11','DL12','DL13','DL14','DL15','DL16','DL17','DL18'];

/* id -> [sheet chứa, cột tên] */
var REF = {
  student_id:['DL09','full_name'], lead_id:['DL02','full_name'], class_id:['DL10','class_name'],
  course_id:['DL05','course_name'], staff_id:['DL01','full_name'], teacher_id:['DL01','full_name'],
  assigned_to:['DL01','full_name'], main_teacher_id:['DL01','full_name'],
  received_by:['DL01','full_name'], verified_by:['DL01','full_name'], graded_by:['DL01','full_name'],
  assigned_handler:['DL01','full_name'], consulted_by:['DL01','full_name'], assigned_by:['DL01','full_name']
};

/* ================== TIỆN ÍCH ================== */
function fdFind_(pfx){
  var shs = SpreadsheetApp.getActive().getSheets();
  for (var i=0;i<shs.length;i++) if (shs[i].getName().indexOf(pfx)===0) return shs[i];
  return null;
}
function fdBackup_(){
  if(!AUTO_BACKUP) return '';
  try{
    var f  = DriveApp.getFileById(SpreadsheetApp.getActive().getId());
    var ts = Utilities.formatDate(new Date(), Session.getScriptTimeZone()||'Asia/Ho_Chi_Minh','dd-MM-yyyy HH:mm');
    return f.makeCopy('[SAO LƯU '+ts+'] '+f.getName()).getName();
  }catch(e){ return 'KHÔNG SAO LƯU ĐƯỢC: '+(e&&e.message||e); }
}
function fdIsBad_(v){                       // ô coi như "chưa có dữ liệu"
  var s = String(v==null?'':v).trim();
  return s==='' || s.charAt(0)==='#';
}
function fdNum_(v){
  if(v==null||v==='') return 0;
  var n = parseFloat(String(v).replace(/[^0-9.\-]/g,''));
  return isNaN(n)?0:n;
}
function fdDate_(v){                        // "dd/mm/yyyy hh:mm" | "yyyy-mm-dd hh:mm" | Date
  if(v instanceof Date) return v;
  var s = String(v==null?'':v).trim(); if(!s) return null;
  var m = s.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:[ ,]+(\d{1,2}):(\d{2}))?/);
  if(m) return new Date(+m[3],+m[2]-1,+m[1], m[4]?+m[4]:0, m[5]?+m[5]:0);
  m = s.match(/^(\d{4})-(\d{1,2})-(\d{1,2})(?:[ T]+(\d{1,2}):(\d{2}))?/);
  if(m) return new Date(+m[1],+m[2]-1,+m[3], m[4]?+m[4]:0, m[5]?+m[5]:0);
  var d = new Date(s); return isNaN(d.getTime())?null:d;
}
function fdCode_(v){                        // "new (Chưa liên hệ)" -> "new"
  return String(v==null?'':v).trim().split(' ')[0].toLowerCase();
}

/* Đọc 1 sheet: tiêu đề + giá trị hiển thị (nên cột mã dù là HYPERLINK vẫn ra text) */
function fdRead_(code){
  var sh = fdFind_(code+'.'); if(!sh) return null;
  var lastCol = sh.getLastColumn(), last = sh.getLastRow();
  var hdr = sh.getRange(1,1,1,lastCol).getValues()[0].map(String);
  while(hdr.length && hdr[hdr.length-1]==='') hdr.pop();
  lastCol = hdr.length;
  var n = Math.max(0, last-3);
  var disp = n ? sh.getRange(4,1,n,lastCol).getDisplayValues() : [];
  var idx = {}; for(var c=0;c<lastCol;c++) idx[hdr[c]] = c;
  var recs = [];
  for(var r=0;r<n;r++){
    var o = {};
    for(var k in idx) o[k] = disp[r][idx[k]];
    o.__row = r; recs.push(o);
  }
  return {code:code, sh:sh, hdr:hdr, idx:idx, n:n, lastCol:lastCol, recs:recs};
}

/* Gom nhóm theo khóa */
function fdGroup_(t, key){
  var g = {}; if(!t) return g;
  for(var i=0;i<t.recs.length;i++){
    var k = String(t.recs[i][key]||'').trim(); if(!k) continue;
    (g[k] = g[k] || []).push(t.recs[i]);
  }
  return g;
}
function fdMap_(t, key, val){
  var m = {}; if(!t) return m;
  for(var i=0;i<t.recs.length;i++){
    var k = String(t.recs[i][key]||'').trim(); if(!k) continue;
    if(m[k]===undefined) m[k] = t.recs[i][val];
  }
  return m;
}

/* ================== HÀM CHÍNH ================== */
function fixDerivedColumns(){
  var NL = String.fromCharCode(10);
  var T = {};                                  // đọc toàn bộ 1 lần
  for(var i=0;i<SHEET_CODES.length;i++) T[SHEET_CODES[i]] = fdRead_(SHEET_CODES[i]);

  var plan = {};                               // plan[code][cột] = { row -> giá trị }
  function put(code, col, row, val){
    if(!T[code] || T[code].idx[col]===undefined) return;
    if(val===null || val===undefined || val==='') return;
    if(!fdIsBad_(T[code].recs[row][col])) return;      // ô đang có dữ liệu đúng -> KHÔNG đụng
    plan[code] = plan[code] || {};
    plan[code][col] = plan[code][col] || {};
    plan[code][col][row] = val;
  }

  /* ---------- 1) Mọi cột *_name (tra cứu theo mã) ---------- */
  var nameSrc = {};
  for(var idk in REF){
    var m = REF[idk], tt = T[m[0]];
    if(!tt) continue;
    var pk = tt.hdr[0];
    nameSrc[idk] = fdMap_(tt, pk, m[1]);
  }
  function baseOf(col){
    var b = col.replace(/_name$/,'').replace(/_display$/,'');
    if(b==='student') b='student_id';
    if(b==='customer'||b==='customer_name') b='lead_id';
    if(b==='teacher') b='teacher_id';
    return b;
  }
  for(var ci=0;ci<SHEET_CODES.length;ci++){
    var code = SHEET_CODES[ci], t = T[code]; if(!t) continue;
    for(var c=0;c<t.hdr.length;c++){
      var col = t.hdr[c]; if(!/_name$|_name_display$/.test(col)) continue;
      var base = baseOf(col); if(!REF[base] || !nameSrc[base]) continue;
      if(t.idx[base]===undefined) continue;
      for(var r=0;r<t.n;r++){
        var id = String(t.recs[r][base]||'').trim(); if(!id) continue;
        put(code, col, r, nameSrc[base][id]||'');
      }
    }
  }

  /* ---------- 2) DL02: liên hệ đầu / cuối / số lần ---------- */
  if(T.DL02 && T.DL02b){
    var tpBy = fdGroup_(T.DL02b, 'lead_id');
    var pk2  = T.DL02.hdr[0];
    for(var r2=0;r2<T.DL02.n;r2++){
      var lid = String(T.DL02.recs[r2][pk2]||'').trim(); if(!lid) continue;
      var ts = (tpBy[lid]||[]).map(function(x){ return fdDate_(x.contact_time); })
                              .filter(function(d){ return !!d; })
                              .sort(function(a,b){ return a-b; });
      put('DL02','contact_count', r2, ts.length);
      if(ts.length){
        put('DL02','first_call_time',  r2, ts[0]);
        put('DL02','last_contact_time',r2, ts[ts.length-1]);
      }
    }
  }

  /* ---------- 3) DL06: học phí sau CK / đã thu / còn lại ---------- */
  if(T.DL06){
    var payBy = T.DL07 ? fdGroup_(T.DL07,'enrollment_id') : {};
    var pk6 = T.DL06.hdr[0];
    for(var r6=0;r6<T.DL06.n;r6++){
      var e = T.DL06.recs[r6], eid = String(e[pk6]||'').trim();
      var fee = fdNum_(e.total_fee) - fdNum_(e.discount_amount); if(fee<0) fee=0;
      put('DL06','final_fee', r6, fee);
      var paid = 0, ps = payBy[eid]||[];
      for(var p=0;p<ps.length;p++) paid += fdNum_(ps[p].amount);
      put('DL06','paid_amount', r6, paid);
      var fin = fdIsBad_(e.final_fee) ? fee : fdNum_(e.final_fee);
      var pd  = fdIsBad_(e.paid_amount) ? paid : fdNum_(e.paid_amount);
      put('DL06','remaining_amount', r6, Math.max(0, fin-pd));
    }
  }

  /* ---------- 4) DL09: đăng ký đầu, hoạt động gần nhất, quota WOW ---------- */
  if(T.DL09){
    var enrBy = T.DL06 ? fdGroup_(T.DL06,'student_id') : {};
    var attBy = T.DL12 ? fdGroup_(T.DL12,'student_id') : {};
    var wowBy = T.DL14 ? fdGroup_(T.DL14,'student_id') : {};
    var quotaOf = T.DL05 ? fdMap_(T.DL05, T.DL05.hdr[0], 'wow_quota_default') : {};
    var pk9 = T.DL09.hdr[0];
    for(var r9=0;r9<T.DL09.n;r9++){
      var s = T.DL09.recs[r9], sid = String(s[pk9]||'').trim(); if(!sid) continue;
      var es = (enrBy[sid]||[]).slice().sort(function(a,b){
        var da=fdDate_(a.enrollment_time), db=fdDate_(b.enrollment_time);
        return (da?da.getTime():0)-(db?db.getTime():0);
      });
      put('DL09','total_enrollments', r9, es.length);
      if(es.length){
        put('DL09','first_enrollment_id',   r9, es[0][T.DL06.hdr[0]]);
        var d0 = fdDate_(es[0].enrollment_time); if(d0) put('DL09','first_enrollment_date', r9, d0);
        var q = fdNum_(quotaOf[String(es[0].course_id||'').trim()]);
        if(q>0) put('DL09','wow_quota_default', r9, q);
      }
      var ck = (attBy[sid]||[]).map(function(a){ return fdDate_(a.check_in_time); })
                               .filter(function(d){ return !!d; })
                               .sort(function(a,b){ return a-b; });
      if(ck.length) put('DL09','last_learning_activity_time', r9, ck[ck.length-1]);
      var used = 0, ws = wowBy[sid]||[];
      for(var w=0;w<ws.length;w++){
        var qd = String(ws[w].quota_deducted||'').toLowerCase();
        if(qd.indexOf('yes')===0 || qd.indexOf('có')===0 || qd==='1') used++;
      }
      put('DL09','wow_quota_used', r9, used);
      var def = fdIsBad_(s.wow_quota_default) ? 0 : fdNum_(s.wow_quota_default);
      if(!def && es.length) def = fdNum_(quotaOf[String(es[0].course_id||'').trim()]);
      var rem = def + fdNum_(s.wow_extra_approved) + fdNum_(s.wow_extra_purchased) - used;
      put('DL09','wow_quota_remaining', r9, Math.max(0, rem));
    }
  }

  /* ---------- 5) DL18: chuyên cần + tỷ lệ nộp bài ---------- */
  if(T.DL18){
    var attBy2 = T.DL12 ? fdGroup_(T.DL12,'student_id') : {};
    var hwBy   = T.DL13 ? fdGroup_(T.DL13,'student_id') : {};
    for(var r18=0;r18<T.DL18.n;r18++){
      var sid2 = String(T.DL18.recs[r18].student_id||'').trim(); if(!sid2) continue;
      var as = attBy2[sid2]||[];
      if(as.length){
        var ok=0;
        for(var a=0;a<as.length;a++){ var st=fdCode_(as[a].attendance_status); if(st==='on_time'||st==='late') ok++; }
        put('DL18','attendance_rate', r18, Math.round(ok*100/as.length)+'%');
      }
      var hs = hwBy[sid2]||[];
      if(hs.length){
        var sub=0;
        for(var h=0;h<hs.length;h++) if(fdCode_(hs[h].homework_status).indexOf('submitted')===0) sub++;
        put('DL18','completion_rate', r18, Math.round(sub*100/hs.length)+'%');
      }
    }
  }

  /* ---------- 6) DL10: sĩ số hiện tại ---------- */
  if(T.DL10 && T.DL08){
    var cnt = {};
    for(var o=0;o<T.DL08.n;o++){
      var cid = String(T.DL08.recs[o].class_id||'').trim(); if(!cid) continue;
      cnt[cid] = (cnt[cid]||0)+1;
    }
    var pk10 = T.DL10.hdr[0];
    for(var r10=0;r10<T.DL10.n;r10++){
      var cid2 = String(T.DL10.recs[r10][pk10]||'').trim(); if(!cid2) continue;
      if(cnt[cid2]) put('DL10','current_enrollment', r10, cnt[cid2]);
    }
  }

  /* ---------- GHI ---------- */
  var report = [], totalCells = 0;
  if(!DRY_RUN && AUTO_BACKUP){ var b = fdBackup_(); if(b) report.push('Đã sao lưu: '+b); }

  for(var ck2=0; ck2<SHEET_CODES.length; ck2++){
    var cd = SHEET_CODES[ck2]; if(!plan[cd]) continue;
    var t2 = T[cd], parts = [];
    for(var col2 in plan[cd]){
      var fills = plan[cd][col2], cnt2 = 0;
      for(var k2 in fills) cnt2++;
      if(!cnt2) continue;
      totalCells += cnt2; parts.push(col2+' ('+cnt2+')');
      if(DRY_RUN) continue;
      var cIdx = t2.idx[col2] + 1;
      var rng  = t2.sh.getRange(4, cIdx, t2.n, 1);
      var cur  = rng.getValues(), fml = rng.getFormulas();
      var out  = [];
      for(var rr=0; rr<t2.n; rr++){
        if(fills[rr]!==undefined) out.push([ fills[rr] ]);          // ô cần điền
        else out.push([ fml[rr][0] ? fml[rr][0] : cur[rr][0] ]);    // giữ nguyên công thức/giá trị cũ
      }
      rng.setValues(out);
    }
    if(parts.length) report.push(cd+': '+parts.join(', '));
  }
  if(!DRY_RUN){ try{ SpreadsheetApp.flush(); }catch(e){} }

  var head = DRY_RUN
    ? ('CHẠY THỬ - CHƯA GHI GÌ. Sẽ điền '+totalCells+' ô. Đổi DRY_RUN = false rồi chạy lại để ghi thật.')
    : ('ĐÃ ĐIỀN '+totalCells+' ô. Ô nào công thức đang chạy đúng thì giữ nguyên công thức.');
  var msg = 'FIX CÁC CỘT TÍNH TOÁN'+NL+head+NL+NL+(report.length?report.join(NL):'Không có ô nào cần điền - mọi cột đều đã có dữ liệu.');
  Logger.log(msg);
  try{ SpreadsheetApp.getUi().alert(msg); }catch(e){}
  return msg;
}
