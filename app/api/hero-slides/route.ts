import { NextResponse } from 'next/server';
import { getSupabaseHeroSlides, createSupabaseHeroSlide } from '@/lib/supabase-db';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const slides = await getSupabaseHeroSlides();
    return NextResponse.json(slides);
  } catch (error) {
    console.error('API Error GET /api/hero-slides:', error);
    return NextResponse.json({ error: 'Failed to fetch hero slides' }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const slides = await createSupabaseHeroSlide(body);
    return NextResponse.json(slides);
  } catch (error) {
    console.error('API Error POST /api/hero-slides:', error);
    return NextResponse.json({ error: 'Failed to create hero slide' }, { status: 500 });
  }
}
