# Mỗi người hỏi bao nhiêu câu, cần bao nhiêu trang - đo ngày 08/08/2026

> Anh Luân: *"Em nên phân tích xem, mỗi nhân viên, mỗi trưởng phòng, họ hỏi bao nhiêu loại câu
> hỏi như a vừa ví dụ, họ cần bao nhiêu trang để phục vụ nghiệp vụ? Nó quan trọng dữ lắm em.
> Hệ thống lớn, nhưng quá khó dùng thì chết ngay. Như v1, a ko chắc nhân viên sale có hiểu hành
> trình và cách app trình bày ko đó."*

## Đo bằng gì

Không đoán. App **đã tự khai sẵn** thứ cần đo: bảng `NHIP` trong `gen_v5.py` khai cho từng chức
danh *"mỗi ngày người này làm gì, theo thứ tự nào"*. Mỗi dòng là

```
[buổi, tên việc, vì sao phải làm, TRANG ĐÍCH, hàm đếm, MÃ CHIP]
```

Đó chính là **danh sách câu hỏi họ hỏi mỗi ngày**, do app khai chứ không phải em nghĩ ra.

Bộ kiểm `_src/_checkcauhoi.js` đóng vai từng chức danh (đăng nhập bằng một nhân viên thật của vai
đó), đọc nhịp của họ, rồi hỏi bốn câu cho từng dòng:

| | Câu hỏi của thước | Sai thì hậu quả gì |
|---|---|---|
| C1 | Trang đích có thật không | Nhịp dẫn vào hư không |
| C2 | Người này có được xem trang đó không | "Mời rồi đuổi" - app giục đi làm rồi chặn ở cửa |
| C3 | Trang đó có mục trên menu của họ không | Vào được nhưng không tìm lại được |
| C4 | **Số trên nhịp có bằng số trên chip không** | Con số đầu tiên mỗi sáng là con số sai |

## Kết quả: không ai cần quá 5 trang

| Chức danh | Câu hỏi/ngày | Trang cần | Mục menu thấy | Thừa |
|---|---|---|---|---|
| Giám đốc (CEO) | 5 | 5 | **59** | 11.8x |
| Trưởng phòng Học vụ | 5 | 5 | 25 | 5.0x |
| NV Học vụ / CSKH | 5 | 4 | 25 | 6.3x |
| Trưởng phòng Tư vấn | 5 | 5 | 17 | 3.4x |
| Sale Leader | 5 | 3 | 17 | 5.7x |
| NV Tư vấn (EC) | 5 | 3 | 17 | 5.7x |
| Trưởng phòng ACA | 5 | 5 | 16 | 3.2x |
| Giáo viên | 4 | 4 | 12 | 3.0x |
| Trưởng phòng Marketing | 5 | 4 | 12 | 3.0x |
| Marketing Leader / NV | 5 | 3 | 12 | 4.0x |
| GV WOW / WOW Leader | 4 | **1** | 10 | 10.0x |
| Trưởng phòng Nhân sự / HR Leader | 4 | 3 | 6 | 2.0x |

**Đọc ra được ngay:** cả trung tâm, không một ai cần quá **5 trang** để làm hết việc trong ngày.
GV WOW chỉ cần **một trang duy nhất**. Mà ít nhất họ phải nhìn 6 mục menu, nhiều nhất 59.

Con số "thừa" không phải là lỗi tự thân - menu còn là bản đồ để tra cứu khi cần. Nhưng nó nói
đúng một điều: **thứ họ dùng hằng ngày phải nổi lên trên, không được nằm lẫn trong 59 mục.**
Đó là lý do nhịp ngày quan trọng: nó là lối tắt tới đúng 5 trang ấy.

## Bốn chỗ hỏng tìm được, và đã sửa

### 1. Con số trên nhịp KHÔNG bằng con số trên trang

Nặng nhất. Nhịp đếm `rows()` - toàn trung tâm. Trang đếm `srows()` / `bellItems()` - phạm vi của
người đăng nhập.

| Người | Nhịp nói | Trang thật có |
|---|---|---|
| Trưởng phòng Marketing | 57 việc quá hạn | 7 việc, quá hạn 6 |
| Trưởng phòng Tư vấn | 169 việc quá hạn | 95 việc, quá hạn 52 |
| Trưởng phòng Học vụ | 121 việc quá hạn | - |

Chỉ CEO là khớp (175 = 175), vì phạm vi của CEO đúng là toàn trung tâm. **Với mọi người còn lại,
con số họ nhìn thấy đầu tiên mỗi sáng là con số sai** - và không có cách nào tự phát hiện, vì hai
con số ấy không bao giờ đứng cạnh nhau trên màn hình.

Đã sửa: mọi phép đếm trong nhịp đọc **đúng nguồn mà trang đích đang đọc**. Mười ba phép đếm được
tách thành hàm riêng (`bhQuaHan`, `btChoCham`, `wowChoXN`, `ttToiHan`, `hsThieuMot`...) để nhịp
và chip cùng gọi một hàm - không còn hai bản chép tay của cùng một câu hỏi.

### 2. Giáo viên có 12 bài chờ chấm, app giục đi chấm, mà không vào được

Trang `baitap` ("Giao & chấm Bài tập") có thật, đầy đủ, 14.000 ký tự HTML. Nhưng nó khai `hide:1`
và **không chức danh nào ngoài Quản trị/Điều hành có nó trong phạm vi** - trong khi bảng cửa ghi
(`DOORTB`) khai rõ `baitap` thuộc `vai:["giaovien","aca"]`.

