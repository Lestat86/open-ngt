'use client';

import Histogram from '@/app/components/plots/histogram';
import { TURNS_COLOR, TrialStatus } from '@/app/constants/constants';
import { Database, TrialItemsAnswers, TrialPartecipant } from '@/types/database.types';
import { IChartDataset } from '@/types/misc';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useCallback, useEffect, useState } from 'react';

type Props = {
    currentStatus: number
    trialId: string
    partecipants: TrialPartecipant[]
}

interface ITrialAnswerWithCriteriaAndText extends TrialItemsAnswers {
    trial_item: {
        trial_id: string
        item_text: string
    } | null
    criteria: {
        criteria_name: string
    } | null
}

interface ICriteriaMap {
    [criteriaId: string]: string | undefined
}

interface IQuestionMap {
    [questionid: string]: string | undefined
}

interface IParsedAnswer {
      [question: number]: {
          [criteria: number]: {
              [turn:number]: IChartDataset
        }
    }
}

const getParsedAnswers = (answers:ITrialAnswerWithCriteriaAndText[]) => {
  const parsedData:IParsedAnswer = {};
  const questionMap:IQuestionMap = {};
  const criteriaMap:ICriteriaMap = {};

  // eslint-disable-next-line consistent-return
  answers.forEach((answer) => {
    if (answer.criteria_id === null || answer.criteria_id === undefined) {
      return null;
    }

    if (!parsedData[answer.trial_item_id]) {
      parsedData[answer.trial_item_id] = {};
      questionMap[answer.trial_item_id] = answer.trial_item?.item_text;
    }

    const currentQuestion = parsedData[answer.trial_item_id];

    if (!currentQuestion[answer.criteria_id]) {
      currentQuestion[answer.criteria_id] = {};
      criteriaMap[answer.criteria_id] = answer.criteria?.criteria_name;
    }

    const currentCriteria = currentQuestion[answer.criteria_id];

    if (!currentCriteria[answer.turn]) {
      currentCriteria[answer.turn] = {
        label:           `Turn ${answer.turn}`,
        data:            [ answer.score ],
        // @ts-expect-error fix this later
        borderColor:     TURNS_COLOR[answer.turn],
        // @ts-expect-error fix this later
        backgroundColor: TURNS_COLOR[answer.turn],
      };
    } else {
      const currentTurn = currentCriteria[answer.turn];

      currentTurn.data.push(answer.score);
    }
  });

  return { parsedData, questionMap, criteriaMap };
};

const TurnEndGraphs = (props: Props) => {
  const { currentStatus, trialId, partecipants } = props;
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

  if (currentStatus !== TrialStatus.TURN_ENDED && currentStatus !== TrialStatus.COMPLETED) {
    return null;
  }

  if (!answers) {
    return null;
  }

  const { parsedData, criteriaMap, questionMap } = getParsedAnswers(answers);
  const labels = partecipants.map((partecipant) => partecipant.partecipant_id);

  return (
    <div className="flex flex-col p-2 w-full">Graphs!
      <div className="flex flex-col w-full overflow-y-auto">
        {
          Object.entries(parsedData).map(([ questionId, questionValue ]) => (
            <div key={`question_${questionId}`} className="flex flex-col w-full">
              {questionMap[questionId]}
              <div className="flex my-4 w-full">
                {Object.entries(questionValue).map(([ criteriaId, valueId ]) => (
                  <div className="flex flex-col mx-2 w-full" key={`criteria_${criteriaId}`}>
                    <Histogram datasets={Object.values(valueId)}
                      labels={labels} key={`histo_${questionId}_${criteriaId}`}
                      title={criteriaMap[criteriaId]} />
                  </div>
                ))}
              </div>
            </div>
          ))
        }
      </div>
    </div>
  );
};

export default TurnEndGraphs;
