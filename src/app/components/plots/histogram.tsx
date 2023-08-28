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

type Props = {
    legend: boolean
    title?: string
    labels: string[]
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
  const { legend, title, labels, datasets } = props;

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
  };

  const data = {
    labels,
    datasets,
  };

  return (
    <Bar options={options} data={data}/>
  );
};

export default Histogram;
