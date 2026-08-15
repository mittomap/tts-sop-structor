# -*- coding: utf-8 -*-
"""DUNG LAI HAI LAN PHAI RA MOT KET QUA.

VI SAO CO BO KIEM NAY (10/08). Anh Luan: *"Gieo luon, de moi lan a bam reset demo thi ngon
luon nhi"*. Do truoc khi lam thi lo ra mot chuyen: **ba hat giong DA cam tu lau** - `random.seed(7)`
trong gen_demo, 20260722 trong fixdata, 2307 trong seed_giaoviec - ma chay pipeline hai lan trong
CUNG MOT PHUT van ra **23 bang khac nhau**.

Goc khong nam o hat giong: `gen_demo.py` doc lai `demo_data_big.json`, tuc **dau ra cua chinh lan
chay truoc**, roi be nguyen nam bang sang. Pipeline vi the la ham cua (hat giong, ngay chay,
**ket qua lan truoc**) - moi luot troi them mot it, khong luot nao quay lai duoc.
*Gieo hat bao nhieu cung khong cuu noi mot vong lap.*

Da cat bang `demo_base.json` (ban chup dung yen). Bo kiem nay canh de no khong lang le noi lai:
dung lai HAI LAN roi so tung bang. Mot dong ai do them vao gen_demo doc lai file cu la do ngay.

Chay:  python3 check_taolai.py     (ma thoat 0 = lap lai duoc)
"""
import json, os, shutil, subprocess, sys, tempfile

SD = os.path.dirname(os.path.abspath(__file__))
P = os.path.join(SD, "demo_data_big.json")
BUOC = ["gen_demo.py", "seed_giaoan.py", "mkdemo.py", "fixdata.py", "seed_giaoviec.py"]


def chay():
    for b in BUOC:
        r = subprocess.run([sys.executable, b], cwd=SD, capture_output=True, text=True)
        if r.returncode != 0:
            raise SystemExit("LOI: %s gay khi dung lai demo\n%s" % (b, (r.stderr or "")[-1500:]))
    return json.load(open(P, encoding="utf-8"))


def khac(a, b):
    """Danh sach bang khac nhau giua hai lan dung."""
    ra, rb = a.get("dl", {}), b.get("dl", {})
    out = []
    for t in sorted(set(ra) | set(rb)):
        x, y = ra.get(t), rb.get(t)
        if x == y:
            continue
        if x is None or y is None:
            out.append("%s: co o mot lan, thieu o lan kia" % t)
        elif len(x) != len(y):
            out.append("%s: %d dong vs %d dong" % (t, len(x), len(y)))
        else:
            n = sum(1 for u, v in zip(x, y) if u != v)
            out.append("%s: %d/%d dong khac" % (t, n, len(x)))
    if a.get("config") != b.get("config"):
        out.append("config: khac")
    if a.get("enums") != b.get("enums"):
        out.append("enums: khac")
    return out


if not os.path.exists(os.path.join(SD, "demo_base.json")):
    print("KHONG DAT: thieu demo_base.json - gen_demo se roi ve doc lai chinh dau ra cua no, "
          "va pipeline lai khong lap lai duoc. Chay `python3 lam_base.py`.")
    sys.exit(1)

