const Note = require("../models/Note");
const Task = require("../models/Task");
const { generateAIResponse } = require("../services/aiService");

const chatWithAssistant = async (req, res) => {
  try {
    const { message } = req.body;
    const userId = req.user.id;

    if (!message || !message.trim()) {
      return res.status(400).json({
        success: false,
        message: "Please enter a message",
      });
    }

    const text = message.trim();
    const lower = text.toLowerCase();

    if (
      /^(save|create|add)\s+(a\s+)?note\b/i.test(text)
    ) {
      const content = text.replace(
        /^(save|create|add)\s+(a\s+)?note\s*[:\-]?\s*/i,
        ""
      ).trim();

      if (!content) {
        return res.json({
          success: true,
          reply: "Please tell me what you want to save.",
        });
      }

      const note = await Note.create({
        user: userId,
        title: "Quick Note",
        content,
      });

      return res.json({
        success: true,
        reply: `Your note has been successfully saved. Content: ${note.content}`,
        note,
      });
    }

    if (
      lower.includes("show my saved notes") ||
      lower.includes("show all my notes") ||
      lower.includes("show my notes") ||
      lower.includes("list my notes")
    ) {
      const notes = await Note.find({
        user: userId,
      }).sort({ createdAt: -1 });

      if (!notes.length) {
        return res.json({
          success: true,
          reply: "You have no saved notes yet.",
        });
      }

      const noteList = notes
        .map((note, index) =>
          `${index + 1}. ${note.title}: ${note.content}`
        )
        .join("\n");

      return res.json({
        success: true,
        reply: `Here are your saved notes:\n${noteList}`,
        notes,
      });
    }

    if (
      /^(add|create|save)\s+(a\s+)?task\b/i.test(text)
    ) {
      const title = text.replace(
        /^(add|create|save)\s+(a\s+)?task\s*[:\-]?\s*/i,
        ""
      ).trim();

      if (!title) {
        return res.json({
          success: true,
          reply: "Please provide a task title.",
        });
      }

      const task = await Task.create({
        user: userId,
        title,
        description: "",
        dueDate: null,
      });

      return res.json({
        success: true,
        reply: `Your task "${task.title}" has been successfully added.`,
        task,
      });
    }

    if (
      lower.includes("show my pending tasks") ||
      lower.includes("show pending tasks") ||
      lower.includes("list my pending tasks")
    ) {
      const tasks = await Task.find({
        user: userId,
        completed: false,
      }).sort({ createdAt: -1 });

      if (!tasks.length) {
        return res.json({
          success: true,
          reply: "You have no pending tasks. Great job!",
        });
      }

      const taskList = tasks
        .map((task, index) =>
          `${index + 1}. ${task.title}`
        )
        .join("\n");

      return res.json({
        success: true,
        reply: `Here are your pending tasks:\n${taskList}`,
        tasks,
      });
    }

    if (
      lower.includes("show all my tasks") ||
      lower.includes("show my tasks")
    ) {
      const tasks = await Task.find({
        user: userId,
      }).sort({ createdAt: -1 });

      if (!tasks.length) {
        return res.json({
          success: true,
          reply: "You have not created any tasks yet.",
        });
      }

      const taskList = tasks
        .map((task, index) =>
          `${index + 1}. ${task.title} - ${
            task.completed ? "Completed" : "Pending"
          }`
        )
        .join("\n");

      return res.json({
        success: true,
        reply: `Here are your tasks:\n${taskList}`,
        tasks,
      });
    }

    if (
      /^(complete|finish|done with)\s+(my\s+)?task\b/i.test(text)
    ) {
      const taskTitle = text.replace(
        /^(complete|finish|done with)\s+(my\s+)?task\s*[:\-]?\s*/i,
        ""
      ).trim();

      if (!taskTitle) {
        return res.json({
          success: true,
          reply: "Please tell me which task you want to complete.",
        });
      }

      const task = await Task.findOne({
        user: userId,
        completed: false,
        title: { $regex: taskTitle, $options: "i" },
      });

      if (!task) {
        return res.json({
          success: true,
          reply: `I could not find a pending task matching "${taskTitle}".`,
        });
      }

      task.completed = true;
      await task.save();

      return res.json({
        success: true,
        reply: `Great! Your task "${task.title}" is now completed.`,
        task,
      });
    }
    const reply = await generateAIResponse(text);

    return res.status(200).json({
      success: true,
      reply,
    });

  } catch (error) {
    console.error("AI Assistant Error:", error);

    return res.status(500).json({
      success: false,
      message: "AI assistant could not respond. Please try again.",
    });
  }
};

module.exports = { chatWithAssistant };