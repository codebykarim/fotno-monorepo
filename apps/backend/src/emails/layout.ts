const LOGO_BASE64 =
  "iVBORw0KGgoAAAANSUhEUgAAAFAAAABQCAYAAACOEfKtAAAACXBIWXMAAAsTAAALEwEAmpwYAAACa0lEQVR4nO2cUW4TMRCGLQ4AEveAgpCatXOBVj0CfW0RvcB2TKX0secopZfgFSWehUNUlHsEOaUVSoi02X8d7Oz/SX6Jot3xt7ZWOx6NMYQQQkgqmtq+DVJ9UG9raIj7OJ1UL01i4j3ivdB4g7enoR7vdQ7kR/3uRfDui3o3722Iu0sp8Y+8uz5jDmJvwmT/+cbBqLjbXuX5h9F4e5Zst3h7liLmKHEzed69SRGIFiowjpmMXrcOJO7/JIFIeVv4aRV6e9o6EBV7uXoB9y2Iu+o6dMsvESTWONfVh28vIYEbXaBw4PlToKVABK5AEAoEoUAQCgShQBAKBKFAEAocksDg7ZGK+9Xjh/9948eHgxGo3t33njkR+3NIAucUCJBCnp5XB1BM6AL6V2Y3VSZZl+5jMgCe/0pmN2EmWTMU2Mv8n44HE2eSNUOB25z/zgosBqVADAoEoUAQCgShQBAKBMkpC1MkmlEWpkiUAjFyysIUifJLBIMCQSgQhAJBKBCEAkEoEIQCQSgQhAJBdlYgjzWr7seaPFivsIN1lnZYrLTjf1ZnmQwourzNZECxBZYhk5R8UQIbPz6MElNmlOcT82x2PhrNxB3H8d1X+/G3nRC4DaKwRROJv0b8bd3/KXCJuOqWBTbijs0aKLCFQP3k3ps1UGCLLTzlFm5PfGFEiXyJbAluYRAKBKFAEAoEocAcBQZxX4fSPzAs5goIZPMxt1pCJ+6kvcB6vNdn4aN2zeyW2v5uIVHsDQW6R4HXGz/N2Payd4lSXv/A4O3nTi1AH4lLN+5/qB+fFNY/8CHek+lF9Sp1vIQQQsxw+Q0xmp43afBjYAAAAABJRU5ErkJggg==";

const DASHBOARD_URL =
  process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://dashboard.fotno.com";

const FONT_STACK =
  "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Arial, sans-serif";

type EmailLayoutOptions = {
  photographerBranding?: {
    name: string;
    logoUrl: string | null;
  };
  showFooterLinks?: boolean;
  preheaderText?: string;
};

/**
 * Wraps email content in the branded Fotno layout.
 */
export function wrapEmailLayout(
  contentHtml: string,
  options: EmailLayoutOptions = {},
): string {
  const { photographerBranding, showFooterLinks = true, preheaderText } = options;

  const preheader = preheaderText
    ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheaderText}</span>`
    : "";

  const photographerRow = photographerBranding
    ? `<tr>
        <td align="center" style="padding:16px 32px 0;background-color:#ffffff;">
          ${
            photographerBranding.logoUrl
              ? `<img src="${photographerBranding.logoUrl}" alt="${photographerBranding.name}" style="max-height:48px;max-width:200px;display:block;margin:0 auto;" />`
              : `<p style="margin:0;font-family:${FONT_STACK};font-size:16px;font-weight:600;color:#374151;">${photographerBranding.name}</p>`
          }
        </td>
      </tr>`
    : "";

  const footerLinks = showFooterLinks
    ? `<a href="${DASHBOARD_URL}/settings" style="color:#9ca3af;text-decoration:underline;font-size:13px;">Manage preferences</a>
       <span style="color:#4b5563;font-size:13px;"> &middot; </span>
       <a href="https://fotno.com" style="color:#9ca3af;text-decoration:underline;font-size:13px;">fotno.com</a>`
    : `<a href="https://fotno.com" style="color:#9ca3af;text-decoration:underline;font-size:13px;">fotno.com</a>`;

  return `<!DOCTYPE html>
<html lang="en" xmlns="http://www.w3.org/1999/xhtml">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <meta name="color-scheme" content="light" />
  <meta name="supported-color-schemes" content="light" />
  <title>Fotno</title>
  <!--[if mso]>
  <style>table,td{font-family:Arial,sans-serif;}</style>
  <![endif]-->
</head>
<body style="margin:0;padding:0;background-color:#f3f4f6;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%;">
  ${preheader}
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0" style="background-color:#f3f4f6;">
    <tr>
      <td align="center" style="padding:32px 16px;">
        <table role="presentation" width="600" cellpadding="0" cellspacing="0" border="0" style="max-width:600px;width:100%;border-radius:12px;overflow:hidden;box-shadow:0 1px 3px rgba(0,0,0,0.08);">

          <!-- Header -->
          <tr>
            <td align="center" style="background-color:#1a1a1f;padding:28px 32px;">
              <table role="presentation" cellpadding="0" cellspacing="0" border="0">
                <tr>
                  <td style="vertical-align:middle;padding-right:12px;">
                    <img src="data:image/png;base64,${LOGO_BASE64}" alt="Fotno" width="32" height="32" style="display:block;border:0;" />
                  </td>
                  <td style="vertical-align:middle;">
                    <span style="font-family:${FONT_STACK};font-size:22px;font-weight:700;color:#c97a3a;letter-spacing:1px;">FOTNO</span>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Photographer branding (optional) -->
          ${photographerRow}

          <!-- Content -->
          <tr>
            <td style="background-color:#ffffff;padding:32px;font-family:${FONT_STACK};font-size:15px;line-height:1.6;color:#111827;">
              ${contentHtml}
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td align="center" style="background-color:#1a1a1f;padding:20px 32px;">
              <p style="margin:0;font-family:${FONT_STACK};font-size:13px;color:#6b7280;">
                ${footerLinks}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

/**
 * Helper to render a styled CTA button for use inside email content.
 */
export function emailButton(
  text: string,
  href: string,
  color = "#c97a3a",
): string {
  return `<a href="${href}" style="display:inline-block;padding:12px 24px;background-color:${color};color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-family:${FONT_STACK};font-size:15px;line-height:1;mso-padding-alt:0;text-align:center;" target="_blank">${text}</a>`;
}
