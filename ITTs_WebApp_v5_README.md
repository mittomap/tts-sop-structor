# ITTs Web App **V5** — bản gọn, xoay quanh LUỒNG HÀNH TRÌNH

> `ITTs_WebApp_v5_demo.html` là bản app: mở bằng trình duyệt, mọi thao tác ghi thật vào bộ nhớ trình duyệt. **Lớp Google Sheets đã cho nghỉ hưu 30/07** - không còn bản `.gs` nào, mọi cấu hình nằm trong màn Cài đặt của chính app. Khi anh Luân chốt nền tảng backend, 66 chỗ ghi trong app đã có sẵn đường nối ra máy chủ (xem khối ghi chú tại `var SVR=` trong `gen_v5.py`).

## ⭐ MỚI 10/08/2026 — **Lịch trực WOW**: đặt buổi WOW nay bám vào ca trực có thật

Trước đây app mặc định **lúc nào cũng có người trực**: ô giờ để trống trơn, gõ 03:00 sáng ngày
01/01/2030 app vẫn nhận và báo *"Đã đặt buổi WOW cho ..."*. SOP thì đã mô tả sẵn màn **"Bảng trực
NV WOW - theo tháng"** (ô trống = không ai trực) và danh mục `enum_wow_slot_status` — app chưa
dùng tới.

Nay có ba phần:

1. **Mỗi NV WOW tự đăng ký ca của mình** — trang **Lịch trực WOW**, nút *Đăng ký ca trực*: chọn
   ngày, tick các khung giờ (mặc định 09:00 · 15:00 · 17:00 · 19:00, sửa được ở Cài đặt →
   `wowSlotHours`). **Không ai đăng ký hộ ai được** — ca là cam kết có mặt, ký thay là hứa thay.
2. **Lịch tổng nhìn một cái là biết** — lưới cột = ngày, hàng = khung giờ; bấm vào ô ra chi tiết
   ai trực, ca nào còn trống. Dải 4 thẻ ở đầu trang, trong đó thẻ **"Ngày không ai trực"** là con
   số quan trọng nhất: đó chính là những ngày học viên mở app ra và không đặt được buổi nào. Cuối
   trang là bảng **Tổng giờ trực theo NV** đối chiếu với buổi WOW thật (đúng cột SOP đòi).
3. **Cả hai đường đặt buổi WOW đều đi qua lịch này** — học vụ (*Thêm buổi WOW*) và học viên (*Xin
   buổi WOW* ở cổng học viên) nay chỉ **chọn được ca đã đăng ký và còn trống**; ô ngày/giờ tự do
   đã gỡ. Đặt xong ca tự chuyển sang `booked` nên không hai người đặt trùng một ca.

## ⭐ V2 (08/08/2026) — mở app ra là thấy VIỆC CỦA HÔM NAY

> Anh Luân: *"Hệ thống lớn, nhưng quá khó dùng thì chết ngay. Như v1, a ko chắc nhân viên sale
> có hiểu hành trình và cách app trình bày ko đó."*

Đo bằng bảng `NHIP` mà chính app khai (mỗi chức danh mỗi ngày hỏi gì): **15 chức danh, 74 câu
hỏi, không ai cần quá 5 trang** để làm hết việc trong ngày. Báo cáo đầy đủ:
`PHAN_TICH_CAU_HOI_08_08.md`.

**Quyết định:** giữ đủ 25 trang nghiệp vụ, nhưng bớt **số trang một người phải nhìn**.

| | Trước | Sau |
|---|---|---|
| Mở app ra thấy ngay việc hôm nay | **0/16 chức danh** | **16/16** |
| Mục menu của Giám đốc | 60 | **44** |
| Câu hỏi bấm một cái ra đúng danh sách | 12/74 | **63/70** |
| Câu hỏi không tới được trang | 19 | **0** |
| Câu hỏi trỏ vào trang bị chặn | 6 | **0** |

**Bốn thay đổi người dùng thấy được:**

1. **Nhịp ngày ở ngay trang bạn đáp xuống.** Mở app là 3-5 dòng "hôm nay làm gì", theo buổi
   (đầu ngày · trong ngày · cuối ngày), mỗi dòng một con số thật và một câu *vì sao phải làm*.
   **Bấm một dòng là tới trang đích với danh sách đã lọc sẵn đúng câu hỏi ấy** — không phải mở
   trang rồi tự dò trong vài trăm dòng.
2. **Số trên nhịp bằng số trên trang.** Trước đây nhịp đếm toàn trung tâm còn trang đếm theo
   phạm vi người dùng: Trưởng phòng Marketing đọc *"57 việc quá hạn"*, mở trang ra thấy 7.
3. **Trưởng phòng Tư vấn / Marketing / Học vụ có nhịp của phòng mình** — trước đây cả ba đọc
   đúng năm dòng của Giám đốc, không một dòng nào về phòng họ.
4. **Trang Tra cứu & sổ sách** gom 16 cuốn sổ chỉ-đọc sau một cửa, có ô tìm, mỗi thẻ nói sổ đó
   đang có bao nhiêu dòng. Không sổ nào bị xoá; số cú bấm để tới một cuốn sổ **không tăng**.

**Hai trang từng bị giấu, nay mở ra đúng người:**
- **Giao & chấm Bài tập** — giáo viên và Trưởng phòng ACA. App vẫn giục *"12 bài chờ chấm"* mà
  họ không có cửa nào vào. Thêm chế độ **"Chờ chấm - mọi lớp"**: gom bài chưa chấm của mọi lớp
  vào một bảng, mỗi dòng một nút nhảy thẳng vào chấm.
- **Duyệt chiết khấu** — Trưởng phòng Tư vấn. SOP giao họ duyệt, nhịp ngày nhắc họ, mà trang bị
  chặn ở cửa.

**Chip lọc mới:** Buổi WOW hôm nay · HV không đến chưa hỏi · Chờ ghi nhận xét (6 chip trang Buổi
học trước đây **không có một con số nào**) · Chờ xếp lớp · Chờ chấm mọi lớp · Lead về trong 24h ·
Lead không đạt chuẩn · Nguy cơ học thuật · Hồ sơ nhân sự còn thiếu · 3 chip trang Chăm lại khách cũ.

Canh bằng máy: **`_src/_checkcauhoi.js`** — mỗi câu hỏi trong nhịp phải tới được trang, người đó
phải được xem, và **số trên nhịp phải bằng số trên chip**. Lệch một con là đỏ.

## Triết lý V5: người dùng là trung tâm, đi theo luồng — không phải tra bảng

Nhân viên mở **Chạy quy trình** → chọn một khách/học viên (hoặc hàng đợi) → app **dắt qua từng màn theo đúng chặng người đó đang đứng**. Mỗi màn chỉ hỏi vài ô cần cho bước đó, và bày sẵn mọi thông tin cần biết.

## 1. Menu gọn lại (4 nhóm)

| Nhóm | Trang |
|---|---|
| **Vận hành** | Chạy quy trình · Hành trình học viên · Việc hôm nay · Tổng quan |
| **Danh sách** | Lead · Học viên · **Học viên nguy cơ** · Lớp · **Giảng viên** · Nhân viên |
| **Lớp học** | Điểm danh · Bài tập · Bảng lớp/Roster |
| **Quản lý** | Duyệt CK & Hoàn tiền · Báo cáo & KPI · Bàn giao lead · Cài đặt |

Các trang thao tác cũ (P1–P10: Test, Tư vấn, Thanh toán, Xếp lớp, WOW, Khảo sát, Khiếu nại, Kết thúc, Phễu, Tra cứu) **vẫn còn trong code** nhưng **ẩn khỏi menu** — vì giờ chúng được gọi tự động trong luồng Chạy quy trình. Không mất tính năng, chỉ gọn menu.

## 2. Nhóm Danh sách gom một chỗ

- **Danh sách Lead / Học viên / Lớp / Nhân viên**: bảng đầy đủ, tìm + lọc theo trạng thái.
- **Học viên nguy cơ**: tự lọc HV có nguy cơ chuyên cần/học thuật, kèm lý do + ghi chú theo dõi.
- **Giảng viên**: lọc riêng đội ngũ giảng dạy từ danh sách nhân viên.
- Mỗi dòng có nút **Chạy quy trình** / **Hồ sơ** / **Bảng lớp** để nhảy thẳng vào việc.
- Các danh sách này ở chế độ xem (thêm/sửa nhân sự & danh mục làm ở trang Cài đặt).

## 3. Luồng nâng cấp: xem/cập nhật bước cũ + gợi ý bước kế tiếp

Trong màn Chạy quy trình:

- **Dải chặng bấm được**: bấm vào một bước **đã qua** → mở **màn xem lại**: hiện đúng những gì đã ghi ở bước đó (khóa đề xuất, điểm test, số tiền thu, lớp đã xếp...), kèm nút **"Mở hồ sơ đầy đủ"** để sửa dữ liệu và **"Ghi thêm điểm chạm"**. Bấm **"Về bước hiện tại"** để quay lại làm tiếp.
- **Gợi ý bước kế tiếp** ("TIẾP THEO SẼ LÀ"): ngay dưới bước hiện tại, hiện chặng sau — tên, vì sao, **dữ liệu bước đó sẽ cần**, ai phụ trách, hạn bao lâu. Nhân viên biết trước cần chuẩn bị gì.
- Vẫn giữ **2 tab** của bước hiện tại: *Bước tiếp* (đẩy sang chặng sau) và *Ghi điểm chạm* (chăm nhiều lần ở nguyên chặng — vì không phải ai cũng 1 lần là qua bước).

## Kiểm chứng (chạy máy)

- Menu 4 nhóm đúng thứ tự; 5 danh sách mới render đủ (HV 81, nguy cơ 22, lớp 22, GV 7, NV 35), đều ở chế độ xem.
- Dải chặng: 10 bước bấm được với khách "Đang học"; xem lại bước Tư vấn hiện đúng khóa/lịch/phản hồi đã chốt; xem lại bước Thu tiền hiện đã thu/còn lại/số phiếu.
- Gợi ý kế tiếp: Tư vấn → "Đăng ký - chờ thu"; Đang học → "Kết thúc khóa".
- Toàn bộ trang render 0 lỗi.

## Còn làm tiếp (khi anh chốt luồng)

- Đưa các bước phụ (WOW, khiếu nại, khảo sát, điểm danh) vào cùng cơ chế Chạy quy trình.
- Cho **sửa trực tiếp** dữ liệu bước cũ ngay trong màn xem lại (hiện đang mở hồ sơ để sửa).
- Sinh bản `ITTs_WebApp_v5.gs` nối Google Sheets thật.


---

# Cập nhật V5.2 — trả lời câu hỏi "bắt đầu từ đâu, tìm ở đâu"

## Bắt đầu từ đâu → Trang chủ **Bàn làm việc**
Mở app là vào **Bàn làm việc** (không phải Tổng quan nữa):
- Lời chào + tóm tắt "hôm nay có N việc, M quá hạn".
- Nút lớn **▶ Chạy quy trình** + **ô tìm 1 khách** để vào việc ngay.
- **4 chỉ số nhanh** bấm được (Lead đang khai thác · HV nguy cơ · ĐK còn nợ · CK chờ duyệt).
- **Việc cần xử lý của tôi** gom theo nhóm chặng, mỗi dòng có nút *Xử lý* → mở thẳng Chạy quy trình.
- "Việc hôm nay" đã **gộp vào đây** (bỏ trang riêng). "Tổng quan" (dashboard số liệu) chuyển xuống nhóm **Quản lý**.

## Tìm ở đâu → Menu 4 nhóm rõ ràng
| Nhóm | Trang |
|---|---|
| **Vận hành** | Bàn làm việc · Chạy quy trình · Hành trình học viên |
| **Danh sách** | Lead · Học viên · HV nguy cơ · Lớp · Giảng viên · Nhân viên |
| **Tác vụ** | Điểm danh · Bài tập · **Tạo review gửi lớp** · **Ghi nhận phản hồi** · Duyệt CK · Bảng lớp |
| **Quản lý** | Tổng quan · Báo cáo · Bàn giao · Cài đặt |

## 2 trang mới (nhóm Tác vụ)
- **Tạo review gửi lớp**: chọn 1 lớp → tạo phiếu khảo sát cho **tất cả HV đang học** của lớp (mỗi em 1 phiếu DL15). Kiểm: 1 lớp → 10 phiếu.
- **Ghi nhận phản hồi**: khách phản hồi qua **gọi/nhắn/gặp trực tiếp** (không qua form) → ghi thẳng vào DL16; nếu tiêu cực, hỏi luôn *"Chuyển thành khiếu nại?"* → tạo DL17 link 2 chiều.

## Đã lường trước tình huống ở mỗi chặng (không chỉ "đường thẳng")
Trong Chạy quy trình, mỗi bước giờ có nút cho nhánh rẽ thực tế:
- **Đang khai thác / Đặt test**: *"Khách từ chối / không quan tâm"* → lead sang **Đã mất** (vẫn chăm lại được).
- **Tư vấn**: khách *từ chối đăng ký* (dropped) → tự sang **Đã mất**.
- **Tạo đăng ký**: *"Khách đổi ý - không đăng ký nữa"* → hủy.
- **Đang học**: *"Báo nguy cơ"* (đưa vào Danh sách HV nguy cơ) và *"HV dừng học"* (bỏ học / bảo lưu → nhánh rẽ).
- (Đã có từ trước: vắng test + hẹn lại, HV từ chối lớp + đổi lớp, gọi hụt nhiều lần + đổi kênh, ghi điểm chạm nhiều lần ở nguyên chặng.)

## Icon menu đã sửa
Bộ icon nhúng offline được **dựng lại từ font Tabler** đủ 108 icon dùng trong app — "Chạy quy trình" và mọi mục menu giờ có icon.

**Kiểm chứng V5.2**: menu 4 nhóm đúng; trang chủ đủ hero + 4 chỉ số + 27 việc gom 10 nhóm; review 1 lớp → 10 phiếu; phản hồi tiêu cực → khiếu nại link 2 chiều; 4 nhánh rẽ chuyển chặng đúng; toàn bộ trang 0 lỗi.

---

# Cập nhật V5.3

## Bắt đầu quy trình NGAY TỪ DANH SÁCH (trả lời câu hỏi của anh: có)
Mọi danh sách người đều có nút **▶ Chạy quy trình** trên từng dòng:
- **Danh sách Lead**: Chạy quy trình · Ghi liên hệ · Hồ sơ.
- **Danh sách Học viên** & **Học viên nguy cơ**: Chạy quy trình · Hồ sơ (tên bấm được → mở hồ sơ 360).
Bấm là vào thẳng màn Chạy quy trình đúng chặng người đó đang đứng — không cần về Bàn làm việc.

## Ẩn / hiện cột danh sách
Mỗi danh sách có nút **"Cột"** (góc phải thanh lọc) → mở bảng chọn, tick để ẩn/hiện từng cột. Nút hiện số cột đang bật (vd "Cột (5/6)"). Lựa chọn giữ trong phiên làm việc. Cột mã (cột đầu) luôn giữ để không mất khóa dòng.

## Đưa các bước phụ VÀO luồng Chạy quy trình (chặng Đang học)
Ở chặng **Đang học**, màn Chạy quy trình giờ có hàng nút "chăm sóc trong lúc học" — tất cả mở đúng form, chọn sẵn học viên đó:
- **Đặt WOW** (buổi 1-1) → DL14
- **Gửi review** (khảo sát) → DL15
- **Ghi phản hồi** (feedback thủ công) → DL16
- **Khiếu nại** (tiếp nhận) → DL17
- **Điểm danh lớp** → nhảy sang Điểm danh với lớp của em đã chọn sẵn
- **Báo nguy cơ** / **HV dừng học** (đã có từ V5.2)

Nhờ vậy nhân viên chăm một học viên đang học chỉ ở **một màn**, không phải đi lục 5 trang khác nhau.

**Kiểm chứng V5.3**: 3 danh sách người đều có nút Chạy quy trình; ẩn 2 cột → bảng giảm đúng 2 cột; 7 nút chăm sóc ở chặng Đang học đều mở đúng form/đúng lớp; toàn bộ trang 0 lỗi.

---

# Cập nhật V5.4

## Cột ẩn mặc định
Các danh sách mở ra đã **ẩn sẵn**: Mã · SĐT · Lượt liên hệ · NV phụ trách — chỉ hiện cột đáng nhìn (Họ tên · Trạng thái · Hẹn liên hệ · Việc cần làm...). Bấm nút **"Cột"** để bật lại bất cứ cột nào.

## Chạy quy trình: CHỌN người + XEM chặng trước khi bắt đầu
Sửa đúng góp ý của anh — không còn tự nhảy vào một người:
- Nút **Chạy quy trình** ở Bàn làm việc giờ mở màn chọn (không auto-pick).
- Bấm một hàng đợi (vd "Việc cần xử lý hôm nay", hay một chặng) → hiện **danh sách người trong hàng đợi**, mỗi dòng ghi rõ **tên · SĐT · đang ở chặng nào · việc kế tiếp**. Người dùng **thấy trước** rồi mới:
  - Bấm **"Bắt đầu từ đầu"** để chạy lần lượt, hoặc
  - Bấm **"Chạy"** ngay dòng của người mình muốn.
- Ô **tìm 1 người** (cả ở Bàn làm việc và Chạy quy trình): gõ tên/SĐT → kết quả hiện **chip chặng** của từng người + nút Chạy, biết họ đang ở đâu trước khi vào.

**Kiểm chứng V5.4**: Lead ẩn đúng 4 cột mặc định, bật lại được qua nút Cột; bấm hàng đợi → hiện 107 người kèm chặng + việc kế tiếp, chọn 1 người mới vào màn chạy; ô tìm hiện chặng; toàn bộ trang 0 lỗi.

---

# Cập nhật V5.5

## Chạy quy trình: danh sách hiện NGAY dưới, không nhảy màn
Trước phải bấm hàng đợi rồi mới sang màn xem trước — nay gộp làm một:
- Vào **Chạy quy trình** là thấy ngay: **ô tìm** + **chip lọc nhóm/chặng** (Cần xử lý · Tất cả · từng chặng) + **danh sách người ngay bên dưới**.
- Mỗi dòng: tên · SĐT · **đang ở chặng nào** · việc kế tiếp · nút **Chạy**. Gõ tìm hoặc bấm chip là danh sách lọc tại chỗ.
- Bấm một người → vào màn chạy, đồng thời **giữ cả danh sách làm hàng đợi** để "Người tiếp theo" chạy liên tục.
- Nút Chạy quy trình ở Bàn làm việc & các chip hàng đợi đều đưa về đúng trang này (không còn màn trung gian).

**Kiểm chứng V5.5**: trang Chạy quy trình hiện danh sách 60 người + 13 chip lọc ngay trên trang; lọc chặng Tư vấn còn 23 người; bấm 1 người vào màn chạy kèm hàng đợi 107 người; 0 lỗi.

---

# Cập nhật V5.6

## Hồ sơ hành trình 360 giờ TÁC ĐỘNG được (không chỉ xem)
- Nút **▶ Chạy quy trình** ngay đầu hồ sơ → vào màn chạy đúng chặng.
- **Dải chặng bấm được**: bấm một bước bất kỳ (đã qua hay hiện tại) → nhảy thẳng vào Chạy quy trình ở đúng bước đó để xử lý / xem lại / cập nhật.
- Ô **VIỆC KẾ TIẾP** có nút làm bước ngay; với **học viên** thêm hàng nút **Đặt WOW · Gửi review · Ghi phản hồi · Khiếu nại**; với **lead** có **Ghi liên hệ · Giao lại NV**.
- Nhờ vậy hồ sơ 360 vừa là nơi xem toàn cảnh, vừa là bàn để **hành động ngay**.

**Kiểm chứng V5.6**: hồ sơ HV đang học có nút Chạy quy trình + 10 bước bấm được + 4 nút chăm sóc; bấm chặng "Chấm test" đã qua → vào màn chạy ở chế độ xem lại đúng bước; đặt WOW từ hồ sơ mở đúng drawer; lead có Ghi liên hệ + Giao lại NV; 0 lỗi.

---

# Cập nhật V5.7

## Bàn làm việc = Chạy quy trình (một trang, không lặp)
Gộp hai trang làm một để vừa gọn vừa tiện:
- **Trang chủ** giờ có: lời chào + **ô tìm** (lọc thẳng danh sách bên dưới) + **4 chỉ số** bấm được (Lead · HV nguy cơ · Đăng ký còn nợ · Chiết khấu chờ duyệt).
- Ngay dưới là panel **Chạy quy trình**: **chip lọc theo chặng** (Cần xử lý · Tất cả · từng chặng) + **danh sách người** — lấp trọn khoảng trống, không còn màn riêng.
- Bấm một người là chạy; cả danh sách thành **hàng đợi** để "Người tiếp theo" chạy liên tục.
- **Chạy quy trình** đã bỏ khỏi menu (mọi đường dẫn tự đưa về Bàn làm việc).

## Vá lỗi chip lọc "trắng bốc"
Chip lọc được chọn mà không kèm màu (chip chặng, nút "Tất cả") trước đây **chữ trắng trên nền trắng** → nay có nền xanh navy mặc định. Áp cho cả chip lọc ở các trang Danh sách.

**Kiểm chứng V5.7**: 12 trang chính render sạch (0 `undefined`/`NaN`); trang chủ có panel Chạy quy trình với chip + danh sách (`#chaybody`); chọn một chặng → chip hiện nền navy (hết trắng bốc); màn chạy một người vẫn chạy đúng; `chay` không còn trên menu.

---

# Cập nhật V5.8

## 1. Chuẩn thông điệp CH4 — giờ đã áp vào hành trình
Trước đây app tự chế câu nhắc việc, không dùng CH4. Nay:

- **Cài đặt → tab "Thông điệp nhắc việc (CH4)"**: đủ **94 câu chuẩn**, gom theo sheet, sửa mẫu câu tại chỗ, xem trước câu đã ghép (chỗ `{1}` tự điền tham số CH2).
- Màn **Chạy quy trình** có khung vàng **"Việc cần làm theo SOP · NAxxx"** ở đúng bước đang đứng — quá hạn thì tự đổi sang câu cảnh báo tương ứng.
- Danh sách việc cũng lấy câu CH4 làm nội dung. **192/221** hồ sơ đang có câu chuẩn.

## 2. Khách từ chối / mất liên lạc đã vào hành trình (cho chiến dịch reup)
Hai nhánh này vốn đã có trong bộ máy nhưng **không hiện ở đâu** vì chip lọc chỉ liệt kê 13 chặng chính.

- Thêm nhóm **"Chăm lại/Reup"** = *Đã mất* + *Chưa gặp được* (**33 hồ sơ**) — có khối riêng trên Bàn làm việc và chip lọc riêng.
- Thêm chip cho **Bảo lưu/Bỏ học** và **Đăng ký đã hủy**.

## 3. 12 khối vận hành — bấm là lọc đúng người
4 khối cũ bấm vào chỉ mở trang danh sách chung nên "chưa kết nối đúng". Nay mỗi khối **lọc thẳng danh sách Chạy quy trình ngay bên dưới**:

Lead mới cần gọi · Đang khai thác · Test chờ chấm · Có KQ chờ tư vấn · Đăng ký chờ thu · Đã thu chờ xếp lớp · Onboarding chưa xong · Học viên nguy cơ · WOW chờ xử lý · Chiết khấu chờ duyệt · Đăng ký còn nợ · Chăm lại/Reup

## 4. Tổng quan đã gộp vào Báo cáo & KPI (chặt theo SOP)
Menu Quản lý giờ chỉ còn **Tổng quan · Báo cáo & KPI**. Trang gồm: tình hình kinh doanh → sắp diễn ra 7 ngày → **KPI theo SOP** → phễu → phân bố → chỉ số phòng ban → bảng HV nguy cơ.

- **KPI theo SOP (CH6)**: tính thẳng từ dữ liệu vận hành, **36/48 chỉ số có số thật**, 12 chỉ số thiếu trường dữ liệu hiện "—".
- Gom theo **giai đoạn P1–P10**, so ngưỡng + hướng (≤/≥), chấm xanh/đỏ; sửa ngưỡng ngay ở Cài đặt.

## 5. Bàn giao lead: đã có tìm kiếm + bộ lọc
Ô tìm theo tên/SĐT/mã + chip lọc trạng thái (đúng thứ tự danh mục) + nút Xóa lọc. "Chọn tất cả" chỉ chọn các dòng đang hiện.

## 6. Bỏ Danh sách Nhân viên khỏi nhóm Danh sách
Nhân sự đã quản lý ở **Cài đặt → Nhân viên & Email**.

## Tiện thêm: tìm kiếm không cần bỏ dấu
Gõ **"nguyen"** giờ ra **"Nguyễn"** — áp cho ô tìm ở Bàn giao, Chạy quy trình và mọi trang Danh sách.

**Kiểm chứng V5.8**: 14 trang render sạch (0 `undefined`/`NaN`); CH4 nạp 94 câu, `msgText` ghép đúng tham số; reup lọc ra 33 hồ sơ; 12 khối bấm lọc đúng (Lead mới 28, Test chờ chấm 6, ĐK chờ thu 6, Reup 33); Bàn giao lọc "contacted" còn 8/48, tìm "nguyen" ra 12 dòng; KPI 36/48 có số, **không còn chỉ số nào vượt 0–100%** (đã vá CR3 từ 177% → 87%), LRT hiển thị "9,9 ngày" thay vì "14269 phút".

---

# Cập nhật V5.9 — đủ 20 trang danh sách

Trước đây menu Danh sách chỉ có **5/20 bảng**. Nay đủ cả 20, chia 3 nhóm con cho dễ tìm:

**DS · Tuyển sinh** — Lead · Lịch sử liên hệ · Đặt lịch test · Tư vấn · Đăng ký · Thanh toán

**DS · Học tập** — Học viên · Học viên nguy cơ · Lớp học · Xếp lớp & nhập học · Buổi học · Điểm danh · Bài tập · Buổi WOW 1-1 · Kết thúc khóa · Giảng viên

**DS · Khác** — Khóa học · Khảo sát · Phản hồi · Khiếu nại

## 5 bảng trước đây không có danh sách nào
Đã dựng mới hoàn toàn: **Khóa học** (DL05), **Tư vấn** (DL04), **Buổi học** (DL11), **Điểm danh** (DL12, 819 dòng), **Khảo sát** (DL15).

## Quyền sửa
- **Khóa học** sửa được (Thêm mới + Sửa) vì là danh mục sản phẩm/học phí.
- 18 danh sách còn lại **chỉ xem** — tra cứu, lọc, tìm, ẩn/hiện cột. Muốn đổi dữ liệu thì đi qua luồng Chạy quy trình để không phá SOP.
- Danh sách chỉ xem nay **bỏ luôn ô đổi trạng thái nhanh** trong bảng (trước đây vẫn sửa được dù đã đánh dấu chỉ xem).

Mọi danh sách đều có sẵn: tìm kiếm (không cần bỏ dấu), chip lọc theo đúng thứ tự danh mục, ẩn/hiện cột, phân trang, và nút hành động phù hợp (Chạy quy trình / Hồ sơ / Bảng lớp).

### Ẩn/hiện cột phủ luôn cả sổ dựng tay (18/08)
Nút **Cột** trước đây chỉ có ở các sổ đi qua bộ máy danh sách chung, vì nó đọc danh sách cột từ
khai báo của sổ ấy. Nay có bảng khai thứ hai cho các bảng dựng tay, nên **16 sổ chính dựng tay**
cũng có nút Cột: Công nợ học viên · Kho mẫu tin · Sổ tin đã gửi · Sổ cam kết · Khảo sát theo lớp ·
Kho bài tập · Giáo án theo khóa · Buổi học trong ngày (GV dự phòng) · Bàn giao lead · Sổ ca dạy
thay · Hồ sơ khóa (lớp thuộc khóa) · Phòng học (điểm đụng) · Bảng lớp (học viên + lịch sử đổi
lịch) · Mã giới thiệu. Lựa chọn nhớ theo từng người và giữ qua F5.

### Hỏi đáp trả lời bằng SỐ THẬT và dẫn tới danh sách đã lọc (18/08)
Hộp Hỏi đáp và Trợ lý nay đọc thẳng bảng nhịp ngày của app: mỗi dòng nhịp là một việc kèm sẵn
trang đích, hàm đếm và mã chip lọc. Hỏi *"ai chưa xếp lớp"*, *"bài tập đang chờ chấm"*, *"thu các
đợt tới hạn hôm nay"* - app trả về **con số thật**, kèm nút mở **đúng danh sách đã lọc sẵn**. Con
số trong câu trả lời và con số trên chip của trang đích đọc cùng một hàm nên không thể lệch nhau.

Đo trước và sau: 53 câu người thật hỏi - trước 9 câu ra số thật, sau **40 câu**; câu app không
hiểu từ 2 xuống **0**.

Hỏi *"làm sao để..."* thì app trả lời bằng **bài hướng dẫn chạy từng bước** kèm nút chạy luôn.
Trang Hỏi đáp có sẵn **45 câu mẫu chia 9 nhóm theo ghế ngồi**; Trợ lý gợi ý ba câu của chính chức
danh đang đăng nhập.

### Bài hướng dẫn theo VIỆC (18/08)
Thêm cấp thứ năm "Làm một việc cụ thể" - 4 bài: gửi khảo sát cho một lớp · xếp người dạy thay ·
lọc một danh sách rồi xuất ra Excel · đọc công nợ và đòi đúng người. Trước đó 16 bài đều dạy theo
vai ("một ngày của Học vụ") hoặc theo cấu hình, không bài nào dạy một việc.

### Cột mặc định chọn theo ngữ cảnh từng bảng (18/08)
Mỗi sổ chỉ bày sẵn những cột người ta thật sự đọc; phần còn lại vẫn có trong nút Cột, bật là hiện.
Ba loại cột mặc định ẩn: **cột mã** (mọi sổ, kể cả bảng dựng tay) · **cột gần như trống** (có dữ
liệu ở dưới 10% số dòng) · **cột nói lại thứ cột bên cạnh đã nói**. Cột "việc kế tiếp" tuy cũng
thưa nhưng luôn hiện - đó là cột người ta mở sổ ra để tìm.

Sổ Giảng viên được xếp lại thứ tự theo đúng thứ tự câu hỏi: ai · vai trò · đang gánh bao nhiêu
(lớp, học viên) · đang nợ gì (nhận xét, bài chấm) · còn làm hay đã nghỉ. Các số tổng kết (lớp đã
dạy xong, buổi WOW tháng, ca test, giờ dạy tháng) chuyển xuống mặc định ẩn.

Kết quả: 29 sổ danh sách bày 4-9 cột thay vì có sổ bày 12; 15 bảng dựng tay bỏ cột mã khỏi mặc định.

Nút gắn cho **sổ chính của trang** - cuốn sổ người ta mở trang ra để đọc. Bảng phụ trong ngăn kéo,
trong hồ sơ một dòng, hay chỉ ba bốn cột thì không gắn: mỗi panel một nút thì trang thành bảng
điều khiển. Bảng nào có cột chỉ vẽ cho một số người (cột tiền, cột "Thu trong kỳ" khi chọn kỳ)
thì menu cột cũng chỉ kê đúng những cột đang thật sự có trên bảng.

**Kiểm chứng V5.9**: 20/20 danh sách render sạch, đúng bảng nguồn (Lịch sử liên hệ 550 dòng, Điểm danh 819, Bài tập 359, Tư vấn 106…); toàn app **47 trang render 0 lỗi**; Khóa học có Thêm mới/Sửa và hiện học phí dạng tiền; danh sách chỉ xem không còn dropdown đổi trạng thái; không hồi quy (KPI 36/48, CH4 94 câu, reup 33 hồ sơ).

---

# Cập nhật V6.0 — sửa lại hướng: danh sách phục vụ hành trình

**V5.9 đi sai hướng.** Em dựng 20 trang đổ thẳng bảng dữ liệu ra — đó là soi database, không phải công cụ làm việc. Tệ hơn: 9 trang tác vụ theo chặng **vốn đã có đủ chức năng** thì lại đang bị ẩn, nên các bản đổ-bảng chỉ-xem kia vừa thừa vừa yếu hơn bản gốc.

