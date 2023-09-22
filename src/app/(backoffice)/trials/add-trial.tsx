'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Criteria, Measures } from '@/types/database.types';
import { FaPlus } from 'react-icons/fa6';
import Modal from '@/app/components/modal';
import { API_URLS, NEXT_URL } from '@/app/constants/constants';

type Props = {
    measures: Measures[]
    criteria: Criteria[]
}

type NewTrialFormData = {
    trialName: string
    measures: {
      id: number,
      value: number,
      minDefault: number,
      maxDefault: number
    }[]
    criteria: {
      id: number,
      minDefault: number,
      maxDefault: number
      selected: boolean
    }[]
}

const AddTrial = (props: Props) => {
  const [ isCreating, setIsCreating ] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors },
  } = useForm<NewTrialFormData>();

  const onSubmit = handleSubmit(async(data) => {
    const name = data.trialName;
    const measures = data.measures;
    const criteria = data.criteria;
    const selectedCriteria = criteria
      .filter((current) => current.selected);

    if (selectedCriteria.length === 0) {
      setError('root', {
        message: 'Error: at least one criteria must be selected',
      });
      return;
    }

    const created = await fetch(`${NEXT_URL}/${API_URLS.TRIALS}`, {
      method: 'put',
      body:   JSON.stringify({ name }),
    });

    const newTrial = await created.json();

    const trialMeasures  = measures
      .filter((current) => current.value !== 0)
      .map((current) => ({
        trial_id:   newTrial.id,
        measure_id: current.id,
        score:      current.value,
      }));

    await fetch(`${NEXT_URL}/${API_URLS.TRIAL_MEASURES}`, {
      method: 'put',
      body:   JSON.stringify({ trialMeasures }),
    });

    const criteriaDefaults  = selectedCriteria
      .map((current) => ({
        trial_id:    newTrial.id,
        criteria_id: current.id,
        min_default: current.minDefault,
        max_default: current.maxDefault,
      }));

    await fetch(`${NEXT_URL}/${API_URLS.ADD_CRITERIA_DEFAULTS}`, {
      method: 'put',
      body:   JSON.stringify({ criteriaDefaults }),
    });

    router.push(`/trials/${newTrial.id!}`);
  });

  const toggleCreating = () => setIsCreating(!isCreating);

  const isValid = errors.trialName === undefined || errors.root;

  const rootErrorMessage = errors.root?.message;

  return (
    <>
      <Modal show={isCreating} closeFun={toggleCreating}>
        <div className="flex flex-col">
          <div className="text-xl mt-4 flex items-center justify-center font-semibold">
          New Trial:
          </div>
          <form onSubmit={onSubmit} className="flex flex-col justify-between p-8 items-center">
            <input placeholder="Trial Name"
              {...register('trialName',
                { required: true, minLength: { value: 2, message: 'name too small' } })}
              className={`p-2 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />

            <div className="mt-4">
              <div className="text-xl font-semibold">
                Measures of dispersion:
              </div>
              {props.measures.map((current) => (
                <div className="mt-2" key={current.id}>
                  <input hidden
                    {...register(`measures.${current.id}.id`)}
                    type="number"
                    value={current.id} />
                  <input placeholder={`${current.measure_name} threshold`}
                    {...register(`measures.${current.id}.value`)}
                    type="number"
                    step="0.01"
                    className={`p-2 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />
                </div>
              ))}
            </div>

            <div className="mt-4 flex-col items-center">
              <div className="text-xl font-semibold ml-2">
                Criteria:
              </div>
              {props.criteria.map((current) => (
                <div className="flex px-2 items-center mt-2" key={current.id}>
                  <input {...register(`criteria.${current.id}.selected`)}
                    type="checkbox"
                    className={'mr-2 border-solid border-2 border-gray-300'} />
                  <input placeholder={`${current.criteria_name} min default`}
                    {...register(`criteria.${current.id}.minDefault`)}
                    type="number"
                    min={1}
                    className={`p-2 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />
                  <input placeholder={`${current.criteria_name} max default`}
                    {...register(`criteria.${current.id}.maxDefault`)}
                    type="number"
                    min={1}
                    className={`p-2 ml-2 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />
                  <input hidden
                    {...register(`criteria.${current.id}.id`)}
                    type="number"
                    value={current.id} />
                </div>
              ))}
            </div>

            {rootErrorMessage && <span className="text-red-600 mt-2">{rootErrorMessage}</span>}
            <input type="submit" value="Create" className="cursor-pointer p-1 mt-10 button-primary" />
          </form>
        </div>
      </Modal>

      <button className="button-primary"
        onClick={toggleCreating}>
                New Trial
        <FaPlus className="ml-2" />
      </button>
    </>
  );
};

export default AddTrial;
