import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faEyeSlash, faLock, faLockOpen } from '@fortawesome/free-solid-svg-icons';
import { useLocation, useNavigate } from 'react-router-dom';
import toast, { Toaster } from 'react-hot-toast';
import NamePagePict from '../../../public/namePage.png';
import axios from 'axios';

const ChangePassword = () => {
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [errorPassword, setErrorPassword] = useState('');
    const [errorConfPassword, setErrorConfPassword] = useState('');
    const [hiddenPass, setHiddenPass] = useState(false);
    const [hiddenPassConf, setHiddenPassConf] = useState(false);
    const [email, setEmail] = useState('');
    const [name, setName] = useState('');
    const location = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        const storedEmail = location.state?.email;
        const storedName = location.state?.name;
        if (storedEmail && storedName) {
            setEmail(storedEmail);
            setName(storedName);
        } else {
            navigate('/forgot-check-name');
        }
    }, [location, navigate]);

    const getPasswordStrength = (password) => {
        if (password.length < 5) {
            return 'weak';
        }
        if (!/[A-Z]/.test(password) || !/[a-z]/.test(password) || !/\d/.test(password)) {
            return 'normal';
        }
        return 'strong';
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (newPassword.length < 5) {
            setErrorPassword('Password is too weak');
            return;
        }

        if (newPassword !== confirmPassword) {
            setErrorConfPassword('Passwords do not match');
            return;
        }

        try {
            const response = await axios.post('http://localhost:3000/forgot/change-password', { email, name, newPassword });

            // Axios doesn't have response.ok; just check for successful response
            if (response.status === 200) {
                toast.success('Password changed successfully!');
                setTimeout(() => {
                    navigate('/login');
                }, 2000);
            }
        } catch (err) {
            toast.error(err.response?.data.message || 'Error changing password');
        }

    };

    const getBorderColor = (strength) => {
        switch (strength) {
            case 'normal':
                return 'border-orange-500 text-orange-500';
            case 'strong':
                return 'border-green-500 text-green-500';
            case 'weak':
                return 'border-red-500 text-red-500';
            default:
                return 'border-none';
        }
    };

    const passwordStrength = getPasswordStrength(newPassword);

    return (
        <>
            <Toaster position="top-center" />
            <div className="w-full flex justify-center items-center flex-col">
                <p className="text-3xl font-semibold mt-10">Change Your Password</p>
                <div className="flex justify-center">
                    <img src={NamePagePict} className="w-72 h-64" alt="Change Password" />
                </div>
                <form className="w-3/5 flex justify-center items-center flex-col" onSubmit={handleChangePassword}>
                    <div className={`bg-zinc-200 w-3/5 rounded-lg pl-6 shadow-md flex justify-between items-center relative border-2 ${getBorderColor(passwordStrength)} ${errorPassword ? 'border-red-600' : ''}`}>
                        <div className="w-11/12 flex items-center">
                            <FontAwesomeIcon icon={faLock} className="text-zinc-400" />
                            <input
                                type={hiddenPass ? 'text' : 'password'}
                                className="bg-zinc-200 py-3 px-4 outline-none w-full"
                                placeholder="New Password"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="button" className="w-7 mr-5" onClick={() => setHiddenPass(!hiddenPass)}>
                            <FontAwesomeIcon icon={hiddenPass ? faEye : faEyeSlash} className="text-zinc-500" />
                        </button>
                    </div>
                    {errorPassword && (
                        <p className={`mt-2 ${passwordStrength === 'normal' ? 'text-orange-500' : passwordStrength === 'strong' ? 'text-green-500' : 'text-red-500'}`}>
                            {errorPassword}
                        </p>
                    )}
                    <div className={`bg-zinc-200 w-3/5 rounded-lg pl-6 shadow-md flex justify-between items-center relative border-2 ${errorConfPassword ? 'border-red-600' : 'border-none'} ${errorPassword ? 'mt-2' : 'mt-8'}`}>
                        <div className="w-11/12 flex items-center">
                            <FontAwesomeIcon icon={faLockOpen} className="text-zinc-400" />
                            <input
                                type={hiddenPassConf ? 'text' : 'password'}
                                className="bg-zinc-200 py-3 px-4 outline-none w-full"
                                placeholder="Confirm New Password"
                                value={confirmPassword}
                                onChange={(e) => setConfirmPassword(e.target.value)}
                                required
                            />
                        </div>
                        <button type="button" className="w-7 mr-5" onClick={() => setHiddenPassConf(!hiddenPassConf)}>
                            <FontAwesomeIcon icon={hiddenPassConf ? faEye : faEyeSlash} className="text-zinc-500" />
                        </button>
                    </div>
                    {errorConfPassword && <p className="text-red-500 mt-2">{errorConfPassword}</p>}
                    <button className="bg-amber-400 w-3/5 rounded-lg py-2 mt-6 font-semibold shadow-3xl border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300">
                        Change Password
                    </button>
                </form>
            </div>
        </>
    );
};

export default ChangePassword;
