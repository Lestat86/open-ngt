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
    <div className="flex flex-col text-xl p-2">
      Reference params:
      <div className="flex">
        <div className="flex mr-2">
          <div className="font-semibold italic mr-2">
            {MEASURES_NAMES.STDEV}
          </div>
          {targetDevStd?.score}
        </div>
        <div className="flex mr-2">
          <div className="font-semibold italic mr-2">
            {MEASURES_NAMES.IQR}
          </div>
          {targetIQR?.score}
        </div>
      </div>
    </div>
  );
};

export default ReferenceTrialParams;
