'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useGetDashboardAnalyticsQuery } from '@/features/api/adminApi';
import { PoundSterling, ShoppingCart, Package, Users, TrendingUp, Clock } from 'lucide-react';
import { TITLES, MESSAGES, CURRENCY, LABELS } from '@/constants';
import Link from 'next/link';

export default function AdminDashboard() {
  const { data: analytics, isLoading, error } = useGetDashboardAnalyticsQuery();

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{TITLES.ADMIN.DASHBOARD}</h1>
        <div className="grid md:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map((i) => (
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

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{TITLES.ADMIN.DASHBOARD}</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600 text-sm">{MESSAGES.ERROR.STATS_LOAD_FAILED}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const statsCards = [
    {
      title: TITLES.DASHBOARD_STATS.TOTAL_SALES,
      value: analytics ? `${analytics.overview.totalRevenue.toLocaleString('ar-SA')} ${CURRENCY.DEFAULT}` : `0 ${CURRENCY.DEFAULT}`,
      icon: PoundSterling,
      color: 'bg-blue-100 text-blue-700',
    },
    {
      title: TITLES.DASHBOARD_STATS.ORDERS,
      value: analytics ? analytics.overview.totalOrders.toLocaleString('ar-SA') : '0',
      icon: ShoppingCart,
      color: 'bg-green-100 text-green-700',
    },
    {
      title: TITLES.DASHBOARD_STATS.PRODUCTS,
      value: analytics ? analytics.overview.totalProducts.toLocaleString('ar-SA') : '0',
      icon: Package,
      color: 'bg-purple-100 text-purple-700',
    },
    {
      title: TITLES.DASHBOARD_STATS.USERS,
      value: analytics ? analytics.overview.totalUsers.toLocaleString('ar-SA') : '0',
      icon: Users,
      color: 'bg-orange-100 text-orange-700',
    },
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">{TITLES.ADMIN.DASHBOARD}</h1>

      {/* Stats Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        {statsCards.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm text-muted-foreground mb-2">{stat.title}</p>
                  <p className="text-3xl font-bold">{stat.value}</p>
                </div>
                <div className={`p-3 rounded-full ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Recent Orders */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                الطلبات الأخيرة
              </CardTitle>
              <Link href="/admin/orders" className="text-sm text-primary hover:underline">
                عرض الكل
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {analytics?.recentOrders && analytics.recentOrders.length > 0 ? (
              <div className="space-y-4">
                {analytics.recentOrders.map((order) => (
                  <div key={order._id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div>
                      <p className="font-medium text-sm">{order.shippingAddress.customerName}</p>
                      <p className="text-xs text-muted-foreground">{order.shippingAddress.phone}</p>
                      <p className="text-xs text-muted-foreground mt-1">
                        {new Date(order.createdAt).toLocaleDateString('ar-SA')}
                      </p>
                    </div>
                    <div className="text-left">
                      <p className="font-semibold">{order.totalAmount.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</p>
                      <p className={`text-xs px-2 py-1 rounded-full inline-block ${
                        order.status === 'DELIVERED' ? 'bg-green-100 text-green-700' :
                        order.status === 'PENDING' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-blue-100 text-blue-700'
                      }`}>
                        {order.status}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">{MESSAGES.EMPTY.NO_ORDERS}</p>
            )}
          </CardContent>
        </Card>

        {/* Top Products */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5" />
                المنتجات الأكثر مبيعاً
              </CardTitle>
              <Link href="/admin/products" className="text-sm text-primary hover:underline">
                عرض الكل
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {analytics?.topProducts && analytics.topProducts.length > 0 ? (
              <div className="space-y-4">
                {analytics.topProducts.map((product, index) => (
                  <div key={product._id} className="flex items-center justify-between border-b pb-3 last:border-0">
                    <div className="flex items-center gap-3">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold">
                        {index + 1}
                      </div>
                      <div>
                        <p className="font-medium text-sm">{product.productName}</p>
                        <p className="text-xs text-muted-foreground">
                          {product.totalQuantity} {LABELS.COMMON.QUANTITY}
                        </p>
                      </div>
                    </div>
                    <p className="font-semibold text-sm">
                      {product.totalRevenue.toLocaleString('ar-SA')} {CURRENCY.DEFAULT}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-muted-foreground py-8">{MESSAGES.EMPTY.NO_PRODUCTS}</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      {analytics?.orderStatusBreakdown && analytics.orderStatusBreakdown.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>توزيع حالات الطلبات</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {analytics.orderStatusBreakdown.map((status) => (
                <div key={status.status} className="text-center p-4 border rounded-lg">
                  <p className="text-2xl font-bold text-primary">{status.count}</p>
                  <p className="text-sm text-muted-foreground mt-1">{status.status}</p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
