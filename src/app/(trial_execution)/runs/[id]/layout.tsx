import '../../../globals.css';
import type { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title:       'Open NGT',
  description: 'Open NGT platform',
};

type Props = {
    children: React.ReactNode
}

// eslint-disable-next-line require-await
export default async function RootLayout(props: Props) {
  return (
    <div className="flex w-full h-screen py-4 px-8 w-full bg-white text-black">
      {props.children}
    </div>
  );
}
