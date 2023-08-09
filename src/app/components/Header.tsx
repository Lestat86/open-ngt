import React from 'react'
import { createServerComponentClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import LogoutButton from './Header/logout-button';
import { Database } from '../../types/database.types';

const Header = async () => {
    const supabase = createServerComponentClient<Database>({ cookies });
    const {
        data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
        return null
    }

    return (
        <div className='flex w-full items-center px-8 py-4 justify-between'>
            Open NGT
            <LogoutButton />
        </div>
    )
}

export default Header