'use client';

import Link from 'next/link';
import Image from 'next/image';
import { useRouter, usePathname } from 'next/navigation';
import { ShoppingCart, User, LogOut, Search, Menu, Facebook, Instagram, Twitter } from 'lucide-react';
import { useAppDispatch, useAppSelector } from '@/lib/hooks';
import { selectIsAuthenticated, selectCurrentUser, logout } from '@/features/auth/authSlice';
import { selectCartTotalItems } from '@/features/cart/cartSlice';
import { useLogoutMutation } from '@/features/api/authApi';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { Separator } from '@/components/ui/separator';
import { useState, useEffect, useRef } from 'react';
import { CartDrawer } from '@/components/Cart/CartDrawer';
import { cn } from '@/lib/utils';
import { deleteSession } from '@/app/actions/auth';

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const dispatch = useAppDispatch();
  const isAuthenticated = useAppSelector(selectIsAuthenticated);
  const user = useAppSelector(selectCurrentUser);
  const cartItemsCount = useAppSelector(selectCartTotalItems);
  const [logoutMutation] = useLogoutMutation();
  const [cartOpen, setCartOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const lastScrollY = useRef(0);
  const isHomePage = pathname === '/';

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const threshold = isHomePage ? window.innerHeight : 0;

      if (currentScrollY < threshold) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY.current) {
        setIsVisible(false);
      } else {
        setIsVisible(true);
      }

      setIsScrolled(currentScrollY > threshold);
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isHomePage]);

  const handleLogout = async () => {
    try {
      await logoutMutation().unwrap();
      dispatch(logout());
      await deleteSession();
      router.push('/');
    } catch {
      // Handle error silently
    }
  };

  return (
    <>
      <header 
        className={cn(
          "w-full z-50 transition-all duration-300",
          !isVisible && "opacity-0 -translate-y-4 pointer-events-none",
          isHomePage 
            ? (isScrolled && isVisible
                ? "fixed top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60" 
                : "absolute top-0 bg-transparent border-transparent")
            : "sticky top-0 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60"
        )}
      >
        <div className="container mx-auto flex items-center justify-between px-4 py-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/logo.png"
              alt="تركيبة"
              width={100}
              height={100}
              className="rounded-full"
            />
          </Link>

          {/* Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link href="/products" className="text-sm font-medium hover:text-primary transition-colors">
              المنتجات
            </Link>
            <Link href="/categories" className="text-sm font-medium hover:text-primary transition-colors">
              الفئات
            </Link>
            <Link href="/about-us" className="text-sm font-medium hover:text-primary transition-colors">
              من نحن
            </Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-3">
            {/* Search */}
            <Button variant="ghost" size="icon" onClick={() => router.push('/products')}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Cart */}
            <Button
              variant="ghost"
              size="icon"
              className="relative"
              onClick={() => setCartOpen(true)}
            >
              <ShoppingCart className="h-5 w-5" />
              {cartItemsCount > 0 && (
                <Badge
                  variant="default"
                  className="absolute -top-1 -left-1 h-5 w-5 flex items-center justify-center p-0 text-xs"
                >
                  {cartItemsCount}
                </Badge>
              )}
            </Button>

            {/* User Menu */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2">
                    <User className="h-5 w-5" />
                    <span className="hidden md:inline-block text-sm font-medium">
                      {(user.name || 'User').split(' ')[0]}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.name}</p>
                    <p className="text-xs text-muted-foreground">{user.email}</p>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={() => router.push('/account/profile')}>
                    الملف الشخصي
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account/orders')}>
                    طلباتي
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => router.push('/account/reviews')}>
                    تقييماتي
                  </DropdownMenuItem>
                  {user.roles.includes('admin') && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem onClick={() => router.push('/admin/dashboard')}>
                        لوحة التحكم
                      </DropdownMenuItem>
                    </>
                  )}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <LogOut className="ms-2 h-4 w-4" />
                    تسجيل الخروج
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link href="/login">
                <Button size="sm">تسجيل الدخول</Button>
              </Link>
            )}

            {/* Mobile Menu */}
            <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <div className="flex flex-col mt-6 h-full">
                  <div className="flex justify-center mb-2">
                    <Link
                      href="/"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <Image
                        src="/logo.png"
                        alt="تركيبة"
                        width={110}
                        height={110}
                        className="rounded-full"
                      />
                    </Link>
                  </div>

                  <Separator />

                  

                  <Separator />

                  <div className="flex flex-col py-4 gap-2">
                    <Link
                      href="/products"
                      className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-right"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      المنتجات
                    </Link>
                    <Link
                      href="/categories"
                      className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-right"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      الفئات
                    </Link>
                    <Link
                      href="/about-us"
                      className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-right"
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      من نحن
                    </Link>
                  </div>

                  

                  <div className="flex flex-col py-4 gap-2">
                    {isAuthenticated && user ? (
                      <>
                        <div className="flex items-center justify-end px-4 mb-2 gap-2 text-primary">
                          <span className="text-sm font-medium">{user.name}</span>
                          <User className="h-4 w-4" />
                        </div>
                        <Link
                          href="/account/profile"
                          className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-right"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          الملف الشخصي
                        </Link>
                        <Link
                          href="/account/orders"
                          className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-right"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          طلباتي
                        </Link>
                        {user.roles.includes('admin') && (
                          <Link
                            href="/admin/dashboard"
                            className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-right"
                            onClick={() => setMobileMenuOpen(false)}
                          >
                            لوحة التحكم
                          </Link>
                        )}
                        <button
                          onClick={() => {
                            setMobileMenuOpen(false);
                            handleLogout();
                          }}
                          className="text-lg font-medium hover:bg-accent hover:text-accent-foreground px-4 py-2 rounded-md transition-colors text-right w-full flex justify-end items-center gap-2 text-red-500"
                        >
                          تسجيل الخروج
                          <LogOut className="h-4 w-4" />
                        </button>
                      </>
                    ) : (
                      <div className="px-2 mt-2">
                        <Link
                          href="/login"
                          className="flex items-center justify-center w-full bg-primary text-primary-foreground hover:bg-primary/90 rounded-md px-4 py-2.5 text-lg font-medium transition-colors shadow-sm"
                          onClick={() => setMobileMenuOpen(false)}
                        >
                          تسجيل الدخول
                        </Link>
                      </div>
                    )}
                  </div>

                  <Separator />

                  <div className="flex flex-col py-4 gap-2 mt-auto">
                    <h4 className="text-sm font-medium text-muted-foreground text-center mb-4">تابعنا على</h4>
                    <div className="flex justify-center gap-6">
                      <Link href="https://www.instagram.com/tarkeba_perfume/" className="text-muted-foreground hover:text-primary transition-colors">
                        <Instagram className="h-6 w-6" />
                      </Link>
                      <Link href="#" className="text-muted-foreground hover:text-primary transition-colors">
                        <Facebook className="h-6 w-6" />
                      </Link>
                      <Link href="https://tiktok.com" target="_blank" className="text-muted-foreground hover:text-primary transition-colors">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-5 w-5"
                >
                  <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                </svg>
              </Link>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <CartDrawer open={cartOpen} onOpenChange={setCartOpen} />
    </>
  );
}
