# Phân tích hành vi - và vì sao bố cục hiện nay sai

Anh Luân 13/08:

> *"Thông thường người ta có thói quen sử dụng như thế nào, ví dụ: vào danh sách giảng viên, rồi
> bấm vào xem họ có chỉ số gì, danh sách lớp họ đang phụ trách..... Có cổng danh sách lớp, danh
> sách giáo viên, danh sách wow.... Em chưa phân tích hành vi, nên em gôm các sổ lại khuất luôn,
> thiết kế cũng tệ. Rồi mấy trang nghiệp vụ, chỗ thì dư, chỗ thì thiếu"*
>
> *"E tạo ra v2 trên cái nền v1 mà ko hề hỏi lý do tại sao tồn tại, e ko hề sắp xếp, bố trí lại
> 1 cách hợp lý dựa theo các phân tích chuyên sâu"*

Đúng cả. Dưới đây là phần em nợ.

---

## 1. Bằng chứng: app ĐÃ BIẾT hành vi, còn menu thì không dùng

Trong `gen_v5.py` có sẵn bảng **`NHIP`** - nhịp ngày khai theo từng chức danh, mỗi dòng là một
việc thật kèm lý do và kèm trang đích. Ví dụ nguyên văn:

| Chức danh | Đầu ngày | Trong ngày | Cuối ngày |
|---|---|---|---|
| **NV Tư vấn** | Gọi khách đã hẹn · Nhận lead mới về trong đêm | Chốt khách đã có kết quả test · Tạo đăng ký cho khách đã chốt | Nhận và báo xong việc được giao |
| **ACA** | Soi buổi dạy hôm qua đã có nhận xét chưa · Bài tập đang chờ chấm | Học viên nguy cơ học thuật · Lớp thiếu giáo viên hôm nay | Giáo án và ngân hàng bài của khoá |
| **Học vụ** | Duyệt xin nghỉ học · Xếp lớp cho HV đã đóng đủ | Gửi thông tin lớp và chốt xác nhận | ... |

**Tức là hành vi đã được khai rõ trong app.** Nhưng **sidebar không đọc bảng đó một dòng nào** -
nó chia theo **bốn chặng vòng đời SOP** (`ARCS`: Khách tiềm năng → Đang học → Tạm dừng → Kết thúc
& Học tiếp).

Đó là gốc của mọi thứ anh đang bắt: **menu kể chuyện của TÀI LIỆU SOP, không kể chuyện của NGƯỜI
ĐANG LÀM VIỆC.** V1 chia vậy vì V1 là bản trình bày SOP; V2 phải là bản để làm việc, mà em bê
nguyên khung sang.

---

## 2. Ba lối vào tự nhiên - app mới làm tốt một

Người ta mở một phần mềm vận hành theo đúng ba đường, không hơn:

| Lối vào | Câu hỏi trong đầu | App hiện nay |
|---|---|---|
| **A · Theo VIỆC** | "Hôm nay tôi phải làm gì" | ✅ Tốt - Trang bắt đầu + Việc hôm nay + chuông |
| **B · Theo ĐỐI TƯỢNG** | "Em Kiu này thế nào" · "Lớp IELTS 6.5 tối T2-4-6 ra sao" · "Giảng viên Phong đang dạy mấy lớp, chỉ số thế nào" | ⚠️ Có máy móc, **cửa vào bị giấu** |
| **C · Theo SỔ** | "Cho tôi xem toàn bộ bảng X để đối chiếu / xuất file" | ❌ **18 sổ dồn vào một nhóm tên "Tra cứu"** |

### Lối B - thứ anh vừa mô tả, và chỗ nó gãy

Đường anh tả: *danh sách giảng viên → bấm một người → xem chỉ số + lớp họ phụ trách*.

### ⚠️ SỬA LẠI - bản đầu của mục này em viết SAI

Bản đầu em ghi *"hồ sơ giảng viên không có chỉ số nào, không dẫn sang lớp của họ"*. **Sai.** Em
grep 18 dòng đầu hàm rồi kết luận cho cả hàm dài 60 dòng. Đọc trọn `renderHosoGV` thì nó **đã có
đủ**: ba KPI đối chiếu ngưỡng CH6 (**TNR** tỷ lệ buổi có nhận xét · **GCR7** tỷ lệ bài đã chấm ·
**ADC** kỷ luật vào lớp đúng giờ), bảng **Lớp đang phụ trách** kèm nút mở bảng lớp, bảng **Buổi
cần ghi nhận xét**, bảng **Công giảng dạy theo tháng**, bảng **Bài tập chờ chấm**. Và
`go("hosogv")` khi chưa chọn ai thì ra một **trang chọn giảng viên** - đúng cái "cổng danh sách
giảng viên" anh nói.

*Đọc một phần của cái mình đang kết luận về, rồi kết luận cho cả cái - đó là cùng một lỗi với
`_check14` đo bằng cửa sổ ký tự và với phép đo cắt nhãn ở dấu "·". Ba lần trong một ngày.*

**Vậy vấn đề THẬT là gì:** ba trang hồ sơ (`hosogv` · `hosonv` · `hosokhoa`) đều **tồn tại, đều
đầy đủ, và cả ba đều khai `g:"_"` - không mục nào có mặt trên sidebar.** Chỉ tới được nếu bấm
trúng một cái tên trong bảng nào đó. Nội dung không thiếu; **cửa vào thì không có.**
Và vẫn thiếu thật hai thứ: **hồ sơ của một LỚP** và **cổng danh sách NV WOW**.

