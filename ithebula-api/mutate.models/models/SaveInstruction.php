<?php

class SaveInstruction
{
    public string $source_key;       // e.g., "_items"
    public string $collection_id;    // e.g., "invoice_items"
    public string $target_ref_key;   // e.g., "items"
    public bool $is_array;           // true if the input is an array of objects

    public function __construct(object $data)
    {

        $this->source_key      = $data->source_key ?? '';
        $this->collection_id   = $data->collection_id ?? '';
        $this->target_ref_key  = $data->target_ref_key ?? '';
        $this->is_array        = $data->is_array ?? false;
    }

    public function isValid(): bool
    {
        return $this->source_key !== '' && $this->collection_id !== '' && $this->target_ref_key !== '';
    }

    public function getObjectsFromPayload(object $payload): array
    {
        if (!isset($payload->{$this->source_key})) return [];

        if ($this->is_array) {
            return is_array($payload->{$this->source_key}) ? $payload->{$this->source_key} : [];
        }

        return [$payload->{$this->source_key}]; // wrap single object
    }

    public function setReferenceOnPayload(object &$payload, array $insertedIds): void
    {
        if ($this->is_array) {
            $payload->{$this->target_ref_key} = $insertedIds;
        } else {
            $payload->{$this->target_ref_key} = $insertedIds[0] ?? null;
        }
    }
}
