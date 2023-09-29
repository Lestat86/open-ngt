'use client';

import { Database, TrialPartecipant, Trials } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { HydratedTrialItems, IItemSummary, ITrialMeasureWithName } from '@/types/misc';
import TrialItemsForm from './partecipants/items-form';
import Header from './partecipants/header';
import { TrialStatus } from '@/app/constants/constants';
import { useRouter } from 'next/navigation';
import StandByIndicator from './partecipants/stand-by-indicator';
import { getParsedAnswers, getStats, isItemOk } from '@/app/utils/items';
import ErrorComponent from '@/app/components/error-component';

type Props = {
    trial: Trials
    turn: number
    partecipants: TrialPartecipant[]
    measures: ITrialMeasureWithName[]
}

interface IPartecipantAnswersCount {
  [key: number]: number
}

interface IItemPartecipantAnswers {
  [key: string]: IPartecipantAnswersCount
}

const PartecipantUI = (props: Props) => {
  const { trial, turn, partecipants, measures } = props;

  const keyId = `${trial.id}_userId`;

  const sessionUser = sessionStorage.getItem(keyId);
  const router = useRouter();

  const [ storedUser, setStoredUser ] = useState<string | null>(sessionUser);
  const [ hasError, setHasError ] = useState(false);
  const [ items, setItems ] = useState<HydratedTrialItems[] | null>([]);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getData = async() => {
      const { data:answers } = await supabase
        .from('trial_items_answers')
        .select('*, criteria(criteria_name),trial_item!inner(trial_id, item_text)')
        .filter('trial_item.trial_id', 'eq', trial.id);

      let itemsSummary!:IItemSummary;
      if (answers && answers.length > 0) {
        const { parsedData } = getParsedAnswers(answers);
        itemsSummary = getStats(parsedData, measures);
      }

      const itemPartecipantAnswers:IItemPartecipantAnswers = {};

      answers?.forEach((current) => {
        if (!itemPartecipantAnswers[current.trial_item_id]) {
          itemPartecipantAnswers[current.trial_item_id] = {};
        }

        const currentitem = itemPartecipantAnswers[current.trial_item_id];
        if (currentitem[current.partecipant_id] === undefined) {
          currentitem[current.partecipant_id] = 1;
        } else {
          currentitem[current.partecipant_id] += 1;
        }
      });

      const { data:trialItems } = await supabase
        .from('trial_item')
        .select('*, trial_item_with_criteria(*, criteria(*))')
        .match({ trial_id: trial.id });

      const filteredItems = itemsSummary ? (trialItems ?? []).filter((current) => {
        const itemStat = itemsSummary[current.id];
        const itemOk = isItemOk(Object.values(itemStat));

        if (itemOk) {
          return false;
        }
        // in order to avoid false positive, we check that a certain question has
        // the same amount of answers for all partecipants, signifing that every
        // partecipant has answered
        const itemCounts = itemPartecipantAnswers[current.id];

        const allPartecipantsMatch = Object.values(itemCounts)
          .every((currentCount) => currentCount === itemCounts[0]);

        return !allPartecipantsMatch;
      })
        : trialItems;

      setItems(filteredItems);
    };

    getData();
  }, [ measures, supabase, trial.id ]);

  useEffect(() => {
    const channel = supabase
      .channel(trial.id)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'trials',
          filter: `id=eq.${trial.id}`,
        },
        () => router.refresh(),
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ router, supabase, trial.id ]);

  if (hasError) {
    return (
      <ErrorComponent>
        <span>
      Something went wrong! Please try to reload the page.
          <br/>
      If this persist, please contact a developer
        </span>
      </ErrorComponent>
    );
  }

  const partecipant = partecipants.find((current) => current.partecipant_id === storedUser);

  const showItems = !!partecipant && !partecipant.has_submitted
  && trial.status === TrialStatus.TURN_STARTED;

  return (
    <div className="flex flex-col w-full">
      <div className="flex items-center text-4xl p-4 border border-solid shadow-lg">
                Trial:
        <div className="text-3xl italic ml-2">
          {trial.name}
        </div>
      </div>
      <Header storeKey={keyId} storedUser={storedUser}
        storeUserFun={setStoredUser} errorFun={setHasError}
        turn={turn} currentStatus={trial.status}/>
      <StandByIndicator partecipant={partecipant} currentStatus={trial.status} />
      <TrialItemsForm items={items!} show={showItems} turn={turn} partecipantId={partecipant?.id} />
    </div>
  );
};

export default PartecipantUI;
