#!/usr/bin/env python3
# -*- coding: utf-8 -*-
"""seed_giaoviec.py - sinh bang DL23 (GIAO VIEC) vao demo_data_big.json

Chay SAU mkdemo.py / fixdata.py, TRUOC gen_v5.py:
    python3 seed_giaoviec.py            (doc + ghi demo_data_big.json canh script)

Sinh viec giao mau theo dung quan he to chuc trong DL01 (department + cap bac tu role):
 - assign  : cap tren -> cap duoi (mac dinh BAT BUOC)
 - peer    : ngang cap phoi hop
 - support : nho ho tro (khong bat buoc)
Trai du trang thai (moi giao / da nhan / bao xong / hoan thanh / tu choi), du muc uu tien,
co viec QUA HAN co chu dich va viec CHO XAC NHAN de man hinh demo co viec that de bam.
Moc thoi gian neo theo NGAY CHAY (giong gen_demo) nen demo mo hom nao cung "song".
"""
import json, os, random

SD = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(SD, "demo_data_big.json")
random.seed(2307)  # co dinh de chay lai ra ket qua giong nhau

from datetime import datetime, timedelta
NOW = datetime.now().replace(second=0, microsecond=0)

def fmt(d):
    return d.strftime("%d/%m/%Y %H:%M")

def lvl(role):
    c = str(role or "").split("(")[0].strip()
    if c == "ceo": return 3
    if c.endswith("_manager"): return 2
    if c.endswith("_leader"): return 1
    return 0

