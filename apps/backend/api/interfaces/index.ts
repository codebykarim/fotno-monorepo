import { NextFunction, Request, Router, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";
import { ParsedQs } from "qs";
import joi from "joi";

export type ControllerFunction = (
  req: Request<ParamsDictionary, any, any, ParsedQs, Record<string, any>>,
  res: Response<any, Record<string, any>>,
  body?: any
) => Promise<any>;

export type ExpFunction = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void>;

export interface MethodInfo {
  controllerFunction: ControllerFunction;
  authFunction?: ExpFunction | null; // Updated to accept null
  middlewares?: ExpFunction[];
  permissions?: string[];
  cache?: boolean;
  privateCache?: boolean;
  bodyValidation?: joi.SchemaMap;
  httpMethod: string;
}

export type MethodQuery = {
  method: string;
};

export interface TokenPayload {
  aud: string;
  exp: number;
  iat: number;
  iss: string;
  sub: string;
  email: string;
  phone: string;
  app_metadata: AppMetadata;
  user_metadata: UserMetadata;
  role: string;
  aal: string;
  amr?: AmrEntity[] | null;
  session_id: string;
}

export interface AmrEntity {
  method: string;
  timestamp: number;
}

export interface AppMetadata {
  provider: string;
  providers?: string[] | null;
}

export interface UserMetadata {
  identitynumber: string;
  id: string;
}
