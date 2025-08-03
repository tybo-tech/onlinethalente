<?php
// api/users/update-password.php
include_once '../../config/Database.php';
include_once '../../models/User.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->UserId) || empty($data->NewPassword) || empty($data->UpdatedBy)) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new User($db);
$result = $service->updatePassword($data->UserId, $data->NewPassword, $data->UpdatedBy);

echo json_encode(["success" => $result]);
