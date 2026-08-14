// harness kiem TOUR: bat moi loi nem ra khi mo menu huong dan va khi chay tung buoc
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],
 createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.innerWidth=1400;global.innerHeight=900;
require('vm').runInThisContext(require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8'));
setRole("all");
var bad=[];
// 1. mo menu cap do
try{ tourMenu(); var body=STORE["drawerBody"]?STORE["drawerBody"].innerHTML:"";
  if(!body||body.length<50) bad.push("tourMenu() khong sinh noi dung menu cap do");
  else{ var n=(body.match(/tourMenu\('/g)||[]).length; if(n<3) bad.push("menu chi co "+n+" cap do"); }
}catch(e){ bad.push("tourMenu() NEM LOI: "+e.message) }
// 2. mo tung cap do
try{ (typeof TOURLV!=="undefined"?TOURLV:[]).forEach(function(V){ tourMenu(V[0]); }); }
catch(e){ bad.push("tourMenu(capdo) NEM LOI: "+e.message) }
// 3. man xac nhan + chay het moi buoc cua MOI bai
var keys=Object.keys(typeof TOURS!=="undefined"?TOURS:{});
keys.forEach(function(k){
  try{ tourAsk(k) }catch(e){ bad.push("tourAsk("+k+") NEM LOI: "+e.message) }
  try{
    tourStart(k);
    var T=TOURS[k];
    for(var i=0;i<T.steps.length;i++){ TOUR.i=i; tourPaint(); }
    tourEnd();
  }catch(e){ bad.push("chay bai "+k+" NEM LOI: "+e.message) }
});
// ---- MA DIEM NEO: moi buoc goi sel:"@ma" thi ma do PHAI ton tai trong ma nguon ----
var SRCPY=require('fs').readFileSync('./gen_v5.py','utf8');
var have={};(SRCPY.match(/data-tour="[A-Za-z0-9_.\-]+"/g)||[]).forEach(function(m){have[m.slice(11,-1)]=1});
var want={};
keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sl=String(st.sel||"");
  if(neoChay(sl))return;   /* neo theo CHU tren nut - canh o khoi rieng ben duoi */
  if(sl.charAt(0)==="@"){var a=sl.slice(1);want[a]=1;
    if(!have[a])bad.push("bai "+k+" buoc "+(i+1)+": goi ma neo @"+a+" KHONG co trong ma nguon")}
})});
var orphan=Object.keys(have).filter(function(a){return !want[a]});
console.log("Ma diem neo: khai",Object.keys(have).length,"| bai huong dan dung",Object.keys(want).length,
            orphan.length?("| khai ma dung: "+orphan.join(",")):"");
console.log("So bai huong dan:",keys.length,"| tong buoc:",keys.reduce((a,k)=>a+TOURS[k].steps.length,0));

/* ---- V9.29x: NEO CUA BAI HUONG DAN ----
   55 buoc huong dan truoc day neo bang CSS SELECTOR (.phead, .bstats...). Doi mot ten lop CSS la
   bai huong dan chi vao khoang khong, MA KHONG BAO LOI - no chi lang le highlight nham cho.
   Nay 42/55 buoc neo bang @ma (data-tour) - ma la hop dong, khong phai chi tiet trinh bay.
   13 buoc con lai tro vao CAC KHOI KHUNG dung chung cua he thiet ke; giu nguyen nhung phai
   KHAI RO O DAY. Ai doi ten mot trong nhung lop nay se thay ngay minh dang lam gay cai gi. */
function t2(n,c){if(!c)bad.push(n)}
/* ---- V9.64 (anh Luan: "tro tam bay tam ba, em nen tao co che de no tro chinh xac") ----
   Ban truoc CHO PHEP 13 buoc tro bang lop CSS dung chung, chi bat khai ra trong danh sach KHUNG.
   Do la mot bo kiem KHONG BAO GIO CAN: khai roi thi no xanh, ma cai sai van con nguyen - buoc
   "Ba tang phan quyen" tro ".notebar" van roi vao dai nhac XEM THU o dau trang, dung nhu anh Luan
   chup lai. Khai mot cai sai khong lam no thanh dung.
   Nay luat cung: MOI buoc phai tro bang @ma-neo (data-tour) hoac @txt: (chu tren nut). Khong con
   danh sach mien tru - vi bat cu lop CSS nao cung se co ngay thu hai xuat hien tren cung mot man. */
(function(){
 var xau=[],neo=0;
 keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sel=String(st.sel||"");
  if(!sel)return;
  if(sel.charAt(0)==="@"){neo++;return}
  xau.push(k+"["+i+"]="+sel)})});
 if(xau.length)bad.push("buoc huong dan con tro bang CSS selector (phai dung @ma-neo hoac @txt:): "+xau.join(", "));
 if(neo<70)bad.push("qua it buoc neo bang @ (dang "+neo+", ky vong >=70)");
 console.log("Neo cua buoc huong dan: @ma/@txt",neo,"| CSS tho",xau.length);
})();
/* MOI ma neo phai LA DUY NHAT tren mot man. Neo trung ten o hai cho thi tourFind lay cai dau
   tien trong DOM - va vo app (menu, thanh tren, dai nhac) luon dung truoc than trang, nen cai
   thang luon la cai sai. Do THAT: ve tung trang roi dem so lan ma neo xuat hien. */
