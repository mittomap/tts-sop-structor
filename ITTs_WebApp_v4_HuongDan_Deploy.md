# ITTs Web App v4 - Hướng dẫn cài đặt & kiểm thử (vận hành thật)

File `ITTs_WebApp_v4.gs` là phiên bản web app **nối thẳng Google Sheets thật**: đọc dữ liệu từ 19 sheet DL, ghi bằng script (sinh mã, kéo công thức, dấu giờ tự động), đăng nhập theo email Google.

> Đây là **v1 của bản vận hành thật** - cần deploy lên chính file Google Sheets của anh rồi test theo checklist bên dưới. Em không chạy thử được trên môi trường ngoài, nên mình sẽ tinh chỉnh sau vòng test đầu.

---

## 0. Điều kiện trước khi cài
1. Hệ Sheets đã chạy `CAI DAT BAN DAU` (để có sẵn named range `enum_*` và các param như `thresholdDiscount_approval`). Web app đọc enum/param từ đây.
2. **Cột `email` ở DL01** điền đúng email Google của từng nhân viên (đăng nhập tự nhận vai trò qua email này). Nếu để trống, app vẫn chạy nhưng hiện màn chọn vai trò thủ công (dùng để test).

## 1. Dán code
1. Mở Google Sheets của anh → **Tiện ích mở rộng > Apps Script**.
2. Mở file script đang chứa web app cũ (thường tên `ITTs_WebApp` hoặc `Code`) → **xóa hết nội dung** → dán toàn bộ `ITTs_WebApp_v4.gs` vào → **Ctrl+S**.
3. Giữ nguyên 2 file `ITTs_XuLyDuLieu.gs` và `ITTs_Form_NhapLieu.gs` (không đụng).

## 2. Deploy (bản triển khai mới)
- Lần đầu: **Triển khai > Bản triển khai mới > Loại: Ứng dụng web**.
  - **Thực thi bằng:** *Tôi* (Me) — để app có quyền đọc/ghi sheet.
  - **Ai có quyền truy cập:** *Bất kỳ ai trong <tổ chức của anh>* (để đăng nhập theo email công ty chạy đúng). Nếu dùng Gmail thường, chọn "Bất kỳ ai" và app sẽ hiện màn chọn vai trò.
  - Bấm **Triển khai** → lần đầu Google hỏi cấp quyền → **Cho phép**.
- Các lần sau (cập nhật code): **Triển khai > Quản lý bản triển khai > (biểu tượng bút chì) > Phiên bản: Mới > Triển khai**. (Hay quên bước tạo phiên bản mới → mở ra vẫn thấy bản cũ.)
- Copy **URL ứng dụng web** để dùng / chia sẻ cho nhân viên.

## 3. Checklist kiểm thử (làm theo thứ tự)

**A. Đăng nhập & đọc**
- [ ] Mở URL → nếu email anh có trong DL01: vào thẳng đúng bộ trang theo vai trò. Nếu hiện màn chọn vai trò: email chưa khớp DL01 (bổ sung email), tạm thời chọn 1 vai trò để test tiếp.
- [ ] Mở lần lượt các trang (Tổng quan, Việc hôm nay, danh sách lead/HV/đăng ký...) → **số liệu phải khớp với dữ liệu thật trên sheet**.
- [ ] Đổi vai trò ở góc phải trên (nếu là quản lý) → bộ trang đổi theo.

**B. Ghi - Nhập lead** (trang Nhập lead > Thêm mới)
- [ ] Điền form, Lưu → báo "Đã lưu L-2026-xxxxx vào sheet".
- [ ] Mở DL02: có dòng mới, mã đúng, cột công thức (next_action, *_name...) tự tính, `assigned_to` là link.

**C. Ghi - Duyệt chiết khấu** (vai trò Quản lý > Duyệt)
- [ ] Bấm **Duyệt** một khoản → mở DL06: `discount_approved_by` + `discount_approved_at` được điền.

**D. Ghi - Điểm danh** (vai trò Giáo viên > Điểm danh)
- [ ] Chọn lớp, chạm trạng thái từng HV, **Lưu điểm danh** → mở DL12: có các dòng mới, `attendance_status` đúng, `check_in_time` tự dấu giờ.

**E. Ghi liên hệ nhanh** (trang Nhập lead > nút "Ghi liên hệ" trên 1 dòng)
- [ ] Mở form đã chọn sẵn khách → Lưu → DL02b có dòng mới, `contact_count`/`last_contact_time` của DL02 tự cập nhật.

**F. Sửa & đổi trạng thái nhanh (mới)**
- [ ] Bấm **Sửa** trên một dòng (vd Nhập lead) -> form hiện sẵn dữ liệu -> đổi 1 ô -> **Cập nhật** -> mở sheet: đúng dòng đó đã đổi, cột công thức tự tính lại.
- [ ] Ở cột trạng thái, đổi ô chọn (vd lead_status của một lead) -> mở sheet: ô đã đổi + dấu giờ liên quan (nếu có) tự điền.
- [ ] Thử nhập SĐT sai ("123") hoặc số tiền âm -> app chặn và báo lỗi (không ghi).

**G. Duyệt/Từ chối/Hoàn tiền + Điểm danh chống trùng + Phân quyền (mới)**
- [ ] Vai trò Quản lý > Duyệt: bấm **Từ chối** một CK -> mở DL06: discount_amount về 0, discount_approved_by ghi "Tu choi - ...", final_fee/remaining tự tính lại. Bấm **Xử lý hoàn** -> notes ghi "Da xu ly hoan tien...".
- [ ] Điểm danh: chọn 1 lớp + 1 buổi, lưu; rồi lưu lại LẦN NỮA cùng buổi -> mở DL12: KHÔNG sinh dòng trùng (báo "x cập nhật, 0 thêm mới").
- [ ] Đăng nhập tài khoản Giáo viên (email có trong DL01) -> thử ghi ở mục ngoài quyền -> bị chặn, báo "...không được phép... (CH3)".

