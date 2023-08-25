'use client';

import { API_URLS, NEXT_URL } from '@/app/constants/constants';
import { HydratedTrialItems } from '@/types/misc';
import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';

type Props = {
    items: HydratedTrialItems[]
    show: boolean
    turn: number
    partecipantId?: number
}

type NewTrialItemData = {
    answers: {
        itemId: number
        criteria: { criteriaId: number, score: string }[]
    }[]
}

const getMarkers = (minValue: number, maxValue: number, id: string) => {
  const ticksLength = (maxValue - minValue) + 1;
  const ticks = Array.from({ length: ticksLength }, (x, i) => i + minValue);

  return (
    <datalist id={id} className="flex justify-between">
      {ticks.map((tick) => (
        // eslint-disable-next-line jsx-a11y/control-has-associated-label
        <option key={`tick_${tick}`} value={tick} label={`${tick}`} />
      ))}
    </datalist>
  );
};

const TrialItemsForm = (props: Props) => {
  const { items, show, turn, partecipantId } = props;

  const [ submitError, setSubmitError ] = useState<string | undefined>();
  const router = useRouter();

  const {
    register,
    handleSubmit,
  } = useForm<NewTrialItemData>();

  const onSubmit = handleSubmit(async(data) => {
    const answers = data.answers
      .filter((answer) => answer)
      .map((current) => current.criteria.map((criteria) => ({
        trial_item_id:  current.itemId,
        partecipant_id: partecipantId,
        criteria_id:    criteria.criteriaId,
        score:          criteria.score,
        turn,
      })))
      .reduce((acc, curr) => acc.concat(curr), [])
      .filter((assembled) => assembled);

    const answersResponse = await fetch(`${NEXT_URL}/${API_URLS.TRIAL_ITEMS_ANSWERS}`, {
      method: 'put',
      body:   JSON.stringify({ answers }),
    });

    if (answersResponse.ok) {
      await fetch(`${NEXT_URL}/${API_URLS.PARTECIPANT_SET_SUBMITTED}`, {
        method: 'post',
        body:   JSON.stringify({ partecipantId, submitted: true }),
      });

      router.refresh();
    } else {
      setSubmitError(answersResponse.statusText);
    }
  });

  if (!show) {
    return null;
  }

  if (!items.length) {
    return (
      <div>No questions!</div>
    );
  }

  return (
    <div className="w-full overflow-y-auto mt-4 border border-solid shadow-lg">
      <form onSubmit={onSubmit}
        className="flex flex-col justify-between items-center p-8">
        {items.map((current) => {
          return (
            <div key={current.id} className="w-full flex flex-col border border-solid p-2 mb-4">
              <span className="text-xl font-semibold italic">{current.item_text}</span>
              <input hidden
                {...register(`answers.${current.id}.itemId`)}
                type="number"
                value={current.id} />
              <div className="flex w-full justify-between">
                {current.trial_item_with_criteria?.map((criteria) => {
                  const name = `answers.${current.id}.criteria.${criteria.criteria_id!}.score`;
                  const datalistId = `markers_${name}`;
                  const text = criteria.criteria?.criteria_name ?? '';

                  return (
                    <div className="flex flex-col w-2/5 mt-4" key={name}>
                      <label htmlFor={name} className="text-sm italic">{text}</label>
                      <input {...register(`answers.${current.id}.criteria.${criteria.criteria_id!}.score`)}
                        type="range" list={datalistId}
                        min={criteria.min_value} max={criteria.max_value} step={1} />
                      {getMarkers(criteria.min_value, criteria.max_value, datalistId)}
                      <input hidden
                        {...register(`answers.${current.id}.criteria.${criteria.criteria_id!}.criteriaId`)}
                        type="number"
                        value={criteria.criteria_id!} />
                    </div>
                  );
                })}
              </div>
            </div>
          );
        })}
        <input type="submit" value="Submit" className="cursor-pointer p-1 button-primary" />
        {
          submitError
            && <span className="text-red-600">{submitError}</span>
        }
      </form>
    </div>
  );
};

export default TrialItemsForm;
