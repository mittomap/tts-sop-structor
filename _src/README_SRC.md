# _src — MÃ NGUỒN WEB APP (bản tái tạo được)

Thư mục scratchpad (outputs) **bị xoá giữa các phiên**, nên toàn bộ nguồn web app được cất ở đây trong
thư mục BỀN. Phiên mới muốn sửa/tái tạo web app thì **copy `_src/*` ra thư mục làm việc rồi chạy**.

## Web app là gì
Một generator Python duy nhất `gen_v5.py` chứa template HTML khổng lồ + toàn bộ JS trong chuỗi.
Nó nhét `demo_data_big.json` vào chỗ `__DATA_JSON__`, nhúng font icon offline từ `tabler_inline.css`,
rồi xuất **3 file**:
- `ITTs_WebApp_v5_demo.html` — app nhân viên (boot `demoBoot()` → màn cổng chọn người).
- `ITTs_TrangHocVien_demo.html` — cổng học viên (boot `demoBootHV()`, `window.HVPORTAL`).
- `ITTs_data.js` — dữ liệu demo tách riêng (`window.ITTS_DATA`); app ƯU TIÊN file này, thiếu thì dùng bản nhúng. V9.7: thao tác offline lưu localStorage + đồng bộ đa cửa sổ + reset (xem 02 mục 3sexies).
Hai file DÙNG CHUNG CSS/JS — không bao giờ tách đôi logic; chỉ khác câu lệnh boot.

## File trong _src
| File | Vai trò |
|---|---|
| `gen_v5.py` | **NGUỒN DUY NHẤT** của web app (HTML+CSS+JS). Sửa ở đây rồi build. |
| `demo_data_big.json` | Dữ liệu demo (DL01-DL22, CH1-CH6, enum). Sinh bởi pipeline bên dưới. |
| `tabler_inline.css` | Font icon Tabler đã subset + base64 (offline). |
| `gen_demo.py` → `seed_giaoan.py` → `mkdemo.py` → `fixdata.py` → `check_data.py` → `seed_giaoviec.py` | Pipeline sinh & vá & kiểm dữ liệu demo (chạy theo đúng thứ tự này). |
| `seed_giaoviec.py` | **V9.20** - sinh `DL23` (giao việc) + `DL24` (trao đổi trong việc) theo quan hệ tổ chức thật trong DL01; mốc thời gian neo theo NGÀY CHẠY nên demo mở hôm nào cũng "sống". Chạy lại được nhiều lần (ghi đè 2 bảng đó). |
| `_tall.js` | Harness Node: render toàn bộ trang + soi lệch `<div>` + soi icon thiếu. |
| `_check1..11.js` | Suite kiểm 366 điểm (chạy `ITTS_OUT=<out> node _checkN.js` sau khi trích `_APP.js`). `_check11` = chặng vòng đời + NAVTREE + node + sopBlock. |
| `iconbuild/` | Nguồn dựng lại font: `tabler-icons.css` (map tên→mã), `fonts/tabler-icons.ttf`, `used.txt`, `uni.txt`, `sub.woff2`. |

## BUILD (chạy ở phiên mới)
Đường dẫn input đọc **cạnh script**; output ghi vào **`$ITTS_OUT`** (mặc định = cạnh script).
```bash
# 1) copy nguồn ra thư mục làm việc (thay <OUT> = đường mnt của outputs phiên này)
cp -r "<mnt>/SOP ITTs/_src/." <WORK>/ && cd <WORK>
# 2) build, ghi thẳng 2 HTML vào thư mục BỀN "SOP ITTs"
ITTS_OUT="<mnt>/SOP ITTs" python3 gen_v5.py
```

## Bản V6 đã ngừng phát hành (04/08)

Anh Luân chốt: *"Hủy V6 nhé em"* - mức **ngừng phát hành, giữ mã nguồn**. Nguồn không còn build
ra `ITTs_WebApp_v6_demo.html` / `_APP6.js`; `verify.sh` không còn mục 4bis; bốn bộ kiểm trình
duyệt chỉ chạy bản V5; trang chủ demo rút còn một bước.

**Vẫn còn nguyên trong `gen_v5.py`:** cờ `window.ITTS_V6`, hàm `V6()`, `NAVTREE6`, trang `ban`,
bài hướng dẫn `tq_ban`, mọi nhánh rẽ theo bản build. Muốn bật lại: bỏ dấu `#` ở ba dòng cuối
`gen_v5.py`, một dòng trong `extract_js.py`, và dựng lại mục 4bis trong `verify.sh` (ghi chú
của mục đó vẫn nằm nguyên chỗ cũ, kèm hai lỗi thật mà nó từng bắt được).

**Luật rút ra khi gỡ:** gỡ một tính năng thì phải đi tìm **mọi cái thước đang đo nó**. `_checkux`
có bảy phép kiểm viết riêng cho trang chủ hai bước; xoá cho im thì mất luôn phép canh *"cửa nào
trang chủ trỏ tới cũng phải có file thật"* - đúng loại 404 mà `update.sh` từng cắn. Nên với mỗi
phép kiểm phải hỏi lại: **nên xoá, hay nên đổi câu hỏi?**

## VERIFY (bắt buộc sau mỗi build)
> **Chạy một lệnh là xong: `./verify.sh` ở gốc repo.** Nó build lại, trích `_APP.js`/`_HV.js` rồi
> chạy toàn bộ bảng dưới đây, in xanh/đỏ và trả mã thoát. Bảng này để tra "bộ kiểm nào canh điều gì",
> không phải để gõ tay từng dòng.
>
> `_APP.js` / `_HV.js` sinh bằng `_src/extract_js.py` - **không** phải mã nguồn, đừng sửa.
>
> **Đồng hồ và đếm ngược (V9.96c).** Mỗi bộ in kèm thời gian chạy của chính nó và ước lượng
> **còn bao lâu nữa**; cuối bảng in tổng thời gian. Ước lượng lấy từ bảng giờ **đo được ở lượt
> trước trên chính máy này** (`_src/_thoigian_verify.txt`, `..._nhanh.txt` cho `--nhanh`; cả hai
> nằm ngoài git vì mỗi máy một tốc độ) - nên lượt đầu tiên trên máy mới chưa có đếm ngược, từ
> lượt hai trở đi càng chạy càng sát. Số đo trên máy cloud (03/08): **tổng 26m47s**, trong đó
> `_checkui` 8m12s + `_checknv` 4m09s + `_checkbam` 3m07s - tức mục 5 chiếm hơn nửa; muốn nhanh
> thì `./verify.sh --nhanh` (~11 phút, bỏ phần trình duyệt).

