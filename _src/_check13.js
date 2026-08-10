/* _check13: KPI BIET NOI (mang 2 hoi dong 6 chuyen gia). Chay: ITTS_OUT=<out> node _check13.js */
function El(){return {innerHTML:"",textContent:"",value:"",style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},appendChild(){},remove(){},focus(){},addEventListener(){},files:[]}}
global.document={getElementById:()=>El(),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
/* NEO DONG HO VAO NGAY SINH CUA BO DU LIEU - phai dat TRUOC khi nap app.
   Bay da can (02/08): sang chay XANH, chieu cung ngay chay DO o tieu chi "HCR bo duoc bai chua
   toi han" - khong ai dung vao ma nguon lan du lieu. Ly do: bai tap "chua toi han" HET han dan
   trong ngay, nen ket qua bo kiem phu thuoc vao GIO nguoi ta bam chay no.
   Luat cua du an: KHONG DO CAI DANG DUNG YEN BANG MOT CAI THUOC DANG CHAY. */
(function(){try{
  var meta=JSON.parse(require('fs').readFileSync('./demo_data_big.json','utf8')).meta||{};
  var m=String(meta.anchor||"").match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})(?:\s+(\d{1,2}):(\d{2}))?$/);
  if(!m)return;
  var moc=new Date(+m[3],+m[2]-1,+m[1],+(m[4]||0),+(m[5]||0)).getTime(), D=Date;
  global.Date=function(){return arguments.length?new D(...arguments):new D(moc)};
  global.Date.now=function(){return moc};
  global.Date.prototype=D.prototype;global.Date.parse=D.parse;global.Date.UTC=D.UTC;
}catch(e){}})();
var SRC=require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8');
require('vm').runInThisContext(SRC);
setRole("all");
var bad=[],ok=0;
function t(n,c){if(c)ok++;else bad.push(n)}

/* --- 1. BON LOI TINH phai sua truoc, khong thi app khuyen sai --- */
window.REPKY="all";var v=kpiCompute();
t("CUR chi tinh lop dang chay / dang tuyen (bo lop len ke hoach + da huy)",
  v.__CURn===rows("DL10").filter(function(c){return isc(c.class_status,"in_progress","open")&&num(c.class_capacity)>0}).length);
t("CUR khong con la so ao duoi 35%", v.CUR!=null&&v.CUR>0.35);
(function(){var due=rows("DL13").filter(function(h){var d=pvnd(h.homework_due_date);return !d||d.getTime()<=Date.now()});
 t("HCR chi tinh bai DA TOI HAN", v.__HCRn===due.length);
 t("HCR bo duoc bai chua toi han", due.length<rows("DL13").length);})();
(function(){var jud=rows("DL18").filter(function(c){return String(c.achievement_status||"").trim()});
 t("AR chi tinh ho so DA CO KET LUAN", v.__ARn===jud.length);
 t("AR ghi ro con bao nhieu ho so chua cham", v.__ARpend===rows("DL18").length-jud.length);})();
(function(){window.REPKY="30";var v30=kpiCompute();window.REPKY="all";
 t("kpiCompute AN theo ky so lieu REPKY", JSON.stringify(v30)!==JSON.stringify(v));})();

/* --- 2. kpiSev 5 bac, khong con cham nhi phan --- */
t("kpiSev tra dung 5 bac", ["tot","dat","hut","canhbao","baodong"].every(function(x){
  return [kpiSev("CVR",0.9,0.4,"≥"),kpiSev("CVR",0.42,0.4,"≥"),kpiSev("CVR",0.37,0.4,"≥"),
          kpiSev("CVR",0.31,0.4,"≥"),kpiSev("CVR",0.1,0.4,"≥")].indexOf(x)>=0}));
t("kpiSev bao chua du du lieu khi khong co so", kpiSev("CVR",null,0.4,"≥")==="chuadu");
t("kpiSev xu ly dung chieu <= (cang thap cang tot)", kpiSev("LRT",5,15,"≤")==="tot"&&kpiSev("LRT",60,15,"≤")==="baodong");
t("chi so muc tieu 100% co dai RIENG (hut 5% da la nghiem trong)",
  KPIBAND.GCR7==="tuyetdoi"&&kpiSev("GCR7",0.93,1,"≥")==="canhbao");
t("thang diem 1-5 co dai rieng", KPIBAND.SS==="thang5"&&kpiSev("SS",4.5,4.5,"≥")==="dat"&&kpiSev("SS",3.6,4.5,"≥")==="baodong");
t("NPS co dai rieng", KPIBAND.NPS==="nps");