**H. Luồng công việc (mới)**
- [ ] Mở **Phễu vận hành** -> thấy khách xếp theo cột giai đoạn. Bấm một nút **"Bước tiếp theo"** trên thẻ -> mở đúng form bước kế, đã điền sẵn khách đó -> điền nốt -> Lưu -> mở sheet kiểm tra bản ghi mới đã liên kết đúng.

Nếu bước nào lỗi: chụp lại thông báo lỗi (app hiện "Lỗi: ..." ở dưới) gửi em để sửa đúng chỗ.

## 4. Đang thật tới đâu (trung thực)
**Đã vận hành thật:** đọc mọi trang từ sheet sống; **phễu vận hành + nút "Bước tiếp theo" mang sẵn khách + timeline hành trình**; ghi Thêm mới + **Duyệt / Từ chối / Xử lý hoàn tiền** + **Điểm danh (chống trùng theo HV + buổi)**; **sửa bản ghi tại chỗ**; **đổi trạng thái nhanh trên dòng**; **kiểm tra dữ liệu (SĐT, số tiền, điểm 0-9)**; **phân quyền ghi/duyệt theo CH3 ở server**; **phân biệt 3 cấp quản lý (Tư vấn / ACA / Giám đốc)** - mỗi người dashboard + bộ trang riêng; **NV chỉ thấy lead/việc của mình** (theo assigned_to), quản lý/giám đốc thấy tất cả; **màn Bàn giao** chuyển lead giữa NV; **trang Cài đặt** sửa Ngưỡng & SLA (CH2) + KPI (CH6) + xem Nhân viên/Email ngay trên web (chỉ quản lý/giám đốc, ghi vào named range); sinh mã; kéo công thức dòng trên xuống; dấu giờ tự động; đăng nhập theo email.

**Về phân quyền:** nhân viên có email trong DL01 bị giới hạn đúng vai trò (vd Giáo viên không ghi được Lead / Thanh toán; chỉ Quản lý được Duyệt/Hoàn tiền). Email KHÔNG có trong DL01 được coi là admin (ghi được tất cả) — nên khi deploy chọn **"Ai có quyền truy cập = trong tổ chức của anh"** để chỉ nhân viên công ty vào được. Muốn tắt tạm kiểm quyền khi test: đặt `PERM_ENFORCE = false` ở đầu file.

**Chưa làm (P1):**
- Tối ưu tốc độ khi data rất lớn (hiện tải toàn bộ khi mở; hàng nghìn dòng cần phân trang phía server).
- Nhắc việc tự động theo SLA (trigger thời gian gửi email/Zalo).
- Filter theo ngày/NV, sort cột, nhật ký thao tác, báo cáo nối CH6 + biểu đồ + xuất file.

## 6. GĐ2 - Luồng công việc thật (mới, thay cho bảng nhập)

7 màn nghiệp vụ trước đây là **bảng + form** nay được thiết kế lại thành **luồng công việc theo thẻ**: mỗi hồ sơ là 1 thẻ có **thanh 4 bước** (đánh dấu đã/chưa xong) và **nút hành động đúng bước kế tiếp**. Mỗi bước là 1 *dấu hoàn thành* ghi thẳng vào sheet - nhờ đó cảnh báo quá hạn tự tắt khi đã làm.

- **Xếp lớp & Onboarding** (DL08): Xếp lớp → **Đã gửi thông tin lớp** → HV xác nhận → Hoàn tất. Nút "Đã gửi thông tin lớp" tắt cảnh báo quá 24h chưa gửi info. Nút "Xếp lớp học viên" chọn HV chưa xếp + lớp còn chỗ.
- **Test đầu vào** (DL03): Đặt lịch → HV dự test → **Nhập kết quả** (4 kỹ năng + overall) → Đã tư vấn. Lọc "Quá hạn chấm".
- **Tư vấn & Đăng ký** (DL04→DL06): Ghi nhận tư vấn (khóa/lộ trình) → Cập nhật chốt → **Tạo đăng ký** (sinh bản ghi DL06).
- **Thu & xác nhận Thanh toán** (DL06+DL07): xem công nợ (Tổng/Đã thu/Còn) → **Ghi nhận thanh toán** (tạo DL07, tự cập nhật đã thu/còn lại/trạng thái) → **Xác nhận đã nhận**.
- **Buổi WOW 1-1** (DL14): Đặt buổi → Xác nhận → Đã dạy → **Ghi nội dung buổi** (tắt cảnh báo ghi chú 24h). Có "HV không đến".
- **Khiếu nại** (DL17): Tiếp nhận → **Phân công** → Bắt đầu xử lý → **Đóng khiếu nại** (tắt cảnh báo SLA theo mức độ). Có "Leo thang".
- **Kết thúc & Tái ghi danh** (DL18): **Nhập kết quả đầu ra** → Mời tái ghi danh → Chốt tái ĐK.

**Một cột cần thêm (chỉ 1):** để dấu **"Đã gửi thông tin lớp"** lưu được trên sheet thật, thêm 1 cột tên `class_info_sent_at` vào cuối **DL08**. Chưa thêm thì nút vẫn bấm được (không lỗi) nhưng tải lại sẽ mất dấu. Các luồng còn lại dùng cột đã có sẵn, lưu ngay không cần sửa gì.

