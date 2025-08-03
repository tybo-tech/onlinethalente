<?php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

$database = new Database();
$db = $database->connect();

$service = new Company($db);
$statusId = $_GET['statusId'] ?? 1;

echo json_encode(['total' => $service->count($statusId)]);
