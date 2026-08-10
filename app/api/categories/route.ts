import { NextResponse } from 'next/server';
import { readDBCategories, createDBCategory, resetDBCategories } from '@/lib/db-server';

export async function GET() {
  try {
    const categories = readDBCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error GET /api/categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    if (body.reset) {
      const resetList = resetDBCategories();
      return NextResponse.json(resetList);
    }
    const categories = createDBCategory(body);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error POST /api/categories:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
