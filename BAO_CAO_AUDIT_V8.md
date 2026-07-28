# Báo cáo audit — ITTs SOP App (V7.9)

Ngày 22/07/2026 · phạm vi: 31 trang render + 70 hàm hành động + 21 bảng dữ liệu (3.428 dòng)

---

## Kết luận trong một đoạn

Phần **mã nguồn khá sạch**: không trang nào ném lỗi, không nút nào gọi hàm không tồn tại, không bảng nào lệch cột, không thẻ nào hở. Vấn đề nằm ở **độ phủ** (12 KPI chưa tính, 3 trang hồ sơ cụt đường) và ở **dữ liệu demo** — trong đó có một lỗi đủ nghiêm trọng để làm hỏng buổi trình diễn: **toàn bộ 194 lead đều vượt SLA phản hồi**, khiến app hiện 113/224 hồ sơ "quá hạn" như thể trung tâm đang vỡ trận.

| Mảng | P1 chặn dùng | P2 sai/thiếu | P3 nhỏ |
|---|---|---|---|
| App | 0 | 4 | 2 |
| Dữ liệu demo | 2 | 8 | 3 |

---

# PHẦN 1 · APP

## Những gì đã sạch

Quét máy toàn bộ 31 trang và 70 hàm hành động:

- **Không hàm chết**: mọi `onclick` đều trỏ tới hàm có thật (3 cảnh báo ban đầu là dương tính giả: `.map()`, `event.stopPropagation()`).
- **Không điều hướng hỏng**: mọi `go()` / `reRender()` đều tới trang có thật.
- **Không lệch cấu trúc**: 31/31 trang cân bằng thẻ `div`, mọi bảng khớp số cột giữa `th` và `td`.
- **Bấm thử 70 hàm với dữ liệu thật**: 68 chạy sạch, 2 lỗi còn lại là do DOM giả trong máy kiểm chứ không phải lỗi app.
- **Mã enum trong code khớp danh mục**, trừ đúng một trường hợp dưới đây.
- **Mọi bảng dữ liệu đều có nơi xem**: 21/21 bảng đều xuất hiện ở ít nhất một trang.

## P2-1 · Danh mục thiếu `enum_cancellation_reason` → app hiện mã thô

Danh mục có 57 bộ enum, thiếu đúng bộ này. Hệ quả: `eFull()` trả về chuỗi trần `cancelled_by_student` thay vì `cancelled_by_student (Học viên hủy)`. Người dùng nhìn thấy **mã lập trình** ở 3 đăng ký đã hủy.

**Sửa**: thêm `enum_cancellation_reason` vào danh mục với các giá trị đang dùng thật (`cancelled_by_student`, `cancelled_by_itts`) cộng vài lý do phổ biến (chuyển trung tâm, lý do tài chính, sức khỏe, chuyển nơi ở). Công: 15 phút.

## P2-2 · Ba trang hồ sơ 360 cụt đường khi mở trực tiếp

`Hồ sơ Giảng viên`, `Hồ sơ Nhân viên`, `Hồ sơ Khóa học` chỉ hiện đúng một dòng *"Chưa chọn giảng viên."* nếu vào mà chưa chọn ai — không bộ chọn, không nút quay lại, không danh sách. Bình thường vào bằng cách bấm tên từ trang khác nên ít gặp, nhưng tải lại trang hoặc vào nhầm là kẹt.

**Sửa**: trạng thái rỗng đổi thành **bộ chọn ngay tại chỗ** — danh sách giảng viên/nhân viên/khóa học bấm được, kèm ô tìm. Đồng bộ cả `Hồ sơ Lớp` cho nhất quán. Công: 1 giờ.

## P2-3 · 12/48 KPI trong CH6 chưa được tính

Trang Báo cáo hiện 36 chỉ số, thiếu 12 chỉ số SOP đã chốt:

