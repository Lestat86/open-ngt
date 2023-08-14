"use client"

import ClientDataGrid from '@/app/components/client-data-grid';
import { Trials } from '@/types/database.types';
import React from 'react'
import { useRouter } from 'next/navigation';

import { FaPen } from "react-icons/fa6";
import { TrialStatusLabels } from '@/app/constants/constants';

type Props = {
    rows: Trials[]
}

interface IRowProps {
    row: Trials
}

const TrialsTable = (props: Props) => {
    const router = useRouter()

    const toTrialEdit = (id: string) => router.push(`/trials/${id}`)

    const columns = [
        {
            key: 'name',
            name: 'Name'
        },
        {
            key: 'status',
            name: 'Status',
            renderCell(props: IRowProps) {
                const value = props.row.status;

                return (
                    // @ts-expect-error
                    <span>{TrialStatusLabels[value]}</span>
                );
            }
        },
        {
            key: 'trial_item_with_criteria.s',
            name: '',
            renderCell(props: IRowProps) {
                const trial = props.row as Trials

                return (
                    <button onClick={() => toTrialEdit(trial.id)}><FaPen /></button>
                );
            }
        },
    ];

    return (
        <ClientDataGrid columns={columns} rows={props.rows} emptyMessage='no trials!' />
    )
}

export default TrialsTable