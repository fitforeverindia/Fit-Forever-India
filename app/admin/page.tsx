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

const REVENUE_DATA = [
  { month: 'Jan', revenue: 980000, orders: 110 },
  { month: 'Feb', revenue: 1120000, orders: 135 },
  { month: 'Mar', revenue: 1340000, orders: 160 },
  { month: 'Apr', revenue: 1250000, orders: 145 },
  { month: 'May', revenue: 1580000, orders: 190 },
  { month: 'Jun', revenue: 1690000, orders: 210 },
  { month: 'Jul', revenue: 1845000, orders: 240 },
];

const CATEGORY_SALES = [
  { category: 'Massage Chairs', sales: 890000 },
  { category: 'Treadmills', sales: 460000 },
  { category: 'Spin Bikes', sales: 240000 },
  { category: 'Cross Trainers', sales: 180000 },
  { category: 'Home Gyms', sales: 120000 },
];

const RECENT_ORDERS = [
  {
    id: 'ORD-9842',
    customer: 'Rajesh Sharma',
    product: 'Luxury 4D Zero-Gravity Massage Chair',
    amount: 149999,
    status: 'Delivered',
    date: 'Today, 2:15 PM',
  },
  {
    id: 'ORD-9841',
    customer: 'Priya Patel',
    product: 'Commercial Motorized Treadmill FF-5000',
    amount: 54999,
    status: 'Processing',
    date: 'Today, 11:40 AM',
  },
  {
    id: 'ORD-9840',
    customer: 'Vikram Singh',
    product: 'Magnetic Resistance Spin Bike Pro',
    amount: 28999,
    status: 'Shipped',
    date: 'Yesterday',
  },
  {
    id: 'ORD-9839',
    customer: 'Anita Verma',
    product: 'Multi-Station Heavy Duty Home Gym',
    amount: 79999,
    status: 'Delivered',
    date: 'Yesterday',
  },
  {
    id: 'ORD-9838',
    customer: 'Amit Gupta',
    product: 'Foot & Calves Kneading Massager',
    amount: 18999,
    status: 'Processing',
    date: 'Aug 6, 2026',
  },
];

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Top Banner / Welcome */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1 text-xs font-bold text-primary border border-primary/20">
            <Sparkles className="h-3.5 w-3.5" />
            Fit Forever E-Commerce Console
          </div>
          <h2 className="mt-3 font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Store Performance & Analytics
          </h2>
          <p className="mt-1 text-xs text-slate-500">
            Real-time sales breakdown, customer orders, and catalog inventory status.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Button asChild size="sm" className="rounded-xl bg-primary font-bold text-primary-foreground hover:bg-primary/90 shadow-sm">
            <Link href="/admin/products">
              <Package className="mr-1.5 h-4 w-4" />
              Manage Products
            </Link>
          </Button>
          <Button asChild size="sm" variant="outline" className="rounded-xl border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100">
            <Link href="/admin/orders">
              <ShoppingCart className="mr-1.5 h-4 w-4 text-primary" />
              View All Orders
            </Link>
          </Button>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Revenue
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100">
              <IndianRupee className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            ₹18,45,000
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-emerald-600">
            <TrendingUp className="h-3.5 w-3.5" />
            <span className="font-bold">+18.4%</span>
            <span className="text-slate-400">vs last month</span>
          </div>
        </div>

        {/* Total Orders */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Total Orders
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 text-primary border border-primary/20">
              <ShoppingCart className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            1,420
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-primary">
            <ArrowUpRight className="h-3.5 w-3.5" />
            <span className="font-bold">+24 Today</span>
            <span className="text-slate-400">fulfilled orders</span>
          </div>
        </div>

        {/* Active Products */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Active Catalog
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-50 text-amber-600 border border-amber-100">
              <Package className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            48 Items
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-slate-800">6 Main Categories</span>
            <span>in store</span>
          </div>
        </div>

        {/* Showrooms */}
        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold uppercase tracking-wider text-slate-500">
              Nationwide Showrooms
            </span>
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-purple-50 text-purple-600 border border-purple-100">
              <MapPin className="h-5 w-5" />
            </div>
          </div>
          <div className="mt-4 font-display text-2xl font-extrabold text-slate-900 sm:text-3xl">
            12 Outlets
          </div>
          <div className="mt-2 flex items-center gap-1.5 text-xs text-slate-500">
            <span className="font-bold text-slate-800">Pan-India</span>
            <span>metro coverage</span>
          </div>
        </div>
      </div>

      {/* Analytics Charts Grid */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Revenue Trend Line Chart */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm lg:col-span-2">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Revenue Growth Trend
              </h3>
              <p className="text-xs text-slate-500">Monthly gross sales across India (₹)</p>
            </div>
            <span className="text-xs font-bold text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full">
              2026 YTD
            </span>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={REVENUE_DATA}>
                <defs>
                  <linearGradient id="colorRev" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#EA580C" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#EA580C" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="month" stroke="#64748B" fontSize={12} />
                <YAxis stroke="#64748B" fontSize={12} tickFormatter={(v) => `₹${v / 100000}L`} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                />
                <Area type="monotone" dataKey="revenue" stroke="#EA580C" strokeWidth={3} fillOpacity={1} fill="url(#colorRev)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Sales Breakdown */}
        <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="font-display font-bold text-lg text-slate-900">
                Sales by Category
              </h3>
              <p className="text-xs text-slate-500">Top revenue generating lines</p>
            </div>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={CATEGORY_SALES} layout="vertical">
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" horizontal={false} />
                <XAxis type="number" stroke="#64748B" fontSize={10} tickFormatter={(v) => `₹${v / 100000}L`} />
                <YAxis dataKey="category" type="category" stroke="#475569" fontSize={11} width={100} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#FFFFFF', borderColor: '#E2E8F0', borderRadius: '12px', color: '#0F172A', boxShadow: '0 10px 25px rgba(0,0,0,0.08)' }}
                  formatter={(value: any) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Sales']}
                />
                <Bar dataKey="sales" fill="#EA580C" radius={[0, 8, 8, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Recent Orders Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm">
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 mb-6">
          <div>
            <h3 className="font-display font-bold text-lg text-slate-900">
              Recent Customer Orders
            </h3>
            <p className="text-xs text-slate-500">Latest transactions needing fulfillment</p>
          </div>
          <Button asChild size="sm" variant="ghost" className="text-xs text-primary hover:text-primary/80">
            <Link href="/admin/orders">
              View All Orders ({1420})
              <ArrowRight className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50/80">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer</th>
                <th className="py-3.5 px-4">Product</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {RECENT_ORDERS.map((ord) => (
                <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                  <td className="py-3.5 px-4 font-mono font-bold text-primary">
                    {ord.id}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-semibold">
                    {ord.customer}
                  </td>
                  <td className="py-3.5 px-4 text-slate-600 max-w-xs truncate">
                    {ord.product}
                  </td>
                  <td className="py-3.5 px-4 text-slate-900 font-bold font-mono">
                    ₹{ord.amount.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3.5 px-4">
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[10px] font-bold ${
                        ord.status === 'Delivered'
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : ord.status === 'Shipped'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-amber-50 text-amber-700 border border-amber-200'
                      }`}
                    >
                      {ord.status === 'Delivered' && <CheckCircle2 className="h-3 w-3" />}
                      {ord.status === 'Shipped' && <Truck className="h-3 w-3" />}
                      {ord.status === 'Processing' && <Clock className="h-3 w-3" />}
                      {ord.status}
                    </span>
                  </td>
                  <td className="py-3.5 px-4 text-slate-500">
                    {ord.date}
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

