'use client';

import Histogram from '@/app/components/plots/histogram';
import { ICartesianPoints, IChartDataset, ICriteriaMap, ICriteriaTurnStats, IItemSummary } from '@/types/misc';
import React, { useEffect, useState } from 'react';
import { TURNS_COLOR } from '@/app/constants/constants';
import ScatterPlot from '@/app/components/plots/scatterplot';
import { Database, TrialItemWithCriteria } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import ErrorComponent from '@/app/components/error-component';

type Props = {
    show: boolean
    criteriaMap: ICriteriaMap
    itemsSummary: IItemSummary
    trialId: string
}

interface ICriteriaMinMax {
  [key: number]: {
    min: number
    max: number
  }
}

interface IHistoDataset {
  [key: number]: IChartDataset
}

const TrialEndGraphs = (props: Props) => {
  const { show, criteriaMap, itemsSummary, trialId } = props;

  const [ itemsWithCriteria, setItemsWithCriteria ] = useState<TrialItemWithCriteria[] | null>();

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getData = async() => {
      const { data } = await supabase
        .from('trial_item_with_criteria')
        .select('*,trial_item!inner(trial_id)')
        .filter('trial_item.trial_id', 'eq', trialId);

      setItemsWithCriteria(data);
    };

    getData();
  }, [ supabase, trialId ]);

  if (!show) {
    return null;
  }

  if (!itemsSummary) {
    return null;
  }

  // In order to have the 2d scatterplot, we must check that there are EXACTLY
  // two criteria. If this is not true, this component can't be used and the user
  // should be alerted. Also, this code must be changed to accomodate more
  // dimensions
  const criteriaValues = Object.values(criteriaMap);
  if (criteriaValues.length !== 2) {
    return (
      <ErrorComponent>
        <span className="text-xl">
        In order to use this component, you MUST have EXACTLY TWO criteria.
          <br/>
        It appears that you have {criteriaValues.length} criteria instead.
          <br/>
        Please contact a developer!
        </span>
      </ErrorComponent>
    );
  }

  const criteriaMinMax:ICriteriaMinMax = {};

  itemsWithCriteria?.forEach((item) => {
    const criteriaId = item.criteria_id!;
    const itemMin = item.min_value;
    const itemMax = item.max_value;

    if (!criteriaMinMax[criteriaId]) {
      criteriaMinMax[criteriaId] = {
        min: itemMin,
        max: itemMax,
      };
    } else {
      const currentElement = criteriaMinMax[criteriaId];
      const currentMin = currentElement.min;
      const currentMax = currentElement.max;

      if (currentMin > itemMin) {
        currentElement.min = itemMin;
      }

      if (currentMax < itemMax) {
        currentElement.max = itemMax;
      }
    }
  });

  const itemsLength = Object.values(itemsSummary).length;

  const questionLabels = Array.from({ length: itemsLength }, (x, i) => `Item ${i + 1}`);
  const histoDatasets:IHistoDataset = {};
  const scatterValues:ICartesianPoints[] = [];

  Object.values(itemsSummary).forEach((current:ICriteriaTurnStats, idx) => {
    const criteriaTurnStats = Object.values(current);
    const newScatter = {
      x:     criteriaTurnStats[0].mean,
      y:     criteriaTurnStats[1].mean,
      label: questionLabels[idx],
    };

    scatterValues.push(newScatter);

    Object.entries(current).forEach(([ criteriaId, itemStat ], idxInner) => {
      if (!histoDatasets[Number(criteriaId)]) {
        histoDatasets[Number(criteriaId)] = {
          label:           criteriaMap[criteriaId]!,
          data:            [ itemStat.mean ],
          // @ts-expect-error fix this later
          borderColor:     TURNS_COLOR[idxInner + 1],
          // @ts-expect-error fix this later
          backgroundColor: TURNS_COLOR[idxInner + 1],
        };
      } else {
        histoDatasets[Number(criteriaId)].data.push(itemStat.mean);
      }
    });
  });

  if (Object.values(criteriaMinMax).length === 0) {
    return null;
  }

  const criteriaMinMaxValues = Object.values(criteriaMinMax);

  const minX = criteriaMinMaxValues[0].min;
  const minY = criteriaMinMaxValues[1].min;
  const maxX = criteriaMinMaxValues[0].max;
  const maxY = criteriaMinMaxValues[1].max;

  return (
    <div className="flex flex-col w-full h-full overflow-y-auto items-center">
      <div className="w-[70%]">
        <ScatterPlot dataPoints={scatterValues} labels={questionLabels} title={'Items means'}
          minX={minX} minY={minY} maxX={maxX} maxY={maxY}
          xLabel={criteriaValues[0]!} yLabel={criteriaValues[1]!} />
      </div>
      <div className="w-[70%]">
        <Histogram datasets={Object.values(histoDatasets)}
          labels={questionLabels} title={'Questions histogram'} />
      </div>
    </div>
  );
};

export default TrialEndGraphs;
