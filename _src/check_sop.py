"""DOI CHIEU SOP GOC voi APP: cot nao SOP mo ta ma app khong he dung?

VI SAO CO FILE NAY (anh Luan chot 29/07):
  "chung ta viet app de phuc vu tron ven SOP, neu lam xong ma chua the hien du 100% sop tuc la
   that bai. Chung ta co the them, co the bo sung, co the dieu chinh de no hop ly va logic hon,
   tham chi them chuc nang moi. Nhung neu chung ta de thieu sot nhung gi SOP da tung mo ta, neu
   chung ta thay no khong bi bat hop ly, ma chung ta lam sot, nghia la chung ta sai."

Truoc khi co file nay, viec "app da phu het SOP chua" hoan toan dua vao TRI NHO. Va no da sot
that: 5 cot ve nguoi giam ho / phu huynh trong DL09 (emergency_contact_name/phone/relation,
gender, address) nam trong SOP, nam san trong du lieu, ma KHONG MOT DONG MA NAO cua app doc toi
- khong man hinh nao hien ra. Sot nhu vay khong ai phat hien duoc bang mat.

CACH LAM: doc THANG file SOP goc (ITTs_Operations_Template_v4.xlsx), lay ten cot cua moi bang
DL, roi soi xem gen_v5.py co nhac toi khong. Cot nao app khong dung thi PHAI khai vao BOQUA duoi
day KEM LY DO. Khong khai = do.

Chay:  python3 check_sop.py        (ma thoat 0 = du, khac 0 = con sot)
"""
import json
import os
import re
import sys
import zipfile

SD = os.path.dirname(os.path.abspath(__file__))
GOC = os.environ.get("ITTS_OUT") or os.path.dirname(SD)
SOP = os.path.join(GOC, "ITTs_Operations_Template_v4.xlsx")

# ── COT SOP CO MA APP CO Y KHONG DUNG ────────────────────────────────────────
# Moi dong phai co LY DO doc duoc. "App khong can" khong phai ly do - phai noi RO app lam gi
# thay cho cot do. Them dong vao day la mot quyet dinh, khong phai mot cach lam im hang do.
BOQUA = {
    ("DL03", "auto_trigger_hint"):
        "Cot GOI Y TU TINH cua ban Google Sheets (ARRAYFORMULA). App tinh song bang naLive()/naFor() "
        "doc thang trang thai that + CH4, chinh xac hon cot luu san (cot luu san loi thoi ngay khi "
        "trang thai doi ma khong ai mo sheet).",
    ("DL06", "auto_trigger_hint"): "Nhu tren.",
    ("DL08", "auto_trigger_hint"): "Nhu tren.",
    ("DL08", "sla_status"):
        "Trang thai SLA TU TINH. App tinh song bang obState() tu assigned_at + nguong CH2 - doi "
        "nguong trong Cai dat la doi theo ngay lap tuc, cot luu san thi khong.",
    ("DL17", "sla_status"):
        "Nhu tren, app tinh trong slaItems() theo muc nghiem trong (slaKN_high/medium/low_hours).",
    ("DL11", "teacher_note_within_sla"):
        "Co trong han hay khong la TU TINH. App tinh bang bhState() so gio ghi nhan xet voi "
        "slaTeacherNote_hours.",
}


def _sst(z):
    """Bang chuoi dung chung cua file xlsx - PHAI cat theo <si>, khong phai theo <t>.

    Da can dung: mot o co dinh dang (chu dam mot doan) thi Excel chia thanh nhieu <t> trong CUNG
    mot <si>. Neu cat theo <t> thi tu o do tro di MOI chi so deu lech, va cai lech do im lang -
    doc ra mot chuoi khac han nhung van la chuoi hop le, nen mat thuong khong thay. Bang phan
    quyen CH3 doc ra toan so "1750, 1755" chinh la vi vay.
    """
    shared = [n for n in z.namelist() if "sharedStrings" in n]
    if not shared:
        return []
    xml = z.read(shared[0]).decode("utf-8", "ignore")
    out = []
    for si in re.findall(r"<si>(.*?)</si>", xml, re.S):
        s = "".join(re.findall(r"<t[^>]*>(.*?)</t>", si, re.S))
        out.append(s.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">")
                   .replace("&quot;", '"').replace("&#10;", " / "))
    return out


def _oCua(z, rels, rid, ss):
    """Doc mot sheet ra danh sach dong, moi dong la dict {cot chu: gia tri}."""
    xml = z.read("xl/" + rels[rid]).decode("utf-8", "ignore")
    cell = re.compile(r'<c\b([^>]*?)(?:/>|>(.*?)</c>)', re.S)   # o RONG tu dong: <c .../> - xem _sst
    val = re.compile(r"<v>(.*?)</v>", re.S)
    out = []
    for body in re.findall(r"<row[^>]*>(.*?)</row>", xml, re.S):
        d = {}
        for m in cell.finditer(body):
            a = m.group(1) or ""
            col = re.search(r'r="([A-Z]+)\d+"', a)
            v = val.search(m.group(2) or "")
            v = v.group(1) if v else ""
            if 't="s"' in a and v.isdigit() and int(v) < len(ss):
                v = ss[int(v)]
            if col:
                d[col.group(1)] = str(v).strip()
        out.append(d)
    return out


