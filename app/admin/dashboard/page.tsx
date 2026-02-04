"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetDashboardAnalyticsQuery } from "@/features/api/adminApi";
import { useGetProductReviewsQuery } from "@/features/api/reviewsApi";
import {
    PoundSterling,
    ShoppingCart,
    Package,
    Users,
    TrendingUp,
    Clock,
    MessageSquare,
    Star,
} from "lucide-react";
import { TITLES, MESSAGES, CURRENCY, LABELS, STATUS } from "@/constants";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
const statusColors = {
    pending: "bg-yellow-100 text-yellow-800",
    confirmed: "bg-blue-100 text-blue-800",
    processing: "bg-purple-100 text-purple-800",
    shipped: "bg-indigo-100 text-indigo-800",
    delivered: "bg-green-100 text-green-800",
    cancelled: "bg-red-100 text-red-800",
    refunded: "bg-gray-100 text-gray-800",
};
export default function AdminDashboard() {
    const {
        data: analytics,
        isLoading,
        error,
    } = useGetDashboardAnalyticsQuery();
    
    const {
        data: reviewsData,
        isLoading: isLoadingReviews,
    } = useGetProductReviewsQuery({
        limit: 5,
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });
    
    console.log(reviewsData);
    console.log(analytics);
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
                        <p className="text-red-600 text-sm">
                            {MESSAGES.ERROR.STATS_LOAD_FAILED}
                        </p>
                    </CardContent>
                </Card>
            </div>
        );
    }

    const statsCards = [
        {
            title: TITLES.DASHBOARD_STATS.TOTAL_SALES,
            value: analytics
                ? `${analytics.overview.totalRevenue.toLocaleString("ar-SA")} ${CURRENCY.DEFAULT}`
                : `0 ${CURRENCY.DEFAULT}`,
            icon: PoundSterling,
            color: "bg-blue-100 text-blue-700",
        },
        {
            title: TITLES.DASHBOARD_STATS.ORDERS,
            value: analytics
                ? analytics.overview.totalOrders.toLocaleString("ar-SA")
                : "0",
            icon: ShoppingCart,
            color: "bg-green-100 text-green-700",
        },
        {
            title: TITLES.DASHBOARD_STATS.PRODUCTS,
            value: analytics
                ? analytics.overview.totalProducts.toLocaleString("ar-SA")
                : "0",
            icon: Package,
            color: "bg-purple-100 text-purple-700",
        },
        {
            title: TITLES.DASHBOARD_STATS.USERS,
            value: analytics
                ? analytics.overview.totalUsers.toLocaleString("ar-SA")
                : "0",
            icon: Users,
            color: "bg-orange-100 text-orange-700",
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
                                    <p className="text-sm text-muted-foreground mb-2">
                                        {stat.title}
                                    </p>
                                    <p className="text-3xl font-bold">
                                        {stat.value}
                                    </p>
                                </div>
                                <div
                                    className={`p-3 rounded-full ${stat.color}`}
                                >
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
                            <Link
                                href="/admin/orders"
                                className="text-sm text-primary hover:underline"
                            >
                                عرض الكل
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {analytics?.recentOrders &&
                        analytics.recentOrders.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.recentOrders.map((order) => (
                                    <div
                                        key={order._id}
                                        className="flex items-center justify-between border-b pb-3 last:border-0"
                                    >
                                        <div>
                                            <p className="font-medium text-sm">
                                                {
                                                    order.shippingAddress
                                                        .customerName
                                                }
                                            </p>
                                            <p className="text-xs text-muted-foreground">
                                                {order.shippingAddress.phone}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(
                                                    order.createdAt,
                                                ).toLocaleDateString("ar-SA")}
                                            </p>
                                        </div>
                                        <div className="text-left">
                                            <p className="font-semibold">
                                                {order.totalAmount.toLocaleString(
                                                    "ar-SA",
                                                )}{" "}
                                                {CURRENCY.DEFAULT}
                                            </p>
                                            <Badge
                                                className={
                                                    statusColors[order.status]
                                                }
                                            >
                                                {
                                                    STATUS.ORDER[
                                                        order.status.toUpperCase() as keyof typeof STATUS.ORDER
                                                    ]
                                                }
                                            </Badge>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                {MESSAGES.EMPTY.NO_ORDERS}
                            </p>
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
                            <Link
                                href="/admin/products"
                                className="text-sm text-primary hover:underline"
                            >
                                عرض الكل
                            </Link>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {analytics?.topProducts &&
                        analytics.topProducts.length > 0 ? (
                            <div className="space-y-4">
                                {analytics.topProducts.map((product, index) => (
                                    <div
                                        key={product._id}
                                        className="flex items-center justify-between border-b pb-3 last:border-0"
                                    >
                                        <div className="flex items-center gap-3">
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                                                {product.productImage ? (
                                                    <Image
                                                        src={
                                                            product.productImage
                                                        }
                                                        alt={
                                                            product.productName
                                                        }
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center w-full h-full">
                                                        <Package className="h-6 w-6 text-gray-400" />
                                                    </div>
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {product.productName}
                                                </p>
                                                <p className="text-xs text-muted-foreground">
                                                    {product.totalQuantity}{" "}
                                                    {LABELS.COMMON.QUANTITY}
                                                </p>
                                            </div>
                                        </div>
                                        <p className="font-semibold text-sm">
                                            {product.totalRevenue.toLocaleString(
                                                "ar-SA",
                                            )}{" "}
                                            {CURRENCY.DEFAULT}
                                        </p>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-8">
                                {MESSAGES.EMPTY.NO_PRODUCTS}
                            </p>
                        )}
                    </CardContent>
                </Card>
            </div>


            {/* Recent Reviews */}
            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle className="flex items-center gap-2">
                            <MessageSquare className="h-5 w-5" />
                            آخر التقييمات
                        </CardTitle>
                        <Link
                            href="/admin/products"
                            className="text-sm text-primary hover:underline"
                        >
                            عرض الكل
                        </Link>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoadingReviews ? (
                        <div className="space-y-4">
                            {[1, 2, 3].map((i) => (
                                <div key={i} className="animate-pulse space-y-2 pb-4 border-b last:border-0">
                                    <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                                    <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                                </div>
                            ))}
                        </div>
                    ) : reviewsData?.reviews && reviewsData.reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviewsData.reviews.map((review) => {
                                const product = typeof review.productId === 'object' ? review.productId : null;
                                const user = typeof review.userId === 'object' ? review.userId : null;
                                
                                return (
                                    <div
                                        key={review._id}
                                        className="flex items-start justify-between border-b pb-4 last:border-0"
                                    >
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                <p className="font-medium text-sm">
                                                    {user?.username || 'مستخدم'}
                                                </p>
                                                <div className="flex items-center gap-1">
                                                    {Array.from({ length: 5 }).map(
                                                        (_, i) => (
                                                            <Star
                                                                key={i}
                                                                className={`h-3 w-3 ${
                                                                    i < review.rating
                                                                        ? "fill-yellow-400 text-yellow-400"
                                                                        : "text-gray-300"
                                                                }`}
                                                            />
                                                        ),
                                                    )}
                                                </div>
                                            </div>
                                            {product && (
                                                <Link
                                                    href={`/products/${product.slug || product._id}`}
                                                    className="text-sm text-primary hover:underline"
                                                >
                                                    {product.name}
                                                </Link>
                                            )}
                                            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                                {review.comment}
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                {new Date(
                                                    review.createdAt,
                                                ).toLocaleDateString("ar-SA")}
                                            </p>
                                        </div>
                                        {product?.images?.[0] && (
                                            <div className="relative w-12 h-12 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0 mr-3">
                                                <Image
                                                    src={product.images[0]}
                                                    alt={product.name}
                                                    fill
                                                    className="object-cover"
                                                />
                                            </div>
                                        )}
                                    </div>
                                );
                            })}
                        </div>
                    ) : (
                        <p className="text-center text-muted-foreground py-8">
                            لا توجد تقييمات حتى الآن
                        </p>
                    )}
                </CardContent>
            </Card>

            {/* Order Status Breakdown */}
            {analytics?.orderStatusBreakdown &&
                analytics.orderStatusBreakdown.length > 0 && (
                    <Card>
                        <CardHeader>
                            <CardTitle>توزيع حالات الطلبات</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {analytics.orderStatusBreakdown.map(
                                    (status) => (
                                        <div
                                            key={status.status}
                                            className="text-center p-4 border rounded-lg"
                                        >
                                            <p className="text-2xl font-bold text-primary">
                                                {status.count}
                                            </p>
                                            <p className="text-sm text-muted-foreground mt-1">
                                                {status.status}
                                            </p>
                                        </div>
                                    ),
                                )}
                            </div>
                        </CardContent>
                    </Card>
                )}
        </div>
    );
}
