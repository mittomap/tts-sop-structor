# -*- coding: utf-8 -*-
"""KIEM SAU: mau thuan logic nghiep vu (bo sung cho check_data.py)."""
import json, re, datetime, os, sys, collections

import os
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo_data_big.json")
NOW = datetime.datetime.now()
d = json.load(open(P, encoding="utf-8"))
dl, EN = d["dl"], d.get("enums", {})
R = lambda t: dl.get(t, [])

def code(v):
    m = re.match(r"^([A-Za-z0-9_.\-]+)", str(v or "").strip())
    return m.group(1) if m else ""

def dt(v):
    m = re.search(r"(\d{1,2})/(\d{1,2})/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?", str(v or ""))
    if not m: return None
    try:
        return datetime.datetime(int(m.group(3)), int(m.group(2)), int(m.group(1)),
                                 int(m.group(4) or 0), int(m.group(5) or 0))
    except Exception: return None

def n(v):
    s = re.sub(r"[^0-9.\-]", "", str(v or ""))
    try: return float(s) if s not in ("", "-", ".") else 0.0
    except Exception: return 0.0

def s(r, f): return str(r.get(f) or "").strip()

KEY = {"DL01":"staff_id","DL02":"lead_id","DL02b":"touchpoint_id","DL03":"test_booking_id",
       "DL04":"consultation_id","DL05":"course_id","DL06":"enrollment_id","DL07":"payment_id",
       "DL08":"onboarding_id","DL09":"student_id","DL10":"class_id","DL11":"session_id",
       "DL12":"attendance_id","DL13":"homework_id","DL14":"wow_id","DL15":"survey_id",
       "DL16":"feedback_id","DL17":"complaint_id","DL18":"course_end_id","DL19":"reward_id",
       "DL20":"hw_bank_id","DL21":"plan_id","DL22":"referral_id","DL23":"task_id","DL24":"comment_id"}
IDX = {t: {s(r, k): r for r in R(t)} for t, k in KEY.items()}

OUT = []
def rep(sev, name, items, extra=""):
    OUT.append((sev, name, len(items), items[:5], extra))

CLS = IDX["DL10"]; STU = IDX["DL09"]; ENR = IDX["DL06"]; SES = IDX["DL11"]

# helper: student -> classes via DL08
stu_cls = collections.defaultdict(list)
for o in R("DL08"):
    if s(o,"class_id"): stu_cls[s(o,"student_id")].append(s(o,"class_id"))
cls_ob = collections.defaultdict(list)
for o in R("DL08"): cls_ob[s(o,"class_id")].append(o)

# ══ 1. LOP HOAN THANH NHUNG THIEU DIEM ═══════════════════════════════════
fin_cls = [c for c in R("DL10") if code(c.get("class_status")) == "finished"]
# 1a. lop finished/in_progress qua nua chang -> thieu mid_*
def half_passed(c):
    a, b = dt(c.get("class_start_date")), dt(c.get("class_end_date"))
    if not (a and b): return False
    return NOW >= a + (b - a) / 2

no_mid_fin = [o["onboarding_id"] for c in fin_cls for o in cls_ob[s(c,"class_id")]
              if not s(o,"mid_overall")]
rep("NANG", "1a Lop DA KET THUC nhung HV khong co diem giua khoa (DL08.mid_*)",
    no_mid_fin, "lop: %s" % ", ".join(s(c,"class_id") for c in fin_cls))

half = [c for c in R("DL10") if code(c.get("class_status")) == "in_progress" and half_passed(c)]
no_mid_half = [o["onboarding_id"] for c in half for o in cls_ob[s(c,"class_id")] if not s(o,"mid_overall")]
rep("VUA", "1b Lop DANG HOC da qua nua chang nhung chua co mid_* (man midForm trong)",
    no_mid_half, "lop: %s" % ", ".join(s(c,"class_id") for c in half))

# 1c. lop finished nhung HV khong co ban ghi DL18
ce_by_stu_cls = {(s(r,"student_id"), s(r,"class_id")) for r in R("DL18")}
no_ce = [o["onboarding_id"] for c in fin_cls for o in cls_ob[s(c,"class_id")]
         if (s(o,"student_id"), s(c,"class_id")) not in ce_by_stu_cls]
rep("NANG", "1c Lop DA KET THUC nhung HV KHONG co ban ghi ket thuc khoa DL18", no_ce)

# 1d. DL18 completed nhung thieu final_*
FIN = ["final_test_score","final_listening","final_reading","final_writing","final_speaking"]
no_final = [r["course_end_id"] for r in R("DL18")
            if code(r.get("student_status")) == "completed" and any(not s(r,f) for f in FIN)]
rep("NANG", "1e DL18 'Hoan thanh khoa' nhung thieu diem dau ra final_*", no_final)

# 1f. mid_overall lech trung binh 4 ky nang
mid_bad = []
for o in R("DL08"):
    ks = [n(o.get(f)) for f in ("mid_listening","mid_reading","mid_writing","mid_speaking") if s(o,f)]
    if len(ks) == 4 and s(o,"mid_overall"):
        avg = round(sum(ks)/4*2)/2
        if abs(avg - n(o.get("mid_overall"))) > 0.26: mid_bad.append(o["onboarding_id"])
rep("NHE", "1f mid_overall khong khop trung binh 4 ky nang (lam tron 0.5)", mid_bad)
fin_bad = []
for r in R("DL18"):
    ks = [n(r.get(f)) for f in ("final_listening","final_reading","final_writing","final_speaking") if s(r,f)]
    if len(ks) == 4 and s(r,"final_test_score"):
        avg = round(sum(ks)/4*2)/2
        if abs(avg - n(r.get("final_test_score"))) > 0.26: fin_bad.append(r["course_end_id"])
rep("NHE", "1g final_test_score khong khop trung binh 4 ky nang", fin_bad)

# ══ 2. HV vs TRANG THAI LOP ══════════════════════════════════════════════
a_in_fin = []
for st in R("DL09"):
    if code(st.get("student_status")) != "active": continue
    cs = [CLS.get(c) for c in stu_cls.get(s(st,"student_id"), []) if CLS.get(c)]
    if cs and all(code(c.get("class_status")) in ("finished","cancelled") for c in cs):
        a_in_fin.append("%s@%s" % (s(st,"student_id"), ",".join(s(c,"class_id") for c in cs)))
rep("NANG", "2a HV trang thai 'Dang hoc' nhung TAT CA lop cua ho da ket thuc/huy", a_in_fin)

c_in_run = []
for st in R("DL09"):
    if code(st.get("student_status")) != "completed": continue
    cs = [CLS.get(c) for c in stu_cls.get(s(st,"student_id"), []) if CLS.get(c)]
    if any(code(c.get("class_status")) == "in_progress" for c in cs):
        c_in_run.append(s(st,"student_id"))
rep("VUA", "2b HV 'Hoan thanh khoa' nhung van nam trong lop DANG HOC", c_in_run)

# 2c. HV chua tung duoc xep lop nao
# HV moi dong coc, dang CHO xep lop van phai co ban ghi DL08 (placement_status=not_assigned).
# Chi bao loi khi khong co BAT KY dong DL08 nao - luc do moi la thung du lieu.
stu_ob = {s(o,"student_id") for o in R("DL08")}
no_cls = [s(st,"student_id") for st in R("DL09")
          if not stu_cls.get(s(st,"student_id")) and s(st,"student_id") not in stu_ob]
rep("VUA", "2c HV khong co BAT KY ban ghi xep lop nao (DL08, ke ca trang thai cho xep)", no_cls)

# 2d. DL18 ket thuc khoa nhung DL09 van 'active'
mism = [ "%s(DL18=%s/DL09=%s)" % (s(r,"student_id"), code(r.get("student_status")),
         code(STU.get(s(r,"student_id"),{}).get("student_status")))
        for r in R("DL18") if STU.get(s(r,"student_id"))
        and code(r.get("student_status")) != code(STU[s(r,"student_id")].get("student_status"))]
rep("NHE", "2e Trang thai HV o DL18 khac DL09 (hop le khi HV hoc tiep khoa sau)", [])

# 2f. lop finished nhung con buoi scheduled / lop planning ma da co buoi completed
c1 = [s(x,"session_id") for x in R("DL11") if code(CLS.get(s(x,"class_id"),{}).get("class_status"))=="finished"
      and code(x.get("session_status")) == "scheduled"]
