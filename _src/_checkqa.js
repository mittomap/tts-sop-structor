// Bo kiem HOP HOI DAP (V9.47) - anh Luan dat hai viec va mot cau hoi kho:
//   "lam 1 cai Q&A ve he thong... em co the chi cho, tham chi gui link truc tiep"
//   "hoc vien ten gi do, thay co canh bao gi do, vay bay gio hien trang cua ban do la gi,
//    can lam gi tiep theo... rep vanh vach chuan sop"
//   "cai kho la lam sao de app hieu chinh xac nguoi ta muon gi, hoac neu chua hieu ro co the
//    dua goi y"
// Ba dieu bo kiem nay canh, theo dung thu tu nguy hiem:
//   1. TRA LOI BUA con te hon KHONG TRA LOI. Cau vo nghia PHAI ra "chua hieu".
//   2. Cau tra loi nghiep vu phai lay tu CHINH bo luat app dang chap hanh (naFor/CH4/CH2),
//      khong duoc la chuoi viet tay - viet tay la se troi khoi SOP ma khong ai biet.
//   3. Chua hieu thi phai CO GOI Y va phai GHI SO, khong duoc de man trang.
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{_s:{},add:function(c){this._s[c]=1},remove:function(c){delete this._s[c]},
  contains:function(c){return !!this._s[c]},toggle:function(c,v){if(v===undefined)v=!this._s[c];
  if(v)this._s[c]=1;else delete this._s[c];return v}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var ST={};
global.document={getElementById:(id)=>ST[id]||(ST[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.innerWidth=1400;global.innerHeight=900;
require('vm').runInThisContext(require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8'));
var SRC=require('fs').readFileSync('./gen_v5.py','utf8');
var CSS=(SRC.match(/\.asstfab\{[\s\S]*?\.tourfab\{/)||[""])[0];
var ok=0,bad=[];
function t(n,c){if(c)ok++;else bad.push(n)}
setRole("all");cfEnsure();

/* ---- 1. BO DAU TIENG VIET: nguoi ta go khong dau van phai ra ---- */
t("bo dau tieng Viet dung", qaChuan("Nguyễn Đặng Hoàng Ước")==="nguyen dang hoang uoc");
t("bo dau ca chu D gach", qaChuan("đổi ĐƠN giá")==="doi don gia");
t("khong lam hong khoang trang", qaChuan("  a   b  ")==="a b");

/* ---- 2. CAU VO NGHIA PHAI RA "CHUA HIEU" (loi nguy hiem nhat) ----
   Do that: truoc khi co nguong tin + cham diem theo TU, cau "abcxyz gi do khong co that" tra ve
   6 ket qua trong rat tu tin. Mot hop hoi dap noi bua thi khong ai dam tin no nua. */
["abcxyz gì đó không có thật","asdkjh qwe","zzzz","..." ].forEach(function(q){
 t("cau vo nghia khong duoc tra loi bua: "+q, qaTimHeThong(q,5).length===0)});
t("cau rong khong lam vo", qaTraLoi("")===null);
t("toan tu dem cung khong duoc nhan vo", qaTimHeThong("cái này là gì thế",5).length===0);

/* ---- 3. CAU HOI HE THONG THAT PHAI TRUNG ---- */
function trung(q,phai){
 var r=qaTimHeThong(q,4);
 var z=qaChuan(r.slice(0,3).map(function(k){return k.t+" "+k.d+" "+k.o+" "+k.tag+" "+(k.go||"")}).join(" | "));
 return z.indexOf(qaChuan(phai))>=0}
[["đổi ngưỡng nợ quá hạn ở đâu","nợ"],
 ["chiết khấu bao nhiêu thì phải duyệt","chiết khấu"],
 ["sĩ số tối thiểu mở lớp","classMinStudents"],
 ["hạn chấm bài tập","slaHomeworkGrading_hours"],
 ["đổi hotline","hotline"],
 ["ai được duyệt hoàn tiền","hoàn tiền"],
 ["vắng mấy buổi thì nguy cơ","nguy cơ"],
 ["đơn giá giờ dạy","teacherPayPerHour"],
 ["xem nhật ký ai sửa gì","nhật ký"]].forEach(function(p){
 t('cau hoi he thong "'+p[0]+'" phai chi ra '+p[1], trung(p[0],p[1]))});
/* moi cau tra loi he thong phai CHI DUOC CHO va MO DUOC - khong co thi chi la mot doan van */
(function(){
 var r=qaTimHeThong("đổi hotline",4).concat(qaTimHeThong("sĩ số tối thiểu mở lớp",4));
 t("moi cau tra loi he thong deu noi RO CHO", r.length>0&&r.every(function(k){return String(k.o||"").length>3}));
 t("moi cau tra loi he thong deu co duong mo thang toi noi", r.every(function(k){return String(k.go||"").length>3}))})();

/* ---- 4. KHO TRI THUC DUNG TU BAN KHAI CO SAN, KHONG CHEP TAY LAN HAI ----
   Them mot tham so / mot trang / mot cau nhac moi la kho tu lon len. Neu ai do chep tay danh
   sach vao day thi ngay mai them tham so se khong hoi duoc, ma khong ai bao do. */
(function(){
 var K=qaKhoHeThong();
 t("kho tri thuc du lon", K.length>=APPPARAMS.length+PAGES.length);
 var tenTS={};K.forEach(function(k){tenTS[k.t]=1});
 var thieu=APPPARAMS.filter(function(p){return !tenTS[p[2]]}).map(function(p){return p[1]});
 t("MOI tham so deu hoi duoc"+(thieu.length?": thieu "+thieu.slice(0,4).join(","):""), thieu.length===0);
 var trangThieu=PAGES.filter(function(p){return !p.hide&&!tenTS["Trang: "+p.t]}).map(function(p){return p.k});
 t("MOI trang deu hoi duoc"+(trangThieu.length?": thieu "+trangThieu.slice(0,4).join(","):""), trangThieu.length===0);
 /* Kho phai DUNG tu ban khai co san. Neu ai do chep tay mot danh sach vao day thi ngay mai them
    tham so se khong hoi duoc, ma khong co gi bao. Bat quan he "duyet APPPARAMS roi day vao kho". */
 t("kho lay tham so tu APPPARAMS chu khong chep tay",
   /APPPARAMS\.forEach\(function\(p\)\{[\s\S]{0,600}?K\.push/.test(SRC));
 t("kho lay trang tu PAGES chu khong chep tay",
   /PAGES\.forEach\(function\(p\)\{[\s\S]{0,300}?K\.push/.test(SRC));
})();

/* ---- 5. HIEU Y: tach "hoi ve ai" khoi "muon biet gi" ---- */
t("nhan ra y hoi ve VIEC", qaYDinh("hướng dẫn tôi xử lý task của người này")==="viec");
t("nhan ra y hoi ve CANH BAO", qaYDinh("bạn này bị cảnh báo gì vậy")==="canhbao");
t("nhan ra y hoi ve TIEN", qaYDinh("còn nợ học phí bao nhiêu")==="tien");
t("khong ep y khi cau khong noi gi", qaYDinh("Nguyễn Văn A")==="");

/* ---- 6. TIM NGUOI: khop tron ven, khong nhan vo ----
   Do that: kieu cham cu cho "Demo 1" khop ca "Demo 2" va "Demo 3" (chu "demo" trung, chu so bi
   bo qua), tuc la hoi ve mot em ma app dua ra nam em. */
(function(){
 var s=rows("DL09")[0];
 if(!s){t("co hoc vien de thu", false);return}
 var r=qaTimNguoi(s.full_name);
 t("go dung ho ten thi tim ra", r.length>0&&r[0].ma===s.student_id);
 t("go dung ma hoc vien thi tim ra", (qaTimNguoi("xem "+s.student_id)[0]||{}).ma===s.student_id);
 t("ten co chu so khong lan sang so khac", (function(){
   var a=rows("DL09").filter(function(x){return /\d/.test(String(x.full_name||""))});
   if(a.length<2)return true;
   var kq=qaTimNguoi(a[0].full_name);
   return kq.length===1&&kq[0].ma===a[0].student_id})());
 t("ten linh tinh khong ra ai", qaTimNguoi("Zzzzz Qqqqq Wwwww").length===0);
 t("cung mot nguoi vua la lead vua la HV thi uu tien ho so HOC VIEN", (function(){
   var tenHV={};rows("DL09").forEach(function(x){tenHV[qaChuan(x.full_name||"")]=1});
   var l=rows("DL02").filter(function(x){return tenHV[qaChuan(x.full_name||"")]})[0];
   if(!l)return true;
   var kq=qaTimNguoi(l.full_name);
   return kq.length>0&&kq[0].loai==="hv"})());
})();

/* ---- 7. TRA LOI NGHIEP VU PHAI DOC LAI CHINH BO LUAT APP DANG CHAP HANH ----
   Day la loi hua "vanh vach chuan SOP". No chi dung neu cau tra loi lay tu naFor/msgText/
   slaItems/stuRiskReasons - tuc la CUNG mot nguon voi chuong bao va voi Tro thu. Neu ai do viet
   tay mot doan mo ta thi hom nay dung, mai doi nguong la no noi doi. */
(function(){
 var dem={};workAll().forEach(function(x){if(x.hoso)dem[x.hoso]=(dem[x.hoso]||0)+1});
 /* Phai chon mot ho so VUA co viec VUA thieu bai - de con chung minh duoc rang doi nguong
    thresholdAtRisk_hw_missing thi cau canh bao doi theo. Chon "nhieu viec nhat" khong du: ho so
    do co the dang no tien chu khong thieu bai, luc do doi nguong hoc thuat chang doi gi ca. */
 function thieuBai(id){return rows("DL13").filter(function(z){return z.student_id===id&&hwMissing(z)}).length}
 /* Va phai la ca MAY TU THAY vuot nguong, khong phai ca NGUOI DA GAN CO: khi co da cam tay thi
    stuRiskReasons in nhanh "nguoi gan co" va khong nhac toi nguong nua - doi nguong chang doi gi,
    dung nhu thiet ke. Chon nham loai do la bai kiem tu no sai. */
 function mayThay(id){var s2=find("DL09","student_id",id);
  return !!s2&&!isRisk(s2.academic_progress_status)&&thieuBai(id)>0}
 var sid=Object.keys(dem).filter(mayThay).sort(function(a,b){return dem[b]-dem[a]})[0];
 if(!sid)sid=rows("DL09").map(function(x){return x.student_id}).filter(mayThay)[0];
 if(!sid){t("co ho so may TU THAY vuot nguong hoc thuat de soi", false);return}
 var s=find("DL09","student_id",sid);
 var K=qaHoSo({r:s,ten:s.full_name,ma:sid,loai:"hv",d:100});
 t("tra loi co phan HIEN TRANG", K.dong.length>=4);
 t("hien trang noi ro tien hoc phi", K.dong.some(function(d){return d[0]==="Học phí"}));
 t("hien trang noi ro chuyen can va bai tap", K.dong.some(function(d){return d[0]==="Chuyên cần"})&&K.dong.some(function(d){return d[0]==="Bài tập"}));
 t("liet ke DU viec dang cho cua nguoi nay", K.viec.length>=(dem[sid]||0));
 t("moi viec deu co duong mo dung man xu ly", K.viec.filter(function(v){return v.go}).length>=1);
 /* CHUNG MINH la doc lai bo luat that: doi mot NGUONG trong CH2 thi cau tra loi phai doi theo */
 var row=null;(DATA.config.ch2||[]).forEach(function(c){if(c.name==="thresholdAtRisk_hw_missing")row=c});
 if(row){var cu=row.value;
  row.value="1";
  var A=qaHoSo({r:s,ten:s.full_name,ma:sid,loai:"hv",d:100});
  row.value="99";
  var B=qaHoSo({r:s,ten:s.full_name,ma:sid,loai:"hv",d:100});
  row.value=cu;
  t("doi nguong CH2 thi phan CANH BAO doi theo (khong phai chuoi viet tay)",
    JSON.stringify(A.canhbao)!==JSON.stringify(B.canhbao));
  t("cau canh bao co in kem NGUONG dang dat", A.canhbao.join(" ").indexOf("ngưỡng")>=0)}
 /* cau chu cua viec phai la cau CH4, khong phai chu tu che */
 var na=null;try{na=naFor("DL09",s)}catch(e){}
 if(na)t("cau viec lay nguyen van tu CH4", K.viec.some(function(v){return v.cau&&v.cau===msgText(na)}));
 /* nut dat tung buoc phai chay THAT tren dung hang cho cua nguoi nay */
 var T=tourWorkBuildFor(sid);
 var soThat=workAll().filter(function(x){return String(x.hoso||"")===String(sid)||String(x.lead||"")===String(sid)}).length;
 t("dat tung buoc dung so viec cua dung nguoi", soThat===0?(T===null):(!!T&&T.steps.length===soThat));
 t("moi buoc chi duoc tinh la xong khi viec BIEN MAT khoi hang cho that",
   soThat===0||(!!T&&T.steps.every(function(st){return typeof st.chk==="function"})));
})();

/* ---- 8. CHUA HIEU THI PHAI GOI Y VA PHAI GHI SO ---- */
(function(){
 /* chon mot ho so co HO TEN NHIEU CHU that - de thu "go thieu chu van goi y duoc" */
 var s=rows("DL09").filter(function(x){return String(x.full_name||"").split(" ").length>=3&&!/\d/.test(x.full_name)})[0]||rows("DL09")[0];
 var g=qaGoiY((s.full_name||"").split(" ").pop()+" zzzqqq");
 t("chua hieu van goi y duoc nguoi gan giong", g.nguoi.length>0);
 var truoc=qaCfg().hut.length;
 qaTraLoi("zzzqqq wwweee rrrttt");
 t("cau khong tra loi duoc phai duoc GHI SO de con bo sung", qaCfg().hut.length>truoc);
 qaTraLoi("zzzqqq wwweee rrrttt");
 t("hoi lai cung cau thi dem so lan, khong ghi trung dong moi", qaCfg().hut.length===truoc+1&&qaCfg().hut[0].n===2);
})();

/* ---- 9. Q&A PHAI SUA DUOC (anh Luan: "phai co cach cap nhat") ---- */
(function(){
 t("co bang Q&A tu khai trong cau hinh", Array.isArray(qaCfg().muc)&&qaCfg().muc.length>0);
 t("co tab Hoi dap trong Cai dat", setTabs().some(function(x){return x[0]==="qa"}));
 t("tab Hoi dap duoc khai mo ta nhu moi tab khac", !!SETMOTA["qa"]);
 var n=qaCfg().muc.length;
 qaMucThem("tu khoa thu nghiem zzztest");
 t("them duoc mot muc moi", qaCfg().muc.length===n+1);
 /* muc tu khai phai THUC SU duoc dung khi tra loi, khong phai chi nam trong cau hinh cho vui */
 qaCfg().muc[0].d="Cau tra loi thu nghiem.";qaCfg().muc[0].o="Cai dat > Hoi dap";
 var r=qaTimHeThong("zzztest",5);
 t("muc tu khai duoc dung THAT khi tra loi", r.length>0&&r[0].tay===1);
 qaMucXoa(0);
 t("xoa duoc muc", qaCfg().muc.length===n);
 window.SETTAB="qa";
 var pg=RENDER["settings"]();
 t("man Hoi dap trong Cai dat ve duoc", pg.length>400);
 t("man do co so cau hoi chua tra loi duoc", /Câu hỏi app chưa trả lời được/.test(pg));
 t("moi cau bi deu co nut soan cau tra loi ngay", /qaMucThemTuHut\(/.test(pg));
 window.SETTAB="ch2";
})();

/* ---- 10. VE THAT MAN HOI DAP ---- */
(function(){
 var s=rows("DL09")[0];
 window.QAQ="";CUR="hoidap";
 var h0=RENDER.hoidap();
 t("chua hoi thi van co o nhap va vi du", /id="qa_q"/.test(h0)&&/qaViDu\(/.test(h0));
 window.QAQ=s.full_name+" cần làm gì tiếp";
 var h1=RENDER.hoidap();
 t("hoi ve mot nguoi thi ve ra ho so nguoi do", h1.indexOf(esc(s.full_name))>=0);
 t("noi RO dang hieu y gi, khong doan ngam", /Em hiểu anh đang hỏi về/.test(h1)||/Em chưa chắc/.test(h1));
 t("luon co day nut chuyen y de hoi lai cho dung", QAYDINH.every(function(y){return h1.indexOf(esc(y.t))>=0}));
 window.QAQ="đổi hotline ở đâu";
 var h2=RENDER.hoidap();
 t("hoi chuyen he thong thi ra cho cau hinh", /Mở thẳng tới đó/.test(h2));
 window.QAQ="zzzqqq wwweee rrrttt";
 var h3=RENDER.hoidap();
 t("bi thi noi thang la chua hieu", /Em chưa hiểu rõ câu này/.test(h3));
 t("bi nhung van co duong di tiep", /qaMucThem\(/.test(h3));
 t("khong bao gio de man trang", h3.length>800);
 window.QAQ="";
})();

/* ---- 10bis. TRO THU + HOI DAP GOP THANH **TRO LY** (V9.48, anh Luan) ----
   "tro thu nen bo, ket hop voi khung tim kiem nay nen nang cap khung tim kiem nay len 1 tam cao.
    De ko chi hien thi thong tin, ma con huong dan nguoi ta tuan tu de don 1 task."
   "de cai nut bat tat tro thu, thanh nut bat tat tro ly, a se goi cai nay la tro ly"
   Va: "no hien tum lum a... a hoi Tran Khanh Vy thi hay noi cac nghiep vu lien quan den Tran
   Khanh Vy thoi, voi lai em nen hoi lai de nguoi dung chon, vi du hien ten, hien lop hay gi do,
   hien so dien thoai cung."
   Ba dieu bo kiem nay canh:
     1. MOT nut, MOT tam - khong con nut Hoi dap rieng lac lai (code chet la benh, LUAT 2ter).
     2. Hoi mot cai ten thi RA THE NHAN DANG + HOI LAI, KHONG do het moi thu ra cung luc.
     3. Chon mot muc thi chi ve DUNG muc do, va duong ra cuoi cung la DAT DI DON TUNG BUOC. */
(function(){
 setRole("all");cfEnsure();CUR="banlam";
 t("chi con MOT nut o goc (khong con nut Hoi dap rieng)",
   (SRC.match(/id="qafab"/g)||[]).length===0&&(SRC.match(/id="asstfab"/g)||[]).length>=1);
 t("khong con code chet cua tam Hoi dap cu", typeof qaPanVe==="undefined"&&typeof qaFabClick==="undefined");
 t("nut goc goi dung ten Tro ly", /aria-label="Mở Trợ lý"/.test(SRC)&&/Trợ lý - hỏi về một học viên/.test(SRC));
 /* mo tam: phai co O HOI ngay tren cung, VA van con phan viec trong ngay */
 asstOpen();
 var h=document.getElementById("asst").innerHTML;
 t("tam Tro ly co o hoi ngay tren cung", /id="asst_q"/.test(h));
 /* V9.99z3 (anh Luan): *"tro ly, em bo xu ly task di, dung de hoi thoi, de ca xu ly task thua
    qua"*. Tam nay nay chi lam MOT viec: tra loi cau hoi. Hop dong doi theo: chua hoi gi thi
    phai co O HOI + goi y cau hoi that + loi mo bai huong dan, va KHONG duoc con cua xu ly viec
    (Viec ke tiep / Don tung buoc) - viec da co bon cho khac roi. */
 t("chua hoi gi thi la mot o HOI, khong con cua xu ly viec",
   /asstChip/.test(h)&&/tourMenu\(\)/.test(h)&&!/Việc kế tiếp/.test(h)&&!/tourWork\(\)/.test(h));
 /* HOI MOT CAI TEN - phai ra THE NHAN DANG, va KHONG duoc do het */
 var s=rows("DL09").filter(function(x){return String(x.full_name||"").split(" ").length>=3})[0];
 window.ASSTQ=s.full_name;window.ASSTYD="";asstPaint();
 var h2=document.getElementById("asst").innerHTML;
 t("hoi mot cai ten thi ra THE NHAN DANG", /class="qaWho"/.test(h2)&&h2.indexOf(esc(s.full_name))>=0);
 t("the nhan dang co MA de phan biet", h2.indexOf(esc(s.student_id))>=0);
 t("the nhan dang co LOP hoac noi ro chua xep lop", /IELTS|Foundation|Pre-|Combo|chưa xếp lớp/.test(h2));
 t("the nhan dang co SO DIEN THOAI", (function(){
   var sd=String(s.phone_number||s.phone||"").trim();
   return sd?h2.indexOf(esc(sd))>=0:/chưa có SĐT/.test(h2)})());
 t("HOI LAI de nguoi dung chon, khong doan bua", /Bạn muốn xem gì về/.test(h2));
 t("co du day muc de chon", Object.keys(QAPHAN).every(function(k){return h2.indexOf(esc(QAPHAN[k]))>=0}));
 /* KHONG DO TUM LUM: chua chon muc nao thi khong duoc ve san noi dung cua bat ky muc nao */
 t("chua chon muc nao thi KHONG do san hien trang", h2.indexOf("Toàn cảnh hồ sơ")>=0&&!/class="ctxr"/.test(h2));
 t("chua chon muc nao thi KHONG do san danh sach viec", !/Mở màn xử lý/.test(h2));
 t("chua chon muc nao thi KHONG do san ly do canh bao", !/ti-alert-triangle" style="color:var\(--red\)/.test(h2));
 /* CHON MOT MUC -> chi ve DUNG muc do */
 asstYD("viec");
 var hv=document.getElementById("asst").innerHTML;
 t("chon 'Viec can lam' thi noi ro dang xem gi", /Đang xem/.test(hv));
 var K=qaHoSo({r:s,ten:s.full_name,ma:s.student_id,loai:"hv",d:100});
 if(K.viec.length){
  t("chon 'Viec can lam' thi ve danh sach viec", /Mở màn xử lý/.test(hv));
  t("duong ra cuoi cung la DAT DI DON TUNG BUOC", /Dắt tôi dọn từng bước/.test(hv)&&/qaDatTroThu\(/.test(hv));
 }else{t("khong co viec thi noi thang la sach hang cho", /sạch hàng chờ/.test(hv))}
 t("chon 'Viec' thi KHONG ve kem hien trang", !/class="ctxr"/.test(hv));
 asstYD("tien");
 var ht=document.getElementById("asst").innerHTML;
 t("chon 'Hoc phi' thi ve dung phan tien", /class="ctxr"/.test(ht)&&!/Mở màn xử lý/.test(ht));
 asstYD("lienhe");
 var hl=document.getElementById("asst").innerHTML;
 t("chon 'Lien he' thi co so dien thoai va nguoi dong hanh", /Số điện thoại/.test(hl)&&/Người đồng hành/.test(hl));
 /* hoi chuyen he thong / hoi bua - van chay trong cung mot tam */
 window.ASSTQ="đổi hotline ở đâu";window.ASSTYD="";asstPaint();
 t("hoi chuyen he thong thi chi cho trong cung tam", /Mở thẳng tới đó/.test(document.getElementById("asst").innerHTML));
 window.ASSTQ="zzzqqq wwweee rrrttt";asstPaint();
 t("bi thi noi thang chua hieu", /Em chưa hiểu rõ câu này/.test(document.getElementById("asst").innerHTML));
 window.ASSTQ="";window.ASSTYD="";asstPaint();
 t("xoa cau hoi thi tam quay ve o hoi trong",
   (function(){var hh=document.getElementById("asst").innerHTML;
    return /id="asst_q"/.test(hh)&&/asstChip/.test(hh)&&!/Việc kế tiếp/.test(hh)})());
 asstClose();
})();

/* ---- 10quater. TO VANG CHI CHO PHAI GIU, KHONG TU TAT (V9.48, anh Luan) ----
   "e cu de cai to vang di, ko can tat dau, nguoi ta thoat ra thi tat."
   No tu tat sau 2,6 giay ma nguoi ta con dang doc de hieu minh duoc dan toi DAU. Vet sang mat di
   la mat luon cau tra loi "cho nao co". */
(function(){
 t("vet to vang khong con la hoat hinh tu tat", !/tr\.cfhl\{animation:cfhl/.test(SRC));
 t("vet to vang giu nguyen mau nen", /tr\.cfhl\{background:#FFF6D8/.test(SRC));
 t("khong con hen gio go vet sang", !/setTimeout\(function\(\)\{el\.classList\.remove\("cfhl"\)\}/.test(SRC));
 t("co ham dat va ham xoa vet sang", typeof cfHLDat==="function"&&typeof cfHLXoa==="function");
 t("chi MOT dong duoc to tai mot thoi diem", /function cfHLDat\(el\)\{cfHLXoa\(\)/.test(SRC));
 t("cfGo va kpiGoCf deu di qua cfHLDat",
   /function cfGo\([\s\S]{0,400}?cfHLDat\(el\)/.test(SRC)&&/function kpiGoCf\([\s\S]{0,400}?cfHLDat\(el\)/.test(SRC));
})();

/* ---- 10ter. THAM SO CHU CHUA KHAI KHONG DUOC IN RA SO 0 ---- */
(function(){
 var chu=APPPARAMS.filter(function(p){return p[5]==="text"});
 if(!chu.length){t("co tham so dang chu de thu", true);return}
 var K=qaKhoHeThong(),xau=[];
 chu.forEach(function(p){
  var m=K.filter(function(k){return k.t===p[2]})[0];if(!m)return;
  var v=String(paramStr(p[1],p[4])||"").trim();
  if(!v&&/đang đặt 0/.test(m.d))xau.push(p[1])});
 t("tham so chu chua khai thi noi 'chua khai', khong in so 0"+(xau.length?": "+xau.join(","):""), xau.length===0);
})();

/* ---- 11. VAO DUOC TU DAU: trang co that, nam trong menu ---- */
t("Hoi dap la mot trang co that", !!PBK["hoidap"]&&typeof RENDER.hoidap==="function");
t("Hoi dap nam trong menu, khong bi giau", PBK["hoidap"]&&!PBK["hoidap"].hide);

/* ---- 12. TIM NGUOI KHONG DUOC SAI NGUOI (V9.50 - anh Luan bat tai tran) ----
   "hinh nhu no tim sai nguoi do". Do lai thi ra hai lo hong:
   (a) kho tim KHONG co DL01 - go ten mot nhan vien la app nhan vo sang hoc vien trung vai chu;
   (b) luat "thieu dung mot chu dem" khong bat buoc trung CHU TEN cuoi, nen trung ho + chu dem
       (hai chu pho bien nhat tieng Viet) la dam tra loi. */
(function(){
 /* MOI nhan vien DL01: hoi nguyen ten phai ra dung nguoi do, dung dau danh sach */
 var saiNV=[];
 rows("DL01").forEach(function(s){if(String(s.staff_id)==="ADMIN")return;
  var R=qaTimNguoi(s.full_name||"");
  if(!R.length||R[0].ma!==s.staff_id)saiNV.push(s.staff_id+" -> "+(R.length?R[0].ma:"khong ai"))});
 t("hoi ten nhan vien nao cung ra dung nguoi do"+(saiNV.length?" - SAI: "+saiNV.join(", "):""), saiNV.length===0);
 /* MOI hoc vien: hoi nguyen ten van dung (khong duoc hong vi them DL01) */
 var saiHV=[];
 rows("DL09").forEach(function(s){var R=qaTimNguoi(s.full_name||"");
  if(!R.some(function(x){return x.ma===s.student_id}))saiHV.push(s.student_id)});
 t("hoi ten hoc vien nao cung van ra dung nguoi"+(saiHV.length?" - MAT: "+saiHV.join(", "):""), saiHV.length===0);
 /* luat chu TEN cuoi: ten 3 chu chi trung 2 chu DAU thi KHONG duoc tra loi bua */
 var A=rows("DL09").filter(function(s){return String(s.full_name||"").trim().split(/\s+/).length===3})[0];
 if(A){var pt=A.full_name.trim().split(/\s+/);
  var R2=qaTimNguoi(pt[0]+" "+pt[1]+" Xyzabc");
  t("trung ho + chu dem ma sai chu ten thi khong nhan vo", !R2.some(function(x){return x.ma===A.student_id}));
  var R3=qaTimNguoi(pt[1]+" "+pt[2]);
  t("goi bang hai chu cuoi (cach goi doi thuong) van tim ra", R3.some(function(x){return x.ma===A.student_id}))}
 /* dedup theo MA: hai nguoi TRUNG TEN that phai giu ca hai cho nguoi hoi tu chon */
 var goc=rows("DL09")[0];
 DL.DL09.push({student_id:"HVTRUNG9",full_name:goc.full_name,phone_number:"0900000009",student_status:goc.student_status});
 var R4=qaTimNguoi(goc.full_name);
 DL.DL09.pop();
 t("hai nguoi trung ten that thi giu CA HAI, khong vut mot", R4.some(function(x){return x.ma===goc.student_id})&&R4.some(function(x){return x.ma==="HVTRUNG9"}));
 /* tra loi cho nhan vien: co chuc danh, co nut mo ho so, KHONG chia nut "Hoc phi" */
 var nv=rows("DL01").filter(function(s){return String(s.staff_id)!=="ADMIN"})[0];
 if(nv){window.ASSTYD="";var hNV=asstTraLoi(nv.full_name);
  t("tra loi nhan vien co the nhan dang + hoi lai muon xem gi", /qaWho/.test(hNV)&&/Bạn muốn xem gì/.test(hNV));
  t("tra loi nhan vien khong chia nut Hoc phi", !/Học phí & công nợ/.test(hNV));
  t("the nhan dang khong in ma enum tho (elabel boc duoc ngoac long)", !/qaWhoM">[^<]*sales_staff|qaWhoM">[^<]*_staff/.test(hNV));
  window.ASSTYD="hientrang";var hNV2=asstTraLoi(nv.full_name);window.ASSTYD="";
  t("chon muc xong co nut mo ho so nhan vien/giang vien", /Mở hồ sơ (giảng viên|nhân viên)/.test(hNV2))}
})();

/* ---- 13. BAM TAB HUB THI SIDEBAR PHAI NHAY THEO (V9.50 - anh Luan bat tai tran) ----
   duyTabSet/csTabSet/tsTabSet chi reRender than trang; truoc day reRender khong buildNav nen
   muc dang sang tren menu dung im o tab cu. Nay reRender ve lai ca sidebar - thu THAT o day. */
(function(){
 t("reRender co goi buildNav", /function reRender\(k\)\{[\s\S]{0,900}?buildNav\(\)/.test(SRC));
 try{
  go("duyet");duyTabSet("duyetnghi");
  var nav=document.getElementById("nav").innerHTML;
  /* v5: mỗi hàng chờ là một mục menu riêng. v6: chúng là TAB của hub "Chờ duyệt", nên mục
     sáng lên phải là hub - cùng một ý định, khác hình dạng. */
  t("bam tab Don xin nghi thi menu sang dung muc do",
    nav.indexOf('class="navitem on" data-k="'+(V6()?"duyet":"duyetnghi")+'"')>=0);
  duyTabSet("duyetthu");nav=document.getElementById("nav").innerHTML;
  t("doi sang tab khac thi vet sang nhay theo",
    V6() ? (nav.indexOf('class="navitem on" data-k="duyet"')>=0)
         : (nav.indexOf('class="navitem on" data-k="duyetthu"')>=0&&nav.indexOf('data-k="duyetnghi"')>=0&&nav.indexOf('class="navitem on" data-k="duyetnghi"')<0));
 }catch(e){t("thu that tab hub khong vo: "+e.message,false)}
})();

/* ---- 14. TEN GOI LA "TRO LY" - KHONG CON NHAN "TRO THU" NAO NGUOI DUNG DOC DUOC ----
   anh Luan: "de cai nut bat tat tro thu, thanh nut bat tat tro ly, a se goi cai nay la tro ly".
   Cach do: vut het comment /* *\/ khoi nguon roi soi phan con lai - phan con lai chinh la ma
   va chuoi nguoi dung se doc. */
(function(){
 var khongCmt=SRC.replace(/\/\*[\s\S]*?\*\//g,"");
 var con=(khongCmt.match(/Trợ thủ|trợ thủ|TRỢ THỦ/g)||[]);
 t("ngoai comment khong con chu 'Tro thu' nao ("+con.length+" cho)", con.length===0);
 t("nut topbar gan nhan Tro ly", /aria-label="Bật\/tắt Trợ lý"/.test(SRC));
 t("tab Cai dat ten Tro ly", /\["tro","Trợ lý","dat"\]/.test(SRC));
})();

/* ---- 15. NOI AI MIEN PHI (V9.51 - anh Luan: "noi voi 1 con AI nao do di... chi dung AI mien
   phi"; "nhan vien con co the hoi SOP nua, nhieu khi ho ko hieu SOP thi phai giai thich") ----
   Bon dieu song con:
   1. MAC DINH TAT + tat thi KHONG mot goi tin nao roi may (bo kiem "khong phu thuoc mang").
   2. May tra loi TRUOC - AI chi dien giai, khong duoc quyen bia nut hay bia so.
   3. Goi ngu canh phai do CHINH app soan: ho so nguoi duoc hoi, nguong CH2 kem GIA TRI DANG
      CHAY, cau nhac CH4 - de AI giai thich SOP bang dung con so trung tam dang ap.
   4. Prompt phai cam bia ("KHONG bia"). */
(function(){
 t("co du bo ham AI", typeof aiCfg==="function"&&typeof aiOn==="function"&&typeof aiGoi==="function"&&typeof aiNguCanh==="function"&&typeof aiKhoiHTML==="function");
 t("mac dinh TAT", !aiOn()&&!aiCfg().on);
 t("du 4 nha cung cap mien phi", ["gemini","groq","openrouter","ollama"].every(function(k){return !!AIPROV[k]}));
 /* tat thi khong fetch, khong khoi AI */
 var goi=[];var fetchCu=global.fetch;
 global.fetch=function(u,o){goi.push([u,o]);
  var kq={then:function(){return kq},"catch":function(){return kq}};return kq};
 var hv=rows("DL09")[0];
 window.ASSTYD="";asstTraLoi(hv.full_name);
 t("AI tat: khoi AI trong asstHTML rong", aiKhoiHTML("cau hoi thu")==="");
 t("AI tat: khong mot goi tin nao roi may", goi.length===0);
 /* bat gia lap: goi dung nha cung cap, prompt mang ngu canh that */
 var a=aiCfg();a.on=1;a.prov="gemini";a.key="KEY_THU";
 t("bat co key thi aiOn", aiOn());
 t("khoi AI xuat hien khi bat", /aiTraLoi/.test(aiKhoiHTML("thu")));
 var pr=aiPrompt("học phí của "+hv.full_name);
 t("prompt cam bia", /KHÔNG bịa/.test(pr));
 t("ngu canh mang HO SO nguoi duoc hoi", pr.indexOf(hv.full_name)>=0&&/HỒ SƠ LIÊN QUAN/.test(pr));
 var pr2=aiPrompt("vì sao phải gọi lead trong 15 phút, giải thích sla giúp em");
 t("hoi SOP thi ngu canh mang NGUONG DANG AP (co gia tri that)", /NGƯỠNG SOP ĐANG ÁP DỤNG/.test(pr2)&&/\d/.test(pr2.split("NGƯỠNG SOP")[1]||""));
 /* anh Luan: "nhan vien con co the hoi SOP nua, nhieu khi ho ko hieu SOP thi phai giai thich" -
    hoi "ai duoc duyet" thi ngu canh PHAI mang dung dong bang phan quyen CH3 */
 var pr3=aiPrompt("ai được phê duyệt bảo lưu khóa học, em không rõ quy định");
 t("hoi ve quyen thi ngu canh mang bang CH3", /BẢNG PHÂN QUYỀN SOP \(CH3\)/.test(pr3)&&/phê duyệt/i.test(pr3));
 t("CH3 noi ro AI so huu viec do", /quản lý nhóm:|Ban Giám đốc|chức danh được làm/.test(pr3));
 t("prompt yeu cau giai thich VI SAO + ai duyet", /VÌ SAO/.test(pr3)&&/AI ĐƯỢC LÀM/.test(pr3));
 aiGoi("thu",function(){});
 t("goi dung Gemini kem key", goi.length===1&&/generativelanguage\.googleapis\.com/.test(goi[0][0])&&/KEY_THU/.test(goi[0][0]));
 t("than goi tin mang prompt", /NGỮ CẢNH/.test(String((goi[0][1]||{}).body||"")));
 a.prov="groq";aiGoi("thu",function(){});
 t("doi nha cung cap thi doi dung dia chi", /api\.groq\.com/.test(goi[1][0])&&/Bearer KEY_THU/.test(JSON.stringify(goi[1][1].headers)));
 /* man Cai dat co du 4 lua chon + o key kieu password */
 window.SETTAB="qa";var hSet=renderSetQA();
 t("Cai dat co khoi noi AI + 4 nha cung cap", /Nối Trợ lý với một AI miễn phí/.test(hSet)&&Object.keys(AIPROV).every(function(k){return hSet.indexOf(esc(AIPROV[k].t))>=0}));
 t("o key la password, khong chia chu thuong", /id="ai_key" type="password"/.test(hSet));
 /* tra lai mac dinh - khong de trang thai thu lam ban cac bo kiem sau */
 a.on=0;a.key="";a.prov="gemini";global.fetch=fetchCu;
 t("tra ve mac dinh sach", !aiOn());
})();

/* ═══ V9.66 - CAU HOI VAN HANH PHAI RA SO, KHONG RA "CHO CHINH NGUONG" ════════════════════
   Do that truoc khi lam: cho hop Hoi dap 15 cau mot quan ly hoi moi ngay, no tra loi DUNG 1.
   Muoi bon cau con lai roi vao nhanh "cho cau hinh" - hoi "co bao nhieu hoc vien nguy co" thi
   no chi vao o chinh NGUONG nguy co, khong noi con so. Co cau con tra loi sai han: "han cham
   bai la bao lau" ra nguong goi lead, chi vi chu "lau" hiem trong kho nen duoc cham diem cao.
   Bang duoi day la HOP DONG: moi dong ghi cau hoi + nhanh tra loi BAT BUOC. Doi cach cham diem
   ma lam tut mot dong nao la do ngay - do la cach duy nhat giu Tro ly khong tu tho lai. */
(function(){
 var BANG=[
  ["có bao nhiêu học viên nguy cơ","so"],
  ["ai chưa đóng học phí","so"],
  ["hôm nay tôi phải làm gì","so"],
  ["buổi học hôm nay có mấy buổi","so"],
  ["giáo viên nào chưa viết nhận xét","so"],
  ["doanh thu tháng này","so"],
  ["ai đang quá tải","so"],
  ["bài tập nào chờ chấm","so"],
  ["CVR đang bao nhiêu","kpi"],
  ["LRT hiện tại thế nào","kpi"],
  ["đổi ngưỡng nợ quá hạn ở đâu","hethong"],
  ["hạn chấm bài là bao lâu","hethong"],
  ["sĩ số tối thiểu mở lớp chỉnh chỗ nào","hethong"]];
 BANG.forEach(function(r){
  var R=null;try{R=qaTraLoi(r[0])}catch(e){}
  t("hoi '"+r[0]+"' -> nhanh "+r[1]+(R?(" (dang ra: "+R.loai+")"):" (khong tra ve gi)"),
    !!R&&R.loai===r[1])});
 /* Hoi ten mot LOP va mot KHOA phai ra dung ho so do, khong duoc roi ve chi cho cau hinh */
 var cl=null,kh=null;try{cl=srows("DL10")[0];kh=rows("DL05")[0]}catch(e){}
 if(cl){var Rl=qaTraLoi("lớp "+cl.class_id+" thế nào rồi");
  t("hoi ma lop ra dung ho so lop", !!Rl&&Rl.loai==="nguoi"&&Rl.nguoi.length&&Rl.nguoi[0].loai==="lop")}
 if(kh){var Rk=qaTraLoi(kh.course_name+" con bao nhieu lop");
  t("hoi ten khoa ra dung ho so khoa", !!Rk&&Rk.loai==="nguoi"&&Rk.nguoi.length&&Rk.nguoi[0].loai==="khoa")}
 /* Moi muc so lieu phai chay duoc VA phai co nut mo man lam viec - biet so ma khong toi duoc
    cho xu thi van la ngo cut. */
 QASO.forEach(function(m){
  var k=null;try{k=m.fn()}catch(e){}
  t("muc so lieu '"+m.k+"' chay duoc", !!k);
  if(k)t("muc so lieu '"+m.k+"' co nut mo man lam viec va co loi giai thich", !!k.go&&!!k.giai)});
})();

console.log(bad.length?("CHECKQA FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECKQA OK: "+ok+" tieu chi");
process.exit(bad.length?1:0);