| Mã | Tên | Ghi chú |
|---|---|---|
| ANR | Academic Note Rate | tỷ lệ buổi test có nhận xét học thuật |
| CVT | Consultation Velocity | giờ từ test tới tư vấn |
| OBT | Onboarding Time | giờ từ xác nhận lớp tới hoàn tất onboarding |
| RCR | Recovery Rate | HV nguy cơ quay lại ổn định |
| FUR | Follow-up Rate | tuân thủ lịch hẹn liên hệ lại |
| ADC | Attendance Discipline | tuân thủ điểm danh của giảng viên |
| SPR | Skill Progress Rate | tiến bộ điểm theo kỹ năng |
| FTR | Feedback Time Rate | thời gian xử lý phản hồi |
| SLA_R | SLA Response | tuân thủ SLA phản hồi chung |
| RTR | Re-enroll Timely | tư vấn tái đăng ký đúng hạn |
| TCR | Transfer Comeback Rate | bảo lưu quay lại |
| WRR | WOW Recommend Rate | đề xuất WOW được chấp nhận |

Dữ liệu để tính **đã có đủ** trong các bảng hiện tại — chỉ thiếu phần cài công thức. Công: 3–4 giờ cho cả 12.

## P2-4 · 75/94 mẫu thông điệp CH4 chưa được nối vào luồng

App gọi đích danh 19 mẫu (qua bảng `JNA` ánh xạ chặng → mã thông điệp). 75 mẫu còn lại chỉ tra tay được ở Cài đặt, không tự hiện ra đúng lúc nhân viên cần. Đây là phần "nhắc lời thoại" mạnh nhất của hệ thống mà đang dùng chưa tới 1/5.

**Sửa**: rà CH4 theo từng chặng, nối thêm mẫu cho các tình huống chưa có (nhắc học phí, nhắc nộp bài, mời tái đăng ký, xin lỗi khiếu nại, xác nhận WOW…). Công: 2–3 giờ.

## P3-1 · Trang Tư vấn (DL04) và Khảo sát (DL15) chưa có trang danh sách chuẩn

Cả hai có trang tác vụ riêng chạy tốt, nhưng không có bộ lọc/tìm/cấu hình cột như 19 bảng còn lại. Không chặn việc, chỉ lệch chuẩn.

## P3-2 · 60 nút "Chạy" ở Bàn làm việc không gắn hành động riêng

Chúng nằm trong hàng đã có `onclick`, nên bấm vẫn chạy nhờ sự kiện lan lên hàng cha. Đúng chức năng, sai về trợ năng (đọc màn hình không hiểu, không bấm được bằng phím Tab + Enter).

---

# PHẦN 2 · DỮ LIỆU DEMO

## Những gì đã sạch

- **Khóa ngoại**: 24/24 quan hệ liên bảng sạch tuyệt đối, không một mã treo.
- **Tiền**: gốc − chiết khấu = phải thu, đã đóng + còn lại = phải thu, tổng phiếu thu = số đã đóng — khớp cả 95 đăng ký, không phiếu thu nào trước ngày đăng ký.
- **Không trùng**: không trùng mã khóa chính ở cả 21 bảng, không trùng số điện thoại, không xếp trùng lớp, không điểm danh trùng.
- **Không mồ côi**: mọi điểm danh/bài tập/WOW/khảo sát đều gắn học viên có thật.
- **Giá trị hợp lý**: điểm IELTS trong 0–9 và khớp trung bình 4 kỹ năng, điểm bài tập 0–10, hài lòng 1–5, chuyên cần 0–100%.
- **Không có bản ghi khống**: 0 điểm danh cho buổi chưa diễn ra, 0 lead vô chủ, 0 lớp đang chạy mà rỗng.

## P1-1 · Toàn bộ lead đều vượt SLA phản hồi — demo trông như đang vỡ trận

**194/194 lead** có ghi giờ gọi đầu tiên đều vượt SLA 15 phút. Trung vị **7.575 phút = 5,3 ngày**. Hệ quả dây chuyền:

