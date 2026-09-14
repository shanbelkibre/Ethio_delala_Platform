"use client";

import React from "react";
import { motion } from "framer-motion";
import { Star } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Testimonials({ testimonials = [] }: { testimonials?: any[] }) {
  const t = useTranslations("home.testimonials");
  const displayTestimonials = testimonials.length > 0 ? testimonials : [
    { name: "Almaz Kebede", role: "Renter - Bole", company: "Addis Ababa", content: "Ethio Delala made finding my 3-bedroom apartment completely transparent. The 3D tour was accurate and Chapa payment gave me full peace of mind.", image: "" },
    { name: "Yared Haile", role: "Property Owner", company: "Kazanchis", content: "I listed two residential flats and had vetted tenants with signed digital lease contracts in less than a week.", image: "" },
    { name: "Selamawit Tadesse", role: "Diaspora Tenant", company: "Old Airport", content: "Booking from abroad was so seamless. Verified landlord, zero broker markup, and move-in deep cleaning was done on time.", image: "" }
  ];

  return (
    <section className="py-20 bg-white">
      {/* Container with enhanced shadow and blue-tinted filter */}
      <div className="max-w-7xl mx-auto px-6 py-16 border border-slate-100 rounded-[3rem] shadow-[0_30px_60px_-12px_rgba(0,0,0,0.25)] bg-blue-50/30">
        
        {/* Header */}
        <div className="text-center mb-16">
          <h4 className="text-blue-600 font-bold uppercase tracking-widest text-sm mb-2">{t("badge")}</h4>
          <h2 className="text-4xl font-black text-slate-900">{t("title")}</h2>
        </div>

        {/* Animated Testimonial Marquee */}
        <div className="overflow-hidden w-full relative">
          {/* Edge gradients for smooth fade out */}
          <div className="absolute top-0 left-0 bottom-0 w-8 md:w-24 bg-gradient-to-r from-[#eff6ff] to-transparent z-10 pointer-events-none" />
          <div className="absolute top-0 right-0 bottom-0 w-8 md:w-24 bg-gradient-to-l from-[#eff6ff] to-transparent z-10 pointer-events-none" />
          
          <motion.div 
            animate={{ x: ["0%", "-50%"] }}
            transition={{ ease: "linear", duration: 15, repeat: Infinity }}
            className="flex w-max gap-8"
          >
            {[...displayTestimonials, ...displayTestimonials].map((item, i) => (
              <div key={i} className="flex flex-col items-center w-[320px] md:w-[400px] flex-shrink-0">
              {/* Individual Card with deep shadow */}
              <div className={`p-8 mb-6 w-full border border-slate-100 shadow-xl 
                rounded-t-3xl rounded-bl-3xl 
                ${i % 2 === 1 ? "bg-blue-600 text-white" : "bg-white text-slate-800"}`}
              >
                <p className="text-center leading-relaxed font-medium">{item.content}</p>
              </div>
              
              {/* Profile Image & Info */}
              <div className="text-center">
                <img 
                  src={item.image || `https://i.pravatar.cc/150?u=${item.name.replace(' ', '')}`} 
                  alt={item.name} 
                  className="w-16 h-16 rounded-full mx-auto mb-4 border-4 border-white shadow-lg object-cover" 
                />
                <h5 className="font-bold text-slate-900">{item.name}</h5>
                <p className="text-sm text-slate-500 mb-2">{item.role}</p>
                <div className="flex justify-center text-orange-400">
                  {[...Array(5)].map((_, index) => <Star key={index} size={14} fill="currentColor" />)}
                </div>
              </div>
            </div>
          ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}