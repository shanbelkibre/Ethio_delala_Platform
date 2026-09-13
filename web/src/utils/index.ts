export { cn, formatCurrency, generateOrderNumber, generateBookingNumber } from '../lib/utils';

export function formatDate(dateString: string | Date): string {
  if (!dateString) return '';
  const date = typeof dateString === 'string' ? new Date(dateString) : dateString;
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }).format(date);
}

export function truncateText(text: string, maxLength: number): string {
  if (!text || text.length <= maxLength) return text || '';
  return text.slice(0, maxLength) + '...';
}

export function getStatusBadgeVariant(status: string): 'success' | 'warning' | 'danger' | 'info' | 'default' {
  switch (status?.toUpperCase()) {
    case 'APPROVED':
    case 'PUBLISHED':
    case 'COMPLETED':
    case 'ACTIVE':
    case 'ACCEPTED':
      return 'success';
    case 'PENDING':
    case 'PENDING_REVIEW':
    case 'IN_REVIEW':
      return 'warning';
    case 'REJECTED':
    case 'CANCELLED':
    case 'SUSPENDED':
      return 'danger';
    case 'SOLD':
    case 'RENTED':
      return 'info';
    default:
      return 'default';
  }
}
