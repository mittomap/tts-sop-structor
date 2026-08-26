/* _check15: MOT HANH DONG - MAY CUA VAO.
   Ly do co bo kiem nay: ca hai hoi dong tham dinh deu DOC TUNG DUONG, ma lop loi nguy hiem
   nhat lai nam o KHOANG GIUA hai duong (moi duong doc rieng deu hop ly, dat canh nhau moi sai).
   Vi du that: wowAddSave tru quota NGAY LUC DAT, hvWowSave chi tru khi DA DAY - khong ham nao
   sai mot minh. Bo kiem nay lam hai viec may lam duoc con nguoi doc thi khong:
   (1) KIEM KE moi ham ghi vao tung bang, bao do khi co cua ghi MOI chua khai;
   (2) kiem BAT BIEN nghiep vu - dung du duong nao ghi cung phai thoa.
   Chay: ITTS_OUT=<out> node _check15.js */
var FIELDS={};
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:(FIELDS[id]||""),checked:!!FIELDS["chk_"+id],style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},offsetHeight:200,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
global.document={getElementById:(id)=>El(id),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
var SRC=require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8');
require('vm').runInThisContext(SRC);
setRole("all");
var bad=[],ok=0;
function t(n,c){if(c)ok++;else bad.push(n)}
function setF(o){FIELDS=o} function reset(){__actT={}}

/* ============ 1. KIEM KE CUA GHI ============ */
var funcs=[];var re=/\nfunction ([A-Za-z0-9_]+)\s*\(/g,m;
while((m=re.exec(SRC)))funcs.push([m.index,m[1]]);
funcs.push([SRC.length,"__END__"]);
var WRITE=/(?:jSaveRow|jUpdRow|markRow|apiSave|apiUpdate)\(\s*"(DL[0-9]+b?)"|DL\.(DL[0-9]+b?)\s*(?:=|\.push|\.unshift)|rows\(\s*"(DL[0-9]+b?)"\s*\)\.(?:push|unshift)/g;
var by={};
for(var i=0;i<funcs.length-1;i++){
 var body=SRC.slice(funcs[i][0],funcs[i+1][0]),w;WRITE.lastIndex=0;
 while((w=WRITE.exec(body))){var tb=w[1]||w[2]||w[3];(by[tb]=by[tb]||{})[funcs[i][1]]=1}}
/* Ban khai: cua ghi DA BIET cua tung bang. Them mot ham ghi moi ma quen khai -> BAO DO,
   buoc nguoi viet doi chieu lai voi cac cua san co xem co lech luat khong. */
/* Ban khai nay GIO NAM TRONG APP (bien DOORTB, sinh luc build tu gen_v5.py) - app can no de tu
   ghi nhat ky thao tac, nen no phai la ban khai THAT chu khong phai ban chep rieng cua bo kiem.
   Truoc day cho nay giu mot ban chep: sua app ma quen sua ban chep thi bo kiem van xanh. */
var KHAI=(function(){var o={};
 Object.keys(DOORTB||{}).forEach(function(fn){(DOORTB[fn]||[]).forEach(function(tb){(o[tb]=o[tb]||[]).push(fn)})});
 return o})();
/* ═══ 26/08 - KHÔNG HAI HÀM NÀO ĐƯỢC TRÙNG TÊN ═══════════════════════════════════════════════
   Bẫy vừa cắn hôm nay: trang Hóa đơn mới đặt tên `hdList`, mà `hdList` ĐÃ CÓ - nó là danh sách
   hợp đồng cam kết đầu ra (DL30). JavaScript không kêu một tiếng: hàm khai sau đè hàm khai
   trước. Hậu quả thấy được là màn "Duyệt hợp đồng cam kết" vẽ 12 thẻ trống rỗng; hậu quả KHÔNG
   thấy được là `hdChanXepLop` - cửa chặn xếp lớp khi hợp đồng chưa đủ chữ ký - cũng đọc cùng
   hàm ấy, tức một luật nghiệp vụ bị vô hiệu mà không có gì báo.
   *Một cái tên trùng trong JavaScript không gây lỗi - nó gây một app khác.*
   Bộ này đã dựng sẵn bảng `funcs` (mọi hàm khai ở tầng ngoài cùng) nên luật chỉ tốn ba dòng.
   Đây là loại luật mà giá của nó bằng không còn cái nó chặn thì không có cách nào tự lộ ra. */
(function(){
 var dem={},trung=[];
 funcs.forEach(function(f){if(f[1]==="__END__")return;
  dem[f[1]]=(dem[f[1]]||0)+1;if(dem[f[1]]===2)trung.push(f[1])});
 if(trung.length)bad.push("  ham trung ten (khai sau de khai truoc): "+trung.join(", "));
 t("khong hai ham nao trung ten"+(trung.length?" ("+trung.length+")":""), trung.length===0)})();
t("app co ban khai cua ghi DOORTB (de tu ghi nhat ky)", Object.keys(KHAI).length>15);
t("moi ham trong ban khai cua ghi deu ton tai trong app", (function(){
 var thieu=Object.keys(DOORTB||{}).filter(function(f){return typeof global[f]!=="function"});
 if(thieu.length)bad.push("  ham khai ma khong co: "+thieu.join(", "));
 return thieu.length===0})());
Object.keys(by).forEach(function(tb){
 var have=Object.keys(by[tb]).sort();
 var khai=KHAI[tb]||[];
 var moi=have.filter(function(f){return khai.indexOf(f)<0});
 t("bang "+tb+" khong co cua ghi MOI chua khai"+(moi.length?" ("+moi.join(", ")+")":""), moi.length===0);
});
console.log("KIEM KE: "+Object.keys(by).length+" bang | tong "+
 Object.keys(by).reduce(function(a,k){return a+Object.keys(by[k]).length},0)+" cua ghi | nhieu nhat: "+
 Object.keys(by).sort(function(a,b){return Object.keys(by[b]).length-Object.keys(by[a]).length}).slice(0,3)
  .map(function(k){return k+"("+Object.keys(by[k]).length+")"}).join(" "));

/* ============ 2. BAT BIEN NGHIEP VU - dung du duong nao ghi ============ */
function invQuota(){   /* da tru luot WOW <=> buoi DA DAY hoac HV KHONG DEN */
 return rows("DL14").filter(function(w){
  var ded=String(w.quota_deducted||"").toLowerCase()==="yes";
  var real=isc(w.wow_status,"completed","no_show");
  return ded!==real}).map(function(w){return w.wow_id+"("+ecode(w.wow_status)+"/"+w.quota_deducted+")"})}
t("BAT BIEN: da tru luot WOW <=> buoi da dien ra (tren du lieu dang co)", invQuota().length===0);

/* Lai TUNG CUA dat WOW roi kiem lai chinh bat bien do - day la cho hai hoi dong deu hut */
(function(){
 var S=rows("DL09").filter(function(x){return num(x.wow_quota_remaining)>1})[0];
 if(!S){bad.push("khong co HV con luot WOW de lai thu");return}
 /* 10/08 - HAI CUA NAY NAY DEU DI QUA CA TRUC (DL26), khong con go ngay/gio tu do. Phep lai
    phai lai dung duong nguoi dung di: khong co ca thi ca hai cua deu tu choi ngay tu dong dau,
    va moi tieu chi phia sau se xanh VI KHONG CO GI XAY RA - dung cai kieu xanh vo nghia. */
 /* 11/08 - hai cửa nay CHẶT KHÁC NHAU (bám OLMS): học viên phải đặt trước `wowBookLeadDays`
    ngày và chỉ xem trước `wowWeeksAhead` tuần; học vụ đặt hộ thì không bị hạn ấy. Nên phép lái
    phải lấy ô bằng ĐÚNG luật của người mình đang đóng vai - không thì thước tự dựng một tình
    huống không có thật rồi chấm app sai. */
 function caRanh(hv){return rows("DL26").filter(function(x){return lwRanh(x,null,hv)})[0]}
 var ca1=caRanh(true);
 if(!ca1){bad.push("khong co ca truc WOW con trong de lai thu (luat hoc vien)");return}
 /* cua 1: hoc vien tu dat qua cong */
 window.HVID=S.student_id;
 var n0=rows("DL14").length;
 reset();setF({hvw_skill:"Speaking (Nói)",hvw_slot:ca1.slot_id,hvw_focus:"Part 2"});
 hvWowSave();
 var w1=rows("DL14")[0];
 t("cua CONG HOC VIEN: dat xong CHUA tru luot", rows("DL14").length===n0+1&&String(w1.quota_deducted).toLowerCase()==="no");
 /* cua 2: nhan vien dat ho - phai la CA KHAC, vi ca vua roi da bi cua 1 chiem */
 var ca2=caRanh(false);
 if(!ca2){bad.push("khong con ca truc thu hai de lai cua nhan vien");return}
 reset();setF({wa_stu:S.student_id,wa_skill:"Writing (Viết)",wa_type:"academic_support (Hỗ trợ học thuật)",
  wa_slot:ca2.slot_id,wa_focus:"Task 2",wa_by:"academic_hv (Học vụ)",wa_why:"Em nay Writing yeu nhat"});
 var n1=rows("DL14").length;
 wowAddSave(true);
 var w2=rows("DL14")[0];
 t("cua NHAN VIEN: dat xong CHUA tru luot (bang voi cua cong)", rows("DL14").length===n1+1&&String(w2.quota_deducted).toLowerCase()==="no");
 t("HAI CUA ghi giong nhau o cot quota_deducted", String(w1.quota_deducted)===String(w2.quota_deducted));
 /* BAT BIEN GIUA HAI CUA (dung ho loi ma bo kiem nay sinh ra de canh): mot ca truc chi de duoc
    MOT buoi. Ca cua nao quen danh dau ca thi ca do nhan tiep nguoi thu hai ma khong ai hay. */
 t("cua CONG: dat xong thi ca truc bi danh dau va khong con nhan nguoi khac",
   isc(ca1.wow_slot_status,"booked")&&ca1.wow_id===w1.wow_id&&!lwRanh(ca1));
 t("cua NHAN VIEN: dat xong thi ca truc bi danh dau va khong con nhan nguoi khac",
   isc(ca2.wow_slot_status,"booked")&&ca2.wow_id===w2.wow_id&&!lwRanh(ca2));
 t("HAI CUA khong the roi vao cung mot ca", ca1.slot_id!==ca2.slot_id);
 t("HAI CUA deu lay GIO tu ca truc, khong tu dat gio",
   String(w1.wow_session_date||"")===String(ca1.slot_datetime||"")&&
   String(w2.wow_session_date||"")===String(ca2.slot_datetime||""));
 t("cua NHAN VIEN bat ghi VI SAO can buoi nay", !!String(w2.notes||"").trim());
 t("cua NHAN VIEN bat ghi TRONG TAM buoi", !!String(w2.wow_content_focus||"").trim());
 t("ca hai cua deu ghi NGUOI DAT", !!String(w1.wow_booked_by||"").trim()&&!!String(w2.wow_booked_by||"").trim());
 /* danh dau da day -> luc nay moi duoc tru, va bam lai khong tru them */
 var used0=num(find("DL09","student_id",S.student_id).wow_quota_used);
 wowTaught(w2.wow_id);
 var used1=num(find("DL09","student_id",S.student_id).wow_quota_used);
 t("tru luot DUNG LUC danh dau da day", used1===used0+1&&String(find("DL14","wow_id",w2.wow_id).quota_deducted).toLowerCase()==="yes");
 wowTaught(w2.wow_id);
 t("bam lai KHONG tru them lan nua", num(find("DL09","student_id",S.student_id).wow_quota_used)===used1);
 /* HV khong den cung tru theo chinh sach */
 var used2=num(find("DL09","student_id",S.student_id).wow_quota_used);
 wowNoShow(w1.wow_id);
 t("HV khong den cung tru luot theo chinh sach", num(find("DL09","student_id",S.student_id).wow_quota_used)===used2+1);
 t("BAT BIEN van dung sau khi lai het cac cua", invQuota().length===0);
})();

/* ============ 2b. LAI THU CUA DANG KY CA TRUC (lwSave) ============
   VI SAO PHAI CO KHUC NAY - mot bai hoc dat 10/08: `lwSave` goi `fmtD()`, ma `fmtD` la ham CUC
   BO nam trong mot ham khac, khong phai ham toan cuc. Tuc **bam Luu la nem ReferenceError**,
   cua dang ky ca truc CHET tu luc sinh ra. Ba vong verify tron bo di qua ma khong bo nao kip.
   Vi sao khong ai thay: `_check15` truoc day chi DIEM DANH cua ghi bang cach doc ma nguon roi
   doi khai ten - doc ten thi khong bao gio biet than ham co chay duoc hay khong; con bo kiem
   trinh duyet thi khong mo cai ngan keo ay ra.
   *Diem danh mot cai cua khong phai la thu mo no.* Nay lai that. */
(function(){
 var nv=rows("DL01").filter(function(x){return /^wow/.test(ecode(x.role))&&isc(x.status,"active")})[0];
 if(!nv){bad.push("khong co NV WOW dang lam viec de lai cua dang ky ca");return}
 var cu=CURSTAFF;CURSTAFF=nv.staff_id;
 var n0=rows("DL26").length;
 var truocKhi={};rows("DL26").forEach(function(x){truocKhi[String(x.slot_id)]=1});
 function iso(n){var d=new Date(Date.now()+n*864e5);
  return d.getFullYear()+"-"+("0"+(d.getMonth()+1)).slice(-2)+"-"+("0"+d.getDate()).slice(-2)}
 reset();FIELDS={lw_tu:iso(40),lw_den:iso(41),lw_cs:"branch_cs1 (Cơ sở 1)",lw_note:"",chk_lw_g0:1};
 try{lwSave()}catch(e){bad.push("lwSave NEM LOI: "+e.message)}
 var them=rows("DL26").length-n0;
 t("cua DANG KY CA TRUC chay duoc va sinh ra ca that", them>0);
 /* TÌM Ô VỪA ĐĂNG KÝ BẰNG CÁCH SO TẬP TRƯỚC/SAU, đừng sắp theo `registered_at`: mốc ấy là chuỗi
    "dd/mm/yyyy HH:MM", mà sắp chuỗi kiểu đó thì "31/07" đứng trên "01/08" - thước sẽ vớ nhầm một
    ô cũ do pipeline sinh rồi chấm app sai. */
 var moi=rows("DL26").filter(function(x){return !truocKhi[String(x.slot_id)]})[0];
 /* Ca vua dang ky phai DUNG DINH DANG voi ca do pipeline sinh, khong thi luoi va bang tong
    nhin thay hai kieu du lieu khac nhau tren cung mot bang. */
 var mau=rows("DL26").filter(function(x){return x!==moi&&String(x.slot_date||"").trim()})[0];
 if(moi&&mau)t("ca moi dang ky ghi ngay dung dinh dang voi ca co san",
   String(moi.slot_date||"").length===String(mau.slot_date||"").length);
 if(moi)t("ca moi dang ky mac dinh la CON TRONG", isc(moi.wow_slot_status,"available")&&!String(moi.wow_id||"").trim());
 if(moi)t("ca moi dang ky roi dung mot khung gio cua luoi", lwKhung().indexOf(String(moi.slot_time||""))>=0);
 if(moi)t("ca moi dang ky dai dung bang do dai o dang cau hinh", (function(){
   var d=pvnd(moi.slot_datetime);return !!d&&(d.getHours()*60+d.getMinutes())%lwDaiO()===0})());
 /* dang ky lai DUNG KHOANG DO thi khong duoc nhan doi */
 var n1=rows("DL26").length;
 reset();FIELDS={lw_tu:iso(40),lw_den:iso(41),lw_cs:"branch_cs1 (Cơ sở 1)",lw_note:"",chk_lw_g0:1};
 try{lwSave()}catch(e){bad.push("lwSave lan hai NEM LOI: "+e.message)}
 t("dang ky lai cung khung do KHONG nhan doi ca", rows("DL26").length===n1);
 CURSTAFF=cu;
})();

/* ============ 3. BAT BIEN TIEN ============ */
t("BAT BIEN: con lai = hoc phi - da dong (moi don chua huy)",
  rows("DL06").filter(function(e){return !isc(e.enrollment_status,"cancelled")&&
   Math.abs(num(e.final_fee)-num(e.paid_amount)-num(e.remaining_amount))>1}).length===0);
t("BAT BIEN: don con no thi PHAI co hen thu",
  rows("DL06").filter(function(e){return isc(e.enrollment_status,"confirmed")&&num(e.remaining_amount)>0&&
   !String(e.next_payment_due||"").trim()}).length===0);
t("BAT BIEN: khong don nao dong THUA",
  rows("DL06").filter(function(e){return num(e.paid_amount)>num(e.final_fee)+1}).length===0);
t("BAT BIEN: cong hoc vien KHONG BAO GIO tu ghi phieu thu",
  !/function hvPaidNotifySave[\s\S]{0,1400}?(jSaveRow\("DL07"|DL\.DL07|rows\("DL07"\)\.)/.test(SRC));

console.log(bad.length?("CHECK15 FAIL ("+bad.length+"):\n  "+bad.join("\n  ")):"CHECK15 OK: "+ok+" tieu chi");
