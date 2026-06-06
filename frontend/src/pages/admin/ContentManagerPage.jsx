import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchContent, updateContent } from "../../features/content/contentSlice";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { HiOutlineSave, HiOutlineRefresh } from "react-icons/hi";

const PAGES = ["home", "about", "contact"];

export default function ContentManagerPage() {
  const dispatch = useDispatch();
  const { data, loading } = useSelector((s) => s.content);
  const [activePage, setActivePage] = useState("home");
  const [editValues, setEditValues] = useState({});
  const [saving,     setSaving]     = useState({});

  useEffect(() => { dispatch(fetchContent()); }, [dispatch]);

  useEffect(() => {
    if (data) {
      // Flatten content data into editable state
      const flat = {};
      Object.entries(data).forEach(([page, sections]) => {
        Object.entries(sections || {}).forEach(([section, keys]) => {
          Object.entries(keys || {}).forEach(([key, value]) => {
            flat[`${page}__${section}__${key}`] = typeof value === "string" ? value : JSON.stringify(value);
          });
        });
      });
      setEditValues(flat);
    }
  }, [data]);

  const handleSave = async (page, section, key) => {
    const stateKey = `${page}__${section}__${key}`;
    const value    = editValues[stateKey];
    setSaving((prev) => ({ ...prev, [stateKey]: true }));
    try {
      const res = await dispatch(updateContent({ page, section, key, value }));
      if (updateContent.fulfilled.match(res)) toast.success("Content saved");
      else toast.error("Save failed");
    } finally {
      setSaving((prev) => ({ ...prev, [stateKey]: false }));
    }
  };

  const pageData = data[activePage] || {};

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="font-cinzel text-navy text-2xl">Content Manager</h1>
          <p className="text-gray-500 text-sm mt-0.5">Edit website copy and content</p>
        </div>
        <button onClick={() => dispatch(fetchContent())} className="btn-outline-gold text-sm px-4 py-2 rounded-lg flex items-center gap-2">
          <HiOutlineRefresh size={15} /> Refresh
        </button>
      </div>

      {/* Page tabs */}
      <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6 w-fit">
        {PAGES.map((p) => (
          <button key={p} onClick={() => setActivePage(p)}
            className={`px-5 py-2 rounded-lg text-sm font-medium capitalize transition-all ${activePage === p ? "bg-white text-navy shadow-sm" : "text-gray-500"}`}>
            {p}
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-center py-12 text-gray-400">Loading content...</div>
      ) : Object.keys(pageData).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-400 mb-2">No content entries for this page yet.</p>
          <p className="text-gray-300 text-sm">Run the seed script to populate initial content.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {Object.entries(pageData).map(([section, keys]) => (
            <motion.div key={section} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }}
              className="card-elegant"
            >
              <h3 className="font-cinzel text-navy text-base font-semibold mb-4 capitalize border-b border-gray-100 pb-3">
                {section.replace(/_/g, " ")}
              </h3>
              <div className="space-y-4">
                {Object.entries(keys || {}).map(([key, _]) => {
                  const stateKey = `${activePage}__${section}__${key}`;
                  const val = editValues[stateKey] || "";
                  const isLong = val.length > 100;
                  return (
                    <div key={key} className="flex flex-col sm:flex-row gap-2">
                      <div className="sm:w-36 flex-shrink-0">
                        <label className="text-xs font-medium text-gray-500 uppercase tracking-wider block mt-2">{key}</label>
                      </div>
                      <div className="flex-1 flex gap-2">
                        {isLong ? (
                          <textarea
                            rows={3}
                            value={val}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, [stateKey]: e.target.value }))}
                            className="input-field resize-none text-sm flex-1"
                          />
                        ) : (
                          <input
                            type="text"
                            value={val}
                            onChange={(e) => setEditValues((prev) => ({ ...prev, [stateKey]: e.target.value }))}
                            className="input-field text-sm flex-1"
                          />
                        )}
                        <button
                          onClick={() => handleSave(activePage, section, key)}
                          disabled={saving[stateKey]}
                          className="btn-gold text-xs px-3 py-2 rounded-lg flex-shrink-0 flex items-center gap-1.5 disabled:opacity-60 self-start"
                        >
                          <HiOutlineSave size={14} />
                          {saving[stateKey] ? "..." : "Save"}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
