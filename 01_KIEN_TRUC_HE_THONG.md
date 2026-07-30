# 01 - KIẾN TRÚC HỆ THỐNG (52 sheet, 5 nhóm)

## 1. Năm nhóm sheet (màu tab)
- **HD (xám)**: HD0 Trang chủ (đếm việc + điều hướng), HD1 Hướng dẫn (9 khối, danh mục 52 sheet
  bấm được), HD2 Quy trình 10 giai đoạn (cột A đã chuẩn `biến = giá trị (nhãn CH1)`, cột E SLA
  là link động về CH2), HD3 Sổ trigger & tự động (5 phần: nhắc việc 95 tình huống, 12 quy tắc
  dấu giờ, quy tắc màu, 93 cột tự tính, 8 bảng BC tự lọc - kèm link "Mở ô" tới tận công thức).
- **CH (đỏ)**: CH1 danh mục enum (57 khối, xếp theo hành trình khách; giá trị dùng dạng
  `code (Nhãn Việt)` = cột B "Combined"); CH2 tham số (51 named range, section: SLA P1-P10 ->
  NGƯỠNG -> HOÀN TIỀN -> WOW -> KPI mirror); CH3 phân quyền theo hành động; CH4 thông điệp
  (xem mục 3); CH5 thuật ngữ; CH6 ngưỡng 48 KPI (named range `kpiThreshold_*`; LRT/CVT/OBT
  mirror về sla* của CH2).
- **DL (xanh dương)**: 20 sheet dữ liệu DL01-DL19 + DL02b. Cấu trúc chuẩn: R1 header kỹ thuật,
  R2 nhãn Việt, R3 gợi ý, R4+ dữ liệu, cột A = khóa chính. DL19 = lưới trực WOW (đặc thù).
- **VH (xanh lá)**: bàn làm việc. VH0 tìm kiếm; VH1-VH4 tra cứu (VH1 có danh sách HV của lớp,
  VH2 = hồ sơ 360 độ gồm 9 khối); VH5-VH10 danh sách việc theo vai trò (filter() Google-native,
  cột cuối = Việc cần làm, rỗng thì hiện câu "không có việc nào - tốt!"); VH11 tải việc theo NV.
- **BC (cam)**: BC1 HV nguy cơ, BC2 48 KPI, BC3 phễu, BC4 báo cáo tháng (khối so sánh tháng
  trước, ô chọn tháng B34), BC5-BC8 bảng theo vai trò, BC9 bảng quản lý (CK chờ duyệt, KN cao,
  HOÀN TIỀN chờ xử lý R37-42). BC7 có ô lọc GV tại H7.

## 2. Cơ chế xương sống
- **Named range là API**: 51 param CH2 + 35 kpiThreshold CH6. Đổi giá trị 1 ô -> mọi câu nhắc,
  nhãn, trạng thái KPI, bảng lọc đổi theo. Cột A của CH2/CH6 là "địa chỉ MATCH" - KHÔNG đổi tên
  tùy tiện, KHÔNG dán suffix vào tên.
- **Liên kết ID**: mọi ô chứa mã (HV001, ENR-...) là công thức
  `=IFERROR(HYPERLINK("#'<sheet đích>'!A"&MATCH("mã",'<sheet>'!A:A,0),"mã"),"mã")` - sort không gãy.
- **next_action (nhắc việc)**: cột công thức trên 14 sheet DL, câu lấy từ CH4 qua
  `INDEX(CH4!$G:$G, MATCH("NA0xx", CH4!$A:$A,0))`. Màu: ĐỎ nếu câu chứa " ngay/ gấp/GỌI/NGUY",
  XANH nếu "Không cần làm gì", VÀNG còn lại (conditional formatting sẵn trên các cột này).
  3 sheet có thêm auto_trigger_hint (gợi ý chuyển trạng thái).
- **CH4 - mẫu câu 2 lớp**: cột C = TEXT THUẦN có chỗ trống `{1} {2}` (ô vàng, ai cũng sửa được);
  cột F = `{n} = tên tham số` (link CH2); cột G = công thức SUBSTITUTE tự ghép (xám, KHÔNG SỬA).
  MỌI consumer đọc cột G. Thêm câu mới: thêm dòng mã NAxxx mới + cập nhật HD3.
