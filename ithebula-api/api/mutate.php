<?php
// api/list.php
include_once '../config/Database.php';
include_once '../models/Mutate.php';


$database = new Database();
$db = $database->connect();

$collection = $_GET['collection'];
$type = $_GET['type'];
$data = json_decode(file_get_contents("php://input"));


$service = new Mutate($db);
$list = $service->save($collection, $type, $data);

echo json_encode($list);
