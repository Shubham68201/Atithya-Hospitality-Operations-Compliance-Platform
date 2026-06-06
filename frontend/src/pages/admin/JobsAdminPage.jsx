import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchJobs, createJob, updateJob, deleteJob } from "../../features/careers/careersSlice";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiX } from "react-icons/hi";

const jobSchema = z.object({
  title:       z.string().min(2, "Title required"),
  department:  z.string().min(2, "Department required"),
  location:    z.string().min(2, "Location required"),
  type:        z.enum(["Full-Time","Part-Time","Contract","Internship","Freelance"]),
  experience:  z.string().min(1, "Experience required"),
  description: z.string().min(20, "Description min 20 chars"),
  salary:      z.string().optional(),
  deadline:    z.string().optional(),
  isActive:    z.boolean().optional(),
});

function JobFormModal({ job, onClose }) {
  const dispatch = useDispatch();
  const isEdit = !!job;
  const [reqInput,      setReqInput]      = useState("");
  const [requirements,  setRequirements]  = useState(job?.requirements || []);
  const [saving,        setSaving]        = useState(false);

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(jobSchema),
    defaultValues: job ? {
      title: job.title, department: job.department, location: job.location,
      type: job.type, experience: job.experience, description: job.description,
      salary: job.salary || "", deadline: job.deadline ? job.deadline.split("T")[0] : "",
      isActive: job.isActive,
    } : { type: "Full-Time", isActive: true },
  });

  const addReq = () => {
    const v = reqInput.trim();
    if (v && !requirements.includes(v)) { setRequirements([...requirements, v]); setReqInput(""); }
  };

  const onSubmit = async (data) => {
    setSaving(true);
    const payload = { ...data, requirements };
    try {
      if (isEdit) {
        const res = await dispatch(updateJob({ id: job._id, ...payload }));
        if (updateJob.fulfilled.match(res)) { toast.success("Job updated"); onClose(); }
        else toast.error(res.payload || "Update failed");
      } else {
        const res = await dispatch(createJob(payload));
        if (createJob.fulfilled.match(res)) { toast.success("Job created"); onClose(); }
        else toast.error(res.payload || "Create failed");
      }
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        <div className="bg-navy px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h3 className="font-cinzel text-gold text-lg">{isEdit ? "Edit Job" : "Post New Job"}</h3>
          <button onClick={onClose} className="text-[#9BB0C9] hover:text-ivory"><HiX size={20} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Job Title *</label>
              <input className="input-field" placeholder="e.g. Full Stack Developer" {...register("title")} />
              {errors.title && <p className="error-text">{errors.title.message}</p>}
            </div>
            <div>
              <label className="label-field">Department *</label>
              <input className="input-field" placeholder="e.g. Engineering" {...register("department")} />
              {errors.department && <p className="error-text">{errors.department.message}</p>}
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Location *</label>
              <input className="input-field" placeholder="e.g. Varanasi (Hybrid)" {...register("location")} />
              {errors.location && <p className="error-text">{errors.location.message}</p>}
            </div>
            <div>
              <label className="label-field">Type *</label>
              <select className="input-field" {...register("type")}>
                {["Full-Time","Part-Time","Contract","Internship","Freelance"].map((t) => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Experience *</label>
              <input className="input-field" placeholder="e.g. 2-4 years" {...register("experience")} />
              {errors.experience && <p className="error-text">{errors.experience.message}</p>}
            </div>
            <div>
              <label className="label-field">Salary (optional)</label>
              <input className="input-field" placeholder="e.g. ₹6L–₹12L p.a." {...register("salary")} />
            </div>
          </div>

          <div>
            <label className="label-field">Description *</label>
            <textarea rows={4} className="input-field resize-none" placeholder="Role description..." {...register("description")} />
            {errors.description && <p className="error-text">{errors.description.message}</p>}
          </div>

          <div>
            <label className="label-field">Requirements / Skills</label>
            <div className="flex gap-2 mb-2">
              <input className="input-field flex-1 py-2 text-sm" placeholder="e.g. React.js"
                value={reqInput} onChange={(e) => setReqInput(e.target.value)}
                onKeyDown={(e) => { if (e.key === "Enter") { e.preventDefault(); addReq(); } }} />
              <button type="button" onClick={addReq} className="btn-gold text-sm px-4 py-2 rounded-lg">Add</button>
            </div>
            {requirements.length > 0 && (
              <div className="flex flex-wrap gap-2">
                {requirements.map((r) => (
                  <span key={r} className="bg-navy/5 text-navy text-xs px-2.5 py-1.5 rounded-full flex items-center gap-1">
                    {r}
                    <button onClick={() => setRequirements(requirements.filter((x) => x !== r))} className="text-gray-400 hover:text-red-500">×</button>
                  </span>
                ))}
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="label-field">Deadline</label>
              <input type="date" className="input-field" {...register("deadline")} />
            </div>
            <div className="flex items-center gap-3 pt-6">
              <input type="checkbox" id="isActive" className="w-4 h-4 accent-gold" {...register("isActive")} defaultChecked />
              <label htmlFor="isActive" className="text-sm text-charcoal font-medium cursor-pointer">Active / Visible to applicants</label>
            </div>
          </div>
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button onClick={onClose} className="btn-outline-gold text-sm px-5 py-2.5 rounded-lg">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={saving} className="btn-gold text-sm px-5 py-2.5 rounded-lg disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Update Job" : "Post Job"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function JobsAdminPage() {
  const dispatch = useDispatch();
  const { jobs, loading } = useSelector((s) => s.careers);
  const [showModal,    setShowModal]    = useState(false);
  const [editJob,      setEditJob]      = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");  // "all" | "active" | "inactive"

  // Always fetch ALL jobs (no isActive filter sent to backend)
  // We filter client-side so "all" tab works correctly
  useEffect(() => {
    dispatch(fetchJobs({}));
  }, [dispatch]);

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete job "${title}"?`)) return;
    const res = await dispatch(deleteJob(id));
    if (deleteJob.fulfilled.match(res)) toast.success("Job deleted");
    else toast.error(res.payload || "Delete failed");
  };

  const filtered = jobs.filter((j) => {
    if (activeFilter === "active")   return j.isActive === true;
    if (activeFilter === "inactive") return j.isActive === false;
    return true; // "all"
  });

  const counts = {
    all:      jobs.length,
    active:   jobs.filter((j) => j.isActive).length,
    inactive: jobs.filter((j) => !j.isActive).length,
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Job Postings</h1>
          <p className="text-gray-500 text-sm mt-0.5">{jobs.length} total positions</p>
        </div>
        <button
          onClick={() => { setEditJob(null); setShowModal(true); }}
          className="btn-gold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2"
        >
          <HiOutlinePlus size={16} /> Post New Job
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[
          { key: "all",      label: "All" },
          { key: "active",   label: "Active" },
          { key: "inactive", label: "Inactive" },
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setActiveFilter(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
              activeFilter === key ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"
            }`}
          >
            {label}
            <span className={`text-xs px-1.5 py-0.5 rounded-full ${activeFilter === key ? "bg-gold/20 text-gold" : "bg-gray-200 text-gray-500"}`}>
              {counts[key]}
            </span>
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading jobs...</div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-400">
            {activeFilter === "all"
              ? "No jobs yet."
              : `No ${activeFilter} jobs.`}
          </p>
          {activeFilter === "all" && (
            <button onClick={() => setShowModal(true)} className="text-gold hover:underline text-sm mt-2">Post one now.</button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((job) => (
            <motion.div key={job._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="card-elegant hover:shadow-md transition-shadow"
            >
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex flex-wrap items-center gap-2 mb-1">
                    <h3 className="font-cinzel text-navy text-base font-semibold">{job.title}</h3>
                    <span className="text-xs bg-gold/10 text-gold px-2 py-0.5 rounded-full">{job.type}</span>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${job.isActive ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"}`}>
                      {job.isActive ? "Active" : "Inactive"}
                    </span>
                  </div>
                  <p className="text-gold text-sm mb-2">{job.department} · {job.location}</p>
                  <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-3">
                    <span>Exp: {job.experience}</span>
                    {job.salary   && <span>Salary: {job.salary}</span>}
                    {job.deadline && <span>Deadline: {new Date(job.deadline).toLocaleDateString("en-IN")}</span>}
                  </div>
                  {job.requirements?.length > 0 && (
                    <div className="flex flex-wrap gap-1.5">
                      {job.requirements.slice(0, 5).map((r) => (
                        <span key={r} className="bg-navy/5 text-navy text-xs px-2 py-0.5 rounded-full">{r}</span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex gap-2 flex-shrink-0">
                  <button onClick={() => { setEditJob(job); setShowModal(true); }} className="p-2 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <HiOutlinePencil size={16} />
                  </button>
                  <button onClick={() => handleDelete(job._id, job.title)} className="p-2 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                    <HiOutlineTrash size={16} />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <JobFormModal
            job={editJob}
            onClose={() => { setShowModal(false); setEditJob(null); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
