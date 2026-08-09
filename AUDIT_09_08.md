# AUDIT V2 - 09/08/2026 (bản dựng 2d12de)

Chạy trọn `GIAO_THUC_AUDIT.md` - chín mảng: năm mảng anh Luân đặt cộng bốn mảng bổ sung.
Phần máy đo được nằm trong `./verify.sh` (40 bộ kiểm). Phần máy KHÔNG làm thay được - nhìn màn
bằng mắt, đóng vai từng người, đọc chữ trong ngăn kéo - em làm tay và ghi lại ở đây.

---

## BẢNG KẾT QUẢ

| # | Mảng | Kết quả | Ghi chú |
|---|---|---|---|
| 1 | Giao diện | **XANH** (máy) · **có 1 chỗ sửa** (mắt) | dải thẻ trên Trang bắt đầu không có nhãn - đã vá |
| 2 | Nghiệp vụ | **XANH** · **có 1 lỗ LUẬT SỐ 0** (mắt) | 13/13 HV nguy cơ bị màn hình bảo "không cần làm gì thêm" - đã vá |
| 3 | Chức năng | **XANH** | `_checkbam` · `_checknv` · `_checknguoi` · `_check12` · `_check17` |
| 4 | Dữ liệu demo + Reset demo | **XANH** | `_checkreset` bấm thật nút Dựng lại, 15 tiêu chí |
| 5 | Ngữ cảnh | **có 2 chỗ sửa** | tiêu đề ngăn kéo lộ `&amp;` · câu việc SOP nói ngược - cả hai đã vá |
| 6 | Phạm vi dữ liệu & rò rỉ | **CÓ HAI LỖ THẬT** | ô chọn giảng viên · ô chọn "Từ NV" ở Bàn giao lead - đã vá + dựng thước |
| 7 | Nhất quán ba cổng | **XANH** | `_check14` 215 tiêu chí |
| 8 | Tài liệu | **XANH** sau phiên này | đã cập nhật 02 + README_SRC + file này |
| 9 | Chưa đo được | **khai thẳng ở cuối** | |

**Sáu chỗ sửa trong đợt audit này, không chỗ nào do bộ kiểm báo - tất cả do NGỒI NHÌN MÀN HÌNH.**
Đó là câu đáng nhớ nhất của đợt: 40 bộ kiểm xanh hết, mà mở app ra đọc như người dùng lần đầu
thì vẫn còn sáu chỗ sai, trong đó hai chỗ là rò rỉ phạm vi dữ liệu thật.

---

## 1. GIAO DIỆN

**Máy:** `_checkui` mở thật 1136 lượt (5 khổ màn × mọi trang × 3 cổng) - không cuộn ngang, không
cắt chữ, không nút bị phủ. `_checkmat` đo 1323 chuỗi chữ bằng thước thật. `_checkdrawer` mở 28
ngăn kéo trên 15 trang. `_checkux` giữ bảng màu / cỡ chữ / bo góc trong thang.

**Mắt (chụp màn 6 chức danh ở khổ 1440×900, tỷ lệ 90%):**

- Trang bắt đầu của NV Tư vấn: lời chào, 8 việc / 5 quá hạn, hẹn kế, dải "Cần chú ý" 8 ô bấm
  được, KPI của tôi, nhịp ngày ba buổi. Nhịp đọc hợp lý, không phải cuộn mới thấy việc.
- **CHỖ SAI TÌM RA:** giữa panel "KPI của tôi" và panel "Nhịp ngày của bạn" có một dải thẻ trơ
  một hàng số với nút "Thẻ (1/1)" lơ lửng, **không câu nào nói đây là số của cái gì**. Trang bắt
  đầu là trang DUY NHẤT không gọi `pageHead`, nên nó cũng là trang duy nhất mất câu ngữ cảnh mà
  mọi trang khác được `pageHead` phát cho.
  → Vá: thêm khai `ttl` trong `THEDEF`, nhãn đứng bên trái đúng hàng nút "Thẻ (n/N)" đã có sẵn -
  không dựng thêm khối nào. Trang bắt đầu nay ghi **"HÀNG CHỜ TRÊN HÀNH TRÌNH KHÁCH"**.
  Chỉ trang nào khai mới có nhãn; trang có `pageHead` mà thêm nhãn là nói hai lần.

## 2. NGHIỆP VỤ

`check_sop.py` **ĐẠT** trên cả bốn mặt: 357 cột DL · 93 tình huống sổ trigger HD3 · 51 chỉ số
BC2 · 31 hành động CH3, cộng 12 màn VH và 9 bảng BC.

**LỖ LUẬT SỐ 0 TÌM RA KHI ĐỌC NGĂN KÉO 360 CỦA HV061:**

Trên **một** màn hình có ba câu cãi nhau:
- đầu ngăn kéo: chip **"Nguy cơ"**, kèm *"VÌ SAO GẮN CỜ: Học thuật - máy thấy vượt ngưỡng, thiếu
  3 bài (ngưỡng 3)"*
- cuối ngăn kéo: *"Việc cần làm theo SOP · **NA018**: HV đang học đều và ổn định. **Không cần làm
  gì thêm.**"*

Gốc: `jNaCode` chọn câu việc **theo CHẶNG** (`JNA.learning=["NA018",""]`) - nó không hỏi hồ sơ này
có đang bị gắn cờ nguy cơ không. Trong khi `naFor("DL09",S)` - hàm mà `check_sop.py` chạy thật
trên 93 tình huống HD3 - trả đúng NA015 / NA016 / NA017 / NA064 / NA065.

