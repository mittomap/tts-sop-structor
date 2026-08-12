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
# V9.29: thêm trạng thái CHỜ DUYỆT cho lý do vắng. Học viên báo nghỉ thì dòng điểm danh nằm ở
# "chờ duyệt" cho tới khi học vụ quyết - không để em tự cho mình vắng có phép.
_abs = d.setdefault("enums", {}).setdefault("enum_absence_type", [])
if not any(str(x).startswith("pending_review") for x in _abs):
    _abs.append("pending_review (Chờ duyệt)")
    log.append("Danh mục: thêm 'pending_review (Chờ duyệt)' vào enum_absence_type")

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
# CHỈ để trống buổi vừa dạy xong TRONG CỬA SỔ ÂN HẠN - buổi cũ hơn mà trống điểm danh là dữ liệu
# hỏng (luật 4i, _checkdata F4 và màn Sức khỏe dữ liệu đều tính từ mốc đó), không phải hàng chờ.
#
# V9.29x - BẪY THỜI GIAN đã cắn: lần trước lấy đúng 24h, tức là buổi được chọn có thể đã 23,9h tuổi
# NGAY LÚC BUILD. Vài tiếng sau (bản build vẫn nguyên, chỉ đồng hồ chạy) nó vượt mốc và cả ba bộ
# kiểm đồng loạt báo đỏ trên một bản build vốn xanh. Dữ liệu demo neo theo NGÀY CHẠY thì mọi cửa sổ
# thời gian phải chọn ở GIỮA, không sát mép. Nay chỉ lấy buổi trong NỬA cửa sổ -> bản build sống
# thêm được ít nhất nửa cửa sổ nữa mà không đổi kết luận.
_grace = 24
for _r in (d.get("config", {}).get("ch2") or []):
    if _r.get("name") == "attendanceGrace_hours":
        try: _grace = int(float(_r.get("value") or 24))
        except Exception: pass
_done = [x for x in R("DL11") if code(x.get("session_status")) == "completed" and dt(x.get("session_date"))
         and dt(x.get("session_date")) >= NOW - datetime.timedelta(hours=_grace / 2.0)]
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

# (c) tổng hợp về DL09 để đọc nhanh.
# XOÁ SẠCH bộ đếm cũ trước: chạy lại fixdata trên file đã xử lý thì danh sách đại sứ đổi,
# ai không còn là đại sứ vẫn giữ số cũ -> bộ đếm lệch với sổ DL22 mà không ai thấy.
for _st in R("DL09"):
    _st["referral_uses"] = ""
    _st["referral_enrolled"] = ""
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
    ("DL09", "emergency_contact_relation"): "enum_guardian_relation",
    ("DL09", "contact_primary"): "enum_contact_primary",
    ("DL09", "payer_side"): "enum_payer_side",
    ("DL10", "class_status"): "enum_class_status", ("DL10", "class_level"): "enum_class_level",
    ("DL11", "session_status"): "enum_session_status",
    ("DL11", "session_type"): "enum_session_type",
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


def eF(en, ma):
    """Nhan enum lay NGUYEN VAN tu danh muc CH1 - dung cho cac khoi gieo o duoi.

    Vi sao phai co: cac pass gieo tinh huong chay SAU §13 nen khong duoc chuan hoa nua. Go tay
    chuoi nhan la sinh ra nhan la ngay trong du lieu - da can that: khoi gieo DL08 go
    "in_progress (Đang làm)" va "confirmed (Đã xác nhận)" trong khi CH1 ghi "in_progress (Đang
    thực hiện)" va "confirmed (Đồng ý)". Nhan la thi app hien ra chu la, va moi luat doc theo
    nhan deu truot. Nhan la TAI SAN CUA CH1, khong phai chuoi go tay o tung khoi.
    """
    _n = (_emap.get(en) or {}).get(ma)
    return "%s (%s)" % (ma, _n) if _n else ma

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
# Cổng học viên là một KÊNH phản hồi mới - phải có trong danh mục, nếu không app in ra mã trần.
# Trạng thái từng đợt đóng phải nằm trong DANH MỤC, nếu không app in ra mã trần.
d.setdefault("enums", {})["enum_installment_status"] = [
    "upcoming (Chưa tới hạn)", "due (Đến hạn)", "overdue (Quá hạn)",
    "partial (Đóng một phần)", "paid (Đã đóng đủ)"]
_fc = d["enums"].setdefault("enum_feedback_channel", [])
if not any(str(x).startswith("app ") for x in _fc):
    _fc.insert(0, "app (Cổng học viên)")
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

# ═══ 14bis. KHỚP DỮ LIỆU VỚI GA NGHIỆP VỤ (28/07 - anh Luân bắt lỗi) ═══════
# ĐẶT Ở ĐÂY CÓ CHỦ Ý: phải chạy TRƯỚC 14d, vì 14d chia lịch đóng theo đợt dựa trên
# paid_amount - pass này sửa paid_amount nên chạy sau 14d là lịch đợt ôm số cũ (luật 17b đỏ).
# Anh Luân mở màn "Chạy quy trình" thấy một khách ĐANG Ở GA "Có KQ, chờ tư vấn" mà ô L/R/W/S
# trống trơn. 132 luật của check_logic.py không bắt được vì bộ máy chặng sống trong JS
# (jStageOf), còn bộ kiểm dữ liệu sống ở đây - Python không biết ga "Có KQ" nghĩa là gì.
# Bộ kiểm mới `_src/_checkdata.js` nạp chính _APP.js và hỏi ngược app; pass này vá theo nó.
# NGUYÊN TẮC: đã đi qua một cổng thì phải để lại chứng từ của cổng đó.

def _staff_role(*want):
    out = [x for x in R("DL01") if code(x.get("role")) in want and code(x.get("status")) == "active"]
    return out

# Chấm bài test đầu vào là việc của TEAM WOW (anh Luân chốt 28/07) - không phải giảng viên ACA.
# Lượt vá trước lấy cả "teacher" nên 46 phiếu test bị gán sai người chấm.
_GRADERS = _staff_role("wow_coach", "wow_leader") or _staff_role("teacher") or R("DL01")[:1]
_ACCT = (_staff_role("accountant") or _staff_role("accounting_manager") or R("DL01")[:1])[0]


def _half(x):
    """Điểm IELTS đi theo bước 0.5 và nằm trong 0-9."""
    return max(0.0, min(9.0, round(float(x) * 2) / 2.0))


def _bandstr(x):
    return ("%.1f" % _half(x))


# --- 16a. Đã qua cổng TEST thì phải có phiếu test đã chấm ------------------
# Ai có phiếu tư vấn hoặc đơn đăng ký = chắc chắn đã qua bước test, không thể không có phiếu.
_lead_of_stu = {}
for _e in R("DL06"):
    if _e.get("student_id") and _e.get("lead_id"):
        _lead_of_stu[str(_e["student_id"])] = str(_e["lead_id"])

_past_test = set()
for _c in R("DL04"):
    if _c.get("lead_id"):
        _past_test.add(str(_c["lead_id"]))
for _e in R("DL06"):
    _lid = str(_e.get("lead_id") or _lead_of_stu.get(str(_e.get("student_id")), ""))
    if _lid:
        _past_test.add(_lid)

_has_test = set(str(x.get("lead_id")) for x in R("DL03") if x.get("lead_id"))
_tb_n = 0
for _x in R("DL03"):
    _m = re.search(r"(\d+)$", str(_x.get("test_booking_id") or ""))
    if _m:
        _tb_n = max(_tb_n, int(_m.group(1)))

_made_test = 0
for _lid in sorted(_past_test - _has_test):
    _L = IDX["DL02"].get(_lid)
    if not _L:
        continue
    # mốc: phải TRƯỚC lúc tư vấn / đăng ký, vì test là cửa đứng trước hai cửa đó
    _after = [dt(c.get("consultation_time")) for c in R("DL04") if str(c.get("lead_id")) == _lid]
    _after += [dt(e.get("enrollment_time") or e.get("created_time"))
               for e in R("DL06") if str(e.get("lead_id")) == _lid]
    _after = [x for x in _after if x]
    _anchor = min(_after) if _after else (dt(_L.get("lead_created_time")) or NOW)
    _tdate = _anchor - datetime.timedelta(days=random.randint(4, 9))
    _created = dt(_L.get("lead_created_time"))
    if _created and _tdate < _created:                 # không được test trước cả lúc vào hệ thống
        _tdate = _created + datetime.timedelta(days=1)
    _tdate = _tdate.replace(hour=random.choice([9, 14, 19]), minute=0)

    # điểm đầu vào suy từ MỤC TIÊU của chính khách: vào học thấp hơn đích khoảng 1 band
    try:
        _goal = float(re.sub(r"[^0-9.]", "", str(_L.get("target_band") or "6.5")) or 6.5)
    except Exception:
        _goal = 6.5
    _base = _half(max(3.0, min(7.5, _goal - 1.0)))
    _sk = [_half(_base + random.choice([-0.5, 0.0, 0.0, 0.5])) for _ in range(4)]
    _ov = _bandstr(sum(_sk) / 4.0)                     # Overall = trung bình 4 kỹ năng
    _tb_n += 1
    _gr = random.choice(_GRADERS)
    _consulted = any(str(c.get("lead_id")) == _lid for c in R("DL04"))
    R("DL03").append({
        "test_booking_id": "TB-2026-%03d" % _tb_n, "lead_id": _lid,
        "test_date": fmt(_tdate), "test_format": random.choice(
            ["offline (Offline tại trung tâm)", "offline (Offline tại trung tâm)", "online (Online (Zoom/LMS))"]),
        "booking_status": "booked (Đã đặt lịch)", "booking_note": "",
        "test_attendance_status": "on_time (Đúng giờ)", "test_attendance_time": fmt(_tdate),
        "test_no_show_reason": "", "test_status": "graded (Đã chấm xong)",
        "overall_score": _ov, "skill_listening": _bandstr(_sk[0]), "skill_reading": _bandstr(_sk[1]),
        "skill_writing": _bandstr(_sk[2]), "skill_speaking": _bandstr(_sk[3]),
        "academic_note": random.choice([
            "Nền ngữ pháp ổn, cần siết phát âm và tốc độ đọc.",
            "Nghe bắt ý chính tốt, viết còn thiếu liên kết đoạn.",
            "Từ vựng đủ dùng, nói còn ngập ngừng khi đổi chủ đề.",
            "Đọc tốt, nghe dạng bản đồ/điền từ còn yếu."]),
        "result_time": fmt(_tdate + datetime.timedelta(days=1)),
        "post_test_status": "consulted (Đã tư vấn xong)" if _consulted else "awaiting_consultation (Có KQ, chờ tư vấn)",
        "graded_by": _gr.get("staff_id", ""), "auto_trigger_hint": "", "next_action": "",
        "lead_id_name": _L.get("full_name", ""),
    })
    _has_test.add(_lid)
    _made_test += 1

# nối phiếu tư vấn với phiếu test vừa tạo (phiếu tư vấn trỏ tới test_booking_id)
_tb_of_lead = {}
for _x in R("DL03"):
    _tb_of_lead.setdefault(str(_x.get("lead_id")), _x.get("test_booking_id"))
_linked = 0
for _c in R("DL04"):
    if not str(_c.get("test_booking_id") or "").strip():
        _tb = _tb_of_lead.get(str(_c.get("lead_id")))
        if _tb:
            _c["test_booking_id"] = _tb
            _linked += 1

# --- 16b. Đã qua cổng TƯ VẤN thì phải có phiếu tư vấn ----------------------
_has_cons = set(str(x.get("lead_id")) for x in R("DL04") if x.get("lead_id"))
_past_cons = set()
for _e in R("DL06"):
    _lid = str(_e.get("lead_id") or _lead_of_stu.get(str(_e.get("student_id")), ""))
    if _lid:
        _past_cons.add(_lid)
_cs_n = 0
for _x in R("DL04"):
    _m = re.search(r"(\d+)$", str(_x.get("consultation_id") or ""))
    if _m:
        _cs_n = max(_cs_n, int(_m.group(1)))
_made_cons = 0
for _lid in sorted(_past_cons - _has_cons):
    _L = IDX["DL02"].get(_lid)
    if not _L:
        continue
    _enr = [e for e in R("DL06") if str(e.get("lead_id")) == _lid]
    _edt = dt(_enr[0].get("enrollment_time")) if _enr else None
    _tst = [x for x in R("DL03") if str(x.get("lead_id")) == _lid]
    _rt = dt(_tst[0].get("result_time")) if _tst else None
    _ct = _rt + datetime.timedelta(days=1) if _rt else ((_edt - datetime.timedelta(days=2)) if _edt else NOW)
    if _edt and _ct >= _edt:                    # tư vấn phải trước lúc đăng ký
        _ct = _edt - datetime.timedelta(days=1)
    _cs_n += 1
    _crs = IDX["DL05"].get(str(_enr[0].get("course_id"))) if _enr else None
    R("DL04").append({
        "consultation_id": "CS-2026-%03d" % _cs_n, "lead_id": _lid,
        "test_booking_id": _tb_of_lead.get(_lid, ""),
        "consulted_by": _L.get("assigned_to", ""),
        "consultation_status": "consulted (Đã tư vấn xong)",
        "consultation_time": fmt(_ct),
        "recommended_course": (_crs or {}).get("course_name", "") or (_enr[0].get("course_id_name", "") if _enr else ""),
        "recommended_duration": ("%s tháng" % (_crs or {}).get("duration_months")) if (_crs or {}).get("duration_months") else "",
        "recommended_schedule": _L.get("availability_schedule", ""),
        "consultation_note": "Đã trao đổi kết quả test và lộ trình phù hợp với mục tiêu %s." % (_L.get("target_band") or ""),
        "conversion_status": "confirmed_with_deposit (Đồng ý + có cọc)" if _enr else "interested (Quan tâm, chưa chốt)",
        "conversion_time": fmt(_edt) if _edt else "",
        "conversion_note": "", "next_action": "",
        "customer_name_display": _L.get("full_name", ""),
    })
    _made_cons += 1

# --- 16c. Đã xếp lớp và đang học thì không thể chưa đóng đồng nào ---------
# Đơn "đã xác nhận" + học viên đã ngồi trong lớp mà paid_amount = 0 là mâu thuẫn: trung tâm
# không xếp lớp cho người chưa đóng cọc. Tạo phiếu thu ĐÚNG PHẦN CỌC, phần còn lại vẫn là
# công nợ - giữ nguyên các ca nợ cố ý để màn Thu công nợ còn việc mà demo.
_dep_pct = 40
for _c2 in d.get("config", {}).get("ch2", []):
    if _c2.get("name") == "installmentDepositPercent":
        try:
            _dep_pct = float(re.sub(r"[^0-9.]", "", str(_c2.get("value") or "40")) or 40)
        except Exception:
            _dep_pct = 40
_placed = set(str(o.get("student_id")) for o in R("DL08") if str(o.get("class_id") or "").strip())
_pay_n = 0
for _x in R("DL07"):
    _m = re.search(r"(\d+)$", str(_x.get("payment_id") or ""))
    if _m:
        _pay_n = max(_pay_n, int(_m.group(1)))
_paid_of_enr = {}
for _p in R("DL07"):
    _paid_of_enr[str(_p.get("enrollment_id"))] = _paid_of_enr.get(str(_p.get("enrollment_id")), 0) + n(_p.get("amount"))
_made_pay = 0
for _e in R("DL06"):
    if code(_e.get("enrollment_status")) == "cancelled":
        continue
    if str(_e.get("student_id")) not in _placed:
        continue
    if _paid_of_enr.get(str(_e.get("enrollment_id")), 0) > 0:
        continue
    _fee = n(_e.get("final_fee"))
    if _fee <= 0:
        continue
    _amt = int(round(_fee * _dep_pct / 100.0 / 1000.0)) * 1000
    _ob = [o for o in R("DL08") if str(o.get("student_id")) == str(_e.get("student_id"))]
    _edt2 = dt(_e.get("enrollment_time"))
    _when = dt((_ob[0] or {}).get("assigned_at")) if _ob else None
    _when = (_when - datetime.timedelta(days=1)) if _when else (_edt2 or NOW)
    # cọc phải thu SAU khi có đơn và TRƯỚC lúc xếp lớp - kẹp lại cho khỏi lọt luật 6d
    if _edt2 and _when < _edt2:
        _when = _edt2 + datetime.timedelta(hours=2)
    _pay_n += 1
    _stu = IDX["DL09"].get(str(_e.get("student_id")))
    _rcv = random.choice(_staff_role("sales_staff") or R("DL01")[:1])
    R("DL07").append({
        "payment_id": "PAY-%04d" % _pay_n, "enrollment_id": _e.get("enrollment_id"),
        "student_id": _e.get("student_id"), "lead_id": _e.get("lead_id", ""),
        "student_id_name": (_stu or {}).get("full_name", "") or _e.get("student_id_name", ""),
        "next_action": "", "payment_time": fmt(_when),
        "payment_method": "bank_transfer (Chuyển khoản NH)", "amount": str(_amt),
        "transaction_fee": "0", "net_received": str(_amt), "bank_name": "Vietcombank",
        "sender_name": (_stu or {}).get("full_name", ""), "transaction_ref": "FT%s%04d" % (_when.strftime("%y%m%d"), _pay_n),
        "received_by": _rcv.get("staff_id", ""), "received_by_name": _rcv.get("full_name", ""),
        "verified_by": _ACCT.get("staff_id", ""), "verified_by_name": _ACCT.get("full_name", ""),
        "payment_note": "Cọc giữ chỗ - xếp lớp xong thu phần còn lại.", "installment_no": "1",
    })
    _e["paid_amount"] = str(_amt)
    _e["remaining_amount"] = str(max(0, int(_fee) - _amt))
    _e["payment_status"] = ("paid (Đã thanh toán đủ)" if _amt >= _fee else "partial (Đã thanh toán 1 phần)")
    _paid_of_enr[str(_e.get("enrollment_id"))] = _amt
    _made_pay += 1

