import { Database } from '@/types/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { createClient } from '@supabase/supabase-js';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function PUT(request: Request) {
  const { email, name, surname, password, isAdmin } = await request.json();

  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session || !session.user.user_metadata.isAdmin) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'forbidden' }),
      { status: 401, headers: { 'content-type': 'application/json' } },
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

  const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
  );

  const { error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    user_metadata: {
      isAdmin,
      name,
      surname,
      needPasswordChange: true,
    },
    email_confirm: true,
  });

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json({ message: 'ok' });
}
