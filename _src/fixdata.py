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
for t in dl.get("DL03", []):
    L = IDX["DL02"].get(str(t.get("lead_id") or ""))
    if not L:
        continue
    a, b = dt(L.get("lead_created_time")), dt(t.get("test_date"))
    if a and b and b < a:
        t["test_date"] = fmt(a + datetime.timedelta(hours=2))
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
        _ttfix += 1
log.append("14undecies. Test: kéo %d buổi ĐÃ điểm danh dự thi về quá khứ (chống trôi theo đồng hồ)"
           % _ttfix)

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
