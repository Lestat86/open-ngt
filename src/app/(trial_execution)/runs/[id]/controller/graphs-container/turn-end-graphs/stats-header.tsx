import { twoDecimals } from '@/app/utils/items';
import { IItemStat } from '@/types/misc';
import React from 'react';

type Props = {
 itemStats: IItemStat
}

const StatsHeader = (props: Props) => {
  const stats = props.itemStats;

  const stdev = twoDecimals(stats.stdev);
  const mean = twoDecimals(stats.mean);
  const iqr = twoDecimals(stats.iqr);

  const itemOk = stats.stdevOk && stats.iqrOk;

  return (
    <div className={'flex justify-between '}>
      <div className={`p-2 ${itemOk ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            Stdev:{stdev}
      </div>
      <div className={`p-2 ${itemOk ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            Mean: {mean}
      </div>
      <div className={`p-2 ${itemOk ? 'bg-green-600' : 'bg-red-600'} text-white`}>
            IQR: {iqr}
      </div>
    </div>
  );
};

export default StatsHeader;
