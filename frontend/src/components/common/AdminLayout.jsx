import { useState, useEffect } from "react";
import { Outlet, NavLink, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logoutUser } from "../../features/auth/authSlice";
import { fetchNotifications } from "../../features/notifications/notificationsSlice";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineClipboardList,
  HiOutlineMail, HiOutlineBriefcase, HiOutlineDocumentText,
  HiOutlinePencilAlt, HiOutlineOfficeBuilding, HiOutlineShieldCheck,
  HiOutlineBell, HiOutlineUser, HiMenu, HiOutlineLogout,
  HiOutlineChevronLeft, HiOutlineChatAlt2, HiOutlineViewGrid,
} from "react-icons/hi";

const ALL_NAV = [
  // Staff dashboard
  { to:"/dashboard",                icon:HiOutlineHome,          label:"Dashboard",         roles:["super_admin","admin","operations_manager","compliance_manager","staff"] },
  // Customer portal
  { to:"/portal",                   icon:HiOutlineViewGrid,       label:"My Portal",         roles:["customer"] },
  // Admin
  { to:"/admin/users",              icon:HiOutlineUsers,           label:"Users",             roles:["super_admin","admin"] },
  { to:"/admin/demo-requests",      icon:HiOutlineClipboardList,   label:"Demo Requests",     roles:["super_admin","admin"] },
  { to:"/admin/messages",           icon:HiOutlineMail,            label:"Contact Messages",  roles:["super_admin","admin"] },
  { to:"/admin/jobs",               icon:HiOutlineBriefcase,       label:"Jobs",              roles:["super_admin","admin"] },
  { to:"/admin/applications",       icon:HiOutlineDocumentText,    label:"Applications",      roles:["super_admin","admin"] },
  { to:"/admin/content",            icon:HiOutlinePencilAlt,       label:"CMS",               roles:["super_admin","admin"] },
  // Operations
  { to:"/admin/properties",         icon:HiOutlineOfficeBuilding,  label:"Properties",        roles:["super_admin","admin","operations_manager"] },
  // Compliance
  { to:"/admin/compliance",         icon:HiOutlineShieldCheck,     label:"Compliance",        roles:["super_admin","admin","compliance_manager"] },
  // Staff messaging
  { to:"/admin/internal-messages",  icon:HiOutlineChatAlt2,        label:"Team Messages",     roles:["super_admin","admin","operations_manager","compliance_manager","staff"] },
  // All
  { to:"/admin/notifications",      icon:HiOutlineBell,            label:"Notifications",     roles:null },
  { to:"/admin/profile",            icon:HiOutlineUser,            label:"Profile",           roles:null },
];

