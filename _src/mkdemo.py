# -*- coding: utf-8 -*-
"""
Dựng 3 hồ sơ demo ĐẦY ĐỦ (Trần Khánh Vy / Lê Gia Bảo / Phạm Ngọc Hân).

Cách làm: KHÔNG tạo học viên mới từ đầu (sẽ phải sinh lại toàn bộ điểm danh, bài tập,
buổi học... và rất dễ đứt liên kết). Thay vào đó lấy 3 hồ sơ giàu dữ liệu nhất, đổi tên
đặt tên chuẩn rồi VÁ ĐÚNG những mục còn thiếu để cả 3 đều sáng đủ 12 mục trên trang
học viên. Cuối cùng đẩy 3 hồ sơ lên đầu bảng DL09 để mặc định mở ra là hồ sơ đầy nhất, và ở app
nhân viên cũng đứng đầu danh sách.

CHẠY LẠI SAU MỖI LẦN SINH LẠI DEMO:  python3 gen_demo.py && python3 mkdemo.py && python3 gen_v5.py
"""
import json, datetime as dt, os

P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo_data_big.json")
d = json.load(open(P, encoding="utf-8"))
dl = d["dl"]

# V9.47 (anh Luan: cong "dep va chuyen nghiep, khong duoc qua loa"): ba ho so trung bay nay tung
# mang ten "Demo 1/2/3". Voi mot ban demo dem di gioi thieu cho trung tam khac thi cai ten do doc
# ra la "chua lam xong" - nguoi xem nhin thay chu Demo la biet minh dang xem do gia. Ba ho so van
# giu nguyen vai tro (day nhat, dung dau bang) nhung mang TEN THAT nhu moi hoc vien khac.
TARGETS = [("HV061", "Tr\u1ea7n Kh\u00e1nh Vy"), ("HV065", "L\u00ea Gia B\u1ea3o"), ("HV002", "Ph\u1ea1m Ng\u1ecdc H\u00e2n")]
NOW = dt.datetime.now()
def F(x):  return x.strftime("%d/%m/%Y %H:%M")
def FD(x): return x.strftime("%d/%m/%Y")
def p2(s):
    import re
    m = re.match(r"(\d{1,2})/(\d{1,2})/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?", str(s or ""))
    if not m: return None
    dd, mm, yy, H, M = m.groups()
    return dt.datetime(int(yy), int(mm), int(dd), int(H or 0), int(M or 0))

def rows(c): return dl.get(c, [])
def one(c, f, v):
    for r in rows(c):
        if r.get(f) == v: return r
    return None
def nextid(code, field, prefix, width=3):
    n = 0
    for r in rows(code):
        s = str(r.get(field, ""))
        if s.startswith(prefix):
            try: n = max(n, int(s[len(prefix):]))
            except: pass
    return prefix + str(n + 1).zfill(width)

# ---------- 1. ĐỔI TÊN (kèm mọi cột tên đã sao chép sang bảng khác) ----------
NAMEFIELDS = {
    "DL09": ["full_name"], "DL12": ["student_name"], "DL13": ["student_name"],
    "DL14": ["student_name"], "DL15": ["student_name"],
    "DL06": ["student_id_name"], "DL07": ["student_id_name"], "DL08": ["student_id_name"],
    "DL16": ["student_id_name"], "DL17": ["student_id_name"], "DL18": ["student_id_name"],
}
for sid, newname in TARGETS:
    S = one("DL09", "student_id", sid)
    if not S:
        print("KHONG THAY", sid); continue
    old = S.get("full_name")
    for code, fields in NAMEFIELDS.items():
        for r in rows(code):
            if r.get("student_id") == sid:
                for f in fields: r[f] = newname
    # lead gốc (để hành trình "Biết đến ITTs" hiện đúng tên)
    for e in rows("DL06"):
        if e.get("student_id") == sid and e.get("lead_id"):
            L = one("DL02", "lead_id", e["lead_id"])
            if L:
                L["full_name"] = newname
                for code in ["DL03", "DL04"]:
                    for r in rows(code):
                        if r.get("lead_id") == L["lead_id"]:
                            if "lead_id_name" in r: r["lead_id_name"] = newname
                            if "customer_name_display" in r: r["customer_name_display"] = newname
                for tp in rows("DL02b"):
                    if tp.get("lead_id") == L["lead_id"] and "customer_name" in tp:
                        tp["customer_name"] = newname
            for f in ["lead_id_name"]:
                if f in e: e[f] = newname
    print(f"{sid}: {old}  ->  {newname}")

