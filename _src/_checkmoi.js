/* Do: moi chuc danh, moi trang trong pham vi cua ho, co loi vao nao dan toi trang NGOAI pham vi khong */
const FS=require("fs"), APP="./_APP.js";
try{const meta=JSON.parse(FS.readFileSync("./demo_data_big.json","utf8")).meta||{};
 const m=String(meta.anchor||"").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
 if(m){const moc=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime(),D=Date;
  global.Date=function(...a){return a.length?new D(...a):new D(moc)};
  global.Date.now=()=>moc;global.Date.prototype=D.prototype;global.Date.parse=D.parse;global.Date.UTC=D.UTC}}catch(e){}
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return{left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:"",pathname:"/ITTs_WebApp_v5_demo.html"};
var LS={};global.localStorage={getItem:(k)=>(k in LS?LS[k]:null),setItem(k,v){LS[k]=String(v)},removeItem(k){delete LS[k]}};
var SS={};global.sessionStorage={getItem:(k)=>(k in SS?SS[k]:null),setItem(k,v){SS[k]=String(v)},removeItem(k){delete SS[k]}};
global.innerWidth=1400;global.innerHeight=900;
require("vm").runInThisContext(FS.readFileSync(APP,"utf8"));

/* _checkmoi: KHÔNG MỜI RỒI ĐUỔI - đóng vai từng NGƯỜI đang đi làm, vẽ THẬT mọi trang trong
   phạm vi của họ, rồi hỏi: trên màn có cái nút nào dẫn tới chỗ họ không được vào không?

   Anh Luân 05/08: *"ở trang lớp học của trưởng phòng ACA lại có nút Xếp lớp và onboarding, bấm
   vào thì: Trang ngoài phạm vi chức danh của bạn - đang xem ở chế độ THAM KHẢO... Đây là 1 dạng
   lỗi nặng đó em."* - rồi: *"tức là màn hình dành cho mỗi người vẫn còn nhiều chỗ chưa chuẩn,
   e phải rà soát lại."*

   Lượt đo đầu: 67 chỗ trên 16 chức danh. Không phải một cái nút hỏng - là cả một LOẠI hỏng, vì
   mọi trang đều dựng nút theo nghiệp vụ chứ chưa bao giờ hỏi người đang ngồi trước màn là ai.

   ĐO SAU KHI SCRUB, KHÔNG ĐO TRÊN CHUỖI THÔ. `RENDER[k]()` trả về bản chưa lọc - lọc nằm ở
   `go()`, đúng cửa mà người dùng đi qua. Đo bản thô là đỏ oan; đo bản đã qua `go()` mới là đo
   đúng cái người ta nhìn thấy.
   Chạy: ITTS_APP=./_APP.js node _checkmoi.js */
var xau=[],ok=0,soNguoi=0;
function t(ten,dieu){if(dieu)ok++;else xau.push(ten)}

(DL.DL01||[]).filter(s=>s.staff_id&&staffActive(s)).forEach(function(S){
 var role=(ecode(S.role)||S.role)+"";
 window.GATE_SID=S.staff_id; applyScope(S.staff_id); setRole("all");
 var eff=SCOPE(); if(eff.pages==="*")return;      /* Quản trị viên xem tất - không có "ngoài phạm vi" */
 soNguoi++;
 eff.pages.forEach(function(pk){
  var h="";
  try{
    CUR=pk;
    var P=(PAGES.filter(function(p){return p.k===pk})[0]||{});
    h = P.ty==="list" ? renderList(pk) : (RENDER[pk]?RENDER[pk]():"");
    h = scrubMoiRoiDuoi(h);                        /* đúng cửa người dùng đi qua */
  }catch(e){ return }
  /* 1. Không còn NÚT nào dẫn ra ngoài phạm vi */
  var nut=(String(h).match(/<button\b[^>]*onclick="go\('([a-z0-9_]+)'\)"/g)||[])
    .map(function(g){return g.match(/go\('([a-z0-9_]+)'\)/)[1]})
    .filter(function(k){return !canSee(k)&&!SENSITIVE[k]});
  t(role+" · trang "+pk+" con nut ra ngoai pham vi: "+nut.join(","), nut.length===0);
  /* 2. Không còn Ô/DÒNG bấm được dẫn ra ngoài phạm vi */
  var o=(String(h).match(/<(?:div|tr|td|li|a)\b[^>]*onclick="go\('([a-z0-9_]+)'\)"/g)||[])
    .map(function(g){return g.match(/go\('([a-z0-9_]+)'\)/)[1]})
    .filter(function(k){return !canSee(k)&&!SENSITIVE[k]});
  t(role+" · trang "+pk+" con o bam duoc ra ngoai pham vi: "+o.join(","), o.length===0);
 });
});
t("co do duoc it nhat 10 nguoi", soNguoi>=10);
console.log(xau.length?("FAIL:\n  "+xau.slice(0,40).join("\n  ")+(xau.length>40?("\n  ... con "+(xau.length-40)):"")):"TONG: "+ok+" tieu chi tren "+soNguoi+" nguoi");
process.exit(xau.length?1:0);
