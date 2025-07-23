<?php
// api/users/save.php
include_once '../../config/Database.php';
include_once '../../models/User.php';


$id = isset($_GET['UserId']) ? $_GET['UserId'] : null;
if (!$id) {
    echo json_encode(["error" => "UserId is required"]);
    exit;
}
$database = new Database();
$db = $database->connect();

$service = new User($db);


$result = $service->getById($id);
echo json_encode($result);
