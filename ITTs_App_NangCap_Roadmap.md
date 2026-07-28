# ITTs - SOP TEMP — Roadmap nâng cấp (chuẩn bị turn tiếp theo)

## Tình trạng hiện tại (bản v4 Apps Script)
- Đọc THẬT mọi trang từ 19 sheet DL; đăng nhập theo email Google -> tự nhận vai trò; filter đa chọn theo trạng thái; phân trang + tìm kiếm.
- Ghi THẬT: Thêm mới (mọi form danh sách), Duyệt chiết khấu, Điểm danh, Ghi liên hệ nhanh - có sinh mã, kéo công thức, dấu giờ tự động ở tầng ghi.
- Mức hiện tại = "đọc + thêm mới + duyệt/điểm danh". CHƯA có: sửa tại chỗ, phân quyền hành động chi tiết, tối ưu tốc độ khi data lớn, validation chặt, nhắc việc tự động nền.

> Điều kiện tiên quyết cho mọi việc dưới đây: anh deploy v4 và chạy checklist test trên sheet thật để chốt kiến trúc đọc/ghi đã đúng. Có kết quả test rồi mới làm P0.

---

## P0 — Bắt buộc để dùng hằng ngày (đề xuất làm ngay turn tới)

1. **Sửa bản ghi tại chỗ (edit-in-place).** Bấm 1 dòng -> mở form đã điền sẵn -> `apiUpdate` ghi lại đúng dòng (tìm theo mã bằng MATCH). Đây là thiếu sót lớn nhất: hiện chỉ Thêm mới, sửa phải mở Google Sheets tay. *(Độ khó: Vừa)*
2. **Đổi trạng thái nhanh trên dòng/thẻ.** Nút đổi nhanh (vd lead new->contacted, khiếu nại ->resolved) không cần mở form; kích hoạt dấu giờ tự động. *(Vừa)*
3. **Hoàn thiện tầng Duyệt.** Nút Từ chối CK và Xử lý hoàn tiền ghi ngược thật vào DL06/DL07 (hiện chỉ Duyệt là ghi). *(Dễ)*
4. **Validation nghiệp vụ (client + server).** SĐT hợp lệ/cảnh báo trùng, số tiền >= 0, ngày hợp lệ, band 0-9, ô bắt buộc theo nghiệp vụ. Chặn dữ liệu rác ngay từ đầu. *(Vừa)*
5. **Điểm danh chống trùng.** Cập nhật theo HV + buổi (thay vì luôn append), chọn đúng buổi từ DL11. Tránh nhân đôi dòng DL12. *(Vừa)*
6. **Kiểm quyền ở SERVER theo CH3.** Chặn ghi/duyệt trái phép ngay trong `apiSave`/`apiApprove` (email -> vai trò -> hành động cho phép ở CH3), không tin client. Ẩn nút theo quyền ở giao diện. *(Vừa-Nặng)*

Làm xong P0 = app đủ chuẩn cho nhân viên dùng thật hằng ngày.

---

## P1 — Quan trọng, nâng lên mức chuyên nghiệp

7. **Hiệu năng khi data lớn.** Hiện tải TOÀN BỘ 19 sheet mỗi lần mở -> chậm khi tới hàng nghìn dòng. Chuyển sang đọc theo trang phía server (`apiList` search/filter/paging trên server) + cache (CacheService); chỉ tải sheet nặng (điểm danh/bài tập) khi mở trang đó; sau khi ghi chỉ tải lại phần đổi. *(Nặng)*
8. **Nhắc việc tự động theo SLA (trigger thời gian).** Đúng linh hồn SOP: quét hằng ngày các quá hạn (liên hệ lead, onboarding, thu phí, chấm bài 48h, khiếu nại theo mức) -> gửi email/Zalo + đẩy badge số việc. Tận dụng 95 tình huống CH4 + ngưỡng CH2. *(Nặng)*
9. **Filter & sắp xếp nâng cao.** Lọc theo khoảng ngày (tạo/hẹn/thanh toán), theo NV phụ trách / cơ sở / lớp / khóa; sort khi bấm tiêu đề cột; lưu bộ lọc hay dùng. *(Vừa)*
10. **Tự tính realtime trên form + cảnh báo ngưỡng.** Học phí thực = gốc − CK ngay khi gõ; CK vượt ngưỡng thì cảnh báo "cần duyệt" tức thì; kiểm quota WOW còn lại trước khi đặt. *(Vừa)*
11. **Nhật ký thao tác (audit log).** Ai ghi/sửa/duyệt gì, lúc nào - cần khi nhiều người dùng chung. *(Vừa)*
12. **Báo cáo nối CH6 thật.** 48 KPI + ngưỡng từ CH6 (ĐẠT/KHÔNG), phễu theo khoảng thời gian, biểu đồ, xuất Excel/PDF. *(Vừa-Nặng)*

---

## P2 — Hoàn thiện & trải nghiệm

13. **Mobile responsive.** Sidebar thu gọn/hamburger; GV điểm danh trên điện thoại mượt. *(Vừa)*
14. **Hồ sơ 360 nâng cấp.** Dòng thời gian (timeline) sự kiện của HV + nút hành động ngay trong hồ sơ. *(Vừa)*
15. **In/Xuất.** Biên nhận thanh toán, danh sách lớp, phiếu kết quả. *(Vừa)*
16. **Tìm toàn cục + chọn cột hiển thị.** Ô tìm nhanh xuyên sheet; ẩn/hiện cột theo ý. *(Vừa)*
17. **Form phụ thuộc.** Chọn lớp -> lọc HV theo lớp; chọn khóa -> tự điền giá; picker theo tên cho mọi field liên kết. *(Vừa)*

---

## Nền tảng & bàn giao DEV

18. **Tách code để dễ bảo trì.** Chuyển từ 1 file .gs (HTML nhúng dạng chuỗi) sang HtmlService template (Index.html / CSS.html / JS.html) + dùng clasp + git để version control. *(Vừa)*
19. **Test tự động backend.** Unit test các hàm `api*` trên một sheet mẫu trước khi deploy. *(Vừa)*
20. **Chuẩn hóa cấu hình.** Rà soát mọi ngưỡng/SLA/enum đều đọc từ CH1/CH2/CH6 (đã làm phần lớn), không còn hằng số cứng trong code. *(Dễ)*

---

## Đề xuất turn tiếp theo
Gộp **toàn bộ P0** thành một "vòng vận hành thật lõi": sửa bản ghi + đổi trạng thái nhanh + hoàn thiện Duyệt + validation + điểm danh chống trùng + kiểm quyền server. Sau vòng này, app đủ để đội dùng thật mỗi ngày. Ngay sau đó nên làm **P1 #8 (nhắc việc tự động)** vì đó là giá trị cốt lõi của một hệ SOP.
