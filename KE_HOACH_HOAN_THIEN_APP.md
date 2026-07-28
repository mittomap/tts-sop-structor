# KẾ HOẠCH HOÀN THIỆN WEB APP ITTs (lập 27/07/2026)

Theo yêu cầu của Luân: "phối hợp giữa các chuyên gia, nghiên cứu kỹ xem cần thêm trang nào, chỉnh trang hiện tại ra sao, từng chức năng, từng hiển thị nhỏ phải thực sự tiện dụng và logic".

## Cách làm

4 chuyên gia rà ĐỘC LẬP toàn bộ mã nguồn (gen_v5.py V9.5, 36 trang) + dữ liệu demo + SOP:
1. Chuyên gia hệ thống LMS/CRM - 22 phát hiện (CRM-01..22)
2. Trưởng nhóm sales dày dặn (đi theo kịch bản một ngày gọi khách thật) - 18 phát hiện (SAL-01..18)
3. Chuyên gia UX/UI mảng EdTech/IELTS - 43 phát hiện (UX-01..43)
4. Chuyên gia vận hành học vụ & giảng dạy - 21 phát hiện (HOC-01..21)

Mọi phát hiện dùng trong kế hoạch này đã được kiểm chứng lại trực tiếp trên code trước khi đưa vào
(một số phát hiện trùng nhau giữa các chuyên gia - đó là tín hiệu ưu tiên tốt). Toàn văn 4 báo cáo
nằm trong transcript phiên 27/07; kế hoạch này là bản chưng cất đủ dùng.

## Nhận định hội tụ (cả 4 người cùng thấy)

1. Khung xương app RẤT TỐT: máy trạng thái hành trình jStageOf, 3 hub, config-driven CH2/CH4/CH6,
   drawer-trước-hành-động-sau, cổng điểm danh, giáo án 2 tầng. KHÔNG đập đi làm lại bất cứ luồng nào.
2. Lỗ hổng lớn nhất: app chưa xoay quanh MỘT NGƯỜI DÙNG CỤ THỂ trong MỘT NGÀY CỤ THỂ.
   Sales không có "tôi là ai + hôm nay gọi ai trước + KPI của tôi"; giáo viên không có "hôm nay tôi
   dạy gì"; học vụ không có "lớp nào đang có mùi". Dữ liệu đã đủ hết, chỉ thiếu chỗ hiện.
3. Vòng đời có 3 đoạn ĐỨT thật: (a) sau điểm danh - HV vắng không sinh việc gọi hỏi thăm;
   (b) cuối khóa - không gì phát hiện lớp đã kết thúc mà chưa làm hồ sơ đầu ra, HV học khóa 2 bị kẹt
   chặng alumni; (c) tiền chiều ra - hoàn tiền không tính số tiền theo chính sách CH2, không có phiếu thu in.
4. Một lớp bug "đọc sai tên cột/tên tham số" chạy êm không ai biết (DL09.class_id không tồn tại,
   3 tham số gọi sai tên CH2, 2 SLA cắm cứng) - đã sửa ngay trong đợt 1.

## ĐỢT 1 - ĐÃ LÀM XONG trong phiên 27/07 (build V9.6, đã verify 36 trang 0 lỗi)

Sửa bug (loại "chạy êm nhưng sai số"):
- Số "HV nguy cơ" của Lớp / Hồ sơ GV / Hồ sơ Khóa luôn bằng 0 do lọc DL09 theo cột class_id
  KHÔNG TỒN TẠI - đã join qua DL08 ở cả 3 chỗ (renderBanglop, renderHosoGV, renderHosoKhoa).
- Trang Bảo lưu/Bỏ học: SĐT và tên lớp luôn trống (đọc s.phone, s.class_id_name không có trong DL09)
  - đã đọc phone_number + tra lớp qua DL08, cả ở thẻ lẫn drawer gọi giữ chân.
