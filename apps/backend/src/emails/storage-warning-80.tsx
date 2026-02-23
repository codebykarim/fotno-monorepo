import { formatBytes } from "../utils/formatBytes";

type Props = {
  name: string;
  used: bigint;
  limit: bigint;
  percentage: number;
  upgradeUrl: string;
};

export const STORAGE_WARNING_80_SUBJECT = "You've used 80% of your FOTNO storage";

export const renderStorageWarning80Email = ({
  name,
  used,
  limit,
  percentage,
  upgradeUrl,
}: Props): string => {
  const remaining = limit > used ? limit - used : 0n;

  return `
    <div style="font-family: Arial, sans-serif; color: #111827; line-height: 1.5;">
      <h2 style="margin-bottom: 8px;">Hi ${name},</h2>
      <p style="margin-top: 0;">You have used most of your FOTNO storage.</p>
      <div style="margin: 16px 0;">
        <div style="height: 14px; border-radius: 999px; background: #fde68a; overflow: hidden; border: 1px solid #f59e0b;">
          <div style="height: 100%; width: ${Math.min(100, Math.max(0, percentage))}%; background: #f59e0b;"></div>
        </div>
        <p style="margin: 10px 0 0;">${formatBytes(used)} of ${formatBytes(limit)} used (${percentage}%)</p>
        <p style="margin: 4px 0 0;">You still have ${formatBytes(remaining)} remaining</p>
      </div>
      <a href="${upgradeUrl}" style="display: inline-block; padding: 10px 14px; background: #111827; color: #ffffff; border-radius: 8px; text-decoration: none; font-weight: 600;">
        Upgrade Your Plan
      </a>
      <p style="margin-top: 16px; color: #4b5563; font-size: 14px;">
        If you exceed your limit, additional storage is billed at $0.10/GB at the end of your billing cycle.
      </p>
    </div>
  `;
};
