import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

interface IUpdatedMeasure {
  id: number
  score: number
}

export async function POST(request: Request) {
  const { trialMeasures } = await request.json();

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const promises = trialMeasures.map((measure:IUpdatedMeasure) => supabase
    .from('trial_measures')
    .update({ score: measure.score })
    .eq('id', measure.id));

  await Promise.all(promises).catch((error) => new NextResponse(
    JSON.stringify({ success: false, message: error.message }),
    { status: 500, headers: { 'content-type': 'application/json' } },
  ));

  return NextResponse.json({ message: 'ok' });
}
