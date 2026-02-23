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
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h2 style="margin-bottom: 8px;">Hi ${name},</h2>
      <p style="margin-top: 0; font-weight: 600;">You are nearly out of space. Please take action now.</p>
      <div style="margin: 16px 0;">
        <div style="height: 14px; border-radius: 999px; background: #fecaca; overflow: hidden; border: 1px solid #dc2626;">
          <div style="height: 100%; width: ${Math.min(100, Math.max(0, percentage))}%; background: #dc2626;"></div>
        </div>
        <p style="margin: 10px 0 0;">${formatBytes(used)} of ${formatBytes(limit)} used (${percentage}%)</p>
      </div>
      <p style="margin-top: 0;">
        You are nearly out of space. Uploads from FREE plan will stop. Paid plan users will be charged $0.10/GB for overages.
      </p>
      <a href="${upgradeUrl}" style="display: inline-block; padding: 10px 14px; background: #b91c1c; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 700;">
        Upgrade Now — Avoid Interruption
      </a>
    </div>
  `;
};
