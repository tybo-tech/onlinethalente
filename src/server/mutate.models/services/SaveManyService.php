<?php

require_once 'InsertService.php';
require_once 'UpdateService.php';

class SaveManyService
{
    private InsertService $insertService;
    private UpdateService $updateService;

    public function __construct(PDO $db)
    {
        $this->insertService = new InsertService($db);
        $this->updateService = new UpdateService($db);
    }

    /**
     * Save a list of items — inserting or updating as needed.
     * Each item must include 'parent_id', 'collection_id', 'website_id', etc.
     *
     * @param array $items
     * @param string $collectionId
     * @param SaveModel $model
     * @return array
     */
    public function saveMany(array $items, string $collectionId, SaveModel $model): array
    {
       
        $saved = [];

        foreach ($items as $item) {
            $json = json_encode($item['data']);

            if (isset($item['id']) && $item['id'] > 0) {
                $saved[] = $this->updateService->update(
                    $item['id'],
                    $json,
                    $item['parent_id'] ?? 0,
                    $model->updated_by,
                    $collectionId,
                    $model->website_id,
                    $model->company_id
                );
            } else {
                $saved[] = $this->insertService->insert(
                    $collectionId,
                    $item['parent_id'] ?? 0,
                    $model->website_id,
                    $json,
                    $model->company_id,
                    $model->created_by,
                    '' // skip slugKey for children
                );
            }
        }

        return $saved;
    }
}
