/* _checkmien.js - DỮ LIỆU NGOÀI MIỀN: người này có đang nhìn thấy thứ không phải việc của họ?
 *
 * VÌ SAO CÓ FILE NÀY (anh Luân 04/08, sau khi mở thử màn Trưởng phòng ACA):
 *   *"nó hiện ra những cái mà chức danh này ko cần á... như các chặng này nọ họ đâu có cần xem,
 *    rồi đóng tiền gì tùm lum trong đó"* - và *"e phải thiết kế cho chuẩn ở từng chức danh nhé"*.
 *
 * App đã có bản khai miền dữ liệu cho từng nhóm (`DSDEF`: lead / hocvien / lop / tien / baocao /
 * viec / nhansu / noidung, mỗi miền một mức all|team|mine|none). Nhưng bản khai ấy chỉ được
 * `srows`/`canRow` tôn trọng ở tầng ĐỌC BẢNG - còn các dải thẻ, câu mở đầu, dải phễu, cột bảng
 * thì vẽ thẳng, không ai hỏi lại. Kết quả: khai `tien:"none"` mà màn vẫn bày công nợ; khai
 * `lead:"none"` mà vẫn bày phễu lead bốn bước.
 *
 * PHÉP ĐO: đóng vai từng người, vẽ THẬT mọi trang họ thấy, rồi tìm dấu hiệu của miền mà họ khai
 * "none". Cố ý BỎ QUA chữ do người dùng tự gõ (tiêu đề việc giao) - đó là chữ của họ, không phải
 * dữ liệu app bày ra; tố vào đó là tố oan, đúng cái bẫy đã cắn ở luật "gọi học viên là em".
 *
 * NGƯỠNG LÀ MỘT CÁI CHỐT KÉO XUỐNG, KHÔNG PHẢI CÔNG TẮC: `TRAN` là số chỗ ĐANG còn, đo được
 * ngày dựng file. Quá số đó là ĐỎ - tức là có chỗ mới sinh ra. Sửa được chỗ nào thì hạ `TRAN`
 * xuống đúng số mới, không được nâng lên.
 *
 * Chạy: ITTS_OUT=<out> node _checkmien.js
 */

const FS=require("fs");
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

/* dau hieu cua tung mien tren MAN HINH */
const DAU={
 /* 05/08 - to oan: mau cu `\d[\d.]{5,}\s*đ` vo luon SO DIEN THOAI dung truoc mot chu D hoa
    ("0334728038 Đã thành học vien"). Tien trong app luon di qua vnd() nen CO DAU CHAM nghin va
    chu d THUONG dinh sat: 461.266.668d. Doi mau theo dung hinh dang do. */
 tien:/(\d{1,3}(\.\d{3})+\s*đ)|học phí|công nợ|còn nợ|đã đóng tiền|đã thu đủ|chiết khấu|hoàn tiền|phiếu thu|doanh thu/i,
 lead:/\blead\b|khách tiềm năng|tư vấn & đăng ký|test đầu vào|phễu|chăm lại/i,
};
const AI=(process.env.AI||"").split(",").filter(Boolean);
/* MIEN TRU CO LY DO DOC DUOC - khong phai cong tac, tung dong mot ly do.
   bangcong: Bang cong giang day la man cua NHAN SU. No co don gia cong ("250.000d/buoi") va co
   loai ca "ca test dau vao" - hai chu nay trung voi dau hieu mien tien/lead, nhung chung khong
   phai hoc phi cua hoc vien cung khong phai kho lead: chung la LUONG va LOAI CA cua giang vien,
   dung nghiep vu ma phong Nhan su phai tinh. Chan hai chu nay lai la lam Nhan su khong tinh
   duoc luong - do la bo bot chu khong phai phan quyen. */
