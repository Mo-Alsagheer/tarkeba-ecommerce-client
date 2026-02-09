'use client';

import { useState, useRef, useEffect, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useVerifyOtpMutation, useResendOtpMutation } from '@/features/api/authApi';
import { useAppDispatch } from '@/lib/hooks';
import { setCredentials } from '@/features/auth/authSlice';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { ShieldCheck } from 'lucide-react';
import { createSession } from '@/app/actions/auth';

function VerifyOtpContent() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [error, setError] = useState<string | null>(null);
  const [resendTimer, setResendTimer] = useState(60);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [resendOtp, { isLoading: isResending }] = useResendOtpMutation();

  useEffect(() => {
    if (!email) {
      router.push('/login');
      return;
    }

    const timer = setInterval(() => {
      setResendTimer((prev) => (prev > 0 ? prev - 1 : 0));
    }, 1000);

    return () => clearInterval(timer);
  }, [email, router]);

  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }

    // Auto-submit when all fields are filled
    if (newOtp.every((digit) => digit) && index === 5) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').slice(0, 6);
    if (!/^\d+$/.test(pastedData)) return;

    const newOtp = pastedData.split('');
    while (newOtp.length < 6) newOtp.push('');
    setOtp(newOtp);

    if (newOtp.every((digit) => digit)) {
      handleVerify(newOtp.join(''));
    }
  };

  const handleVerify = async (otpCode: string) => {
    try {
      setError(null);
      const result = await verifyOtp({ email, otp: otpCode }).unwrap();
      dispatch(setCredentials(result));
      await createSession(result.accessToken);
      
      // Redirect admin users to dashboard
      if (result.user.roles?.includes('admin')) {
        router.push('/admin/dashboard');
      } else {
        router.push('/');
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'رمز التحقق غير صحيح. يرجى المحاولة مرة أخرى.');
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  const handleResend = async () => {
    if (resendTimer > 0) return;
    
    try {
      setError(null);
      await resendOtp({ email }).unwrap();
      setResendTimer(60);
      setOtp(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    } catch (err) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'فشل إعادة إرسال الرمز. يرجى المحاولة مرة أخرى.');
    }
  };

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
          <ShieldCheck className="h-8 w-8 text-primary" />
        </div>
        <CardTitle className="text-2xl font-bold">تحقق من بريدك الإلكتروني</CardTitle>
        <CardDescription className="text-base">
          أدخل رمز التحقق المكون من 6 أرقام المرسل إلى
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent className="space-y-6">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="flex gap-2 justify-center" dir="ltr">
          {otp.map((digit, index) => (
            <Input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={index === 0 ? handlePaste : undefined}
              className="w-12 h-12 text-center text-lg font-bold"
              disabled={isVerifying}
              autoFocus={index === 0}
            />
          ))}
        </div>

        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            لم تستلم الرمز؟
          </p>
          <Button
            type="button"
            variant="link"
            onClick={handleResend}
            disabled={resendTimer > 0 || isResending}
            className="text-primary"
          >
            {isResending
              ? 'جاري الإرسال...'
              : resendTimer > 0
              ? `إعادة الإرسال (${resendTimer}ث)`
              : 'إعادة إرسال الرمز'}
          </Button>
        </div>

        <Button
          type="button"
          variant="outline"
          className="w-full"
          onClick={() => router.push('/login')}
          disabled={isVerifying}
        >
          العودة لتسجيل الدخول
        </Button>
      </CardContent>
    </Card>
  );
}

export default function VerifyOtpPage() {
  return (
    <Suspense fallback={
      <Card className="shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="animate-pulse">جاري التحميل...</div>
        </CardContent>
      </Card>
    }>
      <VerifyOtpContent />
    </Suspense>
  );
}
