"use client";

import { useAppDispatch, useAppSelector } from "@/lib/hooks";
import {
    selectCartItems,
    selectCartTotal,
    selectCartTotalPrice,
    selectAppliedCoupon,
    removeFromCart,
    updateQuantity,
} from "@/features/cart/cartSlice";
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetClose,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import Image from "next/image";
import { Trash2, Plus, Minus, X, ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";
import { TITLES, BUTTONS, LABELS, DESCRIPTIONS, MESSAGES } from "@/constants";

interface CartDrawerProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

export function CartDrawer({ open, onOpenChange }: CartDrawerProps) {
    const dispatch = useAppDispatch();
    const router = useRouter();
    const items = useAppSelector(selectCartItems);
    const totalPrice = useAppSelector(selectCartTotalPrice);
    const total = useAppSelector(selectCartTotal);
    const appliedCoupon = useAppSelector(selectAppliedCoupon);

    const handleRemove = (productId: string) => {
        dispatch(removeFromCart(productId));
    };

    const handleUpdateQuantity = (productId: string, newQuantity: number) => {
        dispatch(updateQuantity({ productId, quantity: newQuantity }));
    };

    const handleCheckout = () => {
        onOpenChange(false);
        router.push("/checkout");
    };

    if (items.length === 0) {
        return (
            <Sheet open={open} onOpenChange={onOpenChange}>
                <SheetContent side="left" className="w-full sm:max-w-lg flex flex-col p-4">
                    <SheetHeader className="flex-row items-center justify-between space-y-0">
                        <SheetTitle>{TITLES.COMPONENTS.SHOPPING_CART}</SheetTitle>
                        <SheetClose asChild>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="-ml-2"
                            >
                                <X className="h-4 w-4" />
                                <span className="sr-only">Close</span>
                            </Button>
                        </SheetClose>
                    </SheetHeader>
                    <div className="flex flex-col items-center justify-center h-full z-0 -mt-20">
                        <div className="text-center space-y-4">
                            <div className="flex items-center justify-center">
                                <ShoppingCart size={64} />
                            </div>
                            <h3 className="text-lg font-semibold">
                                {TITLES.COMPONENTS.CART_EMPTY}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {DESCRIPTIONS.CART.EMPTY}
                            </p>
                            <Button
                                onClick={() => {
                                    onOpenChange(false);
                                    router.push("/products");
                                }}
                            >
                                {BUTTONS.BROWSE_PRODUCTS}
                            </Button>
                        </div>
                    </div>
                </SheetContent>
            </Sheet>
        );
    }

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetContent
                side="left"
                className="w-full sm:max-w-lg flex flex-col p-4"
            >
                <SheetHeader className="flex-row items-center justify-between space-y-0">
                    <SheetTitle>{LABELS.CART.CART_ITEMS} ({items.length})</SheetTitle>
                    <SheetClose asChild>
                        <Button variant="ghost" size="icon" className="-ml-2">
                            <X className="h-4 w-4" />
                            <span className="sr-only">Close</span>
                        </Button>
                    </SheetClose>
                </SheetHeader>

                <div className="flex-1 overflow-y-auto py-4 space-y-4">
                    {items.map((item) => (
                        <div key={item.productId} className="flex gap-4">
                            <div className="relative h-20 w-20 rounded-md overflow-hidden bg-muted">
                                <Image
                                    src={item.image}
                                    alt={item.name}
                                    fill
                                    className="object-cover"
                                />
                            </div>

                            <div className="flex-1 space-y-2">
                                <h4 className="font-medium text-sm line-clamp-1">
                                    {item.name}
                                </h4>
                                <p className="text-sm font-semibold">
                                    {item.price} EGP
                                </p>

                                <div className="flex items-center gap-2">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                item.productId,
                                                item.quantity - 1
                                            )
                                        }
                                        disabled={item.quantity <= 1}
                                    >
                                        <Minus className="h-3 w-3" />
                                    </Button>
                                    <span className="text-sm font-medium w-8 text-center">
                                        {item.quantity}
                                    </span>
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="h-7 w-7"
                                        onClick={() =>
                                            handleUpdateQuantity(
                                                item.productId,
                                                item.quantity + 1
                                            )
                                        }
                                        disabled={item.quantity >= item.stock}
                                    >
                                        <Plus className="h-3 w-3" />
                                    </Button>
                                </div>
                            </div>

                            <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleRemove(item.productId)}
                            >
                                <Trash2 className="h-4 w-4 text-destructive" />
                            </Button>
                        </div>
                    ))}
                </div>

                <div className="space-y-4 pt-4 border-t">
                    {appliedCoupon && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">
                                {LABELS.CART.COUPON}
                            </span>
                            <Badge variant="secondary">
                                {appliedCoupon.code}
                            </Badge>
                        </div>
                    )}

                    <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">
                            {LABELS.CART.SUBTOTAL}
                        </span>
                        <span className="font-medium">
                            {totalPrice.toFixed(2)} EGP
                        </span>
                    </div>

                    {appliedCoupon && (
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-muted-foreground">{LABELS.CART.DISCOUNT}</span>
                            <span className="font-medium text-green-600">
                                -{appliedCoupon.discount.toFixed(2)} EGP
                            </span>
                        </div>
                    )}

                    <Separator />

                    <div className="flex items-center justify-between">
                        <span className="text-lg font-semibold">{LABELS.CART.TOTAL}</span>
                        <span className="text-lg font-bold text-primary">
                            {total.toFixed(2)} EGP
                        </span>
                    </div>

                    <Button
                        className="w-full"
                        size="lg"
                        onClick={handleCheckout}
                    >
                        {BUTTONS.COMPLETE_ORDER}
                    </Button>

                    <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => {
                            onOpenChange(false);
                            router.push("/products");
                        }}
                    >
                        {BUTTONS.CONTINUE_SHOPPING}
                    </Button>
                </div>
            </SheetContent>
        </Sheet>
    );
}
