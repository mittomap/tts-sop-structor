"""Dung lai font icon Tabler (ban subset) cho dung bo icon ma gen_v5.py dang dung.

VI SAO CO FILE NAY: font icon duoc SUBSET - chi nhung nhung icon app that su dung, de 2 file
HTML khong phinh len hang chuc MB. Hau qua: them mot `ti-*` moi vao gen_v5.py ma quen dung lai
font thi icon do ra O VUONG TRONG tren man hinh - va truoc V9.40 cong thuc dung lai nam trong
mot khoi ```bash``` giua tai lieu README_SRC.md, nguoi nhan ban giao gan nhu chac chan se khong
tim thay. Nay no la mot lenh:

    python3 build_icons.py

Can `pip install fonttools brotli` (pyftsubset). Khong co thi script noi ro va thoat khac 0.
"""
import base64
import os
import re
import shutil
import subprocess
import sys

SD = os.path.dirname(os.path.abspath(__file__))
IB = os.path.join(SD, "iconbuild")

if not shutil.which("pyftsubset"):
    raise SystemExit("KHONG THAY pyftsubset - chay: pip install fonttools brotli --break-system-packages")

css = open(os.path.join(IB, "tabler-icons.css"), encoding="utf-8").read()
MAP = {n: cp.lower() for n, cp in
       re.findall(r'\.ti-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([0-9a-fA-F]+)"', css)}

src = open(os.path.join(SD, "gen_v5.py"), encoding="utf-8").read()
want = (set(re.findall(r'ti ti-([a-z0-9-]+)', src))
        | set(re.findall(r'"ti-([a-z0-9-]+)"', src))
        | set(re.findall(r"'ti-([a-z0-9-]+)'", src)))
used = sorted(u for u in want if u in MAP)
thieu = sorted(u for u in want if u not in MAP)

unis = ",".join("U+%04X" % int(MAP[u], 16) for u in used)
sub = os.path.join(IB, "sub.woff2")
# BO GSUB/GPOS/GDEF - giu lai thi pyftsubset sap tren bo font nay.
subprocess.run(["pyftsubset", os.path.join(IB, "fonts", "tabler-icons.ttf"),
                "--unicodes=" + unis, "--flavor=woff2", "--output-file=" + sub,
                "--no-hinting", "--desubroutinize", "--drop-tables+=GSUB,GPOS,GDEF",
                "--layout-features=", "--no-layout-closure"], check=True)

b = base64.b64encode(open(sub, "rb").read()).decode()
out = ("@font-face{font-family:'tabler-icons';font-style:normal;font-weight:400;"
       "src:url(data:font/woff2;base64," + b + ") format('woff2')}\n")
out += (".ti{font-family:'tabler-icons'!important;font-style:normal;font-weight:400;"
        "font-variant:normal;text-transform:none;line-height:1;-webkit-font-smoothing:antialiased;"
        "-moz-osx-font-smoothing:grayscale;display:inline-block}\n")
out += "\n".join('.ti-%s:before{content:"\\%s"}' % (u, MAP[u]) for u in used) + "\n"
open(os.path.join(SD, "tabler_inline.css"), "w", encoding="utf-8").write(out)

print("WROTE tabler_inline.css - %d icon (%d bytes woff2)" % (len(used), os.path.getsize(sub)))
if thieu:
    print("KHONG CO TRONG BO TABLER (go sai ten?): " + ", ".join(thieu))
    sys.exit(1)
