'use client';

import Modal from '@/app/components/modal';
import { API_URLS, NEXT_URL, TrialStatus } from '@/app/constants/constants';
import { Criteria, TrialCriteriaDefaults } from '@/types/database.types';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';

type Props = {
    trialId?: string
    criteria: Criteria[]
    criteriaDefaults: TrialCriteriaDefaults[]
    currentStatus?: TrialStatus
}

interface ICriteriaParams {
   id: number
   minValue: number | null
   maxValue: number | null
}

type NewTrialItemData = {
    itemText: string,
    criteria: ICriteriaParams[]
}

const NewTrialItem = (props: Props) => {
  const { criteria, criteriaDefaults, currentStatus } = props;

  const [ isCreating, setIsCreating ] = useState(false);

  const router = useRouter();

  const selectedCriteriaIds:number[] = [];
  const defaultCriteria:ICriteriaParams[] = [];

  criteriaDefaults.forEach((current) => {
    const criteriaId = current.criteria_id!;
    selectedCriteriaIds.push(criteriaId);

    defaultCriteria[criteriaId] = {
      id:       criteriaId,
      minValue: current.min_default,
      maxValue: current.max_default,
    };
  });

  const {
    register,
    handleSubmit,
    reset,
    formState,
    formState: { errors },
  } = useForm<NewTrialItemData>({
    defaultValues: {
      criteria: defaultCriteria,
    },
  });

  React.useEffect(() => {
    if (formState.isSubmitSuccessful) {
      reset();
    }
  }, [ formState, reset ]);

  const onSubmit = handleSubmit(async(data) => {
    const text = data.itemText;
    const trialId = props.trialId;
    const criteriaValues = data.criteria;

    const created = await fetch(`${NEXT_URL}/${API_URLS.TRIAL_ITEMS}`, {
      method: 'put',
      body:   JSON.stringify({ text, trialId }),
    });

    const newTrialItem = await created.json();

    const trialItemWithCriteria = criteriaValues
      .filter((current) => {
        if (current) {
          return selectedCriteriaIds.includes(current.id);
        }

        return false;
      })
      .map((current) => ({
        trial_item_id: newTrialItem.id,
        criteria_id:   current.id,
        min_value:     current.minValue,
        max_value:     current.maxValue,
      }));

    await fetch(`${NEXT_URL}/${API_URLS.TRIAL_ITEM_WITH_CRITERIA}`, {
      method: 'put',
      body:   JSON.stringify({ trialItemWithCriteria }),
    });

    router.refresh();
    setIsCreating(false);
  });

  const toggleCreating = () => setIsCreating(!isCreating);

  const isValid = errors.itemText === undefined;

  if (currentStatus !== TrialStatus.CREATED && currentStatus !== TrialStatus.STARTED) {
    return null;
  }

  return (
    <>
      <Modal show={isCreating} closeFun={toggleCreating}>
        <div className="flex flex-col">
          <div className="text-xl mt-4 flex items-center justify-center font-semibold">
          New Trial Item:
          </div>
          <form onSubmit={onSubmit} className="flex flex-col justify-between items-center p-8">
            <input placeholder="Item Text"
              {...register('itemText',
                { required: true, minLength: { value: 2, message: 'text too small' } })}
              className={`p-1 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />

            <div className="mt-4">

              {criteria.map((current) => {
                if (!selectedCriteriaIds.includes(current.id)) {
                  return null;
                }

                const criteriaError = errors.criteria?.[current.id];
                const minValueError = !!criteriaError?.minValue;
                const maxValueError = !!criteriaError?.maxValue;

                return (
                  <div className="p-2" key={current.id}>
                    <input hidden
                      {...register(`criteria.${current.id}.id`)}
                      type="number"
                      value={current.id} />

                    <input placeholder={`${current.criteria_name} min value`}
                      {...register(`criteria.${current.id}.minValue`, { required: true })}
                      type="number"
                      className={`p-1 mt-2 mr-1 border-solid border-2 ${!minValueError ? 'border-gray-300' : 'border-red-600'}`} />

                    <input placeholder={`${current.criteria_name} max value`}
                      {...register(`criteria.${current.id}.maxValue`, { required: true })}
                      type="number"
                      className={`p-1 mt-2 mr-1 border-solid border-2 ${!maxValueError ? 'border-gray-300' : 'border-red-600'}`} />
                  </div>
                );
              })}
            </div>
            <input type="submit" value="Create" className="p-1 mt-8 button-primary" />
          </form>
        </div>
      </Modal>

      <button className="button-primary" onClick={toggleCreating} >
                New Trial Item
        <FaPlus className="ml-2" />
      </button>
    </>
  );
};

export default NewTrialItem;
