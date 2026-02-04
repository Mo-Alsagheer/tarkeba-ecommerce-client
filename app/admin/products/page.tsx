'use client';

import { useState, useRef, useEffect } from 'react';
import {
  useGetProductsQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  type Product,
} from '@/features/api/productsApi';
import { useGetCategoriesQuery } from '@/features/api/categoriesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  Package,
  Search,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';
import Image from 'next/image';
import { TITLES, LABELS, BUTTONS, MESSAGES, PLACEHOLDERS, CURRENCY } from '@/constants';

interface VariantForm {
  size: string;
  price: string;
  comparePrice: string;
  stock: string;
}

export default function ProductsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const { data: productsResponse, isLoading, error } = useGetProductsQuery({ search: searchQuery });
  const { data: categories = [] } = useGetCategoriesQuery();
  const [createProduct] = useCreateProductMutation();
  const [updateProduct] = useUpdateProductMutation();
  const [deleteProduct] = useDeleteProductMutation();

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [imageFiles, setImageFiles] = useState<File[]>([]);
  const formRef = useRef<HTMLDivElement>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    categoryIds: [] as string[],
    isActive: true,
    isFeatured: false,
    tags: '',
    seoTitle: '',
    seoDescription: '',
    seoKeywords: '',
  });
  const [variants, setVariants] = useState<VariantForm[]>([
    { size: '50ml', price: '', comparePrice: '', stock: '' }
  ]);

  const products = productsResponse?.products || [];

  // Scroll to form when editing or creating
  useEffect(() => {
    if ((isCreating || editingId) && formRef.current) {
      setTimeout(() => {
        formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }, 100);
    }
  }, [isCreating, editingId]);

  const handleImagesChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    // Validate file types and sizes
    const validFiles = files.filter(file => {
      if (!file.type.startsWith('image/')) {
        toast.error(MESSAGES.ERROR.NOT_VALID_IMAGE(file.name));
        return false;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error(MESSAGES.ERROR.IMAGE_FILE_TOO_LARGE(file.name));
        return false;
      }
      return true;
    });

    if (validFiles.length === 0) return;

    setImageFiles(prev => [...prev, ...validFiles]);

    // Create previews
    validFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviews(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setImageFiles(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => prev.filter((_, i) => i !== index));
  };

  const addVariant = () => {
    setVariants([...variants, { size: '', price: '', comparePrice: '', stock: '' }]);
  };

  const removeVariant = (index: number) => {
    setVariants(variants.filter((_, i) => i !== index));
  };

  const updateVariant = (index: number, field: keyof VariantForm, value: string) => {
    const newVariants = [...variants];
    newVariants[index][field] = value;
    setVariants(newVariants);
  };

  const toggleCategory = (categoryId: string) => {
    setFormData(prev => ({
      ...prev,
      categoryIds: prev.categoryIds.includes(categoryId)
        ? prev.categoryIds.filter(id => id !== categoryId)
        : [...prev.categoryIds, categoryId]
    }));
  };

  const handleCreate = async () => {
    if (!formData.name.trim() || !formData.description.trim() || formData.categoryIds.length === 0) {
      toast.error(MESSAGES.ERROR.PRODUCT_FIELDS_REQUIRED);
      return;
    }

    if (variants.length === 0 || !variants[0].size || !variants[0].price) {
      toast.error(MESSAGES.ERROR.PRODUCT_VARIANT_REQUIRED);
      return;
    }

    console.log('Raw variants before processing:', variants);

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('slug', formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'));
      form.append('description', formData.description);
      form.append('categories', JSON.stringify(formData.categoryIds));
      form.append('isActive', String(formData.isActive));
      form.append('isFeatured', String(formData.isFeatured));
      
      // Add variants
      const variantsData = variants
        .filter(v => {
          console.log('Checking variant:', v, 'size:', v.size, 'price:', v.price);
          return v.size && v.price;
        })
        .map(v => {
          const variant: any = {
            size: v.size,
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock) || 0,
          };
          if (v.comparePrice && parseFloat(v.comparePrice) > 0) {
            variant.comparePrice = parseFloat(v.comparePrice);
          }
          console.log('Mapped variant:', variant);
          return variant;
        });
      
      console.log('Final variants data to send:', variantsData);
      console.log('JSON stringified variants:', JSON.stringify(variantsData));
      form.append('variants', JSON.stringify(variantsData));
      
      // Debug: Log all form data
      console.log('FormData entries:');
      for (let pair of form.entries()) {
        console.log(pair[0], typeof pair[1] === 'string' ? pair[1] : 'File');
      }

      // Add tags
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
        form.append('tags', JSON.stringify(tagsArray));
      }

      // Add SEO
      if (formData.seoTitle || formData.seoDescription || formData.seoKeywords) {
        const seo: any = {};
        if (formData.seoTitle) seo.title = formData.seoTitle;
        if (formData.seoDescription) seo.description = formData.seoDescription;
        if (formData.seoKeywords) {
          seo.keywords = formData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
        }
        form.append('seo', JSON.stringify(seo));
      }

      // Add images
      imageFiles.forEach(file => {
        form.append('images', file);
      });

      await createProduct(form).unwrap();
      toast.success(MESSAGES.SUCCESS.PRODUCT_CREATED);
      setIsCreating(false);
      resetForm();
    } catch (error: any) {
      console.error('Create product error:', error);
      toast.error(error?.data?.message || MESSAGES.ERROR.PRODUCT_CREATE_FAILED);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim() || !formData.description.trim()) {
      toast.error(MESSAGES.ERROR.REQUIRED_FIELDS_MISSING);
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('slug', formData.slug);
      form.append('description', formData.description);
      form.append('categories', JSON.stringify(formData.categoryIds));
      form.append('isActive', String(formData.isActive));
      form.append('isFeatured', String(formData.isFeatured));

      // Add variants
      const variantsData = variants
        .filter(v => v.size && v.price)
        .map(v => {
          const variant: any = {
            size: v.size,
            price: parseFloat(v.price) || 0,
            stock: parseInt(v.stock) || 0,
          };
          if (v.comparePrice && parseFloat(v.comparePrice) > 0) {
            variant.comparePrice = parseFloat(v.comparePrice);
          }
          return variant;
        });
      form.append('variants', JSON.stringify(variantsData));

      // Add tags
      if (formData.tags) {
        const tagsArray = formData.tags.split(',').map(t => t.trim()).filter(Boolean);
        form.append('tags', JSON.stringify(tagsArray));
      }

      // Add SEO
      if (formData.seoTitle || formData.seoDescription || formData.seoKeywords) {
        const seo: any = {};
        if (formData.seoTitle) seo.title = formData.seoTitle;
        if (formData.seoDescription) seo.description = formData.seoDescription;
        if (formData.seoKeywords) {
          seo.keywords = formData.seoKeywords.split(',').map(k => k.trim()).filter(Boolean);
        }
        form.append('seo', JSON.stringify(seo));
      }

      // Add new images
      imageFiles.forEach(file => {
        form.append('images', file);
      });

      await updateProduct({ id, formData: form }).unwrap();
      toast.success(MESSAGES.SUCCESS.PRODUCT_UPDATED);
      setEditingId(null);
      resetForm();
    } catch (error: any) {
      console.error('Update product error:', error);
      toast.error(error?.data?.message || MESSAGES.ERROR.PRODUCT_UPDATE_FAILED);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`${MESSAGES.CONFIRM.DELETE_PRODUCT} "${name}"${MESSAGES.CONFIRM.DELETE_CONFIRMATION}`)) return;

    try {
      await deleteProduct(id).unwrap();
      toast.success(MESSAGES.SUCCESS.PRODUCT_DELETED);
    } catch {
      toast.error(MESSAGES.ERROR.PRODUCT_DELETE_FAILED);
    }
  };

  const startEdit = (product: Product) => {
    console.log('Starting edit for product:', product);
    
    setEditingId(product._id);
    const categoryIds = Array.isArray(product.category) 
      ? product.category.map(c => typeof c === 'string' ? c : c._id)
      : product.category 
        ? (typeof product.category === 'string' ? [product.category] : [product.category._id])
        : [];

    const newFormData = {
      name: product.name,
      slug: product.slug,
      description: product.description,
      categoryIds,
      isActive: product.isActive ?? true,
      isFeatured: product.isFeatured,
      tags: product.tags ? product.tags.join(', ') : '',
      seoTitle: product.seo?.title || '',
      seoDescription: product.seo?.description || '',
      seoKeywords: product.seo?.keywords ? product.seo.keywords.join(', ') : '',
    };
    
    console.log('Setting form data:', newFormData);
    setFormData(newFormData);

    // Set variants
    if (product.variants && product.variants.length > 0) {
      const newVariants = product.variants.map(v => ({
        size: v.size,
        price: v.price.toString(),
        comparePrice: v.comparePrice?.toString() || '',
        stock: v.stock.toString(),
      }));
      console.log('Setting variants:', newVariants);
      setVariants(newVariants);
    } else {
      setVariants([{ size: '50ml', price: '', comparePrice: '', stock: '' }]);
    }

    // Set existing images as previews
    if (product.images && product.images.length > 0) {
      console.log('Setting image previews:', product.images);
      setImagePreviews(product.images);
    } else {
      setImagePreviews([]);
    }

    setIsCreating(false);
    setImageFiles([]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      name: '',
      slug: '',
      description: '',
      categoryIds: [],
      isActive: true,
      isFeatured: false,
      tags: '',
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
    });
    setVariants([{ size: '50ml', price: '', comparePrice: '', stock: '' }]);
    setImagePreviews([]);
    setImageFiles([]);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">{TITLES.ADMIN.PRODUCTS}</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-24 bg-gray-200 rounded"></div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{TITLES.ADMIN.PRODUCTS}</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">{MESSAGES.ERROR.PRODUCTS_LOAD_FAILED}</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Package className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">{TITLES.ADMIN.PRODUCTS}</h1>
        </div>
        {!isCreating && !editingId && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="ml-2 h-4 w-4" />
            {BUTTONS.ADD_PRODUCT}
          </Button>
        )}
      </div>

      {/* Search Bar */}
      {!isCreating && !editingId && (
        <Card>
          <CardContent className="pt-6">
            <div className="relative">
              <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder={PLACEHOLDERS.SEARCH.PRODUCTS}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pr-10"
              />
            </div>
          </CardContent>
        </Card>
      )}

      {/* Create/Edit Form */}
      {(isCreating || editingId) && (
        <Card ref={formRef}>
          <CardHeader>
            <CardTitle>{isCreating ? BUTTONS.ADD_PRODUCT : LABELS.SECTIONS.PRODUCT_EDIT}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Basic Info */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{LABELS.SECTIONS.BASIC_INFO}</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{LABELS.PRODUCT.NAME}</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={PLACEHOLDERS.PRODUCT.NAME}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug">{LABELS.PRODUCT.SLUG}</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                    placeholder={PLACEHOLDERS.PRODUCT.SLUG}
                    dir="ltr"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="description">{LABELS.PRODUCT.DESCRIPTION}</Label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  placeholder={PLACEHOLDERS.PRODUCT.DESCRIPTION}
                  className="flex min-h-[100px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                />
              </div>
            </div>

            {/* Categories */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{LABELS.PRODUCT.CATEGORIES_SECTION}</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {categories.map((cat) => (
                  <div key={cat._id} className="flex items-center gap-2">
                    <Checkbox
                      id={`cat-${cat._id}`}
                      checked={formData.categoryIds.includes(cat._id)}
                      onCheckedChange={() => toggleCategory(cat._id)}
                    />
                    <Label htmlFor={`cat-${cat._id}`} className="cursor-pointer text-sm">
                      {cat.name}
                    </Label>
                  </div>
                ))}
              </div>
            </div>

            {/* Variants */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="font-semibold text-lg">{LABELS.PRODUCT.VARIANTS_SECTION}</h3>
                <Button type="button" size="sm" variant="outline" onClick={addVariant}>
                  <Plus className="h-4 w-4 ml-1" />
                  {BUTTONS.ADD_VARIANT}
                </Button>
              </div>
              {variants.map((variant, index) => (
                <Card key={index} className="p-4">
                  <div className="grid md:grid-cols-5 gap-3">
                    <div className="space-y-2">
                      <Label>{LABELS.PRODUCT.VARIANT_SIZE}</Label>
                      <Input
                        value={variant.size}
                        onChange={(e) => updateVariant(index, 'size', e.target.value)}
                        placeholder={PLACEHOLDERS.PRODUCT.VARIANT_SIZE}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{LABELS.PRODUCT.VARIANT_PRICE}</Label>
                      <Input
                        type="number"
                        value={variant.price}
                        onChange={(e) => updateVariant(index, 'price', e.target.value)}
                        placeholder={PLACEHOLDERS.PRODUCT.VARIANT_PRICE}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{LABELS.PRODUCT.VARIANT_COMPARE_PRICE}</Label>
                      <Input
                        type="number"
                        value={variant.comparePrice}
                        onChange={(e) => updateVariant(index, 'comparePrice', e.target.value)}
                        placeholder={PLACEHOLDERS.PRODUCT.VARIANT_COMPARE_PRICE}
                        min="0"
                        step="0.01"
                      />
                    </div>
                    <div className="space-y-2">
                      <Label>{LABELS.PRODUCT.VARIANT_STOCK}</Label>
                      <Input
                        type="number"
                        value={variant.stock}
                        onChange={(e) => updateVariant(index, 'stock', e.target.value)}
                        placeholder={PLACEHOLDERS.PRODUCT.VARIANT_STOCK}
                        min="0"
                      />
                    </div>
                    <div className="flex items-end">
                      {variants.length > 1 && (
                        <Button
                          type="button"
                          variant="destructive"
                          size="sm"
                          onClick={() => removeVariant(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>

            {/* Images */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{LABELS.PRODUCT.IMAGES_SECTION}</h3>
              <div className="space-y-2">
                <Label htmlFor="images">{LABELS.PRODUCT.UPLOAD_IMAGES}</Label>
                <Input
                  id="images"
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImagesChange}
                  className="cursor-pointer"
                />
                <p className="text-xs text-muted-foreground">
                  {MESSAGES.INFO.IMAGE_MULTIPLE}
                </p>
              </div>
              {imagePreviews.length > 0 && (
                <div className="grid grid-cols-4 gap-3">
                  {imagePreviews.map((preview, index) => (
                    <div key={index} className="relative">
                      <div className="relative w-full h-24 border rounded-lg overflow-hidden">
                        <Image
                          src={preview}
                          alt={`${LABELS.PRODUCT.PREVIEW} ${index + 1}`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <Button
                        type="button"
                        variant="destructive"
                        size="sm"
                        className="absolute -top-2 -right-2"
                        onClick={() => removeImage(index)}
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Tags */}
            <div className="space-y-2">
              <Label htmlFor="tags">{LABELS.PRODUCT.TAGS}</Label>
              <Input
                id="tags"
                value={formData.tags}
                onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                placeholder={PLACEHOLDERS.PRODUCT.TAGS}
              />
              <p className="text-xs text-muted-foreground">{MESSAGES.INFO.TAGS_SEPARATOR}</p>
            </div>

            {/* SEO */}
            <div className="space-y-4">
              <h3 className="font-semibold text-lg">{LABELS.PRODUCT.SEO_SECTION}</h3>
              <div className="space-y-3">
                <div className="space-y-2">
                  <Label htmlFor="seoTitle">{LABELS.PRODUCT.SEO_TITLE}</Label>
                  <Input
                    id="seoTitle"
                    value={formData.seoTitle}
                    onChange={(e) => setFormData({ ...formData, seoTitle: e.target.value })}
                    placeholder={PLACEHOLDERS.PRODUCT.SEO_TITLE}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoDescription">{LABELS.PRODUCT.SEO_DESCRIPTION}</Label>
                  <Input
                    id="seoDescription"
                    value={formData.seoDescription}
                    onChange={(e) => setFormData({ ...formData, seoDescription: e.target.value })}
                    placeholder={PLACEHOLDERS.PRODUCT.SEO_DESCRIPTION}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="seoKeywords">{LABELS.PRODUCT.SEO_KEYWORDS}</Label>
                  <Input
                    id="seoKeywords"
                    value={formData.seoKeywords}
                    onChange={(e) => setFormData({ ...formData, seoKeywords: e.target.value })}
                    placeholder={PLACEHOLDERS.PRODUCT.SEO_KEYWORDS}
                  />
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">{LABELS.SECTIONS.SETTINGS}</h3>
              <div className="flex flex-col gap-2">
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isActive"
                    checked={formData.isActive}
                    onCheckedChange={(checked) => setFormData({ ...formData, isActive: !!checked })}
                  />
                  <Label htmlFor="isActive" className="cursor-pointer">
                    {LABELS.PRODUCT.IS_ACTIVE}
                  </Label>
                </div>
                <div className="flex items-center gap-2">
                  <Checkbox
                    id="isFeatured"
                    checked={formData.isFeatured}
                    onCheckedChange={(checked) => setFormData({ ...formData, isFeatured: !!checked })}
                  />
                  <Label htmlFor="isFeatured" className="cursor-pointer">
                    {LABELS.PRODUCT.IS_FEATURED}
                  </Label>
                </div>
              </div>
            </div>

            <div className="flex gap-2">
              <Button onClick={isCreating ? handleCreate : () => handleUpdate(editingId!)}>
                <Save className="ml-2 h-4 w-4" />
                {BUTTONS.SAVE}
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="ml-2 h-4 w-4" />
                {BUTTONS.CANCEL}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Products List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {products.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? MESSAGES.EMPTY.NO_SEARCH_RESULTS : MESSAGES.EMPTY.NO_PRODUCTS}
              </div>
            ) : (
              products.map((product) => (
                <div key={product._id} className="p-4">
                  <div className="flex items-start gap-4">
                    {/* Product Image */}
                    <div className="relative h-20 w-20 shrink-0 rounded-md overflow-hidden bg-gray-100">
                      {product.images && product.images.length > 0 ? (
                        <Image
                          src={product.images[0]}
                          alt={product.name}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <Package className="h-8 w-8 text-gray-400" />
                        </div>
                      )}
                    </div>

                    {/* Product Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <h3 className="font-semibold text-lg">{product.name}</h3>
                          <p className="text-sm text-muted-foreground line-clamp-2">
                            {product.description}
                          </p>
                          <div className="flex flex-wrap gap-3 text-sm">
                            <span className="text-primary font-semibold">
                              {product.price?.toLocaleString('ar-SA') || '0'} {CURRENCY.DEFAULT}
                            </span>
                            <span className="text-muted-foreground">
                              {LABELS.PRODUCT.STOCK_LABEL}: {product.stock || 0}
                            </span>
                            <span className="text-muted-foreground">
                              {LABELS.PRODUCT.CATEGORY_LABEL}: {typeof product.category === 'object' ? product.category.name : LABELS.PRODUCT.NOT_SPECIFIED}
                            </span>
                            {product.isFeatured && (
                              <span className="text-xs bg-primary/10 text-primary px-2 py-0.5 rounded">
                                {LABELS.PRODUCT.FEATURED_BADGE}
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 shrink-0">
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => startEdit(product)}
                          >
                            <Pencil className="h-4 w-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleDelete(product._id, product.name)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
