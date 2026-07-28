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
Bộ kiểm gồm **5 phần, phải xanh HẾT mới được giao**:
| Lệnh | Kỳ vọng |
|---|---|
| `node --check _APP.js` và `node --check _HV.js` | không báo gì |
| `ITTS_OUT=<out> node _tall.js` | `Render 37 trang \| 0 loi` + `thieu trong font: khong` |
| `ITTS_OUT=<out> node _check11.js` | `TONG: 143`, KHÔNG có dòng `FAIL` |
| `ITTS_OUT=<out> node _check12.js` | `CHECK12 OK: 37 tieu chi` - một cửa vào, một luật |
| `ITTS_OUT=<out> node _check13.js` | `CHECK13 OK: 174 tieu chi` - KPI biết nói |
| `ITTS_OUT=<out> node _check14.js` | `CHECK14 OK: 111 tieu chi` - cổng học viên hai chiều |
| `ITTS_OUT=<out> node _check15.js` | `CHECK15 OK: 37 tieu chi` - **kiểm kê cửa ghi + bất biến nghiệp vụ** |
| `ITTS_OUT=<out> node _check16.js` | `CHECK16 OK: 525 tieu chi` - học phí theo đợt + vá V9.27 + bấm-tên-ra-drawer + địa chỉ từng trang |
| `ITTS_OUT=<out> node _checkdata.js` | `CHECKDATA OK: 27 luat ... 0 cho lech` - **dữ liệu demo có khớp ga nghiệp vụ không** |
| `ITTS_OUT=<out> node _check17.js` | `CHECK17 OK: 392 tieu chi` - **bộ máy lọc chuyên sâu** (kết hợp trục, lưu theo người) |
| `ITTS_OUT=<out> node _checktour.js` | `TOUR OK: menu cap do + moi bai chay het buoc, 0 loi` |
| `python3 check_logic.py` | `TONG BAN GHI LOI: 4` (đúng 4 ca là việc quá hạn CỐ Ý để demo cảnh báo đỏ - xem luật 10k) |
| `python3 check_data.py` | `KET QUA: DAT` |

**`_check15.js` sinh ra vì cả hai hội đồng thẩm định đều bỏ lọt cùng một lớp lỗi:** người rà
ĐỌC TỪNG ĐƯỜNG, mà lỗi nguy hiểm nhất nằm ở KHOẢNG GIỮA hai đường - mỗi đường đọc riêng đều hợp
lý, đặt cạnh nhau mới sai (vd `wowAddSave` trừ quota lúc ĐẶT còn `hvWowSave` chỉ trừ khi ĐÃ DẠY).
Nó làm hai việc người đọc không làm được: (1) KIỂM KÊ mọi hàm ghi vào từng bảng và **báo đỏ khi có
cửa ghi MỚI chưa khai** - buộc người viết đối chiếu với các cửa sẵn có; (2) kiểm **BẤT BIẾN nghiệp
vụ** (đúng dù đường nào ghi) bằng cách LÁI THẬT từng cửa rồi soi lại. Thêm hàm ghi mới vào bảng nào
thì khai vào bảng `KHAI` trong `_check15.js`.

**`_check16.js` mục 15 sinh ra vì một lớp lỗi họ hàng, Luân tự bắt được (28/07 khuya):** hàm ghi dữ
liệu KHÔNG tự gọi `persistSoon` mà vẫn "có vẻ chạy", vì đường nào cũng tình cờ đi qua `reRender` ->
`reRenderKeep` (dòng cuối hàm này có `persistSoon`). Đổi trạng thái trên trang danh sách đứng riêng
thì `rlist` ghi thẳng `innerHTML`, không qua `reRenderKeep`, và dữ liệu mất khi tắt trình duyệt.
Nên mục 15 **tắt hẳn `reRender`/`reRenderKeep`/`rlist` rồi mới đếm `persistSoon`** - chỉ lần gọi
THẲNG mới tính. Thêm cửa ghi mới thì thêm một dòng `door(...)` vào đó.

