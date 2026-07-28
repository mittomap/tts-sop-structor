/**
 * ITTs - SCRIPT XU LY DU LIEU (gop chung)
 * Gom: Fix hyperlink + Tao enum named range + Doi cot ten ve canh ID
 *      + Tao checkbox tra cuu (VH).
 * (Form nhap lieu nam o file ITTs_Form_NhapLieu.gs rieng.)
 *
 * CACH DUNG: Extensions > Apps Script > paste file nay > Ctrl+S > reload sheet.
 * Tat ca chuc nang nam o menu "ITTs Cong cu" tren thanh menu.
 */

var PROP_DONE = 'ITTS_CAIDAT_DONE';   // co danh dau da cai dat ban dau (luu theo tai lieu)

function _daCaiDat(){
  try { return !!PropertiesService.getDocumentProperties().getProperty(PROP_DONE); }
  catch(e){ return false; }
}
function _datCaiDat(v){
  try {
    var pr = PropertiesService.getDocumentProperties();
    if (v) pr.setProperty(PROP_DONE, new Date().toISOString());
    else   pr.deleteProperty(PROP_DONE);
  } catch(e){}
}

/** Dung 2 menu tuy theo da cai dat hay chua */
function buildMenus() {
  var ui = SpreadsheetApp.getUi();
  var m1 = ui.createMenu('ITTs Cong cu');
  if (_daCaiDat()) {
    // DA cai dat -> an muc chinh de khoi bam nham; chi con submenu bao tri
    m1.addItem('Da cai dat xong (bam de xem)', 'thongTinDaCaiDat')
      .addSeparator()
      .addSubMenu(ui.createMenu('Bao tri (nang cao)')
        .addItem('Sua lien ket (hyperlink) - chay sau moi lan import', 'menuFixHyperlink')
        .addItem('Chay lai cai dat ban dau', 'caiDatBanDau')
        .addItem('Dat lai trang thai (hien lai menu cai dat)', 'datLaiTrangThaiCaiDat'));
  } else {
    // CHUA cai dat -> hien muc chinh
    m1.addItem('CAI DAT BAN DAU (chay 1 lan)', 'caiDatBanDau')
      .addItem('Sua lien ket (hyperlink)', 'menuFixHyperlink');
  }
  m1.addToUi();

  // Menu form nhap lieu (ham moFormNhapLieu nam o file ITTs_Form_NhapLieu.gs)
  ui.createMenu('ITTs Nhap lieu')
    .addItem('Mo form nhap cho sheet nay', 'moFormNhapLieu')
    .addToUi();
}

function onOpen() { buildMenus(); }

function thongTinDaCaiDat(){
  var when = '';
  try { when = PropertiesService.getDocumentProperties().getProperty(PROP_DONE) || ''; } catch(e){}
  SpreadsheetApp.getUi().alert(
    'File nay DA duoc cai dat ban dau' + (when ? (' (luc ' + when + ')') : '') + '.\n\n' +
    'Ban KHONG can chay lai. Neu that su can (vd sau khi lam moi toan bo du lieu), vao:\n' +
    '"ITTs Cong cu > Bao tri (nang cao) > Chay lai cai dat ban dau".');
}

function datLaiTrangThaiCaiDat(){
  var ui = SpreadsheetApp.getUi();
  _datCaiDat(false);
  buildMenus();
  ui.alert('Da dat lai trang thai. Muc "CAI DAT BAN DAU" da hien lai tren menu "ITTs Cong cu".');
}

/**
 * Chay 1 LAN sau khi upload: tu lam het cac buoc cai dat, tu bat loi,
 * cuoi cung bao 1 thong bao tong. Khong can chay tay tung ham.
 */
