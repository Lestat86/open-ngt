import Link from 'next/link'
import React from 'react'
import Header from './Header'
import LogoutButton from './Header/logout-button'

interface IRoutes {
    name: string
    path: string
}

const routes: IRoutes[] = [
    {
        name: 'Home',
        path: '/'
    },
    {
        name: 'Criteria',
        path: '/criteria'
    },
    {
        name: 'Measures',
        path: '/measures'
    },
    {
        name: 'Trials',
        path: '/trials'
    }
]

const NavBar = () => {
    return (
        <div className='flex flex-col w-40 h-screen px-4 bg-blue-700 text-white justify-between'>
            <div className='flex flex-col'>
                <Header />
                {routes.map(({ name, path }) => (
                    <Link href={path}>{name}</Link>
                ))}
            </div>
            <div className='mb-4'>
                <LogoutButton />
            </div>
        </div >
    )
}

export default NavBar