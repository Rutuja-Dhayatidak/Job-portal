import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  X, Upload, Plus, Image as ImageIcon, FileText, 
  Loader2, Check, Briefcase, GraduationCap, Code, 
  Link as LinkIcon, User, MapPin, Award, Target, Trash2
} from 'lucide-react';
import toast from 'react-hot-toast';
import { updateProfile, uploadFile, uploadResume } from '../services/api';

const Section = ({ title, icon: Icon, children, autoFilled }) => (
  <div className={`bg-white rounded-2xl p-6 border transition-all duration-300 ${autoFilled ? 'border-emerald-200 bg-emerald-50/10' : 'border-slate-200'}`}>
    <div className="flex items-center justify-between mb-6">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600">
          <Icon size={20} />
        </div>
        <h3 className="text-sm font-black text-slate-900 uppercase tracking-widest">{title}</h3>
      </div>
      {autoFilled && <span className="text-[10px] bg-emerald-500 text-white px-2 py-0.5 rounded-full font-black uppercase tracking-tighter">AI Auto-filled</span>}
    </div>
    {children}
  </div>
);

const ProfileForm = ({ initialData }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [autoFilledFields, setAutoFilledFields] = useState([]);

  const [formData, setFormData] = useState({
    userType: 'fresher',
    profileImage: '',
    headline: '',
    location: '',
    about: '',
    skills: [],
    resumeUrl: '',
    experience: [],
    education: [],
    projects: [],
    certifications: [],
    links: { linkedin: '', github: '', portfolio: '' },
    job_preferences: { role: '', location: '', type: 'Full-time', salary: '' },
    dob: '',
    gender: '',
    languages: [],
    internships: []
  });

  const [skillInput, setSkillInput] = useState('');
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (initialData && !formData.headline && !formData.about) {
      setFormData(prev => ({
        ...prev,
        ...initialData,
        dob: initialData.dob ? initialData.dob.split('T')[0] : '',
        links: initialData.links || prev.links,
        job_preferences: initialData.job_preferences || prev.job_preferences,
        skills: initialData.skills || [],
        experience: initialData.experience || [],
        education: initialData.education || [],
        projects: initialData.projects || [],
        internships: initialData.internships || []
      }));
      setImagePreview(initialData.profileImage);
    }
  }, [initialData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('.')) {
      const [parent, child] = name.split('.');
      setFormData(prev => ({
        ...prev,
        [parent]: { ...prev[parent], [child]: value }
      }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    setAutoFilledFields(prev => prev.filter(f => f !== name));
  };

  const addArrayItem = (field, template) => {
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] || []), template]
    }));
  };

  const removeArrayItem = (field, index) => {
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].filter((_, i) => i !== index)
    }));
  };

  const handleArrayChange = (field, index, e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [field]: prev[field].map((item, i) => i === index ? { ...item, [name]: value } : item)
    }));
  };

  const handleFileUpload = async (e, type) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('file', file);

    try {
      setLoading(true);
      if (type === 'resume') setAnalyzing(true);
      
      let res;
      if (type === 'image') {
        res = await uploadFile(data);
        setFormData(prev => ({ ...prev, profileImage: res.url }));
        setImagePreview(res.url);
        toast.success("Image uploaded!");
      } else {
        res = await uploadResume(data);
        const { resumeUrl, ...parsedData } = res;
        
        const newFilled = [];
        const updatedData = { ...formData, ...parsedData, resumeUrl };
        
        Object.keys(parsedData).forEach(key => {
          if (parsedData[key] && (!formData[key] || (Array.isArray(formData[key]) && formData[key].length === 0))) {
            newFilled.push(key);
          }
        });

        setFormData(updatedData);
        setAutoFilledFields(newFilled);
        toast.success("AI parsed your resume & auto-filled the form!");
      }
    } catch (error) {
      toast.error("Upload failed. Please try again.");
    } finally {
      setLoading(false);
      setAnalyzing(false);
    }
  };

  const calculateProgress = () => {
    const fields = ['profileImage', 'headline', 'location', 'about', 'resumeUrl'];
    const filled = fields.filter(f => formData[f]).length;
    const arrayFilled = ((formData.skills || []).length > 0 ? 1 : 0) + ((formData.education || []).length > 0 ? 1 : 0);
    return Math.round(((filled + arrayFilled) / (fields.length + 2)) * 100);
  };

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-20">
      <div className="sticky top-4 z-30 bg-white/80 backdrop-blur-md p-4 rounded-2xl border border-slate-200 shadow-xl flex items-center justify-between gap-8">
        <div className="flex-1">
          <div className="flex justify-between text-[10px] font-black text-slate-400 uppercase mb-2">
            <span>Profile Completeness</span>
            <span>{calculateProgress()}%</span>
          </div>
          <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
            <div className="h-full bg-emerald-500 transition-all duration-1000" style={{ width: `${calculateProgress()}%` }}></div>
          </div>
        </div>
        <button 
          type="button"
          onClick={() => setFormData(p => ({ ...p, userType: p.userType === 'fresher' ? 'experienced' : 'fresher' }))}
          className="px-4 py-2 bg-slate-900 text-white text-[10px] font-black uppercase rounded-xl hover:bg-slate-800 transition-all whitespace-nowrap"
        >
          Switch to {formData.userType === 'fresher' ? 'Experienced' : 'Fresher'}
        </button>
      </div>

      <form onSubmit={async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
          await updateProfile(formData);
          toast.success("Profile saved!");
          navigate("/profile");
        } catch (e) { toast.error("Failed to save"); }
        finally { setLoading(false); }
      }} className="space-y-8">
        
        <Section title="Basic Information" icon={User} autoFilled={autoFilledFields.includes('headline')}>
          <div className="flex flex-col md:flex-row gap-8">
            <div className="relative group mx-auto md:mx-0">
              <div className="w-32 h-32 rounded-full overflow-hidden border-4 border-slate-50 shadow-md bg-slate-100">
                {imagePreview ? <img src={imagePreview} className="w-full h-full object-cover" alt="Profile" /> : <ImageIcon className="m-10 text-slate-300" />}
              </div>
              <label className="absolute bottom-1 right-1 w-8 h-8 bg-emerald-600 rounded-full flex items-center justify-center text-white cursor-pointer shadow-lg">
                <Upload size={16} /><input type="file" className="hidden" accept="image/*" onChange={e => handleFileUpload(e, 'image')} />
              </label>
            </div>
            <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Headline</label>
                <input name="headline" value={formData.headline} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="e.g. Senior Product Designer" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Location</label>
                <input name="location" value={formData.location} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" placeholder="City, Country" />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">Gender</label>
                <select name="gender" value={formData.gender} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm bg-white">
                  <option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option>
                </select>
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-black text-slate-400 uppercase">DOB</label>
                <input type="date" name="dob" value={formData.dob} onChange={handleChange} className="w-full px-4 py-2.5 border border-slate-200 rounded-xl text-sm" />
              </div>
            </div>
          </div>
        </Section>

        <Section title="Resume / CV" icon={FileText}>
          <div className={`relative border-2 border-dashed rounded-2xl p-8 text-center transition-all ${analyzing ? 'border-emerald-500 bg-emerald-50/30' : 'border-slate-200 hover:border-emerald-500'}`}>
            <input type="file" className="absolute inset-0 opacity-0 cursor-pointer" accept=".pdf,.doc,.docx" onChange={e => handleFileUpload(e, 'resume')} />
            <div className="space-y-2 pointer-events-none">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center mx-auto ${analyzing ? 'bg-emerald-600 text-white animate-pulse' : 'bg-emerald-50 text-emerald-600'}`}>
                {analyzing ? <Loader2 className="animate-spin" /> : <FileText />}
              </div>
              <p className="text-sm font-bold text-slate-700">{analyzing ? 'AI is analyzing your resume...' : 'Click to upload or drag & drop'}</p>
              {formData.resumeUrl && <p className="text-[10px] text-emerald-600 font-black uppercase">✓ Resume Uploaded</p>}
            </div>
          </div>
        </Section>

        <Section title="About" icon={Target} autoFilled={autoFilledFields.includes('about')}>
          <textarea name="about" value={formData.about} onChange={handleChange} rows="4" className="w-full px-4 py-3 border border-slate-200 rounded-xl text-sm outline-none focus:border-emerald-500 resize-none" placeholder="Tell us about your professional journey..." />
        </Section>

        <Section title={formData.userType === 'fresher' ? 'Internships & Trainings' : 'Work Experience'} icon={Briefcase}>
          <div className="space-y-4">
            {(formData.userType === 'experienced' ? (formData.experience || []) : (formData.internships || [])).map((exp, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl space-y-4 relative bg-slate-50/30">
                <button type="button" onClick={() => removeArrayItem(formData.userType === 'experienced' ? 'experience' : 'internships', i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input name="company" value={exp.company || ''} onChange={e => handleArrayChange(formData.userType === 'experienced' ? 'experience' : 'internships', i, e)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Company Name" />
                  <input name="role" value={exp.role || ''} onChange={e => handleArrayChange(formData.userType === 'experienced' ? 'experience' : 'internships', i, e)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Role" />
                  <input name="duration" value={exp.duration || ''} onChange={e => handleArrayChange(formData.userType === 'experienced' ? 'experience' : 'internships', i, e)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Jan 2022 - Present" />
                </div>
                {formData.userType === 'experienced' && (
                  <textarea name="responsibilities" value={exp.responsibilities || ''} onChange={e => handleArrayChange('experience', i, e)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm h-20" placeholder="Key Responsibilities..." />
                )}
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem(formData.userType === 'experienced' ? 'experience' : 'internships', { company: '', role: '', duration: '', responsibilities: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-black uppercase hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Add {formData.userType === 'experienced' ? 'Experience' : 'Internship'}
            </button>
          </div>
        </Section>

        <Section title="Education" icon={GraduationCap}>
          <div className="space-y-4">
            {(formData.education || []).map((edu, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl grid grid-cols-1 md:grid-cols-3 gap-4 relative bg-slate-50/30">
                <button type="button" onClick={() => removeArrayItem('education', i)} className="absolute -top-2 -right-2 w-6 h-6 bg-white border border-slate-200 rounded-full flex items-center justify-center text-slate-400 hover:text-red-500 shadow-sm"><X size={12} /></button>
                <input name="degree" value={edu.degree || ''} onChange={e => handleArrayChange('education', i, e)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Degree (e.g. B.Tech)" />
                <input name="college" value={edu.college || ''} onChange={e => handleArrayChange('education', i, e)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="College/University" />
                <input name="year" value={edu.year || ''} onChange={e => handleArrayChange('education', i, e)} className="px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Passing Year" />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('education', { degree: '', college: '', year: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-black uppercase hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Add Education
            </button>
          </div>
        </Section>

        <Section title="Projects" icon={Code}>
          <div className="space-y-4">
            {(formData.projects || []).map((proj, i) => (
              <div key={i} className="p-4 border border-slate-100 rounded-xl space-y-3 bg-slate-50/30 relative">
                <button type="button" onClick={() => removeArrayItem('projects', i)} className="absolute top-4 right-4 text-slate-400 hover:text-red-500"><Trash2 size={16} /></button>
                <input name="title" value={proj.title || ''} onChange={e => handleArrayChange('projects', i, e)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm font-bold" placeholder="Project Title" />
                <textarea name="description" value={proj.description || ''} onChange={e => handleArrayChange('projects', i, e)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm h-20" placeholder="Brief Description..." />
                <div className="space-y-1">
                  <label className="text-[10px] font-black text-slate-400 uppercase">Technologies (comma separated)</label>
                  <input name="technologies_used" value={Array.isArray(proj.technologies_used) ? proj.technologies_used.join(', ') : (proj.technologies_used || '')} onChange={e => handleArrayChange('projects', i, { target: { name: 'technologies_used', value: e.target.value.split(',').map(s => s.trim()) } })} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="e.g. React, Node.js, MongoDB" />
                </div>
                <input name="project_link" value={proj.project_link || proj.link || ''} onChange={e => handleArrayChange('projects', i, e)} className="w-full px-4 py-2 border border-slate-200 rounded-lg text-sm" placeholder="Project Link (GitHub/Live)" />
              </div>
            ))}
            <button type="button" onClick={() => addArrayItem('projects', { title: '', description: '', technologies_used: [], project_link: '' })} className="w-full py-3 border-2 border-dashed border-slate-200 rounded-xl text-slate-400 text-xs font-black uppercase hover:border-emerald-500 hover:text-emerald-600 transition-all flex items-center justify-center gap-2">
              <Plus size={16} /> Add Project
            </button>
          </div>
        </Section>

        <Section title="Skills" icon={Award}>
          <div className="flex gap-2 mb-4">
            <input value={skillInput} onChange={e => setSkillInput(e.target.value)} onKeyPress={e => e.key === 'Enter' && (e.preventDefault(), setFormData(p => ({ ...p, skills: [...new Set([...(p.skills || []), skillInput.trim()])] })), setSkillInput(''))} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="Add a skill (e.g. React)" />
            <button type="button" onClick={() => { if(skillInput.trim()) setFormData(p => ({ ...p, skills: [...new Set([...(p.skills || []), skillInput.trim()])] })); setSkillInput(''); }} className="p-2 bg-slate-900 text-white rounded-xl"><Plus /></button>
          </div>
          <div className="flex flex-wrap gap-2">
            {(formData.skills || []).map(s => (
              <span key={s} className="px-3 py-1 bg-slate-100 text-slate-600 text-[10px] font-black uppercase rounded-lg border border-slate-200 flex items-center gap-2">
                {s} <X size={12} className="cursor-pointer hover:text-red-500" onClick={() => setFormData(p => ({ ...p, skills: (p.skills || []).filter(sk => sk !== s) }))} />
              </span>
            ))}
          </div>
        </Section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <Section title="Social Links" icon={LinkIcon}>
            <div className="space-y-4">
              <div className="flex items-center gap-3"><span className="text-[10px] font-black text-slate-400 uppercase w-20">LinkedIn</span><input name="links.linkedin" value={formData.links.linkedin} onChange={handleChange} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm" /></div>
              <div className="flex items-center gap-3"><span className="text-[10px] font-black text-slate-400 uppercase w-20">GitHub</span><input name="links.github" value={formData.links.github} onChange={handleChange} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm" /></div>
              <div className="flex items-center gap-3"><span className="text-[10px] font-black text-slate-400 uppercase w-20">Portfolio</span><input name="links.portfolio" value={formData.links.portfolio} onChange={handleChange} className="flex-1 px-4 py-2 border border-slate-200 rounded-xl text-sm" /></div>
            </div>
          </Section>
          <Section title="Job Preferences" icon={Target}>
            <div className="space-y-4">
              <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Preferred Role</label><input name="job_preferences.role" value={formData.job_preferences.role} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" /></div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Salary (Exp)</label><input name="job_preferences.salary" value={formData.job_preferences.salary} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm" placeholder="e.g. 12LPA" /></div>
                <div className="space-y-1"><label className="text-[10px] font-black text-slate-400 uppercase">Job Type</label><select name="job_preferences.type" value={formData.job_preferences.type} onChange={handleChange} className="w-full px-4 py-2 border border-slate-200 rounded-xl text-sm bg-white"><option value="Full-time">Full-time</option><option value="Internship">Internship</option><option value="Contract">Contract</option></select></div>
              </div>
            </div>
          </Section>
        </div>

        <div className="fixed bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-5xl bg-white border border-slate-200 shadow-2xl p-4 rounded-2xl flex items-center justify-between z-40">
          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest hidden sm:block">Ready to take the next step?</p>
          <div className="flex gap-4">
            <button type="button" onClick={() => navigate("/profile")} className="px-6 py-2.5 text-slate-600 font-black text-[10px] uppercase hover:bg-slate-50 rounded-xl transition-all">Cancel</button>
            <button type="submit" disabled={loading} className="px-8 py-2.5 bg-emerald-600 text-white font-black text-[10px] uppercase rounded-xl hover:bg-emerald-700 shadow-lg shadow-emerald-600/20 disabled:opacity-50 flex items-center gap-2 transition-all">
              {loading ? <Loader2 className="animate-spin" /> : <><Check size={16} /> Save Profile</>}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default ProfileForm;