function caiDatBanDau() {
  var ui = SpreadsheetApp.getUi();

  // Neu DA chay roi -> hoi xac nhan de tranh chay nham gay TRUNG hyperlink/checkbox
  if (_daCaiDat()) {
    var tl = ui.alert('Chay lai cai dat ban dau?',
      'File nay da duoc cai dat ban dau roi. Chay lai co the tao TRUNG hyperlink / checkbox.\n\n' +
      'Ban co chac chan muon chay lai khong?', ui.ButtonSet.YES_NO);
    if (tl !== ui.Button.YES) return;
  }

  var ketqua = [];
  var loi = [];
  function buoc(ten, fn) {
    try {
      ketqua.push('OK  - ' + fn());
    } catch (e) {
      loi.push('LOI - ' + ten + ': ' + e.message);
    }
  }

  buoc('Fix hyperlink',     fixHyperlinkToanBo);
  buoc('Named range enum',  recreateEnumNamedRanges);
  // KHONG goi sapXepCotTen nua: moveColumns cua Google Sheets lam HONG dropdown
  // (named range bi doi thanh list chu) va lam SAI VLOOKUP cot ten (ten ra so).
  // Cot ten (_name) giu o cuoi sheet van hoat dong dung. Dropdown da tro thang
  // vung CH1 nen luon hien danh sach.
  buoc('Checkbox tra cuu',  taoCheckboxTraCuu);

  var msg;
  if (loi.length === 0) {
    _datCaiDat(true);        // danh dau da cai dat thanh cong
    buildMenus();            // cap nhat menu NGAY (an muc cai dat, khong can reload)
    msg = 'CAI DAT THANH CONG - file da san sang su dung.\n\n' + ketqua.join('\n') +
          '\n\nMuc "CAI DAT BAN DAU" da duoc AN de tranh chay nham lan sau. ' +
          'Neu can chay lai: "ITTs Cong cu > Bao tri (nang cao)".';
  } else {
    // Con loi -> KHONG danh dau hoan tat, giu muc cai dat de chay lai
    msg = 'CAI DAT XONG nhung co buoc bi loi - xem ben duoi:\n\n' +
          ketqua.join('\n') + '\n\n' + loi.join('\n') +
          '\n\n(Vi con loi nen chua danh dau hoan tat - muc cai dat van hien de ban chay lai.)';
  }
  SpreadsheetApp.getUi().alert(msg);
}


// ===== Cau hinh tra cuu (VH) =====
// Cau hinh vung checkbox cho tung sheet tra cuu
var TRACUU_CONFIG = [
  { sheet: 'VH2. Tra cứu Học viên',        cbCol: 1, rowStart: 6, rowEnd: 20 },
  { sheet: 'VH1. Tra cứu Lớp',             cbCol: 1, rowStart: 6, rowEnd: 20 },
  { sheet: 'VH3. Tra cứu Giảng viên',      cbCol: 1, rowStart: 6, rowEnd: 20 },
  { sheet: 'VH3b. Tra cứu NV WOW',          cbCol: 1, rowStart: 6, rowEnd: 20 },
  { sheet: 'VH4. Tra cứu Khách tiềm năng', cbCol: 1, rowStart: 6, rowEnd: 20 }
];

/**
 * Tao checkbox that o vung ket qua cua ca 4 sheet tra cuu.
 * Chay 1 lan sau khi upload.
 */


// Cac cot ten GOC cua thuc the (KHONG dong) - tien to cua chung khong phai cot ID
var NATIVE_NAME = {
  'full_name': 1, 'class_name': 1, 'course_name': 1, 'student_name': 1,
  'customer_name': 1, 'sender_name': 1, 'bank_name': 1, 'emergency_contact_name': 1
};


// ============================================================
// FIX HYPERLINK + ENUM NAMED RANGE
// ============================================================

function fixHyperlinkToanBo() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var fixed = 0, skipped = 0, scanned = 0;

  for (var s = 0; s < sheets.length; s++) {
    var sheet = sheets[s];
    var lastRow = sheet.getLastRow();
    var lastCol = sheet.getLastColumn();
    if (lastRow === 0 || lastCol === 0) continue;

    var formulas = sheet.getRange(1, 1, lastRow, lastCol).getFormulas();

    for (var i = 0; i < formulas.length; i++) {
      for (var j = 0; j < formulas[i].length; j++) {
        var f = formulas[i][j];
        scanned++;
        if (!f || f.indexOf('HYPERLINK') < 0 || f.indexOf("#'") < 0) continue;

        var converted = convertFormula(f, ss);
        if (converted && converted !== f) {
          sheet.getRange(i + 1, j + 1).setFormula(converted);
          fixed++;
        } else {
          skipped++;
        }
      }
    }
  }

  return 'Fix hyperlink: quet ' + scanned + ' o, fix ' + fixed + ', bo qua ' + skipped + '.';
}

// ============================================================
// CHUYEN DOI CONG THUC - ho tro CA dau , va ;
// ============================================================

function convertFormula(f, ss) {
  // TONG QUAT: doi moi tien to "#'TenSheet'! trong chuoi URL thanh "<url>#gid=<gid>&range=
  // Giu nguyen phan sau (A5, A"&MATCH(...), B"&MATCH(...), C"&MATCH(...) deu hop le).
  var baseUrl = ss.getUrl();
  var changed = false;
  var out = f.replace(/"#'([^']+)'!/g, function(m, name){
    var gid = getGid(ss, name);
    if (gid === null) return m;   // khong tim thay sheet -> giu nguyen
    changed = true;
    return '"' + baseUrl + '#gid=' + gid + '&range=';
  });
  return changed ? out : null;
}


