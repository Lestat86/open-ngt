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
import { LINES_INDICATORS_PARAMS, TRIAL_END_GRAPHS_COLOR } from '@/app/constants/constants';
import { isRound } from '@/app/utils/items';

type Props = {
    title?: string
    labels: string[]
    okPoints: ICartesianPoints[]
    koPoints: ICartesianPoints[]
    minX: number
    minY: number
    maxX: number
    maxY: number,
    meanX: number,
    meanY: number,
    xLabel: string
    yLabel: string
}

ChartJS.register(LinearScale, PointElement, LineElement, Tooltip, Legend, ChartDataLabels);

const ScatterPlot = (props: Props) => {
  const { title, labels, okPoints, koPoints, minX, minY, maxX, maxY, meanX,
    meanY, xLabel, yLabel } = props;

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
        ticks: {
          stepSize: 0.01,
          autoSkip: false,
          // @ts-expect-error problem with react-chartjs-2 types
          callback(tick) {
            if (tick === meanY) {
              return tick;
            }

            return isRound(tick) ? tick : '';
          },
        },
        grid: {
          // @ts-expect-error problem with react-chartjs-2 types
          color(context) {
            if (context.tick.value === meanY) {
              return LINES_INDICATORS_PARAMS.COLOR;
            }

            return ChartJS.defaults.borderColor;
          },
          // @ts-expect-error problem with react-chartjs-2 types
          lineWidth(context) {
            if (context.tick.value === meanY) {
              return LINES_INDICATORS_PARAMS.ENPHASIZED_WIDTH;
            }

            if (!isRound(context.tick.value)) {
              return 0;
            }

            return LINES_INDICATORS_PARAMS.NORMAL_WIDTH;
          },
        },
      },
      x: {
        max:   maxX,
        min:   minX,
        title: {
          display: true,
          text:    xLabel,
        },
        ticks: {
          stepSize: 0.01,
          autoSkip: false,
          // @ts-expect-error problem with react-chartjs-2 types
          callback(tick) {
            if (tick === meanX) {
              return tick;
            }

            return isRound(tick) ? tick : '';
          },
        },
        grid: {
          // @ts-expect-error problem with react-chartjs-2 types
          color(context) {
            if (context.tick.value === meanX) {
              return LINES_INDICATORS_PARAMS.COLOR;
            }

            return ChartJS.defaults.borderColor;
          },
          // @ts-expect-error problem with react-chartjs-2 types
          lineWidth(context) {
            if (context.tick.value === meanX) {
              return LINES_INDICATORS_PARAMS.ENPHASIZED_WIDTH;
            }

            if (!isRound(context.tick.value)) {
              return 0;
            }

            return LINES_INDICATORS_PARAMS.NORMAL_WIDTH;
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets: [
      {
        label:                'Mean values',
        data:                 okPoints,
        pointBackgroundColor: TRIAL_END_GRAPHS_COLOR.ok,
        pointRadius:          7,
        pointHitRadius:       10,
      },
      {
        label:                'Mean values',
        data:                 koPoints,
        pointBackgroundColor: TRIAL_END_GRAPHS_COLOR.notOk,
        pointRadius:          7,
        pointHitRadius:       10,
      },
    ],
  };

  // @ts-expect-error problem with react-chartjs-2 types
  return <Scatter options={options} data={data} />;
};

export default ScatterPlot;
