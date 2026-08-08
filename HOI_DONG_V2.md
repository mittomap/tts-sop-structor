# HỘI ĐỒNG V2 - CHUYÊN GIA & TRẢI NGHIỆM (07/08/2026)

> Anh Luân đặt: *"cho hội đồng chuyên gia và hội đồng trải nghiệm vào nhé. V2 dễ build nên phải
> build thật chắc tay và dễ sử dụng."*
>
> Báo cáo này **toàn số đo được**, không có một dòng ý kiến nào không đi kèm phép đo. Đó là luật
> của dự án: *canh bằng máy, không bằng trí nhớ*. Chỗ nào máy chưa với tới thì khai thẳng ở mục 5.

---

## 1. HỘI ĐỒNG CHUYÊN GIA - BỐN RÀNG BUỘC CỨNG CỦA V2

| RB | Đo bằng | Kết quả | Kết luận |
|---|---|---|---|
| **RB1** một nghiệp vụ một cửa ghi | `_check15` kiểm kê cửa ghi | 24 bảng · **146 cửa ghi** · nhiều nhất DL09 (18), DL03 (13), DL14 (11) | **CHƯA ĐẠT** - việc của Khúc 4 |
| **RB2** trang đáp ĐỌC bản khai số, không tự tính | `_checkdem` | 105 tiêu chí / 26 lớp - mọi số trên thẻ đều tìm được dấu vết ở danh sách ngay dưới | Đạt ở phạm vi hiện có; dải cảnh báo (Khúc 5) chưa làm |
| **RB3** cha trước con | Khúc 3 | Lớp học thành cha; Vận hành lớp vào qua ngăn kéo; đứng ở con thì mục cha sáng và nhóm cha tự mở | **ĐẠT** |
| **RB4** không lặp sai lầm V6 | `_check11` 8 phép canh | Không cờ nào bật tắt hai bản; một nguồn, một thế giới | **ĐẠT** |

### 1.1 RB1 là chỗ đáng lo nhất - và đây là con số

**146 cửa ghi trên 24 bảng.** Riêng DL09 (học viên) có **18 cửa**. Đó đúng là điều anh Luân mô tả:
*"cùng 1 nghiệp vụ mà ở bản hiện tại có thể làm được ở rất nhiều nơi, sẽ làm cho nhân sự bị rối."*

Cần nói rõ để không hiểu nhầm: **146 cửa ghi không phải 146 chỗ trùng nhau.** Một bảng có nhiều
cửa là bình thường (ghi tên khác ghi điểm, khác ghi trạng thái). Cái phải gom là những cửa **cùng
làm một việc ở nhiều nơi**. Muốn biết con số thật thì phải khai bảng `NGHIEPVU` như bàn giao mô
tả rồi để máy đối chiếu - **chưa làm, đó là Khúc 4**.

### 1.2 Bằng chứng máy cho LUẬT CỨNG SỐ 0 trong một lần thay cấu trúc lớn

Dỡ 6 hub thành 25 trang là lần thay cấu trúc lớn nhất kể từ khi có bộ kiểm. Số đo trước/sau:

| Phép đo | Trước V2 | Sau V2 |
|---|---|---|
| `_tall` số trang vẽ được | 39 | **55** |
| `_check18` số trang/tab vẽ thật | 91 | **100** |
| `_checkmoi` tiêu chí | 1045 | **1479** |
| `_checklap` tiêu chí | 884 | **1268** |
| `check_sop.py` (357 cột DL · 93 trigger · 51 chỉ số · 31 hành động · 12 màn VH · 9 bảng BC) | ĐẠT | **ĐẠT** |
| `_checkmien` dữ liệu ngoài miền | 0/0 | **0/0** |

`check_sop.py` vẫn ĐẠT nghĩa là **không rơi mất một cột, một trigger, một chỉ số, một màn nào**.
Đó là bằng chứng máy cho luật số 0, không phải lời hứa.

