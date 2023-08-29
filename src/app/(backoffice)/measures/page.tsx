'use client';

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { Measures, Database } from '@/types/database.types';

import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';

const columns = [
  { key: 'id', name: 'ID' },
  { key: 'measure_name', name: 'Name' },
];

const MeasuresList = () => {
  const [ measures, setMeasures ] = useState<Measures[] | null>();

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getData = async() => {
      const { data } = await supabase.from('measures').select();
      setMeasures(data);
    };

    getData();
  }, [ supabase ]);

  return (
    <div className="flex flex-col">
      <div className="text-4xl font-semibold">Measures</div>
      <div className="shadow-lg">
        <DataGrid columns={columns} rows={measures ?? []} className="mt-8 styled-table"/>
      </div>
    </div>
  );
};

export default MeasuresList;
