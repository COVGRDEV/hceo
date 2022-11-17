<?php
	$ip = filter_var($_SERVER["HTTP_X_FORWARDED_FOR"], FILTER_VALIDATE_IP);
	if ($ip == "") {
		$ip = filter_var($_SERVER["REMOTE_ADDR"], FILTER_VALIDATE_IP);
	}
	echo("#".$ip."#<br /><br />");
	phpinfo();
?>