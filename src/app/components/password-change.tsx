'use client';

import React, { useRef } from 'react';
import { useForm } from 'react-hook-form';
import Header from './Header';
import { useRouter } from 'next/navigation';
import { API_URLS, NEXT_URL } from '../constants/constants';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

type PasswordChangeFormData = {
    password: string
    confirmPwd: string
}

const PasswordChange = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<PasswordChangeFormData>();
  const password = useRef({});
  password.current = watch('password', '');

  const router = useRouter();

  const supabase = createClientComponentClient<Database>();

  const onSubmit = handleSubmit(async(data) => {
    const newPwd = data.password;

    await fetch(`${NEXT_URL}/${API_URLS.CHANGE_USER_PASSWORD}`, {
      method: 'post',
      body:   JSON.stringify({ password: newPwd }),
    });

    await supabase.auth.refreshSession();

    router.refresh();
  });

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Header />
      <div className="z-10 max-w-5xl w-full items-center justify-between lg:flex">
        <form className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          onSubmit={onSubmit}>
          <label htmlFor="New password">Password</label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            placeholder="••••••••"
            type="password"
            {...register('password', {
              required:  'You must specify a password',
              minLength: {
                value:   8,
                message: 'Password must have at least 8 characters',
              },
            })}
          />
          {errors.password && <p className="text-red-500">{errors.password.message}</p>}

          <label htmlFor="confirmPwd">Repeat password</label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            placeholder="••••••••"
            {...register('confirmPwd', {
              validate: (value) => value === password.current || 'The passwords do not match',
            })}
          />
          {errors.confirmPwd && <p className="text-red-500">{errors.confirmPwd.message}</p>}

          <input type="submit" value="Change password" className="cursor-pointer flex items-center justify-center p-1 mt-10 button-primary" />
        </form>
      </div>
    </main>
  );
};

export default PasswordChange;
