import { NextResponse } from 'next/server';
import { readDBProductsAsync, createDBProduct, resetDBProducts } from '@/lib/db-server';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const products = await readDBProductsAsync();
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error GET /api/products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.reset) {
      const resetList = resetDBProducts();
      return NextResponse.json(resetList);
    }
    const products = await createDBProduct(body);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error POST /api/products:', error);
    return NextResponse.json({ error: 'Failed to create product' }, { status: 500 });
  }
}
