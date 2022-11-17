<html>
<head>
	<script type="text/javascript" src='js/prototype.lite.js'></script>
	<script type="text/javascript" src='js/yahoo.js'></script>
	<script type="text/javascript" src='js/connection.js'></script>
	<script type="text/javascript" src='js/dom.js'></script>
	<script type="text/javascript" src='js/event.js'></script>
	<script type="text/javascript" src='js/animation.js'></script>
	<script type="text/javascript" src='js/dragdrop.js'></script>
	<script type="text/javascript" src='js/container.js'></script>
	<script type="text/javascript">
<?php
	$jsFiltersArray =  "var filters = new Array(";
	require_once("config.php");
	foreach($filters as $filter){
		$jsFiltersArray .= "\"$filter\",";
	}
	$jsFiltersArray = substr($jsFiltersArray, 0, strlen($jsFiltersArray)-1);
	$jsFiltersArray .= ");";
	echo $jsFiltersArray;
?>
	</script>
	<script type="text/javascript" src='js/keyCapture.js'></script>
	<script type="text/javascript" src='js/ProcessList.js'></script>
	<script type="text/javascript" src='js/Explanation.js'></script>
	<script type="text/javascript" src='js/ajaxMyTop.js'></script>

	<link rel='stylesheet' type='text/css' href='ajaxMyTop.css' />
	<link rel='stylesheet' type='text/css' href='container.css' />

	<title>ajaxMyTop</title>
</head>

<body alink="#ff0000" bgcolor="#ffffff" link="#0000cc" text="#000000" vlink="#6600cc" onload="initializeAjaxMyTop();" onkeyup="keyUp(event);">

<!-- Main display header div with column labels and filter input boxes -->
<div id="fixedTop">
	<div id="aggStats" style="font-size: xx-small;">&nbsp;</div>
	<div id="keyCommandsBlock" class="fixedHeadBlock" style="font-size: xx-small;">? - display this section; k - kill a thread; s - change interval; d - filter by database; h - filter by host; u - filter by user; c - filter by command; i - toggle idle threads; space - clear filters</div>
	<div id="intervalBlock">Seconds Interval <input type="text" id="secondsRefresh" class="textInput" name="secondsRefresh" size="3" value="2" /></div>
	<div class="dispHeader">
		<div class="Columns" id="dhColumns">
			<div class="Column dataHeader" id="IdLabel"><a href="javascript:sortBy('Id');" class="white">Id</a></div>
			<div class="Column dataHeader" id="UserLabel"><a href="javascript:sortBy('User');" class="white">User</a></div>
			<div class="Column dataHeader" id="HostLabel"><a href="javascript:sortBy('Host');" class="white">Host</a></div>
			<div class="Column dataHeader" id="dbLabel"><a href="javascript:sortBy('db');" class="white">db</a></div>
			<div class="Column dataHeader" id="CommandLabel"><span><a href="javascript:sortBy('Command');" class="white">Command</a></span></div>
			<div class="Column dataHeader" id="TimeLabel"><a href="javascript:sortBy('Time');" class="white">Time</a></div>
			<div class="Column dataHeader" id="StateLabel"><a href="javascript:sortBy('State');" class="white">State</a></div>
			<div class="Column dataHeader" id="InfoLabel">Info</div>
		</div>
		<div class="Columns" id="dhFilters">
			<div class="Column dataHeader" id="IdFilter"><input type="text" name="Id" id="Id" class="textInput" size="10" /></div>
			<div class="Column dataHeader" id="UserFilter"><input type="text" name="User" id="User" class="textInput" size="10" /></div>
			<div class="Column dataHeader" id="HostFilter"><input type="text" name="Host" id="Host" class="textInput" size="10" /></div>
			<div class="Column dataHeader" id="dbFilter"><input type="text" name="db" id="db" class="textInput" size="10" /></div>
			<div class="Column dataHeader" id="CommandFilter"><input type="text" name="Command" id="Command" class="textInput" size="10" /></div>
			<div class="Column dataHeader" id="TimeFilter"><input type="text" name="Time" id="Time" class="textInput" size="10" /></div>
			<div class="Column dataHeader" id="StateFilter"><input type="text" name="State" id="State" class="textInput" size="10" /></div>
			<div class="Column dataHeader" id="InfoFilter"><input type="text" name="Info" id="Info" class="textInput" size="10" /></div>
		</div>
	</div>
</div>

<!-- Kill div for the kill box -->
<div id="killBox" style="display: none;">
	<div class="killInput"><input type="text" id="killInputTextBox" class="killInput" size="10" onblur="killThread(this.value); enableKeyCapture();" onfocus="disableKeyCapture();" onkeyup="filterId(this.value);"/></div>
	<div id="killDisplay" class="killDisplay"></div>
</div>

<!-- Thread display div -->
<div id="threadDisplay" style="clear: left; padding-left: 4px;"></div>
<div class="dbl" style="width: 800px;"><img alt="" height="1" width="1"/></div>

</body>
</html>