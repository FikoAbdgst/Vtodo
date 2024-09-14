import React, { useEffect, useState } from 'react';
import NamePagePict from '../../../public/namePage.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faUser } from '@fortawesome/free-solid-svg-icons';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ForgotCheckName = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const navigate = useNavigate();
    const location = useLocation();

    // Retrieve email from localStorage
    useEffect(() => {
        const storedEmail = location.state?.email;
        if (storedEmail) {
            setEmail(storedEmail);
        } else {
            // If email is not found in localStorage, navigate back to the email check page
            navigate('/forgot-check-email');
        }
    }, [navigate]);

    const handleNameForgot = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/forgot/check-name', { email, name });
            if (response.data) {
                console.log('Aman, lanjutkan');
                navigate('/change-password', { state: { email, name } }); // Mengirim email dan name ke halaman berikutnya
            }
        } catch (err) {
            setError('Maaf, kata kunci nama anda salah');
        }
    };

    return (
        <div className='w-full flex justify-center items-center flex-col'>
            <p className='text-3xl font-semibold mt-10'>Verify Your Name</p>
            <div className='flex justify-center'>
                <img src={NamePagePict} className='w-80 h-72' alt="Name" />
            </div>
            <p className='text-lg font-semibold'>The next step is to type your name so I know it's really you</p>

            <form className='w-3/5 flex justify-center items-center flex-col' onSubmit={handleNameForgot}>
                <div className='bg-zinc-200 w-1/2 rounded-lg pl-6 mt-8 shadow-md'>
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

                {error && <p className='text-red-500 mt-2'>{error}</p>}
                <div className='w-1/2 flex justify-between items-center flex-col mt-10'>
                    <button className='bg-amber-400 rounded-lg py-2 w-full text-sm font-semibold shadow-3xl border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300'>
                        Check Password
                    </button>
                    <Link to='/forgot-check-email' className='flex justify-center items-center gap-2 mt-4'>
                        <FontAwesomeIcon icon={faArrowLeft} />
                        <p>Back To Check Email</p>
                    </Link>
                </div>
            </form>
        </div>
    );
}

export default ForgotCheckName;
