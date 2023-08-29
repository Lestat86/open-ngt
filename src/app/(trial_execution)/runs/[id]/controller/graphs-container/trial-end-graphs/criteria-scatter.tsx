import ScatterPlot from '@/app/components/plots/scatterplot';
import { ICartesianPoints } from '@/types/misc';
import React from 'react';

type Props = {
    show: boolean
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

const CriteriaScatter = (props: Props) => {
  const { show, title, labels, dataPoints, minX, minY, maxX, maxY, xLabel, yLabel } = props;

  if (!show) {
    return null;
  }

  return (
    <ScatterPlot dataPoints={dataPoints} labels={labels} title={title}
      minX={minX} minY={minY} maxX={maxX} maxY={maxY}
      xLabel={xLabel} yLabel={yLabel} />
  );
};

export default CriteriaScatter;
