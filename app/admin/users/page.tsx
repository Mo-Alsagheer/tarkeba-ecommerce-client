'use client';

import { useState } from 'react';
import {
  useGetAdminUsersQuery,
  useUpdateUserRolesMutation,
  useDeleteUserMutation,
  type AdminUser,
} from '@/features/api/adminApi';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Users as UsersIcon,
  Search,
  Shield,
  Trash2,
  X,
  Save,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { toast } from 'sonner';

const AVAILABLE_ROLES = ['customer', 'admin', 'moderator'];

export default function UsersPage() {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const { data, isLoading, error } = useGetAdminUsersQuery({
    page,
    limit: 10,
    search: searchQuery,
  });
  const [updateUserRoles] = useUpdateUserRolesMutation();
  const [deleteUser] = useDeleteUserMutation();

  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedRoles, setSelectedRoles] = useState<string[]>([]);

  const users = data?.users || [];
  const totalPages = data?.pages || 1;

  const startEdit = (user: AdminUser) => {
    setEditingId(user._id);
    setSelectedRoles([...user.roles]);
  };

  const cancelEdit = () => {
    setEditingId(null);
    setSelectedRoles([]);
  };

  const handleUpdateRoles = async (userId: string) => {
    if (selectedRoles.length === 0) {
      toast.error('يجب اختيار دور واحد على الأقل');
      return;
    }

    try {
      await updateUserRoles({ userId, roles: selectedRoles }).unwrap();
      toast.success('تم تحديث الأدوار بنجاح');
      setEditingId(null);
      setSelectedRoles([]);
    } catch {
      toast.error('فشل في تحديث الأدوار');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`هل أنت متأكد من حذف المستخدم "${name}"؟ هذا الإجراء لا يمكن التراجع عنه.`)) {
      return;
    }

    try {
      await deleteUser(id).unwrap();
      toast.success('تم حذف المستخدم بنجاح');
    } catch {
      toast.error('فشل في حذف المستخدم');
    }
  };

  const toggleRole = (role: string) => {
    setSelectedRoles((prev) =>
      prev.includes(role) ? prev.filter((r) => r !== role) : [...prev, role]
    );
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        </div>
        <Card>
          <CardContent className="p-8">
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-20 bg-gray-200 rounded"></div>
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
        <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-8 text-center">
            <p className="text-red-600">حدث خطأ في تحميل المستخدمين</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <UsersIcon className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold">إدارة المستخدمين</h1>
        </div>
        <div className="text-sm text-muted-foreground">
          إجمالي المستخدمين: {data?.total || 0}
        </div>
      </div>

      {/* Search Bar */}
      <Card>
        <CardContent className="pt-6">
          <div className="relative">
            <Search className="absolute right-3 top-3 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن مستخدم (الاسم أو البريد الإلكتروني)..."
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setPage(1); // Reset to first page on search
              }}
              className="pr-10"
            />
          </div>
        </CardContent>
      </Card>

      {/* Users List */}
      <Card>
        <CardContent className="p-0">
          <div className="divide-y">
            {users.length === 0 ? (
              <div className="p-8 text-center text-muted-foreground">
                {searchQuery ? 'لم يتم العثور على نتائج' : 'لا يوجد مستخدمين'}
              </div>
            ) : (
              users.map((user) => (
                <div key={user._id} className="p-4">
                  {editingId === user._id ? (
                    <div className="space-y-4">
                      <div className="space-y-2">
                        <Label>الأدوار</Label>
                        <div className="flex flex-wrap gap-2">
                          {AVAILABLE_ROLES.map((role) => (
                            <Button
                              key={role}
                              type="button"
                              size="sm"
                              variant={selectedRoles.includes(role) ? 'default' : 'outline'}
                              onClick={() => toggleRole(role)}
                            >
                              {role === 'admin' && '👑 '}
                              {role === 'moderator' && '🛡️ '}
                              {role === 'customer' && '👤 '}
                              {role === 'admin' ? 'مدير' : role === 'moderator' ? 'مشرف' : 'عميل'}
                            </Button>
                          ))}
                        </div>
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleUpdateRoles(user._id)}>
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
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-semibold text-lg">{user.name}</h3>
                          {user.isVerified && (
                            <Badge variant="outline" className="text-xs">
                              ✓ موثق
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                        {user.phone && (
                          <p className="text-sm text-muted-foreground" dir="ltr">
                            {user.phone}
                          </p>
                        )}
                        <div className="flex flex-wrap gap-2">
                          {user.roles.map((role) => (
                            <Badge
                              key={role}
                              variant={role === 'admin' ? 'default' : 'secondary'}
                            >
                              {role === 'admin' && '👑 '}
                              {role === 'moderator' && '🛡️ '}
                              {role === 'customer' && '👤 '}
                              {role === 'admin' ? 'مدير' : role === 'moderator' ? 'مشرف' : 'عميل'}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          انضم في: {new Date(user.createdAt).toLocaleDateString('ar-SA')}
                        </p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => startEdit(user)}
                        >
                          <Shield className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="destructive"
                          onClick={() => handleDelete(user._id, user.name)}
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

      {/* Pagination */}
      {totalPages > 1 && (
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                <ChevronRight className="h-4 w-4 ml-2" />
                السابق
              </Button>
              <span className="text-sm text-muted-foreground">
                صفحة {page} من {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                التالي
                <ChevronLeft className="h-4 w-4 mr-2" />
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
