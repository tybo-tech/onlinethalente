<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');
header('Content-Type: application/json');

function get_input($key)
{
    if (isset($_GET[$key]) && !empty($_GET[$key])) {
        return $_GET[$key];
    }
    return null;
}

function findFromArray($array, $key, $value)
{
    foreach ($array as $item) {
        if ($item[$key] == $value) {
            return $item;
        }
    }
    return null;
}