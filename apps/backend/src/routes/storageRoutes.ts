import { NextFunction, Request, Response, Router } from "express";
import {
  getStorageEventsController,
  getStorageSummaryController,
} from "../controllers/StorageController";
import isAuth from "../middleware/isAuth";
import { MethodInfo } from "../interfaces";
import { init } from "../utils/methods";

const storageRoutes = Router();

const storageMethods: { [key: string]: MethodInfo } = {
  summary: {
    httpMethod: "GET",
    controllerFunction: getStorageSummaryController,
    authFunction: isAuth,
  },
  events: {
    httpMethod: "GET",
    controllerFunction: getStorageEventsController,
    authFunction: isAuth,
  },
};

const mappedMethods = init(storageMethods);

const handleMethod =
  (method: string) => (req: Request, res: Response, next: NextFunction) => {
    req.params.method = method;
    return mappedMethods(req, res, next);
  };

storageRoutes.get("/storage/summary", handleMethod("summary"));

storageRoutes.get("/storage/events", handleMethod("events"));

export default storageRoutes;