> Trong bản demo offline `ITTs_WebApp_Full_v3.html` mọi luồng bấm chạy đầy đủ (dữ liệu đổi trong phiên) để anh trải nghiệm trước.

## 7. GĐ3 - Trung tâm cảnh báo + Báo cáo biểu đồ + Mobile (mới)

- **Việc hôm nay = Trung tâm cảnh báo SLA**: gom TẤT CẢ việc dở-dang có dấu hoàn thành về một chỗ (chưa gửi thông tin lớp, test chưa chấm, WOW chưa ghi nội dung, khiếu nại quá hạn, thu chờ xác nhận, bài chưa chấm, HV nguy cơ, lead cần gọi gấp...). Mỗi việc có tag nhóm + độ trễ ("quá X giờ/ngày") + nút **Xử lý** nhảy thẳng tới đúng luồng (đã lọc sẵn). Làm xong ở luồng là việc **tự biến mất** khỏi đây. Lọc theo: Tất cả / Quá hạn / Tuyển sinh / Học vụ / Tài chính / CSKH. Chuông ở sidebar hiện số việc **quá hạn**.
- **Tổng quan**: 2 khung "Việc cần làm hôm nay" + "Quá hạn cần xử lý ngay" lấy cùng nguồn cảnh báo trên.
- **Báo cáo & KPI**: thẻ KPI tô màu theo ngưỡng + **biểu đồ** (phễu chuyển đổi kèm % từng bước, doanh thu đã thu theo tháng, donut phân bố trạng thái lead, cột chuyên cần/học thuật). Biểu đồ vẽ bằng SVG thuần - chạy cả offline lẫn trên Apps Script, không cần thư viện ngoài. Ngưỡng KPI chỉnh ở **Cài đặt > CH6**.
- **Mobile**: sidebar thu thành ngăn kéo (nút ☰ ở góc trái); lưới KPI/thẻ/biểu đồ tự xếp lại cho màn hình nhỏ.
- **Nhắc việc email (ITTs_Reminders.gs)**: đã thêm 2 tình huống quá hạn khớp dấu hoàn thành mới - **"Chưa gửi thông tin lớp"** (chỉ chạy khi DL08 đã có cột `class_info_sent_at`) và **"WOW chưa ghi nội dung"**. Đánh dấu xong trong app là email hết nhắc. Cập nhật file này lên Apps Script cùng bản v4 (nếu đang dùng nhắc việc tự động).

## 8. Đợt "nâng tầm" - logic ghi thật & đúng SOP (mới nhất)

Audit toàn app phát hiện và đã sửa các chỗ **trước đây chỉ giả lập**:

- **Duyệt CK & Hoàn tiền ghi thật**: Duyệt = ghi người duyệt + thời điểm; Từ chối = CK về 0, học phí tính lại theo giá gốc, ghi chú lý do; Hoàn tiền = ghi chú + trạng thái refunded. Ngưỡng đọc từ CH2 (thresholdDiscount_approval). Nối server qua `apiApprove`.
- **Điểm danh lưu thật**: trạng thái nạp theo ĐÚNG buổi đang chọn (không phải buổi bất kỳ), lưu chống trùng (cập nhật nếu đã có), tự đóng dấu giờ check-in, hiện "đã điểm danh". Nối `apiAttendanceSave`.
- **Chấm bài đóng dấu `graded_at` + cờ 48h** (trước đây quên → cảnh báo không tắt; còn ghi đè sai trạng thái nộp - đã sửa).
- **Ghi liên hệ cập nhật ngược lead**: contact_count +1, last_contact_time, first_call_time (lần đầu), lead new → contacted. NV + giờ tự điền theo tài khoản.
- **Tạo đăng ký tự sinh hồ sơ Học viên** từ lead (nếu chưa có): mã HV mới, SĐT/đối tượng/cơ sở kéo theo, trạng thái Đang học, **quota WOW gán theo khóa** (DL05.wow_quota_default), lead chuyển "converted".
- **Xếp lớp cộng sĩ số lớp** (current_enrollment +1) và ghi về DL10.
- **Đặt WOW trừ quota** (used +1 / remaining -1, chặn khi hết quota), quota hiện ngay trong ô chọn HV.
- **Khoản thu ghi NV thu (received_by)** theo tài khoản.
- **Thêm mới ở mọi trang danh sách giờ ghi thẳng vào sheet** (trước chỉ lưu tạm trong phiên).
- **Validate ngày chặt** (32/13, 29/02 năm thường... bị chặn) + SĐT như cũ.

## 9. Đợt "số liệu đúng & đáng dùng" (mới nhất)

Rà lại mọi con số trên Tổng quan / Báo cáo / Phễu, sửa các chỗ **tính sai** và thay chỉ số ít giá trị bằng thứ người vận hành cần:

- **Lỗi tính nặng đã sửa**: "Bài đã chấm" trước luôn = 0 (đếm theo trạng thái `graded` không tồn tại) → nay đếm theo dấu chấm thật (`graded_at`/điểm): 232/318. "Bài chờ chấm" 318 → 16 (thật). "Chấm đúng 48h" nhận cả giá trị "Có/True". Việc "Chấm bài tập" ở trung tâm cảnh báo 248 → 16 (loại bài đã chấm) - tổng việc SLA từ 450 → 218, hết cảnh báo ảo.
- **Tổng quan thêm "Sắp diễn ra trong 7 ngày"**: Hẹn gọi lại · Test đầu vào · Buổi học · Buổi WOW (bấm ô nào nhảy trang đó) - trả lời câu "hôm nay cần làm gì" nhanh nhất.
- **Doanh thu tháng này kèm ▲/▼ % so tháng trước** (xu hướng, không chỉ con số trơ).
- **Điểm danh đổi thành "30 ngày gần nhất"** (all-time che mất vấn đề hiện tại).
- **Phễu vận hành: "Dự báo doanh thu theo xác suất giai đoạn"** (lead mới 10%, đã liên hệ 25%, đã test 45%, đã tư vấn 65%, chờ thu 90%) - thay tổng thô dễ gây ảo tưởng.
- **Báo cáo: ngưỡng CVR đọc từ CH6** (0.4 → 40%), phễu đếm khách duy nhất.
- **Chấm bài: bài nhiều tồn nhất lên đầu**, nhãn "x chưa chấm/y HV", HV chưa chấm xếp trước.
- **Generator V4 dọn sạch bản vá cũ** (duyệt/điểm danh/lưu form đã native) - V4 từ nay luôn build cùng V3, sẵn dán lên soptemp.

