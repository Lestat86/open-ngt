'use client';

import 'react-data-grid/lib/styles.css';

import React from 'react';
import DataGrid from 'react-data-grid';
import EmptyRowsRenderer from './client-data-grid/empty-rows-renderer';

interface IDataGridColumn {
    key: string
    name: string
}

type Props = {
    emptyMessage: string
    columns: IDataGridColumn[]
    rows: unknown[]
}

const ClientDataGrid = (props: Props) => {
  const { columns, rows, emptyMessage } = props;

  return (
    <div className="shadow-lg h-[90%]">
      <DataGrid className="styled-table"
        columns={columns} rows={rows} renderers={{
          noRowsFallback: <EmptyRowsRenderer message={emptyMessage} />,
        }} />
    </div>
  );
};

export default ClientDataGrid;
