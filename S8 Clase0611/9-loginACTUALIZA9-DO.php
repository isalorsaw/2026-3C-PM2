<?php
header('Content-Type: application/json; charset=utf-8'); // 👈 Clave: declarar UTF-8
// 3️⃣ Conectar a la BD
require_once '../../config/database.php';
require_once '../../config/cors.php';
    
// Capturar errores fatales
error_reporting(E_ALL);
ini_set('display_errors', 0);

try 
{
    // 1️⃣ Recibir datos JSON del body
    $inputRaw = file_get_contents('php://input');
    $input = json_decode($inputRaw, true);

    if (!$input) 
    {
        throw new Exception('Datos inválidos. Se esperaba JSON.');
    }

    $usuario    = trim($input['user'] ?? '');
    $clave      = $input['pass'] ?? '';
    $empresa_id = 0;//$input['empresa_id'] ?? 0;
    
    // 2️⃣ Validar campos
    if (empty($usuario) || empty($clave)) 
    {
        throw new Exception('Usuario y contraseña son obligatorios.');
    }

    $conexion = Database::getInstance();
    $url = Database::getURL();
    
    if (!$conexion) 
    {
        throw new Exception('No se pudo conectar a la base de datos.');
    }

    // 4️⃣ Buscar el usuario
    $stmt = mysqli_prepare($conexion, "
        SELECT 
            us.usuario_id, 
            us.usuario_nombre, 
            us.usuario_clave, 
            us.usuario_nombrecomp, 
            us.usuario_correo,
            us.usuario_telefono,
            us.empresa_id,
            ifnull(usi.usuario_img_ruta,'') as ruta
        FROM tbl_usuario us 
        left outer join tbl_usuario_img usi on us.usuario_id = usi.usuario_id
        WHERE usuario_nombre = ? AND empresa_id = ? LIMIT 1
    ");

    if (!$stmt) 
    {
        throw new Exception('Error en la consulta SQL: ' . mysqli_error($conexion));
    }

    mysqli_stmt_bind_param($stmt, 'si', strtolower($usuario), $empresa_id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);

    // 5️⃣ Validar credenciales
   // En login.php, reemplaza el bloque de validación de credenciales por:
    if (!$user || strtolower($clave) != strtolower($user['usuario_clave'])) 
    {
        // Mantenemos HTTP 200 para asegurar que el JSON llegue intacto al frontend
        // y no sea interceptado por una página de error HTML del servidor.
        echo json_encode([
            'exito' => false,
            'mensaje' => 'Usuario o contraseña incorrectos.'
        ], JSON_UNESCAPED_UNICODE);
        exit;
    }

    // 6️⃣ ✅ LOGIN EXITOSO - Actualizar último acceso
    $updateStmt = mysqli_prepare($conexion, "
        UPDATE tbl_usuario 
        SET usuario_fultacceso = NOW() 
        WHERE usuario_id = ?
    ");
    mysqli_stmt_bind_param($updateStmt, 'i', $user['usuario_id']);
    mysqli_stmt_execute($updateStmt);
    mysqli_stmt_close($updateStmt);

    echo json_encode([
            'exito' => true,
            'mensaje' => 'Bienvenido, ' . $user['usuario_nombrecomp'],
            'usuario' => [
                'id'              => $user['usuario_id'],
                'usuario'         => $user['usuario_nombre'],
                'nombre_completo' => $user['usuario_nombrecomp'],
                'correo'          => $user['usuario_correo'],
                'telefono'        => $user['usuario_telefono'],
                'empresa_id'      => $user['empresa_id'],
                'ruta'      => $url.$user['ruta']
            ]
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