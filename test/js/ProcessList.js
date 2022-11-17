ProcessList = Class.create();

ProcessList.prototype = {
	initialize: function() {
		this.pCallback = {
			success: this.refreshThreads,
			failure: this.refreshThreads,
			scope: this
		};
		this.refreshInterval = 2;
		this.refreshThreads();
	},
		
	refreshThreads: function(request){
		$('threadDisplay').innerHTML = (request) ? request.responseText : "";
		if ($('secondsRefresh').value){
			var secValue = parseFloat($('secondsRefresh').value);
			if (isNaN(secValue)){
				alert("Invalid entry for refresh interval, resetting to default 3");
				this.refreshInterval = 2;
			} else {
				this.refreshInterval = secValue;
			}
		}
		if(this.refreshInterval > 0){
			setInterval(this.updateThreadInfo.bind(this), refreshInterval*1000);
		}
	},
	
	updateThreadInfo: function(){
		var processURL = "processlist.php?"; // server-side script
		
		for (var i=0;i<filters.length;i++){
			var filter = filters[i];
			var filterInputEl = document.getElementById(filter);
			if(filterInputEl.value){
				processURL += filter+"="+filterInputEl.value+"&";
			}else{
				processURL += filter+"=ALL&";
			}
		}
		YAHOO.util.Connect.asyncRequest('GET', processURL, this.pCallback);
	}

};