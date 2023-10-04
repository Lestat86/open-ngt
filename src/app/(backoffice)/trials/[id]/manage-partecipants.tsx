'use client';

import Modal from '@/app/components/modal';
import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import { useRouter } from 'next/navigation';
import React, { useEffect, useState } from 'react';
import { FaPlus } from 'react-icons/fa6';

type Props = {
    trialId?: string
    partecipants: number
    currentStatus?: TrialStatus
}

const ManagePartecipants = (props: Props) => {
  const { trialId, partecipants, currentStatus } = props;
  const [ showModal, setShowModal ] = useState(false);
  const [ updatedNumber, setUpdatedNumber ] = useState<number>(partecipants);

  const router = useRouter();

  useEffect(() => {
    setUpdatedNumber(partecipants);
  }, [ partecipants ]);

  const setPartecipants = async() => {
    await fetch(`${NEXT_URL}/${API_URLS.TRIAL_PARTECIPANTS}`, {
      method: 'put',
      body:   JSON.stringify({ trialId, partecipants: updatedNumber }),
    });

    router.refresh();
    setShowModal(false);
  };

  const toggleCreating = () => setShowModal(!showModal);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setUpdatedNumber(
    Number(event.target.value),
  );

  if (currentStatus !== TrialStatus.CREATED && currentStatus !== TrialStatus.STARTED) {
    return null;
  }

  return (
    <>
      <Modal show={showModal} closeFun={toggleCreating}>
        <div className="flex flex-col p-4">
          <div className="text-xl flex items-center justify-center font-semibold">
          Manage partecipants:
          </div>

          <div className="flex flex-col justify-between mt-10 items-center">
            <input
              value={updatedNumber}
              type="number" min={0}
              onChange={handleChange}
              className={'p-1 border-solid border-2 border-gray-300'} />

            <div className="flex py-2">
              <button className="mt-4 mx-2 button-primary" onClick={setPartecipants}>
                                Update
              </button>
            </div>
          </div>
        </div>
      </Modal>

      <button className="button-primary" onClick={toggleCreating}>
                Manage Partecipants
        <FaPlus className="ml-2" />
      </button>
    </>
  );
};

export default ManagePartecipants;