/* ═══ V9.98 - VE DUNG CAI MAN NGUOI DUNG THAT SU TOI ════════════════════════════════════════
   Bay da can: buoc tn_sale#2 khai `p:"nhaplead"` va neo vao nut "Khach moi lien he den". Bo kiem
   nay bao DO ("chu khong co tren trang") trong khi mo trinh duyet that thi nut nam so so ra do.
   Ai sai? BO KIEM SAI. `go("nhaplead")` KHONG ve trang nhaplead: no remap sang hub Tuyen sinh voi
   tab "lead" (TSMAP), va tab do la mot man KHAC han trang danh sach dung rieng - nut them o day
   ten "Khach moi lien he den", con trang danh sach dung rieng thi nut ten "Them moi".
   Tuc la bo kiem dang soi mot MAN NGUOI DUNG KHONG BAO GIO TOI, roi lay ket qua do cham bai
   huong dan. Nay hoi THANG cac bang remap cua chinh app (TSMAP/CSMAP/HTMAP/KMAP/DUYMAP/ARCMAP)
   thay vi tu doan - dung mot ham dung chung cho ca 5 cho ve trang trong file nay.
   LUAT: bo kiem phai di dung cua ma nguoi dung di. Ve thang RENDER[p] la tu dat ra mot man rieng. */
function manThat(pg){
 try{
  if(typeof TSMAP==="object"&&TSMAP[pg]){window.TSTAB=TSMAP[pg];return "tuyensinh"}
  if(pg==="bangcong"){window.GVTAB="cong";return "giangvien"}
  if(pg==="hanhtrinh"){window.BLVIEW="board";return "banlam"}
  if(typeof ARCMAP==="object"&&ARCMAP[pg]){window.ARC=pg;return "chang"}
  if(typeof CSMAP==="object"&&CSMAP[pg]){window.CSTAB=CSMAP[pg];return "cskh"}
  if(typeof HTMAP==="object"&&HTMAP[pg]){window.HTTAB=HTMAP[pg];return "hoctap"}
  if(typeof KMAP==="object"&&KMAP[pg]){window.KTAB=KMAP[pg];return "khac"}
  if(typeof DUYMAP==="object"&&DUYMAP[pg]){window.DUYTAB=pg;return "duyet"}
 }catch(e){}
 return pg}
/* V9.98: `@man` la neo TINH LUC CHAY (tourMan() tra ve khoi noi dung chinh cua man dang mo),
   khong phai mot thuoc tinh data-tour khai san trong ma nguon - nen moi phep kiem "ma neo nay co
   trong nguon khong / co tren trang khong" deu khong ap dung duoc cho no. Do dung do trong
   `_checkneo` tren trinh duyet that: no goi thang tourFind() roi soi phan tu tra ve. */
function neoChay(sel){return String(sel||"")==="@man"||String(sel||"").indexOf("@txt:")===0}
(function(){
 var trung=[];
 setRole("all");
 keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sel=String(st.sel||"");
  if(sel.charAt(0)!=="@"||neoChay(sel))return;
  var ma=sel.slice(1), pg=st.p;
  if(!pg||!PBK[pg])return;
  if(st.ctx)try{st.ctx()}catch(e){}
  var h="";try{pg=manThat(pg);CUR=pg;h=(PBK[pg].ty==="list")?renderList(pg):(RENDER[pg]?RENDER[pg]():"")}catch(e){return}
  if(!h||/ngo[aà]i ph[aạ]m vi/i.test(h))return;
  var n=(h.match(new RegExp('data-tour="'+ma+'"',"g"))||[]).length;
  if(n>1)trung.push(k+"["+i+"] @"+ma+" x"+n+" tren trang "+pg)})});
 if(trung.length)bad.push("neo cua buoc xuat hien NHIEU LAN tren trang cua no (tourFind lay cai dau tien = tuy hen): "+trung.slice(0,6).join(" | "));
 console.log("Neo cua buoc la duy nhat tren trang cua no:",trung.length?("LECH "+trung.length):"dat");
})();
/* LUAT MANH NHAT, va la cai truc tiep bat "tro tam bay": buoc khai `p:"<trang>"` thi ma neo cua
   no phai co MAT TREN CHINH TRANG DO. Truoc day chi doi chieu "ma nay co ton tai o dau do trong
   app khong" - nen mot buoc dung o trang A ma tro ma neo chi co o trang B van xanh, con tren man
   that thi tourFind khong tim ra, vong sang roi ve goc man. Nay ve THAT tung trang roi hoi lai.
   Ma neo cua VO app (menu, thanh tren, chuong) khong nam trong than trang -> khai o day. */
