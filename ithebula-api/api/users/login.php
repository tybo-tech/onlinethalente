<?php
// api/users/login.php 
include_once '../../config/Database.php';
include_once '../../models/User.php';

$data = json_decode(file_get_contents("php://input"));

$database = new Database();
$db = $database->connect();

$service = new User($db);

// Make sure all required fields are present
if (
    isset($data)
    && !empty($data->email)
    && !empty($data->password)
    && !empty($data->website_id)
) {
    $user = $service->authenticate($data->email,$data->password, $data->website_id);

    if (isset($user) && !empty($user['id'])) {
        // You can unset the password before returning user object for security
        unset($user['password']);
        echo json_encode($user);
    } else {
        echo json_encode(["error" => "Invalid email or password"]);
    }
} else {
    echo json_encode(["error" => "Email, password and website_id are required"]);
    exit;
}