def _cols():
    """Ten cot cua tung bang DL trong file SOP goc."""
    z = zipfile.ZipFile(SOP)
    rels = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"',
                           z.read("xl/_rels/workbook.xml.rels").decode("utf-8", "ignore")))
    sheets = re.findall(r'<sheet name="([^"]+)"[^>]*r:id="(rId\d+)"',
                        z.read("xl/workbook.xml").decode("utf-8", "ignore"))
    ss = _sst(z)
    cell = re.compile(r'<c\b([^>]*?)(?:/>|>(.*?)</c>)', re.S)   # o RONG tu dong: <c .../> - xem _sst
    val = re.compile(r'<v>(.*?)</v>', re.S)

    def vals(row):
        out = []
        for m in cell.finditer(row):
            attrs = m.group(1) or ""
            v = val.search(m.group(2) or "")
            v = v.group(1) if v else ""
            if 't="s"' in attrs and v.isdigit() and int(v) < len(ss):
                v = ss[int(v)]
            out.append(v)
        return out

    res = {}
    for name, rid in sheets:
        if not re.match(r"^DL\d", name):
            continue
        path = "xl/" + rels.get(rid, "")
        if path not in z.namelist():
            continue
        rows = re.findall(r"<row[^>]*>(.*?)</row>",
                          z.read(path).decode("utf-8", "ignore"), re.S)
        best = []
        for r in rows[:8]:                      # dong tieu de nam trong may dong dau
            cand = [v for v in vals(r) if re.match(r"^[a-z][a-z0-9_]{2,}$", str(v))]
            if len(cand) > len(best):
                best = cand
        if best:
            res[name.split(".")[0]] = best
    return res


if not os.path.exists(SOP):
    raise SystemExit("KHONG THAY file SOP goc: %s" % SOP)

COLS = _cols()
SRC = open(os.path.join(SD, "gen_v5.py"), encoding="utf-8").read()

tong = 0
sot = []
thua_boqua = []
for tb, cols in COLS.items():
    for c in cols:
        tong += 1
        dung = re.search(r"\b" + re.escape(c) + r"\b", SRC) is not None
        khai = (tb, c) in BOQUA
        if dung and khai:
            thua_boqua.append("%s.%s" % (tb, c))
        elif not dung and not khai:
            sot.append("%s.%s" % (tb, c))

print("=" * 78)
print("DOI CHIEU SOP GOC <-> APP")
print("  file SOP     : %s" % os.path.basename(SOP))
print("  bang du lieu : %d" % len(COLS))
print("  cot SOP mo ta: %d" % tong)
print("  co y khong dung (da khai ly do): %d" % len(BOQUA))
print()
if thua_boqua:
    print("KHAI BOQUA THUA - app DA dung nhung van con trong danh sach bo qua:")
    for x in thua_boqua:
        print("   - %s   (bo dong nay khoi BOQUA)" % x)
    print()
if sot:
    print("SOT %d COT SOP MO TA MA APP KHONG HE DUNG:" % len(sot))
    for x in sot:
        print("   X %s" % x)
    print()
    print("Sua app cho dung cot do, HOAC khai vao BOQUA trong check_sop.py KEM LY DO.")
    print("KET QUA: KHONG DAT")
    sys.exit(1)
print("KET QUA COT: DAT - moi cot SOP mo ta deu duoc app dung, hoac da khai ly do co y bo qua.")


# ═══ PHAN 2: SO TRIGGER HD3 - APP CO SINH RA MOI TINH HUONG SOP MO TA KHONG? ══════════
# Doi chieu cot moi biet du lieu co cho de LUU. Con SO TRIGGER moi la phan noi "khi nao thi app
# phai nhac viec gi" - tuc la phan NGHIEP VU that su. Da sot that: naFor() khong he co nhanh nao
# cho DL09 (hoc vien), DL11 (buoi hoc), DL12 (diem danh), nen 21 ma nhac viec SOP viet cho ba
# bang do CHUA BAO GIO CHAY - va khong ai phat hien duoc, vi man hinh van day du va van dep.
#
# Cach do: chay THAT naFor() tren MOI dong cua MOI bang roi xem app sinh ra nhung ma nao.
# Khong soi ma nguon - soi ma nguon chi biet "co viet" chu khong biet "co chay".

