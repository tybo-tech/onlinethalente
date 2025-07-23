<?php
class Client
{
    public $name;
    public $email;
    public $phone;
    public $companyName;
    public $companyVat;
    public $address;
    public $notes;
    public $tags;

    public function __construct(object $data)
    {
        $this->name = $data->name ?? '';
        $this->email = $data->email ?? '';
        $this->phone = $data->phone ?? '';
        $this->companyName = $data->companyName ?? $data->company_name ?? '';
        $this->companyVat = $data->companyVat ?? $data->company_vat ?? '';
        $this->address = $data->address ?? '';
        $this->notes = $data->notes ?? '';
        $this->tags = $data->tags ?? [];
    }
}
