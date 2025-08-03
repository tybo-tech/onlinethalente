<?php
class User
{
  private $conn;

  public function __construct($db)
  {
    $this->conn = $db;
  }

  // Check if user exists by email, website, and company
  public function userExistsByEmail($email, $websiteId, $companyId)
  {
    $stmt = $this->conn->prepare("SELECT id FROM User WHERE email = ? AND website_id = ? AND company_id = ?");
    $stmt->execute([$email, $websiteId, $companyId]);
    return $stmt->fetch(PDO::FETCH_ASSOC);
  }

  // Create a new user
  public function create($data)
  {
    $existing = $this->userExistsByEmail(
      $data->email,
      $data->website_id,
      $data->company_id
    )  ?? $this->getByIdNumber(
      $data->id_number ?? null,
      $data->website_id,
      $data->company_id
    );
    if ($existing) {
      return $this->getById($existing['id']);
    }

    if (isset($data->company) && is_object($data->company) && !empty($data->company->name)) {
      // This is sign up with company
      // So we must save the company first and then use its ID
      require_once 'Company.php';
      $companyService = new Company($this->conn);
      $companyData = $companyService->create($data->company);
      if ($companyData && $companyData['id']) {
        $data->company_id = $companyData['id'];
      } else {
        throw new Exception("Failed to create company for user");
      }
    }

    $query = "
        INSERT INTO
  User (
    name,
    email,
    password,
    role,
    phone,
    address,
    created_by,
    updated_by,
    statusId,
    website_id,
    company_id,
    metadata,
    id_number,
    token,
    gender,
    date_of_birth,
    profile_image_url,
    job_title,
    verified_at,
    last_login_at,
    id_document_url,
    is_verified,
    country,
    language_preference,
    notes,
    source
  )
VALUES
  (
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?,
    ?
  )
        ";

    $stmt = $this->conn->prepare($query);
    $hashedPassword = password_hash($data->password, PASSWORD_DEFAULT);
    $stmt->execute([
      $data->name,
      $data->email,
      $hashedPassword,
      $data->role,
      $data->phone,
      $data->address,
      $data->created_by,
      $data->updated_by,
      $data->statusId ?? 1,
      $data->website_id,
      $data->company_id,
      json_encode($data->metadata ?? []),
      $data->id_number ?? null,
      $data->token ?? null,
      $data->gender ?? null,
      $data->date_of_birth ?? null,
      $data->profile_image_url ?? null,
      $data->job_title ?? null,
      $data->verified_at ?? null,
      $data->last_login_at ?? null,
      $data->id_document_url ?? null,
      $data->is_verified ?? 0,
      $data->country ?? null,
      $data->language_preference ?? null,
      $data->notes ?? null,
      $data->source ?? null
    ]);


    $id = $this->conn->lastInsertId();
    return $this->getById($id);
  }

  // Update user info
  public function update($data)
  {
    $query = "
        UPDATE User SET
    name = ?,
    role = ?,
    phone = ?,
    address = ?,
    updated_by = ?,
    updated_at = NOW(),
    statusId = ?,
    website_id = ?,
    company_id = ?,
    metadata = ?,
    id_number = ?,
    token = ?,
    gender = ?,
    date_of_birth = ?,
    profile_image_url = ?,
    job_title = ?,
    verified_at = ?,
    last_login_at = ?,
    id_document_url = ?,
    is_verified = ?,
    country = ?,
    language_preference = ?,
    notes = ?,
    source = ?
WHERE id = ?
        ";

    $stmt = $this->conn->prepare($query);
    $success = $stmt->execute([
      $data->name,
      $data->role,
      $data->phone,
      $data->address,
      $data->updated_by,
      $data->statusId ?? 1,
      $data->website_id,
      $data->company_id,
      json_encode($data->metadata ?? []),
      $data->id_number ?? null,
      $data->token ?? null,
      $data->gender ?? null,
      $data->date_of_birth ?? null,
      $data->profile_image_url ?? null,
      $data->job_title ?? null,
      $data->verified_at ?? null,
      $data->last_login_at ?? null,
      $data->id_document_url ?? null,
      $data->is_verified ?? 0,
      $data->country ?? null,
      $data->language_preference ?? null,
      $data->notes ?? null,
      $data->source ?? null,
      $data->id
    ]);

    return $success ? $this->getById($data->id) : false;
  }

  // Get single user by ID (decode metadata)
  public function getById($id)
  {
    $stmt = $this->conn->prepare("SELECT * FROM User WHERE id = ?");
    $stmt->execute([$id]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
      $user['metadata'] = $this->decodeMetadata($user['metadata'] ?? null);
      $user = $this->unsetPassword($user); // Remove password from response
    }
    return $user;
  }

