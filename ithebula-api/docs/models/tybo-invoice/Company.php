<?php
require_once 'CompanyMetadata.php';

class Company {
    public $id;
    public $name;
    public $email;
    public $phone;
    public $website;
    public $address;
    public $logo;
    public $industry;
    public $companyVat;
    public $statusId;
    /** @var CompanyMetadata */
    public CompanyMetadata $metadata; // Strongly typed metadata

    public function __construct(object $data) {
        foreach ($data as $k => $v) {
            if ($k === 'metadata') continue; // We'll handle below
            $this->$k = $v;
        }
        // Always create a CompanyMetadata object (from $metadata param, or $data['metadata'])
        $this->metadata = new CompanyMetadata($data->metadata);
    }

    // Helpers to access metadata properties directly
    public function getPrimaryColor()    { return $this->metadata->getPrimaryColor(); }
    public function getAccentColor()     { return $this->metadata->getAccentColor(); }
    public function getTemplateType()    { return $this->metadata->templateType; }
    public function getFooterText()      { return $this->metadata->getFooterText(); }
    public function getTermsText()       { return $this->metadata->getTermsText(); }
    public function showBankBox()        { return $this->metadata->showBankBox; }
    // ...any more as needed
}
