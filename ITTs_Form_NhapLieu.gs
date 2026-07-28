/**
 * ITTs - FORM NHAP LIEU THONG MINH (v2)
 *
 * Bam nut -> form popup -> dien -> Luu -> them dong moi, cot cong thuc tu tinh.
 * Form tu hieu tung loai cot:
 *   - Cot ma ID (cot 1): TU SINH ma tiep theo (NV082, L-2026-00026...), khong phai go.
 *   - Cot lien ket (Quan ly truc tiep, NV phu trach, Ma HV, Ma lop...): DROPDOWN
 *     hien "Ma - Ten" de chon, khong can nho ma.
 *   - Cot co enum (vai tro, nguon, trang thai...): DROPDOWN.
 *   - Cot phong ban / co so: GOI Y san cac gia tri da co, van go moi duoc.
 *   - Cot trang thai: mac dinh "active" (nhap moi = dang hoat dong).
 *   - Cot thoi gian: de trong = tu lay gio hien tai.
 *   - Cot cong thuc (final_fee, next_action...): an di, tu tinh khi luu.
 *
 * CAI DAT: Extensions > Apps Script > paste > Ctrl+S > reload Sheets.
 * DUNG: mo sheet data > menu "ITTs Nhap lieu" > "Mo form nhap cho sheet nay".
 */

var DATA_START_ROW = 4;

// Cot lien ket (khong phai cot 1) -> tro toi sheet nao
var LINK_MAP = {
  'reports_to':'DL01. Nhân viên', 'assigned_to':'DL01. Nhân viên', 'teacher_id':'DL01. Nhân viên',
  'graded_by':'DL01. Nhân viên', 'approved_by':'DL01. Nhân viên', 'discount_approved_by':'DL01. Nhân viên',
  'escalated_to':'DL01. Nhân viên', 'staff_id':'DL01. Nhân viên', 'wow_staff_id':'DL01. Nhân viên',
  'student_id':'DL09. Học viên', 'lead_id':'DL02. Khách tiềm năng', 'class_id':'DL10. Lớp học',
  'course_id':'DL05. Khóa học', 'consultation_id':'DL04. Tư vấn', 'session_id':'DL11. Buổi học',
  'test_booking_id':'DL03. Đặt lịch test', 'enrollment_id':'DL06. Đăng ký', 'payment_id':'DL07. Thanh toán'
};
// Cot goi y (datalist) - lay gia tri da co lam goi y nhung van go moi duoc
var SUGGEST_FIELDS = ['department','branch','co_so','level','phong_ban'];

function _sheet(sheetName){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  return sheetName ? ss.getSheetByName(sheetName) : ss.getActiveSheet();
}

/** Sinh ma ID tiep theo cho cot 1 (giu nguyen tien to + format, tang so cuoi) */
function nextId(sheet){
  var n = sheet.getMaxRows() - DATA_START_ROW + 1;
  if (n < 1) return '';
  var col = sheet.getRange(DATA_START_ROW, 1, n, 1).getDisplayValues();
  var template = '', maxNum = 0;
  for (var i=0;i<col.length;i++){
    var v = String(col[i][0]||'').trim();
    if (!v) continue;
    template = v;
    var m = v.match(/(\d+)(?!.*\d)/);     // nhom so cuoi cung
    if (m){ var num = parseInt(m[1],10); if (num>maxNum) maxNum = num; }
  }
  if (!template) return '';
  var m2 = template.match(/(\d+)(?!.*\d)/);
  if (!m2) return template;
  var next = String(maxNum+1);
  while (next.length < m2[1].length) next = '0'+next;
  return template.replace(/(\d+)(?!.*\d)/, next);
}

