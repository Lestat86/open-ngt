import { getParsedAnswers, getStats, isItemOk } from '@/app/utils/items';
import { Database } from '@/types/database.types';
import { IItemSummary } from '@/types/misc';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { trialId, turn } = await request.json();

  if (!trialId) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'trial id missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  if (turn === undefined || turn === null) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'turn missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data:answers, error:trialItemsError } = await supabase
    .from('trial_items_answers')
    .select('*, criteria(criteria_name),trial_item!inner(trial_id, item_text)')
    .match({ turn })
    .filter('trial_item.trial_id', 'eq', trialId);

  if (trialItemsError) {
    return new NextResponse(
      JSON.stringify({ success: false, message: trialItemsError.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const { data: measures, error: measuresError } = await supabase
    .from('trial_measures')
    .select('*, measures(measure_name)')
    .match({ trial_id: trialId });

  if (measuresError) {
    return new NextResponse(
      JSON.stringify({ success: false, message: measuresError.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  if (answers.length === 0) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'Error: there are no questions. This is not normal. Please report it' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const { parsedData } = getParsedAnswers(answers);
  const itemsSummary:IItemSummary = getStats(parsedData, measures);

  const checkedItems = Object.entries(itemsSummary)
    .map(([ key, value ]) => {
      const itemOk = isItemOk(Object.values(value));

      return { id: key, is_homogeneus: itemOk };
    });

  for (const currentItem of checkedItems) {
    // eslint-disable-next-line no-await-in-loop
    const { error } = await supabase
      .from('trial_item')
      .update({ is_homogeneus: currentItem.is_homogeneus })
      .eq('id', currentItem.id);

    if (error) {
      return new NextResponse(
        JSON.stringify({ success: false, message: error.message }),
        { status: 500, headers: { 'content-type': 'application/json' } },
      );
    }
  }

  return NextResponse.json({ status: 'ok' });
}
