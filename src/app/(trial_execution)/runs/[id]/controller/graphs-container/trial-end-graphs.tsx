'use client';

import Histogram from '@/app/components/plots/histogram';
import { ICartesianPoints, IChartDataset, ICriteriaMap, ICriteriaMinMax, ICriteriaTurnStats, IItemStat, IItemSummary, ITrialAnswerWithCriteriaAndText } from '@/types/misc';
import React from 'react';
import { TRIAL_END_GRAPHS_COLOR } from '@/app/constants/constants';
import { areStatsOk, twoDecimals } from '@/app/utils/items';
import CriteriaScatter from './trial-end-graphs/criteria-scatter';
import { mean } from 'mathjs';

type Props = {
    show: boolean
    criteriaMap: ICriteriaMap
    itemsSummary: IItemSummary
    answers: ITrialAnswerWithCriteriaAndText[]
    criteriaMinMax:ICriteriaMinMax
}

interface IHistoDataset {
  [key: number]: IChartDataset
}

const TrialEndGraphs = (props: Props) => {
  const { show, criteriaMap, itemsSummary, answers, criteriaMinMax } = props;

  if (!show) {
    return null;
  }

  if (!itemsSummary) {
    return null;
  }

  const criteriaValues = Object.values(criteriaMap);
  const showScatter = criteriaValues.length === 2;

  const itemsLength = Object.values(itemsSummary).length;

  const questionLabels = Array.from({ length: itemsLength }, (x, i) => `Item ${i + 1}`);
  const histoDatasets:IHistoDataset = {};
  const scatterOKPoints:ICartesianPoints[] = [];
  const scatterKOPoints:ICartesianPoints[] = [];

  Object.values(itemsSummary).forEach((current:ICriteriaTurnStats, idx) => {
    const criteriaTurnStats:IItemStat[] = Object.values(current);
    if (showScatter) {
      const newScatter = {
        x:     criteriaTurnStats[0].mean,
        y:     criteriaTurnStats[1].mean,
        label: questionLabels[idx],
      };

      const criteria1Ok = areStatsOk(criteriaTurnStats[0]);
      const criteria2Ok = areStatsOk(criteriaTurnStats[1]);

      if (criteria1Ok && criteria2Ok) {
        scatterOKPoints.push(newScatter);
      } else {
        scatterKOPoints.push(newScatter);
      }
    }

    Object.entries(current).forEach(([ criteriaId, itemStat ]) => {
      const color = areStatsOk(itemStat) ? TRIAL_END_GRAPHS_COLOR.ok
        : TRIAL_END_GRAPHS_COLOR.notOk;

      if (!histoDatasets[Number(criteriaId)]) {
        histoDatasets[Number(criteriaId)] = {
          label:           criteriaMap[criteriaId]!,
          data:            [ itemStat.mean ],
          borderColor:     [ color ],
          backgroundColor: [ color ],
        };
      } else {
        histoDatasets[Number(criteriaId)].data.push(itemStat.mean);
        (histoDatasets[Number(criteriaId)].borderColor as string[]).push(color);
        (histoDatasets[Number(criteriaId)].backgroundColor as string []).push(color);
      }
    });
  });

  if (Object.values(criteriaMinMax).length === 0) {
    return null;
  }

  const criteriaMinMaxValues = Object.values(criteriaMinMax);

  const minX = criteriaMinMaxValues[0]?.min;
  const minY = criteriaMinMaxValues[1]?.min;
  const maxX = criteriaMinMaxValues[0]?.max;
  const maxY = criteriaMinMaxValues[1]?.max;

  const itemsText = new Set<string>();

  answers.forEach((current) => itemsText.add(current.trial_item!.item_text));

  const criteria1value:number[] = [];
  const criteria2value:number[] = [];

  Object.values(itemsSummary).forEach((current:ICriteriaTurnStats) => {
    const criteriaStatsValues = Object.values(current);

    criteria1value.push(criteriaStatsValues[0].mean);
    criteria2value.push(criteriaStatsValues[1].mean);
  });

  const criteriaMeans:number[] = [];
  criteriaMeans[0] = twoDecimals(mean(criteria1value));
  criteriaMeans[1] = twoDecimals(mean(criteria2value));

  return (
    <div className="flex w-full items-center">
      <div className="w-[80%] flex flex-col h-full overflow-y-auto ">
        <CriteriaScatter show={showScatter} okPoints={scatterOKPoints} koPoints={scatterKOPoints}
          labels={questionLabels} title={'Criteria scatter plot'}
          minX={minX} minY={minY} maxX={maxX} maxY={maxY}
          meanX={criteriaMeans[0]} meanY={criteriaMeans[1]}
          xLabel={criteriaValues[0]!} yLabel={criteriaValues[1]!} />
        {
          Object.values(histoDatasets).map((currentCriteria, idx) => (
            <Histogram datasets={[ currentCriteria ]} key={currentCriteria.label}
              labels={questionLabels} title={currentCriteria.label}
              minY={minY} maxY={maxY} meanValue={criteriaMeans[idx]}
              legend={false}/>
          ))
        }
      </div>
      <div className="flex flex-col ml-4 h-full">
        <div className="text-xl font-semibold">
            Items:
        </div>
        <ul className="italic">
          {[ ...itemsText ].map((current, idx) => (
            <li className="flex" key={`current_${idx}`}>
              {questionLabels[idx]}: {current}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default TrialEndGraphs;
