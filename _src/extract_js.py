"""Trich phan JavaScript ra khoi hai file HTML da build.

VI SAO CAN FILE NAY: toan bo bo kiem (14 bo, ~1975 tieu chi) deu nap `_APP.js` / `_HV.js` roi chay
THAT cac ham cua app. Hai file do la SAN PHAM trich ra tu HTML, khong phai ma nguon.

TRUOC V9.39 script nay khong nam trong repo - no chi ton tai tren may nguoi build. Hau qua: ai
nhan ban giao ma sua `gen_v5.py` xong se KHONG CHAY DUOC bo kiem nao, tuc la mat sach lop bao ve
duy nhat cua du an. Do la lo hong ban giao, khong phai chuyen nho.

Chay:  python3 extract_js.py [duong-dan-thu-muc-chua-HTML]
Mac dinh lay thu muc cha cua _src (dung voi bo cuc repo hien tai).
"""
import os
import re
import sys

SD = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("ITTS_OUT") or os.path.dirname(SD)

# _APP6.js la than cua BAN V6. Truoc day khong trich no, nen 20/21 bo kiem chi soi ban v5 -
# ban v6 duoc giao ma chua bo kiem nao chay qua. Anh Luan 01/08: "van de la e build v6 da chuan
# chua ay, chu bat a lam thu trong khi thiet ke luong te hoac loi tum lum thi...".
CAP = [("ITTs_WebApp_v5_demo.html", "_APP.js"),
       # V9.99: ban V6 da ngung phat hanh (anh Luan 04/08) - khong con file de trich.
       # Bat lai thi bo dau # o dong duoi, cung luc voi ba dong o cuoi gen_v5.py.
       # ("ITTs_WebApp_v6_demo.html", "_APP6.js"),
       ("ITTs_TrangHocVien_demo.html", "_HV.js")]

for ten_html, ten_js in CAP:
    duong = os.path.join(OUT, ten_html)
    if not os.path.exists(duong):
        raise SystemExit("KHONG THAY %s - chay `ITTS_OUT=%s python3 gen_v5.py` truoc da." % (duong, OUT))
    html = open(duong, encoding="utf-8").read()
    khoi = re.findall(r"<script>(.*?)</script>", html, re.S)
    if not khoi:
        raise SystemExit("KHONG TIM THAY khoi <script> nao trong %s" % ten_html)
    # khoi DAI NHAT la than app; cac khoi con lai la doan nho nhung trong <head>
    js = max(khoi, key=len)
    dich = os.path.join(SD, ten_js)
    open(dich, "w", encoding="utf-8").write(js)
    print("WROTE %s (%d ky tu)" % (dich, len(js)))
