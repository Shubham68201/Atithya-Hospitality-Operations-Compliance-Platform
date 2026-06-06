import { motion } from "framer-motion";
import { FiTarget, FiEye, FiHeart } from "react-icons/fi";

const team = [
  { name: "Samriddhi Agrawal",  role: "Founder & CEO",         bio: "Visionary leader with deep roots in hospitality operations and technology innovation. IMS-BHU alumna, incubated at AIC-MFIE." },
  { name: "Tech Team",          role: "Engineering",            bio: "Full-stack engineers passionate about building reliable, scalable systems for India's hospitality sector." },
  { name: "Ops Consultants",    role: "Hospitality Advisory",  bio: "Seasoned hotel operations professionals with 10+ years experience across luxury chains and boutique properties." },
];

const values = [
  { icon: FiTarget,  title: "Mission",   text: "To bring enterprise-grade operations technology to every hotel, resort, and guest house in India — from 5-star chains to boutique properties." },
  { icon: FiEye,     title: "Vision",    text: "A future where every Indian hotelier spends less time on paperwork and more time creating exceptional guest experiences." },
  { icon: FiHeart,   title: "Values",    text: "Simplicity, reliability, and genuine care for our clients. We succeed only when our hotel partners succeed." },
];

export default function AboutPage() {
  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,_rgba(200,162,93,0.06)_0%,_transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold text-sm tracking-[3px] uppercase font-medium mb-4">Our Story</p>
            <h1 className="font-cinzel text-4xl sm:text-5xl text-ivory mb-6">About Atithya &<br />Shri Perumal</h1>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-8" />
            <p className="text-[#9BB0C9] text-lg leading-relaxed max-w-2xl mx-auto">
              Born out of a real problem faced by hotel owners across India, Atithya was built 
              to make hospitality operations as smooth as the guest experience it enables.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-ivory">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 grid md:grid-cols-2 gap-12 items-center">
          <motion.div initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <p className="text-gold text-sm tracking-[3px] uppercase mb-3">The Beginning</p>
            <h2 className="section-heading mb-6">From Varanasi to<br />India's Hotels</h2>
            <div className="gold-divider mb-6" />
            <div className="space-y-4 text-gray-600 text-base leading-relaxed">
              <p>
                Atithya was founded by Samriddhi Agrawal with a simple yet powerful vision: 
                India's hospitality sector deserves better technology. While luxury chains had 
                expensive PMS systems, thousands of mid-scale and boutique properties were 
                drowning in manual processes.
              </p>
              <p>
                Incubated at <strong className="text-navy">AIC-MFIE-IMS-BHU, Varanasi</strong>, 
                Atithya began as a compliance tracking tool and quickly evolved into a comprehensive 
                operations platform covering every touchpoint from guest check-in to regulatory filing.
              </p>
              <p>
                Today, Atithya powers 500+ properties across 25+ cities, saving hoteliers 
                thousands of hours every month.
              </p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, x: 30 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <div className="bg-navy rounded-2xl p-8 text-center">
              <div className="w-24 h-24 rounded-full bg-gold/20 border-2 border-gold/40 flex items-center justify-center mx-auto mb-5">
                <span className="font-cinzel text-4xl text-gold font-bold">S</span>
              </div>
              <h3 className="font-cinzel text-gold text-2xl mb-1">Samriddhi Agrawal</h3>
              <p className="text-[#9BB0C9] text-sm mb-5">Founder & CEO</p>
              <div className="w-12 h-px bg-gold/30 mx-auto mb-5" />
              <p className="text-[#8EA8C3] text-sm leading-relaxed italic">
                "Our mission is to bring enterprise-grade operations management to every hotel 
                and resort in India — from 5-star chains to boutique guesthouses. Atithi Devo 
                Bhava is not just a saying; it's our operational philosophy."
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Values */}
      <section className="py-20 bg-white">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="text-center mb-14">
            <h2 className="section-heading mb-4">Our Foundation</h2>
            <div className="gold-divider mx-auto" />
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map(({ icon: Icon, title, text }, i) => (
              <motion.div
                key={title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center p-6"
              >
                <div className="w-14 h-14 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-4">
                  <Icon className="text-gold" size={22} />
                </div>
                <h3 className="font-cinzel text-navy text-xl mb-3">{title}</h3>
                <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Incubation badge */}
      <section className="py-16 bg-navy">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <p className="text-[#9BB0C9] text-sm uppercase tracking-wider mb-4">Proud to be</p>
            <div className="inline-block bg-gold/10 border border-gold/30 rounded-2xl px-8 py-5">
              <p className="font-cinzel text-gold text-xl">AIC-MFIE-IMS-BHU</p>
              <p className="text-[#9BB0C9] text-sm mt-1">Incubated Startup — Varanasi, India</p>
            </div>
            <p className="text-[#8EA8C3] text-sm mt-6 leading-relaxed">
              Supported by the Atal Incubation Centre at MFIE, IMS, BHU — India's premier 
              technology and entrepreneurship incubator.
            </p>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
