# -*- coding: utf-8 -*-
"""
Sinh 2 bảng mới cho app:

  DL20 · KHO BÀI TẬP   - bài tập dùng lại được, có mô tả/kỹ năng/độ khó/tệp đính kèm
  DL21 · GIÁO ÁN KHÓA  - mỗi KHÓA HỌC quy định sẵn từng buổi: chủ đề, bài tập mặc định,
                         lời dặn dò mặc định. MỌI LỚP thuộc khóa đó dùng chung quy tắc này.

Giáo viên vẫn đổi được ở từng lớp/từng buổi: ghi đè vào DL11.hw_bank_id / DL11.prep_note
(để trống = dùng mặc định của khóa).

THỨ TỰ CHẠY: gen_demo.py -> seed_giaoan.py -> mkdemo.py -> gen_v5.py
"""
import json, os

P = os.path.join(os.path.dirname(os.path.abspath(__file__)), "demo_data_big.json")
d = json.load(open(P, encoding="utf-8"))
dl = d["dl"]

# ---------------- DL20 · KHO BÀI TẬP ----------------
BANK = [
    # (kỹ năng, tên bài, độ khó, mô tả, phút)
    ("Listening (Nghe)",  "Listening dictation Unit 5",            "Cơ bản",   "Nghe chép chính tả 10 câu, tập bắt âm cuối và số nhiều.", 25),
    ("Listening (Nghe)",  "Listening Section 3 - Cam 18",          "Trung bình","Nghe hội thoại học thuật, luyện bắt từ khóa đồng nghĩa.", 30),
    ("Listening (Nghe)",  "Listening Map labelling",               "Trung bình","Dạng bài điền bản đồ, luyện từ chỉ phương hướng.", 30),
    ("Reading (Đọc)",     "Reading TF/NG - Cam 17",                "Trung bình","Phân biệt False và Not Given, giải thích lý do chọn.", 35),
    ("Reading (Đọc)",     "Reading passage - Matching headings",   "Trung bình","Nối tiêu đề đoạn, tập đọc lướt lấy ý chính.", 35),
    ("Reading (Đọc)",     "Reading - Summary completion",          "Nâng cao", "Điền tóm tắt, chú ý giới hạn số từ.", 30),
    ("Writing (Viết)",    "Writing Task 1 - Line graph",           "Trung bình","Mô tả xu hướng, viết mở bài + tổng quan + 2 đoạn thân.", 45),
    ("Writing (Viết)",    "Writing Task 1 - Process",              "Nâng cao", "Mô tả quy trình, luyện câu bị động và từ nối trình tự.", 45),
    ("Writing (Viết)",    "Writing Task 2 - Opinion essay",        "Nâng cao", "Bài luận nêu quan điểm, đủ 4 đoạn, tối thiểu 250 từ.", 60),
    ("Speaking (Nói)",    "Speaking Part 1 - Hobbies record",      "Cơ bản",   "Ghi âm trả lời 6 câu Part 1, mỗi câu 2-3 câu trả lời.", 20),
    ("Speaking (Nói)",    "Speaking Part 2 - Describe a person",   "Trung bình","Ghi âm nói 2 phút theo cue card, có 1 phút chuẩn bị.", 25),
    ("Speaking (Nói)",    "Speaking Part 3 - Mở rộng lập luận",    "Nâng cao", "Luyện trả lời dài, có ví dụ và lý do.", 30),
    ("Grammar (Ngữ pháp)","Grammar - Conditionals worksheet",      "Cơ bản",   "Ôn 3 loại câu điều kiện, 30 câu trắc nghiệm + 5 câu viết lại.", 30),
    ("Grammar (Ngữ pháp)","Grammar - Passive voice drill",         "Cơ bản",   "Chuyển câu chủ động sang bị động, tập dùng trong Writing Task 1.", 25),
    ("Vocabulary (Từ vựng)","Vocabulary - Topic Environment",      "Trung bình","Học 25 từ chủ đề môi trường, đặt câu với 10 từ.", 30),
    ("Vocabulary (Từ vựng)","Vocabulary - Collocations for Task 2","Nâng cao", "Cụm từ hay dùng trong bài luận, áp dụng vào 1 đoạn văn.", 30),
]
dl["DL20"] = []
for i, (skill, title, lv, desc, mins) in enumerate(BANK, 1):
    dl["DL20"].append({
        "hw_bank_id": "HWB-" + str(i).zfill(3), "title": title, "skill": skill,
        "level": lv, "description": desc, "est_minutes": mins,
        "file_link": "", "created_by": "Học vụ", "status": "active (Đang dùng)",
    })
BY = {r["title"]: r["hw_bank_id"] for r in dl["DL20"]}

