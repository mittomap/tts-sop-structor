# -*- coding: utf-8 -*-
# SINH DEMO MỚI TOÀN BỘ - neo quanh NGÀY CHẠY, phủ đủ tính năng app, liên kết chặt.
import json, random, datetime as dt, os

random.seed(7)
NOW = dt.datetime.now().replace(second=0, microsecond=0)
TODAY = NOW.replace(hour=0, minute=0)

def F(d):  # dd/mm/YYYY HH:MM
    return d.strftime("%d/%m/%Y %H:%M")
def FD(d): # dd/mm/YYYY
    return d.strftime("%d/%m/%Y")
def days(n): return dt.timedelta(days=n)

# dữ liệu nằm CẠNH script (cùng thư mục gen_v5.py) - đọc bản cũ làm giống, ghi đè lại chính nó
P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo_data_big.json")
old = json.load(open(P, encoding="utf-8"))
odl = old["dl"] if "dl" in old else old

STAFF = odl["DL01"]
COURSES = odl["DL05"]
CBY = {c["course_id"]: c for c in COURSES}
def staff_name(sid):
    for s in STAFF:
        if s["staff_id"] == sid: return s.get("full_name", sid)
    return sid
SALES = ["NV001","NV002","NV023","NV024","NV025","NV026"]
SALES_MGR = "NV012"
ACCOUNTANT = "NV010"   # Phan Thị Hồng Đào - accountant (NV Kế toán). NV011 là IT, không đối soát thu chi.
ACAD = [("NV007","Lê Thị Đức"),("NV008","Nguyễn Thị Hồng Thu")]
ACAD_IDS=[a[0] for a in ACAD]
WOWS = [("NV003","Nguyễn Thanh Kiu"),("NV004","Nguyễn Tuấn Phong"),("NV030","Phạm Công Danh")]
TEACH = {"NV005":"Phan Trung Chính","NV006":"Phạm Tấn Phát","NV031":"Trần Thanh Minh","NV032":"Thạch Đan Tiệp"}
# 4 GV cho 22 lớp là THIẾU: NV005 ôm 8 lớp, NV006 ôm 7 lớp, 3 lớp trống GV, và NV014
# (Trưởng phòng ACA) bị kéo vào đứng lớp -> trùng khung giờ là tất yếu (luật 13n/13p).
# Dựng lịch thật cho cả 22 lớp thì giờ cao điểm (tối T2-T4-T6) có tới 9 lớp chạy song song,
# nên biên chế đứng lớp phải là 10 GV chứ không phải 4. Chạy lại nhiều lần không nhân đôi.
_NEW_TEACH = [("NV033","Đặng Minh Khang","khang.gv","ACA.10","01/06/2024"),
              ("NV034","Bùi Thị Ngọc Hân","han.gv","ACA.11","15/09/2024"),
              ("NV035","Nguyễn Hoài Thương","thuong.gv","ACA.12","02/01/2025"),
              ("NV036","Đoàn Minh Khoa","khoa.gv","ACA.13","01/04/2025"),
              ("NV037","Lương Bảo Ngọc","ngocbao.gv","ACA.14","05/08/2025"),
              ("NV038","Trịnh Quốc Bảo","baotq.gv","ACA.15","01/11/2025")]
# Ba cặp nhân sự đang TRÙNG KHÍT họ tên (NV010/NV017 kế toán, NV011/NV018 IT, và 2 ô
# "(Chưa tuyển)") -> mọi chỗ tra người theo TÊN đều nhập nhằng, báo cáo theo người cộng dồn sai.
# Tên là thứ người dùng nhìn, phải phân biệt được; ô trống biên chế thì ghi rõ thuộc phòng nào.
_DUPFIX={"NV017":("Vũ Thị Thanh Huyền","huyen.kt"),
         "NV018":("Đỗ Nguyên Vũ","vu.it")}
for _s in STAFF:
    _f=_DUPFIX.get(_s.get("staff_id"))
    if _f:
        _s["full_name"]=_f[0]; _s["email"]=_f[1]+"@ieltsthetutors.edu.vn"
    if str(_s.get("full_name") or "").strip()=="(Chưa tuyển)":
        _s["full_name"]="(Chưa tuyển - "+str(_s.get("department") or "?")+")"
# Cổng học viên phải cho HV biết GV của mình là ai. gvBioEdit trong app đã biết ghi 2 cột này
# nhưng DL01 chưa bao giờ seed -> thẻ giảng viên bên cổng HV trống trơn.
_GVBIO=["Chuyên luyện Speaking và phát âm, 6 năm đứng lớp IELTS, IELTS 8.0.",
        "Thế mạnh Writing Task 2 và tư duy lập luận, 5 năm kinh nghiệm, IELTS 8.5.",
        "Chuyên Listening và chiến thuật làm đề, đã đưa hơn 200 học viên qua mốc 6.5.",
        "Chuyên Reading và từ vựng học thuật, bám sát từng học viên yếu.",
        "Luyện nền tảng cho người mới bắt đầu, kiên nhẫn và đi chậm chắc.",
        "Chuyên nhóm mục tiêu 7.0+, luyện đề sát format thi thật.",
        "Chuyên Speaking part 2-3, sửa phát âm theo từng lỗi cá nhân.",
        "Thế mạnh ngữ pháp và sửa lỗi bài viết chi tiết từng câu.",
        "Chuyên khóa cấp tốc, kèm sát tiến độ hằng tuần.",
        "Chuyên Writing Task 1 và mô tả số liệu, chấm bài rất kỹ."]
for _s in STAFF:
    _s.setdefault("bio",""); _s.setdefault("avatar_url","")
# ===== ANH DAI DIEN TU SINH, KHONG GOI RA MANG (V9.31) =====
# Kiem thu that tren trinh duyet bat duoc: anh dai dien giao vien lay tu ui-avatars.com. Hai cai sai:
#  (1) mo demo o cho khong co mang thi anh vo;
#  (2) TEN GIAO VIEN bi gui sang may chu nuoc ngoai moi lan mo trang - du lieu nguoi that,
#      khong duoc phep ro ri chi de ve mot vong tron co hai chu cai.
# Nay ve thang bang SVG nhung trong dia chi anh, khong goi ai ca.
def _avatar(name, bg="1E3A5F", fg="ffffff"):
    import urllib.parse
    parts = [p for p in str(name).split() if p]
    ini = "".join(p[0] for p in parts[-2:]).upper() or "GV"
    svg = ("<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 96 96'>"
           "<rect width='96' height='96' rx='48' fill='#%s'/>"
           "<text x='48' y='48' fill='#%s' font-family='Montserrat,Arial,sans-serif' font-size='38'"
           " font-weight='700' text-anchor='middle' dominant-baseline='central'>%s</text></svg>"
           % (bg, fg, ini))
    return "data:image/svg+xml," + urllib.parse.quote(svg)

_gi=0
for _s in STAFF:
    if str(_s.get("role","")).startswith("teacher") or "wow_coach" in str(_s.get("role","")):
        if not _s.get("bio"):
            _s["bio"]=_GVBIO[_gi%len(_GVBIO)]; _gi+=1
        # BAY DUONG ONG: gen_demo DOC LAI demo_data_big.json cua lan truoc, nen dong cu van con
        # dia chi ui-avatars. Khong chi "thieu thi bu" - phai VA ca dong cu tro ra mang.
        if not _s.get("avatar_url") or str(_s["avatar_url"]).startswith("http"):
            _s["avatar_url"]=_avatar(_s.get("full_name","GV"))
for _tid,_tnm,_tml,_thr,_tsd in _NEW_TEACH:
    TEACH[_tid]=_tnm          # LUÔN ghi vào bảng GV, kể cả khi DL01 đã có sẵn từ lần chạy trước
    if any(x.get("staff_id")==_tid for x in STAFF): continue
    STAFF.append({"staff_id":_tid,"full_name":_tnm,"role":"teacher (Giáo viên ACA)","department":"ACA",
                  "reports_to":"NV014","branch":"","phone":"0908000"+_tid[2:],
                  "email":_tml+"@ieltsthetutors.edu.vn","start_date":_tsd,
                  "status":"active (Đang làm việc)","notes":"Mã HR: "+_thr,"reports_to_name":"Lê Trọng Tín"})

# ---- tên: gom từ demo cũ (đủ thật, có dấu) ----
# LƯU Ý: name_pool lấy từ file demo CŨ, mà file cũ có thể đã bị mkdemo ghi tên "Demo 1/2/3"
# vào. Nếu gom cả tên đó thì chúng lọt vào pool rồi được gán ngẫu nhiên cho lead khác ->
# sinh ra nhiều "Demo 1" không liên quan (vòng lặp tự nhiễm). PHẢI lọc bỏ mọi tên placeholder.
import re as _re
def _isPlaceholder(nm):
    # lọc cả "Demo 1/2/3" (mkdemo ghi vào) lẫn "Nguyễn Văn 123" (fallback cũ) - không cho tái nhiễm
    return bool(_re.match(r"^\s*Demo\s*\d", nm)) or bool(_re.search(r"\d", nm)) or nm.strip()==""
name_pool = []
seen=set()
for r in odl["DL09"]:
    n=str(r.get("full_name","")).strip()
    if n and n not in seen and not _isPlaceholder(n): seen.add(n); name_pool.append(n)
for r in odl["DL02"]:
    n=str(r.get("full_name","")).strip()
    if n and n not in seen and not _isPlaceholder(n): seen.add(n); name_pool.append(n)
random.shuffle(name_pool)
name_pool = [n for n in name_pool if n!="Ngô Thanh Tú"]
# hết pool thì SINH họ tên Việt thật (không bao giờ trả placeholder kiểu "Nguyễn Văn 123")
_HO=["Nguyễn","Trần","Lê","Phạm","Hoàng","Huỳnh","Phan","Vũ","Võ","Đặng","Bùi","Đỗ","Hồ","Ngô","Dương","Lý","Đinh","Trương","Lâm","Mai","Tạ","Châu","Cao","Thái","Hà"]
_DEM_M=["Minh","Quốc","Đức","Hữu","Gia","Thanh","Trung","Anh","Bảo","Tuấn","Duy","Khắc","Xuân","Hoài","Nhật","Phúc","Thành","Công","Chí","Đình"]
_TEN_M=["Khôi","Phong","Long","Nam","Huy","Kiệt","Tùng","Quân","Việt","Sơn","Đạt","Dũng","Thịnh","Toàn","Nghĩa","Khang","Vinh","Lộc","Hiếu","Tín","Phát","Khánh","Trường","Hào","Luân"]
_DEM_F=["Thị","Thu","Ngọc","Thanh","Phương","Minh","Hồng","Kim","Mỹ","Diễm","Quỳnh","Bảo","Khánh","Thùy","Cẩm","Ánh","Tuyết","Hoài"]
_TEN_F=["Ngọc","Hà","Anh","Linh","Trang","Vy","Nhi","Chi","My","Thảo","Hạnh","Duyên","Loan","Oanh","Trâm","Tiên","Uyên","Nga","Mai","Hương","Yến","Như","Giang","Thư","Vân","Đan"]
def take_name():
    while name_pool:
        nm=name_pool.pop()
        if not _isPlaceholder(nm): return nm
    for _ in range(500):
        if random.random()<0.5:
            nm=random.choice(_HO)+" "+random.choice(_DEM_M)+" "+random.choice(_TEN_M)
        else:
            nm=random.choice(_HO)+" "+random.choice(_DEM_F)+" "+random.choice(_TEN_F)
        if nm not in seen:
            seen.add(nm); return nm
    # cùng đường (xác suất ~0): ghép thêm tên đệm thứ hai cho khác đi, vẫn là tên thật
    nm=random.choice(_HO)+" "+random.choice(_DEM_M)+" "+random.choice(_DEM_M).replace("Thị","Văn")+" "+random.choice(_TEN_M)
    seen.add(nm); return nm
def phone():
    return "0"+random.choice(["90","93","97","98","32","33","35","70","76","86"])+"".join(str(random.randint(0,9)) for _ in range(7))

# ================= DL10 LỚP =================
def sched_days(s):
    # BẪY cũ: nhánh 'T3 và 5' bắt nhầm cả nhãn "T3-T5" (Ba-Năm) lẫn "T3-5-7" (Ba-Năm-Bảy)
    # vì "T5" cũng chứa ký tự "5" -> lớp T3-T5 bị đẻ thêm buổi thứ Bảy không có trong lịch
    # công bố. Phải khớp NGUYÊN nhãn, dài trước ngắn sau.
    s=s.upper().replace(" ","")
    if "T7" in s and "CN" in s: return [5,6]
    if "T3-5-7" in s or "T3-T5-T7" in s: return [1,3,5]
    if "T3-T5" in s or "T3-5" in s: return [1,3]
    if "T2" in s: return [0,2,4]
    return [1,3]
def sched_hour(s):
    import re
    m=re.search(r'(\d{1,2})[Hh:](\d{0,2})', s)
    h=int(m.group(1)) if m else 19
    mi=int(m.group(2)) if (m and m.group(2)) else 0
    return h,mi
def sched_dur(s):
    return 3.0 if "9H-12" in s.upper().replace(" ","") else (2.5 if "14H-16H30" in s.upper().replace(" ","") else 1.5)

CLS = [dict(c) for c in odl["DL10"]]
def setc(cid,**kw):
    for c in CLS:
        if c["class_id"]==cid:
            c.update(kw); return c
RUN = ["LOP-IELTS-6.5-04","LOP-IELTS-6.0-12","LOP-IELTS-7.0-02","LOP-PRE-06","LOP-FOUND-PLA-01","LOP-CRSIEL-18"]
FIN = ["LOP-IELTS-6.5-03","LOP-FOUND-01"]
OPEN= ["LOP-IELTS-6.0-15","LOP-FOUND-02","LOP-CRSPRI-24"]
run_start={"LOP-IELTS-6.5-04":-63,"LOP-IELTS-6.0-12":-49,"LOP-IELTS-7.0-02":-42,"LOP-PRE-06":-35,"LOP-FOUND-PLA-01":-28,"LOP-CRSIEL-18":-21}
FIN_END={"LOP-IELTS-6.5-03":-20,"LOP-FOUND-01":-55}   # lớp đã kết thúc: neo NGÀY KẾT THÚC, suy ngược ngày khai giảng

def ses_target(c):
    """Số buổi HỢP ĐỒNG của khóa (DL05.duration_sessions)."""
    try: n=int(float(CBY.get(c.get("course_id"),{}).get("duration_sessions") or 0))
    except Exception: n=0
    return n or 36
