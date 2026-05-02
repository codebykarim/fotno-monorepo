const FONT_STACK =
  'ui-sans-serif, system-ui, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol", "Noto Color Emoji"';

const LOGO_URL = "https://fotno.com/fotno-logo.png";

type EmailLayoutOptions = {
  preheaderText?: string;
};

/**
 * Wraps email content in the branded Fotno layout.
 */
export function wrapEmailLayout(
  contentHtml: string,
  options: EmailLayoutOptions = {},
): string {
  const { preheaderText } = options;

  const preheader = preheaderText
    ? `<span style="display:none;font-size:1px;color:#ffffff;line-height:1px;max-height:0;max-width:0;opacity:0;overflow:hidden;">${preheaderText}</span>`
    : "";

  return `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html dir="ltr" lang="en">
<head>
  <meta content="text/html; charset=UTF-8" http-equiv="Content-Type" />
  <meta name="x-apple-disable-message-reformatting" />
</head>
<body style="background-color:rgb(244,244,245);font-family:${FONT_STACK};padding-top:40px;padding-bottom:40px;margin:0;">
  ${preheader}
  <table align="center" width="100%" border="0" cellpadding="0" cellspacing="0" role="presentation" style="max-width:560px;margin-left:auto;margin-right:auto;">
    <tbody>
      <tr style="width:100%">
        <td>
          <div style="background-color:rgb(255,255,255);border-radius:12px;padding:40px;">
            <img src="${LOGO_URL}" alt="Fotno" width="140" height="140" style="display:block;border:0;outline:none;text-decoration:none;margin:0 0 16px -16px;" />
            ${contentHtml}
            <hr style="border-width:0;border-top-width:1px;border-style:solid;border-color:rgb(229,231,235);margin-top:32px;margin-bottom:32px;" />
            <p style="color:rgb(107,114,128);font-size:13px;margin:0 0 8px;line-height:24px;">If you believe you are getting this email in error, please visit fotno.com.</p>
            <p style="color:rgb(107,114,128);font-size:13px;margin:0;line-height:24px;">Fotno Ltd, United Kingdom</p>
          </div>
        </td>
      </tr>
    </tbody>
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
  return `<a href="${href}" style="display:inline-block;padding:12px 24px;background-color:${color};color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;font-family:${FONT_STACK};font-size:15px;line-height:1;text-align:center;" target="_blank">${text}</a>`;
}