Bộ kiểm gồm **18 phần, phải xanh HẾT mới được giao** (~2.100 tiêu chí tự động + 488 lượt mở thật trong trình duyệt):
| Lệnh | Kỳ vọng |
|---|---|
| `node --check _APP.js` và `node --check _HV.js` | không báo gì |
| `ITTS_OUT=<out> node _tall.js` | `Render 39 trang \| 0 loi` + `Icon dung: 199 \| thieu trong font: khong` (từ V9.40 icon thiếu là ĐỎ THẬT) |
| `ITTS_OUT=<out> node _check11.js` | `TONG: 145`, KHÔNG có dòng `FAIL` |
| `ITTS_OUT=<out> node _check12.js` | `CHECK12 OK: 37 tieu chi` - một cửa vào, một luật |
| `ITTS_OUT=<out> node _check13.js` | `CHECK13 OK: 174 tieu chi` - KPI biết nói |
| `ITTS_OUT=<out> node _check14.js` | `CHECK14 OK: 179 tieu chi` - cổng học viên hai chiều + đổi cổng + thanh trên |
| `ITTS_OUT=<out> node _check15.js` | `CHECK15 OK: 39 tieu chi` - **kiểm kê cửa ghi + bất biến nghiệp vụ** (bản khai cửa ghi nay đọc thẳng `DOORTB` của app - xem V9.31) |
| `ITTS_OUT=<out> node _check16.js` | `CHECK16 OK: 665 tieu chi` - học phí theo đợt + vá V9.27 + bấm-tên-ra-drawer + địa chỉ từng trang + **màn Cài đặt tự giới thiệu** (mục 24bis `CFNHOM`, 24ter `SETMOTA`) |
| `ITTS_OUT=<out> node _checkaudit.js` | `CHECKAUDIT OK: N tieu chi` - **bộ kiểm dựng theo CÁCH ANH LUÂN TÌM RA LỖI**. Anh Luân đặt (31/07): *"E thử phân tích xem những gì a phát hiện, xem a phát hiện bằng cách nào thì e tạo ra cách audit tương tự."* Đọc lại 43 phát hiện của anh trong các phiên gần đây, rút ra **8 phương pháp**, rồi bắt máy chạy lại chúng. Bộ này KHÔNG làm lại việc của 19 bộ cũ - nó nhắm vào 5 phương pháp chưa ai canh (chiếm 28/43 phát hiện): **M1 ĐỐI XỨNG** (13/43 - "chỗ kia có mà chỗ này không": mọi trang bảng phải tìm/lọc/xuất/chọn cột được; ba cổng phải cùng bộ công cụ vỏ; một việc chỉ một tên, đếm trên chữ HIỆN RA chứ không đếm chú thích mã nguồn); **M2 LUỒNG HAI ĐẦU** (5/43 - mọi loại việc app sinh ra phải có màn bên kia nhận; nghiệp vụ hai chiều không được làm một nửa - có `handover_until` thì màn bàn giao hàng loạt phải có ô trả lại); **M4 DƯ THỪA & RỖNG** (5/43 - cột khai mà 0/N dòng có dữ liệu, tab vẽ ra rỗng, hai khối trùng tên trên cùng một trang); **M7 SỐ PHẢI SỬA ĐƯỢC** (3/43 - quét câu hiển thị tìm "số + đơn vị nghiệp vụ" nằm trần, không đi qua `slaChip`/`paramOf`; chỗ nào cố ý để trần phải khai vào `SO_BOQUA` **kèm lý do đọc được**); **M8 CHỖ ĐỨNG** (2/43 - màn đọc bảng người không được nằm trong nhóm tiền). **Từ V9.68 thêm nhóm M9 - GIỌNG VĂN & ĐỘ DÀI** (anh Luân: *"Việc cần cấp quản lý gật đầu? Ai lại dùng mấy từ như gật đầu trong app hả em? Chuyên nghiệp?"*): hai luật cùng một gốc - chữ trên màn là chữ của một phần mềm vận hành, không phải lời kể. (a) **bảng từ cấm** kèm bản thay thế đúng nghĩa (gật đầu → phê duyệt, kẻo → tránh để, dắt tôi → xử lý từng bước), để bộ kiểm không chỉ nói "sai" mà nói luôn "nên viết gì"; (b) **trần 150 ký tự** cho đoạn nhắc đầu trang - đo được 19/25 dải nhắc dài quá 110 ký tự, dài nhất **557**, tức năm dòng chắn ngang đầu trang mà ngày nào cũng phải lướt qua. Phần giải thích chuyển vào chú thích rê chuột qua dấu ngắt `||` của `goiyG`. Đo trên **chữ hiện ra** (vẽ thật mọi trang rồi bóc thẻ), không đo mã nguồn - chú thích mã nguồn viết cho người sửa app đọc. **Từ V9.66 thêm nhóm M4b - MÃ MA**: câu lọc `isc(x.cột,"mã")` bằng một mã KHÔNG CÓ trong danh mục CH1 chạy êm ru, không lỗi JS, chỉ trả về false mãi mãi - loại lỗi độc nhất vì nó không bao giờ báo gì. Bộ kiểm đọc `ENUMMAP` (cột -> danh mục) và `DATA.enums` của chính app rồi soi mọi lời gọi trong mã nguồn; chỉ xét cột NÀO CÓ khai danh mục - cột không khai thì không có quyền phán. Lần quét đầu ra 8 chỗ, bốn chỗ sai thật: `enrollment_status "active"` (chỉ số TCR của BC2 đọc 0% vĩnh viễn) · `re_enrollment_status "declined"` (đúng là `rejected` - giục mời lại người đã từ chối) · `class_status "completed"/"closed"` (đúng là `finished` - lớp đã xong vẫn ăn chip "Đang học") · `homework_status "submitted"` (ô bài chờ chấm luôn bằng 0). Cộng ba luật **TIỆN DỤNG** anh Luân đặt lên trên hết: sổ chỉ-xem phải có đường ra chỗ làm việc (nút đầu trang, nút trên dòng, hoặc mở hồ sơ); mọi chức danh mở app lên phải thấy việc ở trang đáp của mình (đóng vai TRỌN - `applyScope` + `CURSTAFF`, thiếu vế sau là mọi danh sách ra 0 dòng rồi đổ oan cho app); danh sách ra 0 dòng phải nói vì sao. **Từ V9.65 thêm nhóm M6b - TỪ VIẾT TẮT HIỆN RA MÀ KHÔNG TRA ĐƯỢC**: vẽ THẬT mọi trang, đếm từ viết tắt trên màn, rồi hỏi từ điển từng cái. Đo lần đầu: **118 từ hiện ra, từ điển định nghĩa 10**. Luật này có ba lớp lọc mà mỗi lớp đều học từ một lần đo sai: (a) **phạm vi** - chỉ đòi định nghĩa cho từ do CHÍNH APP viết ra, không đuổi theo tên khóa học trong dữ liệu demo (GOLD, PRIME, EVO); (b) **mảnh chữ Việt** - "CHẶNG" bị `\b` cắt thành CH+NG vì `Ặ` không phải ký tự từ theo ASCII, nên phải đọc ngữ cảnh **theo vị trí** chứ không bắt bằng nhóm (nhóm đuôi ăn mất ký tự có dấu, khiến cả bộ lọc im lặng không làm gì), và dải chữ hoa phải phủ **ba khối Unicode** chứ `À-Ỹ` chỉ phủ hai; (c) **cụm viết hoa nhấn mạnh** - "GỌI NGAY" là câu nhấn giọng, không phải từ viết tắt. Chỗ nào cố ý để trần thì khai `TAT_BOQUA` **kèm lý do đọc được**. **Bốn lỗi thật bắt được ngay lần chạy đầu**: cột "GV chính" ở bảng Lớp học trống trơn 22/22 dòng dù 21 lớp có giáo viên (`derNames` chỉ điền cột `_name` ĐÃ CÓ SẴN - nay đi hai chiều); `LISTCFG.dsthanhtoan` khai `lam:"thanhtoan"` mà nút không bao giờ vẽ vì `phead` bị bỏ khi danh sách được nhúng vào hub; 6 cửa sổ thời gian cắm cứng trong nhãn ô thẻ ("7 ngày", "30 ngày"); và app **hứa với học viên** "đăng ký trong 30 ngày để giữ ưu đãi" với con số không ai đổi được. |
| `ITTS_OUT=<out> node _checkchuoi.js` | `CHECKCHUOI OK: N mat xich` - **chuỗi phối hợp NHIỀU NGƯỜI**. Anh Luân đặt (05/08): *"Nhớ kiểm tra logic nghiệp vụ khi phối hợp nhiều người nha. Ví dụ: học viên gửi xin nghỉ học, thì tiếp theo là gì, ai duyệt, rồi thế nào thế nào...."* Mọi bộ kiểm trước đó soi TỪNG MÀN của TỪNG NGƯỜI - không cái nào đi hết một việc đi qua tay hai ba người, mà đó mới là chỗ dễ đứt. Sáu chuỗi: **HV xin nghỉ buổi · HV gửi yêu cầu/câu hỏi · thu tiền rồi kế toán đối soát · chiết khấu vượt mức · giao việc nội bộ bốn nhịp · khiếu nại ba người**. Mỗi chuỗi đo sáu mắt xích và chạy THẬT trên dữ liệu thật: (1) có cửa gửi - ghi được một dòng; (2) vào đúng hàng chờ; (3) đúng người thấy, người ngoài KHÔNG thấy; (4) chuông/SLA của người phải xử lý có đếm; (5) bấm xử lý thì trạng thái đổi thật và RỜI hàng chờ, có ghi ai làm lúc nào; (6) quay lại cổng người gửi thì đọc được kết quả. **Bắt được ngay lần chạy đầu**: ô "Chờ tôi xác nhận (N)" trên trang Giao việc dẫn sang nhóm lọc "Đang chạy" - mà nhóm ấy chỉ có việc *mới giao* và *đã nhận*, KHÔNG có việc *đã báo xong*. Nghĩa là mắt xích cuối của chuỗi giao việc (người giao xác nhận) không có cửa nào dẫn tới: bấm vào ô đếm 3 việc thì mở ra danh sách không có ba việc ấy. Đã thêm nhóm lọc "Chờ tôi xác nhận" riêng. |
| `ITTS_OUT=<out> node _checkcau.js` | `CHECKCAU OK: N tieu chi` - **CÂU TRÊN MÀN CÓ TỰ MÂU THUẪN KHÔNG.** Nêu 11/08, làm 15/08. Hai ca thật đẻ ra nó: *"còn NaN"* và *"quá 9 ngày"* cho một lớp **còn 9 ngày nữa mới khai giảng** - hai vế ngược nhau mà mỗi vế đọc riêng đều hợp lệ. Mọi bộ trước đó đo CẤU TRÚC (có nút không, có tràn không) hoặc đo SỐ (thẻ khớp danh sách không); không bộ nào ĐỌC CHỮ rồi hỏi *câu này có nghĩa không* - chỗ hở ấy chỉ người đọc mới thấy, và người đọc duy nhất là anh Luân. Vẽ THẬT mọi trang + mọi sổ, đóng vai từng nhóm chức danh, cộng ba cách xem của Việc hôm nay; sáu phép: **số hỏng in ra màn** (NaN/undefined/null/Infinity) · **số âm ở chỗ chỉ có nghĩa khi dương** · **đếm 0 mà vẫn giục làm ngay** · **hai mốc thời gian ngược nhau** · **đơn vị dính vào nhau** (`2giờ30`) · **chỗ trống chưa thay giá trị** (`{0}`, `___`). **BẪY CẮN NGAY LƯỢT CHẠY ĐẦU CỦA CHÍNH NÓ:** bóc HTML thành chuỗi phẳng làm *"Không có phiếu nào bị bỏ quên"* dính với *"12 lớp"* ở thanh công cụ cách nửa màn - báo oan 20+ chỗ; nay thẻ KHỐI thành xuống dòng, soi từng dòng. **Hai phép đã viết rồi BỎ** (ghi trong file để người sau khỏi viết lại): *"vừa nói không có gì vừa đếm ra số"* bắt một khoảng thời gian, *"tỷ lệ ngoài 0-100%"* bắt một ngưỡng và một mức tăng - **thà ít phép mà phép nào cũng đáng tin**. **Thử ngược thật:** chèn 6 câu hỏng, mỗi câu nhắm một phép, cả 6 đều bị bắt; gỡ ra thì xanh lại. |
| `ITTS_OUT=<out> node _checkdemo.js` | `CHECKDEMO OK: N tieu chi` - **mở app vào BẢY THỨ trong tuần**. Anh Luân đặt (31/07): *"nhớ cấu hình nút reset demo để luôn có 1 bộ demo chuẩn ngay sau khi reset. Thực sự chuẩn."* Vì sao 20 bộ kiểm cũ không bắt được: chúng đều chạy vào **đúng một ngày** - hôm nay. Mà app kéo dữ liệu demo theo **bội số 7 ngày** (giữ nguyên thứ trong tuần), nên mỗi thứ nhìn thấy một lát cắt KHÁC của cùng bộ dữ liệu; chỗ trống ở lát cắt nào thì **mãi mãi trống đúng thứ đó**. Đo thật trước khi viết: ô "Buổi WOW hôm nay" đọc T2=1 T3=**0** T4=3 T5=2 T6=3 T7=2 CN=2 - mở app thứ Ba là không có buổi nào. Cách làm: nạp lại `_APP.js` **bảy lần**, mỗi lần giả `Date` lệch thêm một ngày (đặt ở tuần thứ tư, 28-34, để phép kéo **thật sự chạy** - chọn 0-6 thì `tshDays` trả 0 suốt, xanh mà chưa thử gì), đặt đúng lá cờ `ITTS_DEMO_FORCESHIFT` mà nút Reset đặt rồi để `demoBoot()` tự kéo, sau đó **đóng vai từng nhân viên có thật** và hỏi bảng việc của chính họ. Ba luật: (a) hỏi bằng hàm của app (`BANGVIEC`, `RENDER`), không chép lại phép đếm; (b) ô nào ĐƯỢC PHÉP rỗng phải khai `RONGDUOC` **kèm lý do đọc được** (kiểu "Quá hạn" - ô ta MUỐN bằng 0; "Nguồn đang kém" - mọi nguồn trên ngưỡng CVR là tin tốt); (c) ô là **của riêng tôi** (`gvSo("doing")`) thì phải đóng vai mới đo được - đo bằng quyền toàn quyền ra 0 rồi báo đỏ oan sáu chức danh (đã cắn). **Bốn lỗi thật bắt được ngay lần chạy đầu**: ô "Bài tập chờ chấm" lọc mã `submitted` không hề tồn tại nên đọc 0 suốt nhiều bản trong khi có 188 bài chờ; phiếu test đã thi chưa chấm không thuộc về ai nên NV WOW mở app thấy ô "Test chờ chấm" bằng 0 đúng lúc có 7 phiếu chờ chính họ; bộ phận Nhân sự chỉ được chia việc "Mới giao" nên ô "Đang làm" chưa bao giờ sáng; và hai ô "Lead chưa ai phụ trách"/"Buổi thiếu mốc giờ" không có tình huống trong dữ liệu demo. |
| `ITTS_OUT=<out> node _checkdata.js` | `CHECKDATA OK: 27 luat ... 0 cho lech` - **dữ liệu demo có khớp ga nghiệp vụ không** |
| `ITTS_OUT=<out> node _check17.js` | `CHECK17 OK: 411 tieu chi` - **bộ máy lọc chuyên sâu** (kết hợp trục, lưu theo người) |
| `ITTS_OUT=<out> node _check18.js` | `CHECK18 OK: 177 tieu chi \| da ve 84 trang/tab` - **hội đồng audit tự động**: vẽ THẬT mọi trang/tab, mọi trang qua mắt 8 chức danh, cổng học viên qua mọi hồ sơ; từ V9.31 kiêm luôn **nhật ký thao tác + hoàn tác + bộ nhớ tạm bảng tra** (bấm cửa ghi thật, lùi lại thật, và bắt chốt chặn từ chối lùi) |
| `ITTS_OUT=<out> node _checkux.js` | `CHECKUX OK: 189 tieu chi \| 85 form ghi` - **trải nghiệm & tiện ích của form ghi**, đo trên TOÀN BỘ 81 form chứ không vá lẻ. Bốn thứ "làm không tới" dễ mắc nhất, đều canh được: (1) **ô chọn ngày để trống** - mở form ra mà ô ngày trắng là bắt người ta gõ lại từ đầu; mọi `<input type="date">` trong form ghi phải có sẵn `value` hợp lý (`isoDay`/`isoCong`/`isoHen`); (2) **form câm** - có ô nhập mà không một dòng nào nói lưu xong thì chuyển gì, luật nào áp dụng; thiếu cả `notebar`/`fhint`/`ctxRows` là đỏ; (3) **ô đính kèm chết** - mỗi `attachBox("x")` phải có `attachLine("x")` hoặc `attachVal("x")` ở đường ghi, và không được khai `var _xK=attachLine(...)` rồi bỏ đó (đã cắn với `_tsK`); (4) **dòng giải thích nói dối** - số trong `notebar` phải đi qua `slaChip`/`paramOf`, và tên tham số gọi ra phải có thật trong CH2 (bắt được `slaSurveyReport_hours` xưa nay `naFor` đọc mà CH2 chưa khai). Mục 4 còn vẽ THẬT sáu drawer rồi soi HTML trả về, phòng trường hợp biểu thức đúng nhưng chạy ra rỗng. **Từ V9.54 thêm bốn nhóm:** (5) **con số dẫn xuất giấu cách tính** - vẽ thật mọi trang, tìm mọi số %, đòi mỗi con có chú thích trên chính nó hoặc trên ô bao; chú thích tính-lúc-rê (`data-tipfn`) thì GỌI THẬT hàm rồi đọc chữ chứ không đếm thuộc tính (304/304 con phải nói được tử/mẫu); (6) **bánh răng quăng người dùng đi** - cả bốn loại bánh răng phải mở ngăn kéo sửa tại chỗ (`cfPop`/`msgPop`/`kpiPop`/`enumPop`), lưu xong phải `reRender(CUR)`, và ngăn kéo vẫn phải chừa lối sang trang Cài đặt; (7) **chặng không khai sản phẩm đầu ra** - cả 17 chặng phải có ít nhất một hồ sơ kể ra được sản phẩm, chú thích hạt phải có số bước + sản phẩm + lời mời bấm, ngăn kéo Hành trình phải bấm được vào từng chặng; (8) **ô bấm nói dối** - ô nào onclick có `go(` mà chú thích vẫn hứa "lọc danh sách bên dưới" là đỏ, và bấm TÊN trong bảng không được đổi trang; kèm 3 tham số ngưỡng từng cắm cứng phải có mặt trong CH2. **Từ V9.55 thêm nhóm (9) thang thiết kế**: app từng có **202 mã màu** (118 mã dùng đúng một lần, 26 sắc trắng cho cùng một việc), **28 bậc cỡ chữ**, **17 bậc bo góc** - không phải chỗ nào sai hẳn, mà cả trăm chỗ lệch nhẹ, đúng thứ mắt bắt được mà không gọi tên được. Bộ kiểm chốt trần: ≤110 mã màu · ≤20 bậc chữ · ≤10 bậc bo góc · `.fbar` và `.tbar` phải cùng bo góc/đệm/khe/gap · không trang nào tự đặt khoảng cách dưới `.panel` (để CSS lo, nếu không mỗi trang một nhịp) · class nút chỉ một thứ tự `btn <màu> sm`. **Từ V9.59 thêm nhóm (10) hệ thẻ**: mọi lời gọi `statStrip` phải truyền **mã dải** (trừ `bvStrip` - đó là hàng chờ việc, không phải thẻ); mã thẻ duy nhất toàn app; thẻ nào cũng có tên đọc được và câu chú thích **có chỉ chỗ xem danh sách**; chạy thật ở 9 chức danh + mọi màn chi tiết rồi đối chiếu **số thẻ khai với số thẻ vẽ ra** (dải nào cắt bớt thẻ theo chức danh thì phải nói thẳng mã từng thẻ); **không thẻ nào còn `onclick`**; dải nào cũng có nút `Thẻ (n/N)`; tắt một thẻ thì thẻ đó **biến mất thật** và nút đếm lui một; sửa chú thích thì đọc lại đúng bản đã sửa và trả về mặc định được; hai nửa "vừa ở Cài đặt vừa trên trang" phải cùng tồn tại và cùng ghi vào `DATA.config`; và **câu chú thích không được chỉ vào chip/nhóm KHÔNG CÓ trên trang đó** - phải bóc hết `data-tip` ra khỏi HTML trước khi tìm, nếu không câu nào cũng tự chứng minh được cho chính nó. **Nhóm (11) chữ "room" không được hiện ra**: không màn nào (kể cả màn đăng nhập và Cài đặt) còn chữ "room", `roomStatus`/`roomBtnHTML` phải XOÁ HẲN, **nhưng** `roomAuto`/`roomCast`/`roomCastState` phải còn sống và còn tự bật - canh một vế thôi thì có người tiện tay bỏ luôn cơ chế đồng bộ nhiều máy. **Từ V9.99m thêm nhóm (12) cửa dẫn đi đâu**: gom mọi đích `go('X')` trong `_APP.js` (đọc bản build chứ không đọc `gen_v5.py` - chú thích trong nguồn có nhắc tên cửa, đếm cả chú thích là đi canh một cửa không tồn tại), chạy qua đúng các bảng remap của `go()`, rồi hỏi ba câu: **trang có thật trong `PBK` không** (không thì bấm vào im lặng không có gì xảy ra - `go()` gặp key rỗng thì `return`), **trang không có mục menu đã được khai là trang chi tiết chưa** (9 trang: `hoso`, `hosogv`, `hosonv`, `hosokhoa`, `baitap`, `chay`, `hoidap`, `nhansu`, `ban` - mỗi dòng khai phải nói được **mở ra từ đâu**), và **bản khai có dòng nào thừa không** (khai một trang rồi gỡ trang đó đi thì dòng khai nằm lại vĩnh viễn). Sinh ra vì gỡ V6 xong vẫn còn ba cửa V5 gọi `go('ban')` mà không cái thước nào hỏi cửa ấy dẫn tới đâu - đúng cái bẫy "đèn xanh trên một phép đo đã mất". |
| `ITTS_OUT=<out> node _checkmien.js` | `CHECKMIEN OK: n/TRAN cho du lieu ngoai mien` - **dữ liệu nằm ngoài miền của chức danh**. App có bản khai miền cho từng nhóm (`DSDEF`: lead · hocvien · lop · tien · baocao · viec · nhansu · noidung, mỗi miền một mức all/team/mine/none), nhưng bản khai ấy chỉ được `srows`/`canRow` tôn trọng ở tầng ĐỌC BẢNG - còn dải thẻ, câu mở đầu, dải phễu, cột bảng thì vẽ thẳng không ai hỏi lại. Bộ này đóng vai TỪNG NGƯỜI, vẽ thật mọi trang họ thấy, rồi tìm dấu hiệu của miền mà họ khai `none` (số tiền, chữ công nợ/học phí/chiết khấu; chữ lead/phễu/test đầu vào). Cố ý BỎ QUA chữ do người dùng tự gõ (tiêu đề việc giao) - đó là chữ của họ, tố vào đó là tố oan. **Ngưỡng `TRAN` là một cái chốt kéo xuống**: quá số đang có là ĐỎ (có chỗ mới sinh ra); sửa được chỗ nào thì hạ `TRAN` xuống đúng số mới, không bao giờ nâng lên. Sinh ra 04/08 khi anh Luân mở màn Trưởng phòng ACA: *"nó hiện ra những cái mà chức danh này ko cần á... rồi đóng tiền gì tùm lum trong đó"*. **05/08 - bản đầu của chính bộ kiểm này ĐỂ LỌT bốn màn Chặng:** vòng lặp bỏ qua mọi trang `hide:1`, mà `chang` đúng là một trang `hide:1` (bốn mục C1-C4 trỏ vào nó qua `window.ARC`). Nay nó vẽ thêm mọi chặng mà `arcXem` cho phép, đúng cách app dựng. Sửa xong 12 chỗ, `TRAN` hạ từ 15 xuống **0** - từ nay bất kỳ chỗ ngoài miền nào mới sinh ra đều đỏ ngay. Hai chỗ miễn trừ có ghi lý do trong `MIENTRU`: bảng công của Nhân sự có đơn giá công giảng dạy và loại ca test - đó là lương và loại ca của giảng viên, không phải học phí học viên hay kho lead. |
| `ITTS_OUT=<out> node _checkqa.js` | `CHECKQA OK: N tieu chi` - **hộp Hỏi đáp**. **Từ V9.66 canh thêm BỐN NHÁNH TRẢ LỜI bằng một bảng hợp đồng**: đo thật trước khi làm - cho hộp 15 câu một quản lý hỏi mỗi ngày, nó trả lời đúng **1**. Mười bốn câu còn lại rơi vào nhánh "chỗ cấu hình": hỏi "có bao nhiêu học viên nguy cơ" thì nó chỉ vào ô chỉnh NGƯỠNG nguy cơ, không nói con số. Có câu sai hẳn - "hạn chấm bài là bao lâu" ra ngưỡng gọi lead, chỉ vì chữ "lâu" hiếm trong kho nên trọng số ngược tần suất cho nó điểm rất cao (chữ của CÂU HỎI, không phải chữ của CHỦ ĐỀ - nay nằm trong danh sách từ đệm). Bảng hợp đồng ghi mỗi câu hỏi + nhánh BẮT BUỘC (`so` / `kpi` / `hethong`), cộng luật "hỏi mã lớp phải ra hồ sơ lớp", "hỏi tên khóa phải ra hồ sơ khóa", và "mỗi mục số liệu phải chạy được, phải có nút mở màn làm việc và có lời giải thích số đó đếm gì". Sau bản này: **13/15**.  Canh theo đúng thứ tự nguy hiểm: (1) câu vô nghĩa PHẢI ra "chưa hiểu" - trả lời bừa còn tệ hơn không trả lời; (2) câu trả lời nghiệp vụ phải đọc lại CHÍNH bộ luật app đang chấp hành (đổi ngưỡng CH2 thì câu cảnh báo phải đổi theo - ai viết tay một đoạn mô tả là đỏ); (3) bí thì phải có gợi ý và phải ghi vào sổ câu hỏi chưa trả lời được |
| `ITTS_OUT=<out> node _checktour.js` | `TOUR OK: menu cap do + moi bai chay het buoc, 0 loi` - 12 bài / 66 bước, mọi neo `@ma` phải trỏ trúng. Từ V9.44 kiêm luôn **lời hứa "mỗi chức danh một trợ thủ và một hướng dẫn riêng"**: đóng vai từng nhóm vai rồi hỏi ba câu (có bài hướng dẫn riêng · có nhịp ngày ≥3 dòng · có bảng việc ở trang đáp), cộng một câu nữa - mọi nhịp có thật đều phải sửa được trong Cài đặt (nhịp của NV WOW từng tồn tại mà ô chọn không liệt kê, nên không ai với tới) | **Từ V9.60 soát TOÀN BỘ chức năng tour theo 5 mặt**: (1) neo `@x` phải trỏ đúng MỘT phần tử trên trang có bước đó - neo trùng nhau thì `querySelector` lấy cái đầu tiên và im lặng tô sáng nhầm chỗ; (2) neo theo CHỮ thì chữ đó phải có thật trên trang (đã gỡ mã hoá HTML trước khi so, và gieo đúng lớp/học viên mà chức danh đó được xem); (3) bước không được dẫn vào trang chính chức danh của bài không có quyền vào - mục này bắt được 2 lỗ phân quyền chứ không phải lỗi tour; (4) bước phải đủ tiêu đề + mô tả + câu "Việc cần làm"; (5) hàm `chk` không được ném lỗi. **Từ V9.64 siết thêm ba luật và vá một chỗ giả xanh:** (a) **cấm hẳn selector CSS thô** - bản trước cho 13 bước trỏ `.notebar`/`.pbody`/`.jgrid`/`.dt` miễn là *khai ra* trong mảng `KHUNG`; khai xong thì bộ kiểm xanh suốt mà bước "Ba tầng phân quyền" vẫn khoanh vào dải nhắc XEM THỬ - khai một cái sai không làm nó thành đúng, nay mọi bước phải dùng `@ma-neo` hoặc `@txt:`; (b) **neo phải có mặt ĐÚNG trên trang của bước đó** - trước chỉ hỏi "mã này có tồn tại ở đâu đó trong app không", nên bước đứng ở trang A trỏ mã chỉ có ở trang B vẫn xanh; (c) **neo phải là DUY NHẤT trên trang đó** - trùng thì `tourFind` lấy cái đầu tiên, tuỳ hên; (d) **cơ chế cập nhật tour**: trang nào người dùng vào được từ menu mà không bài nào đi qua thì phải khai lý do đọc được ở `TOUR_BOQUA`, không thì đỏ - trang mới thêm vào app không im lặng thiếu người hướng dẫn được nữa. **Hai chỗ giả xanh đã vá:** đọc không được bản build thì trước đây `return` im lặng (tự tắt cả một mục kiểm mà bảng tổng kết vẫn xanh) - nay ĐỎ; và bộ kiểm đóng vai bằng `applyScope()` mà hàm đó **không đặt `CURSTAFF`**, nên NV001 có 31 lead lại đo ra 0 dòng rồi đổ oan cho app - nay dùng `dongVai(sid)` đặt cả phạm vi lẫn danh tính.
| `python3 check_logic.py` | `KET QUA: DAT` - từ V9.40 script tách "lỗi thật" khỏi "ca cố ý" (việc quá hạn để demo cảnh báo đỏ, số này TRÔI theo ngày) và in một dòng kết luận ổn định |
| `ITTS_OUT=<out> node _check16.js` | `CHECK16 OK: 702 tieu chi`. **Từ V9.64**: bảng công giảng dạy đã rời Sổ thu học phí sang tab của trang Giảng viên, nên mục kiểm đi theo nó - và thêm một tiêu chí canh **cả hai đầu**: bảng công phải có ở trang Giảng viên VÀ không được còn ở Sổ thu học phí, để nó không lẳng lặng quay về chỗ cũ. **Từ V9.61 canh TẦNG 1 PHÂN QUYỀN**: màn Cài đặt phải có bảng bật/tắt từng trang cho từng nhóm chức danh (≥200 ô), bảng có neo riêng cho bài hướng dẫn, và - quan trọng nhất - **bấm một ô thì phạm vi THẬT phải đổi theo** (`buildScope` đọc lại được), trả về mặc định phải sạch hẳn, tắt trang đáp thì app phải tự lùi về trang khác còn bật. Canh bằng cách chạy thật chứ không đọc chữ trên màn. **Từ V9.62 canh BA CHỖ KHOÁ**: cổng nhân viên phải làm mờ hết thẻ chức danh và không thẻ nào còn bấm được; bấm vào Cài đặt khi chưa chọn chế độ thì `CUR` KHÔNG được đổi (chặn ở CỬA VÀO, không chặn trong trang); nhập sai mật khẩu thì không mở được quyền ghi; mọi cửa vào Reset demo đều đi qua hộp mật khẩu. **Bẫy đã cắn**: stub `sessionStorage` trong bộ kiểm từng trả về `null` vĩnh viễn nên ba tiêu chí này không bao giờ cắn - stub phải NHỚ THẬT. |
| `python3 check_data.py` | `KET QUA: DAT`. **Từ V9.59 có quy tắc 15 "demo phải sống ở mọi nơi học và mọi ngày"**: mỗi cơ sở trong 5 chi nhánh + online phải có học viên đang học và lớp đang chạy/đang tuyển; và trong 14 ngày tới **không ngày nào** được rỗng hẹn liên hệ hoặc rỗng buổi WOW - canh THEO TỪNG NGÀY chứ không canh tổng, vì tổng đẹp mà dồn cục một ngày thì sáu ngày còn lại vẫn trống. |
| `python3 check_gs.py` | `KET QUA: DAT` - **lớp Google Sheets đã nghỉ hưu (30/07), canh cho nó không lén quay lại**: không file `.gs` nào trong kho, và 66 chỗ gọi máy chủ trong `gen_v5.py` đúng bằng bản khai. 66 chỗ đó giữ CÓ CHỦ Ý - chúng là đường nối ra backend tương lai, mỗi chỗ một cửa ghi; thêm cửa ghi mà quên nối là đỏ. Đầu file `check_gs.py` ghi rõ đã đối chiếu từng file `.gs` trước khi xoá, không mất luật nghiệp vụ nào |
| `python3 check_sop.py` | `KET QUA: DAT` - **đối chiếu SOP gốc, TÁM mặt** (14/08 ĐẠT trọn tám): 357 cột DL · 93 tình huống sổ trigger HD3 (chạy THẬT `naFor()` trên mọi dòng) · 51 chỉ số bảng BC2 (phải có cả công thức lẫn dòng ngưỡng CH6) · 31 hành động bảng phân quyền CH3 (đóng vai từng chức danh rồi hỏi lại `canAct`, và mỗi việc "Quản lý phê duyệt" phải có cửa ghi gọi `chanAct`) · **12 màn vận hành VH0-VH11 và 9 bảng báo cáo BC1-BC9** (vẽ THẬT mọi trang, mọi tab, mọi danh sách, cộng bảng việc của từng chức danh, rồi tìm chuỗi phải có). · 26 thuật ngữ CH5 · **cột "Người phụ trách" của sổ HD3** (81 tình huống, app phải biết ai làm) · **bốn sheet cấu hình CH1/CH2/CH4/CH6** - bốn LUẬT CỨNG của dự án, đối chiếu từng nhóm enum, từng tham số `paramOf`, từng câu `msgText`, từng ngưỡng `kpiTh`. Chỗ nào cố ý không làm phải khai vào `BOQUA` / `TRIG_BOQUA` / `KPI_BOQUA` / `CH3_BOQUA` / `VHBC_BOQUA` / `CH_BOQUA` **kèm lý do đọc được**. **Bẫy vận hành:** `check_sop` đọc `_APP.js`, mà `_APP.js` chỉ đúng khi trích bằng `ITTS_OUT=<gốc repo> python3 _src/extract_js.py` - quên biến ấy là trích nhầm bản cũ |
| `ITTS_OUT=<out> node _checkui.js` | `CHECKUI OK: da mo THAT 492 luot` - **kiểm thử trên trình duyệt thật** (cần `npm i playwright` một lần; máy không có Chromium thì tự BỎ QUA chứ không báo đỏ bậy) | **Từ V9.62**: bộ kiểm phải ĐÓNG VAI NGƯỜI DÙNG ĐÃ CHỌN chế độ Cài đặt trước khi quét (`cfSetMode("that")`), và **đóng ngăn kéo còn sót trước mỗi màn**. Không làm vậy thì `go("settings")` chỉ mở popup hỏi chế độ chứ không điều hướng: 19 tab Cài đặt không tab nào được đo, mà ngăn kéo popup nằm mở suốt các màn sau, kéo theo hàng loạt báo "thò ra ngoài màn" hoàn toàn giả. **Luật: thêm một cửa chặn thì phải hỏi lại - bộ kiểm có biết gõ cửa không?* **Từ V9.67 chữa một chỗ ĐO NHẦM đã im lặng nhiều bản**: nó đo `documentElement.scrollWidth`, mà tràn ngang trong app này xảy ra BÊN TRONG khung cuộn `#content` - khung có thanh cuộn riêng nên phần thò ra không đội `<html>` rộng thêm chút nào. Máy báo "không cuộn ngang" trong khi mở điện thoại lên phải vuốt ngang mới đọc hết (7 trang). Nay đo thêm chính `#content` và `#hvBody`; vừa sửa thước là nó tự tìm ra thêm 6 trang tràn ở khổ iPad. **Và thêm một mặt kiểm mới**: ở khổ điện thoại, chạy hết 15 bài hướng dẫn, bước nào có neo trỏ RA NGOÀI MÀN là đỏ - từ 820px xuống sidebar là ngăn kéo đóng, phần tử trong đó vẫn tồn tại và vẫn có kích thước, chỉ toạ độ là x âm. Đợi 950ms mỗi bước cho đủ nhịp của chính app (cuộn mượt 300ms + vẽ lại 320ms + trượt ngăn kéo 260ms) - đo non hơn là đỏ của cái thước chứ không phải của app. |
| `ITTS_OUT=<out> node _checkmat.js` | `CHECKMAT OK: 14 trang, ~1100 chuoi chu do bang thuoc that` - **ĐO BẰNG MẮT** (V9.99k). Anh Luân 04/08: *"quá trình verify của em rất lâu, nhưng lần nào a cũng bắt được lỗi... vừa tốn thời gian vừa ko hiệu quả thì giữ như cũ làm gì"*. Đếm lại thì đúng: trong một ngày, **sáu lỗi đều do anh Luân chỉ ra, không lỗi nào do 26 bộ kiểm (18 phút) tìm ra**. Ba trong sáu lỗi ấy cùng một họ mà không bộ nào có cửa để thấy - **HTML đúng hoàn toàn** (không tràn, không lỗi JS, nút đủ to, chữ đủ tương phản) **nhưng nhìn vào thì hỏng**. Bốn phép đo: **M1** chữ rộng hơn chỗ nó có (đo bề rộng THẬT của chuỗi với đúng font, so với khung) · **M2** bị cái khác phủ lên (`elementFromPoint` - hỏi đúng cách trình duyệt quyết định cú bấm rơi vào đâu) · **M3** ô hẹp giữa khoảng trống (bị cắt trong khi hàng chứa nó còn thừa chỗ) · **M4** dấu ngăn mồ côi (›/·/\| nằm khác dòng với mục đi kèm). Chạy lần đầu bắt ngay 7 chỗ nút bị nút Trợ lý nổi che. **Cố ý rẻ** (một khổ màn, 14 trang, ~50 giây) để nằm được ở TẦNG NHANH - bộ kiểm 18 phút thì người ta chạy một ngày một lần, mà lỗi sinh ra từ chính lần sửa vừa rồi. | Nút Trợ lý nổi nay chỉ còn **biểu tượng** là vùng bấm (tròn 38px), cả dải chữ cho chuột đi xuyên qua - hạ số chỗ bị khoá từ 7 xuống 1. Chỗ cuối nằm đúng dưới vùng bấm ấy: **khai có trần TỐI ĐA 2**, quá 2 là đỏ, vì quá 2 nghĩa là vùng bấm lại phình ra. Một cái trần có số, không phải một công tắc tắt luật. |
| `ITTS_OUT=<out> node _checkmotcua.js` | `CHECKMOTCUA OK` - **MỘT NGHIỆP VỤ MỘT CỬA GHI** (RB1 của V2). Anh Luân: *"cùng 1 nghiệp vụ, mà ở bản hiện tại có thể làm được ở rất nhiều nơi, sẽ làm cho nhân sự bị rối."* **Đo lại thì phải sửa chính chẩn đoán ban đầu.** Báo cáo hội đồng đợt đầu ghi *"146 cửa ghi trên 24 bảng, riêng DL09 mười tám cửa - chỗ đáng lo nhất"*. Đọc kỹ thì 18 cửa ấy là **18 nghiệp vụ khác nhau** (bảo lưu · quay lại · bỏ học · chăm nguy cơ · quota WOW · đăng ký) - không cửa nào thừa. Một bảng có nhiều cửa ghi là bình thường; cái phải bắt là **hai cửa cùng làm một việc**. **Dấu vết không cãi được**: hai hàm cùng phát ra CÙNG MỘT `id=` cho ô nhập = hai bản dựng cho một form. Đo trên 1604 hàm của bản build - chỉ 4 ô nhập dùng chung, cả 4 đều giữa hai ngăn kéo. **Và trùng id không chỉ là chuyện gọn gàng - nó là một lỗi GHI DỮ LIỆU**: bẫy số 4 của `BAN_GIAO_V2.md`, ngăn kéo mở đè lên trang mà trang vẫn còn trong DOM, `getElementById` vớ trúng bản ở trang bên dưới, app ghi một con số KHÁC con số người ta gõ. Ba mặt: **M1** hai hàm cùng dựng một ô nhập · **M2** hàm lưu phải đi tới được một cửa ghi · **M3** bản khai `NGHIEPVU` phải trỏ vào hàm có thật. | **BA LẦN CÁI THƯỚC BẮT NGƯỜI VIẾT NÓ SAI, cả ba đều đáng ghi:** (1) *đoán tên hàm* (`ddOpen`, `xmSave`) thay vì hỏi thẳng app - đúng luật *"hỏi thẳng từ vựng mà app dùng, đừng tự đặt tên"* mà vẫn phạm; tên thật là `ddHub`, `xepMoiLuu`. (2) *chấm mọi trùng id thành đỏ* - trong khi hậu quả khác hẳn nhau: **ngăn kéo + TRANG** là đỏ thật, còn **ngăn kéo + ngăn kéo** thì vô hại vì `openDrawer` thay nội dung. Đỏ ở chỗ không nguy hiểm thì người ta quen mắt, rồi ca đỏ THẬT trôi qua cùng một màu - nay tách hai mức, một cái đỏ một cái ghi chú. (3) *đòi hàm lưu phải LÀ cửa ghi* - báo đỏ `knResolveSave`, trong khi nó gọi `knUpd` và `knUpd` đã khai đàng hoàng; đòi mỗi hàm lưu tự mình là một cửa ghi là **ép app bỏ hàm ghi dùng chung, tức ép nó làm ngược lại đúng điều RB1 muốn**. Câu hỏi đúng: hàm lưu phải ĐI TỚI ĐƯỢC một cửa ghi. |
| `ITTS_OUT=<out> node _checkcauhoi.js` | `CHECKCAUHOI OK` - **MỖI CHỨC DANH HỎI BAO NHIÊU CÂU, APP TRẢ LỜI TRONG MẤY CÚ BẤM.** Anh Luân 08/08: *"Em nên phân tích xem, mỗi nhân viên, mỗi trưởng phòng, họ hỏi bao nhiêu loại câu hỏi, họ cần bao nhiêu trang để phục vụ nghiệp vụ? Nó quan trọng dữ lắm em. Hệ thống lớn, nhưng quá khó dùng thì chết ngay."* Đo bằng **bản khai của chính app**: bảng `NHIP` khai cho từng chức danh *"mỗi ngày người này làm gì"* - mỗi dòng là `[buổi, việc, vì sao, TRANG ĐÍCH, hàm đếm, MÃ CHIP]`, tức là danh sách câu hỏi họ hỏi. Đóng vai từng chức danh rồi hỏi bốn câu mỗi dòng: **C1** trang có thật · **C2** người này được xem (sai là *mời rồi đuổi*) · **C3** có lối trên menu · **C4** vẽ THẬT trang, tìm nút chip đã khai, **so số trên chip với số trên nhịp**. Kết quả đo: 15 chức danh, 70 câu hỏi, **không ai cần quá 5 trang**. | **BẮT ĐƯỢC CHUYỆN NẶNG NHẤT CỦA CẢ ĐỢT:** nhịp đếm `rows()` (toàn trung tâm) còn trang đếm `srows()`/`bellItems()` (phạm vi người dùng) - **Trưởng phòng Marketing đọc "57 việc quá hạn", mở trang ra thấy 7**; Trưởng phòng Tư vấn 169 vs 95. Chỉ CEO khớp, vì phạm vi CEO là tất cả. Con số ĐẦU TIÊN người ta nhìn mỗi sáng là con số sai, mà không ai tự phát hiện được vì hai bên không bao giờ đứng cạnh nhau trên màn. **Và cái thước bắt chính người viết nó sai hai lần:** (1) bản đo đầu chỉ đếm chip kiểu `LISTCFG.qf` nên đọc nhầm mọi trang tác vụ thành *"không có chip"* - em đã báo anh Luân **1/70** rồi phải đính chính thành **12/74**; bài học: đo trên CHUỖI HTML THẬT, đừng hỏi lại bảng cấu hình. (2) chip `reup` em đếm *"mọi khách đã nguội"* (16) trong khi trang đếm theo chặng hành trình (3) - đúng cái bệnh bộ kiểm sinh ra để bắt, và nó bắt ngay. **Ba trần chốt kéo xuống:** `TRAN_KHONG_CHIP=7` · `TRAN_KHONG_MENU=2` · `TRAN_KHONG_XEM=1`. |
| `ITTS_OUT=<out> node _checkv2.js` | `CHECKV2 OK` - **NĂM LUẬT RIÊNG CỦA BẢN V2.** Anh Luân 08/08: *"E nên sửa lại bộ kiểm, v2 ko phải v1, nó có đặc thù riêng của nó. E nhờ chuyên gia quyết định v2 sẽ như thế nào đi."* Bản chốt của hội đồng: `HOI_DONG_V2_CHOT.md`; tệp này là bản thi hành. **L1** mọi chức danh mở app ra đều thấy nhịp ngày của mình · **L2** không hub nào đứng trên menu, không mục menu chết, không trang ẩn lọt lên menu · **L3** không trang mồ côi (có mục menu, hoặc có cha trên menu, hoặc khai lý do) và đứng ở trang con thì mục cha SÁNG · **L4** mỗi ô cảnh báo bấm được, tới trang có thật, và người đó ĐƯỢC XEM · **L5** mọi trang nghiệp vụ có dải thẻ số. Định nghĩa "trang nghiệp vụ" khai ở **`_v2def.js`**, `_checkkhuon` đọc chung - một bản khai, hai thước. | **BẮT ĐƯỢC LỖI NẶNG NHẤT CỦA CẢ ĐỢT V2:** cờ `hide:1` mang HAI nghĩa bị trộn - *"không đứng trên menu"* (đúng ở V1, vì 22 trang ấy là TAB của sáu hub) và *"không cho cấu hình"*. V2 đưa 22 trang lên menu mà không ai gỡ cờ, nên **Lead · Test · Tư vấn · Thanh toán · Buổi học · WOW · Duyệt chiết khấu... không có trong Cài đặt > Phân quyền trang, không bật/tắt được ở màn Menu, và KHÔNG TÌM RA trong hộp tìm toàn app** - trái thẳng luật anh Luân đặt 31/07 (*"có thể bật tắt bất cứ thứ gì"*). **Và nó lộ ra chuyện `_checkkhuon` đang đếm sai tập trang:** phạm vi cũ dựng từ `HUBTAB` (bảng tab của sáu hub V1) nên báo *"23 trang, thiếu thẻ 0/0"* rất yên tâm, trong khi bốn trang nghiệp vụ thật (Học viên, Giảng viên, Bài tập, Nhân sự) không hề bị soi và **cả bốn đều thiếu dải thẻ**. Sau khi đổi phạm vi: **33 trang**, và lộ thêm `ketqua` truyền câu mô tả nhầm ô nên đầu trang trắng trơn suốt từ đầu. |
| `ITTS_OUT=<out> node _checkkhuon.js` | `CHECKKHUON OK: 23 trang nghiep vu` - **MỘT TRANG NGHIỆP VỤ PHẢI TRÔNG THẾ NÀO** (V2). Anh Luân 07/08: *"Có hội đồng nào chuyên về nghiệp vụ và trải nghiệm ko em, để họ biết nên thiết kế trang thế nào ấy"*. Dự án **có** chuẩn thiết kế (`ITTs_UX_UI_ChuanThietKe.md` phần C) nhưng nó khai chuẩn cho bảy loại màn - Dashboard · Bảng danh sách · Trang chi tiết · Phễu · Form · Lịch · Cài đặt - và **không có loại "trang nghiệp vụ"**, vì hồi viết chuẩn ấy nghiệp vụ còn nằm trong sáu cái hub. V2 đẻ ra 25 trang mà không có khuôn nào cho chúng; đo được: 9 trang có dải thẻ, 14 trang không - mỗi trang một kiểu thì người dùng phải học lại bố cục ở từng trang. **Khuôn ghép từ ba nguồn đã có, không phải nghĩ ra mới**: lời anh Luân tả V2 (*"nó có thẻ, có chip lọc, có cảnh báo của riêng nó"*) · phần C mục 1-2 và phần D của chuẩn thiết kế · các luật đã có trong bộ kiểm (câu đầu trang ≤150 ký tự, danh sách 0 dòng phải nói vì sao, thẻ phải khai ở `THEDEF`). **Sáu mặt**, đo trên chữ HIỆN RA: **K1** câu ngữ cảnh · **K2** nút hành động chính (trang chỉ-đọc phải khai lý do ở `CHIDOC`, không được im) · **K3** dải thẻ riêng có khai ở `THEDEF` · **K4** chip lọc · **K5** không bao giờ để một khoảng trắng · **K6** không còn vẽ thanh tab hub cũ. **K3 CÓ BẢN KHAI MIỄN `KHONGTHE` (13/08):** bảy trang nghiệp vụ bỏ hẳn dải thẻ vì thẻ nói y nguyên dải chip ngay dưới (`nhaplead` `test` `reup` `buoihoc` `baoluu` `nhansu` `hocvien` - anh Luân: *"nếu trùng thì bỏ thẻ"*). Ý của K3 không mất - nó đòi *người mở trang phải thấy ngay hình dạng của trang bằng con số*, mà dải chip có số làm đúng việc ấy, con số ở đó lại còn BẤM ĐƯỢC. K3 chỉ biết hỏi `class="bstats"`, tức nó hỏi một CÁCH làm chứ không hỏi cái ĐÍCH; gặp thước hỏi sai câu thì khai miễn kèm lý do, đừng dựng lại cái vừa bỏ cho vừa lòng thước. `_checklap` mục L5 khoá chiều ngược lại (thẻ trùng chip là đỏ) nên không thể vừa bỏ thẻ vừa để trang trống số. **K2/K3/K4 là TRẦN KÉO XUỐNG chứ không phải cổng chặn** - 14 trang đang thiếu thẻ; đặt luật *mọi trang phải có thẻ* ngay hôm nay là bộ kiểm đỏ 14 chỗ và không ai chạy nó nữa. Ghi đúng số đang thiếu, và số ấy chỉ được GIẢM. | **BA BẪY CỦA CHÍNH CÁI THƯỚC, cả ba đều TỐ OAN app, và cả ba đều cắn ngay lần chạy đầu:** (1) *bám chuỗi lớp CSS nguyên văn* - lớp thật là `class="phead nohd"` mà bản đầu dò `class="phead"` có dấu ngoặc đóng, không khớp trang nào, chấm oan **20 trang** "không có câu ngữ cảnh" trong khi trang nào cũng có. (2) *cửa sổ đo quá rộng* - lấy 1500 ký tự từ đầu trang thì ăn lan sang cả bảng việc gắn ngay sau, tức đếm cả một cái bảng vào độ dài một câu; đo cái gì thì phải bám đúng cái đó. (3) *đuổi theo tên lớp CSS* - hỏi "có `<tr>` hoặc khối tên `card`/`row` không" và hụt **hai lần liên tiếp** (`appcard` ở Duyệt chiết khấu, `rvq` ở Chăm lại); mỗi màn một kiểu thẻ dòng nên một danh sách tên đóng thì cứ thêm một kiểu là thước lại hụt. Nay hỏi câu không phụ thuộc tên lớp, và cũng đúng là câu người dùng hỏi: **sau đầu trang, còn chữ gì để đọc không?** |
| `ITTS_OUT=<out> node _checkroi.js` | `CHECKROI OK: 16 chuc danh` - **MENU DÀI RA CÓ LÀM NGƯỜI TA RỐI KHÔNG** (V2). Anh Luân đặt đúng một điều kiện cho việc dỡ hub: *"miễn là không rối"*. Cái giá phải trả của việc dỡ hub là **thanh menu dài ra** - sáu dòng thành hai mươi lăm. Với người có phạm vi rộng đó là một kiểu rối KHÁC: không phải *"một nghiệp vụ làm được ở nhiều nơi"* như V1, mà là *"không biết nghiệp vụ của mình nằm dòng nào"*. **Đổi một kiểu rối lấy một kiểu rối khác thì không phải là tiến** - nên phải có người đo. Bốn phép đo, tất cả đóng vai NGƯỜI CÓ THẬT (qua `gateEnter`, không qua `applyScope`) rồi dựng THẬT thanh menu của họ: **R1** menu dài bao nhiêu · **R2** mục có trên menu mà mở ra TRỐNG (hỏi đủ ba điều - có `.empty`, không bảng/dòng nào, và mọi số đếm đều 0; chỉ hỏi `.empty` thì tố oan trang có nhiều danh sách mà một cái rỗng) · **R3** một nhóm có quá nhiều mục không (mắt không quét được một khối dài) · **R4** hai mục cùng nhóm có tên na ná nhau không (phải bấm thử mới biết là ma sát thật). **Số đo được ngay lần chạy đầu: CEO 58 mục / 8 nhóm, nhóm to nhất 18.** Chức danh làm việc hằng ngày thì ổn (Học vụ 25 mục). Mỗi trần là một **CHỐT KÉO XUỐNG** (cùng lối `_checkmien`): đóng băng con số hiện tại để menu không dài thêm trong im lặng; cải thiện được thì HẠ trần xuống đúng số mới, không bao giờ nâng lên. Trần đặt ở **số đo được thật**, không phải số mong muốn - một cái trần thấp hơn thực tế thì lần nào cũng đỏ, mà một bộ kiểm đỏ mãi thì người ta tắt nó đi. **Việc tồn đã biết, ghi ngay trong file:** nhóm "Tra cứu" chiếm 18/58 mục - mười tám cuốn sổ chỉ để xem; gom chúng sau MỘT cửa sẽ hạ trần xuống khoảng 41 mà **không phạm RB1** (luật *một nghiệp vụ một cửa ghi* nói về CỬA GHI; đây là sổ chỉ-đọc, không có thao tác ghi nào). | **Bẫy của chính cái thước, cắn ngay khi dựng:** nạp `_APP.js` bằng `new Function(...)()` thì mọi `var` của app nằm lại trong scope riêng của hàm ẩn danh, ra ngoài hỏi `rows` là *"not defined"* - đo ra một app RỖNG rồi tưởng app hỏng. Các bộ kiểm chuỗi khác đều dùng `vm.runInThisContext`. |
| `ITTS_OUT=<out> node _checkf5.js` | `CHECKF5 OK: 11 ca` - **NHẤN F5 CÓ MẤT CHỖ ĐANG ĐỨNG KHÔNG** (anh Luân 07/08: *"e thiết kế sao mà để anh F5 lại trang nó vẫn ở nguyên trang a đang đứng nhé"*). App **đã hứa** điều này từ V9.29c - `go()` ghi `?<slug-trang>` vào thanh địa chỉ rồi đọc lại lúc vào app - nhưng lời hứa ấy **chưa bao giờ được ai đo**, và đo ra thì sai toàn bộ: **10/11 ca** đều rơi về Trang bắt đầu. Gốc lỗi nằm ở **THỨ TỰ**, không phải ở phép ghi địa chỉ: `enter()` gọi `setRole(k)` trước, cú nhảy về trang đáp ấy gọi `hashSet` và **ghi đè** `?thanh-toan` thành `?trang-bat-dau`; tới lượt đọc thì nó đọc đúng cái mình vừa xoá. Đo được: trước F5 địa chỉ `?thanh-toan`, sau F5 `?trang-bat-dau`, `ITTS_WHO` vẫn còn nguyên - app vào đúng người, chỉ là tự tay xoá mất đích đến. **Vì sao 34 bộ cũ không bắt được: cả 34 đều nạp app MỘT LẦN rồi đo, không bộ nào NẠP LẠI** - mà đây đúng là loại lỗi chỉ hiện ra ở lần nạp thứ hai. Bản vá hai vế: (a) đọc địa chỉ **trước** khi làm bất cứ việc gì có thể ghi vào nó; (b) địa chỉ ghi thêm **ngữ cảnh** - đang mở hồ sơ của ai, lớp nào, tab Cài đặt nào - lấy từ chính bảng `NAVCTX` mà breadcrumb đang dùng (không khai bảng thứ hai), và chỉ ghi khoá của ĐÚNG trang đang mở (`CTXTRANG`) để địa chỉ không phình theo biến treo của trang khác. **Đo trên `http://` chứ không phải `file://`** - demo thật chạy trên `https://mittomap.github.io`, hai kiểu địa chỉ ứng xử khác nhau ở chỗ `history.pushState` đổi query; đã đối chứng thấy giống nhau, nhưng cái thước không được dựa vào một sự trùng hợp. | **Hai bẫy của chính cái thước, cả hai đều TỐ OAN app:** (1) *gõ nhầm cửa* - ca "Cài đặt" đóng vai NV001 (sales) rồi báo đỏ, trong khi `settings` nằm trong `SENSITIVE` và app chặn ĐÚNG; phải đổi sang `gateEnter("")` cộng `cfSetMode("that")`. Lần thứ hai trong dự án một bộ kiểm tố oan vì đóng vai bằng cửa sai - lần trước là `applyScope` thay vì `gateEnter` ở `_checkreset`. (2) *hỏi "có giá trị" thay vì hỏi "có tồn tại"* - `ITTS_WHO` bằng **chuỗi rỗng** là danh tính HỢP LỆ (quyền toàn phần, đúng nhánh `who===""` mà `demoBoot` xử); hỏi bằng phép "có giá trị" thì người quyền toàn phần bị chấm là mất danh tính. |
| `node _checkreset.js` | `CHECKRESET OK: 15 tieu chi` - **bấm nút "Dựng lại demo" rồi kiểm lại từ đầu** (V9.99e). Anh Luân: *"nhất là nút reset demo, trước khi giao a sẽ bấm nút này đấy. Nó phải kéo demo về trạng thái hoàn hảo"*. Đây là nút anh bấm **ngay trước khi giao** - nó ra một bộ dữ liệu tệ thì mọi thứ còn lại hết ý nghĩa. Kiểm **sau khi bấm**, không tin là "chắc giống lúc build": 17 chức danh đều có việc · có việc gấp (207) và quá hạn (185) để thấy cảnh báo màu · tuần này có buổi học (34) · **cấu hình KHÔNG bị cuốn theo** (thương hiệu, khoá tự đặt) · tỷ lệ hiển thị, ảnh đại diện, góp ý không bị xoá · hai cổng mở ra có nội dung, 0 lỗi JS. | **Hai bẫy cắn ngay lượt đầu, cả hai đều là THƯỚC SAI:** (1) dùng `applyScope(sid)` để đóng vai - nó mới cắt phạm vi dữ liệu, **chưa đặt `CURROLE`**, nên `workAll()` trả 0 và máy báo "6 chức danh không có việc" trong khi app đúng. Cửa thật là `gateEnter(sid)`; đo được: cùng một người, `applyScope` = **0 việc**, `gateEnter` = **14 việc**. (2) lọc việc quá hạn bằng `w.han` / `w.due` - **hai tên đó không hề tồn tại**; việc của app mang `sev` và chữ "(quá hạn)" trong `what`. Bịa tên trường thì đo ra 0 rồi tưởng app hỏng. **Luật: hỏi thẳng từ vựng mà app dùng, đừng tự đặt tên.** |
| `ITTS_OUT=<out> node _checkneo.js` | `CHECKNEO OK: N buoc / M bai tren 2 ban build` - **VÒNG SÁNG CỦA HƯỚNG DẪN CÓ KHOANH ĐÚNG THỨ CÂU NÓI ĐANG NÓI TỚI KHÔNG** (V9.97). Anh Luân báo *"tour vẫn tệ quá em, nó trỏ sai hoài... có cơ chế nào để nó chính xác ko em"* trong khi `_checktour` và `_checkui` đều xanh - vì cả hai chỉ hỏi "neo có tìm ra không", không hỏi "nó khoanh đúng thứ đang dạy không". Đo lần đầu ra con số nói hết: chỉ 2/91 bước không tìm ra neo, nhưng **46/86 bước (53%) trỏ vào neo dùng chung của vỏ trang** (`@phead` ×24, `@tbarct` ×6, `@settabs` ×5, `@tbar` ×4) - tức NĂM bài khác nhau cùng khoanh đúng một dòng mô tả của trang hub. Năm luật: **N1** neo phải tìm ra được · **N2** phải nằm trong màn · **N3** **một chỗ trên màn, một bước** (trùng phải khai lý do trong `NEO_CHUNG`, khai theo mã neo hoặc theo mã bước) · **N4** bước nói về nội dung trang thì neo phải trong `#content` · **N5** vòng sáng phải trùng phần tử. Vá gốc bên app là loại neo **`@man`** = khối nội dung chính của màn đang mở, mỗi màn một phần tử khác nhau. Đường đi số đo: 116 → 127 → 51 → 18 → 7 → **5 (đều của bản V6)**, bản V5 sạch. | **BA BẪY CỦA CHÍNH CÁI THƯỚC, cả ba đều cắn ngay khi dựng:** (1) *không đi qua cửa đăng nhập* - bản đầu tự đặt `window.TOUR` rồi gọi `tourShow()` mà không qua `gateEnter`; app còn nguyên `CURROLE="sales"` trong khi `RBK` chỉ có khoá `"all"`, nên `navVis()` ném lỗi, `go()` chết, máy báo **62/91 bước hỏng** - con số rác hoàn toàn. Luật: hỏi thẳng cửa vào mà app dùng, đừng dựng lại trạng thái app bằng tay. (2) *ngủ 480ms rồi đo* - `tourPaint` còn phải cuộn tới phần tử rồi tự gọi lại sau 320ms; đo giữa chừng thì vòng còn ở `[0,900,0,0]`, máy chấm "vòng sáng lệch" **22 chỗ oan**. Phải đợi vòng CÓ kích thước rồi mới xét đứng yên. (3) *`.tourspot` có `transition:.22s`* - vòng TRƯỢT tới chỗ mới; đọc ngay lúc "đứng yên" vẫn rơi vào giữa quãng trượt, ra 48px lệch giả. Đợi quá 220ms mới đo. |
| `ITTS_OUT=<out> node _checknv.js` | `CHECKNV OK: da lam THAT N luot viec` - **NHÂN VIÊN ẢO**. Anh Luân hỏi (02/08): *"e có máy học nào chạy thay nhân viên test luôn ko"*. Câu trả lời thật lúc đó là CHƯA: 20 bộ kiểm đầu đọc **chuỗi HTML** - không ai bấm; `_checkui` có mở trình duyệt thật 1431 lượt nhưng chỉ **NHÌN** (cuộn ngang, chữ bị cắt, nút quá nhỏ), không bấm một nút nào. Nên chưa bộ nào đi hết một **VIỆC**. Bộ này đi đủ sáu bước bằng chuột thật: vào app bằng danh tính một chức danh có thật trong DL01 -> mở Bàn làm việc -> chọn thực thể -> bấm một hồ sơ -> bấm **Làm** -> điền mọi ô trống rồi bấm **Lưu** -> đối chiếu nhật ký DL25 có dài thêm không. **Luật chấm** (viết ra để bộ kiểm không xanh bằng cách dễ dãi): bấm Lưu xong chỉ hai kết cục được tính là đạt - (a) app **GHI**, DL25 dài thêm; (b) app **TỪ CHỐI CÓ LỜI**, hiện toast nói rõ thiếu gì. Còn lại đỏ, và kiểu hỏng nguy hiểm nhất là **bấm mà không có gì xảy ra** - người thật sẽ bấm lại vài lần rồi bỏ đi, không bộ kiểm chuỗi nào thấy được. Chạy trên **cả hai bản**: v6 phải mở ngăn kéo tại chỗ, v5 cố ý nhảy trang nên chấm theo vế khác (nhảy tới trang nào, trang đó có rỗng không, có lỗi JS không). Số đo lần đầu: **228 lượt việc**, v6 ghi được 100 + 14 việc hàng loạt, 0 lượt im lặng. | **Ba bẫy của chính cái thước, cả ba đều đã cắn ngay khi dựng:** (1) *bấm hai lần* - `actGuard` khoá theo **thời gian thật** 1200ms, máy chạy nhanh hơn người nên hai lượt khác nhau rơi cùng cửa sổ khoá và lượt sau bị từ chối oan; phải xoá `__actT` mỗi lần dựng lại thế giới (**bẫy thước đang chạy, lần thứ năm**). (2) *toast cũ còn hiện* - toast sống 1.9 giây thật; không xoá trước khi bấm Lưu thì câu nhắc của lượt TRƯỚC bị tính là "app từ chối có lời" của lượt NÀY, và **một nút Lưu chết được chấm là đạt**. Thử phá thật để đo: bản đã phá bắt được 3 chỗ; xoá toast trước mỗi lần bấm thì bắt được **7**. Bốn lỗi kia đã bị chính cái thước giấu đi. (3) *ngăn kéo còn mở sau khi ghi* - phải phân biệt **mở tiếp màn kế** (thu tiền xong ra biên lai, đúng thiết kế) với **đứng nguyên cái form vừa lưu** (người dùng không biết đã lưu chưa, dễ bấm hai lần); so tiêu đề ngăn kéo trước/sau mới tách được hai chuyện đó. |
| `ITTS_APP=./_APP.js node _checkngay.js` | `CHECKNGAY OK: N chuc danh` - **MỘT NGÀY CỦA TỪNG CHỨC DANH**. Anh Luân hỏi (02/08): *"Các nhân viên bảo v5 hoặc v6 đang thiếu gì, hoặc trải nghiệm không tốt chỗ nào?"* Chưa ai dùng thử nên chưa ai nói gì - nhưng có mấy dạng **kẹt** máy hỏi thay được. Khác hẳn `_checknv`: bộ kia hỏi *"bấm vào có chạy không"* (hỏng / không hỏng), bộ này hỏi *"ngồi vào ghế người ta thì có làm được việc không"* (đủ / thiếu). Sáu câu: mở app ra có việc không · **việc mồ côi** (việc nổi lên trên hồ sơ mà KHÔNG chức danh nào được phép làm - nó nằm đó mãi mãi, và không bộ kiểm nào khác hỏi tới) · thấy-mà-không-được-làm nhiều tới mức nào · bao xa tới việc đầu tiên · trang trống trong menu của chính mình · và **không có việc trên bốn đối tượng thì phải được CHỈ ĐƯỜNG**. Phát hiện thật lần chạy đầu: **ba chức danh Nhân sự** đáp xuống Bàn làm việc rồi nhìn thấy **344 hồ sơ · 0 việc của mình · 264 việc của bộ phận khác** - hơn 90% màn hình là nhiễu. App không hỏng, nhưng buổi sáng đầu tiên của họ rất tệ. | **Hai bẫy của chính cái thước, cả hai đều tố oan app:** (1) *đo bằng một biến không tồn tại* - bản đầu hỏi `BANGVIEC[vai]`, một biến toàn cục **không có**, nên nó trả **0 cho cả 18 chức danh** và suýt kết luận ba người Nhân sự "mở app ra trắng bảng". Số 0 của một phép đo hỏng trông y hệt một phát hiện. Nay **vẽ thật** `bangViecHTML()` rồi đếm ô. (2) *"trang trống" là câu khó hơn nó tưởng* - hỏi mỗi "có khối `.empty` không" thì tố oan cả CEO là trang Giao việc trống, trong khi CEO đang có 1 việc chờ xác nhận và 3 việc đang chạy: trang ấy có NHIỀU danh sách, một cái rỗng là đủ sinh ra `.empty`. Nay phải đủ ba điều: có `.empty` · không bảng/dòng nào · và MỌI con số trên ô đếm đều bằng 0. **Và một bẫy nằm ngoài bộ kiểm:** `extract_js.py` luôn ghi vào `_src/_APP*.js` bất kể trích từ thư mục nào - trích một build khác để đối chứng là **âm thầm ghi đè** bản đang thử, mọi phép đo sau đó đo nhầm file. Đối chứng xong phải trích lại." **Từ V9.83 có thêm một mặt kiểm mà không bộ nào khác hỏi tới: BÀI HƯỚNG DẪN CÓ ĐANG TẢ ĐÚNG APP KHÔNG.** `_checktour` canh các BƯỚC chạy được - neo tìm thấy, hộp vẽ ra - nó không canh LỜI NÓI. Đã cắn thật: sau khi bỏ Giảng viên khỏi bốn thực thể, bài "Bàn làm việc" vẫn dạy *"Khối Nhân sự thì làm việc với GIẢNG VIÊN"*, mọi bộ kiểm vẫn xanh. **Luật: các bước chạy được không có nghĩa là lời nói còn đúng.** Tiêu chí này phải đo lại **ba lần** mới trúng, và cả ba lần đầu đều TỐ OAN app: (1) hỏi "trang có trong cây menu không" - sai, 30 trang trong `VIEW_ALWAYS` mở được mà không có trên menu, nên cả hai bản build đều đỏ ~20 chỗ NHƯ NHAU (một phép đo mà hai bản khác hẳn nhau lại ra cùng kết quả thì nó đang đo thứ khác); (2) hỏi "câu chữ nhắc tên nhóm menu không có ở bản này" - cũng sai, "Bàn làm việc" là tên TRANG chứ không phải tên nhóm; (3) cấm hẳn từ "giảng viên" - sai nốt, vì nó vừa là chức danh vừa TỪNG là thực thể, và cái thước ấy bắt người viết bẻ câu chữ cho vừa nó. Chỉ khi bắt đúng mẫu **`"thì <từ>"`** - vế TRẢ LỜI của một phép gán thực thể - nó mới trúng câu sai thật và tha câu đúng. **Luật: thấy thước bắt một câu đúng thì siết thước, đừng bẻ câu chữ cho vừa nó.** |

