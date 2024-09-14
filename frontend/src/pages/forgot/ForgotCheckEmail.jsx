import React, { useState } from 'react';
import EmailPagePict from '../../../public/emailPage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotCheckEmail = () => {
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();

    const handleEmailForgot = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/forgot/check-email', { email });
            if (response.data) {
                navigate('/forgot-check-name', { state: { email } });
            }
        } catch (err) {
            setError('Email tidak ditemukan');
        }
    };

    return (
        <div className='w-full flex justify-center items-center flex-col'>
            <p className='text-3xl font-semibold mt-10'>Verify Your Email</p>
            <div className='flex justify-center'>
                <img src={EmailPagePict} className='w-80 h-72' alt="Email" />
            </div>
            <p className='text-lg font-semibold'>Please type your email address to </p>
            <p className='text-lg font-semibold'> find out your password</p>
            <form className='w-3/5 flex justify-center items-center flex-col' onSubmit={handleEmailForgot}>
                <div className='bg-zinc-200 w-1/2 rounded-lg pl-6 mt-8 shadow-md'>
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

                {error && <p className='text-red-500 mt-2'>{error}</p>}
                <div className='w-1/2 flex justify-between items-center flex-col mt-10'>
                    <button className='bg-amber-400 rounded-lg py-2 w-full text-sm font-semibold shadow-3xl border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300'>
                        Submit
                    </button>
                    <Link to='/login' className='flex justify-center items-center gap-2 mt-4'>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <p>Back To Login</p>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotCheckEmail;
