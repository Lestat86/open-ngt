'use client';

import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import { downloadFile } from '@/app/utils/misc';
import React from 'react';
import { FaFileCsv } from 'react-icons/fa6';

type Props = {
    currentStatus: number
    showIfInStatus: number
    trialId: string
}

const DownloadCsvButton = (props: Props) => {
  const { currentStatus, showIfInStatus, trialId } = props;

  if (currentStatus !== showIfInStatus) {
    return null;
  }

  const getCSV = async() => {
    const response = await fetch(`${NEXT_URL}/${API_URLS.GET_RESULTS_CSV}/${trialId}`, {
      method: 'get',
    });

    const csvData = await response.json();

    await downloadFile(new Blob([ csvData ]), `${trialId}.csv`);

    await fetch(`${NEXT_URL}/${API_URLS.TRIAL_STATUS}`, {
      method: 'post',
      body:   JSON.stringify({ trialId, status: TrialStatus.EXPORTED }),
    });
  };

  return (
    <button onClick={getCSV} className="button-primary my-2 flex">
        Download results
      <FaFileCsv className="ml-2" />
    </button>
  );
};

export default DownloadCsvButton;