/** Doc "Ma - Ten" tu sheet dich, co the loc active/manager + do dung cot ten */
function linkOptions(sheetName, filters){
  filters = filters || {};
  var sh = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
  if (!sh) return [];
  var lastCol = sh.getLastColumn();
  var headers = sh.getRange(1,1,1,lastCol).getValues()[0];
  // tim cot ten (uu tien full_name/class_name/course_name/...)
  // Map cot hien thi ten cho tung sheet dich (tranh lay nham cot _name khac)
  var DISPLAY_COL = {
    'DL01. Nhân viên':'full_name', 'DL02. Khách tiềm năng':'full_name',
    'DL05. Khóa học':'course_name', 'DL09. Học viên':'full_name',
    'DL10. Lớp học':'class_name', 'DL06. Đăng ký':'student_id_name',
    'DL04. Tư vấn':'customer_name_display'
  };
  var want = DISPLAY_COL[sheetName] || null;
  var nameCol = 0, roleCol = 0, statusCol = 0;
  for (var i=0;i<headers.length;i++){
    var h = String(headers[i]||'');
    if (want){ if (h===want) nameCol=i+1; }
    else if (nameCol===0 && /^(full_name|class_name|course_name|student_name)$/i.test(h)) nameCol=i+1;
    if (/role/i.test(h)) roleCol=i+1;
    if (/status/i.test(h)) statusCol=i+1;
  }
  var n = sh.getLastRow() - DATA_START_ROW + 1;
  if (n < 1) return [];
  var ids   = sh.getRange(DATA_START_ROW, 1, n, 1).getDisplayValues();
  var names = nameCol ? sh.getRange(DATA_START_ROW, nameCol, n, 1).getDisplayValues() : null;
  var roles = roleCol ? sh.getRange(DATA_START_ROW, roleCol, n, 1).getDisplayValues() : null;
  var stats = statusCol ? sh.getRange(DATA_START_ROW, statusCol, n, 1).getDisplayValues() : null;
  var out = [];
  for (var i2=0;i2<ids.length;i2++){
    var id = String(ids[i2][0]||'').trim();
    if (!id) continue;
    if (filters.activeOnly && stats && !/active|đang làm|đang hoạt/i.test(String(stats[i2][0]))) continue;
    if (filters.managerOnly && roles && !/manager|leader|ceo|trưởng|quản lý|aca_manager/i.test(String(roles[i2][0]))) continue;
    var nm = names ? String(names[i2][0]||'').trim() : '';
    out.push({ v:id, t: id + (nm ? (' - '+nm) : '') });
  }
  return out;
}

