import { CreateRentalRequestInput } from './rental.types';

export function validateRentalRequestInput(input: CreateRentalRequestInput): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  if (input.durationMonths !== undefined && input.durationMonths <= 0) {
    errors.durationMonths = 'Duration must be at least 1 month';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
