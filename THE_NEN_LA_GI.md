# Thẻ ở mỗi trang nên là gì

Anh Luân 13/08: *"thẻ nó phải mang tính khác biệt, chứ nó như cái chip thì giữ làm gì, sao ko ưu
tiên KPI, SLA hoặc mấy cái nhóm quan trọng hả em"* · *"thử phân tích xem thẻ ở mỗi trang thì nên
là gì để người ta sử dụng trang đó hợp lý"*.

---

## 1. Hiện trạng, đo bằng máy

Vẽ thật 37 trang, đếm mọi thẻ còn lại sau đợt dọn sáng nay:

| | |
|---|---|
| Tổng số thẻ | **125** |
| Thẻ mang đơn vị hoặc là tỷ lệ (%, tiền, giờ, n/N) | **15** |
| Thẻ chỉ là **một con số đếm dòng** | **110 (88%)** |
| Trong đó, con số **trùng đúng một chip** trên cùng trang | **31** |

88% thẻ của app là chip đội lốt. Chúng khác chip đúng một điểm: **không bấm được**.

---

## 2. Luật: một cái thẻ phải khác LOẠI với chip

Chip trả lời **"lọc ra dòng nào"** - con số của nó luôn là *số dòng của bảng ngay dưới*.
Vậy thẻ chỉ đáng chiếm chỗ khi nó nói được thứ **chip không có cách nào nói**:

| Loại | Thẻ được phép mang | Vì sao chip không thay được |
|---|---|---|
| **T1 · KPI / tỷ lệ** | 86% chuyên cần · 70% nộp bài · 58% đạt AIM · band 6.5 | Chip đếm dòng, không chia được mẫu số |
| **T2 · SLA đang chạy** | 19 hồ sơ đã quá mốc, mốc 48 giờ (kèm bánh răng chỉnh) | Chip nói trạng thái, không nói **thời gian** |
| **T3 · Tiền / giờ cộng dồn** | 404.216.668đ còn nợ · 60.8h giờ dạy · 20.037.000đ tiền công | Chip đếm dòng, không cộng tiền |
| **T4 · Đo trên dữ liệu KHÁC bảng dưới** | Xếp lớp: đơn đã đóng đủ nằm ở DL06, bảng dưới là DL08 | Chip chỉ lọc được chính bảng nó đứng trên |
| **T5 · Xếp hạng giữa các nhóm** | "Quá hạn nhiều nhất: Học vụ 36" | Chip lọc một nhóm, không so các nhóm với nhau |

**Ngoài năm loại đó → là chip, không phải thẻ.**

Ba câu hỏi để loại nhanh một cái thẻ:
1. Con số này có bằng số dòng của bảng ngay dưới không? → nếu có, làm chip.
2. Sáng mai đọc lại, nó có đổi không? → không đổi thì nó là hình nền.
3. Đọc xong tôi làm gì khác đi? → không có việc gì thì bỏ.

---

## 3. Từng trang nên là gì

### Nhóm A - đang ĐÚNG, giữ nguyên

| Trang | Thẻ hiện có | Vì sao đúng |
|---|---|---|
| `banglop` | 86% chuyên cần · 70% nộp bài · 2/2 buổi off · điểm hài lòng | T1 thuần - đây là bảng KPI của một lớp |
| `bangcong` | 60.8h tổng giờ · 12h kèm 1-1 · 48.8h lớp nhóm · 20.037.000đ tiền công | T3 - không chip nào cộng giờ |
| `thanhtoan` | 404 triệu còn nợ · 128 triệu đến hạn | T3 |
| `duyetck` `duyethoan` `duyetthu` | Tổng tiền đang giảm / chờ hoàn / chờ đối soát | T3 - **giữ ô tiền, bỏ ô đếm đơn** (xem nhóm C) |
| `ketqua` | 58% đạt AIM thi thử · 80% đạt AIM thi thật | T1 |
| `viec` | Nợ quá 3 ngày · Quá hạn nhiều nhất: Học vụ | T2 + T5 |

### Nhóm B - nên ĐỔI, không nên bỏ — **ĐÃ LÀM XONG 14/08**

Tám trang dưới đây đã đổi thật, ghi lại đúng cái đã dựng để lần sau khỏi đoán:

| Trang | Thẻ mới đã dựng |
|---|---|
| `baitap` | **Nộp bài (HCR) %** so ngưỡng KPI · **Bài quá hạn chấm** (mốc `slaHomeworkGrading_hours` + bánh răng) · **Điểm trung bình bài đã chấm** |
| `wow` | Giữ **Buổi thiếu mốc giờ** · **Buổi WOW có tiến bộ (WOR) %** so ngưỡng · **Lượt WOW còn lại toàn trung tâm** |
| `lichwow` | **% ô trực đã được đặt** · **NV WOW trực tuần này** kèm số ô/người · giữ **Ngày không ai trực** |
| `giaoan` | **% buổi sắp dạy đã có giáo án** · **Buổi chưa soạn gần nhất còn mấy ngày** · **% buổi đã soạn có gắn bài về nhà** |
| `banggiao` | **Tuổi trung bình lead đang ôm** (kèm trần `leadHoldMax_days`) · giữ lead vô chủ · **Quá hẹn liên hệ** kèm mức trễ nặng nhất · giữ **Đủ điều kiện thu về** |
| `chang` | Còn **một** ô: **Hồ sơ quá hạn SLA của chặng** kèm mức trễ nặng nhất + chính con số mốc. Hai ô "Có hẹn hôm nay" / "Thiếu dữ liệu" đã bỏ |
| `dsphuhuynh` | **Tổng nợ học phí gộp theo phụ huynh** (tiền, không phải số người) · giữ **Có con đang cảnh báo**. Hai ô đếm người đã bỏ |
| `giangvien` | **Giờ dạy trung bình mỗi GV tháng này** · giữ hai ô SLA (thiếu mốc giờ, lớp chưa có GV chính) |

