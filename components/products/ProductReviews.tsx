'use client';

import { Star } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface Review {
  id: string;
  user: string;
  rating: number;
  comment: string;
  date: string;
}

// Mock data
const MOCK_REVIEWS: Review[] = [
  {
    id: '1',
    user: 'أحمد محمد',
    rating: 5,
    comment: 'عطر رائع جداً وثابت، أنصح به بشدة!',
    date: '2024-01-15',
  },
  {
    id: '2',
    user: 'سارة علي',
    rating: 4,
    comment: 'الرائحة جميلة ولكن الثبات متوسط.',
    date: '2024-01-10',
  },
  {
    id: '3',
    user: 'خالد عمر',
    rating: 5,
    comment: 'تغليف ممتاز وتوصيل سريع. شكراً لكم.',
    date: '2024-01-05',
  },
];

interface ProductReviewsProps {
  productId: string;
  averageRating: number;
  reviewCount: number;
}

export function ProductReviews({ productId, averageRating, reviewCount }: ProductReviewsProps) {
  return (
    <div className="space-y-8">
      <h2 className="text-2xl font-bold">تقييمات العملاء</h2>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Summary */}
        <div className="md:col-span-1 space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-4xl font-bold">{averageRating.toFixed(1)}</span>
            <div className="flex flex-col">
              <div className="flex text-yellow-400">
                {[...Array(5)].map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(averageRating) ? 'fill-current' : 'text-muted'}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">{reviewCount} تقييم</span>
            </div>
          </div>

          <div className="space-y-2">
            {[5, 4, 3, 2, 1].map((stars) => (
              <div key={stars} className="flex items-center gap-2 text-sm">
                <span className="w-3">{stars}</span>
                <Star className="h-3 w-3 text-muted-foreground" />
                <div className="h-2 bg-muted rounded-full overflow-hidden flex-1">
                  <div className="h-full bg-yellow-400" style={{ width: `${stars === 5 ? 70 : stars === 4 ? 20 : 10}%` }} />
                </div>
                <span className="w-8 text-muted-foreground text-xs">
                  {stars === 5 ? '70%' : stars === 4 ? '20%' : '10%'}
                </span>
              </div>
            ))}
          </div>

          <Button className="w-full">أضف تقييمك</Button>
        </div>

        {/* Reviews List */}
        <div className="md:col-span-2 space-y-6">
          {MOCK_REVIEWS.map((review) => (
            <div key={review.id} className="space-y-2">
              <div className="flex items-start justify-between">
                <div>
                  <p className="font-semibold text-sm">{review.user}</p>
                  <div className="flex text-yellow-400">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-muted'}`}
                      />
                    ))}
                  </div>
                </div>
                <span className="text-xs text-muted-foreground">{review.date}</span>
              </div>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {review.comment}
              </p>
              <Separator />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
