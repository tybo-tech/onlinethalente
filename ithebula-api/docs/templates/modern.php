<?php
// Access: $invoice, $company, $meta, $client, $items (all OOP, as per your structure)
$company = $invoice->company;
$meta = $company->metadata;
$client = $invoice->client;
$items = $invoice->items;
$primary = $meta->primaryColor ?? '#6366F1';
$accent = $meta->accentColor ?? '#23272F';
$text = $meta->textColor ?? '#23272F';
$logoOnly = $meta->logoOnly ?? false;
?>

<!DOCTYPE html>
<html lang="en">

<head>
    <meta charset="UTF-8">
    <title>Invoice <?= htmlspecialchars($invoice->number) ?></title>
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;700;900&display=swap" rel="stylesheet">
    <style>
        body {
            font-family: 'Poppins', Arial, sans-serif;
            background: #f9f9fb;
            color:
                <?= $text ?>
            ;
            font-size: 14px;
        }

        .main {
            max-width: 740px;
            margin: 32px auto;
            background: #fff;
            border-radius: 24px;
            box-shadow: 0 8px 32px #0001;
            padding: 44px 44px 36px 44px;
        }

        .header-table {
            width: 100%;
            border-bottom: 4px solid
                <?= $primary ?>
            ;
            margin-bottom: 36px;
            padding-bottom: 14px;
        }

        .logo {
            max-width: 100px;
            margin-bottom: 8px;
        }

        .company-name {
            color:
                <?= $primary ?>
            ;
            font-size: 2.2em;
            font-weight: 900;
            letter-spacing: -1px;
        }

        .invoice-meta {
            text-align: right;
        }

        .pill {
            display: inline-block;
            background:
                <?= $primary ?>
            ;
            color: #fff;
            font-weight: 700;
            font-size: 0.97em;
            border-radius: 24px;
            padding: 4px 20px;
            letter-spacing: 1px;
        }

        .invoice-number {
            font-size: 1.35em;
            color:
                <?= $primary ?>
            ;
            font-weight: bold;
            margin-top: 6px;
        }

        .section-table {
            width: 100%;
            margin-bottom: 28px;
        }

        .label {
            color:
                <?= $primary ?>
            ;
            font-weight: 700;
            font-size: 1em;
            text-transform: uppercase;
            margin-bottom: 7px;
            letter-spacing: 1px;
        }

        .details,
        .recipient {
            font-size: 1.05em;
            line-height: 1.5;
        }

        .items-table {
            width: 100%;
            border-collapse: separate;
            border-spacing: 0;
            margin-bottom: 30px;
            border-radius: 12px;
            overflow: hidden;
            box-shadow: 0 2px 10px #0001;
        }

        .items-table th,
        .items-table td {
            padding: 14px 10px;
        }

        .items-table th {
            background:
                <?= $primary ?>
            ;
            color: #fff;
            border: none;
            font-size: 1em;
            font-weight: bold;
            text-align: left;
            letter-spacing: 1px;
        }

        .items-table td {
            background: #fff;
            border-bottom: 2px solid #f2f2f2;
            font-size: 1.08em;
        }

        .items-table tr:last-child td {
            border-bottom: none;
        }

        .items-table .right {
            text-align: right;
        }

        .item-name {
            font-weight: 700;
            font-size: 1.09em;
            margin-bottom: 3px;
        }

        .item-desc {
            font-size: 0.95em;
            color: #777;
        }

        .totals {
            margin-left: auto;
            margin-right: 0;
            margin-top: 8px;
            background: #f7fafd;
            border-radius: 14px;
            box-shadow: 0 1px 10px #0001;
            width: 320px;
        }

        .totals td {
            padding: 10px 18px 7px 7px;
            font-size: 1.12em;
            color: #444;
        }

        .totals .label {
            color: #8f8f8f;
            font-weight: 500;
        }

        .totals .total {
            font-size: 1.4em;
            color: #00b074;
            font-weight: 900;
        }

        .bank-details {
            margin-top: 28px;
            padding: 14px 18px;
            background: #ecebff;
            border-radius: 10px;
            color: #23272F;
        }

        .bank-details .label {
            color:
                <?= $primary ?>
            ;
            margin-bottom: 6px;
            font-weight: bold;
        }

        .watermark {
            color: #b4ffd8;
            font-size: 96px;
            opacity: 0.08;
            position: absolute;
            top: 180px;
            left: 170px;
            z-index: 0;
            transform: rotate(-18deg);
            font-weight: 900;
        }
    </style>
</head>

<body>
    <div class="main">
        <!-- HEADER -->
        <table class="header-table" cellpadding="0" cellspacing="0">
            <tr>
                <td valign="top" style="width:58%;">
                    <?php if (!empty($company->logo)): ?>
                        <img class="logo" src="<?= htmlspecialchars($company->logo) ?>" alt="Logo"
                            style="width:100px;height:auto;display:block;" />
                    <?php endif; ?>
                    <?php if (!$logoOnly): ?>
                        <div class="company-name"><?= htmlspecialchars($company->name) ?></div>
                    <?php endif; ?>
                </td>
                <td valign="top" style="width:42%; text-align:right;">
                    <div class="invoice-meta">
                        <div class="pill"><?= strtoupper($invoice->type) ?></div>
                        <div class="invoice-number">#<?= htmlspecialchars($invoice->number) ?></div>
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
                        <div style="font-weight:700; font-size:1.05em;"><?= htmlspecialchars($client->name) ?></div>
                        <?php if (!empty($client->email)): ?>
                            <div><?= htmlspecialchars($client->email) ?></div><?php endif; ?>
                        <?php if (!empty($client->phone)): ?>
                            <div><?= htmlspecialchars($client->phone) ?></div><?php endif; ?>
                        <?php if (!empty($client->address)): ?>
                            <div><?= htmlspecialchars($client->address) ?></div><?php endif; ?>
                        <?php if (!empty($client->companyVat)): ?>
                            <div>VAT: <?= htmlspecialchars($client->companyVat) ?></div><?php endif; ?>
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
                            <div class="item-name"><?= htmlspecialchars($item->name) ?></div>
                            <div class="item-desc"><?= htmlspecialchars($item->description) ?></div>
                        </td>
                        <td class="right"><?= htmlspecialchars($item->quantity) ?></td>
                        <td class="right"><?= $invoice->currency ?><?= number_format((float) $item->unitPrice, 2) ?></td>
                        <td class="right bold"><?= $invoice->currency ?><?= number_format((float) $item->totalPrice, 2) ?>
                        </td>
                    </tr>
                <?php endforeach; ?>
            </tbody>
        </table>

        <!-- TOTALS -->
        <table class="totals" align="right">
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
                <div class="label">Bank Details</div>
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