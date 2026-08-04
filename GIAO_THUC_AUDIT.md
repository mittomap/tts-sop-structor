# GIAO THỨC AUDIT - anh Luân đặt 04/08

> Anh Luân: *"sửa xong hết thì em audit: giao diện, nghiệp vụ, chức năng, dữ liệu demo (nhất là
> nút reset demo, trước khi giao a sẽ bấm nút này đấy. Nó phải kéo demo về trạng thái hoàn hảo),
> và ngữ cảnh (ngữ cảnh ghi chú, ngữ cảnh các câu trên app, ngữ cảnh của các trang drawer thông
> tin đã chuẩn chưa)"* — *"lưu cái này lại cho những lần anh yêu cầu audit, cần bổ sung thêm gì
> thì em bổ sung, cái anh yêu cầu phải có nhé"*

**Anh Luân nói "audit" = chạy TRỌN bảng dưới đây.** Năm mảng đầu là anh đặt, bắt buộc phải có.
Bốn mảng sau là em bổ sung, vì đã có tiền lệ hỏng thật mà năm mảng kia không chạm tới.

Kết thúc audit phải nộp **một bảng: mảng nào xanh, mảng nào đỏ, mảng nào CHƯA ĐO ĐƯỢC** - và
"chưa đo được" phải khai thẳng, không được im lặng cho qua.

---

## Luật xuyên suốt - đọc trước khi bắt đầu

Bốn cái bẫy dưới đây đã cắn nhiều lần trong dự án này. Mỗi lần audit đều phải nhớ:

1. **Nghi cái thước trước, đừng nghi app trước.** Máy báo đỏ hàng loạt thì khả năng cao là thước
   sai. Đã cắn: 62/91 bước hướng dẫn "hỏng" (do không đi qua cửa đăng nhập), 22 vòng sáng "lệch"
   (do đo lúc app còn đang vẽ), 4800 chữ "chìm vào nền" (do nền gradient không đọc được màu).
2. **Đi đúng cửa mà người dùng đi.** Đừng gọi thẳng `RENDER[trang]` hay tự đặt biến trạng thái -
   `go()` có remap, `gateEnter()` mới dựng đúng phạm vi. Bộ kiểm tự dựng trạng thái là đang soi
   một màn người dùng không bao giờ tới.
3. **Đèn xanh trên một phép đo đã mất còn tệ hơn đèn đỏ.** Gỡ hay đổi một thứ thì phải đi hỏi
   lại từng bộ kiểm: nó có đang đo QUA thứ đó không. (`_checknv` từng tụt từ 100 lượt ghi xuống
   0 mà vẫn in OK.)
4. **Đo được thì đừng đoán; đo không được thì đừng kết luận.**

---

## 1. GIAO DIỆN (anh Luân đặt)

| Hỏi gì | Đo bằng |
|---|---|
| Cuộn ngang, chữ bị cắt âm thầm, phần tử thò ra ngoài, nút quá nhỏ, hai thanh nổi che nhau | `_checkui` - 5 khổ màn × mọi trang, trình duyệt thật |
| Chữ có chìm vào nền không (tương phản WCAG) | `_checkui`, ngưỡng 2.5 (2.2 cho chữ trắng trên chip màu) |
| Bảng màu / cỡ chữ / bo góc có phình ra ngoài thang không | `_checkux` (≤110 mã màu, ≤20 bậc cỡ chữ, ≤10 bậc bo góc) |
| Thẻ, tab, khối trùng lặp trên cùng một trang | `_check18` |
| Icon dùng mà thiếu trong font subset | `_tall` |

**Phải nhìn bằng mắt, máy không thay được:** chụp màn 4-5 trang chính ở tỷ lệ 90% và 100%, xem
nhịp đọc có hợp lý không - máy đo được "không vỡ" chứ không đo được "đẹp".

## 2. NGHIỆP VỤ (anh Luân đặt)

| Hỏi gì | Đo bằng |
|---|---|
| App có phủ trọn SOP không: 357 cột · 93 trigger HD3 · 51 chỉ số BC2 · 31 hành động CH3 · 22 màn VH/BC | `check_sop.py` - đọc **thẳng** file `.xlsx` gốc |
| Chỗ nào không phủ đã khai lý do đọc được chưa | cùng file, mục `BOQUA` / `TRIG_BOQUA` / ... |
| Hằng số nghiệp vụ có đi qua cấu hình không (CH2/CH4/CH6) | `_check13`, `_checkqa` |
| Nhãn enum có ghi nguyên văn CH1 không | `_checkdata` |
| Ngồi vào ghế từng chức danh thì có việc để làm không | `_checkngay`, `_checkdemo` (7 thứ × 8 chức danh) |

