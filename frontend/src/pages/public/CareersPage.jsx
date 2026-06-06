import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs } from "../../features/careers/careersSlice";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import {
  HiOutlineBriefcase, HiOutlineLocationMarker, HiOutlineClock,
  HiX, HiOutlineUpload, HiOutlineCheckCircle,
} from "react-icons/hi";

function JobCard({ job, onApply }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
      className="card-elegant hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
    >
      <div className="flex flex-wrap items-start justify-between gap-3 mb-4">
        <div>
          <h3 className="font-cinzel text-navy text-lg font-semibold">{job.title}</h3>
          <p className="text-gold text-sm mt-0.5">{job.department}</p>
        </div>
        <span className="badge-status bg-gold/10 text-gold border border-gold/20 text-xs px-3 py-1 rounded-full">{job.type}</span>
      </div>
      <div className="flex flex-wrap gap-3 mb-4">
        <span className="flex items-center gap-1.5 text-gray-500 text-sm"><HiOutlineLocationMarker size={14}/>{job.location}</span>
        <span className="flex items-center gap-1.5 text-gray-500 text-sm"><HiOutlineBriefcase size={14}/>{job.experience}</span>
        {job.salary && <span className="flex items-center gap-1.5 text-gray-500 text-sm"><HiOutlineClock size={14}/>{job.salary}</span>}
      </div>
      <p className="text-gray-500 text-sm leading-relaxed mb-4 line-clamp-2">{job.description}</p>
      {job.requirements?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-5">
          {job.requirements.slice(0, 4).map((r) => (
            <span key={r} className="bg-navy/5 text-navy text-xs px-2.5 py-1 rounded-full">{r}</span>
          ))}
          {job.requirements.length > 4 && <span className="text-gray-400 text-xs px-2 py-1">+{job.requirements.length - 4} more</span>}
        </div>
      )}
      <button onClick={() => onApply(job)} className="btn-gold w-full text-sm py-2.5 rounded-lg">Apply Now</button>
    </motion.div>
  );
}