## 9b. App tự tính cột dẫn xuất - KHÔNG lệ thuộc công thức trên sheet (mới, quan trọng)

Các cột như `first_call_time`, `last_contact_time`, `contact_count`, `attendance_rate`, `completion_rate`, `final_fee`, `paid_amount`, `remaining_amount`, `first_enrollment_date`, `last_learning_activity_time`, `wow_quota_*`, và mọi cột `*_name` là **công thức trên sheet**. Nếu công thức đó không chạy (vùng dò bị chặn, cột mã là HYPERLINK, ô lỗi...), trước đây app hiện trống theo.

Từ bản này, app **tự tính lại các cột đó từ dữ liệu gốc** (DL02b, DL07, DL12, DL13, DL14...) theo nguyên tắc: **sheet có giá trị thì tôn trọng giá trị của sheet; sheet để trống thì app tự tính**. Nhờ vậy giao diện luôn đủ số liệu, bất kể công thức trên sheet có chạy hay không - và **không cần sửa gì trên file của anh**.

Đã kiểm chứng: xóa trắng 3.869 ô của đúng những cột này rồi mở app → app khôi phục đầy đủ, đối chiếu từng con số khớp với dữ liệu gốc (lần gọi đầu/cuối khớp lịch sử liên hệ; tiền đã thu khớp tổng phiếu thu).

## 9c. Muốn CHÍNH SHEET cũng hiện đủ: `fixDerivedColumns()` (nằm trong ITTs_SeedDemo.gs)

Mục 9b chỉ làm app hiển thị đủ; trên sheet các ô đó vẫn trống. Muốn sheet cũng hiện, chạy hàm **`fixDerivedColumns`** — đã gộp sẵn trong `ITTs_SeedDemo.gs`, không cần file riêng.

- Chạy `fixDerivedColumns` khi `DRY_RUN = true` → báo cáo **sẽ điền bao nhiêu ô**, chưa ghi gì. Đổi `DRY_RUN = false` → chạy lại để ghi thật (tự sao lưu trước).
- Sau `seedDemo`/`resetDemo` nó **tự chạy** (tắt bằng `AUTO_FIX_DERIVED = false`) — bơm demo xong là sheet đủ số luôn.

**Cách nó làm:** tự đọc dữ liệu gốc rồi **tự tính bằng JavaScript** — không dùng COUNTIF/VLOOKUP nên **không quan tâm cột mã là HYPERLINK hay không**, cũng không cần nới vùng công thức. Vì thế chạy được bất kể sheet đang gặp lỗi loại nào.

**An toàn:** chỉ ghi vào ô đang **trống hoặc lỗi** (`#REF!`, `#N/A`...). Ô nào **công thức đang chạy đúng thì giữ nguyên công thức**. Không xóa dòng, không đổi lưới, tự sao lưu trước khi ghi.

Đã kiểm chứng trên sheet mô phỏng dựng đúng bệnh: ô trống → điền đúng; ô `#REF!` → điền đúng; ô có công thức chạy tốt → **giữ nguyên công thức**; cột mã là HYPERLINK vẫn tra ra tên; tiền 10tr/7tr/3tr, quota 8/2/6, chuyên cần 67%, nộp bài 50% — khớp từng con số.

## 9d. Ghi nhận cuộc gọi KHÔNG kết nối được (mới)

Trước đây ghi liên hệ xong là lead bị đánh dấu "Đã liên hệ, đang khai thác" — kể cả khi gọi không ai bắt máy. Sai cả hai đầu: công sức gọi của NV không được ghi nhận, mà lead thì bị coi như đã khai thác.

Form **Ghi liên hệ** nay có ô bắt buộc **Kết quả liên hệ**:

| Kết quả | Hệ thống làm gì |
|---|---|
| Kết nối được | Lead → *Đã liên hệ, đang khai thác*; xóa chuỗi gọi hụt |
| Khách hẹn gọi lại | Như trên + đặt lịch hẹn (NV tự chọn giờ, để trống thì +24h) |
| Gọi - không nghe máy | **Giữ nguyên trạng thái**, +1 lần thử, tự hẹn gọi lại sau 3h |
| Máy bận / thuê bao | Như trên, hẹn lại sau 6h |
| Đã nhắn - chưa trả lời | Như trên, hẹn lại sau 24h |
| Sai số / không dùng số này | Lead → *Hết cách liên lạc* ngay |

**Ảnh hưởng tới SLA — đúng theo SOP:**

- Một **nỗ lực gọi** (dù không ai bắt máy) đã đủ **tắt cảnh báo "chưa gọi trong 15 phút / quá 4 giờ chưa gọi"** — NV không bị phạt vì khách không nghe máy. Thay vào đó xuất hiện nhóm việc mới **"Gọi lại - chưa kết nối"** khi đến giờ hẹn.
- Gọi hụt **liên tiếp đủ 3 lần** (`attemptsNoResponse`) → lead tự chuyển **Không liên lạc được** + cảnh báo đỏ **"Đổi kênh liên hệ"** (Zalo/SMS theo SOP 3 lần). Đủ 5 lần (`attemptsUnreachable`) → **Hết cách liên lạc**.
- Gọi lại mà **gặp được** → chuỗi hụt reset về 0, mọi cảnh báo trên tự tắt.

