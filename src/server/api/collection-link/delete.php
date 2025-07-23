<?php
// api/collection-link/delete.php
include_once '../../config/Database.php';
include_once '../../models/CollectionLinkMutation.php';

$id = isset($_GET['id']) ? $_GET['id'] : null;

if (!$id) {
    echo json_encode([
        "error" => "id is required"
    ]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionLinkMutation($db);

$result = $service->remove(
    $id
);
echo json_encode($result);
