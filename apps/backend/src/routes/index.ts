import { Router } from "express";
import userRoutes from "./userRoutes";
import paymentRouter from "./paymentRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", paymentRouter);

export default routes;
