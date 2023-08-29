'use client';

import Link from 'next/link';
import React from 'react';
import { FaDoorClosed } from 'react-icons/fa6';

type Props = {
    trialId: string
}

const CloseTrialRunButton = (props: Props) => {
  const { trialId } = props;

  return (
    <Link href={`/trials/${trialId}`} className="button-primary my-2 flex">
        Return to trial edit
      <FaDoorClosed className="ml-2" />
    </Link>
  );
};

export default CloseTrialRunButton;