- Bàn làm việc hiện **113/224 hồ sơ quá hạn** (50%) — nhìn như trung tâm bỏ bê khách.
- KPI **LRT** đỏ tuyệt đối, không có mẫu "đạt" nào để đối chiếu.
- Không thể trình diễn tính năng nhắc việc theo SLA, vì mọi thứ đều đỏ nên màu sắc mất ý nghĩa phân biệt.

**Sửa**: phân bố lại `first_call_time` theo hình thật của một trung tâm chạy tốt — khoảng **70% trong 15 phút, 20% trong 1 giờ, 10% trễ hẳn**. Giữ nguyên số lượng lead quá hạn ở mức đủ để có việc mà làm (~20 hồ sơ) thay vì 113. Công: 30 phút (sửa trong `mkdemo.py`).

## P1-2 · 8 buổi WOW ở tương lai đã bị trừ quota

WOW-042, 043, 045, 046, 047, 048, 049, 050 — ngày dạy **21–27/07/2026** (chưa tới hoặc vừa tới), trạng thái mới `booked`/`confirmed`, nhưng `quota_deducted = yes`.

Sai SOP: quota chỉ trừ khi **đã dạy** hoặc **học viên không đến**. Hệ quả: học viên bị ăn gian số buổi WOW còn lại, và mọi chỗ hiện "quota còn lại" trên trang học viên đều sai.

**Sửa**: đặt `quota_deducted = no` cho mọi buổi chưa `completed`/`no_show`, rồi tính lại `wow_quota_used` ở DL09. Công: 15 phút.

## P2 · Tám điểm mâu thuẫn còn lại

| # | Vấn đề | Số lượng | Hệ quả trên app |
|---|---|---|---|
| 1 | Chiết khấu 1–2 triệu nhưng **không ai duyệt** (trống cả người duyệt lẫn thời điểm) | 7 đăng ký | Khối "Chiết khấu chờ duyệt" ở Bàn làm việc không phản ánh đúng thực trạng |
| 2 | **Xếp lớp sau ngày khai giảng** (xếp 17–20/06 vào lớp khai giảng 21/02 và 02/04) | 14 hồ sơ | Timeline hành trình đọc ngược, KPI OBT sẽ sai khi cài |
| 3 | **Lớp vượt sức chứa**: LOP-IELTS-6.0-12 (15/14), LOP-IELTS-7.0-02 (12/10) | 2 lớp | Thanh sĩ số hiện >100%, xếp lớp lẽ ra phải chặn |
| 4 | **Quota WOW ghi ≠ số buổi đã dùng** (ghi 1 dùng 0, ghi 3 dùng 1…) | 7 học viên | Trang học viên hiện sai số buổi còn lại |
| 5 | **Đăng ký đã hủy còn nguyên tiền, chưa có phiếu hoàn** (3tr + 5tr + 6tr) | 3 đăng ký = 14 triệu | Sổ tiền không đóng được, không ai thấy phải hoàn |
| 6 | **WOW đã dạy nhưng chưa ghi nội dung** (WOW-039, WOW-040) | 2 buổi | Vi phạm SLA ghi chú 24h — nhưng đây là hàng chờ hợp lý, nên giữ |
| 7 | **Tư vấn diễn ra trước ngày test** (CS-2026-059, CS-2026-066) | 2 phiếu | Timeline hành trình đọc ngược |
| 8 | **Đăng ký trước khi có lead** (ENR-2026-084) | 1 | Timeline hành trình đọc ngược |

## P3 · Ba khoản là hàng chờ cố ý — nên giữ

Không phải lỗi, nhưng nên ghi rõ để lần sau khỏi "sửa nhầm":

- **7 phiếu thu chưa xác minh** (63,7 triệu) — để trang Thanh toán có việc.
- **7 phiếu khảo sát đã gửi chưa có kết quả** — để trang Khảo sát có việc.
- **9 khiếu nại còn mở** — để trang Khiếu nại có việc.

---

# PHẦN 3 · PHƯƠNG ÁN

## Đợt 1 — sửa lỗi (khoảng 3 giờ)

