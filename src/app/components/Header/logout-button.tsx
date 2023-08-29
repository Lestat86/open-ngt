'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React from 'react';
import { Database } from '../../../types/database.types';
import { FaArrowRightFromBracket } from 'react-icons/fa6';

type Props = {
    className?: string
}

const LogoutButton = (props: Props) => {
  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignOut = async() => {
    await supabase.auth.signOut();
    router.refresh();
  };

  return (
    <div className="flex items-center">
      <FaArrowRightFromBracket className="mr-2 text-l"/>
      <button className={props.className} onClick={handleSignOut}>Logout</button>
    </div>
  );
};

export default LogoutButton;
