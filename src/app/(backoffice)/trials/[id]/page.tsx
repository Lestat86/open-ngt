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
import GoToTrial from './got-to-trial';

export const dynamic = 'force-dynamic';

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

  const { data: criteriaDefaults } = await supabase
    .from('trial_criteria_defaults')
    .select('*')
    .match({ trial_id: trialId });

  let isError:boolean = false;
  let errorMessage:string = '';

  if (!trial) {
    isError = true;
    errorMessage = 'This trial does not exists';
  }

  if (!criteria) {
    isError = true;
    errorMessage = 'This trial has no criteria selected. This shouldn\'t be possible, please contact a developer';
  }

  if (!measures) {
    isError = true;
    errorMessage = 'This trial has no meeasures selected. This shouldn\'t be possible, please contact a developer';
  }

  if (!criteriaDefaults) {
    isError = true;
    errorMessage = 'There is something wrong with the criteria defaults, please contact a developer';
  }

  if (!trialItemsWithCriteria) {
    isError = true;
    errorMessage = 'There is something wrong with the items criteria, please contact a developer';
  }

  if (isError) {
    return (
      <ErrorComponent>
        <span>
          {errorMessage}
        </span>
      </ErrorComponent>
    );
  }

  const selectedCriteria = criteriaDefaults?.map((current) => current.criteria_id);
  const showCsvStatuses = [ TrialStatus.COMPLETED, TrialStatus.EXPORTED ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <span className="text-4xl font-semibold">
        {/* @ts-expect-error fix this later */}
        {trial.name} ({TrialStatusLabels[trial.status]})
      </span>
      <div className="flex justify-between my-1">
        <EditTrialData trial={trial!} currentMeasures={measures!}
          currentStatus={trial!.status} />
        <DownloadCsvButton currentStatus={trial!.status} showIfInStatus={showCsvStatuses}
          trialId={trial!.id} />
        <DeleteTrial trialId={trialId} currentStatus={trial!.status} />
        <GoToTrial shortHash={trial!.short_hash!} />
      </div>
      <ReferenceTrialParams measures={measures!} />

      <div className="flex items-center justify-between py-1 mt-2 w-full">
        <span className="text-2xl mr-2">
          {`This trial has ${trialItemsWithCriteria?.length} items`}
        </span>
        <NewTrialItem trialId={trialId} criteria={criteria!}
          criteriaDefaults={criteriaDefaults!} currentStatus={trial!.status} />
      </div>

      <TrialItemsTable rows={trialItemsWithCriteria!} criteria={criteria!}
        status={trial!.status} selectedCriteria={selectedCriteria!}/>

      <div className="flex items-center justify-between py-1 mt-4">
        <span className="text-2xl mr-2">
          {`This trial has ${trialPartecipants?.length} partecipants`}
        </span>
        <ManagePartecipants trialId={trialId} partecipants={trialPartecipants ?? []}
          trialProgressive={trial!.progressive ?? 0} currentStatus={trial!.status} />
      </div>

      <TrialPartecipantsTable rows={trialPartecipants ?? []} />
    </div>
  );
};

export default EditTrial;
