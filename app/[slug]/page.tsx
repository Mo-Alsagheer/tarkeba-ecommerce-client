'use client';

import { use } from 'react';
import { useGetPageBySlugQuery } from '@/features/api/pagesApi';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { useEffect } from 'react';

export default function StaticPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = use(params);
  const { data: page, isLoading, error } = useGetPageBySlugQuery(slug);

  // Update page metadata
  useEffect(() => {
    if (page) {
      document.title = `${page.title} | تركيبة`;
      
      // Update meta description
      if (page.metaDescription) {
        let metaDesc = document.querySelector('meta[name="description"]');
        if (!metaDesc) {
          metaDesc = document.createElement('meta');
          metaDesc.setAttribute('name', 'description');
          document.head.appendChild(metaDesc);
        }
        metaDesc.setAttribute('content', page.metaDescription);
      }
    }
  }, [page]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto">
          <div className="animate-pulse space-y-4">
            <div className="h-10 bg-gray-200 rounded w-1/3"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-full"></div>
            <div className="h-4 bg-gray-200 rounded w-2/3"></div>
          </div>
        </div>
      </div>
    );
  }

  if (error || !page) {
    return (
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          <Card className="border-red-200 bg-red-50">
            <CardContent className="p-12">
              <h1 className="text-3xl font-bold mb-4 text-red-600">الصفحة غير موجودة</h1>
              <p className="text-red-600 mb-6">عذراً، الصفحة التي تبحث عنها غير متوفرة</p>
              <Link href="/">
                <Button>
                  العودة للرئيسية
                  <ArrowRight className="h-4 w-4 mr-2" />
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-4xl mx-auto">
        <article>
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4">{page.title}</h1>
            {page.metaDescription && (
              <p className="text-lg text-muted-foreground">{page.metaDescription}</p>
            )}
          </header>
          
          <div 
            className="prose prose-lg max-w-none"
            dangerouslySetInnerHTML={{ __html: page.content }}
          />
          
          <footer className="mt-12 pt-6 border-t">
            <p className="text-sm text-muted-foreground">
              آخر تحديث: {new Date(page.updatedAt).toLocaleDateString('ar-SA', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </p>
          </footer>
        </article>
      </div>
    </div>
  );
}
