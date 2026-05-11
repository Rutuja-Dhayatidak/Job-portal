import React, { useEffect, Suspense, lazy } from 'react'
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom'
import Lenis from 'lenis'
import './App.css'

// Lazy Load Components
const Navbar = lazy(() => import('./components/Navbar'))
const Hero = lazy(() => import('./components/Hero'))
const Footer = lazy(() => import('./components/Footer'))
const CompanyMarquee = lazy(() => import('./components/CompanyMarquee'))
const Categories = lazy(() => import('./components/Categories'))
const FeaturedJobs = lazy(() => import('./components/FeaturedJobs'))
const HowItWorks = lazy(() => import('./components/HowItWorks'))
const AboutUs = lazy(() => import('./components/AboutUs'))
const Testimonials = lazy(() => import('./components/Testimonials'))
const BrandCollaboration = lazy(() => import('./components/BrandCollaboration'))
const Pricing = lazy(() => import('./components/Pricing'))
const JobCTA = lazy(() => import('./components/JobCTA'))
const CareerTips = lazy(() => import('./components/CareerTips'))
const AuthPage = lazy(() => import('./components/AuthPage'))
const Dashboard = lazy(() => import('./components/dashboard/Dashboard'))
const Profile = lazy(() => import('./pages/Profile'))
const EditProfile = lazy(() => import('./pages/EditProfile'))
const CompanyRegister = lazy(() => import('./components/CompanyRegister'))
const CompanyLogin = lazy(() => import('./company_employ/CompanyLogin'))
const EmployerDashboard = lazy(() => import('./company_employ/EmployerDashboard'))
const EmployerProtectedRoute = lazy(() => import('./company_employ/EmployerProtectedRoute'))
const ActivateAdmin = lazy(() => import('./pages/ActivateAdmin'))
const CompanyVerifyEmail = lazy(() => import('./components/CompanyVerifyEmail'))
const AcceptInvite = lazy(() => import('./company_employ/AcceptInvite'))

// Super Admin Components
const AdminLayout = lazy(() => import('./SuperAdmin/layout/AdminLayout'))
const ProtectedRoute = lazy(() => import('./SuperAdmin/components/ProtectedRoute'))
const AdminDashboard = lazy(() => import('./SuperAdmin/pages/Dashboard'))
const AdminCandidates = lazy(() => import('./SuperAdmin/pages/Candidates'))
const AdminCompanies = lazy(() => import('./SuperAdmin/pages/Companies'))
const AdminJobs = lazy(() => import('./SuperAdmin/pages/Jobs'))
const AdminManagement = lazy(() => import('./SuperAdmin/pages/AdminManagement'))
const AdminRBAC = lazy(() => import('./SuperAdmin/pages/RBAC'))
const AdminAuditLogs = lazy(() => import('./SuperAdmin/pages/AuditLogs'))
const AdminPlans = lazy(() => import('./SuperAdmin/pages/Plans'))

// Platform Admin Components
const PlatformAdminLayout = lazy(() => import('./AdminPanel/layout/AdminLayout'))
const PlatformDashboard = lazy(() => import('./AdminPanel/pages/Dashboard'))
const PlatformUsers = lazy(() => import('./AdminPanel/pages/Users'))
const PlatformCompanies = lazy(() => import('./AdminPanel/pages/Companies'))
const PlatformJobs = lazy(() => import('./AdminPanel/pages/Jobs'))
const PlatformTickets = lazy(() => import('./AdminPanel/pages/Tickets'))

// Finance Admin Components
const FinanceLayout = lazy(() => import('./FinanceAdmin/FinanceLayout'))
const FinanceProtectedRoute = lazy(() => import('./FinanceAdmin/components/ProtectedRoute'))
const FinanceDashboard = lazy(() => import('./FinanceAdmin/Dashboard'))
const FinanceRevenue = lazy(() => import('./FinanceAdmin/RevenueAnalytics'))
const FinancePlans = lazy(() => import('./FinanceAdmin/SubscriptionPlans'))
const FinancePayments = lazy(() => import('./FinanceAdmin/EmployerPayments'))
const FinancePricing = lazy(() => import('./FinanceAdmin/PricingCharges'))
const FinanceRefunds = lazy(() => import('./FinanceAdmin/RefundManagement'))
const FinanceReports = lazy(() => import('./FinanceAdmin/FinancialReports'))
const FinanceInvoices = lazy(() => import('./FinanceAdmin/InvoicesBilling'))

