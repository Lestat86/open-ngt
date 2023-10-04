'use client';

import Histogram from '@/app/components/plots/histogram';
import { isItemOk } from '@/app/utils/items';
import { ICriteriaMap, ICriteriaMinMax, IItemSummary, IParsedAnswer, IQuestionMap } from '@/types/misc';
import React from 'react';
import StatsHeader from './turn-end-graphs/stats-header';
import { FaCircleCheck, FaRegCircleXmark } from 'react-icons/fa6';
import { TrialPartecipant } from '@/types/database.types';

type Props = {
    show: boolean
    parsedData: IParsedAnswer
    histoData: IParsedAnswer
    criteriaMap: ICriteriaMap
    questionMap: IQuestionMap
    itemsSummary: IItemSummary
    partecipants: TrialPartecipant[]
    criteriaMinMax:ICriteriaMinMax
}

const TurnEndGraphs = (props: Props) => {
  const { show, parsedData, histoData, criteriaMap, questionMap, itemsSummary,
    partecipants, criteriaMinMax } = props;

  if (!show) {
    return null;
  }

  if (!parsedData || !histoData) {
    return null;
  }

  const minY = 0;
  const maxY = partecipants.length;

  return (
    <div className="flex flex-col w-full overflow-y-auto">
      {
        Object.entries(parsedData).map(([ questionId, questionValue ]) => {
          const questionItem = itemsSummary[Number(questionId)];
          const questionText = questionMap[questionId];
          const questionOk = isItemOk(Object.values(questionItem));

          return (
            <div key={`question_${questionId}`} className="flex flex-col w-full">
              <div className="flex w-full items-center">
                <div className="text-2xl mr-2">
                  {questionText}
                </div>
                {
                  questionOk
                    ? <FaCircleCheck className="ml-2 text-2xl text-green-600" />
                    : <FaRegCircleXmark className="ml-2 text-2xl text-red-600" />
                }
              </div>
              <div className="flex my-4 w-full border border-solid p-1">
                {Object.entries(questionValue).map((turnCriterias) => {
                  const criteriaId = turnCriterias[0];

                  const itemStats = questionItem[Number(criteriaId)];
                  const datasets = Object.values(histoData[Number(questionId)][Number(criteriaId)]);

                  const minX = criteriaMinMax[Number(criteriaId)]?.min;
                  const maxX = criteriaMinMax[Number(criteriaId)]?.max;

                  const labels = [];

                  for (let i = minX; i <= maxX; i++) {
                    labels.push(`${i}`);
                  }

                  return (
                    <div className="flex flex-col mx-2 w-full border-r p-2" key={`criteria_${criteriaId}`}>
                      <StatsHeader itemStats={itemStats} />
                      <div className="w-[90%]">
                        <Histogram datasets={datasets}
                          labels={labels} key={`histo_${questionId}_${criteriaId}`}
                          minY={minY} maxY={maxY}
                          title={criteriaMap[criteriaId]} legend={true} />
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })
      }
    </div>
  );
};

export default TurnEndGraphs;
