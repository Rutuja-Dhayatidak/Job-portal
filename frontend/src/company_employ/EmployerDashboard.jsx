import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Building2,
  PlusCircle,
  Briefcase,
  Users,
  Calendar,
  UserCheck,
  BarChart3,
  CheckCircle2,
  Settings,
  LogOut,
  Bell,
  Search,
  TrendingUp,
  Check,
  X,
  FileText,
  Mail,
  MapPin,
  Globe,
  DollarSign,
  BriefcaseIcon,
  ShieldCheck,
  Zap,
  ExternalLink,
  ChevronRight,
  Sparkles,
  Award,
  MessageSquare,
  HelpCircle,
  MoreVertical,
  ChevronDown,
  CreditCard,
  Menu
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import API from '../services/axios';
import TeamManagement from './TeamManagement';
import BillingPlans from '../employer/pages/BillingPlans';

const EmployerDashboard = ({ initialTab = 'Dashboard' }) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(initialTab);
  const [loading, setLoading] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Local storage profile info
  const [user, setUser] = useState({});
  const [company, setCompany] = useState({});

  useEffect(() => {
    const fetchLiveProfile = async () => {
      try {
        const storedUser = localStorage.getItem('user');
        if (storedUser) setUser(JSON.parse(storedUser));

        // Fetch live profile to stay sync'd on subscription status and limits
        const res = await API.get('/employer/profile');
        if (res.data && res.data.success) {
          setCompany(res.data.company || {});
          setUser(res.data.user || {});
          localStorage.setItem('company', JSON.stringify(res.data.company || {}));
          localStorage.setItem('user', JSON.stringify(res.data.user || {}));
        } else {
          const storedCompany = localStorage.getItem('company');
          if (storedCompany) setCompany(JSON.parse(storedCompany));
        }
      } catch (err) {
        console.error("Failed to sync live employer profile:", err);
        const storedCompany = localStorage.getItem('company');
        if (storedCompany) setCompany(JSON.parse(storedCompany));
      }
    };
    fetchLiveProfile();
  }, []);

  const hasPermission = (permission) => {
    if (user.permissions && user.permissions.includes("full_access")) return true;
    if (user.permissions && user.permissions.includes(permission)) return true;
    if (!user.team_role || user.team_role === "employer_admin") return true;
    return false;
  };

  // Form State for "Create Job"
  const [jobForm, setJobForm] = useState({
    title: '',
    department: '',
    locationType: 'remote',
    salaryRange: '',
    experience: 'Entry Level',
    description: '',
    skillsRequired: ''
  });

  // State for Manage Jobs (starting with some mock active jobs)
  const [jobs, setJobs] = useState([
    { id: 1, title: 'Workshop Manager', department: 'Operations', location: 'Mehsana, Gujarat', applicants: 20, newApplicants: 20, reviewed: 5, rejected: 15, hired: 5, date: '20 July 2020' },
    { id: 2, title: 'Customer Care Executive Service', department: 'Support', location: 'Mehsana, Gujarat', applicants: 20, newApplicants: 20, reviewed: 5, rejected: 15, hired: 5, date: '20 July 2020' },
    { id: 3, title: 'Senior Full Stack Engineer', department: 'Engineering', location: 'Remote', applicants: 15, newApplicants: 10, reviewed: 8, rejected: 2, hired: 1, date: '04 May 2026' }
  ]);

  // Form State for Edit Company Details
  const [companyForm, setCompanyForm] = useState({
    name: 'WorknAI pvt .limited',
    website: 'worknai.in',
    gstin: '27AADCB8374D1ZS',
    phone: '+91 98765 43210',
    address: 'Mehsana, Gujarat',
    description: 'Pioneering next-generation SaaS workflows and developer tool suites.'
  });

  useEffect(() => {
    if (company && company.name) {
      setCompanyForm({
        name: company.name || 'WorknAI pvt .limited',
        website: company.website || 'worknai.in',
        gstin: company.gst_in || company.gstin || '27AADCB8374D1ZS',
        phone: company.phone || '+91 98765 43210',
        address: company.address || 'Mehsana, Gujarat',
        description: company.description || 'Pioneering next-generation SaaS workflows and developer tool suites.'
      });
    }
  }, [company]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    localStorage.removeItem('company');
    toast.success("Logged out successfully.");
    navigate('/company/login');
  };

  const handleCreateJob = (e) => {
    e.preventDefault();
    if (!jobForm.title || !jobForm.department || !jobForm.description) {
      return toast.error("Please fill in the Job Title, Department, and Description.");
    }

    // Enforce subscription plan job post limits
    let planName = "Free Trial";
    let jobLimit = 2; // Default Free Trial limit
    if (company && company.plan_id) {
      const plan = company.plan_id;
      planName = plan.plan_name || "Free Trial";
      jobLimit = plan.limits?.job_posts ?? 2;
    }

    if (jobLimit !== -1) {
      if (jobs.length >= jobLimit) {
        return toast.error(`Job limit reached! Your current plan "${planName}" only allows up to ${jobLimit} job postings. Please upgrade your plan to post more.`);
      }
    }

    const newJob = {
      id: Date.now(),
      title: jobForm.title,
      department: jobForm.department,
      location: jobForm.locationType.charAt(0).toUpperCase() + jobForm.locationType.slice(1),
      applicants: 0,
      newApplicants: 0,
      reviewed: 0,
      rejected: 0,
      hired: 0,
      date: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' })
    };

    setJobs([newJob, ...jobs]);
    toast.success("Job posting created successfully!");
    setJobForm({
      title: '',
      department: '',
      locationType: 'remote',
      salaryRange: '',
      experience: 'Entry Level',
      description: '',
      skillsRequired: ''
    });
    setActiveTab('My Job Posts');
  };

  const renderCustomATSView = () => {
    switch (activeTab) {
      // 1. HR Admin Tabs
      case 'Employee Management':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Employee Directory</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1">Manage corporate staff rosters, profile indexes, and department classifications.</p>
              </div>
              <button className="bg-[#0a1120] text-white hover:bg-amber-500 hover:text-[#0a1120] px-4 py-2 text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer rounded-none">Add Employee</button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Headcount</p>
                <p className="text-2xl font-black text-[#0a1120] mt-1">142</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">New Joiners (This Month)</p>
                <p className="text-2xl font-black text-emerald-600 mt-1">+12</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Department Count</p>
                <p className="text-2xl font-black text-indigo-600 mt-1">8</p>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/70">
                    <th className="py-3 px-4">Name</th>
                    <th className="py-3 px-4">Department</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-800 font-black">Amit Sharma</td>
                    <td className="py-3 px-4 text-slate-500">Engineering</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] uppercase font-black">Active</span></td>
                    <td className="py-3 px-4 text-right"><button className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer text-xs font-bold">Edit</button></td>
                  </tr>
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-800 font-black">Neha Gupta</td>
                    <td className="py-3 px-4 text-slate-500">HR Operations</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[10px] uppercase font-black">Active</span></td>
                    <td className="py-3 px-4 text-right"><button className="text-blue-600 hover:underline bg-transparent border-none cursor-pointer text-xs font-bold">Edit</button></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'HR Documents':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">HR Secure Documents Vault</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Access, audit, and distribute employee handbooks, contracts, and compliance policies.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { title: 'Employee Handbook 2026.pdf', size: '2.4 MB', category: 'General' },
                { title: 'NDA Template Corporate.docx', size: '1.1 MB', category: 'Legal' },
                { title: 'Code Of Conduct Agreement.pdf', size: '4.8 MB', category: 'Compliance' }
              ].map((doc, i) => (
                <div key={i} className="p-4 border border-slate-150 hover:border-slate-300 bg-slate-50 flex justify-between items-center">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-[#0a1120] text-white flex items-center justify-center font-black text-xs rounded-none">PDF</div>
                    <div>
                      <p className="text-xs font-black text-[#0a1120]">{doc.title}</p>
                      <p className="text-[10px] text-slate-400 font-bold mt-0.5 uppercase tracking-wide">{doc.size} • {doc.category}</p>
                    </div>
                  </div>
                  <button className="text-[#0a1120] hover:text-amber-500 font-black text-xs uppercase bg-transparent border-none cursor-pointer">Download</button>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Leave Policies':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Leave Policies & Guidelines</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Configure company annual allocations, sick allowances, and holiday guidelines.</p>
            </div>
            <div className="space-y-3.5">
              {[
                { type: 'Casual Leave Allowance', duration: '18 Days / Year', desc: 'General leave quota for personal work, vacation, or sudden casual engagements.' },
                { type: 'Sick & Medical Leave', duration: '12 Days / Year', desc: 'Protected medical leave quota requiring digital certification for >3 days.' },
                { type: 'Maternity/Paternity Period', duration: '26 Weeks Paid', desc: 'Fully compensated parental leave programs in accordance with corporate mandates.' }
              ].map((policy, idx) => (
                <div key={idx} className="p-4 border border-slate-150 bg-slate-50 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                  <div>
                    <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{policy.type}</h4>
                    <p className="text-xs text-slate-400 font-bold mt-1 max-w-xl">{policy.desc}</p>
                  </div>
                  <span className="text-[10px] font-black text-indigo-700 bg-indigo-50 border border-indigo-150 px-3 py-1 uppercase">{policy.duration}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Payroll Overview':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div className="flex justify-between items-center border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Payroll Overview & Disbursals</h3>
                <p className="text-slate-400 text-xs font-semibold mt-1">Process direct bank salary rollouts, tax deductions, and monthly salary slips.</p>
              </div>
              <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-150 px-3 py-1.5 uppercase">Status: Configured</span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-5 border border-slate-150 bg-slate-50/70 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Next Payout Date</p>
                <h4 className="text-xl font-black text-[#0a1120]">May 31, 2026</h4>
                <p className="text-xs text-slate-400 font-bold mt-1">Processing cycle lock scheduled at 25th May.</p>
              </div>
              <div className="p-5 border border-slate-150 bg-slate-50/70 space-y-2">
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Total Net Payroll</p>
                <h4 className="text-xl font-black text-indigo-600">₹42,50,000 / month</h4>
                <p className="text-xs text-emerald-600 font-black mt-1">✔ 100% compliant with EPFO tax brackets.</p>
              </div>
            </div>
          </div>
        );

      case 'Compliance':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Compliance Audit Dashboard</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Audit status of employment regulations, filings, tax clearances, and safety norms.</p>
            </div>
            <div className="space-y-3">
              {[
                { rule: 'EPF & ESIC State Filings', status: 'Compliant', date: '04 May 2026' },
                { rule: 'Professional Tax (PT) Submissions', status: 'Compliant', date: '30 Apr 2026' },
                { rule: 'Equal Employment Opportunity Guard', status: 'Certified', date: 'Active' }
              ].map((item, key) => (
                <div key={key} className="p-4 bg-slate-50 border border-slate-150 flex justify-between items-center">
                  <div>
                    <h4 className="text-xs font-black text-[#0a1120]">{item.rule}</h4>
                    <p className="text-[10px] text-slate-400 font-bold mt-1">Audit Cycle: {item.date}</p>
                  </div>
                  <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1.5 uppercase font-bold">✔ {item.status}</span>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Analytics':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">HR Performance & Recruitment Metrics</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Identify recruitment trends, time-to-hire pipelines, and retention metrics.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {[
                { title: 'Time to Hire', val: '18 Days' },
                { title: 'Acceptance Rate', val: '92%' },
                { title: 'Attrition Factor', val: '4.2%' },
                { title: 'Sourcing Velocity', val: 'Fast' }
              ].map((item, key) => (
                <div key={key} className="p-4 bg-slate-50 border border-slate-150 text-center">
                  <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{item.title}</p>
                  <p className="text-xl font-black text-[#0a1120] mt-1.5">{item.val}</p>
                </div>
              ))}
            </div>
          </div>
        );

      // 2. Recruitment Coordinator Tabs
      case 'Candidate Pipeline':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Recruitment Candidate Pipeline</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Track high-fidelity candidates progression stage-by-stage.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {['Sourced (14)', 'Screened (8)', 'Interviewing (5)', 'Offered (2)'].map((stage, idx) => (
                <div key={idx} className="p-4 border border-slate-150 bg-slate-50">
                  <h4 className="text-xs font-black text-[#0a1120] border-b border-slate-200 pb-2 uppercase tracking-wider">{stage}</h4>
                  <div className="pt-3 space-y-2">
                    <div className="p-2.5 bg-white border border-slate-150 text-[10.5px] font-bold">
                      <p className="text-[#0a1120] font-black">Amit Kumar</p>
                      <p className="text-slate-400 text-[9.5px]">React Dev • 4Y</p>
                    </div>
                    <div className="p-2.5 bg-white border border-slate-150 text-[10.5px] font-bold">
                      <p className="text-[#0a1120] font-black">Rohit Sen</p>
                      <p className="text-slate-400 text-[9.5px]">Python Engineer • 2Y</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Applications':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Job Applications Index</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Review active submissions across all published job postings.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/70">
                    <th className="py-3 px-4">Candidate</th>
                    <th className="py-3 px-4">Job Designation</th>
                    <th className="py-3 px-4">Submission Date</th>
                    <th className="py-3 px-4 text-right">Progress</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-800 font-black">Siddharth Das</td>
                    <td className="py-3 px-4 text-slate-500">Workshop Manager</td>
                    <td className="py-3 px-4 text-slate-400">05 May 2026</td>
                    <td className="py-3 px-4 text-right"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] uppercase font-black">Under Review</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Recruitment Reports':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Generated Recruitment Audits</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Review, compile, and export corporate hiring velocity and application metrics.</p>
            </div>
            <div className="p-5 border border-dashed border-slate-200 text-center bg-slate-50">
              <p className="text-xs text-slate-400 font-bold mb-3">No custom reports compiled yet.</p>
              <button className="bg-[#0a1120] text-white hover:bg-amber-500 hover:text-[#0a1120] px-4 py-2.5 text-xs font-black uppercase tracking-wider transition-all border-none cursor-pointer rounded-none">Compile Recruitment Report</button>
            </div>
          </div>
        );

      // 3. Interview Coordinator Tabs
      case 'Panel Coordination':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Panel Coordination & Assignments</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Assign matching interviewers to candidate assessment panel rounds.</p>
            </div>
            <div className="space-y-3.5">
              {[
                { title: 'System Design Evaluation Round', panelists: ['Amit Sharma (VP)', 'Siddharth (Principal Eng)'] },
                { title: 'Behavioral & Fitment Screen', panelists: ['Neha Gupta (HR Manager)'] }
              ].map((panel, i) => (
                <div key={i} className="p-4 border border-slate-150 bg-slate-50 space-y-2">
                  <h4 className="text-xs font-black text-slate-800 uppercase tracking-wide">{panel.title}</h4>
                  <div className="flex gap-2 flex-wrap pt-1">
                    {panel.panelists.map((panelist, key) => (
                      <span key={key} className="text-[10px] font-bold text-indigo-700 bg-indigo-50 border border-indigo-100 px-2.5 py-1" key={key}>{panelist}</span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Interview Slots':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Interviewer Availability Slots</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Configure and synchronize open calendars for candidate bookings.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Available Slots (Today)</p>
                <p className="text-xl font-black text-emerald-600 mt-1">04 Open Slots</p>
              </div>
              <div className="p-4 bg-slate-50 border border-slate-150 rounded-none">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Active Bookings</p>
                <p className="text-xl font-black text-[#0a1120] mt-1">12 Upcoming</p>
              </div>
            </div>
          </div>
        );

      case 'Feedback Collection':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Panel Feedback Collection Hub</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Monitor submitted interviewer scores and consolidate overall fitment indices.</p>
            </div>
            <div className="p-5 border border-dashed border-slate-200 text-center bg-slate-50">
              <p className="text-xs text-slate-400 font-bold">No feedback files pending aggregation.</p>
            </div>
          </div>
        );

      // 4. Onboarding Manager Tabs
      case 'Onboarding Process':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">New Hire Onboarding Pipeline</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Track pre-joining verification, hardware provisioning, and documentation verification.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {['Offered (2)', 'Verification (1)', 'Joined (4)'].map((step, idx) => (
                <div key={idx} className="p-4 border border-slate-150 bg-slate-50">
                  <h4 className="text-xs font-black text-[#0a1120] border-b border-slate-200 pb-2 uppercase tracking-wider">{step}</h4>
                  <div className="pt-3 space-y-2">
                    <div className="p-2.5 bg-white border border-slate-150 text-[10.5px] font-bold">
                      <p className="text-[#0a1120] font-black">Vivek Oberoi</p>
                      <p className="text-slate-400 text-[9.5px]">Joining: 15 May 2026</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );

      case 'Offer Letters':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Offer Letter Hub</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Issue, sign, and monitor statuses of candidate offer agreements.</p>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest bg-slate-50/70">
                    <th className="py-3 px-4">New Hire</th>
                    <th className="py-3 px-4">Compensation</th>
                    <th className="py-3 px-4">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-xs font-bold text-slate-700">
                  <tr className="hover:bg-slate-50/50">
                    <td className="py-3 px-4 text-slate-800 font-black">Vivek Oberoi</td>
                    <td className="py-3 px-4 text-slate-500">₹18,00,000 LPA</td>
                    <td className="py-3 px-4"><span className="px-2 py-0.5 bg-amber-50 text-amber-700 border border-amber-100 text-[10px] uppercase font-black">Sent (Pending Sign)</span></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        );

      case 'Document Collection':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">New Hire Document Verification</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Collect and audit KYC proofs, experience certificates, and bank detail confirmations.</p>
            </div>
            <div className="p-5 border border-dashed border-slate-200 text-center bg-slate-50">
              <p className="text-xs text-slate-400 font-bold">All documents for current cycle verified.</p>
            </div>
          </div>
        );

      case 'New Hire Tracker':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Pre-Joining Candidate Activity</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Track pre-joining check-ins and communication records.</p>
            </div>
            <div className="space-y-3.5">
              <div className="p-4 border border-slate-150 bg-slate-50 text-xs font-bold flex justify-between items-center">
                <div>
                  <p className="text-slate-800 font-black">Vivek Oberoi (Software Engineer)</p>
                  <p className="text-slate-400 mt-1">Completed background screening check-in.</p>
                </div>
                <span className="text-[9px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1">Verified</span>
              </div>
            </div>
          </div>
        );

      case 'Onboarding Checklist':
        return (
          <div className="bg-white border border-slate-100 rounded-none p-6 space-y-6 shadow-sm animate-fadeIn">
            <div>
              <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">New Hire Checklist Taskflows</h3>
              <p className="text-slate-400 text-xs font-semibold mt-1">Assign standard onboarding sequences (e.g., IT setup, email provision, team introductions).</p>
            </div>
            <div className="space-y-3.5">
              {[
                { task: 'Provision Corporate Email Account', dept: 'IT Systems' },
                { task: 'Dispatch Hardware Laptop Kit', dept: 'Operations Logistics' },
                { task: 'Conduct Day-1 HR Induction Briefing', dept: 'HR Team' }
              ].map((item, key) => (
                <div key={key} className="p-4 border border-slate-150 bg-slate-50 flex justify-between items-center">
                  <span className="text-xs font-black text-[#0a1120]">{item.task}</span>
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{item.dept}</span>
                </div>
              ))}
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  const handleUpdateProfile = (e) => {
    e.preventDefault();
    toast.success("Company profile updated successfully!");
    setCompany({ ...company, ...companyForm });
    localStorage.setItem('company', JSON.stringify({ ...company, ...companyForm }));
  };

  // Modern Checklist state handling
  const [tasks, setTasks] = useState([
    { id: 1, text: "Follow up for Receptionist Job & Interview Shortlisted Candidates", checked: true },
    { id: 2, text: "Meeting with Branch Manager & Discussion", checked: false },
    { id: 3, text: "Follow up for Command Area Manager- Review and Discussion", checked: false },
    { id: 4, text: "Meeting with Branch Manager & Discussion", checked: false }
  ]);

  const toggleTask = (id) => {
    setTasks(tasks.map(t => t.id === id ? { ...t, checked: !t.checked } : t));
    toast.success("Task updated!");
  };

  return (
    <div className="h-screen w-screen overflow-hidden bg-[#f8fafc] text-slate-700 flex employer-dashboard-root antialiased">
      {/* Custom Global Scrollbars for Entire Workspace */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900;950&display=swap');

        .employer-dashboard-root {
          font-family: 'Plus Jakarta Sans', -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Arial, sans-serif !important;
        }

        /* Thin elegant scrollbar for modern browsers */
        .custom-sidebar-scroll {
          scrollbar-width: thin;
          scrollbar-color: #243452 #0a1120;
        }
        .custom-sidebar-scroll::-webkit-scrollbar {
          width: 6px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-track {
          background: #0a1120;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb {
          background: #243452;
          border-radius: 20px;
        }
        .custom-sidebar-scroll::-webkit-scrollbar-thumb:hover {
          background: #fbc02d;
        }
        
        /* Smooth scrolling for cards list */
        .smooth-scroll {
          scrollbar-width: thin;
          scrollbar-color: #e2e8f0 transparent;
        }
        .smooth-scroll::-webkit-scrollbar {
          width: 4px;
        }
        .smooth-scroll::-webkit-scrollbar-thumb {
          background: #cbd5e1;
          border-radius: 4px;
        }
      `}</style>

      {/* 1. LEFT SIDEBAR (Compact Ultra-Premium dark navy workspace) */}
      <aside className={`${isSidebarOpen ? 'w-72' : 'w-20'} bg-[#0a1120] text-slate-300 flex flex-col justify-between sticky top-0 h-screen z-30 shadow-[4px_0_40px_rgba(10,17,32,0.12)] overflow-y-auto custom-sidebar-scroll transition-all duration-300`}>
        <div className="flex flex-col flex-1">

          {/* Brand Logo Card Box */}
          <div className="p-4 bg-white/95 backdrop-blur border border-slate-100/10 shadow-[0_4px_20px_rgba(0,0,0,0.15)] mx-4 mt-5 rounded-2xl transition-all duration-300 hover:scale-[1.02]">
            <div className={`flex items-center ${isSidebarOpen ? 'gap-3' : 'justify-center'}`}>
              <div className="w-10 h-10 bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] rounded-xl flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-amber-500/10 flex-shrink-0">
                N
              </div>
              {isSidebarOpen && (
                <div>
                  <span className="text-[#0a1120] text-[15px] font-black tracking-tight block">NextHire.in</span>
                  <span className="text-[9px] text-[#fbbf24] font-black uppercase tracking-widest block -mt-1">Corporate Suite</span>
                </div>
              )}
            </div>
          </div>

          {/* Company Selector Header Box */}
          <div className={`mt-4 mx-4 bg-[#111c34] p-3.5 rounded-2xl flex items-center justify-between border border-slate-700/30 cursor-pointer hover:bg-[#182645] transition-all duration-200 shadow-sm ${isSidebarOpen ? '' : 'justify-center'}`}>
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-8 h-8 bg-gradient-to-tr from-blue-600 to-indigo-500 rounded-xl flex items-center justify-center text-xs font-black text-amber-300 shadow-sm flex-shrink-0">
                {companyForm.name ? companyForm.name.charAt(0) : 'W'}
              </div>
              {isSidebarOpen && (
                <span className="text-xs font-bold text-slate-100 truncate">
                  {companyForm.name || 'WorknAI pvt .limited'}
                </span>
              )}
            </div>
            {isSidebarOpen && <ChevronDown size={14} className="text-slate-400 flex-shrink-0" />}
          </div>

          {/* Dynamic Sidebar Sections Menu Loop */}
          <div className="px-3 pt-5 space-y-5 pb-6">
            {(() => {
              const sidebarSections = [
                {
                  id: 'overview',
                  title: 'Overview',
                  items: [
                    { id: 'Dashboard', name: 'Dashboard', icon: Building2 },
                    { id: 'Notifications', name: 'Notifications', icon: Bell, badge: 12, badgeColor: 'bg-[#e74c3c]' },
                    { id: 'Chat', name: 'Chat', icon: MessageSquare, badge: 2, badgeColor: 'bg-[#2ecc71]' }
                  ]
                },
                {
                  id: 'hirings',
                  title: 'Manage Hirings',
                  items: [
                    { id: 'Create Job', name: 'Post a Job', icon: PlusCircle, check: () => hasPermission('create_jobs') || hasPermission('manage_jobs') },
                    { id: 'My Job Posts', name: 'My Job Posts', icon: Briefcase, check: () => hasPermission('view_jobs') || hasPermission('manage_jobs') },
                    { id: 'Applicants', name: 'Applicants', icon: Users, check: () => hasPermission('view_candidates') || hasPermission('review_candidates') },
                    { id: 'Interviews', name: 'Interviews', icon: Calendar, check: () => hasPermission('schedule_interviews') || hasPermission('conduct_interviews') },
                    { id: 'My Services', name: 'My Services', icon: CheckCircle2, check: () => hasPermission('manage_billing') }
                  ]
                },
                {
                  id: 'hr_admin',
                  title: 'HR Administration',
                  check: () => user.team_role === 'hr_admin' || user.role === 'hr_admin',
                  items: [
                    { id: 'Employee Management', name: 'Employee Management', icon: UserCheck },
                    { id: 'HR Documents', name: 'HR Documents', icon: UserCheck },
                    { id: 'Leave Policies', name: 'Leave Policies', icon: UserCheck },
                    { id: 'Payroll Overview', name: 'Payroll Overview', icon: UserCheck },
                    { id: 'Compliance', name: 'Compliance', icon: UserCheck },
                    { id: 'Analytics', name: 'Analytics', icon: UserCheck }
                  ]
                },
                {
                  id: 'recruitment',
                  title: 'Recruitment Coord',
                  check: () => user.team_role === 'recruitment_coordinator' || user.role === 'recruitment_coordinator',
                  items: [
                    { id: 'Candidate Pipeline', name: 'Candidate Pipeline', icon: Briefcase },
                    { id: 'Applications', name: 'Applications', icon: Briefcase },
                    { id: 'Recruitment Reports', name: 'Recruitment Reports', icon: Briefcase }
                  ]
                },
                {
                  id: 'interview',
                  title: 'Interview Coord',
                  check: () => user.team_role === 'interview_coordinator' || user.role === 'interview_coordinator',
                  items: [
                    { id: 'Panel Coordination', name: 'Panel Coordination', icon: Calendar },
                    { id: 'Interview Slots', name: 'Interview Slots', icon: Calendar },
                    { id: 'Feedback Collection', name: 'Feedback Collection', icon: Calendar }
                  ]
                },
                {
                  id: 'onboarding',
                  title: 'Onboarding Management',
                  check: () => user.team_role === 'onboarding_manager' || user.role === 'onboarding_manager',
                  items: [
                    { id: 'Onboarding Process', name: 'Onboarding Process', icon: UserCheck },
                    { id: 'Offer Letters', name: 'Offer Letters', icon: UserCheck },
                    { id: 'Document Collection', name: 'Document Collection', icon: UserCheck },
                    { id: 'New Hire Tracker', name: 'New Hire Tracker', icon: UserCheck },
                    { id: 'Onboarding Checklist', name: 'Onboarding Checklist', icon: UserCheck }
                  ]
                },
                {
                  id: 'settings',
                  title: 'Settings',
                  items: [
                    { id: 'My Profile', name: 'My Profile', icon: Settings },
                    { id: 'Team Management', name: 'Team Management', icon: Users, check: () => hasPermission('manage_team') },
                    { id: 'Billing & Plans', name: 'Billing & Plans', icon: CreditCard },
                    { id: 'Obligations', name: 'Obligations', icon: ShieldCheck }
                  ]
                }
              ];

              return sidebarSections.map((section) => {
                if (section.check && !section.check()) return null;

                const visibleItems = section.items.filter(item => !item.check || item.check());
                if (visibleItems.length === 0) return null;

                return (
                  <div key={section.id} className="space-y-1.5">
                    {isSidebarOpen && (
                      <span className="text-[9px] font-black tracking-widest text-slate-500 uppercase block px-3.5 mb-2.5 pl-1">
                        {section.title}
                      </span>
                    )}
                    <div className="space-y-0.5">
                      {visibleItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = activeTab === item.id;
                        return (
                          <button
                            key={item.id}
                            onClick={() => setActiveTab(item.id)}
                            className={`w-full py-2 rounded-xl flex items-center transition-all text-left border-none cursor-pointer ${isSidebarOpen ? 'px-3.5 gap-3 text-xs' : 'justify-center'
                              } ${isActive
                                ? 'bg-[#182645] text-[#fbbf24] font-black shadow-inner shadow-black/10'
                                : 'bg-transparent text-slate-400 hover:text-white hover:bg-[#111c34]/50'
                              }`}
                            title={!isSidebarOpen ? item.name : ''}
                          >
                            <Icon
                              size={15}
                              className={`${isActive ? 'text-[#fbbf24]' : 'text-slate-400'} flex-shrink-0`}
                            />
                            {isSidebarOpen && <span className="truncate">{item.name}</span>}
                            {isSidebarOpen && item.badge && (
                              <span className={`ml-auto ${item.badgeColor || 'bg-blue-500'} text-white text-[8px] font-black px-2 py-0.5 rounded-full`}>
                                {String(item.badge).padStart(2, '0')}
                              </span>
                            )}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                );
              });
            })()}

            {/* Standalone Collapsible Logout Button */}
            <div className="pt-2 border-t border-slate-800/40">
              <button
                onClick={handleLogout}
                className={`w-full py-2.5 rounded-xl flex items-center transition-all text-left border-none cursor-pointer bg-transparent text-slate-400 hover:text-red-400 hover:bg-red-950/20 ${isSidebarOpen ? 'px-3.5 gap-3 text-xs' : 'justify-center'
                  }`}
                title={!isSidebarOpen ? 'Logout' : ''}
              >
                <LogOut size={15} className="text-slate-400 flex-shrink-0" />
                {isSidebarOpen && <span>Logout</span>}
              </button>
            </div>
          </div>

        </div>

        {/* Try Demo & Help sticky footer */}
        <div className={`p-4 border-t border-[#1a2b49] bg-[#070c18] flex items-center justify-between text-xs text-slate-400 font-bold sticky bottom-0 z-20 ${isSidebarOpen ? '' : 'justify-center'}`}>
          {isSidebarOpen ? (
            <>
              <span className="hover:text-white cursor-pointer transition-all">Try Demo</span>
              <span className="hover:text-white cursor-pointer transition-all flex items-center gap-1.5">
                <HelpCircle size={13} />
                Need Help?
              </span>
            </>
          ) : (
            <HelpCircle size={15} className="hover:text-white cursor-pointer transition-all" title="Need Help?" />
          )}
        </div>
      </aside>

      {/* 2. MAIN WORKSPACE CONTENT */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto">

        {/* PREMIUM TOP HEADER */}
        <header className="h-20 bg-white/95 backdrop-blur-md px-6 flex items-center justify-between sticky top-0 z-20 shadow-[0_4px_30px_rgba(15,23,42,0.03)] border-b border-slate-100">
          <div className="flex items-center gap-3.5">
            {/* Elegant Sidebar Collapse/Expand Trigger */}
            <button
              type="button"
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="p-2.5 bg-slate-50 hover:bg-slate-100 text-[#0a1120] border border-slate-200/60 rounded-xl transition-all cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center shadow-sm"
              title={isSidebarOpen ? "Collapse Sidebar" : "Expand Sidebar"}
            >
              <Menu size={16} strokeWidth={2.5} />
            </button>

            <h1 className="text-[19px] font-black text-[#0a1120] tracking-tight">{activeTab}</h1>
            <div className="hidden md:flex items-center gap-1.5 text-[9px] font-black uppercase tracking-widest text-[#0e693a] bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-lg ml-3">
              <ShieldCheck size={11} className="text-emerald-600" />
              <span>Corporate Gate</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Elegant Post Job with bright golden gradient */}
            <button
              onClick={() => setActiveTab('Create Job')}
              className="py-3 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:brightness-105 hover:shadow-lg hover:shadow-amber-500/10 text-slate-900 font-black rounded-xl text-xs transition-all border-none cursor-pointer active:scale-95 uppercase tracking-wider"
            >
              Post A Job
            </button>
          </div>
        </header>

        {/* 3. SCROLLABLE WORKING CONTAINER */}
        <main className="p-8 flex-1 space-y-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.2 }}
            >

              {/* TAB 1: DASHBOARD VIEW (Absolute Visual Masterpiece) */}
              {activeTab === 'Dashboard' && (
                <div className="space-y-8">

                  {/* Grid splits into Overview, Tasks & Interviews */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* Column 1: Beautifully polished Overview stats */}
                    <div className="lg:col-span-3 space-y-4">
                      <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest block pl-1">Overview</h3>

                      {[
                        { title: 'Active Jobs', value: '50', bg: 'bg-amber-500/5 text-amber-500 border-amber-100/50', icon: Briefcase },
                        { title: 'New Applicants', value: '42', bg: 'bg-blue-500/5 text-blue-500 border-blue-100/50', icon: Users },
                        { title: 'Shortlisted Reviewed', value: '24', bg: 'bg-emerald-500/5 text-emerald-500 border-emerald-100/50', icon: UserCheck },
                        { title: 'Candidates Shortlisted', value: '12', bg: 'bg-purple-500/5 text-purple-500 border-purple-100/50', icon: CheckCircle2 }
                      ].map((item, idx) => {
                        const Icon = item.icon;
                        return (
                          <div
                            key={idx}
                            className="bg-white p-5 rounded-none border border-slate-100 shadow-[0_4px_24px_rgba(15,23,42,0.015)] hover:shadow-[0_8px_30px_rgba(15,23,42,0.04)] hover:-translate-y-0.5 transition-all duration-300 flex items-center gap-4 group cursor-pointer"
                          >
                            <div className={`w-12 h-12 rounded-none ${item.bg} border flex items-center justify-center font-bold shadow-sm group-hover:scale-105 transition-transform`}>
                              <Icon size={20} />
                            </div>
                            <div>
                              <p className="text-2xl font-black text-[#0a1120] leading-none tracking-tight">{item.value}</p>
                              <p className="text-[10px] text-slate-400 font-extrabold mt-2 uppercase tracking-wider">{item.title}</p>
                            </div>
                          </div>
                        );
                      })}
                    </div>

                    {/* Column 2: Polished Tasks Tracker */}
                    <div className="lg:col-span-4 bg-white p-6 rounded-none border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.02)] space-y-5">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Today's Tasks</h3>
                      </div>

                      {/* Filter Tabs */}
                      <div className="flex gap-1 border-b border-slate-100 pb-3">
                        {['All Tasks', 'Completed', 'Snoozed'].map((taskTab, i) => (
                          <button
                            key={i}
                            className={`px-3.5 py-1.5 rounded-none text-[10px] font-black border-none cursor-pointer transition-all ${i === 0 ? 'bg-blue-50 text-blue-600 font-extrabold shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                              }`}
                          >
                            {taskTab}
                          </button>
                        ))}
                      </div>

                      {/* Tasks list */}
                      <div className="space-y-3.5 max-h-[300px] overflow-y-auto pr-1 smooth-scroll">
                        {tasks.map((task) => (
                          <div
                            key={task.id}
                            onClick={() => toggleTask(task.id)}
                            className="flex items-start gap-3.5 cursor-pointer group p-2 hover:bg-slate-50/80 rounded-none transition-colors border border-transparent hover:border-slate-100"
                          >
                            <div className={`w-4 h-4 rounded-none border flex items-center justify-center mt-0.5 transition-all ${task.checked ? 'bg-blue-600 border-blue-600 text-white shadow-sm' : 'border-slate-300 group-hover:border-blue-500 bg-white'
                              }`}>
                              {task.checked && <Check size={11} strokeWidth={3} />}
                            </div>
                            <span className={`text-[11.5px] font-bold leading-relaxed transition-all ${task.checked ? 'line-through text-slate-400' : 'text-[#0a1120] group-hover:text-blue-600'
                              }`}>
                              {task.text}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Column 3: Upcoming Interviews */}
                    <div className="lg:col-span-5 bg-white p-6 rounded-none border border-slate-100 shadow-[0_8px_30px_rgba(15,23,42,0.02)] space-y-5">
                      <div className="flex justify-between items-center">
                        <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-widest pl-1">Upcoming Interviews</h3>
                      </div>

                      {/* Segment tabs */}
                      <div className="flex gap-1 border-b border-slate-100 pb-3 overflow-x-auto">
                        {['Today', 'Upcoming', 'Completed', 'Due'].map((intTab, i) => (
                          <button
                            key={i}
                            className={`px-3.5 py-1.5 rounded-none text-[10px] font-black border-none cursor-pointer transition-all ${i === 0 ? 'bg-blue-50 text-blue-600 font-extrabold shadow-sm' : 'bg-transparent text-slate-400 hover:text-slate-600'
                              }`}
                          >
                            {intTab}
                          </button>
                        ))}
                      </div>

                      {/* Interview list */}
                      <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1 smooth-scroll">
                        {[
                          { name: 'Ravichandra Iyer', role: 'Workshop Manager', time: 'At 09:45 AM', initial: 'R' },
                          { name: 'Ramkrishna Patel', role: 'Support Representative', time: 'At 10:45 AM', initial: 'R' },
                          { name: 'Divya Joshi', role: 'Workshop Manager', time: 'At 09:45 AM', initial: 'D' },
                          { name: 'Rahul Jha', role: 'Service Executive', time: 'At 09:45 AM', initial: 'R' },
                          { name: 'Prashant Sharma', role: 'Workshop Manager', time: 'At 09:45 AM', initial: 'P' }
                        ].map((item, idx) => (
                          <div key={idx} className="flex items-center justify-between gap-4 p-2.5 bg-slate-50/40 hover:bg-white border border-transparent hover:border-slate-100 hover:shadow-sm rounded-none transition-all">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 bg-gradient-to-tr from-[#1e293b] to-[#475569] text-white shadow-sm rounded-none flex items-center justify-center font-bold text-[11px]">
                                {item.initial}
                              </div>
                              <div>
                                <p className="text-[12px] font-black text-[#0a1120] leading-none">{item.name}</p>
                                <p className="text-[10px] text-slate-400 font-extrabold mt-1.5 flex items-center gap-1 uppercase tracking-wider">
                                  <span>For {item.role}</span>
                                </p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-slate-400 whitespace-nowrap bg-white border border-slate-150 px-2.5 py-1 rounded-none shadow-sm">{item.time}</span>
                          </div>
                        ))}
                      </div>
                    </div>

                  </div>

                  {/* BOTTOM TABLE: HIGH READABILITY RECENTLY POSTED JOBS */}
                  <div className="bg-white border border-slate-100 rounded-none p-6 space-y-5 shadow-[0_8px_30px_rgba(15,23,42,0.015)]">
                    <div className="flex justify-between items-center border-b border-slate-50 pb-3">
                      <h3 className="text-sm font-black text-[#0a1120]">Recently Posted Jobs</h3>
                    </div>

                    <div className="space-y-4">
                      {jobs.map((job) => (
                        <div
                          key={job.id}
                          className="p-5 bg-slate-50/30 hover:bg-white rounded-none border border-slate-100 hover:shadow-xl hover:border-slate-200 transition-all duration-300 flex flex-col md:flex-row md:items-center justify-between gap-6"
                        >

                          {/* Title column */}
                          <div className="space-y-2">
                            <div className="flex items-center gap-2">
                              <span className="w-2.5 h-2.5 rounded-none bg-emerald-500 animate-pulse"></span>
                              <h4 className="text-sm font-black text-[#0a1120] tracking-tight">{job.title}</h4>
                            </div>
                            <p className="text-[10px] text-slate-400 font-extrabold px-4 uppercase tracking-wider flex items-center gap-1.5">
                              <MapPin size={11} className="text-slate-300" />
                              {job.location}
                            </p>
                            <p className="text-[9px] text-slate-400 font-bold px-4">
                              Created: {job.date} • Expires: {job.date}
                            </p>
                          </div>

                          {/* Data Columns Pills */}
                          <div className="flex flex-wrap gap-4 items-center">
                            {[
                              { label: 'Applicants', val: job.applicants, border: 'border-slate-200 bg-slate-50/20', text: 'text-slate-700' },
                              { label: 'New', val: job.newApplicants, border: 'border-blue-200 bg-blue-50/20', text: 'text-blue-600' },
                              { label: 'Reviewed', val: job.reviewed, border: 'border-amber-200 bg-amber-50/20', text: 'text-amber-600' },
                              { label: 'Rejected', val: job.rejected, border: 'border-red-100 bg-red-50/10', text: 'text-red-500' },
                              { label: 'Hired', val: job.hired, border: 'border-emerald-200 bg-emerald-50/20', text: 'text-emerald-600 font-black shadow-inner shadow-emerald-500/5' }
                            ].map((stat, key) => (
                              <div key={key} className="text-center min-w-[55px]">
                                <p className="text-[8px] text-slate-400 font-black uppercase tracking-widest block mb-1.5">{stat.label}</p>
                                <span className={`border ${stat.border} ${stat.text} font-black text-xs px-3 py-1.5 rounded-none shadow-sm inline-block w-full text-center`}>
                                  {stat.val < 10 ? `0${stat.val}` : stat.val}
                                </span>
                              </div>
                            ))}
                          </div>

                          {/* Action elements */}
                          <div className="flex items-center gap-4 justify-end">
                            <button className="text-xs font-black text-blue-600 hover:text-blue-800 hover:underline bg-transparent border-none cursor-pointer">
                              View Applicants
                            </button>
                            <button className="p-2 text-slate-400 hover:text-slate-600 rounded-none hover:bg-slate-200/50 bg-transparent border-none cursor-pointer transition-colors">
                              <MoreVertical size={16} />
                            </button>
                          </div>

                        </div>
                      ))}
                    </div>
                  </div>

                </div>
              )}

              {/* TAB 2: COMPANY PROFILE EDIT */}
              {activeTab === 'My Profile' && (
                <div className="max-w-3xl bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-sm animate-fadeIn">
                  <div>
                    <h3 className="text-base font-black text-[#0a1120] mb-0.5">Company Corporate Profile</h3>
                    <p className="text-slate-400 text-xs font-bold">Maintain correct business parameters visible to high-quality tech candidates.</p>
                  </div>

                  <form onSubmit={handleUpdateProfile} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Official Company Name</label>
                        <input
                          type="text"
                          value={companyForm.name}
                          onChange={(e) => setCompanyForm({ ...companyForm, name: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Website</label>
                        <input
                          type="text"
                          value={companyForm.website}
                          onChange={(e) => setCompanyForm({ ...companyForm, website: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">GST / CIN Number</label>
                        <input
                          type="text"
                          value={companyForm.gstin}
                          onChange={(e) => setCompanyForm({ ...companyForm, gstin: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-100 border border-slate-200/80 rounded-xl outline-none text-xs font-bold text-slate-400 transition-all cursor-not-allowed"
                          disabled
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Contact Phone</label>
                        <input
                          type="text"
                          value={companyForm.phone}
                          onChange={(e) => setCompanyForm({ ...companyForm, phone: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all"
                        />
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Corporate Office Address</label>
                      <input
                        type="text"
                        value={companyForm.address}
                        onChange={(e) => setCompanyForm({ ...companyForm, address: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Company Overview</label>
                      <textarea
                        rows={4}
                        value={companyForm.description}
                        onChange={(e) => setCompanyForm({ ...companyForm, description: e.target.value })}
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold text-slate-700 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3.5 px-6 bg-[#0a1120] hover:bg-[#182645] text-white font-bold rounded-xl transition-all text-xs cursor-pointer border-none shadow-sm"
                    >
                      Update Profile Info
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 3: CREATE NEW JOB */}
              {activeTab === 'Create Job' && (
                <div className="max-w-2xl bg-white border border-slate-100 rounded-3xl p-8 space-y-6 shadow-sm animate-fadeIn">
                  <div>
                    <h3 className="text-base font-black text-[#0a1120] mb-0.5">Create Job Opportunity</h3>
                    <p className="text-slate-400 text-xs font-bold">Publish your corporate tech requirement to thousands of verified candidates instantly.</p>
                  </div>

                  <form onSubmit={handleCreateJob} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Job Title</label>
                        <input
                          type="text"
                          required
                          value={jobForm.title}
                          onChange={(e) => setJobForm({ ...jobForm, title: e.target.value })}
                          placeholder="e.g. Senior Backend Engineer"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Department</label>
                        <input
                          type="text"
                          required
                          value={jobForm.department}
                          onChange={(e) => setJobForm({ ...jobForm, department: e.target.value })}
                          placeholder="e.g. Engineering"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Location Type</label>
                        <select
                          value={jobForm.locationType}
                          onChange={(e) => setJobForm({ ...jobForm, locationType: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-700 transition-all cursor-pointer"
                        >
                          <option value="remote">Remote</option>
                          <option value="hybrid">Hybrid</option>
                          <option value="onsite">Onsite</option>
                        </select>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Salary Budget / Year</label>
                        <input
                          type="text"
                          value={jobForm.salaryRange}
                          onChange={(e) => setJobForm({ ...jobForm, salaryRange: e.target.value })}
                          placeholder="e.g. 18LPA - 24LPA"
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Experience Level</label>
                        <select
                          value={jobForm.experience}
                          onChange={(e) => setJobForm({ ...jobForm, experience: e.target.value })}
                          className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-700 transition-all cursor-pointer"
                        >
                          <option value="Entry Level">Entry Level</option>
                          <option value="Mid-Senior Level">Mid-Senior Level</option>
                          <option value="Senior Executive">Senior Executive</option>
                        </select>
                      </div>
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Skills Required (Comma separated)</label>
                      <input
                        type="text"
                        value={jobForm.skillsRequired}
                        onChange={(e) => setJobForm({ ...jobForm, skillsRequired: e.target.value })}
                        placeholder="Node.js, Express, React, TypeScript, Docker"
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-bold text-slate-800 transition-all placeholder:text-slate-400"
                      />
                    </div>

                    <div className="space-y-1">
                      <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest ml-1">Detailed Job Description</label>
                      <textarea
                        rows={6}
                        required
                        value={jobForm.description}
                        onChange={(e) => setJobForm({ ...jobForm, description: e.target.value })}
                        placeholder="Detail the roles, day-to-day work, and candidate criteria..."
                        className="w-full px-4 py-3 bg-slate-50 border border-slate-200 rounded-xl outline-none focus:border-blue-500 focus:bg-white text-xs font-semibold text-slate-700 transition-all placeholder:text-slate-400 resize-none leading-relaxed"
                      />
                    </div>

                    <button
                      type="submit"
                      className="py-3 px-5 bg-[#0a1120] hover:bg-[#182645] text-white font-bold rounded-xl transition-all text-xs cursor-pointer border-none shadow-sm"
                    >
                      Publish Opportunity
                    </button>
                  </form>
                </div>
              )}

              {/* TAB 4: MY JOB POSTS */}
              {activeTab === 'My Job Posts' && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 overflow-hidden space-y-5 shadow-sm animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-black text-[#0a1120]">My Job Opportunities</h3>
                    <p className="text-slate-400 text-xs font-bold mt-0.5">Toggle job statuses, edit specs, and monitor matching candidate feeds.</p>
                  </div>

                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse">
                      <thead>
                        <tr className="border-b border-slate-100 text-slate-400 text-[10px] font-black uppercase tracking-widest">
                          <th className="pb-4 pl-4">Job Title</th>
                          <th className="pb-4">Department</th>
                          <th className="pb-4">Location</th>
                          <th className="pb-4">Applicants</th>
                          <th className="pb-4">Date Posted</th>
                          <th className="pb-4 pr-4 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {jobs.map((job) => (
                          <tr key={job.id} className="text-xs font-bold hover:bg-slate-50/50 transition-all">
                            <td className="py-4 pl-4 text-slate-900 font-extrabold">{job.title}</td>
                            <td className="py-4 text-slate-600">{job.department}</td>
                            <td className="py-4 text-slate-500">{job.location}</td>
                            <td className="py-4">
                              <span className="bg-slate-50 text-slate-600 px-2.5 py-1 rounded-md border border-slate-100 text-[10px]">
                                {job.applicants} Applicants
                              </span>
                            </td>
                            <td className="py-4 text-slate-400">{job.date}</td>
                            <td className="py-4 pr-4 text-right space-x-2">
                              <button className="text-xs font-black text-blue-600 hover:underline bg-transparent border-none cursor-pointer">View Applicants</button>
                              <button className="text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer text-xs font-bold">Pause</button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* TAB 5: APPLICANTS */}
              {activeTab === 'Applicants' && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 shadow-sm animate-fadeIn">
                  <div>
                    <h3 className="text-sm font-black text-[#0a1120]">Verified ATS Candidate Screening</h3>
                    <p className="text-slate-400 text-xs font-bold mt-0.5">Filter matching high-fidelity developer profiles matched by the NextHire AI parser.</p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {[
                      { name: 'Aditya Deshmukh', role: 'Full Stack Engineer', match: '96%', skills: ['Node.js', 'React', 'MongoDB', 'Docker'], summary: 'Highly motivated Javascript/TS builder with 4 years of scalable SaaS backend experience.' },
                      { name: 'Sneha Patel', role: 'UX/UI Product Designer', match: '89%', skills: ['Figma', 'Prototyping', 'Design Systems', 'React'], summary: 'Product designer focusing on developer tooling dashboards and clean enterprise visuals.' },
                      { name: 'Rohan Shinde', role: 'DevOps & Systems Lead', match: '85%', skills: ['Kubernetes', 'AWS', 'CI/CD Pipelines', 'Linux'], summary: 'Lead platform administrator skilled in provisioning cloud structures and robust failover services.' }
                    ].map((candidate, i) => (
                      <div key={i} className="bg-slate-50/40 border border-slate-150 rounded-3xl p-6 space-y-4 hover:border-slate-300 hover:bg-white transition-all flex flex-col justify-between shadow-[0_2px_12px_rgba(148,163,184,0.01)]">
                        <div className="space-y-3">
                          <div className="flex justify-between items-start">
                            <div className="flex items-center gap-3">
                              <div className="w-12 h-12 bg-white border border-slate-100 shadow-sm text-slate-600 font-extrabold rounded-xl flex items-center justify-center">
                                {candidate.name.charAt(0)}
                              </div>
                              <div>
                                <h4 className="text-xs font-black text-slate-800">{candidate.name}</h4>
                                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{candidate.role}</p>
                              </div>
                            </div>
                            <span className="text-[10px] font-black text-emerald-700 bg-emerald-50 border border-emerald-100 px-2.5 py-1 rounded-lg">
                              {candidate.match} Match Rate
                            </span>
                          </div>

                          <p className="text-xs text-slate-500 leading-relaxed font-bold">
                            {candidate.summary}
                          </p>

                          <div className="flex flex-wrap gap-1.5 pt-1">
                            {candidate.skills.map((skill, key) => (
                              <span key={key} className="text-[9px] font-bold text-slate-600 bg-white border border-slate-100 px-2 py-0.5 rounded-md">
                                {skill}
                              </span>
                            ))}
                          </div>
                        </div>

                        <div className="pt-4 border-t border-slate-100 flex justify-between gap-3">
                          <button className="flex-1 py-2 bg-white hover:bg-slate-50 text-slate-600 text-xs font-bold rounded-xl transition-all cursor-pointer border border-slate-200">
                            Download Resume
                          </button>
                          <button className="flex-1 py-2 bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold rounded-xl transition-all cursor-pointer border-none shadow-sm">
                            Schedule Technical Round
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 6: NOTIFICATIONS */}
              {activeTab === 'Notifications' && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 shadow-sm max-w-2xl animate-fadeIn">
                  <h3 className="text-sm font-black text-[#0a1120]">Alert & Event Feeds</h3>
                  <div className="space-y-3">
                    {[
                      "Aditya Deshmukh submitted a proposal for Workshop Manager",
                      "GST documents audited and verified by Trust & Safety admin",
                      "Sneha Patel RSVP'd 'Confirmed' to System Design Evaluation Round",
                      "Ramkrishna Ravibhai Patel submitted a review request"
                    ].map((notif, idx) => (
                      <div key={idx} className="p-3 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-between text-xs font-bold text-slate-700">
                        <span>{notif}</span>
                        <span className="text-[9px] text-slate-400">Just now</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 7: CHAT */}
              {activeTab === 'Chat' && (
                <div className="bg-white border border-slate-100 rounded-3xl p-6 space-y-5 shadow-sm max-w-xl text-center py-12 animate-fadeIn">
                  <MessageSquare size={36} className="mx-auto text-blue-500 mb-3 animate-bounce" />
                  <h3 className="text-base font-black text-[#0a1120]">Candidate Messenger</h3>
                  <p className="text-xs text-slate-400 font-bold max-w-xs mx-auto">Instant real-time communication channel to coordinate with shortlisted applicants.</p>
                  <button className="mt-4 px-4 py-2 bg-[#0a1120] text-white text-xs font-bold rounded-xl border-none cursor-pointer shadow-sm">
                    Open Messenger
                  </button>
                </div>
              )}

              {/* TAB 8: OBLIGATIONS */}
              {activeTab === 'Obligations' && (
                <div className="bg-white border border-slate-100 rounded-none p-6 space-y-5 shadow-sm max-w-md text-center py-12 animate-fadeIn">
                  <ShieldCheck size={36} className="mx-auto text-emerald-500 mb-3" />
                  <h3 className="text-base font-black text-[#0a1120]">Compliance & Obligations</h3>
                  <p className="text-xs text-slate-400 font-bold leading-relaxed">Your credentials and GST documentation are fully vetted and approved. No actions are required.</p>
                </div>
              )}

              {/* TAB 9: TEAM MANAGEMENT */}
              {activeTab === 'Team Management' && (
                <div className="bg-white border border-slate-100 rounded-none p-6 space-y-5 shadow-sm animate-fadeIn">
                  <TeamManagement />
                </div>
              )}

              {/* TAB 10: BILLING & PLANS */}
              {activeTab === 'Billing & Plans' && (
                <BillingPlans company={company} setCompany={setCompany} />
              )}

              {/* DYNAMIC NEW ROLE CUSTOM VIEWS */}
              {renderCustomATSView()}

            </motion.div>
          </AnimatePresence>
        </main>
      </div>

    </div>
  );
};

export default EmployerDashboard;
