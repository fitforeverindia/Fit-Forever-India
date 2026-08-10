'use client';

import { useState, useEffect } from 'react';
import type { Customer } from './types';

const EVENT_NAME = 'fit_forever_customers_updated';

function ensureArray(data: any): Customer[] {
  if (Array.isArray(data)) {
    return data;
  }
  return [];
}

function broadcastCustomers(customers: Customer[]) {
  if (typeof window !== 'undefined') {
    const safeList = ensureArray(customers);
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: safeList }));
  }
}

export async function fetchDBCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch('/api/customers', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch customers from DB API');
    const data = await res.json();
    return ensureArray(data);
  } catch (err) {
    console.error('Error fetching customers from DB API:', err);
    return [];
  }
}

export async function addDBCustomer(customer: Customer): Promise<Customer[]> {
  try {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(customer),
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastCustomers(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error creating customer in DB:', err);
    return [];
  }
}

export async function updateDBCustomer(id: string, updatedData: Partial<Customer>): Promise<Customer[]> {
  try {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(updatedData),
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastCustomers(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error updating customer in DB:', err);
    return [];
  }
}

export async function deleteDBCustomer(id: string): Promise<Customer[]> {
  try {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    const updated = await res.json();
    const safeUpdated = ensureArray(updated);
    broadcastCustomers(safeUpdated);
    return safeUpdated;
  } catch (err) {
    console.error('Error deleting customer in DB:', err);
    return [];
  }
}

export function useCustomersStore() {
  const [customers, setCustomers] = useState<Customer[]>([]);

  const reloadCustomers = async () => {
    const data = await fetchDBCustomers();
    setCustomers(ensureArray(data));
  };

  useEffect(() => {
    reloadCustomers();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCustomers(ensureArray(e.detail));
      } else {
        reloadCustomers();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  const safeList = ensureArray(customers);

  return {
    customers: safeList,
    setCustomers: (custs: any) => setCustomers(ensureArray(custs)),
    addCustomer: async (cust: Customer) => {
      const updated = await addDBCustomer(cust);
      setCustomers(ensureArray(updated));
    },
    updateCustomer: async (id: string, data: Partial<Customer>) => {
      const updated = await updateDBCustomer(id, data);
      setCustomers(ensureArray(updated));
    },
    deleteCustomer: async (id: string) => {
      const updated = await deleteDBCustomer(id);
      setCustomers(ensureArray(updated));
    },
  };
}
