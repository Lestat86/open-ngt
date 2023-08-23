'use client';

import ClientDataGrid from '@/app/components/client-data-grid';
import { API_URLS, NEXT_URL } from '@/app/constants/constants';
import { Criteria, TrialItem, TrialItemWithCriteria } from '@/types/database.types';
import { useRouter } from 'next/navigation';
import React from 'react';
import { createPortal } from 'react-dom';

type Props = {
    rows: TrialItem[]
    criteria: Criteria[]
}

interface CriteriaCellProps {
    row: {
        trial_item_with_criteria: TrialItemWithCriteria[]
    }
}

interface IItemTextRow {
    id: number
    item_text: string
}

const getColumns = (criteria: Criteria[], editFun: (updated:IItemTextRow) => void) => {
  const baseColumns = [
    { key:   'item_text',
      name:  'Text',
      width: 'max-content',
      // @ts-expect-error fix this when the library updates
      renderEditCell({ row, onRowChange, onClose }) {
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
                value={row.item_text}
                onChange={(e) => onRowChange({ ...row, item_text: e.target.value })} />
              <menu className="flex justify-between items-center mt-2 px-2">
                <button type="button" onClick={() => onClose()}>
                  Cancel
                </button>
                <button type="button" className="button-primary"
                  onClick={() => closeFun(row)}>
                  Save
                </button>
              </menu>
            </dialog>
          </div>,
          document.body,
        );
      } },
  ];

  const criteriaCols = criteria.map((current) => [
    {
      key:  `${current.id}_minValue`,
      name: `${current.criteria_name} Min Value`,
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
      key:  `${current.id}_maxValue`,
      name: `${current.criteria_name} Max Value`,
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

  return [ ...baseColumns, ...criteriaCols ];
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
  return (
    <ClientDataGrid columns={getColumns(props.criteria, editFun)} rows={props.rows} emptyMessage="no items!" />
  );
};

export default TrialItemsTable;
