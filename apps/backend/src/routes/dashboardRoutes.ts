import { NextFunction, Request, Response, Router } from "express";
import * as DashboardController from "../controllers/DashboardController";
import isAuth from "../middleware/isAuth";
import isActiveSubscriber from "../middleware/isActiveSubscriber";
import { requireFeature } from "../middleware/requireFeature";
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
    middlewares: [isActiveSubscriber],
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
  "get-gallery-photos": {
    httpMethod: "GET",
    controllerFunction: DashboardController.getGalleryPhotosController,
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
    middlewares: [isActiveSubscriber],
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
    middlewares: [isActiveSubscriber],
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
  "gdrive-auth-status": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gdriveAuthStatusController,
    authFunction: isAuth,
  },
  "gdrive-disconnect": {
    httpMethod: "POST",
    controllerFunction: DashboardController.gdriveDisconnectController,
    authFunction: isAuth,
  },
  "gdrive-access-token": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gdriveAccessTokenController,
    authFunction: isAuth,
  },
  "gdrive-start-import": {
    httpMethod: "POST",
    controllerFunction: DashboardController.gdriveStartImportController,
    authFunction: isAuth,
    middlewares: [isActiveSubscriber, requireFeature("GOOGLE_IMPORT")],
  },
  "gdrive-import-status": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gdriveImportStatusController,
    authFunction: isAuth,
  },
  "gdrive-list-imports": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gdriveListImportsController,
    authFunction: isAuth,
  },
  "gdrive-cancel-import": {
    httpMethod: "POST",
    controllerFunction: DashboardController.gdriveCancelImportController,
    authFunction: isAuth,
  },
  "gphotos-auth-status": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gphotosAuthStatusController,
    authFunction: isAuth,
  },
  "gphotos-disconnect": {
    httpMethod: "POST",
    controllerFunction: DashboardController.gphotosDisconnectController,
    authFunction: isAuth,
  },
  "gphotos-create-session": {
    httpMethod: "POST",
    controllerFunction: DashboardController.gphotosCreateSessionController,
    authFunction: isAuth,
  },
  "gphotos-session-status": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gphotosSessionStatusController,
    authFunction: isAuth,
  },
  "gphotos-picked-items": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gphotosPickedItemsController,
    authFunction: isAuth,
  },
  "gphotos-proxy-image": {
    httpMethod: "GET",
    controllerFunction: DashboardController.gphotosProxyImageController,
    authFunction: isAuth,
  },
  "gphotos-start-import": {
    httpMethod: "POST",
    controllerFunction: DashboardController.gphotosStartImportController,
    authFunction: isAuth,
    middlewares: [isActiveSubscriber, requireFeature("GOOGLE_IMPORT")],
  },
  "list-gallery-favorites": {
    httpMethod: "GET",
    controllerFunction: DashboardController.listGalleryFavoritesController,
    authFunction: isAuth,
  },
  "get-download-activity": {
    httpMethod: "GET",
    controllerFunction: DashboardController.getDownloadActivityController,
    authFunction: isAuth,
  },
  "get-gallery-analytics": {
    httpMethod: "GET",
    controllerFunction: DashboardController.getGalleryAnalyticsController,
    authFunction: isAuth,
    middlewares: [requireFeature("ANALYTICS")],
  },
  "gallery-processing-status": {
    httpMethod: "GET",
    controllerFunction:
      DashboardController.getGalleryProcessingStatusController,
    authFunction: isAuth,
  },
  "retry-failed-photos": {
    httpMethod: "POST",
    controllerFunction: DashboardController.retryFailedPhotosController,
    authFunction: isAuth,
  },
  "list-gallery-comments": {
    httpMethod: "GET",
    controllerFunction: DashboardController.listGalleryCommentsController,
    authFunction: isAuth,
    middlewares: [requireFeature("COMMENTS")],
  },
  "create-gallery-comment": {
    httpMethod: "POST",
    controllerFunction: DashboardController.createGalleryCommentController,
    authFunction: isAuth,
    middlewares: [requireFeature("COMMENTS")],
  },
  "edit-gallery-comment": {
    httpMethod: "PATCH",
    controllerFunction: DashboardController.editGalleryCommentController,
    authFunction: isAuth,
    middlewares: [requireFeature("COMMENTS")],
  },
  "delete-gallery-comment": {
    httpMethod: "DELETE",
    controllerFunction: DashboardController.deleteGalleryCommentController,
    authFunction: isAuth,
    middlewares: [requireFeature("COMMENTS")],
  },
  "toggle-gallery-comment-like": {
    httpMethod: "POST",
    controllerFunction: DashboardController.toggleGalleryCommentLikeController,
    authFunction: isAuth,
    middlewares: [requireFeature("COMMENTS")],
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

dashboardRoutes.get(
  "/dashboard/galleries/:id/photos",
  handleMethod("get-gallery-photos"),
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
dashboardRoutes.patch(
  "/dashboard/galleries/:id/albums/:albumId",
  handleMethod("update-album"),
);
dashboardRoutes.delete(
  "/dashboard/galleries/:id/albums/:albumId",
  handleMethod("delete-album"),
);

dashboardRoutes.patch("/dashboard/photos/:id", handleMethod("update-photo"));
dashboardRoutes.delete("/dashboard/photos/:id", handleMethod("delete-photo"));

// ─── Google Drive Import ────────────────────────────────────────────────────
dashboardRoutes.get(
  "/dashboard/gdrive/auth-status",
  handleMethod("gdrive-auth-status"),
);
dashboardRoutes.post(
  "/dashboard/gdrive/disconnect",
  handleMethod("gdrive-disconnect"),
);
dashboardRoutes.get(
  "/dashboard/gdrive/access-token",
  handleMethod("gdrive-access-token"),
);
dashboardRoutes.post(
  "/dashboard/gdrive/import",
  handleMethod("gdrive-start-import"),
);
dashboardRoutes.get(
  "/dashboard/gdrive/import/:jobId",
  handleMethod("gdrive-import-status"),
);
dashboardRoutes.get(
  "/dashboard/gdrive/imports",
  handleMethod("gdrive-list-imports"),
);
dashboardRoutes.post(
  "/dashboard/gdrive/import/:jobId/cancel",
  handleMethod("gdrive-cancel-import"),
);

// ─── Google Photos Import ───────────────────────────────────────────────────
dashboardRoutes.get(
  "/dashboard/gphotos/auth-status",
  handleMethod("gphotos-auth-status"),
);
dashboardRoutes.post(
  "/dashboard/gphotos/disconnect",
  handleMethod("gphotos-disconnect"),
);
dashboardRoutes.post(
  "/dashboard/gphotos/session",
  handleMethod("gphotos-create-session"),
);
dashboardRoutes.get(
  "/dashboard/gphotos/session/:sessionId",
  handleMethod("gphotos-session-status"),
);
dashboardRoutes.get(
  "/dashboard/gphotos/session/:sessionId/items",
  handleMethod("gphotos-picked-items"),
);
dashboardRoutes.get(
  "/dashboard/gphotos/image",
  handleMethod("gphotos-proxy-image"),
);
dashboardRoutes.post(
  "/dashboard/gphotos/import",
  handleMethod("gphotos-start-import"),
);

// ─── Gallery Favorites & Download Activity ────────────────────────────────
dashboardRoutes.get(
  "/dashboard/galleries/:id/favorites",
  handleMethod("list-gallery-favorites"),
);
dashboardRoutes.get(
  "/dashboard/galleries/:id/download-activity",
  handleMethod("get-download-activity"),
);
dashboardRoutes.get(
  "/dashboard/galleries/:id/analytics",
  handleMethod("get-gallery-analytics"),
);

// ─── Photo Processing Status ──────────────────────────────────────────────
dashboardRoutes.get(
  "/dashboard/galleries/:id/photos/processing-status",
  handleMethod("gallery-processing-status"),
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/photos/retry-failed",
  handleMethod("retry-failed-photos"),
);

// ─── Gallery Comments ────────────────────────────────────────────────────
dashboardRoutes.get(
  "/dashboard/galleries/:id/comments",
  handleMethod("list-gallery-comments"),
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/comments",
  handleMethod("create-gallery-comment"),
);
dashboardRoutes.patch(
  "/dashboard/galleries/:id/comments/:commentId",
  handleMethod("edit-gallery-comment"),
);
dashboardRoutes.delete(
  "/dashboard/galleries/:id/comments/:commentId",
  handleMethod("delete-gallery-comment"),
);
dashboardRoutes.post(
  "/dashboard/galleries/:id/comments/:commentId/like",
  handleMethod("toggle-gallery-comment-like"),
);

export default dashboardRoutes;
