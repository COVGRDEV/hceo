function ingresar(){if(trim(document.getElementById("txt_usuario").value).length<=4){alert("Debe ingresar un nombre de usuario v?lido.");document.getElementById("txt_usuario").focus();return;}if(trim(document.getElementById("txt_contrasena").value).length<=4){alert("Debe ingresar una contrase?a v?lida.");document.getElementById("txt_contrasena").focus();return;}document.getElementById("btn_ingresar").disabled=true;document.getElementById("hdd_ingresar").value=1;document.getElementById("frm_ingreso").submit();};function oprimirEnter(_1,_2){var _3=0;if(_1.keyCode){_3=_1.keyCode;}else{if(_1.which){_3=_1.which;}else{return false;}}if(_3==13){switch(_2){case 1:document.getElementById("txt_contrasena").focus();break;case 2:ingresar();break;}}return true;};