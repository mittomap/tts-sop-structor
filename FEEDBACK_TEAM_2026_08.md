# Feedback các team (file "Feedback SOP Demo" anh Luân gửi 11/08) — bản chốt cho V2

Nguồn: Google Sheets *Feedback SOP Demo*, 8 sheet. Đọc thẳng qua Drive.
**Sheet NHÂN SỰ: anh Luân chốt BỎ, không làm** (*"a ko quan tâm tới cái sheet nhân sự, e bỏ cái
sheet nhân sự đi"*) — 9 mục, không đưa vào đây.

Còn **26 mục**: ACA 10 · SALE 10 · WOW 3 · Học vụ 3.
Sheet CHUNG / QUẢN LÝ / KẾ TOÁN: trống, không có mục nào.

**Cách làm:** hỏi anh Luân từng câu một, chốt xong mới ghi vào đây rồi mới code. Mục nào cột
"Mô tả" trong sheet để trống (chỉ có tên ảnh) thì phải hỏi, không đoán màn.

---

## ACA

### ACA-1 · Giao bài tập: đảo vị trí "Kỹ năng" ↔ "Bài trong kho", lọc kho theo kỹ năng — ✅ ĐÃ CHỐT
> *"Vị trí của trường 'Kỹ năng' đổi với 'Bài trong kho', các thông tin của 'Bài trong kho' sẽ phụ
> thuộc theo 'Kỹ năng' ví dụ: chọn 'Kỹ năng' là Writing, 'Bài trong kho' chỉ hiện những bài Writing thôi"*

**Chỗ sửa (đã tra, không cần ảnh):** trang **Bài tập → Giao bài, Bước 2 (bài giao chung)**.
Hiện `bt_title` (Bài trong kho) nằm TRÊN, `bt_skill` (Kỹ năng) nằm DƯỚI, và ô kho liệt kê cả 16
bài không lọc gì.

**Anh Luân chốt:**
- Đảo thứ tự: **Kỹ năng lên trước**, Bài trong kho xuống sau, và kho lọc theo kỹ năng đang chọn.
- **Chưa chọn kỹ năng → vẫn hiện đủ 16 bài.** Ai biết sẵn tên bài thì chọn thẳng, không bị ép
  thêm một bước.
- **Chọn "Mixed (Tổng hợp)" → mở CẢ KHO.** Lý do: kho bài (DL20) chỉ gắn 6 kỹ năng (Nghe 3, Đọc 3,
  Viết 3, Nói 3, Từ vựng 2, Ngữ pháp 2) mà danh mục CH1 `enum_homework_skill` có 7 giá trị — dư
  đúng "Mixed". Lọc đúng nghĩa thì Mixed ra rỗng; anh chốt coi "Tổng hợp" = không giới hạn kỹ năng.
  **Không sửa danh mục CH1.**

### ACA-2 · Bấm vào tên học viên phải mở được thông tin — ✅ ĐÃ CHỐT
> *"Bấm trực tiếp vào tên ở mục này vẫn link về thông tin của học viên"* (cột Mô tả trống)

**Đo trước khi hỏi:** đóng vai đủ chức danh, vẽ mọi trang rồi dò — tên học viên hiện ra mà **không
bấm được ở 14+ màn**: Hành trình học viên (61 tên), Sổ phụ huynh (60), Việc hôm nay (42), Tổng
quan (23), Báo cáo (23), Học tập, Khảo sát, Kết quả đầu ra, Buổi hôm nay, Chờ duyệt, Điểm danh...
Nên đây không phải lỗi một màn.

**Anh Luân chốt:**
- **Áp CHUNG: tên học viên ở đâu cũng bấm được**, không sửa lẻ một màn.
- Bấm tên → **mở drawer thông tin nhanh** (`openStuQuick` đã có sẵn: chặng, SĐT, lớp, chuyên cần,
  việc nên làm, nút Hồ sơ đầy đủ), **không** nhảy trang — để người đang xử một hàng đợi không mất
  chỗ đang đứng.
- Kèm bộ kiểm canh để về sau không hụt lại.

### ACA-3 · "Thêm 1 nút Back to home" — ❌ KHÔNG LÀM (anh Luân chốt)
> Anh Luân: *"bỏ qua yêu cầu này, hiện mình đã có sidebar, nút backtohome hay back to đi đâu thì
> cũng ko có ý nghĩa gì hết."*

Cổng nhân viên đã có thanh menu trái + nút Đổi cổng. Ghi lại để vòng sau không ai đào lên làm lại.

### ACA-4 · Nút "Trao đổi với trung tâm" — ✅ ĐÃ CHỐT (có ảnh)
> *"Thêm nút 'Trao đổi với trung tâm'"* (cột Mô tả trống; anh Luân gửi ảnh)

**Ảnh chỉ đúng chỗ đau nhất:** khối **"Khuyến nghị dành cho bạn"** ở cổng học viên (`s-khuyennghi`).
Thẻ *"Bạn đã vắng không phép 2 buổi"* tự viết ra câu *"Báo trung tâm nếu bạn gặp khó khăn về lịch"*
— **mà không có nút nào để báo.** App tự dựng một ngõ cụt: bảo người ta làm một việc rồi không
cho đường làm.

**Đo trước khi hỏi:** chế độ phụ huynh (`hvPH()`) đang ẩn CẢ HAI khối `s-hoidap` và `s-gopy`
(`HVPH_AN`), nên phụ huynh mở cổng ra không có một đường nào liên hệ trung tâm.

**Anh Luân chốt: làm ở CẢ BỐN chỗ** (*"1,2,3 và chỗ như ảnh"*):
1. **Cổng phụ huynh** — hiện chưa có đường nào.
2. **Cổng học viên** — đã có "Góp ý cho trung tâm" + "Nhắn thêm" nhưng chìm; gom về một tên gọi.
3. **Màn nhân viên** — đường nhắn thẳng cho học viên.
4. **Ngay trên từng thẻ khuyến nghị** (như ảnh), và tin nhắn phải **mang theo ngữ cảnh của thẻ**
   (vắng buổi nào, thiếu bài nào) chứ không mở một ô trống bắt người ta kể lại từ đầu.

**Còn treo — em lấy mặc định AN TOÀN, anh muốn khác thì đổi:** phụ huynh dùng **luồng riêng của
mình**, KHÔNG mở luồng tin nhắn riêng của học viên cho phụ huynh đọc. Tin phụ huynh gửi ghi rõ
người gửi là phụ huynh để học vụ biết đang nói chuyện với ai.

### ACA-5 · Bấm "HV nguy cơ" đi thẳng tới người — ✅ ĐÃ CHỐT
> *"Điều hướng từ 'HV nguy cơ' đến thẳng thông tin chi tiết của học viên nào bị nguy cơ"*

Hiện `goRisk()` mở sổ Học viên đã bật lọc nguy cơ.
**Anh Luân chốt: MỘT người thì mở thẳng hồ sơ người đó, NHIỀU người thì mở danh sách.**

### ACA-6 · "Học viên đuối học thuật" — ✅ ĐÃ CHỐT (và lòi ra một lỗi thật)
> *"Thêm điều hướng từ 'Học viên đuối học thuật', bấm vào trường này sẽ link thẳng đến thông tin
> các học viên đó"*

**Điều hướng đã có, nhưng DẪN SAI CHỖ** — đây là lỗi, không phải thiếu tính năng: thẻ ĐẾM số học
viên yếu ở **trục học thuật** (`S.filter(stuAca)`) mà cú bấm lại chạy `goRisk()` = mở danh sách lọc
**nguy cơ CHUNG**, gồm cả người nguy cơ vì chuyên cần. *Con số đếm một đám, cú bấm dẫn sang đám
khác* — đúng họ lỗi `M16/M17` đã ghi. Sửa: bấm vào phải lọc đúng trục học thuật.

### ACA-7 · "Mặc định Tốt ở trường Nhận xét buổi học" — ❌ TỪ CHỐI (anh Luân chốt)
> Anh Luân: *"từ chối yêu cầu này, giáo viên phải quan tâm từng học viên"*

Em có nêu kèm rủi ro và anh chốt đúng hướng đó: mặc định "Tốt" nghĩa là GV không đụng gì thì hệ
thống VẪN ghi "Tốt" — **app tự nói hộ một câu không ai nói**, cùng họ với bẫy `waBusy` in
"GV rảnh cả ngày" hôm 10/08.

### ACA-8 · Thay ô "Sĩ số" bằng "Số buổi off còn lại" — ✅ ĐÃ CHỐT (có ảnh)
> *"Thay đổi trường 'Sĩ số' thành 'Số buổi Off còn lại'"* + anh Luân: *"ý của ACA là chỗ đó hiển
> thị số buổi còn được phép nghỉ của GIÁO VIÊN, giáo viên chỉ được nghỉ tối đa 2 lần, số 2 đó đưa
> vào cấu hình để sau này đổi được"*

**Ảnh chỉ rõ:** màn **Vận hành lớp**, dải thẻ thứ hai (Thẻ 5/5), ô đầu `10/14 · Sĩ số · 71% sức chứa`.
Chú thích trên ảnh: *"thay bằng 'Số buổi off còn lại' vì 1 khoá GV chỉ được nghỉ tối đa 2 lần"*.

- **Không mất thông tin:** sĩ số 10/14 vẫn nằm nguyên ở khối thông tin lớp ngay dưới dải thẻ.
- **App chưa theo dõi GV nghỉ** (`gvNghi`, `teacher_absent`: 0 chỗ). Suy ra từ dữ liệu có sẵn:
  **buổi của lớp mà người dạy KHÁC giáo viên chính** = một buổi GV chính nghỉ (app đã có
  `sesSetTeacher` đổi GV cho từng buổi và khối GV dự phòng).
- **Tham số CH2 mới**, mặc định 2 — đúng lời anh "để sau này cần thì có thể đổi".
- Nhớ sửa cả `THEDEF.banglop` cho khớp số thẻ, không thì `_checkkhuon` đỏ.

#### ACA-8 (bổ sung) · Anh Luân: *"chỗ chọn người dạy thay phải có chỗ ghi lý do và log em nhỉ"*

Đúng, và tra ra **có sẵn một nửa**:
- Ô lý do ĐÃ CÓ (`f_gvly` - *"Lý do đổi (ghi vào vết của buổi)"*), log ĐÃ CÓ: mỗi lần đổi ghi vào
  vết của buổi dòng `Đổi GV: A -> B (người làm, thời gian) - lý do`.
- Nhưng **không bắt buộc** (bỏ trống vẫn đẩy người được) và là **chữ tự do**, nên không có cách nào
  phân biệt "GV nghỉ" với "trung tâm dời lịch" - tức không đủ để nuôi một con số quota.

**Anh Luân chốt:**
- Lý do thành **mục chọn BẮT BUỘC + ô ghi thêm**.
- **Danh sách lý do đưa vào CẤU HÌNH** để sau thêm/xoá/sửa được (*"nên có chỗ để sau này thêm xóa
  sửa, đưa vào cấu hình"*), mỗi lý do có cờ **"tính là buổi off"**.
- Bốn lý do khởi đầu, **cả bốn đều TÍNH off**: GV báo nghỉ/bận việc riêng · GV ốm đau · GV đến
  trễ/kẹt không tới kịp · Trung tâm dời lịch/đổi GV lâu dài.

**PHÁT HIỆN KÈM (lỗi thật, không nằm trong feedback).** Anh Luân: *"chỗ đó trưởng phòng học vụ và
trưởng phòng aca đều có thể thao tác em nhé, vì giáo viên có thể sẽ báo cho học vụ hoặc báo cho
trưởng phòng aca"*. Đo thật bằng cách đóng vai từng chức danh rồi hỏi `navVis("gvdp")`:
**chỉ "Toàn bộ chức năng" mở được trang GV dự phòng; 15 chức danh còn lại KHÔNG VÀO ĐƯỢC** - kể cả
Học vụ và Trưởng phòng ACA. Trong khi chú thích trong mã viết *"hai màn ấy là cửa GHI của Học vụ /
Trưởng phòng ACA (CH3)"*.
*Chú thích là lời hứa của người viết, không phải bằng chứng về mã* - và cái chạy thì thắng.
→ Mở `gvdp` cho `hocvu` và `aca`.

### ACA-9 · Phân loại phản hồi xong thì phiếu tụt xuống — ✅ ĐÃ CHỐT
> *"luồng logic khi Tiếp nhận và Phân loại khiếu nại, hiện tại sau khi Phân loại, ticket bị chuyển
> xuống dưới nên tốn thêm thao tác kéo tìm kiếm. Đề xuất giữ vị trí hiện tại hoặc phân theo Tiêu
> cực lên đầu, rồi đến Trung Tính và cuối cùng là Tích cực"*

**Gốc:** `fbClassifySave` đổi `feedback_status` từ `new` sang `in_progress`, nên phiếu rời khỏi
nhóm "Mới nhận" và tụt xuống. Vì thế **đề xuất "giữ nguyên vị trí" không làm được** - chính phiếu
đó đã đổi trạng thái.
**Anh Luân chốt: làm đề xuất thứ hai** - sắp **Tiêu cực → Trung tính → Tích cực**. Danh mục
`enum_feedback_type` đã có sẵn đúng ba mức, không phải thêm gì.

### ACA-10 · Sort việc của Giáo viên lên trước theo số ngày quá hạn — ⏳ CHỜ ẢNH
> *"Sort các việc của Giáo viên lên trước - số ngày quá hạn -"*

**Xung đột cần biết trước khi làm:** thứ tự nhóm việc hiện tại là bản khai `VIECNHOM` xếp theo mạch
SOP P1→P10, dựng ở V9.48 sau khi chính anh Luân hỏi *"mấy nhóm việc, e sắp xếp thứ tự chuẩn ko nhỉ"*
và có bộ kiểm bắt mọi nhóm mới phải khai vào đó. Đưa việc giáo viên lên đầu là đạp lên quyết định ấy.
Anh Luân đang gửi ảnh để xác định đúng màn.

---

## Tình hình

**Đã hỏi 10/26.** Xong ACA (10 mục), trừ ACA-10 chờ ảnh.
- Chốt LÀM: ACA-1, ACA-2, ACA-4, ACA-5, ACA-6, ACA-8, ACA-9 (7 mục)
- Chốt KHÔNG LÀM: ACA-3 (đã có sidebar), ACA-7 (GV phải quan tâm từng học viên)
- Chờ ảnh: ACA-10

**Chưa hỏi:** SALE 1-10 · WOW 1-3 · Học vụ 1-3 (16 mục).

## Việc phát sinh ngoài feedback (tìm ra trong lúc tra)

1. **`gvdp` không ai vào được** — trang GV dự phòng (chứa cửa đổi giáo viên) ngoài phạm vi của cả
   16 chức danh, chỉ quản trị mở được, dù chú thích trong mã khai nó là cửa ghi của Học vụ/TP ACA.
   Anh Luân xác nhận cả hai chức danh đều phải thao tác được.
2. **Thẻ "Học viên đuối học thuật" bấm ra danh sách sai** (đếm trục học thuật, bấm ra lọc nguy cơ
   chung) — xem ACA-6.