### 1.3 Tám lỗi thật bắt được trong lúc dỡ hub

Bốn lỗi do chính đợt này gây ra, và **cả bốn đều là BỚT trong im lặng** - đúng thứ luật số 0 cấm:

1. **Trang đáp của ba nhóm bị dồn về một chỗ** - chức danh khai `land` là khoá hub thì sau khi hub
   thành bí danh, họ đăng nhập vào đứng ở một trang không có mục menu nào sáng.
2. **Nút "Khách mới liên hệ đến" rơi mất** - nó nằm ở đầu hub và chỉ hiện ở tab Lead.
3. **`reRender` gọi vòng tới tràn ngăn xếp** - nó chỉ hỏi `RENDER[k]`, mà trang kiểu danh sách vẽ
   bằng `renderList`. Trước V2 các trang ấy không bao giờ là trang đang mở nên chưa lộ.
4. **52 nút "đi tới chỗ làm" đi nhầm phòng** - xem mục 1.4, đây là lỗi rộng nhất cả đợt.

Bốn lỗi có sẵn từ trước, chỉ lộ ra vì V2 vẽ các trang độc lập:

5. **Hai hạt bản đồ chặng nhãn nói một đằng, số đếm một nẻo** - hạt "Học tập & Giảng dạy" thật ra
   đếm buổi học trong ngày; hạt "CSKH · Khảo sát" thật ra đếm khiếu nại chưa đóng.
6. **Một nút viết sai thứ tự class** (`btn sm green`) ở hàng chờ Xác nhận thu tiền.
7. **`paySave` có hai lối thoát im lặng** - không tìm ra đơn, và chốt chặn bấm hai lần.
8. **Ô `.ddnote` đặt cứng 170px** trong khi chữ cần 159px và hàng còn thừa 942px (CI bắt).

### 1.4 Lỗi rộng nhất, và bài học của nó

Triệu chứng ban đầu là **một dòng**: việc "Còn nợ học phí" bấm Lưu mà không ghi, không báo.
Gốc nằm ở chỗ khác hẳn: bốn hàm `goTS`/`goHT`/`goCS`/`goDuyet` là lối cũ *"đặt tên tab rồi đi tới
hub"*, và chúng là đường đi của **52 chỗ gọi** - bảng việc, trợ lý, nhịp ngày, ô thẻ, bài hướng
dẫn. Hub thành bí danh thì tên tab bị bỏ rơi và **cả 52 nút rơi về cùng một chỗ**.

Người dùng thấy một form lạ, điền, bấm Lưu, không có gì xảy ra. **Không phải nút chết - là đi
nhầm phòng.**

Ba điều rút ra:

- **`_checknv` là bộ DUY NHẤT bắt được.** 35 bộ kia đọc chuỗi HTML hoặc nhìn màn hình; không bộ
  nào đi hết một việc bằng chuột thật từ bảng việc tới nút Lưu. Lỗi này không làm hỏng trang nào -
  mọi trang vẽ đúng, mọi nút bấm được. Nó chỉ sai ở chỗ **nút dẫn người ta tới đâu**.
- **Đừng vá triệu chứng.** Một dòng đỏ về một việc hoá ra là 52 cửa.
- **Thông báo lỗi phải nói được nó vừa chạm vào cái gì.** Bộ kiểm chỉ nói *"bấm Lưu"* - sự chung
  chung ấy giấu chỗ hỏng suốt hai vòng đo. Câu *"bấm Lưu trên trang `nhaplead`"* mới mở ra được.

---

## 2. HỘI ĐỒNG TRẢI NGHIỆM - ĐÓNG VAI TỪNG CHỨC DANH, ĐO THẬT

Anh Luân đặt đúng một điều kiện cho việc dỡ hub: ***"miễn là không rối"***. Nên hội đồng này có
một bộ kiểm riêng - **`_checkroi.js`** - đóng vai người có thật rồi dựng THẬT thanh menu của họ.

