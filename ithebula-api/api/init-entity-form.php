<?php
include_once '../config/Database.php';

try {
    $tableName = $_GET['table'] ?? null;

    if (!$tableName) {
        throw new Exception("Table name not provided");
    }

    $database = new Database();
    $conn = $database->connect();

    // Get column details for the provided table
    $columnsQuery = $conn->prepare("
        SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?    ");
    $columnsQuery->execute([$tableName]);
    $columns = $columnsQuery->fetchAll(PDO::FETCH_ASSOC);

    $formFields = [];
    foreach ($columns as $column) {
        $columnName = $column['COLUMN_NAME'];

        // Skip fields we want to exclude
        if (in_array($columnName, ['id', 'created_at', 'updated_at', 'updated_by', 'created_by'])) {
            continue;
        }

        $fieldName = str_replace('_', ' ', $columnName);
        $formFields[] = [
            'label' => ucwords($fieldName),
            'name' => $columnName,
            'type' => in_array($column['DATA_TYPE'], ['int', 'decimal', 'float', 'double', 'bigint', 'smallint']) ? 'number' : 'text',
            'default' => in_array($column['DATA_TYPE'], ['int', 'decimal', 'float', 'double', 'bigint', 'smallint']) ? 0 : '',
        ];
    }

    echo json_encode($formFields);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
