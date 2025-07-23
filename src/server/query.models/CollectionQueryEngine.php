<?php
require_once 'query.helpers/IncludeInstruction.php';
require_once 'query.helpers/QueryModel.php';
require_once 'services/ListService.php';
require_once 'services/GetService.php';
require_once 'IncludeResolver.php';

class CollectionQueryEngine
{
    private IncludeResolver $includeResolver;
    private ListService $listService;
    private GetService $getService;

    public function __construct($db)
    {
        $this->includeResolver = new IncludeResolver($db);
        $this->listService = new ListService($db);
        $this->getService = new GetService($db);
    }

    /**
     * Main method to process a request.
     * 
     * @param object $postData The decoded JSON object from the client
     * @return array Enriched collection data with metadata
     */
    public function run(object $postData): array
    {
        $queryModel = new QueryModel((array) $postData);
        if (!$queryModel->isValid())
            return [];

        $websiteId = $queryModel->website_id;
        $companyId = $queryModel->company_id;
        $collectionId = $queryModel->collection_id;


        if (!$websiteId || !$companyId)
            return []; // Prevent unscoped access

        // Single item mode
        if (!empty($queryModel->itemId)) {
            $item = $this->getService->getById(
                $collectionId,
                $queryModel->itemId,
                $websiteId,
                $companyId
            );
            if (!$item)
                return [];
            error_log("No includes specified for item query :" . $queryModel->includeCompany && $companyId > 0);
            if ($queryModel->includeCompany && $companyId > 0) {
                $item['company'] = $this->includeResolver->resolveCompany(
                    $companyId
                );
                error_log("Company included in item query: " . $item['company']['name'] ?? 'Unknown');
            }

            if (!empty($queryModel->includes)) {
                $enriched = $this->includeResolver->resolve(
                    [$item],
                    $queryModel->includes,
                    $websiteId,
                    $companyId
                );
                return $enriched[0] ?? [];
            }

            return $item;
        }

        // List mode
        $filters = $queryModel->filters;
        $orders = $queryModel->orders;
        $page = $queryModel->page;
        $limit = $queryModel->limit;

        $result = $this->listService->list(
            $collectionId,
            $websiteId,
            (int) $companyId,
            $filters,
            $orders,
            $page,
            $limit
        );

        // Includes only apply to result['data']
        if (!empty($queryModel->includes)) {
            $result['data'] = $this->includeResolver->resolve(
                $result['data'],
                $queryModel->includes,
                $websiteId,
                (int) $companyId
            );
        }

        return $result;
    }
}
