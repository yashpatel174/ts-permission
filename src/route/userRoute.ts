import express from "express";
import {
  userRegister,
  userLogin,
  provideUserPermission,
  removeUserPermission,
} from "../controller/userController.js";
import authMiddleware from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";

const router = express.Router();

router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/permission", authMiddleware, isAdmin, provideUserPermission);
router.post(
  "/permission/remove",
  authMiddleware,
  isAdmin,
  removeUserPermission
);

export default router;
