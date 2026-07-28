# ITTs - SOP TEMP — Chuẩn thiết kế UX/UI (Design Standards)

Tài liệu này rút ra từ **benchmark sản phẩm thật** (CRM tuyển sinh giáo dục, phần mềm quản lý trung tâm/LMS, helpdesk Zendesk, các design system Carbon/PatternFly/NN-g) rồi áp vào ITTs. Đây là bộ chuẩn để GĐ2 thiết kế lại từng chức năng theo đúng chuẩn ngành, không "chế".

---

## PHẦN A - BÀI HỌC TỪ SẢN PHẨM THẬT (áp vào ITTs)

**1. CRM tuyển sinh giáo dục** (Full Fabric, LeadSquared, Classe365, Kissflow)
- Mọi bộ phận nhìn **CÙNG một hồ sơ khách** qua mọi giai đoạn (nguồn → test → tư vấn → ĐK → thanh toán → nhập học) - không rời rạc. → ITTs: Hồ sơ 360 + drawer là trung tâm, mọi trang trỏ về nó.
- **Speed-to-lead**: >80% khách chốt nơi phản hồi ĐẦU TIÊN. → ITTs: "Lead cần gọi gấp" phải nổi bật nhất, đếm ngược SLA.
- Phản hồi đầu tiên tốt = **nhắc đúng khóa khách quan tâm + trả lời câu hỏi + đẩy tới bước kế rõ ràng** (đặt lịch test/tư vấn). → đúng tinh thần nút "Bước tiếp theo".
- Mô hình hóa theo **vòng đời native** (enquiry/applicant/offer/enrolment) chứ không gò vào bảng chung. → ITTs: thiết kế theo 10 giai đoạn, không theo sheet.

**2. Phần mềm quản lý trung tâm/LMS** (Teachworks, QuickSchools, DreamClass)
- **Lịch nối thẳng điểm danh + học phí + lương**; điểm danh log ngày/giờ/GV; tích hợp điểm danh + gradebook. → ITTs: điểm danh/bài tập theo lớp→buổi (đã làm), nối công nợ.
- QuickSchools: "dùng được từ ngày đầu, không cần đào tạo". → chuẩn dễ dùng của ITTs.

**3. Helpdesk/SLA** (Zendesk) - trả lời trực tiếp câu hỏi "làm sao tắt cảnh báo"
- Mỗi việc có **vòng trạng thái**: New → Open → Pending → On-hold → Solved → Closed.
- **Pending/On-hold TẠM DỪNG đồng hồ SLA**; chuyển sang Solved thì **tắt** cảnh báo.
- **Trigger tự đổi trạng thái** khi có sự kiện (được phân công → Open). → ITTs: mỗi hành động SLA gắn 1 trạng thái/dấu-thời-gian; đánh dấu xong = đổi trạng thái = cảnh báo tắt.

**4. Bảng dữ liệu** (Eleken, Pencil&Paper) · **Dashboard** (UXPin) · **Form wizard** (NN/g) · **Trạng thái** (Carbon, PatternFly) - xem chuẩn cụ thể ở Phần C-D.

---

## PHẦN B - DESIGN SYSTEM (nền tảng nhìn-cảm)

**Typography** (thang rõ ràng, 2 độ đậm):
- H1 trang: 20px/700 · H2 mục: 15px/700 · Nhãn nhóm: 11px/700 UPPERCASE letter-spacing .4px
- Body: 13-14px/400 · Phụ: 12px · Chú thích: 11px · Chỉ dùng **400 và 700**, bỏ 600.

**Màu** (thương hiệu đỏ + trung tính + ngữ nghĩa):
- Đỏ thương hiệu `#D51920` (logo, nhấn thương hiệu, KHÔNG lạm dụng).
- Xanh navy `#2E5A88` (hành động chính, link). Nền `#EDF1F6`, thẻ trắng, viền `#E3E9F0`.
- Ngữ nghĩa: đỏ = gấp/lỗi, vàng = chờ/theo dõi, xanh lá = xong/tốt, xám = trung tính. **Màu mã hóa nghĩa, không trang trí.**

**Lưới & khoảng cách**: hệ 8px (4/8/12/16/24). Bo góc: control 8px, thẻ 12px. Đổ bóng: rất nhẹ hoặc chỉ viền 0.5-1px (phẳng, sạch).

**Mật độ**: gọn (compact) cho bảng vận hành, thoáng cho form. Vùng chạm ≥ 32px.

---

## PHẦN C - CHUẨN CHO TỪNG LOẠI MÀN

**1. Dashboard / Trang chủ** (chuẩn: KPI có 3 lớp ngữ cảnh)
- Mỗi thẻ KPI cần: **con số + so sánh kỳ trước (▲▼%) + ngưỡng/mục tiêu (ĐẠT?) + xu hướng** (mũi tên/sparkline/màu).
- ≤ 5 KPI quan trọng nhất ở TRÊN cùng; giữa là biểu đồ xu hướng; bảng chi tiết đẩy xuống drill-down.
- Trả lời "**Đang xảy ra gì, tôi cần làm gì?**" trong 1 cái nhìn; mỗi thẻ có **CTA** dẫn tới hành động, không bắt nhảy tab.

