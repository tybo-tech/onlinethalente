<?php


class InsertManyService
{
    private PDO $conn;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    /**
     * Inserts multiple records and returns their new IDs.
     *
     * @param array $items Array of associative arrays, each with:
     *   - collection_id
     *   - parent_id
     *   - website_id
     *   - company_id
     *   - created_by
     *   - data (object)
     * @return array Inserted record IDs
     */
    public function insertMany(array $items): array
    {
        $ids = [];

        foreach ($items as $item) {
            if (
                empty($item['collection_id']) ||
                !isset($item['parent_id']) ||
                empty($item['website_id']) ||
                empty($item['company_id']) ||
                empty($item['created_by']) ||
                empty($item['data'])
            ) {
                continue; // Skip incomplete entries
            }

            $cleanData = SanitizerHelper::sanitize((object)$item['data']);

            $stmt = $this->conn->prepare(
                "INSERT INTO collection_data (
                    collection_id, parent_id, website_id, data, company_id, created_by
                ) VALUES (?, ?, ?, ?, ?, ?)"
            );

            $stmt->execute([
                $item['collection_id'],
                $item['parent_id'],
                $item['website_id'],
                json_encode($cleanData),
                $item['company_id'],
                $item['created_by'],
            ]);

            if ($stmt->rowCount()) {
                $ids[] = $this->conn->lastInsertId();
            }
        }

        return $ids;
    }
}