/** Doc cau hinh cot cua sheet de dung form */
function layCauHinhForm(sheetName){
  var sheet = _sheet(sheetName);
  var name = sheet.getName();
  var lastCol = sheet.getLastColumn();
  if (lastCol < 1) return { sheetName:name, fields:[], error:'Sheet trong.' };

  var fieldNames = sheet.getRange(1,1,1,lastCol).getValues()[0];
  var labels     = sheet.getRange(2,1,1,lastCol).getValues()[0];
  var hints      = sheet.getRange(3,1,1,lastCol).getValues()[0];
  var formulas   = sheet.getRange(DATA_START_ROW,1,1,lastCol).getFormulas()[0];
  var valids     = sheet.getRange(DATA_START_ROW,1,1,lastCol).getDataValidations()[0];

  // gia tri da co cho cac cot goi y
  var existing = {};
  var nData = Math.max(sheet.getLastRow()-DATA_START_ROW+1, 0);
  var dataVals = nData>0 ? sheet.getRange(DATA_START_ROW,1,nData,lastCol).getDisplayValues() : [];

  // tim cot SDT (cho zalo = SDT)
  var phoneCol = 0;
  for (var pc=0; pc<fieldNames.length; pc++){ if (/phone|sdt|so_dien/i.test(String(fieldNames[pc]||''))){ phoneCol=pc+1; break; } }

  var fields = [];
  for (var c=0;c<lastCol;c++){
    var fname = fieldNames[c] ? String(fieldNames[c]).trim() : '';
    var label = labels[c] ? String(labels[c]).trim() : fname;
    if (!fname && !label) continue;

    var hint = hints[c] ? String(hints[c]).trim() : '';
    var formula = formulas[c] ? String(formulas[c]) : '';
    var isFormula = formula.charAt(0) === '=';
    var isHyperlink = formula.indexOf('HYPERLINK') >= 0;
    if (isFormula && !isHyperlink) continue;                 // cot tu tinh -> an

    // BO QUA cot thoi gian tao tu dong (vd lead_created_time) - se tu dien khi luu
    if (/created/i.test(fname) || (/(_time|_at)$/i.test(fname) && /auto|now|tự/i.test(hint))) continue;

    var field = { col:c+1, name:fname, label:label, hint:hint, kind:'text', options:[], def:'' };

    var isScore = /(target.*band|target.*score|^band|band$|overall_band|goal.*band|điểm mục tiêu)/i.test(fname+' '+label);
    var isDate  = /(_date$|date$|ngày)/i.test(fname);
    var isTime  = /(_time$|_at$)/i.test(fname);

    if (c === 0){
      field.kind = 'auto'; field.preview = nextId(sheet);
    } else if (isHyperlink || LINK_MAP[fname]){
      var target = LINK_MAP[fname];
      if (isHyperlink){ var mt = formula.match(/'([^']+)'!/); if (mt) target = mt[1]; }
      // bo loc: quan ly truc tiep -> chi manager; tham chieu nhan vien -> chi active
      var filt = {};
      if (fname === 'reports_to'){ filt = { activeOnly:true, managerOnly:true }; }
      else if (target && target.indexOf('DL01') === 0){ filt = { activeOnly:true }; }
      field.options = target ? linkOptions(target, filt) : [];
      field.target = target;
      // danh sach dai -> autocomplete (datalist), ngan -> select
      field.kind = (field.options.length > 15) ? 'linklist' : 'link';
    } else if (isScore){
      // Diem 0.0 - 9.0 buoc 0.5
      for (var sc=0; sc<=18; sc++){ var v=(sc*0.5).toFixed(1); field.options.push({v:v,t:v}); }
      field.kind = 'select';
    } else if (valids[c]){
      try {
        var t = valids[c].getCriteriaType();
        if (t === SpreadsheetApp.DataValidationCriteria.VALUE_IN_LIST){
          var ov = valids[c].getCriteriaValues()[0];
          for (var k=0;k<ov.length;k++) field.options.push({v:ov[k], t:ov[k]});
          field.kind='select';
        } else if (t === SpreadsheetApp.DataValidationCriteria.VALUE_IN_RANGE){
          var rng = valids[c].getCriteriaValues()[0];
          var rv = rng.getValues();
          for (var k2=0;k2<rv.length;k2++) if (rv[k2][0]!=='' && rv[k2][0]!=null) field.options.push({v:rv[k2][0], t:rv[k2][0]});
          field.kind='select';
        }
      } catch(e){}
    } else if (SUGGEST_FIELDS.indexOf(fname) >= 0){
      var seen = {};
      for (var d=0; d<dataVals.length; d++){
        var dv = String(dataVals[d][c]||'').trim();
        if (dv && !seen[dv]){ seen[dv]=1; field.options.push({v:dv, t:dv}); }
      }
      field.kind = 'datalist';
    } else if (isDate){
      field.kind = 'date';
    } else if (isTime){
      field.kind = 'datetime';
    }

    // zalo = SDT (cho tich chon khoi nhap)
    if (/zalo/i.test(fname) && phoneCol){ field.zalo = true; field.phoneCol = phoneCol; }

    // mac dinh trang thai = active
    if (/status/i.test(fname) && field.kind==='select'){
      for (var s2=0;s2<field.options.length;s2++){
        if (/^active|đang làm|đang hoạt/i.test(String(field.options[s2].v))){ field.def = field.options[s2].v; break; }
      }
    }
    fields.push(field);
  }
  return { sheetName:name, fields:fields };
}

