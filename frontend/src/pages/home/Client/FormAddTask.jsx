import React, { useState } from 'react'
import { faCalendarDays, faClock, faLayerGroup, faList, faPen, faXmark } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import axios from 'axios';
import toast from 'react-hot-toast'



const FormAddTask = ({ categories, category, setCategories, setCategory, newCategoryName, setNewCategoryName, setShowNewActivityForm, setShowNewCategoryInput, showNewCategoryInput, toggleNewActivityForm }) => {

    const [taskName, setTaskName] = useState('');
    const [taskNote, setTaskNote] = useState('');
    const [taskDate, setTaskDate] = useState('');
    const [taskTime, setTaskTime] = useState('');

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

        // Validate required fields
        if (!taskName || !category || !taskDate) {
            toast.error('Please fill in all required fields');
            return;
        }

        const taskData = {
            name: taskName,
            category: category,
            note: taskNote || '', // Provide empty string if no note
            date: taskDate,
            time: taskTime,
        };

        try {
            // Get token directly from localStorage
            const token = localStorage.getItem('token');

            if (!token) {
                toast.error('Please login first');
                return;
            }

            // Remove JSON.parse since token should be a string
            const response = await axios.post(
                'http://localhost:3000/tasks/create',
                taskData,
                {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    },
                }
            );

            if (response.status === 201) {


                // Reset form
                setTaskName('');
                setTaskNote('');
                setTaskDate('');
                setTaskTime('');
                setCategory('Pilih Kategori');
                setShowNewActivityForm(false);

                toast.success('Task added successfully');
                setTimeout(() => {
                    window.location.reload()
                }, 1000);

                // Optional: Refresh tasks list if you have one
                // await fetchTasks();
            } else {
                toast.error(response.data.message || 'Failed to add task');
            }
        } catch (error) {
            console.error("Error creating new task:", error);
            const errorMessage = error.response?.data?.message || 'Failed to add task';
            toast.error(errorMessage);

            // If token is invalid, you might want to redirect to login
            if (error.response?.status === 401) {
                toast.error('Session expired. Please login again');
                // Optional: Redirect to login page
                // window.location.href = '/login';
            }
        }
    };

    return (
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
                    <div className='bg-zinc-200 rounded-3xl w-full flex justify-center items-center flex-col gap-4 p-6 relative font-medium'>
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
                                className={`bg-zinc-100 py-3 pl-4 w-11/12 border-none outline-none focus:ring-0 ${category === "Pilih Kategori" ? 'text-zinc-400' : ' text-black'} `}
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
                        <div className='bg-zinc-100 w-full rounded-lg pl-6 mt-2 shadow-md text-black'>
                            <FontAwesomeIcon icon={faCalendarDays} className='text-zinc-400' />
                            <input
                                type="date"
                                className={`bg-zinc-100 py-3 pl-5 outline-none w-11/12 ${taskDate === '' ? 'text-zinc-400' : 'text-black'}`}
                                placeholder='Date'
                                onChange={(e) => setTaskDate(e.target.value)}
                                required
                            />
                        </div>
                        <div className='bg-zinc-100 w-full rounded-lg pl-6 mt-2 shadow-md text-black'>
                            <FontAwesomeIcon icon={faClock} className='text-zinc-400' />
                            <input
                                type="time"
                                className={`bg-zinc-100 py-3 pl-5 outline-none w-11/12 ${taskTime === '' ? 'text-zinc-400' : 'text-black'}`}
                                placeholder='Time'
                                onChange={(e) => setTaskTime(e.target.value)}
                                required
                            />
                        </div>
                        {showNewCategoryInput && (
                            <div className='fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 backdrop-blur-sm z-50'>
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
                                        className='bg-amber-400 text-white rounded-lg py-2 px-4 w-full hover:bg-amber-500'
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
    )
}

export default FormAddTask