import { Router } from "express";
import * as DashboardController from "../controllers/DashboardController";

const dashboardRoutes = Router();

dashboardRoutes.get("/dashboard/overview", DashboardController.getOverviewController);

dashboardRoutes.get("/dashboard/galleries", DashboardController.listGalleriesController);
dashboardRoutes.post("/dashboard/galleries", DashboardController.createGalleryController);
dashboardRoutes.get("/dashboard/galleries/:id", DashboardController.getGalleryController);
dashboardRoutes.patch("/dashboard/galleries/:id", DashboardController.updateGalleryController);
dashboardRoutes.delete("/dashboard/galleries/:id", DashboardController.deleteGalleryController);

dashboardRoutes.patch(
  "/dashboard/galleries/:id/photos/reorder",
  DashboardController.reorderGalleryPhotosController,
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/photos/presign",
  DashboardController.presignPhotoUploadController,
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/photos/confirm",
  DashboardController.confirmPhotoUploadController,
);

dashboardRoutes.post("/dashboard/galleries/:id/albums", DashboardController.createAlbumController);
dashboardRoutes.patch(
  "/dashboard/galleries/:id/albums/:albumId",
  DashboardController.updateAlbumController,
);
dashboardRoutes.delete(
  "/dashboard/galleries/:id/albums/:albumId",
  DashboardController.deleteAlbumController,
);

dashboardRoutes.get("/dashboard/clients", DashboardController.listClientsController);
dashboardRoutes.patch("/dashboard/clients/:id", DashboardController.updateClientController);

dashboardRoutes.patch("/dashboard/photos/:id", DashboardController.updatePhotoController);
dashboardRoutes.delete("/dashboard/photos/:id", DashboardController.deletePhotoController);

export default dashboardRoutes;
