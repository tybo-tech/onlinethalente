<?php

require_once 'GetService.php';

class UpdateService
{
    private PDO $conn;
    private GetService $getService;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
        $this->getService = new GetService($db);
    }

    public function update(
        int $id,
        string $jsonData,
        int $parentId,
        int $updatedBy,
        string $collectionId,
        string $websiteId,
        int $companyId
    ): array {
        $stmt = $this->conn->prepare(
            "UPDATE collection_data 
             SET data = ?, parent_id = ?, updated_by = ? 
             WHERE id = ?"
        );

        $stmt->execute([
            $jsonData,
            $parentId,
            $updatedBy,
            $id,
        ]);

        return $this->getService->getById($collectionId, $id, $websiteId, $companyId)
            ?? ['error' => 'Failed to update or fetch data.'];
    }
}
