#!/usr/bin/env bash
# MOT LENH DUY NHAT DE KIEM TRA TOAN BO APP.
#
# Vi sao co file nay: truoc day muon biet ban sua co lam gay gi khong thi phai chay 14 lenh rieng,
# va phai NHO ky vong cua tung lenh (cai thi "OK: 143", cai thi "KET QUA: DAT", cai thi dem so ca
# co y). Ai nhan ban giao ma khong biet chinh xac 14 lenh do se khong chay gi ca - tuc la lop bao
# ve duy nhat cua du an tro thanh vo hinh.
#
#   ./verify.sh --nhanh  TANG NHANH (~3 phut) - chay sau MOI LAN SUA
#   ./verify.sh          TANG DAY DU (~18 phut) - chay truoc khi giao
#
# VI SAO TACH HAI TANG (anh Luan 04/08): "qua trinh verify cua em rat lau, nhung lan nao a cung
# bat duoc loi, e nen xem lai cach lam verify, chu vua ton thoi gian vua ko hieu qua thi giu nhu
# cu lam gi". Dem lai thi anh dung: trong mot ngay, SAU loi deu do anh Luan chi ra, khong loi nao
# do 26 bo kiem (18 phut) tim ra. Mot bo kiem 18 phut thi nguoi ta chay mot ngay mot lan - ma loi
# sinh ra tu chinh lan sua vua roi. Nen: nhung phep do RE ma bat dung loai loi hay gap thi dua ve
# TANG NHANH de chay lien tuc; phan dat (mo 1000 luot man tren 5 kho, dong vai 33 nguoi) de lai
# tang day du, chay truoc khi giao.
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

# ── DONG HO & DEM NGUOC ───────────────────────────────────────────────────────────────────
# Vi sao co: mot luot day mat 25-30 phut, trong do rieng phan trinh duyet chiem hon hai phan ba.
# Ngoi nhin man hinh dung im khong biet con bao lau la cam giac "treo may", va cung khong biet
# bo nao dang an thoi gian de ma toi uu. Nen: bam gio TUNG BO, ghi lai vao mot bang, lan chay
# sau lay chinh bang do lam uoc luong -> in duoc "con ~9 phut". Bang gio la SO DO DUOC tu may
# nay chu khong phai so em doan, va no tu chinh dan sau moi luot chay.
# Bang gio khong vao git (moi may mot toc do) - xem .gitignore.
TFILE="$GOC/_src/_thoigian_verify$([ "${1:-}" = "--nhanh" ] && echo "_nhanh").txt"
declare -A UOC; declare -A GIO
TONGUOC=0
if [ -f "$TFILE" ]; then
  while IFS='|' read -r _k _v; do
    [ -n "${_k:-}" ] && [ -n "${_v:-}" ] && { UOC["$_k"]="$_v"; TONGUOC=$((TONGUOC+_v)); }
  done < "$TFILE"
fi
T0=$(date +%s)
GIAY=-1  # chay() dat gia tri nay truoc khi goi ghi(); -1 = buoc khong bam gio

# in "2m10s" hoac "45s"
_thoigian() { local s=$1; if [ "$s" -ge 60 ]; then printf "%dm%02ds" $((s/60)) $((s%60)); else printf "%ds" "$s"; fi; }

ghi() {  # ghi <ten> <trang-thai> <chi-tiet>
  KETQUA+=("$1|$2|$3")
  local dh=""
  if [ "$GIAY" -ge 0 ]; then
    dh="$(_thoigian "$GIAY")"
    if [ "$TONGUOC" -gt 0 ]; then
      local conlai=$((TONGUOC - ($(date +%s) - T0)))
      [ "$conlai" -lt 0 ] && conlai=0
      dh="$dh · con ~$(_thoigian "$conlai")"
    fi
    dh="[$dh]"
  fi
  GIAY=-1
  case "$2" in
    OK)   printf "  ${Xanh}v${Het} %-26s %-20s %s\n" "$1" "$dh" "$3" ;;
    BOQUA)printf "  ${Vang}-${Het} %-26s %-20s %s\n" "$1" "$dh" "$3" ;;
    *)    printf "  ${Do}X${Het} %-26s %-20s ${Do}%s${Het}\n" "$1" "$dh" "$3"; LOI=$((LOI+1)) ;;
  esac
}

