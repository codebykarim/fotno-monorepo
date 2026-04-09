import { sendMail } from "../../utils/sendMail";

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

type NotificationEvent =
  | {
      type: "submitted";
      photographerEmail: string;
      photographerName: string;
      photographerId?: string;
      clientName: string;
      albumTitle: string;
      galleryTitle: string;
      reviewUrl: string;
    }
  | {
      type: "approved";
      photographerId?: string;
      clientEmail: string;
      clientName: string;
      albumTitle: string;
      galleryTitle: string;
      notes?: string | null;
    }
  | {
      type: "changes_requested";
      photographerId?: string;
      clientEmail: string;
      clientName: string;
      albumTitle: string;
      galleryTitle: string;
      notes: string;
      designUrl: string;
    }
  | {
      type: "rejected";
      photographerId?: string;
      clientEmail: string;
      clientName: string;
      albumTitle: string;
      galleryTitle: string;
      reason: string;
    };

export const sendAlbumNotification = async (
  event: NotificationEvent,
): Promise<void> => {
  switch (event.type) {
    case "submitted": {
      const name = escapeHtml(event.photographerName);
      const client = escapeHtml(event.clientName);
      const album = escapeHtml(event.albumTitle);
      const gallery = escapeHtml(event.galleryTitle);
      const url = encodeURI(event.reviewUrl);
      await sendMail({
        to: event.photographerEmail,
        subject: `New album submission: "${event.albumTitle}" from ${event.clientName}`,
        text: `<p style="margin:0 0 12px;">Hi ${name},</p>
<p style="margin:0 0 16px;"><strong>${client}</strong> has submitted an album design for review.</p>
<ul style="margin:0 0 20px;padding-left:20px;color:#374151;">
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
<a href="${url}" style="display:inline-block;padding:12px 24px;background-color:#c97a3a;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;">Review Submission</a>`,

        preheaderText: `${client} submitted "${album}" for review`,
      });
      break;
    }
    case "approved": {
      const name = escapeHtml(event.clientName);
      const album = escapeHtml(event.albumTitle);
      const gallery = escapeHtml(event.galleryTitle);
      const notes = event.notes ? escapeHtml(event.notes) : null;
      await sendMail({
        to: event.clientEmail,
        subject: `Your album "${event.albumTitle}" has been approved!`,
        text: `<p style="margin:0 0 12px;">Hi ${name},</p>
<p style="margin:0 0 16px;">Great news! Your album design has been <strong>approved</strong> by the photographer.</p>
<ul style="margin:0 0 20px;padding-left:20px;color:#374151;">
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
${notes ? `<p style="margin:0 0 16px;"><strong>Note from photographer:</strong> ${notes}</p>` : ""}`,

        preheaderText: `Your album "${album}" has been approved`,
      });
      break;
    }
    case "changes_requested": {
      const name = escapeHtml(event.clientName);
      const album = escapeHtml(event.albumTitle);
      const gallery = escapeHtml(event.galleryTitle);
      const notes = escapeHtml(event.notes);
      const url = encodeURI(event.designUrl);
      await sendMail({
        to: event.clientEmail,
        subject: `Changes requested for your album "${event.albumTitle}"`,
        text: `<p style="margin:0 0 12px;">Hi ${name},</p>
<p style="margin:0 0 16px;">The photographer has reviewed your album and requested some changes.</p>
<ul style="margin:0 0 16px;padding-left:20px;color:#374151;">
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
<p style="margin:0 0 20px;"><strong>Feedback:</strong> ${notes}</p>
<a href="${url}" style="display:inline-block;padding:12px 24px;background-color:#c97a3a;color:#ffffff;border-radius:8px;text-decoration:none;font-weight:600;">Update Your Album</a>`,

        preheaderText: `Changes requested for "${album}"`,
      });
      break;
    }
    case "rejected": {
      const name = escapeHtml(event.clientName);
      const album = escapeHtml(event.albumTitle);
      const gallery = escapeHtml(event.galleryTitle);
      const reason = escapeHtml(event.reason);
      await sendMail({
        to: event.clientEmail,
        subject: `Update on your album "${event.albumTitle}"`,
        text: `<p style="margin:0 0 12px;">Hi ${name},</p>
<p style="margin:0 0 16px;">We're sorry, but your album submission was not approved.</p>
<ul style="margin:0 0 16px;padding-left:20px;color:#374151;">
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
<p style="margin:0 0 16px;"><strong>Reason:</strong> ${reason}</p>
<p style="margin:0;color:#6b7280;">Please contact the photographer if you have questions.</p>`,

        preheaderText: `Update on your album "${album}"`,
      });
      break;
    }
  }
};
