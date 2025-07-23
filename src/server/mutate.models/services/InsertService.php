<?php

require_once 'GetService.php';

class InsertService
{
    private PDO $conn;
    private GetService $getService;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
        $this->getService = new GetService($db);
    }

    /**
     * Inserts a single record into collection_data with optional slug generation.
     */
    public function insert(
        string $collectionId,
        int $parentId,
        string $websiteId,
        string $jsonData,
        int $companyId,
        int $createdBy,
        string $slugKey = ''
    ) {
        $data = json_decode($jsonData, true);
        $slug = null;

        // Step 1: Attempt to generate slug if key provided
        if ($slugKey && isset($data[$slugKey])) {
            $baseSlug = $this->slugify($data[$slugKey]);
            $slug = $baseSlug;

            // Step 2: Check for uniqueness
            $existing = $this->getService->getBySlug($collectionId, $slug, $websiteId, $companyId);
            if ($existing) {
                $slug = null; // Conflict, will append ID later
            }
        }

        // Step 3: Add slug (if unique at this point)
        if ($slug) {
            $data['slug'] = $slug;
        }

        // Step 4: Sanitize and insert
        $cleanData = SanitizerHelper::sanitize((object) $data);
        $stmt = $this->conn->prepare(
            "INSERT INTO collection_data (
                collection_id, parent_id, website_id, data, company_id, created_by,updated_by
            ) VALUES (?, ?, ?, ?, ?, ?, ?)"
        );
        $stmt->execute([
            $collectionId,
            $parentId,
            $websiteId,
            json_encode($cleanData),
            $companyId,
            $createdBy,
            $createdBy
        ]);

        if (!$stmt->rowCount()) {
            return ['error' => 'Failed to insert record.'];
        }

        $insertedId = $this->conn->lastInsertId();

        // Step 5: If slug was not set due to conflict, append ID and update
        if ($slugKey && !isset($data['slug']) && isset($data[$slugKey])) {
            $newSlug = $this->slugify($data[$slugKey]) . '-' . $insertedId;
            $data['slug'] = $newSlug;

            $stmt = $this->conn->prepare("UPDATE collection_data SET data = ? WHERE id = ?");
            $stmt->execute([
                json_encode($data),
                $insertedId
            ]);
        }

        // Step 6: Return final enriched item
        return $this->getService->getById($collectionId, $insertedId, $websiteId, $companyId);
    }

    private function slugify(string $text): string
    {
        $text = strtolower(trim($text));
        $text = preg_replace('/[^a-z0-9]+/', '-', $text);
        return trim($text, '-');
    }
}
