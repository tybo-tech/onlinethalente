import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, forkJoin, of, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ICollectionData } from '../models/ICollection';
import { Application, ApplicationStatus } from '../models/schema';

export interface EmailRequest {
  sender_name: string;
  recipient_name: string;
  recipient_email: string;
  subject: string;
  message: string; // HTML
}

export interface EmailResponse {
  message: string;
  success?: boolean;
  error?: any;
}

@Injectable({ providedIn: 'root' })
export class EmailService {
  // =======================
  // 🔧 Config (edit here)
  // =======================
  /** Tybo mail relay */
  private readonly EMAIL_API_URL = 'https://cms.tybo.co.za/send.php';

  /** Brand */
  private readonly BRAND_NAME = 'Onlinethalente Loans';
  private readonly BRAND_SENDER_EMAIL = 'info@onlinethalente.co.za';
  private readonly BRAND_SUPPORT_EMAIL = 'support@onlinethalente.co.za';

  /** (Optional) hard override; leave '' to use window.location.origin */
  private readonly BASE_URL_OVERRIDE: string = '';

  /** Admin recipients (can be many) */
  private readonly ADMIN_EMAILS: { name: string; email: string }[] = [
    { name: 'Loans Admin', email: 'ndu@onlinethalente.co.za' },
    // { name: 'Ops', email: 'ops@onlinethalente.co.za' },
  ];

  // =======================
  // Derived URLs
  // =======================
  private get baseUrl(): string {
    if (this.BASE_URL_OVERRIDE)
      return this.BASE_URL_OVERRIDE.replace(/\/+$/, '');
    if (typeof window !== 'undefined' && window?.location?.origin) {
      return window.location.origin.replace(/\/+$/, '');
    }
    // last resort fallback:
    return 'https://onlinethalente.co.za';
  }
  private dashboardUrl(): string {
    return `${this.baseUrl}/admin/applications`;
  }
  private applicationUrl(appId: number): string {
    // if you route with a detail route, change to `/admin/applications/${appId}`
    return `${this.baseUrl}/admin/applications?open=${encodeURIComponent(
      String(appId)
    )}`;
  }

  constructor(private http: HttpClient) {}

  // ==========================================================
  // Public API – Call these from your flows
  // ==========================================================

  /** After a user submits the loan application */
  sendCustomerApplicationSubmitted(
    app: ICollectionData<Application>
  ): Observable<EmailResponse> {
    const html = this.tmplSubmittedCustomer(app);
    return this.sendEmail({
      sender_name: this.BRAND_NAME,
      recipient_name: app.data.full_name,
      recipient_email: app.data.email,
      subject: `We received your loan application - ${this.prettyAmount(
        app.data.requested_amount_cents
      )}`,
      message: html,
    });
  }

  /** Notify every admin of a new application */
  notifyAdminsNewApplication(
    app: ICollectionData<Application>,
    link: 'dashboard' | 'application' = 'dashboard'
  ): Observable<EmailResponse[]> {
    const html = this.tmplNewApplicationAdmin(
      app,
      link === 'dashboard' ? this.dashboardUrl() : this.applicationUrl(app.id)
    );
    const reqs = this.ADMIN_EMAILS.map((a) =>
      this.sendEmail({
        sender_name: this.BRAND_NAME,
        recipient_name: a.name,
        recipient_email: a.email,
        subject: `New loan application: ${
          app.data.full_name
        } - ${this.prettyAmount(app.data.requested_amount_cents)}`,
        message: html,
      })
    );
    return reqs.length ? forkJoin(reqs) : of([]);
  }

  /** Notify customer on status changes */
  sendCustomerStatusEmail(
    app: ICollectionData<Application>,
    status: ApplicationStatus
  ): Observable<EmailResponse> {
    let subject = '';
    let html = '';

    switch (status) {
      case ApplicationStatus.APPROVED:
        subject = `Your loan was approved - ${this.prettyAmount(
          app.data.requested_amount_cents
        )}`;
        html = this.tmplApproved(app);
        break;
      case ApplicationStatus.DECLINED:
        subject = `Update on your loan application`;
        html = this.tmplDeclined(app);
        break;
      case ApplicationStatus.PAID:
        subject = `Payout confirmed - ${this.prettyAmount(
          app.data.requested_amount_cents
        )}`;
        html = this.tmplPaid(app);
        break;
      default:
        subject = `Update on your loan`;
        html = this.tmplGeneric(app);
    }

    return this.sendEmail({
      sender_name: this.BRAND_NAME,
      recipient_name: app.data.full_name,
      recipient_email: app.data.email,
      subject,
      message: html,
    });
  }

