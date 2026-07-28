# ITTs - SOP TEMP — Nghiên cứu UX/UI toàn diện & Thiết kế theo vai trò & Trang Cài đặt

Tài liệu này nghiên cứu cách biến app thành công cụ dễ dùng - trực quan nhất cho TỪNG người, phân rõ các cấp quản lý, quy tắc "chỉ thấy việc của mình", và thiết kế trang Cài đặt còn thiếu. Dùng làm bản thiết kế khi xây.

---

## PHẦN 1 - ĐÁNH GIÁ HIỆN TRẠNG & NGUYÊN TẮC UX

**Đang có:** app hướng quy trình (phễu, nút bước tiếp, drawer chi tiết + lịch sử liên hệ), 20 trang theo vai trò, ghi thật, phân quyền server, nhắc việc SLA.

**Còn yếu (cần sửa):**
1. Chưa cá nhân hóa: NV Tư vấn đang thấy TẤT CẢ lead, không phải lead của mình.
2. "Quản lý" gộp làm một - chưa phân Quản lý Tư vấn / Quản lý ACA / Giám đốc (mỗi người cần bức tranh khác nhau).
3. Chưa có trang Cài đặt trên web (config nằm ở CH1-CH6 trong sheet, quản lý phải mở sheet).
4. Chưa có "trang chủ" đúng nghĩa: mở app phải vào ngay việc của mình.
5. Chưa tối ưu mobile (giáo viên/NV hay dùng điện thoại).
6. Chuông thông báo chưa thật; empty state, loading, xác nhận còn sơ.

**6 nguyên tắc UX kim chỉ nam:**
1. **Mở app thấy NGAY việc của mình** - không phải tìm.
2. **Ít chạm nhất tới hành động** - từ việc → xử lý ≤ 2 chạm.
3. **Chỉ thấy cái liên quan tới mình** - đúng vai trò, đúng phạm vi dữ liệu.
4. **Nhất quán & quen thuộc** - ngôn ngữ nghiệp vụ ITTs, cùng một kiểu thao tác.
5. **An toàn** - phân quyền, xác nhận hành động ghi/xóa/duyệt.
6. **Phản hồi tức thì** - lưu là thấy đổi, lỗi báo rõ.

---

## PHẦN 2 - THIẾT KẾ TRẢI NGHIỆM THEO TỪNG VAI TRÒ

Mỗi vai trò cần: **trang chủ mặc định**, **bộ trang thấy**, **dashboard riêng**, **phạm vi dữ liệu**, **hành động chính**.

| Vai trò | Trang chủ | Dashboard nhấn mạnh | Phạm vi dữ liệu | Hành động chính |
|---|---|---|---|---|
| **NV Tư vấn** (sales_staff) | Việc hôm nay | Lead của tôi: mới / cần gọi gấp / đang cân nhắc / đã chốt | CHỈ lead assigned_to = mình | Gọi, ghi liên hệ, đặt test, chốt ĐK |
| **Sale Leader** (sales_leader) | Phễu vận hành | Phễu + hiệu suất nhóm/chi nhánh | Lead của nhóm/chi nhánh mình | Theo dõi nhóm, hỗ trợ chốt |
| **Quản lý Tư vấn** (sales_manager) | Phễu + Báo cáo | CVR, tỷ lệ chốt, doanh thu tuyển sinh, CK chờ duyệt, lead tồn theo NV | Toàn bộ lead + ĐK | Duyệt CK, bàn giao lead, xem hiệu suất từng NV |
| **NV Học vụ/CSKH** (academic_staff) | Việc hôm nay | HV của tôi nguy cơ / onboarding / khiếu nại / khảo sát | HV/lớp mình phụ trách | Xếp lớp, chăm HV nguy cơ, xử lý khiếu nại |
| **Quản lý ACA** (academic_manager/aca_manager) | Dashboard chất lượng | Chuyên cần TB, hoàn thành, HV nguy cơ, NPS, tỷ lệ bỏ học, khiếu nại theo mức | Toàn bộ HV + lớp | Điều phối lớp, giám sát chất lượng, leo thang khiếu nại |
| **Giáo viên** (teacher) | Điểm danh (lớp hôm nay) | Lớp của tôi: buổi hôm nay, bài chưa chấm, HV vắng nhiều | CHỈ lớp mình dạy | Điểm danh, giao/chấm bài |
| **NV WOW** (wow_coach) | Việc hôm nay | Test chờ chấm, buổi WOW sắp tới của tôi | Test/WOW mình phụ trách | Chấm test, thực hiện WOW |
| **WOW Leader** (wow_leader) | Lịch trực WOW | Tải WOW toàn đội, quota | Toàn bộ WOW | Phân trực, cân tải |
| **Kế toán** (accountant) | Việc hôm nay | Công nợ, GD chờ xác nhận, hoàn tiền chờ | Toàn bộ thanh toán/ĐK | Ghi/xác nhận thu, xử lý hoàn |
| **Giám đốc** (ceo) | Dashboard điều hành | BỨC TRANH LỚN: doanh thu, phễu tổng, chất lượng đào tạo, nhân sự, xu hướng tháng | TẤT CẢ (chỉ đọc là chính) | Xem tổng hợp, quyết định, duyệt cấp cao |

