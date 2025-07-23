<?php
// api/collection-link/add.php
include_once '../../config/Database.php';
include_once '../../models/CollectionLinkMutation.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->source_collection)) {
    echo json_encode(["error" => "source_collection is required"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionLinkMutation($db);

 $result = $service->add(
        $data
    );
echo json_encode($result);
