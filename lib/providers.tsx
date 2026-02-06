'use client';

import { useRef } from 'react';
import { Provider } from 'react-redux';
import { Toaster } from '@/components/ui/sonner';
import { makeStore, AppStore } from './store';
import { CartInitializer } from '@/components/Cart/CartInitializer';

export function ReduxProvider({ children }: { children: React.ReactNode }) {
  const storeRef = useRef<AppStore | null>(null);
  
  if (!storeRef.current) {
    storeRef.current = makeStore();
  }

  return (
    <Provider store={storeRef.current!}>
      <CartInitializer />
      {children}
      <Toaster position="top-center" richColors />
    </Provider>
  );
}