## Đã sửa
- **Bỏ 15 trang `ds*` trùng lặp.**
- **Mở lại 9 trang tác vụ theo chặng** đã có sẵn: Ghi nhận liên hệ · Test đầu vào · Tư vấn & Đăng ký · Thanh toán · Xếp lớp & Onboarding · Buổi WOW · Khảo sát & Phản hồi · Xử lý Khiếu nại · Kết thúc & Tái ĐK.
- **Menu sắp theo đúng thứ tự khách đi qua (P1→P10)**, không còn sắp theo bảng dữ liệu.

Ví dụ trang **P2 · Test đầu vào** (anh hỏi) vốn đã đủ: danh sách booking · lọc *Chờ đặt lịch / Chờ chấm / Chờ tư vấn / Quá hạn chấm* · thanh 4 bước *Đặt lịch → Dự test → Chấm điểm → Tư vấn* · nút Đã đặt lịch, Khách từ chối, Đặt lại lịch, HV đã dự test, Vắng test (form lý do + hẹn lại), Nhập kết quả, Đã tư vấn.

## 2 trang tác vụ thật sự còn thiếu — đã dựng mới

**P6 · Buổi học & nhận xét GV** (DL11, 161 buổi) — SOP bắt GV ghi nhận xét trong 48h (NA021/NA069) nhưng trước giờ không có nơi theo dõi. Lọc: *Chờ ghi nhận xét · Quá hạn ghi · GV vào trễ · Chưa dạy xong · Hủy/cần dạy bù*. Hành động: Đã dạy xong · Ghi/Sửa nhận xét · Hủy buổi · Xếp lịch dạy bù.

**Bảo lưu / Bỏ học** — chặng `paused` có hồ sơ nhưng không có trang quản lý. Lọc: *Đang bảo lưu · Đã bỏ học · Chưa hẹn liên hệ lại*. Hành động: Ghi liên hệ giữ chân (kèm hẹn gọi lại) · HV quay lại học · Chốt bỏ học.

*Khảo sát định kỳ và Nhận feedback thì **không cần trang mới** — trang "P8 · Khảo sát & Phản hồi" đã có sẵn 2 tab: Khảo sát (gửi, ghi kết quả, follow-up) và Phản hồi (phân loại, xử lý, chuyển thành khiếu nại), cộng trang "Ghi nhận phản hồi" để nhận qua gọi/nhắn.*

## Menu sau khi sắp lại
**Vận hành** — Bàn làm việc · Hành trình học viên
**Chặng · Tuyển sinh** — P1 Lead · P1 Ghi nhận liên hệ · P2 Test đầu vào · P3 Tư vấn & Đăng ký · P4 Thanh toán
**Chặng · Học tập** — P5 Xếp lớp & Onboarding · P6 Điểm danh · P6 Buổi học & nhận xét GV · P7 Bài tập · P7 Buổi WOW · Bảng lớp
**Chặng · CSKH & Kết thúc** — P8 Tạo review · P8 Khảo sát & Phản hồi · P8 Ghi nhận phản hồi · P9 Khiếu nại · P10 Kết thúc & Tái ĐK · Bảo lưu/Bỏ học
**Tra cứu** — Học viên · HV nguy cơ · Lớp học · Giảng viên · Khóa học
**Quản lý** — Tổng quan·Báo cáo & KPI · Duyệt CK & Hoàn tiền · Bàn giao lead · Cài đặt

**Kiểm chứng V6.0**: 35 trang render 0 lỗi. Buổi học lọc đúng (161 buổi: 6 quá hạn ghi nhận xét, 13 GV vào trễ, 2 hủy cần dạy bù); Bảo lưu/Bỏ học 5 HV (2 bảo lưu, 3 bỏ học). Hành động **ghi thật**: lưu nhận xét buổi → hết cảnh báo quá hạn; "HV quay lại học" → trạng thái đổi `transferred` → `active`. Vá thêm: nút **"Cột"** lâu nay mất icon (`ti-columns` chưa có trong bộ font subset) — đã dựng lại font 109 icon.

---

# Cập nhật V6.1 — bấm vào từng chặng để xem danh sách

Trang **Hành trình học viên** vốn đã là bảng theo chặng (mỗi chặng một cột, có danh sách người + nút chạy cả cột). Nhưng **dải tóm tắt 13 chặng ở trên cùng bấm vào không có tác dụng** — nó chỉ reset bộ lọc bộ phận chứ không lọc về chặng vừa bấm. Đã vá:

- Bấm một chặng trên dải → **chỉ hiện danh sách chặng đó**, ô chặng sáng lên xanh navy, có banner "Đang xem chặng X · N hồ sơ".
- Bấm lại chính nó → bỏ lọc, trở về đầy đủ. Hoặc bấm nút **"Xem tất cả chặng"**.
- Đang xem một chặng thì có luôn nút **"Chạy cả chặng này"** để dắt qua từng người.
- Thêm hàng **Nhánh rẽ** (Đã mất · Chưa gặp được · Bảo lưu/Bỏ học · ĐK đã hủy) cũng bấm xem danh sách được — trước đây chỉ hiện cột dưới cùng, không lọc được.
- Số đếm trên dải **luôn là tổng thật**, không bị co lại theo chặng đang chọn.

**Kiểm chứng V6.1**: bấm "Chờ chấm test" → 1 cột 6 hồ sơ · "Đang tư vấn" → 23 · "Đang học" → 40 · nhánh "Đã mất" → 25; bấm lại trở về 15 cột/205 hồ sơ; 35 trang render 0 lỗi.

---

# Cập nhật V6.2

## 1. "Cần xử lý" và "Tất cả" KHÔNG giống nhau — đã đổi nhãn cho rõ
Trước dùng chữ mơ hồ. Nay: **Quá hạn (111)** và **Tất cả đang chờ (221)**. Hai con số khác nhau thật — 111 là hồ sơ vi phạm SLA, 221 là mọi hồ sơ đang có việc kế tiếp.

## 2. Bộ lọc: gom 5 kiểu về 1 chuẩn
App đang có 5 kiểu nút lọc lộn xộn (chip có icon, chip trần, pill bo tròn, dropdown, nút xanh toggle). Nay tất cả dùng **một thanh công cụ chuẩn**:

`[ô tìm]  [nhóm chip segmented, mỗi mục có số đếm]  ·········  [số dòng]  [Xóa lọc]  [Cột ▾]`

Chip kiểu **segmented** (liền khối, nền xám nhạt, mục đang chọn nổi trắng lên) thay cho các viên rời rạc. Kết quả: **0 chip kiểu cũ còn sót**; 25 thanh chuẩn / 24 nhóm chip trên toàn app.

## 3. Cấu hình cột đã ghim cố định bên phải
Nút **Cột** luôn nằm cuối thanh công cụ, mọi trang danh sách, không còn trôi theo số lượng chip.

## 4. Trang tổng hợp 360 — bấm tên là ra đủ (theo SOP BC5–BC8)

**Hồ sơ Giảng viên** (bấm tên ở danh sách Giảng viên) — 4 khối: buổi đã dạy · cần viết nhận xét · bài chờ chấm · HV nguy cơ học thuật. KPI riêng **TNR / GCR7 / ADC** so ngưỡng CH6. Kèm bảng *Lớp đang phụ trách*, *Buổi cần ghi nhận xét* (ghi ngay tại chỗ), *Bài chờ chấm*.

**Hồ sơ Nhân viên** — bảng việc **đổi theo vai trò**: Tư vấn (lead mới · đang khai thác · test sắp tới · cần LH hôm nay + KPI LRT/CVR) · WOW (test chờ chấm · đã chấm · WOW sắp tới + KPI WOR) · Học vụ (onboarding · HV nguy cơ · feedback chờ phân loại · khiếu nại).

**Hồ sơ Khóa học** — lớp đã mở · đăng ký hiệu lực · doanh thu đã thu · công nợ + KPI **CR10 / AR**, kèm danh sách lớp.

*Hồ sơ Lớp đã có sẵn ở Bảng lớp / Roster.*

## 5. Dải tổng hợp cho trang tác vụ
**P2 · Test đầu vào**: chờ đặt lịch · chờ chấm (SLA 24h) · quá hạn chấm · có KQ chờ tư vấn.
**P7 · Buổi WOW**: buổi sắp tới · đã dạy · chờ ghi nội dung · tỷ lệ tiến bộ WOR so ngưỡng.

**Kiểm chứng V6.2**: 38 trang render 0 lỗi. Hồ sơ GV chạy số thật (Phan Trung Chính: 56 buổi, 2 cần nhận xét, 29 bài chờ chấm, TNR 96% · GCR7 74% · ADC 93%). Hồ sơ NV đúng vai trò cho cả 3 nhóm. Hồ sơ khóa học ra doanh thu/công nợ thật. Dải tổng hợp: Test 8/6/6/5, WOW 10/49/2/WOR 73%.

---

# Cập nhật V6.3 — sidebar gập nhóm

Sau khi mở lại 9 trang tác vụ, menu lên **28 mục / 6 nhóm**, ước cao **~1108px** — laptop 13" chỉ hiện được ~560px nên phải cuộn mới tới *Tra cứu* và *Cài đặt*. Đã sửa:

- **Bấm nhãn nhóm để gập/mở.** Mặc định chỉ mở nhóm chứa trang đang xem → còn **~248px**, không phải cuộn.
- **Vào trang nào tự mở nhóm đó**, kể cả khi trước đó đã gập tay. Mục đang xem được đánh dấu sáng.
- **Nhóm đang gập vẫn hiện chấm đỏ** nếu bên trong có việc cần xử lý — không sợ gập rồi bỏ sót: Học tập 6 (buổi quá hạn ghi nhận xét) · CSKH & Kết thúc 9 (khiếu nại đang mở) · Quản lý 5 (chiết khấu chờ duyệt).
- Nhớ trạng thái gập/mở khi chuyển trang.

**Giữ nguyên đủ 28 mục** — không gộp gượng ép, trang cần thì vẫn có mặt trên menu.

**Kiểm chứng V6.3**: mặc định 6 nhãn nhóm / 1 nhóm mở / 2 mục hiện (~248px); vào "P2 · Test đầu vào" tự mở nhóm Tuyển sinh và đánh dấu mục đang chọn; gập/mở tay chạy đúng; điều hướng qua cả 38 trang rồi render — 0 lỗi.

---

# Cập nhật V6.4 — nâng cấp 3 trang còn sơ sài, bỏ 1 trang thừa

Anh đặt đúng câu hỏi: *"trang này phục vụ hành trình hay chỉ là bảng dữ liệu?"* Em soi lại cả 28 mục bằng tiêu chí **"có ai mở trang này để duyệt cả danh sách không, hay chỉ xem theo một khách/một lớp?"**

## Bỏ khỏi menu: Ghi nhận liên hệ
Đó là bảng **550 điểm chạm của mọi khách** — không ai đọc kiểu đó. Xem lịch sử liên hệ thì mở **hồ sơ 360 của khách** (dòng thời gian đã liệt kê sẵn mọi lần liên hệ), còn ghi mới thì dùng nút **Ghi liên hệ** vốn đã có ở 4 chỗ trong luồng. Trang vẫn còn để làm form, chỉ không chiếm chỗ trên menu. Menu còn **27 mục**.

## Nâng cấp 3 trang từ "form trơ" thành hàng đợi thật

**P8 · Gửi khảo sát theo lớp** (trước: chỉ 1 ô chọn lớp + nút gửi)
→ 4 khối: lớp chưa gửi đợt nào **4** · phiếu chờ trả lời **5** · lớp trả lời dưới ngưỡng **2** · phiếu cần follow-up **3**. Bảng **theo từng lớp**: sĩ số, đã gửi, đã trả lời, tỷ lệ SRR so ngưỡng, hài lòng TB, đợt gần nhất — lớp nào chưa gửi hiện chip đỏ, gửi đợt mới ngay trên dòng.

**P8 · Tiếp nhận & xử lý phản hồi** (trước: chỉ 1 form nhập + 10 dòng gần đây)
→ 4 khối: chờ phân loại **11** · quá hạn phân loại **11** · tiêu cực chưa xử lý **6** · đã xử lý xong **9**. Hàng đợi 26 thẻ, sắp quá-hạn lên đầu, mỗi thẻ có *Tiếp nhận & phân loại · Xử lý xong · Chuyển thành khiếu nại · Hồ sơ*. Form ghi nhận chuyển sang ngăn kéo để không chiếm chỗ.

**Hồ sơ lớp** (trước: Bảng lớp chỉ có thông tin + roster)
→ thêm 5 chỉ số của riêng lớp: sĩ số **10/12** · chuyên cần ATR **83%** · nộp bài HCR **70%** · HV nguy cơ · hài lòng SS — mỗi chỉ số so ngưỡng CH6, xanh/đỏ ngay.

**Kiểm chứng V6.4**: 38 trang render 0 lỗi; menu còn 27 mục, không còn Ghi nhận liên hệ; 9 lớp có nút gửi đợt; hàng đợi phản hồi 26 thẻ với 5 bộ lọc.

---

# Cập nhật V6.5

## Nhánh rẽ trong Chạy quy trình — thiết kế lại + nói rõ chuyển trạng thái
Trước chỉ là một dòng chữ *"Nhánh rẽ: Đã mất..."*. Nay mỗi nhánh là một màn xử lý riêng gồm: **tình trạng thực tế** (đã chạm mấy lần, bao lâu rồi), **câu nhắc SOP**, và quan trọng nhất là **khối xanh "nếu đạt thì đi đâu"**:

| Nhánh | Nếu liên hệ thành công | Bấm nút là chuyển sang |
|---|---|---|
| Đã mất | khách còn quan tâm | **Đang khai thác** |
| Chưa gặp được | lần này gặp được | **Đang khai thác** |
| Bảo lưu / Bỏ học | HV đồng ý quay lại | **Đang học** |
| Đăng ký đã hủy | khách muốn học khóa khác | tạo **đăng ký mới** |

**Lỗi logic đã bắt được khi kiểm tra**: bấm "Khách quan tâm lại" mà chặng vẫn đứng ở *Đã mất*. Nguyên nhân: hồ sơ vào nhánh này vì **phiếu tư vấn bị đánh "từ chối đăng ký"**, không phải vì `lead_status`. Nay nút mở lại gỡ đúng cả 3 nguyên nhân (phiếu tư vấn dropped · lead_status đóng · chuỗi gọi hụt vượt ngưỡng) — đã test: *Đã mất → Đang tư vấn*, *Chưa gặp được → Đang khai thác*, đều có việc kế tiếp ngay.

## Tác vụ vượt quy trình
Khách hay nhảy cóc bước, nay mỗi trang có nút tạo nhanh và **tự sinh bản ghi bước trước** để không phá số liệu phễu:

- **Test đầu vào → "Khách muốn test ngay"**: khách được giới thiệu / vãng lai, nhập tên + SĐT + giờ test là hệ thống tạo luôn *lead* + *phiếu đặt test*.
- **Tư vấn → "Tư vấn không qua test"**: khách đã có chứng chỉ sẵn, tạo phiếu tư vấn thẳng.
- **Thanh toán → "Ghi nhận khoản thu"**: chọn đăng ký còn nợ, thu ngay.
- Khiếu nại và WOW vốn đã có nút tạo.

## Buổi WOW: đã có bước xác nhận lịch
Thêm ô **Chờ xác nhận lịch** + bộ lọc riêng. Xác nhận nay **ghi rõ ai xác nhận, lúc nào** (giống xác nhận đã nhận tiền của thanh toán) thay vì chỉ đổi trạng thái.

## Thông tin lớp đầy đủ ở mọi trang liên quan
Thêm thanh thông tin lớp dùng chung cho **Bảng lớp · Điểm danh · Bài tập**: tên lớp · **giảng viên (bấm mở hồ sơ GV)** · khóa · lịch học · **phòng/link** · sĩ số · khai giảng · trạng thái. Trước đây Bảng lớp chỉ hiện mã nhân viên `NV0xx` thay vì tên.

## Giao bài tập — đúng kiểu lớp cá nhân hóa
- **Chọn bài đã có** trong kho, hoặc **soạn bài mới** kèm đề bài, **tải tệp lên** hoặc dán link Drive
- **Giao cả lớp** hoặc **chọn từng em** (có đánh dấu em nào đang nguy cơ học thuật)
- **Hạn nộp chung**, hoặc bật **hạn riêng cho từng em**

## Gọn giao diện
- Bỏ tiền tố **P1/P2/P3** khỏi tên trang (vẫn giữ ở phần KPI vì đó là giai đoạn SOP)
- Đổi tên **Tư vấn & Đăng ký sau test** cho đúng thứ tự thực tế
- **Tra cứu** đưa lên ngay sau Vận hành
- **Sidebar mặc định mở hết** các nhóm
- Tài khoản hiển thị **Admin · Quản trị viên** thay vì "Tài khoản hiện tại"

## Dải tổng hợp phủ kín trang tác vụ
Theo luật đặt ra ở V6.4, thêm dải 4 số cho **Tư vấn · Thanh toán · Xếp lớp · Khiếu nại · Kết thúc khóa · Buổi học · Bảo lưu**. Số thật: Thanh toán *42 ĐK còn nợ, 6 khoản chờ xác nhận, đã thu 1,04 tỷ*; Khiếu nại *8 quá hạn xử lý*; Xếp lớp *3 quá hạn*.

**Kiểm chứng V6.5**: 38 trang render 0 lỗi · mở lại hồ sơ từ nhánh rẽ thoát đúng chặng · không KPI nào vượt 0–100% · mọi trang list có LISTCFG · mọi trang khai báo có hàm render · **không còn icon thiếu trong font** (đã vá `ti-filter`).

---

# Cập nhật V6.6 — Trang học viên (bản HV tự xem)

Đây là **góc nhìn của học viên**, khác hẳn Hồ sơ 360 của nhân viên: không có SLA, không có nhân viên phụ trách, không có việc nội bộ. Sau này tách thành cổng riêng có tài khoản đăng nhập; hiện demo trong app tại **Tra cứu → Trang học viên** (hoặc bấm nút *Trang HV* ở danh sách Học viên).

## Trang có gì

**Trung tâm đã xác nhận** — 4 thẻ tick xanh khi hoàn tất: đăng ký khóa · học phí (đã nhận bao nhiêu, còn bao nhiêu) · lớp học (bạn đã xác nhận chưa) · nhập học. Kèm bảng **từng khoản đã đóng** ghi rõ *đã xác nhận* hay *đang đối soát* — đúng cái học viên hay hỏi nhất.

**Hành trình học tập** — dải 6 bước Đăng ký → Đóng học phí → Xếp lớp → Nhập học → Đang học → Kết thúc khóa, chỉ rõ đang đứng ở đâu.

**Tiến độ của bạn** — chuyên cần % · bài tập đã nộp % · điểm bài tập TB · buổi WOW còn lại. Kèm **biểu đồ 4 kỹ năng test đầu vào**, tự đánh dấu kỹ năng yếu nhất là *cần cải thiện*.

**Sắp tới** — buổi học kế (kèm tên giảng viên + phòng/link) · buổi WOW đã đặt · bài tập sắp đến hạn.

**Khuyến nghị dành cho bạn** — sinh tự động theo dữ liệu thật, mỗi em một kiểu:
- còn nợ học phí → nhắc hoàn tất
- chưa xác nhận lớp → nhắc xác nhận giữ chỗ
- vắng không phép vượt ngưỡng → cảnh báo ảnh hưởng đầu ra
- thiếu bài vượt ngưỡng → nhắc nộp bù
- còn quota WOW → mời đặt, **gợi ý đúng kỹ năng yếu nhất**
- học thuật chậm tiến độ → báo sẽ có buổi kèm thêm
- khóa đã kết thúc → mời tái đăng ký kèm khóa gợi ý
- không có vấn đề gì → khen và nhắc giữ nhịp

**Lịch sử** — điểm danh · bài tập & điểm · khảo sát đã trả lời · phản hồi/khiếu nại đã gửi kèm kết quả xử lý.

**Kiểm chứng V6.6**: 39 trang render 0 lỗi. Thử 3 hồ sơ khác nhau đều ra đúng: HV đang học còn nợ *(2 khuyến nghị: nhắc học phí + mời dùng 8 buổi WOW)*; HV học thuật chậm *(cảnh báo tiến độ)*; HV đã kết thúc khóa *(4 khuyến nghị gồm mời tái ĐK)*.

---

# Cập nhật V6.7 — Trang học viên: nhật ký từng sự kiện

Bổ sung 3 khối chi tiết theo yêu cầu: từng buổi học kèm sự kiện của nó, dòng thời gian buổi WOW, và lịch sử tăng band.

## Lịch sử điểm & mức tăng band
Bảng so sánh **đầu vào → đầu ra** cho Overall và cả 4 kỹ năng, có cột **Tăng** (+1.0, +1.5…) và cột **Mục tiêu** tự chấm *đạt / chưa đạt*.

Ví dụ thật trong demo: *Lê Ngọc Yến — Overall 4.5 → 5.5 (+1.0), mục tiêu 5.5 **đạt***; *Hoàng Tuấn Ngân — Overall 3.5 → 5.0 (+1.5), mục tiêu 6.0 **chưa đạt**, Speaking tăng mạnh nhất +2.0*. Học viên chưa thi đầu ra thì cột đầu ra ghi *chưa có* và có dòng nhắc.

Kèm **điểm bài tập theo kỹ năng trong khóa** — so nửa đầu với nửa sau để thấy xu hướng (▲ tiến bộ / ▼ đi xuống), dùng làm tín hiệu tạm khi chưa thi đầu ra.

## Nhật ký từng buổi học
Mỗi buổi là một thẻ, gồm mọi sự kiện của buổi đó:

- **Buổi số · ngày giờ · giảng viên** (có cảnh báo nếu *GV vào trễ X phút*)
- **Điểm danh của bạn**: đúng giờ/trễ/vắng · **giờ vào lớp thực tế** · loại vắng · **thái độ trong lớp** · ghi chú
- **Nhận xét của giảng viên** cho buổi đó
- **Tài liệu buổi học** (nếu có link)
- **Bài tập giao trong buổi**: tên · kỹ năng · hạn · trạng thái nộp · điểm · **nhận xét của GV trên bài**

## Nhật ký buổi WOW 1-1
Mỗi buổi ghi rõ **đặt lúc nào → học lúc nào**, ai đặt (HV tự đặt hay NV đặt), ai kèm, kỹ năng và **nội dung tập trung**, **nội dung buổi** sau khi dạy, **kết quả sau buổi** (tiến bộ rõ / chưa cải thiện / cần thêm buổi — kèm gợi ý tương ứng), lý do vắng nếu có, và **đã trừ lượt WOW hay chưa**.

**Kiểm chứng V6.7**: 39 trang render 0 lỗi. Thẻ nhật ký hiện đúng dữ liệu thật — ví dụ *Buổi 18 · 18/07 · GV Phạm Tấn Phát · Trễ, vào lúc 19:10, thái độ Bình thường · nhận xét "Speaking part 2 theo cặp" · bài tập kèm điểm và nhận xét GV*.

---

# Cập nhật V6.8

## Hộp "Yêu cầu & phê duyệt" trên Trang học viên
Trước chưa có. Nay hiện mọi thứ học viên đang chờ trung tâm duyệt hoặc đã được duyệt, kèm nhãn *đang chờ / đã duyệt*:

- **Ưu đãi học phí** — số tiền, lý do, đã duyệt ngày nào (demo có 5 đăng ký đang chờ duyệt)
- **Hoàn tiền** khi đăng ký bị hủy — số tiền đã đóng, lý do hủy, đang xử lý theo chính sách
- **Cấp thêm / mua thêm buổi WOW** ngoài quota
- **Đổi lớp** — số lần đã đổi, ghi chú

Tiêu đề khối hiện luôn số đang chờ, ví dụ *Yêu cầu & phê duyệt · 1 đang chờ*.

## "Hành trình học tập" → "Hành trình cùng IELTS The Tutors", có mốc thời gian
Anh nói đúng — trong đó có cả đóng tiền, xếp lớp thì gọi "học tập" là sai. Nay đổi tên và dựng thành **dòng thời gian đầy đủ 13 mốc**, mỗi mốc kèm **ngày giờ thật**:

Biết đến ITTs (kèm nguồn) → Làm test đầu vào (kèm Overall) → Được tư vấn lộ trình (kèm khóa đề xuất) → Đăng ký (kèm học phí) → Đóng học phí lần đầu → Hoàn tất học phí → Được xếp lớp → Nhận thông tin lớp → Xác nhận lớp → Hoàn tất nhập học → Buổi học đầu tiên → Kết thúc khóa (kèm đầu ra / mục tiêu) → Tái ghi danh

Mốc chưa xảy ra hiện mờ kèm chữ *chưa có*. Cuối khối ghi *Bạn đang ở: [chặng]* và **số ngày đồng hành cùng trung tâm**.

**Sắp theo thời gian thật**: dữ liệu vận hành đôi khi lệch thứ tự lý thuyết (có HV học bù lớp cũ trước khi hoàn tất nhập học lớp mới), nên dòng thời gian sắp theo mốc thật chứ không theo thứ tự cứng — luôn đọc xuôi.

**Kiểm chứng V6.8**: 39 trang render 0 lỗi; HV có chiết khấu chưa duyệt hiện đúng hộp chờ duyệt; dòng thời gian ra đủ 11–13 mốc kèm ngày giờ và đã sắp đúng trình tự.

---

# Cập nhật V6.9 — Trang học viên: 5 chỉnh theo góp ý

## 1. Học phí: đã đóng và còn lại đặt cạnh nhau
Gom thành một khối 4 ô liền nhau — **Học phí · Ưu đãi · Đã đóng · Còn phải đóng** (ô cuối làm nổi), kèm **thanh tiến độ % đã đóng**, rồi mới tới bảng từng lần đóng. Không phải nhìn hai chỗ nữa.

## 2. Link "Xem bài đã nộp"
Bài nào đã nộp thì trong nhật ký buổi học có link mở ra: kỹ năng, hạn, đã nộp lúc nào, nộp trễ hay không, điểm, nhận xét GV. Bản demo ghi rõ *chưa nối kho tệp — khi chạy thật sẽ mở đúng file bài làm trên Drive/LMS*.

## 3. "Sắp tới" phân nhóm, hiện cả khi trống
Luôn hiện đủ **4 nhóm** kèm số lượng, để học viên biết mục này có những gì: **Buổi học · Buổi WOW 1-1 · Bài tập đến hạn · Khảo sát chờ trả lời**. Nhóm trống có câu gợi ý riêng, ví dụ WOW trống thì nhắc *"Chưa đặt buổi nào — bạn còn 4 lượt, liên hệ trung tâm để đặt"*.

## 4. Hành trình điểm số gom về một bảng
Đổi tên thành **"Hành trình điểm số · từ đầu vào đến đầu ra"**, một bảng duy nhất có đủ mốc: **Đầu vào → Giữa khóa → Đầu ra**, kèm cột **Tăng** và **Mục tiêu (đạt/chưa đạt)**, cho cả Overall lẫn 4 kỹ năng.

Cột *Giữa khóa* hiện *chưa chấm* — hệ thống hiện **chưa có nguồn dữ liệu bài kiểm tra giữa khóa** (DL13 chỉ có `score_type = band`). Em để sẵn cột, khi trung tâm bắt đầu chấm giữa khóa là số tự vào đúng chỗ.

## 5. Học viên nhiều khóa
Trước bố cục chỉ lấy khóa đầu tiên. Nay HV học nhiều khóa sẽ có **bộ chọn khóa** ở đầu trang; mọi mục theo lớp (xác nhận, học phí, tiến độ, nhật ký buổi học, bài tập) **lọc theo khóa đang chọn**, còn mục theo con người (hành trình điểm, WOW, phê duyệt) vẫn tính trọn.

Demo có 2 HV học 2 khóa — ví dụ *Lê Ngọc Yến*: khóa IELTS 7.0+ chuyên cần 75%, khóa IELTS 6.5 chuyên cần 92%, số liệu tách bạch.

**Kiểm chứng V6.9**: 39 trang render 0 lỗi; khối học phí ra đúng *12.500.000đ − ưu đãi 1.500.000đ − đã đóng 0đ − còn 12.500.000đ*; 4 nhóm Sắp tới hiện cả khi trống; bảng điểm đủ 6 cột; đổi khóa thì số liệu đổi theo.

---

# Cập nhật V7.0 — Tách cổng học viên ra file riêng

Trang học viên nay là **file HTML độc lập**: `ITTs_TrangHocVien_demo.html` — mở thẳng, không cần app quản trị.

## Sidebar là mục lục, bấm là trượt tới
Khác sidebar của app nhân viên (điều hướng giữa các trang), sidebar ở đây là **mục lục trong một trang**:

- Bấm một mục → **cuộn mượt** tới đúng phần đó
- Cuộn tay tới đâu → mục tương ứng **tự sáng lên**
- **Tự ẩn mục không có dữ liệu**: HV chưa có ưu đãi thì không hiện *Yêu cầu & phê duyệt*; chưa thi thì không hiện *Hành trình điểm số*. Kiểm chứng: HV thường 9 mục, HV có ưu đãi + điểm đầu ra 10 mục.
- Trên điện thoại sidebar thu vào, có nút mở mục lục

Đầu sidebar có avatar + tên + mã HV, và ô **chọn hồ sơ để xem thử** (chỉ dành cho demo — bản thật lấy theo tài khoản đăng nhập).

## Cách sinh file
`gen_v5.py` giờ xuất **2 file từ cùng một bộ mã**: phần `<head>`/CSS và toàn bộ JS dùng chung, chỉ khác lớp vỏ `<body>` và hàm khởi động (`enter("all")` cho app nhân viên, `bootHV()` cho cổng học viên). Sửa logic một lần là cả hai file cùng đổi, không sợ lệch.

**Kiểm chứng V7.0**: cả 2 file `node --check` sạch; cổng HV khởi động ra thân trang ~21.000 ký tự; mục lục sinh đúng theo dữ liệu từng HV và mọi mục đều trỏ tới neo có thật; bấm mục → cuộn tới đúng vị trí; HV nhiều khóa vẫn có bộ chọn khóa.

---

# Cập nhật V7.1

Bỏ dải thông báo *"Đây là bản xem của học viên — sau này là cổng riêng…"* cùng ô chọn HV kèm theo, vì cổng riêng đã có ô chọn hồ sơ ở sidebar. Trang giờ mở ra là vào thẳng lời chào.

Ô chọn hồ sơ vẫn giữ **một bản gọn** khi xem trang này *bên trong app nhân viên* (Tra cứu → Trang học viên), vì ở đó không có sidebar của cổng HV. Phân biệt bằng cờ `HVPORTAL` do `bootHV()` đặt — cùng một hàm dựng trang, hai ngữ cảnh hiển thị khác nhau.

---

# Cập nhật V7.2

## Bỏ trang học viên khỏi app nhân viên
Trang học viên đã có file riêng nên gỡ hẳn khỏi app: mất khỏi menu Tra cứu, mất nút *Trang HV* ở danh sách Học viên, mất khỏi bảng điều hướng. Hàm dựng trang vẫn giữ nguyên vì cổng riêng dùng chung.

Menu Tra cứu còn: Học viên · Học viên nguy cơ · Lớp học · Giảng viên · Khóa học.

## Bổ sung 2 mục còn thiếu trên trang học viên

**Khảo sát của bạn** — tách 2 nhóm rõ ràng:

- *Phiếu mới gửi, chờ bạn trả lời* → nút **Trả lời ngay**, mở phiếu gồm mức hài lòng 1–5, mức sẵn sàng giới thiệu 0–10, cảm nhận tiến bộ, điều thấy tốt, điều chưa hài lòng, đề xuất.
- *Phiếu bạn đã trả lời* → nút **Xem lại**, hiện đúng những gì học viên đã trả lời trước đó.

Điểm hài lòng thấp (≤3) hoặc có góp ý tiêu cực thì phiếu **tự đánh dấu cần trung tâm theo dõi**, và học viên nhận thông báo *"Trung tâm sẽ liên hệ bạn để xử lý"* thay vì lời cảm ơn chung chung.

**Góp ý cho trung tâm** — nút **Gửi góp ý** mở form: nhóm nội dung (giảng dạy / giáo trình / lịch học / cơ sở vật chất / thái độ phục vụ), sắc thái, chấm điểm, nội dung. Bên dưới liệt kê **góp ý đã gửi** kèm trạng thái xử lý, và **phiếu xử lý dành cho bạn** kèm phản hồi của trung tâm.

