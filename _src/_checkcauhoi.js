/* ═══════════════════════════════════════════════════════════════════════════════════════════
   _checkcauhoi.js - MỖI CHỨC DANH HỎI BAO NHIÊU CÂU, VÀ APP CÓ TRẢ LỜI ĐƯỢC TRONG MỘT CÚ BẤM?

   Anh Luân 08/08: *"Em nên phân tích xem, mỗi nhân viên, mỗi trưởng phòng, họ hỏi bao nhiêu
   loại câu hỏi, họ cần bao nhiêu trang để phục vụ nghiệp vụ? Nó quan trọng dữ lắm em. Hệ thống
   lớn, nhưng quá khó dùng thì chết ngay."*

   ĐO BẰNG BẢN KHAI CỦA CHÍNH APP, không bằng phỏng đoán: bảng `NHIP` khai cho từng chức danh
   "mỗi ngày người này làm gì, theo thứ tự nào" - mỗi dòng là [buổi, việc, vì sao, TRANG ĐÍCH,
   hàm đếm, MÃ CHIP]. Đó chính là danh sách câu hỏi họ hỏi.

   Bộ kiểm đóng vai từng chức danh (`gateEnter` bằng một nhân viên thật của vai đó) rồi hỏi bốn
   câu cho mỗi dòng nhịp:
     C1 · TRANG CÓ THẬT KHÔNG           - `PBK[trang]` tồn tại
     C2 · NGƯỜI NÀY ĐƯỢC XEM KHÔNG      - `navVis(trang)`; sai là "mời rồi đuổi"
     C3 · CÓ LỐI TRÊN MENU KHÔNG        - trang phải nằm trong một nhóm của `navCay()`
     C4 · CHIP CÓ RA ĐÚNG SỐ KHÔNG      - vẽ THẬT trang rồi tìm nút chip đã khai, so số trên
                                          chip với số trên nhịp. Lệch một con là đỏ.

   VÌ SAO C4 LÀ CÂU QUAN TRỌNG NHẤT: trước bản này nhịp đếm `rows()` (toàn trung tâm) còn trang
   đếm `srows()`/`bellItems()` (phạm vi người dùng). Trưởng phòng Marketing mở app đọc "57 việc
   quá hạn", bấm vào thấy 7. Con số ĐẦU TIÊN người ta nhìn mỗi sáng là con số sai - và không có
   cách nào tự phát hiện, vì hai bên không bao giờ đứng cạnh nhau trên màn hình.

   CHỐT KÉO XUỐNG: hai trần dưới đây là số ĐANG CÒN THIẾU, không phải hạn mức được phép. Sửa
   thêm được chỗ nào thì hạ trần xuống đúng số mới - không bao giờ nới lên.

   BẪY ĐÃ CẮN KHI DỰNG BỘ KIỂM NÀY (ghi lại để lần sau khỏi mất công):
   · Bản đo đầu tiên chỉ đếm chip kiểu `LISTCFG.qf`, nên mọi trang tác vụ (wow, buoihoc,
     xeplop...) bị đọc nhầm thành "không có chip" - trong khi chúng có dải chip thật dựng bằng
     `filterBar` -> `segHTML`. Em đã báo anh Luân con số 1/70 rồi phải đính chính thành 12/74.
     Bài học: đo trên CHUỖI HTML THẬT của trang, đừng hỏi lại một bảng cấu hình.
   · Nạp `_APP.js` phải dùng `vm.runInThisContext`, KHÔNG dùng `new Function` - hàm khai bằng
     `function f(){}` ở tầng ngoài cùng sẽ không rơi vào global nếu chạy trong `new Function`.
   ═══════════════════════════════════════════════════════════════════════════════════════════ */
const FS=require("fs"),PATH=require("path");

/* ---- trần (chốt kéo xuống) ---- */
const TRAN_KHONG_CHIP = 2;   /* dòng nhịp CÓ SỐ ĐẾM mà chưa khai chip đích */
/* 1 = dòng "Duyệt hàng chờ quyết định" của cấp điều hành, trỏ vào trang gộp `duyet`.
   Em đã THỬ cho nó một mục menu rồi GỠ RA: `_check11` đòi nhóm "Chờ duyệt" mỗi mục phải là một
   TRANG THẬT (nguyên tắc V2), và đo ra hậu quả thật - bấm `duyet` thì mục sáng lại là `duyetck`
   chứ không phải chính nó, vì `navCur` nhường sáng cho mục con. Mời người ta vào một mục rồi tô
   sáng mục khác là làm họ mất dấu, tệ hơn là không có mục.
   Bốn hàng chờ con đều đã đứng trên menu với số đếm riêng, nên không ai mất đường. */
const TRAN_KHONG_MENU = 1;    /* dòng nhịp trỏ vào trang không có mục trên menu của người đó */
const TRAN_KHONG_XEM  = 0;    /* dòng nhịp trỏ vào trang người đó không được xem */

/* Dòng nhịp KHÔNG khai chip mà vẫn đúng - trang ấy CHÍNH LÀ hàng chờ, vào là thấy hết, không
   có gì để lọc thêm. Khai ở đây kèm lý do đọc được, chứ không im lặng cho qua. */
