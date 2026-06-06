import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiX, HiOutlineRefresh } from "react-icons/hi";

const schema = z.object({
  name:          z.string().min(2, "Name required"),
  type:          z.string().min(1, "Type required"),
  address:       z.string().min(5, "Address required"),
  city:          z.string().min(2, "City required"),
  state:         z.string().min(2, "State required"),
  totalRooms:    z.coerce.number().min(1, "Min 1 room"),
  contactPerson: z.string().min(2, "Contact person required"),
  contactPhone:  z.string().optional(),
  contactEmail:  z.string().email("Valid email").optional().or(z.literal("")),
});

function PropertyModal({ property, onClose }) {
  const isEdit = !!property;
  const [saving, setSaving] = useState(false);
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(schema),
    defaultValues: property || { type: "Hotel" },
  });

  const onSubmit = async (data) => {
    setSaving(true);
    try {
      if (isEdit) {
        await axiosInstance.put(`/properties/${property._id}`, data);
        toast.success("Property updated");
      } else {
        await axiosInstance.post("/properties", data);
        toast.success("Property added");
      }
      onClose(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed");
    } finally { setSaving(false); }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl w-full max-w-lg shadow-2xl overflow-hidden max-h-[92vh] flex flex-col"
      >
        <div className="bg-navy px-6 py-4 flex items-center justify-between flex-shrink-0">
          <h3 className="font-cinzel text-gold text-lg">{isEdit ? "Edit Property" : "Add Property"}</h3>
          <button onClick={() => onClose(false)} className="text-[#9BB0C9] hover:text-ivory"><HiX size={20} /></button>
        </div>
        <div className="overflow-y-auto flex-1 p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Property Name *</label>
                <input className="input-field" placeholder="e.g. Grand Maratha Hotel" {...register("name")} />
                {errors.name && <p className="error-text">{errors.name.message}</p>}
              </div>
              <div>
                <label className="label-field">Type *</label>
                <select className="input-field" {...register("type")}>
                  {["Hotel","Resort","Guest House","Hostel","Service Apartment","Other"].map((t) => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
            <div>
              <label className="label-field">Address *</label>
              <input className="input-field" placeholder="Full street address" {...register("address")} />
              {errors.address && <p className="error-text">{errors.address.message}</p>}
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="label-field">City *</label>
                <input className="input-field" placeholder="City" {...register("city")} />
                {errors.city && <p className="error-text">{errors.city.message}</p>}
              </div>
              <div>
                <label className="label-field">State *</label>
                <input className="input-field" placeholder="State" {...register("state")} />
                {errors.state && <p className="error-text">{errors.state.message}</p>}
              </div>
              <div>
                <label className="label-field">Total Rooms *</label>
                <input type="number" className="input-field" min={1} {...register("totalRooms")} />
                {errors.totalRooms && <p className="error-text">{errors.totalRooms.message}</p>}
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="label-field">Contact Person *</label>
                <input className="input-field" placeholder="GM / Owner name" {...register("contactPerson")} />
                {errors.contactPerson && <p className="error-text">{errors.contactPerson.message}</p>}
              </div>
              <div>
                <label className="label-field">Contact Phone</label>
                <input type="tel" className="input-field" placeholder="Mobile number" {...register("contactPhone")} />
              </div>
            </div>
            <div>
              <label className="label-field">Contact Email</label>
              <input type="email" className="input-field" placeholder="property@email.com" {...register("contactEmail")} />
              {errors.contactEmail && <p className="error-text">{errors.contactEmail.message}</p>}
            </div>
          </div>
        </div>
        <div className="px-6 py-4 border-t border-gray-100 flex justify-end gap-3 flex-shrink-0">
          <button onClick={() => onClose(false)} className="btn-outline-gold text-sm px-5 py-2.5 rounded-lg">Cancel</button>
          <button onClick={handleSubmit(onSubmit)} disabled={saving} className="btn-gold text-sm px-5 py-2.5 rounded-lg disabled:opacity-60">
            {saving ? "Saving..." : isEdit ? "Update" : "Add Property"}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function PropertiesPage() {
  const [properties, setProperties] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading,    setLoading]    = useState(false);
  const [showModal,  setShowModal]  = useState(false);
  const [editProp,   setEditProp]   = useState(null);
  const [page,       setPage]       = useState(1);

  const load = async () => {
    setLoading(true);
    try {
      const { data } = await axiosInstance.get("/properties", { params: { page, limit: 20 } });
      setProperties(data.data);
      setPagination(data.pagination);
    } catch { toast.error("Failed to load properties"); }
    finally { setLoading(false); }
  };

  useEffect(() => { load(); }, [page]);

  const handleDelete = async (id, name) => {
    if (!window.confirm(`Delete property "${name}"?`)) return;
    try {
      await axiosInstance.delete(`/properties/${id}`);
      toast.success("Property deleted");
      load();
    } catch { toast.error("Delete failed"); }
  };

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Properties</h1>
          <p className="text-gray-500 text-sm mt-0.5">{pagination?.total || 0} managed properties</p>
        </div>
        <div className="flex gap-2">
          <button onClick={load} className="btn-outline-gold text-sm px-4 py-2 rounded-lg flex items-center gap-2"><HiOutlineRefresh size={15} /></button>
          <button onClick={() => { setEditProp(null); setShowModal(true); }} className="btn-gold text-sm px-5 py-2.5 rounded-lg flex items-center gap-2">
            <HiOutlinePlus size={16} /> Add Property
          </button>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-16 text-gray-400">Loading properties...</div>
      ) : properties.length === 0 ? (
        <div className="text-center py-16 text-gray-400">No properties yet. <button onClick={() => setShowModal(true)} className="text-gold hover:underline">Add one.</button></div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {properties.map((p) => (
            <motion.div key={p._id} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="card-elegant hover:shadow-md transition-shadow"
            >
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-cinzel text-navy text-base font-semibold">{p.name}</h3>
                  <p className="text-gold text-xs mt-0.5">{p.type}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => { setEditProp(p); setShowModal(true); }} className="p-1.5 bg-blue-50 text-blue-600 rounded-lg hover:bg-blue-100">
                    <HiOutlinePencil size={14} />
                  </button>
                  <button onClick={() => handleDelete(p._id, p.name)} className="p-1.5 bg-red-50 text-red-500 rounded-lg hover:bg-red-100">
                    <HiOutlineTrash size={14} />
                  </button>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {[
                  { label: "Location", value: `${p.city}, ${p.state}` },
                  { label: "Rooms",    value: p.totalRooms },
                  { label: "Contact",  value: p.contactPerson },
                  { label: "Phone",    value: p.contactPhone || "—" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-gray-50 rounded-lg p-2">
                    <p className="text-gray-400 text-[10px] uppercase tracking-wider">{label}</p>
                    <p className="text-navy font-medium mt-0.5">{value}</p>
                  </div>
                ))}
              </div>
              {p.managedBy && (
                <p className="text-gray-400 text-xs mt-2">Manager: {p.managedBy.fullName}</p>
              )}
            </motion.div>
          ))}
        </div>
      )}

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
        {showModal && <PropertyModal property={editProp} onClose={(refresh) => { setShowModal(false); setEditProp(null); if (refresh) load(); }} />}
      </AnimatePresence>
    </div>
  );
}