function ApplyModal({ job, onClose }) {
  const [loading,    setLoading]    = useState(false);
  const [resumeFile, setResumeFile] = useState(null);
  const [dragOver,   setDragOver]   = useState(false);
  const [form, setForm] = useState({ name: "", email: "", phone: "", coverLetter: "" });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.name.trim())             e.name  = "Name is required";
    if (!form.email.trim())            e.email = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = "Valid email required";
    if (!form.phone.trim())            e.phone = "Phone is required";
    else if (form.phone.trim().length < 10)    e.phone = "Valid phone required";
    return e;
  };

  const handleFileSelect = (file) => {
    if (!file) return;
    const allowed = [
      "application/pdf",
      "application/msword",
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    ];
    if (!allowed.includes(file.type)) { toast.error("Only PDF, DOC, DOCX allowed"); return; }
    if (file.size > 5 * 1024 * 1024)  { toast.error("File must be under 5MB"); return; }
    setResumeFile(file);
    toast.success(`${file.name} selected`);
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setLoading(true);

    try {
      // Always use FormData so multer on the backend can parse everything
      const fd = new FormData();
      fd.append("name",  form.name.trim());
      fd.append("email", form.email.trim());
      fd.append("phone", form.phone.trim());
      if (form.coverLetter.trim()) fd.append("coverLetter", form.coverLetter.trim());
      if (resumeFile) fd.append("resume", resumeFile);

      await axiosInstance.post(`/careers/apply/${job._id}`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success("Application submitted! We'll be in touch soon.");
      onClose();
    } catch (err) {
      const msg = err.response?.data?.message || "Submission failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-md shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-navy px-6 py-5 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-cinzel text-gold text-lg">Apply for Position</h3>
            <p className="text-[#9BB0C9] text-xs mt-0.5">{job.title} · {job.department}</p>
          </div>
          <button onClick={onClose} className="text-[#9BB0C9] hover:text-ivory transition-colors"><HiX size={20}/></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="label-field">Full Name *</label>
            <input
              type="text" className="input-field" placeholder="Your full name"
              value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })}
            />
            {errors.name && <p className="error-text">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="label-field">Email Address *</label>
            <input
              type="email" className="input-field" placeholder="your@email.com"
              value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })}
            />
            {errors.email && <p className="error-text">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="label-field">Phone Number *</label>
            <input
              type="tel" className="input-field" placeholder="10-digit mobile number"
              value={form.phone} onChange={(e) => setForm({ ...form, phone: e.target.value })}
            />
            {errors.phone && <p className="error-text">{errors.phone}</p>}
          </div>

          {/* Resume upload */}
          <div>
            <label className="label-field">Resume / CV <span className="text-gray-400 font-normal">(PDF, DOC — max 5MB, optional)</span></label>
            <div
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => { e.preventDefault(); setDragOver(false); handleFileSelect(e.dataTransfer.files[0]); }}
              onClick={() => document.getElementById("resumeFileInput").click()}
              className={`mt-1 border-2 border-dashed rounded-xl p-5 text-center cursor-pointer transition-colors ${
                dragOver    ? "border-gold bg-gold/5" :
                resumeFile  ? "border-green-400 bg-green-50" :
                              "border-gray-200 hover:border-gold/60"
              }`}
            >
              <input
                id="resumeFileInput" type="file" accept=".pdf,.doc,.docx"
                className="hidden"
                onChange={(e) => handleFileSelect(e.target.files[0])}
              />
              {resumeFile ? (
                <div className="flex items-center justify-center gap-2 text-green-700">
                  <HiOutlineCheckCircle size={20}/>
                  <span className="text-sm font-medium truncate max-w-[200px]">{resumeFile.name}</span>
                  <button
                    type="button"
                    onClick={(e) => { e.stopPropagation(); setResumeFile(null); }}
                    className="text-gray-400 hover:text-red-500 ml-1 text-lg leading-none"
                  >×</button>
                </div>
              ) : (
                <div className="text-gray-400">
                  <HiOutlineUpload size={22} className="mx-auto mb-1.5"/>
                  <p className="text-sm">Drag & drop or <span className="text-gold font-medium">click to upload</span></p>
                  <p className="text-xs mt-1 text-gray-300">PDF, DOC, DOCX · max 5MB</p>
                </div>
              )}
            </div>
          </div>

          {/* Cover letter */}
          <div>
            <label className="label-field">Cover Letter <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              rows={3} className="input-field resize-none"
              placeholder="Why are you a great fit for this role?"
              value={form.coverLetter}
              onChange={(e) => setForm({ ...form, coverLetter: e.target.value })}
            />
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="btn-gold w-full py-3 rounded-lg disabled:opacity-60 text-sm font-semibold"
          >
            {loading ? "Submitting..." : "Submit Application"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function CareersPage() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((s) => s.careers);
  const [selectedJob, setSelectedJob] = useState(null);
  const [deptFilter,  setDeptFilter]  = useState("All");

  useEffect(() => { dispatch(fetchJobs({ isActive: "true" })); }, [dispatch]);

  const departments = ["All", ...new Set(jobs.map((j) => j.department))];
  const filtered    = deptFilter === "All" ? jobs : jobs.filter((j) => j.department === deptFilter);

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold text-sm tracking-[3px] uppercase font-medium mb-4">Join Our Team</p>
            <h1 className="font-cinzel text-4xl sm:text-5xl text-ivory mb-6">
              Build the Future of<br /><span className="text-gold">Indian Hospitality</span>
            </h1>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6"/>
            <p className="text-[#9BB0C9] text-lg max-w-2xl mx-auto leading-relaxed">
              We're a fast-growing startup on a mission to transform how India's hotels operate.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Perks */}
      <section className="py-12 bg-ivory border-b border-gray-100">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
            {[{emoji:"🚀",label:"Fast Growth"},{emoji:"🏠",label:"Remote Friendly"},{emoji:"🎓",label:"Learning Budget"},{emoji:"🌟",label:"Equity Options"}].map(({emoji,label})=>(
              <div key={label} className="p-5 bg-white rounded-xl border border-gray-100 shadow-sm">
                <div className="text-3xl mb-2">{emoji}</div>
                <p className="font-medium text-navy text-sm">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Jobs */}
      <section className="py-20 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-10">
            <h2 className="section-heading mb-4">Open Positions</h2>
            <div className="gold-divider mx-auto"/>
          </motion.div>

          {departments.length > 1 && (
            <div className="flex flex-wrap gap-2 justify-center mb-8">
              {departments.map((d) => (
                <button key={d} onClick={() => setDeptFilter(d)}
                  className={`text-sm px-4 py-1.5 rounded-full border transition-all ${deptFilter === d ? "bg-navy text-ivory border-navy" : "border-gray-200 text-gray-600 hover:border-gold"}`}>
                  {d}
                </button>
              ))}
            </div>
          )}

          {loading ? (
            <div className="text-center py-20 text-gray-400">Loading opportunities...</div>
          ) : filtered.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-gray-400 text-lg">No open positions right now.</p>
              <p className="text-gray-400 text-sm mt-2">Check back soon or send your CV to sriperumal.aperio@gmail.com</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {filtered.map((job) => <JobCard key={job._id} job={job} onApply={setSelectedJob}/>)}
            </div>
          )}
        </div>
      </section>

      <AnimatePresence>
        {selectedJob && <ApplyModal job={selectedJob} onClose={() => setSelectedJob(null)}/>}
      </AnimatePresence>
    </div>
  );
}
