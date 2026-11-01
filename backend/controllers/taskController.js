const Task = require("../models/Task");
const createTask = async (req, res) => {
  try {
    const { title, description, dueDate } = req.body;

    if (!title || !title.trim()) {
      return res.status(400).json({
        message: "Task title is required"
      });
    }

    const task = await Task.create({
      user: req.user.id,
      title: title.trim(),
      description: description || "",
      dueDate: dueDate || null
    });

    res.status(201).json({
      message: "Task created successfully",
      task
    });
  } catch (error) {
    res.status(500).json({
      message: "Failed to create task"
    });
  }
};

const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find({
      user: req.user.id
    }).sort({ createdAt: -1 });

    res.json({ tasks });
  } catch (error) {
    res.status(500).json({
      message: "Failed to fetch tasks"
    });
  }
};

const updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, completed } = req.body;

    const updates = {};

    if (title !== undefined) {
      if (typeof title !== "string" || !title.trim()) {
        return res.status(400).json({
          message: "Valid task title is required"
        });
      }

      updates.title = title.trim();
    }

    if (description !== undefined) {
      updates.description = description;
    }

    if (dueDate !== undefined) {
      updates.dueDate = dueDate || null;
    }

    if (completed !== undefined) {
      updates.completed = completed;
    }

    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user.id },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task updated successfully",
      task
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to update task"
    });
  }
};

const deleteTask = async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!task) {
      return res.status(404).json({
        message: "Task not found"
      });
    }

    res.json({
      message: "Task deleted successfully"
    });
  } catch (error) {
    res.status(400).json({
      message: "Failed to delete task"
    });
  }
};

module.exports = {
  createTask,
  getTasks,
  updateTask,
  deleteTask
};