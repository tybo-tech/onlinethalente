<?php

require_once 'IncludeInstruction.php';
require_once 'FilterInstruction.php';
require_once 'OrderInstruction.php';

class QueryModel
{
    public string $itemId = ''; // Optional, used for single item queries
    public string $collection_id;
    public string $website_id;
    public int $company_id;

    public int $page = 1;
    public int $limit = 200; // Default limit for pagination

    public bool $includeCompany = false; // Whether to include company data in results

    /** @var IncludeInstruction[] */
    public array $includes = [];


    /** @var FilterInstruction[] */
    public array $filters = [];

    /** @var OrderInstruction[] */
    public array $orders = [];

    public function __construct(array $data)
    {
        $this->collection_id = $data['collection_id'] ?? '';
        $this->website_id = $data['website_id'] ?? '';
        $this->company_id = isset($data['company_id']) ? (int) $data['company_id'] : 0;
        $this->itemId = $data['itemId'] ?? '';
        $this->page = isset($data['page']) ? max(1, (int) $data['page']) : 1;
        $this->limit = isset($data['limit']) ? max(1, (int) $data['limit']) : 25;
        $this->includeCompany = !empty($data['includeCompany']) && (bool) $data['includeCompany'];

        if (!empty($data['includes']) && is_array($data['includes'])) {
            $this->includes = array_map(function ($include) {
                return new IncludeInstruction((array) $include);
            }, $data['includes']);
        }

        if (!empty($data['filters']) && is_array($data['filters'])) {
            $this->filters = array_map(fn($f) =>
                new FilterInstruction((array) $f), $data['filters']);
        }

        if (!empty($data['orders']) && is_array($data['orders'])) {
            $this->orders = array_map(fn($o) =>
                new OrderInstruction((array) $o), $data['orders']);
        }
    }

    /**
     * Validates if the required fields are present.
     * @return bool
     */
    public function isValid(): bool
    {
        return !empty($this->collection_id) && !empty($this->website_id) && $this->company_id > 0;
    }
}
