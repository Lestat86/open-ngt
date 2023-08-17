import { TrialStatus } from '@/app/constants/constants';
import React from 'react';

type Props = {
    turn: number
    currentStatus: number
}

const TurnIndicator = (props: Props) => {
  const { turn, currentStatus } = props;

  if (currentStatus !== TrialStatus.TURN_STARTED && currentStatus !== TrialStatus.TURN_ENDED) {
    return null;
  }

  return (
    <div className="text-xl mb-4">
            Turn: {turn}
    </div>
  );
};

export default TurnIndicator;