TRIG_BOQUA = {
    # NA037 da bo khoi danh sach nay 31/07: sau khi gieo lai du lieu demo (WOW trai deu 18
    # ngay), app CO sinh ra tinh huong nay that - giu trong danh sach bo qua la khai gian.
    "NA039": "Nhan 'khao sat da tra loi' - trang thai XONG.",
    "NA045": "Nhan 'khieu nai da dong' - trang thai XONG, con viec hoi lai HV thi da co luat rieng "
             "(slaComplaintFollowup_days).",
    "NA056": "Ma cu cua 'da tu van chua tao don' - app dung NA001 (con han) va NA055 (qua han).",
    "NA059": "Nhan 'da hoan tien xong' - trang thai XONG.",
    "NA068": "Nhan 'HV dang hoc binh thuong' - khong co viec gi.",
    "NA069": "Nhan 'HV da tot nghiep' - trang thai XONG.",
    "NA074": "Nhan 'da gui khao sat' - app dung NA073 (cho tra loi) va NA075 (qua han chua tra loi).",
    "NA080": "Nhan 'phan hoi tich cuc, da ghi nhan' - khong co viec gi.",
    "NA092": "Nhan 'da moi tai ghi danh' - app dung NA091 (chua moi) va NA093 (da nhan loi).",
}

# ── TINH HUONG CHI SONG TRONG MOT CUA SO NGAN ────────────────────────────────
# NA050 ("lead moi con trong han") chi dung khi lead vao chua qua slaLRT_minutes = 15 phut. Mot bo
# du lieu demo TINH khong the giu duoc tinh huong do: gieo luc build thi 16 phut sau no da thanh
# NA049/NA046, va bo kiem se do vao ngay hom sau du khong ai dung vao ma. Day dung cai benh "bo
# kiem khop voi mot con so troi theo lich" da can mot lan o check_data.
# Cach lam dung: dung mot DONG DU LIEU tai cho voi moc thoi gian tinh theo BAY GIO, roi doi naFor()
# tra ve dung ma. Van la chay that naFor(), khong phai soi ma nguon - chi khac la tinh huong do
# minh dung len thay vi cho no tinh co co san.
#   ma -> (bang, mo ta vi sao phai dung san, cac cot cua dong)
#   gia tri {"__ago_min": n} = "n phut truoc", quy ra chuoi dd/mm/yyyy hh:mm luc chay.
SYNTH = {
    "NA049": ("DL02",
              "Chi dung tu phut thu 15 den gio thu 4 sau khi lead vao (slaLRT_minutes -> "
              "slaLeadReassign_hours). Cua so ba tieng ruoi nay khong the gieo tinh vao du lieu: "
              "sang hom sau moi lead deu da qua han, va bo kiem do ma khong ai dung vao ma.",
              {"lead_id": "L-PROBE49", "lead_status": "new (Mới)", "full_name": "Dong dung san",
               "lead_created_time": {"__ago_min": 60}, "first_call_time": "",
               "contact_count": 0, "next_followup_time": ""}),
    "NA050": ("DL02",
              "Chi dung trong 15 phut dau sau khi lead vao (slaLRT_minutes) - du lieu demo tinh "
              "khong the giu duoc cua so nay.",
              {"lead_id": "L-PROBE", "lead_status": "new (Mới)", "full_name": "Dong dung san",
               "lead_created_time": {"__ago_min": 2}, "first_call_time": "",
               "contact_count": 0, "next_followup_time": ""}),
    # V9.57: cung mot benh, bat duoc trong dot lam the. NA076 la nhanh "buoi WOW xong, CON TRONG
    # HAN ghi ket qua"; qua han thi thanh NA075. Cua so do dai dung slaWowNote_hours (24 gio), nen
    # no chi dung khi du lieu demo tinh co co mot buoi WOW xong trong vong 24 gio truoc luc chay.
    # Chay luc 14h thi con, chay luc 20h thi het - bo kiem do luc do se bao "app khong sinh ra
    # NA076" trong khi app khong he doi mot dong nao. Dung dong dung san cho chac tay.
    "NA076": ("DL14",
              "Chi dung tu luc buoi WOW ket thuc den het han ghi ket qua (slaWowNote_hours). Qua "
              "han la doi sang NA075, nen du lieu demo tinh khong giu duoc tinh huong nay - bo "
              "kiem se do do hay xanh tuy vao GIO chay, khong lien quan gi den ma nguon.",
              {"wow_id": "W-PROBE76", "student_id": "HV001", "student_name": "Dong dung san",
               "wow_status": "completed (Đã hoàn thành)", "wow_content_note": "",
               "wow_outcome": "", "quota_deducted": "",
               "wow_session_date": {"__ago_min": 60}}),
}


