<?php
// api/collection-data/category-tree.php
include_once '../../config/Database.php';
include_once '../../models/CategoryTreeQuery.php';

$database = new Database();
$db = $database->connect();


$service = new CategoryTreeQuery($db);
$list = $service->getTreeWithProducts();

echo json_encode($list);
