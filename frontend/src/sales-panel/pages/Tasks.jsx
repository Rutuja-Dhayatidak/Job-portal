import React, { useState, useEffect } from 'react';
import { getSalesTasks, createSalesTask, updateSalesTask } from '../../services/salesApi';
import { 
  CheckSquare, Square, Calendar, Plus, Save,
  AlertCircle, CheckCircle2, Clock, Trash2, ShieldAlert
} from 'lucide-react';
import toast from 'react-hot-toast';

const Tasks = () => {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);
  
  const [newTask, setNewTask] = useState({
    title: "",
    description: "",
    dueDate: "",
    priority: "medium"
  });

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const res = await getSalesTasks();
      if (res.success) {
        setTasks(res.tasks);
      }
    } catch (err) {
      toast.error("Failed to fetch agent task pipeline");
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = async (id, currentStatus) => {
    const nextStatus = currentStatus === 'completed' ? 'pending' : 'completed';
    try {
      const res = await updateSalesTask(id, { status: nextStatus });
      if (res.success) {
        toast.success(nextStatus === 'completed' ? "Task resolved!" : "Task reopened!");
        fetchTasks();
      }
    } catch (err) {
      toast.error("Failed to update task status");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title || !newTask.dueDate) return toast.error("Title and due date are mandatory");
    
    try {
      const res = await createSalesTask(newTask);
      if (res.success) {
        toast.success("New task assigned!");
        setShowAddForm(false);
        setNewTask({ title: "", description: "", dueDate: "", priority: "medium" });
        fetchTasks();
      }
    } catch (err) {
      toast.error("Failed to add task");
    }
  };

  if (loading) {
    return (
      <div className="h-[70vh] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-violet-100 border-t-violet-600 rounded-full animate-spin"></div>
      </div>
    );
  }

  const pending = tasks.filter(t => t.status === 'pending');
  const completed = tasks.filter(t => t.status === 'completed');

  return (
    <div className="space-y-8 pb-12 max-w-4xl">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-3xl font-black text-slate-900 tracking-tight">Agenda & Tasks</h1>
          <p className="text-slate-500 font-medium mt-1">Record action items and reminders for your sales campaign pipeline.</p>
        </div>
        <button 
          onClick={() => setShowAddForm(!showAddForm)}
          className="flex items-center gap-2 px-6 py-3.5 bg-violet-600 hover:bg-violet-700 text-white rounded-xl font-bold transition-all shadow-lg shadow-violet-500/20"
        >
          <Plus size={20} />
          {showAddForm ? "Close Panel" : "Assign Task"}
        </button>
      </div>

      {/* Add Task Panel */}
      {showAddForm && (
        <form onSubmit={handleCreate} className="bg-white p-6 rounded-3xl border border-slate-100 shadow-sm space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Task Title</label>
              <input 
                type="text"
                required
                value={newTask.title}
                onChange={(e) => setNewTask({...newTask, title: e.target.value})}
                placeholder="Follow up with Intel Corp."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Due Date</label>
              <input 
                type="date"
                required
                value={newTask.dueDate}
                onChange={(e) => setNewTask({...newTask, dueDate: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
            <div className="space-y-1 md:col-span-2">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Notes / Description</label>
              <input 
                type="text"
                value={newTask.description}
                onChange={(e) => setNewTask({...newTask, description: e.target.value})}
                placeholder="Briefly describe the task action details..."
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-semibold"
              />
            </div>
            <div className="space-y-1">
              <label className="text-[10px] font-black text-slate-400 uppercase tracking-wider ml-1">Priority</label>
              <select 
                value={newTask.priority}
                onChange={(e) => setNewTask({...newTask, priority: e.target.value})}
                className="w-full px-4 py-3 bg-slate-50 border border-slate-100 rounded-xl focus:border-violet-500 focus:bg-white outline-none transition-all text-sm font-bold cursor-pointer"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>
          <div className="flex justify-end pt-2">
            <button 
              type="submit"
              className="flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-black text-white text-xs font-bold rounded-xl transition-all"
            >
              <Save size={16} />
              Save Task Chores
            </button>
          </div>
        </form>
      )}

      {/* Lists wrapper */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Pending chores */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <Clock className="text-amber-500 animate-pulse" size={18} />
            Pending Reminders ({pending.length})
          </h3>
          <div className="space-y-3">
            {pending.map((t) => (
              <div key={t._id} className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm flex items-start gap-4 hover:border-violet-100 transition-colors">
                <button onClick={() => handleToggle(t._id, t.status)} className="mt-0.5 text-slate-300 hover:text-violet-500 shrink-0">
                  <Square size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">{t.title}</h4>
                  {t.description && <p className="text-xs text-slate-400 mt-1">{t.description}</p>}
                  <div className="flex items-center gap-3 mt-3">
                    <span className="text-[10px] font-bold text-slate-400 flex items-center gap-1">
                      <Calendar size={12} />
                      {new Date(t.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </span>
                    <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase tracking-wider ${
                      t.priority === 'high' ? 'bg-rose-50 text-rose-600' : 'bg-slate-50 text-slate-500'
                    }`}>
                      {t.priority}
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {pending.length === 0 && (
              <div className="py-12 bg-slate-50 border border-slate-100 rounded-2xl text-center text-slate-400 text-xs font-bold uppercase tracking-widest">
                All tasks completed! 👍
              </div>
            )}
          </div>
        </div>

        {/* Resolved chores */}
        <div className="space-y-4">
          <h3 className="text-lg font-black text-slate-900 flex items-center gap-2">
            <CheckCircle2 className="text-emerald-500" size={18} />
            Completed Chores ({completed.length})
          </h3>
          <div className="space-y-3">
            {completed.map((t) => (
              <div key={t._id} className="bg-slate-50/50 p-5 rounded-2xl border border-slate-100/50 flex items-start gap-4 opacity-75">
                <button onClick={() => handleToggle(t._id, t.status)} className="mt-0.5 text-emerald-500 shrink-0">
                  <CheckSquare size={20} />
                </button>
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-semibold text-slate-400 line-through truncate">{t.title}</h4>
                  {t.description && <p className="text-xs text-slate-400/70 mt-1">{t.description}</p>}
                </div>
              </div>
            ))}

            {completed.length === 0 && (
              <div className="py-12 bg-slate-50/20 border border-dashed border-slate-100 rounded-2xl text-center text-slate-300 text-xs font-bold uppercase tracking-widest">
                No archived resolved items
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Tasks;