> **LUẬT:** hàm nào ghi vào DATA thì TỰ gọi `persistSoon()`. Không được dựa vào tác dụng phụ của
> hàm vẽ giao diện - hôm nay đúng, mai đổi đường render là mất dữ liệu không ai hay.

**`_checkdata.js` sinh ra vì bộ máy chặng và bộ kiểm dữ liệu ở HAI NGÔN NGỮ KHÁC NHAU.** Chặng được
suy ra trong JS (`jStageOf`); `check_logic.py` viết bằng Python nên không biết ga "Có KQ, chờ tư vấn"
nghĩa là gì, do đó 132 luật của nó vẫn để lọt một khách đứng ở ga đó mà không có điểm test nào.
`_checkdata.js` **nạp chính `_APP.js`, chạy chính `jAll()`** rồi hỏi ngược: người này app bảo đang ở
ga nào, ga đó bắt buộc phải có chứng từ gì. Nên nó không bao giờ lệch khỏi app.

> **ĐỪNG chép luật chặng sang Python lần thứ hai** - chép là hai bản sẽ trôi khỏi nhau, đúng lớp lỗi
> đã sinh ra file này.

Thêm luật mới thì thêm vào `_checkdata.js`, và **luôn lấy tên cột qua `col(bảng, tên)`**: người viết
file này đã từng soi cột `wow_teacher_id` trong khi DL14 dùng `staff_id`, rồi báo cáo 69 lỗi không có
lỗi nào là thật. `col()` bắt cột không tồn tại và báo ngay, thay vì lặng lẽ trả về rỗng.

`check_logic.py` (V9.25: 132 luật) là **bộ kiểm dữ liệu BẮT BUỘC**, chạy sau trọn đường ống
dữ liệu. Đường ống phải chạy ĐÚNG thứ tự, chạy thiếu bước nào là kết quả sai:
```bash
python3 gen_demo.py && python3 seed_giaoan.py && python3 mkdemo.py \
  && python3 fixdata.py && python3 check_data.py && python3 seed_giaoviec.py \
  && python3 check_logic.py
```


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


## BỘ MÁY LỌC CHUYÊN SÂU (V9.28, việc B)

Thêm bộ lọc cho một trang = **thêm ĐÚNG MỘT DÒNG** vào bảng `FLTDEF` trong `gen_v5.py`, không
viết thêm một dòng giao diện nào:

```js
FLTDEF.tenTrang = [
  fxEnum("cot_enum","Nhãn"),                 // chọn nhiều - gom giá trị từ chính dữ liệu
  fxStaff("cot_nhan_su","Người phụ trách"),  // chọn nhiều - hiện tên nhân viên
  fxRef("class_id","Lớp","DL10","class_id","class_name"),   // tra sang bảng khác
  fxDate("cot_thoi_gian","Ngày ..."),        // khoảng thời gian + 8 mốc sẵn
  fxCalc("_khoa","Khóa học", getter, labeler)  // trục TÍNH TOÁN, không phải cột của bảng
];
```

Trang không nằm trong `LISTCFG` thì khai bảng nguồn ở `FLTSRC` (ví dụ `giaoviec: "DL23"`).

- **VÀ giữa các trục · HOẶC trong cùng một trục.** Một lõi duy nhất `fltApply(trang, mảng)`.
- **Không đụng tab.** Tab chọn nhóm, bộ lọc thu hẹp bên trong nhóm đang mở.
- **Lưu theo TỪNG NGƯỜI** trên localStorage khoá `ITTS_FLT_<mã nhân viên>` - thói quen cá nhân,
  không ghi vào `DATA.config`.

