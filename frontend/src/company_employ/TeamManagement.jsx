import React, { useState, useEffect } from "react";
import { 
  getTeamApi, 
  inviteTeamMemberApi, 
  resendInviteApi, 
  deleteTeamMemberApi 
} from "../services/companyApi";
import { toast } from "react-hot-toast";
import { 
  Users, UserPlus, Search, Filter, Mail, Copy, 
  RefreshCw, Trash2, Shield, Eye, Check, X, Phone 
} from "lucide-react";

// Predefined role permissions for live modal preview
const rolePermissionsMap = {
  employer_admin: [
    "full_access",
    "manage_team",
    "manage_jobs",
    "manage_billing",
    "view_analytics",
    "manage_company_profile",
  ],
  talent_acquisition: [
    "create_jobs",
    "source_candidates",
    "view_candidates",
    "manage_pipeline",
  ],
  hiring_manager: [
    "review_candidates",
    "interview_feedback",
    "view_jobs",
    "shortlist_candidates",
  ],
  hr_recruiter: [
    "manage_pipeline",
    "schedule_interviews",
    "communicate_candidates",
  ],
  interview_panel: [
    "conduct_interviews",
    "submit_feedback",
    "view_candidates",
  ],
  hr_admin: [
    "manage_employees",
    "manage_payroll",
    "manage_leave_policies",
    "manage_hr_documents",
    "view_all_candidates",
    "view_analytics",
    "manage_onboarding",
    "manage_compliance",
  ],
  recruitment_coordinator: [
    "coordinate_job_postings",
    "manage_candidate_pipeline",
    "schedule_interviews",
    "communicate_candidates",
    "track_recruitment_metrics",
    "manage_job_applications",
    "generate_recruitment_reports",
  ],
  interview_coordinator: [
    "schedule_interviews",
    "coordinate_interview_panels",
    "send_interview_invites",
    "manage_interview_slots",
    "collect_feedback",
    "view_candidates",
    "update_interview_status",
  ],
  onboarding_manager: [
    "manage_onboarding_process",
    "send_offer_letters",
    "manage_documents_collection",
    "track_joining_status",
    "communicate_new_hires",
    "manage_onboarding_checklist",
    "coordinate_with_hr_admin",
  ]
};

const roleDetails = {
  employer_admin: { label: "Employer Admin", color: "bg-slate-100 text-slate-800 border-slate-200" },
  talent_acquisition: { label: "Talent Acquisition", color: "bg-blue-50 text-blue-700 border-blue-200" },
  hiring_manager: { label: "Hiring Manager", color: "bg-purple-50 text-purple-700 border-purple-200" },
  hr_recruiter: { label: "HR Recruiter", color: "bg-amber-50 text-amber-700 border-amber-200" },
  interview_panel: { label: "Interview Panel", color: "bg-emerald-50 text-emerald-700 border-emerald-200" },
  hr_admin: { label: "HR Admin", color: "bg-teal-50 text-teal-700 border-teal-200" },
  recruitment_coordinator: { label: "Recruitment Coordinator", color: "bg-pink-50 text-pink-700 border-pink-200" },
  interview_coordinator: { label: "Interview Coordinator", color: "bg-indigo-50 text-indigo-700 border-indigo-200" },
  onboarding_manager: { label: "Onboarding Manager", color: "bg-orange-50 text-orange-700 border-orange-200" }
};

const statusDetails = {
  pending: { label: "Pending", bg: "bg-amber-500/10 text-amber-500 border-amber-500/20" },
  active: { label: "Active", bg: "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" },
  inactive: { label: "Inactive", bg: "bg-slate-500/10 text-slate-500 border-slate-500/20" },
  removed: { label: "Removed", bg: "bg-red-500/10 text-red-500 border-red-500/20" }
};

