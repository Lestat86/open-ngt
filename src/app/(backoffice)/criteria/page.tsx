'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { Criteria, Database } from '@/types/database.types';

import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';

const columns = [
  { key: 'id', name: 'ID' },
  { key: 'criteria_name', name: 'Name' },
];

// eslint-disable-next-line no-import-assign
const Criteria = () => {
  const [ criteria, setCriteria ] = useState<Criteria[] | null>();

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getData = async() => {
      const { data } = await supabase.from('criteria').select();
      setCriteria(data);
    };

    getData();
  }, [ supabase ]);

  return (
    <div className="flex flex-col">
      <div className="text-4xl font-semibold">Criteria</div>
      <div className="shadow-lg">
        <DataGrid columns={columns} rows={criteria ?? []} className="mt-8 styled-table"/>
      </div>
    </div>
  );
};

export default Criteria;
