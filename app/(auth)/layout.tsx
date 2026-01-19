'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/');
    }
  }, [isAuthenticated, router]);

  if (isAuthenticated) {
    return null; 
  }

  return (
    <div className="w-full h-screen grid lg:grid-cols-[4fr_5fr]">
      {/* Right Side - Image (First in RTL) */}
      <div className="flex items-center justify-center p-8 bg-background">
        <div className="w-full max-w-md scale-110">
          {children}
        </div>
      </div>

      {/* Left Side - Form */}
      <div className="hidden lg:block relative h-full w-full bg-muted">
        <Image
          src="/glass-bottle.png"
          alt="Authentication Background"
          fill
            className="object-cover"      
          priority
        />
        <div className="absolute inset-0 bg-black/10" />
      </div>
      
    </div>
  );
}
