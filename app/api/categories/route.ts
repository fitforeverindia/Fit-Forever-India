import { NextResponse } from 'next/server';
import { getSupabaseCategories, createSupabaseCategory } from '@/lib/supabase-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = await getSupabaseCategories();
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error GET /api/categories:', error);
    return NextResponse.json({ error: 'Failed to fetch categories' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const categories = await createSupabaseCategory(body);
    return NextResponse.json(categories);
  } catch (error) {
    console.error('API Error POST /api/categories:', error);
    return NextResponse.json({ error: 'Failed to create category' }, { status: 500 });
  }
}
