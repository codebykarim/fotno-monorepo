import { Request, Response } from "express";

const controllerReturn = async (data: any, req: Request, res: Response) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const isIndex = url.searchParams.get("entitys");

  let reqSignature: any = {
    path: req.path,
    body: req.body,
  };

  if (req.privateCache === true && req.user?.id) {
    reqSignature.user = req.user?.id;
  }

  return isIndex !== null ? data : res.status(200).json(data);
};

export default controllerReturn;
