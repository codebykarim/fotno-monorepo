import { Router } from "express";
import userRoutes from "./userRoutes";

const routes = Router();

routes.use("/api", userRoutes);

export default routes;
