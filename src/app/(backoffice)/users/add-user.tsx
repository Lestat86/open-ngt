'use client';

import { useRouter } from 'next/navigation';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { FaPlus } from 'react-icons/fa6';
import { API_URLS, NEXT_URL } from '@/app/constants/constants';
import { createPortal } from 'react-dom';

type UserFormData = {
    email: string
    name: string
    surname: string
    password: string
    isAdmin: boolean
}

const AddUser = () => {
  const [ showModal, setShowModal ] = useState(false);

  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<UserFormData>();

  const onSubmit = handleSubmit(async(data) => {
    await fetch(`${NEXT_URL}/${API_URLS.ADD_USER}`, {
      method: 'put',
      body:   JSON.stringify({ ...data }),
    });

    setShowModal(false);
    router.refresh();
  });

  const toggleCreating = () => setShowModal(!showModal);

  const emailOk = errors.email === undefined;
  const nameOk = errors.name === undefined;
  const surnameOk = errors.surname === undefined;
  const passwordOk = errors.password === undefined;

  if (showModal) {
    return createPortal(
      <div
        className="absolute top-0 left-0 bottom-0 left-0 flex justify-center items-center h-full w-full bg-gray-900/75 overflow-hidden">
        <div className="p-4 flex flex-col justify-center items-center bg-white text-black">
          <div className="text-xl mt-4 flex items-center justify-center">
          Add new user:
          </div>
          <form onSubmit={onSubmit} className="flex flex-col justify-between p-8 items-center">
            <div className="flex my-4">
              <input placeholder="Name"
                {...register('name',
                  { required: true, minLength: { value: 2, message: 'name too small' } })}
                className={`p-2 border-solid border-2 ${nameOk ? 'border-gray-300' : 'border-red-600'}`} />
              <input placeholder="Surname"
                {...register('surname',
                  { required: true, minLength: { value: 2, message: 'surname too small' } })}
                className={`ml-2 p-2 border-solid border-2 ${surnameOk ? 'border-gray-300' : 'border-red-600'}`} />
            </div>
            <div className="flex">
              <input placeholder="Email"
                {...register('email',
                  {
                  // eslint-disable-next-line no-control-regex
                    pattern: new RegExp("([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|\"([]!#-[^-~ \t]|(\\[\t -~]))+\")@([!#-'*+/-9=?A-Z^-~-]+(.[!#-'*+/-9=?A-Z^-~-]+)*|[[\t -Z^-~]*])"),
                  })}
                type="email"
                className={`p-2 border-solid border-2 ${emailOk ? 'border-gray-300' : 'border-red-600'}`} />
              <input placeholder="Password"
                {...register('password',
                  {
                    required:  true,
                    minLength: { value: 2, message: 'password too small' },
                    maxLength: { value: 16, message: 'password too long' },
                  })}
                type="password"
                className={`ml-2 p-2 border-solid border-2 ${passwordOk ? 'border-gray-300' : 'border-red-600'}`} />
            </div>
            <div className="flex items-center w-full mt-4 ml-1">
              <label htmlFor="isAdmin" className="mr-2">Admin?</label>
              <input placeholder="isAdmin?"
                {...register('isAdmin')}
                type="checkbox"
                className={'p-2 border-solid border-2 border-gray-300'} />
            </div>
            <div className="flex p-2 mt-4">
              <input type="submit" value="Edit" className="button-primary" />
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
            Add user
      <FaPlus className="ml-2" />
    </button>
  );
};

export default AddUser;
