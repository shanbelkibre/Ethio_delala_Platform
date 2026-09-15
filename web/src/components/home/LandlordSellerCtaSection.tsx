"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { Link } from "@/i18n/routing";
import {
  TrendingUp,
  ShieldCheck,
  CheckCircle2,
  ArrowRight,
  Wallet,
  Plus,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";

export default function LandlordSellerCtaSection() {
  const t = useTranslations("home");

  return (
    <section className="bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-white py-20 border-y border-slate-200 dark:border-slate-800 relative overflow-hidden transition-colors">
      {/* Background Subtle Mesh Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          {/* LEFT CONTENT (6 Columns) */}
          <div className="lg:col-span-6 space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300/60 dark:border-emerald-800/60 px-4 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> {t("landlordCta.badge")}
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              {t("landlordCta.title")}
            </h2>

            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {t("landlordCta.subtitle")}
            </p>

            {/* Checklist Features */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {[
                { title: t("landlordCta.feat1Title"), desc: t("landlordCta.feat1Desc") },
                { title: t("landlordCta.feat2Title"), desc: t("landlordCta.feat2Desc") },
                { title: t("landlordCta.feat3Title"), desc: t("landlordCta.feat3Desc") },
                { title: t("landlordCta.feat4Title"), desc: t("landlordCta.feat4Desc") },
              ].map((feat, i) => (
                <div key={i} className="flex items-start gap-2.5 bg-white dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 p-3.5 rounded-2xl shadow-sm transition-colors">
                  <CheckCircle2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400 shrink-0 mt-0.5" />
                  <div>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">{feat.desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-7 py-3.5 rounded-2xl text-xs sm:text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/20 hover:shadow-emerald-600/30 transition-all cursor-pointer">
                  <Plus className="h-4 w-4 text-white" /> {t("landlordCta.listFree")} <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>

              <Link href="/public/properties">
                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold px-6 py-3.5 rounded-2xl text-xs sm:text-sm cursor-pointer">
                  {t("landlordCta.marketRates")}
                </Button>
              </Link>
            </div>
          </div>

          {/* RIGHT SIDE: FEMALE SELLER PORTRAIT WITH THEME-AWARE BACKGROUND (6 Columns) */}
          <div className="lg:col-span-6 relative">
            <div className="relative mx-auto max-w-md sm:max-w-lg">
              {/* Photo Background Frame */}
              <div className="relative h-[440px] sm:h-[480px] rounded-3xl overflow-hidden bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center justify-center transition-colors shadow-lg">
                <img
                  src="/images/ethiopian_woman_seller_white_bg.png"
                  alt="Ethiopian Property Owner & Landlord"
                  className="w-full h-full object-contain"
                />

                {/* Subtle Bottom Partner Badge */}
                <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-4 py-1.5 rounded-full shadow-md text-center shrink-0">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                    <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" /> Verified Property Owner Partner
                  </span>
                </div>
              </div>

              {/* Floating Badge Graphic 1 (Top Right) */}
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: [0, -10, 0], opacity: 1 }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-4 -right-2 sm:-right-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3 text-slate-900 dark:text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                  <ShieldCheck className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black">Chapa Protected</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">100% Escrow Guarantee</p>
                </div>
              </motion.div>

              {/* Floating Badge Graphic 2 (Bottom Left) */}
              <motion.div
                initial={{ y: -20, opacity: 0 }}
                animate={{ y: [0, 10, 0], opacity: 1 }}
                transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 1 }}
                className="absolute -bottom-4 -left-2 sm:-left-4 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xl flex items-center gap-3 text-slate-900 dark:text-white"
              >
                <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400 flex items-center justify-center font-bold">
                  <Wallet className="h-5 w-5" />
                </div>
                <div>
                  <h5 className="text-xs font-black">+145,000 ETB / mo</h5>
                  <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold">Direct Bank Payouts</p>
                </div>
              </motion.div>

              {/* Floating Badge Graphic 3 (Middle Right Rating) */}
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: [1, 1.05, 1], opacity: 1 }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                className="absolute top-1/2 -right-4 sm:-right-6 z-20 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 rounded-2xl p-3 shadow-xl flex items-center gap-2 text-slate-900 dark:text-white"
              >
                <Star className="h-4 w-4 text-amber-500 fill-amber-500" />
                <span className="text-xs font-black">4.9/5 Rating</span>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
