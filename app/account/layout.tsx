'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { User, Package, MapPin, Star, LogOut } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { useLogoutMutation } from '@/features/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { logout } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated } from '@/features/auth/authSlice';

const sidebarItems = [
  {
    title: 'الملف الشخصي',
    href: '/account/profile',
    icon: User,
  },
  {
    title: 'طلباتي',
    href: '/account/orders',
    icon: Package,
  },
  {
    title: 'عناويني',
    href: '/account/addresses',
    icon: MapPin,
  },
  {
    title: 'تقييماتي',
    href: '/account/reviews',
    icon: Star,
  },
];

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const [logoutMutation] = useLogoutMutation();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push('/login');
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return null;
  }

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      router.push('/');
    } catch {
      // Handle error
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid md:grid-cols-4 gap-8">
        {/* Sidebar */}
        <div className="space-y-4">
          <div className="border rounded-lg p-2 space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              
              return (
                <Link key={item.href} href={item.href}>
                  <Button
                    variant={isActive ? 'secondary' : 'ghost'}
                    className={cn(
                      'w-full justify-start',
                      isActive && 'bg-secondary'
                    )}
                  >
                    <Icon className="h-4 w-4 ms-2" />
                    {item.title}
                  </Button>
                </Link>
              );
            })}
             <Button
                variant="ghost"
                className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={handleLogout}
              >
                <LogOut className="h-4 w-4 ms-2" />
                تسجيل الخروج
              </Button>
          </div>
        </div>

        {/* Content */}
        <div className="md:col-span-3">
          {children}
        </div>
      </div>
    </div>
  );
}
