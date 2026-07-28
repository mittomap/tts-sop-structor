# -*- coding: utf-8 -*-
"""
BỘ KIỂM DỮ LIỆU — 12 nhóm quy tắc, chạy sau mỗi lần sinh lại dữ liệu.

BÀI HỌC ĐẮT NHẤT: quy tắc dò SAI TÊN CỘT thì im lặng "pass" — nguy hiểm hơn hẳn
báo lỗi. Nên mọi quy tắc ở đây phải khai trước tên cột qua need(); thiếu cột thì
hô "QUY TẮC BỊ VÔ HIỆU" chứ không lặng lẽ bỏ qua.

Thoát mã 1 nếu còn lỗi NẶNG. Chạy: python3 check_data.py
"""
import json, re, sys, datetime, os

P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo_data_big.json")
NOW = datetime.datetime.now()   # dữ liệu neo theo ngày chạy pipeline - mốc kiểm cũng phải là hôm nay
d = json.load(open(P, encoding="utf-8"))
dl, EN = d["dl"], d.get("enums", {})

NANG, VUA, NHE, WARN = [], [], [], []


def R(t):
    return dl.get(t, [])


def cols(t):
    return set(R(t)[0].keys()) if R(t) else set()


def code(v):
    m = re.match(r"^([A-Za-z0-9_]+)", str(v or "").strip())
    return m.group(1) if m else ""


def dt(v):
    m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?", str(v or ""))
    if not m:
        return None
    try:
        return datetime.datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)),
                                 int(m.group(4) or 0), int(m.group(5) or 0))
    except Exception:
        return None


def n(v):
    s = re.sub(r"[^0-9.\-]", "", str(v or ""))
    try:
        return float(s) if s not in ("", "-", ".") else 0.0
    except Exception:
        return 0.0


def need(t, *fs):
    miss = [f for f in fs if f not in cols(t)]
    if miss:
        WARN.append("%s thiếu cột %s" % (t, ", ".join(miss)))
        return False
    return True


KEY = {"DL01": "staff_id", "DL02": "lead_id", "DL02b": "touchpoint_id", "DL03": "test_booking_id",
       "DL04": "consultation_id", "DL05": "course_id", "DL06": "enrollment_id", "DL07": "payment_id",
       "DL08": "onboarding_id", "DL09": "student_id", "DL10": "class_id", "DL11": "session_id",
       "DL12": "attendance_id", "DL13": "homework_id", "DL14": "wow_id", "DL15": "survey_id",
       "DL16": "feedback_id", "DL17": "complaint_id", "DL18": "course_end_id",
       "DL19": "reward_id", "DL20": "hw_bank_id", "DL21": "plan_id", "DL22": "referral_id"}
IDX = {t: {str(r.get(k) or ""): r for r in R(t)} for t, k in KEY.items()}


def bad(level, rule, msg):
    level.append("[%s] %s" % (rule, msg))


# ── 1. KHÓA NGOẠI ────────────────────────────────────────────────────────
FK = [("DL02b", "lead_id", "DL02"), ("DL03", "lead_id", "DL02"), ("DL04", "lead_id", "DL02"),
      ("DL06", "course_id", "DL05"), ("DL07", "enrollment_id", "DL06"),
      ("DL08", "student_id", "DL09"), ("DL08", "class_id", "DL10"), ("DL08", "enrollment_id", "DL06"),
      # DL09 KHÔNG có cột class_id: liên kết học viên <-> lớp nằm ở DL08 (xếp lớp).
      ("DL10", "course_id", "DL05"), ("DL10", "main_teacher_id", "DL01"),
      ("DL11", "class_id", "DL10"), ("DL11", "teacher_id", "DL01"), ("DL12", "session_id", "DL11"),
      ("DL12", "student_id", "DL09"), ("DL13", "student_id", "DL09"), ("DL13", "class_id", "DL10"),
      ("DL14", "student_id", "DL09"), ("DL15", "student_id", "DL09"), ("DL16", "student_id", "DL09"),
      ("DL17", "student_id", "DL09"), ("DL18", "student_id", "DL09"), ("DL21", "course_id", "DL05"),
      ("DL22", "referrer_student_id", "DL09"), ("DL19", "referrer_student_id", "DL09")]
