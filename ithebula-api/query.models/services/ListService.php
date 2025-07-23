<?php

class ListService
{
    private PDO $conn;

    public function __construct(PDO $db)
    {
        $this->conn = $db;
    }

    /**
     * List items from a collection with support for filters, ordering, and pagination.
     *
     * @param string $collectionId The ID of the collection (e.g., 'clients', 'invoices').
     * @param string $websiteId The website identifier for scoping the data.
     * @param int $companyId The company identifier for multi-tenant isolation.
     * @param FilterInstruction[] $filters Optional filter instructions (e.g., field = value).
     * @param OrderInstruction[] $orders Optional order instructions (e.g., order by field ASC/DESC).
     * @param int|null $page Optional page number for pagination (1-based).
     * @param int|null $limit Optional number of items per page.
     *
     * @return array<string, mixed> {
     *     @type array $data List of matching collection entries.
     *     @type array $meta Metadata including pagination details and total counts.
     * }
     */
    public function list(
        string $collectionId,
        string $websiteId,
        int $companyId,
        array $filters = [],
        array $orders = [],
        ?int $page = null,
        ?int $limit = null
    ): array {
        $where = ["collection_id = :collectionId", "website_id = :websiteId", "company_id = :companyId"];
        $params = [
            ':collectionId' => $collectionId,
            ':websiteId' => $websiteId,
            ':companyId' => $companyId,
        ];

        foreach ($filters as $i => $filter) {
            if (!$filter instanceof FilterInstruction || !$filter->isValid())
                continue;

            $paramKey = ":filter_$i";
            $where[] = "JSON_UNQUOTE(JSON_EXTRACT(data, '$.\"{$filter->field}\"')) {$filter->operator} $paramKey";
            $params[$paramKey] = $filter->value;
        }

        $whereClause = implode(" AND ", $where);

        // Count query
        $countQuery = "SELECT COUNT(*) as total FROM collection_data WHERE $whereClause";
        $countStmt = $this->conn->prepare($countQuery);
        foreach ($params as $key => $value) {
            $countStmt->bindValue($key, $value);
        }
        $countStmt->execute();
        $totalItems = (int) ($countStmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0);

        // Ordering
        $orderBy = "ORDER BY created_at DESC";
        if (!empty($orders)) {
            $orderParts = [];
            foreach ($orders as $order) {
                if ($order instanceof OrderInstruction && $order->isValid()) {
                    $field = $order->field;
                    $dir = strtoupper($order->direction);
                    $orderParts[] = "JSON_UNQUOTE(JSON_EXTRACT(data, '$.\"$field\"')) $dir";
                }
            }
            if (!empty($orderParts)) {
                $orderBy = "ORDER BY " . implode(", ", $orderParts);
            }
        }

        // Build final query
        $sql = "SELECT * FROM collection_data WHERE $whereClause $orderBy";
        $usePagination = ($page !== null && $limit !== null);
        if ($usePagination) {
            $sql .= " LIMIT :limit OFFSET :offset";
        }

        $stmt = $this->conn->prepare($sql);

        // Bind base params
        foreach ($params as $key => $value) {
            $stmt->bindValue($key, $value);
        }

        // Bind pagination separately
        if ($usePagination) {
            $offset = max(0, ($page - 1) * $limit);
            $stmt->bindValue(':limit', (int) $limit, PDO::PARAM_INT);
            $stmt->bindValue(':offset', (int) $offset, PDO::PARAM_INT);
        }

        $stmt->execute();
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        $items = array_map(function ($item) {
            $item['data'] = json_decode($item['data'], true) ?? [];
            return $item;
        }, $items);

        $totalPages = ($limit !== null && $limit > 0) ? (int) ceil($totalItems / $limit) : 1;
        $hasNextPage = $page !== null && $page < $totalPages;
        $hasPreviousPage = $page !== null && $page > 1;

        return [
            'data' => $items,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'count' => count($items),
                'totalItems' => $totalItems,
                'totalPages' => $totalPages,
                'hasNextPage' => $hasNextPage,
                'hasPreviousPage' => $hasPreviousPage,
            ]
        ];
    }


    /**
     * List specific items from a collection by ID array, website and company.
     *
     * @param string $collectionId
     * @param array<int|string> $ids
     * @param string $websiteId
     * @param int $companyId
     * @return array<array<string, mixed>>
     */
    public function listByIds(string $collectionId, array $ids, string $websiteId, int $companyId): array
    {
        if (empty($ids))
            return [];

        $placeholders = implode(',', array_fill(0, count($ids), '?'));
        $query = "SELECT * FROM collection_data 
                  WHERE collection_id = ? AND website_id = ? AND company_id = ? AND id IN ($placeholders)";
        $params = array_merge([$collectionId, $websiteId, $companyId], $ids);

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        return array_map(function ($item) {
            $item['data'] = json_decode($item['data'], true) ?? [];
            return $item;
        }, $items);
    }
}
