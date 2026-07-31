# QUY TRÌNH AUDIT - ITTs SOP

> Anh Luân đặt (31/07): *"Em nhớ thiết kế lại quy trình audit. Phải toàn diện từ: độ phủ sop,
> giao diện, tiện dụng, đồng bộ, nghiệp vụ tốt, luồng tốt. Trên hết là người dùng sẽ không gặp
> khó khăn. E thử phân tích xem những gì a phát hiện, xem a phát hiện bằng cách nào thì e tạo ra
> cách audit tương tự. Mục tiêu vẫn là app hoàn hảo."*

File này trả lời đúng ba câu: **audit là gì · làm theo thứ tự nào · làm sao biết đã đủ**.

---

## 0. Vì sao phải viết lại quy trình

Trước bản này, "audit" là: chạy `./verify.sh`, thấy xanh, giao. Nhưng anh Luân vẫn tìm ra lỗi
mỗi lần mở app. Đó là bằng chứng cứng: **bộ kiểm xanh không có nghĩa là app không có lỗi - nó
chỉ có nghĩa là app không có LOẠI lỗi mà bộ kiểm biết cách hỏi.**

Nên bước đầu tiên không phải viết thêm bộ kiểm, mà là hỏi ngược: *anh Luân nhìn vào đâu?*

Đọc lại **43 phát hiện** của anh trong các phiên gần đây, chúng rơi gọn vào **8 phương pháp**.
Và đối chiếu với 19 bộ kiểm đang có: **5 phương pháp - chiếm 28/43 phát hiện - không có một
dòng máy nào canh.** Đó chính là khe hở, và là lý do anh Luân vẫn phải làm việc của cái máy.

---

## 1. TÁM PHƯƠNG PHÁP (xếp theo số lần anh Luân dùng)

| Mã | Phương pháp | Số lần | Câu hỏi gốc | Máy canh ở đâu |
|----|-------------|--------|-------------|----------------|
| **M1** | **ĐỐI XỨNG** - so chỗ này với chỗ kia | **13/43** | *"cổng học viên em cũng nên làm navbar đi"* · *"có nhiều trang em không làm bộ lọc"* | `_checkaudit` §M1 |
| **M5** | **THỨ BẬC THỊ GIÁC** | 6/43 | *"font chỗ này to lên tí, để phân biệt khi sổ ra danh sách bên trong"* | `_checkux` thang thiết kế |
| **M2** | **LUỒNG HAI ĐẦU** | 5/43 | *"họ gửi đi thì nhân viên nhận ở đâu nhỉ"* | `_checkaudit` §M2 |
| **M4** | **DƯ THỪA & RỖNG** | 5/43 | *"cột thao tác ở các sổ ko thấy gì nhỉ"* · *"2 cái này khác gì nhau ko em?"* | `_checkaudit` §M4 |
| **M6** | **GIỌNG APP** - đọc như người ngoài | 5/43 | *"sao có thẻ html gì đây"* · *"em là app mà em gắn cảm thán vào sao được"* | `_checkux` |
| **M3** | **ĐÓNG VAI** | 4/43 | *"a đang ở admin đây em, ko thấy mấy cái em thay đổi ở đâu cả"* | `_check18` + `_checkaudit` |
| **M7** | **SỐ PHẢI SỬA ĐƯỢC** | 3/43 | *"đổi lớp từ 2 lần, ko có trong cấu hình hay sao mà ko thấy răng cưa em"* | `_checkaudit` §M7 |
| **M8** | **CHỖ ĐỨNG** | 2/43 | *"công giảng dạy tự nhiên lại nằm trong sổ thu học phí, vô lý"* | `_checkaudit` §M8 |

### M1 - ĐỐI XỨNG (quan trọng nhất)
Không ai cố ý làm lệch. Chỉ là thêm tính năng cho trang đang sửa rồi quên 12 trang cùng loại.
**Cách làm:** gom các trang thuộc **cùng một họ**, rồi đòi mọi thành viên có cùng bộ đồ.
Ba họ đang canh: trang bảng · ba cổng · một-việc-một-tên.

**Cách tự làm tay khi audit:** với mỗi tính năng vừa thêm, hỏi *"còn chỗ nào cùng loại?"* rồi
ĐẾM, đừng nhớ. Câu trả lời đúng luôn có dạng một con số: "12 chỗ gọi tên A, 5 chỗ gọi tên B".

### M2 - LUỒNG HAI ĐẦU
Một nửa luồng chạy được không có nghĩa là luồng chạy được. Có nút GỬI thì phải có màn NHẬN;
có `handover_until` thì phải có ô nhập ngày trả lại; có `placement_change_count` thì ngưỡng
phải ở CH2.
**Bẫy riêng của loại này:** nó không phải "chưa làm", mà là **"làm một nửa"** - nhìn qua thấy có,
dùng thật mới hụt. Nên phải canh **theo cặp**, không canh từng vế.

