import { Router } from "express";
import {
  getStorageEventsController,
  getStorageSummaryController,
} from "../controllers/StorageController";

const storageRoutes = Router();

storageRoutes.get(
  "/storage/summary",
  getStorageSummaryController,
);

storageRoutes.get(
  "/storage/events",
  getStorageEventsController,
);

export default storageRoutes;