### 2.1 PHÁT HIỆN SỐ 1 - menu dài ra, và đó là cái giá của việc dỡ hub

| Chức danh | Số mục menu | Số nhóm | Nhóm to nhất |
|---|---|---|---|
| **CEO / Quản trị viên** | **58** | 8 | **18** |
| NV Học vụ / CSKH | 25 | 7 | 13 |
| Trưởng phòng Học vụ | 25 | 7 | 13 |

**Chức danh làm việc hằng ngày thì ổn.** Chỗ nặng là vai có phạm vi rộng: 58 mục là cuộn hai màn.

Đây là một kiểu rối **khác** với V1 - không phải *"một nghiệp vụ làm được ở nhiều nơi"* mà là
*"không biết nghiệp vụ của mình nằm dòng nào"*. **Đổi một kiểu rối lấy một kiểu rối khác thì
không phải là tiến**, nên nó phải có người canh.

**Đề xuất có số kèm theo:** nhóm "Tra cứu" đang chiếm **18/58 mục** - mười tám cuốn sổ chỉ để xem.
Gom chúng sau MỘT cửa "Tra cứu" hạ được xuống **khoảng 41 mục** mà **không phạm RB1**: luật *một
nghiệp vụ một cửa ghi* nói về CỬA GHI, còn đây là sổ chỉ-đọc, không có thao tác ghi nào.

Trần trong `_checkroi` đặt ở **58 - số đo được thật**, không phải số mong muốn. Lý do: một cái
trần thấp hơn thực tế thì lần nào cũng đỏ, mà một bộ kiểm đỏ mãi thì người ta tắt nó đi. Nó là
**chốt kéo xuống**: đóng băng con số hiện tại để menu không dài thêm trong im lặng.

### 2.2 PHÁT HIỆN SỐ 2 - 14/25 trang nghiệp vụ chưa có dải thẻ riêng

Anh Luân mô tả V2: *"mỗi trang là nghiệp vụ riêng, và **nó có thẻ, có chip lọc, có cảnh báo của
riêng nó**"*. Đo lại: `THEDEF` khai **35 dải thẻ / 165 thẻ**, nhưng trong 25 trang nghiệp vụ mới
thì **chỉ 9 trang đã có dải thẻ riêng**.

| Đã có thẻ riêng (9) | Chưa có (14) |
|---|---|
| tuvan · thanhtoan · reup · wow · gvdp · phong · ghinhan · magioithieu · banggiao | nhaplead · test · buoihnay · lop · buoihoc · lichtuan · khaosat · khieunai · ychv · baoluu · duyetck · duyethoan · duyetnghi · duyetthu |

Đây là việc còn lại của Khúc 2b, **và nó là điều kiện cần của Khúc 5**: dải cảnh báo phải ĐỌC thẻ
của các trang nghiệp vụ, nên trang nào chưa có thẻ thì chưa có gì để đọc.

### 2.3 Ba quan sát cũ vẫn còn (đo lại, chưa mất đi)

- **NV Marketing thấy việc của người khác gấp 3,4 lần việc của mình** (88 so với 26) trên chính hồ
  sơ của họ. App không hỏng, nhưng buổi sáng của họ phần lớn là nhiễu.
- **Một giáo viên ở Cơ sở 3 có mục Giao việc mở ra TRỐNG** - `_checkroi` đo lại thấy Trưởng phòng
  Marketing cũng vậy. Sửa ở `seed_giaoviec.py`; bấm Reset demo không chữa được.
- **Ngăn kéo một dòng ở trang Giảng viên mở ra không có nút nào, chỉ 241 ký tự** - đúng chỗ anh
  Luân gọi *"lỗi logic ghê"*. Trang Hồ sơ Giảng viên chứa toàn bộ thông số một giảng viên mà ngăn
  kéo dẫn vào nó lại nghèo nàn.

---