const KHONGCANCHIP={
 "duyetnghi":"trang này CHÍNH LÀ hàng chờ duyệt nghỉ - vào là thấy đủ, không có gì để lọc thêm",
 "duyetthu":"trang này CHÍNH LÀ hàng chờ xác nhận thu tiền",
 "duyethoan":"trang này CHÍNH LÀ hàng chờ hoàn tiền",
 "duyetck":"trang này CHÍNH LÀ hàng chờ duyệt chiết khấu",
 "duyet":"trang gom bốn hàng chờ quyết định, mỗi hàng đã là một tab riêng có số",
 "baocao":"trang chỉ số - không phải danh sách hồ sơ nên không có chip lọc dòng",
 "banglop":"vận hành MỘT lớp - chọn lớp bằng ô chọn, không phải bằng chip",
 "buoihnay":"trang đã là 'buổi của hôm nay' - lọc thêm theo ngày là lọc chính nó",
};

/* Mã chip -> cách tìm nút ấy trong HTML của trang. Phải khớp đúng lời gọi mà trang sinh ra. */
function onclickCua(page,chip){
 const i=String(chip).indexOf(":"),k=(i<0?"":chip.slice(0,i)),v=(i<0?chip:chip.slice(i+1));
 /* "qf:trang/key" - chip nằm trên một danh sách NHÚNG trong trang, không nằm trên chính trang. */
 if(k==="qf"||k==="en"){const j=v.indexOf("/"),pg=(j<0?page:v.slice(0,j)),key=(j<0?v:v.slice(j+1));
  return (k==="qf"?`qfToggle('${pg}','${key}')`:`toggleFilt('${pg}','${key}')`)}
 if(k==="xl")return `window.XLFILT='${v}'`;
 if(k==="tk")return `tkTabSet('${v.split("/")[0]}')`;
 if(k==="vi")return `viecOnly('${v}')`;
 if(k==="bt")return `window.BTMODE='${v}'`;
 if(k==="ga")return `window.GATAB='${v}'`;
 return `fset('${page}','${v}')`;
}

/* ---- dựng khung trình duyệt giả rồi nạp app ---- */
global.window=global;
const el=()=>({innerHTML:"",style:{},classList:{add(){},remove(){},toggle(){},contains(){return false}},textContent:"",value:"",scrollTop:0,dataset:{},appendChild(){},setAttribute(){},addEventListener(){},querySelector(){return null},querySelectorAll(){return []},closest(){return null},getBoundingClientRect(){return{x:0,y:0,width:0,height:0}}});
const kho={};
global.document={getElementById:id=>kho[id]||(kho[id]=el()),createElement:el,querySelector(){return null},querySelectorAll(){return []},addEventListener(){},body:el(),documentElement:el()};
const ss={},ls={};
global.sessionStorage={getItem:k=>(k in ss?ss[k]:null),setItem:(k,v)=>{ss[k]=String(v)},removeItem:k=>{delete ss[k]}};
global.localStorage={getItem:k=>(k in ls?ls[k]:null),setItem:(k,v)=>{ls[k]=String(v)},removeItem:k=>{delete ls[k]}};
global.location={search:"",hash:"",pathname:"/",reload(){}};global.history={replaceState(){},pushState(){}};
global.navigator={userAgent:"node"};global.getComputedStyle=()=>({display:"block",getPropertyValue:()=>""});
global.matchMedia=()=>({matches:false,addEventListener(){},addListener(){}});global.requestAnimationFrame=f=>setTimeout(f,0);
global.alert=()=>{};global.confirm=()=>true;
require("vm").runInThisContext(FS.readFileSync(PATH.join(__dirname,"_APP.js"),"utf8"));

/* ---- phép đo ---- */
function ve(k){const cu=CUR;
 try{CUR=k;const p=PBK[k]||{};return (p.ty==="list")?renderList(k):(RENDER[k]?RENDER[k]():"")}
 catch(e){return ""}finally{CUR=cu}}
/* Số hiện trên đúng nút chip đã khai. null = có nút nhưng nút không mang số;
   undefined = không tìm thấy nút nào gọi lời gọi ấy. */
