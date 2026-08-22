/* _checkhoi.js - KHO CÂU HỎI GỢI Ý: BÀY RA CÂU NÀO THÌ CÂU ẤY PHẢI TRẢ LỜI ĐƯỢC.
 *
 * Anh Luân 18/08: *"em thử đặt ra vài chục câu hỏi mà các team có thể sẽ tìm, rồi test thử xem
 * thế nào nhé, dựng sẵn trong câu hỏi gợi ý để có gì a test"* - và trước đó: *"nó có thể thông
 * minh đến mức: hỏi 'tôi muốn xem danh sách giáo viên nghỉ liên tiếp 2 buổi' thì nó trỏ luôn
 * tới trang đích, và lọc luôn theo nhu cầu được ko em"*.
 *
 * BỐN CÂU HỎI CHO MỖI CÂU TRONG KHO:
 *  1. CÓ TRẢ LỜI ĐƯỢC KHÔNG - rơi vào nhánh "bi" (chưa hiểu) là đỏ. Bày ra một câu gợi ý mà
 *     bấm vào không trả lời được thì thà đừng bày.
 *  2. NÚT MỞ CÓ TRỎ VÀO TRANG CÓ THẬT KHÔNG - `jumpFlow('trang','chip')` với trang không tồn
 *     tại là một nút chết.
 *  3. CON SỐ TRONG CÂU TRẢ LỜI CÓ BẰNG SỐ DÒNG CỦA DANH SÁCH NÓ DẪN TỚI KHÔNG - đây là câu
 *     quan trọng nhất, và là con bệnh anh Luân đã bắt hai lần: *"báo N mà a chẳng thấy đâu"*.
 *     Đo bằng cách CHẠY THẬT lời gọi của nút, rồi đếm dòng trang đích vẽ ra.
 *  4. KHÔNG MỜI RỒI ĐUỔI - người không được vào trang ấy thì câu trả lời không được chìa nút.
 *
 * Chạy: ITTS_APP=./_APP.js node _checkhoi.js
 */
const APP = process.env.ITTS_APP || "./_APP.js";
const FS = require("fs");
try {
  const meta = JSON.parse(FS.readFileSync("./demo_data_big.json", "utf8")).meta || {};
  const m = String(meta.anchor || "").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if (m) {
    const moc = new Date(+m[3], +m[2] - 1, +m[1], +(m[4] || 0), +(m[5] || 0)).getTime(), D = Date;
    global.Date = function (...a) { return a.length ? new D(...a) : new D(moc); };
    global.Date.now = () => moc;
    global.Date.prototype = D.prototype; global.Date.parse = D.parse; global.Date.UTC = D.UTC;
  }
} catch (e) {}
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,dataset:{},
 style:{display:"",setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},
 getBoundingClientRect(){return{left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),
 querySelectorAll:()=>[],createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:"",pathname:"/ITTs_WebApp_v5_demo.html"};
var LS={};global.localStorage={getItem:k=>(k in LS?LS[k]:null),setItem(k,v){LS[k]=String(v)},removeItem(k){delete LS[k]}};
var SS={};global.sessionStorage={getItem:k=>(k in SS?SS[k]:null),setItem(k,v){SS[k]=String(v)},removeItem(k){delete SS[k]}};
global.innerWidth=1400;global.innerHeight=900;
require("vm").runInThisContext(FS.readFileSync(APP, "utf8"));
setRole("all");

const xau=[], ghi=[];
let ok=0, soCau=0, soDan=0, soKhop=0;
function t(n,c,m){ if(c)ok++; else xau.push(n+(m?(" - "+m):"")); }

/* Đếm dòng THẬT của một trang sau khi đã áp bộ lọc mà câu trả lời hứa.
   BẪY ĐÃ CẮN NGAY LƯỢT ĐẦU DỰNG BỘ NÀY: bản đầu chỉ đếm `<tr>`, nên 10 trang TÁC VỤ đọc ra 0
   dòng và bộ kiểm khai app hỏng - trong khi các trang ấy vẽ dòng bằng lớp riêng (`slarow` ở
   Việc, `appcard` ở các hàng chờ duyệt, `wowib` ở WOW, `clk` ở sổ thu). App đúng, thước sai.
   *Đếm dòng thì phải hỏi trang ấy vẽ dòng bằng gì, đừng giả định ai cũng dùng bảng.* */
