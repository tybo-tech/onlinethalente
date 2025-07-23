<?php
class CollectionLinkQuery
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function getAll()
    {
        $stmt = $this->conn->query("SELECT * FROM collection_link ORDER BY id DESC");
        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getBySource($sourceId, $relationType = null)
    {
        $query = "SELECT * FROM collection_link WHERE source_id = ?";
        $params = [$sourceId];

        if ($relationType) {
            $query .= " AND relation_type = ?";
            $params[] = $relationType;
        }

        $stmt = $this->conn->prepare($query);
        $stmt->execute($params);

        return $stmt->fetchAll(PDO::FETCH_ASSOC);
    }

    public function getTargets($sourceId, $relationType = null)
    {
        $links = $this->getBySource($sourceId, $relationType);
        return array_map(function ($link) {
            return [
                'collection' => $link['target_collection'],
                'id' => $link['target_id'],
                'meta' => json_decode($link['data'], true)
            ];
        }, $links);
    }

    public function getLinkedTargets($sourceId, $sourceCollection, $relationType)
    {
        $query = "SELECT cl.*, cd.* 
              FROM collection_link cl 
              JOIN collection_data cd 
                ON cl.target_id = cd.id 
              WHERE cl.source_id = ? 
                AND cl.source_collection = ? 
                AND cl.relation_type = ?";

        $stmt = $this->conn->prepare($query);
        $stmt->execute([$sourceId, $sourceCollection, $relationType]);

        $results = $stmt->fetchAll(PDO::FETCH_ASSOC);

        // Decode JSON 'data' field for each result
        return array_map(function ($row) {
            $row['data'] = json_decode($row['data'], true);
            return $row;
        }, $results);
    }

}
