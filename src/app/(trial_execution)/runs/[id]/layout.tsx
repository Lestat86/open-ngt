import '../../../globals.css'
import type { Metadata } from 'next'
import { Inter } from 'next/font/google'


const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
    title: 'Open NGT',
    description: 'Open NGT platform',
}

type Props = {
    children: React.ReactNode
}

export default async function RootLayout(props: Props) {
    return (
        <html lang="en">
            <body className={inter.className}>
                {props.children}
            </body>
        </html >
    )
}
