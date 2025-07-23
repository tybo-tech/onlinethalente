<?php
// api/companies/list.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';
if (!isset($_GET['collectionId'])) {
    echo json_encode(["error" => "Invalid or missing collectionId"]);
    exit;
}
if (!isset($_GET['websiteId'])) {
    echo json_encode(["error" => "Invalid or missing websiteId"]);
    exit;
}
$collectionId = $_GET['collectionId'];
$websiteId = $_GET['websiteId'];

$parent_id = isset($_GET['parent_id']) ? $_GET['parent_id'] : null;
$childrenCollection = isset($_GET['childrenCollection']) ? $_GET['childrenCollection'] : null;
$database = new Database();
$db = $database->connect();


$service = new CollectionDataQuery($db);
$list = $service->findMany(
    websiteId: $websiteId,
    collectionId: $collectionId,
    filters: [],
    limit: null,
    parent_id: $parent_id,
    childrenCollection: $childrenCollection
);

echo json_encode($list);
