import { useEffect, useState } from "react";
import axiosInstance from "../../api/axiosInstance";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { HiOutlineClipboardList, HiOutlineRefresh, HiOutlineExclamationCircle } from "react-icons/hi";
import { FiArrowRight } from "react-icons/fi";

const STATUS_COLOR = {
  "New":            "bg-blue-100 text-blue-700",
  "Contacted":      "bg-yellow-100 text-yellow-700",
  "Qualified":      "bg-indigo-100 text-indigo-700",
  "Demo Scheduled": "bg-purple-100 text-purple-700",
  "Converted":      "bg-green-100 text-green-700",
  "Closed":         "bg-gray-100 text-gray-500",
};

const STATUS_DESC = {
  "New":            "Request received — our team will contact you within 24 hours.",
  "Contacted":      "Our team has reached out to you. Please check your phone/email.",
  "Qualified":      "Your request has been reviewed and qualified by our team.",
  "Demo Scheduled": "🎉 Your demo has been scheduled! Check your email for details.",
  "Converted":      "✅ Welcome aboard! You are now an Atithya client.",
  "Closed":         "This request has been closed.",
};

export default function CustomerPortalPage() {
  const { user } = useSelector((s) => s.auth);
  const [demos,   setDemos]   = useState([]);
  const [loading, setLoading] = useState(false);
  const [error,   setError]   = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await axiosInstance.get("/demo/my");
      setDemos(data.data?.demos || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load your requests.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { load(); }, []);

  return (
    <div className="p-4 sm:p-6 max-w-4xl mx-auto">
      {/* Welcome banner */}
      <motion.div initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }}
        className="bg-navy rounded-2xl p-6 flex items-center gap-5 mb-6">
        <div className="w-14 h-14 rounded-full bg-gold/20 border-2 border-gold/30 flex items-center justify-center flex-shrink-0">
          <span className="font-cinzel text-2xl text-gold font-bold">
            {user?.fullName?.[0]?.toUpperCase()}
          </span>
        </div>
        <div>
          <h1 className="font-cinzel text-ivory text-xl">Welcome, {user?.fullName?.split(" ")[0]}!</h1>
          <p className="text-[#9BB0C9] text-sm mt-0.5">{user?.companyName || user?.email}</p>
        </div>
      </motion.div>

      {/* Quick links */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        {[
          { label:"Request a Demo",   desc:"Schedule a live platform walkthrough", to:"/contact", icon:"🎯" },
          { label:"Explore Solutions",desc:"See what Atithya can do for you",      to:"/solutions",icon:"🚀" },
          { label:"Contact Support",  desc:"Reach out to our team",                to:"/contact", icon:"💬" },
        ].map(({ label, desc, to, icon }) => (
          <Link key={label} to={to}
            className="card-elegant hover:shadow-lg hover:-translate-y-0.5 transition-all group flex items-start gap-3">
            <span className="text-2xl">{icon}</span>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-navy text-sm group-hover:text-gold transition-colors">{label}</p>
              <p className="text-gray-400 text-xs mt-0.5">{desc}</p>
            </div>
            <FiArrowRight className="text-gray-300 group-hover:text-gold transition-colors mt-0.5 flex-shrink-0" size={14}/>
          </Link>
        ))}
      </div>

      {/* Demo requests section */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-cinzel text-navy text-xl">Your Demo Requests</h2>
          <button onClick={load} disabled={loading}
            className="btn-outline-gold text-xs px-3 py-1.5 rounded-lg flex items-center gap-1.5 disabled:opacity-50">
            <HiOutlineRefresh size={13} className={loading ? "animate-spin" : ""}/> Refresh
          </button>
        </div>

        {/* Email info tip */}
        <div className="bg-blue-50 border border-blue-100 rounded-xl p-3 mb-4 flex gap-2">
          <HiOutlineExclamationCircle className="text-blue-400 flex-shrink-0 mt-0.5" size={16}/>
          <p className="text-blue-600 text-xs">
            Showing demo requests submitted with your registered email:
            <span className="font-semibold ml-1">{user?.email}</span>.
            Make sure you used the same email when submitting the request.
          </p>
        </div>

        {loading ? (
          <div className="card-elegant text-center py-10 text-gray-400">Loading your requests...</div>
        ) : error ? (
          <div className="card-elegant text-center py-10">
            <p className="text-red-500 text-sm">{error}</p>
            <button onClick={load} className="text-gold text-sm mt-2 hover:underline">Try again</button>
          </div>
        ) : demos.length === 0 ? (
          <div className="card-elegant text-center py-12">
            <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
              <HiOutlineClipboardList className="text-gray-300" size={26}/>
            </div>
            <p className="text-gray-500 font-medium mb-1">No demo requests found</p>
            <p className="text-gray-400 text-sm mb-4">
              Submit a demo request and it will appear here. Make sure to use <strong>{user?.email}</strong>.
            </p>
            <Link to="/contact" className="btn-gold text-sm px-5 py-2 rounded-lg inline-flex items-center gap-2">
              Request Demo <FiArrowRight size={14}/>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {demos.map((d, i) => (
              <motion.div key={d._id} initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
                className="card-elegant hover:shadow-md transition-shadow">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-wrap items-center gap-2 mb-2">
                      <p className="font-cinzel font-semibold text-navy">{d.companyName}</p>
                      <span className={`text-xs px-2.5 py-0.5 rounded-full font-medium ${STATUS_COLOR[d.status] || "bg-gray-100 text-gray-500"}`}>
                        {d.status}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500 mb-2">
                      <span>🏨 {d.propertyType}</span>
                      <span>📊 {d.numberOfProperties} {d.numberOfProperties === 1 ? "property" : "properties"}</span>
                      <span>📅 {new Date(d.createdAt).toLocaleDateString("en-IN", { day:"numeric", month:"short", year:"numeric" })}</span>
                    </div>
                    {d.message && (
                      <p className="text-gray-400 text-xs italic border-l-2 border-gray-200 pl-2 mt-1">"{d.message}"</p>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg px-3 py-2 text-xs text-gray-600 max-w-[200px]">
                    {STATUS_DESC[d.status]}
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
