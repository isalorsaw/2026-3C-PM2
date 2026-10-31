<?php
header('Content-Type: application/json; charset=utf-8');
require_once '../../config/database.php';
require_once '../../config/cors.php';
    
error_reporting(E_ALL);
ini_set('display_errors', 0);

try 
{
    // 1️⃣ Intentar obtener 'usuario_id' desde GET o desde JSON (POST)
    $usuario_id = $_GET['usuario_id'] ?? null;

   if (is_null($usuario_id)) 
    {
        $inputRaw = file_get_contents('php://input');
        $input = json_decode($inputRaw, true);
        $usuario_id = $input['usuario_id'] ?? null;
    }

// 2️⃣ Validar que no sea NULL ni una cadena vacía
    if (is_null($usuario_id) || $usuario_id === '') 
    {
        throw new Exception('Usuario ID es requerido.');
    }

    // Asegurar que sea convertido a número entero
    $usuario_id = (int)$usuario_id;

    $conexion = Database::getInstance();
    $url = Database::getURL();
    
    if (!$conexion) 
    {
        throw new Exception('No se pudo conectar a la base de datos.');
    }

    // 2️⃣ Obtener los módulos/accesos del usuario desde la BD
    $stmtAccesos = mysqli_prepare($conexion, "
        SELECT 
            m.modulo_codigo AS id,
            m.modulo_nombre AS titulo,
            m.modulo_icon AS icono,
            m.modulo_screen AS screen,
            m.modulo_descrip AS descrip
        FROM tbl_acceso ac
        INNER JOIN tbl_modulo_app m ON m.modulo_codigo = ac.modulo_codigo
        WHERE ac.usuario_id = ? AND m.modulo_estado = 'ACTIVO' and ac.acceso_estado = 1
        ORDER BY m.modulo_codigo
    ");

    mysqli_stmt_bind_param($stmtAccesos, 'i', $usuario_id);
    mysqli_stmt_execute($stmtAccesos);
    $resAccesos = mysqli_stmt_get_result($stmtAccesos);

    $accesos = [];
    while ($row = mysqli_fetch_assoc($resAccesos)) 
    {
        $accesos[] = [
            'id'          => $row['id'],
            'title'       => $row['titulo'],
            'screen'      => $row['screen'],
            'description' => $row['descrip'],
            'icon'        => $url.'/movil/iconos/'.$row['icono']
        ];
    }
    mysqli_stmt_close($stmtAccesos);

    // 3️⃣ Retornar respuesta
    echo json_encode([
        'exito' => true,
        'accesos' => $accesos
    ], JSON_UNESCAPED_UNICODE);
} 
catch (Exception $e) 
{
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>