"use client";

import { useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import {
  useGoogleLoginMutation,
  useLazyGetProfileQuery,
  useRefreshTokenMutation,
} from "@/features/api/authApi";
import { useAppDispatch } from "@/lib/hooks";
import { setCredentials, updateAccessToken } from "@/features/auth/authSlice";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { createSession } from "@/app/actions/auth";

function GoogleCallbackContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const [googleLogin] = useGoogleLoginMutation();
  const [refreshToken] = useRefreshTokenMutation();
  const [getProfile] = useLazyGetProfileQuery();

  useEffect(() => {
    const code = searchParams.get("code");
    const tokenFromUrl = searchParams.get("token");
    const error = searchParams.get("error");

    if (error) {
      router.push("/login?error=oauth_failed");
      return;
    }

    if (!code && !tokenFromUrl) {
      router.push("/login");
      return;
    }

    const handleGoogleCallback = async () => {
      try {
        const tokenFromUrl = searchParams.get("token");

        if (tokenFromUrl) {
          // If we already have the token (redirected from backend)
          dispatch(updateAccessToken(tokenFromUrl));
          await createSession(tokenFromUrl);
          const user = await getProfile().unwrap();
          dispatch(setCredentials({ user, accessToken: tokenFromUrl }));

          if (user?.roles?.includes("admin")) {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
          return;
        }

        // Fallback to code exchange if no token (legacy/alternative flow)
        if (code) {
          const result = await googleLogin({ code }).unwrap();
          let user = result?.user;

          if (result?.accessToken && result?.user) {
            await createSession(result.accessToken);
          } else {
            const refreshed = await refreshToken().unwrap();
            const token = refreshed?.accessToken;
            if (!token) {
              router.push("/login?error=oauth_failed");
              return;
            }
            dispatch(updateAccessToken(token));
            await createSession(token
            dispatch(updateAccessToken(token));
            user = await getProfile().unwrap();
            dispatch(setCredentials({ user, accessToken: token }));
          }

          if (user?.roles?.includes("admin")) {
            router.push("/admin/dashboard");
          } else {
            router.push("/");
          }
        }
      } catch {
        router.push("/login?error=oauth_failed");
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
    <Suspense
      fallback={
        <Card className="shadow-xl">
          <CardContent className="p-12 text-center">
            <div className="animate-pulse">جاري التحميل...</div>
          </CardContent>
        </Card>
      }
    >
      <GoogleCallbackContent />
    </Suspense>
  );
}
