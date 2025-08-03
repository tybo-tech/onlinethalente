<?php
include_once '../../config/Database.php';
include_once '../../models/UserCollectionDataQuery.php';

$database = new Database();
$db = $database->connect();

$service = new UserCollectionDataQuery($db);

// Required inputs
$collectionId = $_GET['collectionId'] ?? null;
$websiteId = $_GET['websiteId'] ?? null;

// Optional inputs
$limit = isset($_GET['limit']) ? (int)$_GET['limit'] : 100;
$offset = isset($_GET['offset']) ? (int)$_GET['offset'] : 0;
$sortBy = $_GET['sortBy'] ?? 'created_at';
$sortOrder = $_GET['sortOrder'] ?? 'DESC';

if (!$collectionId || !$websiteId) {
  echo json_encode(["error" => "Invalid or missing collectionId or websiteId"]);
  exit;
}

// Call the service
$results = $service->getWithUsers($collectionId, $websiteId, $limit, $offset, $sortBy, $sortOrder);
echo json_encode($results);
