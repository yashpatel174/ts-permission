import express from "express";
import { userRegister, userLogin, provideUserPermission, removeUserPermission, } from "../controller/userController.js";
const router = express.Router();
router.post("/register", userRegister);
router.post("/login", userLogin);
router.post("/", provideUserPermission);
router.post("/remove", removeUserPermission);
export default router;
