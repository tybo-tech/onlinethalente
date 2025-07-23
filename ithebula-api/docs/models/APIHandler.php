<?php
class APIHandler {
    public static function postDataToAPI($apiUrl, $postData) {
        $ch = curl_init($apiUrl);

        curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
        curl_setopt($ch, CURLOPT_POST, true);
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($postData));
        curl_setopt($ch, CURLOPT_HTTPHEADER, [
            'Content-Type: application/json'
        ]);
        curl_setopt($ch, CURLOPT_SSL_VERIFYPEER, false); // Change for production if needed

        $jsonData = curl_exec($ch);

        if ($jsonData === false) {
            return null;
        }

        $data = json_decode($jsonData, true);

        curl_close($ch);

        if (json_last_error() !== JSON_ERROR_NONE) {
            return null;
        }

        return $data;
    }
}
