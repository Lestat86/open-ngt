import ScatterPlot from '@/app/components/plots/scatterplot';
import { ICartesianPoints } from '@/types/misc';
import React from 'react';

type Props = {
    show: boolean
    title?: string
    labels: string[]
    okPoints: ICartesianPoints[]
    koPoints: ICartesianPoints[]
    minX: number
    minY: number
    maxX: number
    maxY: number
    meanX: number,
    meanY: number,
    xLabel: string
    yLabel: string
}

const CriteriaScatter = (props: Props) => {
  const { show, title, labels, okPoints, koPoints, minX, minY, maxX,
    maxY, meanX, meanY, xLabel, yLabel } = props;

  if (!show) {
    return null;
  }

  return (
    <ScatterPlot okPoints={okPoints} koPoints={koPoints} labels={labels} title={title}
      minX={minX} minY={minY} maxX={maxX} maxY={maxY} meanX={meanX} meanY={meanY}
      xLabel={xLabel} yLabel={yLabel} />
  );
};

export default CriteriaScatter;