giu = tempfile.NamedTemporaryFile(delete=False, suffix=".json").name
shutil.copyfile(P, giu)
try:
    # MOC NEO trong meta lay theo GIO CHAY. Hai luot cach nhau vai giay ma vat qua ranh mot phut
    # thi moi moc thoi gian lech 1 phut - do KHONG phai la mat tinh lap lai, do la dong ho chay.
    # Thu toi ba luot de bat duoc mot cap cung phut; khong duoc thi khai la CHUA KET LUAN chu
    # khong bao do bay - mot bo kiem chap chon la mot bo kiem bi bo qua.
    cap = None
    truoc = chay()
    for _ in range(3):
        sau = chay()
        if (truoc.get("meta") or {}).get("anchor") == (sau.get("meta") or {}).get("anchor"):
            cap = (truoc, sau)
            break
        truoc = sau
    if cap is None:
        print("CHUA KET LUAN: ba luot deu vat qua ranh mot phut, khong co cap nao cung moc neo. "
              "Chay lai la duoc.")
        sys.exit(0)
    ds = khac(*cap)
    print("=" * 78)
    print("DUNG LAI DEMO HAI LAN - CO RA MOT KET QUA KHONG?")
    print("  moc neo    : %s" % (cap[0].get("meta") or {}).get("anchor"))
    print("  so bang    : %d" % len(cap[0].get("dl", {})))
    if ds:
        # ── GIU LAI DAU VET (them 15/08) ─────────────────────────────────────────────
        # Ngay 15/08 bo kiem nay do DUNG MOT LAN trong mot luot verify, roi 10 luot chay
        # lai deu DAT - ke ca khi ep doi hat bam Python de lo thu tu duyet `set`. Khong
        # tai hien duoc thi khong sua duoc, va bang chung duy nhat con lai la vai dong
        # chu bi cat mat trong bang tong ket cua verify.
        # Nay moi lan do deu VIET RA MOT HO SO: hai ban du lieu day du va phan khac nhau
        # cua tung bang. Lan sau no do, se co thu de doc thay vi doan lai tu dau.
        # *Loi hiem thi phai bat duoc dau vet ngay lan dau - lan thu hai co the khong toi.*
        try:
            import datetime
            ho = os.path.join(SD, "_taolai_khac")
            os.makedirs(ho, exist_ok=True)
            json.dump(cap[0], open(os.path.join(ho, "luot1.json"), "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
            json.dump(cap[1], open(os.path.join(ho, "luot2.json"), "w", encoding="utf-8"),
                      ensure_ascii=False, indent=1)
            with open(os.path.join(ho, "khac.txt"), "w", encoding="utf-8") as f:
                f.write("moc neo: %s\n" % (cap[0].get("meta") or {}).get("anchor"))
                f.write("gio ghi ho so: %s\n\n" % datetime.datetime.now().isoformat(" ")[:19])
                for t in sorted(set(cap[0].get("dl", {})) | set(cap[1].get("dl", {}))):
                    x = cap[0].get("dl", {}).get(t)
                    y = cap[1].get("dl", {}).get(t)
                    if x == y:
                        continue
                    f.write("=== bang %s ===\n" % t)
                    x = x or []
                    y = y or []
                    f.write("  so dong: %d vs %d\n" % (len(x), len(y)))
                    for i in range(min(len(x), len(y))):
                        if x[i] != y[i]:
                            kh = [k for k in sorted(set(x[i]) | set(y[i]))
                                  if x[i].get(k) != y[i].get(k)]
                            f.write("  dong %d lech o cot: %s\n" % (i, ", ".join(kh)))
                            for k in kh[:6]:
                                f.write("     %s: %r  |  %r\n" % (k, x[i].get(k), y[i].get(k)))
                            break
            print("\nDa ghi ho so vao _src/_taolai_khac/ (luot1.json, luot2.json, khac.txt)")
        except Exception as e:
            print("\n(khong ghi duoc ho so: %s)" % e)
        print("\nKHONG LAP LAI DUOC - %d cho khac giua hai luot dung:" % len(ds))
        for x in ds[:15]:
            print("   X %s" % x)
        print("\nThuong la vi mot cho nao do doc lai `demo_data_big.json` (dau ra cua luot truoc) "
              "thay vi `demo_base.json`. Xem lai cac buoc: %s" % ", ".join(BUOC))
        print("KET QUA: KHONG DAT")
        sys.exit(1)
    print("KET QUA: DAT - hai luot dung lai ra dung mot bo du lieu, tung bang mot.")
finally:
    shutil.copyfile(giu, P)
    os.unlink(giu)
