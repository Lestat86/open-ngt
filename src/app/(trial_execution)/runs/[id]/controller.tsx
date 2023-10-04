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
import ReferenceTrialParams from './controller/graphs-container/turn-end-graphs/reference-params';
import { incrementTurn, updateItemsHomogeneity } from '@/app/utils/misc';

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
            if (nextState === TrialStatus.TURN_STARTED) {
              await incrementTurn(trial.id, trial.turn ?? 0);
            }

            if (nextState === TrialStatus.TURN_ENDED) {
              await updateItemsHomogeneity(trial.id, trial.turn ?? 0);
            }

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
  }, [ partecipants, router, supabase, trial.id, trial.status, trial.turn ]);

  if (!trial) {
    return null;
  }

  const getMissingPartecipants = () => {
    const total = trial.estimated_partecipants;
    const present = partecipants.filter((current) => current.isPresent).length;

    let label = '';
    if (total > present && present > 0) {
      label = `There are ${present - total} partecipants extra`;
    } else {
      const missing = total - present;
      label = `Missing: ${missing}`;
    }

    return (
      <div className="text-lg font-semibold">
        {label}
      </div>
    );
  };

  return (
    <div className="flex flex-col w-full h-full overflow-y-hidden">
      <div className="flex items-center justify-between p-4 shadow-lg border border-solid">
        <div className="flex flex-col ">
          <div className="text-4xl font-semibold">{trial?.name}</div>
          <div className="flex items-center mt-2">
            <div className="text-xl semibold">
            Current status:
              <span className="text-lg font-semibold ml-2">
                {/* @ts-expect-error fix this later */}
                {TrialStatusLabels[trial.status]}
              </span>
            </div>
            <div className="flex text-lg ml-10">
              Current turn:
              <div className="font-semibold ml-2">
                {trial.turn}
              </div>
            </div>
          </div>
        </div>
        <div>
          <ReferenceTrialParams measures={measures} />
        </div>
      </div>

      <div className="flex w-full h-[90%]">
        <div className="flex flex-col w-[20%] mt-4 border border-solid shadow-lg px-3 py-2 h-[calc(100%-3rem)] overflow-y-auto">
          <Controls status={trial.status} trialId={trial.id} turn={trial.turn ?? 0} />
          <div className="mt-32">
            {getMissingPartecipants()}
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
