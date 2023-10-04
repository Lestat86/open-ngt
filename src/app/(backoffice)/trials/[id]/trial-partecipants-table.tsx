'use client';

import ClientDataGrid from '@/app/components/client-data-grid';
import { TrialPartecipant } from '@/types/database.types';
import { IGenericColumn } from '@/types/misc';
import React from 'react';

type Props = {
    rows: TrialPartecipant[]
    showStatus?: boolean
}

interface PartecipantCellProps {
    row: TrialPartecipant
}

const getColumns = (showStatus?: boolean) => {
  const columms: IGenericColumn[] = [
    { key: 'partecipant_id', name: 'Identifier' },
  ];

  if (showStatus) {
    columms.push({
      key:  'isPresent',
      name: 'Present?',
      renderCell(props: PartecipantCellProps) {
        const partecipant = props.row;

        return partecipant.isPresent ? 'Yes' : 'No';
      },
    });

    columms.push({
      key:  'hasSubmitted',
      name: 'Submitted?',
      renderCell(props: PartecipantCellProps) {
        const partecipant = props.row;

        return partecipant.has_submitted ? 'Yes' : 'No';
      },
    });
  }

  return columms;
};

const TrialPartecipantsTable = (props: Props) => (
  <ClientDataGrid columns={getColumns(props.showStatus)} rows={props.rows} emptyMessage="No partecipant yet." />
);

export default TrialPartecipantsTable;
