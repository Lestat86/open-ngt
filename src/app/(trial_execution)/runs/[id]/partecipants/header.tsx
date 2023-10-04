'use client';

import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import React from 'react';
import { FaClipboardList } from 'react-icons/fa6';
import TurnIndicator from './turn-indicator';

type Props = {
    storeKey: string
    storedUser: string | null
    storeUserFun: (userId: string) => void
    errorFun: (hasError: boolean) => void
    turn: number
    currentStatus: TrialStatus
    trialId: string
}

const Header = (props: Props) => {
  const { storeKey, storedUser, storeUserFun, errorFun, turn, currentStatus, trialId } = props;

  const enterTrial = async() => {
    await fetch(`${NEXT_URL}/${API_URLS.PARTECIPANT_LOGIN}`, {
      method: 'put',
      body:   JSON.stringify({ trialId }),
    }).then((response) => {
      if (response.ok) {
        return response.json().then((parsed) => {
          const partecipantId = parsed.partecipantId;
          sessionStorage.setItem(storeKey, partecipantId);

          storeUserFun(partecipantId);
        });
      }

      errorFun(true);
      return null;
    }).catch((e) => console.error(e));
  };

  if (storedUser) {
    return (
      <div className="flex items-center justify-between p-4 mt-2 border border-solid shadow-lg">
        <div className="text-2xl mr-4 flex items-center">
          Assigned partecipant id:
          <div className="italic font-semibold ml-2">
            {storedUser}
          </div>
        </div>
        <TurnIndicator turn={turn} currentStatus={currentStatus} />
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-full mt-2 border border-solid shadow-lg">
      <div className="flex flex-col justify-center items-center">
        <FaClipboardList className="text-6xl" />
        <button onClick={enterTrial} className="button-primary m-2">Enter trial</button>
      </div>
    </div>
  );
};

export default Header;
