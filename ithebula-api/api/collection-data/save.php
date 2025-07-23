<?php
// api/companies/save.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataMutation.php';

$data = json_decode(file_get_contents("php://input"));

if (!$data || empty($data->collection_id)) {
    echo json_encode(["error" => "collection_id is required"]);
    exit;
}

$database = new Database();
$db = $database->connect();

$service = new CollectionDataMutation($db);

if (!empty($data->id)) {
    $result = $service->update(
        $data
    );
} else {
    $result = $service->add(
        $data
    );
}

echo json_encode($result);