for t, f, ref in FK:
    if not need(t, f):
        continue
    b = [str(r.get(f)) for r in R(t) if str(r.get(f) or "").strip() and str(r.get(f)).strip() not in IDX[ref]]
    if b:
        bad(NANG, "1 khóa ngoại", "%s.%s -> %s: %d dòng treo (vd %s)" % (t, f, ref, len(b), ", ".join(sorted(set(b))[:3])))

# ── 2. TRÙNG MÃ ──────────────────────────────────────────────────────────
for t, k in KEY.items():
    if not R(t):
        continue
    seen = {}
    for r in R(t):
        v = str(r.get(k) or "").strip()
        if v:
            seen[v] = seen.get(v, 0) + 1
    dup = [v for v, c in seen.items() if c > 1]
    if dup:
        bad(NANG, "2 trùng mã", "%s.%s: %d mã trùng (vd %s)" % (t, k, len(dup), ", ".join(dup[:3])))

# ── 3. TIỀN ──────────────────────────────────────────────────────────────
if need("DL06", "total_fee", "discount_amount", "final_fee", "paid_amount", "remaining_amount") \
   and need("DL07", "enrollment_id", "amount"):
    for e in R("DL06"):
        tot, dis, fin = n(e.get("total_fee")), n(e.get("discount_amount")), n(e.get("final_fee"))
        paid, rem = n(e.get("paid_amount")), n(e.get("remaining_amount"))
        if tot and abs(tot - dis - fin) > 1:
            bad(NANG, "3 tiền", "%s: gốc %.0f - CK %.0f ≠ phải thu %.0f" % (e.get("enrollment_id"), tot, dis, fin))
        # Đăng ký đã hủy: không còn công nợ để thu, tiền đã hoàn -> miễn quy tắc này
        if fin and abs(paid + rem - fin) > 1 and code(e.get("enrollment_status")) != "cancelled":
            bad(NANG, "3 tiền", "%s: đã đóng %.0f + còn %.0f ≠ phải thu %.0f" % (e.get("enrollment_id"), paid, rem, fin))
        if rem < -0.5:
            bad(NANG, "3 tiền", "%s: công nợ ÂM %.0f (thu quá tay)" % (e.get("enrollment_id"), rem))
        ps = sum(n(p.get("amount")) for p in R("DL07") if str(p.get("enrollment_id")) == str(e.get("enrollment_id")))
        if abs(ps - paid) > 1:
            bad(NANG, "3 tiền", "%s: tổng phiếu thu %.0f ≠ đã đóng %.0f" % (e.get("enrollment_id"), ps, paid))
        if tot and dis > tot * 0.6:
            bad(VUA, "3 tiền", "%s: chiết khấu %.0f%% học phí gốc" % (e.get("enrollment_id"), dis * 100 / tot))
        if dis > 0 and not str(e.get("discount_approved_by") or "").strip():
            bad(NHE, "3 tiền", "%s: chiết khấu %.0f chưa duyệt (hàng chờ)" % (e.get("enrollment_id"), dis))
        if code(e.get("enrollment_status")) == "cancelled" and paid > 0:
            bad(VUA, "3 tiền", "%s: đăng ký đã hủy còn %.0f chưa hoàn" % (e.get("enrollment_id"), paid))

# ── 4. THỨ TỰ THỜI GIAN ──────────────────────────────────────────────────
def order(t1, f1, t2, f2, key1, key2, label, level=VUA, tol_days=0):
    if not (need(t1, f1) and need(t2, f2, key2)):
        return
    src = IDX[t1]
    cnt = []
    for r in R(t2):
        a = src.get(str(r.get(key2) or ""))
        if not a:
            continue
        x, y = dt(a.get(f1)), dt(r.get(f2))
        if x and y and y < x - datetime.timedelta(days=tol_days):
            cnt.append(str(r.get(KEY[t2])))
    if cnt:
        bad(level, "4 thứ tự", "%s: %d hồ sơ (vd %s)" % (label, len(cnt), ", ".join(cnt[:3])))


