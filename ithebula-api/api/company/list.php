<?php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

$database = new Database();
$db = $database->connect();

$service = new Company($db);

$statusId = isset($_GET['statusId']) ? (int)$_GET['statusId'] : 1;
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$sortBy = $_GET['sortBy'] ?? 'created_at';
$sortOrder = $_GET['sortOrder'] ?? 'DESC';

$results = $service->list($statusId, $limit, $offset, $sortBy, $sortOrder);
echo json_encode($results);