**LUẬT CỨNG SỐ 0 vẫn cao hơn mọi thứ:** thấy SOP mô tả mà app chưa có thì **làm**, không được tự
xếp vào diện "lệch trọng tâm" rồi bỏ.

## 3. CHỨC NĂNG (anh Luân đặt)

| Hỏi gì | Đo bằng |
|---|---|
| Bấm vào thẻ / dòng / nút có gì xảy ra không - và thứ mở ra có **hợp lý** không | `_checkbam` (bấm thật, soi cả nội dung mở ra) |
| Đi trọn một VIỆC: bấm Làm → điền → Lưu → nhật ký DL25 có dài thêm | `_checknv` |
| Từng NGƯỜI đăng nhập: menu, phạm vi dữ liệu, bộ quyền có đúng của họ không | `_checknguoi` (33 người × 17 chức danh) |
| Phân quyền ba tầng có chặn đúng người không | `_check12`, `check_sop.py` (CH3) |
| Bộ lọc, phân trang, xuất file, chọn cột | `_check17` |
| Ô chọn dài có gõ tìm được không | `_checknv` (`OCHON`) |
| Hướng dẫn có trỏ **đúng thứ câu nói đang nói tới** không | `_checkneo` + `_checktour` |
| Trợ lý trả lời có đúng người, đúng số không | `_checkqa` |

## 4. DỮ LIỆU DEMO - và NÚT RESET DEMO (anh Luân đặt, đây là chỗ anh sẽ bấm trước khi giao)

> Anh Luân: *"nhất là nút reset demo, trước khi giao a sẽ bấm nút này đấy. Nó phải kéo demo về
> trạng thái hoàn hảo"*

**Bấm Reset demo rồi phải kiểm LẠI TỪ ĐẦU, không được tin là "chắc giống lúc build".** Sau khi
bấm:

1. **Cả ba cổng** (nhân viên · học viên · phụ huynh) mở ra đều có dữ liệu, không màn nào trống.
2. **Mọi chức danh** mở app đều thấy việc của mình - không ai vào thấy bảng rỗng.
3. **Ngày tháng được kéo về hiện tại**: lịch tuần này có buổi học, có việc tới hẹn hôm nay, có
   việc quá hạn để thấy cảnh báo đỏ. Không được ra một bộ dữ liệu "chết" toàn quá khứ.
4. **Cấu hình KHÔNG bị cuốn theo** - ngưỡng, câu nhắc, thương hiệu, phân quyền đã chỉnh phải giữ
   nguyên (luật V4b). Reset là reset DỮ LIỆU, không phải reset cả app.
5. **Góp ý / trang cá nhân / tỷ lệ hiển thị** cũng không bị xoá - chúng nằm ngoài DL.
6. Chạy `_checkdemo` (7 thứ trong tuần × 8 chức danh) và `check_data.py` **sau khi reset**.

| Hỏi gì | Đo bằng |
|---|---|
| Dữ liệu demo có mâu thuẫn nội tại không | `check_data.py`, `check_logic.py` |
| Dữ liệu có khớp luật nghiệp vụ không | `_checkdata` (27 luật, ~6400 lượt) |
| Reset xong có ra đúng bộ chuẩn không | `_checkdemo` + tay bấm thật một lần |

**Bẫy:** sửa dữ liệu phải sửa **ở nguồn pipeline** (`gen_demo.py → seed_giaoan.py → mkdemo.py →
fixdata.py → check_data.py`), không sửa tay JSON - sửa tay là lần reset sau mất sạch.

## 5. NGỮ CẢNH (anh Luân đặt)

> *"ngữ cảnh ghi chú, ngữ cảnh các câu trên app, ngữ cảnh của các trang drawer thông tin đã
> chuẩn chưa"*

Đây là mảng **máy đo được ít nhất**, nên phải đọc tay nhiều nhất.

**5a. Câu chữ trên app**
- Có câu nào là ghi chú nội bộ lọt ra màn không (`_checkaudit` canh giọng văn).
- Có câu nào in tên tham số máy (`slaLeadResponse`) thay vì tiếng Việt không (`_check13`).
- Mọi con số % trên màn có giải thích được nó tính từ đâu không (`_checkux`).
- Mọi form ghi có câu giải thích không, có ô nào để trống nghĩa không (`_checkux`, 87 form).
- Câu nhắc việc phải đi qua CH4, không cắm cứng.

