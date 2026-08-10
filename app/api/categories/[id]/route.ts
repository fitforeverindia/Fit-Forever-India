import { NextResponse } from 'next/server';
import { updateDBCategory, deleteDBCategory } from '@/lib/db-server';

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const body = await request.json();
    const categories = updateDBCategory(id, body);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error PUT /api/categories/[id]:', error);
    return NextResponse.json({ error: 'Failed to update category' }, { status: 500 });
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const categories = deleteDBCategory(id);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error DELETE /api/categories/[id]:', error);
    return NextResponse.json({ error: 'Failed to delete category' }, { status: 500 });
  }
}
