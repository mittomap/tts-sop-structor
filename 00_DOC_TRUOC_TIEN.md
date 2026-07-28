# 00 - ĐỌC TRƯỚC TIÊN (bootstrap cho phiên làm việc mới)

Đây là thư mục cowork của dự án **ITTs SOP TEMP** giữa Luân (chủ trung tâm IELTS THE TUTORS) và Claude.
Phiên chat mới: đọc file này -> `01_KIEN_TRUC_HE_THONG.md` -> `02_NHAT_KY_QUYET_DINH.md`, rồi mới bắt tay làm.

## 1. Dự án là gì
Số hóa SOP vận hành 10 giai đoạn của trung tâm thành một hệ Google Sheets 52 sheet
(file `ITTs_Operations_Template_v4.xlsx`) + 3 file Apps Script. Mục tiêu: nhân viên mới
đọc là dùng được, mọi con số/câu chữ nằm ở cấu hình, hệ thống tự nhắc việc.

## 2. Danh mục file trong thư mục
| File | Vai trò |
|---|---|
| `00_DOC_TRUOC_TIEN.md` | File này - luật chơi + cách tiếp tục |
| `01_KIEN_TRUC_HE_THONG.md` | Kiến trúc 52 sheet + mọi cơ chế cốt lõi |
| `02_NHAT_KY_QUYET_DINH.md` | Quyết định thiết kế + bẫy kỹ thuật + việc tồn |
| `ITTs_Operations_Template_v4.xlsx` | SẢN PHẨM CHÍNH - bản chuẩn mới nhất |
| `ITTs_XuLyDuLieu.gs` | Script chính: cài đặt, sửa link, dấu giờ tự động, menu |
| `ITTs_Form_NhapLieu.gs` | Script form nhập liệu sidebar |
| `ITTs_WebApp.gs` | Web app demo v3 (dashboard, việc hôm nay, nhập lead, tra cứu) |
| `ITTs_WebApp_v5_demo.html` | **WEB APP nhân viên** (bản demo offline hiện hành, đang phát triển mạnh) |
| `ITTs_TrangHocVien_demo.html` | **Cổng học viên** (sinh cùng generator, chung CSS/JS) |
| `ITTs_data.js` | **Dữ liệu demo tách riêng** - app ưu tiên đọc file này; thay file = thay dữ liệu, không cần build |
| `ITTs_WebApp_v5_README.md` | Nhật ký tính năng web app V5.x→V9.5 (đọc cuối để nắm hiện trạng app) |
| `FEEDBACK_theo_doi.md` | Bảng theo dõi 21 feedback của Luân về web app (đã làm / kế tiếp) |
| `KE_HOACH_HOAN_THIEN_APP.md` | **KẾ HOẠCH 7 ĐỢT hoàn thiện app** (hội đồng 4 chuyên gia, 27/07) - việc tồn app lấy từ đây |
| `DEMO_CHECKLIST.md` | Checklist trước giờ demo đa cổng (pre-sales soạn) - đưa Luân xem trước khi đi demo |
| `_src/` | **MÃ NGUỒN web app** (gen_v5.py + pipeline + font). Scratchpad bị xoá nên nguồn cất ở đây — xem `_src/README_SRC.md` để build/verify. |