def main():
    data = json.load(open(SRC, encoding="utf-8"))
    dl = data["dl"]
    staff = [s for s in dl["DL01"] if "inactive" not in str(s.get("status", "")).lower()]
    by_dep = {}
    for s in staff:
        by_dep.setdefault(s.get("department", ""), []).append(s)

    def boss_of(s):
        """cap tren truc tiep: uu tien reports_to, khong co thi lay nguoi cung phong cap cao hon"""
        rt = str(s.get("reports_to", "")).strip()
        if rt:
            for x in staff:
                if x["staff_id"] == rt: return x
        me = lvl(s.get("role"))
        cands = [x for x in by_dep.get(s.get("department", ""), []) if lvl(x.get("role")) > me]
        cands.sort(key=lambda x: lvl(x.get("role")))
        if cands: return cands[0]
        ceos = [x for x in staff if lvl(x.get("role")) == 3]
        return ceos[0] if ceos else None

    # nguon hồ sơ that de gan viec vao ngu canh (co thi gan, khong co thi thoi)
    students = dl.get("DL09", [])[:60]
    leads = dl.get("DL02", [])[:60]
    classes = dl.get("DL10", [])[:20]

    # Kịch bản việc THẬT của trung tâm - viết bằng giọng người giao việc thật.
    # (title, content, phòng ban, mức ưu tiên, gợi ý vai trò người nhận)
    SCEN = [
        ("Gọi lại nhóm khách chưa kết nối được tuần này",
         "Danh sách khách đã gọi 2 lần chưa gặp. Đổi khung giờ gọi (buổi tối) và nhắn Zalo trước khi gọi.", "Tư vấn", "high", "sales_staff"),
        ("Chăm lại nhóm khách đã ngưng 30 ngày",
         "Nhóm lead đã nguội - gọi lại theo kịch bản chăm lại, ghi kết quả vào hệ thống ngay sau cuộc gọi.", "Tư vấn", "normal", "sales_staff"),
        ("Trực quầy tư vấn sáng thứ Bảy",
         "Nhờ trực quầy tư vấn sáng thứ Bảy một buổi, mình bận lịch họp. Có 3 khách đã hẹn tới xem lớp.", "Tư vấn", "normal", "sales_leader"),
        ("Chốt hồ sơ còn thiếu giấy tờ nhập học",
         "Rà soát các hồ sơ xếp lớp còn thiếu giấy tờ, liên hệ phụ huynh bổ sung trong tuần.", "Học vụ", "normal", "academic_staff"),
        ("Xử lý khiếu nại mức cao còn đang mở",
         "Liên hệ học viên trong hôm nay, ghi phương án xử lý và báo lại trước giờ tan làm.", "Học vụ", "urgent", "academic_staff"),
        ("Kiểm tra lại danh sách lớp sắp khai giảng",
         "Đối chiếu sĩ số, phòng học, giảng viên phụ trách trước khi gửi thông tin lớp cho học viên.", "Học vụ", "high", "academic_manager"),
        ("Tổng hợp phản hồi học viên tháng này",
         "Gom phiếu khảo sát và góp ý, phân loại rồi đề xuất 3 điểm cần cải thiện.", "Học vụ", "normal", "academic_staff"),
        ("Đối soát khoản thu tiền mặt cuối ngày",
         "Đối soát phiếu thu tiền mặt với sổ quỹ, báo lệch (nếu có) trước 18h.", "Kế toán", "high", "accountant"),
        ("Rà soát công nợ học phí quá hạn",
         "Danh sách đăng ký còn nợ quá hạn - gọi nhắc và ghi lại lịch hẹn thu vào hồ sơ.", "Kế toán", "urgent", "accountant"),
        ("Xem giúp số liệu doanh thu trước khi gửi khách",
         "Mình gửi file báo cáo, nhờ xem giúp phần doanh thu có khớp sổ không rồi báo lại.", "Kế toán", "low", "accounting_manager"),
        ("Chuẩn bị đề test đầu vào đợt mới",
         "Rà soát ngân hàng đề, in 20 bộ cho tuần sau, kiểm tra lại file nghe trước khi dùng.", "ACA", "normal", "aca_manager"),
        ("Viết nhận xét các buổi còn thiếu",
         "Các buổi đã dạy nhưng chưa ghi nhận xét - hoàn thành để học viên và phụ huynh theo dõi được.", "ACA", "high", "teacher"),
        ("Dạy thay buổi tối thứ Năm tuần này",
         "Nhờ đứng lớp thay một buổi tối thứ Năm, giáo án và bài tập mình đã soạn sẵn trong hệ thống.", "ACA", "high", "teacher"),
        ("Xếp buổi WOW cho học viên yếu Speaking",
         "Lọc học viên điểm Speaking thấp, xếp buổi kèm riêng 1-1 trong 2 tuần tới.", "ACA", "normal", "wow_coach"),
        ("Cập nhật giáo án khóa 6.5 theo góp ý giảng viên",
         "Bổ sung phần Writing Task 2 vào buổi 8 đến buổi 10 theo đề xuất của tổ chuyên môn.", "ACA", "normal", "aca_manager"),
        ("Sắp xếp lại kho tài liệu học thuật",
         "Gom tài liệu trên Drive theo khóa, đặt tên thống nhất để ai cũng tìm được.", "ACA", "low", "teacher"),
        ("Kiểm tra thiết bị phòng học trước khai giảng",
         "Máy chiếu, loa, điều hòa các phòng - báo IT nếu cần sửa, xong trước ngày khai giảng.", "Cơ sở vật chất", "normal", "janitor"),
        ("Rà soát lối thoát hiểm và bình chữa cháy",
         "Kiểm tra hạn bình chữa cháy, lối thoát hiểm không bị chắn, chụp ảnh gửi lại.", "Cơ sở vật chất", "high", "security"),
        ("Đăng bài tuyển sinh khóa mới lên fanpage",
         "Bài giới thiệu khóa khai giảng tháng tới, kèm ưu đãi đăng ký sớm và nút nhắn tin.", "Marketing", "normal", "marketing_staff"),
        ("Dựng lại bộ ảnh lớp học cho trang tuyển sinh",
         "Chụp bổ sung 10 ảnh lớp đang học, xin phép học viên trước khi chụp.", "Marketing", "low", "marketing_staff"),
        ("Sao lưu dữ liệu hệ thống tuần này",
         "Chạy sao lưu bảng dữ liệu vận hành, kiểm tra file khôi phục mở được rồi báo lại.", "IT", "high", "it_staff"),
        ("Cấp tài khoản cho 2 giảng viên mới",
         "Tạo tài khoản, gán đúng quyền theo chức danh, gửi hướng dẫn đăng nhập cho hai bạn.", "IT", "normal", "it_staff"),
        ("Chuẩn bị hợp đồng cho giảng viên mới",
         "Soạn hợp đồng theo mẫu, hẹn ký trong tuần, lưu bản mềm vào hồ sơ nhân sự.", "Nhân sự", "normal", "hr_leader"),
        ("Tổng hợp bảng công tháng cho khối giảng dạy",
         "Cộng buổi dạy chính, buổi WOW và buổi dạy thay, đối chiếu với giáo vụ trước khi chốt.", "Nhân sự", "high", "hr_manager"),
        ("Chuẩn bị báo cáo kết quả tháng cho họp giao ban",
         "Số liệu tuyển sinh, doanh thu, chuyên cần - gửi trước cuộc họp 1 ngày.", "Ban Giám đốc", "high", "ceo"),
    ]

    rows = []
    n = 0

    def add(assigner, assignee, scen, ttype, status, req, due_off_h, created_off_h,
            related=None, decline=None, done_note=None, confirm_note=None):
        nonlocal n
        n += 1
        created = NOW + timedelta(hours=created_off_h)
        due = NOW + timedelta(hours=due_off_h)
        r = {
            "task_id": "TASK-%04d" % n,
            "created_time": fmt(created),
            "assigner_id": assigner["staff_id"],
            "assigner_id_name": assigner["full_name"],
            "assignee_id": assignee["staff_id"],
            "assignee_id_name": assignee["full_name"],
            "task_type": {"assign": "assign (Giao việc)", "peer": "peer (Phối hợp ngang cấp)",
                          "support": "support (Nhờ hỗ trợ)"}[ttype],
            "priority": {"low": "low (Thấp)", "normal": "normal (Bình thường)",
                         "high": "high (Cao)", "urgent": "urgent (Gấp)"}[scen[3]],
            "required": "Có" if req else "Không",
            "title": scen[0],
            "content": scen[1],
            "related_type": "", "related_id": "", "related_name": "",
            # QUYỀN TẠM theo việc: việc dính hồ sơ học viên thì người nhận phải được mở quyền,
            # nhưng quyền phải CÓ HẠN và tự thu hồi - xem mục quyền tạm bên dưới.
            "perm_level": "", "perm_until": "", "perm_revoked_at": "", "perm_note": "",
            "due_time": fmt(due),
            "task_status": {"new": "new (Mới giao)", "accepted": "accepted (Đã nhận)",
                            "done": "done (Báo xong)", "confirmed": "confirmed (Hoàn thành)",
                            "declined": "declined (Từ chối)", "cancelled": "cancelled (Đã hủy)"}[status],
            "accepted_time": "", "done_time": "", "done_note": "",
            "confirm_time": "", "confirm_note": "", "decline_reason": "",
            "remind_count": "", "remind_last": "",
        }
        if related:
            r["related_type"], r["related_id"], r["related_name"] = related
        if status in ("accepted", "done", "confirmed"):
            r["accepted_time"] = fmt(created + timedelta(hours=random.choice([1, 2, 3, 5])))
        if status in ("done", "confirmed"):
            r["done_time"] = fmt(min(NOW - timedelta(hours=1), due - timedelta(hours=random.choice([1, 4, 8]))))
            r["done_note"] = done_note or "Đã hoàn thành theo yêu cầu, chi tiết ghi trong hệ thống."
        if status == "confirmed":
            r["confirm_time"] = fmt(NOW - timedelta(hours=random.choice([1, 2, 6])))
            r["confirm_note"] = confirm_note or "Đã kiểm tra, đạt yêu cầu."
        if status == "declined":
            r["decline_reason"] = decline or "Đang bận việc gấp khác, xin chuyển người khác hỗ trợ."
        # ĐÁNH DẤU CHỦ ĐÍCH: việc quá hạn mà chưa xong là kịch bản "cảnh báo đỏ" của màn Giao việc,
        # không phải dữ liệu hỏng. Điền luôn số lần nhắc để màn nhắc việc có nội dung thật.
        if status in ("new", "accepted") and due < NOW:
            r["remind_count"] = "1"
            r["remind_last"] = fmt(NOW - timedelta(hours=1))
        rows.append(r)
        return r

    def pick_related():
        c = random.random()
        if c < 0.35 and students:
            s = random.choice(students)
            return ("student", s.get("student_id", ""), s.get("full_name", ""))
        if c < 0.55 and leads:
            l = random.choice(leads)
            return ("lead", l.get("lead_id", ""), l.get("full_name", ""))
        if c < 0.70 and classes:
            cl = random.choice(classes)
            return ("class", cl.get("class_id", ""), cl.get("class_name", ""))
        return None

    def role_of(s):
        return str(s.get("role") or "").split("(")[0].strip()

    # ---- 1. GIAO XUỐNG (cấp trên -> cấp dưới), phần lớn BẮT BUỘC ----
    # Trước đây chỉ bốc ngẫu nhiên 10 nhân viên cấp 0 nên nhiều phòng ban / chức danh không bao
    # giờ xuất hiện trong demo. Nay DUYỆT ĐỦ mọi phòng ban, mỗi phòng ít nhất một việc, và ưu
    # tiên đúng chức danh mà kịch bản nhắm tới.
    plan_down = [
        ("new", True, 20, -2),          # mới giao, còn hạn
        ("new", True, -6, -30),         # QUÁ HẠN chưa nhận -> đỏ
        ("accepted", True, 30, -26),    # đang làm
        ("accepted", True, -3, -50),    # QUÁ HẠN đang làm -> đỏ
        ("done", True, 12, -48),        # báo xong, CHỜ CẤP TRÊN XÁC NHẬN
        ("confirmed", True, -20, -96),  # đã hoàn thành đúng hạn
        ("accepted", True, 6, -10),     # sắp đến hạn
        ("new", True, 48, -1),
        ("done", True, 30, -40),        # chờ xác nhận (2)
        ("confirmed", True, -10, -80),
        ("accepted", True, 54, -8), ("new", True, 26, -5), ("confirmed", True, -30, -110),
        ("accepted", True, 18, -14), ("done", True, 40, -34), ("new", True, 72, -6),
        ("accepted", True, 44, -22), ("confirmed", True, -40, -130),
    ]
    DEPTS = ["Tư vấn", "Học vụ", "Kế toán", "ACA", "Cơ sở vật chất", "Marketing", "IT",
             "Nhân sự", "Ban Giám đốc"]
    used_assignee = set()
    k = 0
    for dep in DEPTS:
        pool = [x for x in SCEN if x[2] == dep] or SCEN
        for scen in pool:
            cands = [x for x in by_dep.get(dep, []) if role_of(x) == scen[4]] \
                    or [x for x in by_dep.get(dep, []) if lvl(x.get("role")) == 0] \
                    or by_dep.get(dep, [])
            who = next((x for x in cands if x["staff_id"] not in used_assignee), cands[0] if cands else None)
            if not who:
                continue
            bs = boss_of(who)
            if not bs or bs["staff_id"] == who["staff_id"]:
                continue
            used_assignee.add(who["staff_id"])
            st, req, due_h, cr_h = plan_down[k % len(plan_down)]
            k += 1
            add(bs, who, scen, "assign", st, req, due_h, cr_h, related=pick_related())

    # ---- 2. NGANG CẤP (phối hợp) ----
    peers = {}
    for s in staff:
        peers.setdefault(lvl(s.get("role")), []).append(s)
    plan_peer = [("new", True, 26, -4), ("accepted", False, 40, -20),
                 ("done", True, 20, -44), ("declined", False, 18, -28)]
    for st, req, due_h, cr_h in plan_peer:
        grp = peers.get(0, []) + peers.get(1, [])
        a, b = random.sample(grp, 2) if len(grp) > 2 else (None, None)
        if not a:
            continue
        pool = [x for x in SCEN if x[2] == a.get("department")] or SCEN
        add(a, b, random.choice(pool), "peer", st, req, due_h, cr_h, related=pick_related(),
            decline="Tuần này mình đang chạy chỉ tiêu tuyển sinh, xin hẹn đầu tuần sau.")

    # ---- 3. NHỜ HỖ TRỢ (không bắt buộc, cấp dưới nhờ cấp trên cũng được) ----
    plan_sup = [("new", False, 30, -3), ("accepted", False, 50, -18), ("confirmed", False, -12, -70)]
    for st, req, due_h, cr_h in plan_sup:
        a, b = random.sample(staff, 2)
        pool = [x for x in SCEN if x[3] == "low"] or SCEN
        add(a, b, random.choice(pool), "support", st, req, due_h, cr_h,
            done_note="Đã xem giúp, có ghi chú lại vài điểm cần sửa.")

    # ---- 3bis. YEU CAU DO CHINH HOC VIEN GUI LEN (V9.63) ----
    # Anh Luan mo tab "Yeu cau tu hoc vien" o hub CSKH va thay TRONG - vi du lieu demo khong co
    # dong nao loai student_request. Mot kenh co man hinh ma khong co du lieu thi lúc demo nhin
    # nhu chua lam. Gieo o DAY chu khong sua tay JSON, va gieo theo DUNG luat cua hvReq():
    # nguoi gui la HOC VIEN (assigner = student_id), nguoi nhan chon theo MA VAI TRO - hoc vu lo
    # chuyen hoc, ke toan lo chuyen tien - kem han nhan viec va quyen tam chi-xem.
    YC = [
        ("Em xin nghỉ buổi tối thứ Năm tuần này",
         "Dạ em bị trùng lịch thi ở trường buổi tối thứ Năm, em xin phép nghỉ và xin học bù ạ.",
         "hoc", "normal", "new", -3, 1),
        ("Em muốn đặt thêm một buổi WOW về Speaking",
         "Em thấy phần Speaking Part 2 còn yếu, em muốn xin một buổi kèm riêng trước kỳ thi ạ.",
         "hoc", "normal", "new", -30, -26),
        ("Cho em hỏi lịch học tuần sau có đổi phòng không ạ",
         "Em nghe bạn nói lớp mình chuyển phòng từ tuần sau, em muốn xác nhận lại cho chắc ạ.",
         "hoc", "low", "accepted", -20, 4),
        ("Em đã chuyển khoản đợt 2 học phí",
         "Dạ em vừa chuyển khoản đợt 2, nội dung ghi đúng mã học viên. Nhờ trung tâm xác nhận giúp em ạ.",
         "tien", "high", "accepted", -14, 2),
        ("Em xin xác nhận biên lai đợt 1 để công ty thanh toán",
         "Công ty em cần biên lai có dấu để hoàn tiền học, nhờ trung tâm xuất giúp em ạ.",
         "tien", "normal", "done", -46, -20),
        ("Em muốn đổi sang lớp buổi sáng",
         "Em vừa đổi ca làm nên buổi tối không đi học được nữa, em xin chuyển sang lớp sáng ạ.",
         "hoc", "high", "done", -62, -34),
        ("Cho em xin lại tài liệu buổi 5",
         "Buổi đó em nghỉ nên chưa có tài liệu, nhờ trung tâm gửi lại giúp em ạ.",
         "hoc", "low", "confirmed", -90, -60),
        ("Em hỏi về chứng nhận hoàn thành khóa",
         "Em học xong khóa 6.5 rồi, em muốn xin giấy chứng nhận hoàn thành ạ.",
         "hoc", "normal", "confirmed", -120, -80),
    ]
    def nguoi_nhan(kind):
        want = ["accountant", "accounting_manager"] if kind == "tien" else ["academic_staff", "academic_manager"]
        for rc in want:
            for x in staff:
                if role_of(x) == rc:
                    return x
        return staff[0]

    hv = [x for x in dl.get("DL09", []) if str(x.get("student_id", "")).strip()]
    for i, (tieu, noi, kind, pri, st, created_off, due_off) in enumerate(YC):
        if not hv:
            break
        S = hv[(i * 7) % len(hv)]
        nn = nguoi_nhan(kind)
        r = add({"staff_id": S.get("student_id", ""), "full_name": S.get("full_name", "")},
                nn, (tieu, noi, "", pri, ""), "assign", st, True, due_off, created_off,
                related=("student", S.get("student_id", ""), S.get("full_name", "")),
                done_note="Đã liên hệ và xử lý xong theo yêu cầu của học viên.",
                confirm_note="Học viên xác nhận đã ổn.")
        r["task_type"] = "student_request (Yêu cầu từ học viên)"
        r["perm_level"] = "view (Chỉ xem)"
        r["perm_note"] = "Quyền tạm mở theo yêu cầu của chính học viên."

    # ---- 3bis-b. MỌI BỘ PHẬN ĐỀU PHẢI CÓ VIỆC ĐANG LÀM (V9.66) ----
    # `_checkdemo.js` đóng vai từng nhân viên mở app suốt bảy thứ trong tuần: bộ phận Nhân sự chỉ
    # được chia hai việc và cả hai đều ở trạng thái "Mới giao", nên ô "Đang làm" trên bảng việc
    # của họ chưa bao giờ có số. Nguyên nhân là bảng trạng thái `plan_down` chạy VÒNG QUA TOÀN BỘ
    # danh sách: bộ phận nào ít người thì rơi trúng vài ô đầu rồi hết lượt - đúng kiểu thiếu sót
    # không ai nhìn ra khi đọc mã, chỉ lộ khi ĐÓNG VAI người ngồi làm việc.
    # Sửa ở đây thay vì đổi vòng lặp trên: thêm việc thì chắc chắn đủ, còn xoay bảng trạng thái
    # thì bộ phận sau lại hụt cái khác.
    for dep in DEPTS:
        ng = by_dep.get(dep, [])
        if not ng:
            continue
        ids_dep = {x["staff_id"] for x in ng}
        dang = [r for r in rows if r["assignee_id"] in ids_dep
                and r["task_status"].split("(")[0].strip() == "accepted"]
        if dang:
            continue
        who = next((x for x in ng if boss_of(x) and boss_of(x)["staff_id"] != x["staff_id"]), None)
        if not who:
            continue
        pool = [x for x in SCEN if x[2] == dep] or SCEN
        add(boss_of(who), who, random.choice(pool), "assign", "accepted", True, 28, -20,
            related=pick_related())

    # ---- 3bis-c. MỌI CHỨC DANH CÓ CỬA ĐĂNG NHẬP ĐỀU PHẢI CÓ "VIỆC CHỜ NHẬN" (V9.99t) ----
    # Anh Luân 05/08: *"Cái chỗ việc chờ nhận, nó chưa theo người nha em - việc chờ nhận nghĩa là
    # người đang đăng nhập được giao đó"*. App đã sửa để lọc theo người nhận. Nhưng sửa xong thì
    # lộ ra vế thứ hai: cả trung tâm chỉ có 11 việc ở trạng thái "Mới giao", rơi lung tung, nên
    # Giám đốc và ba trong bốn trưởng phòng mở tab ấy ra thấy TRỐNG. Lọc đúng mà không có gì để
    # xem thì người xem demo vẫn kết luận là app hỏng.
    # Bảo đảm: mỗi chức danh ĐANG CÓ CỬA Ở CỔNG ĐĂNG NHẬP đều có ít nhất một việc chờ nhận.
    # (Danh sách này đi theo GATEVAI trong gen_v5.py - thêm/bớt cửa thì sửa cả hai chỗ.)
    VAI_CO_CUA = ["ceo", "aca_manager", "academic_manager", "sales_manager", "wow_leader",
                  "academic_staff", "sales_staff", "sales_leader", "teacher", "wow_coach",
                  "accounting_manager", "accountant"]
    for rc in VAI_CO_CUA:
        ng = [x for x in staff if role_of(x) == rc]
        if not ng:
            continue
        ids_vai = {x["staff_id"] for x in ng}
        co = [r for r in rows if r["assignee_id"] in ids_vai
              and r["task_status"].split("(")[0].strip() == "new"]
        if co:
            continue
        who = ng[0]
        bs = boss_of(who)
        if not bs or bs["staff_id"] == who["staff_id"]:
            # Giám đốc không có cấp trên - việc chờ nhận của họ do trưởng phòng gửi lên.
            bs = next((x for x in staff if lvl(x.get("role")) == 2
                       and x["staff_id"] != who["staff_id"]), None)
        if not bs:
            continue
        pool = [x for x in SCEN if x[2] == who.get("department")] or SCEN
        add(bs, who, random.choice(pool), "assign", "new", True, 22, -3,
            related=pick_related())

    # ---- 3b. QUYỀN TẠM THEO VIỆC (câu hỏi của Luân 28/07) ----
    # Việc dính hồ sơ học viên thì người nhận PHẢI được mở quyền, nhưng quyền là thứ đi mượn:
    # có MỨC rõ (chỉ xem / xem và sửa), có HẠN rõ (mặc định = hạn việc + số ngày ân hạn),
    # và tự tắt khi việc được xác nhận xong. Không có hạn thì quyền mở ra là mở mãi.
    GRACE_H = 48        # ân hạn sau hạn việc - app đọc qua tham số CH2 permGrace_hours
    for r in rows:
        if not r["related_id"]:
            continue
        st = r["task_status"].split("(")[0].strip()
        due = datetime.strptime(r["due_time"], "%d/%m/%Y %H:%M")
        # việc chỉ đi xem thông tin thì cho XEM; việc phải nhập liệu vào hồ sơ mới cho SỬA
        need_edit = r["task_type"].startswith("assign") and r["required"] == "Có"
        r["perm_level"] = "edit (Xem và sửa)" if need_edit else "view (Chỉ xem)"
        r["perm_until"] = fmt(due + timedelta(hours=GRACE_H))
        r["perm_note"] = ("Quyền tạm mở theo việc %s, tự thu hồi khi việc được xác nhận xong "
                          "hoặc khi quá hạn quyền." % r["task_id"])
        if st in ("confirmed", "declined", "cancelled"):
            r["perm_revoked_at"] = r.get("confirm_time") or r["done_time"] or fmt(NOW - timedelta(hours=1))
            r["perm_level"] = "none (Đã thu hồi)"

    dl["DL23"] = rows

    # ---- 4. DL24: TRAO DOI TRONG TUNG VIEC (de thong tin khong troi nhu nhan Zalo) ----
    # Bang rieng theo dung luat "moi dong mot ban ghi, ma la dia chi" - de len Sheets van chay.
    TALK = {
        "new": [],
        "accepted": [("assignee", "Em nhận việc này ạ, em làm trong hôm nay rồi báo lại anh chị."),
                     ("assigner", "Được em, có gì vướng thì nhắn lại ngay nhé.")],
        "done": [("assignee", "Em nhận việc ạ."),
                 ("assignee", "Em làm xong rồi, kết quả em ghi trong phần báo xong nhé."),
                 ("assigner", "Để anh chị xem lại rồi xác nhận.")],
        "confirmed": [("assignee", "Em nhận việc ạ."),
                      ("assignee", "Dạ xong rồi, nhờ anh chị kiểm tra giúp em."),
                      ("assigner", "Đã xem, đạt yêu cầu. Cảm ơn em.")],
        "declined": [("assignee", "Dạ anh chị, tuần này em kẹt việc quá, em xin phép từ chối.")
                     , ("assigner", "Được, để mình nhờ bạn khác hỗ trợ.")],
    }
    cmts = []
    cn = 0
    for r in rows:
        st = r["task_status"].split("(")[0].strip()
        seq = TALK.get(st, [])
        if not seq: continue
        base = datetime.strptime(r["created_time"], "%d/%m/%Y %H:%M")
        for i, (who, txt) in enumerate(seq):
            cn += 1
            sid = r["assignee_id"] if who == "assignee" else r["assigner_id"]
            nm = r["assignee_id_name"] if who == "assignee" else r["assigner_id_name"]
            cmts.append({
                "comment_id": "TCM-%04d" % cn,
                "task_id": r["task_id"],
                "staff_id": sid,
                "staff_id_name": nm,
                "comment_time": fmt(min(NOW - timedelta(minutes=5), base + timedelta(hours=i + 1))),
                "content": txt,
            })
    # them vai trao doi "hoi lai cho ro" o viec dang chay - dung kieu that hay gap
    live = [r for r in rows if r["task_status"].split("(")[0].strip() == "accepted"][:2]
    for r in live:
        for who, txt in [("assignee", "Anh chị ơi, cái này làm theo mẫu cũ hay mẫu mới ạ?"),
                         ("assigner", "Theo mẫu mới nhé em, file đính kèm trong SOP.")]:
            cn += 1
            sid = r["assignee_id"] if who == "assignee" else r["assigner_id"]
            nm = r["assignee_id_name"] if who == "assignee" else r["assigner_id_name"]
            cmts.append({"comment_id": "TCM-%04d" % cn, "task_id": r["task_id"], "staff_id": sid,
                         "staff_id_name": nm, "comment_time": fmt(NOW - timedelta(hours=2)),
                         "content": txt})
    dl["DL24"] = cmts

    # them nhan enum cho module giao viec (de app va ban Sheets dung chung mot bo nhan)
    enums = data.setdefault("enums", {})
    # student_request: yêu cầu do CHÍNH học viên gửi lên từ cổng học viên (báo nghỉ, xin học bù,
    # đặt WOW, xin đổi lớp, báo đã chuyển khoản...). seed_giaoviec chạy SAU fixdata nên nếu
    # không khai ở đây thì giá trị fixdata thêm vào sẽ bị ghi đè mất.
    enums["enum_task_type"] = ["assign (Giao việc)", "peer (Phối hợp ngang cấp)", "support (Nhờ hỗ trợ)",
                               "student_request (Yêu cầu từ học viên)"]
    enums["enum_task_status"] = ["new (Mới giao)", "accepted (Đã nhận)", "done (Báo xong)",
                                 "confirmed (Hoàn thành)", "declined (Từ chối)", "cancelled (Đã hủy)"]
    enums["enum_task_priority"] = ["low (Thấp)", "normal (Bình thường)", "high (Cao)", "urgent (Gấp)"]

    json.dump(data, open(SRC, "w", encoding="utf-8"), ensure_ascii=False)
    st_count = {}
    for r in rows:
        k = r["task_status"].split("(")[0].strip()
        st_count[k] = st_count.get(k, 0) + 1
    print("DL23 da sinh:", len(rows), "viec |", st_count, "| DL24 trao doi:", len(cmts), "dong")
    print("  bat buoc:", sum(1 for r in rows if r["required"] == "Có"),
          "| qua han chua xong:", sum(1 for r in rows
              if r["task_status"].split("(")[0].strip() in ("new", "accepted")
              and datetime.strptime(r["due_time"], "%d/%m/%Y %H:%M") < NOW))


if __name__ == "__main__":
    main()
