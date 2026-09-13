import { LoginInput, RegisterInput } from './auth.types';

export function validateLoginInput(input: LoginInput): { valid: boolean; errors: Partial<Record<keyof LoginInput, string>> } {
  const errors: Partial<Record<keyof LoginInput, string>> = {};
  if (!input.emailOrPhone?.trim()) {
    errors.emailOrPhone = 'Email or phone number is required';
  }
  if (!input.password) {
    errors.password = 'Password is required';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}

export function validateRegisterInput(input: RegisterInput): { valid: boolean; errors: Partial<Record<keyof RegisterInput, string>> } {
  const errors: Partial<Record<keyof RegisterInput, string>> = {};
  if (!input.name?.trim()) {
    errors.name = 'Full name is required';
  }
  if (!input.email?.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
    errors.email = 'Valid email is required';
  }
  if (!input.phone?.trim()) {
    errors.phone = 'Phone number is required';
  }
  if (!input.password || input.password.length < 6) {
    errors.password = 'Password must be at least 6 characters';
  }
  if (!input.roles || input.roles.length === 0) {
    errors.roles = 'At least one role must be selected';
  }
  return { valid: Object.keys(errors).length === 0, errors };
}