# chay <ten> <mau-thanh-cong> <lenh...>
#   mau = "-"  -> chi xet MA THOAT (dung cho `node --check`: thanh cong thi no KHONG IN GI,
#                 doi no phai in ra mot mau nao do la cham nham thanh do)
#   mau khac   -> phai vua thoat 0 vua co dong khop mau (cac bo kiem deu thoat 0 ke ca khi FAIL,
#                 nen bat buoc phai soi noi dung chu khong tin ma thoat)
chay() {
  local ten="$1" mau="$2"; shift 2
  local out ma cuoi _t1
  _t1=$(date +%s)
  out="$("$@" 2>&1)"; ma=$?
  GIAY=$(( $(date +%s) - _t1 )); GIO["$ten"]=$GIAY
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
# V9.99r - DU LIEU NGOAI MIEN (anh Luan 04/08 mo thu man Truong phong ACA: "no hien ra nhung cai
# ma chuc danh nay ko can a... roi dong tien gi tum lum trong do"). App co ban khai mien du lieu
# cho tung nhom, nhung chi tang DOC BANG ton trong no - dai the, cau mo dau, dai pheu, cot bang
# thi ve thang. Bo nay dong vai tung nguoi, ve THAT moi trang ho thay, roi tim dau hieu cua mien
# ho khai "none". Nguong la CHOT KEO XUONG: qua so dang co la do.
chay "_checkmien du lieu ngoai mien" "CHECKMIEN OK"      node _checkmien.js
# V9.66 - MO APP VAO BAY THU TRONG TUAN. Moi bo kiem khac chi chay vao DUNG MOT NGAY (hom nay);
# app keo du lieu demo theo boi so 7 ngay nen moi thu trong tuan nhin thay mot lat cat KHAC.
# Cho trong o lat cat nao thi mai mai trong o dung thu do - va khong bo kiem nao thay.
chay "_checkdemo bay thu trong tuan" "CHECKDEMO OK"     node _checkdemo.js
# V9.99z5 - CHUOI PHOI HOP NHIEU NGUOI (anh Luan 05/08: "Nho kiem tra logic nghiep vu khi phoi
# hop nhieu nguoi nha. Vi du: hoc vien gui xin nghi hoc, thi tiep theo la gi, ai duyet, roi the
# nao the nao..."). Moi bo kiem cu soi TUNG MAN cua TUNG NGUOI; bo nay di HET mot viec di qua tay
# hai ba nguoi - gui, vao hang cho, dung nguoi thay, co nhac, xu ly duoc, nguoi gui biet ket qua.
# Bat ngay lan chay dau: o "Cho toi xac nhan" dan sang nhom loc khong chua chinh may viec do.
chay "_checkchuoi chuoi phoi hop nhieu nguoi" "CHECKCHUOI OK" node _checkchuoi.js

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
# V2 (anh Luan dat dieu kien cho viec do hub: *"mien la khong roi"*). Do hub thanh 25 trang thi
# THANH MENU DAI RA - voi nguoi co pham vi rong do la mot kieu roi KHAC: khong phai "mot nghiep vu
# lam duoc o nhieu noi" nhu V1, ma la "khong biet nghiep vu cua minh nam dong nao". Doi mot kieu
# roi lay mot kieu roi khac thi khong phai la tien. Bo nay dong vai tung chuc danh, dung THAT
# thanh menu cua ho roi dem - va co TRAN de menu khong dai them trong im lang.
chay "_checkroi menu co lam roi khong" "CHECKROI (OK|BO QUA)" node _checkroi.js
chay "_checkmoi khong moi roi duoi" "TONG:" node _checkmoi.js

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

# ── MUC 4bis DA GO (04/08) ────────────────────────────────────────────────────────────────
# Truoc day muc nay chay lai 16 bo kiem tren ban V6 (`ITTS_APP=./_APP6.js`). Anh Luan chot
# NGUNG PHAT HANH BAN V6, nen khong con file `_APP6.js` de chay qua nua.
# Giu lai ghi chep vi sao muc nay tung ton tai - no bat duoc hai loi THAT ma khong bo kiem nao
# khac thay, va ca hai deu la MAT TINH NANG IM LANG (khong bao loi, chi la khong hien ra):
#   - navCurKey/navGroupOf/navInTree/navGrpArc duyet cam cung NAVTREE (cay menu v5) -> o v6 mo
#     trang ra khong muc nao sang tren sidebar, nguoi dung mat dau minh dang dung dau.
#   - bangViecHTML() so CUR voi BVLAND (ban do trang dap cua v5) -> o v6 CA 8 CHUC DANH mat
#     bang viec cua minh va khoi "Cho ban phe duyet" (BC9 cua SOP).
# LUAT RUT RA, van con nguyen gia tri du V6 da nghi: ban do nao cam cung theo mot ban build thi
# ban kia se LANG LE mat tinh nang. Mai kia them mot truc/mot ban nao nua thi dung lai muc nay.

echo
echo "${Dam}== 5. KIEM THU TREN TRINH DUYET THAT ==${Het}"
# V9.99k - _checkmat CHAY O CA HAI TANG. No la bo duy nhat do THU MAT NGUOI THAY ma HTML khong
# noi duoc: chu rong hon cho no co, nut bi cai khac phu len, dau ngan mo coi khi vet xuong dong.
# Ba trong sau loi anh Luan bat duoc trong ngay 04/08 deu roi vao dung hai phep do dau. No re
# (mot kho man, 14 trang, ~50 giay) nen khong co ly do gi de no vang mat o tang nhanh.
chay "_checkmat do bang mat" "CHECKMAT (OK|BO QUA)" node _checkmat.js
chay "_checkdrawer hinh hoc ngan keo" "CHECKDRAWER OK" node _checkdrawer.js
chay "_checkcrumb vet duong di" "CHECKCRUMB OK" node _checkcrumb.js
chay "_checklap khong noi hai lan" "CHECKLAP OK" node _checklap.js
if [ $NHANH -eq 1 ]; then
  ghi "_checkui" BOQUA "bo qua vi chay voi --nhanh"
else
  chay "_checkui trinh duyet that" "CHECKUI (OK|BO QUA)" node _checkui.js
  # NHAN VIEN AO: khong nhin man hinh nua ma NGOI LAM - bam Lam, dien form, bam Luu, doi chieu
  # nhat ky xem co ghi that khong. Bo kiem duy nhat di het mot viec tu dau den cuoi.
  chay "_checknv nhan vien ao" "CHECKNV (OK|BO QUA)" node _checknv.js
  # V9.93 - BAM THU MOI THE VA MOI DONG TREN MOI TRANG (anh Luan: "vay lam sao biet o cac trang
  # khac co ton tai loi gi ko?"). Cau tra loi truoc do la KHONG BIET: khong bo kiem nao bam vao
  # mot cai the. Chay lan dau bat duoc 92 cho bam vao khong co gi xay ra, cong mot bang SVTPL
  # duoc dung o 5 cho ma chua bao gio duoc khai (mo form Gui khao sat la chet ngan keo).
  # Khong chi hoi "co bam duoc khong" ma con hoi: mo dung ho so vua bam khong, co lo chu may
  # (undefined/NaN) ra man khong, ngan keo co rong khong.
  chay "_checkbam bam thu moi cho" "CHECKBAM (OK|BO QUA)" node _checkbam.js
  # V9.97 - VONG SANG CUA HUONG DAN CO KHOANH DUNG THU CAU NOI DANG NOI TOI KHONG (anh Luan:
  # "tour van te qua em, no tro sai hoai... co co che nao de no chinh xac ko em"). _checktour va
  # _checkui deu XANH suot trong khi anh Luan van thay loi, vi ca hai chi hoi "neo co tim ra
  # khong". Bo nay hoi them: mot cho tren man chi duoc MOT buoc khoanh (26 buoc tung cung neo
  # @phead - cung khoanh dong mo ta chung cua trang), neo phai nam trong than trang, vong sang
  # phai trung phan tu. Chay tren ca hai ban build.
  chay "_checkneo vong sang tro dung cho" "CHECKNEO (OK|BO QUA)" node _checkneo.js
  # V9.99e - BAM NUT "DUNG LAI DEMO" ROI KIEM LAI TU DAU (anh Luan: "nhat la nut reset demo,
  # truoc khi giao a se bam nut nay day. No phai keo demo ve trang thai hoan hao"). Day la nut
  # anh Luan bam NGAY TRUOC KHI GIAO - no ra mot bo du lieu te thi moi thu con lai het y nghia.
  # Kiem SAU khi bam: moi chuc danh co viec, co viec gap/qua han, tuan nay co buoi hoc, va
  # CAU HINH + thoi quen rieng KHONG bi cuon theo.
  chay "_checkreset dung lai demo" "CHECKRESET (OK|BO QUA)" node _checkreset.js
  # V2 (anh Luan 07/08): "e thiet ke sao ma de anh F5 lai trang no van o nguyen trang a dang
  # dung nhe". App DA hua dieu nay tu V9.29c nhung chua ai DO - do ra thi 10/11 ca deu roi ve
  # Trang bat dau. Goc loi o THU TU: enter() goi setRole() TRUOC, cu nhay ay ghi de thanh dia chi,
  # roi moi doc dia chi - doc dung cai minh vua xoa.
  # VI SAO 34 BO CU KHONG BAT DUOC: tat ca deu nap app MOT LAN roi do, khong bo nao NAP LAI.
  # Bo nay do tren http:// (dung nhu demo that) chu khong phai file://.
  chay "_checkf5 F5 khong mat cho dang dung" "CHECKF5 (OK|BO QUA)" node _checkf5.js
  # V9.99z11 - SO TREN THE PHAI TIM DUOC O DANH SACH. Hai lan trong hai ngay anh Luan bat cung
  # mot benh: the dem N ma danh sach ngay duoi khong co dau nao (buoi qua han nhan xet 06/08,
  # hoc vien nguy co 07/08). Goc chung: the va bang hoi HAI ham khac nhau cho cung mot cau hoi.
  # Loai loi nay khong hien ra khi doc ma - ca hai ve deu chay dung, khong do bo kiem nao.
  chay "_checkdem the vs danh sach" "CHECKDEM (OK|BO QUA)" node _checkdem.js
fi

# Ghi lai bang gio de luot sau co cai ma dem nguoc. Chi ghi khi chay day du (khong bi cat giua
# chung), va ghi ca luot do lan luot xanh - mot bo do vi FAIL van ton dung tung ay thoi gian.
{ for _k in "${!GIO[@]}"; do printf '%s|%s\n' "$_k" "${GIO[$_k]}"; done; } > "$TFILE" 2>/dev/null || true

echo
printf "${Dam}Tong thoi gian:${Het} %s\n" "$(_thoigian $(( $(date +%s) - T0 )))"
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