Trong drawer lead có dòng cảnh báo **"Đã thử N lần chưa kết nối được"** và mỗi lượt liên hệ hiện chip xanh/vàng theo kết quả.

Demo có sẵn: 30 lead đang có chuỗi gọi hụt (16 lead đã ≥3 lần), tổng 135 lượt gọi hụt các loại.

## 9e. Mọi ngưỡng/SLA đều sửa được ở trang Cài đặt (mới)

**Lỗi đã sửa:** app gọi một số tham số bằng tên KHÔNG có trong CH2 (`slaTestResult_hours`, `slaHomeworkGrade_hours`, `slaComplaintHigh/Med/Low_hours`, `slaWowNote_hours`...) nên nó luôn chạy bằng giá trị mặc định cứng — sửa trên sheet không có tác dụng. Nay app nối đúng tên thật trong CH2:

| App dùng | Thực tế đọc từ CH2 |
|---|---|
| Hạn chấm test đầu vào | `slaGLA_hours` |
| Hạn chấm bài tập | `slaHomeworkGrading_hours` |
| Hạn xử lý khiếu nại Cao/TB/Thấp | `slaKN_high_hours` / `slaKN_medium_hours` / `slaKN_low_hours` |
| Hạn ghi nội dung buổi WOW | `slaWowOutcomeRead_hours` |
| Số lần gọi hụt -> hết cách liên lạc | `thresholdContacted_attempts` |
| Gọi lead mới trong bao lâu | `slaLRT_minutes` |
| Hạn tư vấn sau khi có KQ test | `slaCVT_hours` |

**Trang Cài đặt > Ngưỡng & SLA (CH2)** nay chia 2 phần:

1. **20 tham số app đang dùng trực tiếp**, gom theo nhóm: *Tuyển sinh - Lead / Test & Tư vấn / Tài chính / Học vụ - Xếp lớp / Học vụ - Lớp học / WOW & CSKH*. Mỗi dòng ghi rõ ý nghĩa, đơn vị, và tên thật trên sheet.
2. **45 tham số khác trong CH2** (dùng cho quy trình/báo cáo) vẫn liệt kê đầy đủ để sửa.

Tham số app cần mà CH2 **chưa có** (`slaRetryCall_hours`, `attemptsNoResponse`, `thresholdDebtAlert`, `thresholdSurveyFollowup_score`) hiện nhãn **"chưa có trên sheet"** — bấm Lưu là **server tự thêm dòng mới vào CH2** kèm ý nghĩa + đơn vị và đặt named range, từ đó thành cấu hình sống như mọi tham số khác.

Đã kiểm chứng: đổi `attemptsNoResponse` 3 → 2 thì số lead cần đổi kênh nhảy 16 → 24; đổi ngưỡng duyệt CK và hạn chấm test cũng cập nhật cảnh báo ngay lập tức.

## 9f. Danh mục & Nhân viên: sửa / thêm mới ngay trên app (mới)

Trước đây 2 tab này chỉ xem. Nay:

**Danh mục (CH1)** — ô tìm kiếm nhanh; mỗi danh mục là 1 bảng:

- **Sửa nhãn hiển thị** từng giá trị (mã giữ nguyên để dữ liệu cũ không hỏng).
- **Thêm giá trị mới** (nhập mã + nhãn; chặn mã trùng, chặn mã sai định dạng).
- **Xóa giá trị**, có cảnh báo kèm **số dòng dữ liệu đang dùng** giá trị đó.
- Trên sheet: thêm giá trị = **chèn 1 dòng bên trong vùng named range** nên vùng tự nới → **ô Kiểm tra dữ liệu ở các sheet DL cũng tự có lựa chọn mới**, không phải sửa tay.

**Nhân viên (DL01)**:

- **Thêm nhân viên** (tự sinh mã NVxxx, kiểm tra email và SĐT hợp lệ).
- **Sửa tại chỗ** họ tên / email / vai trò / trạng thái từng dòng, bấm Lưu là ghi thẳng vào DL01.
- Nhân viên mới dùng được ngay ở mọi ô chọn NV phụ trách / GV dạy / người xử lý.

**Sửa/xóa danh mục có dữ liệu đang dùng — có xử lý dữ liệu kèm theo:**

- **Sửa nhãn**: dưới ô nhập có sẵn tick **"cập nhật luôn N dòng dữ liệu đang dùng"** (mặc định bật). Bật → mọi dòng mang mã đó được ghi lại nhãn mới, app và sheet hiện thống nhất. Tắt → chỉ đổi danh mục, dữ liệu cũ giữ nguyên chữ cũ (dùng khi muốn giữ nguyên lịch sử).
- **Xóa** giá trị đang có dữ liệu → mở hộp thoại nêu rõ **bao nhiêu dòng, ở sheet/cột nào**, và bắt chọn cách xử lý: **chuyển sang một giá trị khác** trong danh mục, hoặc **để trống**. Chuyển xong mới xóa — không để dòng nào mồ côi. Giá trị chưa ai dùng thì chỉ hỏi xác nhận đơn giản.

