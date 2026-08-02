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

## VERIFY (bắt buộc sau mỗi build)
> **Chạy một lệnh là xong: `./verify.sh` ở gốc repo.** Nó build lại, trích `_APP.js`/`_HV.js` rồi
> chạy toàn bộ bảng dưới đây, in xanh/đỏ và trả mã thoát. Bảng này để tra "bộ kiểm nào canh điều gì",
> không phải để gõ tay từng dòng.
>
> `_APP.js` / `_HV.js` sinh bằng `_src/extract_js.py` - **không** phải mã nguồn, đừng sửa.

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
| `ITTS_OUT=<out> node _checkdemo.js` | `CHECKDEMO OK: N tieu chi` - **mở app vào BẢY THỨ trong tuần**. Anh Luân đặt (31/07): *"nhớ cấu hình nút reset demo để luôn có 1 bộ demo chuẩn ngay sau khi reset. Thực sự chuẩn."* Vì sao 20 bộ kiểm cũ không bắt được: chúng đều chạy vào **đúng một ngày** - hôm nay. Mà app kéo dữ liệu demo theo **bội số 7 ngày** (giữ nguyên thứ trong tuần), nên mỗi thứ nhìn thấy một lát cắt KHÁC của cùng bộ dữ liệu; chỗ trống ở lát cắt nào thì **mãi mãi trống đúng thứ đó**. Đo thật trước khi viết: ô "Buổi WOW hôm nay" đọc T2=1 T3=**0** T4=3 T5=2 T6=3 T7=2 CN=2 - mở app thứ Ba là không có buổi nào. Cách làm: nạp lại `_APP.js` **bảy lần**, mỗi lần giả `Date` lệch thêm một ngày (đặt ở tuần thứ tư, 28-34, để phép kéo **thật sự chạy** - chọn 0-6 thì `tshDays` trả 0 suốt, xanh mà chưa thử gì), đặt đúng lá cờ `ITTS_DEMO_FORCESHIFT` mà nút Reset đặt rồi để `demoBoot()` tự kéo, sau đó **đóng vai từng nhân viên có thật** và hỏi bảng việc của chính họ. Ba luật: (a) hỏi bằng hàm của app (`BANGVIEC`, `RENDER`), không chép lại phép đếm; (b) ô nào ĐƯỢC PHÉP rỗng phải khai `RONGDUOC` **kèm lý do đọc được** (kiểu "Quá hạn" - ô ta MUỐN bằng 0; "Nguồn đang kém" - mọi nguồn trên ngưỡng CVR là tin tốt); (c) ô là **của riêng tôi** (`gvSo("doing")`) thì phải đóng vai mới đo được - đo bằng quyền toàn quyền ra 0 rồi báo đỏ oan sáu chức danh (đã cắn). **Bốn lỗi thật bắt được ngay lần chạy đầu**: ô "Bài tập chờ chấm" lọc mã `submitted` không hề tồn tại nên đọc 0 suốt nhiều bản trong khi có 188 bài chờ; phiếu test đã thi chưa chấm không thuộc về ai nên NV WOW mở app thấy ô "Test chờ chấm" bằng 0 đúng lúc có 7 phiếu chờ chính họ; bộ phận Nhân sự chỉ được chia việc "Mới giao" nên ô "Đang làm" chưa bao giờ sáng; và hai ô "Lead chưa ai phụ trách"/"Buổi thiếu mốc giờ" không có tình huống trong dữ liệu demo. |
| `ITTS_OUT=<out> node _checkdata.js` | `CHECKDATA OK: 27 luat ... 0 cho lech` - **dữ liệu demo có khớp ga nghiệp vụ không** |
| `ITTS_OUT=<out> node _check17.js` | `CHECK17 OK: 411 tieu chi` - **bộ máy lọc chuyên sâu** (kết hợp trục, lưu theo người) |
| `ITTS_OUT=<out> node _check18.js` | `CHECK18 OK: 177 tieu chi \| da ve 84 trang/tab` - **hội đồng audit tự động**: vẽ THẬT mọi trang/tab, mọi trang qua mắt 8 chức danh, cổng học viên qua mọi hồ sơ; từ V9.31 kiêm luôn **nhật ký thao tác + hoàn tác + bộ nhớ tạm bảng tra** (bấm cửa ghi thật, lùi lại thật, và bắt chốt chặn từ chối lùi) |
| `ITTS_OUT=<out> node _checkux.js` | `CHECKUX OK: 189 tieu chi \| 85 form ghi` - **trải nghiệm & tiện ích của form ghi**, đo trên TOÀN BỘ 81 form chứ không vá lẻ. Bốn thứ "làm không tới" dễ mắc nhất, đều canh được: (1) **ô chọn ngày để trống** - mở form ra mà ô ngày trắng là bắt người ta gõ lại từ đầu; mọi `<input type="date">` trong form ghi phải có sẵn `value` hợp lý (`isoDay`/`isoCong`/`isoHen`); (2) **form câm** - có ô nhập mà không một dòng nào nói lưu xong thì chuyển gì, luật nào áp dụng; thiếu cả `notebar`/`fhint`/`ctxRows` là đỏ; (3) **ô đính kèm chết** - mỗi `attachBox("x")` phải có `attachLine("x")` hoặc `attachVal("x")` ở đường ghi, và không được khai `var _xK=attachLine(...)` rồi bỏ đó (đã cắn với `_tsK`); (4) **dòng giải thích nói dối** - số trong `notebar` phải đi qua `slaChip`/`paramOf`, và tên tham số gọi ra phải có thật trong CH2 (bắt được `slaSurveyReport_hours` xưa nay `naFor` đọc mà CH2 chưa khai). Mục 4 còn vẽ THẬT sáu drawer rồi soi HTML trả về, phòng trường hợp biểu thức đúng nhưng chạy ra rỗng. **Từ V9.54 thêm bốn nhóm:** (5) **con số dẫn xuất giấu cách tính** - vẽ thật mọi trang, tìm mọi số %, đòi mỗi con có chú thích trên chính nó hoặc trên ô bao; chú thích tính-lúc-rê (`data-tipfn`) thì GỌI THẬT hàm rồi đọc chữ chứ không đếm thuộc tính (304/304 con phải nói được tử/mẫu); (6) **bánh răng quăng người dùng đi** - cả bốn loại bánh răng phải mở ngăn kéo sửa tại chỗ (`cfPop`/`msgPop`/`kpiPop`/`enumPop`), lưu xong phải `reRender(CUR)`, và ngăn kéo vẫn phải chừa lối sang trang Cài đặt; (7) **chặng không khai sản phẩm đầu ra** - cả 17 chặng phải có ít nhất một hồ sơ kể ra được sản phẩm, chú thích hạt phải có số bước + sản phẩm + lời mời bấm, ngăn kéo Hành trình phải bấm được vào từng chặng; (8) **ô bấm nói dối** - ô nào onclick có `go(` mà chú thích vẫn hứa "lọc danh sách bên dưới" là đỏ, và bấm TÊN trong bảng không được đổi trang; kèm 3 tham số ngưỡng từng cắm cứng phải có mặt trong CH2. **Từ V9.55 thêm nhóm (9) thang thiết kế**: app từng có **202 mã màu** (118 mã dùng đúng một lần, 26 sắc trắng cho cùng một việc), **28 bậc cỡ chữ**, **17 bậc bo góc** - không phải chỗ nào sai hẳn, mà cả trăm chỗ lệch nhẹ, đúng thứ mắt bắt được mà không gọi tên được. Bộ kiểm chốt trần: ≤110 mã màu · ≤20 bậc chữ · ≤10 bậc bo góc · `.fbar` và `.tbar` phải cùng bo góc/đệm/khe/gap · không trang nào tự đặt khoảng cách dưới `.panel` (để CSS lo, nếu không mỗi trang một nhịp) · class nút chỉ một thứ tự `btn <màu> sm`. **Từ V9.59 thêm nhóm (10) hệ thẻ**: mọi lời gọi `statStrip` phải truyền **mã dải** (trừ `bvStrip` - đó là hàng chờ việc, không phải thẻ); mã thẻ duy nhất toàn app; thẻ nào cũng có tên đọc được và câu chú thích **có chỉ chỗ xem danh sách**; chạy thật ở 9 chức danh + mọi màn chi tiết rồi đối chiếu **số thẻ khai với số thẻ vẽ ra** (dải nào cắt bớt thẻ theo chức danh thì phải nói thẳng mã từng thẻ); **không thẻ nào còn `onclick`**; dải nào cũng có nút `Thẻ (n/N)`; tắt một thẻ thì thẻ đó **biến mất thật** và nút đếm lui một; sửa chú thích thì đọc lại đúng bản đã sửa và trả về mặc định được; hai nửa "vừa ở Cài đặt vừa trên trang" phải cùng tồn tại và cùng ghi vào `DATA.config`; và **câu chú thích không được chỉ vào chip/nhóm KHÔNG CÓ trên trang đó** - phải bóc hết `data-tip` ra khỏi HTML trước khi tìm, nếu không câu nào cũng tự chứng minh được cho chính nó. **Nhóm (11) chữ "room" không được hiện ra**: không màn nào (kể cả màn đăng nhập và Cài đặt) còn chữ "room", `roomStatus`/`roomBtnHTML` phải XOÁ HẲN, **nhưng** `roomAuto`/`roomCast`/`roomCastState` phải còn sống và còn tự bật - canh một vế thôi thì có người tiện tay bỏ luôn cơ chế đồng bộ nhiều máy. |
| `ITTS_OUT=<out> node _checkqa.js` | `CHECKQA OK: N tieu chi` - **hộp Hỏi đáp**. **Từ V9.66 canh thêm BỐN NHÁNH TRẢ LỜI bằng một bảng hợp đồng**: đo thật trước khi làm - cho hộp 15 câu một quản lý hỏi mỗi ngày, nó trả lời đúng **1**. Mười bốn câu còn lại rơi vào nhánh "chỗ cấu hình": hỏi "có bao nhiêu học viên nguy cơ" thì nó chỉ vào ô chỉnh NGƯỠNG nguy cơ, không nói con số. Có câu sai hẳn - "hạn chấm bài là bao lâu" ra ngưỡng gọi lead, chỉ vì chữ "lâu" hiếm trong kho nên trọng số ngược tần suất cho nó điểm rất cao (chữ của CÂU HỎI, không phải chữ của CHỦ ĐỀ - nay nằm trong danh sách từ đệm). Bảng hợp đồng ghi mỗi câu hỏi + nhánh BẮT BUỘC (`so` / `kpi` / `hethong`), cộng luật "hỏi mã lớp phải ra hồ sơ lớp", "hỏi tên khóa phải ra hồ sơ khóa", và "mỗi mục số liệu phải chạy được, phải có nút mở màn làm việc và có lời giải thích số đó đếm gì". Sau bản này: **13/15**.  Canh theo đúng thứ tự nguy hiểm: (1) câu vô nghĩa PHẢI ra "chưa hiểu" - trả lời bừa còn tệ hơn không trả lời; (2) câu trả lời nghiệp vụ phải đọc lại CHÍNH bộ luật app đang chấp hành (đổi ngưỡng CH2 thì câu cảnh báo phải đổi theo - ai viết tay một đoạn mô tả là đỏ); (3) bí thì phải có gợi ý và phải ghi vào sổ câu hỏi chưa trả lời được |
| `ITTS_OUT=<out> node _checktour.js` | `TOUR OK: menu cap do + moi bai chay het buoc, 0 loi` - 12 bài / 66 bước, mọi neo `@ma` phải trỏ trúng. Từ V9.44 kiêm luôn **lời hứa "mỗi chức danh một trợ thủ và một hướng dẫn riêng"**: đóng vai từng nhóm vai rồi hỏi ba câu (có bài hướng dẫn riêng · có nhịp ngày ≥3 dòng · có bảng việc ở trang đáp), cộng một câu nữa - mọi nhịp có thật đều phải sửa được trong Cài đặt (nhịp của NV WOW từng tồn tại mà ô chọn không liệt kê, nên không ai với tới) | **Từ V9.60 soát TOÀN BỘ chức năng tour theo 5 mặt**: (1) neo `@x` phải trỏ đúng MỘT phần tử trên trang có bước đó - neo trùng nhau thì `querySelector` lấy cái đầu tiên và im lặng tô sáng nhầm chỗ; (2) neo theo CHỮ thì chữ đó phải có thật trên trang (đã gỡ mã hoá HTML trước khi so, và gieo đúng lớp/học viên mà chức danh đó được xem); (3) bước không được dẫn vào trang chính chức danh của bài không có quyền vào - mục này bắt được 2 lỗ phân quyền chứ không phải lỗi tour; (4) bước phải đủ tiêu đề + mô tả + câu "Việc cần làm"; (5) hàm `chk` không được ném lỗi. **Từ V9.64 siết thêm ba luật và vá một chỗ giả xanh:** (a) **cấm hẳn selector CSS thô** - bản trước cho 13 bước trỏ `.notebar`/`.pbody`/`.jgrid`/`.dt` miễn là *khai ra* trong mảng `KHUNG`; khai xong thì bộ kiểm xanh suốt mà bước "Ba tầng phân quyền" vẫn khoanh vào dải nhắc XEM THỬ - khai một cái sai không làm nó thành đúng, nay mọi bước phải dùng `@ma-neo` hoặc `@txt:`; (b) **neo phải có mặt ĐÚNG trên trang của bước đó** - trước chỉ hỏi "mã này có tồn tại ở đâu đó trong app không", nên bước đứng ở trang A trỏ mã chỉ có ở trang B vẫn xanh; (c) **neo phải là DUY NHẤT trên trang đó** - trùng thì `tourFind` lấy cái đầu tiên, tuỳ hên; (d) **cơ chế cập nhật tour**: trang nào người dùng vào được từ menu mà không bài nào đi qua thì phải khai lý do đọc được ở `TOUR_BOQUA`, không thì đỏ - trang mới thêm vào app không im lặng thiếu người hướng dẫn được nữa. **Hai chỗ giả xanh đã vá:** đọc không được bản build thì trước đây `return` im lặng (tự tắt cả một mục kiểm mà bảng tổng kết vẫn xanh) - nay ĐỎ; và bộ kiểm đóng vai bằng `applyScope()` mà hàm đó **không đặt `CURSTAFF`**, nên NV001 có 31 lead lại đo ra 0 dòng rồi đổ oan cho app - nay dùng `dongVai(sid)` đặt cả phạm vi lẫn danh tính.
| `python3 check_logic.py` | `KET QUA: DAT` - từ V9.40 script tách "lỗi thật" khỏi "ca cố ý" (việc quá hạn để demo cảnh báo đỏ, số này TRÔI theo ngày) và in một dòng kết luận ổn định |
| `ITTS_OUT=<out> node _check16.js` | `CHECK16 OK: 702 tieu chi`. **Từ V9.64**: bảng công giảng dạy đã rời Sổ thu học phí sang tab của trang Giảng viên, nên mục kiểm đi theo nó - và thêm một tiêu chí canh **cả hai đầu**: bảng công phải có ở trang Giảng viên VÀ không được còn ở Sổ thu học phí, để nó không lẳng lặng quay về chỗ cũ. **Từ V9.61 canh TẦNG 1 PHÂN QUYỀN**: màn Cài đặt phải có bảng bật/tắt từng trang cho từng nhóm chức danh (≥200 ô), bảng có neo riêng cho bài hướng dẫn, và - quan trọng nhất - **bấm một ô thì phạm vi THẬT phải đổi theo** (`buildScope` đọc lại được), trả về mặc định phải sạch hẳn, tắt trang đáp thì app phải tự lùi về trang khác còn bật. Canh bằng cách chạy thật chứ không đọc chữ trên màn. **Từ V9.62 canh BA CHỖ KHOÁ**: cổng nhân viên phải làm mờ hết thẻ chức danh và không thẻ nào còn bấm được; bấm vào Cài đặt khi chưa chọn chế độ thì `CUR` KHÔNG được đổi (chặn ở CỬA VÀO, không chặn trong trang); nhập sai mật khẩu thì không mở được quyền ghi; mọi cửa vào Reset demo đều đi qua hộp mật khẩu. **Bẫy đã cắn**: stub `sessionStorage` trong bộ kiểm từng trả về `null` vĩnh viễn nên ba tiêu chí này không bao giờ cắn - stub phải NHỚ THẬT. |
| `python3 check_data.py` | `KET QUA: DAT`. **Từ V9.59 có quy tắc 15 "demo phải sống ở mọi nơi học và mọi ngày"**: mỗi cơ sở trong 5 chi nhánh + online phải có học viên đang học và lớp đang chạy/đang tuyển; và trong 14 ngày tới **không ngày nào** được rỗng hẹn liên hệ hoặc rỗng buổi WOW - canh THEO TỪNG NGÀY chứ không canh tổng, vì tổng đẹp mà dồn cục một ngày thì sáu ngày còn lại vẫn trống. |
| `python3 check_gs.py` | `KET QUA: DAT` - **lớp Google Sheets đã nghỉ hưu (30/07), canh cho nó không lén quay lại**: không file `.gs` nào trong kho, và 66 chỗ gọi máy chủ trong `gen_v5.py` đúng bằng bản khai. 66 chỗ đó giữ CÓ CHỦ Ý - chúng là đường nối ra backend tương lai, mỗi chỗ một cửa ghi; thêm cửa ghi mà quên nối là đỏ. Đầu file `check_gs.py` ghi rõ đã đối chiếu từng file `.gs` trước khi xoá, không mất luật nghiệp vụ nào |
| `python3 check_sop.py` | `KET QUA: DAT` - **đối chiếu SOP gốc, sáu mặt**: 357 cột DL · 93 tình huống sổ trigger HD3 (chạy THẬT `naFor()` trên mọi dòng) · 51 chỉ số bảng BC2 (phải có cả công thức lẫn dòng ngưỡng CH6) · 31 hành động bảng phân quyền CH3 (đóng vai từng chức danh rồi hỏi lại `canAct`, và mỗi việc "Quản lý phê duyệt" phải có cửa ghi gọi `chanAct`) · **12 màn vận hành VH0-VH11 và 9 bảng báo cáo BC1-BC9** (vẽ THẬT mọi trang, mọi tab, mọi danh sách, cộng bảng việc của từng chức danh, rồi tìm chuỗi phải có). Chỗ nào cố ý không làm phải khai vào `BOQUA` / `TRIG_BOQUA` / `KPI_BOQUA` / `CH3_BOQUA` / `VHBC_BOQUA` **kèm lý do đọc được** |
| `ITTS_OUT=<out> node _checkui.js` | `CHECKUI OK: da mo THAT 492 luot` - **kiểm thử trên trình duyệt thật** (cần `npm i playwright` một lần; máy không có Chromium thì tự BỎ QUA chứ không báo đỏ bậy) | **Từ V9.62**: bộ kiểm phải ĐÓNG VAI NGƯỜI DÙNG ĐÃ CHỌN chế độ Cài đặt trước khi quét (`cfSetMode("that")`), và **đóng ngăn kéo còn sót trước mỗi màn**. Không làm vậy thì `go("settings")` chỉ mở popup hỏi chế độ chứ không điều hướng: 19 tab Cài đặt không tab nào được đo, mà ngăn kéo popup nằm mở suốt các màn sau, kéo theo hàng loạt báo "thò ra ngoài màn" hoàn toàn giả. **Luật: thêm một cửa chặn thì phải hỏi lại - bộ kiểm có biết gõ cửa không?* **Từ V9.67 chữa một chỗ ĐO NHẦM đã im lặng nhiều bản**: nó đo `documentElement.scrollWidth`, mà tràn ngang trong app này xảy ra BÊN TRONG khung cuộn `#content` - khung có thanh cuộn riêng nên phần thò ra không đội `<html>` rộng thêm chút nào. Máy báo "không cuộn ngang" trong khi mở điện thoại lên phải vuốt ngang mới đọc hết (7 trang). Nay đo thêm chính `#content` và `#hvBody`; vừa sửa thước là nó tự tìm ra thêm 6 trang tràn ở khổ iPad. **Và thêm một mặt kiểm mới**: ở khổ điện thoại, chạy hết 15 bài hướng dẫn, bước nào có neo trỏ RA NGOÀI MÀN là đỏ - từ 820px xuống sidebar là ngăn kéo đóng, phần tử trong đó vẫn tồn tại và vẫn có kích thước, chỉ toạ độ là x âm. Đợi 950ms mỗi bước cho đủ nhịp của chính app (cuộn mượt 300ms + vẽ lại 320ms + trượt ngăn kéo 260ms) - đo non hơn là đỏ của cái thước chứ không phải của app. |

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

CON NO: chay tren v6, `_check16` con **1 tieu chi do**: "trang duyet da co dai so". Da khoanh
vung duoc: cung phai vi, cung CURROLE/SCOPE/tabs/segs nhu v5, nhung `RENDER.duyet()` o v6 ngan
hon 3.7KB va KHONG co khoi `bstats` - tuc la loi goi `statStrip` cua trang do bi bo qua o v6.
KHONG phai do `navInTree` (renderDuyet khong goi ham nay). Buoc tiep: tim cho goi statStrip cua
hub Cho duyet va xem dieu kien nao gat no o v6. Chua dua v6 vao verify.sh vi the.
