'use client';

import TrialPartecipantsTable from '@/app/(backoffice)/trials/[id]/trial-partecipants-table';
import { API_URLS, NEXT_URL, TrialStatus, TrialStatusLabels } from '@/app/constants/constants';
import { Database, TrialPartecipant, Trials } from '@/types/database.types';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { useRouter } from 'next/navigation';
import React, { useEffect } from 'react';
import Controls from './controller/controls';
import GraphsContainer from './controller/graphs-container';
import { ITrialMeasureWithName } from '@/types/misc';

type Props = {
    trial: Trials
    partecipants: TrialPartecipant[]
    measures: ITrialMeasureWithName[]
}

const ControllerUI = (props: Props) => {
  const { trial, partecipants, measures } = props;

  const router = useRouter();

  const supabase = createClientComponentClient<Database>();

  useEffect(() => {
    const channel = supabase
      .channel(`${trial.id}_trials`)
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

  useEffect(() => {
    const getNextState = (payload: TrialPartecipant) => {
      const updated = partecipants
        .filter(({ id }) => id !== payload.id)
        .concat(payload);

      const allPresent = updated.every((partecipant) => partecipant.isPresent);
      const allSubmitted = updated.every((partecipant) => partecipant.has_submitted);

      switch (trial.status) {
        case TrialStatus.STARTED:
          return allPresent ? TrialStatus.TURN_STARTED : null;

        case TrialStatus.TURN_STARTED:
          return allSubmitted ? TrialStatus.TURN_ENDED : null;

        default:
          return null;
      }
    };

    const channel = supabase
      .channel(`${trial.id}_partecipants`)
      .on(
        'postgres_changes',
        {
          event:  'UPDATE',
          schema: 'public',
          table:  'trial_partecipant',
          filter: `trial_id=eq.${trial.id}`,
        },
        async(payload) => {
          const nextState = getNextState(payload.new as TrialPartecipant);

          if (nextState) {
            await fetch(`${NEXT_URL}/${API_URLS.TRIAL_STATUS}`, {
              method: 'post',
              body:   JSON.stringify({ trialId: trial.id, status: nextState }),
            });
          }

          router.refresh();
        },
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [ partecipants, router, supabase, trial.id, trial.status ]);

  if (!trial) {
    return null;
  }

  const split = trial.id.split('-');

  const getMissingPartecipants = () => {
    const total = partecipants.length;
    const present = partecipants.filter((current) => current.isPresent).length;

    return total - present;
  };

  const allSubmitted = partecipants.every((partecipant) => partecipant.has_submitted);

  return (
    <div className="flex flex-col w-full h-full overflow-y-hidden">
      <div>RunTrial {split[3]}</div>
      <div>{trial?.name}</div>
      {/* @ts-expect-error fix this later */}
      <div>Status {TrialStatusLabels[trial.status]}</div>
      <div>Current turn: {trial.turn}</div>
      <div className="flex w-full h-[90%]">
        <div className="flex flex-col w-1/4">
          <Controls status={trial.status} trialId={trial.id}
            allSubmitted={allSubmitted} turn={trial.turn ?? 0} />
          <div className="mt-32">
            <div>
                Missing: {getMissingPartecipants()}
            </div>
            <TrialPartecipantsTable rows={partecipants} showStatus />
          </div>
        </div>
        <GraphsContainer currentStatus={trial.status} trialId={trial.id}
          partecipants={partecipants} measures={measures}/>
      </div>
    </div>
  );
};

export default ControllerUI;