var NEO_VO={navlbl:1,navarc:1,navarcx:1,bell:1,me:1,help:1,doicong:1,brand:1,hvnav:1,hvtools:1};
(function(){
 var lech=[];
 setRole("all");
 keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sel=String(st.sel||"");
  if(sel.charAt(0)!=="@"||neoChay(sel))return;
  var ma=sel.slice(1); if(NEO_VO[ma])return;
  var pg=st.p; if(!pg||!PBK[pg])return;
  if(st.ctx)try{st.ctx()}catch(e){}
  var h="";try{pg=manThat(pg);CUR=pg;h=(PBK[pg].ty==="list")?renderList(pg):(RENDER[pg]?RENDER[pg]():"")}catch(e){return}
  if(!h||/ngo[aà]i ph[aạ]m vi/i.test(h))return;
  if(h.indexOf('data-tour="'+ma+'"')<0)lech.push(k+"["+i+"] @"+ma+" khong co tren trang "+pg)})});
 if(lech.length)bad.push("BUOC TRO VAO MA NEO KHONG CO TREN TRANG CUA NO: "+lech.slice(0,8).join(" | "));
 console.log("Neo co mat tren dung trang cua buoc:",lech.length?("LECH "+lech.length):"dat");
})();
/* ---- CO CHE CAP NHAT TOUR (anh Luan: "he thong cung lon ma tour so sai qua em") ----
   Trang moi them vao app khong tu bao "tui chua co ai huong dan". Bo kiem nay dem: trang nao
   NGUOI DUNG VAO DUOC tu menu ma khong bai huong dan nao he di qua. Khong bat phu 100% - co
   trang chi la so tra cuu - nhung phai KHAI RO trang nao co y de ngoai, de lan sau them trang
   moi thi no do len chu khong im lang. */
var TOUR_BOQUA={
 hoso:"man ho so mo tu bat ky danh sach nao - khong phai mot trang de di toi",
 hosogv:"nhu tren", hosonv:"nhu tren", hosokhoa:"nhu tren",
 chay:"man chay quy trinh, tour bai 'Khong can vao Cai dat' da di qua bang neo @chaybody",
 hanhtrinh:"da gop vao banlam (go() remap)",
 ychv:"da gop vao tab 'Tu hoc vien' cua Giao viec (14/08, go() remap) - bai tn_hocvu di qua no o day",
 /* V2 - `bangcong` NGUOC LAI: no khong con gop vao trang Giang vien nua, no la mot trang
    nghiep vu rieng cua Nhan su, va bai "Bang cong giang day" da di thang qua no. Bo dong khai
    cu di chu khong de lai - mot dong khai mien tru cho thu khong con can mien tru la mot cho
    im lang thua, va lan sau ai doc cung tuong bangcong van la tab cua Giang vien. */
 /* ═══ V2 - SAU KHOA HUB CHI CON LA BI DANH ═════════════════════════════════════════════════
    `go()` dan chung tiep toi trang nghiep vu dau tien nguoi do xem duoc, nen KHONG AI DUNG LAI
    o day - khong co man hinh nao de ma di qua. Chung o lai chi de moi link cu, bai huong dan cu
    va nut cu khong chet. Day KHONG phai "bo qua cho tien": mot bai huong dan di qua chung se
    lap tuc bi day sang trang khac, va do moi la cai sai. */
 tuyensinh:"V2: chi la bi danh, go() dan toi trang nghiep vu dau tien nguoi do xem duoc",
 hoctap:"V2: nhu tren", cskh:"V2: nhu tren", khac:"V2: nhu tren", duyet:"V2: nhu tren",
 /* `giangvien` la SO TRA CUU doi nguu (nhom Tra cuu tren menu). Phan nghiep vu cua no - bang
    cong giang day - da tach ra thanh trang rieng va CO bai di qua. Cung ho voi cac so tra cuu
    khai ngay ben duoi. */
 giangvien:"so tra cuu doi nguu - phan nghiep vu (Bang cong) da co bai di qua o trang rieng",
 /* V9.66: ho SO TRA CUU nay co bai rieng - "tq_sotracuu" di qua 4 so (khieu nai, bai tap,
    diem danh, WOW) va noi ro ca ho dung CHUNG mot bo cong cu. May so con lai khai o day khong
    phai vi bo qua, ma vi day mot so la day duoc ca ho - di het 13 so chi lam bai dai ra ma
    khong them mot chu kien thuc nao. */
 dslienhe:"so tra cuu - bai tq_sotracuu day chung bo cong cu cho ca ho",
 dstest:"so tra cuu - xem tq_sotracuu", dstuvan:"so tra cuu - xem tq_sotracuu",
 dsdangky:"so tra cuu - xem tq_sotracuu", dsthanhtoan:"so tra cuu - xem tq_sotracuu",
 dsbuoihoc:"so tra cuu - xem tq_sotracuu", dsketthuc:"so tra cuu - xem tq_sotracuu",
 dskhaosat:"so tra cuu - xem tq_sotracuu", dsphanhoi:"so tra cuu - xem tq_sotracuu",
 nhanvien:"so tra cuu - xem tq_sotracuu", khoahoc:"so tra cuu - xem tq_sotracuu",
 lop:"tab trong hub Hoc tap - tour di qua hub",
 phong:"tab trong hub Hoc tap", gvdp:"tab trong hub Hoc tap",
 reup:"tab trong hub Tuyen sinh", khaosat:"tab trong hub CSKH", ghinhan:"tab trong hub CSKH",
 review:"tab trong hub CSKH", magioithieu:"tab trong hub Khac", baoluu:"tab trong hub Khac",
 duyetck:"tab trong hub Cho duyet", duyethoan:"tab trong hub Cho duyet",
 duyetnghi:"tab trong hub Cho duyet", duyetthu:"tab trong hub Cho duyet",
 duyetgiao:"tab trong hub Cho duyet", banggiao:"tab trong hub Cho duyet",
 chang:"vo cua 4 chang - bai 'Ban do mot chang' di qua day",
 ketthuc:"tab trong nhom chang C4, mo tu bang viec; luong ket thuc khoa da co trong bai hoc vu",
 viec:"man Viec hom nay - moi bai chuc danh deu bat dau tu banlam roi bam sang, khong can buoc rieng",
 giaoan:"kho bai tap - luong giao/thu/cham, tour bai giao vien di qua banglop",
 khac:"vo hub", duyet:"vo hub - cac tab ben trong deu da khai", hocvien:"co trong tour hoc vu"};
