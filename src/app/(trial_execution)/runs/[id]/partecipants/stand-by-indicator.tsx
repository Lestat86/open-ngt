'use client';

import { TrialStatus } from '@/app/constants/constants';
import { TrialPartecipant } from '@/types/database.types';
import React from 'react';
import { IconType } from 'react-icons';
import { FaRegCircleXmark, FaSquareCheck, FaUserClock, FaUsers } from 'react-icons/fa6';

type Props = {
    currentStatus: number
    partecipant?: TrialPartecipant
}

const StandByIndicator = (props: Props) => {
  const { partecipant } = props;

  let message; let
    Icon: IconType = FaRegCircleXmark;
  switch (props.currentStatus) {
    case TrialStatus.CREATED:
    case TrialStatus.STARTED:
      Icon = FaUserClock;
      message = 'Please wait for the first turn to begin';
      break;

    case TrialStatus.TURN_STARTED:
      if (partecipant?.has_submitted) {
        Icon = FaUserClock;
        message = 'Please wait for all the user to submit their answers';
      }
      break;

    case TrialStatus.TURN_ENDED:
      Icon = FaUsers;
      message = 'The turn has ended. Please follow the speaker';
      break;

    case TrialStatus.COMPLETED:
      Icon = FaSquareCheck;
      message = 'The trial has ended. Thank you for your time';
      break;

      // no default
  }

  if (!message || !partecipant) {
    return null;
  }

  return (
    <div className="flex justify-center items-center w-full h-full p-4 mt-4 border border-solid shadow-lg">
      <div className="flex flex-col justify-center items-center">
        <Icon className="text-6xl" />
        <span className="text-3xl">{message}</span>
      </div>
    </div>
  );
};

export default StandByIndicator;
