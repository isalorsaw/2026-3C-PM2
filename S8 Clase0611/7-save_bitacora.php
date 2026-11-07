<?php
// api/bitacora/registrar.php
header('Content-Type: application/json; charset=utf-8');

require_once '../../config/database.php';
require_once '../../config/cors.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    $inputRaw = file_get_contents('php://input');
    $input = json_decode($inputRaw, true);

    if (!$input || empty($input['bitacora_accion'])) {
        throw new Exception('La acción de bitácora es obligatoria.');
    }

    // Capturar IP del cliente automáticamente
    $ip_origen = $_SERVER['HTTP_CLIENT_IP'] 
              ?? $_SERVER['HTTP_X_FORWARDED_FOR'] 
              ?? $_SERVER['REMOTE_ADDR'] 
              ?? '0.0.0.0';

    // Manejar IP cuando viene separada por comas (detrás de proxies)
    if (strpos($ip_origen, ',') !== false) {
        $ip_origen = trim(explode(',', $ip_origen)[0]);
    }

    $usuario_id      = !empty($input['usuario_id']) ? intval($input['usuario_id']) : null;
    $dispo_unique_id = !empty($input['dispo_unique_id']) ? trim($input['dispo_unique_id']) : null;
    $accion          = trim($input['bitacora_accion']);
    $tabla_afectada  = !empty($input['tabla_afectada']) ? trim($input['tabla_afectada']) : null;
    $registro_id     = !empty($input['registro_id']) ? trim($input['registro_id']) : null;
    $estado          = !empty($input['bitacora_estado']) ? strtoupper(trim($input['bitacora_estado'])) : 'EXITOSO';

    // Convertir objetos/arrays PHP a JSON string para guardar en columnas de tipo JSON
    $datos_anteriores = !empty($input['datos_anteriores']) 
                        ? json_encode($input['datos_anteriores'], JSON_UNESCAPED_UNICODE) 
                        : null;
                        
    $datos_nuevos     = !empty($input['datos_nuevos']) 
                        ? json_encode($input['datos_nuevos'], JSON_UNESCAPED_UNICODE) 
                        : null;

    $conexion = Database::getInstance();
    if (!$conexion) {
        throw new Exception('Error de conexión a la base de datos.');
    }

    $sql = "INSERT INTO tbl_bitacora (
                usuario_id, 
                dispo_unique_id, 
                ip_origen, 
                bitacora_accion, 
                tabla_afectada, 
                registro_id, 
                datos_anteriores, 
                datos_nuevos, 
                bitacora_estado, 
                bitacora_fecha
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())";

    $stmt = mysqli_prepare($conexion, $sql);
    if (!$stmt) {
        throw new Exception('Error preparando SQL: ' . mysqli_error($conexion));
    }

    // Vincular parámetros (s = string/json, i = int)
    mysqli_stmt_bind_param(
        $stmt, 
        'issssssss', 
        $usuario_id, 
        $dispo_unique_id, 
        $ip_origen, 
        $accion, 
        $tabla_afectada, 
        $registro_id, 
        $datos_anteriores, 
        $datos_nuevos, 
        $estado
    );

    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    echo json_encode([
        'exito' => true,
        'mensaje' => 'Bitácora registrada correctamente.'
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>