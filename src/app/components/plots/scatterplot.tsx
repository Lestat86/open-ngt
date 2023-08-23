import React from 'react';
import {
  Chart as ChartJS,
  LinearScale,
  PointElement,
  LineElement,
  Tooltip,
  Legend,
} from 'chart.js';
import { Scatter } from 'react-chartjs-2';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import { ICartesianPoints } from '@/types/misc';

type Props = {
    title?: string
    labels: string[]
    dataPoints: ICartesianPoints[]
    minX: number
    minY: number
    maxX: number
    maxY: number
    xLabel: string
    yLabel: string
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

const ScatterPlot = (props: Props) => {
  const { title, labels, dataPoints, minX, minY, maxX, maxY, xLabel, yLabel } = props;

  const options = {
    plugins: {
      legend: {
        display: false,
      },
      title: {
        display: true,
        text:    title,
      },
      datalabels: {
        align:   'left',
        anchor:  'right',
        color:   'black',
        padding: { right: 20 },
      },
    },
    scales: {
      y: {
        max:   maxY,
        min:   minY,
        title: {
          display: true,
          text:    yLabel,
        },
      },
      x: {
        max:   maxX,
        min:   minX,
        title: {
          display: true,
          text:    xLabel,
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label:                'questions',
        data:                 dataPoints,
        backgroundColor:      'rgba(255, 99, 132, 1)',
        pointBackgroundColor: '#11c240',
        pointRadius:          7,
        pointHitRadius:       10,
      },
    ],
  };

  // @ts-expect-error problem with react-chartjs-2 types
  return <Scatter options={options} data={data} />;
};

export default ScatterPlot;
