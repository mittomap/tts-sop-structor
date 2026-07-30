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
require('vm').runInThisContext(require('fs').readFileSync('./_APP.js','utf8'));
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

/* ---- 10bis. NUT HOI DAP O GOC, CANH TRO THU (V9.47, anh Luan) ----
   "sao em ko dua no len gan cho tro thu, bam icon hien khung nhap" - thu nguoi ta can hoi GIUA
   CHUNG ma bat roi trang dang lam de di tim mot trang khac thi hau nhu khong ai dung. */
(function(){
 t("co nut Hoi dap o goc", /id="qafab"/.test(SRC)&&typeof qaFabClick==="function");
 t("nut Hoi dap va nut Tro thu KHONG chong nhau mot cho",
   /\.asstfab\{position:fixed;right:74px/.test(CSS)&&/\.qafab\{position:fixed;right:18px/.test(CSS));
 t("nut Hoi dap co nhan cho nguoi doc man hinh", /id="qafab"[^>]*aria-label="[^"]+"/.test(SRC));
 /* bam la MO, bam nua la DONG */
 qaFabClick();
 var e=document.getElementById("qaPan");
 t("bam icon thi hien khung nhap", e.classList.contains("on")&&/id="qap_q"/.test(e.innerHTML));
 t("chua go gi van co cau goi y de bam thu", /qaPanVD\(/.test(e.innerHTML));
 t("cau goi y lay TEN THAT tu du lieu, khong viet cung", (function(){
   var v=qaViDuList()[0];
   return srows("DL09").some(function(x){return v.indexOf(x.full_name)===0})})());
 /* tam nay khong duoc TU TRA LOI theo kieu rieng - phai goi dung bo may cua trang */
 var s=rows("DL09").filter(function(x){return String(x.full_name||"").split(" ").length>=3})[0];
 window.QAPQ=s.full_name+" cần làm gì tiếp"; qaPanVe();
 var h=document.getElementById("qaPan").innerHTML;
 t("hoi ve mot nguoi thi tam ra dung ho so do", h.indexOf(esc(s.full_name))>=0);
 t("tam co du ba phan: hien trang - canh bao - viec theo SOP",
   /Hiện trạng/.test(h)&&/Vì sao có cảnh báo/.test(h)&&/Việc cần làm tiếp theo SOP/.test(h));
 t("tam co day nut doi y nhu trang", QAYDINH.every(function(y){return h.indexOf(esc(y.t))>=0}));
 t("tam co duong sang trang Hoi dap day du", /go\('hoidap'\)/.test(h));
 window.QAPQ="đổi hotline ở đâu"; qaPanVe();
 t("hoi chuyen he thong thi tam chi dung cho", /Mở thẳng tới đó/.test(document.getElementById("qaPan").innerHTML));
 window.QAPQ="zzzqqq wwweee rrrttt"; qaPanVe();
 t("bi thi tam cung noi thang la chua hieu", /Em chưa hiểu rõ câu này/.test(document.getElementById("qaPan").innerHTML));
 qaPanDong();
 t("bam lan nua thi dong", !document.getElementById("qaPan").classList.contains("on"));
 /* hai tam cung mot goc - mo cai nay phai dong cai kia, khong duoc de che nhau */
 t("mo Tro thu thi tam Hoi dap tu dong", /function asstOpen\(\)\{try\{qaPanDong\(\)/.test(SRC));
 t("mo Hoi dap thi tam Tro thu tu dong", /function qaFabClick\(\)[\s\S]{0,240}asstClose\(\)/.test(SRC));
 /* CONG HOC VIEN khong duoc co hop nay - no doc du lieu noi bo cua trung tam */
 t("cong hoc vien KHONG co nut Hoi dap", (SRC.match(/id="qafab"/g)||[]).length===1);
 window.QAPQ="";
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

console.log(bad.length?("CHECKQA FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECKQA OK: "+ok+" tieu chi");
process.exit(bad.length?1:0);
