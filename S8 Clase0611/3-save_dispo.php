<?php
// api/dispositivo/registrar.php
header('Content-Type: application/json; charset=utf-8');

require_once '../../config/database.php';
require_once '../../config/cors.php';

error_reporting(E_ALL);
ini_set('display_errors', 0);

try {
    $inputRaw = file_get_contents('php://input');
    $input = json_decode($inputRaw, true);

    if (!$input || empty($input['dispo_unique_id'])) {
        throw new Exception('Identificador único de dispositivo no proporcionado.');
    }

    $unique_id     = trim($input['dispo_unique_id']);
    $nombre_equipo = trim($input['dispo_nombre_equipo'] ?? '');
    $marca         = trim($input['dispo_marca'] ?? '');
    $modelo        = trim($input['dispo_modelo'] ?? '');
    $so            = trim($input['dispo_so'] ?? '');
    $so_version    = trim($input['dispo_so_version'] ?? '');
    $dir_mac       = trim($input['dispo_dir_mac'] ?? '');
    $usuario_id    = intval($input['usuario_id'] ?? 0); // Opcional si quieres relacionarlo

    $conexion = Database::getInstance();
    if (!$conexion) {
        throw new Exception('Error de conexión a la base de datos.');
    }

    // Inserta si no existe, o actualiza la última fecha de acceso (dispo_factual) si ya está registrado
    $sql = "INSERT INTO tbl_dispositivo (
                dispo_unique_id, 
                dispo_nombre_equipo, 
                dispo_marca, 
                dispo_modelo, 
                dispo_so, 
                dispo_so_version, 
                dispo_dir_mac, 
                dispo_fregistro, 
                dispo_factual
            ) VALUES (?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
            ON DUPLICATE KEY UPDATE 
                dispo_nombre_equipo = VALUES(dispo_nombre_equipo),
                dispo_so_version    = VALUES(dispo_so_version),
                dispo_factual       = NOW()";

    $stmt = mysqli_prepare($conexion, $sql);
    if (!$stmt) {
        throw new Exception('Error en preparación SQL: ' . mysqli_error($conexion));
    }

    mysqli_stmt_bind_param(
        $stmt, 
        'sssssss', 
        $unique_id, 
        $nombre_equipo, 
        $marca, 
        $modelo, 
        $so, 
        $so_version, 
        $dir_mac
    );

    mysqli_stmt_execute($stmt);
    mysqli_stmt_close($stmt);

    echo json_encode([
        'exito' => true,
        'mensaje' => 'Dispositivo registrado o actualizado correctamente.'
    ], JSON_UNESCAPED_UNICODE);

} catch (Exception $e) {
    http_response_code(400);
    echo json_encode([
        'exito' => false,
        'mensaje' => $e->getMessage()
    ], JSON_UNESCAPED_UNICODE);
}
?>