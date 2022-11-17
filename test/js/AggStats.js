AggStats = Class.create();

AggStats.prototype = {
	initialize: function () {
		this.statsCallback = {
			success: handleStatsResponse,
			failure: handleStatsResponse,
			scope: this
		}
	},

	getStats: function(){
		var request = "";
		var statsURL = "explain.php?Id="+this.threadId;
		YAHOO.util.Connect.asyncRequest("GET", statsURL, this.statsCallback);
	},
	
	handleStatsResponse: function(request){
		eval(request.responseText);
		if(explain.error){
			alert("ERROR:" + explain.error);
		} else {
			this.sql = explain.sql;
			this.tables = explain.tables;
			this.displayExplanation.call(this);
		}
	}
};