**Đo được: 13/13 học viên đang học mà có nguy cơ đều bị màn hình bảo "không cần làm gì thêm".**

Đây đúng cái LUẬT SỐ 0 cấm: SOP mô tả năm mức can thiệp, app **tính được cả năm**, nhưng chỗ
người ta thật sự đọc lại in câu mặc định của chặng. App biết mà không nói ra thì cũng bằng không
biết - tệ hơn, nó còn **trấn an nhầm**.

→ Vá ở đúng một chỗ: `jInfo` là cửa duy nhất mọi màn hành trình (thẻ chặng, hồ sơ 360, Chạy quy
trình, chuông) lấy `na`/`naMsg`. Sửa một chỗ là mười mấy màn cùng đúng. Chỉ đè khi hồ sơ là học
viên và đang có cờ nguy cơ. Đo lại: **13 → 0**. HV061 nay đọc là *"NA065: HV thiếu bài tập từ 3
lần trở lên. Việc cần làm: đánh dấu nguy cơ học thuật, can thiệp ngay"* - khớp với cờ ngay trên,
và nút "Xử lý nguy cơ (đẩy vào quy trình)" nằm ngay dưới.

## 3. CHỨC NĂNG

Xanh hết. `_checkbam` bấm thật và soi cả nội dung mở ra · `_checknv` đi trọn việc từ bấm Làm tới
nhật ký DL25 · `_checknguoi` 33 người × 16 chức danh · `_check12` một cửa vào · `_check17` bộ máy
lọc 413 tiêu chí · `_checkneo` + `_checktour` 93 bước hướng dẫn trỏ đúng chỗ.

Kiểm tay: đóng vai Giáo viên ACA (NV005), NV Tư vấn Cơ sở 3 (NV022), Trưởng phòng Tư vấn (NV012),
Trưởng phòng Học vụ (NV013), Giám đốc (NV009). Mỗi người vào đúng trang đáp của mình, menu đúng
độ dài của họ, **16/16 chức danh có nhịp ngày trên trang đáp và đều nằm trên màn - không ai phải
cuộn mới thấy việc hôm nay**.

## 4. DỮ LIỆU DEMO - VÀ NÚT RESET DEMO

`_checkreset` **bấm thật** nút Dựng lại demo rồi kiểm lại từ đầu, 15 tiêu chí ĐẠT:
- mọi chức danh mở app đều có việc của mình
- có việc gấp và việc quá hạn để thấy cảnh báo màu (không ra bộ dữ liệu chết)
- tuần này có buổi học - ngày tháng đã kéo về hiện tại
- **cấu hình KHÔNG bị cuốn theo**: ngưỡng, câu nhắc, thương hiệu, phân quyền giữ nguyên
- thói quen riêng (tỷ lệ hiển thị, ảnh đại diện, góp ý) không bị xoá
- cả ba cổng mở ra đều có nội dung, không lỗi JS

`check_data.py` ĐẠT · `check_logic.py` ĐẠT · `_checkdata` 27 luật / 6977 lượt, 0 chỗ lệch ·
`_checkdemo` 7 thứ × 9 chức danh, không thứ nào mở app ra thấy bảng trống.

## 5. NGỮ CẢNH

**5a. Câu chữ trên app - CHỖ SAI TÌM RA:**

Tiêu đề ngăn kéo Bộ lọc hiện **`Tư vấn &amp; Đăng ký sau test`** - thực thể HTML sống trên màn.
Gốc: `openDrawer` đặt tiêu đề bằng `textContent`, mà chỗ gọi lại `esc()` trước khi truyền vào -
escape **hai lần**. 16 trang có dấu "&" trong tên đều dính.

Vì sao không bộ kiểm nào thấy: cả `_checkbam` lẫn `_checkmat` chỉ soi **thân** ngăn kéo và thân
trang - tiêu đề ngăn kéo là một vùng **không ai đo**.

→ Vá app: bỏ `esc()` (textContent đã là tầng an toàn). Đo lại 16 trang: **0 chỗ lộ thực thể**.
→ Dựng hai thước để nó không quay lại:
  - `_checkbam` nay hỏi **cả tiêu đề lẫn thân**, và thêm thực thể HTML vào danh sách chữ máy
    (`undefined` / `NaN` / `[object Object]` / `&amp;` `&lt;` `&gt;` `&quot;` `&nbsp;` `&#nn;`)
  - `_checkmat` quét chữ **người đọc thấy** (`textContent`) trên 15 trang tìm thực thể còn sống.
    Phải hỏi ở tầng `textContent`, không hỏi ở `innerHTML`: trong mã nguồn `&amp;` là cách viết
    **đúng** của một dấu "&", không phân biệt được.

**5b. Ngăn kéo thông tin - đọc tay như người dùng lần đầu:**

Mở thật bằng cửa của app (`openStuQuick`, `openLopQuick`, `openHosoKhoa`):

- **Học viên 360 (HV061)** - 873 ký tự, 4 nút, 0 chữ máy. Nói được: SĐT, cơ sở, khóa-lớp, công nợ,
  chuyên cần 93% (13/14 buổi), người đồng hành + đầu mối liên hệ + ai đóng tiền, **vì sao gắn cờ
  nguy cơ**, chặng đang đứng, hạn, người phụ trách, việc cần làm theo SOP. Có ba nút đi tiếp -
  không ngõ cụt. Sau bản vá mục 2 thì đọc trôi, không còn câu nào cãi nhau.