// Phat hien dau phan cach dang dung trong cong thuc (, hoac ;)

function detectSep(f) {
  // Tim dau ngay sau dau ngoac kep dau tien dong lai: "...",  hoac  "...";
  // Cach don gian: neu co ;" thi dung ; con khong thi ,
  // MATCH(...,...,0) -> dau giua cac tham so
  var m = f.match(/MATCH\("[^"]+"([,;])/);
  if (m) return m[1];
  // fallback: tim dau truoc "LABEL")
  var m2 = f.match(/([,;])"[^"]+"\)/);
  if (m2) return m2[1];
  return ',';
}

function getGid(ss, sheetName) {
  var sheet = ss.getSheetByName(sheetName);
  return sheet ? sheet.getSheetId() : null;
}

// ============================================================
// MENU
// ============================================================

function recreateEnumNamedRanges() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheet = ss.getSheetByName('CH1. Danh mục lựa chọn');
  if (!sheet) {
    return 'Named range enum: KHONG thay sheet CH1 -> bo qua.';
  }
  var data = sheet.getDataRange().getValues();
  var created = 0;

  var existing = ss.getNamedRanges();
  for (var k = 0; k < existing.length; k++) {
    if (existing[k].getName().indexOf('enum_') === 0) existing[k].remove();
  }

  function isHeader(str) {
    return /^(\w+)\s+[—-]\s+/.test(str) && str.toLowerCase().indexOf('giá trị') < 0;
  }

  for (var i = 0; i < data.length; i++) {
    var cellA = String(data[i][0] || '');
    var m = cellA.match(/^(\w+)\s+[—-]\s+/);
    if (m && cellA.toLowerCase().indexOf('giá trị') < 0) {
      var enumName = m[1];
      // Bo qua dong header (i) + dong phu de "Gia tri/Combined" (i+1).
      // Gia tri bat dau o data index i+2 (tuc dong 1-index la i+3).
      var firstVal = i + 2;
      var r = firstVal;
      while (r < data.length) {
        var a = String(data[r][0] || '');
        var b = String(data[r][1] || '');
        if (a === '' && b === '') break;   // het block (gap dong trong)
        if (isHeader(a)) break;            // gap enum ke tiep
        r++;
      }
      var count = r - firstVal;
      if (count > 0) {
        try {
          ss.setNamedRange('enum_' + enumName, sheet.getRange(firstVal + 1, 2, count, 1));
          created++;
        } catch (e) {}
      }
    }
  }
  return 'Named range enum: da tao ' + created + ' named range.';
}


// ============================================================
// DOI COT TEN VE CANH ID
// ============================================================

function sapXepCotTen() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var sheets = ss.getSheets();
  var moved = 0;
  var report = [];

  sheets.forEach(function (sh) {
    if (sh.getName().indexOf('DL') !== 0) return; // chi xu ly sheet DL
    var guard = 0;
    while (guard++ < 60) {
      var lastCol = sh.getLastColumn();
      if (lastCol < 2) break;
      var headers = sh.getRange(1, 1, 1, lastCol).getValues()[0].map(function (x) {
        return String(x || '');
      });

      var didMove = false;
      for (var c = 0; c < headers.length; c++) {
        var h = headers[c];
        var prefix = null;

        if (/_name$/.test(h) && !NATIVE_NAME[h]) {
          prefix = h.replace(/_name$/, '');           // student_id_name -> student_id
        } else if (h === 'customer_name_display') {
          prefix = 'lead_id';                          // DL04: ten khach -> sau lead_id
        }
        if (!prefix) continue;

        var tgtIdx = headers.indexOf(prefix);
        if (tgtIdx === -1) continue;                   // khong tim thay cot ID -> bo qua

        var src = c + 1;            // vi tri hien tai cua cot ten (1-based)
        var tgt = tgtIdx + 1;       // vi tri cot ID (1-based)
        var dest = tgt + 1;         // muon cot ten nam ngay sau cot ID

        if (src === dest) continue; // da dung vi tri (ngay sau ID)

        // moveColumns: doi cot ten (src) ve ngay sau cot ID. Vi src luon o ben
        // phai (cot them o cuoi) nen src > dest, cot ten se ket thuc o vi tri dest.
        sh.moveColumns(sh.getRange(1, src, sh.getMaxRows(), 1), dest);
        moved++;
        report.push(sh.getName() + ':  ' + h + '  ->  ngay sau  ' + prefix);
        didMove = true;
        break; // doi xong 1 cot thi quet lai tu dau (vi chi so da thay doi)
      }
      if (!didMove) break;
    }
  });

  var msg = 'Da doi ' + moved + ' cot ten ve ngay sau cot ID.\n' +
            'Cong thuc da duoc Google Sheets tu dieu chinh - khong gay loi.';
  return 'Doi cot ten: da doi ' + moved + ' cot ve ngay sau cot ID.';
}


