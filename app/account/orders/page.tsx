'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCustomerAuth } from '@/lib/customer-auth';
import { ShoppingBag, Loader2, ArrowRight, ClipboardList, CheckCircle, Truck, Package, XCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';
import { cn } from '@/lib/utils';
import type { Order } from '@/lib/types';

type FilterStatus = 'all' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

export default function MyOrdersPage() {
  const { user } = useCustomerAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeFilter, setActiveFilter] = useState<FilterStatus>('all');

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
        console.error('Failed to load orders:', err);
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, [user]);

  // Filters items dynamically
  const filteredOrders = orders.filter((order) => {
    if (activeFilter === 'all') return true;
    return order.status === activeFilter;
  });

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
      case 'Cancelled':
        return <XCircle className="h-3 w-3 text-red-500 mr-1" />;
      default:
        return <Package className="h-3 w-3 text-slate-500 mr-1" />;
    }
  };

  const filterTabs: { label: string; value: FilterStatus }[] = [
    { label: 'All Orders', value: 'all' },
    { label: 'Processing', value: 'Processing' },
    { label: 'Shipped', value: 'Shipped' },
    { label: 'Delivered', value: 'Delivered' },
    { label: 'Cancelled', value: 'Cancelled' },
  ];

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="font-display text-xl font-bold text-slate-900 md:text-2xl">
          My Orders
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Track and view invoices for all your purchases.</p>
      </div>

      {/* Filter Tabs */}
      <div className="flex overflow-x-auto gap-1.5 pb-2.5 hide-scrollbar border-b border-slate-100">
        {filterTabs.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setActiveFilter(tab.value)}
            className={cn(
              'rounded-full px-4 py-2 text-xs font-semibold tracking-wide transition-all border shrink-0',
              activeFilter === tab.value
                ? 'bg-slate-900 border-slate-900 text-white shadow-sm'
                : 'bg-white border-slate-200/60 text-slate-500 hover:bg-slate-50 hover:text-slate-800'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Orders Container */}
      <div className="rounded-2xl border border-slate-200/50 bg-white shadow-sm overflow-hidden p-5 md:p-6">
        {loading ? (
          <div className="space-y-5">
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
            <Skeleton className="h-20 w-full rounded-xl" />
          </div>
        ) : filteredOrders.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="rounded-full bg-slate-50 p-5 text-slate-400 mb-4 border border-slate-100">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h3 className="font-display text-sm font-bold text-slate-800">
              {activeFilter === 'all' ? 'No orders yet' : 'No matching orders'}
            </h3>
            <p className="text-xs text-slate-400 mt-1.5 max-w-xs">
              {activeFilter === 'all' 
                ? "You haven't placed any orders yet." 
                : `You don't have any orders currently marked as ${activeFilter}.`}
            </p>
            {activeFilter === 'all' && (
              <Button asChild className="mt-5 rounded-full bg-primary font-bold text-white shadow-md hover:bg-primary/95 px-6 text-xs h-9">
                <Link href="/products">Start Shopping</Link>
              </Button>
            )}
          </div>
        ) : (
          <div className="divide-y divide-slate-100 -my-5">
            {filteredOrders.map((order) => {
              const itemCount = order.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
              const dateStr = new Date(order.createdAt).toLocaleDateString('en-IN', {
                day: 'numeric',
                month: 'short',
                year: 'numeric',
              });

              return (
                <div key={order.id} className="py-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-3">
                      <span className="font-mono text-xs font-bold text-slate-900">{order.id}</span>
                      <span className={`inline-flex items-center border rounded-full px-2.5 py-0.5 text-[10px] font-bold ${getStatusColor(order.status)}`}>
                        {getStatusIcon(order.status)}
                        {order.status}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 font-medium">
                      Placed on {dateStr}
                    </p>
                    
                    {/* Item snippets */}
                    <div className="flex items-center gap-2 mt-2 pt-1 overflow-x-auto hide-scrollbar">
                      {order.items?.map((item) => (
                        <div key={item.id} className="flex items-center gap-2 border border-slate-100 rounded-lg p-1.5 pr-3 shrink-0 bg-slate-50/50">
                          {item.productImage ? (
                            <img
                              src={item.productImage}
                              alt={item.productName}
                              className="h-7 w-7 rounded bg-white object-contain border p-0.5"
                            />
                          ) : (
                            <div className="h-7 w-7 rounded bg-slate-100 flex items-center justify-center text-[10px] font-bold text-slate-400">
                              FF
                            </div>
                          )}
                          <span className="text-[10px] font-semibold text-slate-600 max-w-[140px] truncate">
                            {item.productName}
                          </span>
                          <span className="text-[10px] font-bold text-slate-400">
                            x{item.quantity}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="flex items-center justify-between md:justify-end gap-6 border-t md:border-t-0 pt-3 md:pt-0 border-dashed border-slate-100">
                    <div>
                      <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider text-left md:text-right">Total Amount</p>
                      <p className="font-mono text-sm font-black text-slate-950 mt-0.5">
                        ₹{order.total.toLocaleString('en-IN')}
                      </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="rounded-full text-xs font-bold border-slate-200/80 hover:bg-slate-50 h-9">
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
  );
}
