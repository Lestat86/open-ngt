import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { trialId, status } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase
    .from('trials')
    .update({ status })
    .eq('id', trialId);

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json(data);
}
