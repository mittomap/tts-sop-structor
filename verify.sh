#!/usr/bin/env bash
# MOT LENH DUY NHAT DE KIEM TRA TOAN BO APP.
#
# Vi sao co file nay: truoc day muon biet ban sua co lam gay gi khong thi phai chay 14 lenh rieng,
# va phai NHO ky vong cua tung lenh (cai thi "OK: 143", cai thi "KET QUA: DAT", cai thi dem so ca
# co y). Ai nhan ban giao ma khong biet chinh xac 14 lenh do se khong chay gi ca - tuc la lop bao
# ve duy nhat cua du an tro thanh vo hinh.
#
#   ./verify.sh          build lai + trich JS + chay HET bo kiem
#   ./verify.sh --nhanh  bo qua bo kiem trinh duyet (nhanh hon ~2 phut)
#
# Ma thoat 0 = xanh het. Khac 0 = co cho do, doc bang tong ket o cuoi.
set -uo pipefail
cd "$(dirname "$0")"
GOC="$(pwd)"
export ITTS_OUT="$GOC"

NHANH=0
[ "${1:-}" = "--nhanh" ] && NHANH=1

Do=$'\033[31m'; Xanh=$'\033[32m'; Vang=$'\033[33m'; Dam=$'\033[1m'; Het=$'\033[0m'
LOI=0
declare -a KETQUA

ghi() {  # ghi <ten> <trang-thai> <chi-tiet>
  KETQUA+=("$1|$2|$3")
  case "$2" in
    OK)   printf "  ${Xanh}v${Het} %-26s %s\n" "$1" "$3" ;;
    BOQUA)printf "  ${Vang}-${Het} %-26s %s\n" "$1" "$3" ;;
    *)    printf "  ${Do}X${Het} %-26s ${Do}%s${Het}\n" "$1" "$3"; LOI=$((LOI+1)) ;;
  esac
}

# chay <ten> <mau-thanh-cong> <lenh...>
#   mau = "-"  -> chi xet MA THOAT (dung cho `node --check`: thanh cong thi no KHONG IN GI,
#                 doi no phai in ra mot mau nao do la cham nham thanh do)
#   mau khac   -> phai vua thoat 0 vua co dong khop mau (cac bo kiem deu thoat 0 ke ca khi FAIL,
#                 nen bat buoc phai soi noi dung chu khong tin ma thoat)
chay() {
  local ten="$1" mau="$2"; shift 2
  local out ma cuoi
  out="$("$@" 2>&1)"; ma=$?
  cuoi="$(printf '%s' "$out" | tail -1)"
  if [ "$mau" = "-" ]; then
    if [ $ma -eq 0 ]; then ghi "$ten" OK "${cuoi:-khong bao gi (dung)}"
    else ghi "$ten" FAIL "$(printf '%s' "$out" | tail -3 | tr '\n' ' ')"; fi
    return
  fi
  if [ $ma -eq 0 ] && printf '%s' "$out" | grep -qE "$mau"; then
    ghi "$ten" OK "$cuoi"
  else
    ghi "$ten" FAIL "$(printf '%s' "$out" | tail -3 | tr '\n' ' ')"
  fi
}

echo
echo "${Dam}== 1. DUNG LAI APP TU NGUON ==${Het}"
cd "$GOC/_src"
chay "build gen_v5.py"     "WROTE.*ITTs_TrangHocVien" python3 gen_v5.py
chay "trich _APP.js/_HV.js" "WROTE.*_HV.js"           python3 extract_js.py

echo
echo "${Dam}== 2. CU PHAP ==${Het}"
chay "node --check _APP.js" "-" node --check _APP.js
chay "node --check _HV.js"  "-" node --check _HV.js

