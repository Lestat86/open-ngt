"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
import { Measures, Database } from '@/types/database.types';

import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';

const columns = [
    { key: 'id', name: 'ID' },
    { key: 'measure_name', name: 'Name' }
];

const Measures = () => {
    const [measures, setMeasures] = useState<Measures[] | null>()

    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase.from('measures').select()
            setMeasures(data)
        }

        getData()
    }, [])

    const supabase = createClientComponentClient<Database>();

    return (
        <div className='flex flex-col'>
            <div className='text-2xl'>Measures</div>
            <DataGrid columns={columns} rows={measures ?? []} />
        </div>
    )
}

export default Measures