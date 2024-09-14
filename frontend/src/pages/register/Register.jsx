import { faEnvelope, faLock, faLockOpen, faUser } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Task from '../../../public/task.png';
import '../../App.css';
import toast, { Toaster } from 'react-hot-toast';
import 'animate.css';

const Register = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorEmail, setErrorEmail] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfPassword, setErrorConfPassword] = useState('');
    const navigate = useNavigate();


    useEffect(() => {
        setErrorEmail('');
    }, [email]);

    useEffect(() => {
        if (password.length === 0) {
            setErrorPassword('');
        } else {
            const passwordStrength = getPasswordStrength(password);
            if (passwordStrength === 'vulnerable') {
                setErrorPassword('Password is too weak');
            } else if (passwordStrength === 'normal') {
                setErrorPassword('Password is normal, but not very secure');
            } else {
                setErrorPassword('Password is Strong');
            }
        }
    }, [password]);

    useEffect(() => {
        setErrorConfPassword('');
    }, [confirmPassword]);

    const getPasswordStrength = (password) => {
        if (password.length < 5) {
            return 'vulnerable';
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return 'normal';
        }
        return 'strong';
    };

    const handleRegister = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            setErrorConfPassword('Passwords do not match');
            return;
        }

        try {
            const response = await fetch('http://localhost:3000/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name, email, password, confirmPassword }),
            });

            const data = await response.json();

            if (!response.ok) {
                if (data.error === 'Email already exists') {
                    setErrorEmail('Email already exists');
                } else if (data.error === 'Password is too weak') {
                    setErrorPassword('Password is too weak');
                } else if (data.error === 'Passwords do not match') {
                    setErrorConfPassword('Passwords do not match');
                } else {
                    setErrorConfPassword('An unknown error occurred');
                }
            } else {

                toast.success('User registered successfully');

                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            console.error('Error during registration:', err);
            toast.error('Error during registration');
        }
    };


    const getBorderColor = (strength) => {
        switch (strength) {
            case 'normal':
                return 'border-orange-500 text-orange-500';
            case 'strong':
                return 'border-green-500 text-green-500';
            default:
                return 'border-none';
        }
    };

    const passwordStrength = getPasswordStrength(password);

    return (
        <>
            <Toaster position="top-center" />
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
                            <Link to={'/login'}>
                                <p className='text-3xl p-2 font-semibold text-center text-zinc-300 hover:text-zinc-400'>Login</p>
                            </Link>
                            <Link to={'/register'}>
                                <p className='text-3xl p-2 font-semibold text-center border-b-2 border-b-amber-500'>Sign Up</p>
                            </Link>
                        </div>
                        <form onSubmit={handleRegister}>
                            <div className='bg-zinc-200 w-full rounded-lg pl-6 mt-8 shadow-md'>
                                <FontAwesomeIcon icon={faUser} className='text-zinc-400' />
                                <input
                                    type="text"
                                    className='bg-zinc-200 py-3 pl-3 outline-none w-11/12'
                                    placeholder='Name'
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    required
                                />
                            </div>
                            <div className={`bg-zinc-200 w-full rounded-lg pl-6 border-2 mt-8 shadow-md ${errorEmail ? 'border-red-600 text-red-600' : 'border-none'}`}>
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
                            {errorEmail && <p className='text-red-500 mt-2 ml-2'>{errorEmail}</p>}
                            <div className={`bg-zinc-200 w-full rounded-lg pl-6 border-2 shadow-md ${getBorderColor(passwordStrength)} ${errorEmail ? 'mt-2' : 'mt-8'}`}>
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
                            {errorPassword && <p className={`mt-2 ${passwordStrength === 'normal' ? 'text-orange-500' : passwordStrength === 'strong' ? 'text-green-500' : 'text-red-500'}`}>{errorPassword}</p>}
                            <div className={`bg-zinc-200 w-full rounded-lg pl-6 border-2 shadow-md ${errorPassword ? 'mt-2' : 'mt-8'} ${errorConfPassword ? 'border-red-600 text-red-600' : 'border-none'}`}>
                                <FontAwesomeIcon icon={faLockOpen} className='text-zinc-400' />
                                <input
                                    type="password"
                                    className='bg-zinc-200 py-3 pl-3 outline-none w-11/12'
                                    placeholder='Confirm Password'
                                    value={confirmPassword}
                                    onChange={(e) => setConfirmPassword(e.target.value)}
                                    required
                                />
                            </div>
                            {errorConfPassword && <p className='text-red-500 mt-2 ml-2'>{errorConfPassword}</p>}
                            <button className={`bg-amber-400 w-full rounded-lg py-2 mt-6 font-semibold shadow-3xl border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300 ${errorConfPassword ? ' mt-2' : 'mt-8'}`}>
                                Sign Up
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Register;