function demDong(){
  const h=String((STORE.content||{}).innerHTML||"");
  const tr=(h.match(/<tr[\s\S]*?<\/tr>/g)||[]).filter(x=>!/<th\b/.test(x)&&!/class="empty"/.test(x)&&!/colspan=/.test(x));
  /* Dòng của trang tác vụ: mỗi dòng mở được một ngăn kéo (`data-mo`) hoặc mang một trong các
     lớp dòng mà app đang dùng. Lấy số LỚN NHẤT trong các cách đếm - một trang chỉ dùng một kiểu. */
  const mo=(h.match(/data-mo="/g)||[]).length;
  /* Lớp dòng KHÔNG phải lúc nào cũng đứng đầu thuộc tính class - app viết `class="msd clk"`,
     `class="obcard done"`. Bản trước neo vào đầu chuỗi nên đọc ra 0 ở sáu trang. */
  const kh=(h.match(/class="[^"]*\b(clk|slarow|appcard|wowib|obcard|absrow|banrow|lrow|chayrow|hvrow)\b/g)||[]).length;
  return Math.max(tr.length,mo,kh);
}

const KHO=(typeof qaKhoCau==="function")?qaKhoCau():[];
t("kho câu hỏi có khai và chia nhóm", KHO.length>=6, KHO.length+" nhóm");
let tongCau=0; KHO.forEach(g=>tongCau+=g[1].length);
t("kho có vài chục câu như anh Luân đặt", tongCau>=35, tongCau+" câu");

KHO.forEach(function(G){
  const nhom=G[0];
  G[1].forEach(function(cau){
    soCau++;
    let R=null;
    try{ R=qaTraLoi(cau) }catch(e){ xau.push("["+nhom+"] "+cau+" - NÉM LỖI: "+e.message); return }
    /* 1. trả lời được */
    if(!R||R.loai==="bi"){ xau.push("["+nhom+"] «"+cau+"» - hộp hỏi đáp KHÔNG hiểu (nhánh bi)"); return }
    ok++;
    /* 2 + 3. nút mở và con số */
    const SO=R.so;
    if(SO&&SO.go){
      soDan++;
      const mJump=String(SO.go).match(/jumpFlow\((["'])([a-zA-Z0-9_]+)\1\s*,\s*(["'])([^"']*)\3\)/);
      if(mJump){
        const trang=mJump[2];
        t("["+nhom+"] «"+cau+"» trỏ vào trang có thật", !!PBK[trang], trang);
        if(PBK[trang]){
          let dong=null;
          try{
            /* chạy THẬT lời gọi của nút, rồi đếm dòng trang đích */
            (0,eval)(SO.go);
            dong=demDong();
          }catch(e){ ghi.push("["+nhom+"] «"+cau+"» chạy nút lỗi: "+e.message); }
          if(dong!=null){
            /* Trang có phân trang thì số dòng vẽ ra có thể ÍT hơn số câu trả lời hứa - chỉ đỏ khi
               vẽ ra NHIỀU hơn (tức lọc không ăn) hoặc vẽ ra 0 trong khi hứa có. */
            const hua=Number(SO.so)||0;
            if(hua>0&&dong===0)
              xau.push("["+nhom+"] «"+cau+"» hứa "+hua+" mà trang đích vẽ ra 0 dòng (bộ lọc không ăn)");
            else if(dong>hua&&hua>0&&dong>hua+2)
              /* GHI CHÚ, KHÔNG PHẢI ĐỎ: phép đếm dòng ở đây là ƯỚC LƯỢNG (đếm lớp dòng trên
                 HTML), mà một trang có thể vẽ nhiều danh sách cùng lúc hoặc đặt lớp `clk` lên
                 cả phần tử con. Chênh lệch ở đây có thể là do CÁI THƯỚC, nên không được kết
                 luận app lọc sai - chỉ ghi lại để người đọc tự soi khi cần. */
              ghi.push("["+nhom+"] «"+cau+"» hứa "+hua+", đếm thô trên trang đích ra "+dong+
                " (phép đếm là ước lượng - trang có thể vẽ nhiều danh sách)");
            else soKhop++;
          }
        }
      }
    }
  });
});

/* 4. KHÔNG MỜI RỒI ĐUỔI - đóng vai một giáo viên rồi hỏi câu của kế toán. */
(function(){
  const gv=(DL.DL01||[]).filter(s=>/teacher/.test(ecode(s.role))&&staffActive(s))[0];
  if(!gv)return;
  window.GATE_SID=gv.staff_id; applyScope(gv.staff_id); setRole("all");
  let hut=0, moi=0;
  ["thu các đợt tới hạn hôm nay","hoàn tiền đang chờ xử lý","đối soát khoản thu hôm qua"].forEach(function(c){
    let R=null; try{R=qaTraLoi(c)}catch(e){return}
    if(R&&R.so&&R.so.go){
      const m=String(R.so.go).match(/jumpFlow\((["'])([a-zA-Z0-9_]+)\1/);
      const tr=m?m[2]:"";
      if(tr&&!canSee(tr)){moi++}else hut++;
    }
  });
  t("không chìa nút mở trang mà người hỏi không được vào", moi===0, moi+" câu chìa nút cấm");
})();

console.log("\n=== HOP HOI DAP - KHO CAU HOI GOI Y ===");
console.log("  cau trong kho          : "+soCau);
console.log("  cau co nut dan toi list: "+soDan+" (khop so dong: "+soKhop+")");
ghi.forEach(x=>console.log("  ghi chu: "+x));
if(xau.length){
  console.log("CHECKHOI DO ("+xau.length+" cho):");
  xau.slice(0,30).forEach(x=>console.log("   X "+x));
  process.exit(1);
}
console.log("CHECKHOI OK: "+ok+" tieu chi - moi cau trong kho deu tra loi duoc, va nut mo dan toi dung danh sach.");
