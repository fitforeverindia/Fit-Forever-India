'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomerAuth } from '@/lib/customer-auth';
import { ShoppingBag, Loader2, ArrowRight, ClipboardList, CheckCircle, Truck, Package } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import type { Order } from '@/lib/types';

export default function AccountOverviewPage() {
  const { user } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  const firstName = user?.name ? user.name.trim().split(' ')[0] : 'Customer';

  useEffect(() => {
    const customerId = user?.id;
    if (!customerId) return;
    
    async function loadOrders() {
      try {
        const res = await fetch(`/api/account/orders?customerId=${customerId}`);
        if (res.ok) {
          const data = await res.json();
          setOrders(data || []);
        }
      } catch (err) {
        console.error('Failed to load orders for overview:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  // Calculate order statistics
  const totalOrders = orders.length;
  const processingOrders = orders.filter(o => o.status === 'Processing').length;
  const shippedOrders = orders.filter(o => o.status === 'Shipped').length;
  const deliveredOrders = orders.filter(o => o.status === 'Delivered').length;

  const recentOrders = orders.slice(0, 3); // show latest 3 orders

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Delivered':
        return 'bg-emerald-50 text-emerald-700 border-emerald-100';
      case 'Shipped':
        return 'bg-blue-50 text-blue-700 border-blue-100';
      case 'Processing':
        return 'bg-amber-50 text-amber-700 border-amber-100';
      case 'Cancelled':
        return 'bg-red-50 text-red-700 border-red-100';
      default:
        return 'bg-slate-50 text-slate-700 border-slate-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Delivered':
        return <CheckCircle className="h-3 w-3 text-emerald-500 mr-1" />;
      case 'Shipped':
        return <Truck className="h-3 w-3 text-blue-500 mr-1" />;
      case 'Processing':
        return <Loader2 className="h-3 w-3 animate-spin text-amber-500 mr-1" />;
      default:
        return <Package className="h-3 w-3 text-slate-500 mr-1" />;
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Welcome Banner */}
      <div className="rounded-2xl border border-slate-200/50 bg-white p-6 md:p-8 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-black text-slate-900 md:text-3xl tracking-tight">
            Hello, {firstName} 👋
          </h1>
          <p className="text-sm font-medium text-slate-500 mt-1">
            Welcome back to FitForever India. Manage your account settings and track your orders.
          </p>
        </div>
        <Button asChild className="rounded-full bg-primary font-bold text-white shadow-md hover:bg-primary/95 shrink-0 self-start md:self-auto">
          <Link href="/products">
            Start Shopping
            <ArrowRight className="ml-1.5 h-4 w-4" />
          </Link>
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {/* Card 1: Total Orders */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Orders</span>
              <div className="rounded-xl bg-slate-50 p-2 text-slate-500">
                <ClipboardList className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-8 w-12 rounded-lg" />
              ) : (
                <p className="text-3xl font-black text-slate-800 font-mono">{totalOrders}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 2: Processing */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Processing</span>
              <div className="rounded-xl bg-amber-50 p-2 text-amber-500">
                <Loader2 className="h-5 w-5 animate-spin" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-8 w-12 rounded-lg" />
              ) : (
                <p className="text-3xl font-black text-slate-800 font-mono">{processingOrders}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 3: Shipped */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Shipped</span>
              <div className="rounded-xl bg-blue-50 p-2 text-blue-500">
                <Truck className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-8 w-12 rounded-lg" />
              ) : (
                <p className="text-3xl font-black text-slate-800 font-mono">{shippedOrders}</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Card 4: Delivered */}
        <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Delivered</span>
              <div className="rounded-xl bg-emerald-50 p-2 text-emerald-500">
                <CheckCircle className="h-5 w-5" />
              </div>
            </div>
            <div className="mt-3">
              {loading ? (
                <Skeleton className="h-8 w-12 rounded-lg" />
              ) : (
                <p className="text-3xl font-black text-slate-800 font-mono">{deliveredOrders}</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Orders Section */}
      <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm overflow-hidden">
        <div className="flex items-center justify-between border-b border-slate-100 p-5 md:p-6">
          <div>
            <h2 className="font-display text-base font-bold text-slate-900">
              Recent Orders
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Your latest orders and their shipment status.</p>
          </div>
          {orders.length > 0 && (
            <Button asChild variant="ghost" size="sm" className="rounded-full text-xs font-bold text-primary hover:text-primary/90 hover:bg-slate-50">
              <Link href="/account/orders" className="flex items-center gap-1">
                View All Orders
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </Button>
          )}
        </div>

        <div className="p-5 md:p-6">
          {loading ? (
            <div className="space-y-4">
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
              <Skeleton className="h-16 w-full rounded-xl" />
            </div>
          ) : recentOrders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="rounded-full bg-slate-50 p-4 text-slate-400 mb-4 border border-slate-100">
                <ShoppingBag className="h-7 w-7" />
              </div>
              <h3 className="font-display text-sm font-bold text-slate-800">No orders yet</h3>
              <p className="text-xs text-slate-400 mt-1 max-w-sm">You haven&apos;t placed any orders yet. Let&apos;s get you started on your fitness journey.</p>
              <Button asChild className="mt-4 rounded-full bg-primary font-bold text-white shadow-sm px-6 text-xs h-9">
                <Link href="/products">Browse Catalog</Link>
              </Button>
            </div>
          ) : (
            <div className="divide-y divide-slate-100 -my-4">
              {recentOrders.map((order) => {
                // Calculate item quantity sum
                const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
                const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                  day: 'numeric',
                  month: 'short',
                  year: 'numeric',
                });

                return (
                  <div key={order.id} className="py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2.5">
                        <span className="font-mono text-xs font-bold text-slate-900">{order.id}</span>
                        <span className={`inline-flex items-center border rounded-full px-2 py-0.5 text-[10px] font-bold ${getStatusColor(order.status)}`}>
                          {getStatusIcon(order.status)}
                          {order.status}
                        </span>
                      </div>
                      <p className="text-[11px] text-slate-400 font-medium">
                        Placed on {dateStr} &bull; {itemCount} {itemCount === 1 ? 'item' : 'items'}
                      </p>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6">
                      <p className="font-mono text-sm font-bold text-slate-950">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                      <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold border-slate-200/80 hover:bg-slate-50">
                        <Link href={`/account/orders/${order.id}`}>View Details</Link>
                      </Button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