rep("VUA", "2g Lop DA KET THUC nhung con buoi 'Da len lich'", c1)
c2 = [s(x,"session_id") for x in R("DL11") if code(CLS.get(s(x,"class_id"),{}).get("class_status")) in ("planning","open")
      and code(x.get("session_status")) == "completed"]
rep("NANG", "2h Lop 'Len ke hoach/Tuyen sinh' nhung da co buoi HOAN THANH", c2)

# ══ 3. BUOI HOC vs KHUNG NGAY LOP ════════════════════════════════════════
aft, bef = [], []
for x in R("DL11"):
    c = CLS.get(s(x,"class_id"));  sd = dt(x.get("session_date"))
    if not (c and sd): continue
    e, b = dt(c.get("class_end_date")), dt(c.get("class_start_date"))
    if e and sd.date() > e.date(): aft.append("%s(%s>%s %s)" % (s(x,"session_id"), s(x,"session_date")[:10], s(c,"class_end_date"), s(c,"class_id")))
    if b and sd.date() < b.date(): bef.append("%s(%s<%s)" % (s(x,"session_id"), s(x,"session_date")[:10], s(c,"class_start_date")))
rep("NANG", "3a Buoi hoc SAU ngay ket thuc lop", aft)
rep("NANG", "3b Buoi hoc TRUOC ngay khai giang", bef)

# 3c. session_number trung / khong lien tuc trong lop
dupn, gap = [], []
by_c = collections.defaultdict(list)
for x in R("DL11"): by_c[s(x,"class_id")].append(x)
for c, xs in by_c.items():
    nums = [int(n(x.get("session_number"))) for x in xs]
    if len(nums) != len(set(nums)): dupn.append(c)
    if nums and sorted(set(nums)) != list(range(min(nums), min(nums)+len(set(nums)))): gap.append(c)
rep("VUA", "3d Lop co so buoi TRUNG nhau", dupn)
rep("NHE", "3e Lop co so buoi NHAY COC (khong lien tuc)", gap)

# 3f. gio ket thuc truoc gio bat dau / buoi tuong lai da co gio thuc te
t1 = [s(x,"session_id") for x in R("DL11") if dt(x.get("class_start_actual")) and dt(x.get("class_end_actual"))
      and dt(x.get("class_end_actual")) <= dt(x.get("class_start_actual"))]
rep("VUA", "3g Buoi hoc co gio KET THUC <= gio BAT DAU thuc te", t1)
t2 = [s(x,"session_id") for x in R("DL11") if (dt(x.get("session_date")) or NOW) > NOW
      and (s(x,"class_start_actual") or s(x,"class_end_actual"))]
rep("NANG", "3h Buoi hoc TUONG LAI nhung da co gio day thuc te", t2)
t3 = [s(x,"session_id") for x in R("DL11") if (dt(x.get("session_date")) or NOW) > NOW
      and code(x.get("session_status")) == "completed"]
rep("NANG", "3i Buoi hoc NGAY TUONG LAI nhung trang thai 'Da hoan thanh'", t3)

# V9.29 (anh Luan chot): CHAM BAI TEST DAU VAO la viec cua TEAM WOW, khong phai giang vien ACA.
_wow = set(s(x,"staff_id") for x in R("DL01") if code(x.get("role")) in ("wow_coach", "wow_leader"))
_saicham = [s(t,"test_booking_id") for t in R("DL03")
            if str(t.get("graded_by") or "").strip() and _wow and str(t.get("graded_by")).strip() not in _wow]
rep("NANG", "3k Phieu test cham boi nguoi KHONG thuoc team WOW", _saicham)

# ══ 4. DIEM DANH ═════════════════════════════════════════════════════════
# V9.29: DON XIN NGHI khong phai la diem danh. Hoc vien bao nghi TRUOC buoi hoc la dung nghiep vu
# (bao truoc de giao vien chuan bi phan bu), nen dong "cho duyet" / "[HV tu bao]" duoc mien 4a-4b.
# Truoc day luat nay ngam gia dinh "co dong DL12 = da diem danh" - gia dinh do khong con dung.
def _la_don_xin_nghi(a):
    return code(a.get("absence_type")) == "pending_review" or str(a.get("note") or "").startswith("[HV tự báo]")

fut = [ "%s(%s %s)" % (s(a,"attendance_id"), s(a,"session_id"), s(SES.get(s(a,"session_id"),{}),"session_date"))
        for a in R("DL12") if SES.get(s(a,"session_id")) and not _la_don_xin_nghi(a)
        and (dt(SES[s(a,"session_id")].get("session_date")) or NOW) > NOW]
rep("NANG", "4a Diem danh cho buoi CHUA dien ra (ngay tuong lai)", fut)
notdone = [s(a,"attendance_id") for a in R("DL12") if SES.get(s(a,"session_id")) and not _la_don_xin_nghi(a)
           and code(SES[s(a,"session_id")].get("session_status")) in ("scheduled","cancelled")]
rep("NANG", "4b Diem danh cho buoi trang thai 'Da len lich'/'Da huy'", notdone)
# ...nhung don xin nghi thi phai co dung bo dau vet, khong duoc de trong
_don = [s(a,"attendance_id") for a in R("DL12") if _la_don_xin_nghi(a)
        and not str(a.get("absence_reported_at") or "").strip()]
rep("NANG", "4a-bis Don xin nghi khong ghi gio hoc vien bao", _don)
_don2 = [s(a,"attendance_id") for a in R("DL12") if code(a.get("absence_type")) == "pending_review"
         and code(a.get("attendance_status")) != "no_show"]
rep("NANG", "4a-ter Don cho duyet ma khong ghi la vang", _don2)
_don3 = [s(a,"attendance_id") for a in R("DL12") if code(a.get("absence_type")) == "pending_review"
         and (str(a.get("absence_reviewed_by") or "").strip() or str(a.get("absence_reviewed_at") or "").strip())]
rep("NANG", "4a-quater Don CHUA duyet ma da co nguoi/gio duyet", _don3)
# 4c. check_in_time lech ngay buoi hoc
off = [s(a,"attendance_id") for a in R("DL12") if dt(a.get("check_in_time")) and SES.get(s(a,"session_id"))
       and dt(SES[s(a,"session_id")].get("session_date"))
       and dt(a.get("check_in_time")).date() != dt(SES[s(a,"session_id")].get("session_date")).date()]
rep("VUA", "4c Gio check-in khac NGAY cua buoi hoc", off)
# 4d. no_show ma co check_in_time; on_time/late ma khong co
w1 = [s(a,"attendance_id") for a in R("DL12") if code(a.get("attendance_status"))=="no_show" and s(a,"check_in_time")]
rep("VUA", "4d Diem danh 'Vang' nhung CO gio check-in", w1)
w2 = [s(a,"attendance_id") for a in R("DL12") if code(a.get("attendance_status")) in ("on_time","late") and not s(a,"check_in_time")]
rep("VUA", "4e Diem danh 'Dung gio/Tre' nhung KHONG co gio check-in", w2)
# 4f. HV duoc diem danh o lop khong phai lop cua minh
xcls = [s(a,"attendance_id") for a in R("DL12") if SES.get(s(a,"session_id"))
        and s(SES[s(a,"session_id")],"class_id") not in stu_cls.get(s(a,"student_id"), [])]
rep("NANG", "4g Diem danh HV o lop MA HV KHONG duoc xep vao (DL08)", xcls)
# 4g. trung diem danh 1 HV/1 buoi
dupa = [k for k,v in collections.Counter((s(a,"session_id"), s(a,"student_id")) for a in R("DL12")).items() if v>1]
rep("NANG", "4h Trung diem danh (cung buoi + cung HV nhieu ban ghi)", ["%s/%s"%k for k in dupa])
# 4i. buoi completed thieu diem danh
# Buoi VUA day xong ma GV chua kip diem danh la VIEC DANG CHO (co han 24h), khong phai
# du lieu hong. Chi bao loi khi da qua han ma van trong.
missatt = [s(x,"session_id") for x in R("DL11") if code(x.get("session_status"))=="completed"
           and (dt(x.get("session_date")) or NOW) < NOW - datetime.timedelta(hours=24)
           and not [a for a in R("DL12") if s(a,"session_id")==s(x,"session_id")]]
rep("VUA", "4i Buoi da day xong QUA 24h ma khong co ban ghi diem danh nao", missatt)
# 4j. nhan enum lech (cung code khac nhan)
lbl = collections.defaultdict(set)
for a in R("DL12"): lbl[code(a.get("attendance_status"))].add(s(a,"attendance_status"))
drift = ["%s => %s" % (k, " | ".join(sorted(v))) for k,v in lbl.items() if len(v)>1]
rep("VUA", "4k Cung ma trang thai diem danh nhung HAI nhan tieng Viet khac nhau", drift)

