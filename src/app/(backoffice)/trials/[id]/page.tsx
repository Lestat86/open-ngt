import { Database } from '@/types/database.types';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import React from 'react';

import { cookies } from 'next/headers';
import NewTrialItem from './new-trial-item';
import TrialItemsTable from './trial-items-table';
import ManagePartecipants from './manage-partecipants';
import TrialPartecipantsTable from './trial-partecipants-table';
import ReferenceTrialParams from '@/app/(trial_execution)/runs/[id]/controller/graphs-container/turn-end-graphs/reference-params';
import DeleteTrial from '../delete-trial';

type Props = {
    params: { id: string }
}

const EditTrial = async(props: Props) => {
  const supabase = createServerComponentClient<Database>({ cookies });

  const trialId = props.params.id;

  const { data: trial } = await supabase
    .from('trials')
    .select()
    .match({ id: trialId })
    .single();

  const { data: trialItemsWithCriteria } = await supabase
    .from('trial_item')
    .select('*, trial_item_with_criteria(*)')
    .match({ trial_id: trialId });

  const { data: criteria } = await supabase
    .from('criteria')
    .select();

  const { data: trialPartecipants } = await supabase
    .from('trial_partecipant')
    .select()
    .match({ trial_id: trialId });

  const { data: measures } = await supabase
    .from('trial_measures')
    .select('*, measures(measure_name)')
    .match({ trial_id: trialId });

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <span className="text-4xl">
        {trial?.name}
        <ReferenceTrialParams measures={measures ?? []} />
      </span>

      <div className="flex items-center py-1 mt-4">
        <span className="text-2xl mr-2">
          {`This trial has ${trialItemsWithCriteria?.length} items`}
        </span>
        <NewTrialItem trialId={trialId} criteria={criteria ?? []} currentStatus={trial?.status} />
        <DeleteTrial trialId={trialId} currentStatus={trial?.status} />
      </div>

      <TrialItemsTable rows={trialItemsWithCriteria ?? []} criteria={criteria ?? []} />

      <div className="flex items-center py-1 mt-4">
        <span className="text-2xl mr-2">
          {`This trial has ${trialPartecipants?.length} partecipants`}
        </span>
        <ManagePartecipants trialId={trialId} partecipants={trialPartecipants ?? []}
          trialProgressive={trial?.progressive ?? 0} currentStatus={trial?.status} />
      </div>

      <TrialPartecipantsTable rows={trialPartecipants ?? []} />
    </div>
  );
};

export default EditTrial;
