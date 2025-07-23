<?php

class IncludeInstruction
{
    public string $name;          // e.g., "_client"
    public string $field;         // e.g., "clientId"
    public string $collection_id; // e.g., "clients"
    public bool $isArray;         // true if it's an array of IDs

    public function __construct($data)
    {
        $this->name = $data['name'] ?? '';
        $this->field = $data['field'] ?? '';
        $this->collection_id = $data['collection_id'] ?? '';
        $this->isArray = $data['isArray'] ?? false;
    }

    public function isValid(): bool
    {
        return $this->name && $this->field && $this->collection_id;
    }
}
