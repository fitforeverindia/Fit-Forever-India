'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import {
  IndianRupee,
  ShoppingCart,
  Package,
  MapPin,
  TrendingUp,
  ArrowUpRight,
  ArrowRight,
  Sparkles,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  Users,
  Layers,
} from 'lucide-react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  CartesianGrid,
} from 'recharts';
import { Button } from '@/components/ui/button';
import { formatINR } from '@/lib/format';
import { useProductsStore } from '@/lib/products-store';
import { useCategoriesStore } from '@/lib/categories-store';
import { useCustomersStore } from '@/lib/customers-store';

const REVENUE_DATA = [
  { month: 'Jan', revenue: 980000, orders: 110 },
  { month: 'Feb', revenue: 1120000, orders: 135 },
  { month: 'Mar', revenue: 1340000, orders: 160 },
  { month: 'Apr', revenue: 1250000, orders: 145 },
  { month: 'May', revenue: 1580000, orders: 190 },
  { month: 'Jun', revenue: 1690000, orders: 210 },
  { month: 'Jul', revenue: 1845000, orders: 240 },
];

export default function AdminDashboardPage() {
  const { products } = useProductsStore();
  const { categories } = useCategoriesStore();
  const { customers } = useCustomersStore();

  const totalProducts = products.length;
  const activeProducts = products.filter((p) => p.inStock).length;
  const totalCategories = categories.length;
  const totalCustomers = customers.length;
  const totalCatalogValue = products.reduce((acc, p) => acc + (p.price || 0), 0);
  const totalCustomerRevenue = customers.reduce((acc, c) => acc + (c.totalSpent || 0), 0);

  // Category sales breakdown dynamically
  const categorySales = categories.map((cat) => {
    const catProducts = products.filter((p) => p.categorySlug === cat.slug);
    const catValue = catProducts.reduce((acc, p) => acc + (p.price || 0), 0);
    return {
      category: cat.name,
      sales: catValue > 0 ? catValue : 120000,
    };
  });

  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}


      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Customer Revenue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Customer Revenue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {formatINR(totalCustomerRevenue > 0 ? totalCustomerRevenue : 1845000)}
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-bold">+18.4%</span>
            <span className="text-slate-400">lifetime spend</span>
          </div>
        </div>

        {/* Registered Customers */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Customer Accounts
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-50 text-blue-600 border border-blue-100">
              <Users className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {totalCustomers} Accounts
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-blue-600">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-bold">Active DB</span>
            <span className="text-slate-400">registered list</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Database Catalog
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {totalProducts} Products
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-slate-800">{activeProducts} In Stock</span>
            <span>in Supabase DB</span>
          </div>
        </div>

        {/* Catalog Categories */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Product Categories
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <Layers className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            {totalCategories} Lines
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-purple-600">
            <span className="font-bold">Cloudinary</span>
            <span className="text-slate-400">media storage</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Row */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
        {/* Revenue Trend Chart */}
        <div className="lg:col-span-8 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-slate-900 text-lg">Revenue & Growth Overview</h3>
              <p className="text-xs text-slate-500">Monthly sales performance trends</p>
            </div>
            <span className="text-xs font-bold text-emerald-600 bg-emerald-50 px-2.5 py-1 rounded-full border border-emerald-200">
              +18.4% YoY
            </span>
          </div>
          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#C81E4E" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#C81E4E" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#E2E8F0" />
                <XAxis dataKey="month" tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} />
                <YAxis tickLine={false} axisLine={false} tick={{ fill: '#64748B', fontSize: 12 }} tickFormatter={(val) => `₹${val / 100000}L`} />
                <Tooltip
                  formatter={(value: any) => [formatINR(value as number), 'Revenue']}
                  contentStyle={{ backgroundColor: '#1E293B', borderRadius: '16px', color: '#fff', border: 'none' }}
                  itemStyle={{ color: '#FFD700', fontWeight: 'bold' }}
                />
                <Area type="monotone" dataKey="revenue" stroke="#C81E4E" strokeWidth={3} fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Share Bar Chart */}
        <div className="lg:col-span-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm flex flex-col justify-between">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Category Sales Share</h3>
            <p className="text-xs text-slate-500 mb-4">Value distribution across lines</p>
          </div>

          <div className="space-y-4">
            {categorySales.slice(0, 5).map((cat, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold">
                  <span className="text-slate-700">{cat.category}</span>
                  <span className="font-mono font-bold text-slate-900">{formatINR(cat.sales)}</span>
                </div>
                <div className="h-2 w-full rounded-full bg-slate-100 overflow-hidden">
                  <div
                    className="h-full bg-primary rounded-full transition-all duration-500"
                    style={{ width: `${Math.min(100, Math.max(20, (cat.sales / (totalCatalogValue || 1000000)) * 100))}%` }}
                  />
                </div>
              </div>
            ))}
          </div>

          <Button asChild variant="ghost" size="sm" className="mt-6 w-full justify-between text-xs text-primary font-bold hover:bg-primary/5">
            <Link href="/admin/categories">
              <span>View All Category Details</span>
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      {/* Live Recent Products Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="font-display font-bold text-slate-900 text-lg">Database Equipment Items ({totalProducts})</h3>
            <p className="text-xs text-slate-500">Live products stored in Supabase PostgreSQL database</p>
          </div>
          <Button asChild size="sm" variant="outline" className="rounded-xl border-slate-200 text-xs font-bold">
            <Link href="/admin/products">Manage All Equipment</Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3 px-4">Equipment Item</th>
                <th className="py-3 px-4">Model</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Price</th>
                <th className="py-3 px-4">Cloudinary Media</th>
                <th className="py-3 px-4">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {products.slice(0, 5).map((p) => (
                <tr key={p.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-3">
                      <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-slate-200 bg-slate-50 p-1">
                        <img src={p.image} alt={p.name} className="h-full w-full object-contain" />
                      </div>
                      <span className="font-display font-bold text-slate-900 text-sm line-clamp-1">{p.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 font-mono font-bold text-primary">{p.model || 'AM-333'}</td>
                  <td className="py-3 px-4 text-slate-600">{p.categoryName || p.categorySlug}</td>
                  <td className="py-3 px-4 font-mono font-bold text-slate-900">{formatINR(p.price)}</td>
                  <td className="py-3 px-4 font-mono text-[10px] text-emerald-600 font-semibold">
                    {p.image?.includes('cloudinary.com') ? '✓ Cloudinary Cloud' : 'Local / Custom'}
                  </td>
                  <td className="py-3 px-4">
                    {p.inStock ? (
                      <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2 py-0.5 text-[10px] font-bold text-emerald-700 border border-emerald-200">
                        In Stock
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 border border-slate-200">
                        Out of Stock
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
