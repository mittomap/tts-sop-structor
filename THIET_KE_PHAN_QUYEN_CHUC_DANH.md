# THIẾT KẾ MÀN HÌNH THEO CHỨC DANH (chờ Luân duyệt - lập 27/07)

Trả lời yêu cầu của Luân: "đâu phải ai cũng được thấy đầy đủ". Đây là PHÂN QUYỀN GIAO DIỆN
(vận hành gọn + demo thật). Bản offline chưa có mật khẩu - ai mở file vẫn đọc được dữ liệu;
bảo mật thật nằm ở bản Google Sheets khóa theo email. Bảng ROLESCOPE thiết kế để dùng lại
nguyên vẹn khi lên bản .gs.

## 1. Gom 22 chức danh thành 8 nhóm quyền + Quản trị

| Nhóm | Gộp các chức danh | Ghi chú |
|---|---|---|
| Quản trị (Vào nhanh) | - | Thấy hết như hiện tại - lối thoát khi phân quyền chặn nhầm |
| Điều hành | Giám đốc (CEO) | Thấy hết, nhưng MỞ ĐẦU ở Báo cáo & KPI |
| Tư vấn | NV Tư vấn (7) + lớp phủ QUẢN LÝ cho Sale Leader (3), TP Tư vấn (1) | Leader/TP = như NV + thêm Duyệt CK, Báo cáo, Bàn giao/Chia lead |
| Học vụ - CSKH | NV Học vụ/CSKH (2), TP Học vụ, TP ACA | Dải P5-P9 liền mạch |
| Giáo viên | Giáo viên ACA (4) | Chỉ mảng dạy: lớp mình, chấm bài, nhận xét buổi |
| WOW | GV WOW (2), WOW Leader | Chấm test đầu vào + buổi WOW |
| Kế toán | NV Kế toán, TP Kế toán | Tiền vào, công nợ, xác nhận thu, hoàn tiền |
| Marketing | TP/Leader/NV Marketing (3) | Đổ lead + đo nguồn + mã giới thiệu |
| Hỗ trợ | HR (3), IT (2), Tạp vụ, Bảo vệ | Tối thiểu; IT thêm Cài đặt, HR thêm tab Nhân viên |

## 2. Ma trận nhóm quyền x màn hình

| Nhóm | Menu thấy | Trang mở đầu | Khối trên Trang bắt đầu | "Chỉ khách của tôi" | KPI của tôi | Ẩn | Chuông đếm |
|---|---|---|---|---|---|---|---|
| Quản trị | tất cả | Trang bắt đầu | cả 13 | tắt | tắt | không | tất cả |
| Điều hành | tất cả | Báo cáo & KPI | cả 13 | tắt | tắt | không | tất cả |
| Tư vấn (NV) | Bắt đầu, Hành trình, Tra cứu, hub Tuyển sinh, Kết thúc & Tái ĐK, Tính năng khác (chỉ tab Mã giới thiệu) | Trang bắt đầu | Tới hẹn, Lead mới, Đang khai thác, Có KQ chờ tư vấn, ĐK chờ thu, Chăm lại | BẬT | BẬT | Duyệt, Cài đặt, Báo cáo, Bàn giao, nhóm Học tập, hub CSKH | Tuyển sinh |
| Tư vấn (Leader/TP) | + Báo cáo + Duyệt + tab Bàn giao lead & nút Chia đều | Trang bắt đầu | + CK chờ duyệt, ĐK còn nợ | tắt | BẬT | Cài đặt, nhóm Học tập | Tuyển sinh + Tài chính |
| Học vụ - CSKH | Bắt đầu, Hành trình, Tra cứu, nhóm Học tập, hub CSKH, Kết thúc, Tính năng khác (tab Bảo lưu) | Trang bắt đầu | Test chờ chấm, Chờ xếp lớp, Onboarding, HV nguy cơ, WOW | tắt | BẬT | Duyệt, Cài đặt, Báo cáo (TP thì thấy Báo cáo), hub Tuyển sinh, Bàn giao | Học vụ + CSKH |
| Giáo viên | Bắt đầu, Tra cứu, Vận hành lớp, hub Học tập, Giáo án | hub Học tập (tab Lớp) | Test chờ chấm, HV nguy cơ | BẬT (lớp/bài của tôi) | BẬT (TNR, GCR7, ADC) | mọi trang tuyển sinh/CSKH/quản lý; khối tiền | Học vụ (chấm bài, chấm test, nhận xét buổi) |
| WOW | Bắt đầu, Tra cứu, hub Học tập | hub Học tập (tab WOW) | Test chờ chấm, WOW, HV nguy cơ | BẬT | BẬT (WOR/WSR) | như Giáo viên + Giáo án | Học vụ (WOW, chấm test) |
| Kế toán | Bắt đầu, Tra cứu, hub Tuyển sinh, Duyệt, Báo cáo | hub Tuyển sinh (tab Thanh toán) | ĐK chờ thu, CK chờ duyệt, ĐK còn nợ | tắt | tắt | Cài đặt, nhóm Học tập, CSKH, Bàn giao | Tài chính |
| Marketing | Bắt đầu, hub Tuyển sinh, Tính năng khác (tab Mã giới thiệu), Báo cáo (TP/Leader) | hub Tuyển sinh (tab Lead) | Lead mới, Chăm lại | tắt | tắt | Duyệt, Cài đặt, Học tập, CSKH, khối tiền | Tuyển sinh |
| Hỗ trợ | Bắt đầu (bản rút gọn: chào + ô tìm), Tra cứu | Trang bắt đầu | không | tắt | tắt | mọi trang chặng + quản lý. IT: + Cài đặt; HR: + Cài đặt (chỉ tab Nhân viên) | ẩn chuông |

