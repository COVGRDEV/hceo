function mostrar_lista_tabla(){
var _1=$("#hdd_cant_examenes_op").val();
for(i=1;i<=_1;i++){
$("#tabla_diag_"+i).css("display","block");
}
};
function restar_tabla_examen(){
var _2=parseInt($("#hdd_cant_examenes_op").val(),10);
if(_2>1){
$("#tr_examen_"+(_2-1)).css("display","none");
$("#cmb_examen_"+(_2-1)).val("");
$("#d_archivo_examen_"+(_2-1)).html("");
$("#txt_observaciones_examen_"+(_2-1)).val("");
$("#hdd_cant_examenes_op").val(_2-1);
}
};
function agregar_tabla_examen(){
var _3=parseInt($("#hdd_cant_examenes_op").val(),10);
if(_3<20){
$("#tr_examen_"+(_3)).css("display","");
$("#hdd_cant_examenes_op").val(_3+1);
}
};
function obtener_extension_archivo(_4){
var _5=_4.substring(_4.lastIndexOf(".")+1).toLowerCase();
return _5;
};
function obtener_ruta_valida(_6){
var _7=$("#fil_arch_examen_"+_6).val();
var _8=obtener_extension_archivo(_7);
if(_8!="jpg"&&_8!="png"&&_8!="bmp"&&_8!="gif"&&_8!="pdf"){
_7="";
}
return _7;
};
function limpiar_bordes_examenes(){
var _9=parseInt($("#hdd_cant_examenes_op").val(),10);
for(var i=0;i<_9;i++){
$("#cmb_examen_"+i).css({"border":"1px solid rgba(0,0,0,.2)"});
$("#cmb_ojo_examen_"+i).css({"border":"1px solid rgba(0,0,0,.2)"});
$("#fil_arch_examen_"+i).css({"border":"1px solid rgba(0,0,0,.2)"});
}
};
function validar_archivos_examenes(){
var _a=true;
var _b=parseInt($("#hdd_cant_examenes_op").val(),10);
for(var i=0;i<_b;i++){
var _c=$("#fil_arch_examen_"+i).val();
if(_c!=""){
var _d=obtener_extension_archivo(_c);
if(_d!="jpg"&&_d!="png"&&_d!="bmp"&&_d!="gif"&&_d!="pdf"){
$("#fil_arch_examen_"+i).css({"border":"2px solid #FF002A"});
_a=false;
}
}
}
if(!_a){
alert("Los archivos a cargar deben ser im?genes o archivos pdf");
}
return _a;
};
function validar_examenes(){
limpiar_bordes_examenes();
var _e=true;
var _f=parseInt($("#hdd_cant_examenes_op").val(),10);
for(var i=0;i<_f;i++){
if($("#cmb_examen_"+i).val()==""){
$("#cmb_examen_"+i).css({"border":"2px solid #FF002A"});
_e=false;
}
if($("#cmb_ojo_examen_"+i).val()==""){
$("#cmb_ojo_examen_"+i).css({"border":"2px solid #FF002A"});
_e=false;
}
if($("#fil_arch_examen_"+i).val()==""&&$("#hdd_ruta_arch_examen_"+i).val()==""){
$("#fil_arch_examen_"+i).css({"border":"2px solid #FF002A"});
_e=false;
}
}
if(_e){
_e=validar_archivos_examenes();
}
return _e;
};
function subir_archivos(_10){
var _11=parseInt($("#hdd_cant_examenes_op").val(),10);
for(var i=0;i<_11;i++){
var _12=obtener_ruta_valida(i);
if(_12!=""){
$("#frm_arch_examen_"+i).submit();
if(_10){
document.getElementById("d_archivo_examen_"+i).innerHTML="";
cargar_archivo(i,3000);
}
}
}
};
function cargar_archivo(_13,_14){
var _15="opcion=2&id_hc="+$("#hdd_id_hc_consulta_"+_13).val()+"&id_examen="+$("#cmb_examen_"+_13).val()+"&id_ojo="+$("#cmb_ojo_examen_"+_13).val();
if(_14>0){
setTimeout(function(){
llamarAjax("../funciones/Class_Examenes_Op_ajax.php",_15,"d_archivo_examen_"+_13,"");
},_14);
}else{
llamarAjax("../funciones/Class_Examenes_Op_ajax.php",_15,"d_archivo_examen_"+_13,"");
}
};

