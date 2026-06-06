import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FiCheckCircle, FiArrowRight, FiStar } from "react-icons/fi";
import {
  HiOutlineClipboardCheck, HiOutlineOfficeBuilding, HiOutlineChartBar,
  HiOutlineShieldCheck, HiOutlineUserGroup, HiOutlineLightningBolt,
} from "react-icons/hi";

const fadeUp = { hidden: { opacity: 0, y: 30 }, show: { opacity: 1, y: 0, transition: { duration: 0.6 } } };
const stagger = { show: { transition: { staggerChildren: 0.12 } } };

const features = [
  { icon: HiOutlineClipboardCheck,  title: "Smart Check-In",      desc: "Automated guest check-in with digital ID verification, e-sign, and instant FRRO/C-Form generation." },
  { icon: HiOutlineShieldCheck,     title: "Compliance Engine",   desc: "Never miss a regulatory deadline. Auto-track fire safety, FSSAI, police NOC, and 30+ compliance categories." },
  { icon: HiOutlineChartBar,        title: "Operations Dashboard",desc: "Real-time operational insights across all your properties in one unified dashboard." },
  { icon: HiOutlineOfficeBuilding,  title: "Multi-Property",      desc: "Manage 1 or 100 properties seamlessly. Role-based access for GMs, FOs, and compliance officers." },
  { icon: HiOutlineUserGroup,       title: "Staff Management",    desc: "Roster planning, attendance, training logs, and performance analytics — all integrated." },
  { icon: HiOutlineLightningBolt,   title: "Instant Automation",  desc: "GST invoicing, night audit reports, OTA sync, and WhatsApp alerts — fully automated." },
];

const stats = [
  { value: "500+",    label: "Hotels & Resorts" },
  { value: "98%",     label: "Compliance Rate" },
  { value: "25+",     label: "Cities Covered" },
  { value: "10,000+", label: "Staff Hours Saved/Month" },
];

const testimonials = [
  { name: "Rajeev Sinha",       role: "GM, Grand Palace Hotel, Varanasi",    text: "Atithya transformed our check-in process. What used to take 20 minutes now takes 2. Our guests love it." },
  { name: "Sunita Iyer",        role: "Owner, Serenity Resorts, Munnar",      text: "The compliance module alone is worth every rupee. We haven't missed a single deadline since onboarding." },
  { name: "Manish Aggarwal",    role: "Director Ops, Heritage Hotels Group",  text: "Managing 8 properties became effortless. The dashboard gives us everything we need in one place." },
];

