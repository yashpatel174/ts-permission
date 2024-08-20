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

const router = express.Router();

router.post("/create", createGroup);
router.get("/", getAllGroups);
router.delete("/delete/:groupName", removeGroup);
router.post("/add-users", addUsers);
router.post("/remove-users", removeUsers);
router.post("/:groupId", provideGroupPermission);
router.post("/:groupId/remove", removeGroupPermission);

export default router;
