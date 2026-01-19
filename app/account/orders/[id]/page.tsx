'use client';

import { use } from 'react';
import { useGetMyOrderByIdQuery } from '@/features/api/ordersApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, MapPin, CreditCard } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const statusLabels = {
  pending: 'قيد الانتظار',
  paid: 'مدفوع',
  processing: 'قيد المعالجة',
  shipped: 'تم الشحن',
  delivered: 'تم التسليم',
  cancelled: 'ملغي',
  refunded: 'مسترد',
};

const paymentStatusLabels = {
  pending: 'قيد الانتظار',
  paid: 'مدفوع',
  failed: 'فشل',
  refunded: 'مسترد',
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data: order, isLoading, error } = useGetMyOrderByIdQuery(resolvedParams.id);

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">تفاصيل الطلب</h2>
        </div>
        <div className="grid gap-6">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  if (error || !order) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">تفاصيل الطلب</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">لم يتم العثور على الطلب</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h2 className="text-2xl font-bold">طلب #{order.id}</h2>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit',
              })}
            </p>
          </div>
        </div>
        <div className="flex gap-2">
          <Badge className={statusColors[order.status]}>
            {statusLabels[order.status]}
          </Badge>
          <Badge variant="outline">
            {paymentStatusLabels[order.paymentStatus]}
          </Badge>
        </div>
      </div>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            عنوان الشحن
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p>{order.shippingAddress.street}</p>
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          <p>{order.shippingAddress.zipCode}, {order.shippingAddress.country}</p>
          <p className="text-sm text-muted-foreground">الهاتف: {order.shippingAddress.phone}</p>
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            المنتجات
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {order.items.map((item, index) => (
              <div key={item.id}>
                <div className="flex items-center gap-4">
                  {item.productImage && (
                    <Image
                      src={item.productImage}
                      alt={item.productName}
                      width={64}
                      height={64}
                      className="object-cover rounded"
                    />
                  )}
                  <div className="flex-1">
                    <Link href={`/products/${item.productId}`}>
                      <p className="font-medium hover:text-primary cursor-pointer">{item.productName}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      الكمية: {item.quantity} × {item.price.toLocaleString('ar-SA')} ر.س
                    </p>
                  </div>
                  <p className="font-bold">{item.total.toLocaleString('ar-SA')} ر.س</p>
                </div>
                {index < order.items.length - 1 && <Separator className="mt-4" />}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            ملخص الطلب
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">المجموع الفرعي</span>
            <span>{order.subtotal.toLocaleString('ar-SA')} ر.س</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الضريبة</span>
            <span>{order.tax.toLocaleString('ar-SA')} ر.س</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الشحن</span>
            <span>{order.shipping.toLocaleString('ar-SA')} ر.س</span>
          </div>
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>الإجمالي</span>
            <span>{order.total.toLocaleString('ar-SA')} ر.س</span>
          </div>
          {order.paymentMethod && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">طريقة الدفع</span>
              <span>{order.paymentMethod}</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
