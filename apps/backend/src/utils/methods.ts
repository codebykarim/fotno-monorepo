import { NextFunction, Request, Response } from "express";
import { ExpFunction, MethodInfo, MethodQuery } from "../interfaces";
import AppError from "../errors/AppError";
import joi from "joi";

export const init = (methods: { [key: string]: MethodInfo }) => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const { method } = req.params as MethodQuery;
    if (!methods[method]) {
      throw new AppError("INVALID_METHOD_KEY", 400);
    }

    const methodInfo = methods[method];

    if (req.method.toLowerCase() !== methodInfo.httpMethod.toLowerCase()) {
      throw new AppError("INVALID_HTTP_METHOD", 405);
    }

    const executeMethod = async () => {
      // Use a next that captures errors — the init() function controls the
      // flow itself. Passing Express's `next` would cause Express to advance
      // to the next handler while we also continue to run the controller.
      const guardNext = (err?: any) => {
        if (err) throw err;
      };

      if (methodInfo.authFunction) {
        await methodInfo.authFunction(req, res, guardNext as NextFunction);
      }

      if (methodInfo.middlewares) {
        for (const middleware of methodInfo.middlewares) {
          await middleware(req, res, guardNext as NextFunction);
        }
      }

      if (
        methodInfo.permissions &&
        methodInfo.permissions.length > 0 &&
        !methodInfo.authFunction
      ) {
        throw new AppError("ERR_AUTH_PERMISSION", 401);
      }

      // if (methodInfo.permissions && methodInfo.permissions.length > 0) {
      //   const identitynumber = req.user.identitynumber;
      //   if (!methodInfo.permissions.includes(identitynumber)) {
      //     throw new AppError("ERR_PERMISSION", 401);
      //   }
      // }

      if (methodInfo.bodyValidation) {
        const schema = joi.object(methodInfo.bodyValidation);
        const { error } = schema.validate(req.body);
        if (error) {
          throw new AppError("ERR_BODY_VALIDATION", 400);
        }
      }

      await methodInfo.controllerFunction(req, res);
    };

    executeMethod().catch(next);
  };
};