- 2 tham số gọi sai tên CH2 chạy bằng default cứng: slaComplaintFirstResponse_hours (nay map
  slaKN_assignment_hours = 2h - KPI SLA_R đổi theo, đúng SOP), slaReenroll_days (map
  slaReenroll_contact_days). Thêm vào PKEY.
- 2 SLA cắm cứng 24h trong JSTAGE: chặng "Đã hẹn test" thành tham số mới slaTestBookedRemind_hours
  (có trong Cài đặt), chặng "Đã thu chờ xếp lớp" đọc slaPLR48_hours = 48h của CH2 (trước sai SOP).
- Thêm slaPayment_hours vào APPPARAMS (naFor NA007 dùng mà chưa khai - sửa Cài đặt nay có tác dụng).
- Bàn giao lead: cột "Việc cần làm" đọc CH4 sống (naLive) thay vì chữ next_action lưu sẵn.

FB-21 - trang "Tính năng khác" (menu gọn):
- Hub mới theo đúng mẫu hub chuẩn: 3 tab Bảo lưu/Bỏ học · Mã giới thiệu · Bàn giao lead,
  nhúng nguyên trang cũ (embed, không fork code). 3 trang lẻ ẩn khỏi menu; mọi go() cũ tự
  chuyển hướng đúng tab (KMAP). Nhóm CSKH & Kết thúc còn 2 mục, Quản lý còn 4 mục.

UX quick wins (từ báo cáo UX/UI):
- reRender giữ vị trí cuộn: xử lý hồ sơ giữa hàng đợi dài không còn bị nhảy về đầu trang.
- Thêm token --ink (5 component đang gọi biến chưa định nghĩa); chữ phụ xám nhạt (mut, empty,
  hvempty, jsw, jtlw, pempty, pcage) nâng về mức đọc được (chuẩn tương phản AA).
- Chip lọc đang bật màu amber/red/green: chữ đổi sang bộ màu đậm (trước gần như tàng hình).
- Focus ring toàn cục :focus-visible - dùng được bàn phím.
- Ô "trống" trong lưới thẻ chiếm đủ hàng (obcards>.empty), hết cảnh lệch trái.
- Trùng tên class .jcard (thẻ kanban vs panel hành trình) - panel đổi thành .jpanel (bài học V9.4).
- Ô thống kê tĩnh không còn hover giả như ô bấm được.
- Bàn giao lead hàng loạt có hộp xác nhận trước khi ghi; mọi re-render nội bộ của trang
  Bàn giao/Mã giới thiệu theo CUR (chạy đúng trong hub).
- Khối "Đăng ký còn nợ" ở Trang bắt đầu trỏ đúng tab Thanh toán đã lọc "Còn công nợ" (trước mở
  danh sách Học viên không lọc).

Sales quick wins:
- Màn gọi (bước liên hệ trong Chạy quy trình) hiện đủ "đạn": mục tiêu học, lịch rảnh, dự kiến
  bắt đầu, ghi chú lead - không phải rời màn hình lúc đang nghe máy.
- Drawer lead thêm 4 dòng: mục tiêu học, lịch rảnh, dự kiến bắt đầu, phân loại lead.

## ĐỢT 1B - NỀN DEMO ĐA CỔNG (Luân yêu cầu bổ sung 27/07) - ĐÃ XONG (V9.7)

Ngoài kế hoạch gốc, Luân yêu cầu: mỗi người một cổng, thao tác lưu thật để cổng bên kia thấy
(demo duyệt qua lại), reset về nguyên bản sau buổi demo, data tách file riêng. Đã làm trọn trong
V9.7: màn cổng chọn người (2 file), ITTs_data.js, localStorage + đồng bộ đa cửa sổ, nút Reset,
tab Cài đặt > Dữ liệu demo. Ghi chú kỹ thuật: file 02 mục 3sexies.

## ĐỢT 2 - NGÀY LÀM VIỆC CỦA SALES - ĐÃ XONG (V9.8, 27/07; thẩm định 2 vòng: sales veteran VER-01..11 + UX/UI UXV-01..10, vá hết)