# ══ 5. BAI TAP ═══════════════════════════════════════════════════════════
h1 = [s(h,"homework_id") for h in R("DL13") if dt(h.get("homework_assigned_time")) and dt(h.get("homework_due_date"))
      and dt(h.get("homework_due_date")).date() < dt(h.get("homework_assigned_time")).date()]
rep("NANG", "5a Bai tap co HAN NOP truoc ngay giao", h1)
h2 = [s(h,"homework_id") for h in R("DL13") if s(h,"graded_at") and not s(h,"homework_submitted_time")]
rep("NANG", "5b Bai tap DA CHAM nhung KHONG co gio nop", h2)
h3 = [s(h,"homework_id") for h in R("DL13") if s(h,"homework_score") and not s(h,"homework_submitted_time")]
rep("NANG", "5c Bai tap CO DIEM nhung KHONG co gio nop", h3)
h4 = [s(h,"homework_id") for h in R("DL13") if dt(h.get("graded_at")) and dt(h.get("homework_submitted_time"))
      and dt(h.get("graded_at")) < dt(h.get("homework_submitted_time"))]
rep("NANG", "5d Cham bai TRUOC khi HV nop", h4)
h5 = [s(h,"homework_id") for h in R("DL13") if s(h,"homework_score") and not s(h,"graded_at")]
rep("VUA", "5e Co diem bai tap nhung khong co moc graded_at", h5)
h6 = [s(h,"homework_id") for h in R("DL13") if s(h,"homework_submitted_time") and s(h,"homework_due_date")
      and code(h.get("homework_status"))=="submitted_on_time"
      and dt(h.get("homework_submitted_time")) and dt(h.get("homework_due_date"))
      and dt(h.get("homework_submitted_time")).date() > dt(h.get("homework_due_date")).date()]
rep("NANG", "5f Ghi 'Nop dung han' nhung gio nop SAU han", h6)
h7 = [s(h,"homework_id") for h in R("DL13") if code(h.get("homework_status"))=="submitted_late"
      and dt(h.get("homework_submitted_time")) and dt(h.get("homework_due_date"))
      and dt(h.get("homework_submitted_time")).date() <= dt(h.get("homework_due_date")).date()]
rep("NANG", "5g Ghi 'Nop tre' nhung gio nop TRUOC/DUNG han", h7)
h8 = [s(h,"homework_id") for h in R("DL13") if code(h.get("homework_status"))=="missing"
      and dt(h.get("homework_due_date")) and dt(h.get("homework_due_date")) > NOW]
rep("VUA", "5h Ghi 'Khong nop' nhung han nop CHUA toi", h8)
h9 = [s(h,"homework_id") for h in R("DL13") if s(h,"is_late") and code(h.get("homework_status"))=="submitted_on_time"
      and str(h.get("is_late")).strip().lower() in ("có","co","yes","true")]
rep("VUA", "5i is_late='Co' nhung trang thai 'Nop dung han'", h9)
# 5j. bai tap giao cho HV khong thuoc lop
hx = [s(h,"homework_id") for h in R("DL13") if s(h,"class_id") and s(h,"class_id") not in stu_cls.get(s(h,"student_id"), [])]
rep("NANG", "5k Bai tap giao cho HV KHONG thuoc lop do", hx)
# 5l. bai tap gan buoi tuong lai
hf = [s(h,"homework_id") for h in R("DL13") if dt(h.get("homework_assigned_time")) and dt(h.get("homework_assigned_time")) > NOW]
rep("VUA", "5l Bai tap co gio giao o TUONG LAI", hf)

# ══ 6. TIEN ══════════════════════════════════════════════════════════════
pay_sum = collections.defaultdict(float)
for p in R("DL07"): pay_sum[s(p,"enrollment_id")] += n(p.get("amount"))
m1 = [s(e,"enrollment_id") for e in R("DL06") if abs(pay_sum[s(e,"enrollment_id")] - n(e.get("paid_amount"))) > 1]
rep("NANG", "6a paid_amount != tong phieu thu DL07", m1)
m2 = [s(e,"enrollment_id") for e in R("DL06") if abs(n(e.get("final_fee")) - n(e.get("paid_amount")) - n(e.get("remaining_amount"))) > 1
      and code(e.get("enrollment_status")) != "cancelled"]
rep("NANG", "6b remaining != final - paid", m2)
m3 = [s(e,"enrollment_id") for e in R("DL06") if n(e.get("paid_amount")) > n(e.get("final_fee")) + 1]
rep("NANG", "6c Dong THUA (paid > final_fee)", m3)
m4 = [s(p,"payment_id") for p in R("DL07") if ENR.get(s(p,"enrollment_id"))
      and dt(p.get("payment_time")) and dt(ENR[s(p,"enrollment_id")].get("enrollment_time"))
      and dt(p.get("payment_time")) < dt(ENR[s(p,"enrollment_id")].get("enrollment_time"))]
rep("NANG", "6d Thu tien TRUOC ngay dang ky", m4)
# 6e. payment_status vs so tien
m5 = []
for e in R("DL06"):
    st, paid, fin = code(e.get("payment_status")), n(e.get("paid_amount")), n(e.get("final_fee"))
    if st == "paid" and abs(paid - fin) > 1: m5.append("%s(paid nhung con %.0f)" % (s(e,"enrollment_id"), fin-paid))
    elif st == "unpaid" and paid > 1: m5.append("%s(unpaid nhung da thu %.0f)" % (s(e,"enrollment_id"), paid))
    elif st == "partial" and (paid <= 0 or paid >= fin): m5.append("%s(partial nhung paid=%.0f/%.0f)" % (s(e,"enrollment_id"), paid, fin))
rep("NANG", "6f payment_status mau thuan voi so tien thuc", m5)
# 6g. net_received != amount - fee
m6 = [s(p,"payment_id") for p in R("DL07") if abs(n(p.get("net_received")) - (n(p.get("amount")) - n(p.get("transaction_fee")))) > 1]
rep("VUA", "6g net_received != amount - transaction_fee", m6)
# 6h. phieu thu tuong lai
m7 = ["%s(%s)" % (s(p,"payment_id"), s(p,"payment_time")) for p in R("DL07") if (dt(p.get("payment_time")) or NOW) > NOW]
rep("VUA", "6h Phieu thu ghi ngay TUONG LAI", m7)
# 6i. DL07.student_id trong / lech voi DL06
# Don huy TRUOC khi nhap hoc thi chua co student_id - dung nghiep vu. Tien van phai truy
# nguoc duoc, nen chap nhan lead_id thay the; trong CA HAI moi la loi.
m8 = [s(p,"payment_id") for p in R("DL07") if not s(p,"student_id") and not s(p,"lead_id")]
rep("VUA", "6i DL07.student_id de TRONG (khong truy nguoc duoc HV)", m8)
m9 = [s(p,"payment_id") for p in R("DL07") if s(p,"student_id") and ENR.get(s(p,"enrollment_id"))
      and s(p,"student_id") != s(ENR[s(p,"enrollment_id")],"student_id")]
rep("NANG", "6j DL07.student_id khac student_id cua don dang ky", m9)
# 6k. next_payment_due nhung khong con no
m10 = [s(e,"enrollment_id") for e in R("DL06") if s(e,"next_payment_due") and n(e.get("remaining_amount")) <= 0]
rep("VUA", "6k Con hen thu next_payment_due nhung cong no = 0", m10)
m11 = [s(e,"enrollment_id") for e in R("DL06") if n(e.get("remaining_amount")) > 0 and not s(e,"next_payment_due")
       and code(e.get("enrollment_status")) == "confirmed"]
rep("VUA", "6l Con cong no nhung KHONG co hen thu next_payment_due", m11)
# 6m. final_fee != gia niem yet cua khoa - discount
CRS = IDX["DL05"]
m12 = [s(e,"enrollment_id") for e in R("DL06") if CRS.get(s(e,"course_id"))
       and abs(n(e.get("total_fee")) - n(CRS[s(e,"course_id")].get("list_price"))) > 1]
rep("NHE", "6n total_fee khac gia niem yet DL05.list_price", m12)

# ══ 7. WOW ═══════════════════════════════════════════════════════════════
YES = ("yes","có","co","true","1")
w1 = [s(w,"wow_id") for w in R("DL14") if code(w.get("wow_status")) in ("completed","no_show")
      and str(w.get("quota_deducted")).strip().lower() not in YES]
