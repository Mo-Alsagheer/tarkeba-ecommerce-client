'use client';

import { use } from 'react';
import { useGetProductByIdQuery, useGetProductBySlugQuery } from '@/features/api/productsApi';
import { useAppDispatch } from '@/lib/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { ShoppingCart, Star, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { TITLES, BUTTONS, MESSAGES, CURRENCY, LABELS } from '@/constants';
import Head from 'next/head';
import { useSearchParams } from 'next/navigation';

import { ProductReviews } from '@/components/products/ProductReviews';

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const searchParams = useSearchParams();
  const shouldOpenReviewForm = searchParams.get('review') === 'true';
  const orderId = searchParams.get('orderId') || undefined;
  
  // Try to fetch by slug first, if it fails, fetch by ID
  const { data: productBySlug, isLoading: isLoadingSlug, error: slugError } = useGetProductBySlugQuery(id, {
    skip: false,
  });
  const { data: productById, isLoading: isLoadingId } = useGetProductByIdQuery(id, {
    skip: !slugError, // Only fetch by ID if slug query failed
  });
  
  const product = productBySlug || productById;
  const isLoading = isLoadingSlug || isLoadingId;
  const dispatch = useAppDispatch();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(0);
  const [selectedVariantIndex, setSelectedVariantIndex] = useState(0);

  // Update page title and meta description when product loads
  useEffect(() => {
    if (product) {
      // Use SEO title if available, otherwise use product name
      const pageTitle = product.seo?.title || `${product.name} | تركيبة`;
      document.title = pageTitle;
      
      // Update meta description if available
      const metaDescription = product.seo?.description || product.description;
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', metaDescription);
      
      // Update meta keywords if available
      if (product.seo?.keywords && product.seo.keywords.length > 0) {
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsTag) {
          keywordsTag = document.createElement('meta');
          keywordsTag.setAttribute('name', 'keywords');
          document.head.appendChild(keywordsTag);
        }
        keywordsTag.setAttribute('content', product.seo.keywords.join(', '));
      }
      
      // Open Graph tags
      const updateOGTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };
      
      updateOGTag('og:title', product.seo?.title || product.name);
      updateOGTag('og:description', product.seo?.description || product.description);
      updateOGTag('og:image', product.images[0] || '');
      updateOGTag('og:type', 'product');
    }
  }, [product]);

  // Update page title and meta description when product loads
  useEffect(() => {
    if (product) {
      // Use SEO title if available, otherwise use product name
      const pageTitle = product.seo?.title || `${product.name} | تركيبة`;
      document.title = pageTitle;
      
      // Update meta description if available
      const metaDescription = product.seo?.description || product.description;
      let descTag = document.querySelector('meta[name="description"]');
      if (!descTag) {
        descTag = document.createElement('meta');
        descTag.setAttribute('name', 'description');
        document.head.appendChild(descTag);
      }
      descTag.setAttribute('content', metaDescription);
      
      // Update meta keywords if available
      if (product.seo?.keywords && product.seo.keywords.length > 0) {
        let keywordsTag = document.querySelector('meta[name="keywords"]');
        if (!keywordsTag) {
          keywordsTag = document.createElement('meta');
          keywordsTag.setAttribute('name', 'keywords');
          document.head.appendChild(keywordsTag);
        }
        keywordsTag.setAttribute('content', product.seo.keywords.join(', '));
      }
      
      // Open Graph tags
      const updateOGTag = (property: string, content: string) => {
        let tag = document.querySelector(`meta[property="${property}"]`);
        if (!tag) {
          tag = document.createElement('meta');
          tag.setAttribute('property', property);
          document.head.appendChild(tag);
        }
        tag.setAttribute('content', content);
      };
      
      updateOGTag('og:title', product.seo?.title || product.name);
      updateOGTag('og:description', product.seo?.description || product.description);
      updateOGTag('og:image', product.images[0] || '');
      updateOGTag('og:type', 'product');
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!product) return;
    
    const variant = product.variants?.[selectedVariantIndex];
    const price = variant ? variant.price : product.price;
    const stock = variant ? variant.stock : product.stock;
    const name = variant ? `${product.name} - ${variant.size}` : product.name;
    // Use composite ID for variants to allow different sizes in cart
    const productId = variant ? `${product._id}-${variant.size}` : product._id;

    dispatch(
      addToCart({
        productId,
        name,
        price,
        quantity,
        image: product.images[0] || '/placeholder.png',
        stock,
      })
    );
    
    toast.success(MESSAGES.SUCCESS.PRODUCT_ADDED_TO_CART);
  };

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="grid md:grid-cols-2 gap-8 animate-pulse">
          <div className="aspect-square bg-muted rounded-lg" />
          <div className="space-y-4">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-4 bg-muted rounded w-1/2" />
            <div className="h-20 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">{TITLES.COMPONENTS.PRODUCT_NOT_FOUND}</h1>
        <Link href="/products">
          <Button>{BUTTONS.BACK_TO_PRODUCTS}</Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <Link href="/products" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-6">
        <ArrowRight className="h-4 w-4 ml-1" />
        {BUTTONS.BACK_TO_PRODUCTS}
      </Link>

      <div className="grid md:grid-cols-2 gap-8">
        {/* Images */}
        <div className="space-y-4">
          <div className="relative aspect-square bg-muted rounded-lg overflow-hidden">
            <Image
              src={product.images[selectedImage] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover"
              priority
            />
            {product.isFeatured && (
              <Badge className="absolute top-4 right-4">{LABELS.PRODUCT_DETAIL.FEATURED}</Badge>
            )}
          </div>
          
          {product.images.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`relative aspect-square rounded-md overflow-hidden border-2 ${
                    selectedImage === idx ? 'border-primary' : 'border-transparent'
                  }`}
                >
                  <Image src={img} alt="" fill className="object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1">
                <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                <span className="font-medium">{product.averageRating.toFixed(1)}</span>
              </div>
              <span className="text-sm text-muted-foreground">
                {MESSAGES.INFO.REVIEWS_COUNT(product.reviewCount)}
              </span>
            </div>
          </div>

          <Separator />

          <div>
            <p className="text-4xl font-bold text-primary">
              {product.variants?.[selectedVariantIndex]?.price || product.price} {CURRENCY.DEFAULT}
            </p>
            <p className="text-sm text-muted-foreground mt-1">
              {(product.variants?.[selectedVariantIndex]?.stock || product.stock) > 0 
                ? MESSAGES.INFO.AVAILABLE_STOCK(product.variants?.[selectedVariantIndex]?.stock || product.stock)
                : MESSAGES.INFO.OUT_OF_STOCK}
            </p>
          </div>

          <Separator />

          <div>
            <h3 className="font-semibold mb-2">{TITLES.COMPONENTS.DESCRIPTION}</h3>
            <p className="text-muted-foreground leading-relaxed">{product.description}</p>
          </div>

          {product.variants && product.variants.length > 0 && (
            <div>
              <h3 className="font-semibold mb-2">{TITLES.COMPONENTS.SIZE_SELECTION}</h3>
              <div className="flex gap-2">
                {product.variants.map((variant, idx) => (
                  <Button
                    key={idx}
                    variant={selectedVariantIndex === idx ? "default" : "outline"}
                    onClick={() => {
                      setSelectedVariantIndex(idx);
                      setQuantity(1); // Reset quantity when changing variant
                    }}
                    className="min-w-[80px]"
                  >
                    {variant.size}
                  </Button>
                ))}
              </div>
            </div>
          )}

          {product.category && typeof product.category === 'object' && product.category.name && (
            <div>
              <h3 className="font-semibold mb-2">{TITLES.COMPONENTS.CATEGORY}</h3>
              <Badge variant="secondary">{product.category.name}</Badge>
            </div>
          )}

          <Separator />

          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <label className="font-medium">{TITLES.COMPONENTS.QUANTITY}:</label>
              <div className="flex items-center gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => Math.max(1, q - 1))}
                >
                  -
                </Button>
                <span className="w-12 text-center font-medium">{quantity}</span>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setQuantity(q => Math.min((product.variants?.[selectedVariantIndex]?.stock || product.stock), q + 1))}
                  disabled={quantity >= (product.variants?.[selectedVariantIndex]?.stock || product.stock)}
                >
                  +
                </Button>
              </div>
            </div>

            <Button
              size="lg"
              className="w-full"
              onClick={handleAddToCart}
              disabled={(product.variants?.[selectedVariantIndex]?.stock || product.stock) === 0}
            >
              <ShoppingCart className="h-5 w-5 ms-2" />
              {(product.variants?.[selectedVariantIndex]?.stock || product.stock) === 0 ? MESSAGES.INFO.OUT_OF_STOCK : BUTTONS.ADD_TO_CART}
            </Button>
          </div>
        </div>
      </div>

      <Separator className="my-12" />
      
      <ProductReviews 
        productId={product._id}
        averageRating={product.averageRating}
        reviewCount={product.reviewCount}
        openReviewForm={shouldOpenReviewForm}
        orderId={orderId}
      />
    </div>
  );
}
