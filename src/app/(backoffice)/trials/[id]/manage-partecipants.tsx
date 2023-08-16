"use client"

import Modal from '@/app/components/modal'
import { API_URLS, NEXT_URL } from '@/app/constants/constants'
import { TrialPartecipant } from '@/types/database.types'
import { useRouter } from 'next/navigation'
import React, { useState } from 'react'
import { FaPlus } from 'react-icons/fa6'

type Props = {
    trialId?: string
    trialProgressive: number
    partecipants: TrialPartecipant[]
}

const ManagePartecipants = (props: Props) => {
    const [showModal, setShowModal] = useState(false)
    const [bulkNumber, setBulkNumber] = useState<number>(0)

    const router = useRouter();

    const addPartecipants = async (bulk?: boolean) => {
        const partecipants = []
        const lastIdx = props.partecipants.length + 1

        if (bulk) {
            for (let i = 0; i < bulkNumber; i++) {
                const currentProgressive = lastIdx + i

                const partecipant = {
                    trial_id: props.trialId,
                    partecipant_id: `partecipant_${props.trialProgressive}_${currentProgressive}`
                }

                partecipants.push(partecipant)
            }
        } else {
            const partecipant = {
                trial_id: props.trialId,
                partecipant_id: `partecipant_${props.trialProgressive}_${lastIdx}`
            }

            partecipants.push(partecipant)
        }

        await fetch(`${NEXT_URL}/${API_URLS.TRIAL_PARTECIPANTS}`, {
            method: "put",
            body: JSON.stringify({ partecipants }),
        });

        router.refresh();
        setShowModal(false);
    }

    const deletePartecipants = async (bulk?: boolean) => {
        const partecipantsToDelete: string[] = []
        const lastIdx = props.partecipants.length

        if (bulk) {
            for (let i = 0; i < bulkNumber; i++) {
                const currentProgressive = lastIdx - i

                const partecipantId = `partecipant_${props.trialProgressive}_${currentProgressive}`

                partecipantsToDelete.push(partecipantId)
            }
        } else {
            const partecipantId = `partecipant_${props.trialProgressive}_${lastIdx}`


            partecipantsToDelete.push(partecipantId)
        }

        await fetch(`${NEXT_URL}/${API_URLS.TRIAL_PARTECIPANTS}`, {
            method: "delete",
            body: JSON.stringify({ partecipantsToDelete }),
        });

        router.refresh();
        setShowModal(false);
    }

    const addBulk = async () => {
        await addPartecipants(true)
    }

    const deleteBulk = async () => {
        await deletePartecipants(true)
    }

    const toggleCreating = () => setShowModal(!showModal)

    const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => setBulkNumber(+event.target.value)

    const canDeleteBulk = () => props.partecipants.length === 0 || bulkNumber === 0 || bulkNumber > props.partecipants.length

    return (
        <>
            <Modal show={showModal} closeFun={toggleCreating}>
                <div className='flex flex-col p-4'>
                    <div className='flex py-2 items-center justify-center'>
                        <button className='button-primary mx-2' onClick={() => addPartecipants()}>
                            Add one
                        </button>
                        <button className='button-primary mx-2' disabled={props.partecipants.length === 0}
                            onClick={() => deletePartecipants()}>
                            Remove one
                        </button>
                    </div>

                    <div className='flex flex-col justify-between p-8 items-center'>
                        <input placeholder='Bulk partecipants'
                            type='number' min={0}
                            onChange={handleChange}
                            className={`p-1 border-solid border-2 border-gray-300`} />

                        <div className='flex py-2'>
                            <button className='mt-4 mx-2 button-primary' onClick={addBulk}>
                                Add Bulk
                            </button>
                            <button className='mt-4 mx-2 button-primary' disabled={canDeleteBulk()} onClick={deleteBulk}>
                                Remove bulk
                            </button>
                        </div>
                    </div>
                </div>
            </Modal>

            <button className='button-primary' onClick={toggleCreating}>
                Manage Partecipants
                <FaPlus className='ml-2' />
            </button>
        </>
    )
}

export default ManagePartecipants