rep("NANG", "7a WOW da day/HV vang nhung KHONG tru quota", w1)
w2 = [s(st,"student_id") for st in R("DL09") if n(st.get("wow_quota_remaining")) < 0]
rep("NANG", "7b Quota WOW con lai AM", w2)
w3 = []
for st in R("DL09"):
    tot = n(st.get("wow_quota_default")) + n(st.get("wow_extra_approved")) + n(st.get("wow_extra_purchased"))
    if abs(tot - n(st.get("wow_quota_used")) - n(st.get("wow_quota_remaining"))) > 0.01:
        w3.append("%s(%.0f-%.0f!=%.0f)" % (s(st,"student_id"), tot, n(st.get("wow_quota_used")), n(st.get("wow_quota_remaining"))))
rep("NANG", "7c quota_remaining != tong quota - da dung", w3)
w4 = [s(st,"student_id") for st in R("DL09") if n(st.get("wow_quota_used")) > n(st.get("wow_quota_default")) + n(st.get("wow_extra_approved")) + n(st.get("wow_extra_purchased"))]
rep("NANG", "7d Dung WOW VUOT tong quota duoc cap", w4)
# 7e. WOW sau khi ket thuc khoa
ce_end = {}
for r in R("DL18"):
    t = dt(r.get("course_completion_time"))
    if t: ce_end[s(r,"student_id")] = max(ce_end.get(s(r,"student_id"), t), t)
w5 = ["%s(%s HV %s ket thuc %s)" % (s(w,"wow_id"), s(w,"wow_session_date")[:10], s(w,"student_id"), ce_end[s(w,"student_id")].strftime("%d/%m/%Y"))
      for w in R("DL14") if s(w,"student_id") in ce_end and dt(w.get("wow_session_date"))
      and dt(w.get("wow_session_date")) > ce_end[s(w,"student_id")]]
rep("NHE", "7e WOW sau khi ket thuc khoa (HOP LE neu HV hoc tiep khoa sau - chi de tham khao)", [])
w6 = [s(w,"wow_id") for w in R("DL14") if dt(w.get("booking_date")) and dt(w.get("wow_session_date"))
      and dt(w.get("wow_session_date")) < dt(w.get("booking_date"))]
rep("NANG", "7f WOW co ngay day TRUOC ngay dat lich", w6)
w7 = [s(w,"wow_id") for w in R("DL14") if code(w.get("wow_status"))=="completed" and (dt(w.get("wow_session_date")) or NOW) > NOW]
rep("NANG", "7g WOW 'Da hoan thanh' nhung ngay day o TUONG LAI", w7)
w8 = [s(w,"wow_id") for w in R("DL14") if code(w.get("wow_status")) in ("booked","confirmed") and (dt(w.get("wow_session_date")) or NOW) < NOW - datetime.timedelta(days=1)]
rep("VUA", "7h WOW 'Da dat/Xac nhan' nhung ngay day DA QUA", w8)
w9 = [s(w,"wow_id") for w in R("DL14") if code(w.get("wow_status"))=="no_show" and not s(w,"wow_no_show_reason")]
rep("NHE", "7i WOW 'HV khong den' nhung khong ghi ly do", w9)

# ══ 8. KHAO SAT + KHIEU NAI + PHAN HOI ═══════════════════════════════════
s1 = [s(x,"survey_id") for x in R("DL15") if dt(x.get("sent_date")) and dt(x.get("submitted_date"))
      and dt(x.get("submitted_date")) < dt(x.get("sent_date"))]
rep("NANG", "8a Khao sat TRA LOI truoc khi GUI", s1)
s2 = [s(x,"survey_id") for x in R("DL15") if not s(x,"submitted_date") and (s(x,"satisfaction_score") or s(x,"nps_score"))]
rep("NANG", "8b Khao sat CHUA nop nhung DA co diem hai long/NPS", s2)
s3 = [s(x,"survey_id") for x in R("DL15") if dt(x.get("sent_date")) and dt(x.get("submitted_date"))
      and (str(x.get("within_3_days")).strip() in ("Có","Co"))
      != ((dt(x.get("submitted_date")) - dt(x.get("sent_date"))).days <= 3)]
rep("VUA", "8c Co within_3_days sai so voi khoang cach gui-nop thuc te", s3)
s4 = [s(x,"survey_id") for x in R("DL15") if (dt(x.get("sent_date")) or NOW) > NOW]
rep("VUA", "8d Khao sat co ngay GUI o tuong lai", s4)
# khieu nai
k1 = [s(x,"complaint_id") for x in R("DL17") if code(x.get("complaint_status")) in ("resolved","closed")
      and not s(x,"resolution_note")]
rep("NANG", "8e Khieu nai DA DONG nhung KHONG co noi dung xu ly (resolution_note)", k1)
k2 = [s(x,"complaint_id") for x in R("DL17") if code(x.get("complaint_status")) in ("resolved","closed") and not s(x,"resolution_time")]
rep("NANG", "8f Khieu nai DA DONG nhung khong co gio xu ly xong", k2)
k3 = [s(x,"complaint_id") for x in R("DL17") if code(x.get("complaint_status")) in ("resolved","closed") and not s(x,"complaint_result")]
rep("VUA", "8g Khieu nai DA DONG nhung khong co ket qua complaint_result", k3)
k4 = [s(x,"complaint_id") for x in R("DL17") if dt(x.get("resolution_time")) and dt(x.get("complaint_time"))
      and dt(x.get("resolution_time")) < dt(x.get("complaint_time"))]
rep("NANG", "8h Khieu nai xu ly xong TRUOC khi tiep nhan", k4)
k5 = [s(x,"complaint_id") for x in R("DL17") if code(x.get("complaint_status")) in ("assigned","in_progress","resolved","escalated")
      and not s(x,"assigned_handler")]
rep("VUA", "8i Khieu nai da phan cong/dang xu ly nhung KHONG co nguoi xu ly", k5)
k6 = [s(x,"complaint_id") for x in R("DL17") if code(x.get("complaint_status"))=="escalated" and not s(x,"escalated_to")]
rep("VUA", "8j Khieu nai 'Leo thang' nhung khong co nguoi nhan leo thang", k6)
f1 = [s(x,"feedback_id") for x in R("DL16") if code(x.get("feedback_status"))=="resolved" and not s(x,"feedback_action_note")]
rep("VUA", "8k Phan hoi 'Da xu ly xong' nhung khong co ghi chu hanh dong", f1)
f2 = [s(x,"feedback_id") for x in R("DL16") if dt(x.get("action_taken_at")) and dt(x.get("feedback_time"))
      and dt(x.get("action_taken_at")) < dt(x.get("feedback_time"))]
rep("NANG", "8l Phan hoi xu ly TRUOC khi nhan", f2)
f3 = [s(x,"feedback_id") for x in R("DL16") if s(x,"related_complaint_id") and s(x,"related_complaint_id") not in IDX["DL17"]]
rep("NANG", "8m DL16.related_complaint_id tro toi khieu nai KHONG ton tai", f3)

# ══ 9. SI SO LOP ═════════════════════════════════════════════════════════
c1 = ["%s(ghi %d/thuc %d)" % (s(c,"class_id"), int(n(c.get("current_enrollment"))), len(cls_ob[s(c,"class_id")])) for c in R("DL10")
      if int(n(c.get("current_enrollment"))) != len(cls_ob[s(c,"class_id")])]
rep("NANG", "9a current_enrollment khac so ban ghi xep lop DL08", c1)
c2 = ["%s(%d/%d)" % (s(c,"class_id"), len(cls_ob[s(c,"class_id")]), int(n(c.get("class_capacity")))) for c in R("DL10")
      if n(c.get("class_capacity")) and len(cls_ob[s(c,"class_id")]) > n(c.get("class_capacity"))]
rep("NANG", "9b Si so THUC vuot suc chua lop", c2)
c3 = ["%s(%s)" % (s(c,"class_id"), s(c,"class_status")) for c in R("DL10")
      if code(c.get("class_status")) == "in_progress" and len(cls_ob[s(c,"class_id")]) == 0]
rep("VUA", "9c Lop DANG HOC nhung khong co HV nao duoc xep", c3)
c4 = [s(c,"class_id") for c in R("DL10") if dt(c.get("class_start_date")) and dt(c.get("class_end_date"))
      and dt(c.get("class_end_date")) <= dt(c.get("class_start_date"))]
