<?php

class FilterInstruction
{
    public string $field;
    public string $operator;
    public mixed $value;

    public function __construct(array $data)
    {
        $this->field = $data['field'] ?? '';
        $this->operator = $data['operator'] ?? '=';
        $this->value = $data['value'] ?? null;
    }

    public function isValid(): bool
    {
        return !empty($this->field) && isset($this->value) && in_array($this->operator, ['=', '!=', '<', '<=', '>', '>=', 'LIKE']);
    }
}
