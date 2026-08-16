import crypto from 'crypto';
import { supabase } from './supabase';
import type { SiteUser } from './types';

export function hashPassword(password: string): string {
  return crypto.createHash('sha256').update(password).digest('hex');
}

export async function findUserByEmail(email: string): Promise<SiteUser | undefined> {
  try {
    const { data, error } = await supabase
      .from('customers')
      .select('*')
      .eq('email', email.toLowerCase())
      .maybeSingle();

    if (error) {
      console.error('Error finding user by email in Supabase:', error.message);
      return undefined;
    }

    if (data) {
      return {
        id: data.id,
        name: data.name,
        email: data.email,
        passwordHash: data.address || '', // Store password hash in address column
        createdAt: data.created_at || new Date().toISOString(),
      };
    }
  } catch (err) {
    console.error('Error in findUserByEmail:', err);
  }
  return undefined;
}

export async function createUser(name: string, email: string, passwordPlain: string): Promise<SiteUser> {
  const row = {
    name,
    email: email.toLowerCase(),
    address: hashPassword(passwordPlain), // Store password hash in address column
    phone: '',
    city: 'Delhi',
    state: 'Delhi',
    pincode: '',
    status: 'Active',
    orders_count: 0,
    total_spent: 0,
  };

  const { data, error } = await supabase
    .from('customers')
    .insert([row])
    .select('*')
    .single();

  if (error) {
    console.error('Error inserting user to Supabase:', error.message);
    throw new Error('Failed to save user in database.');
  }

  return {
    id: data.id,
    name: data.name,
    email: data.email,
    passwordHash: data.address || '',
    createdAt: data.created_at || new Date().toISOString(),
  };
}
