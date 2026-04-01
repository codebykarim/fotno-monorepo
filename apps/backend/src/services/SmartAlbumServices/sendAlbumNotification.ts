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
  | { type: "submitted"; photographerEmail: string; photographerName: string; clientName: string; albumTitle: string; galleryTitle: string; reviewUrl: string }
  | { type: "approved"; clientEmail: string; clientName: string; albumTitle: string; galleryTitle: string; notes?: string | null }
  | { type: "changes_requested"; clientEmail: string; clientName: string; albumTitle: string; galleryTitle: string; notes: string; designUrl: string }
  | { type: "rejected"; clientEmail: string; clientName: string; albumTitle: string; galleryTitle: string; reason: string };

export const sendAlbumNotification = async (event: NotificationEvent): Promise<void> => {
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
        text: `<p>Hi ${name},</p>
<p><strong>${client}</strong> has submitted an album design for review.</p>
<ul>
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
<p><a href="${url}">Review the submission</a></p>
<p>— Fotno</p>`,
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
        text: `<p>Hi ${name},</p>
<p>Great news! Your album design has been <strong>approved</strong> by the photographer.</p>
<ul>
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
${notes ? `<p><strong>Note from photographer:</strong> ${notes}</p>` : ""}
<p>— Fotno</p>`,
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
        text: `<p>Hi ${name},</p>
<p>The photographer has reviewed your album and requested some changes.</p>
<ul>
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
<p><strong>Feedback:</strong> ${notes}</p>
<p><a href="${url}">Update your album</a></p>
<p>— Fotno</p>`,
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
        text: `<p>Hi ${name},</p>
<p>We're sorry, but your album submission was not approved.</p>
<ul>
  <li><strong>Album:</strong> ${album}</li>
  <li><strong>Gallery:</strong> ${gallery}</li>
</ul>
<p><strong>Reason:</strong> ${reason}</p>
<p>Please contact the photographer if you have questions.</p>
<p>— Fotno</p>`,
      });
      break;
    }
  }
};