## 2b. WEB APP (nhánh đang chạy nóng nhất — đọc kỹ nếu Luân nói về "app")
Song song với hệ Google Sheets, dự án có **web app demo offline** dựng từ MỘT generator Python
`_src/gen_v5.py` → xuất 2 file HTML (app nhân viên + cổng học viên) dùng chung code. Đây là nhánh
Luân tương tác nhiều nhất gần đây. **Muốn sửa app: đọc `_src/README_SRC.md`** (build 1 lệnh
`ITTS_OUT=... python3 gen_v5.py`, verify bằng `node _tall.js`). Hiện trạng tính năng: cuối
`ITTs_WebApp_v5_README.md`. Bẫy & quyết định kiến trúc app: mục 3bis→3quater trong file 02.
Phiên bản hiện tại: **V9.20** (28/07 tối - MODULE GIAO VIỆC (DL23 + DL24 trao đổi theo việc): giao xuống /
phối hợp ngang cấp / nhờ hỗ trợ, bắt buộc vs không, vòng đời nhận-làm-báo xong-xác nhận, thông báo vào chuông
+ bong bóng, báo cáo hiệu suất theo người; CẤU HÌNH GIAO DIỆN: đổi tên/logo/màu/tiêu đề tab + bật tắt & đổi tên
menu sidebar (Cài đặt > Giao diện, Menu). Suite 110 điểm. Chi tiết: mục 3vicies file 02.
Trước đó V9.18: GỘP Hành trình vào Trang bắt đầu (1 trang 2 góc nhìn); node dải hạt
BẤM ĐƯỢC mở drawer từng chặng; TRA CỨU mở rộng 17 sổ chỉ-xem theo nghiệp vụ; tab Dữ liệu demo tối giản; bỏ
"Gửi phụ huynh"; chip trạng thái khóa đặc màu; nhật ký buổi học thành timeline; badge menu gọn. Trước đó V9.17:
ROOM DEMO TỰ ĐỘNG (các máy tự đồng bộ, không cần mã phòng) + bong bóng việc mới + navbar Room demo/Reset cả
2 cổng + vá theo 3 tester. Chi tiết: mục 3septendecies/3octodecies/3novemdecies file 02. Trước đó V9.15: menu theo 4 CHẶNG VÒNG ĐỜI + hệ node 3 tầng (ray ga / dải hạt trên mọi dòng / sopBlock trang chi tiết) + tab Chăm lại/Reup + dữ liệu demo đại tu theo tester, suite kiểm 366 điểm. Nền demo đa cổng giữ từ V9.7: màn cổng chọn người, dữ liệu tách `ITTs_data.js`, thao tác lưu thật + đồng bộ giữa các cổng, nút Reset demo. HỘI ĐỒNG TỔNG KIỂM đang HOLD - chờ yêu cầu mới của Luân. Chi tiết: mục ⭐ HIỆN TRẠNG trong file 02).
Dự án ĐÃ LÊN GITHUB (28/07): thư mục này = repo `mittomap/tts-sop-structor` (PUBLIC từ 28/07 chiều,
tên cũ itts-sop - Luân đổi tên + mở public để phiên cloud Claude Code truy cập được); demo online:
**https://mittomap.github.io/itts-sop-demo/**. Từ 28/07 chiều, phiên cloud Claude Code của Luân có
QUYỀN GHI cả 2 repo (app GitHub "claude" đã cài) - tự commit + push, Luân không phải chạy lệnh;
làm trên máy Luân vẫn dùng `./push.sh` / `./update.sh` như cũ. Phiên Claude Code đọc thêm
`CLAUDE.md` ở gốc. Chi tiết: mục 3quindecies + 3sedecies file 02.

## 3. LUẬT CỨNG (vi phạm = làm lại)
1. Font **Montserrat** toàn bộ. KHÔNG emoji. Dùng "-" thường, không em-dash.
2. **Config-driven tuyệt đối**: mọi ngưỡng/SLA gọi qua named range CH2/CH6; mọi câu nhắc
   ở CH4; mọi giá trị chọn ở CH1. Không hardcode số/câu trong công thức.
3. **Mã là địa chỉ, không phải số dòng**: mọi liên kết/tham chiếu tra bằng
   `MATCH("mã", cột A, 0)`. Không bao giờ gắn số dòng cứng.
4. Link nội bộ trong file GIAO CHO USER luôn ở dạng di động `#'Tên sheet'!...`
   (script `Sua lien ket` sẽ đổi sang gid khi chạy trên Google Sheets).
5. Không dùng MINIFS/MAXIFS (LibreOffice không tính) - dùng `SUMPRODUCT(MIN/MAX(...))`.
   Trừ ngày giờ có ô trống: bọc `N()`, ví dụ `(NOW()-N(B4))*24`.
6. Cột công thức (93 cột, xem HD3 Phần 4) KHÔNG BAO GIỜ ghi giá trị tĩnh đè lên.
7. Tiếng Việt mộc, không màu mè. Nhãn enum lấy NGUYÊN VĂN từ CH1.

## 4. Quy trình giao nhận (bắt buộc)
- Mỗi lần giao file: LUÔN gồm `ITTs_Operations_Template_v4.xlsx` + `ITTs_XuLyDuLieu.gs`
  + `ITTs_Form_NhapLieu.gs` (WebApp.gs chỉ khi có thay đổi). Nhắc user: import xong chạy
  menu "ITTs Cong cu > CAI DAT BAN DAU" (hoặc tối thiểu "Sua lien ket (hyperlink)").