Mục tiêu: sáng mở app biết ngay gọi ai trước, ghi nhận khách mới trong 15 giây, thấy KPI của mình.
1. (SAL-01) Chip "Tới hẹn hôm nay" trên Trang bắt đầu: lọc theo next_followup_time, sắp TĂNG theo
   giờ hẹn, dòng danh sách hiện giờ hẹn; hero hiện "cuộc hẹn kế tiếp". Dữ liệu có sẵn 111/224 lead.
2. (SAL-02) Bộ chọn "Tôi là..." (DL01) + toggle "Chỉ khách của tôi" áp vào hàng đợi + hero.
3. (SAL-03) Khối "KPI của tôi hôm nay/tuần": số cuộc gọi (DL02b theo staff_id), tỷ lệ kết nối,
   số chốt, doanh số (DL07 received_by). Báo cáo thêm bảng so theo NV cho trưởng nhóm.
4. (SAL-07) Nút "Khách mới liên hệ đến": tên + SĐT + kênh + nội dung tạo DL02 + DL02b (inbound)
   một phát; 3 chip preset kênh/chiều trong form ghi liên hệ.
5. (SAL-08 + CRM-01) Chặn trùng SĐT khi tạo lead (dò DL02+DL09, hiện lead cũ + NV phụ trách).
6. (SAL-13) Form từ chối có LÝ DO (học phí/thời gian/nơi khác/hết nhu cầu) + ô "chăm lại sau N ngày"
   ghi next_followup_time; chip Reup sắp theo ngày hẹn chăm lại.
7. (SAL-12) Nút "Sao chép tin xác nhận" sau thu tiền (dựng chuỗi dán Zalo) + bản in đơn giản.
8. (SAL-11) tvQuick/payQuick đổi dropdown dài thành ô tìm pkSearch. (SAL-18) chip hẹn nhanh
   "Chiều nay 15h / Tối nay 19h / Mai 9h / Tuần sau". (SAL-06) SĐT thành link tel: + nút copy.
9. (CRM-18) Lead mới mặc định assigned_to = người đang chọn ở "Tôi là..."; nút "Chia đều lead
   chưa có NV" trong Bàn giao lead.

## ĐỢT 2C - MÀN HÌNH THEO CHỨC DANH - ĐÃ XONG (V9.9, 27/07; quy trình mới: làm một mạch, hội đồng tổng kiểm cuối)

Luân: "đâu phải ai cũng được thấy đầy đủ". Hội đồng thiết kế ma trận CHỨC DANH x MÀN HÌNH
(menu nhóm nào, trang nào, khối số nào trên Trang bắt đầu, KPI nào, hành động nhạy cảm nào bị ẩn),
Luân duyệt ma trận rồi triển khai: gateEnter đọc role của người được chọn -> dựng ROLES động.
Lưu ý: đây là PHÂN QUYỀN GIAO DIỆN cho demo/vận hành gọn - chưa phải bảo mật thật (bản offline
không có xác thực; bản .gs sau này khóa theo email đăng nhập).

## ĐỢT 3 - HỌC VỤ & GIẢNG VIÊN - ĐÃ XONG (V9.10, 27/07, một mạch - chờ tổng kiểm cuối)

Mục tiêu: GV có trang của mình, học vụ thấy lớp nào có mùi, HV vắng có người gọi.
1. (HOC-02) Trang "Hôm nay của GV": chọn GV thấy buổi dạy hôm nay + giáo án buổi (sesPlan) +
   hàng đợi chấm của TÔI + buổi nợ nhận xét + HV cần lưu ý.
2. (HOC-03 + CRM-04) Hàng đợi "HV vắng chưa liên hệ": DL12 no_show 24-48h chưa có điểm chạm sau
   buổi, SLA slaAbsenceCall_hours (CH2 có sẵn, chưa ai dùng). Máy nhắc, người quyết cờ.