Cùng bệnh với **Lớp** và **NV WOW**: có sổ, có trang vận hành, nhưng không có **trang hồ sơ của
một lớp / một NV WOW** gom trọn "người này/lớp này đang thế nào".

---

## 3. "Chỗ thì dư, chỗ thì thiếu" - liệt kê cụ thể

### DƯ

| Chỗ dư | Vì sao dư |
|---|---|
| Nút **"Xếp lớp & Onboarding"** trong trang Lớp học | Là nút **điều hướng** trỏ sang một mục đã nằm trên sidebar cách đó 2 dòng. Nó sinh ra chỉ để làm vừa lòng luật K2 của `_checkkhuon` ("mọi trang nghiệp vụ phải có nút hành động"), vì sổ lớp khai `ro:1`. **Một nút phục vụ bộ kiểm, không phục vụ ai.** |
| 6 hub cũ (`tuyensinh` `hoctap` `cskh` `khac` `duyet` `giangvien`) | V2 đã tách tab thành trang riêng, hub thành lớp vỏ. Chúng vẫn chiếm chỗ trên menu và vẫn là một cửa vào thứ hai cho cùng nội dung. |
| 3 trang `banlam` `hanhtrinh` `chay` dùng **chung một dải 5 ô** | Cùng nội dung, ba cửa. |
| Nhóm **"Tra cứu" 18 mục** | Không phải dư nội dung - **dư một tầng menu**. Cái tên tự nói "chỗ này không phải để làm việc", trong khi Lối C là một lối vào chính đáng. |

### THIẾU

| Chỗ thiếu | Hậu quả |
|---|---|
| **Không có cửa nào TẠO LỚP MỚI** | Sổ lớp khai `ro:1`; tìm cả mã không có `newClass`/`lopMoi`. Mở một lớp là việc gốc của Học vụ mà app không làm được - đây là lỗ hổng **LUẬT CỨNG SỐ 0**, không phải chuyện bố cục. |
| **Ba trang hồ sơ không có mặt trên menu** (`hosogv` `hosonv` `hosokhoa`, đều khai `g:"_"`) | Nội dung đầy đủ mà không ai tìm ra - xem phần sửa lại ở mục 2 |
| **Sổ Lớp học không lọc được 1-1 / Nhóm** | App vẽ nhãn "1-1"/"Nhóm" trước mọi tên lớp nhưng không có chip lọc theo - nhãn không dẫn tới đâu |
| **Không có hồ sơ 360 của một LỚP** | `banglop` là màn *vận hành* lớp (điểm danh, nhận xét), không phải màn *xem lớp này đang thế nào*. |
| **Không có cổng "danh sách NV WOW"** | WOW có sổ buổi (`dswow`) và lịch trực, nhưng không có danh sách người + chỉ số của họ. |
| Từ hồ sơ một người **không đi tiếp được** | Cụt đường: xem xong phải quay ra menu tìm tiếp. |

---

## 4. Đề xuất bố cục mới - theo hành vi, không theo chặng SOP

**Bốn nhóm, thay cho tám nhóm hiện nay:**

```
① HÔM NAY            việc của tôi - mở app ra là ở đây
   Trang bắt đầu · Việc hôm nay · Việc giao & nhận · Chờ duyệt

② LÀM                nơi làm cho xong một việc  (gom theo NHỊP, không theo chặng)
   Tuyển sinh:  Lead & khai thác · Test đầu vào · Tư vấn & Đăng ký · Thanh toán · Chăm lại
   Lớp & buổi:  Xếp lớp & Onboarding · Buổi hôm nay · Điểm danh · Nhận xét buổi ·
                Bài tập · Giáo án · WOW 1-1 · Lịch trực WOW · GV dự phòng · Phòng học
   Chăm sóc:    HV liên hệ · Khảo sát & Phản hồi · Khiếu nại · Bảo lưu · Kết thúc & Tái ĐK

③ HỒ SƠ              mở một ĐỐI TƯỢNG rồi xem trọn   ← LỐI B, hiện đang thiếu hẳn tầng này
   Học viên · Lớp học · Giảng viên · NV WOW · Phụ huynh · Khoá học

④ SỔ & BÁO CÁO       đối chiếu, xuất file
   Báo cáo & KPI · Bảng công · Nhân sự · 18 sổ (gộp thành MỘT mục có ô chọn sổ)
```

**Ba việc kèm theo, mỗi việc chữa đúng một chỗ thiếu ở mục 3:**

1. **Dựng tầng HỒ SƠ.** Mỗi đối tượng một trang: đầu trang là **chỉ số của chính nó**
   (giảng viên: giờ dạy tháng · % buổi có nhận xét đúng hạn · % bài chấm đúng hạn · số buổi vào
   trễ) - đúng năm loại thẻ đã chốt ở `THE_NEN_LA_GI.md`; dưới là **các danh sách liên quan bấm
   sang được** (lớp đang phụ trách, buổi sắp dạy, học viên của họ).
2. **Mở cửa tạo lớp** ở trang Lớp học, và gỡ nút điều hướng đang đứng nhầm chỗ.
3. **Gộp 18 sổ thành một mục "Sổ dữ liệu"** có ô chọn sổ - menu ngắn lại 17 dòng, mà không sổ
   nào bị mất (luật cứng số 0: gộp cửa vào ≠ bỏ nội dung).

---

## 5. Câu rút ra

*Bảng `NHIP` trong app đã tả đúng một ngày của từng người từ lâu. Menu thì xếp theo vòng đời của
học viên. Hai thứ ấy nói về hai chủ thể khác nhau - và cái người dùng nhìn thấy mỗi ngày lại là
cái xếp theo chủ thể không phải họ.*
