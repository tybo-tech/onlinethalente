<?php

require_once 'GetService.php';
require_once 'UpdateService.php';
require_once 'SaveManyService.php';

class SaveChildrenService
{
    private GetService $getService;
    private UpdateService $updateService;
    private SaveManyService $saveManyService;

    public function __construct(PDO $db)
    {
        $this->getService = new GetService($db);
        $this->updateService = new UpdateService($db);
        $this->saveManyService = new SaveManyService($db);
    }

    public function process(SaveModel $model, int $parentId): void
    {
        foreach ($model->instructions as $instruction) {
            if (!$instruction->isValid()) {
                continue;
            }

            // Step 1: Extract children from the parent payload
            $data = (array) $model->data;
            $children = $data[$instruction->source_key] ?? [];

            if (!is_array($children) || count($children) === 0) {
                continue;
            }

            // Step 2: Convert children to arrays and assign parent_id
            $children = array_map(function ($child) use ($parentId) {
                $childArr = (array) $child;
                $childArr['parent_id'] = $parentId;
                return $childArr;
            }, $children);

            // Step 3: Save children (insert or update)
            $savedChildren = $this->saveManyService->saveMany(
                $children,
                $instruction->collection_id,
                $model
            );

            // Step 4: Refetch parent for safe mutation
            $parent = $this->getService->getById(
                $model->collection_id,
                $parentId,
                $model->website_id,
                $model->company_id
            );

            if (!$parent || !isset($parent['data'])) {
                continue;
            }

            // Step 5: Update reference field on parent with saved child IDs
            $parentData = $parent['data'];
            $parentData[$instruction->target_ref_key] = array_map(
                fn($child) => $child['id'],
                $savedChildren
            );

            // Step 6: Persist updated parent data
            $this->updateService->update(
                $parentId,
                json_encode($parentData),
                $parent['parent_id'] ?? 0,
                $model->updated_by ?? $model->created_by,
                $model->collection_id,
                $model->website_id,
                $model->company_id
            );
        }
    }
}
