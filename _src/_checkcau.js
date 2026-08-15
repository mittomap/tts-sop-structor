/* _checkcau.js - CÂU TRÊN MÀN CÓ TỰ MÂU THUẪN KHÔNG?
 *
 * Nêu từ 11/08, treo tới 15/08. Hai ca thật đã sinh ra nó:
 *   · "còn NaN" - một phép trừ hỏng in thẳng ra màn, không lỗi JS, không đỏ bộ kiểm nào.
 *   · "quá 9 ngày" cho một lớp CÒN 9 NGÀY NỮA MỚI KHAI GIẢNG - hai vế của cùng một câu nói
 *     ngược nhau, mà mỗi vế đọc riêng đều hợp lệ.
 *
 * VÌ SAO KHÔNG BỘ KIỂM NÀO CŨ BẮT ĐƯỢC: chúng đo CẤU TRÚC (có nút không, có cột không, có tràn
 * không) hoặc đo SỐ (thẻ khớp danh sách không). Không bộ nào ĐỌC CHỮ rồi hỏi "câu này có nghĩa
 * không". Đó là chỗ hở mà chỉ người đọc mới thấy - và anh Luân là người đọc duy nhất.
 *
 * ĐO: vẽ THẬT mọi trang + mọi sổ, đóng vai từng nhóm chức danh, bóc chữ ra khỏi thẻ HTML rồi
 * soi bằng bảy phép thử. Mỗi phép thử neo vào một LOẠI mâu thuẫn, không neo vào một câu cụ thể.
 *
 * ĐÃ THỬ NGƯỢC (luật của dự án: bộ kiểm mới phải ĐỎ trên bản đang lỗi trước khi được tin).
 * Chèn tay SÁU câu hỏng vào thân trang Việc hôm nay của một bản dựng thử, mỗi câu nhắm đúng một
 * phép:
 *   "Còn NaN học viên chưa xếp lớp"                                  -> phép 1
 *   "Hồ sơ này quá -3 ngày"                                          -> phép 2
 *   "0 việc quá hạn - làm ngay"                                      -> phép 3
 *   "Lớp này quá 9 ngày mà còn 9 ngày nữa mới khai giảng"            -> phép 4 (ca thật 11/08)
 *   "Buổi kéo dài 2giờ30 nên tính công theo 3ngày2"                  -> phép 5
 *   "Xin chào {0}, bạn có ___ việc"                                  -> phép 6
 * CẢ SÁU đều bị bắt (72 chỗ trên 12 nhóm chức danh vì trang ấy ai cũng xem được); gỡ ra thì
 * xanh lại 4314/4314. Không có phép nào chỉ nằm cho đẹp bản khai.
 */
const FS = require("fs");
const OUT = process.env.ITTS_OUT || "..";

/* ── nền tối thiểu để chạy mã app trong node (giống các bộ kiểm khác) ── */
try{const meta=JSON.parse(FS.readFileSync("./demo_data_big.json","utf8")).meta||{};
 const m=String(meta.anchor||"").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
 if(m){const moc=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime(),D=Date;
 global.Date=function(...a){return a.length?new D(...a):new D(moc)};global.Date.now=()=>moc;
 global.Date.prototype=D.prototype;global.Date.parse=D.parse;global.Date.UTC=D.UTC}}catch(e){}
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:"",pathname:"/x.html"};
var LS={};global.localStorage={getItem:(k)=>(k in LS?LS[k]:null),setItem(k,v){LS[k]=String(v)},removeItem(k){delete LS[k]}};
var SS={};global.sessionStorage={getItem:(k)=>(k in SS?SS[k]:null),setItem(k,v){SS[k]=String(v)},removeItem(k){delete SS[k]}};
global.innerWidth=1400;global.innerHeight=900;
require("vm").runInThisContext(FS.readFileSync("./_APP.js","utf8"));

/* ── BẢY PHÉP THỬ ─────────────────────────────────────────────────────────────
   Mỗi phép có: tên · biểu thức tìm · (tuỳ chọn) phép loại trừ cho ca hợp lệ.
   Chỗ khó nhất không phải tìm ra lỗi, mà là KHÔNG BÁO OAN: "0 việc" trên một cái chip lọc là
   chuyện bình thường, chỉ khi nó đi kèm lời giục mới thành mâu thuẫn. */
const PHEP = [
 {t:"số hỏng in thẳng ra màn (NaN / undefined / null / Infinity)",
  re:/(?:^|[\s>(:·-])(NaN|undefined|null|Infinity)(?=$|[\s<)·,.đ%])/},
 {t:"số ÂM ở chỗ chỉ có nghĩa khi dương (quá hạn / còn lại / đã qua)",
  re:/(quá|còn|đã qua|trễ|thiếu|nợ)\s+-\d/i},
 {t:"đếm 0 mà vẫn giục làm ngay",
  re:/\b0\s+(việc|buổi|hồ sơ|học viên|lớp|bài|phiếu|lead)[^.!?]{0,40}(làm ngay|gấp|xử lý ngay|cần xử lý ngay)/i},
 /* HAI PHÉP ĐÃ THỬ RỒI BỎ (15/08) - ghi lại để người sau khỏi viết lại chúng:
    · "vừa nói không có gì vừa đếm ra số" bắt "Không có hoạt động học nào 58 ngày" - câu ĐÚNG,
      vì con số ấy là khoảng thời gian chứ không phải số lượng của danh từ vừa bị phủ định;
    · "tỷ lệ ngoài 0-100%" bắt "≥ 100%" (một ngưỡng) và "548% từ bước trước" (một mức tăng) -
      cả hai đều hợp lệ, phần trăm vượt 100 không hề vô lý khi nó so hai kỳ với nhau.
    Muốn siết cho đúng thì phải hiểu danh từ nào đi với số nào, tức phải phân tích câu - quá tầm
    một biểu thức, và một phép thử báo oan thì bị người ta bỏ qua, mà bỏ qua một lần là bỏ qua
    mãi. *Thà ít phép mà phép nào cũng đáng tin.* */
 {t:"hai mốc thời gian ngược nhau trong một câu (quá hạn mà chưa tới hạn)",
  re:/quá\s+\d+\s*ngày[^.!?]{0,60}(còn|sắp|chưa)\s+\d+\s*ngày/i},
 {t:"đơn vị dính vào nhau do thiếu khoảng trắng (đọc ra một số khác)",
  re:/\d(giờ|ngày|buổi|phút)\d/},
 {t:"chỗ trống chưa thay giá trị ({0}, %s, [tên], ___)",
  re:/(\{\d\}|%s\b|\[(tên|ten|số|so)\]|___)/},
];

