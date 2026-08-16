'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { useCustomerAuth } from '@/lib/customer-auth';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Lock, 
  LogOut, 
  Plus, 
  Trash2, 
  Edit2, 
  Check, 
  ShieldAlert,
  Loader2,
  BellRing,
  Volume2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/components/ui/dialog';
import { Skeleton } from '@/components/ui/skeleton';
import type { SavedAddress } from '@/lib/types';

export default function AccountSettingsPage() {
  const { user, logout } = useCustomerAuth();
  const router = useRouter();

  // Personal Info Form State
  const [personalEdit, setPersonalEdit] = useState(false);
  const [personalName, setPersonalName] = useState('');
  const [personalEmail, setPersonalEmail] = useState('');
  const [personalPhone, setPersonalPhone] = useState('');
  const [personalLoading, setPersonalLoading] = useState(false);

  // Password Form State
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [pwdLoading, setPwdLoading] = useState(false);

  // Preferences Toggles
  const [orderUpdates, setOrderUpdates] = useState(true);
  const [promoNotifications, setPromoNotifications] = useState(false);
  const [prefLoading, setPrefLoading] = useState(false);

  // Address State
  const [addresses, setAddresses] = useState<SavedAddress[]>([]);
  const [addressLoading, setAddressLoading] = useState(true);

  // Address Modal/Drawer Form State
  const [addressModalOpen, setAddressModalOpen] = useState(false);
  const [editingAddress, setEditingAddress] = useState<SavedAddress | null>(null);
  
  const [addressType, setAddressType] = useState('Home');
  const [addrFullName, setAddrFullName] = useState('');
  const [addrPhone, setAddrPhone] = useState('');
  const [addrLine1, setAddrLine1] = useState('');
  const [addrLine2, setAddrLine2] = useState('');
  const [addrCity, setAddrCity] = useState('');
  const [addrState, setAddrState] = useState('');
  const [addrPin, setAddrPin] = useState('');
  const [addrDefault, setAddrDefault] = useState(false);
  const [addressSubmitLoading, setAddressSubmitLoading] = useState(false);

  // Address Delete Confirmation Dialog State
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [addressToDelete, setAddressToDelete] = useState<string | null>(null);
  const [addressDeleteLoading, setAddressDeleteLoading] = useState(false);

  // Pre-fill user data when loaded
  useEffect(() => {
    const customerId = user?.id;
    if (!user || !customerId) return;

    setPersonalName(user.name);
    setPersonalEmail(user.email);
    
    // Fetch details from backend
    const loadProfileAndAddresses = async () => {
      try {
        // Load Profile Preferences & Details
        const profileRes = await fetch(`/api/customers`); // We can fetch from customers API
        if (profileRes.ok) {
          const list = await profileRes.json();
          const currentRecord = list.find((c: any) => c.id === customerId);
          if (currentRecord) {
            setPersonalPhone(currentRecord.phone || '');
            setOrderUpdates(currentRecord.orderUpdates !== false);
            setPromoNotifications(currentRecord.promoNotifications === true);
          }
        }

        // Load Saved Addresses
        const addressRes = await fetch(`/api/account/addresses?customerId=${customerId}`);
        if (addressRes.ok) {
          const addressData = await addressRes.json();
          setAddresses(addressData || []);
        }
      } catch (err) {
        console.error('Failed to load settings details:', err);
      } finally {
        setAddressLoading(false);
      }
    };

    loadProfileAndAddresses();
  }, [user]);

  // Handle personal information update
  const handleSavePersonalInfo = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalName.trim()) {
      toast.error('Full Name is required.');
      return;
    }
    if (!personalEmail.trim() || !personalEmail.includes('@')) {
      toast.error('Please enter a valid email address.');
      return;
    }

    setPersonalLoading(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id,
          name: personalName.trim(),
          email: personalEmail.trim().toLowerCase(),
          phone: personalPhone.trim(),
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update profile.');

      // Update local storage session details
      const session = JSON.parse(localStorage.getItem('fitforever_customer_session') || '{}');
      session.name = personalName.trim();
      session.email = personalEmail.trim().toLowerCase();
      localStorage.setItem('fitforever_customer_session', JSON.stringify(session));

      // Trigger user context refresh (in real site, reload or update context)
      toast.success('Personal information updated successfully.');
      setPersonalEdit(false);
    } catch (err: any) {
      toast.error(err.message || 'An error occurred.');
    } finally {
      setPersonalLoading(false);
    }
  };

  // Handle notifications toggle preferences change
  const handlePreferenceChange = async (updates: { order?: boolean; promo?: boolean }) => {
    const nextOrder = updates.order !== undefined ? updates.order : orderUpdates;
    const nextPromo = updates.promo !== undefined ? updates.promo : promoNotifications;

    if (updates.order !== undefined) setOrderUpdates(nextOrder);
    if (updates.promo !== undefined) setPromoNotifications(nextPromo);

    setPrefLoading(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id,
          orderUpdates: nextOrder,
          promoNotifications: nextPromo,
        })
      });
      if (!res.ok) throw new Error('Failed to update preferences.');
    } catch (err) {
      toast.error('Failed to save preferences.');
    } finally {
      setPrefLoading(false);
    }
  };

  // Handle password update
  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentPassword) {
      toast.error('Current password is required.');
      return;
    }
    if (!newPassword) {
      toast.error('New password is required.');
      return;
    }
    if (newPassword.length < 6) {
      toast.error('New password must be at least 6 characters.');
      return;
    }
    if (newPassword === currentPassword) {
      toast.error('New password should not be the same as the current password.');
      return;
    }
    if (newPassword !== confirmPassword) {
      toast.error('Confirm password must match the new password.');
      return;
    }

    setPwdLoading(true);
    try {
      const res = await fetch('/api/account/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id,
          currentPassword,
          newPassword,
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to update password.');

      toast.success('Password updated successfully.');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err: any) {
      toast.error(err.message || 'Incorrect current password or update failed.');
    } finally {
      setPwdLoading(false);
    }
  };

  // Handle saved addresses CRUD operations
  const openAddAddressModal = () => {
    setEditingAddress(null);
    setAddressType('Home');
    setAddrFullName(user?.name || '');
    setAddrPhone(personalPhone || '');
    setAddrLine1('');
    setAddrLine2('');
    setAddrCity('');
    setAddrState('');
    setAddrPin('');
    setAddrDefault(addresses.length === 0); // default if first address
    setAddressModalOpen(true);
  };

  const openEditAddressModal = (addr: SavedAddress) => {
    setEditingAddress(addr);
    setAddressType(addr.addressType);
    setAddrFullName(addr.fullName);
    setAddrPhone(addr.phoneNumber);
    setAddrLine1(addr.addressLine1);
    setAddrLine2(addr.addressLine2 || '');
    setAddrCity(addr.city);
    setAddrState(addr.state);
    setAddrPin(addr.pinCode);
    setAddrDefault(addr.isDefault);
    setAddressModalOpen(true);
  };

  const handleSaveAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!addrFullName.trim() || !addrPhone.trim() || !addrLine1.trim() || !addrCity.trim() || !addrState.trim() || !addrPin.trim()) {
      toast.error('Please fill in all required address fields.');
      return;
    }

    setAddressSubmitLoading(true);
    try {
      const payload = {
        customerId: user?.id,
        addressType,
        fullName: addrFullName.trim(),
        phoneNumber: addrPhone.trim(),
        addressLine1: addrLine1.trim(),
        addressLine2: addrLine2.trim() || null,
        city: addrCity.trim(),
        state: addrState.trim(),
        pinCode: addrPin.trim(),
        isDefault: addrDefault,
      };

      let res;
      if (editingAddress) {
        // Edit Mode
        res = await fetch(`/api/account/addresses/${editingAddress.id}`, {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      } else {
        // Create Mode
        res = await fetch('/api/account/addresses', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
      }

      const updatedAddresses = await res.json();
      if (!res.ok) throw new Error(updatedAddresses.error || 'Failed to save address.');

      setAddresses(updatedAddresses || []);
      toast.success(editingAddress ? 'Address updated successfully.' : 'Address saved successfully.');
      setAddressModalOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to complete transaction.');
    } finally {
      setAddressSubmitLoading(false);
    }
  };

  const handleSetDefaultAddress = async (addressId: string) => {
    try {
      const res = await fetch(`/api/account/addresses/${addressId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerId: user?.id,
          action: 'set-default'
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);

      setAddresses(data || []);
      toast.success('Default address updated.');
    } catch (err) {
      toast.error('Failed to update default address.');
    }
  };

  const confirmDeleteAddress = (addressId: string) => {
    setAddressToDelete(addressId);
    setDeleteConfirmOpen(true);
  };

  const handleDeleteAddress = async () => {
    if (!addressToDelete) return;
    setAddressDeleteLoading(true);
    try {
      const res = await fetch(`/api/account/addresses/${addressToDelete}?customerId=${user?.id}`, {
        method: 'DELETE'
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to delete address.');

      setAddresses(data || []);
      toast.success('Address removed.');
      setDeleteConfirmOpen(false);
    } catch (err: any) {
      toast.error(err.message || 'Failed to delete address.');
    } finally {
      setAddressDeleteLoading(false);
      setAddressToDelete(null);
    }
  };

  const handleLogout = () => {
    logout();
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      {/* Title */}
      <div>
        <h1 className="font-display text-xl font-bold text-slate-900 md:text-2xl">
          Account Settings
        </h1>
        <p className="text-xs text-slate-400 mt-0.5">Manage your personal information, address books, preferences, and password.</p>
      </div>

      {/* 1. Personal Information */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 p-5 md:p-6 bg-slate-50/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <User className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="font-display text-sm font-bold text-slate-900">Personal Information</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 mt-0.5">Update your basic profile data.</CardDescription>
              </div>
            </div>
            {!personalEdit && (
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => setPersonalEdit(true)} 
                className="rounded-full text-xs font-bold border-slate-200/80 hover:bg-slate-50 h-8"
              >
                Edit
              </Button>
            )}
          </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6">
          {personalEdit ? (
            <form onSubmit={handleSavePersonalInfo} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <Label htmlFor="fullName" className="text-xs font-bold text-slate-600">Full Name</Label>
                  <Input
                    id="fullName"
                    value={personalName}
                    onChange={(e) => setPersonalName(e.target.value)}
                    disabled={personalLoading}
                    className="h-10 text-xs bg-slate-50/50 rounded-xl focus:bg-white border-slate-200 focus:border-primary focus:ring-primary"
                  />
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="phoneNum" className="text-xs font-bold text-slate-600">Phone Number</Label>
                  <Input
                    id="phoneNum"
                    placeholder="e.g. +91 98765 43210"
                    value={personalPhone}
                    onChange={(e) => setPersonalPhone(e.target.value)}
                    disabled={personalLoading}
                    className="h-10 text-xs bg-slate-50/50 rounded-xl focus:bg-white border-slate-200 focus:border-primary focus:ring-primary"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="emailAddress" className="text-xs font-bold text-slate-600">Email Address</Label>
                <Input
                  id="emailAddress"
                  type="email"
                  value={personalEmail}
                  onChange={(e) => setPersonalEmail(e.target.value)}
                  disabled={personalLoading}
                  className="h-10 text-xs bg-slate-50/50 rounded-xl focus:bg-white border-slate-200 focus:border-primary focus:ring-primary"
                />
              </div>

              <div className="flex items-center gap-2 pt-2 justify-end">
                <Button 
                  type="button" 
                  variant="ghost" 
                  size="sm"
                  onClick={() => {
                    setPersonalEdit(false);
                    setPersonalName(user?.name || '');
                    setPersonalEmail(user?.email || '');
                  }}
                  disabled={personalLoading}
                  className="rounded-full text-xs font-bold h-9"
                >
                  Cancel
                </Button>
                <Button 
                  type="submit" 
                  size="sm"
                  disabled={personalLoading}
                  className="rounded-full bg-primary font-bold text-white shadow-sm h-9"
                >
                  {personalLoading ? (
                    <>
                      <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                      Saving...
                    </>
                  ) : (
                    'Save Changes'
                  )}
                </Button>
              </div>
            </form>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 font-medium text-xs">
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Full Name</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{user?.name}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Email Address</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{user?.email}</p>
              </div>
              <div className="space-y-1">
                <p className="text-slate-400 font-bold uppercase tracking-wider text-[10px]">Phone Number</p>
                <p className="text-slate-800 text-sm font-bold mt-0.5">{personalPhone || <span className="text-slate-300 italic font-normal">Not Provided</span>}</p>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* 2. Saved Addresses */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 p-5 md:p-6 bg-slate-50/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <MapPin className="h-5 w-5 text-primary" />
              <div>
                <CardTitle className="font-display text-sm font-bold text-slate-900">Saved Addresses</CardTitle>
                <CardDescription className="text-[11px] text-slate-400 mt-0.5">Manage your delivery and billing coordinates.</CardDescription>
              </div>
            </div>
            <Button 
              onClick={openAddAddressModal} 
              size="sm" 
              className="rounded-full bg-primary font-bold text-white shadow-sm text-xs h-8 px-3"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add Address
            </Button>
          </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6">
          {addressLoading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Skeleton className="h-32 w-full rounded-2xl" />
              <Skeleton className="h-32 w-full rounded-2xl" />
            </div>
          ) : addresses.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center border border-dashed rounded-2xl border-slate-200">
              <div className="rounded-full bg-slate-50 p-3.5 text-slate-400 mb-3 border border-slate-100">
                <MapPin className="h-6 w-6" />
              </div>
              <h4 className="text-xs font-bold text-slate-800">No saved addresses</h4>
              <p className="text-[11px] text-slate-400 mt-1 max-w-xs">Create a saved address to speed up your order checkout process.</p>
              <Button onClick={openAddAddressModal} variant="outline" size="sm" className="mt-3.5 rounded-full text-xs font-bold border-slate-200 hover:bg-slate-50 h-8">
                + Add New Address
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {addresses.map((addr) => (
                <div 
                  key={addr.id} 
                  className={`rounded-2xl border p-4.5 space-y-3 flex flex-col justify-between transition-all ${
                    addr.isDefault 
                      ? 'border-primary bg-primary/[0.01] shadow-soft' 
                      : 'border-slate-200/80 bg-white hover:border-slate-300'
                  }`}
                >
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex border font-mono rounded-full px-2 py-0.5 text-[9px] font-black uppercase bg-slate-50 text-slate-500 border-slate-200/60 tracking-wider">
                        {addr.addressType}
                      </span>
                      {addr.isDefault && (
                        <span className="inline-flex items-center gap-0.5 font-sans rounded-full px-2.5 py-0.5 text-[9px] font-black uppercase bg-primary text-white tracking-wider">
                          <Check className="h-2.5 w-2.5 stroke-[3]" />
                          Default
                        </span>
                      )}
                    </div>

                    <div className="space-y-1 font-medium text-xs text-slate-600 leading-relaxed">
                      <p className="font-bold text-slate-900">{addr.fullName}</p>
                      <p>{addr.phoneNumber}</p>
                      <p className="line-clamp-2 text-slate-500">{addr.addressLine1}{addr.addressLine2 ? `, ${addr.addressLine2}` : ''}</p>
                      <p className="text-slate-500">{addr.city}, {addr.state} - {addr.pinCode}</p>
                    </div>
                  </div>

                  <div className="border-t border-slate-100/80 pt-3 flex items-center justify-between mt-2.5">
                    <div className="flex items-center gap-1.5">
                      <button 
                        onClick={() => openEditAddressModal(addr)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border hover:bg-slate-50 text-slate-400 hover:text-slate-700 transition-colors p-1"
                        title="Edit Address"
                      >
                        <Edit2 className="h-3.5 w-3.5" />
                      </button>
                      <button 
                        onClick={() => confirmDeleteAddress(addr.id)}
                        className="flex h-7.5 w-7.5 items-center justify-center rounded-lg border border-red-100 hover:bg-red-50 text-red-400 hover:text-red-600 transition-colors p-1"
                        title="Delete Address"
                      >
                        <Trash2 className="h-3.5 w-3.5" />
                      </button>
                    </div>

                    {!addr.isDefault && (
                      <button 
                        onClick={() => handleSetDefaultAddress(addr.id)}
                        className="text-[10px] font-bold text-primary hover:underline transition-colors"
                      >
                        Set as Default
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* 3. Account Preferences */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 p-5 md:p-6 bg-slate-50/20">
          <div className="flex items-center gap-2.5">
            <BellRing className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="font-display text-sm font-bold text-slate-900">Account Preferences</CardTitle>
              <CardDescription className="text-[11px] text-slate-400 mt-0.5">Toggle notification and merge update preferences.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6 space-y-4">
          <div className="flex items-center justify-between gap-4 py-2 border-b border-slate-50">
            <div className="space-y-0.5 max-w-md">
              <Label htmlFor="prefOrderUpdates" className="text-xs font-bold text-slate-800">Order Updates</Label>
              <p className="text-[10px] text-slate-400">Receive transactional notifications about your order shipment status.</p>
            </div>
            <Switch
              id="prefOrderUpdates"
              checked={orderUpdates}
              onCheckedChange={(checked) => handlePreferenceChange({ order: checked })}
              disabled={prefLoading}
            />
          </div>

          <div className="flex items-center justify-between gap-4 py-2">
            <div className="space-y-0.5 max-w-md">
              <Label htmlFor="prefPromo" className="text-xs font-bold text-slate-800">Promotional Notifications</Label>
              <p className="text-[10px] text-slate-400">Receive special offers, fitness tips, and seasonal catalog releases.</p>
            </div>
            <Switch
              id="prefPromo"
              checked={promoNotifications}
              onCheckedChange={(checked) => handlePreferenceChange({ promo: checked })}
              disabled={prefLoading}
            />
          </div>
        </CardContent>
      </Card>

      {/* 4. Update Password */}
      <Card className="rounded-2xl border-slate-200/60 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-slate-100 p-5 md:p-6 bg-slate-50/20">
          <div className="flex items-center gap-2.5">
            <Lock className="h-5 w-5 text-primary" />
            <div>
              <CardTitle className="font-display text-sm font-bold text-slate-900">Update Password</CardTitle>
              <CardDescription className="text-[11px] text-slate-400 mt-0.5">Revoke credentials and security settings.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6">
          <form onSubmit={handleUpdatePassword} className="space-y-4 max-w-lg">
            <div className="space-y-1.5">
              <Label htmlFor="currPass" className="text-xs font-bold text-slate-600">Current Password</Label>
              <Input
                id="currPass"
                type="password"
                placeholder="Enter current password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                disabled={pwdLoading}
                className="h-10 text-xs bg-slate-50/50 rounded-xl focus:bg-white border-slate-200 focus:border-primary focus:ring-primary"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label htmlFor="newPass" className="text-xs font-bold text-slate-600">New Password</Label>
                <Input
                  id="newPass"
                  type="password"
                  placeholder="At least 6 characters"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  disabled={pwdLoading}
                  className="h-10 text-xs bg-slate-50/50 rounded-xl focus:bg-white border-slate-200 focus:border-primary focus:ring-primary"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="confPass" className="text-xs font-bold text-slate-600">Confirm New Password</Label>
                <Input
                  id="confPass"
                  type="password"
                  placeholder="Retype new password"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                  disabled={pwdLoading}
                  className="h-10 text-xs bg-slate-50/50 rounded-xl focus:bg-white border-slate-200 focus:border-primary focus:ring-primary"
                />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2 justify-end">
              <Button 
                type="button" 
                variant="ghost" 
                size="sm"
                onClick={() => {
                  setCurrentPassword('');
                  setNewPassword('');
                  setConfirmPassword('');
                }}
                disabled={pwdLoading}
                className="rounded-full text-xs font-bold h-9"
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                size="sm"
                disabled={pwdLoading}
                className="rounded-full bg-primary font-bold text-white shadow-sm h-9"
              >
                {pwdLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Updating...
                  </>
                ) : (
                  'Update Password'
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* 5. Logout */}
      <Card className="rounded-2xl border-red-100 shadow-sm overflow-hidden bg-white">
        <CardHeader className="border-b border-red-50 p-5 md:p-6 bg-red-50/5">
          <div className="flex items-center gap-2.5">
            <LogOut className="h-5 w-5 text-red-500" />
            <div>
              <CardTitle className="font-display text-sm font-bold text-slate-900">Logout</CardTitle>
              <CardDescription className="text-[11px] text-slate-400 mt-0.5">Disconnect session from current browser.</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-5 md:p-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <p className="text-xs text-slate-500 font-medium">
            Logout from your FitForever India customer account. This will clear the session and return you to the home page.
          </p>
          <Button 
            onClick={handleLogout}
            variant="destructive"
            size="sm" 
            className="rounded-full font-bold shadow-sm text-xs h-9 px-6 shrink-0 self-start sm:self-auto bg-red-600 hover:bg-red-500 text-white"
          >
            Logout
          </Button>
        </CardContent>
      </Card>

      {/* Address CREATE/EDIT Dialog Modal */}
      <Dialog open={addressModalOpen} onOpenChange={setAddressModalOpen}>
        <DialogContent className="max-w-md rounded-3xl border p-6 text-slate-800 bg-white">
          <DialogHeader>
            <DialogTitle className="font-display text-base font-bold text-slate-900">
              {editingAddress ? 'Edit Address' : 'Add New Address'}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400">
              Fill in the form coordinates below to register your shipment address.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleSaveAddress} className="space-y-3.5 pt-2">
            <div className="grid grid-cols-2 gap-3.5">
              {/* Address Type */}
              <div className="space-y-1">
                <Label htmlFor="addrType" className="text-[10px] font-bold uppercase text-slate-500">Address Type</Label>
                <select
                  id="addrType"
                  value={addressType}
                  onChange={(e) => setAddressType(e.target.value)}
                  className="w-full h-10 rounded-xl border border-slate-200 bg-slate-50 px-3 text-xs text-slate-800 focus:outline-none focus:border-primary"
                >
                  <option value="Home">Home</option>
                  <option value="Work">Work</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              {/* Pin Code */}
              <div className="space-y-1">
                <Label htmlFor="addrPinCode" className="text-[10px] font-bold uppercase text-slate-500">PIN Code *</Label>
                <Input
                  id="addrPinCode"
                  placeholder="e.g. 201301"
                  value={addrPin}
                  onChange={(e) => setAddrPin(e.target.value)}
                  maxLength={6}
                  disabled={addressSubmitLoading}
                  className="h-10 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl focus:border-primary"
                />
              </div>
            </div>

            {/* Full Name */}
            <div className="space-y-1">
              <Label htmlFor="addrName" className="text-[10px] font-bold uppercase text-slate-500">Full Name *</Label>
              <Input
                id="addrName"
                placeholder="Recipient's name"
                value={addrFullName}
                onChange={(e) => setAddrFullName(e.target.value)}
                disabled={addressSubmitLoading}
                className="h-10 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl focus:border-primary"
              />
            </div>

            {/* Phone Number */}
            <div className="space-y-1">
              <Label htmlFor="addrPhoneNum" className="text-[10px] font-bold uppercase text-slate-500">Phone Number *</Label>
              <Input
                id="addrPhoneNum"
                placeholder="e.g. +91 98765 43210"
                value={addrPhone}
                onChange={(e) => setAddrPhone(e.target.value)}
                disabled={addressSubmitLoading}
                className="h-10 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl focus:border-primary"
              />
            </div>

            {/* Address Line 1 */}
            <div className="space-y-1">
              <Label htmlFor="addrLine1" className="text-[10px] font-bold uppercase text-slate-500">Address Line 1 *</Label>
              <Input
                id="addrLine1"
                placeholder="Flat/House no., Building, Street name"
                value={addrLine1}
                onChange={(e) => setAddrLine1(e.target.value)}
                disabled={addressSubmitLoading}
                className="h-10 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl focus:border-primary"
              />
            </div>

            {/* Address Line 2 */}
            <div className="space-y-1">
              <Label htmlFor="addrLine2" className="text-[10px] font-bold uppercase text-slate-500">Address Line 2 (Optional)</Label>
              <Input
                id="addrLine2"
                placeholder="Sector, Landmark, Locality"
                value={addrLine2}
                onChange={(e) => setAddrLine2(e.target.value)}
                disabled={addressSubmitLoading}
                className="h-10 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl focus:border-primary"
              />
            </div>

            <div className="grid grid-cols-2 gap-3.5">
              {/* City */}
              <div className="space-y-1">
                <Label htmlFor="addrCity" className="text-[10px] font-bold uppercase text-slate-500">City *</Label>
                <Input
                  id="addrCity"
                  placeholder="e.g. Noida"
                  value={addrCity}
                  onChange={(e) => setAddrCity(e.target.value)}
                  disabled={addressSubmitLoading}
                  className="h-10 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl focus:border-primary"
                />
              </div>

              {/* State */}
              <div className="space-y-1">
                <Label htmlFor="addrState" className="text-[10px] font-bold uppercase text-slate-500">State *</Label>
                <Input
                  id="addrState"
                  placeholder="e.g. Uttar Pradesh"
                  value={addrState}
                  onChange={(e) => setAddrState(e.target.value)}
                  disabled={addressSubmitLoading}
                  className="h-10 text-xs bg-slate-50 border-slate-200 focus:bg-white rounded-xl focus:border-primary"
                />
              </div>
            </div>

            {/* Set as Default */}
            <div className="flex items-center gap-2.5 py-1">
              <input
                id="addrDefault"
                type="checkbox"
                checked={addrDefault}
                onChange={(e) => setAddrDefault(e.target.checked)}
                disabled={addressSubmitLoading || (editingAddress?.isDefault)} // can't unset default if it is currently default
                className="h-4 w-4 rounded border-slate-300 text-primary focus:ring-primary rounded-md cursor-pointer"
              />
              <Label htmlFor="addrDefault" className="text-xs font-bold text-slate-600 cursor-pointer">
                Set as default shipping address
              </Label>
            </div>

            <DialogFooter className="pt-3 gap-2 flex-row justify-end">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => setAddressModalOpen(false)}
                disabled={addressSubmitLoading}
                className="rounded-full text-xs font-bold h-9"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                size="sm"
                disabled={addressSubmitLoading}
                className="rounded-full bg-primary font-bold text-white shadow-sm h-9"
              >
                {addressSubmitLoading ? (
                  <>
                    <Loader2 className="h-3.5 w-3.5 animate-spin mr-1.5" />
                    Saving...
                  </>
                ) : (
                  'Save Address'
                )}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Address DELETE Confirmation Dialog */}
      <Dialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <DialogContent className="max-w-sm rounded-3xl border p-6 text-slate-800 bg-white">
          <DialogHeader className="flex flex-col items-center text-center">
            <div className="rounded-full bg-red-50 p-3 text-red-500 border border-red-100 mb-2">
              <Trash2 className="h-6 w-6" />
            </div>
            <DialogTitle className="font-display text-sm font-bold text-slate-900">
              Delete this address?
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-400 mt-1 max-w-[240px]">
              Are you sure you want to remove this address? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>

          <DialogFooter className="pt-3 gap-2 flex-row justify-center">
            <Button
              type="button"
              variant="ghost"
              size="sm"
              onClick={() => {
                setDeleteConfirmOpen(false);
                setAddressToDelete(null);
              }}
              disabled={addressDeleteLoading}
              className="rounded-full text-xs font-bold h-9 border w-24"
            >
              Cancel
            </Button>
            <Button
              onClick={handleDeleteAddress}
              disabled={addressDeleteLoading}
              className="rounded-full bg-red-600 hover:bg-red-500 text-white font-bold shadow-sm h-9 w-24"
            >
              {addressDeleteLoading ? (
                <Loader2 className="h-3.5 w-3.5 animate-spin" />
              ) : (
                'Delete'
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
