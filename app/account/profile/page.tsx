'use client';

import { useAppSelector } from '@/lib/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { User, Mail, Phone, Lock } from 'lucide-react';
import Link from 'next/link';
import { TITLES, DESCRIPTIONS, LABELS, PLACEHOLDERS, BUTTONS, MESSAGES } from '@/constants';

export default function ProfilePage() {
  const user = useAppSelector(selectCurrentUser);

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <p>{MESSAGES.EMPTY.PLEASE_LOGIN}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">{TITLES.ACCOUNT.PROFILE}</h2>

      <Card>
        <CardHeader>
          <CardTitle>{DESCRIPTIONS.PROFILE.MY_INFO}</CardTitle>
          <CardDescription>{DESCRIPTIONS.PROFILE.INFO}</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
            <div className="space-y-2">
              <Label htmlFor="name">{LABELS.COMMON.NAME}</Label>
              <div className="relative">
                <User className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="name" value={user.name || ''} className="pe-10" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">{LABELS.COMMON.EMAIL}</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="email" value={user.email} className="pe-10" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">{LABELS.COMMON.PHONE}</Label>
              <div className="relative">
                <Phone className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="phone" value={user.phone || ''} placeholder={PLACEHOLDERS.PROFILE.NO_PHONE} className="pe-10" readOnly />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">{LABELS.COMMON.PASSWORD}</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input id="password" type="password" value="********" className="pe-10" readOnly />
              </div>
            </div>
          </div>

          <div className="flex justify-end gap-2 mt-4">
             <Link href="/reset-password">
               <Button variant="outline">{BUTTONS.CHANGE_PASSWORD}</Button>
            </Link>
            <Button>{BUTTONS.SAVE_CHANGES}</Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
