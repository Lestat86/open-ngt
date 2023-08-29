'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { API_URLS, NEXT_URL } from '@/app/constants/constants';
import { createPortal } from 'react-dom';

type CriteriaFormData = {
    name: string
    description?: string
}

const AddCriteria = () => {
  const [ showModal, setShowModal ] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<CriteriaFormData>();

  const onSubmit = handleSubmit(async(data) => {
    await fetch(`${NEXT_URL}/${API_URLS.ADD_CRITERIA}`, {
      method: 'put',
      body:   JSON.stringify({ ...data }),
    });

    setShowModal(false);
    router.refresh();
  });

  const toggleCreating = () => setShowModal(!showModal);

  const nameOk = errors.name === undefined;

  if (showModal) {
    return createPortal(
      <div
        className="absolute top-0 left-0 bottom-0 left-0 flex justify-center items-center h-full w-full bg-gray-900/75 overflow-hidden">
        <div className="p-4 flex flex-col justify-center items-center bg-white text-black">
          <div className="text-xl mt-4 flex items-center justify-center">
          Add new criterium:
          </div>
          <form onSubmit={onSubmit} className="flex flex-col justify-between p-8 items-center">
            <div className="flex my-4">
              <input placeholder="Name"
                {...register('name',
                  { required: true, minLength: { value: 2, message: 'name too small' } })}
                className={`p-2 border-solid border-2 ${nameOk ? 'border-gray-300' : 'border-red-600'}`} />
              <input placeholder="Description (optional)"
                {...register('description')}
                className={'ml-2 p-2 border-solid border-2'} />
            </div>
            <div className="flex p-2 mt-4">
              <input type="submit" value="Add" className="button-primary" />
              <button onClick={toggleCreating} className="cursor-pointer ml-4">
              Close
              </button>
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
            Add criterium
      <FaPlus className="ml-2" />
    </button>
  );
};

export default AddCriteria;