> **KHAI TRỤC THÔI CHƯA ĐỦ - nút phải THẬT SỰ lên màn hình.** Bẫy đã cắn ngay trong lượt đầu:
> khai trục cho 16 trang, `_check17` xanh, nhưng **9 trang custom không hề gọi `fltApply`/`fltBarHTML`**
> nên người dùng không bao giờ thấy nút. Bộ kiểm cho cảm giác an toàn giả vì chỉ thử đúng một trang.
> Nay `_check17` **vẽ thật từng trang trong `FLTDEF` rồi soi nút**, và bật thử một điều kiện xem danh
> sách có đổi không. Trang tự dựng thanh công cụ (không dùng `filterBar`) phải nối tay - và nhớ
> `renderXeplop` KHÔNG có biến `p`, viết `fltApply(p,...)` ở đó là tham chiếu biến không tồn tại,
> lọc câm mà không báo lỗi.

> **MỌI trục phải đi qua `fltColOk()`** - trục trỏ vào cột KHÔNG CÓ THẬT thì bị loại và `_check17`
> báo đỏ. Ngay lần đầu chạy, chốt chặn này đã bắt được `DL05.course_status` không tồn tại (bảng
> khóa học dùng `status`). Đây đúng lớp lỗi đã làm hỏng một báo cáo trước đó (`wow_teacher_id`).


## XIN NGHỈ CÓ PHÉP - VÒNG ĐỜI (V9.29, việc C)

`BÁO NGHỈ -> CHỜ DUYỆT -> (Có phép / Không phép) -> tuỳ chọn XẾP BÙ`

Ba hàm lõi, mọi cửa đều đi qua đúng ba hàm này (đã khai vào `KHAI.DL12` của `_check15.js`):

| Hàm | Việc |
|---|---|
| `absReq(sid, sess, lyDo, xinBu)` | Học viên xin nghỉ. Ghi `absence_type = pending_review (Chờ duyệt)`. |
| `absReview(attId, kind, note)` | Học vụ duyệt: `excused` hoặc `unexcused`. **Chuyên cần chỉ chốt ở đây.** |
| `absMakeup(attId, target, note)` | Xếp bù cho MỘT học viên - gắn vào buổi CÓ SẴN, không đẻ buổi mới. |

> **`absMakeup` khác hẳn `bhMakeup`.** `bhMakeup` dùng cho buổi bị hủy **cả lớp** và có tạo bản ghi
> DL11 mới. `absMakeup` là chuyện của **một học viên** - chỉ ghi kế hoạch bù lên chính dòng vắng đó.
> Nhầm hai cái này là đẻ ra buổi học ma.

**Hai bẫy đã cắn khi làm:**
- Hàng đợi duyệt phải nằm **TRÊN** cổng điểm danh. Buổi chưa tới giờ thì `ddHub` return sớm - mà đó
  đúng là lúc giáo viên cần biết nhất để chuẩn bị phần bù.
- `add()` trong `slaItems` nhận **13 tham số VỊ TRÍ** (`cat,grp,sev,ic,who,what,age,page,filter,lead,hoso,act,rid`).
  Truyền một object vào giữa là chuông câm mà không báo lỗi.

**Định nghĩa "vắng không phép" đã được thống nhất.** Trước đây `stuAttStats` viết `!== "excused"`
còn ba chỗ khác dùng `/unexcused/` - thêm trạng thái thứ ba là dòng chờ duyệt bị tính oan ngay.
Nay tất cả đều là `/unexcused/`.

**Đơn xin nghỉ KHÔNG phải điểm danh.** Dòng DL12 của một đơn xin nghỉ tồn tại **trước** buổi học -
đó là điều đúng nghiệp vụ (báo trước để giáo viên chuẩn bị phần bù). Ba luật từng ngầm giả định
"có dòng DL12 = đã điểm danh" và đều phải siết lại khi làm việc (C):
`check_logic 4a/4b` (điểm danh cho buổi tương lai / buổi chưa dạy) và `_checkdata E6`
(số dòng điểm danh vượt số buổi đã dạy). Kèm theo là 4 luật mới canh chính đơn xin nghỉ:
`4a-bis` (thiếu giờ HV báo) · `4a-ter` (chờ duyệt mà không ghi là vắng) ·
`4a-quater` (chưa duyệt mà đã có người/giờ duyệt) · `E7` (dòng cho buổi chưa dạy phải là đơn xin nghỉ).
