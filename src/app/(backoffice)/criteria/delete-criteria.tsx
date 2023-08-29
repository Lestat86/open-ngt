'use client';

import { API_URLS, NEXT_URL } from '@/app/constants/constants';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { createPortal } from 'react-dom';
import { FaTrash } from 'react-icons/fa6';

type Props = {
    criteriaId: number
}

const DeleteCriteria = (props: Props) => {
  const { criteriaId } = props;
  const [ showModal, setShowModal ] = useState(false);

  const router = useRouter();

  const deleteCriteriaFun = async() => {
    await fetch(`${NEXT_URL}/${API_URLS.DELETE_CRITERIA}`, {
      method: 'delete',
      body:   JSON.stringify({ criteriaId }),
    });

    router.refresh();
    setShowModal(false);
  };

  const showFun = () => setShowModal(true);
  const hideFun = () => setShowModal(false);

  if (showModal) {
    return createPortal(
      <div
        className="absolute top-0 left-0 bottom-0 left-0 flex justify-center items-center h-full w-full bg-gray-900/75 overflow-hidden">
        <div className="p-4 flex flex-col justify-center items-center bg-white text-black">
            Are you sure? The operation is irreversibile
          <div className="flex p-2 justify-center items-center">
            <button className="p-2 button-primary" onClick={deleteCriteriaFun}>Ok</button>
            <button className="p-2" onClick={hideFun}>Cancel</button>
          </div>
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <button onClick={showFun} >
      <FaTrash className="ml-2" />
    </button>
  );
};

export default DeleteCriteria;
