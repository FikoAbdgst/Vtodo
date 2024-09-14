import React, { useEffect, useState } from 'react'
import PassPagePict from '../../../public/passPage.png'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faEye, faEyeSlash, faLock } from '@fortawesome/free-solid-svg-icons'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import axios from 'axios'


const ForgotCheckPassword = () => {
    const [hiddenPass, setHiddenPass] = useState(false)
    const [password, setPassword] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    // Ambil data email dan nama dari state
    const { email, name } = location.state || {};
    console.log('Received email:', email);
    console.log('Received name:', name);



    useEffect(() => {
        if (!email || !name) {
            console.error('Email atau nama tidak ditemukan dalam state.');
            navigate('/forgot-check-name'); // Arahkan pengguna kembali jika data tidak ada
            return;
        }

        const fetchPassword = async () => {
            try {
                // Include the password field with a placeholder or empty string if not yet set
                const response = await axios.post('http://localhost:3000/forgot/check-password', { email, name, password: '' });
                console.log('Password received:', response.data.password);
                setPassword(response.data.password);
            } catch (error) {
                console.log('Error fetching password:', error.response?.data.message || error.message);
            }
        };

        fetchPassword();
    }, [email, name, navigate]);

    const handleEye = () => {
        setHiddenPass(!hiddenPass)
    }

    return (
        <div className='w-full flex justify-center items-center flex-col'>
            <p className='text-3xl font-semibold mt-10'>Congratulations 🎉✨</p>
            <div className='flex justify-center'>
                <img src={PassPagePict} className='w-72 h-72' />
            </div>
            <p className='text-lg font-semibold'> This is your Password, remember </p>
            <p className='text-lg font-semibold'> it next time 😗</p>

            {!hiddenPass ? (
                <>
                    <div className='bg-zinc-200 w-2/5 rounded-lg pl-6 mt-8 shadow-md flex justify-between items-center relative'>
                        <div className='flex justify-center items-center'>
                            <FontAwesomeIcon icon={faLock} className='text-zinc-400' />
                            <input
                                type="text"
                                className='bg-zinc-200 py-3 ml-5 outline-none blur-sm'
                                disabled
                                value="xxxxxxxxxx"
                            />
                        </div>
                        <button className='mr-5' onClick={handleEye}>
                            <FontAwesomeIcon icon={faEyeSlash} className='text-zinc-500' />
                        </button>
                    </div>
                    <div className='w-1/4 flex flex-col justify-center items-center'>
                        <Link to={'/change-password'} className='mt-8'>
                            <p className='text-amber-600 border-b border-b-amber-500'>Change Password</p>
                        </Link>
                        <Link to={'/login'} className='w-full'>
                            <button className='w-full mt-5 bg-amber-400 rounded-lg py-2 text-sm font-semibold shadow-3xl border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300'>
                                Back To Login
                            </button>
                        </Link>

                    </div>
                </>
            )
                : (
                    <>
                        <div className='bg-zinc-200 w-2/5 rounded-lg pl-6 mt-8 shadow-md flex justify-between items-center relative'>
                            <div className='flex justify-center items-center'>
                                <FontAwesomeIcon icon={faLock} className='text-zinc-400' />
                                <input
                                    type="text"
                                    className='bg-zinc-200 py-3 ml-5 outline-none '
                                    value={password}
                                    disabled
                                />
                            </div>
                            <button className='mr-5' onClick={handleEye}>
                                <FontAwesomeIcon icon={faEye} className='text-zinc-500' />
                            </button>

                        </div>
                        <div className='w-1/4 flex flex-col justify-center items-center'>
                            <Link to={'/change-password'} className='mt-8'>
                                <p className='text-amber-600 border-b border-b-amber-500'>Change Password</p>
                            </Link>

                            <Link to={'/login'} className='w-full'>
                                <button className='w-full mt-5 bg-amber-400 rounded-lg py-2 text-sm font-semibold shadow-3xl border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300'>
                                    Back To Login
                                </button>
                            </Link>

                        </div>
                    </>
                )

            }
        </div>
    )
}

export default ForgotCheckPassword
