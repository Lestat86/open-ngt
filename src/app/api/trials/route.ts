import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function PUT(request: Request) {
  const { name } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data:trial, error:trialError } = await supabase
    .from('trials')
    .insert({ name })
    .select()
    .single();

  if (trialError) {
    return new NextResponse(
      JSON.stringify({ success: false, message: trialError.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }
  const split = trial.id.split('-');
  const shortHash = `${split[3]}-${trial.progressive}`;

  const { data:trialUpdated, error:trialUpdateError } = await supabase
    .from('trials')
    .update({ short_hash: shortHash })
    .eq('id', trial.id)
    .select()
    .single();

  if (trialUpdateError) {
    return new NextResponse(
      JSON.stringify({ success: false, message: trialUpdateError.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json(trialUpdated);
}