/** Kiem tra sheet co phai sheet nhap lieu (DL) khong */
function kiemTraSheetNhap(name){
  // DL19 la lich truc dang luoi -> nhap truc tiep, khong qua form
  if (name.indexOf('DL19') === 0){
    return { ok:false, msg:'Sheet "'+name+'" la LICH TRUC dang luoi.\n\nLich nay nhap truc tiep vao o (ghi ten NV truc theo ngay/gio), khong dung form.' };
  }
  // Chi cho phep cac sheet du lieu DL01..DL18
  if (/^DL\d/.test(name)) return { ok:true };

  var grp = '';
  if (name.indexOf('HD') === 0)      grp = 'HUONG DAN';
  else if (name.indexOf('CH') === 0) grp = 'CAU HINH';
  else if (name.indexOf('VH') === 0) grp = 'VAN HANH / TRA CUU';
  else if (name.indexOf('BC') === 0) grp = 'DASHBOARD / BAO CAO';
  else                               grp = 'KHAC';

  var giaiThich = '';
  if (grp === 'CAU HINH') giaiThich = 'Sheet cau hinh duoc sua truc tiep (enum, tham so), khong them dong moi qua form.';
  else if (grp === 'DASHBOARD / BAO CAO') giaiThich = 'Sheet nay chi xem (so lieu tu dong tinh tu cac sheet DL), khong nhap tay.';
  else if (grp === 'VAN HANH / TRA CUU') giaiThich = 'Sheet nay tu loc/hien thi viec can lam tu cac sheet DL, khong nhap truc tiep.';
  else if (grp === 'HUONG DAN') giaiThich = 'Sheet huong dan, khong chua du lieu.';

  return { ok:false,
    msg:'Sheet "'+name+'" thuoc nhom '+grp+', KHONG phai sheet nhap lieu.\n\n'+giaiThich+
        '\n\nForm nhap chi dung cho cac sheet DU LIEU (nhom DL, vd "DL02. Khach tiem nang", "DL09. Hoc vien").' };
}

function moFormNhapLieu(){
  var ui = SpreadsheetApp.getUi();
  var name = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet().getName();

  // Cong chan: chi cho nhap o sheet DL
  var check = kiemTraSheetNhap(name);
  if (!check.ok){
    ui.alert('Khong nhap lieu o sheet nay', check.msg, ui.ButtonSet.OK);
    return;
  }

  var cfg = layCauHinhForm(name);
  if (!cfg.fields || cfg.fields.length === 0){
    ui.alert('Sheet "'+name+'" khong tim thay cot nhap lieu (kiem tra lai cau truc tieu de dong 1-2).');
    return;
  }
  var html = HtmlService.createHtmlOutput(buildFormHtml(cfg)).setWidth(540).setHeight(660);
  ui.showModalDialog(html, 'Nhap lieu - '+cfg.sheetName);
}

/** Tao cong thuc HYPERLINK noi bo tro toi dong co ma = id trong sheet dich */
function buildLinkFormula(target, id){
  return '=IFERROR(HYPERLINK("#\'' + target + '\'!A"&MATCH("' + id + '",\'' + target + '\'!A:A,0),"' + id + '"),"' + id + '")';
}