order("DL02", "lead_created_time", "DL03", "test_date", "lead_id", "lead_id", "test trước khi có lead")
order("DL02", "lead_created_time", "DL06", "enrollment_time", "lead_id", "lead_id", "đăng ký trước khi có lead")
order("DL06", "enrollment_time", "DL07", "payment_time", "enrollment_id", "enrollment_id", "thu tiền trước ngày đăng ký")
order("DL10", "class_start_date", "DL11", "session_date", "class_id", "class_id", "buổi học trước ngày khai giảng", VUA, 1)
if need("DL08", "assigned_at", "class_id", "onboarding_status") and need("DL10", "class_start_date", "class_status"):
    def _midjoin(o, cl):   # HV vào giữa khóa: onboarding chưa xong, mới xếp <=14 ngày, lớp đang chạy
        a = dt(o.get("assigned_at"))
        return (not code(o.get("onboarding_status")) == "completed") and a and (NOW - a).days <= 14 \
            and code(cl.get("class_status")) == "in_progress"
    c = [o for o in R("DL08") if IDX["DL10"].get(str(o.get("class_id") or ""))
         and dt(o.get("assigned_at")) and dt(IDX["DL10"][str(o.get("class_id"))].get("class_start_date"))
         and dt(o.get("assigned_at")) > dt(IDX["DL10"][str(o.get("class_id"))].get("class_start_date"))
         and not _midjoin(o, IDX["DL10"][str(o.get("class_id"))])]
    if c:
        bad(VUA, "4 thứ tự", "xếp lớp SAU ngày khai giảng: %d hồ sơ (vd %s)" % (len(c), ", ".join(str(x.get("onboarding_id")) for x in c[:3])))
if need("DL13", "homework_assigned_time", "homework_submitted_time", "homework_due_date"):
    for h in R("DL13"):
        a, s, du = dt(h.get("homework_assigned_time")), dt(h.get("homework_submitted_time")), dt(h.get("homework_due_date"))
        if a and s and s < a:
            bad(VUA, "4 thứ tự", "%s: nộp bài trước khi được giao" % h.get("homework_id"))
        if a and du and du < a:
            bad(VUA, "4 thứ tự", "%s: hạn nộp trước ngày giao" % h.get("homework_id"))

# ── 5. MÂU THUẪN TRẠNG THÁI ──────────────────────────────────────────────
if need("DL13", "homework_status", "homework_submitted_time"):
    for h in R("DL13"):
        st = code(h.get("homework_status"))
        sub = str(h.get("homework_submitted_time") or "").strip()
        if st in ("submitted_on_time", "submitted_late") and not sub:
            bad(VUA, "5 trạng thái", "%s: ghi đã nộp nhưng không có giờ nộp" % h.get("homework_id"))
        if st == "missing" and sub:
            bad(VUA, "5 trạng thái", "%s: ghi chưa nộp nhưng CÓ giờ nộp" % h.get("homework_id"))
if need("DL09", "student_status") and need("DL08", "student_id", "class_id"):
    inclass = {str(o.get("student_id")) for o in R("DL08") if str(o.get("class_id") or "").strip()}
    for s in R("DL09"):
        if code(s.get("student_status")) == "learning" and str(s.get("student_id")) not in inclass:
            bad(VUA, "5 trạng thái", "%s đang học nhưng chưa được xếp lớp nào (DL08)" % s.get("student_id"))
if need("DL11", "session_status", "session_date"):
    for s in R("DL11"):
        x, st = dt(s.get("session_date")), code(s.get("session_status"))
        if x and x < NOW - datetime.timedelta(days=3) and st in ("scheduled", "planned"):
            bad(VUA, "5 trạng thái", "%s: buổi %s đã qua mà vẫn 'đã lên lịch'" % (s.get("session_id"), s.get("session_date")))
if need("DL12", "session_id", "attendance_status") and need("DL11", "session_date"):
    c = [a for a in R("DL12") if IDX["DL11"].get(str(a.get("session_id") or ""))
         # buổi tối HÔM NAY vẫn được coi là đã diễn ra -> mốc so sánh là cuối ngày
         and (dt(IDX["DL11"][str(a.get("session_id"))].get("session_date")) or NOW) > NOW + datetime.timedelta(days=1)
         and code(a.get("attendance_status")) in ("on_time", "late", "absent")]
    if c:
        bad(NANG, "5 trạng thái", "điểm danh khống cho buổi CHƯA diễn ra: %d bản ghi" % len(c))

