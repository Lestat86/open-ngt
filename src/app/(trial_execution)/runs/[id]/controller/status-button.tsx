'use client';

import { API_URLS, NEXT_URL, TrialStatusLabels } from '@/app/constants/constants';
import React from 'react';

type Props = {
    currentStatus: number
    showIfInStatus: number
    forceHide?: boolean
    statusToSet: number
    trialId: string
    clickFun?: () => void
}

const StatusButton = (props: Props) => {
  const { currentStatus, showIfInStatus, forceHide, statusToSet, trialId, clickFun } = props;

  if ((currentStatus !== showIfInStatus) || forceHide) {
    return null;
  }

  const setStatus = async() => {
    await fetch(`${NEXT_URL}/${API_URLS.TRIAL_STATUS}`, {
      method: 'post',
      body:   JSON.stringify({ trialId, status: statusToSet }),
    });

    await clickFun?.();
  };

  return (
    <button onClick={() => setStatus()} className="button-primary my-2">
      {/* @ts-expect-error fix this later */}
            Set trial to {TrialStatusLabels[statusToSet]}
    </button>
  );
};

export default StatusButton;
