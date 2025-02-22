// import { Request, Response, NextFunction } from "express";
// import ShowUserService from "../services/UserServices/ShowUserService";
// import AppError from "../errors/AppError";

// const isAllowed = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
//   const role = req.user.role;

//   if (role === "ADMIN" || role === "OPERATOR") return;

//   const user = await ShowUserService(parseInt(req.user.id));

//   if (user.deleted === true || user.blocked === true) {
//     throw new AppError("ERR_USER_IS_NOT_ALLOWED");
//   }
// };

// export default isAllowed;
