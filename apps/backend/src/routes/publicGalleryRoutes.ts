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
  "/public/photos/:photoId/url",
  handleMethod("get-public-photo-url"),
);

export default publicGalleryRoutes;
