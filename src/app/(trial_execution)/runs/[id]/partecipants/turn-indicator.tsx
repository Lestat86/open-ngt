import { TrialStatus } from '@/app/constants/constants';
import React from 'react';

type Props = {
    turn: number
    currentStatus: TrialStatus
}

const TurnIndicator = (props: Props) => {
  const { turn, currentStatus } = props;

  if (currentStatus !== TrialStatus.TURN_STARTED && currentStatus !== TrialStatus.TURN_ENDED) {
    return null;
  }

  return (
    <div className="text-2xl flex items-center">
            Turn:
      <div className="font-semibold ml-1">
        {turn}
      </div>
    </div>
  );
};

export default TurnIndicator;
