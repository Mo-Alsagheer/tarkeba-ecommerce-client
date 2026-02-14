'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { CheckCircle, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useGetMyOrderByIdQuery } from '@/features/api/ordersApi';
import { Suspense } from 'react';

function PaymentSuccessContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const orderId = searchParams.get('orderId');

  const { data: orderData, isLoading } = useGetMyOrderByIdQuery(
    orderId || '',
    { skip: !orderId }
  );

  let successMessage = "تم الدفع بنجاح!";
  
  if (orderData?.order) {
    const paymentMethod = orderData.order.paymentDetails?.method;
    
    // Check if the payment method is explicitly wallet, otherwise assume Cash on Delivery (or non-wallet)
    if (paymentMethod === 'wallet') {
      successMessage = "تم الدفع بنجاح";
    } else {
      // Default for Cash on Delivery or other methods
      successMessage = "تم الطلب بنجاح";
    }
  }

  if (isLoading) {
    return (
      <div className="flex justify-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
      </div>
    );
  }

  return (
    <Card className="max-w-md mx-auto p-8 text-center">
      <div className="mb-6">
        <div className="mx-auto mb-4 h-16 w-16 rounded-full bg-green-100 flex items-center justify-center">
          <CheckCircle className="h-10 w-10 text-green-600" />
        </div>
        <h1 className="text-2xl font-bold mb-2">{successMessage}</h1>
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
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="container mx-auto px-4 py-16">
      <Suspense fallback={<div className="flex justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
