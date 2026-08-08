/* ═══════════════════════════════════════════════════════════════════════════════════════════
   _v2def.js - ĐỊNH NGHĨA "TRANG NGHIỆP VỤ" CỦA BẢN V2, KHAI MỘT CHỖ

   Anh Luân 08/08: *"E nên sửa lại bộ kiểm, v2 ko phải v1, nó có đặc thù riêng của nó."*

   VÌ SAO TÁCH RA TỆP RIÊNG: `_checkkhuon.js` lấy tập trang nghiệp vụ bằng cách duyệt `HUBTAB` -
   bảng TAB CỦA SÁU HUB BẢN V1. Nó báo *"23 trang nghiệp vụ | thiếu thẻ 0/0"* nghe rất yên tâm,
   trong khi bốn trang nghiệp vụ THẬT đứng trên menu V2 (Học viên, Giảng viên, Bài tập, Nhân sự)
   không hề bị soi - và cả bốn đều thiếu dải thẻ. **Thước báo xanh vì nó đếm sai tập trang.**
   Nay `_checkkhuon` và `_checkv2` cùng đọc bản khai ở đây. Hai bản chép tay của cùng một định
   nghĩa là thứ chắc chắn có ngày lệch - đúng con bệnh mà cả hai thước ấy sinh ra để bắt.

   ĐỊNH NGHĨA (hội đồng chốt 08/08, xem `HOI_DONG_V2_CHOT.md`):
     Trang nghiệp vụ = trang KHÔNG ẨN, ĐỨNG TRÊN MENU, và có người làm việc trên đó mỗi ngày.
   Trang không thuộc diện phải khai kèm LÝ DO ĐỌC ĐƯỢC ở `KHONG_NGHIEP_VU` - im lặng bỏ qua một
   trang là cách một trang biến mất khỏi mọi phép canh.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */

/* Trang đứng trên menu nhưng KHÔNG phải chỗ làm việc trên hồ sơ. */
const KHONG_NGHIEP_VU = {
  settings:  "trang cấu hình của cả trung tâm - không phải chỗ làm việc trên hồ sơ",
  canhan:    "thói quen của một người trên một máy",
  hoidap:    "hộp hỏi đáp - nội dung là câu chữ, không phải hàng chờ đếm được",
  baocao:    "trang chỉ số: nói bằng biểu đồ và ngưỡng KPI, không phải danh sách hồ sơ",
  tracuu:    "cửa gom - nó là mục lục, nội dung nằm ở các sổ bên trong",
  lichtuan:  "lịch tuần là LƯỚI THỜI GIAN, không phải danh sách hồ sơ - con số của nó là ô lịch",
  chang:     "bản đồ một chặng - bốn mục changA..changD cùng trỏ về đây, đổi góc nhìn bằng window.ARC",
  hanhtrinh: "bản đồ toàn hành trình học viên",
  giaoviec:  "hộp việc nội bộ - dải số ở đầu trang dựng theo cách riêng (chỉ hiện khi còn việc)",
};

/* Trang được phép không có mục menu và không có trang cha. */
const DUOC_MO_COI = {
  ban:       "Bàn làm việc của bản V6 đã ngừng phát hành - giữ để link cũ không chết",
  tuyensinh: "hub V1, nay là BÍ DANH: `hubDich` đưa người dùng sang trang nghiệp vụ thật",
  hoctap:    "hub V1, nay là bí danh",
  cskh:      "hub V1, nay là bí danh",
  duyet:     "hub V1 gom bốn hàng chờ - nhịp ngày và Việc hôm nay dẫn tới; bốn hàng chờ con đều đứng trên menu",
  khac:      "hub V1, nay là bí danh",
  hanhtrinh: "bản đồ hành trình - vào từ Bàn làm việc và từ hồ sơ 360",
};

/* Tập trang nghiệp vụ, tính từ TRẠNG THÁI THẬT của app đang nạp (truyền `global` vào).
   Hỏi `navCay()` chứ không hỏi `NAVTREE`: app có hai cây menu (theo chặng / phẳng) và `navCay`
   là hàm trả về cây ĐANG ĐƯỢC VẼ - hỏi nhầm cây là đo một bản không ai nhìn thấy (bẫy đã cắn
   06/08 với bản v6). */
function trangNghiepVu(A) {
  const M = {};
  try { (A.navCay() || []).forEach(G => (G.items || []).forEach(k => { M[k] = G.g })) } catch (e) {}
  return Object.keys(M).filter(k => {
    const p = A.PBK[k];
    return !!p && !p.hide && !KHONG_NGHIEP_VU[k];
  });
}

module.exports = { KHONG_NGHIEP_VU, DUOC_MO_COI, trangNghiepVu };
