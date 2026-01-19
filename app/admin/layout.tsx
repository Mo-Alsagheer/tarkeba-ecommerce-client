'use client';

import { useAppSelector } from '@/lib/hooks';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { AdminSidebarNav } from '@/components/admin/AdminSidebarNav';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useAppSelector((state) => state.auth.user);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const authState = useAppSelector((state) => state.auth);
  const router = useRouter();

  // Debug logs
  console.log('Admin Layout rendered', { 
    isAuthenticated, 
    roles: user?.roles,
    tokenPresent: !!authState.accessToken,
    fullUser: user
  });

  useEffect(() => {
    // Wait for the next tick to ensure state is populated
    const timer = setTimeout(() => {
      // If still not authenticated after a delay, redirect to login
      if (!isAuthenticated || !user) {
        console.log('AdminLayout: Not authenticated, redirecting to login. State:', authState);
        router.push('/login');
        return;
      }

      // If authenticated but not admin, redirect to home
      if (!user.roles?.includes('admin')) {
        console.log('AdminLayout: Not admin, redirecting to home. Roles:', user.roles);
        router.push('/');
      }
    }, 1000); // Increased delay to 1s to be absolutely sure

    return () => clearTimeout(timer);
  }, [user, isAuthenticated, router, authState]);

  // If we don't have user data yet, show loading instead of redirecting immediately
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">جاري التحقق من الصلاحيات...</p>
          <div className="text-sm text-muted-foreground text-left rtl:text-right" dir="ltr">
             <p>Checking session...</p>
             <p>Auth: {String(isAuthenticated)}</p>
             <p>User: {user ? (user.name || 'Found') : 'Missing'}</p>
          </div>
        </div>
      </div>
    );
  }

  // If authenticated but not admin (and effect hasn't redirected yet)
  if (user && !user.roles?.includes('admin')) {
      return (
      <div className="min-h-screen flex items-center justify-center">
        <p>غير مصرح لك بالدخول لهذه الصفحة</p>
      </div>
    );
  }

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50">
      {/* Sidebar */}
      <aside className="w-64 shrink-0 border-r bg-background">
        <AdminSidebarNav />
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-y-auto">
        <div className="container mx-auto px-6 py-8">
          {children}
        </div>
      </main>
    </div>
  );
}
