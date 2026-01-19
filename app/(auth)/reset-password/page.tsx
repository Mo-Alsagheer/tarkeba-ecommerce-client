'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useForgotPasswordMutation, useResetPasswordMutation } from '@/features/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Mail, Lock, KeyRound } from 'lucide-react';
import { MESSAGES, LABELS, BUTTONS, TITLES } from '@/constants';

const emailSchema = z.object({
  email: z.string().email(MESSAGES.ERROR.INVALID_EMAIL),
});

const resetSchema = z.object({
  otp: z.string().length(6, MESSAGES.ERROR.OTP_LENGTH),
  newPassword: z.string().min(6, MESSAGES.ERROR.PASSWORD_MIN_LENGTH),
  confirmPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmPassword, {
  message: MESSAGES.ERROR.PASSWORD_MISMATCH,
  path: ['confirmPassword'],
});

type EmailFormValues = z.infer<typeof emailSchema>;
type ResetFormValues = z.infer<typeof resetSchema>;

function ResetPasswordContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const emailFromUrl = searchParams.get('email');
  
  const [step, setStep] = useState<'email' | 'reset'>(emailFromUrl ? 'reset' : 'email');
  const [email, setEmail] = useState(emailFromUrl || '');
  const [error, setError] = useState<string | null>(null);
  
  const [forgotPassword, { isLoading: isSendingOtp }] = useForgotPasswordMutation();
  const [resetPassword, { isLoading: isResetting }] = useResetPasswordMutation();

  const emailForm = useForm<EmailFormValues>({
    resolver: zodResolver(emailSchema),
    defaultValues: { email: emailFromUrl || '' },
  });

  const resetForm = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
  });

  const onEmailSubmit = async (data: EmailFormValues) => {
    try {
      setError(null);
      await forgotPassword(data).unwrap();
      setEmail(data.email);
      setStep('reset');
    } catch (err) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || MESSAGES.ERROR.OTP_SEND_FAILED);
    }
  };

  const onResetSubmit = async (data: ResetFormValues) => {
    try {
      setError(null);
      await resetPassword({
        email,
        otp: data.otp,
        newPassword: data.newPassword,
      }).unwrap();
      
      router.push('/login?reset=success');
    } catch (err) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || MESSAGES.ERROR.PASSWORD_RESET_FAILED);
    }
  };

  if (step === 'email') {
    return (
      <Card className="shadow-xl">
        <CardHeader className="space-y-2 text-center">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-primary/10 flex items-center justify-center">
            <KeyRound className="h-8 w-8 text-primary" />
          </div>
          <CardTitle className="text-2xl font-bold">{TITLES.PUBLIC.FORGOT_PASSWORD}</CardTitle>
          <CardDescription>
            {MESSAGES.INFO.FORGOT_PASSWORD_DESC}
          </CardDescription>
        </CardHeader>

        <CardContent>
          <form onSubmit={emailForm.handleSubmit(onEmailSubmit)} className="space-y-4">
            {error && (
              <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
                {error}
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="email">{LABELS.COMMON.EMAIL}</Label>
              <div className="relative">
                <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  id="email"
                  type="email"
                  placeholder="name@example.com"
                  className="pe-10"
                  dir="ltr"
                  {...emailForm.register('email')}
                  disabled={isSendingOtp}
                />
              </div>
              {emailForm.formState.errors.email && (
                <p className="text-xs text-destructive">
                  {emailForm.formState.errors.email.message}
                </p>
              )}
            </div>

            <Button type="submit" className="w-full" disabled={isSendingOtp}>
              {isSendingOtp ? BUTTONS.SENDING : BUTTONS.SEND_OTP}
            </Button>

            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() => router.push('/login')}
            >
              {BUTTONS.BACK_TO_LOGIN}
            </Button>
          </form>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-xl">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl font-bold">{TITLES.PUBLIC.RESET_PASSWORD}</CardTitle>
        <CardDescription>
          {MESSAGES.INFO.RESET_PASSWORD_DESC}
          <br />
          <span className="font-medium text-foreground">{email}</span>
        </CardDescription>
      </CardHeader>

      <CardContent>
        <form onSubmit={resetForm.handleSubmit(onResetSubmit)} className="space-y-4">
          {error && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
              {error}
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="otp">{LABELS.COMMON.OTP_CODE}</Label>
            <div className="relative">
              <KeyRound className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="otp"
                type="text"
                inputMode="numeric"
                maxLength={6}
                placeholder="123456"
                className="pe-10 text-center tracking-widest"
                dir="ltr"
                {...resetForm.register('otp')}
                disabled={isResetting}
              />
            </div>
            {resetForm.formState.errors.otp && (
              <p className="text-xs text-destructive">
                {resetForm.formState.errors.otp.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="newPassword">{LABELS.COMMON.NEW_PASSWORD}</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="newPassword"
                type="password"
                placeholder="••••••••"
                className="pe-10"
                dir="rtl"
                {...resetForm.register('newPassword')}
                disabled={isResetting}
              />
            </div>
            {resetForm.formState.errors.newPassword && (
              <p className="text-xs text-destructive">
                {resetForm.formState.errors.newPassword.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword">{LABELS.COMMON.CONFIRM_PASSWORD}</Label>
            <div className="relative">
              <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="confirmPassword"
                type="password"
                placeholder="••••••••"
                className="pe-10"
                dir="rtl"
                {...resetForm.register('confirmPassword')}
                disabled={isResetting}
              />
            </div>
            {resetForm.formState.errors.confirmPassword && (
              <p className="text-xs text-destructive">
                {resetForm.formState.errors.confirmPassword.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isResetting}>
            {isResetting ? BUTTONS.UPDATING : BUTTONS.UPDATE_PASSWORD}
          </Button>

          <Button
            type="button"
            variant="link"
            className="w-full"
            onClick={() => setStep('email')}
          >
            {BUTTONS.RESEND_CODE}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={
      <Card className="shadow-xl">
        <CardContent className="p-12 text-center">
          <div className="animate-pulse">{MESSAGES.INFO.LOADING}</div>
        </CardContent>
      </Card>
    }>
      <ResetPasswordContent />
    </Suspense>
  );
}
