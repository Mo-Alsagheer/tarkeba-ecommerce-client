'use client';

import { useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useGoogleLoginMutation, useLazyGetProfileQuery, useRefreshTokenMutation } from '@/features/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials, updateAccessToken } from '@/features/auth/authSlice';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

function GoogleCallbackContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [googleLogin] = useGoogleLoginMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    const code = searchParams.get('code');
    const error = searchParams.get('error');

    if (error) {
      router.push('/login?error=oauth_failed');
      return;
    }

    if (!code) {
      router.push('/login');
      return;
    }

    const handleGoogleCallback = async () => {
      try {
        const result = await googleLogin({ code }).unwrap();
        let user = result?.user;

        // Some backends set cookies but don't always return token/user consistently.
        // Prefer direct credentials when present; otherwise fall back to refresh + profile.
        if (result?.accessToken && result?.user) {
          dispatch(setCredentials(result));
        } else {
          const refreshed = await refreshToken().unwrap();
          const token = refreshed?.accessToken;
          if (!token) {
            router.push('/login?error=oauth_failed');
            return;
          }
          dispatch(updateAccessToken(token));
          user = await getProfile().unwrap();
          dispatch(setCredentials({ user, accessToken: token }));
        }

        // Redirect admin users to dashboard
        if (user?.roles?.includes('admin')) {
          router.push('/admin/dashboard');
        } else {
          router.push('/');
        }
      } catch {
        router.push('/login?error=oauth_failed');
      }
    };

    handleGoogleCallback();
  }, [searchParams, router, dispatch, googleLogin]);

  return (
    <Card className="shadow-xl">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl font-bold">جاري المصادقة</CardTitle>
        <CardDescription>
          يرجى الانتظار بينما نقوم بتسجيل دخولك...
        </CardDescription>
      </CardHeader>
      <CardContent className="flex justify-center p-8">
        <div className="h-12 w-12 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </CardContent>
    </Card>
  );
}

export default function GoogleCallbackPage() {
  return (
    <Suspense fallback={
      <Card className="shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="animate-pulse">جاري التحميل...</div>
        </CardContent>
      </Card>
    }>
      <GoogleCallbackContent />
    </Suspense>
  );
}
