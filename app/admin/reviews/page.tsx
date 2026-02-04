"use client";

import { useState, useEffect } from "react";
import { useGetProductReviewsQuery } from "@/features/api/reviewsApi";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Star,
  Search,
  MessageSquare,
  User,
  Package,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import Image from "next/image";

// Helper function to format relative time in Arabic
const formatRelativeTime = (date: string) => {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return "منذ لحظات";
  if (diffInSeconds < 3600)
    return `منذ ${Math.floor(diffInSeconds / 60)} دقيقة`;
  if (diffInSeconds < 86400)
    return `منذ ${Math.floor(diffInSeconds / 3600)} ساعة`;
  if (diffInSeconds < 2592000)
    return `منذ ${Math.floor(diffInSeconds / 86400)} يوم`;
  return past.toLocaleDateString("ar-EG");
};

export default function ReviewsPage() {
  const [page, setPage] = useState(1);
  const [searchInput, setSearchInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [ratingFilter, setRatingFilter] = useState<string>("all");

  // Debounce search input
  useEffect(() => {
    const timer = setTimeout(() => {
      setSearchQuery(searchInput);
      setPage(1); // Reset to first page on search
    }, 500);

    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data, isLoading, error } = useGetProductReviewsQuery({
    page,
    limit: 10,
    ...(statusFilter !== "all" && { status: statusFilter }),
    ...(ratingFilter !== "all" && { rating: parseInt(ratingFilter) }),
  });

  const reviews = data?.reviews || [];
  const summary = data?.summary;
  const totalPages = data?.pagination?.pages || 1;

  // Client-side search filter
  const filteredReviews = searchQuery
    ? reviews.filter((review) => {
        const productName =
          typeof review.productId === "object" ? review.productId.name : "";
        const userName =
          typeof review.userId === "object" ? review.userId.username : "";
        const comment = review.comment || "";

        return (
          productName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
          comment.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : reviews;

  const renderStars = (rating: number) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <Star
            key={star}
            className={`h-4 w-4 ${
              star <= rating
                ? "fill-yellow-400 text-yellow-400"
                : "text-gray-300"
            }`}
          />
        ))}
      </div>
    );
  };

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "approved":
        return "default";
      case "pending":
        return "secondary";
      case "rejected":
        return "destructive";
      default:
        return "outline";
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case "approved":
        return "مقبول";
      case "pending":
        return "قيد المراجعة";
      case "rejected":
        return "مرفوض";
      default:
        return status;
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">إدارة التقييمات</h1>
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">إدارة التقييمات</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">حدث خطأ في تحميل التقييمات</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <MessageSquare className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">إدارة التقييمات</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          إجمالي التقييمات: {summary?.totalReviews || 0}
        </div>
      </div>

      {/* Summary Statistics */}
      {summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                متوسط التقييم
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                <div className="text-2xl font-bold text-primary">
                  {summary.averageRating.toFixed(1)}
                </div>
                {renderStars(Math.round(summary.averageRating))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                توزيع التقييمات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-1">
                {[5, 4, 3, 2, 1].map((rating) => {
                  const count =
                    (summary.ratingDistribution as any)[rating] || 0;
                  return (
                    <div
                      key={rating}
                      className="flex items-center gap-2 text-sm"
                    >
                      <div className="flex items-center gap-1 w-12">
                        <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                        <span>{rating}</span>
                      </div>
                      <div className="flex-1 bg-muted rounded-full h-2">
                        <div
                          className="bg-primary h-2 rounded-full"
                          style={{
                            width: `${summary.totalReviews > 0 ? (count / summary.totalReviews) * 100 : 0}%`,
                          }}
                        />
                      </div>
                      <span className="text-muted-foreground w-8 text-right">
                        {count}
                      </span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm font-medium">
                إجمالي التقييمات
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{summary.totalReviews}</div>
              <p className="text-xs text-muted-foreground mt-1">تقييم إجمالي</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid gap-4 md:grid-cols-3">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="ابحث في التقييمات..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                className="pr-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="الحالة" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع الحالات</SelectItem>
                <SelectItem value="approved">مقبول</SelectItem>
                <SelectItem value="pending">قيد المراجعة</SelectItem>
                <SelectItem value="rejected">مرفوض</SelectItem>
              </SelectContent>
            </Select>

            <Select value={ratingFilter} onValueChange={setRatingFilter}>
              <SelectTrigger>
                <SelectValue placeholder="التقييم" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">جميع التقييمات</SelectItem>
                <SelectItem value="5">⭐⭐⭐⭐⭐ (5 نجوم)</SelectItem>
                <SelectItem value="4">⭐⭐⭐⭐ (4 نجوم)</SelectItem>
                <SelectItem value="3">⭐⭐⭐ (3 نجوم)</SelectItem>
                <SelectItem value="2">⭐⭐ (2 نجمتان)</SelectItem>
                <SelectItem value="1">⭐ (1 نجمة)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Reviews List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {filteredReviews.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery || statusFilter !== "all" || ratingFilter !== "all"
                  ? "لم يتم العثور على نتائج"
                  : "لا توجد تقييمات"}
              </div>
            ) : (
              filteredReviews.map((review) => (
                <div key={review._id} className="p-6">
                  <div className="space-y-4">
                    {/* Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex gap-4 flex-1">
                        {/* Product Image */}
                        {typeof review.productId === "object" &&
                          review.productId.images?.[0] && (
                            <div className="relative h-16 w-16 rounded-md overflow-hidden bg-muted shrink-0">
                              <Image
                                src={review.productId.images[0]}
                                alt={review.productId.name}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}

                        {/* Review Info */}
                        <div className="flex-1 space-y-2">
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-1">
                                <Package className="h-4 w-4 text-muted-foreground" />
                                <h3 className="font-semibold">
                                  {typeof review.productId === "object"
                                    ? review.productId.name
                                    : "منتج محذوف"}
                                </h3>
                              </div>
                              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                                <User className="h-4 w-4" />
                                <span>
                                  {typeof review.userId === "object"
                                    ? review.userId.username
                                    : "مستخدم محذوف"}
                                </span>
                              </div>
                            </div>
                            <Badge
                              variant={getStatusBadgeVariant(review.status)}
                            >
                              {getStatusLabel(review.status)}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2">
                            {renderStars(review.rating)}
                            <span className="text-sm text-muted-foreground">
                              {formatRelativeTime(review.createdAt)}
                            </span>
                          </div>

                          {review.comment && (
                            <p className="text-sm text-muted-foreground bg-muted p-3 rounded-lg">
                              {review.comment}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronRight className="h-4 w-4 ml-2" />
                السابق
              </Button>
              <span className="text-sm text-muted-foreground">
                صفحة {page} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                التالي
                <ChevronLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
