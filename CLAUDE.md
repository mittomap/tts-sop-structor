# CLAUDE.md - Giao thức làm việc dự án ITTs SOP (repo private: mittomap/itts-sop)

Thư mục này là toàn bộ dự án SOP + web app demo của trung tâm IELTS The Tutors (ITTs).
Chủ dự án: Luân. Mọi phiên làm việc (Claude Code hay Claude Cowork) đều theo giao thức này.

## Bắt đầu MỌI phiên

1. `git status` - nếu có thay đổi chưa commit (thường do phiên Cowork để lại file mới), commit
   ngay: `don phien truoc <ngay>`. Rồi `git pull` cho chắc.
2. Đọc theo đúng thứ tự: `00_DOC_TRUOC_TIEN.md` -> `01_KIEN_TRUC_HE_THONG.md` ->
   `02_NHAT_KY_QUYET_DINH.md`. Trong file 02: đọc kỹ mục "⭐ HIỆN TRẠNG WEB APP" (trạng thái
   sống, cập nhật mỗi phiên) + "VIỆC TỒN" + các mục bẫy (3bis trở đi) liên quan việc sắp làm.
3. Tuân LUẬT CỨNG ghi trong các file trên. Luân nói "tiếp tục" = lấy việc đầu tiên ở VIỆC TỒN.

## Web app (phần quan trọng nhất)

- NGUỒN DUY NHẤT: `_src/gen_v5.py` (generator Python chứa toàn bộ HTML/CSS/JS trong chuỗi).
  KHÔNG BAO GIỜ sửa tay 3 file build ở gốc repo: `ITTs_WebApp_v5_demo.html`,
  `ITTs_TrangHocVien_demo.html`, `ITTs_data.js` - sửa gen_v5.py rồi build lại.
- Build + verify: làm ĐÚNG theo `_src/README_SRC.md`. Verify BẮT BUỘC sau mỗi build:
  `node --check` script của cả 2 file HTML, `_tall.js` (kỳ vọng 37 trang 0 lỗi + icon đủ),
  và `_src/_check11.js` cùng các bộ check khác nếu có (suite chuẩn 366 điểm) - xanh hết mới giao.
- Dữ liệu demo: pipeline `_src/gen_demo.py -> seed_giaoan.py -> mkdemo.py -> fixdata.py ->
  check_data.py` (chạy đúng thứ tự, sản phẩm demo_data_big.json). Sửa dữ liệu = sửa Ở NGUỒN
  pipeline, không sửa tay JSON.
- Thêm icon ti-* mới = dựng lại font subset theo công thức trong README_SRC (thiếu là _tall.js báo).

## LUẬT CỨNG rút gọn (bản đầy đủ trong 00/01/02)

- Tiếng Việt mộc, xưng hô "em - anh Luân" khi trò chuyện; KHÔNG emoji; dùng "-" không dùng
  gạch dài; font Montserrat.
- Mọi hằng số nghiệp vụ đi qua CH2 (`paramOf`), câu nhắc qua CH4 (`msgText`), ngưỡng KPI qua
  CH6 (`kpiTh`) - không cắm cứng số trong code.
- Nhãn enum ghi NGUYÊN VĂN theo CH1 (dạng "code (Nhãn tiếng Việt)").

## Kết MỌI phiên có thay đổi

1. Cập nhật `02_NHAT_KY_QUYET_DINH.md`: thêm mục mới (quyết định + bẫy đã cắn) + sửa
   "⭐ HIỆN TRẠNG" + VIỆC TỒN. App đổi tính năng thì thêm mục vào `ITTs_WebApp_v5_README.md`.
2. Chạy `./push.sh` (commit + đẩy repo private này).
3. Nếu 3 file app ở gốc có bản mới: chạy `./update.sh` trong
   `/Users/dothanhluan/Claude/itts-sop-demo` để cập nhật demo online
   https://mittomap.github.io/itts-sop-demo/ (Pages deploy mất 1-2 phút; xem lại nhớ
   Cmd+Shift+R để bỏ cache).

## Phối hợp 2 nơi làm việc

Thư mục này đồng thời là nơi các phiên Claude Cowork làm việc (qua cầu nối desktop, không có
git trong tay). Git là trọng tài duy nhất: phiên nào xong việc cũng commit + push; phiên nào
bắt đầu cũng git status + pull. Đừng để 2 phiên cùng sửa app một lúc.