def _hd3():
    """Ma NA co trong so trigger HD3 cua SOP."""
    z = zipfile.ZipFile(SOP)
    rels = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"',
                           z.read("xl/_rels/workbook.xml.rels").decode("utf-8", "ignore")))
    sheets = re.findall(r'<sheet name="([^"]+)"[^>]*r:id="(rId\d+)"',
                        z.read("xl/workbook.xml").decode("utf-8", "ignore"))
    ss = _sst(z)
    cell = re.compile(r'<c\b([^>]*?)(?:/>|>(.*?)</c>)', re.S)   # o RONG tu dong: <c .../> - xem _sst
    val = re.compile(r'<v>(.*?)</v>', re.S)
    out = {}
    for name, rid in sheets:
        if not name.startswith("HD3"):
            continue
        xml = z.read("xl/" + rels[rid]).decode("utf-8", "ignore")
        for row in re.findall(r"<row[^>]*>(.*?)</row>", xml, re.S):
            vals = []
            for m in cell.finditer(row):
                attrs = m.group(1) or ""
                v = val.search(m.group(2) or "")
                v = v.group(1) if v else ""
                if 't="s"' in attrs and v.isdigit() and int(v) < len(ss):
                    v = ss[int(v)]
                vals.append(v)
            ma = [str(x).strip() for x in vals if re.match(r"^NA\d+$", str(x).strip())]
            if ma and ma[0] not in out:
                mota = [str(x).strip() for x in vals
                        if len(str(x).strip()) > 18 and not re.match(r"^NA\d+$", str(x).strip())]
                out[ma[0]] = (mota[0][:70] if mota else "")
    return out


TRIG = _hd3()
SINH = set()
SYNRA = {}
if TRIG:
    js = os.path.join(SD, "_APP.js")
    if not os.path.exists(js):
        raise SystemExit("KHONG THAY _APP.js - chay `python3 extract_js.py` truoc da.")
    import subprocess
    probe = r"""
var El=function(){return{style:{},classList:{add:function(){},remove:function(){},contains:function(){return false}},
 setAttribute:function(){},getAttribute:function(){return null},appendChild:function(){},
 querySelector:function(){return El()},querySelectorAll:function(){return[]},addEventListener:function(){},
 innerHTML:"",textContent:"",value:""}};
global.document={getElementById:function(){return El()},querySelector:function(){return El()},
 querySelectorAll:function(){return[]},createElement:function(){return El()},body:El(),addEventListener:function(){}};
global.window=global;global.location={hash:"",search:""};
global.localStorage={getItem:function(){return null},setItem:function(){}};
global.sessionStorage={getItem:function(){return null},setItem:function(){},removeItem:function(){}};
require("vm").runInThisContext(require("fs").readFileSync(process.argv[2],"utf8"));
setRole("all");
var ra={};
Object.keys(DATA.dl||{}).forEach(function(tb){(DATA.dl[tb]||[]).forEach(function(r){
  try{var c=naFor(tb,r); if(c)ra[c]=1}catch(e){}})});
/* dong dung san cho cac tinh huong chi song trong mot cua so ngan */
function _fmt(d){function p(x){return x<10?"0"+x:x}
 return p(d.getDate())+"/"+p(d.getMonth()+1)+"/"+d.getFullYear()+" "+p(d.getHours())+":"+p(d.getMinutes())}
var SYN=JSON.parse(process.argv[3]||"{}"),syn=[];
Object.keys(SYN).forEach(function(ma){
 var tb=SYN[ma][0],src=SYN[ma][1],r={};
 Object.keys(src).forEach(function(k){var v=src[k];
  if(v&&typeof v==="object"&&v.__ago_min!=null)v=_fmt(new Date(Date.now()-v.__ago_min*60000));
  r[k]=v});
 var got="";try{got=naFor(tb,r)||"(rong)"}catch(e){got="LOI:"+e.message}
 if(got&&got.charAt(0)==="N")ra[got]=1;
 syn.push(ma+">"+got)});
console.log("SYN "+syn.join(" "));
console.log(Object.keys(ra).sort().join(","));
"""
    pf = os.path.join(SD, "_probe_na.js")
    open(pf, "w", encoding="utf-8").write(probe)
    syn_arg = json.dumps({m: [v[0], v[2]] for m, v in SYNTH.items()}, ensure_ascii=False)
    try:
        r = subprocess.run(["node", pf, js, syn_arg], capture_output=True, text=True, cwd=SD, timeout=180)
        if r.returncode != 0:
            raise SystemExit("KHONG CHAY DUOC probe naFor:\n" + (r.stderr or "")[-1500:])
        _out = r.stdout.strip().split("\n")
        SINH = set(x for x in (_out[-1] or "").split(",") if x)
        for _l in _out:
            if _l.startswith("SYN "):
                for _p in _l[4:].split():
                    if ">" in _p:
                        _m, _g = _p.split(">", 1)
                        SYNRA[_m] = _g
    finally:
        try:
            os.remove(pf)
        except OSError:
            pass