# Vá lại các phiếu test đang gán người chấm KHÔNG thuộc team WOW
_wowids = set(x.get("staff_id") for x in _staff_role("wow_coach", "wow_leader"))
_regrade = 0
if _wowids:
    for _t in R("DL03"):
        _gb = str(_t.get("graded_by") or "").strip()
        if _gb and _gb not in _wowids:
            _t["graded_by"] = random.choice(sorted(_wowids))
            _regrade += 1
log.append("14bis-b. Chấm test: đưa %d phiếu về đúng người chấm thuộc team WOW" % _regrade)

log.append("14bis. Khớp ga nghiệp vụ: bù %d phiếu test đã chấm (nối %d phiếu tư vấn vào phiếu test), "
           "%d phiếu tư vấn, %d phiếu thu cọc cho người đã xếp lớp mà chưa đóng đồng nào"
           % (_made_test, _linked, _made_cons, _made_pay))

# ═══ 14d. LỊCH ĐÓNG HỌC PHÍ THEO ĐỢT - BẢNG DL06b (mảng 4) ═══════════════
# Trước đây DL06 chỉ có MỘT cột next_payment_due, bị GHI ĐÈ mỗi lần thu -> không lưu được
# lịch trả góp, không nhắc TRƯỚC hạn, không in được lịch đợt vào phiếu, và không biết học
# viên đang nợ ĐỢT NÀO. Nay tách hẳn thành bảng lịch: mỗi đợt một dòng, một mã, một hạn.
# next_payment_due của DL06 trở thành cột SUY RA (đợt chưa đóng gần nhất), không còn là
# nơi lưu duy nhất.
CH2 = d.setdefault("config", {}).setdefault("ch2", [])
def _p2set(name, val, unit, mean):
    for c in CH2:
        if c.get("name") == name:
            return
    CH2.append({"name": name, "value": val, "unit": unit, "meaning": mean})
_p2set("installmentGap_days", 30, "ngày", "Khoảng cách giữa hai đợt đóng học phí khi chia trả góp")
_p2set("installmentRemind_days", 3, "ngày", "Nhắc học viên TRƯỚC hạn đóng đợt bao nhiêu ngày")
_p2set("installmentLate_days", 5, "ngày", "Quá hạn đợt bao nhiêu ngày thì chuyển sang mức cảnh báo đỏ")
_p2set("installmentDepositPercent", 40, "%", "Tỷ lệ đóng đợt đầu (cọc) khi chia trả góp")
# Cổng học viên khuyên "liên hệ trung tâm" mấy lần mà CẢ TRANG không có một số nào - vì
# centerHotline/centerAddress được app khai trong APPPARAMS nhưng CH2 chưa bao giờ có dòng.
# V9.29 (anh Luân): "1900 6789 làm gì đúng, em phải gọi ở hotline trong cấu hình chứ".
# Số cũ là số BỊA lúc gieo dữ liệu, nhìn như số thật nên dễ tưởng đã đúng. Nay để TRỐNG:
# app tự ẩn nút gọi khi chưa cấu hình và nhắc vào Cài đặt điền số thật của trung tâm.
# _p2set chỉ THÊM khi chưa có; số bịa cũ đã nằm sẵn trong file nên phải xoá thẳng.
for _c in CH2:
    if _c.get("name") == "centerHotline" and str(_c.get("value") or "").replace(" ", "") == "19006789":
        _c["value"] = ""
        _c["meaning"] = "Hotline của trung tâm - hiện trên cổng học viên, tin nhắn xác nhận và phiếu thu. Để trống thì app ẩn nút gọi."
_p2set("centerHotline", "", "chữ", "Hotline của trung tâm - hiện trên cổng học viên, tin nhắn xác nhận và phiếu thu. Để trống thì app ẩn nút gọi.")
_p2set("centerAddress", "12 Nguyễn Văn Bảo, phường 4, quận Gò Vấp, TP.HCM", "chữ", "Địa chỉ hiện trên phiếu thu và cổng học viên")

# ═══ 14d-bis. BA NGƯỠNG KPI SOP MÔ TẢ MÀ CH6 CHƯA CÓ DÒNG (V9.41) ════════
# Đo bằng máy: bảng BC2 của SOP liệt kê 51 chỉ số, bảng ngưỡng CH6 chỉ có 48 dòng - tức là bản
# thân SOP đã lệch với chính nó, và app (đọc CH6 để dựng bảng KPI) thừa hưởng đúng chỗ hụt đó.
# Anh Luân chốt: "nếu SOP chưa thoả đáng, em cứ sửa". Ngưỡng lấy NGUYÊN theo cột "Ngưỡng SOP"
# ghi ngay trong BC2, không phải em tự nghĩ ra.
CH6 = d.setdefault("config", {}).setdefault("ch6", [])


def _p6set(code, name, th, dr, ph):
    for c in CH6:
        if str(c.get("code")) == code:
            return 0
    CH6.append({"code": code, "name": name, "threshold": th, "dir": dr, "phase": ph})
    return 1


_them6 = 0
_them6 += _p6set("LFR", "Learning Followup Rate - Ghi chú theo dõi đầy đủ", 1.0, "≥", "P10")
_them6 += _p6set("APR", "Approval Rate - Phê duyệt yêu cầu đúng hạn", 0.9, "≥", "P10")
_them6 += _p6set("SS_ALL", "Satisfaction All - Điểm hài lòng toàn trung tâm", 4.5, "≥", "P10")
log.append("14d-bis. Nguong KPI: them %d dong CH6 (BC2 co 51 chi so, CH6 goc chi co 48)" % _them6)
_p2set("slaFeedbackClassify_hours", 24, "giờ", "Hạn tiếp nhận và phân loại phản hồi của học viên")
_p2set("permGrace_hours", 48, "giờ", "Quyền tạm theo việc còn hiệu lực thêm bao lâu sau hạn việc")

GAP = int(n(next((c["value"] for c in CH2 if c.get("name") == "installmentGap_days"), 30)) or 30)
DEP = float(n(next((c["value"] for c in CH2 if c.get("name") == "installmentDepositPercent"), 40)) or 40) / 100.0
LATE = int(n(next((c["value"] for c in CH2 if c.get("name") == "installmentLate_days"), 5)) or 5)

def _round1000(x):
    return int(round(x / 1000.0)) * 1000

sched = []
sn = 0
for e in R("DL06"):
    if code(e.get("enrollment_status")) == "cancelled":
        continue
    fin = n(e.get("final_fee"))
    if fin <= 0:
        continue
    eid = str(e.get("enrollment_id"))
    base = dt(e.get("enrollment_time")) or NOW
    pays = sorted([p for p in R("DL07") if str(p.get("enrollment_id")) == eid and n(p.get("amount")) > 0],
                  key=lambda p: dt(p.get("payment_time")) or NOW)
    paid_tot = sum(n(p.get("amount")) for p in pays)
    # Số đợt: đóng một lần thì 1 đợt; còn lại chia 2 hoặc 3 đợt theo giá trị hợp đồng.
    if paid_tot >= fin - 1 and len(pays) <= 1:
        nsplit = 1
    elif fin >= 15000000:
        nsplit = 3
    else:
        nsplit = 2
    amounts = []
    if nsplit == 1:
        amounts = [fin]
    else:
        first = _round1000(fin * DEP)
        rest = fin - first
        per = _round1000(rest / (nsplit - 1))
        amounts = [first] + [per] * (nsplit - 2) + [fin - first - per * (nsplit - 2)]
    # phân bổ tiền đã thu vào các đợt theo thứ tự thời gian (đợt trước đủ mới sang đợt sau)
    left = paid_tot
    pay_i = 0
    for i, amt in enumerate(amounts):
        sn += 1
        due = base if i == 0 else (base + datetime.timedelta(days=GAP * i))
        alloc = min(left, amt)
        left -= alloc
        if alloc >= amt - 1:
            st = "paid (Đã đóng đủ)"
        elif alloc > 0:
            st = "partial (Đóng một phần)"
        elif due < NOW - datetime.timedelta(days=LATE):
            st = "overdue (Quá hạn)"
        elif due < NOW:
            st = "due (Đến hạn)"
        else:
            st = "upcoming (Chưa tới hạn)"
        sched.append({
            "schedule_id": "SCH-%04d" % sn, "enrollment_id": eid,
            "student_id": e.get("student_id", ""), "student_id_name": e.get("student_id_name", ""),
            "course_id": e.get("course_id", ""), "course_id_name": e.get("course_id_name", ""),
            "installment_no": i + 1, "installment_of": len(amounts),
            "due_date": due.strftime("%d/%m/%Y"), "due_amount": int(amt),
            "paid_amount": int(alloc), "remaining_amount": int(max(0, amt - alloc)),
            "status": st,
            "paid_time": "", "note": "", "next_action": "",
        })
    # gắn số đợt vào từng phiếu thu (phiếu nào trả cho đợt nào)
    acc = 0
    idx = 0
    for p in pays:
        acc += n(p.get("amount"))
        while idx < len(amounts) - 1 and acc > sum(amounts[:idx + 1]) + 1:
            idx += 1
        p["installment_no"] = idx + 1
    # đóng mốc thời gian đã đóng cho các đợt đã đủ tiền
    mine = [x for x in sched if x["enrollment_id"] == eid]
    for x in mine:
        if x["status"].startswith("paid") and pays:
            cum = 0
            for p in pays:
                cum += n(p.get("amount"))
                if cum >= sum(a["due_amount"] for a in mine[:x["installment_no"]]) - 1:
                    x["paid_time"] = p.get("payment_time", "")
                    break
    # next_payment_due của DL06 nay SUY RA từ đợt chưa đóng xong gần nhất
    open_ins = [x for x in mine if not x["status"].startswith("paid")]
    e["next_payment_due"] = open_ins[0]["due_date"] if open_ins else ""
for p in R("DL07"):
    p.setdefault("installment_no", "")

# Rải lại HẠN của các đợt CHƯA ĐÓNG cho giống một trung tâm đang chạy bình thường.
# Lịch sinh máy móc từ ngày đăng ký + 30 ngày làm 64/90 đơn quá hạn - đó là trung tâm sắp sập,
# không phải trung tâm để đi demo. Và quan trọng hơn: không có ca nào SẮP tới hạn thì tính năng
# "nhắc TRƯỚC hạn" không có gì để hiện.
_open_by = {}
for x in sched:
    if not x["status"].startswith("paid"):
        _open_by.setdefault(x["enrollment_id"], []).append(x)
_MIX = [-21, -12, -6, -2, 0, 1, 2, 3, 6, 10, 17, 25, 34, 48]   # ngày so với hôm nay
for _i, (_eid, _lst) in enumerate(sorted(_open_by.items())):
    _lst.sort(key=lambda z: int(n(z.get("installment_no"))))
    _first = NOW + datetime.timedelta(days=_MIX[_i % len(_MIX)])
    # V9.29: chỉ các đợt CHƯA đóng mới bị rải lại ngày; đợt đã đóng giữ nguyên hạn cũ. Nếu ngày rải
    # rơi vào TRƯỚC hạn của đợt đã đóng thì lịch đi lùi (đợt 2 sớm hơn đợt 1) - luật 17e đỏ.
    _da_dong = [dt(z.get("due_date")) for z in sched
                if str(z.get("enrollment_id")) == str(_eid)
                and z not in _lst and dt(z.get("due_date"))]
    if _da_dong:
        _min = max(_da_dong) + datetime.timedelta(days=GAP)
        if _first < _min:
            _first = _min
    for _k, _x in enumerate(_lst):
        _d = _first + datetime.timedelta(days=GAP * _k)
        _x["due_date"] = _d.strftime("%d/%m/%Y")
        if n(_x.get("paid_amount")) > 0:
            _x["status"] = "partial (Đóng một phần)"
        elif _d < NOW - datetime.timedelta(days=LATE):
            _x["status"] = "overdue (Quá hạn)"
        elif _d < NOW:
            _x["status"] = "due (Đến hạn)"
        else:
            _x["status"] = "upcoming (Chưa tới hạn)"
    e = IDX["DL06"].get(_eid)
    if e:
        e["next_payment_due"] = _lst[0]["due_date"]
dl["DL06b"] = sched
_od = len([x for x in sched if x["status"].startswith("overdue")])
_du = len([x for x in sched if x["status"].startswith("due")])
_up = len([x for x in sched if x["status"].startswith("upcoming")])
log.append("14d. Lịch đóng theo đợt: %d đợt cho %d đơn (quá hạn %d, đến hạn %d, chưa tới hạn %d) "
           "| thêm 4 tham số CH2 | next_payment_due nay suy ra từ đợt chưa đóng gần nhất"
           % (len(sched), len(set(x["enrollment_id"] for x in sched)), _od, _du, _up))

# ═══ 14z. DL27 - YEU CAU DOI DOT DONG (V2 12/08, SALE-4 + SALE-5) ═══════════════════════════
# Truong phong Tu van: *"cho cho duyet nay duoc cho em xin them cai duyet gia han dot dong nua"*
# va *"khi ban sale chia lai dot dong thi em se phai duyet qua thi moi hop le"*.
# Gieo NGAY SAU khi DL06b co that - dat o gen_demo.py thi chua co dot nao de tro toi.
# Bon yeu cau, du bon loi di: cho duyet (gia han, co anh minh chung) · cho duyet (chia lai dot) ·
# da duyet · da tu choi. Hang cho nao mo ra cung phai co viec that, khong thi nguoi xem demo ket
# luan "chua lam" - da can dung mot lan voi bang Giao viec.
_dotSale = [s for s in dl["DL01"] if str(s.get("role", "")).startswith("sales_staff")]
_dotTP = next((s for s in dl["DL01"] if str(s.get("role", "")).startswith("sales_manager")), None)
_donDot = {}
for _x in sched:
    _donDot.setdefault(str(_x.get("enrollment_id")), []).append(_x)
_donCo = [e for e in dl["DL06"] if str(e.get("enrollment_id")) in _donDot
          and len(_donDot[str(e.get("enrollment_id"))]) > 1]
_donCo.sort(key=lambda e: str(e.get("enrollment_id")))      # thu tu on dinh, khong theo thu tu bam


def _dotReq(i, don, loai, tt, lydo, minhchung="", duyetBoi=None, ghichu=""):
    _ds = sorted(_donDot[str(don["enrollment_id"])], key=lambda x: int(x.get("installment_no") or 0))
    _chua = [x for x in _ds if not str(x.get("status", "")).startswith("paid")]
    _dot = _chua[0] if _chua else _ds[0]
    _hanCu = str(_dot.get("due_date") or "")
    _hanMoi = ""
    if _hanCu:
        try:
            _hanMoi = (datetime.datetime.strptime(_hanCu, "%d/%m/%Y")
                       + datetime.timedelta(days=[7, 10, 14][i % 3])).strftime("%d/%m/%Y")
        except Exception:
            _hanMoi = ""
    _gui = _dotSale[i % len(_dotSale)] if _dotSale else {}
    _laGiaHan = loai.startswith("extend")
    return {"req_id": "YCD-%03d" % i,
            "req_time": fmt(NOW - datetime.timedelta(days=[2, 4, 6, 9][i % 4])),
            "req_by": _gui.get("staff_id", ""), "req_by_name": _gui.get("full_name", ""),
            "req_type": loai,
            "enrollment_id": don["enrollment_id"],
            "student_id": don.get("student_id", ""),
            "student_id_name": don.get("student_id_name", ""),
            "installment_no": str(_dot.get("installment_no") or "") if _laGiaHan else "",
            "due_old": _hanCu if _laGiaHan else "",
            "due_new": _hanMoi if _laGiaHan else "",
            "amount": str(int(float(don.get("final_fee") or don.get("total_fee") or 0) or 0)),
            "plan": "" if _laGiaHan else json.dumps({"n": 3, "gap": 30, "dep": 40, "d0": ""}),
            "reason": lydo, "evidence": minhchung,
            "req_status": tt,
            "decided_by": (duyetBoi or {}).get("staff_id", ""),
            "decided_by_name": (duyetBoi or {}).get("full_name", ""),
            "decided_at": fmt(NOW - datetime.timedelta(days=1)) if duyetBoi else "",
            "decide_note": ghichu}


