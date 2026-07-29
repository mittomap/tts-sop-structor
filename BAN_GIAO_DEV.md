# BÀN GIAO CHO LẬP TRÌNH VIÊN - ĐỌC FILE NÀY TRƯỚC, ĐỪNG ĐỌC GÌ KHÁC

Repo này có 14 file tài liệu, gần 6.000 dòng. **Bạn không cần đọc chúng để bắt đầu.** File này là
thứ duy nhất phải đọc trước khi sửa dòng code đầu tiên. Mất khoảng 10 phút.

---

## 1. Trong 60 giây: đây là cái gì

Hệ thống vận hành theo SOP cho một trung tâm IELTS **5 chi nhánh + lớp online**. Không phải app
CRUD. Phần lớn giá trị nằm ở **luật nghiệp vụ**: khi nào một việc trở thành quá hạn, ai được duyệt
khoản nào, học viên nào đang có nguy cơ bỏ học, hôm nay từng chức danh phải làm gì trước.

Sản phẩm là **2 file HTML chạy độc lập** (không server, không build tool, mở bằng trình duyệt là
chạy) + 1 file dữ liệu. Cả ba đều **sinh ra từ `_src/gen_v5.py`**.

---

## 2. Ba luật cứng - vi phạm là hỏng, không có ngoại lệ

### LUẬT 1 - KHÔNG BAO GIỜ sửa tay 3 file ở gốc repo

```
ITTs_WebApp_v5_demo.html      ← sản phẩm, KHÔNG sửa
ITTs_TrangHocVien_demo.html   ← sản phẩm, KHÔNG sửa
ITTs_data.js                  ← sản phẩm, KHÔNG sửa
```

Sửa `_src/gen_v5.py` rồi build lại. Sửa tay 3 file trên thì lần build sau mất sạch, và không ai
biết đã mất gì.

### LUẬT 2 - Hằng số nghiệp vụ KHÔNG được gõ thẳng vào code

Sai:
```js
if (gioQuaHan > 24) { ... }
```
Đúng:
```js
if (gioQuaHan > paramOf("attendanceGrace_hours", 24)) { ... }
```

Mọi ngưỡng đi qua `paramOf` (CH2), mọi câu nhắc đi qua `msgText` (CH4), mọi ngưỡng KPI đi qua
`kpiTh` (CH6). Lý do: chủ trung tâm phải tự đổi được trong màn Cài đặt mà không cần gọi bạn. Gõ
thẳng số vào code là biến một thao tác 5 giây của họ thành một lần deploy của bạn.

### LUẬT 3 - Chạy `./verify.sh` trước khi giao. Đỏ thì không giao.

```bash
./verify.sh            # đầy đủ, ~4 phút
./verify.sh --nhanh    # bỏ phần trình duyệt, ~2 phút
```

Một lệnh, chạy hết: build → 14 bộ kiểm → ~1.975 tiêu chí + 462 lượt mở app thật trong Chromium.
Xanh hết mới được giao.

**Bộ kiểm bắt được gì và KHÔNG bắt được gì** - nói trước để bạn không tin nhầm:

| Bắt được | Không bắt được |
|---|---|
| Trang ném lỗi, nút bấm không ra gì, chữ bị cắt, layout vỡ, trang cuộn ngang | Bạn viết đúng cú pháp nhưng **sai ý nghiệp vụ** (ví dụ tính công nợ sai công thức) |
| Tham số cấu hình **chết** hoặc bị gõ cứng ở **mọi** chỗ đọc nó | Gõ cứng ở **một trong nhiều** chỗ đọc - đã thử thật, nó **không** bắt được |
| Viết hàm ghi dữ liệu mới mà quên khai vào `DOORS` | Bạn xoá một tính năng và quên xoá bộ kiểm của nó (thành bộ kiểm giả) |
| Dữ liệu demo mâu thuẫn với luật nghiệp vụ | Trải nghiệm có dễ dùng không - cái đó phải có người thật ngồi thử |

Nói cách khác: nó chặn phần lớn tai nạn, **không** biến người bất cẩn thành an toàn. Đọc mã vẫn cần.

Đây **không phải** thủ tục hình thức. Bộ kiểm này đã bắt được những lỗi mà mắt người đọc code không
thấy: câu văn bị CSS bẻ vụn thành nhiều cột (HTML đúng tuyệt đối), 44/163 nút bấm không ra gì mà
cũng không báo lỗi, quản trị viên bị xếp nhầm vào nhóm tạp vụ, tên giáo viên bị gửi ra máy chủ nước
ngoài. Nó là thứ bảo vệ bạn, không phải thứ cản bạn.

---

## 3. Vòng làm việc

```bash
cd _src
ITTS_OUT="$(cd .. && pwd)" python3 gen_v5.py   # build 3 file sản phẩm
python3 extract_js.py                          # trích _APP.js/_HV.js cho bộ kiểm
cd .. && ./verify.sh                           # kiểm toàn bộ
```

Sửa **dữ liệu demo** thì khác - sửa ở nguồn pipeline, chạy đúng thứ tự:
```
gen_demo.py → seed_giaoan.py → mkdemo.py → fixdata.py → check_data.py → seed_giaoviec.py
```
**Đừng sửa tay `demo_data_big.json`.** Và nhớ: `gen_demo.py` **đọc lại** file JSON của lần trước,
nên sản phẩm hôm nay là đầu vào của ngày mai - vá dữ liệu phải vá cả dòng cũ, không chỉ "thiếu thì bù".

