export interface CmsNavbar {
  siteName: string;
  siteTagline: string;
  logoLetter: string;
  logoColor: string;
}

export interface CmsHero {
  badge: string;
  title: string;
  subtitle: string;
  primaryButtonText: string;
  primaryButtonLink: string;
  secondaryButtonText: string;
  secondaryButtonLink: string;
  backgroundType: string;
  backgroundColor: string;
  backgroundImage: string;
  backgroundVideo: string;
}

export interface CmsFeature {
  icon: string;
  image: string;
  title: string;
  desc: string;
}

export interface CmsConfig {
  cms_navbar?: CmsNavbar;
  cms_hero?: CmsHero;
  cms_features?: CmsFeature[];
  cms_footer?: Record<string, any>;
  [key: string]: any;
}
