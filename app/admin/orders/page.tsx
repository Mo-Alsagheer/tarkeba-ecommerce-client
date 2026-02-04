'use client';

import { useState } from 'react';
import { useAdminGetOrdersQuery } from '@/features/api/ordersApi';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Search, Eye } from 'lucide-react';
import Link from 'next/link';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { TITLES, BUTTONS, LABELS, MESSAGES, PLACEHOLDERS, STATUS, DESCRIPTIONS, CURRENCY } from '@/constants';

const statusColors = {
  pending: 'bg-yellow-100 text-yellow-800',
  confirmed: 'bg-blue-100 text-blue-800',
  processing: 'bg-purple-100 text-purple-800',
  shipped: 'bg-indigo-100 text-indigo-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminOrdersPage() {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string>('');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');

  const { data, isLoading, error } = useAdminGetOrdersQuery({
    page,
    limit: 10,
    status: (status || undefined) as 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled' | 'refunded' | undefined,
    search,
     
  });

  // Debug logging
  console.log('Orders data:', data);
  console.log('Orders error:', error);

  const handleSearch = () => {
    setSearch(searchInput);
    setPage(1);
  };

  const handleStatusFilter = (value: string) => {
    setStatus(value === 'all' ? '' : value);
    setPage(1);
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">{TITLES.ADMIN.ORDERS}</h1>
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">{TITLES.ADMIN.ORDERS}</h1>
        <Badge variant="secondary" className="text-lg px-4 py-2">
          {data?.orders.length || 0} {LABELS.ORDER.ORDER_COUNT}
        </Badge>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex gap-4 flex-wrap">
            <div className="flex-1 min-w-[300px]">
              <div className="flex gap-2">
                <Input
                  placeholder={PLACEHOLDERS.SEARCH.ORDERS}
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch}>
                  <Search className="h-4 w-4" />
                </Button>
              </div>
            </div>
            <Select value={status || 'all'} onValueChange={handleStatusFilter}>
              <SelectTrigger className="w-[200px]">
                <SelectValue placeholder={PLACEHOLDERS.SELECT.ALL_STATUSES} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">{PLACEHOLDERS.SELECT.ALL_STATUSES}</SelectItem>
                <SelectItem value="pending">{STATUS.ORDER.PENDING}</SelectItem>
                <SelectItem value="confirmed">{STATUS.ORDER.CONFIRMED}</SelectItem>
                <SelectItem value="processing">{STATUS.ORDER.PROCESSING}</SelectItem>
                <SelectItem value="shipped">{STATUS.ORDER.SHIPPED}</SelectItem>
                <SelectItem value="delivered">{STATUS.ORDER.DELIVERED}</SelectItem>
                <SelectItem value="cancelled">{STATUS.ORDER.CANCELLED}</SelectItem>
                <SelectItem value="refunded">{STATUS.ORDER.REFUNDED}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>
      

      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-600">{MESSAGES.ERROR.ORDERS_LOAD_ERROR}</p>
          </CardContent>
        </Card>
      )}

      {/* Orders List */}
      <Card>
        <CardHeader>
          <CardTitle>{TITLES.ADMIN.ORDERS_LIST}</CardTitle>
        </CardHeader>
        <CardContent>
          {data?.orders.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              {MESSAGES.EMPTY.NO_ORDERS_FOUND}
            </div>
          ) : (
            <div className="space-y-4">
              {data?.orders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex-1 space-y-1">
                    <div className="flex items-center gap-3">
                      <span className="font-semibold">#{order.orderNumber || 'N/A'}</span>
                      <Badge className={statusColors[order.status]}>
                        {STATUS.ORDER[order.status.toUpperCase() as keyof typeof STATUS.ORDER]}
                      </Badge>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      <span className="font-medium">{order.shippingAddress?.customerName || order.userID?.username || 'N/A'}</span>
                      <span className="mx-2">•</span>
                      <span>{order.email || order.userID?.email || 'N/A'}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {new Date(order.createdAt).toLocaleDateString('ar-SA', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </div>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-left">
                      <p className="font-bold text-lg">{(order.totalAmount ?? 0).toLocaleString('ar-SA')} {CURRENCY.DEFAULT}</p>
                      {/* <p className="text-sm text-muted-foreground">{order.items?.length ?? 0} {LABELS.ORDER.PRODUCT_COUNT}</p> */}
                    </div>
                    <Link href={`/admin/orders/${order._id}`}>
                      <Button variant="outline" size="sm">
                        <Eye className="h-4 w-4 ml-2" />
                        {BUTTONS.VIEW_DETAILS}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {data && data.total > 10 && (
            <div className="flex justify-center gap-2 mt-6">
              <Button
                variant="outline"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                {BUTTONS.PREVIOUS}
              </Button>
              <span className="px-4 py-2 text-sm text-muted-foreground">
                {DESCRIPTIONS.PAGINATION.PAGE_OF(page, Math.ceil(data.total / 10))}
              </span>
              <Button
                variant="outline"
                disabled={page >= Math.ceil(data.total / 10)}
                onClick={() => setPage(page + 1)}
              >
                {BUTTONS.NEXT}
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
