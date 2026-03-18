import { Router } from "express";
import userRoutes from "./userRoutes";
import billingRouter from "./billingRoutes";
import dashboardRoutes from "./dashboardRoutes";
import storageRoutes from "./storageRoutes";
import publicGalleryRoutes from "./publicGalleryRoutes";
import adminRoutes from "./adminRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", billingRouter);
routes.use("/api", dashboardRoutes);
routes.use("/api", storageRoutes);
routes.use("/api", publicGalleryRoutes);
routes.use("/api", adminRoutes);

export default routes;
