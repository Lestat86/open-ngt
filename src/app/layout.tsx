import './globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import Header from './components/Header'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Open NGT',
  description: 'Open NGT platform',
}

type Props = {
  children: React.ReactNode
}

export default function RootLayout(props: Props) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Header />
        {props.children}
      </body>
    </html>
  )
}