# ---------------- DL21 · GIÁO ÁN KHÓA ----------------
# Vòng lặp 8 buổi cho mọi khóa: mỗi buổi có chủ đề + bài mặc định + lời dặn mặc định
# + HẠN NỘP mặc định (số ngày sau buổi học). Bài viết cho hạn dài hơn bài ngữ pháp.
CYCLE = [
    ("Listening - bắt ý chính",      "Listening dictation Unit 5",
     "Trước buổi: nghe lại Unit 5 một lượt, ghi ra 5 từ nghe không rõ để hỏi trên lớp.", 3),
    ("Reading - skimming & scanning", "Reading passage - Matching headings",
     "Trước buổi: đọc trước bài đọc trong giáo trình, gạch chân câu chủ đề mỗi đoạn.", 3),
    ("Writing Task 1 - biểu đồ",     "Writing Task 1 - Line graph",
     "Trước buổi: xem lại từ vựng mô tả xu hướng (increase, decline, fluctuate...).", 5),
    ("Speaking Part 1 - trả lời tự nhiên", "Speaking Part 1 - Hobbies record",
     "Trước buổi: chuẩn bị 3 chủ đề bản thân (sở thích, quê quán, công việc) để nói thử.", 4),
    ("Ngữ pháp trọng tâm",           "Grammar - Conditionals worksheet",
     "Trước buổi: ôn lại 3 loại câu điều kiện, mang theo lỗi sai buổi trước để chữa.", 2),
    ("Listening - dạng bài khó",     "Listening Section 3 - Cam 18",
     "Trước buổi: nghe 1 lần Section 3 bất kỳ, tự chấm để biết mình yếu chỗ nào.", 3),
    ("Reading - True/False/Not Given","Reading TF/NG - Cam 17",
     "Trước buổi: xem lại quy tắc phân biệt False và Not Given.", 3),
    ("Writing Task 2 - luận điểm",   "Writing Task 2 - Opinion essay",
     "Trước buổi: chọn 1 đề Task 2 và lập dàn ý 4 đoạn, mang lên lớp chữa.", 6),
]
MAXSES = 40   # lịch lớp nay kéo dài hơn (buổi tương lai 1-3 tuần) - giáo án phủ tới buổi 40
dl["DL21"] = []
pid = 0
for c in dl["DL05"]:
    cid = c["course_id"]
    for sn in range(1, MAXSES + 1):
        topic, title, note, dued = CYCLE[(sn - 1) % len(CYCLE)]
        pid += 1
        dl["DL21"].append({
            "plan_id": "GA-" + str(pid).zfill(4), "course_id": cid,
            "course_id_name": c.get("course_name", ""), "session_number": sn,
            "topic": topic, "hw_bank_id": BY.get(title, ""), "hw_title": title,
            "prep_note": note, "due_days": dued, "materials_link": "",
        })

# ---------------- DL11: thêm chỗ GHI ĐÈ theo lớp/buổi ----------------
for s in dl.get("DL11", []):
    s.setdefault("hw_bank_id", "")   # trống = dùng bài mặc định của khóa
    s.setdefault("prep_note", "")    # trống = dùng lời dặn mặc định của khóa
    s.setdefault("hw_due_days", "")  # trống = dùng hạn nộp mặc định của khóa

# vài buổi được giáo viên chỉnh riêng cho sinh động
tweaks = {1: ("HWB-009", "Lớp mình yếu Task 2 nên buổi này đổi sang luyện viết luận. Mang laptop nhé.", 7),
          3: ("", "Buổi này có kiểm tra nhanh 15 phút đầu giờ, ôn lại từ vựng tuần trước.", ""),
          5: ("HWB-012", "", 2)}
byc = {}
for s in dl.get("DL11", []):
    byc.setdefault(s.get("class_id"), []).append(s)
for cid, ss in byc.items():
    ss.sort(key=lambda x: float(x.get("session_number") or 0))
    for idx, (hb, note, dued) in tweaks.items():
        if idx <= len(ss):
            if hb: ss[idx - 1]["hw_bank_id"] = hb
            if note: ss[idx - 1]["prep_note"] = note
            if dued: ss[idx - 1]["hw_due_days"] = dued

json.dump(d, open(P, "w", encoding="utf-8"), ensure_ascii=False)
print(f"DL20 kho bai tap : {len(dl['DL20'])} bai")
print(f"DL21 giao an khoa: {len(dl['DL21'])} dong ({len(dl['DL05'])} khoa x {MAXSES} buoi)")
print(f"DL11 them cot hw_bank_id + prep_note cho {len(dl.get('DL11', []))} buoi")
print("DA GHI", P)
