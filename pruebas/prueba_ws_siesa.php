<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Documento sin título</title>
</head>

<body>
	<?php
    	require_once("../funciones/Class_Consultas_Siesa.php");
    	require_once("../funciones/Class_Pedidos_Siesa.php");
		
		$classConsultasSiesa = new Class_Consultas_Siesa();
		$classPerdidosSiesa = new Class_Pedidos_Siesa();
		
		$resultado = $classConsultasSiesa->consultarFacturaPago(1, 239427);
		//$resultado = $classPerdidosSiesa->crearEntidadPedido(1, 100, 200, 230756, "1622");
		
		var_dump($resultado);
	?>
</body>
</html>