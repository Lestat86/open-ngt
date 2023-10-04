import { Database } from '@/types/database.types';
import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const { trialId } = await request.json();

  if (!trialId) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'trial id missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'supabase url missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'supabase service role missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const supabase = createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data:partecipant, error } = await supabase
    .from('trial_partecipant')
    .insert({ trial_id: trialId, isPresent: true })
    .select()
    .single();

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const partecipantId = `partecipant_${partecipant.id}`;

  const { error:partecipantUpdateError } = await supabase
    .from('trial_partecipant')
    .update({ partecipant_id: partecipantId })
    .eq('id', partecipant.id);

  if (partecipantUpdateError) {
    return new NextResponse(
      JSON.stringify({ success: false, message: partecipantUpdateError.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json({ partecipantId });
}
