"use client";

import React, { useEffect, useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";
import { motion, useMotionValue, useSpring, useInView, AnimatePresence } from "framer-motion";
import {
  Store,
  Wrench,
  Truck,
  Smartphone,
  CreditCard,
  ArrowRight,
  Sparkles,
  Calendar,
  Users,
  Briefcase,
  Download,
  CheckCircle2,
  MapPin,
  ShieldCheck,
  Building2,
  Building,
  Trees,
  Coffee,
  Home as HomeIcon,
  GraduationCap,
  Waves,
  Sun,
  Banknote,
  Coins,
  Wallet,
  Gem,
  BedDouble,
  Sofa,
  Castle,
  DollarSign,
  Bed,
  Bath,
  Maximize2,
  Zap,
  FileText,
  type LucideIcon,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, cn } from "@/lib/utils";
import { SearchableSelect, type SelectOption } from "@/components/ui/SearchableSelect";
import Testimonials from "@/components/home/Testimonials";
import Chatbot from "@/components/home/Chatbot";
import ContactSection from "@/components/home/ContactSection";
import { cmsService, type CmsConfig } from "@/features/cms";
import { adminService } from "@/features/admin";
import { defaultCmsConfig } from "@/lib/cms";

// ============================================================================
// REUSABLE PREMIUM CARD (MATCHING THE USER'S TARGET SECOND IMAGE FOR ALL)
// ============================================================================

interface PremiumCardProps {
  stepOrBadge?: string;
  badgeColorClass?: string;
  icon?: LucideIcon;
  logo?: string;
  iconBgClass?: string;
  title: string;
  description: string;
  barBgClass: string;
  linkHref?: string;
  linkText?: string;
  idx?: number;
}

export function PremiumCard({
  stepOrBadge,
  badgeColorClass = "text-emerald-500 dark:text-emerald-400",
  icon: Icon,
  logo,
  iconBgClass,
  title,
  description,
  barBgClass,
  linkHref,
  linkText,
  idx = 0,
}: PremiumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: idx * 0.1 }}
      viewport={{ once: true }}
      className="h-full flex"
    >
      <div className="w-full bg-white dark:bg-[#0e162e] border border-slate-200/90 dark:border-slate-800/90 rounded-[28px] p-7 sm:p-8 flex flex-col justify-between hover:border-emerald-500/50 hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 group">
        <div>
          {/* Vibrant Icon or Partner Logo Box */}
          <div
            className={cn(
              "rounded-2xl flex items-center justify-center mb-6 shadow-md group-hover:scale-105 transition-transform duration-300 overflow-hidden",
              logo
                ? "w-40 h-20 bg-white p-2 border border-slate-200/90 dark:border-slate-700/80 shadow-sm"
                : cn("w-14 h-14", iconBgClass || "bg-emerald-600 text-white")
            )}
          >
            {logo ? (
              <img src={logo} alt={title} className="w-full h-full object-contain" />
            ) : Icon ? (
              <Icon className="w-6 h-6 text-white" />
            ) : null}
          </div>

          {/* Badge / Step Text (e.g. STEP 01) */}
          {stepOrBadge && (
            <span
              className={cn(
                "text-[11px] font-black uppercase tracking-[0.2em] mb-3 block",
                badgeColorClass
              )}
            >
              {stepOrBadge}
            </span>
          )}

          {/* Card Title */}
          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-3 tracking-tight leading-snug group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
            {title}
          </h3>

          {/* Card Description */}
          <p className="text-slate-600 dark:text-slate-400 text-xs sm:text-sm leading-relaxed">
            {description}
          </p>
        </div>

        <div>
          {/* Optional Action Link */}
          {linkHref && linkText && (
            <div className="pt-4 mt-4 border-t border-slate-100 dark:border-slate-800/80">
              <Link
                href={linkHref}
                className="inline-flex items-center gap-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 group-hover:translate-x-1 transition-all"
              >
                <span>{linkText}</span>
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </div>
          )}

          {/* Colored Bottom Accent Bar */}
          <div
            className={cn(
              "mt-6 h-1 w-10 rounded-full transition-all duration-300 group-hover:w-full",
              barBgClass
            )}
          />
        </div>
      </div>
    </motion.div>
  );
}

// Reusable Property Card (Used in Featured Home Rentals)
interface FeaturedHouse {
  id: string;
  title: string;
  category: string;
  city: string;
  neighborhood: string;
  pricePerMonth: number;
  bedrooms: number;
  bathrooms: number;
  areaSqm: number;
  image: string;
  description: string;
  badge: string;
}

interface FeaturedPropertyCardProps {
  house: FeaturedHouse;
  t: (key: string) => string;
  idx: number;
}

