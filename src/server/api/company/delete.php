<?php
// api/users/save.php
include_once '../../config/Database.php';
include_once '../../models/Company.php';


$id = isset($_GET['companyId']) ? $_GET['companyId'] : null;
if (!$id) {
    echo json_encode(["error" => "companyId is required"]);
    exit;
}
$database = new Database();
$db = $database->connect();

$service = new Company($db);


$result = $service->delete($id);
echo json_encode($result);
