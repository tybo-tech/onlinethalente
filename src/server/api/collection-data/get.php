<?php
// api/companies/get.php
include_once '../../config/Database.php';
include_once '../../models/Details.php';

if (!isset($_GET['id']) || !is_numeric($_GET['id'])) {
    echo json_encode(["error" => "Invalid or missing ID"]);
    exit;
}

$database = new Database();
$db = $database->connect();
$joinsString = isset($_GET['joins']) ? $_GET['joins'] : '';
$service = new Details($db);
$Collection = $service->getByIdWithJoins(id: $_GET['id'], joinsString: $joinsString);

if ($Collection) {
    echo json_encode($Collection);
} else {
    echo json_encode(["error" => "Collection not found"]);
}
