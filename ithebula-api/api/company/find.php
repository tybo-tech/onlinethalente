<?php
include_once '../../config/Database.php';
include_once '../../models/Company.php';

$name = $_GET['name'] ?? null;
$registration = $_GET['registration'] ?? null;

if (!$name && !$registration) {
    echo json_encode(["error" => "Either 'name' or 'registration' is required"]);
    exit;
}

$database = new Database();
$db = $database->connect();
$service = new Company($db);

$result = $service->findByRegistrationOrName($registration, $name);
echo json_encode($result);
