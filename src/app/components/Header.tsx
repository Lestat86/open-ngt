import React from 'react'
import { FaChartPie } from 'react-icons/fa6';

const Header = async () => {
    return (
        <div className='flex items-center py-4'>
            <FaChartPie className='mr-2 text-2xl' />
            Open NGT
        </div>
    )
}

export default Header