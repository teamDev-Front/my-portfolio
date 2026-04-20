import { NextResponse } from 'next/server';
import { Resend } from 'resend';

export const runtime = 'nodejs';

const resend = new Resend(process.env.RESEND_API_KEY);

const TO_EMAIL = process.env.CONTACT_TO_EMAIL ?? 'contato@habaeb.com';
const FROM_EMAIL =
  process.env.CONTACT_FROM_EMAIL ?? 'Habaeb Creative <onboarding@resend.dev>';

type ContactPayload = {
  name: string;
  email: string;
  company?: string;
  projectType: string;
  message: string;
};

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(body: unknown): { data?: ContactPayload; error?: string } {
  if (!body || typeof body !== 'object') return { error: 'Invalid payload' };
  const b = body as Record<string, unknown>;

  const name = typeof b.name === 'string' ? b.name.trim() : '';
  const email = typeof b.email === 'string' ? b.email.trim() : '';
  const company = typeof b.company === 'string' ? b.company.trim() : '';
  const projectType =
    typeof b.projectType === 'string' ? b.projectType.trim() : '';
  const message = typeof b.message === 'string' ? b.message.trim() : '';

  if (name.length < 2 || name.length > 120) return { error: 'Invalid name' };
  if (!EMAIL_RE.test(email) || email.length > 200)
    return { error: 'Invalid email' };
  if (projectType.length < 2 || projectType.length > 40)
    return { error: 'Invalid project type' };
  if (message.length < 10 || message.length > 5000)
    return { error: 'Invalid message' };
  if (company.length > 160) return { error: 'Invalid company' };

  return { data: { name, email, company, projectType, message } };
}

function escapeHtml(input: string) {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function buildHtml(data: ContactPayload) {
  const row = (label: string, value: string) => `
    <tr>
      <td style="padding:8px 0;color:#6b7280;font-size:13px;width:130px;vertical-align:top;">${label}</td>
      <td style="padding:8px 0;color:#111827;font-size:15px;">${escapeHtml(value)}</td>
    </tr>`;

  return `<!doctype html>
<html>
  <body style="margin:0;padding:24px;background:#f9fafb;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" style="max-width:560px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
      <tr>
        <td style="padding:24px 28px;background:#0a0a0a;color:#ffffff;">
          <div style="font-size:12px;letter-spacing:0.12em;text-transform:uppercase;color:#9ca3af;">Habaeb Creative Solutions</div>
          <div style="font-size:20px;font-weight:600;margin-top:4px;">Novo contato recebido</div>
        </td>
      </tr>
      <tr>
        <td style="padding:24px 28px;">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0">
            ${row('Nome', data.name)}
            ${row('E-mail', data.email)}
            ${data.company ? row('Empresa', data.company) : ''}
            ${row('Tipo de projeto', data.projectType)}
          </table>
          <div style="margin-top:20px;padding-top:20px;border-top:1px solid #e5e7eb;">
            <div style="color:#6b7280;font-size:13px;margin-bottom:8px;">Mensagem</div>
            <div style="color:#111827;font-size:15px;line-height:1.6;white-space:pre-wrap;">${escapeHtml(data.message)}</div>
          </div>
        </td>
      </tr>
      <tr>
        <td style="padding:16px 28px;background:#f9fafb;color:#6b7280;font-size:12px;">
          Responda este e-mail para falar direto com ${escapeHtml(data.name)}.
        </td>
      </tr>
    </table>
  </body>
</html>`;
}

export async function POST(request: Request) {
  if (!process.env.RESEND_API_KEY) {
    console.error('[contact] RESEND_API_KEY not configured');
    return NextResponse.json(
      { error: 'Email service not configured' },
      { status: 500 },
    );
  }

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON' }, { status: 400 });
  }

  const { data, error } = validate(body);
  if (!data) {
    return NextResponse.json({ error: error ?? 'Invalid input' }, { status: 400 });
  }

  try {
    const { error: resendError } = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email,
      subject: `Novo contato — ${data.name} (${data.projectType})`,
      html: buildHtml(data),
      text: `Nome: ${data.name}
E-mail: ${data.email}
${data.company ? `Empresa: ${data.company}\n` : ''}Tipo: ${data.projectType}

${data.message}`,
    });

    if (resendError) {
      console.error('[contact] Resend error:', resendError);
      return NextResponse.json(
        { error: 'Failed to send message' },
        { status: 502 },
      );
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[contact] Unexpected error:', err);
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 });
  }
}
