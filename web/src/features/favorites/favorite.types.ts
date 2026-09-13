import { Property } from '../properties/property.types';

export interface FavoriteItem {
  id: string;
  userId: string;
  propertyId: string;
  createdAt: string;
  property?: Property;
}