- **Lớp** - 284 ký tự, 3 nút. Gọn nhưng đủ quyết: sĩ số 10/14, tiến độ 8/14 buổi, **8 buổi chưa
  nhận xét**, hai nút đi tiếp.
- **Khóa học** - 221 ký tự, 2 nút. Học phí, số buổi, quota WOW, 3 lớp / 5 đăng ký.

Không ngăn kéo nào lọt `undefined` / `NaN` / `[object Object]` / thực thể HTML.

**5c. Ghi chú và nhật ký:** `_check15` kiểm kê cửa ghi 43 tiêu chí ĐẠT · `_checkux` 211 tiêu chí,
**92 form ghi đều có lời giải thích, không ô nào để trống nghĩa**.

## 6. PHẠM VI DỮ LIỆU & RÒ RỈ - **HAI LỖ THẬT**

Đây là mảng hỏng im lặng nhất, và đúng lần này nó cắn hai phát.

**Lỗ 1 - ô "Của giảng viên" trên trang Buổi hôm nay.**
Đóng vai NV005 (Giáo viên ACA, không phải quản lý): trang bày ra ô chọn **14 giảng viên**, bấm
sang ai cũng thấy đủ số buổi dạy, bài chờ chấm, buổi nợ nhận xét của người đó. Ô này dựng thẳng
`rows("DL01")` lọc theo vai, **không hỏi phạm vi lấy một câu**.
→ Vá: không phải quản lý thì **không vẽ ô chọn**, `gid` ghim vào chính họ. Quản lý thì danh sách
thu về đúng đội qua `myTeam()`.

**Lỗ 2 - ô "Từ NV" trên trang Bàn giao lead. Nặng hơn.**
Nhân viên tư vấn thường chọn "Từ NV" là đồng nghiệp bất kỳ ở cả 5 cơ sở, rồi **đọc trọn sổ lead
của người đó** - dải số "Lead NV này đang ôm", danh sách lead đầy đủ kèm tên, số điện thoại,
trạng thái. Trong khi mọi bảng khác của họ đều đã cắt đúng theo cơ sở.
→ Vá theo luật: bàn giao lead **của mình** thì ai cũng làm được (nghỉ phép, quá tải); chuyển lead
**giữa hai người khác** là việc của quản lý. Nhân viên thường nay đọc: *"TỪ NV · NV022 - Nguyễn
Huỳnh Thanh Phương · bạn chỉ bàn giao được lead của chính mình"*, không còn ô chọn.
Ô "Sang NV" giữ nguyên cả danh sách - đó là người **nhận**, cho đi thì không đọc được gì của họ.

**Bẫy trong lúc vá:** thoạt đầu em dùng `myTeam()` cho cả người thường. Đo ra sai: `myTeam()` gom
cả "cùng phòng, cấp thấp hơn". Hàm ấy sinh ra để trả lời *"đội của một quản lý gồm ai"*; hỏi nó
thay cho câu *"tôi được xem sổ của ai"* là mượn một câu trả lời gần đúng - mà gần đúng trong phân
quyền là **sai**.

**Thước mới, để lớp lỗi này không quay lại:** `_checknguoi` đã đi qua từng người × từng trang trên
menu của họ, nên gắn phép hỏi vào đó: *người không phải quản lý mà màn hình bày ô chọn mang mã
nhân viên của người khác thì đỏ*. Chỉ soi ô **đổi màn nhìn** (có `onchange` vẽ lại trang), không
soi ô nhập của cửa ghi (`id="bgDest"` là người NHẬN - bản đầu gộp cả hai nên tố oan đúng cái nút
mà nghiệp vụ bàn giao không thể thiếu). Ngoại lệ khai kèm lý do đọc được: `ketqua` (ba ô lọc dựng
từ chính danh sách kết quả người ấy đang mở).

**Vì sao 40 bộ kiểm cũ không thấy:** `_checknguoi` vốn so **số dòng** danh sách giữa những người
cùng chức danh - mà ô chọn không làm đổi số dòng nào cả, nó chỉ **mở một cánh cửa**. Phạm vi dữ
liệu không chỉ là *"tôi thấy bao nhiêu dòng"*, nó còn là *"tôi đổi được sang nhìn ai"*.

## 7. NHẤT QUÁN GIỮA BA CỔNG

`_check14` cổng học viên 215 tiêu chí ĐẠT · `_checkui` mở thật cả ba cổng · `_checkchuoi` 31 mắt
xích trên 6 chuỗi phối hợp nhiều người, không chuỗi nào đứt giữa chừng · `_checkdem` 105 tiêu chí
trên 26 lớp: mọi con số trên thẻ đều tìm được dấu vết ở danh sách ngay dưới.

## 8. TÀI LIỆU

- `02_NHAT_KY_QUYET_DINH.md`: đã thêm mục 09/08 + sửa ⭐ HIỆN TRẠNG + VIỆC TỒN.
- `_src/README_SRC.md`: `_checkaudit` canh việc mọi bộ kiểm đều được nhắc - xanh.
- File này (`AUDIT_09_08.md`) là biên bản đợt audit.

## 9. NHỮNG THỨ MÁY KHÔNG ĐO ĐƯỢC - KHAI THẲNG