# ---------- 2. VÁ CÁC MỤC CÒN THIẾU ----------
def live_enr(sid):
    for e in rows("DL06"):
        if e.get("student_id") == sid and "cancel" not in str(e.get("enrollment_status", "")):
            return e
    return None

def add_discount(sid, amount, reason):
    """Hộp 'Yêu cầu & phê duyệt' chỉ hiện khi có ưu đãi -> để CHỜ DUYỆT cho sinh động."""
    e = live_enr(sid)
    if not e: return
    if float(e.get("discount_amount") or 0) > 0 and not str(e.get("discount_approved_by") or "").strip():
        return  # đã có sẵn khoản chờ duyệt
    e["discount_amount"] = amount
    e["discount_type"] = "promotion (Khuyến mãi)"
    e["discount_reason"] = reason
    e["discount_approved_by"] = ""      # để trống = đang chờ duyệt
    e["discount_approved_at"] = ""
    tot = float(e.get("total_fee") or 0)
    paid = float(e.get("paid_amount") or 0)
    e["final_fee"] = max(0, tot - amount)
    # nếu HV đã đóng VƯỢT mức phải thu mới (giảm giá sau khi đã đóng gần đủ) thì hạ bớt
    # phiếu thu cuối cho khớp - không được để "đã đóng > phải thu" (bộ kiểm tiền sẽ gào)
    over = paid - e["final_fee"]
    if over > 0:
        ps = [x for x in rows("DL07") if x.get("enrollment_id") == e["enrollment_id"]]
        ps.sort(key=lambda x: p2(x.get("payment_time")) or NOW)
        while over > 0 and ps:
            last = ps[-1]
            amt = float(last.get("amount") or 0)
            if amt > over:
                last["amount"] = int(amt - over)
                if str(last.get("net_received") or "").strip() != "":
                    last["net_received"] = int(float(last.get("net_received") or amt) - over)
                over = 0
            else:
                dl["DL07"] = [x for x in rows("DL07") if x is not last]
                ps.pop(); over -= amt
        paid = sum(float(x.get("amount") or 0) for x in rows("DL07") if x.get("enrollment_id") == e["enrollment_id"])
        e["paid_amount"] = paid
    e["remaining_amount"] = max(0, tot - amount - paid)

def settle_enr(e, days_after=45):
    """Đóng nốt công nợ 1 đăng ký (khóa cũ 'đã đóng đủ' trong kịch bản demo)."""
    if not e: return
    sync_money(e)
    rem = float(e.get("remaining_amount") or 0)
    if rem > 0:
        st = p2(e.get("enrollment_time")) or NOW
        add_payment(e, int(rem), min(st + dt.timedelta(days=days_after), NOW - dt.timedelta(days=2)), verified=True)
        sync_money(e)

def add_wow(sid, items):
    """Nhật ký WOW: đặt lúc nào -> học lúc nào -> nội dung -> kết quả."""
    S = one("DL09", "student_id", sid)
    have = [w for w in rows("DL14") if w.get("student_id") == sid]
    if len(have) >= 2: return
    staff = None
    for s in rows("DL01"):
        if "wow" in str(s.get("role", "")).lower(): staff = s; break
    staff = staff or rows("DL01")[0]
    for i, it in enumerate(items):
        wid = nextid("DL14", "wow_id", "WOW-")
        book = NOW - dt.timedelta(days=it["ago"] + 2)
        ses = NOW - dt.timedelta(days=it["ago"])
        rows("DL14").append({
            "wow_id": wid, "booking_date": F(book), "student_id": sid,
            "student_name": S.get("full_name"), "wow_session_date": F(ses),
            "wow_session_type": it["type"], "wow_booked_by": it["by"],
            "wow_skill": it["skill"], "wow_content_focus": it["focus"],
            "staff_id": staff.get("staff_id"), "staff_name": staff.get("full_name"),
            "wow_status": it["status"], "wow_content_note": it.get("note", ""),
            "wow_outcome": it.get("outcome", ""), "wow_no_show_reason": "",
            "quota_deducted": "yes" if "completed" in it["status"] else "",
            "sla_content_note_24h": "Đúng hạn" if it.get("note") else "",
            "notes": "", "next_action": "",
        })
    used = len([w for w in rows("DL14") if w.get("student_id") == sid and "completed" in str(w.get("wow_status"))])
    S["wow_quota_used"] = str(used)
    _tot = (int(float(S.get("wow_quota_default") or 10)) + int(float(S.get("wow_extra_approved") or 0))
            + int(float(S.get("wow_extra_purchased") or 0)))
    S["wow_quota_remaining"] = str(max(0, _tot - used))

