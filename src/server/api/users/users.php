<?php
// api/users/list.php
include_once '../../config/Database.php';
include_once '../../models/User.php';

$websiteId = isset($_GET['websiteId']) ? $_GET['websiteId'] : null;
$companyId = isset($_GET['companyId']) ? $_GET['companyId'] : null;

if (!$websiteId || !$companyId) {
    echo json_encode(["error" => "Invalid or missing websiteId or companyId"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new User($db);

$result = $service->list($websiteId, $companyId);
echo json_encode($result);