// Ops Admin Components
const OpsLayout = lazy(() => import('./OpsAdmin/OpsLayout'))
const OpsProtectedRoute = lazy(() => import('./OpsAdmin/components/OpsProtectedRoute'))
const OpsDashboard = lazy(() => import('./OpsAdmin/Dashboard'))
const OpsUsers = lazy(() => import('./OpsAdmin/UserManagement'))
const OpsCompanies = lazy(() => import('./OpsAdmin/CompanyManagement'))
const OpsJobs = lazy(() => import('./OpsAdmin/JobManagement'))
const OpsModeration = lazy(() => import('./OpsAdmin/ContentModeration'))
const OpsSupport = lazy(() => import('./OpsAdmin/SupportTickets'))
const OpsLogs = lazy(() => import('./OpsAdmin/ActivityLogs'))

// Trust & Safety Components
const TrustLayout = lazy(() => import('./TrustSafety/TrustLayout'))
const TrustProtectedRoute = lazy(() => import('./TrustSafety/components/TrustProtectedRoute'))
const TrustDashboard = lazy(() => import('./TrustSafety/Dashboard'))
const TrustReports = lazy(() => import('./TrustSafety/ReportsFlags'))
const TrustModeration = lazy(() => import('./TrustSafety/ModerationQueue'))
const TrustFraud = lazy(() => import('./TrustSafety/FraudRiskAnalysis'))
const TrustActions = lazy(() => import('./TrustSafety/EnforcementActions'))
const TrustKYC = lazy(() => import('./TrustSafety/KYCVerification'))
const TrustBlocked = lazy(() => import('./TrustSafety/BlockedAccounts'))
const TrustLogs = lazy(() => import('./TrustSafety/AuditLogs'))
const TrustCompanyVerification = lazy(() => import('./TrustSafety/CompanyVerification'))

// Moderator Components
const ModeratorDashboard = lazy(() => import('./Moderator/Dashboard'))
const ModeratorReports = lazy(() => import('./Moderator/Reports'))
const UserModeration = lazy(() => import('./Moderator/UserModeration'))
const JobModeration = lazy(() => import('./Moderator/JobModeration'))
const ActivityLogs = lazy(() => import('./Moderator/ActivityLogs'))
const ModeratorRoutes = lazy(() => import('./routes/ModeratorRoutes'))
const ModeratorLayout = lazy(() => import('./Moderator/ModeratorLayout'))

// Support Admin Components
const SupportLayout = lazy(() => import('./SupportAdmin/SupportLayout'))
const SupportDashboard = lazy(() => import('./SupportAdmin/Dashboard'))
const SupportTickets = lazy(() => import('./SupportAdmin/Tickets'))
const ChatSupport = lazy(() => import('./SupportAdmin/ChatSupport'))
const SupportUsers = lazy(() => import('./SupportAdmin/Users'))
const SupportFAQ = lazy(() => import('./SupportAdmin/FAQ'))
const SupportSettings = lazy(() => import('./SupportAdmin/Settings'))

// Sales Panel Components
const SalesLayout = lazy(() => import('./sales-panel/layouts/SalesLayout'))
const SalesProtectedRoute = lazy(() => import('./sales-panel/components/SalesProtectedRoute'))
const SalesDashboard = lazy(() => import('./sales-panel/pages/Dashboard'))
const SalesLeads = lazy(() => import('./sales-panel/pages/Leads'))
const SalesAddLead = lazy(() => import('./sales-panel/pages/AddLead'))
const SalesFollowUps = lazy(() => import('./sales-panel/pages/FollowUps'))
const SalesCustomers = lazy(() => import('./sales-panel/pages/Customers'))
const SalesTasks = lazy(() => import('./sales-panel/pages/Tasks'))
const SalesAttendance = lazy(() => import('./sales-panel/pages/Attendance'))
const SalesTarget = lazy(() => import('./sales-panel/pages/Target'))
const SalesPerformance = lazy(() => import('./sales-panel/pages/Performance'))
const SalesReports = lazy(() => import('./sales-panel/pages/Reports'))
const SalesNotifications = lazy(() => import('./sales-panel/pages/Notifications'))
const SalesProfile = lazy(() => import('./sales-panel/pages/Profile'))
const SalesSettings = lazy(() => import('./sales-panel/pages/Settings'))
const SalesNotFound = lazy(() => import('./sales-panel/pages/NotFound'))