Một chỗ tự sửa lại chính mình: 13/08 em bỏ ô "Bài trong kho" của `giaoan` rồi kết luận ba ô còn
lại *"đều là thứ THIẾU nên giữ"*. Kết luận ấy hụt một nhịp - **thiếu-hay-không không phải tiêu
chuẩn, KHÁC LOẠI VỚI CHIP mới là**. Cả ba vẫn đang là số đếm dòng, nay đã đổi hết.

Bản gốc của bảng phân tích (giữ nguyên để đối chiếu):

Những trang này cần thẻ, nhưng đang cắm nhầm loại. Đổi sang KPI/SLA đúng nhịp của trang:

| Trang | Bỏ | Thay bằng |
|---|---|---|
| `baitap` | "67 bài chờ chấm" · "117 đã giao chưa thu" · "200 đã chấm" (cả ba đều là chip) | **Tỷ lệ nộp bài của khoá (HCR) so với ngưỡng 90%** · **bài quá hạn chấm** kèm mốc 48h + bánh răng · **điểm trung bình bài đã chấm** |
| `wow` | "2 buổi hôm nay" · "15 chờ xác nhận" · "1 hết lượt" | **Tỷ lệ buổi WOW có tiến bộ điểm** · **buổi thiếu mốc giờ** (T2, ảnh hưởng tiền công) · **quota WOW còn lại toàn trung tâm** |
| `lichwow` | "35 ô trống" · "12 ô đã đặt" · "3 NV trực" | **% ô trực đã được đặt** (đo hiệu suất lịch trực) · **ngày không ai trực** (giữ - đây là T5, so giữa các ngày) |
| `giaoan` | "16 bài trong kho" · "0 khoá chưa có giáo án" | **% buổi sắp dạy đã có giáo án** · **buổi gần nhất chưa soạn còn mấy ngày** (T2) |
| `banggiao` | ba ô đếm lead | **tuổi trung bình của lead đang ôm** (T1) · **lead quá mốc chăm sóc** kèm ngưỡng + bánh răng (T2) |
| `chang` | "19 quá hạn SLA" · "5 có hẹn" · "0 thiếu dữ liệu" | Giữ ô SLA nhưng **hiện luôn mốc giờ của chặng + bánh răng** (T2 đủ nghĩa), bỏ hai ô còn lại |
| `dsphuhuynh` | "61 người đồng hành" · "0 có từ 2 con" | **tổng nợ học phí gộp theo phụ huynh** (T3) · **phụ huynh có con đang cảnh báo** (giữ) |
| `giangvien` | "5 GV có lớp hôm nay" | **giờ dạy trung bình/GV tháng này** (T1) · giữ hai ô SLA còn lại |

### Nhóm C - nên BỎ HẲN (thẻ là chip đội lốt, chip đã có sẵn ngay dưới)

`ychv` · `khieunai` · `ghinhan` · `tuvan` · `ketthuc` · `hoctap` · `phong` · `tinnhan` ·
`gvdp` · `duyethd` · `duyetdot` · `magioithieu` · `khaosat` `review` `cskh` (ba trang cùng một
dải) · và các ô đếm đơn ở `duyetck` `duyethoan` `duyetnghi` `duyetthu`.

Mười lăm trang này đều cùng một hình: 1-4 ô, mỗi ô là số dòng của một chip ngay dưới nó.
Bỏ ô, giữ chip - **dải chip đã mang số và bấm lọc được**.

### Nhóm D - trang KHÔNG NÊN có thẻ

`ban` (bàn làm việc - hai ô "có việc gấp / đang sạch việc" là hai chip của chính bảng dưới) ·
`banlam` `hanhtrinh` `chay` (ba trang cùng dùng một dải năm ô, và cả năm đều trỏ sang **trang
khác** - đó là việc của **bảng việc theo chức danh** đã có sẵn ngay dưới, không phải việc của thẻ).

---

## 4. Thứ tự làm

1. **Nhóm C + D trước** - chỉ là gỡ, không cần nghĩ thêm, và gỡ xong app nhẹ ngay: bớt khoảng
   60 ô đếm trùng.
2. **Nhóm B sau** - mỗi trang một phép tính mới, phải đi qua CH6 (`kpiTh`) cho ngưỡng và CH2
   (`paramOf`) cho mốc SLA, không cắm cứng số.
3. Bộ kiểm `_checklap` L5 canh chiều trùng nhãn; cần thêm **L6: một thẻ không được mang con số
   bằng đúng con số của một chip trên cùng trang, trừ khi nó khai rõ mình thuộc loại T1-T5.**

---

## 5. Câu rút ra

*Chip trả lời "cho tôi xem những dòng nào". Thẻ phải trả lời "hôm nay chỗ này có ổn không".
Hai câu khác nhau - hễ thẻ trả lời câu của chip thì nó chỉ còn là một cái chip không bấm được.*
