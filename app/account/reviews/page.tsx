'use client';

import { Card, CardContent } from '@/components/ui/card';

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">تقييماتي</h2>

      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">لم تقم بتقييم أي منتجات بعد</p>
        </CardContent>
      </Card>
    </div>
  );
}
