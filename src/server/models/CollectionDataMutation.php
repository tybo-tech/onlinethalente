<?php
require_once 'CollectionDataQuery.php';
class CollectionDataMutation
{
    private $conn;
    private CollectionDataQuery $collectionDataQuery;

    public function __construct($db)
    {
        $this->conn = $db;
        $this->collectionDataQuery = new CollectionDataQuery($db);
    }

    // Add a new data entry
    public function add($data)
    {
        $clean = $this->sanitizeDataBeforeSave($data->data);
        $query = "INSERT INTO collection_data (collection_id,parent_id, website_id,data) VALUES (?, ?, ?, ?)";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([
            $data->collection_id,
            $data->parent_id,
            $data->website_id,
            json_encode($clean)
        ]);
        return $stmt->rowCount() ?
            $this->collectionDataQuery->getById($this->conn->lastInsertId()) :
            false;
    }

    // Update a data entry
    public function update($data)
    {
        $clean = $this->sanitizeDataBeforeSave($data->data);
        $query = "UPDATE collection_data SET data = ? WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        $stmt->execute([json_encode($clean), $data->id]);

        $updated = $this->collectionDataQuery->getById($data->id);
        if (!$updated || !isset($updated['id']) || $updated['id'] != $data->id) {
            return false; // If the data entry does not exist
        }
        $updated["updated"] = $stmt->rowCount() > 0 ? true : false;

        // Update children if they exist
        $chidren = $data->children ?? [];
        if (!empty($chidren)) {
            $this->saveChildren($chidren, $data->id);
            $updated["children"] = $this->collectionDataQuery->getChildren($data->id);
        }
        return $updated;
    }

    public function saveChildren(array $children, int $parentId)
    {
        foreach ($children as $child) {
            $child = (object) $child; // Ensure object form
            $child = $this->sanitizeDataBeforeSave($child);

            // Ensure required fields
            $child->parent_id = $parentId;
            $child->website_id = $child->website_id ?? 'Viviid';
            $child->collection_id = $child->collection_id ?? 'variation_options';

            if (!isset($child->id) || $child->id == 0) {
                // New child
                $this->add($child);
            } else {
                // Update existing child
                $query = "UPDATE collection_data SET data = ? WHERE id = ?";
                $stmt = $this->conn->prepare($query);
                $stmt->execute([json_encode($child->data), $child->id]);
            }
        }
    }


    // Update multiple records
    public function updateMany($ids, $data)
    {
        $data = $this->sanitizeDataBeforeSave($data);
        $query = "UPDATE collection_data SET data = ? WHERE id IN (" . implode(',', array_fill(0, count($ids), '?')) . ")";
        $stmt = $this->conn->prepare($query);
        $stmt->execute(array_merge([json_encode($data)], $ids));
        return $stmt->rowCount();
    }



    // Delete a data entry by ID
    public function remove($id)
    {
        $query = "DELETE FROM collection_data WHERE id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$id]);
    }

    // Delete all data entries for a specific collection
    public function removeByCollectionId($collectionId)
    {
        $query = "DELETE FROM collection_data WHERE collection_id = ?";
        $stmt = $this->conn->prepare($query);
        return $stmt->execute([$collectionId]);
    }

    // ------------------------------------------
    // Private helper: clean expanded data fields
    // ------------------------------------------
    private function sanitizeDataBeforeSave(object $data): object
    {
        foreach ($data as $key => $value) {
            if (strpos($key, '_') === 0) {
                unset($data->$key);
            }
        }
        return $data;
    }
}
?>