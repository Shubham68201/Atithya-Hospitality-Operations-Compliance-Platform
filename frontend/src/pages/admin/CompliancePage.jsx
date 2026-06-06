import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiX,
  HiOutlineRefresh, HiOutlineUpload, HiOutlineDocumentText,
  HiOutlineDownload, HiOutlineCheckCircle,
} from "react-icons/hi";

const CATEGORIES = ["Fire Safety","Health & Hygiene","Legal & Licensing","Staff Training","Food Safety","Security","Other"];
const STATUSES   = ["Pending","Compliant","Overdue","Non-Compliant"];

const statusColor = (s) => ({
  Compliant:       "bg-green-100 text-green-700",
  Pending:         "bg-yellow-100 text-yellow-700",
  Overdue:         "bg-red-100 text-red-600",
  "Non-Compliant": "bg-orange-100 text-orange-700",
}[s] || "bg-gray-100 text-gray-500");

/* ── Document Drop Zone ──────────────────────────────────────── */
function DocDropZone({ files, setFiles }) {
  const [dragOver, setDragOver] = useState(false);
  const inputRef = useRef();

  const validateFile = (file) => {
    const ok = ["application/pdf","image/jpeg","image/png","image/jpg"];
    if (!ok.includes(file.type)) { toast.error(`${file.name}: Only PDF, JPG, PNG allowed`); return false; }
    if (file.size > 10*1024*1024){ toast.error(`${file.name}: Must be under 10MB`); return false; }
    return true;
  };

  const addFiles = (incoming) => {
    const valid = Array.from(incoming).filter(validateFile);
    if (valid.length) setFiles((prev) => [...prev, ...valid]);
  };

  const remove = (idx) => setFiles((prev) => prev.filter((_, i) => i !== idx));

  return (
    <div>
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); addFiles(e.dataTransfer.files); }}
        onClick={() => inputRef.current.click()}
        className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-colors ${
          dragOver ? "border-gold bg-gold/5" : "border-gray-200 hover:border-gold/60"
        }`}
      >
        <input
          ref={inputRef} type="file" multiple accept=".pdf,.jpg,.jpeg,.png"
          className="hidden"
          onChange={(e) => addFiles(e.target.files)}
        />
        <HiOutlineUpload size={20} className="mx-auto mb-1 text-gray-400"/>
        <p className="text-xs text-gray-400">Drag & drop or <span className="text-gold font-medium">click to add files</span></p>
        <p className="text-[10px] text-gray-300 mt-0.5">PDF, JPG, PNG · up to 10MB each · multiple allowed</p>
      </div>

      {files.length > 0 && (
        <div className="mt-2 space-y-1">
          {files.map((f, i) => (
            <div key={i} className="flex items-center justify-between bg-green-50 border border-green-100 rounded-lg px-3 py-1.5">
              <div className="flex items-center gap-2 min-w-0">
                <HiOutlineCheckCircle size={14} className="text-green-500 flex-shrink-0"/>
                <span className="text-xs text-gray-700 truncate">{f.name}</span>
                <span className="text-[10px] text-gray-400 flex-shrink-0">({(f.size/1024).toFixed(0)} KB)</span>
              </div>
              <button onClick={(e)=>{e.stopPropagation();remove(i);}} className="text-gray-400 hover:text-red-500 ml-2 text-sm">×</button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Existing docs list with download ────────────────────────── */
function DocList({ docs }) {
  if (!docs || docs.length === 0) return null;
  return (
    <div className="mt-2 space-y-1">
      {docs.map((d, i) => (
        <div key={i} className="flex items-center justify-between bg-gray-50 rounded-lg px-3 py-2">
          <div className="flex items-center gap-2 min-w-0">
            <HiOutlineDocumentText size={15} className="text-gold flex-shrink-0"/>
            <span className="text-xs text-gray-700 truncate">{d.name || `Document ${i+1}`}</span>
          </div>
          <a href={d.url} target="_blank" rel="noopener noreferrer"
            className="flex items-center gap-1 text-xs bg-blue-50 text-blue-600 px-2.5 py-1 rounded-lg hover:bg-blue-100 transition-colors flex-shrink-0">
            <HiOutlineDownload size={12}/> Download
          </a>
        </div>
      ))}
    </div>
  );
}

/* ── Record Modal ─────────────────────────────────────────────── */
function RecordModal({ record, properties, onClose }) {
  const isEdit = !!record;
  const [saving,   setSaving]   = useState(false);
  const [newFiles, setNewFiles] = useState([]);
  const [uploading,setUploading]= useState(false);

  const [form, setForm] = useState({
    property: record?.property?._id || record?.property || "",
    title:    record?.title    || "",
    category: record?.category || "Fire Safety",
    status:   record?.status   || "Pending",
    dueDate:  record?.dueDate  ? record.dueDate.split("T")[0] : "",
    notes:    record?.notes    || "",
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const e = {};
    if (!form.property) e.property = "Select a property";
    if (!form.title.trim()) e.title = "Title is required";
    if (!form.dueDate)  e.dueDate  = "Due date is required";
    return e;
  };

  const handleSave = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    setErrors({});
    setSaving(true);

    try {
      let savedRecord;

      if (isEdit) {
        // Update text fields
        const { data } = await axiosInstance.put(`/compliance/${record._id}`, form);
        savedRecord = data.data.record;
      } else {
        // Create — send as FormData so documents can be attached in one request
        const fd = new FormData();
        Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
        newFiles.forEach((f) => fd.append("documents", f));

        const { data } = await axiosInstance.post("/compliance", fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        savedRecord = data.data.record;
      }

      // If editing and there are new files to upload
      if (isEdit && newFiles.length > 0) {
        setUploading(true);
        const fd = new FormData();
        newFiles.forEach((f) => fd.append("documents", f));
        await axiosInstance.post(`/compliance/${record._id}/documents`, fd, {
          headers: { "Content-Type": "multipart/form-data" },
        });
      }

      toast.success(isEdit ? "Record updated" : "Record created");
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to save record");
    } finally {
      setSaving(false);
      setUploading(false);
    }
  };

  const field = (name, label, required = false) => (
    <div>
      <label className="label-field">{label}{required && " *"}</label>
      <input className="input-field" value={form[name]} onChange={(e) => setForm({ ...form, [name]: e.target.value })}/>
      {errors[name] && <p className="error-text">{errors[name]}</p>}
    </div>
  );

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        {/* Header */}
        <div className="bg-navy px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h3 className="font-cinzel text-gold text-lg">{isEdit ? "Edit Record" : "Add Compliance Record"}</h3>
          <button onClick={() => onClose(false)} className="text-[#9BB0C9] hover:text-ivory"><HiX size={20}/></button>
        </div>

        {/* Body */}
        <div className="overflow-y-auto flex-1 p-6 space-y-4">

          {/* Property */}
          <div>
            <label className="label-field">Property *</label>
            <select
              className="input-field"
              value={form.property}
              onChange={(e) => setForm({ ...form, property: e.target.value })}
            >
              <option value="">— Select property —</option>
              {properties.map((p) => (
                <option key={p._id} value={p._id}>{p.name} ({p.city})</option>
              ))}
            </select>
            {errors.property && <p className="error-text">{errors.property}</p>}
            {properties.length === 0 && (
              <p className="text-amber-600 text-xs mt-1">
                ⚠ No properties found. Add properties in the Properties section first.
              </p>
            )}
          </div>

          {/* Title */}
          <div>
            <label className="label-field">Compliance Title *</label>
            <input
              className="input-field" placeholder="e.g. Annual Fire Safety Audit"
              value={form.title}
              onChange={(e) => setForm({ ...form, title: e.target.value })}
            />
            {errors.title && <p className="error-text">{errors.title}</p>}
          </div>

          {/* Category + Status */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="label-field">Category *</label>
              <select className="input-field" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}>
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label className="label-field">Status *</label>
              <select className="input-field" value={form.status} onChange={(e) => setForm({ ...form, status: e.target.value })}>
                {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
          </div>

          {/* Due date */}
          <div>
            <label className="label-field">Due Date *</label>
            <input
              type="date" className="input-field"
              value={form.dueDate}
              onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            />
            {errors.dueDate && <p className="error-text">{errors.dueDate}</p>}
          </div>

          {/* Notes */}
          <div>
            <label className="label-field">Notes <span className="text-gray-400 font-normal">(optional)</span></label>
            <textarea
              rows={2} className="input-field resize-none" placeholder="Additional notes..."
              value={form.notes}
              onChange={(e) => setForm({ ...form, notes: e.target.value })}
            />
          </div>

          {/* Documents section */}
          <div>
            <label className="label-field">
              Audit Documents <span className="text-gray-400 font-normal">(PDF, JPG, PNG — optional)</span>
            </label>

            {/* Existing docs if editing */}
            {isEdit && record.documents?.length > 0 && (
              <div className="mb-2">
                <p className="text-xs text-gray-400 mb-1">Existing documents:</p>
                <DocList docs={record.documents}/>
              </div>
            )}

            {/* Upload new docs */}
            <DocDropZone files={newFiles} setFiles={setNewFiles}/>
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button onClick={() => onClose(false)} className="btn-outline-gold text-sm px-5 py-2.5 rounded-lg">Cancel</button>
          <button
            onClick={handleSave}
            disabled={saving || uploading}
            className="btn-gold text-sm px-5 py-2.5 rounded-lg disabled:opacity-60"
          >
            {saving || uploading ? "Saving..." : isEdit ? "Update Record" : "Create Record"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

/* ── Main Page ────────────────────────────────────────────────── */
export default function CompliancePage() {
  const [records,      setRecords]      = useState([]);
  const [properties,   setProperties]   = useState([]);
  const [propsLoaded,  setPropsLoaded]  = useState(false);
  const [pagination,   setPagination]   = useState(null);
  const [loading,      setLoading]      = useState(false);
  const [showModal,    setShowModal]    = useState(false);
  const [editRecord,   setEditRecord]   = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [page,         setPage]         = useState(1);

  const loadRecords = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/compliance", {
        params: { page, limit: 20, status: statusFilter || undefined },
      });
      setRecords(data.data || []);
      setPagination(data.pagination);
    } catch { toast.error("Failed to load compliance records"); }
    finally { setLoading(false); }
  };

  const loadProperties = async () => {
    try {
      const { data } = await axiosInstance.get("/properties", { params: { limit: 200 } });
      setProperties(data.data || []);
    } catch (err) {
      console.error("loadProperties error:", err?.response?.data || err.message);
      setProperties([]);
    } finally {
      setPropsLoaded(true);
    }
  };

  useEffect(() => { loadProperties(); }, []);
  useEffect(() => { loadRecords(); }, [page, statusFilter]);

  const updateStatus = async (id, status) => {
    try {
      await axiosInstance.patch(`/compliance/${id}/status`, { status });
      setRecords((prev) => prev.map((r) => r._id === id ? { ...r, status } : r));
      toast.success("Status updated");
    } catch { toast.error("Update failed"); }
  };

  const handleDelete = async (id, title) => {
    if (!window.confirm(`Delete "${title}"?`)) return;
    try {
      await axiosInstance.delete(`/compliance/${id}`);
      toast.success("Deleted");
      loadRecords();
    } catch { toast.error("Delete failed"); }
  };

  const overdueCount   = records.filter((r) => r.status === "Overdue").length;
  const pendingCount   = records.filter((r) => r.status === "Pending").length;
  const compliantCount = records.filter((r) => r.status === "Compliant").length;

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Compliance Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination?.total || 0} records
            {propsLoaded && properties.length === 0 && (
              <span className="text-amber-500 ml-2">· Add properties first</span>
            )}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadRecords} className="btn-outline-gold text-sm px-3 py-2 rounded-lg">
            <HiOutlineRefresh size={15}/>
          </button>
          <button
            onClick={() => { setEditRecord(null); setShowModal(true); }}
            className="btn-gold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2"
          >
            <HiOutlinePlus size={16}/> Add Record
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        {[
          { label:"Overdue",   count:overdueCount,   cls:"border-red-400 bg-red-50",    txt:"text-red-600"    },
          { label:"Pending",   count:pendingCount,   cls:"border-yellow-400 bg-yellow-50",txt:"text-yellow-700"},
          { label:"Compliant", count:compliantCount, cls:"border-green-400 bg-green-50", txt:"text-green-700" },
        ].map(({label,count,cls,txt}) => (
          <div key={label} onClick={() => setStatusFilter(statusFilter === label ? "" : label)}
            className={`p-4 rounded-xl border-l-4 ${cls} cursor-pointer hover:opacity-80 transition-opacity`}>
            <p className={`text-2xl font-bold font-cinzel ${txt}`}>{count}</p>
            <p className="text-gray-500 text-xs mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filter pills */}
      <div className="flex flex-wrap gap-2 mb-5">
        {["", ...STATUSES].map((s) => (
          <button key={s} onClick={() => { setStatusFilter(s); setPage(1); }}
            className={`text-xs px-3 py-1.5 rounded-full border transition-all ${statusFilter === s ? "border-navy bg-navy text-ivory" : "border-gray-200 text-gray-500 hover:border-gold"}`}>
            {s || "All"}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className="card-elegant overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["Title","Property","Category","Status","Due Date","Docs","Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : records.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No records found</td></tr>
            ) : records.map((r) => {
              const isOverdue = new Date(r.dueDate) < new Date() && r.status !== "Compliant";
              return (
                <motion.tr key={r._id} initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                  className="border-b border-gray-50 hover:bg-gray-50/50">
                  <td className="py-3 px-4">
                    <p className="font-medium text-navy text-sm">{r.title}</p>
                    {r.notes && <p className="text-gray-400 text-xs mt-0.5 line-clamp-1">{r.notes}</p>}
                  </td>
                  <td className="py-3 px-4 text-xs">
                    <p className="text-gray-700 font-medium">{r.property?.name || "—"}</p>
                    <p className="text-gray-400">{r.property?.city}</p>
                  </td>
                  <td className="py-3 px-4">
                    <span className="text-xs bg-navy/5 text-navy px-2 py-1 rounded-full">{r.category}</span>
                  </td>
                  <td className="py-3 px-4">
                    <select
                      value={r.status}
                      onChange={(e) => updateStatus(r._id, e.target.value)}
                      className={`text-xs px-2 py-1 rounded-full border-0 font-medium cursor-pointer ${statusColor(r.status)}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`text-xs font-medium ${isOverdue ? "text-red-600" : "text-gray-600"}`}>
                      {new Date(r.dueDate).toLocaleDateString("en-IN")}
                      {isOverdue && <span className="block text-[10px] text-red-400">OVERDUE</span>}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    {r.documents?.length > 0 ? (
                      <span className="text-xs bg-blue-50 text-blue-600 px-2 py-1 rounded-full">
                        {r.documents.length} file{r.documents.length > 1 ? "s" : ""}
                      </span>
                    ) : <span className="text-gray-300 text-xs">—</span>}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button onClick={() => { setEditRecord(r); setShowModal(true); }}
                        className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                        <HiOutlinePencil size={13}/>
                      </button>
                      <button onClick={() => handleDelete(r._id, r.title)}
                        className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                        <HiOutlineTrash size={13}/>
                      </button>
                    </div>
                  </td>
                </motion.tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button disabled={page===1} onClick={() => setPage(page-1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Prev</button>
            <button disabled={page>=pagination.pages} onClick={() => setPage(page+1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <RecordModal
            record={editRecord}
            properties={properties}
            onClose={(refresh) => { setShowModal(false); setEditRecord(null); if (refresh) loadRecords(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
