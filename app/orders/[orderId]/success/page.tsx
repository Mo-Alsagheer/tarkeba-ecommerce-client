'use client';

import { use, useEffect } from 'react';
import { useGetMyOrderByIdQuery } from '@/features/api/ordersApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, ArrowLeft, Package } from 'lucide-react';
import Link from 'next/link';
import { CURRENCY } from '@/constants';
import { Separator } from '@/components/ui/separator';

export default function PaymentSuccessPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: orderData, isLoading } = useGetMyOrderByIdQuery(orderId);
  const order = orderData?.order;

  useEffect(() => {
    // Add confetti or celebration animation here if desired
    if (order) {
      // Track successful payment in analytics
      console.log('Payment successful for order:', orderId);
    }
  }, [order, orderId]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardContent className="p-12">
              <div className="animate-pulse space-y-4">
                <div className="h-16 w-16 bg-gray-200 rounded-full mx-auto"></div>
                <div className="h-6 bg-gray-200 rounded w-3/4 mx-auto"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2 mx-auto"></div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto">
        <Card className="border-green-200 bg-green-50/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-green-100 p-4">
                <CheckCircle className="h-16 w-16 text-green-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-green-800 mb-2">
              تم الدفع بنجاح!
            </CardTitle>
            <p className="text-green-700">
              شكراً لك! تم استلام طلبك ومعالجة الدفع بنجاح
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {order && (
              <>
                <div className="bg-white rounded-lg p-6 space-y-4">
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">رقم الطلب</span>
                    <span className="font-semibold text-lg">{order.orderNumber}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">المبلغ المدفوع</span>
                    <span className="font-bold text-xl text-green-600">
                      {order.totalAmount.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">حالة الدفع</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-green-100 text-green-800 text-sm font-medium">
                      <CheckCircle className="h-4 w-4" />
                      مدفوع
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-start">
                    <span className="text-muted-foreground">عنوان التوصيل</span>
                    <div className="text-left text-sm">
                      <p className="font-medium">{order.shippingAddress.customerName}</p>
                      <p className="text-muted-foreground">{order.shippingAddress.addressLine1}</p>
                      {order.shippingAddress.addressLine2 && (
                        <p className="text-muted-foreground">{order.shippingAddress.addressLine2}</p>
                      )}
                      <p className="text-muted-foreground">
                        {order.shippingAddress.city}, {order.shippingAddress.state}
                      </p>
                      <p className="text-muted-foreground">{order.shippingAddress.phone}</p>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <Package className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">ماذا بعد؟</p>
                      <p className="text-blue-700">
                        سنبدأ بتجهيز طلبك فوراً. ستتلقى رسالة تأكيد عبر البريد الإلكتروني ورسالة نصية عند شحن الطلب.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1" size="lg">
                <Link href={`/account/orders/${orderId}`}>
                  عرض تفاصيل الطلب
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/products">
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  متابعة التسوق
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