_dotReqs = []
if _donCo:
    _m = [_donCo[k % len(_donCo)] for k in range(4)]
    _dotReqs.append(_dotReq(1, _m[0], "extend (Xin gia hạn đợt)", "pending (Chờ duyệt)",
                            "Khách báo lương công ty trả chậm, xin lùi hạn 10 ngày.",
                            "https://drive.google.com/file/d/demo-zalo-gia-han/view"))
    _dotReqs.append(_dotReq(2, _m[1], "replan (Xin chia lại đợt)", "pending (Chờ duyệt)",
                            "Khách xin chia 3 đợt thay vì 2, đợt đầu 40%."))
    _dotReqs.append(_dotReq(3, _m[2], "extend (Xin gia hạn đợt)", "approved (Đã duyệt)",
                            "Phụ huynh đi công tác, xin lùi một tuần.",
                            "https://drive.google.com/file/d/demo-zalo-cong-tac/view", _dotTP, ""))
    _dotReqs.append(_dotReq(4, _m[3], "extend (Xin gia hạn đợt)", "rejected (Đã từ chối)",
                            "Khách xin lùi thêm lần thứ ba.", "", _dotTP,
                            "Đã gia hạn 2 lần, không lùi thêm - hẹn khách đóng đúng hạn."))
dl["DL27"] = _dotReqs
# Danh muc cua bang moi: khai o NGUON de moi lan dung lai deu co, va de nhan enum in ra dung
# nguyen van CH1 ("code (Nhãn tiếng Việt)").
_enm = d.setdefault("enums", {})
_enm["enum_dot_req_type"] = ["extend (Xin gia hạn đợt)", "replan (Xin chia lại đợt)"]
_enm["enum_request_status"] = ["pending (Chờ duyệt)", "approved (Đã duyệt)", "rejected (Đã từ chối)"]
log.append("14z. DL27 yêu cầu đổi đợt đóng: %d yêu cầu (%d chờ duyệt) + 2 danh mục mới"
           % (len(_dotReqs), sum(1 for x in _dotReqs if x["req_status"].startswith("pending"))))

# ═══ 14ter. ĐƠN XIN NGHỈ ĐANG CHỜ DUYỆT (V9.29) ══════════════════════════
# Màn duyệt xin nghỉ mở ra mà rỗng thì không ai biết nó tồn tại - đúng nguyên tắc
# "hàng chờ quyết định phải SỐNG" mà hội đồng đã chốt. Gieo vài đơn thật cho các buổi
# SẮP TỚI (để giáo viên còn kịp chuẩn bị phần bù - đó là lý do tính năng này ra đời).
_up = [x for x in R("DL11") if dt(x.get("session_date")) and dt(x.get("session_date")) > NOW
       and code(x.get("session_status")) != "cancelled"]
_up.sort(key=lambda x: dt(x.get("session_date")))
_LY = ["Em bị sốt từ tối qua, xin phép nghỉ buổi này ạ.",
       "Nhà em có việc đột xuất, em xin nghỉ buổi này.",
       "Em đi công tác tỉnh, hôm đó không kịp về ạ.",
       "Em bị đau dạ dày phải đi khám, xin phép nghỉ."]
_att_n = 0
for _x in R("DL12"):
    _m = re.search(r"(\d+)$", str(_x.get("attendance_id") or ""))
    if _m:
        _att_n = max(_att_n, int(_m.group(1)))
_made_abs = 0
for _i, _s in enumerate(_up[:4]):
    _obs = [o for o in R("DL08") if str(o.get("class_id")) == str(_s.get("class_id"))
            and str(o.get("student_id") or "").strip()]
    if not _obs:
        continue
    _o = _obs[_i % len(_obs)]
    _sid = str(_o["student_id"])
    if any(str(a.get("session_id")) == str(_s.get("session_id")) and str(a.get("student_id")) == _sid
           for a in R("DL12")):
        continue
    _stu = IDX["DL09"].get(_sid) or {}
    _att_n += 1
    _bao = NOW - datetime.timedelta(hours=[2, 9, 26, 5][_i % 4])   # một đơn cố ý để quá hạn duyệt
    R("DL12").append({
        "attendance_id": "AT-%04d" % _att_n, "session_id": _s.get("session_id"),
        "student_id": _sid, "student_name": _stu.get("full_name", ""),
        "attendance_status": "no_show (Vắng)", "absence_type": "pending_review (Chờ duyệt)",
        "check_in_time": "", "in_class_performance": "",
        "note": "[HV tự báo] %s: %s" % (fmt(_bao), _LY[_i % len(_LY)]),
        "next_action": "",
        "absence_reported_at": fmt(_bao),
        "absence_want_makeup": "Có" if _i % 2 == 0 else "",
        "absence_reviewed_by": "", "absence_reviewed_at": "", "absence_review_note": "",
        "makeup_session_id": "", "makeup_status": "",
    })
    _made_abs += 1
log.append("14ter. Xin nghỉ: gieo %d đơn đang CHỜ DUYỆT cho các buổi sắp tới (1 đơn cố ý quá hạn duyệt)"
           % _made_abs)

# ═══ 14quater. DỌN GHI CHÚ "(cấu hình xxx)" TRONG CÂU NHẮC CH4 (V9.29) ════
# Anh Luân: "mấy câu kiểu này đúng là chỉ cần bánh răng, khỏi cần ghi chú mắc công".
# Từ V9.29 mỗi câu nhắc hiện trên màn đều có bánh răng nhảy thẳng về đúng dòng CH4, nên phần
# "(cấu hình slaXxx_hours)" nhét giữa câu chỉ làm câu dài ra và lộ tên biến kỹ thuật cho người dùng.
_ch4 = d.get("config", {}).get("ch4") or []
_clean = 0
for _m in _ch4:
    _t = str(_m.get("tmpl") or "")
    _n = re.sub(r"\s*\((?:cấu hình|cau hinh)\s+[A-Za-z0-9_]+\)", "", _t)
    _n = re.sub(r"\s*\((?:cấu hình|cau hinh)\)", "", _n)   # dạng "(cấu hình)" trơ trọi
    _n = re.sub(r"\s{2,}", " ", _n).strip()
    if _n != _t:
        _m["tmpl"] = _n
        _clean += 1
log.append("14quater. Câu nhắc CH4: bỏ ghi chú '(cấu hình ...)' ở %d câu - đã có bánh răng sửa tại chỗ"
           % _clean)

# ═══ 14quinquies. CỘT "KHI NÀO HIỆN" KHÔNG ĐƯỢC CẮM CỨNG CON SỐ (V9.29) ═══
# Anh Luân: "cái đoạn khi nào hiện, con số 3 ngày đó, e cũng lấy từ cấu hình chứ đâu phải gắn cứng
# phải ko, gắn cứng ko được đâu nhé". Đúng: câu mẫu (tmpl) đã dùng {1} và thay bằng số cấu hình,
# nhưng câu mô tả (when) lại viết thẳng "(3 ngày)". Đổi ngưỡng thành 5 là cột đó NÓI DỐI.
# Nay when cũng dùng {1}/{2}/... y như tmpl, và app thay bằng số cấu hình khi hiển thị.
_ch4b = d.get("config", {}).get("ch4") or []
_ch2v = {c.get("name"): str(c.get("value") or "") for c in (d.get("config", {}).get("ch2") or [])}
_fixw = 0
for _m in _ch4b:
    _w = str(_m.get("when") or "")
    if not _w:
        continue
    _ps = _m.get("params") or []
    _new = _w
    for _i, _pn in enumerate(_ps):
        _v = re.sub(r"\.0$", "", _ch2v.get(_pn, ""))
        if not _v:
            continue
        # chỉ thay khi con số ĐỨNG RIÊNG (không dính số khác, không đụng chỗ trống có sẵn)
        _new = re.sub(r"(?<![\d{])" + re.escape(_v) + r"(?![\d}])", "{%d}" % (_i + 1), _new)
    if _new != _w:
        _m["when"] = _new
        _fixw += 1
log.append("14quinquies. Cột 'Khi nào hiện': bỏ số cắm cứng ở %d câu - nay lấy từ cấu hình như câu mẫu"
           % _fixw)

# ═══ 14sexies. CHI NHÁNH CỦA NHÂN SỰ (V9.29o - anh Luân: "trung tâm có 5 chi nhánh và
# hình thức học online, làm gì cũng phải cân nhắc") ═══════════════════════════
# 10/10 giáo viên đang để TRỐNG cột branch. Hệ quả không nhìn thấy ngay: câu hỏi
# "ai thay được buổi này ở Cơ sở 3" KHÔNG trả lời được, và mọi báo cáo tách theo chi
# nhánh đều thiếu người. Không bịa chi nhánh: suy từ chính các lớp mà người đó đã dạy
# (DL10.main_teacher_id + DL11.teacher_id) - chi nhánh dạy nhiều nhất là chi nhánh chính.
# Lớp ONLINE không tính vào chi nhánh chính (dạy online thì ở đâu cũng dạy được), trừ khi
# người đó chỉ dạy online - lúc đó chi nhánh chính đúng là "Cơ sở Online".
_clsBr = {c.get("class_id"): c.get("branch", "") for c in dl.get("DL10", [])}
_cnt = {}
for c in dl.get("DL10", []):
    t = str(c.get("main_teacher_id") or "").strip()
    if t:
        _cnt.setdefault(t, {}); b = c.get("branch", "")
        _cnt[t][b] = _cnt[t].get(b, 0) + 3        # lớp chủ nhiệm nặng ký hơn buổi dạy thay
for x in dl.get("DL11", []):
    t = str(x.get("teacher_id") or "").strip()
    b = _clsBr.get(x.get("class_id"), "")
    if t and b:
        _cnt.setdefault(t, {}); _cnt[t][b] = _cnt[t].get(b, 0) + 1
_ONL = "online (Cơ sở Online)"
_setbr = 0
for st in dl.get("DL01", []):
    if str(st.get("branch") or "").strip():
        continue
    c = _cnt.get(st.get("staff_id"), {})
    if not c:
        continue
    off = {k: v for k, v in c.items() if k and k != _ONL}
    pick = max(off, key=off.get) if off else _ONL
    st["branch"] = pick; _setbr += 1
# Giáo viên CHƯA từng dạy buổi nào thì không suy ra được gì. Đây là dữ liệu DEMO nên rải đều
# họ về các chi nhánh đang có lớp - cốt để mỗi chi nhánh đều có người dự phòng, màn "GV dự phòng
# theo ngày" mới có gì để thử. Ghi rõ đây là QUYẾT ĐỊNH GIEO DỮ LIỆU, không phải luật nghiệp vụ.
_brs = [b for b in {c.get("branch", "") for c in dl.get("DL10", [])} if b and b != _ONL]
_brs.sort()
_free = [st for st in dl.get("DL01", [])
         if "teacher" in str(st.get("role") or "") and not str(st.get("branch") or "").strip()]
for _i, st in enumerate(_free):
    if not _brs:
        break
    st["branch"] = _brs[_i % len(_brs)]; _setbr += 1
# ── HỌC VIÊN PHẢI ĐỨNG ĐÚNG NƠI HỌ HỌC (V9.59) ─────────────────────────────────────────────
# Cột branch của học viên trước đây gieo NGẪU NHIÊN, không đối chiếu với lớp họ đang học. Hệ quả
# đo được sau khi mở rộng ra đủ 6 nơi học: 70/84 học viên có lớp mà cột nơi học ghi một cơ sở
# KHÁC. Bộ lọc theo cơ sở vì thế trả về sai người, và phạm vi quyền của quản lý cơ sở cũng sai.
# Luật: có lớp thì nơi học của học viên = nơi học của LỚP. Chưa có lớp thì giữ nguyên (họ đang
# chờ xếp lớp - cột đó nói nguyện vọng, không nói sự thật đã xảy ra).
_stuCls = {}
for _o in dl.get("DL08", []):
    if _o.get("student_id") and _o.get("class_id"):
        _stuCls[_o["student_id"]] = _o["class_id"]
for _e in dl.get("DL06", []):
    if _e.get("student_id") and _e.get("class_id") and _e["student_id"] not in _stuCls:
        _stuCls[_e["student_id"]] = _e["class_id"]
_stubr = 0
for _s in dl.get("DL09", []):
    _b = _clsBr.get(_stuCls.get(_s.get("student_id")), "")
    if _b and _s.get("branch") != _b:
        _s["branch"] = _b; _stubr += 1
_lech = sum(1 for _s in dl.get("DL09", [])
            if _stuCls.get(_s.get("student_id")) and _clsBr.get(_stuCls[_s["student_id"]], "")
            and _s.get("branch") != _clsBr[_stuCls[_s["student_id"]]])
print("  16. Noi hoc cua HV bam theo LOP: con lech %d ho so" % _lech)

# BÁO SỐ HIỆN TRẠNG, KHÔNG BÁO SỐ VỪA SỬA. Bẫy: gen_demo.py ĐỌC LẠI chính demo_data_big.json
# (DL01/DL05/DL10 là fixture mang theo qua mỗi lượt chạy), nên thứ pass này vá hôm nay sẽ thành
# ĐẦU VÀO của lượt chạy ngày mai - đếm "vừa sửa mấy dòng" thì lần thứ hai luôn ra số nhỏ hơn và
# đọc log tưởng vá hụt. Đếm độ phủ thì lần nào cũng nói đúng.
_gvAll = [st for st in dl.get("DL01", []) if "teacher" in str(st.get("role") or "")]
_gvBr = sum(1 for st in _gvAll if str(st.get("branch") or "").strip())
_stAll = len(dl.get("DL01", []))
_stBr = sum(1 for st in dl.get("DL01", []) if str(st.get("branch") or "").strip())
log.append("14sexies. Chi nhánh nhân sự: %d/%d giáo viên và %d/%d nhân sự đã có chi nhánh "
           "(suy từ lớp/buổi đã dạy; lớp online không tính là chi nhánh chính)"
           % (_gvBr, len(_gvAll), _stBr, _stAll))

# --- Lớp ONLINE thì không được gán phòng học vật lý, và ngược lại ------------
# Trộn hai thứ này là màn xếp phòng đếm nhầm và GV dự phòng lọc nhầm.
_vfix = 0
for c in dl.get("DL10", []):
    lm = str(c.get("learning_mode") or "")
    v = str(c.get("venue_or_zoom_link") or "")
    if lm.startswith("online") and not v.startswith("http"):
        c["venue_or_zoom_link"] = "https://zoom.us/j/itts-%s (gửi trước buổi đầu)" % str(c.get("class_id") or "").lower()
        _vfix += 1
    if lm.startswith("offline") and v.startswith("http"):
        c["venue_or_zoom_link"] = "Phòng 101 - " + str(c.get("branch") or "").split(" (")[0]
        _vfix += 1
# Lớp thuộc "Cơ sở Online" mà hình thức học lại ghi offline/hybrid là mâu thuẫn thẳng: không có
# phòng nào ở cơ sở đó cả. Màn GV dự phòng đọc phải cặp này để biết có ràng buộc cơ sở hay không,
# lệch một cái là lọc sai người.
_mfix = 0
for c in dl.get("DL10", []):
    if str(c.get("branch") or "").startswith("online") and not str(c.get("learning_mode") or "").startswith("online"):
        c["learning_mode"] = "online (Trực tuyến)"
        c["venue_or_zoom_link"] = "https://zoom.us/j/itts-%s (gửi trước buổi đầu)" % str(c.get("class_id") or "").lower()
        _mfix += 1
if _vfix or _mfix:
    log.append("14sexies-b. Chỗ học: sửa %d lớp lệch giữa hình thức học và phòng/link, "
               "%d lớp ở Cơ sở Online mà ghi học tại chỗ" % (_vfix, _mfix))

# ═══ 14septies. TEST KHÔNG THỂ DIỄN RA TRƯỚC KHI LEAD TỒN TẠI (V9.29q) ═══
# Do CHÍNH màn "Sức khỏe dữ liệu" trong app bắt được (3 phiếu), trong khi 132 luật của
# check_logic.py không có luật nào canh cặp này. Đây là lý do giữ lại màn đó thay vì xoá:
# nó soi trên dữ liệu ĐANG MỞ nên bắt được thứ bộ kiểm lúc sinh dữ liệu bỏ sót.
# Vá: đẩy giờ test ra sau giờ tạo lead ít nhất 2 tiếng (cùng ngày thì lùi sang khung sau).
_tfix = 0
def _keoTheoTest(t):
    """Doi `test_date` thi phai keo theo GIO DIEM DANH va GIO CHAM.

    LOP LOI: *doi mot moc ma bo quen moc phu thuoc.* Luat 14septies day gio thi ra sau (khi phieu
    hen truoc luc tao lead) va 14undecies keo gio thi ve qua khu - ca hai deu khong dung toi
    `result_time`, nen gio cham roi ve TRUOC gio thi. `check_logic` 13c bat duoc TB-2026-095 va
    -097 (thi 07/08 ma cham 05/08). Mot moc thoi gian khong dung mot minh: no dung trong mot
    chuoi nhan qua, va doi mot mat xich thi phai doi ca doan sau no."""
    _td = dt(t.get("test_date"))
    if not _td: return
    _at = dt(t.get("test_attendance_time"))
    if _at and _at < _td: t["test_attendance_time"] = fmt(_td)
    _rt = dt(t.get("result_time"))
    if _rt and _rt <= _td:
        _moi = _td + datetime.timedelta(hours=random.randint(1, 3))
        if _moi > NOW: _moi = NOW - datetime.timedelta(minutes=20)
        if _moi <= _td: _moi = _td + datetime.timedelta(minutes=45)
        t["result_time"] = fmt(_moi)

for t in dl.get("DL03", []):
    L = IDX["DL02"].get(str(t.get("lead_id") or ""))
    if not L:
        continue
    a, b = dt(L.get("lead_created_time")), dt(t.get("test_date"))
    if a and b and b < a:
        t["test_date"] = fmt(a + datetime.timedelta(hours=2))
        _keoTheoTest(t)
        _tfix += 1
