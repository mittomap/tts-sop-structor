# -*- coding: utf-8 -*-
"""
VÁ DỮ LIỆU DEMO — sửa 7 nhóm mâu thuẫn tìm được trong đợt audit V8.

Nguyên tắc: KHÔNG vá điểm-theo-điểm. Mỗi lần sửa một con số thì phải kéo theo
mọi con số phụ thuộc (quota, sĩ số, tiền, bộ đếm), rồi chạy check_data.py xác nhận.

THỨ TỰ CHẠY: gen_demo.py -> seed_giaoan.py -> mkdemo.py -> fixdata.py -> gen_v5.py
"""
import json, re, random, datetime, os

P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo_data_big.json")
NOW = datetime.datetime.now().replace(second=0, microsecond=0)   # dữ liệu neo theo NGÀY CHẠY
random.seed(20260722)
DEMO_IDS = {"HV061", "HV065", "HV002"}   # 3 hồ sơ demo nổi bật - không được xáo trộn

d = json.load(open(P, encoding="utf-8"))
dl = d["dl"]
log = []


def R(t):
    return dl.get(t, [])


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


def fmt(x):
    return x.strftime("%d/%m/%Y %H:%M")


def n(v):
    s = re.sub(r"[^0-9.\-]", "", str(v or ""))
    try:
        return float(s) if s not in ("", "-", ".") else 0.0
    except Exception:
        return 0.0


IDX = {t: {str(r.get(k) or ""): r for r in R(t)} for t, k in [
    ("DL02", "lead_id"), ("DL05", "course_id"), ("DL06", "enrollment_id"),
    ("DL09", "student_id"), ("DL10", "class_id"), ("DL11", "session_id"), ("DL01", "staff_id")]}

# ═══ 1. SLA PHẢN HỒI LEAD ════════════════════════════════════════════════
# Hiện: 194/194 lead đều vượt SLA 15 phút, trung vị 5,3 ngày -> app đỏ toàn tập.
# Sửa: 70% gọi trong 15 phút, 20% trong 1 giờ, 10% trễ hẳn (để vẫn có việc mà làm).
fixed = 0
leads = [l for l in R("DL02") if dt(l.get("lead_created_time")) and dt(l.get("first_call_time"))]
for i, l in enumerate(leads):
    born = dt(l.get("lead_created_time"))
    r = random.random()
    if r < 0.70:
        lag = random.randint(1, 14)                      # đạt SLA
    elif r < 0.90:
        lag = random.randint(16, 55)                     # trễ nhẹ trong giờ
    else:
        lag = random.randint(90, 60 * 26)                # trễ hẳn - hàng cần xử lý
    call = born + datetime.timedelta(minutes=lag)
    l["first_call_time"] = fmt(call)
    # chạm đầu tiên trong DL02b phải khớp giờ gọi mới
    tps = sorted([x for x in R("DL02b") if str(x.get("lead_id")) == str(l.get("lead_id"))],
                 key=lambda x: dt(x.get("contact_time")) or NOW)
    if tps:
        first = tps[0]
        if (dt(first.get("contact_time")) or NOW) < call:
            first["contact_time"] = fmt(call)
    fixed += 1
