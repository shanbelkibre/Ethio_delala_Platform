import { CreateSaleRequestInput } from './sale.types';

export function validateSaleRequestInput(input: CreateSaleRequestInput): {
  valid: boolean;
  errors: Record<string, string>;
} {
  const errors: Record<string, string> = {};
  if (input.offeredPrice !== undefined && input.offeredPrice <= 0) {
    errors.offeredPrice = 'Offered price must be greater than 0';
  }
  return {
    valid: Object.keys(errors).length === 0,
    errors,
  };
}
