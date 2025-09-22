import { Router } from "express";
import { MethodInfo } from "../interfaces";
import * as UserController from "../controllers/UserController";
import { init } from "../utils/methods";
import isAuth from "../middleware/isAuth";

const userRoutes = Router();

const userMethods: { [key: string]: MethodInfo } = {};

const mapedMethods = init(userMethods);

// Map the route with method query
userRoutes.route("/auth/:method").all(mapedMethods);

// Email check route
userRoutes.post("/check-email", UserController.checkEmailExists);

export default userRoutes;