(function(){
 var coTour={};
 /* Chi tinh bai NGUOI DUNG BAN NAY THAY DUOC. Truoc day dem het moi bai trong TOURS, nen trang
    `ban` (truc cua ban 6) van duoc coi la "co bai di qua" ngay o ban 5 - trong khi bai ay da
    khai `chi:"6"` va nguoi dung ban 5 khong bao gio thay no. Dem mot thu nguoi dung khong thay
    la tu ru minh la da phu. */
 keys.forEach(function(k){
  try{if(typeof tourHopBan==="function"&&!tourHopBan(k))return}catch(e){}
  TOURS[k].steps.forEach(function(st){if(st.p)coTour[st.p]=1})});
 /* Trang TRUC cua ban kia thi ban nay khong can bai nao di qua - no khong nam trong menu ban nay. */
 var laV6b=false;   /* v6 da go 06/08 */
 var trucKia={};(laV6b?["banlam","changA","changB","changC","changD","hanhtrinh"]:["ban"])
  .forEach(function(x){trucKia[x]=1});
 var thieu=Object.keys(PBK).filter(function(pg){
  if(coTour[pg]||TOUR_BOQUA[pg]||trucKia[pg])return false;
  return !PBK[pg].hide});
 var thuaKhai=Object.keys(TOUR_BOQUA).filter(function(pg){return !PBK[pg]});
 if(thieu.length)bad.push("TRANG KHONG BAI HUONG DAN NAO DI QUA (them vao tour, hoac khai ly do o TOUR_BOQUA): "+thieu.join(", "));
 if(thuaKhai.length)bad.push("TOUR_BOQUA khai trang khong con ton tai: "+thuaKhai.join(", "));
 console.log("Phu cua tour: "+Object.keys(coTour).length+" trang co bai di qua · "
  +Object.keys(TOUR_BOQUA).length+" trang khai ly do bo qua · thieu "+thieu.length);
})();
/* Moi @ma dung trong bai huong dan phai co data-tour THAT trong file HTML da build */
(function(){
 var HTML="";
 var duong=(process.env.ITTS_OUT||'.')+'/ITTs_WebApp_v5_demo.html';
 try{HTML=require('fs').readFileSync(duong,'utf8')}catch(e){}
 /* V9.64 - TRUOC DAY: doc khong duoc thi `return` - im lang bo qua ca mot muc kiem. Da can that
    trong phien nay: mot ban build CU ngay 30/07 nam ket trong _src/ che ban that, moi lan chay
    tay khong dat ITTS_OUT la doi chieu voi file cu; con khi file bien mat han thi muc kiem nay
    tu tat, bang tong ket van XANH. Bo kiem tu tat la bo kiem gia - nay doc khong duoc thi DO. */
 if(!HTML){bad.push("khong doc duoc ban build de doi chieu neo: "+duong+" (dat ITTS_OUT roi chay lai)");return}
 var thieu=[];
 keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sel=String(st.sel||"");if(neoChay(sel))return;
  if(sel.charAt(0)!=="@")return;
  var ma=sel.slice(1);
  if(HTML.indexOf('data-tour="'+ma+'"')<0)thieu.push(ma)})});
 if(thieu.length)bad.push("neo @ma khong co that trong app: "+thieu.filter(function(v,i,a){return a.indexOf(v)===i}).join(", "));
})();


/* ---- V9.52: NEO THEO CHU TREN NUT (@txt:) - HUONG DAN PHAI TRO DUNG CHO ----
   anh Luan: "em nen dim, boi cho tab ben sidebar nua, chu em huong dan vay rat kho nhan ra cho
   nao can bam vao" va "sau moi phien cap nhat, em phai nang cap luon cai guide, chu no sai te le".
   Do duoc: truoc ban nay 11 buoc noi "Bam X" nhung vong sang khoanh DONG MO TA TRANG. Nay:
   1. chu trong @txt: PHAI co that tren trang cua buoc do (ve THAT roi tim);
   2. hint noi "Bam X" thi X phai la chinh chu duoc khoanh - noi mot dang tro mot neo la sai. */