thieu = sorted(m for m in TRIG if m not in SINH and m not in TRIG_BOQUA)
thua = sorted(m for m in TRIG_BOQUA if m in SINH)
# dong dung san PHAI ra dung ma da hen - ra khac (hoac rong) la nhanh naFor do da hong
sailech = sorted(m for m in SYNTH if SYNRA.get(m) != m)
print()
print("SO TRIGGER HD3 <-> APP")
print("  tinh huong SOP mo ta : %d" % len(TRIG))
print("  app SINH RA luc chay : %d" % len([m for m in TRIG if m in SINH]))
print("  trong do dung bang dong dung san: %d (%s)" % (len(SYNTH), ", ".join(sorted(SYNTH))))
print("  co y khong sinh (da khai ly do): %d" % len(TRIG_BOQUA))
if sailech:
    print()
    print("DONG DUNG SAN RA SAI MA - nhanh naFor tuong ung da hong:")
    for m in sailech:
        print("   X hen %-7s nhung naFor(%s) tra ve %s" % (m, SYNTH[m][0], SYNRA.get(m) or "(khong chay)"))
    print("KET QUA: KHONG DAT")
    sys.exit(1)
if thua:
    print()
    print("KHAI TRIG_BOQUA THUA - app DA sinh ra nhung van con trong danh sach bo qua:")
    for m in thua:
        print("   - %s   (bo dong nay khoi TRIG_BOQUA)" % m)
if thieu:
    print()
    print("SOT %d TINH HUONG SOP MO TA MA APP KHONG SINH RA:" % len(thieu))
    for m in thieu:
        print("   X %-7s %s" % (m, TRIG[m]))
    print()
    print("Them luat vao naFor()/slaItems(), HOAC khai vao TRIG_BOQUA trong check_sop.py KEM LY DO.")
    print("KET QUA: KHONG DAT")
    sys.exit(1)
print("KET QUA COT + TRIGGER: DAT")


# ═══ PHAN 3: BANG CHI SO BC2 - APP CO TINH DU 51 KPI SOP LIET KE KHONG? ═══════════════
# Da sot that: BC2 liet ke 51 chi so, app tinh 48. Ba cai hut (LFR, APR, SS_ALL) hut o CA hai
# noi - khong co cong thuc trong app, cung khong co dong nguong trong CH6 - nen man KPI hien
# "51 chi so" theo CH6 va nhin nhu du. Ban than SOP cung lech voi chinh no (BC2 51 dong / CH6 48
# dong), va cai lech do di thang vao app vi app doc CH6.
KPI_BOQUA = {}

_bc2 = []
_z = zipfile.ZipFile(SOP)
_rels = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"',
                        _z.read("xl/_rels/workbook.xml.rels").decode("utf-8", "ignore")))
_sh = dict(re.findall(r'<sheet name="([^"]+)"[^>]*r:id="(rId\d+)"',
                      _z.read("xl/workbook.xml").decode("utf-8", "ignore")))
_ss = _sst(_z)
_cell = re.compile(r'<c\b([^>]*?)(?:/>|>(.*?)</c>)', re.S)   # o RONG tu dong: <c .../> - xem _sst
_val = re.compile(r'<v>(.*?)</v>', re.S)
for _nm in [n for n in _sh if n.startswith("BC2")]:
    _xml = _z.read("xl/" + _rels[_sh[_nm]]).decode("utf-8", "ignore")
    for _row in re.findall(r"<row[^>]*>(.*?)</row>", _xml, re.S):
        _v = []
        for _m in _cell.finditer(_row):
            _a = _m.group(1) or ""
            _x = _val.search(_m.group(2) or "")
            _x = _x.group(1) if _x else ""
            if 't="s"' in _a and _x.isdigit() and int(_x) < len(_ss):
                _x = _ss[int(_x)]
            _v.append(str(_x).strip())
        if len(_v) > 2 and re.match(r"^P\d+$", _v[0]) and re.match(r"^[A-Z][A-Z0-9_]{1,9}$", _v[1]):
            if _v[1] not in _bc2:
                _bc2.append(_v[1])

