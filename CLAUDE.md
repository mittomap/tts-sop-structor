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

- Trang chủ bản demo (màn chọn 3 cổng) có nguồn ở `_src/trangchu_demo.html` - KHÔNG sửa tay
  `index.html` ở repo demo; `_checkux` soi file nguồn này cùng thước với mã app (luật W5: cấm
  dải viền màu trang trí, kể cả dải dựng bằng `::before`).
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
  seed_giaoviec.py -> check_data.py -> check_logic.py` (chạy ĐỦ và ĐÚNG thứ tự, sản phẩm
  demo_data_big.json). Sửa dữ liệu = sửa Ở NGUỒN pipeline, không sửa tay JSON.
  **Bẫy đã cắn 04/08:** danh sách trên trước đây thiếu `seed_giaoviec.py`. Chạy theo bản thiếu
  là bảng Giao việc (DL23 36 việc + DL24 67 bình luận) biến mất không một tiếng động - phải
  `check_logic.py` mới lộ ra (11 lỗi mã tham chiếu chết). Chạy pipeline xong LUÔN chạy cả
  `check_data.py` và `check_logic.py`, cả hai phải ĐẠT.
- Thêm icon ti-* mới = dựng lại font subset theo công thức trong README_SRC (thiếu là _tall.js báo).

## Anh Luân nói "audit" = chạy trọn `GIAO_THUC_AUDIT.md`

Anh Luân đặt 04/08: *"lưu cái này lại cho những lần anh yêu cầu audit, cần bổ sung thêm gì thì em
bổ sung, cái anh yêu cầu phải có nhé"*. Chín mảng: **giao diện · nghiệp vụ · chức năng · dữ liệu
demo (nhất là nút Reset demo) · ngữ cảnh** (năm mảng anh đặt, bắt buộc) cộng **phạm vi dữ liệu ·
nhất quán ba cổng · tài liệu · khai thẳng phần chưa đo được** (bổ sung).

Nhớ nhất: **trước khi giao, anh Luân sẽ bấm nút Reset demo** - nó phải kéo demo về trạng thái
hoàn hảo ở cả ba cổng, mọi chức danh đều có việc, ngày tháng kéo về hiện tại, mà cấu hình đã
chỉnh thì giữ nguyên.

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
  và đối chiếu **bốn mặt** với app: **357 cột** DL (`BOQUA`) · **93 tình huống** sổ trigger HD3
  (`TRIG_BOQUA`, chạy thật `naFor()` trên mọi dòng) · **51 chỉ số** bảng BC2 (`KPI_BOQUA`, phải có
  cả công thức lẫn dòng ngưỡng CH6) · **31 hành động** bảng phân quyền CH3 (`CH3_BOQUA`, đóng vai
  từng chức danh rồi hỏi lại; việc "Quản lý phê duyệt" phải có cửa ghi gọi `chanAct`).
  · **12 màn vận hành VH0-VH11 + 9 bảng báo cáo BC1-BC9** (`VHBC_BOQUA`, vẽ THẬT mọi trang/tab/
  danh sách cộng bảng việc của từng chức danh rồi tìm chuỗi phải có).
  Chỗ nào app không làm phải khai **kèm lý do đọc được**. Đã nằm trong `./verify.sh`.
  Cột chỉ nói "có chỗ để lưu" - nó KHÔNG nói app có nhắc việc, có tính chỉ số, có chặn đúng người,
  có màn hình để xem.
- **LỚP GOOGLE SHEETS ĐÃ NGHỈ HƯU (anh Luân chốt 30/07):** *"tốt nhất là em vét sạch cái sheet cũ
  đi... từ nay ko cần quay lại sheet nữa, đỡ mệt đầu."* Bảy file `.gs` + bốn bản HTML nguyên mẫu
  đã xoá (git giữ). **Đừng dựng lại, đừng thêm file `.gs` mới** - `_src/check_gs.py` canh chuyện
  đó. Mọi cấu hình nay nằm trong màn **Cài đặt** của app. File SOP gốc `.xlsx` vẫn giữ, nhưng chỉ
  để `check_sop.py` đối chiếu - không phải để chạy.
- 66 chỗ `google.script.run` trong `gen_v5.py` **giữ có chủ ý**: chúng là ĐƯỜNG NỐI RA BACKEND
  tương lai, mỗi chỗ đánh dấu đúng một cửa ghi. `SVR` luôn false nên chúng không chạy.
  `check_gs.py` đếm và giữ đúng bản khai - thêm cửa ghi mà quên nối là đỏ.

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
3. Nếu 3 file app ở gốc có bản mới: **CHẠY `./update.sh` trong repo demo** - đừng chép tay:
   ```
   cd ~/itts-sop-demo && ITTS_SRC=/home/user/tts-sop-structor ./update.sh
   ```
   **BẪY ĐÃ CẮN NGUYÊN MỘT NGÀY (05/08):** trang demo online KHÔNG phục vụ ba file ở gốc repo.
   Nó phục vụ **`cong-nhan-vien/index.html`** và **`cong-hoc-vien/index.html`** - hai bản chép
   riêng, có sửa đường dẫn dữ liệu thành `../ITTs_data.js`. Ba file ở gốc chỉ còn để link cũ
   (trước 28/07) không chết. Cả ngày 05/08 em chép đúng ba file ở gốc rồi báo "đã đẩy, anh
   refresh đi" - anh Luân refresh, mở cả tab ẩn danh, vẫn thấy bản 08:06 sáng, rồi báo đi báo
   lại "bấm menu không ăn", "đơ đơ", "sao tải lại vẫn không đúng bản mới". Em thì đo trên file
   ở gốc nên lần nào cũng thấy đúng. **Hai người nhìn hai file khác nhau suốt một ngày.**
4. **Đối chiếu MÃ BẢN DỰNG sau khi đẩy** - bắt buộc, đây là chốt cửa của bẫy trên:
   ```
   grep -oP 'id="navver"[^>]*>[^<]*<b>[a-f0-9]{6}' cong-nhan-vien/index.html | grep -oP '[a-f0-9]{6}$'
   ```
   Mã này phải KHỚP với mã `gen_v5.py` in ra lúc build (`BUILD ID: xxxxxx`). Không khớp là
   trang online vẫn đang phục vụ bản cũ. Mã cũng hiện ở **chân thanh menu** trong app - bảo
   anh Luân đọc dòng đó là biết ngay hai bên có đang nhìn cùng một bản không.
   Demo online: https://mittomap.github.io/itts-sop-demo/ (Pages deploy mất 1-2 phút).

## Phối hợp 2 nơi làm việc

Thư mục này đồng thời là nơi các phiên Claude Cowork làm việc (qua cầu nối desktop, không có
git trong tay). Git là trọng tài duy nhất: phiên nào xong việc cũng commit + push; phiên nào
bắt đầu cũng git status + pull. Đừng để 2 phiên cùng sửa app một lúc.
Từ 28/07 chiều, nơi làm việc CHÍNH là phiên cloud Claude Code của Luân (đọc/ghi thẳng GitHub
cả 2 repo, tự đẩy khi xong việc). Máy Luân là bản phụ: muốn lấy bản mới về thì `git pull`;
nếu lỡ sửa ở máy/Cowork thì push ngay để 2 nơi không lệch.
