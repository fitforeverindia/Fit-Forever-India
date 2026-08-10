'use client';

import { useState, useEffect } from 'react';
import { SEED_CUSTOMERS } from './data';
import type { Customer } from './types';

const EVENT_NAME = 'fit_forever_customers_updated';

function broadcastCustomers(customers: Customer[]) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail: customers }));
  }
}

export async function fetchDBCustomers(): Promise<Customer[]> {
  try {
    const res = await fetch('/api/customers', { cache: 'no-store' });
    if (!res.ok) throw new Error('Failed to fetch customers from DB API');
    const data = await res.json();
    return Array.isArray(data) ? data : SEED_CUSTOMERS;
  } catch (err) {
    console.error('Error fetching customers from DB API:', err);
    return SEED_CUSTOMERS;
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
    broadcastCustomers(updated);
    return updated;
  } catch (err) {
    console.error('Error creating customer in DB:', err);
    return SEED_CUSTOMERS;
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
    broadcastCustomers(updated);
    return updated;
  } catch (err) {
    console.error('Error updating customer in DB:', err);
    return SEED_CUSTOMERS;
  }
}

export async function deleteDBCustomer(id: string): Promise<Customer[]> {
  try {
    const res = await fetch(`/api/customers/${id}`, {
      method: 'DELETE',
    });
    const updated = await res.json();
    broadcastCustomers(updated);
    return updated;
  } catch (err) {
    console.error('Error deleting customer in DB:', err);
    return SEED_CUSTOMERS;
  }
}

export function useCustomersStore() {
  const [customers, setCustomers] = useState<Customer[]>(SEED_CUSTOMERS);

  const reloadCustomers = async () => {
    const data = await fetchDBCustomers();
    setCustomers(data);
  };

  useEffect(() => {
    reloadCustomers();

    const handleUpdate = (e: any) => {
      if (e.detail && Array.isArray(e.detail)) {
        setCustomers(e.detail);
      } else {
        reloadCustomers();
      }
    };

    window.addEventListener(EVENT_NAME, handleUpdate);
    return () => {
      window.removeEventListener(EVENT_NAME, handleUpdate);
    };
  }, []);

  return {
    customers,
    setCustomers,
    addCustomer: async (customer: Customer) => {
      const updated = await addDBCustomer(customer);
      setCustomers(updated);
    },
    updateCustomer: async (id: string, data: Partial<Customer>) => {
      const updated = await updateDBCustomer(id, data);
      setCustomers(updated);
    },
    deleteCustomer: async (id: string) => {
      const updated = await deleteDBCustomer(id);
      setCustomers(updated);
    },
  };
}
