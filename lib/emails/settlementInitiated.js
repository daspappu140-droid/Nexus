export function settlementInitiatedEmail({ name, amount, deduction, requestedAmount, reference, bankDetails, date }) {
  return `
<!DOCTYPE html>
<html>
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background:#f8fafc;font-family:'Inter',system-ui,sans-serif;">
  <div style="max-width:600px;margin:0 auto;padding:40px 20px;">
    <div style="background:#ffffff;border-radius:16px;overflow:hidden;box-shadow:0 4px 24px rgba(0,0,0,0.06);border:1px solid #e2e8f0;">
      <div style="background:linear-gradient(135deg,#4f46e5,#6366f1);padding:32px;text-align:center;">
        <h1 style="color:#ffffff;margin:0;font-size:24px;font-weight:700;">NexusBank</h1>
        <p style="color:rgba(255,255,255,0.8);margin:8px 0 0;font-size:14px;">Settlement Request</p>
      </div>
      <div style="padding:32px;">
        <h2 style="color:#0f172a;margin:0 0 8px;font-size:20px;">Settlement Request Initiated</h2>
        <p style="color:#64748b;margin:0 0 24px;font-size:14px;line-height:1.6;">
          Hi ${name}, your settlement request has been submitted and is pending processing.
        </p>
        <div style="background:#fffbeb;border:1px solid #fde68a;border-radius:12px;padding:20px;text-align:center;margin-bottom:24px;">
          <p style="color:#d97706;margin:0;font-size:12px;text-transform:uppercase;letter-spacing:1px;">Settlement Amount</p>
          <p style="color:#b45309;margin:8px 0 0;font-size:32px;font-weight:700;">₹${Number(requestedAmount || amount).toLocaleString('en-IN')}</p>
        </div>
        <div style="background:#f8fafc;border-radius:12px;padding:16px;margin-bottom:24px;">
          <table style="width:100%;border-collapse:collapse;">
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Spend Amount</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">₹${Number(amount).toLocaleString('en-IN')}</td></tr>
            ${deduction ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Deduction</td><td style="padding:8px 0;color:#ef4444;font-size:13px;font-weight:600;text-align:right;">-₹${Number(deduction).toLocaleString('en-IN')}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Reference</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;font-family:monospace;">${reference || 'N/A'}</td></tr>
            ${bankDetails?.bankName ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Bank</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">${bankDetails.bankName}</td></tr>` : ''}
            ${bankDetails?.accountNumber ? `<tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Account</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">••••${bankDetails.accountNumber.slice(-4)}</td></tr>` : ''}
            <tr><td style="padding:8px 0;color:#64748b;font-size:13px;">Date</td><td style="padding:8px 0;color:#0f172a;font-size:13px;font-weight:600;text-align:right;">${date}</td></tr>
          </table>
        </div>
        <p style="color:#94a3b8;font-size:12px;margin:0;text-align:center;">Settlement will be processed on the next banking day (T+1).</p>
      </div>
      <div style="background:#f8fafc;padding:20px;text-align:center;border-top:1px solid #e2e8f0;">
        <p style="color:#94a3b8;margin:0;font-size:11px;">© 2024 NexusBank. All rights reserved.</p>
      </div>
    </div>
  </div>
</body>
</html>`;
}
