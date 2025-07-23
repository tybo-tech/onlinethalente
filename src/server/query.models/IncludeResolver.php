<?php

require_once 'query.helpers/IncludeInstruction.php';
require_once 'services/ListService.php';
require_once 'services/GetService.php';

class IncludeResolver
{
    private ListService $listService;
    private GetService $getService;

    public function __construct(PDO $db)
    {
        $this->listService = new ListService($db);
        $this->getService = new GetService($db);
    }

    /**
     * Resolves includes for each item using the provided instructions.
     *
     * @param array $items Items to enrich
     * @param IncludeInstruction[] $includes List of include instructions
     * @param string $websiteId Website context
     * @param int $companyId Company context
     * @return array Enriched items
     */
    public function resolve(array $items, array $includes, string $websiteId, int $companyId): array
    {
        foreach ($includes as $instruction) {
            if (!$instruction->isValid())
                continue;

            if ($instruction->isArray) {
                // Gather all referenced IDs
                $allIds = [];
                foreach ($items as $item) {
                    $field = $item['data'][$instruction->field] ?? null;
                    if (is_array($field)) {
                        $allIds = array_merge($allIds, $field);
                    }
                }

                $allIds = array_unique($allIds);
                if (empty($allIds))
                    continue;

                $relatedItems = $this->listService->listByIds(
                    $instruction->collection_id,
                    $allIds,
                    $websiteId,
                    $companyId
                );

                // Optional: Pre-index relatedItems by id for fast lookup
                $relatedById = [];
                foreach ($relatedItems as $rel) {
                    $relatedById[$rel['id']] = $rel;
                }

                foreach ($items as &$item) {
                    $item['data'][$instruction->name] = [];

                    // Use relation type to determine attach strategy
                    if (($instruction->relationType ?? 'reference') === 'child') {
                        // Attach children by parent_id
                        foreach ($relatedItems as $relatedItem) {
                            if ($relatedItem['parent_id'] == $item['id']) {
                                $item['data'][$instruction->name][] = $relatedItem;
                            }
                        }
                    } else { // Default to 'reference'
                        // Attach related by array of IDs in field
                        $idArray = $item['data'][$instruction->field] ?? [];
                        foreach ($idArray as $refId) {
                            if (isset($relatedById[$refId])) {
                                $item['data'][$instruction->name][] = $relatedById[$refId];
                            }
                        }
                    }
                }
                unset($item); // Break reference for safety
            } else {
                // Single item include
                foreach ($items as &$item) {
                    $id = $item['data'][$instruction->field] ?? null;
                    $item['data'][$instruction->name] = $id
                        ? $this->getService->getById(
                            $instruction->collection_id,
                            $id,
                            $websiteId,
                            $companyId
                        )
                        : null;
                }
                unset($item); // Break reference for safety
            }
        }

        return $items;
    }


    /**
     * Resolves company data for the given website and company.
     *
     * @param string $websiteId Website context
     * @param int $companyId Company context
     * @return array Company data
     */
    public function resolveCompany(int $companyId): array
    {
        return $this->getService->getCompanyById($companyId);
    }
}
