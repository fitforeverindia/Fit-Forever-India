'use client';

import { useState } from 'react';
import { MapPin, Plus, Edit2, Trash2, Phone, Building2 } from 'lucide-react';
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
import { OUTLETS } from '@/lib/data';
import type { Outlet } from '@/lib/types';

export default function AdminOutletsPage() {
  const [outlets, setOutlets] = useState<Outlet[]>(OUTLETS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingOutlet, setEditingOutlet] = useState<Outlet | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    city: '',
    mall: '',
    address: '',
    phone: '',
  });

  const handleOpenAdd = () => {
    setEditingOutlet(null);
    setFormData({
      name: '',
      city: '',
      mall: '',
      address: '',
      phone: '+91 98765 43210',
    });
    setIsModalOpen(true);
  };

  const handleOpenEdit = (outlet: Outlet) => {
    setEditingOutlet(outlet);
    setFormData({
      name: outlet.name,
      city: outlet.city,
      mall: outlet.mall,
      address: outlet.address,
      phone: outlet.phone,
    });
    setIsModalOpen(true);
  };

  const handleSaveOutlet = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name) return;

    if (editingOutlet) {
      setOutlets((prev) =>
        prev.map((o) =>
          o.id === editingOutlet.id
            ? {
                ...o,
                name: formData.name,
                city: formData.city,
                mall: formData.mall,
                address: formData.address,
                phone: formData.phone,
              }
            : o
        )
      );
      toast.success(`Updated showroom "${formData.name}"`);
    } else {
      const newOutlet: Outlet = {
        id: `outlet-${Date.now()}`,
        name: formData.name,
        city: formData.city,
        mall: formData.mall,
        address: formData.address,
        phone: formData.phone,
      };
      setOutlets((prev) => [...prev, newOutlet]);
      toast.success(`Added new showroom outlet "${formData.name}"`);
    }

    setIsModalOpen(false);
  };

  const handleDeleteOutlet = (id: string, name: string) => {
    if (confirm(`Are you sure you want to delete outlet "${name}"?`)) {
      setOutlets((prev) => prev.filter((o) => o.id !== id));
      toast.success(`Deleted outlet "${name}"`);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="font-display text-2xl font-bold text-slate-900 sm:text-3xl">
            Nationwide Showrooms ({outlets.length})
          </h2>
          <p className="text-xs text-slate-500">
            Manage physical retail outlets, mall locations, and contact phone numbers across India.
          </p>
        </div>

        <Button
          onClick={handleOpenAdd}
          className="rounded-xl bg-primary text-primary-foreground font-bold hover:bg-primary/90 shadow-md shadow-primary/20"
        >
          <Plus className="mr-2 h-4 w-4" />
          Add New Showroom
        </Button>
      </div>

      {/* Outlets Grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {outlets.map((outlet) => (
          <div
            key={outlet.id}
            className="group relative flex flex-col justify-between rounded-3xl border border-slate-200/80 bg-white p-6 shadow-sm transition-all duration-300 hover:shadow-lg hover:border-slate-300"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 text-primary border border-primary/20">
                  <Building2 className="h-6 w-6" />
                </div>
                <span className="rounded-full bg-slate-100 px-3 py-1 text-[10px] font-bold text-slate-700">
                  {outlet.city}
                </span>
              </div>

              <h3 className="mt-4 font-display text-lg font-bold text-slate-900">
                {outlet.name}
              </h3>
              <p className="mt-1 font-mono text-xs text-primary font-semibold">{outlet.mall}</p>

              <div className="mt-4 space-y-2 text-xs text-slate-600 border-t border-slate-100 pt-3">
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 text-slate-400 mt-0.5" />
                  <span>{outlet.address}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="h-4 w-4 shrink-0 text-slate-400" />
                  <span className="font-mono font-bold text-slate-900">{outlet.phone}</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-100 flex items-center justify-between">
              <span className="text-[11px] font-mono text-slate-400">ID: {outlet.id}</span>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleOpenEdit(outlet)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-700 transition-colors hover:border-primary hover:text-primary"
                  title="Edit Outlet"
                >
                  <Edit2 className="h-3.5 w-3.5" />
                </button>
                <button
                  onClick={() => handleDeleteOutlet(outlet.id, outlet.name)}
                  className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 bg-slate-50 text-slate-400 transition-colors hover:border-red-500 hover:text-red-600"
                  title="Delete Outlet"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add / Edit Outlet Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-md bg-white border-slate-200 text-slate-900 rounded-3xl p-6 shadow-2xl">
          <DialogHeader>
            <DialogTitle className="font-display text-xl font-bold text-slate-900">
              {editingOutlet ? 'Edit Showroom Details' : 'Add New Showroom'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Configure showroom outlet address, city, and phone number.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveOutlet} className="space-y-4 mt-4">
            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Showroom Name</Label>
              <Input
                required
                placeholder="e.g. Fit Forever Flagship Showroom"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">City & State</Label>
                <Input
                  required
                  placeholder="e.g. Mumbai, Maharashtra"
                  value={formData.city}
                  onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-semibold uppercase text-slate-700">Mall / Area</Label>
                <Input
                  placeholder="e.g. Phoenix Palladium"
                  value={formData.mall}
                  onChange={(e) => setFormData({ ...formData, mall: e.target.value })}
                  className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Full Address</Label>
              <Input
                required
                placeholder="Street address, shop number..."
                value={formData.address}
                onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900"
              />
            </div>

            <div className="space-y-1.5">
              <Label className="text-xs font-semibold uppercase text-slate-700">Contact Phone Number</Label>
              <Input
                required
                placeholder="+91 98765 43210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="bg-slate-50 border-slate-200 text-xs rounded-xl h-10 text-slate-900 font-mono"
              />
            </div>

            <DialogFooter className="pt-4 border-t border-slate-200 gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setIsModalOpen(false)}
                className="border-slate-200 bg-slate-50 text-slate-700 hover:bg-slate-100"
              >
                Cancel
              </Button>
              <Button type="submit" className="bg-primary text-primary-foreground font-bold hover:bg-primary/90">
                {editingOutlet ? 'Save Changes' : 'Create Outlet'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );

}
