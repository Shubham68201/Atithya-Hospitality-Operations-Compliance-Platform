import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useSelector } from "react-redux";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlinePencilAlt, HiX, HiOutlineRefresh,
  HiOutlineInbox, HiOutlinePaperAirplane, HiOutlineTrash,
} from "react-icons/hi";

const ROLE_LABELS = {
  super_admin:         "Super Admin",
  admin:               "Admin",
  operations_manager:  "Operations Mgr",
  compliance_manager:  "Compliance Mgr",
  staff:               "Staff",
};

const msgSchema = z.object({
  to:      z.string().min(1, "Select recipient"),
  subject: z.string().min(2, "Subject required"),
  body:    z.string().min(5, "Message required"),
});

function ComposeModal({ staffList, onClose }) {
  const [sending, setSending] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(msgSchema) });

  const onSubmit = async (data) => {
    setSending(true);
    try {
      await axiosInstance.post("/messages", data);
      toast.success("Message sent!");
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Send failed");
    } finally { setSending(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden"
      >
        <div className="bg-navy px-6 py-4 flex items-center justify-between">
          <h3 className="font-cinzel text-gold text-lg">New Message</h3>
          <button onClick={() => onClose(false)} className="text-[#9BB0C9] hover:text-ivory"><HiX size={20} /></button>
        </div>
        <div className="p-6 space-y-4">
          <div>
            <label className="label-field">To *</label>
            <select className="input-field" {...register("to")}>
              <option value="">Select staff member</option>
              {staffList.map((u) => (
                <option key={u._id} value={u._id}>
                  {u.fullName} — {ROLE_LABELS[u.role] || u.role}
                </option>
              ))}
            </select>
            {errors.to && <p className="error-text">{errors.to.message}</p>}
          </div>
          <div>
            <label className="label-field">Subject *</label>
            <input className="input-field" placeholder="Message subject" {...register("subject")} />
            {errors.subject && <p className="error-text">{errors.subject.message}</p>}
          </div>
          <div>
            <label className="label-field">Message *</label>
            <textarea rows={5} className="input-field resize-none" placeholder="Write your message..." {...register("body")} />
            {errors.body && <p className="error-text">{errors.body.message}</p>}
          </div>
          <div className="flex gap-3 justify-end pt-2">
            <button onClick={() => onClose(false)} className="btn-outline-gold text-sm px-5 py-2.5 rounded-lg">Cancel</button>
            <button onClick={handleSubmit(onSubmit)} disabled={sending}
              className="btn-gold text-sm px-5 py-2.5 rounded-lg disabled:opacity-60 flex items-center gap-2">
              <HiOutlinePaperAirplane size={14} />
              {sending ? "Sending..." : "Send Message"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

function MessageDetail({ message, tab, onClose, onDelete }) {
  const isInbox = tab === "inbox";
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }}
      className="card-elegant h-full flex flex-col"
    >
      <div className="flex items-start justify-between gap-3 mb-4 pb-4 border-b border-gray-100">
        <div>
          <h3 className="font-semibold text-navy text-base">{message.subject}</h3>
          <p className="text-sm text-gray-500 mt-0.5">
            {isInbox
              ? <span>From: <span className="text-navy font-medium">{message.from?.fullName}</span> ({ROLE_LABELS[message.from?.role] || message.from?.role})</span>
              : <span>To: <span className="text-navy font-medium">{message.to?.fullName}</span> ({ROLE_LABELS[message.to?.role] || message.to?.role})</span>
            }
          </p>
          <p className="text-xs text-gray-400 mt-0.5">{new Date(message.createdAt).toLocaleString("en-IN")}</p>
        </div>
        <div className="flex gap-2">
          <button onClick={() => onDelete(message._id)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
            <HiOutlineTrash size={14} />
          </button>
          <button onClick={onClose} className="p-1.5 bg-gray-50 text-gray-500 rounded-lg hover:bg-gray-100">
            <HiX size={14} />
          </button>
        </div>
      </div>
      <div className="flex-1 overflow-y-auto">
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap">{message.body}</p>
      </div>
    </motion.div>
  );
}

export default function InternalMessagesPage() {
  const { user } = useSelector((s) => s.auth);
  const [tab,        setTab]        = useState("inbox");
  const [messages,   setMessages]   = useState([]);
  const [staffList,  setStaffList]  = useState([]);
  const [loading,    setLoading]    = useState(false);
  const [selected,   setSelected]   = useState(null);
  const [showCompose,setShowCompose]= useState(false);

  const STAFF_ROLES = ["super_admin","admin","operations_manager","compliance_manager","staff"];
  const isStaff = STAFF_ROLES.includes(user?.role);

  const loadMessages = async () => {
    setLoading(true);
    setSelected(null);
    try {
      const endpoint = tab === "inbox" ? "/messages/inbox" : "/messages/sent";
      const { data } = await axiosInstance.get(endpoint);
      setMessages(data.data.messages || []);
    } catch { toast.error("Failed to load messages"); }
    finally { setLoading(false); }
  };

  const loadStaff = async () => {
    try {
      const { data } = await axiosInstance.get("/users/staff");
      setStaffList(data.data.users || []);
    } catch {}
  };

  useEffect(() => { loadStaff(); }, []);
  useEffect(() => { loadMessages(); }, [tab]);

  const handleSelect = async (msg) => {
    setSelected(msg);
    if (tab === "inbox" && !msg.isRead) {
      try {
        await axiosInstance.patch(`/messages/${msg._id}/read`);
        setMessages((prev) => prev.map((m) => m._id === msg._id ? { ...m, isRead: true } : m));
      } catch {}
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axiosInstance.delete(`/messages/${id}`);
      toast.success("Deleted");
      setSelected(null);
      loadMessages();
    } catch { toast.error("Delete failed"); }
  };

  const unreadCount = messages.filter((m) => tab === "inbox" && !m.isRead).length;

  if (!isStaff) {
    return (
      <div className="p-4 sm:p-6 max-w-3xl mx-auto text-center py-20">
        <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
          <HiOutlineInbox className="text-gray-300" size={28} />
        </div>
        <h2 className="font-cinzel text-navy text-xl mb-2">Internal Messaging</h2>
        <p className="text-gray-400 text-sm">This feature is available for staff members only.</p>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto h-[calc(100vh-56px)] flex flex-col">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4 flex-shrink-0">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Internal Messages</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            Staff communication channel
            {unreadCount > 0 && <span className="ml-2 bg-red-100 text-red-600 text-xs px-2 py-0.5 rounded-full">{unreadCount} unread</span>}
          </p>
        </div>
        <div className="flex gap-2">
          <button onClick={loadMessages} className="btn-outline-gold text-sm px-3 py-2 rounded-lg">
            <HiOutlineRefresh size={15} />
          </button>
          <button onClick={() => setShowCompose(true)} className="btn-gold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2">
            <HiOutlinePencilAlt size={16} /> Compose
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-4 w-fit flex-shrink-0">
        {[
          { key: "inbox", label: "Inbox",  Icon: HiOutlineInbox },
          { key: "sent",  label: "Sent",   Icon: HiOutlinePaperAirplane },
        ].map(({ key, label, Icon }) => (
          <button key={key} onClick={() => setTab(key)}
            className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center gap-1.5 transition-all ${tab === key ? "bg-white text-navy shadow-sm" : "text-gray-500"}`}>
            <Icon size={14} /> {label}
          </button>
        ))}
      </div>

      {/* Content */}
      <div className="flex-1 min-h-0 grid grid-cols-1 lg:grid-cols-5 gap-4 overflow-hidden">
        {/* Message list */}
        <div className="lg:col-span-2 overflow-y-auto">
          {loading ? (
            <div className="text-center py-12 text-gray-400">Loading...</div>
          ) : messages.length === 0 ? (
            <div className="text-center py-12">
              <HiOutlineInbox className="text-gray-200 mx-auto mb-3" size={40} />
              <p className="text-gray-400 text-sm">{tab === "inbox" ? "No messages received" : "No messages sent"}</p>
              {tab === "inbox" && <p className="text-gray-300 text-xs mt-1">Messages from team members appear here</p>}
            </div>
          ) : (
            <div className="space-y-2">
              {messages.map((msg) => (
                <motion.div
                  key={msg._id}
                  initial={{ opacity: 0, y: 4 }}
                  animate={{ opacity: 1, y: 0 }}
                  onClick={() => handleSelect(msg)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    selected?._id === msg._id
                      ? "border-gold/40 bg-gold/5"
                      : tab === "inbox" && !msg.isRead
                      ? "border-blue-200 bg-blue-50/50 hover:border-blue-300"
                      : "border-gray-100 bg-white hover:border-gray-200 hover:shadow-sm"
                  }`}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        {tab === "inbox" && !msg.isRead && (
                          <div className="w-2 h-2 rounded-full bg-blue-500 flex-shrink-0" />
                        )}
                        <p className={`text-sm truncate ${!msg.isRead && tab === "inbox" ? "font-semibold text-navy" : "font-medium text-gray-800"}`}>
                          {msg.subject}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5 truncate">
                        {tab === "inbox"
                          ? `From: ${msg.from?.fullName || "Unknown"}`
                          : `To: ${msg.to?.fullName || "Unknown"}`}
                      </p>
                    </div>
                    <p className="text-[10px] text-gray-400 flex-shrink-0 whitespace-nowrap">
                      {new Date(msg.createdAt).toLocaleDateString("en-IN")}
                    </p>
                  </div>
                  <p className="text-xs text-gray-400 mt-1.5 line-clamp-2">{msg.body}</p>
                </motion.div>
              ))}
            </div>
          )}
        </div>

        {/* Message detail */}
        <div className="lg:col-span-3 overflow-y-auto">
          {selected ? (
            <MessageDetail
              message={selected}
              tab={tab}
              onClose={() => setSelected(null)}
              onDelete={handleDelete}
            />
          ) : (
            <div className="card-elegant h-full flex flex-col items-center justify-center text-center py-16">
              <HiOutlineInbox className="text-gray-200 mb-4" size={48} />
              <p className="text-gray-400 text-sm">Select a message to read</p>
            </div>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showCompose && (
          <ComposeModal
            staffList={staffList}
            onClose={(refresh) => { setShowCompose(false); if (refresh && tab === "sent") loadMessages(); }}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