### M4 - DƯ THỪA & RỖNG
Hai câu hỏi khác nhau, cùng một ý: *chỗ này có đáng chiếm chỗ không.*
· Cột khai mà 0/N dòng có dữ liệu → cột chết.
· Tab vẽ ra rỗng → tab chết.
· Hai khối trùng tên trên cùng một trang → một trong hai thừa.
**Đo trên CẤU TRÚC, không đo trên dữ liệu hôm nay** - hôm nay 0 dòng không có nghĩa là hỏng.

### M7 - SỐ PHẢI SỬA ĐƯỢC
Bấm vào một con số trên màn rồi hỏi *"sửa ở đâu?"*. Không sửa được nghĩa là nó đang là **hằng số
của phần mềm** chứ không phải **thông số của trung tâm** - trái LUẬT CỨNG.
Chỗ nào cố ý để trần (trích SOP, ví dụ minh hoạ, hằng số của kỳ thi) thì khai vào `SO_BOQUA`
**kèm lý do đọc được**.

### M8 - CHỖ ĐỨNG
Không máy nào tự biết chỗ nào hợp lý. Nhưng máy canh được **hợp đồng**: màn đọc bảng NGƯỜI
không được nằm trong nhóm TIỀN. Và mỗi lần dời một màn, **chốt luôn hai đầu**: phải có ở chỗ
mới VÀ không được còn ở chỗ cũ - nếu không nó sẽ lẳng lặng quay về.

---

## 2. SÁU MẶT ANH LUÂN YÊU CẦU - đo ở đâu

| Mặt | Bộ kiểm | Nó thật sự chứng minh điều gì |
|-----|---------|-------------------------------|
| **Độ phủ SOP** | `check_sop.py` | 357 cột DL · 93 tình huống HD3 · 51 chỉ số BC2 · 31 hành động CH3 · 12 màn VH + 9 bảng BC. Chỗ nào app không làm phải khai **kèm lý do đọc được** |
| **Giao diện** | `_checkux` · `_checkui` | ≤110 mã màu · ≤20 bậc chữ · ≤10 bậc bo góc · mở THẬT 837 lượt trang trên trình duyệt: không cuộn ngang, không cắt chữ, nút đủ to, không che nhau |
| **Tiện dụng** | `_checkaudit` · `_checkux` | Sổ chỉ-xem có đường ra · mọi chức danh mở app thấy việc · danh sách rỗng nói vì sao · 87 form ghi đều có lời giải thích |
| **Đồng bộ** | `_checktour` · `_checkaudit` | Neo hướng dẫn trỏ đúng phần tử **trên đúng trang của bước đó** · trang mới không im lặng thiếu người hướng dẫn · tài liệu nhắc đủ bộ kiểm |
| **Nghiệp vụ** | `check_logic.py` · `_check16` · `_checkdata` | Quan hệ giữa các bảng · học phí & đợt đóng · 27 luật x 6384 lượt kiểm |
| **Luồng** | `_checkaudit` §M2 · `_check11` · `_check12` | Gửi đi phải có nơi nhận · nghiệp vụ hai chiều không làm một nửa · một cửa vào |

---

## 3. LÀM THEO THỨ TỰ NÀO

### Khi anh Luân báo MỘT lỗi
1. **Đo trước, sửa sau.** Ra con số: *"38 chỗ trên 20 trang"*, không phải *"có vài chỗ"*.
2. **Hỏi ngược: bao nhiêu chỗ app làm việc này? Đáp án đúng luôn là 1.** Nếu là 2 thì hai chỗ đó
   sớm muộn nói khác nhau - vá ở chỗ dùng chung, đừng vá cả hai.
3. **Mở rộng ra toàn bộ thứ cùng loại** (đây là chỉ thị thường trực của anh Luân). Anh hỏi một
   trường hợp thì phải kiểm hết những trường hợp tương tự.
4. **Sửa xong thì thêm một luật máy** - nếu không có máy canh, luật đó chắc chắn trôi lại.
5. **Kiểm lại tour và Trợ lý** (chỉ thị thường trực).
6. `./verify.sh` xanh hết mới giao.

### Khi audit toàn diện (không có ai báo lỗi)
Chạy đủ 20 bộ kiểm, rồi làm **bốn vòng tay** mà máy chưa với tới:
1. **Vòng đóng vai**: mở app bằng mắt từng chức danh, làm trọn một ngày làm việc của họ.
2. **Vòng ba cổng**: mở cả ba cổng cạnh nhau, so từng thứ - cổng nào thiếu gì.
3. **Vòng đọc chữ**: đọc mọi câu trên màn như người chưa từng thấy app. Có mã bảng nào lọt ra
   không, có câu nào cảm thán không, có chữ nào xưng hô sai không.
