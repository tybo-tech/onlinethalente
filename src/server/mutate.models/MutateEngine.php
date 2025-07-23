<?php

require_once 'models/SaveModel.php';
require_once 'validators/MutationValidator.php';

require_once 'services/InsertService.php';
require_once 'services/UpdateService.php';
require_once 'services/InsertManyService.php';
require_once 'services/UpdateManyService.php';
require_once 'services/DeleteService.php';
require_once 'services/DeleteManyService.php';
require_once 'services/SaveChildrenService.php';

class MutateEngine
{
    private InsertService $insertService;
    private UpdateService $updateService;
    private InsertManyService $insertManyService;
    private UpdateManyService $updateManyService;
    private DeleteService $deleteService;
    private DeleteManyService $deleteManyService;
    private SaveChildrenService $saveChildrenService;

    public function __construct(PDO $db)
    {
        $this->insertService = new InsertService($db);
        $this->updateService = new UpdateService($db);
        $this->insertManyService = new InsertManyService($db);
        $this->updateManyService = new UpdateManyService($db);
        $this->deleteService = new DeleteService($db);
        $this->deleteManyService = new DeleteManyService($db);
        $this->saveChildrenService = new SaveChildrenService($db);
    }

    public function run(object $postData)
    {
        try {
            // Prepare model
            $model = new SaveModel($postData);

            // Validate input
            MutationValidator::validate($model);
            // Dispatch action
            switch ($model->action) {
                case 'insert':
                    $parent = $this->insertService->insert(
                        $model->collection_id,
                        $model->parent_id,
                        $model->website_id,
                        $model->getSanitizedJson(),
                        $model->company_id,
                        $model->created_by,
                        $model->slugKey
                    );

                    if (isset($parent['id']) && !empty($model->instructions)) {
                        $this->saveChildrenService->process($model, $parent['id']);
                    }

                    return $parent;

                case 'update':
                    $updated = $this->updateService->update(
                        $model->id,
                        $model->getSanitizedJson(),
                        $model->parent_id,
                        $model->updated_by,
                        $model->collection_id,
                        $model->website_id,
                        $model->company_id
                    );

                    if (!empty($model->instructions)) {
                        $this->saveChildrenService->process($model, $model->id);
                    }

                    return $updated;

                case 'insertMany':
                    return $this->insertManyService->insertMany($model->items);

                case 'updateMany':
                    return $this->updateManyService->updateMany($model->items);

                case 'delete':
                    return $this->deleteService->delete($model->id);

                case 'deleteMany':
                    return $this->deleteManyService->deleteMany($model->ids);

                default:
                    return ['error' => 'Unknown action: ' . $model->action];
            }
        } catch (Exception $e) {
            return ['error' => $e->getMessage()];
        }
    }
}