# ── 6. QUOTA WOW ─────────────────────────────────────────────────────────
if need("DL14", "wow_status", "quota_deducted", "student_id"):
    for w in R("DL14"):
        st, q = code(w.get("wow_status")), str(w.get("quota_deducted") or "").strip().lower()
        used = q in ("yes", "có", "co", "true", "1")
        if st in ("completed", "no_show") and not used:
            bad(VUA, "6 WOW", "%s: đã dạy/vắng mà KHÔNG trừ quota" % w.get("wow_id"))
        if st in ("booked", "confirmed") and used:
            bad(VUA, "6 WOW", "%s: mới đặt lịch đã trừ quota" % w.get("wow_id"))
        if st == "completed" and not str(w.get("wow_content_note") or "").strip():
            bad(NHE, "6 WOW", "%s: đã dạy chưa ghi nội dung (SLA 24h - hàng chờ)" % w.get("wow_id"))
    if need("DL09", "wow_quota_used"):
        for s in R("DL09"):
            real = len([w for w in R("DL14") if str(w.get("student_id")) == str(s.get("student_id"))
                        and str(w.get("quota_deducted")).strip().lower() in ("yes", "có", "co", "true", "1")])
            if n(s.get("wow_quota_used")) != real:
                bad(VUA, "6 WOW", "%s: quota ghi %.0f ≠ thực dùng %d" % (s.get("student_id"), n(s.get("wow_quota_used")), real))

# ── 7. BỘ ĐẾM ────────────────────────────────────────────────────────────
if need("DL10", "current_enrollment", "class_capacity"):
    for c in R("DL10"):
        real = len([o for o in R("DL08") if str(o.get("class_id")) == str(c.get("class_id"))])
        if int(n(c.get("current_enrollment"))) != real:
            bad(VUA, "7 bộ đếm", "%s: sĩ số ghi %d ≠ thực %d" % (c.get("class_id"), int(n(c.get("current_enrollment"))), real))
        cap = int(n(c.get("class_capacity")))
        if cap and real > cap:
            bad(VUA, "7 bộ đếm", "%s: VƯỢT sức chứa %d/%d" % (c.get("class_id"), real, cap))
if need("DL02", "contact_count"):
    b = [l for l in R("DL02") if int(n(l.get("contact_count"))) != len([x for x in R("DL02b") if str(x.get("lead_id")) == str(l.get("lead_id"))])]
    if b:
        bad(NHE, "7 bộ đếm", "lượt liên hệ lệch số bản ghi chạm: %d lead" % len(b))

# ── 8. MỒ CÔI ────────────────────────────────────────────────────────────
sid = {str(r.get("student_id")) for r in R("DL09")}
for t in ("DL12", "DL13", "DL14", "DL15", "DL16", "DL17", "DL18"):
    if not need(t, "student_id"):
        continue
    o = {str(r.get("student_id")) for r in R(t) if str(r.get("student_id") or "").strip() and str(r.get("student_id")) not in sid}
    if o:
        bad(NANG, "8 mồ côi", "%s có %d mã HV không tồn tại" % (t, len(o)))

# ── 9. ENUM ──────────────────────────────────────────────────────────────
EF = {"DL02": [("lead_status", "enum_lead_status"), ("lead_source", "enum_lead_source")],
      "DL06": [("enrollment_status", "enum_enrollment_status"), ("payment_status", "enum_payment_status")],
      "DL09": [("student_status", "enum_student_status")], "DL10": [("class_status", "enum_class_status")],
      "DL12": [("attendance_status", "enum_attendance_status")], "DL13": [("homework_status", "enum_homework_status")],
      "DL14": [("wow_status", "enum_wow_status")], "DL17": [("complaint_status", "enum_complaint_status")]}
