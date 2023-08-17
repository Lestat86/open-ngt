import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { partecipantId } = await request.json();

  if (!partecipantId) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'partecipant id missing' }),
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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { data, error } = await supabase
    .from('trial_partecipant')
    .update({ isPresent: true })
    .eq('partecipant_id', partecipantId)
    .select();

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  if (data.length === 0) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'The user provided does not exists' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json(data[0]);
}