def add_test(sid, overall, sk):
    """Bảng 'Hành trình điểm số' cần test đầu vào."""
    e = live_enr(sid)
    if not e or not e.get("lead_id"): return
    lid = e["lead_id"]
    if any(t.get("lead_id") == lid for t in rows("DL03")): return
    L = one("DL02", "lead_id", lid) or {}
    tid = nextid("DL03", "test_booking_id", "TB-2026-")
    day = NOW - dt.timedelta(days=120)
    rows("DL03").append({
        "test_booking_id": tid, "lead_id": lid, "lead_id_name": L.get("full_name"),
        "test_date": F(day), "test_format": "offline (Offline tại trung tâm)",
        "booking_status": "booked (Đã đặt lịch)", "booking_note": "",
        "test_attendance_status": "on_time (Đúng giờ)", "test_attendance_time": F(day),
        "test_no_show_reason": "", "test_status": "graded (Đã chấm xong)",
        "overall_score": overall, "skill_listening": sk[0], "skill_reading": sk[1],
        "skill_writing": sk[2], "skill_speaking": sk[3],
        "academic_note": "Nền tảng khá, cần siết Writing và phát âm.",
        "result_time": F(day + dt.timedelta(hours=6)),
        "post_test_status": "consulted (Đã tư vấn xong)",
        "graded_by": "", "auto_trigger_hint": "", "next_action": "",
    })

def add_survey_pending(sid):
    """Cần 1 phiếu CHƯA trả lời để demo nút 'Trả lời ngay'."""
    if any(v.get("student_id") == sid and not str(v.get("submitted_date") or "").strip()
           for v in rows("DL15")): return
    S = one("DL09", "student_id", sid) or {}
    ob = next((o for o in rows("DL08") if o.get("student_id") == sid and o.get("class_id")), {})
    rows("DL15").append({
        "survey_id": nextid("DL15", "survey_id", "SUR-"), "student_id": sid,
        "student_name": S.get("full_name"), "class_id": ob.get("class_id", ""),
        "class_id_name": ob.get("class_id_name", ""), "survey_type": "week_4 (Tuần 4)",
        "sent_date": F(NOW - dt.timedelta(days=2)), "submitted_date": "",
        "within_3_days": "", "satisfaction_score": "", "nps_score": "",
        "progress_perception": "", "positive_comments": "", "negative_comments": "",
        "suggestions": "", "follow_up_needed": "", "assigned_staff": "",
        "notes": "", "next_action": "",
    })

def add_feedback(sid, cat, typ, content):
    if any(f.get("student_id") == sid for f in rows("DL16")): return
    S = one("DL09", "student_id", sid) or {}
    ob = next((o for o in rows("DL08") if o.get("student_id") == sid and o.get("class_id")), {})
    rows("DL16").append({
        "feedback_id": nextid("DL16", "feedback_id", "FB-"), "feedback_time": F(NOW - dt.timedelta(days=6)),
        "student_id": sid, "class_id": ob.get("class_id", ""), "feedback_channel": "direct (Trực tiếp)",
        "feedback_type": typ, "feedback_category": cat, "feedback_score": "4",
        "feedback_content": content, "feedback_status": "resolved (Đã xử lý xong)",
        "classified_at": F(NOW - dt.timedelta(days=5)), "classified_by": "Học vụ",
        "feedback_action_note": "Đã trao đổi và điều chỉnh.", "action_taken_at": F(NOW - dt.timedelta(days=4)),
        "related_complaint_id": "", "is_testimonial": "", "notes": "", "next_action": "",
        "student_id_name": S.get("full_name"), "class_id_name": ob.get("class_id_name", ""),
    })

def unverify_one_payment(sid):
    """Để 1 khoản 'đang đối soát' cho khối học phí có đủ 2 trạng thái."""
    ps = [p for p in rows("DL07") if p.get("student_id") == sid]
    if ps and all(str(p.get("verified_by") or "").strip() for p in ps):
        ps[-1]["verified_by"] = ""

