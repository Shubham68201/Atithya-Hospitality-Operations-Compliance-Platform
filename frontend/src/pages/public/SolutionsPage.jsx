import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { FiArrowRight, FiCheck } from "react-icons/fi";
import {
  HiOutlineClipboardCheck, HiOutlineShieldCheck, HiOutlineChartBar,
  HiOutlineOfficeBuilding, HiOutlineUserGroup, HiOutlineDocumentText,
  HiOutlineBell, HiOutlineCog,
} from "react-icons/hi";

const modules = [
  {
    icon: HiOutlineClipboardCheck, title: "Guest Check-In & Check-Out",
    color: "from-blue-500/10 to-blue-500/5",
    features: [
      "Digital ID scan & Aadhaar/passport verification",
      "e-Sign on digital registration card",
      "Instant C-Form / FRRO generation",
      "WhatsApp confirmation to guest",
      "Automated check-out billing & receipt",
      "GST-compliant invoice generation",
    ],
  },
  {
    icon: HiOutlineShieldCheck, title: "Compliance Management",
    color: "from-emerald-500/10 to-emerald-500/5",
    features: [
      "30+ compliance categories tracked",
      "Fire safety, FSSAI, police NOC",
      "Auto-deadline reminders",
      "Document storage & audit trail",
      "Compliance scorecard per property",
      "Regulator-ready report export",
    ],
  },
  {
    icon: HiOutlineChartBar, title: "Operations Dashboard",
    color: "from-purple-500/10 to-purple-500/5",
    features: [
      "Real-time occupancy & RevPAR",
      "Room-type revenue breakdown",
      "Multi-property comparison view",
      "OTA channel performance",
      "Night audit automation",
      "Custom report builder",
    ],
  },
  {
    icon: HiOutlineOfficeBuilding, title: "Multi-Property Management",
    color: "from-amber-500/10 to-amber-500/5",
    features: [
      "Unlimited properties on one account",
      "Role-based access per property",
      "Centralized policy management",
      "Cross-property inventory control",
      "Chain-wide compliance overview",
      "Consolidated financial reporting",
    ],
  },
  {
    icon: HiOutlineUserGroup, title: "Staff & HR Module",
    color: "from-pink-500/10 to-pink-500/5",
    features: [
      "Digital attendance & roster planning",
      "Training log & certification tracking",
      "Performance analytics",
      "Salary computation aids",
      "Staff communication broadcast",
      "Exit & onboarding workflows",
    ],
  },
  {
    icon: HiOutlineDocumentText, title: "F&B and Housekeeping",
    color: "from-teal-500/10 to-teal-500/5",
    features: [
      "Room status real-time tracking",
      "Housekeeping task assignment",
      "F&B order management",
      "Inventory consumption tracking",
      "Lost & found register",
      "Maintenance request workflow",
    ],
  },
  {
    icon: HiOutlineBell, title: "Guest Experience",
    color: "from-orange-500/10 to-orange-500/5",
    features: [
      "Pre-arrival personalisation",
      "In-stay request management",
      "Feedback & review automation",
      "Loyalty programme basics",
      "Birthday & anniversary alerts",
      "Post-stay follow-up campaigns",
    ],
  },
  {
    icon: HiOutlineCog, title: "Integrations & API",
    color: "from-slate-500/10 to-slate-500/5",
    features: [
      "OTA sync (MakeMyTrip, Booking.com)",
      "Tally & Zoho Books integration",
      "Payment gateway (Razorpay)",
      "WhatsApp Business API",
      "Open REST API for custom integrations",
      "Webhook support",
    ],
  },
];

export default function SolutionsPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_right,_rgba(200,162,93,0.05)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold text-sm tracking-[3px] uppercase font-medium mb-4">Platform Modules</p>
            <h1 className="font-cinzel text-4xl sm:text-5xl text-ivory mb-6">
              Everything Your Hotel<br /><span className="text-gold">Needs. All in One Place.</span>
            </h1>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
            <p className="text-[#9BB0C9] text-lg max-w-2xl mx-auto leading-relaxed">
              Atithya is a modular platform — pick what you need, scale as you grow. 
              Every module is deeply integrated to eliminate data silos.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Modules grid */}
      <section className="py-20 bg-ivory">
        <div className="max-w-7xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
            {modules.map(({ icon: Icon, title, color, features }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.06 }}
                className={`card-elegant hover:shadow-xl transition-all duration-300 bg-gradient-to-br ${color} border border-gray-100`}
              >
                <div className="flex items-center gap-3 mb-5">
                  <div className="w-11 h-11 rounded-xl bg-navy/5 flex items-center justify-center">
                    <Icon size={22} className="text-gold" />
                  </div>
                  <h3 className="font-cinzel text-navy text-lg font-semibold">{title}</h3>
                </div>
                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {features.map((f) => (
                    <li key={f} className="flex items-start gap-2 text-sm text-gray-600">
                      <FiCheck className="text-gold mt-0.5 flex-shrink-0" size={13} />
                      {f}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-navy text-center">
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
          <h2 className="font-cinzel text-3xl text-ivory mb-4">Ready to get started?</h2>
          <p className="text-[#9BB0C9] mb-8">Request a personalised demo tailored to your property type.</p>
          <Link to="/contact" className="btn-gold inline-flex items-center gap-2 group px-8 py-4 text-base rounded-xl">
            Book a Free Demo <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
          </Link>
        </motion.div>
      </section>
    </div>
  );
}
