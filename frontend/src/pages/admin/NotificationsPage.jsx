import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchNotifications, markAllRead } from "../../features/notifications/notificationsSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlineBell, HiOutlineCheck } from "react-icons/hi";

export default function NotificationsPage() {
  const dispatch = useDispatch();
  const { list, unreadCount, loading } = useSelector((s) => s.notifications);

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const handleMarkAll = async () => {
    await dispatch(markAllRead());
    toast.success("All marked as read");
  };

  const typeIcon = (type) => ({
    success: "✅", warning: "⚠️", error: "❌", info: "ℹ️",
  }[type] || "ℹ️");

  return (
    <div className="p-4 sm:p-6 max-w-3xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Notifications</h1>
          {unreadCount > 0 && <p className="text-gold text-sm mt-0.5">{unreadCount} unread</p>}
        </div>
        {unreadCount > 0 && (
          <button onClick={handleMarkAll} className="btn-outline-gold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
            <HiOutlineCheck size={15} /> Mark All Read
          </button>
        )}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading notifications...</div>
      ) : list.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
            <HiOutlineBell className="text-gray-300" size={28} />
          </div>
          <p className="text-gray-400">No notifications yet</p>
        </div>
      ) : (
        <div className="space-y-2">
          {list.map((n) => (
            <motion.div key={n._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}
              className={`p-4 rounded-xl border transition-colors ${n.isRead ? "bg-white border-gray-100" : "bg-gold/5 border-gold/20"}`}
            >
              <div className="flex items-start gap-3">
                <span className="text-lg flex-shrink-0 mt-0.5">{typeIcon(n.type)}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${n.isRead ? "text-gray-700" : "text-navy"}`}>{n.title}</p>
                  <p className="text-gray-500 text-sm mt-0.5">{n.message}</p>
                  <p className="text-gray-300 text-xs mt-1">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
                </div>
                {!n.isRead && <div className="w-2 h-2 rounded-full bg-gold flex-shrink-0 mt-2" />}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