# --- Ho so 1 (HV061): đủ nhất, chỉ thiếu hộp phê duyệt ---
add_discount("HV061", 1500000, "Ưu đãi học viên tái ghi danh")
add_survey_pending("HV061")
unverify_one_payment("HV061")

# --- Ho so 2 (HV065): có phê duyệt sẵn, thiếu WOW ---
add_wow("HV065", [
    dict(ago=21, type="academic_support (Hỗ trợ học thuật)", by="academic_hv (Học vụ)",
         skill="Writing (Viết)", focus="Task 2 - cấu trúc bài luận",
         status="completed (Đã hoàn thành)", note="Chữa 2 bài Task 2, HV nắm được cách mở bài và dẫn ý.",
         outcome="improved (Tiến bộ rõ rệt)"),
    dict(ago=7, type="advanced_practice (Luyện nâng cao)", by="student (Học viên)",
         skill="Speaking (Nói)", focus="Part 3 - mở rộng ý",
         status="completed (Đã hoàn thành)", note="Luyện Part 3, còn ngập ngừng khi phải lập luận dài.",
         outcome="needs_more (Cần thêm buổi)"),
    dict(ago=-4, type="academic_support (Hỗ trợ học thuật)", by="academic_hv (Học vụ)",
         skill="Speaking (Nói)", focus="Part 3 - luyện tiếp theo buổi trước",
         status="confirmed (Đã xác nhận)"),
])
add_survey_pending("HV065")
add_feedback("HV065", "teacher_quality (Chất lượng giảng dạy)", "positive (Tích cực)",
             "Thầy chữa bài rất kỹ, em hiểu lỗi sai của mình.")

# --- Ho so 3 (HV002): thiếu phê duyệt + điểm số ---
add_discount("HV002", 2000000, "Ưu đãi giới thiệu bạn")
add_test("HV002", "5.0", ["5.0", "5.5", "4.5", "5.0"])
add_survey_pending("HV002")
add_feedback("HV002", "schedule (Lịch học)", "neutral (Trung tính)",
             "Em mong có thêm lớp cuối tuần cho dễ sắp xếp.")
unverify_one_payment("HV002")

# ---------- 3. VÁ TÍNH HỢP LÝ (dữ liệu demo gốc có mấy chỗ vô lý) ----------
def paydate(e):  # ngày đăng ký + 1 ngày
    t = p2(e.get("enrollment_time")) or NOW
    return t + dt.timedelta(days=1)
def p2(s):
    import re
    m = re.match(r"(\d{1,2})/(\d{1,2})/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?", str(s or ""))
    if not m: return None
    dd, mm, yy, H, M = m.groups()
    return dt.datetime(int(yy), int(mm), int(dd), int(H or 0), int(M or 0))
def sync_money(e):
    tot = float(e.get("total_fee") or 0); dis = float(e.get("discount_amount") or 0)
    paid = sum(float(x.get("amount") or 0) for x in rows("DL07") if x.get("enrollment_id") == e["enrollment_id"])
    fin = max(0, tot - dis)
    e["final_fee"] = fin; e["paid_amount"] = paid; e["remaining_amount"] = max(0, fin - paid)
    e["payment_status"] = ("paid (Đã thanh toán đủ)" if paid >= fin > 0
                           else "partial (Đã thanh toán 1 phần)" if paid > 0
                           else "unpaid (Chưa thanh toán)")
def add_payment(e, amount, when, method="bank_transfer (Chuyển khoản NH)", verified=True):
    """Phiếu thu phải ĐỦ BỘ CỘT như phiếu do gen_demo sinh, nếu không app render ô trống và
    bản Sheets lệch cột. Người thu / người đối soát là MÃ NHÂN VIÊN - ghi chữ "Kế toán" vào
    ô mã là mã chết, tra ngược ra rỗng."""
    S = one("DL09", "student_id", e.get("student_id")) or {}
    ACC = next((x for x in rows("DL01") if str(x.get("role", "")).startswith("accountant")), None) or {}
    _aid, _anm = ACC.get("staff_id", ""), ACC.get("full_name", "")
    _ref = "FT%09d" % (sum(ord(ch) for ch in (str(e["enrollment_id"]) + F(when))) * 7919 % 10 ** 9)
    rows("DL07").append({
        "payment_id": nextid("DL07", "payment_id", "PAY-2026-"), "enrollment_id": e["enrollment_id"],
        "student_id": e.get("student_id"), "lead_id": e.get("lead_id", ""),
        "student_id_name": S.get("full_name"),
        "amount": amount, "payment_time": F(when), "payment_method": method,
        "transaction_fee": 0, "net_received": amount,
        "bank_name": "Vietcombank", "sender_name": S.get("full_name"), "transaction_ref": _ref,
        "received_by": _aid, "received_by_name": _anm,
        "verified_by": (_aid if verified else ""), "verified_by_name": (_anm if verified else ""),
        "payment_note": "", "next_action": "",
    })

