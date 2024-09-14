import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'



const Start = () => {


    return (
        <div className='w-full h-screen flex justify-center items-center flex-col'>
            <p className='text-2xl font-bold'>Be more productive and live a neat life</p>
            <Link to={'/login'}>
                <button className='bg-amber-500 px-8 py-3 mt-5 rounded-md shadow-2xl border-b-8 border-b-amber-600 hover:border-b-4 transition-all duration-150 text-white active:translate-y-1 '>
                    Get Started
                </button>

            </Link>
        </div>
    )
}

export default Start
