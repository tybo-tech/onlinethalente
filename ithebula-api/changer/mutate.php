<?php
// mutate.php

require_once '../config/Database.php';
require_once '../mutate.models/MutateEngine.php'; // Adjust if needed

// Parse JSON input
$rawJson = file_get_contents("php://input");
$postData = json_decode($rawJson);

// Validate input is an object
if (!$postData || !is_object($postData)) {
    echo json_encode(["error" => "Invalid JSON body. Expecting a JSON object."]);
    exit;
}

// Validate required fields
$requiredFields = ['collection_id', 'website_id', 'company_id', 'action'];
$missingFields = [];

foreach ($requiredFields as $field) {
    if (empty($postData->$field)) {
        $missingFields[] = $field;
    }
}

if (!empty($missingFields)) {
    echo json_encode([
        "error" => "Missing required fields.",
        "missing" => $missingFields
    ]);
    exit;
}

// Init database connection
$database = new Database();
$db = $database->connect();

// Run mutation engine
try {
    $engine = new MutateEngine($db);
    $result = $engine->run($postData);

    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode([
        "success" => false,
        "error" => "Server error: " . $e->getMessage(),
    ]);
}
