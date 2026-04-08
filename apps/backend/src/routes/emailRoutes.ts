import { Router } from "express";
import { inboundWebhookController } from "../controllers/EmailController";

const emailRouter = Router();

// Resend webhook — no auth (Resend sends these)
emailRouter.post("/email/webhook", inboundWebhookController);

export default emailRouter;
