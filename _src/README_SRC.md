# _src — MÃ NGUỒN WEB APP (bản tái tạo được)

Thư mục scratchpad (outputs) **bị xoá giữa các phiên**, nên toàn bộ nguồn web app được cất ở đây trong
thư mục BỀN. Phiên mới muốn sửa/tái tạo web app thì **copy `_src/*` ra thư mục làm việc rồi chạy**.

## Web app là gì
Một generator Python duy nhất `gen_v5.py` chứa template HTML khổng lồ + toàn bộ JS trong chuỗi.
Nó nhét `demo_data_big.json` vào chỗ `__DATA_JSON__`, nhúng font icon offline từ `tabler_inline.css`,
rồi xuất **3 file**:
- `ITTs_WebApp_v5_demo.html` — app nhân viên (boot `demoBoot()` → màn cổng chọn người).
- `ITTs_TrangHocVien_demo.html` — cổng học viên (boot `demoBootHV()`, `window.HVPORTAL`).
- `ITTs_data.js` — dữ liệu demo tách riêng (`window.ITTS_DATA`); app ƯU TIÊN file này, thiếu thì dùng bản nhúng. V9.7: thao tác offline lưu localStorage + đồng bộ đa cửa sổ + reset (xem 02 mục 3sexies).
Hai file DÙNG CHUNG CSS/JS — không bao giờ tách đôi logic; chỉ khác câu lệnh boot.

## File trong _src
| File | Vai trò |
|---|---|
| `gen_v5.py` | **NGUỒN DUY NHẤT** của web app (HTML+CSS+JS). Sửa ở đây rồi build. |
| `demo_data_big.json` | Dữ liệu demo (DL01-DL22, CH1-CH6, enum). Sinh bởi pipeline bên dưới. |
| `tabler_inline.css` | Font icon Tabler đã subset + base64 (offline). |
| `gen_demo.py` → `seed_giaoan.py` → `mkdemo.py` → `fixdata.py` → `check_data.py` → `seed_giaoviec.py` | Pipeline sinh & vá & kiểm dữ liệu demo (chạy theo đúng thứ tự này). |
| `seed_giaoviec.py` | **V9.20** - sinh `DL23` (giao việc) + `DL24` (trao đổi trong việc) theo quan hệ tổ chức thật trong DL01; mốc thời gian neo theo NGÀY CHẠY nên demo mở hôm nào cũng "sống". Chạy lại được nhiều lần (ghi đè 2 bảng đó). |
| `_tall.js` | Harness Node: render toàn bộ trang + soi lệch `<div>` + soi icon thiếu. |
| `_check1..11.js` | Suite kiểm 366 điểm (chạy `ITTS_OUT=<out> node _checkN.js` sau khi trích `_APP.js`). `_check11` = chặng vòng đời + NAVTREE + node + sopBlock. |
| `iconbuild/` | Nguồn dựng lại font: `tabler-icons.css` (map tên→mã), `fonts/tabler-icons.ttf`, `used.txt`, `uni.txt`, `sub.woff2`. |

## BUILD (chạy ở phiên mới)
Đường dẫn input đọc **cạnh script**; output ghi vào **`$ITTS_OUT`** (mặc định = cạnh script).
```bash
# 1) copy nguồn ra thư mục làm việc (thay <OUT> = đường mnt của outputs phiên này)
cp -r "<mnt>/SOP ITTs/_src/." <WORK>/ && cd <WORK>
# 2) build, ghi thẳng 2 HTML vào thư mục BỀN "SOP ITTs"
ITTS_OUT="<mnt>/SOP ITTs" python3 gen_v5.py
```

## VERIFY (bắt buộc sau mỗi build)
```bash
# trích script lớn nhất -> _APP.js, kiểm cú pháp
python3 - <<'PY'
import re; html=open("<mnt>/SOP ITTs/ITTs_WebApp_v5_demo.html",encoding="utf-8").read()
open("_APP.js","w",encoding="utf-8").write(max(re.findall(r"<script>(.*?)</script>",html,re.S),key=len))
PY
node --check _APP.js
ITTS_OUT="<mnt>/SOP ITTs" node _tall.js   # kỳ vọng: "Render 36 trang | 0 loi" + "thieu trong font: khong" (V9.6)
```
Cổng học viên: lặp lại `node --check` với script lớn nhất của `ITTs_TrangHocVien_demo.html`.

## DỰNG LẠI FONT ICON (khi thêm icon `ti-*` mới)
Harness báo `thieu trong font: ti-xxx` = phải dựng lại **CẢ HAI** phần trong `tabler_inline.css`:
(1) payload woff2 base64 VÀ (2) rule `.ti-xxx:before{content}`. Công thức:
```bash
pip install fonttools brotli --break-system-packages   # nếu chưa có
python3 - <<'PY'
import re,base64,subprocess,os
SD="."  # thư mục _src đã copy
css=open(SD+"/iconbuild/tabler-icons.css",encoding="utf-8").read()
m={n:cp.lower() for n,cp in re.findall(r'\.ti-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([0-9a-fA-F]+)"',css)}
src=open(SD+"/gen_v5.py",encoding="utf-8").read()
used=sorted(set(re.findall(r'ti ti-([a-z0-9-]+)',src))|set(re.findall(r'"ti-([a-z0-9-]+)"',src))|set(re.findall(r"'ti-([a-z0-9-]+)'",src)))
used=[u for u in used if u in m]; unis=",".join("U+%04X"%int(m[u],16) for u in used)
subprocess.run(["pyftsubset",SD+"/iconbuild/fonts/tabler-icons.ttf","--unicodes="+unis,"--flavor=woff2",
 "--output-file="+SD+"/iconbuild/sub.woff2","--no-hinting","--desubroutinize",
 "--drop-tables+=GSUB,GPOS,GDEF","--layout-features=","--no-layout-closure"],check=True)  # BỎ GSUB nếu không sẽ sập
b=base64.b64encode(open(SD+"/iconbuild/sub.woff2","rb").read()).decode()
out="@font-face{font-family:'tabler-icons';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,"+b+") format('woff2')}\n"
out+=".ti{font-family:'tabler-icons'!important;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:inline-block}\n"
out+="\n".join('.ti-%s:before{content:"\\%s"}'%(u,m[u]) for u in used)+"\n"
open(SD+"/tabler_inline.css","w",encoding="utf-8").write(out); print("icons:",len(used))
PY
```
(node_modules @tabler đầy đủ ~179MB KHÔNG cất ở đây; nếu cần bản gốc: `cd iconbuild && npm i @tabler/icons-webfont@2.47.0`.)

## LUẬT KIẾN TRÚC WEB APP (đừng phá — chi tiết ở 02_NHAT_KY_QUYET_DINH.md)
- Mẫu HUB có tab: 1 trang custom + biến TAB + `segHTML(...,"xTabSet('{k}')")`; thân tab GỌI render con với cờ `embed` (bỏ pageHead). KHÔNG đẻ trang mới.
- Đường ống nhúng: `filterBar`/`rlist`/`pageGo` re-render theo **CUR**; `go()` có bảng map (TSMAP/CSMAP/HTMAP) đổi trang con → hub+tab.
- Icon: quét cả `ti ti-X` lẫn `"ti-X"`; thêm icon = dựng lại font.
- Verify từng bước bằng harness, không tin script chạy đúng.
- V9.7: mốc cắt lắp ráp file HV là chuỗi `'<script src="ITTs_data.js"></script>'` và boot `if(!SVR){demoBoot()}` — sửa vùng đó phải giữ nguyên 2 chuỗi.