**`_check15.js` sinh ra vì cả hai hội đồng thẩm định đều bỏ lọt cùng một lớp lỗi:** người rà
ĐỌC TỪNG ĐƯỜNG, mà lỗi nguy hiểm nhất nằm ở KHOẢNG GIỮA hai đường - mỗi đường đọc riêng đều hợp
lý, đặt cạnh nhau mới sai (vd `wowAddSave` trừ quota lúc ĐẶT còn `hvWowSave` chỉ trừ khi ĐÃ DẠY).
Nó làm hai việc người đọc không làm được: (1) KIỂM KÊ mọi hàm ghi vào từng bảng và **báo đỏ khi có
cửa ghi MỚI chưa khai** - buộc người viết đối chiếu với các cửa sẵn có; (2) kiểm **BẤT BIẾN nghiệp
vụ** (đúng dù đường nào ghi) bằng cách LÁI THẬT từng cửa rồi soi lại. Thêm hàm ghi mới vào bảng nào
thì khai vào bảng `KHAI` trong `_check15.js`.

**`_check16.js` mục 15 sinh ra vì một lớp lỗi họ hàng, Luân tự bắt được (28/07 khuya):** hàm ghi dữ
liệu KHÔNG tự gọi `persistSoon` mà vẫn "có vẻ chạy", vì đường nào cũng tình cờ đi qua `reRender` ->
`reRenderKeep` (dòng cuối hàm này có `persistSoon`). Đổi trạng thái trên trang danh sách đứng riêng
thì `rlist` ghi thẳng `innerHTML`, không qua `reRenderKeep`, và dữ liệu mất khi tắt trình duyệt.
Nên mục 15 **tắt hẳn `reRender`/`reRenderKeep`/`rlist` rồi mới đếm `persistSoon`** - chỉ lần gọi
THẲNG mới tính. Thêm cửa ghi mới thì thêm một dòng `door(...)` vào đó.