## 3. NHỮNG GÌ ĐÃ CHẶT TAY HƠN SAU ĐỢT NÀY

- **CI GitHub xanh lần đầu.** Ba chỗ đỏ tồn từ trước đều là lỗi thật, cùng một họ: *một giả định
  đúng trên máy người viết, sai trên máy khác, và sai trong im lặng*. Đáng nhớ nhất: `_checkreset`
  cắm cứng đường dẫn của đúng một máy - **nó là bộ duy nhất trong 8 bộ dùng trình duyệt không theo
  lối chung**, và log cụt suýt làm chẩn đoán sai sang lỗi phiên bản Node.
- **Hai bộ kiểm mới**: `_checkf5` (F5 có mất chỗ đang đứng không) và `_checkroi` (menu có làm rối
  không). Cả hai đều **đỏ ngay lần chạy đầu** - đúng chuẩn: thước nào luôn xanh là thước giả.
- **`_checkf5` phát hiện app đã hứa suốt từ V9.29c mà chưa ai đo, và lời hứa ấy sai toàn bộ**:
  10/11 ca đều rơi về Trang bắt đầu. Vì sao 34 bộ cũ không thấy: **cả 34 đều nạp app một lần rồi
  đo, không bộ nào NẠP LẠI**.
- **Chín chỗ thước hỏi câu của bản cũ - đổi câu hỏi, không xoá luật nào.** Với mỗi cái đều hỏi
  *"nên xoá, hay nên đổi câu hỏi?"*, và lần này cả chín đều là đổi câu hỏi.

---

## 4. VIỆC TỒN, XẾP THEO THỨ TỰ NÊN LÀM

1. **Khúc 2b** - 14 trang nghiệp vụ còn thiếu dải thẻ riêng. Điều kiện cần của Khúc 5.
2. **Khúc 5** - bàn làm việc thành dải cảnh báo (RB2). Móc vào `THEDEF`, tuyệt đối không viết lại
   công thức: *cái thẻ và cái bảng hỏi hai hàm khác nhau cho cùng một câu hỏi* là bệnh anh Luân đã
   bắt hai lần trong hai ngày.
3. **Khúc 4** - gom cửa ghi (RB1). Khai bảng `NGHIEPVU`, dựng bộ kiểm canh một nghiệp vụ một cửa.
4. **Gom nhóm Tra cứu** - hạ menu CEO từ 58 xuống ~41.
5. **Khúc 2c** - dọn `HUBTAB`/`HUBCAU`/`hub*` và các hàm vẽ hub đã thành mã chết. **Lưu ý khi dọn:**
   `HUBTAB` hiện là bản khai *"trang nào là một nghiệp vụ"* cho bốn chỗ - `noQuyenTheoTrang`,
   `hubDich`, `nvCau`, `_check11`. Đổi tên nó thành `NGHIEPVU` cho đúng nghĩa, **đừng xoá trắng**.
6. Ba quan sát ở mục 2.3.

---

## 5. KHAI THẲNG PHẦN MÁY CHƯA VỚI TỚI

- **Menu 58 mục có thật sự khó dùng không** - máy đếm được số mục, không đo được cảm giác tìm kiếm.
  Cần anh Luân mở cổng Quản trị viên và nói thẳng.
- **25 trang có đúng là dễ hơn 6 hub không** - đây là câu chỉ người dùng thật trả lời được. Máy chỉ
  chứng minh được *không mất gì* (`check_sop.py` ĐẠT) và *không rối thêm theo số đo* (`_checkroi`).
- **RB1 còn bao nhiêu cửa ghi TRÙNG NHAU thật sự** - con số 146 là tổng cửa ghi, chưa phải số cửa
  trùng. Phải có bảng khai `NGHIEPVU` mới đo được.
- **Câu chữ có đúng nghiệp vụ không** - máy đo được độ dài, cỡ chữ, có bị cắt không; đúng hay sai
  vẫn phải người đọc.
