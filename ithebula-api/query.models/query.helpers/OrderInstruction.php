<?php

class OrderInstruction
{
    public string $field;
    public string $direction; // "asc" or "desc"

    public function __construct(array $data)
    {
        $this->field = $data['field'] ?? '';
        $this->direction = strtolower($data['direction'] ?? 'asc');
    }

    public function isValid(): bool
    {
        return !empty($this->field) && in_array($this->direction, ['asc', 'desc']);
    }
}