if _bc2:
    _src = SRC
    _thieuKPI = [k for k in _bc2
                 if not re.search(r"\bv\." + re.escape(k) + r"\s*=", _src) and k not in KPI_BOQUA]
    # nguong CH6 phai co dong cho tung chi so, khong thi bang KPI khong cham xanh do duoc
    _dat = json.load(open(os.path.join(SD, "demo_data_big.json"), encoding="utf-8"))
    _ch6 = {str(c.get("code")) for c in (_dat.get("config", {}).get("ch6") or [])}
    _thieuTh = [k for k in _bc2 if k not in _ch6 and k not in KPI_BOQUA]
    print()
    print("BANG CHI SO BC2 <-> APP")
    print("  chi so SOP liet ke  : %d" % len(_bc2))
    print("  app CO cong thuc    : %d" % len([k for k in _bc2 if k not in _thieuKPI]))
    print("  CH6 co dong nguong  : %d" % len([k for k in _bc2 if k not in _thieuTh]))
    if _thieuKPI or _thieuTh:
        print()
        if _thieuKPI:
            print("SOT %d CHI SO SOP LIET KE MA APP KHONG TINH:" % len(_thieuKPI))
            for k in _thieuKPI:
                print("   X %s" % k)
        if _thieuTh:
            print("SOT %d CHI SO KHONG CO DONG NGUONG TRONG CH6:" % len(_thieuTh))
            for k in _thieuTh:
                print("   X %s" % k)
        print()
        print("Them cong thuc vao kpiCompute() va dong nguong vao CH6 (fixdata §14d-bis),")
        print("HOAC khai vao KPI_BOQUA trong check_sop.py KEM LY DO.")
        print("KET QUA: KHONG DAT")
        sys.exit(1)

print("KET QUA BC2: DAT")


# ═══ PHAN 4: BANG PHAN QUYEN CH3 - APP CO CHAN DUNG CHO KHONG? ════════════════════════
# CH3 la trang "Ai duoc lam gi" cua SOP: 31 hanh dong, trong do 8 hanh dong ghi ro "Quan ly phe
# duyet". Truoc V9.41 app phan quyen theo TRANG chu khong theo HANH DONG, va chi co DUNG MOT cua
# duoc canh that (duyet chiet khau) - 7 viec con lai ai mo duoc trang la bam xong. Phan quyen
# nhin thi co, ma cho dau nhat lai ho.
# Bo kiem nay lam hai viec:
#   (a) doi chieu TUNG DONG CH3 voi bang CH3 trong gen_v5.py - lech mot chu la do;
#   (b) CHAY THAT: dong vai tung chuc danh roi hoi canAct() - viec "Quan ly phe duyet" ma nhan
#       vien thuong lam duoc la do. Soi ma nguon chi biet "co viet", chay moi biet "co chan".
CH3_BOQUA = {}

_ch3sop = []
for _nm3 in [n for n in _sh if n.startswith("CH3")]:
    for _d3 in _oCua(_z, _rels, _sh[_nm3], _ss):
        _ten = _d3.get("A", "")
        if not _ten or len(_ten) < 6 or _ten == "Hanh dong" or _ten.startswith("Hành động"):
            continue
        _o = [_d3.get(c, "") for c in "BCDEF"]
        # dong tieu de nhom ("QUAN LY LEAD & TU VAN") khong co o nao ben phai; con dong hanh dong
        # thi luon co it nhat mot o - hoac danh dau vai, hoac ghi dieu kien ap dung o cot G.
        if not any(_o) and not _d3.get("G", ""):
            continue
        _ch3sop.append((_ten, ["X" in x.upper() or "duyệt" in x for x in _o]))

_blk3 = re.search(r"var CH3=\[(.*?)\];", SRC, re.S)
_appCh3 = re.findall(r'\{k:"([a-z0-9_]+)",\s*t:"([^"]+)"', _blk3.group(1) if _blk3 else "")
_tenApp = [t for _, t in _appCh3]
_thieuCh3 = [t for t, _ in _ch3sop if t not in _tenApp and t not in CH3_BOQUA]
_thuaCh3 = [t for t in _tenApp if t not in [x for x, _ in _ch3sop]]

print()
print("BANG PHAN QUYEN CH3 <-> APP")
print("  hanh dong SOP mo ta : %d" % len(_ch3sop))
print("  app co khai         : %d" % len([t for t, _ in _ch3sop if t in _tenApp]))

_ch3loi = []
if _thieuCh3:
    _ch3loi += ["SOT hanh dong CH3 app khong khai: " + t for t in _thieuCh3]
if _thuaCh3:
    _ch3loi += ["App khai hanh dong KHONG co trong CH3 (sai chinh ta?): " + t for t in _thuaCh3]

# (a-bis) moi viec "Quan ly phe duyet" phai co CUA GHI thuc su goi chanAct - khai bang ma khong
# chan thi chi la to giay dan tuong. Day dung luat "phan quyen = giau loi vao + tat chuong + CHAN
# CHINH CUA GHI" da ghi trong 02.
_duyetK = re.findall(r'\{k:"([a-z0-9_]+)"[^}]*duyet:1', _blk3.group(1) if _blk3 else "")
_khongChan = [k for k in _duyetK if ('chanAct("%s")' % k) not in SRC]
if _khongChan:
    _ch3loi = _ch3loi + ["Viec can Quan ly duyet nhung KHONG cua ghi nao goi chanAct(): " + k
                         for k in _khongChan]

