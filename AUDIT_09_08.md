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
