/* _checkdem.js - SỐ TRÊN THẺ PHẢI TÌM ĐƯỢC Ở DANH SÁCH.
 *
 * HAI LẦN TRONG HAI NGÀY anh Luân bắt đúng một bệnh, ở hai chỗ khác nhau:
 *   06/08 - *"em đang dùng mấy cái icon cảnh báo khá ổn, nhưng a chưa thấy em gắn nó vào các
 *            buổi... 2 buổi quá hạn chưa nhận xét, nhưng a nhìn xuống buổi, a ko thấy icon nên
 *            a ko biết chỗ nào."*
 *   07/08 - *"tương tự trường hợp lúc nãy, báo 2 học viên nguy cơ mà a chẳng thấy đâu."*
 *
 * GỐC CHUNG: cái THẺ và cái BẢNG hỏi HAI HÀM KHÁC NHAU cho cùng một câu hỏi.
 *   · Thẻ "HV nguy cơ" đếm bằng `stuRisk()` = cờ NGƯỜI GẮN **hoặc** MÁY THẤY vượt ngưỡng
 *     (vắng không phép >= thresholdAtRisk_absences, thiếu bài >= thresholdAtRisk_hw_missing),
 *     trừ những em học vụ đã tạm gạt có lý do.
 *   · Bảng "Học viên trong lớp" đọc THẲNG hai cột trạng thái - chỉ thấy cờ người gắn.
 *   Em nào máy thấy mà chưa ai gắn cờ thì vào THẺ mà không vào BẢNG. Thẻ ghi 2, bảng mười dòng
 *   "Ổn định". Con số không sai - cái sai là NÓ KHÔNG DẪN TỚI ĐÂU.
 *
 * VÌ SAO PHẢI CÓ BỘ KIỂM CHỨ KHÔNG CHỈ VÁ: loại lỗi này KHÔNG hiện ra khi đọc mã. Cả hai vế
 * đều là mã đúng, chạy đúng, không lỗi JS, không đỏ bộ kiểm nào. Nó chỉ lộ ra khi có người ngồi
 * xuống, đọc con số rồi đưa mắt xuống tìm - đúng việc anh Luân làm hai lần. Máy phải làm thay.
 *
 * ĐO: mở Chromium thật, đăng nhập bằng người có phạm vi rộng, đi qua TỪNG LỚP:
 *   D1  Thẻ "HV nguy cơ" của lớp  ==  số dòng mang chip "Nguy cơ" ở tab Học viên
 *   D2  Thẻ "Buổi quá hạn chưa nhận xét"  ==  số chip buổi mang dấu cảnh báo `.swarn`
 *   D3  Thẻ "Buổi chưa điểm danh"  ==  số buổi đã dạy xong mà không có dòng điểm danh nào
 *   D4  Mỗi dòng "Nguy cơ" phải NÓI ĐƯỢC VÌ SAO (có data-tip) - chỉ ra chỗ thôi chưa đủ,
 *       người đọc còn phải biết nên tin cờ người gắn hay số máy đếm.
 *
 * ĐÃ THỬ NGƯỢC TRÊN BẢN CŨ (luật của dự án - bộ kiểm mới phải ĐỎ trên bản đang lỗi trước khi
 * được tin): bản trước khi vá, D1 đỏ ở các lớp có em bị máy thấy mà chưa ai gắn cờ.
 *
 * Chạy: ITTS_OUT=<out> node _checkdem.js
 */
