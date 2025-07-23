<?php
require 'config/headers.php';
require 'vendor/autoload.php';
$emailRequest = json_decode(file_get_contents("php://input"));

use PHPMailer\PHPMailer\PHPMailer;
use PHPMailer\PHPMailer\Exception;

$mail = new PHPMailer(true);
$domain = 'iarassociation.co.za';
// Config data
$username = 'support@' . $domain;
$password = '(ktQQC~arD{N';
$host = 'mail.' . $domain;
$port = 465;

try {
    //Server settings
    $mail->SMTPDebug = 0; // Enable verbose debug output (change to 2 for more detailed debug info)
    $mail->isSMTP(); // Set mailer to use SMTP
    $mail->Host = $host; // Specify main and backup SMTP servers
    $mail->SMTPAuth = true; // Enable SMTP authentication
    $mail->Username = $username; // SMTP username
    $mail->Password = $password; // SMTP password
    $mail->SMTPSecure = 'ssl'; // Enable TLS encryption, `ssl` also accepted
    $mail->Port = $port; // TCP port to connect to
    $mail->ContentType = 'text/html';

    //Recipients
    $mail->setFrom($username, $emailRequest->sender_name);
    $mail->addAddress($emailRequest->recipient_email, $emailRequest->recipient_name); // Add a recipient

    // Add BCC recipients
    'accounts@tybo.co.za' !== $emailRequest->recipient_email &&
        $mail->addBCC('accounts@tybo.co.za');
    'mrnnmthembu@gmail.com' !== $emailRequest->recipient_email &&
        $mail->addBCC('mrnnmthembu@gmail.com');

    $mail->isHTML(true); // Set email format to HTML
    $mail->Subject = $emailRequest->subject;
    $mail->Body = format_email($emailRequest);

    $mail->send();
    echo json_encode(array("message" => "Email sent successfully"));

} catch (Exception $e) {
    echo json_encode(array("message" => "Error: " . $mail->ErrorInfo));

}

function format_email($data)
{
    // Sanitize user input
    $recipient_name = htmlspecialchars($data->recipient_name);
    $sender_name = htmlspecialchars($data->sender_name);
    $message = htmlspecialchars($data->message);
    $message = $data->message;

    // Email styles
    $styles = "
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f7f7f7;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                background-color: #fff;
                border-radius: 5px;
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
            }
         
            .content {
                padding: 20px;
            }
        </style>
    ";

    $formatted_message = '<html><head>' . $styles . '</head><body>';
    $formatted_message .= '<div class="container">';
    $formatted_message .= '<div class="content">';
    // $formatted_message .= '<p>Dear ' . $recipient_name . ',</p>';
    $formatted_message .= '<p>' . $message . '</p>';
    // $formatted_message .= '<p>Regards,<br>' . $sender_name . '</p>';
    $formatted_message .= '</div>';
    $formatted_message .= '</div>';
    $formatted_message .= '</body></html>';

    return $formatted_message;
}

?>