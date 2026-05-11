const Lead = require("../models/Lead");
const SalesTask = require("../models/SalesTask");
const Candidate = require("../models/Candidate");

// 📊 Dashboard Analytics Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const salesRepId = req.user.id;

    // Run aggregations and queries in parallel for top speed
    const [
      totalLeads,
      newLeads,
      wonLeads,
      pendingTasks,
      todayFollowUps,
      leadsList,
      tasksList
    ] = await Promise.all([
      Lead.countDocuments({ salesRep: salesRepId }),
      Lead.countDocuments({ salesRep: salesRepId, status: "new" }),
      Lead.find({ salesRep: salesRepId, status: "won" }),
      SalesTask.countDocuments({ salesRep: salesRepId, status: "pending" }),
      Lead.countDocuments({
        salesRep: salesRepId,
        followUpDate: {
          $gte: new Date().setHours(0, 0, 0, 0),
          $lte: new Date().setHours(23, 59, 59, 999)
        }
      }),
      Lead.find({ salesRep: salesRepId }).sort("-createdAt").limit(5),
      SalesTask.find({ salesRep: salesRepId }).sort("dueDate").limit(5)
    ]);

    // Calculate sales revenue parameters
    const totalSalesVolume = wonLeads.reduce((sum, lead) => sum + (lead.value || 0), 0);
    const targetQuota = 500000; // Target Sales of ₹500,000
    const targetProgress = Math.min(Math.round((totalSalesVolume / targetQuota) * 100), 100);

    // Mock CRM chart data for beautiful visual analytics
    const chartData = [
      { month: "Jan", revenue: Math.round(totalSalesVolume * 0.1) || 12000, leads: Math.round(totalLeads * 0.2) || 4 },
      { month: "Feb", revenue: Math.round(totalSalesVolume * 0.2) || 18000, leads: Math.round(totalLeads * 0.4) || 8 },
      { month: "Mar", revenue: Math.round(totalSalesVolume * 0.3) || 24000, leads: Math.round(totalLeads * 0.6) || 12 },
      { month: "Apr", revenue: Math.round(totalSalesVolume * 0.5) || 35000, leads: Math.round(totalLeads * 0.8) || 18 },
      { month: "May", revenue: totalSalesVolume || 45000, leads: totalLeads || 25 }
    ];

    res.json({
      success: true,
      stats: {
        totalLeads,
        newLeads,
        wonLeadsCount: wonLeads.length,
        pendingTasks,
        todayFollowUps,
        totalSalesVolume,
        targetProgress,
        targetQuota
      },
      chartData,
      recentLeads: leadsList,
      recentTasks: tasksList
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 👥 Leads CRM CRUD
exports.getLeads = async (req, res) => {
  try {
    const leads = await Lead.find({ salesRep: req.user.id }).sort("-createdAt");
    res.json({ success: true, leads });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, value, source, followUpDate, notes } = req.body;
    
    const newLead = await Lead.create({
      name,
      email,
      phone,
      company,
      status: status || "new",
      value: value || 0,
      source: source || "Direct Outreach",
      salesRep: req.user.id,
      followUpDate,
      notes
    });

    res.status(201).json({ success: true, message: "Lead registered successfully", lead: newLead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateLead = async (req, res) => {
  try {
    const { name, email, phone, company, status, value, source, followUpDate, notes } = req.body;
    
    const lead = await Lead.findOneAndUpdate(
      { _id: req.params.id, salesRep: req.user.id },
      { name, email, phone, company, status, value, source, followUpDate, notes },
      { new: true }
    );

    if (!lead) return res.status(404).json({ success: false, message: "Lead profile not found" });

    res.json({ success: true, message: "Lead updated successfully", lead });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.deleteLead = async (req, res) => {
  try {
    const lead = await Lead.findOneAndDelete({ _id: req.params.id, salesRep: req.user.id });
    if (!lead) return res.status(404).json({ success: false, message: "Lead profile not found" });

    res.json({ success: true, message: "Lead deleted successfully" });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 📆 Tasks CRUD
exports.getTasks = async (req, res) => {
  try {
    const tasks = await SalesTask.find({ salesRep: req.user.id }).sort("dueDate");
    res.json({ success: true, tasks });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.createTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority } = req.body;
    
    const newTask = await SalesTask.create({
      title,
      description,
      dueDate,
      priority: priority || "medium",
      salesRep: req.user.id,
      status: "pending"
    });

    res.status(201).json({ success: true, message: "Task added successfully", task: newTask });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateTask = async (req, res) => {
  try {
    const { title, description, dueDate, priority, status } = req.body;
    
    const task = await SalesTask.findOneAndUpdate(
      { _id: req.params.id, salesRep: req.user.id },
      { title, description, dueDate, priority, status },
      { new: true }
    );

    if (!task) return res.status(404).json({ success: false, message: "Task not found" });

    res.json({ success: true, message: "Task updated successfully", task });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 🗓️ Follow-Ups Controller
exports.getFollowups = async (req, res) => {
  try {
    const followups = await Lead.find({
      salesRep: req.user.id,
      followUpDate: { $ne: null }
    }).sort("followUpDate");
    
    res.json({ success: true, followups });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

// 👤 Profile Controller
exports.getProfile = async (req, res) => {
  try {
    const profile = await Candidate.findById(req.user.id).select("-password");
    res.json({ success: true, profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { firstName, lastName, phone } = req.body;
    const profile = await Candidate.findByIdAndUpdate(
      req.user.id,
      { firstName, lastName, phone },
      { new: true }
    ).select("-password");

    res.json({ success: true, message: "Profile updated successfully", profile });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};
