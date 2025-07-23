<?php
require_once 'models/APIHandler.php';
require_once 'dompdf/autoload.inc.php';
require_once 'models/tybo-invoice/Invoice.php';

use Dompdf\Dompdf;

$companyId = isset($_GET['company_id']) ? intval($_GET['company_id']) : 1;
$itemId = isset($_GET['itemId']) ? intval($_GET['itemId']) : 0;
// https://docs.tybo.co.za/invoice.php?itemId=86&company_id=1
// API call and data fetch as before...
$postData = [
    "company_id" => $companyId,
    "includeCompany" => true,
    "website_id" => "Tybo-Invoice",
    "collection_id" => "invoices",
    "includes" => [
        [
            "name" => "_client",
            "field" => "clientId",
            "collection_id" => "clients",
            "isArray" => false
        ],
        [
            "name" => "_items",
            "field" => "items",
            "collection_id" => "invoice_items",
            "isArray" => true
        ]
    ],
    "orders" => [["field" => "created_at", "direction" => "DESC"]],
    "page" => 1,
    "limit" => 25,
    "itemId" => $itemId
];
$apiUrl = "https://ithebula.tybo.co.za/api/query/get.php";
$data = APIHandler::postDataToAPI($apiUrl, $postData);

if (!$data || !isset($data['data']) || empty($data['data']) || !$data['company']) {
    die('Invoice not found');
}
$data = json_decode(json_encode($data), false);
// Build Invoice object chain (fully OOP)
$invoice = new Invoice($data->data, $data->company);

// Choose template
$templateType = $invoice->company->metadata->templateType ?? 'classic';
$templateFile = __DIR__ . "/templates/{$templateType}.php";
if (!file_exists($templateFile)) {
    $templateFile = __DIR__ . "/templates/classic.php";
}

// Generate HTML
ob_start();
require $templateFile;
$html = ob_get_clean();

// Render PDF
$dompdf = new Dompdf(['enable_remote' => true]);
$dompdf->loadHtml($html);
$dompdf->setPaper('A4', 'portrait');
$dompdf->render();
$dompdf->stream('Invoice-' . $invoice->number . '.pdf', ['Attachment' => 1]);
