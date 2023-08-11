"use client"

import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react'
import { Criteria, Database } from '../../types/database.types';

import 'react-data-grid/lib/styles.css';

import DataGrid from 'react-data-grid';

const columns = [
    { key: 'id', name: 'ID' },
    { key: 'criteria_name', name: 'Name' }
];

const Criteria = () => {
    const [criteria, setCriteria] = useState<Criteria[] | null>()

    useEffect(() => {
        const getData = async () => {
            const { data } = await supabase.from('criteria').select()
            setCriteria(data)
        }

        getData()
    }, [])
    const supabase = createClientComponentClient<Database>();

    return (
        <div className='flex flex-col'>
            <div className='text-2xl'>Criteria</div>
            <DataGrid columns={columns} rows={criteria ?? []} />
        </div>
    )
}

export default Criteria