  // Get user by email, website, and company (decode metadata)
  public function getByEmail($email, $websiteId)
  {
    $stmt = $this->conn->prepare("SELECT * FROM User WHERE email = ? AND website_id = ?");
    $stmt->execute([$email, $websiteId]);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);
    if ($user) {
      $user['metadata'] = $this->decodeMetadata($user['metadata'] ?? null);
      $user = $this->unsetPassword($user); // Remove password from response
    }
    return $user;
  }

  // Get by id Number
  public function getByIdNumber($idNumber, $websiteId, $companyId = null)
  {
    $query = "SELECT * FROM User WHERE id_number = ? AND website_id = ?";
    $params = [$idNumber, $websiteId];

    if ($companyId !== null) {
      $query .= " AND company_id = ?";
      $params[] = $companyId;
    }

    $stmt = $this->conn->prepare($query);
    $stmt->execute($params);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
      $user['metadata'] = $this->decodeMetadata($user['metadata'] ?? null);
      return $this->unsetPassword($user); // Remove password from response
    }
    return false;
  }

  // get user by token
public function getByToken($token)
{
  $stmt = $this->conn->prepare("SELECT * FROM User WHERE token = ?");
  $stmt->execute([$token]);
  $user = $stmt->fetch(PDO::FETCH_ASSOC);

  if ($user) {
    $expiresAt = $user['token_expires_at'];
    if (!$expiresAt || strtotime($expiresAt) < time()) {
      return false; // Token expired
    }

    $user['metadata'] = $this->decodeMetadata($user['metadata'] ?? null);
    return $this->unsetPassword($user);
  }

  return false;
}

  // generate a new token for the user
 public function generateToken($id)
{
  $token = bin2hex(random_bytes(32)); // Secure 64-character token
  $expiresAt = (new DateTime())->modify('+1 hour')->format('Y-m-d H:i:s'); // Fixed 1-hour expiry

  $query = "UPDATE User SET token = ?, token_expires_at = ? WHERE id = ?";
  $stmt = $this->conn->prepare($query);
  $success = $stmt->execute([$token, $expiresAt, $id]);

  return $success ? $this->getById($id) : false;
}

  // clear the token for the user
public function clearToken($id)
{
  $stmt = $this->conn->prepare("UPDATE User SET token = NULL, token_expires_at = NULL WHERE id = ?");
  return $stmt->execute([$id]);
}


  // Authenticate a user (website & company)
  public function authenticate($email, $password, $websiteId, $companyId = null)
  {
    $query = "SELECT * FROM User WHERE email = ? AND website_id = ?";
    $params = [$email, $websiteId];

    if ($companyId !== null) {
      $query .= " AND company_id = ?";
      $params[] = $companyId;
    }

    $stmt = $this->conn->prepare($query);
    $stmt->execute($params);
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user && password_verify($password, $user['password'])) {
      unset($user['password']);
      $user['metadata'] = $this->decodeMetadata($user['metadata'] ?? null);
      return $user;
    }
    return false;
  }



  // List users for a specific company (decode metadata for each row)
  public function getByCompanyId($companyId)
  {
    $stmt = $this->conn->prepare("SELECT * FROM User WHERE company_id = ?");
    $stmt->execute([$companyId]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($users as &$user) {
      $user['metadata'] = $this->decodeMetadata($user['metadata'] ?? null);
      $user = $this->unsetPassword($user); // Remove password from response
    }
    return $users;
  }

  // List users for a specific website and company (decode metadata for each row)
  public function list($websiteId, $companyId)
  {
    $stmt = $this->conn->prepare("SELECT * FROM User WHERE website_id = ? AND company_id = ? ORDER BY created_at DESC");
    $stmt->execute([$websiteId, $companyId]);
    $users = $stmt->fetchAll(PDO::FETCH_ASSOC);
    foreach ($users as &$user) {
      $user['metadata'] = $this->decodeMetadata($user['metadata'] ?? null);
    }
    return $users;
  }

  // Helper for decoding metadata
  private function decodeMetadata($value)
  {
    if (!$value)
      return [];
    $decoded = json_decode($value, true);
    return is_array($decoded) ? $decoded : [];
  }

  // Delete user by ID
  public function delete($id)
  {
    $stmt = $this->conn->prepare("DELETE FROM User WHERE id = ?");
    return $stmt->execute([$id]);
  }

  // Password stuff stays the same

  public function updatePassword($id, $newPassword, $updatedBy)
  {
    $query = "UPDATE User SET password = ?, updated_by = ?, updated_at = NOW() WHERE id = ?";
    $stmt = $this->conn->prepare($query);
    $hashedPassword = password_hash($newPassword, PASSWORD_DEFAULT);
    return $stmt->execute([$hashedPassword, $updatedBy, $id]);
  }

  private function unsetPassword($user)
  {
    if (isset($user['password'])) {
      unset($user['password']);
    }
    return $user;
  }
}
