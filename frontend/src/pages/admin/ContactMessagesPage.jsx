import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { HiX, HiOutlineReply, HiOutlineRefresh } from "react-icons/hi";

function ReplyModal({ message, onClose }) {
  const [reply,   setReply]   = useState("");
  const [loading, setLoading] = useState(false);

  const handleReply = async () => {
    if (!reply.trim()) return toast.error("Enter reply message");
    setLoading(true);
    try {
      await axiosInstance.post(`/contact/${message._id}/reply`, { replyMessage: reply });
      toast.success("Reply sent via email!");
      onClose(true);
    } catch { toast.error("Failed to send reply"); }
    finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="bg-navy px-6 py-4 flex items-center justify-between">
          <div>
            <h3 className="font-cinzel text-gold text-lg">Reply to {message.name}</h3>
            <p className="text-[#9BB0C9] text-xs mt-0.5">{message.email}</p>
          </div>
          <button onClick={() => onClose(false)} className="text-[#9BB0C9] hover:text-ivory"><HiX size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-xs text-gray-400 uppercase tracking-wider mb-1">Original Message</p>
            <p className="font-medium text-navy text-sm mb-1">Re: {message.subject}</p>
            <p className="text-gray-600 text-sm leading-relaxed">{message.message}</p>
          </div>
          <div>
            <label className="label-field">Your Reply *</label>
            <textarea rows={5} value={reply} onChange={(e) => setReply(e.target.value)} className="input-field resize-none" placeholder="Write your reply here..." />
          </div>
          <button onClick={handleReply} disabled={loading || !reply.trim()} className="btn-gold w-full py-3 flex items-center justify-center gap-2 disabled:opacity-60">
            <HiOutlineReply size={16} /> {loading ? "Sending..." : "Send Reply"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function ContactMessagesPage() {
  const [messages,   setMessages]   = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [filter,     setFilter]     = useState("all");
  const [selected,   setSelected]   = useState(null);
  const [page,       setPage]       = useState(1);
  const [pagination, setPagination] = useState(null);

  const load = async () => {
    setLoading(true);
    try {
      const params = { page, limit: 20 };
      if (filter === "pending") params.isReplied = false;
      if (filter === "replied") params.isReplied = true;
      const { data } = await axiosInstance.get("/contact", { params });
      setMessages(data.data);
      setPagination(data.pagination);
    } catch { toast?.error?.("Failed to load messages"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page, filter]);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axiosInstance.delete(`/contact/${id}`);
      toast.success("Deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 sm:p-6 max-w-5xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Contact Messages</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination?.total || 0} total messages</p>
        </div>
        <button onClick={load} className="btn-outline-gold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <HiOutlineRefresh size={15} /> Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {[["all","All"],["pending","Pending Reply"],["replied","Replied"]].map(([key, label]) => (
          <button key={key} onClick={() => { setFilter(key); setPage(1); }}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${filter === key ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"}`}>
            {label}
          </button>
        ))}
      </div>

      {/* Messages */}
      <div className="space-y-3">
        {loading ? (
          <div className="text-center py-12 text-gray-400">Loading messages...</div>
        ) : messages.length === 0 ? (
          <div className="text-center py-12 text-gray-400">No messages found</div>
        ) : messages.map((m) => (
          <motion.div key={m._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
            className="card-elegant hover:shadow-md transition-shadow"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div className="flex-1 min-w-0">
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <p className="font-semibold text-navy">{m.name}</p>
                  <span className="text-gray-400 text-xs">{m.email}</span>
                  {m.phone && <span className="text-gray-400 text-xs">· {m.phone}</span>}
                  <span className={`badge-status text-xs px-2 py-0.5 rounded-full ${m.isReplied ? "bg-green-100 text-green-700" : "bg-yellow-100 text-yellow-700"}`}>
                    {m.isReplied ? "Replied" : "Pending"}
                  </span>
                </div>
                <p className="font-medium text-sm text-navy/80 mb-1">Re: {m.subject}</p>
                <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">{m.message}</p>
                {m.isReplied && m.replyMessage && (
                  <div className="mt-3 bg-green-50 border-l-2 border-green-400 pl-3 py-2">
                    <p className="text-xs text-green-600 font-medium mb-0.5">Reply sent:</p>
                    <p className="text-sm text-gray-600 line-clamp-2">{m.replyMessage}</p>
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2 flex-shrink-0">
                <p className="text-gray-400 text-xs whitespace-nowrap">{new Date(m.createdAt).toLocaleDateString("en-IN")}</p>
                <div className="flex gap-2">
                  {!m.isReplied && (
                    <button onClick={() => setSelected(m)} className="text-xs bg-gold/10 text-gold px-3 py-1.5 rounded-lg hover:bg-gold/20 transition-colors font-medium flex items-center gap-1">
                      <HiOutlineReply size={13} /> Reply
                    </button>
                  )}
                  <button onClick={() => handleDelete(m._id)} className="text-xs bg-red-50 text-red-500 px-3 py-1.5 rounded-lg hover:bg-red-100 transition-colors">
                    Delete
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-6">
          <p className="text-sm text-gray-500">Page {pagination.page} of {pagination.pages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage(page - 1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Prev</button>
            <button disabled={page >= pagination.pages} onClick={() => setPage(page + 1)} className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40">Next</button>
          </div>
        </div>
      )}

      <AnimatePresence>
        {selected && <ReplyModal message={selected} onClose={(refresh) => { setSelected(null); if (refresh) load(); }} />}
      </AnimatePresence>
    </div>
  );
}
