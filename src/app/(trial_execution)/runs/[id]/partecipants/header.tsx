'use client';

import { API_URLS, NEXT_URL } from '@/app/constants/constants';
import React, { useState } from 'react';
import { FaClipboardList } from 'react-icons/fa6';

type Props = {
    storeKey: string
    storedUser: string | null
    storeUserFun: (userId: string) => void
    errorFun: (hasError: boolean) => void
}

const Header = (props: Props) => {
  const { storeKey, storedUser, storeUserFun, errorFun } = props;
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
    }).catch((e) => console.log(e));
  };

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setValue(event.target.value);

  if (storedUser) {
    return (
      <div className="text-2xl">
                Assigned partecipant id: {storedUser}
      </div>
    );
  }

  return (
    <div className="flex justify-center items-center w-full h-full">
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
