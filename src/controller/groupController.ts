import groupSchema from "../model/groupSchema.js";
import userSchema from "../model/userSchema.js";
import permissionSchema from "../model/permissionSchema.js";
import moduleSchema from "../model/moduleSchema.js";
import groupPermission from "../model/groupPermission.js";
import { Request, Response } from "express";
import { ParamsDictionary } from "express-serve-static-core";

interface GroupType {
  groupName: string;
}

interface GroupParams extends ParamsDictionary {
  groupName: string;
}

interface GroupMember {
  groupName: string;
  userName: string;
}

interface GP1 extends ParamsDictionary {
  groupId: string;
}

interface GP2 {
  moduleId: string;
  permissions: string[];
}

interface User {
  _id: string;
  userName: string;
  group: string[];
  save(): Promise<User>;
}

interface Group {
  _id: string;
  groupName: string;
  members: string[];
  save(): Promise<Group>;
}

const createGroup = async (
  req: Request<{}, {}, GroupType>,
  res: Response
): Promise<Response> => {
  const { groupName } = req.body;

  if (!groupName) {
    return res.send({ message: "Please provide a group name." });
  }
  try {
    const existingGroup = await groupSchema.findOne({ groupName });
    if (existingGroup)
      return res.send({
        message: `${groupName} already exists, please create with another name.`,
      });

    const group = new groupSchema({ groupName });
    await group.save();
    if (!group) res.send({ message: "Group not created yet, try again." });

    return res.status(200).send({
      success: true,
      message: `Group created successfully by ${group.groupName}`,
      group,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while creating group.",
      error: (error as Error).message,
    });
  }
};

const getAllGroups = async (req: Request, res: Response): Promise<Response> => {
  try {
    const groups = await groupSchema.find({});
    if (!groups)
      return res.send({ message: "No groups are available. Create the one." });

    const groupList = groups?.map((group) => group.groupName);

    return res.status(200).send({
      message: `You have total ${groupList.length} groups.`,
      groups: groupList,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while fetching groups.",
      error: (error as Error).message,
    });
  }
};

const removeGroup = async (
  req: Request<GroupParams>,
  res: Response
): Promise<Response> => {
  const { groupName } = req.params;
  if (!groupName)
    return res.send({
      message: "Please enter the group name to delete the group.",
    });

  try {
    const group = await groupSchema.findOne({ groupName });
    if (!group)
      return res.send({ message: "Any group does not exist by this name." });

    if (group.members.length >= 1)
      return res.send({
        message: "This group can't be deleted as this group contains members.",
      });

    await groupSchema.findOneAndDelete({ groupName });

    return res.status(200).send({
      success: true,
      message: `You deleted the group: ${groupName}`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while removing group",
      error: (error as Error).message,
    });
  }
};

const addUsers = async (
  req: Request<{}, {}, GroupMember>,
  res: Response
): Promise<Response> => {
  const { groupName, userName } = req.body;

  // Validate input
  if (!groupName || !userName) {
    return res.status(400).send({ message: "Required fields are missing." });
  }

  try {
    // Find the group and user
    const group = (await groupSchema
      .findOne({ groupName })
      .exec()) as Group | null;
    const user = (await userSchema.findOne({ userName }).exec()) as User | null;

    // Check if group and user exist
    if (!group) {
      return res.status(404).send({ message: "Group not found." });
    }
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Add user to the group if not already present
    if (!group.members?.includes(user._id)) {
      group.members?.push(user._id);
      group.save(); // Save the updated group
    }

    // Add group to the user's group if not already present
    if (!user.group?.includes(group._id)) {
      user.group?.push(group._id);
      user.save(); // Save the updated user
    }

    return res.status(200).send({
      success: true,
      message: `${userName} added to ${groupName} successfully.`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while adding user to the group.",
      error: (error as Error).message,
    });
  }
};