log.append("14septies. Thứ tự: đẩy %d phiếu test bị hẹn TRƯỚC giờ tạo lead ra sau ít nhất 2 tiếng"
           % _tfix)

# ═══ 14octies. GIÁO VIÊN KHÔNG THỂ DẠY HAI LỚP CÙNG GIỜ (V9.29r) ═══════════
# Màn "Phòng & đụng lịch" mới bắt được 20 điểm đụng giờ của giáo viên trong dữ liệu demo.
# Giữ lại vài ca CỐ Ý cho màn đó có gì mà xem, số còn lại vá bằng cách đổi người dạy.
#
# LƯU Ý QUAN TRỌNG: luật "ai thay được" sống trong JS (gvBackup) - ở đây KHÔNG chép lại luật đó.
# Python chỉ dùng một tập con NGẶT HƠN: người thay phải TRỐNG CẢ NGÀY và có cột branch TRÙNG KHỚP
# tuyệt đối với chi nhánh của lớp (lớp online thì ai cũng được). Ngặt hơn nghĩa là mọi kết quả
# Python chọn đều nằm trong tập mà JS chấp nhận - không có chuyện hai bên nói khác nhau.
_SPAN_H = 2          # cùng khoảng "một buổi chiếm chỗ" mà app dùng (sessionSpan_hours)
_KEEP = 3            # số ca đụng giờ cố ý giữ lại
_clsIdx = {c.get("class_id"): c for c in dl.get("DL10", [])}
_sess = [x for x in dl.get("DL11", [])
         if not code(x.get("session_status", "")).startswith("cancelled") and dt(x.get("session_date"))]
_sess.sort(key=lambda x: dt(x["session_date"]))
_teachers = [st for st in dl.get("DL01", []) if "teacher" in str(st.get("role") or "")]

def _busy_day(sid, day):
    for x in _sess:
        if str(x.get("teacher_id") or "") != sid:
            continue
        d = dt(x.get("session_date"))
        if d and d.date() == day:
            return True
    return False

_clash = []
for i, A in enumerate(_sess):
    da = dt(A["session_date"])
    for B in _sess[i + 1:]:
        db = dt(B["session_date"])
        if (db - da).total_seconds() >= _SPAN_H * 3600:
            break
        ta, tb = str(A.get("teacher_id") or ""), str(B.get("teacher_id") or "")
        if ta and ta == tb and A.get("class_id") != B.get("class_id"):
            _clash.append(B)
_fixgv = 0
for B in _clash[_KEEP:]:
    c = _clsIdx.get(B.get("class_id")) or {}
    onl = str(c.get("learning_mode") or "").startswith("online")
    br = c.get("branch") or ""
    day = dt(B["session_date"]).date()
    for st in _teachers:
        if st.get("staff_id") == str(B.get("teacher_id") or ""):
            continue
        if not onl and st.get("branch") != br:
            continue
        if _busy_day(st["staff_id"], day):
            continue
        B["teacher_id"] = st["staff_id"]
        B["teacher_id_name"] = st.get("full_name") or ""
        _fixgv += 1
        break
log.append("14octies. Đụng giờ: đổi người dạy cho %d/%d buổi bị trùng giờ giáo viên "
           "(giữ lại %d ca cố ý để màn Phòng & đụng lịch có gì mà xem)"
           % (_fixgv, len(_clash), min(_KEEP, len(_clash))))

# ═══ 14nonies. GHI MỐC NGÀY SINH DỮ LIỆU (V9.30 - anh Luân) ═════════════════
# "để demo lúc nào cũng ổn, nút reset demo thêm chức năng điều chỉnh thời gian".
# Dữ liệu demo neo theo NGÀY CHẠY pipeline. Mở lại sau 3 tháng là mọi thứ thành "quá hạn 90 ngày",
# lịch tuần trống trơn, "hôm nay" không có buổi nào - demo chết dù code không sai gì.
# Ghi mốc này để app biết dữ liệu sinh ngày nào mà tự dịch về hiện tại.
d["meta"] = d.get("meta") or {}
d["meta"]["anchor"] = fmt(NOW)
d["meta"]["anchor_note"] = ("Ngày sinh dữ liệu demo. App dịch toàn bộ mốc thời gian theo BỘI SỐ 7 "
                            "NGÀY để giữ nguyên thứ trong tuần của lịch lớp.")

# ═══ 14decies. XẾP LỚP PHẢI TRỎ ĐÚNG ĐƠN CỦA KHÓA ĐÓ (V9.30) ═══════════════
# Do hàm stuKhoaLop() mới bắt được: học viên học 2 khóa thì dòng xếp lớp của khóa SAU vẫn trỏ vào
# đơn của khóa TRƯỚC. Hệ quả trên màn hình: drawer xem nhanh khai một cặp "khóa 6.5 - lớp 7.0+"
# KHÔNG CÓ THẬT, và tiền của đơn này bị treo lên lớp của đơn kia.
# Vá: dòng xếp lớp nào có lớp thuộc khóa X thì nối vào đơn của CHÍNH khóa X của học viên đó.
_clsIdx2 = {c.get("class_id"): c for c in dl.get("DL10", [])}
_enrOf = {}
for e in dl.get("DL06", []):
    sid = str(e.get("student_id") or "").strip()
    if sid:
        _enrOf.setdefault(sid, []).append(e)
_relink = 0
for o in dl.get("DL08", []):
    cid = str(o.get("class_id") or "").strip()
    if not cid:
        continue
    c = _clsIdx2.get(cid)
    if not c:
        continue
    cur = IDX["DL06"].get(str(o.get("enrollment_id") or ""))
    if cur and str(cur.get("course_id") or "") == str(c.get("course_id") or ""):
        continue                       # đã đúng cặp
    for e in _enrOf.get(str(o.get("student_id") or ""), []):
        if str(e.get("course_id") or "") == str(c.get("course_id") or "") \
           and not code(e.get("enrollment_status", "")).startswith("cancelled"):
            o["enrollment_id"] = e.get("enrollment_id")
            _relink += 1
            break
# Nối lại xong thì lộ tiếp một chuyện: đơn "học tiếp" được gieo với ngày đăng ký SAU ngày em đó
# đã được xếp vào lớp của chính khóa đó (luật 13g: xếp lớp trước khi đăng ký). Trước đây không ai
# thấy vì dòng xếp lớp còn đang trỏ nhầm sang đơn cũ - vá một chỗ thì chỗ kia mới lộ ra.
# Kéo ngày đăng ký về trước lần xếp lớp sớm nhất của chính đơn đó.
_early = {}
for o in dl.get("DL08", []):
    eid = str(o.get("enrollment_id") or "")
    a = dt(o.get("assigned_at"))
    if eid and a and (eid not in _early or a < _early[eid]):
        _early[eid] = a
_dkfix = 0
for e in dl.get("DL06", []):
    a = _early.get(str(e.get("enrollment_id") or ""))
    t0 = dt(e.get("enrollment_time"))
    if a and t0 and t0 > a:
        e["enrollment_time"] = fmt(a - datetime.timedelta(days=2))
        _dkfix += 1
log.append("14decies. Xếp lớp: nối lại %d dòng vào ĐÚNG đơn của khóa mà lớp đó thuộc về; "
           "kéo %d ngày đăng ký về trước lần xếp lớp" % (_relink, _dkfix))

# ═══ 14undecies. ĐÃ ĐIỂM DANH THI THÌ BUỔI TEST PHẢI Ở QUÁ KHỨ (V9.30) ═══
# Lại là BẪY THỜI GIAN: pipeline gieo buổi test quanh "bây giờ", vài giờ sau đồng hồ chạy qua là
# buổi đó nằm ở TƯƠNG LAI trong khi đã có điểm danh dự thi (luật 13d đỏ). Cùng một lớp lỗi với
# §10b - dữ liệu neo theo ngày chạy thì mọi mốc phải chọn CÁCH XA mép, không sát mép.
# Kéo buổi test đã có điểm danh về ít nhất 6 tiếng trước.
_ttfix = 0
for r in dl.get("DL03", []):
    if not str(r.get("test_attendance_status") or "").strip():
        continue
    td = dt(r.get("test_date"))
    if td and td > NOW - datetime.timedelta(hours=6):
        r["test_date"] = fmt(NOW - datetime.timedelta(hours=6))
        _keoTheoTest(r)
        _ttfix += 1
log.append("14undecies. Test: kéo %d buổi ĐÃ điểm danh dự thi về quá khứ (chống trôi theo đồng hồ)"
           % _ttfix)

# ═══ 14novodecies. CHÍN TÌNH HUỐNG SOP MÔ TẢ MÀ DEMO CHƯA CÓ CA (V9.41) ═
# App ĐÃ có luật cho cả chín, nhưng dữ liệu demo không có ca nào nên chín màn đó không ai xem
# được và bộ kiểm không chứng minh được luật có chạy. Đây đúng là loại "xanh vì không có gì để
# đỏ" - nguy hiểm hơn đỏ thật, vì nó ru người ta ngủ.
# Gieo TỐI THIỂU: đúng một ca mỗi loại, đủ để nhìn thấy và để bộ kiểm cắn được.
_seed = []


def _lay(ds, dk, n=1):
    """lay n dong dau thoa dieu kien"""
    return [x for x in ds if dk(x)][:n]


# --- DL02: ba trang thai lead SOP mo ta ---
_mo = [l for l in R("DL02") if code(l.get("lead_status")) in ("new", "contacted", "considering")]
# so lan cham THAT cua tung lead - dem tu DL02b, khong gan tay vao contact_count. Truoc day em
# gan thang contact_count = 6 de ep ra NA047, nhung bang cham chi co 5 dong: du lieu tu noi doi
# voi chinh no va bo kiem bat dung ngay ("luot lien he lech so ban ghi cham"). Ep mot con so ma
# khong ep cai sinh ra no la vet nut y het "vá hai nơi cho cùng một sự thật".
_chamOf = {}
for _tp in R("DL02b"):
    _kl = str(_tp.get("lead_id") or "")
    _chamOf.setdefault(_kl, []).append(_tp)
_nguongCham = 5
for _c2 in (d.get("config", {}).get("ch2") or []):
    if _c2.get("name") == "thresholdContacted_attempts":
        _nguongCham = int(n(_c2.get("value")) or 5)


def _lanCham(l):
    return len(_chamOf.get(str(l.get("lead_id") or ""), []))


def _chamDauTien(l):
    _ts = sorted([str(x.get("contact_time") or "") for x in _chamOf.get(str(l.get("lead_id") or ""), []) if x.get("contact_time")],
                 key=lambda s: dt(s) or NOW)
    return _ts[0] if _ts else ""


def _themCham(l, can):
    """Ghi THEM ban ghi cham cho mot lead cho du so lan, roi tra ve so lan that.

    Khong duoc ep contact_count len ma khong ghi ban ghi: bo dem la SUY RA tu so cham, ep mot dau
    ma bo dau kia thi du lieu tu mau thuan. Ngoai doi cung vay - goi 6 lan thi phai co 6 dong nhat
    ky, khong the co con so 6 lo lung khong ai tra loi duoc "6 lan do goi luc nao".
    """
    _kl = str(l.get("lead_id") or "")
    _ds = _chamOf.setdefault(_kl, [])
    _no = 0
    for _t in R("DL02b"):
        _mn = re.match(r"TP-(\d+)$", str(_t.get("touchpoint_id") or ""))
        if _mn:
            _no = max(_no, int(_mn.group(1)))
    _nv = (R("DL01") or [{}])[0]
    _ndung = ["Gọi lại lần nữa, khách không bắt máy",
              "Nhắn Zalo hỏi lịch rảnh để tư vấn, chưa thấy trả lời",
              "Gọi giờ trưa, khách bận hẹn gọi lại",
              "Gửi lộ trình + học phí qua Zalo, khách xem chưa phản hồi"]
    while len(_ds) < can:
        _no += 1
        _k = len(_ds)
        _ds.append({
            "touchpoint_id": "TP-%03d" % _no, "lead_id": _kl,
            "customer_name": l.get("full_name", ""),
            "contact_time": fmt(NOW - datetime.timedelta(days=max(1, 12 - _k * 2), hours=_k)),
            "channel": eF("enum_contact_channel", "phone" if _k % 2 else "zalo"),
            "direction": eF("enum_contact_direction", "outbound"),
            "content": _ndung[_k % len(_ndung)],
            "staff_id": l.get("assigned_to") or _nv.get("staff_id", ""),
            "result_note": "no_answer (Gọi - không nghe máy)" if _k % 2 else "sent_waiting (Đã nhắn - chưa trả lời)",
            "staff_id_name": l.get("assigned_to_name") or _nv.get("full_name", ""),
        })
        R("DL02b").append(_ds[-1])
    return len(_ds)


if len(_mo) >= 3:
    # NA047 - da goi du so lan nguong ma khach khong phan hoi. Uu tien lead DA CO du so ban ghi
    # cham; khong co thi GHI THEM cham cho du - chu khong ep rieng con so.
    _u47 = [l for l in _mo if _lanCham(l) >= _nguongCham] or _mo[1:2]
    if _u47:
        _l2 = _u47[0]
        _l2["contact_count"] = _themCham(_l2, _nguongCham)
        _l2["first_call_time"] = _chamDauTien(_l2) or fmt(NOW - datetime.timedelta(days=12))
        _l2["next_followup_time"] = ""
        _seed.append("NA047")
    # NA048 - da lien he, qua so ngay chua chot. Chon lead it cham, giu contact_count dung thuc te.
    _u48 = [l for l in _mo if 0 < _lanCham(l) < _nguongCham and l is not (_u47[0] if _u47 else None)]
    if _u48:
        _l3 = _u48[0]
        _l3["contact_count"] = _lanCham(_l3)
        _l3["first_call_time"] = fmt(NOW - datetime.timedelta(days=20))
        _l3["next_followup_time"] = ""
        _seed.append("NA048")

# --- DL11: enum LOAI BUOI (thuong / thi giua khoa / thi cuoi khoa) ---
# Nhan enum ghi NGUYEN VAN dang "code (Nhan tieng Viet)" theo luat CH1 cua du an.
_st = d.setdefault("enums", {}).setdefault("enum_session_type", [])
for _v in ("regular (Buổi thường)", "mid (Thi giữa khóa)", "final (Thi cuối khóa)"):
    if _v not in _st:
        _st.append(_v)

# --- DL11: mot buoi DA DOI lich ---
_sd = d.setdefault("enums", {}).setdefault("enum_session_status", [])
if not any(str(x).startswith("rescheduled") for x in _sd):
    _sd.append("rescheduled (Đã dời lịch)")
_ss = [x for x in R("DL11") if code(x.get("session_status")) == "scheduled"]
if _ss:
    _ss[0]["session_status"] = "rescheduled (Đã dời lịch)"
    _seed.append("NA024")

def _dangHoc2(x):
    return "active" in str(x.get("student_status") or "") or not str(x.get("student_status") or "").strip()


# --- bon ca con lai, gieo o BUOC CUOI de khong bi cac pass tren de len ---
# --- DL08: NAM trang thai xep lop / nhap hoc SOP mo ta, MOI TINH HUONG MOT DONG RIENG ---
# Gieo trong MOT khoi duy nhat. Truoc do em gieo lam hai lan va lan sau de len lan truoc, lam
# hai tinh huong bien mat - dung cai bay "vá hai nơi cho cùng một sự thật" da ghi trong 02.
# CACH CHON HO SO (da sai hai lan, ghi lai cho ro):
#  Lan 1 - lay bua nam ho so roi DOI HET sang mot lop "dang hoc": sinh ra "xep lop sau ngay khai
#          giang", "diem danh o lop HV khong thuoc" (28 dong), "bai tap giao cho HV ngoai lop" (10).
#  Lan 2 - siet lai thanh "lop chua khai giang + cung khoa + HV chua hoc buoi nao": dung nghiep vu
#          nhung khong con du 5 ho so nao thoa, nen khoi gieo im lang KHONG CHAY, va ba tinh huong
#          SOP bien mat ma bang tong ket van xanh. Dieu kien sach ma khong con ca nao thi cung la
#          hong - bo kiem trigger bat duoc, con mat thuong thi khong.
#  Nay - KHONG DOI LOP nua. Giu nguyen lop cua chinh ho so do, chi dung lai cac MOC THOI GIAN va
#  trang thai. Khong doi lop thi khong the lech lop, khong the lech khoa, khong the lech diem danh.
#  Chi uu tien nhung ho so cua HV chua hoc buoi nao, vi ho so onboarding dang do thi ngoai doi
#  cung chua di hoc - va rieng ca NA063 (phai xoa lop khoi ho so) thi BAT BUOC nhu vay.
_donCua = {str(e.get("enrollment_id") or ""): e for e in R("DL06")}
_lopCua = {str(c.get("class_id") or ""): c for c in R("DL10")}
_daHoc = {str(x.get("student_id") or "") for x in R("DL12")}
_daHoc |= {str(x.get("student_id") or "") for x in R("DL13")}


def _khoaCuaOB(o):
    _e = _donCua.get(str(o.get("enrollment_id") or ""))
    return str(_e.get("course_id") or "") if _e else ""


