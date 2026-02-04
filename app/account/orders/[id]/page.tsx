'use client';

import { use } from 'react';
import { useGetMyOrderByIdQuery } from '@/features/api/ordersApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, Package, MapPin, CreditCard, Star } from 'lucide-react';
import Link from 'next/link';
import Image from 'next/image';
import { STATUS, CURRENCY } from '@/constants/status';
import { TITLES } from '@/constants/titles';
import { LABELS } from '@/constants/labels';
import { MESSAGES } from '@/constants/messages';

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

const paymentMethodLabels: Record<string, string> = {
  cash_on_delivery: STATUS.PAYMENT_METHOD.CASH_ON_DELIVERY,
  credit_card: STATUS.PAYMENT_METHOD.CREDIT_CARD,
  mtn_momo: STATUS.PAYMENT_METHOD.MTN_MOMO,
  moov_flooz: STATUS.PAYMENT_METHOD.MOOV_FLOOZ,
};

export default function OrderDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useGetMyOrderByIdQuery(resolvedParams.id);
  const order = data?.order;
  const items = data?.items || [];
  console.log(data)
  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/account/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h2 className="text-2xl font-bold">{TITLES.ACCOUNT.ORDER_DETAILS}</h2>
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
          <h2 className="text-2xl font-bold">{TITLES.ACCOUNT.ORDER_DETAILS}</h2>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <p className="text-red-600">{MESSAGES.ERROR.ORDER_NOT_FOUND}</p>
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
            <h2 className="text-2xl font-bold">{TITLES.ACCOUNT.ORDER} #{order.orderNumber}</h2>
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
            {STATUS.ORDER[order.status.toUpperCase() as keyof typeof STATUS.ORDER]}
          </Badge>
          <Badge variant="outline">
            {STATUS.PAYMENT[order.paymentStatus.toUpperCase() as keyof typeof STATUS.PAYMENT]}
          </Badge>
        </div>
      </div>

      {/* Shipping Address */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5" />
            {TITLES.ACCOUNT.SHIPPING_ADDRESS}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="font-medium">{order.shippingAddress.customerName}</p>
          <p>{order.shippingAddress.addressLine1}</p>
          {order.shippingAddress.addressLine2 && <p>{order.shippingAddress.addressLine2}</p>}
          <p>{order.shippingAddress.city}, {order.shippingAddress.state}</p>
          {order.shippingAddress.phone && (
            <p className="text-sm text-muted-foreground">{LABELS.ORDER.PHONE}: {order.shippingAddress.phone}</p>
          )}
        </CardContent>
      </Card>

      {/* Order Items */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="h-5 w-5" />
            {TITLES.ACCOUNT.PRODUCTS}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {items && items.length > 0 ? items.map((item, index) => (
              <div key={item._id}>
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
                    <Link href={`/products/${item.productID.slug || item.productID._id}`}>
                      <p className="font-medium hover:text-primary cursor-pointer">{item.productName}</p>
                    </Link>
                    <p className="text-sm text-muted-foreground">
                      {LABELS.ORDER.QUANTITY}: {item.quantity} × {item.unitPrice.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}
                    </p>
                    {item.size && (
                      <p className="text-xs text-muted-foreground">{LABELS.ORDER.SIZE}: {item.size}</p>
                    )}
                    {order.status === 'delivered' && (
                      <Link href={`/products/${item.productID.slug || item.productID._id}?review=true&orderId=${order._id}`}>
                        <Button variant="outline" size="sm" className="mt-2">
                          <Star className="h-4 w-4 mr-1" />
                          Write Review
                        </Button>
                      </Link>
                    )}
                  </div>
                  <p className="font-bold">{item.totalPrice.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</p>
                </div>
                {index < items.length - 1 && <Separator className="mt-4" />}
              </div>
            )) : (
              <p className="text-center text-muted-foreground py-4">{MESSAGES.EMPTY.NO_ORDER_ITEMS}</p>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Order Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            {TITLES.ACCOUNT.ORDER_SUMMARY}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex justify-between">
            <span className="text-muted-foreground">{LABELS.ORDER.SUBTOTAL}</span>
            <span>{order.subtotal.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{LABELS.ORDER.TAX}</span>
            <span>{order.taxAmount.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">{LABELS.ORDER.SHIPPING}</span>
            <span>{order.shippingAmount.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>{LABELS.ORDER.DISCOUNT}</span>
              <span>-{order.discountAmount.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>{LABELS.ORDER.TOTAL}</span>
            <span>{order.totalAmount.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</span>
          </div>
          <Separator />
          {order.paymentDetails?.method && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">{LABELS.ORDER.PAYMENT_METHOD}</span>
              <span className="font-medium">
                {paymentMethodLabels[order.paymentDetails.method] || order.paymentDetails.method}
              </span>
            </div>
          )}
          {order.notes && (
            <div className="pt-3 border-t">
              <p className="text-sm text-muted-foreground mb-1">{LABELS.ORDER.NOTES}:</p>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
