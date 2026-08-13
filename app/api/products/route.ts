import { NextResponse } from 'next/server';
import { getSupabaseProducts, createSupabaseProduct } from '@/lib/supabase-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await getSupabaseProducts();
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error GET /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const products = await createSupabaseProduct(body);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error POST /api/products:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