**Chỗ chưa có bộ kiểm nào đi qua:**
- Tiêu đề ngăn kéo: **trước hôm nay không có**. Nay `_checkbam` + `_checkmat` cùng canh.
- Câu việc SOP in trên thẻ hành trình: `check_sop.py` canh **hàm** `naFor`, không canh **màn hình
  in ra câu nào**. Bản vá hôm nay nối hai thứ lại, nhưng chưa có thước riêng canh "màn hình có in
  đúng câu mà `naFor` trả về không" - đây là VIỆC TỒN.
- Ô chọn người: nay có, nhưng chỉ soi trang trên **menu** của người ấy; trang vào bằng đường khác
  (ngăn kéo, hub) chưa soi.

**Chỗ bộ kiểm có đi qua nhưng chỉ đo được vế dễ:**
- `_checkui` đo tương phản ngưỡng 2.5 - đo được "chữ không chìm", không đo được "dễ đọc". Câu mô tả
  dưới lời chào ở Trang bắt đầu (chữ xanh nhạt trên nền xanh đậm) qua ngưỡng nhưng nhìn vẫn nhạt.
- `_checkbam` đòi ngăn kéo ≥120 ký tự - đo được "không rỗng", không đo được "nói đủ".
- `_checkdemo` hỏi "có việc để làm", không hỏi "việc ấy có đáng làm".

**Chỗ phải người thật dùng mới biết:**
- Nhịp làm việc: mở app buổi sáng, mắt rơi vào đâu trước.
- Câu chữ có tự nhiên với người Việt đi làm ở trung tâm không.
- Số buổi dạy / số lead một người ôm có giống thật không.

**Giới hạn còn tồn của bản demo:** không backend · dữ liệu nằm trong localStorage từng máy · phân
quyền thi hành ở trình duyệt (đúng cho demo, ngoài đời phải chặn ở máy chủ) · dữ liệu là dữ liệu
mẫu.


---

# VÒNG HAI - 09/08 (chiều tối), bản dựng `fe8454`

Anh Luân: *"Triển đến khi hoàn hảo"*. Vòng một đã cho một bài học rất đắt: **40 bộ kiểm xanh hết
mà ngồi nhìn màn hình vẫn ra sáu lỗi**. Nên vòng hai làm đúng theo bài học ấy: soi rộng hơn bằng
mắt (16 trang nghiệp vụ + cổng học viên + cổng phụ huynh + ngăn kéo mở bằng cửa thật), và mỗi lỗi
tìm ra thì **dựng ngay một cái thước** để nó không quay lại.

## Bảy lỗi thật của vòng hai - không lỗi nào do bộ kiểm báo

| # | Lỗi | Quy mô đo được | Vá ở đâu |
|---|---|---|---|
| 1 | **Hai cột chết từ V9.42**: "Vắng (buổi)" và "Thiếu bài" của bảng Học viên in dấu `-` | **10/20 dòng đầu** ghi `-` trong khi máy đếm 1-3 bài thiếu | `cell()` thiếu `calcso` ở câu điều kiện |
| 2 | **Cổng phụ huynh xưng hô hai kiểu trên một màn**: nội dung "Khóa của ông", menu "Khóa của bạn" | **7 chỗ** trong menu + thanh trên + dòng tiêu đề | ba cửa ghi `innerHTML` đi vòng qua `hvXungLoc` |
| 3 | **Số tiền bị bẻ đôi giữa hai chữ số**: `10.660.0` xuống dòng `00đ` | 1 ô, trang Bảng công | `.bstat.w2` - thẻ số dài chiếm hai cột |
| 4 | **Hai ô chọn bị bóp, cắt mất đuôi** tên lớp và tên bài | cần 392px, chỉ có 261px | `.fbbr` - nhóm nút xuống hàng riêng |
| 5 | **Ô lọc mất nhãn**: hai ô cạnh nhau đều chỉ ghi "Gõ để tìm trong N lựa chọn" | mọi ô chọn dài trong app | `pkNhac` giữ lại nhãn: "Mọi lớp · gõ để tìm (26)" |
| 6 | **Câu giục việc đã làm xong**: thẻ "Xong" mà vẫn ghi "cần xác nhận... rồi báo lại học viên" | **39/46 buổi** học viên tự đặt | tách câu SỰ THẬT khỏi câu VIỆC |
| 7 | **Buổi WOW đã huỷ đeo chip "Đang xử lý"** | 3 buổi | thêm nhánh `cancelled`, huỷ thắng mọi nhánh |

Lỗi số 1 đáng sợ nhất: **tính năng ấy được viết ra đúng, rồi chết ngay ở cửa vào và sống chết
lặng lẽ gần một tuần** - vì bảng vẫn vẽ ra bình thường, chỉ có một dấu gạch trông rất hợp lệ ở
chỗ đáng lẽ là con số. Chính ghi chú V9.42 đã viết: *"không có ba con số này thì cờ nguy cơ chỉ
là một cái nhãn"*. Cái chết lặng lẽ nhất của một tính năng là **nó vẫn vẽ ra được**.

## Năm thước mới - không thêm bộ kiểm nào, chỉ hỏi thêm câu ở bộ đã có

- **M9 (`_checkaudit`) - ba câu cãi nhau trên một màn.** Mọi hồ sơ có cờ nguy cơ, mã việc SOP mà
  màn hình in ra phải khớp mã `naFor` tính được. Đây là phép hỏi bắt được lỗ NA018 của vòng một.
- **M9b (`_checkaudit`) - câu ra lệnh còn sống trên hồ sơ đã xong.** Thẻ WOW đã qua nấc chờ thì
  không được còn câu giục; buổi đã huỷ phải nói là đã huỷ.
