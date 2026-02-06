import { CartState } from '@/features/cart/cartSlice';

const STORAGE_KEY = 'tarkeba_cart';

export const getStoredCart = (): CartState | null => {
  if (typeof window === 'undefined') return null;
  try {
    const item = window.localStorage.getItem(STORAGE_KEY);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
};

export const setStoredCart = (cart: CartState | null) => {
  if (typeof window === 'undefined') return;
  try {
    if (cart) {
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(cart));
    } else {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  } catch {
    // Ignore write errors
  }
};
