"use client"

import ClientDataGrid from '@/app/components/client-data-grid';
import { Criteria, TrialItem, TrialItemWithCriteria } from '@/types/database.types';
import React from 'react'

type Props = {
    rows: TrialItem[]
    criteria: Criteria[]
}

interface CriteriaCellProps {
    row: {
        trial_item_with_criteria: TrialItemWithCriteria[]
    }
}

const getColumns = (criteria: Criteria[]) => {
    const baseColumns = [
        { key: 'item_text', name: 'Text' },
    ]

    const criteriaCols = criteria.map((current) => [
        {
            key: `${current.id}_minValue`,
            name: `${current.criteria_name} Min Value`,
            renderCell(props: CriteriaCellProps) {
                const associatedCriteria = props.row.trial_item_with_criteria.find((item) => item.criteria_id === current.id)

                if (associatedCriteria) {
                    return (
                        <span>{associatedCriteria.min_value}</span>
                    )
                }

                return null
            }
        },
        {
            key: `${current.id}_maxValue`,
            name: `${current.criteria_name} Max Value`,
            renderCell(props: CriteriaCellProps) {
                const associatedCriteria = props.row.trial_item_with_criteria.find((item) => item.criteria_id === current.id)

                if (associatedCriteria) {
                    return (
                        <span>{associatedCriteria.max_value}</span>
                    )
                }

                return null
            }
        }
    ])
        .reduce((acc, curr) => acc.concat(curr), [])

    return [...baseColumns, ...criteriaCols]
};


const TrialItemsTable = (props: Props) => (
    <ClientDataGrid columns={getColumns(props.criteria)} rows={props.rows} emptyMessage='no items!' />
)

export default TrialItemsTable