def _tuoiDon(o):
    """So gio ke tu luc dang ky - xep lop khong the xay ra TRUOC khi co don."""
    _e = _donCua.get(str(o.get("enrollment_id") or ""))
    _t = dt(_e.get("enrollment_time")) if _e else None
    return (NOW - _t).total_seconds() / 3600.0 if _t else None


def _lopChoOB(o):
    """Lop cua chinh ho so do; neu ho so chua co lop thi lay lop CUNG KHOA sap khai giang."""
    _c = _lopCua.get(str(o.get("class_id") or ""))
    if _c:
        return _c
    _kh = _khoaCuaOB(o)
    _ds = [c for c in R("DL10") if str(c.get("course_id") or "") == _kh
           and (dt(c.get("class_start_date")) or NOW) > NOW]
    _ds += [c for c in R("DL10") if str(c.get("course_id") or "") == _kh]
    return _ds[0] if _ds else None


_obAll = [o for o in R("DL08") if _tuoiDon(o) is not None and _lopChoOB(o)]
# chua hoc buoi nao thi len truoc; trong moi nhom thi don CU NHAT len truoc (moc xa nhat can don cu)
_obAll.sort(key=lambda o: (str(o.get("student_id") or "") in _daHoc,
                           code(o.get("onboarding_status")) == "completed",
                           -_tuoiDon(o)))
_obGieo = set()
if len(_obAll) >= 5:
    def _dat08(o, cls, sent, cf, cft, tt):
        o["class_id"] = str(cls.get("class_id") or "") if cls else ""
        o["class_id_name"] = str(cls.get("class_name") or "") if cls else ""
        o["class_info_sent_at"] = sent; o["class_confirmation_status"] = cf
        o["confirmation_time"] = cft; o["onboarding_status"] = tt

    _DD = eF("enum_onboarding_status", "in_progress")
    _XN = eF("enum_class_confirmation_status", "confirmed")

    def _moc(o, gio):
        """Moc gio truoc day - nhung KHONG duoc som hon luc dang ky mot tieng.

        Xep lop truoc khi co don la chuyen khong the xay ra ngoai doi; bo kiem logic bat dung
        (13g). Ke ca khi phai keo mup lai, thu tu van con dung.
        """
        _t = NOW - datetime.timedelta(hours=gio)
        _e = _donCua.get(str(o.get("enrollment_id") or ""))
        _d = dt(_e.get("enrollment_time")) if _e else None
        if _d and _t < _d + datetime.timedelta(hours=1):
            _t = _d + datetime.timedelta(hours=1)
        return _t

    def _sau(t, gio):
        """Moc SAU mot moc khac, nhung khong duoc vuot qua bay gio."""
        return min(t + datetime.timedelta(hours=gio), NOW - datetime.timedelta(minutes=5))

    # _obAll da sap theo TUOI DON giam dan, nen ho so nao can moc xa nhat thi nhan don cu nhat.
    # Nguong CH2: chua xep lop qua slaPLR48_hours=48 -> NA063; xep roi chua gui info qua
    # slaClassInfoZalo_hours=24 -> NA062; xac nhan roi qua slaOBT_hours=48 -> NA010.
    # NA010 - HV da xac nhan ma QUA HAN chua hoan tat nhap hoc (can don CU NHAT)
    _a0 = _moc(_obAll[0], 140); _s0 = _sau(_a0, 20); _c0 = _sau(_s0, 24)
    _dat08(_obAll[0], _lopChoOB(_obAll[0]), fmt(_s0), _XN, fmt(_c0), _DD); _obAll[0]["assigned_at"] = fmt(_a0)
    # NA063 - da xac nhan dang ky ma QUA HAN chua xep lop. Ho so nay bi XOA lop, nen phai chon
    # nguoi CHUA HOC BUOI NAO - xoa lop cua mot em dang di hoc la de lai diem danh mo coi.
    _u63 = [o for o in _obAll[1:] if str(o.get("student_id") or "") not in _daHoc] or _obAll[1:2]
    _o63 = _u63[0]
    _a1 = _moc(_o63, 96)
    _dat08(_o63, None, "", "", "", _DD); _o63["assigned_at"] = fmt(_a1)
    _con = [o for o in _obAll[1:] if o is not _o63]
    # NA062 - da xep lop ma QUA HAN chua gui thong tin Zalo
    _a2 = _moc(_con[0], 72)
    _dat08(_con[0], _lopChoOB(_con[0]), "", "", "", _DD); _con[0]["assigned_at"] = fmt(_a2)
    # NA011 - HV da xac nhan, nhap hoc dang do va CON trong han
    _a3 = _moc(_con[1], 40); _s3 = _sau(_a3, 20); _c3 = _sau(_s3, 14)
    _dat08(_con[1], _lopChoOB(_con[1]), fmt(_s3), _XN, fmt(_c3), _DD); _con[1]["assigned_at"] = fmt(_a3)
    # NA090 - da gui thong tin lop, HV CHUA xac nhan
    _a4 = _moc(_con[2], 30); _s4 = _sau(_a4, 10)
    _dat08(_con[2], _lopChoOB(_con[2]), fmt(_s4), "", "", _DD); _con[2]["assigned_at"] = fmt(_a4)
    # NA013 - moi xep lop, van CON TRONG HAN moi buoc (khong qua han gi ca)
    if len(_con) >= 4:
        _a5 = _moc(_con[3], 2)
        _dat08(_con[3], _lopChoOB(_con[3]), "", "", "", _DD); _con[3]["assigned_at"] = fmt(_a5)
        _seed.append("NA013")
    _seed += ["NA063", "NA062", "NA090", "NA011", "NA010"]
    _obGieo = {str(o.get("onboarding_id") or "") for o in ([_obAll[0], _o63] + _con[:4])}
else:
    # Khoi gieo KHONG CHAY = 6 tinh huong SOP bien mat. Truoc day no im lang bo qua va bang tong
    # ket van xanh; chi bo kiem trigger moi bat duoc. Nay keu to ngay tai cho.
    log.append("!!! 14novodecies KHONG GIEO DUOC: chi co %d ho so xep lop du dieu kien (can >=5)"
               % len(_obAll))
log.append("14novodecies. Gieo ca cho cac tinh huong SOP chua co trong demo: %s" % ", ".join(_seed))

# ═══ 14octodecies. BA TÌNH HUỐNG ĐĂNG KÝ SOP MÔ TẢ MÀ DEMO CHƯA CÓ CA (V9.41) ═
# Sổ trigger HD3 mô tả NA060 (đơn chờ quá lâu, nên hủy), NA087 (đã đủ cọc mà đơn còn treo) và
# NA088 (đã đóng đủ mà chưa mở onboarding). Cả ba đều là việc THẬT ngoài đời, nhưng dữ liệu demo
# không có ca nào - nên ba màn đó không ai xem được và bộ kiểm không chứng minh được luật có chạy.
# Gieo ĐÚNG MỘT ca mỗi loại: đủ để nhìn thấy, không đủ để làm nhiễu phễu.
_pend = [e for e in R("DL06") if code(e.get("enrollment_status")) == "pending"]
_coc = 5000000
for _c in (d.get("config", {}).get("ch2") or []):
    if _c.get("name") == "thresholdDeposit_minimum":
        _coc = int(n(_c.get("value")) or 5000000)
def _raiDot(eid):
    """Rai lai tien da dong cua MOT don xuong cac dot cua no.

    Bang lich dot (DL06b) duoc dung o §14d tu paid_amount luc do. Khoi gieo nay doi paid_amount
    SAU §14d, nen neu khong rai lai thi don ghi "da dong 5 trieu" con bang dot ghi 0 - hai noi
    cung mot su that, lech nhau, va bo kiem hoc phi bat dung. Ai doi paid_amount sau §14d thi
    PHAI goi ham nay.
    """
    _ls = [x for x in dl.get("DL06b", []) if str(x.get("enrollment_id")) == str(eid)]
    if not _ls:
        return
    _ls.sort(key=lambda z: int(n(z.get("installment_no"))))
    _e = IDX["DL06"].get(str(eid))
    _con = n(_e.get("paid_amount")) if _e else 0
    for _x in _ls:
        _due = n(_x.get("due_amount"))
        _tra = min(_due, max(0, _con))
        _con -= _tra
        _x["paid_amount"] = _tra
        _x["remaining_amount"] = _due - _tra
        _dd = dt(_x.get("due_date"))
        if _tra >= _due - 1:
            _x["status"] = "paid (Đã đóng đủ)"
        elif _tra > 0:
            _x["status"] = "partial (Đóng một phần)"
            _x["paid_time"] = _x.get("paid_time") or fmt(NOW - datetime.timedelta(days=2))
        elif _dd and _dd < NOW - datetime.timedelta(days=LATE):
            _x["status"] = "overdue (Quá hạn)"
        elif _dd and _dd < NOW:
            _x["status"] = "due (Đến hạn)"
        else:
            _x["status"] = "upcoming (Chưa tới hạn)"
        if _tra <= 0:
            _x["paid_time"] = ""
    _mo = [x for x in _ls if not str(x.get("status")).startswith("paid")]
    if _e:
        _e["next_payment_due"] = _mo[0]["due_date"] if _mo else ""


def _lapPhieuThu(e, tien, ghichu, dot):
    """Lap MOT phieu thu that cho khoan tien vua ghi vao don.

    Tien vao thi phai co chung tu. Truoc day em chi nang paid_amount, thanh ra don ghi "da dong 5
    trieu" ma so quy trong 0 dong - mot app quan ly hoc phi ma tien khong co phieu thi khong tin
    duoc, va bo kiem tien bat dung ngay.

    KHONG LAP HAI LAN (bay da can 06/08). `fixdata.py` doc THANG demo_data_big.json roi ghi de
    len chinh no - y het bay da can o `gen_demo.py`. Chay lai fixdata mot lan nua la don
    ENR-2026-087 co HAI phieu 5 trieu giong het (PAY-108 va PAY-110), tong phieu thu 10 trieu
    trong khi paid_amount van 5 trieu; `check_data.py` bao LOI NANG. Mot ham GIEO du lieu phai
    hoi truoc "cho nay da co chua" - vi khong ai bao dam duoc day chuyen chi chay dung mot luot.
    """
    for _cu in R("DL07"):
        if str(_cu.get("enrollment_id") or "") == str(e.get("enrollment_id") or "") \
           and str(_cu.get("payment_note") or "") == ghichu \
           and str(_cu.get("installment_no") or "") == str(dot):
            return
    _tt = [x for x in R("DL01") if code(x.get("role")) in ("accountant", "ketoan")] or R("DL01")[:1]
    _nv = _tt[0] if _tt else {}
    _pn = 0
    for _p in R("DL07"):
        _m = re.match(r"PAY-\d{4}-(\d+)$", str(_p.get("payment_id") or ""))
        if _m:
            _pn = max(_pn, int(_m.group(1)))
    R("DL07").append({
        "payment_id": "PAY-2026-%03d" % (_pn + 1),
        "enrollment_id": e.get("enrollment_id", ""),
        "student_id": e.get("student_id", ""), "lead_id": e.get("lead_id", ""),
        "student_id_name": e.get("student_id_name") or e.get("lead_id_name", ""),
        "next_action": "",
        "payment_time": fmt(NOW - datetime.timedelta(days=2)),
        "payment_method": "bank_transfer (Chuyển khoản NH)",
        "amount": tien, "transaction_fee": 0, "net_received": tien,
        "bank_name": "ACB", "sender_name": e.get("lead_id_name", ""),
        "transaction_ref": "THU-" + str(e.get("enrollment_id") or ""),
        "received_by": _nv.get("staff_id", ""), "received_by_name": _nv.get("full_name", ""),
        "verified_by": _nv.get("staff_id", ""), "verified_by_name": _nv.get("full_name", ""),
        "payment_note": ghichu, "installment_no": str(dot),
    })


_g60 = _g87 = _g88 = 0
if len(_pend) >= 2:
    # NA060 - đơn chờ đã 10 ngày, chưa đóng đồng nào: nên hủy để dọn phễu
    _e = _pend[0]
    _e["enrollment_time"] = fmt(NOW - datetime.timedelta(days=10))
    _e["paid_amount"] = 0
    _e["remaining_amount"] = n(_e.get("final_fee")) or n(_e.get("total_fee"))
    _raiDot(_e.get("enrollment_id"))
    _g60 = 1
    # NA087 - đã đủ cọc tối thiểu mà đơn vẫn treo ở "chờ": em đã đóng tiền mà chưa được xếp lớp
    _e2 = _pend[1]
    _e2["paid_amount"] = _coc
    _tot2 = n(_e2.get("final_fee")) or n(_e2.get("total_fee"))
    _e2["remaining_amount"] = max(0, _tot2 - _coc)
    _e2["payment_status"] = eF("enum_payment_status", "partial")
    # Tien vao thi PHAI co phieu thu. Truoc day em chi nang paid_amount ma khong lap phieu, thanh
    # ra don ghi "da dong 5 trieu" nhung so quy trong 0 dong - bo kiem tien bat ngay, va dung la
    # bat dung: mot cai app quan ly hoc phi ma tien khong co chung tu thi khong tin duoc.
    _lapPhieuThu(_e2, _coc, "Đặt cọc giữ chỗ", 1)
    _raiDot(_e2.get("enrollment_id"))
    _g87 = 1
# NA088 - đã đóng đủ mà chưa có hồ sơ xếp lớp: tiền vào rồi mà dịch vụ chưa bắt đầu.
# Truoc day em gieo bang cach XOA ho so xep lop cua mot don da dong du. Sai hai duong: (1) xoa la
# mot tinh huong SOP khac bien mat khong dau vet - da can dung, NA010 bay hoi vi vay; (2) don da
# dong du deu la cua HOC VIEN THAT, xoa xong con lai mot em khong co bat ky ban ghi xep lop nao,
# tuc la tao ra mot cai loi du lieu de gieo mot tinh huong. Nay gieo THUAN: lay mot don DANG CHO
# (chua co ho so xep lop tu dau), cho dong du tien va xac nhan - dung cau chuyen "tien vao roi ma
# hoc vu chua mo buoc xep lop".
_obE = {str(o.get("enrollment_id") or "") for o in R("DL08")}
_du = [e for e in _pend[2:]
       if str(e.get("enrollment_id") or "") not in _obE
       and (n(e.get("final_fee")) or n(e.get("total_fee"))) > 0]
if _du:
    _rm = _du[0]
    _phi = n(_rm.get("final_fee")) or n(_rm.get("total_fee"))
    _rm["paid_amount"] = _phi
    _rm["remaining_amount"] = 0
    _rm["payment_status"] = eF("enum_payment_status", "paid")
    _rm["enrollment_status"] = eF("enum_enrollment_status", "confirmed")
    _rm["enrollment_time"] = fmt(NOW - datetime.timedelta(days=3))
    _lapPhieuThu(_rm, _phi, "Đóng đủ học phí", 1)
    _raiDot(_rm.get("enrollment_id"))
    _g88 = 1
# NA005 - don CHO da qua han xac nhan nhung CHUA den muc "de lau qua, nen huy" (NA060).
# Cua so cua no hep: qua slaENR_pending_hours (24h) nhung chua qua slaENR_stale_hours (7 ngay),
# va chua dong dong nao (dong roi thi thanh NA087). Truoc 07/08 khong ai gieo ca nay - no xanh
# vi TINH CO co mot don roi dung vao cua so ay; doi mot nhip ngau nhien la SOP mo ta mot tinh
# huong ma app khong con sinh ra, va check_sop bat dung. Nay gieo THANG, khong trong may nua.
_g05 = 0
_con = [e for e in _pend[2:]
        if str(e.get("enrollment_id") or "") not in _obE
        and code(e.get("enrollment_status")) == "pending"]
if _con:
    _e5 = _con[0]
    _e5["enrollment_time"] = fmt(NOW - datetime.timedelta(days=3))
    _e5["paid_amount"] = 0
    _e5["remaining_amount"] = n(_e5.get("final_fee")) or n(_e5.get("total_fee"))
    _e5["payment_status"] = eF("enum_payment_status", "unpaid")
    _raiDot(_e5.get("enrollment_id"))
    _g05 = 1
log.append("14octodecies. Dang ky: gieo %d ca cho qua han, %d ca du coc con treo, %d ca du tien chua mo onboarding, %d ca cho qua han xac nhan (NA005)"
           % (_g60, _g87, _g88, _g05))

# ═══ 14octodecies-bis. NA032 - BUỔI WOW ĐÃ XÁC NHẬN MÀ QUA GIỜ HẸN (V9.47) ════════════
# SOP mô tả tình huống này (HD3 NA032) và app CÓ luật cho nó, nhưng sau khi sinh lại dữ liệu thì
# 12 buổi booked/confirmed đều nằm ở TƯƠNG LAI - không còn ca nào quá giờ, nên luật không bao giờ
# chạy và check_sop báo đỏ.
# Đây đúng là loại bẫy đã ghi trong nhật ký: DỮ LIỆU DEMO PHẢI DIỄN ĐỦ MỌI TÌNH HUỐNG SOP, nếu
# không thì một luật có thật cũng nằm im mà không ai biết. Gieo THUẬN chứ không xoá gì: lấy một
def _gioLui(gio_it_nhat):
    """Lui ve QUA KHU it nhat `gio_it_nhat` gio, nhung phai roi vao KHUNG GIO DAY cua trung tam.

    QUA MIN HEN GIO THEO DONG HO, bat duoc 10/08: cho nay truoc viet `NOW - 5 gio` tron. Pipeline
    chay luc 13:47 thi ra 08:47 - lot; chay luc 09:28 thi ra **04:28** - mot buoi WOW luc 4 gio
    sang. Tuc bam "Reset demo" buoi sang duoc mot ban demo hong, bam buoi chieu duoc ban lanh, ma
    khong ai doi mot dong ma nao. `check_logic` luat 7j sinh ra de bat dung ca nay va no da bat.
    Cung mot ho voi bay loi gio da vá 09/08 - lan nay o `fixdata` chu khong o `gen_demo`."""
    moc = NOW - datetime.timedelta(hours=gio_it_nhat)
    for h in (19, 17, 15, 9):
        t = moc.replace(hour=h, minute=0, second=0, microsecond=0)
        if t <= moc:
            return t
    return (moc - datetime.timedelta(days=1)).replace(hour=19, minute=0, second=0, microsecond=0)

