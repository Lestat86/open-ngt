'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import { createPortal } from 'react-dom';
import { ITrialMeasureWithName } from '@/types/misc';
import { Trials } from '@/types/database.types';

type Props = {
    trial: Trials
    currentMeasures: ITrialMeasureWithName[]
    currentStatus: TrialStatus
}

interface MeasureFormField {
  [id: number]:{
    id?: number
    rowId: number
    value?: number
  }
}

type EditTrialFormData = {
    trialName: string
    measures: MeasureFormField
}

const EditTrialData = (props: Props) => {
  const { trial, currentMeasures, currentStatus } = props;
  const [ showModal, setShowModal ] = useState(false);

  const defaultMeasures:MeasureFormField = {};
  currentMeasures.forEach((current) => {
    defaultMeasures[Number(current.measure_id)] = {
      id:    current.measure_id,
      rowId: current.id,
      value: current.score,
    };
  });

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<EditTrialFormData>({
    defaultValues: {
      trialName: props.trial.name,
      measures:  defaultMeasures,
    },
  });

  const onSubmit = handleSubmit(async(data) => {
    const name = data.trialName;
    const measures = data.measures;

    await fetch(`${NEXT_URL}/${API_URLS.EDIT_TRIAL_NAME}`, {
      method: 'post',
      body:   JSON.stringify({ trialId: trial.id, name }),
    });

    const trialMeasures = Object.values(measures)
      .filter((current) => current.value !== 0)
      .map((current) => ({
        id:    current.rowId,
        score: Number(current.value),
      }));

    await fetch(`${NEXT_URL}/${API_URLS.EDIT_TRIAL_MEASURES_VALUES}`, {
      method: 'post',
      body:   JSON.stringify({ trialMeasures }),
    });

    setShowModal(false);
    router.refresh();
  });

  const toggleCreating = () => setShowModal(!showModal);

  const isValid = errors.trialName === undefined;

  if (currentStatus === TrialStatus.COMPLETED || currentStatus === TrialStatus.EXPORTED) {
    return null;
  }

  if (showModal) {
    return createPortal(
      <div
        className="absolute top-0 left-0 bottom-0 left-0 flex justify-center items-center h-full w-full bg-gray-900/75 overflow-hidden">
        <div className="p-4 flex flex-col justify-center items-center bg-white text-black">
          <div className="text-xl mt-4 flex items-center justify-center font-semibold">
          Edit trial data:
          </div>
          <form onSubmit={onSubmit} className="flex flex-col justify-between p-4 items-center">
            <label className="block font-semibold" htmlFor="trialName">
              Trial Name
            </label>
            <input placeholder="Trial Name"
              {...register('trialName',
                { required: true, minLength: { value: 2, message: 'name too small' } })}
              className={`p-2 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />

            <div className="mt-4">
              {currentMeasures.map((current) => (
                <div className="p-2" key={current.measure_id}>
                  {/* @ts-expect-error ts is wrong about this */}
                  <input hidden {...register(`measures.${current.measure_id}.id`)}
                    type="number"
                    value={current.measure_id} />
                  <label className="block font-semibold" htmlFor={`measures.${current.measure_id}.value`}>
                    {current.measures?.measure_name}
                  </label>
                  {/* @ts-expect-error ts is wrong about this */}
                  <input hidden {...register(`measures.${current.measure_id}.rowId`)}
                    type="number"
                    value={current.id} />
                  {/* @ts-expect-error ts is wrong about this */}
                  <input placeholder={`${current.measures?.measure_name} threshold`} {...register(`measures.${current.measure_id}.value`)}
                    type="number"
                    step="0.01"
                    className={`p-2 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />
                </div>
              ))}

              <div className="flex p-2 items-center justify-center mt-10 w-full">
                <input type="submit" value="Edit" className="p-1 mr-4 button-primary" />
                <button onClick={toggleCreating} className="cursor-pointer p-1x">
              Close
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>,
      document.body,
    );
  }

  return (
    <button className="button-primary"
      onClick={toggleCreating}>
            Edit trial data
      <FaPlus className="ml-2" />
    </button>
  );
};

export default EditTrialData;
