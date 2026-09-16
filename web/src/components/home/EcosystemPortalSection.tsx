"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Users,
  Building2,
  ShieldCheck,
  ArrowRight,
  Zap,
  FileText,
  Wallet,
  LucideIcon,
} from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";

// ============================================================================
// MODULAR REUSABLE DESIGN TOKENS (Senior Developer Clean Code Architecture)
// ============================================================================
const portalStyles = {
  // Section Header Badge
  badge: "inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest",
  
  // Tab Pill Switcher Container
  tabContainer: "bg-slate-100 dark:bg-[#111a33]/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-2 max-w-md w-full shadow-inner",
  
  // Tab Button States
  tabButton: (isActive: boolean) =>
    cn(
      "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none",
      isActive
        ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
        : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50"
    ),

  // Feature Card Container
  card: "group relative bg-white dark:bg-[#111a33]/60 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 rounded-3xl p-6 sm:p-8 flex flex-col justify-between hover:border-emerald-500/40 hover:shadow-xl hover:shadow-emerald-500/5 transition-all duration-300 hover:-translate-y-1",
  
  // Icon Badge Container
  iconBadge: (colorClass: string) =>
    cn(
      "w-12 h-12 rounded-2xl flex items-center justify-center font-bold transition-transform duration-300 group-hover:scale-110 shadow-sm",
      colorClass
    ),

  // Card Content
  cardTitle: "text-xl font-bold text-slate-900 dark:text-white tracking-tight group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors",
  cardDesc: "text-slate-600 dark:text-slate-300 text-xs sm:text-sm leading-relaxed flex-1",
  
  // Action Link
  cardLink: "inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group-hover:translate-x-1 transition-all pt-2",
};

// ============================================================================
// REUSABLE PORTAL FEATURE CARD COMPONENT
// ============================================================================
interface FeatureCardProps {
  icon: LucideIcon;
  iconColor: string;
  title: string;
  desc: string;
  linkHref: string;
  linkText: string;
}

function PortalFeatureCard({
  icon: Icon,
  iconColor,
  title,
  desc,
  linkHref,
  linkText,
}: FeatureCardProps) {
  return (
    <div className={portalStyles.card}>
      <div className="space-y-4">
        <div className={portalStyles.iconBadge(iconColor)}>
          <Icon className="h-6 w-6" />
        </div>

        <h3 className={portalStyles.cardTitle}>{title}</h3>
        <p className={portalStyles.cardDesc}>{desc}</p>
      </div>

      <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
        <Link href={linkHref} className={portalStyles.cardLink}>
          <span>{linkText}</span>
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
      </div>
    </div>
  );
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================
export default function EcosystemPortalSection() {
  const [activePersona, setActivePersona] = useState<"tenants" | "landlords">("tenants");
  const t = useTranslations("home.personas");

  const tenantFeatures: FeatureCardProps[] = [
    {
      title: t("tenant1Title"),
      desc: t("tenant1Desc"),
      icon: ShieldCheck,
      iconColor: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50",
      linkHref: "/public/properties",
      linkText: t("exploreHomes"),
    },
    {
      title: t("tenant2Title"),
      desc: t("tenant2Desc"),
      icon: FileText,
      iconColor: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
      linkHref: "/public/properties",
      linkText: t("exploreHomes"),
    },
    {
      title: t("tenant3Title"),
      desc: t("tenant3Desc"),
      icon: Wallet,
      iconColor: "bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 border border-indigo-100 dark:border-indigo-900/50",
      linkHref: "/public/properties",
      linkText: t("exploreHomes"),
    },
  ];

  const landlordFeatures: FeatureCardProps[] = [
    {
      title: t("landlord1Title"),
      desc: t("landlord1Desc"),
      icon: Wallet,
      iconColor: "bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/50",
      linkHref: "/auth/register",
      linkText: t("listYourProperty"),
    },
    {
      title: t("landlord2Title"),
      desc: t("landlord2Desc"),
      icon: ShieldCheck,
      iconColor: "bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 border border-blue-100 dark:border-blue-900/50",
      linkHref: "/auth/register",
      linkText: t("listYourProperty"),
    },
    {
      title: t("landlord3Title"),
      desc: t("landlord3Desc"),
      icon: Zap,
      iconColor: "bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 border border-purple-100 dark:border-purple-900/50",
      linkHref: "/auth/register",
      linkText: t("listYourProperty"),
    },
  ];

  return (
    <section className="bg-slate-50 dark:bg-[#0b1329] dark-grid-bg py-20 md:py-24 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-10 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* Persona Switcher Buttons */}
        <div className="flex justify-center mb-12">
          <div className={portalStyles.tabContainer}>
            <button
              onClick={() => setActivePersona("tenants")}
              className={portalStyles.tabButton(activePersona === "tenants")}
            >
              <Users className="h-4 w-4" />
              <span>{t("forTenants")}</span>
            </button>
            <button
              onClick={() => setActivePersona("landlords")}
              className={portalStyles.tabButton(activePersona === "landlords")}
            >
              <Building2 className="h-4 w-4" />
              <span>{t("forLandlords")}</span>
            </button>
          </div>
        </div>

        {/* Dynamic Display Grid */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activePersona}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6"
          >
            {(activePersona === "tenants" ? tenantFeatures : landlordFeatures).map((item, idx) => (
              <PortalFeatureCard key={idx} {...item} />
            ))}
          </motion.div>
        </AnimatePresence>

      </div>
    </section>
  );
}
