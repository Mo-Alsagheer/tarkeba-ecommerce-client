'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  ShoppingBag, 
  Package, 
  FolderTree, 
  Users,
  LogOut,
  ArrowLeft
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAppDispatch } from '@/lib/hooks';
import { logout } from '@/features/auth/authSlice';
import { useRouter } from 'next/navigation';
import { NAVIGATION, BUTTONS } from '@/constants';

const navigation = [
  { name: NAVIGATION.ADMIN.DASHBOARD, href: '/admin/dashboard', icon: LayoutDashboard },
  { name: NAVIGATION.ADMIN.ORDERS, href: '/admin/orders', icon: ShoppingBag },
  { name: NAVIGATION.ADMIN.PRODUCTS, href: '/admin/products', icon: Package },
  { name: NAVIGATION.ADMIN.CATEGORIES, href: '/admin/categories', icon: FolderTree },
  { name: NAVIGATION.ADMIN.USERS, href: '/admin/users', icon: Users },
];

export default function AdminSidebar() {
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const router = useRouter();

  const handleLogout = () => {
    dispatch(logout());
    router.push('/');
  };

  return (
    <div className="flex flex-col h-full bg-white border-l border-gray-200">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-2xl font-bold text-gray-900">{NAVIGATION.ADMIN.ADMIN_PANEL}</h1>
        <p className="text-sm text-gray-500 mt-1">{NAVIGATION.ADMIN.STORE_MANAGEMENT}</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || pathname?.startsWith(item.href + '/');
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
                isActive
                  ? 'bg-primary text-primary-foreground'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <item.icon className="h-5 w-5" />
              {item.name}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200 space-y-2">
        <Link href="/">
          <Button variant="outline" className="w-full justify-start gap-3">
            <ArrowLeft className="h-5 w-5" />
            {BUTTONS.BACK_TO_STORE}
          </Button>
        </Link>
        <Button
          variant="destructive"
          className="w-full justify-start gap-3"
          onClick={handleLogout}
        >
          <LogOut className="h-5 w-5" />
          {BUTTONS.SIGN_OUT}
        </Button>
      </div>
    </div>
  );
}
