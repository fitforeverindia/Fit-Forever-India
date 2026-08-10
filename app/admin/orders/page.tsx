'use client';

import { useState } from 'react';
import {
  ShoppingCart,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  Truck,
  XCircle,
  MapPin,
  Phone,
  User,
  IndianRupee,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from '@/components/ui/sheet';

type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';

type OrderItem = {
  id: string;
  customerName: string;
  customerPhone: string;
  customerCity: string;
  address: string;
  productName: string;
  price: number;
  quantity: number;
  status: OrderStatus;
  date: string;
  paymentMethod: string;
};

const SEED_ORDERS: OrderItem[] = [
  {
    id: 'ORD-9842',
    customerName: 'Rajesh Sharma',
    customerPhone: '+91 98765 43210',
    customerCity: 'Mumbai, Maharashtra',
    address: '402, Seawood Towers, Bandra West, Mumbai - 400050',
    productName: 'Luxury 4D Zero-Gravity Massage Chair',
    price: 149999,
    quantity: 1,
    status: 'Delivered',
    date: 'Today, 2:15 PM',
    paymentMethod: 'Online UPI (Paid)',
  },
  {
    id: 'ORD-9841',
    customerName: 'Priya Patel',
    customerPhone: '+91 98123 45678',
    customerCity: 'Ahmedabad, Gujarat',
    address: '12, Bodakdev Enclave, SG Highway, Ahmedabad - 380054',
    productName: 'Commercial Motorized Treadmill FF-5000',
    price: 54999,
    quantity: 1,
    status: 'Processing',
    date: 'Today, 11:40 AM',
    paymentMethod: 'Net Banking (Paid)',
  },
  {
    id: 'ORD-9840',
    customerName: 'Vikram Singh',
    customerPhone: '+91 99887 76655',
    customerCity: 'New Delhi, Delhi',
    address: 'B-45, Vasant Vihar, New Delhi - 110057',
    productName: 'Magnetic Resistance Spin Bike Pro',
    price: 28999,
    quantity: 1,
    status: 'Shipped',
    date: 'Yesterday',
    paymentMethod: 'Cash on Delivery (COD)',
  },
  {
    id: 'ORD-9839',
    customerName: 'Anita Verma',
    customerPhone: '+91 97654 32109',
    customerCity: 'Bengaluru, Karnataka',
    address: '88, Indiranagar 100ft Road, Bengaluru - 560038',
    productName: 'Multi-Station Heavy Duty Home Gym',
    price: 79999,
    quantity: 1,
    status: 'Delivered',
    date: 'Yesterday',
    paymentMethod: 'Credit Card (Paid)',
  },
  {
    id: 'ORD-9838',
    customerName: 'Amit Gupta',
    customerPhone: '+91 95432 10987',
    customerCity: 'Pune, Maharashtra',
    address: '701, Koregaon Park Plaza, Pune - 411001',
    productName: 'Foot & Calves Kneading Massager',
    price: 18999,
    quantity: 1,
    status: 'Processing',
    date: 'Aug 6, 2026',
    paymentMethod: 'Online UPI (Paid)',
  },
  {
    id: 'ORD-9837',
    customerName: 'Suresh Kumar',
    customerPhone: '+91 94567 89012',
    customerCity: 'Hyderabad, Telangana',
    address: '15, Jubilee Hills, Hyderabad - 500033',
    productName: 'Elliptical Cross Trainer Machine',
    price: 36999,
    quantity: 1,
    status: 'Pending',
    date: 'Aug 5, 2026',
    paymentMethod: 'Cash on Delivery (COD)',
  },
];

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<OrderItem[]>(SEED_ORDERS);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [selectedOrder, setSelectedOrder] = useState<OrderItem | null>(null);

  const filteredOrders = orders.filter((ord) => {
    const matchesSearch =
      ord.id.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.customerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      ord.productName.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus =
      selectedStatus === 'all' || ord.status.toLowerCase() === selectedStatus.toLowerCase();
    return matchesSearch && matchesStatus;
  });

  const handleUpdateStatus = (id: string, newStatus: OrderStatus) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
    );
    if (selectedOrder?.id === id) {
      setSelectedOrder((prev) => (prev ? { ...prev, status: newStatus } : null));
    }
    toast.success(`Order ${id} status updated to ${newStatus}`);
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Order Fulfillment ({orders.length})
          </h2>
          <p className="text-xs text-slate-500">
            Track customer purchases, update shipping stages, and view delivery details.
          </p>
        </div>
      </div>

      {/* Search & Status Tabs */}
      <div className="flex flex-col md:flex-row gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by Order ID, customer, or product..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-slate-200 bg-slate-50 pl-10 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl"
          />
        </div>

        {/* Status Filter Dropdown */}
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 focus:outline-none focus:border-primary"
        >
          <option value="all">All Order Statuses</option>
          <option value="pending">Pending</option>
          <option value="processing">Processing</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-slate-500 uppercase tracking-wider font-semibold bg-slate-50/80">
                <th className="py-3.5 px-4">Order ID</th>
                <th className="py-3.5 px-4">Customer Info</th>
                <th className="py-3.5 px-4">Item Ordered</th>
                <th className="py-3.5 px-4">Amount</th>
                <th className="py-3.5 px-4">Status & Update</th>
                <th className="py-3.5 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 font-medium">
              {filteredOrders.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-400">
                    No orders match your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredOrders.map((ord) => (
                  <tr key={ord.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-primary">{ord.id}</p>
                      <p className="text-[10px] text-slate-400">{ord.date}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-semibold text-slate-900">{ord.customerName}</p>
                      <p className="text-[10px] text-slate-500">{ord.customerCity}</p>
                    </td>

                    <td className="py-3.5 px-4 text-slate-700 max-w-xs truncate">
                      {ord.productName}
                    </td>

                    <td className="py-3.5 px-4">
                      <p className="font-mono font-bold text-slate-900">
                        ₹{(ord.price * ord.quantity).toLocaleString('en-IN')}
                      </p>
                      <p className="text-[10px] text-slate-500">{ord.paymentMethod}</p>
                    </td>

                    <td className="py-3.5 px-4">
                      <select
                        value={ord.status}
                        onChange={(e) =>
                          handleUpdateStatus(ord.id, e.target.value as OrderStatus)
                        }
                        className={`h-8 rounded-lg border text-xs font-bold px-2 focus:outline-none ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : ord.status === 'Shipped'
                            ? 'bg-blue-50 text-blue-700 border-blue-200'
                            : ord.status === 'Processing'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : 'bg-slate-100 text-slate-700 border-slate-200'
                        }`}
                      >
                        <option value="Pending" className="bg-white text-slate-900">Pending</option>
                        <option value="Processing" className="bg-white text-slate-900">Processing</option>
                        <option value="Shipped" className="bg-white text-slate-900">Shipped</option>
                        <option value="Delivered" className="bg-white text-slate-900">Delivered</option>
                        <option value="Cancelled" className="bg-white text-slate-900">Cancelled</option>
                      </select>
                    </td>

                    <td className="py-3.5 px-4 text-right">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => setSelectedOrder(ord)}
                        className="h-8 rounded-lg border-slate-200 bg-slate-50 text-xs text-slate-700 hover:border-primary hover:text-primary"
                      >
                        <Eye className="mr-1 h-3.5 w-3.5" />
                        Details
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Order Detail Drawer */}
      <Sheet open={!!selectedOrder} onOpenChange={(open) => !open && setSelectedOrder(null)}>
        <SheetContent side="right" className="w-full max-w-md bg-white border-l border-slate-200 text-slate-900 p-6 overflow-y-auto shadow-2xl">
          {selectedOrder && (
            <div className="space-y-6">
              <SheetHeader>
                <div className="flex items-center justify-between">
                  <span className="font-mono text-sm font-bold text-primary">
                    {selectedOrder.id}
                  </span>
                  <span className="text-xs text-slate-400">{selectedOrder.date}</span>
                </div>
                <SheetTitle className="font-display text-xl font-bold text-slate-900 text-left">
                  Order Details & Shipping Info
                </SheetTitle>
                <SheetDescription className="text-xs text-slate-500 text-left">
                  Full breakdown of customer shipping address and purchased item.
                </SheetDescription>
              </SheetHeader>

              {/* Status Banner */}
              <div className="rounded-2xl bg-slate-50 p-4 border border-slate-200 flex items-center justify-between">
                <span className="text-xs font-semibold uppercase text-slate-500">Current Status</span>
                <span className="font-bold text-primary">{selectedOrder.status}</span>
              </div>

              {/* Customer Info */}
              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-700">
                  Customer & Shipping Address
                </h4>

                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <User className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <span className="font-bold text-slate-900">{selectedOrder.customerName}</span>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <Phone className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <span>{selectedOrder.customerPhone}</span>
                </div>

                <div className="flex items-start gap-2 text-xs text-slate-700">
                  <MapPin className="h-4 w-4 shrink-0 text-primary mt-0.5" />
                  <span>{selectedOrder.address}</span>
                </div>
              </div>

              {/* Product Info */}
              <div className="space-y-3 rounded-2xl bg-slate-50 p-4 border border-slate-200">
                <h4 className="font-display text-xs font-bold uppercase tracking-wider text-slate-700">
                  Purchased Item
                </h4>

                <div className="flex items-center justify-between text-xs py-2 border-b border-slate-200">
                  <span className="font-semibold text-slate-900">{selectedOrder.productName}</span>
                  <span className="font-mono text-slate-500">x{selectedOrder.quantity}</span>
                </div>

                <div className="flex items-center justify-between text-xs pt-2">
                  <span className="text-slate-500">Payment Method:</span>
                  <span className="font-medium text-emerald-600">{selectedOrder.paymentMethod}</span>
                </div>

                <div className="flex items-center justify-between text-sm font-bold pt-2 border-t border-slate-200">
                  <span className="text-slate-900">Total Amount Paid:</span>
                  <span className="font-mono text-primary text-base">
                    ₹{(selectedOrder.price * selectedOrder.quantity).toLocaleString('en-IN')}
                  </span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="space-y-2 pt-4">
                <Button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'Delivered')}
                  className="w-full rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  <CheckCircle2 className="mr-2 h-4 w-4" />
                  Mark as Delivered
                </Button>
                <Button
                  onClick={() => handleUpdateStatus(selectedOrder.id, 'Shipped')}
                  variant="outline"
                  className="w-full rounded-xl border-slate-200 bg-slate-50 text-slate-800 hover:bg-slate-100"
                >
                  <Truck className="mr-2 h-4 w-4 text-blue-600" />
                  Mark as Dispatched / Shipped
                </Button>
              </div>
            </div>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );

}
