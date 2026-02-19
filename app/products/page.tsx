"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { useGetProductsQuery } from "@/features/api/productsApi";
import { useGetCategoriesQuery } from "@/features/api/categoriesApi";
import { ProductCard } from "@/components/products/ProductCard";
import { Input } from "@/components/ui/input";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { Button } from "@/components/ui/button";
import {
  Filter,
  Search,
  SlidersHorizontal,
  X,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import {
  TITLES,
  DESCRIPTIONS,
  LABELS,
  PLACEHOLDERS,
  STATUS,
} from "@/constants";
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
    categoryFromUrl ? [categoryFromUrl] : [],
  );
  const [showFilters, setShowFilters] = useState(false);
  const [expandedSections, setExpandedSections] = useState<string[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [priceRange, setPriceRange] = useState([0, 5000]);
  const [debouncedPriceRange, setDebouncedPriceRange] = useState([0, 5000]);
  const [sort, setSort] = useState("default");
  const [page, setPage] = useState(1);
  const [availabilityFilter, setAvailabilityFilter] = useState<
    "all" | "in-stock" | "out-of-stock"
  >("all");

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
      if (
        priceRange[0] !== debouncedPriceRange[0] ||
        priceRange[1] !== debouncedPriceRange[1]
      ) {
        setPage(1);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [priceRange, debouncedPriceRange]);

  const availableSizes = ["30ml", "50ml", "75ml", "100ml", "150ml"];

  const { data: categoriesData } = useGetCategoriesQuery();

  // Check if we are filtering by category on the server side
  const serverCategoryFilter =
    selectedCategories.length > 0 ? selectedCategories[0] : undefined;

  const { data, isLoading } = useGetProductsQuery({
    search: debouncedSearch,
    category: serverCategoryFilter,
    // Only send price params when user has actually adjusted them from defaults
    minPrice: debouncedPriceRange[0] > 0 ? debouncedPriceRange[0] : undefined,
    maxPrice:
      debouncedPriceRange[1] < 5000 ? debouncedPriceRange[1] : undefined,
    sort: sort === "default" ? undefined : sort,
    page,
    limit: 15,
  });

  // Client-side sort + availability filter
  const sortedProducts = (data?.products ?? [])
    .filter((product) => {
      if (availabilityFilter === "all") return true;
      const isOutOfStock =
        product.variants && product.variants.length > 0
          ? product.variants.every((v) => v.stock === 0)
          : product.stock === 0;
      return availabilityFilter === "out-of-stock"
        ? isOutOfStock
        : !isOutOfStock;
    })
    .slice()
    .sort((a, b) => {
      // Use the first in-stock variant's price; fall back to first variant, then base price
      const getPrice = (p: typeof a) => {
        if (p.variants && p.variants.length > 0) {
          const inStock = p.variants.find((v) => v.stock > 0);
          return (inStock ?? p.variants[0]).price;
        }
        return p.price;
      };
      const aPrice = getPrice(a);
      const bPrice = getPrice(b);
      switch (sort) {
        case "price":
          return aPrice - bPrice;
        case "-price":
          return bPrice - aPrice;
        case "-createdAt":
          return (
            new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
          );
        case "-averageRating":
          return b.averageRating - a.averageRating;
        default:
          return 0;
      }
    });

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

  const toggleSection = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((s) => s !== section)
        : [...prev, section],
    );
  };

  const clearAllFilters = () => {
    setSearch("");
    setPriceRange([0, 5000]);
    setSelectedCategories([]);
    setSelectedSizes([]);
    setAvailabilityFilter("all");
    setPage(1);
    // Remove category from URL if present
    const newUrl = window.location.pathname;
    window.history.replaceState({}, "", newUrl);
  };

  const hasActiveFilters =
    search ||
    priceRange[0] > 0 ||
    priceRange[1] < 5000 ||
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    availabilityFilter !== "all";

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Top Header & Toolbar */}
      <div className="mb-6">
        <h1 className="text-3xl font-bold mb-2">
          {TITLES.PUBLIC.ALL_PRODUCTS}
        </h1>
        <p className="text-muted-foreground mb-6">
          {DESCRIPTIONS.PUBLIC.ALL_PRODUCTS}
        </p>

        <div className="flex justify-between items-center bg-background border rounded-lg p-2 sm:p-4 shadow-sm gap-2">
          <div className="flex items-center gap-2 sm:gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setShowFilters(!showFilters)}
              className="font-semibold flex items-center gap-1 sm:gap-2 hover:bg-muted px-2 h-9"
            >
              <SlidersHorizontal className="h-4 w-4" />
              <span className="text-sm">{LABELS.SECTIONS.SEARCH_FILTER}</span>
            </Button>
            <div className="h-4 w-px bg-border hidden sm:block"></div>
            <span className="text-sm text-muted-foreground hidden sm:inline-block">
              {data?.products?.length || 0}{" "}
              {LABELS.COMMON.PRODUCTS || "Products"}
            </span>
          </div>

          <div className="flex items-center gap-1 sm:gap-2">
            <span className="text-sm text-muted-foreground whitespace-nowrap hidden xs:inline-block">
              {LABELS.COMMON.SORT}:
            </span>
            <Select
              value={sort}
              dir="rtl"
              onValueChange={(value) => {
                setSort(value);
                setPage(1);
              }}
            >
              <SelectTrigger className="w-[120px] sm:w-[180px] border-none shadow-none focus:ring-0 font-medium h-9 px-1 sm:px-3 text-xs sm:text-sm">
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

      <div className="grid md:grid-cols-4 gap-8 items-start">
        {/* Sidebar Filters */}
        {showFilters && (
          <div className="md:col-span-1 space-y-6">
            {/* Search Input */}
            <div className="relative">
              <Input
                placeholder={PLACEHOLDERS.SEARCH.PRODUCTS}
                className="pe-10"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
            </div>

            {/* Active Filters */}
            {hasActiveFilters && (
              <div className="space-y-3 pb-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-sm">
                    {selectedCategories.length +
                      selectedSizes.length +
                      (availabilityFilter !== "all" ? 1 : 0) +
                      (priceRange[0] > 0 || priceRange[1] < 5000 ? 1 : 0)}{" "}
                    فلاتر مطبقة
                  </h3>
                  <Button
                    variant="link"
                    size="sm"
                    onClick={clearAllFilters}
                    className="text-primary h-auto p-0 text-xs"
                  >
                    مسح الكل
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {availabilityFilter !== "all" && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs font-medium">
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => setAvailabilityFilter("all")}
                      />
                      {availabilityFilter === "in-stock"
                        ? STATUS.STOCK.IN_STOCK
                        : STATUS.STOCK.OUT_OF_STOCK}
                    </div>
                  )}
                  {selectedCategories.map((catId) => {
                    const catName = categoriesData?.find(
                      (c) => c._id === catId,
                    )?.name;
                    return (
                      <div
                        key={catId}
                        className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs font-medium"
                      >
                        <X
                          className="h-3 w-3 cursor-pointer hover:text-destructive"
                          onClick={() => toggleCategory(catId)}
                        />
                        {catName}
                      </div>
                    );
                  })}
                  {(priceRange[0] > 0 || priceRange[1] < 5000) && (
                    <div className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs font-medium">
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => setPriceRange([0, 5000])}
                      />
                      {priceRange[0]} - {priceRange[1]} EGP
                    </div>
                  )}
                  {selectedSizes.map((sizeValue) => (
                    <div
                      key={sizeValue}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-muted rounded-full text-xs font-medium"
                    >
                      <X
                        className="h-3 w-3 cursor-pointer hover:text-destructive"
                        onClick={() => toggleSize(sizeValue)}
                      />
                      {sizeValue}
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Filter Sections */}
            <div className="space-y-4">
              {/* Availability Section */}
              <div className="border-b pb-4">
                <button
                  onClick={() => toggleSection("availability")}
                  className="flex items-center justify-between w-full font-semibold text-sm mb-4"
                >
                  التوفر
                  {expandedSections.includes("availability") ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.includes("availability") && (
                  <div className="space-y-3">
                    {[
                      { value: "in-stock", label: STATUS.STOCK.IN_STOCK },
                      {
                        value: "out-of-stock",
                        label: STATUS.STOCK.OUT_OF_STOCK,
                      },
                    ].map(({ value, label }) => (
                      <div
                        key={value}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`availability-${value}`}
                            checked={availabilityFilter === value}
                            onCheckedChange={() => {
                              setAvailabilityFilter(
                                availabilityFilter === value
                                  ? "all"
                                  : (value as any),
                              );
                              setPage(1);
                            }}
                          />
                          <label
                            htmlFor={`availability-${value}`}
                            className="text-sm cursor-pointer"
                          >
                            {label}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Price Section */}
              <div className="border-b pb-4">
                <button
                  onClick={() => toggleSection("price")}
                  className="flex items-center justify-between w-full font-semibold text-sm mb-4"
                >
                  نطاق السعر
                  {expandedSections.includes("price") ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.includes("price") && (
                  <div className="space-y-4 pt-2">
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
                )}
              </div>

              {/* Category Section */}
              <div className="border-b pb-4">
                <button
                  onClick={() => toggleSection("category")}
                  className="flex items-center justify-between w-full font-semibold text-sm mb-4"
                >
                  الفئة
                  {expandedSections.includes("category") ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.includes("category") && (
                  <div className="space-y-2 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                    {categoriesData?.map((cat) => (
                      <div
                        key={cat._id}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`category-${cat._id}`}
                            checked={selectedCategories.includes(cat._id)}
                            onCheckedChange={() => toggleCategory(cat._id)}
                          />
                          <label
                            htmlFor={`category-${cat._id}`}
                            className="text-sm cursor-pointer"
                          >
                            {cat.name}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Size Section */}
              <div className="border-b pb-4">
                <button
                  onClick={() => toggleSection("size")}
                  className="flex items-center justify-between w-full font-semibold text-sm mb-4"
                >
                  {LABELS.COMMON.SIZE}
                  {expandedSections.includes("size") ? (
                    <ChevronUp className="h-4 w-4" />
                  ) : (
                    <ChevronDown className="h-4 w-4" />
                  )}
                </button>
                {expandedSections.includes("size") && (
                  <div className="space-y-2">
                    {availableSizes.map((sizeValue) => (
                      <div
                        key={sizeValue}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <Checkbox
                            id={`size-${sizeValue}`}
                            checked={selectedSizes.includes(sizeValue)}
                            onCheckedChange={() => toggleSize(sizeValue)}
                          />
                          <label
                            htmlFor={`size-${sizeValue}`}
                            className="text-sm cursor-pointer"
                          >
                            {sizeValue}
                          </label>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Products Grid */}
        <div className={showFilters ? "md:col-span-3" : "md:col-span-4"}>
          {isLoading ? (
            <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
              {[...Array(9)].map((_, i) => (
                <div
                  key={i}
                  className="h-96 bg-muted animate-pulse rounded-lg"
                />
              ))}
            </div>
          ) : data && sortedProducts.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {sortedProducts
                  .filter((product) => {
                    // Filter by categories if selected
                    // Only apply client-side filtering if NOT already filtered by server
                    // We check serverCategoryFilter because if it's set, the API only returns matching products anyway
                    if (
                      selectedCategories.length > 0 &&
                      !serverCategoryFilter
                    ) {
                      const productCategories = product.categories || [];
                      // Fallback for legacy data structure
                      if (product.category) {
                        const catId =
                          typeof product.category === "string"
                            ? product.category
                            : product.category._id;
                        if (!productCategories.includes(catId)) {
                          productCategories.push(catId);
                        }
                      }

                      const hasCategory = productCategories.some((catId) =>
                        selectedCategories.includes(catId),
                      );

                      if (!hasCategory) return false;
                    }

                    // Filter by sizes if selected
                    if (selectedSizes.length > 0) {
                      const hasMatchingSize = product.variants?.some((v) =>
                        selectedSizes.includes(v.size),
                      );
                      if (!hasMatchingSize) {
                        return false;
                      }
                    }

                    return true;
                  })
                  .map((product) => (
                    <ProductCard key={product._id} product={product} />
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
                          if (page > 1) setPage((p) => p - 1);
                        }}
                        aria-disabled={page === 1}
                        className={
                          page === 1 ? "pointer-events-none opacity-50" : ""
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
                          if (page < data.totalPages) setPage((p) => p + 1);
                        }}
                        aria-disabled={page === data.totalPages}
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
              <p className="text-muted-foreground">لا توجد منتجات متاحة</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
