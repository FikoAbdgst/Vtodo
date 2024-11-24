import { faArrowRightFromBracket, faCalendar, faCircle, faDoorOpen, faHome, faList, faMugHot, faUserCircle } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect } from 'react'
import vite from '../../public/vite.svg'
import Ed from '../../public/ed.jpeg'
import { Link, useLocation } from 'react-router-dom'

const Navbar = ({ name, email, setShowNewActivityForm }) => {

    const location = useLocation();

    // Reset `setShowNewActivityForm` setiap kali path berubah
    useEffect(() => {
        setShowNewActivityForm(false); // Properti ini digunakan di sini
        localStorage.removeItem("showNewActivityForm");
    }, [location.pathname]);

    // Fungsi logout
    const handleLogout = () => {
        window.location.href = "/login";
        localStorage.removeItem("loggedIn");
        localStorage.removeItem("showNewActivityForm");
        localStorage.removeItem("token");
        setShowNewActivityForm(false);
    };

    // Fungsi untuk menentukan apakah path saat ini aktif
    const isActive = (path) => location.pathname === path;


    return (
        <div className='w-1/4 h-full flex items-center flex-col'>
            <div className='flex justify-center items-center my-8'>
                <img src={vite} className='' />
                <p className='ml-1 font-bold text-2xl'>VTask</p>
            </div>
            <div className='mt-1 mb-3 flex justify-center items-center flex-col'>
                <div className='w-full flex justify-center items-center flex-col'>
                    <img src={Ed} alt="" className="w-28 h-28 object-cover object-center z-40 rounded-full shadow-2xl" />
                    <div className='flex relative justify-center items-center bg-white rounded-full shadow-2xl z-50 p-2 -mt-4 gap-2'>
                        <FontAwesomeIcon icon={faCircle} className='text-lime-600 w-3 h-3' />
                    </div>
                </div>

                <p className=' font-semibold text-zinc-700  mt-2'>{name}</p>
                <p className='text-xs text-zinc-500 mt-1'>{email}</p>
            </div>
            <div className='w-full h-full flex justify-between items-center flex-col mt-10'>
                <div className='flex justify-center flex-col gap-5'>
                    <Link
                        to='/home'
                        className={` ${isActive('/home') ? 'text-indigo-800 font-semibold' : 'text-zinc-500 hover:text-indigo-800 font-medium '}`}>
                        <FontAwesomeIcon className='mr-2' icon={faHome} /> Dashboard
                    </Link>
                    <Link
                        to='/tasklist'
                        className={` ${isActive('/tasklist') ? 'text-indigo-800 font-semibold' : 'text-zinc-500 hover:text-indigo-800 font-medium'}`}>
                        <FontAwesomeIcon className='mr-2' icon={faList} /> Task List
                    </Link>
                    <Link
                        to='/calendar'
                        className={` ${isActive('/calendar') ? 'text-indigo-800 font-semibold' : 'text-zinc-500 hover:text-indigo-800 font-medium'}`}>
                        <FontAwesomeIcon className='mr-2' icon={faCalendar} /> Calendar
                    </Link>
                    {/* <Link to={'/'} className='text-zinc-500 font-medium hover:text-indigo-800'><FontAwesomeIcon className='mr-2' icon={faMugHot} /> Chill Mode</Link> */}
                </div>
                <button
                    className='my-20 flex justify-center items-center gap-2 bg-red-600 py-2 px-4 rounded-lg border-b-4 border-b-red-800 text-zinc-300 hover:border-b-2'
                    onClick={handleLogout}>
                    <FontAwesomeIcon icon={faDoorOpen} />
                    <p>Logout</p>
                </button>

            </div>
        </div>
    )
}

export default Navbar
