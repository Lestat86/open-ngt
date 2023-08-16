import { Database } from "@/types/database.types";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function PUT(request: Request) {
    const { trialItemWithCriteria } = await request.json();

    if (trialItemWithCriteria.length === 0) {
        return NextResponse.json([])
    }

    const supabase = createRouteHandlerClient<Database>({ cookies });
    const { data, error } = await supabase
        .from('trial_item_with_criteria')
        .insert(trialItemWithCriteria)
        .select()


    if (error) {
        return new NextResponse(
            JSON.stringify({ success: false, message: error.message }),
            { status: 500, headers: { 'content-type': 'application/json' } }
        )
    }

    return NextResponse.json(data[0]);
}