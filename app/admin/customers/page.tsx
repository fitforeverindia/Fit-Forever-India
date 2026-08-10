'use client';

import { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Edit2,
  Trash2,
  Mail,
  Phone,
  MapPin,
  ShoppingBag,
  IndianRupee,
  CheckCircle2,
  XCircle,
  Filter,
} from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { useCustomersStore } from '@/lib/customers-store';
import { formatINR } from '@/lib/format';
import type { Customer } from '@/lib/types';

const EMPTY_CUSTOMER_FORM: {
  name: string;
  email: string;
  phone: string;
  city: string;
  state: string;
  pincode: string;
  address: string;
  status: 'Active' | 'Inactive';
} = {
  name: '',
  email: '',
  phone: '',
  city: '',
  state: '',
  pincode: '',
  address: '',
  status: 'Active',
};

export default function AdminCustomersPage() {
  const { customers, addCustomer, updateCustomer, deleteCustomer } = useCustomersStore();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');

  // Modal state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [formData, setFormData] = useState(EMPTY_CUSTOMER_FORM);

  // Filter customers
  const filteredCustomers = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.phone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.city.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      statusFilter === 'all' || c.status.toLowerCase() === statusFilter.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  // Calculate metrics
  const totalCustomers = customers.length;
  const activeCount = customers.filter((c) => c.status === 'Active').length;
  const totalRevenue = customers.reduce((acc, curr) => acc + (curr.totalSpent || 0), 0);
  const avgSpend = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

  const handleOpenAdd = () => {
    setEditingCustomer(null);
    setFormData(EMPTY_CUSTOMER_FORM);
    setIsModalOpen(true);
  };

  const handleOpenEdit = (customer: Customer) => {
    setEditingCustomer(customer);
    setFormData({
      name: customer.name,
      email: customer.email,
      phone: customer.phone,
      city: customer.city,
      state: customer.state,
      pincode: customer.pincode || '',
      address: customer.address || '',
      status: customer.status,
    });
    setIsModalOpen(true);
  };

  const handleSaveCustomer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email) {
      toast.error('Please fill in required fields (Name & Email)');
      return;
    }

    if (editingCustomer) {
      await updateCustomer(editingCustomer.id, {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        address: formData.address,
        status: formData.status,
      });
      toast.success(`Updated customer details for "${formData.name}"`);
    } else {
      const newCust: Customer = {
        id: typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : `cust-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        address: formData.address,
        ordersCount: 0,
        totalSpent: 0,
        joinedDate: new Date().toISOString().split('T')[0],
        status: formData.status,
      };
      await addCustomer(newCust);
      toast.success(`Created new customer "${formData.name}"`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteCustomer = async (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete customer record for "${name}"?`)) {
      await deleteCustomer(id);
      toast.success(`Deleted customer "${name}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Customer Directory ({totalCustomers})
          </h2>
          <p className="text-xs text-slate-500">
            View, filter, and manage your registered customer database and order histories.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
        >
          <UserPlus className="mr-2 h-4 w-4" />
          Add New Customer
        </Button>
      </div>

      {/* Metrics Bar */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Registered Customers</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-1">{totalCustomers}</p>
            <p className="text-[11px] text-emerald-600 font-medium mt-0.5">{activeCount} Active Customer Accounts</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-50 text-blue-600">
            <Users className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Total Customer Revenue</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-1">{formatINR(totalRevenue)}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">All Time Customers Lifetime Spend</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-50 text-emerald-600">
            <IndianRupee className="h-6 w-6" />
          </div>
        </div>

        <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Avg. Spend / Customer</p>
            <p className="font-display text-2xl font-bold text-slate-900 mt-1">{formatINR(avgSpend)}</p>
            <p className="text-[11px] text-slate-400 font-medium mt-0.5">Average Account Lifetime Value</p>
          </div>
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-50 text-purple-600">
            <ShoppingBag className="h-6 w-6" />
          </div>
        </div>
      </div>

      {/* Toolbar: Search & Filters */}
      <div className="flex flex-col md:flex-row gap-3 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <Input
            type="text"
            placeholder="Search by Customer Name, Email, Phone, or City..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-10 border-slate-200 bg-slate-50 pl-10 text-xs text-slate-900 placeholder:text-slate-400 rounded-xl"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4 text-slate-400" />
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 focus:outline-none focus:border-primary font-bold"
          >
            <option value="all">All Customer Statuses</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </select>
        </div>
      </div>

      {/* Customers Data Table */}
      <div className="rounded-3xl border border-slate-200/80 bg-white shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200/80 bg-slate-50/50 text-slate-500 font-semibold uppercase text-[11px] tracking-wider">
                <th className="py-3.5 px-4">Customer Name</th>
                <th className="py-3.5 px-4">Contact Details</th>
                <th className="py-3.5 px-4">Location</th>
                <th className="py-3.5 px-4">Orders & Lifetime Spend</th>
                <th className="py-3.5 px-4">Joined Date</th>
                <th className="py-3.5 px-4">Status</th>
                <th className="py-3.5 px-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredCustomers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <Users className="mx-auto h-8 w-8 mb-2 opacity-50" />
                    No customer records matching your search query.
                  </td>
                </tr>
              ) : (
                filteredCustomers.map((cust) => {
                  const initial = cust.name ? cust.name.charAt(0).toUpperCase() : 'C';

                  return (
                    <tr key={cust.id} className="hover:bg-slate-50/80 transition-colors">
                      {/* Name & Avatar */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-900 font-bold text-white text-xs shadow-sm">
                            {initial}
                          </div>
                          <div>
                            <p className="font-display font-bold text-slate-900 text-sm">
                              {cust.name}
                            </p>
                            <span className="font-mono text-[10px] text-slate-400">
                              ID: {cust.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact Details */}
                      <td className="py-3.5 px-4 space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 font-medium">
                          <Mail className="h-3 w-3 text-slate-400" />
                          <span>{cust.email}</span>
                        </div>
                        <div className="flex items-center gap-1.5 text-slate-500 font-mono text-[11px]">
                          <Phone className="h-3 w-3 text-slate-400" />
                          <span>{cust.phone}</span>
                        </div>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-1.5 text-slate-700 font-semibold">
                          <MapPin className="h-3 w-3 text-slate-400" />
                          <span>{cust.city}, {cust.state}</span>
                        </div>
                        {cust.pincode && (
                          <span className="text-[10px] text-slate-400 font-mono pl-4">
                            Pin: {cust.pincode}
                          </span>
                        )}
                      </td>

                      {/* Orders & Spend */}
                      <td className="py-3.5 px-4">
                        <div className="font-mono font-bold text-slate-900 text-xs">
                          {formatINR(cust.totalSpent)}
                        </div>
                        <span className="inline-block rounded-full bg-slate-100 px-2 py-0.5 text-[10px] font-bold text-slate-600 mt-0.5">
                          {cust.ordersCount} Orders Placed
                        </span>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3.5 px-4 font-mono text-slate-500 text-xs">
                        {cust.joinedDate}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4">
                        {cust.status === 'Active' ? (
                          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-bold text-emerald-700 border border-emerald-200">
                            <CheckCircle2 className="h-3 w-3 text-emerald-500" /> Active
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 rounded-full bg-slate-100 px-2.5 py-1 text-[11px] font-bold text-slate-600 border border-slate-200">
                            <XCircle className="h-3 w-3 text-slate-400" /> Inactive
                          </span>
                        )}
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => handleOpenEdit(cust)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-primary hover:text-primary"
                            title="Edit Customer"
                          >
                            <Edit2 className="h-3.5 w-3.5" />
                          </button>
                          <button
                            onClick={() => handleDeleteCustomer(cust.id, cust.name)}
                            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:border-red-500 hover:text-red-600"
                            title="Delete Customer"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Customer Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-lg bg-white border-slate-200 text-slate-900 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-slate-900">
              {editingCustomer ? 'Edit Customer Record' : 'Add New Customer'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Enter customer details, address, phone number, and account status.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveCustomer} className="space-y-4 mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Full Name *</Label>
                <Input
                  required
                  placeholder="e.g. Rajesh Sharma"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Email Address *</Label>
                <Input
                  type="email"
                  required
                  placeholder="e.g. rajesh@gmail.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Phone Number</Label>
                <Input
                  placeholder="+91 98260 12345"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Customer Status</Label>
                <select
                  value={formData.status}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      status: e.target.value as 'Active' | 'Inactive',
                    })
                  }
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-900 focus:outline-none focus:border-primary font-bold"
                >
                  <option value="Active">Active Customer</option>
                  <option value="Inactive">Inactive</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">City</Label>
                <Input
                  placeholder="e.g. Indore"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">State</Label>
                <Input
                  placeholder="e.g. Madhya Pradesh"
                  value={formData.state}
                  onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Pincode</Label>
                <Input
                  placeholder="e.g. 452001"
                  value={formData.pincode}
                  onChange={(e) => setFormData({ ...formData, pincode: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 font-mono text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Full Shipping / Billing Address</Label>
              <Input
                placeholder="Building name, street, locality..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-200 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100 rounded-xl"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-bold hover:bg-primary/90 rounded-xl">
                {editingCustomer ? 'Save Customer Changes' : 'Create Customer'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