  // ==========================================================
  // Low-level sender
  // ==========================================================
  private sendEmail(emailRequest: EmailRequest): Observable<EmailResponse> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    return this.http
      .post<EmailResponse>(this.EMAIL_API_URL, emailRequest, { headers })
      .pipe(
        map((r) => ({ ...r, success: true })),
        catchError((error) =>
          throwError(() => ({
            message: 'Failed to send email',
            success: false,
            error,
          }))
        )
      );
  }

  // ==========================================================
  // Templates (inline HTML with button CTA)
  // ==========================================================
  private shell(
    title: string,
    intro: string,
    bodyRows: string,
    ctaLabel: string,
    ctaHref: string
  ): string {
    return `<!DOCTYPE html><html lang="en"><head><meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>${this.escape(title)}</title></head>
<body style="margin:0;padding:0;background:#f6f7fb;font-family:Segoe UI,Roboto,Helvetica,Arial,sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f6f7fb;padding:24px 0;">
    <tr><td align="center">
      <table role="presentation" width="640" cellpadding="0" cellspacing="0" style="background:#ffffff;border-radius:12px;overflow:hidden;box-shadow:0 8px 24px rgba(31,41,55,.08);">
        <tr>
          <td style="padding:28px 32px;background:linear-gradient(135deg,#60a5fa,#a78bfa)">
            <h1 style="margin:0;color:#fff;font-size:22px;font-weight:800;letter-spacing:.2px;">${this.escape(
              this.BRAND_NAME
            )}</h1>
            <p style="margin:6px 0 0;color:#eef2ff;font-size:14px;">${this.escape(
              title
            )}</p>
          </td>
        </tr>
        <tr>
          <td style="padding:28px 32px;">
            <p style="margin:0 0 16px;color:#374151;font-size:16px;line-height:1.55;">${intro}</p>
            <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f9fafb;border:1px solid #e5e7eb;border-radius:10px;">
              ${bodyRows}
            </table>
            <div style="text-align:center;margin:24px 0 6px;">
              <a href="${this.escapeHref(
                ctaHref
              )}" target="_blank" rel="noopener"
                 style="display:inline-block;background:#4f46e5;color:#fff;text-decoration:none;padding:12px 20px;border-radius:10px;font-weight:700;">
                 ${this.escape(ctaLabel)}
              </a>
            </div>
            <p style="margin:18px 0 0;color:#6b7280;font-size:12px;">If the button doesn’t work, copy & paste this link:<br>
              <span style="color:#4f46e5;word-break:break-all;">${this.escape(
                ctaHref
              )}</span>
            </p>
          </td>
        </tr>
        <tr>
          <td style="padding:16px 32px;background:#111827;">
            <p style="margin:0;color:#9ca3af;font-size:12px;">
              Need help? <a href="mailto:${this.escapeHref(
                this.BRAND_SUPPORT_EMAIL
              )}" style="color:#93c5fd;text-decoration:none;">${this.escape(
      this.BRAND_SUPPORT_EMAIL
    )}</a><br>
              © ${new Date().getFullYear()} ${this.escape(
      this.BRAND_NAME
    )}. All rights reserved.
            </p>
          </td>
        </tr>
      </table>
    </td></tr>
  </table>
</body></html>`;
  }
  // ======================
  // NEW: DebiCheck Init
  // ======================
  sendCustomerDebiCheckInitiated(
    app: ICollectionData<Application>,
    opts?: {
      reference?: string;
      expiresAtISO?: string;
      bankNameOverride?: string;
    }
  ): Observable<EmailResponse> {
    const html = this.tmplDebiCheckInit(app, opts);
    return this.sendEmail({
      sender_name: this.BRAND_NAME,
      recipient_name: app.data.full_name,
      recipient_email: app.data.email,
      subject: `Action required: DebiCheck authorization for ${this.prettyAmount(
        app.data.requested_amount_cents
      )}`,
      message: html,
    });
  }

  // ======================
  // NEW: Template
  // ======================
  private tmplDebiCheckInit(
    app: ICollectionData<Application>,
    opts?: {
      reference?: string;
      expiresAtISO?: string;
      bankNameOverride?: string;
    }
  ): string {
    const bank = (opts?.bankNameOverride || app.data.bank_name || '').trim();
    const intro = `Hi ${this.escape(app.data.full_name)},<br/>
    We’ve sent a <strong>DebiCheck</strong> authorization request to your phone (${this.escape(
      this.maskPhone(app.data.phone)
    )}).
    Please open your banking app/USSD/SMS and <strong>approve the mandate</strong>. Once approved, we’ll proceed with payment.`;

    const rows =
      this.row(
        'Amount',
        `<strong style="color:#111827;">${this.prettyAmount(
          app.data.requested_amount_cents
        )}</strong>`
      ) +
      (bank ? this.row('Bank', this.escape(bank)) : '') +
      (app.data.salary_account
        ? this.row(
            'Account',
            this.escape(this.maskAccount(app.data.salary_account))
          )
        : '') +
      this.row('Phone', this.escape(this.maskPhone(app.data.phone))) +
      (opts?.reference
        ? this.row('Reference', `<code>${this.escape(opts.reference)}</code>`)
        : '') +
      (opts?.expiresAtISO
        ? this.row('Expires', new Date(opts.expiresAtISO).toLocaleString())
        : '');

    return this.shell(
      'DebiCheck authorization sent',
      intro,
      rows,
      'Track status',
      this.dashboardUrl()
    );
  }

  // ======================
  // NEW: small helpers
  // ======================
  private maskPhone(p: string): string {
    if (!p) return '';
    const s = String(p);
    const keepStart = Math.min(4, s.length);
    const keepEnd = Math.min(4, Math.max(0, s.length - keepStart));
    const start = s.slice(0, keepStart);
    const end = keepEnd ? s.slice(-keepEnd) : '';
    const stars = '•'.repeat(Math.max(0, s.length - keepStart - keepEnd));
    return `${start}${stars}${end}`;
  }
  private maskAccount(a: string): string {
    if (!a) return '';
    const s = String(a).replace(/\s+/g, '');
    const start = s.slice(0, 2);
    const end = s.slice(-4);
    const stars = '•'.repeat(Math.max(0, s.length - 6));
    return `${start}${stars}${end}`;
  }

  private row(label: string, value: string): string {
    return `<tr>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#6b7280;font-size:13px;width:45%;">${this.escape(
        label
      )}</td>
      <td style="padding:12px 16px;border-bottom:1px solid #e5e7eb;color:#111827;font-size:13px;text-align:right;">${value}</td>
    </tr>`;
  }

  private tmplSubmittedCustomer(app: ICollectionData<Application>): string {
    const intro = `Hi ${this.escape(app.data.full_name)},<br/>
      We’ve received your loan application. Our team is validating your details. Here’s a quick summary:`;
    const body =
      this.row(
        'Amount',
        `<strong style="color:#111827;">${this.prettyAmount(
          app.data.requested_amount_cents
        )}</strong>`
      ) +
      this.row(
        'Status',
        `<span style="color:#2563eb;">${this.escape(app.data.status)}</span>`
      ) +
      this.row('Bank', this.escape(app.data.bank_name)) +
      this.row('Salary Account', this.escape(app.data.salary_account)) +
      this.row(
        'Submitted at',
        new Date(app.data.submitted_at || app.data.created_at).toLocaleString()
      );
    return this.shell(
      'Application received',
      intro,
      body,
      'Track your application',
      this.dashboardUrl()
    );
  }

  private tmplNewApplicationAdmin(
    app: ICollectionData<Application>,
    cta: string
  ): string {
    const intro = `A new application has been submitted.`;
    const body =
      this.row('Applicant', this.escape(app.data.full_name)) +
      this.row(
        'Email',
        `<a href="mailto:${this.escapeHref(
          app.data.email
        )}" style="color:#4f46e5;text-decoration:none;">${this.escape(
          app.data.email
        )}</a>`
      ) +
      this.row('Phone', this.escape(app.data.phone)) +
      this.row(
        'Amount',
        `<strong style="color:#111827;">${this.prettyAmount(
          app.data.requested_amount_cents
        )}</strong>`
      ) +
      this.row(
        'Status',
        `<span style="color:#111827;">${this.escape(app.data.status)}</span>`
      ) +
      this.row('Application ID', String(app.id));
    return this.shell(
      'New loan application',
      intro,
      body,
      'Open in dashboard',
      cta
    );
  }

  private tmplApproved(app: ICollectionData<Application>): string {
    const intro = `Great news, ${this.escape(
      app.data.full_name
    )}! Your loan application was <strong>approved</strong>.`;
    const body =
      this.row(
        'Approved Amount',
        `<strong style="color:#16a34a;">${this.prettyAmount(
          app.data.requested_amount_cents
        )}</strong>`
      ) +
      this.row('Status', `<span style="color:#16a34a;">APPROVED</span>`) +
      this.row(
        'Next step',
        'We’re preparing your payout. You’ll receive confirmation shortly.'
      );
    return this.shell(
      'Loan approved',
      intro,
      body,
      'View status',
      this.dashboardUrl()
    );
  }

  private tmplDeclined(app: ICollectionData<Application>): string {
    const intro = `Hi ${this.escape(
      app.data.full_name
    )}, unfortunately your application was <strong>declined</strong>.`;
    const body =
      this.row(
        'Requested Amount',
        this.prettyAmount(app.data.requested_amount_cents)
      ) +
      this.row('Status', `<span style="color:#dc2626;">DECLINED</span>`) +
      this.row(
        'Need help?',
        `Reply to <a href="mailto:${this.escapeHref(
          this.BRAND_SUPPORT_EMAIL
        )}" style="color:#4f46e5;text-decoration:none;">${this.escape(
          this.BRAND_SUPPORT_EMAIL
        )}</a>`
      );
    return this.shell(
      'Application declined',
      intro,
      body,
      'Contact support',
      `mailto:${this.BRAND_SUPPORT_EMAIL}`
    );
  }

  private tmplPaid(app: ICollectionData<Application>): string {
    const intro = `Hi ${this.escape(
      app.data.full_name
    )}, your loan payout has been <strong>processed</strong>.`;
    const body =
      this.row(
        'Payout Amount',
        `<strong style="color:#111827;">${this.prettyAmount(
          app.data.requested_amount_cents
        )}</strong>`
      ) +
      this.row('Status', `<span style="color:#2563eb;">PAID</span>`) +
      this.row(
        'Note',
        'Funds should reflect depending on your bank’s clearing time.'
      );
    return this.shell(
      'Payout confirmed',
      intro,
      body,
      'View details',
      this.dashboardUrl()
    );
  }

  private tmplGeneric(app: ICollectionData<Application>): string {
    const intro = `Hi ${this.escape(
      app.data.full_name
    )}, here’s an update on your application.`;
    const body =
      this.row('Amount', this.prettyAmount(app.data.requested_amount_cents)) +
      this.row('Current Status', this.escape(app.data.status));
    return this.shell(
      'Application update',
      intro,
      body,
      'Open dashboard',
      this.dashboardUrl()
    );
  }

  // ==========================================================
  // Utils
  // ==========================================================
  private prettyAmount(cents: number): string {
    const rands = (cents || 0) / 100;
    // Use simple formatting to avoid encoding issues in emails
    return `R ${rands.toLocaleString('en-ZA', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;
  }
  private escape(text: string): string {
    return String(text ?? '').replace(
      /[&<>"']/g,
      (s) =>
        ((
          {
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;',
          } as any
        )[s])
    );
  }
  private escapeHref(text: string): string {
    return this.escape(text).replace(/"/g, '%22');
  }
}
