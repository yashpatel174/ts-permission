import express, { Request } from "express";
import {
  createModule,
  getAllModules,
  getSingleModule,
  updateModule,
  deleteModule,
} from "../controller/moduleController.js";
import authMiddleware from "../middleware/auth.js";
import checkPermission from "../middleware/permission.js";
const router = express.Router();

interface modName {
  moduleName: string;
}

router.post(
  "/create",
  authMiddleware,
  checkPermission(
    ["Create"],
    (req: Request<modName>) => (req.params.moduleName = "")
  ),
  createModule
);

router.get(
  "/",
  authMiddleware,
  checkPermission(
    ["FindAll"],
    (req: Request<modName>) => (req.params.moduleName = "")
  ),
  getAllModules
);

router.get(
  "/:moduleName",
  authMiddleware,
  checkPermission(
    ["FindOne"],
    (req: Request<modName>) => req.params.moduleName
  ),
  getSingleModule
);

router.patch(
  "/update/:moduleName",
  authMiddleware,
  checkPermission(["Update"], (req: Request<modName>) => req.params.moduleName),
  updateModule
);

router.delete(
  "/delete/:moduleName",
  authMiddleware,
  checkPermission(["Delete"], (req: Request<modName>) => req.params.moduleName),
  deleteModule
);

export default router;
