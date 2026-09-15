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
    <section className="bg-slate-50 dark:bg-[#0b1329] dark-grid-bg text-slate-900 dark:text-white py-20 border-y border-slate-200 dark:border-slate-800/80 relative overflow-hidden transition-colors">
      {/* Background Glow Accents */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/5 dark:bg-emerald-500/10 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-blue-500/5 dark:bg-blue-500/10 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="bg-white dark:bg-[#111a33]/60 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 rounded-[32px] sm:rounded-[40px] p-8 sm:p-12 lg:p-16 shadow-xl transition-all">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800/80 px-4 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
              <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
              <span>{t("landlordCta.badge")}</span>
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
              {t("landlordCta.title")}
            </h2>

            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base md:text-lg leading-relaxed max-w-2xl mx-auto">
              {t("landlordCta.subtitle")}
            </p>

            {/* Benefit Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 pt-4 text-left">
              {[
                { title: t("landlordCta.feat1Title"), desc: t("landlordCta.feat1Desc") },
                { title: t("landlordCta.feat2Title"), desc: t("landlordCta.feat2Desc") },
                { title: t("landlordCta.feat3Title"), desc: t("landlordCta.feat3Desc") },
                { title: t("landlordCta.feat4Title"), desc: t("landlordCta.feat4Desc") },
              ].map((feat, i) => (
                <div key={i} className="bg-slate-50 dark:bg-[#0b1329]/80 border border-slate-200/80 dark:border-slate-800/80 p-5 rounded-2xl space-y-2 transition-all hover:border-emerald-500/40">
                  <div className="w-10 h-10 rounded-xl bg-emerald-100 dark:bg-emerald-950/80 border border-emerald-200 dark:border-emerald-500/20 text-emerald-600 dark:text-emerald-400 flex items-center justify-center font-bold">
                    <CheckCircle2 className="h-5 w-5" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-900 dark:text-white">{feat.title}</h4>
                  <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">{feat.desc}</p>
                </div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link href="/auth/register">
                <Button size="lg" className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-sm sm:text-base flex items-center gap-2 shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all cursor-pointer">
                  <Plus className="h-5 w-5 text-white" /> {t("landlordCta.listFree")} <ArrowRight className="h-5 w-5" />
                </Button>
              </Link>

              <Link href="/public/properties">
                <Button size="lg" variant="outline" className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold px-7 py-4 rounded-2xl text-sm sm:text-base cursor-pointer">
                  {t("landlordCta.marketRates")}
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
