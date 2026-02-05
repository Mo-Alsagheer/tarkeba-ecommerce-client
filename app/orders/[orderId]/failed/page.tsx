'use client';

import { use } from 'react';
import { useGetMyOrderByIdQuery } from '@/features/api/ordersApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { XCircle, ArrowLeft, RefreshCcw, HelpCircle } from 'lucide-react';
import Link from 'next/link';
import { CURRENCY } from '@/constants';
import { Separator } from '@/components/ui/separator';

export default function PaymentFailedPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  const { data: orderData, isLoading } = useGetMyOrderByIdQuery(orderId);
  const order = orderData?.order;

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
        <Card className="border-red-200 bg-red-50/50">
          <CardHeader className="text-center pb-4">
            <div className="flex justify-center mb-4">
              <div className="rounded-full bg-red-100 p-4">
                <XCircle className="h-16 w-16 text-red-600" />
              </div>
            </div>
            <CardTitle className="text-3xl font-bold text-red-800 mb-2">
              فشل الدفع
            </CardTitle>
            <p className="text-red-700">
              عذراً، لم نتمكن من إكمال عملية الدفع
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
                    <span className="text-muted-foreground">المبلغ المطلوب</span>
                    <span className="font-bold text-xl">
                      {order.totalAmount.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}
                    </span>
                  </div>

                  <Separator />

                  <div className="flex justify-between items-center">
                    <span className="text-muted-foreground">حالة الدفع</span>
                    <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-100 text-red-800 text-sm font-medium">
                      <XCircle className="h-4 w-4" />
                      فشل
                    </span>
                  </div>
                </div>

                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <HelpCircle className="h-5 w-5 text-yellow-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-yellow-900 mb-2">الأسباب المحتملة لفشل الدفع:</p>
                      <ul className="list-disc list-inside text-yellow-700 space-y-1">
                        <li>رصيد غير كافٍ في المحفظة</li>
                        <li>تم إلغاء العملية من قبلك</li>
                        <li>مشكلة في الاتصال بالشبكة</li>
                        <li>انتهت مهلة عملية الدفع</li>
                        <li>خطأ في معلومات الدفع</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <RefreshCcw className="h-5 w-5 text-blue-600 mt-0.5 flex-shrink-0" />
                    <div className="text-sm">
                      <p className="font-medium text-blue-900 mb-1">ماذا الآن؟</p>
                      <p className="text-blue-700">
                        يمكنك المحاولة مرة أخرى أو اختيار طريقة دفع أخرى. طلبك ما زال محفوظاً في حسابك.
                      </p>
                    </div>
                  </div>
                </div>
              </>
            )}

            <div className="flex flex-col sm:flex-row gap-3 pt-4">
              <Button asChild className="flex-1" size="lg">
                <Link href={`/account/orders/${orderId}`}>
                  <RefreshCcw className="ml-2 h-4 w-4" />
                  إعادة المحاولة
                </Link>
              </Button>
              <Button asChild variant="outline" className="flex-1" size="lg">
                <Link href="/products">
                  <ArrowLeft className="ml-2 h-4 w-4" />
                  متابعة التسوق
                </Link>
              </Button>
            </div>

            <div className="text-center pt-4">
              <p className="text-sm text-muted-foreground mb-2">تحتاج مساعدة؟</p>
              <Button variant="link" asChild>
                <Link href="/faq">تواصل مع خدمة العملاء</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
