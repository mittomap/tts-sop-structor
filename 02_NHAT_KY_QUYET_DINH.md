# 02 - NHẬT KÝ QUYẾT ĐỊNH + BẪY KỸ THUẬT + VIỆC TỒN

## 1. Quyết định thiết kế ĐÃ CHỐT (đừng "tối ưu" lại nếu Luân không yêu cầu)
- **KHÔNG tái cấu trúc cột** (đưa cột `*_name` về cạnh cột ID): đã cân nhắc và từ chối -
  mọi công thức next_action/BC/VH tham chiếu theo CHỮ CÁI CỘT, dời cột là vỡ dây chuyền;
  lợi ích chỉ là thẩm mỹ. Nếu tương lai thật sự cần: phải regenerate toàn bộ công thức, không sed.
- **CH2 cột F (Giá trị đề xuất) là TĨNH CHỦ Ý**: đó là tài liệu khuyến nghị, phải đứng yên
  khi user đổi giá trị thật ở cột B. Đừng wire nó vào named range.
- **BC2 không guard "-" khi giá trị = 0**: số 0 ở nhiều KPI là thông tin thật
  (DOR = 0% nghĩa là không ai bỏ học -> "ĐẠT" là đúng). Guard máy móc = giấu tin tốt.
- **2 cờ nguy cơ DL09 (attendance/academic_progress_status) GIỮ NHẬP TAY**: triết lý
  "máy nhắc (NA064/065 khi vượt ngưỡng), người quyết". Đừng tự động hóa 2 cột này.
- **VH5-VH10 giữ filter()/query() Google-native**: chạy đúng trên nền tảng đích,
  chết trong LibreOffice là bình thường (vì thế bị loại khỏi audit lỗi).
- **DL19 = lưới lịch trực WOW theo tháng**: sheet hợp lệ, cấu trúc đặc thù, loại khỏi audit.
- **slaFinalTest_days = 3 là hạn NHẬP ĐIỂM cuối khóa** - khác nghĩa với cửa sổ
  "30 ngày trước kết thúc" (= thresholdPreEnd_days). Đã từng suýt gắn nhầm.
- Nhãn trong HD2/HD3/tài liệu lấy NGUYÊN VĂN từ CH1; SOP giấy lệch với cấu hình thì
  CẤU HÌNH THẮNG (chỉnh CH2/CH6 nếu muốn theo giấy).

## 2. BẪY KỸ THUẬT (mỗi mục là một lần trả giá)
- `safe_bump` khi kéo công thức xuống theo dòng dùng regex
  `(?<![\$\d:])([A-Z]{1,2})4(?![\d:])` - CHÚ Ý: nó KHÔNG bump `$A4` (có `$` trước).
  Muốn tham chiếu theo dòng thì viết `A4` tương đối trong công thức mẫu. Đã dính 3 lần
  (mọi HV đọc nhầm dữ liệu HV001).
- Script python SẬP giữa chừng = save CHƯA chạy = mọi thay đổi trước đó trong script MẤT.
  Luôn nhìn kỹ stdout/stderr trước khi tin.
- openpyxl: `column_dimensions[X].width = None` -> crash (dùng 8.43);
  ô trong vùng merge là MergedCell read-only -> unmerge trước khi ghi;
  `insert_rows` KHÔNG dời merge/conditional-format/công thức -> tránh chèn giữa,
  ưu tiên capture-rebuild-repoint (đã có pattern cho CH2).
- ArrayFormula: đọc bằng `.text`, ghi lại bằng `ArrayFormula(ref, text)`.
- Sau MỖI save: recalc rồi mới đọc data_only; cuối phiên ép font Montserrat
  (giữ size/bold/italic/color).
- CH2/CH6 cột A là ĐỊA CHỈ MATCH: đổi text cột A là gãy HYPERLINK/MATCH ở nơi khác
  (đã dính khi dán suffix chú thích vào 10 tên kpiThreshold_*).
- **Copy công thức giữa 2 layout khác nhau phải REGENERATE theo số dòng mới**, không bê
  nguyên văn: cột E của HD3 từng trống ÂM THẦM cả tuần vì bê `$D<dòng cũ>` sang sheet mới.
- Đếm số cột của mảng filter(): đếm trong `{...}` thôi, đừng đếm cả điều kiện
  (đã sinh header rác "Cột 9..12" vì đếm sai).
- Google Sheets export: (a) filter()/query() bọc `=IFERROR(__xludf.DUMMYFUNCTION("..."),cached)`
  là QUY ƯỚC CỦA GOOGLE, import lại tự khôi phục - có thể string-edit bên trong, đừng unwrap;
  (b) mọi HYPERLINK nội bộ thành URL gid tuyệt đối - PHẢI convert về `#'Sheet'!` trước khi giao
  (import cấp gid mới, URL cũ chết và script không cứu được); (c) kết quả spill xuất thành
  nhiều ô công thức (số lượng công thức VH tăng là bình thường); (d) font đổi hàng loạt - vô hại,
  ép lại.
- Khi thêm tham số CH2: dùng pattern capture-toàn-bộ -> viết lại section -> re-point
  TOÀN BỘ named range (map lưu `_p2row.json` nếu còn), rồi verify CH4/HD2/HD3/BC/CH6 sống.
- **Web app - "đã chấm" KHÔNG phải trạng thái**: enum_homework_status không có "graded";
  dấu chấm bài = graded_at/điểm có giá trị. Mọi thống kê đếm /graded/ trên status đều ra 0.
  Dùng helper hwGraded(). (Đã dính ở 3 chỗ + trung tâm cảnh báo đếm ảo 248 việc.)
- **Seed lên Sheets - 3 BẪY (đã vá, có kiểm chứng bằng mô phỏng Sheet)**:
  (1) **ARRAYFORMULA có 2 loại**: ref 1 ô (vd next_action ref T4:T4) = CHÉP XUỐNG TỪNG DÒNG;
      ref vùng mở (A4:A) = 1 bản chủ tự trải. Xử lý nhầm loại 1 thành loại 2 -> cột tự sinh
      chỉ có 1 dòng. Nhận diện bằng regex vùng mở (isSpillFormula_).
  (2) công thức liên hệ chặn vùng $B$4:$B$300 - demo >300 dòng là hụt -> tự nới $300 -> $3000.
  (3) **KIỂM TRA DỮ LIỆU kiểu "từ chối nhập"** trên sheet (SĐT 10 số, điểm 0-9, danh sách):
      Sheets đổi chuỗi "0861486546" -> số 861486546 (rụng số 0) -> luật từ chối -> lỗi bung ra
      ở flush() (SAU mọi try/catch) -> CẢ SHEET dừng ghi, các cột sau trống.
      Vá: tạm gỡ kiểm tra dữ liệu khi ghi rồi gắn lại; ép định dạng CHỮ cho cột số-0-đứng-đầu;
      điểm số ghi kiểu SỐ; flush bọc try/catch; ghi theo KHỐI + đọc lại đối chiếu + tự ghi lại.
      BÀI HỌC: lỗi Apps Script có thể xuất hiện ở flush(), không phải tại dòng setValues.
  (4) **LƯỚI SHEET CO LẠI** sau wipe (deleteRows tới sát dữ liệu) -> công thức tham chiếu cố định
      ('DL02b'!$B$4:$B$300, 'DL12'!$C$4:$C$1000, 'DL06'!$B$4:$B$500) VƯỢT LƯỚI -> #REF! -> cột
      công thức hiện trống. Vá: SEED_MIN_ROWS=3050 (ensureRowsAll_ trước khi ghi, và sau wipe)
      + nới mọi vùng 300/500/1000 -> 3000. Có repairFormulas() sửa tại chỗ không cần seed lại.
      LƯU Ý khi nới vùng: dùng hàm thay thế (không dùng chuỗi '$3000' vì $3 là group ref),
      và regex phải yêu cầu có chữ cái cột đứng trước để không phá số hằng 1000000000000.
  (5b) **QUYẾT ĐỊNH CUỐI (thay cho mọi cách vá sheet): APP TỰ TÍNH CỘT DẪN XUẤT.**
      deriveAll() trong gen_app.py chạy ngay khi vào app: sheet có giá trị thì giữ, sheet trống
      thì app tự tính từ dữ liệu gốc (first_call_time/last_contact_time/contact_count từ DL02b;
      paid/remaining/final_fee từ DL07; attendance_rate/completion_rate từ DL12+DL13;
      quota WOW từ DL14+DL05; mọi cột *_name bằng tra cứu). => KHÔNG cần sửa file của user nữa.
      Kiểm chứng: xóa trắng 3.869 ô rồi mở app -> khôi phục đủ, số khớp dữ liệu gốc.
  (5) **CỘT MÃ LÀ HYPERLINK() -> COUNTIF/COUNTIFS/VLOOKUP DÒ THEO MÃ KHÔNG KHỚP.** Template để
      DL02b.lead_id, DL18.student_id, DL12.student_id... là HYPERLINK cho bấm nhảy sheet ->
      mọi công thức tra cứu theo mã (first_call_time, last_contact_time, attendance_rate,
      completion_rate, first_enrollment_date, last_learning_activity_time) trả về rỗng.
      QUYẾT ĐỊNH: seed ghi cột mã dạng TEXT THƯỜNG (cờ KEEP_LINKS=false), đánh đổi mất link bấm
      để lấy đúng dữ liệu. repairFormulas() có flattenLinks_ chuyển link->text tại chỗ.
  Chẩn đoán tại chỗ: seedDoctor (liệt kê MỌI cột nhập trống + loại công thức từng cột).
- **Web app - generator v4 chồng bản vá là BẪY**: khi gen_app.py đã native tính năng nào
  (tự gọi api khi SVR) thì PHẢI gỡ rep() tương ứng trong gen_appscript.py, không thì
  assert gãy hoặc vá đè gây lỗi (rep data-sid từng suýt phá trang Bài tập).
- **Web app - so mã enum bằng regex .test() là BẪY substring**: `not_consulted` chứa
  `consulted`, `not_contacted` chứa `contacted` -> `/consulted/.test()` báo nhầm đã tư vấn.
  Luôn dùng helper `isc(v,"code")` so BẰNG-ĐÚNG `ecode(v)===code`, đừng .test() trên mã.
  (đã dính ở Tư vấn + Kết thúc; đã sửa toàn bộ st() các luồng GĐ2.)
- **Web app - LƯỚI THẺ NUỐT PANEL (V7.8)**: `renderBanglop` mở `<div class="bcards">` rồi mãi
  tận dòng danh sách học viên mới đóng -> panel "Lịch buổi" nằm LỌT trong lưới
  `grid-template-columns:repeat(auto-fill,minmax(240px,1fr))`, bảng 7 cột bị bóp nát.
  Di chứng của lần dời thông tin lớp lên `classBar` mà quên gỡ thẻ + thẻ đóng của lưới.
  LUẬT: khi chuyển nội dung ra khỏi một khối bọc, phải kiểm cả THẺ MỞ lẫn THẺ ĐÓNG - đếm
  cân bằng div KHÔNG phát hiện được lỗi này (54/54 vẫn cân, chỉ sai chỗ đóng).
  Cách soi: liệt kê class xuất hiện trong output và hỏi "khối này có được phép bọc panel không".
- **Web app - MẶC ĐỊNH HAI TẦNG PHẢI LƯU RỖNG (V7.8)**: mọi thứ có "mặc định khóa + ghi đè lớp"
  (bài tập `hw_bank_id`, lời dặn `prep_note`, hạn nộp `hw_due_days`) khi người dùng chọn TRÙNG
  giá trị mặc định thì phải ghi `""` chứ không ghi giá trị. Ghi giá trị = đóng băng, sau này
  học vụ sửa giáo án khóa thì buổi đó không đổi theo nữa mà không ai biết vì nhìn giống hệt.
  Một resolver duy nhất `sesPlan(s)` trả `{hw, note, dueDays, *From}` - đừng tính lại ở nơi khác.
- **Web app - SỐ CẮM CỨNG TRONG MÃ LÀ NỢ ẨN (V7.8)**: `sesAssign` từng cộng thẳng `7*864e5`
  làm hạn nộp -> không ai sửa được, cũng không ai thấy nó tồn tại. Bất kỳ hằng số nghiệp vụ nào
  (hạn nộp, hạn SLA, ngưỡng KPI) phải nằm trong dữ liệu cấu hình + có đường sửa trên giao diện.

- **Web app - HẠN NỘP BÀI (V7.8, mô hình đã chốt)**: `DL21.due_days` (mặc định khóa, số NGÀY
  sau buổi học) -> `DL11.hw_due_days` (ghi đè lớp) -> ô hạn nộp lúc giao bài (chỉ lần giao đó).
  Không có gì thì rơi về hằng `DUEFALL=5`. Dùng số ngày chứ KHÔNG dùng ngày cố định để buổi
  dời lịch thì hạn tự dời. Sửa hàng loạt có 3 lối: nút "Đặt hạn nộp cho tất cả buổi" ở Giáo án
  khóa, ô tích trong drawer sửa giáo án, ô tích trong drawer Cấu hình buổi của lớp.

- **Web app - GIAO BÀI CHỈ CÓ 2 CÁCH (V7.9)**: `all` một bài chung cho các em ĐƯỢC TICK ·
  `each` giao bài tập riêng. Luân bác bỏ việc tách "cả lớp" và "chọn từng em" thành 2 chế độ:
  "nó chỉ là chọn thôi" -> danh sách luôn có ô tick, mặc định tick hết. LUẬT: đừng biến một
  thao tác chọn thành một chế độ riêng.
  Nhánh `each` đi qua hàm riêng `giaoBaiRieng()`, KHÔNG dùng chung `giaoBaiCaLop()` vì nguồn
  dữ liệu khác hẳn (đọc select + input file của từng dòng thay vì một ô chung). Mỗi dòng nhận
  bài từ kho (lưu `hw_bank_id`, không lưu tên -> lấy đủ tên/kỹ năng/mô tả) HOẶC tệp tải lên
  (tên tệp bỏ đuôi thành tên bài, kỹ năng để trống) hoặc cả hai.
  Đã BỎ nút "điền bài chung" và "điền theo kỹ năng yếu" theo yêu cầu - chỉ giữ chip hiện kỹ năng
  yếu làm thông tin tham khảo, KHÔNG tự điền hộ giáo viên.

- **Web app - CH4 SỐNG thay chữ tĩnh (V8)**: cột next_action ĐỪNG đọc chữ lưu sẵn trong dữ liệu
  (sửa trạng thái thì nó không đổi, không mang được số SLA từ CH2). Dùng `naFor(sheet,r)` tra mã
  CH4 theo trạng thái THẬT rồi `msgText()` điền tham số. LUẬT: mã trong naFor phải verify đúng
  bảng - đã dính 6 mã enum không tồn tại (closed/done/enrolled/declined/lost) khiến isc() chết âm
  thầm, audit A4 bắt được. Mỗi mã CH4 phải thuộc đúng sheet của nó (ch4[code].sheet===sheet).
- **Web app - CHẶN SAI LÚC NHẬP (V8, bizGuard)**: sức chứa, chiết khấu vượt ngưỡng chưa duyệt,
  thứ tự thời gian, điểm tổng lệch TB kỹ năng. Một hàm dùng chung, cắm vào MỌI đường ghi
  (modalSave + xepMoiLuu + obChangeSave). Tên tham số ngưỡng chiết khấu là `thresholdDiscount_approval`
  (KHÔNG phải thresholdDiscountApproval_amount).
- **Web app - TRANG SỨC KHỎE DỮ LIỆU (V8)**: dataHealth() port rút gọn của check_data.py, chạy
  trên dữ liệu ĐANG mở trong app (Cài đặt > tab Sức khỏe). Mỗi phát hiện có jump{page,set} để
  nhảy tới sửa. Khi nối Sheet thật thì đây là thứ dùng hằng tuần.
- **BẪY BỘ KIỂM DÒ SAI TÊN CỘT (V8, đắt nhất)**: bản kiểm đầu tiên báo "sạch" phần tiền + thời gian
  chỉ vì dò sai tên cột (enrollment_date thay vì enrollment_time, wow_session_date, total_fee...).
  Quy tắc dò sai tên cột IM LẶNG PASS - nguy hiểm hơn báo lỗi. check_data.py nay bắt buộc khai
  tên cột qua need(), thiếu cột thì hô "QUY TẮC BỊ VÔ HIỆU". Áp nguyên tắc này cho mọi script kiểm.
- **BẪY VÁ DỮ LIỆU KÉO THEO (V8)**: fixdata.py sửa 1 con số phải kéo mọi số phụ thuộc. Đã dính:
  đổi ngày đăng ký mà quên kéo phiếu thu -> thu-trước-ĐK; tạo phiếu hoàn mà zero cả final_fee ->
  lệch "gốc-CK=phải thu"; dời HV sang lớp khác mà định set DL09.class_id (cột KHÔNG tồn tại).
  check_data.py bắt hết ngay sau khi chạy fixdata -> sửa vòng lặp tới khi DAT.

- **BẪY THAM SỐ CHỈ-SỐ (V8.4)**: `paramOf()` cố `Number(value)` và bỏ qua nếu NaN -> mọi tham số
  CH2 dạng CHỮ (percent/amount, phần thưởng...) LUÔN rơi về mặc định dù đã lưu. Dùng `paramStr()`
  cho tham số chữ. Và `saveParam` xưa ép Number -> phải đánh dấu kiểu trong APPPARAMS phần tử [5]:
  "text" = ô chữ, mảng ["a","b"] = dropdown, không có = số. LUẬT: khi thêm tham số CH2 không phải
  số, đánh dấu kiểu + đọc bằng paramStr, đừng để lọt vào đường số.

## 3. VIỆC TỒN (backlog)