export default function AdminLayout() {
  const [collapsed,  setCollapsed]  = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { user }        = useSelector((s) => s.auth);
  const { unreadCount } = useSelector((s) => s.notifications);
  const dispatch  = useDispatch();
  const navigate  = useNavigate();

  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  const navItems = ALL_NAV.filter((n) => !n.roles || n.roles.includes(user?.role));

  const handleLogout = async () => {
    await dispatch(logoutUser());
    toast.success("Logged out");
    navigate("/");
  };

  const SidebarContent = ({ mobile = false }) => (
    <div className="flex flex-col h-full">
      {/* Logo */}
      <div className={`flex items-center gap-3 px-4 py-5 border-b border-white/10 flex-shrink-0 ${collapsed && !mobile ? "justify-center px-2" : ""}`}>
        <div className="w-9 h-9 rounded-full bg-gold/15 border border-gold/30 flex items-center justify-center flex-shrink-0">
          <span className="font-cinzel text-gold font-bold text-base">A</span>
        </div>
        {(!collapsed || mobile) && (
          <div>
            <p className="font-cinzel text-gold text-base tracking-[2px] leading-none">ATITHYA</p>
            <p className="text-[#5A7A9A] text-[8px] tracking-widest leading-none mt-0.5">ADMIN PANEL</p>
          </div>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto py-3 px-2">
        <ul className="space-y-0.5">
          {navItems.map(({ to, icon: Icon, label }) => (
            <li key={to}>
              <NavLink
                to={to}
                onClick={() => mobile && setMobileOpen(false)}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-150 group relative ${
                    isActive ? "bg-gold/20 text-gold" : "text-[#8EA8C3] hover:bg-white/5 hover:text-ivory"
                  } ${collapsed && !mobile ? "justify-center" : ""}`
                }
              >
                <div className="relative flex-shrink-0">
                  <Icon size={18} />
                  {label === "Notifications" && unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full text-[8px] text-white flex items-center justify-center font-bold">
                      {unreadCount > 9 ? "9+" : unreadCount}
                    </span>
                  )}
                </div>
                {(!collapsed || mobile) && <span className="text-sm font-medium">{label}</span>}
                {/* Tooltip */}
                {collapsed && !mobile && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-navy-light border border-white/10 rounded text-xs text-ivory whitespace-nowrap opacity-0 group-hover:opacity-100 pointer-events-none z-50 transition-opacity">
                    {label}
                  </div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* User + logout */}
      <div className={`border-t border-white/10 p-2 flex-shrink-0 ${collapsed && !mobile ? "flex flex-col items-center gap-1" : ""}`}>
        {(!collapsed || mobile) && (
          <div className="flex items-center gap-2.5 px-2 py-2 mb-1">
            <div className="w-8 h-8 rounded-full bg-gold/20 border border-gold/30 flex items-center justify-center flex-shrink-0">
              <span className="text-gold font-bold text-sm font-cinzel">{user?.fullName?.[0]?.toUpperCase()}</span>
            </div>
            <div className="overflow-hidden">
              <p className="text-ivory text-xs font-medium truncate">{user?.fullName}</p>
              <p className="text-[#5A7A9A] text-[10px] capitalize truncate">{user?.role?.replace(/_/g," ")}</p>
            </div>
          </div>
        )}
        <button
          onClick={handleLogout}
          className={`flex items-center gap-2 w-full px-3 py-2 rounded-lg text-[#8EA8C3] hover:bg-red-500/10 hover:text-red-400 transition-colors text-sm ${collapsed && !mobile ? "justify-center" : ""}`}
        >
          <HiOutlineLogout size={17} />
          {(!collapsed || mobile) && <span>Logout</span>}
        </button>
      </div>
    </div>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Desktop Sidebar */}
      <aside className={`hidden lg:flex flex-col bg-navy transition-all duration-300 flex-shrink-0 relative ${collapsed ? "w-16" : "w-60"}`}>
        <SidebarContent />
        {/* Collapse toggle */}
        <button
          onClick={() => setCollapsed(!collapsed)}
          style={{ left: collapsed ? "64px" : "240px" }}
          className="absolute top-1/2 -translate-y-1/2 bg-navy border border-white/20 rounded-r-lg p-1 text-[#8EA8C3] hover:text-gold z-20 hidden lg:flex"
        >
          <motion.div animate={{ rotate: collapsed ? 180 : 0 }} transition={{ duration: 0.2 }}>
            <HiOutlineChevronLeft size={14} />
          </motion.div>
        </button>
      </aside>

      {/* Mobile Sidebar */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 z-40 lg:hidden" onClick={() => setMobileOpen(false)} />
            <motion.aside
              initial={{ x: -240 }} animate={{ x: 0 }} exit={{ x: -240 }}
              transition={{ type: "tween", duration: 0.25 }}
              className="fixed left-0 top-0 bottom-0 w-60 bg-navy z-50 lg:hidden flex flex-col"
            >
              <SidebarContent mobile />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="bg-white border-b border-gray-200 px-4 sm:px-6 h-14 flex items-center justify-between flex-shrink-0 z-10">
          <button className="lg:hidden text-gray-600 hover:text-navy p-1 -ml-1" onClick={() => setMobileOpen(true)}>
            <HiMenu size={22} />
          </button>
          <div className="hidden lg:block" />
          <div className="flex items-center gap-3">
            <Link to="/" className="text-xs text-gray-400 hover:text-navy transition-colors hidden sm:block">
              ← Back to website
            </Link>
            <div className="w-8 h-8 rounded-full bg-navy/10 border border-navy/20 flex items-center justify-center">
              <span className="text-navy font-bold text-sm font-cinzel">{user?.fullName?.[0]?.toUpperCase()}</span>
            </div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