- **User upload xlsx = BASE MỚI** (user tự decor trên bản live: màu, viền, độ rộng...).
  Quy trình: audit tiếp nhận (52 sheet, ~141 named range, ~73 validation, 0 lỗi công thức)
  -> chấp nhận -> làm tiếp trên nền đó. KHÔNG BAO GIỜ rebuild từ bản cũ hơn.
- Xuất từ Google Sheets sẽ có: link thành URL gid tuyệt đối (PHẢI convert về `#'Sheet'!`
  trước khi giao lại), hàm filter()/query() bọc `__xludf.DUMMYFUNCTION` (BÌNH THƯỜNG,
  Google tự khôi phục khi import - đừng "sửa"), font name đổi hàng loạt (ép lại Montserrat).

## 5. Quy trình kỹ thuật mỗi phiên (container)
1. Copy xlsx từ thư mục về `/home/claude/ITTs_Operations_Template_v4.xlsx` làm bản làm việc.
2. Sau MỖI lần save bằng openpyxl: chạy
   `python /mnt/skills/public/xlsx/scripts/recalc.py <file> 600`
   rồi mới đọc `data_only`. Script python sập giữa chừng = CHƯA save = mất hết, kiểm tra output.
3. **Đếm lỗi công thức**: quét `#REF!/#VALUE!/#NAME?/...` nhưng LOẠI TRỪ các sheet
   `VH*`, `VH0. Tìm kiếm`, `DL19*` (chúng dùng hàm Google-native, chết trong LibreOffice là bình thường).
   Chuẩn giao hàng: **0 lỗi** ở phần còn lại.
4. Cuối phiên: ép font Montserrat toàn file (giữ size/bold/color), recalc, audit, copy ra outputs,
   present đủ bộ file.
5. Verify SAU MỖI BƯỚC - đừng tin script chạy đúng; dự án này từng bắt được nhiều bug
   của chính mình nhờ kiểm từng bước.

## 6. Cách tiếp tục ở chat mới
- **Khởi động 1 lệnh**: khi đã dán nội dung bootstrap vào Hướng dẫn dự án (Project instructions)
  trên Claude.ai, chat mới chỉ cần gõ VIỆC CẦN LÀM (hoặc "tiếp tục") - Claude tự xin quyền folder
  + đọc 00/01/02 + theo luật rồi làm, không phải dặn lại. Nội dung để dán:
  > Dự án ITTs SOP TEMP. Đầu mỗi phiên, TRƯỚC khi làm gì: (1) xin quyền truy cập folder
  > ~/Claude/SOP ITTs; (2) đọc lần lượt 00_DOC_TRUOC_TIEN.md, 01_KIEN_TRUC_HE_THONG.md,
  > 02_NHAT_KY_QUYET_DINH.md; (3) tuân LUẬT CỨNG. User nói "tiếp tục" -> lấy việc ở mục VIỆC TỒN
  > (file 02). Cuối phiên có thay đổi -> cập nhật quyết định/bẫy/backlog vào 01/02 trước khi kết.
- Đọc đủ 3 file md. Nếu cần chi tiết sâu hơn (script cũ, mapping, lịch sử), hỏi Luân
  hoặc tìm trong transcript dự án.
- Hỏi Luân việc cần làm; nếu Luân nói "tiếp tục", xem mục VIỆC TỒN trong
  `02_NHAT_KY_QUYET_DINH.md`.
- Phong cách làm việc với Luân: anh ấy soi rất kỹ thiết kế, bắt lỗi tinh; cứ nhận lỗi
  thẳng, sửa tận gốc, chứng minh bằng kiểm định (tái hiện bug, so từng ký tự...).
  Anh cấp toàn quyền chủ động nhưng LUÔN kiểm chứng trước khi báo xong.

## 7. KẾT PHIÊN (bắt buộc)
Trước khi kết MỖI phiên có thay đổi, cập nhật 3 file md để chat sau hiểu tương đương phiên này
(không phụ thuộc transcript cũ):
- Quyết định thiết kế mới -> mục 1 file 02.
- Bẫy kỹ thuật mới trả giá -> mục 2 file 02.
- Backlog đổi (thêm việc / xong việc) -> mục 3 file 02.
- Kiến trúc / cơ chế / sheet đổi -> file 01. Đổi luật chơi -> file này (00).
Bước này bắt buộc, ngang hàng với ép font Montserrat + audit cuối phiên.
