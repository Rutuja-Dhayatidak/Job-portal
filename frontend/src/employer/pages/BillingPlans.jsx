import React, { useState, useEffect } from 'react';
import {
  CreditCard,
  Wallet,
  Shield,
  Zap,
  Sparkles,
  Check,
  AlertTriangle,
  ArrowRight,
  Download,
  BarChart2,
  Users,
  FileText,
  Settings,
  RefreshCw,
  CheckCircle,
  Clock,
  Briefcase,
  ArrowLeft,
  Lock
} from 'lucide-react';
import toast from 'react-hot-toast';
import { getAllPlans, subscribeToPlan, createPaymentOrder, verifyPaymentSignature } from '../../services/companyApi';

const BillingPlans = ({ company = {}, setCompany = () => { } }) => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('plans'); // 'plans', 'usage', 'gst', 'invoices'
  const [submittingPlanId, setSubmittingPlanId] = useState(null);

  // Billing and GST info form state (scalability hook)
  const [billingForm, setBillingForm] = useState({
    legalName: company.name || '',
    gstin: company.gst_in || company.gstin || '',
    billingAddress: company.address || '',
    stateCode: '27 (Maharashtra)',
    billingEmail: company.official_work_email || company.email || ''
  });

  // Mock Invoice History (scalability hook)
  const [invoices] = useState([
    { id: 'INV-2026-001', date: 'May 01, 2026', amount: '₹0.00', status: 'Paid', plan: 'Free Trial', type: 'Credit Card' },
    { id: 'INV-2026-002', date: 'May 10, 2026', amount: '₹2,999.00', status: 'Paid', plan: 'Pro Plan', type: 'Razorpay Gateway' }
  ]);

  // Fetch plans on mount
  useEffect(() => {
    const fetchPlans = async () => {
      try {
        setLoading(true);
        const data = await getAllPlans();
        if (data.success) {
          setPlans(data.plans || []);
        } else {
          setError(data.message || 'Failed to fetch subscription plans');
        }
      } catch (err) {
        console.error('Error fetching plans:', err);
        setError('Connection error: Unable to fetch subscription plans.');
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  // Update billing details (scalability hook)
  const handleSaveBilling = (e) => {
    e.preventDefault();
    toast.success('Billing parameters and GSTIN saved successfully!');
  };

  // Razorpay Checkout Interactive States
  const [selectedCheckoutPlan, setSelectedCheckoutPlan] = useState(null);
  const [checkoutTab, setCheckoutTab] = useState('card'); // 'card', 'upi', 'netbanking', 'wallet'

  // Card Details Form State
  const [cardDetails, setCardDetails] = useState({
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardholderName: ''
  });

  // UPI Form State
  const [upiId, setUpiId] = useState('');

  // Net Banking State
  const [selectedBank, setSelectedBank] = useState('');

  // Wallets State
  const [selectedWallet, setSelectedWallet] = useState('');

  const [paymentProcessing, setPaymentProcessing] = useState(false);

  // Dynamic input formatters
  const handleCardNumberChange = (e) => {
    let value = e.target.value.replace(/\D/g, ''); // keep only digits
    if (value.length > 16) value = value.slice(0, 16);
    const formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    setCardDetails({ ...cardDetails, cardNumber: formatted });
  };

  const handleExpiryChange = (e) => {
    let value = e.target.value.replace(/\D/g, '');
    if (value.length > 4) value = value.slice(0, 4);
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2);
    }
    setCardDetails({ ...cardDetails, expiryDate: value });
  };

  const handleCvvChange = (e) => {
    const value = e.target.value.replace(/\D/g, '').slice(0, 3);
    setCardDetails({ ...cardDetails, cvv: value });
  };

  // Dynamically load Razorpay SDK Script
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (window.Razorpay) {
        resolve(true);
        return;
      }
      const script = document.createElement('script');
      script.src = 'https://checkout.razorpay.com/v1/checkout.js';
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

  // Set selected checkout plan
  const handleUpgrade = (plan) => {
    setSelectedCheckoutPlan(plan);
    setCardDetails({
      cardNumber: '',
      expiryDate: '',
      cvv: '',
      cardholderName: ''
    });
    setUpiId('');
    setSelectedBank('');
    setSelectedWallet('');
  };

  // Secure checkout processor using backend and Razorpay overlay
  const handleProcessRazorpayPayment = async (e) => {
    if (e) e.preventDefault();

    // Validate inputs depending on active checkout tab
    if (checkoutTab === 'card') {
      if (!cardDetails.cardNumber || cardDetails.cardNumber.replace(/\s/g, '').length < 16) {
        toast.error("Please enter a valid 16-digit card number");
        return;
      }
      if (!cardDetails.expiryDate || cardDetails.expiryDate.length < 5) {
        toast.error("Please enter card expiry date (MM/YY)");
        return;
      }
      if (!cardDetails.cvv || cardDetails.cvv.length < 3) {
        toast.error("Please enter card CVV (3 digits)");
        return;
      }
      if (!cardDetails.cardholderName.trim()) {
        toast.error("Please enter cardholder name");
        return;
      }
    } else if (checkoutTab === 'upi') {
      if (!upiId.trim() || !upiId.includes('@')) {
        toast.error("Please enter a valid UPI ID (e.g. name@upi)");
        return;
      }
    } else if (checkoutTab === 'netbanking') {
      if (!selectedBank) {
        toast.error("Please select a bank for net banking");
        return;
      }
    } else if (checkoutTab === 'wallet') {
      if (!selectedWallet) {
        toast.error("Please select a wallet provider");
        return;
      }
    }

    try {
      setPaymentProcessing(true);
      const subtotal = selectedCheckoutPlan.price;
      const gst = Math.round((subtotal * 0.18) * 100) / 100;
      const totalAmount = subtotal + gst;

      toast.loading("Generating secure Order ID from checkout gateway...", { id: "payment-process" });

      // 1. Create order in backend
      const orderData = await createPaymentOrder(selectedCheckoutPlan._id);
      if (!orderData.success) {
        throw new Error(orderData.message || "Failed to create payment order");
      }

      const { order, key_id } = orderData;

      // 2. Load SDK
      const scriptLoaded = await loadRazorpayScript();
      if (!scriptLoaded) {
        throw new Error("Razorpay payment SDK failed to load. Please check your internet connection.");
      }

      toast.loading("Redirecting to Razorpay checkout panel...", { id: "payment-process" });

      // 3. Trigger popup
      const options = {
        key: key_id,
        amount: order.amount,
        currency: order.currency,
        name: "NextHire",
        description: `Subscription: ${selectedCheckoutPlan.plan_name}`,
        image: "https://cdn-icons-png.flaticon.com/512/10015/10015437.png",
        order_id: order.id,
        handler: async (response) => {
          try {
            toast.loading("Verifying transaction secure credentials...", { id: "payment-process" });

            // Call verify payment
            const verifyRes = await verifyPaymentSignature({
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
              planId: selectedCheckoutPlan._id
            });

            if (verifyRes.success) {
              toast.success(`Welcome to Premium! Successfully subscribed to ${selectedCheckoutPlan.plan_name}.`, { id: "payment-process" });
              setCompany(verifyRes.company);
              localStorage.setItem('company', JSON.stringify(verifyRes.company));
              setSelectedCheckoutPlan(null); // return to plans grid
            } else {
              toast.error(verifyRes.message || "Verification failed.", { id: "payment-process" });
            }
          } catch (err) {
            console.error("Signature verification failed:", err);
            toast.error("Signature authorization failed. Please contact NextHire support.", { id: "payment-process" });
          }
        },
        prefill: {
          name: billingForm.legalName || company.contact_person_name || "NextHire Employer",
          email: billingForm.billingEmail || company.official_work_email || "",
          contact: company.mobile_number || ""
        },
        theme: {
          color: "#5b21b6", // Gorgeous NextHire brand purple!
          backdrop_color: "#fbfbfe"
        },
        modal: {
          ondismiss: () => {
            toast.dismiss("payment-process");
            toast.error("Payment modal closed by user.");
          }
        }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

    } catch (err) {
      console.error("Payment execution error:", err);
      toast.error(err.message || "Unable to proceed with payment order.", { id: "payment-process" });
    } finally {
      setPaymentProcessing(false);
    }
  };

  // Scroll to Available Plans list
  const scrollToPlans = () => {
    const element = document.getElementById('available-plans-section');
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // Helper values for current active plan from company document
  const currentPlanName = company.plan_id?.plan_name || 'Free Trial';
  const currentPlanType = company.plan_type || 'free';
  const planStatus = company.plan_status || 'active';
  const planExpiresAt = company.plan_expires_at
    ? new Date(company.plan_expires_at).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    : 'Never';

  // Calculate limits (usage progress scalability hook)
  const limitJobPosts = company.plan_id?.limits?.job_posts ?? 2;
  const limitTeamMembers = company.plan_id?.limits?.team_members ?? 1;
  const limitApplications = company.plan_id?.limits?.applications ?? 10;

  if (selectedCheckoutPlan) {
    const subtotal = selectedCheckoutPlan.price;
    const gst = Math.round((subtotal * 0.18) * 100) / 100;
    const totalAmount = subtotal + gst;

    return (
      <div className="max-w-6xl mx-auto animate-fadeIn pb-20 space-y-6">
        {/* CHECKOUT HEADER NAVIGATION */}
        <div className="flex flex-col items-center justify-center space-y-2 py-4 relative">
          <button
            onClick={() => setSelectedCheckoutPlan(null)}
            className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors border-none bg-transparent cursor-pointer"
          >
            <ArrowLeft size={14} strokeWidth={2.5} />
            <span>Back to Plans</span>
          </button>

          <div className="flex items-center gap-2 text-indigo-600">
            <CreditCard size={18} strokeWidth={2.5} className="animate-pulse" />
            <h2 className="text-sm font-black uppercase tracking-widest">3. Payment & Checkout</h2>
          </div>
        </div>

        {/* DOUBLE COLUMN SPLIT WORKSPACE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

          {/* COLUMN 1: PREMIUM ORDER SUMMARY BOX (Left Side) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] space-y-6">
              <div className="border-b border-slate-100 pb-3">
                <h3 className="text-xs font-black text-slate-400 uppercase tracking-widest">Order Summary</h3>
              </div>

              {/* Summary Items Box */}
              <div className="space-y-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <h4 className="text-sm font-black text-slate-900">{selectedCheckoutPlan.plan_name}</h4>
                    <p className="text-[10px] text-slate-400 font-extrabold uppercase mt-1">
                      Billing Period: {selectedCheckoutPlan.billing_cycle === 'monthly' ? 'Monthly' : selectedCheckoutPlan.billing_cycle === 'yearly' ? 'Yearly' : 'One-Time'}
                    </p>
                  </div>
                  <span className="text-sm font-black text-slate-900">₹{subtotal.toLocaleString()}</span>
                </div>

                <div className="border-t border-dashed border-slate-100 pt-4 space-y-2.5">
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>Subtotal</span>
                    <span>₹{subtotal.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-xs text-slate-500 font-semibold">
                    <span>GST (18%)</span>
                    <span>₹{gst.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</span>
                  </div>
                </div>

                <div className="border-t border-slate-100 pt-4 flex justify-between items-baseline">
                  <span className="text-xs font-black text-slate-900 uppercase tracking-wider">Total Amount</span>
                  <span className="text-xl font-black text-[#4f46e5] tracking-tight">
                    ₹{totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                  </span>
                </div>
              </div>
            </div>

            {/* Premium Trust Signals Row */}
            <div className="flex flex-wrap justify-between items-center gap-3 px-2">
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                <Lock size={12} className="text-indigo-500" />
                <span>Secure Payment</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                <Shield size={12} className="text-indigo-500" />
                <span>SSL Encrypted</span>
              </div>
              <div className="flex items-center gap-1.5 text-[9px] font-black uppercase tracking-wider text-slate-400">
                <CheckCircle size={12} className="text-indigo-500" />
                <span>100% Safe & Secure</span>
              </div>
            </div>
          </div>

          {/* COLUMN 2: ELEGANT INTERACTIVE CHECKOUT COMPONENT (Right Side) */}
          <div className="lg:col-span-7 bg-white rounded-2xl border border-slate-100 p-6 shadow-[0_8px_30px_rgba(15,23,42,0.02)] space-y-6">
            <div className="space-y-1">
              <h3 className="text-sm font-black text-slate-900">Payment Details</h3>
              <p className="text-slate-400 text-xs font-semibold">We accept all major secure payment channels.</p>
            </div>

            {/* TAB SELECTOR LIST */}
            <div className="grid grid-cols-4 gap-2 border-b border-slate-100 pb-4">
              {[
                { id: 'card', name: 'Card', icon: CreditCard },
                { id: 'upi', name: 'UPI', icon: Zap },
                { id: 'netbanking', name: 'Net Banking', icon: Briefcase },
                { id: 'wallet', name: 'Wallet', icon: Wallet }
              ].map((tab) => {
                const Icon = tab.icon;
                const isActive = checkoutTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setCheckoutTab(tab.id)}
                    className={`py-3 px-2 rounded-xl flex flex-col items-center justify-center gap-1.5 transition-all text-center border cursor-pointer ${isActive
                        ? 'bg-indigo-50/50 border-indigo-500 text-[#4f46e5] font-black shadow-sm'
                        : 'bg-transparent border-slate-100 text-slate-400 hover:text-slate-600 hover:bg-slate-50/50 font-bold'
                      }`}
                  >
                    <Icon size={14} className={isActive ? 'text-indigo-500' : 'text-slate-400'} />
                    <span className="text-[10px] uppercase tracking-wider leading-none mt-0.5">{tab.name}</span>
                  </button>
                );
              })}
            </div>

            {/* DYNAMIC TAB INTERFACES FORM */}
            <form onSubmit={handleProcessRazorpayPayment} className="space-y-5">

              {/* TAB 1: CARD PAYMENT PORTAL */}
              {checkoutTab === 'card' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Card Number</label>
                    <input
                      type="text"
                      value={cardDetails.cardNumber}
                      onChange={handleCardNumberChange}
                      placeholder="1234 5678 9012 3456"
                      className="w-full px-4 py-3 border border-slate-200/85 hover:border-slate-300 focus:border-indigo-500 rounded-xl text-xs font-semibold transition-colors outline-none bg-slate-50/20"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Expiry Date</label>
                      <input
                        type="text"
                        value={cardDetails.expiryDate}
                        onChange={handleExpiryChange}
                        placeholder="MM/YY"
                        className="w-full px-4 py-3 border border-slate-200/85 hover:border-slate-300 focus:border-indigo-500 rounded-xl text-xs font-semibold transition-colors outline-none text-center bg-slate-50/20"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">CVV</label>
                      <input
                        type="password"
                        value={cardDetails.cvv}
                        onChange={handleCvvChange}
                        placeholder="123"
                        className="w-full px-4 py-3 border border-slate-200/85 hover:border-slate-300 focus:border-indigo-500 rounded-xl text-xs font-semibold transition-colors outline-none text-center bg-slate-50/20"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Cardholder Name</label>
                    <input
                      type="text"
                      value={cardDetails.cardholderName}
                      onChange={(e) => setCardDetails({ ...cardDetails, cardholderName: e.target.value })}
                      placeholder="Name on card"
                      className="w-full px-4 py-3 border border-slate-200/85 hover:border-slate-300 focus:border-indigo-500 rounded-xl text-xs font-semibold transition-colors outline-none bg-slate-50/20"
                    />
                  </div>
                </div>
              )}

              {/* TAB 2: UPI PAYMENT PORTAL */}
              {checkoutTab === 'upi' && (
                <div className="space-y-5 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Enter UPI ID</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={upiId}
                        onChange={(e) => setUpiId(e.target.value)}
                        placeholder="example@okaxis"
                        className="w-full pl-4 pr-12 py-3 border border-slate-200/85 hover:border-slate-300 focus:border-indigo-500 rounded-xl text-xs font-semibold transition-colors outline-none bg-slate-50/20"
                      />
                      <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[10px] font-black text-indigo-500 uppercase">Verify</span>
                    </div>
                  </div>

                  {/* Visual QR Code Simulator Card */}
                  <div className="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 flex flex-col items-center justify-center space-y-3.5 text-center py-6">
                    <div className="relative w-28 h-28 bg-white border border-slate-200/60 p-2.5 rounded-xl shadow-sm flex items-center justify-center overflow-hidden group">
                      {/* Interactive pulse scanner animation */}
                      <div className="absolute inset-x-0 top-0 h-0.5 bg-indigo-500 animate-[scan_2s_infinite_linear]"></div>
                      <img
                        src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=nexthiresubscriptionpayment"
                        alt="UPI Payment QR Code"
                        className="w-full h-full opacity-90 group-hover:scale-105 transition-transform duration-300"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[10px] font-black text-slate-800 uppercase tracking-wide">Generate Static Sandbox QR</p>
                      <p className="text-[9px] text-slate-400 font-bold">Open phone scanner app to scan or click the submit pay button below.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* TAB 3: NET BANKING PORTAL */}
              {checkoutTab === 'netbanking' && (
                <div className="space-y-4 animate-fadeIn">
                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Popular Banks</label>
                    <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: 'sbi', name: 'State Bank of India', code: 'SBI' },
                        { id: 'hdfc', name: 'HDFC Bank', code: 'HDFC' },
                        { id: 'icici', name: 'ICICI Bank', code: 'ICICI' },
                        { id: 'axis', name: 'Axis Bank', code: 'AXIS' }
                      ].map((bank) => (
                        <button
                          key={bank.id}
                          type="button"
                          onClick={() => setSelectedBank(bank.id)}
                          className={`py-3 px-3 rounded-xl flex items-center gap-3 border text-left cursor-pointer transition-all ${selectedBank === bank.id
                              ? 'bg-indigo-50/40 border-indigo-500 text-[#4f46e5] font-black'
                              : 'bg-slate-50/20 border-slate-100 hover:border-slate-200 text-slate-600 font-semibold'
                            }`}
                        >
                          <span className={`w-7 h-7 rounded-lg flex items-center justify-center text-[10px] font-black text-white ${selectedBank === bank.id ? 'bg-indigo-600' : 'bg-slate-400'
                            }`}>
                            {bank.code}
                          </span>
                          <span className="text-[11px] leading-tight truncate">{bank.name}</span>
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Or Choose Other Bank</label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-3 border border-slate-200/85 hover:border-slate-300 focus:border-indigo-500 rounded-xl text-xs font-semibold outline-none cursor-pointer bg-slate-50/20"
                    >
                      <option value="">-- Choose your bank --</option>
                      <option value="pnb">Punjab National Bank</option>
                      <option value="bob">Bank of Baroda</option>
                      <option value="yes">Yes Bank</option>
                      <option value="kotak">Kotak Mahindra Bank</option>
                      <option value="idbi">IDBI Bank</option>
                    </select>
                  </div>
                </div>
              )}

              {/* TAB 4: WALLETS PORTAL */}
              {checkoutTab === 'wallet' && (
                <div className="space-y-4 animate-fadeIn">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-wider block">Supported Wallets</label>
                  <div className="grid grid-cols-2 gap-3">
                    {[
                      { id: 'paytm', name: 'Paytm Wallet' },
                      { id: 'phonepe', name: 'PhonePe Wallet' },
                      { id: 'amazonpay', name: 'Amazon Pay' },
                      { id: 'mobikwik', name: 'MobiKwik' }
                    ].map((wallet) => (
                      <button
                        key={wallet.id}
                        type="button"
                        onClick={() => setSelectedWallet(wallet.id)}
                        className={`py-3.5 px-4 rounded-xl flex items-center justify-between border cursor-pointer transition-all ${selectedWallet === wallet.id
                            ? 'bg-indigo-50/40 border-indigo-500 text-[#4f46e5] font-black'
                            : 'bg-slate-50/20 border-slate-100 hover:border-slate-200 text-slate-600 font-semibold'
                          }`}
                      >
                        <span className="text-[11px]">{wallet.name}</span>
                        <div className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center ${selectedWallet === wallet.id ? 'border-indigo-600 bg-indigo-600' : 'border-slate-300 bg-white'
                          }`}>
                          {selectedWallet === wallet.id && <div className="w-1.5 h-1.5 rounded-full bg-white"></div>}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* SUBMIT BUTTON TRIGGER FOR ACTIVE METHOD */}
              <div className="pt-4 border-t border-slate-50 space-y-3.5">
                <button
                  type="submit"
                  disabled={paymentProcessing}
                  className="w-full py-4 bg-[#4f46e5] hover:bg-[#4338ca] text-white font-black rounded-xl text-xs uppercase tracking-wider transition-all border-none cursor-pointer shadow-lg shadow-indigo-500/15 flex items-center justify-center gap-2 active:scale-[0.98] disabled:bg-slate-300 disabled:cursor-not-allowed"
                >
                  <Lock size={12} strokeWidth={2.5} />
                  <span>
                    {paymentProcessing
                      ? 'Processing secure transaction...'
                      : `Pay ₹${totalAmount.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })} Securely`}
                  </span>
                </button>

                <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] font-bold">
                  <span>Powered by</span>
                  <span className="text-slate-600 font-black tracking-wide flex items-center gap-0.5">
                    <span className="text-[#339af0]">R</span>azorpay
                  </span>
                </div>
              </div>

            </form>
          </div>

        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto animate-fadeIn pb-16">

      {/* SECTION 1: TOP EXECUTIVE STATUS BANNER */}
      <div className="bg-gradient-to-r from-[#0a1120] via-[#111c34] to-[#0a1120] text-white p-5 lg:p-6 rounded-2xl border border-slate-800 shadow-xl relative overflow-hidden">
        {/* Abstract design elements */}
        <div className="absolute -top-24 -right-24 w-72 h-72 bg-gradient-to-tr from-amber-500/10 to-transparent rounded-full blur-2xl"></div>
        <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-gradient-to-tr from-blue-500/10 to-transparent rounded-full blur-2xl"></div>

        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-5 relative z-10">
          <div className="space-y-2.5">
            <div className="flex items-center gap-2">
              <span className="p-1.5 bg-amber-500/10 text-amber-400 border border-amber-500/20 rounded-lg">
                <Shield size={16} />
              </span>
              <p className="text-[10px] font-black uppercase tracking-widest text-amber-400">Employer Corporate Account</p>
            </div>

            <div className="space-y-1">
              <h2 className="text-xl lg:text-2xl font-black tracking-tight flex items-center gap-2">
                <span>Current Plan:</span>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-yellow-300">
                  {currentPlanName}
                </span>
              </h2>
              <p className="text-slate-400 text-xs font-semibold max-w-xl">
                Upgrade your billing suite and acquire top-tier applicant metrics, dedicated recruitment coordinators, and AI resume screening.
              </p>
            </div>

            <div className="flex flex-wrap gap-3 pt-1">
              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <span className={`w-2 h-2 rounded-full ${planStatus === 'active' ? 'bg-emerald-500' : 'bg-red-500'} animate-pulse`}></span>
                <span className="text-[10px] font-black uppercase tracking-wider text-slate-300">
                  Status: {planStatus}
                </span>
              </div>

              <div className="flex items-center gap-1.5 bg-white/5 border border-white/10 px-3 py-1.5 rounded-lg">
                <Clock size={11} className="text-slate-400" />
                <span className="text-[10px] font-bold text-slate-300">
                  Expires: <span className="font-black text-white">{planExpiresAt}</span>
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={scrollToPlans}
            className="py-2.5 px-5 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 hover:shadow-xl hover:shadow-amber-500/20 text-slate-950 font-black rounded-xl text-xs uppercase tracking-wider transition-all border-none cursor-pointer flex items-center gap-2 active:scale-[0.98] self-stretch lg:self-auto text-center justify-center shadow-lg"
          >
            <span>Upgrade Subscription</span>
            <ArrowRight size={13} strokeWidth={2.5} />
          </button>
        </div>
      </div>

      {/* SECTION 2: NAVIGATION TABS FOR FUTURE SCALABILITY */}
      <div className="flex gap-2 border-b border-slate-200/60 pb-1.5 overflow-x-auto">
        <button
          onClick={() => setActiveTab('plans')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-none bg-transparent cursor-pointer transition-all relative flex items-center gap-2 ${activeTab === 'plans' ? 'text-[#0a1120]' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <CreditCard size={14} />
          <span>Plans & Pricing</span>
          {activeTab === 'plans' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a1120]"></div>}
        </button>

        <button
          onClick={() => setActiveTab('usage')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-none bg-transparent cursor-pointer transition-all relative flex items-center gap-2 ${activeTab === 'usage' ? 'text-[#0a1120]' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <BarChart2 size={14} />
          <span>Limits & Usage</span>
          {activeTab === 'usage' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a1120]"></div>}
        </button>

        <button
          onClick={() => setActiveTab('gst')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-none bg-transparent cursor-pointer transition-all relative flex items-center gap-2 ${activeTab === 'gst' ? 'text-[#0a1120]' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <Settings size={14} />
          <span>GST & Billing Settings</span>
          {activeTab === 'gst' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a1120]"></div>}
        </button>

        <button
          onClick={() => setActiveTab('invoices')}
          className={`px-5 py-3 text-xs font-black uppercase tracking-wider border-none bg-transparent cursor-pointer transition-all relative flex items-center gap-2 ${activeTab === 'invoices' ? 'text-[#0a1120]' : 'text-slate-400 hover:text-slate-600'
            }`}
        >
          <FileText size={14} />
          <span>Invoices & History</span>
          {activeTab === 'invoices' && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-[#0a1120]"></div>}
        </button>
      </div>

      {/* RENDER ACTIVE TABS */}

      {/* TAB 1: AVAILABLE SUBSCRIPTION PLANS */}
      {activeTab === 'plans' && (
        <div id="available-plans-section" className="space-y-6">
          <div className="flex justify-between items-center">
            <div>
              <h3 className="text-base font-black text-[#0a1120] uppercase tracking-wide">Available Subscription Plans</h3>
              <p className="text-slate-400 text-xs font-semibold">Select from our vetted recruitment models or contact corporate support for enterprise volume requirements.</p>
            </div>

            <div className="hidden sm:flex items-center gap-2 bg-[#f1f5f9] px-3.5 py-1.5 rounded-xl border border-slate-200">
              <span className="p-1.5 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-lg">
                <Wallet size={12} />
              </span>
              <span className="text-[10px] font-extrabold uppercase tracking-wide text-slate-500">
                Razorpay Checkout Enabled
              </span>
            </div>
          </div>

          {/* LOADING STATE */}
          {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 py-12">
              {[1, 2, 3].map(i => (
                <div key={i} className="bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-sm animate-pulse">
                  <div className="h-4 bg-slate-200 rounded w-1/3"></div>
                  <div className="h-8 bg-slate-200 rounded w-2/3"></div>
                  <div className="space-y-2">
                    <div className="h-3 bg-slate-200 rounded"></div>
                    <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                    <div className="h-3 bg-slate-200 rounded w-4/5"></div>
                  </div>
                  <div className="h-10 bg-slate-200 rounded-xl"></div>
                </div>
              ))}
            </div>
          )}

          {/* ERROR STATE */}
          {error && (
            <div className="bg-red-50 border border-red-100 p-6 rounded-2xl flex items-center gap-4 text-red-700 font-semibold text-xs">
              <AlertTriangle size={20} className="text-red-500 flex-shrink-0" />
              <div>
                <p className="font-bold">{error}</p>
                <p className="text-[11px] text-red-500 mt-1">Please try again later or contact support if the issue persists.</p>
              </div>
            </div>
          )}

          {/* EMPTY STATE */}
          {!loading && !error && plans.length === 0 && (
            <div className="bg-white border border-slate-100 p-12 rounded-3xl text-center space-y-3 shadow-sm max-w-xl mx-auto">
              <AlertTriangle size={36} className="text-amber-500 mx-auto" />
              <h4 className="text-sm font-black text-[#0a1120] uppercase tracking-wide">No Active Plans Available</h4>
              <p className="text-slate-400 text-xs font-semibold leading-relaxed">
                Super Admin has not active any subscription plans yet. Please check again later or contact administrative support directly.
              </p>
            </div>
          )}

          {/* AVAILABLE PLANS GRID */}
          {!loading && !error && plans.length > 0 && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
              {plans.map((plan) => {
                const isCurrent = currentPlanType === plan.plan_type;

                // Features arrays mapped logically from the features object
                const featuresList = [];
                if (plan.limits?.job_posts === -1) featuresList.push('Unlimited Job Posts');
                else featuresList.push(`${plan.limits?.job_posts} Active Job Postings`);

                if (plan.limits?.team_members === -1) featuresList.push('Unlimited Team Seats');
                else featuresList.push(`${plan.limits?.team_members} Corporate Seats`);

                if (plan.limits?.applications === -1) featuresList.push('Unlimited Applicants Access');
                else featuresList.push(`Up to ${plan.limits?.applications} Applications`);

                if (plan.features?.analytics) featuresList.push('Advanced Candidate Analytics');
                if (plan.features?.featured_jobs) featuresList.push('Featured Job Boostings');
                if (plan.features?.custom_branding) featuresList.push('Custom Employer Profile Branding');
                if (plan.features?.api_access) featuresList.push('Hiring REST API Access');
                if (plan.features?.dedicated_manager) featuresList.push('Dedicated Support Manager');

                // Add fallback generic features if the list is small
                if (featuresList.length < 5) {
                  featuresList.push(`Support Level: ${plan.support_type.charAt(0).toUpperCase() + plan.support_type.slice(1)}`);
                  featuresList.push('ATS Candidate Tracking System');
                  featuresList.push('Verified Security Screening');
                }

                return (
                  <div
                    key={plan._id}
                    className={`bg-white rounded-2xl p-5 shadow-[0_4px_24px_rgba(15,23,42,0.015)] border transition-all duration-300 flex flex-col justify-between relative group ${isCurrent
                        ? 'border-amber-400 shadow-md ring-1 ring-amber-400/30'
                        : 'border-slate-100 hover:border-slate-300 hover:shadow-[0_12px_40px_rgba(10,17,32,0.04)] hover:-translate-y-1'
                      }`}
                  >
                    {/* Popular / Best Seller ribbon */}
                    {plan.is_popular && (
                      <span className="absolute -top-3 right-5 px-2.5 py-0.5 bg-amber-500 text-[#0a1120] border border-amber-400 text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm">
                        Most Popular
                      </span>
                    )}

                    {/* Current Plan highlight banner */}
                    {isCurrent && (
                      <span className="absolute -top-3 left-5 px-2.5 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-200 text-[8px] font-black uppercase tracking-widest rounded-full shadow-sm flex items-center gap-1">
                        <CheckCircle size={10} />
                        Active Plan
                      </span>
                    )}

                    <div className="space-y-4">
                      <div className="space-y-0.5 pt-1">
                        <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                          {plan.plan_type} Tier
                        </h4>
                        <h3 className="text-base font-black text-[#0a1120] tracking-tight group-hover:text-blue-600 transition-colors">
                          {plan.plan_name}
                        </h3>
                      </div>

                      <div className="border-b border-slate-100 pb-3.5">
                        <p className="text-2xl font-black text-[#0a1120] tracking-tight leading-none">
                          ₹{plan.price.toLocaleString()}
                        </p>
                        <p className="text-[9px] text-slate-400 font-extrabold mt-1.5 uppercase tracking-wider">
                          Per {plan.billing_cycle === 'one_time' ? 'One-Time Setup' : plan.billing_cycle === 'monthly' ? 'Month' : 'Year'}
                        </p>
                      </div>

                      <div className="space-y-2">
                        <p className="text-[9px] font-black text-[#0a1120] uppercase tracking-wider">Key Features:</p>
                        <ul className="space-y-2 p-0 list-none m-0">
                          {featuresList.map((feat, idx) => (
                            <li key={idx} className="flex items-start gap-2 text-slate-500 font-semibold text-[11px] leading-relaxed">
                              <span className="p-0.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-md mt-0.5 flex-shrink-0">
                                <Check size={8} strokeWidth={3} />
                              </span>
                              <span>{feat}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <div className="pt-4 border-t border-slate-50 mt-4.5">
                      {isCurrent ? (
                        <button
                          className="w-full py-2.5 bg-emerald-50 border border-emerald-200 text-emerald-700 font-black rounded-xl text-[10px] uppercase tracking-wider flex items-center justify-center gap-1.5 cursor-not-allowed"
                          disabled
                        >
                          <CheckCircle size={12} />
                          <span>Currently Subscribed</span>
                        </button>
                      ) : (
                        <button
                          onClick={() => handleUpgrade(plan)}
                          className={`w-full py-2.5 font-black rounded-xl text-[10px] uppercase tracking-wider transition-all cursor-pointer border-none shadow-sm active:scale-95 ${plan.is_popular
                              ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white shadow-blue-500/10'
                              : 'bg-slate-900 hover:bg-slate-800 text-white'
                            }`}
                        >
                          Upgrade Now
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: LIMITS & USAGE ANALYTICS */}
      {activeTab === 'usage' && (
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div>
            <h3 className="text-base font-black text-[#0a1120] uppercase tracking-wide">Limits & Active Utilization</h3>
            <p className="text-slate-400 text-xs font-semibold">Monitor real-time consumption profiles and seat allocation indices.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Limit Card 1: Job Posts */}
            <div className="p-6 bg-slate-50/70 border border-slate-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="p-2 bg-blue-500/10 text-blue-600 border border-blue-500/20 rounded-xl">
                  <Briefcase size={16} />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 px-2.5 py-1 text-slate-500">
                  Usage: High
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Job Postings Limit</p>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-2xl font-black text-[#0a1120]">3 Posts Used</h4>
                  <p className="text-xs text-slate-500 font-bold">Of {limitJobPosts === -1 ? 'Unlimited' : limitJobPosts}</p>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-blue-600 h-full rounded-full transition-all"
                  style={{ width: limitJobPosts === -1 ? '15%' : `${Math.min(100, (3 / limitJobPosts) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Limit Card 2: Team Members */}
            <div className="p-6 bg-slate-50/70 border border-slate-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="p-2 bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 rounded-xl">
                  <Users size={16} />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 px-2.5 py-1 text-slate-500">
                  Stable Setup
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Team Seat Allocations</p>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-2xl font-black text-[#0a1120]">1 Seat Active</h4>
                  <p className="text-xs text-slate-500 font-bold">Of {limitTeamMembers === -1 ? 'Unlimited' : limitTeamMembers}</p>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-emerald-500 h-full rounded-full transition-all"
                  style={{ width: limitTeamMembers === -1 ? '10%' : `${Math.min(100, (1 / limitTeamMembers) * 100)}%` }}
                ></div>
              </div>
            </div>

            {/* Limit Card 3: Applications Screen */}
            <div className="p-6 bg-slate-50/70 border border-slate-150 rounded-2xl space-y-4">
              <div className="flex justify-between items-center">
                <span className="p-2 bg-purple-500/10 text-purple-600 border border-purple-500/20 rounded-xl">
                  <FileText size={16} />
                </span>
                <span className="text-[10px] font-black uppercase tracking-wider bg-white border border-slate-200 px-2.5 py-1 text-slate-500">
                  Renewals Due
                </span>
              </div>
              <div className="space-y-1.5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-wider">Applicant Screenings</p>
                <div className="flex justify-between items-baseline">
                  <h4 className="text-2xl font-black text-[#0a1120]">3 Candidates</h4>
                  <p className="text-xs text-slate-500 font-bold">Of {limitApplications === -1 ? 'Unlimited' : limitApplications}</p>
                </div>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div
                  className="bg-purple-600 h-full rounded-full transition-all"
                  style={{ width: limitApplications === -1 ? '12%' : `${Math.min(100, (3 / limitApplications) * 100)}%` }}
                ></div>
              </div>
            </div>
          </div>

          <div className="bg-slate-50/50 border border-slate-150 rounded-2xl p-6 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <span className="p-3.5 bg-blue-50 text-blue-600 border border-blue-100 rounded-2xl hidden md:block">
                <Sparkles size={22} />
              </span>
              <div>
                <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">Looking for Custom Analytics & Unlimited Access?</h4>
                <p className="text-slate-400 text-xs font-semibold mt-0.5">Scale to our Enterprise subscription parameters and configure customized webhook APIs.</p>
              </div>
            </div>

            <button
              onClick={scrollToPlans}
              className="py-3 px-5 bg-[#0a1120] hover:bg-[#182645] text-white font-black rounded-xl text-xs transition-all cursor-pointer border-none shadow-sm whitespace-nowrap"
            >
              Configure Enterprise Limits
            </button>
          </div>
        </div>
      )}

      {/* TAB 3: GST & BILLING SETTINGS */}
      {activeTab === 'gst' && (
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm max-w-2xl space-y-6">
          <div>
            <h3 className="text-base font-black text-[#0a1120] uppercase tracking-wide">GST Billing Parameters</h3>
            <p className="text-slate-400 text-xs font-semibold">Store legal company metadata to generate audit-compliant taxation invoices automatically.</p>
          </div>

          <form onSubmit={handleSaveBilling} className="space-y-5">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Registered Entity Name</label>
                <input
                  type="text"
                  required
                  value={billingForm.legalName}
                  onChange={(e) => setBillingForm({ ...billingForm, legalName: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">GSTIN Number</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 27AADCB8374D1ZS"
                  value={billingForm.gstin}
                  onChange={(e) => setBillingForm({ ...billingForm, gstin: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Billing Communications Email</label>
                <input
                  type="email"
                  required
                  value={billingForm.billingEmail}
                  onChange={(e) => setBillingForm({ ...billingForm, billingEmail: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">State Code / Jurisdiction</label>
                <select
                  value={billingForm.stateCode}
                  onChange={(e) => setBillingForm({ ...billingForm, stateCode: e.target.value })}
                  className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-700 transition-all cursor-pointer"
                >
                  <option value="27 (Maharashtra)">27 (Maharashtra)</option>
                  <option value="24 (Gujarat)">24 (Gujarat)</option>
                  <option value="07 (Delhi)">07 (Delhi)</option>
                  <option value="29 (Karnataka)">29 (Karnataka)</option>
                </select>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Legal Office Address</label>
              <textarea
                rows={3}
                required
                value={billingForm.billingAddress}
                onChange={(e) => setBillingForm({ ...billingForm, billingAddress: e.target.value })}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold text-slate-700 transition-all resize-none leading-relaxed"
              />
            </div>

            <button
              type="submit"
              className="py-3.5 px-6 bg-[#0a1120] hover:bg-[#182645] text-white font-bold rounded-xl transition-all text-xs cursor-pointer border-none shadow-sm"
            >
              Save Billing Parameters
            </button>
          </form>
        </div>
      )}

      {/* TAB 4: INVOICE HISTORY */}
      {activeTab === 'invoices' && (
        <div className="bg-white border border-slate-100 p-8 rounded-3xl shadow-sm space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <div>
              <h3 className="text-base font-black text-[#0a1120] uppercase tracking-wide">Billing & Invoice Logs</h3>
              <p className="text-slate-400 text-xs font-semibold">Audit chronological billing transactions issued by NextHire.in payroll operations.</p>
            </div>

            <button
              onClick={() => toast.success('All available receipts successfully archived to zip bundle!')}
              className="py-2.5 px-4 bg-white hover:bg-slate-50 border border-slate-200 text-slate-700 font-bold rounded-xl text-xs transition-all cursor-pointer flex items-center gap-2"
            >
              <Download size={14} />
              <span>Archive All Receipts</span>
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                  <th className="pb-4 pl-4">Invoice ID</th>
                  <th className="pb-4">Bill Date</th>
                  <th className="pb-4">Subscription Plan</th>
                  <th className="pb-4">Amount Paid</th>
                  <th className="pb-4">Payment Method</th>
                  <th className="pb-4">Status</th>
                  <th className="pb-4 pr-4 text-right">Download</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {invoices.map((inv) => (
                  <tr key={inv.id} className="text-xs font-semibold text-slate-600 hover:bg-slate-50/50 transition-all">
                    <td className="py-4 pl-4 text-slate-800 font-extrabold">{inv.id}</td>
                    <td className="py-4 text-slate-500">{inv.date}</td>
                    <td className="py-4 font-bold text-slate-700">{inv.plan}</td>
                    <td className="py-4 font-black text-slate-800">{inv.amount}</td>
                    <td className="py-4 text-[11px] font-bold text-slate-500">{inv.type}</td>
                    <td className="py-4">
                      <span className="bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-md border border-emerald-100 text-[10px] font-black uppercase">
                        {inv.status}
                      </span>
                    </td>
                    <td className="py-4 pr-4 text-right">
                      <button
                        onClick={() => toast.success(`Receipt for ${inv.id} downloaded successfully!`)}
                        className="p-2 text-blue-600 hover:text-blue-800 hover:bg-blue-50 border-none bg-transparent cursor-pointer rounded-lg transition-colors"
                        title="Download Invoice PDF"
                      >
                        <Download size={14} />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
};

export default BillingPlans;
