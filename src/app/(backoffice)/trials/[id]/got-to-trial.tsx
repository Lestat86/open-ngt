import { TrialStatus } from '@/app/constants/constants';
import Link from 'next/link';
import React from 'react';
import { FaPlay } from 'react-icons/fa6';

type Props = {
    shortHash: string
    currentStatus: TrialStatus
}

const GoToTrial = (props: Props) => {
  const { shortHash, currentStatus } = props;

  if (currentStatus === TrialStatus.COMPLETED) {
    return null;
  }

  return (
    <Link href={`/runs/${shortHash}`} className="button-primary">
        Go to trial <FaPlay className="ml-2"/>
    </Link>
  );
};

export default GoToTrial;
