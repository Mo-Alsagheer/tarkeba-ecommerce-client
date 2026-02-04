'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShoppingCart, Star } from 'lucide-react';
import { useAppDispatch } from '@/lib/hooks';
import { addToCart } from '@/features/cart/cartSlice';
import type { Product } from '@/features/api/productsApi';
import { toast } from 'sonner';
import { MESSAGES, BUTTONS, LABELS, STATUS } from '@/constants';

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // Get price from variant or base price
    const productPrice = product.variants?.[0]?.price || product.price;
    const productStock = product.variants?.[0]?.stock || product.stock;
    
    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: productPrice,
        quantity: 1,
        image: product.images[0] || '/placeholder.png',
        stock: productStock,
      })
    );
    
    toast.success(MESSAGES.SUCCESS.PRODUCT_ADDED_TO_CART);
  };

  return (
    <Link href={`/products/${product.slug || product._id}`}>
      <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300 py-0">
        <CardContent className="p-0">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
            <Image
              src={product.images[0] || '/placeholder.png'}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.isFeatured && (
              <Badge className="absolute top-2 right-2">{STATUS.PRODUCT.FEATURED}</Badge>
            )}
            {product.stock === 0 && (
              <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
                <Badge variant="destructive">{STATUS.PRODUCT.OUT_OF_STOCK}</Badge>
              </div>
            )}
          </div>

          <div className="p-4 space-y-2">
            <h3 className="font-semibold text-lg line-clamp-1">{product.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-2">
              {product.description}
            </p>
            
            <div className="flex items-center gap-1">
              <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
              <span className="text-sm font-medium">
                {product.averageRating.toFixed(1)}
              </span>
              <span className="text-xs text-muted-foreground">
                ({product.reviewCount})
              </span>
            </div>
          </div>
        </CardContent>

        <CardFooter className="flex items-center justify-between p-4 pt-0">
          <div className="flex gap-3 items-center">
            <p className="text-xl font-bold text-primary">{product.variants?.[0]?.price || product.price } EGP</p>
            {product.variants?.[0]?.comparePrice && product.variants[0].comparePrice > product.price && (
              <p className="text-sm text-muted-foreground line-through">
                {product.variants[0].comparePrice} EGP
              </p>
            )}
          </div>
          
          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={product.stock === 0}
          >
            <ShoppingCart className="h-4 w-4 ms-1" />
            {BUTTONS.ADD_TO_CART}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
