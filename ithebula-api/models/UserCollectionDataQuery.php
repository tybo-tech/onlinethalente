<?php

class UserCollectionDataQuery
{
  private $conn;
  private array $items = [];
  private array $userMap = [];

  public function __construct($db)
  {
    $this->conn = $db;
  }

  /**
   * Fetch collection data with users (based on parent_id) and optional pagination/sorting.
   */
  public function getWithUsers(
    string $collectionId,
    string $websiteId,
    int $limit = 100,
    int $offset = 0,
    string $orderBy = 'created_at',
    string $orderDirection = 'DESC'
  ): array {
    $this->loadCollectionData($collectionId, $websiteId, $limit, $offset, $orderBy, $orderDirection);
    $userIds = $this->extractParentUserIds();
    $this->loadUsersByIds($userIds);
    $this->enrichDataWithUsers();

    return $this->items;
  }

private function loadCollectionData(
  string $collectionId,
  string $websiteId,
  int $limit,
  int $offset,
  string $orderBy,
  string $orderDirection
): void {
  // Safeguard against SQL injection in ORDER BY and direction
  $allowedOrderBy = ['id', 'created_at', 'updated_at'];
  $allowedOrderDir = ['ASC', 'DESC'];

  if (!in_array($orderBy, $allowedOrderBy)) {
    $orderBy = 'created_at';
  }

  if (!in_array(strtoupper($orderDirection), $allowedOrderDir)) {
    $orderDirection = 'DESC';
  }

  $query = "SELECT * FROM collection_data
            WHERE collection_id = ? AND website_id = ?
            ORDER BY $orderBy $orderDirection
            LIMIT ? OFFSET ?"; // ✅ Do NOT wrap ? in quotes

  $stmt = $this->conn->prepare($query);
  $stmt->bindValue(1, $collectionId, PDO::PARAM_STR);
  $stmt->bindValue(2, $websiteId, PDO::PARAM_STR);
  $stmt->bindValue(3, $limit, PDO::PARAM_INT);     // ✅ INT
  $stmt->bindValue(4, $offset, PDO::PARAM_INT);    // ✅ INT
  $stmt->execute();

  while ($item = $stmt->fetch(PDO::FETCH_ASSOC)) {
    $item['data'] = json_decode($item['data'], true);
    $this->items[] = $item;
  }
}

  private function extractParentUserIds(): array
  {
    $userIds = [];
    foreach ($this->items as $item) {
      if (!in_array($item['parent_id'], $userIds)) {
        $userIds[] = $item['parent_id'];
      }
    }
    return $userIds;
  }

  private function loadUsersByIds(array $ids): void
  {
    if (empty($ids)) return;

    $placeholders = implode(',', array_fill(0, count($ids), '?'));
    $query = "SELECT * FROM User WHERE id IN ($placeholders)";
    $stmt = $this->conn->prepare($query);
    $stmt->execute($ids);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);

    foreach ($users as $user) {
      $this->userMap[$user['id']] = $user;
    }
  }

  private function enrichDataWithUsers(): void
  {
    foreach ($this->items as &$item) {
      $userId = $item['parent_id'];
      if (isset($this->userMap[$userId])) {
        $item['data']['_user'] = $this->userMap[$userId];
      }
    }
  }
}
