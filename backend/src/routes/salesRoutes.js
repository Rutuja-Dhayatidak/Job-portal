const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");
const salesController = require("../controllers/salesController");

// Role authorization middleware for Sales users
const isSales = (req, res, next) => {
  if (req.user && (req.user.role === "sales" || req.user.role === "Sales Panel")) {
    next();
  } else {
    return res.status(403).json({ success: false, message: "Access denied. Sales Panel authorization required." });
  }
};

// Apply security guards
router.use(verifyToken, isSales);

// 📊 Dashboard KPIs
router.get("/dashboard", salesController.getDashboardStats);

// 👥 Leads CRM Routes
router.get("/leads", salesController.getLeads);
router.post("/leads", salesController.createLead);
router.put("/leads/:id", salesController.updateLead);
router.delete("/leads/:id", salesController.deleteLead);

// 📆 Tasks Routes
router.get("/tasks", salesController.getTasks);
router.post("/tasks", salesController.createTask);
router.put("/tasks/:id", salesController.updateTask);

// 🗓️ Follow-Ups list
router.get("/followups", salesController.getFollowups);

// 👤 Profile settings
router.get("/profile", salesController.getProfile);
router.put("/profile", salesController.updateProfile);

module.exports = router;
