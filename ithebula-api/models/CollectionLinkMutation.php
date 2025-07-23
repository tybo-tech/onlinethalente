<?php
class CollectionLinkMutation
{
    private $conn;

    public function __construct($db)
    {
        $this->conn = $db;
    }

    public function add($link)
    {
        $exist = $this->getByByCompositeKey(
            $link->source_id,
            $link->source_collection,
            $link->target_id,
            $link->target_collection,
            $link->relation_type
        );
        if ($exist) {
            return $exist; // Return existing link if it already exists
        }
        $query = "INSERT INTO collection_link (source_id, source_collection, target_id, target_collection, relation_type, data)
                  VALUES (?, ?, ?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            $link->source_id,
            $link->source_collection,
            $link->target_id,
            $link->target_collection,
            $link->relation_type,
            json_encode($link->data ?? [])
        ]);
        $id = $this->conn->lastInsertId();
        return $this->getById($id);

    }

    function getByByCompositeKey($sourceId, $sourceCollection, $targetId, $targetCollection, $relationType)
    {
        $stmt = $this->conn->prepare("SELECT * FROM collection_link WHERE source_id = ? AND source_collection = ? AND target_id = ? AND target_collection = ? AND relation_type = ?");
        $stmt->execute([$sourceId, $sourceCollection, $targetId, $targetCollection, $relationType]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }

    public function remove($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM collection_link WHERE id = ?");
        return $stmt->execute([$id]);
    }

    public function removeByNodes($sourceId, $targetId)
    {
        $stmt = $this->conn->prepare("DELETE FROM collection_link WHERE source_id = ? AND target_id = ?");
        return $stmt->execute([$sourceId, $targetId]);
    }

    function getById($id)
    {
        $stmt = $this->conn->prepare("SELECT * FROM collection_link WHERE id = ?");
        $stmt->execute([$id]);
        return $stmt->fetch(PDO::FETCH_ASSOC);
    }
}
