<?php
class CompanyMetadata
{
    // Template/branding
    public $templateType = 'classic';         // classic | modern | minimal | statement
    public $primaryColor = '#f1c40f';         // Brand yellow as default
    public $accentColor = '#23272F';          // Brand black as default
    public $textColor = '#23272F';            // Text color
    public $logoOnly = false;                 // Show logo only (true) or logo + name (false)
    public $showCompanyName = true;           // Show company name (default: yes)
    public $showBankBox = true;               // Show bank details box (default: yes)
    public $showFooter = true;                // Show footer (default: yes)
    public $footerText = 'Thank you for your business!'; // Footer message
    public $showWatermark = true;             // Show PAID watermark (default: yes)
    public $showTerms = true;                 // Show T&Cs section (default: yes)
    public $termsText = 'Payment due within 30 days. Thank you for your business.'; // T&Cs

    // Banking details
    public $bankName = '';
    public $accountNumber = '';
    public $branchCode = '';
    public $accountType = 'current';

    // You can add more: font, language, background, etc.

    public function __construct($arr = [])
    {
        // Set all properties from provided array, else use defaults
        foreach ($arr as $k => $v) {
            // Only set if property exists (safe for future extensions)
            if (property_exists($this, $k)) {
                $this->$k = $v;
            }
        }
    }

    // Helper: fallback for colors
    public function getPrimaryColor()
    {
        return $this->primaryColor ?: '#f1c40f';
    }
    public function getAccentColor()
    {
        return $this->accentColor ?: '#23272F';
    }
    public function getTextColor()
    {
        return $this->textColor ?: '#23272F';
    }
    public function getFooterText()
    {
        return $this->footerText ?: 'Thank you for your business!';
    }
    public function getTermsText()
    {
        return $this->termsText ?: 'Payment due within 30 days. Thank you for your business.';
    }
    // ...more helpers as needed
}
