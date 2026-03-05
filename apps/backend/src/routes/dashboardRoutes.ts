import { NextFunction, Request, Response, Router } from "express";
import * as DashboardController from "../controllers/DashboardController";
import isAuth from "../middleware/isAuth";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";

const dashboardRoutes = Router();

const dashboardMethods: { [key: string]: MethodInfo } = {
  overview: {
    httpMethod: "GET",
    controllerFunction: DashboardController.getOverviewController,
    authFunction: isAuth,
  },
  "list-galleries": {
    httpMethod: "GET",
    controllerFunction: DashboardController.listGalleriesController,
    authFunction: isAuth,
  },
  "create-gallery": {
    httpMethod: "POST",
    controllerFunction: DashboardController.createGalleryController,
    authFunction: isAuth,
  },
  "get-gallery": {
    httpMethod: "GET",
    controllerFunction: DashboardController.getGalleryController,
    authFunction: isAuth,
  },
  "update-gallery": {
    httpMethod: "PATCH",
    controllerFunction: DashboardController.updateGalleryController,
    authFunction: isAuth,
  },
  "delete-gallery": {
    httpMethod: "DELETE",
    controllerFunction: DashboardController.deleteGalleryController,
    authFunction: isAuth,
  },
  "reorder-gallery-photos": {
    httpMethod: "PATCH",
    controllerFunction: DashboardController.reorderGalleryPhotosController,
    authFunction: isAuth,
  },
  "presign-photo-upload": {
    httpMethod: "POST",
    controllerFunction: DashboardController.presignPhotoUploadController,
    authFunction: isAuth,
  },
  "get-photo-upload-sessions": {
    httpMethod: "GET",
    controllerFunction: DashboardController.getPhotoUploadSessionsController,
    authFunction: isAuth,
  },
  "part-complete-photo-upload": {
    httpMethod: "PATCH",
    controllerFunction: DashboardController.partCompletePhotoUploadController,
    authFunction: isAuth,
  },
  "confirm-photo-upload": {
    httpMethod: "POST",
    controllerFunction: DashboardController.confirmPhotoUploadController,
    authFunction: isAuth,
  },
  "create-album": {
    httpMethod: "POST",
    controllerFunction: DashboardController.createAlbumController,
    authFunction: isAuth,
  },
  "update-album": {
    httpMethod: "PATCH",
    controllerFunction: DashboardController.updateAlbumController,
    authFunction: isAuth,
  },
  "delete-album": {
    httpMethod: "DELETE",
    controllerFunction: DashboardController.deleteAlbumController,
    authFunction: isAuth,
  },
  "list-clients": {
    httpMethod: "GET",
    controllerFunction: DashboardController.listClientsController,
    authFunction: isAuth,
  },
  "update-client": {
    httpMethod: "PATCH",
    controllerFunction: DashboardController.updateClientController,
    authFunction: isAuth,
  },
  "update-photo": {
    httpMethod: "PATCH",
    controllerFunction: DashboardController.updatePhotoController,
    authFunction: isAuth,
  },
  "delete-photo": {
    httpMethod: "DELETE",
    controllerFunction: DashboardController.deletePhotoController,
    authFunction: isAuth,
  },
  "suggest-album": {
    httpMethod: "POST",
    controllerFunction: DashboardController.suggestAlbumController,
    authFunction: isAuth,
  },
  "gallery-ai-status": {
    httpMethod: "GET",
    controllerFunction: DashboardController.getGalleryAiStatusController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(dashboardMethods);

const handleMethod =
  (method: string) => (req: Request, res: Response, next: NextFunction) => {
    req.params.method = method;
    return mappedMethods(req, res, next);
  };

dashboardRoutes.get("/dashboard/overview", handleMethod("overview"));

dashboardRoutes.get("/dashboard/galleries", handleMethod("list-galleries"));
dashboardRoutes.post("/dashboard/galleries", handleMethod("create-gallery"));
dashboardRoutes.get("/dashboard/galleries/:id", handleMethod("get-gallery"));
dashboardRoutes.patch(
  "/dashboard/galleries/:id",
  handleMethod("update-gallery"),
);
dashboardRoutes.delete(
  "/dashboard/galleries/:id",
  handleMethod("delete-gallery"),
);

dashboardRoutes.patch(
  "/dashboard/galleries/:id/photos/reorder",
  handleMethod("reorder-gallery-photos"),
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/photos/presign",
  handleMethod("presign-photo-upload"),
);
dashboardRoutes.get(
  "/dashboard/galleries/:id/photos/session",
  handleMethod("get-photo-upload-sessions"),
);
dashboardRoutes.patch(
  "/dashboard/galleries/:id/photos/part-complete",
  handleMethod("part-complete-photo-upload"),
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/photos/confirm",
  handleMethod("confirm-photo-upload"),
);

dashboardRoutes.post(
  "/dashboard/galleries/:id/albums",
  handleMethod("create-album"),
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/ai/suggest-album",
  handleMethod("suggest-album"),
);
dashboardRoutes.get(
  "/dashboard/galleries/:id/ai/status",
  handleMethod("gallery-ai-status"),
);
dashboardRoutes.patch(
  "/dashboard/galleries/:id/albums/:albumId",
  handleMethod("update-album"),
);
dashboardRoutes.delete(
  "/dashboard/galleries/:id/albums/:albumId",
  handleMethod("delete-album"),
);

dashboardRoutes.get("/dashboard/clients", handleMethod("list-clients"));
dashboardRoutes.patch("/dashboard/clients/:id", handleMethod("update-client"));

dashboardRoutes.patch("/dashboard/photos/:id", handleMethod("update-photo"));
dashboardRoutes.delete("/dashboard/photos/:id", handleMethod("delete-photo"));

export default dashboardRoutes;
