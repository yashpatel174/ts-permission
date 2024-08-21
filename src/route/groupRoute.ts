import express from "express";
import {
  createGroup,
  getAllGroups,
  removeGroup,
  addUsers,
  removeUsers,
  provideGroupPermission,
  removeGroupPermission,
} from "../controller/groupController.js";
import authMiddleware from "../middleware/auth.js";
import isAdmin from "../middleware/admin.js";

const router = express.Router();

router.post("/create", authMiddleware, isAdmin, createGroup);
router.get("/", authMiddleware, isAdmin, getAllGroups);
router.delete("/delete/:groupName", authMiddleware, isAdmin, removeGroup);
router.post("/add-users", authMiddleware, isAdmin, addUsers);
router.post("/remove-users", authMiddleware, isAdmin, removeUsers);
router.post("/:groupId", authMiddleware, isAdmin, provideGroupPermission);
router.post("/:groupId/remove", authMiddleware, isAdmin, removeGroupPermission);

export default router;
