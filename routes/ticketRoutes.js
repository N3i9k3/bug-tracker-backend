import express from "express";
import { authMiddleware } from "../middleware/authMiddleware.js";
import {
  createTicket,
  getTicketsByProject,
  updateTicket,
  deleteTicket,
  assignTicket,
} from "../controllers/ticketController.js";

const router = express.Router();

router.post("/", authMiddleware, createTicket);
router.get("/project/:projectId", authMiddleware, getTicketsByProject);
router.put("/:id", authMiddleware, updateTicket);
router.put("/:id/assign", authMiddleware, assignTicket);
router.delete("/:id", authMiddleware, deleteTicket);

export default router;
