# BÀN GIAO V2 - MỖI NGHIỆP VỤ MỘT TRANG

> Viết ngày 07/08/2026, cho phiên Claude tiếp quản V2. Đọc HẾT file này trước khi gõ dòng mã đầu
> tiên. Bản V1 đang chạy tại https://mittomap.github.io/itts-sop-demo/ (bản dựng `829572`).

---

## 0. ĐỌC GÌ, THEO THỨ TỰ NÀO

1. `CLAUDE.md` - giao thức làm việc, LUẬT CỨNG SỐ 0, cách chạy `verify.sh`, cách đẩy demo.
2. `02_NHAT_KY_QUYET_DINH.md` - mục "⭐ HIỆN TRẠNG WEB APP" và các mục bẫy.
3. `01_KIEN_TRUC_HE_THONG.md` - kiến trúc.
4. `_src/README_SRC.md` - 34 bộ kiểm canh điều gì.
5. `AUDIT_07_08_2026.md` - mục **9c** là hai lỗi cấu trúc chính V2 phải sửa.
6. **File này.**

Chủ dự án: **anh Luân**. Xưng "em - anh Luân". Tiếng Việt mộc, không emoji, dùng "-" không dùng
gạch dài.

---

## 1. V2 LÀ GÌ - LỜI ANH LUÂN, NGUYÊN VĂN

> *"Mỗi nghiệp vụ 1 trang, vẫn sắp xếp được theo chặng trên sidebar, nhưng mỗi trang là nghiệp vụ
> riêng, và nó có thẻ, có chip lọc, có cảnh báo của riêng nó."*

> *"về bản chất, a nghĩ các team ngoài team sale ra là cần đi theo luồng, theo chặng, còn các vị
> trí khác, đa phần là cần trang nghiệp vụ."*

> *"Ở bản V2, bàn làm việc em đổi thành: các chỉ số số cảnh báo đi, nó tổng hợp những thứ bất
> thường ở các trang nghiệp vụ để cảnh báo, các nhân sự sẽ tự biết mình cần làm gì."*

> *"miễn là không rối, a thấy cùng 1 nghiệp vụ, mà ở bản hiện tại có thể làm được ở rất nhiều
> nơi, sẽ làm cho nhân sự bị rối."*

> *"trang vận hành lớp, nó là trang con của lớp học mới đúng em nhỉ, cách phân cách của mình ở
> nhiều chỗ a nghĩ cần xem lại"* · *"kiểu cái nào là nghiệp vụ của 1 lớp học ấy"*

> *"Phần hồ sơ giảng viên này bị ẩn khỏi menu, trong khi nó chứa toàn bộ thông số của 1 giảng
> viên, bản này lỗi logic ghê, sang V2 em nhớ là bài bản cho a"*

> *"a rất kỳ vọng vào bản v2 nhé"*

**Cách làm - anh Luân đã chốt (đừng hỏi lại):**
> *"Hay mình làm nhánh git riêng đi em, hiện tại nó ở https://mittomap.github.io/itts-sop-demo,
> giờ mình làm https://mittomap.github.io/itts-sop-demo-v2 đi, nó ngon hơn. Em cứ làm cho xong mấy
> cái tồn, sau đó em làm V2 đi. Độc lập, dễ sửa nữa mà ko sợ ảnh hưởng nhau, em có thể kế thừa
> được nhiều thứ."*

Và về hub, anh chọn phương án: **"Bỏ hẳn, sidebar là chặng"**.

---

## 2. BỐN RÀNG BUỘC CỨNG CỦA V2

Cả bốn đều rút từ lỗi ĐÃ CẮN, không phải suy đoán.

### RB1 - MỘT NGHIỆP VỤ = MỘT CỬA GHI
Một form, một hàm lưu, một chỗ chặn quyền. Nơi khác chỉ được **MỞ** cửa đó (gọi hàm mở form),
**cấm dựng bản sao**.

*Vì sao:* trong V1, điểm danh làm được ở Vận hành lớp, màn Điểm danh, Việc hôm nay, Trợ lý - mỗi
nơi một bản dựng. Và ngày 07/08 chuyện đó cắn thật: rubric chấm buổi dạy gắn vào ngăn kéo *Nhận
xét buổi*, nhưng chỗ anh Luân thật sự dùng là ô nhận xét **trong trang Điểm danh** - anh chụp màn
hỏi *"cái nâng cấp phần nhận xét là em bảo làm ở V2 hay làm luôn cho ver này?"* Tính năng đã làm,
nhưng gắn vào một trong hai chỗ nên với anh nó như chưa có.

