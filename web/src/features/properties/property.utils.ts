export function formatPropertyPrice(price: number, listingType?: string): string {
  const formatted = price?.toLocaleString() || '0';
  if (listingType === 'RENT') {
    return `ETB ${formatted} / mo`;
  }
  return `ETB ${formatted}`;
}

export function getPropertyMapUrl(property: { city?: string; areaName?: string; addressDetails?: string }): string {
  if (property.addressDetails?.startsWith('http')) {
    return property.addressDetails;
  }
  const query = encodeURIComponent(`${property.city || 'Addis Ababa'} ${property.areaName || ''}`.trim());
  return `https://www.google.com/maps/search/?api=1&query=${query}`;
}
