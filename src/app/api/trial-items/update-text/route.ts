import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const { itemId, newText } = await request.json();

  if (!itemId) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'item id missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  if (!newText) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'item text missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });

  const { data, error } = await supabase
    .from('trial_item')
    .update({ item_text: newText })
    .eq('id', itemId);

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json(data);
}