3. (HOC-07) Tab Lớp học của hub Học tập thêm cột sức khỏe: ATR/HCR/nguy cơ/GV trễ/nợ nhận xét
   so ngưỡng CH6 (tái dùng công thức renderBanglop) + chip lọc "dưới ngưỡng".
4. (HOC-04) Chọn Vắng khi điểm danh thì bật ô lý do (vắng phép bắt buộc).
5. (HOC-05) Ô điểm chấm bài giới hạn 0-9 bước 0.5; chấm bài chưa thu thì hỏi nộp đúng hạn/trễ.
6. (HOC-06) Bảng "chờ chấm" trong Hồ sơ GV có nút nhảy thẳng đúng lớp + đúng bài.
7. (HOC-08) Tab Học viên của Bảng lớp: chuyên cần/bài tập lọc theo đúng lớp (như portal đã làm).
8. (HOC-09) Mốc "Mock test giữa khóa" trong giáo án khóa + nhập điểm score_type=midterm - đổ vào
   cột "Giữa khóa" đã chừa sẵn trên trang HV. (Đây cũng là lỗ hổng SOP, không chỉ app.)

## ĐỢT 4 - KHÉP VÒNG ĐỜI + TIỀN - ĐÃ XONG (V9.11, 27/07, một mạch)

## ĐỢT 4B - "MỖI HỌC VIÊN / MỖI LEAD 1 DÒNG" - ĐÃ XONG (V9.12, 27/07)

Các trang tác vụ dạng lưới thẻ (Test, Xếp lớp, Kết thúc, Bảo lưu, Buổi học, WOW...) chuyển thành
danh sách MỖI NGƯỜI 1 DÒNG kiểu hàng đợi Chạy quy trình: tên bấm drawer + thông tin gọn + chip
trạng thái + hạn/bước kế + nút hành động bên phải. Chi tiết dài (stepper, lý do) vào drawer.

1. (CRM-02) 2 rule mới: lớp sắp kết thúc trong thresholdPreEnd_days (30) ngày -> việc chuẩn bị
   test cuối + khảo sát end_of_course; lớp ĐÃ kết thúc mà còn HV chưa có DL18 -> việc đỏ mở ktGen.
2. (CRM-03) jStageOf sửa nhánh đa khóa: bỏ qua DL18 đã có next_enrollment_id / cũ hơn ob đang học
   (HV061 đang kẹt alumni). Đối chiếu cách portal xử lý HVCLASS.
3. (CRM-05) Hoàn tiền tính TIỀN thật: gợi ý % theo 3 mốc refundFull/Partial/Reduced_days của CH2,
   ghi bút toán âm để doanh thu trừ đúng; sổ hoàn tiền nằm trong trang Duyệt.
4. (CRM-10) bizGuard chặn đóng thừa (amt > remaining) + cảnh báo cọc dưới thresholdDeposit_minimum.
5. (CRM-16) Cột hẹn thu tiếp next_payment_due + chip "Tới hẹn thu" trong tab Thanh toán.
6. (CRM-11) In phiếu thu + xác nhận ĐK (template HTML + window.print, chạy offline).
7. (HOC-15) Kết thúc khóa: tự gợi ý đạt/chưa đạt theo final vs target (người xác nhận); nhánh riêng
   cho HV trượt target (ghi next_course_recommendation + gợi ý ưu đãi) trước khi mời tái ĐK.
8. (HOC-16) completion_time mặc định = class_end_date; không ép completed khi còn lớp đang học.
9. (HOC-18 + CRM-07b) Bảo lưu có HẠN (pause_until): nhắc trước 2 tuần đúng như SOP đã hứa.
10. (CRM-19) Bước "Xin cảm nhận (testimonial)" khi HV đạt mục tiêu + rule slaTestimonialAsk_days.

## ĐỢT 5 - ĐIỀU PHỐI & LỊCH - ĐÃ XONG (V9.13, 27/07, một mạch)

