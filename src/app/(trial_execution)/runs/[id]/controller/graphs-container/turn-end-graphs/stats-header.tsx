import { twoDecimals } from '@/app/utils/items';
import { IItemStat } from '@/types/misc';
import React from 'react';

type Props = {
 itemStats: IItemStat
}

const getMeasureElement = (name:string, value:number, isOk?: boolean) => {
  if (isOk === undefined) {
    return null;
  }

  return (
    <div className={`p-2 ${isOk ? 'bg-green-600' : 'bg-red-600'} text-white`}>
      {name}:{value}
    </div>
  );
};

const StatsHeader = (props: Props) => {
  const stats = props.itemStats;

  const stdev = twoDecimals(stats.stdev);
  const mean = twoDecimals(stats.mean);
  const median = twoDecimals(stats.median);
  const mode = stats.mode.toLocaleString();
  const iqr = twoDecimals(stats.iqr);

  const stdevOk = stats.stdevOk;
  const iqrOk = stats.iqrOk;

  return (
    <div className={'flex justify-between '}>
      {getMeasureElement('Stdev', stdev, stdevOk)}
      {getMeasureElement('IQR', iqr, iqrOk)}
      <div className={'p-2 font-semibold'}>
            Mean: {mean}
      </div>
      <div className={'p-2 font-semibold'}>
            Median: {median}
      </div>
      <div className={'p-2 font-semibold'}>
            Mode: {mode}
      </div>
    </div>
  );
};

export default StatsHeader;
