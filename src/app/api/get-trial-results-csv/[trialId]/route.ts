import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { Parser } from '@json2csv/plainjs';

export const dynamic = 'force-dynamic';

interface IRouteParams {
  params: {
    trialId: string
  }
}

const opts = {
  fields: [
    {
      label: 'Id',
      value: 'id',
    },
    {
      label: 'Item',
      value: 'item',
    },
    {
      label: 'Partecipant',
      value: 'partecipant',
    },
    {
      label: 'Criteria',
      value: 'criteria',
    },
    {
      label: 'Turn',
      value: 'turn',
    },
    {
      label: 'Score',
      value: 'score',
    },
  ],
};

export async function GET(request: Request, params:IRouteParams) {
  const { trialId } = params.params;

  if (!trialId) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'trial id missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase
    .from('trial_items_answers')
    .select('*, trial_item!inner(trial_id, item_text), criteria(criteria_name),trial_partecipant(partecipant_id)')
    .filter('trial_item.trial_id', 'eq', trialId);

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const csvData = data.map((current) => (
    {
      id:          current.id,
      item:        current.trial_item?.item_text,
      partecipant: current.trial_partecipant?.partecipant_id,
      criteria:    current.criteria?.criteria_name,
      turn:        current.turn,
      score:       current.score,
    }
  ));

  const parser = new Parser(opts);

  const parsed = parser.parse(csvData);

  return NextResponse.json(parsed);
}
