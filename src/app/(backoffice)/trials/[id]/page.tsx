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
import { TrialStatus, TrialStatusLabels } from '@/app/constants/constants';
import EditTrialData from '../edit-trial-data';
import ErrorComponent from '@/app/components/error-component';
import DownloadCsvButton from '@/app/(trial_execution)/runs/[id]/controller/controls/download-csv-button';

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

  if (!trial) {
    return (
      <ErrorComponent>
        <span>
        This trial does not exists.
        </span>
      </ErrorComponent>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <span className="text-4xl">
        {/* @ts-expect-error fix this later */}
        {trial.name} ({TrialStatusLabels[trial.status]})
        <ReferenceTrialParams measures={measures ?? []} />
        <EditTrialData trial={trial} currentMeasures={measures ?? []}
          currentStatus={trial.status} />
        <DownloadCsvButton currentStatus={trial.status} showIfInStatus={TrialStatus.COMPLETED}
          trialId={trial.id} />
      </span>

      <div className="flex items-center py-1 mt-4">
        <span className="text-2xl mr-2">
          {`This trial has ${trialItemsWithCriteria?.length} items`}
        </span>
        <NewTrialItem trialId={trialId} criteria={criteria ?? []} currentStatus={trial.status} />
        <DeleteTrial trialId={trialId} currentStatus={trial.status} />
      </div>

      <TrialItemsTable rows={trialItemsWithCriteria ?? []} criteria={criteria ?? []}
        status={trial.status}/>

      <div className="flex items-center py-1 mt-4">
        <span className="text-2xl mr-2">
          {`This trial has ${trialPartecipants?.length} partecipants`}
        </span>
        <ManagePartecipants trialId={trialId} partecipants={trialPartecipants ?? []}
          trialProgressive={trial.progressive ?? 0} currentStatus={trial.status} />
      </div>

      <TrialPartecipantsTable rows={trialPartecipants ?? []} />
    </div>
  );
};

export default EditTrial;
