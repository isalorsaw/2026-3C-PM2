<?php
// config/cors.php
header('Content-Type: application/json; charset=utf-8');

// 🔓 Permitir acceso desde tu app (ajusta para producción)
$allowedOrigins = [
    'http://localhost:8081',      // Expo web
    'exp://192.168.1.X:19000',    // Expo Go en dispositivo
    'https://tu-dominio.com',     // Producción
];

$origin = $_SERVER['HTTP_ORIGIN'] ?? '';
if (in_array($origin, $allowedOrigins) || getenv('APP_ENV') === 'development') 
{
    header("Access-Control-Allow-Origin: $origin");
    header('Access-Control-Allow-Credentials: true');
}

// Métodos y headers permitidos
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, Authorization, X-Requested-With');

// Manejar preflight requests (OPTIONS)
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') 
{
    http_response_code(200);
    exit;
}
?>