4. **Vòng bấm số**: bấm vào từng con số trên màn, hỏi "sửa ở đâu".

---

## 4. LÀM SAO BIẾT ĐÃ ĐỦ

**Không bao giờ đủ - nhưng đo được là đang khá lên hay đang tệ đi.** Ba con số theo dõi:

| Chỉ số | Ý nghĩa | Hiện tại |
|--------|---------|----------|
| Số phát hiện của anh Luân mà máy KHÔNG canh được | càng nhỏ càng tốt | 28/43 → **0/43** (8/8 phương pháp có máy) |
| Số bộ kiểm | thêm bộ kiểm mà không thêm luật thì vô nghĩa | **20** |
| Số chỗ khai "bỏ qua" mà không có lý do | phải luôn là 0 | **0** |

### Ba dấu hiệu một bộ kiểm đang GIẢ XANH
Đây là loại nguy hiểm nhất - nó cho cảm giác an toàn mà không có an toàn:
1. **Cho phép khai cái sai vào danh sách miễn trừ rồi coi là xong.** Khai một cái sai không làm
   nó thành đúng. (Đã cắn: 13 bước hướng dẫn trỏ CSS thô, khai vào mảng `KHUNG` rồi xanh suốt.)
2. **Đọc không được thứ cần đọc thì `return` im lặng.** (Đã cắn: `_checktour` đọc không được bản
   build thì bỏ qua cả một mục kiểm mà bảng tổng kết vẫn xanh.)
3. **Đo bằng một cái thước chưa lắp đủ.** (Đã cắn: bộ kiểm đóng vai bằng `applyScope()` mà không
   đặt `CURSTAFF` - NV001 có 31 lead lại đo ra 0 dòng, suýt đi sửa app cho một lỗi không có thật.)

**Luật:** đo ra số lạ thì **nghi cái thước trước**, đừng vội sửa app.

---

## 5. NHỮNG LUẬT ĐÃ RÚT (đừng bỏ sót - mỗi cái là một lần trả giá)

**Về cấu trúc**
- Cùng một sự thật ở hai nơi thì sớm muộn nói khác nhau. Vá ở chỗ dùng chung.
- Hợp đồng phải neo vào cái đứng yên. Đừng đo cái đang chuyển động (số dòng hôm nay).
- Canh Ý ĐỊNH chứ đừng canh CÁCH VIẾT (đổi tên biến không được làm đỏ bộ kiểm).
- Một luật thiết kế mà bộ kiểm chỉ với tới một nửa số file thì nửa còn lại chắc chắn sẽ trôi.

**Về giao diện**
- Thêm một mục vào menu chưa phải là làm cho người ta thấy nó.
- Hai tầng vẽ cùng một sức nặng thì không ra thứ bậc.
- Nhóm phải to hơn thứ nó chứa.
- Cấm dải viền màu trang trí, kể cả dải dựng bằng `::before` (luật W5).

**Về chữ**
- Chữ hiện ra cho người ngoài phải đi qua một lớp dịch - **nhưng lớp dịch phải biết chừa cái gì**
  (escape sạch rồi mở lại đúng nhúm thẻ định dạng vô hại).
- App không cảm thán. App nói việc.
- Không gọi học viên là "em" trong giọng của app.

**Về số**
- Mọi hằng số nghiệp vụ đi qua CH2 · câu nhắc qua CH4 · ngưỡng KPI qua CH6.
- Thứ gì hiển thị mà sửa được trong Cài đặt thì phải có bánh răng.
- Một điều kiện "nếu không có X" phải hỏi đúng thứ định hỏi.

**Về chính bộ kiểm**
- Báo xanh mà chưa chạy gì còn nguy hiểm hơn báo đỏ.
- Một bộ kiểm chỉ in ra mà không cản được là bộ kiểm giả (phải `exit` khác 0).
- Bản build cũ nằm cạnh mã nguồn nguy hiểm hơn không có bản build nào - nó chạy êm và trả lời
  về một thứ khác.

---

## 6. CHẠY

```bash
./verify.sh              # 20 bộ kiểm, ~13-15 phút, mã thoát khác 0 là có chỗ đỏ
./verify.sh --nhanh      # bỏ phần mở trình duyệt thật
cd _src && ITTS_OUT="$(cd .. && pwd)" node _checkaudit.js   # riêng bộ audit
```

Chi tiết từng bộ kiểm canh điều gì: `_src/README_SRC.md`.
Vì sao có luật đó: `02_NHAT_KY_QUYET_DINH.md`.
