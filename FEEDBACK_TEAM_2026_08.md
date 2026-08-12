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

### ACA-10 · Sort việc quá hạn theo số ngày — ✅ ĐÃ CHỐT (có ảnh)
> *"Sort các việc của Giáo viên lên trước - số ngày quá hạn -"*

**Xung đột cần biết trước khi làm:** thứ tự nhóm việc hiện tại là bản khai `VIECNHOM` xếp theo mạch
SOP P1→P10, dựng ở V9.48 sau khi chính anh Luân hỏi *"mấy nhóm việc, e sắp xếp thứ tự chuẩn ko nhỉ"*
và có bộ kiểm bắt mọi nhóm mới phải khai vào đó. Đưa việc giáo viên lên đầu là đạp lên quyết định ấy.
**Ảnh chỉ đúng màn Việc hôm nay**, khối **"QUÁ HẠN - LÀM NGAY 49"**. Đọc cột ngày trong ảnh:
*quá 2 · quá 3 · quá 3 · quá 1 · quá 2 · quá 3 · quá 3* - **không sắp theo số ngày quá hạn chút nào.**

**Gốc:** danh sách trong mỗi khối lấy đúng thứ tự của `view`, tức thứ tự NHÓM việc.
**Và KHÔNG đạp lên V9.48:** `VIECNHOM` quy định thứ tự *nhóm*, còn ba khối Quá hạn / Sắp tới hạn /
Theo dõi vốn đã cắt ngang thứ tự ấy rồi - sắp theo độ quá hạn bên trong khối "Làm ngay" chỉ là làm
rõ thêm.
**Chốt:** trong mỗi khối, việc quá hạn lâu nhất lên đầu. (Phần "ghim riêng việc của giáo viên lên
trên" anh Luân chưa yêu cầu thêm - để ngỏ.)

---

## SALE

### SALE-1 · Biểu đồ cột chồng + biểu đồ tròn cho số liệu sale — ✅ ĐÃ CHỐT
> *"số liệu theo dạng biểu đồ cột chồng: Lượt hẹn hôm nay, Tỷ lệ kết nối, đăng ký mới... màu sắc
> từng nhân viên sale chồng lên nhau, 4 cột tượng trưng cho 4 chi nhánh. Số liệu tiền dạng biểu đồ
> tròn: sale nào thu được bao nhiêu chiếm tỉ lệ bao nhiêu %"*

**Ba điểm đo được trước khi vẽ:** app gần như chưa có biểu đồ nào (5 chỗ `<svg>`, không hàm vẽ) nên
phải tự dựng bằng SVG - app chạy offline, không kéo thư viện ngoài · SALE nói 4 chi nhánh, dữ liệu
có 5 cơ sở + Online · **"tỷ lệ kết nối" là %, chồng cột thì cộng dồn ba cái % lại thành con số vô nghĩa.**

**Anh Luân chốt:**
- *"em đổi thành số, rồi hiển thị % cũng dễ hơn"* → cột chồng theo **SỐ LƯỢT kết nối**, có ghi kèm %.
- **Chỉ vẽ cơ sở có số liệu trong kỳ** (cơ sở nào kỳ này trống thì bỏ cột).
- Vị trí: đặt cạnh bảng "Hiệu suất đội tư vấn" trên Báo cáo (em đề xuất, anh chưa bác).

### SALE-2 · Trùng số điện thoại — ✅ ĐÃ CHỐT (và anh Luân đổi hẳn thiết kế, gọn hơn merge)
> *"Chỗ số điện thoại nếu như đã có trên hệ thống >> Báo trùng >> Trùng số nào >> Hiện hồ sơ trùng
> >> Merge 2 hồ sơ lại với nhau"*

**Đang có:** `findDupPhone` báo bằng toast *"SĐT này đã có: <tên> (lead XXX - NV Y). **Bấm lần nữa
nếu VẪN muốn tạo mới.**"* → tức app CHO tạo trùng.

**Anh Luân chốt - KHÔNG làm merge, chặn từ gốc:**
1. Nhập SĐT xong là **lead trùng hiện ngay bên dưới ô nhập**, không đợi bấm Lưu.
2. **Bấm vào lead đó → tự ghi một lượt liên hệ** (DL02b) vào lead có sẵn.
3. **CHẶN HẲN việc tạo trùng** - bỏ lối "bấm lần nữa nếu vẫn muốn tạo mới".
4. *"ko cho trùng, nên ko cần gộp"* - bỏ toàn bộ phần merge.
5. Một SĐT **khác** nhưng cùng một lead → thêm làm **số liên hệ thứ 2 / số người thân**.

**Việc kèm:** DL02 chỉ có đúng một cột `phone_number`, chưa có chỗ cho số phụ → thêm cột số phụ +
quan hệ, theo đúng lối DL09 đã có `emergency_contact_name/phone/relation`.

### SALE-3 · Gia hạn đợt đóng + hai mốc quá hạn — ✅ ĐÃ CHỐT
> *"học viên xin gia hạn đợt đóng thì sale được thao tác xin gia hạn và up minh chứng hình ảnh
> trao đổi rồi chờ em duyệt lại đợt thanh toán... Quá hạn 1 tuần sẽ không được đăng nhập vào hệ
> thống để làm test. Quá hạn 2 tuần sẽ có mail huỷ cam kết"*

- **Xin gia hạn + ảnh minh chứng → hàng chờ duyệt:** làm. App đã có ô tệp (7 chỗ) nên tải ảnh được.
- **Quá hạn 1 tuần chặn làm test:** anh Luân *"ghi nhận lại thôi, cái này để a cho dev làm sau"*
  → **KHÔNG code**, chỉ ghi vào sổ này.
- **Quá hạn 2 tuần → mail huỷ cam kết:** làm theo phương án sinh việc + soạn sẵn nội dung, và
  anh Luân mở rộng thêm (nguyên văn): *"nếu họ có email thì hiện nút gửi email. nếu có zalo thì
  gửi zalo, bấm xong cho soạn nội dung, hiện thông tin gửi, nút gửi, tạo trang lưu trữ các nội
  dung đã gửi... trang đó cũng có thể lọc theo lớp, theo người quản lý, theo thời gian hoặc bộ
  lọc hợp lý"*. **Gửi thật để dev làm sau - app chỉ MÔ PHỎNG**, bấm gửi thì lưu vào sổ lưu trữ.

**Việc phát sinh:** app **chưa có sổ tin đã gửi** (`outbox`: 0 chỗ). Phải dựng bảng mới + màn có
bộ lọc. Và dữ liệu đang lệch: **lead (DL02) có `zalo_id` nhưng không có email; học viên (DL09) có
`email` nhưng không có zalo** → em sẽ thêm cột còn thiếu cho cả hai để hai nút hiện đúng lúc.
Anh thấy không cần thì bảo em bỏ.

### SALE-4 · Thêm "duyệt gia hạn đợt đóng" vào hàng chờ duyệt — ✅ LÀM (rõ, không phải hỏi)
> *"Chỗ chờ duyệt này được cho em xin thêm cái duyệt gia hạn đợt đóng nữa"*

Hàng chờ duyệt hiện có: chiết khấu · hoàn tiền · đơn xin nghỉ. Thêm loại thứ tư.

### SALE-5 · Sale chia lại đợt đóng phải qua duyệt — ✅ LÀM (rõ, không phải hỏi)
> *"Khi bạn sale chia lại đợt đóng thì em sẽ phải duyệt qua thì mới hợp lệ nha anh, chứ không chia
> tùm lùm tà la"*

`insPlanSave` đang cho chia đợt trực tiếp, không qua ai. Thêm bước duyệt.

### SALE-6 · Tên NV WOW làm test + hình thức test — ✅ ĐÃ CHỐT
> *"Chỗ test đầu vào em cần hiện lên tên WOW làm test. Ngoài ra cho thêm hình thức test: test tại
> trung tâm hay làm bài thi thật tại hội đồng thi"*

**Điểm vênh đo được:** DL03 chỉ có MỘT cột người là `graded_by`, và nó chỉ có SAU khi chấm -
42/159 phiếu đang trống. Mà sale cần nói với khách *"em làm test với thầy X"* ngay lúc đặt lịch.

**Anh Luân chốt:**
- **Thêm cột "NV WOW coi test", gán ngay lúc đặt lịch.** Sau chấm xong `graded_by` có thể là người
  khác - app hiện cả hai.
- **Tách hình thức thành HAI câu hỏi riêng:** thi thử hay thi thật (tại hội đồng thi) · online hay
  tại trung tâm. Phải chuyển dữ liệu cũ (`test_format` online/offline) sang cấu trúc mới.

### SALE-7 · Trang hợp đồng cam kết, hai người duyệt — ✅ ĐÃ CHỐT
> *"em muốn 1 trang làm hợp đồng cam kết trên file này để em duyệt luôn: khi đã duyệt thì tự động
> gửi mail đến khách hàng, còn nếu reject thì ghi rõ lý do reject để sale update lại. Sẽ có tổng
> cộng 2 người duyệt hợp đồng là em và Chí, phải duyệt hết thì học viên đó mới được đến bước xếp lớp"*

App **chưa có** hợp đồng cam kết (16 chỗ dùng chữ "cam kết" đều là cam kết đầu ra trong KPI) và
**chưa có luồng duyệt hai người** nào.

**Anh Luân chốt:**
- Hai người duyệt = **Trưởng phòng Tư vấn + Giám đốc (CEO)**. Khai theo CHỨC DANH, không theo tên.
- Nội dung = **cam kết ĐẦU RA (band điểm mục tiêu)**, nối với chỉ số đầu ra đã có.
- Duyệt đủ **cả hai** mới được sang bước xếp lớp; reject phải ghi lý do để sale sửa lại.
- Gửi mail sau khi duyệt: dùng chung cơ chế mô phỏng + sổ lưu trữ đã chốt ở SALE-3.

### SALE-8 · Hai cấp xem số liệu — ✅ ĐÃ CHỐT
> *"phân thành 2 cấp: em thấy hết tất cả các số liệu / leader center: được thấy số liệu của bạn đó
> và những nhân viên dưới bạn đó"*

**Anh Luân chốt:** phạm vi tính **THEO CHI NHÁNH** - leader thấy mọi sale cùng cơ sở (hợp với chính
tên chức danh "Sale Leader Chi nhánh"), không tính theo cây báo cáo. Cơ cấu ba cấp NV Tư vấn →
Sale Leader Chi nhánh → Trưởng phòng Tư vấn là đúng.

**Việc kèm - dọn dữ liệu demo:** cây `reports_to` hiện lộn xộn: NV024 báo cáo cho NV022 (cũng là
NV Tư vấn, không phải leader) · NV022/025/026 báo thẳng Trưởng phòng, bỏ qua leader · NV001 và
NV002 không có ai quản. Sửa ở nguồn pipeline cho đúng ba cấp.

#### SALE-8 (bổ sung) · Anh Luân: *"nếu chi nhánh chưa có leader, thì chỉ mỗi trưởng phòng tư vấn có thể xem"*
Chi nhánh không có ai mang chức danh Sale Leader → số liệu chi nhánh đó chỉ Trưởng phòng Tư vấn
(và cấp trên) xem được, không rơi vào tay ai khác.

### SALE-9 · Thu lead quá hạn chăm sóc, giao người khác — ✅ ĐÃ CHỐT
> *"cần chọn lead hàng loạt và lọc được lead của sale nào, trong trường hợp lead quá thời hạn chăm
> sóc em sẽ thu lead lại rồi đưa cho nhân viên khác hoặc nhân viên mới (đang training) take care"*

**Đã có sẵn:** màn Bàn giao lead lọc được *"Lead NV này đang ôm"*; hai cửa `doHandoverRun` và
`reassignSave` đều nhận DANH SÁCH nhiều lead - tức chọn hàng loạt đã chạy được. Thiếu đúng vế
"thu lead quá hạn".

**Anh Luân chốt:**
- Quá hạn tính **CẢ HAI mốc**, dính một trong hai là vào danh sách thu: (1) lâu ngày không ai chạm
  tới - tính từ lần liên hệ cuối; (2) ôm quá lâu kể từ ngày được giao. **Mỗi mốc một tham số CH2.**
- **Thu và giao thẳng cho người mới trong một lần bấm**, *"nhưng nên có 1 màn hiển thị lại để xác
  nhận"* - xem lại danh sách trước khi chốt.

### SALE-10 · "Làm theo bảng chặng hành trình" — ✅ ĐÃ CHỐT (có ảnh)
> *"Em thích cái giao diện bảng chặng hành trình á, nên mọi cái giao diện này anh làm theo cái bảng
> chặng hành trình nha"*

Anh Luân: *"ý của trưởng phòng tư vấn là làm bảng chặng hành trình luôn cho loại trang này"*.

**Ảnh chỉ rõ: trang Việc hôm nay của sale.** Và dải **"NHÓM VIỆC"** trong ảnh CHÍNH LÀ các chặng
hành trình xếp thành một hàng chip: Lead mới → Đang khai thác → Chưa gặp được → Đã hẹn test → Có
kết quả, chờ tư vấn → Tư vấn sau test → Đang tư vấn → Chờ tư vấn lộ trình → Chăm lại tới hẹn.

**Chốt:** thay dải chip "NHÓM VIỆC" bằng **đường ray chặng** kiểu trang Bản đồ chặng
(`renderChang`) - mỗi ga một con số + số quá hạn, bấm ga là lọc danh sách bên dưới.
Ảnh này cũng xác nhận lại ACA-10: cột ngày là *quá 5·5·5·5·6·7·5·5·7·7·6*, không sắp theo độ quá hạn.

---

## WOW

### WOW-1 · Lịch WOW — ✅ ĐÃ CHỐT: DỰNG LẠI BÁM THEO OLMS (anh Luân gửi 3 ảnh màn thật)
> *"Việc book WOW - thực hiện trên lịch wow bên OLMS - đặt như thế này không biết ca nào trống ca
> nào đã có lịch - khả năng trùng lịch cao"*

Anh Luân: *"em cứ bám thử, nếu cần thứ thử đổi cấu hình cho phù hợp"*.

**Bản em dựng 10/08 theo SOP DL19 KHÁC khá nhiều với màn thật team đang dùng:**

| | Bản đang có (SOP DL19) | OLMS trong ảnh |
|---|---|---|
| Khung giờ | 13 khung **1 giờ**, 08:30→21:30 | **30 phút**, 09:00→21:30 |
| Gom ca | không | **3 ca**: sáng 09:00-12:30 · chiều 12:30-17:30 · tối 17:30-21:30 |
| Lưới | cột = ngày trong **tháng** | cột = ngày trong **TUẦN**, mỗi ngày tách theo **từng NV trực** |
| Trạng thái ô | available/booked/taught/off | thêm **UNAVAILABLE** cho từng ô 30 phút |
| Nội dung ô | tên NV + cơ sở | tên học viên · **loại bài** · mã lớp · **band mục tiêu** · tag **ONL** · tag **VẮNG MẶT** |
| Chi tiết ô | ai trực, trạng thái | học viên · lớp · loại bài · hình thức · **phần thi** · **điểm FC/LR/GRA/PR + Overall** · kết quả từ WOW |
| Cấu hình | khung giờ, ngày đăng ký trước, cam kết giờ/tháng | **số tuần HV xem trước (2)** · **số ngày phải đặt trước (1)** · **số ngày tối thiểu được huỷ (1)** |

**Loại bài thấy trong ảnh:** ENTRY TEST · MIDTERM - SPEAKING · FINAL - SPEAKING · WOW SESSION
(LUYỆN TẬP) · WRITING (cả 2 task). **Phần thi:** PART 1, PART 2, PART 3.
**Điểm:** FC · LR · GRA · PR + OVERALL SCORE (đúng khung chấm Speaking IELTS).

**Việc phải làm:**
1. DL26 đổi sang ô **30 phút**, thêm trạng thái `unavailable`; gom hiển thị theo 3 ca.
2. Màn Lịch trực WOW đổi sang **xem theo tuần**, cột = ngày, mỗi ngày tách theo NV đang trực
   (kèm cơ sở của người đó), ô trống bấm `+` để đặt.
3. DL14 thêm: loại bài · phần thi · hình thức (ONL/tại trung tâm) · điểm FC/LR/GRA/PR + overall ·
   kết quả từ WOW.
4. **Ba tham số CH2 mới** và phải ĐƯỢC ÁP THẬT vào cửa đặt/huỷ: số tuần học viên xem trước ·
   số ngày phải đặt trước · số ngày tối thiểu được huỷ.

### WOW-2 · Bỏ bước chờ xác nhận cho HV tự đặt — ✅ ĐÃ CHỐT
> *"bước chờ xác nhận này - nếu Wower k xác nhận thì buổi WOW không được diễn ra? Xem xét bỏ qua
> bước này đối với trường hợp học viên tự book luyện tập hằng tuần - chỉ cần xác nhận đối với các
> trường hợp đặc biệt"*

**Anh Luân chốt:**
- **Học viên tự đặt buổi LUYỆN TẬP → vào thẳng, không chờ xác nhận.** Entry test / Midterm /
  Final vẫn phải NV WOW xác nhận.
- **Vẫn báo cho NV WOW** (hiện trên lịch + chuông), **và cho họ quyền TỪ CHỐI kèm lý do** - từ
  chối thì ô trực mở lại và học viên được báo để đặt buổi khác.

### WOW-3 · Nhập kết quả buổi WOW ở đâu — ✅ ĐÃ CHỐT
> *"việc nhập kết quả đã nằm bên OLMS - xem xét lại nhập bên nào"*

Anh Luân: *"e cứ làm trên app của mình, sau này dev tính, chỗ nào trùng lặp dev tự cân"*.
→ App giữ ô nhập kết quả (điểm FC/LR/GRA/PR + overall + kết quả từ WOW). Chỉ số WOR và bảng NV
WOW trong Báo cáo vì thế còn nguyên nguồn số liệu.

---

## HỌC VỤ

### HỌC VỤ-1 · Thêm nhóm việc cấp LỚP — ✅ ĐÃ CHỐT
> *"Trong nhóm việc cho em thêm việc của các nhóm lớp, ví dụ: lớp Mas0808 sắp final, lớp Private
> Mỹ Tiên đã hoàn thành 24 giờ học"*

**Đo được:** trong 40+ nhóm việc hiện có, **chỉ đúng MỘT nhóm ở cấp lớp** ("Lớp sắp khai giảng
thiếu sĩ số"); còn lại đều là việc của một người (lead / học viên / buổi / bài). Học vụ nói đúng.

**Anh Luân chốt:** *"thoải mái đi em, e cân cho đầy đủ"* → làm **bốn nhóm**, ngưỡng đưa vào CH2:
lớp **sắp thi Final** · lớp **đã học đủ số giờ cam kết** · lớp **sắp kết thúc khóa** (nối với kế
hoạch khai giảng) · lớp **có nhiều học viên nguy cơ** (cả lớp đuối chứ không riêng một em).

### HỌC VỤ-2 · "Phần này theo quy trình HR đang quản lý" — ✅ ĐÃ CHỐT (đổi thành việc khác)
Anh Luân: *"Họ đang nói đến giáo viên dự phòng đấy em, e cứ bỏ qua cái này cũng được, tại cái này
lúc này mình chốt là học vụ và trưởng phòng aca có thể xử lý, còn danh sách giảng viên dự phòng
thì có thể là mình sẽ nhập vào mỗi tháng, cái đó thì để trưởng phòng ACA nhập"*.

- **Bỏ** vế "HR quản lý".
- **Xử lý đổi GV**: Học vụ + Trưởng phòng ACA (khớp đúng phát hiện ở ACA-8: hiện KHÔNG ai vào
  được trang `gvdp`).
- **VIỆC MỚI:** danh sách **giảng viên dự phòng nhập theo TỪNG THÁNG**, người nhập là **Trưởng
  phòng ACA**.

### HỌC VỤ-3 · Lớp chưa đủ sĩ số khai giảng — ✅ ĐÃ CHỐT (bỏ vế lịch tháng)
> *"Học vụ không có chức năng lấp đầy lớp, chỉ kiểm tra đủ số lượng và thời gian kết thúc lớp cũ
> để làm kế hoạch khai giảng, cần hiển thị trực quan kế hoạch các lớp khai giảng từng tháng để
> sale nhìn thấy và fill học viên vào"*

Anh Luân: *"ý họ là họ ko muốn thấy cái thẻ đó. Cứ bỏ qua yêu cầu này. Vấn đề là nhìn thấy lớp
chưa đủ khai giảng, để có thể phối hợp với sale, sale cũng thấy thẻ này mà"* · *"sale có thể đẩy
thẳng vào lớp đã lên kế hoạch"*.

- **BỎ** vế "hiển thị trực quan kế hoạch khai giảng từng tháng".
- Thẻ **"Lớp chưa đủ sĩ số khai giảng"** phải hiện cho **CẢ Học vụ VÀ Sale** - đây mới là thứ họ cần.
- **Sale đẩy thẳng học viên vào lớp đã lên kế hoạch.**
- Dữ liệu đã đủ: 10 lớp `planning` + 4 lớp `open` trong demo.

---

## Tình hình

**ĐÃ HỎI XONG CẢ 26 MỤC.**
- Chốt LÀM: ACA-1, 2, 4, 5, 6, 8, 9, 10 · SALE-1, 2, 3, 4, 5, 6, 7, 8, 9 (17 mục)
- Chốt KHÔNG LÀM: ACA-3 (đã có sidebar) · ACA-7 (GV phải quan tâm từng học viên)
- Ghi nhận, để dev làm sau: SALE-3 phần chặn đăng nhập làm test
- Chờ ảnh: SALE-10

**Không mục nào còn treo.**

## Việc phát sinh ngoài feedback (tìm ra trong lúc tra)

1. **`gvdp` không ai vào được** — trang GV dự phòng (chứa cửa đổi giáo viên) ngoài phạm vi của cả
   16 chức danh, chỉ quản trị mở được, dù chú thích trong mã khai nó là cửa ghi của Học vụ/TP ACA.
   Anh Luân xác nhận cả hai chức danh đều phải thao tác được.
2. **Thẻ "Học viên đuối học thuật" bấm ra danh sách sai** (đếm trục học thuật, bấm ra lọc nguy cơ
   chung) — xem ACA-6.
