<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Huellas k</title>
</head>
<body>
<?php
	require_once("../db/DbPacientes.php");
	$dbPacientes = new DbPacientes();
	
	$id_usuario = 1;
	$temporal_huella_obj = $dbPacientes->getTemporalHuella($id_usuario);
	
	$str_huella = "";
	if (isset($temporal_huella_obj["id_usuario"])) {
		$str_huella = base64_encode($temporal_huella_obj["huella"]);
	}
	//var_dump($temporal_huella);
?>
<applet codebase="../manejo_huella/." code="sensorhuella.HuellaApplet.class" archive="SensorHuella.jar" width=205 height=240>
	<param name="id_usuario" id="id_usuario" value="<?php echo($id_usuario); ?>" />
	<param name="huella" id="huella" value="<?php echo($str_huella); ?>" />
</applet>
</body>
</html>