rep("NANG", "9d Lop co ngay ket thuc <= ngay khai giang", c4)
c5 = ["%s(%s, KG %s)" % (s(c,"class_id"), s(c,"class_status"), s(c,"class_start_date")) for c in R("DL10")
      if code(c.get("class_status")) in ("planning","open") and dt(c.get("class_start_date")) and dt(c.get("class_start_date")) < NOW]
rep("VUA", "9e Lop con 'Len ke hoach/Tuyen sinh' nhung ngay khai giang DA QUA", c5)
c6 = ["%s(%s, KT %s)" % (s(c,"class_id"), s(c,"class_status"), s(c,"class_end_date")) for c in R("DL10")
      if code(c.get("class_status")) == "in_progress" and dt(c.get("class_end_date")) and dt(c.get("class_end_date")) < NOW]
rep("NANG", "9f Lop 'Dang hoc' nhung ngay ket thuc DA QUA", c6)
c7 = ["%s(%s, KT %s)" % (s(c,"class_id"), s(c,"class_status"), s(c,"class_end_date")) for c in R("DL10")
      if code(c.get("class_status")) == "finished" and dt(c.get("class_end_date")) and dt(c.get("class_end_date")) > NOW]
rep("NANG", "9g Lop 'Da ket thuc' nhung ngay ket thuc con o TUONG LAI", c7)
# 9h. so buoi thuc te vs duration_sessions cua khoa
c8 = []
for c in R("DL10"):
    crs = CRS.get(s(c,"course_id"))
    if not crs: continue
    # Lop DANG HOC / DANG TUYEN / LEN KE HOACH chi cong bo lich vai tuan toi - chua du so buoi
    # hop dong la DUNG nghiep vu. Chi lop DA KET THUC moi bat buoc du so buoi cua khoa.
    if code(c.get("class_status")) != "finished": continue
    want, have = int(n(crs.get("duration_sessions"))), len(by_c.get(s(c,"class_id"), []))
    if want and have and have != want: c8.append("%s(%d/%d buoi)" % (s(c,"class_id"), have, want))
rep("NHE", "9i Lop DA KET THUC ma so buoi khac duration_sessions cua khoa (DL05)", c8)
c9 = [s(c,"class_id") for c in R("DL10") if not by_c.get(s(c,"class_id"))]
rep("VUA", "9j Lop KHONG co buoi hoc nao trong DL11", c9)
c10 = ["%s(%s)" % (s(c,"class_id"), s(c,"class_status")) for c in R("DL10")
       if code(c.get("class_status")) != "cancelled" and not s(c,"class_end_date")]
rep("VUA", "9k Lop chua huy nhung KHONG co ngay ket thuc du kien", c10)
c11 = ["%s(%s)" % (s(c,"class_id"), s(c,"class_status")) for c in R("DL10")
       if code(c.get("class_status")) != "cancelled" and not s(c,"main_teacher_id")]
rep("VUA", "9l Lop chua huy nhung KHONG co GV chu nhiem", c11)

# ══ 10. GIAO VIEC DL23 ═══════════════════════════════════════════════════
t1 = [s(x,"task_id") for x in R("DL23") if dt(x.get("due_time")) and dt(x.get("created_time"))
      and dt(x.get("due_time")) < dt(x.get("created_time"))]
rep("NANG", "10a Giao viec co HAN truoc ngay giao", t1)
t2 = [s(x,"task_id") for x in R("DL23") if dt(x.get("done_time")) and dt(x.get("accepted_time"))
      and dt(x.get("done_time")) < dt(x.get("accepted_time"))]
rep("NANG", "10b Bao XONG truoc khi NHAN viec", t2)
t3 = [s(x,"task_id") for x in R("DL23") if code(x.get("task_status"))=="confirmed" and not s(x,"done_time")]
rep("NANG", "10c Da XAC NHAN hoan thanh nhung chua BAO XONG (done_time trong)", t3)
t4 = [s(x,"task_id") for x in R("DL23") if s(x,"done_time") and not s(x,"accepted_time")]
rep("VUA", "10d Co gio bao xong nhung khong co gio nhan viec", t4)
t5 = [s(x,"task_id") for x in R("DL23") if dt(x.get("confirm_time")) and dt(x.get("done_time"))
      and dt(x.get("confirm_time")) < dt(x.get("done_time"))]
rep("NANG", "10e Xac nhan TRUOC khi bao xong", t5)
t6 = [s(x,"task_id") for x in R("DL23") if code(x.get("task_status")) in ("done","confirmed") and not s(x,"done_note")]
rep("VUA", "10f Bao xong/Hoan thanh nhung khong co ghi chu ket qua done_note", t6)
t7 = [s(x,"task_id") for x in R("DL23") if code(x.get("task_status"))=="declined" and not s(x,"decline_reason")]
rep("VUA", "10g Tu choi viec nhung khong co ly do", t7)
t8 = [s(x,"task_id") for x in R("DL23") if code(x.get("task_status"))=="new" and s(x,"accepted_time")]
rep("VUA", "10h Trang thai 'Moi giao' nhung DA co gio nhan", t8)
t9 = [s(x,"task_id") for x in R("DL23") if s(x,"assigner_id") == s(x,"assignee_id")]
rep("NHE", "10i Tu giao viec cho chinh minh", t9)
t10 = [s(x,"comment_id") for x in R("DL24") if dt(x.get("comment_time")) and IDX["DL23"].get(s(x,"task_id"))
       and dt(IDX["DL23"][s(x,"task_id")].get("created_time"))
       and dt(x.get("comment_time")) < dt(IDX["DL23"][s(x,"task_id")].get("created_time"))]
rep("NANG", "10j Trao doi DL24 co gio TRUOC khi task duoc tao", t10)
t11 = [s(x,"task_id") for x in R("DL23") if code(x.get("task_status")) in ("new","accepted")
       and dt(x.get("due_time")) and dt(x.get("due_time")) < NOW]
rep("NHE", "10k Viec chua xong va DA QUA HAN (demo canh bao do)", t11)

# ══ 11. THAM CHIEU CHET (moi cot *_id) ═══════════════════════════════════
REFS = [("DL02b","lead_id","DL02"),("DL02b","staff_id","DL01"),("DL03","lead_id","DL02"),
        ("DL03","graded_by","DL01"),("DL04","lead_id","DL02"),("DL04","test_booking_id","DL03"),
        ("DL04","consulted_by","DL01"),("DL02","assigned_to","DL01"),("DL02","handover_return_to","DL01"),
        ("DL06","student_id","DL09"),("DL06","lead_id","DL02"),("DL06","consultation_id","DL04"),
        ("DL06","course_id","DL05"),("DL06","discount_approved_by","DL01"),
        ("DL07","enrollment_id","DL06"),("DL07","student_id","DL09"),("DL07","received_by","DL01"),("DL07","verified_by","DL01"),
        ("DL08","enrollment_id","DL06"),("DL08","student_id","DL09"),("DL08","class_id","DL10"),("DL08","assigned_by","DL01"),
        ("DL09","first_enrollment_id","DL06"),
        ("DL10","course_id","DL05"),("DL10","main_teacher_id","DL01"),
        ("DL11","class_id","DL10"),("DL11","teacher_id","DL01"),("DL11","hw_bank_id","DL20"),
        ("DL12","session_id","DL11"),("DL12","student_id","DL09"),
        ("DL13","session_id","DL11"),("DL13","class_id","DL10"),("DL13","student_id","DL09"),("DL13","teacher_id","DL01"),
        ("DL14","student_id","DL09"),("DL14","staff_id","DL01"),
        ("DL15","student_id","DL09"),("DL15","class_id","DL10"),
        ("DL16","student_id","DL09"),("DL16","class_id","DL10"),("DL16","related_complaint_id","DL17"),
        ("DL17","student_id","DL09"),("DL17","class_id","DL10"),("DL17","feedback_id","DL16"),
        ("DL18","student_id","DL09"),("DL18","enrollment_id","DL06"),("DL18","class_id","DL10"),("DL18","next_enrollment_id","DL06"),
        ("DL19","referral_id","DL22"),("DL19","referrer_student_id","DL09"),
        ("DL21","course_id","DL05"),("DL21","hw_bank_id","DL20"),
        ("DL22","referrer_student_id","DL09"),("DL22","referred_lead_id","DL02"),("DL22","referred_enrollment_id","DL06"),
        ("DL23","assignee_id","DL01"),
        ("DL24","task_id","DL23")]
