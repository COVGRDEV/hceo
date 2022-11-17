<?php
	require_once("../db/DbPacientes.php");
	
	$dbPacientes = new DbPacientes();
?>
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml">
<head>
<meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
<title>Huellas g</title>
</head>

<body>
<?php
	if (isset($_POST["id_usuario"])) {
		$id_usuario = $_POST["id_usuario"];
		
                $nombre_arch = "tmp/arch_huella_".$id_usuario.".oct";
                
                unlink($nombre_arch);
                
		if (count($_FILES) > 0) {
			@$nombre_tmp = $_FILES["fil_print"]["tmp_name"];
			@$nombre_ori = $_FILES["fil_print"]["name"];
			     
			//Se obtiene el nombre que tendrá el archivo
			
                        
                        /*
                        $archivo = file_exists($nombre_arch);
			
                        if($archivo){
                            unlink($archivo);
                        }
                        */
                                   
                        
                        
			//Se copia el archivo
			copy($nombre_tmp, $nombre_arch);
			
			//Se inserta el registro temporal en la base de datos
			$resultado = $dbPacientes->insertarTemporalHuella($id_usuario, $nombre_arch);
		}
	}
?>
</body>
</html>