Sidebar mục lục thêm 2 mục tương ứng, thành 11 mục.

**Kiểm chứng V7.2**: app nhân viên 38 trang render 0 lỗi, không còn dấu vết trang học viên. Cổng HV: trả lời khảo sát ghi thật (hài lòng 2/5 → tự bật cờ cần theo dõi), xem lại phiếu cũ hiện đúng câu trả lời, gửi góp ý tạo bản ghi mới (26→27) và trang tự vẽ lại — phiếu vừa trả lời chuyển sang nhóm *đã trả lời* ngay.

**Vá kèm**: bỏ trang khỏi bảng điều hướng khiến `reRender('tranghv')` mất đích. Đã đổi các nút trong trang gọi thẳng hàm vẽ lại của cổng, và cho `reRender` tự lui về cổng HV khi thiếu đích — không còn phụ thuộc vào việc dò phần tử DOM.

---

# Cập nhật V7.3 — 3 hồ sơ Demo 1 / Demo 2 / Demo 3

Mở cổng học viên là vào thẳng **Demo 1**, ô chọn hồ sơ xếp **Demo 1 → Demo 2 → Demo 3** lên đầu. Trong app nhân viên, 3 hồ sơ này cũng đứng đầu danh sách Học viên.

## Cả 3 đều sáng đủ 12/12 mục, nhưng khác nhau để demo được nhiều tình huống

| | Demo 1 | Demo 2 | Demo 3 |
|---|---|---|---|
| Trạng thái | Đang học | Hoàn thành khóa | Đang học |
| Số khóa | **2 khóa** (có bộ chọn khóa) | 1 | 1 |
| Band | 3.5 → **5.0** (mục tiêu 6.0, chưa đạt) | 5.0 → **6.5** (vượt mục tiêu 6.0) | 5.0 → chưa thi đầu ra |
| Học phí | đã đóng đủ | **còn nợ 19tr** | **còn nợ 8tr** |
| Ưu đãi | 1,5tr **chờ duyệt** | 1tr **chờ duyệt** | 2tr **chờ duyệt** |
| Buổi WOW | 1 | 3 (có buổi *tiến bộ rõ*, buổi *cần thêm*, buổi *sắp tới*) | **10 buổi** |
| Khảo sát | 1 mới + 1 đã trả lời | 1 mới + 1 đã trả lời | 1 mới + 3 đã trả lời |
| Khiếu nại | – | – | **có 1** |
| Khuyến nghị sinh ra | 2 | **4** | 2 |
| Thẻ nhật ký | 13 | 15 | **22** |

Gợi ý khi trình bày: **Demo 1** để kể hành trình 2 khóa + bảng tăng band chưa đạt mục tiêu; **Demo 2** để khoe khuyến nghị dày và WOW có đủ 3 trạng thái kết quả; **Demo 3** để khoe nhật ký dày và nhánh khiếu nại.

## Cách dựng
Script `mkdemo.py` không tạo học viên mới từ đầu (sẽ phải sinh lại toàn bộ điểm danh, bài tập, buổi học và rất dễ đứt liên kết). Thay vào đó lấy 3 hồ sơ giàu dữ liệu nhất, đổi tên và **vá đúng phần còn thiếu** của từng người, rồi đẩy lên đầu bảng học viên.

Đổi tên có cập nhật **mọi cột tên đã sao chép sang bảng khác** (điểm danh, bài tập, WOW, khảo sát, đăng ký, thanh toán, xếp lớp, phản hồi, khiếu nại, kết thúc khóa, và cả lead gốc) — nếu chỉ sửa mỗi bảng Học viên thì các trang khác vẫn hiện tên cũ.

**Thứ tự chạy khi sinh lại demo**: `gen_demo.py` → `mkdemo.py` → `gen_v5.py`.

**Kiểm chứng V7.3**: cả 3 hồ sơ đủ 12/12 mục trên cổng học viên; app nhân viên 38 trang render 0 lỗi, danh sách Học viên đứng đầu là Demo 1/2/3, hồ sơ 360 và các trang tác vụ đều hiện đúng tên mới.

---

# Cập nhật V7.4 — vá tính hợp lý của 3 hồ sơ Demo

Rà lại 3 hồ sơ demo thì phát hiện **8 điểm phi lý** — một phần do thao tác vá dữ liệu, một phần vốn có sẵn trong bộ demo gốc. Đã sửa hết, giờ chạy kiểm tự động ra **0 điểm sai**.

## Do vá dữ liệu gây ra

**Demo 1 — ưu đãi đặt nhầm chỗ.** Gắn ưu đãi 1,5tr vào khóa **đã đóng đủ 20tr** → thành đóng thừa, mà cột "còn lại" vẫn hiện 0 nên nhìn không ra. Đã chuyển ưu đãi sang **khóa 7.0 vừa đăng ký 03/07**, đúng nghĩa "ưu đãi học viên học tiếp khóa sau": 24tr − 1,5tr = 22,5tr, đã cọc 10tr, còn 12,5tr.

**Demo 3 — test đầu vào có trước cả khi khách vào hệ thống.** Test ghi 24/03 trong khi lead vào 07/05. Đã dời test về 09/05 (sau khi có lead, trước khi đăng ký 15/05).

## Vốn có sẵn trong dữ liệu demo

**Học xong khóa mà chưa đóng đồng nào** (Demo 2): hoàn thành khóa, `paid = 0`, không có khoản thu nào, nợ nguyên 19tr. Đã tạo 2 khoản thu thật (cọc 5tr + đợt 2 10tr) → đã đóng 15tr, còn nợ đuôi 4tr.

**Buổi học đầu diễn ra trước ngày xếp lớp** (Demo 1 và 2): xếp lớp ghi 19/06 trong khi lớp khai giảng 02/04 và học viên đã đi học từ 06/05. Đã dời mốc xếp lớp / gửi thông tin / xác nhận / hoàn tất nhập học về trước ngày khai giảng.

**Lớp gắn nhầm đăng ký** (Demo 1): lớp IELTS 7.0 lại trỏ về phiếu đăng ký khóa 6.5. Đã gắn đúng về phiếu đăng ký khóa 7.0.

**Buổi WOW chưa dạy mà đã trừ lượt**: theo SOP chỉ trừ khi *đã dạy xong* hoặc *học viên vắng*. Đã tính lại quota cho cả 3 hồ sơ.

## Một điểm KHÔNG phải lỗi
Demo 1 để trạng thái *"Đang học"* dù đã có kết quả kết thúc khóa — **đúng**, vì em ấy học 2 khóa: xong khóa 6.5 ngày 01/07 và đang học khóa 7.0 khai giảng 09/06. Kịch bản kiểm ban đầu báo nhầm do chưa xét học viên nhiều khóa; đã sửa lại điều kiện: chỉ sai khi **mọi** khóa đều đã kết thúc.

## Kiểm tự động
Script kiểm 8 nhóm quy tắc: `final_fee = học phí − ưu đãi` · `còn lại = final − đã đóng` · `đã đóng = tổng khoản thu thực tế` · không đóng thừa · trạng thái khớp tiến độ khóa · mốc thời gian đúng trình tự (lead → test → đăng ký → xếp lớp → buổi đầu → kết thúc) · lớp khớp đăng ký · quota WOW khớp số buổi đã trừ.

**Kiểm chứng V7.4**: cả 3 hồ sơ **HỢP LÝ, 0 điểm sai**; đủ 12/12 mục; dòng thời gian sắp xuôi; mở cổng vào thẳng Demo 1; app nhân viên 38 trang render 0 lỗi, KPI không chỉ số nào lọt ngoài 0–100%.

---

# Cập nhật V7.5 — khối "Khóa của bạn" làm lại cho nổi

Trước đây chỗ chọn khóa dùng chung kiểu **chip lọc của app nhân viên** — nhìn như một bộ lọc phụ, trong khi thực chất nó **đổi ngữ cảnh của cả trang** (học phí, tiến độ, nhật ký buổi học đều đổi theo). Nên nó chìm là phải.

Nay đổi thành **thẻ khóa học**, mỗi khóa một thẻ có:

- Biểu tượng riêng: đang học dùng biểu tượng lớp, đã xong dùng biểu tượng huy chương
- **Tên lớp** + khóa + lịch học
- Nhãn trạng thái *Đang học / Đã hoàn thành* + khoảng thời gian khai giảng → kết thúc
- Dòng tóm tắt: **điểm đầu ra** (nếu đã thi) · **chuyên cần** · **học phí còn nợ** (đỏ) hoặc *đã đóng đủ* (xanh)

Thẻ đang xem được làm nổi hẳn: viền xanh navy, nền chuyển sắc nhẹ, có **thanh màu dọc bên trái**, biểu tượng đảo màu và dấu tích. Thẻ còn lại nhấc nhẹ lên khi rê chuột.

Khối chỉ hiện khi học viên **học từ 2 khóa trở lên** — ai một khóa thì không thấy, đỡ thừa.

**Kiểm chứng V7.5**: Demo 1 (2 khóa) ra đúng 2 thẻ, 1 thẻ đang chọn — *IELTS 7.0+ · Đang học · 09/06→01/09 · chuyên cần 100% · còn 12.500.000đ* và *IELTS 6.5 · Đã hoàn thành · đầu ra 5.0 · đã đóng đủ*; bấm sang thẻ kia thì học phí và toàn bộ mục theo lớp đổi theo. Demo 2 (1 khóa) không hiện khối này.

---

# Cập nhật V7.6 — Kho bài tập & Giáo án khóa

Yêu cầu "chọn bài tập cho từng buổi, ghi chú dặn dò trước cho từng buổi, gán mặc định theo khóa" phát sinh **2 bảng dữ liệu mới**:

- **Kho bài tập** (16 bài mẫu) — bài dùng lại được: tên, kỹ năng, độ khó, mô tả/yêu cầu, thời lượng, tệp đề bài.
- **Giáo án khóa** (16 khóa × 30 buổi = 480 dòng) — mỗi **khóa học** quy định sẵn từng buổi: **chủ đề · bài tập mặc định · lời dặn dò trước buổi**.

## Nguyên tắc: khóa quy định, giáo viên đổi riêng được
Mọi **lớp thuộc khóa** tự áp dụng giáo án của khóa đó. Giáo viên muốn khác cho lớp mình thì ghi đè ở từng buổi — hệ thống đánh dấu rõ **"theo giáo án khóa"** hay **"giáo viên đổi riêng"**, và có nút **trả về mặc định khóa**.

## Trang mới: Kho bài tập & Giáo án
Hai tab:

- **Giáo án theo khóa** — chọn khóa, thấy bảng từng buổi (chủ đề · bài mặc định · lời dặn), sửa buổi nào là **mọi lớp thuộc khóa** đổi theo.
- **Kho bài tập** — tìm kiếm, thêm/sửa bài, tải tệp hoặc dán link, thấy luôn **mỗi bài đang được dùng ở bao nhiêu buổi**.

## Bảng lớp: cấu hình từng buổi
Bảng lịch buổi giờ có thêm cột **Bài tập về nhà** và **Lời dặn trước buổi**, kèm nhãn nguồn. Nút **Cấu hình** mở drawer cho phép:

- Bài tập: **chọn bài trong kho** hoặc **tạo bài mới / tải tệp lên** (bài mới tự lưu vào kho để lớp khác dùng lại)
- Lời dặn: dùng mặc định của khóa hoặc sửa riêng
- **Giao bài này cho lớp** — tạo bài tập cho toàn bộ học viên, hạn nộp mặc định 7 ngày sau buổi

## Trang học viên: thấy lời dặn trước khi đến lớp
Mục **Sắp tới** giờ mỗi buổi hiện thêm **chủ đề buổi**, khung vàng **"Giáo viên dặn: …"** và khung xanh **"Bài sẽ giao sau buổi: …"** kèm yêu cầu và thời lượng — học viên biết trước phải chuẩn bị gì.

## Vá hồ sơ 360
- **Gửi review**: drawer nay có **bộ câu mẫu theo từng đợt** (Tuần 1 / Tuần 4 / Tuần 8 / Cuối khóa / Đột xuất) — chọn đợt là câu hỏi tự điền, sửa lại được, và bộ câu được lưu kèm phiếu để học viên xem lại.
- **Ghi phản hồi**: trước đây nhảy sang trang khác, mất ngữ cảnh hồ sơ đang xem — nay mở **drawer** ngay tại chỗ.

**Kiểm chứng V7.6**: 39 trang render 0 lỗi. Giáo án IELTS 6.5 ra đủ 30 buổi. Bảng lớp LOP-IELTS-6.5-03 hiện đúng: buổi 1 *"Writing Task 2 — giáo viên đổi riêng"*, buổi 2 *"Matching headings — theo giáo án khóa"*. Trang học viên Demo 1 thấy buổi 20 và 21 kèm lời dặn và bài sẽ giao.

**Thứ tự chạy khi sinh lại dữ liệu**: `gen_demo.py` → `seed_giaoan.py` → `mkdemo.py` → `gen_v5.py`.

---

# Cập nhật V7.7 — phân biệt rạch ròi "nộp trễ" và "chưa nộp"

**Nộp trễ = ĐÃ NỘP, chỉ quá hạn** — vẫn có bài để xem, vẫn chấm điểm được. Khác hẳn *chưa nộp* (không có bài) và *đã giao* (chưa tới lượt nộp). Dữ liệu vốn đã đúng (43 bài nộp trễ đều có thời điểm nộp và điểm), nhưng app hiển thị chưa nói rõ nên dễ đọc nhầm.

## Nhãn nói thẳng, không bắt người đọc suy diễn

| Trước | Nay |
|---|---|
| Nộp trễ | **Đã nộp · trễ 2 ngày** |
| Nộp đúng/trước hạn | **Đã nộp đúng hạn** |
| Không nộp | **Chưa nộp** |
| Đã giao | **Đã giao · chờ nộp** |

Bài đã nộp — **kể cả nộp trễ** — luôn kèm **thời điểm nộp** và **link "Xem bài đã nộp"**; chưa chấm thì ghi *chờ chấm* thay vì để trống.

## Sửa đồng loạt, không riêng nhật ký buổi học
Gom về **một bộ hàm chuẩn** (`hwSubmitted` · `hwLate` · `hwMissing` · `hwWaiting` · `hwLateDays` · `hwChip`) rồi áp cho toàn bộ: nhật ký buổi học · drawer xem bài (thêm dòng *Trễ hạn: N ngày*) · trang Bài tập tab Thu bài và Chấm bài (nút đổi thành **Nộp đúng hạn / Nộp trễ / Không nộp**, có chú thích khi rê chuột) · bảng bài tập ở hồ sơ 360 · hồ sơ Giảng viên · tiến độ và khuyến nghị trên trang học viên · việc chấm bài quá hạn.

## Lỗi âm thầm phát hiện kèm
Nhiều chỗ đang kiểm trạng thái bằng mã **không có thật trong danh mục**: `"submitted"` (danh mục chỉ có `submitted_on_time` / `submitted_late`) và `"graded"` (không phải trạng thái — chấm bài nhận biết qua điểm/thời điểm chấm). Các điều kiện đó **luôn sai**, app chạy đúng chỉ nhờ điều kiện dự phòng phía sau. Đã thay hết bằng bộ hàm chuẩn.

**Kiểm chứng V7.7**: 39 trang render 0 lỗi. Nhật ký hiện đúng 4 trạng thái, bài *"trễ 2 ngày"* có đủ thời điểm nộp + link xem bài, bài *"Chưa nộp"* không có link. KPI vẫn tách bạch: **HCR 70%** (đã nộp, tính cả trễ) · **OTR7 83%** (nộp đúng hạn) · **GCR7 75%** (đã chấm).

---

# Cập nhật V7.8 — sửa bố cục Bảng lớp + hạn nộp bài theo giáo án

## 1. Lỗi bố cục Bảng lớp
Bảng **Lịch buổi** đang bị render *bên trong* lưới thẻ `.bcards` — lưới này chia cột tối thiểu 240px nên bảng 7 cột bị bóp lại, chữ xuống dòng loạn. Đây là di chứng của lần dời thông tin lớp lên thanh `classBar`: thẻ "Thông tin lớp" ở lại nhưng thẻ đóng của lưới thì nằm mãi dưới danh sách học viên.

Đã bỏ hẳn lưới thẻ và thẻ "Thông tin lớp" (trùng lặp hoàn toàn với thanh thông tin phía trên). Ba mục còn thiếu — **Kết thúc · Hình thức · Cơ sở** — được dồn vào `classBar`, nên mọi trang dùng thanh này (Bảng lớp, Điểm danh, Bài tập, hồ sơ Lớp) đều được hưởng. Panel Lịch buổi và Học viên trong lớp nay chiếm trọn chiều ngang.

## 2. Hạn nộp bài: đặt sẵn theo khóa, sửa được ở ba nơi
Trước đây hạn nộp bị **cắm cứng 7 ngày** trong mã nguồn khi giao bài từ Bảng lớp, còn trang Giao bài thì để trống bắt giáo viên tự nhập.

Nay hạn nộp đi theo đúng mô hình hai tầng như bài tập và lời dặn:

| Tầng | Nơi đặt | Ai sửa | Phạm vi |
|---|---|---|---|
| Mặc định khóa | Giáo án khóa (DL21 `due_days`) | Học vụ | Mọi lớp thuộc khóa |
| Ghi đè lớp | Bảng lớp → Cấu hình buổi (DL11 `hw_due_days`) | Giáo viên | Riêng lớp đó |
| Lúc giao | Ô hạn nộp trên drawer giao bài / trang Bài tập | Giáo viên | Riêng lần giao đó |

Hạn tính bằng **số ngày sau buổi học**, không phải ngày cố định — buổi dời lịch thì hạn tự dời theo. Không đặt gì thì rơi về mặc định hệ thống 5 ngày. Seed đặt hạn dài ngắn theo kỹ năng: Writing Task 2 sáu ngày, Task 1 năm ngày, Speaking bốn, Listening/Reading ba, Grammar hai.

**Sửa hàng loạt** (đúng yêu cầu "sửa toàn bộ các buổi trước"):

- Giáo án khóa có nút **"Đặt hạn nộp cho tất cả buổi"** — chọn số ngày, chọn *tất cả các buổi* hoặc *chỉ buổi chưa đặt hạn*, áp một lần cho cả 30 buổi.
- Trong drawer sửa từng buổi của giáo án có thêm ô tích **"Áp dụng hạn nộp này cho tất cả các buổi của khóa"**.
- Bên phía lớp, drawer Cấu hình buổi cũng có ô tích **"Áp dụng hạn này cho tất cả buổi của lớp"**.

Quy tắc giữ nguyên như bài tập và lời dặn: chọn trùng đúng giá trị mặc định của khóa thì hệ thống **lưu rỗng** thay vì lưu số — để sau này học vụ đổi giáo án, buổi đó vẫn đổi theo. Chỉ khi giáo viên cố ý chọn khác mới ghi đè, và nút "Trả về mặc định khóa" gỡ cả ba thứ (bài, lời dặn, hạn).

## 3. Trang Giao bài nối vào buổi học thật
Ô chọn buổi trước đây là danh sách giả *Buổi 1…12* sinh bằng vòng lặp, không khớp lịch thật. Nay lấy từ lịch buổi của lớp, mỗi dòng hiện **ngày học và tên bài theo giáo án**. Chọn buổi xong, form tự điền sẵn **bài tập · kỹ năng · hạn nộp** theo giáo án, kèm một dòng nhắc "đã điền sẵn, sửa được trước khi giao". Ô hạn riêng của từng em cũng lấy hạn chung làm giá trị khởi điểm. Bản ghi bài tập nay lưu kèm `session_id` nên nhật ký buổi học của học viên khớp đúng bài của buổi đó.

Danh sách bài để chọn trước đây chỉ gồm bài **đã từng giao**; nay gộp cả **kho bài tập** — bài mới thêm vào kho dùng được ngay.

## 4. Bảng lớp hiện hạn nộp
Bảng Lịch buổi có thêm cột **Hạn nộp**: hiện *+N ngày*, ngày hạn cụ thể, và nhãn nguồn (*theo giáo án khóa* / *giáo viên đổi riêng* / *mặc định hệ thống*) — nhìn là biết ngay buổi nào đã bị đổi.

**Kiểm chứng V7.8**: cả 2 file cú pháp sạch. Bảng lớp cân bằng thẻ 54/54, bảng lịch buổi 8 cột khớp toàn bộ dòng, không còn `.bcards`. Giáo án khóa 6 cột khớp. Kế thừa kiểm bằng lớp LOP-FOUND-PLA-01: đổi giáo án khóa sang 11 ngày thì 8 buổi không ghi đè đổi theo, 2 buổi giáo viên đặt riêng (7 ngày và 2 ngày) giữ nguyên. Bulk theo khóa áp đúng 30/30 buổi. Bộ icon dựng lại 112 ký tự (thêm `calendar-cog`, `flag-check`, `device-laptop`, `building`).

---

# Cập nhật V7.9 — hai cách giao bài

Trang Giao bài trước đây có ba lựa chọn *cả lớp · chọn từng em · mỗi em một bài* — nhưng hai cái đầu chỉ khác nhau ở chỗ chọn ai, cùng giao một bài, nên gộp làm một. Nay còn hai cách giao:

## Một bài chung
Một bài, một hạn nộp, giao cho các em **được tick** trong danh sách. Mặc định tick sẵn cả lớp — bỏ tick em nào thì em đó không nhận bài lần này, kèm nút *Chọn tất cả / Bỏ chọn*. Vẫn giữ ô *"Đặt hạn nộp riêng cho từng em"* khi cần vài em được gia hạn.

## Giao bài tập riêng
Mỗi em một dòng, trên dòng đó chọn **bài trong kho bài tập** hoặc **tải đề riêng** lên cho em đó, và đặt **hạn nộp riêng**. Để trống cả hai thì em đó không nhận bài. Chọn cả hai cũng được — bài trong kho làm nội dung chính, tệp tải lên thành đề bổ sung ghi kèm trong ghi chú. Khi bấm chế độ này, khối chọn bài chung phía trên tự ẩn đi cho gọn.

Mỗi em còn hiện chip *"yếu Speaking · 5.5"* — kỹ năng có điểm bài tập trung bình thấp nhất — để giáo viên biết nên chọn bài gì, nhưng việc chọn vẫn là của giáo viên, hệ thống không tự điền.

**Kiểm chứng V7.9**: lớp 10 học viên — chế độ chung bỏ tick 2 em thì tạo đúng 8 bản ghi, bỏ tick hết thì chặn lại không sinh bản ghi rác. Chế độ riêng: 4 em có bài (2 em chọn từ kho, 1 em chỉ tải đề, 1 em vừa chọn vừa tải) tạo đúng 4 bản ghi với 4 bài khác nhau, em chỉ tải đề lấy tên tệp làm tên bài và ghi chú giữ nguyên tên tệp gốc. 31 trang render 0 lỗi.

---

# Cập nhật V8 — audit toàn diện + sửa theo 3 đợt

Quét máy 31 trang + 70 hàm hành động + 21 bảng dữ liệu (3.442 dòng), rồi sửa theo ưu tiên. Chi tiết đầy đủ ở **BAO_CAO_AUDIT_V8.md**; đây là phần đã làm.

## Đợt 1 — sửa lỗi

**Dữ liệu demo** (`fixdata.py`, chạy sau `mkdemo.py`):

- **SLA phản hồi lead**: trước đây 194/194 lead đều trễ (trung vị 5,3 ngày) làm app đỏ toàn tập. Phân bố lại 70% đạt SLA / 20% trễ nhẹ / 10% trễ hẳn → còn ~32% quá hạn, đủ để có việc mà không như vỡ trận.
- **Quota WOW**: gỡ trừ quota cho các buổi tương lai (chỉ trừ khi đã dạy / vắng), tính lại số buổi đã dùng.
- **Chiết khấu**: duyệt 5 hồ sơ, chừa 2 hồ sơ chờ duyệt để trang Duyệt còn việc.
- **Xếp lớp sau khai giảng**: kéo 14 hồ sơ onboarding về trước ngày khai giảng.
- **Lớp vượt sức chứa**: dời học viên thừa sang lớp cùng khóa.
- **Hoàn tiền**: tạo phiếu hoàn cho 3 đăng ký đã hủy, đưa công nợ về 0.
- **Điểm danh trống**: bù bản ghi cho các buổi đã dạy mà bỏ trống (chừa 8 buổi làm hàng chờ).
- **HV nguy cơ hồi phục**: đưa 6 HV từ diện nguy cơ trở lại đúng tiến độ, có ghi chú can thiệp.

**Bộ kiểm tự động** (`check_data.py`): 12 nhóm quy tắc, **có chốt chặn tên cột** — quy tắc nào dò sai/thiếu tên cột thì hô "QUY TẮC BỊ VÔ HIỆU" thay vì im lặng pass (bài học đắt nhất của đợt audit). Chạy sau mỗi lần sinh dữ liệu, thoát mã lỗi nếu còn lỗi nặng.

**App**: thêm `enum_cancellation_reason` (trước đây thiếu nên hiện mã thô); 3 trang hồ sơ 360 (GV/NV/Khóa học) khi mở mà chưa chọn ai nay hiện **bộ chọn có ô tìm** thay vì màn hình cụt.

## Đợt 2 — bù độ phủ

- **12 KPI còn thiếu của CH6** đã cài đủ (ANR, CVT, OBT, RCR, FUR, ADC, SPR, FTR, SLA_R, RTR, TCR, WRR) — nay **48/48** chỉ số tính được, số liệu pha trộn đạt/chưa đạt như trung tâm thật.
- **Thông điệp CH4 sống**: cột "Việc cần làm" trước đây là chữ tĩnh nằm sẵn trong dữ liệu (sửa trạng thái thì không đổi). Nay tra thẳng CH4 theo trạng thái thật của từng bản ghi qua `naFor()` — **51 mẫu** dùng động (trước 19), điền cả số SLA thật từ CH2, rê chuột thấy mã mẫu. Áp cho 11 bảng nghiệp vụ + hàng đợi việc ở Bàn làm việc.

## Đợt 3 — nâng cấp

- **Chặn sai ngay lúc nhập** (`bizGuard`): xếp lớp vượt sức chứa, chiết khấu đạt/vượt ngưỡng mà chưa duyệt, mốc thời gian ngược, điểm tổng lệch trung bình 4 kỹ năng — chặn tại chỗ thay vì phát hiện sau. Cắm vào form chuẩn + xếp lớp mới + đổi lớp.
- **Trang Sức khỏe dữ liệu** (Cài đặt → tab mới): chạy 9 nhóm quy tắc ngay trên dữ liệu đang mở, chia 3 mức (Nghiêm trọng / Cần sửa / Hàng chờ), mỗi dòng có nút **"Tới sửa"** nhảy thẳng tới nơi khắc phục. Số badge hiện ngay trên tab.
- **Trợ năng**: 60 nút "Chạy" ở Bàn làm việc/Chạy quy trình trước đây chạy nhờ sự kiện lan từ hàng cha (bàn phím + trình đọc màn hình không dùng được) — nay có `onclick` + `aria-label` riêng, `stopPropagation` để không kích hoạt hai lần.
- **Hai trang danh sách Tư vấn/Khảo sát**: **cân nhắc không thêm** — đúng nguyên tắc "danh sách phục vụ hành trình, đừng tạo cả đống vô nghĩa" đã chốt ở V6.0; hai trang tác vụ đã có bộ lọc theo chặng.

**Kiểm chứng V8**: cú pháp sạch cả 2 file; 31 trang render 0 lỗi; 48/48 KPI tính được; 51 mẫu CH4 dùng động, 100% đúng bảng; `check_data.py` = DAT (0 lỗi nặng, 0 lỗi vừa, 5 hàng chờ cố ý); bizGuard chặn đúng 6/6 tình huống sai và cho qua trường hợp hợp lệ; trang Sức khỏe dữ liệu 0 nghiêm trọng / 0 cần sửa / 3 hàng chờ.

---

# Cập nhật V8.1 — đổi tên trang chủ + sửa tìm kiếm + vá tên Demo trùng

- **"Bàn làm việc" → "Trang bắt đầu"** ở menu và mọi nút dẫn về.
- **Ô tìm ở Trang bắt đầu tìm không ra người không quá hạn**: `chayList()` lọc "Cần xử lý" (quá hạn) *trước* rồi mới tìm trong phần đó — nên tìm Demo 1 (đang học / đã hoàn tất) không ra. Nay khi có từ khóa thì **tìm toàn bộ hành trình, bỏ qua bộ lọc chặng**; xóa từ khóa thì quay lại hành vi lọc cũ.
- **Tên "Demo 1/2/3" bị nhân bản sang lead lạ**: `gen_demo.py` gom name pool "từ demo cũ", mà bản cũ đã bị `mkdemo.py` ghi tên "Demo" vào → tên placeholder lọt vào pool rồi được gán ngẫu nhiên cho lead khác (vòng lặp tự nhiễm). Nay gen_demo **lọc bỏ mọi tên khớp `Demo <số>`** khỏi pool. Sau khi sinh lại: đúng **3 lead tên Demo**, đều là lead thật (đã converted) của 3 học viên demo — tìm "Demo 1" ra đúng một người.

**Kiểm chứng V8.1**: 31 trang render 0 lỗi; `check_data.py` = DAT; tìm "Demo 1" ra 1 kết quả, "Demo" ra 3, xóa tìm giữ nguyên 94 hồ sơ Cần xử lý.

---

# Cập nhật V8.2 — Giới thiệu bạn bè (trang học viên)

Thêm mục **"Giới thiệu bạn bè"** vào trang học viên (ngay sau Khuyến nghị, có trong mục lục sidebar).

- Ban đầu hiện thẻ mời với nút **"Tạo mã giới thiệu của bạn"**. Bấm là sinh **mã cá nhân** (ví dụ `ITT-DEMO-5703`, sinh cố định theo học viên nên mở lại vẫn ra mã đó).
- Thẻ mã hiện rõ hai vế ưu đãi: **bạn bè giảm X%** (hoặc số tiền) khi đăng ký khóa đầu, và **học viên giới thiệu nhận thưởng** (mặc định 1 buổi WOW 1-1 miễn phí mỗi bạn đăng ký thành công).
- Hai nút **Sao chép mã** và **Sao chép lời mời** (lời mời soạn sẵn kèm mã, gửi thẳng Zalo/Facebook).
- Nếu đã có bạn dùng mã, thẻ hiện lời cảm ơn kèm số lượng.

**Chính sách cấu hình ở Cài đặt → CH2** (3 tham số mới, học vụ đổi được):

- `referralFriend_discountType` — `percent` hoặc `amount`
- `referralFriend_discount` — mức giảm (10 = 10%, hoặc số tiền)
- `referralReferrer_reward` — mô tả phần thưởng cho người giới thiệu

Nhập `percent`/`amount` là toàn bộ thẻ đổi cách hiển thị theo. **Kiểm chứng**: 31 trang staff + trang học viên render 0 lỗi; tạo mã ra đúng mã cố định, hiển thị đúng 10%, hai nút sao chép hoạt động (clipboard API + fallback execCommand).

---

# Cập nhật V8.3 — Trang quản lý Mã giới thiệu + lưu mã bền

Trước đây mã giới thiệu sinh tại chỗ trong giao diện, không lưu, không theo dõi được ai dùng mã của ai. Nay có đầy đủ.

## Dữ liệu
- Mỗi học viên có **mã cố định** lưu ở `DL09.referral_code` (cổng học viên, hồ sơ 360 và trang quản lý đọc chung một mã).
- Bảng mới **DL22 · Sổ giới thiệu**: mỗi dòng là một lượt bạn được giới thiệu dùng mã — gồm chủ mã, bạn được giới thiệu, ngày dùng, trạng thái (đã đăng ký / chưa), ưu đãi bạn được giảm. Demo có **14 lượt** từ 8 học viên chủ mã (8 đã đăng ký, 6 đang cân nhắc).
- Để **không phá quy tắc tiền**, việc gắn liên kết chỉ *đổi nhãn* chiết khấu sẵn có thành loại "referral" (không đổi số tiền) — `check_data.py` vẫn DAT.

