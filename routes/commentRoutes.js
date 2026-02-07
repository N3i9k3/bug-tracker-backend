import express from "express";
import Comment from "../models/Comment.js";
import { authMiddleware } from "../middleware/authMiddleware.js";

const router = express.Router();


// ✅ Create comment
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { ticketId, text } = req.body;

    if (!text?.trim()) {
      return res.status(400).json({ message: "Comment cannot be empty" });
    }

    const comment = await Comment.create({
      ticketId,
      userId: req.user.id,
      text,
    });

    // populate author immediately (better UX)
    const populated = await comment.populate("userId", "name");

    res.json(populated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


// ✅ Get comments by ticket
router.get("/:ticketId", authMiddleware, async (req, res) => {
  try {
    const comments = await Comment.find({
      ticketId: req.params.ticketId,
    })
      .populate("userId", "name")
      .sort({ createdAt: 1 });

    res.json(comments);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
