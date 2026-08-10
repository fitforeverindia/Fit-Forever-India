import { NextResponse } from 'next/server';
import { readDBCustomers, createDBCustomer } from '@/lib/db-server';

export async function GET() {
  try {
    const customers = readDBCustomers();
    return NextResponse.json(customers);
  } catch (error) {
    console.error('API Error GET /api/customers:', error);
    return NextResponse.json({ error: 'Failed to fetch customers' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const customers = createDBCustomer(body);
    return NextResponse.json(customers);
  } catch (error) {
    console.error('API Error POST /api/customers:', error);
    return NextResponse.json({ error: 'Failed to create customer' }, { status: 500 });
  }
}
