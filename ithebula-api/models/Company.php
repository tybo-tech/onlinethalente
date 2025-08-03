<?php
class Company
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Create a new company
  public function create($data)
  {
    $query = "INSERT INTO company (
      name,
      email,
      phone,
      website,
      address,
      logo,
      industry,
      company_vat,
      statusId,
      created_by,
      updated_by,
      metadata
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

    $stmt = $this->conn->prepare($query);
    $stmt->execute([
      $data->name,
      $data->email ?? null,
      $data->phone ?? null,
      $data->website ?? null,
      $data->address ?? null,
      $data->logo ?? null,
      $data->industry ?? null,
      $data->company_vat ?? null,
      $data->statusId ?? 1,
      $data->created_by ?? 0,
      $data->updated_by ?? 0,
      json_encode($data->metadata ?? [])
    ]);

    $id = $this->conn->lastInsertId();
    return $this->getById($id);
  }

  // Update company info
  public function update($data)
  {
    $query = "UPDATE company SET
      name = ?,
      email = ?,
      phone = ?,
      website = ?,
      address = ?,
      logo = ?,
      industry = ?,
      company_vat = ?,
      statusId = ?,
      updated_by = ?,
      metadata = ?,
      updated_at = NOW()
    WHERE id = ?";

    $stmt = $this->conn->prepare($query);
    $success = $stmt->execute([
      $data->name,
      $data->email ?? null,
      $data->phone ?? null,
      $data->website ?? null,
      $data->address ?? null,
      $data->logo ?? null,
      $data->industry ?? null,
      $data->company_vat ?? null,
      $data->statusId ?? 1,
      $data->updated_by ?? 0,
      json_encode($data->metadata ?? []),
      $data->id
    ]);

    return $success ? $this->getById($data->id) : false;
  }

  // Get single company by ID
  public function getById($id)
  {
    $stmt = $this->conn->prepare("SELECT * FROM company WHERE id = ?");
    $stmt->execute([$id]);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($company) {
      $company['metadata'] = $this->decodeMetadata($company['metadata'] ?? null);
    }
    return $company;
  }

  // List companies
  public function list($statusId = 1, $limit = 100, $offset = 0, $sortBy = 'created_at', $sortOrder = 'DESC')
  {
    $allowedSortFields = ['id', 'name', 'created_at', 'updated_at'];
    $allowedSortOrders = ['ASC', 'DESC'];

    if (!in_array($sortBy, $allowedSortFields)) $sortBy = 'created_at';
    if (!in_array(strtoupper($sortOrder), $allowedSortOrders)) $sortOrder = 'DESC';

    $query = "SELECT * FROM company WHERE statusId = ? ORDER BY $sortBy $sortOrder LIMIT ? OFFSET ?";
    $stmt = $this->conn->prepare($query);
    $stmt->bindValue(1, $statusId, PDO::PARAM_INT);
    $stmt->bindValue(2, $limit, PDO::PARAM_INT);
    $stmt->bindValue(3, $offset, PDO::PARAM_INT);
    $stmt->execute();

    $companies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($companies as &$company) {
      $company['metadata'] = $this->decodeMetadata($company['metadata'] ?? null);
    }

    return $companies;
  }

  // Search companies by name, VAT, or ID
  public function search($query, $statusId = 1)
  {
    $like = "%$query%";
    $stmt = $this->conn->prepare("SELECT * FROM company WHERE (name LIKE ? OR company_vat LIKE ? OR id LIKE ?) AND statusId = ? ORDER BY created_at DESC");
    $stmt->execute([$like, $like, $like, $statusId]);

    $companies = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($companies as &$company) {
      $company['metadata'] = $this->decodeMetadata($company['metadata'] ?? null);
    }

    return $companies;
  }

  // Find by exact name or VAT
  public function findByNameOrVat($name = null, $vat = null)
  {
    $query = "SELECT * FROM company WHERE statusId = 1";
    $params = [];

    if ($vat) {
      $query .= " AND company_vat = ?";
      $params[] = $vat;
    } elseif ($name) {
      $query .= " AND name = ?";
      $params[] = $name;
    } else {
      return null;
    }

    $stmt = $this->conn->prepare($query);
    $stmt->execute($params);
    $company = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($company) {
      $company['metadata'] = $this->decodeMetadata($company['metadata'] ?? null);
    }

    return $company ?: null;
  }

  // Count companies by status
  public function count($statusId = 1)
  {
    $stmt = $this->conn->prepare("SELECT COUNT(*) as total FROM company WHERE statusId = ?");
    $stmt->execute([$statusId]);
    return $stmt->fetch(PDO::FETCH_ASSOC)['total'] ?? 0;
  }

  // Delete company
  public function delete($id)
  {
    $stmt = $this->conn->prepare("DELETE FROM company WHERE id = ?");
    return $stmt->execute([$id]);
  }

  // Helper: decode JSON safely
  private function decodeMetadata($value)
  {
    if (!$value) return [];
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
  }
}
