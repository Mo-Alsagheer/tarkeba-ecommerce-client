'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ProductCard } from '@/components/products/ProductCard';
import { Hero } from '@/components/layout/Hero';
import { useGetFeaturedProductsQuery, useGetProductsQuery } from '@/features/api/productsApi';
import { useGetCategoriesQuery } from '@/features/api/categoriesApi';
import { ArrowLeft, Sparkles } from 'lucide-react';
import { TITLES, DESCRIPTIONS, BUTTONS, MESSAGES } from '@/constants';

export default function Home() {
  const { data: categories } = useGetCategoriesQuery();
  const { data: featuredProducts, isLoading: isFeaturedLoading } = useGetFeaturedProductsQuery();
  

  console.log('Featured products:', featuredProducts);
  
  // Find category IDs by slug
  const menCategory = categories?.find(cat => cat.slug === 'men-perfumes');
  const womenCategory = categories?.find(cat => cat.slug === 'women-perfumes');
  
  console.log('Men category:', menCategory);
  console.log('Women category:', womenCategory);
  
  const { data: menData, isLoading: isMenLoading } = useGetProductsQuery(
    menCategory ? { category: menCategory._id, limit: 4 } : undefined,
    { skip: !menCategory }
  );
  const { data: womenData, isLoading: isWomenLoading } = useGetProductsQuery(
    womenCategory ? { category: womenCategory._id, limit: 4 } : undefined,
    { skip: !womenCategory }
  );

  console.log('Men products data:', menData);
  console.log('Women products data:', womenData);

  const menProducts = menData?.products || [];
  const womenProducts = womenData?.products || [];

  const renderProductSection = (title: string, subtitle: string, products: any[], isLoading: boolean, link: string) => (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-3xl font-bold mb-2">{title}</h2>
            <p className="text-muted-foreground">{subtitle}</p>
          </div>
          <Button variant="ghost" asChild>
            <Link href={link}>
              {BUTTONS.VIEW_ALL}
              <ArrowLeft className="mr-2 h-4 w-4" />
            </Link>
          </Button>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="h-96 bg-muted animate-pulse rounded-lg" />
            ))}
          </div>
        ) : products && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.slice(0, 4).map((product: any) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-muted-foreground">{DESCRIPTIONS.PUBLIC.NO_PRODUCTS_CURRENTLY}</p>
          </div>
        )}
      </div>
    </section>
  );

  return (
    <div className="min-h-screen">
      <Hero />

      {/* Best Seller (Featured) */}
      {renderProductSection(
        TITLES.HOME.BEST_SELLERS,
        DESCRIPTIONS.PUBLIC.BEST_SELECTION,
        featuredProducts || [],
        isFeaturedLoading,
        "/products"
      )}

      {/* Categories Preview */}
      <section className="py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-2">{TITLES.HOME.BROWSE_BY_CATEGORY}</h2>
            <p className="text-muted-foreground">{TITLES.HOME.SELECT_FAVORITE_CATEGORY}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { slug: 'men-perfumes', name: 'عطور رجالية', image: 'https://res.cloudinary.com/drvgczmup/image/upload/v1769741914/men_Large_xyfc6d.png' },
              { slug: 'women-perfumes', name: 'عطور نسائية', image: 'https://res.cloudinary.com/drvgczmup/image/upload/v1769741910/women_Large_e5g3i9.png' },
              { slug: 'unisex-perfumes', name: 'عطور للجنسين', image: 'https://res.cloudinary.com/drvgczmup/image/upload/v1769741915/unisex_Large_jqxjog.png' }
            ].map((category) => {
              const cat = categories?.find(c => c.slug === category.slug);
              const href = cat ? `/products?category=${cat._id}` : '/products';
              return (
              <Link
                key={category.name}
                href={href}
                className="group relative aspect-[4/5] overflow-hidden rounded-xl border-0 shadow-lg hover:shadow-xl transition-all"
              >
                <Image
                  src={category.image}
                  alt={category.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent flex flex-col justify-end p-6">
                  <h3 className="text-white text-2xl font-bold mb-2 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300">
                    {category.name}
                  </h3>
                  <div className="h-1 w-12 bg-primary rounded-full transform scale-x-0 group-hover:scale-x-100 transition-transform duration-300 origin-left" />
                </div>
              </Link>
            );
            })}
          </div>
        </div>
      </section>

      {/* Men's Perfumes */}
      {renderProductSection(
        TITLES.HOME.MENS_PERFUMES,
        DESCRIPTIONS.PUBLIC.MENS_COLLECTION,
        menProducts,
        isMenLoading,
        menCategory ? `/products?category=${menCategory._id}` : '/products'
      )}

      {/* Women's Perfumes */}
      {renderProductSection(
        TITLES.HOME.WOMENS_PERFUMES,
        DESCRIPTIONS.PUBLIC.WOMENS_COLLECTION,
        womenProducts,
        isWomenLoading,
        womenCategory ? `/products?category=${womenCategory._id}` : '/products'
      )}
    </div>
  );
}