**Phân biệt 3 cấp quản lý (điểm cốt lõi anh nêu):**
- **Quản lý Tư vấn** nhìn app qua lăng kính **tuyển sinh & doanh thu**: phễu, tỷ lệ chuyển đổi, hiệu suất từng NV tư vấn, chiết khấu. KPI trọng tâm: CVR, số lead, tỷ lệ chốt, doanh thu.
- **Quản lý ACA** nhìn qua lăng kính **chất lượng đào tạo & giữ chân**: chuyên cần, tiến độ học thuật, HV nguy cơ, khiếu nại, NPS, bỏ học, tái ghi danh. KPI trọng tâm: attendance rate, completion, dropout, NPS.
- **Giám đốc** nhìn **toàn cảnh & xu hướng**: gộp cả hai mảng trên + tài chính + nhân sự, so sánh tháng, không sa vào thao tác chi tiết. Dashboard cấp điều hành: vài con số lớn + biểu đồ xu hướng + cảnh báo đỏ.

---

## PHẦN 3 - PHẠM VI DỮ LIỆU & BÀN GIAO (quy tắc "chỉ thấy việc của mình")

**Quy tắc mặc định:**
- **Nhân viên**: chỉ thấy bản ghi do mình phụ trách - lead có `assigned_to` = mình; HV/lớp mình phụ trách; test/WOW/khiếu nại `assigned_*` = mình. Việc hôm nay + mọi danh sách mặc định lọc theo `MEINFO.staff_id`.
- **Leader**: thấy dữ liệu của nhóm/chi nhánh mình (theo `branch` hoặc `reports_to`).
- **Quản lý (ACA/Tư vấn)**: thấy toàn bộ dữ liệu phòng mình.
- **Giám đốc**: thấy tất cả.
- Quản lý/Leader có công tắc **"Chỉ của tôi / Cả nhóm"** để lọc nhanh.

**Bàn giao (handover) - đúng ý anh "nếu không bàn giao thì chỉ thấy của mình":**
- Khi NV nghỉ/chuyển/quá tải: **Quản lý** đổi `assigned_to` của lead/HV sang NV khác (CH3: "Bàn giao lead khi NV nghỉ" = quyền [duyệt] của quản lý).
- Sau bàn giao, NV mới thấy; NV cũ không còn thấy.
- Nên có màn **"Bàn giao"** cho quản lý: chọn NV nguồn → xem lead/HV của họ → tick → chọn NV đích → xác nhận (ghi log ai bàn giao, lúc nào).
- Tùy chọn **chia sẻ tạm** (xem chung không đổi chủ) để hỗ trợ chốt - giai đoạn sau.

**Kỹ thuật:** thêm hàm `scopeFilter(rows, role, staffId)` áp cho roleTasks + mọi danh sách; server cũng lọc theo email→staff_id để NV không "gọi vống" dữ liệu người khác.

---

## PHẦN 4 - THIẾT KẾ TRANG CÀI ĐẶT (web chưa có, sheet đang có)

**Vì sao cần:** config sống ở CH1-CH6 trong sheet; hiện quản lý phải mở sheet để chỉnh. Đưa lên web giúp chỉnh an toàn, có kiểm soát, đúng người.

**Ai được vào:** Giám đốc + Quản lý (theo loại). NV không thấy mục Cài đặt.

**Bố cục:** trang Cài đặt có các tab dọc bên trái; mỗi tab một nhóm config; mỗi tham số một dòng: **nhãn - mô tả - giá trị hiện tại (sửa được) - giá trị đề xuất (chỉ đọc) - nút Lưu**. Có cảnh báo "đổi giá trị này ảnh hưởng tới ...".

