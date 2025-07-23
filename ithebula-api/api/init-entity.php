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
        SELECT COLUMN_NAME, DATA_TYPE FROM INFORMATION_SCHEMA.COLUMNS WHERE TABLE_NAME = ?
    ");
    $columnsQuery->execute([$tableName]);
    $columns = $columnsQuery->fetchAll(PDO::FETCH_ASSOC);

    $object = [];
    foreach ($columns as $column) {
        switch ($column['DATA_TYPE']) {
            case 'int':
            case 'tinyint':
            case 'smallint':
            case 'mediumint':
            case 'bigint':
            case 'decimal':
            case 'float':
            case 'double':
                $object[$column['COLUMN_NAME']] = 0; // Default for numbers
                break;
            case 'varchar':
            case 'char':
            case 'text':
            case 'tinytext':
            case 'mediumtext':
            case 'longtext':
                $object[$column['COLUMN_NAME']] = ''; // Default for strings
                break;
            default:
                $object[$column['COLUMN_NAME']] = null; // Default for other types
                break;
        }
    }

    echo json_encode($object);
} catch (Exception $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
