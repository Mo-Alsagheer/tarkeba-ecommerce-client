'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  useGetCategoriesQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  type Category,
} from '@/features/api/categoriesApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Plus,
  Pencil,
  Trash2,
  X,
  Save,
  FolderTree,
  Upload,
} from 'lucide-react';
import { toast } from 'sonner';

export default function CategoriesPage() {
  const { data, isLoading, error } = useGetCategoriesQuery();
  const [createCategory] = useCreateCategoryMutation();
  const [updateCategory] = useUpdateCategoryMutation();
  const [deleteCategory] = useDeleteCategoryMutation();

  // Debug logging
  console.log('Categories data:', data);
  console.log('Categories error:', error);

  // Ensure categories is always an array
  const categories = Array.isArray(data) ? data : [];

  const [isCreating, setIsCreating] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string>('');
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    description: '',
    parentID: '',
    isActive: true,
    sortOrder: 0,
    image: '',
  });

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error('يرجى اختيار صورة صالحة');
        return;
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error('حجم الصورة كبير جداً (الحد الأقصى 5MB)');
        return;
      }

      // Store the file and create preview
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setImageFile(null);
    setImagePreview('');
  };

  const handleCreate = async () => {
    if (!formData.name.trim()) {
      toast.error('اسم الفئة مطلوب');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('slug', formData.slug || formData.name.toLowerCase().replace(/\s+/g, '-'));
      if (formData.description) form.append('description', formData.description);
      if (formData.parentID) form.append('parentID', formData.parentID);
      form.append('isActive', String(formData.isActive));
      form.append('sortOrder', String(formData.sortOrder));
      if (imageFile) form.append('image', imageFile);

      const result = await createCategory(form).unwrap();
      console.log('Category created:', result);
      toast.success('تم إضافة الفئة بنجاح');
      setIsCreating(false);
      setImagePreview('');
      setImageFile(null);
      setFormData({ name: '', slug: '', description: '', parentID: '', isActive: true, sortOrder: 0, image: '' });
    } catch (error: any) {
      console.error('Create category error:', error);
      const errorMessage = error?.data?.message || error?.message || 'فشل في إضافة الفئة';
      toast.error(errorMessage);
    }
  };

  const handleUpdate = async (id: string) => {
    if (!formData.name.trim()) {
      toast.error('اسم الفئة مطلوب');
      return;
    }

    try {
      const form = new FormData();
      form.append('name', formData.name);
      form.append('slug', formData.slug);
      if (formData.description) form.append('description', formData.description);
      if (formData.parentID) form.append('parentID', formData.parentID);
      form.append('isActive', String(formData.isActive));
      form.append('sortOrder', String(formData.sortOrder));
      if (imageFile) form.append('image', imageFile);

      const result = await updateCategory({ id, formData: form }).unwrap();
      console.log('Category updated:', result);
      toast.success('تم تحديث الفئة بنجاح');
      setEditingId(null);
      setImagePreview('');
      setImageFile(null);
      setFormData({ name: '', slug: '', description: '', parentID: '', isActive: true, sortOrder: 0, image: '' });
    } catch (error: any) {
      console.error('Update category error:', error);
      const errorMessage = error?.data?.message || error?.message || 'فشل في تحديث الفئة';
      toast.error(errorMessage);
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف الفئة "${name}"؟`)) return;

    try {
      await deleteCategory(id).unwrap();
      console.log('Category deleted:', id);
      toast.success('تم حذف الفئة بنجاح');
    } catch (error: any) {
      console.error('Delete category error:', error);
      const errorMessage = error?.data?.message || error?.message || 'فشل في حذف الفئة';
      toast.error(errorMessage);
    }
  };

  const startEdit = (category: Category) => {
    setEditingId(category._id);
    const imageUrl = category.image || '';
    setFormData({
      name: category.name,
      slug: category.slug,
      description: category.description || '',
      parentID: (typeof category.parent === 'string' ? category.parent : category.parent?._id) || '',
      isActive: true,
      sortOrder: 0,
      image: imageUrl,
    });
    setImagePreview(imageUrl);
    setIsCreating(false);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setIsCreating(false);
    setImagePreview('');
    setImageFile(null);
    setFormData({ name: '', slug: '', description: '', parentID: '', isActive: true, sortOrder: 0, image: '' });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">إدارة الفئات</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-16 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold">إدارة الفئات</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">حدث خطأ في تحميل الفئات</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <FolderTree className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">إدارة الفئات</h1>
        </div>
        {!isCreating && !editingId && (
          <Button onClick={() => setIsCreating(true)}>
            <Plus className="ml-2 h-4 w-4" />
            إضافة فئة جديدة
          </Button>
        )}
      </div>

      {/* Create Form */}
      {isCreating && (
        <Card>
          <CardHeader>
            <CardTitle>إضافة فئة جديدة</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">اسم الفئة *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="مثال: عطور رجالية"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="slug">الرابط (Slug) *</Label>
                <Input
                  id="slug"
                  value={formData.slug}
                  onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                  placeholder="men-perfumes"
                  dir="ltr"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">الوصف</Label>
              <Input
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="وصف الفئة (اختياري، حد أقصى 500 حرف)"
                maxLength={500}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="parentID">الفئة الأب (اختياري)</Label>
                <select
                  id="parentID"
                  value={formData.parentID}
                  onChange={(e) => setFormData({ ...formData, parentID: e.target.value })}
                  className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                >
                  <option value="">لا يوجد (فئة رئيسية)</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="space-y-2">
                <Label htmlFor="sortOrder">ترتيب العرض</Label>
                <Input
                  id="sortOrder"
                  type="number"
                  value={formData.sortOrder}
                  onChange={(e) => setFormData({ ...formData, sortOrder: Number(e.target.value) })}
                  placeholder="0"
                  min="0"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="image">صورة الفئة (اختياري)</Label>
              <div className="flex items-center gap-4">
                <Input
                  id="image"
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="cursor-pointer"
                />
                {imagePreview && (
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={clearImage}
                  >
                    <X className="h-4 w-4 ml-1" />
                    إزالة
                  </Button>
                )}
              </div>
              {imagePreview && (
                <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                  <Image
                    src={imagePreview}
                    alt="معاينة"
                    fill
                    className="object-cover"
                  />
                </div>
              )}
              <p className="text-xs text-muted-foreground">
                الحد الأقصى: 5MB، الأنواع المدعومة: JPG, PNG, GIF, WebP
              </p>
            </div>
            <div className="flex items-center gap-2">
              <input
                type="checkbox"
                id="isActive"
                checked={formData.isActive}
                onChange={(e) => setFormData({ ...formData, isActive: e.target.checked })}
                className="h-4 w-4"
              />
              <Label htmlFor="isActive" className="cursor-pointer">
                فئة نشطة (مرئية للمستخدمين)
              </Label>
            </div>
            <div className="flex gap-2">
              <Button onClick={handleCreate}>
                <Save className="ml-2 h-4 w-4" />
                حفظ
              </Button>
              <Button variant="outline" onClick={cancelEdit}>
                <X className="ml-2 h-4 w-4" />
                إلغاء
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Categories List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {categories.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                لا توجد فئات. ابدأ بإضافة فئة جديدة.
              </div>
            ) : (
              categories.map((category) => (
                <div key={category._id} className="p-4">
                  {editingId === category._id ? (
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`name-${category._id}`}>اسم الفئة *</Label>
                          <Input
                            id={`name-${category._id}`}
                            value={formData.name}
                            onChange={(e) =>
                              setFormData({ ...formData, name: e.target.value })
                            }
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`slug-${category._id}`}>الرابط (Slug) *</Label>
                          <Input
                            id={`slug-${category._id}`}
                            value={formData.slug}
                            onChange={(e) =>
                              setFormData({ ...formData, slug: e.target.value })
                            }
                            dir="ltr"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`description-${category._id}`}>الوصف</Label>
                        <Input
                          id={`description-${category._id}`}
                          value={formData.description}
                          onChange={(e) =>
                            setFormData({ ...formData, description: e.target.value })
                          }
                          maxLength={500}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor={`parentID-${category._id}`}>الفئة الأب</Label>
                          <select
                            id={`parentID-${category._id}`}
                            value={formData.parentID}
                            onChange={(e) =>
                              setFormData({ ...formData, parentID: e.target.value })
                            }
                            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background"
                          >
                            <option value="">لا يوجد</option>
                            {categories.filter(c => c._id !== category._id).map((cat) => (
                              <option key={cat._id} value={cat._id}>
                                {cat.name}
                              </option>
                            ))}
                          </select>
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor={`sortOrder-${category._id}`}>الترتيب</Label>
                          <Input
                            id={`sortOrder-${category._id}`}
                            type="number"
                            value={formData.sortOrder}
                            onChange={(e) =>
                              setFormData({ ...formData, sortOrder: Number(e.target.value) })
                            }
                            min="0"
                          />
                        </div>
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor={`image-${category._id}`}>صورة الفئة</Label>
                        <div className="flex items-center gap-4">
                          <Input
                            id={`image-${category._id}`}
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="cursor-pointer"
                          />
                          {imagePreview && (
                            <Button
                              type="button"
                              variant="outline"
                              size="sm"
                              onClick={clearImage}
                            >
                              <X className="h-4 w-4 ml-1" />
                              إزالة
                            </Button>
                          )}
                        </div>
                        {imagePreview && (
                          <div className="relative w-32 h-32 border rounded-lg overflow-hidden">
                            <Image
                              src={imagePreview}
                              alt="معاينة"
                              fill
                              className="object-cover"
                            />
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <input
                          type="checkbox"
                          id={`isActive-${category._id}`}
                          checked={formData.isActive}
                          onChange={(e) =>
                            setFormData({ ...formData, isActive: e.target.checked })
                          }
                          className="h-4 w-4"
                        />
                        <Label htmlFor={`isActive-${category._id}`} className="cursor-pointer">
                          فئة نشطة
                        </Label>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          onClick={() => handleUpdate(category._id)}
                        >
                          <Save className="ml-2 h-4 w-4" />
                          حفظ
                        </Button>
                        <Button size="sm" variant="outline" onClick={cancelEdit}>
                          <X className="ml-2 h-4 w-4" />
                          إلغاء
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{category.name}</h3>
                        <p className="text-sm text-muted-foreground" dir="ltr">
                          /{category.slug}
                        </p>
                        {category.description && (
                          <p className="text-sm text-muted-foreground">
                            {category.description}
                          </p>
                        )}
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(category)}
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(category._id, category.name)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