- **Dấu giờ tự động** (thời Google Sheets là `onEdit` + bảng AUTO_STAMP; từ 30/07 lớp Sheets đã
  nghỉ hưu, app tự đóng dấu giờ ngay trong từng cửa ghi): 12 quy tắc -
  đổi trạng thái thì tự điền cột *_time nếu trống (graded->result_time, resolved->resolution_time,
  on_time/late->check_in_time...). Chỉ chạy khi sửa trực tiếp trên Google Sheets.
- **Cột tự tính tiêu biểu** (không nhập tay): DL03 overall_score (TB 4 kỹ năng, tròn 0.5);
  DL09 last_learning_activity_time (MAX sự kiện QUÁ KHỨ từ DL12/13/14), first_enrollment_date
  (MIN từ DL06), contact_count, wow_quota_used; DL18 attendance_rate + completion_rate;
  DL11 teacher_late_minutes; DL10 sĩ số; DL06 final_fee/paid/remaining; mọi cột *_name.
  Cột GIỮ TAY CHỦ Ý: 2 cờ nguy cơ DL09 (máy nhắc qua NA064/065, người quyết), các status nghiệp vụ.
- **BC bảng tự lọc**: công thức mảng dạng
  `IFERROR(IF(INDEX(...SMALL(IF(điều_kiện,ROW()-3),ROW()-offset))="","",INDEX(...)),"")`
  - điều kiện dùng named range, bọc chống hiện số 0. Mọi bảng có cột "Việc cần làm" rộng 44 wrap.
- **Định dạng số theo tên cột** (đã trải sẵn vùng 4-500 kể cả ô trống): `*_date/dob` ->
  dd/mm/yyyy; `*_time/_at` -> dd/mm/yyyy hh:mm; `*_rate` -> 0%; `amount/fee/...` -> #,##0.
  Cột mới cứ đặt tên theo quy ước là chạy lại máy quét được.

## 3. Demo data (PHẢI BẢO TOÀN cốt truyện)
14 học viên, 20 lead, lớp nhiều HV (Foundation 3, còn lại 2). 8 nhân vật gốc là "giáo trình sống":
- HV001 Trần Minh Anh = chuỗi walkthrough HD1: L-2026-00006 -> TB-2026-003 -> CS-2026-002 ->
  ENR-2026-001 -> PAY-2026-001 -> OB-001 -> LOP-FOUND-PLA-01. KHÔNG được đổi các mã này.
- HV002 hoàn thành khóa; HV003 at_risk chuyên cần (vắng 2); HV004 at_risk học thuật (thiếu 3 bài);
  HV005 off_track + KN-2026-001 mức cao; HV006 onboarding quá hạn + chiết khấu 1.5tr chờ duyệt
  (ENR-2026-006 - demo cho BC9); HV007 hủy + đã đóng 5tr (demo bảng hoàn tiền); HV008 tái ghi danh.
- HV009-014: học viên khỏe làm nền; HV011 cọc 12tr nợ 8tr quá hạn (demo nhắc thu đỏ).
Chuẩn audit demo: 0 sai enum, 0 FK mồ côi, cờ nguy cơ khớp sự kiện, BC1 hiện đúng HV003/4/5.
Bộ sinh `gen_demo.py` (nếu còn trong transcript/môi trường) tự nhận cột công thức và bỏ qua.

## 4. Web app (ITTs_WebApp.gs, v3)
4 tab: Tổng quan (6 thẻ KPI sống, bấm mở sheet), Việc hôm nay (6 vai trò, app TRUY VẤN THẲNG
sheet DL bằng logic nghiệp vụ + ngưỡng đọc từ named range - không phụ thuộc VH), Nhập lead
(form TỰ SINH từ cấu trúc DL02: nhãn R2, gợi ý R3, dropdown lấy từ validation của chính cột;
NV phụ trách lọc role sales; assigned_to ghi dạng công thức link; tự kéo công thức dòng mới),
Tra cứu (tên/SĐT trên HV + Lead). Header hiện "demo v3" để nhận biết phiên bản deploy.
Deploy lại: Quản lý bản triển khai -> bút chì -> Phiên bản MỚI (hay quên bước này).