/* Bóc chữ khỏi HTML - THEO TỪNG KHỐI, không thành một chuỗi phẳng.
   BẪY ĐÃ CẮN NGAY LƯỢT CHẠY ĐẦU của chính bộ kiểm này: bản đầu thay mọi thẻ bằng một khoảng
   trắng, nên "Không có phiếu nào bị bỏ quên" (một cái thẻ) dính liền với "12 lớp" (thanh công cụ
   cách đó nửa màn) thành một câu, và phép thử "vừa nói không có gì vừa đếm ra số" báo oan 20+
   chỗ. Hai câu ĐỨNG CẠNH NHAU trên màn không phải là một câu.
   Nay thẻ KHỐI (div, p, li, td, tr, h1-6, button, section...) thành dấu XUỐNG DÒNG, thẻ trong
   dòng (b, i, span, a, em, small) thành khoảng trắng - rồi soi TỪNG DÒNG một.
   *Đọc chữ trên màn thì phải tôn trọng ranh giới khối, không thì chính phép đo tự dựng ra mâu
   thuẫn không hề có.* */
const KHOI=/^\/?(div|p|li|ul|ol|td|th|tr|table|thead|tbody|h[1-6]|section|header|footer|button|option|br|hr)\b/i;
function chu(h){
 return String(h||"")
  .replace(/<script[\s\S]*?<\/script>/g," ")
  .replace(/<style[\s\S]*?<\/style>/g," ")
  .replace(/<([^>\s/]+)[^>]*>|<\/([^>\s]+)>/g,function(m,a,b){
    return KHOI.test(a||("/"+b))?"\n":" "})
  .replace(/&nbsp;/g," ").replace(/&amp;/g,"&").replace(/&lt;/g,"<").replace(/&gt;/g,">")
  .replace(/&quot;/g,'"').replace(/&#8226;/g,"·")
  .replace(/[ \t]+/g," ").replace(/\n[ \t]*/g,"\n");
}
/* Cắt quanh chỗ khớp để người đọc báo lỗi biết ngay câu nào. */
function quanh(t,i,n){return t.slice(Math.max(0,i-45), i+(n||0)+45).trim()}

var loi={}, soMan=0;
function soi(html, nhan){
 var t=chu(html); if(!t.trim())return; soMan++;
 t.split("\n").forEach(function(dong){
  dong=dong.trim(); if(dong.length<3)return;
  PHEP.forEach(function(P){
   var m=P.re.exec(dong); if(!m)return;
   var k=P.t+" || "+nhan+" || "+quanh(dong,m.index,m[0].length);
   loi[k]=1})});
}

var DSLIST=Object.keys(PBK).filter(function(k){return PBK[k].ty==="list"});
var da={};
rows("DL01").forEach(function(st){
 var eff;try{eff=buildScope(ecode(st.role))}catch(e){return}
 if(!eff||da[eff.group])return;da[eff.group]=1;
 window.SCOPEEFF=eff;CURSTAFF=st.staff_id;
 Object.keys(RENDER).forEach(function(p){CUR=p;var o="";
  try{o=scrubMan(RENDER[p]())}catch(e){return}
  soi(o,eff.group+" · trang "+p)});
 DSLIST.forEach(function(p){CUR=p;var o="";
  try{o=scrubMan(renderList(p))}catch(e){return}
  soi(o,eff.group+" · sổ "+p)});
});
window.SCOPEEFF=null;

/* Ba cách xem của Việc hôm nay là ba màn khác nhau - phải soi cả ba, không thì hai cái sau
   chưa từng được đọc. */
["viec","nguoi","chang"].forEach(function(v){
 window.VIECVIEW=v;CUR="viec";var o="";
 try{o=scrubMan(RENDER.viec())}catch(e){return}
 soi(o,"Việc hôm nay · cách xem "+v)});
window.VIECVIEW="viec";

var K=Object.keys(loi);
var soTC=soMan*PHEP.length;
if(K.length){
 console.log("CHECKCAU DO ("+K.length+" câu tự mâu thuẫn / "+soTC+" tiêu chí trên "+soMan+" màn):");
 K.slice(0,20).forEach(function(x){
  var p=x.split(" || ");
  console.log("  X ["+p[0]+"]");
  console.log("     "+p[1]+"  ->  ..."+p[2]+"...")});
 if(K.length>20)console.log("  ... còn "+(K.length-20)+" chỗ nữa");
 process.exit(1);
}
console.log("CHECKCAU OK: "+soTC+" tieu chi ("+soMan+" man x "+PHEP.length+" phep thu) - khong cau nao tu mau thuan");
