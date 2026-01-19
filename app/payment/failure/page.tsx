'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { XCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentFailurePage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-red-100 flex items-center justify-center">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">فشلت عملية الدفع</h1>
          <p className="text-muted-foreground">
            عذراً، لم تتم عملية الدفع. يرجى المحاولة مرة أخرى.
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={() => router.push('/checkout')}>
            إعادة المحاولة
          </Button>
          <Link href="/products" className="block">
            <Button variant="outline" className="w-full">
              متابعة التسوق
            </Button>
          </Link>
        </div>
      </Card>
    </div>
  );
}
