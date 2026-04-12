import { NextFunction, Request, Response, Router } from "express";
import * as PublicGalleryController from "../controllers/PublicGalleryController";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";
import { requireGalleryOwnerFeature } from "../middleware/requireGalleryOwnerFeature";

const publicGalleryRoutes = Router();

const publicGalleryMethods: { [key: string]: MethodInfo } = {
  "get-public-gallery": {
    httpMethod: "GET",
    controllerFunction: PublicGalleryController.getPublicGalleryController,
  },
  "unlock-public-gallery": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.unlockPublicGalleryController,
  },
  "get-public-photo-url": {
    httpMethod: "GET",
    controllerFunction: PublicGalleryController.getPublicPhotoUrlController,
  },
  "list-gallery-comments": {
    httpMethod: "GET",
    controllerFunction: PublicGalleryController.listGalleryCommentsController,
    middlewares: [requireGalleryOwnerFeature("COMMENTS")],
  },
  "create-gallery-comment": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.createGalleryCommentController,
    middlewares: [requireGalleryOwnerFeature("COMMENTS")],
  },
  "edit-gallery-comment": {
    httpMethod: "PATCH",
    controllerFunction: PublicGalleryController.editGalleryCommentController,
    middlewares: [requireGalleryOwnerFeature("COMMENTS")],
  },
  "delete-gallery-comment": {
    httpMethod: "DELETE",
    controllerFunction: PublicGalleryController.deleteGalleryCommentController,
    middlewares: [requireGalleryOwnerFeature("COMMENTS")],
  },
  "toggle-comment-like": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.toggleCommentLikeController,
    middlewares: [requireGalleryOwnerFeature("COMMENTS")],
  },
  "add-favorite": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.addFavoriteController,
  },
  "remove-favorite": {
    httpMethod: "DELETE",
    controllerFunction: PublicGalleryController.removeFavoriteController,
  },
  "list-viewer-favorites": {
    httpMethod: "GET",
    controllerFunction: PublicGalleryController.listViewerFavoritesController,
  },
  "verify-download-pin": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.verifyDownloadPinController,
  },
  "track-download": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.trackDownloadController,
  },
  "track-view": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.trackGalleryViewController,
  },
  "create-favorite-share": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.createFavoriteShareController,
  },
  "get-shared-favorites": {
    httpMethod: "GET",
    controllerFunction: PublicGalleryController.getSharedFavoritesController,
  },
};

const mappedMethods = init(publicGalleryMethods);

const handleMethod =
  (method: string) => (req: Request, res: Response, next: NextFunction) => {
    req.params.method = method;
    return mappedMethods(req, res, next);
  };

publicGalleryRoutes.get(
  "/public/gallery/:shareToken",
  handleMethod("get-public-gallery"),
);
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/unlock",
  handleMethod("unlock-public-gallery"),
);
publicGalleryRoutes.get(
  "/public/gallery/:shareToken/comments",
  handleMethod("list-gallery-comments"),
);
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/comments",
  handleMethod("create-gallery-comment"),
);
publicGalleryRoutes.patch(
  "/public/gallery/:shareToken/comments/:commentId",
  handleMethod("edit-gallery-comment"),
);
publicGalleryRoutes.delete(
  "/public/gallery/:shareToken/comments/:commentId",
  handleMethod("delete-gallery-comment"),
);
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/comments/:commentId/like",
  handleMethod("toggle-comment-like"),
);
publicGalleryRoutes.get(
  "/public/photos/:photoId/url",
  handleMethod("get-public-photo-url"),
);

// ─── Favorites ──────────────────────────────────────────────────────────────
publicGalleryRoutes.get(
  "/public/gallery/:shareToken/favorites",
  handleMethod("list-viewer-favorites"),
);
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/favorites",
  handleMethod("add-favorite"),
);
publicGalleryRoutes.delete(
  "/public/gallery/:shareToken/favorites/:photoId",
  handleMethod("remove-favorite"),
);

// ─── Download ───────────────────────────────────────────────────────────────
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/verify-download-pin",
  handleMethod("verify-download-pin"),
);
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/download-event",
  handleMethod("track-download"),
);
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/view",
  handleMethod("track-view"),
);

// ─── Favorite Shares ───────────────────────────────────────────────────────
publicGalleryRoutes.post(
  "/public/gallery/:shareToken/favorite-share",
  handleMethod("create-favorite-share"),
);
publicGalleryRoutes.get(
  "/public/shared-favorites/:favoriteShareToken",
  handleMethod("get-shared-favorites"),
);

export default publicGalleryRoutes;
