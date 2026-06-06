import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchApplications } from "../../features/careers/careersSlice";
import axiosInstance from "../../api/axiosInstance";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlineDownload, HiOutlineRefresh } from "react-icons/hi";

const STATUSES = ["Applied","Reviewing","Shortlisted","Interview","Hired","Rejected"];

const statusColor = (s) => ({
  Applied:     "bg-blue-100 text-blue-700",
  Reviewing:   "bg-yellow-100 text-yellow-700",
  Shortlisted: "bg-indigo-100 text-indigo-700",
  Interview:   "bg-purple-100 text-purple-700",
  Hired:       "bg-green-100 text-green-700",
  Rejected:    "bg-red-100 text-red-600",
}[s] || "bg-gray-100 text-gray-500");

export default function ApplicationsPage() {
  const dispatch = useDispatch();
  const { applications, pagination, loading } = useSelector((s) => s.careers);
  const { jobs } = useSelector((s) => s.careers);
  const [statusFilter, setStatusFilter] = useState("");
  const [jobFilter,    setJobFilter]    = useState("");
  const [page,         setPage]         = useState(1);

  const load = () => {
    dispatch(fetchApplications({
      page,
      limit: 20,
      status: statusFilter || undefined,
      jobId: jobFilter || undefined,
    }));
  };

  useEffect(() => { load(); }, [page, statusFilter, jobFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/careers/applications/${id}/status`, { status });
      toast.success("Status updated");
      load();
    } catch { toast.error("Update failed"); }
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Job Applications</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination?.total || 0} total applications</p>
        </div>
        <button onClick={load} className="btn-outline-gold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <HiOutlineRefresh size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2.5 w-auto min-w-[160px]">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={jobFilter} onChange={(e) => { setJobFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2.5 w-auto min-w-[200px]">
          <option value="">All Jobs</option>
          {jobs.map((j) => <option key={j._id} value={j._id}>{j.title}</option>)}
        </select>
      </div>

      {/* Status summary */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map((s) => {
          const count = applications.filter((a) => a.status === s).length;
          return (
            <div key={s} className={`text-xs px-3 py-1.5 rounded-full ${statusColor(s)}`}>
              {s} {count > 0 && <span className="ml-1 font-bold">{count}</span>}
            </div>
          );
        })}
      </div>

      {/* Table */}
      <div className="card-elegant overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Applicant","Email","Phone","Job","Dept","Status","Resume","Date"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : applications.length === 0 ? (
              <tr><td colSpan={8} className="text-center py-12 text-gray-400">No applications found</td></tr>
            ) : applications.map((app) => (
              <motion.tr key={app._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                className="border-b border-gray-50 hover:bg-gray-50/50"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-navy font-bold text-xs">{app.name?.[0]}</span>
                    </div>
                    <span className="font-medium text-navy">{app.name}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-500 text-xs">{app.email}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{app.phone}</td>
                <td className="py-3 px-4">
                  <p className="font-medium text-navy text-xs">{app.job?.title || "—"}</p>
                </td>
                <td className="py-3 px-4 text-gray-400 text-xs">{app.job?.department || "—"}</td>
                <td className="py-3 px-4">
                  <select
                    value={app.status}
                    onChange={(e) => updateStatus(app._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColor(app.status)}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-3 px-4">
                  {app.resumeUrl ? (
                    <a href={app.resumeUrl} target="_blank" rel="noopener noreferrer"
                      className="text-xs bg-blue-50 text-blue-600 px-2.5 py-1.5 rounded-lg hover:bg-blue-100 flex items-center gap-1 w-fit">
                      <HiOutlineDownload size={12} /> CV
                    </a>
                  ) : <span className="text-gray-300 text-xs">—</span>}
                </td>
                <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(app.createdAt).toLocaleDateString("en-IN")}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Prev</button>
            <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