// ============================================================
// TAO CHECKBOX TRA CUU + onEdit
// ============================================================

function taoCheckboxTraCuu() {
  var ss = SpreadsheetApp.getActiveSpreadsheet();
  var done = 0;
  for (var i = 0; i < TRACUU_CONFIG.length; i++) {
    var cfg = TRACUU_CONFIG[i];
    var sheet = ss.getSheetByName(cfg.sheet);
    if (!sheet) continue;
    var range = sheet.getRange(cfg.rowStart, cfg.cbCol, cfg.rowEnd - cfg.rowStart + 1, 1);
    range.insertCheckboxes();
    range.uncheck();
    done++;
  }
  return 'Checkbox tra cuu: da tao cho ' + done + ' sheet.';
}

/**
 * onEdit tu dong: khi tich 1 checkbox trong vung ket qua,
 * tu bo tich tat ca dong khac (chi chon 1).
 */


// ===== DAU GIO TU DONG: doi trang thai -> tu dien cot thoi gian neu dang trong =====
// Quy tac: [cot trigger, tu khoa ('*' = bat ky gia tri nao), cot thoi gian se dien]
var AUTO_STAMP = {
  'DL03': [['test_status',['graded'],'result_time']],
  'DL04': [['conversion_status',['*'],'conversion_time']],
  'DL08': [['class_confirmation_status',['confirmed'],'confirmation_time'],
           ['onboarding_status',['completed'],'onboarding_completed_at']],
  'DL12': [['attendance_status',['on_time','late'],'check_in_time']],
  'DL13': [['homework_status',['submitted'],'homework_submitted_time'],
           ['homework_score',['*'],'graded_at']],
  'DL16': [['feedback_status',['in_progress','resolved'],'classified_at'],
           ['feedback_status',['resolved'],'action_taken_at']],
  'DL17': [['assigned_handler',['*'],'assigned_at'],
           ['complaint_status',['resolved'],'resolution_time']],
  'DL18': [['re_enrollment_status',['*'],'re_enrollment_contact_time']]
};
function autoTimestamp(e){
  try{
    var sh=e.range.getSheet();
    var rules=AUTO_STAMP[sh.getName().split('.')[0]];
    if(!rules) return;
    var row=e.range.getRow();
    if(row<4 || e.range.getNumRows()>1 || e.range.getNumColumns()>1) return;
    var col=e.range.getColumn();
    var hdr=String(sh.getRange(1,col).getValue());
    var val=(e.value!==undefined)? String(e.value): String(sh.getRange(row,col).getValue());
    if(val==='') return;
    var lc=val.toLowerCase();
    var hdrs=sh.getRange(1,1,1,sh.getLastColumn()).getValues()[0].map(String);
    for(var i=0;i<rules.length;i++){
      var r=rules[i];
      if(r[0]!==hdr) continue;
      var ok=(r[1][0]==='*');
      for(var k=0;k<r[1].length && !ok;k++){ if(lc.indexOf(r[1][k])>=0) ok=true; }
      if(!ok) continue;
      var t=hdrs.indexOf(r[2]);
      if(t<0) continue;
      var cell=sh.getRange(row,t+1);
      if(String(cell.getValue())==='') cell.setValue(new Date());
    }
  }catch(err){}
}

function onEdit(e) {
  autoTimestamp(e);
  if (!e || !e.range) return;
  var sheet = e.range.getSheet();
  var sheetName = sheet.getName();

  // Tim config khop sheet dang sua
  var cfg = null;
  for (var i = 0; i < TRACUU_CONFIG.length; i++) {
    if (TRACUU_CONFIG[i].sheet === sheetName) { cfg = TRACUU_CONFIG[i]; break; }
  }
  if (!cfg) return;

  var row = e.range.getRow();
  var col = e.range.getColumn();

  // Chi xu ly khi sua dung cot checkbox + trong vung ket qua
  if (col !== cfg.cbCol) return;
  if (row < cfg.rowStart || row > cfg.rowEnd) return;

  // Neu vua tich (TRUE) -> bo tich cac dong khac
  if (e.value === 'TRUE') {
    for (var r = cfg.rowStart; r <= cfg.rowEnd; r++) {
      if (r !== row) {
        sheet.getRange(r, cfg.cbCol).setValue(false);
      }
    }
  }
}

/** Chay rieng buoc fix hyperlink (khong dung den named range/checkbox) */
function menuFixHyperlink(){
  var kq = fixHyperlinkToanBo();
  SpreadsheetApp.getUi().alert(kq);
}
