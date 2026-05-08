import React, { useState, useEffect } from 'react';
import { getAuditLogs } from '../../services/superAdminApi';
import {
  Activity,
  Search,
  Filter,
  ChevronLeft,
  ChevronRight,
  Eye,
  Calendar,
  ShieldAlert,
  Clock,
  User,
  ExternalLink,
  Smartphone,
  Monitor,
  ArrowRight,
  Database,
  FileJson
} from 'lucide-react';
import { format, formatDistanceToNow } from 'date-fns';
import toast from 'react-hot-toast';
import { Link } from 'react-router-dom';

const AuditLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(20);
  const [filters, setFilters] = useState({
    module: '',
    action: '',
    startDate: '',
    endDate: '',
    search: ''
  });
  const [selectedLog, setSelectedLog] = useState(null);

  useEffect(() => {
    fetchLogs();
  }, [page, limit, filters.module, filters.action]);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const data = await getAuditLogs({ ...filters, page, limit });
      setLogs(data.logs);
      setTotal(data.total);
    } catch (err) {
      toast.error("Failed to fetch audit logs");
    } finally {
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
    setPage(1);
  };

  const maskEmail = (email) => {
    if (!email || !email.includes('@')) return email;
    const [user, domain] = email.split('@');
    return `${user.substring(0, 3)}****@${domain}`;
  };

  const getActionColor = (action) => {
    const a = action?.toUpperCase();
    if (a.includes('DELETE') || a.includes('BLOCK') || a.includes('REVOKE')) return 'text-red-600 bg-red-50 border-red-100';
    if (a.includes('CREATE') || a.includes('APPROVE') || a.includes('UNBLOCK')) return 'text-green-600 bg-green-50 border-green-100';
    if (a.includes('UPDATE')) return 'text-amber-600 bg-amber-50 border-amber-100';
    if (a.includes('LOGIN')) return 'text-purple-600 bg-purple-50 border-purple-100';
    return 'text-slate-600 bg-slate-50 border-slate-100';
  };

  const getSeverityColor = (severity) => {
    switch (severity?.toLowerCase()) {
      case 'critical': return 'bg-red-500';
      case 'high': return 'bg-orange-500';
      case 'medium': return 'bg-amber-500';
      default: return 'bg-blue-500';
    }
  };

  return (
    <div className="p-4 md:p-8 space-y-8 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-3 italic uppercase">
            <Activity className="text-indigo-600" size={32} />
            Audit & Compliance
          </h1>
          <p className="text-slate-500 font-medium mt-1 uppercase tracking-widest text-[10px]">Production-Grade Security Logging</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={fetchLogs} className="p-3 bg-white border border-slate-200 rounded-2xl hover:bg-slate-50 transition-all shadow-sm">
            <Clock size={20} className="text-slate-400" />
          </button>
        </div>
      </div>

      {/* Filters Bar */}
      <div className="bg-white p-6 rounded-[32px] border border-slate-100 shadow-xl shadow-slate-200/50 flex flex-wrap gap-4 items-end">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Search Context</label>
          <div className="relative group">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={18} />
            <input
              type="text"
              name="search"
              placeholder="Search by Admin, Trace ID or Target..."
              value={filters.search}
              onChange={handleFilterChange}
              onKeyDown={(e) => e.key === 'Enter' && fetchLogs()}
              className="w-full pl-12 pr-4 py-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all font-bold text-sm"
            />
          </div>
        </div>

        <div className="w-full md:w-40">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Module</label>
          <select
            name="module"
            value={filters.module}
            onChange={handleFilterChange}
            className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm appearance-none cursor-pointer"
          >
            <option value="">All Systems</option>
            <option value="candidates">Candidates</option>
            <option value="jobs">Jobs</option>
            <option value="companies">Companies</option>
            <option value="admins">Admins</option>
            <option value="rbac">RBAC</option>
            <option value="plans">Plans</option>
          </select>
        </div>

        <div className="w-full md:w-40">
          <label className="block text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2 ml-1">Severity</label>
          <select
            name="severity"
            onChange={handleFilterChange}
            className="w-full p-3 bg-slate-50 border-none rounded-2xl focus:ring-2 focus:ring-indigo-500/20 outline-none font-bold text-sm appearance-none cursor-pointer"
          >
            <option value="">All Levels</option>
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
            <option value="critical">Critical</option>
          </select>
        </div>

        <button
          onClick={fetchLogs}
          className="px-8 py-3.5 bg-indigo-600 text-white rounded-2xl font-black text-[11px] uppercase tracking-widest hover:bg-indigo-700 transition-all hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20"
        >
          Update View
        </button>
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-[32px] border border-slate-100 shadow-2xl shadow-slate-200/50 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-slate-100 bg-slate-50/50">
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Administrator</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Action</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Target Entity</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest">Timing</th>
                <th className="p-6 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">Insight</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-50">
              {loading ? (
                Array(6).fill(0).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan="5" className="p-6"><div className="h-6 bg-slate-100 rounded-xl w-full"></div></td>
                  </tr>
                ))
              ) : logs.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-32 text-center">
                    <div className="flex flex-col items-center gap-4">
                      <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center text-slate-300">
                        <Database size={32} />
                      </div>
                      <p className="text-slate-400 font-bold italic">No compliance logs found matching your filters.</p>
                    </div>
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr key={log._id} className="hover:bg-slate-50/50 transition-all group">
                    <td className="p-6">
                      <div className="flex items-center gap-4">
                        <div className="relative">
                          <div className="w-11 h-11 rounded-2xl bg-indigo-50 flex items-center justify-center text-indigo-600 font-black shadow-sm border border-indigo-100">
                            {log.adminName?.charAt(0) || <User size={18} />}
                          </div>
                          <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getSeverityColor(log.severity)}`}></div>
                        </div>
                        <div>
                          <p className="font-black text-slate-900 text-sm leading-none">{maskEmail(log.adminName)}</p>
                          <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1.5">{log.role}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">
                      <div className="space-y-1.5">
                        <span className={`px-2.5 py-1 border rounded-lg text-[9px] font-black tracking-widest uppercase inline-block ${getActionColor(log.action)}`}>
                          {log.action}
                        </span>
                        <p className="text-xs font-bold text-slate-600 truncate max-w-[200px]">
                          {log.displayMessage || log.reason}
                        </p>
                      </div>
                    </td>
                    <td className="p-6">
                      <Link
                        to={log.module === 'candidates' ? `/admin/candidate/${log.targetId}` : '#'}
                        className="flex items-center gap-2 group/link"
                      >
                        <code className="text-[11px] font-mono font-bold text-indigo-600 bg-indigo-50/50 px-2 py-1 rounded-lg group-hover/link:bg-indigo-100 transition-all">
                          {log.targetId}
                        </code>
                        <ExternalLink size={12} className="text-slate-300 group-hover/link:text-indigo-400 opacity-0 group-hover/link:opacity-100 transition-all" />
                      </Link>
                      <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mt-1">{log.module}</p>
                    </td>
                    <td className="p-6">
                      <div className="flex items-center gap-2 text-slate-700">
                        <Clock size={14} className="text-slate-300" />
                        <p className="text-xs font-bold">{formatDistanceToNow(new Date(log.performedAt || log.createdAt), { addSuffix: true })}</p>
                      </div>
                      <p className="text-[10px] font-bold text-slate-400 mt-1 uppercase tracking-widest">
                        {format(new Date(log.performedAt || log.createdAt), 'MMM dd, HH:mm')}
                      </p>
                    </td>
                    <td className="p-6 text-right">
                      <button
                        onClick={() => setSelectedLog(log)}
                        className="w-11 h-11 rounded-2xl hover:bg-indigo-600 hover:text-white flex items-center justify-center transition-all text-slate-400 border border-slate-100 hover:shadow-xl hover:shadow-indigo-500/30 bg-white"
                      >
                        <Eye size={20} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="p-8 bg-slate-50/30 border-t border-slate-100 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Entries: {total}</p>
            <select
              value={limit}
              onChange={(e) => { setLimit(Number(e.target.value)); setPage(1); }}
              className="text-[10px] font-black bg-white border border-slate-200 rounded-lg px-2 py-1 outline-none"
            >
              <option value="10">10 / Page</option>
              <option value="20">20 / Page</option>
              <option value="50">50 / Page</option>
            </select>
          </div>

          <div className="flex items-center gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronLeft size={18} />
            </button>
            <div className="flex items-center gap-1">
              <span className="w-10 h-10 flex items-center justify-center bg-indigo-600 text-white rounded-2xl font-black text-sm shadow-lg shadow-indigo-500/30">{page}</span>
              <span className="text-slate-400 font-bold px-2">of</span>
              <span className="text-slate-900 font-bold">{Math.ceil(total / limit) || 1}</span>
            </div>
            <button
              disabled={logs.length < limit}
              onClick={() => setPage(page + 1)}
              className="p-2.5 rounded-2xl border border-slate-200 bg-white hover:bg-slate-50 disabled:opacity-30 transition-all shadow-sm"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Compliance Insight Modal */}
      {selectedLog && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-slate-900/70 backdrop-blur-md animate-in fade-in duration-300">
          <div className="bg-white w-full max-w-5xl rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-300 border border-white/20">
            <div className="bg-slate-900 p-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${getSeverityColor(selectedLog.severity)} animate-pulse`}></div>
                  <h2 className="text-2xl font-black text-white italic uppercase tracking-tight">Audit Insight</h2>
                </div>
                <p className="text-slate-400 text-[10px] font-black uppercase tracking-widest mt-2">Trace ID: {selectedLog.traceId}</p>
              </div>
              <button onClick={() => setSelectedLog(null)} className="w-14 h-14 bg-white/5 hover:bg-white/10 rounded-3xl flex items-center justify-center text-white transition-all border border-white/10">
                <ChevronRight className="rotate-45" size={28} />
              </button>
            </div>

            <div className="p-10 grid md:grid-cols-3 gap-10 max-h-[75vh] overflow-y-auto custom-scrollbar">
              {/* Security Context */}
              <div className="space-y-8">
                <div>
                  <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-5">Security Context</h3>
                  <div className="bg-slate-50 p-6 rounded-[32px] space-y-6 border border-slate-100">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100"><ShieldAlert size={20} /></div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Network Origin</p>
                        <p className="font-mono text-xs font-black text-slate-900">{selectedLog.ipAddress}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white flex items-center justify-center text-indigo-600 shadow-sm border border-slate-100">
                        {selectedLog.metadata?.device === 'mobile' ? <Smartphone size={20} /> : <Monitor size={20} />}
                      </div>
                      <div>
                        <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Client Environment</p>
                        <p className="text-[11px] font-black text-slate-700 leading-tight">
                          {selectedLog.metadata?.browser || 'Unknown Browser'}
                          <span className="block text-[9px] text-slate-400 mt-0.5">{selectedLog.metadata?.device || 'Desktop'} Agent</span>
                        </p>
                      </div>
                    </div>
                    <div className="pt-4 border-t border-slate-200/50">
                      <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-1">Reason for Action</p>
                      <p className="text-sm font-bold text-slate-600 italic">"{selectedLog.reason || 'Not specified'}"</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Data Transformation */}
              <div className="md:col-span-2 space-y-8">
                <h3 className="text-[11px] font-black text-indigo-500 uppercase tracking-[0.2em] mb-5">Data Transformation</h3>
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Old State */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-2 h-2 rounded-full bg-red-400"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Previous State</span>
                    </div>
                    <div className="bg-slate-900 rounded-[32px] p-6 min-h-[300px] shadow-inner relative overflow-hidden group/box">
                      <Database className="absolute -right-4 -bottom-4 text-white/5 group-hover/box:scale-110 transition-transform" size={100} />
                      {selectedLog.oldData ? (
                        <pre className="text-[11px] text-slate-300 font-mono leading-relaxed relative z-10">
                          {JSON.stringify(selectedLog.oldData, null, 2)}
                        </pre>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 font-bold italic text-sm">No prior data recorded</div>
                      )}
                    </div>
                  </div>

                  {/* New State */}
                  <div className="space-y-4 relative">
                    <ArrowRight className="absolute -left-7 top-1/2 -translate-y-1/2 text-slate-200 hidden md:block" size={24} />
                    <div className="flex items-center gap-2 px-2">
                      <div className="w-2 h-2 rounded-full bg-green-400"></div>
                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Updated State</span>
                    </div>
                    <div className="bg-slate-900 rounded-[32px] p-6 min-h-[300px] shadow-inner relative overflow-hidden group/box">
                      <FileJson className="absolute -right-4 -bottom-4 text-white/5 group-hover/box:scale-110 transition-transform" size={100} />
                      {selectedLog.newData ? (
                        <pre className="text-[11px] text-green-400 font-mono leading-relaxed relative z-10">
                          {JSON.stringify(selectedLog.newData, null, 2)}
                        </pre>
                      ) : (
                        <div className="h-full flex items-center justify-center text-slate-600 font-bold italic text-sm">No payload recorded</div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AuditLogs;