function soTrenChip(html,onclick){
 const re=/<button class="segb[^"]*" onclick="([^"]*)">([\s\S]*?)<\/button>/g;
 let m;
 while((m=re.exec(String(html)))){
  if(m[1].indexOf(onclick)<0)continue;
  const so=/<i class="segn">(\d+)<\/i>/.exec(m[2]);
  return so?parseInt(so[1],10):null;
 }
 return undefined;
}
function menuCua(){const out=[];
 navCay().forEach(G=>{const it=G.items.filter(k=>{try{return navVis(k)}catch(e){return false}});
  if(it.length)out.push({g:G.g,items:it})});
 return out}
function coLoiMenu(k,M){
 if(M.some(G=>G.items.indexOf(k)>=0))return true;
 /* Trang con vào bằng cửa cha vẫn tính là CÓ LỐI - miễn là cửa cha đứng trên menu. Hai quan hệ
    cha-con đang có: `NAVSUB` (vd Vận hành lớp <- Lớp học) và `SOTRACUU` (mười sáu cuốn sổ chỉ-đọc
    <- trang Tra cứu, gom 08/08 để menu CEO từ 60 mục xuống 45). */
 const cha=(typeof NAVSUB!=="undefined"&&NAVSUB[k])||
           ((typeof SOTRACUU!=="undefined"&&SOTRACUU.indexOf(k)>=0)?"tracuu":"");
 return !!(cha&&M.some(G=>G.items.indexOf(cha)>=0));
}

const nguoi=rows("DL01").filter(s=>staffActive(s));
const vais=[...new Set(nguoi.map(s=>String(s.role||"")))].filter(Boolean).sort();

let doi=[],khongChip=[],khongMenu=[],khongXem=[],tieuChi=0;
const BANG=[];

vais.forEach(v=>{
 const ai=nguoi.find(s=>String(s.role)===v);
 try{gateEnter(ai.staff_id)}catch(e){return}
 const M=menuCua(), soMuc=M.reduce((a,G)=>a+G.items.length,0);
 let hoi=[];try{hoi=nhipList()}catch(e){hoi=[]}
 const trang=[...new Set(hoi.map(q=>q.page).filter(Boolean))];
 BANG.push({vai:v,cau:hoi.length,trang:trang.length,muc:soMuc});

 hoi.forEach(q=>{
  const k=q.page||"";if(!k)return;
  const nhan=v+" · \""+q.t+"\"";
  tieuChi++;
  /* C1 */
  if(!PBK[k]){doi.push(nhan+": trang \""+k+"\" KHÔNG TỒN TẠI");return}
  /* C2 */
  let thay=false;try{thay=navVis(k)}catch(e){}
  if(!thay){khongXem.push(nhan+" -> "+k);return}
  tieuChi++;
  /* C3 */
  if(!coLoiMenu(k,M))khongMenu.push(nhan+" -> "+k);
  tieuChi++;
  /* C4 */
  if(q.hab)return;                       /* thói quen: không có hàng chờ nào để đếm */
  if(!q.chip){
   if(!KHONGCANCHIP[k])khongChip.push(nhan+" -> "+k+" (chưa khai chip)");
   return}
  tieuChi++;
  const oc=onclickCua(k,q.chip);
  /* đặt chip rồi vẽ trang - đúng thứ tự người dùng bấm từ nhịp ngày */
  try{nhipDat(k,q.chip)}catch(e){}
  const so=soTrenChip(ve(k),oc);
  if(so===undefined){doi.push(nhan+": khai chip \""+q.chip+"\" trên trang "+k+" mà trang KHÔNG có nút nào gọi "+oc);return}
  if(so===null){doi.push(nhan+": chip \""+q.chip+"\" trên trang "+k+" KHÔNG MANG SỐ - người dùng phải bấm mới biết có việc hay không");return}
  if(so!==q.n)doi.push(nhan+": nhịp nói "+q.n+" mà chip \""+q.chip+"\" trên trang "+k+" hiện "+so+" - hai con số cho cùng một câu hỏi");
 });
});
try{gateEnter("")}catch(e){}

/* ---- in ---- */
console.log("CAUHOI - moi chuc danh hoi bao nhieu cau, app tra loi duoc trong may cu bam");
console.log("  vai".padEnd(30)+"cau".padStart(4)+"trang".padStart(7)+"muc menu".padStart(10));
BANG.forEach(R=>console.log("  "+R.vai.slice(0,27).padEnd(28)+String(R.cau).padStart(4)+
 String(R.trang).padStart(7)+String(R.muc).padStart(10)));
const maxTrang=Math.max.apply(null,BANG.map(R=>R.trang));
const maxMuc=Math.max.apply(null,BANG.map(R=>R.muc));
console.log("  => khong ai can qua "+maxTrang+" trang; nguoi thay nhieu muc menu nhat: "+maxMuc);

let loi=0;
function bao(ten,ds,tran){
 if(ds.length>tran){loi++;console.log("DO - "+ten+": "+ds.length+" (tran "+tran+")");
  ds.slice(0,12).forEach(x=>console.log("     · "+x));
  if(ds.length>12)console.log("     ... con "+(ds.length-12));
 }else if(ds.length){console.log("  (con "+ds.length+"/"+tran+" "+ten+" - trong tran, ha tran khi sua them)")}
}
if(doi.length){loi++;console.log("DO - so tren nhip khac so tren chip, hoac chip khai sai: "+doi.length);
 doi.forEach(x=>console.log("     · "+x))}
bao("dong nhip chua khai chip dich",khongChip,TRAN_KHONG_CHIP);
bao("dong nhip khong co loi tren menu",khongMenu,TRAN_KHONG_MENU);
bao("dong nhip tro vao trang khong duoc xem",khongXem,TRAN_KHONG_XEM);

if(loi){console.log("CHECKCAUHOI: CO CHO DO");process.exit(1)}
console.log("CHECKCAUHOI OK: "+tieuChi+" tieu chi tren "+BANG.length+" chuc danh · "+
 BANG.reduce((a,R)=>a+R.cau,0)+" cau hoi");