dead = []
for t, f, ref in REFS:
    if not R(t) or f not in R(t)[0]:
        dead.append("!! %s.%s KHONG TON TAI (luat vo hieu)" % (t,f)); continue
    b = sorted({s(r,f) for r in R(t) if s(r,f) and s(r,f) not in IDX[ref]})
    if b: dead.append("%s.%s->%s: %d ma chet (%s)" % (t,f,ref,len(b), ", ".join(b[:3])))
# DL23.assigner_id va DL24.staff_id: BINH THUONG tro toi DL01, NHUNG voi yeu cau do chinh hoc
# vien gui len (student_request) thi nguoi gui la HOC VIEN - tra sang DL09. Mot cot tro toi hai
# bang tuy loai dong, nen phai tach ra kiem chu khong nhet chung vao bang REFS.
_ycid = {s(x,"task_id") for x in R("DL23") if s(x,"task_type").startswith("student_request")}
for f, lbl in [("assigner_id", "DL23.assigner_id")]:
    b1 = sorted({s(r,f) for r in R("DL23")
                 if s(r,f) and s(r,"task_id") not in _ycid and s(r,f) not in IDX["DL01"]})
    if b1: dead.append("%s->DL01: %d ma chet (%s)" % (lbl, len(b1), ", ".join(b1[:3])))
    b2_ = sorted({s(r,f) for r in R("DL23")
                  if s(r,f) and s(r,"task_id") in _ycid and s(r,f) not in IDX["DL09"]})
    if b2_: dead.append("%s (yeu cau hoc vien)->DL09: %d ma chet (%s)" % (lbl, len(b2_), ", ".join(b2_[:3])))
_b3 = sorted({s(r,"staff_id") for r in R("DL24")
              if s(r,"staff_id") and s(r,"staff_id") not in IDX["DL01"] and s(r,"staff_id") not in IDX["DL09"]})
if _b3: dead.append("DL24.staff_id->DL01/DL09: %d ma chet (%s)" % (len(_b3), ", ".join(_b3[:3])))
rep("NANG", "11a Ma tham chieu CHET o cot *_id", dead)
# 11b. DL23.related_id
rel = []
for x in R("DL23"):
    rt, ri = s(x,"related_type"), s(x,"related_id")
    if not ri: continue
    tgt = {"student":"DL09","lead":"DL02","class":"DL10","enrollment":"DL06","staff":"DL01","complaint":"DL17"}.get(rt)
    if tgt and ri not in IDX[tgt]: rel.append("%s(%s %s)" % (s(x,"task_id"), rt, ri))
rep("NANG", "11b DL23.related_id tro toi ban ghi khong ton tai", rel)
# 11c. cot *_name lech voi ten that
NAMEP = [("DL02","assigned_to","assigned_to_name","DL01","full_name"),
         ("DL02b","staff_id","staff_id_name","DL01","full_name"),
         ("DL06","student_id","student_id_name","DL09","full_name"),
         ("DL06","course_id","course_id_name","DL05","course_name"),
         ("DL08","student_id","student_id_name","DL09","full_name"),
         ("DL08","class_id","class_id_name","DL10","class_name"),
         ("DL11","class_id","class_id_name","DL10","class_name"),
         ("DL11","teacher_id","teacher_id_name","DL01","full_name"),
         ("DL13","class_id","class_id_name","DL10","class_name"),
         ("DL13","teacher_id","teacher_id_name","DL01","full_name"),
         ("DL16","student_id","student_id_name","DL09","full_name"),
         ("DL17","student_id","student_id_name","DL09","full_name"),
         ("DL18","student_id","student_id_name","DL09","full_name"),
         ("DL23","assigner_id","assigner_id_name","DL01","full_name"),
         ("DL23","assignee_id","assignee_id_name","DL01","full_name"),
         ("DL24","staff_id","staff_id_name","DL01","full_name"),
         ("DL12","student_id","student_name","DL09","full_name"),
         ("DL13","student_id","student_name","DL09","full_name"),
         ("DL14","student_id","student_name","DL09","full_name"),
         # 114 phieu thu tung ghi verified_by=NV011 (NV IT) kem ten "Tran Ke Toan" khong co
         # trong DL01 - lot luoi vi cap cot nay chua duoc kiem.
         ("DL07","received_by","received_by_name","DL01","full_name"),
         ("DL07","verified_by","verified_by_name","DL01","full_name"),
         ("DL06","discount_approved_by","discount_approved_by_name","DL01","full_name")]
nm = []
for t,f,fn,ref,rf in NAMEP:
    if not R(t) or fn not in R(t)[0]:
        nm.append("!! %s.%s khong ton tai" % (t,fn)); continue
    b = ["%s:%s(%s vs %s)" % (s(r,KEY[t]), s(r,f), s(r,fn), s(IDX[ref][s(r,f)],rf))
         for r in R(t) if s(r,f) in IDX[ref] and s(r,fn) and s(r,fn) != s(IDX[ref][s(r,f)],rf)]
    if b: nm.append("%s.%s lech %d dong (vd %s)" % (t,fn,len(b), b[0]))
rep("NANG", "11c Cot *_name lech voi ten that trong bang goc (app hien ten sai)", nm)
# 11d. DL02.assigned_to_name vs handover
# 11e. mo coi nguoc: DL22 <-> DL19
r1 = [s(x,"reward_id") for x in R("DL19") if s(x,"referral_id") and s(x,"referral_id") not in IDX["DL22"]]
rep("NANG", "11e DL19.referral_id khong co trong so gioi thieu DL22", r1)
r2 = []
for x in R("DL22"):
    st = STU.get(s(x,"referrer_student_id"))
    if st and s(x,"referral_code") and s(st,"referral_code") and s(x,"referral_code") != s(st,"referral_code"):
        r2.append(s(x,"referral_id"))
rep("NANG", "11f Ma gioi thieu DL22 khac ma trong ho so HV DL09", r2)
r3 = []
for st in R("DL09"):
    real = len([x for x in R("DL22") if s(x,"referrer_student_id") == s(st,"student_id")])
    realen = len([x for x in R("DL22") if s(x,"referrer_student_id") == s(st,"student_id") and code(x.get("status"))=="enrolled"])
    if s(st,"referral_uses") and int(n(st.get("referral_uses"))) != real:
        r3.append("%s(uses %d/%d)" % (s(st,"student_id"), int(n(st.get("referral_uses"))), real))
    elif s(st,"referral_enrolled") and int(n(st.get("referral_enrolled"))) != realen:
        r3.append("%s(enrolled %d/%d)" % (s(st,"student_id"), int(n(st.get("referral_enrolled"))), realen))
rep("VUA", "11g Bo dem gioi thieu DL09 lech so ban ghi DL22", r3)
# 11h. DL09.first_enrollment_id/date vs DL06
r4 = []
for st in R("DL09"):
    es = sorted([e for e in R("DL06") if s(e,"student_id")==s(st,"student_id")], key=lambda e: dt(e.get("enrollment_time")) or NOW)
    if not es:
        if s(st,"first_enrollment_id"): r4.append("%s(co first_enrollment nhung khong co don nao)" % s(st,"student_id"))
        continue
    if s(st,"first_enrollment_id") and s(st,"first_enrollment_id") != s(es[0],"enrollment_id"):
        r4.append("%s(%s vs %s)" % (s(st,"student_id"), s(st,"first_enrollment_id"), s(es[0],"enrollment_id")))
    if s(st,"total_enrollments") and int(n(st.get("total_enrollments"))) != len(es):
        r4.append("%s(total %d/%d)" % (s(st,"student_id"), int(n(st.get("total_enrollments"))), len(es)))
rep("VUA", "11i DL09.first_enrollment_id / total_enrollments lech voi DL06", r4)

# ══ 12. LICH TUONG LAI (demo song) ═══════════════════════════════════════
fut_ses = [x for x in R("DL11") if (dt(x.get("session_date")) or datetime.datetime(1900,1,1)) > NOW]
d7 = [x for x in fut_ses if dt(x["session_date"]) <= NOW + datetime.timedelta(days=7)]
d30 = [x for x in fut_ses if dt(x["session_date"]) <= NOW + datetime.timedelta(days=30)]
today = [x for x in R("DL11") if dt(x.get("session_date")) and dt(x["session_date"]).date() == NOW.date()]
print("LICH: hom nay %d buoi | 7 ngay toi %d | 30 ngay toi %d | tong tuong lai %d"
      % (len(today), len(d7), len(d30), len(fut_ses)))