## 3. Quy tắc chung

- BẤM TÊN LUÔN XEM ĐƯỢC hồ sơ 360 (xem là quyền chung); chỉ ẩn giao diện, KHÔNG giấu dữ liệu tầng data.
- go() là chốt duy nhất: trang ngoài phạm vi vẫn mở được kèm dòng "chế độ tham khảo"; riêng 4 trang
  nhạy cảm (Duyệt, Cài đặt, Báo cáo, Bàn giao) chặn nhẹ + nút về trang chính. Không sửa từng nút cũ.
- Hub không khóa tab con (thấy = được); riêng tab trong "Tính năng khác" và "Cài đặt" lọc theo nhóm.
- Chuông + Việc hôm nay + badge menu cùng một bộ lọc nhóm việc; Chạy quy trình KHÔNG chặn bước của
  vai trò khác (trung tâm nhỏ người ít việc nhiều) - chỉ nhắc "bước này thường do ... xử lý".
- "Chỉ khách của tôi" chỉ bật ở nhóm có luật lọc thật (Tư vấn/GV/WOW) - không tạo cảm giác lọc giả.
- Một bảng ROLESCOPE khai báo duy nhất (config-driven), lớp phủ QUẢN LÝ = regex manager|leader.

## 4. Rủi ro đã tính

Điều hướng cũ trỏ trang ẩn (chặn một chỗ ở go(), không sửa từng nút); chuông 99+ việc không thuộc
mình (áp bộ lọc nhóm ngay từ đầu); 2 bảng map role lệch nhau (mapRoleCode đọc lại từ ROLESCOPE);
harness phải chạy đủ 9 nhóm x trang mở đầu; trang bắt đầu trống trải với nhóm ít khối (đổi landing).

## 5. Trạng thái

- [x] Kiến trúc sư LMS/CRM thiết kế (27/07)
- [x] ĐÃ TRIỂN KHAI (V9.9, 27/07) + harness 70 tiêu chí x 9 nhóm - theo quy trình mới của Luân
      (làm một mạch, hội đồng tổng kiểm cuối)
- [ ] Hội đồng TỔNG KIỂM CUỐI (sau khi xong hết các đợt)
- [ ] Luân duyệt thực tế trên app (vào thử từng cổng; muốn nhóm nào khác đi thì nhắn)
