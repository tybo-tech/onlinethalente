<?php
// api/companies/save.php
include_once '../../config/Database.php';
include_once '../../models/CollectionDataMutation.php';

$list = json_decode(file_get_contents("php://input"));
if (!$list || !is_array($list)) {
    echo json_encode(["error" => "Invalid input data"]);
    exit;
}
if (count($list) === 0) {
    echo json_encode(["error" => "No data provided"]);
    exit;
}
$database = new Database();
$db = $database->connect();

$service = new CollectionDataMutation($db);
$output = [];
foreach ($list as $data) {
    if (!empty($data->id)) {
        $result = $service->update(
            $data
        );
        $output[] = $result;
    } else {
        $result = $service->add(
            $data
        );
        $output[] = $result;
    }
}

echo json_encode($output);
