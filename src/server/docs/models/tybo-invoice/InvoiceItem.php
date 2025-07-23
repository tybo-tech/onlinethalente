<?php
class InvoiceItem
{
    public $name;
    public $description;
    public $quantity;
    public $frequency;
    public $unitPrice;
    public $totalPrice;
    public $taxRate;
    public $taxAmount;
    public $notes;
    public $serviceId;

    public function __construct(object $data)
    {
        // Allow both array/object
        error_log("InvoiceItem constructor called with data: " . print_r($data, true));
        $this->name = $data->name ?? '';
        $this->description = $data->description ?? '';
        $this->quantity = $data->quantity ?? 1;
        $this->frequency = $data->frequency ?? '';
        $this->unitPrice = $data->unitPrice ?? $data->unit_price ?? 0.0;
        $this->totalPrice = $data->totalPrice ?? $data->total_price ?? 0.0;
        $this->taxRate = $data->taxRate ?? $data->tax_rate ?? 0.0;
        $this->taxAmount = $data->taxAmount ?? $data->tax_amount ?? 0.0;
        $this->notes = $data->notes ?? '';
        $this->serviceId = $data->serviceId ?? $data->service_id ?? null;
    }
}
