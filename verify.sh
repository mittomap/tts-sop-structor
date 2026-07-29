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
chay "_checkdata du lieu vs luat" "CHECKDATA OK"         node _checkdata.js

echo
echo "${Dam}== 4. DU LIEU DEMO ==${Het}"
chay "check_logic.py"  "TONG BAN GHI LOI: 4" python3 check_logic.py
chay "check_data.py"   "KET QUA: DAT"        python3 check_data.py

echo
echo "${Dam}== 5. KIEM THU TREN TRINH DUYET THAT ==${Het}"
if [ $NHANH -eq 1 ]; then
  ghi "_checkui" BOQUA "bo qua vi chay voi --nhanh"
else
  chay "_checkui trinh duyet that" "CHECKUI (OK|BO QUA)" node _checkui.js
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
