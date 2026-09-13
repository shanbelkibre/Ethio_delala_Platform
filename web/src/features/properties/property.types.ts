export type PropertyStatus =
  | 'DRAFT'
  | 'PENDING_REVIEW'
  | 'APPROVED'
  | 'PUBLISHED'
  | 'REJECTED'
  | 'SUSPENDED'
  | 'SOLD'
  | 'RENTED'
  | 'ARCHIVED';

export type ListingType = 'RENT' | 'SALE';
export type PropertyType =
  | 'APARTMENT'
  | 'HOUSE'
  | 'VILLA'
  | 'STUDIO'
  | 'ROOM'
  | 'COMMERCIAL'
  | 'LAND';

export interface Property {
  id: string;
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  city: string;
  subCity?: string;
  areaName?: string;
  address?: string;
  addressDetails?: string;
  status: PropertyStatus;
  ownerId: string;
  createdAt: string;
  images?: Array<{ id: string; url: string; isPrimary?: boolean }>;
}

export interface PropertyFilters {
  page?: number;
  limit?: number;
  listingType?: 'RENT' | 'SALE';
  city?: string;
  subCity?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  propertyType?: string;
  search?: string;
}

export interface CreatePropertyInput {
  title: string;
  description: string;
  propertyType: PropertyType;
  listingType: ListingType;
  price: number;
  bedrooms?: number;
  bathrooms?: number;
  area?: number;
  city: string;
  subCity?: string;
  address?: string;
  addressDetails?: string;
  images?: string[];
}
