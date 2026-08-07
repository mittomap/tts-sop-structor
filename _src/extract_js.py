"""Trich phan JavaScript ra khoi hai file HTML da build.

VI SAO CAN FILE NAY: toan bo bo kiem (14 bo, ~1975 tieu chi) deu nap `_APP.js` / `_HV.js` roi chay
THAT cac ham cua app. Hai file do la SAN PHAM trich ra tu HTML, khong phai ma nguon.

TRUOC V9.39 script nay khong nam trong repo - no chi ton tai tren may nguoi build. Hau qua: ai
nhan ban giao ma sua `gen_v5.py` xong se KHONG CHAY DUOC bo kiem nao, tuc la mat sach lop bao ve
duy nhat cua du an. Do la lo hong ban giao, khong phai chuyen nho.

Chay:  python3 extract_js.py [duong-dan-thu-muc-chua-HTML]
Mac dinh: CUNG CHO voi gen_v5.py, tuc la ngay canh script (_src).

BAY DA CAN HAI LAN (lan hai 07/08) - VI SAO MAC DINH PHAI KHOP `gen_v5.py`:
Truoc ban nay hai script co HAI mac dinh KHAC NHAU: `gen_v5.py` ghi vao `_src/`, con script
nay doc tu THU MUC CHA (goc repo). Chay tay `python3 gen_v5.py && python3 extract_js.py` la
dung xay ban moi vao `_src/` roi trich ban CU o goc repo de len `_APP.js` - moi bo kiem sau
do do BAN CU ma van in ra ket qua nhu that. `verify.sh` khong dinh vi no `export ITTS_OUT`
nen hai ben cung mot cho; chi nguoi chay tay moi dinh, va dinh trong im lang.
07/08 no lam em doc nham ket qua cua bon bo kiem, tuong da va xong trong khi ban do chua he
duoc dung lai. Nay hai mac dinh KHOP NHAU - muon tro ban o goc repo thi phai noi ro
`ITTS_OUT=<goc>`, va noi ro thi khong con am tham nua.
"""
import os
import re
import sys

SD = os.path.dirname(os.path.abspath(__file__))
OUT = sys.argv[1] if len(sys.argv) > 1 else os.environ.get("ITTS_OUT") or SD

# CHI CON HAI BAN BUILD. Ban V6 da go han 06/08 (anh Luan: "bo v6, ko duoc lam anh huong v5"),
# nguon khong con xuat ITTs_WebApp_v6_demo.html nen khong con _APP6.js de trich.
# GIU LAI BAI HOC vi no van dung cho moi ban build ve sau: hoi 01/08 ban V6 duoc giao trong khi
# 20/21 bo kiem chi soi ban v5 - vi khong ai trich than cua no ra. Anh Luan 01/08: "van de la e
# build v6 da chuan chua ay, chu bat a lam thu trong khi thiet ke luong te hoac loi tum lum
# thi...". Nen: them mot ban build moi thi phai them no vao CAP nay TRUOC, khong thi ca bo kiem
# lang le do mot ban khac voi ban dem giao.
# (Ban V2 khong roi vao bay do: no la mot NHANH GIT rieng - mot nguon, mot the gioi, mot ban
#  build. Xem BAN_GIAO_V2.md muc RB4.)
CAP = [("ITTs_WebApp_v5_demo.html", "_APP.js"),
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