export default function HomePage() {
  return (
    <div className="overflow-hidden">
      {/* ── HERO ── */}
      <section className="relative min-h-screen bg-navy flex items-center justify-center overflow-hidden">
        {/* Decorative background */}
        <div className="absolute inset-0">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-gold/5 rounded-full blur-3xl" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-gold/3 rounded-full blur-3xl" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,162,93,0.05)_0%,_transparent_70%)]" />
        </div>

        <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center pt-24 pb-16">
          <motion.div
            initial="hidden"
            animate="show"
            variants={stagger}
            className="flex flex-col items-center"
          >
            <motion.div variants={fadeUp} className="inline-flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-full px-4 py-1.5 mb-8">
              <FiStar className="text-gold" size={13} />
              <span className="text-gold text-xs tracking-wider font-medium">INDIA'S FIRST UNIFIED HOSPITALITY PLATFORM</span>
            </motion.div>

            <motion.h1 variants={fadeUp} className="font-cinzel text-4xl sm:text-5xl md:text-6xl lg:text-7xl text-ivory leading-tight mb-4">
              CHECK IN SE
              <span className="block text-gold">COMPLIANCE TAK</span>
              <span className="block text-3xl sm:text-4xl md:text-5xl mt-1">SAB AUTOMATIC</span>
            </motion.h1>

            <motion.div variants={fadeUp} className="w-20 h-0.5 bg-gold/60 my-6" />

            <motion.p variants={fadeUp} className="text-[#9BB0C9] text-lg sm:text-xl max-w-2xl leading-relaxed mb-10">
              Atithya automates every aspect of hotel operations — from guest check-in and 
              staff management to regulatory compliance and analytics. Built for India's 
              hospitality industry.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-gold text-base px-8 py-4 rounded-xl flex items-center justify-center gap-2 group">
                Request a Demo
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/solutions" className="btn-outline-gold text-base px-8 py-4 rounded-xl">
                Explore Solutions
              </Link>
            </motion.div>

            <motion.div variants={fadeUp} className="flex flex-wrap justify-center gap-6 mt-12">
              {["No Credit Card Required", "Setup in 24 Hours", "Free Onboarding Support"].map((item) => (
                <div key={item} className="flex items-center gap-2 text-[#8EA8C3] text-sm">
                  <FiCheckCircle className="text-gold" size={15} />
                  {item}
                </div>
              ))}
            </motion.div>
          </motion.div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-50">
          <div className="w-px h-12 bg-gradient-to-b from-gold to-transparent" />
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gold py-14">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map(({ value, label }) => (
              <motion.div
                key={label}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                className="text-center"
              >
                <p className="font-cinzel text-3xl sm:text-4xl text-navy font-bold">{value}</p>
                <p className="text-navy/70 text-sm mt-1 font-medium">{label}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="py-24 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[3px] uppercase font-medium mb-3">What We Offer</p>
            <h2 className="section-heading mb-4">Complete Hospitality<br />Operations Platform</h2>
            <div className="gold-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map(({ icon: Icon, title, desc }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="card-elegant group hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-navy/5 flex items-center justify-center mb-4 group-hover:bg-gold/10 transition-colors">
                  <Icon size={22} className="text-gold" />
                </div>
                <h3 className="font-cinzel text-navy text-lg font-semibold mb-2">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Link to="/solutions" className="btn-navy inline-flex items-center gap-2 group">
              View All Features
              <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="py-24 bg-navy">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[3px] uppercase font-medium mb-3">Simple Onboarding</p>
            <h2 className="section-heading text-ivory mb-4">Get Started in 3 Steps</h2>
            <div className="gold-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
            <div className="hidden md:block absolute top-10 left-1/4 right-1/4 h-px bg-gradient-to-r from-gold/20 via-gold/60 to-gold/20" />
            {[
              { step: "01", title: "Request Demo",     desc: "Fill a quick form. Our team contacts you within 24 hours to understand your needs." },
              { step: "02", title: "Onboarding Call",  desc: "We set up your property profile, configure modules, and train your core team — all in one session." },
              { step: "03", title: "Go Live",          desc: "Start using Atithya from Day 1. Dedicated support for the first 30 days." },
            ].map(({ step, title, desc }, i) => (
              <motion.div
                key={step}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                className="text-center relative"
              >
                <div className="w-20 h-20 rounded-full border-2 border-gold/40 bg-gold/10 flex items-center justify-center mx-auto mb-5">
                  <span className="font-cinzel text-2xl text-gold font-bold">{step}</span>
                </div>
                <h3 className="font-cinzel text-ivory text-xl mb-3">{title}</h3>
                <p className="text-[#8EA8C3] text-sm leading-relaxed">{desc}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="py-24 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <p className="text-gold text-sm tracking-[3px] uppercase font-medium mb-3">Testimonials</p>
            <h2 className="section-heading mb-4">Trusted by Hoteliers</h2>
            <div className="gold-divider mx-auto" />
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {testimonials.map(({ name, role, text }, i) => (
              <motion.div
                key={name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="card-elegant hover:shadow-xl transition-shadow"
              >
                <div className="flex gap-1 mb-4">
                  {Array(5).fill(null).map((_, j) => (
                    <FiStar key={j} className="text-gold fill-gold" size={14} />
                  ))}
                </div>
                <p className="text-gray-600 text-sm leading-relaxed mb-5 italic">"{text}"</p>
                <div>
                  <p className="font-semibold text-navy text-sm">{name}</p>
                  <p className="text-gray-400 text-xs mt-0.5">{role}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA BANNER ── */}
      <section className="py-20 bg-gradient-to-r from-navy via-navy-light to-navy relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,_rgba(200,162,93,0.08)_0%,_transparent_70%)]" />
        <div className="relative z-10 max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="font-cinzel text-3xl sm:text-4xl text-ivory mb-4">
              Ready to Automate Your<br />
              <span className="text-gold">Hotel Operations?</span>
            </h2>
            <p className="text-[#9BB0C9] text-lg mb-8">
              Join 500+ hotels already running smarter with Atithya.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/contact" className="btn-gold px-8 py-4 text-base rounded-xl flex items-center justify-center gap-2 group">
                Book a Free Demo
                <FiArrowRight className="group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link to="/about" className="btn-outline-gold px-8 py-4 text-base rounded-xl">
                Learn More
              </Link>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