- **M10 (`_checkaudit`) - ô chọn mở cửa.** Đọc mã nguồn tìm mọi ô chọn ĐỔI MÀN NHÌN dựng danh
  sách người từ DL01 mà không đi qua câu hỏi phạm vi.
- **M11 (`_checkaudit`) - kiểu ô khai ra mà bộ vẽ ô không biết.** Mọi kiểu ô khai trong bảng đều
  phải có tên trong thân `cell()`; và cột tính ra số > 0 thì không được in dấu gạch.
- **`_checkmat` +5 trang, +2 phép đo**: thực thể HTML lộ ra màn · con số bị bẻ đôi giữa hai chữ số.
- **`_check14` đo CẢ MÀN** cổng phụ huynh (menu + thanh trên + dòng tiêu đề), không chỉ thân trang.

## Ba bẫy của chính người đo, trong vòng này

1. **`_checkmat` xanh một cách vô nghĩa.** Vừa dựng xong phép đo "số bị bẻ đôi" thì nó báo xanh
   ngay - vì `bangcong`, trang DUY NHẤT có lỗi ấy, **không nằm trong danh sách 15 trang** nó đi
   qua. Đúng cái bẫy ghi sẵn ở đầu chính file đó. Thêm 5 trang thì nó bắt ngay 2 lỗi khác chưa ai
   từng đo.
2. **M10 bản đầu cắt "thân hàm" bằng cách tách chuỗi**, nên "thân" của `renderWow` dài 33.691 ký
   tự và ôm luôn chục hàm khác - tố oan hai chỗ. Nay cắt bằng đếm ngoặc.
3. **M11 bản đầu tìm chuỗi trong cả chú thích**, nên một cái tên chỉ được NHẮC TỚI trong ghi chú
   cũng làm nó xanh - kể cả ghi chú do chính mình vừa viết ra để giải thích bản vá. Nay bóc chú
   thích trước khi hỏi.

**Cả ba đều là một bài học:** *thước đo sai thì đèn xanh còn nguy hiểm hơn đèn đỏ, vì đèn đỏ thì
người ta đi tìm, còn đèn xanh thì người ta đi ngủ.*

## Vẫn khai thẳng: những gì vòng hai chưa chạm tới

- **Chưa có thước cho "màn hình in đúng câu `naFor` trả về" ở diện rộng.** M9 chỉ hỏi hồ sơ có cờ
  nguy cơ; các nhánh khác của `jNaCode` vẫn chưa được đối chiếu.
- **M10 chỉ đọc mã nguồn** - nó thấy chỗ nào KHÔNG hỏi phạm vi, nhưng không chứng minh được chỗ
  có hỏi thì hỏi ĐÚNG.
- **Ngăn kéo mới đọc tay 3 cái** (Học viên 360, Lớp, Khóa học); còn ngăn kéo của Lead, Buổi học,
  Đăng ký, Nhân viên chưa mở bằng cửa thật để đọc chữ.
- **Chưa soi khổ màn hẹp bằng mắt** - `_checkui` đo 5 khổ bằng máy, nhưng "nhịp đọc trên điện
  thoại" thì máy không nói được.
- **Bảy cửa mở form không có ai gọi** (`openDangky` `openTest` `openTuvan` `openThu` `openWowFor`
  `openXeplopFor` `openKetthucFor`). Đã kiểm: **không phải cửa thiếu** - mỗi form ấy đều còn một
  lối vào SỐNG khác (nút "Ghi nhận khoản thu", "Đặt buổi WOW", hành động trên dòng...), nên đây là
  bảy hàm bọc thừa còn sót lại của một bản giao diện cũ, không phải nghiệp vụ mất cửa. **Cố ý
  KHÔNG xoá trong đợt này**: LUẬT SỐ 0 nói thêm thì được bớt thì không, và xoá bảy hàm ngay trước
  một lượt đẩy là đổi một rủi ro thật lấy một cái gọn mắt. Ghi vào VIỆC TỒN để rà lại tử tế.
  (Có một chi tiết đáng nhớ khi rà: `openDangky` nhận **lead_id** chứ không phải mã đăng ký - gọi
  nhầm là nó ném lỗi ngay. Một hàm chết mà còn cạm bẫy thì càng nên dọn, chỉ là dọn đúng lúc.)


---

# VÒNG BA - 09/08 (tối), bản dựng `d69a67`

Anh Luân hỏi *"Hoàn hảo chưa e"*. Em trả lời **chưa**, và lý do em nói vậy là một con số: vòng
một ra 6 lỗi, vòng hai ra 7 lỗi - **tốc độ tìm ra lỗi không giảm**. Nếu đã gần hoàn hảo thì vòng
sau phải ra ít hơn hẳn vòng trước.

Vòng ba nhắm thẳng vào chỗ em đã tự khai là chưa chạm tới: **khổ màn điện thoại**, vì hai vòng
trước đã chứng minh một điều - *chỗ nào chưa ai nhìn, chỗ đó có lỗi*.

## Cái tìm ra lớn nhất không phải một lỗi giao diện, mà là MỘT PHÉP ĐO ĐẶT SAI CHỖ

`_checkmat` có sẵn phép đo **M4 "dấu ngăn mồ côi"** - dựng ra từ chính một lỗi anh Luân bắt được
04/08 (breadcrumb rớt dòng để lại dấu "›" treo). Nó xanh suốt từ đó tới nay.

