"use client";

import Image from "next/image";
import Link from "next/link";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ShoppingCart, Star } from "lucide-react";
import { useAppDispatch } from "@/lib/hooks";
import { addToCart } from "@/features/cart/cartSlice";
import type { Product } from "@/features/api/productsApi";
import { toast } from "sonner";
import { MESSAGES, BUTTONS, STATUS } from "@/constants";

interface ProductCardProps {
  product: Product;
}

export function ProductCard({ product }: ProductCardProps) {
  const dispatch = useAppDispatch();

  // A product is out of stock if:
  // - It has variants and ALL of them have stock === 0
  // - It has no variants and base stock === 0
  const isOutOfStock =
    product.variants && product.variants.length > 0
      ? product.variants.every((v) => v.stock === 0)
      : product.stock === 0;

  // Find the first in-stock variant (or fall back to first variant)
  const firstAvailableVariant =
    product.variants?.find((v) => v.stock > 0) ?? product.variants?.[0];

  const displayPrice = firstAvailableVariant?.price ?? product.price;
  const displayComparePrice = firstAvailableVariant?.comparePrice;
  const displayStock = firstAvailableVariant?.stock ?? product.stock;

  // Calculate discount percentage
  const hasDiscount = displayComparePrice && displayComparePrice > displayPrice;
  const discountPercentage = hasDiscount
    ? Math.round(
        ((displayComparePrice - displayPrice) / displayComparePrice) * 100,
      )
    : 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isOutOfStock) return;

    dispatch(
      addToCart({
        productId: product._id,
        name: product.name,
        price: displayPrice,
        quantity: 1,
        image: product.images[0] || "/placeholder.png",
        stock: displayStock,
      }),
    );

    toast.success(MESSAGES.SUCCESS.PRODUCT_ADDED_TO_CART);
  };

  return (
    <Link
      href={`/products/${product.slug || product._id}`}
      className="h-full flex flex-col"
    >
      <Card className="flex flex-col justify-between h-full hover:shadow-lg transition-shadow duration-300 py-0 overflow-hidden">
        <CardContent className="p-0 flex flex-col flex-1">
          <div className="relative aspect-square overflow-hidden rounded-t-lg bg-muted">
            <Image
              src={product.images[0] || "/placeholder.png"}
              alt={product.name}
              fill
              className="object-cover group-hover:scale-105 transition-transform duration-300"
            />
            {product.isFeatured && !isOutOfStock && (
              <Badge className="absolute top-2 right-2">
                {STATUS.PRODUCT.FEATURED}
              </Badge>
            )}
            {!isOutOfStock && hasDiscount && (
              <Badge variant="destructive" className="absolute top-2 left-2">
                {discountPercentage}% {STATUS.PRODUCT.ON_SALE}
              </Badge>
            )}
            {isOutOfStock && (
              <Badge variant="destructive" className="absolute top-2 right-2">
                {STATUS.PRODUCT.OUT_OF_STOCK}
              </Badge>
            )}
          </div>

          <div className="p-3 pb-0 sm:p-4 space-y-1 sm:space-y-2 flex-1 flex flex-col">
            <h3 className="font-semibold text-lg line-clamp-1">
              {product.name}
            </h3>
            <p className="text-sm text-muted-foreground line-clamp-2 flex-1 min-h-10">
              {product.description}
            </p>

            <div className="flex items-center gap-1 mt-auto pt-2">
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

        <CardFooter className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between p-3 sm:p-4 pt-0 gap-2 sm:gap-3">
          <div className="flex flex-row-reverse sm:flex-row gap-1.5 sm:gap-2 items-baseline sm:items-center flex-wrap justify-between sm:justify-start">
            <p
              className={`text-xl font-bold ${isOutOfStock ? "text-muted-foreground" : "text-primary"}`}
            >
              {displayPrice} EGP
            </p>
            {!isOutOfStock &&
              displayComparePrice &&
              displayComparePrice > displayPrice && (
                <p className="text-sm text-muted-foreground line-through">
                  {displayComparePrice} EGP
                </p>
              )}
          </div>

          <Button
            size="sm"
            onClick={handleAddToCart}
            disabled={isOutOfStock}
            variant={isOutOfStock ? "outline" : "default"}
            className="w-full sm:w-auto"
          >
            <ShoppingCart className="h-4 w-4 ms-1" />
            {isOutOfStock ? STATUS.PRODUCT.OUT_OF_STOCK : BUTTONS.ADD_TO_CART}
          </Button>
        </CardFooter>
      </Card>
    </Link>
  );
}
