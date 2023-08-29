'use client';

import ClientDataGrid from '@/app/components/client-data-grid';
import { Criteria } from '@/types/database.types';
import React from 'react';
import DeleteCriteria from './delete-criteria';

type Props = {
    rows: Criteria[]
}

interface IRowProps {
    row: Criteria
}

const columns = [
  { key: 'criteria_name', name: 'Name' },
  { key: 'criteria_description', name: 'Description',
    renderCell(props: IRowProps) {
      const criteria = props.row;
      const description = criteria.criteria_description || '--';

      return (
        <span>{description}</span>
      );
    } },
  {
    key:   'delete_criteria',
    name:  '',
    width: 80,
    renderCell(props: IRowProps) {
      const criteria = props.row;

      return (
        <DeleteCriteria criteriaId={criteria.id} />
      );
    },
  },
];

const CriteriaTable = (props: Props) => (
  <ClientDataGrid columns={columns} rows={props.rows} emptyMessage="no criteria!" />
);

export default CriteriaTable;