if len(today) == 0: rep("VUA", "12a KHONG co buoi hoc nao HOM NAY (dashboard 'hom nay' trong)", ["-"])
if len(d7) < 5: rep("VUA", "12b Qua it buoi hoc trong 7 ngay toi (%d)" % len(d7), ["-"])
fw = [x for x in R("DL14") if (dt(x.get("wow_session_date")) or datetime.datetime(1900,1,1)) > NOW]
print("WOW tuong lai: %d" % len(fw))
if len(fw) < 3: rep("VUA", "12c Qua it buoi WOW sap toi (%d)" % len(fw), ["-"])
ft = [x for x in R("DL23") if (dt(x.get("due_time")) or datetime.datetime(1900,1,1)) > NOW and code(x.get("task_status")) in ("new","accepted")]
print("Task con han: %d" % len(ft))

# ══ 13. TRA GOP: DL03/DL04 chuoi phieu ═══════════════════════════════════
g1 = [s(x,"test_booking_id") for x in R("DL03") if code(x.get("test_status"))=="graded" and not s(x,"overall_score")]
rep("NANG", "13a Test 'Da cham xong' nhung khong co diem overall", g1)
g2 = [s(x,"test_booking_id") for x in R("DL03") if code(x.get("test_status"))=="pending" and s(x,"overall_score")]
rep("NANG", "13b Test 'Chua co ket qua' nhung DA co diem", g2)
g3 = [s(x,"test_booking_id") for x in R("DL03") if dt(x.get("result_time")) and dt(x.get("test_date"))
      and dt(x.get("result_time")) < dt(x.get("test_date"))]
rep("NANG", "13c Ket qua test co TRUOC khi thi", g3)
g4 = [s(x,"test_booking_id") for x in R("DL03") if code(x.get("test_attendance_status")) in ("on_time","late")
      and (dt(x.get("test_date")) or NOW) > NOW]
rep("NANG", "13d Diem danh thi cho buoi test o TUONG LAI", g4)
g5 = [s(x,"consultation_id") for x in R("DL04") if dt(x.get("conversion_time")) and dt(x.get("consultation_time"))
      and dt(x.get("conversion_time")) < dt(x.get("consultation_time"))]
rep("NANG", "13e Chot deal TRUOC khi tu van", g5)
g6 = [s(e,"enrollment_id") for e in R("DL06") if IDX["DL04"].get(s(e,"consultation_id"))
      and dt(e.get("enrollment_time")) and dt(IDX["DL04"][s(e,"consultation_id")].get("consultation_time"))
      and dt(e.get("enrollment_time")) < dt(IDX["DL04"][s(e,"consultation_id")].get("consultation_time"))]
rep("NANG", "13f Dang ky TRUOC khi tu van", g6)
g7 = [s(o,"onboarding_id") for o in R("DL08") if ENR.get(s(o,"enrollment_id"))
      and dt(o.get("assigned_at")) and dt(ENR[s(o,"enrollment_id")].get("enrollment_time"))
      and dt(o.get("assigned_at")) < dt(ENR[s(o,"enrollment_id")].get("enrollment_time"))]
rep("NANG", "13g Xep lop TRUOC khi dang ky", g7)
g8 = [s(o,"onboarding_id") for o in R("DL08") if code(o.get("onboarding_status"))=="completed" and not s(o,"onboarding_completed_at")]
rep("VUA", "13h Onboarding 'Hoan thanh' nhung khong co moc hoan thanh", g8)
# 13i. DL18 truoc ngay ket thuc lop
g9 = ["%s(%s < KT lop %s)" % (s(r,"course_end_id"), s(r,"course_completion_time")[:10], s(CLS.get(s(r,"class_id"),{}),"class_end_date"))
      for r in R("DL18") if CLS.get(s(r,"class_id")) and dt(r.get("course_completion_time"))
      and dt(CLS[s(r,"class_id")].get("class_end_date"))
      and dt(r.get("course_completion_time")).date() < dt(CLS[s(r,"class_id")].get("class_end_date")).date()
      and code(r.get("student_status")) == "completed"]
rep("VUA", "13j DL18 'Hoan thanh khoa' truoc ngay ket thuc lop", g9)
# 13k. nhan vien inactive van duoc giao viec/day
inact = {s(x,"staff_id") for x in R("DL01") if code(x.get("status")) != "active"}
g10 = ["DL11.%s(%s)" % (s(x,"session_id"), s(x,"teacher_id")) for x in R("DL11") if s(x,"teacher_id") in inact
       and (dt(x.get("session_date")) or NOW) > NOW]
g10 += ["DL23.%s(%s)" % (s(x,"task_id"), s(x,"assignee_id")) for x in R("DL23") if s(x,"assignee_id") in inact]
g10 += ["DL10.%s(%s)" % (s(x,"class_id"), s(x,"main_teacher_id")) for x in R("DL10") if s(x,"main_teacher_id") in inact]
rep("VUA", "13l Nhan vien DA NGHI van duoc phan cong day/viec sap toi", g10)
# 13m. GV day 2 lop cung khung gio
conf = collections.defaultdict(list)
for x in R("DL11"):
    t = dt(x.get("session_date"))
    if t and s(x,"teacher_id"): conf[(s(x,"teacher_id"), t)].append(s(x,"session_id"))
g11 = ["%s @%s: %s" % (k[0], k[1].strftime("%d/%m %H:%M"), "+".join(v)) for k,v in conf.items() if len(v)>1]
rep("NANG", "13n GV bi xep DAY 2 LOP cung mot khung gio", g11)
# 13o. lop dung phong/zoom trung gio
rm = collections.defaultdict(list)
for x in R("DL11"):
    c = CLS.get(s(x,"class_id")); t = dt(x.get("session_date"))
    if c and t and s(c,"venue_or_zoom_link"): rm[(s(c,"venue_or_zoom_link"), t)].append(s(x,"session_id"))
g12 = ["%s @%s: %s" % (k[0], k[1].strftime("%d/%m %H:%M"), "+".join(v)) for k,v in rm.items() if len(v)>1]
rep("VUA", "13p Trung PHONG HOC/link Zoom cung khung gio", g12)


# ══ 14. LECH SO DO CUT (dong trong cung bang thieu cot) ══════════════════
dr = []
for t in dl:
    ks = [set(r.keys()) for r in R(t)]
    if not ks: continue
    u = set().union(*ks); inter = set.intersection(*ks)
    bads = [i for i,k in enumerate(ks) if k != u]
    if bads: dr.append("%s: %d/%d dong lech, cot khong dong deu = %s" % (t, len(bads), len(ks), sorted(u-inter)))
rep("NANG", "14a LECH SO DO CUT: dong trong cung bang KHONG cung bo cot (app render o trong)", dr)

# ══ 16. GIAO VIEC + QUYEN TAM + CHAT LUONG CHU (V9.23) ═══════════════════
import unicodedata as _ud
def _has_acc(t):
    return any(_ud.combining(ch) for ch in _ud.normalize("NFD", str(t or "")))
# 16a. moi cau chu nguoi doc thay phai la TIENG VIET CO DAU (demo tung viet khong dau)
_novn = []
for _t, _flds in (("DL23", ("title", "content", "done_note", "confirm_note", "decline_reason", "perm_note")),
                  ("DL24", ("content",))):
    for _r in R(_t):
        for _f in _flds:
            _v = str(_r.get(_f) or "")
            if len(_v) >= 15 and not re.match(r"^[\dA-Za-z\-/:, .]+$", _v) and not _has_acc(_v):
                _novn.append("%s.%s: %s" % (_t, _f, _v[:40]))
rep("NANG", "16a Chu tieng Viet KHONG DAU lot vao du lieu demo", _novn)
# 16b. giao viec phai phu du cac PHONG BAN co nguoi lam (khong bo quen vi tri nao)
_dep_staff = {s(x, "department") for x in R("DL01")
              if code(x.get("status")) == "active" and s(x, "department")
              and code(x.get("role")) != "ceo"}
_dep_task = {s(IDX["DL01"].get(s(x, "assignee_id")) or {}, "department") for x in R("DL23")}
_miss_dep = sorted(_dep_staff - _dep_task)
rep("VUA", "16b Phong ban co nguoi lam nhung KHONG he xuat hien trong so giao viec", _miss_dep)
# 16c. QUYEN TAM theo viec: dinh ho so thi phai co MUC quyen va HAN quyen
_pm = [s(x, "task_id") for x in R("DL23") if s(x, "related_id")
       and not (s(x, "perm_level") and s(x, "perm_until"))]
