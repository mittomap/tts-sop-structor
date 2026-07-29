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


def _cols():
    """Ten cot cua tung bang DL trong file SOP goc."""
    z = zipfile.ZipFile(SOP)
    rels = dict(re.findall(r'Id="(rId\d+)"[^>]*Target="([^"]+)"',
                           z.read("xl/_rels/workbook.xml.rels").decode("utf-8", "ignore")))
    sheets = re.findall(r'<sheet name="([^"]+)"[^>]*r:id="(rId\d+)"',
                        z.read("xl/workbook.xml").decode("utf-8", "ignore"))
    shared = [n for n in z.namelist() if "sharedStrings" in n]
    raw = re.findall(r"<t[^>]*>(.*?)</t>",
                     z.read(shared[0]).decode("utf-8", "ignore"), re.S) if shared else []
    ss = [x.replace("&amp;", "&").replace("&lt;", "<").replace("&gt;", ">").replace("&quot;", '"')
          for x in raw]
    cell = re.compile(r'<c\b([^>]*)>(.*?)</c>|<c\b([^>]*)/>', re.S)
    val = re.compile(r'<v>(.*?)</v>', re.S)

    def vals(row):
        out = []
        for m in cell.finditer(row):
            attrs = m.group(1) or m.group(3) or ""
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
print("KET QUA: DAT - moi cot SOP mo ta deu duoc app dung, hoac da khai ly do co y bo qua.")
