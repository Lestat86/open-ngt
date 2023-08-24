'use client';

import ClientDataGrid from '@/app/components/client-data-grid';
import { User } from '@supabase/supabase-js';
import React from 'react';

type Props = {
    rows: User[]
}

interface IRowProps {
    row: User
}

const columns = [
  { key: 'email', name: 'Email' },
  {
    key:  'name',
    name: 'Name',
    renderCell(props: IRowProps) {
      const user = props.row;
      const metadata = user.user_metadata;

      return (
        <span>{metadata.name}</span>
      );
    },
  },
  {
    key:  'surname',
    name: 'Surname',
    renderCell(props: IRowProps) {
      const user = props.row;
      const metadata = user.user_metadata;

      return (
        <span>{metadata.surname}</span>
      );
    },
  },
  {
    key:   'last_sign_in_at',
    name:  'Last sign in',
    width: '15%',
    renderCell(props: IRowProps) {
      const value = props.row.last_sign_in_at;
      const dateValue = new Date(value!);

      return (
        <span>{dateValue.toDateString()}</span>
      );
    },
  },
  {
    key:   'admin',
    name:  'isAdmin',
    width: '5%',
    renderCell(props: IRowProps) {
      const user = props.row;
      const metadata = user.user_metadata;
      const isAdmin = metadata.isAdmin ? 'Yes' : 'No';

      return (
        <span>{isAdmin}</span>
      );
    },
  },
];

const UsersTable = (props: Props) => (
  <ClientDataGrid columns={columns} rows={props.rows} emptyMessage="no users!" />
);

export default UsersTable;
