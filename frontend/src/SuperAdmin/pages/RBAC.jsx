import React, { useState, useEffect } from 'react';
import { getRoles, getRolePermissions, updateRolePermissions } from '../../services/superAdminApi';
import { Shield, Save, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const RBAC = () => {
  const [roles, setRoles] = useState([]);
  const [selectedRole, setSelectedRole] = useState('');
  const [permissions, setPermissions] = useState({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  // Dynamic modules based on selected role
  const getModulesForRole = (role) => {
    if (role === 'Finance Admin') {
      return ['Dashboard', 'Revenue Analytics', 'Subscription Plans', 'Employer Payments', 'Pricing & Charges', 'Refund Management', 'Invoices & Billing', 'Financial Reports'];
    }
    if (role === 'Platform Admin') {
      return ['Candidates', 'Jobs', 'Companies', 'Support', 'Analytics', 'Reports', 'Audit Logs'];
    }
    if (role === 'OPS Admin' || role === 'Ops Admin') {
      return ['Dashboard', 'Candidates & Companies', 'Recruiters Verification', 'Job Posts Control', 'Content Moderation', 'Platform Activity', 'Problem Solving'];
    }
    if (role === 'Trust & Safety' || role === 'trust_safety') {
      return ['Dashboard', 'Reports & Flags', 'Moderation Queue', 'Fraud & Risk Analysis', 'Enforcement Actions', 'Blocked Accounts', 'Audit Logs', 'KYC Verification'];
    }
    if (role === 'Support Admin') {
      return ['Dashboard', 'Tickets', 'Live Chat', 'Users Help', 'FAQ Manager', 'Settings'];
    }
    if (role === 'Moderator') {
      return ['Dashboard', 'Reports', 'Users', 'Jobs', 'Activity Logs', 'Settings'];
    }
    if (role === 'Sales Panel') {
      return ['Dashboard', 'Leads Management', 'Employer Directory', 'Sales Pipeline', 'Deal Tracker', 'Analytics', 'Invoices', 'Reports', 'Settings'];
    }
    // Default list
    return ['Candidates', 'Jobs', 'Companies', 'Payments', 'Reports', 'Support', 'Moderation', 'Settings'];
  };

  const actions = ['View', 'Create', 'Edit', 'Delete', 'Approve'];

  useEffect(() => {
    fetchRoles();
  }, []);

  const fetchRoles = async () => {
    try {
      const data = await getRoles();
      setRoles(data);
      if (data.length > 0) {
        setSelectedRole(data[0].name);
        fetchPermissions(data[0].name);
      }
    } catch (err) {
      toast.error("Failed to fetch roles");
    } finally {
      setLoading(false);
    }
  };

  const fetchPermissions = async (roleName) => {
    setLoading(true);
    try {
      const data = await getRolePermissions(roleName);
      setPermissions(data || {});
    } catch (err) {
      toast.error("Failed to fetch permissions");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (module, action) => {
    const actionLower = action.toLowerCase();
    const currentModulePerms = permissions[module] || [];
    
    let newPerms;
    if (currentModulePerms.includes(actionLower)) {
      newPerms = currentModulePerms.filter(p => p !== actionLower);
    } else {
      newPerms = [...currentModulePerms, actionLower];
    }

    setPermissions({
      ...permissions,
      [module]: newPerms
    });
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      await updateRolePermissions(selectedRole, permissions);
      toast.success("Permissions saved!");
    } catch (err) {
      toast.error("Save failed");
    } finally {
      setSaving(false);
    }
  };

  const currentModules = getModulesForRole(selectedRole);

  if (loading && roles.length === 0) return <div className="h-96 flex items-center justify-center"><Loader2 className="animate-spin text-slate-400" size={48} /></div>;

  return (
    <div className="p-4 md:p-8 space-y-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Select Admin Role</h1>
          <div className="mt-4 max-w-xs">
            <select 
              value={selectedRole}
              onChange={(e) => {
                setSelectedRole(e.target.value);
                fetchPermissions(e.target.value);
              }}
              className="w-full p-3 border border-slate-300 rounded-lg outline-none focus:border-indigo-500 font-medium"
            >
              {roles.map(role => <option key={role._id} value={role.name}>{role.name}</option>)}
            </select>
          </div>
        </div>
        <button 
          onClick={handleSave}
          disabled={saving}
          className="px-8 py-3 bg-indigo-600 text-white rounded-lg font-bold hover:bg-indigo-700 transition-all flex items-center gap-2 disabled:opacity-50 h-fit"
        >
          {saving ? <Loader2 className="animate-spin" size={20} /> : <><Save size={20} /> Save Permission</>}
        </button>
      </div>

      <div className="bg-white border border-slate-200 rounded-lg overflow-hidden shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-200 bg-slate-50/50">
                <th className="p-5 font-bold text-slate-700 w-1/4">Module</th>
                {actions.map(action => (
                  <th key={action} className="p-5 font-bold text-slate-700 text-center">{action}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {currentModules.map((mod) => (
                <tr key={mod} className="hover:bg-slate-50/50 transition-colors">
                  <td className="p-5 text-sm font-semibold text-slate-600">{mod}</td>
                  {actions.map(action => {
                    const isCandidateRestriction = selectedRole === 'Platform Admin' && mod === 'Candidates' && (action === 'Create' || action === 'Approve');
                    const isChecked = (permissions[mod] || []).includes(action.toLowerCase()) && !isCandidateRestriction;
                    
                    return (
                      <td key={action} className="p-5 text-center">
                        <input 
                          type="checkbox"
                          disabled={isCandidateRestriction}
                          checked={isChecked}
                          onChange={() => handleToggle(mod, action)}
                          className={`w-4 h-4 border-slate-300 rounded focus:ring-0 cursor-pointer ${isCandidateRestriction ? 'opacity-20 cursor-not-allowed' : ''}`}
                        />
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RBAC;
