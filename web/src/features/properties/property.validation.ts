import { CreatePropertyInput } from './property.types';

export function validatePropertyInput(input: Partial<CreatePropertyInput>): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};

  if (!input.title || input.title.trim().length < 3) {
    errors.title = 'Title must be at least 3 characters';
  }
  if (!input.description || input.description.trim().length < 10) {
    errors.description = 'Description must be at least 10 characters';
  }
  if (!input.price || Number(input.price) <= 0) {
    errors.price = 'Price must be greater than 0';
  }
  if (!input.propertyType) {
    errors.propertyType = 'Property type is required';
  }
  if (!input.listingType) {
    errors.listingType = 'Listing type (RENT or SALE) is required';
  }
  if (!input.city || input.city.trim().length === 0) {
    errors.city = 'City is required';
  }

  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