const TeamManagement = () => {
  const [team, setTeam] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");

  // Invite Modal State
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [submittingInvite, setSubmittingInvite] = useState(false);
  const [inviteForm, setInviteForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    role: "talent_acquisition",
  });

  // Fetch Team list
  const fetchTeam = async () => {
    try {
      setLoading(true);
      const data = await getTeamApi();
      setTeam(data.team);
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to load company team.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTeam();
  }, []);

  // Handle invitation submission
  const handleInviteSubmit = async (e) => {
    e.preventDefault();
    const { firstName, lastName, email, phone, role } = inviteForm;

    if (!firstName || !lastName || !email || !phone) {
      return toast.error("Please fill in all required fields.");
    }

    setSubmittingInvite(true);
    try {
      const data = await inviteTeamMemberApi(inviteForm);

      toast.success("Invitation sent successfully!");
      setShowInviteModal(false);
      setInviteForm({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        role: "talent_acquisition",
      });
      fetchTeam();

      // Print registration link directly for immediate copy paste / local demo
      if (data.acceptLink) {
        console.log("DEMO REGISTER LINK:", data.acceptLink);
        toast(
          (t) => (
            <div className="space-y-2">
              <p className="text-xs font-black text-slate-800">Demo Accept Link (SMTP Fallback):</p>
              <div className="flex items-center gap-2">
                <input 
                  readOnly 
                  value={data.acceptLink} 
                  className="bg-slate-100 text-[10px] px-2 py-1 select-all outline-none border border-slate-200" 
                />
                <button 
                  onClick={() => {
                    navigator.clipboard.writeText(data.acceptLink);
                    toast.dismiss(t.id);
                    toast.success("Copied to clipboard!");
                  }}
                  className="p-1 bg-[#0a1120] text-white rounded border-none cursor-pointer"
                >
                  <Copy size={12} />
                </button>
              </div>
            </div>
          ),
          { duration: 10000, position: "top-right" }
        );
      }
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to invite team member.");
    } finally {
      setSubmittingInvite(false);
    }
  };

  // Copy invitation link helper
  const handleCopyInviteLink = (token) => {
    if (!token) return;
    const link = `${window.location.origin}/employer/accept-invite?token=${token}`;
    navigator.clipboard.writeText(link);
    toast.success("Invitation link copied!");
  };

  // Resend invitation
  const handleResendInvite = async (id) => {
    try {
      const data = await resendInviteApi(id);
      toast.success("Invitation resent successfully!");
      if (data.acceptLink) {
        handleCopyInviteLink(data.teamMember.invitation_token);
      }
      fetchTeam();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to resend invitation.");
    }
  };

  // Remove member (Set status = removed)
  const handleRemoveMember = async (id) => {
    if (!window.confirm("Are you sure you want to remove this team member? This will immediately revoke their dashboard access.")) {
      return;
    }

    try {
      await deleteTeamMemberApi(id);
      toast.success("Team member access revoked successfully.");
      fetchTeam();
    } catch (error) {
      console.error(error);
      toast.error(error.response?.data?.message || "Failed to remove team member.");
    }
  };

  // Filter and search logic
  const filteredTeam = team.filter((member) => {
    const fullName = `${member.firstName} ${member.lastName}`.toLowerCase();
    const email = member.email.toLowerCase();
    const searchMatch = fullName.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    
    const roleMatch = roleFilter === "all" || member.role === roleFilter;
    const statusMatch = statusFilter === "all" || member.status === statusFilter;

    return searchMatch && roleMatch && statusMatch;
  });

  return (
    <div className="space-y-6 animate-fadeIn pb-12">
      {/* 1. Header Box */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <h2 className="text-xl font-black text-[#0a1120] tracking-tight flex items-center gap-2">
            <Users className="text-amber-500" size={22} />
            <span>Team & Role Management</span>
          </h2>
          <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">
            Manage your internal company recruitment team, roles, and granular access keys.
          </p>
        </div>

        <button
          onClick={() => setShowInviteModal(true)}
          className="flex items-center gap-2 bg-[#0a1120] hover:bg-amber-500 text-white hover:text-[#0a1120] px-5 py-3 rounded-none font-black text-xs uppercase tracking-wider transition-all duration-300 border-none cursor-pointer shadow-md"
        >
          <UserPlus size={14} />
          <span>Invite Team Member</span>
        </button>
      </div>

      {/* 2. Search & Filtering controls */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-3.5 bg-white p-4 border border-slate-100 rounded-none shadow-[0_4px_20px_rgba(15,23,42,0.01)]">
        <div className="md:col-span-6 relative flex items-center">
          <input
            type="text"
            placeholder="Search team members by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 hover:border-slate-300 focus:border-[#0a1120] rounded-none px-3.5 py-2.5 pl-10 text-xs font-semibold text-[#0a1120] outline-none transition-colors"
          />
          <Search size={14} className="absolute left-3.5 text-slate-400" />
        </div>

        <div className="md:col-span-3">
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 hover:border-slate-300 focus:border-[#0a1120] rounded-none px-3 py-2.5 text-xs font-black text-[#0a1120] outline-none cursor-pointer transition-all"
          >
            <option value="all">All Roles</option>
            <option value="employer_admin">Employer Admin</option>
            <option value="talent_acquisition">Talent Acquisition</option>
            <option value="hiring_manager">Hiring Manager</option>
            <option value="hr_recruiter">HR Recruiter</option>
            <option value="interview_panel">Interview Panel</option>
            <option value="hr_admin">HR Admin</option>
            <option value="recruitment_coordinator">Recruitment Coordinator</option>
            <option value="interview_coordinator">Interview Coordinator</option>
            <option value="onboarding_manager">Onboarding Manager</option>
          </select>
        </div>

        <div className="md:col-span-3">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full bg-slate-50/60 border border-slate-200 hover:border-slate-300 focus:border-[#0a1120] rounded-none px-3 py-2.5 text-xs font-black text-[#0a1120] outline-none cursor-pointer transition-all"
          >
            <option value="all">All Statuses</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* 3. Team Member Table / Grid */}
      {loading ? (
        <div className="py-20 text-center space-y-4">
          <div className="w-10 h-10 border-4 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-xs text-slate-400 uppercase tracking-widest font-black">Loading company roster...</p>
        </div>
      ) : filteredTeam.length === 0 ? (
        <div className="py-16 text-center border border-dashed border-slate-200 bg-white rounded-none">
          <Users className="text-slate-300 mx-auto mb-4" size={48} />
          <h3 className="text-sm font-black text-slate-700 uppercase tracking-wider">No Team Members Found</h3>
          <p className="text-xs text-slate-400 mt-1 font-semibold">Try modifying your filters or invite your first collaborator.</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-100 rounded-none shadow-[0_4px_24px_rgba(15,23,42,0.01)] overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/75 border-b border-slate-100">
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Name & Contact</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Company Role</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Account Status</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Invited/Joined</th>
                <th className="py-4 px-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTeam.map((member) => {
                const roleObj = roleDetails[member.role] || { label: member.role, color: "bg-slate-50 text-slate-600 border-slate-200" };
                const statusObj = statusDetails[member.status] || { label: member.status, bg: "bg-slate-100 text-slate-600 border-slate-200" };

                return (
                  <tr key={member._id} className="hover:bg-slate-50/40 transition-colors">
                    {/* Name Column */}
                    <td className="py-4.5 px-6">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-slate-900 text-white flex items-center justify-center font-extrabold text-[12px] rounded-none">
                          {member.firstName.charAt(0)}{member.lastName.charAt(0)}
                        </div>
                        <div className="space-y-0.5">
                          <p className="text-xs font-black text-slate-800 leading-none">
                            {member.firstName} {member.lastName}
                          </p>
                          <p className="text-[10px] text-slate-400 font-bold flex items-center gap-1.5 mt-1">
                            <Mail size={11} /> {member.email}
                          </p>
                          <p className="text-[9px] text-slate-400 font-bold flex items-center gap-1.5">
                            <Phone size={10} /> {member.phone}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Role Column */}
                    <td className="py-4.5 px-6">
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2.5 py-1.5 border rounded-none inline-block ${roleObj.color}`}>
                        {roleObj.label}
                      </span>
                    </td>

                    {/* Status Column */}
                    <td className="py-4.5 px-6">
                      <span className={`text-[9px] font-black uppercase tracking-widest px-2.5 py-1 border rounded-none inline-block ${statusObj.bg}`}>
                        {statusObj.label}
                      </span>
                    </td>

                    {/* Dates Column */}
                    <td className="py-4.5 px-6">
                      <div className="space-y-1">
                        <p className="text-[10px] text-slate-400 font-bold">
                          Invited: <span className="text-[#0a1120] font-extrabold">{new Date(member.createdAt).toLocaleDateString()}</span>
                        </p>
                        {member.joined_at && (
                          <p className="text-[10px] text-slate-400 font-bold">
                            Joined: <span className="text-emerald-600 font-extrabold">{new Date(member.joined_at).toLocaleDateString()}</span>
                          </p>
                        )}
                      </div>
                    </td>

                    {/* Action Column */}
                    <td className="py-4.5 px-6 text-right">
                      <div className="flex items-center justify-end gap-2.5">
                        {member.status === "pending" && (
                          <>
                            {/* Copy Invite Link for direct Local testing */}
                            <button
                              onClick={() => handleCopyInviteLink(member.invitation_token)}
                              title="Copy Direct Accept Link"
                              className="p-2 text-slate-400 hover:text-[#0a1120] bg-slate-50 hover:bg-slate-100 rounded-none border-none cursor-pointer transition-colors"
                            >
                              <Copy size={13} />
                            </button>

                            {/* Resend Invite */}
                            <button
                              onClick={() => handleResendInvite(member._id)}
                              title="Resend Invitation Email"
                              className="p-2 text-amber-500 hover:text-amber-700 bg-amber-50 hover:bg-amber-100 rounded-none border-none cursor-pointer transition-colors"
                            >
                              <RefreshCw size={13} />
                            </button>
                          </>
                        )}

                        {/* Remove / Revoke Access */}
                        <button
                          onClick={() => handleRemoveMember(member._id)}
                          title="Revoke Dashboard Access"
                          className="p-2 text-red-500 hover:text-white bg-red-50 hover:bg-red-500 rounded-none border-none cursor-pointer transition-colors"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 4. INVITE TEAM MEMBER MODAL */}
      {showInviteModal && (
        <div className="fixed inset-0 bg-[#0a1120]/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white border border-slate-100 w-full max-w-2xl shadow-[0_20px_50px_rgba(0,0,0,0.15)] overflow-hidden rounded-none flex flex-col md:flex-row max-h-[90vh]">
            
            {/* Modal Left Form Content */}
            <div className="p-7 flex-1 space-y-5 overflow-y-auto">
              <div className="flex justify-between items-start border-b border-slate-100 pb-3">
                <div>
                  <h3 className="text-sm font-black text-[#0a1120] uppercase tracking-wider">Invite Corporate Partner</h3>
                  <p className="text-[10px] text-slate-400 font-bold uppercase mt-1 tracking-wider">Configure collaboration roles</p>
                </div>
                <button
                  onClick={() => setShowInviteModal(false)}
                  className="p-1 hover:bg-slate-100 text-slate-400 hover:text-slate-600 rounded-none bg-transparent border-none cursor-pointer"
                >
                  <X size={16} />
                </button>
              </div>

              <form onSubmit={handleInviteSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">First Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. John"
                      value={inviteForm.firstName}
                      onChange={(e) => setInviteForm({ ...inviteForm, firstName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#0a1120] rounded-none px-3.5 py-2 text-xs font-semibold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Last Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Doe"
                      value={inviteForm.lastName}
                      onChange={(e) => setInviteForm({ ...inviteForm, lastName: e.target.value })}
                      className="w-full bg-slate-50 border border-slate-200 focus:border-[#0a1120] rounded-none px-3.5 py-2 text-xs font-semibold text-[#0a1120] outline-none transition-all"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Work Email Address *</label>
                  <input
                    type="email"
                    required
                    placeholder="e.g. name@company.com"
                    value={inviteForm.email}
                    onChange={(e) => setInviteForm({ ...inviteForm, email: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0a1120] rounded-none px-3.5 py-2 text-xs font-semibold text-[#0a1120] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Contact Phone Number *</label>
                  <input
                    type="tel"
                    required
                    placeholder="e.g. +91 9876543210"
                    value={inviteForm.phone}
                    onChange={(e) => setInviteForm({ ...inviteForm, phone: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0a1120] rounded-none px-3.5 py-2 text-xs font-semibold text-[#0a1120] outline-none transition-all"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-[9px] font-black text-slate-400 uppercase tracking-widest block">Select Team Access Role *</label>
                  <select
                    value={inviteForm.role}
                    onChange={(e) => setInviteForm({ ...inviteForm, role: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-200 focus:border-[#0a1120] rounded-none px-3 py-2 text-xs font-bold text-[#0a1120] outline-none cursor-pointer transition-all"
                  >
                    <option value="talent_acquisition">Talent Acquisition</option>
                    <option value="hiring_manager">Hiring Manager</option>
                    <option value="hr_recruiter">HR Recruiter</option>
                    <option value="interview_panel">Interview Panel</option>
                    <option value="hr_admin">HR Admin</option>
                    <option value="recruitment_coordinator">Recruitment Coordinator</option>
                    <option value="interview_coordinator">Interview Coordinator</option>
                    <option value="onboarding_manager">Onboarding Manager</option>
                  </select>
                </div>

                <div className="flex gap-2.5 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowInviteModal(false)}
                    className="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-600 hover:text-slate-800 py-3 text-xs font-black uppercase tracking-wider transition-all duration-200 rounded-none border-none cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submittingInvite}
                    className="flex-1 bg-[#0a1120] hover:bg-amber-500 text-white hover:text-[#0a1120] py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 rounded-none flex items-center justify-center gap-2 border-none cursor-pointer"
                  >
                    {submittingInvite ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                    ) : (
                      <>
                        <UserPlus size={13} />
                        <span>Send Invitation</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            </div>

            {/* Modal Right Side Dynamic Live Permissions Preview */}
            <div className="md:w-64 bg-[#0a1120] p-7 text-white flex flex-col justify-between border-t md:border-t-0 md:border-l border-slate-800">
              <div className="space-y-4">
                <div className="space-y-1">
                  <Shield className="text-amber-500" size={20} />
                  <h4 className="text-xs font-black text-white uppercase tracking-wider">Access Preview</h4>
                  <p className="text-[9px] text-slate-400 font-bold leading-relaxed uppercase">
                    Assigned rights for: <span className="text-amber-500 font-extrabold">{inviteForm.role.replace("_", " ")}</span>
                  </p>
                </div>

                <div className="border-t border-slate-800 pt-3 space-y-2 max-h-[160px] md:max-h-none overflow-y-auto smooth-scroll pr-1">
                  {rolePermissionsMap[inviteForm.role]?.map((perm, key) => (
                    <div key={key} className="flex items-center gap-2.5 text-slate-300">
                      <div className="w-4 h-4 bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center justify-center rounded-none shrink-0">
                        <Check size={10} strokeWidth={3} />
                      </div>
                      <span className="text-[10.5px] font-bold tracking-wide text-slate-200 uppercase">{perm.replace("_", " ")}</span>
                    </div>
                  ))}
                </div>
              </div>

              <p className="text-[9.5px] text-slate-400 font-semibold leading-relaxed pt-4 mt-4 border-t border-slate-800 uppercase">
                * Real-time access policy enforcement keys. Unselected features are hidden.
              </p>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};

export default TeamManagement;