echo
echo "${Dam}== 3. BO KIEM LOGIC & GIAO DIEN (chuoi) ==${Het}"
chay "_tall  (moi trang ve duoc)" "0 loi"                node _tall.js
chay "_check11 chang & menu"      "^TONG: [0-9]+"        node _check11.js
chay "_check12 mot cua vao"       "CHECK12 OK"           node _check12.js
chay "_check13 KPI biet noi"      "CHECK13 OK"           node _check13.js
chay "_check14 cong hoc vien"     "CHECK14 OK"           node _check14.js
chay "_check15 kiem ke cua ghi"   "CHECK15 OK"           node _check15.js
chay "_check16 hoc phi & drawer"  "CHECK16 OK"           node _check16.js
chay "_check17 bo may loc"        "CHECK17 OK"           node _check17.js
chay "_check18 hoi dong audit"    "CHECK18 OK"           node _check18.js
chay "_checktour huong dan"       "TOUR OK"              node _checktour.js
chay "_checkqa  hop hoi dap"     "CHECKQA OK"           node _checkqa.js
chay "_checkux  trai nghiem form" "CHECKUX OK"          node _checkux.js
chay "_checkdata du lieu vs luat" "CHECKDATA OK"         node _checkdata.js
# V9.64b - bo kiem dung theo CACH ANH LUAN TIM RA LOI (8 phuong phap rut tu 43 phat hien cua anh):
# doi xung giua cac trang cung ho, luong hai dau, du thua & rong, so phai sua duoc, cho dung,
# nga cut cua nguoi dung, dong bo tai lieu. Chi tiet o dau file _checkaudit.js.
chay "_checkaudit doi xung & nga cut" "CHECKAUDIT OK"    node _checkaudit.js
# V9.66 - MO APP VAO BAY THU TRONG TUAN. Moi bo kiem khac chi chay vao DUNG MOT NGAY (hom nay);
# app keo du lieu demo theo boi so 7 ngay nen moi thu trong tuan nhin thay mot lat cat KHAC.
# Cho trong o lat cat nao thi mai mai trong o dung thu do - va khong bo kiem nao thay.
chay "_checkdemo bay thu trong tuan" "CHECKDEMO OK"     node _checkdemo.js

# MOT NGAY CUA TUNG CHUC DANH: khong hoi "co hong khong" ma hoi "ngoi vao ghe ho thi co lam duoc
# viec khong". Bat duoc chuyen ba chuc danh Nhan su dap xuong Ban lam viec roi nhin 344 ho so ma
# 0 viec cua minh - app khong hong, nhung buoi sang dau tien cua ho rat te.
chay "_checkngay mot ngay cua tung chuc danh" "CHECKNGAY OK" node _checkngay.js

# V9.91 - DONG VAI TUNG NGUOI, khong phai tung chuc danh (anh Luan 03/08: "nho check ky lai moi
# 1 bo phan, 1 nguoi dang nhap thi tinh nang, giao dien da chuan chua, nghiep vu da du chua, co
# bi du thieu hay sai lech gi ko"). Pham vi du lieu cat theo CHI NHANH va theo NGUOI PHU TRACH,
# nen lay mot nguoi lam dai dien cho ca chuc danh la bo qua nhung man con lai. Chay lan dau ra
# ngay mot loi that: Leader Tu van Co so 1 khai pham vi "team" ma nhin thay tron 82 hoc vien cua
# ca 5 co so - bang dung Truong phong.
chay "_checknguoi tung nguoi dang nhap" "CHECKNGUOI OK" node _checknguoi.js