**5b. Ngăn kéo thông tin**
- Mở ra có **đúng hồ sơ vừa bấm** không - không phải một hồ sơ khác (`_checkbam` đối chiếu id).
- Có đủ nội dung không hay chỉ vài dòng rỗng (`_checkbam`: ngưỡng 120 ký tự).
- Có nút để **làm tiếp** không, hay là ngõ cụt.
- Không lọt `undefined` / `NaN` / `[object Object]` / `null` ra màn.

**5c. Ghi chú và nhật ký**
- Mọi thao tác xác nhận có ô ghi chú không, và ghi chú có vào **đúng batch** của việc đó không.
- Nhật ký DL25 có nói được **ai · làm gì · lúc nào · trên hồ sơ nào** không.
- Cửa ghi mới có được khai vào `DOORS` không (`_check15`).

**Phải đọc tay:** mở 5-7 ngăn kéo ở các nghiệp vụ khác nhau, đọc như người dùng lần đầu - câu
chữ có tự giải thích được không, hay phải đoán.

---

## 6. PHẠM VI DỮ LIỆU & RÒ RỈ *(em bổ sung)*

Đây là chỗ hỏng **im lặng** nhất và đã cắn thật: Leader Tư vấn Cơ sở 1 khai phạm vi "team" mà
nhìn thấy trọn 82 học viên của cả 5 cơ sở - bằng đúng Trưởng phòng.

- Mỗi chức danh chỉ thấy đúng phần dữ liệu của mình (`_checknguoi` so số dòng thật giữa các người).
- Cắt theo **chi nhánh** và theo **người phụ trách** - 5 chi nhánh + học online.
- Thông tin nhạy cảm (lương, công nợ) có che đúng người không.

## 7. NHẤT QUÁN GIỮA BA CỔNG *(em bổ sung)*

Một sự thật hiện ở nhiều nơi thì phải hiện **giống nhau**.

- Cùng một học viên: cổng nhân viên và cổng học viên có nói cùng một con số không.
- Cổng phụ huynh **ẩn đúng** phần riêng tư của con (`_check14`).
- Luồng hai chiều (trung tâm ↔ học viên) có khép kín không, hay gửi đi rồi rơi vào im lặng.

## 8. TÀI LIỆU CÓ THEO KỊP KHÔNG *(em bổ sung)*

- `02_NHAT_KY_QUYET_DINH.md`: mục "⭐ HIỆN TRẠNG" có đúng phiên bản hiện tại không.
- `_src/README_SRC.md` có nhắc **mọi** bộ kiểm đang có không (`_checkaudit` canh).
- `ITTs_WebApp_v5_README.md` có mục cho tính năng mới không.
- **VIỆC TỒN** có phản ánh đúng những gì đang thiếu không - đây là chỗ dễ nói dối bản thân nhất.

## 9. NHỮNG THỨ MÁY KHÔNG ĐO ĐƯỢC - PHẢI KHAI RA *(em bổ sung)*

Cuối mỗi lần audit phải liệt kê thẳng, không giấu:

- Chỗ nào **chưa có bộ kiểm nào** đi qua.
- Chỗ nào bộ kiểm có đi qua nhưng **chỉ đo được vế dễ**.
- Chỗ nào phải **người thật dùng mới biết** (nhịp làm việc, câu chữ có tự nhiên không).
- Giới hạn còn tồn của bản demo: không backend · dữ liệu nằm trong localStorage từng máy ·
  phân quyền thi hành ở trình duyệt · dữ liệu là dữ liệu mẫu.

---

## Chạy audit thế nào

```bash
./verify.sh              # toàn bộ phần máy đo được, ~17 phút
```

Rồi làm **ba việc máy không làm thay được**:

1. **Bấm Reset demo** rồi rà lại mục 4 bằng tay.
2. **Đóng vai 3-4 chức danh khác nhau**, mỗi người mở app làm một việc từ đầu đến cuối.
3. **Đọc câu chữ** ở 5-7 ngăn kéo và 3-4 form như người dùng lần đầu.

Nộp bảng kết quả theo đúng 9 mảng trên, kèm mục 9 khai thẳng phần chưa đo được.
