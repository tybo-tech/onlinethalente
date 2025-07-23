<?php
// api/collection-data/get-children.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataQuery.php';
$parentId = isset($_GET['parentId']) ? $_GET['parentId'] : null;
if (!$parentId) {
    echo json_encode(["error" => "Invalid or missing parentId"]);
    exit;
}

$database = new Database();
$db = $database->connect();


$service = new CollectionDataQuery($db);
$list = $service->getWithChildren($parentId);

echo json_encode($list);