# buổi đã xác nhận, kéo giờ hẹn lùi lại quá khứ - đúng câu chuyện "giờ hẹn qua rồi mà chưa ai bấm
# bắt đầu, buổi có diễn ra không?".
_wCf = [w for w in R("DL14")
        if str(w.get("wow_status") or "").startswith("confirmed")
        and not str(w.get("wow_content_note") or "").strip()]
_g32 = 0
if _wCf:
    _w32 = _wCf[0]
    _w32["wow_session_date"] = fmt(_gioLui(5))
    _g32 = 1
else:
    # không có buổi nào đã xác nhận thì nâng một buổi đã đặt lên "đã xác nhận" rồi kéo lùi giờ -
    # vẫn là câu chuyện thuận, không xoá dữ liệu của ai.
    _wBk = [w for w in R("DL14") if str(w.get("wow_status") or "").startswith("booked")]
    if _wBk:
        _w32 = _wBk[0]
        _w32["wow_status"] = eF("enum_wow_status", "confirmed")
        _w32["wow_session_date"] = fmt(_gioLui(5))
        _g32 = 1
log.append("14octodecies-bis. WOW: gieo %d ca da xac nhan ma qua gio hen (NA032)" % _g32)

# NA003 - phiếu tư vấn "Quan tâm, chưa chốt" ĐÃ QUÁ hạn chăm lại (slaFollowup_grace_days = 3
# ngày). Mọi phiếu còn mở trong bản sinh mới đều chỉ 1-2 ngày tuổi nên chưa ai quá hạn, và luật
# NA003 nằm im. Kéo lùi một phiếu về 5 ngày trước - đúng câu chuyện "khách nói để suy nghĩ, rồi
# không ai gọi lại".
_tv = [x for x in R("DL04")
       if str(x.get("conversion_status") or "").startswith("interested")
       and str(x.get("consultation_time") or "").strip()]
_g03 = 0
if _tv:
    _tv[0]["consultation_time"] = fmt(NOW - datetime.timedelta(days=5, hours=2))
    _g03 = 1
log.append("14octodecies-ter. Tu van: gieo %d phieu quan tam da qua han cham lai (NA003)" % _g03)

# NA025 - vắng KHÔNG PHÉP mà học vụ ĐÃ gọi hỏi thăm và có ghi chú. Dữ liệu có 75 lượt vắng không
# phép nhưng buổi nào cũng quá 24h và không lượt nào có ghi chú, nên tất cả đều rơi vào NA070
# ("quá hạn gọi") - NA025 không bao giờ chạy.
# Ba khối gieo này (NA032, NA003, NA025) sinh ra vì MỘT nguyên nhân chung, phải ghi lại:
# pipeline neo theo `datetime.now()`, nên chạy lại vào giờ khác là "ai đang quá hạn" đổi theo, và
# một luật CÓ THẬT có thể nằm im chỉ vì hôm nay không ai rơi vào ca đó. Seed ngẫu nhiên đã cố
# định từ lâu; thứ trôi là THỜI GIAN. Cách chữa: gieo neo theo NOW (không neo theo ngày tuyệt
# đối) cho mọi tình huống SOP mà dữ liệu tự nhiên hay bỏ sót.
_ns = [x for x in R("DL12")
       if str(x.get("attendance_status") or "").startswith("no_show")
       and "unexcused" in str(x.get("absence_type") or "")
       and not str(x.get("note") or "").strip()]
_g25 = 0
if _ns:
    _ns[0]["note"] = "Đã gọi hỏi thăm, HV báo bận việc gia đình và hứa đi học lại buổi tới."
    _g25 = 1
log.append("14octodecies-quater. Diem danh: gieo %d ca vang khong phep DA goi hoi tham (NA025)" % _g25)

# ═══ 14septdecies. NĂM MỨC CAN THIỆP HỌC VIÊN NGUY CƠ (V9.41) ════════════
# SOP phân NĂM mức, mỗi mức một hành động khác hẳn (họp 4 bên / họp 3 bên trong 24h / họp 3 bên /
# đặt buổi WOW kèm / gọi trong 24-48 giờ). Nhưng dữ liệu demo chỉ có ĐÚNG MỘT người mang cờ
# off_track - và người đó đã bỏ học, nên năm màn can thiệp không có ca nào để xem, và bộ kiểm
# không chứng minh được luật có chạy hay không.
# Gieo từ chính nhóm MÁY ĐÃ THẤY vượt ngưỡng: máy thấy -> học vụ xác nhận -> gắn cờ. Như vậy dữ
# liệu kể một câu chuyện nhất quán chứ không phải cờ rơi từ trên trời xuống.
def _dangHoc(s):
    return code(s.get("student_status")) in ("active", "studying", "") or "active" in str(s.get("student_status") or "")


_absU = {}
for _a in R("DL12"):
    if code(_a.get("attendance_status")) != "no_show":
        continue
    if "unexcused" not in code(_a.get("absence_type")):
        continue
    _sid = str(_a.get("student_id") or "")
    _absU[_sid] = _absU.get(_sid, 0) + 1
_missHW = {}
for _x in R("DL13"):
    if code(_x.get("homework_status")) == "missing":
        _sid2 = str(_x.get("student_id") or "")
        _missHW[_sid2] = _missHW.get(_sid2, 0) + 1

_ung = [_x2 for _x2 in R("DL09") if _dangHoc(_x2)
        and (_absU.get(str(_x2.get("student_id") or ""), 0) >= 2
             or _missHW.get(str(_x2.get("student_id") or ""), 0) >= 3)]
# nặng nhất trước: ai vắng nhiều nhất thì rơi vào mức nặng nhất - đúng thứ tự đời thật
_ung.sort(key=lambda _y: -(_absU.get(str(_y.get("student_id") or ""), 0)
                           + _missHW.get(str(_y.get("student_id") or ""), 0)))
_CC = {"on": "on_track (Đang đều đặn)", "at": "at_risk (Có nguy cơ)", "off": "off_track (Sa sút nặng)"}
_HT = {"on": "on_track (Đang tiến bộ)", "at": "at_risk (Có nguy cơ)", "off": "off_track (Lệch tiến độ)"}
# (số người, cờ chuyên cần, cờ học thuật, lý do) - phủ đủ 5 mức SOP mô tả
_KE = [(1, "off", "off", "vừa yếu chuyên cần vừa yếu học thuật - mức nguy hiểm"),
       (1, "on", "off", "tiến độ học thuật rớt khỏi lộ trình"),
       (1, "off", "on", "chuyên cần sa sút nặng"),
       (2, "on", "at", "học thuật có dấu hiệu rủi ro"),
       (2, "at", "on", "chuyên cần có dấu hiệu rủi ro")]
_i = 0
_dat = 0
for _n, _cc, _ht, _ly in _KE:
    for _k in range(_n):
        if _i >= len(_ung):
            break
        _s = _ung[_i]; _i += 1
        if _cc != "on":
            _s["attendance_progress_status"] = _CC[_cc]
        if _ht != "on":
            _s["academic_progress_status"] = _HT[_ht]
        _s["learning_followup_note"] = ((_s.get("learning_followup_note") or "") and
                                        (_s["learning_followup_note"] + " | ")) + \
            fmt(NOW - datetime.timedelta(days=random.randint(1, 9))) + ": học vụ xác nhận " + _ly + " sau khi máy báo vượt ngưỡng"
        _dat += 1
log.append("14septdecies. Nguy co: gan co cho %d hoc vien phu du 5 muc can thiep SOP mo ta "
           "(chon tu nhom may da thay vuot nguong)" % _dat)

# ═══ 14sexdecies. NGƯỜI GIÁM HỘ / PHỤ HUYNH (V9.40d - anh Luân chốt 29/07) ═
# "Trong sop a nhớ có quy định số đt phụ huynh hoặc người giám hộ, nên cho chọn ai thanh toán,
#  ai liên hệ chính luôn."
# SOP DL09 CÓ sẵn emergency_contact_name / _phone / _relation (dữ liệu mẫu của SOP ghi
# "PH Anh · 0901110001 · Phụ huynh") - nhưng app KHÔNG một dòng nào đọc tới, tức là ba cột đó
# nằm chết trong dữ liệu suốt từ đầu. Đây là SÓT so với SOP, không phải tính năng mới.
# Nay chuẩn hoá quan hệ về danh mục CH1 (đang là chữ tự do "Bố"/"Anh trai") và thêm HAI quyết
# định mà anh Luân yêu cầu: ai đóng tiền, ai là đầu mối liên hệ chính.
# ÁP THẲNG, không "gieo nếu trống": gen_demo chép nguyên khối enums của file cũ sang, nên kiểu
# "if not" chỉ chạy đúng một lần trong đời rồi danh mục cũ bám mãi - đã cắn khi đổi sang bộ 7 mục.
# anh Luân 30/07: *"Đã chuyển đổi - đã thành HV là 1 đúng ko, vậy để lại 1 chữ thôi cho đúng
# bản chất, ko cần kẹp chung ở trạng thái đâu."* Đúng - hai vế nói CÙNG một ý, nhãn tự lặp lại
# chính nó. ÁP THẲNG (không "gieo nếu trống") vì gen_demo chép nguyên khối enums của file cũ sang.
_ls = d.setdefault("enums", {}).get("enum_lead_status") or []
d["enums"]["enum_lead_status"] = [
    ("converted (Đã thành học viên)" if str(x).startswith("converted") else x) for x in _ls]
for _r in R("DL02"):
    if str(_r.get("lead_status", "")).startswith("converted"):
        _r["lead_status"] = "converted (Đã thành học viên)"

d.setdefault("enums", {})["enum_guardian_relation"] = [
    "grandfather (Ông)", "grandmother (Bà)", "father (Bố)", "mother (Mẹ)",
    "brother (Anh)", "sister (Chị)", "guardian (Người giám hộ)"]
if "enum_contact_primary" not in d["enums"]:
    d["enums"]["enum_contact_primary"] = [
        "student (Liên hệ thẳng học viên)",
        "guardian (Liên hệ người giám hộ)",
        "both (Liên hệ cả hai)"]
if "enum_payer_side" not in d["enums"]:
    d["enums"]["enum_payer_side"] = [
        "student (Học viên tự đóng)",
        "guardian (Người giám hộ đóng)",
        "company (Công ty/đơn vị tài trợ)"]

# Danh sách quan hệ anh Luân chốt 30/07: ông, bà, bố, mẹ, anh, chị, người giám hộ - mỗi quan hệ
# MỘT mục riêng để lúc nhập chọn thẳng, không gộp "Ông/Bà" hay "Anh/Chị/Em" bắt người ta đoán.
# Chữ tự do cũ (kể cả vợ/chồng, phụ huynh) quy về mục gần nhất; không khớp gì thì về "người giám hộ".
_RELMAP = {"mẹ": "mother (Mẹ)", "bố": "father (Bố)", "ba": "father (Bố)",
           "ông": "grandfather (Ông)", "bà": "grandmother (Bà)",
           "anh trai": "brother (Anh)", "chị gái": "sister (Chị)",
           "anh": "brother (Anh)", "chị": "sister (Chị)", "em": "sister (Chị)",
           "vợ/chồng": "guardian (Người giám hộ)", "vợ": "guardian (Người giám hộ)", "chồng": "guardian (Người giám hộ)",
           "phụ huynh": "guardian (Người giám hộ)", "người giám hộ": "guardian (Người giám hộ)"}


def _tuoi(s):
    """Tuổi suy từ ngày sinh - dùng để đoán mặc định ai là đầu mối liên hệ."""
    _d = dt(s.get("dob"))
    if not _d:
        return None
    return int((NOW - _d).days / 365.25)


_gh = _pay = _ct = 0
for _s in R("DL09"):
    _s.setdefault("emergency_contact_name", "")
    _s.setdefault("emergency_contact_phone", "")
    _s.setdefault("emergency_contact_relation", "")
    _s.setdefault("contact_primary", "")
    _s.setdefault("payer_side", "")
    # chuẩn hoá quan hệ về CH1
    _r = str(_s.get("emergency_contact_relation") or "").strip()
    if _r and "(" not in _r:
        _s["emergency_contact_relation"] = _RELMAP.get(_r.lower(), "guardian (Người giám hộ)")
        _gh += 1
    _tu = _tuoi(_s)
    _co_gh = bool(str(_s.get("emergency_contact_phone") or "").strip())
    # Mặc định hợp lý: HV dưới 18 thì người giám hộ là đầu mối và là người đóng tiền;
    # từ 18 trở lên thì tự lo. Đây chỉ là giá trị KHỞI ĐẦU - trung tâm sửa được từng em.
    if not str(_s.get("contact_primary") or "").strip():
        if _tu is not None and _tu < 18 and _co_gh:
            _s["contact_primary"] = "guardian (Liên hệ người giám hộ)"
        elif _co_gh:
            _s["contact_primary"] = "both (Liên hệ cả hai)"
        else:
            _s["contact_primary"] = "student (Liên hệ thẳng học viên)"
        _ct += 1
    if not str(_s.get("payer_side") or "").strip():
        if _tu is not None and _tu < 18 and _co_gh:
            _s["payer_side"] = "guardian (Người giám hộ đóng)"
        else:
            _s["payer_side"] = "student (Học viên tự đóng)"
        _pay += 1
log.append("14sexdecies. Nguoi giam ho: chuan hoa %d quan he ve CH1, dat mac dinh dau moi lien he "
           "cho %d HV va nguoi dong tien cho %d HV" % (_gh, _ct, _pay))

# ═══ 14quindecies. MỐC GIỜ BUỔI WOW + CA TEST (V9.40c - anh Luân chốt 29/07) ═
# "Buổi wow cũng phải quản lý chặt" / "Test đầu vào thì tính theo lần nhưng vẫn phải ghi nhận
# vào ra". Buổi WOW 1-1 là quyền lợi ĐẮT NHẤT bán kèm học phí, mà sổ WOW chỉ ghi ngày giờ ĐẶT:
# không biết buổi có thật sự diễn ra không, kèm bao lâu, giáo viên có tới đúng giờ không.
# Ba cột mới cho DL14, hai cột cho DL03. Buổi/ca ĐÃ XONG thì gieo mốc giờ hợp lý để màn hình có
# cái mà xem; buổi chưa xong để trống - đó mới là hàng chờ thật.
_wowdur = {"speaking": 1.0, "writing": 1.5, "reading": 1.0, "listening": 1.0}
_wg = _wm = 0
for _w in R("DL14"):
    _w.setdefault("wow_start_actual", "")
    _w.setdefault("wow_end_actual", "")
    _w.setdefault("wow_late_minutes", "")
    if code(_w.get("wow_status")) != "completed":
        continue
    if str(_w.get("wow_start_actual") or "").strip():
        continue
    _d = dt(_w.get("wow_session_date"))
    if not _d:
        _wm += 1
        continue
    # phần lớn đúng giờ, một số ít trễ - để KPI kỷ luật có gì mà đo
    _late = random.choice([0, 0, 0, 0, 0, 3, 7, 12])
    _h = _wowdur.get(code(_w.get("wow_skill")) or "", 1.0)
    _w["wow_start_actual"] = fmt(_d + datetime.timedelta(minutes=_late))
    _w["wow_end_actual"] = fmt(_d + datetime.timedelta(minutes=_late + int(_h * 60)))
    _w["wow_late_minutes"] = str(_late)
    _wg += 1
# cố ý chừa vài buổi đã dạy mà KHÔNG có mốc giờ - đúng cảnh "ghi bù, quên bấm" ngoài đời,
# để luật "Buổi WOW thiếu mốc giờ" có ca thật mà nhắc
_done = [x for x in R("DL14") if code(x.get("wow_status")) == "completed" and x.get("wow_start_actual")]
for _w in _done[:3]:
    _w["wow_start_actual"] = ""; _w["wow_end_actual"] = ""; _w["wow_late_minutes"] = ""
    _wg -= 1
log.append("14quindecies-a. WOW: gieo moc gio vao-ra cho %d buoi da day (chua 3 buoi thieu moc de canh bao co ca that)" % _wg)

# CA TEST: tính công theo LẦN nhưng vẫn phải ghi vào - ra (anh Luân chốt)
_tg = 0
for _t in R("DL03"):
    _t.setdefault("test_start_actual", "")
    _t.setdefault("test_end_actual", "")
    if not str(_t.get("test_attendance_time") or "").strip():
        continue
    if str(_t.get("test_start_actual") or "").strip():
        continue
    _d = dt(_t.get("test_attendance_time"))
    if not _d:
        continue
    _t["test_start_actual"] = fmt(_d)
    _t["test_end_actual"] = fmt(_d + datetime.timedelta(minutes=random.choice([90, 105, 120])))
    _tg += 1
