'use client';

import { useEffect, useState, useRef } from 'react';
import { useAppDispatch } from '@/lib/hooks';
import { useRefreshTokenMutation, useLazyGetProfileQuery } from '@/features/api/authApi';
import { setCredentials, updateAccessToken } from '@/features/auth/authSlice';
import { getStoredAccessToken, clearStoredAccessToken } from '@/lib/authStorage';
import { DESCRIPTIONS } from '@/constants';
import { getSession, deleteSession } from '@/app/actions/auth';

export function AuthInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [refreshToken] = useRefreshTokenMutation();
  const [getProfile] = useLazyGetProfileQuery();
  const [isInitialized, setIsInitialized] = useState(false);
  const initRef = useRef(false);

  useEffect(() => {
    // Prevent double initialization in React strict mode
    if (initRef.current) {
      console.log('AuthInitializer: Already initialized, skipping');
      return;
    }
    
    initRef.current = true;
    let mounted = true;

    const initializeAuth = async () => {
      
      // 1. Try to get token from our HttpOnly cookie action
      let cookieToken;
      try {
        cookieToken = await getSession();
      } catch (err) {
        // Ignore read error
      }
      
      if (cookieToken && mounted) {
        console.log('AuthInitializer: Found session cookie');
        try {
          dispatch(updateAccessToken(cookieToken));
          const user = await getProfile().unwrap();
          
          if (mounted) {
              dispatch(setCredentials({ user, accessToken: cookieToken }));
              setIsInitialized(true);
              return; // Success, we are done
          }
        } catch (err) {
          console.log('AuthInitializer: Session cookie invalid (401), clearing cookie...');
          await deleteSession();
          // Fall through to next steps (refresh token or local storage)
        }
      }

      try {
        // 2. Try to get a new access token using the backend HttpOnly cookie (refresh token)
        console.log('AuthInitializer: Calling refresh token...');
        const result = await refreshToken().unwrap();
        console.log('AuthInitializer: Refresh token result:', result);
        
        if (result?.accessToken && mounted) {
          dispatch(updateAccessToken(result.accessToken));
          
          // Get user profile
          console.log('AuthInitializer: Getting user profile...');
          const user = await getProfile().unwrap();
          console.log('AuthInitializer: User profile received:', user);
          
          if (mounted) {
            dispatch(setCredentials({ user, accessToken: result.accessToken }));
          }
        }
      } catch (error) {
        console.log('AuthInitializer: Auth initialization failed:', error);
        // No session or expired - attempt localStorage token fallback (SSO may not set refresh cookie reliably)
        try {
          const storedToken = getStoredAccessToken();
          if (storedToken && mounted) {
            console.log('AuthInitializer: Found stored token, attempting profile fetch...');
            dispatch(updateAccessToken(storedToken));
            const user = await getProfile().unwrap();
            if (mounted) {
              dispatch(setCredentials({ user, accessToken: storedToken }));
            }
          }
        } catch (fallbackError) {
          console.log('AuthInitializer: Stored token fallback failed:', fallbackError);
          clearStoredAccessToken();
        }
      } finally {
        console.log('AuthInitializer: Initialization complete, setting isInitialized to true');
        if (mounted) {
          setIsInitialized(true);
        }
      }
    };

    initializeAuth();

    return () => {
      console.log('AuthInitializer: Component unmounting');
      mounted = false;
    };
  }, []); // Empty dependency array

  console.log('AuthInitializer: About to render, isInitialized:', isInitialized);

  // Prevent flicker by waiting for auth check
  if (!isInitialized) {
    console.log('AuthInitializer: Not initialized yet, showing full screen loading');
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-background">
        <div className="text-center">
          <p className="text-lg font-semibold mb-2">{DESCRIPTIONS.AUTH.LOADING_DATA}</p>
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto"></div>
        </div>
      </div>
    );
  }

  // Only render children after we are sure about the auth state
  return <>{children}</>;
}
