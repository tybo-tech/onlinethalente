<?php
// api/list.php
include_once '../config/Database.php';
include_once '../models/Query.php';

$allowedCollections = [
    'product',
    'services',
    'categories',
];

// Check if the collection passed
if (
    !isset($_GET['collection']) ||
    !in_array($_GET['collection'], $allowedCollections)
) {
    echo json_encode(["error" => "Invalid or missing collection"]);
    exit;
}
$database = new Database();
$db = $database->connect();

$collection = $_GET['collection'];


$service = new Query($db);
$list = $service->list($collection);

echo json_encode($list);