log.append("14quindecies-b. Test dau vao: gieo moc gio vao-ra cho %d ca da du test" % _tg)

# ═══ 14quaterdecies. BẢNG ĐƠN GIÁ GIỜ DẠY (V9.40 - anh Luân chốt 29/07) ══
# "Giảng viên tính theo giờ, mỗi giảng viên có mức giá riêng đấy, và ngày thường, cuối tuần,
# sáng hay tối đều có mức riêng, em nên cho cấu hình để sau này bên nhân sự họ tự sửa."
# Gieo MỘT bảng mặc định 6 ô + mức riêng cho 2 người để nhân sự mở ra là hiểu ngay cách dùng,
# chứ không phải nhìn một màn trống rồi đoán. Số là số MẪU - trung tâm tự sửa lại.
_gg = d.setdefault("config", {}).setdefault("giagio", [])
def _ggset(sid, day, shift, rate):
    for r in _gg:
        if str(r.get("staff_id") or "") == sid and r.get("day") == day and r.get("shift") == shift:
            return
    _gg.append({"staff_id": sid, "day": day, "shift": shift, "rate": rate})

# mặc định: tối đắt hơn sáng/chiều (giờ vàng), cuối tuần cộng thêm
for _d, _hs in (("thuong", {"sang": 160000, "chieu": 170000, "toi": 200000}),
                ("cuoituan", {"sang": 190000, "chieu": 190000, "toi": 220000})):
    for _s, _v in _hs.items():
        _ggset("", _d, _s, _v)

# hai giảng viên lâu năm nhất có mức riêng cao hơn - để thấy lớp GHI ĐÈ chạy thật
_gv = [x for x in R("DL01") if re.search(r"teacher", code(x.get("role")) or "")]
_gv.sort(key=lambda x: str(x.get("start_date") or "9999"))
for _i, _p in enumerate(_gv[:2]):
    _bonus = 60000 if _i == 0 else 30000
    for _d, _hs in (("thuong", {"sang": 160000, "chieu": 170000, "toi": 200000}),
                    ("cuoituan", {"sang": 190000, "chieu": 190000, "toi": 220000})):
        for _s, _v in _hs.items():
            _ggset(_p["staff_id"], _d, _s, _v + _bonus)
log.append("14quaterdecies. Don gia gio day: %d dong (mac dinh 6 o + muc rieng cho %d nguoi)"
           % (len(_gg), min(2, len(_gv))))

# ═══ 14terdecies. CỘT "LẦN NHẮC NỢ GẦN NHẤT" (V9.40) ═════════════════════
# Luật sinh việc "Thu công nợ" hoàn toàn dựa vào ngày hạn, không có mốc nào ghi "đã nhắc" -
# nên 25 dòng công nợ hiện y nguyên mỗi ngày và kế toán phải giữ một cuốn sổ ngoài app.
for _e in dl.get("DL06", []):
    _e.setdefault("last_reminded_at", "")
log.append("14terdecies. Cong no: them cot last_reminded_at cho %d don" % len(dl.get("DL06", [])))

# ═══ 14duodecies. HAI CỘT CHO "TẠM BỎ QUA CẢNH BÁO NGUY CƠ" (V9.40) ══════
# Từ V9.40 máy tự đếm vắng/thiếu bài theo ngưỡng CH2 chứ không đợi ai bấm cờ. Học vụ xem
# xong mà thấy KHÔNG phải nguy cơ thật thì phải gạt được - nhưng gạt VĨNH VIỄN thì việc
# biến mất mà không ai biết vì sao, nên gạt CÓ HẠN và CÓ LÝ DO. Hai cột này giữ chỗ đó.
for _s in dl.get("DL09", []):
    _s.setdefault("risk_ignore_until", "")
    _s.setdefault("risk_ignore_reason", "")
log.append("14duodecies. Nguy cơ: thêm cột risk_ignore_until/_reason cho %d học viên"
           % len(dl.get("DL09", [])))

# ═══ 14vicies. HAI CA PHẢI GIEO SAU CÙNG (V9.41) ══════════════════════════
# Hai tình huống này bị các pass phía trên ĐÈ LẠI nếu gieo sớm: pass "thứ tự thời gian" kéo ngày
# tạo lead về quá khứ, và pass gắn cờ nguy cơ chiếm mất học viên. Gieo ở đây - sau mọi pass,
# chỉ trước bước san phẳng cột. Đây đúng cái bẫy "vá hai nơi cho cùng một sự thật": gieo hai
# lần ở hai chỗ thì lần sau đè lần trước, và tình huống biến mất mà không ai biết.
_v = []
_ln = [l for l in R("DL02") if code(l.get("lead_status")) == "new"]
if _ln:
    _ln.sort(key=lambda l: str(l.get("lead_created_time") or ""), reverse=True)
    _l0 = _ln[0]
    _l0["lead_created_time"] = fmt(NOW - datetime.timedelta(minutes=3))
    _l0["first_call_time"] = ""
    _l0["contact_count"] = 0
    _l0["next_followup_time"] = ""
    _v.append("NA050")
_absV = {}
for _a3 in R("DL12"):
    if code(_a3.get("attendance_status")) == "no_show" and "unexcused" in code(_a3.get("absence_type")):
        _kk = str(_a3.get("student_id") or "")
        _absV[_kk] = _absV.get(_kk, 0) + 1
for _c3 in R("DL09"):
    _i3 = str(_c3.get("student_id") or "")
    if _absV.get(_i3, 0) >= 2:
        continue
    if code(_c3.get("attendance_progress_status")) not in ("on_track", ""):
        continue
    if code(_c3.get("academic_progress_status")) not in ("on_track", ""):
        continue
    if "active" not in str(_c3.get("student_status") or ""):
        continue
    _bs = [x for x in R("DL13") if str(x.get("student_id") or "") == _i3]
    if len(_bs) < 3:
        continue
    for _b3 in _bs[:3]:
        # "khong nop" phai don SACH moi dau vet cua viec da nop - de sot gio nop / nhan xet lai
        # thi dong du lieu tu mau thuan voi chinh no, va bo kiem du lieu bat dung ngay.
        _b3["homework_status"] = "missing (Không nộp)"
        _b3["homework_score"] = ""
        _b3["graded_at"] = ""
        _b3["homework_submitted_time"] = ""
        _b3["is_late"] = ""
        _b3["graded_within_48h"] = ""
        _b3["teacher_feedback"] = ""
    _v.append("NA065")
    break
# NA085 - phieu test DA CHAM nhung khong ai bam trang thai sau test. Day la loi nguoi that hay gap
# (cham xong roi quen), SOP co ma nhac rieng cho no; truoc day du lieu demo khong he co ca nao nen
# nhanh NA085 chua bao gio chay. Chon phieu chua co phieu tu van de khong dam vao NA002/NA086.
_lidTV = set(str(c.get("lead_id") or "") for c in R("DL04"))
for _t5 in R("DL03"):
    if str(_t5.get("lead_id") or "") in _lidTV:
        continue
    try:
        _sc = float(str(_t5.get("overall_score") or "0").replace(",", "."))
    except ValueError:
        _sc = 0.0
    if _sc <= 0 or not str(_t5.get("post_test_status") or "").strip():
        continue
    _t5["post_test_status"] = ""
    _v.append("NA085")
    break
log.append("14vicies. Gieo sau cung: %s" % (", ".join(_v) or "khong co"))

# ═══ 14vicies-b. ĐẾM LẠI SĨ SỐ SAU KHI GIEO ══════════════════════════════
# §8 đã đếm sĩ số một lần, nhưng các khối gieo tình huống ở §14novodecies chuyển học viên sang lớp
# khác - đếm ở §8 lập tức lỗi thời. Bộ đếm phải chạy SAU cùng mọi thứ đụng vào DL08. Đây là bẫy
# "thứ tự pass": một pass đúng đặt sai chỗ thì y như không có.
_c8z = 0
for _cz in R("DL10"):
    _real = len([o for o in R("DL08") if str(o.get("class_id")) == str(_cz.get("class_id"))])
    if int(n(_cz.get("current_enrollment"))) != _real:
        _cz["current_enrollment"] = _real
        _c8z += 1
log.append("14vicies-b. Dem lai si so sau khi gieo: sua %d lop" % _c8z)

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

# ═══ 14i. LỊCH SỬ ĐỔI LỊCH - BẢNG DL11b ══════════════════════════════════════════════════
# Trưởng phòng ACA hỏi 06/08: cần một module lịch sử đổi lịch nằm ngay dưới danh sách buổi, và
# một nút "Dời khóa học" - chọn buổi, chọn ngày mới, ghi lý do, các buổi sau tự dời theo.
#
# VÌ SAO PHẢI CÓ BẢNG RIÊNG: app đang ghi lý do lùi khai giảng vào ô `notes` của lớp dưới dạng
# một câu văn nối đuôi nhau. Ghi kiểu đó thì KHÔNG tra cứu được - không lọc được theo lớp, không
# đếm được lớp nào hay dời, không biết ai dời và dời mấy ngày. Một thứ cần TRA thì phải là dòng
# có cột, không phải một câu trong ô ghi chú.
_dh = dl.setdefault("DL11b", [])
if not _dh:
    _rnd5 = __import__("random").Random(20260807)
    _lyDo = ["Trùng lịch nghỉ lễ", "Giáo viên nghỉ đột xuất, không xếp được người dạy thay",
             "Phòng học bị trùng với lớp khác", "Học viên xin dời do lịch thi ở trường",
             "Trung tâm bảo trì hệ thống điện"]
    _nvHV = [x for x in R("DL01") if str(x.get("role", "")).startswith(("academic_", "aca_"))] or R("DL01")[:1]
    _n5 = 0
    for _c in R("DL10"):
        if _n5 >= 6:
            break
        if "in_progress" not in str(_c.get("class_status") or ""):
            continue
        _ssC = sorted([x for x in R("DL11") if str(x.get("class_id")) == str(_c.get("class_id"))],
                      key=lambda x: n(x.get("session_number")) or 0)
        if len(_ssC) < 3:
            continue
        _s5 = _ssC[min(2 + _n5, len(_ssC) - 1)]
        _cu = str(_s5.get("session_date") or "")
        if not _cu:
            continue
        _dich = _rnd5.choice([2, 3, 7])
        _moi = tshOne(_cu, _dich) if False else None
        try:
            _d0 = datetime.datetime.strptime(_cu[:10], "%d/%m/%Y")
            _moi = (_d0 + datetime.timedelta(days=_dich)).strftime("%d/%m/%Y") + _cu[10:]
        except Exception:
            continue
        _ng = _nvHV[_n5 % len(_nvHV)]
        _n5 += 1
        _dh.append({
            "change_id": "DOI-%03d" % _n5,
            "class_id": _c.get("class_id", ""), "class_id_name": _c.get("class_name", ""),
            "session_id": _s5.get("session_id", ""), "session_number": _s5.get("session_number", ""),
            "pham_vi": ("ca_khoa (Buổi này và các buổi sau)" if _n5 % 2 else "mot_buoi (Chỉ buổi này)"),
            "ngay_cu": _cu, "ngay_moi": _moi, "so_ngay_doi": _dich,
            "ly_do": _rnd5.choice(_lyDo),
            "nguoi_doi": _ng.get("staff_id", ""), "nguoi_doi_name": _ng.get("full_name", ""),
            "thoi_diem": fmt(NOW - datetime.timedelta(days=_rnd5.randint(1, 20))),
            "next_action": ""})
log.append("14i. Lich su doi lich (DL11b): %d lan doi" % len(_dh))

# ═══ 14h. NA067 - HỌC VIÊN IM LẶNG QUÁ LÂU, GIEO THẲNG ═══════════════════════════════════
# `check_sop` báo SOP mô tả NA067 mà app không sinh ra. Đào ra: `last_learning_activity_time`
# lấy từ mốc hoạt động THẬT (điểm danh / bài tập / WOW), nên chỉ cần dữ liệu dày lên một chút
# là không còn ai im lặng quá ngưỡng - trigger tắt mà không ai hay.
# Đây là lần THỨ HAI trong ngày một tình huống SOP xanh vì TÌNH CỜ chứ không vì được gieo
# (lần đầu là NA005). Bài học chung: tình huống nào SOP mô tả thì phải có người gieo NÓ, không
# trông vào chuyện dữ liệu ngẫu nhiên rơi trúng.
# Gieo THUẦN: lấy một học viên ĐANG HỌC, kéo mốc hoạt động cuối lùi quá ngưỡng - đúng câu
# chuyện "em này bặt tăm mấy tuần rồi mà chưa ai gọi".
_imN = 0
_nguong = 7
for _cf in dl.get("config", {}).get("ch2", []) or []:
    if str(_cf.get("name")) == "slaActivity_inactive_days":
        try: _nguong = int(float(str(_cf.get("value"))))
        except Exception: pass
for _st in R("DL09"):
    if _imN >= 2:
        break
    if "active" not in str(_st.get("student_status") or ""):
        continue
    if str(_st.get("attendance_progress_status") or "").startswith(("at_risk", "off_track")):
        continue
    if str(_st.get("academic_progress_status") or "").startswith(("at_risk", "off_track")):
        continue
    # `naFor()` chay theo THU TU: nguy co (co nguoi gan HOAC may thay vuot nguong) an truoc,
    # NA067 chi toi luot khi em ay SACH ca hai truc. Chon nham mot em may dang thay nguy co thi
    # gieo xong trigger van khong hien - da dinh dung vay o luot dau.
    _sid9 = str(_st.get("student_id") or "")
    _vang = len([a for a in R("DL12")
                 if str(a.get("student_id")) == _sid9
                 and "no_show" in str(a.get("attendance_status") or "")
                 and "unexcused" in str(a.get("absence_type") or "")])
    _thieu = len([h for h in R("DL13")
                  if str(h.get("student_id")) == _sid9
                  and "missing" in str(h.get("homework_status") or "")])
    if _vang >= 2 or _thieu >= 3:
        continue
    _st["last_learning_activity_time"] = fmt(NOW - datetime.timedelta(days=_nguong + 6 + _imN * 3))
    _imN += 1
log.append("14h. NA067 hoc vien im lang qua %d ngay: gieo %d em" % (_nguong, _imN))

# ═══ 14g. BUỔI THI GIỮA KHÓA / CUỐI KHÓA - CỘT session_type CỦA DL11 ═════════════════════
# Trưởng phòng ACA hỏi 06/08: buổi thi giữa khóa và cuối khóa phải HIỆN RA trong danh sách buổi,
# chứ không phải chỉ là một con số đếm ở đâu đó. Anh Luân chốt thêm: mặc định suy ra được, và
# **TP Học vụ hoặc TP ACA đổi lại được** buổi nào là buổi thi.
#
# VÌ SAO PHẢI CÓ CỘT THẬT chứ không suy tại chỗ lúc vẽ: nếu app tự tính "buổi giữa = buổi ở
# giữa" mỗi lần vẽ thì không ai ĐỔI được - mà đổi chính là thứ TP Học vụ cần (lớp nghỉ lễ, dời
# lịch, thi sớm một buổi). Một thứ người dùng phải sửa được thì phải có chỗ để lưu.
#
# MẶC ĐỊNH: buổi CUỐI của lớp = final; buổi ở khoảng GIỮA (làm tròn) = mid. Lớp dưới 4 buổi thì
# không gieo mid - một khóa quá ngắn không có "giữa khóa" để thi.
_stN = {"mid": 0, "final": 0}
_sesByCls = {}
for _s in R("DL11"):
    _sesByCls.setdefault(str(_s.get("class_id") or ""), []).append(_s)
