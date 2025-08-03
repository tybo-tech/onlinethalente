<?php
// api/users/save.php
include_once '../../config/Database.php';
include_once '../../models/User.php';


$token = isset($_GET['token']) ? $_GET['token'] : null;
if (!$token) {
    echo json_encode(["error" => "token is required"]);
    exit;
}
$database = new Database();
$db = $database->connect();

$service = new User($db);


$result = $service->getByToken($token);
echo json_encode($result);
