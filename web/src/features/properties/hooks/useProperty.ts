'use client';

import { useState, useEffect, useCallback } from 'react';
import { propertyService } from '../property.service';
import { Property } from '../property.types';

export function useProperty(id: string | undefined) {
  const [property, setProperty] = useState<Property | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchProperty = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    setError(null);
    try {
      const res = await propertyService.getPropertyById(id);
      if (res.success && res.data) {
        setProperty(res.data.property);
      } else {
        setProperty(null);
      }
    } catch (err: unknown) {
      const errorObj = err as { error?: { message?: string } };
      setError(errorObj?.error?.message || 'Failed to fetch property details');
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [id]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
  };
}
