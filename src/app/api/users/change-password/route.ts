import { Database } from '@/types/database.types';
import { createRouteHandlerClient } from '@supabase/auth-helpers-nextjs';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function POST(request: Request) {
  const { password } = await request.json();

  if (!password) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'password cannot be empty' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const supabase = createRouteHandlerClient<Database>({ cookies });
  const { data, error } = await supabase.auth.updateUser({
    password,
    data: {
      needPasswordChange: false,
    },
  });

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json(data);
}
