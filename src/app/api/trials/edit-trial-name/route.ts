import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { trialId, name } = await request.json();

  if (!trialId) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'trial id missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  if (!name) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'trial name missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from('trials')
    .update({ name })
    .eq('id', trialId);

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json(data);
}
