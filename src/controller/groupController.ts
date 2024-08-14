import groupSchema from "../model/groupSchema.ts";

interface GroupType {
  groupName: string;
  permission: [string];
}

const createGroup = async (req, res): Promise<void> => {
  const { groupName, permission }: GroupType = req.body;

  if (!groupName) {
    return res.send({ message: "Please provide a group name." });
  }
  try {
    const existingGroup = await groupSchema.findOne({ groupName });
    if (existingGroup)
      return res.send({
        message: `${groupName} already exists, please create with other name.`,
      });

    const group = new groupSchema({ groupName, permission });
    if (!group) res.send({ message: "Group not created yet, try again." });

    res.status(200).send({
      success: true,
      message: `Group created successfully by ${group.groupName}`,
      group,
    });
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while creating group.",
      error: error.message,
    });
  }
};

const getAllGroups = async (req, res): Promise<void> => {
  try {
    const groups = await groupSchema.find({});
    if (!groups)
      return res.send({ message: "No groups are available. Create the one." });

    const groupList = groups?.map((group) => group.groupName);

    res.status(200).send(groups);
  } catch (error) {
    res.status(500).send({
      success: false,
      message: "Error while fetching groups.",
      error: error.message,
    });
  }
};

export default { createGroup };
