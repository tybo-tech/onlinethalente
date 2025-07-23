<?php

class CollectionDataQuery
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getById($id, $deep = false)
    {
        $query = "SELECT * FROM collection_data WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([$id]);
        $item = $stmt->fetch(PDO::FETCH_ASSOC);
        if ($item) {
            // Convert JSON data to associative array
            $item['data'] = json_decode($item['data'], true);
        }
        return $item;
    }



    public function find(CollectionSearchModel $searchModel)
    {
        $conditions = ["collection_id = ?"];
        $params = [$searchModel->getCollectionId()];

        foreach ($searchModel->getFilters() as $filter) {
            $fieldPath = "JSON_UNQUOTE(JSON_EXTRACT(data, '$.{$filter->getField()}'))";
            $conditions[] = $this->buildOperatorCondition(
                $fieldPath,
                $filter->getOperator(),
                $params,
                $filter->getValue()
            );
        }

        $where = implode(' AND ', $conditions);
        $order = $searchModel->getSortBy()
            ? "ORDER BY JSON_UNQUOTE(JSON_EXTRACT(data, '$.{$searchModel->getSortBy()}')) " . strtoupper($searchModel->getSortOrder())
            : "ORDER BY id ASC";

        $query = "SELECT * FROM collection_data WHERE $where $order";
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        return array_map(function ($item) {
            // Convert JSON data to associative array
            $item['data'] = json_decode($item['data'], true);
            return $item;
        }, $items);
    }

    function getWithChildren($parentId)
    {
        $children = $this->getChildren($parentId);
        $item = $this->getById($parentId);
        if (!$item) {
            return [];
        }
        $item['children'] = $children;

        return $item;
    }
    function getChildren($parentId, $collectionId = null)
    {
        if ($collectionId) {
            $query = "SELECT * FROM collection_data WHERE parent_id = ? AND collection_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$parentId, $collectionId]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $query = "SELECT * FROM collection_data WHERE parent_id = ?";
            $stmt = $this->conn->prepare($query);
            $stmt->execute([$parentId]);
            $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        }


        return array_map(function ($item) {
            // Convert JSON data to associative array
            $item['data'] = json_decode($item['data'], true);
            return $item;
        }, $items);
    }
    public function findMany(
        $websiteId,
        $collectionId,
        $filters = [],
        $limit = null,
        $parent_id = null,
        $childrenCollection = null
    ) {
        $conditions = ["collection_id = ?", "website_id = ?"];
        $params = [$collectionId , $websiteId];

        // Existing filters on the JSON data
        foreach ($filters as $filter) {
            $fieldPath = "JSON_UNQUOTE(JSON_EXTRACT(data, '$.{$filter['field']}'))";
            $conditions[] = $this->buildOperatorCondition(
                $fieldPath,
                $filter['operator'],
                $params,
                $filter['value']
            );
        }

        // New: Parent filter (for top-level categories, $parent_id = 0)
        if ($parent_id !== null) {
            $conditions[] = "parent_id = ?";
            $params[] = $parent_id;
        }

        $where = implode(' AND ', $conditions);
        $order = "ORDER BY id ASC";
        $limitClause = $limit ? "LIMIT $limit" : "";

        $query = "SELECT * FROM collection_data WHERE $where $order $limitClause";
        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);
        if (!$items) {
            return [];
        }

        if ($childrenCollection) {
            // Fetch children for each item
            foreach ($items as &$item) {
                $item['children'] = $this->getChildren($item['id'], $childrenCollection);
            }
        }

        return array_map(function ($item) {
            // Convert JSON data to associative array
            $item['data'] = json_decode($item['data'], true);
            return $item;
        }, $items);
    }

    /**
     * Returns all parent records from a collection that have at least one child.
     *
     * @param string $collectionId (default: 'categories')
     * @param int $parentId (default: 0)
     * @return array
     */
    public function findParentsThatHaveChildren($websiteId, $collectionId = 'categories', $parentId = 0)
    {
        $query = "
        SELECT parent.*, COUNT(child.id) as children_count
        FROM collection_data parent
        LEFT JOIN collection_data child
          ON child.parent_id = parent.id
        WHERE parent.collection_id = ? AND parent.parent_id = ? AND parent.website_id = ?
        GROUP BY parent.id
        HAVING children_count > 0
        ORDER BY parent.id ASC
    ";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$collectionId, $parentId, $websiteId]);
        $items = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Convert data JSON to associative array for each item
        return array_map(function ($item) {
            $item['data'] = json_decode($item['data'], true);
            return $item;
        }, $items);
    }




    private function buildOperatorCondition($fieldPath, $operator, &$params, $value)
    {
        switch ($operator) {
            case 'equals':
                $params[] = $value;
                return "$fieldPath = ?";
            case 'contains':
                $params[] = '%' . $value . '%';
                return "$fieldPath LIKE ?";
            case 'greater_than':
                $params[] = $value;
                return "$fieldPath > ?";
            case 'less_than':
                $params[] = $value;
                return "$fieldPath < ?";
            case 'in':
                if (!is_array($value)) {
                    throw new Exception("Operator 'in' requires an array of values.");
                }
                $placeholders = implode(',', array_fill(0, count($value), '?'));
                $params = array_merge($params, $value);
                return "$fieldPath IN ($placeholders)";
            default:
                throw new Exception("Unsupported operator: $operator");
        }
    }
}


class CollectionSearchModel
{
    private $collectionId;
    private $filters;
    private $sortBy;
    private $sortOrder = 'ASC'; // Default sort order

    public function __construct($data)
    {
        $this->collectionId = $data->collection_id ?? null;

        $filtersRaw = is_array($data->filters ?? null) ? $data->filters : [];
        $this->filters = array_map(function ($filterData) {
            return new CollectionFilter($filterData->field, $filterData->operator, $filterData->value);
        }, $filtersRaw);

        $this->sortBy = $data->sortBy ?? null;
        $this->sortOrder = $data->sortOrder ?? 'ASC';
    }

    public function getCollectionId()
    {
        return $this->collectionId;
    }

    public function getFilters()
    {
        return $this->filters;
    }

    public function getSortBy()
    {
        return $this->sortBy;
    }

    public function getSortOrder()
    {
        return $this->sortOrder;
    }
}

class CollectionFilter
{
    private $field;
    private $operator;
    private $value;

    public function __construct($field, $operator, $value)
    {
        $this->field = $field;
        $this->operator = $operator;
        $this->value = $value;
    }

    public function getField()
    {
        return $this->field;
    }

    public function getOperator()
    {
        return $this->operator;
    }

    public function getValue()
    {
        return $this->value;
    }
}
