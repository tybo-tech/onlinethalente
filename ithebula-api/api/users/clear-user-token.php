<?php
// api/users/clear-user-token.php
include_once '../../config/Database.php';
include_once '../../models/User.php';


$id = isset($_GET['id']) ? $_GET['id'] : null;
if (!$id) {
    echo json_encode(["error" => "User Id is required"]);
    exit;
}
$database = new Database();
$db = $database->connect();

$service = new User($db);


$result = $service->clearToken($id);
echo json_encode($result);
