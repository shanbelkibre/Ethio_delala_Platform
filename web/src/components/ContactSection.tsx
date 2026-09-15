"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Phone, MapPin, Clock, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactSection() {
  const t = useTranslations("contact");
  const [formData, setFormData] = useState({ name: "", email: "", subject: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate an API call
    setTimeout(() => {
      alert(t("sentSuccess"));
      setFormData({ name: "", email: "", subject: "", message: "" });
      setIsSubmitting(false);
    }, 1000);
  };
  return (
    // 'id' allows the link to find this spot. 
    // 'scroll-mt-24' prevents the sticky header from covering the top of the section.
    <section id="contact" className="relative py-24 bg-white dark:bg-slate-950 overflow-hidden scroll-mt-24 transition-colors">
      {/* Abstract Background Accents */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        {/* Header Section */}
        <div className="text-center mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="text-4xl sm:text-5xl font-black text-slate-900 dark:text-white mb-4 tracking-tight"
          >
            {t("heading")}
          </motion.h2>
          <p className="text-slate-600 dark:text-slate-400 max-w-lg mx-auto text-base sm:text-lg">
            {t("subheading")}
          </p>
        </div>

        {/* Main Content Card */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="grid md:grid-cols-12 gap-0 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl border border-slate-200 dark:border-slate-800 overflow-hidden transition-colors"
        >
          
          {/* Form Side */}
          <div className="md:col-span-7 p-8 md:p-12">
            <form className="space-y-6" onSubmit={handleSubmit}>
              <div className="grid md:grid-cols-2 gap-6">
                <Input 
                  placeholder={t("fullName")} 
                  value={formData.name}
                  onChange={(e: any) => setFormData({ ...formData, name: e.target.value })}
                />
                <Input 
                  placeholder={t("emailAddress")} 
                  type="email" 
                  value={formData.email}
                  onChange={(e: any) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
              <Input 
                placeholder={t("subject")} 
                value={formData.subject}
                onChange={(e: any) => setFormData({ ...formData, subject: e.target.value })}
              />
              <textarea 
                placeholder={t("messagePlaceholder")} 
                rows={5} 
                className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all resize-none text-sm"
                value={formData.message}
                onChange={(e: any) => setFormData({ ...formData, message: e.target.value })}
                required
              />
              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-4 rounded-2xl font-bold flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-emerald-600/20 group disabled:opacity-70 disabled:cursor-not-allowed cursor-pointer"
              >
                {isSubmitting ? t("sending") : t("sendMessage")} <Send size={18} className="group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          </div>

          {/* Info Side */}
          <div className="md:col-span-5 bg-gradient-to-br from-emerald-600 to-teal-700 dark:from-emerald-900 dark:to-slate-900 p-8 md:p-12 text-white flex flex-col justify-center gap-10">
            <h3 className="text-2xl font-bold">{t("contactDetails")}</h3>
            
            <div className="space-y-8">
              <InfoRow icon={<Mail />} title={t("email")} text={t("supportEmail")} />
              <InfoRow icon={<Phone />} title={t("phone")} text={t("supportPhone")} />
              <InfoRow icon={<MapPin />} title={t("address")} text={t("addressValue")} />
              <InfoRow icon={<Clock />} title={t("hours")} text={t("hoursValue")} />
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// Reusable UI Components
const Input = ({ placeholder, type = "text", value, onChange }: { placeholder: string, type?: string, value?: string, onChange?: any }) => (
  <input 
    type={type} 
    placeholder={placeholder} 
    value={value}
    onChange={onChange}
    required
    className="w-full p-4 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white placeholder-slate-400 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 focus:outline-none transition-all text-sm" 
  />
);

const InfoRow = ({ icon, title, text }: { icon: React.ReactNode, title: string, text: string }) => (
  <div className="flex items-start gap-4">
    <div className="p-3 bg-white/10 rounded-xl">{icon}</div>
    <div>
      <p className="text-emerald-100 dark:text-emerald-300 text-xs font-bold uppercase tracking-wider">{title}</p>
      <p className="font-semibold text-base sm:text-lg">{text}</p>
    </div>
  </div>
);