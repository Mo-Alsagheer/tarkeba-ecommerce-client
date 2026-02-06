'use client';

import { useEffect, useRef } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { setCart } from '@/features/cart/cartSlice';
import { getStoredCart } from '@/lib/cartStorage';

export function CartInitializer() {
  const dispatch = useAppDispatch();
  const initialized = useRef(false);

  useEffect(() => {
    if (!initialized.current) {
      const storedCart = getStoredCart();
      if (storedCart) {
        dispatch(setCart(storedCart));
      }
      initialized.current = true;
    }
  }, [dispatch]);

  return null;
}