(function(){
 var xau=[],lech=[],dem=0;
 keys.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  var sel=String(st.sel||"");if(sel.indexOf("@txt:")!==0)return;
  dem++;
  var chu=sel.slice(5).trim();
  var pg=st.p||"banlam";
  if(st.ctx)try{st.ctx()}catch(e){}
  var h="";try{pg=manThat(pg);CUR=pg;h=(PBK[pg]&&PBK[pg].ty==="list")?renderList(pg):(RENDER[pg]?RENDER[pg]():"")}catch(e){h=""}
  var tho=String(h).replace(/&amp;/g,"&").replace(/<[^>]*>/g," ").replace(/\s+/g," ");
  if(tho.indexOf(chu)<0)xau.push(k+"#"+(i+1)+" tro vao '"+chu+"' - trang "+pg+" khong co chu do");
  var m=String(st.hint||"").match(/Bấm (?:(?:sang|vào|nút|chip|tab|lọc)\s+)*['"]?([^,.;'"]{2,40})/);
  if(m){var noi=m[1].trim();
   if(chu.indexOf(noi.split(" ")[0])<0&&noi.indexOf(chu.split(" ")[0])<0)
    lech.push(k+"#"+(i+1)+" hint bao bam '"+noi+"' nhung khoanh '"+chu+"'")}
 })});
 console.log("Neo theo chu tren nut:",dem,"buoc");
 if(xau.length)bad.push("neo @txt tro vao chu khong co tren trang: "+xau.join(" | "));
 if(lech.length)bad.push("hint noi mot dang, vong sang khoanh mot neo: "+lech.join(" | "));
})();

/* ---- V9.30: CAP "THAO TAC MAU" PHAI KIEM CHUNG DUOC ----
   Huong dan chi NOI thi nguoi hoc gat gu roi quen. Buoc nao co viec phai lam thi phai co chk()
   doc du lieu that. Khong co chk = quay lai lam mot chuyen tham quan lan hai. */
(function(){
 var lv=TOURLV.map(function(x){return x[0]});
 /* V9.34: them TANG THU TU "Don viec hom nay" - tro thu nhap vao guide (anh Luan: "cach lam cua
    guide rat hop de lam tro thu, e them tang tro thu vao guide la dinh"). Ba cap dau van la bai
    VIET SAN; cap thu tu KHONG viet san buoc nao - buoc sinh tu hang cho that. */
 t2("dung 4 cap do (3 bai viet san + 1 tang don viec)", lv.length===4);
 t2("ten cap do dung loi anh Luan",
   TOURLV[0][1]==="Tham quan"&&TOURLV[1][1]==="Thao tác mẫu"&&TOURLV[2][1]==="Cấu hình"&&TOURLV[3][1]==="Dọn việc hôm nay");
 t2("tang don viec KHONG co bai viet san (buoc phai sinh tu hang cho)",
   Object.keys(TOURS).filter(function(k){return TOURS[k].lv==="donviec"}).length===0);
 var tt=Object.keys(TOURS).filter(function(k){return TOURS[k].lv==="trainghiem"});
 t2("co bai thao tac mau cho tung vi tri", tt.length>=5);
 var nchk=0,ntot=0,thieu=[];
 tt.forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  ntot++;
  if(typeof st.chk==="function")nchk++;
  })});
 t2("cap thao tac mau co it nhat 10 buoc kiem chung duoc (dang "+nchk+")", nchk>=10);
 /* chk phai CHAY DUOC, khong duoc nem loi */
 var vo=[];
 Object.keys(TOURS).forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  if(typeof st.chk!=="function")return;
  try{st.chk()}catch(e){vo.push(k+"["+i+"]: "+e.message)}})});
 t2("moi phep kiem deu chay duoc"+(vo.length?(" - "+vo.slice(0,3).join(" | ")):""), vo.length===0);
 /* chua lam gi thi phai tra FALSE - tra true san la loi kiem gia */
 try{tourBase()}catch(e){}
 var gia=[];
 Object.keys(TOURS).forEach(function(k){TOURS[k].steps.forEach(function(st,i){
  if(typeof st.chk!=="function")return;
  var r=null;try{r=!!st.chk()}catch(e){return}
  if(r)gia.push(k+"["+i+"]")})});
 t2("chua lam gi thi moi phep kiem deu bao CHUA"+(gia.length?(" - "+gia.slice(0,3).join(", ")):""), gia.length===0);
 /* lam that mot viec -> phep kiem tuong ung phai doi sang DA LAM */
 (function(){
  var st=null,key="";
  Object.keys(TOURS).some(function(k){return TOURS[k].steps.some(function(x){
   if(typeof x.chk==="function"&&/tourMore\("lead"\)/.test(String(x.chk))){st=x;key=k;return true}
   return false})});
  if(!st){t2("tim duoc buoc kiem 'them lead moi'", false);return}
  t2("tim duoc buoc kiem 'them lead moi'", true);
  rows("DL02").unshift({lead_id:"L-TEST-TOUR",full_name:"Kiem thu"});
  t2("them lead that thi phep kiem doi sang DA LAM", st.chk()===true);
  rows("DL02").shift()})();
})();

