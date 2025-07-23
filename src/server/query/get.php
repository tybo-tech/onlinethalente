<?php
// query/list.php

require_once '../config/Database.php';
require_once '../query.models/CollectionQueryEngine.php';


// Parse JSON body
$postData = json_decode(file_get_contents("php://input"));

if (!$postData) {
    echo json_encode(["error" => "Invalid JSON body."]);
    exit;
}

// Validate required fields
$requiredFields = ['collection_id', 'website_id', 'company_id'];
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

// Connect to database
$database = new Database();
$db = $database->connect();

// Run collection engine
try {
    $engine = new CollectionQueryEngine($db);
    $result = $engine->run($postData);

    echo json_encode($result);
} catch (Exception $e) {
    echo json_encode(["error" => "Server error: " . $e->getMessage()]);
}
