import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { getInviteApi, acceptInviteApi } from "../services/companyApi";
import { toast } from "react-hot-toast";
import { Lock, Eye, EyeOff, ShieldCheck, AlertTriangle } from "lucide-react";

const AcceptInvite = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [invitation, setInvitation] = useState(null);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  // Fetch invitation details on mount
  useEffect(() => {
    if (!token) {
      setError("Invalid invitation link. Token is missing.");
      setLoading(false);
      return;
    }

    const fetchInvitation = async () => {
      try {
        const data = await getInviteApi(token);
        setInvitation(data);
      } catch (err) {
        console.error(err);
        setError(err.response?.data?.message || "Invitation link is invalid or has expired.");
      } finally {
        setLoading(false);
      }
    };

    fetchInvitation();
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!password) {
      return toast.error("Please enter a password.");
    }
    if (password.length < 6) {
      return toast.error("Password must be at least 6 characters long.");
    }
    if (password !== confirmPassword) {
      return toast.error("Passwords do not match.");
    }

    setSubmitting(true);
    try {
      const data = await acceptInviteApi(token, password);

      toast.success("Account activated successfully!");
      // Store JWT token and session user exactly like companyLogin does!
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", "employer");
      localStorage.setItem("user", JSON.stringify(data.user));
      // We will store the company object to make sure dashboard doesn't break
      localStorage.setItem("company", JSON.stringify({ name: data.companyName || "My Company" }));

      // Redirect directly to employer dashboard
      navigate("/employer/dashboard");
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "Failed to accept invitation.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#0a1120] flex items-center justify-center p-4">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-amber-500 border-t-transparent animate-spin mx-auto"></div>
          <p className="text-slate-400 font-extrabold text-xs uppercase tracking-widest">Validating Invitation...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0a1120] flex items-center justify-center p-4 antialiased">
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900;950&display=swap');
        .invite-root {
          font-family: 'Plus Jakarta Sans', sans-serif !important;
        }
      `}</style>

      <div className="invite-root w-full max-w-md bg-white border border-slate-100 p-8 shadow-[0_20px_50px_rgba(0,0,0,0.3)] space-y-6">
        {/* Brand Header */}
        <div className="flex items-center gap-3 border-b border-slate-100 pb-4">
          <div className="w-10 h-10 bg-gradient-to-tr from-[#f59e0b] to-[#fbbf24] flex items-center justify-center text-white font-extrabold text-lg shadow-lg shadow-amber-500/10">
            N
          </div>
          <div>
            <span className="text-[#0a1120] text-sm font-black tracking-tight block">NextHire.in</span>
            <span className="text-[9px] text-amber-500 font-black uppercase tracking-widest block -mt-1">Corporate Suite</span>
          </div>
        </div>

        {error ? (
          /* Error State UI */
          <div className="space-y-5 text-center py-4">
            <div className="w-16 h-16 bg-red-50 text-red-500 flex items-center justify-center mx-auto shadow-inner">
              <AlertTriangle size={32} />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black text-slate-800 uppercase tracking-wider">Invitation Invalid or Expired</h3>
              <p className="text-xs text-slate-500 leading-relaxed font-semibold">
                {error}
              </p>
            </div>
            <button
              onClick={() => navigate("/company/login")}
              className="w-full bg-[#0a1120] hover:bg-amber-500 text-white hover:text-[#0a1120] py-3 text-xs font-black uppercase tracking-wider transition-all duration-300 border-none cursor-pointer"
            >
              Back to Login
            </button>
          </div>
        ) : (
          /* Success/Active Invitation Setup Form UI */
          <div className="space-y-5">
            <div className="space-y-2">
              <p className="text-[10px] text-amber-500 font-black uppercase tracking-widest leading-none">Corporate Invitation</p>
              <h2 className="text-xl font-black text-[#0a1120] tracking-tight leading-tight">
                Join {invitation.companyName}
              </h2>
              <p className="text-xs text-slate-500 font-semibold">
                You have been invited by {invitation.companyName} to join their team as a{" "}
                <span className="text-blue-600 font-extrabold bg-blue-50 px-2 py-0.5 uppercase text-[10px] tracking-wider">
                  {invitation.teamMember.role.replace("_", " ")}
                </span>
                . Please set your account password below to activate your dashboard.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 pt-2">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Work Email</label>
                <input
                  type="email"
                  disabled
                  value={invitation.teamMember.email}
                  className="w-full bg-slate-50 border border-slate-200 px-3 py-2.5 text-xs font-bold text-slate-400 cursor-not-allowed outline-none"
                />
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Create Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Min. 6 characters"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#0a1120] px-3.5 py-2.5 pl-9 text-xs font-bold text-[#0a1120] outline-none transition-colors"
                  />
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 bg-transparent border-none cursor-pointer"
                  >
                    {showPassword ? <EyeOff size={14} /> : <Eye size={14} />}
                  </button>
                </div>
              </div>

              <div className="space-y-1.5 relative">
                <label className="text-[10px] font-black text-slate-500 uppercase tracking-wider block">Confirm Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Re-enter password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-slate-200 focus:border-[#0a1120] px-3.5 py-2.5 pl-9 text-xs font-bold text-[#0a1120] outline-none transition-colors"
                  />
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="w-full bg-[#0a1120] hover:bg-amber-500 text-white hover:text-[#0a1120] py-3.5 text-xs font-black uppercase tracking-wider transition-all duration-300 flex items-center justify-center gap-2 border-none cursor-pointer mt-2"
              >
                {submitting ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent animate-spin"></div>
                ) : (
                  <>
                    <ShieldCheck size={15} />
                    <span>Activate Account</span>
                  </>
                )}
              </button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default AcceptInvite;