Nhưng bộ ấy **cố ý chỉ đo một khổ màn 1440px cho rẻ**. Mà "dấu ngăn mồ côi" là **lỗi DO XUỐNG
DÒNG** - chữ chỉ xuống dòng khi khung hẹp.

> **Đo một lỗi-do-xuống-dòng ở khổ màn RỘNG NHẤT là đo đúng cái trường hợp nó không thể xảy ra.**

Mở app ở khổ 390px thì thấy ngay: dòng chào đọc thành *"72 việc cần xử lý · 54 quá hạn ·"* -
một dấu chấm giữa **treo lơ lửng cuối dòng**, vì mục thứ ba rớt xuống dòng dưới còn dấu ngăn của
nó ở lại. Đúng cái M4 sinh ra để bắt, và M4 chưa bao giờ nhìn một màn hẹp.

**Vá gốc:** `_checkmat` nay đo **HAI khổ màn** (máy tính 1440 + điện thoại 390). Ngay lượt chạy
đầu tiên sau khi thêm khổ, nó bắt được **năm chỗ nữa** chưa ai từng đo.

## Bốn lỗi thật của vòng ba

| # | Lỗi | Vá |
|---|---|---|
| 1 | Dấu "·" treo cuối dòng ở dòng chào (khổ ≤560px) | bọc dấu ngăn cùng mục sau nó (`.bwit`), rồi **ẩn hẳn dấu ngăn dưới 560px** - xuống dòng rồi thì chính cái xuống dòng đã ngăn hộ |
| 2 | Nhãn ô chọn "Toàn hệ thống (chính tôi) · gõ để tìm (33)" cần 264px mà ô chỉ có 235px | nhãn dài hơn 16 ký tự thì bỏ phần "gõ để tìm" - **nhãn là thứ PHẢI đọc, lời mời gõ thì thiếu vẫn gõ được** |
| 3 | Trần ngoại lệ nút Trợ lý (6) không còn đúng khi đo hai khổ màn | nới lên 12 kèm lý do: cùng một cái nút, soi trên hai khổ thì số chỗ nó tình cờ đè lên cũng gấp đôi |

Lỗi số 2 là **lỗi do chính bản vá vòng hai của em đẻ ra**: thêm nhãn vào ô chọn giúp màn máy tính,
nhưng làm cắt chữ trên điện thoại. Ghi lại thẳng - *một bản vá cho dễ dùng lấy mất một thứ đang
dùng được*, đúng câu em vừa viết cho một lỗi khác trong cùng ngày.

## Và một lần nữa, thước của chính em sai

Em dựng thước "nút bấm quá bé trên điện thoại" với ngưỡng 28px, nó báo **34 chỗ**. Đọc kỹ thì
gần hết là **chữ nội dòng**: một cái tên học viên rộng 27px nhưng **cao 46px** - ngón tay bấm
thừa sức. `_checkui` đã có luật đúng cho việc này từ lâu (chỉ tính nút thật: `button`/`select`/
`input`, ngưỡng 24px) và **ghi rõ ngay trong mã**: *"Link chữ trong câu cao 15px là bình thường -
bắt nó là báo nhầm hàng loạt"*. Em viết lại một cái thước đã có, và viết dở hơn bản cũ.

**LUẬT rút ra: trước khi dựng một phép đo mới, đi hỏi xem app đã có phép đo ấy chưa - và nếu có,
đọc lý do người ta đặt ngưỡng như thế.**

## Lỗi thứ tư - và là lỗi đắt nhất vòng này: VẠCH NGĂN MỒ CÔI

Nhìn khổ **máy tính bảng 768px** thì thấy giữa hai hàng chip có **một dòng trống chỉ chứa đúng
một vạch dọc** - cao 40px, không nội dung gì khác. `.tbdiv` là một phần tử flex **đứng riêng**,
nên khi thanh công cụ xuống dòng, nó ở lại một mình và chiếm trọn một hàng.

Đây là **họ hàng của lỗi dấu "·"** vừa vá cùng ngày, nhưng thước chữ M4 không thấy nó: M4 tìm dấu
ngăn bằng **ký tự** (`·›|`), còn vạch này **vẽ bằng CSS** - `textContent` của nó rỗng.

**Đo được ở MỌI khổ, không riêng màn hẹp:**

| Khổ màn | Số vạch ngăn mồ côi |
|---|---|
| Điện thoại 390px | 10 |
| Máy tính bảng 768px | 7 |
| Laptop 1024px | 6 |
| **Máy tính 1440px** | **3** |

Tức là nó vẫn hỏng ngay trên khổ mà mọi bộ kiểm đang đo - chỉ là chưa ai nhìn.

**Vá:** vạch ngăn nay là `::before` của nhóm đi sau nó (`.tbgr`), nên xuống dòng thì nó đi theo
nhóm, không bao giờ còn lại một mình; và dưới 560px bỏ hẳn. Sửa 9 chỗ dựng thanh công cụ.
**Đo lại: 0 chỗ trên cả bốn khổ, 16 trang.**

Trong lúc vá còn lộ một lỗi phụ do chính bản vá: `filterBar` vừa giữ vạch cũ vừa thêm `.tbgr`
nên vẽ **hai vạch** cạnh nhau - bắt được ngay vì em đo lại sau mỗi bước thay vì đo một lần ở cuối.