**Kiểm bằng máy:** dựng một bảng khai `NGHIEPVU = [{ma, tenViec, hamMoForm, hamLuu, quyen}]`, rồi
bộ kiểm quét mã tìm mọi chỗ gọi `jSaveRow`/`jUpdRow`/`markRow` cho cùng một bảng DL và bắt lỗi
nếu có hơn một hàm lưu cho cùng một nghiệp vụ.

### RB2 - TRANG ĐÁP **ĐỌC** BẢN KHAI SỐ, KHÔNG TỰ TÍNH LẠI
Trang "Bàn làm việc" mới gom cảnh báo từ các trang nghiệp vụ. Nó phải **hỏi chính trang nghiệp vụ
đó** cho con số, không được tự viết lại công thức.

*Vì sao:* anh Luân bắt **hai lần trong hai ngày** cùng một bệnh - *"2 buổi quá hạn chưa nhận xét,
nhưng a nhìn xuống buổi, a ko thấy icon nên a ko biết chỗ nào"* và *"báo 2 học viên nguy cơ mà a
chẳng thấy đâu"*. Gốc: **cái thẻ và cái bảng hỏi hai hàm khác nhau cho cùng một câu hỏi**. Con số
không sai - cái sai là **nó không dẫn tới đâu**. Nếu trang đáp tự tính lại thì bệnh này nhân lên
25 lần.

**Hình thức bắt buộc:** mỗi trang nghiệp vụ khai một hàm
```
canhBao_<matrang>() -> [{ma, nhan, so, muc:"do"|"vang", diToi:function(){...}, viSao:"..."}]
```
Trang đáp CHỈ gọi các hàm này rồi xếp lại. Bộ kiểm `_checkdem.js` đã có sẵn lối đo: đọc số trên
thẻ từ DOM rồi đi tìm dấu vết ở danh sách ngay dưới - **mở rộng nó cho cả 25 trang**.

### RB3 - CHA TRƯỚC CON
`Lớp học` là CHA, `Vận hành lớp` là CON. Đường đi đúng: *Lớp học → bấm một lớp → Vận hành lớp*.
V1 đang ngược: Vận hành lớp đứng trên menu còn Lớp học bị ẩn, nên phải vào thẳng màn vận hành rồi
chọn lớp bằng ô xổ.

Cùng bệnh: `Hồ sơ Giảng viên` chứa **toàn bộ thông số** một giảng viên nhưng chỉ mở được từ một
dòng trong danh sách - anh Luân gọi thẳng là *"lỗi logic ghê"*.

**Rà lại toàn bộ cặp cha-con**, ít nhất: Lớp học → Vận hành lớp · Giảng viên → Hồ sơ GV · Nhân
viên → Hồ sơ NV · Khóa học → Hồ sơ khóa · Học viên → Hồ sơ 360.

