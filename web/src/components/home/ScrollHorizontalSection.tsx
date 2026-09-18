"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  Bed,
  Bath,
  Maximize2,
  ArrowRight,
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
  CreditCard,
  Gem,
  BedDouble,
  Sofa,
  Castle,
  DollarSign,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { SearchableSelect, SelectOption } from "@/components/ui/SearchableSelect";
import { formatCurrency } from "@/lib/utils";
import { useTranslations } from "next-intl";
import { Link, useRouter } from "@/i18n/routing";

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
    router.push(`/browse-houses?${params.toString()}`);
  };

  return (
    <section className="bg-white dark:bg-[#0b1329] dark-grid-bg py-20 md:py-24 text-slate-900 dark:text-white border-t border-slate-200 dark:border-slate-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div className="space-y-3 max-w-2xl">
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
                className="border-slate-300 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-900 font-bold px-5 py-2.5 rounded-xl text-xs sm:text-sm flex items-center gap-2 cursor-pointer"
              >
                <span>{t("exploreAllHomes")}</span>
                <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>

        {/* 4-Item Responsive Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {featuredHousesList.map((house, idx) => (
            <motion.div
              key={house.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.3, delay: idx * 0.1 }}
              className="bg-white dark:bg-[#111a33]/60 backdrop-blur-xl border border-slate-200/90 dark:border-slate-800/80 rounded-3xl overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 transition-all duration-300 flex flex-col justify-between group hover:-translate-y-1"
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
                  <Button className="w-full bg-slate-900 dark:bg-slate-800 hover:bg-emerald-600 dark:hover:bg-emerald-600 text-white font-bold py-2.5 rounded-xl text-xs flex items-center justify-center gap-2 shadow-sm transition-colors cursor-pointer">
                    <span>{t("viewDetails")}</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>

        {/* INTEGRATED MODERN SEARCH TOOLBAR WITH CENTRAL SEARCHABLE SELECT */}
        <div className="mt-12 space-y-5 pt-6 border-t border-slate-200/80 dark:border-slate-800/80">
          <form
            onSubmit={handleSearch}
            className="w-full bg-white/95 dark:bg-[#111a33]/80 border border-slate-200/90 dark:border-slate-800/80 rounded-2xl sm:rounded-3xl p-3 sm:p-4 shadow-sm dark:shadow-none backdrop-blur-xl transition-all"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 items-center">
              {/* Location Select */}
              <SearchableSelect
                options={locationOptions}
                value={searchLocation}
                onChange={(val) => setSearchLocation(val)}
                placeholder={tHome("wherePlaceholder")}
                icon={<MapPin className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                searchPlaceholder="Filter neighborhood..."
                searchThreshold={5}
              />

              {/* Price Filter Select */}
              <SearchableSelect
                options={priceOptions}
                value={searchPrice}
                onChange={(val) => setSearchPrice(val)}
                placeholder={tHome("anyPrice")}
                icon={<DollarSign className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                searchPlaceholder="Filter price..."
                searchThreshold={5}
              />

              {/* Rooms Select */}
              <SearchableSelect
                options={roomOptions}
                value={searchRooms}
                onChange={(val) => setSearchRooms(val)}
                placeholder={tHome("rooms")}
                icon={<Bed className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />}
                searchPlaceholder="Filter rooms..."
                searchThreshold={5}
              />

              {/* Search Action Button */}
              <Button
                type="submit"
                size="lg"
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white font-bold px-6 py-4 rounded-xl transition-all shadow-md shadow-emerald-600/25 hover:shadow-emerald-600/35 hover:-translate-y-0.5 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
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