> **LUẬT:** hàm nào ghi vào DATA thì TỰ gọi `persistSoon()`. Không được dựa vào tác dụng phụ của
> hàm vẽ giao diện - hôm nay đúng, mai đổi đường render là mất dữ liệu không ai hay.

**`_checkdata.js` sinh ra vì bộ máy chặng và bộ kiểm dữ liệu ở HAI NGÔN NGỮ KHÁC NHAU.** Chặng được
suy ra trong JS (`jStageOf`); `check_logic.py` viết bằng Python nên không biết ga "Có KQ, chờ tư vấn"
nghĩa là gì, do đó 132 luật của nó vẫn để lọt một khách đứng ở ga đó mà không có điểm test nào.
`_checkdata.js` **nạp chính `_APP.js`, chạy chính `jAll()`** rồi hỏi ngược: người này app bảo đang ở
ga nào, ga đó bắt buộc phải có chứng từ gì. Nên nó không bao giờ lệch khỏi app.

> **ĐỪNG chép luật chặng sang Python lần thứ hai** - chép là hai bản sẽ trôi khỏi nhau, đúng lớp lỗi
> đã sinh ra file này.

Thêm luật mới thì thêm vào `_checkdata.js`, và **luôn lấy tên cột qua `col(bảng, tên)`**: người viết
file này đã từng soi cột `wow_teacher_id` trong khi DL14 dùng `staff_id`, rồi báo cáo 69 lỗi không có
lỗi nào là thật. `col()` bắt cột không tồn tại và báo ngay, thay vì lặng lẽ trả về rỗng.

`check_logic.py` (V9.25: 132 luật) là **bộ kiểm dữ liệu BẮT BUỘC**, chạy sau trọn đường ống
dữ liệu. Đường ống phải chạy ĐÚNG thứ tự, chạy thiếu bước nào là kết quả sai:
```bash
python3 gen_demo.py && python3 seed_giaoan.py && python3 mkdemo.py \
  && python3 fixdata.py && python3 check_data.py && python3 seed_giaoviec.py \
  && python3 check_logic.py
```


```bash
# trích script lớn nhất -> _APP.js, kiểm cú pháp
python3 - <<'PY'
import re; html=open("<mnt>/SOP ITTs/ITTs_WebApp_v5_demo.html",encoding="utf-8").read()
open("_APP.js","w",encoding="utf-8").write(max(re.findall(r"<script>(.*?)</script>",html,re.S),key=len))
PY
node --check _APP.js
ITTS_OUT="<mnt>/SOP ITTs" node _tall.js   # kỳ vọng: "Render 36 trang | 0 loi" + "thieu trong font: khong" (V9.6)
```
Cổng học viên: lặp lại `node --check` với script lớn nhất của `ITTs_TrangHocVien_demo.html`.

## DỰNG LẠI FONT ICON (khi thêm icon `ti-*` mới)
## Trợ thủ ở GÓC, thân trang sạch (V9.35)

Bản trước có **hai khối trên đầu mọi trang** - "Nhịp ngày của bạn" và "Trợ thủ". Ba cái sai:
hai khối trả lời **cùng một câu hỏi**; khối Trợ thủ trình bày kiểu **tờ khai** (nhãn in hoa trái,
giá trị phải) chứ không phải cách một trợ thủ nói; và cả hai dùng **nền vàng - màu cảnh báo** trong
khi đây không phải cảnh báo, lại đẩy nội dung chính xuống dưới màn hình.

Nay gom về **một nút tròn góc dưới bên phải**. Bấm vào bung ra tấm trợ thủ:
câu chào theo giờ + **tên người** (không phải chức danh) → thẻ **VIỆC KẾ TIẾP** (tên việc, người,
hạn, nút Làm/Để sau) → **3 chip nhịp ngày** bấm được (Đầu ngày / Trong ngày / Cuối ngày) → nút
**Dọn từng bước**. Thân trang sạch hoàn toàn.

- `asstHTML()` **dựng chuỗi**, `asstPaint()` chỉ gắn vào DOM. Tách ra để bộ kiểm đọc được nội dung
  thật mà không cần DOM giả - và để đọc mã là thấy ngay "tấm trợ thủ gồm những gì".
  **MAT 7 (them 13/08) - CO T "NGUOI PHU TRACH" CUA HD3.** Anh Luan hoi *"Sop co noi ko?"* ve chuyen qua SLA thi cham ai. Doc HD3 thi thay no co han mot cot ten **"Nguoi phu trach"**, khai cho **81/95 tinh huong** - va app KHONG NHAP MOT DONG NAO cua cot ay: biet ma NA, biet cau nhac, biet nguong, nhung khong biet AI PHAI LAM. SOP mo ta ma app bo sot - dung thu luat cung so 0 cam, va sau mat dang canh khong mat nao hoi toi no. Da nhap thanh bang `NAPT` trong `gen_v5.py`; mat 7 canh bang ay khong lech (thieu ma hoac chep sai chu deu do). *Mot cot du lieu ma khong bo kiem nao hoi toi thi no vang mat ma khong ai hay.*

- **Một nút, hai vai** (`asstFabClick`): đang dọn việc dở mà thu gọn thì mở lại đúng chỗ đang dọn;
  còn lại thì bung tấm trợ thủ. Hai nút chồng nhau một góc là thứ chắc chắn sẽ che nhau.
- `asstTick()` gọi từ mọi đường vẽ lại màn hình → con số trên nút và việc kế tiếp luôn đúng.
- Chip của một buổi chỉ cộng số của **hàng chờ**; buổi toàn thói quen thì ghi **dấu gạch**, không ghi
  số 0 - ghi 0 thì người ta đọc thành "đã xong hết".

**Đã xóa mã chết:** `tthHTML` / `nhipHTML` / `tthItems` / `tthHasRule` (~5.000 ký tự). Quan trọng
hơn: `_check18` còn **9 tiêu chí đang soi mấy hàm đó** - tức là kiểm một thứ **không ai còn nhìn
thấy**, luôn xanh mà chẳng bảo vệ được gì. Đã trỏ hết sang `asstHTML()`. **Xóa tính năng thì phải
xóa hoặc trỏ lại bộ kiểm của nó, nếu không là để lại một bộ kiểm giả.**

## Trợ thủ nằm TRONG guide - tầng "Dọn việc hôm nay" (V9.34)

Trợ thủ cũ là **một khối chữ đứng yên** ở đầu trang: nói "còn 12 việc, làm cái này trước" rồi thôi.
Sang trang khác là mất, làm xong không ai biết, không dắt được ai qua việc thứ hai. Guide thì đã có
sẵn đúng ba thứ trợ thủ thiếu: **nổi trên mọi trang**, có **`chk()` kiểm bằng dữ liệu**, và có
**tiến độ**. Nên ghép: tầng thứ tư của guide, nhưng **các bước không viết sẵn - sinh từ hàng chờ thật**.

- `workAll()` - việc đang tồn của chính người đang đăng nhập, đã lọc theo chuông của chức danh.
- `workSort()` - xếp theo `tthCfg()`: quá hạn trước (bật/tắt được), rồi thứ tự nhóm việc, rồi việc cũ.
- `tourWorkBuild()` - mỗi việc thành một bước `{item, do, chk}`; `do` là nút thao tác thật
  (`slaBtn` dùng chung với trợ thủ và chuông).
- **`chk` = việc BIẾN MẤT khỏi hàng chờ.** Không hỏi "bạn làm chưa", không có nút "tôi đã làm" -
  nói dối được thì kiểm làm gì.
- `tourDo()` chạy thao tác rồi `tourAfter()` tự kiểm; xong thì **tự nhảy việc kế**. `tourTick()` gọi
  từ `reRender` để người làm tay (không qua nút của guide) thì guide vẫn biết.
- Bước có `dock:1` thì hộp guide **neo cố định góc dưới phải, z-index trên cả ngăn kéo** - vì bài này
  mở form liên tục, hộp mà bám theo phần tử là bị che ngay. Vòng sáng tắt (việc nằm trong hộp, không
  nằm ở một ô nào trên trang), và cảnh báo "không thấy chỗ cần trỏ" cũng tắt.

**Cấu hình** (`Cài đặt > Trợ thủ & Nhịp ngày`): bật/tắt trợ thủ toàn trung tâm, số việc mỗi lượt dọn,
quá hạn có lên đầu không, và **thứ tự dọn theo nhóm việc**. Nhóm việc mới sinh ra trong app tự nối
vào cuối `tthCfg().order` - không biến mất.

**Nhịp ngày** giữ danh mục trong mã (vì có **hàm đếm** - thứ không cất vào sheet được), còn cấu hình
là **lớp phủ** lên danh mục: bật/tắt từng dòng, sửa chữ, đổi buổi, đổi thứ tự, và thêm dòng riêng của
trung tâm. Lớp phủ gắn theo **mã dòng** (`role:index`), không gắn theo vị trí, nên sửa danh mục thì
cấu hình cũ vẫn khớp. Dòng tự thêm **luôn là thói quen** - không có hàng chờ nào để cạn, gắn mác
"xong" cho nó là nói láo với người trực ca.

**Bộ kiểm phải chứng minh, không được nghe kể** (`_check18` mục 23): làm THẬT một việc rồi đòi `chk`
đổi từ CHƯA sang XONG; đổi thứ tự nhóm rồi đòi việc đầu tiên đổi theo; đổi số việc mỗi lượt rồi đòi
số bước đổi theo; tắt trợ thủ rồi đòi không trang nào còn khối nhắc.

## Kiểm thử trên trình duyệt thật - `_checkui.js` (V9.31)

Cả 13 phần còn lại đều **kiểm chuỗi HTML**, không có trình duyệt nào chạy. Chuỗi đúng tuyệt đối mà
màn hình vẫn vỡ: HTML hợp lệ, **CSS mới là thứ bẻ nó**. `_checkui.js` mở app THẬT bằng Chromium,
đi qua **396 lượt** (38 trang + 12 tab Cài đặt của cổng nhân viên, 82 hồ sơ học viên của cổng học
viên, nhân 3 khổ màn hình: 390 / 834 / 1440px) và đo 7 thứ mắt người thấy được:

1. trang cuộn ngang (luật dự án: không bao giờ được phép)
2. chữ bị cắt **âm thầm** - `overflow:hidden` mà không có dấu `...`; có `text-overflow:ellipsis` là
   cắt CÓ Ý, không tính
3. phần tử thò ra ngoài khung nhìn
4. nút/ô nhập nhỏ hơn 24px - trừ ô tích/nút tròn (control gốc của trình duyệt, ép to lên trông sai)
5. hai thanh nổi che nhau (toast / thanh Hoàn tác / bong bóng)
6. lỗi JS, và **tài nguyên tải từ mạng ngoài** - demo phải chạy được khi không có mạng
7. **câu văn bị flex bẻ vụn**

Điểm 7 là thứ đẻ ra bộ kiểm này. Trong CSS, mỗi đoạn chữ trần nằm trong một ô `display:flex` thành
**một ô riêng** (anonymous flex item), rồi `gap` đẩy chúng ra xa. Câu văn đứt thành nhiều cột mà
HTML **không sai một dấu nào** - sáu phép đo kia đều không thấy (không tràn, không cắt, không nút
nhỏ). Luật dò: ô flex hàng ngang vừa có **từ 2 đoạn chữ trần trở lên** vừa có thẻ con. Một đoạn chữ
thì bỏ qua - đó chính là kiểu nút chuẩn `<button><i icon></i>Nhận việc</button>`, khe 6px là cố ý.

**Đã bắt được thật:** `.notebar` (83 chỗ trong app) bẻ vụn câu nhắc thành nhiều cột; `.bwap` (chip
"Hẹn kế" trên Trang bắt đầu) bẻ thành 3 mảnh; font Montserrat vẫn kéo từ Google Fonts; ảnh đại diện
giáo viên kéo từ `ui-avatars.com` (**gửi tên người thật ra máy chủ nước ngoài**); ô tìm chỉ cao 15px;
ô chọn hạn nộp bài bị bóp còn 15px trên điện thoại.

**Khi sửa xong nhớ thử ngược:** cố tình bẻ lại rồi chạy để chắc bộ kiểm **báo đỏ thật**. Lần đầu viết
xong, 6 phép đo đầu đều xanh trên đúng cái bug đã sinh ra nó - một bộ kiểm luôn xanh là bộ kiểm giả.

## Bản khai cửa ghi (`DOORS` trong gen_v5.py -> `DOORTB` trong app) - V9.31

Trong `gen_v5.py`, gần cuối file (ngay trước `_MH = "</style></head><body>"`) có dict Python
`DOORS = {bảng: [tên hàm ghi]}`. Lúc build nó được đảo thành `{hàm: [bảng]}` rồi thay vào chỗ
`__DOOR_MAP__` trong chuỗi JS, ra biến `DOORTB` của app. Build sẽ **assert gãy** nếu chỗ cắm biến mất.

App dùng bản khai này để **tự bọc mọi cửa ghi** (`logArm()` gọi ở cuối `demoBoot`/`demoBootHV`):
chụp ảnh các bảng đó trước - cho hàm chạy - chụp lại - so, rồi ghi vào nhật ký DL25. Nghĩa là
**thêm cửa ghi mới thì chỉ cần khai tên vào `DOORS`**, không phải đụng vào hàm đó.

`_check15.js` KHÔNG còn giữ bản chép riêng: nó đọc thẳng `DOORTB` từ app đã build rồi đối chiếu với
danh sách nó tự dò ra từ mã nguồn. Ba tình huống bị bắt:
- khai tên một hàm **không tồn tại** (V9.31 bắt được 2 ca ma: `clsSave`, `gaAddSave` - khai suốt mà
  chưa từng có hàm nào tên vậy);
- viết hàm ghi mới mà **quên khai**;
- khai rồi nhưng hàm không được bọc (`__log`).

**Đừng thêm hàm chỉ ĐỌC vào `DOORS`**: mỗi lần gọi nó sẽ chụp ảnh cả bảng - hàm vẽ chạy liên tục thì
thành gánh nặng thật.

Harness báo `thieu trong font: ti-xxx` = phải dựng lại **CẢ HAI** phần trong `tabler_inline.css`:
(1) payload woff2 base64 VÀ (2) rule `.ti-xxx:before{content}`. Công thức:
```bash
pip install fonttools brotli --break-system-packages   # nếu chưa có
python3 - <<'PY'
import re,base64,subprocess,os
SD="."  # thư mục _src đã copy
css=open(SD+"/iconbuild/tabler-icons.css",encoding="utf-8").read()
m={n:cp.lower() for n,cp in re.findall(r'\.ti-([a-z0-9-]+):before\s*\{\s*content:\s*"\\([0-9a-fA-F]+)"',css)}
src=open(SD+"/gen_v5.py",encoding="utf-8").read()
used=sorted(set(re.findall(r'ti ti-([a-z0-9-]+)',src))|set(re.findall(r'"ti-([a-z0-9-]+)"',src))|set(re.findall(r"'ti-([a-z0-9-]+)'",src)))
used=[u for u in used if u in m]; unis=",".join("U+%04X"%int(m[u],16) for u in used)
subprocess.run(["pyftsubset",SD+"/iconbuild/fonts/tabler-icons.ttf","--unicodes="+unis,"--flavor=woff2",
 "--output-file="+SD+"/iconbuild/sub.woff2","--no-hinting","--desubroutinize",
 "--drop-tables+=GSUB,GPOS,GDEF","--layout-features=","--no-layout-closure"],check=True)  # BỎ GSUB nếu không sẽ sập
b=base64.b64encode(open(SD+"/iconbuild/sub.woff2","rb").read()).decode()
out="@font-face{font-family:'tabler-icons';font-style:normal;font-weight:400;src:url(data:font/woff2;base64,"+b+") format('woff2')}\n"
out+=".ti{font-family:'tabler-icons'!important;font-style:normal;font-weight:400;font-variant:normal;text-transform:none;line-height:1;-webkit-font-smoothing:antialiased;-moz-osx-font-smoothing:grayscale;display:inline-block}\n"
out+="\n".join('.ti-%s:before{content:"\\%s"}'%(u,m[u]) for u in used)+"\n"
open(SD+"/tabler_inline.css","w",encoding="utf-8").write(out); print("icons:",len(used))
PY
```
(node_modules @tabler đầy đủ ~179MB KHÔNG cất ở đây; nếu cần bản gốc: `cd iconbuild && npm i @tabler/icons-webfont@2.47.0`.)

## LUẬT KIẾN TRÚC WEB APP (đừng phá — chi tiết ở 02_NHAT_KY_QUYET_DINH.md)
- Mẫu HUB có tab: 1 trang custom + biến TAB + `segHTML(...,"xTabSet('{k}')")`; thân tab GỌI render con với cờ `embed` (bỏ pageHead). KHÔNG đẻ trang mới.
- Đường ống nhúng: `filterBar`/`rlist`/`pageGo` re-render theo **CUR**; `go()` có bảng map (TSMAP/CSMAP/HTMAP) đổi trang con → hub+tab.
- Icon: quét cả `ti ti-X` lẫn `"ti-X"`; thêm icon = dựng lại font.
- Verify từng bước bằng harness, không tin script chạy đúng.
- V9.7: mốc cắt lắp ráp file HV là chuỗi `'<script src="ITTs_data.js"></script>'` và boot `if(!SVR){demoBoot()}` — sửa vùng đó phải giữ nguyên 2 chuỗi.


## BỘ MÁY LỌC CHUYÊN SÂU (V9.28, việc B)

Thêm bộ lọc cho một trang = **thêm ĐÚNG MỘT DÒNG** vào bảng `FLTDEF` trong `gen_v5.py`, không
viết thêm một dòng giao diện nào:

```js
FLTDEF.tenTrang = [
  fxEnum("cot_enum","Nhãn"),                 // chọn nhiều - gom giá trị từ chính dữ liệu
  fxStaff("cot_nhan_su","Người phụ trách"),  // chọn nhiều - hiện tên nhân viên
  fxRef("class_id","Lớp","DL10","class_id","class_name"),   // tra sang bảng khác
  fxDate("cot_thoi_gian","Ngày ..."),        // khoảng thời gian + 8 mốc sẵn
  fxCalc("_khoa","Khóa học", getter, labeler)  // trục TÍNH TOÁN, không phải cột của bảng
];
```

