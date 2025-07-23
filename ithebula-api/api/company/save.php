<?php
// api/company/save.php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->name)) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new Company($db);

// Check if it's an update or a new entry
if (!empty($data->id)) {
    $result = $service->update($data);
} else {
    $result = $service->create($data);
}

echo json_encode($result);