Đã kiểm chứng: sửa nhãn có tick → 51 dòng đổi theo; bỏ tick → dữ liệu giữ nguyên; xóa `no_response` (16 dòng) chuyển sang `unreachable` → 8 + 16 = 24 dòng đúng; xóa `rejected` chọn để trống → 16 dòng về trống. Thêm NV mới + sửa email/vai trò/trạng thái vào đúng chỗ; đếm "đang dùng" chính xác (`converted` = 81 dòng, `missing` = 46 dòng).

## 9g. Đợt góp ý vận hành (mới nhất)

1. **Bộ lọc xếp đúng thứ tự quy trình** — chip lọc ở mọi trang giờ theo đúng thứ tự trong danh mục (Chưa liên hệ → Đã liên hệ → Cân nhắc → ... → Đã chuyển đổi), không còn theo thứ tự dữ liệu ngẫu nhiên.
2. **Ô ngày giờ = lịch chọn thật** — mọi trường `*_time` dùng bộ chọn ngày+giờ, `*_date` dùng bộ chọn ngày (tự quy đổi qua lại với dd/mm/yyyy của sheet). Riêng **Hẹn liên hệ lại** có dòng gợi ý: *"Bỏ trống: hệ thống tự hẹn theo kết quả liên hệ - không nghe máy 4h, máy bận 6h, đã nhắn 24h"* (số lấy thẳng từ Cài đặt).
3. **Drawer rộng hơn**: 560 → **760px** (tối đa 96% màn hình).
4. **Ghi liên hệ thấy được kết quả ngay** — lưu xong app **mở lại hồ sơ lead**: lịch sử liên hệ có dòng mới kèm chip kết quả, số lượt tăng, hẹn liên hệ được đặt, và **"Việc cần làm" tự tính lại** (vd sau 1 lần gọi hụt → *"Đã gọi 1 lần chưa kết nối được. Việc cần làm: gọi lại theo lịch hẹn (21/07 18:38)"*). Danh sách Lead thêm 2 cột **Lượt LH** và **Hẹn liên hệ** để thấy ngay không cần mở drawer.
5. **Nút đẩy sang bước sau ngay trên dòng** — Danh sách Lead có **Ghi liên hệ / Đặt test / Tư vấn**; drawer lead vẫn có đủ chuỗi bước theo giai đoạn (Đặt lịch test → Tư vấn & ĐK → Tạo đăng ký → Thu tiền → Xếp lớp → Kết thúc). Form mở ra đã điền sẵn khách.
6. **Đính kèm chứng từ ở các bước xác nhận** — 4 chỗ: *Ghi nhận thanh toán* (ảnh biên lai), *Xác nhận đã nhận tiền* (ảnh sao kê + ghi chú đối chiếu), *Đã gửi thông tin lớp* (ảnh chụp Zalo), *Đóng khiếu nại* (biên bản làm việc). Chọn file → V4 tải lên Drive thư mục **"ITTs - Chứng từ"**, đặt quyền xem-theo-link, rồi gắn link vào bản ghi; hoặc dán sẵn link Drive. Bản demo offline chỉ ghi tên file.

## 9h. BỘ MÁY HÀNH TRÌNH - thay đổi cách dùng app (quan trọng nhất)

**Vấn đề gốc:** app trước đây mang hình dạng của cái sheet - mỗi bảng DL thành một trang. Nhân viên phải tự nhớ "người này đang ở đâu, giờ mở trang nào". Hành trình học viên bị cắt thành 10 mảnh rời, mỗi mảnh có logic riêng nên dễ lệch nhau.

**Cách làm mới:** khai báo **một bộ máy hành trình duy nhất** - 13 chặng chính + 4 nhánh rẽ. Mỗi chặng ghi rõ: điều kiện vào, mốc bắt đầu, **ai chịu trách nhiệm**, **hạn (SLA) lấy từ Cài đặt**, **dữ liệu bắt buộc để đi tiếp**, và **một việc kế tiếp duy nhất**. Mọi màn hình đều đọc từ đây, không viết tay riêng nữa.

Chuỗi chặng: Lead mới → Đang khai thác → Đã hẹn test → Chờ chấm test → Có KQ chờ tư vấn → Đang tư vấn → Đăng ký chờ thu → Đã thu chờ xếp lớp → Onboarding → Đang học → Kết thúc khóa → Mời tái ghi danh → Đã hoàn tất. Nhánh rẽ: Chưa gặp được / Đã mất / Bảo lưu - Bỏ học / Đăng ký đã hủy.

### 2 màn hình mới

**Hành trình học viên** (menu Làm việc) - toàn bộ 224 hồ sơ xếp theo chặng đang đứng:
- Dải tóm tắt 13 chặng ở đầu trang: mỗi chặng bao nhiêu người, bao nhiêu quá hạn → nhìn phát biết đang nghẽn ở đâu.
- Bảng cột theo chặng, mỗi thẻ là một người: tên, SĐT, người phụ trách, **đã đứng ở chặng này bao lâu**, viền đỏ nếu quá hạn, cảnh báo vàng nếu thiếu dữ liệu.
- **Mỗi thẻ có đúng một nút** - việc kế tiếp của người đó. Bấm là làm ngay, không phải đi tìm trang.
- Lọc nhanh: Quá hạn / Thiếu dữ liệu / theo bộ phận / theo nhân viên.

**Hồ sơ hành trình 360** (mở bằng lead_id hoặc student_id - cùng một màn):
- **Dải chặng ngang** đánh dấu đã qua / đang đứng / chưa tới, kèm ngày qua từng chặng.
- **Ô VIỆC KẾ TIẾP** nổi bật: việc phải làm, **vì sao phải làm**, đã ở chặng này bao lâu / hạn bao lâu, và cảnh báo nếu thiếu dữ liệu bắt buộc.
- **Dòng thời gian** gộp mọi sự kiện của người đó theo thứ tự: lead vào → từng cuộc gọi (kèm kết quả) → test → tư vấn → đăng ký → từng khoản thu → xếp lớp → onboarding → điểm danh bất thường → WOW → khảo sát → khiếu nại → kết thúc.
- Các khối dữ liệu (thông tin, test, học phí, lớp & học tập, cảm nhận, kết thúc) chỉ hiện khi có dữ liệu.

