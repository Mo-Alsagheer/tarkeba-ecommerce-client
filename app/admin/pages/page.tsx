'use client';

import { useState } from 'react';
import { useGetPagesQuery, useCreatePageMutation, useUpdatePageMutation, useDeletePageMutation } from '@/features/api/pagesApi';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Plus, Edit, Trash2, Eye, EyeOff } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPagesPage() {
  const { data, isLoading } = useGetPagesQuery();
  const [createPage] = useCreatePageMutation();
  const [updatePage] = useUpdatePageMutation();
  const [deletePage] = useDeletePageMutation();
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingPage, setEditingPage] = useState<any>(null);
  const [formData, setFormData] = useState({
    slug: '',
    title: '',
    content: '',
    metaDescription: '',
    isPublished: true,
  });

  const pages = data?.pages || [];

  const resetForm = () => {
    setFormData({
      slug: '',
      title: '',
      content: '',
      metaDescription: '',
      isPublished: true,
    });
    setEditingPage(null);
    setIsModalOpen(false);
  };

  const handleEdit = (page: any) => {
    setEditingPage(page);
    setFormData({
      slug: page.slug,
      title: page.title,
      content: page.content,
      metaDescription: page.metaDescription || '',
      isPublished: page.isPublished,
    });
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      if (editingPage) {
        await updatePage({
          _id: editingPage._id,
          ...formData,
        }).unwrap();
        toast.success('تم تحديث الصفحة بنجاح');
      } else {
        await createPage(formData).unwrap();
        toast.success('تم إنشاء الصفحة بنجاح');
      }
      resetForm();
    } catch (error: any) {
      toast.error(error?.data?.message || 'حدث خطأ أثناء حفظ الصفحة');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('هل أنت متأكد من حذف هذه الصفحة؟')) return;
    
    try {
      await deletePage(id).unwrap();
      toast.success('تم حذف الصفحة بنجاح');
    } catch (error: any) {
      toast.error(error?.data?.message || 'حدث خطأ أثناء حذف الصفحة');
    }
  };

  const handleTogglePublish = async (page: any) => {
    try {
      await updatePage({
        _id: page._id,
        isPublished: !page.isPublished,
      }).unwrap();
      toast.success(page.isPublished ? 'تم إخفاء الصفحة' : 'تم نشر الصفحة');
    } catch (error: any) {
      toast.error('حدث خطأ أثناء تحديث حالة النشر');
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">إدارة الصفحات الثابتة</h1>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse space-y-3">
                  <div className="h-6 bg-gray-200 rounded w-1/3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">إدارة الصفحات الثابتة</h1>
          <p className="text-muted-foreground mt-1">
            قم بإنشاء وتعديل محتوى الصفحات الثابتة مثل من نحن والسياسات
          </p>
        </div>
        <Button onClick={() => setIsModalOpen(true)}>
          <Plus className="h-4 w-4 ml-2" />
          صفحة جديدة
        </Button>
      </div>

      {/* Pages List */}
      <div className="grid gap-4">
        {pages.length === 0 ? (
          <Card>
            <CardContent className="p-12 text-center">
              <p className="text-muted-foreground">لا توجد صفحات بعد</p>
              <Button onClick={() => setIsModalOpen(true)} className="mt-4">
                إنشاء أول صفحة
              </Button>
            </CardContent>
          </Card>
        ) : (
          pages.map((page) => (
            <Card key={page._id}>
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <CardTitle className="text-xl flex items-center gap-2">
                      {page.title}
                      {page.isPublished ? (
                        <Badge variant="default">منشور</Badge>
                      ) : (
                        <Badge variant="secondary">مسودة</Badge>
                      )}
                    </CardTitle>
                    <p className="text-sm text-muted-foreground">/{page.slug}</p>
                    {page.metaDescription && (
                      <p className="text-sm text-muted-foreground mt-2">
                        {page.metaDescription}
                      </p>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleTogglePublish(page)}
                      title={page.isPublished ? 'إخفاء' : 'نشر'}
                    >
                      {page.isPublished ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleEdit(page)}
                    >
                      <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleDelete(page._id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="prose prose-sm max-w-none text-muted-foreground line-clamp-3">
                  {page.content.substring(0, 200)}...
                </div>
                <p className="text-xs text-muted-foreground mt-3">
                  آخر تحديث: {new Date(page.updatedAt).toLocaleDateString('ar-SA')}
                </p>
              </CardContent>
            </Card>
          ))
        )}
      </div>

      {/* Create/Edit Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <CardHeader>
              <CardTitle>
                {editingPage ? 'تعديل الصفحة' : 'إنشاء صفحة جديدة'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="text-sm font-medium">العنوان</label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    required
                  />
                </div>

                <div>
                  <label className="text-sm font-medium">
                    الرابط (Slug)
                  </label>
                  <input
                    type="text"
                    value={formData.slug}
                    onChange={(e) => setFormData({ ...formData, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    placeholder="about-us"
                    required
                    disabled={!!editingPage}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    سيظهر كـ: /{formData.slug || 'about-us'}
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">وصف الميتا (SEO)</label>
                  <input
                    type="text"
                    value={formData.metaDescription}
                    onChange={(e) => setFormData({ ...formData, metaDescription: e.target.value })}
                    className="w-full mt-1 p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                    maxLength={160}
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    {formData.metaDescription.length}/160 حرف
                  </p>
                </div>

                <div>
                  <label className="text-sm font-medium">المحتوى</label>
                  <textarea
                    value={formData.content}
                    onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                    className="w-full mt-1 p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary min-h-[400px] font-mono text-sm"
                    required
                    placeholder="يمكنك استخدام HTML هنا..."
                  />
                  <p className="text-xs text-muted-foreground mt-1">
                    يمكنك استخدام HTML لتنسيق المحتوى
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="isPublished"
                    checked={formData.isPublished}
                    onChange={(e) => setFormData({ ...formData, isPublished: e.target.checked })}
                    className="rounded"
                  />
                  <label htmlFor="isPublished" className="text-sm font-medium">
                    نشر الصفحة
                  </label>
                </div>

                <div className="flex gap-2 pt-4">
                  <Button type="submit" className="flex-1">
                    {editingPage ? 'حفظ التغييرات' : 'إنشاء الصفحة'}
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={resetForm}
                    className="flex-1"
                  >
                    إلغاء
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
