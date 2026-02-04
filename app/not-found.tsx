import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Home, Search, Package, ArrowRight } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex items-center justify-center px-4">
      <div className="max-w-2xl w-full text-center space-y-8">
        {/* 404 Illustration */}
        <div className="relative">
          <div className="text-[150px] md:text-[200px] font-bold text-primary/10 leading-none select-none">
            404
          </div>
          <div className="absolute inset-0 flex items-center justify-center">
            {/* <Package className="h-24 w-24 md:h-32 md:w-32 text-primary/30 animate-bounce" /> */}
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h1 className="text-3xl md:text-4xl font-bold text-foreground">
            الصفحة غير موجودة
          </h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            عذراً، الصفحة التي تبحث عنها غير موجودة أو تم نقلها إلى موقع آخر
          </p>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/">
            <Button size="lg" className="w-full sm:w-auto">
              <Home className="ml-2 h-5 w-5" />
              العودة للرئيسية
            </Button>
          </Link>
          <Link href="/products">
            <Button size="lg" variant="outline" className="w-full sm:w-auto">
              <Package className="ml-2 h-5 w-5" />
              تصفح المنتجات
            </Button>
          </Link>
        </div>

        {/* Popular Links */}
        <div className="pt-8 border-t">
          <h3 className="text-sm font-semibold text-muted-foreground mb-4">
            روابط مفيدة
          </h3>
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/categories" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              الفئات
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link 
              href="/account/orders" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              طلباتي
              <ArrowRight className="h-3 w-3" />
            </Link>
            <Link 
              href="/account/profile" 
              className="text-sm text-primary hover:underline flex items-center gap-1"
            >
              الملف الشخصي
              <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Search Suggestion */}
        <div className="pt-4">
          <p className="text-sm text-muted-foreground mb-3">
            أو ابحث عن ما تريد
          </p>
          <Link href="/products">
            <Button variant="ghost" size="sm" className="gap-2">
              <Search className="h-4 w-4" />
              البحث في المنتجات
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
