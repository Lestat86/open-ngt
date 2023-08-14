"use client"

import ClientDataGrid from '@/app/components/client-data-grid';
import { TrialPartecipant } from '@/types/database.types';
import React from 'react'

type Props = {
    rows: TrialPartecipant[]
}

const columns = [
    { key: 'partecipant_id', name: 'Identifier' },
]

const TrialPartecipantsTable = (props: Props) => (
    <ClientDataGrid columns={columns} rows={props.rows} emptyMessage='no items!' />
)

export default TrialPartecipantsTable