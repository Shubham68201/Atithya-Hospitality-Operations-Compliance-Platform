import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchDemos, updateDemoStatus } from "../../features/demo/demoSlice";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { HiOutlineSearch, HiOutlineRefresh, HiX, HiOutlineChat } from "react-icons/hi";

const STATUSES = ["New","Contacted","Qualified","Demo Scheduled","Converted","Closed"];

const statusColor = (s) => ({
  "New":            "bg-blue-100 text-blue-700",
  "Contacted":      "bg-yellow-100 text-yellow-700",
  "Qualified":      "bg-indigo-100 text-indigo-700",
  "Demo Scheduled": "bg-purple-100 text-purple-700",
  "Converted":      "bg-green-100 text-green-700",
  "Closed":         "bg-gray-100 text-gray-500",
}[s] || "bg-gray-100 text-gray-500");

function DemoDetailModal({ demo, onClose, onStatusChange }) {
  const [note,    setNote]    = useState("");
  const [saving,  setSaving]  = useState(false);

  const addNote = async () => {
    if (!note.trim()) return;
    setSaving(true);
    try {
      await axiosInstance.post(`/demo/${demo._id}/notes`, { text: note });
      toast.success("Note added");
      setNote("");
      onClose(); // parent will re-fetch
    } catch { toast.error("Failed to add note"); }
    finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[90vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-navy px-6 py-4 flex items-center justify-between flex-shrink-0">
          <div>
            <h3 className="font-cinzel text-gold text-lg">{demo.companyName}</h3>
            <p className="text-[#9BB0C9] text-xs mt-0.5">{demo.contactPerson} · {demo.email}</p>
          </div>
          <button onClick={onClose} className="text-[#9BB0C9] hover:text-ivory"><HiX size={20} /></button>
        </div>

        <div className="overflow-y-auto flex-1 p-6 space-y-5">
          {/* Details */}
          <div className="grid grid-cols-2 gap-3 text-sm">
            {[
              { label: "Phone",       value: demo.phone },
              { label: "Property",    value: demo.propertyType },
              { label: "Properties",  value: demo.numberOfProperties },
              { label: "Submitted",   value: new Date(demo.createdAt).toLocaleDateString("en-IN") },
            ].map(({ label, value }) => (
              <div key={label} className="bg-gray-50 rounded-lg p-3">
                <p className="text-gray-400 text-xs uppercase tracking-wider mb-0.5">{label}</p>
                <p className="text-navy font-medium">{value}</p>
              </div>
            ))}
          </div>

          {demo.message && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Message</p>
              <p className="text-gray-600 text-sm bg-gray-50 rounded-lg p-3">{demo.message}</p>
            </div>
          )}

          {/* Status */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Update Status</p>
            <select
              value={demo.status}
              onChange={(e) => onStatusChange(demo._id, e.target.value)}
              className="input-field text-sm py-2.5"
            >
              {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>

          {/* Notes */}
          {demo.notes?.length > 0 && (
            <div>
              <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Notes ({demo.notes.length})</p>
              <div className="space-y-2">
                {demo.notes.map((n, i) => (
                  <div key={i} className="bg-blue-50 rounded-lg p-3">
                    <p className="text-sm text-gray-700">{n.text}</p>
                    <p className="text-xs text-gray-400 mt-1">{new Date(n.addedAt).toLocaleString("en-IN")}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Add note */}
          <div>
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-2">Add Note</p>
            <textarea
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              className="input-field resize-none text-sm"
              placeholder="Add an internal note..."
            />
            <button onClick={addNote} disabled={saving || !note.trim()} className="btn-gold mt-2 text-sm px-4 py-2 rounded-lg disabled:opacity-50 flex items-center gap-2">
              <HiOutlineChat size={14} /> {saving ? "Saving..." : "Add Note"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default function DemoRequestsPage() {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((s) => s.demo);
  const [search,       setSearch]       = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [page,         setPage]         = useState(1);
  const [selected,     setSelected]     = useState(null);

  const load = () => dispatch(fetchDemos({ page, limit: 20, search, status: statusFilter || undefined }));

  useEffect(() => { load(); }, [page, statusFilter]);

  const handleStatusChange = async (id, status) => {
    const res = await dispatch(updateDemoStatus({ id, status }));
    if (updateDemoStatus.fulfilled.match(res)) toast.success("Status updated");
    else toast.error("Update failed");
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Demo Requests</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination?.total || 0} total requests</p>
        </div>
        <button onClick={load} className="btn-outline-gold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <HiOutlineRefresh size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <div className="flex flex-1 min-w-[200px] gap-2">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text" placeholder="Search company, contact..."
              value={search} onChange={(e) => setSearch(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && load()}
              className="input-field pl-9 text-sm py-2.5"
            />
          </div>
          <button onClick={load} className="btn-gold text-sm px-4 py-2.5 rounded-lg">Search</button>
        </div>
        <select value={statusFilter} onChange={(e) => { setStatusFilter(e.target.value); setPage(1); }} className="input-field text-sm py-2.5 w-auto min-w-[160px]">
          <option value="">All Statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </div>

      {/* Status summary pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {STATUSES.map((s) => {
          const count = list.filter((d) => d.status === s).length;
          return (
            <button
              key={s}
              onClick={() => { setStatusFilter(statusFilter === s ? "" : s); setPage(1); }}
              className={`text-xs px-3 py-1.5 rounded-full border transition-all ${statusFilter === s ? "border-navy bg-navy text-ivory" : "border-gray-200 text-gray-500 hover:border-gold"}`}
            >
              {s} {count > 0 && <span className="ml-1 opacity-70">({count})</span>}
            </button>
          );
        })}
      </div>

      {/* Table */}
      <div className="card-elegant overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Company","Contact","Property","Count","Status","Date","Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No demo requests found</td></tr>
            ) : list.map((d) => (
              <motion.tr key={d._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="border-b border-gray-50 hover:bg-gray-50/50">
                <td className="py-3 px-4">
                  <p className="font-medium text-navy">{d.companyName}</p>
                  <p className="text-gray-400 text-xs">{d.email}</p>
                </td>
                <td className="py-3 px-4 text-gray-600">{d.contactPerson}</td>
                <td className="py-3 px-4 text-gray-500 text-xs">{d.propertyType}</td>
                <td className="py-3 px-4 text-center">
                  <span className="bg-navy/5 text-navy text-xs font-bold px-2 py-1 rounded-full">{d.numberOfProperties}</span>
                </td>
                <td className="py-3 px-4">
                  <select
                    value={d.status}
                    onChange={(e) => handleStatusChange(d._id, e.target.value)}
                    className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColor(d.status)}`}
                  >
                    {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                  </select>
                </td>
                <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">
                  {new Date(d.createdAt).toLocaleDateString("en-IN")}
                </td>
                <td className="py-3 px-4">
                  <button onClick={() => setSelected(d)} className="text-xs bg-gold/10 text-gold px-3 py-1.5 rounded-lg hover:bg-gold/20 transition-colors font-medium">
                    View
                  </button>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Prev</button>
            <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && (
          <DemoDetailModal
            demo={selected}
            onClose={() => { setSelected(null); load(); }}
            onStatusChange={handleStatusChange}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
