<?php
// api/collection-data/find-parents-that-have-children.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';

$collectionId = isset($_GET['collectionId']) ? $_GET['collectionId'] : null;
$websiteId = isset($_GET['websiteId']) ? $_GET['websiteId'] : null;
if (!$websiteId) {
    echo json_encode(["error" => "Invalid or missing websiteId"]);
    exit;
}
if (!$collectionId) {
    echo json_encode(["error" => "Invalid or missing collectionId"]);
    exit;
}

$database = new Database();
$db = $database->connect();


$service = new CollectionDataQuery($db);
$list = $service->findParentsThatHaveChildren(collectionId: $collectionId, websiteId: $websiteId);

echo json_encode($list);