# (b) chay that
_pr3 = os.path.join(SD, "_probe_ch3.js")
open(_pr3, "w", encoding="utf-8").write(r"""
var El=function(){return{style:{},classList:{add:function(){},remove:function(){},contains:function(){return false}},
 setAttribute:function(){},getAttribute:function(){return null},appendChild:function(){},
 querySelector:function(){return El()},querySelectorAll:function(){return[]},addEventListener:function(){},
 innerHTML:"",textContent:"",value:""}};
global.document={getElementById:function(){return El()},querySelector:function(){return El()},
 querySelectorAll:function(){return[]},createElement:function(){return El()},body:El(),addEventListener:function(){}};
global.window=global;global.location={hash:"",search:""};
global.localStorage={getItem:function(){return null},setItem:function(){}};
global.sessionStorage={getItem:function(){return null},setItem:function(){},removeItem:function(){}};
require("vm").runInThisContext(require("fs").readFileSync(process.argv[2],"utf8"));
setRole("all");
var out=[];
var duyet=CH3.filter(function(a){return a.duyet});
DATA.dl.DL01.forEach(function(x){
 applyScope(x.staff_id);var rs=SCOPE();
 if(rs.pages==="*")return;                      /* quan tri / dieu hanh: toan quyen theo thiet ke */
 if(rs.mgr)return;                              /* quan ly: co quyen duyet cua nhom minh */
 duyet.forEach(function(a){if(canAct(a.k))out.push(rs.group+" LAM DUOC "+a.k)});
});
console.log("CH3PROBE "+(out.length?out.slice(0,8).join(" | "):"SACH"));
""")
try:
    _r3 = subprocess.run(["node", _pr3, js], capture_output=True, text=True, cwd=SD, timeout=180)
    _line3 = [l for l in (_r3.stdout or "").split("\n") if l.startswith("CH3PROBE ")]
    if _r3.returncode != 0 or not _line3:
        _ch3loi.append("KHONG CHAY DUOC probe CH3: " + (_r3.stderr or "")[-300:])
    elif _line3[0][9:].strip() != "SACH":
        _ch3loi.append("Nhan vien thuong VAN LAM DUOC viec can Quan ly duyet: " + _line3[0][9:])
    else:
        print("  chay that           : nhan vien thuong khong lam duoc viec nao can duyet")
finally:
    try:
        os.remove(_pr3)
    except OSError:
        pass

if _ch3loi:
    print()
    for _x in _ch3loi:
        print("   X %s" % _x)
    print()
    print("Sua bang CH3 trong gen_v5.py cho khop SOP, hoac chan them tai cua ghi bang chanAct().")
    print("KET QUA: KHONG DAT")
    sys.exit(1)

print("KET QUA CH3: DAT")