Đây đúng **LUẬT CỨNG SỐ 0**: SOP mô tả, app có trang, người phải làm không có lối vào là **sót**,
không phải là "ngoài phạm vi".

Đã sửa: mở quyền cho Giáo viên và Trưởng phòng ACA, bỏ `hide`, thêm mục menu ở cả hai cây.
Thêm luôn một chế độ mới **"Chờ chấm - mọi lớp"**: ba chế độ cũ đều bắt chọn trước một lớp và một
buổi, nên muốn biết 12 bài ấy nằm đâu thì phải mở từng lớp mà dò. App biết câu trả lời mà không
có màn nào nói ra.

### 3. Mười chín câu hỏi trỏ vào hub của V1

`tuyensinh` (Marketing, 6 câu) · `hoctap` (giáo viên + WOW, 4 câu) · `duyet` (5 trưởng phòng) ·
`baitap` · `phong` · `dsthanhtoan`. V2 đã gỡ hub khỏi menu, nên bấm nhịp là rơi xuống một trang
không có mục nào sáng - đúng con bệnh anh bắt hai lần: *"a tìm trên sidebar ko thấy"*.

Đã sửa: trỏ về trang thật (`nhaplead`, `buoihnay`, `wow`, `duyethoan`), mở quyền `dsthanhtoan`
cho Kế toán. Còn **1 câu** chưa có lối menu, đã ghi vào trần của bộ kiểm.

### 4. Ba trưởng phòng đọc nhầm nhịp của Giám đốc

`nhipKey()` có dòng `if(mgr&&(g==="tuvan"||g==="hocvu"||g==="marketing"))return "quanly"` - nên
Trưởng phòng Tư vấn, Marketing và Học vụ đọc **đúng năm dòng của CEO**: "việc quá hạn toàn trung
tâm", "KPI dưới ngưỡng", "đụng lịch phòng học". **Không một dòng nào về phòng của chính họ.**
Trưởng phòng Tư vấn mở app ra không có câu nào về phễu lead. Và hai trong năm dòng ấy trỏ vào
`phong` - trang mà Tư vấn/Marketing không được xem.

Đã sửa: ba nhóm nhịp mới (`tuvanql`, `hocvuql`, `marketingql`), cùng một khuôn - ba dòng đầu là
hàng chờ của phòng, hai dòng cuối là phần quản lý.

## Bấm một cái ra đúng danh sách

Trước: **12/74** câu hỏi có chip bấm một cái ra đúng số. 62 câu còn lại app nói *"có 30 buổi chưa
nhận xét"* rồi thả người ta vào bảng vài trăm dòng tự dò bằng mắt.

Sau: **63/70** câu (7 câu còn lại đã ghi trong trần, không im lặng cho qua).

Cách làm: mỗi dòng nhịp khai thêm **mã chip đích** (ô thứ sáu), và `jumpFlow` được dạy đủ **bảy
kiểu chip** mà app đang dùng (`fset` · `qf` · `en` · `xl` · `tk` · `vi` · `bt`). Bấm dòng nhịp là
tới nơi với danh sách đã lọc sẵn.

Chip mới thêm trong đợt này: `wow/homnay` · `wow/noshow` · `buoihoc` (6 chip trước đây **không
có một con số nào**) · `xeplop/chuaxep` · `baitap/chocham` · `nhaplead/dem` · `nhaplead/xau` ·
`hocvien/hocthuat` · `nhanvien/thieu` · `reup` (3 chip).

## Còn lại - khai thẳng, không giấu

Ba trần trong `_checkcauhoi.js` là **số đang còn thiếu**, không phải hạn mức được phép:

- `TRAN_KHONG_CHIP = 7` - 7 dòng nhịp có số đếm mà trang đích chưa dựng được chip
  (`gvdp` · `giaoan` · `bangcong` · `magioithieu` · `duyetck` · `phong`). Bốn trang này có cấu
  trúc khác hẳn (bảng theo ngày, tab theo khoá), chip không gắn vào được trong một nhịp sửa.
- `TRAN_KHONG_MENU = 2` - còn 1 dòng trỏ vào trang không có mục menu.
- `TRAN_KHONG_XEM = 1` - còn 1 dòng trỏ vào trang người đó không được xem.

Sửa thêm được chỗ nào thì **hạ trần xuống đúng số mới**, không bao giờ nới lên.

## Hai lần cái thước bắt chính người viết nó sai

Ghi lại vì đây mới là phần đáng học:

1. **Bản đo đầu tiên chỉ đếm chip kiểu `LISTCFG.qf`**, nên mọi trang tác vụ (`wow`, `buoihoc`,
   `xeplop`...) bị đọc nhầm thành "không có chip" - trong khi chúng có dải chip thật dựng bằng
   `filterBar` → `segHTML`. Em đã báo anh Luân con số **1/70** rồi phải đính chính thành
   **12/74**. Bài học: đo trên **chuỗi HTML thật** của trang, đừng hỏi lại một bảng cấu hình.

2. **Chip `reup`**: em đếm "mọi khách đã nguội" (16) trong khi trang đếm theo chặng hành trình
   (3) - đúng cái bệnh bộ kiểm sinh ra để bắt, và nó bắt ngay trong lần chạy đầu.
