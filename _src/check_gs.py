"""LOP GOOGLE SHEETS DA NGHI HUU - CANH CHO NO KHONG LEN QUAY LAI.

QUYET DINH (anh Luan, 30/07):
  "tot nhat la em vet sach cai sheet cu di, sau khi em da cap nhat day du roi thi em cu tap trung
   len phan cai dat cua app la xong ma phai ko, tu nay ko can quay lai sheet nua, do met dau."

TRUOC KHI XOA, DA DOI CHIEU TUNG FILE - khong mat luat nghiep vu nao:
  - ITTs_WebApp_v4.gs / ITTs_WebApp.gs : ban web chay tren Sheets, thay bang gen_v5.py.
    15 tham so no doc (5 threshold + 10 nguong SLA) DEU da co o sua trong CH2 cua app - da do
    bang may sau khi chay cfEnsure(), khong thieu cai nao.
  - ITTs_Reminders.gs : quet nhac viec theo lich. 10 nguong cua no NAM TRON trong 92 ma nhac viec
    cua naFor(). Thu DUY NHAT mat theo la CACH GUI (MailApp + trigger theo gio) - do la ha tang,
    khong phai luat, va backend tuong lai se phai dung lai tu dau du co giu file nay hay khong.
  - ITTs_FixCotTinh.gs : tinh cot suy ra tren sheet. Moi cot no tinh (contact_count, paid_amount,
    remaining_amount, wow_quota_*, first_enrollment_*, last_learning_activity_time, ...) app deu
    tinh trong deriveAll().
  - ITTs_XuLyDuLieu.gs : dung named range, hyperlink, checkbox, autoTimestamp onEdit - toan bo la
    CO CHE CUA BANG TINH, khong con nghia khi roi Sheets. App tu dong dau gio trong tung cua ghi.
  - ITTs_Form_NhapLieu.gs : form nhap lieu cho sheet - app co form day du hon.
  - ITTs_SeedDemo.gs : gieo du lieu demo vao sheet - thay bang pipeline Python trong _src.
Ba ban HTML nguyen mau cu (Full_v2, Full_v3 = v3_offline, Prototype_v1) va ITTs_demo_data.json
cung xoa luon: khong script nao doc chung, va chung la ban cu cua chinh app nay.
Git giu lai tat ca - can xem lai thi `git log --diff-filter=D --name-only`.

BO KIEM NAY CANH HAI THU:
  1. Khong co file .gs nao quay lai kho, va khong con tai lieu nao chi nguoi doc di cai dat Sheets.
     Nghi huu roi ma con mot file lac lai thi nguoi nhan ban giao se tuong no con song.
  2. So NHANH `if(SVR)` trong gen_v5.py dung bang ban khai. `SVR` gio luon false, nhung 66 cho goi
     do KHONG PHAI code chet - moi nhanh danh dau dung mot cho app ghi du lieu va se phai goi may
     chu khi co backend. Giu lai la co y (xem khoi ghi chu tai `var SVR=` trong gen_v5.py).
     Them cua ghi moi ma quen noi vao day -> so lech -> DO. Do dung la luc can biet.

Chay:  python3 check_gs.py
"""
import os
import re
import sys

SD = os.path.dirname(os.path.abspath(__file__))
GOC = os.environ.get("ITTS_OUT") or os.path.dirname(SD)

# So nhanh ra backend dang co. Doi so nay la mot QUYET DINH: hoac vua them mot cua ghi moi da noi
# ra may chu (tang), hoac vua bo mot cua ghi (giam). Sua bua cho het do la tu tuoc vu khi cua minh.
# 12/08: 66 -> 73. Bay cua ghi moi cua dot feedback bon team, moi cua noi ra backend dung mot cho:
#   dotTao · dotDuyet (2 cho: DL27 + DL06b) · msgGui · gvdpThangLuu · hdLuu · lopDayHV · nvNhanHVSave
SVR_GOI = 76   # +1 (13/08): runGiaoLaiRun - cua ghi 'giao lai lead' theo SOP NA046
               # +1 (17/08): ctLuu - cua BO SUNG CHUNG TU cho mot phieu thu/chi da ghi.
               #   Day dung la mot cua ghi moi va no CO noi ra backend, nen so tang la dung.
               # +1 (15/08): obGuiThat - gui thong tin lop tu luong onboarding, ghi thang vao
               #   So tin da gui (DL29). Day la mot cua ghi THAT SU gui ra ngoai cho khach, nen
               #   no BAT BUOC phai co duong noi backend - thieu la mai kia noi that thi tin
               #   khong bao gio roi khoi may.

XOA = ["ITTs_WebApp.gs", "ITTs_WebApp_v4.gs", "ITTs_Reminders.gs", "ITTs_SeedDemo.gs",
       "ITTs_XuLyDuLieu.gs", "ITTs_Form_NhapLieu.gs", "ITTs_FixCotTinh.gs",
       "ITTs_WebApp_v4_HuongDan_Deploy.md", "ITTs_WebApp_Full_v2.html",
       "ITTs_WebApp_Full_v3.html", "ITTs_WebApp_Prototype_v1.html",
       "ITTs_WebApp_v3_offline.html", "ITTs_demo_data.json"]

loi = []

conlai = [f for f in os.listdir(GOC) if f.endswith(".gs")]
if conlai:
    loi.append("Con file .gs trong kho: " + ", ".join(sorted(conlai)) +
               " - lop Google Sheets da nghi huu, dung de file lac lai.")

quaylai = [f for f in XOA if os.path.exists(os.path.join(GOC, f))]
if quaylai:
    loi.append("File da cho nghi huu nhung quay lai kho: " + ", ".join(quaylai))

SRC = open(os.path.join(SD, "gen_v5.py"), encoding="utf-8").read()
# Dem CHO GOI MAY CHU chu khong dem chu "SVR" - chu do con nam trong ca ghi chu, dem no thi so
# nhay len moi lan viet them mot dong giai thich. Cai can canh la SO CUA GHI noi ra may chu.
goi = len(re.findall(r"google\.script\.run", SRC))
nhanh = len(re.findall(r"if\(SVR\)", SRC))

print("=" * 78)
print("LOP GOOGLE SHEETS - DA NGHI HUU (30/07)")
print("  file .gs con lai trong kho     : %d (phai la 0)" % len(conlai))
print("  cho goi may chu trong gen_v5   : %d (ban khai %d)" % (goi, SVR_GOI))
print("  nhanh if(SVR) bao quanh chung  : %d - SVR luon false nen deu chay nhanh else" % nhanh)

if goi != SVR_GOI:
    loi.append("So cho goi may chu doi tu %d thanh %d. Neu vua them mot CUA GHI moi da noi ra may "
               "chu thi tot - sua SVR_GOI trong check_gs.py cho khop. Neu khong co y doi thi day "
               "la mot cua ghi vua bi bo mat duong noi ra backend." % (SVR_GOI, goi))

if loi:
    print()
    for x in loi:
        print("   X %s" % x)
    print()
    print("KET QUA: KHONG DAT")
    sys.exit(1)

print()
print("KET QUA: DAT - lop Sheets da nghi huu gon, khong file nao lac lai, duong noi backend con du.")