export function FeaturedPropertyCard({ house, t, idx }: FeaturedPropertyCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: idx * 0.1 }}
      className="bg-white dark:bg-[#0e162e] border border-slate-200/90 dark:border-slate-800/90 rounded-[28px] overflow-hidden shadow-sm hover:shadow-2xl hover:border-emerald-500/40 hover:-translate-y-2 transition-all duration-300 flex flex-col justify-between group"
    >
      <div className="relative h-48 w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={house.image}
          alt={house.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute top-3 left-3 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-700 shadow-sm text-emerald-800 dark:text-emerald-400 text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
          {house.badge}
        </div>
        <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md text-white text-[11px] px-2.5 py-1 rounded-xl flex items-center gap-1.5 font-semibold shadow-md">
          <MapPin className="h-3 w-3 text-emerald-400" />
          <span>{house.neighborhood}</span>
        </div>
      </div>

      <div className="p-6 sm:p-7 flex-1 flex flex-col justify-between space-y-4">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-emerald-700 dark:text-emerald-400 uppercase tracking-wider">
              {house.category}
            </span>
            <span className="text-base font-black text-emerald-700 dark:text-emerald-400 font-mono">
              {formatCurrency(house.pricePerMonth)}
              <span className="text-[10px] font-normal text-slate-500"> {t("perMonth")}</span>
            </span>
          </div>

          <h3 className="font-bold text-slate-900 dark:text-white text-base mt-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors line-clamp-1">
            {house.title}
          </h3>

          <p className="text-xs text-slate-600 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
            {house.description}
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-300 font-medium">
          <span className="flex items-center gap-1">
            <Bed className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{house.bedrooms} {t("beds")}</span>
          </span>
          <span className="flex items-center gap-1">
            <Bath className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{house.bathrooms} {t("baths")}</span>
          </span>
          <span className="flex items-center gap-1">
            <Maximize2 className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{house.areaSqm} m²</span>
          </span>
        </div>

        <Link href="/properties" className="block pt-1">
          <Button className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer">
            <span>{t("viewDetails")}</span>
            <ArrowRight className="h-3.5 w-3.5" />
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

// Reusable Animated Counter Item
interface CounterItemProps {
  value: number;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CounterNumber = ({ value }: { value: number }) => {
  const ref = useRef<HTMLSpanElement>(null);
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, {
    damping: 30,
    stiffness: 60,
  });
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  useEffect(() => {
    if (isInView) {
      motionValue.set(value);
    }
  }, [isInView, value, motionValue]);

  useEffect(() => {
    return springValue.on("change", (latest) => {
      if (ref.current) {
        ref.current.textContent = Math.floor(latest).toLocaleString();
      }
    });
  }, [springValue]);

  return (
    <span ref={ref} className="text-4xl sm:text-5xl font-black tracking-tight text-slate-900 dark:text-white drop-shadow-sm">
      0
    </span>
  );
};

export const CounterItem = ({ value, label, icon: Icon }: CounterItemProps) => {
  return (
    <div className="flex flex-col items-center text-center p-6 rounded-[28px] bg-white/80 dark:bg-[#0e162e] border border-slate-200/60 dark:border-slate-800/60 shadow-sm relative group hover:border-emerald-500/30 transition-all">
      <div className="mb-4 text-emerald-600 dark:text-emerald-400 group-hover:scale-110 transition-transform duration-300">
        <Icon className="h-7 w-7 stroke-[2]" />
      </div>
      <CounterNumber value={value} />
      <p className="mt-3 text-xs sm:text-sm font-semibold tracking-wide text-slate-600 dark:text-slate-300 max-w-[180px]">
        {label}
      </p>
    </div>
  );
};

// ============================================================================
// SECTION COMPONENTS (DECREASED INTERNAL SPACING, NO DIVIDER LINES)
// ============================================================================

// --- 1B: FEATURED HOME RENTALS & SEARCH FILTER (Image 1) ---
function ScrollHorizontalSection() {
  const router = useRouter();
  const t = useTranslations("home.scrollHorizontal");
  const tHome = useTranslations("home");
  const [searchLocation, setSearchLocation] = useState("");
  const [searchPrice, setSearchPrice] = useState("");
  const [searchRooms, setSearchRooms] = useState("");

  const locationOptions: SelectOption[] = [
    { value: "", label: tHome("wherePlaceholder") },
    { value: "Bole", label: "Bole Medhaniallem", description: "Commercial & Expatriate Hub, Addis Ababa", icon: <Building2 className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "Kazanchis", label: "Kazanchis Diplomatic Quarter", description: "UNECA & Govt Ministries, Addis Ababa", icon: <Building className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "Old Airport", label: "Old Airport Embassy Enclave", description: "Quiet Luxury Gated Villas, Addis Ababa", icon: <Trees className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "Bole Atlas", label: "Bole Atlas & Cameroon St", description: "Cafes & Expat Studio Flats, Addis Ababa", icon: <Coffee className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "CMC", label: "CMC & Sunshine Real Estate", description: "Modern Family Residential Compounds, Addis Ababa", icon: <HomeIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "Sarbet", label: "Sarbet & Bisrate Gabriel", description: "Residential & International Schools, Addis Ababa", icon: <GraduationCap className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "Hawassa", label: "Lakefront Promenade", description: "Serene Lakeview Resort Living, Hawassa", icon: <Waves className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "Adama", label: "Expressway Business Quarter", description: "Warm Weather & Fast Commute, Adama", icon: <Sun className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
  ];

  const priceOptions: SelectOption[] = [
    { value: "", label: tHome("anyPrice") },
    { value: "25000", label: tHome("under25k"), description: "Budget Studio & 1-Bed Flats", icon: <Coins className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "50000", label: tHome("between25k50k"), description: "Standard 2-3 Bedroom Apartments", icon: <Banknote className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "100000", label: "50,000 - 100,000 ETB", description: "Executive Condos & Duplexes", icon: <Wallet className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "200000", label: "100,000 - 200,000 ETB", description: "Diplomatic Villas & Penthouses", icon: <CreditCard className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "200001", label: tHome("above50k"), description: "Ultra-Luxury Diplomatic Compounds", icon: <Gem className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
  ];

  const roomOptions: SelectOption[] = [
    { value: "", label: tHome("rooms") },
    { value: "1", label: tHome("bedStudio"), description: "Single Renter & Expat Studio", icon: <Sofa className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "2", label: tHome("twoBeds"), description: "Couple or Small Family Apartment", icon: <Bed className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "3", label: tHome("threeBeds"), description: "Spacious 3-Bed Family Condo", icon: <BedDouble className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "4", label: tHome("fourPlusBeds"), description: "4-Bed Family Townhouse", icon: <HomeIcon className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
    { value: "5", label: "5+ Bedrooms Villa", description: "Diplomatic Multi-Story Compound", icon: <Castle className="h-4 w-4 text-emerald-600 dark:text-emerald-400" /> },
  ];

  const featuredHousesList: FeaturedHouse[] = [
    {
      id: "h1",
      title: t("h1Title"),
      category: t("h1Category"),
      city: "Addis Ababa",
      neighborhood: t("h1Neighborhood"),
      pricePerMonth: 65000,
      bedrooms: 4,
      bathrooms: 3,
      areaSqm: 260,
      image: "/images/penthouse_duplex.png",
      description: t("h1Desc"),
      badge: t("h1Badge"),
    },
    {
      id: "h2",
      title: t("h2Title"),
      category: t("h2Category"),
      city: "Addis Ababa",
      neighborhood: t("h2Neighborhood"),
      pricePerMonth: 85000,
      bedrooms: 5,
      bathrooms: 4,
      areaSqm: 380,
      image: "/images/villas_family_homes.png",
      description: t("h2Desc"),
      badge: t("h2Badge"),
    },
    {
      id: "h3",
      title: t("h3Title"),
      category: t("h3Category"),
      city: "Addis Ababa",
      neighborhood: t("h3Neighborhood"),
      pricePerMonth: 38000,
      bedrooms: 2,
      bathrooms: 2,
      areaSqm: 130,
      image: "/images/residential_apartments.png",
      description: t("h3Desc"),
      badge: t("h3Badge"),
    },
    {
      id: "h4",
      title: t("h4Title"),
      category: t("h4Category"),
      city: "Addis Ababa",
      neighborhood: t("h4Neighborhood"),
      pricePerMonth: 22000,
      bedrooms: 1,
      bathrooms: 1,
      areaSqm: 65,
      image: "/images/studio_flat.png",
      description: t("h4Desc"),
      badge: t("h4Badge"),
    },
  ];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchLocation) params.set("q", searchLocation);
    if (searchPrice) params.set("price", searchPrice);
    if (searchRooms) params.set("rooms", searchRooms);
    router.push(`/properties?${params.toString()}`);
  };

  return (
    <section className="pt-2 md:pt-4 pb-8 md:pb-10 text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div className="space-y-3 max-w-2xl">
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="shrink-0">
            <Link href="/properties">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>{t("exploreAllHomes")}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHousesList.map((house, idx) => (
            <FeaturedPropertyCard key={house.id} house={house} t={t} idx={idx} />
          ))}
        </div>

        <div className="mt-10 space-y-4">
          <form
            onSubmit={handleSearch}
            className="w-full bg-white/95 dark:bg-[#0e162e] border border-slate-200/90 dark:border-slate-800/90 rounded-[28px] p-3 sm:p-4 shadow-sm dark:shadow-none backdrop-blur-xl transition-all"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
              <SearchableSelect
                options={locationOptions}
                value={searchLocation}
                onChange={(val) => setSearchLocation(val)}
                placeholder={tHome("wherePlaceholder")}
                icon={<MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                searchPlaceholder="Filter neighborhood..."
                searchThreshold={5}
              />

              <SearchableSelect
                options={priceOptions}
                value={searchPrice}
                onChange={(val) => setSearchPrice(val)}
                placeholder={tHome("anyPrice")}
                icon={<DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                searchPlaceholder="Filter price..."
                searchThreshold={5}
              />

              <SearchableSelect
                options={roomOptions}
                value={searchRooms}
                onChange={(val) => setSearchRooms(val)}
                placeholder={tHome("rooms")}
                icon={<Bed className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                searchPlaceholder="Filter rooms..."
                searchThreshold={5}
              />

              <Button
                type="submit"
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-4 rounded-2xl transition-all shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
              >
                {tHome("searchButton")}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}

// --- 2A: ABOUT US SECTION (Image 2 Style - Open, Centered, Reusable PremiumCards) ---
function AboutUsSection() {
  const t = useTranslations("home");

  return (
    <section className="py-8 md:py-10 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="space-y-10">
        <div className="text-center max-w-3xl mx-auto space-y-4">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {t("aboutTitle")}
          </h2>
        </div>

        {/* Mission & Vision Cards (Matching Image 2 Style) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <PremiumCard
            stepOrBadge="OUR MISSION"
            badgeColorClass="text-emerald-500 dark:text-emerald-400"
            icon={Store}
            iconBgClass="bg-emerald-500"
            title={t("ourMission")}
            description={t("ourMissionDesc")}
            barBgClass="bg-emerald-500"
            idx={0}
          />
          <PremiumCard
            stepOrBadge="OUR VISION"
            badgeColorClass="text-blue-500 dark:text-blue-400"
            icon={ShieldCheck}
            iconBgClass="bg-blue-500"
            title={t("ourVision")}
            description={t("ourVisionDesc")}
            barBgClass="bg-blue-500"
            idx={1}
          />
        </div>


      </div>
    </section>
  );
}

// --- 2B: LANDLORD / SELLER CTA SECTION (Image 3 - EXACT SAME DESIGN AS IMAGE 2) ---
function LandlordSellerCtaSection() {
  const t = useTranslations("home");

  const landlordBenefits = [
    {
      step: "01",
      title: t("landlordCta.feat1Title"),
      desc: t("landlordCta.feat1Desc"),
      icon: Plus,
      iconBg: "bg-blue-500",
      badgeColor: "text-blue-500 dark:text-blue-400",
      barBg: "bg-blue-500",
    },
    {
      step: "02",
      title: t("landlordCta.feat2Title"),
      desc: t("landlordCta.feat2Desc"),
      icon: CreditCard,
      iconBg: "bg-emerald-500",
      badgeColor: "text-emerald-500 dark:text-emerald-400",
      barBg: "bg-emerald-500",
    },
    {
      step: "03",
      title: t("landlordCta.feat3Title"),
      desc: t("landlordCta.feat3Desc"),
      icon: ShieldCheck,
      iconBg: "bg-amber-500",
      badgeColor: "text-amber-500 dark:text-amber-400",
      barBg: "bg-amber-500",
    },
    {
      step: "04",
      title: t("landlordCta.feat4Title"),
      desc: t("landlordCta.feat4Desc"),
      icon: FileText,
      iconBg: "bg-purple-500",
      badgeColor: "text-purple-500 dark:text-purple-400",
      barBg: "bg-purple-500",
    },
  ];

  return (
    <section className="py-8 md:py-10 relative overflow-hidden transition-colors text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center max-w-3xl mx-auto mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300/80 dark:border-emerald-800/80 px-4 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
            <TrendingUp className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
            <span>{t("landlordCta.badge")}</span>
          </div>

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight leading-tight text-slate-900 dark:text-white">
            {t("landlordCta.title")}
          </h2>
        </div>

        {/* 4 Cards Exactly matching Image 2 */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {landlordBenefits.map((feat, i) => (
            <PremiumCard
              key={i}
              stepOrBadge={`BENEFIT ${feat.step}`}
              badgeColorClass={feat.badgeColor}
              icon={feat.icon}
              iconBgClass={feat.iconBg}
              title={feat.title}
              description={feat.desc}
              barBgClass={feat.barBg}
              idx={i}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 2C: HOW DELALA WORKS SECTION (Image 4 - TARGET DESIGN) ---
function HowItWorksSection() {
  const t = useTranslations("home");

  const steps = [
    {
      step: "01",
      title: t("step1Title"),
      description: t("step1Desc"),
      icon: Store,
      iconBg: "bg-blue-500",
      badgeColor: "text-blue-500 dark:text-blue-400",
      barBg: "bg-blue-500",
    },
    {
      step: "02",
      title: t("step2Title"),
      description: t("step2Desc"),
      icon: Wrench,
      iconBg: "bg-emerald-500",
      badgeColor: "text-emerald-500 dark:text-emerald-400",
      barBg: "bg-emerald-500",
    },
    {
      step: "03",
      title: t("step3Title"),
      description: t("step3Desc"),
      icon: CreditCard,
      iconBg: "bg-amber-500",
      badgeColor: "text-amber-500 dark:text-amber-400",
      barBg: "bg-amber-500",
    },
    {
      step: "04",
      title: t("step4Title"),
      description: t("step4Desc"),
      icon: Truck,
      iconBg: "bg-purple-500",
      badgeColor: "text-purple-500 dark:text-purple-400",
      barBg: "bg-purple-500",
    },
  ];

  return (
    <section className="py-8 md:py-10 relative overflow-hidden transition-colors text-slate-900 dark:text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="text-center mb-12 space-y-4">
          <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
            {t("howItWorksTitle")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-base md:text-lg max-w-2xl mx-auto mt-4 leading-relaxed">
            {t("howItWorksSubtitle")}
          </p>
        </div>

        {/* Steps Grid using the exact same PremiumCard */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {steps.map((item, i) => (
            <PremiumCard
              key={i}
              stepOrBadge={`STEP ${item.step}`}
              badgeColorClass={item.badgeColor}
              icon={item.icon}
              iconBgClass={item.iconBg}
              title={item.title}
              description={item.description}
              barBgClass={item.barBg}
              idx={i}
            />
          ))}
        </div>

        {/* Unified Action Buttons in One Line */}
        <div className="flex flex-wrap items-center justify-center gap-4 mt-12">
          <Link href="/auth/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm transition-all shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 group cursor-pointer flex items-center gap-2">
              {t("startRentingToday")}
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
            </Button>
          </Link>

          <Link href="/auth/register">
            <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-3.5 rounded-2xl text-sm flex items-center gap-2 shadow-lg shadow-emerald-600/25 hover:-translate-y-0.5 transition-all cursor-pointer">
              <Plus className="h-4 w-4 text-white" /> {t("landlordCta.listFree")} <ArrowRight className="h-4 w-4" />
            </Button>
          </Link>

          <Link href="/properties">
            <Button
              variant="outline"
              className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold px-7 py-3.5 rounded-2xl text-sm cursor-pointer"
            >
              {t("landlordCta.marketRates")}
            </Button>
          </Link>
        </div>
      </div>
    </section>
  );
}

// --- 3A: ECOSYSTEM PORTAL SECTION (Image 5) ---
function EcosystemPortalSection() {
  const [activePersona, setActivePersona] = useState<"tenants" | "landlords">("tenants");
  const t = useTranslations("home.personas");

  const tenantFeatures = [
    {
      step: "01",
      title: t("tenant1Title"),
      desc: t("tenant1Desc"),
      icon: ShieldCheck,
      iconBg: "bg-blue-500",
      badgeColor: "text-blue-500 dark:text-blue-400",
      barBg: "bg-blue-500",
      linkHref: "/properties",
      linkText: t("exploreHomes"),
    },
    {
      step: "02",
      title: t("tenant2Title"),
      desc: t("tenant2Desc"),
      icon: FileText,
      iconBg: "bg-emerald-500",
      badgeColor: "text-emerald-500 dark:text-emerald-400",
      barBg: "bg-emerald-500",
      linkHref: "/properties",
      linkText: t("exploreHomes"),
    },
    {
      step: "03",
      title: t("tenant3Title"),
      desc: t("tenant3Desc"),
      icon: Wallet,
      iconBg: "bg-purple-500",
      badgeColor: "text-purple-500 dark:text-purple-400",
      barBg: "bg-purple-500",
      linkHref: "/properties",
      linkText: t("exploreHomes"),
    },
  ];

  const landlordFeatures = [
    {
      step: "01",
      title: t("landlord1Title"),
      desc: t("landlord1Desc"),
      icon: Wallet,
      iconBg: "bg-emerald-500",
      badgeColor: "text-emerald-500 dark:text-emerald-400",
      barBg: "bg-emerald-500",
      linkHref: "/auth/register",
      linkText: t("listYourProperty"),
    },
    {
      step: "02",
      title: t("landlord2Title"),
      desc: t("landlord2Desc"),
      icon: ShieldCheck,
      iconBg: "bg-blue-500",
      badgeColor: "text-blue-500 dark:text-blue-400",
      barBg: "bg-blue-500",
      linkHref: "/auth/register",
      linkText: t("listYourProperty"),
    },
    {
      step: "03",
      title: t("landlord3Title"),
      desc: t("landlord3Desc"),
      icon: Zap,
      iconBg: "bg-purple-500",
      badgeColor: "text-purple-500 dark:text-purple-400",
      barBg: "bg-purple-500",
      linkHref: "/auth/register",
      linkText: t("listYourProperty"),
    },
  ];

  return (
    <section className="py-8 md:py-10 text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="text-center max-w-2xl mx-auto mb-8 space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        <div className="flex justify-center mb-10">
          <div className="bg-slate-100 dark:bg-[#111a33]/80 p-1.5 rounded-2xl border border-slate-200 dark:border-slate-800 flex gap-2 max-w-md w-full shadow-inner">
            <button
              onClick={() => setActivePersona("tenants")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none",
                activePersona === "tenants"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50"
              )}
            >
              <Users className="h-4 w-4" />
              <span>{t("forTenants")}</span>
            </button>
            <button
              onClick={() => setActivePersona("landlords")}
              className={cn(
                "flex-1 py-3 px-4 rounded-xl text-xs sm:text-sm font-bold transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer select-none",
                activePersona === "landlords"
                  ? "bg-emerald-600 text-white shadow-md shadow-emerald-600/25"
                  : "text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-100 hover:bg-white/50 dark:hover:bg-slate-700/50"
              )}
            >
              <Building2 className="h-4 w-4" />
              <span>{t("forLandlords")}</span>
            </button>
          </div>
        </div>

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
              <PremiumCard
                key={idx}
                stepOrBadge={`FEATURE ${item.step}`}
                badgeColorClass={item.badgeColor}
                icon={item.icon}
                iconBgClass={item.iconBg}
                title={item.title}
                description={item.desc}
                barBgClass={item.barBg}
                linkHref={item.linkHref}
                linkText={item.linkText}
                idx={idx}
              />
            ))}
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
}

// --- 3B: STATS COUNTER SECTION ---
interface StatsCounterSectionProps {
  counterData: {
    value: number;
    label: string;
    icon: React.ComponentType<{ className?: string }>;
  }[];
}

function StatsCounterSection({ counterData }: StatsCounterSectionProps) {
  return (
    <section className="py-8 md:py-10 relative overflow-hidden text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 items-center justify-center">
          {counterData.map((item, idx) => (
            <CounterItem key={idx} value={item.value} label={item.label} icon={item.icon} />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 3C: PARTNER COMPANIES SECTION ---
interface PartnersSectionProps {
  partners?: { name: string; logo: string }[];
}

function PartnersSection({ partners }: PartnersSectionProps) {
  const t = useTranslations("home.partners");

  const partnerCards = [
    {
      step: "01",
      title: t("partner1Title"),
      desc: t("partner1Desc"),
      logo: "/logos/insa.png",
      badgeColor: "text-blue-500 dark:text-blue-400",
      barBg: "bg-blue-500",
    },
    {
      step: "02",
      title: t("partner2Title"),
      desc: t("partner2Desc"),
      logo: "/logos/safaricom.png",
      badgeColor: "text-emerald-500 dark:text-emerald-400",
      barBg: "bg-emerald-500",
    },
    {
      step: "03",
      title: t("partner3Title"),
      desc: t("partner3Desc"),
      logo: "/logos/cbe.png",
      badgeColor: "text-purple-500 dark:text-purple-400",
      barBg: "bg-purple-500",
    },
    {
      step: "04",
      title: t("partner4Title"),
      desc: t("partner4Desc"),
      logo: "/logos/ethio.png",
      badgeColor: "text-cyan-500 dark:text-cyan-400",
      barBg: "bg-cyan-500",
    },
    {
      step: "05",
      title: t("partner5Title"),
      desc: t("partner5Desc"),
      logo: "/logos/chapa.png",
      badgeColor: "text-amber-500 dark:text-amber-400",
      barBg: "bg-amber-500",
    },
  ];

  return (
    <section className="py-8 md:py-10 text-slate-900 dark:text-white transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="max-w-2xl mx-auto mb-12 text-center space-y-3">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 dark:text-white tracking-tight">
            {t("title")}
          </h2>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
            {t("subtitle")}
          </p>
        </div>

        {/* 5 Cards matching the target design for all sections */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-6">
          {partnerCards.map((p, idx) => (
            <PremiumCard
              key={idx}
              stepOrBadge={`PARTNER ${p.step}`}
              badgeColorClass={p.badgeColor}
              logo={p.logo}
              title={p.title}
              description={p.desc}
              barBgClass={p.barBg}
              idx={idx}
            />
          ))}
        </div>
      </div>
    </section>
  );
}

// --- 4B: MOBILE APP DOWNLOAD SECTION ---
function MobileAppSection() {
  const t = useTranslations("home");

  return (
    <section className="py-8 md:py-10 relative overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          <div className="w-full lg:col-span-6 space-y-8 text-center lg:text-left">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-4 py-1.5 text-xs font-semibold text-emerald-700 dark:text-emerald-300 tracking-wide uppercase mx-auto lg:mx-0">
                <Smartphone className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
                {t("appBadge")}
              </div>
              <h2 className="text-3xl md:text-5xl font-black tracking-tight text-slate-900 dark:text-white leading-tight">
                {t("appTitle")}
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-base md:text-lg leading-relaxed max-w-xl mx-auto lg:mx-0">
                {t("appSubtitle")}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 max-w-md mx-auto lg:mx-0 text-left">
              {[
                t("feature1Title"),
                t("feature3Title"),
                t("feature4Title"),
                t("smartMoveInTitle"),
              ].map((text: string, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500 shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            <div className="flex flex-wrap justify-center lg:justify-start gap-4 pt-4">
              <a
                href="#play-store"
                className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-800 text-white px-6 py-3 rounded-2xl transition-all shadow-lg group hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-6 h-6 fill-current text-white group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24">
                  <path d="M3,5.27V18.73L16.55,12L3,5.27M17.87,11.33L14.3,9.5L3.63,4.12C3.43,4.02 3.22,3.97 3,4V4C3.41,4 3.8,4.13 4.13,4.35L17.87,11.33M17.87,12.67L4.13,19.65C3.8,19.87 3.41,20 3,20V20C3.22,20.03 3.43,19.98 3.63,19.88L14.3,14.5L17.87,12.67M20.33,12L16.5,10.12V13.88L20.33,12C20.76,11.79 21,11.4 21,11C21,10.6 20.76,10.21 20.33,12Z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Get it on</p>
                  <p className="text-sm font-extrabold -mt-0.5">Google Play</p>
                </div>
              </a>

              <a
                href="#app-store"
                className="flex items-center gap-3 bg-slate-900 hover:bg-slate-800 dark:bg-slate-800 dark:hover:bg-slate-700 border border-slate-800 text-white px-6 py-3 rounded-2xl transition-all shadow-lg group hover:-translate-y-0.5 active:translate-y-0"
              >
                <svg className="w-6 h-6 fill-current text-white group-hover:text-emerald-400 transition-colors" viewBox="0 0 24 24">
                  <path d="M18.71,19.5C17.88,20.74 17,21.95 15.66,21.97C14.32,22 13.89,21.18 12.37,21.18C10.84,21.18 10.37,21.95 9.1,22C7.79,22.05 6.8,20.68 5.96,19.47C4.25,17 2.94,12.45 4.7,9.39C5.57,7.87 7.13,6.91 8.82,6.88C10.1,6.86 11.32,7.75 12.11,7.75C12.89,7.75 14.37,6.68 15.92,6.84C16.57,6.87 18.39,7.1 19.56,8.82C19.47,8.88 17.39,10.1 17.41,12.63C17.44,15.65 20.06,16.66 20.1,16.67C20.08,16.74 19.67,18.11 18.71,19.5M15.97,4.17C16.63,3.37 17.07,2.28 16.95,1C16,1.04 14.9,1.6 14.24,2.38C13.68,3.04 13.19,4.14 13.34,5.39C14.39,5.47 15.4,4.88 15.97,4.17Z" />
                </svg>
                <div className="text-left">
                  <p className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">Download on the</p>
                  <p className="text-sm font-extrabold -mt-0.5">App Store</p>
                </div>
              </a>
            </div>
          </div>

          {/* Phone Mockup Frame */}
          <div className="w-full lg:col-span-6 flex justify-center relative select-none">
            <div className="relative w-[290px] h-[580px] sm:w-[310px] sm:h-[620px]">
              <div className="absolute inset-0 bg-slate-900 rounded-[50px] p-3.5 shadow-2xl border-4 border-slate-800">
                <div className="absolute top-6 left-1/2 -translate-x-1/2 w-32 h-5 bg-slate-950 rounded-full z-30 flex items-start justify-center pt-1">
                  <div className="w-12 h-1 bg-slate-800 rounded-full" />
                </div>

                <div className="w-full h-full rounded-[36px] bg-slate-950 overflow-hidden relative border border-slate-900 flex flex-col pt-12 pb-4 px-4 text-white">
                  <motion.div
                    className="w-full h-full flex flex-col justify-between"
                    initial="initial"
                    animate="animate"
                    variants={{
                      animate: {
                        transition: { staggerChildren: 3.5, delayChildren: 0.5 },
                      },
                    }}
                  >
                    <div className="space-y-4">
                      <div className="flex items-center justify-between border-b border-slate-800/80 pb-3">
                        <div className="flex items-center gap-2">
                          <div className="w-8 h-8 rounded-lg bg-lime-400 flex items-center justify-center font-black text-xs text-slate-950">
                            D
                          </div>
                          <div>
                            <h4 className="text-xs font-bold tracking-tight">Delala Rentals</h4>
                            <p className="text-[9px] text-slate-400">Delala Tech PLC</p>
                          </div>
                        </div>
                        <span className="text-[9px] bg-slate-800 text-slate-300 font-bold px-2 py-0.5 rounded-full">
                          Official
                        </span>
                      </div>

                      <div className="bg-slate-900/60 rounded-2xl p-3 border border-slate-800 relative overflow-hidden">
                        <div className="flex items-center justify-between text-xs mb-2">
                          <span className="text-slate-400 font-medium">Status</span>
                          <motion.span
                            className="text-lime-400 font-bold tracking-wide"
                            variants={{
                              initial: { opacity: 1 },
                              animate: { opacity: [1, 0.5, 1], transition: { repeat: Infinity, duration: 1.5 } },
                            }}
                          >
                            Syncing Setup...
                          </motion.span>
                        </div>

                        <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                          <motion.div
                            className="h-full bg-gradient-to-r from-amber-400 via-lime-400 to-emerald-400 rounded-full"
                            variants={{
                              initial: { width: "10%" },
                              animate: {
                                width: ["10%", "45%", "85%", "100%", "100%"],
                                transition: { repeat: Infinity, duration: 7, ease: "easeInOut" },
                              },
                            }}
                          />
                        </div>

                        <div className="mt-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                          <span>M-PWA v2.6</span>
                          <motion.span
                            variants={{
                              initial: { opacity: 1 },
                              animate: { opacity: [1, 0, 1], transition: { repeat: Infinity, duration: 7 } },
                            }}
                          >
                            Verified Secure
                          </motion.span>
                        </div>
                      </div>
                    </div>

                    <motion.div
                      className="bg-gradient-to-b from-slate-900 to-slate-950 rounded-2xl p-3 border border-slate-800/80 space-y-3 flex-1 mt-4 flex flex-col justify-center"
                      variants={{
                        initial: { y: 15, opacity: 0.6 },
                        animate: { y: [15, 0, 0, 15], opacity: [0.6, 1, 1, 0.6], transition: { repeat: Infinity, duration: 7, ease: "easeInOut" } },
                      }}
                    >
                      <div className="h-6 rounded-lg bg-lime-500/10 border border-lime-500/20 flex items-center justify-between px-2 text-[10px]">
                        <span className="text-lime-400 font-bold">Ethiopia Connected Ecosystem</span>
                        <Sparkles className="h-3 w-3 text-lime-400" />
                      </div>

                      <div className="grid grid-cols-2 gap-2">
                        <div className="p-2 rounded-xl bg-slate-850 border border-slate-800 text-center">
                          <Store className="h-4 w-4 text-lime-400 mx-auto mb-1" />
                          <p className="text-[9px] font-bold text-slate-200">Marketplace</p>
                        </div>
                        <div className="p-2 rounded-xl bg-slate-850 border border-slate-800 text-center">
                          <Wrench className="h-4 w-4 text-lime-400 mx-auto mb-1" />
                          <p className="text-[9px] font-bold text-slate-200">Services</p>
                        </div>
                      </div>

                      <div className="p-2 rounded-xl bg-lime-400 hover:bg-lime-500 text-slate-950 font-bold text-center text-[10px] flex items-center justify-center gap-1.5 shadow-lg shadow-lime-400/10">
                        <Download className="h-3.5 w-3.5 stroke-[2.5]" />
                        {t("downloadApp")}
                      </div>
                    </motion.div>

                    <div className="w-20 h-1 bg-slate-800 rounded-full mx-auto mt-3 shrink-0" />
                  </motion.div>
                </div>
              </div>
              <div className="absolute inset-4 rounded-[44px] bg-gradient-to-tr from-transparent via-white/5 to-transparent pointer-events-none z-20" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ============================================================================
// MAIN HOMEPAGE COMPONENT
// ============================================================================

export default function HomePage() {
  const locale = useLocale();
  const t = useTranslations("home");
  const [cmsConfig, setCmsConfig] = useState<CmsConfig | null>(null);
  const [dbStats, setDbStats] = useState<{
    yearsExperience: number;
    verifiedProperties: number;
    satisfiedTenants: number;
    completedBookings: number;
  } | null>(null);

  useEffect(() => {
    cmsService
      .getConfig()
      .then((res: unknown) => {
        const data = res as { config?: CmsConfig };
        if (data?.config && Object.keys(data.config).length > 0) {
          setCmsConfig(data.config);
        }
      })
      .catch(() => {});

    adminService
      .getPublicStats()
      .then((res: unknown) => {
        const data = res as {
          success?: boolean;
          stats?: {
            yearsExperience: number;
            verifiedProperties: number;
            satisfiedTenants: number;
            completedBookings: number;
          };
          data?: {
            stats?: {
              yearsExperience: number;
              verifiedProperties: number;
              satisfiedTenants: number;
              completedBookings: number;
            };
          };
        };
        const stats = data?.stats || data?.data?.stats;
        if (stats) {
          setDbStats(stats);
        }
      })
      .catch(() => {});
  }, []);

  const hero = cmsConfig?.cms_hero || defaultCmsConfig.cms_hero;

  const counterData = [
    { value: dbStats?.yearsExperience ?? 8, label: t("yearsExperience"), icon: Calendar },
    { value: dbStats?.verifiedProperties ?? 0, label: t("verifiedRentalProperties"), icon: Wrench },
    { value: dbStats?.satisfiedTenants ?? 0, label: t("satisfiedTenantsCount"), icon: Users },
    { value: dbStats?.completedBookings ?? 0, label: t("completedBookingsCount"), icon: Briefcase },
  ];

  const partners = [
    { name: "INSA", logo: "/logos/insa.png" },
    { name: "Safaricom", logo: "/logos/safaricom.png" },
    { name: "CBE", logo: "/logos/cbe.png" },
    { name: "Ethio Telecom", logo: "/logos/ethio.png" },
    { name: "Chapa", logo: "/logos/chapa.png" },
  ];

  return (
    <div className="bg-slate-50 dark:bg-[#0b1329] dark-grid-bg text-slate-900 dark:text-slate-100 transition-colors flex flex-col w-full min-h-screen">

      {/* ========================================================================= */}
      {/* 1. DIV 1: HERO & FEATURED ETHIOPIAN HOME RENTALS                           */}
      {/* ========================================================================= */}
      <div id="div-1-hero-and-featured" className="w-full relative mt-2 mb-12 md:mt-4 md:mb-16 space-y-2">
        {/* HERO BANNER (Find & Rent Your Next Dream Home in Ethiopia) */}
        <section
          className={`relative overflow-hidden px-4 pt-4 pb-4 text-slate-900 dark:text-white sm:px-6 lg:pt-6 lg:pb-6 transition-colors ${
            !hero.backgroundType || hero.backgroundType === "animation" ? "gradient-hero" : ""
          }`}
          style={hero.backgroundType === "color" ? { backgroundColor: hero.backgroundColor } : {}}
        >
          {hero.backgroundType === "image" && hero.backgroundImage && (
            <div className="absolute inset-0 z-0">
              <img src={hero.backgroundImage} alt="Hero Background" className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}
          {hero.backgroundType === "video" && hero.backgroundVideo && (
            <div className="absolute inset-0 z-0">
              <video autoPlay loop muted playsInline src={hero.backgroundVideo} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-black/40" />
            </div>
          )}

          <div className="relative z-10 mx-auto max-w-7xl">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              {/* LEFT SIDE: HERO HEADLINE, SUBTITLE & CTAs */}
              <div className="lg:col-span-7 text-left space-y-5">
                <h1
                  className={`text-3xl sm:text-5xl lg:text-6xl font-black ${
                    locale === "am" ? "leading-relaxed tracking-normal font-serif" : "leading-tight tracking-tight"
                  } text-slate-900 dark:text-white`}
                >
                  {t("heroTitle")}
                </h1>

                <p
                  className={`text-sm sm:text-base lg:text-lg text-slate-600 dark:text-slate-300 max-w-2xl ${
                    locale === "am" ? "leading-relaxed font-normal" : "leading-relaxed"
                  }`}
                >
                  {t("heroSubtitle")}
                </p>

                <div className="flex flex-wrap items-center gap-4 pt-2">
                  <Link href="/properties">
                    <Button
                      size="lg"
                      className="bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-8 py-4 rounded-2xl text-sm sm:text-base shadow-lg shadow-emerald-600/30 hover:shadow-emerald-600/40 hover:-translate-y-0.5 transition-all flex items-center gap-2 cursor-pointer"
                    >
                      <span>{t("exploreHomeRentals")}</span>
                      <ArrowRight className="h-5 w-5" />
                    </Button>
                  </Link>

                  <Link href="/auth/register">
                    <Button
                      size="lg"
                      variant="outline"
                      className="border-slate-300 dark:border-slate-700 text-slate-800 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold px-7 py-4 rounded-2xl text-sm sm:text-base transition-all cursor-pointer"
                    >
                      {t("listYourProperty")}
                    </Button>
                  </Link>
                </div>
              </div>

              {/* RIGHT SIDE: HUMAN HERO IMAGE PORTRAIT SHOWCASE */}
              <div className="lg:col-span-5 relative mt-6 lg:mt-0 flex items-center justify-center">
                <div className="relative mx-auto max-w-md sm:max-w-lg">
                  <img
                    src="/images/ethiopian_woman_seller_white_bg.png"
                    alt="Ethiopian Property Host & Owner"
                    className="w-full h-auto max-h-[460px] object-contain rounded-3xl"
                  />

                  {/* Verified Partner Badge */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border border-slate-200 dark:border-slate-800 px-4 py-2 rounded-full text-center shrink-0">
                    <span className="text-xs font-bold uppercase tracking-wider text-emerald-700 dark:text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                      {t("verifiedHost")}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* FEATURED ETHIOPIAN HOME RENTALS (Image 1) */}
        <ScrollHorizontalSection />
      </div>

      {/* ========================================================================= */}
      {/* 2. DIV 2: MISSION, LANDLORD CTA & HOW IT WORKS (Decreased space inside)   */}
      {/* ========================================================================= */}
      <div id="div-2-mission-landlord-howitworks" className="w-full relative my-16 md:my-24 space-y-6 md:space-y-8">
        {/* 2A: ABOUT US (Your comfort, security & peace of mind is our mission!) */}
        <AboutUsSection />

        {/* 2B: LANDLORD & SELLER CTA (List Your Ethiopian Property & Rent Out 3x Faster) */}
        <LandlordSellerCtaSection />

        {/* 2C: HOW DELALA WORKS (How Delala Home Rentals Works) */}
        <HowItWorksSection />
      </div>

      {/* ========================================================================= */}
      {/* 3. DIV 3: TAILORED EXPERIENCES, STATS & PARTNERS                          */}
      {/* ========================================================================= */}
      <div id="div-3-experiences-stats-partners" className="w-full relative my-16 md:my-24 space-y-6 md:space-y-8">
        {/* 3A: TAILORED EXPERIENCES (Tailored Experiences for Tenants, Landlords & Agents) */}
        <EcosystemPortalSection />

        {/* 3B: DATABASE STATS COUNTER */}
        <StatsCounterSection counterData={counterData} />

        {/* 3C: PARTNER COMPANIES */}
        <PartnersSection partners={partners} />
      </div>

      {/* ========================================================================= */}
      {/* 4. DIV 4: TESTIMONIALS & MOBILE APP (Testimonials above Mobile App)       */}
      {/* ========================================================================= */}
      <div id="div-4-testimonials-and-mobile-app" className="w-full relative my-16 md:my-24 space-y-6 md:space-y-8">
        {/* 4A: CLIENT TESTIMONIALS (Below Partnership, Above Mobile App) */}
        <Testimonials testimonials={cmsConfig?.cms_testimonials || []} />

        {/* 4B: MOBILE APP DOWNLOAD (Manage Rent, Chat & Browse On the Go) */}
        <MobileAppSection />
      </div>

      {/* ========================================================================= */}
      {/* 5. DIV 5: CONVERSATION & SUPPORT                                          */}
      {/* ========================================================================= */}
      <div id="div-5-conversation-and-support" className="w-full relative my-16 md:my-24 space-y-6 md:space-y-8">
        {/* 5A: CONTACT SECTION (Let's Start a Conversation) */}
        <ContactSection />

        {/* 5B: AI CHATBOT ASSISTANT */}
        <Chatbot />
      </div>

    </div>
  );
}