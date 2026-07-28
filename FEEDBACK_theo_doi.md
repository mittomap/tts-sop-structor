# Theo dõi feedback demo SOP app

Nguồn: file **feedback demo SOP app.xlsx** anh gửi. Bảng này bám sát 21 dòng feedback, chia **Đã làm** / **Kế tiếp** kèm cách xử lý.

## ✅ Đã làm (đợt này)

| # | Feedback | Đã xử lý |
|---|---|---|
| Yêu cầu kèm theo | Cổng điểm danh + GV trễ/đúng giờ | Trang lớp: GV bấm **"Bắt đầu lớp"** (= điểm danh giảng viên) mới mở điểm danh HV. Cổng chỉ mở **20 phút trước giờ học** (cấu hình CH2 `slaAttendanceGate_minutes`); trước đó khoá kèm dòng "Cổng mở lúc HH:MM". Trạng thái buổi hiện luôn chip **"GV đúng giờ" / "GV trễ N phút"** (tự tính khi bấm bắt đầu). Bỏ ô nhập "GV vào trễ" thủ công. |
| 7 | Nút "Chạy" | Đổi thành **"Xử lý"** ở mọi hàng đợi + nhãn hành động lead. |
| 5 | Danh sách lead thiếu ngày vào hệ thống | Thêm cột **"Vào hệ thống"** (lead_created_time). |
| 2 | Nút "Xem toàn bộ hành trình" ở Trang bắt đầu thừa | **Đã bỏ**. |
| 9 | Nút "Chạy quy trình" góc phải trang Hành trình thừa | **Đã bỏ**. |
| 4 | Ô số liệu cần báo có danh sách bên dưới | Thêm **mũi tên xuống** + tooltip "Bấm để lọc danh sách bên dưới". |
| 3 (một phần) | Khung tìm kiếm nên có chỉ dẫn | Thêm dòng gợi ý **"gõ tên/SĐT · kết quả hiện ngay dưới"**. |
| 16 | Gộp "Học viên nguy cơ" vào "Học viên" | **Đã bỏ** trang nguy cơ riêng. Danh sách Học viên có **chip lọc "Nguy cơ"** (bộ lọc tuỳ biến `window.QF`), thêm 2 cột lý do (chuyên cần/học thuật). Ô số liệu & báo cáo cũ trỏ tới `goRisk()` = mở Học viên đã bật lọc. |
| 17 | Khóa học đưa vào Cấu hình | **Đã chuyển**: bỏ "Khóa học" khỏi menu Tra cứu, thêm **tab "Khóa học"** trong Cài đặt (bảng danh mục: mã, học phí, số buổi, quota WOW, trạng thái) + nút **"Mở danh sách đầy đủ (thêm/sửa)"** và nút Hồ sơ từng khóa. |
| 12, 14 | Bấm tên học viên → **drawer** thông tin nhanh | **Đã làm** `openStuQuick`: chip chặng, SĐT/khóa/lớp, chuyên cần %, trạng thái chuyên cần/học thuật, việc nên làm + SLA, nút **Hồ sơ đầy đủ** và **Đẩy vào quy trình**. |
| 13 | Cờ nguy cơ → **lý do cụ thể** + nút xử lý | **Đã làm**: trong drawer HV nguy cơ có hộp đỏ **"Vì sao gắn cờ nguy cơ"** (lý do chuyên cần/học thuật, số buổi vắng không phép + ngày, ghi chú theo dõi) + nút **"Xử lý nguy cơ (đẩy vào quy trình)"**. |
| 6 | Bấm lead → popup **hướng dẫn** | **Đã làm**: drawer lead có hộp **"Hướng dẫn nhanh"** — đang ở chặng nào · nên làm gì · thời hạn (còn ~Xh / quá hạn) + nút **"Xử lý theo quy trình"**. |

## ✅ Đã làm (đợt lớn V9.5)

