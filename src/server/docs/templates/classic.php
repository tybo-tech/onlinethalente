<?php
// Access: $invoice, $company, $meta, $client, $items
$company = $invoice->company;
$meta = $company->metadata;
$client = $invoice->client;
$items = $invoice->items;
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Invoice <?= htmlspecialchars($invoice->number) ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            font-size: 12px;
            color: <?= $meta->textColor ?>;
            background: #fff;
        }
        .main { max-width: 650px; margin: 20px auto; background: #F7F8FB; padding: 32px; border-radius: 20px; box-shadow: 0 4px 24px #0002;}
        .header-table { width: 100%; border-bottom: 2px solid <?= $meta->primaryColor ?>; margin-bottom: 24px; padding-bottom: 10px;}
        .company-name { color: <?= $meta->primaryColor ?>; font-size: 1.4em; font-weight: bold;}
        .invoice-meta { text-align: right;}
        .status { display: inline-block; background: <?= $meta->primaryColor ?>; color: <?= $meta->accentColor ?>; font-weight: bold; padding: 2px 18px; border-radius: 6px; font-size: 0.95em; margin-bottom: 6px;}
        .section-table { width: 100%; margin-bottom: 24px;}
        .label { color: <?= $meta->primaryColor ?>; font-weight: 600; margin-bottom: 3px; font-size: 0.96em;}
        .bold { font-weight: bold; }
        .items-table { width: 100%; border-collapse: collapse; margin-bottom: 20px; border-radius: 10px; overflow: hidden;}
        .items-table th, .items-table td { padding: 10px 8px;}
        .items-table th { background: <?= $meta->primaryColor ?>; color: <?= $meta->accentColor ?>; border: none; font-weight: bold; font-size: 12px; text-align: left;}
        .items-table td { background: #fff; border-bottom: 1px solid #eee; font-size: 12px;}
        .items-table tr:last-child td { border-bottom: none;}
        .items-table .right { text-align: right;}
        .totals { width: 300px; float: right; margin-top: 12px; background: #fff; border-radius: 10px; box-shadow: 0 1px 10px #0001;}
        .totals td { padding: 1px 12px; font-size: 13px; margin: 0;}
        .totals .label { color: #6b7280; font-weight: 500;}
        .totals .total { font-size: 16px; color: #22bb55; font-weight: bold;}
        .bank-details { font-size: 12px; margin-top: 18px; color: #23272F; background: #e7e6ff; padding: 12px 14px; border-radius: 7px;}
        .watermark { color: #22bb55; font-size: 80px; opacity: 0.09; position: absolute; top: 160px; left: 180px; z-index: 0; transform: rotate(-20deg);}
    </style>
</head>
<body>
    <div class="main">
        <!-- HEADER -->
        <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
                <td valign="top" style="width:62%;">
                    <?php if (!empty($company->logo)): ?>
                        <div style="max-width:140px; margin-bottom:10px;">
                            <img src="<?= htmlspecialchars($company->logo) ?>" alt="Logo" style="width:100%; height:auto; display:block;" />
                        </div>
                    <?php endif; ?>
                    <?php if (!$meta->logoOnly): ?>
                        <div class="company-name"><?= htmlspecialchars($company->name) ?></div>
                    <?php endif; ?>
                </td>
                <td valign="top" style="width:38%; text-align:right;">
                    <div class="invoice-meta">
                        <div class="status"><?= strtoupper($invoice->type) ?></div>
                        <div style="color:<?= $meta->primaryColor ?>; font-size:18px; font-weight:bold;">
                            #<?= htmlspecialchars($invoice->number) ?>
                        </div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- SECTION: Billed To & Invoice Details -->
        <table class="section-table" cellpadding="0" cellspacing="0">
            <tr>
                <td valign="top" style="width:48%;">
                    <div class="label">Billed To</div>
                    <div class="recipient">
                        <div class="bold"><?= htmlspecialchars($client->name) ?></div>
                        <?php if (!empty($client->email)): ?><div><?= htmlspecialchars($client->email) ?></div><?php endif; ?>
                        <?php if (!empty($client->phone)): ?><div><?= htmlspecialchars($client->phone) ?></div><?php endif; ?>
                        <?php if (!empty($client->address)): ?><div><?= htmlspecialchars($client->address) ?></div><?php endif; ?>
                        <?php if (!empty($client->companyVat)): ?><div>VAT: <?= htmlspecialchars($client->companyVat) ?></div><?php endif; ?>
                    </div>
                </td>
                <td valign="top" style="width:48%;">
                    <div class="label">Invoice Details</div>
                    <div class="details">
                        <div>Issue Date: <span class="bold"><?= htmlspecialchars($invoice->issueDate) ?></span></div>
                        <div>Due Date: <span class="bold"><?= htmlspecialchars($invoice->dueDate) ?: '-' ?></span></div>
                        <div>Status: <span class="bold"><?= ucfirst($invoice->status) ?></span></div>
                    </div>
                </td>
            </tr>
        </table>

        <!-- ITEMS TABLE -->
        <table class="items-table section">
            <thead>
                <tr>
                    <th>Item</th>
                    <th>Qty</th>
                    <th>Unit Price</th>
                    <th>Total</th>
                </tr>
            </thead>
            <tbody>
                <?php foreach ($items as $item): ?>
                    <tr>
                        <td>
                            <p class="bold" style="margin:0;padding:0;"><?= htmlspecialchars($item->name) ?></p>
                            <p style="margin:0;padding:0;"><?= htmlspecialchars($item->description) ?></p>
                        </td>
                        <td class="right"><?= htmlspecialchars($item->quantity) ?></td>
                        <td class="right"><?= $invoice->currency ?><?= number_format((float) $item->unitPrice, 2) ?></td>
                        <td class="right bold"><?= $invoice->currency ?><?= number_format((float) $item->totalPrice, 2) ?></td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- TOTALS -->
        <table class="totals">
            <tr>
                <td class="label">Subtotal</td>
                <td class="right"><?= $invoice->currency ?><?= number_format((float) $invoice->subtotal, 2) ?></td>
            </tr>
            <tr>
                <td class="label">Tax</td>
                <td class="right"><?= $invoice->currency ?><?= number_format((float) $invoice->tax, 2) ?></td>
            </tr>
            <tr>
                <td class="total">Total</td>
                <td class="total right"><?= $invoice->currency ?><?= number_format((float) $invoice->total, 2) ?></td>
            </tr>
        </table>
        <div style="clear:both"></div>

        <!-- BANK DETAILS -->
        <?php if (!empty($meta->bankName)): ?>
            <div class="bank-details">
                <div class="label" style="margin-bottom:2px;">Bank Details</div>
                <div>Bank: <?= htmlspecialchars($meta->bankName) ?></div>
                <div>Account Number: <?= htmlspecialchars($meta->accountNumber) ?></div>
                <div>Branch Code: <?= htmlspecialchars($meta->branchCode) ?></div>
                <div>Account Type: <?= htmlspecialchars($meta->accountType) ?></div>
            </div>
        <?php endif; ?>

          <!-- NOTES -->
        <?php if (!empty($invoice->notes)): ?>
            <div class="notes" style="margin-top: 24px;
             font-size: 1em; color: #555;
             background: #f7fafd; padding: 16px;
              border-radius: 10px; box-shadow: 0 1px 10px #0001;">
                <div class="label">Notes</div>
                <div><?= nl2br(htmlspecialchars($invoice->notes)) ?></div>
            </div>
        <?php endif; ?>

        <!-- PAID WATERMARK -->
        <?php if ($invoice->status === 'completed'): ?>
            <div class="watermark">PAID</div>
        <?php endif; ?>
    </div>
</body>
</html>
