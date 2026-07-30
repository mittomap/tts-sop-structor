/* Probe cho check_sop.py PHAN 5+6: VE THAT moi trang roi soi xem 12 man VH va 9 bang BC cua SOP
   co mat trong app khong. Khong soi ma nguon - soi ma nguon chi biet "co viet".
   File nay do check_sop.py goi; chay tay cung duoc: ITTS_OUT=<out> node _probe_vhbc.js */
var fs = require('fs');
function El(id){return {id:id||"",innerHTML:"",textContent:"",value:"",checked:false,
 style:{setProperty(){},removeProperty(){}},offsetHeight:200,offsetWidth:120,offsetTop:0,scrollTop:0,
 classList:{add(){},remove(){},contains(){return false},toggle(){return false}},
 querySelector(){return El()},querySelectorAll(){return []},getAttribute(){return ""},setAttribute(){},
 appendChild(){},remove(){},focus(){},addEventListener(){},setSelectionRange(){},
 getBoundingClientRect(){return{left:0,top:0,width:9,height:9,bottom:9,right:9}},files:[]}}
var ST={};
global.document={getElementById:function(id){return ST[id]||(ST[id]=El(id))},querySelector:function(){return El()},
 querySelectorAll:function(){return []},createElement:function(){return El()},body:El(),addEventListener:function(){}};
global.window=global;global.location={hash:"",search:"",pathname:"/cong-nhan-vien/"};
global.history={replaceState:function(){}};
var _LS={};global.localStorage={getItem:function(k){return _LS[k]===undefined?null:_LS[k]},
 setItem:function(k,v){_LS[k]=String(v)},removeItem:function(k){delete _LS[k]}};
global.sessionStorage={getItem:function(){return null},setItem:function(){},removeItem:function(){}};
require('vm').runInThisContext(fs.readFileSync(__dirname + '/_APP.js', 'utf8'));
setRole("all");
try{cfEnsure();rtEnsure()}catch(e){}

/* ve MOI trang custom, MOI tab cua moi hub, va MOI danh sach */
var TABS={
 hoctap:["HTTAB",["today","lichtuan","gvdp","phong","lop","buoihoc","wow"]],
 tuyensinh:["TSTAB",["lead","test","tuvan","thanhtoan","reup"]],
 cskh:["CSTAB",["khaosat","phanhoi","khieunai"]],
 khac:["KTAB",["baoluu","magioithieu"]],
 duyet:["DUYTAB",["duyetck","duyethoan","duyetnghi","duyetthu","duyetgiao","banggiao"]],
 dsthanhtoan:["STTAB",["da","du","cong"]],
 settings:["SETTAB",setTabs().map(function(t){return t[0]})],
 giaoan:["GATAB",["ga","kho"]],banlam:["BLVIEW",["list","board"]],
 giaoviec:["TKTAB",["mine","given","report"]],
 chang:["ARC",["changA","changB","changC","changD"]]};
var HTML={};
Object.keys(RENDER).forEach(function(k){
 var T=TABS[k];
 if(T){T[1].forEach(function(tb){window[T[0]]=tb;try{HTML[k+"#"+tb]=RENDER[k]()}catch(e){}});window[T[0]]=undefined}
 try{HTML[k]=RENDER[k]()}catch(e){}});
Object.keys(LISTCFG).forEach(function(k){try{HTML["ds:"+k]=renderList(k)}catch(e){}});
/* bang viec theo chuc danh chi hien o trang dap cua tung vai - dong vai tung nguoi roi ve */
(function(){var seen={};
 DATA.dl.DL01.forEach(function(x){
  if(!/active|working/.test(String(x.status||"")))return;
  window.GATE_SID=x.staff_id;setRole("all");applyScope(x.staff_id);
  var rs=SCOPE(),key=rs.group+(rs.mgr?"_mgr":"");
  if(seen[key])return;seen[key]=1;
  var L=(typeof BVLAND!=="undefined")&&BVLAND[rs.group];if(!L)return;
  CUR=L[0];
  if(L[1]){if(L[0]==="tuyensinh")window.TSTAB=L[1];if(L[0]==="hoctap")window.HTTAB=L[1]}
  try{HTML["bv:"+key]=bangViecHTML()}catch(e){}});
 window.GATE_SID="";setRole("all");applyScope("")})();

var ALL=Object.keys(HTML).map(function(k){return HTML[k]}).join("\n");
var spec=JSON.parse(fs.readFileSync(process.argv[2],'utf8'));
var thieu=[];
Object.keys(spec).forEach(function(ma){
 var can=spec[ma].can||[];
 var hut=can.filter(function(t){return ALL.indexOf(t)<0});
 if(hut.length)thieu.push(ma+" ["+spec[ma].t+"] khong thay: "+hut.join(" / "));
});
console.log("VHBC "+(thieu.length?thieu.join(" || "):"DU"));
