'use client';

import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../property.service';
import { Property, PropertyFilters } from '../property.types';

export function useProperties(initialFilters: PropertyFilters = { page: 1, limit: 12 }) {
  const [properties, setProperties] = useState<Property[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [filters, setFilters] = useState<PropertyFilters>(initialFilters);

  const fetchProperties = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await propertyService.getPublicProperties(filters);
      if (res.success && res.data) {
        setProperties(res.data.properties || []);
        setTotal(res.data.total || 0);
      } else {
        setProperties([]);
      }
    } catch (err: unknown) {
      const errorObj = err as { error?: { message?: string } };
      setError(errorObj?.error?.message || 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [filters]);

  useEffect(() => {
    fetchProperties();
  }, [fetchProperties]);

  return {
    properties,
    total,
    loading,
    error,
    filters,
    setFilters,
    refetch: fetchProperties,
  };
}
