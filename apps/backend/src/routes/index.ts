import { Router } from "express";
import userRoutes from "./userRoutes";
import paymentRouter from "./paymentRoutes";
import dashboardRoutes from "./dashboardRoutes";
import storageRoutes from "./storageRoutes";
import publicGalleryRoutes from "./publicGalleryRoutes";
import adminRoutes from "./adminRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", paymentRouter);
routes.use("/api", dashboardRoutes);
routes.use("/api", storageRoutes);
routes.use("/api", publicGalleryRoutes);
routes.use("/api", adminRoutes);

export default routes;
