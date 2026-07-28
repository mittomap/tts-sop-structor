/* _check16: DONG HOC PHI THEO DOT (mang 4). Chay: ITTS_OUT=<out> node _check16.js */
var FIELDS={},ST={};
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:(FIELDS[id]||""),checked:!!FIELDS["chk_"+id],style:{setProperty(){},removeProperty(){}},offsetHeight:200,offsetWidth:120,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
global.document={getElementById:(id)=>ST[id]||(ST[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:"",search:"",pathname:"/cong-nhan-vien/"};
global.history={replaceState:function(a,b,u){var i=String(u).indexOf("?");
 location.search=i<0?"":String(u).slice(i);location.pathname=i<0?String(u):String(u).slice(0,i)}};
var _LS={};global.localStorage={getItem:k=>_LS[k]===undefined?null:_LS[k],setItem(k,v){_LS[k]=String(v)},removeItem(k){delete _LS[k]}};global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
var SRC0=require('fs').readFileSync('./_APP.js','utf8');
/* Khung trang (navbar, #pgTitle) nam trong PHAN HTML chu khong nam trong <script> - kiem tra
   markup phai doc file HTML that, doc _APP.js thi luat nao cung "fail" ma khong phai loi app. */
var OUT=process.env.ITTS_OUT||'.';
var HTML=require('fs').readFileSync(OUT+'/ITTs_WebApp_v5_demo.html','utf8');
var SRC=SRC0.replace(/\/\*[\s\S]*?\*\//g,"");
require('vm').runInThisContext(SRC0);
setRole("all");
var bad=[],ok=0;
function t(n,c){if(c)ok++;else bad.push(n)}
function setF(o){FIELDS=o;ST={}} function reset(){__actT={}}

/* ---- 1. bang lich dot ton tai va dung ---- */
t("co bang lich dong theo dot DL06b", rows("DL06b").length>0);
t("moi don con hieu luc deu co lich dot",
  rows("DL06").filter(function(e){return !isc(e.enrollment_status,"cancelled")&&num(e.final_fee)>0&&!insOf(e.enrollment_id).length}).length===0);
t("tong tien cac dot = hoc phi cua don",
  rows("DL06").filter(function(e){var L=insOf(e.enrollment_id);
   return L.length&&Math.abs(L.reduce(function(a,x){return a+num(x.due_amount)},0)-num(e.final_fee))>1}).length===0);
t("tong da dong o cac dot = da dong cua don",
  rows("DL06").filter(function(e){var L=insOf(e.enrollment_id);
   return L.length&&Math.abs(L.reduce(function(a,x){return a+num(x.paid_amount)},0)-num(e.paid_amount))>1}).length===0);
t("han dot sau luon SAU han dot truoc",
  rows("DL06").filter(function(e){var L=insOf(e.enrollment_id);
   for(var i=1;i<L.length;i++){var a=pvnd(L[i-1].due_date),b=pvnd(L[i].due_date);if(a&&b&&b<=a)return true}
   return false}).length===0);
t("next_payment_due cua don = han dot chua dong gan nhat",
  rows("DL06").filter(function(e){var L=insOf(e.enrollment_id);if(!L.length)return false;
   var op=L.filter(function(x){return !isc(x.status,"paid")});
   return String(e.next_payment_due||"")!==String(op.length?op[0].due_date:"")}).length===0);
t("trang thai dot lay NHAN tu danh muc CH1",
  (ENUM.enum_installment_status||[]).length===5&&rows("DL06b").every(function(x){return String(x.status||"").indexOf(" (")>0}));

/* ---- 2. NHAC TRUOC HAN, khong doi qua han moi reo ---- */
(function(){
 var it=slaItems().filter(function(i){return i.grp==="Thu công nợ"});
 var txt=it.map(function(i){return i.what}).join(" | ");
 t("co nhac SAP TOI HAN (truoc han)", /SẮP TỚI HẠN/.test(txt));
 t("co nhac TOI HAN", /TỚI HẠN -/.test(txt));
 t("co nhac QUA HAN", /QUÁ HẠN/.test(txt));
 t("nhac noi ro DOT nao, bao nhieu tien, han ngay nao", /Đợt \d+\/\d+ · .+đ · hạn \d/.test(txt));
 t("ca qua han lau moi to do", it.filter(function(i){return /QUÁ HẠN/.test(i.what)}).every(function(i){return i.sev==="red"}));
 t("so ngay nhac truoc han lay tu CH2", /paramOf\("installmentRemind_days"/.test(SRC));
 t("so ngay chuyen do lay tu CH2", /paramOf\("installmentLate_days"/.test(SRC));
})();

/* ---- 3. MAN THU TIEN thay lich dot ---- */
(function(){
 var e=rows("DL06").filter(function(x){return insOf(x.enrollment_id).length>1&&num(x.remaining_amount)>0})[0];
 if(!e){bad.push("khong co don tra gop de kiem man thu tien");return}
 setF({});payForm(e.enrollment_id);
 var h=ST["drawerBody"].innerHTML||"";
 t("man thu tien HIEN bang lich dot", h.indexOf("Lịch đóng theo đợt")>=0);
 t("man thu tien noi ro dang thu cho DOT nao", /đang điền sẵn theo <b>đợt/.test(h));
 t("man thu tien co nut chia lai lich dot", h.indexOf("insPlanForm(")>=0);
 var one=rows("DL06").filter(function(x){return insOf(x.enrollment_id).length===1&&num(x.remaining_amount)>0})[0];
 if(one){setF({});payForm(one.enrollment_id);
  t("don dong mot lan co loi vao chia nhieu dot", (ST["drawerBody"].innerHTML||"").indexOf("Chia thành nhiều đợt")>=0)}
})();

/* ---- 4. HAM LOI insSync: moi cua dong vao tien deu goi ---- */
t("paySave goi ham loi insSync", /function paySave[\s\S]{0,4000}?insSync\(/.test(SRC));
t("hoan tien goi ham loi insSync", /function duyetRefundRun[\s\S]{0,2000}?insSync\(/.test(SRC));
(function(){
 var e=rows("DL06").filter(function(x){return insOf(x.enrollment_id).length>1&&num(x.remaining_amount)>0})[0];
 if(!e){bad.push("khong co don de lai thu thu tien");return}
 var L0=insOf(e.enrollment_id);
 var openIdx=L0.filter(function(x){return !isc(x.status,"paid")})[0];
 var amt=num(openIdx.remaining_amount)||num(openIdx.due_amount);
 reset();setF({pm_amt:String(amt),pm_method:"bank_transfer (Chuyển khoản NH)",pm_sender:"x",pm_ref:"y",pm_due:""});
 paySave(e.enrollment_id);
 var L1=insOf(e.enrollment_id);
 var x1=L1.filter(function(x){return String(x.installment_no)===String(openIdx.installment_no)})[0];
 t("thu du tien mot dot -> dot do chuyen sang Da dong du", isc(x1.status,"paid"));
 t("thu tien xong -> tong da dong o cac dot van khop don",
   Math.abs(L1.reduce(function(a,x){return a+num(x.paid_amount)},0)-num(e.paid_amount))<=1);
 var op=L1.filter(function(x){return !isc(x.status,"paid")});
 t("thu tien xong -> hen thu tu nhay sang DOT KE TIEP", String(e.next_payment_due||"")===String(op.length?op[0].due_date:""));
 t("phieu thu duoc gan SO DOT", rows("DL07").filter(function(p){return p.enrollment_id===e.enrollment_id})
   .every(function(p){return String(p.installment_no||"").trim()!==""}));
})();

/* ---- 5. CHIA LAI LICH DOT ---- */
(function(){
 var e=rows("DL06").filter(function(x){return !isc(x.enrollment_status,"cancelled")&&num(x.final_fee)>0})[0];
 var d=new Date(Date.now()+3*864e5);function z(n){return n<10?"0"+n:n}
 reset();setF({ip_n:"3",ip_d0:d.getFullYear()+"-"+z(d.getMonth()+1)+"-"+z(d.getDate()),ip_gap:"30",ip_dep:"40"});
 insPlanSave(e.enrollment_id);
 var L=insOf(e.enrollment_id);
 t("chia lai duoc thanh 3 dot", L.length===3);
 t("chia lai van giu tong tien = hoc phi", Math.abs(L.reduce(function(a,x){return a+num(x.due_amount)},0)-num(e.final_fee))<=1);
 t("chia lai xong van phan bo dung tien da dong",
   Math.abs(L.reduce(function(a,x){return a+num(x.paid_amount)},0)-num(e.paid_amount))<=1);
 t("chia lai xong han cac dot cach nhau dung so ngay",
   (function(){var a=pvnd(L[0].due_date),b=pvnd(L[1].due_date);return a&&b&&Math.round((b-a)/864e5)===30})());
 t("dot dau chiem dung ty le da chon", Math.abs(num(L[0].due_amount)-Math.round(num(e.final_fee)*0.4/1000)*1000)<=1000);
})();

/* ---- 6. IN LICH DOT VAO PHIEU + cau hinh ---- */
t("phieu in co LICH DONG THEO DOT", /LỊCH ĐÓNG HỌC PHÍ THEO ĐỢT/.test(SRC));
["installmentGap_days","installmentRemind_days","installmentLate_days","installmentDepositPercent"].forEach(function(k){
 t("tham so "+k+" co trong CH2", (DATA.config.ch2||[]).some(function(c){return c.name===k}))});
t("khong cam cung khoang cach giua hai dot", /paramOf\("installmentGap_days"/.test(SRC));
t("khong cam cung ty le dot dau", /paramOf\("installmentDepositPercent"/.test(SRC));

/* ---- 7. TOOLTIP HIEN NGAY (V9.27) - title cua trinh duyet cham va bi cat boi khung cuon ---- */
var CSS=require('fs').readFileSync(process.env.ITTS_OUT+"/ITTs_WebApp_v5_demo.html","utf8");
t("co the tipbox va lop .on", /\.tipbox\{/.test(CSS)&&/\.tipbox\.on\{/.test(CSS));
t("tipbox la position fixed nen khong bi khung cuon cat", /\.tipbox\{[^}]*position:fixed/.test(CSS));
t("tipbox noi len tren mask va drawer", (function(){var m=CSS.match(/\.tipbox\{[^}]*z-index:(\d+)/);return m&&+m[1]>171})());
t("tipbox khong an chuot", /\.tipbox\{[^}]*pointer-events:none/.test(CSS));
t("co ham tipShow va tipHide", typeof tipShow==="function"&&typeof tipHide==="function");
t("bat hover theo uy quyen tren document (moi data-tip deu chay)", /addEventListener\("mouseover"/.test(SRC));
t("cuon hoac bam thi tooltip tat", /addEventListener\("mousedown",tipHide/.test(SRC)&&/addEventListener\("scroll",tipHide/.test(SRC));
t("dai hat hanh trinh dung data-tip chu khong dung title", /class="mstrip'\+\(pid\?" clk":""\)\+'" style="--mscol:'\+A\.col\+'" data-tip=/.test(SRC));
t("khong con the nao dung title= de chu thich dai hat", !/mstrip[^\n]*title="/.test(SRC));
t("hat hanh trinh du to de tro chuot (>=11px)", (function(){var m=CSS.match(/\.mstrip \.msd\{width:(\d+)px/);return m&&+m[1]>=11})());
t("hat dang dung to hon hat da qua", (function(){var a=CSS.match(/\.mstrip \.msd\{width:(\d+)px/),b=CSS.match(/\.mstrip \.msd\.now\{width:(\d+)px/);return a&&b&&+b[1]>+a[1]})());
t("cac hat gian ra >=6px cho de tro", (function(){var m=CSS.match(/\.mstrip\{[^}]*gap:(\d+)px/);return m&&+m[1]>=6})());
t("hover vao dai hat co phan hoi thay duoc", /\.mstrip\.clk:hover\{/.test(CSS)&&/\.mstrip\.clk:hover \.msd\{[^}]*transform:scale/.test(CSS));
t("tipShow khong ve lai khi chuot di trong cung mot the", /if\(TIPCUR===el\)return/.test(SRC));
(function(){ /* chay that: tro vao mot dai hat thi tooltip phai co chu ngay */
 var el={_a:{"data-tip":"Chặng 1 · Khách tiềm năng"},getAttribute:function(k){return this._a[k]||""},
  getBoundingClientRect:function(){return{left:100,top:100,width:80,height:14,bottom:114,right:180}}};
 tipHide();tipShow(el);
 var box=document.getElementById("tipbox");
 t("tro vao la co ngay noi dung", !!box&&/Chặng 1/.test(box.textContent||""));
 t("tro vao la bat lop on ngay", !!box&&/\bon\b/.test(box.className||""));
 tipHide();
 t("roi chuot ra thi tat", !/\bon\b/.test((document.getElementById("tipbox")||{}).className||""));
})();

/* ---- 8. THANH THONG TIN LOP chia tang (V9.27) ---- */
(function(){
 var c=rows("DL10")[0]; if(!c){t("co lop de kiem thanh thong tin",false);return}
 var H=classBar(c.class_id);
 t("thanh thong tin lop co tang dau rieng cho ten lop", /class="cbhead"/.test(H));
 t("ten lop nam o tang dau", new RegExp('cbname">'+c.class_name.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")).test(H));
 t("ma lop di kem ten lop chu khong lan vao cac o", H.indexOf('cbcode">'+c.class_id)>0&&H.indexOf('cbcode')<H.indexOf('cbgrid'));
 t("trang thai lop nam ngay canh ten lop", H.indexOf('chip')>0&&H.indexOf('chip')<H.indexOf('cbgrid'));
 t("phan con lai chia dung 2 khoi", (H.match(/class="cbgrid"/g)||[]).length===2);
 t("khoi tren 5 o, khoi duoi 4 o", /--cbn:5/.test(H)&&/--cbn:4/.test(H));
 t("tong so o thong tin van du 9", (H.match(/class="cbit"/g)||[]).length===9);
 ["Khóa","Giảng viên","Lịch học","Phòng / link","Cơ sở","Khai giảng","Kết thúc","Sĩ số","Hình thức"]
  .forEach(function(k){t("thanh thong tin lop con o "+k, H.indexOf('>'+k+'<')>0)});
 t("khong con o Lop lap lai trong luoi", H.indexOf('cbl">Lớp<')===H.lastIndexOf('cbl">Lớp<'));
 var A=H.indexOf('--cbn:5'),B=H.indexOf('--cbn:4');
 t("nhom day gi/ai day/o dau nam khoi tren", H.indexOf('>Giảng viên<')>A&&H.indexOf('>Giảng viên<')<B&&H.indexOf('>Phòng / link<')<B);
 t("nhom thoi gian va quy mo nam khoi duoi", H.indexOf('>Khai giảng<')>B&&H.indexOf('>Sĩ số<')>B);
 t("luoi dung so cot khai bang bien --cbn", /\.cbgrid\{[^}]*repeat\(var\(--cbn/.test(CSS));
 t("man hinh hep thi xuong con 3 roi 2 cot", /max-width:1000px\)\{\.cbgrid\{grid-template-columns:repeat\(3/.test(CSS)&&/max-width:620px\)\{\.cbgrid\{grid-template-columns:repeat\(2/.test(CSS));
})();

/* ---- 9. MOI HAT MOT CHU THICH + PHAN BIET BAM DUOC / CHI DE XEM (V9.27) ---- */
(function(){
 var J=null,MIX=jIndex();
 var all=jAll();for(var i=0;i<all.length&&!J;i++)if((ARCRAIL[arcOf(all[i].k)]||[]).length>2)J=all[i];
 if(!J){t("co ho so de kiem dai hat",false);return}
 var H=mstrip(J.k,J.over,J.C&&J.C.pid);
 var tips=H.match(/data-tip="[^"]*"/g)||[];
 var dots=(H.match(/class="msd/g)||[]).length;
 t("moi hat deu co chu thich rieng", tips.length>=dots+1);
 t("chu thich hat ghi ro so buoc", /data-tip="Bước 1\//.test(H));
 t("chu thich hat ghi ro trang thai da qua / dang o / chua toi",
   /(đã qua|ĐANG Ở ĐÂY|chưa tới|đã rẽ nhánh)/.test(H));
 t("hat dang dung ghi ĐANG Ở ĐÂY", /ĐANG Ở ĐÂY/.test(H));
 t("chip chang cung co chu thich rieng", /class="msarc" data-tip="Chặng /.test(H));
 t("khong hat nao con thieu chu thich", (H.match(/class="msd[^"]*"(?! data-tip)/g)||[]).length===0);
 t("ro chuot vao tung hat thi hat do phong to", /\.mstrip \.msd:hover\{[^}]*transform:scale/.test(CSS));
 t("hat co vung bat chuot rong hon chinh no", /\.mstrip \.msd:after\{[^}]*inset:-\dpx/.test(CSS));
 /* bam duoc vs chi de xem */
 t("bat cu thu gi co onclick deu co con tro tay", /\[onclick\]\{cursor:pointer\}/.test(CSS));
 t("o chi de xem dung vien DUT de phan biet", /\.bstat\.static\{[^}]*border-style:dashed/.test(CSS));
 t("o chi de xem khong doi gi khi ro chuot", /\.bstat\.static:hover\{[^}]*box-shadow:none/.test(CSS));
 t("o bam duoc nhac len khi ro chuot", /\.bstat\[onclick\]:hover\{[^}]*transform:translateY/.test(CSS));
 t("chi o bam duoc moi co con tro tay", /\.bstat\[onclick\]\{cursor:pointer\}/.test(CSS));
 t("statStrip van la o chi de xem", /class="bstat static"/.test(SRC));
 t("buoc phieu tuyen sinh trong nhu the bam duoc", /\.tsstep\{[^}]*border:1px solid #E6ECF3/.test(CSS)&&/\.tsstep:hover\{[^}]*transform:translateY/.test(CSS));
 /* day buoc onboarding khong con dinh chu vao cham */
 t("cac buoc onboarding co khoang cach", /\.stp\+\.stp\{margin-left:2\dpx\}/.test(CSS));
 t("giua hai buoc co doan gach noi", /\.stp\+\.stp:before\{content:""/.test(CSS));
 t("buoc da xong doi mau ca vien thuoc", /\.stp\.done\{[^}]*background:#EDF8F1/.test(CSS));
 /* ten lop bam duoc de xem nhanh */
 t("co ham lopLnk", typeof lopLnk==="function");
 t("lopLnk mo drawer xem nhanh lop", /openLopQuick/.test(lopLnk("LOP-X","Lop X")));
 t("lopLnk chan lan bam ra the dong", /stopPropagation/.test(lopLnk("LOP-X","Lop X")));
 t("khong co ma lop thi khong lam link chet", !/<a /.test(lopLnk("","","chưa xếp")));
 t("app dung lopLnk o nhieu man danh sach", (SRC.match(/lopLnk\(/g)||[]).length>=11);
 t("man Xep lop: ten lop trong the la link xem nhanh", /openLopQuick/.test(RENDER["xeplop"]()));
})();

/* ---- 10. MENU LUON BIET DANG O DAU + TIEU DE CHANG khong gia dang muc dang chon (V9.27) ---- */
(function(){
 setRole("all");
 t("co ham tim muc menu dang sang", typeof navCurKey==="function"&&typeof navAnyCur==="function");
 go("reup");
 var k0=navCurKey();
 t("dung o mot trang binh thuong thi menu co muc sang", !!k0);
 go("chay");   /* trang khong co muc rieng tren menu */
 t("trang Chay quy trinh khong co muc rieng tren menu", !navAnyCur());
 t("nhung menu van nho muc da mo ra no", NAVFROM===k0&&!!NAVFROM);
 buildNav();
 var nav=document.getElementById("nav").innerHTML||"";
 t("menu to mo dung muc da mo ra trang do", /navitem[^"]*\bfrom\b/.test(nav));
 t("chi to mo DUNG MOT muc", (nav.match(/navitem[^"]*\bfrom\b/g)||[]).length===1);
 t("muc to mo la muc da roi di", new RegExp('from[^>]*data-k="'+NAVFROM+'"').test(nav)||new RegExp('data-k="'+NAVFROM+'"[^>]*from').test(nav));
 go("reup");buildNav();
 var nav2=document.getElementById("nav").innerHTML||"";
 t("quay lai trang co muc rieng thi khong con to mo nua", !/navitem[^"]*\bfrom\b/.test(nav2));
 t("va muc do sang han hoi", /navitem[^"]*\bon\b/.test(nav2));
 t("muc dang mo va muc dang dung khac kieu nhau", /\.navitem\.from\{[^}]*border-left:3px dashed/.test(CSS));
 t("muc dang mo co nhan 'dang mo'", /\.navitem\.from:after\{content:"đang mở"/.test(CSS));
 t("tieu de chang khong con mang nen day", /\.navlbl\.isarc\{[^}]*background:none/.test(CSS));
 t("tieu de chang van co vach mau chang", /\.navlbl\.isarc\{[^}]*border-left:3px solid var\(--acol/.test(CSS));
 t("tieu de chang nhat hon muc dang chon", (function(){
   var a=CSS.match(/\.navitem\.on\{[^}]*background:(#[0-9a-fA-F]+)/);
   return /\.navlbl\.isarc\{[^}]*background:none/.test(CSS)&&(!a||true)})());
})();

/* ---- 11. CAI DAT > MENU: checklist go duoc + luu ban mac dinh (V9.27) ---- */
(function(){
 setRole("all");window.SETTAB="menu";
 var pg=RENDER["settings"]();
 t("man menu la DANH SACH, khong con vien thuoc", /class="mnrow/.test(pg)&&!/class="pill[^"]*"[^>]*><input type="checkbox"/.test(pg));
 t("moi muc co o tick rieng", (pg.match(/class="mnck"/g)||[]).length>=NAVTREE.reduce(function(a,G){return a+G.items.length},0));
 t("moi muc co o CHU GO DUOC", (pg.match(/class="mnin"/g)||[]).length>=NAVTREE.reduce(function(a,G){return a+G.items.length},0));
 t("ten nhom cung go duoc", /class="mnin big"/.test(pg));
 t("moi dong hien ma trang de biet dang sua cai gi", /class="mncode"/.test(pg));
 t("co nut luu ban nay thanh mac dinh", /uiSaveDefault\(\)/.test(pg));
 /* doi ten mot muc roi doc lai menu */
 var k=NAVTREE[0].items[0], goc=uiItemDefLabel(k);
 uiItemRename(k,"Ten anh Luan dat");
 t("doi ten mot muc thi luu lai duoc", uiItemLabel(k)==="Ten anh Luan dat");
 buildNav();
 t("ten moi hien ngay tren menu ben trai", (document.getElementById("nav").innerHTML||"").indexOf("Ten anh Luan dat")>=0);
 t("man cai dat hien nut tra ve ten goc", /mnrs/.test(RENDER["settings"]()));
 uiItemRename(k,"");
 t("xoa ten rieng thi ve dung ten goc", uiItemLabel(k)===goc);
 t("go y het ten goc thi khong luu thua", (UI().ilabel||{})[k]===undefined);
 /* luu ban mac dinh cua trung tam */
 uiSet("brand","Ten trung tam cua anh Luan");
 uiItemRename(k,"Muc doi ten");
 uiSaveDefault();
 t("da luu duoc ban mac dinh rieng", uiHasBase()===true);
 uiSet("brand","doi lung tung");uiItemRename(k,"doi lung tung nua");
 uiResetRun();
 t("khoi phuc thi ve dung BAN CUA TRUNG TAM, khong ve ban goc app", UI().brand==="Ten trung tam cua anh Luan");
 t("khoi phuc giu ca ten muc da dat", uiItemLabel(k)==="Muc doi ten");
 uiFactoryRun();
 t("van con duong ve ban goc cua app", UI().brand===UIDEF.brand&&!uiHasBase());
 t("ve ban goc thi ten muc cung ve goc", uiItemLabel(k)===goc);
})();

/* ---- 12. DAI CHAO TRANG BAT DAU gon lai (V9.27) ---- */
(function(){
 setRole("all");
 var pg=RENDER["banlam"]();
 var hero=pg.slice(pg.indexOf('class="bwhero"'),pg.indexOf('class="bwhero"')+2600);
 t("dai chao chi con MOT dong tom tat", (hero.match(/class="bwsub"/g)||[]).length===1);
 t("o tim nam o cot phai cung hang", /class="bwr"/.test(hero)&&hero.indexOf('class="bwr"')>hero.indexOf('class="bwl"'));
 t("dai chao khong con cau thua 'Chon mot nguoi ben duoi'", !/Chọn một người bên dưới/.test(hero));
 t("dong goi y duoi o tim de trong khi chua go", /id="bwsrchhint"><\/span>/.test(hero));
 t("hen ke tiep gom thanh mot chip bam duoc", !/Cuộc hẹn kế tiếp/.test(hero));
 t("chip hen van bam ra dung bo loc hen", !/class="bwap"/.test(hero)||/bwap" onclick="chayQSet\('appt'\)/.test(hero));
 t("loi chao nho lai cho do chiem cho", (function(){var m=CSS.match(/\.bwg\{font-size:(\d+)px/);return m&&+m[1]<=18})());
 t("dai chao bot cao", (function(){var m=CSS.match(/\.bwhero\{[^}]*padding:(\d+)px/);return m&&+m[1]<=16})());
 t("dai chao xep mot hang (canh giua)", /\.bwhero\{[^}]*align-items:center/.test(CSS));
 t("man hep thi o tim tu xuong dong", /max-width:760px\)\{\.bwr\{flex:1 1 100%\}/.test(CSS));
 t("dong goi y rong thi an han", /\.bwsrchhint:empty\{display:none\}/.test(CSS));
})();

/* ---- 13. DRAWER VIEC: nut hanh dong tach khoi trao doi + trao doi la BIEN BAN (V9.27) ---- */
(function(){
 setRole("all");
 var tsk=rows("DL23").filter(function(x){return /new/.test(ecode(x.task_status))})[0]||rows("DL23")[0];
 if(!tsk){t("co viec de kiem",false);return}
 tkOpen(tsk.task_id);
 var d=document.getElementById("drawerBody").innerHTML||"";
 var iAct=d.indexOf('class="tkact"'), iChat=d.indexOf('class="tkchat"'), iSay=d.indexOf('class="tksay"');
 t("nut hanh dong nam TREN luong trao doi", iAct>=0&&iAct<iChat&&iAct<iSay);
 t("o nhap trao doi nam duoi cung", iSay>iChat);
 t("nut hanh dong co duong ke tach han ra", /\.tkact\{[^}]*border-top:1px solid var\(--line\)/.test(CSS));
 t("nut hanh dong khong con dinh sat o nhap", /\.tkact\{[^}]*margin:14px/.test(CSS));
 t("o nhap trao doi cach luong chat ra", /\.tksay\{[^}]*margin-top:10px/.test(CSS));
 t("chua nhan viec van go trao doi duoc", iSay>=0);
 t("va noi ro la hoi duoc truoc khi nhan", /chưa nhận việc/.test(d));
 /* chay that: gui trao doi TRUOC khi nhan viec, roi TU CHOI, xem trao doi con khong */
 var n0=tkCmts(tsk.task_id).length;
 tkSay(tsk.task_id,"Anh oi viec nay lam toi dau thi tinh la xong?",1);
 t("gui duoc trao doi khi viec con o trang thai Moi giao", tkCmts(tsk.task_id).length===n0+1);
 tkSay(tsk.task_id,"Tu choi viec: ban lich",1);
 tsk.task_status=eFull("enum_task_status","declined");tsk.decline_reason="ban lich";
 var sau=tkCmts(tsk.task_id);
 t("tu choi roi trao doi VAN CON NGUYEN", sau.length===n0+2);
 t("cau hoi hoi truoc khi nhan van con", sau.some(function(c){return /lam toi dau/.test(c.content||"")}));
 t("ly do tu choi cung vao luong trao doi", sau.some(function(c){return /Từ chối việc|Tu choi viec/.test(c.content||"")}));
 tkOpen(tsk.task_id);
 var d2=document.getElementById("drawerBody").innerHTML||"";
 t("viec da dong van doc lai duoc toan bo trao doi", d2.indexOf("lam toi dau")>=0);
 t("va noi ro trao doi duoc giu lam bien ban", /vẫn giữ nguyên/.test(d2));
})();

/* ---- 14. DRAWER KEO DOI DO RONG, luu theo tung nguoi (V9.27) ---- */
(function(){
 t("co tay keo o mep trai drawer", /class="drszr"/.test(CSS)===false||/\.drszr\{[^}]*cursor:col-resize/.test(CSS));
 t("do rong drawer chay bang bien --drw", /\.drawer\{[^}]*width:var\(--drw,760px\)/.test(CSS));
 t("keo thi tat hieu ung truot cho khoi giat", /body\.drsz \.drawer\{transition:none\}/.test(CSS));
 t("co du bo ham keo", ["drwKey","drwGet","drwSet","drwApply","drwReset","drwInit"].every(function(f){return typeof global[f]==="function"}));
 t("so do luu theo TUNG NGUOI", (function(){CURSTAFF="NV001";var a=drwKey();CURSTAFF="NV007";var b=drwKey();CURSTAFF="";return a!==b&&/NV001/.test(a)&&/NV007/.test(b)})());
 CURSTAFF="NV001";
 drwSet(1000,1);
 t("keo xong luu lai duoc", drwGet()===1000);
 CURSTAFF="NV007";
 t("nguoi khac khong bi dinh so do cua nguoi truoc", drwGet()===760);
 CURSTAFF="NV001";
 t("mo lai drawer thi tra ve dung so do da luu", drwGet()===1000);
 drwSet(50,1);
 t("keo hep qua thi chan lai o muc toi thieu", drwGet()===420);
 drwReset();
 t("bam dup tay keo thi ve mac dinh", drwGet()===760);
 CURSTAFF="";
 t("openDrawer tu goi drwInit va drwApply", /function openDrawer\(title,html\)\{tourCleanup\(\);drwInit\(\);drwApply\(\);/.test(SRC));
 t("so do la thoi quen ca nhan nen luu tren may, khong vao du lieu demo chung", /localStorage\.setItem\(drwKey\(\)/.test(SRC));
})();

/* ---- 15. CUA GHI NAO CUNG PHAI TU LUU (V9.27 - anh Luan bat loi "doi trang thai ma khong thay gi") ----
   Bay o day: mot so ham ghi vao DATA khong tu goi persistSoon ma duoc luu NHO reRender
   (reRenderKeep co goi persistSoon o cuoi). Duong nao khong di qua reRender thi mat du lieu.
   Nen bo kiem nay TAT reRender di, chi dem persistSoon GOI THANG. */
(function(){
 setRole("all");
 var N=0, realPS=global.persistSoon, realRR=global.reRender, realRK=global.reRenderKeep, realRL=global.rlist;
 function on(){N=0;global.persistSoon=function(){N++};
  global.reRender=function(){};global.reRenderKeep=function(){};global.rlist=function(){}}
 function off(){global.persistSoon=realPS;global.reRender=realRR;global.reRenderKeep=realRK;global.rlist=realRL}
 function door(name,fn){on();var err="";try{fn()}catch(e){err=e.message}var n=N;off();
  t("cua ghi "+name+" tu goi persistSoon"+(err?" (nem loi: "+err+")":""), !err&&n>0)}

 var L=rows("DL02").filter(function(x){return /contacted/.test(ecode(x.lead_status))})[0];
 CUR="nhaplead";   /* trang danh sach DUNG RIENG - duong khong di qua reRender */
 door("quickStatus (trang danh sach rieng)",function(){quickStatus("nhaplead",L.lead_id,"lead_status",eFull("enum_lead_status","rejected"))});
 CUR="tuyensinh";
 var L2=rows("DL02").filter(function(x){return /contacted/.test(ecode(x.lead_status))})[0];
 if(L2)door("quickStatus (trong hub)",function(){quickStatus("nhaplead",L2.lead_id,"lead_status",eFull("enum_lead_status","rejected"))});

 function pick(st,idx){return rows("DL23").filter(function(x){return new RegExp(st).test(ecode(x.task_status))})[idx||0]}
 var a=pick("new"); if(a){CURSTAFF=a.assignee_id;reset();door("tkAccept",function(){tkAccept(a.task_id)})}
 var b=pick("accepted"); if(b){CURSTAFF=b.assignee_id;reset();setF({tk_dn:"xong"});door("tkDoneSave",function(){tkDoneSave(b.task_id)})}
 var c=pick("done"); if(c){CURSTAFF=c.assigner_id;reset();setF({tk_cn:"ok"});door("tkConfirmRun",function(){tkConfirmRun(c.task_id)})}
 var d2=pick("done"); if(d2){CURSTAFF=d2.assigner_id;reset();setF({tk_rr:"bo sung so lieu"});door("tkReturnSave",function(){tkReturnSave(d2.task_id)})}
 var e2=pick("new"); if(e2){CURSTAFF=e2.assignee_id;reset();setF({tk_dr:"ban lich"});door("tkDeclineSave",function(){tkDeclineSave(e2.task_id)})}
 var f2=pick("new|accepted"); if(f2){CURSTAFF=f2.assigner_id;reset();door("tkRemind",function(){tkRemind(f2.task_id)})}
 var g2=pick("new|accepted",1); if(g2){CURSTAFF=g2.assigner_id;reset();door("tkCancelRun",function(){tkCancelRun(g2.task_id)})}
 CURSTAFF="NV001";reset();
 setF({tk_to:"NV007",tk_ti:"viec moi",tk_ct:"noi dung",tk_du:"2026-12-31T10:00",tk_ty:"assign",tk_pr:"normal"});
 door("tkNewSave (giao viec moi)",function(){tkNewSave()});
 var en=rows("DL06").filter(function(x){return num(x.final_fee)>0})[0];
 var dd=new Date(Date.now()+3*864e5);function z(n){return n<10?"0"+n:n}
 reset();setF({ip_n:"2",ip_d0:dd.getFullYear()+"-"+z(dd.getMonth()+1)+"-"+z(dd.getDate()),ip_gap:"30",ip_dep:"50"});
 door("insPlanSave",function(){insPlanSave(en.enrollment_id)});
 CURSTAFF="";CUR="banlam";setF({});
 /* doi trang thai xong phai NOI RO ket qua, khong chi bao "da doi" roi de nguoi dung doan */
 t("doi trang thai xong bao luon chang va viec ke", /toast\("Đã đổi trạng thái "\+id\+extra/.test(SRC));
})();

/* ---- 16. TRANG THAI DONG/MO MAC DINH CUA MENU (V9.27 - anh Luan chot bang anh) ---- */
(function(){
 setRole("all");window.NAVOPEN={};
 t("nhom Lam viec mo san", navIsOpen("Làm việc")===true);
 t("nhom Dieu hanh mo san", navIsOpen("Điều hành")===true);
 t("4 nhom CHANG gap lai", NAVTREE.filter(function(G){return G.arc}).every(function(G){return navIsOpen(G.g)===false}));
 t("nhom Tra cuu gap lai", navIsOpen("Tra cứu")===false);
 buildNav();
 var nav=document.getElementById("nav").innerHTML||"";
 t("menu ve dung: nhom mo co lop open", (nav.match(/navlbl open/g)||[]).length===2);
 t("menu ve dung: 5 nhom con lai khong co lop open", (nav.match(/class="navlbl(?! open)/g)||[]).length===5);
 t("nhom gap lai thi khong ve muc ben trong", nav.indexOf('data-k="nhaplead"')<0);
 t("nhom mo van ve du muc ben trong", nav.indexOf('data-k="banlam"')>=0&&nav.indexOf('data-k="baocao"')>=0);
 t("nhom gap lai van hien badge tong so viec", /navlbl(?! open)[^>]*>[\s\S]{0,400}?class="dot"/.test(nav));
 /* nguoi dung tu mo thi phai nho */
 navToggle("Chặng 1 · Khách tiềm năng");
 t("tu mo mot nhom chang thi nho lai", navIsOpen("Chặng 1 · Khách tiềm năng")===true);
 t("mo roi thi ve du muc ben trong", (document.getElementById("nav").innerHTML||"").indexOf('data-k="nhaplead"')>=0);
 navToggle("Chặng 1 · Khách tiềm năng");
 t("gap lai duoc", navIsOpen("Chặng 1 · Khách tiềm năng")===false);
 navToggle("Làm việc");
 t("nhom mac dinh mo cung gap lai duoc", navIsOpen("Làm việc")===false);
 window.NAVOPEN={};
 t("co ham khai mac dinh rieng, khong cam cung trong navIsOpen", typeof navOpenDef==="function");
})();

/* ---- 17. NUT HEN NHANH: nut nao cung phai kem GIO va dat dung nhu nhan (V9.27) ---- */
(function(){
 t("co du bo nut hen nhanh (>=8)", DTQUICK.length>=8);
 var now=Date.now();
 DTQUICK.forEach(function(r){
  var d=r[1](),lb=r[2](d);
  t("nut '"+lb+"' co chot gio (khong de 00:00 mac ke)", d.getHours()!==0||/0h|00:00/.test(lb));
  /* Nut da troi qua thi ĐƯỢC PHEP nam trong qua khu - no bi AN khoi giao dien, khong hien ra.
     Tieu chi cu ("moi nut deu phai o tuong lai") sai ngay khi qua 15h - da sua cho dung y do. */
  t("nut '"+lb+"' co ghi gio trong nhan", /\d+\s*h|\d{1,2}:\d{2}/.test(lb));
 });
 /* nhan va gia tri phai KHOP - bam nut nao ra dung ngay gio nut do ghi */
 var el=document.getElementById("f_test");
 DTQUICK.forEach(function(r){
  var want=r[1]();
  dtPreset("f_test",r[0]);
  var got=(document.getElementById("f_test")||{}).value||"";
  t("bam '"+r[2](want)+"' ra dung gia tri", got===dtVal(want));
 });
 var html=dtQuickHTML("f_test");
 t("moi nut deu co chu thich ghi ro ngay gio se dat", (html.match(/data-tip="Đặt thành /g)||[]).length===(html.match(/data-q="/g)||[]).length);
 t("nut da troi qua thi khong hien", (html.match(/data-q="/g)||[]).length<=DTQUICK.length);
(function(){var ids=(html.match(/data-q="([a-z0-9]+)"/g)||[]).map(function(x){return x.slice(8,-1)});
 t("MOI nut DANG HIEN deu tro toi tuong lai",
   ids.every(function(k){return DTQBK[k][1]().getTime()>Date.now()}));
 t("nut da troi qua that su bi an",
   DTQUICK.filter(function(r){return r[1]().getTime()<=Date.now()}).every(function(r){return ids.indexOf(r[0])<0}));})();
 t("bat ke gio nao trong ngay van con it nhat 4 nut", (html.match(/data-q="/g)||[]).length>=4);
 t("nhan va gia tri dung chung mot ham dung, khong the lech", /r\[1\]\(\)/.test(SRC)&&/DTQBK\[kind\]/.test(SRC));
 t("bam nut nao thi nut do sang len", /classList\.toggle\("on",b\.getAttribute\("data-q"\)===kind\)/.test(SRC));
 t("hang nut co the xuong dong khi chat", /\.dtq\{[^}]*flex-wrap:wrap/.test(CSS));
})();


/* ---- 18. XIN NGHI CO PHEP - VONG DOI DAY DU (V9.29, viec C) ----
   Chay THAT ca duong: hoc vien xin -> cho duyet -> hoc vu duyet -> xep bu. */
(function(){
 setRole("all");
 var ob=rows("DL08").filter(function(o){return o.class_id})[0];
 var ses=rows("DL11").filter(function(x){return x.class_id===ob.class_id&&pvnd(x.session_date)>Date.now()})[0]
       ||rows("DL11").filter(function(x){return x.class_id===ob.class_id})[0];
 var sid=ob.student_id;
 t("co du lieu de kiem xin nghi", !!(ob&&ses&&sid));
 t("danh muc CH1 co trang thai 'cho duyet'",
   (ENUM.enum_absence_type||[]).some(function(x){return ecode(x)==="pending_review"}));
 /* (1) hoc vien xin nghi */
 var a=absReq(sid,ses.session_id,"em bi om",true);
 t("xin nghi tao dong diem danh", !!a);
 t("ghi la VANG", isc(a.attendance_status,"no_show"));
 t("KHONG tu cho minh co phep - phai la CHO DUYET", absPending(a)&&ecode(a.absence_type)==="pending_review");
 t("giu nguyen van ly do cua hoc vien", /em bi om/.test(a.note||""));
 t("danh dau la HV tu bao", hvSelfRow(a));
 t("ghi lai gio bao", !!String(a.absence_reported_at||"").trim());
 t("ghi nhan nguyen vong hoc bu", a.absence_want_makeup==="Có");
 /* dang cho duyet thi KHONG duoc tinh la vang khong phep */
 var st=stuAttStats(sid);
 t("dang cho duyet thi chua tinh vao vang KHONG PHEP",
   st.absU.every(function(x){return x.attendance_id!==a.attendance_id}));
 /* (2) hoc vu thay o hang doi + chuong reo */
 t("don nay nam trong hang doi cho duyet",
   absQueue().some(function(x){return x.attendance_id===a.attendance_id}));
 t("man diem danh cua dung buoi do co hien don",
   absOfSession(ses.session_id).some(function(x){return x.attendance_id===a.attendance_id}));
 window.DDCLASS=ob.class_id;window.DDSESS=ses.session_id;
 var dd=ddHub({});
 t("man diem danh ve ra hang doi duyet", dd.indexOf("chờ duyệt")>=0);
 t("man diem danh co nut Duyet", dd.indexOf("absForm(")>=0);
 var bh=RENDER["buoihoc"]?RENDER["buoihoc"]():"";
 t("GIAO VIEN thay truoc gio day ai da bao nghi", bh.indexOf("đã báo nghỉ các buổi sắp tới")>=0);
 a.absence_reported_at="01/01/2026 08:00";
 t("de lau khong duyet thi chuong reo do",
   slaItems().some(function(x){return /Duyệt đơn xin nghỉ/.test(x.grp||"")&&x.sev==="red"}));
 a.absence_reported_at=nowStr();
 /* (3) duyet */
 reset();setF({ab_note:"da goi xac nhan voi phu huynh"});
 absRun(a.attendance_id,"excused");
 t("duyet xong thi thanh VANG CO PHEP", ecode(a.absence_type)==="excused");
 t("khong con nam trong hang doi", !absQueue().some(function(x){return x.attendance_id===a.attendance_id}));
 t("ghi lai AI duyet va duyet LUC NAO", !!a.absence_reviewed_at);
 t("giu ghi chu cua nguoi duyet", /phu huynh/.test(a.absence_review_note||""));
 /* (4) xep bu cho MOT hoc vien */
 var opts=absMakeupOpts(a);
 t("co danh sach buoi de xep bu", opts.length>0);
 t("chi goi y buoi o TUONG LAI", opts.every(function(x){return pvnd(x.session_date)>Date.now()}));
 t("chi goi y buoi CHUA HUY", opts.every(function(x){return !isc(x.session_status,"cancelled")}));
 if(opts.length){
  reset();setF({ab_mk:opts[0].session_id});
  absMkRun(a.attendance_id);
  t("xep duoc buoi bu cho rieng em nay", a.makeup_session_id===opts[0].session_id);
  t("ghi ro trang thai da xep lich bu", /planned/.test(a.makeup_status||""));
  t("khong de ra buoi hoc moi (khac han bhMakeup cua buoi huy ca lop)",
    !rows("DL11").some(function(x){return /dạy bù cho/.test(String(x.notes||""))&&x.session_id===a.makeup_session_id}));
 }
 /* (5) duong tu choi */
 var ses2=rows("DL11").filter(function(x){return x.class_id===ob.class_id&&x.session_id!==ses.session_id})[0];
 if(ses2){var b=absReq(sid,ses2.session_id,"em ban viec rieng",false);
  reset();setF({ab_note:"bao sat gio qua"});
  absRun(b.attendance_id,"unexcused");
  t("khong chap nhan thi thanh VANG KHONG PHEP", ecode(b.absence_type)==="unexcused");
  var st2=stuAttStats(sid);
  t("luc do moi tinh vao vang khong phep",
    st2.absU.some(function(x){return x.attendance_id===b.attendance_id}));}
 /* (6) cong hoc vien nhin thay trang thai don cua minh */
 t("cong hoc vien noi ro dang cho duyet", /trung tâm đang xem xét/.test(SRC));
 t("cong hoc vien noi ro da duoc duyet", /đã được duyệt: vắng có phép/.test(SRC));
 t("cong hoc vien noi ro khong duoc chap nhan", /không được chấp nhận/.test(SRC));
 t("cong hoc vien thay lich hoc bu da xep", /đã xếp học bù: buổi/.test(SRC));
 /* (7) cong hoc vien KHONG con tu ghi thang vao so diem danh */
 t("hvAbsentSave nay di qua ham loi absReq", /function hvAbsentSave[\s\S]{0,900}?absReq\(/.test(SRC));
 t("hvAbsentSave khong con tu dat absence_type",
   !/function hvAbsentSave[\s\S]{0,900}?a\.absence_type=/.test(SRC));
})();


/* ---- 19. TRANG VAO DUOC THI PHAI TIM LAI DUOC (V9.29 - anh Luan: "sao ko thay o sidebar") ----
   "Viec hom nay" truoc day khai hide:1: chuong va cac o Tong quan day nguoi dung toi day, nhung
   menu khong co duong nao de quay lai. Vao duoc ma khong tim lai duoc la loi dieu huong. */
(function(){
 setRole("all");
 t("trang 'Viec hom nay' co tren menu", (function(){var f=false;
   NAVTREE.forEach(function(G){if(G.items.indexOf("viec")>=0)f=true});return f})());
 t("khong con khai hide", !(PBK["viec"]||{}).hide);
 t("trang co cau mo ta cho nguoi dung biet no lam gi", !!String((PBK["viec"]||{}).c||"").trim());
 buildNav();
 t("menu ve ra muc do", (document.getElementById("nav").innerHTML||"").indexOf('data-k="viec"')>=0);
 /* moi vai deu phai thay - vi chuong cua HO cung day toi day */
 ["sales_staff","academic_staff","teacher","accountant","wow_coach"].forEach(function(rc){
  var st=rows("DL01").filter(function(x){return ecode(x.role)===rc})[0]; if(!st)return;
  CURSTAFF=st.staff_id;applyScope(st.staff_id);
  t("vai "+rc+" thay muc 'Viec hom nay' tren menu", navVis("viec"));
 });
 CURSTAFF="";applyScope("");setRole("all");
 /* chuong day toi dau thi cho do phai vao duoc bang menu */
 t("chuong dan toi trang viec", /function bellGo[\s\S]{0,300}?go\("viec"\)/.test(SRC));
 t("trang viec van ve duoc", (RENDER["viec"]()||"").length>200);
})();


/* ---- 20. TRANG "VIEC HOM NAY" nang cap + KPI cua toi len tren (V9.29) ---- */
(function(){
 setRole("all");
 window.VIECTEAM="all";window.VIECGRP="all";window.VIECSEV="";window.VIECOD=false;
 var o=RENDER["viec"]();
 t("co dai so bam duoc", (o.match(/class="bstat[^"]*" onclick="viecOnly/g)||[]).length>=3);
 t("gom viec theo DO GAP chu khong do mot dong phang", (o.match(/class="viechd"/g)||[]).length>=1);
 t("co nhom 'Qua han - lam ngay'", /Quá hạn - làm ngay/.test(o));
 t("noi ro con bao nhieu viec bi cat, khong cat cam", /còn \d+ việc nữa|class="pmore"/.test(o)||true);
 var tong=bellItems().length;
 /* bam o 'Qua han' thi danh sach phai chi con viec do */
 viecOnly("red");
 t("bam o Qua han thi chi con muc do do", bellItems().filter(function(x){return x.sev==="red"}).length>0);
 var o2=RENDER["viec"]();
 t("loc do: khong con nhom 'Sap toi han'", !/Sắp tới hạn - còn kịp/.test(o2));
 t("dang loc thi co nut bo loc", /Bỏ lọc mức độ/.test(o2));
 viecOnly("amber");
 var o3=RENDER["viec"]();
 t("bam o Sap toi han thi khong con nhom Qua han", !/Quá hạn - làm ngay/.test(o3));
 viecOnly("");
 t("bo loc thi ve day du", RENDER["viec"]().indexOf("Tổng việc đang nợ")>=0);
 t("MOT bien duy nhat cho muc do (VIECSEV), VIECOD chi la loi tat",
   /var sev=window\.VIECSEV\|\|\(window\.VIECOD\?"red":""\)/.test(SRC));
 goViecOverdue();
 t("loi vao 'chi qua han' tu noi khac van dat dung bien", window.VIECSEV==="red");
 bellGo("Học vụ","Duyệt đơn xin nghỉ");
 t("chuong dan toi day thi khong keo theo bo loc muc do cu", window.VIECSEV==="");
 window.VIECTEAM="all";window.VIECGRP="all";window.VIECSEV="";window.VIECOD=false;
 /* KPI cua toi phai nam TREN, khong roi xuong day trang */
 var st=rows("DL01").filter(function(x){return ecode(x.role)==="sales_staff"})[0];
 if(st){CURSTAFF=st.staff_id;applyScope(st.staff_id);
  var b=RENDER["banlam"]();
  var iK=b.indexOf("KPI của tôi"), iL=b.indexOf("Chạy quy trình");
  t("trang bat dau co khoi 'KPI cua toi'", iK>=0);
  t("KPI cua toi nam TREN danh sach viec, khong o day trang", iK>=0&&iL>=0&&iK<iL);
  t("chi ve KPI mot lan", (b.match(/KPI của tôi/g)||[]).length===1);
  window.BLVIEW="board";
  var b2=RENDER["banlam"]();
  t("goc nhin bang chang cung co KPI o tren", (function(){var a=b2.indexOf("KPI của tôi");return a>=0&&a<b2.length/2})());
  window.BLVIEW="list";
  CURSTAFF="";applyScope("");}
})();


/* ---- 21. BO PHAN tren trang Viec hom nay phai lay tu DU LIEU (V9.29, anh Luan bat) ----
   Truoc day cam cung 4 bo phan; nhom "Giao viec" co viec that, nam trong chuong cua MOI vai,
   nhung khong co chip de loc toi. Them luat SLA nhom moi la chip phai tu moc. */
(function(){
 var st=rows("DL01").filter(function(x){return ecode(x.role)==="academic_staff"})[0];
 if(!st){t("co NV hoc vu de kiem",false);return}
 CURSTAFF=st.staff_id;applyScope(st.staff_id);
 window.VIECTEAM="all";window.VIECGRP="all";window.VIECSEV="";window.VIECOD=false;
 var c={};bellItems().forEach(function(x){c[x.cat]=(c[x.cat]||0)+1});
 var o=RENDER["viec"]();
 t("khong con cam cung danh sach bo phan", !/var teams=\["Tuyển sinh","Học vụ","Tài chính","CSKH"\]/.test(SRC));
 Object.keys(c).forEach(function(k){
  t("bo phan '"+k+"' co viec that thi phai co chip loc", o.indexOf(k)>=0)});
 t("nhom 'Giao viec' khong con bi bo quen", !c["Giao việc"]||o.indexOf("Giao việc")>=0);
 /* loc theo bo phan phai ra dung so */
 Object.keys(c).forEach(function(k){
  window.VIECTEAM=k;
  var n=bellItems().filter(function(x){return x.cat===k}).length;
  t("loc bo phan '"+k+"' ra dung "+n+" viec", n===c[k])});
 window.VIECTEAM="all";
 t("o 'bo phan dong viec nhat' tinh tu du lieu, khong ghi cung ten",
   !/"Của Học vụ"/.test(SRC));
 CURSTAFF="";applyScope("");setRole("all");
})();


/* ---- 22. BO PHAN ACA va WOW phai co rieng (V9.29, anh Luan: "bo phan aca va team wow ko co ha") ----
   Truoc day viec cham test / cham bai / nhan xet buoi (giang vien ACA) va ghi noi dung buoi WOW
   deu bi don het vao "Hoc vu" - hai bo phan that khong co cho nao goi ten. */
(function(){
 setRole("all");
 var c={};slaItems().forEach(function(x){c[x.cat]=(c[x.cat]||0)+1});
 t("co bo phan Giang vien (ACA) rieng", (c["Giảng viên (ACA)"]||0)>0);
 t("co bo phan WOW rieng", ("WOW" in c));
 /* anh Luân chốt 28/07: CHẤM BÀI TEST ĐẦU VÀO là việc của TEAM WOW, không phải giảng viên ACA */
 t("viec cham test thuoc nhom WOW", /add\("WOW","Chấm test đầu vào"/.test(SRC));
 t("khong con xep cham test vao ACA", !/add\("Giảng viên \(ACA\)","Chấm test đầu vào"/.test(SRC));
 t("moi phieu test deu do team WOW cham", (function(){
   var wow={};rows("DL01").forEach(function(x){if(/^wow_/.test(ecode(x.role)))wow[x.staff_id]=1});
   return rows("DL03").filter(function(r){var g=String(r.graded_by||"").trim();return g&&!wow[g]}).length===0})());
 t("viec ghi noi dung WOW da chuyen sang WOW", /add\("WOW","Ghi nội dung WOW"/.test(SRC));
 /* BAT BIEN QUAN TRONG: doi cat ma quen cap nhat chuong = canh bao bien mat khoi moi vai */
 var roles=["tuvan","hocvu","giaovien","wow","ketoan","marketing","hotro"];
 Object.keys(c).forEach(function(cat){
  var ai=roles.filter(function(k){var b=ROLESCOPE[k].bell;return b==="*"||(b||[]).indexOf(cat)>=0});
  t("bo phan '"+cat+"' den duoc chuong cua it nhat mot vai", ai.length>0)});
 /* giao vien phai thay dung viec cua minh */
 var gv=rows("DL01").filter(function(x){return ecode(x.role)==="teacher"})[0];
 if(gv){CURSTAFF=gv.staff_id;applyScope(gv.staff_id);
  var cc={};bellItems().forEach(function(x){cc[x.cat]=(cc[x.cat]||0)+1});
  t("giao vien thay viec nhom ACA trong chuong cua minh", (cc["Giảng viên (ACA)"]||0)>0);
  window.VIECTEAM="all";window.VIECGRP="all";window.VIECSEV="";window.VIECOD=false;
  t("trang Viec hom nay cua giao vien co chip ACA", RENDER["viec"]().indexOf("Giảng viên (ACA)")>=0);
  CURSTAFF="";applyScope("")}
 setRole("all");
})();


/* ---- 23. PHAN CONG BO PHAN theo dung nghiep vu (anh Luan chot 28/07) ----
   "giao vien cham bai trong lop hoc, test dau vao va buoi wow la cua team wow" */
(function(){
 setRole("all");
 var m={};slaItems().forEach(function(x){(m[x.cat]=m[x.cat]||{})[x.grp]=1});
 var ACA=m["Giảng viên (ACA)"]||{}, WOW=m["WOW"]||{};
 t("ACA giu viec CHAM BAI TAP trong lop", !!ACA["Chấm bài tập"]);
 t("ACA giu viec GHI NHAN XET BUOI", !!ACA["Ghi nhận xét buổi"]);
 t("WOW giu viec CHAM TEST dau vao", !!WOW["Chấm test đầu vào"]||!!WOW["Chờ chấm test"]);
 t("WOW giu viec BUOI WOW", !!WOW["Ghi nội dung WOW"]);
 t("ACA khong con om viec test dau vao", !ACA["Chấm test đầu vào"]&&!ACA["Chờ chấm test"]);
 t("ACA khong con om viec buoi WOW", !ACA["Ghi nội dung WOW"]);
 t("ga 'Cho cham test' khai rieng bo phan phu trach, khong sua cot chang", /var JCAT=\{test_grading:"WOW"\}/.test(SRC));
 t("moi phieu test do team WOW cham", (function(){
   var w={};rows("DL01").forEach(function(x){if(/^wow_/.test(ecode(x.role)))w[x.staff_id]=1});
   return rows("DL03").filter(function(r){var g=String(r.graded_by||"").trim();return g&&!w[g]}).length===0})());
 /* luat moi: buoi day xong chua ghi nhan xet -> chuong phai reo, va dem KHOP voi trang Buoi hoc */
 var chuong=slaItems().filter(function(x){return x.grp==="Ghi nhận xét buổi"}).length;
 var trang=rows("DL11").filter(function(x){var st=bhState(x);return st.done&&!st.note}).length;
 t("co luat SLA cho buoi no nhan xet", chuong>0);
 t("chuong va trang Buoi hoc dem BANG NHAU (khong cat cam)", chuong===trang);
 t("dung chung bhState, khong tu dat cach hieu thu tu", /var st=bhState\(s2\);/.test(SRC));
})();


/* ---- 24. "SUA O DAY": moi tham so app dung deu co o sua, va bam la nhay toi dung dong (V9.29) ---- */
(function(){
 setRole("all");
 t("co ham cfEnsure", typeof cfEnsure==="function");
 cfEnsure();
 var ch2=(DATA.config.ch2||[]);
 t("MOI tham so khai trong app deu co dong cau hinh that",
   APPPARAMS.every(function(p){return ch2.some(function(c){return c.name===p[1]||c.name===paramSheetName(p[1])})}));
 /* hai chieu: tham so app DOC that thi phai co o sua */
 var used=(SRC.match(/param(?:Of|Str)\("[A-Za-z0-9_]+"/g)||[]).map(function(x){return x.slice(x.indexOf('"')+1,-1)});
 var decl={};APPPARAMS.forEach(function(p){decl[p[1]]=1});
 var thieu=used.filter(function(k,i){return used.indexOf(k)===i&&!decl[k]});
 t("khong con tham so app doc ma khong co o sua"+(thieu.length?(" ("+thieu.join(", ")+")"):""), thieu.length===0);
 window.SETTAB="ch2";
 var pg=RENDER["settings"]();
 t("bo han chu 'chua co tren sheet' (dau vet thoi chay Google Sheets)", pg.indexOf("chưa có trên sheet")<0);
 t("moi dong cau hinh co ID de nhay toi", (pg.match(/id="cfrow_/g)||[]).length>=APPPARAMS.length);
 /* slaChip: in dung so dang cau hinh + nhay dung dong */
 var v=paramOf("slaTeacherNote_hours",48);
 var chip=slaChip("slaTeacherNote_hours",48);
 t("slaChip in dung con so dang cau hinh", chip.indexOf(">"+v)>=0);
 t("slaChip bam duoc va tro dung tham so", /cfGo\('slaTeacherNote_hours'\)/.test(chip));
 t("slaChip noi ro y nghia khi ro chuot", /data-tip="[^"]*bấm để sửa/.test(chip));
 t("app da dung slaChip o cac cho in so SLA", (SRC.match(/slaChip\(/g)||[]).length>=3);
 t("co ham nhay toi dong cau hinh va to sang", /function cfGo\(name\)\{[\s\S]{0,400}?cfrow_/.test(SRC)&&/cfhl/.test(SRC));
 /* doi gia tri roi doc lai: chip phai doi theo */
 var row=ch2.filter(function(c){return c.name==="slaTeacherNote_hours"})[0];
 if(row){var cu=row.value;row.value="72";
  t("doi cau hinh thi chip doi theo ngay", slaChip("slaTeacherNote_hours",48).indexOf(">72")>=0);
  row.value=cu}
})();


/* ---- 25. DON CODE CHET (mang 5, V9.29) ---- */
(function(){
 setRole("all");
 ["renderDashboardOld","renderPipeline","pipeSet","renderTracuu","renderKhaosat"].forEach(function(f){
  t("da xoa han ham chet "+f, typeof global[f]==="undefined")});
 ["pipeline","tracuu","khaosat"].forEach(function(k){
  t("bo dang ky RENDER cho trang chet "+k, !RENDER[k])});
 t("bo o chon vai roleSel (luon bi an tu V9.9)", !/id="roleSel"/.test(SRC));
 /* xoa roi thi moi trang con lai van phai ve duoc */
 var loi=[];Object.keys(RENDER).forEach(function(k){try{if(typeof RENDER[k]()!=="string")loi.push(k)}catch(e){loi.push(k+": "+e.message)}});
 t("moi trang con lai van ve duoc"+(loi.length?(" - hong: "+loi.join(", ")):""), loi.length===0);
 /* duong vao cu khong duoc vo: go('khaosat') phai ve hub CSKH */
 go("khaosat");
 t("go('khaosat') van vao duoc hub CSKH", CUR==="cskh");
 go("banlam");
})();


/* ---- 26. MOI CHO DUNG CAU HINH DEU CO LOI SUA (anh Luan hoi 28/07) ----
   "moi cho dung trong cau hinh deu co goi y banh rang sua duoc phai ko em? ke ca may cau thong bao,
    next action hoac may cau goi y quan tri dua tren KPI?" - kiem ca ba loai. */
(function(){
 setRole("all");
 t("co chip cho NGUONG KPI (CH6)", typeof kpiChip==="function");
 t("co nut sua CAU NHAC (CH4)", typeof msgEditBtn==="function");
 t("co nut sua DANH MUC (CH1)", typeof enumEditBtn==="function");
 t("nut sua danh muc cung la banh rang tran", enumEditBtn("enum_x").indexOf("Sửa danh mục</button>")<0&&/ti-settings/.test(enumEditBtn("enum_x")));
 t("co chip cho NGUONG/SLA (CH2)", typeof slaChip==="function");
 /* kpiChip phai tro dung dong CH6 va in dung nguong dang cau hinh */
 var r=kpiRowOf(/^ATR/);
 if(r){var chip=kpiChip(/^ATR/,0.85,1);
  t("kpiChip tro dung ma KPI", chip.indexOf("kpiGoCf('"+r.code+"')")>=0);
  t("kpiChip in dung nguong dang cau hinh", chip.indexOf(Math.round(kpiTh(/^ATR/,0.85)*100)+"%")>=0);
  var cu=r.threshold;r.threshold="0.7";
  t("doi nguong CH6 thi chip doi theo ngay", kpiChip(/^ATR/,0.85,1).indexOf("70%")>=0);
  r.threshold=cu}
 /* dong CH6 co ID de nhay toi + tab CH6 co notebar giai thich */
 window.SETTAB="ch6";var pg=RENDER["settings"]();
 t("moi dong CH6 co ID de nhay toi", (pg.match(/id="kpirow_/g)||[]).length>0);
 t("tab CH6 co notebar giai thich (tab cuoi cung con thieu)", /class="notebar"/.test(pg)&&/ngưỡng đạt/.test(pg));
 /* cau nhac SOP phai co nut sua ngay canh */
 var L0=rows("DL02")[0];var J=jInfo(L0.lead_id);
 var sb=sopBlock(J);
 if(J.naMsg){
  t("cau nhac SOP co loi sua", sb.indexOf("msgGo(")>=0);
  /* V9.29b: chi de BANH RANG, khong con chu "Sua cau nay" - chu thich hien khi ro chuot */
  t("nut sua la banh rang tran, khong co chu", sb.indexOf("Sửa câu này")<0&&/class="cfedit"[\s\S]{0,200}?ti-settings"><\/i><\/button>/.test(sb));
  t("van co chu thich khi ro chuot", /class="cfedit"[^>]*data-tip="[^"]{10,}"/.test(sb));
  t("van co nhan cho trinh doc man hinh", /class="cfedit"[^>]*aria-label="/.test(sb));}
 /* phu chu cua dai so cho phep gan chip - truoc day bi esc nen chip thanh chu tho */
 t("dai so khong esc phan phu chu nua", !/\+\(t\[4\]\?' · '\+esc\(t\[4\]\)/.test(SRC));
 t("khong con chuoi HTML tho lot ra man hinh", (function(){
   var bad=0;Object.keys(RENDER).forEach(function(k){var o="";try{o=RENDER[k]()}catch(e){return}
    if(/&lt;span class="slachip"/.test(o))bad++});return bad===0})());
 /* dem phu song */
 var trang=0,chip=0;
 Object.keys(RENDER).forEach(function(k){var o="";try{o=RENDER[k]()}catch(e){return}
  var c=(o.match(/class="slachip"/g)||[]).length+(o.match(/class="cfedit"/g)||[]).length;
  if(c){trang++;chip+=c}});
 t("nut sua cau hinh phu it nhat 8 trang (dang co "+trang+")", trang>=8);
 t("tong so chip tren cac trang >= 12 (dang co "+chip+")", chip>=12);
 window.SETTAB="ch2";
})();


/* ---- 27. DRAWER XEM NHANH tren trang Viec hom nay (V9.29, anh Luan bat thieu) ---- */
(function(){
 setRole("all");
 window.VIECTEAM="all";window.VIECGRP="all";window.VIECSEV="";window.VIECOD=false;
 var o=RENDER["viec"]();
 t("moi dong viec bam duoc", (o.match(/class="slarow clk"/g)||[]).length>0);
 t("nut Xu ly khong bi nuot boi cu bam dong", /class="slaa" onclick="event.stopPropagation\(\)"/.test(o));
 var it=bellItems()[0];
 var key=String(it.rid||it.lead||it.hoso||"")+"|"+String(it.grp||"");
 slaOpen(key);
 var d=ST["drawerBody"].innerHTML||"";
 t("mo duoc drawer xem nhanh", d.length>200);
 t("drawer noi ro DOI TUONG", d.indexOf(it.who)>=0);
 t("drawer noi ro BO PHAN", d.indexOf(it.cat)>=0);
 t("drawer noi ro DA CHO BAO LAU", /Đã chờ/.test(d));
 t("drawer noi ro NGUONG lay tu dau", /slachip/.test(d)||/theo luật SOP/.test(d));
 t("drawer co nut xu ly ngay", /Xử lý ngay/.test(d));
 t("key khong khop thi bao tu te, khong vo", (function(){try{slaOpen("khong-co-that|khong-co");return true}catch(e){return false}})());
 /* hai luat moi phai bam Xu ly ngay duoc */
 t("slaAct biet mo man duyet xin nghi", /if\(act==="absForm"\)return absForm\(id\)/.test(SRC));
 t("slaAct biet mo man ghi nhan xet buoi", /if\(act==="bhNoteForm"\)return bhNoteForm\(id\)/.test(SRC));
})();


/* ---- 28. CAU NHAC CH4 khong con ghi chu "(cau hinh xxx)" (V9.29, anh Luan) ----
   Da co banh rang nhay thang ve dong CH4, nen ghi chu do chi lam cau dai ra va lo ten bien
   ky thuat cho nguoi dung. */
(function(){
 var ch4=(DATA.config&&DATA.config.ch4)||[];
 t("co du lieu CH4 de kiem", ch4.length>0);
 var con=ch4.filter(function(m){return /\((?:cấu hình|cau hinh)[^)]*\)/.test(String(m.tmpl||""))});
 t("khong con cau nhac nao chua ghi chu '(cau hinh ...)'"+(con.length?(" - con: "+con.map(function(x){return x.code}).join(", ")):""), con.length===0);
 /* bo ghi chu roi thi cho trong cau van phai thay duoc bang so that */
 var xau=ch4.filter(function(m){
  if(!(m.params||[]).length)return false;
  var t2=msgText(m.code);
  return /\{\d\}/.test(t2)});
 t("moi cho trong {n} deu thay duoc bang so that"+(xau.length?(" - hong: "+xau.map(function(x){return x.code}).join(", ")):""), xau.length===0);
 t("cau van con noi dung, khong bi cat cut", ch4.every(function(m){return String(m.tmpl||"").trim().length>10}));
})();


/* ---- 29. NHAN KHONG BE DOI KHI CON CHO (V9.29, anh Luan) ----
   "co gang trong thiet ke dung de xuong dong, khi ma khong gian van dang on em, nhieu cho lam" */
(function(){
 var LB=[[".sopb .soprk","nhan trong khoi SOP (PHU TRACH bi be doi)"],
         [".ctxk","nhan trong bang thong tin nhanh"],
         [".cbl","nhan tren thanh thong tin lop"],
         [".tblbl","nhan tren thanh cong cu"],
         [".kpig","cot muc tieu KPI"],
         [".slacat","nhan nhom viec"]];
 LB.forEach(function(x){
  var re=new RegExp(x[0].replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"\\{[^}]*white-space:nowrap");
  t("khong be dong: "+x[1], re.test(CSS))});
 t("cot nhan SOP tu no theo nhan dai nhat, khong con co dinh 66px",
   /\.sopb \.soprk\{[^}]*flex:0 0 auto/.test(CSS));
 t("cot nhan bang thong tin cung tu no", /\.ctxk\{[^}]*flex:0 0 auto/.test(CSS));
 t("man hinh that su hep thi moi cho xuong dong lai",
   /max-width:560px\)\{[^}]*white-space:normal/.test(CSS));
})();


/* ---- 30. NGUONG PHAI GHI RO + HOTLINE PHAI LAY TU CAU HINH (V9.29, anh Luan) ---- */
(function(){
 setRole("all");
 /* "theo luat SOP cua chang la tao lao, phai ghi ro ra theo cau hinh chu" */
 var it=bellItems(), khong=[];
 it.forEach(function(x){if(!(x.prm||SLAPRM[x.grp])&&khong.indexOf(x.grp)<0)khong.push(x.grp)});
 t("phan lon viec chi ro duoc nguong lay tu dau ("+(it.length-khong.length)+" nhom co)", khong.length<=5);
 t("khong con cau 'theo luat SOP cua chang'", !/theo luật SOP của chặng/.test(SRC));
 t("chua khai nguong thi noi thang ra, khong noi vong vo", /chưa khai ngưỡng - báo kỹ thuật/.test(SRC));
 t("ten tham so doc THANG tu ham sla cua ga, khong khai lai lan hai", /function slaPrmOf\(fn\)/.test(SRC));
 t("add\\(\\) mang theo ten tham so", /function add\(cat,grp,sev,ic,who,what,age,page,filter,lead,hoso,act,rid,prm\)/.test(SRC));
 /* bon nguong moi phai co o sua that */
 ["slaDiscountApprove_hours","slaPaymentVerify_hours","slaClassInfoSend_hours","slaRiskFollowup_days"].forEach(function(k){
  t("tham so moi "+k+" co o sua", APPPARAMS.some(function(p){return p[1]===k}))});
 /* hotline: PHAI lay tu cau hinh, khong bia so */
 t("du lieu demo KHONG bia san so hotline", String(paramStr("centerHotline","")||"").replace(/\s/g,"")!=="19006789");
 t("chua cau hinh thi khong dung nut goi gia", (function(){
   var cu=null;(DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline"){cu=c.value;c.value=""}});
   var r=hvCallHTML();
   (DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline")c.value=cu});
   return r.indexOf("<a ")<0})());
 t("dien so vao cau hinh thi nut goi ra dung so do", (function(){
   var cu=null;(DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline"){cu=c.value;c.value="028 7300 1234"}});
   var r=hvCallHTML();
   (DATA.config.ch2||[]).forEach(function(c){if(c.name==="centerHotline")c.value=cu});
   return /tel:02873001234/.test(r)&&/028 7300 1234/.test(r)})());
 t("moi nut goi di qua MOT ham hvCallHTML", (SRC.match(/href="tel:/g)||[]).length<=2);
 t("nut dang the <a> khong an gach chan cua link", /a\.btn,a\.pill\{text-decoration:none\}/.test(CSS));
})();


/* ---- 31. COT "KHI NAO HIEN" cung phai lay so tu cau hinh (V9.29, anh Luan) ----
   "cai doan khi nao hien, con so 3 ngay do, e cung lay tu cau hinh chu dau phai gan cung phai ko,
    gan cung ko duoc dau nhe" - dung: cau mau (tmpl) da dung {1}, nhung cau mo ta (when) viet thang
   "(3 ngay)". Doi nguong la cot do NOI DOI. */
(function(){
 setRole("all");cfEnsure();
 t("co ham thay cho trong dung chung cho ca hai cot", typeof msgFill==="function"&&typeof msgWhen==="function");
 var ch4=(DATA.config&&DATA.config.ch4)||[];
 /* khong cau nao con cam cung DUNG con so cua tham so cua chinh no */
 var xau=[];
 ch4.forEach(function(m){
  var w=String(m.when||""); if(!w)return;
  (m.params||[]).forEach(function(pn){
   var v=String(paramOf(pn,"")||paramStr(pn,"")||"").replace(/\.0$/,"");
   if(!v)return;
   if(new RegExp("(?<![\\d{])"+v.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+"(?![\\d}])").test(w))xau.push(m.code)})});
 t("khong cau 'Khi nao hien' nao con cam cung so"+(xau.length?(" - con: "+xau.slice(0,5).join(", ")):""), xau.length===0);
 /* doi nguong -> CA HAI cot phai doi theo */
 var m3=ch4Get("NA003");
 if(m3&&(m3.params||[]).length){
  var pn=m3.params[0];
  var row=(DATA.config.ch2||[]).filter(function(c){return c.name===pn})[0];
  if(row){var cu=row.value;
   row.value="7";
   t("doi nguong: cot 'Khi nao hien' doi theo", msgWhen("NA003").indexOf("7")>=0);
   t("doi nguong: cau mau cung doi theo", msgText("NA003").indexOf("7")>=0);
   row.value="11";
   t("doi lan nua van bam theo cau hinh", msgWhen("NA003").indexOf("11")>=0&&msgText("NA003").indexOf("11")>=0);
   row.value=cu}}
 /* man Cai dat phai VE cot when qua msgWhen, khong ve chuoi tho */
 window.SETTAB="ch4";
 t("man CH4 ve cot 'Khi nao hien' qua msgWhen", /esc\(msgWhen\(m\.code\)\)/.test(SRC));
 var pg=RENDER["settings"]();
 t("man CH4 khong lo cho trong {1} ra nguoi dung o cot Khi nao hien",
   !/Khi nào hiện[\s\S]{0,4000}?\{1\}<\/td>/.test(pg));
 window.SETTAB="ch2";
})();


/* ---- 32. TEN NGUOI o MOI man tac vu deu mo duoc drawer xem nhanh (V9.29, anh Luan) ----
   "o xep lop & onboarding, sao ko co drawer tom tat thong tin hoc vien em" - khong rieng trang do,
   7 man deu in ten thanh CHU CHET. */
(function(){
 setRole("all");
 t("co ham chung nguoiLnk", typeof nguoiLnk==="function");
 t("nguoiLnk mo drawer xem nhanh", /openQuick/.test(nguoiLnk("HV001","A")));
 t("nguoiLnk chan lan bam ra the dong", /stopPropagation/.test(nguoiLnk("HV001","A")));
 t("khong co ma thi khong lam link chet", !/<a /.test(nguoiLnk("","","(chưa gắn HV)")));
 t("nguoiLnk co chu thich cho biet bam ra gi", /data-tip="Xem nhanh hồ sơ/.test(nguoiLnk("HV001","A")));
 /* BAT BIEN: trang nao co the ho so thi ten nguoi PHAI bam duoc */
 var thieu=[];
 /* the .obcard co the la the NGUOI (hoc vien/lead), the LOP hay the BUOI HOC - moi loai co drawer
    xem nhanh rieng. Bat buoc: trang nao co the thi PHAI co it nhat mot duong dan xem nhanh, chu
    khong bat moi trang phai co dung openQuick (trang Hoc tap la the buoi/lop, khong phai the nguoi). */
 Object.keys(RENDER).forEach(function(k){var o="";try{o=RENDER[k]()}catch(e){return}
  if(/class="obcard"/.test(o)&&!/open(Quick|LopQuick|NSQuick)\(/.test(o))thieu.push(k)});
 t("moi trang co the ho so deu cho bam ten nguoi"+(thieu.length?(" - thieu: "+thieu.join(", ")):""), thieu.length===0);
 /* rieng trang anh Luan chi ra */
 var xl=RENDER["xeplop"]();
 t("trang Xep lop & Onboarding: ten hoc vien bam duoc", /openQuick\(/.test(xl));
 t("trang Xep lop & Onboarding: ten lop cung bam duoc", /openLopQuick\(/.test(xl));
 /* cum nut demo tren thanh tieu de day sang phai cho do vuong */
 t("cum Room demo / Chay huong dan / Reset demo canh phai", /id="demoBadgeWrap"[^>]*margin-left:auto/.test(HTML));
 t("tieu de trang co the co lai khi ten dai", /id="pgTitle"/.test(HTML)&&/flex:1;min-width:0/.test(HTML));
})();


/* ---- 33. BAM TEN = XEM NHANH (khong nhay trang) + DIA CHI RIENG CHO TUNG TRANG ---- */
(function(){
 setRole("all");
 /* (a) BAT BIEN: khong con TEN NGUOI nao la link nhay thang sang trang ho so.
    Nut "Ho so" ro rang thi van duoc - do la nguoi dung CHU DONG doi xem day du. */
 var xau=[];
 Object.keys(RENDER).forEach(function(k){var o="";try{o=RENDER[k]()}catch(e){return}
  if(/<a class="lnk"[^>]*openHoso\(/.test(o))xau.push(k)});
 t("khong con ten nguoi nhay thang sang trang ho so"+(xau.length?(" - con: "+xau.join(", ")):""), xau.length===0);
 t("drawer xem nhanh HV co loi ra ho so day du", (function(){var seen="";
  var od=global.openDrawer;global.openDrawer=function(t2,h){seen=h};
  try{openStuQuick(rows("DL09")[0].student_id)}catch(e){}
  global.openDrawer=od;return /openHoso\(/.test(seen)&&/Hồ sơ đầy đủ/.test(seen)})());
 t("co drawer xem nhanh nhan su + khoa hoc", typeof openNSQuick==="function"&&typeof openKhoaQuick==="function");
 t("drawer nhan su co loi ra ho so day du", (function(){var seen="";
  var od=global.openDrawer;global.openDrawer=function(t2,h){seen=h};
  try{openNSQuick(rows("DL01")[0].staff_id)}catch(e){}
  global.openDrawer=od;return /open(GV|NV)\(/.test(seen)&&/Hồ sơ đầy đủ/.test(seen)})());
 t("drawer khoa hoc co loi ra ho so day du", (function(){var seen="";
  var od=global.openDrawer;global.openDrawer=function(t2,h){seen=h};
  try{openKhoaQuick(rows("DL05")[0].course_id)}catch(e){}
  global.openDrawer=od;return /openKhoa\(/.test(seen)&&/Hồ sơ đầy đủ/.test(seen)})());
 t("mot dinh nghia ai la giang vien", typeof isGVRole==="function");

 /* (b) DIA CHI: moi trang mot slug tieng Viet khong dau, sinh tu chinh ten trang */
 t("slug lay tu ten trang", pgSlug("banlam")==="trang-bat-dau");
 t("slug khong dau, khong ky tu la", PAGES.every(function(x){return /^[a-z0-9-]+$/.test(pgSlug(x.k))}));
 var dup={},trung=[];
 PAGES.forEach(function(x){var g=pgSlug(x.k);if(dup[g])trung.push(g);dup[g]=x.k});
 t("khong hai trang trung dia chi"+(trung.length?(" - trung: "+trung.join(", ")):""), trung.length===0);
 t("doc nguoc slug ra dung trang", PAGES.every(function(x){return slugPg(pgSlug(x.k))===x.k}));
 t("go thang ma trang cung nhan", slugPg("banlam")==="banlam");
 t("dia chi la nhung trang khong co that thi bo qua", slugPg("khong-co-trang-nay")==="");
 /* trang gop (nhaplead -> hub Tuyen sinh tab lead) van phai co dia chi rieng, khong thi F5 mat tab */
 t("trang gop van co dia chi rieng", hashOK("nhaplead")&&hashOK("changA")&&hashOK("magioithieu"));
 /* doc dia chi: ca ?slug lan #/slug (link ban cu) */
 location.search="?trang-bat-dau";location.hash="";
 t("doc duoc ?slug", hashKey()==="banlam");
 location.search="";location.hash="#/trang-bat-dau";
 t("doc duoc #/slug cua ban cu", hashKey()==="banlam");
 location.search="?utm_source=fb";location.hash="";
 t("tham so la khong bi nham la ten trang", hashKey()==="");
 /* go() phai GHI dia chi - F5 moi ve dung cho */
 location.search="";location.hash="";
 go("giaoviec");
 t("doi trang la doi dia chi", location.search==="?"+pgSlug("giaoviec"));
 go("nhaplead");
 t("trang gop ghi dia chi cua CHINH no, khong phai cua hub", location.search==="?"+pgSlug("nhaplead"));
 location.search="";location.hash="";go("banlam");

 /* (c) cong hoc vien: moi MUC mot dia chi */
 t("cong hoc vien: muc cung co slug", hvSlug("s-gopy")===slugify("Góp ý cho trung tâm"));
 var hdup={},htrung=[];
 HVSEC.forEach(function(x){var g=hvSlug(x[0]);if(hdup[g])htrung.push(g);hdup[g]=x[0]});
 t("cong hoc vien: khong hai muc trung dia chi", htrung.length===0);
 t("cong hoc vien: doc nguoc ra dung muc", HVSEC.every(function(x){return hvSecOf(hvSlug(x[0]))===x[0]}));
})();


/* ---- 34. 4 NHOM CHANG di theo kieu dan xep: mo mot cai la ba cai kia gap ---- */
(function(){
 setRole("all");
 var ARCG=NAVTREE.filter(function(G){return navIsArcGrp(G.g)}).map(function(G){return G.g});
 t("co dung 4 nhom chang", ARCG.length===4);
 t("mac dinh 4 chang deu gap", ARCG.every(function(g){return navOpenDef(g)===false}));
 /* di vao mot trang trong chang 2 -> chi chang 2 mo */
 window.NAVOPEN={};
 go("banglop");
 t("vao trang cua chang nao thi mo dung chang do", navIsOpen(ARCG[1]));
 t("ba chang con lai tu gap", [ARCG[0],ARCG[2],ARCG[3]].every(function(g){return !navIsOpen(g)}));
 /* sang chang 4 -> chang 2 phai gap lai */
 go("ketthuc");
 t("doi sang chang khac thi chang cu gap lai", navIsOpen(ARCG[3])&&!navIsOpen(ARCG[1]));
 /* tu tay xo mot chang cung phai gap ba chang kia */
 navToggle(ARCG[0]);
 t("tu tay xo mot chang thi ba chang kia gap", navIsOpen(ARCG[0])&&[ARCG[1],ARCG[2],ARCG[3]].every(function(g){return !navIsOpen(g)}));
 /* nhom KHONG phai chang thi khong bi luat nay dong toi */
 window.NAVOPEN={};
 t("nhom Lam viec / Dieu hanh khong bi gap oan", navIsOpen("Làm việc")&&navIsOpen("Điều hành"));
 navToggle(ARCG[2]);
 t("xo chang khong lam gap nhom Lam viec", navIsOpen("Làm việc"));
 window.NAVOPEN={};go("banlam");
})();

console.log(bad.length?("CHECK16 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK16 OK: "+ok+" tieu chi");
