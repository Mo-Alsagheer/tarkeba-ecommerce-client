"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/lib/hooks";
import { selectIsAuthenticated } from "@/features/auth/authSlice";

interface ProtectedRouteProps {
  children: React.ReactNode;
  redirectTo?: string;
  loadingComponent?: React.ReactNode;
}

export function ProtectedRoute({
  children,
  redirectTo = "/login",
  loadingComponent,
}: ProtectedRouteProps) {
  const router = useRouter();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);

  useEffect(() => {
    if (!isAuthenticated) {
      router.push(redirectTo);
    }
  }, [isAuthenticated, router, redirectTo]);

  // Show loading state while checking authentication
  if (!isAuthenticated) {
    if (loadingComponent) {
      return <>{loadingComponent}</>;
    }

    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <p className="text-lg font-semibold">جاري التحقق من الصلاحيات...</p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
