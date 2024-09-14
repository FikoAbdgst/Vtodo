import { faEnvelope, faLock } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import React, { useEffect, useState } from 'react'
import Task from '../../../public/task.png'
import '../../App.css'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import toast, { Toaster } from 'react-hot-toast'

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/auth/login', { email, password });
            localStorage.setItem('token', response.data.token);
            toast.success('Login successfully');
            setTimeout(() => {
                navigate('/dashboard');
            }, 2000);
        } catch (err) {
            // Set the error message based on the response from the server
            if (err.response && err.response.data) {
                toast.error(err.response.data);  // Display error message from the API
            } else {
                toast.error('Something went wrong. Please try again later.');
            }
        }
    };
    return (
        <>
            <Toaster />
            <div className='w-full h-screen flex'>
                <div className='w-1/2 flex justify-center flex-col ml-32'>
                    <p className='thinrobotofont text-6xl'>Welcome To</p>
                    <div className='flex'>
                        <p className='boldrobotofont text-7xl font-extrabold'>VTask</p>
                        <img src={Task} width={300} height={300} className='-ml-20 mt-5 test' />
                    </div>
                </div>
                <div className='w-1/2 flex justify-center mx-5 mt-36'>
                    <div className='block w-3/5'>
                        <div className='flex justify-around'>
                            <Link to={'/login'}><p className='text-3xl p-2 font-semibold text-center border-b-2 border-b-amber-500'>Login</p></Link>
                            <Link to={'/register'}><p className='text-3xl p-2 font-semibold text-center text-zinc-300 hover:text-zinc-400'>Sign Up</p></Link>
                        </div>
                        <form onSubmit={handleLogin}>
                            <div className='bg-zinc-200 w-full rounded-lg pl-6 mt-8 shadow-md'>
                                <FontAwesomeIcon icon={faEnvelope} className='text-zinc-400' />
                                <input
                                    type="email"
                                    className='bg-zinc-200 py-3 pl-3 outline-none w-11/12'
                                    placeholder='Email'
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>
                            <div className='bg-zinc-200 w-full rounded-lg pl-6 mt-5 shadow-md'>
                                <FontAwesomeIcon icon={faLock} className='text-zinc-400' />
                                <input
                                    type="password"
                                    className='bg-zinc-200 py-3 pl-3 outline-none w-11/12'
                                    placeholder='Password'
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {error && <p className='text-red-500 mt-2'>{error}</p>}
                            <div className=' flex justify-between items-center mt-6'>
                                <p className='text-xs text-amber-600'><Link to={'/forgot-check-email'}>Forgot your Password?</Link></p>
                                <button type='submit' className='bg-amber-400 w-2/5 rounded-lg py-2 font-semibold shadow-3xl border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300'>
                                    Login
                                </button>

                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Login