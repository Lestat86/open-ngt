"use client"

import Modal from '@/app/components/modal'
import { Criteria } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { FaPlus } from 'react-icons/fa6'

type Props = {
    trialId?: string
    criteria: Criteria[]
}

type NewTrialItemData = {
    itemText: string,
    criteria: { id: number, minValue: number, maxValue: number }[]
}

const NewTrialItem = (props: Props) => {
    const [isCreating, setIsCreating] = useState(false)

    const router = useRouter();

    const nextUrl = process.env.NEXT_PUBLIC_HOST_URL

    const {
        register,
        handleSubmit,
        reset,
        formState,
        formState: { errors, isSubmitSuccessful },
    } = useForm<NewTrialItemData>()

    React.useEffect(() => {
        if (formState.isSubmitSuccessful) {
            reset()
        }
    }, [formState, reset])


    const onSubmit = handleSubmit(async (data) => {
        const text = data.itemText
        const trialId = props.trialId
        const criteria = data.criteria

        const created = await fetch(`${nextUrl}/api/trial-items`, {
            method: "put",
            body: JSON.stringify({ text, trialId }),
        });

        const newTrialItem = await created.json()

        const trialItemWithCriteria = criteria
            .filter((current) => current)
            .map((current) => ({
                trial_item_id: newTrialItem.id,
                criteria_id: current.id,
                min_value: current.minValue,
                max_value: current.maxValue,
            }))

        await fetch(`${nextUrl}/api/trial-item-with-criteria`, {
            method: "put",
            body: JSON.stringify({ trialItemWithCriteria }),
        });

        router.refresh();
        setIsCreating(false);
    })

    const toggleCreating = () => setIsCreating(!isCreating)

    const isValid = errors.itemText === undefined;

    return (
        <>
            <Modal show={isCreating} closeFun={toggleCreating}>
                <form onSubmit={onSubmit} className='flex flex-col justify-between items-center p-8'>
                    <input placeholder='Item Text'
                        {...register('itemText',
                            { required: true, minLength: { value: 2, message: "text too small" } })}
                        className={`p-1 border-solid border-2 ${isValid ? 'border-gray-300' : 'border-red-600'}`} />

                    {props.criteria.map((current) => {
                        const criteriaError = errors.criteria?.[current.id]
                        const minValueError = !!criteriaError?.minValue
                        const maxValueError = !!criteriaError?.maxValue

                        return (
                            <div className='p-2' key={current.id}>
                                <input hidden
                                    {...register(`criteria.${current.id}.id`)}
                                    type='number'
                                    value={current.id} />

                                <input placeholder={`${current.criteria_name} min value`}
                                    {...register(`criteria.${current.id}.minValue`, { required: true })}
                                    type='number'
                                    className={`max-w-[90%] p-1 border-solid border-2 ${!minValueError ? 'border-gray-300' : 'border-red-600'}`} />

                                <input placeholder={`${current.criteria_name} max value`}
                                    {...register(`criteria.${current.id}.maxValue`, { required: true })}
                                    type='number'
                                    className={`max-w-[90%] p-1 border-solid border-2 ${!maxValueError ? 'border-gray-300' : 'border-red-600'}`} />
                            </div>
                        )
                    })}
                    <input type="submit" value="Create" className='cursor-pointer p-1 button-primary' />
                </form>
            </Modal>

            <button className='button-primary' onClick={toggleCreating}>
                New Trial Item
                <FaPlus className='ml-2' />
            </button>
        </>
    )
}

export default NewTrialItem