rep("NANG", "16c Viec dinh ho so nhung KHONG ghi muc quyen / han quyen tam", _pm)
# 16d. viec da dong thi quyen tam phai duoc THU HOI (khong de mo vo thoi han)
_pm2 = [s(x, "task_id") for x in R("DL23")
        if s(x, "related_id") and code(x.get("task_status")) in ("confirmed", "declined", "cancelled")
        and not s(x, "perm_revoked_at")]
rep("NANG", "16d Viec da dong ma quyen tam CHUA thu hoi", _pm2)
# 16e. han quyen tam khong duoc som hon han viec (cap quyen ma het han truoc khi lam xong)
_pm3 = ["%s(quyen %s < han viec %s)" % (s(x, "task_id"), s(x, "perm_until"), s(x, "due_time"))
        for x in R("DL23") if dt(x.get("perm_until")) and dt(x.get("due_time"))
        and dt(x.get("perm_until")) < dt(x.get("due_time"))]
rep("VUA", "16e Han quyen tam ket thuc TRUOC han viec", _pm3)
# 16f. hai nhan vien TRUNG KHIT ho ten -> moi cho tra nguoi theo ten deu nhap nhang
_nm = collections.Counter(s(x, "full_name") for x in R("DL01") if s(x, "full_name"))
rep("VUA", "16f Hai nhan vien TRUNG KHIT ho ten (tra nguoi theo ten bi nhap nhang)",
    ["%s x%d" % (k, v) for k, v in _nm.items() if v > 1])
# 16g. phieu thu phai ghi du net_received (bao cao tien ve thuc nhan doc cot nay)
_nr = [s(p, "payment_id") for p in R("DL07") if s(p, "amount") and not str(p.get("net_received") or "").strip()]
rep("VUA", "16g Phieu thu thieu net_received (bao cao thuc nhan doc rong)", _nr)

# ══ 17. LICH DONG HOC PHI THEO DOT - DL06b (V9.25) ═══════════════════════
SCH = R("DL06b")
if SCH:
    by_enr = collections.defaultdict(list)
    for x in SCH: by_enr[s(x,"enrollment_id")].append(x)
    # 17a. tong tien cac dot phai bang final_fee cua don
    p1 = []
    for eid, lst in by_enr.items():
        e = ENR.get(eid)
        if not e: continue
        tot = sum(n(x.get("due_amount")) for x in lst)
        if abs(tot - n(e.get("final_fee"))) > 1:
            p1.append("%s(dot %.0f != hop dong %.0f)" % (eid, tot, n(e.get("final_fee"))))
    rep("NANG", "17a Tong tien cac dot KHAC hoc phi cua don", p1)
    # 17b. tong da dong o cac dot phai bang paid_amount cua don
    p2 = []
    for eid, lst in by_enr.items():
        e = ENR.get(eid)
        if not e: continue
        if abs(sum(n(x.get("paid_amount")) for x in lst) - n(e.get("paid_amount"))) > 1:
            p2.append(eid)
    rep("NANG", "17b Tong da dong o cac dot KHAC paid_amount cua don", p2)
    # 17c. so dot phai lien tuc tu 1
    p3 = []
    for eid, lst in by_enr.items():
        nos = sorted(int(n(x.get("installment_no"))) for x in lst)
        if nos != list(range(1, len(nos) + 1)): p3.append(eid)
    rep("NANG", "17c So dot khong lien tuc tu 1", p3)
    # 17d. moi dot phai co han va tien
    p4 = [s(x,"schedule_id") for x in SCH if not (s(x,"due_date") and n(x.get("due_amount")) > 0)]
    rep("NANG", "17d Dot thieu han dong hoac thieu so tien", p4)
    # 17e. han dot sau phai SAU han dot truoc
    p5 = []
    for eid, lst in by_enr.items():
        o = sorted(lst, key=lambda x: int(n(x.get("installment_no"))))
        for i in range(1, len(o)):
            a, b = dt(o[i-1].get("due_date")), dt(o[i].get("due_date"))
            if a and b and b <= a: p5.append("%s dot %d" % (eid, i + 1))
    rep("NANG", "17e Han dot sau KHONG sau han dot truoc", p5)
    # 17f. trang thai dot phai khop so tien thuc
    p6 = []
    for x in SCH:
        st, pa, du = code(x.get("status")), n(x.get("paid_amount")), n(x.get("due_amount"))
        if st == "paid" and pa < du - 1: p6.append("%s(paid nhung con thieu)" % s(x,"schedule_id"))
        elif st in ("due","overdue","upcoming") and pa >= du - 1: p6.append("%s(da du tien ma van bao no)" % s(x,"schedule_id"))
        elif st == "partial" and (pa <= 0 or pa >= du): p6.append("%s(partial nhung tien khong khop)" % s(x,"schedule_id"))
    rep("NANG", "17f Trang thai dot mau thuan voi so tien thuc", p6)
    # 17g. don con no thi next_payment_due phai TRUNG han dot chua dong gan nhat
    p7 = []
    for eid, lst in by_enr.items():
        e = ENR.get(eid)
        if not e: continue
        op = [x for x in sorted(lst, key=lambda y: int(n(y.get("installment_no")))) if code(x.get("status")) != "paid"]
        want = s(op[0], "due_date") if op else ""
        if s(e, "next_payment_due") != want:
            p7.append("%s(don ghi %s, lich ghi %s)" % (eid, s(e,"next_payment_due") or "trong", want or "trong"))
    rep("NANG", "17g next_payment_due cua don KHAC han dot chua dong gan nhat", p7)
    # 17h. don chua huy va co hoc phi thi PHAI co lich dot
    p8 = [s(e,"enrollment_id") for e in R("DL06")
          if code(e.get("enrollment_status")) != "cancelled" and n(e.get("final_fee")) > 0
          and not by_enr.get(s(e,"enrollment_id"))]
    rep("NANG", "17h Don con hieu luc nhung KHONG co lich dong theo dot", p8)
    # 17i. 4 tham so cau hinh cua tinh nang phai co trong CH2
    _ch2 = {str(c.get("name")) for c in (d.get("config", {}).get("ch2") or [])}
    p9 = [x for x in ("installmentGap_days","installmentRemind_days","installmentLate_days",
                      "installmentDepositPercent") if x not in _ch2]
    rep("NANG", "17i Tham so cau hinh dong theo dot THIEU trong CH2", p9)

# ══ IN KET QUA ═══════════════════════════════════════════════════════════
# CA CO Y: nhung luat duoi day KHONG phai loi - du lieu demo co tinh dung nhu vay de man hinh
# co canh bao ma xem. Truoc V9.40 chung bi cong chung vao "TONG BAN GHI LOI" va verify.sh doi
# dung con so 4. Nhung so do TROI THEO NGAY: viec qua han hom nay it hon ngay mai, nen bo kiem
# tu chuyen do ma khong ai dung vao ma. Mot bo kiem tu do la bo kiem bi bo qua. Nay tach hai
# so: loi that (phai bang 0) va ca co y (bao nhieu cung duoc).
COY = {
    "10k Viec chua xong va DA QUA HAN (demo canh bao do)":
        "co y - de trang Giao viec luon co viec qua han mau do; so nay tang dan theo ngay",
}
ORD = {"NANG":0,"VUA":1,"NHE":2}
print("\n" + "="*90)
tot = 0
coy_tot = 0
for sev in ("NANG","VUA","NHE"):
    hits = [o for o in OUT if o[0]==sev and o[2]>0 and o[1] not in COY]
    print("\n##### %s (%d luat co loi)" % (sev, len(hits)))
    for _,name,cnt,ex,extra in sorted(hits, key=lambda o:-o[2]):
        tot += cnt
        print("  [%4d] %s" % (cnt, name))
        print("         vd: %s" % "; ".join(str(x) for x in ex))
        if extra: print("         (%s)" % extra)
print("\n### CA CO Y (khong tinh la loi):")
_coy_hit = [o for o in OUT if o[1] in COY and o[2] > 0]
if not _coy_hit:
    print("  (khong co)")
for _,name,cnt,ex,_ in _coy_hit:
    coy_tot += cnt
    print("  [%4d] %s" % (cnt, name))
    print("         %s" % COY[name])
print("\n### SACH (khong loi):")
for _,name,cnt,_,_ in OUT:
    if cnt==0: print("  OK -", name)
print("\nTONG BAN GHI LOI:", tot, "| ca co y:", coy_tot)
print("KET QUA: %s" % ("DAT" if tot == 0 else "KHONG DAT"))
sys.exit(0 if tot == 0 else 1)
