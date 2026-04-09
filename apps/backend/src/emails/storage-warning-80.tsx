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
    <p style="color:rgb(55,65,81);font-size:16px;margin:0 0 24px;line-height:24px;">Hi ${name},</p>
    <p style="color:rgb(55,65,81);font-size:16px;margin:0 0 24px;line-height:24px;">You have used most of your Fotno storage.</p>
    <div style="margin:0 0 24px;">
      <div style="height:14px;border-radius:999px;background:#fde68a;overflow:hidden;border:1px solid #f59e0b;">
        <div style="height:100%;width:${Math.min(100, Math.max(0, percentage))}%;background:#f59e0b;"></div>
      </div>
      <p style="color:rgb(17,24,39);font-size:15px;margin:10px 0 0;line-height:24px;">${formatBytes(used)} of ${formatBytes(limit)} used (${percentage}%)</p>
      <p style="color:rgb(107,114,128);font-size:13px;margin:4px 0 0;line-height:24px;">You still have ${formatBytes(remaining)} remaining</p>
    </div>
    <a href="${upgradeUrl}" style="display:inline-block;padding:12px 24px;background:#c97a3a;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-size:15px;">Upgrade Your Plan</a>
    <p style="color:rgb(107,114,128);font-size:13px;margin:24px 0 0;line-height:24px;">If you exceed your limit, additional storage is billed at $0.10/GB at the end of your billing cycle.</p>
  `;
};
