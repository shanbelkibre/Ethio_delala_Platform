import { defaultCmsConfig } from '@/lib/cms';

export interface CmsTheme {
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  heroGradientFrom: string;
  heroGradientTo: string;
  navbarBg: string;
  footerBg: string;
  [key: string]: string;
}

export interface CmsMember {
  id: string;
  name: string;
  role: string;
  dept?: string;
  bio?: string;
  photo?: string;
  linkedin?: string;
}

export interface CmsPlatformHighlight {
  category: string;
  image?: string;
  name: string;
  desc: string;
}

export interface CmsPartnerCompany {
  id: string;
  name: string;
  logo?: string;
  website?: string;
}

export interface CmsTestimonial {
  id: string;
  name: string;
  role?: string;
  company?: string;
  image?: string;
  content: string;
  rating?: number;
}

export interface CmsHero {
  badge?: string;
  title?: string;
  subtitle?: string;
  primaryButtonText?: string;
  primaryButtonLink?: string;
  secondaryButtonText?: string;
  secondaryButtonLink?: string;
  backgroundType?: string;
  backgroundColor?: string;
  backgroundImage?: string;
  backgroundVideo?: string;
}

export type CmsConfig = {
  cms_navbar?: typeof defaultCmsConfig.cms_navbar;
  cms_hero?: CmsHero;
  cms_features?: typeof defaultCmsConfig.cms_features;
  cms_counters?: typeof defaultCmsConfig.cms_counters;
  cms_cta?: typeof defaultCmsConfig.cms_cta;
  cms_about?: typeof defaultCmsConfig.cms_about;
  cms_how_it_works?: typeof defaultCmsConfig.cms_how_it_works;
  cms_app_section?: typeof defaultCmsConfig.cms_app_section;
  cms_vendor_cta?: typeof defaultCmsConfig.cms_vendor_cta;
  cms_footer?: typeof defaultCmsConfig.cms_footer;
  cms_theme?: CmsTheme;
  cms_theme_colors?: CmsTheme;
  cms_meet_the_minds?: CmsMember[];
  cms_platform_highlights?: CmsPlatformHighlight[];
  cms_partner_companies?: CmsPartnerCompany[];
  cms_testimonials?: CmsTestimonial[];
  [key: string]: unknown;
};



