const express = require('express');
const router = express.Router();
const Plan = require('../models/Plan');

// GET /api/plans - Fetch only active plans
router.get('/', async (req, res) => {
  try {
    // Ensure default plans are seeded if DB is empty
    const count = await Plan.countDocuments();
    if (count === 0) {
      const defaultPlans = [
        {
          plan_name: "Free Trial",
          plan_type: "free",
          price: 0,
          billing_cycle: "one_time",
          limits: { job_posts: 2, team_members: 1, applications: 10 },
          features: { analytics: false, featured_jobs: false, priority_support: false, custom_branding: false, api_access: false, dedicated_manager: false },
          support_type: "basic",
          is_active: true,
          is_popular: false
        },
        {
          plan_name: "Basic",
          plan_type: "basic",
          price: 999,
          billing_cycle: "monthly",
          limits: { job_posts: 5, team_members: 3, applications: -1 },
          features: { analytics: false, featured_jobs: false, priority_support: false, custom_branding: false, api_access: false, dedicated_manager: false },
          support_type: "email",
          is_active: true,
          is_popular: false
        },
        {
          plan_name: "Pro",
          plan_type: "pro",
          price: 2999,
          billing_cycle: "monthly",
          limits: { job_posts: 25, team_members: 10, applications: -1 },
          features: { analytics: true, featured_jobs: true, priority_support: true, custom_branding: false, api_access: false, dedicated_manager: false },
          support_type: "priority",
          is_active: true,
          is_popular: true
        },
        {
          plan_name: "Enterprise",
          plan_type: "enterprise",
          price: 9999,
          billing_cycle: "monthly",
          limits: { job_posts: -1, team_members: -1, applications: -1 },
          features: { analytics: true, featured_jobs: true, priority_support: true, custom_branding: true, api_access: true, dedicated_manager: true },
          support_type: "dedicated",
          is_active: true,
          is_popular: false
        }
      ];
      await Plan.create(defaultPlans);
    }

    const plans = await Plan.find({ is_active: true }).sort({ price: 1 }).lean();
    res.json({ success: true, plans });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
});

module.exports = router;
