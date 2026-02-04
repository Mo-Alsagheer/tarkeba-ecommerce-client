'use client';

import { useGetCategoriesQuery } from '@/features/api/categoriesApi';
import { Card, CardContent } from '@/components/ui/card';
import Link from 'next/link';
import Image from 'next/image';
import { PackageSearch } from 'lucide-react';
import { TITLES, DESCRIPTIONS } from '@/constants';

export default function CategoriesPage() {
  const { data: categories, isLoading } = useGetCategoriesQuery();

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">{TITLES.PUBLIC.CATEGORIES}</h1>
        <p className="text-muted-foreground">{DESCRIPTIONS.PUBLIC.CATEGORIES}</p>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[...Array(8)].map((_, i) => (
            <div key={i} className="h-48 bg-muted animate-pulse rounded-lg" />
          ))}
        </div>
      ) : categories && categories.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {categories
            .filter((category) => category.isActive !== false)
            .sort((a, b) => (a.sortOrder || 0) - (b.sortOrder || 0))
            .map((category) => (
                console.log('Category:', category),
              <Link
                key={category._id}
                href={`/products?category=${category._id}`}
              >
                <Card className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer h-full">
                  <div className="relative h-40 bg-gradient-to-br from-primary/10 to-primary/5">
                    {category.image ? (
                      <Image
                        src={category.image}
                        alt={category.name}
                        fill
                        className="object-cover"
                      />
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <PackageSearch className="h-16 w-16 text-muted-foreground/30" />
                      </div>
                    )}
                  </div>
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-lg mb-2">{category.name}</h3>
                    {category.description && (
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {category.description}
                      </p>
                    )}
                    {category.tags && category.tags.length > 0 && (
                      <div className="flex flex-wrap gap-1 mt-2">
                        {category.tags.slice(0, 3).map((tag, idx) => (
                          <span
                            key={idx}
                            className="text-xs bg-secondary px-2 py-0.5 rounded-full"
                          >
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </Link>
            ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <PackageSearch className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">لا توجد فئات متاحة</p>
        </div>
      )}
    </div>
  );
}
