Explanation = Class.create();

Explanation.prototype = {
	initialize: function (threadId) {
		this.id = "expl"+threadId;
		this.eCallback = {
			success: this.handleExplainResponse,
			failure: this.handleExplainError,
			scope: this
		};
		this.threadId = threadId;
		this.sql = "";
		this.tables = "";
		// if this thread has already been explained and registered...
		if (oMgr.find(this.id+"Panel")){
			// simply re-show the explanation panel
			this.dispPanel = oMgr.find(this.id+"Panel");
			this.dispPanel.show();
		} else {
			// otherwise, need to explain this thread from server
			this.dispPanel = new YAHOO.widget.Panel(this.id + "Panel");
			this.explainThread();
		}
	},

	explainThread: function(){
		var request = "";
		var explainURL = "explain.php?Id="+this.threadId;
		YAHOO.util.Connect.asyncRequest("GET", explainURL, this.eCallback);
	},
	
	handleExplainResponse: function(request){
		eval(request.responseText);
		if(explain.error){
			alert("ERROR:" + explain.error);
		} else {
			this.sql = explain.sql;
			this.tables = explain.tables;
			this.displayExplanation.call(this);
		}
	},

	displayExplanation: function(){
		// set header to thread id
		this.dispPanel.setHeader("Thread: " + this.threadId);
		
		// set body to table details
		var bodyHTML = "<table border=\"1\"><tr><th>SQL:</th><th colspan=\"8\">" + this.sql + "</th></tr>";
		bodyHTML += "<tr><th>Select Type</th><th>Table</th><th>Type</th><th>Poss. Keys</th><th>Key</th><th>Key Len</th><th>Ref</th><th>Rows</th><th>Extra</th></tr>";
		for(i=0; i<this.tables.length; i++){
			table = this.tables[i];
			bodyHTML += "<tr><td>"+table.select_type+"</td><td>"+table.table+"</td><td>"+table.type+"</td><td>"+table.possible_keys+"</td><td>"+table.key+"</td><td>"+table.key_len+"</td><td>"+table.ref+"</td><td>"+table.rows+"</td><td>"+table.Extra+"</td></tr>";
		}
		this.dispPanel.setBody(bodyHTML);
		
		// set footer to kill link
		footerHTML = "<a href=\"javascript:killThread('" + this.threadId + "');\"><img src=\"images/kill.png\" border=\"0\" /></a> Kill Thread";
		this.dispPanel.setFooter(footerHTML);
		
		// register this panel with manager
		oMgr.register(this.dispPanel);
		// render this panel
		this.dispPanel.render(document.body);
	}
};