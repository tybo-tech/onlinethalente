<?php
require_once 'Client.php';
require_once 'Company.php';
require_once 'InvoiceItem.php'; // Ensure you load this too

class Invoice
{
    public $type;
    public $number;
    public $clientId;
    public $client;       // Client object
    public $issueDate;
    public $dueDate;
    public $status;
    public $notes;
    /** @var InvoiceItem[] */
    public $items = [];   // array of InvoiceItem
    public $subtotal;
    public $tax;
    public $total;
    public $discount;
    public $currency;
    public $terms;
    public $organizationId;
    public Company $company;

    /**
     * @param array|object $data - Invoice data array/object
     * @param Company|null $company - Company object with metadata
     */
    public function __construct($data, $company)
    {
        $this->company = new Company($company);

        // Allow data as array or object
        $this->type = $data->type ?? 'invoice';
        $this->number = $data->number ?? '';
        $this->clientId = $data->clientId ?? $data->client_id ?? null;

        // Support both direct client or nested '_client'
        if ($data->_client && $data->_client->data) {
            $this->client = new Client($data->_client->data);
        }

        $this->issueDate = $data->issueDate ?? $data->issue_date ?? '';
        $this->dueDate = $data->dueDate ?? $data->due_date ?? '';
        $this->status = $data->status ?? 'draft';
        $this->notes = $data->notes ?? '';
        $this->subtotal = $data->subtotal ?? 0.0;
        $this->tax = $data->tax ?? 0.0;
        $this->total = $data->total ?? 0.0;
        $this->discount = $data->discount ?? 0.0;
        $this->currency = $data->currency ?? 'R';
        $this->terms = $data->terms ?? '';
        $this->organizationId = $data->organizationId ?? $data->organization_id ?? 0;


        // Accept both items as objects or array under '_items'
        $this->items = [];
        if ($data->_items && is_array($data->_items) && !empty($data->_items)) {
            foreach ($data->_items as $itemData) {
                $this->items[] = new InvoiceItem($itemData->data);
            }
        }
    }

    public function getStatusLabel()
    {
        return ucfirst($this->status);
    }

    public function getTotalFormatted()
    {
        return $this->currency . number_format($this->total, 2);
    }

    // You can add more helpers (e.g. for subtotal, date formatting, etc.)
}