| Việc | Mảng | Công |
|---|---|---|
| Phân bố lại giờ gọi đầu tiên: 70% đạt SLA, giữ ~20 hồ sơ quá hạn | dữ liệu | 30' |
| Gỡ trừ quota cho 8 buổi WOW tương lai + tính lại quota 7 học viên | dữ liệu | 20' |
| Điền người duyệt + thời điểm duyệt cho 7 chiết khấu (giữ lại 2 cái chờ duyệt để có việc) | dữ liệu | 15' |
| Kéo ngày xếp lớp về trước khai giảng cho 14 hồ sơ | dữ liệu | 20' |
| Hạ sĩ số 2 lớp vượt sức chứa (dời 3 HV sang lớp cùng khóa) | dữ liệu | 20' |
| Tạo phiếu hoàn tiền cho 3 đăng ký đã hủy | dữ liệu | 15' |
| Sửa thứ tự thời gian 3 hồ sơ (2 tư vấn, 1 đăng ký) | dữ liệu | 10' |
| Thêm `enum_cancellation_reason` vào danh mục | app | 15' |
| Bộ chọn cho 3 trang hồ sơ 360 khi chưa chọn ai | app | 60' |

**Kèm theo**: bổ sung 12 quy tắc vừa viết vào bộ kiểm tự động, chạy mỗi lần sinh lại dữ liệu — để lần sau không tái phát. Đây là phần đáng giá nhất của đợt này.

## Đợt 2 — bù độ phủ (khoảng 6 giờ)

| Việc | Công |
|---|---|
| Cài 12 KPI còn thiếu của CH6 | 3–4h |
| Nối thêm mẫu thông điệp CH4 vào các chặng chưa có | 2–3h |

## Đợt 3 — nâng cấp đề xuất (chưa làm, chờ anh quyết)

1. **Chặn ngay lúc nhập thay vì phát hiện sau**: xếp lớp vượt sức chứa, chiết khấu vượt ngưỡng chưa duyệt, ngày sau ngày trước — hiện app cho nhập rồi mới báo. Đây là nguồn gốc của phần lớn mâu thuẫn dữ liệu.
2. **Trang "Sức khỏe dữ liệu"** trong Cài đặt: chạy 12 quy tắc kiểm ngay trên dữ liệu thật, liệt kê hồ sơ sai kèm nút nhảy tới sửa. Khi nối Google Sheet thật thì đây là thứ dùng hằng tuần.
3. **Trang danh sách chuẩn cho Tư vấn và Khảo sát** để đủ 21/21 bảng cùng một chuẩn thao tác.
4. **Trợ năng**: 60 nút "Chạy" gắn `onclick` riêng, thêm điều hướng bằng phím.

---

## Phụ lục · công cụ kiểm đã dựng

Bốn máy kiểm tự động lưu ở thư mục làm việc, chạy lại được bất cứ lúc nào:

- `_auditA.js` — hàm chết, điều hướng hỏng, enum lạ, lệch cột, thẻ hở
- `_auditB.js` — bấm thử 70 hàm hành động với dữ liệu thật, soi nội dung drawer
- `_auditB2.js` — độ phủ bảng dữ liệu, chặng hành trình, KPI, thông điệp
- `_auditC2.py` — 12 nhóm quy tắc dữ liệu, **có chốt chặn tên cột**

**Bài học kỹ thuật đắt nhất của đợt audit**: bản kiểm đầu tiên báo "sạch" ở phần tiền và thời gian — nhưng chỉ vì nó dò sai tên cột (`enrollment_date` thay vì `enrollment_time`, `session_date` thay vì `wow_session_date`, `original_fee` thay vì `total_fee`). Quy tắc dò sai tên cột thì **im lặng pass**, nguy hiểm hơn hẳn báo lỗi. Bản `_auditC2.py` nay bắt buộc khai trước tên cột cần dùng, thiếu cột thì báo "QUY TẮC BỊ VÔ HIỆU" thay vì lặng lẽ bỏ qua.
