import { NextFunction, Request, Response, Router } from "express";
import * as PublicGalleryController from "../controllers/PublicGalleryController";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";

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
  },
  "create-gallery-comment": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.createGalleryCommentController,
  },
  "edit-gallery-comment": {
    httpMethod: "PATCH",
    controllerFunction: PublicGalleryController.editGalleryCommentController,
  },
  "delete-gallery-comment": {
    httpMethod: "DELETE",
    controllerFunction: PublicGalleryController.deleteGalleryCommentController,
  },
  "toggle-comment-like": {
    httpMethod: "POST",
    controllerFunction: PublicGalleryController.toggleCommentLikeController,
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

export default publicGalleryRoutes;