echo
echo "${Dam}== 4. DU LIEU DEMO ==${Het}"
# V9.40: truoc day cho khop "TONG BAN GHI LOI: 4". So 4 do gom ca CA CO Y (viec demo de qua han
# cho co canh bao mau do) - ma so ca co y TANG DAN THEO NGAY. Ngay 29/07 no thanh 5 va bo kiem tu
# chuyen do du khong ai dung vao ma. Nay check_logic.py tach "loi that" khoi "ca co y" va in mot
# dong ket luan on dinh.
chay "check_logic.py"  "KET QUA: DAT"        python3 check_logic.py
chay "check_data.py"   "KET QUA: DAT"        python3 check_data.py
# V9.40d (anh Luan chot): "neu chung ta de thieu sot nhung gi SOP da tung mo ta... nghia la
# chung ta sai". Bo kiem nay doc THANG file SOP goc va doi chieu 357 cot voi app - cot nao app
# khong dung phai khai ly do co y bo qua. Truoc do viec "da phu het SOP chua" chi dua vao tri nho,
# va no da sot that: 5 cot ve nguoi giam ho nam chet trong du lieu, khong man hinh nao hien.
chay "check_sop.py"    "KET QUA: DAT"        python3 check_sop.py
# V9.42: ban chay tren Google Sheets (.gs) la ban DUY NHAT hien nay nhieu nguoi dung chung duoc,
# ma no dang dung o V9.15 - doc 19 bang trong khi app dung 26. Khong bo kiem nao dung toi no, nen
# khoang cach cu rong ra trong im lang. Bo kiem nay bien khoang cach do thanh con so DUOC KHAI.
chay "check_gs.py"     "KET QUA: DAT"        python3 check_gs.py

echo
echo "${Dam}== 4bis. CHAY LAI TOAN BO BO KIEM TREN BAN V6 ==${Het}"
# Vi sao co muc nay (anh Luan 02/08: "van de la e build v6 da chuan chua ay, chu bat a lam thu
# trong khi thiet ke luong te hoac loi tum lum thi..."): truoc do `extract_js.py` chi trich than
# app tu ban v5, nen 20/21 bo kiem CHUA TUNG chay qua ban v6. Ban v6 duoc giao ma khong bo kiem
# nao di qua no. Chay lan dau lien ra hai loi that:
#   - navCurKey/navGroupOf/navInTree/navGrpArc duyet cam cung NAVTREE (cay menu v5) -> o v6 mo
#     trang ra khong muc nao sang tren sidebar, nguoi dung mat dau minh dang dung dau.
#   - bangViecHTML() so CUR voi BVLAND (ban do trang dap cua v5) -> o v6 CA 8 CHUC DANH mat
#     bang viec cua minh va khoi "Cho ban phe duyet" (BC9 cua SOP).
# Ca hai deu la mat tinh nang IM LANG - khong bao loi, chi la khong hien ra.
for _b in _tall _check11 _check12 _check13 _check15 _check16 _check17 _check18 \
          _checktour _checkqa _checkux _checkdata _checkaudit _checkdemo _checkngay _checknguoi; do
  chay "v6: ${_b}" "(OK|0 loi|^TONG: [0-9]+)" env ITTS_APP=./_APP6.js node "${_b}.js"
done

echo
echo "${Dam}== 5. KIEM THU TREN TRINH DUYET THAT ==${Het}"
if [ $NHANH -eq 1 ]; then
  ghi "_checkui" BOQUA "bo qua vi chay voi --nhanh"
else
  chay "_checkui trinh duyet that" "CHECKUI (OK|BO QUA)" node _checkui.js
  # NHAN VIEN AO: khong nhin man hinh nua ma NGOI LAM - bam Lam, dien form, bam Luu, doi chieu
  # nhat ky xem co ghi that khong. Bo kiem duy nhat di het mot viec tu dau den cuoi.
  chay "_checknv nhan vien ao" "CHECKNV (OK|BO QUA)" node _checknv.js
fi

echo
echo "${Dam}=================== TONG KET ===================${Het}"
if [ $LOI -eq 0 ]; then
  printf "${Xanh}${Dam}XANH HET.${Het} Ban sua nay khong lam gay gi trong pham vi bo kiem.\n\n"
  exit 0
fi
printf "${Do}${Dam}CO %d CHO DO - KHONG DUOC GIAO.${Het}\n" "$LOI"
for d in "${KETQUA[@]}"; do
  ten="${d%%|*}"; con="${d#*|}"; tt="${con%%|*}"; ct="${con#*|}"
  [ "$tt" = "FAIL" ] && printf "  ${Do}%-26s${Het} %s\n" "$ten" "$ct"
done
printf "\nDoc them: _src/README_SRC.md (tung bo kiem canh dieu gi) va 02_NHAT_KY_QUYET_DINH.md (vi sao).\n\n"
exit 1
