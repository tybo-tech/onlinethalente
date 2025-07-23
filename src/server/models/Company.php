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
            name, email, phone, website, address,
            logo, industry, company_vat,
            statusId, created_by, updated_by, metadata
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

    // Get single company by ID (decode metadata)
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

    // List companies (decode metadata for each row)
    public function list($statusId = 1)
    {
        $stmt = $this->conn->prepare("SELECT * FROM company WHERE statusId = ? ORDER BY created_at DESC");
        $stmt->execute([$statusId]);
        $companies = $stmt->fetchAll(PDO::FETCH_ASSOC);
        foreach ($companies as &$company) {
            $company['metadata'] = $this->decodeMetadata($company['metadata'] ?? null);
        }
        return $companies;
    }

    // Helper for decoding metadata
    private function decodeMetadata($value)
    {
        if (!$value) return [];
        $decoded = json_decode($value, true);
        return is_array($decoded) ? $decoded : [];
    }

    // Delete company by ID
    public function delete($id)
    {
        $stmt = $this->conn->prepare("DELETE FROM company WHERE id = ?");
        return $stmt->execute([$id]);
    }
}
?>
