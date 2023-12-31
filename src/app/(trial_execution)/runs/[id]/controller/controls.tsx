'use client';

import React from 'react';
import StatusButton from './status-button';
import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import DownloadCsvButton from './controls/download-csv-button';
import CloseTrialRunButton from './controls/close-trial-run-button';
import { incrementTurn, updateItemsHomogeneity } from '@/app/utils/misc';

type Props = {
    status: number
    trialId: string
    turn: number
}

const Controls = (props: Props) => {
  const { status, trialId, turn } = props;

  const startNewTurn = async() => {
    await incrementTurn(trialId, turn);
  };

  const endTurn = async() => {
    await updateItemsHomogeneity(trialId, turn);
  };

  const resetSubmissionsAndIncrement = async() => {
    await incrementTurn(trialId, turn);

    await fetch(`${NEXT_URL}/${API_URLS.PARTECIPANT_RESET_ALL_SUBMITTED}`, {
      method: 'post',
      body:   JSON.stringify({ trialId }),
    });
  };

  const showCsvStatuses = [ TrialStatus.COMPLETED, TrialStatus.EXPORTED ];

  return (
    <div className="flex flex-col">
      <div className="text-2xl font-semibold">
                Controls
      </div>
      <StatusButton currentStatus={status}
        showIfInStatus={TrialStatus.CREATED}
        statusToSet={TrialStatus.STARTED} trialId={trialId} />
      <StatusButton currentStatus={status}
        showIfInStatus={TrialStatus.STARTED}
        statusToSet={TrialStatus.TURN_STARTED}
        clickFun={startNewTurn}
        trialId={trialId} />
      <StatusButton currentStatus={status}
        showIfInStatus={TrialStatus.TURN_STARTED}
        statusToSet={TrialStatus.TURN_ENDED}
        clickFun={endTurn}
        trialId={trialId} />
      <StatusButton currentStatus={status}
        showIfInStatus={TrialStatus.TURN_ENDED}
        clickFun={resetSubmissionsAndIncrement}
        statusToSet={TrialStatus.TURN_STARTED} trialId={trialId} />
      <StatusButton currentStatus={status}
        showIfInStatus={TrialStatus.TURN_ENDED}
        statusToSet={TrialStatus.COMPLETED} trialId={trialId} />
      <DownloadCsvButton currentStatus={status}
        showIfInStatus={showCsvStatuses} trialId={trialId} />
      <CloseTrialRunButton trialId={trialId} />
    </div>
  );
};

export default Controls;