for t, fs in EF.items():
    for f, en in fs:
        if not need(t, f):
            continue
        allowed = {code(v) for v in EN.get(en, [])}
        if not allowed:
            bad(VUA, "9 enum", "danh mục %s KHÔNG có trong bộ enum -> app sẽ hiện mã thô" % en)
            continue
        b = {}
        for r in R(t):
            v = code(r.get(f))
            if v and v not in allowed:
                b[v] = b.get(v, 0) + 1
        for v, c in b.items():
            bad(VUA, "9 enum", "%s.%s = '%s' (%d dòng) không có trong %s" % (t, f, v, c, en))
# enum code mà app gọi nhưng danh mục không có
for en in ("enum_cancellation_reason", "enum_discount_type", "enum_payment_method"):
    if en not in EN:
        bad(VUA, "9 enum", "app dùng %s nhưng danh mục không có" % en)

# ── 10. GIÁ TRỊ NGOÀI THANG ──────────────────────────────────────────────
if need("DL03", "overall_score"):
    for r in R("DL03"):
        for f in ("overall_score", "skill_listening", "skill_reading", "skill_writing", "skill_speaking"):
            v = n(r.get(f))
            if v and not (0 <= v <= 9):
                bad(NANG, "10 thang điểm", "%s.%s = %s (IELTS 0-9)" % (r.get("test_booking_id"), f, r.get(f)))
if need("DL13", "homework_score"):
    for r in R("DL13"):
        v = n(r.get("homework_score"))
        if v and not (0 <= v <= 10):
            bad(NANG, "10 thang điểm", "%s điểm bài tập %s (0-10)" % (r.get("homework_id"), r.get("homework_score")))
if need("DL15", "satisfaction_score"):
    for r in R("DL15"):
        v = n(r.get("satisfaction_score"))
        if v and not (1 <= v <= 5):
            bad(NANG, "10 thang điểm", "%s hài lòng %s (1-5)" % (r.get("survey_id"), r.get("satisfaction_score")))

# ── 11. TRƯỜNG BẮT BUỘC ──────────────────────────────────────────────────
MUST = {"DL02": ["full_name", "phone_number", "lead_status"], "DL09": ["full_name", "student_status"],
        "DL06": ["course_id", "enrollment_status", "enrollment_time"],
        "DL10": ["class_name", "course_id"], "DL11": ["class_id", "session_number"],
        "DL13": ["student_id", "homework_title"]}
for t, fs in MUST.items():
    for f in fs:
        if not need(t, f):
            continue
        e = len([r for r in R(t) if not str(r.get(f) or "").strip()])
        if e:
            bad(VUA, "11 bắt buộc", "%s.%s trống ở %d dòng" % (t, f, e))