**2. Bảng danh sách** (chuẩn: bảng vận hành thật)
- **Header dính (sticky)** khi cuộn. **Lọc ngay trên bảng** (đa chọn - đã có); sắp xếp khi bấm tiêu đề.
- **Chọn nhiều (checkbox) → thanh hành động ngữ cảnh** hiện ra (đổi trạng thái, bàn giao, xuất...).
- **Sửa tại chỗ (inline)**: hover ô hiện bút chì → bấm thành input → Enter lưu (cho ô đơn giản).
- **Phân trang + "số dòng/trang" (25/50/100)**. Cột căn lề đúng kiểu (số phải, chữ trái).

**3. Trang chi tiết** (chuẩn: master-detail, giữ ngữ cảnh)
- Dùng **drawer/panel bên phải** (đã làm) để xem/sửa mà **không rời danh sách** - đúng pattern primary-detail. Nội dung nhiều → có thể mở full trang.
- Trong chi tiết: thông tin + **dòng thời gian (lịch sử)** + **bước tiếp theo** ngay tại chỗ.

**4. Phễu/Kanban**: cột theo giai đoạn, thẻ kéo/bấm; giai đoạn tự suy từ dữ liệu; bấm thẻ mở chi tiết; nút bước-kế mở form trong drawer (đã làm).

**5. Form / Luồng tác vụ** (chuẩn: wizard cho việc nhiều bước)
- Việc nhiều bước/quan trọng → **chia bước rõ ràng** (chọn lớp → chọn buổi → nhập → xác nhận), mỗi bước một nhóm nghĩa, **có thanh tiến trình**.
- **Validation tức thì, báo lỗi ngay cạnh ô**. Quay lại không mất dữ liệu. **Bớt field tối đa** (mỗi field thừa = một lý do bỏ cuộc).
- Với thao tác hàng loạt (giao bài cả lớp): một hành động → nhiều bản ghi (đã làm ở Bài tập).

**6. Lịch/Đặt lịch**: xem lịch trống → đặt → nhắc tự động (test, WOW, buổi học).

**7. Cài đặt**: nhóm theo tab; mỗi tham số 1 dòng (nhãn + mô tả + giá trị sửa được + Lưu); cảnh báo ảnh hưởng (đã dựng khung).

---

## PHẦN D - THÀNH PHẦN & TRẠNG THÁI (component states)

**Bắt buộc phân biệt 4 trạng thái** cho mọi vùng tải dữ liệu (chuẩn Carbon/PatternFly):
- **Đang tải** → skeleton/spinner (không để trắng trơn gây tưởng lỗi).
- **Rỗng (0 kết quả)** → thông điệp + **gợi ý bước tiếp** ("Chưa có việc - tuyệt! / Bấm + để thêm").
- **Lỗi** → nói lỗi bằng ngôn ngữ thường + **nút Thử lại**.
- **Có dữ liệu** → nội dung.

**Chuẩn hoá component tái dùng**: nút (1 primary/màn), input/select/textarea, chip trạng thái, thẻ KPI, drawer, modal xác nhận, toast, tab, bảng. Mọi nơi hành xử **nhất quán**.

**Microcopy**: câu lệnh bắt đầu bằng động từ ("Giao cho cả lớp"); lỗi nói cái gì sai + cách sửa; xác nhận cho hành động ghi/xóa/duyệt/hoàn tiền.

---

## PHẦN E - NGUYÊN TẮC TƯƠNG TÁC & COMPLETION (tắt cảnh báo)

**Mỗi việc SLA gắn một "dấu hoàn thành"** (theo chuẩn Zendesk):
- Ví dụ "gửi thông tin lớp qua Zalo": trạng thái `chưa gửi → đã gửi` (dấu `class_info_sent_at`). Nhân viên bấm **"Đã gửi"** → ghi dấu → cảnh báo TẮT. Đây là câu trả lời cho câu hỏi của anh.
- Hầu hết đã có dấu sẵn: chấm bài → `graded_at`; khiếu nại → `resolved`; đóng đủ → `remaining=0`; onboarding → `completed`.
- Ô nào SOP có SLA mà sheet CHƯA có dấu → **thêm cột dấu-thời-gian** (một việc nhỏ, cần thiết cho vận hành thật).
- "Tạm hoãn/On-hold" **dừng đồng hồ SLA** (vd chờ HV phản hồi) - không tính là trễ.

**Điều hướng & IA**: nhóm theo hành trình (Tổng quan · Tuyển sinh · Đào tạo · Chăm sóc · Quản lý · Báo cáo/Cài đặt). Mỗi người mở app vào đúng "home".