### Tự chuyển chặng + chặn khi thiếu dữ liệu

Hệ thống **tự nhận chặng từ dữ liệu thật**, không cần ai bấm "chuyển bước". Ghi 1 cuộc gọi gặp được → tự sang *Đang khai thác*; đặt lịch test → *Đã hẹn test*; thu đủ tiền → *Đã thu chờ xếp lớp*...

Khi bấm việc kế tiếp mà **thiếu dữ liệu bắt buộc thì bị chặn** và nói rõ thiếu gì (vd chấm test xong nhưng chưa nhập điểm tổng → *"Chưa đi tiếp được - còn thiếu: Điểm tổng bài test"*).

**Việc hôm nay** giờ sinh thẳng từ bộ máy này - nên việc trên Dashboard, trong Bảng hành trình và trong Hồ sơ luôn khớp nhau, không còn mỗi nơi một kiểu.

Đã kiểm chứng: dựng một khách đi trọn 12 bước từ Lead mới đến Đang học - mỗi bước hệ thống tự nhận đúng chặng, đúng người phụ trách, đúng việc kế tiếp; chặn đúng chỗ thiếu dữ liệu; hồ sơ dựng được 11 sự kiện dòng thời gian. 224 hồ sơ phân bố đúng 15 chặng, 23 trang không lỗi.

## 9i. CHẠY QUY TRÌNH - app dắt tay nhân viên đi từng màn (mới nhất)

Mục 9h làm bộ máy hành trình, nhưng vẫn là "bảng để tra". Đợt này làm đúng thứ anh cần: **nhân viên không phải nghĩ, chỉ đi theo màn**.

**Vào menu Làm việc > Chạy quy trình** (hoặc bấm nút trên bất kỳ thẻ nào ở Bảng hành trình / Hồ sơ).

Mỗi bước là **một màn riêng, toàn màn hình**, gồm 3 phần:

1. **Tiêu đề bước + câu giải thích ngắn** - làm gì, vì sao.
2. **Dòng "biết sẵn"** - app tự lôi ra thứ cần biết để làm bước đó. Ví dụ màn Tư vấn hiện luôn *Điểm test 5.5 · L/R/W/S 6/5.5/5/5.5 · Nhận xét GV: Writing yếu*; màn Thu tiền hiện *Tổng phí / Đã thu / Còn lại*. Không phải mở tab khác tra.
3. **Chỉ hỏi đúng thứ cần cho bước đó** - 2-5 ô, không phải form 15 trường.

Cuối màn có nút **"Lưu & tiếp tục"**. Lưu xong hệ thống tự nhận chặng mới và **hiện luôn màn của bước kế tiếp**.

Lộ trình 12 màn đã chạy thông (kiểm bằng máy trên một khách thật):

| # | Màn | Chỉ hỏi |
|---|---|---|
| 1 | Gọi & ghi kết quả | Kênh · Kết quả · Nội dung · Hẹn lại |
| 2 | Đặt lịch test đầu vào | Ngày giờ · Hình thức · Ghi chú |
| 3 | Ghi nhận buổi test | Có mặt / Trễ / Vắng (+ lý do, hẹn lại) |
| 4 | Nhập kết quả test | L · R · W · S · Nhận xét *(tự tính Overall)* |
| 5 | Tư vấn lộ trình | Khóa đề xuất · Lịch · Nội dung · Phản hồi khách |
| 6 | Tạo đăng ký | Khóa · Học phí · Chiết khấu · Lý do |
| 7 | Ghi nhận thanh toán | Số tiền · Hình thức · Mã GD · Ảnh biên lai |
| 8 | Xếp lớp | Lớp *(chỉ hiện lớp đúng khóa, còn chỗ)* · Ghi chú |
| 9 | Gửi thông tin lớp | Ghi chú · Ảnh chụp Zalo |
| 10 | HV xác nhận lớp | Đồng ý / Từ chối |
| 11 | Hoàn tất onboarding | Ghi chú |
| 12 | Đang học | *(không còn thao tác bắt buộc - chuyển sang theo dõi)* |

**Mỗi chặng có NHIỀU điểm chạm - không phải ai cũng 1 lần là qua bước:**

Màn chạy có **2 tab**:

- **"Bước tiếp: ..."** - thao tác đẩy sang chặng sau (đặt lịch test, tạo đăng ký, thu tiền...).
- **"Ghi điểm chạm (N)"** - chăm ở nguyên chặng: gọi lại, nhắn Zalo, gửi báo giá, khách xin suy nghĩ... **Hồ sơ KHÔNG bị đẩy bước**, chỉ ghi thêm một lượt chạm và đặt lịch hẹn lần sau.

Chi tiết:

- Ô "Nội dung / mục đích chạm" có **gợi ý sẵn theo từng chặng** (chặng *Đang khai thác*: gọi lại theo hẹn / nhắn Zalo gửi lộ trình / mời đến trung tâm; chặng *Đăng ký chờ thu*: nhắc đóng học phí / gửi thông tin chuyển khoản...).
- Màn chính hiện dòng nhắc: *"Đã 3 lần chạm ở chặng này · gần nhất 21/07 18:02 - Kết nối được · hẹn lại 22/07 18:02"* - nhân viên biết ngay đã theo đuổi tới đâu.
- Tab điểm chạm liệt kê **lịch sử các lần chạm ở chặng hiện tại** (giờ, kênh, kết quả, nội dung).
- Bộ đếm **tính theo từng chặng**: qua bước mới thì đếm lại từ 0, nhưng lịch sử liên hệ tổng của khách vẫn giữ nguyên đủ.
- Nút **"Chưa qua bước - ghi điểm chạm"** ngay ở màn chính để nhảy nhanh sang tab kia.

