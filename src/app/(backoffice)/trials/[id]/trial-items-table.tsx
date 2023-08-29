'use client';

import ClientDataGrid from '@/app/components/client-data-grid';
import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import { Criteria, TrialItem, TrialItemWithCriteria } from '@/types/database.types';
import { useRouter } from 'next/navigation';
import React from 'react';
import { createPortal } from 'react-dom';
import DeleteTrialItem from './delete-trial-item';

type Props = {
    rows: TrialItem[]
    criteria: Criteria[]
    status: TrialStatus
    selectedCriteria: (number | null)[]
}

interface CriteriaCellProps {
    row: {
        trial_item_with_criteria: TrialItemWithCriteria[]
    }
}

interface DeleteCellProps {
    row: {
        id: number
    }
}

interface IItemTextRow {
    id: number
    item_text: string
}

const getColumns = (
  criteria: Criteria[],
  editFun: (updated:IItemTextRow) => void,
  status: TrialStatus,
  selectedCriteria: (number | null)[],
) => {
  const baseColumns = [
    { key:  'item_text',
      name: 'Text',
      // @ts-expect-error fix this when the library updates
      renderEditCell({ row, onRowChange, onClose }) {
        const disabled = status !== TrialStatus.CREATED && status !== TrialStatus.STARTED;

        const closeFun = async(updated:IItemTextRow) => {
          await editFun(updated);

          onClose(true);
        };

        return createPortal(
          <div
            className="absolute top-0 left-0 bottom-0 left-0 flex justify-center items-center h-screen w-screen bg-gray-900/75"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                onClose();
              }
            }}
          >
            <dialog open className="p-4 flex flex-col">
              <textarea id="newValue" name="newValue" rows={5} cols={33}
                className="resize-none p-2 border border-solid"
                readOnly={disabled}
                value={row.item_text}
                onChange={(e) => onRowChange({ ...row, item_text: e.target.value })} />
              <menu className="flex justify-between items-center mt-2 px-2">
                <button type="button" onClick={() => onClose()}>
                  Cancel
                </button>
                <button type="button" className="button-primary"
                  onClick={() => closeFun(row)} disabled={disabled}>
                  Save
                </button>
              </menu>
            </dialog>
          </div>,
          document.body,
        );
      } },
  ];

  const criteriaCols = criteria
    .filter((current) => selectedCriteria.includes(current.id))
    .map((current) => [
      {
        key:   `${current.id}_minValue`,
        name:  `${current.criteria_name} Min Value`,
        width: '15%',
        renderCell(props: CriteriaCellProps) {
          const associatedCriteria = props.row.trial_item_with_criteria
            .find((item) => item.criteria_id === current.id);

          if (associatedCriteria) {
            return (
              <span>{associatedCriteria.min_value}</span>
            );
          }

          return null;
        },
      },
      {
        key:   `${current.id}_maxValue`,
        name:  `${current.criteria_name} Max Value`,
        width: '15%',
        renderCell(props: CriteriaCellProps) {
          const associatedCriteria = props.row.trial_item_with_criteria
            .find((item) => item.criteria_id === current.id);

          if (associatedCriteria) {
            return (
              <span>{associatedCriteria.max_value}</span>
            );
          }

          return null;
        },
      },
    ])
    .reduce((acc, curr) => acc.concat(curr), []);

  const additionalCols = [
    {
      key:   'delete_item',
      name:  '',
      width: 80,
      renderCell(deleteProps: DeleteCellProps) {
        return (
          <DeleteTrialItem itemId={deleteProps.row.id} currentStatus={status} />
        );
      },
    },
  ];

  return [ ...baseColumns, ...criteriaCols, ...additionalCols ];
};

const TrialItemsTable = (props: Props) => {
  const router = useRouter();

  const editFun = async(updated: IItemTextRow) => {
    const newText = updated.item_text;

    if (newText) {
      await fetch(`${NEXT_URL}/${API_URLS.UPDATE_ITEM_TEXT}`, {
        method: 'post',
        body:   JSON.stringify({ itemId: updated.id, newText }),
      });

      router.refresh();
    }
  };

  const columns = getColumns(props.criteria, editFun, props.status, props.selectedCriteria);

  return (
    <ClientDataGrid columns={columns}
      rows={props.rows} emptyMessage="no items!" />
  );
};

export default TrialItemsTable;