**Thước mới M7 trong `_checkmat`:** một vạch ngăn mà trên cùng một dòng bên phải nó không còn gì
thì nó đang ngăn cách hai thứ không nằm cạnh nhau - vô nghĩa và trông như rác.
**Đã chứng minh thước sống:** trả lại bản cũ thì nó đỏ 5 chỗ, vá vào thì xanh.

## Cái vòng ba xác nhận là CHẮC

- **0 cuộn ngang** trên 42 lượt đo (14 trang × 3 khổ: 390px, 360px, 768px). Khung dựng chắc.
- Bố cục điện thoại đọc được thật: một cột, dải cảnh báo xếp dọc, mỗi ô có số + nhãn + trang đích
  + mũi tên, vùng bấm rộng cả hàng.
- `_checkmat` nay đo **2.764 chuỗi chữ trên 20 trang × 2 khổ màn**, xanh.

## Vẫn còn chưa chạm tới

- **Khổ ngang điện thoại (844×390)** và **máy tính bảng** - `_checkui` có đo, nhưng chưa ai NHÌN.
- **Cỡ chữ trên điện thoại**: đo được 18 chỗ dùng chữ 10px và một chỗ 9.5px (nhãn trục biểu đồ
  Báo cáo). Chưa đổi vì app chưa có luật cỡ chữ tối thiểu, và đặt một luật như thế là quyết định
  thiết kế, không phải bản vá - cần anh Luân chốt.
- **Chưa ai dùng thật trên điện thoại thật** - máy đo được "không vỡ", không đo được "cầm điện
  thoại làm xong một việc có mệt không".


---

# SÀN CỠ CHỮ - anh Luân chốt 09/08: *"Cứ chọn 1 size hợp lý"*

## Em đo trước, rồi mới chọn - và phép đo đầu tiên cho thấy em đã nói sai

Vòng ba em khai *"18 chỗ dùng chữ 10px và một chỗ 9.5px trên điện thoại"* và ngụ ý đó là vấn đề.
Đo lại cho tử tế: **1.470 lượt chữ dưới 11px trên 26 kiểu**, ở 18 trang, khổ 390px.

Nhưng khi **chụp sát** vào đúng mấy chỗ ấy ở mật độ điểm ảnh thật (3×), thì **10px đọc rất rõ** -
chữ đậm, tương phản cao, nằm trên viên thuốc màu nhạt, và đứng cạnh chữ 13px thì đọc ra ngay là
chữ phụ, đúng ý đồ.

**Em đã NÓI "10px khó đọc" trước khi NHÌN, và nói sai.** Ghi lại thẳng, vì đó đúng cái bệnh mà cả
ba vòng audit này sinh ra để chữa.

## Vẫn chọn nâng sàn - nhưng vì một lý do khác, và thật hơn

**Tiếng Việt có dấu.** Dấu ngã, dấu hỏi, dấu mũ chồng lên nhau theo chiều **dọc** - cỡ chữ càng
nhỏ thì phần dấu càng mất nét, trong khi tiếng Anh cùng cỡ ấy vẫn đủ. Một app tiếng Việt phải
rộng rãi hơn ở chỗ này. Đó là lý do đứng vững được, không phải cảm giác.

## Chọn 11px - vì sao không phải 10, không phải 12

| Lý do | |
|---|---|
| **Đã là bậc có sẵn** | 11px vốn có 128 khai báo trong app - nâng lên không đẻ bậc mới, không phá thang |
| **Gọn thang** | gộp luôn bốn bậc 9 / 9.5 / 10 / 10.5 vào một: thang **từ 20 bậc còn 16** - đúng hướng `_checkux` sinh ra để giữ |
| **Khớp chuẩn ngoài** | 11pt là mức tối thiểu trong hướng dẫn giao diện iOS |
| **12px thì quá tay** | 12px đang là bậc của chữ thân; nâng chữ phụ lên bằng chữ thân là mất thứ bậc thị giác - đúng cái `_checkux` gọi là "mắt không phân biệt được nhưng tay phải nhớ cả năm bậc" |

## Đổi những gì, và đo lại ra sao

- **117 khai báo CSS** + **4 khai báo SVG** nâng lên 11px. Gộp nốt một bậc 13.5px lẻ loi về 13px.
- `_checkmat` **xanh trên CẢ HAI khổ màn** sau khi đổi - không chỗ nào bị cắt thêm.
- Biểu đồ Báo cáo: **31 nhãn chữ, 0 cặp chồng nhau** ở cả khổ máy tính lẫn điện thoại. Nhãn trục
  tháng trước ở 9.5px nay 11px, nhìn rõ hơn hẳn.
- `_checkux` lên **212 tiêu chí**.

## Thước giữ sàn - và đã chứng minh nó sống

Thêm vào `_checkux`: *không cỡ chữ nào dưới 11px*, quét cả `font-size:` của CSS lẫn `font-size="`
của SVG. **Thử thật:** cắm một chỗ 10px vào bản dựng → thước đỏ ngay. Gỡ ra → xanh.

*Một cái thước chưa bao giờ đỏ là một cái thước chưa ai biết nó có chạy không.*

## Một hệ quả của chính bản vá này - ghi thẳng

