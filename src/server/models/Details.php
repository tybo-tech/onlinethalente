<?php
require_once 'CollectionDataQuery.php';
require_once 'CollectionLinkQuery.php';

class Details
{
    private $conn;
    private $collectionDataQuery;
    private $collectionLinkQuery;

    public function __construct($db)
    {
        $this->conn = $db;
        $this->collectionDataQuery = new CollectionDataQuery($db);
        $this->collectionLinkQuery = new CollectionLinkQuery($db);
    }

    public function getByIdWithJoins($id, $joinsString = '')
    {
        $item = $this->collectionDataQuery->getById($id);
        if (!$item) return null;

        $joins = $this->parseJoins($joinsString);

        foreach ($joins as $relationType) {
            $linked = $this->collectionLinkQuery->getLinkedTargets(
                $id,
                $item['collection_id'],
                $relationType
            );
            $item[$relationType] = $linked;
        }

        return $item;
    }

    private function parseJoins(string $joinsString): array
    {
        return array_filter(array_map('trim', explode(',', $joinsString)));
    }
}
