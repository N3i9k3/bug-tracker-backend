import Ticket from "../models/Ticket.js";

// CREATE TICKET
export const createTicket = async (req, res) => {
  try {
    const ticket = await Ticket.create({
      ...req.body,
      createdBy: req.user.id,
    });

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


// GET TICKETS BY PROJECT
export const getTicketsByProject = async (req, res) => {
  try {
    const { status, priority, assignee, search } = req.query;

    let query = { projectId: req.params.projectId };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (assignee) query.assignee = assignee;
    if (search) {
      query.$or = [
        { title: { $regex: search, $options: "i" } },
        { description: { $regex: search, $options: "i" } },
      ];
    }

    const tickets = await Ticket.find(query).sort({ createdAt: -1 });
    res.json(tickets);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// UPDATE TICKET
export const updateTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket)
      return res.status(404).json({ message: "Ticket not found" });

    // ✅ ownership check
    if (ticket.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    Object.assign(ticket, req.body);

    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// DELETE TICKET
export const deleteTicket = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket)
      return res.status(404).json({ message: "Ticket not found" });

    if (ticket.createdBy.toString() !== req.user.id)
      return res.status(403).json({ message: "Not allowed" });

    await ticket.deleteOne();

    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



// ASSIGN TICKET
export const assignTicket = async (req, res) => {
  try {
    const { assignee } = req.body;
    const ticket = await Ticket.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found" });
    }

    ticket.assignee = assignee;
    await ticket.save();

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// UPDATE TICKET STATUS
export const updateTicketStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );

    res.json(ticket);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

