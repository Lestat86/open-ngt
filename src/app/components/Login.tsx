'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { createClientComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '../../types/database.types';
import Header from './Header';

const Login = () => {
  const [ email, setEmail ] = useState('');
  const [ password, setPassword ] = useState('');

  const router = useRouter();
  const supabase = createClientComponentClient<Database>();

  const handleSignIn = async(e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    await supabase.auth.signInWithPassword({
      email,
      password,
    });
    router.push('/');
    router.refresh();
  };

  return (
    <main className="flex min-h-screen flex-col items-center p-24">
      <Header />
      <div className="z-10 max-w-5xl w-full items-center justify-between lg:flex">
        <form
          className="flex-1 flex flex-col w-full justify-center gap-2 text-foreground"
          onSubmit={handleSignIn}
        >
          <label className="text-md" htmlFor="email">
                        Email
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            name="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
            placeholder="Email address"
          />
          <label className="text-md" htmlFor="password">
                        Password
          </label>
          <input
            className="rounded-md px-4 py-2 bg-inherit border mb-6"
            type="password"
            name="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            placeholder="••••••••"
          />
          <button className="bg-sky-600 rounded px-4 py-2 text-white mb-6">
                        Sign In
          </button>
        </form>
      </div>
    </main>
  );
};

export default Login;
