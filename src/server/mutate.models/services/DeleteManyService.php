<?php

class DeleteManyService
{
    private PDO $conn;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    /**
     * Deletes multiple records by an array of IDs.
     */
    public function deleteMany(array $ids): int
    {
        if (empty($ids)) return 0;

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $stmt = $this->conn->prepare("DELETE FROM collection_data WHERE id IN ($placeholders)");

        $stmt->execute($ids);
        return $stmt->rowCount(); // number of rows deleted
    }
}
