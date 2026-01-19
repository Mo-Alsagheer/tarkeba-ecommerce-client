'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';

export default function AddressesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">عناويني</h2>
        <Button>
          <Plus className="h-4 w-4 ms-2" />
          إضافة عنوان جديد
        </Button>
      </div>

      <Card>
        <CardContent className="text-center py-12">
          <p className="text-muted-foreground">لا توجد عناوين محفوظة</p>
        </CardContent>
      </Card>
    </div>
  );
}
