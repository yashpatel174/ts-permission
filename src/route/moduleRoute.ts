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

interface customRequest {
  moduleName: string;
}

interface ModuleParams {
  moduleName?: string;
}

// Custom request interface extending Express's Request
interface CustomRequest extends Request<ModuleParams> {
  user?: {
    _id: string;
    role: string;
    group: string;
  };
}

router.post(
  "/create",
  authMiddleware,
  checkPermission(
    ["Create"],
    (req: CustomRequest) => (req.params.moduleName = "")
  ),
  createModule
);

router.get(
  "/",
  authMiddleware,
  checkPermission(
    ["FindAll"],
    (req: CustomRequest) => (req.params.moduleName = "")
  ),
  getAllModules
);

router.get(
  "/:moduleName",
  authMiddleware,
  checkPermission(
    ["FindOne"],
    (req: CustomRequest) => req.params.moduleName || ""
  ),
  getSingleModule
);

router.patch(
  "/update/:moduleName",
  authMiddleware,
  checkPermission(
    ["Update"],
    (req: CustomRequest) => req.params.moduleName || ""
  ),
  updateModule
);

router.delete(
  "/delete/:moduleName",
  authMiddleware,
  checkPermission(
    ["Delete"],
    (req: CustomRequest) => req.params.moduleName || ""
  ),
  deleteModule
);

export default router;
