'use client';

import { TrialStatus } from '@/app/constants/constants';
import { getParsedAnswers, getStats, getTurnHistogram } from '@/app/utils/items';
import { Database, TrialItemWithCriteria, TrialPartecipant } from '@/types/database.types';
import { ICriteriaMinMax, ITrialAnswerWithCriteriaAndText, ITrialMeasureWithName } from '@/types/misc';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useCallback, useEffect, useState } from 'react';
import TurnEndGraphs from './graphs-container/turn-end-graphs';
import TrialEndGraphs from './graphs-container/trial-end-graphs';
import Filler from './graphs-container/filler';

type Props = {
    currentStatus: number
    trialId: string
    partecipants: TrialPartecipant[]
    measures: ITrialMeasureWithName[]
}

const GraphsContainer = (props: Props) => {
  const { currentStatus, trialId, partecipants, measures } = props;
  const [ answers, setAnswers ] = useState<ITrialAnswerWithCriteriaAndText[] | null>();

  const [ itemsWithCriteria, setItemsWithCriteria ] = useState<TrialItemWithCriteria[] | null>();

  const supabase = createClientComponentClient<Database>();

  const getData = useCallback(
    async() => {
      const { data:trialItemAnswers } = await supabase
        .from('trial_items_answers')
        .select('*, criteria(criteria_name),trial_item!inner(trial_id, item_text)')
        .filter('trial_item.trial_id', 'eq', trialId);

      setAnswers(trialItemAnswers);

      const { data:trialItemCriteria } = await supabase
        .from('trial_item_with_criteria')
        .select('*,trial_item!inner(trial_id)')
        .filter('trial_item.trial_id', 'eq', trialId);

      setItemsWithCriteria(trialItemCriteria);
    },
    [ supabase, trialId ],
  );

  useEffect(() => {
    getData();
  }, [ getData ]);

  useEffect(() => {
    const channel = supabase
      .channel(`${trialId}_trials_2`)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'trials',
          filter: `id=eq.${trialId}`,
        },
        () => getData(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ getData, supabase, trialId ]);

  const isTurnEnd = currentStatus === TrialStatus.TURN_ENDED;
  const isTrialEnd = currentStatus === TrialStatus.COMPLETED
  || currentStatus === TrialStatus.EXPORTED;

  if (!isTrialEnd && !isTurnEnd) {
    return (
      <div className="flex flex-col mt-4 ml-4 items-center justify-center w-full overflow-y-auto shadow-lg border border-solid">
        <Filler />
      </div>
    );
  }

  if (!answers || !itemsWithCriteria) {
    return null;
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

  const { parsedData, criteriaMap, questionMap } = getParsedAnswers(answers);
  const itemsSummary = getStats(parsedData, measures);
  const histoData = getTurnHistogram(answers, criteriaMinMax);

  return (
    <div className="flex flex-col p-4 w-full h-[98%] overflow-y-auto shadow-lg border border-solid">
      <TurnEndGraphs show={isTurnEnd} parsedData={parsedData} histoData={histoData}
        criteriaMap={criteriaMap} criteriaMinMax={criteriaMinMax} questionMap={questionMap}
        itemsSummary={itemsSummary} partecipants={partecipants}/>
      <TrialEndGraphs show={isTrialEnd} criteriaMap={criteriaMap}
        criteriaMinMax={criteriaMinMax} itemsSummary={itemsSummary} answers={answers} />
    </div>
  );
};

export default GraphsContainer;
