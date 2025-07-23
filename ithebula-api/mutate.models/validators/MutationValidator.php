<?php

class MutationValidator
{
    public static function validate(SaveModel $model): void
    {
        if (empty($model->action)) {
            throw new Exception("Missing action.");
        }

        if (empty($model->company_id)) {
            throw new Exception("Missing company_id.");
        }

        if (empty($model->collection_id)) {
            throw new Exception("Missing collection_id.");
        }

        if (empty($model->website_id)) {
            throw new Exception("Missing website_id.");
        }

        switch ($model->action) {
            case 'insert':
                if (!$model->data || !$model->created_by) {
                    throw new Exception("Insert requires 'data' and 'created_by'.");
                }
                break;

            case 'update':
                if (!$model->id || !$model->data || !$model->updated_by) {
                    throw new Exception("Update requires 'id', 'data', and 'updated_by'.");
                }
                break;

            case 'insertMany':
            case 'updateMany':
                if (empty($model->items)) {
                    throw new Exception("{$model->action} requires 'items'.");
                }
                break;

            case 'deleteMany':
                if (empty($model->ids)) {
                    throw new Exception("deleteMany requires 'ids'.");
                }
                break;

            default:
                throw new Exception("Unknown action '{$model->action}'.");
        }
    }
}
