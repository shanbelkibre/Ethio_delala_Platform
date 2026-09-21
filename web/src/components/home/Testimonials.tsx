"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";
import { reviewService } from "@/features/reviews";

interface ReviewItem {
  id: string;
  name: string;
  initials?: string;
  role?: string;
  company?: string;
  content: string;
  rating?: number;
  image?: string;
}

const DEFAULT_FALLBACK_TESTIMONIALS: ReviewItem[] = [
  {
    id: "1",
    name: "Tigist Alemu",
    role: "Tenant in Bole",
    company: "Addis Ababa",
    content: "Finding an apartment in Addis Ababa used to take weeks of hassle with brokers. With Delala Home Rentals, I inspected and moved into my 2-bedroom home in 3 days!",
    rating: 5,
  },
  {
    id: "2",
    name: "Dawit Haile",
    role: "Property Owner in Kazanchis",
    company: "Addis Ababa",
    content: "Listing my apartment on Delala was seamless. Within 48 hours, I had verified tenant applications and signed a legal lease agreement digitally.",
    rating: 5,
  },
  {
    id: "3",
    name: "Bethlehem Tadesse",
    role: "Expat Tenant in Old Airport",
    company: "Addis Ababa",
    content: "The 360° virtual tours and transparent ETB pricing made house hunting from abroad stress-free. Chapa payments worked instantly without any issues.",
    rating: 5,
  },
  {
    id: "4",
    name: "Yared Bekele",
    role: "Villa Owner in CMC",
    company: "Addis Ababa",
    content: "No more paying high broker cuts or dealing with unverified tenants. The national ID verification gives complete peace of mind.",
    rating: 5,
  },
];

export default function Testimonials({ testimonials = [] }: { testimonials?: ReviewItem[] }) {
  const t = useTranslations("home.testimonials");
  const [reviews, setReviews] = useState<ReviewItem[]>(
    testimonials && testimonials.length > 0 ? testimonials : DEFAULT_FALLBACK_TESTIMONIALS
  );
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    // Retrieve authentic reviews directly from the database Review table
    reviewService.getPublicReviews()
      .then((res: { success?: boolean; data?: { reviews?: ReviewItem[] }; reviews?: ReviewItem[] }) => {
        const list = res?.reviews || res?.data?.reviews;
        if (Array.isArray(list) && list.length > 0) {
          setReviews(list);
        }
      })
      .catch(() => {});
  }, []);

  // If testimonials prop updates later (e.g. CMS loaded)
  useEffect(() => {
    if (testimonials && testimonials.length > 0) {
      setReviews(testimonials);
    }
  }, [testimonials]);

  // Helper to get initials
  const getInitials = (item: ReviewItem) => {
    if (item.initials) return item.initials;
    if (!item.name) return "TA";
    const parts = item.name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return item.name.slice(0, 2).toUpperCase();
  };

  // Repeated items array for smooth continuous carousel
  const carouselItems = [...reviews, ...reviews, ...reviews, ...reviews];

  return (
    <section className="py-20 md:py-28 overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="text-center mb-16 space-y-3">
          <div className="inline-flex items-center gap-2 rounded-full bg-emerald-100 dark:bg-emerald-950/50 border border-emerald-300/60 dark:border-emerald-800/60 px-4 py-1.5 text-xs font-bold text-emerald-800 dark:text-emerald-300 uppercase tracking-widest">
            {t("badge")}
          </div>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black tracking-tight text-slate-900 dark:text-white">
            {t("title")}
          </h2>
        </div>

        {/* Animated Testimonial Marquee (Decreased speed for easy reading + Pause on Hover) */}
        <div 
          className="overflow-hidden w-full relative py-4"
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
        >
          <motion.div 
            animate={isHovered ? {} : { x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 50, repeat: Infinity }}
            className="flex w-max gap-8 items-start cursor-grab active:cursor-grabbing px-4"
          >
            {carouselItems.map((item, i) => {
              const initials = getInitials(item);

              return (
                <div key={`${item.id}-${i}`} className="flex flex-col items-center w-[360px] sm:w-[420px] flex-shrink-0">
                  {/* Chat-Bubble Testimonial Card */}
                  <div className="p-7 sm:p-8 mb-6 w-full rounded-3xl rounded-br-none bg-white dark:bg-[#111a33]/60 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 text-slate-800 dark:text-slate-200 shadow-md hover:border-emerald-500/40 hover:shadow-xl transition-all duration-300 min-h-[160px] flex items-center justify-center text-center">
                    <p className="leading-relaxed font-medium text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                      "{item.content}"
                    </p>
                  </div>
                  
                  {/* Reviewer Profile: Circular Avatar with Initials & Emerald Ring Border */}
                  <div className="text-center flex flex-col items-center">
                    <div className="w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/80 text-emerald-900 dark:text-emerald-300 border-2 border-emerald-500 flex items-center justify-center font-black text-base shadow-sm mb-3">
                      {initials}
                    </div>

                    <h5 className="font-extrabold text-slate-900 dark:text-white text-base tracking-tight">
                      {item.name}
                    </h5>

                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5 font-medium">
                      {item.role || item.company || "Tenant in Addis Ababa"}
                    </p>

                    {/* 5 Stars Rating Display */}
                    <div className="flex justify-center text-amber-400 gap-1 mt-2">
                      {[...Array(item.rating || 5)].map((_, starIdx) => (
                        <Star key={starIdx} size={15} fill="currentColor" />
                      ))}
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}