<?php


class UpdateManyService
{
    private PDO $conn;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    /**
     * Updates multiple records and returns updated objects.
     *
     * Each item must contain:
     *  - id (int)
     *  - data (object)
     *  - parent_id (int)
     *  - updated_by (int)
     */
    public function updateMany(array $items): array
    {
        $updated = [];

        foreach ($items as $item) {
            if (
                empty($item['id']) ||
                empty($item['data']) ||
                !isset($item['parent_id']) ||
                empty($item['updated_by'])
            ) {
                continue;
            }

            $sanitized = SanitizerHelper::sanitize((object) $item['data']);

            $stmt = $this->conn->prepare(
                "UPDATE collection_data SET data = ?, parent_id = ?, updated_by = ? WHERE id = ?"
            );

            $stmt->execute([
                json_encode($sanitized),
                $item['parent_id'],
                $item['updated_by'],
                $item['id'],
            ]);

            $updated[] = $item;

        }

        return $updated;
    }
}
