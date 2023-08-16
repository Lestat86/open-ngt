import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    const { answers } = await request.json();

    if (!process.env.NEXT_PUBLIC_SUPABASE_URL) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'supabase url missing' }),
            { status: 500, headers: { 'content-type': 'application/json' } }
        )
    }

    if (!process.env.SUPABASE_SERVICE_ROLE_KEY) {
        return new NextResponse(
            JSON.stringify({ success: false, message: 'supabase service role missing' }),
            { status: 500, headers: { 'content-type': 'application/json' } }
        )
    }

    const supabase = createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
    );

    const { data, error } = await supabase
        .from('trial_items_answers')
        .insert(answers)
        .select()


    if (error) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500, headers: { 'content-type': 'application/json' } }
        )
    }

    return NextResponse.json(data);
}