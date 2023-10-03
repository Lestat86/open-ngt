'use client';

import { Database, TrialPartecipant, Trials } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { HydratedTrialItems, ITrialMeasureWithName } from '@/types/misc';
import TrialItemsForm from './partecipants/items-form';
import Header from './partecipants/header';
import { TrialStatus } from '@/app/constants/constants';
import { useRouter } from 'next/navigation';
import StandByIndicator from './partecipants/stand-by-indicator';
import ErrorComponent from '@/app/components/error-component';

type Props = {
    trial: Trials
    turn: number
    partecipants: TrialPartecipant[]
    measures: ITrialMeasureWithName[]
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
      const { data:trialItems } = await supabase
        .from('trial_item')
        .select('*, trial_item_with_criteria(*, criteria(*))')
        .match({ trial_id: trial.id, is_homogeneus: false });

      setItems(trialItems);
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
