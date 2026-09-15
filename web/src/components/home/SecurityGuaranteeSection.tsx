"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { ShieldCheck, Lock, FileText, Key, CheckCircle2, Award } from "lucide-react";

export default function SecurityGuaranteeSection() {
  const t = useTranslations("home");

  return (
    <section className="bg-slate-50 dark:bg-[#0b1329] dark-grid-bg text-slate-900 dark:text-white py-20 md:py-24 relative overflow-hidden border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      {/* Subtle Glow Effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[180px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("securityGuarantee.title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {t("securityGuarantee.subtitle")}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            {
              icon: Lock,
              title: t("securityGuarantee.g1Title"),
              desc: t("securityGuarantee.g1Desc"),
              badge: "Escrow Protected",
            },
            {
              icon: FileText,
              title: t("securityGuarantee.g2Title"),
              desc: t("securityGuarantee.g2Desc"),
              badge: "Gov Compliant",
            },
            {
              icon: ShieldCheck,
              title: t("securityGuarantee.g3Title"),
              desc: t("securityGuarantee.g3Desc"),
              badge: "Verified Inspection",
            },
            {
              icon: Key,
              title: t("securityGuarantee.g4Title"),
              desc: t("securityGuarantee.g4Desc"),
              badge: "Full Money-Back",
            },
          ].map((card, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
              className="bg-white dark:bg-[#111a33]/60 backdrop-blur-xl border border-slate-200 dark:border-slate-800/80 rounded-3xl p-6 space-y-4 hover:border-emerald-500/50 hover:shadow-xl transition-all duration-300 flex flex-col justify-between"
            >
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <card.icon className="h-6 w-6" />
                  </div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-300 bg-emerald-50 dark:bg-emerald-950/80 px-2.5 py-1 rounded-full border border-emerald-200 dark:border-emerald-500/20">
                    {card.badge}
                  </span>
                </div>

                <h3 className="text-lg font-bold text-slate-900 dark:text-white leading-snug">{card.title}</h3>
                <p className="text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed">{card.desc}</p>
              </div>

              <div className="pt-3 border-t border-slate-200 dark:border-slate-800/80 text-[11px] text-emerald-600 dark:text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle2 className="h-3.5 w-3.5" /> Guarantee Included
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
