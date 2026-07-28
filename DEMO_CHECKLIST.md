# CHECKLIST TRƯỚC GIỜ DEMO (app ITTs V9.7b)

Bản này do chuyên gia pre-sales trong hội đồng soạn, đã cập nhật theo các bản vá 27/07.
In ra hoặc mở cạnh máy khi đi demo.

## TRƯỚC BUỔI (ở văn phòng, 10 phút)

- [ ] Chép CẢ THƯ MỤC vào máy demo: `ITTs_WebApp_v5_demo.html` + `ITTs_TrangHocVien_demo.html`
      + `ITTs_data.js`. Không gửi lẻ 1 file HTML qua Zalo/AirDrop (app vẫn chạy nhưng rơi về bộ
      dữ liệu nhúng, có thể cũ hơn - màn cổng sẽ ghi "kèm sẵn trong app" thay vì "bản mới nhất").
- [ ] Máy demo dùng CHROME. Không demo bằng Safari khi mở file trực tiếp.
- [ ] Chắc ăn nhất (mọi trình duyệt): mở Terminal trong thư mục app, chạy
      `python3 -m http.server` rồi vào `http://localhost:8000/ITTs_WebApp_v5_demo.html`.
- [ ] Mở màn cổng, nhìn dòng cuối: phải là "bộ dữ liệu demo bản mới nhất (sinh ...)" và
      chip xanh "nguyên bản". Chip cam "đang có thay đổi" = buổi trước quên reset, bấm Reset ngay.
      Chip đỏ "trình duyệt chặn lưu/đồng bộ" = đổi Chrome hoặc dùng http.server.
- [ ] BẤM "Kiểm tra đồng bộ" (màn cổng): mở 2 cửa sổ, bấm nút ở cửa sổ này, cửa sổ kia phải
      hiện thông báo trong 1-2 giây. Không hiện = đồng bộ chết, chuyển sang cách http.server.
- [ ] Chạy nháp 1 vòng: tạo ĐK chiết khấu 2 triệu bên sales -> duyệt bên quản lý -> xem trang
      học viên Demo 1 -> Reset -> màn cổng phải về "nguyên bản".

## DÀN CỬA SỔ (ngay trước khi khách vào)

- [ ] 3 CỬA SỔ RIÊNG (Cmd+N / Ctrl+N từng cái, không duplicate tab):
      (1) cổng NV Tư vấn, (2) cổng Quản lý / Giám đốc, (3) Trang học viên - chọn "Demo 1"
      (thẻ có nhãn "Hồ sơ demo - dữ liệu đầy đủ").
- [ ] Cửa sổ quản lý ĐỨNG SẴN trang "Duyệt Chiết khấu & Hoàn tiền" (chuông và thẻ sẽ tự nhảy
      số khi bên kia thao tác; đứng trang khác vẫn có toast + chuông đếm, nhưng đứng sẵn là đẹp nhất).
- [ ] Trang học viên cuộn sẵn tới khối "Tiến độ của bạn".
- [ ] Đóng hết form/drawer ở mọi cửa sổ trước khi bắt đầu.

## TRONG BUỔI - LUẬT SỐNG CÒN

- [ ] Thao tác LẦN LƯỢT từng cửa sổ, không hai bên cùng bấm lưu một lúc (bản demo lưu cả khối
      dữ liệu - ai lưu sau thắng; app đã tự bảo vệ thao tác vừa bấm, nhưng đừng thử thách nó).
- [ ] Tạo đăng ký + chiết khấu đi đường "Chạy quy trình" hoặc trang Tư vấn (không sửa qua bảng
      danh sách - bị chặn "trình quản lý duyệt" và kẹt tại chỗ).
- [ ] Không đưa chuột cho khách bấm sang trang "Duyệt" ở cửa sổ sales. Khách hỏi phân quyền:
      "bản demo mở toàn quyền để xem đủ; bản chạy thật khóa theo vai trò".
- [ ] Khách hỏi "dữ liệu thật không?": chỉ vào nhãn "DỮ LIỆU DEMO" cạnh tiêu đề trang.
- [ ] Lỡ F5: bình tĩnh - dữ liệu còn nguyên, vẫn là người cũ, chỉ văng về "Trang bắt đầu";
      bấm lại trang đang demo.
- [ ] Toast "Dữ liệu vừa cập nhật từ cổng khác (Tên NV)" hiện 3 giây - đó là khoảnh khắc
      "wow" của demo, canh nói theo nó.

## CUỐI BUỔI

- [ ] Bấm "Reset dữ liệu demo" (màn cổng hoặc Cài đặt > Dữ liệu demo) - MỌI cửa sổ tự nạp lại
      dữ liệu gốc, kể cả cửa sổ đang mở form.
- [ ] Kiểm 1 cửa sổ bất kỳ: bấm ô tên đáy menu trái -> màn cổng phải ghi "nguyên bản".
- [ ] Đóng hết cửa sổ (lần sau mở lên sẽ vào đúng màn cổng chọn người).
- [ ] Lần sau mở app thấy chip cam "đang có thay đổi demo" = quên reset -> bấm Reset trước khi
      khách nhìn thấy (app cũng tự nhắc bằng thông báo khi mở).
