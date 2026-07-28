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
 settings:["SETTAB",["brand","menu","phanquyen","ch2","ch6","ch4","ch1","khoa","staff","health","demo"]],
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
 t("có trợ thủ + công tắc trên thanh tiêu đề", typeof tthHTML==="function"&&typeof tthToggle==="function"&&/id="tthBtn"/.test(fs.readFileSync(OUT+'/ITTs_WebApp_v5_demo.html','utf8')));
 t("mặc định BẬT", tthOn()===true);
 /* LUẬT CỨNG: trợ thủ ĐỌC slaItems, KHÔNG khai lại việc lần thứ hai */
 var SRCn=SRC0.replace(/\/\*[\s\S]*?\*\//g,"");
 var i=SRCn.indexOf("function tthItems(");var body=SRCn.slice(i,i+700);
 t("trợ thủ đọc slaItems chứ không tự khai việc", /slaItems\(\)/.test(body));
 /* tắt là biến mất sạch, không để lại khoảng trống */
 var was=tthOn();
 if(was)tthToggle();
 t("tắt thì không vẽ gì cả", tthHTML("banlam")==="");
 tthToggle();
 t("bật lại thì có", tthHTML("banlam").length>200);
 if(!was)tthToggle();
 /* KHÔNG ĐƯỢC NÓI LÁO: trang không gắn hàng chờ thì không được bảo "đã sạch" */
 t("trang tra cứu không bị bảo là 'đã sạch'", /không gắn hàng chờ riêng/.test(tthHTML("hocvien")));
 t("trang có hàng chờ thì đếm việc thật", /việc<\/b>/.test(tthHTML("buoihoc")));
 /* nói đúng việc của ĐÚNG người: đổi chức danh là đổi nội dung */
 (function(){
  var gv=rows("DL01").filter(isGVRole)[0];
  var ac=rows("DL01").filter(function(x){return /account/.test(ecode(x.role))})[0];
  function nhu(sid){window.GATE_SID=sid;applyScope(sid);setRole("all")}
  nhu(gv.staff_id);var a=tthHTML(SCOPE().land||"banlam");
  nhu(ac.staff_id);var b=tthHTML(SCOPE().land||"banlam");
  window.GATE_SID="";applyScope("");setRole("all");
  t("hai chức danh khác nhau thì trợ thủ nói khác nhau", a!==b&&a.length>200&&b.length>200)})();
 /* việc gấp nhất phải BẤM ĐƯỢC ngay, không chỉ đọc */
 t("việc gấp nhất có nút làm ngay", /slaAct\(|leadDetail\(|openQuick\(/.test(tthHTML("buoihoc")));
 /* trợ thủ đứng TRÊN nội dung trang, không rơi xuống đáy */
 t("trợ thủ chèn trước nội dung trang", /_tth\+renderList\(key\)/.test(SRCn)||/_tth\+RENDER\[key\]\(\)/.test(SRCn));
})();

console.log(bad.length?("CHECK18 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK18 OK: "+ok+" tieu chi | da ve "+VIEWS.length+" trang/tab");