/* ═══ V9.44 - MOI CHUC DANH PHAI CO DU BA THU: NHIP NGAY, BAI HUONG DAN, BANG VIEC ═══
   Anh Luan 30/07: "Moi 1 chuc danh deu co 1 huong dan va tro ly rieng phu hop voi ho, cho nen
   em phai build that chac tay."
   Do lan dau: 8 nhom vai, nhung chi 6 nhom co nhip ngay (Marketing va nhom ho tro khong co dong
   nao - Marketing con doc nham nhip cua QUAN LY), va chi 5 nhom co bai huong dan (thieu NV WOW,
   Marketing, nhom ho tro). Nang hon nua: NHIP co khoa `wow` voi 4 dong nhung o chon trong Cai dat
   khong liet ke no - nhip cua NV WOW TON TAI ma khong ai voi toi de sua.
   Bo kiem nay giu cho chuyen do khong tai dien: them mot nhom vai moi vao ROLESCOPE ma quen mot
   trong ba thu la DO. */
(function(){
 var nhom=Object.keys(ROLESCOPE);
 var coBai={};Object.keys(TOURS).forEach(function(k){if(TOURS[k].lv==="trainghiem")coBai[k.replace(/^tn_/,"")]=1});
 /* mot so nhom dung chung bai/nhip voi nhom khac - khai ro o day, khong de im lang */
 /* aca: nhom tach khoi hocvu 04/08. Bai huong dan dung CHUNG voi Hoc vu vi hai phong di qua
    cung mot bo man (lop, buoi, bai) - chi khac phan duoc bam. Nhip ngay thi RIENG, vi ngay cua
    ho khac han: chat luong day, khong phai xep lop. */
 var DUNGCHUNG={quantri:"quanly",dieuhanh:"quanly",tuvan:"sale",aca:"hocvu"};
 function bai(g){return coBai[DUNGCHUNG[g]||g]||coBai[g]}
 nhom.forEach(function(g){
  t2("nhom vai '"+g+"' co BAI HUONG DAN rieng", !!bai(g));
 });
 /* nhip ngay: hoi that nhipKey() bang cach dong vai mot nguoi cua nhom do */
 var nvTheoNhom={};
 DATA.dl.DL01.forEach(function(x){
  if(!/active|working/.test(String(x.status||"")))return;
  try{applyScope(x.staff_id)}catch(e){return}
  var rs=SCOPE();if(!nvTheoNhom[rs.group])nvTheoNhom[rs.group]=x.staff_id});
 nhom.forEach(function(g){
  var sid=nvTheoNhom[g];
  if(!sid){t2("nhom vai '"+g+"' co nhan vien de thu nhip ngay (bo qua neu khong co)", true);return}
  window.GATE_SID=sid;setRole("all");applyScope(sid);
  var L=[];try{L=nhipList()}catch(e){}
  t2("nhom vai '"+g+"' co NHIP NGAY (>=3 dong)", L.length>=3);
  /* Hỏi TRANG ĐÁP THẬT chứ không đọc BVLAND - bản đồ ấy là trang đáp của v5, mà v6 cho mọi
     chức danh đáp xuống Bàn làm việc. Cắm cứng bản đồ đúng là con bệnh vừa vá trong app;
     bộ kiểm mắc y hệt thì nó đo bản v6 bằng thước của bản v5. */
  var B="";try{
   var Lm=BVLAND[g]||[];
   CUR=SCOPE().land||Lm[0]||"";
   if(Lm[1]&&CUR===Lm[0]){if(CUR==="tuyensinh")window.TSTAB=Lm[1];if(CUR==="hoctap")window.HTTAB=Lm[1]}
   B=bangViecHTML()}catch(e){}
  t2("nhom vai '"+g+"' co BANG VIEC o trang dap", (B||"").indexOf("bsn")>=0);
 });
 window.GATE_SID="";setRole("all");applyScope("");
 /* o chon chuc danh trong Cai dat phai liet ke DU moi nhip co that - khong de nhip mo coi */
 var oChon={};nhipRoles().forEach(function(r){oChon[r[0]]=1});
 var mocoi=Object.keys(NHIP).filter(function(k){return k!=="order"&&Array.isArray(NHIP[k])&&!oChon[k]});
 t2("moi nhip ngay deu sua duoc trong Cai dat"+(mocoi.length?(" - mo coi: "+mocoi.join(",")):""), mocoi.length===0);
})();

/* ═══ V9.96 - BUOC HUONG DAN KHONG DUOC KEO NGUOI SANG TRUC CUA BAN KIA ══════════════════════
   Anh Luan 03/08: *"cai tour, em co dang nham V5 voi V6 ko? sao a dang o V5, tu nhien cai tour
   lam xuat hien thuc the cua V6... em ko tach biet duoc V5 va V6 se lam loi keo theo rat nghiem
   trong day"*. Loi that: bai "Ban lam viec" (4 buoc) cam cung `p:"ban"` - trang TRUC THUC THE
   cua ban 6 - va no van hien ra o ban 5, keo nguoi dung sang mot man khong co tren menu cua ho.
   Chieu nguoc lai: 4 buoc cua "Toan canh app" cam cung `banlam` + `changA` (truc cua ban 5).

   CHI CANH TRANG TRUC, khong canh moi trang lech menu: `tuyensinh`/`duyet`/`hoidap` co o CA HAI
   ban (ban 5 dua tab len menu, ban 6 dua hub len menu) - di toi do la binh thuong. Trang truc
   thi khac: no la CACH APP TO CHUC CONG VIEC, hien nham la day nguoi dung sang mot san pham
   khac han. */
