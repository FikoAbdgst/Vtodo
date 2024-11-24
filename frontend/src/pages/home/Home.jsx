import React, { useEffect, useState } from 'react';
import Navbar from '../../components/Navbar';
import Char from '../../../public/male.png';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRightFromBracket, faCheck, faEdit, faEllipsis, faPen, faPenAlt, faPenClip, faPenRuler, faPlus, faSearch, faShare, faSpinner, faTrash, faTruckLoading, faXmark } from '@fortawesome/free-solid-svg-icons';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast'
import FormAddTask from './Client/formAddTask';


const Home = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [searchButton, setSearchButton] = useState(false);
    const [showNewActivityForm, setShowNewActivityForm] = useState(false);
    const [categories, setCategories] = useState([]);
    const [showNewCategoryInput, setShowNewCategoryInput] = useState(false);
    const [newCategoryName, setNewCategoryName] = useState('');
    const [category, setCategory] = useState('Pilih Kategori');

    const [currentTime, setCurrentTime] = useState('');
    const [todayTasks, setTodayTasks] = useState([]);
    const [missedTasksCount, setMissedTasksCount] = useState(0);
    const [scheduledTasksCount, setScheduledTasksCount] = useState(0);
    const [completedTasksCount, setCompletedTasksCount] = useState(0);

    const [selectedTask, setSelectedTask] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [showActionDropdown, setShowActionDropdown] = useState(false);
    const [showEditModal, setShowEditModal] = useState(false);
    const [showDeleteModal, setShowDeleteModal] = useState(false);
    const [editFormData, setEditFormData] = useState({
        name: '',
        category: '',
        note: '',
        date: '',
        time: ''
    });

    useEffect(() => {
        console.log("Default category:", category);
    }, [category]);

    const handleTaskClick = (task) => {
        setSelectedTask(task);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedTask(null);
    };

    useEffect(() => {
        const storedLogin = JSON.parse(localStorage.getItem('loggedIn')) || [];
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
            // const clock = now.toLocaleTimeString('id-ID', {
            //     hour: '2-digit',
            //     minute: '2-digit'
            // });
            setCurrentTime(`${day}, ${date}`);
            // setCurrentClock(clock);
        };

        updateTime();
        const fetchTodayTasks = async () => {
            try {
                const response = await axios.get('http://localhost:3000/tasks/get_task', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });
                setTodayTasks(response.data.tasks);
                setMissedTasksCount(response.data.missedTasksCount);
                setScheduledTasksCount(response.data.scheduledTasksCount);
                setCompletedTasksCount(response.data.completedTasksCount);
            } catch (error) {
                console.error('Gagal mengambil tugas hari ini', error);
            }
        };

        fetchTodayTasks();
        const checkTaskStatus = async () => {
            try {
                const response = await axios.get('http://localhost:3000/tasks/check-task-status', {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                });

                // Jika ada task yang diupdate, refresh task list
                if (response.data.updatedCount > 0) {
                    fetchTodayTasks();
                }
            } catch (error) {
                console.error('Gagal memeriksa status task', error);
            }
        };
        const interval = setInterval(updateTime && checkTaskStatus, 60000);


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

    const handleTaskStatusToggle = async (taskId, currentStatus) => {
        try {
            const response = await axios.patch(
                'http://localhost:3000/tasks/toggle-status',
                { taskId },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                // Update the task list to reflect the new status
                const updatedTasks = todayTasks.map(task => {
                    if (task.id === taskId) {
                        return {
                            ...task,
                            status: task.status === 'completed' ? 'scheduled' : 'completed'
                        };
                    }
                    return task;
                });
                setTodayTasks(updatedTasks);
                setShowModal(false)

                // Update the counts
                if (currentStatus === 'completed') {
                    setCompletedTasksCount(prev => prev - 1);
                    setScheduledTasksCount(prev => prev + 1);
                } else {
                    setCompletedTasksCount(prev => prev + 1);
                    setScheduledTasksCount(prev => prev - 1);
                }
            }
        } catch (error) {
            toast.error('Failed to update task status');
            console.error('Error toggling task status:', error);
        }
    };

    const borderColorMap = {
        'scheduled': 'bg-blue-600',
        'completed': 'bg-green-600',
        'missed': 'bg-red-600',

    };

    const borderColor = selectedTask
        ? borderColorMap[selectedTask.status] || borderColorMap['scheduled']
        : borderColorMap['scheduled'];

    const handleEditClick = () => {
        setEditFormData({
            name: selectedTask.name,
            category: selectedTask.category,
            note: selectedTask.note || '',
            date: new Date(selectedTask.date).toISOString().split('T')[0],
            time: selectedTask.time
        });
        setShowEditModal(true);
        setShowActionDropdown(false);
    };

    const handleDeleteClick = () => {
        setShowDeleteModal(true);
        setShowActionDropdown(false);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.patch(
                `http://localhost:3000/tasks/update/${selectedTask.id}`,
                {
                    name: editFormData.name,
                    category: editFormData.category,
                    note: editFormData.note,
                    date: editFormData.date,
                    time: editFormData.time
                },
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Task updated successfully');
                // Update the task in the local state
                const updatedTasks = todayTasks.map(task =>
                    task.id === selectedTask.id ? response.data.task : task
                );
                setTodayTasks(updatedTasks);
                setShowEditModal(false);
                setShowModal(false);
                setSelectedTask(response.data.task);
            }
        } catch (error) {
            toast.error('Failed to update task');
            console.error('Error updating task:', error);
        }
    };

    const handleDelete = async () => {
        try {
            const response = await axios.delete(
                `http://localhost:3000/tasks/delete/${selectedTask.id}`,
                {
                    headers: {
                        'Authorization': `Bearer ${localStorage.getItem('token')}`
                    }
                }
            );

            if (response.data.success) {
                toast.success('Task deleted successfully');
                const updatedTasks = todayTasks.filter(task => task.id !== selectedTask.id);
                setTodayTasks(updatedTasks);
                setShowDeleteModal(false);
                setShowModal(false);
            }
        } catch (error) {
            toast.error('Failed to delete task');
            console.error('Error deleting task:', error);
        }
    };

    return (
        <>
            <Toaster />
            <div className='w-full h-screen flex items-center bg-amber-300'>
                <div className='w-3/4 h-full bg-gray-100 flex items-center rounded-r-3xl'>
                    <Navbar name={name} email={email} setShowNewActivityForm={setShowNewActivityForm} />
                    <hr className='bg-zinc-300 w-0.5 h-5/6' />


                    {!showNewActivityForm ? (
                        <div className='w-65% h-full'>

                            {/* Tampilan utama */}
                            <div className='ml-10 mt-6 mb-4 w-full h-auto flex justify-between items-center relative z-50'>
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
                            <div className='bg-zinc-200 flex w-full h-45% mt-4 ml-10 rounded-3xl relative shadow-md shadow-gray-300'>
                                <div className='w-3/5 h-full p-8 flex gap-8 flex-col'>
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
                                <div className='flex justify-between items-center'>
                                    <p className='font-semibold'>Tasks for today</p>
                                </div>
                                <div className='flex relative gap-14'>
                                    <div className='space-y-3 mt-2 w-3/5 '>
                                        {todayTasks.map((task, index) => {
                                            const colors = ['border-l-orange-500', 'border-l-sky-300', 'border-l-purple-600'];
                                            const borderColor = colors[index % colors.length];

                                            return (
                                                <div
                                                    key={task.id}
                                                    className={`py-3 px-5 rounded-xl flex justify-between items-center shadow-md shadow-gray-300 hover:scale-105 transition-all duration-150 bg-zinc-200 border-l-8 ${borderColor} cursor-pointer`}
                                                    onClick={() => handleTaskClick(task)}
                                                >
                                                    <div className='space-y-1'>
                                                        <p className='font-medium'>{task.name}</p>
                                                        <p className='text-sm text-zinc-500'>
                                                            {task.category} | <span className='font-bold'>{task.time}</span>
                                                        </p>
                                                    </div>
                                                    <button
                                                        className={`w-5 h-5 border-2  rounded-full bg-transparent 
                                                              text-white ${task.status === 'completed' ? 'bg-blue-900 border-blue-900' : 'border-zinc-400 hover:bg-zinc-400'}`}
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            handleTaskStatusToggle(task.id, task.status);
                                                        }}
                                                    >{task.status === 'completed' ? (<FontAwesomeIcon icon={faCheck} className='text-xs mb-1' />) : ''}</button>
                                                </div>
                                            );
                                        })}
                                    </div>
                                    <div className='flex justify-center items-center w-2/5  flex-col'>
                                        {missedTasksCount >= 0 && (
                                            <div className='space-y-4 text-center mt-10'>
                                                <p className='font-semibold'>Statistics</p>
                                                <div className='flex gap-2 w-full'>
                                                    <div className=' w-24 text-blue-500 font-medium text-sm bg-blue-200 rounded-lg shadow-md shadow-gray-300 flex justify-between flex-col p-3 gap-2'>
                                                        <p className='text-3xl'> {scheduledTasksCount}</p>
                                                        <p className='text-xs'>Scheduled</p>
                                                    </div>
                                                    <div className='w-24 text-red-500 font-medium text-sm bg-red-200 rounded-lg shadow-md shadow-gray-300 flex justify-between flex-col p-3 gap-2'>
                                                        <p className='text-3xl'> {missedTasksCount}</p>
                                                        <p className='text-xs'>Missed</p>
                                                    </div>
                                                    <div className='w-24 text-green-500 font-medium text-sm bg-green-200 rounded-lg shadow-md shadow-gray-300 flex justify-between flex-col p-3 gap-2'>
                                                        <p className='text-3xl'> {completedTasksCount}</p>
                                                        <p className='text-xs'>Completed</p>
                                                    </div>
                                                </div>
                                                <button className="text-blue-600 text-base font-medium relative group">
                                                    View all
                                                    <span
                                                        className="absolute left-0 bottom-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"
                                                    ></span>
                                                </button>


                                            </div>


                                        )}
                                    </div>
                                </div>



                            </div>
                        </div>
                    ) : (
                        <FormAddTask
                            categories={categories}
                            category={category}
                            setCategories={setCategories}
                            setCategory={setCategory}
                            newCategoryName={newCategoryName}
                            setNewCategoryName={setNewCategoryName}
                            setShowNewActivityForm={setShowNewActivityForm}
                            setShowNewCategoryInput={setShowNewCategoryInput}
                            showNewCategoryInput={showNewCategoryInput}
                            toggleNewActivityForm={toggleNewActivityForm}
                        />
                    )}
                </div>

            </div>
            {showModal && selectedTask && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-2/5 relative z-10">

                        <div className="flex justify-between items-center text-gray-500 hover:text-gray-700">
                            <p className="text-sm font-bold">Activity Detail</p>
                            <div className="flex gap-5 relative">
                                <button
                                    className=""
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        setShowActionDropdown(!showActionDropdown);
                                    }}
                                >
                                    <FontAwesomeIcon icon={faEllipsis} />
                                </button>
                                {showActionDropdown && (
                                    <div className="absolute right-0 top-6 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-50">
                                        <div className="py-1">
                                            <button
                                                onClick={handleEditClick}
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                            >
                                                <FontAwesomeIcon icon={faEdit} className="mr-2" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={handleDeleteClick}
                                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-gray-100 w-full"
                                            >
                                                <FontAwesomeIcon icon={faTrash} className="mr-2" />
                                                Delete
                                            </button>
                                            <button
                                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full"
                                            >
                                                <FontAwesomeIcon icon={faShare} className="mr-2" />
                                                Share
                                            </button>
                                        </div>
                                    </div>
                                )}
                                <button onClick={handleCloseModal} className="">
                                    <FontAwesomeIcon icon={faXmark} />
                                </button>
                            </div>
                        </div>
                        <div className="w-full mt-2 p-5 rounded-xl  bg-zinc-200">
                            <div className='w-full flex justify-between items-start'>
                                <div className='w-1/2'>
                                    <p className="text-2xl font-bold ">{selectedTask.name}</p>
                                    <p className=' font-semibold text-gray-500'>{selectedTask.category}</p>
                                    <p className={`w-3/5 capitalize mt-2 text-center p-1 rounded-lg text-white ${borderColor}`}>{selectedTask.status}</p>

                                </div>
                                <div className=' w-1/2 text-end'>
                                    <p className="text-xs font-bold text-gray-500 ">DUE DATE</p>
                                    <p className='text-sm font-semibold'>
                                        {new Date(selectedTask.date).toLocaleDateString("id-ID", {
                                            weekday: "short",
                                            day: "2-digit",
                                            month: "short",
                                            year: "numeric",


                                        })}
                                    </p>
                                    <p className='text-sm font-semibold'>{selectedTask.time}</p>
                                </div>
                            </div>

                            {selectedTask.note ? (
                                <div className=' w-full mt-5'>
                                    <p className="text-black text-sm font-bold"> Notes</p>
                                    <textarea className='w-full py-2 px-4 rounded-lg bg-zinc-300 overflow-hidden' disabled name="" id="" cols="30" rows="3" >{selectedTask.note}</textarea>
                                    <div ></div>
                                </div>
                            ) :
                                (
                                    <p>Tidak ada Notes</p>
                                )
                            }
                            <div className="mt-4 flex justify-end">
                                <button
                                    onClick={() => handleTaskStatusToggle(selectedTask.id, selectedTask.status)}
                                    className={`px-4 py-2 rounded-lg shadow-md shadow-zinc-300 text-white ${selectedTask.status === 'completed'
                                        ? 'bg-yellow-500 hover:bg-yellow-600'
                                        : 'bg-green-500 hover:bg-green-600'
                                        }`}
                                >
                                    {selectedTask.status === 'completed' ? 'Cancel Complete Task' : 'Complete Task'}
                                </button>
                            </div>

                        </div>

                    </div>
                </div>
            )}

            {/* Edit Modal */}
            {showEditModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-2/5">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-lg font-bold">Edit Task</h2>
                            <button onClick={() => setShowEditModal(false)}>
                                <FontAwesomeIcon icon={faXmark} />
                            </button>
                        </div>
                        <form onSubmit={handleEditSubmit}>
                            <div className="space-y-4">
                                <div>
                                    <label className="ml-1 block text-sm font-semibold text-gray-700">Name</label>
                                    <input
                                        type="text"
                                        value={editFormData.name}
                                        onChange={(e) => setEditFormData({ ...editFormData, name: e.target.value })}
                                        className="w-full py-2 px-3 border-none outline-none bg-zinc-200 rounded-lg font-medium"
                                    />
                                </div>
                                <div>
                                    <label className="ml-1 block text-sm font-semibold text-gray-700">Category</label>
                                    <select
                                        value={editFormData.category}
                                        onChange={(e) => setEditFormData({ ...editFormData, category: e.target.value })}
                                        className="w-full py-2 px-3 border-none outline-none bg-zinc-200 rounded-lg font-medium"
                                    >
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.name}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                </div>
                                <div>
                                    <label className="ml-1 block text-sm font-semibold text-gray-700">Note</label>
                                    <textarea
                                        value={editFormData.note}
                                        onChange={(e) => setEditFormData({ ...editFormData, note: e.target.value })}
                                        className="w-full py-2 px-3 border-none outline-none bg-zinc-200 rounded-lg font-medium"
                                        rows="3"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="ml-1 block text-sm font-semibold text-gray-700">Date</label>
                                        <input
                                            type="date"
                                            value={editFormData.date}
                                            onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                                            className="w-full py-2 px-3 border-none outline-none bg-zinc-200 rounded-lg font-medium"
                                        />
                                    </div>
                                    <div>
                                        <label className="ml-1 block text-sm font-semibold text-gray-700">Time</label>
                                        <input
                                            type="time"
                                            value={editFormData.time}
                                            onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                                            className="w-full py-2 px-3 border-none outline-none bg-zinc-200 rounded-lg font-medium"
                                        />
                                    </div>
                                </div>
                            </div>
                            <div className="mt-6 flex justify-end space-x-3">
                                <button
                                    type="button"
                                    onClick={() => setShowEditModal(false)}
                                    className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                                >
                                    Cancel
                                </button>
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                                >
                                    Save Changes
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50">
                    <div className="bg-white rounded-lg p-6 w-96">
                        <div className="text-center">
                            <h3 className="text-lg font-medium text-gray-900 mb-4">Delete Task</h3>
                            <p className="text-sm text-gray-500">
                                Are you sure you want to delete this task?
                            </p>
                        </div>
                        <div className="mt-6 flex justify-end space-x-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDelete}
                                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>

    );
};

export default Home;
