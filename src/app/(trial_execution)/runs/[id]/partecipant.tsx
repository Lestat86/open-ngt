'use client';

import { Database, TrialPartecipant, Trials } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import React, { useEffect, useState } from 'react';
import { HydratedTrialItems } from '@/types/misc';
import TrialItemsForm from './partecipants/items-form';
import Header from './partecipants/header';
import { TrialStatus } from '@/app/constants/constants';
import { useRouter } from 'next/navigation';
import TurnIndicator from './partecipants/turn-indicator';
import StandByIndicator from './partecipants/stand-by-indicator';

type Props = {
    trial: Trials
    turn: number
    partecipants: TrialPartecipant[]
}

const PartecipantUI = (props: Props) => {
  const { trial, turn, partecipants } = props;

  const keyId = `${trial.id}_userId`;

  const sessionUser = sessionStorage.getItem(keyId);
  const router = useRouter();

  const [ storedUser, setStoredUser ] = useState<string | null>(sessionUser);
  const [ hasError, setHasError ] = useState(false);
  const [ items, setItems ] = useState<HydratedTrialItems[] | null>([]);

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const getData = async() => {
      const { data } = await supabase
        .from('trial_item')
        .select('*, trial_item_with_criteria(*, criteria(*))')
        .match({ trial_id: trial?.id });

      setItems(data);
    };

    getData();
  }, []);

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
      <div>Something went wrong!</div>
    );
  }

  const partecipant = partecipants.find((current) => current.partecipant_id === storedUser);

  const showItems = !!partecipant && !partecipant.has_submitted
  && trial.status === TrialStatus.TURN_STARTED;

  return (
    <div className="flex flex-col w-full">
      <div className="text-4xl">
                Trial: {trial.name}
      </div>
      <Header storeKey={keyId} storedUser={storedUser}
        storeUserFun={setStoredUser} errorFun={setHasError} />
      <TurnIndicator turn={turn} currentStatus={trial.status} />
      <StandByIndicator partecipant={partecipant} currentStatus={trial.status} />
      <TrialItemsForm items={items!} show={showItems} turn={turn} partecipantId={partecipant?.id} />
    </div>
  );
};

export default PartecipantUI;
