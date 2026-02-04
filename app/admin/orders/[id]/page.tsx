"use client";

import { use } from "react";
import {
  useAdminGetOrderByIdQuery,
  useAdminUpdateOrderStatusMutation,
  Order,
  OrderItem,
} from "@/features/api/ordersApi";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ArrowLeft, Package, User, MapPin, CreditCard } from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { CURRENCY } from "@/constants";

const statusColors = {
  pending: "bg-yellow-100 text-yellow-800",
  processing: "bg-purple-100 text-purple-800",
  shipped: "bg-indigo-100 text-indigo-800",
  delivered: "bg-green-100 text-green-800",
  cancelled: "bg-red-100 text-red-800",
  refunded: "bg-gray-100 text-gray-800",
};

const statusLabels = {
  pending: "قيد الانتظار",
  processing: "قيد المعالجة",
  shipped: "تم الشحن",
  delivered: "تم التسليم",
  cancelled: "ملغي",
  refunded: "مسترد",
};

const paymentStatusLabels = {
  pending: "قيد الانتظار",
  paid: "مدفوع",
  failed: "فشل",
  refunded: "مسترد",
};

export default function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { data, isLoading, error } = useAdminGetOrderByIdQuery(
    resolvedParams.id,
  );
  const order = data?.order;
  const items = data?.items || [];
  const [updateStatus, { isLoading: isUpdating }] =
    useAdminUpdateOrderStatusMutation();
  const [selectedStatus, setSelectedStatus] = useState<Order["status"] | "">(
    "",
  );
  console.log(data);
  const handleStatusUpdate = async () => {
    if (!selectedStatus || !order) return;

    try {
      await updateStatus({
        orderId: order._id,
        status: selectedStatus,
      }).unwrap();
      toast.success("تم تحديث حالة الطلب بنجاح");
      setSelectedStatus("");
    } catch {
      toast.error("فشل تحديث حالة الطلب");
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">تفاصيل الطلب</h1>
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
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <h1 className="text-3xl font-bold">تفاصيل الطلب</h1>
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
          <Link href="/admin/orders">
            <Button variant="ghost" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold">طلب #{order.orderNumber}</h1>
            <p className="text-sm text-muted-foreground">
              {new Date(order.createdAt).toLocaleDateString("ar-SA", {
                year: "numeric",
                month: "long",
                day: "numeric",
                hour: "2-digit",
                minute: "2-digit",
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

      {/* Status Update */}
      <Card>
        <CardHeader>
          <CardTitle>تحديث حالة الطلب</CardTitle>
          <CardDescription>اختر الحالة الجديدة للطلب</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex gap-3">
            <Select
              value={selectedStatus}
              onValueChange={(v) => setSelectedStatus(v as Order["status"])}
            >
              <SelectTrigger className="w-[300px]">
                <SelectValue placeholder="اختر الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pending">قيد الانتظار</SelectItem>
                <SelectItem value="processing">قيد المعالجة</SelectItem>
                <SelectItem value="shipped">تم الشحن</SelectItem>
                <SelectItem value="delivered">تم التسليم</SelectItem>
                <SelectItem value="cancelled">ملغي</SelectItem>
                <SelectItem value="refunded">مسترد</SelectItem>
              </SelectContent>
            </Select>
            <Button
              onClick={handleStatusUpdate}
              disabled={!selectedStatus || isUpdating}
            >
              {isUpdating ? "جاري التحديث..." : "تحديث"}
            </Button>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Customer Info */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5" />
              معلومات العميل
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div>
              <p className="text-sm text-muted-foreground">الاسم</p>
              <p className="font-medium">
                {order.shippingAddress.customerName}
              </p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">اسم المستخدم</p>
              <p className="font-medium">{order.userID?.username || "N/A"}</p>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">البريد الإلكتروني</p>
              <p className="font-medium">
                {order.email || order.userID?.email || "N/A"}
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Shipping Address */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              عنوان الشحن
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            <p>{order.shippingAddress.customerName}</p>
            <p>{order.shippingAddress.addressLine1}</p>
            {order.shippingAddress.addressLine2 && (
              <p>{order.shippingAddress.addressLine2}</p>
            )}
            <p>
              {order.shippingAddress.city}, {order.shippingAddress.state}
            </p>
            <p className="text-sm text-muted-foreground">
              الهاتف: {order.shippingAddress.phone}
            </p>
          </CardContent>
        </Card>
      </div>

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
            {items.map((item, index) => (
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
                    <p className="font-medium">{item.productName}</p>
                    <p className="text-sm text-muted-foreground">
                      {item.size} • الكمية: {item.quantity} ×{" "}
                      {item.unitPrice.toLocaleString("ar-SA")}{" "}
                      {CURRENCY.DEFAULT}
                    </p>
                  </div>
                  <p className="font-bold">
                    {item.totalPrice.toLocaleString("ar-SA")} {CURRENCY.DEFAULT}
                  </p>
                </div>
                {index < items.length - 1 && <Separator className="mt-4" />}
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
            <span>
              {order.subtotal.toLocaleString("ar-SA")} {CURRENCY.DEFAULT}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الضريبة</span>
            <span>
              {order.taxAmount.toLocaleString("ar-SA")} {CURRENCY.DEFAULT}
            </span>
          </div>
          <div className="flex justify-between">
            <span className="text-muted-foreground">الشحن</span>
            <span>
              {order.shippingAmount.toLocaleString("ar-SA")} {CURRENCY.DEFAULT}
            </span>
          </div>
          {order.discountAmount > 0 && (
            <div className="flex justify-between">
              <span className="text-muted-foreground">الخصم</span>
              <span className="text-green-600">
                -{order.discountAmount.toLocaleString("ar-SA")}{" "}
                {CURRENCY.DEFAULT}
              </span>
            </div>
          )}
          <Separator />
          <div className="flex justify-between text-lg font-bold">
            <span>الإجمالي</span>
            <span>
              {order.totalAmount.toLocaleString("ar-SA")} {CURRENCY.DEFAULT}
            </span>
          </div>
          {order.paymentDetails?.method && (
            <div className="flex justify-between text-sm">
              <span className="text-muted-foreground">طريقة الدفع</span>
              <span>{order.paymentDetails.method}</span>
            </div>
          )}
          {order.notes && (
            <div className="pt-2">
              <p className="text-sm text-muted-foreground">ملاحظات:</p>
              <p className="text-sm">{order.notes}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
