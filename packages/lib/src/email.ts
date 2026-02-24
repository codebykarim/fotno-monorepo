import { Resend } from "resend";

export type StorageWarningLevel = 80 | 95;

const resendClient = process.env.RESEND_API_KEY
  ? new Resend(process.env.RESEND_API_KEY)
  : null;

function formatBytes(value: bigint): string {
  const units = ["B", "KB", "MB", "GB", "TB"];
  let size = Number(value);
  let unitIndex = 0;

  while (size >= 1024 && unitIndex < units.length - 1) {
    size /= 1024;
    unitIndex += 1;
  }

  return `${size.toFixed(unitIndex === 0 ? 0 : 1)} ${units[unitIndex]}`;
}

export async function sendStorageWarningEmail(params: {
  to: string;
  name?: string | null;
  used: bigint;
  limit: bigint;
  percentage: number;
  level: StorageWarningLevel;
  upgradeUrl: string;
}): Promise<void> {
  if (!resendClient) {
    return;
  }

  const subject =
    params.level === 95
      ? "Urgent: your storage is almost full"
      : "Storage usage warning";

  const greeting =
    params.name && params.name.trim().length > 0 ? `Hi ${params.name},` : "Hi,";
  const html = [
    `<p>${greeting}</p>`,
    `<p>Your storage usage reached <strong>${params.percentage}%</strong>.</p>`,
    `<p>Used: <strong>${formatBytes(params.used)}</strong><br/>Limit: <strong>${formatBytes(params.limit)}</strong></p>`,
    `<p>Upgrade anytime in your billing settings: <a href="${params.upgradeUrl}">${params.upgradeUrl}</a></p>`,
  ].join("");

  await resendClient.emails.send({
    from: "Fotno <support@fotno.com>",
    to: [params.to],
    subject,
    html,
  });
}
