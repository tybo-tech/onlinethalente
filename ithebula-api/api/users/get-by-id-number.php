<?php
// api/users/get-by-id-number.php
include_once '../../config/Database.php';
include_once '../../models/User.php';


$idNumber = isset($_GET['idNumber']) ? $_GET['idNumber'] : null;
$idNumber = isset($_GET['websiteId']) ? $_GET['websiteId'] : null;

if(!$idNumber || !$websiteId) {
    echo json_encode(["error" => "ID Number and WebsiteId are required"]);
    exit;
}


$database = new Database();
$db = $database->connect();

$service = new User($db);


$result = $service->getByIdNumber($idNumber, $websiteId);
echo json_encode($result);