import { Toaster } from 'react-hot-toast'

const LoadingFallback = () => (
  <div className="min-h-screen flex items-center justify-center bg-white">
    <div className="flex flex-col items-center gap-4">
      <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-500 rounded-full animate-spin"></div>
      <p className="text-slate-400 font-bold text-xs uppercase tracking-widest animate-pulse">Loading NextHire...</p>
    </div>
  </div>
);

function LandingPage() {
  return (
    <>
      <Navbar />
      <Hero />
      <CompanyMarquee />
      <Categories />
      <FeaturedJobs />
      <HowItWorks />
      <AboutUs />
      <Testimonials />
      <BrandCollaboration />
      <Pricing />
      <JobCTA />
      <CareerTips />
      <Footer />
    </>
  )
}

function LenisProvider({ children }) {
  const location = useLocation()

  useEffect(() => {
    if (location.pathname === '/') {
      const lenis = new Lenis()
      let frameId

      function raf(time) {
        lenis.raf(time)
        frameId = requestAnimationFrame(raf)
      }

      requestAnimationFrame(raf)

      return () => {
        cancelAnimationFrame(frameId)
        lenis.destroy()
      }
    }
  }, [location.pathname])

  return children
}

function App() {
  return (
    <Router>
      <LenisProvider>
        <Toaster position="top-center" />
        <main className="min-h-screen">
          <Suspense fallback={<LoadingFallback />}>
          <Routes>
            <Route path="/" element={<LandingPage />} />
            <Route path="/register" element={<AuthPage />} />
            <Route path="/login" element={<AuthPage />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/profile/edit" element={<EditProfile />} />
            <Route path="/company/register" element={<CompanyRegister />} />
            <Route path="/company/login" element={<CompanyLogin />} />
            <Route path="/employer/dashboard" element={
              <EmployerProtectedRoute>
                <EmployerDashboard />
              </EmployerProtectedRoute>
            } />
            <Route path="/employer/team" element={
              <EmployerProtectedRoute>
                <EmployerDashboard initialTab="Team Management" />
              </EmployerProtectedRoute>
            } />
            <Route path="/employer/billing-plans" element={
              <EmployerProtectedRoute>
                <EmployerDashboard initialTab="Billing & Plans" />
              </EmployerProtectedRoute>
            } />
            <Route path="/employer/accept-invite" element={<AcceptInvite />} />
            <Route path="/activate-admin" element={<ActivateAdmin />} />
            <Route path="/company/verify-email/:token" element={<CompanyVerifyEmail />} />

            {/* Super Admin Routes */}
            <Route path="/super-admin" element={
              <ProtectedRoute>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route path="dashboard" element={<AdminDashboard />} />
              <Route path="candidates" element={<AdminCandidates />} />
              <Route path="admins" element={<AdminManagement />} />
              <Route path="companies" element={<AdminCompanies />} />
              <Route path="jobs" element={<AdminJobs />} />
              <Route path="rbac" element={<AdminRBAC />} />
              <Route path="audit" element={<AdminAuditLogs />} />
              <Route path="plans" element={<AdminPlans />} />
            </Route>

            {/* Platform Admin Routes */}
            <Route path="/admin" element={<PlatformAdminLayout />}>
              <Route path="dashboard" element={<PlatformDashboard />} />
              <Route path="users" element={<PlatformUsers />} />
              <Route path="companies" element={<PlatformCompanies />} />
              <Route path="jobs" element={<PlatformJobs />} />
              <Route path="tickets" element={<PlatformTickets />} />
            </Route>

            {/* Finance Admin Routes */}
            <Route path="/finance" element={
              <FinanceProtectedRoute>
                <FinanceLayout />
              </FinanceProtectedRoute>
            }>
              <Route path="dashboard" element={<FinanceDashboard />} />
              <Route path="revenue" element={<FinanceRevenue />} />
              <Route path="plans" element={<FinancePlans />} />
              <Route path="payments" element={<FinancePayments />} />
              <Route path="pricing" element={<FinancePricing />} />
              <Route path="refunds" element={<FinanceRefunds />} />
              <Route path="invoices" element={<FinanceInvoices />} />
              <Route path="reports" element={<FinanceReports />} />
            </Route>

            {/* Ops Admin Routes */}
            <Route path="/ops" element={
              <OpsProtectedRoute>
                <OpsLayout />
              </OpsProtectedRoute>
            }>
              <Route path="dashboard" element={<OpsDashboard />} />
              <Route path="users" element={<OpsUsers />} />
              <Route path="companies" element={<OpsCompanies />} />
              <Route path="jobs" element={<OpsJobs />} />
              <Route path="moderation" element={<OpsModeration />} />
              <Route path="support" element={<OpsSupport />} />
              <Route path="logs" element={<OpsLogs />} />
            </Route>

            {/* Trust & Safety Routes */}
            <Route path="/trust" element={
              <TrustProtectedRoute>
                <TrustLayout />
              </TrustProtectedRoute>
            }>
              <Route path="dashboard" element={<TrustDashboard />} />
              <Route path="reports" element={<TrustReports />} />
              <Route path="moderation" element={<TrustModeration />} />
              <Route path="fraud" element={<TrustFraud />} />
              <Route path="actions" element={<TrustActions />} />
              <Route path="kyc" element={<TrustKYC />} />
              <Route path="blocked" element={<TrustBlocked />} />
              <Route path="logs" element={<TrustLogs />} />
              <Route path="company-verification" element={<TrustCompanyVerification />} />
            </Route>

            {/* Industry Moderator Panel */}
            <Route element={<ModeratorRoutes />}>
              <Route path="/moderator" element={<ModeratorLayout />}>
                <Route path="dashboard" element={<ModeratorDashboard />} />
                <Route path="reports" element={<ModeratorReports />} />
                <Route path="users" element={<UserModeration />} />
                <Route path="jobs" element={<JobModeration />} />
                <Route path="logs" element={<ActivityLogs />} />
                <Route path="settings" element={<div className="p-20 text-white font-black text-3xl">SETTINGS MODULE <br/><span className="text-zinc-600 text-xs tracking-widest uppercase">Coming Soon to Platform</span></div>} />
              </Route>
            </Route>

            {/* Support Admin Panel */}
            <Route path="/support" element={<SupportLayout />}>
              <Route path="dashboard" element={<SupportDashboard />} />
              <Route path="tickets" element={<SupportTickets />} />
              <Route path="chat" element={<ChatSupport />} />
              <Route path="users" element={<SupportUsers />} />
              <Route path="faq" element={<SupportFAQ />} />
              <Route path="settings" element={<SupportSettings />} />
            </Route>

            {/* Sales CRM Panel Routes */}
            <Route path="/sales" element={
              <SalesProtectedRoute>
                <SalesLayout />
              </SalesProtectedRoute>
            }>
              <Route path="dashboard" element={<SalesDashboard />} />
              <Route path="leads" element={<SalesLeads />} />
              <Route path="add-lead" element={<SalesAddLead />} />
              <Route path="followups" element={<SalesFollowUps />} />
              <Route path="customers" element={<SalesCustomers />} />
              <Route path="tasks" element={<SalesTasks />} />
              <Route path="attendance" element={<SalesAttendance />} />
              <Route path="targets" element={<SalesTarget />} />
              <Route path="performance" element={<SalesPerformance />} />
              <Route path="reports" element={<SalesReports />} />
              <Route path="notifications" element={<SalesNotifications />} />
              <Route path="profile" element={<SalesProfile />} />
              <Route path="settings" element={<SalesSettings />} />
              <Route path="*" element={<SalesNotFound />} />
            </Route>
          </Routes>
        </Suspense>
      </main>
     </LenisProvider>
    </Router>
  )
}

export default App
