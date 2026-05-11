const express = require('express');
const router = express.Router();
const Razorpay = require('razorpay');
const crypto = require('crypto');
const verifyToken = require('../middleware/verifyToken');
const employerOnly = require('../middleware/employerOnly');
const Plan = require('../models/Plan');
const Company = require('../models/Company');
const Payment = require('../models/Payment');

// Require login and employer role for payment
router.use(verifyToken, employerOnly);

// 1. Create Razorpay Order
router.post('/create-order', async (req, res) => {
  try {
    const { planId } = req.body;
    if (!planId) {
      return res.status(400).json({ success: false, message: 'Plan ID is required' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const subtotal = plan.price;
    const gst = Math.round((subtotal * 0.18) * 100) / 100;
    const totalAmount = subtotal + gst;

    const razorpay = new Razorpay({
      key_id: process.env.RAZORPAY_KEY_ID,
      key_secret: process.env.RAZORPAY_KEY_SECRET
    });

    const options = {
      amount: Math.round(totalAmount * 100), // amount in paisa
      currency: 'INR',
      receipt: `rcpt_${Date.now()}`
    };

    const order = await razorpay.orders.create(options);

    res.json({
      success: true,
      order,
      key_id: process.env.RAZORPAY_KEY_ID,
      subtotal,
      gst,
      totalAmount,
      planName: plan.plan_name,
      planType: plan.plan_type
    });
  } catch (error) {
    console.error("Payment Order Creation Error Details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

// 2. Verify Razorpay Payment Signature and Subscribe Company
router.post('/verify-payment', async (req, res) => {
  try {
    const { razorpay_order_id, razorpay_payment_id, razorpay_signature, planId } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature || !planId) {
      return res.status(400).json({ success: false, message: 'Missing required payment verification details' });
    }

    // Verify razorpay signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET);
    hmac.update(razorpay_order_id + '|' + razorpay_payment_id);
    const generatedSignature = hmac.digest('hex');

    if (generatedSignature !== razorpay_signature) {
      return res.status(400).json({ success: false, message: 'Invalid payment signature. Potential fraud detected.' });
    }

    const plan = await Plan.findById(planId);
    if (!plan) {
      return res.status(404).json({ success: false, message: 'Plan not found' });
    }

    const company = await Company.findOne({ owner_user_id: req.user.id });
    if (!company) {
      return res.status(404).json({ success: false, message: 'Company not found' });
    }

    // Determine validity days based on plan name/type
    let validityDays = 30; // standard month
    if (plan.plan_name.toLowerCase().includes('year') || plan.billing_cycle === 'yearly') {
      validityDays = 365;
    } else if (plan.plan_name.toLowerCase().includes('trial') || plan.plan_type === 'free') {
      validityDays = 14;
    } else if (plan.plan_type === 'enterprise') {
      validityDays = 365;
    }

    // Update company subscription
    company.plan_id = plan._id;
    company.plan_type = plan.plan_type;
    company.plan_started_at = new Date();
    company.plan_expires_at = new Date(Date.now() + validityDays * 24 * 60 * 60 * 1000);
    company.plan_status = 'active';
    await company.save();

    // Create a transaction record
    const subtotal = plan.price;
    const gst = Math.round((subtotal * 0.18) * 100) / 100;
    const totalAmount = subtotal + gst;

    const payment = new Payment({
      employerId: req.user.id,
      plan: plan._id,
      amount: totalAmount,
      status: 'completed',
      paymentMethod: 'razorpay',
      transactionId: razorpay_payment_id
    });
    await payment.save();

    // Retrieve updated company populated
    const updatedCompany = await Company.findById(company._id).populate('plan_id');

    res.json({
      success: true,
      message: `Successfully verified and subscribed to ${plan.plan_name}!`,
      company: updatedCompany,
      payment
    });
  } catch (error) {
    console.error("Payment Signature Verification Error Details:", error);
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;
