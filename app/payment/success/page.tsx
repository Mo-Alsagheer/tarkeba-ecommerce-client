'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle } from 'lucide-react';
import Link from 'next/link';

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="container mx-auto px-4 py-16">
      <Card className="max-w-md mx-auto p-8 text-center">
        <div className="mb-6">
          <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-2xl font-bold mb-2">تم الدفع بنجاح!</h1>
          <p className="text-muted-foreground">
            شكراً لك. تم استلام طلبك وسيتم معالجته قريباً.
          </p>
        </div>

        <div className="space-y-3">
          <Button className="w-full" onClick={() => router.push('/account/orders')}>
            عرض طلباتي
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
