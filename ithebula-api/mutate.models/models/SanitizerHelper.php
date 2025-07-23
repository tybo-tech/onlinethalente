<?php
class SanitizerHelper
{
    public static function sanitize(object $data): object
    {
        foreach ($data as $key => $value) {
            if (strpos($key, '_') === 0) {
                unset($data->$key);
            }
        }
        return $data;
    }
}
