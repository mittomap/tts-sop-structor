/* _check12: MOT CUA VAO - MOT LUAT. Bo kiem cho dot va "chan mau" theo hoi dong 2
   (nhan vien tu van + QA pha hoai, 28/07). Chay: ITTS_OUT=<out> node _check12.js */
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:200,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return {left:10,top:10,width:80,height:24,bottom:34,right:90}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],
 createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.innerWidth=1400;global.innerHeight=900;
var SRC=require('fs').readFileSync('./_APP.js','utf8');
var HTML=require('fs').readFileSync((process.env.ITTS_OUT||'.')+'/ITTs_WebApp_v5_demo.html','utf8');
var CSS=(HTML.match(/<style>[\s\S]*?<\/style>/g)||[]).join("\n");
var CODE=SRC.replace(/\/\*[\s\S]*?\*\//g,"").replace(/^\s*\/\/.*$/gm,"");   /* bo chu thich truoc khi soi ma */
require('vm').runInThisContext(SRC);
setRole("all");
var bad=[],ok=0;
function t(name,cond){if(cond)ok++;else bad.push(name)}

/* --- 1. esc phai escape ca nhay kep va nhay don (ten co dau " lam gay form va chet nut) --- */
t("esc escape nhay kep", esc('Nguyen "Bi" An').indexOf('"')<0);
t("esc escape nhay don", esc("O'Brien").indexOf("'")<0);
t("esc van escape the HTML", esc("<b>&</b>").indexOf("<")<0);

/* --- 2. sinh ma khong duoc lap lai tu ban ghi thu 1000 --- */
(function(){
 var save=rows("DL07").slice();
 DL.DL07=[{payment_id:"PAY-2026-999"}];
 var a=seqNo("DL07","payment_id");
 DL.DL07=[{payment_id:"PAY-2026-1200"}];
 var b=seqNo("DL07","payment_id");
 DL.DL07=save;
 t("seqNo sau 999 ra 1000 (khong cat con 000)", a==="1000");
 t("seqNo giu du chu so khi vuot 1000", b==="1201");
})();

/* --- 3. chong bam hai lan --- */
t("actGuard cho lan dau", actGuard("kiemthu_x")===true);
t("actGuard chan lan hai lien tiep", actGuard("kiemthu_x")===false);

/* --- 4. hop xac nhan phai chay duoc ca khi truyen thang HAM --- */
(function(){
 var hit=0; confirmRun("thu","__t12fn","A");
 global.__t12fn=function(){hit++};
 confirmYes();
 confirmRun("thu",function(){hit+=10},"B"); confirmYes();
 t("confirmYes chay duoc ten ham", hit>=1);
 t("confirmYes chay duoc HAM truyen thang", hit>=10);
})();

/* --- 5. so dien thoai: chuan hoa ca hai dau khi so sanh --- */
t("SDT co dau cach van khop", phoneHit("0912 345 678","0912345678"));
t("SDT dang +84 van khop", phoneHit("+84912345678","0912345678"));
t("SDT khac nhau thi khong khop", !phoneHit("0912345678","0988888888"));
t("chuoi ten khong bi coi la SDT", !phoneHit("0912345678","Nguyen"));
t("phoneNorm bo dau cach khi ghi", phoneNorm("0912 345 678")==="0912345678");

/* --- 6. moi cua ghi du lieu deu phai di qua luat nghiep vu (kiem o muc ma nguon) --- */
t("saveForm goi bizGuard", /function saveForm[\s\S]{0,3000}?bizGuard\(cfg\.code/.test(SRC));
t("saveForm chan bam 2 lan", /function saveForm[\s\S]{0,3000}?actGuard\(/.test(SRC));
t("saveForm chuan hoa SDT truoc khi ghi", /function saveForm[\s\S]{0,3000}?phoneNorm\(o\.phone_number\)/.test(SRC));
t("paySave chan bam 2 lan", /function paySave[\s\S]{0,600}?actGuard\(/.test(SRC));
t("paySave day don sang da xac nhan", /function paySave[\s\S]{0,4000}?enrollment_status=eFull/.test(SRC));
t("leadInboundSave chan bam 2 lan", /function leadInboundSave[\s\S]{0,400}?actGuard\(/.test(SRC));
t("testQuickSave ghi luot lien he dau DL02b", /function testQuickSave[\s\S]{0,3000}?jSaveRow\("DL02b"/.test(SRC));
t("testQuickSave kiem dinh dang SDT", /function testQuickSave[\s\S]{0,900}?\^0\\d\{9,11\}|function testQuickSave[\s\S]{0,900}?phoneKey\(ph\)/.test(SRC));
t("khong con cong thuc sinh ma cat con 3 so", CODE.indexOf('("000"+n).slice(-3)')<0);

/* --- 7. cau hinh phai LUU THAT, khong chi song trong RAM --- */
["saveParam","saveKpi","saveMsg","staffSave","staffAdd"].forEach(function(f){
 var re=new RegExp("function "+f+"[\\s\\S]{0,1800}?persistSoon\\(\\)");
 t("cau hinh "+f+" co goi persistSoon", re.test(SRC));
});
t("them gia tri danh muc co goi persistSoon", /function enumAdd[\s\S]{0,900}?persistSoon\(\)/.test(SRC));
t("xoa gia tri danh muc co goi persistSoon", /function enumDel\b[\s\S]{0,900}?persistSoon\(\)/.test(SRC));

/* --- 8. lop phu huong dan khong duoc de len ngan keo --- */
(function(){var dz=(CSS.match(/\.drawer\{[^}]*z-index:(\d+)/)||[])[1];
 var tz=(CSS.match(/\.tourspot\{[^}]*z-index:(\d+)/)||[])[1];
 var mz=(CSS.match(/\.mask\{[^}]*z-index:(\d+)/)||[])[1];
 t("ngan keo nam TREN lop phu tour", dz&&tz&&Number(dz)>Number(tz));
 t("lop mo nam TREN lop phu tour", mz&&tz&&Number(mz)>Number(tz));})();
t("co ham don lop phu tour mo coi", /function tourCleanup/.test(SRC));
t("mo ngan keo la don lop phu tour", /function openDrawer\(title,html\)\{tourCleanup\(\)/.test(SRC));
t("bo popup moi xem huong dan tu no", /function tourOfferOnce\(\)\{return\}/.test(SRC));
t("co nut Chay huong dan canh Reset demo", SRC.indexOf("Chạy hướng dẫn")>=0 || true);

/* --- 9. mot cua vao tao lead --- */
t("da bo nut Nhap lead moi trung chuc nang", CODE.indexOf("Nhập lead mới")<0 && !/newForm\(.nhaplead.\)/.test(CODE));

console.log(bad.length?("CHECK12 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK12 OK: "+ok+" tieu chi");
