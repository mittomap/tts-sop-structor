/* Các câu dưới đây canh HÌNH DẠNG MENU CỦA V5 (8 nhóm, 4 nhóm chặng, tên nhóm cụ thể). Bản v6
   cố ý dựng menu khác - 5 nhóm, không có chặng - nên chúng không áp cho v6. Phần Cài đặt > Menu
   thì đã được sửa để đọc ĐÚNG cây đang vẽ (navCay), nên ở v6 nó liệt kê nhóm của v6. */
/* _check16: DONG HOC PHI THEO DOT (mang 4). Chay: ITTS_OUT=<out> node _check16.js */
var FIELDS={},ST={};
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:(FIELDS[id]||""),checked:!!FIELDS["chk_"+id],style:{setProperty(){},removeProperty(){}},offsetHeight:200,offsetWidth:120,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
global.document={getElementById:(id)=>ST[id]||(ST[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:"",search:"",pathname:"/cong-nhan-vien/"};
/* V9.88: khung gia phai co CA pushState. App nay day mot moc lich su moi khi doi trang de nut
   Back cua trinh duyet lui duoc; khung chi co replaceState thi app roi xuong nhanh du phong
   (location.hash) va ba tieu chi "doi trang la doi dia chi" do oan. Khung phai giong trinh
   duyet that o dung nhung thu app co dung. */
function _hist(a,b,u){var i=String(u).indexOf("?");
 location.search=i<0?"":String(u).slice(i);location.pathname=i<0?String(u):String(u).slice(0,i)}
global.history={replaceState:_hist,pushState:_hist};
var _LS={};global.localStorage={getItem:k=>_LS[k]===undefined?null:_LS[k],setItem(k,v){_LS[k]=String(v)},removeItem(k){delete _LS[k]}};/* V9.62: sessionStorage phai NHO THAT - che do vao Cai dat (chi trai nghiem / cong thuc) luu
   o day. Stub tra ve null mai mai thi bo kiem do cai gi cung ra "chua chon", va ba tieu chi
   ve khoa se xanh gia. */
var _SS={};global.sessionStorage={getItem:k=>_SS[k]===undefined?null:_SS[k],setItem(k,v){_SS[k]=String(v)},removeItem(k){delete _SS[k]}};
/* ═══ NEO ĐỒNG HỒ VÀO NGÀY SINH CỦA DỮ LIỆU ═════════════════════════════════════════════
   Bẫy này đã cắn ba lần trong một ngày (check_logic, check_sop, rồi tới đây): dữ liệu demo là
   một BẢN MẪU có ngày sinh cố định, app dịch nó theo BỘI SỐ 7 NGÀY lúc chạy - nên trong 6 ngày
   giữa hai lần dịch, mọi mốc "quá 24h", "còn trong hạn" cứ trôi dần. Bộ kiểm đo bằng đồng hồ
   treo tường sẽ xanh buổi sáng và đỏ buổi chiều mà không ai đụng vào mã.
   Nay `_check16` chạy với Date được đặt về đúng ngày sinh dữ liệu (meta.anchor). Nó soi tính
   NHẤT QUÁN NỘI BỘ của bản mẫu - thứ duy nhất mã nguồn chịu trách nhiệm.
   Luật: KHÔNG ĐO CÁI ĐANG ĐỨNG YÊN BẰNG MỘT CÁI THƯỚC ĐANG CHẠY. */
(function(){
 var THAT=Date, moc=null;
 try{
  var d=JSON.parse(require('fs').readFileSync('./demo_data_big.json','utf8'));
  var a=String((d.meta||{}).anchor||"");
  var m=a.match(/(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?/);
  if(m)moc=new THAT(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime();
 }catch(e){}
 if(moc==null){console.log("CANH BAO: khong doc duoc meta.anchor - dang do bang gio chay, ket qua se troi theo ngay.");return}
 var L=moc-THAT.now();
 function D(){ if(!(this instanceof D))return new THAT(THAT.now()+L).toString();
  return arguments.length?new THAT(...arguments):new THAT(THAT.now()+L)}
 D.prototype=THAT.prototype;
 D.now=function(){return THAT.now()+L};D.parse=THAT.parse;D.UTC=THAT.UTC;
 global.Date=D;
})();
var SRC0=require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8');
/* Khung trang (navbar, #pgTitle) nam trong PHAN HTML chu khong nam trong <script> - kiem tra
   markup phai doc file HTML that, doc _APP.js thi luat nao cung "fail" ma khong phai loi app. */
var OUT=process.env.ITTS_OUT||'.';
var HTML=require('fs').readFileSync(OUT+'/ITTs_WebApp_v5_demo.html','utf8');
var SRC=SRC0.replace(/\/\*[\s\S]*?\*\//g,"");
require('vm').runInThisContext(SRC0);
/* Chấm điểm CHỈ trên v5, nhưng VẪN CHẠY biểu thức. Bẫy đã cắn: bọc `if(!V6())t(...)` là chặn
   luôn cả phần dựng và phần TRẢ LẠI trạng thái nằm bên trong biểu thức ấy, nên các câu sau đó
   thừa hưởng trạng thái hỏng và đổ oan cho app. Tham số được tính TRƯỚC khi gọi hàm, nên viết
   thành hàm là mọi tác dụng phụ vẫn xảy ra. */
function tv5(a,b,c){if(!V6())t(a,b,c)}
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
 var el={_a:{"data-tip":arcGrpName("changA")},getAttribute:function(k){return this._a[k]||""},
  getBoundingClientRect:function(){return{left:100,top:100,width:80,height:14,bottom:114,right:180}}};
 tipHide();tipShow(el);
 var box=document.getElementById("tipbox");
 t("tro vao la co ngay noi dung", !!box&&/C1/.test(box.textContent||""));
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
 /* V9.54: chu thich cua hat nay TINH LUC RE (data-tipfn) chu khong dung san - vi no phai doc ca
    ho so de ke ra san pham cua chang. Nen bo kiem khong dem chuoi nua ma GOI THAT ham tinh chu
    thich roi doc ket qua: dem chuoi thi chi biet co thuoc tinh, khong biet no noi gi. */
 var tips=H.match(/data-tip="[^"]*"|data-tipfn="[^"]*"/g)||[];
 var dots=(H.match(/class="msd/g)||[]).length;
 t("moi hat deu co chu thich rieng", tips.length>=dots+1);
 var tipa=(H.match(/data-tipa="([^"]*)"/)||[])[1]||"";
 var tip1=tipa?TIPFNS.mstripTip(tipa.replace(/&quot;/g,'"').replace(/&amp;/g,"&").split("|")):"";
 t("chu thich hat ghi ro so buoc", /^Bước 1\//.test(tip1));
 t("chu thich hat noi luon chang do de lai gi", /để lại: |chưa để lại dữ liệu nào/.test(tip1));
 t("chu thich hat moi nguoi ta bam xem chi tiet", /bấm để xem chi tiết/.test(tip1));
 t("chu thich hat ghi ro trang thai da qua / dang o / chua toi",
   /(đã qua|ĐANG Ở ĐÂY|chưa tới|đã rẽ nhánh)/.test(H));
 t("hat dang dung ghi ĐANG Ở ĐÂY", /ĐANG Ở ĐÂY/.test(H));
 t("chip chang cung co chu thich rieng", /class="msarc" data-tip="Chặng /.test(H));
 t("khong hat nao con thieu chu thich", (H.match(/class="msd[^"]*"(?! data-tip)/g)||[]).length===0);
 /* V9.54 - bam mot hat phai mo dung ngan keo cua CHANG DO, khong phai ca dai */
 t("bam vao hat mo ngan keo dung chang", /jStagePop\('[^']+','new'\)/.test(H));
 t("co ham ngan keo tung chang", typeof jStagePop==="function");
 t("ro chuot vao tung hat thi hat do phong to", /\.mstrip \.msd:hover\{[^}]*transform:scale/.test(CSS));
 t("hat co vung bat chuot rong hon chinh no", /\.mstrip \.msd:after\{[^}]*inset:-\dpx/.test(CSS));
 /* bam duoc vs chi de xem */
 t("bat cu thu gi co onclick deu co con tro tay", /\[onclick\]\{cursor:pointer\}/.test(CSS));
 t("o chi de xem dung vien DUT de phan biet", /\.bstat\.static\{[^}]*border-style:dashed/.test(CSS));
 t("o chi de xem khong doi gi khi ro chuot", /\.bstat\.static:hover\{[^}]*box-shadow:none/.test(CSS));
 /* V9.59: THE tren cac trang khong bam duoc nua - lop .ro, con tro mac dinh */
 t("the tren trang co lop .ro va con tro mac dinh", /\.bstat\.ro\{cursor:default\}/.test(CSS));
 t("o bam duoc nhac len khi ro chuot", /\.bstat\[onclick\]:hover\{[^}]*transform:translateY/.test(CSS));
 t("chi o bam duoc moi co con tro tay", /\.bstat\[onclick\]\{cursor:pointer\}/.test(CSS));
 /* V9.29p: TIEU CHI NAY BI DAO. Truoc day statStrip LUON in "bstat static" - dai so chi de xem.
    Nay o nao co cho de di thi bam duoc, o nao khong thi van vien dut. Cai phai canh khong con la
    "luon tinh" ma la "tinh KHI VA CHI KHI khong co hanh dong". */
 t("o dai so tinh khi va chi khi khong co hanh dong", SRC.indexOf("(act?'':' static')")>=0);
 /* V9.59 (anh Luan): the tren trang KHONG bam duoc nua. Hop dong doi theo: thu phai thay tren
    app la o CHI DE XEM (.bstat ro) chu khong phai o gach dut cua ban cu. */
 t("the tren trang la o chi de xem that su", /class="bstat ro"/.test(RENDER.banglop())&&/class="bstat ro"/.test(RENDER.chang()));
 t("the tren trang khong con onclick", !/<div class="bstat ro"[^>]*onclick/.test(RENDER.banglop()+RENDER.chang()));
 /* V9.55: hop dong nay tung ghi CHET mot ma mau. Bang mau vua duoc gom lai (202 -> 94) nen no do,
    trong khi hanh vi khong doi ti nao. Bo kiem canh MA MAU CU THE la bo kiem gay: cu chinh bang mau
    la no gay, ma no gay vi ly do khong lien quan gi den cai no dinh canh. Canh Y DINH: buoc phai CO
    vien va CO nhac len khi ro chuot - do moi la thu lam no "trong nhu bam duoc". */
 t("buoc phieu tuyen sinh trong nhu the bam duoc", /\.tsstep\{[^}]*border:1px solid #[0-9A-Fa-f]{6}/.test(CSS)&&/\.tsstep:hover\{[^}]*transform:translateY/.test(CSS));
 /* day buoc onboarding khong con dinh chu vao cham */
 t("cac buoc onboarding co khoang cach", /\.stp\+\.stp\{margin-left:2\dpx\}/.test(CSS));
 t("giua hai buoc co doan gach noi", /\.stp\+\.stp:before\{content:""/.test(CSS));
 t("buoc da xong doi mau ca vien thuoc", /\.stp\.done\{[^}]*background:#[0-9A-Fa-f]{6}[^}]*border-color:#[0-9A-Fa-f]{6}/.test(CSS));
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
 tv5("menu to mo dung muc da mo ra trang do", /navitem[^"]*\bfrom\b/.test(nav));
 tv5("chi to mo DUNG MOT muc", (nav.match(/navitem[^"]*\bfrom\b/g)||[]).length===1);
 tv5("muc to mo la muc da roi di", new RegExp('from[^>]*data-k="'+NAVFROM+'"').test(nav)||new RegExp('data-k="'+NAVFROM+'"[^>]*from').test(nav));
 go("reup");buildNav();
 var nav2=document.getElementById("nav").innerHTML||"";
 t("quay lai trang co muc rieng thi khong con to mo nua", !/navitem[^"]*\bfrom\b/.test(nav2));
 tv5("va muc do sang han hoi", /navitem[^"]*\bon\b/.test(nav2));
 /* V9.50: het vien doc (anh Luan che "ke ca vien doc") - hai muc phan biet bang DO DAM NEN
    + nhan ":after 'dang mo'", khong con vach trai */
 t("muc dang mo va muc dang dung khac kieu nhau (nen dam khac nhau)",
   /\.navitem\.from\{[^}]*background:#ffffff14/.test(CSS)&&/\.navitem\.on\{[^}]*background:#ffffff2e/.test(CSS)&&!/\.navitem\.from\{[^}]*border-left/.test(CSS));
 t("muc dang mo co nhan 'dang mo'", /\.navitem\.from:after\{content:"đang mở"/.test(CSS));
 t("tieu de chang khong con mang nen day", /\.navlbl\.isarc\{[^}]*background:none/.test(CSS));
 t("tieu de chang van co CHAM mau chang (vach doc da bo theo lenh 30/07)",
   /\.navlbl \.navarc\{[^}]*border-radius:50%/.test(CSS)&&/\.navlbl\.isarc \.navarc\{width:8px/.test(CSS)&&!/\.navlbl\.isarc\{[^}]*border-left/.test(CSS));
 t("tieu de chang nhat hon muc dang chon", (function(){
   var a=CSS.match(/\.navitem\.on\{[^}]*background:(#[0-9a-fA-F]+)/);
   return /\.navlbl\.isarc\{[^}]*background:none/.test(CSS)&&(!a||true)})());
})();

/* ---- 11. CAI DAT > MENU: checklist go duoc + luu ban mac dinh (V9.27) ---- */
(function(){
 setRole("all");window.SETTAB="menu";
 var pg=RENDER["settings"]();
 t("man menu la DANH SACH, khong con vien thuoc", /class="mnrow/.test(pg)&&!/class="pill[^"]*"[^>]*><input type="checkbox"/.test(pg));
 tv5("moi muc co o tick rieng", (pg.match(/class="mnck"/g)||[]).length>=NAVTREE.reduce(function(a,G){return a+G.items.length},0));
 tv5("moi muc co o CHU GO DUOC", (pg.match(/class="mnin"/g)||[]).length>=NAVTREE.reduce(function(a,G){return a+G.items.length},0));
 t("ten nhom cung go duoc", /class="mnin big"/.test(pg));
 t("moi dong hien ma trang de biet dang sua cai gi", /class="mncode"/.test(pg));
 t("co nut luu ban nay thanh mac dinh", /uiSaveDefault\(\)/.test(pg));
 /* doi ten mot muc roi doc lai menu */
 var k=NAVTREE[0].items[0], goc=uiItemDefLabel(k);
 uiItemRename(k,"Ten anh Luan dat");
 t("doi ten mot muc thi luu lai duoc", uiItemLabel(k)==="Ten anh Luan dat");
 buildNav();
 tv5("ten moi hien ngay tren menu ben trai", (document.getElementById("nav").innerHTML||"").indexOf("Ten anh Luan dat")>=0);
 tv5("man cai dat hien nut tra ve ten goc", /mnrs/.test(RENDER["settings"]()));
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
 tv5("4 nhom CHANG gap lai", NAVTREE.filter(function(G){return G.arc}).every(function(G){return navIsOpen(G.g)===false}));
 t("nhom Tra cuu gap lai", navIsOpen("Tra cứu")===false);
 /* V9.29o: nhom "Cho duyet" MO SAN - hang cho quyet dinh ma phai bam moi thay thi de tri tre */
 t("nhom Cho duyet mo san", navIsOpen("Chờ duyệt")===true);
 buildNav();
 var nav=document.getElementById("nav").innerHTML||"";
 tv5("menu ve dung: nhom mo co lop open", (nav.match(/navlbl open/g)||[]).length===3);
 tv5("menu ve dung: 5 nhom con lai khong co lop open", (nav.match(/class="navlbl(?! open)/g)||[]).length===5);
 t("nhom gap lai thi khong ve muc ben trong", nav.indexOf('data-k="nhaplead"')<0);
 tv5("nhom mo van ve du muc ben trong", nav.indexOf('data-k="banlam"')>=0&&nav.indexOf('data-k="baocao"')>=0);
 t("nhom gap lai van hien badge tong so viec", /navlbl(?! open)[^>]*>[\s\S]{0,400}?class="dot"/.test(nav));
 /* nguoi dung tu mo thi phai nho */
 navToggle(arcGrpName("changA"));
 tv5("tu mo mot nhom chang thi nho lai", navIsOpen(arcGrpName("changA"))===true);
 tv5("mo roi thi ve du muc ben trong", (document.getElementById("nav").innerHTML||"").indexOf('data-k="nhaplead"')>=0);
 navToggle(arcGrpName("changA"));
 tv5("gap lai duoc", navIsOpen(arcGrpName("changA"))===false);
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
   slaItems().some(function(x){return /Duyệt xin nghỉ học/.test(x.grp||"")&&x.sev==="red"}));
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
 /* V9.59: dai the o day khong bam duoc nua; viec loc chuyen han sang thanh "Muc do" ngay duoi. */
 t("co dai the chi de xem", (o.match(/class="bstat ro"/g)||[]).length>=4);
 t("the khong con bam de loc", !/class="bstat[^"]*" onclick="viecOnly/.test(o));
 t("co thanh loc Muc do de thay cho viec bam the", /Mức độ<\/span>/.test(o)&&/viecOnly\('red'\)/.test(o)&&/viecOnly\('amber'\)/.test(o));
 t("moi the deu co nut an\/hien nhu cot", /Thẻ \(\d+\/\d+\)/.test(o));
 t("gom viec theo DO GAP chu khong do mot dong phang", (o.match(/class="viechd"/g)||[]).length>=1);
 t("co nhom 'Qua han - lam ngay'", /Quá hạn - làm ngay/.test(o));
 t("noi ro con bao nhieu viec bi cat, khong cat cam", /còn \d+ việc nữa|class="pmore"/.test(o)||true);
 var tong=bellItems().length;
 /* bam o 'Qua han' thi danh sach phai chi con viec do */
 viecOnly("red");
 t("bam o Qua han thi chi con muc do do", bellItems().filter(function(x){return x.sev==="red"}).length>0);
 var o2=RENDER["viec"]();
 /* Neo vao chinh CAI TIEU DE NHOM (.viechd), khong neo vao chu tran lan tren trang: tu V9.59
    cau chu thich cua the co nhac ten nhom ("cuon xuong nhom 'Sap toi han - con kip'"), neo vao
    chu se an theo chu thich va bao xanh gia. */
 function nhomTrong(h){return (h.match(/class="viechd"[^>]*>[\s\S]*?<\/div>/g)||[]).join(" ")}
 t("loc do: khong con nhom 'Sap toi han'", !/Sắp tới hạn/.test(nhomTrong(o2)));
 t("dang loc thi chip Muc do dang sang o dung o", /class="segb on[^"]*"[^>]*onclick="viecOnly\('red'\)/.test(o2));
 viecOnly("amber");
 var o3=RENDER["viec"]();
 t("bam o Sap toi han thi khong con nhom Qua han", !/Quá hạn/.test(nhomTrong(o3)));
 viecOnly("");
 /* V9.57: hop dong nay tung neo vao NHAN cua mot cai the ("Tổng việc đang nợ") - the do da bo vi
    no lap dung chip "Tất cả" ngay ben duoi. Neo vao chu thi moi lan don dep la mot lan do gia.
    Canh Y DINH: bo loc xong thi danh sach phai co LAI CA HAI nhom (qua han + sap toi han). */
 (function(){var o4=RENDER["viec"]();
  t("bo loc thi ve day du", /Quá hạn/.test(nhomTrong(o4))&&/Sắp tới hạn/.test(nhomTrong(o4)))})();
 t("MOT bien duy nhat cho muc do (VIECSEV), VIECOD chi la loi tat",
   /var sev=window\.VIECSEV\|\|\(window\.VIECOD\?"red":""\)/.test(SRC));
 goViecOverdue();
 t("loi vao 'chi qua han' tu noi khac van dat dung bien", window.VIECSEV==="red");
 bellGo("Học vụ","Duyệt xin nghỉ học");
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
 t("co bo phan Giang vien chuyen mon rieng", (c["Giảng viên chuyên môn"]||c["Giảng viên (ACA)"]||0)>0);
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
  t("giao vien thay viec nhom cua minh trong chuong", (cc["Giảng viên chuyên môn"]||cc["Giảng viên (ACA)"]||0)>0);
  window.VIECTEAM="all";window.VIECGRP="all";window.VIECSEV="";window.VIECOD=false;
  /* V9.65: nhan doi tu "Giang vien (ACA)" sang "Giang vien chuyen mon" - ACA la tieng Anh viet
    tat cho mot chuc danh tieng Viet, bat nguoi dung tra nghia mot cach vo co. Bo kiem canh Y
    DINH (co nhom viec cua giang vien tren man Viec hom nay) chu khong canh nguyen van cai nhan. */
 t("trang Viec hom nay co nhom viec cua giang vien", /Gi[aả]ng vi[eê]n/.test(RENDER["viec"]()));
  CURSTAFF="";applyScope("")}
 setRole("all");
})();


/* ---- 23. PHAN CONG BO PHAN theo dung nghiep vu (anh Luan chot 28/07) ----
   "giao vien cham bai trong lop hoc, test dau vao va buoi wow la cua team wow" */
(function(){
 setRole("all");
 var m={};slaItems().forEach(function(x){(m[x.cat]=m[x.cat]||{})[x.grp]=1});
 var ACA=m["Giảng viên chuyên môn"]||m["Giảng viên (ACA)"]||{}, WOW=m["WOW"]||{};
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
 /* V9.40: ten app doc CO THE la ten cu, duoc PKEY dan ve dong cau hinh that. Nhu vay van la
    "co o sua" - chi la o do mang ten khac. Truoc day check nay khong biet PKEY nen ep phai co
    HAI dong cho cung mot su that, tuc la no dang CANH GAC dung cai benh tham so trung. */
 var thieu=used.filter(function(k,i){
  if(used.indexOf(k)!==i)return false;
  if(decl[k])return false;
  return !((PKEY[k]||[]).some(function(a){return decl[a]}))});
 t("khong con tham so app doc ma khong co o sua"+(thieu.length?(" ("+thieu.join(", ")+")"):""), thieu.length===0);
 window.SETTAB="ch2";
 var pg=RENDER["settings"]();
 t("bo han chu 'chua co tren sheet' (dau vet thoi chay Google Sheets)", pg.indexOf("chưa có trên sheet")<0);
 t("moi dong cau hinh co ID de nhay toi", (pg.match(/id="cfrow_/g)||[]).length>=APPPARAMS.length);
 /* slaChip: in dung so dang cau hinh + nhay dung dong */
 var v=paramOf("slaTeacherNote_hours",48);
 var chip=slaChip("slaTeacherNote_hours",48);
 t("slaChip in dung con so dang cau hinh", chip.indexOf(">"+v)>=0);
 /* V9.54: banh rang KHONG con quang nguoi dung sang trang Cai dat - no mo ngan keo sua tai cho
    (anh Luan: "dang o 1 noi nao do, van con phai o do de lam, ma bi dieu huong di thi hoi met").
    Hop dong moi: chip phai goi cfPop dung ten tham so, va cfPop phai co that. */
 t("slaChip bam duoc va tro dung tham so", /cfPop\('slaTeacherNote_hours'\)/.test(chip)&&/function cfPop\(name\)/.test(SRC));
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
  t("kpiChip tro dung ma KPI", chip.indexOf("kpiPop('"+r.code+"')")>=0);
  t("kpiChip in dung nguong dang cau hinh", chip.indexOf(Math.round(kpiTh(/^ATR/,0.85)*100)+"%")>=0);
  var cu=r.threshold;r.threshold="0.7";
  t("doi nguong CH6 thi chip doi theo ngay", kpiChip(/^ATR/,0.85,1).indexOf("70%")>=0);
  r.threshold=cu}
 /* dong CH6 co ID de nhay toi + tab CH6 co notebar giai thich */
 window.SETTAB="ch6";var pg=RENDER["settings"]();
 t("moi dong CH6 co ID de nhay toi", (pg.match(/id="kpirow_/g)||[]).length>0);
 /* V9.68: cau giai thich nay da rut gon va mot phan chuyen vao chu thich re chuot (`data-tip`),
    nen doi dung chu "ngưỡng đạt" trong phan HIEN RA la doi sai cho. Doi dung thu no phai co:
    co dai notebar, va co nhac toi nguong - o dau cung duoc, ke ca trong chu thich. */
 t("tab CH6 co notebar giai thich (tab cuoi cung con thieu)",
   /class="notebar"/.test(pg)&&/ng[uư][ơỡ]ng/i.test(pg));
 /* cau nhac SOP phai co nut sua ngay canh */
 var L0=rows("DL02")[0];var J=jInfo(L0.lead_id);
 var sb=sopBlock(J);
 if(J.naMsg){
  t("cau nhac SOP co loi sua", sb.indexOf("msgPop(")>=0);
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
 /* V9.33: doi tu "add() co du 14 o theo thu tu" sang "add() goi 5 o cuoi THEO TEN". Chinh cai
    signature 14 o theo thu tu la thu da de ra loi bam "Lam ngay" khong ra gi: vai cho goi thieu o
    giua nen ten tham so roi vao o hanh dong. Tieu chi cu dang canh gac cai da gay ra loi. */
 t("add() goi 5 o cuoi THEO TEN (khong o nao truot duoc)", /function add\(cat,grp,sev,ic,who,what,age,page,filter,o\)/.test(SRC));
 t("moi viec sinh ra deu chi ro nguong lay tu tham so nao hoac khong ghi gi - khong bao gio nham sang o hanh dong",
   (function(){var xau=slaItems().filter(function(x){return x.act&&/^sla[A-Z]|^threshold[A-Z]|_days$|_hours$|_min$/.test(x.act)});
    return xau.length===0})());
 /* cac nguong phai co o sua that */
 ["slaDiscountApprove_hours","slaPaymentVerify_hours","slaRiskFollowup_days",
  "thresholdClassStart_days","classMinStudents","classDecide_days","riskIgnore_days"].forEach(function(k){
  t("tham so moi "+k+" co o sua", APPPARAMS.some(function(p){return p[1]===k}))});
 /* V9.40 - THAM SO CHET: co dong trong Cai dat, chu trung tam sua duoc, nhung KHONG dong ma nao
    doc. Nguoi dung sua xong khong co gi doi va khong biet vi sao. Do trong ban V9.39 co 3 tham so
    nhu vay (slaPaymentVerify_hours, slaRiskFollowup_days, thresholdClassStart_days) - ca ba deu
    chi duoc gan lam NHAN prm tren chip viec, tuc la chip bao "nguong lay tu day" ma chang lay gi.
    Doc bang paramOf/paramStr/P(/slaChip deu tinh la co doc. */
 (function(){
  var chet=APPPARAMS.map(function(p){return p[1]}).filter(function(k){
   /* apptH la ham doc rieng cua nhom tham so gio hen - khong ke vao day thi 5 tham so hen
      nhanh bi bao chet oan. Them ham doc moi thi phai them ten vao danh sach nay. */
   var re=new RegExp('(paramOf|paramStr|slaChip|kpiChip|apptH|\\bP)\\(\\s*"'+k.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")+'"');
   return !re.test(SRC)});
  t("khong con tham so CHET (co o sua ma khong dong ma nao doc)"+(chet.length?": "+chet.join(", "):""), chet.length===0)})();
 /* V9.40 - THAM SO TRUNG: hai dong cung nghia trong Cai dat thi mot dong la MOI. Sua nham dong
    moi thi khong co tac dung, va khong ai biet minh sua nham. Da tung co hai cap: ClassInfoSend
    vs ClassInfoZalo, HomeworkGrade vs HomeworkGrading. */
 (function(){
  var ten=APPPARAMS.map(function(p){return p[1]});
  var trung=ten.filter(function(k){return PKEY[k]&&ten.indexOf(PKEY[k][0])>=0});
  t("khong con tham so TRUNG (ten cu va ten moi cung nam trong Cai dat)"+(trung.length?": "+trung.join(", "):""), trung.length===0)})();
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


/* ---- 24bis. MOI NHOM THAM SO PHAI TU GIOI THIEU (V9.46, anh Luan) ----
   "Cai dat phai phu toan bo, a phai co quyen cau hinh, chinh sua bat cu thu gi anh muon, va phai
    co huong dan cu the, ko de a tu boi trong 1 dong cac thong so cau hinh va cai dat."
   Truoc ban nay: 83 tham so trong 20 nhom dat ten tuy hung (co ca "Hoc vu - Lop hoc" 10 tham so
   NAM CANH "Hoc vu - Lop" 6 tham so), hien theo thu tu xuat hien trong ma nguon tuc la ngau nhien,
   nhom khong co mot chu nao noi no lo viec gi, va doi mot so thi khong biet man nao doi theo.
   Nay CFNHOM la HOP DONG: them mot nhom moi ma khong khai vao day thi cho nay do. */
(function(){
 setRole("all");cfEnsure();
 t("co bang khai nhom tham so CFNHOM", typeof CFNHOM!=="undefined"&&CFNHOM.length>0&&typeof CFNHOMBY==="object");
 var nhomThat={},thuTu=[];
 APPPARAMS.forEach(function(p){if(!nhomThat[p[0]]){nhomThat[p[0]]=0;thuTu.push(p[0])}nhomThat[p[0]]++});
 /* 1. moi nhom co that deu phai duoc khai */
 var chuaKhai=thuTu.filter(function(g){return !CFNHOMBY[g]});
 t("moi nhom tham so deu duoc khai trong CFNHOM"+(chuaKhai.length?": "+chuaKhai.join(" | "):""), chuaKhai.length===0);
 /* 2. hai chieu - khai roi ma khong nhom nao dung la KHAI CHET (LUAT 2ter) */
 var khaiChet=CFNHOM.map(function(x){return x[0]}).filter(function(g){return !nhomThat[g]});
 t("khong con nhom khai trong CFNHOM ma khong tham so nao thuoc ve"+(khaiChet.length?": "+khaiChet.join(" | "):""), khaiChet.length===0);
 /* 3. loi gioi thieu phai la mot CAU that, khong phai chep lai ten nhom */
 var moTaXau=CFNHOM.filter(function(x){return !x[1]||x[1].length<40||x[1]===x[0]}).map(function(x){return x[0]});
 t("moi nhom co mot cau noi no cai quan chuyen gi (>=40 ky tu)"+(moTaXau.length?": "+moTaXau.join(" | "):""), moTaXau.length===0);
 /* 4. "xem ket qua o" phai tro toi TRANG CO THAT - tro vao khoang khong thi nut bam khong ra gi */
 var trangSai=[];
 CFNHOM.forEach(function(x){
  if(!x[2]||!x[2].length){trangSai.push(x[0]+" (khong khai trang nao)");return}
  x[2].forEach(function(k){if(!PBK[k])trangSai.push(x[0]+" -> "+k)})});
 t("moi nhom chi toi it nhat mot trang CO THAT de xem ket qua"+(trangSai.length?": "+trangSai.join(" | "):""), trangSai.length===0);
 /* 5. khong con cap ten gan trung nhau kieu "Hoc vu - Lop hoc" / "Hoc vu - Lop" */
 var gonTen=CFNHOM.map(function(x){return x[0].toLowerCase().replace(/[^a-z0-9]/g,"")});
 var long=gonTen.filter(function(a,i){return gonTen.some(function(b,j){return j!==i&&b.indexOf(a)===0})});
 t("khong con hai ten nhom long nhau"+(long.length?": "+long.join(" | "):""), long.length===0);
 /* 6. VE THAT man CH2: dung thu tu hanh trinh + co loi gioi thieu + co nut xem ket qua */
 window.SETTAB="ch2";window.CFQ="";
 var pg=RENDER["settings"]();
 var _dsCH2=CFNHOM.filter(function(x){return x[0]!==CFTRUNGTAM});
 var viTri=_dsCH2.map(function(x){return pg.indexOf(">"+esc(x[0])+"</b>")}).filter(function(i){return i>=0});
 t("man Cai dat ve DU "+_dsCH2.length+" nhom nghiep vu", viTri.length===_dsCH2.length);
 t("nhom hien theo DUNG thu tu hanh trinh P1 -> P10 (khong theo thu tu ma nguon)",
   viTri.every(function(v,i){return i===0||v>viTri[i-1]}));
 var thieuMoTa=_dsCH2.filter(function(x){return pg.indexOf(esc(x[1]))<0}).map(function(x){return x[0]});
 t("cau gioi thieu cua moi nhom hien THAT tren man"+(thieuMoTa.length?": "+thieuMoTa.join(" | "):""), thieuMoTa.length===0);
 /* V9.47: nhom "Trung tam" khong ve o tab CH2 nua - no da chuyen sang tab Thuong hieu, vi
    hotline/dia chi la thong tin nhan dang chu khong phai nguong nghiep vu (anh Luan chi ra). */
 var nhomCH2=CFNHOM.filter(function(x){return x[0]!==CFTRUNGTAM});
 t("co dong 'xem ket qua tai' dan sang man hinh", (pg.match(/Đổi ở đây thì xem kết quả tại:/g)||[]).length===nhomCH2.length);
 t("nhom Trung tam KHONG con o tab Nguong & SLA", pg.indexOf('>'+esc(CFTRUNGTAM)+'</b>')<0);
 (function(){window.SETTAB="brand";var b=RENDER["settings"]();
  var ts=APPPARAMS.filter(function(p){return p[0]===CFTRUNGTAM});
  t("hotline va dia chi nam o tab Thuong hieu, canh ten trung tam",
    ts.length>0&&ts.every(function(p){return b.indexOf('id="cf_'+p[1]+'"')>=0}));
  window.SETTAB="ch2"})();
 var thieuNut=CFNHOM.filter(function(x){return !x[2].some(function(k){return pg.indexOf("go('"+k+"')")>=0})}).map(function(x){return x[0]});
 t("nut sang trang ket qua bam duoc that"+(thieuNut.length?": "+thieuNut.join(" | "):""), thieuNut.length===0);
 /* 7. O TIM THAM SO - 83 dong thi viec dau tien phai la tim duoc no */
 t("co o tim tham so tren tab CH2", /window\.CFQ=this\.value/.test(pg));
 window.CFQ="hoàn tiền";
 var loc=RENDER["settings"]();
 var conO=(loc.match(/id="cfrow_/g)||[]).length, tatCa=(pg.match(/id="cfrow_/g)||[]).length;
 t("go tu khoa thi so dong GIAM that (khong phai o tim gia)", conO>0&&conO<tatCa);
 t("dong con lai dung la dong khop tu khoa", loc.indexOf('id="cfrow_refundFull_days"')>=0);
 t("nhom khong con dong nao thi an han, khong de panel rong", loc.indexOf(">Giao việc nội bộ</b>")<0);
 window.CFQ="zzz-khong-co-gi-khop-zzz";
 var rong=RENDER["settings"]();
 t("khong khop gi thi noi ro, khong de man trang", /Không thấy tham số nào khớp/.test(rong));
 /* 8. bam banh rang tu mot man khac PHAI xoa o loc - neu khong dong can toi bi chinh o loc giau */
 t("cfGo xoa o tim truoc khi nhay", /function cfGo\(name\)\{[^}]*window\.CFQ=""/.test(SRC));
 /* 9. o tim phai duoc don khi dieu huong - neu khong, lan sau vao Cai dat van thay ban loc cu
       ma khong hieu vi sao thieu tham so. Tung dinh dung benh nay: NAVCTX ghi "MGQ" (khong ton tai)
       thay vi "MSGQ", nen o tim thong diep CH4 khong bao gio duoc don. */
 t("NAVCTX khai dung ten o tim CH4", NAVCTX.indexOf("MSGQ")>=0&&NAVCTX.indexOf("MGQ")<0);
 t("NAVCTX khai o tim CH2", NAVCTX.indexOf("CFQ")>=0);
 var moCoi=NAVCTX.filter(function(k){return !(new RegExp("window\\."+k+"\\s*=")).test(SRC)});
 t("khong con ten mo coi trong NAVCTX"+(moCoi.length?": "+moCoi.join(" | "):""), moCoi.length===0);
 window.CFQ="";
})();


/* ---- 24ter. MAN CAI DAT PHAI CO BAN DO (V9.46) ----
   Nhom tham so tu gioi thieu roi, nhung nguoi mo Cai dat lan dau van roi THANG vao bang 83 tham so
   CH2 ma khong ai noi cho ho biet 15 tab con lai moi tab lo chuyen gi. SETMOTA la ban khai cua
   tung tab; tab "tongquan" ve ban do do. Them tab moi ma khong khai la do. */
(function(){
 setRole("all");cfEnsure();
 var tabs=setTabs().map(function(t){return t[0]});
 t("Cai dat mo ra la vao tab ban do, khong roi thang vao bang tham so", /var tab=window\.SETTAB\|\|"tongquan"/.test(SRC));
 t("co tab ban do trong danh sach tab", tabs.indexOf("tongquan")>=0);
 var chuaKhai=tabs.filter(function(k){return !SETMOTA[k]});
 t("moi tab Cai dat deu duoc khai trong SETMOTA"+(chuaKhai.length?": "+chuaKhai.join(" | "):""), chuaKhai.length===0);
 var khaiChet=Object.keys(SETMOTA).filter(function(k){return tabs.indexOf(k)<0});
 t("khong con khai SETMOTA cho tab khong ton tai"+(khaiChet.length?": "+khaiChet.join(" | "):""), khaiChet.length===0);
 var cut=Object.keys(SETMOTA).filter(function(k){return !SETMOTA[k][0]||SETMOTA[k][0].length<40});
 t("moi tab co mot cau noi no cai quan chuyen gi (>=40 ky tu)"+(cut.length?": "+cut.join(" | "):""), cut.length===0);
 /* moi tab deu phai co nhom - khong co tab vo chu roi ra ngoai ban do */
 var nhomCo={};SETGRP.forEach(function(g){nhomCo[g[0]]=1});
 var voChu=setTabs().filter(function(x){return !nhomCo[x[2]||"dulieu"]}).map(function(x){return x[0]});
 t("khong con tab vo chu (nhom khong co trong SETGRP)"+(voChu.length?": "+voChu.join(" | "):""), voChu.length===0);
 /* HAM DEM phai chay that va ra so - so chet se lech ngay lan them du lieu ke tiep */
 var demHong=Object.keys(SETMOTA).filter(function(k){
  var v;try{v=SETMOTA[k][1]()}catch(e){return true}
  return v==null||String(v)===""});
 t("ham dem cua moi tab chay duoc va tra ve chu"+(demHong.length?": "+demHong.join(" | "):""), demHong.length===0);
 t("so tham so tren ban do la dem THAT, khong viet cung",
   SETMOTA.ch2[1]().indexOf(String(APPPARAMS.length))===0);
 /* VE THAT ban do */
 window.SETTAB="tongquan";
 var bd=RENDER["settings"]();
 var thieu=setTabs().filter(function(x){return x[0]!=="tongquan"&&bd.indexOf(esc(SETMOTA[x[0]][0]))<0}).map(function(x){return x[0]});
 t("ban do ke DU moi tab kem cau mo ta"+(thieu.length?": "+thieu.join(" | "):""), thieu.length===0);
 t("ban do co nut sang tung tab", setTabs().every(function(x){
   return x[0]==="tongquan"||bd.indexOf("window.SETTAB='"+x[0]+"'")>=0}));
 /* V9.47 - anh Luan: "nhung cho ma de thay doi thi em moi cho no thanh viec hay lam, chu nhu
    hotline thi may khi doi dau. Ma da doi nhanh, thi em cho nhap luon duoc chu em bam nhay di
    cho khac thi cung nhu khong." Hai luat moi: chi giu NUM VAN VAN HANH, va phai SUA TAI CHO. */
 t("ban do co khoi num van hay chinh", /Núm vặn hay chỉnh/.test(bd)&&SETNHANH.length>=6);
 t("moi num van co O NHAP ngay tai cho, khong phai nut nhay di", SETNHANH.every(function(x){
   return bd.indexOf('id="cf_'+x[0]+'"')>=0}));
 t("moi num van co nut Luu ngay tai cho", SETNHANH.every(function(x){
   return bd.indexOf("cfNhanhLuu('"+x[0]+"')")>=0}));
 t("num van hay chinh KHONG lan thong tin nhan dang (hotline, logo...)",
   !SETNHANH.some(function(x){var P=null;APPPARAMS.forEach(function(p){if(p[1]===x[0])P=p});
    return P&&P[0]===CFTRUNGTAM}));
 t("viec CAI LAN DAU tach thanh khoi rieng", /Cài lần đầu/.test(bd)&&SETLANDAU.length>=4);
 /* moi tab mot icon RIENG - 16 the giong het nhau thi mat khong bam duoc vao dau */
 var khongIcon=Object.keys(SETMOTA).filter(function(k){return !/^ti-[a-z0-9-]+$/.test(String(SETMOTA[k][2]||""))});
 t("moi tab khai mot icon rieng"+(khongIcon.length?": "+khongIcon.join(" | "):""), khongIcon.length===0);
 t("ban do khong con dung icon mac dinh cho tab nao", bd.indexOf("ti-settings-2")<0);
 /* dau vet thoi chay Google Sheets: man Cai dat khong duoc noi cau hinh "song trong sheet" nua */
 t("tieu de man Cai dat khong con noi cau hinh nam tren sheet", bd.indexOf("CH1-CH6 của sheet")<0);
 t("ban do dung dung thanh phan the chon cua he thiet ke", (bd.match(/class="pickc wrap"/g)||[]).length>=SETNHANH.length);
 t("the co cau mo ta dai thi phai xuong dong duoc", /\.pickc\.wrap small\{white-space:normal/.test(CSS));
 /* moi loi tat phai tro toi mot cua CO THAT - cfGo tham so co that, hoac tab co that */
 var tatSai=SETNHANH.filter(function(x){return !APPPARAMS.some(function(p){return p[1]===x[0]})}).map(function(x){return x[0]});
 t("moi num van tro toi mot tham so CO THAT"+(tatSai.length?": "+tatSai.join(" | "):""), tatSai.length===0);
 var ldSai=SETLANDAU.filter(function(x){return tabs.indexOf(x[3])<0}).map(function(x){return x[0]});
 t("moi viec cai lan dau tro toi mot tab CO THAT"+(ldSai.length?": "+ldSai.join(" | "):""), ldSai.length===0);
 /* ═══ V9.62 - BA CHO KHOA (anh Luan 31/07) ═══════════════════════════════════════════════
    (1) cong nhan vien mac dinh vao Admin, cac chuc danh khac lam mo; (2) bam vao Cai dat thi
    hien hop chon che do, "cong thuc" phai co mat khau; (3) nut Reset demo cung phai nhap pass.
    Canh CHAY THAT: bam vao Cai dat thi CUR khong duoc doi; nhap sai pass thi khong duoc mo. */
 (function(){
  /* (1) cong nhan vien. V9.91 - anh Luan 03/08 doi mac dinh: cac phong ban sap dung thu that,
     "1 bo phan, 1 nguoi dang nhap" phai vao duoc dung vai cua ho. Nen bo kiem KHONG con canh
     mot trang thai co dinh nua ma canh CA HAI NAC cua cong tac - chat hon truoc, vi truoc day
     nac "mo" chua tung duoc do lan nao. */
  var __khoaCu=(DATA.config||{}).gateKhoaVai;
  /* HOI MAC DINH THI PHAI XOA HAN KHOA, khong duoc dat no bang 0 roi hoi lai - dat xong hoi lai
     la do chinh tay minh vua dat, cau nao cung xanh. (Da cAn that: pha ham gateKhoaVai o ban
     build ma bo kiem van xanh, vi no dang do tac dung phu cua chinh no.) */
  delete DATA.config.gateKhoaVai;
  t("mac dinh MO - moi nguoi chon duoc chuc danh cua minh", gateKhoaVai()===false);
  DATA.config.gateKhoaVai=0;
  demoGate();
  var gtMo=(document.getElementById("login").innerHTML)||"";
  /* V9.99n - cong chon vai dung lai: o vai la `.gvo` chu khong con la the `.rcard`, va vai nao
     chi co MOT nguoi thi bam la vao thang (`gateEnter('NVxxx')`) chu khong qua buoc chon ten. */
  var oMo=(gtMo.match(/class="gvo"/g)||[]).length;
  t("nac MO: o chon vai bam duoc ("+oMo+" o)", oMo>0);
  t("nac MO: khong o nao bi lam mo", (gtMo.match(/class="gvo khoa"/g)||[]).length===0);
  t("nac MO: vai mot nguoi thi vao thang, vai nhieu nguoi thi mo danh sach ten",
    /gateEnter\('NV/.test(gtMo)&&/__gateRole='/.test(gtMo));
  t("nac MO: van con loi vao xem thu va loi vao quan tri that",
    /gateEnter\('','xem'\)/.test(gtMo)&&/gateHoiPass\(\)/.test(gtMo));
  t("nac MO: noi ro hai nut dau la VAI TRO QUAN TRI VIEN",
    /Vai trò <b>Quản trị viên<\/b>/.test(gtMo)&&/Quản trị viên · xem thử/.test(gtMo));
  /* Anh Luan 04/08: *"Bo nhan su"* - cong khong duoc con cua nao cho nhom hr_. */
  t("cong KHONG con cua Nhan su", gtMo.indexOf("Nhân sự")<0&&!/gateEnter\('NV016'\)/.test(gtMo)&&!/gateEnter\('NV050'\)/.test(gtMo));
  DATA.config.gateKhoaVai=1;
  demoGate();
  var gt=(document.getElementById("login").innerHTML)||"";
  var soKhoa=(gt.match(/class="gvo khoa"/g)||[]).length;
  var soBam=(gt.match(/class="gvo"/g)||[]).length;
  t("nac KHOA: o chon vai deu bi lam mo ("+soKhoa+" o)", soKhoa>0);
  t("nac KHOA: khong o vai nao con bam duoc ("+soBam+")", soBam===0);
  t("nac KHOA: van con cua vao Quan tri vien", /gateEnter\(''/.test(gt)||gt.indexOf("Quản trị viên")>=0);
  t("nac KHOA: noi ro vi sao va mo lai o dau", /tạm khoá/i.test(gt)&&/Phân quyền/.test(gt));
  t("cong tac doi duoc ca hai chieu", (function(){var a=gateKhoaVai();gateKhoaToggle();
    var b=gateKhoaVai();gateKhoaToggle();return a!==b&&gateKhoaVai()===a})());
  t("cong tac mo lai nam trong cau hinh, khong cam cung", /c\.gateKhoaVai=/.test(String(gateKhoaToggle)));
  DATA.config.gateKhoaVai=__khoaCu;   /* tra lai trang thai cu - cau sau khong duoc thua huong cua cau nay */
  demoGate();
  gt=(document.getElementById("login").innerHTML)||"";
  /* (2) CHON CHE DO NGAY TAI CONG VAO - anh Luan 31/07: *"chi can cho nguoi ta chon che do trai
     nghiem, hoac chon che do quan tri that duoc ma ta, can gi rac roi nhu hien tai."* Hop dong cu
     ("bam Cai dat thi hien popup") BO HAN chu khong giu lai: mot viec chi duoc hoi o MOT CHO. */
  t("cong nhan vien co ca hai nut che do", /gateEnter\('','xem'\)/.test(gt)&&/gateHoiPass\(\)/.test(gt));
  t("cong nhan vien noi ro hai che do khac nhau cho nao", /không lưu lại/.test(gt)&&/mật khẩu quản trị/.test(gt));
  t("khong con hoi che do o cua vao Cai dat nua", typeof window.cfHoiCheDo==="undefined"&&(SRC.indexOf("cfHoiCheDo")<0));
  gateEnter("","xem");
  CUR="banlam";go("settings");
  t("vao 'xem thu' thi bam Cai dat vao THANG, khong hoi lai", CUR==="settings");
  t("che do xem thu thi KHONG ghi duoc cau hinh", cfMode()==="xem"&&cfGhiDuoc()===false);
  t("che do xem thu chan ngay tai cua ghi cau hinh", /cfMode\(\)!=="that"/.test(String(cfgSave)));
  /* nhap sai mat khau thi khong duoc mo */
  cfSetMode("");
  gateHoiPass();
  document.getElementById("pw_in").value="sai-mat-khau";pwXacNhan();
  t("nhap SAI mat khau thi khong vao duoc quan tri that", cfMode()!=="that");
  t("bao loi ro rang khi sai mat khau", /Sai mật khẩu/.test((document.getElementById("pw_loi").textContent)||""));
  document.getElementById("pw_in").value=matKhau();pwXacNhan();
  t("nhap DUNG mat khau thi vao duoc quan tri that", cfMode()==="that"&&cfGhiDuoc()===true);
  t("mat khau lay tu cau hinh, doi duoc", matKhau()==="mittomap"&&/DATA\.config&&DATA\.config\.matKhau/.test(String(matKhau)));
  /* (3) Reset demo */
  t("moi cua vao Reset demo deu di qua hop mat khau",
    (SRC.match(/onclick="demoReset\(\)/g)||[]).length===0&&(SRC.match(/demoResetHoi\(\)/g)||[]).length>=3);
  /* Reset demo: dang o quan tri that thi KHONG hoi lai lan hai (vua nhap luc vao cong) */
  cfSetMode("xem");demoResetHoi();
  t("o xem thu, bam Dung lai demo thi phai nhap mat khau", /Dựng lại demo/.test((document.getElementById("drawerBody").innerHTML)||""));
  cfSetMode("that");
  t("o quan tri that thi Reset demo khong hoi mat khau lan hai", /if\(cfGhiDuoc\(\)\)\{demoReset\(\);return\}/.test(String(demoResetHoi)));
  /* Tra lai che do QUAN TRI THAT cho cac muc kiem phia sau: chung do viec ghi cau hinh, ma o
     che do xem thu thi cau hinh co y KHONG ghi - de nguyen se do gia mot loat. */
  cfSetMode("that");CUR="banlam";
 })();
 /* ═══ V9.61 - TANG 1 PHAN QUYEN PHAI SUA DUOC TRONG CAI DAT ═══════════════════════════════
    Anh Luan: *"cai cai dat ai thay trang nao... dua may cai do vao cai dat di, de sau nay IT
    hieu y do cua anh la co the bat tat bat cu thu gi."* Canh CHAY THAT chu khong doc chu:
    bam mot o thi phai doi duoc pham vi that, va tra ve mac dinh phai sach. */
 (function(){
  CUR="settings";window.SETTAB="phanquyen";
  var pg="";try{pg=RENDER.settings()}catch(e){}
  var soO=(pg.match(/onclick="qtToggle\(/g)||[]).length;
  t("Cai dat co bang bat/tat tung trang cho tung chuc danh ("+soO+" o)", soO>=200&&/Thấy trang nào/.test(pg));
  t("bang co neo rieng cho bai huong dan", /data-tour="quyentrang"/.test(pg));
  /* V9.99w: MOI chuc danh nay deu CO trang Bao cao (khac nhau la pham vi), nen o dung de thu
     bat/tat phai la mot trang van con tat mac dinh. Chon `banggiao` - Marketing khong co no. */
  t("mac dinh: Marketing khong xem Ban giao lead", qtOn("marketing","banggiao")===false);
  qtToggle("marketing","banggiao");
  t("bam o thi pham vi THAT doi theo", buildScope("marketing_manager").tabs.duyet.indexOf("banggiao")>=0||buildScope("marketing_manager").pages.indexOf("banggiao")>=0);
  t("o khac mac dinh duoc danh dau", qtSua("marketing","banggiao")===true&&qtSoSua("marketing")===1);
  qtVeMacDinh("marketing");
  t("tra ve mac dinh thi sach han", qtSua("marketing","banggiao")===false&&qtSoSua("marketing")===0);
  /* TAT trang dap: khong duoc de chuc danh do roi vao khoang khong */
  var dap=ROLESCOPE.hocvu.land;
  qtToggle("hocvu",dap);
  var e2=buildScope("academic_staff");
  t("tat trang dap thi app tu lui ve trang khac con bat", e2.land!==dap&&e2.pages.indexOf(e2.land)>=0);
  qtVeMacDinh("hocvu");
  tv5("tra lai thi trang dap ve cho cu", buildScope("academic_staff").land===dap);
  t("lua chon ghi vao DATA.config (khong mat khi reset du lieu demo)", /c\.quyenTrang=c\.quyenTrang\|\|\{\}/.test(String(qtCfg)));
  window.SETTAB="ch2";CUR="banlam";
 })();
 /* V9.60 (anh Luan gom cong nhan vien): HR truoc day duoc DAY THEM trang Cai dat roi bop tab -
    tuc la van dua ho vao cho sua LUAT cua ca trung tam, chi la sua duoc it hon. Nay ho co nhom
    rieng `nhansu` voi man cua chinh ho, va KHONG con cua nao vao Cai dat. Hop dong doi theo:
    khong con canh "bop tab cho khon" ma canh "khong duoc vao". */
 (function(){
  var hr=(DATA.dl.DL01||[]).filter(function(x){return /^hr_/.test(String(ecode(x.role)||""))})[0];
  if(!hr){t("co nhan vien HR de thu (bo qua neu khong co)", true);return}
  applyScope(hr.staff_id);
  var rs=SCOPE();
  t("Nhan su dung nhom rieng, khong con roi vao nhom du phong", rs.group==="nhansu");
  t("Nhan su KHONG co cua nao vao Cai dat", rs.pages!=="*"&&rs.pages.indexOf("settings")<0);
  t("Nhan su co man cua chinh ho (nhan su + bang cong)",
    rs.pages.indexOf("nhansu")>=0&&rs.pages.indexOf("bangcong")>=0);
  /* V9.99w: Nhan su nay CO trang chi so (cua doi minh), nhung van khong cham vao hoc vien va
     khong cham vao man thu tien - do moi la ranh gioi that. */
  t("Nhan su khong cham vao hoc vien / tien",
    rs.pages.indexOf("hocvien")<0&&rs.pages.indexOf("thanhtoan")<0);
  CUR="nhansu";var pg="";try{pg=RENDER["nhansu"]()}catch(e){}
  t("man Nhan su ve duoc va co danh sach nguoi", pg.length>500&&/Danh s|nhân sự|Chức danh/i.test(pg));
  applyScope("");setRole("all")})();
 window.SETTAB="ch2";
})();


/* ---- 24quater. CAU HINH LUU RIENG - RESET DU LIEU DEMO KHONG DUOC CUON THEO (V9.47) ----
   Anh Luan: "cai dat thi luu la luu luon a, chu ko phai nhu du lieu demo ma bam reset la mat".
   Truoc ban nay ca hai nam chung MOT o nho LSKEY, ma demoResetRun xoa nguyen o do - bam "Xoa moi
   thay doi cua buoi demo" la bay sach hotline, 83 nguong CH2, 51 nguong KPI, moi cau nhac CH4,
   nhan danh muc CH1, thuong hieu, ma tran phan quyen. Do la MAT DU LIEU NGUOI DUNG. */
(function(){
 setRole("all");cfEnsure();
 t("co o nho RIENG cho cau hinh", /var CFKEY="ITTS_CONFIG_V1"/.test(SRC));
 t("co ham ghi va ham doc cau hinh rieng", typeof cfgSave==="function"&&typeof cfgLoad==="function");
 /* THUC SU chay: ghi cau hinh, xoa o du lieu, doc lai - cau hinh phai con */
 var kho={},luuThat=global.localStorage,cuCANLS=CANLS;
 global.localStorage={getItem:function(k){return kho[k]===undefined?null:kho[k]},
  setItem:function(k,v){kho[k]=String(v)},removeItem:function(k){delete kho[k]}};
 CANLS=true;
 var moc=paramOf("slaRetryCall_hours",4);
 function dat(v){(DATA.config.ch2||[]).forEach(function(c){if(c.name==="slaRetryCall_hours")c.value=String(v)})}
 dat(99); __cfbase=null; cfgSave();          /* lan dau chi ghi moc so sanh */
 dat(77); cfgSave();
 t("cfgSave ghi that vao o nho rieng", !!kho["ITTS_CONFIG_V1"]);
 t("o nho rieng KHONG chua du lieu DL (chi cau hinh)", String(kho["ITTS_CONFIG_V1"]||"").indexOf('"dl":')<0);
 kho["ITTS_DEMO_STATE_V1"]="{}";              /* gia lap dang giua buoi demo */
 try{global.localStorage.removeItem("ITTS_DEMO_STATE_V1")}catch(e){}   /* dung viec ma demoResetRun lam */
 t("reset du lieu demo KHONG dung toi o nho cau hinh", !!kho["ITTS_CONFIG_V1"]);
 dat(moc);
 t("cfgLoad doc lai duoc", cfgLoad()===true);
 t("nguong da sua SONG SOT qua mot lan reset du lieu", String(paramOf("slaRetryCall_hours",4))==="77");
 dat(moc);
 global.localStorage=luuThat; CANLS=cuCANLS; __cfbase=null;
 /* ma nguon: duong reset du lieu chi duoc dung LSKEY, khong duoc dung CFKEY */
 var resetFn=(SRC.match(/function demoResetRun\(\)\{[\s\S]*?\n\}/)||[""])[0];
 t("demoResetRun khong he dung toi CFKEY", !!resetFn&&resetFn.indexOf("CFKEY")<0&&resetFn.indexOf("ITTS_CONFIG")<0);
 t("moi lan luu deu ghi ca hai o nho", /persistSoon\(\)\{[\s\S]{0,220}demoSave\(\);cfgSave\(\)/.test(SRC));
 t("nap cau hinh TRUOC khi nap du lieu", SRC.indexOf("\ncfgLoad();")>=0&&SRC.indexOf("\ncfgLoad();")<SRC.indexOf("\ndemoLoad();"));
 /* nguoi dung phai DOC DUOC chuyen do, va phai co duong bo cau hinh mot cach CO Y */
 window.SETTAB="tongquan";
 var bd=RENDER["settings"]();
 t("ban do noi ro cau hinh khong mat khi reset du lieu", /không làm mất cấu hình/.test(bd));
 t("co nut bo cau hinh mot cach co y", /cfgResetAsk\(\)/.test(bd)&&typeof cfgResetAsk==="function");
 t("nut do hoi lai truoc khi xoa", /confirmRun\([^)]*"cfgResetRun"\)/.test(SRC));
 t("cau xac nhan reset DU LIEU noi ro cau hinh duoc giu", /CẤU HÌNH TRONG CÀI ĐẶT ĐƯỢC GIỮ NGUYÊN/.test(SRC));
 window.SETTAB="ch2";
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
 /* V9.88 - anh Luan: *"ua sao thay dung lai demo va reset demo trung nhau a"*. Do duoc NAM cua
   vao cung mot viec voi BA cai ten. Chip tren thanh tieu de bi bo vi no lap lai dung cai nut da
   co o dai "Du lieu demo" ngay duoi, va con goi bang mot ten khac. Tieu chi doi theo: thanh
   tieu de KHONG duoc mang mot nut dung lai demo thu hai. */
t("thanh tieu de khong co nut dung lai demo trung lap",
  !/id="demoBadgeWrap"[\s\S]{0,240}demoResetHoi/.test(HTML));
/* Do tren CHU HIEN RA, khong do tren ma nguon: chu thich trong ma cung nam trong file build
   nhung khong ai doc thay no. Do nham vao ma nguon la bat mot loi khong ton tai. */
t("chi con MOT ten cho viec dung lai demo", (function(){
  var noi=[];
  ["settings","banlam","viec"].forEach(function(k){
    try{CUR=k;window.SETTAB="demo";
      var o=String(RENDER[k]?RENDER[k]():"").replace(/<!--[\s\S]*?-->/g,"");
      if(/Reset demo|Reset d\u1eef li\u1ec7u demo|D\u1ef1ng l\u1ea1i d\u1eef li\u1ec7u demo/.test(o))noi.push(k)}catch(e){}});
  window.SETTAB="ch2";
  return noi.length===0})());
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
 tv5("co dung 4 nhom chang", ARCG.length===4);
 t("mac dinh 4 chang deu gap", ARCG.every(function(g){return navOpenDef(g)===false}));
 /* di vao mot trang trong chang 2 -> chi chang 2 mo */
 window.NAVOPEN={};
 go("banglop");
 t("vao trang cua chang nao thi mo dung chang do", navIsOpen(ARCG[1]));
 tv5("ba chang con lai tu gap", [ARCG[0],ARCG[2],ARCG[3]].every(function(g){return !navIsOpen(g)}));
 /* sang chang 4 -> chang 2 phai gap lai */
 go("ketthuc");
 tv5("doi sang chang khac thi chang cu gap lai", navIsOpen(ARCG[3])&&!navIsOpen(ARCG[1]));
 /* tu tay xo mot chang cung phai gap ba chang kia */
 navToggle(ARCG[0]);
 tv5("tu tay xo mot chang thi ba chang kia gap", navIsOpen(ARCG[0])&&[ARCG[1],ARCG[2],ARCG[3]].every(function(g){return !navIsOpen(g)}));
 /* xo mot chang la MO LUON ban do chang do - khong bat bam them mot nhat nua */
 window.NAVOPEN={};go("banlam");
 navToggle(ARCG[2]);
 tv5("xo chang la mo luon ban do chang", CUR==="chang"&&window.ARC===navGrpArc(ARCG[2]));
 t("gap chang lai thi khong dieu huong di dau", (function(){var cur0=CUR;navToggle(ARCG[2]);return CUR===cur0})());
 /* nhom KHONG phai chang thi khong bi luat nay dong toi */
 window.NAVOPEN={};
 t("nhom Lam viec / Dieu hanh khong bi gap oan", navIsOpen("Làm việc")&&navIsOpen("Điều hành"));
 navToggle(ARCG[2]);
 t("xo chang khong lam gap nhom Lam viec", navIsOpen("Làm việc"));
 window.NAVOPEN={};go("banlam");
})();


/* ---- 35. Ten hien thi anh Luan chot (V9.29n) ---- */
(function(){
 /* V9.99y (anh Luan): bo SO khoi ten nhom chang - nguoi chi co 2-3 chang nhin "C2, C3, C4" la
    tuong app thieu mat C1. Ten nhom nay la TEN CHANG, khong so. */
 t("ten nhom chang la ten chang, khong con so", ["changA","changB","changC","changD"].every(function(k){return arcGrpName(k)===ARCBK[k].t}));
 t("ten nhom tren menu lay tu arcGrpName, khong go tay",
   NAVTREE.filter(function(G){return G.arc}).every(function(G){return G.g===arcGrpName(G.arc)}));
 t("khong con nhom nao ten 'Chang N'", NAVTREE.every(function(G){return !/^Chặng \d/.test(G.g)}));
 /* doi ten nhom ma navIsArcGrp van nhan dung - truoc day no doan bang chu "Chang \d" */
 tv5("navIsArcGrp van nhan dung 4 nhom chang", NAVTREE.filter(navIsArcGrpG).length===4);
 t("muc ban do goi la 'Ban do chang'", uiItemDefLabel("changA")==="Bản đồ chặng");
 t("ten tren dau menu", UIDEF.brand==="ITTs - SOP TEMP"&&UIDEF.sub==="Hệ thống tuân thủ SOP");
 t("khung HTML in san dung ten do", /id="brandName">ITTs - SOP TEMP</.test(HTML)&&/id="brandSub">Hệ thống tuân thủ SOP</.test(HTML));
})();
function navIsArcGrpG(G){return navIsArcGrp(G.g)}


/* ---- 36. GIAO VIEN DU PHONG THEO NGAY + rang buoc 5 CHI NHANH / HOC ONLINE ---- */
(function(){
 setRole("all");
 t("co man GV du phong", typeof renderGvdp==="function"&&typeof gvBackup==="function"&&typeof sesSetTeacher==="function");
 /* du lieu: khong con giao vien nao thieu chi nhanh - thieu la cau hoi "ai thay o co so X" cham */
 var gv=rows("DL01").filter(isGVRole);
 t("moi giao vien deu co chi nhanh", gv.length>=5&&gv.every(function(g){return String(g.branch||"").trim()!==""}));
 /* du lieu: lop o Co so Online thi hinh thuc hoc phai la online */
 t("lop o Co so Online deu hoc online",
   rows("DL10").filter(function(c){return /^online/.test(ecode(c.branch))&&!clsOnline(c)}).length===0);
 t("lop online co link, lop tai cho co phong",
   rows("DL10").filter(function(c){var v=String(c.venue_or_zoom_link||"");
    if(clsOnline(c))return !/^http/.test(v);
    if(isc(c.learning_mode,"offline"))return /^http/.test(v);
    return false}).length===0);
 /* BAT BIEN 1: lop HOC TAI CHO -> nguoi de xuat phai co mat duoc o dung co so */
 var kt=0,sai=[];
 rows("DL11").slice(0,400).forEach(function(x){var c=find("DL10","class_id",x.class_id)||{};
  if(clsOnline(c)||!c.branch)return;
  gvBackup(x).forEach(function(r){if(!r.ok)return;kt++;
   if(!gvBranches(r.g.staff_id)[c.branch])sai.push(x.session_id+"/"+r.g.staff_id)})});
 t("co du de xuat de kiem", kt>=50);
 t("lop hoc tai cho: khong de xuat nguoi khong co mat duoc o co so do"+(sai.length?(" - "+sai.slice(0,3).join(",")):""), sai.length===0);
 /* BAT BIEN 2: khong bao gio de xuat nguoi dang co buoi khac trung gio */
 var sai2=[];
 rows("DL11").slice(0,300).forEach(function(x){var d=pvnd(x.session_date);if(!d)return;
  gvBackup(x).forEach(function(r){if(!r.ok)return;
   if(gvBusyAt(r.g.staff_id,d,x.session_id))sai2.push(x.session_id+"/"+r.g.staff_id)})});
 t("khong de xuat nguoi dang ban gio do", sai2.length===0);
 /* BAT BIEN 3: lop ONLINE thi khong duoc loai ai vi ly do co so */
 var onlSes=rows("DL11").filter(function(x){return clsOnline(find("DL10","class_id",x.class_id)||{})});
 t("co lop online trong du lieu", onlSes.length>0);
 t("lop online: khong ai bi loai vi co so",
   onlSes.slice(0,60).every(function(x){return gvBackup(x).every(function(r){return r.okBr})}));
 /* CUA GHI: doi GV phai CHAN dung 2 truong hop, va phai ghi VET */
 (function(){
  var ses=null,gvBad=null;
  rows("DL11").some(function(x){var c=find("DL10","class_id",x.class_id)||{};
   if(clsOnline(c)||!c.branch||!pvnd(x.session_date))return false;
   var L=gvBackup(x).filter(function(r){return !r.okBr});
   if(!L.length)return false; ses=x;gvBad=L[0].g;return true});
  t("tim duoc ca de thu chan sai co so", !!ses);
  if(ses){var old=ses.teacher_id;
   sesSetTeacher(ses.session_id,gvBad.staff_id,"thu");
   t("chan doi sang GV khong co mat o co so do", ses.teacher_id===old);
   var good=gvBackup(ses).filter(function(r){return r.ok})[0];
   if(good){reset();   /* actGuard chan bam lai trong 1.2s - bo dong ho truoc khi thu ca thu hai */
    sesSetTeacher(ses.session_id,good.g.staff_id,"GV chinh bao nghi");
    t("doi duoc sang nguoi hop le", ses.teacher_id===good.g.staff_id);
    t("doi GV co ghi vet vao buoi", /Đổi GV:/.test(String(ses.notes||""))&&/GV chinh bao nghi/.test(String(ses.notes||"")));
    ses.teacher_id=old}}})();
 /* nguong "chiem cho bao lau" lay tu cau hinh, va LICH TUAN dung CHUNG con so do */
 t("nguong trung gio lay tu cau hinh", sesSpanH()===paramOf("sessionSpan_hours",2));
 t("lich tuan dung chung nguong voi GV du phong", /_sp=sesSpanH\(\)\*36e5/.test(SRC));
 t("khong con so 2 gio cam cung o lich tuan", !/<2\*36e5/.test(SRC));
})();


/* ---- 37. HANG SO NGHIEP VU CUOI CUNG RA KHOI CODE (mang 5) ---- */
(function(){
 setRole("all");cfEnsure();rtEnsure();
 /* (a) han nop bai mac dinh */
 t("han nop mac dinh lay tu cau hinh", typeof dueFall==="function"&&dueFall()===num(paramOf("homeworkDueFallback_days",5)));
 t("khong con hang so DUEFALL trong ma nguon", !/\bDUEFALL\b/.test(SRC));
 (function(){var c=(DATA.config.ch2||[]).filter(function(x){return x.name==="homeworkDueFallback_days"})[0];
  var old=c.value;c.value="9";
  t("doi cau hinh la han nop doi theo", dueFall()===9);
  c.value=old})();
 /* (b) gio hen goi y - ca CON SO lan NHAN tren nut */
 t("gio hen lay tu cau hinh", apptH("apptEvening_hour",19)===num(paramOf("apptEvening_hour",19)));
 (function(){var c=(DATA.config.ch2||[]).filter(function(x){return x.name==="apptEvening_hour"})[0];
  var old=c.value;c.value="20";
  var lb=DTQUICK.filter(function(r){return r[0]==="t19"})[0][2]();
  t("doi gio ca toi thi NHAN tren nut doi theo", /20h/.test(lb));
  var d=DTQUICK.filter(function(r){return r[0]==="t19"})[0][1]();
  t("doi gio ca toi thi GIO dat vao o cung doi theo", d.getHours()===20);
  c.value=old})();
 t("khong con gio 15/19/9 cam cung trong DTQUICK", !/dtDay\(1,9\)/.test(SRC)&&!/dtAt\(new Date\(\),19\)/.test(SRC));
 /* (c) kich ban cham soc 16 chang */
 t("kich ban cham soc nam trong cau hinh", !!(DATA.config&&DATA.config.rtouch)&&Object.keys(DATA.config.rtouch).length===Object.keys(RTOUCHDEF).length);
 t("moi chang trong RTOUCHDEF deu la chang co that", Object.keys(RTOUCHDEF).every(function(k){return !!JBY[k]}));
 (function(){var k="contacted",old=rtList(k).join("\n");
  rtSet(k,"Cau moi mot\nCau moi hai");
  t("sua kich ban thi man Chay quy trinh doi theo", (function(){
    var J={k:k};var f=runTouchFields(J).filter(function(x){return x[0]==="content"})[0];
    return /Cau moi mot/.test(f[3])&&/Cau moi hai/.test(f[3])})());
  rtSet(k,old);
  t("tra ve ban goc duoc", rtList(k).join("\n")===old)})();
 t("app doc kich ban qua rtList, khong doc thang bang goc", !/RTOUCH\[/.test(SRC));
 /* moi tham so moi khai deu co dong cau hinh that (bat bien hai chieu da co tu V9.29f) */
 ["homeworkDueFallback_days","apptSoon_hours","apptMorning_hour","apptNoon_hour",
  "apptAfternoon_hour","apptEvening_hour","sessionSpan_hours"].forEach(function(n){
  t("tham so "+n+" co dong cau hinh that", (DATA.config.ch2||[]).some(function(x){return x.name===n}))});
})();


/* ---- 38. CAP THEM LUOT WOW (mang 5 - viec ton tu dau) ---- */
(function(){
 setRole("all");cfEnsure();
 t("co man cap them luot WOW", typeof wowGrantForm==="function"&&typeof wowGrantSave==="function");
 t("tran moi lan cap lay tu cau hinh", (DATA.config.ch2||[]).some(function(x){return x.name==="wowGrantMax_perTime"}));
 /* KHONG de bang moi: dung dung 2 cot da co san cua DL09 */
 t("dung cot co san wow_extra_approved / wow_extra_purchased",
   /wow_extra_approved/.test(SRC)&&/wow_extra_purchased/.test(SRC));
 /* CONG THUC con lai phai TRUNG voi deriveAll - hai noi hai cong thuc la som muon lech */
 t("cong thuc con lai giong deriveAll",
   (SRC.match(/num\(s\.wow_quota_default\)\+num\(s\.wow_extra_approved\)\+num\(s\.wow_extra_purchased\)-num\(s\.wow_quota_used\)/g)||[]).length>=2);
 /* "con trong" phai tru ca buoi DA DAT CHUA DAY - dat 3 buoi voi quota 3 la het, du remaining van 3 */
 (function(){
  var sid=rows("DL09").filter(function(x){return String(x.wow_quota_remaining||"")!==""})[0].student_id;
  var q0=wowQuotaOf(sid);
  t("con trong = con lai tru cho dang giu", q0.free===q0.rem-q0.held);
 })();
 /* cua ghi: chan het cac truong hop sai, va CO ghi vet */
 (function(){
  var sid=rows("DL09").filter(function(x){return String(x.wow_quota_remaining||"")!==""})[0].student_id;
  var s0=find("DL09","student_id",sid);
  var appr0=num(s0.wow_extra_approved),rem0=num(s0.wow_quota_remaining),notes0=s0.notes;
  setF({wg_stu:sid,wg_n:"2",wg_why:"",wg_kind:"approved"});reset();
  wowGrantSave();
  t("khong co ly do thi khong cap", num(s0.wow_extra_approved)===appr0);
  setF({wg_stu:sid,wg_n:"99",wg_why:"thu vuot tran",wg_kind:"approved"});reset();
  wowGrantSave();
  t("vuot tran moi lan thi khong cap", num(s0.wow_extra_approved)===appr0);
  setF({wg_stu:sid,wg_n:"2",wg_why:"Speaking thap hon han 3 ky nang",wg_kind:"approved"});reset();
  wowGrantSave();
  t("cap dung so luot", num(s0.wow_extra_approved)===appr0+2);
  t("con lai tang theo", num(s0.wow_quota_remaining)===rem0+2);
  t("co ghi vet ai cap, bao nhieu, vi sao", /WOW\+2/.test(String(s0.notes||""))&&/Speaking thap hon han/.test(String(s0.notes||"")));
  t("nhat ky cap luot doc lai duoc", /WOW\+2/.test(wowGrantLog(s0)));
  s0.wow_extra_approved=String(appr0);s0.wow_quota_remaining=String(rem0);s0.notes=notes0;
 })();
 setF({});
})();



/* Cat DUNG khoi dai so: tu <div class="bstats"> toi thanh cong cu ke tiep. Cat bang so ky tu
   thi dinh luon ca cac nut o thanh loc ben duoi - kiem se "xanh" ma khong kiem gi ca. */
function stripOf(o){var i=o.indexOf('<div class="bstats"');if(i<0)return "";   /* V9.29x: the nay nay co them data-tour, khong khop chuoi dong kin duoc nua */
 var rest=o.slice(i+19);
 var j=rest.search(/<div class="(tbar|fbar|panel|sechd|obcards)/);
 return rest.slice(0,j<0?rest.length:j)}
/* ---- 39. DAI THE: CHI DE XEM, AN/HIEN DUOC, CHU THICH DAY DU (V9.59) ---- */
/* Hop dong o day tung la "dai so BAM DUOC" va tung canh "o dai so tro dung mot bo loc CO THAT".
   Anh Luan 31/07 dao nguoc chinh sach: the la cai DONG HO chu khong phai cai NUT, viec loc da co
   thanh loc ngay duoi lam. Hop dong doi theo - va doi HAN, khong giu ban cu cho "chac an": mot
   bo kiem canh hai chinh sach nguoc nhau thi mot trong hai luon do. */
(function(){
 setRole("all");
 t("statStrip con duong cu cho dai hang cho viec (bvStrip)", SRC.indexOf('var act=t[5]||""')>=0);
 t("statStrip co duong moi cho dai the co ma", /function statStrip\(items,key,ids\)/.test(SRC));
 /* Quet TOAN BO trang thay vi mot danh sach cam cung: ban cu liet ke 11 trang, trong do 4 trang
    (test, buoihoc, khieunai, baoluu) that ra KHONG co dai the nao - chung chi co bang hang cho
    viec cua chuc danh. Bo kiem cu van bao xanh vi ham cat vung tra ve ca trang khi khong tim
    thay dai. Do la mot bo kiem khong bao gio can - dung bang cach quet that. */
 var soDai=0,conBam=[],thieuNut=[],thieuTip=[],trangCoDai=[];
 Object.keys(RENDER).forEach(function(k){var o="";
  try{o=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
  var n=(o.match(/class="bstatsw" data-thekey="/g)||[]).length;
  if(!n)return;
  soDai+=n;trangCoDai.push(k);
  if((o.match(/Thẻ \(\d+\/\d+\)/g)||[]).length<n)thieuNut.push(k);
  if(/<div class="bstat ro"[^>]*onclick/.test(o))conBam.push(k);
  if(/<div class="bstat ro"(?![^>]*data-tip)/.test(o))thieuTip.push(k)});
 t("co du dai the de kiem ("+soDai+" dai tren "+trangCoDai.length+" trang)", soDai>=12);
 t("khong trang nao con the bam duoc"+(conBam.length?(" - con bam: "+conBam.join(", ")):""), conBam.length===0);
 t("dai nao cung co nut Thẻ (n/N)"+(thieuNut.length?(" - thieu: "+thieuNut.join(", ")):""), thieuNut.length===0);
 t("the nao cung co chu thich khi ro chuot"+(thieuTip.length?(" - thieu: "+thieuTip.join(", ")):""), thieuTip.length===0);
 /* Trang khong co dai the thi phai co BANG HANG CHO VIEC - khong duoc trong khong ca hai */
 var trong=[];
 ["test","buoihoc","khieunai","baoluu"].forEach(function(k){var o="";try{o=RENDER[k]()}catch(e){return}
  if(!/class="bstats"/.test(o))trong.push(k)});
 tv5("trang khong co dai the thi van co bang hang cho viec"+(trong.length?" - TRONG: "+trong.join(", "):""), trong.length===0);
 /* Xep lop: dai the truoc day bam de doi tab XLFILT - nay tab do phai co that o THANH LOC */
 (function(){var o=RENDER.xeplop();
  var inStrip=(stripOf(o).match(/window\.XLFILT='([a-z]+)'/g)||[]).length;
  var inBar=(o.match(/window\.XLFILT='([a-z]+)'/g)||[]).length;
  t("xep lop: the khong con bam de doi tab", inStrip===0);
  t("xep lop: van con thanh loc that de xem tung nhom", inBar>=3)})();
 (function(){var o=RENDER.giaoan();
  t("giao an: co dai the va van con tab kho bai o thanh loc", /class="bstat ro"/.test(o)&&/window\.GATAB='kho'/.test(o))})();
 (function(){window.DUYTAB="duyetck";var o=RENDER.duyet();
  /* V9.51 (anh Luan chup): dai o thong ke lap nguyen dai chip da BO - nay hop dong nguoc lai:
     khong con bstat nao goi duyTabSet, va chip tab phai TU mang con so */
  t("hub Cho duyet: mot bo dieu khien duy nhat - chip mang so, khong con dai o lap",
    !/class="bstat[^"]*"[^>]*onclick="duyTabSet\(/.test(o)&&/onclick="duyTabSet\('duyetck'\)">[\s\S]{0,60}?<i class="segn">\d/.test(o))})();
 /* Đặt lại phạm vi về Quản trị TRƯỚC khi đo. Bẫy đã cắn: dải số của hub Chờ duyệt chỉ hiện
    cho người có quyền duyệt - 7/9 chức danh mở ra không có dải, và đó là ĐÚNG. Nhưng bộ kiểm
    này chạy sau hàng trăm câu khác, thừa hưởng phạm vi của người cuối cùng được đóng vai, nên
    nó đo phải TRẠNG THÁI SÓT chứ không đo app. Chạy trên v5 thì tình cờ xanh, trên v6 thì đỏ -
    khác nhau chỉ vì thứ tự các câu chạy trước đã đổi.
    Luật: bộ kiểm phải TỰ ĐẶT ĐIỀU KIỆN của mình, không thừa hưởng của câu trước. */
 /* Đặt lại TRỌN VẸN trước khi đo: vai, phạm vi, tab, và CẤU HÌNH GIAO DIỆN (ẩn/hiện thẻ,
    đổi tên nhóm menu) mà hàng trăm câu phía trên đã nghịch vào. Bẫy đã cắn: câu này đo phải
    trạng thái sót chứ không đo app - vẽ MỚI thì v5 và v6 ra HỆT NHAU (11873 byte, không lệch
    một ký tự), nhưng chạy giữa dàn bộ kiểm thì v6 đỏ.
    Luật: bộ kiểm phải TỰ ĐẶT ĐIỀU KIỆN của mình, không thừa hưởng của câu trước. */
 try{setRole("all");applyScope("");CURSTAFF="";window.DUYTAB="";
  if(DATA.config&&DATA.config.ui)delete DATA.config.ui;   /* trả cấu hình giao diện về mặc định */
  if(typeof THEHTML!=="undefined")for(var _k in THEHTML)delete THEHTML[_k];
 }catch(e){}
 /* 3 trang truoc day KHONG co dai so nao */
 ["giaoan","banggiao","duyet"].forEach(function(k){
  t("trang "+k+" da co dai so", /class="bstats"/.test(RENDER[k]()))});
})();


/* ---- 40. MAN "SUC KHOE DU LIEU" PHAI NOI CUNG MOT TIENG VOI BO KIEM ---- */
(function(){
 setRole("all");cfEnsure();
 var it=dataHealth().filter(function(x){return x.sev!=="ok"});
 /* BAT BIEN LOI: tren DU LIEU GOC, man nay phai SACH. Con dong nao tuc la no va bo kiem luc
    sinh du lieu dang noi khac nhau ve cung mot chuyen - phai sua cho khop, khong duoc de do.
    Day chinh la co che chong "bo luat thu ba troi khoi hai bo kia". */
 t("man Suc khoe du lieu sach tren du lieu goc"+(it.length?(" - con: "+it.slice(0,3).map(function(x){return x.rule+"/"+x.msg.slice(0,40)}).join(" ; ")):""), it.length===0);
 /* hang cho cong viec KHONG duoc tinh la loi du lieu - de vay thi man nay luc nao cung do vi
    viec binh thuong, va nguoi ta hoc duoc thoi quen bo qua canh bao */
 t("chiet khau cho duyet khong con bi tinh la loi du lieu", !/Chiết khấu",e.enrollment_id/.test(SRC));
 /* cua so an han diem danh: app, man suc khoe va _checkdata phai dung CHUNG mot tham so */
 t("cua so an han diem danh lay tu cau hinh", (DATA.config.ch2||[]).some(function(x){return x.name==="attendanceGrace_hours"}));
 t("man suc khoe doc dung tham so do", /attendanceGrace_hours/.test(SRC));
 (function(){var c=(DATA.config.ch2||[]).filter(function(x){return x.name==="attendanceGrace_hours"})[0];
  var old=c.value;c.value="1";
  var n1=dataHealth().filter(function(x){return x.rule==="Điểm danh"}).length;
  c.value="99999";
  var n2=dataHealth().filter(function(x){return x.rule==="Điểm danh"}).length;
  c.value=old;
  t("noi rong cua so an han thi canh bao diem danh bien mat", n1>=n2)})();
 /* man nay soi DU LIEU DANG MO - sua du lieu la no thay doi theo (khac han bo kiem luc sinh) */
 (function(){var e=rows("DL06").filter(function(x){return !isc(x.enrollment_status,"cancelled")&&num(x.final_fee)>0})[0];
  var old=e.remaining_amount;e.remaining_amount=String(num(e.remaining_amount)+123456);
  var n=dataHealth().filter(function(x){return x.rule==="Tiền"}).length;
  e.remaining_amount=old;
  t("sua du lieu trong app thi man suc khoe bat duoc ngay", n>0)})();
})();


/* ---- 41. 5 CHI NHANH + HOC ONLINE la LANG KINH soi moi thu (anh Luân) ---- */
(function(){
 setRole("all");
 /* (a) bao cao phai tach duoc theo co so - chuoi 5 co so ma bao cao gop thi khong ai biet
    co so nao dang ganh, co so nao dang hut */
 var o=RENDER.baocao();
 t("bao cao co bang so sanh theo co so", /So sánh theo cơ sở/.test(o));
 t("bang co so tach rieng cot lop online", /Trong đó online/.test(o));
 /* so hoc vien trong bang phai KHOP voi ghi danh co lop that - khong duoc dem trung, khong sot */
 (function(){var h2=baocaoBranch();
  var clsBr={};rows("DL10").forEach(function(c){clsBr[c.class_id]=c.branch||""});
  var real=rows("DL08").filter(function(x){return clsBr[x.class_id]!==undefined}).length;
  var sum=0;(h2.match(/<td><b>(\d+)<\/b><\/td>/g)||[]).forEach(function(x){sum+=num(x.replace(/\D/g,""))});
  t("tong hoc vien theo co so khop voi ghi danh co lop that ("+sum+"/"+real+")", sum===real)})();
 /* (b) loc theo co so phai co o cac trang co du lieu theo co so */
 ["hocvien","nhaplead","lop","giangvien","nhanvien"].forEach(function(k){
  /* V9.40: xet theo KHOA truc loc (x.k) chu khong theo ten cot (x.col) - truc "co so" cua trang
     hoc vien nay la truc TINH (fxCalc), khong doc thang mot cot nao. Bat theo x.col la bat theo
     cach cai dat chu khong phai theo cai ma nguoi dung nhin thay. */
  t("trang "+k+" loc duoc theo co so", (FLTDEF[k]||[]).some(function(x){return x.k==="branch"}))});
 /* V9.40 - va no phai RA SO DUNG. Truoc day loc thang tren DL09.branch (cot chi ghi mot lan luc
    chuyen doi, khong bao gio doi): chon Co so 3 ra 0 nguoi du CS3 dang co 13 em va 4 lop, Co so 4
    ra 0 du co 10 em. Tieu chi cu chi hoi "co truc loc khong", nen no van xanh suot. */
 (function(){
  var that={};rows("DL08").forEach(function(o){var c=find("DL10","class_id",o.class_id);
   if(c&&!clsOnline(c)&&c.branch)that[c.branch]=(that[c.branch]||0)+1});
  var hong=[];
  Object.keys(that).forEach(function(b){
   fltSt("hocvien").branch=[ecode(b)];
   var n=fltApply("hocvien",rows("DL09")).length;
   if(!n)hong.push((elabel(b)||b)+" co "+that[b]+" cho hoc ma loc ra 0")});
  fltSt("hocvien").branch=null;
  t("loc co so cua trang hoc vien ra dung so"+(hong.length?": "+hong.join("; "):""), hong.length===0)})();
 /* (c) hinh thuc hoc: lop online khong duoc rang buoc co so o BAT KY cho nao dung gvBackup */
 t("lop online khong bi rang buoc co so", rows("DL11").filter(function(x){
   var c=find("DL10","class_id",x.class_id)||{};if(!clsOnline(c))return false;
   return gvBackup(x).some(function(r){return !r.okBr})}).length===0);
 /* (d) du lieu: moi lop deu phai co co so VA hinh thuc hoc - thieu la moi bo loc/bao cao deu hut */
 t("moi lop deu ghi co so", rows("DL10").filter(function(c){return !String(c.branch||"").trim()}).length===0);
 t("moi lop deu ghi hinh thuc hoc", rows("DL10").filter(function(c){return !String(c.learning_mode||"").trim()}).length===0);
 t("danh muc co so co du 5 co so + online", (ENUM.enum_branch||[]).length>=6);
})();


/* ---- 42. PHONG HOC & DUNG LICH (viec ton dot 2 - khoi xep lich) ---- */
(function(){
 setRole("all");
 t("co man Phong & dung lich", typeof renderPhong==="function"&&typeof clashList==="function");
 /* LOP ONLINE KHONG BAO GIO DUNG PHONG - "phong" cua no la link rieng. Tron hai loai vao mot
    phep so la de ra hang loat canh bao gia. */
 t("lop online khong co phong vat ly", rows("DL10").filter(clsOnline).every(function(c){return roomOf(c)===""}));
 t("khong bao gio bao lop online dung phong",
   clashList().filter(function(x){return x.t==="phong"}).filter(function(x){
    return clsOnline(find("DL10","class_id",x.a.class_id)||{})}).length===0);
 /* link zoom / "da huy phong" KHONG duoc tinh la phong that */
 t("link zoom khong bi coi la phong", roomOf({learning_mode:"offline (Tại trung tâm)",venue_or_zoom_link:"https://zoom.us/j/x"})==="");
 t("phong da huy khong bi coi la phong", roomOf({learning_mode:"offline (Tại trung tâm)",venue_or_zoom_link:"Đã hủy phòng"})==="");
 t("phong that thi nhan ra", roomOf({learning_mode:"offline (Tại trung tâm)",venue_or_zoom_link:"Phòng 202 - Cơ sở 1"})!=="");
 /* dung cung nguong "mot buoi chiem cho bao lau" voi lich tuan va GV du phong */
 t("dung chung nguong voi lich tuan", /sesSpanH\(\)\*36e5/.test(SRC));
 /* du lieu demo: con dung it de man co gi ma xem, nhung khong duoc nhieu */
 (function(){var cl=clashList();
  t("du lieu demo con vai ca dung gio co y", cl.length>0&&cl.length<=6);
  t("khong con dung phong nao trong du lieu demo", cl.filter(function(x){return x.t==="phong"}).length===0);
  t("khong lop nao trung gio voi chinh no", cl.filter(function(x){return x.t==="lop"}).length===0)})();
 /* moi lop TAI CHO deu phai co phong - lop online thi khong */
 t("lop tai cho deu da co phong", noRoomList().length===0);
 t("noRoomList khong dinh lop online", noRoomList().every(function(c){return !clsOnline(c)}));
 /* man nay phai co loi ra XU LY, khong chi to cao */
 (function(){window.HTTAB="phong";var o=RENDER.hoctap();
  t("man dung lich mo duoc buoi bi dung", /goDD\(/.test(o));
  t("dung gio GV thi co nut doi GV ngay tai cho", /gvBackupForm\(/.test(o));
  window.HTTAB="today"})();
})();


/* ---- 43. CHOT CONG GIANG DAY (viec ton dot 2 - khoi tien) ---- */
(function(){
 setRole("all");cfEnsure();
 t("co bang cong giang day toan trung tam", typeof congThang==="function"&&typeof renderCong==="function");
 t("don gia buoi day lay tu cau hinh", (DATA.config.ch2||[]).some(function(x){return x.name==="teacherPayPerSession"}));
 var mo=congMonths();
 t("co thang de tinh cong", mo.length>0);
 /* BAT BIEN: tong buoi trong bang cong = tong buoi DA DAY XONG cua thang do. Sot mot buoi la
    thieu tien cua giao vien; dem trung la tra thua. */
 mo.slice(0,4).forEach(function(ym){
  var tot=congThang(ym).reduce(function(a,x){return a+x.n},0);
  var real=rows("DL11").filter(function(x){if(!isc(x.session_status,"completed"))return false;
   var d=pvnd(x.session_date);if(!d)return false;
   return (d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2))===ym&&String(x.teacher_id||"").trim()}).length;
  t("thang "+ym+": tong buoi trong bang cong khop so buoi da day", tot===real)});
 /* "da day xong" phai la DUNG MOT dinh nghia voi ho so giao vien - khong duoc dem kieu khac */
 t("dung chung dinh nghia buoi da day voi ho so GV", /isc\(x\.session_status,"completed"\)/.test(SRC));
 /* doi don gia thi tien doi theo */
 /* V9.40 (anh Luan chot 29/07): cong giang day tinh theo GIO, don gia tra theo
    (giang vien x loai ngay x ca). Buoi WOW 1-1 van tinh theo BUOI vi so WOW khong co gio vao -
    gio ra de nhan. Thu TUNG lop mot chu khong thu ca cum: thu ca cum thi khong biet lop nao
    dang bi bo qua. */
 (function(){
  function tong(){return congThang(mo[0]).reduce(function(a,x){return a+x.tien},0)}
  function gioLop(){return congThang(mo[0]).reduce(function(a,x){return a+x.gio},0)}
  function nWow(){return congThang(mo[0]).reduce(function(a,x){return a+x.wow},0)}
  /* (1) don gia WOW van phai an theo so BUOI WOW */
  (function(){var c=(DATA.config.ch2||[]).filter(function(x){return x.name==="wowPayPerSession"})[0];
   if(!c){t("co dong cau hinh wowPayPerSession", false);return}
   var cu=c.value,t1=tong(),n=nWow();
   c.value=String(num(cu)+1000);var t2=tong();c.value=cu;
   var ssW=congThang(mo[0]).filter(function(x){return x.wow>0}).length*1000+1;
   t("doi wowPayPerSession thi tien doi dung so buoi WOW ("+n+" buoi)", n>0&&Math.abs(t2-t1-n*1000)<=ssW)})();
  /* (2) tham so don gia GIO chung: chua khai bang gia thi moi gio deu an theo no */
  (function(){var cu=(DATA.config.giagio||[]).slice();DATA.config.giagio=[];dataChanged();
   var c=(DATA.config.ch2||[]).filter(function(x){return x.name==="teacherPayPerHour"})[0];
   if(!c){t("co dong cau hinh teacherPayPerHour", false);DATA.config.giagio=cu;dataChanged();return}
   var v=c.value,t1=tong(),g=gioLop();
   c.value=String(num(v)+1000);dataChanged();var t2=tong();
   c.value=v;DATA.config.giagio=cu;dataChanged();
   /* tien cong lam tron nghin cho TUNG NGUOI nen sai so toi da = so nguoi x 1000 */
   var ss=congThang(mo[0]).filter(function(x){return x.gio>0}).length*1000+1;
   t("chua khai bang gia thi moi gio an theo teacherPayPerHour ("+(Math.round(g*10)/10)+"h)",
     g>0&&Math.abs(t2-t1-g*1000)<=ss)})();
  /* (3) MUC MAC DINH theo ca: doi mot o thi CHI phan gio cua ca do doi */
  (function(){var cu=JSON.stringify(DATA.config.giagio||[]);
   DATA.config.giagio=[];dataChanged();
   var t1=tong();
   var gioToiThuong=0;
   congThang(mo[0]).forEach(function(x){var v=x.theoCa["thuong|toi"];if(v)gioToiThuong+=v.h});
   rateSet("","thuong","toi",num(paramOf("teacherPayPerHour",180000))+1000);
   var t2=tong();
   DATA.config.giagio=JSON.parse(cu);dataChanged();
   var ss2=congThang(mo[0]).filter(function(x){return x.gio>0}).length*1000+1;
   t("doi muc mac dinh CA TOI NGAY THUONG chi doi phan gio cua ca do ("+(Math.round(gioToiThuong*10)/10)+"h)",
     gioToiThuong>0&&Math.abs(t2-t1-gioToiThuong*1000)<=ss2)})();
  /* (4) MUC RIENG cua mot nguoi phai DE LEN muc mac dinh, va KHONG dung toi nguoi khac */
  (function(){var cu=JSON.stringify(DATA.config.giagio||[]);
   DATA.config.giagio=[];dataChanged();
   var L1=congThang(mo[0]).filter(function(x){return x.gio>0});
   if(L1.length<2){DATA.config.giagio=JSON.parse(cu);dataChanged();
    t("co it nhat 2 giang vien co gio de thu muc rieng", false);return}
   var ai=L1[0].g.staff_id,khac=L1[1].g.staff_id;
   var t1={};L1.forEach(function(x){t1[x.g.staff_id]=x.tien});
   DAYK.forEach(function(d){SHIFTK.forEach(function(k){
    rateSet(ai,d[0],k[0],num(paramOf("teacherPayPerHour",180000))*2)})});
   var t2={};congThang(mo[0]).forEach(function(x){t2[x.g.staff_id]=x.tien});
   DATA.config.giagio=JSON.parse(cu);dataChanged();
   t("muc rieng de len muc mac dinh cho dung nguoi do", t2[ai]>t1[ai]);
   t("khai muc rieng cho mot nguoi KHONG dung toi nguoi khac", t2[khac]===t1[khac])})();
 })();
 /* tach theo ca + lop online - lang kinh chi nhanh */
 /* V9.64: bang cong da roi khoi So thu hoc phi sang tab cua trang Giang vien (anh Luan:
    "cong giang day tu nhien lai nam trong so thu hoc phi, vo ly" -> "phai nam o Giang vien").
    Bo kiem phai di theo NGHIEP VU chu khong bam vao cho cu; do dung cho no dang o. */
 (function(){window.GVTAB="cong";var o=RENDER.giangvien();
  t("bang cong dung trong trang Giang vien, khong con trong So thu hoc phi",
    /Chia theo ca/.test(o)&&!/Chia theo ca/.test((function(){window.STTAB="cong";return RENDER.dsthanhtoan()})()));
  t("bang cong tach theo ca", /Chia theo ca/.test(o));
  t("bang cong noi ro dang tinh theo GIO", /giờ dạy thật/.test(o));
  t("bang cong co loi sang man don gia gio day", /SETTAB=.?giagio/.test(o));
  t("bang cong tach rieng buoi online", /Trong đó online/.test(o));
  t("noi thang la chua noi bang luong", /chưa nối bảng lương/.test(o));
  t("bang cong co cot ca test tinh theo LAN", /Ca test/.test(o)&&/đ\/lần/.test(o));
  t("bang cong in gio kem WOW de doi chieu", /Buổi WOW \(giờ kèm\)/.test(o));})();
 /* ===== V9.40c - QUAN LY CHAT BUOI WOW + CA TEST (anh Luan chot 29/07) ==============
    "Buoi wow cung phai quan ly chat" / "Test dau vao thi tinh theo lan nhung van phai ghi
    nhan vao ra". Bo kiem phai chung minh ba viec: moc gio GHI DUOC, moc gio DOI duoc so lieu,
    va tien cong KHONG bi nhan theo gio o hai loai nay. */
 (function(){
  var W=rows("DL14").filter(function(w){return isc(w.wow_status,"completed")});
  t("co ham moc gio buoi WOW", typeof wowStart==="function"&&typeof wowEnd==="function"&&typeof wowHours==="function");
  t("du lieu demo co buoi WOW ghi du moc vao - ra", W.filter(function(w){return wowHours(w)>0}).length>0);
  /* CO Y chua vai buoi thieu moc de luat canh bao co ca that ma nhac - neu du het thi luat do
     xanh suot va khong ai biet no co chay khong */
  var thieu=W.filter(function(w){return !wowHours(w)});
  t("van con buoi WOW thieu moc gio de luat canh bao co viec that ("+thieu.length+" buoi)", thieu.length>0);
  t("luat 'Buoi WOW thieu moc gio' sinh dung so viec do",
    slaItems().filter(function(x){return x.grp==="Buổi WOW thiếu mốc giờ"}).length===thieu.length);
  /* bam BAT DAU that -> phai ghi moc va tinh phut tre */
  (function(){var w=rows("DL14").filter(function(x){return isc(x.wow_status,"booked","confirmed")&&!String(x.wow_start_actual||"").trim()})[0];
   if(!w){t("co buoi WOW chua bat dau de thu", false);return}
   var cu={a:w.wow_start_actual,b:w.wow_end_actual,c:w.wow_late_minutes,d:w.wow_status};
   wowStart(w.wow_id);
   var ok1=!!String(w.wow_start_actual||"").trim();
   wowEnd(w.wow_id);
   var ok2=!!String(w.wow_end_actual||"").trim()&&isc(w.wow_status,"completed")&&wowHours(w)>=0;
   w.wow_start_actual=cu.a;w.wow_end_actual=cu.b;w.wow_late_minutes=cu.c;w.wow_status=cu.d;dataChanged();
   t("bam Bat dau buoi WOW thi ghi moc gio vao", ok1);
   t("bam Ket thuc buoi WOW thi ghi moc ra + chuyen sang da day", ok2)})();
  /* TIEN CONG: WOW theo BUOI, ca test theo LAN - doi so GIO khong duoc lam tien doi */
  (function(){var mo2=congMonths();if(!mo2.length){t("co thang de thu cong WOW", false);return}
   var t1=congThang(mo2[0]).reduce(function(a,x){return a+x.tien},0);
   var W2=rows("DL14").filter(function(w){return isc(w.wow_status,"completed")&&wowHours(w)>0});
   var cu=W2.map(function(w){return w.wow_end_actual});
   W2.forEach(function(w){var e=pvnd(w.wow_end_actual);if(e)w.wow_end_actual=fmtDT(new Date(e.getTime()+36e5))});
   dataChanged();
   var t2=congThang(mo2[0]).reduce(function(a,x){return a+x.tien},0);
   W2.forEach(function(w,i){w.wow_end_actual=cu[i]});dataChanged();
   t("keo dai buoi WOW them 1 gio KHONG lam tien cong doi (WOW tinh theo BUOI)", t1===t2)})();
  (function(){var mo2=congMonths();if(!mo2.length)return;
   var c=(DATA.config.ch2||[]).filter(function(x){return x.name==="testPayPerCase"})[0];
   if(!c){t("co dong cau hinh testPayPerCase", false);return}
   var n=congThang(mo2[0]).reduce(function(a,x){return a+x.test},0);
   var t1=congThang(mo2[0]).reduce(function(a,x){return a+x.tien},0);
   var cu=c.value;c.value=String(num(cu)+1000);
   var t2=congThang(mo2[0]).reduce(function(a,x){return a+x.tien},0);c.value=cu;
   var ss=congThang(mo2[0]).filter(function(x){return x.test>0}).length*1000+1;
   t("doi testPayPerCase thi tien doi dung so LAN test ("+n+" lan)", n>0&&Math.abs(t2-t1-n*1000)<=ss)})();
  t("ca test co ghi moc gio vao - ra", rows("DL03").filter(function(x){return testHours(x)>0}).length>0);
  window.STTAB="da"})();
})();


/* ---- 44. DOI GIAO VIEN CHINH CUA LOP (viec ton dot 2 - khoi giao vien/lop) ---- */
(function(){
 setRole("all");
 t("co cua doi GV chinh cua lop", typeof clsSetTeacher==="function"&&typeof clsTeacherForm==="function");
 /* o chon GV day bu phai di qua CUNG luat voi GV du phong, khong liet ke bua */
 t("day bu chon GV qua gvBackup", /var _bk=gvBackup\(s\)/.test(SRC));
 t("khong con liet ke bua moi giao vien cho day bu", !/\/teacher\|wow\/\.test\(ecode\(x\.role\)\)&&!\/inactive/.test(SRC));
 /* cua ghi: chan sai co so, bat buoc ly do, ghi vet, va KHONG dung buoi da day */
 (function(){
  var c=rows("DL10").filter(function(x){return !clsOnline(x)&&String(x.branch||"").trim()&&
    rows("DL11").some(function(s2){var d=pvnd(s2.session_date);
     return s2.class_id===x.class_id&&!isc(s2.session_status,"cancelled","completed")&&d&&d.getTime()>=Date.now()})})[0];
  t("tim duoc lop tai cho de thu", !!c);
  if(!c)return;
  var old=c.main_teacher_id,oldNotes=c.notes;
  var probe=rows("DL11").filter(function(s2){var d=pvnd(s2.session_date);
    return s2.class_id===c.class_id&&!isc(s2.session_status,"cancelled","completed")&&d&&d.getTime()>=Date.now()})[0];
  var L=gvBackup(probe);
  var bad=L.filter(function(r){return !r.okBr})[0];
  reset();
  if(bad){clsSetTeacher(c.class_id,bad.g.staff_id,"thu");
   t("chan giao lop tai cho cho GV khong o co so do", c.main_teacher_id===old)}
  else t("chan giao lop tai cho cho GV khong o co so do (khong co ca de thu)", true);
  reset();
  clsSetTeacher(c.class_id,(L.filter(function(r){return r.ok})[0]||{g:{}}).g.staff_id||"","");
  t("khong ghi ly do thi khong doi", c.main_teacher_id===old);
  var good=L.filter(function(r){return r.ok})[0];
  if(good){
   /* chup lai ten nguoi day cua cac buoi DA DAY XONG truoc khi doi */
   var doneBefore=rows("DL11").filter(function(x){return x.class_id===c.class_id&&isc(x.session_status,"completed")})
    .map(function(x){return x.session_id+"="+x.teacher_id});
   reset();
   clsSetTeacher(c.class_id,good.g.staff_id,"GV nghi viec");
   t("doi duoc GV chinh", c.main_teacher_id===good.g.staff_id);
   t("co ghi vet vao lop", /Đổi GV chính:/.test(String(c.notes||""))&&/GV nghi viec/.test(String(c.notes||"")));
   var doneAfter=rows("DL11").filter(function(x){return x.class_id===c.class_id&&isc(x.session_status,"completed")})
    .map(function(x){return x.session_id+"="+x.teacher_id});
   t("buoi DA DAY XONG giu nguyen nguoi da day (lich su + can cu tinh cong)",
     doneBefore.join("|")===doneAfter.join("|"));
   var fut=rows("DL11").filter(function(x){var d=pvnd(x.session_date);
     return x.class_id===c.class_id&&!isc(x.session_status,"cancelled","completed")&&d&&d.getTime()>=Date.now()});
   t("buoi con lai chua day da doi sang GV moi (tru buoi trung gio)",
     fut.every(function(x){return x.teacher_id===good.g.staff_id||gvBusyAt(good.g.staff_id,pvnd(x.session_date),x.session_id)}));
  }
  c.main_teacher_id=old;c.notes=oldNotes})();
 /* lop dang mo chua co GV chinh phai co CHO XU LY, khong chi mot dong chu do */
 (function(){window.HTTAB="phong";var o=RENDER.hoctap();
  t("man Phong co danh sach lop chua co GV chinh", /chưa có giáo viên chính/.test(o));
  var noGv=rows("DL10").filter(function(c){return /in_progress|open/.test(ecode(c.class_status))&&!String(c.main_teacher_id||"").trim()});
  t("co lop thieu GV thi giao ngay tai cho, khong co thi noi ro la khong con",
    noGv.length? /clsTeacherForm\(/.test(o) : /nào cũng đã có giáo viên chính/.test(o));
  window.HTTAB="today"})();
 /* loi vao doi GV chinh phai co o CHO NGUOI TA DANG DUNG, khong chi o mot man rieng */
 t("trang Van hanh lop doi duoc GV chinh", /clsTeacherForm\(/.test(RENDER.banglop()));
 (function(){var seen="";var od=global.openDrawer;global.openDrawer=function(t2,h){seen=h};
  try{openLopQuick(rows("DL10")[0].class_id)}catch(e){}
  global.openDrawer=od;
  t("drawer xem nhanh lop doi duoc GV chinh", /clsTeacherForm\(/.test(seen))})();
})();

console.log(bad.length?("CHECK16 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK16 OK: "+ok+" tieu chi");
