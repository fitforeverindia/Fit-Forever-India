import { NextResponse } from 'next/server';
import { getSupabaseCustomers, createSupabaseCustomer } from '@/lib/supabase-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const customers = await getSupabaseCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('API Error GET /api/customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customers = await createSupabaseCustomer(body);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('API Error POST /api/customers:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