const removeUsers = async (
  req: Request<{}, {}, GroupMember>,
  res: Response
): Promise<Response> => {
  const { groupName, userName } = req.body;

  // Validate input
  if (!groupName || !userName) {
    return res.status(400).send({ message: "Required fields are missing." });
  }

  try {
    // Find the group and user
    const group = (await groupSchema
      .findOne({ groupName })
      .exec()) as Group | null;
    const user = (await userSchema.findOne({ userName }).exec()) as User | null;

    // Check if group and user exist
    if (!group) {
      return res.status(404).send({ message: "Group not found." });
    }
    if (!user) {
      return res.status(404).send({ message: "User not found." });
    }

    // Remove user from the group if already present
    if (group.members?.includes(user._id)) {
      group.members = group.members.filter(
        (mem) => mem.toString() !== user._id.toString()
      );
    }

    // remove group from the user's group if already present
    if (user.group?.includes(group._id)) {
      user.group = user.group.filter(
        (grp) => grp.toString() !== group._id.toString()
      );
    }

    group.save();
    user.save();

    return res.status(200).send({
      success: false,
      message: `${userName} removed from ${groupName} successfully.`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error, while removing users from the group.",
      error: (error as Error).message,
    });
  }
};

const provideGroupPermission = async (
  req: Request<GP1, {}, GP2>,
  res: Response
): Promise<Response> => {
  const { groupId } = req.params;
  const { moduleId, permissions } = req.body;

  try {
    const group = await groupSchema.findById({ _id: groupId });
    if (!group) return res.send({ message: "Group does not exist." });

    const module = await moduleSchema.findById({ _id: moduleId });
    if (!module) return res.send({ message: "Module does not exist." });

    const existingPermission = await permissionSchema.findOne({
      moduleId: module._id,
      permissions: { $all: permissions },
    });
    if (existingPermission)
      return res.send({
        message: "This permission is already created for this moduleId.",
      });

    const newPermission = new permissionSchema({
      moduleId: module._id,
      permissions,
    });
    await newPermission.save();
    if (!newPermission)
      return res.send({ message: "Error while creating permission." });

    const gPermission = new groupPermission({
      groupId: group._id,
      permissions: newPermission._id,
    });
    await gPermission.save();
    if (!gPermission)
      return res.send({
        message: "Error while creating permission for the group.",
      });

    if (!group.permissions?.includes(gPermission.id)) {
      group.permissions?.push(gPermission.id);
      await group.save();
    }

    return res.status(200).send({
      success: true,
      message: `Provided permission to ${group.groupName}`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: " Error while providing permission to the group",
      error: (error as Error).message,
    });
  }
};

const removeGroupPermission = async (
  req: Request<GP1, GP2>,
  res: Response
): Promise<Response> => {
  const { groupId } = req.params;
  const { moduleId, permissions } = req.body;

  if (!groupId || !moduleId || !permissions?.length)
    return res
      .status(400)
      .send({ message: "All required fields must be provided." });

  try {
    // Checking the existence of the group
    const group = await groupSchema.findById(groupId);
    if (!group)
      return res.status(404).send({ message: "Group does not exist." });

    // Checking the existence of the module
    const module = await moduleSchema.findById(moduleId);
    if (!module)
      return res.status(404).send({ message: "Module does not exist." });

    // Checking the existence of the permission
    const existingPermission = await permissionSchema.findOne({
      moduleId: module._id,
      permissions: { $all: permissions },
    });
    if (!existingPermission)
      return res.status(404).send({
        message: "This permission is not provided for this moduleId.",
      });

    await permissionSchema.findOneAndDelete({
      moduleId: module._id,
      permissions,
    });

    // Deleting the permission from the group
    const gPermission = await groupPermission.findOneAndDelete({
      groupId: group._id,
      permissions: existingPermission._id,
    });
    if (!gPermission)
      return res.status(500).send({
        message: "Error in deleting group permission.",
      });

    // Removing the permission from the group's permissions array
    group.permissions = group.permissions.filter(
      (perm) => perm.toString() !== gPermission.id
    );

    await group.save();

    return res.status(200).send({
      success: true,
      message: `Permission removed from ${group.groupName} successfully.`,
    });
  } catch (error) {
    return res.status(500).send({
      success: false,
      message: "Error while removing permission from the group.",
    });
  }
};

export {
  createGroup,
  getAllGroups,
  removeGroup,
  addUsers,
  removeUsers,
  provideGroupPermission,
  removeGroupPermission,
};