(function(){
 var TRUC6=["ban"], TRUC5=["banlam","changA","changB","changC","changD","hanhtrinh"];
 var laV6=false;   /* v6 da go 06/08 */
 var cam=laV6?TRUC5:TRUC6, xau=[];
 Object.keys(TOURS||{}).forEach(function(k){
  /* bai da khai chi danh cho ban kia thi khong tinh - no khong hien ra o ban nay */
  try{if(typeof tourHopBan==="function"&&!tourHopBan(k))return}catch(e){}
  (TOURS[k].steps||[]).forEach(function(st,i){
   if(st.p&&cam.indexOf(st.p)>=0)xau.push(k+" buoc "+(i+1)+" -> "+st.p)})});
 t2("khong buoc nao keo nguoi sang TRANG TRUC cua ban kia"+(xau.length?(" - LECH: "+xau.join(" · ")):""),
   xau.length===0);
 /* Va bai khai `chi` phai khai dung mot trong hai ban */
 var saiChi=Object.keys(TOURS||{}).filter(function(k){var c=(TOURS[k]||{}).chi;
   return c!==undefined&&String(c)!=="5"&&String(c)!=="6"});
 t2("bai khai 'chi' phai la 5 hoac 6"+(saiChi.length?(": "+saiChi.join(",")):""), saiChi.length===0);
})();

/* ═══ V9.60 - NEO CUA TOUR PHAI TRO DUNG MOT CHO ══════════════════════════════════════════
   Anh Luan 31/07 (kem anh chup): buoc "Menu theo 4 chang vong doi" NOI ve C1-C4 nhung VONG SANG
   lai nam o nhom "LAM VIEC". Goc: moi nhan nhom tren sidebar deu mang cung mot neo `navlbl`, ma
   `querySelector` lay CAI DAU TIEN - neo khong duy nhat thi no im lang tro nham, khong bao loi.
   Luat tu day: mot neo `@x` phai chi ra DUNG MOT phan tu tren man co buoc do. Neo trung nhau la
   DO - khong doi den luc co nguoi nhin thay moi biet. */
(function(){
 var trung=[],thieu=[];
 var TS=(typeof TOURS!=="undefined"?TOURS:{});
 /* sidebar + trang: dem tren CA HAI vi neo cua tour co the nam o hai noi */
 var nav="";try{buildNav();nav=STORE["nav"]?STORE["nav"].innerHTML:""}catch(e){}
 Object.keys(TS).forEach(function(k){
  (TS[k].steps||TS[k]||[]).forEach(function(st,i){
   var sel=String((st&&st.sel)||"");
   if(sel.charAt(0)!=="@"||neoChay(sel))return;
   var ten=sel.slice(1);
   var pg=st.p||"banlam",h="";
   try{pg=manThat(pg);CUR=pg;h=(PBK[pg]&&PBK[pg].ty==="list")?renderList(pg):(RENDER[pg]?RENDER[pg]():"")}catch(e){}
   var n=((h+nav).match(new RegExp('data-tour="'+ten+'"',"g"))||[]).length;
   if(!n)thieu.push(k+"#"+(i+1)+" @"+ten+" ("+pg+")");
   else if(n>1)trung.push(k+"#"+(i+1)+" @"+ten+" x"+n+" ("+pg+")")})});
 /* KHONG bao "khong tim thay": khoi tren da canh chuyen do bang cach quet ma nguon, con o day
    trang co the la bi danh (changA) hoac neo nam trong khung app tinh - do o day se ra bao dong
    gia. Mot bo kiem keu oan vai lan la lan sau khong ai doc no nua. */
 if(trung.length)bad.push("NEO TRUNG NHAU (to sang nham cho): "+trung.slice(0,8).join(" | "));
})();

/* ═══ V9.60 - SOAT TOAN BO CHUC NANG TOUR (anh Luan: "nho kiem toan bo chuc nang tour em") ══
   Khong chi canh cai neo. Mot bai huong dan hong theo NAM cach, canh du nam:
   1. Neo tro nham cho (khoi tren - neo trung nhau).
   2. Neo theo CHU ma chu do khong co tren trang -> vong sang bien mat, nguoi dung ngo ngac.
   3. Buoc mo mot trang ma chinh chuc danh cua bai KHONG duoc vao -> moi roi duoi.
   4. Buoc thieu chu: khong tieu de, khong mo ta, hoac khong cau "Viec can lam".
   5. Ham `chk` (dieu kien lam xong) nem loi -> nut Tiep theo khong bao gio sang. */
/* V9.64 - VA CAI THUOC TRUOC. `applyScope(sid)` chi dat PHAM VI (SCOPEEFF), khong dat CURSTAFF -
   tren man that thi `gateEnter` goi them `enter()` va chinh `enter()` moi gan CURSTAFF. Bo kiem
   goi moi applyScope nen CURSTAFF con la "ADMIN": moi danh sach loc theo "lead cua toi" deu ra
   0 dong, roi bo kiem ket luan "nut Ghi lien he khong co tren trang" - do la loi cua cai thuoc,
   khong phai cua app. Do that: NV001 co 31 lead, ma renderList ra 0 ban ghi.
   Nay dong vai cho tron: dat ca pham vi lan danh tinh nguoi dang ngoi. */