## Trang mới: Mã giới thiệu (nhóm CSKH & Kết thúc)
- Dải thống kê: số HV đã tạo mã, tổng lượt dùng, số bạn đã đăng ký (kèm % chuyển đổi), tổng ưu đãi đã cấp.
- Bảng theo từng học viên chủ mã: mã, lượt dùng, số bạn đã đăng ký, ưu đãi đã cấp, số lần thưởng. Tên học viên bấm được để mở Hồ sơ 360.
- Nút **"Bạn được giới thiệu"** mở drawer liệt kê từng người dùng mã (tên, SĐT, ngày, trạng thái, được giảm) — bấm tên nhảy sang hồ sơ của bạn ấy.
- Ô tìm theo tên/mã.

## Chỗ cấu hình (giải đáp "cấu hình tạo mã ở đâu")
Chính sách nằm ở **Cài đặt → tab CH2 → nhóm "Giới thiệu bạn bè"**, 3 tham số: kiểu ưu đãi (`percent`/`amount`), mức giảm, phần thưởng người giới thiệu. Trang Mã giới thiệu có nút **"Cấu hình chính sách"** dẫn thẳng tới đó, và banner đầu trang luôn hiện chính sách hiện hành.

**Kiểm chứng V8.3**: 32 trang render 0 lỗi; `check_data.py` = DAT; trang Mã giới thiệu 8 học viên chủ mã, drawer chi tiết cân thẻ; CH2 hiện đủ 3 tham số; cổng học viên + hồ sơ 360 đọc cùng mã và cùng số lượt từ DL22.

---

# Sửa lỗi V8.4 — lưu tham số dạng chữ ở Cài đặt

Bấm lưu `referralFriend_discountType = percent` báo "Giá trị phải là số". Thực ra có **hai lỗi chồng nhau**, cả hai đều do hệ tham số vốn chỉ thiết kế cho số:

1. **`saveParam` bắt mọi giá trị phải là số** — nay nhận biết kiểu: ô **danh sách chọn** (percent/amount → dropdown), ô **chữ tự do** (phần thưởng → nhập text), ô **số** (giữ nguyên kiểm tra số). Đánh dấu kiểu ngay trong bảng tham số.
2. **`paramOf` chỉ trả về giá trị số** (`Number(value)`, NaN thì bỏ qua) — nên kể cả lưu được, mọi tham số chữ vẫn luôn rơi về mặc định. Thêm **`paramStr()`** đọc chuỗi, và đấu lại chỗ đọc kiểu ưu đãi + phần thưởng.

Nay ở Cài đặt → CH2 → Giới thiệu bạn bè: kiểu ưu đãi là **ô chọn percent/amount**, phần thưởng là **ô chữ**, mức giảm là **ô số**. Đổi `amount` + `500000` thì cổng học viên và trang quản lý hiện "**500.000đ**"; đổi `percent` + `12` thì hiện "**12%**"; đổi phần thưởng thì thẻ học viên hiện đúng câu mới.

**Kiểm chứng**: 32 trang render 0 lỗi; lưu percent/amount/chữ/số đều đúng, chặn đúng giá trị sai (chọn ngoài danh sách, chữ rỗng, số nhập chữ).

---

# Cập nhật V8.5 — Breadcrumbs + nút quay lại

Thanh tiêu đề (dưới tên trang) nay là **đường dẫn điều hướng** thay cho dòng mô tả tĩnh:

- **Nút "‹ Quay lại"** ở đầu — bấm là về đúng trang vừa xem, kèm cả ngữ cảnh (đang xem hồ sơ ai, lớp nào, tab nào). Rê chuột thấy tên trang sẽ quay về.
- **Đường dẫn bấm được**: hiện 2 trang gần nhất + trang hiện tại, mỗi mốc bấm được để nhảy thẳng về. Ví dụ: *Bàn giao lead › Hồ sơ · Demo 1*.
- Trang chi tiết được **làm giàu tên**: "Hồ sơ · Demo 1", "Lớp · IELTS 6.5 Tối 2-4-6", "GV · Nguyễn Văn A" — biết ngay đang xem ai chứ không chỉ "Hồ sơ 360".

## Cơ chế
- Mỗi `go()` sang trang khác đẩy trang đang rời vào **lịch sử điều hướng** kèm *ảnh chụp ngữ cảnh* (HOSO, BLCLASS, GVID, GATAB…). Chụp ngay sau khi render nên không bị lẫn ngữ cảnh của trang kế tiếp.
- `navBack()` / `navJump(i)` khôi phục đúng ngữ cảnh rồi render lại, không tự đẩy lịch sử (tránh vòng lặp).
- Lịch sử giới hạn 15 mốc; điều hướng nội bộ (mở khóa/mở nhóm) không phá trạng thái lọc của trang danh sách vì bộ lọc lưu riêng theo trang.

**Kiểm chứng V8.5**: 32 trang render 0 lỗi. Kịch bản đi Khóa học → Báo cáo → mở Hồ sơ Demo 1 rồi bấm Quay lại hai lần trở về đúng Báo cáo rồi Khóa học; navJump nhảy đúng mốc và cắt lịch sử sau đó.


---

# Sửa V8.6 — Breadcrumb theo thứ bậc (không còn "lung tung")

Bản trước breadcrumb hiện **vệt lịch sử đi lại** (2 trang vừa qua) — nhìn rối vì các trang đó không liên quan thứ bậc, chỉ tình cờ xem liền nhau. Nay tách bạch:

- **Breadcrumb = Nhóm menu › Trang hiện tại** (2 cấp cố định, ổn định). Ví dụ: *Chặng · Tuyển sinh › Lead*, *Tra cứu › Khóa học*, *Quản lý › Cài đặt hệ thống*.
- **Trang chi tiết** (hồ sơ, bảng lớp… vốn không nằm trong nhóm menu): hiện **Trang nguồn › Chi tiết**, ví dụ *Bàn giao lead › Hồ sơ · Demo 1* — trang nguồn bấm được để quay lại.
- **Nút "‹ Quay lại"** vẫn theo lịch sử điều hướng, tách khỏi phần chữ breadcrumb nên không còn rối.

**Kiểm chứng V8.6**: 32 trang render 0 lỗi; breadcrumb mọi trang thường ra đúng "Nhóm › Trang", trang chi tiết ra "nguồn › chi tiết", nút quay lại hoạt động.

---

# Đánh giá V8.7 — Trang Xếp lớp & Onboarding sau khi chuyển sang hành trình

## Kết luận: vẫn hợp, chỉ thiếu một mảnh — đã vá

Trang này **không xung đột** với mô hình hành trình, vì hai bên **dùng chung hàm hành động**: chặng "Onboarding" trong hành trình gọi đúng `obSendInfo` / `obConfirm` / `obFinish` / `obChange` và cùng logic `obState()` với trang task. Sửa một chỗ là cả hai đổi theo — không có nguy cơ lệch. Trang task đóng vai **hàng đợi công việc theo vai trò** (Học vụ thấy toàn bộ onboarding của mọi HV cùng lúc), bổ trợ cho hành trình (xem theo từng người). Đúng nguyên tắc "trang tác vụ phục vụ hành trình".

## Một điểm lệch đã tìm ra
Hành trình tách rõ **"Đã thu — chờ xếp lớp"** (chặng `paid`) rồi mới tới `onboarding`. Nhưng trang task chỉ dựng thẻ từ **DL08** — mà DL08 chỉ có SAU khi đã xếp lớp. Nên nhóm **đã đóng tiền nhưng chưa được xếp lớp** bị **giấu sau nút "Xếp lớp học viên"**, không có số đếm, không thành hàng đợi. Học vụ mở trang không thấy còn bao nhiêu em đang chờ.

## Đã vá
- Thêm **ô thống kê "Đã thu · chờ xếp lớp"** (đỏ khi còn tồn) lên đầu dải chỉ số.
- Thêm **hàng đợi "Đã đóng đủ tiền · chờ xếp lớp"** ngay đầu trang: liệt kê từng HV kèm khóa đã đăng ký, ngày đóng, và nút **"Xếp vào lớp"** mở drawer xếp riêng cho em đó (chọn lớp ưu tiên đúng khóa). Dùng **đúng tập** của nút "Xếp lớp học viên" nên hai lối không bao giờ lệch nhau.
- Đổi câu mô tả trang thành đủ nhịp: *đóng đủ tiền → xếp lớp → gửi thông tin → HV xác nhận → hoàn tất*.

Nay trang task phủ đúng khoảng mà hành trình phủ, hai bên nhất quán.

**Kiểm chứng V8.7**: 32 trang render 0 lỗi; hàng đợi hiện 2 HV chờ xếp lớp, khớp tập của nút tạo; drawer xếp riêng từng em cân thẻ.

---

# Cập nhật V8.8 — Hủy đăng ký (đã đóng tiền vẫn hủy được)

**Trả lời câu hỏi "học viên đóng tiền rồi muốn hủy thì thao tác ở đâu":** trước đây nút hủy chỉ nằm trong luồng "Chạy quy trình" (chạy hồ sơ từng khách), rất khó tìm. Nay thêm thẳng vào **trang Thu & xác nhận Thanh toán** — nơi tự nhiên nhất để quản lý đăng ký & tiền.

- Mỗi thẻ đăng ký (chưa hủy) có nút đỏ **"Hủy đăng ký"**.
- Bấm mở drawer: hiện khóa, học phí, **đã đóng bao nhiêu**, đang ở lớp nào; chọn **lý do hủy** (danh mục mới `enum_cancellation_reason`); ghi chú tự do. Cảnh báo rõ: nếu đã thu tiền, sau khi hủy sẽ vào hàng **"Hoàn tiền chờ xử lý"** ở trang Duyệt để kế toán hoàn theo chính sách (CH2 refund* theo mốc ngày).
- Xác nhận hủy: đặt trạng thái `cancelled` + lý do, **trừ học viên khỏi lớp** (sĩ số giảm), và nếu còn tiền đã đóng thì tự nhảy sang trang Duyệt để xử lý hoàn.
- Thêm **chip lọc "Đã hủy"**; thẻ đã hủy hiện mờ, ghi rõ *"đã đóng X → chờ hoàn tiền"* hoặc *"đã hoàn X"*, kèm nút tới trang Duyệt.

Luồng hai bước đúng phân vai: **Học vụ/Kế toán hủy** ở Thanh toán → **quản lý/kế toán xác nhận đã hoàn** ở Duyệt. Cùng dữ liệu với nút hủy trong hành trình (đều ghi DL06), không lệch.

**Kiểm chứng V8.8**: 32 trang render 0 lỗi. Hủy ENR-2026-001 (đã đóng 22,5tr): trạng thái → cancelled, lý do ghi nhận, sĩ số lớp 10→9, và hồ sơ xuất hiện trong "Hoàn tiền chờ xử lý" ở Duyệt.

---

# Cập nhật V8.9 — Gộp nhận xét buổi học vào trang Điểm danh

Trước đây việc ghi nhận rải hai trang: **Điểm danh** có đánh giá + ghi chú *từng học viên*, còn **Buổi học & nhận xét GV** có nhận xét chung *cả lớp*. Giáo viên dạy xong phải nhảy hai nơi.

## Gộp về một chỗ (Điểm danh = bàn làm việc sau buổi dạy)
Trang Điểm danh (đổi tên **"Điểm danh & nhận xét buổi"**) nay có đủ:

- **Theo từng học viên**: điểm danh (có mặt/muộn/vắng P/K) · đánh giá trong buổi (Tốt/Bình thường/Yếu) · ghi chú riêng.
- **Nhận xét chung cả lớp**: một khối riêng ở cuối, kèm badge *chờ ghi / đã ghi* và hạn SLA, có ô "GV vào trễ (phút)".
- **Một nút "Lưu buổi học"** ghi trọn cả hai — điểm danh vào DL12, nhận xét chung vào DL11.

## Không trùng lặp dữ liệu
Nhận xét chung vẫn chỉ nằm ở **một trường duy nhất** `teacher_note_summary` (DL11). Ghi ở Điểm danh hay ở Buổi học đều vào đúng ô đó, nên viết bên này thì bên kia tự thành "đã ghi". Trang **Buổi học & nhận xét GV** giữ vai **theo dõi SLA** (buổi nào chưa ghi, quá hạn, dạy bù) và vẫn có ô ghi nhanh — hai nơi cùng một ô, không phải hai bản.

**Kiểm chứng V8.9**: 32 trang render 0 lỗi; trang Điểm danh cân thẻ 61/61; lưu nhận xét chung (kể cả khi chưa điểm danh ai) ghi đúng `teacher_note_summary` + `has_teacher_note` + giờ hoàn tất + GV trễ vào DL11, và buổi đó hiện "đã ghi" bên Buổi học.

---

# Cập nhật V9.0 — Gộp toàn bộ vận hành lớp về MỘT trang

Trước đây "vận hành một lớp" bị xé thành 4 trang menu riêng: Lớp học, Điểm danh, Buổi học, Giao & chấm Bài tập — giáo viên phải nhảy qua lại. Nay gom hết vào **một trang "Vận hành lớp"** (bấm vào lớp từ danh sách Lớp học là vào).

## Cấu trúc mới
Trang lớp có thanh thông tin lớp + dải KPI riêng, rồi **3 tab**:

1. **Buổi học & điểm danh** (mặc định): bảng Lịch buổi (kế hoạch bài + dặn dò + hạn nộp + trạng thái nhận xét). Bấm "Điểm danh" ở một buổi là workspace hiện ngay bên dưới: **Bắt đầu / Kết thúc buổi** (giáo viên bấm bắt đầu = điểm danh giảng viên, theo quy định trước giờ) · điểm danh từng học viên · đánh giá trong buổi (T/B/Y) · ghi chú riêng · **nhận xét chung cả lớp** + GV vào trễ. Một nút **Lưu buổi học** ghi trọn.
2. **Học viên**: sĩ số, chuyên cần, bài tập, nguy cơ; bấm tên mở Hồ sơ 360.
3. **Giao & chấm bài tập**: nguyên luồng giao/thu/chấm (một bài chung hoặc mỗi em một bài), tự điền theo giáo án — nhưng lớp đã cố định nên không phải chọn lại.

## Menu gọn lại
- Bỏ khỏi sidebar: **Điểm danh** và **Giao & chấm Bài tập** (đã nằm trong trang lớp). Vẫn giữ được như trang ẩn để các nút tắt cũ (từ hành trình, Bàn làm việc) hoạt động.
- **"Bảng lớp / Roster" → "Vận hành lớp"** — trang lớp chính.
- Giữ **"Theo dõi nhận xét buổi"** (đổi tên từ Buổi học & nhận xét GV) làm bảng theo dõi SLA **toàn bộ lớp** cho học vụ — đây là việc quản lý xuyên lớp, khác với vận hành một lớp.

## Kỹ thuật
- Tách phần thân của Điểm danh và Bài tập thành `ddHub`/`btHub` nhận cờ *embed* (bỏ tiêu đề trang, thanh thông tin lớp, ô chọn lớp) để nhúng vào trang lớp mà không nhân đôi mã. Mọi hàm lưu (điểm danh, giao/thu/chấm) đổi `reRender` về trang hiện tại nên chạy đúng dù đứng ở trang lớp.
- Không nhân đôi dữ liệu: điểm danh vẫn DL12, nhận xét buổi vẫn `teacher_note_summary` (DL11), bài tập vẫn DL13 — chỉ gộp **giao diện**.

**Kiểm chứng V9.0**: cả 2 file cú pháp sạch; 3 tab render cân thẻ (113/33/82 div); lưu điểm danh + nhận xét lớp từ trang lớp ghi đúng DL12 + DL11 và làm mới đúng trang lớp; giao bài reRender đúng; sidebar không còn Điểm danh / Giao bài; goDD và nút hành trình mở thẳng trang lớp đúng buổi; trang học viên (cổng riêng) không ảnh hưởng.

---

# Cập nhật V9.1 — Lịch buổi gọn lại (dải thẻ thay bảng 8 cột)

Bảng "Lịch buổi" 8 cột ở trang Vận hành lớp choán chỗ và không rõ bấm xong thì danh sách điểm danh hiện ở đâu. Đổi sang:

- **Dải "thẻ buổi" gọn**: mỗi buổi là một thẻ nhỏ (Buổi N + ngày), **chấm màu = trạng thái** (xanh xong / vàng đang học / xám lên lịch / đỏ hủy), dấu **✓** góc nếu đã ghi nhận xét. Bấm thẻ nào thì thẻ đó sáng lên và **danh sách điểm danh của buổi đó hiện ngay bên dưới** — luôn có một buổi được chọn sẵn nên roster luôn thấy.
- **Thanh kế hoạch buổi** (một dòng gọn): chủ đề · bài về nhà · hạn nộp · lời dặn + nút "Cấu hình buổi". Thay cho việc nhồi hết vào bảng.
- Bỏ hẳn bảng 8 cột và ô chọn buổi trùng lặp bên dưới.

Giờ luồng rõ: **chọn thẻ buổi → roster điểm danh + nhận xét hiện ngay dưới**, gọn và trực quan.

**Kiểm chứng V9.1**: 32 trang render 0 lỗi; trang lớp cân thẻ 94/94; dải 12 thẻ buổi, có thanh kế hoạch, roster điểm danh + ô nhận xét chung hiện đúng; không còn bảng 8 cột hay ô chọn buổi lặp.

---

# Cập nhật V9.2 — Cổng điểm danh + GV đúng giờ/trễ + loạt feedback

## Cổng điểm danh & điểm danh giảng viên (theo SOP)
Ở trang Vận hành lớp, mỗi buổi giờ đúng quy trình:
- Giáo viên **bấm "Bắt đầu lớp"** = điểm danh giảng viên (ghi giờ vào lớp) → mới mở danh sách điểm danh học viên.
- **Cổng điểm danh chỉ mở 20 phút trước giờ học** (cấu hình `slaAttendanceGate_minutes` ở CH2). Trước khung này danh sách bị khoá, hiện "Cổng điểm danh mở lúc HH:MM". Sau khi bắt đầu, roster mở ra ngay.
- Trạng thái buổi hiện luôn chip **"GV đúng giờ" (xanh)** hoặc **"GV trễ N phút" (vàng/đỏ)** — tự tính khi bấm bắt đầu (so với giờ học), không phải nhập tay nữa.

## Loạt feedback (file anh gửi) — đã làm
- Nút **"Chạy" → "Xử lý"** ở mọi hàng đợi.
- Danh sách lead thêm cột **"Vào hệ thống"** (ngày lead vào).
- Bỏ 2 nút thừa: **"Xem toàn bộ hành trình"** (Trang bắt đầu) và **"Chạy quy trình"** góc phải (trang Hành trình).
- Ô số liệu ở Trang bắt đầu có **mũi tên xuống** + gợi ý để biết bấm vào sẽ lọc danh sách bên dưới; ô tìm có dòng chỉ dẫn.

Toàn bộ 21 mục feedback được theo dõi ở **FEEDBACK_theo_doi.md** (đã làm / kế tiếp). Các mục lớn (gộp luồng tuyển sinh, thiết kế lại khảo sát–feedback–khiếu nại 2 chiều, tách chức năng ít dùng) sẽ làm từng cái để anh duyệt.

**Kiểm chứng V9.2**: 32 trang render 0 lỗi; cổng khoá đúng cho buổi tương lai, mở cho buổi trong khung; GV đúng giờ/trễ hiện đúng; các trang banlam/hanhtrinh/lead cân thẻ.

# Cập nhật V9.3 — Loạt feedback nhanh (gộp nguy cơ, khóa học vào Cài đặt, drawer HV, hướng dẫn lead)

Làm tiếp 5 mục "nhanh/vừa" trong file feedback, tất cả **không phá tính năng cũ**, chỉ gọn và rõ hơn.

## 16 · Gộp "Học viên nguy cơ" vào "Học viên"
- **Bỏ trang nguy cơ riêng.** Danh sách Học viên có thêm **chip lọc "Nguy cơ"** ngay trên thanh công cụ (cơ chế lọc tuỳ biến `window.QF` — khác bộ lọc enum, dùng cho điều kiện tính toán). Bấm chip → chỉ hiện HV chuyên cần/học thuật `at_risk|off_track`.
- Thêm 2 cột **lý do** (chuyên cần / học thuật) để thấy ngay vì sao.
- Mọi nơi trước trỏ tới trang nguy cơ (ô số liệu Trang bắt đầu, nút "Mở danh sách" ở Báo cáo) nay gọi `goRisk()` = mở Học viên **đã bật sẵn lọc Nguy cơ**.

## 17 · "Khóa học" chuyển vào Cài đặt (là cấu hình, không phải tra cứu hằng ngày)
- Bỏ "Khóa học" khỏi menu **Tra cứu** (nhóm này giờ còn Học viên · Lớp · Giảng viên — đúng thứ tương tác mỗi ngày).
- Thêm **tab "Khóa học"** trong **Cài đặt hệ thống**: bảng danh mục (mã, tên, trình độ, số buổi, học phí, quota WOW, trạng thái) + nút **"Mở danh sách đầy đủ (thêm/sửa)"** (trang cũ vẫn còn, chỉ ẩn khỏi menu) và nút **Hồ sơ** từng khóa.

## 12 & 14 · Bấm tên học viên → drawer thông tin nhanh
- `openStuQuick(student_id)` mở drawer gọn thay vì nhảy thẳng hồ sơ 360: chip chặng hành trình, SĐT/khóa/lớp, **chuyên cần %** (số buổi có mặt/tổng), trạng thái chuyên cần & học thuật, **việc nên làm + SLA** (đọc từ engine hành trình).
- Hai nút: **Hồ sơ đầy đủ** (mở 360) và **Đẩy vào quy trình** (`runStart`).

## 13 · Cờ nguy cơ phải xem được lý do cụ thể + xử lý ngay
- Với HV đang nguy cơ, drawer có **hộp đỏ "Vì sao gắn cờ nguy cơ"**: lý do chuyên cần/học thuật (kèm mã lý do nếu có), **số buổi vắng không phép + ngày cụ thể**, ghi chú theo dõi.
- Nút chuyển thành **"Xử lý nguy cơ (đẩy vào quy trình)"** để hành động ngay.

## 6 · Bấm lead → hướng dẫn trước khi xử lý
- Drawer lead có **hộp "Hướng dẫn nhanh"** ở đầu: **đang ở** chặng nào · **nên làm** gì · **thời hạn** (còn ~Xh / đã quá hạn ~Xh, tô màu xanh/vàng/đỏ theo SLA) + nút **"Xử lý theo quy trình"**.

## Kỹ thuật
- Bộ lọc tuỳ biến trong `renderList`: `cfg.qf=[[key,nhãn,hàm_lọc]]`; áp sau lọc enum; render thành chip segmented; `qfToggle`/`clearFilt` dọn cả `window.QF`.
- CSS mới: `.tbdiv` (vạch ngăn thanh công cụ), `.guidebox`/`.gbrow` (hộp hướng dẫn lead).
- Không thêm icon mới ⇒ không phải dựng lại font.

**Kiểm chứng V9.3**: build 2 file OK; `node --check` app + portal HV đều PASS; harness 32 trang **0 lỗi**, **124 icon đủ**; test riêng: lọc Nguy cơ giảm đúng số dòng, `openStuQuick` (thường + nguy cơ) có đủ hộp lý do & nút, `leadDetail` có guidebox + nút, tab Cài đặt "Khóa học" có bảng + nút mở list. Menu Tra cứu còn 3 mục.

# Cập nhật V9.4 — Loạt tinh chỉnh UX/UI (drawer trước, sửa tràn, node hành trình 1 dòng)

Xử lý phản hồi lần 2 của anh về trải nghiệm bấm/nhìn.

## Sửa lỗi & luồng bấm
- **Lỗi "Việc nên làm: [object Object]"**: `act` của engine hành trình là object `{lb,ic,fn,arg}` — đã lấy đúng `act.lb`, kèm dòng giải thích `why`. Áp cho drawer HV và hộp hướng dẫn lead.
- **Bấm tên KHÔNG nhảy thẳng vào quy trình nữa.** Ở Trang bắt đầu và Hành trình học viên, bấm một người → **mở drawer thông tin trước** (`openQuick` tự nhận HV/lead → mở drawer tương ứng). Muốn xử lý thì bấm nút **"Xử lý"** / **"Đẩy vào quy trình"** trong drawer. Đúng nguyên tắc: xem trước, hành động qua nút.
- **Bấm tên LỚP** ở danh sách Lớp → **drawer tổng quan** (`openLopQuick`: sĩ số, GV, tiến độ buổi, HV nguy cơ, buổi chưa nhận xét) + nút **"Mở vận hành lớp"**. Không nhảy thẳng vào Bảng lớp.

## Bổ sung theo yêu cầu
- **Nút "Đặt buổi WOW"** ngay trong drawer học viên (mở form WOW đã chọn sẵn HV đó).
- **Hồ sơ Giảng viên**: thêm **avatar** (ảnh nếu có link, không thì chữ cái đầu tô màu) + **khung tiểu sử** (giới thiệu, chuyên môn, kinh nghiệm) sửa được tại chỗ.
- **Ô tìm ở Trang bắt đầu**: gợi ý rõ **"↓ kết quả hiện ở danh sách bên dưới"**, và khi gõ thì đếm số kết quả sống.

## Sửa UI tràn
- **Nút không còn xuống hàng chữ**: `.btn{white-space:nowrap;flex-shrink:0}` toàn app; cụm nút trong thẻ tự xuống dòng nguyên nút (không vỡ chữ).
- **Cột "Buổi 1"** ở Kho bài tập & Giáo án không còn rớt số 1 xuống dòng (nới cột + `white-space:nowrap`).

## Node hành trình về 1 dòng ngang (bug ẩn quan trọng)
- Phát hiện **đụng tên class `.jstep`**: component "Hành trình khách hàng" (`journeyHTML`) và thanh bước lớn (`jStepper`) dùng chung tên → thanh bước bị dính viền/padding/margin của nhau nên **hiện thành các block rời**. Đã **tách class riêng** (`.jline/.jlstep/.jldot/.jlt/.jlc`) và dựng lại thành **stepper ngang 1 dòng, cuộn được**, có đường nối và dấu check khi hoàn thành.

**Kiểm chứng V9.4**: build 2 file OK; `node --check` app + portal HV PASS; harness **32 trang 0 lỗi**, **125 icon đủ** (đã dựng lại font subset để thêm `ti-arrow-down`); 9/9 test tính năng đạt (hết `[object Object]`, `openQuick` điều hướng đúng, `openLopQuick`, `wowAdd` pre-chọn, avatar+bio GV, `journeyHTML` 1 dòng).

# Cập nhật V9.5 — Ba luồng lớn thành HUB + stepper 1 dòng (gộp mạnh theo SOP)

Xử lý 3 mục lớn còn lại của file feedback, làm trọn vẹn theo nghiệp vụ, cùng bug "block" của node hành trình trên các trang tác vụ.

## Stepper các trang tác vụ về 1 dòng (Test, Tư vấn, Thanh toán, WOW…)
Component `stepBar` (13 trang dùng) trước để **chấm trên – chữ dưới** trông như các block. Đã đổi thành **chấm + nhãn cùng một hàng**, có **đường nối** giữa các bước, cuộn ngang khi hẹp. Giờ "Đặt lịch → Dự test → Chấm điểm → Tư vấn" đọc như một dòng liền mạch.

## #18 · Hub TUYỂN SINH (gộp 4 trang thành 1 luồng)
Một trang **Tuyển sinh** duy nhất, có **phễu bấm được** (Lead → Test đầu vào → Tư vấn & ĐK → Thanh toán, mỗi bước hiện số việc đang chờ) và **tab** chuyển bước. Mỗi tab **nhúng nguyên chức năng cũ** (vẫn xử lý task, vẫn liệt kê): Lead (danh sách + nhập lead), Test, Tư vấn & Đăng ký, Thanh toán. 4 trang lẻ ẩn khỏi menu; mọi điều hướng cũ tới chúng tự mở đúng tab trong hub.

## #20 · Hub CSKH hai chiều (Khảo sát · Phản hồi · Khiếu nại)
Một trang **CSKH · Khảo sát & Phản hồi** nói rõ **2 chiều**:

- **Trung tâm → Học viên**: gửi **Khảo sát** định kỳ; học viên nhận & trả lời ngay trong **Trang học viên**.
- **Học viên → Trung tâm**: **Góp ý & Khiếu nại** — học viên gửi từ Trang học viên (hoặc NV ghi hộ khi nhận qua gọi/nhắn); trung tâm phân loại, xử lý, phản hồi lại, và học viên **thấy trạng thái + phản hồi** ngay trong portal.

3 tab (Khảo sát / Phản hồi / Khiếu nại) gộp 4 trang cũ (review, khaosat, ghinhan, khieunai). Mỗi phiếu theo dõi trạng thái tới khi đóng, có SLA theo mức độ.

## #19 · Hub HỌC TẬP (gom các trang giảng dạy rời)
Một trang **Học tập & Giảng dạy** với 3 tab: **Lớp học** (bấm lớp → drawer → Vận hành lớp), **Nhận xét buổi** (SLA ghi nhận xét toàn bộ lớp), **Buổi WOW 1-1**. Kèm lối tắt sang **Kho bài & Giáo án** và **Vận hành lớp**. Menu Chặng · Học tập nay gọn còn 4 mục: *Xếp lớp & Onboarding · Vận hành lớp · Học tập & Giảng dạy · Kho bài tập & Giáo án* (bỏ 2 trang lẻ Theo dõi nhận xét buổi và Buổi WOW khỏi menu, đưa vào tab; đưa danh sách Lớp từ Tra cứu vào tab Lớp học).

## Kỹ thuật (đường ống nhúng dùng chung)
Để nhúng an toàn nhiều trang vào một hub mà không "thổi bay" trang chủ:
- `filterBar`, `rlist`, `pageGo` nay **re-render theo `CUR`** (trang đang hiển thị) thay vì trang cố định → chip lọc / tìm / phân trang trong tab hoạt động đúng trong hub.
- `renderList(key, emb)`, và các render tác vụ nhận cờ **`embed`** để bỏ tiêu đề trang khi nằm trong hub.
- `go()` có **bảng chuyển hướng**: mọi lệnh đi tới trang con (test/tuvan/thanhtoan/nhaplead, review/khaosat/ghinhan/khieunai, lop/buoihoc/wow) tự mở đúng **hub + tab**, nên không mất bất kỳ đường đi cũ nào.

**Kiểm chứng V9.5**: build 2 file OK; `node --check` app + portal HV PASS; harness **35 trang 0 lỗi**, **125 icon đủ**; test riêng 3 hub: Tuyển sinh (4 tab + phễu + redirect), CSKH (3 tab + legend 2 chiều + redirect + ẩn menu), Học tập (3 tab + redirect + menu gọn, giữ Vận hành lớp). Menu tổng thể gọn hơn rõ rệt: mỗi chặng giờ là **một cửa vào**.


## V9.6 (27/07) - Đợt 1 kế hoạch hoàn thiện (hội đồng 4 chuyên gia)

Luân cấp toàn quyền + yêu cầu phối hợp chuyên gia (LMS/CRM, sales dày dặn, UX/UI IELTS, học vụ) rà
toàn app. Ra 104 phát hiện, chưng cất thành `KE_HOACH_HOAN_THIEN_APP.md` (7 đợt). Đợt 1 làm ngay:

- **Hub "Tính năng khác" (FB-21)**: trang `khac` nhóm Quản lý, 3 tab Bảo lưu/Bỏ học · Mã giới thiệu ·
  Bàn giao lead (nhúng embed đúng mẫu hub; KMAP trong go(); 3 trang lẻ ẩn menu). Menu gọn: CSKH còn
  2 mục, Quản lý 4 mục.
- **Sửa bug "chạy êm nhưng sai số"**: (1) HV nguy cơ của Lớp/Hồ sơ GV/Hồ sơ Khóa luôn 0 vì lọc DL09
  theo cột class_id không tồn tại - đã join qua DL08 (3 chỗ); (2) Bảo lưu trống SĐT + lớp (s.phone,
  s.class_id_name sai tên cột); (3) slaComplaintFirstResponse_hours + slaReenroll_days gọi sai tên CH2
  - thêm PKEY (SLA_R nay so 2h theo slaKN_assignment_hours, đúng SOP); (4) 2 SLA cắm cứng 24h trong
  JSTAGE: test_booked -> slaTestBookedRemind_hours (APPPARAMS mới), paid -> slaPLR48_hours (48h);
  (5) APPPARAMS thêm slaPayment_hours; (6) Bàn giao lead cột việc đọc naLive (CH4 sống).
