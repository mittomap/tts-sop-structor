function El(){return {innerHTML:"",value:"",checked:false,style:{setProperty(){},removeProperty(){},getPropertyValue(){return ""}},classList:{add(){},remove(){},contains(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},appendChild(){},focus(){},addEventListener(){},files:[]}}
global.document={getElementById:()=>El(),querySelector:()=>El(),querySelectorAll:()=>[],createElement:()=>El(),body:El(),addEventListener(){}};
global.window=global;global.location={hash:""};global.localStorage={getItem:()=>null,setItem(){}};
require('vm').runInThisContext(require('fs').readFileSync((process.env.ITTS_APP||'./_APP.js'),'utf8'));
setRole("all");
var bad=[],n=0;
Object.keys(RENDER).forEach(function(k){n++;try{var o=RENDER[k]();
 if(typeof o!=="string"||o.length<40)bad.push(k+" (rong)");
 var a=(o.match(/<div/g)||[]).length,b=(o.match(/<\/div>/g)||[]).length;
 if(a!==b)bad.push(k+" lech div "+(a-b));
}catch(e){bad.push(k+": "+e.message)}});
console.log("Render",n,"trang |",bad.length?("LOI: "+bad.join(" | ")):"0 loi");
// icon dung nhung thieu trong font
var css=require('fs').readFileSync('tabler_inline.css','utf8');
var html=require('fs').readFileSync((process.env.ITTS_OUT||'.')+'/ITTs_WebApp_v5_demo.html','utf8');
var src=require('fs').readFileSync('gen_v5.py','utf8');
var used=new Set([].concat(
 (src.match(/ti ti-[a-z0-9-]+/g)||[]).map(s=>s.slice(3)),
 (src.match(/"ti-[a-z0-9-]+"/g)||[]).map(s=>s.replace(/"/g,""))));
var miss=[...used].filter(u=>css.indexOf("."+u+":before")<0);
console.log("Icon dung:",used.size,"| thieu trong font:",miss.length?miss.join(","):"khong");
/* V9.40: truoc day hai dong tren chi IN ra roi thoi - ma thoat luon bang 0. verify.sh cho khop
   chuoi "0 loi" (nam o dong tren) nen icon thieu KHONG BAO GIO lam bo kiem do. Da thu that:
   them 3 icon moi, harness in ro "thieu trong font: ti-radar,..." va bang tong ket van XANH HET.
   Mot bo kiem chi in ra ma khong can duoc la bo kiem gia. Nay no thoat khac 0. */
if(bad.length||miss.length)process.exit(1);
