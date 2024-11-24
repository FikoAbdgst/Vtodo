import React, { useEffect, useState } from 'react';
import Navbar from '../components/Navbar';
import Char from '../../public/male.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faBarsProgress, faCalendarDays, faClock, faEnvelope, faFilter, faLayerGroup, faList, faListCheck, faPen, faPlus, faSearch, faTimes, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'


const TaskList = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [currentTime, setCurrentTime] = useState('');
    const [searchButton, setSearchButton] = useState(false);
    const [showNewActivityForm, setShowNewActivityForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [category, setCategory] = useState('Pilih Kategori');

    // State for new task inputs
    const [taskName, setTaskName] = useState('');
    const [taskNote, setTaskNote] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [taskTime, setTaskTime] = useState('');

    useEffect(() => {
        console.log("Default category:", category);
    }, [category]);


    useEffect(() => {
        const storedLogin = JSON.parse(localStorage.getItem('loggedIn')) || [];
        const token = storedLogin.token;

        setName(storedLogin.named);
        setEmail(storedLogin.emailed);

        const updateTime = () => {
            const now = new Date();
            const day = now.toLocaleDateString('en-US', { weekday: 'long' });
            const date = now.toLocaleDateString('id-ID', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            });
            setCurrentTime(`${day}, ${date}`);
        };

        updateTime();
        const interval = setInterval(updateTime, 1000);

        const fetchCategories = async () => {
            try {
                const response = await axios.get('http://localhost:3000/category');
                setCategories(response.data);
            } catch (error) {
                console.error("Error fetching categories:", error);
            }
        };

        fetchCategories();

        // Check if there's a saved state for the form toggle
        const savedFormState = JSON.parse(localStorage.getItem('showNewActivityForm'));
        if (savedFormState !== null) {
            setShowNewActivityForm(savedFormState);
        }

        return () => clearInterval(interval);
    }, []);


    const handleSearchButton = () => {
        setSearchButton(!searchButton);
    };

    const toggleNewActivityForm = () => {
        const newState = !showNewActivityForm;
        setShowNewActivityForm(newState);
        // Persist the state to localStorage
        localStorage.setItem('showNewActivityForm', JSON.stringify(newState));
    };

    const handleNewCategorySubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:3000/category/create', { name: newCategoryName });
            if (response.data && response.data.category) {
                setCategories([...categories, response.data.category]);
            }

            // Reset only on category submission
            setShowNewActivityForm(false);
            setNewCategoryName('');
            setShowNewCategoryInput(false);

            // Show toast after category is added successfully
            toast.success('Category added successfully');
            setTimeout(() => {
                window.location.reload()
            }, 1000);

        } catch (error) {
            console.error("Error creating new category:", error);
        }
    };


    const handleNewCategoryChange = (e) => {
        setNewCategoryName(e.target.value);
    };

    const handleCloseNewCategory = () => {
        setCategory("Pilih Kategori");
        setShowNewCategoryInput(false);
    };

    const handleNewActivitySubmit = async (e) => {
        e.preventDefault();
        const taskData = {
            name: taskName,
            category: category,
            note: taskNote,
            date: taskDate,
            time: taskTime,
        };

        try {
            const token = JSON.parse(localStorage.getItem('loggedIn'))?.token;
            const response = await axios.post('http://localhost:3000/tasks/create', taskData, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.status === 201) {
                toast.success('Task added successfully');
                setTaskName('');
                setTaskNote('');
                setTaskDate('');
                setTaskTime('');
                setCategory('Pilih Kategori');
                setShowNewActivityForm(false);
            }
        } catch (error) {
            console.error("Error creating new task:", error);
            toast.error('Failed to add task');
        }
    };





    return (
        <>
            <div className='w-full h-screen flex items-center bg-amber-300'>
                <div className='w-3/4 h-full bg-white flex items-center rounded-r-3xl'>
                    <Navbar name={name} email={email} setShowNewActivityForm={setShowNewActivityForm} />
                    <hr className='bg-zinc-300 w-0.5 h-5/6' />

                    {!showNewActivityForm ? (
                        <div className='w-65% h-full'>

                            {/* Tampilan utama */}
                            <div className='ml-10 mt-10 mb-5 w-full h-auto flex justify-between items-center relative z-50'>
                                <div className='flex justify-center items-center bg-zinc-300 p-1 rounded-lg'>
                                    <button onClick={handleSearchButton} className='px-2 py-1'>
                                        <FontAwesomeIcon icon={faSearch} />
                                    </button>
                                    <input type='text' placeholder='Search ...' className='bg-zinc-300 px-3 py-1 outline-none' />
                                </div>
                                <div className='flex gap-5'>
                                    <button
                                        onClick={toggleNewActivityForm}
                                        className='flex justify-center items-center gap-2 rounded-lg py-2 px-4 text-sm bg-amber-400 text-white border-b-4 border-r-4 border-b-amber-500 border-r-amber-500 hover:border-b-2 hover:border-r-2 hover:bg-amber-300'>
                                        <FontAwesomeIcon icon={faPlus} />
                                        <p>New Task</p>
                                    </button>
                                </div>
                            </div>
                            <p className='text-sm text-zinc-500 ml-10'>Today is {currentTime}</p>
                            <div className='bg-zinc-200 flex w-full h-45% mt-5 ml-10 rounded-3xl relative'>
                                <div className='w-3/5 h-full p-10 flex gap-8 flex-col'>
                                    <p className='text-5xl font-medium'>Hello, {name}!</p>
                                    <p className='text-lg text-zinc-500'>What are we doing today?</p>
                                    <div className='flex gap-10 '>
                                        <div className='flex flex-col items-start gap-5'>
                                            <button className='flex gap-2 justify-center items-center'><FontAwesomeIcon icon={faArrowRightFromBracket} className='text-indigo-700' />Satu</button>
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
                    ) : (
                        <div className='w-65% h-full '>
                            <div className='ml-10 mt-8 mb-10 w-full h-auto flex justify-center items-center relative z-50'>
                                <button onClick={toggleNewActivityForm} className=' absolute right-0 bg-transparent py-2 px-4 rounded-lg  text-zinc-100 text-2xl'>
                                    <FontAwesomeIcon icon={faXmark} className='text-zinc-400' />
                                </button>
                                <div className=' w-full flex justify-center items-center '>
                                    <p className='text-2xl font-semibold bg-zinc-200 py-3 px-5 rounded-lg shadow-md shadow-zinc-300'>New <span className='text-amber-400'>Task</span></p>
                                </div>
                            </div>
                            <div className='flex w-full mt-5 ml-10 relative'>
                                <form className='w-full' onSubmit={handleNewActivitySubmit}>
                                    <div className='bg-zinc-200 rounded-3xl w-full flex justify-center items-center flex-col gap-4 p-6 relative'>
                                        <div className='bg-zinc-100 w-full rounded-lg pl-6 mt-2 shadow-md'>
                                            <FontAwesomeIcon icon={faList} className='text-zinc-400' />
                                            <input
                                                type="text"
                                                className='bg-zinc-100 py-3 pl-5 outline-none w-11/12'
                                                placeholder='Name Task'
                                                onChange={(e) => setTaskName(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className='bg-zinc-100 w-full rounded-lg pl-6 mt-2 shadow-md'>
                                            <FontAwesomeIcon icon={faLayerGroup} className='text-zinc-400' />
                                            <select
                                                className='bg-zinc-100 py-3 pl-4 w-11/12 border-none outline-none focus:ring-0 text-zinc-400'
                                                value={category}
                                                onChange={(e) => {
                                                    setCategory(e.target.value);
                                                    setShowNewCategoryInput(e.target.value === 'new');
                                                }}
                                            >
                                                <option value="Pilih Kategori" disabled className='bg-zinc-100'>Pilih Kategori</option>
                                                {categories.map((category) => (
                                                    category && category.name ? (
                                                        <option key={category.id} value={category.name}>{category.name}</option>
                                                    ) : null
                                                ))}
                                                <option value="new" className='bg-zinc-100 text-sky-500 font-semibold'> + New Category</option>
                                            </select>


                                        </div>
                                        <div className='bg-zinc-100 w-full flex items-start rounded-lg pl-6 mt-2 shadow-md'>
                                            <FontAwesomeIcon icon={faPen} className='text-zinc-400 mt-4' />
                                            <textarea
                                                className='bg-zinc-100 py-3 pl-4 w-11/12 border-none outline-none resize-none focus:ring-0'
                                                placeholder='Note'
                                                rows={3}
                                                onChange={(e) => setTaskNote(e.target.value)}
                                            />
                                        </div>
                                        <div className='bg-zinc-100 w-full rounded-lg pl-6 mt-2 shadow-md'>
                                            <FontAwesomeIcon icon={faCalendarDays} className='text-zinc-400' />
                                            <input
                                                type="date"
                                                className='bg-zinc-100 text-zinc-400 py-3 pl-5 outline-none w-11/12'
                                                placeholder='Date'
                                                onChange={(e) => setTaskDate(e.target.value)}
                                                required
                                            />
                                        </div>
                                        <div className='bg-zinc-100 w-full rounded-lg pl-6 mt-2 shadow-md'>
                                            <FontAwesomeIcon icon={faClock} className='text-zinc-400' />
                                            <input
                                                type="time"
                                                className='bg-zinc-100 text-zinc-400 py-3 pl-5 outline-none w-11/12'
                                                placeholder='Time'
                                                onChange={(e) => setTaskTime(e.target.value)}
                                                required
                                            />
                                        </div>
                                        {showNewCategoryInput && (
                                            <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50'>
                                                <div className='bg-zinc-300 w-3/4 max-w-md p-8 rounded-lg shadow-lg relative'>
                                                    <button onClick={handleCloseNewCategory} className='absolute top-3 right-3'>
                                                        <FontAwesomeIcon icon={faXmark} className='text-xl' />
                                                    </button>
                                                    <div className='flex items-center mb-4 bg-zinc-100 pl-5 rounded-lg'>
                                                        <FontAwesomeIcon icon={faPen} className='text-zinc-400 mr-2' />
                                                        <input
                                                            type="text"
                                                            value={newCategoryName}
                                                            onChange={handleNewCategoryChange}
                                                            className='bg-zinc-100 py-3 pl-3 outline-none w-full rounded-lg'
                                                            placeholder='New Category Name'
                                                        />
                                                    </div>
                                                    <button
                                                        type="button"
                                                        onClick={handleNewCategorySubmit}
                                                        className='bg-amber-400 text-white rounded-lg py-2 px-4 w-full'
                                                    >
                                                        Add Category
                                                    </button>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                    <div className='flex justify-center mt-3'>
                                        <button type="submit" className='mt-4 bg-green-500 py-2 px-4 rounded-lg border-b-4 border-b-green-800 text-zinc-100 hover:border-b-2'>Submit</button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </>

    );
};

export default TaskList;