const OUT=process.env.O||process.env.ITTS_OUT||".", F=process.env.F||"/ITTs_WebApp_v5_demo.html";
const PATHS=["/opt/pw-browsers/chromium-1194/chrome-linux/chrome","/opt/pw-browsers/chromium/chrome-linux/chrome"];
(async()=>{
 let chromium; try{chromium=require("playwright").chromium}catch(e){console.log("CHECKDEM BO QUA: chua cai playwright");process.exit(0)}
 const fs=require("fs"),path=require("path");
 const exe=PATHS.find(p=>{try{return fs.existsSync(p)}catch(e){return false}});
 let b; try{b=await chromium.launch(exe?{executablePath:exe}:{})}
 catch(e){console.log("CHECKDEM BO QUA: khong mo duoc Chromium");process.exit(0)}
 const ctx=await b.newContext({viewport:{width:1600,height:1000}});
 const page=await ctx.newPage();
 await page.addInitScript(()=>{try{localStorage.setItem("ITTS_HELLO_V1","1");localStorage.setItem("ITTS_ZOOM_V1","100")}catch(e){}});
 await page.goto("file://"+path.resolve(OUT)+F,{waitUntil:"load"});
 await page.waitForFunction(()=>typeof window.go==="function",null,{timeout:30000});

 const kq=await page.evaluate(()=>{
  const xau=[]; let ok=0;
  function t(ten,dieu){if(dieu)ok++;else xau.push(ten)}
  /* Đăng nhập bằng người thấy rộng nhất - bộ này soi SỰ KHỚP giữa hai chỗ trên cùng một màn,
     không soi phân quyền, nên phạm vi càng rộng càng nhiều lớp được soi. */
  const S=(DL.DL01||[]).filter(s=>/ceo|aca_manager/.test(String(s.role)))[0];
  if(!S)return {ok:0,xau:["khong tim duoc nguoi de dang nhap"],lop:0};
  window.GATE_SID=S.staff_id; applyScope(S.staff_id); setRole("all");

  /* Con số trên thẻ: đọc từ DOM chứ không tính lại. Tính lại bằng cùng công thức là tự chứng
     minh mình đúng - phải đọc đúng thứ người dùng nhìn thấy. */
  function theSo(el,nhan){
   const o=[...el.querySelectorAll(".bstat")].find(x=>(x.querySelector(".bsl")||{}).textContent&&
     (x.querySelector(".bsl").textContent||"").indexOf(nhan)===0);
   if(!o)return null;
   const v=(o.querySelector(".bsn")||{}).textContent||"";
   const n=parseInt(String(v).replace(/[^0-9\-]/g,""),10);
   return isNaN(n)?null:n}

  const lops=(DL.DL10||[]).map(c=>c.class_id).filter(Boolean);
  let soLop=0;
  lops.forEach(cid=>{
   /* --- tab Học viên: thẻ HV nguy cơ vs số dòng mang chip Nguy cơ --- */
   window.BLCLASS=cid; window.BLTAB="hocvien"; go("banglop");
   const el=document.getElementById("content"); if(!el)return;
   soLop++;
   const theRisk=theSo(el,"HV nguy cơ");
   const dong=[...el.querySelectorAll("table.dt tbody tr")]
     .filter(tr=>[...tr.querySelectorAll(".chip")].some(c=>/^Nguy cơ$/.test((c.textContent||"").trim())));
   if(theRisk!=null)
    t("D1 "+cid+": the ghi "+theRisk+" HV nguy co nhung bang chi co "+dong.length+" dong",theRisk===dong.length);
   /* D4 - mỗi dòng nguy cơ phải nói được vì sao */
   dong.forEach(tr=>{
    const c=[...tr.querySelectorAll(".chip")].find(x=>/^Nguy cơ$/.test((x.textContent||"").trim()));
    const ma=(tr.querySelector("td")||{}).textContent||"?";
    t("D4 "+cid+" "+ma+": chip Nguy co khong noi duoc vi sao (thieu data-tip)",
      !!(c&&(c.getAttribute("data-tip")||"").trim()))});

   /* --- tab Buổi học: thẻ đếm vs dấu cảnh báo trên chip buổi --- */
   window.BLTAB="buoi"; go("banglop");
   const e2=document.getElementById("content"); if(!e2)return;
   const theNX=theSo(e2,"Buổi quá hạn chưa nhận xét");
   const theDD=theSo(e2,"Buổi chưa điểm danh");
   /* Dấu cảnh báo `.swarn` gắn trên chip buổi. Một chip có thể nợ cả hai việc nhưng chỉ mang
      MỘT dấu - nên so tổng thì phải so với số buổi CÓ ÍT NHẤT MỘT nợ, không cộng hai thẻ. */
   const chip=[...e2.querySelectorAll(".sespill")];
   const coDau=chip.filter(x=>x.querySelector(".swarn")).length;
   const ses=(DL.DL11||[]).filter(x=>x.class_id===cid);
   const noThat=ses.filter(x=>{
    const st=bhState(x);
    const dd=(DL.DL12||[]).some(a=>a.session_id===x.session_id);
    return st.noteOver||(st.done&&!dd)}).length;
   if(chip.length)
    t("D2 "+cid+": "+noThat+" buoi con no viec nhung chi "+coDau+" chip mang dau canh bao",coDau===noThat);
   if(theNX!=null&&theDD!=null&&chip.length)
    t("D3 "+cid+": the ghi "+theNX+" no nhan xet + "+theDD+" chua diem danh, ma so chip mang dau la "+coDau,
      coDau>=Math.max(theNX,theDD));
  });
  /* ═══ D5 - HAI HUY HIEU TREN MOT VIEN BUOI ══════════════════════════════════════════════
     Anh Luan 07/08: *"1 buoi co 2 canh bao thi gan ca 2 icon."* App lam duoc, nhung DEMO khong
     buoi nao no ca hai cung luc, nen nhanh hai huy hieu khong co cho hien ra.
     LUC DAU em GIEO mot buoi nhu vay vao du lieu demo - SAI. "Buoi da day qua 24h ma khong
     diem danh" la LOI DU LIEU THAT, `_checkdata` va man Suc khoe du lieu deu bat dung; gieo no
     vao la lam ban bo demo de khoe mot tinh nang. Bo demo phai sach.
     Cho dung cua ca do la O DAY: bo kiem TU DUNG ca trong bo nho, do xong thi tra lai. Du lieu
     that khong bi dung toi, ma tinh nang van co nguoi canh. */
  (function(){
   var s=(DL.DL11||[]).filter(function(x){var st=bhState(x);return st.done&&st.noteOver})[0];
   if(!s){xau.push("D5: khong tim duoc buoi qua han nhan xet nao de dung ca hai huy hieu");return}
   var giu=(DL.DL12||[]).filter(function(a){return String(a.session_id)===String(s.session_id)});
   for(var i=DL.DL12.length-1;i>=0;i--)if(String(DL.DL12[i].session_id)===String(s.session_id))DL.DL12.splice(i,1);
   window.BLCLASS=s.class_id; window.BLTAB="buoi"; go("banglop");
   var el=document.getElementById("content");
   var idx=(ddSessions(s.class_id)||[]).map(function(x){return x.session_id}).indexOf(s.session_id);
   var chip=[...el.querySelectorAll(".sespill")][idx];
   var w=chip?[...chip.querySelectorAll(".swarn")]:[];
   t("D5 buoi no ca hai viec phai deo DUNG HAI huy hieu (dang co "+w.length+")", w.length===2);
   var ics=w.map(function(x){var i2=x.querySelector("i");return i2?i2.className:""}).join(" ");
   t("D5 hai huy hieu phai dung DUNG bieu tuong cua o dem (ti-writing + ti-checkbox), dang co: "+ics,
     /ti-writing/.test(ics)&&/ti-checkbox/.test(ics));
   t("D5 moi huy hieu phai noi duoc vi sao (data-tip)",
     w.length>0&&w.every(function(x){return (x.getAttribute("data-tip")||"").trim().length>10}));
   DL.DL12.push.apply(DL.DL12,giu);   /* tra lai du lieu - do xong khong duoc de lai dau vet */
  })();
  return {ok:ok,xau:xau,lop:soLop}});

 await b.close();
 if(kq.xau.length){
  console.log("CHECKDEM DO ("+kq.xau.length+"/"+(kq.ok+kq.xau.length)+"):");
  kq.xau.slice(0,12).forEach(x=>console.log("  - "+x));
  if(kq.xau.length>12)console.log("  ... con "+(kq.xau.length-12));
  process.exit(1)}
 console.log("CHECKDEM OK: "+kq.ok+" tieu chi tren "+kq.lop+" lop - moi con so tren the deu tim duoc dau vet o danh sach ngay duoi");
})();
