import { Router } from "express";
import userRoutes from "./userRoutes";
import billingRouter from "./billingRoutes";
import dashboardRoutes from "./dashboardRoutes";
import storageRoutes from "./storageRoutes";
import publicGalleryRoutes from "./publicGalleryRoutes";
import adminRoutes from "./adminRoutes";
import smartAlbumRoutes from "./smartAlbumRoutes";
import settingsRoutes from "./settingsRoutes";
import emailRouter from "./emailRoutes";

const routes = Router();

routes.use("/api", userRoutes);
routes.use("/api", billingRouter);
routes.use("/api", dashboardRoutes);
routes.use("/api", storageRoutes);
routes.use("/api", publicGalleryRoutes);
routes.use("/api", adminRoutes);
routes.use("/api", smartAlbumRoutes);
routes.use("/api", settingsRoutes);
routes.use("/api", emailRouter);

export default routes;