| # | Feedback | Đã xử lý |
|---|---|---|
| — | Node hành trình trên trang tác vụ (Test đầu vào…) còn dạng block | `stepBar` đổi thành **stepper 1 dòng ngang** (chấm + nhãn cùng hàng, có đường nối), áp cho cả 13 trang tác vụ. |
| 18 | Gộp chặng tuyển sinh thành **một luồng thống nhất** | **Hub Tuyển sinh**: phễu bấm được (Lead → Test → Tư vấn & ĐK → Thanh toán) + tab nhúng nguyên chức năng cũ. 4 trang lẻ ẩn menu, điều hướng cũ tự mở đúng tab. |
| 20 | Khảo sát / feedback / khiếu nại **2 chiều** | **Hub CSKH**: nêu rõ TT→HV (khảo sát) và HV→TT (góp ý, khiếu nại); 3 tab gộp 4 trang cũ; HV gửi/xem trạng thái trong Trang học viên; xử lý có SLA tới khi đóng. |
| 19 | Chặng học tập còn rời rạc | **Hub Học tập & Giảng dạy**: tab Lớp học / Nhận xét buổi (SLA) / WOW 1-1; menu chặng gọn còn 4 mục; giữ Vận hành lớp làm nơi thao tác sâu. |

## ✅ Đã làm (đợt V9.6 - 27/07)

| # | Feedback | Đã xử lý |
|---|---|---|
| 21 | Chức năng ít dùng (bảo lưu, bỏ học…) gom một trang | **Hub "Tính năng khác"** (nhóm Quản lý): 3 tab Bảo lưu/Bỏ học · Mã giới thiệu · Bàn giao lead, nhúng nguyên trang cũ. Menu CSKH còn 2 mục, Quản lý 4 mục. Điều hướng cũ tự chuyển đúng tab. |
| — | (Đợt chuyên gia) Sửa bug + quick wins | Xem `KE_HOACH_HOAN_THIEN_APP.md` mục ĐỢT 1: số HV nguy cơ của Lớp/GV/Khóa hết bằng 0 giả, Bảo lưu hiện đủ SĐT+lớp, 3 tham số CH2 hết gọi sai tên, 2 SLA hết cắm cứng, giữ vị trí cuộn khi xử lý hàng đợi, tương phản chữ, focus bàn phím, màn gọi sales đủ thông tin... |

## 🔜 Kế tiếp (theo thứ tự đề xuất — chi tiết đầy đủ ở `KE_HOACH_HOAN_THIEN_APP.md`)

| # | Feedback | Kế hoạch |
|---|---|---|
| — | ĐỢT 2: Ngày làm việc của sales | "Tới hẹn hôm nay", "Tôi là ai" + KPI của tôi, khách mới liên hệ đến 1 form, chặn trùng SĐT, lý do từ chối + hẹn chăm lại, copy tin xác nhận Zalo. |
| 3 (đủ) | Ô tìm hiện thông tin hover để chọn nhanh | Gợi ý kết quả có ảnh/nhãn khi gõ. *(vừa)* |
| 15 | Rà bộ lọc trang Học viên đã đủ chưa | Kiểm & bổ sung lọc theo lớp/khóa/tình trạng/nguy cơ. *(vừa)* |
| 10 | Trang Hành trình còn lẫn luồng vận hành lớp | Rà, tách phần lớp học ra khỏi trang hành trình. *(vừa)* |
| 18 | Chặng tuyển sinh: gộp 4 trang thành **một luồng thống nhất** (vẫn xử lý task, vẫn liệt kê) | Thiết kế lại như hub Vận hành lớp (tab theo bước). *(lớn)* |
| 19 | Chặng học tập: frontend còn rời rạc | Một phần đã cải thiện bằng hub **"Vận hành lớp"** (làm sau khi anh gửi file); rà tiếp phần còn rời. *(lớn)* |
| 20 | Khảo sát / feedback / khiếu nại: thiết kế lại **2 chiều** (ai gửi–gửi ở đâu–ai nhận–nhận ở đâu) + quản lý chặt quá trình xử lý | Dựng lại thành luồng 2 chiều có trạng thái xử lý rõ ràng. *(lớn)* |

## Ghi chú
- Các mục *(lớn)* là thiết kế lại luồng — nên làm từng cái một để anh xem và duyệt, tránh đổi quá nhiều một lúc.
- File gốc được lưu tại: `feedback demo SOP app.xlsx` trong cùng thư mục.
