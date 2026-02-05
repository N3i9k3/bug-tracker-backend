import Project from "../models/Project.js";
import User from "../models/User.js";

// CREATE PROJECT
export const createProject = async (req, res) => {
  try {
    const { title, description } = req.body;

    const project = await Project.create({
      title,
      description,
      teamMembers: [req.user.id], // store creator ID
      createdBy: req.user.id,
    });

    // Populate members for frontend
    await project.populate("teamMembers", "name email");

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// LIST PROJECTS
export const getProjects = async (req, res) => {
  try {
    const projects = await Project.find({ createdBy: req.user.id })
      .populate("teamMembers", "name email"); // populate user details
    res.json(projects);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE PROJECT
export const updateProject = async (req, res) => {
  try {
    const updated = await Project.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate("teamMembers", "name email");
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// DELETE PROJECT
export const deleteProject = async (req, res) => {
  try {
    await Project.findByIdAndDelete(req.params.id);
    res.json({ message: "Project deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ADD MEMBER
export const addMember = async (req, res) => {
  try {
    const { userId } = req.body; // send userId, not email

    const project = await Project.findById(req.params.id);

    if (!project.teamMembers.includes(userId)) {
      project.teamMembers.push(userId);
    }

    await project.save();
    await project.populate("teamMembers", "name email");

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// REMOVE MEMBER
export const removeMember = async (req, res) => {
  try {
    const { userId } = req.body; // send userId, not email

    const project = await Project.findById(req.params.id);

    project.teamMembers = project.teamMembers.filter(
      (member) => member.toString() !== userId
    );

    await project.save();
    await project.populate("teamMembers", "name email");

    res.json(project);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
