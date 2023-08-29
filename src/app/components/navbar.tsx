import React, { ReactNode } from 'react';
import Header from './Header';
import LogoutButton from './Header/logout-button';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';
import { cookies } from 'next/headers';
import NavbarItem from './navbar-item';
import { FaHouseChimney, FaTableList, FaUsersGear, FaWarehouse } from 'react-icons/fa6';

interface IRoutes {
    name: string
    path: string
    icon: ReactNode
}

const routes: IRoutes[] = [
  {
    name: 'Home',
    path: '/',
    icon: <FaHouseChimney className="mr-2" />,
  },
  {
    name: 'Criteria',
    path: '/criteria',
    icon: <FaWarehouse className="mr-2" />,
  },
  {
    name: 'Measures',
    path: '/measures',
    icon: <FaWarehouse className="mr-2" />,
  },
  {
    name: 'Trials',
    path: '/trials',
    icon: <FaTableList className="mr-2" />,
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
      icon: <FaUsersGear className="mr-2" />,
    });
  }

  return (
    <div className="flex flex-col w-40 h-screen px-4 bg-[#212121] text-white justify-between">
      <div className="flex flex-col">
        <Header />
        {allRoutes.map(({ name, path, icon }) => (
          <NavbarItem key={path} name={name} path={path} icon={icon} />
        ))}
      </div>
      <div className="mb-4">
        <LogoutButton className="text-l font-semibold" />
      </div>
    </div >
  );
};

export default NavBar;
