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
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Inter', Arial, sans-serif;
            color: #222;
            font-size: 13px;
            background: #fff;
        }
        .container {
            max-width: 620px;
            margin: 32px auto;
            padding: 0 20px;
        }
        .header {
            display: flex;
            align-items: flex-start;
            justify-content: space-between;
            margin-bottom: 36px;
        }
        .logo-block {
            min-width: 120px;
        }
        .logo-block img {
            width: 110px;
            height: auto;
            display: block;
        }
        .company-name {
            font-size: 1.3em;
            color: <?= $meta->primaryColor ?>;
            font-weight: bold;
            margin-top: 8px;
        }
        .invoice-meta {
            text-align: right;
        }
        .invoice-label {
            font-size: 11px;
            color: <?= $meta->primaryColor ?>;
            font-weight: bold;
            letter-spacing: 1px;
            text-transform: uppercase;
        }
        .invoice-number {
            font-size: 1.2em;
            color: #23272F;
            font-weight: 700;
            margin-top: 3px;
        }
        hr {
            border: none;
            border-top: 1px solid #eee;
            margin: 22px 0;
        }
        .bill-details-table {
            width: 100%;
            margin-bottom: 24px;
        }
        .bill-details-table td {
            padding: 0 0 2px 0;
            vertical-align: top;
            font-size: 13px;
        }
        .label-small {
            color: #aaa;
            font-size: 11px;
            font-weight: 500;
        }
        .bold {
            font-weight: bold;
        }
        .items-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 12px;
            margin-bottom: 18px;
        }
        .items-table th {
            font-size: 12px;
            color: #23272F;
            border-bottom: 2px solid <?= $meta->primaryColor ?>;
            padding: 8px 0;
            text-align: left;
            font-weight: 600;
        }
        .items-table td {
            border-bottom: 1px solid #f1f1f1;
            padding: 7px 0 7px 0;
            font-size: 13px;
            vertical-align: top;
        }
        .items-table .right, .totals-table .right {
            text-align: right;
        }
        .totals-table {
            width: 100%;
            margin-top: 14px;
        }
        .totals-table td {
            padding: 2px 0;
            font-size: 13px;
        }
        .totals-table .label {
            color: #888;
        }
        .totals-table .total {
            font-size: 1.08em;
            color: <?= $meta->primaryColor ?>;
            font-weight: bold;
        }
        .bank-details {
            color: #444;
            font-size: 12px;
            margin-top: 30px;
        }
        .bank-details .label-small {
            color: <?= $meta->primaryColor ?>;
        }
        .watermark {
            position: absolute;
            top: 48%;
            left: 48%;
            font-size: 3.3em;
            color: #9be7b8;
            opacity: 0.13;
            font-weight: bold;
            transform: rotate(-24deg);
            z-index: 0;
            pointer-events: none;
        }
    </style>
</head>
<body>
<div class="container">
    <div class="header">
        <div class="logo-block">
            <?php if (!empty($company->logo)): ?>
                <img src="<?= htmlspecialchars($company->logo) ?>" alt="Logo" />
            <?php endif; ?>
            <?php if (empty($meta->logoOnly)): ?>
                <div class="company-name"><?= htmlspecialchars($company->name) ?></div>
            <?php endif; ?>
        </div>
        <div class="invoice-meta">
            <div class="invoice-label"><?= strtoupper($invoice->type) ?></div>
            <div class="invoice-number">#<?= htmlspecialchars($invoice->number) ?></div>
        </div>
    </div>
    <hr>

    <!-- Billed To and Invoice Details -->
    <table class="bill-details-table">
        <tr>
            <td width="48%">
                <span class="label-small">Billed To</span><br>
                <span class="bold"><?= htmlspecialchars($client->name) ?></span>
                <?php if (!empty($client->email)): ?><br><?= htmlspecialchars($client->email) ?><?php endif; ?>
                <?php if (!empty($client->phone)): ?><br><?= htmlspecialchars($client->phone) ?><?php endif; ?>
                <?php if (!empty($client->address)): ?><br><?= htmlspecialchars($client->address) ?><?php endif; ?>
                <?php if (!empty($client->companyVat)): ?><br>VAT: <?= htmlspecialchars($client->companyVat) ?><?php endif; ?>
            </td>
            <td width="52%" align="right">
                <span class="label-small">Invoice Details</span><br>
                Issue: <span class="bold"><?= htmlspecialchars($invoice->issueDate) ?></span><br>
                Due: <span class="bold"><?= htmlspecialchars($invoice->dueDate) ?: '-' ?></span><br>
                Status: <span class="bold"><?= ucfirst($invoice->status) ?></span>
            </td>
        </tr>
    </table>

    <!-- Items Table -->
    <table class="items-table">
        <thead>
        <tr>
            <th>Item</th>
            <th width="6%">Qty</th>
            <th width="14%" class="right">Unit Price</th>
            <th width="14%" class="right">Total</th>
        </tr>
        </thead>
        <tbody>
        <?php foreach ($items as $item): ?>
            <tr>
                <td>
                    <span class="bold"><?= htmlspecialchars($item->name) ?></span><br>
                    <span style="color:#444;"><?= htmlspecialchars($item->description) ?></span>
                </td>
                <td class="right"><?= htmlspecialchars($item->quantity) ?></td>
                <td class="right"><?= $invoice->currency ?><?= number_format((float) $item->unitPrice, 2) ?></td>
                <td class="right bold"><?= $invoice->currency ?><?= number_format((float) $item->totalPrice, 2) ?></td>
            </tr>
        <?php endforeach; ?>
        </tbody>
    </table>

    <!-- Totals Table -->
    <table class="totals-table">
        <tr>
            <td class="label" width="70%">Subtotal</td>
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

    <!-- Bank Details -->
    <?php if (!empty($meta->bankName)): ?>
        <div class="bank-details">
            <div class="label-small" style="margin-bottom:2px;">Bank Details</div>
            Bank: <?= htmlspecialchars($meta->bankName) ?><br>
            Account Number: <?= htmlspecialchars($meta->accountNumber) ?><br>
            Branch Code: <?= htmlspecialchars($meta->branchCode) ?><br>
            Account Type: <?= htmlspecialchars($meta->accountType) ?>
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
