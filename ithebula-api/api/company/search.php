<?php
// api/companies/search.php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

$query = $_GET['query'] ?? null;
if (!$query) {
    echo json_encode(["error" => "Missing search query"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new Company($db);

// You can optionally allow `statusId` filtering too
$statusId = isset($_GET['statusId']) ? (int)$_GET['statusId'] : 1;

$results = $service->search($query, $statusId);
echo json_encode($results);
