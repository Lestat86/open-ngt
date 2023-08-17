import '../globals.css';
import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs';
import { Database } from '@/types/database.types';

import { cookies } from 'next/headers';
import Login from '../components/Login';
import NavBar from '../components/navbar';
import React from 'react';

const inter = Inter({ subsets: [ 'latin' ] });

export const metadata: Metadata = {
  title:       'Open NGT',
  description: 'Open NGT platform',
};

type Props = {
  children: React.ReactNode
}

export default async function RootLayout(props: Props) {
  const supabase = createServerComponentClient<Database>({ cookies });
  const {
    data: { session },
  } = await supabase.auth.getSession();

  if (!session) {
    return (
      <html lang="en">
        <body className={inter.className}>
          <Login />
        </body>
      </html >
    );
  }

  return (
    <html lang="en">
      <body className={inter.className}>
        <div className="flex w-full h-screen">
          <NavBar />
          <main className="py-4 px-8 w-full bg-white text-black">
            {props.children}
          </main>
        </div>
      </body>
    </html >
  );
}
