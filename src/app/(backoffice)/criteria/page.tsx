import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';
import { Database } from '@/types/database.types';

import 'react-data-grid/lib/styles.css';

import AddCriteria from './add-criteria';

import { cookies } from 'next/headers';
import CriteriaTable from './criteria-table';

export const dynamic = 'force-dynamic';

const CriteriaList = async() => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: criteria } = await supabase
    .from('criteria')
    .select();

  return (
    <div className="flex flex-col">
      <div className="flex items-center">
        <div className="text-4xl font-semibold">Criteria</div>
        <div className="flex items-center py-1 ml-4">
          <AddCriteria />
        </div>
      </div>
      <div className="shadow-lg">

        <CriteriaTable rows={criteria ?? []} />
      </div>
    </div>
  );
};

export default CriteriaList;
