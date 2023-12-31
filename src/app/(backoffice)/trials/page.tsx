import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

import { cookies } from 'next/headers';

import AddTrial from './add-trial';
import TrialsTable from './trials-table';
import { Database } from '@/types/database.types';

export const dynamic = 'force-dynamic';

const Trials = async() => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return null;
  }

  const user = session.user;

  const { data: trials } = await supabase
    .from('trials')
    .select()
    .match({ owner_id: user.id })
    .order('created_at', { ascending: false });

  const { data: measures } = await supabase
    .from('measures')
    .select();

  const { data: criteria } = await supabase
    .from('criteria')
    .select();

  return (
    <div className="flex flex-col h-full">
      <div className="flex items-center py-1">
        <AddTrial measures={measures ?? []} criteria={criteria ?? []}/>
      </div>

      <TrialsTable rows={trials ?? []} />
    </div>
  );
};

export default Trials;
