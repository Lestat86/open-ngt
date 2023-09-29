import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import { IChartDataset } from '@/types/misc';
import { LINES_INDICATORS_PARAMS } from '@/app/constants/constants';
import { isRound } from '@/app/utils/items';

type Props = {
    legend: boolean
    title?: string
    labels: string[]
    minY: number
    maxY: number
    meanValue?: number
    datasets: IChartDataset[]
}

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
);

const Histogram = (props: Props) => {
  const { legend, title, labels, minY, maxY, meanValue, datasets } = props;

  const options = {
    responsive: true,
    plugins:    {
      legend: {
        display:  legend,
        position: 'top' as const,
      },
      title: {
        display: true,
        text:    title,
      },
    },
    scales: {
      y: {
        max:   maxY,
        min:   minY,
        ticks: {
          stepSize: 0.01,
          autoSkip: false,
          // @ts-expect-error problem with react-chartjs-2 types
          callback(tick) {
            if (tick === meanValue) {
              return tick;
            }

            return isRound(tick) ? tick : '';
          },
        },
        grid: {
          // @ts-expect-error problem with react-chartjs-2 types
          color(context) {
            if (meanValue === undefined || meanValue === null) {
              return ChartJS.defaults.borderColor;
            }

            if (context.tick.value === meanValue) {
              return LINES_INDICATORS_PARAMS.COLOR;
            }

            return ChartJS.defaults.borderColor;
          },
          // @ts-expect-error problem with react-chartjs-2 types
          lineWidth(context) {
            if (context.tick.value === meanValue) {
              return LINES_INDICATORS_PARAMS.ENPHASIZED_WIDTH;
            }

            if (!isRound(context.tick.value)) {
              return 0;
            }

            if (meanValue === undefined || meanValue === null) {
              return LINES_INDICATORS_PARAMS.NORMAL_WIDTH;
            }

            return LINES_INDICATORS_PARAMS.NORMAL_WIDTH;
          },
        },
      },
    },
  };

  const data = {
    labels,
    datasets,
  };

  return (
    // @ts-expect-error problem with react-chartjs-2 types
    <Bar options={options} data={data}/>
  );
};

export default Histogram;
