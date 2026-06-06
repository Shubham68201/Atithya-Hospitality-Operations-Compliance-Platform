import { useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import axiosInstance from "../../api/axiosInstance";
import toast from "react-hot-toast";
import { FiMail, FiPhone, FiMapPin, FiSend, FiCheckCircle } from "react-icons/fi";

const contactSchema = z.object({
  name:    z.string().min(2, "Name is required"),
  email:   z.string().email("Valid email required"),
  phone:   z.string().optional(),
  subject: z.string().min(3, "Subject is required"),
  message: z.string().min(20, "Message must be at least 20 characters"),
});

const demoSchema = z.object({
  companyName:         z.string().min(2, "Company name required"),
  contactPerson:       z.string().min(2, "Contact person required"),
  email:               z.string().email("Valid email required"),
  phone:               z.string().min(10, "Valid phone required"),
  propertyType:        z.string().min(1, "Please select property type"),
  numberOfProperties:  z.coerce.number().min(1, "Enter number of properties"),
  message:             z.string().optional(),
});

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [demoSubmitted, setDemoSubmitted] = useState(false);
  const [tab, setTab] = useState("contact");

  const contactForm = useForm({ resolver: zodResolver(contactSchema) });
  const demoForm    = useForm({ resolver: zodResolver(demoSchema) });

  const onContact = async (data) => {
    try {
      await axiosInstance.post("/contact", data);
      setSubmitted(true);
      toast.success("Message sent! We'll respond within 24 hours.");
    } catch {
      toast.error("Failed to send. Please try again.");
    }
  };

  const onDemo = async (data) => {
    try {
      await axiosInstance.post("/demo", data);
      setDemoSubmitted(true);
      toast.success("Demo request received! Check your email for confirmation.");
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to submit request.");
    }
  };

  const SuccessCard = ({ title, text }) => (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="text-center py-12">
      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
        <FiCheckCircle className="text-green-500" size={28} />
      </div>
      <h3 className="font-cinzel text-navy text-xl mb-2">{title}</h3>
      <p className="text-gray-500 text-sm leading-relaxed">{text}</p>
    </motion.div>
  );

  return (
    <div className="pt-20">
      {/* Hero */}
      <section className="bg-navy py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <p className="text-gold text-sm tracking-[3px] uppercase font-medium mb-4">Get In Touch</p>
            <h1 className="font-cinzel text-4xl sm:text-5xl text-ivory mb-6">
              Let's Talk About Your<br /><span className="text-gold">Hotel's Future</span>
            </h1>
            <div className="w-16 h-0.5 bg-gold mx-auto mb-6" />
            <p className="text-[#9BB0C9] text-lg max-w-xl mx-auto">
              Have questions or want to see Atithya in action? We'd love to connect.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Content */}
      <section className="py-20 bg-ivory">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 grid lg:grid-cols-3 gap-10">
          {/* Contact info */}
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} className="space-y-6">
            <div>
              <h2 className="section-heading text-2xl mb-2">Contact Information</h2>
              <div className="gold-divider" />
            </div>
            {[
              { icon: FiPhone, label: "Phone", value: "+91 8828273581", href: "tel:+918828273581" },
              { icon: FiMail,  label: "Email", value: "sriperumal.aperio@gmail.com", href: "mailto:sriperumal.aperio@gmail.com" },
              { icon: FiMapPin,label: "Address", value: "AIC-MFIE-IMS-BHU, Varanasi, UP", href: null },
            ].map(({ icon: Icon, label, value, href }) => (
              <div key={label} className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg bg-gold/10 border border-gold/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                  <Icon className="text-gold" size={16} />
                </div>
                <div>
                  <p className="text-xs text-gray-400 uppercase tracking-wider mb-0.5">{label}</p>
                  {href ? (
                    <a href={href} className="text-navy font-medium text-sm hover:text-gold transition-colors break-all">{value}</a>
                  ) : (
                    <p className="text-navy font-medium text-sm">{value}</p>
                  )}
                </div>
              </div>
            ))}

            <div className="bg-navy rounded-xl p-5 mt-6">
              <p className="text-gold text-xs tracking-wider uppercase mb-2">Incubated at</p>
              <p className="text-ivory text-sm font-medium">AIC-MFIE-IMS-BHU</p>
              <p className="text-[#9BB0C9] text-xs mt-1">Varanasi, Uttar Pradesh, India</p>
            </div>
          </motion.div>

          {/* Forms */}
          <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="lg:col-span-2">
            {/* Tab switcher */}
            <div className="flex gap-1 bg-gray-100 rounded-xl p-1 mb-6">
              {[{ key: "contact", label: "Send Message" }, { key: "demo", label: "Request Demo" }].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => setTab(key)}
                  className={`flex-1 py-2.5 rounded-lg text-sm font-medium transition-all ${
                    tab === key ? "bg-white text-navy shadow-sm" : "text-gray-500 hover:text-gray-700"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>

            <div className="card-elegant">
              {tab === "contact" ? (
                submitted ? (
                  <SuccessCard title="Message Received!" text="Our team will get back to you within 24 business hours. We look forward to connecting!" />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-field">Full Name *</label>
                        <input className="input-field" placeholder="Your name" {...contactForm.register("name")} />
                        {contactForm.formState.errors.name && <p className="error-text">{contactForm.formState.errors.name.message}</p>}
                      </div>
                      <div>
                        <label className="label-field">Email *</label>
                        <input className="input-field" type="email" placeholder="your@email.com" {...contactForm.register("email")} />
                        {contactForm.formState.errors.email && <p className="error-text">{contactForm.formState.errors.email.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-field">Phone</label>
                        <input className="input-field" type="tel" placeholder="Mobile number" {...contactForm.register("phone")} />
                      </div>
                      <div>
                        <label className="label-field">Subject *</label>
                        <input className="input-field" placeholder="What's this about?" {...contactForm.register("subject")} />
                        {contactForm.formState.errors.subject && <p className="error-text">{contactForm.formState.errors.subject.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label-field">Message *</label>
                      <textarea rows={4} className="input-field resize-none" placeholder="Your message..." {...contactForm.register("message")} />
                      {contactForm.formState.errors.message && <p className="error-text">{contactForm.formState.errors.message.message}</p>}
                    </div>
                    <button onClick={contactForm.handleSubmit(onContact)} className="btn-gold w-full py-3.5 flex items-center justify-center gap-2">
                      <FiSend size={16} /> Send Message
                    </button>
                  </div>
                )
              ) : (
                demoSubmitted ? (
                  <SuccessCard title="Demo Request Confirmed!" text="A confirmation email has been sent. Our team will contact you within 24 hours to schedule your personalised demo." />
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-field">Company Name *</label>
                        <input className="input-field" placeholder="Hotel / Resort name" {...demoForm.register("companyName")} />
                        {demoForm.formState.errors.companyName && <p className="error-text">{demoForm.formState.errors.companyName.message}</p>}
                      </div>
                      <div>
                        <label className="label-field">Contact Person *</label>
                        <input className="input-field" placeholder="Your name" {...demoForm.register("contactPerson")} />
                        {demoForm.formState.errors.contactPerson && <p className="error-text">{demoForm.formState.errors.contactPerson.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-field">Email *</label>
                        <input className="input-field" type="email" placeholder="work@email.com" {...demoForm.register("email")} />
                        {demoForm.formState.errors.email && <p className="error-text">{demoForm.formState.errors.email.message}</p>}
                      </div>
                      <div>
                        <label className="label-field">Phone *</label>
                        <input className="input-field" type="tel" placeholder="10-digit mobile" {...demoForm.register("phone")} />
                        {demoForm.formState.errors.phone && <p className="error-text">{demoForm.formState.errors.phone.message}</p>}
                      </div>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="label-field">Property Type *</label>
                        <select className="input-field" {...demoForm.register("propertyType")}>
                          <option value="">Select type</option>
                          {["Hotel","Resort","Guest House","Hostel","Service Apartment","Other"].map((t) => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                        {demoForm.formState.errors.propertyType && <p className="error-text">{demoForm.formState.errors.propertyType.message}</p>}
                      </div>
                      <div>
                        <label className="label-field">Number of Properties *</label>
                        <input className="input-field" type="number" min={1} placeholder="e.g. 1, 5, 20" {...demoForm.register("numberOfProperties")} />
                        {demoForm.formState.errors.numberOfProperties && <p className="error-text">{demoForm.formState.errors.numberOfProperties.message}</p>}
                      </div>
                    </div>
                    <div>
                      <label className="label-field">Additional Message</label>
                      <textarea rows={3} className="input-field resize-none" placeholder="Any specific requirements or questions?" {...demoForm.register("message")} />
                    </div>
                    <button onClick={demoForm.handleSubmit(onDemo)} className="btn-gold w-full py-3.5 flex items-center justify-center gap-2">
                      <FiSend size={16} /> Request Demo
                    </button>
                  </div>
                )
              )}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
