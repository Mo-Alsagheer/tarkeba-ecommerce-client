"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/features/api/productsApi";
import { useGetCategoriesQuery } from "@/features/api/categoriesApi";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, SlidersHorizontal } from "lucide-react";
import { TITLES, DESCRIPTIONS, LABELS, PLACEHOLDERS } from "@/constants";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Pagination,
    PaginationContent,
    PaginationItem,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

export default function ProductsPage() {
    const searchParams = useSearchParams();
    const categoryFromUrl = searchParams.get("category");

    const [search, setSearch] = useState("");
    const [debouncedSearch, setDebouncedSearch] = useState("");
    const [selectedCategories, setSelectedCategories] = useState<string[]>(() =>
        categoryFromUrl ? [categoryFromUrl] : []
    );
    const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
    const [priceRange, setPriceRange] = useState([0, 5000]);
    const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 5000]);
    const [sort, setSort] = useState("default");
    const [page, setPage] = useState(1);

    // Handle search debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedSearch(search);
            if (search !== debouncedSearch) {
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [search, debouncedSearch]);

    // Handle price range debounce
    useEffect(() => {
        const timer = setTimeout(() => {
            setDebouncedPriceRange(priceRange);
            if (priceRange[0] !== debouncedPriceRange[0] || priceRange[1] !== debouncedPriceRange[1]) {
                setPage(1);
            }
        }, 500);

        return () => clearTimeout(timer);
    }, [priceRange, debouncedPriceRange]);

    const availableSizes = ["30ml", "50ml", "75ml", "100ml", "150ml"];

    const { data: categoriesData } = useGetCategoriesQuery();
    
    // Check if we are filtering by category on the server side
    const serverCategoryFilter = selectedCategories.length > 0 ? selectedCategories[0] : undefined;
    
    const { data, isLoading } = useGetProductsQuery({
        search: debouncedSearch,
        category: serverCategoryFilter,
        minPrice: debouncedPriceRange[0],
        maxPrice: debouncedPriceRange[1],
        sort: sort === "default" ? undefined : sort,
        page,
        limit: 15,
    });

    console.log("Products Data:", data);

    const toggleCategory = (categoryId: string) => {
        setSelectedCategories((prev) =>
            prev.includes(categoryId)
                ? prev.filter((id) => id !== categoryId)
                : [...prev, categoryId],
        );
        setPage(1);
    };

    const toggleSize = (sizeValue: string) => {
        setSelectedSizes((prev) =>
            prev.includes(sizeValue)
                ? prev.filter((s) => s !== sizeValue)
                : [...prev, sizeValue],
        );
        setPage(1);
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-4xl font-bold mb-2">{TITLES.PUBLIC.ALL_PRODUCTS}</h1>
                <p className="text-muted-foreground">
                    {DESCRIPTIONS.PUBLIC.ALL_PRODUCTS}
                </p>
            </div>

            {/* Filters */}
            <div className="grid md:grid-cols-4 gap-6">
                <div className="md:col-span-1 space-y-6">
                    <div className="space-y-3 p-4 border rounded-lg">
                        <h3 className="font-semibold flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            {LABELS.SECTIONS.SEARCH_FILTER}
                        </h3>

                        <div className="relative">
                            <Input
                                placeholder={PLACEHOLDERS.SEARCH.PRODUCTS}
                                className="pe-10"
                                value={search}
                                onChange={(e) => setSearch(e.target.value)}
                            />
                            <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                نطاق السعر
                            </label>
                            <Slider
                                value={priceRange}
                                onValueChange={setPriceRange}
                                max={5000}
                                step={10}
                                className="mt-2"
                                dir="rtl"
                            />
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>{priceRange[0]} EGP</span>
                                <span>{priceRange[1]} EGP</span>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">الفئة</label>
                            <div className="space-y-2 max-h-48">
                                {categoriesData?.map((cat) => (
                                    <div
                                        key={cat._id}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`category-${cat._id}`}
                                            checked={selectedCategories.includes(
                                                cat._id,
                                            )}
                                            onCheckedChange={() =>
                                                toggleCategory(cat._id)
                                            }
                                        />
                                        <label
                                            htmlFor={`category-${cat._id}`}
                                            className="text-sm cursor-pointer"
                                        >
                                            {cat.name}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{LABELS.COMMON.SIZE}</label>
                            <div className="space-y-2">
                                {availableSizes.map((sizeValue) => (
                                    <div
                                        key={sizeValue}
                                        className="flex items-center gap-2"
                                    >
                                        <Checkbox
                                            id={`size-${sizeValue}`}
                                            checked={selectedSizes.includes(
                                                sizeValue,
                                            )}
                                            onCheckedChange={() =>
                                                toggleSize(sizeValue)
                                            }
                                        />
                                        <label
                                            htmlFor={`size-${sizeValue}`}
                                            className="text-sm cursor-pointer"
                                        >
                                            {sizeValue}
                                        </label>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium">{LABELS.COMMON.SORT}</label>
                            <Select value={sort} onValueChange={setSort}>
                                <SelectTrigger>
                                    <SelectValue placeholder={PLACEHOLDERS.SELECT.DEFAULT_SORT} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">
                                        {PLACEHOLDERS.SORT.DEFAULT}
                                    </SelectItem>
                                    <SelectItem value="price">
                                        {PLACEHOLDERS.SORT.PRICE_LOW_TO_HIGH}
                                    </SelectItem>
                                    <SelectItem value="-price">
                                        {PLACEHOLDERS.SORT.PRICE_HIGH_TO_LOW}
                                    </SelectItem>
                                    <SelectItem value="-createdAt">
                                        {PLACEHOLDERS.SORT.NEWEST}
                                    </SelectItem>
                                    <SelectItem value="-averageRating">
                                        {PLACEHOLDERS.SORT.HIGHEST_RATED}
                                    </SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>

                {/* Products Grid */}
                <div className="md:col-span-3">
                    {isLoading ? (
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                            {[...Array(9)].map((_, i) => (
                                <div
                                    key={i}
                                    className="h-96 bg-muted animate-pulse rounded-lg"
                                />
                            ))}
                        </div>
                    ) : data && data.products.length > 0 ? (
                        <>
                            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                                {data.products
                                    .filter((product) => {
                                        // Filter by categories if selected
                                        // Only apply client-side filtering if NOT already filtered by server
                                        // We check serverCategoryFilter because if it's set, the API only returns matching products anyway
                                        if (selectedCategories.length > 0 && !serverCategoryFilter) {
                                            const productCategories = product.categories || [];
                                            // Fallback for legacy data structure
                                            if (product.category) {
                                              const catId = typeof product.category === 'string' 
                                                  ? product.category 
                                                  : product.category._id;
                                              if (!productCategories.includes(catId)) {
                                                  productCategories.push(catId);
                                              }
                                            }

                                            const hasCategory = productCategories.some(catId => 
                                                selectedCategories.includes(catId)
                                            );
                                            
                                            if (!hasCategory) return false;
                                        }

                                        // Filter by sizes if selected
                                        if (selectedSizes.length > 0) {
                                            const hasMatchingSize =
                                                product.variants?.some((v) =>
                                                    selectedSizes.includes(
                                                        v.size,
                                                    ),
                                                );
                                            if (!hasMatchingSize) {
                                                return false;
                                            }
                                        }

                                        return true;
                                    })
                                    .map((product) => (
                                        <ProductCard
                                            key={product._id}
                                            product={product}
                                        />
                                    ))}
                            </div>

                            {/* Pagination */}
                            {data.totalPages > 1 && (
                                <Pagination className="mt-8">
                                    <PaginationContent>
                                        <PaginationItem>
                                            <PaginationPrevious
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (page > 1)
                                                        setPage((p) => p - 1);
                                                }}
                                                aria-disabled={page === 1}
                                                className={
                                                    page === 1
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                                size={undefined}
                                            />
                                        </PaginationItem>

                                        <PaginationItem>
                                            <span className="flex items-center px-4 text-sm font-medium">
                                                صفحة {page} من {data.totalPages}
                                            </span>
                                        </PaginationItem>

                                        <PaginationItem>
                                            <PaginationNext
                                                href="#"
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    if (page < data.totalPages)
                                                        setPage((p) => p + 1);
                                                }}
                                                aria-disabled={
                                                    page === data.totalPages
                                                }
                                                className={
                                                    page === data.totalPages
                                                        ? "pointer-events-none opacity-50"
                                                        : ""
                                                }
                                                size={undefined}
                                            />
                                        </PaginationItem>
                                    </PaginationContent>
                                </Pagination>
                            )}
                        </>
                    ) : (
                        <div className="text-center py-12">
                            <p className="text-muted-foreground">
                                لا توجد منتجات متاحة
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
