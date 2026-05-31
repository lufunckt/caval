export interface Testimonial {
  id: string;
  name: string;
  role: string;
  dogName: string;
  dogBreed: string;
  avatarUrl?: string;
  text: string;
  stars: number;
}

export interface MethodPillar {
  number: string;
  title: string;
  subtitle: string;
  description: string;
  colorClass: string;
  bgHex: string;
  textHex: string;
}

export interface ServiceItem {
  id: string;
  title: string;
  tagline: string;
  description: string;
  features: string[];
  ctaText: string;
  badge?: string;
  price?: string;
}

export interface StatItem {
  value: string;
  label: string;
}
