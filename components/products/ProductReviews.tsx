'use client';

import { Star, Lock, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { useHasUserPurchasedProductQuery } from '@/features/api/ordersApi';
import { useCreateReviewMutation, useGetProductReviewsQuery } from '@/features/api/reviewsApi';
import { useAppSelector } from '@/lib/hooks';
import { selectCurrentUser } from '@/features/auth/authSlice';
import { useState, useEffect } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { toast } from 'sonner';

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
  openReviewForm?: boolean;
  orderId?: string;
}

export function ProductReviews({ productId, averageRating, reviewCount, openReviewForm = false, orderId }: ProductReviewsProps) {
  const user = useAppSelector(selectCurrentUser);
  const { data: purchaseCheck, isLoading: isCheckingPurchase } = useHasUserPurchasedProductQuery(productId, {
    skip: !user, // Only check if user is logged in
  });
  
  const { data: reviewsData, isLoading: isLoadingReviews } = useGetProductReviewsQuery({
    productId,
    page: 1,
    limit: 10,
    sortOrder: 'desc',
  });
  const [createReview] = useCreateReviewMutation();
  
  const reviews = reviewsData?.reviews || [];
  console.log(reviewsData)
  const totalReviews = reviewsData?.summary?.totalReviews || reviewCount;
  const avgRating = reviewsData?.summary?.averageRating || averageRating;
  const ratingDistribution = reviewsData?.summary?.ratingDistribution || { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 };
  const pagination = reviewsData?.pagination;
  console.log(ratingDistribution)
  const hasPurchased = purchaseCheck?.hasPurchased || false;
  const canReview = user && hasPurchased;
  // Allow review form if coming from order (openReviewForm) or if user has purchased
  const canShowReviewForm = user && (openReviewForm || hasPurchased);
  
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [rating, setRating] = useState(0);
  const [hoveredRating, setHoveredRating] = useState(0);
  const [comment, setComment] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  // Open review form if openReviewForm prop is true and user is logged in
  useEffect(() => {
    if (openReviewForm && user) {
      setShowReviewForm(true);
      // Scroll to reviews section
      setTimeout(() => {
        document.getElementById('reviews-section')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [openReviewForm, user]);
  
  const handleSubmitReview = async () => {
    if (rating === 0 || !comment.trim()) {
      toast.error('يرجى اختيار التقييم وكتابة تعليق');
      return;
    }
    
    if (comment.length < 10) {
      toast.error('يجب أن يكون التعليق 10 أحرف على الأقل');
      return;
    }
    
    // Get orderId from props or from purchase check
    const reviewOrderId = orderId || purchaseCheck?.orderId;
    
    if (!reviewOrderId) {
      toast.error('لا يمكن إضافة التقييم. معرف الطلب غير موجود');
      return;
    }
    
    setIsSubmitting(true);
    try {
      await createReview({
        productId,
        orderId: reviewOrderId,
        rating,
        comment: comment.trim(),
      }).unwrap();
      
      // Reset form
      setRating(0);
      setComment('');
      setShowReviewForm(false);
      
      // Show success message
      toast.success('تم إضافة تقييمك بنجاح! شكراً لك');
    } catch (error: any) {
      console.error('Error submitting review:', error);
      const errorMessage = error?.data?.message || 'حدث خطأ أثناء إضافة التقييم';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id="reviews-section" className="space-y-8">
      <h2 className="text-2xl font-bold">تقييمات العملاء</h2>
      
      {/* Review Form */}
      {showReviewForm && canShowReviewForm && (
        <Card className="border-2 border-primary">
          <CardContent className="p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">أضف تقييمك</h3>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setShowReviewForm(false)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">التقييم</label>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoveredRating(star)}
                    onMouseLeave={() => setHoveredRating(0)}
                    className="transition-transform hover:scale-110"
                  >
                    <Star
                      className={`h-8 w-8 ${
                        star <= (hoveredRating || rating)
                          ? 'fill-yellow-400 text-yellow-400'
                          : 'text-gray-300'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium">التعليق</label>
              <textarea
                value={comment}
                onChange={(e) => setComment(e.target.value)}
                placeholder="شاركنا رأيك في المنتج..."
                className="w-full min-h-[120px] p-3 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary"
                maxLength={500}
              />
              <p className="text-xs text-muted-foreground text-left">
                {comment.length}/500
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button
                onClick={handleSubmitReview}
                disabled={rating === 0 || !comment.trim() || isSubmitting}
                className="flex-1"
              >
                {isSubmitting ? 'جاري الإرسال...' : 'إرسال التقييم'}
              </Button>
              <Button
                variant="outline"
                onClick={() => setShowReviewForm(false)}
                disabled={isSubmitting}
              >
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid md:grid-cols-3 gap-8">
        {/* Summary */}
        <div className="md:col-span-1 space-y-4">
          {isLoadingReviews ? (
            <>
              <div className="animate-pulse space-y-3">
                <div className="flex items-center gap-2">
                  <div className="h-12 w-12 bg-gray-200 rounded"></div>
                  <div className="space-y-2">
                    <div className="h-4 bg-gray-200 rounded w-20"></div>
                    <div className="h-3 bg-gray-200 rounded w-16"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="h-2 bg-gray-200 rounded"></div>
                  ))}
                </div>
                <div className="h-10 bg-gray-200 rounded"></div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold">{avgRating.toFixed(1)}</span>
                <div className="flex flex-col">
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${i < Math.round(avgRating) ? 'fill-current' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                  <span className="text-sm text-muted-foreground">{totalReviews} تقييم</span>
                </div>
              </div>

              <div className="space-y-2">
                {[5, 4, 3, 2, 1].map((stars) => {
                  const count = ratingDistribution[stars as 1 | 2 | 3 | 4 | 5] || 0;
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={stars} className="flex items-center gap-2 text-sm">
                      <span className="w-3">{stars}</span>
                      <Star className="h-3 w-3 text-muted-foreground" />
                      <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                        <div className="h-full bg-yellow-400" style={{ width: `${percentage}%` }} />
                      </div>
                      <span className="w-8 text-muted-foreground text-xs">
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                  );
                })}
              </div>

              {user ? (
                canShowReviewForm ? (
                  <Button 
                    className="w-full" 
                    onClick={() => setShowReviewForm(!showReviewForm)}
                  >
                    {showReviewForm ? 'إخفاء النموذج' : 'أضف تقييمك'}
                  </Button>
                ) : (
                  <div className="space-y-2">
                    <Button className="w-full" disabled>
                      <Lock className="ml-2 h-4 w-4" />
                      أضف تقييمك
                    </Button>
                    <p className="text-xs text-center text-muted-foreground">
                      يمكنك تقييم المنتج بعد شرائه
                    </p>
                  </div>
                )
              ) : (
                <div className="space-y-2">
                  <Button className="w-full" disabled>
                    <Lock className="ml-2 h-4 w-4" />
                    أضف تقييمك
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    يجب تسجيل الدخول لإضافة تقييم
                  </p>
                </div>
              )}
            </>
          )}
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-6">
          {isLoadingReviews ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="animate-pulse space-y-2">
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-full"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => {
                console.log(review);
              const userName = typeof review.userId === 'object' ? review.userId.username : 'مستخدم';
              const reviewDate = new Date(review.createdAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              });
              
              return (
                <div key={review._id} className="space-y-2">
                  <div className="flex items-start justify-between">
                    <div>
                      <p className="font-semibold text-sm">{userName}</p>
                      <div className="flex text-yellow-400">
                        {[...Array(5)].map((_, i) => (
                          <Star
                            key={i}
                            className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-muted'}`}
                          />
                        ))}
                      </div>
                    </div>
                    <span className="text-xs text-muted-foreground">{reviewDate}</span>
                  </div>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {review.comment}
                  </p>
                  <Separator />
                </div>
              );
            })
          ) : (
            <div className="text-center py-8">
              <p className="text-muted-foreground">لا توجد تقييمات بعد</p>
              <p className="text-sm text-muted-foreground mt-2">كن أول من يقيم هذا المنتج</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
