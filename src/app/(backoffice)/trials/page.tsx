import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

import { cookies } from 'next/headers';

import AddTrial from './add-trial';
import TrialsTable from './trials-table';
import { Database } from '@/types/database.types';

const Trials = async() => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: trials } = await supabase
    .from('trials')
    .select();

  const { data: measures } = await supabase
    .from('measures')
    .select();

  return (
    <div className="flex flex-col">
      <div className="flex items-center py-1">
        <AddTrial measures={measures ?? []} />
      </div>

      <TrialsTable rows={trials ?? []} />
    </div>
  );
};

export default Trials;
