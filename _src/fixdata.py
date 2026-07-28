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
# tính lại số buổi đã dùng ở DL09
rq = 0
for s in R("DL09"):
    used = len([w for w in R("DL14")
                if str(w.get("student_id")) == str(s.get("student_id"))
                and str(w.get("quota_deducted")).lower() == "yes"])
    if n(s.get("wow_quota_used")) != used:
        s["wow_quota_used"] = used
        rq += 1
    tot = n(s.get("wow_quota_total"))
    if tot and used > tot:            # dùng quá quota được cấp
        s["wow_quota_total"] = used
log.append("2. Quota WOW: sửa cờ trừ quota %d buổi | tính lại số buổi đã dùng cho %d học viên" % (un, rq))

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
        "student_id_name": e.get("student_id_name", "") or e.get("lead_id_name", ""),
        "payment_time": fmt(base + datetime.timedelta(days=random.randint(2, 9))),
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
log.append("7c. Nộp bài: đẩy %d bài về sau giờ được giao" % c7c)
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
leave = missing[-8:]                      # 8 buổi gần nhất để lại làm hàng chờ
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
            stt, absn, perf = "on_time (Đúng giờ)", "", random.choice(["good (Tốt)", "average (Trung bình)", "good (Tốt)"])
        elif r < 0.92:
            stt, absn, perf = "late (Đi trễ)", "", "average (Trung bình)"
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
log.append("10. Điểm danh: bù %d bản ghi cho %d buổi đã dạy mà bỏ trống | chừa %d buổi làm hàng chờ"
           % (made, len(missing) - len(leave), len(leave)))

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
        s["attendance_progress_status"] = "on_track (Đúng tiến độ)"
    if re.search(r"at_risk|off_track", code(s.get("academic_progress_status"))):
        old.append("học thuật")
        s["academic_progress_status"] = "on_track (Đúng tiến độ)"
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

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print("  12. Da tao DL22 referral +", len(dl["DL22"]), "luot | DL19 thuong:", len(dl["DL19"]))