Trang không nằm trong `LISTCFG` thì khai bảng nguồn ở `FLTSRC` (ví dụ `giaoviec: "DL23"`).

- **VÀ giữa các trục · HOẶC trong cùng một trục.** Một lõi duy nhất `fltApply(trang, mảng)`.
- **Không đụng tab.** Tab chọn nhóm, bộ lọc thu hẹp bên trong nhóm đang mở.
- **Lưu theo TỪNG NGƯỜI** trên localStorage khoá `ITTS_FLT_<mã nhân viên>` - thói quen cá nhân,
  không ghi vào `DATA.config`.

> **KHAI TRỤC THÔI CHƯA ĐỦ - nút phải THẬT SỰ lên màn hình.** Bẫy đã cắn ngay trong lượt đầu:
> khai trục cho 16 trang, `_check17` xanh, nhưng **9 trang custom không hề gọi `fltApply`/`fltBarHTML`**
> nên người dùng không bao giờ thấy nút. Bộ kiểm cho cảm giác an toàn giả vì chỉ thử đúng một trang.
> Nay `_check17` **vẽ thật từng trang trong `FLTDEF` rồi soi nút**, và bật thử một điều kiện xem danh
> sách có đổi không. Trang tự dựng thanh công cụ (không dùng `filterBar`) phải nối tay - và nhớ
> `renderXeplop` KHÔNG có biến `p`, viết `fltApply(p,...)` ở đó là tham chiếu biến không tồn tại,
> lọc câm mà không báo lỗi.

> **MỌI trục phải đi qua `fltColOk()`** - trục trỏ vào cột KHÔNG CÓ THẬT thì bị loại và `_check17`
> báo đỏ. Ngay lần đầu chạy, chốt chặn này đã bắt được `DL05.course_status` không tồn tại (bảng
> khóa học dùng `status`). Đây đúng lớp lỗi đã làm hỏng một báo cáo trước đó (`wow_teacher_id`).


## XIN NGHỈ CÓ PHÉP - VÒNG ĐỜI (V9.29, việc C)

`BÁO NGHỈ -> CHỜ DUYỆT -> (Có phép / Không phép) -> tuỳ chọn XẾP BÙ`

Ba hàm lõi, mọi cửa đều đi qua đúng ba hàm này (đã khai vào `KHAI.DL12` của `_check15.js`):

| Hàm | Việc |
|---|---|
| `absReq(sid, sess, lyDo, xinBu)` | Học viên xin nghỉ. Ghi `absence_type = pending_review (Chờ duyệt)`. |
| `absReview(attId, kind, note)` | Học vụ duyệt: `excused` hoặc `unexcused`. **Chuyên cần chỉ chốt ở đây.** |
| `absMakeup(attId, target, note)` | Xếp bù cho MỘT học viên - gắn vào buổi CÓ SẴN, không đẻ buổi mới. |

> **`absMakeup` khác hẳn `bhMakeup`.** `bhMakeup` dùng cho buổi bị hủy **cả lớp** và có tạo bản ghi
> DL11 mới. `absMakeup` là chuyện của **một học viên** - chỉ ghi kế hoạch bù lên chính dòng vắng đó.
> Nhầm hai cái này là đẻ ra buổi học ma.

**Hai bẫy đã cắn khi làm:**
- Hàng đợi duyệt phải nằm **TRÊN** cổng điểm danh. Buổi chưa tới giờ thì `ddHub` return sớm - mà đó
  đúng là lúc giáo viên cần biết nhất để chuẩn bị phần bù.
- `add()` trong `slaItems` nhận **13 tham số VỊ TRÍ** (`cat,grp,sev,ic,who,what,age,page,filter,lead,hoso,act,rid`).
  Truyền một object vào giữa là chuông câm mà không báo lỗi.

**Định nghĩa "vắng không phép" đã được thống nhất.** Trước đây `stuAttStats` viết `!== "excused"`
còn ba chỗ khác dùng `/unexcused/` - thêm trạng thái thứ ba là dòng chờ duyệt bị tính oan ngay.
Nay tất cả đều là `/unexcused/`.

**Đơn xin nghỉ KHÔNG phải điểm danh.** Dòng DL12 của một đơn xin nghỉ tồn tại **trước** buổi học -
đó là điều đúng nghiệp vụ (báo trước để giáo viên chuẩn bị phần bù). Ba luật từng ngầm giả định
"có dòng DL12 = đã điểm danh" và đều phải siết lại khi làm việc (C):
`check_logic 4a/4b` (điểm danh cho buổi tương lai / buổi chưa dạy) và `_checkdata E6`
(số dòng điểm danh vượt số buổi đã dạy). Kèm theo là 4 luật mới canh chính đơn xin nghỉ:
`4a-bis` (thiếu giờ HV báo) · `4a-ter` (chờ duyệt mà không ghi là vắng) ·
`4a-quater` (chưa duyệt mà đã có người/giờ duyệt) · `E7` (dòng cho buổi chưa dạy phải là đơn xin nghỉ).

## Chay bo kiem tren BAN V6 (them 01/08)

`extract_js.py` nay trich BA file: `_APP.js` (v5), `_APP6.js` (v6), `_HV.js` (cong hoc vien).
Moi bo kiem JS doc bien `ITTS_APP` nen chay duoc tren ban nao cung duoc:

    ITTS_APP=./_APP6.js ITTS_OUT="$(cd .. && pwd)" node _checkaudit.js

Vi sao co: truoc 01/08, `extract_js.py` chi trich tu ban v5, nen **20/21 bo kiem chua tung soi
ban v6**. Ban v6 duoc giao ma khong bo kiem nao chay qua no. Chay lan dau tren v6 lien ra mot
loi that: `navCurKey/navGroupOf/navInTree/navGrpArc` duyet CAM CUNG `NAVTREE` (cay menu v5), nen
o v6 chung do nham cay - mo trang ra thi tren man hinh khong muc nao sang, nguoi dung mat dau
minh dang dung dau. Nay ca bon hoi `navCay()`.

Cac tieu chi canh HINH DANG MENU CUA V5 (4 nhom chang, ten nhom cu the) duoc khoanh `if(!V6())`
trong `_check11`, `_check16`, `_checkqa` - v6 co y dung menu khac, khong phai loi.

### Ba bay ve DONG HO da cat trong mot ngay (01-02/08)

Du lieu demo la BAN MAU co ngay sinh co dinh (`meta.anchor`), app dich no theo BOI SO 7 NGAY luc
chay. Trong 6 ngay giua hai lan dich, moi moc "qua 24h" / "con trong han" cu troi dan - bo kiem
do bang dong ho treo tuong se XANH BUOI SANG va DO BUOI CHIEU ma khong ai dung vao ma.

    LUAT: KHONG DO CAI DANG DUNG YEN BANG MOT CAI THUOC DANG CHAY.

Da neo ba cho:
- `check_logic.py` - NOW lay tu `meta.anchor`.
- `check_sop.py`   - them dong dung san (SYNTH) cho **NA013** va **NA006**, hai nhanh "CON TRONG
  HAN" ma du lieu tinh khong bao gio giu duoc. Nay 5 dong dung san. Bo khai thua **NA039**
  (app da sinh ra that).
- `_check16.js`    - dat `Date` ve dung `meta.anchor` truoc khi nap app.

### Bay khac: bo kiem an ca TAC DUNG PHU cua chinh no

Khoanh `if(!V6())t(...)` la chan luon phan DUNG va phan TRA LAI TRANG THAI nam ben trong bieu
thuc ay, nen cac cau sau thua huong trang thai hong va do oan cho app. Nay dung `tv5(...)`:
tham so van duoc tinh (moi tac dung phu van xay ra), chi bo phan cham diem.

Bo kiem cung phai TU DAT DIEU KIEN cua minh, khong thua huong cua cau truoc - vd dai so cua hub
Cho duyet chi hien cho nguoi co quyen duyet (7/9 chuc danh mo ra khong co dai, va do la DUNG).

(Mon no cu "`_check16` con 1 tieu chi do o v6 - trang duyet chua co dai so" DA TRA XONG tu 02/08.
Muc **4bis** cua `verify.sh` nay chay lai 15 bo kiem tren `_APP6.js`, xanh het.)

## V9.84-V9.90 - DOT CHUAN BI MANG DI DEMO (03/08)

Chi tiet "vi sao" o `02_NHAT_KY_QUYET_DINH.md`. O day chi ghi nhung cho **cham vao bo kiem**:

- `_check14` them **4 tieu chi xung ho cong phu huynh** (215 tieu chi). Bay da can: ban dau bo
  kiem BAT duoc loi khi ve trang roi **im lang tra ve**, thanh ra XANH tren ban hong. Nay ve
  khong duoc la **DO**. Da dung lai ban cu de chung minh no thuc su can (7 quan he do).
- `_check16` shim `history` them `pushState` (nut Back cua trinh duyet), va **hai cau ve nut Dung
  lai demo do bang CHU DA VE RA**, khong do bang chuoi trong ma nguon nua.
- `_checkui` cho hinh hoc cua tour **doi theo TRANG THAI** (neo dung yen) thay vi ngu 950ms - ngu
  mot khoang co dinh la DUA voi hieu ung cuon, khong phai doi no.
