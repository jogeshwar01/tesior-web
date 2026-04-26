/**
 * Email notification utility.
 *
 * Uses the Resend API (https://resend.com) via a plain fetch call so no
 * additional packages are required. Set the following environment variables:
 *
 *   RESEND_API_KEY   – API key from the Resend dashboard (required)
 *   EMAIL_FROM       – Sender address verified in Resend (default: noreply@tesior.xyz)
 *
 * If RESEND_API_KEY is not configured, all send calls are no-ops — the app
 * continues to work normally without email support.
 */

const RESEND_API_URL = "https://api.resend.com/emails";

interface PaymentEmailOptions {
  /** Recipient email address */
  to: string;
  /** Recipient display name (optional) */
  name?: string | null;
  /** Amount in SOL (already converted from lamports) */
  amountSol: number;
  /** Solana transaction signature */
  txSignature: string;
}

/**
 * Send a payment confirmation email to the user after a successful payout.
 *
 * This function never throws — errors are logged and silently ignored so
 * that a broken email configuration does not interrupt payment processing.
 */
export async function sendPaymentEmail(
  opts: PaymentEmailOptions,
): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    // Email is opt-in; skip silently when not configured.
    return;
  }

  const from =
    process.env.EMAIL_FROM ?? "Tesior <noreply@tesior.xyz>";
  const explorerUrl = `https://solscan.io/tx/${opts.txSignature}`;
  const greeting = opts.name ? `Hi ${opts.name},` : "Hi,";

  const html = `
    <div style="font-family: sans-serif; max-width: 480px; margin: auto;">
      <h2 style="color: #1a1a1a;">Payment successful</h2>
      <p>${greeting}</p>
      <p>
        Your payout of <strong>${opts.amountSol.toFixed(4)} SOL</strong> has been
        confirmed on the Solana network.
      </p>
      <p>
        <a href="${explorerUrl}" style="color: #512da8;">View transaction on Solscan</a>
      </p>
      <p style="color: #666; font-size: 12px;">
        Transaction ID: ${opts.txSignature}
      </p>
      <hr style="border: none; border-top: 1px solid #eee;" />
      <p style="color: #999; font-size: 11px;">
        You received this email because you have a Tesior account. If you did
        not request this payout, please contact support immediately.
      </p>
    </div>
  `;

  const text = [
    greeting,
    "",
    `Your payout of ${opts.amountSol.toFixed(4)} SOL has been confirmed on the Solana network.`,
    "",
    `View transaction: ${explorerUrl}`,
    `Transaction ID: ${opts.txSignature}`,
  ].join("\n");

  try {
    const res = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: `You received ${opts.amountSol.toFixed(4)} SOL from Tesior`,
        html,
        text,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error(`[email] Resend API error ${res.status}: ${body}`);
    } else {
      console.log(`[email] Payment confirmation sent to ${opts.to}`);
    }
  } catch (err) {
    console.error("[email] Failed to send payment email:", (err as Error).message);
  }
}
