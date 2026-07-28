// harness kiem TOUR: bat moi loi nem ra khi mo menu huong dan va khi chay tung buoc
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,style:{},offsetHeight:230,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},getBoundingClientRect(){return {left:10,top:10,width:100,height:30,bottom:40,right:110}},files:[]}}
var STORE={};
global.document={getElementById:(id)=>STORE[id]||(STORE[id]=El(id)),querySelector:()=>El(),querySelectorAll:()=>[],
 createElement:()=>El(),body:El("body"),addEventListener(){}};
global.window=global;global.location={hash:""};
global.localStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.sessionStorage={getItem:()=>null,setItem(){},removeItem(){}};
global.innerWidth=1400;global.innerHeight=900;
require('vm').runInThisContext(require('fs').readFileSync('./_APP.js','utf8'));
setRole("all");
var bad=[];
// 1. mo menu cap do
try{ tourMenu(); var body=STORE["drawerBody"]?STORE["drawerBody"].innerHTML:"";
  if(!body||body.length<50) bad.push("tourMenu() khong sinh noi dung menu cap do");
  else{ var n=(body.match(/tourMenu\('/g)||[]).length; if(n<3) bad.push("menu chi co "+n+" cap do"); }
}catch(e){ bad.push("tourMenu() NEM LOI: "+e.message) }
// 2. mo tung cap do
try{ (typeof TOURLV!=="undefined"?TOURLV:[]).forEach(function(V){ tourMenu(V[0]); }); }
catch(e){ bad.push("tourMenu(capdo) NEM LOI: "+e.message) }
// 3. man xac nhan + chay het moi buoc cua MOI bai
var keys=Object.keys(typeof TOURS!=="undefined"?TOURS:{});
keys.forEach(function(k){
  try{ tourAsk(k) }catch(e){ bad.push("tourAsk("+k+") NEM LOI: "+e.message) }
  try{
    tourStart(k);
    var T=TOURS[k];
    for(var i=0;i<T.steps.length;i++){ TOUR.i=i; tourPaint(); }
    tourEnd();
  }catch(e){ bad.push("chay bai "+k+" NEM LOI: "+e.message) }
});
console.log("So bai huong dan:",keys.length,"| tong buoc:",keys.reduce((a,k)=>a+TOURS[k].steps.length,0));
console.log(bad.length?("TOUR FAIL:\n  "+bad.join("\n  ")):"TOUR OK: menu cap do + moi bai chay het buoc, 0 loi");