- `_checkaudit` bat that mot loi V9.90: o v6, trang **Ban lam viec** ve **hai bang viec** ("ban:
  bang quan ly x2"). Goc: `renderBan` vua goi `pageHead(...)` (dau trang tu gan bang viec) vua goi
  `bvSau()` sau thanh chon thuc the. O v5 khong ai thay vi Ban lam viec khong phai trang dap cua
  chuc danh nao nen bang rong. Nay `renderBan` truyen `hoan=1`.
- `_checkui` them mot mat moi: **DO TUONG PHAN CHU/NEN** (V9.92). Anh Luan gui anh chip "Qua han"
  dang chon - chu do sam tren nen navy, doc khong ra. Loai loi nay khong bo kiem nao thay duoc:
  HTML dung, khong tran, khong cat, nut du to. Nay tinh ti le tuong phan WCAG cho moi phan tu TU
  NO mang chu, duoi 3.0 la do (chip kia do duoc 1.9). **Co y khong lay 4.5 cua chuan AA**: app
  dung nhieu chu phu mau xam nhat co chu dich, siet thang len 4.5 la do hang loat cho khong ai
  keu - thuoc keu qua nhieu thi nguoi ta tat no di.
- `_checkui` **do o ty le 100%, khong do o ty le mac dinh 90%** (V9.96c). Sau khi app mac dinh
  thu nho 90%, thuoc bao **141 nut qua nho**. Phan xa dau tien la phinh nut len 27px cho qua
  thuoc - lam roi: **van con 107 cho do** va app dac lai trong thay. Do la dau hieu ro rang cua
  viec **dang do sai dai luong**. Luat "nut >=24px" tinh bang **pixel CSS** - no noi ve kich
  thuoc NGUOI THIET KE dat ra, khong phai kich thuoc sau khi nguoi dung tu thu nho man hinh; nut
  24px xem o 90% ra 21,6px vat ly, y het nhu nguoi dung bam Ctrl+-, do la LUA CHON CUA HO. Nay
  harness khai san `ITTS_ZOOM_V1=100` vao localStorage trong `addInitScript` de app tu dung ty le
  goc. Ban than nut ty le co phep thu rieng (smokezoom) va `zoomApply` tu tat thu nho duoi 1200px.
  **Luat: thuoc va app cai nhau thi phai tim ra ben nao sai - dung mac dinh la app, va cung dung
  bit mieng thuoc; sua cho no do dung dai luong.**
  Kem mot bay ky thuat dang ghi lai: hai ham phu cua phep do phai nam TRONG than `PROBE`, vi
  `page.evaluate` chi gui than ham do sang trinh duyet - de o ngoai thi ben kia khong co, va loi
  ay IM LANG (phep do tra ve rong, bo kiem van xanh).
- Bay "chuoi con chuoi" o CA HAI bo (`_checknguoi`, `_checknv`): loc nguoi dang di lam bang
  `/active|đang|working/` - ma **"inactive (Đã nghỉ việc)" CHUA chu "active"**, nen 4 nguoi da
  nghi van duoc cham nhu nguoi dang di lam. Nay hoi thang `staffActive()` cua app.
  **Luat: dung viet lai luat cua app bang chu cua minh.**
- **`_checkbam.js` (MOI, V9.93)** - **BAM THU MOI THE VA MOI DONG TREN MOI TRANG**, tren trinh
  duyet that. Anh Luan mo ban demo online va hoi: *"Vay lam sao biet o cac trang khac co ton tai
  loi gi ko?"* - cau tra loi that long luc do la KHONG BIET. Ca 22 bo kiem cu khong bo nao bam
  vao mot cai the: 20 bo do CHUOI HTML (khong bao gio chay vao ham mo ngan keo), `_checkui` chi
  NHIN, `_checknv` chi bam nut "Lam" o Ban lam viec. Nen hai loi that nam im rat lau:
  (1) `SVTPL` duoc dung o 5 cho ma **chua bao gio duoc khai** - mo form Gui khao sat la chet
  ngan keo, khong mot dong bao nao cho nguoi dung, ca luong Khao sat dinh ky cua SOP dung im;
  (2) the khieu nai / phan hoi va dong lop trong bang khao sat **khong bam duoc**.
  Chay lan dau: **92 cho bam vao khong co gi xay ra**. Nay 0.
  Khong chi hoi "co bam duoc khong" (anh Luan: *"khong chi bam, ma phai xem tinh hop ly cua no
  va hanh dong, va trang mo ra, noi dung tuong tac"*) ma con hoi: mo **DUNG ho so vua bam**
  khong · co lo `undefined`/`NaN`/`[object Object]` ra man khong · ngan keo co rong khong.
  Hai bay cua chinh cai thuoc da cat: (a) "khong co gi xay ra" bo sot tin hieu **than trang ve
  lai tai cho** (Ban lam viec mo ho so ngay trong trang) - tu oan 8 dong dang chay dung; (b) rut
  ma ho so tu `textContent` thi chu cac o dinh lien nhau ("LOP-FOUND-PLA-01"+"10"+"100") thanh
  mot ma bia ra - nay chi hoi khi dong TU KHAI ma bang `data-mo-arg`.
> **DUNG SUA `verify.sh` TRONG LUC NO DANG CHAY** (bay da can 05/08). Bash doc file script
> TUNG DOAN chu khong nap het mot lan, nen them mot dong vao giua file dang chay lam no doc
> tiep tu sai vi tri: luot do bao `verify.sh: line 226: syntax error near unexpected token '('`
> trong khi file hoan toan dung cu phap (`bash -n verify.sh` sach). Mat vai phut tuong la minh
> lam hong bo verify. Sua xong thi doi luot dang chay ket, hoac dung han no roi hay sua.

- **`_checklap.js` (MOI, V9.99z10)** - **MOT MAN KHONG DUOC NOI HAI LAN CUNG MOT THU**. Anh Luan
  05/08 kem anh trang Chi so cua Ban Giam doc: *"man cua giam doc lap cai gi day?"* - hai thanh
  "Xem viec cua:" chong len nhau. Goc: o do co BA noi goi, **moi noi deu dung phan minh** - trang
  Chi so tu dat mot o, roi goi `bvSau()` ma bang viec lai tu chen mot o nua khi trang dang xem
  chinh la trang dap cua chuc danh; voi Ban Giam doc trang dap dung la trang Chi so. Va bang cach
  de CHINH cai o tu biet minh da ra mat trong luot ve nay chua (co dat lai o dau moi luot ve
  than trang) - khong di sua tung noi goi, vi mai them noi thu tu la lap lai.
  **BAY DA CAN - VI SAO BO NAY PHAI CHAY TRONG TRINH DUYET:** ban dau viet kieu node (goi thang
  `RENDER["baocao"]()` roi dem chuoi). No bao XANH ca tren ban CU dang loi, vi trong node
  `banAiHTML()` tra ve rong - dem duoc 0 thanh o ca hai ban. Chay bang Chromium that, dang nhap
  dung NV009: ban cu **2 thanh**, ban moi **1**. Day la lan thu HAI trong cung mot ngay mot cai
  thuoc bao xanh oan (lan dau: `_checkmoi` do tren chuoi tho). **Luat rut ra: bo kiem moi phai
  duoc thu nguoc tren ban CU va phai DO o do, truoc khi duoc tin.**
  Bon phep dem tren 16 chuc danh / 856 tieu chi: thanh "Xem viec cua" toi da MOT · dau trang toi
  da MOT · hai khoi `.tbar` giong het nhau · hai `.notebar` cung mot cau.
  **L5 (them 13/08) - THE VA CHIP LOC KHONG DUOC NOI CUNG MOT THU.** Anh Luan kem anh man Xep
  lop: *"the va chip loc co ve de bi trung nhau dung ko? neu trung thi bo the"*. Do that: **13
  man** co mot the va mot chip mang y nguyen mot nhan, **3 cho hai ben con noi HAI CON SO** (Xep
  lop 2/3 - chip thieu mot dieu kien ma the co; Lead 20/24 - the do moc hen den GIO NAY, chip den
  HET HOM NAY; Buoi hoc 0/20 - the dem "chua nhan xet va CON TRONG HAN", chip dem moi buoi chua
  nhan xet). Luat: **hai dai cung mot man noi cung mot dieu thi bo dai KHONG BAM DUOC** - chip
  mang so va loc duoc, the chi mang so.
  **BAY: ban do dau HEP QUA.** No chi khop nhan Y HET nen bo sot chip viet tat - sua 5 man xong
  do lai con 8, tuong sap xong. Noi sang "mot ben la ban viet tat cua ben kia VA cung mot con so"
  thi lo them 5 cho nua (the "Qua han ghi nhan xet" vs chip "Qua han ghi"...). *Ten ngan hon thi
  van la mot cau hoi.*
- **`_checkcrumb.js` (MOI, V9.99z10)** - **VET DUONG DI PHAI NAM TRON MOT HANG**. Anh Luan 05/08
  kem anh: *"em nen co phuong an cho breadcrumb nhe, no rot hang rat xau neu dai"*. Trong chinh
  anh do con loi thu hai: mot moc dung LIEN NHAU HAI LAN.
  Hai cai sai, hai goc: (1) `.crumb{flex-wrap:wrap}` - vet dai thi rot dong hai. Nhung cam rot
  hang khong thoi la vet bi cat cut o mep phai, mat luon moc CUOI - ma moc cuoi moi la "toi dang
  dung o dau". Nen: MOT HANG, chat thi cac moc GIUA teo truoc, moc dang dung giu it nhat 140px.
  (2) Lich su gan trung theo KHOA TRANG, ma `buoihoc` va `hoctap` ve ra dung mot dong chu vi
  `go()` gop tab con ve trang cha - gan theo khoa la gan cai MAY thay, nguoi doc chi thay CHU.
  **DO O BA KHO MAN (1440/1100/860) - va day moi la diem chinh: loi nay KHONG lo ra o 1440px.**
  `_checkmat` co y chi do mot kho man nen no khong the thay. Ban cu do lai: 22px o 1440 nhung
  **41px o 1100 va 60px o 860** (hai va ba dong). Ban moi: 22px o ca ba.
  Da tu thu lai cai thuoc: chay tren ban CU thi no do dung hai kho man hep.
- **`_checklink.js` (MOI, 12/08)** - **TEN NGUOI PHAI BAM DUOC O MOI CHO**. ACA doi
  *"ten hoc vien o dau cung bam duoc de mo thong tin nhanh"*, anh Luan chot: lam.
  No VE THAT tung trang roi hoi TRINH DUYET, khong doc chuoi va khong doan cu phap: voi moi NODE
  CHU chua ten mot hoc vien that trong DL09, hoi `closest("a,button,[onclick],select,option")`.
  Chinh trinh duyet tra loi "cho nay bam duoc hay khong", nen ket qua bang dung cai nguoi dung thay.
  **Ban do dau tien viet bang regex dem ra 428 cho tren 24 trang - GAP BON LAN su that (101),**
  vi no chi ngo lai 220 ky tu tim the mo va khong thay noi `<div onclick>` boc ca dong.
  *Dung tu dung bo phan tich cu phap khi thu hieu cu phap dang nam ngay do.*
  Nguong 3: hai dang duoc mien co ly do doc duoc - ten nam trong CAU CHU TU DO nguoi dung go
  (ly do chiet khau), va ten o TIEU DE TRANG HO SO cua chinh hoc vien do. Kem SAN PHAM VI 30 trang.
- **`_checkdrawer.js` (MOI, V9.99z10)** - **HINH HOC CUA NGAN KEO**, do bang Chromium that.
  Anh Luan 05/08 kem anh chup: *"co vai loi css o drawer em"* - o chon hoc vien cao 224px, chua
  mot mang trang gan nua man hinh. Goc: `.pk{flex:1 1 224px}` dat hoi V9.99f de noi CHIEU RONG,
  nhung `flex-basis` do theo TRUC CHINH CUA CHA - thanh loc xep ngang thi ra chieu rong (dung y),
  ngan keo xep doc thi ra CHIEU CAO. Mot dong CSS, hai noi hieu hai nghia.
  Vi sao 29 bo cu khong thay: `_checkux` soi NOI DUNG form chu khong soi hinh; `_checkmat` soi
  hinh nhung di theo TRANG, khong mo ngan keo. Cho ho nam dung giua hai bo.
  Bon phep do tren 25 ngan keo that / 15 trang: **o mot dong ma cao qua 64px** · **tho ra ngoai
  / cuon ngang** · **khe trong qua 40px giua hai muc** (dung cai mat anh Luan thay) · **o nhap
  det duoi 30px**.
  **DA TU THU LAI CAI THUOC:** chay bo nay tren ban CU (ban con loi) thi no phai DO - va no do
  that, bat dung 224px o ngan keo "Giao viec moi". Mot cai thuoc chi bao xanh ma chua tung bao
  do la mot cai thuoc chua ai biet no do duoc gi khong.
- **`_checkmoi.js` (MOI, V9.99z10)** - **KHONG MOI ROI DUOI**. Anh Luan 05/08: *"o trang lop hoc
  cua truong phong ACA lai co nut Xep lop va onboarding, bam vao thi: Trang ngoai pham vi chuc
  danh cua ban - dang xem o che do THAM KHAO. Day la 1 dang loi nang do em."* Do lai: **67 cho**
  tren 16 chuc danh. `_checknguoi` da hoi "menu co muc nao moi roi duoi khong" - nhung chi hoi
  tren MENU. Loi vao con nam ca trong THAN TRANG: nut nghiep vu dau trang, o so trang Bao cao,
  dong viec trang Viec hom nay, banh rang dan sang Cai dat. Bo nay dong vai 32 nguoi dang di lam,
  ve THAT moi trang trong pham vi cua ho roi hoi hai cau cho tung trang: con `<button>` nao dan
  ra ngoai pham vi khong, va con o/dong bam duoc nao dan ra ngoai khong. **603 tieu chi.**
  Vá o dung MOT cua - `scrubMoiRoiDuoi()` goi trong `go()`, hai cach xu khac nhau co chu y:
  nut thi **bo han** (mot cai nut la mot loi moi lam viec), o so thi **giu con so, chi go cu bam**
  (bo ca o la bot thong tin cua ho - pham LUAT CUNG SO 0).
  **BAY CUA CHINH CAI THUOC:** lan chay dau ra "67 cho" y het luc chua va, vi no do tren chuoi THO
  cua `RENDER[k]()` - ma bo loc nam o `go()`. Phai do SAU khi goi `scrubMoiRoiDuoi` moi la do cai
  nguoi dung that su nhin thay. Do ban tho thi do oan; do ban da qua `go()` moi dung cua.
- **`_checkdem.js` (MOI, V9.99z11)** - **SO TREN THE PHAI TIM DUOC O DANH SACH**. Hai lan trong
  hai ngay anh Luan bat dung mot benh, o hai cho khac nhau: 06/08 *"2 buoi qua han chua nhan xet,
  nhung a nhin xuong buoi, a ko thay icon nen a ko biet cho nao"*; 07/08 *"tuong tu truong hop luc
  nay, bao 2 hoc vien nguy co ma a chang thay dau"*. **Goc chung: cai THE va cai BANG hoi HAI HAM
  KHAC NHAU cho cung mot cau hoi.** The "HV nguy co" dem bang `stuRisk()` = co NGUOI GAN **hoac**
  MAY THAY vuot nguong (vang khong phep >= `thresholdAtRisk_absences`, thieu bai >=
  `thresholdAtRisk_hw_missing`), tru nhung em hoc vu da tam gat co ly do; con bang "Hoc vien trong
  lop" doc THANG hai cot trang thai - chi thay co nguoi gan. Em nao may thay ma chua ai gan co thi
  vao THE ma khong vao BANG. Con so khong sai, cai sai la **no khong dan toi dau**.
  Bo nay mo Chromium that, di qua TUNG LOP, doi chieu bon dieu: **D1** the "HV nguy co" == so dong
  mang chip "Nguy co"; **D2** so buoi con no viec == so chip buoi mang dau `.swarn`; **D3** hai o
  dem buoi khong duoc lon hon so chip co dau; **D4** moi dong "Nguy co" phai NOI DUOC VI SAO
  (co `data-tip`) - chi ra cho thoi chua du, nguoi doc con phai biet nen tin co nguoi gan hay so
  may dem. **Da thu nguoc tren ban cu: 18/88 do**, trong do co dung ca "LOP-PRE-06: the ghi 4 ma
  bang 0 dong" - dung cai anh Luan nhin thay.
  **VA NGAY LUOT CHAY DAU TIEN NO BAT DUOC MOT LOI KHAC, NANG HON:** `coDD` khai bang `var` ben
  trong khoi tinh may o "Can xu ly cho lop nay" nhung vien buoi phia duoi lai doc no - ngoai pham
  vi, nen tab **"Buoi hoc & diem danh"** nem ReferenceError va khong ve ra gi. Tab CHINH cua trang
  Van hanh lop chet cam, ma khong bo kiem nao truoc do bao: `_checkui`/`_checkmat` mo trang nhung
  khong bam vao dung tab do. **Bai hoc: mot tab khong co bo kiem nao bam vao thi hong bao lau cung
  khong ai biet.**
- **`_checknguoi.js` (MOI, V9.91)** - dong vai **tung NGUOI** trong DL01 (37 nguoi / 18 chuc danh),
  khong phai tung chuc danh. Vi sao can them mot bo nua: pham vi du lieu cat theo CHI NHANH va
  theo NGUOI PHU TRACH, nen 7 nhan vien tu van o 5 co so nhin ra 7 man hinh khac nhau - lay mot
  nguoi lam dai dien la bo qua 6 man con lai. Tam cau cho moi nguoi: vao duoc khong · thanh tren
  co dung ten ho khong · trang dap co noi dung khong · menu co muc nao **moi roi duoi** khong
  (bam that, xem co hien "ngoai pham vi chuc danh" khong) · co viec cua chinh ho hoac duoc chi
  duong khong · quyen CH3 co lech giua hai nguoi cung chuc danh khong · **pham vi khai co cat
  that khong** · Tro ly co nhip ngay cho ho khong. Chay lan dau ra mot loi that: **Leader Tu van
  Co so 1 khai "team" ma nhin thay tron 82 hoc vien cua ca 5 co so**.
  Hai bay cua chinh cai thuoc, deu tu oan app, deu cung mot kieu - **do cai danh muc thay cho cai
  da ve ra**: (1) duyet `navCay()` roi hoi `canSee` -> ca 37 nguoi deu "menu bay ra 30 may muc
  khong duoc xem", trong khi `navCay()` chi la cay day du con `buildNav` moi loc; (2) hoi `canSee`
  tren ma TAB CON cua hub (duyetgiao...) - `go()` remap sang trang cha roi moi xet quyen.
- `_checknv` them hai mat: moi ngan keo di qua deu bi hoi *"con o chon dai nao chua co o tim khong"*,
  va mot lan moi ban build **go THAT** vao o tim roi bam chon, doi chieu `<select>` an ben duoi co
  nhan dung gia tri khong. "Co o tim" moi la mot nua; mot o tim chet van co o tim.
- `_check16` doi cach canh cong tac khoa chuc danh: khong canh mot trang thai co dinh nua ma canh
  **ca hai nac** (mo / khoa) - chat hon truoc, vi nac "mo" chua tung duoc do lan nao. Kem mot bay
  da can: hoi mac dinh cua mot tham so thi phai **xoa han khoa** roi hoi, dat no bang 0 roi hoi
  lai la dang do tac dung phu cua chinh minh (pha ham o ban build ma bo kiem van xanh).
- `_checktour` bat that loi thu hai cung goc: buoc `tn_hotro[0]` neo `@bangviec` cam cung trang
  `banlam` - trang dap cua **ban v5**. O v6 moi chuc danh dap xuong `ban` nen neo roi ra ngoai.
  Nay `p` doc `V6()`. **Luat lai lan nua: ban do nao cam cung theo mot ban build thi ban kia se
  lang le mat tinh nang.**

## 09/08 - BA PHEP HOI MOI, SINH RA TU MOT DOT AUDIT TAY (khong them bo kiem nao)

`./verify.sh` xanh het 31m41s, 0 cho do - roi ngoi nhin man hinh van ra **sau loi**, hai trong do
la **ro ri pham vi du lieu that**. Ba phep hoi duoi day va dung ba lo hong ay, gan vao bo kiem DA
CO chu khong dung them bo moi (hoi dong 08/08: them mot bo la them mot cho phai nuoi).

- **`_checknguoi` - O CHON NGUOI KHAC.** Nguoi **khong phai quan ly** ma man hinh bay ra `<select>`
  mang ma nhan vien cua nguoi khac thi do. Bat duoc hai lo that: o *"Cua giang vien"* tren Buoi hom
  nay (giao vien thuong chon xem so cua **14 giang vien** khac) va o *"Tu NV"* tren Ban giao lead
  (nhan vien tu van thuong doc **tron so lead cua dong nghiep ca 5 co so, kem ten va so dien thoai**).
  **VI SAO 40 BO KIEM CU KHONG THAY - cau nay phai nho:** `_checknguoi` von so **SO DONG** danh sach
  giua nhung nguoi cung chuc danh. Mot o chon **khong lam doi so dong nao ca** - no chi mo mot canh
  cua. *Pham vi du lieu khong chi la "toi thay bao nhieu dong", no con la "toi doi duoc sang nhin ai".*
  **Chi soi o DOI MAN NHIN** (co `onchange` ve lai trang), khong soi o nhap cua cua ghi: ban dau gop
  ca hai nen to oan `id="bgDest"` - o chon NGUOI NHAN, ma nghiep vu ban giao khong the thieu. Cho
  di thi khong doc duoc gi cua nguoi kia. Ngoai le khai o `ROR_BOQUA` kem **ly do doc duoc**.

- **`_checkbam` - HOI CA TIEU DE NGAN KEO, KHONG CHI THAN.** Cau cu chi soi `than.chu`, nen **tieu de
  ngan keo la mot vung KHONG AI DO**. Do la cho lot `Tu van &amp; Dang ky sau test`: `openDrawer` dat
  tieu de bang `textContent` ma cho goi lai `esc()` truoc - escape HAI LAN, 16 trang co dau "&" deu
  dinh. Nay danh sach chu may co them thuc the HTML (`&amp;` `&lt;` `&gt;` `&quot;` `&nbsp;` `&#nn;`):
  mot thuc the con song tren man luon luon la dau hieu escape hai lan.

- **`_checkmat` - QUET THUC THE HTML TREN CHU NGUOI DOC THAY.** Cung con benh, do o tam ca app: 15
  trang, doc `textContent`. **Phai hoi o tang `textContent`, khong hoi `innerHTML`** - trong ma nguon
  `&amp;` la cach viet DUNG cua mot dau "&", khong phan biet duoc.

**Bay cua chinh nguoi do, ghi lai vi mot buoi cắn nam lan, deu mot ho:**
truyen **ma chuc danh** vao `gateEnter` (no doi ma NHAN VIEN, khong thay thi roi ve nhom mac dinh -
ca sau nguoi cung dap xuong `giaoviec`) · dung **mot tab** cho nhieu nguoi (tinh nang "F5 giu nguyen
trang" ghi dia chi vao URL nen tu nguoi thu hai tro di ai cung roi ve trang nguoi dau) · build ra
**goc repo** roi trich JS bang **mac dinh `_src`** (dung bay da ghi san trong `extract_js.py`, `_APP.js`
la ban CU) · goi `naFor(s)` mot tham so (that ra `naFor(sheet,r)`) roi dem ra 0 · dung `myTeam()` cho
nguoi thuong (ham ay gom ca "cung phong, cap thap hon" - no tra loi *"doi cua mot quan ly gom ai"*,
khong tra loi *"toi duoc xem so cua ai"*).
**LUAT: khi so do ra vo ly, doc lai PHEP DO truoc khi doc lai app.**

## 09/08 VONG HAI - BON PHEP HOI NUA TRONG `_checkaudit` (M9, M9b, M10, M11)

Vong hai cua dot audit: soi rong hon bang MAT (16 trang + hai cong + ngan keo mo bang cua that),
ra them **bay loi that**, van khong loi nao do bo kiem bao. Bon phep hoi duoi day sinh ra tu dung
bay loi ay - va ca bon deu gan vao `_checkaudit`, khong dung them bo kiem moi.

- **M9 - BA CAU CAI NHAU TREN MOT MAN.** Doc TRON mot man roi hoi cac cau tren man co noi nguoc
  nhau khong. Bat duoc lo LUAT SO 0 to nhat tuan: ngan keo 360 vua ghi *"nguy co - thieu 3 bai"* o
  dau, vua ghi *"NA018: dang hoc deu va on dinh, khong can lam gi them"* o cuoi. **13/13 hoc vien
  dang hoc ma co nguy co** deu bi tran an nguoc. Phep hoi: ma viec SOP man hinh in ra (`jInfo().na`)
  phai khop ma `naFor("DL09", ho so)` tinh duoc, moi khi ho so dang co co nguy co.
  *Vi sao 40 bo kiem khong thay:* `check_sop.py` canh HAM `naFor` (dung), `_checkbam` canh ngan
  keo co noi dung (dung), `_checklap` canh khong noi hai lan (dung). Khong bo nao hoi: **cai ham
  tinh dung ay co duoc in ra man khong.** Cho noi giua ham dung va man hinh la mot vung trong.

- **M9b - CAU RA LENH CON SONG TREN HO SO DA XONG.** The WOW mang chip "Xong" ma van ghi *"can xac
  nhan giang vien... roi bao lai hoc vien do"* - **39/46 buoi** hoc vien tu dat. Goc: tron CAU SU
  THAT ("hoc vien tu dat qua cong" - dung moi luc) voi CAU VIEC ("can xac nhan" - chi dung o nac
  cho). *Mot man hinh noi doi vai cho nho thi nguoi dung thoi tin ca nhung cho no noi that.*
  **Phep hoi nay sai HAI lan truoc khi dung** - ghi lai vi ca hai deu la bai hoc chung:
  (1) soi chuoi HTML TRON TRANG -> do ca khi app da dung, vi trang luon co 13 buoi con o nac cho
      va chung hien cau giuc la DUNG;
  (2) cat theo the roi doc NHAN CHIP de doan trang thai -> van sai, vi chip la chip TIEN DO:
      `booked`, `confirmed`, `cancelled` **cung hien "Dang xu ly"**.
  Ban ba khop tung the ve DUNG BAN GHI cua no (ten hoc vien + ngay gio) roi hoi DL14. Chinh luot
  do ay lo them mot loi that: **3 buoi da HUY deo chip "Dang xu ly"** - bac thang chip khong co
  nhanh nao cho `cancelled`.

- **M10 - O CHON MO CUA.** Doc MA NGUON tim moi o chon DOI MAN NHIN (`<select ... onchange=` co
  `reRender`/`go(`/`window.X=`) dung danh sach nguoi tu `rows("DL01")` ma khong di qua mot cau hoi
  pham vi. Bo sung cho `_checknguoi` (ve THAT tung trang tren menu tung nguoi): ve trang chi thay
  nhung trang minh nghi ra de ve, doc ma thi thay ca nhung cho minh quen mat la co.
  **Ban dau cat "than ham" bang tach chuoi o moi `function render[A-Z]`** - "than" cua `renderWow`
  dai **33.691 ky tu**, om luon chuc ham khac, nen o `<select id="wa_stu">` cua FORM DAT BUOI bi
  tinh thanh o cua `renderWow`. Nay cat bang DEM NGOAC.
  Phan biet CUA XEM voi O NHAP bang cho `onchange` dan toi, khong bang su co mat cua no: `tk_to`
  (chon nguoi NHAN viec) co `onchange="tkTypeAuto()"` nhung khong doi mot dong du lieu nao tren man.

- **M11 - KIEU O KHAI RA MA BO VE O KHONG BIET.** Bang Hoc vien khai hai cot `calcso`, con `cell()`
  chi hoi `calc`/`calcmoney` o cua vao - hai cot roi xuong nhanh chung, doc mot khoa khong ton tai,
  in dau "-". **10/20 dong dau** ghi "-" trong khi may dem 1-3 bai thieu. Tinh nang duoc viet DUNG
  roi chet ngay o cua vao va song chet lang le gan mot tuan, vi bang van ve ra binh thuong voi mot
  dau gach **trong rat hop le**. *Cai chet lang le nhat cua mot tinh nang la no van ve ra duoc.*
  Hai phep hoi: (a) CAU TRUC - moi kieu o khai trong `LISTCFG[*].cols` deu phai co ten trong than
  `cell()` (bat duoc CA HO, khong can ai nghi ra truong hop cu the); (b) THUC TE - cot tinh ra so
  > 0 thi khong duoc in dau gach.
  **Ban dau tim chuoi trong ca CHU THICH** - mot cai ten chi duoc NHAC TOI trong ghi chu cung lam
  no xanh, ke ca ghi chu vua viet ra de giai thich ban va. Nay boc chu thich truoc khi hoi.

**`_checkmat` them 5 trang + 2 phep do.** Vua dung xong phep do "so bi be doi giua hai chu so" thi
no bao xanh ngay - vi `bangcong`, trang DUY NHAT co loi ay, khong nam trong danh sach 15 trang no
di qua. Dung cai bay ghi san o dau chinh file do. Them 5 trang (`bangcong` `giangvien` `baitap`
`lichtuan` `tracuu` - deu la KIEU BO CUC rieng cua V2) thi bat ngay 2 loi khac chua ai tung do.

**`_check14` do CA MAN cong phu huynh**, khong chi than trang: menu (`hvNav`), thanh tren
(`hvTopPaint`), dong tieu de (`hvTopTitle`). Ba cho ay deu ghi thang `innerHTML`, di vong qua cua
doi xung ho `hvXungLoc`. *Mot cua ra ma co ba loi di vong thi no khong con la cua ra - va thuoc chi
soi cua chinh se khong bao gio thay ba loi kia.*

**THUOC DO SAI THI DEN XANH CON NGUY HIEM HON DEN DO - vi den do thi nguoi ta di tim, con den xanh
thi nguoi ta di ngu.**

## 09/08 VONG BA - `_checkmat` DO HAI KHO MAN (1440 + 390)

Cai tim ra lon nhat vong nay khong phai mot loi giao dien, ma la **mot phep do dat sai cho**.

`_checkmat` co san phep do **M4 "dau ngan mo coi"** - dung ra tu chinh loi anh Luan bat 04/08
(breadcrumb rot dong de lai dau "›" treo). No xanh suot tu do toi nay. Nhung bo nay **co y chi do
mot kho man 1440px cho re** - va "dau ngan mo coi" la **LOI DO XUONG DONG**, ma chu chi xuong dong
khi khung hep.

> **DO MOT LOI-DO-XUONG-DONG O KHO MAN RONG NHAT LA DO DUNG CAI TRUONG HOP NO KHONG THE XAY RA.**

Mo app o 390px la thay ngay: dong chao doc thanh *"72 viec can xu ly · 54 qua han ·"* - mot dau
cham giua treo lo lung cuoi dong, vi muc thu ba rot xuong dong duoi con dau ngan cua no o lai.

**Nay `_checkmat` do HAI kho man** (`maytinh` 1440x900 + `dienthoai` 390x844). Nhan loi mang ten
kho o dau dong. Ngay luot chay dau tien sau khi them kho, no bat them **nam cho** chua ai tung do.
Van re: ca hai kho duoi mot phut, nen bo nay o nguyen TANG NHANH.

Hai dieu chinh di kem, deu la quyet dinh co ly do:
- **TRAN_FAB 6 -> 12.** Khong phai noi luat: cung mot cai nut Tro ly, nay duoc soi tren hai kho
  thay vi mot, nen so cho no tinh co nam de len cung gap doi. **Tran phai noi ve CUNG MOT PHEP DO
  thi con so moi co nghia** - giu 6 khi da do gap doi la mot cai tran nghiem khac GIA, no se do vi
  ly do khong lien quan toi chat luong app.
- **Cho phep cat chu o `input.pki` KHI VA CHI KHI kho man <= 480px**, kem ba ly do doc duoc: danh
  sach xo ra hien du ten · ngay duoi thanh chon la khoi thong tin in lai day du · go de tim van
  chay. Tren kho may tinh thi KHONG tha - o do cat chu la do bo cuc sai, va 09/08 da va dung mot
  ca nhu the tren trang Bai tap.

**BAY CUA CHINH NGUOI DO, ghi lai vi no dat:** em dung mot thuoc moi "nut bam qua be tren dien
thoai" nguong 28px, no bao **34 cho**. Doc ky thi gan het la **chu noi dong**: mot ten hoc vien
rong 27px nhung **cao 46px** - ngon tay bam thua suc. `_checkui` DA CO luat dung cho viec nay tu
lau (chi tinh nut that: `button`/`select`/`input` khong phai checkbox, hoac lop `btn|pill|tbtn|
stab|chipbtn`; nguong 24px) va **ghi ro ngay trong ma**: *"Link chu trong cau cao 15px la binh
thuong - bat no la bao nham hang loat"*.
**Em viet lai mot cai thuoc da co, va viet do hon ban cu.**
**LUAT: truoc khi dung mot phep do moi, di hoi xem app da co phep do ay chua - va neu co, doc ly
do nguoi ta dat nguong nhu the.**

### M7 - VACH NGAN MO COI (`_checkmat`, dat 09/08)

Ho hang cua M4, nhung M4 khong the thay: **M4 tim dau ngan bang KY TU** (`·›|`), con vach ngan
`.tbdiv` / `.sep` **ve bang CSS** - `textContent` cua no RONG.

Nhin kho may tinh bang 768px thi thay giua hai hang chip co **mot dong trong chi chua dung mot
vach doc**, cao 40px. `.tbdiv` la phan tu flex DUNG RIENG nen khi thanh cong cu xuong dong, no o
lai mot minh va chiem tron mot hang.

Do duoc o MOI KHO, khong rieng man hep: **dien thoai 10 · may tinh bang 7 · laptop 6 · may tinh
1440 van 3**. Tuc la no van hong ngay tren kho ma moi bo kiem dang do - chi la chua ai nhin.

Phep hoi: mot vach ngan ma tren CUNG MOT DONG ben phai no khong con gi, thi no dang ngan cach hai
thu khong nam canh nhau - vo nghia va trong nhu rac.

Va: vach nay la `::before` cua nhom di sau no (`.tbgr`), nen xuong dong thi no di theo nhom, khong
bao gio con lai mot minh; duoi 560px bo han (xuong dong roi thi chinh cai xuong dong da ngan ho).
Sua 9 cho dung thanh cong cu. **Do lai: 0 tren ca bon kho, 16 trang.**

**DA CHUNG MINH THUOC SONG** - viec ma moi thuoc moi deu nen lam mot lan: tra lai ban cu thi no
DO 5 cho, va vao thi XANH. Mot cai thuoc chua bao gio do la mot cai thuoc chua ai biet no co chay
khong.

### SAN CO CHU 11px (`_checkux`, anh Luan chot 09/08: *"Cu chon 1 size hop ly"*)

Do truoc khi chon, kho dien thoai 390px: **1.470 luot chu duoi 11px** tren 26 kieu (9 / 9.5 / 10 /
10.5px). Nhung khi CHUP SAT vao xem o mat do diem anh that (3x) thi **10px doc rat ro**. Nguoi do
da NOI "10px kho doc" truoc khi NHIN, va noi sai - ghi lai vi do dung cai benh ma dot audit nay
sinh ra de chua.

Van chon nang san, vi mot ly do khac va that hon: **tieng Viet co dau**. Dau nga, dau hoi, dau mu
chong len nhau theo chieu DOC - co chu cang nho thi phan dau cang mat net, trong khi tieng Anh
cung co chu ay van du.

**Chon 11px** vi: no DA LA bac co san (128 khai bao, khong de bac moi) · gop luon bon bac 9/9.5/10/
10.5 vao mot, **thang tu 20 bac con 16** · khop muc toi thieu 11pt cua huong dan iOS · 12px thi qua
tay (12px la bac chu than, nang chu phu len bang chu than la mat thu bac thi giac).

Doi 117 khai bao CSS + 4 khai bao SVG. Do lai: `_checkmat` xanh tren CA HAI kho man, bieu do 31
nhan chu **0 cap chong nhau**.

Phep hoi quet ca `font-size:` cua CSS lan `font-size="` cua SVG. **Da chung minh thuoc song**: cam
mot cho 10px vao ban dung thi no do ngay, go ra thi xanh.

### M8 - HOI THANG TRINH DUYET XEM NO CO DANG CAT CHU KHONG (`_checkmat`, dat 09/08)

M1 tu dung mot the an roi do lai be rong chu voi dung font - ky va dung - nhung no chi chay tren
mot **DANH SACH THE CO DINH**: `input, .bsn, .bsl, .crb, h1..h4, b, .chip, button`.
**Lop nao khong co ten trong danh sach ay la mot vung toi.**

Doi cau hoi: **hoi thang trinh duyet `scrollWidth > clientWidth`**. No biet chinh xac no vua cat
cai gi, cho MOI phan tu chu khong rieng vai lop, va re hon (khong dung the do, khong phai khop font).

Do lan dau ra **100 cho dang bi cat chu**:
- **`.kpin` (ten chi so KPI): 40 cho bi cat NGAY TREN KHO MAY TINH 1440px**, cho nang nhat mat
  **148px - qua nua cai ten**. Trang Bao cao co 51 chi so theo bang BC2 cua SOP; doc ra "TB phut
  tu l…" thi khong biet chi so ay do gi. No nam do tu lau, khong ai thay, vi **thuoc chi nhin vao
  cho no duoc bao nhin**.
- `.obm` (dong phu tren the hang dang gap): 18 cho - nhung day la cat CO Y.

**Phan biet "cat vi hong" voi "cat vi co y"** la phan quan trong nhat cua phep hoi nay:
- `.kpin` - hang KPI KHONG co trang thai mo nao ca, cat la mat luon -> cho XUONG DONG thay vi cat.
- `.obm` - the dang gap, bam mo ra thi `.obcard.open` go `nowrap` va hien du -> giu nguyen, khai
  ngoai le kem dung ly do do.
- o trong bang -> da khai o `CAT_OK` (bang co cot keo duoc va nut Cot).

Do lai sau khi va: **100 -> 18, va 18 cho con lai deu la cho cat co y.**

**DA CHUNG MINH THUOC SONG:** tra `.kpin` ve ban cat chu thi no do ngay 8 cho, kem ten va so px bi
mat; va lai thi xanh.

**BAI HOC: DUNG TU DO CAI MA TRINH DUYET DA BIET.** Mot phep do tu dung bao gio cung kem mot danh
sach "do cai gi" - va cai danh sach ay chinh la vung toi.

### 7j + 7k trong `check_logic.py` - BUOI DA HEN LICH PHAI ROI VAO GIO TRUNG TAM MO CUA (09/08)

Nhin man Lich tuan bang mat thi thay **buoi WOW ghi 01:49 sang va 02:49 sang**, va moi gio WOW deu
ket thuc bang phut **:49**.

Goc: `NOW = datetime.now()` trong `gen_demo.py` giu nguyen **gio phut luc chay pipeline**, roi moi
moc dung bang `NOW - n ngay` thua huong dung cai phut ay. Do duoc **910 moc thoi gian tren toan bo
du lieu mang phut :49**.

**VI SAO KHONG BO KIEM NAO THAY - cau nay phai nho:** ca `check_data.py` lan `check_logic.py` deu
chi hoi ve **QUAN HE** giua cac moc (truoc/sau, co/khong), **khong hoi mot moc co HOP LY VOI DOI
THAT khong**. Mot buoi hoc luc 2 gio sang thi moi quan he thoi gian cua no van dung het - no chi vo
ly voi nguoi doc. **Du lieu nhat quan hoan hao van co the vo ly hoan toan.**

**SUA CHO DUNG MUC, khong sua tat:** phut :49 tren mot lan THU TIEN hay mot CUOC GOI la hoan toan
that - nguoi ta tra tien luc 7 gio 49 duoc. Cai vo ly la mot buoi DA HEN LICH. Nen chi buoi WOW
(DL14) va ca test (DL03) moi di qua ham nan gio `gioHoc` / `gioTest` trong `gen_demo.py`.

Buoi WOW ngoai gio **2 -> 0** · ca test ngoai gio **18 -> 0** · gio WOW het don 60/90 vao 7h.

**BAN VA DAU TIEN CUA CHINH NGUOI SUA CUNG SAI:** snap mu sang khung 9/15/19 day mot buoi "da hoan
thanh" sang **19h HOM NAY - tuc tuong lai**; `check_logic` bat ngay (luat 7g). Phai dat moc tuong
minh (toi qua 19h / hai hom truoc 19h) thay vi snap roi cau may.

**DA CHUNG MINH THUOC SONG:** cam mot buoi luc 02:49 vao du lieu thi 7j do ngay; go ra thi xanh.

### Luat 17 trong `fixdata.py` - DON DANG KY KHONG THE CO TRUOC LEAD (09/08)

`check_data` khai loi nay la **"loi vua"** nen bo kiem van DAT - va vi the no nam do lau ma khong ai
di toi goc. Nhung mot don dang ky ghi ngay SOM HON luc khach lien he lan dau la chuyen khong the
xay ra.

**KEO MOC TAO LEAD VE SOM HON, khong day don dang ky muon di:** `lead_created_time` nam o DAU day
chuyen nen doi no khong lam lech gi phia sau; con `enrollment_time` thi phieu thu, lich dong dot,
han xac nhan lop deu treo vao - day no di la keo theo ca chum.

Dat o **cuoi** `fixdata.py`, dung bai hoc da ghi san ngay tren luat 16: *mot luat bat bien phai
dung sau NGUOI GHI CUOI CUNG; dung giua thi no chi canh duoc phan viec phia truoc no*.

## 09/08 VONG SAU - DI TRON MOT VIEC TREN KHO DIEN THOAI (M12, M13, M13b, M14)

Vong nay khong soi tung man nua. Cau hoi khac han: **mot nguoi ngoi tren dien thoai 390px co LAM
XONG duoc mot viec khong** - mo form, dien, bam Luu, va co ban ghi that. `_checknv` da di tron
viec ay tu lau, nhung o **1440x900**. Bon lo hong duoi day deu nam ngoai tam nhin cua moi bo kiem
cu, va deu chi lo ra khi di tron ca duong.

- **M12 - O TIM KHONG BO DAU.** App co BON o tim VIET TAY (`pkSearch`, `chaySrch`, `pqSearch`,
  `ghSearch`) - khac voi o chon `.pk` duoc `pkQuet` nang cap hang loat. Ba cai loc qua `vnorm`
  (bo dau, d->d); rieng `ghSearch` dung `toLowerCase()` tron. Do that tren form **Ghi nhan phan
  hoi**: go "tran" ra **3** nguoi - va khong ai trong 3 nguoi ay ten Tran, ho la "Trang" trung
  chu; go "Tran" (co dau) moi ra **7**. Mot cua ghi cua SOP bo sot 7 nguoi ma moi cua khac tim
  ra. Tren dien thoai, bat go dung dau la bat lam cai viec cham nhat.
- **M13 - TEN TRONG DONG GOI Y NUOT CU BAM.** `nguoiLnk` sinh `<a onclick="event.stopPropagation();
  openQuick(...)">`. Dat no vao trong mot dong goi y ma chinh dong ay mang `onclick` CHON, thi cai
  ten - thu to nhat, dam nhat, dung cho tay nguoi bam - nuot mat cu bam chon roi thay luon ngan
  keo. Do that tren `pqSearch`: bam vao ten xong thi `pq_enr` bien mat cung ca hop goi y, luong
  thu tien dut giua chung. O ten chi chiem **9% dien tich dong** nhung la cho mat nhin vao.
- **M13b - O TIM PHAI TU KHAI MINH LA O TIM.** `pkQuet` gan `data-pktim="1"` cho moi o tim no tu
  dung, va `_checknv` doc dung dau ay de BO QUA - dien chu mau vao o tim la loc sach danh sach
  roi form khong chon duoc gi. Ba o tim viet tay thi khong ai gan dau, nen `_checknv` go "May thu
  tu dien" thang vao chung va **do tren mot form da hong** - den van xanh, phep do thi sai. *Kieu
  hong te nhat: bo kiem khong bao gi ca, no chi thoi khong con do cai minh tuong no dang do.*
- **M14 - DAU SAO CO NOI THAT KHONG.** Form noi voi nguoi dung bang dung mot ky hieu: `*` nghia la
  bat buoc. Do la mot LOI HUA, va no hong theo hai chieu - chieu nao cung bat nguoi ta doan. Chieu
  dau (co sao ma bo trong van luu duoc) thi ban ghi thung. **Chieu thu hai dau hon va khong bo
  kiem nao dang hoi**: o KHONG sao ma bo trong lai bi chan - nguoi ta dien du moi cho co sao, bam
  Luu, bi tu choi, roi phai mo xem con thieu gi. Tim ra tren form **Dat buoi WOW**: hai o mang sao
  (Trong tam buoi, Vi sao can buoi nay) - nen nguoi dung hoc duoc rang sao nghia la bat buoc -
  nhung `wowAddSave` lai chan o **"Hoc vien (kem quota WOW con lai)"**, o duy nhat trong form
  KHONG mang sao. Quet ca app ra **11 o** cung benh, so voi 8 o lam dung: phan nhieu cac cua ghi
  dang im lang ve dieu kien cua chinh minh.

**BA LAN LIEN TIEP MOT BO CAT THAN HAM TU VIET LAM HONG PHEP DO - va lan nay no lam XANH OAN.**
M10 v1 cat than ham bang cach tach chuoi -> "than" `renderWow` dai 33.691 ky tu. M10 v2 (va M12/M13
v1 dung chung) cat bang DEM NGOAC - va bo dem **khong hieu bieu thuc chinh quy**: gap
`.replace(/'/g,"")` thi dau nhay nam trong `/'/g` bi hieu la mo chuoi, roi troi toi het file. Do
thu: "than" `ghSearch` dai **858.581 ky tu**. O M12 cai troi ay lam DO OAN nen lo ngay; o M10 no
lam **XANH OAN** va khong lo - doan nuot vao gan nhu chac chan co chu `banQuanLy` o dau do, the la
moi ham deu "da hoi pham vi". Chan `400000` chi giau trieu chung.
**Nay ca ba deu hoi thang may JS.** App duoc nap bang `vm.runInThisContext` nen moi ham cap cao
nhat la ham THAT trong `global`; `fn.toString()` tra dung nguon cua rieng no, do chinh may JS cat.
*Dung tu dung bo phan tich cu phap khi thu hieu cu phap dang nam ngay do.*

**VA HAI LAN THUOC M14 TO OAN, ca hai deu vi doan cho khong doc duoc:**
(a) ghep nhan voi o bang cach CAT KHOI `<div class="fld">` - hai o (`ab_mk`, `bk_phqh`) bao nhan
"?" trong khi dau sao da nam san tren ma. *Mot thuoc khong doc duoc thu can doc ma van ket luan
thi no dang doan.* Nay quet NGUOC tu chinh o ve nhan gan nhat, va chan khong cho muon nhan cua o
ben canh. (b) lay o DAU TIEN gap trong nguon - trong khi `sv_sat` la id dung o HAI form khac nhau
(o "Hai long (1-5)" ben nhan vien, va o "Ban hai long muc nao? *" trong phieu hoc vien tu dien),
thanh ra doc nhan cua form nay roi dem xu toi form kia. Nay ghep o voi cua chan **GAN NO NHAT**.

## 09/08 VONG BAY - NUT DAN VE CHO DANG DUNG, VA MOT BO TO MAU DO BANG CHUOI CON (M15, M16)

- **M15 - NUT HUA DAN DI MA DAN VE CHINH CHO DANG DUNG.** Thuoc nhom M4 cua anh Luan (*"cai nay
  de lam gi"*). Quet ca **76 trang**: so `nhanvien` khai `lam:"nhansu"` va cung duoc nhung ngay
  trong trang `nhansu`, nen giua trang Nhan su co mot nut **"Sang Nhan su de lam"** - nam trong
  man, nhin ro, bam vao `CUR` giu nguyen, than trang giu nguyen, khong mot chu nao doi. Cung hinh
  dang: ba nut "Mo Khao sat & Phan hoi" nam tren chinh trang Khao sat.
  *Mot nut hua dan di ma khong dan dau ca thi TE HON la khong co nut: nguoi ta bam, khong thay gi,
  roi bat dau ngo ca nhung nut khac tren man.*
  Phai VE THAT tung trang moi hoi duoc - `CUR` chi co luc chay, doc ma nguon khong bao gio thay.
- **M16 - CHIP TO MAU THEO MOT THU, CHU LAI NOI THU KHAC.** The tren trang Ket thuc to chip theo
  **buoc quy trinh** (co ket qua ma chua chot -> ho phach) trong khi CHU ben trong la **ket qua
  hoc tap**. Ca ba ket qua deu ra ho phach: em "Dat muc tieu" va em "Khong cai thien dang ke"
  trong y het nhau, con bang ngay canh thi ve dung mau xanh. *Mau la thu nguoi ta doc TRUOC khi
  doc chu; to sai mau la dan sai ngay o cai liec dau tien.*

**VA THUOC M16 LOI RA MOT LOI CO SAN MA KHONG AI NHAM TOI: `stCls` do bang CHUOI CON TRAN.**
Do tren tron **217 ma enum that**:
  · `inactive` chua chu `active` -> to **XANH**. Nguoi da nghi viec mang dung cai mau cua nguoi
    dang lam viec. Day la kieu sai te nhat cua mau: no khong im lang, no NOI NGUOC.
  · `partially_achieved` chua chu `achieved` -> cung **XANH**, trong khi nhan cua no la
    "Tien bo ro nhung chua du".
Con 18 ma khac cung khop chuoi con nhung vo hai vi roi dung mau (`cancelled_by_itts`,
`homework_missing`, `late_submission`...). Nay hai luat, doc duoc thanh loi:
  (1) ma trung TRON VEN mot tu khoa thi tu khoa ay thang;
  (2) khop mot khuc chi tinh khi khuc ay la mot DOAN tron ven giua hai dau `_`.
`rescheduled` mat khop `scheduled` theo luat (2) nen khai thang vao danh sach ho phach.
**Doi chieu cu-moi tren tron 217 ma: dung 2 ma doi mau, ca hai la hai loi tren.** Do la cho dang
so nhat khi dong vao mot ham dung chung - nen do HET chu khong do mau.

**M16 BAN DAU TO OAN 60 CHO** - ghi lai vi dung cai bay no sinh ra de bat: no doi chieu MOI nhan
enum voi `stCls`, ke ca chuc danh ("Giam doc (CEO)") va co so ("Co so 1"). `stCls` la bo to mau
cho TRANG THAI; gap thu no khong biet thi tra "gray" - ma chip khong gan lop mau thi trong cung
xam y het. Nay chi hoi nhung gia tri `stCls` THAT SU NHAN RA. *Hoi cai minh khong co tham quyen
hoi thi con so nao cung vo nghia.*

## 10/08 VONG TAM - CON SO VA CAU GIAI THICH CUA NO DOC HAI DAM DONG (M17)

Man Bao cao in con so, roi in ngay duoi mot cau giai thich. Hai thu ay do HAI HAM khac nhau sinh
ra: `kpiCompute()` tinh gia tri, `kpiNum(code)` dung cau giai thich. Va chung doc du lieu khac
nhau: `kpiCompute` loc moi bang theo KY BAO CAO (`repF`), `kpiNum` lay `srows(...)` tran.

**Do duoc:** doi ky tu "toan ky" sang "30 ngay" thi **16/17 chi so doi so, 0/17 cau giai thich
doi**. Tren man that, ky 30 ngay in nguyen mot dong:
> *CVR Lead dang ky + coc **17%** >= 40% **Bao dong** · Pheu vo... **85/193 lead da thanh hoc vien***

85/193 la **44%**. Cau giai thich noi nguoc lai chinh loi bao dong dung canh no - va no chi hien
ra DUNG LUC chi so vao dien bao dong, tuc dung luc nguoi ta sap hanh dong theo no.

Va sau khi va: **12/17 cau giai thich nay doi theo ky**, con 4 cai khong doi la TRUNG HOP THAT
(`CLR` mau so 88 -> 17 nhung tu so van 4, vi cau cua no chi trich tu so - viec dang ton thi tu
nhien la viec gan day). Do la vi sao **phep hoi dat o NGUON chu khong dat o so lieu hom nay**:
do bang so thi co ngay hai ben tinh co bang nhau roi den xanh, va chinh cai dung ay che mat cai
sai. M17 hoi GIAO KEO giua hai ham - bang nao `kpiCompute` loc theo ky thi `kpiNum` phai loc bang
ay, dung truong ngay ay. Them mot chi so moi doc them mot bang ma quen loc la do ngay.
Ca DL12 (diem danh) khong co moc thoi gian rieng nen ca hai ham phai loc no qua buoi hoc thuoc ky
- M17 xet rieng ve nay.

**BA LAN THUOC CUA EM SAI TRUOC KHI RA DUOC KET LUAN NAY, ghi lai vi ca ba cung mot ho:**
1. Doi chieu `kpiCompute` voi `kpiNum` nhu TU SO/MAU SO -> bao 16/16 lech. Sai: `kpiNum` tra ve
   hai con so PHU de dung cau chu thich, khong phai mot ti le. Bang chung nam ngay trong ket qua:
   `CUR` cho "65/12" = 541% - *"con trong 65 cho o 12 lop"*, hai dai luong khac nhau. Em doc chu
   *"con so con THAT dung sau moi chi so"* roi tu hieu thanh tu/mau.
2. Dat ky bao cao bang `window.REPFROM` / `window.REP` - hai bien khong ton tai. Ky that nam o
   `window.REPKY` ("all"|"m0"|"30"|"90"). Hai luot do ra ket qua giong het nhau, tuc luot thu hai
   VO NGHIA ma van in ra nhu that.
3. Ket luan "16 chi so lech" khi chua he mo trang bao cao ra xem cau giai thich CO TREN MAN khong.
*Mot phat hien chi la that khi no co tren man - va mot phep do chi dung khi minh biet no dang
hoi cai gi.*

## 10/08 VONG CHIN - TRANG BAO CAO HUA MOT DANG, CAC BANG DEM MOT NEO (M18)

Trang Bao cao co mot bo chon ky, va ngay duoi no app TU IN mot cau hua. Cau cu:
*"Ky nay ap cho TOAN BO chi so ben duoi."* - **va no sai**: hoi thang `fn.toString()`,
`baocaoBranch` va `staffPerfSection` khong co MOT loi goi `inRep`/`repF`/`repRange` nao.

**BON BANG DUNG YEN KHONG SAI NHU NHAU - va day la cho suyt lam em va nham:**
- "Hoc vien nguy co", "Khoi luong viec" la ANH CHUP HIEN TRANG - dung yen la dung ban chat;
- "Hieu suat doi tu van" **tu khai du hai moc ngay tren tieu de** (*"lien he & ket noi: 7 ngay
  gan nhat · dang ky & doanh thu: toan ky du lieu"*) - TRUNG THUC, khong phai loi. Em da suyt di
  sua cot doanh thu cua no vi moi doc than ham ma **chua doc cai tieu de chinh no in ra**;
- "So sanh theo co so" khai cach GOP ("theo co so cua LOP") ma khong khai moc THOI GIAN nao.

Nen thu hong that la **cau hua o dau trang** - no mau thuan ngay voi dong chu cua chinh cai bang
nam ben duoi no - cong mot bang chua khai moc. Va: **khong doi bang phai loc theo ky, doi no NOI
RA no dang dem quang nao.** Mot con so khong noi minh dem quang nao thi nguoi doc tu dien quang
vao, va ho dien cai quang vua bam tren man.

**BON LAN PHEP DO CUA EM SAI TRUOC KHI RA DUOC KET LUAN NAY - ghi lai vi ca bon cung mot ho:**
1. `bc.js` doan ten bien tab (`bcTabs`, `BCTAB`) - **khong ton tai**. Trang bao cao la mot trang
   dai, khong co tab.
2. `bc2.js` goi `go("baocao")` khi DANG O trang do - `go()` thay `CUR` khong doi nen bo qua viec
   ve lai. Luot thu hai la ANH CU, moi khoi deu "dung yen" mot cach gia tao, va no bao **0/4 doi**.
   Sua bang cach RA TRANG KHAC roi quay lai; kiem chung ngay bang do dai than trang (11207 vs
   11644) - thieu buoc kiem chung ay thi khong cach nao biet phep do da chet.
3. Ket luan "`staffPerfSection` lua nguoi doc" khi moi doc THAN HAM ma chua doc TIEU DE no in ra.
   Suyt di sua cot doanh thu cua mot bang dang trung thuc.
4. M18 ban dau cat trang thanh khoi theo `<div class="panel"` roi so day so hai ky - **cat sai**
   vi khoi long nhau lam mot mau an sang khoi ben canh, khien bang co so bi cham la "co doi" va
   THOAT khoi phep kiem. Tieu chi ay khong bao gio do duoc, tuc la do trang tri.
   Nay hoi tung HAM, khong cat HTML.
Va mot lan **to oan**: ban dau doi moi ham phai TU goi `repF`, nen `kpiSection` bi cham do -
trong khi dong dau cua no la `var comp=kpiCompute()`, tuc no loc ky GIAN TIEP. *Doi moi ham phai
tu loc la doi sai tang: viec loc nam o cho lay so, khong nam o cho ve bang.*

**VA VERIFY TRON BO BAT LAI VONG CHIN: `_check13` CO SAN MOT THUOC CANH DUNG CAU HUA SAI AY.**
Phep canh cu: `t("noi ro ky so lieu ap cho TOAN BO chi so", h.indexOf("áp cho TOÀN BỘ chỉ số")>=0)`
- mot dong tro, khong kem ly do. Tuc cau hua ay khong phai viet au: co nguoi da dat thuoc giu no.
**Y DINH cua thuoc thi DUNG** (trang phai noi cho nguoi doc biet ky ap cho cai gi), **cau ma no
canh thi SAI**. Mot cai thuoc canh cho mot loi hua sai thi no dang giu cai sai dung yen.
Nay DOI CAU HOI chu khong xoa thuoc, dung bai hoc da ghi tu Khuc 2: *moi lan do mot tang cau truc
la mot lan phai di hoi lai tung cai thuoc "nen xoa, hay nen DOI CAU HOI"*. Thuoc moi hoi hai ve:
trang van phai noi ky ap cho cai gi, va khong duoc hua qua tay. Ca hai ve deu da bi bat DO tren
ban co cau cu truoc khi nhan xanh.

## 10/08 - ANH LUAN BAT: "bam them moi o Lead & khai thac ko duoc nhi" (M19)

Sau 39 bo kiem va muoi vong verify, **cai nut "Them moi" chua tung duoc ai bam thu.**
Hong o **4/4 trang** co nut ay (Khoa hoc, Tuyen sinh, Lead & khai thac, Ghi nhan lien he) - vi
`newForm` la ham dung chung. Bam vao: khong mo form, khong bao gi, khong loi JS.

**GOC:** khung form chi sinh ra khi `pf` dung -
`var pf=(window.PREFILL&&window.PREFILL[key])||EDIT[key]` - ma `newForm` dat **ca hai ve null**.
`pf` rong nen khung khong bao gio duoc ve, roi `getElementById("formPanel")` tra null va cau
`if(p)` nuot luon. Duong mo form DANG CHAY DUOC (`openNext`) thi dat `window.PREFILL[key]={}` -
mot vat rong nhung CO THAT.

**VI SAO NO SONG LAU MA KHONG AI HAY:** ngay tren `renderList` co mot chu thich viet
*"`newForm()` dat `pf` roi ve lai, nen khung van hien ra dung luc can"* - **ma lam nguoc loi chu
thich**. Va chinh chu thich ay con ta san trieu chung: *"bam vao thi khong ghi, khong mo form,
cung khong noi gi - nguoi that se bam lai vai lan roi bo di"*. Tuc **da co nguoi nghi toi dung
con loi nay, viet no ra, roi tin rang minh da xu ly** - va loi chu thich do tran an moi nguoi sau.
*Chu thich la loi hua cua nguoi viet, khong phai bang chung ve ma.*
Con bo kiem: `_checknv` co dong vai nhan vien dien form that, nhung no vao form qua NGAN KEO,
khong qua `newForm`. Ca 39 bo di khap app ma khong bo nao bam cai nut ay roi hoi *"co form dung
duoc khong"*.

**BA LAN DUNG THUOC M19 DEU SAI TRUOC KHI NO THANH THUOC THAT:**
1. Ban dau **tu dung lai viec ma ban va lam** (`window.PREFILL[key]={}` roi ve) - tuc kiem DUONG
   VE, khong kiem CAI NUT. Xanh y het tren ca ban hong lan ban da va: do trang tri.
2. Ban hai goi `newForm()` roi `veTrang()` them mot luot - ma `PREFILL` la co DUNG MOT LAN roi tu
   xoa (`if(pf)window.PREFILL=null`). Luot thu hai khong con co, khong co khung, nen **do oan ca
   ban da va**. Nay xoa than trang, bam, roi doc dung thu cai bam ay de lai.
3. Ban "chua va" dung de doi chung **khong he chua va**: chep ca thu muc `_src` (trong do co
   `_APP.js` cua ban MOI), thay moi `gen_v5.py`, dung lai HTML nhung **quen trich lai `_APP.js`**.
   Hai ben do ra do dai y het nhau (17192 / 40856 / 21893) - dung cai bay ma chinh `extract_js.py`
   ghi canh bao trong file. Trich lai xong moi ra 15229 / 37780 / 19535 va `coFormPanel=false`.

## 10/08 - LUAT SO 2 CUA EM: PHEP DO PHAI CO DOI CHUNG, KE CA KHI NO BAO "0 LOI"

Anh Luan hoi thang: *"Ở phiên này em mắc rất nhiều lỗi ngớ ngẩn, có lý do gì ko thế?"* - va anh
liet ke dung: goi bien khong co, day V2 sang cong V1, loi kieu "bam khong an", trong khi ton rat
nhieu vong verify. Goc chung cua gan het cac loi ay: **tin dieu minh tuong, thay vi tra dieu that.**

Sau cau hoi do, khi di quet not vung "nut tren tung dong" (137 nut, chua ai bam bao gio), phep do
cua em **suyt bao cao sai HAI LAN THEO HAI CHIEU NGUOC NHAU** trong cung mot buoi:
1. Ban dau bao **12 cho kha nghi** (`runStart`, `openHoso`) - nghe rat co thanh tich. Tra ham thi
   ca hai deu ket bang `go(...)`: chung CHUYEN TRANG, va do la ket qua DUNG. 12 cho ay la rac.
2. Sua tieu chi xong no bao **0** - nhung bai tu thu luc do **khong tim duoc nut de thu** (chi tim
   tren mot trang roi bo cuoc). Nen so 0 ay cung chua co gia tri.
Phai sua bai tu thu (di tim tren MOI trang), thay no bat duoc loi gia, moi doc duoc so 0 kia.

**Nen tu day moi phep do phai mang san mot BAI TU THU:** be hong dung cai thu no dang canh, roi
xem no co keu khong. Khong keu thi moi con so no dua ra - **ke ca so 0** - deu vo nghia.
Da dung ngay trong lan dau: thuoc "bam nut dau trang" bao 12 cho kha nghi, nhung khi chay doi
chung tren ban chua va thi no **khong bat duoc chinh con loi anh Luan vua bao**. Neu khong chay
doi chung, em da mang 12 cho rac di bao cao nhu phat hien.

## 10/08 - LICH TRUC NV WOW: MOT MANG SOP BO SOT, ANH LUAN GOI TEN (M20)

Anh Luan: *"Book wow hien tai la dang mac dinh luc nao cung co nguoi, nhung tren thuc te, nguoi
dung chi duoc chon book wow dua tren lich lam viec da dang ky cua team wow thoi."* va
*"moi nguoi team wow co the tu book lich lam viec cua minh... no luu vao lich tong va hoc vien
co the chon dua tren lich nay"*.

**Tra SOP truoc khi dung - va SOP da co san:**
- man **"BANG TRUC NV WOW - THEO THANG"**: luoi cot=ngay, hang=khung gio, **o trong = khong ai
  truc**; kem "TONG GIO TRUC THEO NV WOW" va cot "Buoi da book" lay tu DL14 de **doi chieu gio
  truc voi buoi thuc te**;
- danh muc `enum_wow_slot_status` (available/booked/taught/off) **da nam trong `ITTs_data.js` tu
  dau ma app dung 0 lan** - tu vung co san, chi thieu man va luat.
**Vi sao 39 bo kiem khong thay:** `check_sop.py` diem danh 357 cot tu **18 sheet**, ma chinh SOP
ghi *"18 sheet + lich WOW"* - bang truc nam NGOAI pham vi moi phep do hien co.

**Do duoc tren ban truoc khi va:** dat duoc mot buoi WOW luc **03:00 sang ngay 01/01/2030**, app
con bao lai *"Da dat buoi WOW cho Tran Khanh Vy"* nhu mot viec binh thuong. O gio la
`datetime-local` trong tron; `waBusy()` chi NHAC "GV ban trong ngay nay", con trong thi in thang
*"GV ranh ca ngay"* - app tu khang dinh mot dieu no khong co cach nao biet.

**M20 hoi hai tang, vi hong duoc o hai tang:**
(a) CUA - ca hai duong dat buoi (`wowAddSave` cua hoc vu, `hvWowSave` cua hoc vien) phai di qua
    DL26. Hoi o nguon thi them mot cua thu ba ma quen noi la do ngay.
(b) DU LIEU - moi buoi WOW con song phai NAM TREN mot ca truc co that cua dung nguoi ay. Ve nay
    bat duoc ca nhung buoi lot vao bang duong khac, ke ca duong hom nay chua ai nghi ra.

**BAY LON NHAT KHI DUNG THUOC NAY - APP BOC LAI CAC CUA GHI:** `wowAddSave.toString()` tra ve
than cua LOP BOC ghi nhat ky - dung **375 ky tu**, giong het `hvWowSave.toString()`, khong co chu
`DL26` nao. Thuoc bao do tren **ca ban da va**. Da kiem lai toan bo: `kpiCompute` (12.738 ky tu),
`kpiNum` (4.414), `baocaoBranch` (3.747), `staffPerfSection` (5.883) deu la than THAT, nen M17 va
M18 khong dinh - **chi cua ghi bi boc**. M20 nay doc thang nguon, va cai CHOT: lat cat ngan bat
thuong thi DO, khong cho mot lat cat hut lang le di qua roi ket luan.
*`fn.toString()` cho ta thu dang chay, khong phai thu minh viet - hai cai do khong phai luc nao
cung la mot.*

## 10/08 - MO FILE SOP RA DOC THI THAY: `DL19. Lich lam viec WOW` LA MOT SHEET CHINH THUC

Sau khi dung xong man Lich truc WOW, em mo `ITTs_Operations_Template_v4.xlsx` ra dem sheet. Co
**52 sheet**, va sheet thu 30 ten la **`DL19. Lich lam viec WOW`**. Tuc mang nay khong phai
"SOP co nhac toi dau do" - no la MOT BANG DL DUOC DANH SO, ngang hang voi DL01..DL18.

**Vi sao `check_sop.py` khong thay:** `_cols()` loc sheet theo `^DL\d` (DL19 KHOP), roi di tim
mot hang tieu de gom cac o dang `snake_case`. DL19 ve theo **LUOI** (cot = ngay, hang = khung
gio) nen khong co hang ay -> `best` rong -> `continue`. **Bo qua trong im lang.** So in ra van
dep: *"bang du lieu: 19"*, va khong ai doi chieu 19 voi 20.

*Mot phep do bo qua cai no khong hieu, roi in ra con so cua nhung cai no hieu - con so ay trong
nhu mot con so day du.*

**Da bit:** `check_sop.py` nay lay ca `_dl_sheets()` (moi ten `^DL\d` trong workbook) roi tru di
nhung bang doc duoc cot. Bang nao chenh ra PHAI khai trong `LUOI` **kem bang chung app da lam** -
la nhung chuoi phai co that trong `gen_v5.py`. Khai suong khong tinh; khai roi ma sau nay ai go
mat `renderLichWow` la do. Da tu thu hai chieu: go mot chuoi bang chung -> do; bo dong khai ->
do (va con bat luon dong khai thua).

**Doc ky sheet ay ra thi lo tiep BA THU EM DA LAM THIEU** - dung dien LUAT CUNG SO 0:
- **13 khung gio** 08:30-09:30 ... 20:30-21:30. Em dat **4 khung** cho gon. 4 < 13 la BOT.
- **Cot "Cam ket/thang"** (SOP ghi 40) va **cot "Tinh trang"** (SOP tu ghi chu mau *"Thieu 11h"*).
  Thieu hai cot nay thi bang tong chi DEM, khong tra loi duoc cau nguoi quan ly team WOW that su
  hoi: **ai dang truc thieu so voi cam ket.**
- **Dong "Luot truc/ngay"** duoi luoi, va **dong THU** (T2..CN) tren dau cot ngay.

**Va mot bay day chuyen ma viec doi 4 -> 13 khung lam lo ra:** buoi WOW trong `gen_demo` sinh o
gio :00 (`gioHoc`, `random.choice([9,15,19])`), con luoi truc o :30. Khong buoi nao roi dung ca
-> `fixdata` luat 18 se **mo them mot ca dung gio buoi do**, tuc **ca NGOAI LUOI**: bang tong dem
duoc ma luoi khong ve ra. Hai cho tren cung mot man noi hai chuyen. Da nap ca hai dau: `_napKhung`
trong `gen_demo` (giu nguyen ben qua khu / tuong lai - snap mu la day buoi "da hoan thanh" sang
tuong lai, `check_logic` luat 7g bat ngay) va **luat 18a** trong `fixdata` doc khung tu CH2.
Them 6 luat `18a-18f` vao `check_logic.py` vi DL26 la bang **nhieu nguoi ghi nhat**: gen_demo
sinh, fixdata sua, roi trong app ca hai cua dat buoi WOW deu doi trang thai ca - *mot bat bien
nhieu nguoi ghi thi phai kiem sau NGUOI GHI CUOI CUNG*.

**Mot loi that nua bat duoc trong lucdon:** `lwKhung()` doc khung gio bang `paramOf`, ma `paramOf`
chay `Number(value)` roi thay NaN la tra ve mac dinh - "08:30,09:30,..." thi NaN chac chan. Tuc
trung tam vao Cai dat sua khung gio, bam Luu, app van chay y khung cu **ma khong bao gi**. Doi
sang `paramStr`. Cung ho voi bay "dung nham ham doc" - khong bo kiem nao co cua thay, vi ca hai
duong deu tra ve mot chuoi hop le.

## 10/08 - CUA DANG KY CA TRUC CHET TU LUC SINH RA, BA VONG VERIFY DI QUA KHONG AI THAY

`lwSave` - cua ghi cua ca tinh nang Lich truc WOW - goi `fmtD()`. Ma `fmtD` **khong phai ham
toan cuc**: no la mot ham CUC BO nam ben trong mot ham khac (thut le, trong khoi lich tuan).
Nghia la NV WOW mo form "Dang ky ca truc", chon ngay, tick khung gio, bam Luu ->
**ReferenceError**, khong mot ca nao duoc tao, va nguoi dung khong nhan duoc mot dong bao nao.

Cai nay song qua **ba vong verify tron bo**. Vi sao khong bo nao thay:
- `_tall` ve moi trang - nhung `lwSave` khong nam tren duong ve trang, no nam sau mot cu bam.
- `_checkdrawer` MO 27 ngan keo - nhung chi mo, khong bam Luu.
- `_check15` DIEM DANH cua ghi bang cach doc ma nguon roi doi khai ten - doc ten thi khong bao
  gio biet than ham co chay duoc hay khong.
- `_checknv` (nhan vien ao) dien form roi luu - nhung no khong di qua trang `lichwow`.

*Diem danh mot cai cua khong phai la thu mo no.*

Bat duoc la nho `_check14`, va nho mot bien co: em doi `waSlotOpts` sang gom theo ngay bang
`<optgroup>`, cung dung `fmtD`, va lan nay no nam tren duong ma `_check14` di qua nen no NEM
NGAY. Tuc lo hong lo ra vi mot thay doi khac, khong phai vi phep do nao hoi dung.

**Da bit:** `_check15` khuc 2b LAI THAT cua dang ky ca - dat CURSTAFF thanh mot NV WOW, dien
khoang ngay + tick khung gio, goi `lwSave()`, roi hoi lai: co sinh ra ca that khong; ca moi co
DUNG DINH DANG ngay voi ca do pipeline sinh khong (chinh cho nay `fmtD` sai them mot lan nua -
no tra "dd/mm" trong khi ca co san la "dd/mm/YYYY"); ca moi co mac dinh la `available` khong; co
roi dung mot khung cua luoi khong; va dang ky lai cung khoang do co bi nhan doi khong.
**Da tu thu:** va `fmtD` nguoc lai vao ban build roi chay - do dung 3 tieu chi.

## 10/08 - "GIEO LUON" - VA HOA RA HAT GIONG DA CAM TU LAU, MA VAN KHONG LAP LAI DUOC

Anh Luan: *"Gieo luon, de moi lan a bam reset demo thi ngon luon nhi"*.

**Do truoc khi lam** - va lo ra em bao cao sai o luot truoc: pipeline **DA gieo hat tu lau**.
`random.seed(7)` trong `gen_demo.py`, `random.seed(20260722)` trong `fixdata.py`,
`random.seed(2307)` trong `seed_giaoviec.py`. Ba cho, deu co san.

Nhung chay trong lai HAI LAN trong **cung mot phut** (cung `meta.anchor`) thi ra **23 bang khac
nhau**. Loai tru tung kha nang:
- khong phai hat giong - ca ba deu co;
- khong phai thu tu duyet `set` - dat `PYTHONHASHSEED=0` cho ca hai luot, van khac;
- va phep do quyet dinh: giu NGUYEN dau vao roi chay `gen_demo` hai lan -> **0 bang khac**.

Goc: `gen_demo.py` doc `demo_data_big.json` - **dau ra cua chinh lan chay truoc** - roi be nguyen
nam bang sang (`odl["DL01"]`, `DL02`, `DL05`, `DL09`, `DL10`) cong `enums` + `config`. Ma dau ra
lan truoc lai mang dau vet cua `fixdata`. Nen pipeline khong phai ham cua *(hat giong, ngay chay)*
ma la ham cua *(hat giong, ngay chay, ket qua lan truoc)* - moi luot troi them mot it, khong luot
nao quay lai duoc.

*Gieo hat bao nhieu cung khong cuu noi mot vong lap.*

**Da cat:** them `demo_base.json` - ban chup DUNG YEN cua dung nam bang ay (374 KB). `gen_demo`
doc no; khong co thi van chay duoc nhung IN CANH BAO (im lang roi ve loi cu la quay lai dung cai
vong vua cat ma khong ai hay). Muon chot lai giong moi thi chay `lam_base.py` - mot quyet dinh
co chu dich, khong phai buoc thuong ngay.

**Da canh:** `check_taolai.py` (trong `./verify.sh`) dung lai demo HAI LAN roi so tung bang, tung
dong. No tu cat giu `demo_data_big.json` va tra lai nguyen ven - da do sha256 truoc/sau, khop.
Moc neo lay theo gio chay nen hai luot co the vat qua ranh mot phut: thu toi ba luot de bat mot
cap cung moc, khong duoc thi khai **CHUA KET LUAN** chu khong bao do bay - *mot bo kiem chap chon
la mot bo kiem bi bo qua*.
**Da tu thu hai kieu:** bo mat `demo_base.json` -> do; cho `gen_demo` doc lai dau ra cua no -> do,
va in ra dung danh sach bang lech.

**Mot dieu phai noi ro voi anh Luan, vi no doi ky vong:** nut **Reset demo** trong app KHONG chay
lai pipeline Python - no khoi phuc tu ban du lieu da nuong san trong `ITTs_data.js`, nen tu truoc
den nay bam bao nhieu lan cung ra dung mot trang thai (`_checkreset` canh dieu do). Cai vua sua an
vao LUC DUNG LAI du lieu: tu nay dung lai bao nhieu lan cung ra dung bo so cu.

## 10/08 - DEM LAI CA 52 SHEET SOP: CON DUNG MOT MANG TRANG - `CH5. Thuat ngu`

Anh Luan hoi: *"Con tinh nang nao chua co ko?"*. Bai hoc DL19 con nong nen lan nay khong tra loi
bang tri nho: mo file SOP ra, liet ke ca 52 sheet, roi hoi tung sheet mot xem phep do nao dang
soi no.

Ket qua: 44 sheet co nguoi soi. **8 sheet khong ai soi**: HD0, HD1, HD2, CH1, CH2, CH4, CH5, CH6.
Doi chieu tay tung cai:
- **CH1** danh muc: SOP 174 ma / app 225 ma -> **thieu 0** (app la tap cha - "them thi duoc").
- **CH2** tham so: SOP 61 / app 73 dong cau hinh -> **thieu 0**.
- **CH4** cau nhac viec: SOP 94 ma -> app co du **94/94**.
- **CH6** nguong KPI: da duoc canh gian tiep qua mat BC2 (51 chi so phai co dong nguong CH6).
- **HD2** quy trinh: 10 phase -> app phu bang hanh trinh P1-P10 + 15 bai huong dan.
- **HD0/HD1**: trang chu + huong dan doc file Excel, khong phai nghiep vu.
- **CH5 thuat ngu (26 chu viet tat): APP KHONG CO CHO NAO TRA.**

Dau nhat la **12 ma**: GLA, CVT, PLR48, OBT, VLR, TAR, ARR, CIR, RR, ENR, FB, TV. Chung CO chay
trong app - la ma SLA / ma chi so - va hien len man duoi dang *"GLA qua han"*. Nguoi moi doc man
hinh xong khong co cho nao tra duoc GLA la gi. App moi dien giai 17/51 chi so (KPIDOC).

**Da lam - dat trong HOI DAP chu khong de mot trang moi.** Do la cho nguoi ta di hoi "cai nay la
gi"; them mot trang nua la nguoc voi chinh luat V2 ("bot so trang mot nguoi phai nhin").
- `TUDIEN`: 26 dong ghi NGUYEN VAN theo CH5 (viet tat · ten day du · nghia · dung o dau).
- `tdTim(q)`: tra mot chu. **HOI CHAT CO CHU DICH** - chi nhan khi nguoi ta DANG HOI NGHIA (go
  tron mot chu, hoac kem "la gi / nghia la / viet tat"). Noi long ra la no CUOP cau cua nhanh dem
  so: "co bao nhieu HV nguy co" ma roi vao tu dien thi te hon han khong tra loi.
- Bang thuat ngu BAY SAN tren trang Hoi dap khi chua hoi gi - *mot cuon tu dien chi mo ra khi da
  biet phai hoi gi thi nguoi can no nhat khong bao gio tim thay*.
- Ma nao la chi so CH6 thi co them nut mo dien giai - hai thu do noi ve cung mot ma.

**Hai chot canh, hai tang khac nhau** (dung bai hoc `lwSave` cung ngay):
- `check_sop.py` mat thu SAU - CH5: doi CA HAI chu viet tat VA nghia tieng Viet phai co trong
  `gen_v5.py`. Chi doi moi chu viet tat thi "TV"/"FB" trung voi hang tram chuoi khac, xanh ma
  khong canh gi. Tu thu: doi mot chu trong nghia -> do dung dong do.
- `_checkqa.js`: goi THAT `qaTraLoi("<ma> la gi")` cho ca 26 ma, va canh ca chieu nguoc lai (cau
  dem so / cau chi so khong duoc roi vao tu dien). Tu thu: tat nhanh tu dien -> do, liet ke du 26.
*Diem danh mot cai cua khong phai la thu mo no* - nen mot mat doc ma nguon, mot mat lai that.

## 11/08 - MOT BO KIEM TUT TU 27 XUONG 17 MA VAN IN "OK"

Sau khi them tu dien CH5, `_checkdrawer` bao *"mo that **17** ngan keo tren 15 trang"* - ba vong
truoc deu la **27**. Van la dong chu XANH.

**Bo kiem nay chi hoi mot cau:** ngan keo nao MO DUOC thi hinh hoc cua no co sai khong (o mot dong
ma cao qua, tho ra ngoai, khe trong, o det). No **khong bao gio hoi** "lan nay mo duoc it hon han
lan truoc thi sao". Mat 10 be mat tuong tac ma khong mot tieng dong.

**Truy goc - va khong phai loi ma:** `git diff` cho thay ca 97 dong sua deu nam trong khu Hoi dap,
khong dong nao cham 15 trang ma `_checkdrawer` di qua. Thu con lai duy nhat doi trong `ITTs_data.js`
la **hai dong**: `__gen="10/08/2026"` -> `"11/08/2026"`. Dong ho vat qua nua dem. Du lieu demo con
neo ngay 10/08, nen "buoi hom nay" thanh buoi hom qua, va 10 cai nut mo ngan keo khong con duoc
ve ra nua.

Tuc **du lieu demo cu di MOT ngay la app rong di mot mang** - va nguoi mo demo se thay dung cai
rong ay. Do dung la thu phai KEU.

**Da lam hai viec:**
1. Dung lai pipeline theo ngay moi (11/08). Nho ban goc dong bang hom qua, bo so van la bo so cu,
   chi doi moc thoi gian - dung cai gia tri cua viec cat vong lap.
2. **Cam SAN 24 vao `_checkdrawer`**, kem cau nhac dung viec phai lam khi tut. San dat duoi muc 27
   do duoc khi du lieu tuoi, tren han muc 17 cua ban da cu mot ngay. Da do lai: du lieu tuoi ->
   27, xanh; ban cu -> 17, do va in ra dung lenh dung lai pipeline.

*Mot bo kiem do CHAT LUONG cua nhung thu no cham toi, ma khong dem xem no cham duoc bao nhieu thu,
thi no im lang dung luc pham vi cua no teo lai.* Cung ho voi luat "no silent caps": cho nao bo bot
pham vi thi phai noi ra, khong thi xanh doc thanh "da phu het".

## 11/08 - "THIET KE NAY NHIN LUOM THUOM QUA EM" - VA PHEP DO MOI (M6) NO SINH RA

Anh Luan gui anh chup dai **Can chu y** roi noi mot cau. Dung, va cho hong nam o dung o dau tien.

**Goc, do bang trinh duyet chu khong nhin bang mat:** `.cbso` KHONG bi chan be rong. So tien
"181.900.000d" co 18px dam an **122px** trong mot o rong 272px, nen `.cbtx` ben canh chi con
**75px** - va cau "Den han thu, tinh toi hom nay" roi **MOT CHU MOI DONG, 3 dong**. Luoi lai bat
moi o cung hang cao bang nhau, nen **mot o hong keo ca hang cao gap ruoi** (78px so voi 48px).
Do la ly do nhin vao thay luom thuom, chu khong phai "mau xau" hay "chu xau".

**Hai loi chua deu sai, khong chon cai nao:** rut gon so tien la BOT thong tin (dung cai luat da
giu hom 10/08 khi noi rong o doanh thu thay vi viet tat); thu nho chu thi 122px xuong 99px, van
chat. **Cho o mang so tien CHIEM HAI COT** thi giu nguyen con so that ma nhan van nam tron mot
dong. Cong `flex:none` cho `.cbso` - thieu no thi o so vua khong chiu co vua khong nhuong cho.

Do truoc/sau, 3 kho man, bang trinh duyet that:

| | truoc | sau |
|---|---|---|
| nhan o tien (1440px) | 75px, **3 dong** | 378px, **1 dong** |
| so muc chieu cao khac nhau | 48 / 63 / 78 | 50 / 63 |
| dien thoai 390px | 48 / 63 | phan lon 50 |

**PHEP DO MOI - M6 "chu bi bop thanh mot cot hep"** trong `_checkmat.js`. Nam phep do cu deu
khong thay, va deu co ly do rieng doc duoc:
- **M1** hoi "chu co rong hon cho no co khong" -> KHONG, no vua khit vi da tu xuong dong;
- **M3** hoi o hep giua khoang trong -> cho nay khong thua cho;
- **M5** chi soi cac o CHI CHUA SO;
- `_checkui` hoi tran ngang / nut qua nho -> deu khong dinh.
Chu van doc duoc, khong cat, khong tran. **No chi XAU** - va truoc hom nay khong thuoc nao do
duoc cai xau.
Cau hoi cua M6, dat TONG QUAT chu khong canh rieng dai canh bao: *mot khoi chu xuong tu 3 dong
tro len MA be rong chua toi 40% khoi cha thi no khong "dai" - no dang bi mot thang anh em cung
hang bop lai.*

**M6 lam duoc hai viec ngay lan chay dau:**
1. **Bat chinh loi em vua tao ra**: em cam `nowrap + ellipsis` cho o rong, ma tren dien thoai o
   ay quay ve mot cot -> nhan bi CAT 15px. Da bo han cai nowrap (do ra nhan nam tron mot dong
   that roi, cai nowrap khong giai quyet gi ma chi de ra mot cho cat chu).
2. **Lo ra 9 cho CUNG MOT HO o cac man khac, tren kho dien thoai** - deu la hang tieu de khoi
   (`.ph`) va hang buoc (`.psub`): tieu de, cau goi y va cum nut gianh nhau mot hang 360px roi
   ca ba cung vo. Nang nhat: `<b>Hoc vien nhan bai (10)</b>` con **34px, vo 5 dong**; cau goi y
   con **38px, vo 10 dong**. Chua bang `flex-wrap` o kho hep.

**Mot lan nem oan phai go:** ban dau M6 bao 43 cho, gan het la `.TD`/`.TH` - o trong bang. Bang
co cot keo duoc va nut Cot, nguoi dung tu chinh be rong; ep o bang khong duoc hep la ep bang phai
rong vo han. Da mien o bang, dung ly do da khai san o phep `batNat`.

**Va mot bay cua chinh phep do, cắn ngay khi dung:** luot dau probe in ra **toan so 0** - 12 o
tim thay ma cai nao cung rong 0px. Khong phai app hong: `div.app` dang `display:none` vi man
DANG NHAP che, harness phai tu khai "da chao roi" vao localStorage nhu `_checkui` van lam. *Do
mot thu dang bi che thi moi con so deu la 0, va so 0 trong y het mot ket qua.*
