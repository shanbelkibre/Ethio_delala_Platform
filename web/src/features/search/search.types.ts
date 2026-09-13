import { Property } from '../properties/property.types';

export interface SearchFilters {
  query?: string;
  city?: string;
  subCity?: string;
  listingType?: 'RENT' | 'SALE';
  propertyType?: string;
  minPrice?: number;
  maxPrice?: number;
  bedrooms?: number;
  page?: number;
  limit?: number;
}

export interface SearchResponse {
  properties: Property[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}
