import { createClient } from '@supabase/supabase-js';
import { NextResponse } from 'next/server';

export async function GET() {
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

  const password = process.env.ADMIN_PASSWORD;

  if (!password) {
    return new NextResponse(
      JSON.stringify({ success: false, message: 'desired password missing' }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  const { error } = await supabase.auth.admin.createUser({
    email:         'admin@admin.com',
    password,
    user_metadata: {
      isAdmin: true,
      name:    'Admin',
      surname: 'User',
    },
    email_confirm: true,
  });

  if (error) {
    return new NextResponse(
      JSON.stringify({ success: false, message: error.message }),
      { status: 500, headers: { 'content-type': 'application/json' } },
    );
  }

  return NextResponse.json({ password });
}
