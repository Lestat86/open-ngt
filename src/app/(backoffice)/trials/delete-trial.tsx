'use client';

import Modal from '@/app/components/modal';
import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { FaTrash } from 'react-icons/fa6';

type Props = {
    trialId: string
    currentStatus?: TrialStatus
}

const DeleteTrial = (props: Props) => {
  const { trialId, currentStatus } = props;
  const [ showModal, setShowModal ] = useState(false);

  const router = useRouter();

  const deleteTrialFun = async() => {
    await fetch(`${NEXT_URL}/${API_URLS.DELETE_TRIAL}`, {
      method: 'delete',
      body:   JSON.stringify({ trialId }),
    });

    router.push('/trials');
    setShowModal(false);
  };

  const showFun = () => setShowModal(true);
  const hideFun = () => setShowModal(false);

  if (currentStatus !== TrialStatus.CREATED && currentStatus !== TrialStatus.STARTED
    && currentStatus !== TrialStatus.COMPLETED) {
    return null;
  }

  return (
    <>
      <Modal show={showModal} closeFun={hideFun}>
        <div className="p-4 flex flex-col justify-center items-center">
            Are you sure? The operation is irreversibile
          <div className="flex p-2 justify-center items-center">
            <button className="p-2 button-primary" onClick={deleteTrialFun}>Ok</button>
            <button className="p-2" onClick={hideFun}>Cancel</button>
          </div>
        </div>
      </Modal>

      <button className="button-primary" onClick={showFun} >
            Delete trial
        <FaTrash className="ml-2" />
      </button>
    </>
  );
};

export default DeleteTrial;
