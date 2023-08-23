'use client';

import ClientDataGrid from '@/app/components/client-data-grid';
import { Trials } from '@/types/database.types';
import React from 'react';
import { useRouter } from 'next/navigation';

import { FaPen, FaPlay } from 'react-icons/fa6';
import { TrialStatus, TrialStatusLabels } from '@/app/constants/constants';
import Link from 'next/link';

type Props = {
    rows: Trials[]
}

interface IRowProps {
    row: Trials
}

const TrialsTable = (props: Props) => {
  const router = useRouter();

  const toTrialEdit = (id: string) => router.push(`/trials/${id}`);

  const columns = [
    {
      key:  'created_at',
      name: 'Created At',
      renderCell(statusProps: IRowProps) {
        const value = statusProps.row.created_at;
        const dateValue = new Date(value!);

        return (
          <span>{dateValue.toDateString()}</span>
        );
      },
    },
    {
      key:  'name',
      name: 'Name',
    },
    {
      key:  'status',
      name: 'Status',
      renderCell(statusProps: IRowProps) {
        const value = statusProps.row.status;

        return (
        // @ts-expect-error fix this later
          <span>{TrialStatusLabels[value]}</span>
        );
      },
    },
    {
      key:  'edit_trial',
      name: '',
      renderCell(editProps: IRowProps) {
        const trial = editProps.row as Trials;

        return (
          // eslint-disable-next-line jsx-a11y/control-has-associated-label
          <button className="flex items-center"
            onClick={() => toTrialEdit(trial.id)}><FaPen /></button>
        );
      },
    },
    {
      key:  'run_trial',
      name: '',
      renderCell(runProps: IRowProps) {
        const trial = runProps.row as Trials;

        if (trial.status === TrialStatus.COMPLETED) {
          return null;
        }

        return (
          <Link href={`runs/${trial.id}`}><FaPlay /></Link>
        );
      },
    },
  ];

  return (
    <ClientDataGrid columns={columns} rows={props.rows} emptyMessage="no trials!" />
  );
};

export default TrialsTable;
