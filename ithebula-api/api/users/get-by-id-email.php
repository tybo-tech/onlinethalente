<?php
// api/users/get-by-id-email.php
include_once '../../config/Database.php';
include_once '../../models/User.php';


$email = isset($_GET['email']) ? $_GET['email'] : null;
$websiteId = isset($_GET['websiteId']) ? $_GET['websiteId'] : null;

if(!$email || !$websiteId) {
    echo json_encode(["error" => "Email and WebsiteId are required"]);
    exit;
}


$database = new Database();
$db = $database->connect();

$service = new User($db);


$result = $service->getByEmail($email, $websiteId);
echo json_encode($result);
