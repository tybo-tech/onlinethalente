<?php
// api/collection-link/get-links.php
include_once '../../config/Database.php';
include_once '../../models/CollectionLinkQuery.php';

$sourceId = isset($_GET['sourceId']) ? $_GET['sourceId'] : null;
$relationType = isset($_GET['relationType']) ? $_GET['relationType'] : null;

if (!$sourceId || !$relationType) {
    echo json_encode([]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionLinkQuery($db);

$result = $service->getBySource(
    $sourceId,
    $relationType
);
echo json_encode($result);