# ── 12. ĐỘ THẬT CỦA SLA (không phải lỗi, nhưng phải nằm trong khoảng hợp lý) ──
if need("DL02", "lead_created_time", "first_call_time"):
    lg = sorted([(dt(l["first_call_time"]) - dt(l["lead_created_time"])).total_seconds() / 60
                 for l in R("DL02") if dt(l.get("lead_created_time")) and dt(l.get("first_call_time"))
                 and dt(l["first_call_time"]) >= dt(l["lead_created_time"])])
    if lg:
        over = len([x for x in lg if x > 15])
        pct = over * 100 / len(lg)
        msg = "LRT trung vị %.0f phút | quá hạn %.0f%%" % (lg[len(lg) // 2], pct)
        if pct > 60:
            bad(NANG, "12 độ thật", msg + " -> demo trông như đang vỡ trận, app đỏ toàn tập")
        elif pct < 5:
            bad(NHE, "12 độ thật", msg + " -> quá đẹp, không còn việc để trình diễn tính năng nhắc")
        else:
            NHE.append("[12 độ thật] %s (hợp lý)" % msg)

# ── 13. C-07 TESTIMONIAL & C-08 CHỮ TỰ NHIÊN (chốt từ báo cáo tester) ────
if need("DL18", "testimonial_given", "final_test_score"):
    b = [r for r in R("DL18") if str(r.get("testimonial_given") or "").strip()
         and not str(r.get("final_test_score") or "").strip()]
    if b:
        bad(VUA, "13 C-07", "testimonial khi CHƯA có điểm đầu ra: %d dòng (vd %s)"
            % (len(b), ", ".join(str(x.get("course_end_id")) for x in b[:3])))
if need("DL02b", "content", "result_note"):
    # content phải là câu Việt tự nhiên; result_note theo định dạng app "code (Nhãn)" - cấm mã trần
    RAWCODE = re.compile(r"^\s*[a-z][a-z0-9_]*\s*$")
    b1 = [t for t in R("DL02b") if RAWCODE.match(str(t.get("content") or "x")) or RAWCODE.match(str(t.get("result_note") or "x"))]
    if b1:
        bad(VUA, "13 C-08", "DL02b content/result_note chứa mã enum thô: %d dòng (vd %s)"
            % (len(b1), ", ".join(str(x.get("touchpoint_id")) for x in b1[:3])))
    b2 = [t for t in R("DL02b") if str(t.get("result_note") or "").strip()
          and "(" not in str(t.get("result_note"))]
    if b2:
        bad(NHE, "13 C-08", "DL02b result_note thiếu nhãn Việt kèm mã: %d dòng" % len(b2))

# ── 14. TRƯỜNG SỐNG (pause_until / next_payment_due / mid_*) ─────────────
if need("DL09", "student_status", "pause_until"):
    trans = [s for s in R("DL09") if code(s.get("student_status")) == "transferred"]
    have = [s for s in trans if dt(s.get("pause_until"))]
    if trans and not have:
        bad(VUA, "14 trường sống", "HV bảo lưu không có hạn pause_until - app không nhắc gọi lại được")
    soon = [s for s in have if 0 <= (dt(s["pause_until"]) - NOW).days <= 14]
    over = [s for s in have if dt(s["pause_until"]) < NOW]
    if have and not soon:
        bad(NHE, "14 trường sống", "chưa có ca bảo lưu sắp hết hạn <=14 ngày (demo nhắc nhở)")
    if have and not over:
        bad(NHE, "14 trường sống", "chưa có ca bảo lưu vừa quá hạn (demo cảnh báo đỏ)")
if need("DL06", "next_payment_due", "remaining_amount"):
    dued = [e for e in R("DL06") if dt(e.get("next_payment_due"))]
    today = [e for e in dued if dt(e["next_payment_due"]).date() == NOW.date()]
    late = [e for e in dued if dt(e["next_payment_due"]) < NOW - datetime.timedelta(days=0)
            and dt(e["next_payment_due"]).date() != NOW.date()]
    if not today:
        bad(NHE, "14 trường sống", "không có hẹn thu nào ĐÚNG HÔM NAY")
    if not late:
        bad(NHE, "14 trường sống", "không có hẹn thu quá hạn (demo nhắc nợ)")
if need("DL08", "mid_overall"):
    mids = [o for o in R("DL08") if str(o.get("mid_overall") or "").strip()]
    for o in mids:
        v = n(o.get("mid_overall"))
        if v and not (0 <= v <= 9):
            bad(NANG, "14 trường sống", "%s mid_overall=%s ngoài thang IELTS" % (o.get("onboarding_id"), o.get("mid_overall")))
    if not mids:
        bad(NHE, "14 trường sống", "chưa có điểm giữa khóa mid_* nào (màn midForm trống)")

# ── KẾT ──────────────────────────────────────────────────────────────────
print("=" * 74)
print("KIEM DU LIEU · %d bang · %d dong" % (len(dl), sum(len(v) for v in dl.values())))
print("=" * 74)
if WARN:
    print("\n!!! QUY TAC BI VO HIEU (sai/thieu ten cot - PHAI SUA NGAY):")
    for w in sorted(set(WARN)):
        print("   -", w)
for lbl, arr in (("LOI NANG", NANG), ("LOI VUA", VUA), ("GHI CHU / HANG CHO", NHE)):
    print("\n### %s: %d" % (lbl, len(arr)))
    for m in arr[:15]:
        print("   -", m)
    if len(arr) > 15:
        print("   ... con", len(arr) - 15)
print("\n" + ("=" * 74))
if NANG or WARN:
    print("KET QUA: CO LOI NANG - khong nen dung ban demo nay")
    sys.exit(1)
print("KET QUA: DAT (loi vua: %d, ghi chu: %d)" % (len(VUA), len(NHE)))
