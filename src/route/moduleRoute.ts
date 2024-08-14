import express from "express";
import {
  createModule,
  getAllModules,
  getSingleModule,
  updateModule,
  deleteModule,
} from "../controller/moduleController";

const router = express.Router();

router.post("/create", createModule);
router.get("/", getAllModules);
router.get("/:moduleName", getSingleModule);
router.patch("/update/:moduleName", updateModule);
router.delete("/delete/:moduleName", deleteModule);

export default router;
