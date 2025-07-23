<?php

class GetService
{
    private PDO $conn;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    /**
     * Get a single item from a collection by ID, scoped to website and company.
     *
     * @param string $collectionId
     * @param int|string $id
     * @param string $websiteId
     * @param int $companyId
     * @return array|null
     */
    public function getById(string $collectionId, $id, string $websiteId, int $companyId): ?array
    {
        $query = "SELECT * FROM collection_data 
                  WHERE collection_id = ? AND id = ? AND website_id = ? AND company_id = ? 
                  LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId, $id, $websiteId, $companyId]);

        $item = $stmt->fetch(PDO::FETCH_ASSOC);

        if (!$item)
            return null;

        $item['data'] = json_decode($item['data'], true) ?? [];
        return $item;
    }
    public function getBySlug(string $collectionId, string $slug, string $websiteId, int $companyId): ?array
    {
        $query = "SELECT * FROM collection_data 
              WHERE collection_id = ? AND slug = ? AND website_id = ? AND company_id = ?
              LIMIT 1";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId, $slug, $websiteId, $companyId]);

        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if (!$item)
            return null;

        $item['data'] = json_decode($item['data'], true) ?? [];
        return $item;
    }

}