Đã kiểm chứng: một khách ở chặng *Đang khai thác* - gọi hụt, nhắn Zalo chưa trả lời, gọi lần 3 mới nói chuyện được (3 điểm chạm, chặng **không đổi**), đến khi khách đồng ý mới bấm Đặt lịch test → chuyển sang *Đã hẹn test*, bộ đếm điểm chạm về 0, tổng lịch sử liên hệ vẫn đủ 4 lượt.

**Chế độ hàng đợi - làm liên tục không quay lại danh sách:**

- Nút **"Chạy quy trình (N việc)"** trên Bảng hành trình → xếp hàng toàn bộ việc quá hạn/thiếu dữ liệu.
- Nút ▶ trên đầu mỗi cột chặng → chạy riêng cột đó (vd 28 lead mới cần gọi).
- Thanh trên hiện **"hồ sơ 3/28"**, có **Người trước / Bỏ qua người này / Người tiếp theo**. Gọi xong bấm một nút là nhảy sang người kế - nhân viên ngồi gọi 28 cuộc liền mạch trong đúng một màn hình.

Kiểm chứng: chạy một khách mới toanh qua trọn 12 màn chỉ bằng màn Chạy quy trình - sinh ra đủ 1 lượt liên hệ, 1 phiếu test (điểm 5.5), 1 phiếu tư vấn, 1 đăng ký, 1 phiếu thu (hết nợ), 1 học viên mới, 1 hồ sơ onboarding hoàn tất, dòng thời gian 11 sự kiện. Hàng đợi 28 lead chuyển người mượt. 24 trang không lỗi.

## 10. Bơm dữ liệu demo lên soptemp (ITTs_SeedDemo.gs - bản AN TOÀN v3)

> **Nguyên tắc mới:** script CHỈ THÊM dữ liệu vào cột nhập. Không xóa dòng, không đổi lưới, không sửa công thức, không đụng cột mã, không gỡ Kiểm tra dữ liệu. Trước mỗi lần ghi/xóa nó **tự tạo 1 bản sao file** (`[SAO LƯU dd-MM-yyyy HH:mm] tên file`) - không bao giờ phải khôi phục tay nữa.

**Bộ demo:** 2.895 dòng / 19 sheet, neo quanh ngày chạy, tự kiểm 37 tiêu chí độ phủ trước khi xuất.

### Cách chạy (khuyên làm trên BẢN SAO trước: Tệp > Tạo bản sao)

1. Apps Script > tạo file mới > dán toàn bộ `ITTs_SeedDemo.gs` > Lưu.
2. Chạy `seedDemo` (đang `DRY_RUN = true`) → xem báo cáo, **chưa ghi gì**.
3. Đổi `DRY_RUN = false` → chạy `seedDemo` → ghi thật (tự sao lưu trước).
4. Muốn thay demo cũ: `clearDemoData` (xóa **nội dung**, giữ nguyên lưới + công thức + định dạng) rồi `seedDemo`. Hoặc gọn hơn: `resetDemo` = sao lưu + xóa nội dung + bơm mới, **mọi mốc thời gian tự dời về hôm nay**.
5. Kiểm tra: `seedDoctor` — **chỉ đọc, không sửa gì** — soi mọi cột và báo 4 loại vấn đề: `LỖI CÔNG THỨC`, `CHỈ CÓ DÒNG ĐẦU`, `CÔNG THỨC TRỐNG`, `CỘT NHẬP TRỐNG`.
6. `fixDerivedColumns` — điền các cột tính toán còn trống/lỗi (xem mục 9c). Sau `seedDemo`/`resetDemo` nó tự chạy sẵn.

### 2 công cụ CẢI TẠO file - tách riêng, chỉ chạy khi anh chủ động muốn

Trước đây em gộp 2 việc này vào seed và đó là lý do file bị hỏng. Giờ chúng đứng riêng, có hỏi xác nhận, có sao lưu, và **seed không bao giờ tự gọi chúng**.

| Hàm | Việc nó làm | Khi nào cần |
|---|---|---|
| `widenTemplateRanges()` | Công thức template chỉ dò tới dòng 300/500/1000; hàm này nới lên 3000 + thêm dòng lưới | Khi `seedDoctor` báo "công thức chỉ dò tới dòng cố định" và dữ liệu của anh nhiều hơn mức đó |
| `flattenIdLinks()` | Cột mã đang là `HYPERLINK()` khiến `COUNTIF/VLOOKUP` dò theo mã không khớp (→ `first_call_time`, `attendance_rate`... rỗng); hàm này đổi cột mã về text thường, **mất link bấm nhảy**. Có chốt an toàn: cột nào có ô trống/lỗi thì **bỏ qua cả cột**, không ghi đè | Khi `seedDoctor` báo công thức dò mã trống và có gợi ý cột mã là HYPERLINK |

### Nếu vẫn còn cột trống

Chạy `seedDoctor` rồi gửi em nguyên văn báo cáo. Nó nói rõ sheet nào, cột nào, thuộc loại nào — không cần đoán nữa.

## 5. Lùi bản (rollback)
Trước khi dán, copy nội dung file web app cũ ra một nơi. Nếu cần quay lại: dán bản cũ vào, tạo phiên bản triển khai mới.
