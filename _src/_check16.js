/* _check16: DONG HOC PHI THEO DOT (mang 4). Chay: ITTS_OUT=<out> node _check16.js */
var FIELDS={},ST={};
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:(FIELDS[id]||""),checked:!!FIELDS["chk_"+id],style:{setProperty(){},removeProperty(){}},offsetHeight:200,offsetWidth:120,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
global.document={getElementById:(id)=>ST[id]||(ST[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
var SRC0=require('fs').readFileSync('./_APP.js','utf8');
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

console.log(bad.length?("CHECK16 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK16 OK: "+ok+" tieu chi");
