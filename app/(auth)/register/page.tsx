'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useRegisterMutation } from '@/features/api/authApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, Lock, User, Phone, UserPlus } from 'lucide-react';

const registerSchema = z.object({
  name: z.string().min(2, 'الاسم يجب أن يكون حرفين على الأقل'),
  email: z.string().email('البريد الإلكتروني غير صالح'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string(),
  phone: z.string().optional(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type RegisterFormValues = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [register, { isLoading }] = useRegisterMutation();
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  const {
    register: registerField,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormValues) => {
    try {
      setError(null);
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { confirmPassword, ...registerData } = data;
      await register(registerData).unwrap();
      setSuccess(true);
      setTimeout(() => {
        router.push(`/verify-otp?email=${encodeURIComponent(data.email)}`);
      }, 2000);
    } catch (err) {
      const error = err as { data?: { message?: string } };
      setError(error?.data?.message || 'فشل إنشاء الحساب. يرجى المحاولة مرة أخرى.');
    }
  };

  if (success) {
    return (
      <div className="text-center space-y-4">
        <div className="mx-auto mb-4 h-12 w-12 rounded-full bg-green-100 flex items-center justify-center">
          <svg
            className="h-6 w-6 text-green-600"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M5 13l4 4L19 7"
            />
          </svg>
        </div>
        <h1 className="text-2xl font-bold">تم إنشاء الحساب بنجاح!</h1>
        <p className="text-muted-foreground">
          تم إرسال رمز التحقق إلى بريدك الإلكتروني. جاري التوجيه...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-2 text-center flex flex-col items-center">
        <Link href="/">
          <Image
            src="/logo.png"
            alt="Tarkeba Logo"
            width={120}
            height={120}
            className="mb-2"
          />
        </Link>
        <h1 className="text-2xl font-bold">إنشاء حساب جديد</h1>
        <p className="text-muted-foreground">
          أدخل معلوماتك لإنشاء حساب في تاركيبة
        </p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        {error && (
          <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md text-center">
            {error}
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="name">الاسم الكامل</Label>
          <div className="relative">
            <User className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="name"
              type="text"
              placeholder="محمد أحمد"
              className="ps-10"
              {...registerField('name')}
              disabled={isLoading}
            />
          </div>
          {errors.name && (
            <p className="text-xs text-destructive">{errors.name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="email">البريد الإلكتروني</Label>
          <div className="relative">
            <Mail className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="email"
              type="email"
              placeholder="name@example.com"
              className="ps-10"
              {...registerField('email')}
              disabled={isLoading}
            />
          </div>
          {errors.email && (
            <p className="text-xs text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">رقم الهاتف (اختياري)</Label>
          <div className="relative">
            <Phone className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="phone"
              type="tel"
              placeholder="+20 XXX XXX XXXX"
              className="ps-10"
              {...registerField('phone')}
              disabled={isLoading}
            />
          </div>
          {errors.phone && (
            <p className="text-xs text-destructive">{errors.phone.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="password">كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className="ps-10"
              {...registerField('password')}
              disabled={isLoading}
            />
          </div>
          {errors.password && (
            <p className="text-xs text-destructive">{errors.password.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="confirmPassword">تأكيد كلمة المرور</Label>
          <div className="relative">
            <Lock className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className="ps-10"
              {...registerField('confirmPassword')}
              disabled={isLoading}
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <Button type="submit" className="w-full" disabled={isLoading}>
          {isLoading ? (
            'جاري إنشاء الحساب...'
          ) : (
            <>
              <UserPlus className="ms-2 h-4 w-4" />
              إنشاء حساب
            </>
          )}
        </Button>
      </form>

      <div className="flex justify-center">
        <p className="text-sm text-muted-foreground">
          لديك حساب بالفعل؟{' '}
          <Link href="/login" className="text-primary hover:underline font-medium">
            تسجيل الدخول
          </Link>
        </p>
      </div>
    </div>
  );
}
