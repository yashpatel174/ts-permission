import groupPermission from "../model/groupPermission.js";
import userSchema from "../model/userSchema.js";
import userPermission from "../model/userPermission.js";
import bcrypt from "bcrypt";
import JWT from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();
const userRegister = async (req, res) => {
    const { userName, password, role } = req.body;
    if (!userName || !password)
        return res.send({ message: "Enter the required fields." });
    try {
        const existingUser = await userSchema.findOne({ userName });
        if (existingUser)
            return res.send({
                message: "User already exist by this name, please use another name.",
            });
        const user = new userSchema({ userName, password, role });
        await user.save();
        if (!user)
            return res.send({ message: "user is not created, please try again." });
        return res.status(200).send({
            success: true,
            message: `you created ${user.userName}`,
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while creating user.",
            error: error.message,
        });
    }
};
const userLogin = async (req, res) => {
    const { userName, password } = req.params;
    if (!userName)
        return res.send({
            message: "Please provide the username you want to delete.",
        });
    try {
        const user = await userSchema.findOne({ userName });
        if (!user)
            return res.send({ message: "User not found." });
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.send({ messgae: "Invalid username or password." });
        }
        const token = JWT.sign({ _id: user._id }, process.env.SECRET_KEY, {
            expiresIn: process.env.JWT_EXPIRATION,
        });
        return res.status(200).send({
            success: true,
            message: `${user.userName} logged in successfully.`,
            token,
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while logging in .",
            error: error.message,
        });
    }
};
const provideUserPermission = async (req, res) => {
    const { userId, groupPermissionId } = req.body;
    if (!userId || !groupPermissionId)
        return res.send({ message: "Provide the requied fields." });
    try {
        const gPermission = await groupPermission.findById(groupPermissionId);
        if (!gPermission)
            return res.send({ message: "Group permission is not available." });
        const user = await userSchema.findById(userId);
        if (!user)
            return res.send({ message: "User not found." });
        console.log(user, "000000000000000");
        const userGroups = user.group?.map((group) => group.toString());
        const gId = gPermission.groupId.toString();
        if (!userGroups?.includes(gId)) {
            return res.send({
                message: "This user is not a member of this group.",
            });
        }
        if (user?.role === "admin")
            return res.send({
                message: "You are providing permissions to admin, please verify the user before providing permission.",
            });
        const uPermission = new userPermission({
            userId,
            groupPermissionId,
        });
        await uPermission.save();
        if (!user.permission?.includes(groupPermissionId)) {
            user.permission?.push(groupPermissionId);
        }
        await user.save();
        return res.status(200).send({
            success: true,
            message: `Permission provided to ${user.userName}`,
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while providing permissions to the user.",
            error: error.message,
        });
    }
};
const removeUserPermission = async (req, res) => {
    const { userId, groupPermissionId } = req.body;
    if (!userId || !groupPermissionId)
        return res.send({ message: "Kindly provide the required fields." });
    try {
        const gPermission = await groupPermission.findById(groupPermissionId);
        if (!gPermission)
            return res.send({ message: "Group permission does not exist." });
        const user = await userSchema.findById(userId);
        if (!user)
            return res.send({ message: "User not found." });
        const userGroups = user.group?.map((group) => group.toString);
        const gId = gPermission.groupId.toString();
        if (!userGroups?.includes(gId)) {
            return res.send({
                message: "This user is not a member of this group.",
            });
        }
        if (user?.role === "admin") {
            return res.send({
                message: "You are removing permissions from admin, please verify the user before removing permission.",
            });
        }
        const uPermission = await userPermission.findOneAndDelete({
            userId,
            groupPermissionId,
        });
        if (!uPermission)
            return res.send({ message: "user permission does not exist." });
        user.permission = user.permission.filter((perm) => perm.toString() !== groupPermissionId.toString());
        await user.save();
        return res.status(200).send({
            success: true,
            message: `Permission removed from ${user.userName} successfully.`,
        });
    }
    catch (error) {
        return res.status(500).send({
            success: false,
            message: "Error while removing permissions from users.",
            error: error.message,
        });
    }
};
export { userRegister, userLogin, provideUserPermission, removeUserPermission };
