import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const { name, description } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from('criteria')
    .insert({ criteria_name: name, criteria_description: description })
    .select();

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json(data[0]);
}
