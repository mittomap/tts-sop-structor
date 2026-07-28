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

    # kich ban viec that cua trung tam - viet bang giong nguoi giao viec that
    SCEN = [
        ("Goi lai nhom khach chua ket noi tuan nay",
         "Danh sach khach da goi 2 lan chua gap. Doi khung gio goi (buoi toi) va nhan Zalo truoc khi goi.", "Tư vấn", "high"),
        ("Chot ho so con thieu giay to nhap hoc",
         "Ra soat cac ho so onboarding con thieu, lien he phu huynh bo sung trong tuan.", "Học vụ", "normal"),
        ("Doi soat khoan thu tien mat cuoi ngay",
         "Doi soat phieu thu tien mat voi so quy, bao lech (neu co) truoc 18h.", "Kế toán", "high"),
        ("Chuan bi de test dau vao dot moi",
         "Ra soat ngan hang de, in 20 bo cho tuan sau, kiem tra file nghe.", "ACA", "normal"),
        ("Viet nhan xet buoi con thieu",
         "Cac buoi da day nhung chua ghi nhan xet - hoan thanh de hoc vien va phu huynh theo doi duoc.", "ACA", "high"),
        ("Len lich WOW cho hoc vien yeu Speaking",
         "Loc hoc vien diem Speaking thap, xep buoi kem rieng 1-1 trong 2 tuan toi.", "ACA", "normal"),
        ("Tong hop phan hoi hoc vien thang nay",
         "Gom phieu khao sat + gop y, phan loai va de xuat 3 diem can cai thien.", "Học vụ", "normal"),
        ("Kiem tra thiet bi phong hoc truoc khai giang",
         "May chieu, loa, dieu hoa cac phong - bao IT neu can sua.", "Cơ sở vật chất", "normal"),
        ("Dang bai tuyen sinh khoa moi len fanpage",
         "Bai gioi thieu khoa khai giang thang toi, kem uu dai dang ky som.", "Marketing", "normal"),
        ("Ho tro truc tuyen sinh cuoi tuan",
         "Nho ho tro truc quay tu van sang thu 7 (mot buoi), minh ban lich hop.", "Tư vấn", "normal"),
        ("Ra soat cong no hoc phi qua han",
         "Danh sach dang ky con no qua han - goi nhac va ghi lai lich hen thu.", "Kế toán", "urgent"),
        ("Chuan bi bao cao ket qua thang cho hop giao ban",
         "So lieu tuyen sinh, doanh thu, chuyen can - gui truoc hop 1 ngay.", "Ban Giám đốc", "high"),
        ("Cap nhat giao an khoa 6.5 theo gop y giang vien",
         "Bo sung phan Writing Task 2 vao buoi 8-10 theo de xuat cua to chuyen mon.", "ACA", "normal"),
        ("Xu ly khieu nai muc cao con mo",
         "Lien he hoc vien trong hom nay, ghi phuong an xu ly va bao lai.", "Học vụ", "urgent"),
        ("Kiem tra lai danh sach lop sap khai giang",
         "Doi chieu si so, phong hoc, giang vien phu trach truoc khi gui thong tin lop.", "Học vụ", "high"),
        ("Nho check giup file du lieu truoc khi gui khach",
         "Minh gui file bao cao, nho xem giup so lieu phan doanh thu co dung khong.", "Kế toán", "low"),
        ("Sap xep lai kho tai lieu hoc thuat",
         "Gom tai lieu tren Drive theo khoa, dat ten thong nhat de ai cung tim duoc.", "ACA", "low"),
        ("Goi cham lai nhom khach da ngung",
         "Nhom lead lost 30 ngay - goi lai theo kich ban reup, ghi ket qua vao he thong.", "Tư vấn", "normal"),
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
            r["done_note"] = done_note or "Da hoan thanh theo yeu cau, chi tiet ghi trong he thong."
        if status == "confirmed":
            r["confirm_time"] = fmt(NOW - timedelta(hours=random.choice([1, 2, 6])))
            r["confirm_note"] = confirm_note or "Da kiem tra, dat yeu cau."
        if status == "declined":
            r["decline_reason"] = decline or "Dang ban viec gap khac, xin chuyen nguoi khac ho tro."
        return rows.append(r)

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

    # ---- 1. Giao xuong (cap tren -> cap duoi), phan lon BAT BUOC ----
    downs = [s for s in staff if lvl(s.get("role")) == 0]
    random.shuffle(downs)
    plan_down = [
        # (status, required, due_off_h, created_off_h)  -> tinh tu BAY GIO
        ("new", True, 20, -2),          # moi giao, con han
        ("new", True, -6, -30),         # QUA HAN chua nhan -> do
        ("accepted", True, 30, -26),    # dang lam
        ("accepted", True, -3, -50),    # QUA HAN dang lam -> do
        ("done", True, 12, -48),        # bao xong, CHO CAP TREN XAC NHAN
        ("done", True, 30, -40),        # cho xac nhan (2)
        ("confirmed", True, -20, -96),  # da hoan thanh dung han
        ("confirmed", True, -10, -80),
        ("accepted", True, 6, -10),     # sap den han
        ("new", True, 48, -1),
    ]
    for i, (st, req, due_h, cr_h) in enumerate(plan_down):
        if i >= len(downs): break
        who = downs[i]
        bs = boss_of(who)
        if not bs: continue
        pool = [s for s in SCEN if s[2] == who.get("department")] or SCEN
        add(bs, who, random.choice(pool), "assign", st, req, due_h, cr_h, related=pick_related())

    # ---- 2. Ngang cap (phoi hop) ----
    peers = {}
    for s in staff:
        peers.setdefault(lvl(s.get("role")), []).append(s)
    plan_peer = [("new", True, 26, -4), ("accepted", False, 40, -20),
                 ("done", True, 20, -44), ("declined", False, 18, -28)]
    for st, req, due_h, cr_h in plan_peer:
        grp = peers.get(0, []) + peers.get(1, [])
        a, b = random.sample(grp, 2) if len(grp) > 2 else (None, None)
        if not a: continue
        pool = [s for s in SCEN if s[2] == a.get("department")] or SCEN
        add(a, b, random.choice(pool), "peer", st, req, due_h, cr_h, related=pick_related(),
            decline="Tuan nay minh dang chay chi tieu tuyen sinh, xin hen dau tuan sau.")

    # ---- 3. Nho ho tro (khong bat buoc, co the tu cap duoi nho cap tren) ----
    plan_sup = [("new", False, 30, -3), ("accepted", False, 50, -18), ("confirmed", False, -12, -70)]
    for st, req, due_h, cr_h in plan_sup:
        a, b = random.sample(staff, 2)
        pool = [s for s in SCEN if s[3] == "low"] or SCEN
        add(a, b, random.choice(pool), "support", st, req, due_h, cr_h,
            done_note="Da xem giup, co ghi chu lai vai diem can sua.")

    dl["DL23"] = rows

    # ---- 4. DL24: TRAO DOI TRONG TUNG VIEC (de thong tin khong troi nhu nhan Zalo) ----
    # Bang rieng theo dung luat "moi dong mot ban ghi, ma la dia chi" - de len Sheets van chay.
    TALK = {
        "new": [],
        "accepted": [("assignee", "Em nhan viec nay a, em lam trong hom nay se bao lai anh/chi."),
                     ("assigner", "Oke em, co gi vuong nhan lai ngay nhe.")],
        "done": [("assignee", "Em nhan viec a."),
                 ("assignee", "Em lam xong roi, ket qua em ghi trong phan bao xong nhe."),
                 ("assigner", "De anh/chi xem lai roi xac nhan.")],
        "confirmed": [("assignee", "Em nhan viec a."),
                      ("assignee", "Da xong, nho anh/chi kiem tra giup."),
                      ("assigner", "Da xem, dat yeu cau. Cam on em.")],
        "declined": [("assignee", "Da anh/chi, tuan nay em ket viec qua, em xin phep tu choi."),
                     ("assigner", "Oke, de minh nho ban khac ho tro.")],
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
        for who, txt in [("assignee", "Anh/chi oi, cai nay lam theo mau cu hay mau moi a?"),
                         ("assigner", "Theo mau moi nhe em, file dinh kem trong SOP.")]:
            cn += 1
            sid = r["assignee_id"] if who == "assignee" else r["assigner_id"]
            nm = r["assignee_id_name"] if who == "assignee" else r["assigner_id_name"]
            cmts.append({"comment_id": "TCM-%04d" % cn, "task_id": r["task_id"], "staff_id": sid,
                         "staff_id_name": nm, "comment_time": fmt(NOW - timedelta(hours=2)),
                         "content": txt})
    dl["DL24"] = cmts

    # them nhan enum cho module giao viec (de app va ban Sheets dung chung mot bo nhan)
    enums = data.setdefault("enums", {})
    enums["enum_task_type"] = ["assign (Giao việc)", "peer (Phối hợp ngang cấp)", "support (Nhờ hỗ trợ)"]
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