**Thông báo (chuông)**: đếm **việc gấp/quá hạn của tôi**; bấm ra danh sách; nối SLA.

**Phản hồi tức thì**: lưu là thấy đổi; toast xác nhận; không reload cả trang khi chỉ đổi 1 dòng.

**Responsive & tiếp cận**: sidebar thu gọn (hamburger) trên mobile; bảng cuộn ngang/đổi thành thẻ; GV điểm danh trên điện thoại mượt; tương phản đủ, chạm ≥ 44px trên mobile.

---

## PHẦN F - ÁP DỤNG VÀO GĐ2 (mỗi chức năng theo chuẩn trên)

| Chức năng | Luồng thật (theo chuẩn) | Dấu hoàn thành |
|---|---|---|
| Xếp lớp & Onboarding | chọn HV → gán lớp (còn chỗ) → **"Đã gửi thông tin lớp"** → HV xác nhận → hoàn tất | class_info_sent_at, confirmation_time, onboarding=completed |
| Test đầu vào | đặt lịch cho khách → (WOW) nhập 4 kỹ năng → tự tính overall → trả kết quả | test_status=graded, result_time |
| Thanh toán | chọn đăng ký còn nợ → ghi khoản thu → xác nhận → cập nhật công nợ | verified_by, remaining=0 |
| WOW 1-1 | chọn HV (thấy quota) → đặt buổi → ghi kết quả → trừ quota | wow_status=completed |
| Khiếu nại | tiếp nhận → phân công → xử lý → **đóng** (SLA theo mức, tạm hoãn dừng giờ) | complaint_status=resolved |
| Kết thúc & Tái ĐK | nhập điểm cuối → mức đạt → liên hệ tái ĐK | re_enrollment_status, testimonial |
| Tư vấn & Đăng ký | wizard: chọn khóa (giá tự) → chiết khấu (cảnh báo ngưỡng) → tạo ĐK → thu cọc | enrollment=confirmed |

Nguyên tắc chung mọi màn: **task-flow rõ ràng** (không bảng gộp), **completion để tắt cảnh báo**, **4 trạng thái tải**, **KPI 3 lớp ngữ cảnh**, **drawer giữ ngữ cảnh**, **validation tức thì**.

---

## Sources (benchmark)
- CRM tuyển sinh: [Full Fabric - Best CRM for Higher Education](https://www.fullfabric.com/articles/best-crm-platforms-higher-education) · [LeadSquared Higher Education CRM](https://www.leadsquared.com/higher-education-crm/) · [Classe365 - CRM for admissions](https://www.classe365.com/blog/9-best-education-crms-to-boost-student-admissions-and-retention/) · [Higher Education Marketing - Speed-to-Lead](https://www.higher-education-marketing.com/blog/speed-to-lead-admissions-follow-up-schools) · [Kissflow - CRM for Enrollment Management](https://kissflow.com/solutions/education/higher-education/crm-for-enrollment-management/)
- Quản lý trung tâm/LMS: [Teachworks](https://www.teachworks.com/tutoring-management-software) · [QuickSchools](https://www.quickschools.com/) · [DreamClass - attendance & gradebooks](https://www.dreamclass.io/2020/how-can-student-management-system-software-simplify-attendance-and-gradebooks/)
- Bảng dữ liệu: [Eleken - Table Design UX](https://www.eleken.co/blog-posts/table-design-ux) · [Pencil & Paper - Enterprise Data Tables](https://www.pencilandpaper.io/articles/ux-pattern-analysis-enterprise-data-tables)
- Dashboard: [UXPin - Dashboard Design Principles](https://www.uxpin.com/studio/blog/dashboard-design-principles/) · [Pencil & Paper - Dashboards](https://www.pencilandpaper.io/articles/ux-pattern-analysis-data-dashboards)
- Form wizard: [NN/g - Wizards](https://www.nngroup.com/articles/wizards/) · [Lollypop - Wizard UI Design](https://lollypop.design/blog/2026/january/wizard-ui-design/)
- Trạng thái tải/rỗng/lỗi: [Carbon Design System - Empty states](https://carbondesignsystem.com/patterns/empty-states-pattern/) · [NN/g - Empty States](https://www.nngroup.com/articles/empty-state-interface-design/) · [PatternFly - Empty state](https://www.patternfly.org/components/empty-state/design-guidelines/)
- SLA/trạng thái việc: [Zendesk - Defining SLA policies](https://support.zendesk.com/hc/en-us/articles/4408829459866-Defining-SLA-policies) · [eesel - Zendesk status lifecycle](https://www.eesel.ai/blog/zendesk-ticket-status-lifecycle)
- Master-detail: [PatternFly - Primary-detail](https://www.patternfly.org/patterns/primary-detail/design-guidelines/) · [Oracle Alta - Master Detail](https://www.oracle.com/webfolder/ux/mobile/pattern/masterdetail.html)