# ═══ PHAN 5+6: 12 MAN VAN HANH (VH0-VH11) VA 9 BANG BAO CAO (BC1-BC9) ════════════════
# Bon phan tren canh DU LIEU, LUAT NHAC VIEC, CHI SO va QUYEN. Con thieu mot mat: SOP con mo ta
# MAN HINH - 12 man tra cuu/hang cho o nhom VH va 9 bang bao cao o nhom BC. Do bang may lan dau:
#   - VH11 "Khoi luong viec theo NV" khong co man nao (app chi co bang tai GIANG VIEN);
#   - VH3b "Tra cuu NV WOW" bi gop vao danh sach Giang vien ma khong co duong tach ra;
#   - BC1 danh sach HV nguy co thieu ba cot QUAN TRONG NHAT (vang may buoi, thieu may bai,
#     hoat dong cuoi) - vi ba cot do phai DEM tu bang khac chu khong nam san trong DL09;
#   - BC5-BC9 (bang viec theo chuc danh) khong ton tai: hai khoi `kpiAll` va `ROLEKPI` trong ma
#     nguon trong y het thu do nhung CHUA BAO GIO DUOC GOI - code chet nam im 9 phien ban.
#
# Cach do: VE THAT moi trang, moi tab, moi danh sach, cong them bang viec cua TUNG chuc danh
# (dong vai tung nguoi), roi tim nhung chuoi PHAI CO. Chuoi chon la thu chi xuat hien khi man do
# that su duoc dung - khong phai mot tu chung chung de bat gap o trang khac.
VHBC_BOQUA = {
    "BC4": "SOP tinh theo THANG LICH; app dung cua so 30 NGAY GAN NHAT (Lead moi 30 ngay, Dang ky "
           "30 ngay, Doanh thu thang nay + so sanh thang truoc). Cua so truot phan anh dung nhip "
           "van hanh hon moc dau thang - ngay mung 2 bao cao thang chi co hai ngay du lieu.",
}
VHBC = {
    # V9.52: cach goi o tim da chuan hoa ve MOT kieu duy nhat cho o tim nguoi (anh Luan: "thiet ke
    # khong dong bo o cac trang, nhin rat roi mat"). Neo lai theo chuoi chuan moi.
    "VH0": {"t": "Tim kiem nhanh", "can": ["Tìm tên, SĐT hoặc mã"]},
    "VH1": {"t": "Tra cuu Lop", "can": ["Lớp học (DL10)"]},
    "VH2": {"t": "Tra cuu Hoc vien", "can": ["Học viên (DL09)"]},
    "VH3": {"t": "Tra cuu Giang vien", "can": ["Chỉ giảng viên lớp"]},
    "VH3b": {"t": "Tra cuu NV WOW", "can": ["Chỉ NV WOW"]},
    "VH4": {"t": "Tra cuu Khach tiem nang", "can": ["Khách tiềm năng (DL02)"]},
    "VH5": {"t": "Viec - Cham khach", "can": ["Tư vấn cần làm"]},
    "VH6": {"t": "Viec - Hoc vien nguy co", "can": ["Học viên nguy cơ"]},
    "VH7": {"t": "Viec - Test cho cham", "can": ["Test chờ chấm"]},
    "VH8": {"t": "Viec - Thu hoc phi", "can": ["Đơn còn nợ phí"]},
    "VH9": {"t": "Viec - Lop sap khai giang", "can": ["sắp khai giảng"]},
    "VH10": {"t": "Viec - Khieu nai", "can": ["Khiếu nại đang xử lý"]},
    "VH11": {"t": "Khoi luong viec theo NV", "can": ["Khối lượng việc theo nhân viên",
                                                     "Lead đang giữ", "Nhập học dở"]},
    "BC1": {"t": "Bang HV nguy co 2 truc", "can": ["Vắng (buổi)", "Thiếu bài", "Hoạt động cuối"]},
    "BC2": {"t": "Bang chi so KPI", "can": ["KPI theo SOP · CH6"]},
    "BC3": {"t": "Pheu khach tiem nang", "can": ["Phễu"]},
    "BC5": {"t": "Bang NV Tu van", "can": ["Bảng NV Tư vấn", "Lead mới (chưa LH)", "Test sắp tới"]},
    "BC6": {"t": "Bang NV WOW", "can": ["Bảng NV WOW", "WOW có tiến bộ"]},
    "BC7": {"t": "Bang Giang vien", "can": ["Bảng Giảng viên", "Cần viết nhận xét buổi"]},
    "BC8": {"t": "Bang Hoc vu", "can": ["Bảng Học vụ", "Phản hồi chờ phân loại"]},
    "BC9": {"t": "Bang Quan ly", "can": ["Chiết khấu cần duyệt", "Đổi lớp từ 2 lần",
                                         "Khiếu nại mức CAO", "Khiếu nại đã leo thang"]},
}

_sopVH = sorted(set(n.split(".")[0] for n in _sh if re.match(r"^(VH|BC)\d", n)))
_khaiThieu = [m for m in _sopVH if m not in VHBC and m not in VHBC_BOQUA]
_khaiThua = [m for m in VHBC if m not in _sopVH]
print()
print("MAN VAN HANH VH + BANG BAO CAO BC <-> APP")
print("  SOP mo ta   : %d man/bang" % len(_sopVH))
print("  app da khai : %d (%d khai ly do co y khac)" % (len(VHBC), len(VHBC_BOQUA)))
_vhloi = []
if _khaiThieu:
    _vhloi += ["SOP co man/bang ma check nay chua khai: " + m for m in _khaiThieu]
if _khaiThua:
    _vhloi += ["Khai mot man/bang KHONG co trong SOP: " + m for m in _khaiThua]

_spec = os.path.join(SD, "_vhbc_spec.json")
open(_spec, "w", encoding="utf-8").write(json.dumps(VHBC, ensure_ascii=False))
try:
    _r5 = subprocess.run(["node", os.path.join(SD, "_probe_vhbc.js"), _spec],
                         capture_output=True, text=True, cwd=SD, timeout=300)
    _l5 = [l for l in (_r5.stdout or "").split("\n") if l.startswith("VHBC ")]
    if _r5.returncode != 0 or not _l5:
        _vhloi.append("KHONG CHAY DUOC probe VH/BC: " + (_r5.stderr or "")[-400:])
    elif _l5[0][5:].strip() != "DU":
        for _x in _l5[0][5:].split(" || "):
            _vhloi.append(_x)
    else:
        print("  ve that      : moi man/bang deu hien ra duoc")
finally:
    try:
        os.remove(_spec)
    except OSError:
        pass

if _vhloi:
    print()
    for _x in _vhloi:
        print("   X %s" % _x)
    print()
    print("Dung man/bang do trong gen_v5.py, HOAC khai vao VHBC_BOQUA KEM LY DO.")
    print("KET QUA: KHONG DAT")
    sys.exit(1)

print()
print("KET QUA: DAT - cot SOP, so trigger HD3, chi so BC2, phan quyen CH3, man VH va bang BC "
      "deu duoc app phu, hoac da khai ly do.")