# TRA ĐỘNG theo học viên (ID enrollment đổi mỗi lần gen_demo đổi logic - KHÔNG hardcode mã)
def enrs_of(sid):
    es = [e for e in rows("DL06") if e.get("student_id") == sid and "cancel" not in str(e.get("enrollment_status", ""))]
    es.sort(key=lambda e: p2(e.get("enrollment_time")) or NOW)
    return es

# --- Ho so 1 (HV061): ưu đãi phải nằm ở khóa MỚI đăng ký (7.0), không nằm ở khóa cũ đã đóng đủ ---
_e61s = enrs_of("HV061")
e_old = _e61s[0] if _e61s else None                      # khóa 6.5 đã học xong, đã đóng đủ
e_new = _e61s[-1] if len(_e61s) > 1 else None            # khóa 7.0 vừa tái đăng ký
if e_old and e_new:
    e_old["discount_amount"] = 0; e_old["discount_type"] = ""; e_old["discount_reason"] = ""
    e_old["discount_approved_by"] = ""; e_old["discount_approved_at"] = ""
    settle_enr(e_old)   # khóa cũ theo kịch bản demo là ĐÃ ĐÓNG ĐỦ - đóng nốt nếu generator cho nợ
    e_old["next_payment_due"] = ""
    e_new["discount_amount"] = 1500000
    e_new["discount_type"] = "promotion (Khuyến mãi)"
    e_new["discount_reason"] = "Ưu đãi học viên học tiếp khóa sau"
    e_new["discount_approved_by"] = ""; e_new["discount_approved_at"] = ""
    # khóa vừa đăng ký -> giữ lại đúng 1 khoản cọc, phần còn lại là công nợ có HẸN THU
    dl["DL07"] = [x for x in rows("DL07") if x.get("enrollment_id") != e_new["enrollment_id"]]
    add_payment(e_new, 10000000, paydate(e_new), verified=True)
    sync_money(e_new)
    if float(e_new.get("remaining_amount") or 0) > 0:
        e_new["next_payment_due"] = (NOW + dt.timedelta(days=7)).strftime("%d/%m/%Y")
# Xếp lớp phải TRƯỚC ngày khai giảng NHƯNG cũng phải SAU ngày đăng ký. HV tái ghi danh vào
# lớp ĐÃ khai giảng (vào giữa khóa - hợp lệ theo SOP) mà kéo mốc về trước khai giảng thì
# thành "xếp lớp trước khi đăng ký". Neo theo mốc muộn hơn trong hai mốc.
def _ob_anchor(ob, kg):
    _e = one("DL06", "enrollment_id", ob.get("enrollment_id")) or {}
    _et = p2(_e.get("enrollment_time"))
    base = kg - dt.timedelta(days=5)
    if _et and base < _et:
        base = _et + dt.timedelta(hours=2)
    ob["assigned_at"] = F(base)
    ob["class_info_sent_at"] = F(base + dt.timedelta(days=1))
    ob["confirmation_time"] = F(base + dt.timedelta(days=2))
    ob["onboarding_completed_at"] = F(base + dt.timedelta(days=3))
for ob in rows("DL08"):
    if ob.get("student_id") != "HV061" or not ob.get("class_id"):
        continue
    cl = one("DL10", "class_id", ob["class_id"])
    kg = p2(cl.get("class_start_date")) if cl else None
    if kg:
        _ob_anchor(ob, kg)
    # hồ sơ xếp lớp 7.0 phải gắn với ĐĂNG KÝ khóa 7.0 (không trỏ nhầm sang khóa 6.5)
    if e_new and cl and str(cl.get("course_id")) == str(e_new.get("course_id")):
        ob["enrollment_id"] = e_new["enrollment_id"]