1. (HOC-11 + CRM-13) Trang "Lịch tuần": lưới 7 ngày theo GV (toggle theo lớp/phòng) từ DL11 + DL03
   + DL14, chip bấm mở drawer; cảnh báo lớp chưa gán GV, GV 2 buổi cùng khung giờ. Chỉ xem, không kéo thả.
2. (HOC-10 + CRM-12) Hủy buổi bắt lý do + checklist báo HV; dạy bù tạo BẢN GHI MỚI (giữ vết buổi
   hủy), cho chọn GV dạy thay - thao tác đổi GV đầu tiên của app.
3. (HOC-12) WOW: ô ngày thành date picker; hiện lịch bận của GV đã chọn ngay dưới form.
4. (HOC-13) wowCancel (hoàn quota) + wowReschedule (giữ quota) - NA077 đã có mã mà chưa có đường tạo.
5. (HOC-19) Điểm danh trạng thái "học bù" trỏ buổi gốc (ATR tính về lớp gốc); luồng chuyển lớp
   giữa khóa (mở rộng obChange, chốt mốc buổi).

## ĐỢT 6 - HOÀN THIỆN HỆ THỊ GIÁC + BÁO CÁO - ĐÃ XONG PHẦN CHÍNH (V9.14, 27/07; còn UX-39/12/13/06 chờ tổng kiểm)

1. (UX-05) Font weight quy về 2 mức 400/700 (hiện 7 mức, có 650/750 không tồn tại trong font).
2. (UX-06) Màu ngoài token map về token; thêm --purple/--teal/--pink nếu thật cần.
3. (UX-12) 8 chỗ còn bộ lọc kiểu cũ .fbar/.fchips chuyển sang segHTML/tbar (chuẩn V6.2).
4. (UX-13) 6 kiểu "ô số" hợp nhất quanh statStrip.
5. (UX-16) Empty state khi đang lọc có nút "Xóa lọc"; bảng rỗng thật có nút hành động chính.
6. (UX-18/19/20) Bảng: header dính thật (max-height), sắp xếp khi bấm tiêu đề, chọn 20/50/100
   dòng/trang, cột tiền căn phải tabular-nums.
7. (UX-21) Toast lỗi khác toast thành công (đỏ, 6s, giữ drawer mở để thử lại).
8. (UX-22) Esc đóng drawer/confirm; role=dialog.
9. (UX-23) Bỏ tiêu đề trang in 2 lần (topbar + phead) - lấy lại ~46px màn laptop.
10. (UX-30) Quét nhãn Anh-Việt: "Chờ gửi info" -> "Chờ gửi thông tin lớp", "Gửi review" ->
    "Gửi khảo sát", "Note sau buổi" -> "Ghi chú sau buổi", "Testimonial" -> "Cảm nhận học viên"...
11. (CRM-08) Bảng hiệu quả NGUỒN lead: nguồn -> test -> ĐK -> doanh thu -> CVR (dữ liệu sẵn có).
12. (CRM-09) Báo cáo có bộ chọn kỳ (tháng này / 30 ngày / 90 ngày / tất cả).
13. (UX-15) Ô thống kê thêm dòng so kỳ trước (+/-% xanh đỏ).
14. (CRM-17) markRow ghi updated_by/updated_at khi sheet có cột (chuẩn bị nền phân quyền).
15. (CRM-21) Nhóm mẫu "tin gửi khách" trong CH4 + nút "Copy tin Zalo" ở các drawer.
16. (CRM-22) Khối "Công tháng" trong Hồ sơ GV (số buổi dạy theo tháng - căn cứ trả lương buổi).

## ĐỢT 7 - CỔNG HỌC VIÊN - ĐÃ XONG (V9.14, 27/07; UX-39 font offline để lại)

