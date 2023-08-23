import { Database } from '@/types/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

import { cookies } from 'next/headers';
import PartecipantUI from './partecipant';
import ControllerUI from './controller';

type Props = {
    params: { id: string }
}

const RunTrial = async(props: Props) => {
  const trialId = props.params.id;

  const supabase = createServerComponentClient<Database>({ cookies });

  const { data: trial } = await supabase
    .from('trials')
    .select()
    .match({ id: trialId })
    .single();

  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!trial) {
    return (
      <div>no trial!</div>
    );
  }

  const { data: trialPartecipants } = await supabase
    .from('trial_partecipant')
    .select()
    .match({ trial_id: trialId })
    .order('id', { ascending: true });

  const { data: measures } = await supabase
    .from('trial_measures')
    .select('*, measures(measure_name)')
    .match({ trial_id: trialId });

  if (!session) {
    return (
      <PartecipantUI turn={trial.turn ?? 0} trial={trial} partecipants={trialPartecipants ?? []}
        measures={measures ?? []} />
    );
  }

  return (
    <ControllerUI trial={trial} partecipants={trialPartecipants ?? []} measures={measures ?? []}/>
  );
};

export default RunTrial;