# --- Ho so 2 (HV065): khóa cũ chưa đóng đồng nào -> cho đóng cọc + đợt 2, còn nợ đuôi có hẹn thu ---
_e65s = enrs_of("HV065")
e05 = _e65s[0] if _e65s else None
if e05 and not [x for x in rows("DL07") if x.get("enrollment_id") == e05["enrollment_id"]]:
    st = p2(e05.get("enrollment_time")) or NOW
    add_payment(e05, 5000000, st + dt.timedelta(days=1), verified=True)
    add_payment(e05, 10000000, st + dt.timedelta(days=45), verified=True)
    sync_money(e05)   # 20tr - CK 1tr = 19tr, đã đóng 15tr, còn nợ 4tr
if e05 and float(e05.get("remaining_amount") or 0) > 0 and not str(e05.get("next_payment_due") or "").strip():
    e05["next_payment_due"] = (NOW + dt.timedelta(days=5)).strftime("%d/%m/%Y")
for ob in rows("DL08"):
    if ob.get("student_id") == "HV065" and ob.get("class_id"):
        cl = one("DL10", "class_id", ob["class_id"]); kg = p2(cl.get("class_start_date")) if cl else None
        if kg:
            _ob_anchor(ob, kg)

# --- Ho so 3 (HV002): test đầu vào không được nằm TRƯỚC ngày lead vào hệ thống ---
_e02s = enrs_of("HV002")
e61 = _e02s[0] if _e02s else None
if e61 and e61.get("lead_id"):
    L = one("DL02", "lead_id", e61["lead_id"])
    lt = p2(L.get("lead_created_time")) if L else None
    et = p2(e61.get("enrollment_time"))
    for t in rows("DL03"):
        if t.get("lead_id") == e61["lead_id"] and lt:
            tt = p2(t.get("test_date"))
            if tt and tt >= lt: continue   # đã hợp lệ thì không đụng
            tday = lt + dt.timedelta(days=2)
            if et and tday >= et: tday = lt + dt.timedelta(days=1)
            t["test_date"] = F(tday)
            if str(t.get("test_attendance_time") or "").strip(): t["test_attendance_time"] = F(tday)
            if str(t.get("result_time") or "").strip(): t["result_time"] = F(tday + dt.timedelta(hours=6))
    sync_money(e61)
# buổi WOW chưa dạy thì CHƯA được trừ lượt (chỉ buổi đã dạy hoặc HV vắng mới trừ - SOP NA035)
ids_all = [t[0] for t in TARGETS]
for w in rows("DL14"):
    if w.get("student_id") in ids_all:
        st = str(w.get("wow_status", ""))
        w["quota_deducted"] = "yes" if ("completed" in st or "no_show" in st) else ""
for sid, _ in TARGETS:
    S = one("DL09", "student_id", sid)
    ded = len([w for w in rows("DL14") if w.get("student_id") == sid and str(w.get("quota_deducted", "")).lower() == "yes"])
    S["wow_quota_used"] = str(ded)
    _tot = (int(float(S.get("wow_quota_default") or 10)) + int(float(S.get("wow_extra_approved") or 0))
            + int(float(S.get("wow_extra_purchased") or 0)))
    S["wow_quota_remaining"] = str(max(0, _tot - ded))

# ---------- 3b. HỒ SƠ DEMO SẠCH CỜ NGUY CƠ (cổng học viên demo không hiện cảnh báo đỏ) ----------
import re as _re
for sid, _ in TARGETS:
    S = one("DL09", "student_id", sid)
    if not S: continue
    flags = str(S.get("attendance_progress_status", "")) + " " + str(S.get("academic_progress_status", ""))
    if _re.search(r"at_risk|off_track", flags):
        S["attendance_progress_status"] = "on_track (Đang đều đặn)"
        S["academic_progress_status"] = "on_track (Đang tiến bộ)"
        S["attendance_risk_reason"] = ""; S["academic_risk_reason"] = ""
        S["learning_followup_note"] = F(NOW - dt.timedelta(days=3)) + ": đã kèm WOW bổ trợ + nhắc lịch, HV học lại đều, gỡ cờ nguy cơ"
        S["next_action"] = ""

# ---------- 4. ĐẨY 3 HỒ SƠ LÊN ĐẦU (mặc định = Demo 1, app cũng đứng đầu) ----------
ids = [t[0] for t in TARGETS]
head = [one("DL09", "student_id", i) for i in ids]
dl["DL09"] = [x for x in head if x] + [s for s in dl["DL09"] if s.get("student_id") not in ids]

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print("\nDL09 3 dong dau:", [s["full_name"] for s in dl["DL09"][:3]])
print("DA GHI", P)
