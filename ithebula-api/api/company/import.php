<?php
include_once '../../config/Database.php';
include_once '../../services/CompanyImport.php';

$input = json_decode(file_get_contents("php://input"), true);

if (!$input || !is_array($input)) {
  echo json_encode([
    'success' => false,
    'error' => 'Invalid input: must be an array of companies'
  ]);
  exit;
}

$db = (new Database())->connect();
$importer = new CompanyImport($db);
$response = $importer->importMany($input);

echo json_encode($response);
