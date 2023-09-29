'use client';

import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import React, { useState } from 'react';
import { FaClipboardList } from 'react-icons/fa6';
import TurnIndicator from './turn-indicator';

type Props = {
    storeKey: string
    storedUser: string | null
    storeUserFun: (userId: string) => void
    errorFun: (hasError: boolean) => void
    turn: number
    currentStatus: TrialStatus
}

const Header = (props: Props) => {
  const { storeKey, storedUser, storeUserFun, errorFun, turn, currentStatus } = props;
  const [ value, setValue ] = useState('');

  const enterTrial = async() => {
    await fetch(`${NEXT_URL}/${API_URLS.PARTECIPANT_LOGIN}`, {
      method: 'post',
      body:   JSON.stringify({ partecipantId: value }),
    }).then((response) => {
      if (response.ok) {
        sessionStorage.setItem(storeKey, value);
        storeUserFun(value);
      } else {
        errorFun(true);
      }
    }).catch((e) => console.error(e));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

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
        <input placeholder="Enter your partecipant id..."
          onChange={handleChange}
          className={'p-1 border-solid border-2 border-gray-300 my-4'} />
        <button onClick={enterTrial} className="button-primary m-2">Enter trial</button>
      </div>
    </div>
  );
};

export default Header;
