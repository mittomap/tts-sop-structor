"""BAN CHAY TREN GOOGLE SHEETS (.gs) CON THEO KIP APP KHONG?

VI SAO CO FILE NAY (V9.42).
App co HAI ban chay:
  - ban OFFLINE mot file (gen_v5.py -> ITTs_WebApp_v5_demo.html) - ban dang duoc phat trien;
  - ban GOOGLE SHEETS (ITTs_WebApp_v4.gs + ITTs_Reminders.gs) - ban DUY NHAT hien nay co the
    nhieu nguoi dung chung va co the chay theo lich.

Do bang may ngay 29/07: ban .gs sua lan cuoi 28/07 (V9.15), app da di toi V9.41. Ban .gs chi doc
19 bang trong khi app dung 26 - thieu DL06b (lich dong hoc phi theo dot), DL19 (lich lam viec
WOW), DL20 (kho bai tap), DL21, DL22 (gioi thieu), DL23/DL24 (giao viec). Va bo quet nhac viec
theo lich chi biet ~10 luat trong khi naFor() cua app co 83 ma.

Nguy hiem o cho: KHONG CO GI BAO. Ai dem ban .gs len chay that ngay mai se mat dung nhung thu vua
lam, ma man hinh van hien binh thuong. Bo kiem nay bien khoang cach do thanh mot CON SO DUOC KHAI
BAO: khoang cach dung nhu khai thi xanh, khoang cach RONG THEM ma khong ai khai thi do.

Day KHONG phai loi keu "hay dong bo ngay". Anh Luan da chot se quyet nen tang sau; viec cua bo
kiem la khong de khoang cach lon them trong im lang.

Chay:  python3 check_gs.py        (ma thoat 0 = dung nhu khai, khac 0 = lech them)
"""
import json
import os
import re
import sys

SD = os.path.dirname(os.path.abspath(__file__))
GOC = os.environ.get("ITTS_OUT") or os.path.dirname(SD)

# ── KHOANG CACH DA BIET VA DA CHAP NHAN (29/07, V9.42) ───────────────────────
# Moi bang o day la mot QUYET DINH: "ban .gs chua co cai nay, va chung ta biet".
# Bo mot dong khoi day = da dong bo xong. Them mot dong = phai co ly do doc duoc.
BANG_THIEU = {
    "DL06b": "Lich dong hoc phi theo dot (mang 4). Ban .gs con dung mot cot next_payment_due.",
    "DL19": "Lich lam viec cua NV WOW.",
    "DL20": "Kho bai tap dung chung.",
    "DL21": "Giao an theo buoi.",
    "DL22": "So luot gioi thieu (referral).",
    "DL23": "Module Giao viec - dau viec.",
    "DL24": "Module Giao viec - trao doi trong mot dau viec.",
}
# Ban .gs quet nhac viec theo lich (dailyReminders) biet bao nhieu luat, app co bao nhieu ma.
GHICHU_QUET = ("Bo quet theo lich cua ban .gs (ITTs_Reminders.gs) doc mot danh sach luat rieng, "
               "khong dung chung naFor() voi app. Day la ly do so luat cua no it hon nhieu.")


def _tables_app():
    """Bang du lieu app dang dung - lay tu chinh bo du lieu demo."""
    p = os.path.join(SD, "demo_data_big.json")
    d = json.load(open(p, encoding="utf-8"))
    return set(d.get("dl", {}).keys())


def _tables_gs():
    p = os.path.join(GOC, "ITTs_WebApp_v4.gs")
    if not os.path.exists(p):
        return None, None
    src = open(p, encoding="utf-8").read()
    m = re.search(r"var WA_SHEETS=\[(.*?)\]", src, re.S)
    if not m:
        return set(), src
    return set(re.findall(r"'([A-Za-z0-9]+)'", m.group(1))), src


def _luat_gs():
    p = os.path.join(GOC, "ITTs_Reminders.gs")
    if not os.path.exists(p):
        return None
    src = open(p, encoding="utf-8").read()
    m = re.search(r"function rScan\(\)\{(.*?)\nfunction ", src, re.S)
    body = m.group(1) if m else src
    return set(re.findall(r"'(sla[A-Za-z0-9_]+)'", body))


def _ma_app():
    src = open(os.path.join(SD, "gen_v5.py"), encoding="utf-8").read()
    return set(re.findall(r'"(NA\d{3})"', src))


APP = _tables_app()
GS, GSSRC = _tables_gs()
if GS is None:
    raise SystemExit("KHONG THAY ITTs_WebApp_v4.gs - ban Sheets da bi xoa? Sua check_gs.py cho khop.")

thieu = sorted(APP - GS)
khong_khai = [t for t in thieu if t not in BANG_THIEU]
khai_thua = [t for t in BANG_THIEU if t in GS or t not in APP]

luat = _luat_gs() or set()
ma = _ma_app()

print("=" * 78)
print("BAN GOOGLE SHEETS (.gs) <-> APP")
print("  bang app dung        : %d" % len(APP))
print("  bang ban .gs doc     : %d" % len(GS))
print("  khoang cach da khai  : %d bang (%s)" % (len(BANG_THIEU), ", ".join(sorted(BANG_THIEU))))
print("  luat nhac theo lich  : ban .gs %d nguong SLA | app co %d ma nhac viec" % (len(luat), len(ma)))
print("  %s" % GHICHU_QUET)
print()

loi = []
if khong_khai:
    loi += ["Ban .gs THIEU bang ma khong ai khai: " + t for t in khong_khai]
if khai_thua:
    loi += ["Khai thieu bang '%s' nhung ban .gs DA co (hoac app khong con dung) - bo dong nay" % t
            for t in khai_thua]

# Ban .gs phai TU NOI ra minh dang o phien ban nao - de nguoi deploy khong tuong nham.
if "V9.15" not in GSSRC and "PHIEN BAN" not in GSSRC.upper():
    loi.append("ITTs_WebApp_v4.gs khong ghi ro no dung o phien ban nao - nguoi deploy khong biet "
               "no lac hau bao xa. Them khoi ghi chu dau file.")

if loi:
    print("CO CHO LECH THEM SO VOI BAN KHAI:")
    for x in loi:
        print("   X %s" % x)
    print()
    print("Dong bo ban .gs, HOAC cap nhat BANG_THIEU trong check_gs.py KEM LY DO.")
    print("KET QUA: KHONG DAT")
    sys.exit(1)

print("KET QUA: DAT - khoang cach giua ban .gs va app dung bang ban khai, khong am tham rong them.")
