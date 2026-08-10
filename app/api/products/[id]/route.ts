import { NextResponse } from 'next/server';
import { updateDBProduct, deleteDBProduct } from '@/lib/db-server';

export const dynamic = 'force-dynamic';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const body = await request.json();
    const products = await updateDBProduct(id, body);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error PUT /api/products/[id]:', error);
    return NextResponse.json({ error: 'Failed to update product' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;
    const products = await deleteDBProduct(id);
    return NextResponse.json(products);
  } catch (error) {
    console.error('API Error DELETE /api/products/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete product' }, { status: 500 });
  }
}