### RB4 - ĐỪNG LẶP LẠI SAI LẦM V6
V6 sai **KHÔNG ở ý tưởng** (đo được: 100/114 việc làm được tại chỗ, so với 114/114 phải đổi màn ở
V5). V6 sai ở **CÁCH**: hai sản phẩm sống chung một nguồn, bật tắt bằng cờ `ITTS_V6` - 25 chỗ rẽ
nhánh, tour kéo người bản 5 sang trang bản 6 và ngược lại (anh Luân: *"lỗi kéo theo rất nghiêm
trọng"*), bảng cắm cứng `BVLAND`/`NAVTREE` âm thầm làm mất tính năng một bên, verify phải chạy
hai lượt.

**Nhánh git riêng không có bệnh đó: một nguồn, một thế giới.** Trên nhánh V2, **gỡ sạch** mã V6
còn sót (`V6()`, `NAVTREE6`, các nhánh rẽ trong bộ kiểm) - đừng để hai cờ cùng tồn tại.

---

## 3. CÁCH TÁCH NHÁNH VÀ DEPLOY

```bash
cd /home/user/tts-sop-structor
git fetch origin
git checkout -b claude/itts-v2 origin/claude/itts-sop-five-areas-jw5f2q   # kế thừa AC1-AC6
```
Repo demo riêng: **`mittomap/itts-sop-demo-v2`** → `https://mittomap.github.io/itts-sop-demo-v2`.
Chưa tồn tại - phải tạo (dùng `mcp__github__create_repository`, bật Pages), rồi chép `update.sh`
và cấu trúc `cong-nhan-vien/` + `cong-hoc-vien/` y như repo `itts-sop-demo`.

**BẪY ĐẨY DEMO - đã cắn nguyên một ngày 05/08:** trang demo online KHÔNG phục vụ ba file ở gốc
repo. Nó phục vụ `cong-nhan-vien/index.html` và `cong-hoc-vien/index.html`. Sau MỖI lần đẩy phải
đối chiếu mã bản dựng:
```bash
grep -oP 'id="navver"[^>]*>[^<]*<b>[a-f0-9]{6}' cong-nhan-vien/index.html | grep -oP '[a-f0-9]{6}$'
```
Mã này phải khớp `BUILD ID` mà `gen_v5.py` in lúc build. Không khớp = online vẫn bản cũ.

**Và bẫy thư mục dựng:** `gen_v5.py` mặc định ghi `_src/`. Muốn đẩy demo thì phải dựng ra gốc repo:
```bash
ITTS_OUT=/home/user/tts-sop-structor python3 _src/gen_v5.py
```

---

## 4. HIỆN TRẠNG - CÁI GÌ ĐÃ CÓ SẴN ĐỂ KẾ THỪA

### 4.1 Nguồn
- **`_src/gen_v5.py`** là NGUỒN DUY NHẤT (Python chứa toàn bộ HTML/CSS/JS trong chuỗi).
  **KHÔNG BAO GIỜ sửa tay** `ITTs_WebApp_v5_demo.html`, `ITTs_TrangHocVien_demo.html`, `ITTs_data.js`.
- Build + kiểm: **`./verify.sh`** (34 bộ kiểm, ~32 phút). `./verify.sh --nhanh` (~8 phút) bỏ phần
  trình duyệt. **Luật hai tầng: đang làm dở dùng `--nhanh`; TRƯỚC KHI ĐẨY chạy TRỌN BỘ, không
  ngoại lệ** - kể cả khi chỉ sửa một chữ, vì `check_sop.py` đòi những chuỗi chữ CHÍNH XÁC phải có
  trên màn.
- Dữ liệu demo: pipeline `gen_demo.py → seed_giaoan.py → mkdemo.py → fixdata.py → seed_giaoviec.py
  → check_data.py → check_logic.py`. **Chạy ĐỦ và ĐÚNG thứ tự, không idempotent.** Sửa dữ liệu =
  sửa Ở NGUỒN pipeline, không sửa tay JSON.

### 4.2 SÁU HUB PHẢI DỠ - và 25 tab đã trỏ sẵn vào trang thật
Bảng `HUBTAB` trong `gen_v5.py` đã khai đủ ánh xạ tab → khoá trang. **Việc chính là MỞ NẮP, không
phải dựng mới:**

| Hub | Số tab | Các khoá trang |
|---|---|---|
| `giangvien` | 2 | giangvien, bangcong |
| `tuyensinh` | 5 | nhaplead, test, tuvan, thanhtoan, reup |
| `hoctap` | 7 | buoihnay, lop, buoihoc, wow, lichtuan, gvdp, phong |
| `cskh` | 4 | khaosat, ghinhan, khieunai, ychv |
| `khac` | 2 | baoluu, magioithieu |
| `duyet` | 5 | duyetck, duyethoan, duyetnghi, duyetthu, banggiao |

**Tổng 25 trang.** Mỗi khoá đã có hàm vẽ riêng. Có `HUBCAU` khai sẵn **một câu ngữ cảnh cho từng
tab** - chuyển thẳng thành câu mở đầu của trang nghiệp vụ tương ứng, đừng viết lại.

### 4.3 Cơ chế đã có, dùng lại được nguyên
- **`NAVTREE`** - cây menu theo nhóm, có `arc:"changA"..."changD"` để gắn chặng. `arcGrpName()`
  sinh tên nhóm từ `ARCS` (một chỗ khai, không gõ tay hai nơi).
- **`PAGES`** + cờ `hide` - 39 trang đang khai `hide:1` (nghĩa là không hiện ở màn Cài đặt > menu).
- **Phân quyền hai tầng:** `ROLESCOPE.<vai>.pages` (thấy TRANG nào) + `CH3`/`CH3X` → `canAct()` /
  `chanAct()` (làm được VIỆC gì). `CH3X` là bảng việc app tự thêm, để RIÊNG khỏi `var CH3=[]` vì
  `check_sop.py` coi dòng thừa trong CH3 là lỗi.
- **Cấu hình:** hằng số nghiệp vụ qua `paramOf()`/`paramStr()`, câu nhắc qua `msgText()`, ngưỡng
  KPI qua `kpiTh()`. **Không cắm cứng số trong mã.**
- **`DOORS`** - bản khai cửa ghi theo bảng DL. Thêm một cửa ghi mà quên khai là bộ kiểm đỏ.
- **Nhãn enum** ghi NGUYÊN VĂN theo CH1, dạng `"code (Nhãn tiếng Việt)"`.

### 4.4 AC1-AC6 đã xong, V2 kế thừa sẵn
| | Nội dung | Chỗ nằm |
|---|---|---|
| AC1 | Trục lớp 1-1 vs nhóm (`lopLa11()`), thẻ 1-1/Nhóm ở 5 chỗ, bộ lọc riêng | dùng chung một hàm |
| AC2 | HAI tỷ lệ đạt AIM (thi thử = buổi FINAL, và thi thật DL18b), bóc theo GV/lớp/cơ sở/loại lớp | màn *Kết quả đầu ra & AIM* |
| AC3 | Giờ dạy thực tế, chia 1-1/nhóm/chi nhánh | Bảng công giảng dạy |
| AC4 | Buổi **MIDTERM** / **FINAL TEST** hiện trong dải buổi, đổi được người gán | Vận hành lớp |
| AC5 | Lịch sử đổi lịch + nút *Dời khóa học*, **dời theo Ô LỊCH** của lớp | Vận hành lớp |
| AC6 | Rubric chấm buổi dạy (5 tiêu chí 1-5 + 5 ô tích), cấu hình được | `rubricHTML`/`rubricThu`, dùng ở CẢ trang Điểm danh lẫn ngăn kéo |

---

## 5. VIỆC CỦA V2 - CHIA KHÚC

**Khúc 1 - Dựng khung.** Tách nhánh, tạo repo demo v2, gỡ sạch mã V6 còn sót, chạy `verify.sh`
trọn bộ một lượt để có mốc xanh trước khi động vào gì.

**Khúc 2 - Dỡ hub.** 25 tab thành 25 trang nghiệp vụ độc lập. Mỗi trang: tiêu đề riêng, câu ngữ
cảnh riêng (lấy từ `HUBCAU`), thẻ riêng, chip lọc riêng, dải cảnh báo riêng. Sidebar giữ chặng
(`NAVTREE` + `arc`). Xoá `HUBTAB`/`HUBCAU`/`hubCau`/`hubDef`/`hubTab`/`hubSubKey` sau khi dỡ xong.

**Khúc 3 - Sắp lại cha-con (RB3).** Rà toàn bộ cặp cha-con, cho trang cha lên menu, trang con vào
bằng cách bấm một dòng ở cha. Giữ ô xổ chọn nhanh ở trang con để người quen lối cũ không hụt.

**Khúc 4 - Một nghiệp vụ một cửa ghi (RB1).** Lập bảng khai `NGHIEPVU`, gom các bản dựng trùng về
một hàm, dựng bộ kiểm canh.

**Khúc 5 - Bàn làm việc = dải cảnh báo (RB2).** Mỗi trang nghiệp vụ khai `canhBao_*()`; trang đáp
chỉ đọc và xếp. Mở rộng `_checkdem.js` cho cả 25 trang.

**Khúc 6 - Rà theo chức danh.** Đóng vai từng chức danh trong 16 chức danh, đo bằng Playwright
thật: mỗi người mở app lên có thấy đúng việc của mình không, có nút nào chết không.

**Khúc 7 - Khép.** `verify.sh` trọn bộ xanh → cập nhật `02_NHAT_KY_QUYET_DINH.md` +
`ITTs_WebApp_v5_README.md` → đẩy nhánh → deploy `itts-sop-demo-v2` → đối chiếu mã bản dựng.

---

## 6. LUẬT GIAO TIẾP - ANH LUÂN ĐẶT, ĐỪNG BỎ QUA

> *"nhớ hiện running task để a biết e vẫn đang làm, lỡ em bị lỗi gì ko làm mắc công a chờ"*
> · *"a vẫn ko thấy dấu hiệu gì là em đang làm việc... nếu a thấy em im lìm là a đang mặc định
> e ko làm gì."*

**Anh Luân KHÔNG đọc được tiến trình bên trong, và NHÃN VIỆC CHẠY KHÔNG TỚI ĐƯỢC MÀN HÌNH ANH.**
Đã thử 07/08: bật `in_progress` và đổi `activeForm` từng bước, anh chụp màn lại - chỉ có **một dấu
sao xoay, không một chữ nào**. Thứ DUY NHẤT tới được anh là **chữ viết ra trong khung chat**.

- **Viết một dòng trạng thái NGẮN vào chat trước mỗi bước dài.** Dạng: *"Đang dỡ hub Học tập, 7
  trang (~10 phút)"*, *"Chạy verify trọn bộ, 32 phút, xong em báo"*.
- Đừng làm 20 phút liền rồi mới nói một lần.
- Việc dài thì **nói trước là sẽ mất bao lâu**.
- Chưa xong mà phải dừng thì **khai thẳng là chưa xong và đang vướng ở đâu**.
- Anh Luân: *"làm xong rồi cứ làm tiếp cho đến hết chứ em"* - **đừng dừng lượt sau khi thông báo**.

---

## 7. BỐN CÁI BẪY ĐÃ CẮN TRONG NGÀY 07/08 - ĐỪNG CẮN LẠI

| Bẫy | Hậu quả thật |
|---|---|
| `gen_v5.py` ghi `_src/`, `extract_js.py` đọc **gốc repo** | Đọc nhầm kết quả của **bốn bộ kiểm**, tưởng đã vá xong trong khi bản đó chưa hề dựng lại. Nay hai mặc định đã khớp. |
| Cùng bẫy ở **chiều đẩy**: `update.sh` đọc gốc repo | Lần đẩy demo hụt, `update.sh` báo "không có thay đổi" và im lặng. Chốt cửa duy nhất là **đối chiếu mã bản dựng sau khi đẩy**. |
| Script sửa nhiều chỗ **dừng giữa chừng nhưng chỉ ghi file ở cuối** | Báo "đã làm xong" - **sai**, không một sửa nào được lưu. Nay sửa từng bước, mỗi bước đếm lại ngay. |
| Ngăn kéo mở đè lên trang mà trang vẫn còn trong DOM | **Trùng id phần tử**, `getElementById` vớ trúng bản ở trang bên dưới. Người dạy chấm trong ngăn kéo mà app lưu điểm của trang. Form trong ngăn kéo phải có **tiền tố tên riêng**. |

**Và một quyết định sai đã tự sửa, ghi lại để đừng lặp:** từng **gieo một buổi lỗi vào dữ liệu
demo** để một nhánh tính năng có chỗ hiện ra. Sai - đó là làm bẩn bộ demo để khoe tính năng, rồi
phải đi khai miễn trừ ở từng bộ kiểm, mà mỗi lần khai miễn trừ là một lần hạ thấp cái thước. Chỗ
đúng của loại ca đó là **trong bộ kiểm**: tự dựng ca trong bộ nhớ, đo xong trả lại dữ liệu
(`_checkdem.js` mục D5 làm mẫu).

---

## 8. LUẬT CỨNG SỐ 0 - CAO HƠN MỌI LUẬT KHÁC

> *"Chúng ta viết app để phục vụ trọn vẹn SOP, nếu làm xong mà chưa thể hiện đủ 100% SOP tức là
> thất bại... Nhưng nếu chúng ta để thiếu sót những gì SOP đã từng mô tả, nếu chúng ta thấy nó
> không bị bất hợp lý, mà chúng ta làm sót, nghĩa là chúng ta sai."*

**THÊM thì được, BỚT thì không.** Dỡ hub là sắp xếp lại, **không được rơi mất một trang, một nút,
một cột nào**. `check_sop.py` canh bốn mặt: 357 cột DL · 93 trigger HD3 · 51 chỉ số BC2 · 31 hành
động CH3 · 12 màn VH0-VH11 + 9 bảng BC1-BC9. Nó chạy trong `verify.sh` - trang nào biến mất là đỏ.

---

## 9. VIỆC TỒN CÒN LẠI (ngoài V2)

- **#126 AD1** - trục trang nghiệp vụ cho các vai ngoài sale: **gộp vào V2**, không làm riêng.
- Ba quan sát cũ chờ anh Luân quyết (ghi ở `AUDIT_07_08_2026.md` mục 9d):
  NV Tư vấn và TP ACA chỉ với tới 1 nút hành động trên trang đáp · NV Marketing thấy 89 việc của
  người khác so với 30 việc của mình · một giáo viên ở Cơ sở 3 có mục Giao việc mở ra trống (sửa
  ở `seed_giaoviec.py`, bấm Reset demo không chữa được).