for _cid, _ss in _sesByCls.items():
    _ss.sort(key=lambda x: n(x.get("session_number")) or 0)
    for _s in _ss:
        _s.setdefault("session_type", "")
        if not str(_s.get("session_type") or "").strip():
            _s["session_type"] = "regular (Buổi thường)"
    if not _ss:
        continue
    _ss[-1]["session_type"] = "final (Thi cuối khóa)"
    _stN["final"] += 1
    if len(_ss) >= 4:
        _ss[(len(_ss) - 1) // 2]["session_type"] = "mid (Thi giữa khóa)"
        _stN["mid"] += 1
log.append("14g. Buoi thi: %d buoi cuoi khoa + %d buoi giua khoa tren %d lop"
           % (_stN["final"], _stN["mid"], len(_sesByCls)))

# ═══ 14e. KỲ THI IELTS THẬT - BẢNG DL18b ═══════════════════════════════════════════════════
# 14e. KY THI IELTS THAT
# TP ACA hỏi qua điện thoại 06/08: tỷ lệ đạt AIM. Anh Luân chốt luật tính: **đạt AIM = điểm
# OVERALL >= band mục tiêu**, và có HAI tỷ lệ - theo điểm thi thử tại trung tâm (chính là kết
# quả BUỔI THI FINAL, đã có sẵn ở DL18.final_*) và theo ĐIỂM THI THẬT.
# SOP không có chỗ nào lưu điểm thi thật -> đây là phần THÊM (LUẬT CỨNG SỐ 0 cho phép thêm).
#
# VÌ SAO BẢNG RIÊNG CHỨ KHÔNG NHÉT THÊM CỘT VÀO DL18: học viên thi lại là chuyện thường. Nhét
# một bộ cột vào DL18 thì mỗi người chỉ giữ được MỘT lần thi - lần sau ghi đè lần trước, và tỷ
# lệ đạt AIM của trung tâm hiện ra thấp hơn thực tế. Anh Luân duyệt bảng riêng 06/08 kèm điều
# kiện: *"a sợ hiển thị rắc rối, nếu em vẫn có thể làm nó gọn đẹp và chuyên nghiệp thì anh okey"*
# -> màn chính chỉ hiện MỘT dòng cho mỗi HV (điểm được tính), số lần thi thu vào một chip nhỏ,
# bấm mới mở lịch sử. Bảng nhiều dòng nằm dưới lớp giao diện, không đổ ra màn.
_p2set("aimOfficialPick", "Điểm cao nhất", "cách chọn",
       "Học viên thi thật nhiều lần thì lấy lượt nào để tính đạt AIM")

import datetime as _dt3, random as _rnd3
_rnd3.seed(20260806)
def _ovr(a, b, c, e):
    """Overall IELTS = trung bình 4 kỹ năng, làm tròn về mốc 0.5 gần nhất, NỬA THÌ LÊN.

    KHÔNG dùng round() của Python: nó làm tròn "về số chẵn" (banker's rounding), nên
    round(12.5)=12 và trung bình 6.25 ra 6.0. IELTS làm tròn 6.25 LÊN 6.5, và hàm bandOvr
    bên JS của app dùng Math.round() nên cũng ra 6.5. Hai bên lệch nhau nửa band ở đúng những
    ca sát ngưỡng - tức là đúng những ca quyết định một em có đạt AIM hay không.
    """
    import math as _m
    return _m.floor((a + b + c + e) / 4 * 2 + 0.5) / 2

_ces = dl.get("DL18", [])
_sbyid = {s.get("student_id"): s for s in dl.get("DL09", [])}
_ky = []
_n = 0
for _ce in _ces:
    _sid = _ce.get("student_id", "")
    if not _sid: continue
    try: _tb = float(str(_ce.get("target_band") or 0) or 0)
    except Exception: _tb = 0
    if not _tb: continue
    # HV bỏ học thì không tính - họ không hoàn thành khoá nên không có "đầu ra" để đo.
    if "dropped" in str(_ce.get("student_status", "")): continue
    if _rnd3.random() > 0.75: continue           # ~25% chưa đăng ký thi thật
    try:
        _end = _dt3.datetime.strptime(str(_ce.get("course_completion_time", ""))[:10], "%d/%m/%Y")
    except Exception:
        continue
    _lan = 2 if _rnd3.random() < 0.35 else 1     # ~35% thi lại lần hai
    # Điểm thi thật bám theo ĐIỂM THI THỬ của chính em ấy chứ không bám theo mục tiêu - thi thử
    # cuối khoá là dự báo sát nhất mà trung tâm có. Lệch +-0.5 là biên độ thật của một kỳ thi.
    try: _mock = float(str(_ce.get("final_test_score") or 0) or 0)
    except Exception: _mock = 0
    _base = (_mock if _mock else _tb - 0.5) + _rnd3.choice([-0.5, 0.0, 0.0, 0.5])
    _d = None
    for _i in range(_lan):
        # Người ta thường thi trong vòng 2-5 tuần sau khi kết thúc khoá; thi lại cách đó ~6 tuần
        # (đủ để nhận kết quả và ôn thêm).
        _d = (_end + _dt3.timedelta(days=12 + _rnd3.randint(0, 25))) if _i == 0 \
             else (_d + _dt3.timedelta(days=35 + _rnd3.randint(0, 20)))
        # KHÔNG ĐƯỢC có kết quả thi mang ngày ở TƯƠNG LAI. Học viên vừa kết thúc khoá tuần
        # trước thì đơn giản là chưa đi thi - bỏ lượt này (và mọi lượt sau nó) chứ không kéo
        # ngày về. Kéo về sẽ dồn cục kết quả vào đúng hôm nay, nhìn là biết máy sinh.
        if _d.date() > NOW.date():
            break
        _n += 1
        # lần thi sau thường nhỉnh hơn - đó là lý do người ta thi lại
        _b = min(9.0, _base + (0.5 if _i else 0))
        _sk = [max(3.0, min(9.0, round((_b + _rnd3.choice([-0.5, 0, 0, 0.5])) * 2) / 2)) for _ in range(4)]
        _ky.append({
            "exam_id": "IELTS-%03d" % _n,
            "student_id": _sid,
            "student_id_name": (_sbyid.get(_sid) or {}).get("full_name", ""),
            "class_id": _ce.get("class_id", ""),
            "class_id_name": _ce.get("class_id_name", ""),
            "exam_date": _d.strftime("%d/%m/%Y"),
            "listening": str(_sk[0]), "reading": str(_sk[1]),
            "writing": str(_sk[2]), "speaking": str(_sk[3]),
            "overall": str(_ovr(*_sk)),
            "target_band": str(_tb),
            "attempt_no": str(_i + 1),
            "note": "" if _i == 0 else "Thi lại để nâng band",
            "next_action": ""})
dl["DL18b"] = _ky
log.append("14e. Ky thi IELTS that (DL18b): %d luot thi cua %d hoc vien"
           % (len(_ky), len(set(x["student_id"] for x in _ky))))


# ═══ 16. LUẬT BẤT BIẾN: KHÔNG THU TIỀN TRƯỚC NGÀY ĐĂNG KÝ (check_logic 6d) ═════════════════
# 16. LUAT BAT BIEN: KHONG THU TIEN TRUOC NGAY DANG KY
# Luật này đã cắm ở cuối `gen_demo.py` - và đặt ở đó là CHƯA ĐỦ. Bài học: `fixdata.py` còn SINH
# THÊM phiếu thu sau đó (PAY-2026-109 không hề tồn tại lúc gen_demo chạy xong), nên phiếu mới
# không đi qua luật. Một luật bất biến phải đứng ở CUỐI dây chuyền, sau người ghi cuối cùng;
# đứng giữa thì nó chỉ canh được phần việc phía trước nó.
# Lộ ra 06/08 khi thêm học viên lớp 1-1 làm chuỗi ngẫu nhiên lệch một nhịp - trước đó luật vẫn
# xanh, nhưng xanh vì MAY chứ không vì được canh.
import datetime as _dt2, random as _rnd2
# ═══ TRUOC HET: DON DANG KY KHONG DUOC MANG NGAY O TUONG LAI ═════════════════════════════
# Bat duoc 07/08 khi di truy PAY-2026-109 "thu tien truoc ngay dang ky": phieu thu khong sai,
# CAI SAI la don dang ky ghi ngay 09/08 - hai ngay nua moi toi. Mot don dang ky la ban ghi mot
# viec DA XAY RA; de no o tuong lai thi moi thu treo vao no (phieu thu, lich dong dot, han xac
# nhan) deu lech theo, va bo kiem se to cao nhung ban ghi vo toi o phia sau.
# Bai hoc lap lai lan thu ba trong ngay: truy mot con so bao do thi phai di toi GOC, dung va
# ngay cho no keu.
_donTL = 0
for _e in dl.get("DL06", []):
    _t = _e.get("enrollment_time", "")
    if not _t:
        continue
    try:
        _td = _dt2.datetime.strptime(_t, "%d/%m/%Y %H:%M")
    except Exception:
        continue
    if _td > NOW:
        _e["enrollment_time"] = (NOW - _dt2.timedelta(days=_rnd2.randint(1, 5),
                                                     hours=_rnd2.randint(0, 20))).strftime("%d/%m/%Y %H:%M")
        _donTL += 1
log.append("16pre. Don dang ky ghi ngay tuong lai: keo ve qua khu %d don" % _donTL)

_enrT = {e.get("enrollment_id",""): e.get("enrollment_time","") for e in dl.get("DL06", [])}
_sua = 0
for _p in dl.get("DL07", []):
    _et = _enrT.get(_p.get("enrollment_id",""), "")
    if not _et or not _p.get("payment_time"): continue
    try:
        _a = _dt2.datetime.strptime(_p["payment_time"], "%d/%m/%Y %H:%M")
        _b = _dt2.datetime.strptime(_et, "%d/%m/%Y %H:%M")
    except Exception: continue
    # ═══ KEP PHIEU THU VAO TRONG KHOANG [ngay dang ky ... bay gio] ═══════════════════════
    # Phieu thu phai nam SAU ngay dang ky VA KHONG duoc o tuong lai. Hai rang buoc nay phai xu
    # CUNG MOT LUC.
    # BAY DA CAN NGAY TRONG NGAY 07/08: em va dau tren truoc (khong thu tien tuong lai) bang mot
    # phep keo rieng, the la no keo mot phieu ve TRUOC ngay dang ky - thung dau duoi. Va mot dau
    # roi thung dau kia la dau hieu dang le phai KEP, khong phai chan tung ben.
    # Neu don dang ky o TUONG LAI (du lieu demo co the co) thi khong the keo phieu vao khoang
    # nao ca - de nguyen, `check_logic` se bat chinh cai don do.
    if _b <= NOW:
        if _a < _b or _a > NOW:
            _tre = int((NOW - _b).total_seconds() // 3600)
            _a = _b + _dt2.timedelta(hours=_rnd2.randint(1, max(1, min(20, _tre))))
            if _a > NOW:
                _a = NOW - _dt2.timedelta(minutes=_rnd2.randint(5, 120))
            _p["payment_time"] = _a.strftime("%d/%m/%Y %H:%M")
            _sua += 1
log.append("16. Phieu thu kep vao khoang [ngay dang ky ... bay gio]: chinh %d phieu" % _sua)

# 17. LUAT BAT BIEN: MOT DON DANG KY KHONG THE CO TRUOC KHI CO LEAD
# Bat duoc 09/08. `check_data` khai la "loi vua" nen bo kiem van DAT, va vi the no nam do lau
# ma khong ai di toi goc. Nhung mot don dang ky ghi ngay SOM HON luc khach lien he lan dau la
# mot chuyen khong the xay ra - mo dung ho so do ra la thay ngay.
# KEO MOC TAO LEAD VE SOM HON, chu khong day don dang ky muon di: `lead_created_time` nam o
# DAU day chuyen, doi no khong lam lech thu gi phia sau; con `enrollment_time` thi phieu thu,
# lich dong dot, han xac nhan lop deu treo vao - day no di la keo theo ca chum.
# Dat sau luat 16 va truoc luc ghi file: day la NGUOI GHI CUOI CUNG, dung bai hoc da ghi ngay
# tren dau muc 16 - mot luat bat bien phai dung o CUOI day chuyen.
_lead = {r.get("lead_id"): r for r in dl.get("DL02", []) if r.get("lead_id")}
_soKeo = 0
for _e in dl.get("DL06", []):
    _lid = _e.get("lead_id")
    if not _lid or _lid not in _lead:
        continue
    try:
        _te = _dt2.datetime.strptime(str(_e.get("enrollment_time", ""))[:16], "%d/%m/%Y %H:%M")
        _tl = _dt2.datetime.strptime(str(_lead[_lid].get("lead_created_time", ""))[:16], "%d/%m/%Y %H:%M")
    except Exception:
        continue
    if _tl <= _te:
        continue
    # lead phai co truoc don it nhat 1 ngay - khach lien he roi moi tu van roi moi dang ky
    _moi = (_te - _dt2.timedelta(days=_rnd2.randint(1, 5))).replace(
        hour=_rnd2.choice([9, 10, 14, 16, 19]), minute=_rnd2.choice([0, 15, 30]))
    _lead[_lid]["lead_created_time"] = _moi.strftime("%d/%m/%Y %H:%M")
    _soKeo += 1
log.append("17. Don dang ky co truoc lead: keo moc tao lead ve som %d ho so" % _soKeo)

# ---- 18. LICH TRUC WOW (DL26) PHAI KHOP VOI SO BUOI WOW (DL14) ----
# Dat o CUOI CUNG, dung bai hoc da ghi tren luat 16-17: *mot luat bat bien phai dung sau NGUOI
# GHI CUOI CUNG*. DL26 duoc dung trong `gen_demo`, nhung chinh `fixdata` con doi gio mot so buoi
# WOW o cac luat tren (vd 14octodecies-bis keo mot buoi ve qua khu). Doi gio xong ma khong doi
# ca thi lich truc va so buoi noi nguoc nhau - va cot "Doi chieu" cua man Lich truc bat duoc
# ngay: bao "lech 2" o lan chay dau.
# Hai chieu, phai lam ca hai thi moi kin:
#   · buoi CON SONG ma ca khong con giu -> mo/gan lai ca dung gio do;
#   · ca dang giu mot buoi da doi gio hoac da huy -> tra ca ve `available`, xoa ma buoi.
_slots = d["dl"].setdefault("DL26", [])
# 18a. NAP BUOI VE DUNG KHUNG GIO TRUOC DA. Cac luat tren doi gio buoi WOW theo nhu cau rieng
# cua chung (keo ve qua khu, day sang tuong lai) va khong luat nao biet den luoi truc. Neu de
# nguyen thi buoc mo ca ben duoi se de ra CA NGOAI LUOI: bang tong dem duoc ma luoi khong ve ra.
# Khung gio doc tu CH2 (`wowSlotHours`) - cung mot nguon voi app, khong go lai o day.
# Khung gio SINH RA tu ba ca + do dai o (bam OLMS, 11/08) - khong con doc mot chuoi khung go tay.
_cfg = {str(c.get("name")): c.get("value") for c in (d.get("config") or {}).get("ch2", [])}
_caTxt = str(_cfg.get("wowShifts") or "")
try: _buoc = int(float(_cfg.get("wowSlotMinutes") or 30))
except Exception: _buoc = 30
if _buoc < 5 or _buoc > 180: _buoc = 30
_khung = []
for _ca in _caTxt.split(","):
    _pp = [x.strip() for x in _ca.split("|")]
    if len(_pp) < 3: continue
    try:
        _h1, _m1 = [int(x) for x in _pp[1].split(":")]
        _h2, _m2 = [int(x) for x in _pp[2].split(":")]
    except Exception: continue
    _m = _h1 * 60 + _m1; _het = _h2 * 60 + _m2
    while _m + _buoc <= _het:
        _k = (_m // 60, _m % 60)
        if _k not in _khung: _khung.append(_k)
        _m += _buoc
_soNap = 0
if _khung:
    for _w in R("DL14"):
        _dt = str(_w.get("wow_session_date") or "").strip()
        if not _dt or str(_w.get("wow_status") or "").startswith("cancelled"): continue
        try: _cu = _dt2.datetime.strptime(_dt, "%d/%m/%Y %H:%M")
        except Exception: continue
        if (_cu.hour, _cu.minute) in _khung: continue
        _ung = [_cu.replace(hour=_h, minute=_m) for _h, _m in _khung]
        _qua = (_cu <= NOW)
        _hop = [c for c in _ung if (c <= NOW) == _qua] or _ung
        _moi = min(_hop, key=lambda c: abs((c - _cu).total_seconds()))
        _w["wow_session_date"] = _moi.strftime("%d/%m/%Y %H:%M")
        _soNap += 1
log.append("18a. Nap buoi WOW ve dung khung gio luoi truc: %d buoi" % _soNap)

_wowSong = {}
for _w in R("DL14"):
    _dt = str(_w.get("wow_session_date") or "").strip()
    if not _dt or str(_w.get("wow_status") or "").startswith("cancelled"): continue
    _wowSong[(str(_w.get("staff_id") or ""), _dt)] = _w
_byKey = {}
_traVe = 0
for _s in _slots:
    _k = (str(_s.get("staff_id") or ""), str(_s.get("slot_datetime") or ""))
    _byKey[_k] = _s
    _w = _wowSong.get(_k)
    if _w:
        _s["wow_id"] = _w["wow_id"]
        _s["wow_slot_status"] = eF("enum_wow_slot_status",
            "taught" if str(_w.get("wow_status") or "").startswith("completed") else "booked")
    elif str(_s.get("wow_id") or "").strip():
        _s["wow_id"] = ""
        _s["wow_slot_status"] = eF("enum_wow_slot_status", "available")
        _traVe += 1
_moThem = 0
_mx = 0
for _s in _slots:
    try: _mx = max(_mx, int(str(_s.get("slot_id") or "").split("-")[-1]))
    except Exception: pass
for (_sid, _dtxt), _w in _wowSong.items():
    if (_sid, _dtxt) in _byKey: continue
    _mx += 1
    _slots.append({"slot_id": "SLOT-%04d" % _mx, "staff_id": _sid,
        "staff_name": _w.get("staff_name") or _sid,
        "slot_date": _dtxt.split(" ")[0], "slot_time": (_dtxt.split(" ") + [""])[1],
        "slot_datetime": _dtxt, "branch": "",
        "wow_slot_status": eF("enum_wow_slot_status",
            "taught" if str(_w.get("wow_status") or "").startswith("completed") else "booked"),
        "wow_id": _w["wow_id"], "registered_at": _dtxt, "note": "mở thêm cho buổi đã đổi giờ"})
    _moThem += 1
log.append("18. Lich truc WOW khop so buoi: tra %d ca ve trong, mo them %d ca" % (_traVe, _moThem))

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print("  12. Da tao DL22 referral +", len(dl["DL22"]), "luot | DL19 thuong:", len(dl["DL19"]))
for _l in log[-6:]: print("  "+_l)
