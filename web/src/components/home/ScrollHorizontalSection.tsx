"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  CheckCircle2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";

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

// Exactly 4 featured properties as requested
const featuredHouses: FeaturedHouse[] = [
  {
    id: "h1",
    title: "Bole Medhaniallem Penthouse Duplex",
    category: "Penthouse",
    city: "Addis Ababa",
    neighborhood: "Bole Medhaniallem",
    pricePerMonth: 65000,
    bedrooms: 4,
    bathrooms: 3,
    areaSqm: 260,
    image: "/images/penthouse_duplex.png",
    description: "Floor-to-ceiling glass windows with Bole skyline views, private elevator & 24/7 backup generator.",
    badge: "Penthouse Suite",
  },
  {
    id: "h2",
    title: "Old Airport Gated Family Villa",
    category: "Gated Villa",
    city: "Addis Ababa",
    neighborhood: "Old Airport",
    pricePerMonth: 85000,
    bedrooms: 5,
    bathrooms: 4,
    areaSqm: 380,
    image: "/images/villas_family_homes.png",
    description: "Spacious multi-story diplomatic villa featuring private garden, guardhouse & servant quarters.",
    badge: "Diplomatic Zone",
  },
  {
    id: "h3",
    title: "Kazanchis UNECA Modern Apartment",
    category: "Luxury Apartment",
    city: "Addis Ababa",
    neighborhood: "Kazanchis",
    pricePerMonth: 38000,
    bedrooms: 2,
    bathrooms: 2,
    areaSqm: 130,
    image: "/images/residential_apartments.png",
    description: "Walking distance to UN Headquarters. Fully furnished European kitchen with intercom & power backup.",
    badge: "Verified Landlord",
  },
  {
    id: "h4",
    title: "Bole Atlas Cozy Studio Flat",
    category: "Studio Flat",
    city: "Addis Ababa",
    neighborhood: "Bole Atlas",
    pricePerMonth: 22000,
    bedrooms: 1,
    bathrooms: 1,
    areaSqm: 65,
    image: "/images/studio_flat.png",
    description: "Sleek compact studio flat near business hubs & cafes. Fiber Wi-Fi included & custom kitchenette.",
    badge: "Popular Studio",
  },
];

export default function ScrollHorizontalSection() {
  const t = useTranslations("home.scrollHorizontal");

  return (
    <section className="bg-white dark:bg-slate-950 py-20 md:py-24 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200 dark:border-emerald-800/60 px-4 py-1.5 text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-widest">
              <Sparkles className="h-3.5 w-3.5 text-emerald-600 dark:text-emerald-400" />
              <span>{t("title")}</span>
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
              {t("title")}
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base leading-relaxed">
              {t("subtitle")}
            </p>
          </div>

          <div className="shrink-0">
            <Link href="/public/properties">
              <Button
                variant="outline"
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2"
              >
                <span>Explore All Homes</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 4-Item Responsive Grid (Fast, Fluid, Non-Scroll-Hijacking) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHouses.map((house, idx) => (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
            >
              {/* Card Image Frame */}
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

              {/* Card Body */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
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

                {/* Property Specs */}
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

                {/* Action CTA */}
                <Link href="/public/properties" className="block pt-1">
                  <Button className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors">
                    <span>{t("viewDetails")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
