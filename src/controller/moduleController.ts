import moduleSchema from "../model/moduleSchema.js";
import { Request, Response } from "express";

interface ModuleTypes {
  moduleName: string;
  moduleNumber: number;
}

interface UpdateModule {
  newName: string;
  newNumber: number;
}

interface DelModule {
  moduleName: string;
}

const createModule = async (
  req: Request<ModuleTypes>,
  res: Response
): Promise<Response> => {
  const { moduleName, moduleNumber } = req.body;
  if (!moduleName || !moduleNumber)
    return res.send({ message: "Enter the required fields." });

  try {
    const existingModule = await moduleSchema.findOne({ moduleName });
    if (existingModule)
      return res.send({ message: `${moduleName} already exist.` });

    const module = new moduleSchema({ moduleName, moduleNumber });
    await module.save();

    if (!module) return res.send({ message: "Module not created." });

    return res.status(200).send({
      success: true,
      message: `You created modle: ${module.moduleName}.`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error creating module.",
      error: (error as Error).message,
    });
  }
};

const getAllModules = async (
  req: Request,
  res: Response
): Promise<Response> => {
  try {
    const modules = await moduleSchema.find({});
    if (!modules) return res.send({ message: "There are no modules." });
    return res.status(200).send(modules);
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching modules.",
      error: (error as Error).message,
    });
  }
};

const getSingleModule = async (
  req: Request<ModuleTypes>,
  res: Response
): Promise<Response> => {
  const { moduleName } = req.params;
  if (!moduleName)
    return res.send({
      message: "I didn't get any module name you are looking for.",
    });

  try {
    const module = await moduleSchema.findOne({ moduleName });
    if (!module) res.send({ message: "Module not found." });
    return res.status(200).send({
      success: true,
      message: `You got the module: ${moduleName}.`,
      module,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error fetching the module.",
      error: (error as Error).message,
    });
  }
};

const updateModule = async (
  req: Request<ModuleTypes, UpdateModule>,
  res: Response
): Promise<Response> => {
  const { moduleName } = req.params;
  const { newName, newNumber } = req.body;
  if (!moduleName || !newName || !newNumber)
    return res.send({ message: "Fill the required fields." });

  try {
    const existingModule = await moduleSchema.findOne({ moduleName });
    if (!existingModule)
      return res.send({
        message: "Please check the module as this module is not exist.",
      });

    const newModule = await moduleSchema.findOneAndUpdate(
      { moduleName },
      { moduleName: newName, moduleNumber: newNumber },
      { new: true, runValidators: true }
    );

    if (!newModule) return res.send({ message: "Module not updated yet." });

    return res.status(200).send({
      success: true,
      message: `Module updated successfully.`,
      newModule,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error updating the module.",
      error: (error as Error).message,
    });
  }
};

const deleteModule = async (
  req: Request<DelModule>,
  res: Response
): Promise<Response> => {
  const { moduleName } = req.params;
  if (!moduleName)
    return res.send({
      message: "Kindly provide the module name, which you want to delete",
    });

  try {
    const existingModule = await moduleSchema.findOne({ moduleName });
    if (!existingModule)
      return res.send({ message: "This module is not available." });

    const deleteM = await moduleSchema.findOneAndDelete({ moduleName });

    if (!deleteM) res.status(404).send({ message: "Module not deleted" });

    return res.status(200).send({
      success: true,
      message: `Module deleted successfully.`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error deleting the module.",
      error: (error as Error).message,
    });
  }
};

export {
  createModule,
  getAllModules,
  getSingleModule,
  updateModule,
  deleteModule,
};
