import { emailButton } from "./layout";

export type AdminPresetId =
  | "checkin"
  | "pricing"
  | "promo"
  | "feature"
  | "listening"
  // | "correction"; // TEMPORARY: remove once LAUNCH30 follow-ups are done

export type AdminMessageParams = {
  preset: AdminPresetId;
  userName: string;
  promoCode?: string;
  featureName?: string;
};

const dashboardUrl =
process.env.NEXT_PUBLIC_DASHBOARD_URL ?? "https://app.fotno.com";

const paragraph = (html: string) =>
  `<p style="color:rgb(55,65,81);font-size:16px;margin:0 0 24px;line-height:24px;">${html}</p>`;

const signoff = paragraph("Fotno team");

const codeBox = (code: string) =>
  `<div style="background-color:rgb(254,247,237);border-radius:8px;padding:16px 24px;display:inline-block;margin-bottom:24px;">
    <p style="color:rgb(17,24,39);font-size:32px;font-weight:700;margin:0;line-height:40px;letter-spacing:3px;">${code}</p>
  </div>`;

const greeting = (name: string) => paragraph(`Hi ${name || "there"},`);

const renderCheckin = (p: AdminMessageParams) =>
  greeting(p.userName) +
  paragraph(
    "I wanted to check in personally. is there anything getting in your way with Fotno right now?"
  ) +
  paragraph(
    "If something isn't clicking, I'd love to hear about it. Just reply to this email and it'll come straight to me."
  ) +
  signoff;

const renderPricing = (p: AdminMessageParams) =>
  greeting(p.userName) +
  paragraph(
    "I noticed your subscription didn't renew. I wanted to reach out in case the pricing wasn't working for you, or if there's something we could do differently."
  ) +
  paragraph(
    "If you have a minute, I'd love to know what changed. And if you'd like to come back, you can resubscribe here:"
  ) +
  `<div style="margin:0 0 24px;">${emailButton("Manage subscription", `${dashboardUrl}/billing`)}</div>` +
  signoff;

const renderPromo = (p: AdminMessageParams) =>
  greeting(p.userName) +
  paragraph(
    "Just a small thank-you for being part of Fotno. Here's a promo code you can use on any paid plan:"
  ) +
  codeBox(p.promoCode ?? "") +
  paragraph(`Valid until ${CORRECTION_VALID_UNTIL}.`) +
  `<div style="margin:0 0 24px;">${emailButton("Use code", `${dashboardUrl}/billing`)}</div>` +
  signoff;

const renderFeature = (p: AdminMessageParams) =>
  greeting(p.userName) +
  paragraph(
    `Have you tried <strong>${p.featureName ?? ""}</strong> yet? It's something we built for photographers like you, and we think it could save you real time.`
  ) +
  paragraph(
    "Take it for a spin. and if anything feels off, hit reply and tell me."
  ) +
  `<div style="margin:0 0 24px;">${emailButton("Open Fotno", dashboardUrl)}</div>` +
  signoff;

const renderListening = (p: AdminMessageParams) =>
  greeting(p.userName) +
  paragraph(
    "I'm working on the next round of Fotno improvements and I genuinely want your input."
  ) +
  paragraph(
    "What's the one thing. big or small. that would make Fotno better for you? Just reply to this email."
  ) +
  signoff;

// // TEMPORARY: one-off correction for users who got the LAUNCH30 promo from the
// // dev environment with a broken link. Remove this preset (and its entries in
// // AdminPresetId, ADMIN_PRESETS, the controller validator, and the modal
// // PRESETS list) once all affected users have been re-emailed.
// const CORRECTION_CODE = "LAUNCH30";
// const CORRECTION_DISCOUNT = "30% off any paid plan";
const CORRECTION_VALID_UNTIL = "June 1";
// const renderCorrection = (p: AdminMessageParams) =>
//   greeting(p.userName) +
//   paragraph(
//     "Small confession: the email I sent you earlier had a broken link (sent it from my dev environment by mistake). Sorry about that!"
//   ) +
//   paragraph("Here's the working version. same code, same offer:") +
//   `<div style="background-color:rgb(254,247,237);border-radius:8px;padding:16px 24px;display:inline-block;margin-bottom:24px;">
//     <p style="color:rgb(17,24,39);font-size:24px;font-weight:700;margin:0;line-height:32px;letter-spacing:2px;">${CORRECTION_CODE}</p>
//     <p style="color:rgb(55,65,81);font-size:14px;margin:4px 0 0;line-height:20px;">${CORRECTION_DISCOUNT}</p>
//   </div>` +
//   paragraph(`Valid until ${CORRECTION_VALID_UNTIL}.`) +
//   `<div style="margin:0 0 24px;">${emailButton("Claim 30% off →", `${dashboardUrl}/billing`)}</div>` +
//   `<p style="color:rgb(55,65,81);font-size:16px;margin:0 0 24px;line-height:24px;">Thanks for bearing with me,<br />Karim<br />Fotno</p>`;

export const ADMIN_PRESETS: Record<
  AdminPresetId,
  {
    label: string;
    description: string;
    subject: string;
    requiresPromoCode?: boolean;
    requiresFeatureName?: boolean;
    render: (p: AdminMessageParams) => string;
  }
> = {
  checkin: {
    label: "Check in",
    description: "Personal note asking if anything's getting in their way.",
    subject: "Checking in from Fotno",
    render: renderCheckin,
  },
  pricing: {
    label: "About your subscription",
    description: "Reach out after a non-renewal to ask about pricing.",
    subject: "About your Fotno subscription",
    render: renderPricing,
  },
  promo: {
    label: "Offer a promo code",
    description: "Send a thank-you with a promo code to use at checkout.",
    subject: "A small thank-you from Fotno",
    requiresPromoCode: true,
    render: renderPromo,
  },
  feature: {
    label: "Highlight a feature",
    description: "Nudge them to try a specific Fotno feature.",
    subject: "Have you tried this in Fotno?",
    requiresFeatureName: true,
    render: renderFeature,
  },
  listening: {
    label: "We're listening",
    description: "Ask for feedback on what would make Fotno better.",
    subject: "We're listening. what would help?",
    render: renderListening,
  },
  // // TEMPORARY: see renderCorrection above. Remove this entry too.
  // correction: {
  //   label: "Promo correction (LAUNCH30)",
  //   description:
  //     "One-off: re-send the LAUNCH30 promo with a working link to users who got the broken localhost version.",
  //   subject: "Quick correction on that promo email",
  //   render: renderCorrection,
  // },
};

export const renderAdminMessageEmail = (
  params: AdminMessageParams
): { subject: string; html: string } => {
  const preset = ADMIN_PRESETS[params.preset];
  if (!preset) {
    throw new Error(`Unknown admin email preset: ${params.preset}`);
  }
  return {
    subject: preset.subject,
    html: preset.render(params),
  };
};
