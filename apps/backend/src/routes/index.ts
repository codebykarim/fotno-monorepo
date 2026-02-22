import { Router } from "express";
import userRoutes from "./userRoutes";
import paymentRouter from "./paymentRoutes";
import uploadRouter from "./uploadRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", paymentRouter);
routes.use("/api", uploadRouter);

export default routes;
