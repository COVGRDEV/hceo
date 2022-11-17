var captureKey = true;

function setupKeyCapture(){	
	//logger.append("setting up key captures on textInputs...", 8)
	inputs = document.getElementsByTagName("input");
	for(var i=0;i<inputs.length;i++){
		var input=inputs[i];
		if(input.className.indexOf('textInput')>=0){
			input.onfocus=disableKeyCapture;
			input.onblur=enableKeyCapture;
		}
	}
}

function disableKeyCapture(){
	captureKey = false;
}
function enableKeyCapture(){
	captureKey = true;
}

function keyUp(e){
	//alert("keyCode: " + e.keyCode, 8);
	// check if keys should be captured to prevent textInput
	// typing from triggering a key command
	if(captureKey){
		switch (e.keyCode){
			case 191:
				var el = $("keyCommandsBlock");
				if(el.style.display == "none"){
					showEl(el);
				} else {
					hideEl(el);
					window.focus()
				}
				break;
			case 75:
				var el = $("killBox");
				if(el.style.display == "none"){
					showEl(el);
					$("killInputTextBox").select();
					$("killDisplay").innerHTML = "Enter Thread Id to kill."
				} else {
					hideKill();
					window.focus();
				}
				break;
			case 72:
				$("Host").select();
				break;
			case 68:
				$("db").select();
				break;
			case 85:
				$("User").select();
				break;
			case 67:
				$("Command").select();
				break;
			case 73:
				var el = $("Command");
				if (el.value == "awake"){
					el.value = "";
				} else {
					el.value = "awake";
				}
				break;				
			case 83:
				var el = $("intervalBlock");
				if(el.style.display == "none"){
					showEl(el);
					$("secondsRefresh").select();
				} else {
					hideEl(el);
					window.focus()
				}
				break;
			case 32:
				clearFilters();
		}
	}
	// even inside textInput's, enter key should put focus on window
	switch (e.keyCode){
		case 13:
			window.focus();
			break;
	}
}