1. (UX-35/36) "Sắp tới" đưa lên vị trí 2; hero thêm dòng "Buổi tiếp theo: T5 19/06 18:00 - GV Vy".
2. (UX-37) Giải thích "WOW"/"quota" bằng tiếng học viên lần xuất hiện đầu.
3. (UX-38) Thanh mobile thêm 2 nút tắt "Lịch sắp tới" + "Góp ý".
4. (UX-39) Nhúng Montserrat woff2 offline (mặt tiền không được rơi font khi mạng chậm).
5. (HOC-20) Khối "Gửi phụ huynh": tóm tắt tháng (chuyên cần, bài tập, nhận xét, mốc điểm).

## ĐỢT 8 - CHẶNG VÒNG ĐỜI + HỆ NODE + DỮ LIỆU DEMO SỐNG - ĐÃ XONG (V9.15, 28/07; yêu cầu trực tiếp của Luân 27/07)

1. Tầng ARC 4 chặng vòng đời phủ trên 17 chặng hành trình (không đổi máy trạng thái).
2. Menu NAVTREE 2 tầng theo chặng - mục con hub (test/tư vấn/thanh toán/WOW/bảo lưu/mã GT/reup) trở lại menu, lọc theo chức danh như cũ.
3. 4 trang "Tổng quan chặng": ray ga node 44px + %% chuyển đổi + ga rẽ nhánh thoi + ga ghost + nghiệp vụ trong chặng + sổ trực lọc theo ga.
4. Node 3 tầng: nrail / mstrip dải hạt trên mọi dòng danh sách (12 trang + sổ trực + bảng hành trình + tra cứu) / sopBlock "block nghiệp vụ cần thiết" (hồ sơ 360 + 2 drawer).
5. Tab "Chăm lại / Reup" trong Tuyển sinh (kho remarketing khách đã ngưng).
6. Dữ liệu demo đại tu theo spec tester: 0 placeholder, lịch tương lai, 4/4 GV dạy hôm nay, hàng chờ quyết định sống 7 loại, chuông 289 -> 87 việc (26.4%% quá hạn), DL19 thưởng giới thiệu, C-07/C-08.
7. Vá: T-01 [object Object] (esc(sp.hw.title)), C-01 "-đ", C-04 openTrangHV chết, C-05 tra cứu không dấu, demoBoot chạy autoReturnHandovers trước khi chụp __base (hết "thay đổi demo" oan).
8. _check11 (68 điểm) - tổng suite 366 điểm; font icon dựng lại (130).

## KHÔNG LÀM (thống nhất cả 4 chuyên gia - đúng quy mô, đúng triết lý dự án)

- Không tích hợp Zalo OA / SMS / tổng đài / email tự động (nút Copy tin đạt 90% giá trị, 2% chi phí).
- Không lead scoring máy, không kanban kéo-thả (chặng là DẪN XUẤT từ dữ liệu thật, kéo thả phá máy trạng thái).
- Không hệ đăng nhập/phân quyền đầy đủ ở giai đoạn này (chỉ chuẩn bị nền: updated_by/at, "Tôi là...").
- Không tự động hóa 2 cờ nguy cơ (đã chốt: máy nhắc, người quyết).
- Không đẻ trang danh sách đổ bảng DL (bài học V5.9/V6.0), không module chấm công/bảng lương đầy đủ,
  không bảng chiến dịch marketing khi chưa chạy quảng cáo có cấu trúc.

## Nguyên tắc triển khai (giữ nguyên thói quen đã thống nhất)

- Mỗi đợt một phiên, build + verify harness + Luân xem rồi mới sang đợt kế - tránh đổi quá nhiều một lúc.
- Thứ tự đề xuất: 2 -> 3 -> 4 -> 5, đợt 6/7 rải xen. Luân có thể đảo (vd cần demo cho phụ huynh thì đẩy đợt 7 lên).
- Mọi hằng số mới đi qua CH2/APPPARAMS; câu nhắc mới đi qua CH4; icon mới phải dựng lại font subset.
