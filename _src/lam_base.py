# -*- coding: utf-8 -*-
"""DUNG LAI `demo_base.json` - ban goc DONG BANG ma `gen_demo.py` doc lam giong.

VI SAO CO FILE NAY (10/08): truoc day `gen_demo.py` doc lai `demo_data_big.json` - tuc dau ra
cua CHINH LAN CHAY TRUOC - roi be nguyen nam bang sang. Pipeline vi the khong phai ham cua
(hat giong, ngay chay) ma la ham cua (hat giong, ngay chay, ket qua lan truoc), nen chay hai
lan trong cung mot phut van ra 23 bang khac nhau du ba hat giong deu da cam.

Nay `gen_demo.py` doc `demo_base.json`, mot ban chup DUNG YEN. File ay chi doi khi CO NGUOI
CHU DINH doi - bang cach chay script nay.

Chay:  python3 lam_base.py            # lay tu demo_data_big.json dang co
       python3 lam_base.py <file>     # lay tu mot file khac

CAN THAN: chay script nay la CHOT LAI giong moi. Chi chay khi ban demo hien tai dang o trang
thai anh Luan da xem va thay dung - vi tu do tro di moi lan dung lai deu ra dung no.
"""
import json, os, sys

SD = os.path.dirname(os.path.abspath(__file__))
NGUON = sys.argv[1] if len(sys.argv) > 1 else os.path.join(SD, "demo_data_big.json")
DICH = os.path.join(SD, "demo_base.json")

# Dung NAM bang ma `gen_demo.py` doc tu `old` (grep `odl["..."]`), cong enums + config.
# Them bang vao day thi phai them ca o gen_demo - de lech la base thieu thu gen_demo can.
CAN = ["DL01", "DL02", "DL05", "DL09", "DL10"]

d = json.load(open(NGUON, encoding="utf-8"))
dl = d["dl"] if "dl" in d else d
thieu = [k for k in CAN if k not in dl]
if thieu:
    raise SystemExit("LOI: nguon thieu bang %s - khong dong bang duoc" % ", ".join(thieu))

base = {"dl": {k: dl[k] for k in CAN}, "enums": d.get("enums"), "config": d.get("config")}
json.dump(base, open(DICH, "w", encoding="utf-8"), ensure_ascii=False)
print("DA GHI %s (%d KB) tu %s" % (DICH, os.path.getsize(DICH) // 1024, os.path.basename(NGUON)))
for k in CAN:
    print("   %-6s %d dong" % (k, len(base["dl"][k])))