- **UX quick wins**: reRender giữ vị trí cuộn (cày hàng đợi không văng lên đầu trang); token --ink;
  chữ phụ xám nhạt nâng tương phản (mut/empty/hvempty/jsw/jtlw/pempty/pcage/kpiv.gray); chip lọc
  bật màu chữ đậm; :focus-visible toàn cục; .obcards>.empty chiếm đủ hàng; .jcard panel -> .jpanel;
  statStrip hết hover giả; khối "Đăng ký còn nợ" trỏ tab Thanh toán đã lọc debt; doHandover có
  confirm + tách doHandoverRun; mọi reRender nội bộ banggiao/magioithieu theo CUR.
- **Sales**: màn gọi (bước liên hệ) hiện mục tiêu học + lịch rảnh + dự kiến bắt đầu + ghi chú lead;
  drawer lead thêm 4 dòng tương ứng + phân loại lead.
- **Harness**: _tall.js đọc HTML theo env ITTS_OUT; kỳ vọng mới 36 trang 0 lỗi.
- Verify: node --check 2 file OK; harness 36 trang 0 lỗi; 125 icon đủ; 31 kiểm định chức năng
  tự viết (tham số, hub tab, join DL08, CSS token) đều đạt.


## V9.7 (27/07) - Nền demo đa cổng: data file riêng + lưu thật + đồng bộ + reset

Theo yêu cầu Luân: "mỗi người mỗi cổng, bấm gì lưu thật để cổng bên kia thấy (vd duyệt), hết buổi
demo bấm reset là về ban đầu; data để file riêng cho dễ thay".

- **Dữ liệu tách file `ITTs_data.js`**: app ưu tiên đọc file cạnh nó (window.ITTS_DATA), thiếu file
  dùng bản nhúng. Thay dữ liệu demo = thay 1 file, không build lại app.
- **Màn cổng chọn người** ở cả 2 file: app NV liệt kê nhân viên theo vai trò (+ Vào nhanh Quản trị),
  cổng HV có ô tìm + thẻ học viên. Người chọn lưu sessionStorage THEO TAB - mở 2 cửa sổ là 2 người
  khác nhau. setRole ưu tiên GATE_SID nên lời chào/CURSTAFF đúng người. Đổi người: bấm ô tên đáy
  sidebar (NV) / nút Đổi người (HV).
- **Lưu thật + đồng bộ**: mọi thao tác ghi (offline) lưu localStorage (key ITTS_DEMO_STATE_V1, có sig
  theo bộ dữ liệu gốc); các cửa sổ đang mở nhận sự kiện storage -> tự nạp + reRender + toast "Dữ liệu
  vừa cập nhật từ cổng khác". Đang mở form thì chờ đóng form mới áp (không mất chữ đang gõ).
  Demo duyệt 2 chiều: cửa sổ A (sales) tạo CK -> cửa sổ B (quản lý) thấy chờ duyệt -> duyệt -> A thấy.
- **Reset dữ liệu demo**: nút ở màn cổng + Cài đặt > tab "Dữ liệu demo" (tab mới: nguồn dữ liệu,
  trạng thái thay đổi, hướng dẫn demo 2 cổng). Reset xóa phần lưu, mọi cửa sổ tự nạp lại nguyên bản.
- Bản .gs (SVR) không đổi hành vi: vẫn ghi sheet, bỏ qua lớp localStorage.
- Verify: node --check 2 file; harness 36 trang 0 lỗi; 26 kiểm định persistence/sync/reset/gate
  (_check2.js) + 31 kiểm định đợt 1 chạy lại đều đạt.
