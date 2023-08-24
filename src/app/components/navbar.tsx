import Link from 'next/link';
import React from 'react';
import Header from './Header';
import LogoutButton from './Header/logout-button';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { cookies } from 'next/headers';

interface IRoutes {
    name: string
    path: string
}

const routes: IRoutes[] = [
  {
    name: 'Home',
    path: '/',
  },
  {
    name: 'Criteria',
    path: '/criteria',
  },
  {
    name: 'Measures',
    path: '/measures',
  },
  {
    name: 'Trials',
    path: '/trials',
  },
];

const NavBar = async() => {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  const allRoutes:IRoutes[] = [ ...routes ];

  if (session && session.user.user_metadata.isAdmin) {
    allRoutes.push({
      name: 'Users',
      path: '/users',
    });
  }

  return (
    <div className="flex flex-col w-40 h-screen px-4 bg-blue-700 text-white justify-between">
      <div className="flex flex-col">
        <Header />
        {allRoutes.map(({ name, path }) => (
          <Link key={path} href={path}>{name}</Link>
        ))}
      </div>
      <div className="mb-4">
        <LogoutButton />
      </div>
    </div >
  );
};

export default NavBar;
