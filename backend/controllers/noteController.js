const Note = require("../models/Note");
const createNote = async (req, res) => {
  try {
    const { title, content } = req.body;

    if (!title || !content) {
      return res.status(400).json({
        success: false,
        message: "Title and content are required",
      });
    }

    const note = await Note.create({
      user: req.user.id,
      title,
      content,
    });

    res.status(201).json({
      success: true,
      message: "Note created successfully",
      note,
    });
  } catch (error) {
    console.error("Create Note Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to create note",
    });
  }
};

const getNotes = async (req, res) => {
  try {
    const notes = await Note.find({
      user: req.user.id,
    }).sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      notes,
    });
  } catch (error) {
    console.error("Get Notes Error:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notes",
    });
  }
};

const updateNote = async (req, res) => {
  try {
    const { title, content } = req.body;
    const updates = {};

    if (title !== undefined) updates.title = title;
    if (content !== undefined) updates.content = content;

    const note = await Note.findOneAndUpdate(
      {
        _id: req.params.id,
        user: req.user.id,
      },
      { $set: updates },
      { new: true, runValidators: true }
    );

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note updated successfully",
      note,
    });
  } catch (error) {
    console.error("Update Note Error:", error.message);
    res.status(400).json({
      success: false,
      message: "Failed to update note",
    });
  }
};

const deleteNote = async (req, res) => {
  try {
    const note = await Note.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id,
    });

    if (!note) {
      return res.status(404).json({
        success: false,
        message: "Note not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Note deleted successfully",
    });
  } catch (error) {
    console.error("Delete Note Error:", error.message);
    res.status(400).json({
      success: false,
      message: "Failed to delete note",
    });
  }
};

module.exports = {
  createNote,
  getNotes,
  updateNote,
  deleteNote,
};