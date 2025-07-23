<?php

require_once 'SanitizerHelper.php';
require_once 'SaveInstruction.php';

class SaveModel
{
    public string $action;
    public string $slugKey;
    public int $company_id;
    public int $parent_id;
    public string $collection_id;
    public string $website_id;

    public ?int $id = null;
    public ?array $ids = null;
    public ?array $items = null;
    public ?object $data = null;
    public ?int $created_by = null;
    public ?int $updated_by = null;

    /** @var SaveInstruction[] */
    public array $instructions = [];

    public function __construct(object $payload)
    {
        $this->action = $payload->action;
        $this->company_id = (int) $payload->company_id;
        $this->collection_id = $payload->collection_id;
        $this->website_id = $payload->website_id;
        $this->parent_id = $payload->parent_id ?? 0;
        $this->slugKey = $payload->slug_key ?? '';

        $this->id = $payload->id ?? null;
        $this->ids = isset($payload->ids) && is_array($payload->ids) ? $payload->ids : null;
        $this->items = isset($payload->items) && is_array($payload->items) ? $payload->items : null;
        $this->data = isset($payload->data) && is_object($payload->data) ? $payload->data : null;
        $this->created_by = $payload->created_by ?? null;
        $this->updated_by = $payload->updated_by ?? null;


        // Handle instructions as objects
        if (isset($payload->instructions) && is_array($payload->instructions)) {
            foreach ($payload->instructions as $instruction) {
                $this->instructions[] = new SaveInstruction($instruction); // pass as object
            }
        }
    }

  public function getSanitizedJson(): string
{
    $cloned = json_decode(json_encode($this->data)); // Deep copy
    $clean = SanitizerHelper::sanitize($cloned);
    return json_encode($clean);
}
    public function getValidInstructions(): array
    {
        return array_filter($this->instructions, fn($i) => $i->isValid());
    }

    public function hasInstructions(): bool
    {
        return !empty($this->getValidInstructions());
    }

    public function getInstructionDataMap(): array
    {
        $map = [];

        foreach ($this->getValidInstructions() as $instruction) {
            $map[$instruction->collectionId] = $instruction->getObjectsFromPayload($this->data);
        }

        return $map;
    }
}
