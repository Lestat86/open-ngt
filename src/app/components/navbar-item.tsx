'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React, { ReactNode } from 'react';

type Props = {
    name: string
    path: string
    icon: ReactNode
}

const NavbarItem = (props: Props) => {
  const { name, path, icon } = props;
  const pathname = usePathname();

  const selected = pathname === path;

  if (selected) {
    return (
      <div className="flex items-center text-l font-semibold opacity-50 my-1">
        {icon}
        {name}
      </div>
    );
  }

  return (
    <Link key={path} href={path}
      className="flex items-center text-l my-1">
      {icon}
      {name}
    </Link>
  );
};

export default NavbarItem;