/* --- 3. 17 chi so quan trong deu co du 6 truong dien giai --- */
var codes=Object.keys(KPIDOC);
t("co dung 17 chi so duoc dien giai", codes.length===17);
codes.forEach(function(c){
 var d=KPIDOC[c];
 t(c+": co truong nghia", !!d.nghia);
 t(c+": co truong vi sao", !!d.visao);
 t(c+": co truong nguon so lieu", !!d.nguon);
 t(c+": doc() du ca 5 bac", ["tot","dat","hut","canhbao","baodong"].every(function(k){return !!d.doc[k]}));
 t(c+": viec() co hanh dong cho 3 bac chua dat",
   ["hut","canhbao","baodong"].every(function(k){return (d.viec[k]||[]).length>=1}));
 t(c+": moi hanh dong tro toi trang CO THAT",
   Object.keys(d.viec).every(function(k){return (d.viec[k]||[]).every(function(a){return !!RENDER[a[2]]})}));
 t(c+": vi du co SO CON that", !!kpiNum(c).lbl);
 t(c+": noi duoc co mau", !!kpiMau(c));
});

/* --- 4. quy ra NGUOI va TIEN --- */
t("PCR quy ra so tien nam ngoai tai khoan", kpiQuy("PCR",v.PCR,0.8,"≥").indexOf("đ")>=0);
t("CUR quy ra so cho trong", kpiQuy("CUR",v.CUR,0.7,"≥").indexOf("chỗ trống")>=0);

/* --- 5. XU HUONG: nhom B tuyet doi khong duoc hien mui ten --- */
["CVR","TBR","PCR","RER","AR"].forEach(function(c){
 t(c+" (nhom B - lo can thoi gian chin) KHONG hien mui ten", !KPITREND[c]&&kpiTrendHTML(c).indexOf("▲")<0&&kpiTrendHTML(c).indexOf("▼")<0)});
["ATR","HCR","SS","LRT"].forEach(function(c){t(c+" (nhom A - mau so dong trong ky) duoc phep so ky truoc", !!KPITREND[c])});

/* --- 6. khoi 3 viec nen lam --- */
(function(){var top=kpiTop3();
 t("khoi 3 viec chon toi da 3 viec", top.length<=3);
 t("moi chang toi da 1 viec", (function(){var s={};return top.every(function(x){if(s[x.arc])return false;s[x.arc]=1;return true})})());
 t("viec xep theo diem giam dan", top.every(function(x,i){return i===0||top[i-1].diem>=x.diem}));
 t("chi chon chi so CHUA dat", top.every(function(x){return x.sev!=="tot"&&x.sev!=="dat"}));
 var html=kpiTop3Section();
 t("khoi 3 viec render ra HTML", html.length>200);
 t("khoi 3 viec co nut bam toi dung cho", html.indexOf("kpiGo(")>=0);
 t("khoi 3 viec noi ro vi sao chon", html.indexOf("mỗi chặng tối đa 1 việc")>=0);})();

/* --- 7. bung chi tiet mot chi so --- */
codes.forEach(function(c){try{kpiOpen(c)}catch(e){bad.push("kpiOpen("+c+") NEM LOI: "+e.message)}});
ok++;

/* --- 8. trang Bao cao: khoi 3 viec phai nam TREN khoi kinh doanh --- */
(function(){var h=RENDER.baocao();
 var a=h.indexOf("3 việc nên làm tuần này"),b=h.indexOf("Tình hình kinh doanh");
 t("khoi 3 viec nam TREN khoi tinh hinh kinh doanh", a>=0&&b>=0&&a<b);
 /* ĐỔI CÂU HỎI, KHÔNG XOÁ THƯỚC (10/08). Phép canh cũ đòi trang phải chứa đúng chuỗi
    "áp cho TOÀN BỘ chỉ số". Ý định của nó đúng - **trang phải nói cho người đọc biết kỳ áp cho
    cái gì** - nhưng câu mà nó canh thì SAI: hỏi thẳng `fn.toString()`, `baocaoBranch` và
    `staffPerfSection` không có một lời gọi `inRep`/`repF`/`repRange` nào, và "Hiệu suất đội tư
    vấn" còn tự khai ngay trên tiêu đề là *"đăng ký & doanh thu: toàn kỳ dữ liệu"* - tức app tự
    mâu thuẫn với chính mình cách nhau vài dòng. Một cái thước canh cho một lời hứa sai thì nó
    đang giữ cái sai đứng yên.
    Nay canh đúng ý định ban đầu: trang vẫn phải nói kỳ áp cho cái gì, nhưng KHÔNG được hứa quá
    tay. `_checkaudit` M18 canh vế còn lại - bảng nào không lọc theo kỳ thì phải tự khai mốc. */
 t("noi ro ky so lieu ap cho cai gi", h.indexOf("Kỳ này áp cho các chỉ số KPI bên dưới")>=0);
 t("khong hua qua tay rang ky ap cho TOAN BO", h.indexOf("áp cho TOÀN BỘ chỉ số")<0);})();

/* --- 9. hien thi 3 tang --- */
(function(){var h=kpiSection();
 t("tang 1: nhan 5 muc thay cham nhi phan", h.indexOf("kpisev")>=0);
 t("tang 2: co dong nhan xet hien san cho chi so chua dat", h.indexOf("kpisay")>=0);
 t("tang 3: bam vao bung chi tiet", h.indexOf("kpiOpen(")>=0);})();

console.log(bad.length?("CHECK13 FAIL ("+bad.length+"):\n  "+bad.slice(0,25).join("\n  ")):"CHECK13 OK: "+ok+" tieu chi");
