'use client';

import { API_URLS, NEXT_URL } from '@/app/constants/constants';
import { downloadFile } from '@/app/utils/misc';
import React from 'react';

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

    await downloadFile(new Blob([ csvData ]), 'p.csv');
  };

  return (
    <button onClick={getCSV} className="button-primary my-2">
        Donwload results
    </button>
  );
};

export default DownloadCsvButton;
