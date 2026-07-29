# CLAUDE.md - Giao thức làm việc dự án ITTs SOP (repo: mittomap/tts-sop-structor - PUBLIC, tên cũ itts-sop)

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
- Build + verify: **một lệnh duy nhất `./verify.sh`** ở gốc repo (build -> trích JS -> 14 bộ kiểm ->
  in bảng xanh/đỏ, mã thoát khác 0 là có chỗ đỏ). `./verify.sh --nhanh` bỏ phần trình duyệt.
  Chi tiết từng bộ kiểm canh điều gì: `_src/README_SRC.md`. Người mới nhận bàn giao đọc `BAN_GIAO_DEV.md`.
- Chi tiết cũ (vẫn đúng, verify.sh gọi hộ): Verify BẮT BUỘC sau mỗi build:
  `node --check` script của cả 2 file HTML, `_tall.js` (kỳ vọng 37 trang 0 lỗi + icon đủ),
  và `_src/_check11.js` cùng các bộ check khác nếu có (suite chuẩn 366 điểm) - xanh hết mới giao.
- Dữ liệu demo: pipeline `_src/gen_demo.py -> seed_giaoan.py -> mkdemo.py -> fixdata.py ->
  check_data.py` (chạy đúng thứ tự, sản phẩm demo_data_big.json). Sửa dữ liệu = sửa Ở NGUỒN
  pipeline, không sửa tay JSON.
- Thêm icon ti-* mới = dựng lại font subset theo công thức trong README_SRC (thiếu là _tall.js báo).

## LUẬT CỨNG SỐ 0 - PHỦ TRỌN SOP (anh Luân chốt 29/07, cao hơn mọi luật khác)

> *"Chúng ta viết app để phục vụ trọn vẹn SOP, nếu làm xong mà chưa thể hiện đủ 100% SOP tức là
> thất bại. Chúng ta có thể thêm, có thể bổ sung, có thể điều chỉnh để nó hợp lý và logic hơn,
> thậm chí thêm chức năng mới để phục vụ công tác quản lý học viên tốt hơn. Nhưng nếu chúng ta
> để thiếu sót những gì SOP đã từng mô tả, nếu chúng ta thấy nó không bị bất hợp lý, mà chúng ta
> làm sót, nghĩa là chúng ta sai."*

- **THÊM thì được, BỚT thì không.** Thấy SOP mô tả một thứ mà app chưa có -> làm, không cần hỏi.
  Thấy một thứ SOP không có mà nên có -> đề xuất rồi làm.
- **Không được tự xếp một mảng SOP vào diện "lệch khỏi trọng tâm" rồi bỏ.** Đã cắn một lần:
  hồ sơ phụ huynh bị xếp nhầm là "việc phòng ban khác" trong khi SOP có mô tả (DL09 có sẵn ba cột
  `emergency_contact_*` từ đầu). "Việc của phòng ban khác" và "việc SOP đã mô tả mà chưa làm" là
  hai chuyện khác hẳn nhau - cái sau không có quyền bỏ.
- **Canh bằng máy, không bằng trí nhớ:** `_src/check_sop.py` đọc THẲNG `ITTs_Operations_Template_v4.xlsx`
  và đối chiếu 357 cột với `gen_v5.py`. Cột nào app không dùng phải khai vào `BOQUA` **kèm lý do
  đọc được**. Đã nằm trong `./verify.sh`.

## LUẬT CỨNG rút gọn (bản đầy đủ trong 00/01/02)

- Tiếng Việt mộc, xưng hô "em - anh Luân" khi trò chuyện; KHÔNG emoji; dùng "-" không dùng
  gạch dài; font Montserrat.
- Mọi hằng số nghiệp vụ đi qua CH2 (`paramOf`), câu nhắc qua CH4 (`msgText`), ngưỡng KPI qua
  CH6 (`kpiTh`) - không cắm cứng số trong code.
- Nhãn enum ghi NGUYÊN VĂN theo CH1 (dạng "code (Nhãn tiếng Việt)").

## Kết MỌI phiên có thay đổi

1. Cập nhật `02_NHAT_KY_QUYET_DINH.md`: thêm mục mới (quyết định + bẫy đã cắn) + sửa
   "⭐ HIỆN TRẠNG" + VIỆC TỒN. App đổi tính năng thì thêm mục vào `ITTs_WebApp_v5_README.md`.
2. Đẩy repo này: phiên cloud Claude Code tự `git add -A` + commit `cap nhat <ngay gio>` + push
   (từ 28/07 chiều phiên cloud có quyền ghi cả 2 repo); làm trên máy Luân thì chạy `./push.sh`.
3. Nếu 3 file app ở gốc có bản mới: chép 3 file sang gốc repo `mittomap/itts-sop-demo` rồi
   commit + push (phiên cloud tự làm; trên máy Luân thì chạy `./update.sh` trong
   `~/Claude/itts-sop-demo`). Demo online: https://mittomap.github.io/itts-sop-demo/
   (Pages deploy mất 1-2 phút; xem lại nhớ Cmd+Shift+R để bỏ cache).

## Phối hợp 2 nơi làm việc

Thư mục này đồng thời là nơi các phiên Claude Cowork làm việc (qua cầu nối desktop, không có
git trong tay). Git là trọng tài duy nhất: phiên nào xong việc cũng commit + push; phiên nào
bắt đầu cũng git status + pull. Đừng để 2 phiên cùng sửa app một lúc.
Từ 28/07 chiều, nơi làm việc CHÍNH là phiên cloud Claude Code của Luân (đọc/ghi thẳng GitHub
cả 2 repo, tự đẩy khi xong việc). Máy Luân là bản phụ: muốn lấy bản mới về thì `git pull`;
nếu lỡ sửa ở máy/Cowork thì push ngay để 2 nơi không lệch.
