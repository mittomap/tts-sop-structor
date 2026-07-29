/* _check18.js - HỘI ĐỒNG AUDIT TỰ ĐỘNG (V9.29v).
   Chạy: ITTS_OUT=<out> node _check18.js

   VÌ SAO CÓ FILE NÀY. Hai hội đồng người trước đọc THEO LUỒNG, mà lỗi lại nằm GIỮA các luồng:
   một nút gọi hàm đã đổi tên, một chuỗi HTML bị esc() nuốt mất, một phép Math.round() chạy trên
   chuỗi rồi in ra NaN. Không ai đọc code mà thấy được - phải VẼ THẬT từng trang, từng tab, rồi soi.
   Nguyên tắc: ENUMERATE, không lấy mẫu. Mọi trang trong RENDER, mọi tab của mọi hub.

   Ngay lượt chạy đầu nó bắt được 4 lỗi thật đang sống trong app:
     1. "QUÁ HẠN NaN" ở màn Giao việc - Math.round() gọi trên chuỗi "12.3 giờ";
     2. pageHead() esc() nuốt chip bánh răng -> trang Buổi học in ra nguyên đoạn &lt;span...;
     3. dải số Dự thu nhét chip vào NHÃN (bị esc) thay vì vào phụ chú;
     4. 291 nút xoá danh mục chỉ có icon thùng rác, không nhãn, không chú thích. */
var fs = require('fs');
var OUT = process.env.ITTS_OUT || '.';
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){}},offsetHeight:200,offsetWidth:120,offsetTop:0,scrollTop:0,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},setSelectionRange(){},
 getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
