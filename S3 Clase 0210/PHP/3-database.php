<?php
// config/database.php
require_once __DIR__ . '/env_loader.php';
loadEnv(__DIR__ . '/.env');
date_default_timezone_set('America/Tegucigalpa');

class Database 
{
    private static $instance = null;
    private $conn;
    private $host;
    private $port;
    private $name;
    private $user;
    private $pass;
    private $timezone;
    private $url;

    private function __construct() 
    {
        $this->host = isset($_ENV['DB_HOST']) ? $_ENV['DB_HOST'] : 'localhost';
        $this->port = isset($_ENV['DB_PORT']) ? $_ENV['DB_PORT'] : '3306';
        $this->name = isset($_ENV['DB_NAME']) ? $_ENV['DB_NAME'] : 'tu_app_db';
        $this->user = isset($_ENV['DB_USER']) ? $_ENV['DB_USER'] : 'root';
        $this->pass = isset($_ENV['DB_PASS']) ? $_ENV['DB_PASS'] : '';
        $this->url = isset($_ENV['EXPO_PUBLIC_API_URL']) ? $_ENV['EXPO_PUBLIC_API_URL'] : '';

        //Zona Horaria para la conexión, si es necesario
        $this->timezone = isset($_ENV['DB_TIMEZONE']) ? $_ENV['DB_TIMEZONE'] : 'UTC';

        //echo "TEST: " . $this->timezone; // Depuración: Verificar la zona horaria cargada

        // Conexión MySQLi orientada a objetos
        $this->conn = mysqli_connect($this->host, $this->user, $this->pass, $this->name, $this->port);

        
        if (!$this->conn) 
        {
            throw new Exception("Error de conexión: " . mysqli_connect_error(), 503);
        }

        // Forzar UTF-8
        mysqli_set_charset($this->conn, 'utf8mb4');

        // 👇 ESTABLECER ZONA HORARIA EN LA SESIÓN MYSQL
        $tz = mysqli_real_escape_string($this->conn, $this->timezone);
        //echo "Timezone: " . $tz;
        
        mysqli_query($this->conn, "SET time_zone = '{$tz}'");

        $verificar = mysqli_query($this->conn, "SELECT @@session.time_zone AS tz_session");
        $fila = mysqli_fetch_assoc($verificar);
        error_log("Zona horaria MySQL aplicada: " . $fila['tz_session']);
        //echo "Zona horaria MySQL aplicada: " . $fila['tz_session'];
    }
    public static function getDatabaseName() 
    {
        if (self::$instance === null) 
        {
            self::$instance = new Database();
        }
        return self::$instance->name;
    }
    public static function getURL() 
    {
        if (self::$instance === null) 
        {
            self::$instance = new Database();
        }
        return self::$instance->url;
    }
    public static function getInstance() 
    {
        if (self::$instance === null) 
        {
            self::$instance = new Database();
        }
        return self::$instance->conn;
    }
    public static function close() 
    {
        if (self::$instance && self::$instance->conn) 
        {
            mysqli_close(self::$instance->conn);
            self::$instance = null;
        }
    }
}
?>