/** Luu 1 dong moi (ban chac chan: guard null, parse ngay an toan, flush) */
function luuDong(sheetName, data){
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName(sheetName);
  if (!sheet) throw new Error('Khong tim thay sheet "'+sheetName+'". Hay mo dung sheet data (nhom DL) roi thu lai.');
  var lastCol = sheet.getLastColumn();
  var maxRows = sheet.getMaxRows();

  // dong trong dau tien theo cot 1 (bo qua 3 dong tieu de)
  var target = -1;
  var n = maxRows - DATA_START_ROW + 1;
  if (n >= 1){
    var colA = sheet.getRange(DATA_START_ROW, 1, n, 1).getDisplayValues();
    for (var i=0;i<colA.length;i++){ if (String(colA[i][0]||'').trim()===''){ target = DATA_START_ROW+i; break; } }
  }
  if (target < 0){ sheet.insertRowAfter(maxRows); target = maxRows+1; }
  var prev = target - 1;
  var hasPrev = prev >= DATA_START_ROW;      // co dong du lieu phia tren de copy cong thuc khong

  // 1) cot ID tu sinh
  var newId = nextId(sheet);
  if (newId) sheet.getRange(target,1).setValue(newId);

  // 2) cac cot nhap
  for (var key in data){
    if (!data.hasOwnProperty(key)) continue;
    var c = parseInt(key,10);
    if (!c || c === 1) continue;                          // cot ID da tu sinh
    var val = data[key];
    var cell = sheet.getRange(target, c);
    var fname = String(sheet.getRange(1,c).getValue());
    var prevF = hasPrev ? sheet.getRange(prev,c).getFormula() : '';

    // Xac dinh cot tham chieu (link) + sheet dich
    var target2 = '';
    if (prevF && prevF.indexOf('HYPERLINK')>=0){ var mt = prevF.match(/'([^']+)'!/); if (mt) target2 = mt[1]; }
    else if (LINK_MAP[fname]){ target2 = LINK_MAP[fname]; }

    if (target2 && val !== '' && val != null){
      var idOnly = String(val).split(' - ')[0].trim();     // tach ID neu val la "Ma - Ten"
      cell.setFormula(buildLinkFormula(target2, idOnly));
    } else if ((val === '' || val == null) && /(_time|_at|created)/i.test(fname)){
      cell.setValue(new Date());                           // thoi gian de trong = gio hien tai
    } else if (typeof val === 'string' && /^\d{4}-\d{2}-\d{2}/.test(val)){
      var d = new Date(val);                               // giu nguyen dinh dang ISO (co chu T)
      if (isNaN(d.getTime())) cell.setValue(val);          // parse loi -> ghi nguyen chuoi, khong nem loi
      else cell.setValue(d);
    } else {
      cell.setValue(val);
    }
  }

  // 3) cot tu tinh: copy cong thuc tu dong tren (chi khi co dong du lieu phia tren)
  if (hasPrev){
    for (var c2=2;c2<=lastCol;c2++){
      if (data.hasOwnProperty(String(c2))) continue;
      var pf = sheet.getRange(prev,c2).getFormula();
      if (pf){ sheet.getRange(prev,c2).copyTo(sheet.getRange(target,c2)); }
      else if (/created/i.test(String(sheet.getRange(1,c2).getValue()))){ sheet.getRange(target,c2).setValue(new Date()); }
    }
  }

  SpreadsheetApp.flush();                                   // buoc ghi xuong sheet ngay
  return { row:target, id:newId||'' };
}

