import React, { useEffect, useState } from 'react'
import Navbar from '../components/Navbar';
import Char from '../../public/male.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faPlus, faSearch } from '@fortawesome/free-solid-svg-icons';

const Home = () => {

    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [currentTime, setCurrentTime] = useState('');

    const [searchButton, setSearchButton] = useState(false);


    useEffect(() => {
        const storedLogin = JSON.parse(localStorage.getItem('loggedIn')) || [];
        setName(storedLogin.name)
        setEmail(storedLogin.email)

        const updateTime = () => {
            const now = new Date();
            const day = now.toLocaleDateString('en-US', { weekday: 'long' });
            const date = now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            // const time = now.toLocaleTimeString();
            setCurrentTime(`${day}, ${date}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        return () => clearInterval(interval);
    }, [])

    const handleSearchButton = () => {
        setSearchButton(!searchButton)
    }

    return (
        <div className='w-full h-screen flex items-center bg-amber-300'>
            <div className='w-3/4 h-full bg-white flex items-center rounded-r-3xl'>
                <Navbar
                    name={name}
                    email={email}
                />
                <hr className='bg-zinc-300 w-0.5 h-5/6' />

                <div className='w-65% h-full '>
                    <div className='ml-10 mt-10 mb-5 w-full h-auto flex justify-between items-center relative z-50'>
                        <div className='flex justify-center items-center bg-zinc-300 p-1 rounded-lg'>
                            <button onClick={handleSearchButton} className=' px-2 py-1 '>
                                <FontAwesomeIcon icon={faSearch} />
                            </button>
                            <input type='text' placeholder='Search ...' className=' bg-zinc-300  px-3 py-1 outline-none' />
                        </div>
                        <div className='flex gap-5'>
                            <button className='flex justify-center items-center gap-2 rounded-lg py-2 px-4 text-sm bg-amber-400 text-white border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300'>
                                <FontAwesomeIcon icon={faPlus} />
                                <p>New Activity</p>
                            </button>
                        </div>
                    </div>
                    <p className='text-sm text-zinc-500 ml-10' > Today is {currentTime}</p>
                    <div className='bg-zinc-200 flex w-full h-45% mt-5 ml-10 rounded-3xl relative'>
                        <div className='w-3/5 h-full p-10 flex gap-8 flex-col'>
                            <p className='text-5xl font-medium'> Hello, {name}!</p>
                            <p className='text-lg text-zinc-500'>What are we doing today?</p>
                            <div className='flex gap-10 '>
                                <div className='flex flex-col items-start gap-5'>
                                    <button className='flex gap-2 justify-center items-center'><FontAwesomeIcon icon={faArrowRightFromBracket} className='text-indigo-700' />satu</button>
                                    <button className='flex gap-2 justify-center items-center'><FontAwesomeIcon icon={faArrowRightFromBracket} className='text-red-600' />Dua</button>
                                </div>
                                <div className='flex flex-col items-start gap-5'>
                                    <button className='flex gap-2 justify-center items-center'><FontAwesomeIcon icon={faArrowRightFromBracket} className='text-yellow-400' />Tiga</button>
                                    <button className='flex gap-2 justify-center items-center'><FontAwesomeIcon icon={faArrowRightFromBracket} className='text-blue-400' />Empat</button>
                                </div>
                            </div>
                        </div>
                        <div className='w-2/5 h-full'>
                            <img src={Char} alt="char" className='absolute -top-24 left-64 w-3/4' />
                        </div>
                    </div>
                    <div className='ml-10 mt-5'>
                        <p className='font-semibold'>Tasks for today</p>
                        <div></div>
                    </div>
                </div>
            </div>

        </div>
    )
}

export default Home