> ### ⭐ HIỆN TRẠNG WEB APP (cập nhật cuối — đọc đầu tiên khi Luân nói "tiếp tục")
> **Phiên bản: V9.23** (28/07 tối - MẢNG 1 của hội đồng 6 chuyên gia ĐÃ XONG + 6 yêu cầu phát sinh của Luân).
> **DỮ LIỆU DEMO: 192 -> 4 bản ghi lỗi** (`check_logic.py` nay 123 luật). 4 ca còn lại là việc quá hạn
> CỐ Ý để màn Giao việc có cảnh báo đỏ thật (luật 10k tự khai là "demo canh bao do").
> Bộ kiểm sau mỗi build nay có **5 phần** (xem bảng trong `_src/README_SRC.md`), thêm `_src/_checktour.js`.
> Chi tiết mảng 1 + 6 việc phát sinh: mục **3unvicies** bên dưới.
> **CÒN LẠI của hội đồng: mảng 2 (KPI diễn giải), 3 (cổng học viên 7 kênh), 4 (học phí theo đợt),
> 5 (link "sửa ở đây" + tham số thiếu)** - làm tiếp theo đúng thứ tự đó.
> **HỘI ĐỒNG ĐỢT 2 - 5 vị trí mới đang rà** (Luân duyệt 28/07): nhân viên tư vấn kiêm tiếp khách,
> giáo viên đứng lớp, kế toán/thu ngân, giáo vụ xếp lịch, kiểm thử phá hoại. Lý do: 6 chuyên gia cũ
> đều nhìn từ THIẾT KẾ HỆ THỐNG, không ai nhìn từ GHẾ NGƯỜI NGỒI LÀM 8 TIẾNG - nên bỏ lọt lỗi kiểu
> "hai nút cùng tạo một lead" mà Luân tự bắt được.
> Trước đó V9.18 (28/07 tối - theo 8 yêu cầu mới của Luân: (1) **GỘP "Hành trình" vào "Trang bắt đầu"**
> thành MỘT trang 2 góc nhìn (segmented "Chạy quy trình" / "Bảng chặng - hành trình"); go('hanhtrinh') tự remap,
> menu Làm việc còn 1 mục, logic 2 trang giữ nguyên vẹn; (2) **node dải hạt (mstrip) BẤM ĐƯỢC** - mở drawer
> "hành trình từng chặng" của đúng người (13 mốc + mốc thời gian + chặng hiện tại + nút xử lý); (3) **TRA CỨU
> MỞ RỘNG**: 17 mục xếp theo dòng nghiệp vụ (13 sổ chỉ-xem mới: liên hệ/test/tư vấn/đăng ký/thu học phí/buổi học/
> điểm danh/bài tập/WOW/kết thúc/khảo sát/phản hồi/khiếu nại + khóa học + nhân viên) - ĐẢO V6.0 CÓ CHỦ ĐÍCH
> cho riêng nhóm Tra cứu theo lệnh Luân; (4) tab Dữ liệu demo GỌN (1 dòng trạng thái + Reset + Ngắt room);
> (5) BỎ khối "Gửi phụ huynh" khỏi trang học viên; (6) chip trạng thái khóa ĐẶC MÀU (fill-blue/green/gray);
> (7) nhật ký buổi học thành TIMELINE thật (rail + node ngày); (8) badge đếm ở menu nhỏ lại, hết bóp chữ.
> Suite: **_check11 = 82 điểm** (thêm 14 tiêu chí V9.18) + _tall 37 trang 0 lỗi + node --check. Chi tiết: mục 3novemdecies.
> Trước đó V9.17 (28/07 chiều - ROOM TỰ ĐỘNG + bong bóng việc mới + vá theo 3 tester, theo yêu cầu Luân:
> (1) **Room demo TỰ NỐI** - bỏ hẳn mã phòng: mở demo là máy tự vào chung room (id chung gắn SEED_SIG,
> máy đầu làm trạm relay, trạm rớt thì các máy tranh làm trạm lại); chip **"Room demo: nối N máy / chỉ máy này"**
> + nút **Reset demo** trên navbar CẢ 2 CỔNG (app NV: topbar; cổng HV: sidebar + thanh mobile); nút Ngắt room /
> Nối lại room cho demo riêng tư. (2) BỎ ô "Xem thử hồ sơ" thừa ở sidebar cổng HV (chọn người = màn cổng).
> (3) **BONG BÓNG VIỆC MỚI**: việc cần duyệt/cần xử lý phát sinh từ cổng/máy khác nổ thẻ notiShow góc phải dưới
> (diff bellItems trước/sau sync, đúng phạm vi vai trò) - bấm là nhảy tới nơi xử lý, tự tắt 9s, tối đa 3 thẻ.
> (4) VÁ theo 3 tester (chi tiết + bẫy: mục 3octodecies): room chống zombie bằng __roomGen, last-write-wins
> theo st.t (bản cũ không đè bản mới, 3 máy hội tụ), reset chờ DataChannel flush + chặn bão reload, bản
> local-thắng được phát lại cho room; cổng HV: notebar hoàn phí TẮT khi refunded + không hứa số tiền, lịch
> CHÍNH HÔM NAY không bị ẩn (hvT0), bỏ tên chặng CRM + "GV vào trễ" khỏi trang học viên, HVSEC xếp đúng thứ tự
> trang; hồ sơ 360: bảng điểm không trộn 2 khóa, điểm 0 không rơi thành "-", HSTAB reset khi đổi hồ sơ,
> hvGo cuộn được trong tab nhúng. Verify: _tall 37 trang 0 lỗi + _check11 68/68 + node --check. Icon 134.
> **CHÚ Ý PHIÊN SAU**: (a) bộ kiểm _check1.._check10 THẤT LẠC - tái tạo dần; (b) room + bong bóng CHƯA test
> trên trình duyệt/2 máy thật - chờ Luân thử; (c) room MỞ cho mọi ai mở link demo (Luân chấp nhận chủ đích) -
> lối thoát là nút Ngắt room + Reset demo.
> Trước đó V9.16 (28/07 chiều - Đợt 9 bản đầu: phòng 2 máy CÓ MÃ PHÒNG (V9.17 thay bằng room tự động), cổng HV
> bỏ khối "Yêu cầu & phê duyệt", hồ sơ 360 superset + tab "Trang của học viên", rà sidebar giữ nguyên 7 nhóm.
> Chi tiết: mục 3septendecies.
> Trước đó V9.15 (28/07 - ĐỢT 8 "CHẶNG VÒNG ĐỜI + HỆ NODE + DỮ LIỆU DEMO SỐNG" ĐÃ XONG theo yêu cầu Luân:
> menu gom theo 4 chặng vòng đời (C1 Khách tiềm năng / C2 Đang học / C3 Tạm dừng / C4 Kết thúc & Học tiếp,
> mục con test/tuvan/wow/bảo lưu/mã giới thiệu TRỞ LẠI menu - go() remap vào hub đúng tab), 4 trang "Tổng quan chặng"
> (ray ga node 44px + %% chuyển đổi + ga rẽ nhánh thoi + ga ghost, nghiệp vụ trong chặng, sổ trực),
> node hồi sinh 3 tầng (nrail / mstrip dải hạt trên MỌI dòng danh sách / sopBlock "block nghiệp vụ cần thiết"
> ở hồ sơ 360 + 2 drawer), tab Chăm lại/Reup trong Tuyển sinh, dữ liệu demo đại tu theo tester
> (0 tên placeholder, lịch tương lai, hàng chờ quyết định sống, chuông 289 -> 87 việc). Chi tiết + bẫy: mục 3quaterdecies.
> Suite kiểm: **11 bộ, 366 điểm xanh** (_check11 mới = 68 điểm cho arc/menu/node). Icon 130 (font dựng lại).
> **ĐÃ LÊN GITHUB 2 REPO**: repo dự án `mittomap/tts-sop-structor` (28/07 sáng lên dạng private tên itts-sop;
> 28/07 chiều Luân ĐỔI TÊN + chuyển PUBLIC để phiên cloud truy cập) = CHÍNH thư mục này;
> public `mittomap/itts-sop-demo` = demo Pages **https://mittomap.github.io/itts-sop-demo/**.
> TỪ 28/07 CHIỀU: phiên cloud Claude Code của Luân có QUYỀN GHI cả 2 repo - tự commit/push, Luân không chạy lệnh;
> máy Luân = bản phụ (git pull khi cần; làm local vẫn dùng push.sh/update.sh). Giao thức: `CLAUDE.md` ở gốc repo.
> Chi tiết + bẫy: mục 3quindecies + 3sedecies.
> Trước đó V9.14 (27/07 - ĐỢT 6 UX+báo cáo và ĐỢT 7 cổng học viên ĐÃ XONG = HẾT các đợt kế hoạch.
> **CHƯA GỌI HỘI ĐỒNG TỔNG KIỂM** - Luân dặn "từ từ hãy gọi hội đồng, a còn yêu cầu khác" → phiên sau CHỜ YÊU CẦU MỚI của Luân trước, tổng kiểm để sau khi Luân ra nốt yêu cầu. Trước đó V9.13 (27/07 - ĐỢT 5 điều phối & lịch xong. CÒN: Đợt 6 UX+báo cáo, Đợt 7 cổng HV, rồi HỘI ĐỒNG TỔNG KIỂM. Trước đó V9.12 (27/07 - ĐỢT 4B 'mỗi HV/lead 1 DÒNG' xong: 12 trang tác vụ sang danh sách hàng, bấm dòng nở chi tiết. KẾ TIẾP: Đợt 5 điều phối & lịch, 6, 7, tổng kiểm. Trước đó V9.11 (27/07 - ĐỢT 4 khép vòng đời + tiền xong; KẾ TIẾP: ĐỢT 4B 'mỗi HV/lead 1 DÒNG' theo yêu cầu Luân, rồi Đợt 5→7, tổng kiểm cuối. Trước đó V9.10 (27/07 - ĐỢT 3 học vụ & giảng viên xong một mạch; còn Đợt 4→7 rồi hội đồng TỔNG KIỂM CUỐI. Trước đó V9.9 (27/07 - MÀN HÌNH THEO CHỨC DANH đã chạy: ROLESCOPE 9 nhóm quyền, menu/landing/khối/chuông/tab theo nhóm; Luân đổi quy trình: LÀM MỘT MẠCH các đợt còn lại, hội đồng TỔNG KIỂM CUỐI. Trước đó V9.8 (27/07 - ĐỢT 2 "ngày làm việc của sales" đã xong + qua thẩm định sales veteran (VER-01..11) và UX/UI (UXV-01..10), vá hết. Màn cổng đổi 2 BƯỚC chức danh -> tên theo góp ý Luân; cổng HV chỉ hiện 10 hồ sơ giàu dữ liệu).
> **VIỆC KẾ TIẾP THEO YÊU CẦU MỚI CỦA LUÂN (27/07): MÀN HÌNH THEO CHỨC DANH** - "đâu phải ai cũng được thấy đầy đủ". Hội đồng phải chốt ma trận chức danh x màn hình (xem `THIET_KE_PHAN_QUYEN_CHUC_DANH.md` nếu đã có), rồi triển khai: gateEnter đọc role -> menu/khối/trang theo vai trò. Đây là ưu tiên TRƯỚC Đợt 3 học vụ. Build nay xuất **3 file**: 2 HTML + `ITTs_data.js` (dữ liệu demo tách riêng — app ưu tiên đọc file này, thiếu thì dùng bản nhúng).
> **V9.7 = NỀN DEMO ĐA CỔNG** (Luân yêu cầu): màn cổng chọn NGƯỜI ở cả 2 file (nhân viên theo vai trò / học viên), mọi thao tác offline LƯU THẬT vào localStorage, các cửa sổ/cổng đang mở TỰ ĐỒNG BỘ (demo duyệt 2 chiều được), nút **Reset dữ liệu demo** (màn cổng + Cài đặt > Dữ liệu demo) đưa về nguyên bản. Chi tiết bẫy: mục 3sexies. Nguồn ở `_src/` (xem `_src/README_SRC.md`: build `ITTS_OUT="<mnt>/SOP ITTs" python3 gen_v5.py`, verify `ITTS_OUT=<out> node _tall.js` — kỳ vọng **36 trang 0 lỗi**, 125 icon đủ).
> **CÓ KẾ HOẠCH TỔNG THỂ MỚI: `KE_HOACH_HOAN_THIEN_APP.md`** — Luân cấp toàn quyền, 4 chuyên gia (LMS/CRM, sales, UX/UI, học vụ) đã rà toàn app ra 104 phát hiện, chưng cất thành 7 đợt. ĐỢT 1 ĐÃ XONG trong V9.6.
> **V9.6 đã xong:** hub **"Tính năng khác"** (FB-21: Bảo lưu · Mã giới thiệu · Bàn giao lead, nhóm Quản lý) + sửa lớp bug "sai êm" (DL09.class_id ở 3 hồ sơ, Bảo lưu đọc sai cột, 3 tham số sai tên CH2, 2 SLA cắm cứng) + UX quick wins (giữ scroll khi reRender, tương phản, focus ring, .jcard→.jpanel...) + màn gọi sales đủ thông tin.
> ### KẾT LUẬN HỘI ĐỒNG 6 CHUYÊN GIA (28/07 tối) - VIỆC TỒN ƯU TIÊN CAO NHẤT
> Luân triệu hội đồng rà toàn diện trước khi mang đi demo. 6 chuyên gia (vận hành / dữ liệu / phân quyền /
> UX-cấu hình / BI-KPI / cổng học viên) đã ra kết luận. **ĐÃ LÀM trong V9.22**: phân quyền phạm vi dữ liệu
> (8 miền x 4 mức x 11 nhóm chức danh, cắm ở scopeList + jAll + slaItems, che trường, tab Cài đặt > Phân quyền
> có khối "Xem thử bằng mắt của...") và tour 4 cấp độ (Tham quan / Trải nghiệm theo 5 vị trí / Chuyên nghiệp /
> DEV cho IT, bắt xác nhận trước khi chạy). **CÒN LẠI, làm theo thứ tự này:**
>
> **1. VÁ DỮ LIỆU DEMO - 192 bản ghi lỗi** (bộ kiểm cũ vẫn báo "ĐẠT" nên không thấy). Chuyên gia đã viết sẵn
> `_src/check_logic.py` (116 luật) - THÊM VÀO BỘ KIỂM BẮT BUỘC. Sửa Ở NGUỒN pipeline, không sửa tay JSON:
> (a) 19 ca GV dạy 2 lớp cùng giờ cùng phòng - gen_demo.py cần dict busy[(teacher,datetime)] + busy_room, và
> thêm 2 GV ACA vào DL01 (4 GV cho 22 lớp là thiếu); (b) 11 HV lớp ĐÃ KẾT THÚC mà trống mid_* - vòng sinh
> điểm giữa kỳ đang chạy trên list 4 lớp hardcode, phải duyệt mọi lớp finished; (c) 23 bài tập cờ nộp trễ
> mâu thuẫn ngày nộp - sinh giờ nộp TRƯỚC rồi suy ra status; (d) 8 buổi completed mà 0 dòng điểm danh;
> (e) 23 ca đảo thứ tự phễu (chốt trước tư vấn, xếp lớp trước đăng ký) - thêm pass kẹp mốc thời gian ở
> fixdata.py; (f) lệch sơ đồ cột (DL07 thiếu 5 cột ở 2 dòng...) - san phẳng schema bằng union key;
> (g) 105 dòng nhãn enum trôi ("late (Trễ)" vs "late (Đi trễ)"); (h) quota WOW sai phép tính; (i) 10 đơn
> còn nợ không có next_payment_due; (j) first_enrollment_id trỏ đơn mới nhất; (k) 14 lớp không có buổi nào,
> 11 lớp thiếu class_end_date, 3 lớp thiếu GV; (l) mid_overall không khớp TB 4 kỹ năng; (m) cột duyệt CK
> lẫn 2 định dạng (mã NVxxx vs tên); (n) 5 phiếu thu rỗng student_id + 1 phiếu ngày tương lai.
> SẠCH rồi: khóa ngoại 58 cặp + 19 cặp *_name khớp 100%, DL23/DL24 sạch, lịch tương lai đủ dày.
>
> **2. KPI DIỄN GIẢI + KHUYẾN NGHỊ** (Luân: "tính năng đặc biệt tiện ích"). PHẢI SỬA 4 LỖI TÍNH TRƯỚC, không
> thì app khuyên sai: CUR 26% là ảo (tính cả 10 lớp planning + 1 cancelled; lọc in_progress+open ra 79%);
> HCR 70% do đếm cả 44 bài chưa tới hạn (loại ra: 79%); AR 35% do tính cả 6 hồ sơ chưa có kết luận (loại: 55%);
> kpiCompute KHÔNG theo bộ lọc kỳ REPKY của trang. Rồi thêm hằng `KPIDOC` (đặt liền trên kpiSection) cho 17
> chỉ số quan trọng, mỗi mục 6 trường: nghia / visao / nguon / doc(v) động theo 5 bậc / vi(v,X) BẮT BUỘC kèm
> số con thật / viec(sev) 2-3 hành động có nút bấm tới đúng chỗ + quy(v) quy ra người và tiền + mau() cỡ mẫu.
> Hàm `kpiSev` 5 bậc (tot/dat/hut/canhbao/baodong) suy từ khoảng cách tới ngưỡng CH6, riêng 4 chỉ số ngưỡng
> 100% và SS/NPS cần dải riêng KPIBAND. Hàm `kpiGo(key,{filt,q,qf,tab})` để nút mở đúng trang + đúng bộ lọc.
> Hiển thị 3 tầng: nhãn 5 mức thay chấm nhị phân / 1 dòng nhận xét hiện sẵn CHỈ cho chỉ số không đạt / bung
> chi tiết khi bấm. Thêm khối **"3 việc nên làm tuần này"** đặt TRÊN bizSection, chọn theo điểm = bậc x trọng
> số KPIW, mỗi chặng tối đa 1 việc. XU HƯỚNG: chỉ bật cho nhóm A (mẫu số đóng trong kỳ: LRT, ATR, SS...);
> nhóm B (TBR/CVR/PCR/RER/AR - mẫu số là lô cần thời gian chín) TUYỆT ĐỐI không hiện mũi tên nếu chưa trừ độ
> chín, vì CVR 17% so 85% là ảo do lô lead chưa chín. Chi tiết nội dung 17 chỉ số: xem transcript phiên 28/07.
>
> **3. CỔNG HỌC VIÊN - THIẾU TRỤC GIAO TIẾP HAI CHIỀU** (Luân: "trang học viên là để học viên giao tiếp với
> trung tâm nữa mà"). Hiện chỉ có 1,5 kênh (trả lời khảo sát, gửi góp ý). Dữ liệu ĐÃ mở sẵn đường cho
> self-service mà cổng không dùng: enum_wow_booked_by có "student", enum_wow_session_type có "self_booked",
> enum_class_confirmation_status đủ 3 giá trị. 7 kênh cần thêm, TỔNG CHI PHÍ chỉ 1 enum mới
> (`student_request` trong enum_task_type) + 1 cột mới (`DL16.session_id`) + cho DL24 tác giả là HV:
> (a) báo nghỉ trước một buổi (DL12.absence_type=excused đã có, 22 dòng đang nhập tay); (b) xin học bù;
> (c) tự đặt WOW (20/72 buổi đã là student đặt qua kênh ngoài); (d) TỰ XÁC NHẬN LỚP - cổng đang ghi "chờ bạn
> xác nhận" mà không cho bấm, lỗi trải nghiệm rõ nhất; (e) hộp "Trao đổi với trung tâm" tái dùng DL23/DL24;
> (f) xin bảo lưu/đổi lớp/rút học phí; (g) đánh giá từng buổi bằng hàng sao. Màn xử lý phía nhân viên ĐÃ CÓ
> HẾT, không phải dựng mới.
> Cộng 8 thiếu sót khác: (h) LỊCH ĐÓNG HỌC PHÍ từng đợt không hiện trên cổng (next_payment_due có 25/97 đơn
> nhưng renderTrangHV không đọc lần nào) + nút "Tôi đã chuyển khoản"; (i) buổi NGHỈ và buổi HỌC BÙ vô hình
> (upSes lọc bỏ cancelled) - đây là cuộc gọi lễ tân nhận nhiều nhất; (j) thẻ "Lớp của bạn" (lịch cố định,
> link Zoom bấm được, GV kèm ảnh - DL01 chưa seed bio/avatar_url dù gvBioEdit đã biết ghi); (k) materials_link
> in dạng chữ thô không bấm được + DL20.file_link rỗng 100%; (l) chứng nhận hoàn thành khóa (DL18 có
> attendance_rate/completion_rate 17/17 dòng chưa dùng); (m) 3 chỗ CÒN LỘ nội bộ: DL12.note in nguyên ghi chú
> chăm sóc ("HV hứa đi học lại"), nhãn "escalated (Leo thang lên QL cao)", "đã trừ 1 lượt quota"; (n) mục lục
> 12 mục phẳng sai thứ tự nhu cầu - chia 3 nhóm, thêm mask đóng sidebar trên điện thoại (hiện bấm ra ngoài
> không đóng được) + thanh tab dính đáy 4 nút; (o) 3 điểm WOW: đếm ngược + nút tải lịch .ics, huy hiệu chuyên
> cần theo chuỗi, so với mặt bằng lớp ẩn danh. CẢ TRANG KHÔNG CÓ SỐ ĐIỆN THOẠI nào dù khuyên "liên hệ trung
> tâm" 3-4 lần. Nếu chỉ làm được 4 việc trước demo: (h), (d), (c), (i).
>
> **4. VẬN HÀNH - ĐÓNG HỌC PHÍ THEO ĐỢT** (Luân nêu đích danh). Hiện DL06 chỉ có MỘT cột next_payment_due bị
> ghi đè mỗi lần thu, không lưu được lịch trả góp. Đề xuất: bảng DL06b (schedule_id, enrollment_id,
> installment_no, due_date, due_amount, paid_amount, status) + installment_no vào DL07; tham số CH2 mới
> installmentPlans / installmentGap_days / installmentRemind_days / installmentLate_days; nhắc TRƯỚC hạn chứ
> không chỉ sau; in lịch đợt vào phiếu. Kèm 11 phát hiện vận hành khác: HV trả góp bị đánh dấu quá hạn oan
> (jStageOf chỉ sang chặng paid khi rem<=0); xlWaiting tiêu đề "Đã đóng đủ tiền" nhưng lọc theo
> enrollment_status; không chuyển được lớp khi ĐANG HỌC (obChange chỉ chạy lúc onboarding); bảo lưu quay lại
> không nối được lớp mới; HV học khóa THỨ HAI bị bỏ quên (4 hàm khóa theo student_id thay vì enrollment_id -
> HV079 có đơn 18 triệu không xuất hiện ở hàng chờ nào); không chuyển được học phí sang khóa khác;
> bizSection cộng nhầm 11 triệu nợ ma từ đăng ký đã hủy; duyetRefundRun không tính lại remaining_amount;
> ưu đãi chỉ 1 ô không chồng được + form đăng ký không có ô loại/lý do; đổi GV một buổi phải hủy rồi tạo bù;
> bảng công tháng không cộng buổi WOW.
>
> **5. UX + NGUYÊN TẮC "CÓ HIỂN THỊ THÌ CÓ CHỖ SỬA"** (Luân đặt ra): viết helper `slaChip(param)` in số kèm
> icon bánh răng bấm tới đúng dòng cấu hình (dùng window.CFHL để cuộn + tô sáng), thay mọi chỗ đang in SLA
> thô (~15 trang); thêm nút "Sửa câu này" cạnh câu nhắn CH4 trong sopBlock (window.MSGQ đã có sẵn); link tới
> CH1 khi hiện nhãn enum. Bổ sung 17 tham số app đang dùng mà KHÔNG có trong APPPARAMS (nặng nhất: mốc ngày
> chính sách hoàn tiền refundFull/Partial/Reduced_days, slaTeacherNote_hours, thresholdDeposit_minimum...);
> chuẩn hóa giá trị mặc định lệch giữa code và bảng cấu hình (slaComplaintHigh 4 vs 24, slaTestResult 24 vs 48);
> DUEFALL=5 cắm cứng -> đưa vào CH2; RTOUCH 16 nhóm câu chăm sóc + preset giờ hẹn cắm cứng -> đưa ra cấu hình;
> quota WOW chặn nhưng không có màn nào cấp thêm. XÓA 4 hàm render chết (renderDashboardOld, renderPipeline,
> renderTracuu, renderKhaosat) + ô chọn vai roleSel luôn ẩn. Trang thiếu thành phần chuẩn (dải số + bộ lọc +
> hàng đợi): renderDuyet, renderGiaoan, renderMaGioiThieu, renderReupTab, renderBanggiao. statStrip ở 15 trang
> không bấm được trong khi ở Trang bắt đầu bấm được - cho nhận tham số onclick. Tab CH6 là tab Cài đặt DUY NHẤT
> không có notebar hướng dẫn (vi phạm thẳng vế "ở nơi sửa nên hướng dẫn cách sửa").


## 3unvicies. V9.23 (28/07 tối) - MẢNG 1: VÁ SẠCH DỮ LIỆU DEMO + 6 YÊU CẦU PHÁT SINH CỦA LUÂN

### A. Vá dữ liệu demo: 192 -> 4 bản ghi lỗi (sửa Ở NGUỒN pipeline, không sửa tay JSON)

**Quyết định thiết kế phải ghi lại (đây là chỗ tốn suy nghĩ nhất):**

1. **Lớp học phải có LỊCH THẬT thì mọi luật lịch mới đúng được.** Trước đây `gen_sessions` chỉ
   rải buổi cho 6 lớp đang chạy + 2 lớp đã kết thúc, GV lấy cứng theo `main_teacher_id`, phòng bê
   nguyên từ dữ liệu cũ. Hệ quả: 19 ca GV dạy 2 lớp cùng giờ, 19 ca trùng phòng, 14 lớp trắng lịch.
   Nay dựng lại: mọi lớp đều có lịch; **ngày kết thúc SUY RA từ số buổi hợp đồng của khóa**
   (`span_days` = số buổi / số buổi mỗi tuần), không đóng cứng 84 ngày như trước - trước đây lớp
   12 tuần mà khóa ghi 64 buổi là mâu thuẫn thẳng trong chính dữ liệu.
2. **PHÒNG HỌC là thuộc tính của LỚP (DL10.venue_or_zoom_link), không phải của buổi.** Bẫy đã cắn:
   ban đầu định gỡ trùng phòng ở từng dòng DL11 - vô ích, vì luật 13p đọc phòng từ DL10. Phải xếp
   phòng ở MỨC LỚP.
3. **Bộ xếp lịch so KHOẢNG GIỜ, không so mốc giờ.** Hai lớp 18h-19h30 và 19h-20h30 không trùng mốc
   nhưng trùng thời gian thật - GV không thể đứng cả hai. Xếp theo lớp KHÓ nhất trước (khoảng chạy
   dài nhất) vì greedy "ai đến trước xếp trước" hay kẹt ở lớp cuối.
4. **Quy mô nhân sự phải khớp quy mô lớp.** Dựng lịch thật xong mới lộ ra: giờ cao điểm tối T2-T4-T6
   có tới 9 lớp chạy song song. 4 GV cho 22 lớp là bất khả thi -> **thêm 6 GV ACA (NV033-NV038,
   tổng 10 GV)** và **12 phòng học ở 4 cơ sở**. Hội đồng đề xuất thêm 2 GV là ước lượng trước khi
   có ai mô hình hóa lịch.
5. **Ngày khai giảng lớp lên kế hoạch phải TẤT ĐỊNH** (rải đều 25 + i*4 ngày), không random - random
   làm bộ xếp lịch lúc chạy được lúc báo thiếu GV.
6. **Nhãn là tài sản của DANH MỤC CH1, không phải chuỗi gõ tay ở từng script.** Thêm pass §13 trong
   `fixdata.py`: bản đồ cột -> enum khai TAY (không dò tự động, vì nhiều enum dùng chung mã như
   `on_track`, `active`, `late`), kéo mọi ô về đúng nhãn CH1.
7. **Trạng thái phải SUY RA từ mốc thời gian, không tung xúc xắc song song.** Bài tập trước đây bốc
   nhãn "Nộp trễ/đúng hạn" độc lập với giờ nộp -> 23 bài mang nhãn ngược hẳn. Nay sinh giờ nộp
   trước, kẹp trong khoảng hợp lệ, rồi mới suy nhãn. Thêm lưới chặn §7c-bis ở `fixdata.py` vì các
   pass phía trên đều có thể dời giờ nộp.
8. **Kẹp cả CHUỖI mốc phễu một lần (§14), không kẹp từng cặp.** Các pass cũ kéo từng cặp mốc nên vẫn
   đẻ ra "chốt deal trước tư vấn". Pass mới chạy CUỐI, kẹp lead -> test -> tư vấn -> chốt -> đăng ký
   -> thu tiền -> xếp lớp -> gửi info -> xác nhận.
9. **Mọi dòng trong một bảng phải CÙNG BỘ CỘT (§15, pass cuối cùng).** Cột chỉ có ở vài dòng làm app
   render ô trống. Phải chạy sau mọi pass khác vì nó thay object dict của từng dòng.
10. **Cột `*_by` là MÃ nhân viên, tên để ở `*_name`.** Ghi tên vào ô mã = mã chết. Đã vá
    `DL06.discount_approved_by` (ghi "Phạm Thị Kim Ngân"), `DL07.verified_by` (ghi "Kế toán"), và
    `verified_by=NV011` vốn là NV IT chứ không phải kế toán (114 phiếu thu).
11. **Ba cặp nhân sự trùng khít họ tên** (NV010/NV017 kế toán, NV011/NV018 IT, 2 ô "(Chưa tuyển)")
    làm mọi chỗ tra người theo tên nhập nhằng - đã tách tên, ô trống biên chế ghi rõ phòng.
12. **Hàng chờ phải là DỮ LIỆU CÓ THẬT, không phải sự vắng mặt của dòng dữ liệu.** HV080 "chờ xếp
    lớp" trước đây thể hiện bằng cách KHÔNG có dòng DL08 - không phân biệt được với thủng dữ liệu.
    Nay có dòng DL08 `placement_status = not_assigned (Chưa xếp lớp)`.
13. **Hàng chờ điểm danh phải là buổi VỪA DẠY XONG**, không phải buổi từ tháng trước (§10b).

**Ba luật kiểm được thu hẹp phạm vi CÓ LÝ DO nghiệp vụ (ghi rõ để lần audit sau không tưởng là gian):**
- `9i`: chỉ xét lớp ĐÃ KẾT THÚC. Lớp đang chạy chỉ công bố lịch vài tuần tới - chưa đủ số buổi hợp
  đồng là ĐÚNG nghiệp vụ.
- `2c`: chỉ báo khi HV không có BẤT KỲ dòng DL08 nào (HV đang chờ xếp lớp vẫn có dòng).
- `6i`: chấp nhận `lead_id` thay `student_id`. Đơn hủy TRƯỚC khi nhập học thì chưa có mã HV - tiền
  vẫn truy ngược được qua lead.
- `4i`: buổi vừa dạy xong trong 24h chưa điểm danh là VIỆC ĐANG CHỜ, không phải dữ liệu hỏng.

**7 luật kiểm MỚI** (`check_logic.py` nay 123 luật): `9k` lớp chưa hủy phải có ngày kết thúc · `9l`
lớp chưa hủy phải có GV · `16a` không cho chữ tiếng Việt KHÔNG DẤU lọt vào dữ liệu · `16b` giao việc
phải phủ đủ phòng ban · `16c/16d/16e` quyền tạm theo việc phải có mức + hạn + được thu hồi ·
`16f` không hai nhân viên trùng khít họ tên · `16g` phiếu thu phải có `net_received`.
Cặp `DL07.received_by/verified_by` và `DL06.discount_approved_by` đã được đưa vào `NAMEP`.

Số dòng dữ liệu: 4126 -> DL11 460 buổi (từ 215), DL12 1798 dòng điểm danh, DL01 41 người.

### B. 6 yêu cầu phát sinh của Luân trong phiên (ghi lại vì đều là lỗi thật)

1. **"Sửa cấu hình lưu quá trời mà không áp dụng"** - hai nguyên nhân tách bạch:
   (a) `saveKpi`, `staffSave`, `enumAdd`, `enumDel` KHÔNG vẽ lại trang nên không kích hoạt
   `persistSoon()` - sửa xong F5 là mất. Đã cho **cả 8 hàm cấu hình gọi `persistSoon()` trực tiếp**,
   không đi nhờ `reRender` nữa. **LUẬT: hàm nào ghi vào DATA thì tự gọi persistSoon, đừng tin
   render sẽ lưu hộ.**
   (b) Nặng hơn: **32/61 dòng CH2 không có hàm nào trong app đọc tới** (`kpiThreshold_*`,
   `slaWowBooking_hours`, `wowQuota_default_sessions`...) và **19 tham số app dùng thật lại không
   khai trong APPPARAMS** nên không có ô mà sửa. Đây chính là mảng 5 - sẽ nối hai đầu lại.
2. **Sidebar mặc định XỔ HẾT** mọi nhóm (trước chỉ mở "Làm việc").
3. **4 CHẶNG vòng đời nổi hẳn so với trang nghiệp vụ**: nhóm chặng có vạch màu chạy dọc mép trái,
   mục "Tổng quan chặng" thành viên thuốc nền màu chặng, chữ hoa - chặng là "bản đồ", nghiệp vụ là
   "chỗ làm việc".
4. **BỎ nút "Nhập lead mới"** (Luân tự bắt, hội đồng không thấy). Hai nút cùng tạo một dòng DL02
   nhưng form chung KHÔNG chặn trùng số và KHÔNG ghi lượt liên hệ đầu vào DL02b -> lead tạo bằng nó
   làm sai luôn đồng hồ SLA phản hồi (LRT) và sổ chạm. Giữ đúng MỘT cửa vào.
5. **Hướng dẫn (tour) hiện ra màn hình đen** - lỗi xếp lớp hiển thị, không phải lỗi JS (harness mới
   `_checktour.js` chạy 11 bài / 64 bước sạch). `.tourspot` z-index 150 kèm `box-shadow` phủ kín màn,
   cao hơn cả ngăn kéo (61) và lớp mờ (60): lớp phủ tour bị bỏ lại là mọi thứ mở sau đó đều chìm
   dưới nó. Đã: nâng `.mask`/`.drawer` lên 170/171, thêm `tourCleanup()` dọn lớp phủ mồ côi mỗi lần
   mở ngăn kéo, Escape thoát tour, `tourStart` đóng hẳn ngăn kéo trước khi phủ.
   **BỎ thẻ mời xem hướng dẫn tự nổ lúc mở app**; lối vào giờ là nút **"Chạy hướng dẫn"** cố định
   trên thanh tiêu đề ngay cạnh "Reset demo".
6. **Module giao việc viết bằng tiếng Việt KHÔNG DẤU và bỏ sót vị trí.** Đã viết lại toàn bộ 25 kịch
   bản + lời trao đổi DL24 bằng tiếng Việt có dấu, và duyệt ĐỦ 9 phòng ban thay vì bốc ngẫu nhiên 10
   người: nay 31 việc / 22 người / 15 chức danh, phủ 8 phòng ban (Ban Giám đốc không nhận việc giao
   xuống là đúng - CEO không có cấp trên).

### C. QUYỀN TẠM THEO VIỆC (Luân hỏi: "giao việc dính học viên thì có mở quyền sửa không, thế phải có lịch thu hồi nhỉ?")

Luân đúng. App V9.22 CÓ cấp quyền tạm cho hồ sơ đính kèm việc, nhưng cấp theo TRẠNG THÁI việc -
tức là thu hồi ngầm, không có hạn rõ, người được giao không biết mình còn quyền tới bao giờ và
người giao không có chỗ nào nhìn thấy ai đang được mở quyền gì.

Đã làm ở tầng DỮ LIỆU (DL23 thêm 4 cột): `perm_level` (view Chỉ xem / edit Xem và sửa / none Đã thu
hồi), `perm_until` (mặc định = hạn việc + ân hạn, hiện cắm 48h - **mảng 5 phải đưa ra CH2 thành
`permGrace_hours`**), `perm_revoked_at`, `perm_note`. Quy tắc: việc giao xuống BẮT BUỘC mà có đính hồ
sơ thì cho SỬA, còn lại chỉ XEM; việc đã xác nhận/từ chối/hủy thì thu hồi ngay.
**CÒN LẠI cho mảng 5 (tầng app):** hiện mức + hạn quyền ngay trên thẻ việc, sổ "Quyền tạm đang mở"
cho quản lý thu hồi tay, và ghi vết mọi lần cấp/thu.

> **VIỆC TỒN web app (ưu tiên trên xuống):**
> 1. **CHỜ LUÂN NGHIỆM THU ĐỢT 9 + YÊU CẦU KẾ TIẾP** - 4 yêu cầu 28/07 (phòng 2 máy, cổng HV đúng vai, hồ sơ 360 superset, rà sidebar) đã trả xong trong V9.16. Luân cần THỬ THẬT phòng 2 máy trên 2 máy khác nhau (phiên cloud không tự test WebRTC được). Phiên sau: hỏi/đợi yêu cầu kế tiếp trước khi làm gì lớn.
> 2. **HỘI ĐỒNG TỔNG KIỂM CUỐI (đang HOLD theo lệnh Luân)** - khi Luân bật đèn xanh: gom UX-39 (font Montserrat offline), UX-12 (thanh lọc kiểu cũ), UX-13 (đồng nhất stat-tile), UX-06 (quét hex -> token), CRM-09 (kỳ báo cáo áp vào phễu/bizSection) + 62 cảnh báo mức app còn lại trong _tester.js (baseline 64, trong đó 2 cảnh báo là bug của chính script tester - hardcode enum "paused" không có trong CH1).
> 3. **2 file Word hướng dẫn** (Luân nói "chưa cần" - chờ lệnh): phụ lục NA085-094, quy tắc MATCH-link, CH4 2 lớp, CH6.
> 4. **Tái tạo bộ kiểm _check1.._check10** (thất lạc cùng scratchpad phiên cũ) - làm dần: đụng vùng nào viết lại bộ kiểm vùng đó, viết xong CẤT NGAY vào _src.
> Chi tiết bẫy & quyết định app: mục **3bis→3quaterdecies** bên dưới. Danh sách feedback đầy đủ: `FEEDBACK_theo_doi.md`.

1. **Cập nhật 2 file Word** (Luân nói "chưa cần" - chờ lệnh):
   - `ITTs_HuongDan_next_action_cho_IT.docx`: phụ lục dừng ở NA084 (thiếu NA085-094),
     chưa có quy tắc MATCH-link, chưa mô tả CH4 mẫu-câu 2 lớp mới.
   - `ITTs_HuongDan_VanHanh_ToanDoi.docx`: chưa nhắc CH6 và cách sửa câu kiểu mới ở CH4.
2. **Web app** (bản 1-app duy nhất, ko phân quyền - GĐ1 xong; UX/UI đã benchmark chuẩn):
   - **GĐ2 XONG** (thiết kế lại thành luồng công việc thật, mỗi bước có dấu hoàn thành để
     tắt cảnh báo SLA): Xếp lớp, Test, Tư vấn&ĐK, Thanh toán, WOW, Khiếu nại, Kết thúc&Tái ĐK
     + Bài tập, Điểm danh (đã làm trước). Sinh 2 bản từ `gen_app.py`(v3 offline)
     & `gen_appscript.py`(v4 .gs). Verify bằng node harness (22 trang render, 7 flow custom).
   - **CẦN THÊM 1 CỘT** để dấu "Đã gửi thông tin lớp" (Xếp lớp) lưu thật ở v4:
     thêm cột `class_info_sent_at` vào cuối DL08. Chưa thêm thì nút vẫn chạy, chỉ ko lưu qua reload.
   - **GĐ3 XONG**: (a) "Việc hôm nay" = TRUNG TÂM CẢNH BÁO SLA - gom mọi việc dở có dấu
     hoàn thành, nút "Xử lý" nhảy đúng luồng (đã lọc), làm xong là việc tự mất; chuông sidebar
     = số quá hạn. (b) Báo cáo có biểu đồ SVG thuần (phễu+%, doanh thu/tháng, donut lead,
     cột chuyên cần/học thuật) - chạy cả offline lẫn Apps Script. (c) Mobile: sidebar ngăn kéo
     (nút ☰), lưới tự xếp lại. (d) ITTs_Reminders.gs thêm 2 quét: "Chưa gửi thông tin lớp"
     (guard: chỉ chạy khi DL08 có cột class_info_sent_at) + "WOW chưa ghi nội dung".
   - **Bẫy demo**: class_info_sent_at là cột MỚI -> nếu ko seed, 67 onboarding hiện "chưa gửi"
     giả. Đã seed cho ca đã xác nhận/hoàn tất trong demo_data_big.json (còn 3 ca thật).
   - **ĐỢT "NÂNG TẦM" XONG** (audit toàn app): vá mọi chỗ ghi-giả thành ghi-thật
     (Duyệt CK/hoàn tiền qua apiApprove; Điểm danh theo buổi + chống trùng qua apiAttendanceSave;
     chấm bài đóng graded_at + cờ 48h; liên hệ cập nhật ngược lead; tạo ĐK tự sinh HV từ lead
     kèm quota WOW theo khóa + lead->converted; xếp lớp +sĩ số; đặt WOW trừ quota/chặn hết quota;
     thu ghi received_by; Thêm-mới ghi sheet thật; validate ngày chặt). UI: hộp xác nhận trước
     thao tác 1-chạm; dim nền khi mở form thêm mới; khiếu nại = drawer hồ sơ vụ việc theo
     trạng thái (Nhận theo tài khoản - phân công để dành quản lý khi có phân quyền).
   - **ĐỢT "VÁ LOGIC 7 TRANG" XONG** (thước đo: dùng hết data thật + đủ tình huống thật):
     Xếp lớp lọc đúng khóa + đổi lớp/HV từ chối (sĩ số 2 lớp, reset info); Test vắng/hẹn lại/
     từ chối; Bài tập thêm bước Thu bài (is_late tự tính); WOW chọn GV + trọng tâm; Khảo sát
     thành trang 2 tab (điểm thấp tự bật follow-up; phản hồi tiêu cực → tạo khiếu nại link
     2 chiều P8→P9); Kết thúc: tạo hồ sơ DL18 cả lớp (idempotent); Bảng lớp: lịch buổi DL11.
     Điểm danh trước đó: buổi theo DL11 (dự kiến vs thực tế + bắt đầu/kết thúc buổi), 4 trạng
     thái vắng phép, đánh giá T/B/Y, ghi chú, giờ vào. Màn chọn vai trò ở login đã bỏ.
   - **DEMO SINH LẠI TỪ ĐẦU** bằng `gen_demo.py` (outputs/): neo NGÀY CHẠY, 2.866 dòng,
     tự kiểm FK/số dư + **34 tiêu chí coverage** (đủ mọi trạng thái enum × mọi màn) trước khi xuất.
     Seed = ITTs_SeedDemo.gs nhúng sẵn + `wipeDemo` + **`resetDemo`** (xóa sạch → bơm lại,
     TỰ DỜI mọi mốc ngày về ngày chạy theo SEED_ANCHOR; dob không dời; ngày trong text cũng dời).
     Bẫy đã vá: khoản thu sinh ngày TƯƠNG LAI (clamp về NOW); nợ chỉ cảnh báo sau
     slaPayment_grace_days (7 ngày); ca quá hạn onboarding phải là HV CHƯA vào roster
     (không thì "đã đi học mà chưa gửi info" - vô lý).
   - **GHI NHẬN CUỘC GỌI KHÔNG KẾT NỐI ĐƯỢC**: form Ghi liên hệ có ô bắt buộc "Kết quả liên hệ"
     (kết nối / hẹn gọi lại / không nghe máy / máy bận / đã nhắn chưa trả lời / sai số),
     lưu vào DL02b.result_note dạng "code (Nhãn)". NGUYÊN TẮC SLA: 1 nỗ lực gọi (dù hụt) đủ
     TẮT cảnh báo "chưa gọi" - không phạt NV vì khách không nghe; thay bằng nhóm "Gọi lại -
     chưa kết nối" (đến giờ hẹn) và "Đổi kênh liên hệ" (hụt liên tiếp >= attemptsNoResponse=3
     -> tự chuyển no_response; >= attemptsUnreachable=5 -> unreachable). Gặp được thì streak
     reset về 0. Sai số -> unreachable ngay. failStreak() đếm từ lần kết nối gần nhất.
   - **BẪY: app gọi tham số bằng TÊN KHÔNG CÓ TRONG CH2** (slaTestResult_hours, slaHomeworkGrade_hours,
     slaComplaintHigh/Med/Low_hours, slaWowNote_hours...) -> luôn chạy bằng default cứng, sửa CH2
     vô tác dụng. Đã vá bằng bảng PKEY (app -> tên thật CH2: slaGLA_hours, slaHomeworkGrading_hours,
     slaKN_*_hours, slaWowOutcomeRead_hours, thresholdContacted_attempts, slaLRT_minutes, slaCVT_hours).
     Trang Cài đặt: 20 tham số app dùng gom theo nhóm phòng ban + 45 tham số CH2 còn lại;
     tham số CH2 chưa có -> apiSetParam TỰ THÊM DÒNG vào CH2 + đặt named range.
     LUẬT: thêm paramOf() mới thì PHẢI thêm vào APPPARAMS (và PKEY nếu CH2 đã có tên khác).

   - **BẢN V5 (gen_v5.py -> ITTs_WebApp_v5_demo.html)**: bản GỌN xoay quanh luồng hành trình.
     Sinh từ bản gcopy gen_app.py (giữ V4 để tái dùng code). Khác V4:
     (a) menu 4 nhóm: Vận hành / Danh sách / Lớp học / Quản lý; các trang P1-P10 ẩn (hide:1)
         nhưng GIỮ trong PAGES vì luồng Chạy quy trình gọi tới.
     (b) 5 danh sách mới trong LISTCFG (ro:1 + pre-filter): hocvien, nguyco, lop, giangvien, nhanvien.
         renderList thêm hỗ trợ cfg.pre (lọc sẵn) + cfg.ro (ẩn nút Thêm mới) + cfg.sub.
     (c) luồng: jStepper(J,true) -> dải chặng bấm được; runGoStep/jStageReview (xem lại bước cũ);
         jNextHint (gợi ý bước kế tiếp). ROLES.pages = PAGES.map(k) để mọi trang hiện.
     LƯU Ý khi build V5: ROLES định nghĩa SAU PAGES nên PAGES.map dùng được.
   - **V5.7 - GỘP "CHẠY QUY TRÌNH" VÀO "BÀN LÀM VIỆC"**: trang chủ giờ = hero (chào + ô tìm
     lọc thẳng danh sách) + 4 chỉ số bấm được + panel "Chạy quy trình" (chip lọc theo chặng
     + danh sách người) LẤP KHOẢNG TRỐNG bên dưới, thay panel "Việc cần xử lý" cũ. Bấm 1 người
     là chạy; cả hàng đợi nối theo chặng đang lọc. `chay` ẩn khỏi menu (g:"_",hide:1) nhưng GIỮ
     trong PAGES vì runStart/hosoGoStage vẫn go("chay") để mở màn chạy. renderChay khi KHÔNG có
     RUN -> trả renderBanlam() (không còn renderChayHome riêng). runQueueFromTasks/runQueueStage
     -> go("banlam"). chayQSet -> reRender(CUR==="chay"?"banlam":CUR) để bấm chip re-render đúng
     trang đang đứng. Đếm chip "Cần xử lý" dùng overN = jAll lọc (J.act && (J.over||J.miss)) cho
     KHỚP bộ lọc chayList (KHÔNG dùng over.length của jTasks - khác định nghĩa).
   - **BẪY CSS ĐÃ VÁ: `.fchip.on` TRẮNG BỐC** (chip lọc được chọn = chữ trắng trên nền trắng).
     Gốc: `.fchip.on{color:#fff;border-color:transparent}` chỉ có nền ở biến thể màu (.on.red/
     .amber/.green/.gray/.blue); chip `on` KHÔNG kèm class màu (chip chặng "Chạy quy trình",
     nút "Tất cả") không có nền. Vá: thêm `background:var(--navy)` mặc định vào `.fchip.on`.
     Chip danh sách (renderList) vẫn dùng `on <stCls>` nên có nền màu; nay stCls rỗng cũng an toàn.
   - **BẪY HARNESS (không phải lỗi app): setRole("sales") ném "reading 'codes'"** vì V5 chỉ còn
     ROLES=[{k:"all"}]; RBK["sales"]=undefined -> staffFor lỗi. Khi verify PHẢI gọi setRole("all").
     App thật boot qua enter("all") nên không dính.

   - **V5.8 - CHUẨN THÔNG ĐIỆP CH4 ÁP VÀO HÀNH TRÌNH**: CH4 (94 câu nhắc việc chuẩn NA001-NA090)
     TRƯỚC ĐÂY KHÔNG hề được nhúng vào app - app tự chế câu chữ, lệch SOP. Đã trích CH4 từ
     ITTs_Operations_Template_v4.xlsx -> `config.ch4` trong demo_data_big.json (gen_demo.py copy
     nguyên `old.get("config")` nên các lần sinh demo sau TỰ GIỮ ch4 - không cần sửa gen_demo).
     Mỗi bản ghi: {code, sheet, tmpl, when, owner, params[]}. `msgText(code)` thay {1},{2}... bằng
     paramOf(params[i]) -> câu hoàn chỉnh. Bảng `JNA` map chặng -> [mã thường, mã khi quá hạn];
     jInfo trả thêm J.na + J.naMsg; màn Chạy quy trình hiện khung vàng ".runsop" = "Việc cần làm
     theo SOP · NAxxx"; jTasks dùng naMsg làm nội dung việc. Cài đặt có tab "Thông điệp nhắc việc
     (CH4)" gom theo sheet, sửa mẫu câu + xem trước câu đã ghép (saveMsg).
     LUẬT: thêm chặng mới -> PHẢI thêm dòng vào JNA (không có thì rơi về act.lb như cũ).
   - **NHÁNH MẤT/TỪ CHỐI ĐÃ CÓ nhưng BỊ ẨN**: jStageOf đã map rejected/unreachable -> "lost" và
     failStreak -> "no_contact" từ trước, NHƯNG chip lọc chỉ liệt kê JMAIN (13 chặng chính) nên
     25 lead "lost" + 8 "no_contact" không ai thấy. Đã thêm nhóm ảo `q="reup"` trong chayList
     (lost + no_contact = 33 hồ sơ), chip "Chăm lại/Reup", khối trên Bàn làm việc, và chip riêng
     cho paused/cancelled. Dùng cho chiến dịch remarketing/reup.
   - **12 KHỐI VẬN HÀNH trên Bàn làm việc (thay 4 khối cũ)**: 4 khối cũ bấm vào chỉ `go(trang list)`
     -> không lọc đúng tập người đang nói tới ("chưa kết nối đúng"). Nay mỗi khối bấm là
     `chayQSet(<mã chặng>)` -> lọc THẲNG danh sách Chạy quy trình ngay bên dưới (Lead mới cần gọi,
     Đang khai thác, Test chờ chấm, Có KQ chờ tư vấn, ĐK chờ thu, Đã thu chờ xếp lớp, Onboarding,
     Chăm lại/Reup); các khối không phải chặng (HV nguy cơ, WOW chờ xử lý, CK chờ duyệt, ĐK còn nợ)
     mới `go(trang)`. Khối count=0 làm mờ (.bstat.z).
   - **GỘP TỔNG QUAN VÀO BÁO CÁO & KPI + KPI THEO SOP**: trang `dashboard` ẩn (hide:1),
     renderDashboard()->renderBaocao() để link cũ không vỡ; renderDashboardOld giữ code cũ.
     renderBaocao = phead + bizSection + upcomingSection + **kpiSection** + phễu + phân bố +
     deptSection + bảng HV nguy cơ. `kpiCompute()` tính THẲNG từ DL01-DL18: 36/48 chỉ số CH6 có
     số thật, 12 chỉ số thiếu trường dữ liệu hiện "—" (chưa đủ dữ liệu). Hiển thị gom theo phase
     P1-P10, so ngưỡng + hướng (≤/≥) -> chấm xanh/đỏ/xám.
     **BẪY ĐÃ VÁ khi tính KPI**: (1) CR3 ra 177% vì mẫu số dùng uniqLead(test đã chấm) còn tử số
     dùng TOÀN BỘ lead có tư vấn (có lead tư vấn mà không qua test) -> sửa: tử số chỉ đếm lead
     CÓ CẢ test đã chấm VÀ tư vấn. Khi thêm KPI mới phải kiểm tử số ⊆ mẫu số. (2) LRT hiện
     "14269 phút" - KHÔNG phải lỗi tính: demo data có first_call_time trễ thật (trung vị 5,3 ngày);
     đã đổi cách hiển thị (phút>=1440 -> ngày, giờ>=48 -> ngày) cho dễ đọc.
   - **TÌM KIẾM BỎ DẤU**: thêm `vnorm()` (NFD + bỏ dấu + đ->d). Áp cho ô tìm ở Bàn giao lead,
     ô tìm Chạy quy trình/Bàn làm việc, và ô tìm chung của mọi trang Danh sách. Trước đây gõ
     "nguyen" ra 0 kết quả dù có "Nguyễn" - nay ra đủ.
   - Bàn giao lead: thêm ô tìm (tên/SĐT/mã) + chip lọc trạng thái (xếp theo thứ tự CH1) + nút
     Xóa lọc; "Chọn tất cả" chỉ chọn các dòng ĐANG HIỆN. Danh sách Nhân viên bỏ khỏi nhóm
     Danh sách (đã quản lý ở Cài đặt > Nhân viên).

   - **V5.9 - ĐỦ 20 TRANG DANH SÁCH, CHIA 3 NHÓM CON**: menu Danh sách trước chỉ có 5/20 bảng.
     Nay tách thành "DS · Tuyển sinh" (Lead, Lịch sử liên hệ, Test, Tư vấn, Đăng ký, Thanh toán),
     "DS · Học tập" (Học viên, HV nguy cơ, Lớp, Xếp lớp, Buổi học, Điểm danh, Bài tập, WOW,
     Kết thúc khóa, Giảng viên), "DS · Khác" (Khóa học, Khảo sát, Phản hồi, Khiếu nại).
     LƯU Ý buildNav: các trang CÙNG NHÓM phải NẰM LIỀN NHAU trong PAGES (nav in nhãn nhóm khi
     p.g đổi) - chèn xen kẽ sẽ ra nhãn nhóm lặp.
   - **5 BẢNG TRƯỚC ĐÂY KHÔNG CÓ LISTCFG NÀO TRỎ TỚI**: DL05 Khóa học, DL04 Tư vấn, DL11 Buổi học,
     DL12 Điểm danh, DL15 Khảo sát -> đã viết cấu hình cột mới (khoahoc, dstuvan, dsbuoihoc,
     dsdiemdanh, dskhaosat). **BẪY ĐẶT TÊN CŨ**: key `tuvan` thực ra trỏ DL06 (Đăng ký) và key
     `khaosat` trỏ DL16 (Phản hồi) - KHÔNG phải DL04/DL15 như tên gợi ý. Vì vậy alias mới đặt là
     `dsdangky`=mkRO(LISTCFG.tuvan) và `dsphanhoi`=mkRO(LISTCFG.khaosat). Đừng sửa tên key cũ vì
     các trang tác vụ đang dùng.
   - **10 DANH SÁCH CHỈ XEM DÙNG LẠI CẤU HÌNH CỘT** của trang tác vụ qua `mkRO(src,sub)` (copy
     nông + ép ro:1 + đổi sub). Không đụng bản gốc nên trang tác vụ vẫn chạy như cũ.
   - **VÁ: danh sách ro:1 vẫn SỬA ĐƯỢC trạng thái** - tableHTML render `qsel` (dropdown ghi thẳng
     dữ liệu) cho cột trùng cfg.filt mà KHÔNG kiểm tra cfg.ro. Đã thêm `!cfg.ro&&` -> list chỉ xem
     hiện chip tĩnh. Ảnh hưởng cả lop/hocvien/nguyco/giangvien (trước đó cũng lỡ sửa được).
   - Quyền sửa theo quyết định của Luân: CHỈ `khoahoc` (DL05 - danh mục sản phẩm/học phí) có
     form Thêm mới/Sửa (idp:"CRS-"); 18 danh sách còn lại ro:1, mọi thay đổi đi qua Chạy quy trình.

   - **V6.0 - HỦY HƯỚNG V5.9. NGUYÊN TẮC GỐC: DANH SÁCH PHỤC VỤ HÀNH TRÌNH, KHÔNG SOI DATABASE.**
     Luân bác V5.9: "danh sách để phục vụ cho hành trình chứ tạo cả đống vô nghĩa làm gì".
     Tiêu chí đúng: mỗi CHẶNG trong hành trình phải có MỘT TRANG LÀM VIỆC = danh sách hồ sơ ở
     chặng đó + bộ lọc theo tình trạng + ĐẦY ĐỦ hành động của chặng. KHÔNG dựng trang chỉ để
     đổ một bảng DL ra màn hình.
     **BẪY LỚN ĐÃ MẮC**: 9 trang tác vụ theo chặng (test, tuvan, thanhtoan, xeplop, wow, khaosat,
     khieunai, ketthuc, lienhe) VỐN ĐÃ CÓ ĐỦ CHỨC NĂNG nhưng bị ẩn từ V5.2 (g:"_",hide:1). Vì
     không thấy chúng nên V5.9 lại đi dựng 15 bản `ds*` chỉ-xem của CÙNG các bảng đó - vừa thừa
     vừa yếu hơn bản gốc. ĐÃ XÓA 15 trang ds* + toàn bộ mkRO alias; mở lại 9 trang gốc.
     LUẬT: trước khi tạo trang mới cho một bảng DL, PHẢI kiểm tra PAGES (kể cả hide:1) xem đã có
     trang tác vụ nào phục vụ bảng đó chưa.
   - **MENU SẮP THEO CHẶNG P1→P10** (không theo bảng dữ liệu): Vận hành → Chặng·Tuyển sinh (P1-P4)
     → Chặng·Học tập (P5-P7) → Chặng·CSKH & Kết thúc (P8-P10) → Tra cứu (5 danh sách thật cần:
     Học viên, HV nguy cơ, Lớp, Giảng viên, Khóa học) → Quản lý.
   - **2 TRANG TÁC VỤ THẬT SỰ THIẾU - đã dựng**: (a) `buoihoc` P6 Buổi học & nhận xét GV (DL11):
     SOP có SLA ghi nhận xét slaTeacherNote_hours=48 (NA021/NA069) mà không trang nào theo dõi;
     lọc chờ ghi/quá hạn/GV trễ/chưa dạy xong/hủy; hành động bhDone, bhNoteForm+bhNoteSave,
     bhCancel, bhMakeup (xếp dạy bù). (b) `baoluu` Bảo lưu/Bỏ học: chặng `paused` có hồ sơ nhưng
     không có nơi giữ chân; hành động blCallForm (ghi liên hệ + hẹn gọi lại), blComeback (về
     active), blDropout. Cả hai GHI THẬT vào DL11/DL09 qua markRow.
   - **KHÔNG dựng trang Khảo sát/Feedback mới**: renderKhaosat đã có 2 tab - Khảo sát (DL15: gửi,
     ghi kết quả, follow-up) và Phản hồi (DL16: phân loại, xử lý, chuyển thành khiếu nại); cộng
     trang `ghinhan` nhận phản hồi qua gọi/nhắn. Chỉ cần mở lại là đủ.
   - **V6.2 - MỘT CHUẨN BỘ LỌC DUY NHẤT**: app từng có 5 kiểu nút lọc (fchip có icon qua filterBar,
     fchip trần, pill, select, btn toggle). Nay có bộ 3 hàm dùng chung: `segHTML(cur,opts,onTpl)`
     (opts=[mã,nhãn,số đếm,lớp màu]; cur là CHUỖI cho đơn chọn hoặc MẢNG cho đa chọn - trang danh
     sách lọc đa chọn nên truyền mảng FILT[key]), `tbar(left,right)` (chèn .tbsp đẩy phần phải),
     `srchHTML(val,fn,ph,w)`. `filterBar(p,cur,opts,cnt)` GIỮ NGUYÊN chữ ký cũ nhưng ruột đã đổi
     -> 8 trang tác vụ tự lên giao diện mới, không phải sửa từng trang.
     LUẬT: thêm bộ lọc mới thì dùng segHTML/tbar, KHÔNG tự viết .fchip/.pill nữa.
     `.pill` giờ CHỈ dành cho nút hành động nhỏ (Đóng, Chọn tất cả), không dùng làm bộ lọc.
   - Nút **Cột** ghim cố định cuối thanh công cụ (sau .tbsp) ở mọi trang danh sách.
   - Nhãn chip Bàn làm việc đổi "Cần xử lý/Tất cả" -> **"Quá hạn (111)" / "Tất cả đang chờ (221)"**
     vì hai tập KHÁC NHAU (111 = J.over||J.miss; 221 = mọi J.act) mà chữ cũ gây hiểu là giống nhau.
   - **HỒ SƠ 360 THEO ĐỐI TƯỢNG (SOP BC5-BC8 vốn đã định nghĩa mà app chưa làm)**: thêm 3 trang ẩn
     mở bằng cách bấm TÊN trong danh sách - `hosogv` (openGV, BC7: buổi đã dạy/cần nhận xét/bài chờ
     chấm/HV nguy cơ + KPI TNR,GCR7,ADC + lớp phụ trách), `hosonv` (openNV, ĐỔI NỘI DUNG THEO VAI
     TRÒ: BC5 tư vấn / BC6 WOW / BC8 học vụ), `hosokhoa` (openKhoa: lớp, đăng ký, doanh thu, công
     nợ + CR10, AR). Dùng chung `statStrip()` (dải 4 số kiểu BC) và `kpiMini()` (KPI so ngưỡng CH6).
     Hồ sơ Lớp đã có sẵn = openLop/banglop.
     LUẬT: KPI trong hồ sơ 360 phải lấy ngưỡng qua `kpiTh(/^MÃ/,mặc_định)` để đổi ở Cài đặt là ăn theo.
   - Dải tổng hợp `statStrip` đã gắn cho `test` (P2) và `wow` (P7) theo đúng 4 ô của BC6.
   - **V6.3 - SIDEBAR GẬP NHÓM**: hệ quả của việc mở lại 9 trang tác vụ là menu lên 28 mục/6 nhóm,
     cao ~1108px trong khi vùng nav laptop 13" chỉ ~560px -> phải cuộn mới tới Tra cứu/Cài đặt.
     Vá: `navIsOpen(g)` (mặc định CHỈ mở nhóm chứa PBK[CUR], nhớ lựa chọn tay trong window.NAVOPEN),
     `navToggle(g)`, `navBadge(k)` (duyet/banlam/buoihoc/khieunai). buildNav gom PAGES theo nhóm rồi
     chỉ render item của nhóm đang mở; nhóm GẬP thì cộng dồn badge con hiện chấm đỏ ở nhãn nhóm để
     không bỏ sót việc. Còn ~248px, không phải cuộn.
     **QUAN TRỌNG**: `go()` nay GỌI buildNav() (trước chỉ toggle class .on qua querySelectorAll) vì
     DOM nav thay đổi theo trạng thái gập; đồng thời go() ép mở nhóm của trang đích. Trạng thái .on
     nay render thẳng trong buildNav chứ không toggle sau.
     Nhãn nhóm có ký tự `&` (vd "Chặng · CSKH & Kết thúc") được esc() thành `&amp;` trong onclick -
     trình duyệt tự giải mã lại đúng chuỗi gốc nên navToggle vẫn khớp p.g. Đừng "sửa" chỗ này.
     Luân đã chốt: KHÔNG gộp bớt trang cho ngắn menu - "trang cần thì nó phải có".

   - **V6.4 - TIÊU CHÍ LỌC TRANG: "có ai mở trang này để DUYỆT CẢ DANH SÁCH không, hay chỉ xem
     theo một khách / một lớp?"** Nếu chỉ xem theo ngữ cảnh 1 đối tượng -> KHÔNG lên menu, mà nằm
     trong hồ sơ 360 của đối tượng đó.
     Áp vào: **`lienhe` (Ghi nhận liên hệ) BỊ BỎ KHỎI MENU** - nó là bảng 550 điểm chạm của MỌI
     khách, không ai đọc kiểu đó. Lịch sử liên hệ đã nằm trong `jTimeline(C)` của hồ sơ 360 (đọc
     C.tps từ DL02b); nút "Ghi liên hệ" đã có ở 4 chỗ (hồ sơ 360, danh sách Lead qua openLienhe,
     luồng chạy qua jGoContact, gợi ý bước kế). Trang vẫn giữ hide:1 vì modalNext("lienhe",...) dùng.
   - Luân KHÔNG đồng ý bỏ review/ghinhan/banglop ("mấy cái khác có vẻ cần, nhưng do chưa được nâng
     cấp đúng, còn quá sơ sài") -> ĐÃ NÂNG CẤP thay vì bỏ:
     (a) `review` -> "P8 · Gửi khảo sát theo lớp": statStrip 4 số + BẢNG THEO TỪNG LỚP (sĩ số, đã
         gửi, đã trả lời, SRR so ngưỡng, hài lòng TB, đợt gần nhất) + gửi đợt ngay trên dòng;
         form chuyển sang drawer `rvForm(cid)`; rvSend nay closeModal() trước khi go().
     (b) `ghinhan` -> "P8 · Tiếp nhận & xử lý phản hồi": statStrip + HÀNG ĐỢI thẻ DL16 sắp quá-hạn
         lên đầu + bộ lọc + hành động phân loại/đóng/chuyển khiếu nại; form -> drawer `ghForm()`.
         SLA phân loại lấy từ paramOf("slaFeedbackClassify_hours",24).
     (c) `banglop` -> "Hồ sơ lớp": thêm 5 chỉ số của riêng lớp (sĩ số/CUR, ATR, HCR, HV nguy cơ, SS)
         so ngưỡng CH6 qua kpiTh.
     LUẬT CHUNG rút ra: trang tác vụ PHẢI có (1) dải số tổng hợp, (2) bộ lọc theo tình trạng,
     (3) hàng đợi có hành động ngay - không được chỉ là một cái form.

   - **V6.5 - NHÁNH RẼ CÓ LỐI THOÁT RÕ RÀNG**: `jBranchCard(J)` thay cho dòng chữ thông báo cũ.
     Mỗi nhánh có bảng G{} khai báo: tình trạng thực tế, KHỐI XANH ".brok" = "nếu liên hệ thành
     công thì bấm đây, chuyển sang chặng nào", các hành động phụ, và hành động nguy hiểm.
     **BẪY LOGIC LỚN ĐÃ VÁ**: `runRevive` ban đầu chỉ đổi lead_status -> chặng KHÔNG đổi, vì
     jStageOf đưa hồ sơ vào "lost" theo 3 nguyên nhân khác nhau:
       (a) phiếu tư vấn cuối `conversion_status=dropped` (kiểm TRƯỚC lead_status)
       (b) `lead_status` = rejected/unreachable
       (c) `failStreak(lead_id) >= attemptsNoResponse` -> "no_contact"
     runRevive nay gỡ ĐỦ CẢ 3: đưa phiếu tư vấn về "interested", ghi 1 điểm chạm DL02b
     result_note="connected" để cắt chuỗi hụt, rồi mới đổi lead_status.
     LUẬT: khi viết hành động "đưa hồ sơ trở lại luồng", PHẢI đọc jStageOf để biết ĐIỀU KIỆN NÀO
     đang giữ nó ở nhánh, gỡ đúng điều kiện đó - đổi mỗi trạng thái ngoài cùng là vô ích.
   - **TÁC VỤ VƯỢT QUY TRÌNH**: testQuickAdd (tạo lead + booking test cùng lúc cho khách
     referral đòi test ngay), tvQuick (tư vấn không qua test), payQuick (thu tiền cho ĐK còn nợ).
     NGUYÊN TẮC: tạo nhanh vẫn phải SINH ĐỦ bản ghi các bước trước, nếu không phễu/KPI sẽ lệch.
   - wowConfirm nay ghi "ai xác nhận, lúc nào" vào notes (giống verified_by của thanh toán);
     WOW thêm bộ lọc + ô "Chờ xác nhận lịch".
   - `classBar(cid)` - thanh thông tin lớp DÙNG CHUNG (GV có link mở hồ sơ GV, khóa, lịch,
     phòng/link, sĩ số, khai giảng, trạng thái) gắn ở Bảng lớp / Điểm danh / Bài tập.
     Trước đó Bảng lớp hiện `main_teacher_id` (mã NV) thay vì tên - lỗi kinh điển, nhớ dùng
     `*_id_name` hoặc find() ra tên.
   - Giao bài tập: nguồn bài (kho / soạn mới + tải tệp + link), phạm vi (cả lớp / chọn từng em),
     hạn nộp (chung / riêng từng em) - vì lớp cá nhân hóa cao. Bản offline chỉ lưu TÊN tệp.
   - Bỏ tiền tố P1..P10 khỏi TÊN TRANG (giữ trong KPIPH của báo cáo vì đó là giai đoạn SOP);
     "Tư vấn & Đăng ký" -> "Tư vấn & Đăng ký sau test"; nhóm Tra cứu lên ngay sau Vận hành;
     `navIsOpen` mặc định TRẢ VỀ TRUE (mở hết) theo yêu cầu của Luân.
   - `staffFor()` khi không khớp vai trò nào nay trả {staff_id:"ADMIN",full_name:"Admin"} thay vì
     lấy `r.name` ("Toàn bộ chức năng") - trước đó lời chào ra "Chào buổi chiều, Tài khoản hiện tại".
   - **V6.6 - TRANG HỌC VIÊN (`tranghv`, renderTrangHV)**: bản HỌC VIÊN TỰ XEM, khác hẳn `hoso`
     (360 của nhân viên). NGUYÊN TẮC: KHÔNG hiện SLA, KHÔNG hiện NV phụ trách, KHÔNG hiện
     next_action nội bộ - chỉ nói bằng ngôn ngữ học viên. 6 khối: (1) Trung tâm đã xác nhận
     (đăng ký / học phí từng khoản kèm "đã xác nhận" vs "đang đối soát" / lớp / nhập học),
     (2) Hành trình 6 bước, (3) Tiến độ + biểu đồ 4 kỹ năng test đầu vào (tự đánh dấu kỹ năng
     yếu nhất), (4) Sắp tới (buổi học + GV + phòng, WOW, hạn bài tập), (5) KHUYẾN NGHỊ sinh tự
     động theo dữ liệu (nợ học phí, chưa xác nhận lớp, vắng vượt ngưỡng, thiếu bài, còn quota
     WOW -> gợi ý đúng kỹ năng yếu, học thuật chậm, khóa đã kết thúc -> mời tái ĐK), (6) Lịch sử
     (điểm danh, bài tập, khảo sát, khiếu nại + kết quả).
     Dữ liệu lấy trọn từ `jCtx(sid)` nên không phải query lại. Quota WOW đọc từ DL09
     (wow_quota_remaining / wow_quota_used). Vào từ menu Tra cứu hoặc nút "Trang HV" ở danh sách
     Học viên (`openTrangHV`). Sau này tách thành cổng riêng có đăng nhập.
     BẪY: biến `low` (kỹ năng yếu nhất) khai trong nhánh có test - khi HV chưa test phải guard
     `typeof low!=="undefined"` trước khi dùng, nếu không câu khuyến nghị WOW sẽ ném lỗi.
   - **V6.7 - NHẬT KÝ TỪNG SỰ KIỆN trên Trang học viên**: 3 khối thêm.
     (a) LỊCH SỬ TĂNG BAND: bảng Overall + 4 kỹ năng, cột "Tăng" = final - đầu vào, cột "Mục tiêu"
         so `ce.target_band` -> đạt/chưa đạt. Đầu vào lấy DL03 (skill_listening/reading/writing/
         speaking + overall_score), đầu ra lấy DL18 (final_listening/... + final_test_score).
         Demo mỗi lead chỉ có 1 lần test nên chỉ 2 mốc; nếu sau này có nhiều lần test thì
         mở rộng bandRow thành nhiều cột theo C.tests.
     (b) ĐIỂM BÀI TẬP THEO KỸ NĂNG: gom DL13 theo `skill`, so trung bình NỬA ĐẦU với NỬA SAU để
         ra xu hướng ▲/▼ - dùng làm tín hiệu tiến bộ khi CHƯA có test đầu ra.
         LƯU Ý: enum kỹ năng của bài tập (Đọc/Viết/Nói/Từ vựng/Ngữ pháp) KHÁC enum kỹ năng test
         (Listening/Reading/Writing/Speaking) - đừng cố ghép 2 bảng này làm một.
     (c) NHẬT KÝ BUỔI HỌC: gộp DL11 (buổi, GV, teacher_late_minutes, teacher_note_summary,
         materials_link) + DL12 (điểm danh, check_in_time, in_class_performance, note) +
         DL13 lọc theo `session_id` (bài giao trong buổi + điểm + teacher_feedback).
         DL13 CÓ session_id nên ghép được bài tập vào đúng buổi - đây là chỗ dễ bỏ sót.
   - **V6.8 - HỘP "YÊU CẦU & PHÊ DUYỆT" + ĐỔI TÊN HÀNH TRÌNH**:
     (a) Hộp phê duyệt trên Trang học viên gom: chiết khấu (DL06 discount_amount +
         discount_approved_by/at), hoàn tiền (ĐK cancelled mà đã có khoản thu), WOW cấp thêm/mua
         thêm (DL09 wow_extra_approved / wow_extra_purchased), đổi lớp (DL08 placement_change_count).
         Tiêu đề khối hiện số "đang chờ". Đây là những thứ HỌC VIÊN quan tâm, khác hộp duyệt nội bộ.
     (b) "Hành trình học tập" -> **"Hành trình cùng IELTS The Tutors"** (Luân: trong đó có cả đóng
         tiền/xếp lớp thì gọi "học tập" là sai). Thay stepBar bằng dòng thời gian 13 mốc CÓ NGÀY GIỜ,
         mốc chưa xảy ra hiện mờ. Nguồn mốc: DL02.lead_created_time, DL03.test_date, DL04
         .consultation_time, DL06.enrollment_time, DL07 (lần đầu + lần cuối khi đã đủ), DL08
         .assigned_at / .class_info_sent_at / .confirmation_time / .onboarding_completed_at,
         DL12.check_in_time (buổi đầu), DL18.course_completion_time / .re_enrollment_contact_time.
     **BẪY: KHÔNG hardcode thứ tự mốc.** Dữ liệu thật lệch thứ tự lý thuyết (có HV học bù lớp cũ
     TRƯỚC khi hoàn tất nhập học lớp mới; có HV đóng nốt học phí SAU khi kết thúc khóa). Đã sắp
     JR theo pvnd(mốc) tăng dần, mốc chưa có đẩy xuống cuối - nếu giữ thứ tự cứng sẽ hiện sai đời.
   - **V6.9 - TRANG HỌC VIÊN, 5 CHỈNH THEO GÓP Ý**:
     (1) Khối học phí gom 4 ô LIỀN NHAU (Học phí · Ưu đãi · Đã đóng · CÒN PHẢI ĐÓNG) + thanh %
         đã đóng, rồi mới tới bảng từng lần thu. Trước đó "đã đóng" và "còn lại" nằm rời nhau.
     (2) Link "Xem bài đã nộp" (hvOpenHw) - demo chưa nối kho tệp, drawer nói rõ điều đó.
     (3) "Sắp tới" LUÔN hiện đủ 4 nhóm kể cả khi trống (Buổi học · WOW · Bài tập đến hạn ·
         Khảo sát chờ trả lời) - nhóm trống có câu gợi ý riêng. Nguyên tắc: người dùng phải biết
         mục này CÓ NHỮNG GÌ, không được ẩn nhóm trống.
     (4) Gom về MỘT bảng "Hành trình điểm số": Đầu vào → **Giữa khóa** → Đầu ra + Tăng + Mục tiêu.
         **CHƯA CÓ NGUỒN DỮ LIỆU GIỮA KHÓA**: DL13.score_type chỉ có giá trị "band", không có
         midterm/quiz; DL15 chỉ có mốc khảo sát week_1/4/8 chứ không phải điểm. Đã để sẵn cột
         hiện "chưa chấm" - khi bổ sung dữ liệu giữa khóa chỉ cần đổ vào cột đó.
     (5) **HỌC VIÊN NHIỀU KHÓA**: demo có 2 HV (HV060, HV061) học 2 lớp - bố cục cũ chỉ lấy
         C.obMain nên mất khóa thứ hai. Nay có bộ chọn khóa (window.HVCLASS); tách rõ:
         - theo LỚP (lọc theo khóa đang chọn): attC / hwC / paysC, xác nhận, tiến độ, nhật ký buổi
         - theo CON NGƯỜI (giữ trọn): hành trình điểm, WOW, phê duyệt, hành trình cùng ITTs
         LUẬT: khi thêm mục mới vào trang HV phải quyết định nó thuộc nhóm nào, đừng dùng thẳng
         C.att/C.hw/C.pays nữa.
   - **V7.0 - TÁCH CỔNG HỌC VIÊN RA FILE RIÊNG** `ITTs_TrangHocVien_demo.html`.
     CÁCH LÀM (quan trọng, đừng fork code): gen_v5.py cắt `HTML` làm 3 phần tại 2 mốc
     `</style></head><body>` và `<script>\\nvar DATA = __DATA_JSON__;` -> `_head` + vỏ body + `_script`.
     File nhân viên = _head + vỏ app cũ + _script(boot `enter("all")`).
     File học viên  = _head(đổi title) + `HV_SHELL` + _script(boot `bootHV()`).
     => JS/CSS DÙNG CHUNG, sửa một lần cả hai file cùng đổi. TUYỆT ĐỐI không copy renderTrangHV
     sang file thứ hai.
     Sidebar cổng HV là MỤC LỤC TRONG TRANG (khác sidebar điều hướng của app): `HVSEC` khai 11 mục;
     `hvNav()` CHỈ render mục nào có `document.getElementById(id)` thật -> tự ẩn mục không có dữ
     liệu (HV chưa có ưu đãi thì mất mục "Yêu cầu & phê duyệt", chưa thi thì mất "Hành trình điểm").
     `hvGo(id)` cuộn mượt bằng `hvMain.scrollTo({behavior:"smooth"})` theo `offsetTop`;
     `hvSpy()` chạy khi cuộn (debounce 60ms) để sáng đúng mục.
     **BẪY**: `reRender(k)` gốc ghi vào `#content` - cổng HV không có phần tử đó nên đã thêm
     nhánh: không thấy #content thì gọi `hvReRender()` (chỉ vẽ lại `#hvBody`). Mọi nút trong
     renderTrangHV gọi reRender('tranghv') vì thế vẫn chạy ở cả hai file.
     Vỏ HV_SHELL phải mang theo #toast, #mask, #cfm, #drawer vì hvOpenHw/confirmRun dùng tới.
   - **V7.2 - GỠ HẲN trang học viên khỏi app nhân viên** (Luân yêu cầu): xóa khỏi PAGES, xóa khỏi
     RENDER, xóa act "Trang HV" ở LISTCFG.hocvien. GIỮ NGUYÊN hàm renderTrangHV vì cổng riêng dùng.
     **BẪY DÂY CHUYỀN**: bỏ khỏi RENDER làm `reRender('tranghv')` mất đích -> ném
     "RENDER[k] is not a function". Đã (a) đổi hết `reRender('tranghv')` trong renderTrangHV +
     hvSurveySave + hvFeedbackSave thành `hvReRender()`, (b) cho reRender phòng thủ:
     `if(!el||!RENDER[k])` mới lui về hvReRender - trước chỉ kiểm `!el` nên phụ thuộc việc
     #content vắng mặt, rất mong manh.
     LUẬT: gỡ một trang khỏi RENDER thì phải rà hết `reRender("<key>")` trỏ tới nó.
   - Bổ sung 2 mục cuối trang HV: `s-khaosat` (phiếu mới gửi -> hvSurveyFill/hvSurveySave; phiếu
     đã trả lời -> hvSurveyView) và `s-gopy` (hvFeedbackForm/hvFeedbackSave ghi DL16 với
     feedback_status=new để lọt vào hàng đợi "Tiếp nhận & xử lý phản hồi" của học vụ).
     hvSurveySave TỰ đặt `follow_up_needed="Có"` khi satisfaction<=3 hoặc có negative_comments,
     và đổi câu thông báo cho HV - đây là chỗ nối ngược từ cổng HV vào quy trình CSKH.
   - **V7.3 - 3 HỒ SƠ DEMO 1/2/3** (`mkdemo.py`). KHÔNG tạo học viên mới từ đầu: phải sinh lại
     điểm danh/bài tập/buổi học và rất dễ đứt FK. Thay vào đó chấm điểm 81 HV theo độ "sáng" trên
     trang, lấy 3 hồ sơ giàu nhất (HV061, HV065, HV002), đổi tên -> Demo 1/2/3 và VÁ phần thiếu:
     Demo 1 thiếu hộp phê duyệt -> thêm ưu đãi chờ duyệt; Demo 2 thiếu WOW -> thêm 3 buổi đủ 3
     trạng thái kết quả; Demo 3 thiếu phê duyệt + điểm số -> thêm ưu đãi + test đầu vào đã chấm.
     Mỗi HV thêm 1 phiếu khảo sát CHƯA trả lời để demo nút "Trả lời ngay", và bỏ xác nhận 1 khoản
     thu để khối học phí có đủ 2 trạng thái.
     **BẪY ĐỔI TÊN**: tên học viên bị SAO CHÉP sang rất nhiều bảng (DL12/13/14/15.student_name,
     DL06/07/08/16/17/18.student_id_name, và lead gốc DL02.full_name + DL03.lead_id_name +
     DL04.customer_name_display + DL02b.customer_name). Sửa mỗi DL09 là các trang khác vẫn hiện
     tên cũ -> mkdemo đổi ĐỒNG LOẠT theo bảng NAMEFIELDS.
     Đẩy 3 hồ sơ lên ĐẦU mảng DL09 => cổng HV mặc định mở Demo 1 (bootHV lấy stu[0]) và danh sách
     Học viên ở app cũng đứng đầu - không phải viết thêm logic sắp xếp.
     **THỨ TỰ CHẠY**: gen_demo.py -> mkdemo.py -> gen_v5.py. Bỏ qua mkdemo là mất 3 hồ sơ demo.
   - **V7.4 - VÁ TÍNH HỢP LÝ 3 HỒ SƠ DEMO (8 điểm sai)**. Bài học: **vá dữ liệu điểm lẻ luôn đẻ ra
     mâu thuẫn ở chỗ khác** - phải kiểm chéo lại toàn bộ ràng buộc sau khi vá.
     Do mkdemo gây ra: (1) gắn chiết khấu vào ĐK ĐÃ ĐÓNG ĐỦ -> đóng thừa (remaining bị clamp về 0
     nên không lộ) - đã chuyển CK sang ĐK mới ENR-2026-081; (2) test đầu vào đặt NOW-120 ngày ->
     rơi TRƯỚC lead_created_time - phải neo theo mốc của chính hồ sơ, đừng dùng NOW.
     Có sẵn trong demo gốc: (3) HV065 hoàn thành khóa mà paid=0 và KHÔNG có dòng DL07 nào;
     (4) DL08.assigned_at (19/06) SAU class_start_date (02/04) và sau buổi học đầu (06/05);
     (5) OB-037 lớp 7.0 lại trỏ enrollment_id của ĐK khóa 6.5; (6) WOW chưa dạy mà quota_deducted=yes.
     KHÔNG phải lỗi: HV061 status "active" dù có DL18 - vì học 2 khóa, xong 6.5 và đang học 7.0.
     Điều kiện đúng: chỉ sai khi MỌI lớp của HV đều đã có bản ghi kết thúc khóa.
     **HÀM DÙNG LẠI trong mkdemo**: `sync_money(e)` (final=total-CK, paid=TỔNG DL07 thực tế,
     remaining=final-paid, tự đặt payment_status) và `add_payment(e,...)` - sửa tiền thì PHẢI đi
     qua 2 hàm này, đừng gán tay từng cột kẻo lệch với DL07.
   - **V7.6 - KHO BÀI TẬP (DL20) + GIÁO ÁN KHÓA (DL21)** - 2 bảng MỚI, sinh bởi `seed_giaoan.py`.
     Mô hình 2 tầng: **KHÓA quy định mặc định** (DL21: course_id + session_number -> topic,
     hw_bank_id, prep_note) -> **LỚP ghi đè khi cần** (DL11.hw_bank_id / DL11.prep_note; ĐỂ TRỐNG
     nghĩa là theo mặc định khóa, KHÔNG phải "không có").
     `sesPlan(s)` là hàm phân giải duy nhất - trả {topic, hw, hwFrom, note, noteFrom} với
     hwFrom/noteFrom = "lớp" | "khóa" | "". MỌI nơi hiển thị bài/lời dặn PHẢI đi qua sesPlan,
     đừng đọc thẳng DL11 hay DL21.
     `sesSave` khi giá trị chọn TRÙNG mặc định của khóa thì ghi "" (xóa ghi đè) - nhờ vậy sửa
     giáo án khóa sau này vẫn lan xuống lớp đó. Đây là chỗ dễ làm sai nhất.
     Trang `giaoan` 2 tab (giáo án theo khóa / kho bài tập); Bảng lớp thêm 2 cột + nút Cấu hình
     (sesForm) + Giao bài cho lớp (sesAssign, hạn mặc định = buổi + 7 ngày).
     Trang HV mục "Sắp tới" hiện topic + "Giáo viên dặn" + "Bài sẽ giao sau buổi" từ sesPlan.
     Bài tạo mới ở drawer cấu hình buổi ĐƯỢC LƯU VÀO KHO để lớp khác dùng lại.
   - Review: thêm `SVTPL` - bộ câu mẫu theo từng đợt khảo sát (week_1/4/8, end_of_course, adhoc);
     chọn đợt là tự điền câu hỏi, sửa được, lưu vào DL15.notes và HV xem lại thấy bộ câu đó.
     `runFeedbackOne` đổi từ `go("ghinhan")` sang `ghForm()` - đang xem hồ sơ 360 mà nhảy trang
     là mất ngữ cảnh; nguyên tắc: hành động phụ trong hồ sơ 360 luôn mở DRAWER.
   - **V7.7 - "NỘP TRỄ" ≠ "CHƯA NỘP"**. Luân chỉ ra: trễ nghĩa là ĐÃ NỘP nhưng quá hạn, VẪN CÓ
     bài để xem và vẫn chấm điểm được. Dữ liệu vốn đúng (43 dòng submitted_late đều có
     homework_submitted_time + graded_at + score; 46 dòng missing thì không có gì) - lỗi ở HIỂN THỊ.
     Bộ hàm chuẩn DUY NHẤT: `hwSubmitted` · `hwLate` · `hwMissing` · `hwWaiting` · `hwLateDays`
     · `hwChip` (nhãn "Đã nộp · trễ N ngày" / "Đã nộp đúng hạn" / "Chưa nộp" / "Đã giao · chờ nộp").
     Đã áp cho: nhật ký buổi học, drawer xem bài, trang Bài tập (thu + chấm), bảng bài tập 360,
     hồ sơ GV, tiến độ + khuyến nghị trang HV, SLA chấm bài, roleTasks.
     LUẬT: bài ĐÃ NỘP thì luôn kèm thời điểm nộp + link xem bài, kể cả nộp trễ.
     **BẪY ÂM THẦM ĐÃ VÁ**: nhiều chỗ kiểm `isc(status,"submitted")` và `isc(status,"graded")` -
     hai mã này KHÔNG TỒN TẠI trong enum_homework_status (chỉ có not_assigned/assigned/
     submitted_on_time/submitted_late/missing; "đã chấm" nhận biết qua graded_at||homework_score).
     Điều kiện luôn false, app chạy đúng chỉ nhờ vế dự phòng `x.homework_submitted_time` phía sau.
     Khi kiểm enum PHẢI đối chiếu danh mục thật, đừng đoán tên mã.
     **8 NHÓM QUY TẮC KIỂM** (chạy lại mỗi khi đụng dữ liệu demo): final_fee=total-CK ·
     remaining=final-paid · paid=tổng DL07 · không đóng thừa · status khớp tiến độ mọi khóa ·
     mốc thời gian đúng trình tự lead→test→ĐK→xếp lớp→buổi đầu→kết thúc · lớp khớp khóa của ĐK ·
     quota WOW = số buổi đã dạy/vắng.
     (d) NHẬT KÝ WOW: booking_date -> wow_session_date, wow_booked_by, staff_name,
         wow_content_focus (trước buổi) vs wow_content_note (sau buổi), wow_outcome
         (improved/no_change/needs_more) = "tình trạng trước và sau", quota_deducted.
   - **KỊCH BẢN KIỂM LOGIC** (chạy sau mỗi đợt sửa, xem _logic.js): (1) hồ sơ không có việc kế
     tiếp ngoài alumni, (2) KPI tỷ lệ ngoài 0-100%, (3) trang tác vụ thiếu bộ lọc/hành động,
     (4) trang tác vụ thiếu dải tổng hợp, (5) nhánh rẽ thiếu lối thoát, (6) trang thiếu hàm
     render, (7) trang list thiếu LISTCFG, (8) icon dùng mà thiếu trong font subset.
   - **BẪY FONT ICON**: `ti-columns` (nút "Cột" ẩn/hiện cột) chưa có trong bộ subset 108 icon nên
     lâu nay nút đó mất icon. Script dựng font KHÔNG được lưu lại - đã dựng lại thủ công:
     đọc `.ti-<tên>:before{content:"\eXXX"}` từ node_modules/@tabler/icons-webfont/tabler-icons.css
     -> uni.txt -> pyftsubset ttf --flavor=woff2 --no-layout-closure --drop-tables+=GSUB,GPOS,GDEF
     -> base64 nhúng vào tabler_inline.css (V7.8: 112 icon). LUẬT: mỗi lần thêm icon `ti-*` mới,
     hoặc BỎ hide:1 cho trang có icon lạ, PHẢI dựng lại subset rồi mới sinh app.
     Quét tên icon bằng CẢ HAI mẫu: `ti ti-<ten>` và `"ti-<ten>"` (mảng cấu hình), nếu không
     sẽ sót icon khai báo trong mảng. Lệnh đã chạy được lưu ở outputs/iconbuild/.
   - Cân nhắc thêm lớp PIN/xác thực khi dùng chính thức. Còn lại: sort/nhật ký thao tác,
     xuất file báo cáo, thêm/sửa enum ngay trên Cài đặt (hiện chỉ xem).
3. Sau 2-4 tuần vận hành thật: thu danh sách "vấp thật" của đội -> tinh chỉnh theo đau
  điểm thật (đã thống nhất KHÔNG tổ chức lại toàn diện khi chưa có dữ liệu sử dụng).

## 3bis. V9.3 — Loạt feedback nhanh (16/17/12/14/13/6)
- **Bộ lọc tuỳ biến `window.QF` (khác lọc enum)**: một số điều kiện lọc là TÍNH TOÁN chứ không phải
  một giá trị enum trong cột (vd "Nguy cơ" = at_risk|off_track ở CẢ hai cột chuyên cần/học thuật).
  Đã thêm `cfg.qf=[[key,nhãn,hàm]]` trong LISTCFG; `renderList` áp SAU lọc enum; render chip segmented;
  `qfToggle(key,k)` bật/tắt, `clearFilt` dọn cả `window.QF[key]`. Điều hướng vào danh sách kèm lọc = `goRisk()`.
- **QUYẾT ĐỊNH: bỏ trang "Học viên nguy cơ" riêng** — gộp thành 1 chip lọc trong Học viên. Lý do: danh sách
  phục vụ hành trình, không đẻ trang trùng. Mọi tham chiếu cũ (`go('nguyco')`) đã chuyển sang `goRisk()`.
  BẪY đã tránh: `go('nguyco')` bị escape 2 kiểu (thường + trong chuỗi HTML `onclick=\'go(\'nguyco\')\'`),
  phải grep cả 2 dạng — sót 1 chỗ ở dòng report, sửa bằng Edit tay.
- **QUYẾT ĐỊNH: "Khóa học" là CẤU HÌNH, không phải tra cứu** — chuyển vào tab trong Cài đặt (chỉ hiển thị
  bảng danh mục + nút mở list đầy đủ để thêm/sửa). KHÔNG nhúng `renderList('khoahoc')` trực tiếp vào tab
  Cài đặt: các thao tác search/phân trang trong list gọi `rlist('khoahoc')` sẽ GHI ĐÈ cả `#content` =
  thổi bay trang Cài đặt (đúng bẫy host-blowaway đã gặp). Nên chỉ render bảng tĩnh + nút `go('khoahoc')`.
- **`openStuQuick` (bấm tên HV) & guidebox lead (`leadDetail`)** đọc `jInfo(pid)` cho "việc nên làm + SLA".
  Bọc `try/catch` vì jInfo có thể ném với hồ sơ thiếu liên kết. Nút hành động = `runStart(pid)` (đẩy vào
  quy trình — cùng engine hành trình cho cả lead & HV, kể cả nhánh phục hồi nguy cơ).
- Không thêm icon mới ⇒ không dựng lại font (đã kiểm: 124 icon, thiếu 0).

## 3ter. V9.4 — Tinh chỉnh UX/UI + bẫy đụng tên class CSS
- **BẪY LỚN ĐÃ VÁ — hai component khác nhau CÙNG tên class `.jstep`**: `jStepper` (thanh bước lớn)
  dùng `.jstep` làm KHUNG (có border/padding/margin/overflow), còn `journeyHTML` dùng `.jstep` làm
  từng BƯỚC bên trong `.jline`. CSS trộn lẫn → mỗi bước bị viền + padding = nhìn thành "block rời rạc".
  Cách sửa: đổi hẳn tên class của journeyHTML (`.jline/.jlstep/.jldot/.jlt/.jlc`), không đụng `.jstep`.
  BÀI HỌC: đặt tên class phải soi trùng lặp trước; component con/khung không được xài chung tên.
- **`act` của JSTAGE là object `{lb,ic,fn,arg}`** — muốn hiện chữ phải lấy `.act.lb` (không in cả object
  ra ""[object Object]""). `.why` là câu giải thích ngắn dùng cho hộp hướng dẫn.
- **QUY TẮC UX: bấm tên = XEM (drawer), hành động = NÚT.** Không cho click tên nhảy thẳng vào chạy
  quy trình / vận hành lớp. `openQuick(pid)` tự nhận HV (DL09) hay lead (DL02) để mở đúng drawer;
  drawer nào cũng có nút để đi tiếp. Áp cho: Trang bắt đầu, Hành trình (thẻ), danh sách Lớp (tên lớp).
- **`.btn{white-space:nowrap;flex-shrink:0}`**: chữ trong nút không được xuống hàng (vỡ UI). Muốn nhiều
  nút xuống dòng thì để container `flex-wrap:wrap` (đã có ở `.obact`, `.dact`), KHÔNG để nút tự vỡ chữ.
- **Font icon**: thêm icon mới (`ti-arrow-down`) phải DỰNG LẠI cả 2 phần trong `tabler_inline.css`:
  (1) payload woff2 base64 VÀ (2) rule `.ti-<name>:before{content}`. Chỉ thay woff2 mà quên rule =
  glyph có trong font nhưng CSS không trỏ tới → vẫn "thiếu". pyftsubset phải `--drop-tables+=GSUB,GPOS,GDEF`
  (font Tabler có bảng ligature lỗi làm subset chết nếu không bỏ).

## 3quater. V9.5 — Ba HUB lớn (Tuyển sinh / CSKH / Học tập) + đường ống nhúng
- **MẪU HUB CHUẨN (đã dùng cho banglop, nay cho tuyển sinh/cskh/hoctap)**: 1 trang custom + biến TAB
  (window.TSTAB/CSTAB/HTTAB) + `segHTML(tab,...,"xTabSet('{k}')")`; thân tab GỌI THẲNG render con với cờ
  `embed` (bỏ pageHead). KHÔNG tạo trang mới cho từng bước — nhúng lại trang cũ để không mất chức năng.
- **ĐƯỜNG ỐNG NHÚNG (đắt giá, đừng phá)**: `filterBar`, `rlist`, `pageGo` phải re-render theo **CUR**
  (trang đang hiển thị) chứ KHÔNG theo tên trang cố định. Vì khi trang con nằm trong hub, CUR=hub; nếu
  re-render theo tên trang con sẽ ghi đè #content = thổi bay hub. `renderList(key,emb)` bỏ phead khi nhúng.
- **CHUYỂN HƯỚNG TẬP TRUNG Ở `go()`**: 3 bảng map (TSMAP/CSMAP/HTMAP) đổi key trang con -> hub+tab NGAY
  đầu go(). Nhờ vậy MỌI lời gọi `go('test')/go('khieunai')/go('wow')...` cũ vẫn tới đúng chỗ, không phải
  sửa từng call-site (có cả dạng nháy đơn lẫn nháy kép trong code). Trang con vẫn nằm trong PAGES (hide:1)
  để reRender/renderList còn tra được.
- **QUYẾT ĐỊNH menu**: mỗi chặng giờ là MỘT cửa vào (hub). Ẩn (không xoá) các trang con. Giữ **Vận hành lớp**
  riêng vì là thao tác sâu theo-lớp (khác scope với hub Học tập cross-lớp). Đưa "Lớp" từ Tra cứu vào tab
  Lớp học của hub Học tập (Tra cứu còn Học viên · Giảng viên).
- **stepBar**: nhớ `.stpc` là đường nối GIỮA các bước (chèn giữa 2 `.stp`), `.steps{flex-wrap:nowrap;overflow-x:auto}`
  để luôn 1 dòng, không rớt hàng thành block.
- **2 CHIỀU CSKH**: TT→HV = khảo sát (HV trả lời ở portal, DL15); HV→TT = góp ý (DL16) + khiếu nại (DL17),
  HV gửi từ portal (s-gopy) và XEM ĐƯỢC trạng thái + phản hồi. Không tách rời hai chiều thành 2 nơi mơ hồ.

## 3terdecies. V9.14 — Đợt 6 (UX + báo cáo) + Đợt 7 (cổng học viên)
ĐỢT 6:
- **FB-3 autocomplete**: acSearch(q) (bỏ dấu, ≤8 kết quả HV+Lead, lead converted bị loại tránh trùng) +
  acBoxHTML → dropdown dưới ô tìm hero (id=bwac, position absolute trong .bwsearch), bấm = openQuick.
- **FB-15**: danh sách Học viên thêm 2 select "Mọi lớp"/"Mọi khóa" (window.HVFCLS/HVFCRS, lọc qua DL08/DL06);
  clearFilt dọn cả 2 (__clearHVF).
- **FB-10**: trang Hành trình ghi rõ CHỈ chặng khách + nút "Sang Học tập & Giảng dạy" (việc lớp không ở đây).
- **UX-19 bảng sắp xếp**: bấm tiêu đề cột (window.SORT[key]={col,dir}, so pvnd → số → localeCompare vi) +
  select 20/50/100 dòng/trang (window.PSZ[key]). **UX-20**: cột money căn phải tabular-nums. **UX-16**: bảng
  rỗng phân biệt "khớp bộ lọc" (kèm nút Xóa lọc) vs "bảng trống". **UX-21**: toast(m,ms,kind) + toastErr đỏ 6s
  - markRow lỗi SVR nói rõ "dữ liệu chưa ghi, thử lại". **UX-22**: Esc đóng drawer/confirm; drawer role=dialog.
  **UX-23**: pageHead BỎ tiêu đề (topbar #pgTitle đã có) - chỉ còn mô tả + nút (LƯU Ý: test nào tìm tiêu đề
  trong output render phải đổi sang tìm mô tả). **UX-30**: quét nhãn Anh-Việt. **UX-05**: hết weight 650/750.
- **CRM-08**: bảng "Hiệu quả theo NGUỒN lead" (srcPerfSection: lead→test→ĐK→CVR→doanh thu, sort theo doanh thu)
  + **CRM-09** bộ chọn kỳ window.REPKY (tháng này/30/90/toàn kỳ - hiện áp cho bảng nguồn qua repRange/inRep).
- **CRM-17**: markRow ghi updated_by/updated_at vào bản ghi (offline; SVR không gửi vì sheet chưa có cột).
- **CRM-21**: MSGKH 4 mẫu tin GỬI KHÁCH (test/info/phi/taidk, không dấu cho Zalo) + zaloBtn() - đã gắn ở
  payForm (nhắc phí), testRebook (xác nhận lịch), ktFollow (mời tái ĐK). **CRM-22**: khối "Công giảng dạy
  theo tháng" trong hồ sơ GV (buổi completed theo tháng x lớp + đếm trễ, 6 tháng gần nhất).
ĐỢT 7 (cổng học viên):
- Hero: dòng "Buổi học tiếp theo: <ngày giờ> · GV" + 2 nút tắt "Lịch sắp tới"/"Góp ý" (trắng mờ trên nền navy).
- HVSEC: "Sắp tới" lên vị trí 2 trong MỤC LỤC (khối nội dung giữ chỗ cũ - hero + mục lục + nút tắt đã dẫn
  1 chạm; dời cả khối code để phiên sau cân nhắc khi đụng vùng đó). "Gửi phụ huynh" thêm cuối mục lục.
- **Khối "GỬI PHỤ HUYNH"** (HOC-20): tóm tắt THÁNG hiện tại (đi học x/y buổi theo lớp, nộp bài, điểm giữa khóa
  nếu có, nhận xét GV gần nhất, hotline) dạng text không dấu + nút Copy dán Zalo.
- UX-37: chữ "quota" giải thích lần đầu thành "số buổi kèm riêng 1-1 (WOW) có sẵn theo khóa".
CÒN LẠI CHỜ TỔNG KIỂM (chưa làm, có chủ ý): UX-39 nhúng Montserrat offline; UX-12 8 chỗ bộ lọc kiểu cũ;
  UX-13 hợp nhất 6 kiểu ô số; UX-06 quét hex→token toàn cục; CRM-09 áp kỳ vào cả phễu/bizSection.
- _check10.js (27 tiêu chí). Tổng bộ kiểm: 298. LƯU Ý: _check1 đã đổi 1 tiêu chí theo UX-23.

## 3duodecies. V9.13 — Đợt 5: điều phối & lịch
- **Tab "Lịch tuần" trong hub Học tập** (renderLichTuan): lưới T2→CN x hàng theo GV (toggle theo lớp),
  gom DL11 buổi + DL14 WOW + DL03 test (hàng riêng "Test đầu vào"); chọn tuần qua window.WKOFF; cột hôm nay
  tô nền; chip bấm mở đúng chỗ (goDD/go wow/go test); chip VIỀN ĐỎ = cùng người 2 mục cách <2h; notebar đỏ
  liệt kê lớp đang mở CHƯA gán main_teacher_id. Chỉ xem, không kéo thả (đúng thiết kế).
- **schedClash(staffId,when)**: helper trùng lịch dùng chung (quét DL11+DL14 cùng người ±2h, bỏ cancelled).
  Cắm vào bhMakeupSave + wowAddSave + wowRescheduleRun: có đụng → confirmRun cho ghi đè CÓ CHỦ Ý.
- **Hủy buổi (bhCancel) thành drawer**: bắt lý do (datalist 5 lý do quen) + ô tích "đã báo học viên" BẮT BUỘC;
  ghi vào notes kèm giờ. **Dạy bù (bhMakeupSave) TẠO BẢN GHI DL11 MỚI** (id SES-BU-xxx, notes "Dạy bù cho
  SES-gốc"), buổi hủy GIỮ NGUYÊN cancelled + notes "Đã xếp bù: ..." - KPI đếm được buổi hủy/bù; chọn được
  GV DẠY THAY (thao tác đổi GV đầu tiên của app).
- **WOW**: wa_date thành datetime-local + waBusy() hiện lịch bận của GV đã chọn trong NGÀY đó ngay dưới form;
  wowCancel (drawer, bắt lý do) - hủy DO TRUNG TÂM thì HOÀN QUOTA (used-1, remaining+1, quota_deducted=no;
  phân biệt với "HV không đến" KHÔNG hoàn); wowReschedule đổi ngày GIỮ quota. Nút Dời/Hủy trên thẻ WOW.
- **Điểm danh HỌC BÙ**: nút "Bù" (attb mk, xanh dương) trong ddHub - lưu attendance_status=on_time + note
  bắt đầu bằng "Học bù" (KHÔNG thêm enum mới - nhận diện lại qua prefix note; ghi buổi/lớp gốc vào note).
  Chuyên cần vẫn tính có mặt - đúng tinh thần HOC-19.
- _check9.js (22 tiêu chí). Tổng bộ kiểm: 271.

## 3undecies. V9.12 — Đợt 4B: "mỗi học viên / mỗi lead 1 DÒNG" (yêu cầu Luân)
- **CƠ CHẾ**: không refactor 12 trang - thêm class `rows` vào container (`class="obcards rows"`) + một khối CSS
  `.obcards.rows` biến lưới thẻ thành DANH SÁCH HÀNG: tên + dòng info (ellipsis) trái, chip giữa, nút hành động
  phải; stepper + .obm2 ẨN khi thu gọn. BẤM DÒNG (chỗ trống, không phải nút) = toggle class `open` → nở lại
  nguyên thẻ đầy đủ tại chỗ (stepper, lý do, mọi nút phụ). Toggle = MỘT listener delegation ở document
  (bỏ qua click vào button/a/input/select/textarea/label/.qsel).
- 12 trang bật rows: test, tuvan, thanhtoan, xeplop, ketthuc, baoluu, buoihoc (1 dòng/BUỔI), wow, khaosat (2 lưới),
  khieunai, ghinhan. renderHtToday GIỮ dạng thẻ (dashboard 1 GV, ít mục, cần đọc giáo án ngay).
- LUẬT: trang tác vụ mới sau này dùng `class="obcards rows"` là tự có giao diện dòng; nội dung dài đặt trong
  .obm2/.steps để tự ẩn khi thu gọn. Mật độ ~15-20 dòng/màn 13".
- _check8.js (26 tiêu chí: 11 trang có rows + cân div + CSS/toggle trong build). Tổng bộ kiểm: 249.

## 3decies. V9.11 — Đợt 4: khép vòng đời + tiền
- **jStageOf đa khóa**: bản ghi DL18 có next_enrollment_id, HOẶC HV đang có ob lớp KHÁC lớp của DL18 → bỏ qua
  DL18 đó khi xét chặng (HV061 hết kẹt alumni, giờ ra learning theo lớp đang học). Kiểm bằng _check7.
- **Hoàn tiền tính TIỀN THẬT**: refundSuggest(e) so ngày ĐÃ HỌC (từ class_start_date) với 3 mốc CH2
  refundFull/Partial/Reduced_days → gợi ý 100%/refundPartial_percent(70)/refundReduced_percent(50)/0%
  (2 tham số % mới qua APPPARAMS); drawer duyetRefund cho sửa số tiền; CHỐT = ghi 1 dòng DL07 ÂM
  (payment_note "HOÀN TIỀN...") → mọi tổng doanh thu (sum DL07.amount) tự trừ, paid_amount trừ theo,
  payment_status=refunded. Chưa khai giảng/chưa học → 100%.
- **Chặn đóng thừa** ở CẢ paySave lẫn RSTEP pay (amt > còn lại = chặn cứng); tổng đóng dưới
  thresholdDeposit_minimum khi còn nợ → toast cảnh báo mềm sau lưu.
- **Hẹn thu theo đợt**: cột DL06.next_payment_due (nhập ở form thu - ô "Hẹn thu phần còn lại"); CÓ HẸN thì
  rule Thu công nợ chỉ réo TỪ ngày hẹn (đỏ sau 48h), chưa tới hẹn im lặng kể cả nợ lớn; không hẹn thì grace
  7 ngày như cũ. Tab Thanh toán thêm chip "Tới hẹn thu". BẢN SHEETS: thêm cột next_payment_due vào DL06.
- **In ấn**: printEnroll (xác nhận đăng ký - nút trong form thu tiền) cùng khuôn printReceipt.
- **Kết thúc khóa**: ktResult hiện mục tiêu + ktSuggest tự gợi ý đạt/chưa đạt theo Overall vs target (người
  xác nhận); ktResultSave chặn Overall lệch TB 4 kỹ năng >0.5; CHƯA ĐẠT target → tự mở ktMissForm ghi
  next_course_recommendation + phương án ưu đãi (kịch bản cho người gọi tái ĐK). ktGenSave: completion_time
  = class_end_date nếu lớp đã qua ngày kết thúc; markStu GIỮ active khi HV còn lớp khác đang học (vá đúng
  điều kiện V7.4 đã ghi).
- **Bảo lưu có HẠN**: cột DL09.pause_until (nhập ở drawer giữ chân); thẻ bảo lưu hiện hạn + đếm ngược; rule
  "Bảo lưu sắp hết hạn" nhắc trước thresholdPauseRemind_days (14, APPPARAMS mới) và réo đỏ khi quá hạn.
  BẢN SHEETS: thêm cột pause_until vào DL09.
- **Testimonial**: nút "Xin cảm nhận" trên thẻ kết thúc khi ĐẠT mục tiêu (ghi testimonial_given + notes);
  rule "Xin cảm nhận học viên" theo slaTestimonialAsk_days (CH2 có sẵn), cửa sổ 60 ngày.
- **2 rule vòng đời lớp** trong slaItems: lớp in_progress còn ≤ thresholdPreEnd_days(30) ngày → "Chuẩn bị
  kết thúc khóa" (cat CSKH); lớp QUA class_end_date còn HV chưa có DL18 → "Hồ sơ kết thúc khóa" đỏ (cat Học vụ).
- _check7.js (27 tiêu chí). Tổng bộ kiểm: 223.

## 3novies. V9.10 — Đợt 3: học vụ & giảng viên
- **Tab "Hôm nay" trong hub Học tập** (renderHtToday): chọn GV (giáo viên vào cổng tự là mình - ROLESCOPE
  giaovien ctx HTTAB:"today"), 4 ô (buổi dạy/WOW hôm nay, bài chờ chấm, buổi nợ nhận xét), thẻ buổi có
  topic + bài giao + lời dặn từ sesPlan + nút vào điểm danh; bảng chấm/nợ nhận xét có nút đi thẳng.
- **btJumpGrade(cid,title)**: đặt BLCLASS/BTCLASS/BTGRADE/BLTAB rồi go("banglop") - nút "Chấm" ở tab Hôm nay
  + Hồ sơ GV nhảy đúng lớp + đúng bài, hết cảnh GV 9 lớp đảo select.
- **Bảng SỨC KHỎE MỌI LỚP** (renderHtLop thay renderList ở tab Lớp học): clsHealth(c) = ATR/HCR (so ngưỡng
  kpiTh)/HV nguy cơ (join DL08 - nhớ bẫy DL09 không có class_id)/GV trễ/nợ nhận xét; chip lọc "Dưới ngưỡng".
- **Hàng đợi "Gọi hỏi thăm HV vắng"** trong slaItems (cat Học vụ): DL12 no_show KHÔNG PHÉP, buổi trong 4 ngày
  gần, DL12.note trống → việc amber/đỏ theo slaAbsenceCall_hours (CH2 có sẵn, giờ mới dùng). GHI CHÚ vào dòng
  điểm danh = việc tự tắt. Máy nhắc, người quyết cờ - đúng quyết định đã chốt.
- **Điểm danh**: bấm Vắng là ô ghi chú tự bật viền vàng + focus; vắng CÓ PHÉP không lý do thì ddSave CHẶN.
- **Chấm bài**: ô điểm type number 0-9 bước 0.5 (chamLuu validate); bài CHƯA THU mà chấm luôn thì có select
  "nộp đúng hạn/trễ" → ghi đúng submitted_late + is_late + homework_submitted_time (hết bẫy ép on_time).
- **Tab Học viên của Bảng lớp tính THEO LỚP** (lọc DL12 theo session của lớp + DL13 theo class_id) - HV học
  2 khóa không còn trộn số lớp cũ (đồng bộ cách portal đã làm).
- **MOCK GIỮA KHÓA**: nút "Nhập điểm giữa khóa" ở tab Học viên của Vận hành lớp → drawer band L/R/W/S/Overall
  0-9 bước 0.5 → lưu vào DL08 cột mới mid_listening/reading/writing/speaking/overall + mid_test_date
  (offline chạy ngay; BẢN SHEETS PHẢI THÊM 6 CỘT mid_* vào DL08 - cùng loại việc với class_info_sent_at).
  Portal: bandRow thêm cột Giữa khóa đọc từ ob.mid_*, cột "Tăng" so đầu vào với mốc MỚI NHẤT (đầu ra > giữa khóa).
- Bộ kiểm mới `_check6.js` (20 tiêu chí); _check5 cập nhật landing giáo viên = tab Hôm nay. Tổng 196 tiêu chí.

## 3octies. V9.9 — Màn hình theo chức danh (ROLESCOPE)
- **Một bảng khai báo duy nhất `ROLESCOPE`** (9 nhóm: quantri/dieuhanh/tuvan/hocvu/giaovien/wow/ketoan/
  marketing/hotro) + lớp phủ QUẢN LÝ (regex manager|leader: +baocao, tuvan thêm duyet/khối approve-debt/
  tab banggiao) + ngoại lệ hotro (it_→settings; hr_→settings chỉ tab staff). `buildScope(code)` trả scope
  hiệu dụng, `applyScope(sid)` gọi ở gateEnter + demoBoot (sessionStorage giữ người nên reload giữ scope).
- **Điểm chạm duy nhất**: canSee(k) trong go() — 3 trang SENSITIVE (duyet/settings/baocao) chặn nhẹ + nút
  về trang chính; trang thường ngoài phạm vi vẫn mở kèm notebar "chế độ THAM KHẢO" (không sửa từng call-site,
  tránh bẫy go('nguyco') 2 kiểu escape). VIEW_ALWAYS = mọi trang ẩn/hồ sơ 360 — bấm tên luôn xem được.
- **13 khối banlam có KEY** (phần tử [6]: appt/new/contacted/test_grading/test_done/enrolled/paid/onboarding/
  risk/wowq/approve/debt/reup) — scope lọc theo key, ĐỪNG lọc theo chỉ số/nhãn. Khối WOW key "wowq" (tránh
  trùng tên trang wow). Nhóm hotro: banlam bản lite (không khối, không panel Chạy).
- **Chuông/Việc hôm nay/hero đếm qua bellItems()** = slaItems lọc theo scope.bell (cat); bell rỗng → ẩn nút
  chuông. jTasks item có cat (JGRP theo col). KHÔNG sửa slaItems/jTasks gốc — nhiều màn khác đang dùng.
- **Landing theo nhóm**: setRole kết bằng go(SCOPE().land) + ctx đặt TSTAB/HTTAB trước (giáo viên → hub Học tập
  tab Lớp; WOW → tab WOW; kế toán → Tuyển sinh tab Thanh toán; CEO → Báo cáo). Tab gating qua scopeTabs()
  ở renderKhac + renderSettings (tab không được phép thì tự nhảy tab đầu được phép).
- **Harness mới `_check5.js`: 70 tiêu chí x 9 nhóm** (landing render cân div, buildNav, bell đúng cat, ma trận
  cụ thể: tuvan không thấy duyet nhưng leader thấy, HR chỉ còn tab Nhân viên, janitor lite + chuông ẩn...).
  LƯU Ý bảo trì: thêm trang mới phải quyết nó vào pages của nhóm nào (hoặc VIEW_ALWAYS); thêm khối banlam phải
  đặt key; đây là phân quyền GIAO DIỆN (offline không có xác thực — bản .gs sau khóa theo email, dùng lại ROLESCOPE).

## 3septies. V9.8 — Đợt 2: ngày làm việc của sales (đã qua 2 vòng thẩm định)
- **Đã làm** (chi tiết mã VER/UXV trong transcript 27/07): khối+chip "Tới hẹn hôm nay" (q="appt": chỉ các chặng
  trước-học + lost/no_contact/paused; HÔM NAY sắp tăng trước, quá hẹn cũ sau; dòng hiện "hẹn HH:MM"/"trễ hẹn khách");
  "Chỉ khách của tôi" (window.MINEONLY, lọc J.C.owner=staff_id - áp vào MỌI con số banlam, 4 khối toàn-trung-tâm
  làm mờ kèm tooltip); "KPI của tôi" (myKpiHTML, đặt CUỐI trang theo UXV-02); bảng "Hiệu suất đội tư vấn"
  (staffPerfSection + hàng Cả đội) trong Báo cáo; form "Khách mới liên hệ đến" (leadInbound: 1 form = DL02 contacted
  + DL02b inbound, giữ nháp khi mở hồ sơ cũ); chặn trùng SĐT (findDupPhone/phoneKey, cờ __dupOK GẮN THEO SĐT
  ở leadInbound/saveForm DL02/testQuickSave); runReject thành form lý do (REJREASONS) + chip hẹn chăm lại → 
  next_followup_time (Reup sắp theo ngày hẹn); payReceipt sau MỌI lần thu (tin Zalo sửa được + Copy + In phiếu thu
  window.print + nút "Xong - tiếp tục"; tham số mới centerHotline/centerAddress); tvQuick/payQuick dùng ô tìm
  (pkSearch đã bỏ dấu, pqSearch mới); chip hẹn nhanh dtQuickHTML (giờ đã qua tự dời hôm sau); telHTML (tel: + copy);
  "Chia đều lead chưa có NV" (bgSplitOrphans round-robin, ghi view_history).
- **QUYẾT ĐỊNH NGHIỆP VỤ MỚI: cresOK gồm cả "rejected"** - khách từ chối là cuộc NÓI CHUYỆN ĐƯỢC, không phạt
  KPI kết nối của người ghi thật (không thì NV né chọn "từ chối" và mất dữ liệu lý do). failStreak nhờ đó cũng
  reset khi gặp rejected.
- **BẪY ĐÃ VÁ ĐÁNG NHỚ**: (1) J.owner là TÊN (ownerName) còn J.C.owner mới là staff_id - lọc "của tôi" phải dùng
  J.C.owner; (2) cờ chống trùng boolean sẽ "kẹt mở" - phải gắn theo phoneKey(SĐT); (3) "Tới hẹn hôm nay" mà đổ cả
  backlog quá hẹn thì số phồng mất niềm tin - tách "hôm nay (+N quá hẹn cũ)"; (4) hẹn của sales phải TẮT khi khách
  đã vào học - lọc appt theo include-list chặng.
- **MÀN CỔNG V2 (góp ý Luân 27/07)**: 2 bước chức danh (icon + số người, xếp theo ORDER demo) -> tên; nút Quản trị
  primary ở bước 1; cổng HV mặc định 10 hồ sơ giàu dữ liệu nhất (hvRichTop: điểm = DL12+DL13+2xDL14, Demo 1/2/3 ghim
  đầu) + ô tìm mới mở rộng ra 81 HV. window.__gateRole giữ bước đang đứng, gateEnter reset.

## 3quinquies. V9.6 — Đợt 1 kế hoạch hoàn thiện (hội đồng 4 chuyên gia)
- **KẾ HOẠCH TỔNG THỂ = `KE_HOACH_HOAN_THIEN_APP.md`** (cùng thư mục): 7 đợt, mỗi đợt 1 phiên, làm xong
  Luân duyệt mới sang đợt kế. Mã phát hiện (CRM-xx/SAL-xx/UX-xx/HOC-xx) tra trong file đó. Mục "KHÔNG LÀM"
  ở cuối file là thỏa thuận cả 4 chuyên gia — đừng đề xuất lại (Zalo API, lead scoring, kanban kéo thả,
  phân quyền đầy đủ, tự động hóa cờ nguy cơ).
- **Hub "Tính năng khác" (`khac`, FB-21)**: đúng mẫu hub chuẩn — window.KTAB + kcTabSet + KMAP trong go().
  3 trang con baoluu/magioithieu/banggiao nhận cờ `embed` (bỏ pageHead khi nhúng), vẫn nằm PAGES (hide:1).
  Nút hành động của tab (vd "Cấu hình chính sách") đưa lên pageHead của hub theo kiểu renderCskh.
- **BẪY LẶP LẠI - LỌC DL09 THEO CỘT class_id KHÔNG TỒN TẠI** (dính 3 chỗ mới: renderBanglop KPI lớp,
  renderHosoGV, renderHosoKhoa → "HV nguy cơ" luôn = 0 mà không ai nghi): HV thuộc lớp nào PHẢI join qua
  DL08 (student_id→class_id). renderBaoluu cùng loại: đọc s.phone / s.class_id_name (DL09 chỉ có
  phone_number, không có class_id_name). LUẬT: trước khi đọc cột, grep cột đó trong demo_data_big.json.
- **Tham số vá đợt này**: PKEY thêm slaComplaintFirstResponse_hours→slaKN_assignment_hours (SLA_R giờ so
  2h thay vì 4h — thay đổi số KPI có chủ ý, đúng SOP) và slaReenroll_days→slaReenroll_contact_days.
  JSTAGE test_booked → paramOf("slaTestBookedRemind_hours",24) (APPPARAMS mới); paid → slaPLR48_hours (=48,
  trước cắm cứng 24 sai SOP). APPPARAMS thêm slaPayment_hours (naFor NA007 dùng từ lâu mà chưa khai).
- **reRender nay GIỮ scrollTop** (go() vẫn về đầu trang khi đổi trang). Đừng "tối ưu" ngược lại;
  reRenderKeep vẫn giữ để focus ô tìm.
- **.jcard tách đôi**: panel "Hành trình khách hàng" (journeyHTML) đổi sang `.jpanel`; `.jcard` chỉ còn
  là thẻ kanban. Đúng bài học V9.4 về trùng tên class.
- **Trang con nhúng hub: MỌI reRender/reRenderKeep nội bộ phải theo CUR** — đợt này vá banggiao (4 chỗ)
  và magioithieu (1 chỗ) vốn ghi cứng tên trang, nếu giữ nguyên thì bấm lọc trong hub sẽ thổi bay hub.
- **doHandover tách đôi**: doHandover chỉ hỏi confirmRun → doHandoverRun ghi thật (đọc lại checkbox
  sau khi đóng confirm vẫn được vì confirm không reRender).
- Harness `_tall.js` nay đọc HTML qua env `ITTS_OUT` (hết phụ thuộc đường mount phiên cũ).

## 3sexies. V9.7 — Nền demo đa cổng (data file riêng + lưu thật + đồng bộ + reset)
- **Dữ liệu tách file**: gen_v5.py nay ghi thêm `ITTs_data.js` (= `window.ITTS_DATA = {...};`). HTML nạp
  `<script src="ITTs_data.js">` TRƯỚC script chính; `var DATA = window.ITTS_DATA || bản nhúng`. Ưu tiên:
  FILE THẮNG BẢN NHÚNG — thay dữ liệu demo chỉ cần thay ITTs_data.js, không build lại app. Thiếu file
  vẫn chạy (fallback nhúng, mang 1 file đi demo vẫn được). Giao app cho ai thì giao CẢ THƯ MỤC 3 file.
- **BẪY LẮP RÁP**: mốc cắt `_j` trong gen_v5.py đổi thành `'<script src="ITTs_data.js"></script>'`
  (trước là `"<script>\nvar DATA"`). Boot 2 file: `if(!SVR){demoBoot()}` / thay bằng `demoBootHV()`
  cho cổng HV. Sửa vùng boot phải giữ đúng 2 chuỗi này, không assembly gãy.
- **Lưu thật (offline)**: mọi đường ghi đều đi qua reRender/reRenderKeep/go/hvReRender → `persistSoon()`
  (debounce 350ms) → `demoSave()`. demoSave so chuỗi trạng thái với `__base` (mốc chụp SAU deriveAll ở
  lần render đầu) — bấm lọc không đổi dữ liệu thì KHÔNG ghi, nên trạng thái "nguyên bản/đã sửa" đáng tin.
  Key: `ITTS_DEMO_STATE_V1`, kèm `sig` = hash bộ dữ liệu gốc — sinh demo data mới là state cũ tự bị bỏ.
  Bản .gs (SVR) bỏ qua toàn bộ lớp này, vẫn ghi sheet như cũ.
- **Đồng bộ đa cổng**: sự kiện `storage` → `syncApply()` (nạp state mới + deriveAll + reRender + toast).
  Đang mở drawer/form thì KHÔNG áp ngay (tránh mất chữ đang gõ) — closeModal sẽ áp. Sau khi áp phải cập
  nhật `__base` để không echo-write. Cổng khác bấm Reset → key biến mất → tab này tự `location.reload()`.
  localStorage trên `file://` dùng chung origin ở Chrome — DEMO BẰNG CHROME; chắc ăn tuyệt đối thì chạy
  `python3 -m http.server` trong thư mục app.
- **Cổng theo người**: `demoGate()` (app NV — thẻ người gộp theo vai trò + nút Vào nhanh Quản trị) và
  `demoGateHV()` (cổng HV — tìm kiếm + thẻ học viên). Người đã chọn lưu **sessionStorage** (mỗi TAB một
  người — đúng ý demo nhiều cổng cạnh nhau; reload giữ nguyên người). `gateEnter(sid)` set
  `window.GATE_SID` → `setRole()` ưu tiên GATE_SID hơn staffFor — CURSTAFF/myName() đúng người, lời chào
  + "meRole" hiện vai trò thật. Đổi người: bấm ô tên đáy sidebar (NV) / nút "Đổi người" (HV) → xóa
  sessionStorage + reload. HV_SHELL nay có sẵn `<div class="login">` (trước cổng HV không có phần tử này).
- **Cài đặt > tab "Dữ liệu demo"**: nguồn dữ liệu (file/nhúng), trạng thái thay đổi + giờ lưu cuối,
  tình trạng localStorage, nút Reset, hướng dẫn demo 2 cổng từng bước.
- LƯU Ý harness: sessionStorage không có trong harness → mọi truy cập bọc ssGet/ssSet (try/catch);
  `window.addEventListener` phải kiểm typeof trước khi gắn. `_check2.js` (transcript phiên 27/07) là bộ
  kiểm persistence/sync/reset/gate — 34 tiêu chí sau thẩm định.
- **V9.7b — HỘI ĐỒNG THẨM ĐỊNH (kiến trúc offline-first + UX + pre-sales) đã duyệt, các vá chính:**
  (1) `__base` chốt ngay trong demoBoot/demoBootHV — thao tác ĐẦU TIÊN ở cổng HV được lưu (trước bị nuốt).
  (2) syncApply: đọc raw trước — key mất (reset) thì reload NGAY kể cả đang mở form; có thao tác local
  đang chờ debounce thì FLUSH nó thành bản mới nhất rồi RETURN (không áp đè bản remote cũ — last-write-wins
  đúng nghĩa, các cổng tự hội tụ); đang gõ input trong #content thì hoãn 800ms thử lại; sau khi áp gọi
  buildNav() (badge menu Duyệt nhảy số) + vẽ lại màn cổng nếu đang mở.
  (3) demoLoad gặp sig lệch chỉ return false, KHÔNG removeItem — mở nhầm file cũ không phá state các cửa
  sổ đang demo; syncApply sig lệch toast cảnh báo 1 lần.
  (4) demoSave ghi kèm `by` (tên người cổng) — toast sync hiện "(Tên NV)"; lưu thất bại toast cảnh báo 1 lần.
  (5) `demoPing()` + nút "Kiểm tra đồng bộ" (màn cổng + tab demo) — chẩn đoán sync chết bằng 1 cú bấm.
  (6) Gate NV: ô tìm + nút Quản trị lên đầu (primary) + thứ tự vai trò theo ORDER demo + `gateRole()` xử
  lý nhãn ngoặc lồng "sales_staff (NV Tư vấn (EC))" (elabel regex không ăn ngoặc lồng — đừng sửa elabel chung).
  (7) Chuông + slaItems thêm mục "Duyệt chiết khấu" (trước không đếm CK chờ duyệt). (8) Chip "DỮ LIỆU DEMO"
  thường trực trên topbar (chỉ bản offline); title 2 file + favicon 2 màu (đỏ NV / navy HV) phân biệt tab;
  dấu thời gian sinh dữ liệu `DATA.__gen` hiện ở màn cổng. (9) hvPickStu ghi sessionStorage (reload giữ đúng
  hồ sơ đang xem). (10) beforeunload flush demoSave (F5 không mất thao tác <350ms). (11) Tab demo ẩn khi SVR;
  nút Reset disabled khi nguyên bản; generator có assert lắp ráp file HV. `DEMO_CHECKLIST.md` (thư mục gốc)
  là checklist trước giờ demo cho Luân.
  CHƯA LÀM (ghi nhận có chủ ý): phân quyền theo cổng (DEM-07 — demo né bằng kịch bản, làm khi phân quyền
  thật); bizGuard DL06 chặn cứng CK ở form danh sách (DEM-12 — đổi thành cảnh báo mềm ở đợt sau).

## 3quaterdecies. V9.15 — Đợt 8: CHẶNG VÒNG ĐỜI + HỆ NODE 3 TẦNG + DỮ LIỆU DEMO SỐNG (28/07)

Yêu cầu gốc của Luân (27/07, nguyên văn rút gọn): "a đang muốn gôm theo chặng... Tự nhiên em sửa xong,
a ko còn thấy quản lý wow, quản lý test đầu vào ở đâu nữa... Chia từng chặng, mỗi chặng lại có những chặng
nghiệp vụ bên trong. Có những trang con hỗ trợ liệt kê, tổng hợp... thiết kế 1 block nghiệp vụ cần thiết
ở mỗi trang chi tiết... Mấy cái node của anh thay vì thiết kế lại cho hiệu quả, em lại bỏ đi luôn...
tuyển cả tester chuyên nghiệp để thiết kế dữ liệu demo". Hai chuyên gia (IA + tester) ra thiết kế trước, làm theo 6 bước an toàn.

### Quyết định kiến trúc
- **Tầng ARC phủ trên 17 chặng JSTAGE, KHÔNG đổi jStageOf**: `ARCS` (4 chặng C1-C4 có màu riêng),
  `ARCOF` (map 17 chặng -> arc), `ARCRAIL` (ga chính theo dòng chảy), `ARCBRANCH` (ga rẽ nhánh),
  `arcOf(k)`. C1={new..enrolled, nhánh no_contact/lost}, C2={paid,onboarding,learning},
  C3={paused,cancelled}, C4={ending,reenroll,alumni}. _check11 khóa "phủ kín 17, không trùng".
- **1 trang `chang` duy nhất cho cả 4 arc** (đọc `window.ARC`; `goArc(a)`; go() có `ARCMAP` remap
  changA..D -> chang và reset `CHANGK` khi đổi arc). renderChang = pageHead -> **nrail** -> statStrip
  -> **arcJobs** (nghiệp vụ trong chặng, lọc `canSee`) -> **sổ trực** = `chayListHTML(changList(),"changList")`.
- **nrail (node tầng 1)**: ga 44px + badge số hồ sơ (đỏ khi có quá hạn), **%% chuyển đổi giữa ga** tính theo
  reached (tổng hồ sơ ĐÃ TỚI ga i trở đi), ẨN khi reached<5; riêng changC KHÔNG vẽ %% (bảo lưu vs hủy
  là 2 ngả, không phải dòng chảy). Ga rẽ nhánh = HÌNH THOI sau vạch ngăn; ga GHOST 2 đầu bấm sang chặng kề.
  Bấm ga = `changPick(k)` lọc sổ trực (bấm lại bỏ lọc).
- **mstrip (node tầng 2)**: dải hạt 8px `mstrip(k,over)` = nhãn C1..C4 + hạt theo ARCRAIL (mờ=đã qua,
  to=đang đứng, đỏ nhấp nháy msbeat=quá hạn, thoi đỏ=rẽ nhánh), tooltip đủ chữ. Gắn ở: rvqi (sổ trực +
  hàng đợi run preview), jcard (bảng hành trình), tra cứu, và 11 trang dòng-người (test/tuvan/thanhtoan/
  xeplop/wow/khảo sát/phản hồi x2/khiếu nại/kết thúc/bảo lưu). **BẪY HIỆU NĂNG**: trong vòng lặp render
  phải `var MIX=jIndex()` MỘT lần rồi `mstripFor(pid,MIX)` - gọi `jInfo(pid)` trần trong loop là dựng lại index mỗi dòng.
- **sopBlock (node tầng 3 - "block nghiệp vụ cần thiết")**: `sopBlock(J,btns)` 4 dòng chuẩn
  Chặng (chip arc + chip ga + mstrip) / Việc kế (act + why) / Thời hạn (tuổi + SLA + QUÁ HẠN) / Phụ trách,
  kèm cảnh báo thiếu dữ liệu + **câu nhắn chuẩn CH4** (naMsg - config-driven đúng LUẬT). Class giữ alias
  `jnext sopb` nên CSS cũ vẫn ăn. `btns=false` = không vẽ cột nút (dùng ở drawer HV vì nút đã có dưới).
  3 điểm gắn: renderHoso (bộ nút giữ nguyên), openLeadQuick (thay guidebox tự chế), openStuQuick (thay dnote).
- **Menu NAVTREE 2 tầng theo chặng** thay buildNav đọc PAGES.g: 7 nhóm = Làm việc / C1 / C2 / C3 / C4 /
  Điều hành / Tra cứu; nhóm chặng có CHẤM MÀU arc. Mục con của hub đứng THẲNG trong menu (nhaplead, test,
  tuvan, thanhtoan, reup, wow, baoluu, magioithieu, banggiao...) - go() remap vào hub đúng tab nên
  "quản lý WOW / test đầu vào" không bao giờ biến mất nữa. **BẪY**: thêm trang mới = thêm vào NAVTREE
  (PAGES.g không còn điều khiển menu); mục con sáng (on) theo `navCur(k)` so TAB hiện tại.
- **navVis lọc theo OWNER hub** (`NAVSUB` map con->hub): VIEW_ALWAYS chỉ cấp quyền ĐIỀU HƯỚNG, không cấp
  chỗ trên menu; riêng khac còn chặn theo `rs.tabs.khac` (tư vấn thấy mã giới thiệu, không thấy bảo lưu).
  4 mục "Tổng quan chặng" hiện cho MỌI vai trừ nhóm hỗ trợ lite (bản đồ vòng đời ai cũng cần).
  `navIsOpen` mặc định chỉ mở "Làm việc"; go() tự mở nhóm chứa trang (tính từ key GỐC trước remap - key0).
  buildNav cache `__NAVJ=jAll()` 1 lần cho mọi badge (badge chặng = số hồ sơ quá hạn trong arc).
- **Tab "Chăm lại / Reup" trong Tuyển sinh** (TSMAP.reup + PAGES entry ẩn reup): tsReupList = lost +
  no_contact sắp theo hẹn chăm gần nhất, statStrip 3 ô + notebar giải thích "ngưng không phải mất hẳn".
  Phễu tsfun vẽ thêm bước Chăm lại sau mũi tên vòng về. HTMAP thêm `lichtuan`.
- **chayListHTML(list,qfn)**: nhận danh sách ngoài + TÊN HÀM NGUỒN cho nút "Xử lý" xếp hàng đợi
  (mặc định "chayList"). **BẪY**: qfn phải là hàm GLOBAL trả mảng jInfo - trang mới muốn sổ trực riêng
  thì viết hàm nguồn global rồi truyền tên (changList, tsReupList là mẫu).

### Bẫy đã cắn trong phiên (phải nhớ)
- **Ngày-trôi làm demo "bẩn oan" + vỡ _check2**: `autoReturnHandovers()` chạy ở enter() SAU khi demoBoot
  chụp `__base` -> qua đêm hạn bàn giao hết hạn, boot xong data đã khác baseline, chip cam "đang có thay đổi"
  dù chưa ai đụng gì. Fix: demoBoot + demoBootHV chạy `deriveAll(); autoReturnHandovers()` TRƯỚC khi chụp
  `__base` (việc của hệ thống theo thời gian không tính là thay đổi demo). Quy tắc chung: mọi auto-mutation
  lúc boot phải đứng TRƯỚC mốc __base.
- **T-01 tester (blocker duy nhất)**: renderHtToday in `esc(sp.hw)` ra "[object Object]" - sesPlan().hw
  là OBJECT bank bài (DL20). Đúng: `esc(sp.hw.title||"")`. Chỗ khác đều dùng `P.hw.title` - khi thêm chỗ
  hiển thị bài tập, nhớ .title.
- Icon mới (+5: ti-corner-down-left, ti-bulb, ti-briefcase, ti-list-check, ti-calendar-event) = DỰNG LẠI
  font subset (130 icon) - iconbuild/ phải có mặt cạnh gen_v5.py (lấy từ _src).

### Dữ liệu demo đại tu (agent tester-spec, chỉ sửa pipeline - KHÔNG sửa gen_v5/check)
- Tên placeholder "Nguyễn Văn <số>": 620 chuỗi -> **0** (sửa Ở NGUỒN gen_demo.py: lọc tên có chữ số +
  bảng sinh họ/đệm/tên chống trùng; mọi cột *_name dẫn xuất khớp nguồn).
- Lịch TƯƠNG LAI: mọi lớp in_progress còn 5-9 buổi tới (+18 ngày, session_number nối tiếp); HV061/HV065/HV002
  (3 hồ sơ demo màn cổng HV) có buổi trong 1-2 ngày -> hero "buổi kế tiếp" cổng HV sáng; **4/4 GV có buổi HÔM NAY**.
- Trường sống: DL09.pause_until (+37d / +8d sắp hết hạn / -4d vừa quá hạn); DL06.next_payment_due 27 hẹn
  (1 HÔM NAY, 1 quá hạn 1 ngày); **mid_* nằm ở DL08** (midForm/midSave đọc DL08) - điền 39/68 HV đang học.
- Hàng chờ quyết định SỐNG khi mở app: 1 hoàn tiền chờ duyệt, 3 lead trong SLA 15p (tạo 7/14/26 phút trước
  build), 2 vắng không phép 1-2 ngày chưa note, DL19 mã giới thiệu 2 thưởng pending (bảng DL19 MỚI DỰNG
  khớp sổ DL22 - gen_v5 vốn đã đọc rows("DL19")), 2 WOW hôm nay chưa dạy, 3 test hôm nay (1 chờ chấm),
  1 khiếu nại cao đang mở + 1 escalated.
- Chuông: 289 việc (79%% quá hạn) -> **87 việc, 23 quá hạn (26.4%%)** - đóng dứt điểm hồ sơ cũ đúng nghiệp vụ,
  dời mốc hồ sơ mở vào trong hạn, giữ ~23 quá hạn CÓ CHỦ ĐÍCH rải đủ nhóm để demo cảnh báo.
- C-07 (testimonial chỉ khi có điểm cuối khóa), C-08 (DL02b hết mã enum thô trong câu chữ) + các luật mới
  chống tái phát đã nằm trong check_data.py. fixdata/check_data hết hardcode NOW=22/07 và đường dẫn phiên cũ.
- Vá app nhỏ kèm: C-01 "đã đóng -đ" -> vnd(); C-04 xóa openTrangHV chết; C-05 Tra cứu nhanh tìm KHÔNG DẤU
  (vnorm) + theo mã hồ sơ + có mstrip + cắt 40 dòng.

### Kiểm định
- **_check11.js MỚI (68 điểm)**: arc phủ kín / 4 trang chặng render + ray + nghiệp vụ + sổ trực / lọc ga /
  remap changB-reup-lichtuan / tab reup / mstrip 8 trang / NAVTREE 7 nhóm + navVis theo 4 vai + navCur /
  sopBlock 4 dòng + alias + 3 điểm gắn / 37 trang không vỡ. Tổng suite: **_check1..11 = 366 điểm xanh**
  + _tall (37 trang, icon đủ) + node --check 2 file + _tester.js 64 (2 trong đó là bug script tester).
- Hội đồng tổng kiểm cuối: **VẪN HOLD** theo lệnh Luân - chờ yêu cầu mới.

## 3quindecies. Lên GitHub - mô hình 2 repo + demo online (28/07)

Luân chuyển dự án lên GitHub để làm việc trực tiếp và demo bằng link (phiên Claude Code trên máy
Luân thực hiện, phiên Cowork soạn hướng dẫn + CLAUDE.md).

### Mô hình
- **Repo PRIVATE `mittomap/itts-sop`** = CHÍNH thư mục `~/Claude/SOP ITTs` (git init tại chỗ,
  không copy đi đâu - phiên Cowork vẫn làm việc qua cầu nối desktop y như cũ, không biết gì về git).
  Đẩy thay đổi: `./push.sh` ở gốc thư mục. Chứa TOÀN BỘ: tài liệu .md, _src/, 3 file app build.
- **Repo PUBLIC `mittomap/itts-sop-demo`** (bản làm việc: `~/Claude/itts-sop-demo`) = CHỈ bản demo:
  index.html (trang bìa 2 nút) + 3 file app + README. GitHub Pages bật (main/root).
  **URL demo: https://mittomap.github.io/itts-sop-demo/**. Cập nhật demo: `./update.sh` trong repo đó
  (tự chép 3 file mới nhất từ "SOP ITTs" sang, commit, push).
- **`CLAUDE.md` ở gốc repo private**: giao thức cho phiên Claude Code (đọc 00->01->02, luật build/verify,
  luật kết phiên push.sh/update.sh, luật phối hợp). Claude Code TỰ ĐỌC file này khi mở phiên trong thư mục.

### Quy tắc phối hợp 2 loại phiên (QUAN TRỌNG - tránh dẫm chân)
- Git là trọng tài duy nhất. Phiên Claude Code: bắt đầu = git status + pull, kết = commit + push.
- Phiên Cowork (không có git): ghi file vào thư mục như cũ; thay đổi nằm ở trạng thái "chưa commit"
  cho tới khi Luân/phiên Code chạy push.sh - vì vậy kết phiên Cowork PHẢI NHẮC Luân chạy push.sh
  (và update.sh nếu app đổi).
- KHÔNG để 2 phiên cùng sửa app một lúc; ai xong việc thì đẩy ngay cho sạch trạng thái.

### Bẫy
- Demo online: mỗi máy/trình duyệt một bộ localStorage riêng - đồng bộ 2 chiều CHỈ giữa các cửa sổ
  TRÊN CÙNG MỘT MÁY. Đi demo hiệu ứng duyệt 2 chiều = mở 2 cửa sổ cùng máy, không phải 2 máy.
- Pages deploy mất 1-2 phút sau khi push; trình duyệt cache khá lì - xem bản mới phải Cmd+Shift+R.
- 3 file app phải nằm CÙNG CẤP ở gốc repo demo (app đọc ITTs_data.js cạnh nó); thiếu data file
  app vẫn chạy bằng bản nhúng nhưng màn cổng ghi "kèm sẵn trong app" thay vì "bản mới nhất".
- Repo public: tuyệt đối không để lọt tài liệu .md nội bộ / _src sang - update.sh chỉ chép đúng 3 file.

## 3septendecies. V9.16 — Đợt 9: phòng demo 2 máy + cổng HV đúng vai + hồ sơ 360 superset (28/07 chiều)

Yêu cầu Luân (4 điểm, nguyên văn rút gọn): "2 máy khác nhau cũng có thể test cùng 1 phiên... phát sinh
giao dịch có khuyến mãi lớn, cần duyệt, thì máy kia cũng phải nổ" · "App học viên... chờ duyệt gì đó
học viên đâu có cần" · "Hồ sơ học viên ở app quản trị ít thông tin hơn cả app học viên - vô lý" ·
"xem lại toàn bộ các trang ở sidebar còn ổn không".

### Phòng demo 2 máy (kiến trúc - đừng phá)
- Toàn bộ nằm khối "PHÒNG DEMO 2 MÁY" trong gen_v5.py (ngay sau demoPing). Nguyên tắc: KHÔNG chế kênh
  đồng bộ mới - tin từ máy khác đến = setItem(LSKEY) + __pendSync=1 + syncApply() -> đi đúng đường
  "một cửa sổ khác vừa lưu" nên chuông/badge/toast/last-write-wins nguyên vẹn, không thêm nhánh logic.
- Chống dội: cờ window.__fromRoom bao quanh đoạn áp state từ mạng; demoSave và CUỐI syncApply chỉ
  roomCastState() khi KHÔNG phải __fromRoom. Cửa sổ trong phòng = đại diện phát sóng cho CẢ máy
  (cửa sổ khác cùng máy lưu -> storage event -> cửa sổ phòng syncApply -> phát cho các máy kia).
- Reset lan truyền: demoResetRun VÀ nhánh raw==null của syncApply đều roomCast({t:"reset"}) rồi mới
  reload (delay 250ms cho DataChannel kịp gửi). Máy nhận reset: removeItem + reload.
- PeerJS 1.5.4 lazy-load khi bấm nút (cdnjs -> unpkg fallback) - bản offline không đụng nút thì không
  có request mạng nào. Peer id = "itts-demo-"+SEED_SIG+"-"+mã (mã 5 ký tự, bỏ 0/O/1/I/L) -> 2 máy chạy
  KHÁC bộ dữ liệu không vào nhầm phòng nhau; lệch sig có toast báo. Máy tạo phòng = trạm trung chuyển
  (relay cho các khách còn lại); máy đó đóng = phòng tan, khách nhận toastErr. F5 tự nối lại
  (mã + vai lưu sessionStorage; host mất id thì tự hạ xuống vào lại làm khách).
- Gửi NGUYÊN KHỐI state (~2MB JSON) mỗi lần lưu - DataChannel chịu tốt, demo ổn. ĐỪNG tối ưu sớm
  sang diff/nén khi chưa thấy lag thật.
- CHƯA TEST TRÊN 2 MÁY THẬT (phiên cloud không có trình duyệt/WebRTC). Lỗi dự kiến hay gặp: mạng công ty
  chặn WebRTC/UDP -> một máy phát 4G thử lại; dịch vụ PeerJS công cộng chập chờn -> thử lại sau vài phút.

### Cổng HV + hồ sơ 360
- BỎ hẳn khối "Yêu cầu & phê duyệt" + mục s-duyet khỏi HVSEC. Giữ MỖI notebar "Hoàn học phí đang xử lý":
  chỉ hiện khi đăng ký cancelled còn tiền chưa hoàn - dòng DL07 ÂM của luồng hoàn tiền (V9.11) tự làm nó
  biến mất khi hoàn xong, tự nhất quán, không cần cờ mới. "đang đối soát" -> "trung tâm đang xác nhận".
- Hồ sơ 360: window.HSTAB ("in"/"hv"); tab "hv" set window.HVID=C.sid rồi NHÚNG renderTrangHV() và return
  luôn. hvReRender nay chạy được Ở CẢ 2 NGỮ CẢNH: có #hvBody (cổng HV) vẽ như cũ, không có thì
  reRender(CUR) - nhờ vậy mọi nút trong trang HV nhúng (đổi khóa, trả khảo sát, góp ý) chạy trong app NV.
  BẪY: nút mới trong renderTrangHV phải gọi hvReRender(), ĐỪNG gọi reRender('tranghv') (bài học V7.2).
- Bảng "Điểm: vào - giữa - ra" đọc t.skill_* (DL03) / obMain.mid_* (DL08) / ceMain.final_* (DL18).

### Sidebar (rà 28/07 - kết luận GIỮ NGUYÊN)
7 nhóm NAVTREE V9.15 khớp luồng mới (menu này chính Luân duyệt thiết kế ở Đợt 8); tính năng đợt này đều
nằm TRONG trang sẵn có (màn cổng, Cài đặt, hồ sơ 360, cổng HV) - không thêm/bớt mục menu nào.

## 3vicies. V9.20 — MODULE GIAO VIỆC (DL23/DL24) + CẤU HÌNH GIAO DIỆN (28/07 tối)

Hai yêu cầu mới của Luân: (a) trang cấu hình cho đổi logo / tiêu đề / menu và "mấy cái khác";
(b) module giao việc cấp trên-cấp dưới / ngang cấp / nhờ hỗ trợ, có thông báo - tracking - báo cáo,
có bắt buộc và không bắt buộc, **kèm thảo luận theo từng việc cho đỡ trôi**.

### Module giao việc - mô hình nghiệp vụ
- **Quan hệ tổ chức suy từ DL01** (không đẻ bảng mới): `staffLevel` (ceo=3 / *_manager=2 / *_leader=1 /
  nhân viên=0), `staffBoss` (ưu tiên cột reports_to, thiếu thì lấy người cùng department cấp cao hơn,
  cuối cùng rơi về CEO), `staffSubs`. `taskRel(a,b)` quyết định LOẠI gợi ý khi giao:
  cấp trên+cùng phòng (hoặc CEO) -> assign · cùng cấp -> peer · còn lại -> support.
- **3 loại** (TKTYPE): assign (giao xuống, mặc định BẮT BUỘC) · peer (phối hợp) · support (nhờ hỗ trợ).
  **Bắt buộc vs không**: việc bắt buộc KHÔNG có nút Từ chối (chỉ trao đổi báo vướng) và tính vào tỷ lệ
  đúng hạn; việc không bắt buộc được từ chối kèm lý do bắt buộc nhập.
- **Vòng đời**: new -> accepted -> done -> confirmed; rẽ declined / cancelled; người giao có "Trả lại
  làm tiếp" (done -> accepted, xóa done_note để làm lại) và "Nhắc" (tăng remind_count + ghi 1 dòng
  trao đổi). Mọi chuyển trạng thái đều TỰ GHI một dòng vào luồng trao đổi -> lịch sử đọc được như chat.
- **DL24 - trao đổi theo việc** (bảng riêng, đúng luật "mỗi dòng một bản ghi"): hỏi đáp nằm trong việc,
  không trôi như tin nhắn. Drawer chi tiết có khung chat + ô gửi (Enter để gửi).
- **Thông báo**: slaItems thêm cat "Giao việc" nhưng CHỈ việc của chính người đang đăng nhập (khác mọi
  mục SLA khác vốn là toàn trung tâm) - việc mới / chưa bấm nhận quá slaTaskAccept_hours / quá hạn /
  tới hạn hôm nay / chờ tôi xác nhận quá slaTaskConfirm_hours. Nhờ vậy bong bóng việc mới (V9.17) tự
  nổ khi cổng khác giao việc, không phải viết thêm gì. Badge menu = việc tôi phải làm + chờ tôi xác nhận.
- **Cấp quyền một chỗ**: vòng lặp sau ROLESCOPE tự thêm "giaoviec" vào pages và "Giao việc" vào bell của
  MỌI nhóm vai (kể cả hotro lite) - thêm nhóm vai mới sau này không sót.
- **Báo cáo** (tab Tổng hợp): 4 ô tổng + bảng theo người nhận (được giao / đang làm / quá hạn / đã xong /
  trễ hạn / % đúng hạn, ngưỡng màu 90-70) + theo loại việc + so sánh bắt buộc vs không bắt buộc.
- **Quản trị viên (không gắn NV thật) xem TOÀN BỘ** việc để giám sát khi demo (tkScopeMine/tkScopeGiven).
- Dữ liệu mẫu: `_src/seed_giaoviec.py` (bước pipeline MỚI, chạy sau check_data) - 17 việc đủ trạng thái,
  2 việc quá hạn có chủ đích, 3 việc chờ xác nhận, 34 dòng trao đổi; mốc neo theo NGÀY CHẠY.
- BẢN SHEETS sau này: thêm 2 sheet DL23/DL24 + 3 enum (enum_task_type/status/priority đã ghi vào
  DATA.enums) vào CH1; 2 tham số CH2 mới slaTaskAccept_hours (4), slaTaskConfirm_hours (24).

### Cấu hình giao diện & thương hiệu (Cài đặt > 2 tab mới)
- Lưu trong **DATA.config.ui** (không phải localStorage riêng) -> tự đồng bộ đa cổng/đa máy qua room và
  Reset demo đưa về gốc. `UI()` tự vá thiếu khóa từ UIDEF nên bản dữ liệu cũ vẫn chạy.
- Tab **Giao diện & Thương hiệu**: tên trên menu + dòng phụ, tên trung tâm, tiêu đề tab trình duyệt,
  logo (tải ảnh lên -> data URI, hoặc URL, hoặc 1-2 chữ tắt, hoặc logo mặc định), màu chủ đạo + màu nhấn
  (đổi biến CSS --navy/--red, áp ngay), hotline + địa chỉ (đi qua CH2 như cũ), nút Về mặc định.
  Chặn ảnh >250KB (bản demo là 1 file HTML, nhét ảnh to vào localStorage sẽ vỡ).
- Tab **Menu sidebar**: bật/tắt từng nhóm và từng mục, đổi tên nhóm. Lưu vào ui.menu / ui.mlabel và
  buildNav đọc chúng - **KHÔNG sửa NAVTREE gốc**, nên nâng cấp menu sau này không đụng cấu hình người dùng.
  Mục tắt chỉ ẩn khỏi menu, mọi đường dẫn trong app vẫn vào được (không mất chức năng).
- uiApply() gọi ở demoBoot và syncApply -> cổng khác đổi thương hiệu thì cổng này đổi theo.
- _check11 lên **110 điểm** (+19 tiêu chí cho 2 module).

## 3novemdecies. V9.18 — Gộp Trang bắt đầu + Hành trình, node bấm được, Tra cứu mở rộng (28/07 tối)

### Gộp banlam + hanhtrinh (kiến trúc - đừng phá)
- MỘT trang banlam, 2 góc nhìn qua `window.BLVIEW` ("list"/"board") + segmented ngay dưới dải khối.
  View board = `renderHanhtrinh(1)` (embed: bỏ pageHead, thay bằng notebar). KHÔNG fork code bảng chặng.
- `go('hanhtrinh')` remap -> banlam + BLVIEW="board" (đặt cạnh TSMAP trong go()). Mọi call-site cũ sống nguyên.
- jSet/jStage/ô tìm của bảng chặng đổi từ reRender("hanhtrinh") sang **reRender(CUR)/reRenderKeep(CUR)** -
  đúng luật đường ống nhúng (bài học V9.5); quên là bấm lọc trong banlam sẽ thổi bay trang.
- PAGES giữ entry hanhtrinh (PBK còn tra), NAVTREE nhóm Làm việc chỉ còn banlam.

### Node hành trình bấm được
- mstrip(k,over,pid): CÓ pid -> thêm class clk + onclick mstripOpen(pid) (stopPropagation để không đụng
  click của dòng); KHÔNG pid (sopBlock) giữ nguyên tĩnh. mstripFor tự truyền pid; jcard truyền J.C.pid.
- mstripOpen(pid) = drawer 13 mốc JMAIN (tái dùng class hvjr/hvjd của portal): mốc done/now + thời điểm
  (S.since(C)) + chặng thuộc arc nào + nút "việc kế" (runStart) + Xem hồ sơ. Nhánh rẽ có dnote đỏ.
- BẪY BỘ KIỂM: _check11 từng dò cứng chuỗi 'class="mstrip"' -> gãy khi thêm class clk; đã đổi sang dò
  tiền tố 'class="mstrip'. Quy tắc: check dò markup thì dò TIỀN TỐ class, đừng dò cả chuỗi đóng.

### Tra cứu mở rộng (ĐẢO V6.0 có chủ đích - lệnh Luân 28/07)
- Nguyên tắc mới: nhóm TRA CỨU = nơi "muốn xem gì đó dạng danh sách" -> nhiều sổ CHỈ-XEM xếp theo dòng
  nghiệp vụ; trang tác vụ theo chặng vẫn là nơi LÀM VIỆC. V6.0 ("danh sách phục vụ hành trình") vẫn đúng
  cho phần còn lại của menu - chỉ đảo cho nhóm Tra cứu.
- 13 sổ mới: dslienhe(DL02b) dstest(DL03) dstuvan(DL04) dsdangky(=mkRO tuvan/DL06) dsthanhtoan(DL07)
  dsbuoihoc(DL11) dsdiemdanh(DL12) dsbaitap(=mkRO baitap) dswow(=mkRO wow) dsketthuc(=mkRO ketthuc)
  dskhaosat(DL15) dsphanhoi(=mkRO khaosat/DL16) dskhieunai(=mkRO khieunai) + khoahoc + nhanvien vào menu.
  mkRO đã DỰNG LẠI (bị xóa từ V6.0). MỌI cột mới đã đối chiếu demo_data_big.json trước khi khai (luật cũ).
  NHỚ bẫy tên key cũ: LISTCFG.tuvan = DL06 (đăng ký), LISTCFG.khaosat = DL16 (phản hồi).
- Sổ chỉ hiện trên menu với vai có pages="*" (quản trị/điều hành); vai khác giữ menu gọn như cũ.

### Các chỉnh còn lại
- Tab Cài đặt > Dữ liệu demo rút còn 1 panel (trạng thái 1 dòng + Reset + Ngắt room + Kiểm tra đồng bộ) -
  room mặc định tự thông nên hết cần hướng dẫn dài (đã bỏ cả panel "Cách demo hai cổng").
- BỎ khối "Gửi phụ huynh" + mục s-phuhuynh khỏi trang học viên (Luân: ngữ cảnh không hợp).
- Chip trạng thái khóa trên thẻ khóa trang HV: .chip.fill-blue/green/gray (đặc màu) - Đang học xanh dương,
  Đã hoàn thành xanh lá, kết thúc/hủy xám.
- Nhật ký buổi học portal = timeline thật: .hvtl (rail dọc) + .hvtlr (node tròn + nhãn ngày, mờ khi đã qua).
- Badge đếm menu (.navlbl .dot / .navitem .dot) nhỏ lại + flex:none - nhóm thu gọn không bóp chữ.
- _check11 lên **82 điểm** (+14 tiêu chí V9.18: remap, 2 view, mstrip clk/drawer, 13 sổ render, HVSEC, tab demo).

### V9.18b-c - vá theo mắt Luân (cùng tối 28/07)
- Ô tìm hero: dòng gợi ý bwsrchhint bị đặt TRONG hộp tìm trắng (chữ trắng tàng hình + bóp placeholder) -
  đưa ra NGOÀI hộp về đúng thiết kế. BÀI HỌC: phần tử chữ trắng dành cho nền màu thì phải soi nó nằm trong
  hộp nền gì; check dò thứ tự markup đã thêm (83 điểm).
- Dải khối Trang bắt đầu: BỎ 8 khối đếm-theo-chặng (Luân xác nhận thừa - trùng chip lọc "Nhóm" + Bảng chặng
  vừa gộp); GIỮ 5 khối giá trị riêng: Tới hẹn hôm nay / HV nguy cơ / WOW chờ xử lý / CK chờ duyệt / ĐK còn nợ.
  ROLESCOPE.blocks vẫn lọc theo key trên 5 khối còn lại; dải rỗng thì tự ẩn như cũ.
- Cổng học viên: BỎ chip Room demo + nút Reset khỏi sidebar + thanh mobile (học viên không cần công cụ demo);
  màn cổng chọn hồ sơ VẪN giữ (đó là chỗ người demo vận hành trước buổi).

### V9.19 - Sidebar đánh dấu đúng + BREADCRUMB làm lại (Luân, 28/07 tối)
- **Dấu sáng sidebar quá mờ (gốc của "bấm nghiệp vụ không thấy đánh dấu")**: `.navitem.on` dùng nền
  #ffffff1a (10% trắng) trên nền navy - gần như vô hình. Đổi: nền #ffffff2e + viền trái #8CC5F2 +
  inset ring + icon sáng #A8D5F7. LUẬT: mọi trạng thái "đang chọn" trên nền tối phải kiểm tương phản
  thật, đừng tin alpha nhỏ.
- **Hub sáng đè mục con**: navCur(k) trả true ngay khi k===CUR -> đứng ở tab WOW thì CẢ "Học tập &
  Giảng dạy" lẫn "Buổi WOW 1-1" cùng sáng. Thêm `HUBTAB` (map hub -> biến tab -> mục con) + `hubSubKey`:
  hub KHÔNG sáng khi tab đang đứng có mục con riêng trên menu.
  **BẪY ĐÃ CẮN NGAY TRONG PHIÊN**: bản đầu kiểm bằng navVis(sub) -> tab Khảo sát của CSKH có sub
  "khaosat" (navVis=true) nhưng sub đó KHÔNG có mục trên NAVTREE -> hub cskh tắt mà không ai thay =
  MENU KHÔNG CÓ GÌ SÁNG. Phải kiểm `navInTree(sub) && navVis(sub)`. LUẬT: "nhường sáng" chỉ hợp lệ khi
  có người NHẬN - luôn kiểm mục nhận thực sự đứng trên menu.
- **Breadcrumb làm lại = VỆT ĐƯỜNG ĐI THẬT** (thay "Nhóm › Trang" tĩnh): [←] mốc1 › mốc2 › **hiện tại**,
  mỗi mốc bấm nhảy thẳng về (navJump cắt vệt tại điểm nhảy); vệt >4 mốc rút gọn bằng "..."; chưa đi đâu
  thì hiện nhóm menu như cũ. crumbLabel nay nói rõ TAB đang đứng (hub: "Tuyển sinh · Test đầu vào",
  chặng: "Chặng 2 · Đang học", banlam board: "Trang bắt đầu · Bảng chặng").
- **Chống phình vệt**: go() gặp trang ĐÃ có trong NAVHIST thì CẮT vệt tại đó thay vì push thêm - đi vòng
  A>B>A>B không đẻ mốc rác, breadcrumb luôn đọc được như đường đi từ gốc.
- Kiểm định: viết harness mô phỏng bấm ĐỦ 14 nghiệp vụ trong 4 chặng + kiểm vệt/navJump/vòng lặp;
  đã khóa vào _check11 -> **91 điểm**. Cách này (mô phỏng thao tác thật rồi đọc DOM nav) là mẫu nên
  dùng lại cho mọi bug điều hướng - đừng suy luận suông.

## 3octodecies. V9.17 — Room tự động + bong bóng việc mới + vá theo hội đồng 3 tester (28/07 chiều)

Luân chê bản mã phòng V9.16 "phức tạp quá, mặc định phải là kết nối được" -> làm lại + cho 3 tester
(room sync / cổng HV / hồ sơ 360) nhặt sạn, vá hết sạn thật trong cùng phiên.

### Room tự động (thay bản mã phòng - kiến trúc đừng phá)
- Peer id CHUNG: "itts-demo-"+SEED_SIG+"-auto". Máy đầu claim id = TRẠM relay; máy sau dính
  unavailable-id thì vào làm khách; khách mất trạm (close/peer-unavailable) -> nghỉ ngẫu nhiên
  200-1500ms rồi TRANH làm trạm (roomDown/roomAuto). Bám sự kiện "online" để tự nối khi có mạng lại.
- **__roomGen (thế hệ kết nối)**: mọi callback/timer giữ gen lúc sinh ra; gen đổi (toggle, roomDown)
  là tự vô hiệu + destroy peer - chống zombie peer/timer cũ clear cờ của lượt mới (bẫy tester chỉ ra:
  toggle-off giữa lúc đang nối vẫn để room sống ngầm). window.__roomPend giữ peer đang bay để destroy được.
- **last-write-wins theo st.t**: roomRecv so t của bản đến với bản đang giữ - bản CŨ hơn thì bỏ và
  PHÁT LẠI bản mới cho room (ROOM.lastRaw=null rồi roomCastState). Chốt được 2 bẫy: init state cũ của
  trạm đè bản mới của khách vừa rejoin, và 3 máy cùng sửa chia 3 ngả không hội tụ.
- **Reset**: trạm nhận reset thì relay xong CHỜ 300ms (DataChannel kịp đẩy) mới reload; máy đã nguyên bản
  nhận reset thì NUỐT (không reload) - chặn bão reload vòng lặp qua các tab cùng máy.
- **Local-thắng phải phát ra room**: nhánh flush trong syncApply khi chạy trong ngữ cảnh __fromRoom
  phải tạm hạ cờ để roomCastState - không thì máy giữ bản local, máy kia giữ bản remote, lệch vĩnh viễn.
  Lúc boot __base=null thì KHÔNG coi là local-thắng (phải áp bản remote).
- PeerJS re-bắn "open" sau reconnect: handler kiểm ROOM.p===p thì GIỮ conns (không reset mảng - mất relay).
  Conn đóng bị splice khỏi ROOM.conns. Trạm phát sĩ số {t:"n"} cho khách (khách chỉ thấy 1 conn tới trạm).
- roomUiRefresh cập nhật MỌI phần tử .roomChip (text + màu: amber đang dò / blue có máy / gray một mình-ngắt).

### Bong bóng việc mới (notiShow/notiDiff)
- Chụp notiKeys() = bellItems() TRƯỚC khi áp state đồng bộ; SAU khi áp so lại - việc MỚI xuất hiện
  (đúng scope vai trò) nổ thẻ .noti góc phải dưới (z-index 96, không đè toast giữa-dưới), viền đỏ khi
  có sev red, ghi "ai - việc gì", bấm go(page), tự tắt 9s, xếp chồng tối đa 3. Cổng HV không nổ (việc nội bộ).
- LUẬT: key so sánh là grp|who|what - đổi cách sinh chữ trong slaItems là đổi luôn định nghĩa "việc mới".

### Sạn cổng HV + hồ sơ 360 đã vá (nguồn: tester)
- Notebar hoàn phí: thêm điều kiện !refunded (dòng DL07 âm làm tổng vẫn dương nên điều kiện cũ không bao
  giờ tắt) + KHÔNG hứa số tiền (chính sách hoàn 100/70/50/0% - hứa cả khoản đã đóng là hứa sai).
- hvT0() = 0h hôm nay: hero "buổi kế tiếp" + mục Sắp tới so mốc này thay vì Date.now() - buổi/hạn nộp/WOW
  của CHÍNH HÔM NAY không còn bị ẩn (endToday() có sẵn nhưng trang HV đã quên dùng).
- Bỏ khỏi trang học viên: "Bạn đang ở <tên chặng CRM>" (từ vựng vận hành) và "GV vào trễ X phút" (chỉ số
  QA nội bộ - vẫn giữ nguyên ở hồ sơ GV/báo cáo).
- HVSEC xếp lại ĐÚNG thứ tự khối trên trang (bỏ quyết định V9.14 "Sắp tới đứng đầu mục lục" - hero đã có
  nút tắt 1 chạm; scrollspy hết nhảy lộn xộn).
- Hồ sơ 360: bảng điểm vào-giữa-ra lấy Giữa/Ra CÙNG KHÓA (ce lọc theo class của ob chính - không trộn
  đầu ra khóa cũ với giữa khóa mới); v15() giữ điểm 0 (0 là điểm hợp lệ, không rơi thành "-"); HSTAB reset
  về "in" khi mở hồ sơ khác; hvGo có fallback scrollIntoView cho chế độ nhúng (không thì nút mục lục chết lặng).
- Ghi nhận CÓ CHỦ ĐÍCH không sửa: hvSurveyView đổ DL15.notes (đúng thiết kế SVTPL - bộ câu lưu ở notes);
  fallback enrMain/ceMain khi khóa đang chọn thiếu dữ liệu (hiếm, theo dõi thêm).

## 3sedecies. Chuyển sang làm việc tại phiên cloud Claude Code (28/07 chiều)

Luân chuyển hẳn sang làm việc trong MỘT phiên cloud Claude Code (giao việc qua chat), không chạy
lệnh trên máy nữa. Các bước đã làm để phiên cloud đọc/ghi được GitHub:
- Repo private `itts-sop` ĐỔI TÊN thành `tts-sop-structor` + chuyển PUBLIC (Luân chấp nhận công khai
  tài liệu vận hành sau khi được cảnh báo rõ; GitHub tự redirect tên cũ nên remote cũ không hỏng).
- Cài app GitHub **claude** (github.com/apps/claude) cho tài khoản mittomap, All repositories -
  đây là bước mở QUYỀN GHI. Trước khi cài, phiên cloud chỉ ĐỌC được.
- Phiên cloud gắn repo qua add_repo (quyền push), bản làm việc tại /workspace/tts-sop-structor.

Quy trình từ nay:
- Luân giao việc trong chat -> phiên cloud sửa nguồn + build + verify NGAY TRONG PHIÊN
  (có sẵn python3/node) -> tự commit + push repo này -> nếu 3 file app đổi thì chép sang gốc
  `itts-sop-demo` + push (Pages tự deploy 1-2 phút).
- Máy Luân thành BẢN PHỤ: lấy bản mới = `git pull`. Phiên Cowork/local có sửa gì thì push ngay,
  và phiên cloud pull trước khi làm - luật "không để 2 nơi cùng sửa" giữ nguyên.

BẪY đã cắn trong buổi chuyển đổi (nhớ cho lần sau):
- Phiên cloud kết nối repo kiểu mặc định là CHỈ-ĐỌC: mọi đường ghi (git push, contents API,
  issues API) đều 403 "Resource not accessible by integration". KHÔNG có đường vòng - phải cài
  app GitHub claude rồi gắn lại repo với quyền push. Đừng mất công thử lách.
- gh CLI trên máy Luân KHÔNG gọi được API installation của GitHub App (403) - bước cấp quyền app
  phải làm bằng tay trên web (github.com/apps/claude), không script hóa được.
- Luật "repo public không để lọt tài liệu nội bộ" (mục 3quindecies) HẾT HIỆU LỰC với repo dự án
  (đã public theo quyết định của Luân); vẫn GIỮ cho repo demo: gốc `itts-sop-demo` chỉ chứa
  index.html + 3 file app + README + update.sh, không thêm gì khác.

## 4. Nhắc quy trình import cho Luân (khi bàn giao)
Tệp -> Nhập -> Tải lên -> chọn xlsx -> **Thay thế bảng tính** -> (script không mất) ->
chạy menu **ITTs Cong cu > CAI DAT BAN DAU**. Nếu chỉ trục trặc link giữa chừng:
chạy lẻ "Sua lien ket (hyperlink)".
