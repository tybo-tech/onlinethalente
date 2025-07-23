<?php

class DeleteService
{
    private PDO $conn;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    /**
     * Deletes a single record by ID.
     */
    public function delete(int $id): bool
    {
        $stmt = $this->conn->prepare("DELETE FROM collection_data WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
