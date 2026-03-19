import { type Request, type Response } from "express";
import * as AdminService from "../services/AdminServices";

export const getOverviewController = async (_req: Request, res: Response) => {
  const overview = await AdminService.getAdminOverview();
  return res.status(200).json(overview);
};

export const listUsersController = async (req: Request, res: Response) => {
  const search = String(req.query.q ?? "");
  const plan = String(req.query.plan ?? "all");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.listUsers(search, plan, page, pageSize);
  return res.status(200).json(result);
};

export const getUserController = async (req: Request, res: Response) => {
  const result = await AdminService.getUser(req.params.id);
  if (!result) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json(result);
};

export const banUserController = async (req: Request, res: Response) => {
  const result = await AdminService.banUser(req.params.id, req.body?.reason);
  return res.status(200).json(result);
};

export const unbanUserController = async (req: Request, res: Response) => {
  const result = await AdminService.unbanUser(req.params.id);
  return res.status(200).json(result);
};

export const setRoleController = async (req: Request, res: Response) => {
  const role = req.body?.role;
  if (!role || !["admin", "user"].includes(role)) {
    return res.status(400).json({ error: "Invalid role" });
  }
  const result = await AdminService.setRole(req.params.id, role);
  return res.status(200).json(result);
};

export const impersonateUserController = async (req: Request, res: Response) => {
  const result = await AdminService.impersonateUser(req.params.id, req);
  return res.status(200).json(result);
};

export const listGalleriesController = async (req: Request, res: Response) => {
  const search = String(req.query.q ?? "");
  const status = String(req.query.status ?? "all");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.listAllGalleries(search, status, page, pageSize);
  return res.status(200).json(result);
};

export const listClientsController = async (req: Request, res: Response) => {
  const search = String(req.query.q ?? "");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.listAllClients(search, page, pageSize);
  return res.status(200).json(result);
};

export const getStorageOverviewController = async (_req: Request, res: Response) => {
  const result = await AdminService.getStorageOverview();
  return res.status(200).json(result);
};

export const getUserStorageController = async (req: Request, res: Response) => {
  const result = await AdminService.getUserStorage(req.params.id);
  if (!result) {
    return res.status(404).json({ error: "User not found" });
  }
  return res.status(200).json(result);
};

export const getUserSubscriptionsController = async (req: Request, res: Response) => {
  const result = await AdminService.getUserSubscriptions(req.params.id);
  return res.status(200).json(result);
};

export const getServiceHealthController = async (_req: Request, res: Response) => {
  const result = await AdminService.getServiceHealth();
  return res.status(200).json(result);
};

export const getAnalyticsController = async (req: Request, res: Response) => {
  const period = String(req.query.period ?? "30d");
  const result = await AdminService.getAnalytics(period);
  return res.status(200).json(result);
};

export const getPaymentsOverviewController = async (req: Request, res: Response) => {
  const status = String(req.query.status ?? "all");
  const source = String(req.query.source ?? "all");
  const page = Math.max(1, Number(req.query.page) || 1);
  const pageSize = Math.min(100, Math.max(1, Number(req.query.pageSize) || 50));

  const result = await AdminService.getPaymentsOverview(status, source, page, pageSize);
  return res.status(200).json(result);
};
