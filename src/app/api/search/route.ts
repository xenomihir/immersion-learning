import { NextResponse } from 'next/server';
import { supabase } from '@/lib/supabase';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = searchParams.get('q')?.trim() ?? '';

  if (!query) {
    return NextResponse.json([]);
  }

  const { data, error } = await supabase
    .from('scenarios')
    .select('id, title, mode, difficulty, domain_tags, date')
    .ilike('title', `%${query}%`)
    .limit(20);

  if (error) {
    return NextResponse.json(
      { error: 'Failed to search scenarios' },
      { status: 500 },
    );
  }

  return NextResponse.json(data ?? []);
}
