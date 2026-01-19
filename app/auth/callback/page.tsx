'use client';

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useAppDispatch } from '@/lib/hooks';
import { updateAccessToken, setCredentials } from '@/features/auth/authSlice';
import { authApi } from '@/features/api/authApi';
import { Loader2 } from 'lucide-react';
import type { User } from '@/features/api/authApi';
import { MESSAGES } from '@/constants';

export default function AuthCallbackPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      // Set token to enable authenticated requests
      dispatch(updateAccessToken(token));

      // Fetch user profile
      dispatch(authApi.endpoints.getProfile.initiate(undefined))
        .unwrap()
        .then((user: User) => {
           dispatch(setCredentials({ user, accessToken: token }));
           
           // Redirect admin users to dashboard
           if (user.roles?.includes('admin')) {
             router.push('/admin/dashboard');
           } else {
             router.push('/');
           }
        })
        .catch((err) => {
          console.error('Profile fetch error', err);
          router.push('/login?error=auth_failed');
        });
    } else {
      router.push('/login');
    }
  }, [token, dispatch, router]);

  return (
    <div className="flex h-screen w-full items-center justify-center">
      <div className="flex flex-col items-center gap-4">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-muted-foreground">{MESSAGES.INFO.LOGGING_IN}</p>
      </div>
    </div>
  );
}
