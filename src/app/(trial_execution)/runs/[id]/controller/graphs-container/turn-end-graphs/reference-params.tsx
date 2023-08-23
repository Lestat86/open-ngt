import { MEASURES_NAMES } from '@/app/constants/constants';
import { ITrialMeasureWithName } from '@/types/misc';
import React from 'react';

type Props = {
    measures: ITrialMeasureWithName[]
}

const ReferenceTrialParams = (props: Props) => {
  const measures = props.measures;

  const targetDevStd = measures
    .find((measure) => measure.measures?.measure_name === MEASURES_NAMES.STDEV);
  const targetIQR = measures
    .find((measure) => measure.measures?.measure_name === MEASURES_NAMES.IQR);

  return (
    <div className="flex text-xl p-2 items-center">
      Reference params:
      <div className="p-2">
        {MEASURES_NAMES.STDEV} {targetDevStd?.score}
      </div>
      <div className="p-2">
        {MEASURES_NAMES.IQR} {targetIQR?.score}
      </div>
    </div>
  );
};

export default ReferenceTrialParams;