**Các tab:**
1. **Ngưỡng & SLA (CH2)** - 51 tham số: hạn liên hệ lại, SLA onboarding, hạn thu phí, chấm bài 48h, SLA khiếu nại theo mức, ngưỡng vắng/at_risk, ngưỡng chiết khấu cần duyệt... Đổi 1 ô → mọi nhắc việc/màu/trạng thái đổi theo (đúng triết lý config-driven). *Ai sửa: Giám đốc + quản lý liên quan.*
2. **Ngưỡng KPI (CH6)** - 48 KPI: giá trị ĐẠT/KHÔNG so ngưỡng. *Giám đốc + quản lý.*
3. **Danh mục lựa chọn (CH1)** - enum: nguồn lead, trạng thái, loại khiếu nại... Xem + thêm giá trị mới (cẩn trọng, có cảnh báo). *Quản lý.*
4. **Thông điệp nhắc việc (CH4)** - sửa câu nhắc (text thuần, có chỗ trống {1} {2}). *Quản lý.*
5. **Phân quyền (CH3)** - ma trận vai trò × hành động; bật/tắt quyền. *Chỉ Giám đốc.*
6. **Nhân viên & Email (DL01)** - danh sách NV, **email** (để đăng nhập + nhận nhắc việc), vai trò, trạng thái active/nghỉ. *Giám đốc + HR/quản lý.*
7. **Cấu hình nhắc việc** - bật/tắt gửi email SLA (REMIND_SEND), giờ chạy, người nhận bản tổng hợp. *Giám đốc.*

**Kỹ thuật (khi xây):**
- `apiGetConfig()`: đọc CH2 (tên param + giá trị + mô tả), CH6, CH1 enums, DL01 nhân sự.
- `apiSetParam(name, value)`: ghi 1 named range CH2/CH6 (kiểm quyền: chỉ manager/CEO; validate kiểu số). Đổi ô B ở CH2/CH6 = mọi công thức phụ thuộc tự cập nhật.
- `apiAddEnum(enumName, value)`, `apiSetMessage(code, text)`, `apiSetStaff(...)` cho các tab còn lại.
- MỌI thao tác ghi config đều log + xác nhận.

---

## PHẦN 5 - CẢI THIỆN UX/UI CHUNG (ưu tiên cao → thấp)

1. **Trang chủ theo vai trò** - đăng nhập vào thẳng "home" phù hợp (bảng Phần 2), không phải Tổng quan chung chung.
2. **Chuông thông báo thật** - đếm việc quá hạn/gấp CỦA MÌNH; bấm ra danh sách.
3. **Mobile responsive** - sidebar thu thành hamburger; bảng nhiều cột → thẻ; điểm danh/chấm bài bấm tay trên điện thoại. (GV, NV hiện trường rất cần.)
4. **Empty state thân thiện** - "Chưa có việc nào - tuyệt!" kèm gợi ý; không để trống trơn.
5. **Xác nhận hành động nhạy cảm** - xóa/hủy/duyệt/hoàn tiền hỏi lại; hoàn tác nhẹ khi có thể.
6. **Loading & lỗi** - skeleton khi tải; báo lỗi rõ ràng, có nút thử lại.
7. **Onboarding lần đầu** - tour 3 bước ("đây là việc của bạn / bấm để xử lý / phễu để theo dõi").
8. **Tìm kiếm toàn cục** - ô tìm trên thanh top xuyên lead + HV.
9. **Nhất quán hình ảnh** - 1 bảng màu trạng thái, 1 kiểu nút, giảm mật độ chữ, tăng khoảng thở.
10. **Tốc độ** - tải theo trang phía server khi data lớn (P1 đã nêu).

---

## PHẦN 6 - LỘ TRÌNH TRIỂN KHAI (đề xuất thứ tự)

1. **Phân biệt vai trò quản lý (ACA / Tư vấn / Giám đốc) + phạm vi dữ liệu theo NV + màn Bàn giao.** (Nền tảng, đúng trọng tâm anh nêu.)
2. **Trang Cài đặt** - làm CH2 (Ngưỡng & SLA) + CH6 (KPI) + DL01 (Nhân viên/Email) trước; CH1/CH3/CH4 sau.
3. **Trang chủ theo vai trò + chuông thông báo thật.**
4. **Mobile responsive.**
5. **Empty state / xác nhận / loading / onboarding.**
6. **Tối ưu tốc độ (tải theo trang) + các mục P1 còn lại.**

> Ghi chú: các mục 1-2 chạm vào cả tầng server (phân quyền theo staff, đọc/ghi config) nên cần deploy v4 test song song.
