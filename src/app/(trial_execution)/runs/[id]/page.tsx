import { Database } from '@/types/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react'

import { cookies } from "next/headers";

type Props = {
    params: { id: string }
}


const RunTrial = async (props: Props) => {
    const trialId = props.params.id
    const split = trialId.split('-')

    const supabase = createServerComponentClient<Database>({ cookies });

    const { data: trial, error } = await supabase
        .from("trials")
        .select()
        .match({ id: trialId })
        .single()
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return (
            <div>Versione sloggata</div>
        )
    }


    const { data: trialPartecipants, error: error4 } = await supabase
        .from("trial_partecipant")
        .select()
        .match({ trial_id: trialId })
        .order('id', { ascending: false })
        .limit(1)
        .single()

    console.log(error4)


    return (<div className='flex flex-col'>
        <div>RunTrial {split[3]}</div>
        <div>{trial?.name}</div>
        <div>{trialPartecipants?.partecipant_id}</div>
    </div>
    )
}

export default RunTrial