var ST={};
global.document={getElementById:(id)=>ST[id]||(ST[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:"",search:"",pathname:"/cong-nhan-vien/"};
global.history={replaceState:function(){}};
var _LS={};global.localStorage={getItem:k=>_LS[k]===undefined?null:_LS[k],setItem(k,v){_LS[k]=String(v)},removeItem(k){delete _LS[k]}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
var SRC0=fs.readFileSync('./_APP.js','utf8');
require('vm').runInThisContext(SRC0);
setRole("all");
try{cfEnsure();rtEnsure()}catch(e){}

var bad=[],ok=0;
function t(n,c){if(c)ok++;else bad.push(n)}
/* Một tham số có thể nằm trên sheet dưới TÊN KHÁC (bảng PKEY khai tên thay thế của thời chạy
   Google Sheets). Hỏi "có ô sửa không" mà bỏ qua bảng đó thì báo thiếu oan 10 tham số. */
function cfHasRow(n){
 var names=[n].concat((typeof PKEY!=="undefined"&&PKEY[n])||[]);
 return names.some(function(x){return (DATA.config.ch2||[]).some(function(r){return r.name===x})})}

/* ---------- VẼ THẬT: mọi trang, mọi tab của mọi hub ---------- */
var TABS={
 hoctap:["HTTAB",["today","lichtuan","gvdp","phong","lop","buoihoc","wow"]],
 tuyensinh:["TSTAB",["lead","test","tuvan","thanhtoan","reup"]],
 cskh:["CSTAB",["khaosat","phanhoi","khieunai"]],
 khac:["KTAB",["baoluu","magioithieu"]],
 duyet:["DUYTAB",["duyetck","duyethoan","duyetnghi","duyetthu","duyetgiao","banggiao"]],
 dsthanhtoan:["STTAB",["da","du","cong"]],
 /* Lay THANG tu app (setTabs) - truoc day cho nay chep tay danh sach tab, them tab moi la bo kiem im lang bo sot. */
 settings:["SETTAB",setTabs().map(function(t){return t[0]})],
 giaoan:["GATAB",["ga","kho"]],
 banlam:["BLVIEW",["list","board"]],
 giaoviec:["TKTAB",["mine","given","report"]],
 chang:["ARC",["changA","changB","changC","changD"]]};
var HTML={},err=[];
Object.keys(RENDER).forEach(function(k){
 var T=TABS[k];
 if(T){T[1].forEach(function(tb){window[T[0]]=tb;
   try{HTML[k+"#"+tb]=RENDER[k]()}catch(e){err.push(k+"#"+tb+": "+e.message)}});window[T[0]]=undefined}
 else{try{HTML[k]=RENDER[k]()}catch(e){err.push(k+": "+e.message)}}});
var VIEWS=Object.keys(HTML);
t("vẽ được ít nhất 45 trang/tab (đang "+VIEWS.length+")", VIEWS.length>=45);
t("không trang/tab nào vỡ khi vẽ"+(err.length?(" - "+err.slice(0,3).join(" | ")):""), err.length===0);

/* ---------- 1. HÀM TRONG onclick PHẢI CÓ THẬT ----------
   Đổi tên một hàm mà quên một chỗ gọi thì nút đó bấm vào KHÔNG LÀM GÌ và cũng KHÔNG BÁO LỖI. */
var missing={};
VIEWS.forEach(function(k){
 (HTML[k].match(/onclick="[^"]*"/g)||[]).forEach(function(a){
  /* Chỉ lấy lời gọi hàm TOÀN CỤC. Hai cái bẫy:
     - không đứng sau dấu chấm (đó là gọi phương thức);
     - phải BỎ CHUỖI ký tự trước đã, vì tiếng Việt trong chuỗi cũng khớp mẫu "chữ (" -
       vd onclick="viecTeam('Giảng viên (ACA)')" từng bị đọc thành gọi hàm tên "n". */
  var body=a.slice(9,-1).replace(/'[^']*'/g,"''").replace(/&quot;[^&]*&quot;/g,"");
  (body.match(/(^|[^.\w$])([A-Za-z_$][A-Za-z0-9_$]*)\s*\(/g)||[]).forEach(function(f){
   var nm=f.replace(/[^A-Za-z0-9_$]/g,"").replace(/\($/,"");
   if(!nm||["if","for","while","return","function","typeof","new","catch","switch","this"].indexOf(nm)>=0)return;
   if(typeof global[nm]==="function")return;
   (missing[nm]=missing[nm]||[]).push(k)})});});
t("mọi hàm gọi trong onclick đều có thật"+(Object.keys(missing).length?(" - thiếu: "+Object.keys(missing).slice(0,5).join(", ")):""),
  Object.keys(missing).length===0);

/* ---------- 2. go() PHẢI TỚI MỘT TRANG CÓ THẬT ---------- */
var badGo={};
VIEWS.forEach(function(k){
 (HTML[k].match(/go\('([a-zA-Z0-9_]+)'\)/g)||[]).forEach(function(g){
  var pg=g.match(/'([^']+)'/)[1];
  if(!PBK[pg]&&!goAlias(pg))(badGo[pg]=badGo[pg]||[]).push(k)})});
t("mọi go() đều tới trang có thật"+(Object.keys(badGo).length?(" - "+Object.keys(badGo).join(", ")):""),
  Object.keys(badGo).length===0);

/* ---------- 3. KHÔNG ĐƯỢC ĐỂ HTML THÔ LỌT RA MÀN HÌNH ----------
   Dấu hiệu: chuỗi &lt;span / &lt;button trên màn hình = ai đó esc() một đoạn HTML do chính mình
   sinh ra. Lớp lỗi này đã cắn 2 lần (statStrip, pageHead). */
var rawHtml=VIEWS.filter(function(k){return /&lt;(div|span|button|i class|a )/.test(HTML[k])});
t("không có HTML thô lọt ra màn hình"+(rawHtml.length?(" - "+rawHtml.slice(0,4).join(", ")):""), rawHtml.length===0);

/* ---------- 4. KHÔNG undefined / NaN / [object Object] ---------- */
var junk=[];
VIEWS.forEach(function(k){var m=[];
 if(/>undefined</.test(HTML[k])||/undefined<\/b>/.test(HTML[k]))m.push("undefined");
 if(/NaN/.test(HTML[k]))m.push("NaN");
 if(/\[object Object\]/.test(HTML[k]))m.push("[object Object]");
 if(m.length)junk.push(k+"("+m.join(",")+")")});
t("không in undefined/NaN/[object Object] ra màn hình"+(junk.length?(" - "+junk.slice(0,4).join(", ")):""), junk.length===0);

/* ---------- 5. NÚT CHỈ CÓ ICON PHẢI CÓ NHÃN ----------
   Nút không chữ mà cũng không aria-label/data-tip thì người dùng bàn phím và người đọc màn hình
   không biết nó làm gì - nguy nhất là mấy nút XOÁ. */
var noLabel={};
VIEWS.forEach(function(k){
 (HTML[k].match(/<button[^>]*>\s*<i class="ti [^"]*"[^>]*>\s*<\/i>\s*<\/button>/g)||[]).forEach(function(b){
  if(/aria-label|title=|data-tip/.test(b))return;
  var fn=(b.match(/onclick="([a-zA-Z_$][A-Za-z0-9_$]*)/)||[])[1]||"?";
  noLabel[fn]=(noLabel[fn]||0)+1})});
t("nút chỉ có icon đều có nhãn/chú thích"+(Object.keys(noLabel).length?(" - "+Object.keys(noLabel).join(", ")):""),
  Object.keys(noLabel).length===0);

/* ---------- 6. TRANG NÀO CŨNG PHẢI CÓ TRẠNG THÁI RỖNG TỬ TẾ ----------
   Danh sách rỗng mà không nói gì thì người dùng tưởng app hỏng. */
var noEmpty=VIEWS.filter(function(k){
 var o=HTML[k];
 if(!/<tbody>/.test(o)&&!/class="obcards/.test(o))return false;      /* trang không có danh sách */
 if(/class="empty"/.test(o))return false;                            /* có chỗ báo rỗng */
 return !/(<tr>|class="obcard")/.test(o)});                          /* rỗng thật mà không báo */
t("danh sách rỗng đều có dòng báo rỗng"+(noEmpty.length?(" - "+noEmpty.slice(0,4).join(", ")):""), noEmpty.length===0);

/* ---------- 7. NHÃN ENUM PHẢI IN NGUYÊN VĂN THEO CH1 ----------
   Luật cứng của dự án: enum ghi dạng "code (Nhãn tiếng Việt)", màn hình in NHÃN chứ không in mã. */
var rawCode=[];
var CODES=["in_progress","not_contacted","confirmed_with_deposit","submitted_on_time","pending_review","no_show"];
VIEWS.forEach(function(k){
 if(k==="settings#ch1")return;     /* đây ĐÚNG là màn sửa danh mục - nó phải hiện mã */
 CODES.forEach(function(c){
 var re=new RegExp(">\\s*"+c+"\\s*<","g");
 if(re.test(HTML[k]))rawCode.push(k+"/"+c)})});
t("không in mã enum thô ra màn hình"+(rawCode.length?(" - "+rawCode.slice(0,4).join(", ")):""), rawCode.length===0);

/* ---------- 8. ĐỒNG BỘ HAI CỔNG ----------
   Cổng học viên và cổng nhân viên phải nói cùng một con số về cùng một chuyện. */
(function(){
 var HV=fs.readFileSync('./_HV.js','utf8');
 /* hai cổng dùng CHUNG hàm nghiệp vụ, không được có bản sao riêng cho cổng học viên */
 ["insDueState","bhState","absQueue","jStageOf","paramOf","msgText"].forEach(function(f){
  t("cổng học viên dùng chung hàm "+f+" (không có bản sao riêng)",
    (HV.match(new RegExp("function\\s+"+f+"\\s*\\(","g"))||[]).length<=1)});
 /* mọi tham số cấu hình cổng học viên đọc đều phải có dòng cấu hình thật */
 var prm={};(HV.replace(/\/\*[\s\S]*?\*\//g,"").match(/paramOf\("([A-Za-z_]+)"/g)||[]).forEach(function(x){prm[x.match(/"([^"]+)"/)[1]]=1});
 var thieu=Object.keys(prm).filter(function(n){return !cfHasRow(n)});
 t("mọi tham số cổng học viên đọc đều có ô sửa"+(thieu.length?(" - "+thieu.join(", ")):""), thieu.length===0);
})();

/* ---------- 9. CỬA GHI PHẢI TỰ LƯU ----------
   Luật cứng đã rút ra từ V9.2x: mọi cửa ghi phải tự gọi persistSoon(), không dựa vào reRender. */
(function(){
 var SRC=SRC0.replace(/\/\*[\s\S]*?\*\//g,"");
 var doors=["sesSetTeacher","clsSetTeacher","wowGrantSave","absReq","absReview","absMakeup"];
 doors.forEach(function(d){
  var i=SRC.indexOf("function "+d+"(");
  if(i<0){t("có cửa ghi "+d, false);return}
  var body=SRC.slice(i,i+3000);
  var j=body.indexOf("\nfunction ");if(j>0)body=body.slice(0,j);
  t("cửa ghi "+d+" tự gọi persistSoon", /persistSoon\(\)/.test(body)||/markRow|jUpdRow|jSaveRow/.test(body))});
})();

/* ---------- 10. MỌI THAM SỐ APP ĐỌC ĐỀU PHẢI CÓ Ô SỬA (và ngược lại) ---------- */
(function(){
 var SRC=SRC0.replace(/\/\*[\s\S]*?\*\//g,"");
 var used={};(SRC.match(/paramOf\("([A-Za-z_]+)"/g)||[]).forEach(function(x){used[x.match(/"([^"]+)"/)[1]]=1});
 (SRC.match(/paramStr\("([A-Za-z_]+)"/g)||[]).forEach(function(x){used[x.match(/"([^"]+)"/)[1]]=1});
 var khai={};APPPARAMS.forEach(function(p){khai[p[1]]=1});
 delete used.slaXxx;      /* tên ví dụ trong chú thích, không phải tham số thật */
 var thieuOSua=Object.keys(used).filter(function(n){return !khai[n]&&!cfHasRow(n)});
 t("mọi tham số app đọc đều có ô sửa"+(thieuOSua.length?(" - "+thieuOSua.join(", ")):""), thieuOSua.length===0);
 var thieuDong=Object.keys(khai).filter(function(n){return !cfHasRow(n)});
 t("mọi tham số khai báo đều có dòng cấu hình thật"+(thieuDong.length?(" - "+thieuDong.join(", ")):""), thieuDong.length===0);
})();

/* ---------- 11. ĐỊA CHỈ: MỌI TRANG TRÊN MENU ĐỀU MỞ ĐƯỢC BẰNG LINK ---------- */
(function(){
 var xau=[];
 NAVTREE.forEach(function(G){G.items.forEach(function(k){
  if(!hashOK(k))xau.push(k);
  else if(slugPg(pgSlug(k))!==k)xau.push(k+"(slug)")})});
 t("mọi mục trên menu đều mở được bằng địa chỉ"+(xau.length?(" - "+xau.join(", ")):""), xau.length===0);
})();


/* ---------- 12. VẼ LẠI TOÀN BỘ APP BẰNG MẮT CỦA TỪNG CHỨC DANH ----------
   Trang chạy tốt với quyền quản trị không có nghĩa là chạy tốt với 8 chức danh còn lại: phạm vi
   dữ liệu bị thu hẹp, danh sách rỗng, biến ngữ cảnh trống. Đây đúng là "lỗi nằm GIỮA các luồng".
   Vẽ THẬT mọi trang bằng mắt từng người rồi soi cùng bộ tiêu chí. */
(function(){
 var staff=rows("DL01").filter(staffActive);
 var byRole={};
 staff.forEach(function(st){var g=mapRoleCode(ecode(st.role));if(!byRole[g])byRole[g]=st});
 var who=Object.keys(byRole);
 t("có đủ chức danh để thử (đang "+who.length+")", who.length>=6);
 var vo=[],rac=[],tho=[];
 who.forEach(function(g){
  var st=byRole[g];
  try{applyScope(st.staff_id)}catch(e){}
  Object.keys(RENDER).forEach(function(k){
   var o="";
   try{o=RENDER[k]()}catch(e){vo.push(g+"/"+k+": "+e.message);return}
   if(/>undefined<|NaN|\[object Object\]/.test(o))rac.push(g+"/"+k);
   if(/&lt;(div|span|button|i class)/.test(o))tho.push(g+"/"+k)})});
 try{applyScope("")}catch(e){}
 setRole("all");
 t("không trang nào vỡ với bất kỳ chức danh nào"+(vo.length?(" - "+vo.slice(0,3).join(" | ")):""), vo.length===0);
 t("không rác undefined/NaN với bất kỳ chức danh nào"+(rac.length?(" - "+rac.slice(0,3).join(", ")):""), rac.length===0);
 t("không HTML thô với bất kỳ chức danh nào"+(tho.length?(" - "+tho.slice(0,3).join(", ")):""), tho.length===0);
})();

/* ---------- 13. CỔNG HỌC VIÊN: VẼ THẬT MỌI HỒ SƠ ----------
   Cổng học viên chỉ có MỘT trang nhưng có hàng trăm hồ sơ, mỗi hồ sơ một tình trạng khác nhau
   (chưa xếp lớp, đã kết thúc, đang bảo lưu...). Vẽ hết rồi soi cùng bộ tiêu chí. */
(function(){
 var HVJS=fs.readFileSync('./_HV.js','utf8');
 var g2={};
 for(var key in global)g2[key]=1;
 var vm=require('vm');
 var sandbox={console:console,require:require,Math:Math,JSON:JSON,Date:Date,RegExp:RegExp,
  parseInt:parseInt,parseFloat:parseFloat,isNaN:isNaN,String:String,Number:Number,Object:Object,Array:Array,setTimeout:function(){},clearTimeout:function(){}};
 sandbox.window=sandbox;sandbox.document=global.document;sandbox.location={hash:"",search:"",pathname:"/cong-hoc-vien/"};
 sandbox.history={replaceState:function(){}};
 sandbox.localStorage=global.localStorage;sandbox.sessionStorage=global.sessionStorage;
 vm.createContext(sandbox);
 try{vm.runInContext(HVJS,sandbox)}catch(e){t("cổng học viên nạp được",false)}
 if(typeof sandbox.renderTrangHV!=="function"){t("cổng học viên có hàm vẽ trang",false);return}
 t("cổng học viên nạp được", true);
 var vo=[],rac=[],tho=[],n=0;
 (sandbox.rows("DL09")||[]).forEach(function(st){
  sandbox.window.HVID=st.student_id;n++;
  var o="";
  try{o=sandbox.renderTrangHV()}catch(e){vo.push(st.student_id+": "+e.message);return}
  if(/>undefined<|NaN|\[object Object\]/.test(o))rac.push(st.student_id);
  if(/&lt;(div|span|button|i class)/.test(o))tho.push(st.student_id)});
 t("vẽ được cổng học viên cho mọi hồ sơ (đang "+n+")", n>=50);
 t("không hồ sơ nào làm vỡ cổng học viên"+(vo.length?(" - "+vo.slice(0,3).join(" | ")):""), vo.length===0);
 t("cổng học viên không in rác undefined/NaN"+(rac.length?(" - "+rac.length+" hồ sơ, vd "+rac[0]):""), rac.length===0);
 t("cổng học viên không để lọt HTML thô"+(tho.length?(" - "+tho.length+" hồ sơ, vd "+tho[0]):""), tho.length===0);
})();


/* ---------- 14. TRỢ THỦ THAO TÁC (anh Luân đặt) ---------- */
(function(){
 setRole("all");
 /* V9.35: tro thu ROI khoi than trang, ve NUT GOC duoi ben phai. Cac tieu chi duoi day truoc
    day soi tthHTML() - ma tthHTML nay KHONG con duoc ve o dau ca. Kiem mot ham khong ai goi thi
    luon xanh ma chang bao ve duoc gi: dung loai "kiem gia" du an nay van bat. Nay soi asstHTML(). */
 var HTMLF=fs.readFileSync(OUT+'/ITTs_WebApp_v5_demo.html','utf8');
 t("có trợ thủ + công tắc trên thanh tiêu đề", typeof asstHTML==="function"&&typeof tthToggle==="function"&&/id="tthBtn"/.test(HTMLF));
 t("V9.35 tro thu co NUT rieng o goc trong ca hai cong", /id="asstfab"/.test(HTMLF)&&/id="asstfab"/.test(fs.readFileSync(OUT+'/ITTs_TrangHocVien_demo.html','utf8')));
 t("mặc định BẬT", tthOn()===true);
 /* LUẬT CỨNG: trợ thủ ĐỌC slaItems, KHÔNG khai lại việc lần thứ hai */
 var SRCn=SRC0.replace(/\/\*[\s\S]*?\*\//g,"");
 var i=SRCn.indexOf("function workAll(");var body=SRCn.slice(i,i+700);
 t("trợ thủ đọc slaItems chứ không tự khai việc", /slaItems\(\)/.test(body));
 /* tắt là biến mất sạch, không để lại khoảng trống */
 t("tam tro thu ve ra co noi dung that", asstHTML().length>400);
 /* KHÔNG ĐƯỢC NÓI LÁO: hết việc thì nói hết việc, còn việc thì đếm việc thật - không nói chung chung */
 t("con viec thi noi ro con bao nhieu", (function(){
   var n=workAll().length;return n===0||asstHTML().indexOf(n+" việc")>=0})());
 t("het viec thi noi thang la het, khong ve the viec rong", (function(){
   var cu=window.ASSTSKIP;window.ASSTSKIP={};
   var h=asstHTML();window.ASSTSKIP=cu;
   return workAll().length?(h.indexOf("Việc kế tiếp")>=0):(h.indexOf("Không còn việc nào")>=0)})());
 /* nói đúng việc của ĐÚNG người: đổi chức danh là đổi nội dung */
 (function(){
  var gv=rows("DL01").filter(isGVRole)[0];
  var ac=rows("DL01").filter(function(x){return /account/.test(ecode(x.role))})[0];
  function nhu(sid){window.GATE_SID=sid;applyScope(sid);setRole("all")}
  nhu(gv.staff_id);var a=asstHTML();
  nhu(ac.staff_id);var b=asstHTML();
  window.GATE_SID="";applyScope("");setRole("all");
  t("hai chức danh khác nhau thì trợ thủ nói khác nhau", a!==b&&a.length>200&&b.length>200)})();
 /* việc gấp nhất phải BẤM ĐƯỢC ngay, không chỉ đọc */
 t("việc gấp nhất có nút làm ngay", /slaAct\(|leadDetail\(|openQuick\(|jumpFlow\(/.test(asstHTML()));
 /* V9.35: tro thu KHONG con chen vao than trang - no o nut goc duoi ben phai. Tieu chi cu dang
    canh gac dung cai da bo. */
 t("V9.35 than trang KHONG con bi tro thu chen vao", !/_tth\+renderList\(key\)/.test(SRCn)&&!/_tth\+RENDER\[key\]\(\)/.test(SRCn));
})();


/* ---------- 15. NHỊP NGÀY THEO CHỨC DANH (N2) ---------- */
(function(){
 t("có nhịp ngày", typeof nhipList==="function"&&typeof asstHTML==="function");
 t("đủ 5 nhóm vị trí", Object.keys(NHIP).length>=5);
 var xau=[],rong=[];
 function nhu(sid){window.GATE_SID=sid;applyScope(sid);setRole("all")}
 var mau=[[/^sales_staff/,"tuvan"],[/^academic_staff/,"hocvu"],[/^teacher/,"giaovien"],
          [/^account/,"ketoan"],[/^ceo/,"quanly"]];
 mau.forEach(function(pr){
  var st=rows("DL01").filter(function(x){return pr[0].test(ecode(x.role))})[0];
  if(!st){xau.push("khong co nhan su vai "+pr[1]);return}
  nhu(st.staff_id);
  if(nhipKey()!==pr[1])xau.push(st.staff_id+" -> "+nhipKey()+" (mong "+pr[1]+")");
  var L=nhipList();
  if(!L.length)rong.push(pr[1]);
  /* mọi nhịp phải trỏ tới một trang CÓ THẬT - trỏ vào trang không tồn tại thì bấm vào đứng im */
  L.forEach(function(x){if(!PBK[x.page]&&!goAlias(x.page))xau.push(pr[1]+": trang "+x.page+" khong co that")});
  /* nhịp phải có ít nhất một hàng chờ đếm được, nếu toàn thói quen thì nó chỉ là tờ giấy dán tường */
  if(!L.some(function(x){return !x.hab}))xau.push(pr[1]+": khong co hang cho nao dem duoc")});
 window.GATE_SID="";applyScope("");setRole("all");
 t("mỗi chức danh ra đúng nhóm nhịp của mình"+(xau.length?(" - "+xau.slice(0,3).join(" | ")):""), xau.length===0);
 t("chức danh nào cũng có nhịp ngày"+(rong.length?(" - trống: "+rong.join(", ")):""), rong.length===0);
 /* THÓI QUEN không được gắn mác "xong" - đó là nói láo, người ta đọc thấy xanh rồi bỏ qua */
 (function(){
  var st=rows("DL01").filter(function(x){return /^ceo/.test(ecode(x.role))})[0];
  if(!st)return; nhu(st.staff_id);
  var L=nhipList(),hab=L.filter(function(x){return x.hab});
  /* V9.35: nhip ngay nay hien trong tam tro thu. Chip cua mot buoi chi cong so cua HANG CHO;
     buoi nao toan thoi quen thi chip ghi dau gach chu KHONG ghi so 0 - ghi 0 la nguoi ta doc
     thanh "da xong het", ma thoi quen thi khong co gi de xong. */
  window.ASSTBUOI="";var html=asstHTML();
  t("có phân biệt thói quen với hàng chờ", hab.length>0);
  t("thoi quen KHONG bi gan mac xong - chip ghi dau gach", (function(){
    var buois={};L.forEach(function(r){(buois[r.buoi]=buois[r.buoi]||[]).push(r)});
    var toanThoiQuen=Object.keys(buois).filter(function(b){return buois[b].every(function(r){return r.hab})});
    if(!toanThoiQuen.length)return true;
    return html.indexOf("—")>=0})());
  t("mo chip ra thi thoi quen ghi ro 'nen xem'", (function(){
    var b0=(L.filter(function(r){return r.hab})[0]||{}).buoi;
    if(!b0)return true;
    window.ASSTBUOI=b0;var h2=asstHTML();window.ASSTBUOI="";
    return /nên xem/.test(h2)})());
  window.GATE_SID="";applyScope("");setRole("all")})();
 /* nhịp ngày chỉ ở TRANG ĐẦU - nhét vào mọi trang là nhiễu, nhiễu thì người ta tắt Trợ thủ luôn */
 (function(){var st=rows("DL01").filter(function(x){return /^account/.test(ecode(x.role))})[0];
  if(!st)return; nhu(st.staff_id);
  var land=SCOPE().land||"banlam";
  var a=asstHTML();
  go("hocvien");var b=asstHTML();
  window.GATE_SID="";applyScope("");setRole("all");
  /* V9.35: nhip ngay nay nam TRONG tam tro thu (3 chip) nen no di theo nguoi, khong con chuyen
     "chi hien o trang dau" - va cung khong con lam nhieu trang nao vi trang da sach. */
  t("nhip ngay nam trong tam tro thu, khong con o than trang", /asstChip/.test(a));
  t("doi trang thi tam tro thu van co nhip ngay (di theo nguoi, khong theo trang)", /asstChip/.test(b))})();
})();


/* ---------- 16. DỊCH MỐC THỜI GIAN CỦA DỮ LIỆU DEMO (anh Luân đặt) ---------- */
(function(){
 t("có bộ dịch thời gian", typeof tshApply==="function"&&typeof tshAuto==="function"&&typeof tshNow==="function");
 t("dữ liệu có ghi ngày sinh", !!(DATA.meta&&DATA.meta.anchor)&&!!tshAnchor());
 t("ngưỡng tự kéo lấy từ cấu hình", cfHasRow("demoAutoShift_days"));
 /* DỊCH THEO BỘI SỐ 7 - giữ nguyên thứ trong tuần, nếu không lớp khai "T2-T4-T6" mà buổi rơi T3 */
 t("luôn dịch theo bội số 7 ngày", tshDays()%7===0);
 (function(){var a=DATA.meta.anchor;
  DATA.meta.anchor="01/01/2020 08:00";
  var d=tshDays();
  t("dữ liệu cũ vài năm vẫn ra bội số 7", d%7===0&&d>0);
  DATA.meta.anchor=a})();
 /* KHÔNG được đụng vào ngày tháng nằm trong CÂU GHI CHÚ - đó là vết lịch sử của người dùng */
 t("không dịch ngày nằm lẫn trong câu", tshOne("Đổi GV: A -> B (Admin, 12/07/2026 09:00)",7)===null);
 t("có dịch ô toàn bộ là một mốc", tshOne("12/07/2026 09:00",7)==="19/07/2026 09:00");
 t("giữ nguyên dạng chỉ-có-ngày", tshOne("12/07/2026",7)==="19/07/2026");
 t("bỏ qua ô không phải ngày", tshOne("Phòng 202 - Cơ sở 1",7)===null&&tshOne("",7)===null);
 /* ĐI RỒI VỀ phải khớp y nguyên - và mốc neo phải dời theo, không thì lần sau dịch chồng lên */
 (function(){
  function snap(){return rows("DL11").map(function(x){return x.session_date}).join("|")}
  var a0=DATA.meta.anchor,s0=snap();
  var notes=rows("DL11").filter(function(x){return /\d{2}\/\d{2}\/\d{4}/.test(String(x.notes||""))})[0];
  var n0=notes?String(notes.notes):"";
  tshApply(-91);
  t("dịch lùi thì mốc neo dời theo", DATA.meta.anchor!==a0);
  t("dịch lùi thì dữ liệu đổi thật", snap()!==s0);
  t("ghi chú KHÔNG bị dịch", !notes||String(notes.notes)===n0);
  var d=tshDays();
  t("app nhận ra dữ liệu đã cũ 91 ngày", d===91);
  tshApply(d);
  t("đi rồi về khớp y nguyên", snap()===s0);
  t("mốc neo cũng về chỗ cũ", DATA.meta.anchor===a0)})();
 /* THỨ TRONG TUẦN phải giữ nguyên sau khi dịch - kiểm trên lớp có khai lịch theo thứ */
 (function(){
  var c=rows("DL10").filter(function(x){return /T[2-7]|CN/.test(String(x.class_schedule||""))})[0];
  if(!c){t("có lớp khai lịch theo thứ để kiểm", false);return}
  function dows(){return rows("DL11").filter(function(x){return x.class_id===c.class_id})
   .map(function(x){var d=pvnd(x.session_date);return d?d.getDay():-1}).join(",")}
  var before=dows();
  tshApply(35);var after=dows();tshApply(-35);
  t("dịch xong thứ trong tuần không đổi", before===after)})();
 /* KHÔNG tự đụng vào dữ liệu THẬT khi chạy trên Google Sheets */
 (function(){var was=global.SVR;global.SVR=true;
  var r=tshAuto();global.SVR=was;
  t("bản chạy trên Sheets không tự dịch dữ liệu thật", r===0)})();
 /* Reset demo phải NÓI RÕ nó sẽ kéo bao nhiêu ngày, không lặng lẽ đổi dữ liệu sau lưng */
 t("Reset demo nói rõ sẽ kéo thời gian", /KÉO dữ liệu/.test(SRC0));
 /* HAI CỔNG PHẢI KÉO GIỐNG NHAU - bỏ sót một cổng thì mở cạnh nhau hiện hai bộ ngày khác nhau */
 (function(){var HV=fs.readFileSync('./_HV.js','utf8');
  t("cổng học viên cũng tự kéo thời gian", /tshAuto\(\)/.test(HV));
  t("hai cổng dùng chung một bộ dịch (không có bản sao)",
    (HV.match(/function\s+tshApply\s*\(/g)||[]).length<=1)})();
 /* tab Dữ liệu demo phải có nút kéo tay + bảng thông tin */
 (function(){window.SETTAB="demo";var o=RENDER.settings();window.SETTAB="ch2";
  t("tab Dữ liệu demo có nút kéo về hôm nay", /tshNow\(\)/.test(o));
  t("tab Dữ liệu demo nói rõ dữ liệu sinh ngày nào", /Dữ liệu sinh ngày/.test(o))})();
})();


/* ---------- 17. HAI CỔNG PHẢI NÓI CÙNG MỘT CON SỐ (N3) ----------
   "Đồng bộ các cổng" không phải là nói suông: lấy CÙNG một học viên, đọc số ở cổng nhân viên và
   số in ra ở cổng học viên, rồi bắt chúng khớp. Đây là kiểu lỗi khó tin nhất khi đang demo trước
   mặt khách - hai màn hình cạnh nhau nói hai con số. */
(function(){
 var vm=require('vm');
 var sb={console:console,require:require,Math:Math,JSON:JSON,Date:Date,RegExp:RegExp,
  parseInt:parseInt,parseFloat:parseFloat,isNaN:isNaN,String:String,Number:Number,Object:Object,
  Array:Array,setTimeout:function(){},clearTimeout:function(){}};
 sb.window=sb;sb.document=global.document;sb.location={hash:"",search:"",pathname:"/cong-hoc-vien/"};
 sb.history={replaceState:function(){}};sb.localStorage=global.localStorage;sb.sessionStorage=global.sessionStorage;
 vm.createContext(sb);
 try{vm.runInContext(fs.readFileSync('./_HV.js','utf8'),sb)}catch(e){t("nạp được cổng học viên để đối chiếu",false);return}
 t("nạp được cổng học viên để đối chiếu", typeof sb.renderTrangHV==="function");
 var lech=[],n=0;
 rows("DL09").slice(0,60).forEach(function(s){
  var sid=s.student_id;
  var nv=stuAttStats(sid);
  sb.window.HVID=sid;
  var h="";try{h=sb.renderTrangHV()}catch(e){lech.push(sid+" vỡ: "+e.message);return}
  n++;
  var m=h.match(/Chuyên cần<\/span>[\s\S]{0,140}?(\d+)% \((\d+)\/(\d+) buổi\)/);
  if(m){
   if(nv.rate!=null&&+m[1]!==nv.rate)lech.push(sid+" chuyên cần "+nv.rate+"% vs "+m[1]+"%");
   if(+m[2]!==nv.pres||+m[3]!==nv.n)lech.push(sid+" số buổi "+nv.pres+"/"+nv.n+" vs "+m[2]+"/"+m[3])}
  var mn=h.match(/Còn phải đóng<\/span><b[^>]*>([\d.]+)đ/);
  if(mn){
   var noHV=+mn[1].replace(/\./g,"");
   var ds=rows("DL06").filter(function(e){return e.student_id===sid&&!isc(e.enrollment_status,"cancelled")})
    .map(function(e){return num(e.remaining_amount)});
   if(!ds.some(function(v){return Math.abs(v-noHV)<=1}))lech.push(sid+" công nợ cổng HV "+noHV+" không khớp đơn nào ("+ds.join("/")+")")}});
 t("đối chiếu được ít nhất 40 hồ sơ (đang "+n+")", n>=40);
 t("hai cổng nói cùng một con số"+(lech.length?(" - "+lech.slice(0,3).join(" | ")):""), lech.length===0);
})();

/* ---------- 18. GHÉP ĐÚNG CẶP KHÓA - LỚP - TIỀN ----------
   Học viên học 2 khóa mà màn hình ghép "khóa của đơn A" với "lớp của đơn B" là khai một cặp
   KHÔNG CÓ THẬT. Đã bắt được tại HV060 (ô Khóa ghi 6.5, ô Lớp ghi 7.0+). */
(function(){
 t("có hàm ghép cặp dùng chung", typeof stuKhoaLop==="function"&&typeof stuNoTong==="function");
 var sai=[];
 rows("DL09").forEach(function(s){
  stuKhoaLop(s.student_id).forEach(function(x){
   if(!x.cid||!x.enr||!x.enr.course_id)return;
   var c=find("DL10","class_id",x.cid);
   if(c&&String(c.course_id||"")!==String(x.enr.course_id||""))
    sai.push(s.student_id+": đơn "+x.enr.course_id+" ghép lớp khóa "+c.course_id)})});
 t("không ghép khóa của đơn này với lớp của đơn kia"+(sai.length?(" - "+sai.slice(0,3).join(" | ")):""), sai.length===0);
 /* công nợ ở drawer phải là TỔNG các đơn, không phải đơn đầu tiên */
 (function(){
  var cnt={};rows("DL06").forEach(function(e){if(isc(e.enrollment_status,"cancelled")||!e.student_id)return;
   cnt[e.student_id]=(cnt[e.student_id]||0)+1});
  var multi=Object.keys(cnt).filter(function(k){return cnt[k]>1});
  t("có học viên học nhiều khóa để kiểm", multi.length>0);
  if(!multi.length)return;
  var sid=multi.filter(function(k){return stuNoTong(k)>0})[0]||multi[0];
  var seen="";var od=global.openDrawer;global.openDrawer=function(a,b){seen=b};
  try{openStuQuick(sid)}catch(e){}
  global.openDrawer=od;
  t("drawer xem nhanh có nói công nợ", /Công nợ/.test(seen));
  t("drawer liệt kê đủ số đơn", seen.indexOf(stuKhoaLop(sid).length+" đơn")>=0||stuKhoaLop(sid).length<=1);
  var tong=stuNoTong(sid);
  t("công nợ ở drawer là TỔNG các đơn", tong===0||seen.indexOf(vnd(tong))>=0)})();
})();


/* ---------- 19. TÌM KIẾM + XUẤT DỮ LIỆU CHO MỌI TRANG TÁC VỤ (N4) ---------- */
(function(){
 setRole("all");window.PGQ={};
 t("có ô tìm và nút xuất dùng chung", typeof pgqSet==="function"&&typeof pgExport==="function"&&typeof csvOf==="function");
 /* TÌM PHẢI LỌC THẬT - hiện ô tìm mà gõ vào không đổi gì là tệ hơn không có ô tìm */
 (function(){
  var pg="wow";
  var a=(RENDER[pg]().match(/class="obcard"/g)||[]).length;
  window.PGQ[pg]="nguyen";
  var b=(RENDER[pg]().match(/class="obcard"/g)||[]).length;
  window.PGQ[pg]="zzzkhongcogitrongdulieu";
  var c0=RENDER[pg]();
  window.PGQ={};
  t("gõ từ khoá thì danh sách hẹp lại thật", a>0&&b>0&&b<a);
  t("từ khoá vô nghĩa thì rỗng và có báo rỗng", (c0.match(/class="obcard"/g)||[]).length===0&&/class="empty"/.test(c0))})();
 /* tìm phải BỎ DẤU - gõ "nguyen" phải ra "Nguyễn", nếu không thì ô tìm vô dụng với tiếng Việt */
 (function(){
  window.PGQ={hocvien:"nguyen"};
  var n1=fltApply("hocvien",rows("DL09")).length;
  window.PGQ={hocvien:"Nguyễn"};
  var n2=fltApply("hocvien",rows("DL09")).length;
  window.PGQ={};
  t("tìm bỏ dấu tiếng Việt (gõ 'nguyen' ra 'Nguyễn')", n1>0&&n1===n2)})();
 /* XUẤT phải xuất ĐÚNG những dòng đang hiện - xuất cả bảng trong khi màn hình đang lọc là đưa
    cho người ta một tệp không giống thứ họ đang nhìn */
 (function(){
  RENDER.wow();var het=(window.FLTLAST.wow||[]).length;
  window.PGQ={wow:"nguyen"};RENDER.wow();var loc=(window.FLTLAST.wow||[]).length;
  window.PGQ={};
  t("xuất theo đúng thứ đang hiện trên màn hình", het>0&&loc>0&&loc<het)})();
 /* CSV phải đúng định dạng: có đủ cột, có bọc dấu nháy khi ô chứa dấu phẩy */
 t("CSV có dòng tiêu đề cột", (csvOf([{a:"1",b:"2"}])||"").split("\n")[0]==="a,b");
 t("CSV bọc ô có dấu phẩy", csvOf([{a:"x,y"}]).indexOf('"x,y"')>=0);
 t("CSV nhân đôi dấu nháy trong ô", csvOf([{a:'he said "hi"'}]).indexOf('""hi""')>=0);
 t("CSV rỗng thì trả rỗng, không vỡ", csvOf([])==="");
 t("xuất kèm BOM cho Excel bản Việt không vỡ dấu", /\\ufeff/.test(SRC0)||SRC0.indexOf("\\ufeff")>=0);
 /* PHỦ: các trang tác vụ chính đều phải có cả ô tìm lẫn nút xuất */
 (function(){
  var CAN=["test","tuvan","thanhtoan","wow","buoihoc","khieunai","ketthuc","baoluu","review","ghinhan","giaoviec","hocvien","nhaplead"];
  var thieuTim=[],thieuXuat=[];
  CAN.forEach(function(k){var o="";try{o=(PBK[k]&&PBK[k].ty==="list")?renderList(k):RENDER[k]()}catch(e){return}
   if(!/class="pgq"/.test(o)&&!/class="srch"/.test(o))thieuTim.push(k);
   if(!/pgExport\(/.test(o)&&!/class="srch"/.test(o))thieuXuat.push(k)});
  t("trang tác vụ chính đều tìm được"+(thieuTim.length?(" - thiếu: "+thieuTim.join(", ")):""), thieuTim.length===0);
  t("trang tác vụ chính đều xuất được"+(thieuXuat.length?(" - thiếu: "+thieuXuat.join(", ")):""), thieuXuat.length===0)})();
 /* các hàng chờ quyết định + màn xếp lịch cũng phải xuất được (kế toán hay xin file) */
 (function(){
  var thieu=[];
  [["duyet","DUYTAB","duyetthu"],["duyet","DUYTAB","duyetgiao"],["dsthanhtoan","STTAB","du"],
   ["dsthanhtoan","STTAB","cong"],["hoctap","HTTAB","gvdp"],["hoctap","HTTAB","phong"]].forEach(function(x){
   window[x[1]]=x[2];var o="";try{o=RENDER[x[0]]()}catch(e){}
   if(!/pgExport\(/.test(o))thieu.push(x[0]+"#"+x[2]);window[x[1]]=undefined});
  t("hàng chờ quyết định và màn xếp lịch cũng xuất được"+(thieu.length?(" - thiếu: "+thieu.join(", ")):""), thieu.length===0)})();
 window.PGQ={};
})();

/* ============ 20. NHAT KY THAO TAC + HOAN TAC (V9.31) ============
   Nhat ky la thu de QUY TRACH NHIEM, nen ban than no phai duoc kiem bang may: mot so kiem
   "co ham logAct khong" thi luon xanh ma khong chung minh duoc gi. O day lam THAT: bam mot
   cua ghi roi doi nhat ky phai co dong dung; lui lai roi doi du lieu phai ve nhu cu; va
   QUAN TRONG NHAT - phai chung minh chot chan tu choi lui DUOC (mot chot chan luon dong y
   thi khong phai chot chan). */
(function(){
 setRole("all");CURSTAFF=(rows("DL01")[0]||{}).staff_id||"";
 t("app co bang nhat ky DL25", Array.isArray(logRows()));
 t("moi cua ghi da khai deu duoc boc de tu ghi nhat ky", (function(){
  logArm();
  var ho=Object.keys(DOORTB||{}).filter(function(f){return typeof global[f]==="function"&&!global[f].__log});
  if(ho.length)bad.push("  cua ghi chua boc: "+ho.slice(0,5).join(", "));
  return ho.length===0})());
 /* --- ve trang thi KHONG duoc sinh dong nhat ky nao (doc khong phai ghi) --- */
 t("chi VE trang thi khong ghi nhat ky", (function(){
  var n0=logRows().length;
  ["banlam","hocvien","test","thanhtoan"].forEach(function(k){try{RENDER[k]()}catch(e){}});
  return logRows().length===n0})());
 /* --- cua ghi di qua ham ghi chung --- */
 var tb=rows("DL03").filter(function(x){return ecode(x.booking_status)!=="booked"})[0];
 t("co phieu test de thu cua ghi", !!tb);
 if(tb){
  var n0=logRows().length,truoc=tb.booking_status;
  testBook(tb.test_booking_id);
  var e=logRows()[0];
  t("bam mot cua ghi -> nhat ky co them dong", logRows().length>n0);
  t("dong nhat ky ghi du AI - LUC NAO - BANG - DONG",
    !!(e&&e.staff_name&&/\d{2}\/\d{2}\/\d{4}/.test(e.log_time)&&e.sheet==="DL03"&&e.row_id===tb.test_booking_id));
  t("dong nhat ky ghi ro doi TU GI SANG GI", (function(){
    var d=JSON.parse((e&&e.detail)||"{}");
    return !!(d.booking_status&&d.booking_status.tu===truoc&&/booked/.test(d.booking_status.den))})());
  t("dong nhat ky nho CUA GHI nao gay ra", !!(e&&e.door==="testBook"));
  t("tom tat dung TEN O TIENG VIET, khong phai ten ky thuat",
    !!(e&&e.summary&&e.summary.indexOf("booking_status")<0&&/[À-ỹ]/.test(e.summary)));
  /* --- hoan tac --- */
  var b=e&&e.batch;
  t("lo vua lam thi hoan tac duoc", !!b&&logCanUndo(b)==="");
  logUndo(b);
  t("hoan tac tra du lieu ve DUNG nhu truoc", tb.booking_status===truoc);
  t("hoan tac roi thi khong lui lan hai", logCanUndo(b)!=="");
  t("nhat ky co ghi lai chinh viec hoan tac", logRows().some(function(x){return x.kind==="undo"}));
 }
 /* --- CHOT CHAN: dong da bi nguoi khac sua sau do thi TU CHOI lui --- */
 t("tu choi lui khi sau do dong do da bi sua tiep", (function(){
  var t2=rows("DL03").filter(function(x){return ecode(x.booking_status)!=="booked"})[0];
  if(!t2)return false;
  testBook(t2.test_booking_id);
  var bOld=logRows()[0].batch;
  if(logCanUndo(bOld)!=="")return false;               /* luc nay phai lui duoc */
  markRow("DL03","test_booking_id",t2.test_booking_id,
   {booking_status:eFull("enum_booking_status","cancelled")},"thu");
  return logCanUndo(bOld)!=="" })());                  /* sau khi bi sua tiep thi phai TU CHOI */
 /* --- cua ghi mutate THANG object (khong qua ham ghi chung) cung phai duoc ghi --- */
 t("cua ghi ghi thang vao object cung vao nhat ky", (function(){
  var ids={};rows("DL11").forEach(function(x){if(x.teacher_id)ids[x.teacher_id]=1});
  var gvs=Object.keys(ids),cand=rows("DL11").filter(function(x){return x.teacher_id});
  for(var s0=0;s0<cand.length;s0++)for(var i=0;i<gvs.length;i++){
   if(gvs[i]===cand[s0].teacher_id)continue;
   var n1=logRows().length,cu=cand[s0].teacher_id;
   sesSetTeacher(cand[s0].session_id,gvs[i],"bo kiem");
   if(cand[s0].teacher_id!==gvs[i])continue;
   var e2=logRows()[0],okk=(logRows().length>n1&&e2.sheet==="DL11"&&e2.door==="sesSetTeacher");
   logUndo(e2.batch);
   return okk&&cand[s0].teacher_id===cu;               /* lui xong phai ve dung GV cu */
  }
  return false})());
 /* --- tham so hai chieu: doi so dong giu lai thi app phai di theo --- */
 t("so dong nhat ky giu lai doc tu CH2 (doi tham so thi app di theo)", (function(){
  var c=(DATA.config&&DATA.config.ch2)||[],r=null;
  for(var i=0;i<c.length;i++)if(c[i].name==="auditLogKeep_rows")r=c[i];
  if(!r)return false;
  var cu=r.value;r.value="3";
  var okk=(logMax()===3);
  for(var j=0;j<8;j++)logAct("Thu","DL03","X"+j,{},"dong thu "+j);
  okk=okk&&(logRows().length<=3);
  r.value=cu;return okk})());
 /* --- man tra nhat ky --- */
 (function(){window.SETTAB="nhatky";var o="";try{o=RENDER.settings()}catch(e){o=""}
  window.SETTAB="ch2";
  t("man Nhat ky thao tac ve duoc", o.length>400);
  t("man Nhat ky co o tim", /class="pgq"/.test(o));
  t("man Nhat ky xuat duoc CSV", /pgExport\('nhatky'\)/.test(o));
  t("man Nhat ky loc duoc theo bang va theo nguoi", /nkSet\('NKTB'/.test(o)&&/nkSet\('NKWHO'/.test(o));
  t("man Nhat ky noi thang gioi han giu bao nhieu dong", o.indexOf("dòng gần nhất")>=0);
  t("man Nhat ky goi ten bang bang tieng Viet", o.indexOf("Test đầu vào")>=0||o.indexOf("Buổi học")>=0)})();
 /* ============ 24. MOI BANG DANH SACH PHAI DU BA THU (V9.36) ============
    Anh Luan chup trang So khieu nai: "a nho em co lam drawer roi ma sao may trang nay chua co,
    cho viec can lam cung chua tro toi cau hinh (banh rang). Thao tac khieu nai cho nay ko chuan
    roi. Chac may trang khac cung chua co nut ho tro nghiep vu dung roi a."
    Do ra dung the va rong hon mot trang: 22/29 bang khong bam ten ra duoc ngan keo, 29/29 thieu
    banh rang o cot Viec can lam, va nhieu bang chi co nut "Ho so" chu khong phai thao tac dung.
    Goc: tableHTML noi ngan keo bang cach LIET KE TEN TRANG - dung 6 trang duoc noi tay.
    Ba tieu chi duoi day soi TOAN BO bang, khong soi mau. */
 (function(){
  setRole("all");applyScope("");CURSTAFF="";
  var kDrawer=[],kGear=[],kPk=[];
  Object.keys(LISTCFG).forEach(function(k){
   var c=LISTCFG[k],o="";
   try{o=renderList(k)}catch(e){kDrawer.push(k+" (nem loi)");return}
   /* (1) bang nao co cot NGUOI/LOP/KHOA thi phai bam ra duoc ngan keo */
   var coCotNguoi=(c.cols||[]).some(function(x){
    return (x[0]==="full_name"&&FULLNAMEOF[c.code])||(CELLLNK[x[0]]&&x[2]!=="chip"&&x[2]!=="enum"&&x[2]!=="money")});
   if(coCotNguoi&&!/class="lnk"/.test(o))kDrawer.push(k);
   /* (2) bang nao co cot "Viec can lam" thi cau nhac phai co BANH RANG tro ve CH4 */
   var coNa=(c.cols||[]).some(function(x){return x[2]==="na"});
   if(coNa&&!/cfedit/.test(o))kGear.push(k);
   /* (3) cot dau la MA DONG - phai duy nhat. Khai nham NGAY hoac TEN lam ma dong thi nut thao tac
      tro vao mot chuoi khong phai khoa, ma khong ai bao loi. */
   var pk=c.cols[0][0],R=rows(c.code),seen={},lech=0;
   R.forEach(function(r){var v=String(r[pk]==null?"":r[pk]);if(!v||seen[v])lech++;seen[v]=1});
   if(R.length&&lech)kPk.push(k+"("+pk+")")});
  t("moi bang co cot nguoi/lop/khoa deu bam ra ngan keo"+(kDrawer.length?(" - thieu: "+kDrawer.slice(0,5).join(", ")):""), kDrawer.length===0);
  t("moi cot 'Viec can lam' deu co banh rang ve CH4"+(kGear.length?(" - thieu: "+kGear.slice(0,5).join(", ")):""), kGear.length===0);
  t("cot dau cua moi bang la MA DONG duy nhat"+(kPk.length?(" - sai: "+kPk.slice(0,5).join(", ")):""), kPk.length===0);
  /* (4) dong nao dang co viec trong hang cho thi PHAI co nut lam ngay dung nghiep vu */
  t("dong dang co viec thi hien nut lam ngay dung nghiep vu", (function(){
    var m=rowActMap();
    var k=Object.keys(LISTCFG).filter(function(kk){
     var c=LISTCFG[kk],pk=c.cols[0][0];
     return rows(c.code).some(function(r){return m[String(r[pk])]})})[0];
    if(!k)return false;
    var c=LISTCFG[k],pk=c.cols[0][0];
    var r=rows(c.code).filter(function(x){return m[String(x[pk])]})[0];
    var b=rowSlaBtn(r,pk);
    return /slaAct\(/.test(b)&&b.indexOf(m[String(r[pk])].act)>=0})());
  t("nut lam ngay KHONG hien o dong khong co viec", (function(){
    var m=rowActMap();
    var c=LISTCFG.hocvien,pk=c.cols[0][0];
    var r=rows(c.code).filter(function(x){return !m[String(x[pk])]})[0];
    return !r||rowSlaBtn(r,pk)===""})());
 })();
 /* ============ 23. TRO THU NHAP VAO GUIDE + CAU HINH DUOC (V9.34) ============
    Anh Luan: "tro thu chua du dang cap... phai bao nguoi ta lam tung buoc luon de don sach se van
    de dang cho ho lam" va "cach lam cua guide rat hop de lam tro thu".
    Cai phai chung minh bang may, khong phai bang loi:
     (1) buoc SINH TU HANG CHO that, khong phai viet san;
     (2) mot buoc coi la xong khi viec BIEN MAT khoi hang cho - lam that mot viec phai thay doi;
     (3) cau hinh la CAU HINH THAT: doi thu tu / doi so viec moi luot / tat di -> app di theo. */
 (function(){
  setRole("all");applyScope("");CURSTAFF="";
  var C=tthCfg();
  t("co tang thu tu 'Don viec hom nay' trong guide",
    TOURLV.some(function(v){return v[0]==="donviec"&&v[1]==="Dọn việc hôm nay"}));
  var T=tourWorkBuild();
  t("dung duoc bai don viec tu hang cho that", !!T&&T.steps.length>0);
  t("bai don viec la bai SONG (live), khong phai bai viet san", !!(T&&T.live));
  t("so buoc dung bang so viec moi luot da cau hinh",
    !!T&&T.steps.length===Math.min(C.batch,workAll().length));
  t("moi buoc deu gan voi MOT viec that", !!T&&T.steps.every(function(st){return !!(st.item&&st.item.cat)}));
  t("moi buoc deu co nut thao tac", !!T&&T.steps.every(function(st){return !!st.do}));
  t("moi phep kiem cua bai don viec deu chay duoc", (function(){
    if(!T)return false;
    try{T.steps.forEach(function(st){st.chk()});return true}catch(e){return false}})());
  t("viec dang trong hang cho thi phep kiem phai bao CHUA XONG",
    !!T&&T.steps.every(function(st){return st.chk()===false}));
  /* (2) LAM THAT mot viec -> phep kiem phai doi. Day la cho de viet mot bo kiem gia nhat:
     chi kiem "co ham chk" thi luon xanh ma khong chung minh duoc gi. */
  t("lam that mot viec thi buoc do doi sang XONG", (function(){
    var L=workAll(),x=L.filter(function(y){return y.act==="testconsult"})[0];
    if(!x)return false;
    var key=slaKey(x);
    var st={item:x,chk:function(){return !workAll().some(function(y){return slaKey(y)===key})}};
    if(st.chk()!==false)return false;         /* truoc khi lam: phai la CHUA */
    slaAct(x.act,x.rid);
    return st.chk()===true})());               /* sau khi lam: phai la XONG */
  /* (3) cau hinh hai chieu */
  t("doi THU TU nhom viec thi viec dau tien doi theo", (function(){
    var cu=C.order.slice(),ov=C.overdueFirst;
    C.overdueFirst=0;
    var cats=[];workAll().forEach(function(x){if(cats.indexOf(x.cat)<0)cats.push(x.cat)});
    if(cats.length<2){C.order=cu;C.overdueFirst=ov;return false}
    C.order=[cats[1],cats[0]].concat(cats.slice(2));
    var a1=(workAll()[0]||{}).cat;
    C.order=[cats[0],cats[1]].concat(cats.slice(2));
    var a2=(workAll()[0]||{}).cat;
    C.order=cu;C.overdueFirst=ov;
    return a1!==a2})());
  t("doi SO VIEC MOI LUOT thi so buoc doi theo", (function(){
    var cu=C.batch;C.batch=2;var n2=(tourWorkBuild()||{steps:[]}).steps.length;
    C.batch=4;var n4=(tourWorkBuild()||{steps:[]}).steps.length;C.batch=cu;
    return n2===2&&n4===4})());
  t("bat 'viec qua han len dau' thi viec dau tien PHAI la viec qua han", (function(){
    var cu=C.overdueFirst;C.overdueFirst=1;
    var L=workAll();var co=L.some(function(x){return x.sev==="red"});
    var ok=!co||(L[0]&&L[0].sev==="red");
    C.overdueFirst=cu;return ok})());
  /* V9.35: tro thu khong con la KHOI TRONG THAN TRANG nua - no o NUT GOC duoi ben phai.
     Nen tieu chi doi theo: than trang phai SACH, va nut goc phai hien dung so viec. */
  t("V9.35 tro thu KHONG con chen vao than trang", (function(){
    var o="";try{o=RENDER.banlam()}catch(e){}
    return o.indexOf('class="tth"')<0&&o.indexOf('class="nhip"')<0})());
  t("V9.35 tam tro thu goc ve duoc va co du 3 phan (viec ke tiep + nhip ngay + don tung buoc)", (function(){
    var h=asstHTML();
    return h.indexOf("Việc kế tiếp")>=0&&h.indexOf("asstChip")>=0&&h.indexOf("Dọn từng bước")>=0})());
  t("V9.35 nut goc hien dung so viec dang cho", (function(){
    var n=workAll().length;
    return typeof asstPaint==="function"&&asstHTML().indexOf(String(n))>=0&&n>0})());
  t("V9.35 tro thu goi TEN nguoi, khong goi chuc danh", (function(){
    var cu=CURSTAFF;var st=rows("DL01")[0];CURSTAFF=st.staff_id;
    var h=asstHTML();CURSTAFF=cu;
    var ten=String(st.full_name).trim().split(/\s+/).slice(-1)[0];
    return h.indexOf("Chào bu")>=0&&h.indexOf(ten)>=0})());
  t("man cau hinh Tro thu & Nhip ngay ve duoc", (function(){
    window.SETTAB="tro";var o="";try{o=RENDER.settings()}catch(e){o=""}window.SETTAB="ch2";
    return o.length>800&&o.indexOf("Mỗi lượt dọn bao nhiêu việc")>=0&&o.indexOf("Nhịp ngày theo chức danh")>=0})());
  /* (4) nhip ngay: lop phu cau hinh phai an vao ket qua that */
  t("tat mot dong nhip ngay thi dong do bien mat", (function(){
    CURSTAFF="";var k=nhipKey();if(!k)return false;
    var n0=nhipList().length;if(!n0)return false;
    nhipSet(k,0,"on",0);var n1=nhipList().length;nhipSet(k,0,"on",1);
    return n1===n0-1})());
  t("sua chu trong nhip ngay thi man hinh hien chu moi", (function(){
    var k=nhipKey();if(!k)return false;
    nhipSet(k,0,"t","VIEC KIEM THU 12345");
    var co=nhipList().some(function(x){return x.t==="VIEC KIEM THU 12345"});
    delete nhipCfg()[nhipId(k,0)];
    return co})());
  t("them dong rieng cua trung tam thi no la THOI QUEN, khong bao gio bao 'sach'", (function(){
    var k=nhipKey();if(!k)return false;
    nhipAdd(k);
    var L=nhipList(),x=L.filter(function(y){return y.tu})[0];
    nhipDel(k,0);
    return !!x&&x.hab===true})());
 })();
 /* ============ 22. MOI VIEC TRONG HANG CHO DEU PHAI BAM DUOC (V9.33) ============
    Anh Luan: "a bam vao lam ngay con chua duoc". Do ra: 44/163 viec co ma thao tac ma slaAct KHONG
    biet ma do, nen bam xong khong lam gi VA khong bao gi. Cong them 3 viec khong co nut nao.
    Im lang la thu lam nguoi dung tuong app hong - te hon la bao loi. */
 (function(){
  setRole("all");applyScope("");CURSTAFF="";
  var L=[];try{L=slaItems()}catch(e){}
  t("hang cho sinh ra duoc viec de kiem", L.length>0);
  var khong=L.filter(function(x){return !slaBtn(x)});
  t("MOI viec trong hang cho deu co nut bam"+(khong.length?(" - thieu "+khong.length):""), khong.length===0);
  /* Ma thao tac nao cung phai duoc slaAct nhan - khong duoc roi xuong dat */
  var SRCA=SRC0.slice(SRC0.indexOf("function slaAct("));SRCA=SRCA.slice(0,SRCA.indexOf("\nfunction ",10));
  var la=[];
  L.forEach(function(x){if(!x.act)return;
   if(SRCA.indexOf('"'+x.act+'"')>=0)return;
   if(typeof global[x.act]==="function")return;
   if(la.indexOf(x.act)<0)la.push(x.act)});
  t("moi ma thao tac deu duoc slaAct nhan"+(la.length?(" - la: "+la.join(", ")):""), la.length===0);
  t("ma la thi slaAct PHAI keu len, khong duoc im lang", /chưa được nối - báo IT/.test(SRC0));
  t("ten tham so khong bao gio roi vao o ma thao tac",
    L.filter(function(x){return x.act&&/_days$|_hours$|_min$/.test(x.act)}).length===0);
 })();
 /* ============ 21. BAM MUC MENU PHAI RA DUNG MAN DO (V9.33) ============
    Anh Luan: "bam vo may trang cho duyet no do het". That ra khong do - 6 muc trong nhom Cho duyet
    bam vao deu ra CUNG MOT tab, nen nhin nhu trang khong phan ung.
    Vi sao bo kiem cu khong thay: no VE tung tab bang cach TU DAT window.DUYTAB roi goi RENDER -
    tuc la di duong tat, khong bao gio di qua go(). Ma loi nam dung o duong go() + pham vi chuc danh.
    LUAT MOI: moi muc menu phai duoc mo BANG go() nhu nguoi dung bam, roi doi chieu man hinh nhan
    duoc co dung la man cua muc do khong. */
 (function(){
  setRole("all");applyScope("");CURSTAFF="";
  var HUBS={tuyensinh:"TSTAB",hoctap:"HTTAB",cskh:"CSTAB",khac:"KTAB",duyet:"DUYTAB"};
  var lech=[],dem=0;
  NAVTREE.forEach(function(g){(g.items||[]).forEach(function(k){
   if(!PBK[k])return;
   var truoc={};for(var v in HUBS)truoc[HUBS[v]]=window[HUBS[v]];
   try{go(k)}catch(e){lech.push(k+" nem loi: "+e.message);return}
   dem++;
   var hub=null;for(var h in HUBS)if(CUR===h)hub=h;
   if(!hub)return;                        /* trang doc lap: go() dua dung trang la du */
   if(k===hub)return;                     /* bam chinh cai hub: ra tab mac dinh cua no la dung */
   var sub=hubSubKey(hub);
   if(sub!==k)lech.push(k+" -> "+hub+"#"+sub+" (le)")})});
  /* Tab mac dinh phai khop giua ban khai va ham ve - lech la sidebar sang mot dang, man hinh mot dang */
  var dmis=[];
  Object.keys(HUBTAB).forEach(function(h){
   var H=HUBTAB[h];window[H.v]=undefined;
   var o="";try{o=RENDER[h]()}catch(e){dmis.push(h+" nem loi");return}
   if(window[H.v]&&window[H.v]!==H.d)dmis.push(h+": ban khai '"+H.d+"' nhung ve ra '"+window[H.v]+"'");
   window[H.v]=undefined});
  t("tab mac dinh cua moi hub khai o MOT noi va khop voi ham ve"+(dmis.length?(" - "+dmis.join("; ")):""), dmis.length===0);
  t("bam tung muc menu deu ra DUNG man cua muc do ("+dem+" muc)"+(lech.length?(" - lech: "+lech.slice(0,4).join(", ")):""), lech.length===0);
  /* Quan tri vien TOAN QUYEN thi khong duoc bi chan tab o bat ky hub nao */
  applyScope("");
  var rs=SCOPE();
  t("quan tri vien toan quyen khong bi chan tab o hub nao", rs.pages==="*"&&!rs.tabs);
  t("hub Cho duyet ve du 6 tab cho quan tri vien", (function(){
   window.DUYTAB="duyetck";var o=RENDER.duyet();
   var n=(o.match(/duyTabSet\('/g)||[]).length;
   return n>=6+5})());                    /* 6 tab + 5 o so bam duoc */
 })();
 /* --- NHO TAM BANG TRA: phai vua NHO that, vua VUT dung luc --- */
 (function(){
  var a1=jIndex(),a2=jIndex();
  t("bang tra jIndex co nho tam (goi hai lan tra ve cung mot ban)", a1===a2);
  var C1=jCtx(Object.keys(a1.lead)[0]),C2=jCtx(Object.keys(a1.lead)[0]);
  t("ngu canh jCtx cung nho tam theo bang tra", C1===C2);
  /* them mot dong that roi doi bang tra phai THAY dong do - neu khong, nho tam dang noi doi */
  var lid="LEAD-KIEM-NHOTAM";
  rows("DL02").push({lead_id:lid,full_name:"Kiem nho tam",lead_status:eFull("enum_lead_status","new")});
  dataChanged();
  var a3=jIndex();
  t("dua du lieu moi vao thi bang tra duoc dung lai", a3!==a1&&!!a3.lead[lid]);
  t("bang tra cu KHONG con duoc dung sau khi du lieu doi", !a1.lead[lid]);
  rows("DL02").pop();dataChanged();
  t("ghi qua nhat ky cung vut bang tra", (function(){
    var b1=jIndex();
    logAct("Thu","DL02","X",{a:{tu:"1",den:"2"}},"thu vut bang nho");
    return jIndex()!==b1})());
 })();
 t("ho so 360 co khoi 'Ai da sua ho so nay'", (function(){
   var L0=rows("DL02")[0];if(!L0)return false;
   window.JPID=L0.lead_id;var o="";try{o=RENDER.hoso()}catch(e){o=""}
   window.JPID="";
   return o.indexOf("Ai đã sửa hồ sơ này")>=0&&/SETTAB=\\?'nhatky/.test(o)})());
 t("khoi 'ai da sua dong nay' dung duoc cho bat ky bang nao",
   typeof logRowHTML==="function"&&logRowHTML("DL03","KHONG-CO").indexOf("Chưa có thao tác")>=0);
})();

console.log(bad.length?("CHECK18 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK18 OK: "+ok+" tieu chi | da ve "+VIEWS.length+" trang/tab");
