import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers, toggleStatus, updateRole, deleteUser } from "../../features/users/usersSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlineSearch, HiOutlineRefresh } from "react-icons/hi";

const ROLES = ["super_admin","admin","operations_manager","compliance_manager","staff","customer"];

const roleBadge = (role) => {
  const map = {
    super_admin: "bg-purple-100 text-purple-700",
    admin:       "bg-blue-100 text-blue-700",
    operations_manager: "bg-teal-100 text-teal-700",
    compliance_manager: "bg-green-100 text-green-700",
    staff:       "bg-yellow-100 text-yellow-700",
    customer:    "bg-gray-100 text-gray-600",
  };
  return map[role] || "bg-gray-100 text-gray-600";
};

export default function UsersPage() {
  const dispatch = useDispatch();
  const { list, pagination, loading } = useSelector((s) => s.users);
  const { user: me } = useSelector((s) => s.auth);
  const [search, setSearch] = useState("");
  const [roleFilter, setRoleFilter] = useState("");
  const [page, setPage] = useState(1);

  const loadUsers = () => {
    dispatch(fetchUsers({ page, limit: 20, search, role: roleFilter || undefined }));
  };

  useEffect(() => { loadUsers(); }, [page, roleFilter]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(1);
    loadUsers();
  };

  const handleToggle = async (id) => {
    const res = await dispatch(toggleStatus(id));
    if (toggleStatus.fulfilled.match(res)) {
      toast.success(`User ${res.payload.isActive ? "activated" : "suspended"}`);
    } else {
      toast.error(res.payload || "Action failed");
    }
  };

  const handleRoleChange = async (id, role) => {
    const res = await dispatch(updateRole({ id, role }));
    if (updateRole.fulfilled.match(res)) toast.success("Role updated");
    else toast.error(res.payload);
  };

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete user "${name}"? This cannot be undone.`)) return;
    const res = await dispatch(deleteUser(id));
    if (deleteUser.fulfilled.match(res)) toast.success("User deleted");
    else toast.error(res.payload);
  };

  return (
    <div className="p-4 sm:p-6 max-w-7xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">User Management</h1>
          <p className="text-gray-500 text-sm mt-0.5">
            {pagination?.total || 0} total users
          </p>
        </div>
        <button onClick={loadUsers} className="btn-outline-gold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <HiOutlineRefresh size={15} /> Refresh
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-wrap gap-3 mb-5">
        <form onSubmit={handleSearch} className="flex flex-1 min-w-[200px] gap-2">
          <div className="relative flex-1">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search name, email, company..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="input-field pl-9 text-sm py-2.5"
            />
          </div>
          <button type="submit" className="btn-gold text-sm px-4 py-2.5 rounded-lg">Search</button>
        </form>
        <select
          value={roleFilter}
          onChange={(e) => { setRoleFilter(e.target.value); setPage(1); }}
          className="input-field text-sm py-2.5 w-auto min-w-[160px]"
        >
          <option value="">All Roles</option>
          {ROLES.map((r) => <option key={r} value={r}>{r.replace("_"," ")}</option>)}
        </select>
      </div>

      {/* Table */}
      <div className="card-elegant overflow-x-auto p-0">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-gray-100">
              {["User","Company","Role","Status","Verified","Last Login","Actions"].map((h) => (
                <th key={h} className="text-left py-3 px-4 text-xs text-gray-400 font-medium uppercase tracking-wider whitespace-nowrap">{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">Loading...</td></tr>
            ) : list.length === 0 ? (
              <tr><td colSpan={7} className="text-center py-12 text-gray-400">No users found</td></tr>
            ) : list.map((u) => (
              <motion.tr
                key={u._id}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="border-b border-gray-50 hover:bg-gray-50/50 transition-colors"
              >
                <td className="py-3 px-4">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-navy/5 border border-navy/10 flex items-center justify-center flex-shrink-0">
                      <span className="text-navy font-bold text-xs font-cinzel">{u.fullName?.[0]}</span>
                    </div>
                    <div>
                      <p className="font-medium text-navy">{u.fullName}</p>
                      <p className="text-gray-400 text-xs">{u.email}</p>
                    </div>
                  </div>
                </td>
                <td className="py-3 px-4 text-gray-600 text-xs max-w-[140px] truncate">{u.companyName || "—"}</td>
                <td className="py-3 px-4">
                  {me?.role === "super_admin" && u._id !== me._id ? (
                    <select
                      value={u.role}
                      onChange={(e) => handleRoleChange(u._id, e.target.value)}
                      className="text-xs border border-gray-200 rounded px-2 py-1 bg-white"
                    >
                      {ROLES.map((r) => <option key={r} value={r}>{r.replace("_"," ")}</option>)}
                    </select>
                  ) : (
                    <span className={`badge-status ${roleBadge(u.role)} px-2 py-1 rounded-full text-xs`}>{u.role.replace("_"," ")}</span>
                  )}
                </td>
                <td className="py-3 px-4">
                  <span className={`badge-status px-2 py-1 rounded-full text-xs ${u.isActive ? "bg-green-100 text-green-700" : "bg-red-100 text-red-600"}`}>
                    {u.isActive ? "Active" : "Suspended"}
                  </span>
                </td>
                <td className="py-3 px-4">
                  <span className={`badge-status px-2 py-1 rounded-full text-xs ${u.isVerified ? "bg-blue-100 text-blue-600" : "bg-yellow-100 text-yellow-600"}`}>
                    {u.isVerified ? "Verified" : "Pending"}
                  </span>
                </td>
                <td className="py-3 px-4 text-gray-400 text-xs whitespace-nowrap">
                  {u.lastLogin ? new Date(u.lastLogin).toLocaleDateString("en-IN") : "Never"}
                </td>
                <td className="py-3 px-4">
                  {u._id !== me?._id && u.role !== "super_admin" && (
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleToggle(u._id)}
                        className={`text-xs px-2.5 py-1 rounded font-medium transition-colors ${
                          u.isActive ? "bg-red-50 text-red-600 hover:bg-red-100" : "bg-green-50 text-green-600 hover:bg-green-100"
                        }`}
                      >
                        {u.isActive ? "Suspend" : "Activate"}
                      </button>
                      {me?.role === "super_admin" && (
                        <button
                          onClick={() => handleDelete(u._id, u.fullName)}
                          className="text-xs px-2.5 py-1 rounded bg-gray-50 text-gray-500 hover:bg-red-50 hover:text-red-600 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  )}
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <p className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.pages} ({pagination.total} total)
          </p>
          <div className="flex gap-2">
            <button
              disabled={page === 1}
              onClick={() => setPage(page - 1)}
              className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40"
            >
              Prev
            </button>
            <button
              disabled={page >= pagination.pages}
              onClick={() => setPage(page + 1)}
              className="btn-outline-gold text-sm px-3 py-1.5 rounded-lg disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
