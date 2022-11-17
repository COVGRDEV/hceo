// Set browser flag
var ieFlag = ((navigator.appName.indexOf("Microsoft")>-1) || (navigator.appName.indexOf("MSIE")>-1)) ? true : false;

// Set up YAHOO OverlayManager to manage explanation panels
var oMgr = new YAHOO.widget.OverlayManager();

// Initialize sortBy variables for first sort run
var sortByCol = "Time";
var sortByOrder = "DESC";

// Initialize some other stuff
// (Note: Need to sort out all this initialization into single function?)
function initializeAjaxMyTop(){
	setupKeyCapture();
	sortBy("Time");
	refreshThreads();
}

// Set up processCallback object for YAHOO asyncRequest
var processCallback = {
	success: refreshThreads,
	failure: refreshThreads
}

// Set up killCallback object for YAHOO asyncRequest
var killCallback = {
	success: handleKillResponse,
	failure: handleKillResponse
};

// *** CSS-related functions ***
// (Note: is there a better way to do this?)
// highlight sets row's classname to 'selectedDataRow'
function highlight(element){
	element.className='Columns selectedDataRow';
}
// deHighlight sets rows classname to 'dataRow'
function deHighlight(element){
	element.className='Columns dataRow';
}
// hideEl simply sets display to 'none'
function hideEl(element){
	element.style.display = "none";
}
// showEl sets display to 'block'
function showEl(element){
	element.style.display = "block";
}

// separate filter function for Id so that threads can be
// auto-filtered while typing in the kill thread ID
function filterId(Id){
	$('Id').value = Id;
}


// sortBy function to remove sort indicator element and set
// appropriate sortBy variables when any field header is clicked
function sortBy(field){
	// find and remove current/old sort indicator
	var oldSortInd = ($('sortInd')) ? $('sortInd') : null;
	if (oldSortInd) $(sortByCol + 'Label').removeChild(oldSortInd);
	// set sort field
	if (field !== sortByCol){
		sortByCol = field;
	} else {
		// switch sort flag
		sortByOrder = (sortByOrder == "ASC") ? "DESC" : "ASC";
	}
	newSortInd = makeSortEl();
	// add the new sort indicator to the proper field label
	$(field+ 'Label').appendChild(newSortInd);
	YAHOO.util.Dom.setX('sortInd', YAHOO.util.Dom.getX(field+'Label') + 75);
	YAHOO.util.Dom.setY('sortInd', YAHOO.util.Dom.getY(field+'Label'));
}
// create sort indicator element from current sort values
function makeSortEl(){
	// use .gif if IE
	var imageExt = (ieFlag) ? ".gif" : ".png";
	// <span id="sortInd" class="sortInd"> </span>
	sortInd = document.createElement('span');
	sortInd.setAttribute('id', 'sortInd');
	sortInd.setAttribute('class', 'sortInd');
	sortInd.innerHTML = "<img src='images/" + sortByOrder + imageExt + "' border='0' style='vertical-align: middle'/>";
	return sortInd;
}

// clear all filter inputs' values
function clearFilters(){
	for (var i=0;i<filters.length;i++){
		$(filters[i]).value = "";
	}
}

function refreshThreads(request){
	$('threadDisplay').innerHTML = (request) ? request.responseText : null;
	if ($('secondsRefresh').value){
		secValue = parseFloat($('secondsRefresh').value);
		if (isNaN(secValue)){
			alert("Invalid entry for refresh interval, resetting to default 3");
			secTimeout = 3;
			$('secondsRefresh').value = 3;
		} else {
			secTimeout = secValue;
		}
	}
	timeout = secTimeout * 1000;
	if(timeout>0){
		setTimeout("updateThreadInfo()", timeout);
	}
}

function updateThreadInfo(){
	var processURL = "showthreads.php?"; // server-side script
	
	for (var i=0;i<filters.length;i++){
		var filter = filters[i];
		var filterInputEl = $(filter);
		if(filterInputEl.value){
			processURL += filter+"="+filterInputEl.value+"&";
		}else{
			processURL += filter+"=ALL&";
		}
	}
	processURL += "sortByCol=" + sortByCol + "&sortByOrder=" + sortByOrder;
	
	YAHOO.util.Connect.asyncRequest('GET', processURL, processCallback);
}

function killThread(threadId){
	if (!(threadId == "")){
		var killURL = "kill.php?";
		killURL += "Id=" + threadId + "&";
		YAHOO.util.Connect.asyncRequest('GET', killURL, killCallback);
	} else {
		hideKill();
	}
}

function handleKillResponse(request){
	killRespDoc = request.responseXML.documentElement;
	statusMessage = killRespDoc.getElementsByTagName("kill")[0].firstChild.data;
	$('killDisplay').innerHTML = statusMessage;		
	if (statusMessage != "OK"){
		$('killInputTextBox').select();
	} else {
		hideKill();
	}
}

function hideKill(){
		$('killDisplay').innerHTML = "";
		$('killInputTextBox').value = "";
		var killEl = document.getElementById("killBox");
		hideEl(killEl);
}