lags = sorted([(dt(l["first_call_time"]) - dt(l["lead_created_time"])).total_seconds() / 60 for l in leads])
over = len([x for x in lags if x > 15])
log.append("1. SLA gọi lần đầu: sửa %d lead | trung vị %.0f phút | quá hạn %d/%d = %.0f%%"
           % (fixed, lags[len(lags) // 2], over, len(lags), over * 100 / len(lags)))

# ═══ 2. QUOTA WOW ════════════════════════════════════════════════════════
# Quota chỉ trừ khi ĐÃ DẠY hoặc HV KHÔNG ĐẾN. Buổi mới đặt/đã xác nhận thì chưa trừ.
un = 0
for w in R("DL14"):
    st = code(w.get("wow_status"))
    should = "yes" if st in ("completed", "no_show") else "no"
    if str(w.get("quota_deducted") or "").strip().lower() != should:
        w["quota_deducted"] = should
        un += 1
# tính lại số buổi đã dùng + SỐ CÒN LẠI ở DL09
rq = 0; rr = 0
for s in R("DL09"):
    used = len([w for w in R("DL14")
                if str(w.get("student_id")) == str(s.get("student_id"))
                and str(w.get("quota_deducted")).lower() == "yes"])
    if n(s.get("wow_quota_used")) != used:
        s["wow_quota_used"] = used
        rq += 1
    # DL09 KHÔNG có cột wow_quota_total (nhánh cũ đọc cột không tồn tại nên chết vô hại
    # và che mất lỗi thật): tổng quota = default + extra_approved + extra_purchased.
    tot = n(s.get("wow_quota_default")) + n(s.get("wow_extra_approved")) + n(s.get("wow_extra_purchased"))
    if used > tot:                    # dùng quá quota được cấp -> ghi nhận phần duyệt thêm
        s["wow_extra_approved"] = int(n(s.get("wow_extra_approved")) + (used - tot)); tot = used
    if n(s.get("wow_quota_remaining")) != tot - used:
        s["wow_quota_remaining"] = int(tot - used); rr += 1
log.append("2. Quota WOW: sửa cờ trừ quota %d buổi | số buổi đã dùng %d HV | số buổi còn lại %d HV" % (un, rq, rr))

# ═══ 3. CHIẾT KHẤU CHỜ DUYỆT ═════════════════════════════════════════════
# Duyệt hết, chừa lại 2 hồ sơ chờ duyệt để trang Duyệt còn việc.
APPR = [s for s in R("DL01") if re.search(r"sales_manager|accounting_manager", str(s.get("role") or ""))]
appr = APPR[0] if APPR else R("DL01")[0]
pend = [e for e in R("DL06") if n(e.get("discount_amount")) > 0
        and not str(e.get("discount_approved_by") or "").strip()]
# hồ sơ demo (mkdemo cố tình để chờ duyệt) LUÔN giữ lại + 1 hồ sơ thường
keep = [e for e in pend if str(e.get("student_id")) in DEMO_IDS]
keep += [e for e in pend if e not in keep][-1:]
done = 0
for e in pend:
    if e in keep:
        e["discount_approved_by"] = ""
        e["discount_approved_at"] = ""
        continue
    base = dt(e.get("enrollment_time")) or NOW
    e["discount_approved_by"] = appr["staff_id"]
    e["discount_approved_by_name"] = appr.get("full_name", "")
    e["discount_approved_at"] = fmt(base - datetime.timedelta(hours=random.randint(1, 20)))
    done += 1
log.append("3. Chiết khấu: duyệt %d hồ sơ (người duyệt %s) | chừa %d hồ sơ chờ duyệt để có việc"
           % (done, appr.get("full_name"), len(keep)))

# ═══ 4. XẾP LỚP SAU NGÀY KHAI GIẢNG ══════════════════════════════════════
# Học viên phải được xếp TRƯỚC khi lớp khai giảng. Kéo cả chuỗi onboarding lên trước.
moved = 0
for o in R("DL08"):
    c = IDX["DL10"].get(str(o.get("class_id") or ""))
    if not c:
        continue
    start = dt(c.get("class_start_date"))
    a = dt(o.get("assigned_at"))
    if not (start and a and a > start):
        continue
    # HV vào GIỮA KHÓA (hợp lệ theo SOP): onboarding chưa xong + mới xếp trong 14 ngày + lớp đang chạy
    if (not code(o.get("onboarding_status")) == "completed") and (NOW - a).days <= 14 \
       and code(c.get("class_status")) == "in_progress":
        continue
    new_assign = start - datetime.timedelta(days=random.randint(3, 10), hours=random.randint(0, 8))
    delta = a - new_assign
    o["assigned_at"] = fmt(new_assign)
    for f in ("class_info_sent_at", "confirmation_time", "onboarding_completed_at"):
        old = dt(o.get(f))
        if old:
            o[f] = fmt(old - delta)
    moved += 1
log.append("4. Xếp lớp: kéo %d hồ sơ onboarding về trước ngày khai giảng (giữ nguyên khoảng cách các mốc)" % moved)

# ═══ 5. LỚP VƯỢT SỨC CHỨA ════════════════════════════════════════════════
# Dời học viên thừa sang lớp cùng khóa còn chỗ; không có chỗ thì nới sức chứa.
byclass = {}
for o in R("DL08"):
    byclass.setdefault(str(o.get("class_id")), []).append(o)
mv, wid = 0, 0
for c in R("DL10"):
    cid = str(c.get("class_id"))
    cap = int(n(c.get("class_capacity")))
    lst = byclass.get(cid, [])
    if not cap or len(lst) <= cap:
        continue
    excess = len(lst) - cap
    # chỉ dời sang lớp CÙNG KHÓA đang chạy/đang tuyển (dời vào lớp "đang lên kế hoạch" là mất buổi học)
    alts = [x for x in R("DL10")
            if str(x.get("course_id")) == str(c.get("course_id")) and str(x.get("class_id")) != cid
            and code(x.get("class_status")) in ("in_progress", "open")
            and int(n(x.get("class_capacity"))) - len(byclass.get(str(x.get("class_id")), [])) > 0]
    # không bao giờ dời 3 hồ sơ demo
    movable = [o for o in lst if str(o.get("student_id")) not in DEMO_IDS]
    for o in movable[-excess:]:
        tgt = None
        for a in alts:
            aid = str(a.get("class_id"))
            if len(byclass.get(aid, [])) < int(n(a.get("class_capacity"))):
                tgt = a
                break
        if tgt:
            aid = str(tgt.get("class_id"))
            o["class_id"] = aid
            o["class_id_name"] = tgt.get("class_name", "")
            byclass.setdefault(aid, []).append(o)
            byclass[cid].remove(o)
            # DL09 KHÔNG có cột class_id - liên kết HV<->lớp chỉ nằm ở DL08.
            # Đừng tạo cột ma ở đây (bộ kiểm sẽ hô "quy tắc bị vô hiệu").
            mv += 1
        else:
            c["class_capacity"] = len(byclass.get(cid, []))
            wid += 1
            break
log.append("5. Sức chứa: dời %d học viên sang lớp cùng khóa còn chỗ | nới sức chứa %d lớp (không còn lớp thay thế)" % (mv, wid))

# ═══ 6. HOÀN TIỀN CHO ĐĂNG KÝ ĐÃ HỦY ═════════════════════════════════════
nxt = max([int((str(p.get("payment_id") or "").split("-")[-1] or 0)) for p in R("DL07")
           if str(p.get("payment_id") or "").split("-")[-1].isdigit()] or [0])
# GIỮ LẠI đúng 1 ca hủy MỚI NHẤT chưa hoàn (hàng chờ "Duyệt Hoàn tiền" phải có việc bấm ngay)
_cxl = [e for e in R("DL06") if code(e.get("enrollment_status")) == "cancelled" and n(e.get("paid_amount")) > 0
        and not code(e.get("payment_status")) == "refunded"]
_cxl.sort(key=lambda e: dt(e.get("enrollment_time")) or NOW)
KEEP_REFUND = _cxl[-1:]
for e in KEEP_REFUND:
    e["next_action"] = "Tính số hoàn theo mốc CH2 rồi trình duyệt hoàn tiền."
ref = 0
for e in R("DL06"):
    if code(e.get("enrollment_status")) != "cancelled":
        continue
    if e in KEEP_REFUND:
        continue
    paid = n(e.get("paid_amount"))
    if paid <= 0:
        continue
    already = [p for p in R("DL07") if str(p.get("enrollment_id")) == str(e.get("enrollment_id"))
               and n(p.get("amount")) < 0]
    if already:
        continue
    base = dt(e.get("enrollment_time")) or NOW
    nxt += 1
    acc = [s for s in R("DL01") if "accounting" in str(s.get("role") or "")]
    acc = acc[0] if acc else R("DL01")[0]
    R("DL07").insert(0, {
        "payment_id": "PAY-2026-%03d" % nxt,
        "enrollment_id": e.get("enrollment_id"),
        "student_id": e.get("student_id", ""),
        "lead_id": e.get("lead_id", ""),
        "student_id_name": e.get("student_id_name", "") or e.get("lead_id_name", ""),
        "next_action": "",
        # hoàn tiền phải SAU ngày hủy nhưng KHÔNG được rơi vào tương lai
        "payment_time": fmt(min(base + datetime.timedelta(days=random.randint(2, 9)),
                                NOW - datetime.timedelta(hours=random.randint(2, 20)))),
        "payment_method": "bank_transfer (Chuyển khoản NH)",
        "amount": -paid, "transaction_fee": 0, "net_received": -paid,
        "bank_name": "ACB", "sender_name": "IELTS The Tutors",
        "transaction_ref": "REFUND-%s" % e.get("enrollment_id"),
        "received_by": acc["staff_id"], "received_by_name": acc.get("full_name", ""),
        "verified_by": acc["staff_id"], "verified_by_name": acc.get("full_name", ""),
        "payment_note": "Hoàn học phí do hủy đăng ký · %s" % (e.get("cancellation_reason") or ""),
    })
    # Giữ nguyên total_fee/final_fee (giá trị hợp đồng, còn dùng để báo cáo doanh thu mất).
    # Hủy rồi thì không còn công nợ để thu, và tiền đã đóng đã hoàn hết.
    e["paid_amount"] = 0
    e["remaining_amount"] = 0
    e["payment_status"] = "refunded (Đã hoàn tiền)" if "refunded" in str(
        d["enums"].get("enum_payment_status", [])) else e.get("payment_status")
    ref += 1
log.append("6. Hoàn tiền: tạo %d phiếu hoàn cho đăng ký đã hủy, đưa công nợ về 0" % ref)

# ═══ 7. THỨ TỰ THỜI GIAN NGƯỢC ═══════════════════════════════════════════
# 7a. tư vấn không được diễn ra trước ngày test
tcol = [c for c in R("DL04")[0].keys() if "date" in c or "time" in c][0]
lastest = {}
for t in R("DL03"):
    x = dt(t.get("test_date"))
    if x:
        k = str(t.get("lead_id"))
        lastest[k] = max(lastest.get(k, x), x)
c7 = 0
for c in R("DL04"):
    a, b = lastest.get(str(c.get("lead_id"))), dt(c.get(tcol))
    if a and b and b < a:
        c[tcol] = fmt(a + datetime.timedelta(hours=random.randint(3, 30)))
        c7 += 1
# 7b. đăng ký không được có trước lead
c7b = 0
for e in R("DL06"):
    L = IDX["DL02"].get(str(e.get("lead_id") or ""))
    if not L:
        continue
    a, b = dt(L.get("lead_created_time")), dt(e.get("enrollment_time"))
    if a and b and b < a:
        new = a + datetime.timedelta(days=random.randint(1, 5))
        # phiếu thu của đăng ký này phải nằm SAU ngày đăng ký mới -> kéo theo
        for p in R("DL07"):
            if str(p.get("enrollment_id")) != str(e.get("enrollment_id")):
                continue
            pt = dt(p.get("payment_time"))
            if pt and pt < new:
                p["payment_time"] = fmt(new + datetime.timedelta(hours=random.randint(2, 48)))
        e["enrollment_time"] = fmt(new)
        c7b += 1
# 7c. giờ nộp bài không được trước giờ giao
c7c = 0
for h in R("DL13"):
    a, b = dt(h.get("homework_assigned_time")), dt(h.get("homework_submitted_time"))
    if a and b and b < a:
        h["homework_submitted_time"] = fmt(a + datetime.timedelta(hours=random.randint(3, 60)))
        c7c += 1
# 7c-bis. NHÃN NỘP luôn SUY RA từ giờ nộp thực tế - mọi pass phía trên đều có thể dời giờ nộp
c7d = 0
for h in R("DL13"):
    sub, due = dt(h.get("homework_submitted_time")), dt(h.get("homework_due_date"))
    if not (sub and due):
        continue
    late = sub.date() > due.date()
    want_st = "submitted_late (Nộp trễ)" if late else "submitted_on_time (Nộp đúng/trước hạn)"
    want_fl = "Có" if late else "Không"
    if str(h.get("homework_status") or "") != want_st or str(h.get("is_late") or "") != want_fl:
        h["homework_status"] = want_st; h["is_late"] = want_fl; c7d += 1
# 7e. công nợ nào cũng phải có HẸN THU (các pass trên có thể đẻ công nợ mới)
c7e = 0
for e in R("DL06"):
    if n(e.get("remaining_amount")) > 0 and code(e.get("enrollment_status")) == "confirmed" \
       and not str(e.get("next_payment_due") or "").strip():
        base = dt(e.get("enrollment_time")) or NOW
        due = max(base + datetime.timedelta(days=30), NOW + datetime.timedelta(days=random.choice([3, 5, 7, 10, 14])))
        e["next_payment_due"] = due.strftime("%d/%m/%Y"); c7e += 1
# 7f. không phiếu thu nào được ghi ngày TƯƠNG LAI
c7f = 0
for p_ in R("DL07"):
    pt = dt(p_.get("payment_time"))
    if pt and pt > NOW:
        p_["payment_time"] = fmt(NOW - datetime.timedelta(hours=random.randint(2, 30))); c7f += 1
# 7g. net_received luôn = amount - transaction_fee
c7g = 0
for p_ in R("DL07"):
    want = n(p_.get("amount")) - n(p_.get("transaction_fee"))
    if abs(n(p_.get("net_received")) - want) > 1:
        p_["net_received"] = int(want); c7g += 1
log.append("7c. Nộp bài: đẩy %d bài về sau giờ được giao | suy lại nhãn nộp %d bài" % (c7c, c7d))
log.append("7e-g. Hẹn thu bù %d đơn | kéo %d phiếu thu khỏi tương lai | vá %d dòng net_received" % (c7e, c7f, c7g))
log.append("7. Thứ tự thời gian: đẩy %d phiếu tư vấn về sau ngày test | %d đăng ký về sau ngày tạo lead" % (c7, c7b))

# ═══ 8. BỘ ĐẾM PHỤ THUỘC ═════════════════════════════════════════════════
c8 = 0
for c in R("DL10"):
    real = len([o for o in R("DL08") if str(o.get("class_id")) == str(c.get("class_id"))])
    if int(n(c.get("current_enrollment"))) != real:
        c["current_enrollment"] = real
        c8 += 1
c8b = 0
for l in R("DL02"):
    real = len([x for x in R("DL02b") if str(x.get("lead_id")) == str(l.get("lead_id"))])
    if int(n(l.get("contact_count"))) != real:
        l["contact_count"] = real
        c8b += 1
    tps = [dt(x.get("contact_time")) for x in R("DL02b") if str(x.get("lead_id")) == str(l.get("lead_id"))]
    tps = [x for x in tps if x]
    if tps:
        l["last_contact_time"] = fmt(max(tps))
log.append("8. Bộ đếm: cập nhật sĩ số %d lớp | lượt liên hệ %d lead | đồng bộ lần chạm gần nhất" % (c8, c8b))

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print("=" * 70)
print("VA DU LIEU DEMO — XONG")
print("=" * 70)
for x in log:
    print("  " + x)
print("\nDA GHI", P)

# ═══ 9. DANH MỤC ENUM THIẾU ══════════════════════════════════════════════
# App gọi eFull("enum_cancellation_reason",...) nhưng danh mục không có bộ này
# -> eFull trả chuỗi trần, người dùng nhìn thấy MÃ LẬP TRÌNH trên màn hình.
if "enum_cancellation_reason" not in d["enums"]:
    d["enums"]["enum_cancellation_reason"] = [
        "cancelled_by_student (Học viên tự hủy)",
        "cancelled_by_itts (Trung tâm hủy)",
        "financial (Lý do tài chính)",
        "schedule_conflict (Trùng lịch, không sắp xếp được)",
        "moved_away (Chuyển nơi ở / đi xa)",
        "health (Lý do sức khỏe)",
        "switched_center (Chuyển sang trung tâm khác)",
        "other (Lý do khác)",
    ]
    json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
    print("  9. Danh mục: thêm enum_cancellation_reason (8 giá trị)")

# ═══ 10. BUỔI ĐÃ DẠY MÀ KHÔNG AI ĐIỂM DANH ═══════════════════════════════
# 52/141 buổi ghi "đã hoàn thành" nhưng không có một bản ghi điểm danh nào
# -> KPI ADC (tuân thủ điểm danh của GV) chỉ 63%, và nhật ký buổi học trống trơn.
# Vá phần lớn, CHỪA LẠI 8 buổi để trang Điểm danh còn hàng chờ thật.
byses = {}
for a in R("DL12"):
    byses.setdefault(str(a.get("session_id")), []).append(a)
bycls = {}
for o in R("DL08"):
    bycls.setdefault(str(o.get("class_id")), []).append(o)
missing = [s for s in R("DL11")
           if code(s.get("session_status")) == "completed" and not byses.get(str(s.get("session_id")))
           and bycls.get(str(s.get("class_id")))]
missing.sort(key=lambda s: dt(s.get("session_date")) or NOW)
# KHÔNG chừa buổi CŨ làm hàng chờ: buổi cách cả tháng chưa điểm danh là dữ liệu hỏng chứ
# không phải "việc cần làm". Hàng chờ thật lấy từ buổi VỪA DẠY XONG ở khối 10b bên dưới.
leave = []
nxt_at = max([int((str(a.get("attendance_id") or "").split("-")[-1] or 0))
              for a in R("DL12") if str(a.get("attendance_id") or "").split("-")[-1].isdigit()] or [0])
made = 0
for s in missing:
    if s in leave:
        continue
    sd = dt(s.get("session_date"))
    for o in bycls[str(s.get("class_id"))]:
        st = IDX["DL09"].get(str(o.get("student_id")))
        r = random.random()
        if r < 0.84:
            stt, absn, perf = "on_time (Đúng giờ)", "", random.choice(["good (Tốt)", "average (Bình thường)", "good (Tốt)"])
        elif r < 0.92:
            stt, absn, perf = "late (Trễ)", "", "average (Bình thường)"
        else:
            stt, absn, perf = "no_show (Vắng)", random.choice(
                ["excused (Có phép)", "unexcused (Không phép)"]), ""
        nxt_at += 1
        R("DL12").append({
            "attendance_id": "AT-%04d" % nxt_at, "session_id": s.get("session_id"),
            "student_id": o.get("student_id"), "student_name": (st or {}).get("full_name", ""),
            "attendance_status": stt, "absence_type": absn,
            "check_in_time": fmt(sd + datetime.timedelta(minutes=random.randint(-8, 12))) if sd and stt != "no_show (Vắng)" else "",
            "in_class_performance": perf, "note": "", "next_action": "",
        })
        made += 1
log.append("10. Điểm danh: bù %d bản ghi cho %d buổi đã dạy mà bỏ trống" % (made, len(missing) - len(leave)))
# 10b. HÀNG CHỜ ĐIỂM DANH phải là buổi VỪA DẠY XONG (GV chưa kịp điểm danh), không phải
# buổi từ tháng trước. Để trống đúng 2 buổi hoàn thành gần nhất.
_done = [x for x in R("DL11") if code(x.get("session_status")) == "completed" and dt(x.get("session_date"))]
_done.sort(key=lambda x: dt(x.get("session_date")), reverse=True)
_queue = {str(x.get("session_id")) for x in _done[:2]}
if _queue:
    dl["DL12"] = [a for a in R("DL12") if str(a.get("session_id")) not in _queue]
log.append("10b. Hàng chờ điểm danh: để trống %d buổi VỪA DẠY XONG (%s)" % (len(_queue), ", ".join(sorted(_queue))))

# ═══ 11. HỌC VIÊN NGUY CƠ ĐÃ HỒI PHỤC ════════════════════════════════════
# 18 HV có ghi lý do nguy cơ nhưng KHÔNG AI hồi phục -> KPI RCR = 0%, khối
# "can thiệp HV nguy cơ" trông như làm mà không có tác dụng.
risky = [s for s in R("DL09")
         if re.search(r"at_risk|off_track", code(s.get("attendance_progress_status")) + " " + code(s.get("academic_progress_status")))
         and code(s.get("student_status")) == "active"          # HV bỏ học giữ cờ off_track (đúng bản chất)
         and str(s.get("student_id")) not in DEMO_IDS]
rec = 0
for s in risky[:4]:
    old = []
    if re.search(r"at_risk|off_track", code(s.get("attendance_progress_status"))):
        old.append("chuyên cần")
        s["attendance_progress_status"] = "on_track (Đang đều đặn)"
    if re.search(r"at_risk|off_track", code(s.get("academic_progress_status"))):
        old.append("học thuật")
        s["academic_progress_status"] = "on_track (Đang tiến bộ)"
    note = "Đã can thiệp: gọi phụ huynh, xếp buổi WOW bổ trợ, giao bài riêng theo kỹ năng yếu. " \
           "Nay đã trở lại đúng tiến độ (%s)." % ", ".join(old)
    s["learning_followup_note"] = note
    rec += 1
log.append("11. Nguy cơ: đưa %d học viên từ diện nguy cơ trở lại đúng tiến độ (có ghi chú can thiệp)" % rec)

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print("  10-11. Da ghi bo sung diem danh + hoi phuc HV nguy co")

# ═══ 12. MÃ GIỚI THIỆU (referral) — lưu bền + sổ liên kết DL22 ══════════════
# Trước đây mã sinh tại chỗ trong JS, không lưu, không theo dõi được ai dùng mã ai.
# Nay: (a) gán referral_code cố định cho mọi HV; (b) dựng DL22 = sổ giới thiệu,
# mỗi dòng là một lần bạn được giới thiệu dùng mã của một HV. Để KHÔNG phá các
# quy tắc tiền, ta KHÔNG đổi số tiền — chỉ gắn nhãn chiết khấu sẵn có thành 'referral'.
import unicodedata

def _vnorm(s):
    s = str(s or "").lower()
    s = "".join(c for c in unicodedata.normalize("NFD", s) if unicodedata.category(c) != "Mn")
    return s.replace("đ", "d")

def ref_code(S):
    base = re.sub(r"[^a-z0-9]", "", _vnorm(S.get("full_name") or S.get("student_id") or ""))
    tag = (base[:4] if base else "hv").upper()
    s = str(S.get("student_id") or "") + "|" + str(S.get("full_name") or "")
    h = 0
    for ch in s:
        h = (h * 33 + ord(ch)) & 0xFFFFFFFF
    return "ITT-" + tag + "-" + ("0000" + str(h % 10000))[-4:]

# (a) gán mã cho mọi học viên
for s in R("DL09"):
    s["referral_code"] = ref_code(s)

# (b) chọn "đại sứ": ưu tiên 3 Demo + vài HV đang học/đã hoàn thành, đứng đầu danh sách
demo_ids = ["HV061", "HV065", "HV002"]
others = [s for s in R("DL09")
          if s.get("student_id") not in demo_ids
          and code(s.get("student_status")) in ("active", "completed")]
random.shuffle(others)
ambassadors = [IDX["DL09"].get(i) for i in demo_ids if IDX["DL09"].get(i)] + others[:5]

# nguồn "bạn được giới thiệu ĐÃ đăng ký": các đăng ký đang có chiết khấu (khác của chính đại sứ)
amb_ids = {a["student_id"] for a in ambassadors}
disc_enr = [e for e in R("DL06")
            if n(e.get("discount_amount")) > 0 and str(e.get("student_id")) not in amb_ids
            and not code(e.get("enrollment_status")) == "cancelled"]
random.shuffle(disc_enr)

# nguồn "bạn được giới thiệu CHƯA đăng ký": lead nguồn giới thiệu chưa converted
ref_leads = [l for l in R("DL02")
             if code(l.get("lead_source")) == "referral" and not code(l.get("lead_status")) == "converted"]
random.shuffle(ref_leads)

friend_off_val = 10  # % — khớp mặc định referralFriend_discount
dl["DL22"] = []
rid = 0
ei, li = 0, 0
for a in ambassadors:
    code_a = a["referral_code"]
    nlink = random.randint(1, 3)
    for _ in range(nlink):
        rid += 1
        use_enrolled = ei < len(disc_enr) and random.random() < 0.7
        if use_enrolled:
            e = disc_enr[ei]; ei += 1
            fr = IDX["DL09"].get(str(e.get("student_id"))) or {}
            # gắn nhãn: chiết khấu này là do giới thiệu (KHÔNG đổi số tiền)
            e["discount_type"] = "referral (Giới thiệu)"
            e["discount_reason"] = "Giới thiệu bởi %s · mã %s" % (a.get("full_name", ""), code_a)
            # 2 lượt ĐÃ đăng ký đầu tiên: CHƯA trả thưởng người giới thiệu -> hàng chờ trao thưởng
            _rewarded = "no" if len([x for x in dl["DL22"] if code(x.get("status")) == "enrolled"]) < 2 else "yes"
            dl["DL22"].append({
                "referral_id": "RF-%03d" % rid, "referral_code": code_a,
                "referrer_student_id": a["student_id"], "referrer_name": a.get("full_name", ""),
                "referred_name": fr.get("full_name", e.get("student_id_name", "")),
                "referred_phone": fr.get("phone_number", ""),
                "referred_lead_id": e.get("lead_id", ""), "referred_enrollment_id": e.get("enrollment_id", ""),
                "used_date": e.get("enrollment_time", ""), "status": "enrolled (Đã đăng ký)",
                "friend_discount_amount": int(n(e.get("discount_amount"))),
                "referrer_rewarded": _rewarded,
                "note": "Bạn được giới thiệu đã đăng ký và nhận ưu đãi." + ("" if _rewarded == "yes" else " Chưa trao thưởng người giới thiệu."),
            })
        elif li < len(ref_leads):
            l = ref_leads[li]; li += 1
            l["referrer_name"] = a.get("full_name", "")
            l["lead_note"] = (str(l.get("lead_note") or "") + " | " if l.get("lead_note") else "") + "Dùng mã giới thiệu " + code_a + " của " + a.get("full_name", "")
            dl["DL22"].append({
                "referral_id": "RF-%03d" % rid, "referral_code": code_a,
                "referrer_student_id": a["student_id"], "referrer_name": a.get("full_name", ""),
                "referred_name": l.get("full_name", ""), "referred_phone": l.get("phone_number", ""),
                "referred_lead_id": l.get("lead_id", ""), "referred_enrollment_id": "",
                "used_date": l.get("lead_created_time", ""), "status": "pending (Chưa đăng ký)",
                "friend_discount_amount": 0, "referrer_rewarded": "no",
                "note": "Bạn được giới thiệu đang cân nhắc, chưa đăng ký.",
            })

# (c) tổng hợp về DL09 để đọc nhanh
for a in ambassadors:
    evs = [x for x in dl["DL22"] if x["referrer_student_id"] == a["student_id"]]
    a["referral_uses"] = len(evs)
    a["referral_enrolled"] = len([x for x in evs if code(x["status"]) == "enrolled"])

# (d) DL19 = SỔ THƯỞNG GIỚI THIỆU (app đếm rows("DL19") có reward_status=pending ở chặng D).
# Mỗi lượt giới thiệu ĐÃ đăng ký sinh 1 quyền thưởng cho người giới thiệu; lượt chưa trả
# thưởng (referrer_rewarded=no bên DL22) nằm ở trạng thái pending - hàng chờ trao thưởng.
dl["DL19"] = []
_rw = 0
for x in dl["DL22"]:
    if code(x.get("status")) != "enrolled":
        continue
    _rw += 1
    _pending = str(x.get("referrer_rewarded", "")).strip().lower() != "yes"
    _used = dt(x.get("used_date")) or NOW
    dl["DL19"].append({
        "reward_id": "RW-%03d" % _rw, "referral_id": x.get("referral_id", ""),
        "referral_code": x.get("referral_code", ""),
        "referrer_student_id": x.get("referrer_student_id", ""), "referrer_name": x.get("referrer_name", ""),
        "referred_name": x.get("referred_name", ""),
        "reward_content": "1 buổi WOW 1-1 miễn phí",
        "reward_status": "pending (Chờ trao thưởng)" if _pending else "granted (Đã trao thưởng)",
        "created_at": x.get("used_date", ""),
        "granted_at": "" if _pending else fmt(_used + datetime.timedelta(days=random.randint(1, 5))),
        "granted_by": "" if _pending else appr.get("full_name", ""),
        "note": "Thưởng theo chính sách referralReferrer_reward." if not _pending else "Bạn được giới thiệu đã đăng ký - chờ trao thưởng cho người giới thiệu.",
    })

log.append("12. Mã giới thiệu: gán mã cho %d HV | %d đại sứ | sổ DL22 %d lượt (%d đã đăng ký) | DL19 %d thưởng (%d chờ trao)"
           % (len(R("DL09")), len(ambassadors), len(dl["DL22"]),
              len([x for x in dl["DL22"] if code(x["status"]) == "enrolled"]),
              len(dl["DL19"]), len([x for x in dl["DL19"] if code(x["reward_status"]) == "pending"])))


# ═══ 13. CHUẨN HOÁ NHÃN ENUM THEO CH1 (một mã - một nhãn) ═════════════════
# Nhãn tiếng Việt là TÀI SẢN CỦA DANH MỤC CH1, không phải chuỗi gõ tay ở từng script.
# Trước đây cùng mã "late" có 2 nhãn ("Trễ" / "Đi trễ"), "average" có 2 nhãn... vì mỗi
# script tự gõ. BẢN ĐỒ CỘT->ENUM phải khai tay: nhiều enum dùng chung mã (on_track,
# active, pending, late...) nên dò tự động sẽ kéo nhầm nhãn của enum khác.
ENUM_COL = {
    ("DL01", "role"): "enum_staff_role", ("DL01", "status"): "enum_staff_status",
    ("DL02", "lead_status"): "enum_lead_status", ("DL02", "lead_source"): "enum_lead_source",
    ("DL02", "lead_qualification_status"): "enum_lead_qualification_status",
    ("DL02", "learning_mode"): "enum_learning_mode", ("DL02", "student_type"): "enum_student_type",
    ("DL02b", "channel"): "enum_contact_channel", ("DL02b", "direction"): "enum_contact_direction",
    ("DL03", "booking_status"): "enum_booking_status", ("DL03", "test_format"): "enum_test_format",
    ("DL03", "test_attendance_status"): "enum_test_attendance_status",
    ("DL03", "test_status"): "enum_test_status", ("DL03", "post_test_status"): "enum_post_test_status",
    ("DL04", "consultation_status"): "enum_consultation_status",
    ("DL04", "conversion_status"): "enum_conversion_status",
    ("DL06", "enrollment_status"): "enum_enrollment_status",
    ("DL06", "payment_status"): "enum_payment_status", ("DL06", "discount_type"): "enum_discount_type",
    ("DL06", "cancellation_reason"): "enum_cancellation_reason",
    ("DL07", "payment_method"): "enum_payment_method",
    ("DL08", "placement_status"): "enum_placement_status",
    ("DL08", "class_confirmation_status"): "enum_class_confirmation_status",
    ("DL08", "onboarding_status"): "enum_onboarding_status",
    ("DL09", "student_status"): "enum_student_status", ("DL09", "student_type"): "enum_student_type",
    ("DL09", "attendance_progress_status"): "enum_attendance_progress_status",
    ("DL09", "academic_progress_status"): "enum_academic_progress_status",
    ("DL09", "attendance_risk_reason"): "enum_attendance_risk_reason",
    ("DL09", "academic_risk_reason"): "enum_academic_risk_reason",
    ("DL10", "class_status"): "enum_class_status", ("DL10", "class_level"): "enum_class_level",
    ("DL11", "session_status"): "enum_session_status",
    ("DL12", "attendance_status"): "enum_attendance_status",
    ("DL12", "absence_type"): "enum_absence_type",
    ("DL12", "in_class_performance"): "enum_in_class_performance",
    ("DL13", "homework_status"): "enum_homework_status",
    ("DL14", "wow_status"): "enum_wow_status", ("DL14", "wow_session_type"): "enum_wow_session_type",
    ("DL14", "wow_booked_by"): "enum_wow_booked_by", ("DL14", "wow_outcome"): "enum_wow_outcome",
    ("DL14", "wow_no_show_reason"): "enum_wow_no_show_reason",
    ("DL15", "survey_type"): "enum_survey_type",
    ("DL16", "feedback_type"): "enum_feedback_type", ("DL16", "feedback_status"): "enum_feedback_status",
    ("DL16", "feedback_category"): "enum_feedback_category",
    ("DL17", "complaint_status"): "enum_complaint_status", ("DL17", "complaint_type"): "enum_complaint_type",
    ("DL17", "complaint_severity"): "enum_complaint_severity",
    ("DL17", "complaint_result"): "enum_complaint_result",
    ("DL18", "student_status"): "enum_student_status",
    ("DL18", "achievement_status"): "enum_achievement_status",
    ("DL18", "re_enrollment_status"): "enum_re_enrollment_status",
    ("DL23", "task_type"): "enum_task_type", ("DL23", "task_status"): "enum_task_status",
    ("DL23", "priority"): "enum_task_priority",
}
_EPAT = re.compile(r"([A-Za-z0-9_.]+)\s*\((.+)\)")
_emap = {}
for _en, _vals in d.get("enums", {}).items():
    _m = {}
    for _v in _vals:
        _mm = _EPAT.fullmatch(str(_v).strip())
        if _mm:
            _m[_mm.group(1)] = _mm.group(2)
    _emap[_en] = _m
norm, orphan = 0, []
for (_t, _c), _en in ENUM_COL.items():
    _m = _emap.get(_en) or {}
    for _r in R(_t):
        _mm = _EPAT.fullmatch(str(_r.get(_c) or "").strip())
        if not _mm:
            continue
        _want = _m.get(_mm.group(1))
        if _want is None:
            orphan.append("%s.%s=%s (thiếu trong %s)" % (_t, _c, _mm.group(1), _en))
            continue
        if _mm.group(2) != _want:
            _r[_c] = "%s (%s)" % (_mm.group(1), _want)
            norm += 1
log.append("13. Nhãn enum: kéo %d ô về đúng nhãn CH1 | %d mã không có trong danh mục%s"
           % (norm, len(set(orphan)), (" -> " + "; ".join(sorted(set(orphan))[:5])) if orphan else ""))

# ═══ 14. KẸP MỐC THỜI GIAN PHỄU ══════════════════════════════════════════
# lead -> test -> tư vấn -> chốt -> đăng ký -> thu tiền -> xếp lớp -> gửi info -> xác nhận.
# Các pass §4/§7a/§7b chỉ kéo TỪNG CẶP mốc nên vẫn đẻ ra "chốt deal trước tư vấn",
# "đăng ký trước tư vấn", "xếp lớp trước đăng ký". Pass này chạy CUỐI, kẹp cả chuỗi một lần.
TB_BY_LEAD = {}
for t in R("DL03"):
    x = dt(t.get("test_date"))
    if x:
        k = str(t.get("lead_id"))
        TB_BY_LEAD[k] = max(TB_BY_LEAD.get(k, x), x)
CS_BY_ID = {str(c.get("consultation_id")): c for c in R("DL04")}
ENR_BY_ID = {str(e.get("enrollment_id")): e for e in R("DL06")}
LEAD_BY_ID = {str(l.get("lead_id")): l for l in R("DL02")}
c14 = 0
for c in R("DL04"):
    L = LEAD_BY_ID.get(str(c.get("lead_id") or ""))
    floor = dt(L.get("lead_created_time")) if L else None
    tb = TB_BY_LEAD.get(str(c.get("lead_id")))
    if tb and (not floor or tb > floor):
        floor = tb
    ct = dt(c.get("consultation_time"))
    if ct and floor and ct < floor:
        ct = floor + datetime.timedelta(hours=random.randint(3, 30))
        c["consultation_time"] = fmt(ct); c14 += 1
    cv = dt(c.get("conversion_time"))
    if cv and ct and cv < ct:
        c["conversion_time"] = fmt(ct + datetime.timedelta(hours=random.randint(2, 26))); c14 += 1
for e in R("DL06"):
    c = CS_BY_ID.get(str(e.get("consultation_id") or ""))
    floor = (dt(c.get("conversion_time")) or dt(c.get("consultation_time"))) if c else None
    et = dt(e.get("enrollment_time"))
    if et and floor and et < floor:
        et = floor + datetime.timedelta(hours=random.randint(1, 20))
        if et > NOW:
            et = NOW - datetime.timedelta(hours=1)
        e["enrollment_time"] = fmt(et); c14 += 1
    if not et:
        continue
    for p_ in R("DL07"):
        if str(p_.get("enrollment_id")) != str(e.get("enrollment_id")):
            continue
        pt = dt(p_.get("payment_time"))
        if pt and pt < et:
            p_["payment_time"] = fmt(min(et + datetime.timedelta(hours=random.randint(2, 30)),
                                         NOW - datetime.timedelta(hours=1)))
            c14 += 1
for o in R("DL08"):
    e = ENR_BY_ID.get(str(o.get("enrollment_id") or ""))
    prev = dt(e.get("enrollment_time")) if e else None
    for f, lo, hi in (("assigned_at", 2, 30), ("class_info_sent_at", 1, 20),
                      ("confirmation_time", 1, 24), ("onboarding_completed_at", 1, 24)):
        cur = dt(o.get(f))
        if not cur:
            continue
        if prev and cur < prev:
            cur = prev + datetime.timedelta(hours=random.randint(lo, hi))
            if cur > NOW:
                cur = NOW - datetime.timedelta(minutes=random.randint(30, 300))
            o[f] = fmt(cur); c14 += 1
        prev = cur
log.append("14. Kẹp mốc phễu: sửa %d mốc thời gian ngược (chốt / đăng ký / xếp lớp)" % c14)

# ═══ 14b. HỒ SƠ HV: đơn ĐẦU TIÊN và tổng số đơn luôn suy từ DL06 ══════════
c14b = 0
for st in R("DL09"):
    es = sorted([e for e in R("DL06") if str(e.get("student_id")) == str(st.get("student_id"))],
                key=lambda e: dt(e.get("enrollment_time")) or NOW)
    if not es:
        continue
    if str(st.get("first_enrollment_id") or "") != str(es[0].get("enrollment_id")):
        st["first_enrollment_id"] = es[0].get("enrollment_id")
        st["first_enrollment_date"] = es[0].get("enrollment_time")
        c14b += 1
    if int(n(st.get("total_enrollments"))) != len(es):
        st["total_enrollments"] = len(es); c14b += 1
log.append("14b. Hồ sơ HV: đặt lại first_enrollment_id/date + total_enrollments cho %d chỗ lệch" % c14b)

# ═══ 14c. DỮ LIỆU CHO CỔNG HỌC VIÊN (mảng 3) ═════════════════════════════
# Cổng học viên sắp có 7 kênh hai chiều. Ba thứ dữ liệu phải mở đường trước:
#  (1) enum_task_type thêm "student_request" - yêu cầu do CHÍNH học viên gửi lên;
#  (2) DL16 thêm cột session_id - đánh giá gắn vào ĐÚNG buổi học (hàng sao từng buổi);
#  (3) DL20.file_link đang rỗng 100% nên nút tải tài liệu bên cổng bấm vào không ra gì.
_et = d.setdefault("enums", {}).setdefault("enum_task_type", [])
if not any(str(x).startswith("student_request") for x in _et):
    _et.append("student_request (Yêu cầu từ học viên)")
_ec = d["enums"].setdefault("enum_contact_channel", [])
c14c = 0
for f in R("DL16"):
    if "session_id" not in f:
        f["session_id"] = ""
        c14c += 1
_lk = 0
for b in R("DL20"):
    if not str(b.get("file_link") or "").strip():
        b["file_link"] = "https://drive.google.com/itts/baitap/%s" % str(b.get("hw_bank_id") or "").lower()
        _lk += 1
log.append("14c. Cổng học viên: thêm enum student_request | mở cột DL16.session_id cho %d dòng | "
           "gán link tài liệu cho %d bài trong kho" % (c14c, _lk))

# ═══ 15. SAN PHẲNG SƠ ĐỒ CỘT (UNION KEY) - PHẢI LÀ PASS CUỐI CÙNG ═════════
# Cột chỉ có mặt ở vài dòng (referrer_name, referral_uses, net_received...) làm app render
# ô trống và bản Sheets lệch cột. LUẬT: mọi dòng trong cùng một bảng phải CÙNG BỘ CỘT.
# Phải chạy sau mọi pass khác vì nó thay thế object dict của từng dòng.
flat, tabs = 0, 0
for _t, _rows in dl.items():
    if not isinstance(_rows, list) or not _rows:
        continue
    order = []
    for _r in _rows:
        for _k in _r.keys():
            if _k not in order:
                order.append(_k)
    _hit = 0
    for _i, _r in enumerate(_rows):
        if list(_r.keys()) == order:
            continue
        _rows[_i] = {_k: _r.get(_k, "") for _k in order}
        _hit += 1
    if _hit:
        tabs += 1; flat += _hit
log.append("15. Sơ đồ cột: san phẳng %d dòng ở %d bảng về đủ bộ cột (union key)" % (flat, tabs))

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print("  12. Da tao DL22 referral +", len(dl["DL22"]), "luot | DL19 thuong:", len(dl["DL19"]))
for _l in log[-6:]: print("  "+_l)