def span_days(c):
    """Số ngày lớp phải chạy mới dạy đủ số buổi hợp đồng theo lịch tuần của lớp.
    Trước đây mọi lớp bị đóng cứng 84 ngày (12 tuần) trong khi khóa ghi 64-128 buổi -
    ngày kết thúc của lớp mâu thuẫn thẳng với số buổi của khóa."""
    per=len(sched_days(c["class_schedule"])) or 2
    return (-(-ses_target(c)//per))*7

for cid,off in run_start.items():
    _c=setc(cid,class_status="in_progress (Đang học)",class_start_date=FD(TODAY+days(off)))
    _c["class_end_date"]=FD(TODAY+days(off+span_days(_c)))
# chia lại GV chủ nhiệm để CẢ 4 GV đều đứng lớp đang chạy (NV032 trước đây không có lớp)
setc("LOP-PRE-06",main_teacher_id="NV032")
fin_start={}
for cid,_eo in FIN_END.items():
    _c=setc(cid,class_status="finished (Đã kết thúc)")
    fin_start[cid]=_eo-span_days(_c)
    _c["class_start_date"]=FD(TODAY+days(fin_start[cid])); _c["class_end_date"]=FD(TODAY+days(_eo))
for i,cid in enumerate(OPEN):
    _c=setc(cid,class_status="open (Đang tuyển sinh)",class_start_date=FD(TODAY+days(6+4*i)))
    _c["class_end_date"]=FD(TODAY+days(6+4*i+span_days(_c)))
_plan_i=-1
for c in CLS:
    if c["class_id"] in RUN+FIN+OPEN: continue
    if "cancelled" in str(c.get("class_status","")): continue
    c["class_status"]="planning (Đang lên kế hoạch)"
    _plan_i=_plan_i+1
    _kg=25+_plan_i*4
    c["class_start_date"]=FD(TODAY+days(_kg))
    # lớp lên kế hoạch VẪN phải có ngày dự kiến kết thúc (trước đây 11 lớp bỏ trống)
    c["class_end_date"]=FD(TODAY+days(_kg+span_days(c)))
for c in CLS:
    c["course_id_name"]=CBY.get(c["course_id"],{}).get("course_name","")
    if not str(c.get("class_capacity","")).strip(): c["class_capacity"]=14

# ---------- XẾP GIẢNG VIÊN + PHÒNG HỌC KHÔNG TRÙNG (luật 13n / 13p) ----------
# PHÒNG là thuộc tính của LỚP (DL10.venue_or_zoom_link), không phải của buổi - nên phải gỡ
# trùng ngay ở mức lớp, đổi phòng từng buổi trong DL11 vô ích. Hai lớp chỉ đụng nhau khi
# CÙNG khung giờ VÀ khoảng ngày chồng nhau, nên so theo KHOẢNG giờ thật của từng buổi.
cls_off={}
for c in CLS:
    try: _a=(dt.datetime.strptime(c["class_start_date"],"%d/%m/%Y")-TODAY).days
    except Exception: continue
    try: _b=(dt.datetime.strptime(c["class_end_date"],"%d/%m/%Y")-TODAY).days
    except Exception: _b=_a+span_days(c)
    cls_off[c["class_id"]]=(_a,max(_b,_a))
ROOMS=["Phòng 202 - Cơ sở 1","Phòng 203 - Cơ sở 1","Phòng 201 - Cơ sở 1","Phòng 103 - Cơ sở 2",
       "Phòng 105 - Cơ sở 2","Phòng 102 - Cơ sở 2","Phòng 305 - Cơ sở 3","Phòng 302 - Cơ sở 3",
       "Phòng 303 - Cơ sở 3","Phòng 401 - Cơ sở 4","Phòng 402 - Cơ sở 4","Phòng 403 - Cơ sở 4"]
def cls_slots(c):
    a,b=cls_off.get(c["class_id"],(None,None))
    if a is None: return []
    dows=sched_days(c["class_schedule"]); h,mi=sched_hour(c["class_schedule"]); dur=sched_dur(c["class_schedule"])
    out=[]; d=TODAY+days(a); end=TODAY+days(b)
    while d<=end:
        if d.weekday() in dows:
            s0=d.replace(hour=h,minute=mi); out.append((s0,s0+dt.timedelta(hours=dur)))
        d+=days(1)
    return out
def _fits(book,key,slots):
    m=book.get(key)
    if not m: return True
    for s0,e0 in slots:
        for s1,e1 in m.get(s0.date(),()):
            if s0<e1 and s1<e0: return False
    return True
def _book(book,key,slots):
    m=book.setdefault(key,{})
    for s0,e0 in slots: m.setdefault(s0.date(),[]).append((s0,e0))
_bkT={}; _bkR={}
# Xếp lớp KHÓ nhất trước (khoảng chạy dài nhất, khai giảng sớm nhất): greedy "ai đến trước
# xếp trước" hay kẹt ở lớp cuối vì các lớp ngắn đã chiếm hết GV của khung giờ đó.
for c in sorted(CLS,key=lambda x:(-(cls_off.get(x["class_id"],(0,0))[1]-cls_off.get(x["class_id"],(0,0))[0]),
                                  cls_off.get(x["class_id"],(0,0))[0])):
    if "cancelled" in str(c.get("class_status","")):
        c["venue_or_zoom_link"]="Đã hủy phòng"; c["main_teacher_id"]=""; continue
    sl=cls_slots(c)
    if not sl: continue
    _pt=[t for t in [str(c.get("main_teacher_id") or "")] if t in TEACH]
    for t in _pt+[x for x in TEACH if x not in _pt]:
        if _fits(_bkT,t,sl): c["main_teacher_id"]=t; _book(_bkT,t,sl); break
    else: raise SystemExit("Khong du giao vien de xep lop %s (khung %s, dang co %d GV) - them GV vao _NEW_TEACH"
                           %(c["class_id"],c["class_schedule"],len(TEACH)))
    if "online" in str(c.get("learning_mode","")).lower():
        c["venue_or_zoom_link"]="https://zoom.us/j/"+c["class_id"].lower().replace("lop-","")+" (gửi trước buổi đầu)"
        continue
    _pr=[r for r in [str(c.get("venue_or_zoom_link") or "")] if r in ROOMS]
    for r in _pr+[x for x in ROOMS if x not in _pr]:
        if _fits(_bkR,r,sl): c["venue_or_zoom_link"]=r; _book(_bkR,r,sl); break
    else: raise SystemExit("Khong du phong hoc de xep lop %s (khung %s, dang co %d phong) - them vao ROOMS"
                           %(c["class_id"],c["class_schedule"],len(ROOMS)))

# ================= HỌC VIÊN + ROSTER =================
roster_size={"LOP-IELTS-6.5-04":11,"LOP-IELTS-6.0-12":12,"LOP-IELTS-7.0-02":9,"LOP-PRE-06":10,"LOP-FOUND-PLA-01":9,"LOP-CRSIEL-18":8}
fin_size={"LOP-IELTS-6.5-03":6,"LOP-FOUND-01":5}
students=[]; rosters={cid:[] for cid in list(roster_size)+list(FIN)}
sid_n=0
def new_sid():
    global sid_n; sid_n+=1; return "HV%03d"%sid_n
def mk_student(name, status, joined_off, course_id):
    q = CBY.get(course_id,{}).get("wow_quota_default", 5) or 5
    return {"student_id":new_sid(),"full_name":name,"phone_number":phone(),"email":"","dob":FD(dt.date(random.randint(1998,2008),random.randint(1,12),random.randint(1,28))),
            "gender":random.choice(["Nam","Nữ"]),"student_type":random.choice(["school_student (Học sinh)","university_student (Sinh viên)","working_people (Người đi làm)"]),
            "address":"","emergency_contact_name":"","emergency_contact_phone":"","emergency_contact_relation":"",
            "first_enrollment_id":"","first_enrollment_date":"","total_enrollments":"1",
            "student_status":status,"joined_at":F(TODAY+days(joined_off)),"branch":random.choice(["branch_1 (Cơ sở 1)","branch_2 (Cơ sở 2)","online (Cơ sở Online)"]),
            "attendance_progress_status":"on_track (Đang đều đặn)","academic_progress_status":"on_track (Đang tiến bộ)",
            "attendance_risk_reason":"","academic_risk_reason":"","last_learning_activity_time":"","learning_followup_note":"","notes":"",
            "pause_until":"",
            "wow_quota_default":str(q),"wow_extra_approved":"0","wow_extra_purchased":"0","wow_quota_used":"0","wow_quota_remaining":str(q),"next_action":""}
class_course={c["class_id"]:c["course_id"] for c in CLS}
for cid,nn in roster_size.items():
    off=run_start[cid]
    for i in range(nn):
        s=mk_student(take_name(),"active (Đang học)",off+random.randint(-6,-1),class_course[cid])
        students.append(s); rosters[cid].append(s["student_id"])
for cid,nn in fin_size.items():
    for i in range(nn):
        # Ngày nhập học phải TRƯỚC ngày khai giảng của lớp. Lớp đã kết thúc nay được dựng đủ số
        # buổi hợp đồng nên khai giảng lùi khá xa - neo theo fin_start, đừng cắm cứng -115/-155.
        s=mk_student(take_name(),"completed (Hoàn thành khóa)",fin_start[cid]-random.randint(5,12),class_course[cid])
        students.append(s); rosters[cid].append(s["student_id"])
# dropped / transferred (từng thuộc lớp đang học)
sp=[]
for i in range(3):
    cid=RUN[i]; s=mk_student(take_name(),"dropped (Bỏ học giữa chừng)",run_start[cid],class_course[cid]); students.append(s); rosters[cid].append(s["student_id"]); sp.append(("drop",s,cid))
# 3 ca bảo lưu, hạn bảo lưu (pause_until) trải 3 tình huống: còn xa / sắp hết hạn <=14 ngày / vừa quá hạn
_PAUSE_OFF=[38,9,-3]
for i in range(3):
    cid=RUN[3+i]; s=mk_student(take_name(),"transferred (Bảo lưu/chuyển khóa)",run_start[cid],class_course[cid])
    s["pause_until"]=FD(TODAY+days(_PAUSE_OFF[i]))
    students.append(s); rosters[cid].append(s["student_id"]); sp.append(("trans",s,cid))
# 4 HV mới chuyển đổi (pipeline onboarding)
fresh=[]
for i in range(4):
    s=mk_student(take_name(),"active (Đang học)",-random.randint(0,2),"CRS-IELTS-6.0")
    students.append(s); fresh.append(s)
SBY={s["student_id"]:s for s in students}

# ================= LEADS =================
leads=[]; lid_n=0
def new_lid():
    global lid_n; lid_n+=1; return "L-2026-%05d"%lid_n
SRC=["facebook_ads (Quảng cáo Facebook)","tiktok_ads (Quảng cáo TikTok)","website (Form website ITTs)","zalo_oa (Zalo Official Account)","hotline (Gọi đến hotline)","referral (Giới thiệu)","walk_in (Khách tự đến trực tiếp)"]
GOAL=["study_abroad (Du học)","job (Công việc)","graduation (Tốt nghiệp)","personal (Cá nhân)"]
MODE=["online (Trực tuyến)","offline (Tại trung tâm)","hybrid (Kết hợp)"]
def mk_lead(name,ph,status,created_off,assigned,followup=None,note=""):
    _ct=TODAY+days(created_off)+dt.timedelta(hours=random.randint(8,20))
    if _ct>NOW: _ct=NOW-dt.timedelta(hours=random.randint(1,3))   # không sinh lead "đến từ tương lai"
    return {"lead_id":new_lid(),"lead_created_time":F(_ct),
        "assigned_to":assigned,"first_call_time":"","full_name":name,"phone_number":ph,"zalo_id":ph,
        "student_type":random.choice(["school_student (Học sinh)","university_student (Sinh viên)","working_people (Người đi làm)"]),
        "learning_goal":random.choice(GOAL),"target_band":random.choice(["5.5","6.0","6.5","7.0"]),
        "expected_start_time":"Tháng "+str(random.choice([8,9,10]))+"/2026","availability_schedule":random.choice(["Tối T2-4-6","Tối T3-5-7","Cuối tuần"]),
        "learning_mode":random.choice(MODE),"lead_source":random.choice(SRC),
        "lead_qualification_status":"qualified (Đủ điều kiện)","lead_status":status,
        "next_followup_time":followup or "","branch":random.choice(["branch_1 (Cơ sở 1)","branch_2 (Cơ sở 2)","online (Cơ sở Online)"]),
        "lead_note":note,"next_action":"","contact_count":"0","last_contact_time":"","view_history":"",
        "handover_return_to":"","handover_until":"","assigned_to_name":staff_name(assigned)}
# Ngô Thanh Tú - ca mẫu bàn giao tạm
tu=mk_lead("Ngô Thanh Tú",phone(),"contacted (Đã liên hệ, đang khai thác)",-12,"NV023",
    followup=F(TODAY+days(-1)+dt.timedelta(hours=9)),note="Quan tâm khóa 6.5, bận thi cuối kỳ")
tu["view_history"]="\n".join([
 F(TODAY+days(-2)+dt.timedelta(hours=8,minutes=15))+": Nguyễn Hoàng Anh Kiệt → Nguyễn Thị Phương Duyên (bởi Phạm Thị Kim Ngân) · Bàn giao TẠM đến hết "+FD(TODAY+days(4))+", tự quay về Nguyễn Hoàng Anh Kiệt · Kiệt đi công tác",
 F(TODAY+days(-7)+dt.timedelta(hours=9,minutes=20))+": Nguyễn Thị Phương Duyên → Nguyễn Hoàng Anh Kiệt (bởi Phạm Thị Kim Ngân) · Duyên nghỉ phép, chuyển Kiệt tiếp nhận",
 F(TODAY+days(-9)+dt.timedelta(hours=15,minutes=5))+": Nguyễn Văn Thanh Thuyên → Nguyễn Thị Phương Duyên (bởi Phạm Thị Kim Ngân) · Cân đối tải lead",
 F(TODAY+days(-10)+dt.timedelta(hours=8,minutes=40))+": Nguyễn Hoàng Anh Kiệt → Nguyễn Văn Thanh Thuyên (bởi Phạm Thị Kim Ngân) · Chia lead theo khu vực"])
tu["handover_return_to"]="NV001"; tu["handover_until"]=FD(TODAY+days(4))
leads.append(tu)
# lead của mỗi học viên (đã chuyển đổi)
lead_of={}
for s in students:
    joined=pvj=dt.datetime.strptime(s["joined_at"],"%d/%m/%Y %H:%M")
    off=int((pvj-TODAY).days)-random.randint(10,21)
    L=mk_lead(s["full_name"],s["phone_number"],"converted (Đã thành học viên)",off,random.choice(SALES))
    leads.append(L); lead_of[s["student_id"]]=L
# pipeline chưa chuyển đổi
def batch(n,status,co_range,fu=None,note=""):
    out=[]
    for i in range(n):
        f=None
        if fu=="overdue": f=F(TODAY+days(-random.randint(1,3))+dt.timedelta(hours=9))
        elif fu=="soon": f=F(TODAY+days(random.randint(0,6))+dt.timedelta(hours=random.choice([9,14,19])))
        L=mk_lead(take_name(),phone(),status,-random.randint(*co_range),random.choice(SALES),followup=f,note=note)
        leads.append(L); out.append(L)
    return out
# lead CHƯA GỌI giữ ÍT thôi: mỗi lead mới chưa gọi quá 15 phút là 1 việc đỏ trên chuông.
# Giữ 2 quá hẹn (cảnh báo có chủ đích) + 2 có hẹn sắp tới + 1 mới trong ngày.
new_over = batch(1,"new (Chưa liên hệ)",(2,4),fu="overdue")
new_soon = batch(1,"new (Chưa liên hệ)",(0,2),fu="soon")
# 3 lead VỪA đổ về 5-30 phút trước giờ build - SLA phản hồi 15 phút đang chạy ngay khi mở app
fresh_leads=[]
for _mins in (7,14,26):
    _L=mk_lead(take_name(),phone(),"new (Chưa liên hệ)",0,random.choice(SALES))
    _L["lead_created_time"]=F(NOW-dt.timedelta(minutes=_mins))
    leads.append(_L); fresh_leads.append(_L)
ctd = batch(46,"contacted (Đã liên hệ, đang khai thác)",(3,30),fu="soon")
cons= batch(24,"considering (Đang cân nhắc)",(5,35),fu="soon")
batch(6,"no_response (Không liên lạc được)",(10,50),fu="soon")
batch(10,"unreachable (Hết cách liên lạc)",(20,60))
batch(16,"rejected (Từ chối)",(10,60))
# >=6 lead có lịch hẹn gọi ĐÚNG HÔM NAY (bàn trực "tới hẹn hôm nay" luôn có việc)
for _L in ctd[2:8]:
    _L["next_followup_time"]=F(TODAY+dt.timedelta(hours=random.choice([10,14,16,19])))
# đa dạng mức đủ điều kiện (trước: 100% qualified)
for L in random.sample(leads,22): L["lead_qualification_status"]="unknown (Chưa rõ)"
for L in random.sample([x for x in leads if x["lead_status"].startswith(("rejected","no_response"))],7):
    L["lead_qualification_status"]="unqualified (Không phù hợp)"
# 1 bàn giao tạm khác
hv2=ctd[0]; hv2["assigned_to"]="NV024"; hv2["assigned_to_name"]=staff_name("NV024")
hv2["handover_return_to"]="NV002"; hv2["handover_until"]=FD(TODAY+days(10))
hv2["view_history"]=F(TODAY+days(-1)+dt.timedelta(hours=10))+": "+staff_name("NV002")+" → "+staff_name("NV024")+" (bởi Phạm Thị Kim Ngân) · Bàn giao TẠM đến hết "+FD(TODAY+days(10))+", tự quay về "+staff_name("NV002")+" · NV nghỉ ốm"
# thêm nhiều ca bàn giao để bấm dạo dễ gặp (5 vĩnh viễn + 4 tạm có ngày tự quay về)
HO_REASON=["Cân đối tải lead","NV nghỉ phép","Chuyển theo khu vực","Khách yêu cầu đổi NV","NV chuyển bộ phận"]
_hocand=[L for L in ctd[1:]+cons if L is not hv2][:60]
random.shuffle(_hocand)
for _i,_L in enumerate(_hocand[:9]):
    _from=random.choice([x for x in SALES if x!=_L["assigned_to"]])
    _lines=[]
    _n=random.randint(1,3)
    for _k in range(_n):
        _d=NOW-days(random.randint(2,25))-dt.timedelta(hours=random.randint(0,9))
        _a=random.choice(SALES); _b=random.choice([x for x in SALES if x!=_a])
        _lines.append(F(_d)+": "+staff_name(_a)+" → "+staff_name(_b)+" (bởi Phạm Thị Kim Ngân) · "+random.choice(HO_REASON))
    if _i<4:   # bàn giao TẠM, tự quay về
        _back=random.choice([x for x in SALES if x!=_L["assigned_to"]])
        _until=TODAY+days(random.randint(2,14))
        _L["handover_return_to"]=_back; _L["handover_until"]=FD(_until)
        _lines.append(F(NOW-days(random.randint(0,2)))+": "+staff_name(_back)+" → "+staff_name(_L["assigned_to"])+" (bởi Phạm Thị Kim Ngân) · Bàn giao TẠM đến hết "+FD(_until)+", tự quay về "+staff_name(_back)+" · "+random.choice(["Đi công tác","Nghỉ ốm","Nghỉ phép năm"]))
    _lines.sort(reverse=True)
    _L["view_history"]="\n".join(_lines)
LBY={L["lead_id"]:L for L in leads}

# ================= TOUCHPOINTS =================
tps=[]; tp_n=0
CONTENTS=["Gọi giới thiệu khóa học, khách nghe máy","Nhắn Zalo gửi lịch khai giảng","Khách hỏi học phí và lịch học","Tư vấn nhanh lộ trình theo band mục tiêu","Hẹn gọi lại vào buổi tối","Gửi brochure + link test thử","Khách bận, xin gọi lại sau","Xác nhận lịch test đầu vào"]
RESULTS=["Hẹn gọi lại "+FD(TODAY+days(2)),"Khách quan tâm, gửi thêm tài liệu","Đồng ý đặt lịch test","Chưa nghe máy, thử lại tối","Khách cân nhắc với gia đình"]
CRES_OK=["connected (Kết nối được (đã nói chuyện/nhắn được))","callback (Khách hẹn gọi lại)"]
CRES_FAIL=["no_answer (Gọi - không nghe máy)","busy (Máy bận / thuê bao)","sent_waiting (Đã nhắn - chưa trả lời)"]
def add_tp(L, when, ch=None, res=None):
    global tp_n; tp_n+=1
    stf=L["assigned_to"] or random.choice(SALES)
    tps.append({"touchpoint_id":"TP-%03d"%tp_n,"lead_id":L["lead_id"],"customer_name":L["full_name"],"contact_time":F(when),
        "channel":ch or random.choice(["phone (Điện thoại)","zalo (Zalo)","facebook (Facebook)"]),
        "direction":random.choice(["outbound (NV gọi/nhắn đi)","outbound (NV gọi/nhắn đi)","inbound (Khách liên hệ đến)"]),
        "content":random.choice(CONTENTS),"staff_id":stf,"result_note":res or random.choice(CRES_OK),"staff_id_name":staff_name(stf)})
for L in leads:
    st=L["lead_status"].split(" ")[0]
    n = {"new":0,"contacted":random.randint(1,3),"considering":random.randint(2,4),"no_response":2,"unreachable":3,"rejected":random.randint(1,2),"converted":random.randint(2,5)}.get(st,0)
    created=dt.datetime.strptime(L["lead_created_time"],"%d/%m/%Y %H:%M")
    times=sorted(created+dt.timedelta(days=random.uniform(0.05,max(0.2,(NOW-created).days*0.8)),hours=1) for _ in range(n))
    st_=L["lead_status"].split(" ")[0]
    for ti_,t in enumerate(times):
        if t>=NOW: continue
        if st_ in ("no_response","unreachable"):
            add_tp(L,t,res=random.choice(CRES_FAIL))
        elif st_=="rejected" and ti_==0:
            add_tp(L,t,res=random.choice(CRES_OK))
        else:
            add_tp(L,t,res=(random.choice(CRES_FAIL) if random.random()<0.22 and ti_<len(times)-1 else random.choice(CRES_OK)))
    mine=[t for t in tps if t["lead_id"]==L["lead_id"]]
    L["contact_count"]=str(len(mine))
    if mine:
        L["first_call_time"]=mine[0]["contact_time"]; L["last_contact_time"]=mine[-1]["contact_time"]
add_tp(tu, NOW-dt.timedelta(days=3,hours=2), "zalo (Zalo)", res="no_answer (Gọi - không nghe máy)")
tu["contact_count"]=str(int(tu["contact_count"])+1); tu["last_contact_time"]=F(NOW-dt.timedelta(days=3,hours=2)); tu["first_call_time"]=tu["first_call_time"] or tu["last_contact_time"]

# next_action cho lead
for L in leads:
    st=L["lead_status"].split(" ")[0]
    _att=[t for t in tps if t["lead_id"]==L["lead_id"]]
    _fail=sum(1 for t in _att if str(t.get("result_note","")).split(" ")[0] in ("no_answer","busy","sent_waiting","wrong_number"))
    if st=="new":
        if _att:
            L["next_action"]="Đã gọi %d lần chưa kết nối được. Việc cần làm: gọi lại theo lịch hẹn, quá 3 lần thì đổi kênh Zalo/SMS."%_fail
        elif L["next_followup_time"] and dt.datetime.strptime(L["next_followup_time"],"%d/%m/%Y %H:%M")<NOW:
            L["next_action"]="Lead đã giao cho NV nhưng quá 4 giờ (cấu hình slaLeadReassign_hours) chưa gọi. Việc cần làm: gọi gấp hoặc giao lại cho NV khác."
        else: L["next_action"]="Gọi lần đầu trong 15 phút (slaLRT_minutes) - giới thiệu và mời test miễn phí."
    elif st=="contacted": L["next_action"]="Gọi lại theo lịch hẹn, mời đặt lịch test đầu vào."
    elif st=="considering": L["next_action"]="Gửi thêm lộ trình + học phí, hẹn chốt trong tuần."
    elif st=="no_response": L["next_action"]="Đã gọi %d lần không gặp. Việc cần làm: thử kênh Zalo/SMS khung giờ khác (3 lần theo SOP)."%max(_fail,3)
# Tú quá hạn gọi
tu["next_action"]="Đã nhắn Zalo nhưng khách chưa trả lời. Việc cần làm: gọi lại theo lịch hẹn, quá 3 lần thì đổi kênh."


# 5 lead "đang gọi dở": vừa gọi hụt 1-2 lần, đến hẹn gọi lại (cho cảnh báo Gọi lại - chưa kết nối)
for _L in random.sample([x for x in ctd if int(x["contact_count"] or 0)>0][:40],5):
    for _k in range(random.randint(1,2)):
        add_tp(_L, NOW-dt.timedelta(hours=random.randint(5,30)), res=random.choice(CRES_FAIL))
    _L["contact_count"]=str(sum(1 for t in tps if t["lead_id"]==_L["lead_id"]))
    _L["next_followup_time"]=F(NOW-dt.timedelta(hours=random.randint(1,6)))

# 2 lead "hết cách gọi thường": gọi hụt lần 3 gần đây -> hàng chờ ĐỔI KÊNH (no_contact, đỏ có chủ đích)
_nr=[x for x in leads if x["lead_status"].startswith("no_response")][:2]
for _L in _nr:
    add_tp(_L, NOW-dt.timedelta(hours=random.randint(5,9)), res=random.choice(CRES_FAIL))
    _L["contact_count"]=str(sum(1 for t in tps if t["lead_id"]==_L["lead_id"]))

# LÀM TƯƠI lần chạm cuối của lead đang khai thác: chuông chỉ réo hồ sơ để nguội thật,
# phần lớn vừa được chăm (ẩn), một phần chớm hạn (vàng), giữ ~6% quá hạn đỏ có chủ đích.
_pool=[L for L in leads if L["lead_status"].split(" ")[0] in ("contacted","considering","no_response") and L not in _nr]
for _L in _pool:
    _mine=[t for t in tps if t["lead_id"]==_L["lead_id"]]
    if not _mine: continue
    _r=random.random()
    if _r<0.62:   _newt=NOW-dt.timedelta(hours=random.uniform(2,34))    # vừa chăm xong - chưa tới hạn nhắc
    elif _r<0.94: _newt=NOW-dt.timedelta(hours=random.uniform(38,70))   # chớm hạn - việc vàng
    else:         _newt=NOW-dt.timedelta(hours=random.uniform(76,108))  # quá hạn theo dõi - việc đỏ có chủ đích
    _last=max(_mine,key=lambda t:dt.datetime.strptime(t["contact_time"],"%d/%m/%Y %H:%M"))
    if dt.datetime.strptime(_last["contact_time"],"%d/%m/%Y %H:%M")<_newt:
        _last["contact_time"]=F(_newt)
    _times=[dt.datetime.strptime(t["contact_time"],"%d/%m/%Y %H:%M") for t in _mine]
    _L["last_contact_time"]=F(max(_times)); _L["first_call_time"]=F(min(_times))

# ================= DL03 TEST =================
tests=[]; tb_n=0
def add_test(L, kind):
    global tb_n; tb_n+=1
    t={"test_booking_id":"TB-2026-%03d"%tb_n,"lead_id":L["lead_id"],"test_date":"","test_format":random.choice(["online (Online (Zoom/LMS))","offline (Offline tại trung tâm)"]),
       "booking_status":"booked (Đã đặt lịch)","booking_note":"","test_attendance_status":"","test_attendance_time":"","test_no_show_reason":"",
       "test_status":"pending (Chưa có kết quả)","overall_score":"","skill_listening":"","skill_reading":"","skill_writing":"","skill_speaking":"",
       "academic_note":"","result_time":"","post_test_status":"","graded_by":"","auto_trigger_hint":"","next_action":"","lead_id_name":L["full_name"]}
    gv=random.choice(WOWS)
    if kind=="done":
        d=dt.datetime.strptime(L["lead_created_time"],"%d/%m/%Y %H:%M")+days(random.randint(2,5)); d=d.replace(hour=9,minute=0)
        sc=round(random.uniform(3.0,6.0)*2)/2
        t.update(test_date=F(d),test_attendance_status="on_time (Đúng giờ)",test_attendance_time=F(d),
            test_status="graded (Đã chấm xong)",overall_score=str(sc),
            skill_listening=str(max(1,round((sc+random.uniform(-.5,.5))*2)/2)),skill_reading=str(max(1,round((sc+random.uniform(-.5,.5))*2)/2)),
            skill_writing=str(max(1,round((sc-0.5)*2)/2)),skill_speaking=str(max(1,round((sc+random.uniform(-.5,.5))*2)/2)),
            academic_note=random.choice(["Nền tảng khá, cần luyện Writing","Phát âm tốt, từ vựng còn mỏng","Ngữ pháp ổn, nghe còn yếu"]),
            result_time=F(d+days(1)),post_test_status="consulted (Đã tư vấn xong)",graded_by=gv[0])
    elif kind=="pending_book": t.update(booking_status="pending (Chưa đặt lịch)")
    elif kind=="future":
        d=TODAY+days(random.choice([1,2,3]) if random.random()<0.55 else random.randint(1,6)); d=d.replace(hour=random.choice([9,14,19]))
        t.update(test_date=F(d))
    elif kind=="await_grade":
        d=NOW-dt.timedelta(hours=random.choice([5,8,11,14,18,20]));
        t.update(test_date=F(d),test_attendance_status="on_time (Đúng giờ)",test_attendance_time=F(d))
    elif kind=="graded_wait_consult":
        d=NOW-dt.timedelta(hours=random.randint(22,40)); sc=round(random.uniform(3.5,6.0)*2)/2
        t.update(test_date=F(d),test_attendance_status="on_time (Đúng giờ)",test_attendance_time=F(d),test_status="graded (Đã chấm xong)",
            overall_score=str(sc),skill_listening=str(sc),skill_reading=str(sc),skill_writing=str(max(1,sc-0.5)),skill_speaking=str(sc),
            result_time=F(NOW-dt.timedelta(hours=random.randint(6,18))),post_test_status="awaiting_consultation (Có KQ, chờ tư vấn)",graded_by=gv[0])
    elif kind=="noshow":
        d=NOW-dt.timedelta(hours=(15 if tb_n%2 else 40))   # 1 ca mới vắng (vàng) + 1 ca quá hạn gọi lại (đỏ)
        t.update(test_date=F(d),test_attendance_status="no_show (Vắng mặt)",test_no_show_reason=random.choice(["Quên lịch","Bận đột xuất","Không liên lạc được"]),
                 booking_note=F(d)+": vắng, chờ hẹn lại")
    elif kind=="rebooked":
        d0=NOW-dt.timedelta(days=3); d=TODAY+days(random.randint(1,5)); d=d.replace(hour=9)
        t.update(test_date=F(d),test_no_show_reason="Bận đột xuất",booking_note=F(d0)+": vắng (Bận đột xuất), hẹn lại "+F(d))
    elif kind=="refused":
        t.update(booking_status="rejected (Khách từ chối test)",booking_note="Khách muốn tư vấn thẳng, không test")
    elif kind=="late":
        d=NOW-days(random.randint(2,6)); sc=round(random.uniform(3.5,5.5)*2)/2
        t.update(test_date=F(d),test_attendance_status="late (Đến trễ)",test_attendance_time=F(d+dt.timedelta(minutes=25)),
            test_status="graded (Đã chấm xong)",overall_score=str(sc),skill_listening=str(sc),skill_reading=str(sc),
            skill_writing=str(max(1,sc-0.5)),skill_speaking=str(sc),result_time=F(NOW-dt.timedelta(hours=random.randint(6,20))),
            post_test_status="consulted (Đã tư vấn xong)",graded_by=gv[0],booking_note="HV đến trễ 25 phút, vẫn kịp làm bài")
    elif kind=="cancelled_bk":
        d=NOW-days(random.randint(1,5))
        t.update(test_date=F(d),booking_status="cancelled (Đã đặt nhưng hủy)",booking_note=F(d-days(1))+": khách báo bận, hủy lịch")
    elif kind=="today_wait":
        d=TODAY+dt.timedelta(hours=max(8,NOW.hour-1))
        t.update(test_date=F(d))
    elif kind=="today_attended":   # dự test HÔM NAY, đang chờ chấm - việc bấm được ngay khi mở app
        d=NOW-dt.timedelta(minutes=90)
        if d<TODAY: d=TODAY+dt.timedelta(minutes=30)   # build lúc rạng sáng thì neo 0h30 hôm nay, KHÔNG để giờ dự tương lai
        t.update(test_date=F(d),test_attendance_status="on_time (Đúng giờ)",test_attendance_time=F(d))
    elif kind=="today_later":      # lịch test HÔM NAY nhưng CHƯA tới giờ
        d=NOW+dt.timedelta(hours=3)
        if d.date()!=NOW.date(): d=NOW.replace(hour=21,minute=0)
        t.update(test_date=F(d),booking_note="Đã nhắn Zalo xác nhận, dặn tới sớm 10 phút")
    tests.append(t); return t
# 4 HV "fresh" (mới chuyển đổi) được cấp đơn RIÊNG ở khối pipeline onboarding phía dưới.
# Để lọt vào đây thì mỗi em có 2 đơn và first_enrollment_id bị ghi đè bằng đơn MỚI NHẤT
# -> hồ sơ HV chỉ ra sai ngày nhập học đầu tiên (luật 11i).
conv_students=[s for s in students if s not in fresh]
random.shuffle(conv_students)
for s in conv_students[:52]:
    add_test(lead_of[s["student_id"]],"done")
pipe=[L for L in leads if L["lead_status"].startswith(("contacted","considering"))]
random.shuffle(pipe)
pi=iter(pipe)
for kind,n in [("pending_book",6),("future",8),("await_grade",6),("graded_wait_consult",5),("noshow",2),("rebooked",2),("refused",3),("late",3),("cancelled_bk",2),("today_wait",1),("today_attended",1),("today_later",1)]:
    for _ in range(n): add_test(next(pi),kind)
# nối test_booking_id vào phiếu tư vấn (khi lead có test)
tb_of={}
for t in tests: tb_of.setdefault(t["lead_id"],t["test_booking_id"])

# ================= DL04 TƯ VẤN =================
cons_rows=[]; cs_n=0; cons_of={}
def add_cons(L,kind,course_id=None):
    global cs_n; cs_n+=1
    course=CBY.get(course_id or random.choice(["CRS-IELTS-6.0","CRS-IELTS-6.5","CRS-PRE-01"]),{})
    c={"consultation_id":"CS-2026-%03d"%cs_n,"lead_id":L["lead_id"],"test_booking_id":"","consulted_by":random.choice(SALES),
       "consultation_status":"consulted (Đã tư vấn xong)","consultation_time":"","recommended_course":course.get("course_name",""),
       "recommended_duration":str(course.get("duration_months","3"))+" tháng","recommended_schedule":random.choice(["T2-4-6 19h","T3-5-7 19h30","T7+CN sáng"]),
       "consultation_note":"","conversion_status":"undecided (Chưa quyết định)","conversion_time":"","conversion_note":"","next_action":"","customer_name_display":L["full_name"]}
    base=dt.datetime.strptime(L["lead_created_time"],"%d/%m/%Y %H:%M")
    if kind=="won":
        c.update(consultation_time=F(base+days(random.randint(3,7))),conversion_status="confirmed_with_deposit (Đồng ý + có cọc)",conversion_time=F(base+days(random.randint(4,9))))
    elif kind=="todo": c.update(consultation_status="not_consulted (Chưa tư vấn)")
    elif kind=="interested": c.update(consultation_time=F(NOW-dt.timedelta(hours=random.choice([8,20,30,44,58,80]))),conversion_status="interested (Quan tâm, chưa chốt)")
    elif kind=="dropped": c.update(consultation_time=F(NOW-days(random.randint(3,10))),conversion_status="dropped (Từ chối đăng ký)",conversion_note="Chi phí chưa phù hợp")
    elif kind=="noresp": c.update(consultation_time=F(NOW-dt.timedelta(hours=random.randint(30,60))),consultation_status="no_response (Không phản hồi)",
        consultation_note="Đã tư vấn qua điện thoại, gửi lộ trình nhưng khách chưa phản hồi lại")
    cons_rows.append(c); cons_of.setdefault(L["lead_id"],c["consultation_id"]); return c
for s in students:
    add_cons(lead_of[s["student_id"]],"won",class_course.get(next((cid for cid,r in rosters.items() if s["student_id"] in r),None)) )
for kind,n in [("todo",1),("interested",8),("dropped",4),("noresp",3)]:
    for _ in range(n): add_cons(next(pi,random.choice(pipe)),kind)
for c in cons_rows: c["test_booking_id"]=tb_of.get(c["lead_id"],"")

# ================= DL06 + DL07 =================
enrs=[]; pays=[]; en_n=0; pay_n=0
def add_enr(L,s,course_id,status="confirmed (Đã xác nhận)",created=None,disc=0,disc_state="none",paykind="paid"):
    global en_n; en_n+=1
    course=CBY.get(course_id,{})
    fee=int(course.get("list_price") or 12000000)
    final=max(0,fee-disc)
    created=created or (dt.datetime.strptime(L["lead_created_time"],"%d/%m/%Y %H:%M")+days(random.randint(5,10)))
    e={"enrollment_id":"ENR-2026-%03d"%en_n,"student_id":s["student_id"] if s else "","lead_id":L["lead_id"],
       "consultation_id":cons_of.get(L["lead_id"],""),"course_id":course_id,"enrollment_status":status,"enrollment_time":F(created),
       "total_fee":fee,"discount_amount":disc,"discount_type":"promotion (Khuyến mãi)" if disc else "","discount_reason":"Ưu đãi khai giảng" if disc else "",
       "discount_approved_by":"","discount_approved_by_name":"","final_fee":final,"paid_amount":0,"remaining_amount":final,"payment_status":"unpaid (Chưa thanh toán)",
       "next_payment_due":"","cancellation_reason":"","notes":"","auto_trigger_hint":"","next_action":"","discount_approved_at":"",
       "student_id_name":s["full_name"] if s else L["full_name"],"lead_id_name":L["full_name"],"course_id_name":course.get("course_name","")}
    # Cột *_by là MÃ nhân viên (NVxxx); TÊN người để ở cột *_name. Ghi tên vào ô mã =
    # mã chết, app tra ngược ra rỗng (luật 11a). Trạng thái từ chối đọc ở notes + discount_amount.
    if disc_state=="approved":
        e["discount_approved_by"]=SALES_MGR; e["discount_approved_by_name"]=staff_name(SALES_MGR)
        e["discount_approved_at"]=F(created+days(1))
        e["notes"]="CK "+format(disc,",").replace(",",".")+"đ đã duyệt bởi "+staff_name(SALES_MGR)
    elif disc_state=="rejected":
        e["notes"]="CK "+format(disc,",").replace(",",".")+"đ bị từ chối bởi Phạm Thị Kim Ngân"
        e["discount_approved_by"]=SALES_MGR; e["discount_approved_by_name"]=staff_name(SALES_MGR)
        e["discount_approved_at"]=F(created+days(1))
        e["discount_amount"]=0; e["final_fee"]=fee; e["remaining_amount"]=fee
    enrs.append(e); return e
def add_pay(e,when,amount,verified=True,method=None,note=""):
    global pay_n; pay_n+=1
    m=method or random.choice(["bank_transfer (Chuyển khoản NH)","bank_transfer (Chuyển khoản NH)","bank_transfer (Chuyển khoản NH)","cash (Tiền mặt)","momo (MoMo)","zalopay (ZaloPay)"])
    fee=random.choice([0,0,0,5500,11000]) if ("momo" in m or "zalopay" in m) else 0
    rb=random.choice(SALES+ACAD_IDS)
    p={"payment_id":"PAY-2026-%03d"%pay_n,"enrollment_id":e["enrollment_id"],"student_id":e["student_id"],
       "lead_id":e.get("lead_id",""),"payment_time":F(when),
       "payment_method":m,"amount":amount,"transaction_fee":fee,"net_received":amount-fee,
       "bank_name":random.choice(["VCB","ACB","Techcombank"]) if "bank" in m else "","sender_name":e["student_id_name"],"transaction_ref":"FT"+str(random.randint(10**8,10**9)) if "bank" in m else "",
       "received_by":rb,"payment_note":note or random.choice(["","","Thu tại quầy","Phụ huynh chuyển hộ",""]),"verified_by":ACCOUNTANT if verified else "","student_id_name":e["student_id_name"],
       "received_by_name":staff_name(rb),"verified_by_name":staff_name(ACCOUNTANT) if verified else "","next_action":""}
    pays.append(p)
    e["paid_amount"]=int(e["paid_amount"])+amount
    e["remaining_amount"]=max(0,int(e["final_fee"])-int(e["paid_amount"]))
    e["payment_status"]="paid (Đã thanh toán đủ)" if e["remaining_amount"]==0 else "partial (Đã thanh toán 1 phần)"
enr_of={}
disc_plan=(["pend"]*5+["appr"]*4+["rej"]*3)
random.shuffle(conv_students)
for i,s in enumerate(conv_students):
    cid=next((c for c,r in rosters.items() if s["student_id"] in r),None)
    course=class_course.get(cid,"CRS-IELTS-6.0")
    ds="none";d=0
    if i<len(disc_plan):
        ds={"pend":"none","appr":"approved","rej":"rejected"}[disc_plan[i]]
        d=random.choice([1000000,1500000,2000000])
        if disc_plan[i]=="pend": ds="none"
    e=add_enr(lead_of[s["student_id"]],s,course,disc=d if disc_plan[i:i+1] else 0,disc_state=ds)
    if i<5: e["discount_approved_by"]=""; e["discount_approved_by_name"]=""; e["discount_approved_at"]=""  # pending duyệt
    enr_of[s["student_id"]]=e
    s["first_enrollment_id"]=e["enrollment_id"]; s["first_enrollment_date"]=e["enrollment_time"]
    en_t=dt.datetime.strptime(e["enrollment_time"],"%d/%m/%Y %H:%M")
    r=random.random()
    if r<0.62:
        if random.random()<0.5: add_pay(e,en_t+days(1),int(e["final_fee"]))
        else:
            h=int(e["final_fee"])//2
            add_pay(e,en_t+days(1),h); add_pay(e,en_t+days(random.randint(15,30)),int(e["final_fee"])-h)
    elif r<0.9: add_pay(e,en_t+days(1),int(int(e["final_fee"])*random.choice([0.3,0.5])))
# 2 ca TRẢ GÓP (installment 3 kỳ, còn kỳ cuối)
for s in random.sample([x for x in conv_students if int(enr_of[x["student_id"]]["paid_amount"])==0],2):
    e=enr_of[s["student_id"]]; en_t=dt.datetime.strptime(e["enrollment_time"],"%d/%m/%Y %H:%M")
    k=int(e["final_fee"])//3
    add_pay(e,en_t+days(1),k,method="installment (Trả góp)",note="Trả góp kỳ 1/3")
    add_pay(e,en_t+days(30),k,method="installment (Trả góp)",note="Trả góp kỳ 2/3")
# tái ĐK: 3 HV lớp finished có enrollment thứ 2 (lớp đang chạy) - gồm HV065 (hồ sơ demo 2,
# cần lớp đang học có buổi sắp tới cho hero "buổi kế tiếp" của cổng học viên)
re2=[]
for s in [SBY[r] for r in rosters["LOP-IELTS-6.5-03"][:2]]+[SBY[rosters["LOP-IELTS-6.5-03"][5]]]:
    e=add_enr(lead_of[s["student_id"]],s,"CRS-IELTS-7.0",created=NOW-days(18)); add_pay(e,NOW-days(17),int(e["final_fee"]))
    s["total_enrollments"]="2"; s["student_status"]="active (Đang học)"; rosters["LOP-IELTS-7.0-02"].append(s["student_id"]); re2.append((s,e))
# hủy & hoàn tiền: c1 MỚI hủy 2 ngày (hàng chờ hoàn tiền - bấm được ngay), c2-c3 hủy trước đó đã hoàn
c1=add_enr(leads[-1],None,"CRS-PRE-01",status="cancelled (Đã hủy)",created=NOW-days(2)); c1["cancellation_reason"]="cancelled_by_student (Học viên tự hủy)"; add_pay(c1,NOW-days(1),3000000)
c2=add_enr(leads[-2],None,"CRS-IELTS-6.0",status="cancelled (Đã hủy)",created=NOW-days(3)+dt.timedelta(hours=6)); c2["cancellation_reason"]="cancelled_by_student (Học viên tự hủy)"; add_pay(c2,NOW-days(2),5000000)
c3=add_enr(leads[-3],None,"CRS-IELTS-6.5",status="cancelled (Đã hủy)",created=NOW-days(4)); c3["cancellation_reason"]="cancelled_by_itts (Trung tâm hủy)"; add_pay(c3,NOW-days(3),6000000)
c3["notes"]="Đã xử lý hoàn tiền "+F(NOW-days(2))+" bởi Phạm Thị Kim Ngân"; c3["payment_status"]="refunded (Đã hoàn tiền)"
# 5 đăng ký mới chờ thu (chưa xếp lớp): 2 ca đã 4 ngày (nhắc vàng), còn lại mới 0-3 ngày
pending_enr=[]
for i in range(5):
    L=next(pi,random.choice(pipe))
    e=add_enr(L,None,random.choice(["CRS-IELTS-6.0","CRS-PRE-01"]),status="pending (Đang chờ xác nhận)",created=NOW-days(4 if i<2 else random.randint(0,3)))
    pending_enr.append(e)
# fresh students enrollments (đã cọc)
for s in fresh:
    e=add_enr(lead_of[s["student_id"]],s,"CRS-IELTS-6.0",created=NOW-days(random.randint(1,3))); add_pay(e,NOW-days(1),2000000)
    enr_of[s["student_id"]]=e; s["first_enrollment_id"]=e["enrollment_id"]; s["first_enrollment_date"]=e["enrollment_time"]
# 4 khoản thu chờ xác nhận (mkdemo sẽ thêm 2 cho hồ sơ demo)
for p in random.sample([p for p in pays if p["verified_by"]],4):
    p["verified_by"]="";p["verified_by_name"]=""
# HẸN THU (next_payment_due) cho công nợ: trả góp kỳ cuối 1 hẹn HÔM NAY + 1 quá hạn 1-2 ngày;
# phần lớn công nợ khác có hẹn thu TƯƠNG LAI (có hẹn thì app chỉ nhắc khi tới hẹn);
# chừa ~5 hồ sơ KHÔNG hẹn để cảnh báo "nợ quá kỳ hạn" vẫn có hàng.
_debt=[e for e in enrs if int(e["remaining_amount"] or 0)>0 and "cancel" not in e["enrollment_status"] and not e["enrollment_status"].startswith("pending")]
_inst=[e for e in _debt if any("installment" in p["payment_method"] for p in pays if p["enrollment_id"]==e["enrollment_id"])]
if _inst:      _inst[0]["next_payment_due"]=FD(TODAY)
if len(_inst)>1:_inst[1]["next_payment_due"]=FD(TODAY-days(random.randint(1,2)))
_others=[e for e in _debt if e not in _inst]
random.shuffle(_others)
# MỌI công nợ đều phải có HẸN THU. Muốn có hàng "nợ quá hạn" thì đặt hẹn thu ở QUÁ KHỨ,
# KHÔNG bỏ trống - bỏ trống là app mất mốc nhắc, kế toán không biết hôm nay phải gọi ai.
for _i,_e in enumerate(_others):
    if _i>=len(_others)-4:                             # 4 hồ sơ cuối: hẹn thu ĐÃ QUÁ HẠN (đỏ có chủ đích)
        _e["next_payment_due"]=FD(TODAY-days(random.choice([1,3,6,11])))
    else:
        _e["next_payment_due"]=FD(TODAY+days(random.choice([3,5,7,10,14,18])))
# dọn ngày thu: không có khoản thu trong tương lai
for p in pays:
    t=dt.datetime.strptime(p["payment_time"],"%d/%m/%Y %H:%M")
    if t>NOW: p["payment_time"]=F(NOW-days(random.randint(1,4)))
# cân doanh thu: dồn bớt khoản thu 2 tháng trước sang tháng này (xu hướng ▲ nhẹ, tổng không đổi)
def _m(p): return dt.datetime.strptime(p["payment_time"],"%d/%m/%Y %H:%M").month
cur_m=TODAY.month; prev_m=(TODAY-days(30)).month
def _tot(m): return sum(p["amount"] for p in pays if _m(p)==m)
guard=0
while _tot(cur_m)<int(_tot(prev_m)*1.05) and guard<300:
    cands=[p for p in pays if _m(p) in (prev_m,(TODAY-days(60)).month)]
    if not cands: break
    p=random.choice(cands); p["payment_time"]=F(TODAY-days(random.randint(1,19))+dt.timedelta(hours=10))
    guard+=1

# ================= DL08 ONBOARDING =================
obs=[]; ob_n=0
def add_ob(s,cid,kind,off=None):
    global ob_n; ob_n+=1
    e=enr_of.get(s["student_id"],{})
    # Mốc xếp lớp phải TRƯỚC ngày khai giảng của chính lớp đó. run_start chỉ có key cho lớp
    # đang chạy nên lớp đã kết thúc rơi về -30 -> xếp lớp sau khai giảng cả trăm ngày.
    _kg=run_start.get(cid)
    if _kg is None: _kg=cls_off.get(cid,(-30,0))[0]
    base=TODAY+days(off if off is not None else _kg+random.randint(-4,-1))
    base=base+dt.timedelta(hours=10)
    o={"onboarding_id":"OB-%03d"%ob_n,"enrollment_id":e.get("enrollment_id",""),"student_id":s["student_id"],
       "placement_status":"confirmed (HV xác nhận đồng ý)","placement_note":"","assigned_by":random.choice(ACAD_IDS),"assigned_at":F(base),
       "class_id":cid or "","class_confirmation_status":"","confirmation_time":"","onboarding_status":"not_started (Chưa bắt đầu)",
       "onboarding_note":"","onboarding_completed_at":"","placement_change_count":"0","sla_status":"","class_info_sent_at":"",
       "auto_trigger_hint":"","next_action":"","student_id_name":s["full_name"],"class_id_name":next((c["class_name"] for c in CLS if c["class_id"]==cid),"")}
    if kind=="done":
        o.update(class_confirmation_status="confirmed (Đồng ý)",class_info_sent_at=F(base+dt.timedelta(hours=3)),
                 confirmation_time=F(base+dt.timedelta(hours=9)),onboarding_status="completed (Hoàn thành)",onboarding_completed_at=F(base+days(1)))
    elif kind=="sent_wait": o.update(class_info_sent_at=F(NOW-dt.timedelta(hours=6)),class_confirmation_status="pending (Chờ phản hồi)",onboarding_status="in_progress (Đang thực hiện)",assigned_at=F(NOW-dt.timedelta(hours=8)))
    elif kind=="need_send": o.update(assigned_at=F(NOW-dt.timedelta(hours=3)),onboarding_status="in_progress (Đang thực hiện)")
    elif kind=="rejected": o.update(class_info_sent_at=F(NOW-days(1)),class_confirmation_status="rejected (Từ chối)",onboarding_status="in_progress (Đang thực hiện)",assigned_at=F(NOW-days(1)-dt.timedelta(hours=4)))
    elif kind=="changed":
        o.update(placement_status="changed (Đã đổi lớp ≥1 lần)",placement_change_count="1",
                 placement_note=F(NOW-days(2))+": đổi LOP-PRE-06 → "+cid+" (HV xin đổi lịch tối)",
                 class_info_sent_at=F(NOW-days(2)+dt.timedelta(hours=2)),class_confirmation_status="confirmed (Đồng ý)",
                 confirmation_time=F(NOW-days(1)),onboarding_status="completed (Hoàn thành)",onboarding_completed_at=F(NOW-days(1)))
    obs.append(o); return o
for cid,r in rosters.items():
    for sid in r:
        s=SBY[sid]
        add_ob(s,cid,"done")
# fresh pipeline states: xếp vào lớp SẮP khai giảng (open) - xếp trước khai giảng, đúng SOP
add_ob(fresh[0],"LOP-IELTS-6.0-15","need_send",off=0)
add_ob(fresh[1],"LOP-IELTS-6.0-15","sent_wait",off=0)
_ob_rej=add_ob(fresh[2],"LOP-IELTS-6.0-15","rejected",off=-1)
_ob_rej["assigned_at"]=F(NOW-dt.timedelta(hours=14)); _ob_rej["class_info_sent_at"]=F(NOW-dt.timedelta(hours=10))
# 2 HV mới nữa (có lớp nhưng CHƯA học buổi nào) - tạo cảnh báo QUÁ HẠN đỏ
f_ov1=mk_student(take_name(),"active (Đang học)",-2,"CRS-PRE-01"); students.append(f_ov1); SBY[f_ov1["student_id"]]=f_ov1
f_ov2=mk_student(take_name(),"active (Đang học)",-5,"CRS-PRE-01"); students.append(f_ov2); SBY[f_ov2["student_id"]]=f_ov2
for s_ in (f_ov1,f_ov2):
    L_=mk_lead(s_["full_name"],s_["phone_number"],"converted (Đã thành học viên)",-random.randint(12,20),random.choice(SALES))
    leads.append(L_); lead_of[s_["student_id"]]=L_; LBY[L_["lead_id"]]=L_
    e_=add_enr(L_,s_,"CRS-PRE-01",created=NOW-days(6)); add_pay(e_,NOW-days(6),int(e_["final_fee"]))
    enr_of[s_["student_id"]]=e_; s_["first_enrollment_id"]=e_["enrollment_id"]; s_["first_enrollment_date"]=e_["enrollment_time"]
# 2 ca vào GIỮA KHÓA lớp đang chạy (hợp lệ theo SOP - xếp bổ sung), 1 ca quá hạn gửi info (đỏ có chủ đích)
ob_ov1=add_ob(f_ov1,"LOP-PRE-06","need_send"); ob_ov1["assigned_at"]=F(NOW-dt.timedelta(hours=30))
ob_ov2=add_ob(f_ov2,"LOP-PRE-06","sent_wait"); ob_ov2["assigned_at"]=F(NOW-dt.timedelta(hours=20)); ob_ov2["class_info_sent_at"]=F(NOW-dt.timedelta(hours=15))
# fresh[3]: CHƯA xếp lớp -> vẫn PHẢI có bản ghi DL08 ở trạng thái not_assigned. Hàng chờ
# "Xếp lớp học viên" là DỮ LIỆU CÓ THẬT, không phải "sự vắng mặt của dòng dữ liệu" - dùng
# chỗ trống làm tín hiệu thì không phân biệt được "đang chờ xếp" với "thủng dữ liệu".
_ob_wait=add_ob(fresh[3],"","need_send",off=0)
_ob_wait.update(placement_status="not_assigned (Chưa xếp lớp)",class_id="",class_id_name="",
                class_info_sent_at="",onboarding_status="not_started (Chưa bắt đầu)",
                next_action="Xếp lớp cho HV trong 3 ngày kể từ ngày đóng cọc.")
# 4 ca ĐÃ ĐỔI LỚP ở các lớp khác nhau (ghi đè bản done của chính HV đó)
for _cid,_ix in [("LOP-CRSIEL-18",0),("LOP-IELTS-6.0-12",2),("LOP-PRE-06",3),("LOP-IELTS-7.0-02",1)]:
    _ch=add_ob(SBY[rosters[_cid][_ix]],_cid,"changed")
    _dups=[o for o in obs if o["student_id"]==_ch["student_id"]]
    for _dd in _dups[:-1]: obs.remove(_dd)
# current_enrollment
cnt={}
for o in obs:
    if o["class_id"]: cnt[o["class_id"]]=cnt.get(o["class_id"],0)+1
for c in CLS: c["current_enrollment"]=cnt.get(c["class_id"],0)
# sức chứa không được nhỏ hơn sĩ số thật (tránh fixdata dời HV demo sang lớp khác)
for c in CLS:
    try: _cap=int(str(c.get("class_capacity") or 0))
    except Exception: _cap=0
    if _cap<int(c["current_enrollment"] or 0)+2: c["class_capacity"]=int(c["current_enrollment"] or 0)+2

# ĐIỂM KIỂM TRA GIỮA KHÓA (mid_*) - app đọc từ DL08 (midForm/midSave dùng mid_listening/
# mid_reading/mid_writing/mid_speaking/mid_overall/mid_test_date). Điền cho HV các lớp đã
# qua nửa chặng (~1/2 số HV đang học); HV chưa thi thì bỏ trống điểm.
for o in obs:
    for _mk in ("mid_listening","mid_reading","mid_writing","mid_speaking","mid_overall","mid_test_date"):
        o.setdefault(_mk,"")
_ob_by_stu={}
for o in obs: _ob_by_stu.setdefault((o["student_id"],o["class_id"]),o)
def _mid_date_of(c):
    """Mốc thi giữa khóa = CHÍNH GIỮA khung ngày của lớp. Không neo theo run_start vì lớp
    đã kết thúc không có run_start (đó là lý do 11 HV lớp đã kết thúc trống điểm giữa khóa)."""
    _a=dt.datetime.strptime(c["class_start_date"],"%d/%m/%Y") if str(c.get("class_start_date") or "").strip() else None
    _b=dt.datetime.strptime(c["class_end_date"],"%d/%m/%Y") if str(c.get("class_end_date") or "").strip() else None
    if not (_a and _b): return None
    _m=_a+(_b-_a)/2
    return None if _m>NOW else _m
# DUYỆT MỌI LỚP đã kết thúc + đang học ĐÃ QUA NỬA CHẶNG -> bắt buộc có điểm giữa khóa.
# Lớp chưa qua nửa chặng tự nhiên còn trống - ĐÓ mới là "ô trống để demo nhập tay",
# không cần bỏ ngẫu nhiên 12% nữa. HV bỏ học / đã hoàn thành cũng phải có điểm (rule
# duyệt MỌI dòng DL08 của lớp, không riêng HV đang học).
for _c in CLS:
    _st=str(_c.get("class_status") or "")
    if not (_st.startswith("finished") or _st.startswith("in_progress")): continue
    cid=_c["class_id"]
    _mid_d=_mid_date_of(_c)
    if not _mid_d: continue
    for sid in rosters.get(cid,[]):
        o=_ob_by_stu.get((sid,cid))
        if not o: continue
        # 4 kỹ năng sinh TRƯỚC, overall SUY RA từ trung bình (làm tròn 0.5) - không gán độc lập
        _base=round(random.uniform(4.0,6.5)*2)/2
        _l =max(1,round((_base+random.uniform(-.5,.5))*2)/2)
        _r =max(1,round((_base+random.uniform(-.5,.5))*2)/2)
        _w =max(1,round((_base-0.5)*2)/2)
        _sp=max(1,round((_base+random.uniform(-.5,.5))*2)/2)
        o["mid_listening"]=str(_l); o["mid_reading"]=str(_r)
        o["mid_writing"]=str(_w);   o["mid_speaking"]=str(_sp)
        o["mid_overall"]=str(round((_l+_r+_w+_sp)/4*2)/2)
        o["mid_test_date"]=FD(_mid_d)

# ================= DL11 BUỔI HỌC =================
sessions=[]; ses_n=0
# SỔ LỊCH BẬN: một GV / một phòng chỉ đứng ĐÚNG MỘT lớp trong cùng khung giờ. Lớp đã được
# xếp GV+phòng không đụng nhau ở khối trên, sổ này là chốt chặn cho buổi chèn tay (buổi bù,
# buổi đang diễn ra) - thiếu nó là tái sinh lỗi "GV dạy 2 lớp cùng giờ".
busy={}; busy_room={}
def gen_sessions(cid, start_off, end_off, status_all=None, limit=40):
    global ses_n
    c=next(x for x in CLS if x["class_id"]==cid)
    room=str(c.get("venue_or_zoom_link") or "").strip()
    dows=sched_days(c["class_schedule"]); h,mi=sched_hour(c["class_schedule"]); dur=sched_dur(c["class_schedule"])
    d=TODAY+days(start_off); num=0
    while d<=TODAY+days(end_off) and num<limit:
        if d.weekday() in dows:
            num+=1; ses_n+=1
            sd=d.replace(hour=h,minute=mi)
            past=sd<NOW
            late=random.random()<0.12
            row={"session_id":"SES-%03d"%ses_n,"class_id":cid,"session_number":num,"session_date":F(sd),
                 "class_start_scheduled":F(sd),"class_start_actual":F(sd+dt.timedelta(minutes=random.choice([5,8,12]) if late else 0)) if past else "",
                 "class_end_actual":F(sd+dt.timedelta(hours=dur)) if past else "",
                 "teacher_late_minutes":(random.choice([5,8,12]) if late else 0) if past else "",
                 "teacher_id":c.get("main_teacher_id",""),"session_status":"completed (Đã hoàn thành)" if past else "scheduled (Đã lên lịch)",
                 "has_teacher_note":"Có" if past and random.random()<0.7 else "","teacher_note_completed_at":"","teacher_note_within_sla":"",
                 "teacher_note_summary":random.choice(["Unit theo giáo trình + luyện đề","Chữa bài Writing, giao homework","Speaking part 2 theo cặp"]) if past and random.random()<0.7 else "",
                 "materials_link":"","notes":"","next_action":"","class_id_name":c["class_name"],"teacher_id_name":TEACH.get(c.get("main_teacher_id",""),"")}
            sessions.append(row)
            if row["teacher_id"]: busy[(row["teacher_id"],sd)]=row["session_id"]
            if room: busy_room[(room,sd)]=row["session_id"]
        d+=days(1)
# lớp đang học LUÔN còn buổi trong TƯƠNG LAI, rải 1-3 tuần tới theo lịch tuần của lớp
for cid in RUN: gen_sessions(cid, run_start[cid], 18)
# Lớp ĐÃ KẾT THÚC phải có ĐỦ số buổi hợp đồng của khóa (luật 9i) - trước đây cắt ở 40 buổi.
for cid,_eo in FIN_END.items():
    _c=next(x for x in CLS if x["class_id"]==cid)
    gen_sessions(cid, fin_start[cid], _eo, limit=ses_target(_c))
    _mine=[x for x in sessions if x["class_id"]==cid]
    if _mine: _c["class_end_date"]=FD(dt.datetime.strptime(_mine[-1]["session_date"],"%d/%m/%Y %H:%M"))
# MỌI lớp còn lại (đang tuyển sinh / lên kế hoạch / đã hủy) cũng phải có lịch buổi, nếu không
# trang lớp trắng trơn (luật 9j). Lớp chưa khai giảng chỉ công bố lịch 1 tháng đầu - đúng cách
# trung tâm làm thật, và không thổi phồng dữ liệu demo.
for c in CLS:
    if c["class_id"] in RUN or c["class_id"] in FIN_END: continue
    _a,_b=cls_off.get(c["class_id"],(None,None))
    if _a is None: continue
    gen_sessions(c["class_id"], _a, min(_a+30,_b))
    if "cancelled" in str(c.get("class_status","")):
        # lớp ĐÃ HỦY: lịch từng lên rồi hủy theo, giữ lại để còn truy vết chứ không xóa
        for _s in sessions:
            if _s["class_id"]==c["class_id"]:
                _s.update(session_status="cancelled (Đã hủy)",class_start_actual="",class_end_actual="",
                          teacher_late_minutes="",notes="Lớp đã hủy trước khai giảng - buổi không diễn ra")
# ghi chú GV sau buổi + tài liệu; 2 buổi bị hủy; 1 buổi ĐANG DIỄN RA ngay lúc này
for srow in sessions:
    if srow["session_status"].startswith("completed"):
        if srow["teacher_note_summary"]:
            sd=dt.datetime.strptime(srow["session_date"],"%d/%m/%Y %H:%M")
            late_note=random.random()<0.2
            srow["has_teacher_note"]="Có"
            srow["teacher_note_completed_at"]=F(sd+dt.timedelta(hours=random.randint(26,40) if late_note else random.randint(2,20)))
            srow["teacher_note_within_sla"]="Trễ" if late_note else "Đúng hạn"
        if random.random()<0.4: srow["materials_link"]="https://drive.google.com/itts/"+srow["session_id"]
_pastss=[s for s in sessions if s["session_status"].startswith("completed")]
for srow in random.sample(_pastss,2):
    srow.update(session_status="cancelled (Đã hủy)",class_start_actual="",class_end_actual="",teacher_late_minutes="",
        has_teacher_note="",teacher_note_completed_at="",teacher_note_within_sla="",teacher_note_summary="",notes="Nghỉ lễ / GV bận đột xuất - học bù tuần sau")
_cancel_ids={s["session_id"] for s in sessions if s["session_status"].startswith("cancelled")}
# buổi ĐANG DIỄN RA: lấy từ lớp KHÔNG có HV demo (giữ nguyên buổi sắp tới 1-3 ngày của lớp demo)
_demo_cls={"LOP-IELTS-6.5-04","LOP-IELTS-7.0-02"}
_live=next((s for s in sessions if s["session_status"].startswith("scheduled") and s["class_id"] not in _demo_cls),None)
if _live:
    _live.update(session_date=F(NOW-dt.timedelta(minutes=40)),class_start_scheduled=F(NOW-dt.timedelta(minutes=40)),
        class_start_actual=F(NOW-dt.timedelta(minutes=35)),session_status="in_progress (Đang diễn ra)",teacher_late_minutes=5)

# MỖI GIẢNG VIÊN có ít nhất 1 buổi HÔM NAY: GV nào trống lịch hôm nay thì thêm 1 buổi
# HỌC BÙ hôm nay cho lớp GV đó chủ nhiệm (bù cho các buổi đã hủy "học bù tuần sau").
_teach_today=set()
for srow in sessions:
    _sd=dt.datetime.strptime(srow["session_date"],"%d/%m/%Y %H:%M")
    if _sd.date()==TODAY.date() and not srow["session_status"].startswith("cancelled"):
        _teach_today.add(srow["teacher_id"])
_mk_hour=17 if NOW.hour<=17 else min(NOW.hour+1,21)
for _tid in TEACH:
    if _tid in _teach_today: continue
    _cid=next((c["class_id"] for c in CLS if str(c.get("main_teacher_id"))== _tid and c["class_id"] in RUN),None)
    if not _cid: continue
    _c=next(x for x in CLS if x["class_id"]==_cid)
    _sd=TODAY+dt.timedelta(hours=_mk_hour,minutes=30)
    ses_n+=1
    sessions.append({"session_id":"SES-%03d"%ses_n,"class_id":_cid,"session_number":0,"session_date":F(_sd),
        "class_start_scheduled":F(_sd),"class_start_actual":"","class_end_actual":"","teacher_late_minutes":"",
        "teacher_id":_tid,"session_status":"scheduled (Đã lên lịch)","has_teacher_note":"","teacher_note_completed_at":"",
        "teacher_note_within_sla":"","teacher_note_summary":"","materials_link":"",
        "notes":"Buổi học bù cho buổi nghỉ trước đó - đã báo nhóm lớp","next_action":"",
        "class_id_name":_c["class_name"],"teacher_id_name":TEACH.get(_tid,"")})
    _mk_hour=min(_mk_hour+1,21)
# đánh lại SỐ BUỔI theo dòng thời gian từng lớp (buổi bù chen giữa vẫn nối tiếp 1..n)
_by_cls={}
for srow in sessions: _by_cls.setdefault(srow["class_id"],[]).append(srow)
for _cid,_ss in _by_cls.items():
    _ss.sort(key=lambda x:dt.datetime.strptime(x["session_date"],"%d/%m/%Y %H:%M"))
    for _i,_srow in enumerate(_ss): _srow["session_number"]=_i+1

# ================= DL12 ĐIỂM DANH =================
atts=[]; at_n=0
sess_by_class={}
for srow in sessions: sess_by_class.setdefault(srow["class_id"],[]).append(srow)
def add_att(srow,sid,code,absence="",perf=None,note=""):
    global at_n; at_n+=1
    st=SBY[sid]
    sd=dt.datetime.strptime(srow["session_date"],"%d/%m/%Y %H:%M")
    row={"attendance_id":"AT-%04d"%at_n,"session_id":srow["session_id"],"student_id":sid,"student_name":st["full_name"],
         "attendance_status":{"p":"on_time (Đúng giờ)","l":"late (Trễ)","a":"no_show (Vắng)"}[code],
         "absence_type":absence,"check_in_time":F(sd+dt.timedelta(minutes=random.randint(-8,4) if code=="p" else random.randint(6,20))) if code!="a" else "",
         "in_class_performance":perf or random.choice(["good (Tốt)","good (Tốt)","average (Bình thường)","average (Bình thường)","weak (Yếu)"]) if code!="a" else "",
         "note":note,"next_action":""}
    atts.append(row)
absent_count={}; unexc_count={}
for cid,r in rosters.items():
    past=[x for x in sess_by_class.get(cid,[]) if x["session_status"].startswith("completed")]
    use=past          # MỌI buổi đã dạy đều phải có điểm danh - trước đây chỉ 12 buổi gần nhất
                      # nên buổi cũ trống trơn, KPI ADC tụt và nhật ký buổi học rỗng.
    for srow in use:
        for sid in r:
            st=SBY[sid]
            if st["student_status"].startswith("dropped") and srow["session_number"]>5:
                continue
            rr=random.random()
            if rr<0.85: add_att(srow,sid,"p")
            elif rr<0.91: add_att(srow,sid,"l")
            else:
                exc=random.random()<0.55
                add_att(srow,sid,"a","excused (Có phép)" if exc else "unexcused (Không phép)",note="Xin nghỉ ốm" if exc and random.random()<0.5 else "")
                absent_count[sid]=absent_count.get(sid,0)+1
                if not exc: unexc_count[sid]=unexc_count.get(sid,0)+1

# HÀNG CHỜ "gọi hỏi thăm HV vắng": giữ ĐÚNG 2 ca vắng không phép 0-2 ngày gần đây CHƯA ghi chú
# (1 ca hôm qua - vàng, 1 ca 2 ngày trước - đỏ có chủ đích); các ca không phép cũ hơn trong cửa sổ
# 4 ngày coi như đã gọi xong - ghi chú câu Việt tự nhiên để chuông không réo tràn.
_sess_d={s["session_id"]:dt.datetime.strptime(s["session_date"],"%d/%m/%Y %H:%M") for s in sessions}
_sess_done={s["session_id"] for s in sessions if s["session_status"].startswith("completed")}
_unexc_recent=[a for a in atts if a["attendance_status"].startswith("no_show") and str(a["absence_type"]).startswith("unexcused")
               and a["session_id"] in _sess_done and _sess_d[a["session_id"]]>=NOW-days(4)]
_keep_quiet=[]
for _tgt_day in (1,2):   # cần 1 ca vắng cách ~1 ngày (buổi tối hôm qua - vàng) và 1 ca cách ~2 ngày (đỏ)
    _cands=[a for a in _unexc_recent if abs((NOW-_sess_d[a["session_id"]]).days)==_tgt_day and a not in _keep_quiet]
    _cands.sort(key=lambda a:_sess_d[a["session_id"]],reverse=(_tgt_day==1))
    _got=_cands[0] if _cands else None
    if not _got:
        _c1=[a for a in atts if a["attendance_status"].startswith("on_time") and a["session_id"] in _sess_done
             and abs((NOW-_sess_d[a["session_id"]]).days)==_tgt_day]
        _c1.sort(key=lambda a:_sess_d[a["session_id"]],reverse=(_tgt_day==1))
        if _c1:
            _got=_c1[0]
            _got.update(attendance_status="no_show (Vắng)",absence_type="unexcused (Không phép)",check_in_time="",in_class_performance="",note="")
            absent_count[_got["student_id"]]=absent_count.get(_got["student_id"],0)+1
            unexc_count[_got["student_id"]]=unexc_count.get(_got["student_id"],0)+1
            _unexc_recent.append(_got)
    if _got: _keep_quiet.append(_got)
for a in _unexc_recent:
    if a in _keep_quiet or str(a.get("note") or "").strip(): continue
    a["note"]="Đã gọi hỏi thăm "+FD(_sess_d[a["session_id"]]+days(1))+": HV báo bận việc nhà, hứa đi học lại buổi tới"

# ================= DL13 BÀI TẬP =================
hws=[]; hw_n=0
TITLES={"Writing (Viết)":["Writing Task 2 - Opinion essay","Writing Task 1 - Line graph","Writing Task 2 - Discussion"],
        "Listening (Nghe)":["Listening Section 3 - Cam 18","Listening dictation Unit 5"],
        "Reading (Đọc)":["Reading passage - Matching headings","Reading TF/NG - Cam 17"],
        "Speaking (Nói)":["Speaking Part 2 - Describe a person","Speaking Part 1 - Hobbies record"],
        "Vocabulary (Từ vựng)":["Vocab Unit 4 - Education","Collocations - Environment"],
        "Grammar (Ngữ pháp)":["Grammar - Conditionals worksheet"]}
FB_BANK=["Bài tốt, chú ý spelling","Ý ổn nhưng thiếu ví dụ, band 5.5","Cần luyện thêm task response","Tiến bộ rõ so với bài trước","Ngữ pháp còn sai thì, xem lại mục 3"]
miss_count={}
def add_hw_assignment(cid, srow, kind):
    global hw_n
    skill=random.choice(list(TITLES.keys()))
    title=random.choice(TITLES[skill])
    c=next(x for x in CLS if x["class_id"]==cid)
    ad=dt.datetime.strptime(srow["session_date"],"%d/%m/%Y %H:%M")
    due=ad+days(3)
    for sid in rosters[cid]:
        st=SBY[sid]
        if st["student_status"].startswith("dropped") and srow["session_number"]>5: continue
        hw_n+=1
        row={"homework_id":"HW-%04d"%hw_n,"session_id":srow["session_id"],"class_id":cid,"student_id":sid,"student_name":st["full_name"],
             "homework_title":title,"skill":skill,"homework_assigned_time":F(ad),"homework_due_date":FD(due),
             "homework_submitted_time":"","is_late":"","homework_status":"assigned (Đã giao)","homework_score":"","score_type":"band",
             "graded_at":"","graded_within_48h":"","teacher_feedback":"","teacher_id":c.get("main_teacher_id",""),
             "notes":"","next_action":"","class_id_name":c["class_name"],"teacher_id_name":TEACH.get(c.get("main_teacher_id",""),"")}
        if kind=="graded":
            r=random.random()
            if r<0.78:
                _late_pick=random.random()<0.18
                _due_end=due.replace(hour=23,minute=59)
                sub=(_due_end+dt.timedelta(hours=random.randint(3,30))) if _late_pick else (_due_end-dt.timedelta(hours=random.randint(4,40)))
                if sub<ad+dt.timedelta(hours=2): sub=ad+dt.timedelta(hours=2)
                lt=sub.date()>due.date()       # hạn nộp là ô NGÀY -> so theo ngày, không so theo giờ
                row.update(homework_submitted_time=F(sub),is_late="Có" if lt else "Không",
                    homework_status=("submitted_late (Nộp trễ)" if lt else "submitted_on_time (Nộp đúng/trước hạn)"))
                g_in=random.random()<0.8
                gat=sub+dt.timedelta(hours=random.randint(6,44) if g_in else random.randint(50,90))
                row.update(homework_score=str(round(random.uniform(4.5,8.0)*2)/2),graded_at=F(min(gat,NOW-dt.timedelta(hours=1))),
                    graded_within_48h="Có" if g_in else "Không",teacher_feedback=random.choice(FB_BANK))
            else:
                row.update(homework_status="missing (Không nộp)")
                miss_count[sid]=miss_count.get(sid,0)+1
        elif kind=="submitted":
            # SINH GIỜ NỘP TRƯỚC -> SUY RA nhãn. Trước đây nhãn "Nộp trễ/đúng hạn" được tung
            # xúc xắc ĐỘC LẬP với giờ nộp nên 23 bài mang nhãn ngược hẳn với mốc thời gian.
            _due_end=due.replace(hour=23,minute=59)
            if random.random()<0.25: sub=_due_end+dt.timedelta(hours=random.choice([3,9,16,26,34]))
            else:                    sub=_due_end-dt.timedelta(hours=random.choice([6,14,22,30,40,52]))
            if sub>NOW-dt.timedelta(hours=1): sub=NOW-dt.timedelta(hours=1)   # không nộp ở tương lai
            if sub<ad+dt.timedelta(hours=2):  sub=ad+dt.timedelta(hours=2)    # không nộp trước giờ giao
            lt=sub.date()>due.date()                                          # nhãn suy ra SAU khi đã kẹp
            row.update(homework_submitted_time=F(sub),is_late="Có" if lt else "Không",
                homework_status=("submitted_late (Nộp trễ)" if lt else "submitted_on_time (Nộp đúng/trước hạn)"))
        # kind=="assigned": để nguyên (chưa thu)
        hws.append(row)
for cid in RUN+FIN:
    past=[x for x in sess_by_class.get(cid,[]) if x["session_status"].startswith("completed")]
    picks=past[-8::2]
    for srow in picks[:-1]:
        add_hw_assignment(cid,srow,"graded")
    if cid in FIN:
        if past: add_hw_assignment(cid,past[-1],"graded")
        continue
    if len(past)>=2:
        add_hw_assignment(cid,past[-2],"submitted")
    if past:
        add_hw_assignment(cid,past[-1],"assigned")

# cờ nguy cơ theo dữ liệu thật
_first_drop=True
for s in students:
    sid=s["student_id"]
    ab=absent_count.get(sid,0); ux=unexc_count.get(sid,0); ms=miss_count.get(sid,0)
    if s["student_status"].startswith("dropped"):
        # chỉ ca bỏ học MỚI NHẤT còn treo cờ nguy cơ (đang xử lý giữ chân); các ca cũ đã chốt hồ sơ
        if _first_drop:
            s["attendance_progress_status"]="off_track (Sa sút nặng)"; s["attendance_risk_reason"]="frequent_absence (Vắng nhiều)"
            s["academic_progress_status"]="off_track (Lệch tiến độ)"; s["academic_risk_reason"]="homework_missing (Không làm bài)"
            _first_drop=False
        else:
            s["learning_followup_note"]=F(NOW-days(random.randint(6,15)))+": đã gọi giữ chân 2 lần không thành, chốt bỏ học và đóng hồ sơ"
        continue
    if ab>=3 or ux>=2:
        s["attendance_progress_status"]="at_risk (Có nguy cơ)"; s["attendance_risk_reason"]="frequent_absence (Vắng nhiều)"
        s["next_action"]="Gọi hỏi thăm + nhắc lịch học (NA064)."
    if ms>=2:
        s["academic_progress_status"]="at_risk (Có nguy cơ)"; s["academic_risk_reason"]="homework_missing (Không làm bài)"
        s["next_action"]=(s["next_action"]+" " if s["next_action"] else "")+"Nhắc nộp bài + hẹn WOW củng cố (NA065)."
# GIỮ TỐI ĐA 6 HV ở diện at_risk (mỗi HV nguy cơ = 1 việc đỏ trên chuông; số còn lại
# coi như đã can thiệp xong - fixdata sẽ hạ tiếp một phần có ghi chú can thiệp)
_risk_act=[s for s in students if "at_risk" in s["attendance_progress_status"]+s["academic_progress_status"]]
for s in _risk_act[6:]:
    s["attendance_progress_status"]="on_track (Đang đều đặn)"; s["attendance_risk_reason"]=""
    s["academic_progress_status"]="on_track (Đang tiến bộ)"; s["academic_risk_reason"]=""
    s["next_action"]=""
    s["learning_followup_note"]=F(NOW-days(random.randint(2,8)))+": đã gọi nhắc học + xếp 1 buổi WOW củng cố, HV đi học lại đều"
my_att={}
for a in atts: my_att.setdefault(a["student_id"],[]).append(a["check_in_time"] or "")
for s in students:
    ts=[t for t in my_att.get(s["student_id"],[]) if t]
    if ts: s["last_learning_activity_time"]=max(ts,key=lambda x:dt.datetime.strptime(x,"%d/%m/%Y %H:%M"))

# ================= DL14 WOW =================
wows=[]; wow_n=0
def add_wow(s,kind,off=None):
    global wow_n; wow_n+=1
    gv=random.choice(WOWS)
    skill=random.choice(["Speaking (Nói)","Writing (Viết)","Listening (Nghe)","Reading (Đọc)"])
    row={"wow_id":"WOW-%03d"%wow_n,"booking_date":"","student_id":s["student_id"],"student_name":s["full_name"],
         "wow_session_date":"","wow_session_type":random.choice(["academic_support (Hỗ trợ học thuật)","advanced_practice (Luyện nâng cao)","self_booked (HV tự đặt)"]),
         "wow_booked_by":random.choice(["academic_hv (Học vụ)","student (Học viên)","teacher (Giảng viên)"]),
         "wow_skill":skill,"wow_content_focus":random.choice(["Task 2 - opinion essay","Part 2 cue card","Chữa lỗi phát âm ending sounds","Chiến thuật matching headings"]),
         "staff_id":gv[0],"staff_name":gv[1],"wow_status":"booked (Đã đặt)","wow_content_note":"","wow_outcome":"","wow_no_show_reason":"",
         "quota_deducted":"no","sla_content_note_24h":"","notes":"","next_action":""}
    if kind=="done":
        d=NOW-days(random.randint(2,40))
        row.update(booking_date=F(d-days(2)),wow_session_date=F(d),wow_status="completed (Đã hoàn thành)",quota_deducted="yes",
            wow_content_note="Luyện "+skill.split(" ")[0]+", HV nắm được phương pháp",wow_outcome=random.choice(["improved (Tiến bộ rõ rệt)","improved (Tiến bộ rõ rệt)","needs_more (Cần thêm buổi)"]),
            sla_content_note_24h="Đúng hạn")
    elif kind=="done_nonote":
        d=NOW-dt.timedelta(hours=(10 if wow_n%2 else 30))   # 1 còn trong hạn ghi 24h (vàng) + 1 quá hạn (đỏ)
        row.update(booking_date=F(d-days(2)),wow_session_date=F(d),wow_status="completed (Đã hoàn thành)",quota_deducted="yes")
    elif kind=="upcoming":
        d=TODAY+days(off if off is not None else random.randint(1,6)); d=d.replace(hour=random.choice([9,15,19]))
        row.update(booking_date=F(NOW-days(1)),wow_session_date=F(d),wow_status=random.choice(["booked (Đã đặt)","confirmed (Đã xác nhận)"]))
    elif kind=="noshow":
        d=NOW-days(random.randint(3,15))
        row.update(booking_date=F(d-days(2)),wow_session_date=F(d),wow_status="no_show (HV không đến)",quota_deducted="yes",
            wow_no_show_reason=random.choice(["forgot (Quên lịch)","personal (Lý do cá nhân)","no_contact (Không liên lạc được)"]))
    elif kind=="cancelled":
        d=NOW-days(random.randint(3,20))
        row.update(booking_date=F(d-days(3)),wow_session_date=F(d),wow_status="cancelled (Đã hủy)",quota_deducted="no")
    wows.append(row); return row
active=[s for s in students if s["student_status"].startswith("active")]
for _ in range(38): add_wow(random.choice(active),"done")
for _ in range(2): add_wow(random.choice(active),"done_nonote")
for i in range(9): add_wow(random.choice(active),"upcoming",off=(i%6)+1)
# 2 buổi WOW ngay HÔM NAY chưa dạy (1 đã đặt + 1 đã xác nhận, xếp giờ chiều tối)
_w_td1=add_wow(random.choice(active),"upcoming",off=0); _w_td1["wow_session_date"]=F(TODAY+dt.timedelta(hours=17)); _w_td1["wow_status"]="booked (Đã đặt)"
_w_td2=add_wow(random.choice(active),"upcoming",off=0); _w_td2["wow_session_date"]=F(TODAY+dt.timedelta(hours=19)); _w_td2["wow_status"]="confirmed (Đã xác nhận)"
for _ in range(5): add_wow(random.choice(active),"noshow")
for _ in range(3): add_wow(random.choice(active),"cancelled")
# 1 buổi ghi nội dung TRỄ hạn 24h (đã ghi nhưng muộn)
w_late=add_wow(random.choice(active),"done"); w_late["sla_content_note_24h"]="Trễ hạn"; w_late["wow_outcome"]="no_change (Chưa cải thiện)"
# đa dạng người đặt
for w in random.sample(wows,8): w["wow_booked_by"]=random.choice(["sales (NV Tư vấn)","system (Hệ thống tự tạo)"])
# 1 HV DÙNG HẾT quota (demo chặn đặt thêm)
s_ex=random.choice(active)
used0=sum(1 for w in wows if w["student_id"]==s_ex["student_id"] and w["quota_deducted"]=="yes")
for _ in range(max(0,int(s_ex["wow_quota_default"])-used0)):
    w=add_wow(s_ex,"done")
used={}
for w in wows:
    if w["quota_deducted"]=="yes": used[w["student_id"]]=used.get(w["student_id"],0)+1
# 1 HV được duyệt thêm + 1 HV mua thêm quota
extra1=random.choice([s for s in active if s is not s_ex]); extra1["wow_extra_approved"]="2"
extra2=random.choice([s for s in active if s not in (s_ex,extra1)]); extra2["wow_extra_purchased"]="3"
for s in students:
    u=used.get(s["student_id"],0)
    q=int(s["wow_quota_default"])+int(s["wow_extra_approved"] or 0)+int(s["wow_extra_purchased"] or 0)
    s["wow_quota_used"]=str(u); s["wow_quota_remaining"]=str(max(0,q-u))

# ================= DL15 KHẢO SÁT =================
surveys=[]; sv_n=0
def add_survey(s,cid,stype,kind):
    global sv_n; sv_n+=1
    c=next((x for x in CLS if x["class_id"]==cid),{})
    sent=NOW-days({"week_1":30,"week_4":10}.get(stype.split(" ")[0],5))-days(random.randint(0,4))
    row={"survey_id":"SUR-%03d"%sv_n,"student_id":s["student_id"],"student_name":s["full_name"],"class_id":cid,
         "survey_type":stype,"sent_date":F(sent),"submitted_date":"","within_3_days":"","satisfaction_score":"","nps_score":"",
         "progress_perception":"","positive_comments":"","negative_comments":"","suggestions":"","follow_up_needed":"",
         "assigned_staff":random.choice([a[1] for a in ACAD]),"notes":"","next_action":"","class_id_name":c.get("class_name","")}
    if kind=="answered":
        sub=sent+days(random.randint(1,5))
        sat=random.choice([4,4,5,5,3])
        row.update(submitted_date=F(sub),within_3_days="Có" if (sub-sent).days<=3 else "Không",
            satisfaction_score=sat,nps_score=random.choice([7,8,9,10]),progress_perception=random.choice(["Tiến bộ rõ","Ổn định"]),
            positive_comments=random.choice(["GV nhiệt tình","Lộ trình rõ ràng","Lớp vui, sửa bài kỹ"]))
    elif kind=="low":
        sub=sent+days(random.randint(1,4))
        row.update(submitted_date=F(sub),within_3_days="Có" if (sub-sent).days<=3 else "Không",
            satisfaction_score=random.choice([1,2]),nps_score=random.choice([3,4,5]),
            negative_comments=random.choice(["GV nói hơi nhanh","Lớp đông, ít được sửa bài","Giáo trình khó theo kịp"]),follow_up_needed="Có")
    elif kind=="low_handled":
        sub=sent+days(2)
        row.update(submitted_date=F(sub),within_3_days="Có",satisfaction_score=2,nps_score=4,
            negative_comments="Phòng học hơi ồn",follow_up_needed="",notes=F(sent+days(3))+": đã follow-up bởi "+random.choice([a[1] for a in ACAD]))
    elif kind=="waiting":
        row.update(sent_date=F(NOW-days(random.randint(0,2))))
    surveys.append(row)
for cid in ["LOP-IELTS-6.5-04","LOP-IELTS-6.0-12","LOP-IELTS-7.0-02"]:
    for sid in rosters[cid][:8]:
        add_survey(SBY[sid],cid,"week_1 (Tuần 1)","answered")
for cid in ["LOP-IELTS-6.5-04","LOP-IELTS-6.0-12"]:
    for sid in rosters[cid][:4]:
        add_survey(SBY[sid],cid,"week_4 (Tuần 4)","answered")
for i in range(3): add_survey(SBY[rosters[RUN[i]][8 if len(rosters[RUN[i]])>8 else -1]],RUN[i],"week_4 (Tuần 4)","low")
for i in range(2): add_survey(SBY[rosters[RUN[i]][-2]],RUN[i],"week_1 (Tuần 1)","low_handled")
for i in range(5): add_survey(SBY[rosters[RUN[i%len(RUN)]][-1]],RUN[i%len(RUN)],"week_8 (Tuần 8)","waiting")
for cid in ["LOP-IELTS-6.5-04"]:
    for sid in rosters[cid][:4]: add_survey(SBY[sid],cid,"week_8 (Tuần 8)","answered")
for sid in rosters["LOP-IELTS-6.5-03"][:6]:
    add_survey(SBY[sid],"LOP-IELTS-6.5-03","end_of_course (Cuối khóa)","answered")
for v in surveys:
    if v["submitted_date"] and not v["progress_perception"]:
        v["progress_perception"]=random.choice(["Tiến bộ rõ","Ổn định","Chậm hơn kỳ vọng"])

# ================= DL16 + DL17 =================
fbs=[]; fb_n=0
kns=[]; kn_n=0
def add_kn(s,cid,kind,content,ctype="teacher (Về 1 GV cụ thể)",sev="medium (Trung bình)",fb_id=""):
    global kn_n; kn_n+=1
    c=next((x for x in CLS if x["class_id"]==cid),{})
    when={"new_fresh":NOW-dt.timedelta(hours=2),"new_over":NOW-dt.timedelta(hours=30),"assigned":NOW-days(1),
          "inprog":NOW-dt.timedelta(hours=20),"resolved":NOW-days(random.randint(6,20)),"escalated":NOW-days(2)}[kind]
    row={"complaint_id":"KN-2026-%03d"%kn_n,"student_id":s["student_id"],"class_id":cid,"feedback_id":fb_id,
        "complaint_channel":random.choice(["call (Điện thoại)","message (Zalo/Facebook)","direct (Gặp mặt trực tiếp)"]),
        "complaint_time":F(when),"complaint_type":ctype,"complaint_severity":sev,"complaint_content":content,
        "complaint_status":"new (Mới tiếp nhận)","assigned_handler":"","assigned_at":"","resolution_note":"","resolution_time":"",
        "complaint_result":"","student_feedback_after":"","escalated_to":"","sla_status":"","notes":"","next_action":"",
        "student_id_name":s["full_name"],"class_id_name":c.get("class_name","")}
    h=random.choice([a[1] for a in ACAD]+["Phạm Thị Mỹ Tiên"])
    if kind=="assigned": row.update(complaint_status="assigned (Đã phân công)",assigned_handler=h,assigned_at=F(when+dt.timedelta(hours=3)))
    elif kind=="inprog": row.update(complaint_status="in_progress (Đang xử lý)",assigned_handler=h,assigned_at=F(when+dt.timedelta(hours=2)))
    elif kind=="resolved": row.update(complaint_status="resolved (Đã xử lý xong)",assigned_handler=h,assigned_at=F(when+dt.timedelta(hours=2)),
        resolution_note=random.choice(["Đã trao đổi với GV điều chỉnh tốc độ dạy, HV đồng thuận","Sắp xếp học bù 2 buổi + đổi khung giờ","Đã hoàn phí chênh lệch và xin lỗi HV"]),
        resolution_time=F(when+days(2)),complaint_result="accepted (Chấp nhận)")
    elif kind=="escalated": row.update(complaint_status="escalated (Leo thang lên QL cao)",assigned_handler=h,assigned_at=F(when+dt.timedelta(hours=2)),escalated_to="Quản lý cấp cao")
    kns.append(row); return row
def add_fb(s,cid,ftype,kind,content,score=None,cat=None):
    global fb_n; fb_n+=1
    c=next((x for x in CLS if x["class_id"]==cid),{})
    when=NOW-days(random.randint(1,25))
    row={"feedback_id":"FB-2026-%03d"%fb_n,"feedback_time":F(when),"student_id":s["student_id"],"class_id":cid,
        "feedback_channel":random.choice(["survey (Khảo sát có cấu trúc)","message (Tin nhắn)","direct (Trực tiếp)","call (Điện thoại)"]),
        "feedback_type":ftype,"feedback_category":cat or random.choice(FBCATS),
        "feedback_score":score if score is not None else random.choice([4,5]),"feedback_content":content,
        "feedback_status":"new (Mới nhận)","classified_at":"","classified_by":"","feedback_action_note":"","action_taken_at":"",
        "related_complaint_id":"","is_testimonial":"","notes":"","next_action":"","student_id_name":s["full_name"],"class_id_name":c.get("class_name","")}
    if kind=="resolved": row.update(feedback_status="resolved (Đã xử lý xong)",classified_at=F(when+dt.timedelta(hours=4)),classified_by=random.choice([a[1] for a in ACAD]),feedback_action_note="Đã ghi nhận và phản hồi HV",action_taken_at=F(when+days(1)))
    elif kind=="inprog": row.update(feedback_status="in_progress (Đang xử lý)",classified_at=F(when+dt.timedelta(hours=4)),classified_by=random.choice([a[1] for a in ACAD]))
    fbs.append(row); return row
POS=["GV dạy dễ hiểu, chữa bài kỹ","Lớp học vui, tiến bộ thấy rõ","Trợ giảng hỗ trợ nhiệt tình","Đăng ký thi thử được hỗ trợ nhanh"]
FBCATS=["teacher_quality (Chất lượng giảng dạy)","curriculum (Chương trình/giáo trình)","schedule (Lịch học)","service (Thái độ phục vụ)","facility (Cơ sở vật chất)"]
NEU=["Muốn thêm buổi luyện Speaking","Xin thêm tài liệu về collocations","Đề xuất mở lớp cuối tuần"]
NEG=["GV nói nhanh, bạn mới theo không kịp","Điều hòa phòng B hỏng 2 buổi liền","Lịch học đổi đột ngột không báo trước","Bài chấm trả chậm hơn hẹn","Lớp đông hơn cam kết ban đầu"]
for i in range(9):
    r=add_fb(random.choice(active),random.choice(RUN),"positive (Tích cực)","resolved" if i<5 else "new",random.choice(POS))
    if i<3: r["is_testimonial"]="Có"
for i in range(7): add_fb(random.choice(active),random.choice(RUN),"neutral (Trung tính)","inprog" if i<3 else "new",random.choice(NEU),score=3)
negs=[]
for i in range(10):
    kind="new" if i<3 else ("inprog" if i<6 else "resolved")
    negs.append(add_fb(random.choice(active),random.choice(RUN),"negative (Tiêu cực)",kind,NEG[i%len(NEG)],score=random.choice([1,2])))
# khiếu nại (10) + 2 link từ feedback
s_pool=active
add_kn(random.choice(s_pool),RUN[0],"new_fresh","HV phản ánh GV vào trễ 15 phút hai buổi liên tiếp",sev="medium (Trung bình)")
add_kn(random.choice(s_pool),RUN[1],"new_over","Xin chuyển lịch nhưng chưa được phản hồi", ctype="schedule (Lịch học)",sev="low (Thấp)")
add_kn(random.choice(s_pool),RUN[2],"assigned","Phòng học ồn, ảnh hưởng nghe giảng",ctype="other (Khác)")
k_fb1=add_kn(SBY[negs[3]["student_id"]],negs[3]["class_id"],"assigned",negs[3]["feedback_content"],ctype="teacher (Về 1 GV cụ thể)",sev="medium (Trung bình)",fb_id=negs[3]["feedback_id"])
negs[3]["related_complaint_id"]=k_fb1["complaint_id"]; negs[3]["feedback_action_note"]="Chuyển thành khiếu nại "+k_fb1["complaint_id"]
add_kn(random.choice(s_pool),RUN[3],"inprog","Học phí đã đóng nhưng chưa nhận biên nhận",ctype="payment (Thanh toán/học phí)")
k_fb2=add_kn(SBY[negs[4]["student_id"]],negs[4]["class_id"],"inprog",negs[4]["feedback_content"],ctype="schedule (Lịch học)",sev="medium (Trung bình)",fb_id=negs[4]["feedback_id"])
negs[4]["related_complaint_id"]=k_fb2["complaint_id"]; negs[4]["feedback_action_note"]="Chuyển thành khiếu nại "+k_fb2["complaint_id"]
for i in range(3): add_kn(random.choice(s_pool),RUN[(i+2)%len(RUN)],"resolved",random.choice(NEG))
add_kn(random.choice(s_pool),RUN[4],"escalated","Yêu cầu hoàn phí vì đổi GV giữa khóa",ctype="teacher (Về 1 GV cụ thể)",sev="high (Cao)")
# thêm 4 ca phủ nốt: kết quả KHÔNG chấp nhận, chờ HV phản hồi, kênh email, quá hạn high đang xử lý
k_rej=add_kn(random.choice(s_pool),RUN[0],"resolved","Đòi giảm học phí vì nghỉ 2 buổi có phép",ctype="payment (Thanh toán/học phí)")
k_rej.update(complaint_result="rejected (Không chấp nhận)",resolution_note="Theo chính sách, nghỉ có phép được học bù, không giảm phí. Đã giải thích.",student_feedback_after="HV chưa hài lòng nhưng chấp nhận học bù")
k_pd=add_kn(random.choice(s_pool),RUN[1],"resolved","Xin đổi ca học sang tối muộn",ctype="schedule (Lịch học)")
k_pd.update(complaint_result="pending (Chờ phản hồi HV)",resolution_note="Đã đề xuất 2 khung giờ mới, chờ HV chọn",student_feedback_after="")
k_em=add_kn(random.choice(s_pool),RUN[2],"assigned","Email phản ánh app học online lỗi đăng nhập",ctype="other (Khác)")
k_em["complaint_channel"]="email (Email)"
# khiếu nại MỨC CAO đang mở, mới 1-2 ngày (đỏ có chủ đích - demo SLA khiếu nại)
k_hi=add_kn(random.choice(s_pool),RUN[3],"inprog","Sĩ số lớp vượt cam kết, khó tương tác",ctype="service (Thái độ phục vụ)",sev="high (Cao)")
k_hi["complaint_time"]=F(NOW-days(1)-dt.timedelta(hours=8))
# đóng bớt hồ sơ cũ cho dứt điểm: ca "xin chuyển lịch" để lâu -> đã xử lý xong
for _kx in kns:
    if _kx["complaint_content"].startswith("Xin chuyển lịch"):
        _w0=dt.datetime.strptime(_kx["complaint_time"],"%d/%m/%Y %H:%M")
        _kx.update(complaint_status="resolved (Đã xử lý xong)",assigned_handler=random.choice([a[1] for a in ACAD]),
            assigned_at=F(_w0+dt.timedelta(hours=2)),resolution_note="Đã đổi HV sang khung giờ tối T3-5, HV xác nhận học được",
            resolution_time=F(_w0+dt.timedelta(hours=20)),complaint_result="accepted (Chấp nhận)",student_feedback_after="HV hài lòng với lịch mới")

# ================= DL18 KẾT THÚC =================
ces=[]; ce_n=0
def add_ce(s,cid,kind,re_state,idx=0):
    global ce_n; ce_n+=1
    c=next((x for x in CLS if x["class_id"]==cid),{})
    e=enr_of.get(s["student_id"],{})
    L=lead_of.get(s["student_id"],{})
    endd=dt.datetime.strptime(c.get("class_end_date") or FD(NOW-days(20)),"%d/%m/%Y")
    target=float(L.get("target_band","6.0") or 6.0)
    fin=round(random.uniform(target-1.0,target+0.5)*2)/2
    ach="achieved (Đạt mục tiêu)" if fin>=target else ("partially_achieved (Tiến bộ rõ nhưng chưa đủ)" if fin>=target-0.5 else "not_achieved (Không cải thiện đáng kể)")
    row={"course_end_id":"CE-%03d"%ce_n,"student_id":s["student_id"],"enrollment_id":e.get("enrollment_id",""),"class_id":cid,
        "course_completion_time":F(endd+dt.timedelta(hours=18)),"student_status":"completed (Hoàn thành khóa)" if kind=="fin" else "dropped (Bỏ học giữa chừng)",
        "attendance_rate":str(random.randint(78,98))+"%","completion_rate":str(random.randint(80,100))+"%",
        "final_test_score":str(fin) if kind=="fin" else "","final_listening":str(fin) if kind=="fin" else "","final_reading":str(fin) if kind=="fin" else "",
        "final_writing":str(max(1,fin-0.5)) if kind=="fin" else "","final_speaking":str(fin) if kind=="fin" else "",
        "target_band":str(target),"achievement_status":ach if kind=="fin" else "",
        "achievement_note":"","dropout_reason":"" if kind=="fin" else random.choice(["Bận việc gia đình","Chuyển thành phố","Mất động lực học"]),
        "transferred_note":"","next_course_recommendation":"CRS-IELTS-7.0" if kind=="fin" and fin>=6.0 else "",
        "re_enrollment_status":re_state,"re_enrollment_contact_time":"","re_enrollment_note":"","next_enrollment_id":"",
        "testimonial_given":"Có" if kind=="fin" and random.random()<0.3 else "","next_action":"","student_id_name":s["full_name"],"class_id_name":c.get("class_name","")}
    if not re_state.startswith("not_contacted"):
        row["re_enrollment_contact_time"]=F(endd+days(3))
    ces.append(row); return row
fin_students=[SBY[r] for r in rosters["LOP-IELTS-6.5-03"]]+[SBY[r] for r in rosters["LOP-FOUND-01"]]
re2_map={s2["student_id"]:e2 for s2,e2 in re2}
# hồ sơ cũ đóng cho dứt điểm (rejected), hồ sơ đang theo thì mới liên hệ GẦN ĐÂY; giữ đúng 1 ca
# not_contacted làm việc đỏ có chủ đích ở hàng "mời tái ghi danh"
re_states=["contacted (Đã liên hệ)","interested (Quan tâm, chưa quyết định)","contacted (Đã liên hệ)",
           "rejected (Từ chối học tiếp)","rejected (Từ chối học tiếp)","rejected (Từ chối học tiếp)",
           "contacted (Đã liên hệ)","contacted (Đã liên hệ)"]
ri=0
for s in fin_students:
    cid="LOP-IELTS-6.5-03" if s["student_id"] in rosters["LOP-IELTS-6.5-03"] else "LOP-FOUND-01"
    if s["student_id"] in re2_map:
        r=add_ce(s,cid,"fin","confirmed_with_deposit (Đồng ý + có cọc)")
        r["next_enrollment_id"]=re2_map[s["student_id"]]["enrollment_id"]
        r["re_enrollment_note"]="Đã cọc khóa tiếp, vào "+re2_map[s["student_id"]]["course_id_name"]
    else:
        r=add_ce(s,cid,"fin",re_states[ri%len(re_states)]); ri+=1
        if r["re_enrollment_status"].split(" ")[0] in ("contacted","interested"):
            r["re_enrollment_contact_time"]=F(NOW-dt.timedelta(hours=random.randint(4,40)))
for kind,s,cid in sp:
    if kind=="drop": add_ce(s,cid,"drop","not_contacted (Chưa LH)")
    elif kind=="trans":
        r=add_ce(s,cid,"drop","not_contacted (Chưa LH)")
        r.update(student_status="transferred (Bảo lưu/chuyển khóa)",dropout_reason="",
            transferred_note="Bảo lưu vì lịch công tác/việc gia đình, hẹn quay lại trước "+str(s.get("pause_until") or FD(TODAY+days(60))),
            re_enrollment_status="contacted (Đã liên hệ)",re_enrollment_contact_time=F(NOW-days(3)))
for r in ces:
    if r["achievement_status"].startswith("achieved") and not r["achievement_note"]: r["achievement_note"]="Vượt mục tiêu, giới thiệu lộ trình nâng band"
    if r["achievement_status"].startswith("not_") : r["achievement_note"]="Đề xuất học lại 50% học phí theo chính sách cam kết"
# C-07: testimonial CHỈ khi có final_test_score. HV đạt mục tiêu đa số đã xin cảm nhận xong,
# chừa đúng 1 ca chưa xin (việc "xin cảm nhận" trên chuông có 1 dòng, không réo tràn).
_ach=[r for r in ces if r["achievement_status"].startswith("achieved") and str(r["final_test_score"]).strip()]
for r in ces:
    if not str(r["final_test_score"]).strip(): r["testimonial_given"]=""
for _i,r in enumerate(_ach):
    r["testimonial_given"]="" if _i==len(_ach)-1 else "Có"
# hồ sơ HV đầy đặn: liên hệ khẩn, email, ghi chú theo dõi
REL=["Ông","Bà","Bố","Mẹ","Anh","Chị","Người giám hộ"]  # danh sách anh Luân chốt 30/07
for s in students:
    if random.random()<0.65:
        s["emergency_contact_name"]="Người nhà "+s["full_name"].split()[-1]
        s["emergency_contact_phone"]=phone(); s["emergency_contact_relation"]=random.choice(REL)
    if random.random()<0.55:
        s["email"]=("hv"+s["student_id"][-3:]+"@gmail.com")
    if "at_risk" in s["attendance_progress_status"]+s["academic_progress_status"]:
        s["learning_followup_note"]=F(NOW-days(random.randint(1,5)))+": đã gọi nhắc, HV hứa đi học lại từ tuần sau"

# ================= PASS 2: LẤP ĐẦY CỘT NHẬP + next_action HIỂN THỊ =================
ADDR=["Q.1, TP.HCM","Q.3, TP.HCM","Q.7, TP.HCM","TP. Thủ Đức","Q. Bình Thạnh","Q. Gò Vấp","Q. Tân Bình","TP. Biên Hòa","TP. Thủ Dầu Một"]
LEADNOTE=["Quan tâm khóa "+random.choice(["6.0","6.5"]),"Vừa để lại SĐT trên form","Bạn của HV cũ giới thiệu","Hỏi học phí và lịch tối","Muốn học cấp tốc trước khi du học","So sánh với trung tâm khác, cần theo sát"]
for L in leads:
    if not L["lead_note"] and random.random()<0.72: L["lead_note"]=random.choice(LEADNOTE)
for t in tests:
    if isc_bk:=t["booking_status"].startswith("booked"):
        if not t["booking_note"] and random.random()<0.35: t["booking_note"]="Đã nhắn Zalo xác nhận lịch, dặn mang bút chì"
for c in cons_rows:
    if c["consultation_status"].startswith("consulted") and not c["consultation_note"]:
        c["consultation_note"]=random.choice(["Tư vấn lộ trình theo KQ test, HV ưu tiên lịch tối","Phân tích điểm yếu Writing, đề xuất kèm WOW","Trao đổi với phụ huynh về cam kết đầu ra"])
    if c["conversion_status"].startswith("interested") and not c["conversion_note"]:
        c["conversion_note"]="Hẹn chốt sau khi bàn với gia đình"
for e in enrs:
    if not e["notes"] and random.random()<0.15: e["notes"]="Giữ chỗ lớp tối, đã gửi hợp đồng học vụ"
for o in obs:
    if o["onboarding_status"].startswith("completed") and not o["onboarding_note"] and random.random()<0.65:
        o["onboarding_note"]=random.choice(["Đã vào nhóm Zalo lớp, nhận giáo trình","Đã nhận thẻ HV + tài khoản LMS","Phụ huynh xác nhận lịch đưa đón"])
for s in students:
    if not s["address"] and random.random()<0.75: s["address"]=random.choice(ADDR)
    if not s["notes"] and random.random()<0.45: s["notes"]=random.choice(["Mục tiêu du học Úc 2027","Ưu tiên GV nữ","Hay đi công tác, cần học bù linh hoạt","Phụ huynh muốn nhận báo cáo hằng tháng","Đã học nền tảng ở trung tâm khác"])
for h in hws:
    if not h["notes"] and random.random()<0.08: h["notes"]="HV xin nộp lại bản sửa"
for w in wows:
    if not w["notes"] and random.random()<0.15: w["notes"]="HV chủ động xin thêm bài luyện"
for v in surveys:
    if v["submitted_date"]:
        if not v["suggestions"] and random.random()<0.5: v["suggestions"]=random.choice(["Mở thêm lớp cuối tuần","Thêm buổi luyện Speaking","Gửi tài liệu trước buổi học"])
        if not v["negative_comments"] and random.random()<0.2: v["negative_comments"]="Phòng hơi nhỏ khi lớp đông"
for f in fbs:
    if not f["notes"] and random.random()<0.2: f["notes"]="Đã báo GV chủ nhiệm nắm thông tin"
for kkn in kns:
    if not kkn["notes"] and random.random()<0.3: kkn["notes"]="Ưu tiên xử lý trong tuần"
    if kkn["complaint_status"].startswith("resolved") and kkn["complaint_result"].startswith("accepted") and not kkn["student_feedback_after"]:
        kkn["student_feedback_after"]="HV hài lòng với hướng xử lý"
for r in ces:
    st_=r["re_enrollment_status"]
    if not r["re_enrollment_note"]:
        if st_.startswith("contacted"): r["re_enrollment_note"]="Đã gọi giới thiệu khóa tiếp, hẹn phản hồi cuối tuần"
        elif st_.startswith("interested"): r["re_enrollment_note"]="Quan tâm khóa 7.0, chờ lịch khai giảng"
        elif st_.startswith("rejected"): r["re_enrollment_note"]="Tạm dừng vì đi du học/công tác"
# next_action hiển thị cho v3 (trên sheet cột này là ARRAYFORMULA tự tính, seed bỏ qua)
for t in tests:
    bs=t["booking_status"];att=t["test_attendance_status"]
    if bs.startswith("pending"): t["next_action"]="Gọi chốt lịch test trong hôm nay (slaTestBookedRemind_hours)."
    elif bs.startswith("rejected"): t["next_action"]="Khách từ chối test - chuyển tư vấn thẳng lộ trình."
    elif bs.startswith("cancelled"): t["next_action"]="Liên hệ đặt lại lịch test mới cho khách."
    elif att.startswith("no_show"): t["next_action"]="Gọi hỏi lý do vắng + hẹn lại lịch test."
    elif att and t["test_status"].startswith("pending"): t["next_action"]="Chấm bài + trả kết quả trong 48h (slaGLA_hours)."
    elif t["test_status"].startswith("graded") and t["post_test_status"].startswith("awaiting"): t["next_action"]="Đặt lịch tư vấn kết quả với khách."
    elif not att: t["next_action"]="Nhắc lịch test trước 1 ngày qua Zalo."
    else: t["next_action"]=""
for c in cons_rows:
    if c["consultation_status"].startswith("not_"): c["next_action"]="Tư vấn lộ trình theo KQ test (slaCVT_hours)."
    elif c["conversion_status"].startswith("interested"): c["next_action"]="Theo đuổi chốt cọc trong 3 ngày."
    elif c["conversion_status"].startswith("undecided"): c["next_action"]="Gửi bảng học phí + ưu đãi, hẹn phản hồi."
    else: c["next_action"]=""
for e in enrs:
    rem=int(e["remaining_amount"] or 0)
    if "cancel" in e["enrollment_status"]: e["next_action"]="Xử lý hoàn tiền theo mốc CH2 (nếu chưa)."
    elif int(e["discount_amount"] or 0)>=1000000 and not e["discount_approved_by"]: e["next_action"]="Trình quản lý duyệt chiết khấu."
    elif rem>0: e["next_action"]="Nhắc thu "+format(rem,",").replace(",",".")+"đ còn lại."
    else: e["next_action"]=""
for o in obs:
    stt=o["onboarding_status"]
    if o["class_confirmation_status"].startswith("rejected"): o["next_action"]="HV từ chối lớp - đổi lớp khác phù hợp."
    elif o["class_id"] and not o["class_info_sent_at"]: o["next_action"]="Gửi thông tin lớp qua Zalo trong 24h."
    elif o["class_info_sent_at"] and not o["confirmation_time"]: o["next_action"]="Chờ HV xác nhận lớp - nhắc sau 24h."
    elif not stt.startswith("completed"): o["next_action"]="Hoàn tất onboarding (nhóm lớp, giáo trình, LMS)."
    else: o["next_action"]=""
for srow in sessions:
    ss=srow["session_status"]
    if ss.startswith("scheduled"): srow["next_action"]="Chuẩn bị giáo án + điểm danh khi vào lớp."
    elif ss.startswith("in_progress"): srow["next_action"]="Điểm danh + ghi giờ kết thúc khi xong buổi."
    elif ss.startswith("completed") and not srow["teacher_note_summary"]: srow["next_action"]="Bổ sung ghi chú buổi dạy (SLA 24h)."
    else: srow["next_action"]=""
for h in hws:
    hs=h["homework_status"]
    if hs.startswith("assigned"): h["next_action"]="Thu bài khi đến hạn "+h["homework_due_date"]+"."
    elif hs.startswith("submitted") and not str(h["graded_at"]).strip(): h["next_action"]="Chấm bài trong 48h (slaHomeworkGrading_hours)."
    elif hs.startswith("missing"): h["next_action"]="Nhắc HV nộp bù + báo học vụ nếu tái diễn."
    else: h["next_action"]=""
for w in wows:
    ws_=w["wow_status"]
    if ws_.startswith("booked"): w["next_action"]="Xác nhận buổi với HV + GV."
    elif ws_.startswith("confirmed"): w["next_action"]="Dạy buổi theo trọng tâm đã hẹn."
    elif ws_.startswith("completed") and not w["wow_content_note"]: w["next_action"]="Ghi nội dung buổi trong 24h (slaWowNote_hours)."
    elif ws_.startswith("no_show"): w["next_action"]="Liên hệ HV sắp xếp lại buổi (không trừ thêm quota)."
    else: w["next_action"]=""
for v in surveys:
    if not v["submitted_date"]: v["next_action"]="Nhắc HV trả lời khảo sát (trong 3 ngày)."
    elif str(v["follow_up_needed"]).strip()=="Có": v["next_action"]="Gọi follow-up điểm chưa hài lòng trong 24h."
    else: v["next_action"]=""
for f in fbs:
    fs_=f["feedback_status"]
    if fs_.startswith("new"): f["next_action"]="Phân loại + tiếp nhận phản hồi."
    elif fs_.startswith("in_progress"): f["next_action"]="Xử lý và phản hồi lại học viên."
    else: f["next_action"]=""
for kkn in kns:
    ks_=kkn["complaint_status"]
    if ks_.startswith("new"): kkn["next_action"]="Nhận xử lý theo SLA mức độ ("+kkn["complaint_severity"].split(" ")[0]+")."
    elif ks_.startswith("assigned"): kkn["next_action"]="Bắt đầu xử lý + liên hệ HV."
    elif ks_.startswith("in_progress"): kkn["next_action"]="Chốt phương án + đóng khiếu nại."
    elif ks_.startswith("escalated"): kkn["next_action"]="Quản lý cấp cao ra quyết định cuối."
    else: kkn["next_action"]=""
for r in ces:
    st_=r["re_enrollment_status"]
    if not str(r["final_test_score"]).strip() and "completed" in r["student_status"]: r["next_action"]="Nhập kết quả đầu ra trong 3 ngày (slaFinalTest_days)."
    elif st_.startswith("not_contacted"): r["next_action"]="Mời tái ghi danh trong cửa sổ ưu đãi."
    elif st_.startswith("contacted") or st_.startswith("interested"): r["next_action"]="Theo đuổi chốt tái ghi danh."
    else: r["next_action"]=""

# ================= XUẤT =================
dl_new={"DL01":STAFF,"DL02":leads,"DL02b":tps,"DL03":tests,"DL04":cons_rows,"DL05":COURSES,"DL06":enrs,"DL07":pays,
        "DL08":obs,"DL09":students,"DL10":CLS,"DL11":sessions,"DL12":atts,"DL13":hws,"DL14":wows,"DL15":surveys,
        "DL16":fbs,"DL17":kns,"DL18":ces}
out={"dl":dl_new,"enums":old.get("enums"),"config":old.get("config")}

# ---------- KIỂM ĐỊNH ----------
err=[]
def chk(cond,msg):
    if not cond: err.append(msg)
pkmap={"DL02":"lead_id","DL02b":"touchpoint_id","DL03":"test_booking_id","DL04":"consultation_id","DL06":"enrollment_id","DL07":"payment_id","DL08":"onboarding_id","DL09":"student_id","DL11":"session_id","DL12":"attendance_id","DL13":"homework_id","DL14":"wow_id","DL15":"survey_id","DL16":"feedback_id","DL17":"complaint_id","DL18":"course_end_id"}
for k,pk in pkmap.items():
    ids=[r[pk] for r in dl_new[k]]
    chk(len(ids)==len(set(ids)),k+" trùng PK")
lead_ids={L["lead_id"] for L in leads}; stu_ids={s["student_id"] for s in students}
cls_ids={c["class_id"] for c in CLS}; ses_ids={s["session_id"] for s in sessions}; enr_ids={e["enrollment_id"] for e in enrs}
for t in tps: chk(t["lead_id"] in lead_ids,"TP lead?")
for t in tests: chk(t["lead_id"] in lead_ids,"TB lead?")
for c in cons_rows: chk(c["lead_id"] in lead_ids,"CS lead?")
for e in enrs: chk(e["lead_id"] in lead_ids,"ENR lead?")
for p in pays: chk(p["enrollment_id"] in enr_ids,"PAY enr?")
for o in obs:
    chk(o["student_id"] in stu_ids,"OB stu?")
    if o["class_id"]: chk(o["class_id"] in cls_ids,"OB cls?")
for a in atts:
    chk(a["session_id"] in ses_ids,"AT ses? "+a["session_id"]); chk(a["student_id"] in stu_ids,"AT stu?")
for h in hws: chk(h["class_id"] in cls_ids and h["student_id"] in stu_ids and h["session_id"] in ses_ids,"HW fk?")
for w in wows: chk(w["student_id"] in stu_ids,"WOW stu?")
for v in surveys: chk(v["student_id"] in stu_ids,"SUR stu?")
for f in fbs: chk(f["student_id"] in stu_ids,"FB stu?")
for kkn in kns: chk(kkn["student_id"] in stu_ids,"KN stu?")
for e in enrs:
    paid=sum(p["amount"] for p in pays if p["enrollment_id"]==e["enrollment_id"])
    chk(paid==int(e["paid_amount"]),"ENR paid lệch "+e["enrollment_id"])
    chk(int(e["paid_amount"])+int(e["remaining_amount"])==int(e["final_fee"]) or e["payment_status"].startswith("refunded"),"ENR balance "+e["enrollment_id"])
for L in leads:
    chk(int(L["contact_count"])==sum(1 for t in tps if t["lead_id"]==L["lead_id"]),"lead count "+L["lead_id"])
# feature coverage
def cnt(pred,arr): return sum(1 for x in arr if pred(x))
cov={
 "duyet_pending":cnt(lambda e:int(e["discount_amount"])>=1000000 and not e["discount_approved_by"],enrs),
 "refund_queue":cnt(lambda e:("cancelled" in e["enrollment_status"] or e["cancellation_reason"]) and "hoàn tiền" not in str(e["notes"]).lower(),enrs),
 "unverified":cnt(lambda p:not p["verified_by"],pays),
 "sess_upcoming7":cnt(lambda s:s["session_status"].startswith("scheduled") and TODAY<=dt.datetime.strptime(s["session_date"],"%d/%m/%Y %H:%M")<TODAY+days(7),sessions),
 "test_upcoming7":cnt(lambda t:t["booking_status"].startswith("booked") and t["test_date"] and not t["test_attendance_status"] and TODAY<=dt.datetime.strptime(t["test_date"],"%d/%m/%Y %H:%M")<TODAY+days(7),tests),
 "wow_upcoming7":cnt(lambda w:w["wow_status"].split(" ")[0] in("booked","confirmed") and TODAY<=dt.datetime.strptime(w["wow_session_date"],"%d/%m/%Y %H:%M")<TODAY+days(7) if w["wow_session_date"] else False,wows),
 "call_upcoming7":cnt(lambda L:L["next_followup_time"] and TODAY<=dt.datetime.strptime(L["next_followup_time"],"%d/%m/%Y %H:%M")<TODAY+days(7) and L["lead_status"].split(" ")[0] in("new","contacted","considering"),leads),
 "hw_cho_cham":cnt(lambda h:h["homework_status"].split(" ")[0] in("submitted_on_time","submitted_late") and not h["graded_at"],hws),
 "hw_chua_thu":cnt(lambda h:h["homework_status"].startswith("assigned"),hws),
 "ob_need_send":cnt(lambda o:o["class_id"] and not o["class_info_sent_at"] and not o["onboarding_status"].startswith("completed"),obs),
 "ob_rejected":cnt(lambda o:o["class_confirmation_status"].startswith("rejected"),obs),
 "sv_followup":cnt(lambda v:str(v["follow_up_needed"]).strip()=="Có",surveys),
 "fb_neg_new":cnt(lambda f:f["feedback_type"].startswith("negative") and f["feedback_status"].startswith("new"),fbs),
 "kn_link":cnt(lambda f:f["related_complaint_id"],fbs),
 "wow_nonote":cnt(lambda w:w["wow_status"].startswith("completed") and not w["wow_content_note"],wows),
 "risk_students":cnt(lambda s:"at_risk" in s["attendance_progress_status"]+s["academic_progress_status"] or "off_track" in s["attendance_progress_status"]+s["academic_progress_status"],students),
}
cov.update({
 "test_late":cnt(lambda t:"late" in t["test_attendance_status"],tests),
 "test_cancelled":cnt(lambda t:"cancelled" in t["booking_status"],tests),
 "test_refused":cnt(lambda t:"rejected" in t["booking_status"],tests),
 "sess_inprog":cnt(lambda s:"in_progress" in s["session_status"],sessions),
 "sess_cancelled":cnt(lambda s:"cancelled" in s["session_status"],sessions),
 "gv_note_sla":cnt(lambda s:s["teacher_note_within_sla"]!="",sessions),
 "installment":cnt(lambda p:"installment" in p["payment_method"],pays),
 "fee_gd":cnt(lambda p:int(p["transaction_fee"] or 0)>0,pays),
 "quota_het":cnt(lambda s:s["wow_quota_remaining"]=="0" and s["student_status"].startswith("active"),students),
 "quota_extra":cnt(lambda s:int(s["wow_extra_approved"] or 0)+int(s["wow_extra_purchased"] or 0)>0,students),
 "wow_note_tre":cnt(lambda w:w["sla_content_note_24h"]=="Trễ hạn",wows),
 "kn_rejected_result":cnt(lambda x:"rejected" in x["complaint_result"],kns),
 "kn_pending_result":cnt(lambda x:"pending" in x["complaint_result"],kns),
 "ce_transferred":cnt(lambda r:"transferred" in r["student_status"],ces),
 "ce_end_survey":cnt(lambda v:"end_of_course" in v["survey_type"],surveys),
 "ob_over_info":cnt(lambda o:o["class_id"] and not o["class_info_sent_at"] and not o["onboarding_status"].startswith("completed") and (NOW-dt.datetime.strptime(o["assigned_at"],"%d/%m/%Y %H:%M")).total_seconds()>24*3600,obs),
 "emerg_contact":cnt(lambda s:s["emergency_contact_phone"]!="",students),
 "unqualified":cnt(lambda L:"unqualified" in L["lead_qualification_status"],leads),
 "handover_hist":cnt(lambda L:L["view_history"],leads),
 "handover_tam":cnt(lambda L:L["handover_until"],leads),
 "doi_lop":cnt(lambda o:int(o["placement_change_count"] or 0)>0,obs),
})
for k,mn in [("duyet_pending",3),("refund_queue",2),("unverified",4),("sess_upcoming7",5),("test_upcoming7",5),("wow_upcoming7",5),("call_upcoming7",10),("hw_cho_cham",8),("hw_chua_thu",8),("ob_need_send",1),("ob_rejected",1),("sv_followup",2),("fb_neg_new",2),("kn_link",2),("wow_nonote",2),("risk_students",3),
 ("test_late",2),("test_cancelled",2),("test_refused",2),("sess_inprog",1),("sess_cancelled",2),("gv_note_sla",20),("installment",2),("fee_gd",2),("quota_het",1),("quota_extra",2),("wow_note_tre",1),("kn_rejected_result",1),("kn_pending_result",1),("ce_transferred",2),("ce_end_survey",4),("ob_over_info",1),("emerg_contact",30),("unqualified",5),("handover_hist",8),("handover_tam",4),("doi_lop",4)]:
    chk(cov[k]>=mn,"coverage %s=%d < %d"%(k,cov[k],mn))
print("COVERAGE:",json.dumps(cov,ensure_ascii=False))
tot=sum(len(v) for v in dl_new.values())
print("TỔNG:",tot,"dòng |",{k:len(v) for k,v in dl_new.items()})
if err:
    print("LỖI KIỂM ĐỊNH:",len(err));[print(" -",e) for e in err[:20]]
    raise SystemExit(1)
json.dump(out,open(P,"w",encoding="utf-8"),ensure_ascii=False)
print("OK -> demo_data_big.json (sạch, neo",FD(TODAY),")")
