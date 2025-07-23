<?php
include_once '../config/Database.php';

try {
    $database = new Database();
    $conn = $database->connect();

    // Fetch all tables in the database
    $tablesQuery = $conn->query("SHOW TABLES");
    $tables = $tablesQuery->fetchAll(PDO::FETCH_COLUMN);

    $schema = [];

    foreach ($tables as $table) {
        // Get column details
        $columnsQuery = $conn->prepare("
            SELECT COLUMN_NAME, DATA_TYPE, COLUMN_DEFAULT, IS_NULLABLE
            FROM INFORMATION_SCHEMA.COLUMNS
            WHERE TABLE_NAME = ?
        ");
        $columnsQuery->execute([$table]);
        $columns = $columnsQuery->fetchAll(PDO::FETCH_ASSOC);

        $schema[$table] = $columns;
    }

    echo json_encode($schema);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
