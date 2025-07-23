<?php
// api/users/save.php
include_once '../../config/Database.php';
include_once '../../models/Company.php';


$websiteId = isset($_GET['statusId']) ? $_GET['statusId'] : 1;

$database = new Database();
$db = $database->connect();

$service = new Company($db);


$result = $service->list($statusId);
echo json_encode($result);
