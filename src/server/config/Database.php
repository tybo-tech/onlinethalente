<?php
include_once 'headers.php';

class Database
{
    private $host = 'mysql';
    private $db_name = 'docker';
    private $username = 'docker';
    private $password = 'docker';

    private $conn;

    public function connect()
    {
        $this->conn = null;
        // $this->setLiveConnection();
        
        try {
            $this->conn = new PDO(
                "mysql:host={$this->host};dbname={$this->db_name};charset=utf8",
                $this->username,
                $this->password
            );
            $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
        } catch (PDOException $e) {
            die(json_encode(["error" => $e->getMessage()]));
        }
        return $this->conn;
    }

    private function setLiveConnection()
    {
        $this->host = 'localhost';
        $this->db_name = 'tybocoza_Ithebula';
        $this->username = 'tybocoza_Ithebula';
        $this->password = 'Strong11!!!!';
    }
    public function getGuid($conn)
    {
        $stmt = $conn->prepare("SELECT UUID() as ID");
        $stmt->execute();

        if ($stmt->rowCount()) {
            $uuid = $stmt->fetch(PDO::FETCH_ASSOC);
            return $uuid['ID'];
        }
        return null;
    }
}
?>