import { formatBytes } from "../utils/formatBytes";

type Props = {
  name: string;
  used: bigint;
  limit: bigint;
  percentage: number;
  upgradeUrl: string;
};

export const STORAGE_WARNING_95_SUBJECT =
  "⚠️ You've used 95% of your FOTNO storage — act now";

export const renderStorageWarning95Email = ({
  name,
  used,
  limit,
  percentage,
  upgradeUrl,
}: Props): string => {
  return `
    <h2 style="margin:0 0 8px;font-size:18px;font-weight:600;">Hi ${name},</h2>
    <p style="margin:0 0 16px;font-weight:600;">You are nearly out of space. Please take action now.</p>
    <div style="margin:0 0 20px;">
      <div style="height:14px;border-radius:999px;background:#fecaca;overflow:hidden;border:1px solid #dc2626;">
        <div style="height:100%;width:${Math.min(100, Math.max(0, percentage))}%;background:#dc2626;"></div>
      </div>
      <p style="margin:10px 0 0;">${formatBytes(used)} of ${formatBytes(limit)} used (${percentage}%)</p>
    </div>
    <p style="margin:0 0 20px;color:#374151;">
      You are nearly out of space. Uploads from FREE plan will stop. Paid plan users will be charged $0.10/GB for overages.
    </p>
    <a href="${upgradeUrl}" style="display:inline-block;padding:12px 24px;background:#b91c1c;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:700;">
      Upgrade Now
    </a>
  `;
};
