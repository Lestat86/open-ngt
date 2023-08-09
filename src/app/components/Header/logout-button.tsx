'use client'

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs'
import { useRouter } from 'next/navigation'
import React from 'react'
import { Database } from '../../../types/database.types'

type Props = {
    className?: string
}

const LogoutButton = (props: Props) => {
    const router = useRouter()
    const supabase = createClientComponentClient<Database>()

    const handleSignOut = async () => {
        await supabase.auth.signOut();
        router.refresh();
    };

    return (
        <button className={props.className} onClick={handleSignOut}>Logout</button>
    )
}

export default LogoutButton