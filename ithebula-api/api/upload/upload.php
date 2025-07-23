<?php
// Allow CORS
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PATCH, PUT, DELETE, OPTIONS');
header('Access-Control-Allow-Headers: Origin, Content-Type, X-Auth-Token');

// Check if file was uploaded
if (isset($_FILES['file'])) {
    $target_dir = "uploads/";
    $file = $_FILES['file'];

    // Get and sanitize extension
    $ext = strtolower(pathinfo($file['name'], PATHINFO_EXTENSION));
    $allowed_exts = ['jpg', 'jpeg', 'png', 'gif', 'webp'];

    if (!in_array($ext, $allowed_exts)) {
        echo json_encode(['error' => 'Invalid file type']);
        exit;
    }

    // Generate a unique filename: timestamp + random + extension
    $uniqueName = 'img_' . time() . '_' . bin2hex(random_bytes(4)) . '.' . $ext;
    $target_file = $target_dir . $uniqueName;

    // Move file
    if (move_uploaded_file($file['tmp_name'], $target_file)) {
        $url = $target_file;

        // If client passed a base Url
        if (isset($_POST['Url'])) {
            $url = rtrim($_POST['Url'], '/') . '/' . ltrim($target_file, '/');
        }

        echo json_encode(['success' => true, 'url' => $url]);
    } else {
        echo json_encode(['error' => 'Upload failed', 'details' => $file['error']]);
    }
} else {
    echo json_encode(['error' => 'Missing file']);
}