const MIENTRU=[["nhansu","bangcong","tien"],["nhansu","bangcong","lead"]];
const TRAN=0;                /* so cho ngoai mien con lai - chi duoc phep GIAM, khong duoc nang */
let tong=0;
(DL.DL01||[]).filter(s=>s.staff_id&&staffActive(s)&&(!AI.length||AI.indexOf(s.staff_id)>=0)).forEach(S=>{
 window.GATE_SID=S.staff_id;applyScope(S.staff_id);setRole("all");window.BANAI="";
 const g=SCOPE().group;
 const mien={}; ["lead","hocvien","lop","tien","baocao","viec","nhansu","noidung"].forEach(d=>{try{mien[d]=dsLevel(d)}catch(e){mien[d]="?"}});
 const ra=[];
 /* 05/08 - BAY DA CAN, LOI CUA CHINH PHEP DO NAY: vong lap duoi day bo qua moi trang `hide:1`,
    ma `chang` (Ban do chang) chinh la mot trang hide:1 - no khong nam thang tren menu, bon muc
    C1..C4 tro vao no qua window.ARC. Nen bon man CHANG - dung cho anh Luan chup anh Truong phong
    ACA dang dung o "Chang 1 - Khach tiem nang" voi ca phe u lead - chua bao gio duoc ve mot lan
    nao trong phep do. Do sot mot trang thi bao cao xanh khong co nghia gi.
    Nay ve them: moi chang ma `arcXem` cho phep, dung cach app dung (dat window.ARC roi goi
    renderChang), cong voi cac trang hide:1 khac ma menu van dan toi duoc. */
 const TRANG=PAGES.filter(p=>!p.hide&&canSee(p.k)).map(p=>({k:p.k,arc:""}));
 try{ARCS.forEach(A=>{if(arcXem(A.k))TRANG.push({k:"chang",arc:A.k})})}catch(e){}
 TRANG.forEach(p=>{
  let o="";CUR=p.k;if(p.arc){window.ARC=p.arc;window.CHANGK=""}
  try{o=(PBK[p.k]&&PBK[p.k].ty==="list")?renderList(p.k):(RENDER[p.k]?RENDER[p.k]():"")}catch(e){return}
  /* Bo VIEC NOI BO ra khoi phep do: tieu de va noi dung viec giao la CHU CUA NGUOI DUNG go vao
     ("Xem giup so lieu doanh thu...", "Chuan bi de test dau vao"), khong phai du lieu app bay ra.
     Do ca chu cua nguoi dung la to oan - dung cai bay da can o _checkux luat "goi hoc vien la em". */
  let o2=String(o||"");
  /* Lop markup THAT cua mot dong viec giao la .tktt (tieu de) va .tkmeta - ban dau file nay go
     nham thanh .tkti/.tkct nen KHONG boc duoc gi, va hai lan "ro" con lai o giao viec deu la
     chu nguoi dung tu go ("Xem giup so lieu doanh thu...", "Chuan bi de test dau vao dot moi").
     Do chu cua nguoi dung la to oan - dung cai bay da can o _checkux luat "goi hoc vien la em". */
  if(p.k==="giaoviec"||p.k==="duyet"||p.k==="viec")o2=o2
    .replace(/<div class="tktt">[\s\S]*?<\/div>/g," ")
    .replace(/<div class="tkmeta">[\s\S]*?<\/div>/g," ")
    .replace(/<b>[^<]{20,}<\/b>/g," ");
  const txt=o2.replace(/<[^>]*>/g," ").replace(/\s+/g," ");
  Object.keys(DAU).forEach(d=>{
   if(mien[d]!=="none")return;
   if(MIENTRU.some(x=>x[0]===g&&x[1]===p.k&&x[2]===d))return;
   const m=txt.match(DAU[d]);
   if(m){const i=(m.index!=null?m.index:txt.indexOf(m[0]));
    ra.push((p.arc||p.k)+" ["+d+"] <<"+m[0]+">> ..."+txt.slice(Math.max(0,i-45),i+45).trim()+"...")}
  });
 });
 tong+=ra.length;
 if(ra.length){
  console.log("  "+S.full_name+" ["+ecode(S.role)+"] nhom "+g+" - "+ra.length+" cho:");
  ra.slice(0,6).forEach(x=>console.log("    ! "+x));
  if(ra.length>6)console.log("    ... con "+(ra.length-6));
 }
});

if(tong>TRAN){
 console.log("CHECKMIEN DO: "+tong+" cho du lieu ngoai mien, tran dang la "+TRAN+
   " - co cho MOI sinh ra, phai sua chu khong duoc nang tran.");
 process.exit(1);
}
console.log("CHECKMIEN OK: "+tong+"/"+TRAN+" cho du lieu ngoai mien (chot keo xuong - sua duoc cho nao thi ha tran xuong dung so moi)");