Trên khổ điện thoại, hàng KPI của trang Báo cáo chở **năm thứ trên một hàng 390px**: mã (LRT) ·
tên chỉ số · giá trị · ngưỡng · trạng thái. Tên chỉ số **vốn đã bị cắt từ trước** ("TB phút từ
le…"); nâng cỡ chữ lên 11px làm nó cắt sớm hơn **một ký tự** ("TB phút từ l…").

`_checkmat` không báo, vì `.mut` đã được khai là *"chữ phụ mờ - phần bị cắt là chú thích thêm"*.
Nhưng ở đây **nó không phải chú thích thêm, nó là TÊN của chỉ số** - đọc "LRT · TB phút từ l…"
thì không biết chỉ số ấy đo cái gì.

**Chưa sửa trong lượt này**, và nói rõ lý do: bản vá đúng cho nó là **cho tên chỉ số xuống dòng
riêng trên khổ hẹp** - một thay đổi bố cục, không phải một thay đổi cỡ chữ. Sửa nó ngay lúc verify
đã chạy được nửa đường là đánh đổi 37 phút đo lại lấy một ký tự. Ghi vào VIỆC TỒN để làm cho tử tế.

Đáng chú ý hơn cái lỗi: **dòng khai ngoại lệ của `.mut` trong `_checkmat` đang nói không đúng cho
mọi trường hợp.** Nó cho rằng chữ mang lớp `mut` luôn là chú thích phụ - trong khi ở hàng KPI,
`mut` đang mang tên chỉ số. Một ngoại lệ khai quá rộng thì nó che luôn những chỗ đáng lẽ phải đỏ.
Đây mới là thứ phải sửa trước, và cũng vào VIỆC TỒN.


---

# VÒNG BỐN - dọn hai việc tồn, và tìm ra 100 chỗ chữ bị cắt

Em tự ghi hai việc tồn ở cuối vòng ba, và nói rõ cái nào phải sửa trước. Vòng này làm đúng thứ tự
ấy - và cái "phải sửa trước" hoá ra dẫn tới một lỗ to hơn nhiều.

## 1. Ngoại lệ khai quá rộng - gỡ ra thì thấy nó KHÔNG che gì cả

`_checkmat` khai `.mut` là *"chữ phụ mờ - phần bị cắt là chú thích thêm"*. Em ngờ nó khai quá rộng
vì trên hàng KPI, `mut` đang mang **tên chỉ số**. Gỡ hẳn ngoại lệ ra rồi chạy lại: **vẫn xanh**.

Nghĩa là ngoại lệ ấy không che gì trong tập đang đo - nhưng em **vẫn nhìn thấy** chữ bị cắt trên
màn. Hai chuyện đó chỉ cùng đúng nếu **phép đo không nhìn tới chỗ ấy**. Và đúng thế.

## 2. Phép đo M1 chỉ soi một DANH SÁCH THẺ CỐ ĐỊNH

M1 tự dựng một thẻ ẩn rồi đo lại bề rộng chữ với đúng font - kỹ và đúng. Nhưng nó chỉ chạy trên
`input, .bsn, .bsl, .crb, h1..h4, b, .chip, button`. **Lớp nào không có tên trong danh sách ấy là
một vùng tối.** `.kpin` (tên chỉ số) không có trong đó.

Đổi câu hỏi: thay vì tự đo, **hỏi thẳng trình duyệt `scrollWidth > clientWidth`** - nó biết chính
xác nó vừa cắt cái gì, cho MỌI phần tử chứ không riêng vài lớp, và rẻ hơn (không dựng thẻ đo,
không phải khớp font).

**Kết quả đo lần đầu: 100 chỗ đang bị cắt chữ.**

| Chỗ | Số lượng | Mất nhiều nhất |
|---|---|---|
| `.kpin` - tên chỉ số KPI, **khổ máy tính 1440px** | **40** | **148px** |
| `.kpin` - khổ điện thoại | 42 | 148px |
| `.obm` - dòng phụ trên thẻ hàng đang gấp | 18 | 317px |

**40 tên chỉ số bị cắt ngay trên màn máy tính đầy đủ.** Trang Báo cáo có 51 chỉ số theo bảng BC2
của SOP; đọc ra *"TB phút từ l…"* thì người xem không biết chỉ số ấy đo gì. Nó nằm đó từ lâu,
không ai thấy, vì thước chỉ nhìn vào chỗ nó được bảo nhìn.

## 3. Phân biệt "cắt vì hỏng" với "cắt vì cố ý"

- `.kpin`: hàng KPI **không có trạng thái mở nào cả** - cắt ở đây là mất luôn cái tên. → cho
  **xuống dòng** thay vì cắt (hàng cao thêm một dòng còn hơn một cái tên không đọc được).
- `.obm`: cắt là **cố ý** - thẻ đang gấp, bấm mở ra thì `.obcard.open` gỡ `nowrap` và hiện đủ.
  → giữ nguyên, khai ngoại lệ kèm đúng lý do đó.

**Đo lại: 100 → 18, và 18 chỗ còn lại đều là chỗ cắt cố ý.**

## 4. Thước M8, và lại chứng minh nó sống

Thêm vào `_checkmat`: *trình duyệt có đang cắt chữ ở đâu không* - hỏi `scrollWidth`, bỏ qua ô
trong bảng (đã khai lý do) và `.obm` trong thẻ gấp (khai lý do riêng).
**Thử thật:** trả lại `.kpin` về bản cắt chữ → thước **đỏ ngay 8 chỗ**, kèm tên và số px bị mất.
Vá lại → xanh.

Bài học của vòng này gọn hơn ba vòng trước: **đừng tự đo cái mà trình duyệt đã biết.** Một phép đo
tự dựng bao giờ cũng kèm một danh sách "đo cái gì" - và cái danh sách ấy chính là vùng tối.
