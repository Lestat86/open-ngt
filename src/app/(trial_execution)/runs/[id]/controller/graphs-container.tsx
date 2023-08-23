'use client';

import { TrialStatus } from '@/app/constants/constants';
import { getParsedAnswers, getStats } from '@/app/utils/items';
import { Database, TrialPartecipant } from '@/types/database.types';
import { ITrialAnswerWithCriteriaAndText, ITrialMeasureWithName } from '@/types/misc';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useCallback, useEffect, useState } from 'react';
import ReferenceTrialParams from './graphs-container/turn-end-graphs/reference-params';
import TurnEndGraphs from './graphs-container/turn-end-graphs';
import TrialEndGraphs from './graphs-container/trial-end-graphs';

type Props = {
    currentStatus: number
    trialId: string
    partecipants: TrialPartecipant[]
    measures: ITrialMeasureWithName[]
}

const GraphsContainer = (props: Props) => {
  const { currentStatus, trialId, partecipants, measures } = props;
  const [ answers, setAnswers ] = useState<ITrialAnswerWithCriteriaAndText[] | null>();

  const supabase = createClientComponentClient<Database>();

  const getData = useCallback(
    async() => {
      const { data } = await supabase
        .from('trial_items_answers')
        .select('*, criteria(criteria_name),trial_item!inner(trial_id, item_text)')
        .filter('trial_item.trial_id', 'eq', trialId);

      setAnswers(data);
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

  if (!answers) {
    return null;
  }

  const { parsedData, criteriaMap, questionMap } = getParsedAnswers(answers);
  const itemsSummary = getStats(parsedData, measures);
  const isTurnEnd = currentStatus === TrialStatus.TURN_ENDED;
  const isTrialEnd = currentStatus === TrialStatus.COMPLETED;

  return (
    <div className="flex flex-col p-2 w-full h-full overflow-y-auto">
      <ReferenceTrialParams measures={measures} />
      <TurnEndGraphs show={isTurnEnd} parsedData={parsedData} criteriaMap={criteriaMap}
        questionMap={questionMap} itemsSummary={itemsSummary} partecipants={partecipants}/>
      <TrialEndGraphs show={isTrialEnd} criteriaMap={criteriaMap}
        itemsSummary={itemsSummary} trialId={trialId}/>
    </div>
  );
};

export default GraphsContainer;
