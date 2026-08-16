import { NextResponse } from 'next/server';
import { getCustomerById, updateCustomerProfile, updateCustomerPreferences } from '@/lib/supabase-db';
import { findUserByEmail, hashPassword } from '@/lib/users-db';
import { supabase } from '@/lib/supabase';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  try {
    const body = await request.json();
    const { 
      customerId, 
      name, 
      email, 
      phone, 
      orderUpdates, 
      promoNotifications, 
      currentPassword, 
      newPassword 
    } = body;

    if (!customerId) {
      return NextResponse.json({ error: 'Customer ID is required' }, { status: 400 });
    }

    // 1. Fetch current customer details
    const customer = await getCustomerById(customerId);
    if (!customer) {
      return NextResponse.json({ error: 'Customer not found' }, { status: 404 });
    }

    // 2. Handle Password Change (if passwords are provided)
    if (currentPassword || newPassword) {
      if (!currentPassword) {
        return NextResponse.json({ error: 'Current password is required to change password.' }, { status: 400 });
      }
      if (!newPassword) {
        return NextResponse.json({ error: 'New password is required.' }, { status: 400 });
      }
      if (newPassword.length < 6) {
        return NextResponse.json({ error: 'New password must be at least 6 characters.' }, { status: 400 });
      }
      if (currentPassword === newPassword) {
        return NextResponse.json({ error: 'New password cannot be the same as current password.' }, { status: 400 });
      }

      // Verify current password by loading SiteUser details
      const userRecord = await findUserByEmail(customer.email);
      if (!userRecord) {
        return NextResponse.json({ error: 'Authentication record not found.' }, { status: 404 });
      }

      const hashedCurrent = hashPassword(currentPassword);
      if (userRecord.passwordHash !== hashedCurrent) {
        return NextResponse.json({ error: 'Current password is incorrect.' }, { status: 400 });
      }

      // Update password hash (stored in address column of customers table)
      const hashedNew = hashPassword(newPassword);
      const { error: pwdError } = await supabase
        .from('customers')
        .update({ address: hashedNew })
        .eq('id', customerId);

      if (pwdError) {
        console.error('Database error updating password:', pwdError.message);
        return NextResponse.json({ error: 'Failed to update password in database.' }, { status: 500 });
      }
    }

    // 3. Handle email uniqueness check if changing email
    if (email && email.toLowerCase() !== customer.email.toLowerCase()) {
      const existingUser = await findUserByEmail(email);
      if (existingUser && existingUser.id !== customerId) {
        return NextResponse.json({ error: 'An account with this email already exists.' }, { status: 400 });
      }
    }

    // 4. Update Profile Details
    if (name !== undefined || phone !== undefined || email !== undefined) {
      await updateCustomerProfile(customerId, name || customer.name, phone || customer.phone, email || customer.email);
    }

    // 5. Update Preferences
    if (orderUpdates !== undefined || promoNotifications !== undefined) {
      await updateCustomerPreferences(
        customerId, 
        orderUpdates !== undefined ? orderUpdates : customer.orderUpdates ?? true, 
        promoNotifications !== undefined ? promoNotifications : customer.promoNotifications ?? false
      );
    }

    // 6. Fetch updated customer state
    const updatedCustomer = await getCustomerById(customerId);
    return NextResponse.json({ 
      success: true, 
      message: 'Profile updated successfully.', 
      user: {
        id: updatedCustomer?.id,
        name: updatedCustomer?.name,
        email: updatedCustomer?.email,
        phone: updatedCustomer?.phone,
        orderUpdates: updatedCustomer?.orderUpdates,
        promoNotifications: updatedCustomer?.promoNotifications
      }
    });

  } catch (error: any) {
    console.error('API Error PUT /api/account/profile:', error);
    return NextResponse.json({ error: error.message || 'Internal server error' }, { status: 500 });
  }
}
