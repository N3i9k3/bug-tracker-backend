import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  assignTicket,
  updateTicketStatus
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/project/:projectId", authMiddleware, getTicketsByProject);
router.put("/:id", authMiddleware, updateTicket);
router.put("/:id/assign", authMiddleware, assignTicket);
router.put("/:id/status", authMiddleware, updateTicketStatus); // ✅ ADD THIS
router.delete("/:id", authMiddleware, deleteTicket);

export default router;