---

## 4. Bản đồ mã nguồn - 6 chỗ chiếm 90% thời gian của bạn

| Chỗ | Là gì | Đụng vào thì ảnh hưởng |
|---|---|---|
| `slaItems()` | **Xương sống.** Sinh ra toàn bộ "việc đang chờ" của cả hệ thống | Chuông, Trợ thủ, nút Làm ngay ở mọi bảng, Nhịp ngày, Trang bắt đầu - **5 nơi cùng lúc** |
| `LISTCFG` | Khai báo mọi bảng danh sách (cột, lọc, thao tác) | 29 trang danh sách |
| `NAVTREE` + `PBK` | Menu và danh mục trang | Điều hướng, phân quyền, breadcrumb, URL |
| `ROLESCOPE` | Chức danh nào thấy gì | Toàn bộ phân quyền |
| `JSTAGE` / `jInfo()` | 14 chặng vòng đời khách - học viên | Bản đồ chặng, Chạy quy trình, hồ sơ 360 |
| `DOORS` (cuối `gen_v5.py`) | Khai báo hàm nào ghi vào bảng nào | Nhật ký thao tác + Hoàn tác |

**Viết hàm ghi dữ liệu mới thì phải khai tên vào `DOORS`.** Quên khai thì `_check15` báo đỏ - đó là
cố ý.

---

## 5. Bốn cái bẫy đã có người cắn - đừng cắn lại

1. **Vá từng trang thay vì vá tầng dùng chung.** Đã xảy ra 3 lần. Lần gần nhất: ngăn kéo được nối
   bằng cách liệt kê tên trang → đúng 6/29 trang có, 23 trang còn lại là chữ chết suốt nhiều tháng.
   Thấy mình sắp viết `if (key === "trangA")` thì dừng lại.

2. **Cùng một sự thật khai ở hai nơi.** Cũng đã xảy ra 3 lần. Lần tệ nhất: "tab mặc định của hub"
   khai ở ba nơi, cả ba khai khác nhau → màn hình ra một đằng, menu hiểu một nẻo.

3. **Đối số theo thứ tự.** Một hàm 14 đối số; vài chỗ gọi thiếu ở giữa → tên tham số rơi vào ô hành
   động → 44 nút bấm không ra gì **mà không báo lỗi**. Quá 4-5 đối số thì truyền object.

4. **Viết bộ kiểm xong phải BẺ LẠI xem nó có đỏ không.** Bộ kiểm giao diện đầu tiên chạy xanh, nhưng
   cố tình bẻ lại đúng cái lỗi đã sinh ra nó thì **vẫn xanh** - nó chẳng kiểm gì cả. Xanh ngay từ
   đầu nhiều khi chỉ nghĩa là bạn chưa kiểm đúng thứ.

---

## 6. Khi cần biết "vì sao lại làm thế này"

`02_NHAT_KY_QUYET_DINH.md` ghi từng quyết định kèm **lý do và cái bẫy đã cắn**. Đừng đọc từ đầu -
tìm theo từ khoá khi bạn định đổi một thứ và muốn biết vì sao nó đang như vậy. Rất nhiều chỗ trông
thừa thãi thực ra là vá một lỗi cụ thể.

Kiến trúc tổng thể: `01_KIEN_TRUC_HE_THONG.md`. Chi tiết build và từng bộ kiểm: `_src/README_SRC.md`.

---

## 7. Nói thẳng về mức độ khó

**Cái khó thật:** mật độ luật nghiệp vụ. Không phải kỹ thuật - không có framework lạ, không có
build phức tạp, chỉ là JavaScript thuần trong một generator Python. **Cái khó là hiểu vì sao một
học viên đang ở chặng này, và đổi một ngưỡng thì 5 màn hình nào cùng đổi theo.**

**Cái dễ hơn người ta tưởng:** bạn không cần giữ hết trong đầu. Bộ kiểm giữ hộ. Sửa sai một luật thì
nó báo đỏ kèm tên luật, không phải đoán mò.

**Kiểu người hợp:** ai chịu đọc và chịu chạy `./verify.sh`. Không cần senior. Cần cẩn thận.

**Kiểu người KHÔNG hợp:** ai sửa thẳng file HTML cho nhanh, ai gõ số thẳng vào code, ai bỏ qua bộ
kiểm vì "sửa có tí". Ba việc đó phá hệ thống này nhanh hơn bất cứ thứ gì khác.

---

## 8. Tuần đầu tiên nên làm gì

1. Chạy `./verify.sh` **trước khi sửa gì cả** - để thấy bản gốc xanh, sau này đỏ là biết do mình.
2. Mở app, bật **Trợ thủ** (nút góc dưới bên phải), bấm **Dọn từng bước** - đi hết một lượt việc.
   Đó là đường đi hằng ngày của nhân viên, hiểu nó là hiểu 60% hệ thống.
3. Vào **Cài đặt > Ngưỡng & SLA (CH2)**, đổi một con số, xem màn hình nào đổi theo. Đó là mô hình
   cấu hình của cả app.
4. Sửa một thứ nhỏ thật (đổi một câu nhắc trong CH4), build, chạy `./verify.sh`, thấy xanh. Xong
   vòng đầu tiên.