function buildFormHtml(cfg){
  var json = JSON.stringify(cfg).replace(/</g,'\u003c');
  return `<!DOCTYPE html><html><head><base target="_top"><style>
body{font-family:Montserrat,Arial,sans-serif;margin:0;padding:16px;color:#1a1a1a;font-size:13px;}
h2{font-size:15px;margin:0 0 4px;color:#1E8449;}
.sub{color:#7f8c8d;font-size:11px;margin-bottom:14px;}
.f{margin-bottom:11px;}.f label{display:block;font-weight:600;margin-bottom:3px;}
.f .hint{color:#95a5a6;font-size:10px;font-weight:400;margin-left:4px;}
input,select{width:100%;box-sizing:border-box;padding:7px 8px;border:1px solid #d5d8dc;border-radius:6px;font-size:13px;font-family:inherit;}
input:disabled,input:read-only{background:#f4f6f7;}
input:disabled{color:#27ae60;font-weight:600;}
input:focus,select:focus{outline:none;border-color:#1E8449;}
.bar{position:sticky;bottom:0;background:#fff;padding-top:12px;display:flex;gap:8px;}
button{flex:1;padding:10px;border:none;border-radius:6px;font-size:13px;font-weight:600;cursor:pointer;font-family:inherit;}
.save{background:#1E8449;color:#fff;}.cancel{background:#ecf0f1;color:#34495e;}
.msg{padding:8px;border-radius:6px;margin-bottom:10px;font-size:12px;display:none;}
.ok{background:#d5f5e3;color:#1E8449;}.err{background:#fadbd8;color:#c0392b;}
</style></head><body>
<h2>Nhap lieu moi</h2><div class="sub" id="sheetname"></div>
<div class="msg" id="msg"></div><div id="form"></div>
<div class="bar"><button class="cancel" onclick="google.script.host.close()">Dong</button>
<button class="save" id="btnSave" onclick="luu()">Luu dong moi</button></div>
<script>
var CFG=${json};
document.getElementById("sheetname").textContent=CFG.sheetName+"  -  "+CFG.fields.length+" truong";
function esc(s){return String(s==null?"":s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/"/g,"&quot;");}
function fld(c){return document.getElementById("fld_"+c);}
function zaloSame(cb,zc,pc){var z=fld(zc),p=fld(pc);if(cb.checked){z.value=p?p.value:"";z.readOnly=true;}else{z.readOnly=false;}}
function render(){var h="";for(var i=0;i<CFG.fields.length;i++){var f=CFG.fields[i];
h+='<div class="f"><label>'+esc(f.label)+(f.hint?' <span class="hint">'+esc(f.hint)+'</span>':"")+"</label>";
if(f.kind=="auto"){h+='<input id="fld_'+f.col+'" type="text" value="'+esc(f.preview||"")+'" disabled/>';}
else if(f.kind=="select"||f.kind=="link"){h+='<select id="fld_'+f.col+'"><option value=""></option>';
for(var k=0;k<f.options.length;k++){var o=f.options[k];var sel=(f.def&&o.v==f.def)?" selected":"";h+='<option value="'+esc(o.v)+'"'+sel+">"+esc(o.t)+"</option>";}h+="</select>";}
else if(f.kind=="linklist"){h+='<input id="fld_'+f.col+'" list="dl_'+f.col+'" type="text" placeholder="Go ten hoac ma de tim..."/><datalist id="dl_'+f.col+'">';
for(var k2=0;k2<f.options.length;k2++){h+='<option value="'+esc(f.options[k2].t)+'">';}h+="</datalist>";}
else if(f.kind=="datalist"){h+='<input id="fld_'+f.col+'" list="dl_'+f.col+'" type="text"/><datalist id="dl_'+f.col+'">';
for(var k3=0;k3<f.options.length;k3++){h+='<option value="'+esc(f.options[k3].v)+'">';}h+="</datalist>";}
else if(f.kind=="date"){h+='<input id="fld_'+f.col+'" type="date"/>';}
else if(f.kind=="datetime"){h+='<input id="fld_'+f.col+'" type="datetime-local"/>';}
else{h+='<input id="fld_'+f.col+'" type="text"/>';}
if(f.zalo){h+='<label style="font-weight:400;font-size:11px;margin-top:4px;display:block;"><input type="checkbox" style="width:auto;margin-right:5px;" onchange="zaloSame(this,'+f.col+','+f.phoneCol+')"/>Giong so dien thoai (tich = khoi nhap)</label>';}
h+="</div>";}
document.getElementById("form").innerHTML=h;}
function luu(){var data={};for(var i=0;i<CFG.fields.length;i++){var f=CFG.fields[i];if(f.kind=="auto")continue;var el=fld(f.col);data[f.col]=el?el.value:"";}
var b=document.getElementById("btnSave");b.disabled=true;b.textContent="Dang luu...";
google.script.run.withSuccessHandler(function(res){var m=document.getElementById("msg");m.className="msg ok";m.style.display="block";m.textContent="Da luu: "+(res.id||"")+" (dong "+res.row+"). Co the nhap tiep.";render();b.disabled=false;b.textContent="Luu dong moi";}).withFailureHandler(function(err){var m=document.getElementById("msg");m.className="msg err";m.style.display="block";m.textContent="Loi: "+err.message;b.disabled=false;b.textContent="Luu dong moi";}).luuDong(CFG.sheetName,data);}
render();
</script></body></html>`;
}

// LUU Y: menu da duoc GOP vao onOpen cua file ITTs_XuLyDuLieu.gs (tao ca 2 menu).
// Doi ten ham nay (khong con la onOpen) de tranh 2 onOpen trung nhau lam mat menu.
function onOpen_Form_DaGop(){
  SpreadsheetApp.getUi().createMenu('ITTs Nhap lieu')
    .addItem('Mo form nhap cho sheet nay','moFormNhapLieu').addToUi();
}
