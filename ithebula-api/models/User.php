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
        );
        if ($existing) {
            return $this->getById($existing['id']);
        }

        if ($data->company && is_object($data->company) && !empty($data->company->name)) {
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

        $query = "INSERT INTO User (
            name, email, password, role, phone, address,
            created_by, updated_by, statusId, website_id, company_id, metadata
        ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)";

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
            json_encode($data->metadata ?? [])
        ]);

        $id = $this->conn->lastInsertId();
        return $this->getById($id);
    }

    // Update user info
    public function update($data)
    {
        $query = "UPDATE User SET
            name = ?,
            role = ?,
            phone = ?,
            address = ?,
            updated_by = ?,
            updated_at = NOW(),
            statusId = ?,
            website_id = ?,
            company_id = ?,
            metadata = ?
        WHERE id = ?";

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
        }
        return $user;
    }

    // Authenticate a user (website & company)
    public function authenticate($email, $password, $websiteId)
    {
        $user = $this->getByEmail($email, $websiteId);
        if ($user && password_verify($password, $user['password'])) {
            return $user;
        }
        return false;
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
}
?>