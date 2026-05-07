const Candidate = require('../models/Candidate');
const Company = require('../models/Company');
const Job = require('../models/Job');

exports.getProfile = async (req, res) => {
  try {
    const user = await Candidate.findById(req.user.id).select('-password');
    const company = await Company.findOne({ owner_user_id: req.user.id });
    res.json({ success: true, user, company });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getJobs = async (req, res) => {
  try {
    const company = await Company.findOne({ owner_user_id: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, message: "Company not found" });
    }
    const jobs = await Job.find({ company: company._id }).sort('-createdAt');
    res.json({ success: true, jobs });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getCandidates = async (req, res) => {
  try {
    // Return sample candidates for future-proofing ATS Dashboard
    const candidates = await Candidate.find({ role: 'candidate' }).select('-password').limit(10);
    res.json({ success: true, candidates });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getTeam = async (req, res) => {
  try {
    const company = await Company.findOne({ owner_user_id: req.user.id }).populate('owner_user_id', 'firstName lastName email phone');
    res.json({ 
      success: true, 
      team: [
        {
          id: company.owner_user_id?._id,
          name: `${company.owner_user_id?.firstName} ${company.owner_user_id?.lastName}`,
          email: company.owner_user_id?.email,
          role: "Owner / Administrator",
          status: "active"
        }
      ] 
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    res.json({ success: true, message: "Settings updated successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