function dongVai(sid){applyScope(sid||"");CURSTAFF=sid||""}
(function(){
 var chuBay=[],ngoaiPham=[],thieuChu=[],chkLoi=[];
 var TS=(typeof TOURS!=="undefined"?TOURS:{});
 var VAI={tn_sale:"tuvan",tn_hocvu:"hocvu",tn_giaovien:"giaovien",tn_wow:"wow",
   tn_ketoan:"ketoan",tn_marketing:"marketing",tn_nhansu:"nhansu",tn_hotro:"hotro",tn_quanly:"quantri"};
 /* mot nhan vien dai dien cho tung nhom, de hoi dung pham vi that */
 var dai={};rows("DL01").forEach(function(x){var e;try{e=buildScope(ecode(x.role))}catch(err){return}
  if(e&&!dai[e.group])dai[e.group]=x.staff_id});
 Object.keys(TS).forEach(function(k){
  var nhom=VAI[k]||"";
  (TS[k].steps||[]).forEach(function(st,i){
   var ma=k+"#"+(i+1);
   if(!String(st.t||"").trim()||String(st.d||"").trim().length<20)thieuChu.push(ma+" (tieu de/mo ta)");
   if(!String(st.hint||"").trim())thieuChu.push(ma+" (thieu cau Viec can lam)");
   if(st.chk){try{dongVai(dai[nhom]||"");st.chk()}catch(e){chkLoi.push(ma+": "+e.message)}}
   var pg=st.p||"";
   if(pg&&nhom&&nhom!=="quantri"&&dai[nhom]){
    dongVai(dai[nhom]);var rs=SCOPE();
    if(rs.pages!=="*"&&rs.pages.indexOf(pg)<0&&!VIEW_ALWAYS[pg])ngoaiPham.push(ma+" -> "+pg+" ("+nhom+" khong vao duoc)")}
   var sel=String(st.sel||"");
   if(sel.indexOf("@txt:")===0&&pg){
    var chu=sel.slice(5);dongVai(dai[nhom]||"");
    /* Vai trang chi bay day du thanh tab SAU KHI da chon mot lop / mot hoc vien - dung cai
       nguoi dung co sau buoc truoc do. Khong gieo san thi bo kiem doi mot cai chua the co, roi
       keu oan; ma bo kiem keu oan vai lan la lan sau khong ai doc no nua. */
    /* Chon lop/hoc vien mà CHINH chuc danh nay duoc xem - gieo dai mot lop bat ky thi trang
       tra ve man "ngoai pham vi" dai 604 ky tu, va bo kiem lai keu oan mot cai vo can. */
    try{var _l=rows("DL10").filter(function(c){return canRow("DL10",c)})[0];
        window.BLCLASS=_l?_l.class_id:(rows("DL10")[0]||{}).class_id;
        var _h=rows("DL09").filter(function(x){return canRow("DL09",x)})[0];
        window.HVID=_h?_h.student_id:(rows("DL09")[0]||{}).student_id}catch(e){}
    if(st.ctx)try{st.ctx()}catch(e){}
    var h="";try{pg=manThat(pg);CUR=pg;h=(PBK[pg]&&PBK[pg].ty==="list")?renderList(pg):(RENDER[pg]?RENDER[pg]():"")}catch(e){}
    /* Phai GO MA HOA HTML truoc khi so: tren man that `tourTimChu` doc `el.textContent` (da go
       roi), con o day ta doc chuoi HTML tho nen "&" van la "&amp;" - so thang la bao dong gia. */
    /* Nguoi dai dien cua nhom co the khong phu trach lop nao -> trang tra ve man "ngoai pham vi",
       khong con thanh tab de soi. Do la chuyen cua bo kiem pham vi du lieu, khong phai cua neo;
       o day bo qua, con khong thi bo kiem nay bao do vi mot ly do khong lien quan gi den no. */
    if(/ngo[aà]i ph[aạ]m vi/i.test(h))return;
    var tho=h.replace(/<[^>]*>/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">").replace(/&quot;/g,'"').replace(/&#39;/g,"'").replace(/&nbsp;/g," ");
    if(h&&tho.indexOf(chu)<0)chuBay.push(ma+' @txt:"'+chu+'" ('+pg+")")}
  })});
 dongVai("");setRole("all");
 if(chuBay.length)bad.push("NEO THEO CHU ma chu khong co tren trang: "+chuBay.slice(0,6).join(" | "));
 if(ngoaiPham.length)bad.push("BUOC MOI VAO TRANG NGOAI PHAM VI: "+ngoaiPham.slice(0,6).join(" | "));
 if(thieuChu.length)bad.push("BUOC THIEU CHU: "+thieuChu.slice(0,6).join(" | "));
 if(chkLoi.length)bad.push("HAM chk NEM LOI: "+chkLoi.slice(0,4).join(" | "));
 console.log("Soat toan dien tour: "+Object.keys(TS).length+" bai · "
  +Object.keys(TS).reduce(function(a,k){return a+(TS[k].steps||[]).length},0)+" buoc · "
  +"neo theo chu, pham vi trang, du chu, ham chk - deu da chay");
})();

console.log(bad.length?("TOUR FAIL:\n  "+bad.join("\n  ")):"TOUR OK: menu cap do + moi bai chay het buoc, 0 loi");