- Lưu ý demo: mở file trực tiếp thì dùng CHROME (localStorage file:// chung origin); chắc ăn mọi
  trình duyệt: python3 -m http.server trong thư mục app.


## V9.7b (27/07) - Hội đồng thẩm định nền demo + 20 bản vá

Theo yêu cầu Luân "mọi thứ phải qua hội đồng chuyên gia": 3 chuyên gia (kiến trúc offline-first,
UX/UI, pre-sales demo) thẩm định V9.7. Kết luận ĐẠT CÓ ĐIỀU KIỆN với 3 lỗi P1 + loạt P2, đã vá hết:
thao tác đầu ở cổng HV không được lưu (__base chốt lười) · sync có thể nuốt thao tác trong cửa sổ
debounce (nay flush local thành bản mới nhất rồi dừng, các cổng tự hội tụ) · nhãn vai trò lộ mã thô
ở màn cổng (gateRole xử lý ngoặc lồng) · reset từ cổng khác nay reload ngay kể cả đang mở form ·
mở nhầm file cũ không phá state đang demo · nút "Kiểm tra đồng bộ" · toast sync kèm tên người +
3.2s + nổi trên màn cổng · chuông đếm CK chờ duyệt + buildNav sau sync · chip "DỮ LIỆU DEMO" trên
topbar · title/favicon phân biệt 2 file · dấu giờ sinh dữ liệu · gate NV có ô tìm + Quản trị lên
đầu + thứ tự vai trò demo · thẻ Demo 1/2/3 có nhãn "Hồ sơ demo - dữ liệu đầy đủ" · F5 không mất
thao tác (beforeunload flush) · hvPickStu nhớ người. Kèm `DEMO_CHECKLIST.md` cho Luân đi demo.
Verify: harness 36 trang 0 lỗi; _check2 nâng lên 34 tiêu chí (thêm flush/last-write-wins, gateRole,
chuông CK, sig lệch không phá state) - tất cả đạt; _check1 31 tiêu chí vẫn đạt.


## V9.8 (27/07) - Đợt 2: ngày làm việc của sales + màn cổng 2 bước

Triển khai 9 hạng mục Đợt 2 của kế hoạch, qua 2 vòng thẩm định (sales veteran + UX/UI) và vá 21
phát hiện. Nổi bật: "Tới hẹn hôm nay" (hẹn hôm nay trước, quá hẹn cũ sau, hiện giờ hẹn từng dòng),
"Chỉ khách của tôi" + "KPI của tôi", form "Khách mới liên hệ đến" 1 phát ra lead + điểm chạm inbound,
chặn trùng SĐT có nút xem hồ sơ cũ (giữ nháp), từ chối có lý do + hẹn chăm lại (Reup xếp theo hẹn),
drawer tin xác nhận Zalo + in phiếu thu sau mọi lần thu, ô tìm gợi ý cho tác vụ nhanh, chia đều lead
chưa có NV, SĐT bấm gọi/copy. Quyết định nghiệp vụ: "khách từ chối" tính là cuộc nói-chuyện-được
trong KPI kết nối. Màn cổng đổi 2 bước (chức danh -> tên) theo góp ý Luân; cổng HV hiện 10 hồ sơ
giàu dữ liệu nhất. Verify: harness 36 trang 0 lỗi; bộ kiểm 41+34+31 tiêu chí đạt.
KẾ TIẾP: màn hình theo chức danh (ai thấy gì) - hội đồng đang thiết kế ma trận.


## V9.9 (27/07) - Màn hình theo chức danh (ROLESCOPE)

Mỗi người vào cổng thấy đúng màn hình chức danh mình: 9 nhóm quyền + lớp phủ quản lý, menu/trang
mở đầu/khối Trang bắt đầu/chuông việc/tab nhạy cảm đều theo nhóm (ma trận trong
THIET_KE_PHAN_QUYEN_CHUC_DANH.md). Bấm tên luôn xem được hồ sơ; trang ngoài phạm vi mở ở chế độ
tham khảo; Duyệt/Cài đặt/Báo cáo chặn theo nhóm; Vào nhanh Quản trị thấy hết. Verify: harness
36 trang + bộ kiểm mới 70 tiêu chí x 9 nhóm; tổng 176 tiêu chí đạt. Quy trình mới theo Luân:
làm một mạch các đợt còn lại (3→7), hội đồng tổng kiểm một lần cuối.


## V9.10 (27/07) - Đợt 3: học vụ & giảng viên (một mạch)

Tab "Hôm nay" cho GV (buổi dạy + giáo án + hàng chấm + nợ nhận xét, GV vào cổng là thấy ngay ngày
của mình); bảng sức khỏe MỌI lớp có chip lọc dưới ngưỡng; hàng đợi "Gọi hỏi thăm HV vắng" theo
slaAbsenceCall_hours (ghi chú vào buổi là việc tắt); điểm danh vắng bắt lý do (vắng phép chặn cứng);
chấm bài 0-9 bước 0.5 + hỏi đúng hạn/trễ khi chấm bài chưa thu; nút Chấm nhảy thẳng đúng lớp+bài;
tab Học viên của lớp tính theo lớp; MOCK GIỮA KHÓA (DL08 mid_*) đổ thẳng vào cột Giữa khóa trang
học viên. Verify: 36 trang 0 lỗi + 196 tiêu chí (thêm _check6). Bản Sheets cần thêm 6 cột mid_* DL08.


## V9.11 (27/07) - Đợt 4: khép vòng đời + tiền (một mạch)

HV học nhiều khóa hết kẹt "cựu học viên"; hoàn tiền tính tiền thật theo 3 mốc chính sách CH2 và ghi
dòng thu ÂM để doanh thu tự trừ; chặn đóng thừa + cảnh báo cọc thấp; hẹn thu theo đợt (nhắc đúng
ngày hẹn, có chip Tới hẹn thu); in xác nhận đăng ký; kết quả đầu ra tự gợi ý đạt/chưa đạt + HV trượt
target có form lộ trình tiếp riêng; bảo lưu có hạn + nhắc trước 14 ngày; xin cảm nhận HV đạt mục
tiêu; 2 rule vòng đời lớp (sắp kết thúc / đã kết thúc còn thiếu hồ sơ). Cột sheet mới cần thêm khi
lên Sheets: DL06.next_payment_due, DL09.pause_until (+ 6 cột mid_* DL08 từ V9.10).
Verify: 36 trang 0 lỗi, 223 tiêu chí tự động.


## V9.12 (27/07) - Đợt 4B: mỗi học viên / mỗi lead 1 dòng

12 trang tác vụ (Test, Tư vấn, Thanh toán, Xếp lớp, Kết thúc, Bảo lưu, Buổi học, WOW, Khảo sát,
Khiếu nại, Ghi nhận phản hồi) đổi từ lưới thẻ sang DANH SÁCH HÀNG: mỗi hồ sơ 1 dòng gọn (tên +
info + chip + nút hành động), màn 13" thấy 15-20 hồ sơ; bấm vào dòng là nở nguyên chi tiết tại chỗ
(stepper, lý do, nút phụ), bấm lại thu gọn. Không đổi logic - chỉ đổi cách bày, mọi nút cũ giữ nguyên.
Verify: 36 trang 0 lỗi, 249 tiêu chí (thêm _check8).


## V9.13 (27/07) - Đợt 5: điều phối & lịch (một mạch)

Lịch tuần trong hub Học tập (7 ngày x GV/lớp, gom buổi + WOW + test, chip trùng giờ viền đỏ, cảnh báo
lớp chưa gán GV); hủy buổi bắt lý do + xác nhận đã báo HV; dạy bù tạo BUỔI MỚI giữ vết buổi hủy + chọn
GV dạy thay; cảnh báo trùng lịch GV khi xếp bù/đặt WOW/dời WOW; WOW chọn ngày giờ chuẩn + xem lịch bận
GV ngay trong form; hủy WOW hoàn quota (phân biệt với HV không đến), dời WOW giữ quota; điểm danh có
trạng thái "Bù" (học bù tính có mặt). Verify: 36 trang 0 lỗi, 271 tiêu chí (thêm _check9).


## V9.14 (27/07) - Đợt 6 (UX + báo cáo) + Đợt 7 (cổng học viên) - HẾT các đợt kế hoạch

Ô tìm trang chủ thành autocomplete gợi ý tức thì (bỏ dấu, bấm là mở hồ sơ); danh sách Học viên lọc
được theo lớp + khóa; trang Hành trình tách rõ khỏi vận hành lớp; bảng sắp xếp khi bấm tiêu đề +
chọn số dòng/trang; cột tiền căn phải; bảng rỗng do lọc có nút Xóa lọc; toast lỗi đỏ 6 giây; Esc
đóng form; bỏ tiêu đề trang lặp 2 lần; nhãn thuần Việt; Báo cáo thêm bảng hiệu quả NGUỒN lead +
bộ chọn kỳ; mọi thao tác ghi kèm dấu vết người-giờ; 4 mẫu tin Zalo gửi khách (copy 1 chạm); công
giảng dạy theo tháng trong hồ sơ GV. Cổng học viên: hero hiện buổi học tiếp theo + 2 nút tắt,
"Sắp tới" lên đầu mục lục, giải thích WOW/quota, khối "Gửi phụ huynh" tóm tắt tháng copy dán Zalo.
Verify: 36 trang 0 lỗi, 298 tiêu chí. CHƯA tổng kiểm hội đồng - chờ yêu cầu mới của Luân.


## V9.15 (28/07) - Đợt 8: MENU THEO CHẶNG VÒNG ĐỜI + HỆ NODE 3 TẦNG + DỮ LIỆU DEMO SỐNG

Theo yêu cầu Luân: "gom theo chặng - mỗi chặng có nghiệp vụ bên trong - block nghiệp vụ ở trang chi
tiết - node thiết kế lại chứ đừng bỏ - tuyển tester làm dữ liệu demo".

**Menu mới 2 tầng theo 4 CHẶNG VÒNG ĐỜI** (mỗi chặng một chấm màu riêng):
- Chặng 1 · Khách tiềm năng: Tổng quan chặng · Lead & khai thác · Test đầu vào · Tư vấn & ĐK · Thanh toán · Chăm lại/Reup (TAB MỚI - khách đã ngưng nằm đây, không mất hẳn).
- Chặng 2 · Đang học: Tổng quan · Xếp lớp & Onboarding · Vận hành lớp · Học tập & Giảng dạy · Kho bài tập · Buổi WOW 1-1 · CSKH.
- Chặng 3 · Tạm dừng: Tổng quan · Bảo lưu/Bỏ học.
- Chặng 4 · Kết thúc & Học tiếp: Tổng quan · Kết thúc & Tái ĐK · Mã giới thiệu.
- Cộng: Làm việc (Trang bắt đầu, Hành trình) / Điều hành (Báo cáo, Duyệt, Bàn giao lead, Cài đặt) / Tra cứu.
Quản lý WOW / Test đầu vào / Bảo lưu... đứng THẲNG trên menu trở lại - bấm là vào đúng hub đúng tab.
Menu vẫn lọc theo chức danh như V9.9; mặc định chỉ mở "Làm việc" + nhóm đang đứng, badge nhóm = việc quá hạn.

**4 trang "Tổng quan chặng" (bấm tên chặng)**: đường ray ga kiểu tàu điện - mỗi ga 44px có icon + số hồ
sơ (đỏ = có quá hạn), giữa các ga hiện %% CHUYỂN ĐỔI thật; ga rẽ nhánh hình thoi (chưa gặp được / đã mất);
2 đầu ray có ga mờ bấm sang chặng liền kề; bấm ga nào sổ trực bên dưới lọc ga đó, có nút "Chạy cả chặng".
Kèm lưới "Nghiệp vụ trong chặng" (đếm việc, bấm vào thẳng trang) - đúng "mỗi chặng có nghiệp vụ bên trong".

**Hệ node 3 tầng (node hồi sinh, thiết kế lại)**: (1) ray ga ở trang chặng; (2) DẢI HẠT hành trình trên
TỪNG DÒNG danh sách khắp app (nhãn C1..C4 + hạt: mờ = đã qua, to = đang đứng, đỏ nháy = quá hạn, thoi đỏ
= rẽ nhánh - liếc 1 giây biết người này đang ở đâu); (3) BLOCK NGHIỆP VỤ CẦN THIẾT (sopBlock) ở hồ sơ 360
+ 2 drawer xem nhanh: 4 dòng chuẩn Chặng / Việc kế / Thời hạn / Phụ trách + câu nhắn chuẩn CH4 + cảnh báo
thiếu dữ liệu.

**Dữ liệu demo đại tu theo tester chuyên nghiệp**: 0 tên placeholder; mọi lớp đang học có lịch TƯƠNG LAI,
4/4 GV có buổi hôm nay, 3 hồ sơ demo cổng HV có "buổi kế tiếp"; hàng chờ sống ngay khi mở app (hoàn tiền
chờ duyệt, lead trong SLA 15 phút, hẹn thu HÔM NAY, vắng chưa gọi, thưởng giới thiệu chờ trao, WOW + test
hôm nay, khiếu nại mức cao); chuông từ 289 việc dồn toa xuống 87 việc (26%% quá hạn có chủ đích để demo
cảnh báo). Sửa nhỏ: Tra cứu nhanh tìm KHÔNG DẤU + theo mã; hết "[object Object]" ở Hôm nay của GV; hết
"đã đóng -đ"; app không còn tự báo "đang có thay đổi demo" oan khi mở lại sau vài ngày.

Verify: 37 trang 0 lỗi, **366 tiêu chí** (thêm _check11 = 68 điểm cho chặng/menu/node), icon 130.
Hội đồng tổng kiểm cuối: vẫn chờ lệnh Luân.

## V9.16 (28/07 chiều) - Đợt 9: PHÒNG DEMO 2 MÁY + cổng học viên đúng vai + hồ sơ 360 đủ thông tin

**Phòng demo 2 máy (yêu cầu Luân)**: màn cổng (cả 2 file) + Cài đặt > Dữ liệu demo có nút **Tạo phòng
2 máy / Vào phòng 2 máy**. Máy A tạo phòng lấy MÃ 5 ký tự, máy B nhập mã - từ đó mọi thao tác đồng bộ
giữa các MÁY KHÁC NHAU y như 2 cửa sổ cùng máy: tạo giao dịch chiết khấu lớn bên A, bên B nổ chuông/
badge/toast ngay; Reset lan cả phòng; nút "Kiểm tra đồng bộ" phát cả sang máy kia. Kỹ thuật: WebRTC
DataChannel (PeerJS), thư viện chỉ tải khi bấm nút (CDN) - bản offline không mạng không ảnh hưởng gì;
máy tạo phòng là trạm trung chuyển; tin đến ghi vào localStorage rồi đi qua syncApply như cũ
(last-write-wins giữ nguyên). Cần mạng ở cả 2 máy + 2 máy mở CÙNG phiên bản demo (mã phòng gắn chữ ký
bộ dữ liệu). F5 tự nối lại phòng.

**Cổng học viên đúng vai** (Luân: "chờ duyệt gì đó học viên đâu có cần"): BỎ khối "Yêu cầu & phê duyệt"
(duyệt là quy trình nội bộ) - giữ lại duy nhất điều học viên quan tâm: dòng "Hoàn học phí: trung tâm
đang xử lý..." (chỉ hiện khi có, ngôn ngữ học viên); ưu đãi vẫn thấy trong khối Học phí. Chip
"đang đối soát" đổi thành "trung tâm đang xác nhận". Mục lục còn 13 mục.

**Hồ sơ 360 app quản trị hết cảnh "ít hơn trang học viên"**: 2 tab - "Hồ sơ nội bộ" (như cũ + bảng
ĐIỂM VÀO-GIỮA-RA đủ 4 kỹ năng + Overall + mục tiêu; thẻ Học phí thêm "Hẹn thu tiếp") và "Trang của
học viên" = nhúng NGUYÊN trang học viên vào hồ sơ (tái dùng renderTrangHV, không fork) - nhân viên
thấy đúng cái học viên thấy, thao tác được y như học viên khi hướng dẫn qua điện thoại.

**Rà sidebar sau luồng mới**: GIỮ NGUYÊN 7 nhóm menu V9.15 (không trang thừa/thiếu) - tính năng mới
đợt này đều nằm TRONG trang sẵn có (màn cổng, Cài đặt, hồ sơ 360, cổng HV).

Verify: _tall 37 trang 0 lỗi, icon 134 (font dựng lại: +ti-devices, ti-login-2, ti-plug-x, ti-eye),
node --check 2 file OK, _check11 68/68. LƯU Ý: bộ kiểm _check1.._check10 THẤT LẠC từ phiên trước
(chỉ còn _tall + _check11 trong _src) - tái tạo dần, đụng vùng nào viết lại bộ kiểm vùng đó.
PHÒNG 2 MÁY CHƯA TEST TRÊN 2 MÁY THẬT (phiên cloud không có trình duyệt) - Luân thử theo DEMO_CHECKLIST.

## V9.17 (28/07 chiều) - Room tự động + bong bóng việc mới + vá theo hội đồng 3 tester

**Room demo TỰ NỐI (Luân: "mặc định phải là kết nối được")**: bỏ hẳn mã phòng - mở bản demo là máy
tự vào chung một room (máy đầu làm trạm trung chuyển, trạm rớt thì các máy tự tranh làm trạm rồi nối
lại; có mạng lại là tự vào). Navbar CẢ 2 CỔNG có chip sống **"Room demo: nối N máy / chỉ máy này"**
+ nút **Reset demo**; ai cần demo riêng tư thì bấm "Ngắt room" (Cài đặt > Dữ liệu demo hoặc màn cổng).
Cổng học viên BỎ ô "Xem thử hồ sơ" thừa ở sidebar - chọn người đã có màn cổng.

**Bong bóng việc mới**: việc cần duyệt / cần xử lý phát sinh từ cổng khác hoặc máy khác nổ thẻ thông
báo góc phải dưới (so bellItems trước/sau đồng bộ, đúng phạm vi vai trò đang đăng nhập): ghi rõ
ai - việc gì, viền đỏ nếu quá hạn, bấm vào nhảy thẳng tới nơi xử lý, tự tắt 9 giây, tối đa 3 thẻ.

**Vá theo 3 tester (room sync / cổng HV / hồ sơ 360)** - các sạn thật đã sửa: room chống zombie bằng
thế hệ kết nối __roomGen, so mốc thời gian bản ghi (bản cũ không đè bản mới - 3 máy cùng sửa vẫn hội
tụ), reset chờ kênh kịp phát rồi mới reload + chặn bão reload, bản local-thắng được phát lại cho room;
cổng HV: notebar hoàn phí tắt khi đã hoàn + không hứa số tiền, lịch CHÍNH HÔM NAY không bị ẩn, bỏ tên
chặng CRM + "GV vào trễ" khỏi trang học viên, mục lục xếp đúng thứ tự trang; hồ sơ 360: bảng điểm
vào-giữa-ra không trộn 2 khóa, điểm 0 không thành "-", tab nhớ theo hồ sơ, nút mục lục cuộn được
trong tab nhúng.

Verify: _tall 37 trang 0 lỗi, node --check 2 file OK, _check11 68/68, icon 134 (+ti-bell-ringing).
Room + bong bóng chưa test trên trình duyệt/2 máy thật - Luân thử theo DEMO_CHECKLIST.

## V9.18 (28/07 tối) - Gộp Trang bắt đầu + Hành trình, node bấm được, Tra cứu mở rộng

**Gộp trang (Luân duyệt)**: "Hành trình học viên" gộp vào "Trang bắt đầu" thành MỘT trang 2 góc nhìn -
nút chuyển "Chạy quy trình" / "Bảng chặng - hành trình" ngay dưới dải khối; mọi đường link cũ tự về đúng
chỗ; menu Làm việc còn 1 mục; toàn bộ logic 2 trang giữ nguyên.

**Node hành trình hết "hiển thị cho có"**: bấm vào dải hạt trên bất kỳ dòng danh sách nào là mở drawer
"hành trình từng chặng" của đúng người đó - 13 mốc kèm thời điểm, chặng đang đứng, nhánh rẽ nếu có,
nút làm việc kế tiếp + xem hồ sơ.

**Tra cứu mở rộng theo yêu cầu Luân**: nhóm Tra cứu giờ có 17 mục xếp theo dòng nghiệp vụ - Học viên,
Sổ liên hệ, Sổ test đầu vào, Sổ tư vấn, Sổ đăng ký khóa, Sổ thu học phí, Sổ buổi học, Sổ điểm danh,
Sổ bài tập, Sổ WOW 1-1, Sổ kết thúc khóa, Sổ khảo sát, Sổ phản hồi, Sổ khiếu nại, Khóa học, Giảng viên,
Nhân viên. Toàn bộ là sổ CHỈ XEM (lọc + sắp xếp + phân trang); thao tác vẫn ở trang tác vụ theo chặng.

**Các chỉnh nhỏ**: tab Cài đặt > Dữ liệu demo tối giản (trạng thái 1 dòng + Reset demo + Ngắt room);
bỏ khối "Gửi phụ huynh" khỏi trang học viên; chip Đang học / Đã hoàn thành / Đã kết thúc đặc màu nổi bật;
nhật ký buổi học thành timeline có rail + node ngày (mờ dần với buổi đã qua); badge đếm trên menu nhỏ lại
để nhóm thu gọn không bị bóp chữ.

Verify: _tall 37 trang 0 lỗi, node --check 2 file OK, **_check11 = 82 điểm** (thêm 14 tiêu chí V9.18).

## V9.20 (28/07 tối) - MODULE GIAO VIỆC + CẤU HÌNH GIAO DIỆN

**Giao việc & Phối hợp (menu Làm việc > Giao việc)** - 3 kiểu việc theo đúng quan hệ trong công ty:
- **Giao việc** (cấp trên xuống cấp dưới) - mặc định BẮT BUỘC, người nhận không được từ chối.
- **Phối hợp** (ngang cấp) - hai bên cùng làm, chọn bắt buộc hay không.
- **Nhờ hỗ trợ** - không bắt buộc, người nhận có quyền từ chối kèm lý do.
App tự nhận diện kiểu việc theo chức danh + phòng ban của người nhận (vẫn đổi tay được).

**Vòng đời một việc**: Mới giao - Đang làm - Báo xong - Hoàn thành. Người nhận bấm Nhận việc rồi Báo xong
kèm kết quả; người giao Xác nhận hoặc Trả lại làm tiếp, có nút Nhắc và Hủy việc.

**Thảo luận ngay trong từng việc**: mỗi việc có luồng trao đổi riêng - hỏi đáp, báo vướng nằm đúng chỗ,
không trôi như tin nhắn Zalo. Mọi thao tác (nhận, báo xong, xác nhận, nhắc, trả lại) tự ghi một dòng vào
luồng nên đọc lại là thấy toàn bộ diễn biến.

**Thông báo & theo dõi**: việc mới, việc chưa bấm nhận quá hạn, việc tới hạn hôm nay, việc chờ mình xác
nhận đều vào chuông và nổ bong bóng góc màn hình; menu có badge đếm việc còn tồn của riêng mình.

**Tổng hợp & báo cáo**: bảng theo từng nhân viên (được giao / đang làm / quá hạn / đã xong / trễ hạn /
tỷ lệ đúng hạn), thống kê theo loại việc, và so sánh nhóm bắt buộc với nhóm không bắt buộc.

**Cấu hình giao diện (Cài đặt > Giao diện & Thương hiệu / Menu sidebar)**: đổi tên hiển thị, tên trung tâm,
tiêu đề tab trình duyệt, logo (tải ảnh lên hoặc dán link hoặc chữ tắt), màu chủ đạo và màu nhấn - áp ngay
toàn app; hotline/địa chỉ dùng cho phiếu in và tin nhắn. Tab Menu sidebar cho bật/tắt từng nhóm, từng mục
và đổi tên nhóm theo cách gọi của trung tâm. Có nút Về mặc định. Cấu hình đồng bộ sang các cửa sổ/máy khác.

Verify: 38 trang 0 lỗi, node --check 2 file, **_check11 = 110 điểm**, icon 144.

## V9.31 (29/07) - NHẬT KÝ THAO TÁC · HOÀN TÁC · TRANG NHANH HƠN

**Nhật ký thao tác (Cài đặt > Nhật ký thao tác)** - mọi lần ghi dữ liệu đều để lại một dòng: **ai**,
**lúc nào**, **bảng nào - dòng nào**, **ô nào đổi từ gì sang gì**, và **cửa ghi nào** gây ra. Lọc theo
bảng, lọc theo người, tìm theo từ khoá, xuất CSV. Tên ô hiện bằng tiếng Việt chứ không phải tên cột kỹ
thuật. Bản demo giữ 500 dòng gần nhất ngay trong trình duyệt (đổi ở Cài đặt > CH2, tham số
`auditLogKeep_rows`); nối sheet thật thì đây là bảng **DL25**.

**Ai đã sửa hồ sơ này** - ngay trong hồ sơ 360 của mỗi khách/học viên, cạnh Dòng thời gian. Dòng thời
gian kể chuyện nghiệp vụ (đã test, đã đóng tiền); khối này kể chuyện thao tác (ai bấm gì). Có nút mở
thẳng sang nhật ký đầy đủ đã lọc sẵn theo người đó.

**Hoàn tác** - làm xong một thao tác là hiện thanh **Hoàn tác** ở góc dưới bên phải trong ít giây (đổi ở
Cài đặt > CH2, tham số `undoWindow_seconds`); trong màn Nhật ký cũng lùi lại được bất kỳ lượt nào.
Lùi theo **lượt bấm**: một lượt đụng nhiều bảng thì lùi trọn cả lượt, không lùi nửa vời.
Nếu sau lượt đó đã có người sửa tiếp đúng dòng ấy, app **từ chối lùi** và nói rõ vì sao - để không đè
mất việc của người sau.

**Trang nhanh hơn** - Trang bắt đầu 20ms còn 7ms, Chạy quy trình 19ms còn 8ms, toàn bộ 38 trang 164ms
còn 107ms (đo trên dữ liệu demo 5.142 dòng). Không đổi gì về giao diện hay số liệu hiển thị.

Verify: `_tall` 38 trang 0 lỗi (170 icon), `_check15` 39, `_check17` 394, **`_check18` 126 (vẽ thật 76
trang/tab)**, `_checkdata` 27 luật / 6.277 lượt kiểm 0 lệch, `check_data.py` ĐẠT.

## V9.32 (29/07) - CHẠY THẬT TRÊN TRÌNH DUYỆT: 6 CHỖ ĐƯỢC VÁ

Lần đầu app được mở bằng trình duyệt thật để soi (396 lượt: 2 cổng × 3 khổ màn hình - điện thoại
390px, máy tính bảng 834px, máy tính 1440px). Sáu chỗ được sửa:

- **Ô nhắc màu vàng (notebar) hết bị bẻ vụn.** Câu nhắc trước đây bị cắt thành nhiều mảnh cách xa
  nhau; ô nhắc nào nhiều chữ đậm thì vỡ hẳn thành nhiều cột. Nay đọc liền mạch như một câu. Ảnh
  hưởng 83 ô nhắc trong app. Chip "Hẹn kế" trên Trang bắt đầu cũng vậy.
- **Mở demo không có mạng vẫn đúng font và đủ ảnh.** Font Montserrat và ảnh đại diện giáo viên
  trước đây tải từ máy chủ ngoài; nay nằm luôn trong file. Quan trọng hơn: ảnh đại diện cũ **gửi tên
  giáo viên ra máy chủ nước ngoài** mỗi lần mở trang - nay không gửi gì cả.
- **Ô tìm bấm trúng dễ hơn.** Trước đây chỉ vùng cao 15px ở giữa mới ăn; nay cả khung đều ăn.
- **Ô chọn hạn nộp bài không còn bị bóp trên điện thoại** (trước bị ép còn 15px, không bấm nổi).
- **Nút bánh răng "sửa ở đây" và các nút tròn to lên đủ ngưỡng bấm trúng** (22px → 24px), ô tích
  13px → 17px.

Kèm theo là bộ kiểm mới `_checkui.js` chạy trình duyệt thật trong quy trình kiểm - để những lỗi kiểu
này không quay lại.

## V9.34 (29/07) - TRỢ THỦ DẮT TỪNG BƯỚC, VÀ CẤU HÌNH ĐƯỢC

**Trợ thủ giờ dọn việc cùng bạn, không chỉ nhắc.** Bấm **Dọn từng bước** trong khối Trợ thủ (hoặc
vào Chạy hướng dẫn > *Dọn việc hôm nay*): app mở một hộp nhỏ neo ở góc dưới bên phải, đi theo bạn
qua mọi trang, mỗi lần một việc thật trong hàng chờ của chính bạn. Bấm **Làm việc này** là app mở
đúng màn thao tác; làm xong, việc rời khỏi hàng chờ thì app **tự nhảy sang việc kế** và đếm ngược
"còn N việc" cho tới lúc sạch. Không có nút "tôi đã làm rồi" - app chỉ tính là xong khi việc thật
sự biến mất khỏi hàng chờ.

**Cấu hình ở Cài đặt > Trợ thủ & Nhịp ngày:**
- Bật/tắt Trợ thủ cho cả trung tâm (từng người vẫn tự tắt riêng bằng nút bóng đèn).
- Mỗi lượt dọn bao nhiêu việc - chia nhỏ để nhân viên thấy về đích thay vì nhìn 40 việc rồi nản.
- Việc quá hạn có luôn xếp trước không.
- **Thứ tự dọn theo nhóm việc** - bấm mũi tên đổi chỗ Tuyển sinh / Tài chính / Học vụ / Giảng viên...
- **Nhịp ngày theo chức danh**: bật/tắt từng dòng, sửa lại câu chữ cho đúng cách gọi của trung tâm,
  đổi buổi (đầu ngày / trong ngày / cuối ngày), đổi thứ tự, và **thêm dòng riêng của trung tâm**.
  Dòng tự thêm được ghi rõ là "thói quen" - app không gắn mác đã xong cho nó, vì không có gì để đếm.

Kèm hai chỗ vá anh Luân báo: nhóm **Chờ duyệt** giờ mở đúng 6 tab (trước đây bấm mục nào cũng ra một
màn), và nút **Làm ngay** giờ chạy được ở cả 163/163 việc (trước đây 44 việc bấm không ra gì).

## V9.35 (29/07) - TRỢ THỦ VỀ MỘT GÓC, TRANG SẠCH LẠI

Hai khối "Nhịp ngày của bạn" và "Trợ thủ" trước đây nằm trên đầu mọi trang, đẩy nội dung chính
xuống dưới. Nay cả hai gom về **một nút tròn ở góc dưới bên phải** - trên nút luôn hiện số việc
đang chờ và số việc quá hạn.

Bấm vào nút, tấm trợ thủ bung ra:
- **Câu chào theo giờ, gọi đúng tên bạn**, kèm số việc đang chờ.
- **Việc kế tiếp**: tên việc, tên khách/học viên, hạn - và hai nút **Làm ngay** / **Để sau**.
- **Nhịp ngày rút thành 3 ô bấm được**: Đầu ngày / Trong ngày / Cuối ngày. Bấm ô nào thì mở danh
  sách việc của buổi đó ngay trong tấm; bấm một dòng là nhảy tới đúng trang.
- Nút **Dọn từng bước** để trợ thủ dắt bạn làm lần lượt cho tới khi hết việc.

Trong lúc đang dọn việc, bấm **Thu gọn** thì lượt dọn **vẫn còn nguyên** - nút góc dưới hiện "đang
dọn, còn N", bấm lại là về đúng việc đang làm dở. Và nếu bạn tự nhảy đi làm việc khác không theo
thứ tự, trợ thủ **tự cập nhật**: việc đã xong biến mất khỏi lượt, việc mới tự nối vào.

## V9.37 (29/07) - CÀI ĐẶT CHIA NHÓM, VÀ DUYỆT THÌ XEM ĐƯỢC HỒ SƠ

**Cài đặt hệ thống** trước đây là 13 tab xếp một hàng. Nay chia thành 5 nhóm theo đúng câu hỏi bạn
mang tới: **Giao diện** · **Quy tắc nghiệp vụ** · **Dắt việc & Hướng dẫn** · **Người & Quyền** ·
**Dữ liệu & Sổ sách**.

Nhóm *Dắt việc & Hướng dẫn* gom đủ ba thứ, mỗi thứ một tab riêng:
- **Trợ thủ** - bật/tắt, số việc mỗi lượt dọn, thứ tự dọn theo nhóm việc.
- **Nhịp ngày** - sửa từng dòng nhắc theo chức danh, đổi buổi, đổi thứ tự, thêm dòng của riêng
  trung tâm.
- **Bài hướng dẫn** (mới) - bật/tắt nút Chạy hướng dẫn, bật/tắt từng cấp độ và từng bài, chạy thử
  ngay tại chỗ. Bảng còn cho biết mỗi bài có **bao nhiêu bước app tự kiểm được** bạn đã làm hay
  chưa; bài chỉ để đọc thì ghi rõ là "chỉ đọc".

**Chỗ duyệt giờ xem được hồ sơ trước khi quyết.** Ba tab Chiết khấu / Hoàn tiền / Bàn giao lead
trước đây chỉ có con số và nút Duyệt - không có cách nào mở hồ sơ ra xem. Nay tên học viên/khách
bấm được ra ngăn kéo, và mỗi thẻ có nút **Hồ sơ 360** mở toàn bộ hành trình, tiền đã đóng, lớp,
phản hồi - xem rồi hẵng quyết.

## V9.38 (29/07) - XEM NHANH Ở MỌI BẢNG, KHÔNG PHẢI RỜI TRANG

Trước đây bấm nút ở một dòng danh sách là **nhảy sang trang hồ sơ đầy đủ** - mất chỗ đang đứng, xem
xong phải bấm quay lại, trong khi thường chỉ cần biết đúng vài con số. Nay nút ở mọi bảng là
**Xem nhanh**: mở ngăn kéo ngay tại chỗ với khóa - lớp, đã đóng, còn nợ, chuyên cần, lý do gắn cờ
nguy cơ. Cần sâu hơn thì ngay trong ngăn kéo có nút **Hồ sơ đầy đủ**.

Áp dụng cho cả 21 nút ở các bảng danh sách và cho thẻ ở **Chờ duyệt** (chiết khấu, hoàn tiền) - duyệt
xong khoản này là quyết được khoản kế, không phải đi ra đi vào.

---

## V9.40 - Máy tự thấy việc, không đợi ai bấm cờ (29/07)

### Học viên nguy cơ: máy đếm song song với người

Trước đây một học viên chỉ vào danh sách nguy cơ khi **có người mở hồ sơ và bấm gắn cờ**. Hai
ngưỡng trong Cài đặt (vắng không phép mấy buổi, thiếu mấy bài) chỉ được trang học viên tự xem đọc
tới - phía nhân viên không màn nào dùng. Chạy đúng luật đó trên dữ liệu thật: **19 em vượt ngưỡng,
chỉ 2 em được gắn cờ**.

Nay:
- Cờ tay **vẫn giữ** - người biết những chuyện máy không biết (hoàn cảnh gia đình, thái độ trên lớp).
- Máy đếm song song và nói ra. Việc mới **"Máy thấy nguy cơ - chưa gắn cờ"** hiện ở chuông, Trợ thủ
  và Việc hôm nay.
- Bấm vào ra **màn chăm học viên nguy cơ**: máy thấy gì (vắng mấy buổi / thiếu mấy bài, kèm ngưỡng
  bấm sửa được), chăm gần nhất bao lâu, **còn mấy lượt WOW chưa dùng** - và ba lối ra ngay tại đó:
  ghi lần chăm, đặt buổi WOW, gắn cờ.
- Không phải nguy cơ thật thì **tạm bỏ qua có lý do và có hạn**. Hết hạn máy nhắc lại. Không có "bỏ
  qua vĩnh viễn" - việc biến mất mà không ai biết vì sao là thứ làm hỏng cả hàng chờ.
- Việc "học viên nguy cơ" nay **leo thang theo lần chăm cuối**, không còn đỏ mãi bất kể đã chăm hay chưa.

### Lớp sắp khai giảng có đủ người không

Màn mới trả lời câu tốn tiền nhất của trung tâm. Việc tự sinh khi lớp còn trong cửa sổ theo dõi mà
sĩ số dưới mức tối thiểu (cả hai con số đều ở Cài đặt), và chuyển đỏ khi hết hạn cân nhắc.

Bấm vào ra: còn mấy ngày, thiếu mấy người, ai đã ghi danh, **lớp cùng khóa nào còn chỗ để dồn vào**,
và ba lối ra - lùi ngày khai giảng, gán/đổi giáo viên, hủy lớp (bắt ghi lý do, và cảnh báo trước số
học viên sẽ phải chuyển lớp hoặc hoàn tiền).

Kèm một việc nữa: **lớp sắp khai giảng mà chưa gán giáo viên chính**.

### Cơ sở của học viên tính theo nơi HỌC

Hồ sơ học viên ghi nơi **đăng ký** và không bao giờ đổi, nên lọc theo Cơ sở 3 ra 0 người dù cơ sở đó
đang có 13 em. Nay một học viên thuộc **cả hai**: nơi đăng ký (người tư vấn cũ vẫn theo được) và nơi
đang học (học vụ cơ sở đó thấy được). Ngăn kéo học viên nói rõ *"đăng ký Cơ sở 2 - đang học tại Cơ sở 1"*.
Lớp online không ràng buộc cơ sở nên không tính vào.

### Tải giảng viên cả đội (tab Giáo viên dự phòng)

Bảng so ngang toàn đội theo kỳ 30/60/90 ngày: buổi trong kỳ, **so với mức chia đều**, lớp đang giữ,
số cơ sở phải chạy, đã dạy tổng, trễ giờ, tỷ lệ buổi có nhận xét. Người **trống hoàn toàn** tô đỏ -
đó là chỗ nhận được lớp mới mà không phải tuyển thêm ai.

### Giáo viên WOW có việc thật

Giáo viên WOW giữ toàn bộ buổi WOW của trung tâm nhưng mở app buổi sáng thì mọi dòng nhịp ngày đều
bằng 0. Nay có nhịp ngày riêng (buổi WOW hôm nay · buổi mới đặt chờ xác nhận · buổi vừa dạy chưa ghi
nội dung · em không đến chưa ghi lý do), có panel buổi WOW hôm nay trên màn Hôm nay, có hai luật việc
mới, và **buổi WOW vào bảng công** với đơn giá riêng.

### Giáo viên biết hôm nay dạy ở đâu

Thẻ buổi dạy hôm nay nay in **cơ sở và phòng**; lớp online in **link phòng học bấm được**.

### Khối tiền

- **Nợ treo của học viên đã rời** tách khỏi Dự thu thành bảng riêng - tiền của người đã bỏ học không
  phải "tiền sắp về". Ba lối ra: thu dứt, hủy đơn, để nguyên nếu đang thương lượng.
- **Nhắc nợ có trí nhớ**: nút Copy tin Zalo ghi luôn lần nhắc. Khoản chưa tới hạn vừa nhắc thì tạm
  lùi; khoản **quá hạn vẫn giữ** trong hàng chờ, chỉ ghi thêm đã nhắc bao lâu.
- **Doanh thu nhân viên tư vấn** tính theo khách của người đó, không theo ai cầm tiền. Giữ thêm cột
  "tự tay thu" để kế toán đối chiếu quỹ.
- **Đối soát khoản thu** và **duyệt chiết khấu** nay leo thang theo thời gian chờ, không còn một màu.

### Danh mục khóa nói được khóa nào bán được

Thêm hai cột "Đơn đã bán" và "Doanh thu". Khóa chưa bán được đơn nào tô đỏ thay vì trông y hệt khóa
đang chạy tốt.

### Mọi việc đều bấm được

Trước đây 41/181 việc chỉ có nút "Hồ sơ" - trỏ sang hồ sơ 360 mà trang đó không có thao tác đang cần.
Nay **0/180**. Thêm màn cho: gọi hỏi thăm học viên vắng (ghi thẳng vào buổi), duyệt chiết khấu, giữ
chân học viên bảo lưu, xin cảm nhận. Riêng **chấm bài gom theo lớp và bài** - một dòng việc là một
lượt mở màn chấm cả lớp.

### Sửa lỗi

- **Hộp "Xác nhận thao tác" bị chôn dưới ngăn kéo** - mọi thao tác cần xác nhận mà bấm từ trong ngăn
  kéo hoặc từ Trợ thủ đều không bấm tới được nút Xác nhận, ở mọi khổ màn. Luồng khiếu nại vì thế
  không hoàn thành được.
- **Một cú bấm đánh dấu "đã tư vấn" mà không lập phiếu nào** - nay mở phiếu tư vấn, dấu chỉ đóng khi
  phiếu được lưu.
- **Trợ thủ đổ vào form thô** (12 ô của bảng gốc) trong khi màn đúng (3 ô + 3 lối thoát) đã có sẵn.
- **Hub Chờ duyệt có 3-4 ô thống kê bấm không tới** với hầu hết chức danh.
- **Học vụ mở app thấy "0 việc"** dù trang Xếp lớp đang có 12 việc - nay đáp thẳng vào Xếp lớp và có
  nút "chỉ việc của tôi".
- **Điểm danh** bỏ 3 hộp xác nhận thừa, thêm nút Lưu ngay dưới ô nhận xét (trước đây cách nhau 573px).

---

## V9.40b - Duyệt chiết khấu và đơn giá giờ dạy (29/07 chiều)

### Duyệt chiết khấu là việc của Trưởng phòng Tư vấn

Kế toán không còn nút duyệt - họ **xác nhận và thực hiện** theo quyết định. Cụ thể:

- Tab "Duyệt chiết khấu" chuyển sang Trưởng phòng / Leader Tư vấn.
- Việc "Duyệt chiết khấu" **không còn réo chuông** người không có quyền quyết.
- Ai không có quyền mà vào được thẻ chiết khấu thì thấy bản **chỉ đọc** kèm câu giải thích rõ việc
  này của ai - không phải một màn hình cụt không có nút.
- Cả hai nút Duyệt và Từ chối đều được **khóa ở cửa ghi**, không chỉ ẩn đi.

### Công giảng dạy tính theo giờ, đơn giá theo người và theo ca

Trước đây mọi buổi trả một giá như nhau, kể cả buổi 3 tiếng và buổi 1,5 tiếng. Nay:

**Tiền công = giờ dạy thật × đơn giá của ca đó**, trong đó giờ dạy thật lấy từ giờ vào lớp tới giờ
kết thúc buổi (chính là hai mốc giáo viên bấm khi Bắt đầu lớp / Kết thúc buổi).

**Màn mới: Cài đặt > Đơn giá giờ dạy** (nhóm Người & Quyền - để nhân sự tự sửa)

- **Bảng mặc định 6 ô**: ngày thường / cuối tuần × ca sáng / chiều / tối.
- **Bảng riêng từng giảng viên**: chọn người, điền ô nào cần khác. **Ô để trống nghĩa là ăn theo
  mặc định** - trong ô hiện mờ luôn số mặc định để khỏi phải nhớ.
- **Bảng "đang áp dụng cho cả đội"**: nhìn một phát thấy ai đang ăn mức nào. Ô in đậm là mức riêng,
  ô mờ là đang theo mặc định.
- Ranh giới ca (sáng / chiều / tối) cũng sửa được trong Cài đặt, không cắm cứng.

**Bảng công tháng** nay có cột **Giờ dạy** và **Chia theo ca** (ví dụ: "tối 10,5h × 200.000đ · CT
sáng 24h × 190.000đ") để kế toán đối chiếu mà không phải mở bảng giá.

Hai chỗ nói thẳng thay vì làm cho đẹp:

- Buổi đã dạy xong mà **quên bấm giờ vào / giờ kết thúc** thì không tính công được. Bảng đếm riêng
  "N buổi thiếu giờ" để kế toán đi hỏi, chứ không tự bịa một thời lượng mặc định rồi ra số đẹp mà sai.
- **Buổi WOW 1-1 vẫn tính theo buổi**, vì sổ WOW chỉ ghi ngày giờ đặt, không có giờ vào - giờ ra để
  nhân. Muốn tính WOW theo giờ thì phải ghi hai mốc đó cho buổi WOW trước đã.

---

## V9.40c - Buổi WOW quản lý chặt, ca test tính theo lần

### Buổi WOW 1-1 nay có giờ vào - giờ ra

Buổi WOW là quyền lợi đắt nhất bán kèm học phí, nhưng trước đây sổ WOW chỉ ghi **ngày giờ đặt** -
không biết buổi có thật sự diễn ra không, kèm được bao lâu, giáo viên có tới đúng giờ không.

Nay buổi WOW đi đúng vòng đời của buổi lớp:

- **Bắt đầu buổi** - ghi giờ vào và tự tính số phút trễ so với giờ hẹn.
- **Kết thúc buổi** - ghi giờ ra, chuyển sang đã dạy, và **lúc này mới trừ lượt WOW** của học viên.
- Thẻ buổi WOW hiện thẳng "vào - ra thật" kèm thời lượng; buổi nào ghi bù không có mốc thì nói rõ
  là không đối chiếu được.
- Nút "Ghi bù đã dạy" vẫn còn cho buổi hôm trước quên bấm - nhưng hộp xác nhận nói trước là buổi
  đó sẽ không có mốc giờ.

**Ba việc mới vào chuông:** buổi tới giờ mà chưa ai bấm bắt đầu · buổi bắt đầu rồi mà quên bấm kết
thúc (lượt chưa được trừ) · buổi ghi là đã dạy mà không có mốc giờ nào.

Trang WOW có thêm chỉ số **"Giờ kèm đã ghi nhận"**, kèm số buổi còn thiếu mốc.

### Ca test đầu vào: tính theo lần, vẫn ghi vào - ra

- Bấm "HV đã dự test" là **tự mở mốc giờ vào** - không phải học thao tác mới.
- Hết ca bấm **Kết thúc ca test** để ghi giờ ra.
- Tiền công ca test tính **theo lần** (cấu hình được), gán cho người chấm.
- Hai mốc giờ **không dùng để nhân đơn giá** - chúng để biết ca test kéo dài bao lâu, có đúng thời
  lượng đề thi không.

### Bảng công tháng nay tách ba loại công

| Loại | Cách tính |
|---|---|
| Buổi lớp | giờ dạy thật × đơn giá theo giảng viên và theo ca |
| Buổi WOW 1-1 | theo buổi - kèm cột giờ để đối chiếu |
| Ca test đầu vào | theo lần |

Giáo viên WOW từ chỗ không xuất hiện trong bảng công nào, nay có công thật.

---

## V9.40d - Người giám hộ và cổng phụ huynh

### Hồ sơ học viên nay có người giám hộ

SOP quy định phải ghi số điện thoại phụ huynh / người giám hộ. Ngăn kéo học viên nay hiện đủ:
tên, quan hệ, số điện thoại bấm gọi được, cùng giới tính và địa chỉ.

Kèm **hai quyết định** cho từng em:

- **Ai là đầu mối liên hệ chính** - gọi thẳng học viên, gọi người giám hộ, hay gọi cả hai.
- **Ai đóng học phí** - học viên tự đóng, người giám hộ đóng, hay công ty tài trợ.

Hai lựa chọn này không nằm im trong hồ sơ mà đổi cách app làm việc:

- Màn **gọi hỏi thăm học viên vắng** và màn **chăm học viên nguy cơ** hiện sẵn đúng số cần gọi.
- **Phiếu thu in đúng tên người nộp** - nếu người giám hộ là người đóng thì phiếu ghi tên họ, kèm
  dòng tên học viên riêng.
- **Tin nhắn nhắc học phí đổi cả xưng hô** - gửi phụ huynh thì "kính gửi phụ huynh… cho cháu",
  gửi học viên thì "bạn vui lòng…".

Em nào chưa có người giám hộ thì ngăn kéo nói rõ và có nút thêm ngay tại đó.

### Cổng phụ huynh

Phụ huynh vào **cùng cổng học viên**, ở chế độ riêng, bằng số điện thoại đã khai trong hồ sơ.
Ở màn chọn người, mỗi học viên có thêm nút **"Vào như phụ huynh"**.

**Phụ huynh thấy:** tình hình học tập, chuyên cần, điểm số, nhật ký từng buổi học, nhật ký buổi
WOW, học phí và lịch đóng đợt, khảo sát, chứng nhận.

**Phụ huynh KHÔNG thấy:** phần con trao đổi riêng với trung tâm và phần con góp ý riêng. Băng đầu
trang nói thẳng điều này - đó là kênh để các em nói thật, trung tâm giữ riêng.

Đầu trang chào đúng tên phụ huynh và ghi rõ đang xem trang của em nào, với tư cách gì.

### Bốn chỗ khác SOP có mà app còn thiếu

- **Trình độ lớp** hiện ở danh sách lớp và ngăn kéo lớp.
- **Giờ bắt đầu dự kiến của buổi** thành mốc chuẩn để tính giáo viên vào trễ.
- **Thang điểm** hiện trên ô chấm bài và được ghi lại khi chấm.
- **Học viên nói gì sau khi đóng khiếu nại** - có ô nhập khi đóng, và nếu để trống thì việc "hỏi
  lại học viên" vẫn nằm trong hàng chờ cho tới khi có câu trả lời.

## Phân quyền tầng ba - "được LÀM việc gì" (V9.41)

Trước đây app có hai tầng phân quyền: **thấy trang nào** và **thấy dữ liệu của ai**. Còn thiếu
tầng quan trọng nhất: **được làm việc gì**. SOP có hẳn bảng **CH3. Phân quyền** với 31 hành động,
trong đó 8 việc ghi rõ "Quản lý phê duyệt" - nhưng app chỉ khóa thật đúng một việc (duyệt chiết
khấu). Bảy việc còn lại ai mở được trang là bấm xong.

Nay tám việc đó bị chặn **ngay tại cửa ghi**, kèm câu nói rõ phải nhờ ai:

| Việc | Ai duyệt |
|---|---|
| Bàn giao lead khi NV nghỉ đột xuất | TP Tư vấn · TP Marketing |
| Áp dụng chiết khấu từ 1 triệu trở lên | TP Tư vấn |
| Xác nhận hoàn tiền | TP Kế toán · TP Tư vấn |
| Đổi lớp lần 2 trở đi (lần 1 miễn phí, Học vụ tự làm) | TP Học vụ |
| Phê duyệt WOW bổ sung miễn phí | TP Học vụ · TP WOW |
| Phê duyệt giải pháp khiếu nại | TP Học vụ |
| Phê duyệt bảo lưu khóa học | TP Học vụ |
| Cập nhật bảng giá khóa học | Ban Giám đốc |

SOP viết người duyệt là "các *_manager". Đọc nguyên văn thì trưởng phòng HR cũng chốt được hoàn
tiền - vô lý, nên mỗi việc khai rõ quản lý **nhóm nào** sở hữu nó.

Bảng này xem được ở **Cài đặt > Phân quyền & Phạm vi**, cột cuối cho biết chức danh đang xem có
được làm từng việc hay không.

## Ba chỉ số KPI mới - đủ 51 chỉ số theo bảng BC2 (V9.41)

- **LFR** - tỷ lệ học viên đang học có ghi chú theo dõi. Ngưỡng SOP: 100%.
- **APR** - tỷ lệ yêu cầu cần duyệt được duyệt **đúng hạn**. Ngưỡng SOP: ≥ 90%. Hồ sơ chưa duyệt
  mà còn trong hạn thì **không** bị tính là trượt - chưa vi phạm gì.
- **SS_ALL** - điểm hài lòng toàn trung tâm, gộp cả khảo sát định kỳ lẫn phản hồi lẻ (chỉ số SS cũ
  chỉ đọc khảo sát nên bỏ sót đúng nhóm khách chịu khó góp ý riêng). Ngưỡng SOP: ≥ 4.5.

## App nhắc đủ 93 tình huống trong sổ trigger của SOP (V9.41)

Sổ trigger HD3 mô tả 93 tình huống "khi nào thì phải nhắc việc gì". Trước V9.41 app sinh ra 50:
bộ máy nhắc việc **không có nhánh nào** cho học viên, buổi học và điểm danh, nên 21 mã SOP viết
cho ba bảng đó chưa bao giờ chạy. Nay app sinh 83 mã lúc chạy thật; 11 mã còn lại là nhãn trạng
thái "đã xong" nên không có việc gì để nhắc, và đã khai lý do trong bộ kiểm.

Đáng kể nhất là **năm mức can thiệp học viên nguy cơ** - SOP phân năm mức với năm hành động khác
hẳn nhau (họp 4 bên gấp · họp 3 bên trong 24h · họp 3 bên · đặt buổi WOW kèm · gọi trong 24-48h),
trước đây app gộp làm một "nguy cơ" chung. Một học viên chỉ nhận **một** việc - mức nặng nhất.

## Bảng việc của tôi - mỗi chức danh bốn con số đầu ca (V9.42)

SOP có năm bảng việc theo chức danh (BC5 NV Tư vấn · BC6 NV WOW · BC7 Giảng viên · BC8 Học vụ ·
BC9 Quản lý). Mỗi người đăng nhập, ngay trên trang đầu tiên họ đáp vào, sẽ thấy **bốn con số của
riêng mình** - bấm vào ô nào là mở đúng danh sách đó, không phải đi tìm.

| Chức danh | Bốn ô |
|---|---|
| NV Tư vấn / Marketing | Lead mới chưa LH · Lead đang khai thác · Test sắp tới · Tư vấn cần làm |
| NV WOW | Test chờ chấm · Test đã chấm · WOW sắp tới · WOW có tiến bộ (%) |
| Giảng viên | Buổi đã hoàn thành · Cần viết nhận xét buổi · Bài tập chờ chấm · HV nguy cơ học thuật |
| Học vụ | Nhập học chưa xong · Học viên nguy cơ · Phản hồi chờ phân loại · Khiếu nại đang xử lý |
| Kế toán | Đơn còn nợ phí · Phiếu thu chờ đối soát · Hoàn tiền chờ duyệt · Chiết khấu chờ duyệt |
| Nhóm hỗ trợ | Việc mới chờ nhận · Đang làm · Quá hạn · Chờ người giao xác nhận |
| Quản lý | Bảng của nhóm mình, **cộng thêm** dải "Chờ bạn phê duyệt" chỉ gồm việc CH3 giao cho nhóm đó |

Phụ chú mỗi ô ghi ngưỡng SOP kèm chip bánh răng mở thẳng ô cấu hình - thấy số xấu là sửa được ngay
tại chỗ, không phải nhớ tên tham số.

## Khối lượng việc theo nhân viên (V9.42)

Trang Báo cáo có thêm bảng **ai đang ôm bao nhiêu việc** - đếm việc CÒN MỞ của toàn đội theo sáu
cột: lead đang giữ, test chờ chấm, tư vấn dở, nhập học dở, khiếu nại, việc được giao. Ai vượt gần
gấp đôi mức chia đều thì tổng của họ tô đỏ. Đây là màn VH11 của SOP; trước đây app chỉ có bảng tải
riêng cho giảng viên.

## Danh sách học viên nói rõ nguy cơ nặng nhẹ (V9.42)

Ba cột mới theo bảng BC1 của SOP: **vắng mấy buổi · thiếu mấy bài · hoạt động cuối cách đây bao
lâu**. Ba con số này phải đếm từ bảng khác nên trước đây không có; thiếu chúng thì cờ "nguy cơ" chỉ
là một cái nhãn, người trực ca không biết chọn mức can thiệp nào trong năm mức SOP quy định.

## Mỗi chức danh một trợ thủ và một hướng dẫn riêng (V9.44)

**Nhịp ngày** - danh sách "hôm nay tôi phải làm gì", chia theo Đầu ngày / Trong ngày / Cuối ngày,
mỗi dòng có số việc còn tồn và nút đi thẳng tới đúng trang. Nay **đủ 8 nhóm vai**, 33 dòng:

| Nhóm | Số dòng | Ví dụ dòng |
|---|---|---|
| NV Tư vấn | 5 | gọi khách đã hẹn · nhận lead mới về trong đêm · chốt khách đã có kết quả test |
| Marketing | 5 | *(mới)* lead đêm qua về từ nguồn nào · lead chưa ai nhận · khơi lại kho khách cũ |
| Học vụ - CSKH | 5 | duyệt đơn xin nghỉ · xếp lớp cho HV đã đóng đủ · theo học viên nguy cơ |
| Giáo viên đứng lớp | 4 | buổi dạy hôm nay · điểm danh ngay khi vào lớp · ghi nhận xét buổi |
| Giáo viên WOW 1-1 | 4 | buổi WOW hôm nay · xác nhận buổi mới đặt · ghi nội dung buổi vừa dạy |
| Kế toán | 4 | đối soát khoản thu hôm qua · thu các đợt tới hạn · hàng chờ duyệt |
| Quản lý - Giám đốc | 5 | việc quá hạn toàn trung tâm · hàng chờ duyệt · KPI dưới ngưỡng |
| Nhóm hỗ trợ | 3 | *(mới)* nhận việc mới · làm và báo xong · việc quá hạn phải báo lại |

Mọi dòng **sửa được trong Cài đặt > Nhịp ngày**: đổi chữ, đổi buổi, đổi thứ tự, tắt dòng không hợp
với trung tâm mình, hoặc thêm dòng của riêng trung tâm. Trước V9.44 nhịp của NV WOW tồn tại nhưng
ô chọn chức danh không liệt kê nó nên **không có đường nào để sửa** - nay ô chọn sinh thẳng từ
danh mục nên không thể sót lần nữa.

**Bài hướng dẫn** - nay **12 bài / 66 bước**, ba cấp: Tham quan (hiểu app trong 2 phút) · Trải
nghiệm (một ngày của từng chức danh) · Chuyên nghiệp (người cấu hình). Cấp Trải nghiệm nay đủ tám
chức danh, thêm ba bài mới: **Một ngày của Giáo viên WOW**, **Một ngày của Marketing**, **Một ngày
của nhóm hỗ trợ**.

## Cổng phụ huynh có lối vào riêng (V9.45)

Phụ huynh và học viên **dùng chung một cổng**, khác nhau ở chế độ - nhưng nay chế độ phụ huynh có
địa chỉ riêng để không phải đi mò:

- Trang chủ demo có **ba cửa**: Cổng nhân viên · Trang học viên · **Cổng phụ huynh**.
- Địa chỉ trực tiếp: `cong-hoc-vien/?phuhuynh`.
- Màn chọn ở chế độ này chỉ hiện **những em đã khai số người giám hộ**, và có hai nút đổi vai
  "Tôi là học viên" / "Tôi là phụ huynh" để xem qua lại ngay tại chỗ.

## Màn Cài đặt tự giới thiệu - không ai phải tự bơi (V9.46)

App có **83 tham số nghiệp vụ trong 16 tab cài đặt**. Trước V9.46 mở Cài đặt là rơi thẳng vào bảng
tham số, nhóm đặt tên tùy hứng và xếp theo thứ tự ngẫu nhiên. Nay:

**Tab "Bắt đầu ở đây"** là tab mặc định - bản đồ của cả màn Cài đặt:
- **Việc hay làm nhất** - 8 lối tắt bấm là tới thẳng đúng ô: đổi hotline · ngưỡng nợ quá hạn ·
  mức chiết khấu phải duyệt · đơn giá giờ dạy · thêm nhân viên · đổi tên & logo · sửa lời nhắc
  việc · xem ai được làm gì.
- **Cả 16 tab xếp theo 5 nhóm**, mỗi tab một câu nói nó cai quản chuyện gì kèm **con số đếm thật**
  (83 tham số · 51 chỉ số KPI · số thông điệp · số danh mục · số nhân viên · số khóa…). Số đếm là
  hàm chạy lúc vẽ nên không bao giờ lệch với dữ liệu.

**Tab Ngưỡng & SLA (CH2)** - 83 tham số nay chia **17 nhóm xếp theo đúng hành trình SOP P1 → P10**:
- Mỗi nhóm có **một câu nói nó lo việc gì** (ví dụ nhóm *P6 · Học viên nguy cơ*: "Vắng mấy buổi
  hoặc thiếu mấy bài thì máy tự coi là có nguy cơ, bao lâu phải can thiệp, và 'tạm bỏ qua' thì máy
  im mấy ngày").
- Mỗi nhóm có hàng nút **"Đổi ở đây thì xem kết quả tại: …"** bấm sang thẳng màn hình sẽ đổi theo.
- **Ô tìm tham số**: gõ "hoàn tiền", "nguy cơ", "chiết khấu"… là lọc ngay theo tên máy, câu nghĩa
  hoặc tên nhóm; nhóm không còn dòng nào thì ẩn hẳn.

## Trợ lý - một nút, hỏi gì cũng ở đó (V9.48)

Trước bản này có **hai** nút tròn cạnh nhau: Trợ thủ (nhịp việc trong ngày) và Hỏi đáp. Đứng từ
phía người dùng thì cả hai đều là *hỏi cái gì đó rồi được chỉ việc* - không ai phân biệt được.
Nay gộp làm **một nút Trợ lý** ở góc phải dưới, tấm mở ra có ô hỏi ngay đầu.

**Hỏi về một học viên** - gõ tên hoặc số điện thoại:
- Hiện **thẻ nhận dạng** trước (đúng ai · lớp nào · số nào) để xác nhận không nhầm người.
- Rồi hỏi lại **bạn muốn biết gì**: hiện trạng · vì sao có cảnh báo · việc phải làm tiếp · học phí ·
  lịch học · liên hệ. Bấm một cái là **chỉ trả lời phần đó** - không đổ tất cả ra một lượt.
- Có nút **"Dắt tôi làm từng bước"** để chuyển thẳng sang chế độ hướng dẫn thao tác.

**Hỏi về app** - "đổi hotline ở đâu", "chỉnh ngưỡng nợ quá hạn" - trả lời kèm nút mở thẳng tới ô
đó, và **tô vàng đúng dòng** cho tới khi bạn rời màn (không tự tắt sau vài giây).

**Không dùng AI.** Câu trả lời đọc lại chính bộ luật app đang chấp hành (`naFor`, `msgText`,
`slaItems`, `stuRiskReasons`, `canAct`), nên không thể nói sai ngưỡng. Không hiểu câu hỏi thì nói
thẳng là chưa hiểu, đưa gợi ý, và **ghi vào sổ** để người quản trị bổ sung trong **Cài đặt > Hỏi đáp**.

## Form ghi: mở ra là dùng được ngay (V9.49)

Rà cả **81 form ghi** của app bằng máy, không vá lẻ. Bốn thứ đã sửa:

- **Ô chọn ngày không còn để trống.** Mỗi ô mở ra đã có sẵn giá trị **có nghĩa nghiệp vụ**, không
  phải "hôm nay" cho có: hẹn thu phần còn lại lấy theo hẹn đang có của đơn (chưa hẹn thì lấy kỳ ân
  hạn trong Cài đặt) · lùi khai giảng = ngày cũ cộng thêm một vòng quyết · đặt buổi WOW mặc định
  ngày mai và **không cho chọn ngày đã qua** · ngày chuyển khoản mặc định hôm nay và **không cho
  chọn ngày tương lai**.
- **Không form nào còn câm.** Mỗi form có một dòng nói điều bạn cần biết TRƯỚC khi bấm lưu - lưu
  xong chuyển gì, ai phải duyệt, hạn nào bắt đầu chạy. Ví dụ: giao lại lead thì đồng hồ SLA liên hệ
  tính lại từ đầu · bảo lưu khóa cần Quản lý duyệt · chiết khấu từ ngưỡng nào trở lên tự vào hàng
  chờ duyệt · chọn mức khiếu nại cao mà không xử kịp thì hồ sơ đỏ oan.
- **Bốn form chứng từ có chỗ tải ảnh/PDF**: hoàn tiền · đơn xin bảo lưu / nghỉ học · phiếu điểm
  test đầu vào · ảnh-clip cảm nhận học viên. File đính kèm được ghi vào đúng ghi chú của hồ sơ.
- **Mọi con số trong dòng hướng dẫn đều đọc từ Cài đặt**, không cắm cứng - đổi ngưỡng thì câu chữ
  đổi theo. (Nhân đó bắt được `slaSurveyReport_hours`: một luật nhắc việc chạy bằng số cắm cứng 48
  giờ vì Cài đặt chưa bao giờ khai tham số đó. Nay khai rồi, đổi được.)

## Học phí ở cổng học viên (V9.48)

Nút **"Tôi đã chuyển khoản"** nay cho:
- **Chọn đúng đợt** - danh sách liệt kê từng đợt kèm hạn · số tiền · nhãn ĐANG QUÁ HẠN; chọn đợt
  nào thì ô số tiền tự nhảy đúng phần còn lại của đợt đó. Có thêm lựa chọn *"Đóng trước cho nhiều
  đợt / số khác"*.
- **Nhập số tiền đã chuyển** và **đính kèm ảnh biên lai / màn hình chuyển khoản**.
- Đăng ký chưa chia đợt thì nói thẳng là chưa có bảng đợt, cứ nhập số tiền, kế toán ghi đúng chỗ.

## Trợ lý nối AI miễn phí - hỏi cả nghiệp vụ lẫn SOP (V9.51)

Trợ lý vốn trả lời bằng chính bộ luật app. Nay nối thêm được **một AI miễn phí** để giải thích
bằng lời người - hợp với câu kiểu *"vì sao SOP bắt gọi khách trong 15 phút"*, *"bảo lưu khóa thì
ai được duyệt"*, *"giải thích quy trình này cho em"*.

**Cách chia vai:**
- **Máy trả lời trước**, ngay lập tức, không chờ mạng. Mọi con số, mọi nút bấm, chế độ dắt từng
  bước đều từ bộ luật app - AI không được bịa nút hay bịa số.
- **AI chỉ diễn giải** phần bên dưới, đọc gói ngữ cảnh do chính app soạn: hồ sơ người được hỏi,
  ngưỡng SOP **kèm giá trị trung tâm đang áp**, câu nhắc việc, **bảng phân quyền** (ai được làm,
  ai phải duyệt), danh mục trạng thái.

**Bật ở Cài đặt > Hỏi đáp.** Bốn nhà cung cấp đều miễn phí:
| Nhà cung cấp | Lấy key ở đâu |
|---|---|
| Google Gemini | aistudio.google.com/apikey - tài khoản Google là đủ, không cần thẻ |
| Groq | console.groq.com/keys |
| OpenRouter | openrouter.ai/keys - chỉ dùng mẫu đuôi `:free` |
| Ollama (chạy tại máy) | không cần key - cài ollama.com, chạy `ollama run llama3.2` |

**Mặc định TẮT.** Chưa bật thì app không gửi gì ra ngoài. Key lưu trên máy bạn, không nhúng vào
bản demo. Muốn dữ liệu tuyệt đối không rời máy thì chọn Ollama.

## Màn chào phiên đầu (V9.51)

Lần đầu vào app trên một trình duyệt, màn chào mời bạn **chọn bài tham quan** hoặc **tự khám phá**,
và chỉ luôn hai thứ dễ bỏ sót: nút **Trợ lý** góc dưới bên phải, và nút **?** trên thanh tiêu đề để
xem lại hướng dẫn bất cứ lúc nào. Chỉ hiện một lần - reset dữ liệu demo không làm nó hiện lại.

## Bảng dài có "Xem tiếp" (V9.51)

Sáu bảng từng cắt cứng (chờ xác nhận thu tiền, việc chờ nhận, từng đợt còn phải thu, học viên nguy
cơ trong báo cáo, cột bảng chặng) nay **sổ dần 30 dòng một lần** và nói rõ còn bao nhiêu dòng nữa.

## Sửa đoạn gợi ý tại chỗ (V9.51)

**Cài đặt > Đoạn gợi ý trên màn hình**: 17 đoạn hướng dẫn tĩnh trong app sửa được, áp ngay khắp
nơi, đi theo cấu hình nên reset dữ liệu demo không mất. Đoạn nào có con số sống (ngưỡng, hạn) thì
không nằm ở đây - số đó sửa ở Ngưỡng & SLA hoặc Thông điệp CH4.

## Bấm bánh răng là sửa ngay tại chỗ (V9.54)

Từ trước tới nay bấm cái bánh răng nhỏ bên cạnh một con số (hạn SLA, ngưỡng KPI, câu nhắc việc,
danh mục lựa chọn) là app đưa bạn sang trang **Cài đặt**. Sửa xong lại phải tự tìm đường về chỗ
đang làm dở.

Nay bấm bánh răng mở một **ngăn kéo ngay trên màn hình đang đứng**:

- Ngăn kéo nói rõ đang sửa cái gì, số đó chi phối chuyện gì, đổi xong màn nào tính lại theo.
- Sửa - bấm **Lưu & áp dụng** - ngăn kéo đóng, màn hình cũ vẽ lại với số mới. Bạn không đi đâu cả.
- Ai muốn xem cả nhóm tham số thì trong ngăn kéo vẫn có nút **Mở trang Cài đặt**.

Bốn loại bánh răng đều vậy: **ngưỡng & SLA** (CH2) · **câu nhắc việc** (CH4) · **ngưỡng chỉ số
KPI** (CH6) · **danh mục lựa chọn** (CH1). Riêng danh mục, ngăn kéo chỉ cho đổi *nhãn* - thêm hay
xoá một giá trị thì vẫn phải sang trang Cài đặt, vì ở đó app còn hỏi bạn "có đổi luôn N dòng dữ
liệu đang dùng giá trị này không".

Không muốn thấy bánh răng ở đâu cả? **Cài đặt > Giao diện > Hiện bánh răng trỏ cấu hình** - tắt
là mọi bánh răng biến mất, chỉ còn con số.

## Mỗi chặng để lại cái gì - và cách xem trọn hành trình một người (V9.54)

Dải hạt tròn cạnh tên mỗi người là **bản đồ vòng đời** của người đó. Trước đây rê chuột vào chỉ
biết "bước 3/7 - đã qua". Nay:

- **Rê vào một hạt**: câu chú thích kể luôn chặng đó *để lại gì thật trong hồ sơ* - ví dụ
  "Bước 5/7 · Có KQ, chờ tư vấn - đã qua · để lại: Điểm tổng (overall): 6.0 · L/R/W/S: 6/6.5/5.5/6".
- **Bấm vào một hạt**: mở ngăn kéo của **đúng chặng đó** - chặng này để làm gì, bước vào lúc nào,
  nằm ở đó bao lâu, hạn theo SOP là bao nhiêu (bấm bánh răng sửa được ngay), **toàn bộ sản phẩm**
  chặng đó để lại, và việc cần làm tiếp theo SOP.
- **Bấm vào chữ C1/C2/C3/C4 đầu dải**: mở **cả hành trình** - mọi chặng từ đầu tới cuối, chặng nào
  đã qua thì kể sản phẩm và thời gian nằm ở đó, bấm một dòng là xem chi tiết chặng đó.

Cả 17 chặng đều khai sản phẩm, kể cả các nhánh rẽ (chưa gặp được, đã mất, bảo lưu/bỏ học, đăng ký
đã hủy) - nhánh rẽ cũng có sản phẩm: một quyết định và lý do của nó.

## Con số nào cũng nói được nó ở đâu ra (V9.54)

Mọi con số phần trăm trên app - trên thẻ thống kê, trong bảng, trên lưới KPI, trong phễu chuyển
đổi - **rê chuột vào là biết cách tính**:

- "84% = 42/50 lượt điểm danh có mặt"
- "Tỷ lệ chuyển đổi lead · Đang là 43% (81/190 lead đã thành học viên) · Ngưỡng đạt: ≥ 40% · Cách
  tính: DL02 lead_status = converted trên tổng lead trong kỳ"
- Mẫu số bằng 0 thì nói thẳng "Chưa có buổi nào nên chưa tính được tỷ lệ", không hiện số giả.

Ô nào in **ngưỡng** (mức phải đạt) thay vì số đo thì chú thích nói rõ "Đây là NGƯỠNG PHẢI ĐẠT,
không phải số đo hiện tại" - để không ai đọc nhầm thành hiện trạng.

## Bấm vào thẻ thì biết trước nó dẫn đi đâu (V9.54)

Thẻ thống kê nay nói đúng việc nó làm khi bấm: *"Bấm để lọc danh sách bên dưới"* (ở lại trang) hay
*"Bấm để mở trang Buổi WOW 1-1"* (đổi trang) hay *"Bấm để xem nhanh ngay tại đây"* (mở ngăn kéo).

Và **bấm vào TÊN người ở bất kỳ bảng nào cũng mở ngăn kéo xem nhanh**, không đổi trang nữa. Muốn
mở hồ sơ đầy đủ thì bấm nút trong ngăn kéo.

## Thẻ số ở đầu trang: chọn hiện/ẩn, và ghi chú sửa được (V9.59)

**Thẻ chỉ để XEM, không bấm.** Việc lọc danh sách đã có thanh lọc ngay dưới thẻ lo - hai chỗ cùng
làm một việc chỉ làm rối. Đổi lại, **rê chuột vào thẻ là có câu chú thích đầy đủ**: con số đó đếm
cái gì, và muốn xem danh sách thì bấm vào đâu.

**Chọn thẻ nào hiện, y như chọn cột của bảng.** Trên mỗi dải thẻ có nút **"Thẻ (n/N)"** ở góc phải:
bấm ra danh sách, tích/bỏ tích từng thẻ. Trang tự cập nhật ngay, không nhảy đi đâu, không mất bộ
lọc đang chọn.

**Sửa câu chú thích:** Cài đặt → **Thẻ trên các trang**. Ở đó liệt kê đủ 104 thẻ theo từng trang,
mỗi thẻ có ô tích hiện/ẩn và ô nhập câu chú thích. Sửa xong bấm Lưu là áp ngay khắp app; muốn quay
lại thì bấm "Về mặc định".

Cả hai thứ - **thẻ nào hiện** và **chú thích ghi gì** - nằm trong cấu hình, nên **reset dữ liệu
demo không xoá mất**.

> Riêng dải **"Việc cần xử lý hôm nay"** theo chức danh thì vẫn bấm được - đó không phải thẻ, đó là
> **hàng chờ việc**: mỗi ô là một danh sách phải mở ra làm.

## Dữ liệu demo sống ở mọi cơ sở và mọi ngày (V9.59)

Bấm **Reset dữ liệu demo** là dữ liệu trở lại như vừa tạo: mốc thời gian được kéo về hôm nay, và
**cấu hình thì giữ nguyên** (cấu hình không phải dữ liệu demo).

Từ bản này dữ liệu nền cũng được gieo lại cho đủ:
- **Cả 5 chi nhánh và lớp online** đều có học viên đang học và lớp đang chạy - trước đây chỉ Cơ sở
  1, Cơ sở 2 và Online có người, nên quản lý Cơ sở 3/4/5 mở app ra là màn trắng.
- **Học viên đứng đúng cơ sở của lớp mình học**, nên lọc theo cơ sở ra đúng người.
- **Mọi ngày trong hai tuần tới đều có việc**: hẹn liên hệ, buổi WOW, ca test - trước đây chỉ gieo
  trong 6 ngày, mở demo sau một tuần là bàn trực trống trơn.
- App tự kéo mốc thời gian khi dữ liệu cũ hơn **7 ngày** (trước là 14). Ngưỡng này ở Cài đặt →
  Ngưỡng & SLA, tên `demoAutoShift_days`.

## Đồng bộ nhiều máy: cứ chạy, không bày ra nữa (V9.59)

Mở bản demo trên nhiều máy thì các máy **tự đồng bộ dữ liệu với nhau** như trước - không cần mã
phòng, không cần bật gì. Khác biệt của bản này: **app không còn hiện thông tin về việc đó nữa** -
không còn chip "Room demo" ở thanh tiêu đề, không còn dòng trạng thái, không còn nút Ngắt/Nối lại.

Trong Cài đặt → **Dữ liệu demo** vẫn còn: nút **Reset demo**, nút **Kiểm tra đồng bộ** (bấm ở một
cửa sổ, cửa sổ/máy kia phải hiện thông báo trong 1-2 giây) và phần **Mốc thời gian của dữ liệu
demo**.

## Cổng nhân viên: đúng bộ phận, đúng màn (V9.60)

Cổng nhân viên nay chỉ còn các bộ phận **thật sự có việc trong SOP**: Tư vấn · Marketing · Học vụ ·
Giáo viên ACA · Giáo viên WOW · Kế toán · Nhân sự · Ban Giám đốc, cộng tài khoản **Quản trị viên**
(vai quản trị hệ thống). IT, Bảo vệ, Tạp vụ không còn trong danh sách đăng nhập.

Mỗi chức danh chỉ thấy màn của mình:
- **Nhân sự**: Danh sách nhân viên · Bảng công giảng dạy · Giao việc nội bộ. Không thấy học viên,
  không thấy doanh thu, không vào Cài đặt.
- **Marketing**: lead, chăm lại khách cũ, mã giới thiệu. Không thấy trang Báo cáo tài chính.
- **Giáo viên WOW**: thêm tab Test đầu vào - vì SOP giao việc chấm test cho họ.

Mỗi chức danh đều có **bảng việc riêng** ngay trên trang đáp của mình (trước đây Tư vấn, Học vụ và
Ban Giám đốc không thấy bảng của họ), có **nhịp ngày** và có **bài hướng dẫn riêng**.

Trên trang Tuyển sinh và Học tập & Giảng dạy: **hàng chọn chặng nằm trên**, thẻ của chặng nằm dưới.

## Bật/tắt được bất cứ trang nào, cho bất cứ chức danh nào (V9.61)

**Cài đặt → Phân quyền & Phạm vi** nay có đủ **ba tầng**, và cả ba đều nhìn thấy được:

1. **Thấy trang nào** - bảng mới: cột là nhóm chức danh, dòng là trang, bỏ tích là chức danh đó
   mất mục đó trên menu (mở thẳng địa chỉ cũng bị chặn). Ô nào bạn sửa khác mặc định sẽ có **viền
   vàng**, và luôn có nút **trả về mặc định** cho từng nhóm hoặc cho toàn bộ.
2. **Thấy dữ liệu của ai** - phạm vi: cả trung tâm / chi nhánh / chỉ của tôi.
3. **Được làm việc gì** - bảng CH3 chép nguyên văn từ SOP.

Ba điều nên nhớ khi chỉnh tầng 1:
- Rê chuột vào ô sẽ thấy ô đó có phải **trang đáp** của chức danh không. Tắt trang đáp thì app tự
  cho họ đáp vào trang khác còn bật - không ai bị rơi vào màn trắng.
- **Bật một trang không có nghĩa là được ghi.** Cửa ghi vẫn do bảng CH3 chặn.
- Lựa chọn nằm trong cấu hình nên **reset dữ liệu demo không xoá mất**.

## Thẻ là đồng hồ, không phải cái nút (V9.61)

Từ bản này **không còn ô nào trên app bấm được để lọc** - kể cả dải "Bảng NV Tư vấn / Bảng Kế
toán…" theo chức danh. Lý do đo được: 15 trong 32 ô của dải đó bấm ra đúng cùng một chỗ với một ô
khác trong chính dải đó (hai ô khác số, một danh sách y hệt).

Đổi lại, **rê chuột vào ô nào cũng có câu chú thích** nói nó đếm gì và mở trang/tab nào để xem
danh sách; và mọi ô đều **ẩn/hiện được** qua nút "Thẻ (n/N)" hoặc Cài đặt → Thẻ trên các trang.

## Khoá những chỗ sửa được (V9.62)

Bản demo mở sẵn ở **tài khoản Quản trị viên** để xem được toàn bộ chức năng. Các chức danh khác
vẫn hiện ra ở cổng đăng nhập - để biết app phân vai thế nào - nhưng **mờ đi và tạm khoá**. Muốn mở
lại: Cài đặt → Phân quyền & Phạm vi → bỏ tích **"Khoá chọn chức danh ở cổng nhân viên"**.

**Bấm vào trang Cài đặt sẽ được hỏi vào theo cách nào:**
- **Chỉ trải nghiệm** - sửa thoải mái, kết quả hiện ngay trên màn, nhưng **không lưu lại**. Đóng
  trình duyệt là mọi thứ về như cũ. Ai cũng vào được.
- **Cổng thực** - sửa và lưu thật, cần **mật khẩu quản trị** (mặc định `mittomap`).

Đang ở chế độ nào thì có dải báo ngay đầu trang Cài đặt, kèm nút đổi chế độ.

**Nút Reset dữ liệu demo** cũng phải nhập mật khẩu quản trị.

Đổi mật khẩu: Cài đặt → Phân quyền & Phạm vi → ô **Mật khẩu quản trị**.

> Lưu ý thật lòng: bản demo này chạy hẳn trong trình duyệt nên mật khẩu nằm ngay trong file - nó là
> **cái chốt cửa** để người xem không lỡ tay sửa, **không phải khoá an ninh**. Khi nối máy chủ thật
> thì việc kiểm mật khẩu sẽ chuyển sang máy chủ.

## Ba cổng đi lại được với nhau (V9.63)

Bản demo có ba cổng: **Cổng nhân viên**, **Cổng học viên**, **Cổng phụ huynh**. Trước đây muốn
nhảy qua lại phải quay ra trang chủ bản demo.

Nay trên thanh trên của **cả ba cổng** có nút **Đổi cổng** (biểu tượng hai mũi tên). Bấm vào mở
ngăn kéo liệt kê ba cổng, kèm một dòng mô tả mỗi cổng làm gì; cổng bạn đang đứng thì mờ đi và
không bấm được. Ba cổng dùng chung một bộ dữ liệu demo nên đổi qua lại bao nhiêu lần số liệu vẫn
là một.

Địa chỉ được tính theo cách trang đang mở, nên nút chạy đúng cả khi bạn mở file trên máy lẫn khi
mở bản demo trên mạng.

## Cổng học viên có thanh trên (V9.63)

Trước đây thanh trên của cổng học viên chỉ hiện trên điện thoại. Nay hiện ở mọi khổ màn:

- **Bên trái**: nút mở mục lục (chỉ trên điện thoại).
- **Ở giữa**: tên cổng, **mục bạn đang đọc** (cuộn tới đâu đổi tới đó) và tên người đang xem.
- **Bên phải**: gọi trung tâm (chỉ hiện khi đã điền hotline trong Cài đặt), Đổi cổng, Đổi người
  đang xem, Reset demo.

Nút "Đổi người" đã rời khỏi mục lục bên trái để không nằm hai chỗ.

## Yêu cầu học viên gửi lên nằm ở đâu (V9.63)

Học viên gửi yêu cầu / câu hỏi được từ lúc có cổng vào, ở bất kỳ chặng nào - nên nghiệp vụ này
không thuộc chặng C1-C4. Nó nằm ở **hub CSKH · Khảo sát & Phản hồi**, tab **Yêu cầu từ học viên**,
bên cạnh hai kênh vào sẵn có là Góp ý và Khiếu nại.

Hệ thống tự chuyển yêu cầu tới **học vụ**, riêng yêu cầu về tiền thì tới **kế toán**, kèm hạn nhận
việc lấy theo tham số `slaTaskAccept_hours`. Người nhận thấy nó ở bốn chỗ: ô **Yêu cầu học viên gửi
tới** trên bảng việc đầu ca, tab nói trên, menu **Giao việc** và hàng **Việc chờ nhận**, cùng
chuông cảnh báo khi quá hạn. Nhận và trả lời ngay trên thẻ việc.

## Cột menu kéo được (V9.63)

Cột menu bên trái của cổng nhân viên rộng 262px. Rê chuột vào mép phải của nó sẽ thấy tay kéo -
kéo để đổi độ rộng (trong khoảng 210-420px), **bấm đúp để về mặc định**. Độ rộng nhớ theo từng
người trên máy đó. Trên điện thoại menu là lớp phủ trượt ra nên không có tay kéo.

## Yêu cầu học viên hiện ở đâu (V9.63)

Học viên liên hệ được ở bất kỳ chặng nào, nên yêu cầu của họ xuất hiện ở **ba chỗ**, cùng đọc
một bảng dữ liệu:

1. **Việc hôm nay** - bộ phận **CSKH**, ba nhóm riêng: *Yêu cầu học viên gửi tới*, *Yêu cầu học
   viên quá hạn nhận*, *Yêu cầu học viên tới hạn hôm nay*. Quá hạn thì nhảy lên đầu danh sách
   "Quá hạn - làm ngay" như mọi việc trễ khác.
2. **Bảng việc đầu ca** của học vụ và kế toán - ô *Yêu cầu học viên gửi tới*.
3. **Hub CSKH**, tab *Yêu cầu từ học viên* - xem cả kênh theo ngữ cảnh hai chiều.

Bấm ở chỗ nào cũng mở đúng một thẻ việc, nhận và trả lời ngay tại đó.

Ai thấy gì: người được chuyển yêu cầu thấy yêu cầu của mình; quản trị viên thấy tất cả yêu cầu
học viên cộng các việc nội bộ đã quá hạn.

## Bộ lọc: mọi danh sách đều lọc được (V9.64)

Trước đây chỉ trang nghiệp vụ mới có nút **Bộ lọc**; 13 sổ trong nhóm *Tra cứu* chỉ có ô tìm chữ.
Nay **mọi trang danh sách đều có**, và trục lọc sinh ra theo ba nấc:

1. **Trục khai riêng** cho trang đó - giàu nhất, có trục tính chéo bảng (vd lọc học viên theo
   *nơi đang học* chứ không chỉ nơi đăng ký).
2. **Trục mượn của trang nghiệp vụ cùng bảng** - *Sổ khiếu nại* mượn trục của trang *Xử lý khiếu
   nại*, nên lọc được theo **loại khiếu nại**, mức độ, kênh, lớp, ngày tiếp nhận.
3. **Trục tự sinh từ cột đang hiện** - cột nào là trạng thái/phân loại hoặc mốc thời gian thì lọc
   được theo cột đó. Thêm cột vào bảng là **tự có** trục lọc, bỏ cột đi thì trục tự mất.

Cột mã không sinh trục (lọc theo mã thì mỗi giá trị đúng một dòng, vô nghĩa).

## Thanh công cụ hai tầng (V9.64)

Trang danh sách nay có hai tầng, ngăn cách rõ:
- **Tầng trên** - thứ thay đổi theo dữ liệu: ô tìm và dải chip lọc trạng thái (hôm nay 4 chip,
  mai 11 chip).
- **Tầng dưới** - bộ công cụ cố định: số dòng, **Xuất**, **Bộ lọc**, **Xóa lọc**, **Cột**.

Trước đây tất cả nằm chung một hàng nên chip đẩy tới đâu thì nút Xuất trôi tới đó - mỗi trang một
chỗ khác nhau. Nay công cụ đứng yên ở mọi trang, mọi cỡ dữ liệu.

## Bảng công giảng dạy nằm ở trang Giảng viên (V9.64)

Trước đây nó là tab thứ ba của **Sổ thu học phí**, gộp vì "cùng là tiền". Nhưng sổ thu là tiền
**học viên đóng vào**, còn bảng công là **giờ dạy của giảng viên** - khác người, khác việc, khác
người dùng. Nay bảng công là tab của trang **Giảng viên**, đứng cạnh chính những người nó tính
công. Các lối vào cũ (ô thẻ *Buổi thiếu mốc giờ vào/ra*, Trợ lý, nhịp ngày, hướng dẫn) tự dẫn
tới đúng chỗ mới.

## Bàn giao lead: chuyển hẳn hay bàn giao tạm (V9.64)

Màn **Bàn giao lead** có thêm ô **Trả lại ngày**:
- **Để trống** = chuyển hẳn, lead thuộc về người mới.
- **Điền ngày** = bàn giao **tạm** (dùng khi nhân viên nghỉ phép, nghỉ ốm). Hết ngày đó lead
  **tự quay về** nhân viên cũ, không ai phải nhớ. Trong lúc đang tạm, hồ sơ lead hiện một dòng
  nhắc nói rõ sẽ quay về ai và từ ngày nào.

Mọi lần bàn giao đều ghi một dòng lịch sử: ai chuyển, chuyển cho ai, lúc nào, tạm hay hẳn.
Giao lại **từng lead** (trong hồ sơ lead) và giao **hàng loạt** (màn này) dùng chung một cửa ghi.

## Số tiền và số cấu hình (V9.64)

Mọi số tiền hiện trên app đều có **dấu chấm phân nhóm nghìn** (1.000.000đ). Quy tắc nằm ở một chỗ:
tham số nào khai đơn vị là `đ` / `VND` thì con số tự được định dạng - thêm tham số tiền mới vào
Cài đặt không phải làm gì thêm.

Số **lần đổi lớp được miễn duyệt** nay là tham số (Cài đặt, nhóm *P5 · Xếp lớp & nhập học*).
Đổi số này thì cả ba nơi đổi theo cùng lúc: ô thẻ *Đổi lớp từ N lần* ở Bảng Quản lý, cửa chặn khi
học vụ bấm đổi lớp, và câu giải thích trên thẻ.

## Ô chọn dài gõ để tìm (V9.91)

Ô chọn nào có từ 12 lựa chọn trở lên (học viên, lớp, nhân sự, đăng ký...) tự thành **ô gõ để
tìm**: gõ vài chữ là danh sách thu lại, bấm một dòng là chọn xong. Bỏ dấu vẫn ra - gõ "nguyen"
tìm được "Nguyễn". Mỗi lần chỉ hiện 40 dòng đầu, còn lại app nhắc gõ thêm cho hẹp.

Áp dụng ở **mọi form**, kể cả form dựng sau này - việc nâng cấp diễn ra ngay lúc màn hình vẽ ra,
không phải khai từng ô.

## Đăng nhập theo chức danh (V9.91)

Cổng nhân viên mặc định cho **chọn chức danh rồi chọn tên mình**. Mỗi vị trí thấy một phần việc
và một phạm vi dữ liệu khác nhau - Leader chi nhánh chỉ thấy dữ liệu cơ sở mình, trưởng phòng
thấy cả phòng, giám đốc thấy toàn hệ thống.

Muốn khoá lại (mọi người vào thẳng Quản trị viên, hợp cho buổi trình chiếu): **Cài đặt → Phân
quyền & Phạm vi → Khoá chọn chức danh ở cổng nhân viên**.

## Báo lỗi & góp ý (V9.98 - thay cho trang "Ghi nhận góp ý" của V9.92)

Nút **hình loa** trên thanh trên mở thẳng một **bảng Google Sheet dùng chung** ở tab mới. Cả trung
tâm ghi vào một bảng, anh Luân mở ra là thấy hết - không ai phải gom tệp của ai.

Địa chỉ bảng **sửa được trong Cài đặt > Giao diện** ("Bảng góp ý / báo lỗi mở ra đâu"). Để trống là
dùng bảng mặc định.

**Vì sao bỏ trang cũ:** V9.92 từng có hẳn một trang "Ghi nhận góp ý" trong menu Điều hành. Nhưng bản
demo chạy trọn trong trình duyệt, không có máy chủ - phiếu góp ý nằm trong `localStorage` của từng
máy, nên mỗi người chỉ thấy phiếu của chính mình; muốn tổng hợp phải Xuất tệp, gửi đi, rồi người kia
Nhập vào. Cả một thủ tục cho việc đáng lẽ chỉ là gõ một dòng. Google Sheet giải đúng chỗ đó.

## Đổi cổng / đổi người - một cửa (V9.98)

Nút **đổi cổng** trên thanh trên nay mở ngăn kéo **"Đổi cổng / đổi người"** gồm ba phần: bản đang xem
(chỉ ở cổng nhân viên), ba cổng, và **người đang đăng nhập** kèm nút *Đăng nhập bằng người khác*.

**Khối tên ở đáy menu giữ nguyên**, nhưng nay bấm vào là sang **Trang cá nhân** - đúng thứ nó đang
nói. Trước đây nó là chỗ đổi người: trông như một cái nút mà bấm vào lại văng ra màn đăng nhập,
không ai đoán được, và nó nằm xa nút đổi cổng trong khi cả hai cùng trả lời một câu hỏi - *"tôi muốn
nhìn app bằng mắt của ai"*.

---

# Cập nhật V9.99z5 / z6 — sidebar là bản đồ đủ mục, nhịp ngày về đúng chỗ, chuỗi việc khép kín

## Menu trái đọc ra ba tầng: chặng > hub > tab
Mỗi **tab** bên trong một hub nay đều có **một mục trên menu**. Trước bản này hub "Học tập &
Giảng dạy" có 7 tab mà menu chỉ dẫn tới 3 (GV dự phòng · Phòng học · Buổi WOW); hub "CSKH ·
Khảo sát & Phản hồi" có 4 tab mà menu chỉ có tên hub. Thiếu một mục là mất một chỗ trên bản đồ:
người dùng biết màn hình ấy tồn tại nhưng không có đường tìm lại.

- Mục mới trên menu: **Buổi hôm nay · Lịch tuần · Lớp học · Nhận xét buổi** (hub Học tập) và
  **Khảo sát · Phản hồi / Góp ý · Khiếu nại** (hub CSKH).
- Thứ tự các mục con xếp **đúng thứ tự thanh tab** của hub, để menu và màn hình đọc như nhau.
- Ba bậc thụt: "Bản đồ chặng" thụt nhẹ, mục nghiệp vụ trong chặng thụt một bậc, tab của hub
  thụt thêm một bậc nữa.
- Bấm vào **tên hub** thì hub mở tab mặc định, mục con ứng với tab ấy sáng, và hàng của hub
  sáng mờ (biết mình đang ở đâu đó trong nhóm này).

## Nhịp ngày của bạn — nằm ở trang Việc hôm nay
Nhịp ngày theo chức danh (đầu ngày · trong ngày · cuối ngày) nay hiện ngay trên trang **Việc hôm
nay**. Hai loại dòng không trộn: **hàng chờ** có số đếm (hết thì ghi "xong"), **thói quen** ghi
"nên xem" và không bao giờ được gắn mác xong.

## Trang Quản lý việc giao & nhận — nhóm lọc "Chờ tôi xác nhận"
Ô số *"Chờ tôi xác nhận (N)"* nay dẫn vào đúng nhóm lọc chứa N việc ấy. Trước đây nó dẫn sang
nhóm "Đang chạy" - nhóm chỉ có việc *mới giao* và *đã nhận* - nên bấm vào là mở ra một danh sách
**không có** những việc đang chờ chính mình xác nhận.

## Bảng công giảng dạy: giờ cho người duyệt chuyên môn, tiền cho khối tiền
Trưởng phòng ACA và Kế toán nay xem được bảng công. Ai không có phạm vi dữ liệu **tiền** thì bảng
này chỉ đếm công - đơn giá giờ, đơn giá WOW, đơn giá test và cột "Tiền công tạm tính" đều tắt.

## Những chỗ nhỏ
- Nút **Trợ lý** bấm được cả cụm, không chỉ cái bóng đèn.
- Cổng đăng nhập gọi đúng tên **WOW Leader**.
- Hàng nhãn - giá trị trong ngăn kéo thông tin thành **hai cột thật**, giá trị canh trái, có
  gạch chân nhạt để mắt bám hàng (trước đây nhãn dính mép trái, giá trị dính mép phải).
- Gõ tìm trong một danh sách **nhúng** (Lead & khai thác, Nhân viên, Sổ thu, Giảng viên) không
  còn thay cả trang bằng sổ dữ liệu thô.
- Giáo viên và đội WOW không còn tab "GV dự phòng" / "Phòng & đụng lịch" - đó là cửa ghi của
  Học vụ và Trưởng phòng ACA.

---

# Đợt 12/08/2026 — làm theo feedback bốn team (ACA · SALE · WOW · HỌC VỤ)

## Tên người ở đâu cũng bấm được
Tên học viên trong mọi bảng, mọi thẻ, mọi danh sách nay đều bấm được để mở ngăn kéo xem nhanh
(chặng, việc kế tiếp, chuyên cần, công nợ). Trước đợt này có **101 chỗ** in tên ra chữ chết.
Ba chỗ còn lại cố ý không bấm được: tên nằm trong câu chữ tự do người dùng gõ (lý do chiết khấu),
và tiêu đề trang hồ sơ của chính học viên đó — bấm vào chính mình thì không mở ra gì mới.

## Vận hành lớp: "Số buổi off còn lại" thay cho ô Sĩ số
Ô đầu dải thẻ thứ hai nay cho biết **giáo viên chính còn được nghỉ mấy buổi trong khóa**. Sĩ số
không mất — nó vẫn nằm ở khối thông tin lớp ngay dưới dải thẻ.
Quota lấy từ cấu hình `teacherOffQuota_course` (mặc định 2 buổi/khóa). Đếm bằng số buổi của lớp
do người **khác** giáo viên chính dạy.

## Đổi giáo viên cho một buổi: lý do là mục chọn BẮT BUỘC
Ô lý do trước đây có nhưng bỏ trống vẫn đẩy người được, lại là chữ tự do nên không phân biệt được
"GV nghỉ" với "trung tâm dời lịch". Nay là **mục chọn bắt buộc + ô ghi thêm**, và danh sách lý do
nằm trong cấu hình `teacherChangeReasons` — thêm/xoá/sửa được, mỗi lý do mang cờ *"có tính là
buổi off không"*. Vượt quota vẫn cho làm (lớp không thể không có người dạy) nhưng app báo rõ.

## Buổi WOW 1-1
- **Học viên tự đặt buổi LUYỆN TẬP → vào thẳng, không chờ xác nhận.** Bài kiểm tra (test đầu vào,
  giữa khóa, cuối khóa) vẫn cần NV WOW xác nhận.
- Việc đặt lịch **bay thẳng vào chuông của NV WOW trực ca đó**, không rơi vào học vụ chung nữa.
- **NV WOW được quyền TỪ CHỐI kèm lý do**: ô trực mở lại cho người khác đặt, học viên đọc được
  đúng câu lý do ở cổng của mình kèm nút đặt buổi khác, và **không mất lượt WOW nào**.
- **Nhập điểm ngay khi ghi nội dung buổi**: bốn tiêu chí FC · LR · GRA · PR (thang 9, bước 0.5),
  Overall tự tính trung bình làm tròn 0.5. Nhập nửa vời bị chặn — đủ bốn ô hoặc để trống cả bốn.

## Trùng số điện thoại: chặn từ gốc, không còn lối "bấm lần nữa vẫn tạo"
Gõ số xong là **hồ sơ trùng hiện ngay bên dưới ô nhập**, kèm ba nút: ghi thẳng một lượt liên hệ
vào hồ sơ đã có · mở hồ sơ cũ · gắn số đang gõ làm **số liên hệ thứ hai** (của khách hoặc người
thân). Ba cửa tạo lead đều chặn hẳn việc tạo trùng. Soi trùng tính cả số phụ và số người thân.

## Đợt đóng học phí phải qua một người duyệt
- **Xin gia hạn một đợt** (kèm ảnh trao đổi với khách) và **xin chia lại cả lịch đợt** đều vào
  hàng chờ **"Đợt đóng"** trong Chờ duyệt & quyết định.
- Trưởng phòng trở lên và phòng kế toán ghi thẳng; các chức danh khác gửi yêu cầu.
- Duyệt là **áp thật vào lịch đợt ngay**, không phải ghi một cái dấu rồi để đó.

## Thu lead quá hạn chăm sóc
Nút **"Thu lead quá hạn"** ở màn Bàn giao lead. Lead vào danh sách khi dính **một trong hai** mốc:
quá `leadStale_days` ngày không ai liên hệ, hoặc một NV ôm quá `leadHoldMax_days` ngày kể từ ngày
được giao. Có màn xem lại trước khi chốt, và **thu rồi giao thẳng cho người mới trong một lần bấm**.

## Hai cấp xem số liệu của phòng Tư vấn
Cây báo cáo ba cấp NV Tư vấn → Sale Leader Chi nhánh → Trưởng phòng Tư vấn nay dựng bằng LUẬT:
nhân viên báo cáo cho leader **cùng cơ sở**; cơ sở chưa có leader thì báo thẳng Trưởng phòng — nên
số liệu ba cơ sở đó **chỉ Trưởng phòng xem được**, đúng như đã chốt.

## Hai biểu đồ cho đội tư vấn (trang Báo cáo)
- **Cột chồng theo cơ sở**: mỗi cột một cơ sở, mỗi mảnh màu một nhân viên, đếm **số lượt kết nối**
  (không chồng tỷ lệ % — ba cái % cộng lại không ra con số nào có nghĩa; % nằm trong chú thích rê
  chuột). Cơ sở không có số liệu trong kỳ thì không vẽ cột.
- **Biểu đồ tròn doanh thu theo nhân viên**, kèm % từng người.
Cả hai vẽ bằng SVG ngay trong app — không kéo thư viện ngoài, chạy được offline.

## Test đầu vào: tên NV WOW coi test + tách hai câu hỏi hình thức
Phiếu test nay ghi **NV WOW coi test ngay lúc đặt lịch** (người chấm có thể là người khác, app giữ
cả hai), và hình thức tách thành hai câu độc lập: **thi thử hay thi thật tại hội đồng** · **online
hay tại trung tâm**.

## Hợp đồng cam kết đầu ra — hai chữ ký
Hàng chờ **"Hợp đồng cam kết"**: nội dung là cam kết band điểm đầu ra kèm điều kiện. Cần **đủ hai
chữ ký** (Trưởng phòng Tư vấn + Giám đốc) thì học viên mới sang được bước xếp lớp — chặn ở cả hai
cửa ghi xếp lớp, không chỉ ẩn nút. Từ chối phải ghi lý do để sale sửa lại. Duyệt đủ thì app soạn
sẵn thư xác nhận gửi khách.

## Gửi email / Zalo và Sổ tin đã gửi
Hồ sơ có email thì hiện nút **Gửi email**, có Zalo thì hiện **Gửi Zalo** — không bày một cái nút
bấm vào rồi báo "chưa có địa chỉ". Soạn nội dung, xem lại thông tin gửi, bấm Gửi.
Trang **Sổ tin đã gửi** lưu mọi tin, lọc theo **lớp · người gửi · thời gian · kênh**.
Bản demo **không gửi thật** — chỗ nối ra backend đã đánh dấu sẵn trong mã.
Đợt đóng quá hạn `commitCancel_days` (mặc định 14) ngày sinh việc **gửi thư huỷ cam kết đầu ra**,
bấm là mở thẳng màn soạn thư với nội dung điền sẵn.

## Chia học phí theo đợt - hai chế độ, đều qua duyệt
Ngay ở bước **Tạo đăng ký** đã chọn được **Đóng một lần** hay **Chia 2 · 3 · 4 đợt**, không phải
tạo đơn xong rồi mở màn Thanh toán mới chia. Cùng bảng ấy có ở ngăn kéo **Chia lịch đợt**.

Hai chế độ:
- **Tách theo quy định** - app tính theo Cài đặt (CH2): đợt đầu bằng `installmentDepositPercent`
  (mặc định **40%**) học phí, các đợt cách nhau `installmentGap_days` (mặc định **30 ngày**).
  Bảng vẫn hiện đủ nhưng khoá - đọc cho khách nghe được ngay, không phải tin suông.
- **Tách chủ động** - mở khoá đúng bảng ấy, gõ **ngày và số tiền từng đợt** theo thứ đã hẹn với
  khách. Chuyển sang chế độ này thì giữ nguyên số đang hiện làm điểm bắt đầu.

**Tự cộng và cảnh báo ngay lúc gõ**: *"còn thiếu 4.199.000đ so với học phí 14.000.000đ"* hoặc
*"đang thừa..."* hoặc *"1 đợt chưa có hạn đóng"*, kèm câu khuyên đúng chỗ đang sai. Lệch tổng thì
**cửa ghi từ chối**, không chỉ cảnh báo. Sửa học phí hay chiết khấu thì tổng phải chia đổi theo.

**Cả hai chế độ đều qua cửa duyệt như nhau**: ai chưa có quyền duyệt thì yêu cầu vào **Duyệt đổi
đợt đóng**, lịch đợt chưa đổi. Yêu cầu nói rõ *"Chia theo quy định"* hay *"Chia chủ động"* - và
nhãn ấy tự đối chiếu với lịch quy định sinh ra, không tin cờ. Người duyệt bấm đồng ý là sổ ghi
**đúng từng con số đã trình**, không tính lại.

## Công nợ học viên - cửa của Kế toán
Trang **Công nợ học viên** (nhóm Điều hành) trả lời câu **"ai đang nợ bao nhiêu"** - khác với Sổ
thu học phí, vốn đếm theo phiếu và theo đợt để trả lời "hôm nay tiền nào về".
Mỗi học viên một dòng: **giá trị hợp đồng · đã thu · còn phải thu · thu trong kỳ · đợt đã đóng đủ
· đợt kế tiếp kèm hạn · chứng từ**. Chọn **kỳ số liệu** (tháng này / 30 / 90 / toàn kỳ / từ ngày -
đến ngày); kỳ lọc theo **ngày đăng ký đơn**, còn "đã thu" và "còn phải thu" là số tới hôm nay -
đổi kỳ không làm hết nợ. Nút **Xuất ra Excel** ở đầu trang.
Cột "Đợt đã đóng đủ" nói rõ phép đếm, và có chip **"đợt N đang dở"** cho đợt đã có tiền vào mà
chưa đủ - nếu không thì một người đã nộp một phần vẫn hiện "0/3".

**Hai cổng, một màn:** trang Học viên có nút **Chế độ kế toán** nhảy sang đây chứ không dựng bảng
tiền tại chỗ - hai phép cộng cho một số tiền thì lệch nhau lúc nào không ai biết bên nào đúng.
Năm nhóm thấy: **Kế toán · Giám đốc · Quản trị viên · Tư vấn · Học vụ**.

Bấm một dòng ra ngăn kéo: từng đơn → **lịch đợt** kèm nút **Xin gia hạn** ngay trên dòng của đợt
đó, nút **Chia thành nhiều đợt** (đơn đã chia rồi thì ghi "Chia lại lịch đợt") và **Ghi nhận thanh
toán** → khối **"Chia đợt & đổi hạn - ai duyệt"** (người xin, nội dung xin, tình trạng, **người
duyệt + thời điểm**, ghi chú khi duyệt, chứng từ) → bảng **phiếu thu / phiếu chi** kèm chứng từ.

## Chứng từ phiếu thu và phiếu chi là bắt buộc
Ghi khoản thu hoặc chốt hoàn tiền đều phải **đính ảnh biên lai / uỷ nhiệm chi**, hoặc **ghi rõ vì
sao chưa có**. Không có cái nào thì app từ chối ghi.
Lối "ghi lý do" là cố ý - thu tiền mặt lúc máy in biên lai hỏng là chuyện có thật, chặn cứng thì
người ta ghi khoản thu sang chỗ khác hoặc ghi sai ngày. Nhưng lối ấy **để lại dấu vết và bị đếm**:
cột Chứng từ có ba trạng thái **đủ** (mọi phiếu đã có ảnh) · **khai lý do N** (chưa có ảnh) ·
**thiếu N** (chưa khai gì), và học viên chưa có phiếu nào thì ghi "chưa có phiếu" chứ không tô xanh.

## Kho mẫu tin gửi khách (DL32)
Nội dung gửi ra ngoài không cắm cứng trong mã và cũng không nằm chung với câu nhắc việc nội bộ
của CH4 — nó có nhà riêng: trang **Kho mẫu tin gửi khách** (nhóm Tra cứu, cạnh Sổ tin đã gửi).
Mỗi mẫu có **tên · nhóm · kênh (email/Zalo/cả hai) · tiêu đề · nội dung · biến điền · bật-tắt**,
kèm người sửa lần cuối và thời điểm sửa.
Bảy nhóm: **thông tin lớp · xin đánh giá · nhắc học phí · nhắc buổi · chăm sóc · tái đăng ký ·
khiếu nại**. Trung tâm tự **soạn mới, sửa, nhân bản, tắt** — không cần dev.
Ngăn kéo mẫu **xem thử trên một học viên thật**, không xem thử trên `{ten}`. Biến nào chưa điền
được thì **giữ nguyên dấu ngoặc** để người gửi thấy chỗ thiếu, chứ không xoá đi thành khoảng
trống - và ngăn kéo nói luôn thiếu biến nào, vì sao, điền ở đâu.
Các cửa soạn tin lấy mẫu từ đây, lọc theo đúng nhóm việc và đúng kênh đang gửi.

Chín biến app điền hộ: `{ten}` · `{lop}` · `{giangvien}` · `{trungtam}` · `{ngay}` · `{gio}` ·
`{sotien}` · `{hotline}` · `{diachi}`. **Tên trung tâm, hotline và địa chỉ lấy từ Cài đặt ›
Thương hiệu & Màu** - đổi tên trung tâm ở đó là tiêu đề email đổi theo, không cắm cứng trong mẫu.
Riêng sổ Tin đã gửi thì giữ nguyên văn tên tại thời điểm gửi: mẫu là thứ *sẽ* gửi nên theo cấu
hình hôm nay, sổ là thứ *đã* gửi nên giữ tên hôm ấy.

Dải thẻ đầu trang đếm ba thứ không đọc ra được từ bảng: **nhóm việc chưa có mẫu dùng được** (chỗ
gửi thuộc nhóm đó mở ra là ô chọn mẫu trống), **mẫu sẽ gửi ra chỗ trống**, và **mẫu đang ngưng**.

## Bốn nhóm việc cấp LỚP (trước đây chỉ có một)
Học vụ vận hành theo lớp, mà bảng việc trước nay chỉ biết nói theo từng người. Nay có thêm:
**lớp sắp thi cuối khóa** · **lớp đã học đủ giờ cam kết** · **lớp sắp kết thúc khóa** · **lớp có
nhiều học viên nguy cơ** (cả lớp đuối chứ không riêng một em). Ngưỡng của cả bốn đều nằm trong CH2.

## Lớp chưa đủ sĩ số: cả Học vụ và Sale cùng thấy
Cùng một lớp thiếu người, hai phòng làm hai việc khác nhau: học vụ **QUYẾT** (dồn lớp, lùi ngày,
hủy sớm), sale **LẤP ĐẦY**. Trong màn lớp sắp khai giảng nay có ô **"Đẩy học viên vào lớp này"** —
chọn học viên đã đóng tiền mà chưa xếp lớp, đẩy thẳng vào.

## Giảng viên dự phòng khai theo THÁNG
App vẫn **tự tính** ai thay được cho từng buổi từ lịch dạy thật — đó là thứ không bao giờ lạc hậu.
Danh sách khai tay trả lời một câu khác: *tháng này ai đã NHẬN LỜI trực dự phòng*. Trưởng phòng ACA
khai đầu tháng; người đã nhận lời được xếp lên đầu danh sách người thay.

## Giao bài tập: chọn Kỹ năng trước, kho bài lọc theo kỹ năng
Ô **Kỹ năng** lên trước ô **Bài trong kho**, và kho lọc theo kỹ năng đang chọn. Chưa chọn kỹ năng
thì vẫn hiện đủ kho (ai biết sẵn tên bài cứ chọn thẳng). Chọn **Mixed (Tổng hợp)** thì mở cả kho.

## "Trao đổi với trung tâm" — bốn chỗ
1. **Cổng phụ huynh** trước đây không có một đường nào liên hệ trung tâm ngoài nút gọi điện. Nay
   phụ huynh có **luồng riêng**, tin ghi rõ người gửi là phụ huynh. Luồng riêng của học viên vẫn
   không mở cho phụ huynh đọc.
2. **Cổng học viên**: gom về một tên gọi thống nhất.
3. **Màn nhân viên**: nút **Nhắn cho học viên** — trước đây kênh chỉ chạy một chiều, nhân viên
   muốn chủ động nhắn thì phải chờ học viên mở lời trước.
4. **Ngay trên từng thẻ khuyến nghị** ở cổng học viên, và tin **mang theo ngữ cảnh của thẻ** (vắng
   buổi nào, thiếu bài nào) chứ không mở một ô trống bắt kể lại từ đầu.

---

# Đợt 12/08/2026 (chiều) — bốn luật bài tập mới

## Hạn nộp bài: 3 ngày kể từ GIỜ DIỄN RA BUỔI HỌC
Không tính từ lúc giáo viên bấm giao bài — nên **giao sớm hay giao trễ đều cùng một hạn**, học
viên luôn biết trước ngày phải nộp. Khóa nào cần khác 3 ngày thì khai riêng trong giáo án; ví dụ
buổi luyện viết luận nới thành 5 ngày, và lời dặn của buổi nói rõ vì sao.

## Giáo viên có 12 tiếng sau buổi học để điểm danh và giao bài
Cả hai đều tính từ giờ diễn ra buổi học. Quá 12 tiếng thì hiện ở bảng việc của giảng viên.
Nhóm việc **"Chưa giao bài tập sau buổi học"** là nhóm mới — trước đây buổi dạy xong mà không ai
giao bài thì không chỗ nào kêu. Nhóm này chỉ giữ buổi trong **7 ngày trở lại**: buổi ba tháng
trước thì không giao bài được nữa, đó là chuyện của báo cáo chất lượng chứ không phải việc hôm nay.

## Nộp trễ: được thêm 1 ngày, nhưng đánh dấu rõ
Một bài tập nay có **bốn mốc** thay vì một:
**hạn nộp** → **hạn nộp trễ** (hạn nộp + 1 ngày) → **hạn chấm**.
Nộp trong khoảng gia hạn vẫn nhận, ghi **"Nộp trễ"**. Quá nữa là **Không nộp**.

## Hạn chấm: 2 ngày kể từ hạn nộp — hoặc hạn nộp trễ nếu bài nộp trễ
Trước đợt này app đếm 48 giờ **từ lúc học viên nộp**, nên học viên nộp sớm ba ngày thì giáo viên
bị tính quá hạn sớm ba ngày — phạt người chấm vì học viên chăm. Nay neo vào **hạn nộp**, đúng như
quy định. Chấm sau mốc đó thì đánh **"Chấm trễ"**.

## Chuẩn hoàn thành khóa: 90% bài tập + đủ hai bài Midterm và Final
Hiện ở ba chỗ, cùng một câu chữ:
- **Cổng học viên** — ngay dưới dải tiến độ. Trong lúc còn học thì chỉ nói tỷ lệ bài tập (thứ làm
  được ngay hôm nay); hai bài kiểm tra chỉ được liệt kê là "còn thiếu" khi **lớp sắp kết thúc** —
  chưa tới lượt thi thì không phải là thiếu.
- **Hồ sơ học viên** — chip đủ / chưa đủ điều kiện.
- **Bảng việc của học vụ** — nhóm *"Học viên chưa đủ điều kiện hoàn thành khóa"*, chỉ hiện khi lớp
  còn dưới ngưỡng `classEndNear_days` là kết thúc, để còn kịp nhắc nộp bù và xếp lịch thi.

## Đổi ở đâu
Tất cả nằm trong **Cài đặt → Ngưỡng SLA** (`homeworkDueFallback_days`, `attendanceGrace_hours`,
`homeworkAssign_hours`, `homeworkAssignWindow_days`, `homeworkLateGrace_days`,
`slaHomeworkGrading_hours`) và **Cài đặt → Ngưỡng KPI** (chỉ số `HCR` — nay 90%).
Không con số nào cắm cứng trong mã.

---

# Cập nhật 13/08 — Bỏ thẻ trùng nhãn với chip lọc

Anh Luân gửi ảnh màn Xếp lớp: *"thẻ và chip lọc có vẻ dễ bị trùng nhau đúng ko? nếu trùng thì bỏ
thẻ, thiết kế chip lọc cho đẹp là ngon rồi, lại gọn gàng nữa"*.

## Trùng thì bỏ thẻ, giữ chip
Mười ba màn có một dải thẻ và một dải chip nói cùng một thứ - "Đang làm việc 33" nằm ngay trên
"Đang làm việc 33". Chip mang số **và** bấm lọc được; thẻ chỉ mang số. Nên bỏ thẻ.

Sáu màn nay không còn dải thẻ (Nhân sự · Chăm lại khách cũ · Lead · Test đầu vào · Theo dõi nhận
xét buổi · Học viên) - mở ra là dải chip có số ngay đầu trang. Tám màn còn lại giữ những thẻ mà **không chip
nào nói thay được**: "Nợ quá N ngày" (cắt theo tuổi việc), "Quá hạn nhiều nhất" (xếp hạng mảng
việc), "Tổng phiếu chưa đóng" (chip "Tất cả" đếm cả phiếu đã đóng - con số khác), "Giảng viên có
buổi thiếu mốc" (đếm NGƯỜI chứ không đếm buổi).

## Ba chỗ thẻ và chip đang nói hai con số khác nhau
Không phải chuyện gọn mắt - ba chỗ này là lỗi thật, dọn thẻ mới lộ ra:
- **Xếp lớp · "Chờ gửi thông tin lớp"**: thẻ 2, chip 3. Chip thiếu một điều kiện mà thẻ có. Sửa
  công thức chip trước, rồi mới bỏ thẻ.
- **Lead · "Tới hẹn liên hệ"**: thẻ đếm mốc hẹn tới **giờ này** (20), chip đếm tới **hết hôm nay**
  (24). Câu hỏi thật là "hôm nay phải gọi ai" - chip đúng.
- **Buổi học · "Chờ ghi nhận xét"**: thẻ đếm buổi chưa nhận xét mà **còn trong hạn** (0), chip đếm
  mọi buổi chưa nhận xét (20).

## Thứ chỉ thẻ có thì chuyển chỗ, không xoá
Màn Xếp lớp có hai mốc SLA kèm bánh răng chỉnh ngưỡng nằm trong thẻ. Nay chúng nằm ở dòng ngay
dưới dải chip: *"Hạn gửi thông tin lớp 24h - hạn hoàn tất onboarding 72h - quá là vào nhóm Quá
hạn."* Bấm vào con số vẫn mở thẳng Cài đặt.


---

# Cập nhật 18/08 — Giáo viên báo nghỉ buổi dạy · hai trục lọc mới cho Nhật ký

## Giáo viên báo nghỉ (bảng DL33)

App vốn đã có đủ bộ máy XỬ LÝ khi giáo viên nghỉ - trang **Xếp người dạy thay**, sổ ca dạy thay,
danh sách dự phòng theo tháng, quota "một khóa GV chính được nghỉ mấy buổi". Cái thiếu là **cửa để
giáo viên nói rằng mình nghỉ**. Nay có.

**Giáo viên báo ở đâu:** trang *Học tập & Giảng dạy → Buổi hôm nay*.
- Nút **"Báo nghỉ buổi này"** ngay trên thẻ buổi đang dạy hôm nay (dành cho ca ốm đột xuất).
- Khối **"Buổi dạy sắp tới của tôi"** - 14 ngày tới, mỗi buổi một nút Báo nghỉ. Khối này cũng là
  chỗ giáo viên **theo dõi đơn mình đã gửi**: đang chờ duyệt / đã duyệt / ai dạy thay. Đơn chưa ai
  quyết thì rút lại được.

**Ai duyệt:** **Trưởng phòng ACA** - tab **"GV báo nghỉ"** trong nhóm *Chờ duyệt* trên thanh menu.
**Trưởng phòng Học vụ và NV Học vụ thấy cùng tab ấy** (họ là người xoay người dạy thay) nhưng không
có nút quyết - chặn ở cửa ghi, không phải chỉ giấu nút.

**Sau khi duyệt:** buổi ấy vào hàng chờ của trang **Xếp người dạy thay** - có dải cảnh báo đỏ liệt
kê từng buổi kèm nút nhảy thẳng sang đúng ngày, và một chip lọc mới **"GV đã báo nghỉ"**. Xếp xong
người thay là lá đơn tự đóng lại, không phải bấm thêm nút nào.

**Báo trước bao lâu là đủ sớm:** tham số CH2 mới `slaTeacherOffNotice_days` (mặc định **3 ngày**).
Báo muộn hơn vẫn gửi được - ốm đột xuất thì không ai báo trước - nhưng đơn mang dấu **"báo gấp"**.
Lý do nghỉ lấy từ danh mục `teacherChangeReasons` có sẵn ở Cài đặt.

**Ghi vết:** cả bốn cửa ghi của nghiệp vụ này đều để lại dòng trong **Nhật ký thao tác** - gửi đơn,
duyệt, từ chối, rút đơn, và cả lượt xếp người dạy thay.

## Nhật ký thao tác - ra khỏi Cài đặt, thành một cuốn sổ

**Chỗ mới: Tra cứu & sổ sách → Nhật ký thao tác.** Trước đây nó là một tab của Cài đặt, mà Cài đặt
là nơi *đặt luật* của trung tâm còn nhật ký là cuốn sổ người ta mở ra để *tra* một chuyện đã xảy
ra. Hậu quả thật của chỗ đặt cũ: Cài đặt chỉ Quản trị viên mở được, nên **không trưởng phòng nào
tra được nhật ký** - trong khi chính họ phải trả lời câu "ai đổi con số này".

- **Ai xem được:** trưởng phòng trở lên. Leader chi nhánh và nhân viên không có.
- **Mỗi dòng vẫn nằm trong phạm vi dữ liệu của người đọc** - sổ này đi ngang qua mọi bảng kể cả
  bảng tiền, nên nó không thành đường vòng qua lớp phân quyền.
- **Lối cũ vẫn vào được:** link `settings` + tab `nhatky` cũ tự lái sang trang mới.
- Bản demo có sẵn **24 dòng lịch sử 5 ngày gần nhất** để mở ra là thấy ngay sổ trông thế nào.
  Dòng gieo sẵn không lùi lại được và nói rõ vì sao.

**Bốn cách lọc:** ô tìm · dải chip **Kỳ** (Mọi lúc · Hôm nay · 7 ngày · 30 ngày, mỗi chip mang sẵn
con số) · ô chọn **Bảng** · ô chọn **Người** · ô chọn **Loại** (Tạo mới · Cập nhật · Xóa · Hoàn tác).

Cùng lượt này: cột **Thay đổi** không còn in tên ô bằng chữ máy (`next_payment_due` →
"Hạn đóng kế tiếp"), và bỏ hai ô `updated_by` / `updated_at` - chúng lặp lại đúng hai cột **Lúc**
và **Người** nằm ngay bên cạnh. Ô lọc **Bảng** cũng đã có tên tiếng Việt cho ba bảng mới nhất
(Ca dạy thay · Kho mẫu tin · Giáo viên báo nghỉ).


---

# Cập nhật 18/08 (cuối ngày) — Ai được bấm nút quyết định

Bốn chỗ trong app cho người ta **thấy nút quyết định mà bấm vào thì bị từ chối**. Cửa ghi đều có
gác nên không ai ghi bừa được, nhưng app vẫn cho mở form, điền xong rồi mới nói không phải việc
của bạn. Đã dọn sạch:

| Hàng chờ | Trước: ai thấy nút | Nay chỉ |
|---|---|---|
| Duyệt GV báo nghỉ | 6/6 chức danh | Trưởng phòng ACA |
| Duyệt xin nghỉ của học viên | có cả giáo viên | Học vụ |
| Chốt hoàn tiền | 5/6 chức danh | Kế toán |
| Duyệt chiết khấu | có cả Sale Leader chi nhánh | TP Tư vấn + Giám đốc |

**Người không có quyền vẫn XEM được đầy đủ** - quyền chặn tay, không che mắt. Học vụ mở đơn báo
nghỉ của giáo viên ra để chuẩn bị xoay người; giáo viên mở đơn xin nghỉ của học viên ra để biết
trước giờ dạy ai vắng. Chỉ khác: không có nút quyết, không có ô nhập, và có một dòng nói rõ ai là
người chốt.

Riêng đơn **xin nghỉ của học viên** còn một chỗ nặng hơn hiển thị: cửa ghi phía sau chưa từng
khoá, nên giáo viên bấm là chốt luôn chuyên cần của học viên. Nay chặn ở cửa ghi.


---

# Cập nhật 18/08 (chốt ngày) — Reset demo và thứ bậc menu

## Bấm Reset là có ngay một bộ demo đứng vững

Nút **Dựng lại demo** (Cài đặt → Dữ liệu demo) kéo dữ liệu về gốc *và* về hiện tại. Hai bảng mới
của hôm nay nay cũng đứng vững qua ngày:

- **Đơn giáo viên báo nghỉ** trỏ vào buổi còn ở phía trước, không phải buổi đã diễn ra.
- **Nhật ký thao tác** có sẵn lịch sử 5 ngày gần nhất, dòng mới nhất vừa xảy ra ít phút trước -
  nên mở lúc nào cũng thấy "hôm nay ai làm gì". Đổi ở Cài đặt → CH2, tham số
  `demoLogFresh_minutes`.

## Menu đọc ra ba cấp

Nhóm → kệ → mục nay khác nhau rõ ở cả ba mặt: **màu** (tên nhóm sáng nhất, có nền khi đang mở),
**thụt lề** (tên kệ lùi một bậc và thẳng cột với icon của các mục nó cai quản), và **khoảng
trắng** (khoảng phía trên tên kệ rộng hơn phía dưới, nên mắt đọc ra nó thuộc về đám bên dưới).

Chấm màu của bốn chặng vòng đời nay nằm sát mép trái như một dấu chỉ mục, không đẩy chữ nữa - nên
tên mọi nhóm thẳng một cột.
